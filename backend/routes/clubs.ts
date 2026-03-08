import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db } from '../db/client.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

// GET /api/clubs — list all active clubs, optional ?category= and ?search= filters
router.get('/', async (req: Request, res: Response) => {
  const { category, search } = req.query as Record<string, string | undefined>;

  try {
    let query = `
      SELECT id, name, slug, description, category, logo_url, member_count, is_active
      FROM clubs
      WHERE is_active = true
    `;
    const params: string[] = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }

    query += ' ORDER BY name ASC';

    const { rows } = await db.query(query, params);
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/clubs/:slug — single club detail
router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT c.id, c.name, c.slug, c.description, c.category, c.logo_url,
              c.member_count, c.is_active, c.created_at,
              u.name AS admin_name
       FROM clubs c
       LEFT JOIN users u ON u.id = c.admin_id
       WHERE c.slug = $1 AND c.is_active = true
       LIMIT 1`,
      [slug]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Club not found' });
      return;
    }

    res.json({ data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/clubs/:id/join — join a club (auth required)
router.post('/:id/join', requireAuth, async (req: Request, res: Response) => {
  const { id: clubId } = req.params;
  const userId = res.locals.user.sub as string;

  try {
    // Check club exists
    const { rows: clubs } = await db.query(
      'SELECT id FROM clubs WHERE id = $1 AND is_active = true LIMIT 1',
      [clubId]
    );
    if (clubs.length === 0) {
      res.status(404).json({ error: 'Club not found' });
      return;
    }

    // Check already a member
    const { rows: existing } = await db.query(
      'SELECT id FROM memberships WHERE user_id = $1 AND club_id = $2 LIMIT 1',
      [userId, clubId]
    );
    if (existing.length > 0) {
      res.status(409).json({ error: 'Already a member of this club' });
      return;
    }

    const { rows } = await db.query(
      `INSERT INTO memberships (user_id, club_id)
       VALUES ($1, $2)
       RETURNING id, user_id, club_id, role, joined_at`,
      [userId, clubId]
    );

    await db.query(
      'UPDATE clubs SET member_count = member_count + 1 WHERE id = $1',
      [clubId]
    );

    res.status(201).json({ data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/clubs/:id/join — leave a club (auth required)
router.delete('/:id/join', requireAuth, async (req: Request, res: Response) => {
  const { id: clubId } = req.params;
  const userId = res.locals.user.sub as string;

  try {
    const { rows: result } = await db.query(
      'DELETE FROM memberships WHERE user_id = $1 AND club_id = $2 RETURNING id',
      [userId, clubId]
    );

    if (result.length === 0) {
      res.status(404).json({ error: 'Membership not found' });
      return;
    }

    await db.query(
      'UPDATE clubs SET member_count = GREATEST(member_count - 1, 0) WHERE id = $1',
      [clubId]
    );

    res.json({ data: { message: 'Left club successfully' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
