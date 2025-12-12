// frontend/src/api.js
// central API helper — uses VITE_API_URL when present (set in Vercel), otherwise fallback to same origin /api

export const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") || "";

async function handleResponse(res) {
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (e) { data = text; }
  if (!res.ok) {
    const err = new Error(data?.error || res.statusText || "API error");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export async function fetchCourts() {
  const url = API ? `${API}/courts` : `/api/courts`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchCoaches() {
  const url = API ? `${API}/coaches` : `/api/coaches`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchEquipment() {
  const url = API ? `${API}/equipment` : `/api/equipment`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchPricingRules() {
  const url = API ? `${API}/pricing` : `/api/pricing`;
  const res = await fetch(url);
  return handleResponse(res);
}

// POST helpers (can be extended)
export async function createCourt(payload) {
  const url = API ? `${API}/courts` : `/api/courts`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function createBooking(payload) {
  const url = API ? `${API}/bookings` : `/api/bookings`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function fetchBookings() {
  const url = API ? `${API}/bookings` : `/api/bookings`;
  const res = await fetch(url);
  return handleResponse(res);
}
