import { db } from './client.ts';
import { jwtSign } from '../utils/jwt.ts'; // Wait, let's just make a DB query.
// Actually let's just query the db for users and events to test `fn_rsvp_for_event`

async function test() {
    try {
        const { rows: users } = await db.query('SELECT id FROM users LIMIT 1');
        const { rows: events } = await db.query('SELECT id FROM events LIMIT 1');

        if (users.length && events.length) {
            console.log('Testing fn_rsvp_for_event with', users[0].id, events[0].id);
            const { rows } = await db.query('SELECT fn_rsvp_for_event($1, $2) AS result', [users[0].id, events[0].id]);
            console.log('Result:', rows[0].result);
        } else {
            console.log('No users or events found.');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}
test();
