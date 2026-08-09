// Shared client for the hosted GA7 rule-engine API. Stateless, deterministic, CORS-open, no auth.
//
// Robustness notes: the host sleeps when idle, so the first request after a quiet period can take
// ~30-50s. Every call therefore gets a generous but FINITE timeout -- an un-aborted fetch against a
// sleeping/dead host would otherwise leave the user's button spinning forever with no feedback.
// Responses are also validated before parsing, so a 502 HTML error page surfaces as a readable
// message instead of a raw JSON SyntaxError.
export const GA7_BASE = 'https://tds-roe-solver-api-t12026.onrender.com/ga7';

const REQUEST_TIMEOUT_MS = 90000; // generous: covers a full cold start with headroom

export function serviceUrlFor(email) {
  const clean = String(email || '').trim();
  if (!clean) throw new Error('No email available -- reinitialize the workspace with your exam email.');
  return `${GA7_BASE}/${encodeURIComponent(clean)}`;
}

async function requestJson(url, options = {}) {
  // AbortSignal.timeout() isn't available in every browser this runs in, so use an explicit
  // controller + timer and always clear it.
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
  // The API is documented never to 5xx on bad input (it returns a normal 200 with an
  // INVALID_SCHEMA-style verdict), so a non-2xx here means an infrastructure problem, not a
  // "blocked" verdict -- surface it as such rather than letting it read as a policy decision.
  if (!res.ok) {
    throw new Error(`Service responded HTTP ${res.status}. This is an infrastructure error, not a policy verdict -- retry shortly.`);
  }
  return json;
}

export async function ga7Post(email, path, body) {
  return requestJson(serviceUrlFor(email) + `/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

export async function ga7Scope(email) {
  return requestJson(serviceUrlFor(email) + '/scope');
}
