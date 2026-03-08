import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db } from '../db/client.ts';
import { requireAuth } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';

const router = Router();

// GET /api/events — list events with optional ?category=, ?status=, ?search= filters
router.get('/', async (req: Request, res: Response) => {
  const { category, status, search } = req.query as Record<string, string | undefined>;

  try {
    let query = `
      SELECT e.id, e.title, e.club_id, c.name AS club_name,
             e.description, e.event_date, e.location,
             e.total_seats, e.registered_count, e.status, e.banner_url
      FROM events e
      LEFT JOIN clubs c ON c.id = e.club_id
      WHERE 1=1
    `;
    const params: string[] = [];

    if (category) {
      params.push(category);
      query += ` AND c.category = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND e.status = $${params.length}`;
    } else {
      query += ` AND e.status IN ('upcoming', 'ongoing')`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (e.title ILIKE $${params.length} OR e.description ILIKE $${params.length})`;
    }

    query += ' ORDER BY e.event_date ASC';

    const { rows } = await db.query(query, params);
    res.json({ data: rows });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/events/:id — single event detail
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT e.id, e.title, e.club_id, c.name AS club_name,
              e.description, e.event_date, e.location,
              e.total_seats, e.registered_count, e.status, e.banner_url,
              e.created_at
       FROM events e
       LEFT JOIN clubs c ON c.id = e.club_id
       WHERE e.id = $1
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }

    res.json({ data: rows[0] });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const proposeSchema = z.object({
  club_id: z.string().uuid(),
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  proposed_date: z.string().datetime(),
  location: z.string().min(2).max(255),
  expected_seats: z.number().int().positive(),
});

// POST /api/events/propose — submit an event proposal (auth required)
router.post('/propose', requireAuth, validate(proposeSchema), async (req: Request, res: Response) => {
  const userId = res.locals.user.sub as string;
  const body = req.body as z.infer<typeof proposeSchema>;

  try {
    const { rows } = await db.query(
      `INSERT INTO event_proposals
         (proposed_by, club_id, title, description, proposed_date, location, expected_seats)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, status, created_at`,
      [userId, body.club_id, body.title, body.description, body.proposed_date, body.location, body.expected_seats]
    );

    res.status(201).json({ data: rows[0] });
  } catch {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
