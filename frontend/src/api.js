// src/api.js

const API = import.meta.env.VITE_API_URL;  
// Do NOT fallback to "/api" on Vercel – that causes 404

export async function fetchCourts() {
  const res = await fetch(`${API}/courts`);
  if (!res.ok) throw new Error("API Error: " + res.status);
  return res.json();
}

export async function fetchCoaches() {
  const res = await fetch(`${API}/coaches`);
  if (!res.ok) throw new Error("API Error: " + res.status);
  return res.json();
}
