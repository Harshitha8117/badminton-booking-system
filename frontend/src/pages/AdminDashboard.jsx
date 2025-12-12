// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { fetchCourts, fetchCoaches, createCourt } from "../api";

export default function AdminDashboard() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [newCourt, setNewCourt] = useState({ name: "", type: "indoor", basePrice: "" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [cs, ch] = await Promise.all([fetchCourts(), fetchCoaches()]);
        if (!mounted) return;
        setCourts(cs || []);
        setCoaches(ch || []);
      } catch (e) {
        console.error(e);
        setErr(e.message || "Failed to load admin data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  async function addCourt(e) {
    e.preventDefault();
    setErr(null);
    if (!newCourt.name || !newCourt.basePrice) {
      setErr("Name and base price required");
      return;
    }
    setCreating(true);
    try {
      const created = await createCourt({ ...newCourt, basePrice: Number(newCourt.basePrice) });
      setCourts(prev => [created, ...prev]);
      setNewCourt({ name: "", type: "indoor", basePrice: "" });
    } catch (e) {
      console.error(e);
      setErr(e.data?.error || e.message || "Failed to create court");
    } finally {
      setCreating(false);
    }
  }

  if (loading) return <div>Loading admin data…</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {err && <div className="text-red-700 p-2 bg-red-100 mb-3 rounded">{err}</div>}

      <section className="mb-6">
        <h3 className="font-semibold">Courts</h3>
        <ul>
          {courts.map(c => <li key={c._id}>{c.name} — ${c.basePrice} ({c.type})</li>)}
        </ul>
      </section>

      <section>
        <h3 className="font-semibold mb-2">Create Court</h3>
        <form onSubmit={addCourt} className="space-y-2">
          <input placeholder="Name" value={newCourt.name} onChange={e=>setNewCourt({...newCourt, name:e.target.value})} className="block w-full p-2 border rounded"/>
          <select value={newCourt.type} onChange={e=>setNewCourt({...newCourt, type:e.target.value})} className="block w-full p-2 border rounded">
            <option value="indoor">indoor</option>
            <option value="outdoor">outdoor</option>
          </select>
          <input placeholder="Base price" type="number" value={newCourt.basePrice} onChange={e=>setNewCourt({...newCourt, basePrice:e.target.value})} className="block w-full p-2 border rounded"/>
          <button disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded">{creating ? "Creating…" : "Create"}</button>
        </form>
      </section>
    </div>
  );
}
