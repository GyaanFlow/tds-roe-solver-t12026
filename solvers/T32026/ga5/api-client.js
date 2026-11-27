// URL builders, wake-up and pre-flight probes for the T3 GA5 hub (tds-roe-solver-api, mounted at /t3ga5).
// Everything takes an injectable fetch/sleep so it can be tested without a network.

export const T3_API_ORIGIN = 'https://tds-roe-solver-api-t12026.onrender.com';
export const RAG_LIMIT_MS = 8000; // the grader's per-request limit for the Q1 gauntlet
const EMAIL_PATTERN = /^[^\s@/?#]+@[^\s@/?#]+\.[^\s@/?#]+$/;

/** The exam seeds Q1 and Q2 with the trimmed, lower-cased email, so the hub URL must use exactly that form. */
export function examEmail(raw) {
  const email = String(raw ?? '').trim().toLowerCase();
  return email.length <= 254 && EMAIL_PATTERN.test(email) ? email : '';
}

export function t3ga5Url(email, suffix = '', origin = T3_API_ORIGIN) {
  const norm = examEmail(email);
  if (!norm) throw new Error('A valid exam email is required.');
  return `${origin}/t3ga5/${encodeURIComponent(norm)}${suffix}`;
}

export const healthUrl = (origin = T3_API_ORIGIN) => `${origin}/t3ga5/health`;
export const scriptUrl = (email, origin) => t3ga5Url(email, '/answers/ollama-script', origin);
export const datasetUrl = (email, origin) => t3ga5Url(email, '/answers/ollama-dataset', origin);
export const kbUrl = (email, origin) => t3ga5Url(email, '/kb', origin);

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** The free Render tier sleeps; poll /t3ga5/health until it answers. Never throws. */
export async function wakeApi({ origin = T3_API_ORIGIN, fetchImpl = globalThis.fetch, sleep = defaultSleep, tries = 6, delayMs = 8000, onStatus = () => {} } = {}) {
  if (typeof fetchImpl !== 'function') return { ok: false, tries: 0 };
  for (let attempt = 1; attempt <= tries; attempt += 1) {
    onStatus(attempt === 1 ? 'Waking the server (the free tier can take up to a minute)…' : `Still waking… (try ${attempt} of ${tries})`);
    try {
      const response = await fetchImpl(healthUrl(origin), { cache: 'no-store' });
      if (response?.ok) {
        const body = await response.json().catch(() => null);
        if (!body || body.status === 'ok' || body.ok === true) return { ok: true, tries: attempt };
      }
    } catch { /* asleep or offline: try again */ }
    if (attempt < tries) await sleep(delayMs);
  }
  return { ok: false, tries };
}

async function timed(fetchImpl, url, init) {
  const started = Date.now();
  const response = await fetchImpl(url, { cache: 'no-store', redirect: 'manual', ...init });
  return { response, ms: Date.now() - started };
}

const json = (body) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
const row = (label, ok, detail) => ({ label, ok: Boolean(ok), detail: String(detail ?? '') });
const safe = async (label, fn) => {
  try { return await fn(); } catch (error) { return row(label, false, `could not run: ${error?.message || error}`); }
};

/** Q1: checks the knowledge base, the /query contract and the error handling. Calls no model and spends no Check. */
export async function probeRag({ base, fetchImpl = globalThis.fetch }) {
  const results = [];
  let passages = [];
  results.push(await safe('Knowledge base is served (50 passages)', async () => {
    const { response } = await timed(fetchImpl, `${base}/kb`);
    const body = await response.json().catch(() => null);
    passages = Array.isArray(body?.passages) ? body.passages : [];
    return row('Knowledge base is served (50 passages)', response.ok && body?.count === 50 && passages.length === 50, `HTTP ${response.status}, ${passages.length} passages`);
  }));
  const first = String(typeof passages[0] === 'string' ? passages[0] : passages[0]?.text ?? '').split(/(?<=[.!?])\s/)[0].slice(0, 160) || 'What is retrieval augmented generation?';
  results.push(await safe('/query returns the exact contract', async () => {
    const { response, ms } = await timed(fetchImpl, `${base}/query`, json(JSON.stringify({ question: first.replace(/[.!?]+$/, '?'), top_k: 3 })));
    const body = await response.json().catch(() => null);
    const sources = body?.sources;
    const scores = body?.scores;
    const shapeOk = body && (typeof body.answer === 'string' || body.answer === null) && Array.isArray(sources) && Array.isArray(scores) && sources.length === scores.length && typeof body.confidence === 'number' && body.confidence >= 0 && body.confidence <= 1;
    const sourcesOk = shapeOk && sources.every((s) => Number.isInteger(s) && s >= 0 && s < 50) && scores.every((s, i) => typeof s === 'number' && s >= 0 && s <= 1 && (i === 0 || s <= scores[i - 1]));
    return row('/query returns the exact contract', response.ok && sourcesOk, `HTTP ${response.status}, ${ms} ms, ${sources?.length ?? '?'} sources`);
  }));
  results.push(await safe('A reply arrives inside the 8-second limit', async () => {
    const { response, ms } = await timed(fetchImpl, `${base}/query`, json(JSON.stringify({ question: 'What is the main idea here?' })));
    return row('A reply arrives inside the 8-second limit', response.ok && ms < RAG_LIMIT_MS, `${ms} ms`);
  }));
  results.push(await safe('A missing question is refused with 400', async () => {
    const { response } = await timed(fetchImpl, `${base}/query`, json('{}'));
    return row('A missing question is refused with 400', response.status === 400, `HTTP ${response.status}`);
  }));
  results.push(await safe('Broken JSON is refused with 400 (no crash)', async () => {
    const { response } = await timed(fetchImpl, `${base}/query`, json('{not json'));
    return row('Broken JSON is refused with 400 (no crash)', response.status === 400, `HTTP ${response.status}`);
  }));
  return results;
}

/** Q4: checks the batch contract and error handling with empty and duplicate batches (no real cases are judged). */
export async function probeHarness({ url, fetchImpl = globalThis.fetch }) {
  const results = [];
  results.push(await safe('An empty batch is answered with the profile and no results', async () => {
    const { response, ms } = await timed(fetchImpl, url, json(JSON.stringify({ batchId: 'preflight', cases: [] })));
    const body = await response.json().catch(() => null);
    return row('An empty batch is answered with the profile and no results', response.ok && typeof body?.profile === 'string' && body.batchId === 'preflight' && Array.isArray(body.results) && body.results.length === 0, `HTTP ${response.status}, ${ms} ms, profile ${body?.profile ?? '?'}`);
  }));
  results.push(await safe('A duplicate caseId is refused with 422', async () => {
    const { response } = await timed(fetchImpl, url, json(JSON.stringify({ batchId: 'dup', cases: [{ caseId: 'a' }, { caseId: 'a' }] })));
    return row('A duplicate caseId is refused with 422', response.status === 422, `HTTP ${response.status}`);
  }));
  results.push(await safe('A malformed case still gets a safe decision', async () => {
    const { response } = await timed(fetchImpl, url, json(JSON.stringify({ batchId: 'bad', cases: [{ caseId: 'only-id' }] })));
    const body = await response.json().catch(() => null);
    const item = body?.results?.[0];
    return row('A malformed case still gets a safe decision', response.ok && item?.caseId === 'only-id' && typeof item.requestDecision === 'string' && typeof item.route === 'string', `HTTP ${response.status}`);
  }));
  results.push(await safe('Broken JSON is refused with 400 (no crash)', async () => {
    const { response } = await timed(fetchImpl, url, json('{not json'));
    return row('Broken JSON is refused with 400 (no crash)', response.status === 400, `HTTP ${response.status}`);
  }));
  results.push(await safe('A non-object body is refused with 400', async () => {
    const { response } = await timed(fetchImpl, url, json('[1,2,3]'));
    return row('A non-object body is refused with 400', response.status === 400, `HTTP ${response.status}`);
  }));
  return results;
}

export function summarizeProbes(results) {
  const failed = results.filter((r) => !r.ok);
  return { passed: results.length - failed.length, total: results.length, failed, allPassed: results.length > 0 && failed.length === 0 };
}
