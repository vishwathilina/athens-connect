import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { db } from '../db/client.ts';
import { validate } from '../middleware/validate.ts';

const router = Router();

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
);
const JWT_REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? 'fallback-refresh-secret-change-in-production'
);

async function signAccessToken(userId: string, role: string): Promise<string> {
  return new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET);
}

async function signRefreshToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET);
}

const registerSchema = z.object({
  student_id: z.string().min(4).max(20),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', validate(registerSchema), async (req: Request, res: Response) => {
  const { student_id, name, email, password } = req.body as z.infer<typeof registerSchema>;

  try {
    // Check for existing email or student_id
    const { rows: existing } = await db.query(
      'SELECT id FROM users WHERE email = $1 OR student_id = $2 LIMIT 1',
      [email, student_id]
    );
    if (existing.length > 0) {
      res.status(409).json({ error: 'Email or student ID already registered' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 12);

    const { rows } = await db.query(
      `INSERT INTO users (student_id, name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, student_id, name, email, role, avatar_url, created_at`,
      [student_id, name, email, password_hash]
    );
    const user = rows[0];

    const accessToken = await signAccessToken(user.id, user.role);
    const refreshToken = await signRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ data: { user, accessToken } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body as z.infer<typeof loginSchema>;

  try {
    const { rows } = await db.query(
      `SELECT id, student_id, name, email, password_hash, role, avatar_url, created_at
       FROM users WHERE email = $1 AND is_active = true LIMIT 1`,
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const accessToken = await signAccessToken(user.id, user.role);
    const refreshToken = await signRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password_hash: _omit, ...safeUser } = user;
    res.json({ data: { user: safeUser, accessToken } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET);
    const userId = payload.sub as string;

    const { rows } = await db.query(
      'SELECT id, role FROM users WHERE id = $1 AND is_active = true LIMIT 1',
      [userId]
    );
    if (rows.length === 0) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const user = rows[0];
    const accessToken = await signAccessToken(user.id, user.role);
    res.json({ data: { accessToken } });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'lax' });
  res.json({ data: { message: 'Logged out' } });
});

export default router;
