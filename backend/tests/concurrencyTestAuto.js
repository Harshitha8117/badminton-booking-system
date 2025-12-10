// backend/tests/concurrencyTestAuto.js
// Usage: (from backend/) node tests/concurrencyTestAuto.js
const axios = require('axios');

const API_BASE = 'http://localhost:4000';
const BOOKINGS_API = API_BASE + '/api/bookings';
const COURTS_API = API_BASE + '/api/courts';
const COACHES_API = API_BASE + '/api/coaches';

const NUM_REQUESTS = 6; // concurrent requests to attempt

async function getIds() {
  try {
    const [courtsRes, coachesRes] = await Promise.all([
      axios.get(COURTS_API),
      axios.get(COACHES_API).catch(()=>({ data: [] }))
    ]);
    const courts = courtsRes.data || [];
    const coaches = (coachesRes.data || []);
    if (!courts.length) throw new Error('No courts found. Seed data missing or backend not running.');
    return { courtId: courts[0]._id, coachId: (coaches[0] && coaches[0]._id) || null, courts, coaches };
  } catch (err) {
    throw new Error('Failed to fetch resource IDs: ' + (err.response?.data?.error || err.message));
  }
}

function makePayload(courtId, coachId, i) {
  const start = new Date();
  start.setDate(start.getDate() + 3); // 3 days from now
  start.setHours(10,0,0,0);
  const end = new Date(start.getTime() + 60*60*1000);
  return {
    userName: 'TestUser_' + i,
    courtId,
    coachId: coachId || null,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    equipment: { rackets: 1, shoes: 0 }
  };
}

async function run() {
  console.log('Fetching court/coach IDs from backend...');
  let ids;
  try {
    ids = await getIds();
  } catch (err) {
    console.error('ERROR getting IDs:', err.message || err);
    process.exit(1);
  }
  console.log('Using courtId:', ids.courtId, 'coachId:', ids.coachId);

  const promises = [];
  for (let i=0;i<NUM_REQUESTS;i++){
    const payload = makePayload(ids.courtId, ids.coachId, i);
    promises.push(
      axios.post(BOOKINGS_API, payload)
        .then(res => ({ ok: true, status: res.status, data: res.data }))
        .catch(err => {
          const status = err.response?.status;
          const body = err.response?.data;
          return { ok: false, status, body, message: err.message };
        })
    );
  }

  const results = await Promise.all(promises);
  console.log('--- Results ---');
  let okCount = 0;
  results.forEach((r, i) => {
    if (r.ok) {
      okCount++;
      console.log(i, 'OK', 'status=', r.status, 'bookingId=', r.data.booking?._id);
    } else {
      console.log(i, 'FAIL', 'status=', r.status, 'body=', JSON.stringify(r.body), 'msg=', r.message);
    }
  });
  console.log('Summary: total=', results.length, 'succeeded=', okCount, 'failed=', results.length - okCount);
}

run().catch(e=>{ console.error('Fatal', e); process.exit(1); });
