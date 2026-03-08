import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { db } from '../db/client.ts';
import { requireAuth } from '../middleware/auth.ts';
import { validate } from '../middleware/validate.ts';

const router = Router();

// GET /api/president/clubs — get clubs managed by this user
router.get('/clubs', requireAuth, async (req: Request, res: Response) => {
  const userId = res.locals.user.sub as string;

  try {
    const { rows } = await db.query(
      `SELECT id, name, slug, description, category, logo_url, member_count, is_active, created_at
       FROM clubs
       WHERE admin_id = $1 AND is_active = true
       ORDER BY name ASC`,
      [userId]
    );
    res.json({ data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/president/clubs/:clubId/events — get events for a managed club
router.get('/clubs/:clubId/events', requireAuth, async (req: Request, res: Response) => {
  const userId = res.locals.user.sub as string;
  const { clubId } = req.params;

  try {
    // 1. Verify ownership
    const { rows: clubs } = await db.query(
      'SELECT id FROM clubs WHERE id = $1 AND admin_id = $2 LIMIT 1',
      [clubId, userId]
    );

    if (clubs.length === 0) {
      res.status(403).json({ error: 'Forsaken: you do not manage this club or it does not exist' });
      return;
    }

    // 2. Fetch events
    const { rows: events } = await db.query(
      `SELECT id, title, description, event_date, location, total_seats, registered_count, status, banner_url, created_at
       FROM events
       WHERE club_id = $1
       ORDER BY event_date DESC`,
      [clubId]
    );

    res.json({ data: events });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const createEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  event_date: z.string().datetime(),
  location: z.string().min(2).max(255),
  total_seats: z.number().int().positive(),
  banner_url: z.string().url().optional().or(z.literal('')),
});

// POST /api/president/clubs/:clubId/events — create an event for a managed club
router.post('/clubs/:clubId/events', requireAuth, validate(createEventSchema), async (req: Request, res: Response) => {
  const userId = res.locals.user.sub as string;
  const { clubId } = req.params;
  const body = req.body as z.infer<typeof createEventSchema>;

  try {
    // Verify ownership
    const { rows: clubs } = await db.query(
      'SELECT id FROM clubs WHERE id = $1 AND admin_id = $2 LIMIT 1',
      [clubId, userId]
    );

    if (clubs.length === 0) {
      res.status(403).json({ error: 'Forbidden: you do not manage this club or it does not exist' });
      return;
    }

    const bannerUrl = body.banner_url || null;

    const { rows } = await db.query(
      `INSERT INTO events
         (title, club_id, description, event_date, location, total_seats, status, banner_url)
       VALUES ($1, $2, $3, $4, $5, $6, 'upcoming', $7)
       RETURNING id, title, description, event_date, location, total_seats, status, banner_url, created_at`,
      [body.title, clubId, body.description, body.event_date, body.location, body.total_seats, bannerUrl]
    );

    res.status(201).json({ data: rows[0] });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const updateEventSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10),
  event_date: z.string().datetime(),
  location: z.string().min(2).max(255),
  total_seats: z.number().int().positive(),
  banner_url: z.string().url().optional().or(z.literal('')),
});

// PUT /api/president/events/:eventId — update an event (must be admin of the club)
router.put('/events/:eventId', requireAuth, validate(updateEventSchema), async (req: Request, res: Response) => {
  const userId = res.locals.user.sub as string;
  const { eventId } = req.params;
  const body = req.body as z.infer<typeof updateEventSchema>;

  try {
    // Verify ownership via event -> club -> admin_id
    const { rows: events } = await db.query(
      `SELECT e.id
       FROM events e
       JOIN clubs c ON c.id = e.club_id
       WHERE e.id = $1 AND c.admin_id = $2
       LIMIT 1`,
      [eventId, userId]
    );

    if (events.length === 0) {
      res.status(403).json({ error: 'Forbidden: you do not manage the club for this event or it does not exist' });
      return;
    }

    const bannerUrl = body.banner_url || null;

    const { rows: updatedRows } = await db.query(
      `UPDATE events
       SET title = $1, description = $2, event_date = $3, location = $4, total_seats = $5, banner_url = $6
       WHERE id = $7
       RETURNING id, title, description, event_date, location, total_seats, status, banner_url, updated_at`,
      [body.title, body.description, body.event_date, body.location, body.total_seats, bannerUrl, eventId]
    );

    res.json({ data: updatedRows[0] });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
