import { Router, type Request, type Response } from 'express';
import { db } from '../db/client.ts';

const router = Router();

// GET /api/stats — public platform-wide counts
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { rows } = await db.query(`
      SELECT
        (SELECT COUNT(*)            FROM users)                          AS total_members,
        (SELECT COUNT(*)            FROM clubs   WHERE is_active = true) AS active_clubs,
        (SELECT COUNT(*)            FROM clubs)                          AS total_clubs,
        (SELECT COUNT(*)            FROM events  WHERE status = 'upcoming') AS upcoming_events,
        (SELECT COALESCE(SUM(member_count), 0) FROM clubs WHERE is_active = true) AS total_memberships
    `);
    res.json({ data: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
