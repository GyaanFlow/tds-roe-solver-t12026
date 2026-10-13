import { escapeHtml, markdownCodeBlock } from './utils.js';
import { T3_GA1_API_ORIGIN, apiEmail } from './api-client.js';

export const id = 'q-ledger-agent-server';
export const title = 'Q15: The Ledger Agent';

const QUESTION_ID = 'q-ledger-agent-server';
const EXAM_HOST = 'exam.sanand.workers.dev';
const WAKE_TIMEOUT_MS = 75000;
const WAKE_POLL_MS = 3000;
const HEALTH_PROBE_TIMEOUT_MS = 15000;
const ONBOARD_TIMEOUT_MS = 60000;
const LEDGER_URL_HINT = `https://${EXAM_HOST}/questionData?email=…&quizSign=…&questionId=${QUESTION_ID}&path=/`;

function fail(code, message) {
  return { ok: false, code, message };
}

const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Students paste this from a `<pre>` block, a chat message, or a whole `curl "..."` line, so take
 * the first http(s) URL in the text and drop wrapping quotes and trailing sentence punctuation.
 */
export function extractLedgerUrl(raw) {
  const match = String(raw ?? '').match(/https?:\/\/[^\s"'`<>]+/i);
  return match ? match[0].replace(/[),.;\]]+$/, '') : '';
}

/**
 * Check a pasted Ledger link before anything leaves the browser. The API answers three different
 * mistakes (wrong host, wrong question, someone else's email) with the same generic 400, so this
 * is where the student gets a specific, fixable message — and where a signed link is stopped from
 * being sent anywhere other than the official exam host.
 */
export function validateLedgerUrl(rawInput, email) {
  const expectedEmail = apiEmail(email);
  const raw = extractLedgerUrl(rawInput);
  if (!raw) {
    return fail('EMPTY', `Paste your private Q15 Ledger URL first. It looks like ${LEDGER_URL_HINT}`);
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    return fail('BAD_URL', 'That does not look like a complete URL. Copy the whole link from the Q15 question on your exam page.');
  }
  if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== EXAM_HOST) {
    return fail('WRONG_HOST', `The Ledger link must be on https://${EXAM_HOST}. This one points at ${url.host || 'another site'}, so it was not sent anywhere.`);
  }
  if (url.pathname !== '/questionData') {
    return fail('WRONG_PATH', 'This is not a questionData link. Copy the link shown under “Your company\'s API” in Q15.');
  }

  const questionId = url.searchParams.get('questionId');
  if (questionId !== QUESTION_ID) {
    return fail('WRONG_QUESTION', `This link is for ${questionId ? `“${questionId}”` : 'no question'}, not Q15 (${QUESTION_ID}). Copy the link from Q15 — “The Ledger Agent”.`);
  }
  if (!url.searchParams.get('quizSign')) {
    return fail('NO_SIGNATURE', 'The link has no quizSign. Copy the complete link from the exam page, including everything after the ?.');
  }

  const linkEmail = url.searchParams.get('email') || '';
  const linkEmails = [linkEmail, linkEmail.replaceAll(' ', '+')].map((value) => value.trim().toLowerCase());
  if (!linkEmails.includes(expectedEmail)) {
    return fail('EMAIL_MISMATCH', `This link belongs to ${linkEmail || 'a different account'}, but the workspace email is ${expectedEmail}. Use the same email in both places.`);
  }

  return { ok: true, url: raw };
}

async function fetchWithTimeout(fetchImpl, url, init, timeoutMs) {
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    return await fetchImpl(url, controller ? { ...init, signal: controller.signal } : init);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Render's free tier sleeps, and its first response afterwards can be a proxy 5xx that a browser
 * reports as a CORS failure. Poll /health until the API answers, so the signed link is only ever
 * sent to a service that is actually up. Any non-5xx response counts as awake.
 */
export async function waitForApi({
  origin = T3_GA1_API_ORIGIN,
  fetchImpl = globalThis.fetch,
  timeoutMs = WAKE_TIMEOUT_MS,
  pollMs = WAKE_POLL_MS,
  sleep = defaultSleep,
  now = Date.now,
  onStatus,
} = {}) {
  const deadline = now() + timeoutMs;
  for (let attempt = 1; ; attempt += 1) {
    try {
      const response = await fetchWithTimeout(fetchImpl, `${origin}/health`, { cache: 'no-store', credentials: 'omit' }, HEALTH_PROBE_TIMEOUT_MS);
      if (response.status < 500) return true;
    } catch {
      // Still starting up (or briefly unreachable); retry until the deadline.
    }
    if (now() >= deadline) return false;
    if (attempt === 1 || attempt % 3 === 0) {
      onStatus?.('Waking the API… the first request after it sleeps can take up to a minute.');
    }
    await sleep(pollMs);
  }
}

/** The API's response is only trusted if it points back at this API, for this email. */
export function isExpectedSubmitUrl(submitUrl, email, origin = T3_GA1_API_ORIGIN) {
  let url;
  try {
    url = new URL(submitUrl);
  } catch {
    return false;
  }
  if (url.origin !== new URL(origin).origin || url.search || url.hash) return false;
  const match = url.pathname.match(/^\/ga1\/([^/]+)\/ledger\/([A-Za-z0-9_-]+)\/answer$/);
  if (!match) return false;
  try {
    return decodeURIComponent(match[1]).toLowerCase() === apiEmail(email);
  } catch {
    return false;
  }
}

function describeApiError(status, data) {
  const code = typeof data?.error === 'string' ? data.error : '';
  const upstream = Number(data?.upstream_status);
  if (status === 400 && code === 'VALID_LEDGER_QUESTION_DATA_URL_REQUIRED') {
    return fail(code, 'The API did not accept that as your Q15 Ledger link (wrong email, question, or host). Copy it again from the Q15 question on the exam page.');
  }
  if (status === 400 && code === 'VALID_EMAIL_REQUIRED') {
    return fail(code, 'The API did not receive a valid email. Check the email in the main form and run again.');
  }
  if (code === 'LEDGER_UPSTREAM_REJECTED' && (upstream === 401 || upstream === 403)) {
    return fail(code, 'The exam server rejected your signature — it may have expired. Reload the exam page, copy a fresh Ledger link from Q15, and try again.');
  }
  if (code === 'LEDGER_UPSTREAM_REJECTED') {
    return fail(code, `The exam server answered HTTP ${upstream || 'error'} for that link. Copy a fresh Ledger link from Q15 and try again.`);
  }
  if (status === 504 || code === 'LEDGER_DISCOVERY_TIMEOUT') {
    return fail(code || 'LEDGER_DISCOVERY_TIMEOUT', 'The API could not finish reading your ledger in time. Wait a minute and press Generate again.');
  }
  if (status === 429) {
    return fail('RATE_LIMITED', 'The API is busy right now. Wait a minute and press Generate again.');
  }
  return fail(code || `HTTP_${status}`, `Onboarding failed (${code || `HTTP ${status}`}). Wait a minute and try again; if it keeps failing, use the API dashboard link below.`);
}

/**
 * Validate → wake → send the signed link once → verify the reply. Returns `{ ok: true, submitUrl }`
 * or `{ ok: false, code, message }`; it never throws for expected failures.
 */
export async function onboardLedger({
  email,
  rawUrl,
  origin = T3_GA1_API_ORIGIN,
  fetchImpl = globalThis.fetch,
  timeoutMs = ONBOARD_TIMEOUT_MS,
  wake = true,
  sleep,
  now,
  onStatus,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    return fail('NO_FETCH', 'This browser cannot make network requests from the page. Use the API dashboard link below instead.');
  }

  let checked;
  try {
    checked = validateLedgerUrl(rawUrl, email);
  } catch (error) {
    return fail('BAD_EMAIL', error.message);
  }
  if (!checked.ok) return checked;

  if (wake) {
    onStatus?.('Checking that the API is awake…');
    const awake = await waitForApi({ origin, fetchImpl, sleep, now, onStatus });
    if (!awake) {
      return fail('API_UNREACHABLE', 'The API did not wake up in time, so your link was not sent. Open the /health link below, wait for it to load, then press Generate again.');
    }
  }

  onStatus?.('Verifying your Ledger link with the exam server…');
  let response;
  try {
    response = await fetchWithTimeout(fetchImpl, `${origin}/ga1/onboard`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: apiEmail(email), question_data_url: checked.url }),
      credentials: 'omit',
      cache: 'no-store',
    }, timeoutMs);
  } catch (error) {
    return error?.name === 'AbortError'
      ? fail('TIMEOUT', 'The API took too long to answer. Wait a minute and press Generate again.')
      : fail('NETWORK', `The API could not be reached (${error?.message || 'network error'}). Check your connection and press Generate again.`);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) return describeApiError(response.status, data);

  const submitUrl = typeof data?.submit_url === 'string' ? data.submit_url : '';
  if (!isExpectedSubmitUrl(submitUrl, email, origin)) {
    return fail('BAD_RESPONSE', 'The API replied with a URL in an unexpected format, so it was not used. Press Generate again; if it repeats, use the API dashboard link below.');
  }
  return { ok: true, submitUrl };
}

function formHtml(email) {
  const field = 'width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:1px solid var(--border,#3d5f96);background:var(--bg-input,#0b1930);color:var(--text-primary,#e8f0fe);font-family:var(--font-mono,monospace);font-size:13px;';
  return [
    `<div id="t3q15Root" data-email="${escapeHtml(email)}" style="border:1px solid var(--border,#2d4d80);border-radius:14px;padding:18px;margin:14px 0;background:rgba(77,166,255,0.06);">`,
    '<div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:var(--theme-primary,#4da6ff);margin-bottom:12px;">Generate your live Ledger URL</div>',
    '<label for="t3q15Email" style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;">1. Your exam email (from the main form)</label>',
    `<input id="t3q15Email" type="text" readonly value="${escapeHtml(email)}" style="${field}margin-bottom:12px;opacity:0.85;" />`,
    '<label for="t3q15Url" style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;">2. Your private Q15 Ledger URL (from the exam page)</label>',
    `<textarea id="t3q15Url" rows="3" spellcheck="false" autocomplete="off" placeholder="${escapeHtml(LEDGER_URL_HINT)}" style="${field}resize:vertical;"></textarea>`,
    '<button type="button" id="t3q15Go" onclick="window._t3ga1q15Generate()" style="margin-top:12px;background:var(--theme-primary,#3b82f6);color:#000;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">⚡ Generate live URL</button>',
    '<div id="t3q15Status" role="status" aria-live="polite" style="margin-top:10px;font-size:13px;font-weight:600;min-height:18px;"></div>',
    '</div>',
  ].join('\n');
}

function buildGuide(email, generatedUrl) {
  const privacy = [
    '#### What happens to your link',
    '',
    `Your Ledger link contains your exam signature. Pressing **Generate** sends it once to this project's API (\`${T3_GA1_API_ORIGIN}\`), which checks it with the exam server and returns the URL to submit. This page does not store it. The submit URL it returns also contains your signature in URL-safe form, so keep it as private as the original link.`,
  ];
  const wake = [
    '#### Before you press Check',
    '',
    `The API sleeps when idle and the first request after a sleep can take 30–50 seconds — longer than the grader's 15-second limit per question. Open [${T3_GA1_API_ORIGIN}/health](${T3_GA1_API_ORIGIN}/health) once, wait for it to load, then press **Check**. The dashboard at [${T3_GA1_API_ORIGIN}/ga1/](${T3_GA1_API_ORIGIN}/ga1/) can also generate this URL if the button here fails.`,
  ];

  if (generatedUrl) {
    return [
      `### ${title}`,
      '',
      'Your live URL is ready in the **Answer** box. Paste it into Q15 on the exam page and press **Check**.',
      '',
      '#### Test it first (optional)',
      '',
      markdownCodeBlock(`curl -s -X POST "${generatedUrl}" -H "Content-Type: application/json" -d '{"question":"What was the total revenue in USD from the North region in March 2026?"}'`, 'sh'),
      '',
      ...wake,
      '',
      ...privacy,
      '',
      '#### Need a new URL?',
      '',
      'If your exam signature changed, generate again with a fresh link:',
      '',
      formHtml(email),
    ].join('\n');
  }

  return [
    `### ${title}`,
    '',
    'This question needs **your own private ledger link**, so the answer cannot be prepared in advance. Do this once:',
    '',
    '1. Open **Q15 — The Ledger Agent** on your exam page and copy the link shown under “Your company\'s API”.',
    '2. Paste it into the box below and press **Generate live URL**.',
    '3. The **Answer** box fills with the URL to submit. Paste that into the exam and press **Check**.',
    '',
    formHtml(email),
    '',
    ...wake,
    '',
    ...privacy,
  ].join('\n');
}

function registerQ15Interactive() {
  if (typeof window === 'undefined' || window._t3ga1q15Registered) return;
  window._t3ga1q15Registered = true;

  window._t3ga1q15Generate = async function t3ga1q15Generate() {
    const root = document.getElementById('t3q15Root');
    if (!root) return;
    const email = root.dataset.email || '';
    const input = document.getElementById('t3q15Url');
    const button = document.getElementById('t3q15Go');
    const status = document.getElementById('t3q15Status');
    const show = (text, color) => {
      if (!status) return;
      status.style.color = color;
      status.textContent = text;
    };

    if (button) button.disabled = true;
    try {
      const outcome = await onboardLedger({
        email,
        rawUrl: input ? input.value : '',
        onStatus: (text) => show(text, '#4da6ff'),
      });
      if (!outcome.ok) {
        show(outcome.message, '#e5484d');
        return;
      }
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, solvedResult(email, outcome.submitUrl));
      if (!patched) {
        show(`Live URL: ${outcome.submitUrl}`, '#198754');
      }
    } finally {
      if (button) button.disabled = false;
    }
  };
}

function solvedResult(email, submitUrl) {
  return {
    type: 'solved',
    answer: submitUrl,
    variant: `Ledger agent endpoint for ${apiEmail(email)}`,
    guide: buildGuide(email, submitUrl),
    answerDisplay: [
      `### ${title}`,
      '',
      '**Submit this URL:**',
      '',
      markdownCodeBlock(submitUrl, 'text'),
      '',
      'It contains your exam signature in URL-safe form — keep it private like the original link.',
    ].join('\n'),
    usesHostedApi: true,
  };
}

export async function solve(email) {
  registerQ15Interactive();
  const normalized = apiEmail(email);
  return {
    type: 'guide',
    answer: 'NOT GENERATED YET — paste your private Q15 Ledger URL into the form above and press “Generate live URL”. This box will then show the URL to submit.',
    variant: 'Needs your private Ledger URL',
    guide: buildGuide(normalized, ''),
    answerDisplay: '### Waiting for your private Ledger URL\n\nUse the form in the **Implementation Guide** panel. Once it succeeds, the Answer box shows the live URL to submit.',
    usesHostedApi: true,
    debug: { question: 'Q15', needsUserInput: true, apiOrigin: T3_GA1_API_ORIGIN },
  };
}
