// Shared client for the hosted GA8 rule-engine & MLOps API.
// Stateless, deterministic, CORS-open, no auth required.

export const GA8_BASE = 'https://tds-roe-solver-api-t12026.onrender.com/ga8';

const REQUEST_TIMEOUT_MS = 90000; // Covers Render cold-start latency

export function serviceUrlFor(email) {
  const clean = String(email || '').trim();
  if (!clean) throw new Error('No email available -- reinitialize the workspace with your exam email.');
  return `${GA8_BASE}/${encodeURIComponent(clean)}`;
}

async function requestJson(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err && err.name === 'AbortError') {
      throw new Error(`Timed out after ${REQUEST_TIMEOUT_MS / 1000}s. The service may be cold-starting -- wait a moment and try again.`);
    }
    throw new Error(`Network error reaching the service: ${err.message}. Check your connection, then retry.`);
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    const snippet = text.slice(0, 120).replace(/\s+/g, ' ').trim();
    throw new Error(`Service returned non-JSON (HTTP ${res.status})${snippet ? `: "${snippet}"` : ''}. It may be restarting -- retry shortly.`);
  }
  if (!res.ok) {
    throw new Error(`Service responded HTTP ${res.status}: ${JSON.stringify(json)}`);
  }
  return json;
}

export async function ga8Post(email, path, body) {
  return requestJson(serviceUrlFor(email) + `/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function ga8Get(email, path) {
  return requestJson(serviceUrlFor(email) + `/${path}`);
}
