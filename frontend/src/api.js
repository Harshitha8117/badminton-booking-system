// src/api.js

// Use Vercel or .env variable — fallback to /api for local
const API = import.meta.env.VITE_API_URL || "/api";

export async function fetchCourts() {
  const res = await fetch(`${API}/courts`);
  if (!res.ok) throw new Error("Failed to fetch courts");
  return res.json();
}

export async function fetchCoaches() {
  const res = await fetch(`${API}/coaches`);
  if (!res.ok) throw new Error("Failed to fetch coaches");
  return res.json();
}

export async function fetchEquipment() {
  const res = await fetch(`${API}/equipment`);
  if (!res.ok) throw new Error("Failed to fetch equipment");
  return res.json();
}

export async function fetchPricingRules() {
  const res = await fetch(`${API}/pricing`);
  if (!res.ok) throw new Error("Failed to fetch pricing rules");
  return res.json();
}
