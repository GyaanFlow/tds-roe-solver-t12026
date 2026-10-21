// Client for the hosted GA5-style agent API (tds-roe-solver-api, routes under /ga5/<email>/<token>/…) that backs the three
// T3 GA3 engineering questions: the A2A invoice agent, the mailroom action gate and the incident-response agent.
// Pure logic with an injectable fetch, so check.mjs can drive every path without a network.
import { T3_GA1_API_ORIGIN, apiEmail } from '../ga1/api-client.js';
import { waitForApi } from '../ga1/q15-ledger-agent.js';

export const GA3_API_ORIGIN = T3_GA1_API_ORIGIN;

export const A2A_INPUT_MODE = 'application/vnd.ga5.invoice-claim-batch+json';
export const A2A_OUTPUT_MODES = ['application/vnd.ga5.invoice-action-proposals+json', 'application/vnd.ga5.invoice-action-receipts+json'];

const fail = (code, message) => ({ ok: false, code, message });

/* ------------------------------ the AI Pipe token ------------------------------ */

// The token travels in the URL path (the API uses it for the student's own LLM calls), so only URL-safe characters are
// accepted: that also makes encodeURIComponent a no-op and rules out path or query injection.
const TOKEN_PATTERN = /^[A-Za-z0-9._~-]+$/;

function decodeExpiry(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const padded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = typeof atob === 'function'
      ? decodeURIComponent(Array.from(atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, '=')), (c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`).join(''))
      : Buffer.from(padded, 'base64').toString('utf8');
    const exp = Number(JSON.parse(json).exp);
    return Number.isFinite(exp) && exp > 0 ? exp * 1000 : null;
  } catch {
    return null;
  }
}

/** Validates the aipipe.org token from the sidebar field. Returns `{ ok: true, token, expiresAt }` or `{ ok: false, … }`. */
export function checkToken(raw, now = Date.now()) {
  const token = String(raw ?? '').trim();
  if (!token) return fail('NO_TOKEN', 'Paste your aipipe.org token into the token box in the sidebar, then press Initialize Workspace again.');
  if (token.length > 4096) return fail('BAD_TOKEN', 'That token is far too long to be an aipipe.org token.');
  if (!TOKEN_PATTERN.test(token)) return fail('BAD_TOKEN', 'That does not look like an aipipe.org token (it should be one long string of letters, digits, dots, dashes and underscores — no spaces, quotes or slashes). Copy it again from aipipe.org.');
  const expiresAt = decodeExpiry(token);
  if (expiresAt !== null && expiresAt <= now) {
    return fail('TOKEN_EXPIRED', `That token expired on ${new Date(expiresAt).toUTCString()}. Get a fresh one from aipipe.org and paste it again — tokens stop working when your aipipe session ends.`);
  }
  return { ok: true, token, expiresAt };
}

/* ------------------------------ URLs the exam needs ------------------------------ */

export function tenantBase(email, token, origin = GA3_API_ORIGIN) {
  const checked = checkToken(token);
  if (!checked.ok && checked.code !== 'TOKEN_EXPIRED') throw new Error(checked.message);
  return `${origin}/ga5/${encodeURIComponent(apiEmail(email))}/${String(token).trim()}`;
}

/** Q2: the A2A interface base URL (the Agent Card must list exactly this). Keeps its trailing slash. */
export const a2aBase = (email, token, origin) => `${tenantBase(email, token, origin)}/a2a/`;
/** Q3: the single mailroom endpoint (propose / commit). */
export const mailroomUrl = (email, token, origin) => `${tenantBase(email, token, origin)}/mailroom`;
/** Q4: the incident-agent base URL (the grader appends /v2/incidents…). */
export const incidentBase = (email, token, origin) => tenantBase(email, token, origin);
export const healthUrl = (email, origin = GA3_API_ORIGIN) => `${origin}/ga5/${encodeURIComponent(apiEmail(email))}/health`;
export const cardUrl = (origin = GA3_API_ORIGIN) => `${origin}/.well-known/agent-card.json`;

/** Replaces the token with "…" for anything shown on screen or logged. */
export function redact(text, token) {
  const secret = String(token ?? '').trim();
  return secret ? String(text).split(secret).join('«your-token»') : String(text);
}

/* ------------------------------ onboarding ------------------------------ */

async function timed(fetchImpl, url, init = {}, timeoutMs = 20000) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    return await fetchImpl(url, controller ? { ...init, signal: controller.signal } : init);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Registers the student's A2A base URL in the shared Agent Card (the grader reads that card) and stores the token for the
 * student's tenant. Wakes the Render API first; the response is only trusted if it points back at this API for this email.
 */
export async function onboardTenant({ email, token, origin = GA3_API_ORIGIN, fetchImpl = globalThis.fetch, sleep, now, onStatus, wake = true } = {}) {
  if (typeof fetchImpl !== 'function') return fail('NO_FETCH', 'This browser cannot make network requests from the page.');
  const checked = checkToken(token, typeof now === 'function' ? now() : Date.now());
  if (!checked.ok) return checked;
  let normalized;
  try {
    normalized = apiEmail(email);
  } catch (error) {
    return fail('BAD_EMAIL', error.message);
  }
  if (wake) {
    onStatus?.('Checking that the API is awake…');
    if (!(await waitForApi({ origin, fetchImpl, sleep, now, onStatus }))) {
      return fail('API_UNREACHABLE', 'The API did not wake up in time, so nothing was sent. Open its /health link, wait for it to load, then try again.');
    }
  }
  onStatus?.('Registering your endpoints…');
  let response;
  try {
    response = await timed(fetchImpl, `${origin}/ga5/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalized, aipipe_token: checked.token }),
      credentials: 'omit',
      cache: 'no-store',
    }, 60000);
  } catch (error) {
    return fail(error?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK', error?.name === 'AbortError' ? 'The API took too long to answer. Wait a minute and try again.' : `The API could not be reached (${error?.message || 'network error'}).`);
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (response.status === 429) return fail('RATE_LIMITED', 'The API is busy. Wait a minute and try again.');
  if (!response.ok || !data) return fail(`HTTP_${response.status}`, `Registration failed (HTTP ${response.status}). Wait a minute and try again.`);
  const expectedPrefix = `${origin}/ga5/${encodeURIComponent(normalized)}`;
  const routes = Array.isArray(data.ready_routes) ? data.ready_routes : [];
  if (data.has_token !== true || data.solver_url_prefix !== expectedPrefix || !routes.some((r) => r === `${expectedPrefix}/mailroom`) || !routes.some((r) => r === `${expectedPrefix}/v2/incidents`)) {
    return fail('BAD_RESPONSE', 'The API replied in an unexpected format, so the registration was not trusted. Try again; if it repeats, use the API dashboard.');
  }
  return { ok: true, prefix: data.solver_url_prefix };
}

/* ------------------------------ pre-flight probes ------------------------------ */

const rid = () => `probe${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
const check = (id, label, ok, detail) => ({ id, label, ok: Boolean(ok), detail: String(detail ?? '') });

async function call(fetchImpl, url, init = {}) {
  try {
    const response = await timed(fetchImpl, url, { redirect: 'manual', credentials: 'omit', cache: 'no-store', ...init }, 25000);
    let body = null;
    const type = String(response.headers?.get?.('content-type') || '');
    try {
      body = /json/i.test(type) ? await response.json() : null;
    } catch {
      body = null;
    }
    return { ok: true, status: response.status, type, body, redirected: response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400) };
  } catch (error) {
    return { ok: false, error: error?.name === 'AbortError' ? 'timed out' : (error?.message || 'network error') };
  }
}

const A2A_HEADERS = { 'A2A-Version': '1.0', Accept: 'application/a2a+json', 'Content-Type': 'application/a2a+json' };
const clientError = (status) => status === 400 || status === 422;

/** What a grader would look at first for Q2, without spending a Check and without any model call. */
export async function probeA2a({ base, token, fetchImpl = globalThis.fetch }) {
  const out = [];
  const origin = new URL(base).origin;
  const auth = { ...A2A_HEADERS, Authorization: `Bearer ${token}` };

  const card = await call(fetchImpl, cardUrl(origin), { headers: { Accept: 'application/json' } });
  const c = card.body;
  const skill = Array.isArray(c?.skills) ? c.skills.find((s) => s?.id === 'invoice_action_agent') : null;
  const iface = Array.isArray(c?.supportedInterfaces) ? c.supportedInterfaces.find((i) => i?.url === base && i?.protocolBinding === 'HTTP+JSON' && String(i?.protocolVersion) === '1.0') : null;
  out.push(check('card-shape', 'Agent Card is public and complete', card.ok && card.status === 200 && ['name', 'description', 'version'].every((k) => typeof c?.[k] === 'string' && c[k].trim()) && c?.capabilities && typeof c.capabilities === 'object' && skill && skill.name && skill.description && Array.isArray(skill.tags) && skill.tags.length > 0, card.ok ? `HTTP ${card.status}` : card.error));
  out.push(check('card-interface', 'Agent Card lists your exact base URL', iface, iface ? 'found' : 'Not listed yet — press “Register my endpoints” (the card only lists registered students).'));
  out.push(check('card-modes', 'Agent Card declares the input and output media types', Array.isArray(c?.defaultInputModes) && c.defaultInputModes.includes(A2A_INPUT_MODE) && A2A_OUTPUT_MODES.every((m) => Array.isArray(c?.defaultOutputModes) && c.defaultOutputModes.includes(m)), 'input and output modes'));

  const noAuth = await call(fetchImpl, `${base}tasks`, { headers: A2A_HEADERS });
  out.push(check('auth-missing', 'Missing Bearer token is refused (401/403)', noAuth.ok && (noAuth.status === 401 || noAuth.status === 403), noAuth.ok ? `HTTP ${noAuth.status}` : noAuth.error));
  const scheme = await call(fetchImpl, `${base}tasks`, { headers: { ...A2A_HEADERS, Authorization: `Basic ${token}` } });
  out.push(check('auth-scheme', 'A non-Bearer Authorization header is refused (401/403)', scheme.ok && (scheme.status === 401 || scheme.status === 403), scheme.ok ? `HTTP ${scheme.status}` : scheme.error));
  const stranger = await call(fetchImpl, `${base}tasks`, { headers: { ...auth, Authorization: `Bearer probe-stranger-${rid()}` } });
  out.push(check('isolation-empty', 'A brand-new Bearer user sees an empty task list', stranger.ok && stranger.status === 200 && Array.isArray(stranger.body?.tasks) && stranger.body.tasks.length === 0, stranger.ok ? `HTTP ${stranger.status}` : stranger.error));
  const version = await call(fetchImpl, `${base}tasks`, { headers: { ...auth, 'A2A-Version': '2.0' } });
  out.push(check('version', 'Another A2A-Version is refused (400)', version.ok && version.status === 400, version.ok ? `HTTP ${version.status}` : version.error));
  const list = await call(fetchImpl, `${base}tasks`, { headers: auth });
  out.push(check('list', 'Authenticated task list returns {"tasks": [...]}', list.ok && list.status === 200 && Array.isArray(list.body?.tasks) && /json/i.test(list.type), list.ok ? `HTTP ${list.status}` : list.error));
  const bad = await call(fetchImpl, `${base}message:send`, { method: 'POST', headers: auth, body: JSON.stringify({}) });
  out.push(check('bad-message', 'An empty message is rejected (400/422), not a crash', bad.ok && clientError(bad.status), bad.ok ? `HTTP ${bad.status}` : bad.error));
  const missing = await call(fetchImpl, `${base}tasks/${rid()}`, { headers: auth });
  out.push(check('unknown-task', 'An unknown task is 404/403 and does not echo the id', missing.ok && (missing.status === 404 || missing.status === 403) && !JSON.stringify(missing.body ?? '').includes('probe'), missing.ok ? `HTTP ${missing.status}` : missing.error));
  return out;
}

/** Mailroom: validation failures must come back before any model work. */
export async function probeMailroom({ url, fetchImpl = globalThis.fetch }) {
  const out = [];
  const post = (body) => call(fetchImpl, url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const verifier = { algorithm: 'Ed25519', publicKeyJwk: { kty: 'OKP', crv: 'Ed25519', x: 'A'.repeat(43) } };

  const op = await post({ profile: 'ga5-mailroom-action-gate/v2', operation: 'bogus', evaluationId: rid() });
  out.push(check('bad-operation', 'An unknown operation is rejected (400/422)', op.ok && clientError(op.status) && /json/i.test(op.type), op.ok ? `HTTP ${op.status}` : op.error));
  const dup = await post({
    profile: 'ga5-mailroom-action-gate/v2', operation: 'propose', evaluationId: rid(), receiptVerifier: verifier,
    corpus: { coreId: 'x', auditId: 'y', stableCount: 2, freshCount: 0 },
    allowedActions: ['create_draft', 'update_internal_record', 'send_approved_notice', 'request_confirmation', 'quarantine_item', 'no_action'],
    dossiers: [{ dossierId: 'same', partition: 'stable_core', receivedAt: '2026-10-01T00:00:00Z', mailbox: 'support', objective: 'x', sources: [] }, { dossierId: 'same', partition: 'stable_core', receivedAt: '2026-10-01T00:00:00Z', mailbox: 'support', objective: 'x', sources: [] }],
  });
  out.push(check('duplicate-dossiers', 'Duplicate dossier ids are rejected (400/422)', dup.ok && clientError(dup.status), dup.ok ? `HTTP ${dup.status}` : dup.error));
  const commit = await post({ profile: 'ga5-mailroom-action-gate/v2', operation: 'commit', evaluationId: rid(), inputDigest: 'a'.repeat(64), receipts: [] });
  out.push(check('unknown-commit', 'Committing an unknown evaluation is refused', commit.ok && commit.status >= 400 && commit.status < 500, commit.ok ? `HTTP ${commit.status}` : commit.error));
  out.push(check('no-redirect', 'Responses are JSON and never redirect', [op, dup, commit].every((r) => r.ok && !r.redirected && /json/i.test(r.type)), 'JSON, no redirect'));
  return out;
}

/** Incident agent: routes, profile check and unknown-run handling. */
export async function probeIncident({ base, fetchImpl = globalThis.fetch }) {
  const out = [];
  const root = base.replace(/\/+$/, '');
  const wrongProfile = await call(fetchImpl, `${root}/v2/incidents`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ profile: 'not-a-profile', runId: rid() }) });
  out.push(check('bad-profile', 'An unsupported profile is rejected (400/422)', wrongProfile.ok && clientError(wrongProfile.status), wrongProfile.ok ? `HTTP ${wrongProfile.status}` : wrongProfile.error));
  const unknown = await call(fetchImpl, `${root}/v2/incidents/${rid()}`, {});
  out.push(check('unknown-run', 'An unknown run id is 404', unknown.ok && unknown.status === 404, unknown.ok ? `HTTP ${unknown.status}` : unknown.error));
  const receipt = await call(fetchImpl, `${root}/v2/incidents/${rid()}/receipts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receiptId: rid(), outcomes: [] }) });
  out.push(check('unknown-receipt', 'A receipt for an unknown run is refused', receipt.ok && receipt.status >= 400 && receipt.status < 500, receipt.ok ? `HTTP ${receipt.status}` : receipt.error));
  out.push(check('no-redirect', 'Responses are JSON and never redirect', [wrongProfile, unknown, receipt].every((r) => r.ok && !r.redirected), 'no redirect'));
  return out;
}

export function summarizeProbes(results) {
  const failed = results.filter((r) => !r.ok);
  return { passed: results.length - failed.length, total: results.length, failed, allPassed: failed.length === 0 };
}
