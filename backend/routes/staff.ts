import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db } from '../db/client.ts';
import { requireRole } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';

const router = Router();

// All staff routes require the 'staff' role
router.use(requireRole('staff'));

// ── GET /api/staff/clubs ─────────────────────────────────────
// List ALL clubs (including inactive) with admin/president info
router.get('/clubs', async (_req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT
        c.id, c.name, c.slug, c.description, c.category,
        c.logo_url, c.member_count, c.is_active, c.created_at,
        u.id   AS admin_id,
        u.name AS admin_name,
        u.email AS admin_email,
        -- president = membership with role 'admin' inside the club
        pu.id   AS president_id,
        pu.name AS president_name,
        pu.email AS president_email
      FROM clubs c
      LEFT JOIN users u  ON u.id = c.admin_id
      LEFT JOIN memberships m ON m.club_id = c.id AND m.role = 'admin'
      LEFT JOIN users pu ON pu.id = m.user_id
      ORDER BY c.name ASC
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/staff/clubs/:id ─────────────────────────────────
router.get('/clubs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT
        c.id, c.name, c.slug, c.description, c.category,
        c.logo_url, c.member_count, c.is_active, c.created_at,
        u.id AS admin_id, u.name AS admin_name, u.email AS admin_email
      FROM clubs c
      LEFT JOIN users u ON u.id = c.admin_id
      WHERE c.id = $1
      LIMIT 1
    `, [id]);

    if (rows.length === 0) {
      res.status(404).json({ error: 'Club not found' });
      return;
    }
    res.json({ data: rows[0] });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PATCH /api/staff/clubs/:id ───────────────────────────────
// Edit club details (name, description, category, logo_url, is_active)
const editClubSchema = z.object({
  name:        z.string().min(2).max(150).optional(),
  description: z.string().min(10).optional(),
  category:    z.string().min(2).max(60).optional(),
  logo_url:    z.string().url().nullable().optional(),
  is_active:   z.boolean().optional(),
});

router.patch('/clubs/:id', validate(editClubSchema), async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body as z.infer<typeof editClubSchema>;

  // Build dynamic SET clause
  const sets: string[] = [];
  const params: unknown[] = [];

  if (fields.name        !== undefined) { params.push(fields.name);        sets.push(`name = $${params.length}`); }
  if (fields.description !== undefined) { params.push(fields.description); sets.push(`description = $${params.length}`); }
  if (fields.category    !== undefined) { params.push(fields.category);    sets.push(`category = $${params.length}`); }
  if (fields.logo_url    !== undefined) { params.push(fields.logo_url);    sets.push(`logo_url = $${params.length}`); }
  if (fields.is_active   !== undefined) { params.push(fields.is_active);   sets.push(`is_active = $${params.length}`); }

  if (sets.length === 0) {
    res.status(400).json({ error: 'No fields to update' });
    return;
  }

  params.push(id);
  try {
    const { rows } = await db.query(
      `UPDATE clubs SET ${sets.join(', ')}, updated_at = NOW()
       WHERE id = $${params.length}
       RETURNING id, name, slug, description, category, logo_url, member_count, is_active`,
      params
    );
    if (rows.length === 0) {
      res.status(404).json({ error: 'Club not found' });
      return;
    }
    res.json({ data: rows[0] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('unique')) {
      res.status(409).json({ error: 'Club name already taken' });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/staff/clubs/:id/members ────────────────────────
// List all members of a club
router.get('/clubs/:id/members', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT m.id, m.role, m.joined_at,
             u.id AS user_id, u.name, u.email, u.student_id, u.avatar_url
      FROM memberships m
      JOIN users u ON u.id = m.user_id
      WHERE m.club_id = $1
      ORDER BY m.role DESC, m.joined_at ASC
    `, [id]);
    res.json({ data: rows });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PUT /api/staff/clubs/:id/president ──────────────────────
// Assign a new club president (sets one member to role='admin',
// demotes the old one to 'member', updates clubs.admin_id)
const assignPresidentSchema = z.object({
  user_id: z.string().uuid(),
});

router.put('/clubs/:id/president', validate(assignPresidentSchema), async (req: Request, res: Response) => {
  const { id: clubId } = req.params;
  const { user_id: newPresidentId } = req.body as z.infer<typeof assignPresidentSchema>;

  try {
    // Verify user is a member of the club
    const { rows: membership } = await db.query(
      'SELECT id FROM memberships WHERE club_id = $1 AND user_id = $2 LIMIT 1',
      [clubId, newPresidentId]
    );
    if (membership.length === 0) {
      res.status(400).json({ error: 'User must be a member of the club first' });
      return;
    }

    // Transaction: demote old admin(s) → promote new president → update clubs.admin_id
    await db.query('BEGIN');

    // Demote any existing club-level admins to 'member'
    await db.query(
      `UPDATE memberships SET role = 'member'
       WHERE club_id = $1 AND role = 'admin' AND user_id != $2`,
      [clubId, newPresidentId]
    );

    // Promote new president
    await db.query(
      `UPDATE memberships SET role = 'admin'
       WHERE club_id = $1 AND user_id = $2`,
      [clubId, newPresidentId]
    );

    // Update clubs.admin_id
    await db.query(
      `UPDATE clubs SET admin_id = $1, updated_at = NOW() WHERE id = $2`,
      [newPresidentId, clubId]
    );

    await db.query('COMMIT');

    const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.student_id FROM users u WHERE u.id = $1`,
      [newPresidentId]
    );
    res.json({ data: { message: 'President updated', president: rows[0] } });
  } catch {
    await db.query('ROLLBACK');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/staff/users ─────────────────────────────────────
// Search users by name, email OR student_id (exact on student_id)
router.get('/users', async (req: Request, res: Response) => {
  const { search, student_id } = req.query as { search?: string; student_id?: string };
  try {
    const { rows } = await db.query(`
      SELECT id, student_id, name, email, role, is_active, avatar_url
      FROM users
      WHERE (
        $1::text IS NULL OR
        name       ILIKE $1 OR
        email      ILIKE $1 OR
        student_id ILIKE $1
      )
      AND ($2::text IS NULL OR student_id = $2)
      ORDER BY name ASC
      LIMIT 30
    `, [search ? `%${search}%` : null, student_id ?? null]);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── POST /api/staff/clubs ────────────────────────────────────
// Create a new club (staff only). The first president is optional.
const createClubSchema = z.object({
  name:        z.string().min(2).max(150),
  description: z.string().min(10),
  category:    z.string().min(2).max(60),
  logo_url:    z.string().url().nullable().optional(),
  admin_id:    z.string().uuid(), // initial club admin / president
});

router.post('/clubs', validate(createClubSchema), async (req: Request, res: Response) => {
  const { name, description, category, logo_url, admin_id } =
    req.body as z.infer<typeof createClubSchema>;

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);

  try {
    // Verify admin user exists
    const { rows: userRows } = await db.query(
      'SELECT id FROM users WHERE id = $1 LIMIT 1',
      [admin_id]
    );
    if (userRows.length === 0) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    await db.query('BEGIN');

    // Ensure slug uniqueness by appending a suffix if needed
    let finalSlug = slug;
    const { rows: slugCheck } = await db.query(
      'SELECT slug FROM clubs WHERE slug LIKE $1 ORDER BY slug',
      [`${slug}%`]
    );
    if (slugCheck.length > 0) {
      finalSlug = `${slug}-${slugCheck.length + 1}`;
    }

    // Insert club
    const { rows: clubRows } = await db.query(`
      INSERT INTO clubs (name, slug, description, category, logo_url, admin_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, slug, description, category, logo_url, member_count, is_active, created_at
    `, [name, finalSlug, description, category, logo_url ?? null, admin_id]);

    const club = clubRows[0];

    // Add the admin as a member with role 'admin'
    await db.query(`
      INSERT INTO memberships (club_id, user_id, role)
      VALUES ($1, $2, 'admin')
      ON CONFLICT (club_id, user_id) DO UPDATE SET role = 'admin'
    `, [club.id, admin_id]);

    // Update member_count
    await db.query(
      `UPDATE clubs SET member_count = 1 WHERE id = $1`,
      [club.id]
    );

    await db.query('COMMIT');

    res.status(201).json({ data: club });
  } catch (err: unknown) {
    await db.query('ROLLBACK');
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('unique') || msg.includes('duplicate')) {
      res.status(409).json({ error: 'Club name or slug already exists' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
