// Shared client for the hosted GA7 rule-engine API. Stateless, deterministic, CORS-open,
// no auth. See the five q-*.js files for per-question usage.
export const GA7_BASE = 'https://tds-roe-solver-api-t12026.onrender.com/ga7';

export function serviceUrlFor(email) {
  return `${GA7_BASE}/${encodeURIComponent(email)}`;
}

export async function ga7Post(email, path, body) {
  const res = await fetch(`${GA7_BASE}/${encodeURIComponent(email)}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Non-JSON response (HTTP ${res.status}) -- the service may be cold-starting, try again in a moment.`);
  }
  return json;
}

export async function ga7Scope(email) {
  const res = await fetch(`${GA7_BASE}/${encodeURIComponent(email)}/scope`);
  return res.json();
}
