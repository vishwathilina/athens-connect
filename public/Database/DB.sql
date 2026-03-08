-- ============================================================
-- CampusHub Database Schema
-- PostgreSQL 16 | Ignite 1.0 — NSBM Green University
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()

-- ── ENUMS ───────────────────────────────────────────────────
CREATE TYPE user_role        AS ENUM ('student', 'club_admin', 'staff');
CREATE TYPE membership_role  AS ENUM ('member', 'moderator', 'admin');
CREATE TYPE event_status     AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE rsvp_status      AS ENUM ('confirmed', 'waitlisted', 'cancelled');
CREATE TYPE proposal_status  AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE notif_type       AS ENUM ('rsvp_confirmed', 'event_reminder', 'club_announcement', 'proposal_update');

-- ============================================================
-- CORE TABLES
-- ============================================================

-- ── USERS ────────────────────────────────────────────────────
CREATE TABLE users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      VARCHAR(20)     NOT NULL UNIQUE,
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   TEXT            NOT NULL,
    role            user_role       NOT NULL DEFAULT 'student',
    avatar_url      TEXT,
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── CLUBS ────────────────────────────────────────────────────
CREATE TABLE clubs (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(150)    NOT NULL UNIQUE,
    slug            VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT            NOT NULL,
    category        VARCHAR(60)     NOT NULL,
    logo_url        TEXT,
    admin_id        UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    member_count    INTEGER         NOT NULL DEFAULT 0,   -- denormalised cache
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── EVENTS ───────────────────────────────────────────────────
CREATE TABLE events (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title               VARCHAR(200)    NOT NULL,
    club_id             UUID            NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    description         TEXT            NOT NULL,
    event_date          TIMESTAMP WITH TIME ZONE NOT NULL,
    location            VARCHAR(255)    NOT NULL,
    total_seats         INTEGER         NOT NULL CHECK (total_seats > 0),
    registered_count    INTEGER         NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    status              event_status    NOT NULL DEFAULT 'upcoming',
    banner_url          TEXT,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT seats_not_exceeded CHECK (registered_count <= total_seats)
);

-- ── MEMBERSHIPS (junction) ───────────────────────────────────
CREATE TABLE memberships (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club_id     UUID            NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    role        membership_role NOT NULL DEFAULT 'member',
    joined_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_membership UNIQUE (user_id, club_id)
);

-- ── RSVPs ────────────────────────────────────────────────────
CREATE TABLE rsvps (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id    UUID        NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    status      rsvp_status NOT NULL DEFAULT 'confirmed',
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_rsvp UNIQUE (user_id, event_id)
);

-- ── EVENT PROPOSALS ──────────────────────────────────────────
CREATE TABLE event_proposals (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    proposed_by     UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club_id         UUID                NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    title           VARCHAR(200)        NOT NULL,
    description     TEXT                NOT NULL,
    proposed_date   TIMESTAMP WITH TIME ZONE NOT NULL,
    location        VARCHAR(255)        NOT NULL,
    expected_seats  INTEGER             NOT NULL CHECK (expected_seats > 0),
    status          proposal_status     NOT NULL DEFAULT 'pending',
    reviewed_by     UUID                REFERENCES users(id) ON DELETE SET NULL,
    review_note     TEXT,
    reviewed_at     TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── NOTIFICATIONS ────────────────────────────────────────────
CREATE TABLE notifications (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        notif_type  NOT NULL,
    title       VARCHAR(200) NOT NULL,
    message     TEXT        NOT NULL,
    is_read     BOOLEAN     NOT NULL DEFAULT false,
    ref_id      UUID,                            -- flexible FK to event/club/proposal
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Users
CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_student_id   ON users(student_id);
CREATE INDEX idx_users_role         ON users(role);

-- Clubs
CREATE INDEX idx_clubs_slug         ON clubs(slug);
CREATE INDEX idx_clubs_category     ON clubs(category);
CREATE INDEX idx_clubs_admin        ON clubs(admin_id);
CREATE INDEX idx_clubs_active       ON clubs(is_active);

-- Events
CREATE INDEX idx_events_club        ON events(club_id);
CREATE INDEX idx_events_date        ON events(event_date);
CREATE INDEX idx_events_status      ON events(status);
CREATE INDEX idx_events_date_status ON events(event_date, status);  -- composite for common query

-- Memberships
CREATE INDEX idx_memberships_user   ON memberships(user_id);
CREATE INDEX idx_memberships_club   ON memberships(club_id);

-- RSVPs
CREATE INDEX idx_rsvps_user         ON rsvps(user_id);
CREATE INDEX idx_rsvps_event        ON rsvps(event_id);
CREATE INDEX idx_rsvps_status       ON rsvps(status);

-- Notifications
CREATE INDEX idx_notifs_user        ON notifications(user_id);
CREATE INDEX idx_notifs_unread      ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================

-- ── Auto-update updated_at timestamp ─────────────────────────
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_clubs_updated_at
    BEFORE UPDATE ON clubs
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

CREATE TRIGGER trg_rsvps_updated_at
    BEFORE UPDATE ON rsvps
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- ── Sync events.registered_count on RSVP changes ─────────────
-- Increments count on confirmed RSVP insert,
-- decrements on cancellation or delete.
CREATE OR REPLACE FUNCTION fn_sync_registered_count()
RETURNS TRIGGER AS $$
BEGIN
    -- INSERT: only count confirmed or waitlisted
    IF (TG_OP = 'INSERT') THEN
        IF NEW.status = 'confirmed' THEN
            UPDATE events
            SET registered_count = registered_count + 1
            WHERE id = NEW.event_id;
        END IF;

    -- DELETE: reverse the count if it was confirmed
    ELSIF (TG_OP = 'DELETE') THEN
        IF OLD.status = 'confirmed' THEN
            UPDATE events
            SET registered_count = GREATEST(registered_count - 1, 0)
            WHERE id = OLD.event_id;
        END IF;

    -- UPDATE: handle status transitions
    ELSIF (TG_OP = 'UPDATE') THEN
        -- cancelled -> confirmed
        IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
            UPDATE events
            SET registered_count = registered_count + 1
            WHERE id = NEW.event_id;
        -- confirmed -> cancelled/waitlisted
        ELSIF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
            UPDATE events
            SET registered_count = GREATEST(registered_count - 1, 0)
            WHERE id = NEW.event_id;
        END IF;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_rsvp_sync_count
    AFTER INSERT OR UPDATE OR DELETE ON rsvps
    FOR EACH ROW EXECUTE FUNCTION fn_sync_registered_count();

-- ── Sync clubs.member_count on membership changes ─────────────
CREATE OR REPLACE FUNCTION fn_sync_member_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE clubs SET member_count = member_count + 1 WHERE id = NEW.club_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE clubs SET member_count = GREATEST(member_count - 1, 0) WHERE id = OLD.club_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_membership_sync_count
    AFTER INSERT OR DELETE ON memberships
    FOR EACH ROW EXECUTE FUNCTION fn_sync_member_count();

-- ── Auto-promote proposal to event on approval ────────────────
CREATE OR REPLACE FUNCTION fn_promote_proposal_to_event()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
        INSERT INTO events (
            title, club_id, description,
            event_date, location, total_seats, status
        ) VALUES (
            NEW.title, NEW.club_id, NEW.description,
            NEW.proposed_date, NEW.location, NEW.expected_seats, 'upcoming'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_proposal_approved
    AFTER UPDATE ON event_proposals
    FOR EACH ROW EXECUTE FUNCTION fn_promote_proposal_to_event();

-- ============================================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships     ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps           ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;

-- Users: can only see/edit their own profile
CREATE POLICY pol_users_self
    ON users FOR ALL
    USING (id = current_setting('app.current_user_id')::UUID);

-- Memberships: students see only their own
CREATE POLICY pol_memberships_self
    ON memberships FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- RSVPs: students see only their own
CREATE POLICY pol_rsvps_self
    ON rsvps FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- Notifications: users see only their own
CREATE POLICY pol_notifications_self
    ON notifications FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- ============================================================
-- SAFE RSVP PROCEDURE (handles race conditions)
-- ============================================================

CREATE OR REPLACE FUNCTION fn_rsvp_for_event(
    p_user_id   UUID,
    p_event_id  UUID
)
RETURNS TEXT AS $$
DECLARE
    v_total     INTEGER;
    v_registered INTEGER;
    v_status    TEXT;
BEGIN
    -- Lock the event row to prevent concurrent over-booking
    SELECT total_seats, registered_count
    INTO v_total, v_registered
    FROM events
    WHERE id = p_event_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN 'error: event not found';
    END IF;

    -- Check if already RSVP'd
    IF EXISTS (
        SELECT 1 FROM rsvps
        WHERE user_id = p_user_id AND event_id = p_event_id
    ) THEN
        RETURN 'error: already rsvped';
    END IF;

    -- Determine status
    IF v_registered < v_total THEN
        v_status := 'confirmed';
    ELSE
        v_status := 'waitlisted';
    END IF;

    INSERT INTO rsvps (user_id, event_id, status)
    VALUES (p_user_id, p_event_id, v_status);

    RETURN 'ok:' || v_status;
END;
$$ LANGUAGE plpgsql;

-- Usage from Next.js API route:
-- SELECT fn_rsvp_for_event('user-uuid', 'event-uuid');

-- ============================================================
-- SEED DATA (Development)
-- ============================================================

-- Admin / staff user
INSERT INTO users (student_id, name, email, password_hash, role)
VALUES ('STAFF001', 'Admin User', 'admin@nsbm.ac.lk', '$2b$12$placeholder_hash', 'staff');

-- Sample students
INSERT INTO users (student_id, name, email, password_hash, role) VALUES
    ('210456', 'Alex Fernando',  'alex@students.nsbm.ac.lk',   '$2b$12$placeholder_hash', 'student'),
    ('210457', 'Sasha Perera',   'sasha@students.nsbm.ac.lk',  '$2b$12$placeholder_hash', 'student'),
    ('210458', 'Rayan Silva',    'rayan@students.nsbm.ac.lk',  '$2b$12$placeholder_hash', 'club_admin');

-- Sample clubs (admin = Rayan)
INSERT INTO clubs (name, slug, description, category, admin_id)
SELECT 'IEEE Student Branch', 'ieee-student-branch',
       'Connecting future engineers through workshops, hackathons, and industry talks.',
       'Tech', id FROM users WHERE student_id = '210458';

INSERT INTO clubs (name, slug, description, category, admin_id)
SELECT 'Debate Society', 'debate-society',
       'Sharpen your arguments and public speaking in competitive debates.',
       'Academic', id FROM users WHERE student_id = '210458';

INSERT INTO clubs (name, slug, description, category, admin_id)
SELECT 'Green Campus Club', 'green-campus-club',
       'Driving sustainability initiatives across the university campus.',
       'Sustainability', id FROM users WHERE student_id = '210458';

-- Sample events
INSERT INTO events (title, club_id, description, event_date, location, total_seats)
SELECT 'Annual Hackathon 2025',
       c.id,
       'A 24-hour hackathon for all students. Build, break, and present.',
       NOW() + INTERVAL '7 days',
       'Block A Auditorium',
       80
FROM clubs c WHERE c.slug = 'ieee-student-branch';

INSERT INTO events (title, club_id, description, event_date, location, total_seats)
SELECT 'Inter-University Debate Finals',
       c.id,
       'Annual finals bringing together top debaters from five universities.',
       NOW() + INTERVAL '10 days',
       'Main Hall',
       120
FROM clubs c WHERE c.slug = 'debate-society';