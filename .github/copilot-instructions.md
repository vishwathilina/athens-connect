# Athens Connect — GitHub Copilot Instructions

> **Project**: Athens Connect — NSBM Green University Campus Life Platform  
> **Stack**: React 18 + TypeScript · Vite · Express · PostgreSQL 16 (Neon) · Bun  
> **Status**: Frontend ~30% complete. Backend is empty. Wiring phase beginning.

---

## 1. Project Overview

Athens Connect is a university campus hub where students discover clubs, browse events, and RSVP. The frontend is built and polished. The immediate goal is to build the Express backend and connect the frontend to real data via TanStack Query.

**Never suggest rewriting or replacing existing UI.** The design system, component structure, and pages are intentional and complete. Only extend them.

---

## 2. Tech Stack — Exact Versions & Rules

### Runtime & Package Manager
- **Bun** is the package manager and runtime. Always use `bun add`, `bun remove`, `bunx`. Never suggest `npm`, `yarn`, or `pnpm`.
- Run scripts with `bun run <script>`, not `npm run`.

### Frontend
| Tool | Version | Notes |
|------|---------|-------|
| React | 18 | Use functional components only. No class components. |
| TypeScript | latest | Strict mode. No `any`. Use `unknown` and narrow properly. |
| Vite | latest | Dev server on port 5173 by default |
| React Router | v6 | Use `<Link>`, `useNavigate`, `useParams`, `<Outlet>`. No v5 patterns. |
| TanStack Query | v5 | **Not yet wired up** — this is the next phase. See Section 6. |
| Tailwind CSS | **v4** | v4 syntax — use `@import "tailwindcss"` not `@tailwind` directives. No `tailwind.config.js` — config is in CSS. |
| shadcn/ui | latest | Already scaffolded. Import from `@/components/ui/`. Never install raw Radix primitives directly. |

### Backend
| Tool | Notes |
|------|-------|
| Express | Currently an empty file. Build REST API here. |
| TypeScript | Same strict rules as frontend |
| `@neondatabase/serverless` | Use ONLY on the backend/server. Never import in any frontend file. |
| `jose` or `jsonwebtoken` | For JWT auth tokens |
| `bcryptjs` | For password hashing — use `bcryptjs` not `bcrypt` (native bindings issues with Bun) |
| `zod` | For request body validation on all routes |

### Database
- **PostgreSQL 16** via **Neon serverless**
- ORM: **None** — write raw SQL using the `@neondatabase/serverless` client
- Schema is already defined. Do not alter table names or column names without being asked.
- Always use parameterised queries — never string interpolation in SQL

---

## 3. Project Structure

```
athens-connect/
├── src/                        # Frontend (React + Vite)
│   ├── components/
│   │   ├── ui/                 # shadcn/ui — do not modify these directly
│   │   └── ...                 # App-level components
│   ├── pages/
│   │   ├── Index.tsx           # / — Landing page
│   │   ├── Clubs.tsx           # /clubs
│   │   ├── ClubDetail.tsx      # /clubs/:id
│   │   ├── Events.tsx          # /events
│   │   ├── EventDetail.tsx     # /events/:id
│   │   ├── About.tsx           # /about
│   │   ├── Contact.tsx         # /contact
│   │   ├── SignIn.tsx          # /signin
│   │   └── SignUp.tsx          # /signup
│   ├── lib/
│   │   ├── db.ts               # ⚠️ Neon client — BACKEND ONLY, never import in pages/components
│   │   ├── queryClient.ts      # TanStack Query client
│   │   └── utils.ts            # cn() and other helpers
│   ├── hooks/                  # Custom hooks — TanStack Query hooks go here
│   ├── types/                  # Shared TypeScript interfaces
│   └── main.tsx
├── server/                     # Backend (Express)
│   ├── index.ts                # Express entry point
│   ├── routes/
│   │   ├── auth.ts             # POST /api/auth/register, /api/auth/login
│   │   ├── clubs.ts            # GET/POST /api/clubs, /api/clubs/:id
│   │   ├── events.ts           # GET /api/events, /api/events/:id
│   │   ├── rsvps.ts            # POST/DELETE /api/events/:id/rsvp
│   │   ├── memberships.ts      # POST/DELETE /api/clubs/:id/join
│   │   └── dashboard.ts        # GET /api/dashboard/me
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification middleware
│   │   └── validate.ts         # Zod validation middleware
│   └── db/
│       └── client.ts           # Neon DB client singleton for server
└── shared/
    └── types.ts                # Types shared between frontend and server
```

---

## 4. Database Schema

The schema is finalized. Reference these exact table and column names in all SQL queries.

```sql
-- ENUMS
CREATE TYPE user_role       AS ENUM ('student', 'club_admin', 'staff');
CREATE TYPE membership_role AS ENUM ('member', 'moderator', 'admin');
CREATE TYPE event_status    AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE rsvp_status     AS ENUM ('confirmed', 'waitlisted', 'cancelled');
CREATE TYPE proposal_status AS ENUM ('pending', 'approved', 'rejected');

-- TABLES
users (
  id UUID PK, student_id VARCHAR(20) UNIQUE, name VARCHAR(100),
  email VARCHAR(255) UNIQUE, password_hash TEXT, role user_role DEFAULT 'student',
  avatar_url TEXT, is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
)

clubs (
  id UUID PK, name VARCHAR(150) UNIQUE, slug VARCHAR(100) UNIQUE,
  description TEXT, category VARCHAR(60), logo_url TEXT,
  admin_id UUID FK->users.id, member_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
)

events (
  id UUID PK, title VARCHAR(200), club_id UUID FK->clubs.id,
  description TEXT, event_date TIMESTAMPTZ, location VARCHAR(255),
  total_seats INTEGER, registered_count INTEGER DEFAULT 0,
  status event_status DEFAULT 'upcoming', banner_url TEXT,
  created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ
)

memberships (
  id UUID PK, user_id UUID FK->users.id, club_id UUID FK->clubs.id,
  role membership_role DEFAULT 'member', joined_at TIMESTAMPTZ,
  UNIQUE(user_id, club_id)
)

rsvps (
  id UUID PK, user_id UUID FK->users.id, event_id UUID FK->events.id,
  status rsvp_status DEFAULT 'confirmed', created_at TIMESTAMPTZ,
  UNIQUE(user_id, event_id)
)

event_proposals (
  id UUID PK, proposed_by UUID FK->users.id, club_id UUID FK->clubs.id,
  title VARCHAR(200), description TEXT, proposed_date TIMESTAMPTZ,
  location VARCHAR(255), expected_seats INTEGER,
  status proposal_status DEFAULT 'pending', reviewed_by UUID FK->users.id,
  review_note TEXT, reviewed_at TIMESTAMPTZ, created_at TIMESTAMPTZ
)

notifications (
  id UUID PK, user_id UUID FK->users.id, type notif_type,
  title VARCHAR(200), message TEXT, is_read BOOLEAN DEFAULT false,
  ref_id UUID, created_at TIMESTAMPTZ
)
```

---

## 5. Backend Rules (Express Server)

### Route Pattern
Every route file follows this structure:

```typescript
// server/routes/clubs.ts
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/client';
import { requireAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { rows } = await db.query(
      `SELECT id, name, slug, description, category, logo_url, member_count
       FROM clubs WHERE is_active = true ORDER BY name ASC`
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### Authentication
- Use **JWT** (access token, 15min expiry) + **refresh token** (httpOnly cookie, 7d expiry)
- JWT payload: `{ sub: userId, role: userRole, iat, exp }`
- `requireAuth` middleware extracts and verifies JWT from `Authorization: Bearer <token>` header
- Set user on `res.locals.user` after verification

```typescript
// middleware/auth.ts pattern
export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorised' });
  try {
    const payload = await jwtVerify(token, secret);
    res.locals.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

### Validation
Always validate request bodies with Zod before touching the DB:

```typescript
const registerSchema = z.object({
  student_id: z.string().min(4).max(20),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});
```

### Password Hashing
Always use `bcryptjs` with cost factor 12:
```typescript
import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, hash);
```

### SQL Rules
- Always use parameterised queries: `db.query('SELECT * FROM users WHERE id = $1', [id])`
- Never use string template literals to build SQL
- For RSVP creation, use the stored procedure: `SELECT fn_rsvp_for_event($1, $2)` to handle race conditions

### API Response Shape
All responses follow this shape — be consistent:
```typescript
// Success
res.json({ data: <payload> })
res.json({ data: <payload>, meta: { total, page, limit } }) // paginated

// Error
res.status(4xx).json({ error: 'Human readable message' })
res.status(422).json({ error: 'Validation failed', issues: zodError.issues })
```

### CORS
Configure to allow `http://localhost:5173` in development:
```typescript
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
```

---

## 6. Frontend Data Fetching Rules (TanStack Query v5)

**All data fetching must use TanStack Query.** Never use `useEffect` + `fetch` directly in components.

### Query Hook Pattern
Custom hooks live in `src/hooks/`. One file per domain:

```typescript
// src/hooks/useClubs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function useClubs(category?: string) {
  return useQuery({
    queryKey: ['clubs', { category }],
    queryFn: async () => {
      const params = category ? `?category=${category}` : '';
      const res = await fetch(`${API}/api/clubs${params}`);
      if (!res.ok) throw new Error('Failed to fetch clubs');
      const json = await res.json();
      return json.data as Club[];
    },
  });
}

export function useJoinClub() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (clubId: string) => {
      const res = await fetch(`${API}/api/clubs/${clubId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to join club');
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clubs'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
```

### Auth Token Storage
- Store access token in **memory** (React context/Zustand), NOT localStorage
- Store refresh token in **httpOnly cookie** (set by server)
- Never store tokens in localStorage or sessionStorage

### Replacing Hardcoded Data
When replacing hardcoded data in existing pages, preserve the JSX structure exactly. Only replace the hardcoded array with the query result:

```typescript
// BEFORE (hardcoded):
const clubs = HARDCODED_CLUBS;

// AFTER (real data):
const { data: clubs = [], isLoading, error } = useClubs(activeCategory);
if (isLoading) return <ClubsSkeleton />;   // Use skeleton, not spinner
if (error) return <ErrorMessage />;
```

---

## 7. TypeScript Interfaces

Define shared types in `shared/types.ts`. Use these exact shapes — they match the DB columns:

```typescript
export interface User {
  id: string;
  student_id: string;
  name: string;
  email: string;
  role: 'student' | 'club_admin' | 'staff';
  avatar_url: string | null;
  created_at: string;
}

export interface Club {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  logo_url: string | null;
  member_count: number;
  is_active: boolean;
}

export interface Event {
  id: string;
  title: string;
  club_id: string;
  club_name?: string;           // joined from clubs table
  description: string;
  event_date: string;           // ISO 8601
  location: string;
  total_seats: number;
  registered_count: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  banner_url: string | null;
}

export interface Membership {
  id: string;
  user_id: string;
  club_id: string;
  role: 'member' | 'moderator' | 'admin';
  joined_at: string;
}

export interface RSVP {
  id: string;
  user_id: string;
  event_id: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  created_at: string;
}

export interface AuthTokenPayload {
  sub: string;    // user UUID
  role: User['role'];
  iat: number;
  exp: number;
}
```

---

## 8. Auth Flow

### Sign Up (`POST /api/auth/register`)
1. Validate body with Zod (student_id, name, email, password)
2. Check email + student_id not already taken
3. Hash password with bcryptjs (cost 12)
4. Insert user into `users` table
5. Return `{ data: { user, accessToken } }` + set refresh token cookie

### Sign In (`POST /api/auth/login`)
1. Validate body (email, password)
2. Fetch user by email
3. Compare password with `bcrypt.compare`
4. Sign JWT (15min) + refresh token (7d)
5. Return `{ data: { user, accessToken } }` + set refresh token cookie

### Frontend Auth Context
Use React Context (`src/contexts/AuthContext.tsx`) to:
- Hold `user` and `accessToken` in state
- Expose `login()`, `logout()`, `register()` functions
- Automatically refresh access token using refresh token cookie on app load

### Sign In / Sign Up Pages
These currently fire `alert()` on submit. Replace the submit handler to call the API and update AuthContext. Do not change the form JSX or styling.

---

## 9. API Route Reference

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register new student |
| POST | `/api/auth/login` | Public | Login, returns tokens |
| POST | `/api/auth/refresh` | Cookie | Refresh access token |
| POST | `/api/auth/logout` | Auth | Clear refresh token cookie |
| GET | `/api/clubs` | Public | List clubs (`?category=&search=`) |
| GET | `/api/clubs/:slug` | Public | Club detail |
| POST | `/api/clubs/:id/join` | Auth | Join a club |
| DELETE | `/api/clubs/:id/join` | Auth | Leave a club |
| GET | `/api/events` | Public | List events (`?category=&status=&search=`) |
| GET | `/api/events/:id` | Public | Event detail |
| POST | `/api/events/:id/rsvp` | Auth | RSVP to event (calls `fn_rsvp_for_event`) |
| DELETE | `/api/events/:id/rsvp` | Auth | Cancel RSVP |
| POST | `/api/events/propose` | Auth | Submit event proposal |
| GET | `/api/dashboard/me` | Auth | My clubs, RSVPs, activity feed |

---

## 10. Environment Variables

### Frontend (`src/.env.local`)
```
VITE_API_URL=http://localhost:3000
```

### Backend (`server/.env`)
```
DATABASE_URL=postgresql://...@neon.tech/athens_connect
JWT_SECRET=<openssl rand -base64 32>
JWT_REFRESH_SECRET=<openssl rand -base64 32>
CLIENT_URL=http://localhost:5173
PORT=3000
NODE_ENV=development
```

**Never commit `.env` files. Never import `DATABASE_URL` or any DB credential in frontend code.**

---

## 11. Code Style Rules

- **No `any`** — use `unknown` and type guards, or define proper interfaces
- **No `useEffect` for data fetching** — always TanStack Query
- **No inline styles** — always Tailwind utility classes
- **No hardcoded colours** — use design tokens (`primary`, `muted`, etc.) from the existing Tailwind config
- **Async/await** everywhere — no `.then()` chains
- **Error boundaries** — wrap page-level components in error boundaries
- **Loading states** — use skeleton components (matching the existing design) not generic spinners
- **Named exports** for hooks and utilities; **default export** for page components
- **File naming**: `camelCase.ts` for utilities/hooks, `PascalCase.tsx` for components/pages

---

## 12. What NOT to Do

- Do not rewrite or redesign existing page components or UI
- Do not change the routing structure in `App.tsx`
- Do not install alternative UI libraries (no MUI, Chakra, Ant Design)
- Do not add a different ORM (no Prisma, Drizzle, Sequelize) — use raw SQL with Neon client
- Do not use `fetch` directly in components — always go through a TanStack Query hook
- Do not expose the Neon DB client or `DATABASE_URL` to the browser/frontend bundle
- Do not use `npm`, `yarn`, or `pnpm` — always `bun`
- Do not alter the PostgreSQL schema without explicit instruction
- Do not use `console.log` in production paths — use proper error handling

---

## 13. Current Priority Order

When suggesting next steps or generating code, follow this order:

1. **Express server setup** — `server/index.ts`, CORS, middleware, route mounting
2. **Database client** — `server/db/client.ts` singleton using `@neondatabase/serverless`
3. **Auth routes** — register + login endpoints with bcrypt + JWT
4. **Auth middleware** — JWT verification for protected routes
5. **Auth context** — React context wiring `SignIn`/`SignUp` pages to real API
6. **Clubs API** — GET list + GET detail endpoints
7. **Events API** — GET list + GET detail endpoints
8. **TanStack Query hooks** — replace hardcoded data in `Clubs.tsx` and `Events.tsx`
9. **RSVP + Join** — mutation hooks wiring the existing buttons to real API
10. **Dashboard** — `/api/dashboard/me` + dashboard page data fetching