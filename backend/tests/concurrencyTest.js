// backend/tests/concurrencyTest.js
// Run: node backend/tests/concurrencyTest.js
const axios = require('axios');

const API = 'http://localhost:4000/api/bookings';

// replace these IDs after calling /api/courts and /api/coaches
const COURT_ID = '<PASTE_COURT_ID>';
const COACH_ID = ''; // optional

const payload = (name) => ({
  userName: name,
  courtId: COURT_ID,
  coachId: COACH_ID || null,
  startTime: '2025-12-20T10:00:00.000Z',
  endTime: '2025-12-20T11:00:00.000Z',
  equipment: { rackets: 1, shoes: 0 }
});

async function run() {
  const requests = [];
  const N = 6;
  for (let i = 0; i < N; i++) {
    requests.push(axios.post(API, payload('User_' + i)).then(r => ({ ok: true, data: r.data })).catch(e => ({ ok: false, err: e.response?.data || e.message })));
  }
  const results = await Promise.all(requests);
  console.log('Results:');
  results.forEach((r, i) => console.log(i, r.ok ? 'OK' : 'FAIL', r.ok ? r.data.booking?._id : r.err));
}

run();
