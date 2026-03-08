import { db } from './client.ts';

async function applyFunction() {
    try {
        const fnSql = `
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
        RETURN 'event_not_found';
    END IF;

    -- Check if already RSVP'd
    IF EXISTS (
        SELECT 1 FROM rsvps
        WHERE user_id = p_user_id AND event_id = p_event_id
    ) THEN
        RETURN 'already_rsvped';
    END IF;

    -- Determine status
    IF v_total = 0 THEN
        v_status := 'confirmed'; 
    ELSIF v_registered < v_total THEN
        v_status := 'confirmed';
    ELSE
        v_status := 'waitlisted';
    END IF;

    -- Cast text to rsvp_status enum
    INSERT INTO rsvps (user_id, event_id, status)
    VALUES (p_user_id, p_event_id, v_status::rsvp_status);

    RETURN v_status;
END;
$$ LANGUAGE plpgsql;
`;

        await db.query(fnSql);
        console.log('Function applied successfully with type cast.');
    } catch (err) {
        console.error('Error applying function:', err);
    }
}

applyFunction();
