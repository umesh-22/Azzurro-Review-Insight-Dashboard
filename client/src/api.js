const apiBase = `${import.meta.env.VITE_API_URL || ""}/api`;

function toQuery(params) {
  const filled = Object.entries(params).filter(([, value]) => value !== null && value !== undefined && value !== "");
  return new URLSearchParams(filled).toString();
}

export async function getJson(path, params = {}) {
  const response = await fetch(`${apiBase}/${path}?${toQuery(params)}`);
  if (!response.ok) throw new Error("Could not load data");
  return response.json();
}

export async function postJson(path) {
  const response = await fetch(`${apiBase}/${path}`, { method: "POST" });
  if (!response.ok) throw new Error("Request failed");
  return response.json();
}

export function exportUrl(params) {
  return `${apiBase}/reviews/export?${toQuery(params)}`;
}
