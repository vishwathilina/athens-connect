import { type Request, type Response, type NextFunction } from 'express';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'fallback-secret-change-in-production'
);

export interface AuthLocals {
  user: {
    sub: string;
    role: string;
  };
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Unauthorised' });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    res.locals.user = { sub: payload.sub as string, role: payload.role as string };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/** Middleware factory — require a specific role (or one of several roles). */
export const requireRole = (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // First run requireAuth to populate res.locals.user
    await requireAuth(req, res, async () => {
      if (!roles.includes(res.locals.user?.role)) {
        res.status(403).json({ error: 'Forbidden — insufficient role' });
        return;
      }
      next();
    });
  };
