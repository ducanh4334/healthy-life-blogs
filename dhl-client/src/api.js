export const API_BASE = "/api"; // vite proxy will forward to backend on dev
export async function getJSON(path) {
  const r = await fetch(`${API_BASE}${path}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
export async function postJSON(path, body) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
export async function postForm(path, formData) {
  const r = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
