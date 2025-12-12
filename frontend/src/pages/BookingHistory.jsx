// frontend/src/pages/BookingHistory.jsx
import React, { useEffect, useState } from "react";
import { fetchBookings } from "../api";

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const bs = await fetchBookings();
        if (!mounted) return;
        setBookings(bs || []);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Failed to load bookings");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <div>Loading bookings…</div>;
  if (err) return <div className="text-red-600">{err}</div>;

  if (!bookings.length) return <div>No booking history yet.</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Booking History</h2>
      <ul className="space-y-3">
        {bookings.map(b => (
          <li key={b._id} className="border rounded p-3">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{b.name} — {b.courtName || b.courtId || "Court"}</div>
                <div className="text-sm text-gray-600">{b.date} @ {b.slot}</div>
                {b.coachName && <div className="text-sm">Coach: {b.coachName}</div>}
              </div>
              <div className="text-right">
                <div className="text-sm">{b.status || "confirmed"}</div>
                <div className="font-bold">${b.total || b.price || "—"}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
