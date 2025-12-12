// frontend/src/pages/BookingHistory.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import '../styles/app.css';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/bookings').then(r => {
      setBookings(r.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Booking History</h1>
      <div className="card">
        {loading ? <div className="hint">Loading history…</div> : null}
        {bookings.length === 0 && !loading ? <div className="hint">No bookings yet.</div> : null}

        <ul className="history-list" style={{ marginTop: 12 }}>
          {bookings.map(b => {
            const dt = new Date(b.startTime);
            const user = b.userName || 'Guest';
            const when = dt.toLocaleString();
            // backend now populates courtId and coachId
            const courtName = b.courtId?.name || (b.court?.name || 'Court');
            const coachName = b.coachId?.name || (b.coach?.name || '');
            const total = b.pricingBreakdown?.total ?? 0;

            return (
              <li key={b._id} className="history-item">
                <div>
                  <div style={{ fontWeight: 700 }}>{user}</div>
                  <div className="history-meta">{when} • {courtName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="history-price">${Number(total).toFixed(2)}</div>
                  <div className="history-meta">{coachName ? `Coach: ${coachName}` : ''}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
