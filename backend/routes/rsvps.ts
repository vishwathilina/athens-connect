import { Router, type Request, type Response } from 'express';
import { db } from '../db/client.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

// POST /api/events/:id/rsvp — RSVP to an event (auth required)
router.post('/:id/rsvp', requireAuth, async (req: Request, res: Response) => {
  const { id: eventId } = req.params;
  const userId = res.locals.user.sub as string;

  try {
    // Use the stored procedure that handles race conditions and seat limits
    const { rows } = await db.query('SELECT fn_rsvp_for_event($1, $2) AS result', [userId, eventId]);
    const result = rows[0]?.result as string | undefined;

    if (result === 'confirmed') {
      res.status(201).json({ data: { status: 'confirmed' } });
    } else if (result === 'waitlisted') {
      res.status(201).json({ data: { status: 'waitlisted' } });
    } else if (result === 'already_rsvped') {
      res.status(409).json({ error: 'Already RSVP\'d to this event' });
    } else if (result === 'event_not_found') {
      res.status(404).json({ error: 'Event not found' });
    } else {
      res.status(500).json({ error: 'Could not complete RSVP' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/events/:id/rsvp — cancel RSVP (auth required)
router.delete('/:id/rsvp', requireAuth, async (req: Request, res: Response) => {
  const { id: eventId } = req.params;
  const userId = res.locals.user.sub as string;

  try {
    const { rows: result } = await db.query(
      `DELETE FROM rsvps WHERE user_id = $1 AND event_id = $2 RETURNING id`,
      [userId, eventId]
    );

    if (result.length === 0) {
      res.status(404).json({ error: 'RSVP not found' });
      return;
    }

    await db.query(
      'UPDATE events SET registered_count = GREATEST(registered_count - 1, 0) WHERE id = $1',
      [eventId]
    );

    res.json({ data: { message: 'RSVP cancelled' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
