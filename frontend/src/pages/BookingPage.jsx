// frontend/src/pages/BookingPage.jsx
import React, { useEffect, useState } from "react";
import { fetchCourts, fetchCoaches, createBooking } from "../api";

const SLOTS = ["09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

export default function BookingPage() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    courtId: "",
    date: "",
    slot: "",
    coachId: "",
    rackets: 0,
    shoes: 0,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [c, ch] = await Promise.all([fetchCourts(), fetchCoaches()]);
        if (!mounted) return;
        setCourts(c || []);
        setCoaches(ch || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load options");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  function setField(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
    setError(null);
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);

    // Minimal client validation
    if (!form.name || !form.courtId || !form.date || !form.slot) {
      setError("Please fill name, court, date and slot.");
      return;
    }

    // Create payload per your backend schema
    const payload = {
      name: form.name,
      courtId: form.courtId,
      coachId: form.coachId || null,
      date: form.date,
      slot: form.slot,
      equipment: {
        rackets: Number(form.rackets) || 0,
        shoes: Number(form.shoes) || 0,
      },
    };

    try {
      const created = await createBooking(payload);
      // success UX: clear slot or navigate
      alert("Booking created: " + (created._id || "OK"));
      // reset slot selection
      setForm(prev => ({ ...prev, slot: "" }));
    } catch (err) {
      console.error(err);
      // Show meaningful message, backend may return 409 or 400
      setError(err.data?.error || err.message || "Booking failed");
    }
  }

  if (loading) return <div>Loading available courts & coaches…</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create Booking</h2>

      {error && <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">{error}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block font-semibold">Name</label>
          <input value={form.name} onChange={e=>setField("name", e.target.value)} className="w-full p-2 border rounded"/>
        </div>

        <div>
          <label className="block font-semibold">Choose court</label>
          <select value={form.courtId} onChange={e=>setField("courtId", e.target.value)} className="w-full p-2 border rounded">
            <option value="">--select--</option>
            {courts.map(c => <option key={c._id} value={c._id}>{c.name} ({c.type}) - ${c.basePrice}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-semibold">Date</label>
          <input type="date" value={form.date} onChange={e=>setField("date", e.target.value)} className="p-2 border rounded"/>
        </div>

        <div>
          <label className="block font-semibold">Slots</label>
          <div className="grid grid-cols-3 gap-2">
            {SLOTS.map(s => (
              <button
                type="button"
                key={s}
                onClick={() => setField("slot", s)}
                className={`p-3 border rounded ${form.slot===s ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold">Coach</label>
          <select value={form.coachId} onChange={e=>setField("coachId", e.target.value)} className="w-full p-2 border rounded">
            <option value="">--none--</option>
            {coaches.map(c => <option key={c._id} value={c._id}>{c.name} — ${c.hourlyRate}/hr</option>)}
          </select>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block font-semibold">Rackets</label>
            <input type="number" min="0" value={form.rackets} onChange={e=>setField("rackets", e.target.value)} className="w-full p-2 border rounded"/>
          </div>
          <div className="flex-1">
            <label className="block font-semibold">Shoes</label>
            <input type="number" min="0" value={form.shoes} onChange={e=>setField("shoes", e.target.value)} className="w-full p-2 border rounded"/>
          </div>
        </div>

        <div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Book</button>
        </div>
      </form>
    </div>
  );
}
