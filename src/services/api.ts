// src/services/api.ts
const BASE = 'https://api.example.com';

export async function apiGet(path: string) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

export async function apiPost(path: string, body: any) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}
