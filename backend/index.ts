import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.ts';
import clubsRouter from './routes/clubs.ts';
import eventsRouter from './routes/events.ts';
import rsvpsRouter from './routes/rsvps.ts';
import dashboardRouter from './routes/dashboard.ts';
import presidentRouter from './routes/president.ts';
import staffRouter from './routes/staff.ts';
import statsRouter from './routes/stats.ts';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// ── Middleware ──────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/clubs', clubsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/events', rsvpsRouter);   // RSVP sub-routes: /api/events/:id/rsvp
app.use('/api/dashboard', dashboardRouter);
app.use('/api/president', presidentRouter);
app.use('/api/staff', staffRouter);
app.use('/api/stats', statsRouter);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Athens Connect API running on http://localhost:${PORT}`);
});
