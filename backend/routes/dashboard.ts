import { Router, type Request, type Response } from 'express';
import { db } from '../db/client.ts';
import { requireAuth } from '../middleware/auth.ts';

const router = Router();

// GET /api/dashboard/me — user's clubs, RSVPs, and activity
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  const userId = res.locals.user.sub as string;

  try {
    const [{ rows: userRows }, { rows: memberships }, { rows: rsvps }] = await Promise.all([
      db.query(
        `SELECT id, student_id, name, email, role, avatar_url, created_at
         FROM users WHERE id = $1 LIMIT 1`,
        [userId]
      ),
      db.query(
        `SELECT m.id, m.club_id, m.role, m.joined_at,
                c.name AS club_name, c.slug, c.category, c.logo_url, c.member_count
         FROM memberships m
         JOIN clubs c ON c.id = m.club_id
         WHERE m.user_id = $1
         ORDER BY m.joined_at DESC`,
        [userId]
      ),
      db.query(
        `SELECT r.id, r.event_id, r.status, r.created_at,
                e.title AS event_title, e.event_date, e.location, e.status AS event_status
         FROM rsvps r
         JOIN events e ON e.id = r.event_id
         WHERE r.user_id = $1
         ORDER BY e.event_date ASC`,
        [userId]
      ),
    ]);

    if (userRows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      data: {
        user: userRows[0],
        memberships,
        rsvps,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
