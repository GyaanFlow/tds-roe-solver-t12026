import { escapeHtml, markdownCodeBlock } from './utils.js';
import { T3_GA1_API_ORIGIN, apiEmail, ga1Url } from './api-client.js';
import { extractLedgerUrl, waitForApi } from './q15-ledger-agent.js';
import { helperSection, registerHelperCopy } from './console-helper-guide.js';

export const id = 'q-http-headers-server';
export const title = 'Q2: Find the Code in the Response Headers';

const QUESTION_ID = 'q-http-headers-server';
const EXAM_HOST = 'exam.sanand.workers.dev';
const REQUEST_TIMEOUT_MS = 60000;
const URL_HINT = `https://${EXAM_HOST}/questionData?email=…&quizSign=…&questionId=${QUESTION_ID}`;
// The API signs and fetches the headers resource itself, so a link from any GA1 question carries the
// same signature; Q2's own link is the one students will naturally have in front of them.
const GA1_QUESTION_ID = /^q-[a-z0-9-]{3,80}$/;

function fail(code, message) {
  return { ok: false, code, message };
}

/**
 * Check a pasted questionData link before it leaves the browser: exam host only, a signature
 * present, and the same email as the workspace. Returns `{ ok: true, url }` or `{ ok: false, … }`.
 */
export function validateQuestionDataUrl(rawInput, email) {
  const expectedEmail = apiEmail(email);
  const raw = extractLedgerUrl(rawInput);
  if (!raw) {
    return fail('EMPTY', `Paste your private Q2 link first. It looks like ${URL_HINT}`);
  }

  let url;
  try {
    url = new URL(raw);
  } catch {
    return fail('BAD_URL', 'That does not look like a complete URL. Copy the whole link from the curl command on your exam page.');
  }
  if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== EXAM_HOST) {
    return fail('WRONG_HOST', `The link must be on https://${EXAM_HOST}. This one points at ${url.host || 'another site'}, so it was not sent anywhere.`);
  }
  if (url.pathname !== '/questionData') {
    return fail('WRONG_PATH', 'This is not a questionData link. Copy the URL inside the curl -i "…" command shown in Q2.');
  }
  const questionId = url.searchParams.get('questionId') || '';
  if (!GA1_QUESTION_ID.test(questionId)) {
    return fail('WRONG_QUESTION', 'The link has no valid question id. Copy the complete URL from the Q2 curl command, including everything after the ?.');
  }
  if (!url.searchParams.get('quizSign')) {
    return fail('NO_SIGNATURE', 'The link has no quizSign. Copy the complete URL from the exam page, including everything after the ?.');
  }

  const linkEmail = url.searchParams.get('email') || '';
  const linkEmails = [linkEmail, linkEmail.replaceAll(' ', '+')].map((value) => value.trim().toLowerCase());
  if (!linkEmails.includes(expectedEmail)) {
    return fail('EMAIL_MISMATCH', `This link belongs to ${linkEmail || 'a different account'}, but the workspace email is ${expectedEmail}. Use the same email in both places.`);
  }
  return { ok: true, url: raw, questionId };
}

function describeApiError(status, data) {
  const code = typeof data?.error === 'string' ? data.error : '';
  const upstream = Number(data?.upstream_status);
  if (status === 400 && code === 'VALID_QUESTION_DATA_URL_REQUIRED') {
    return fail(code, 'The API did not accept that link (wrong email, question, or host). Copy it again from the Q2 curl command on the exam page.');
  }
  if (status === 409 && code === 'POST_YOUR_QUESTION_DATA_URL_OR_ONBOARD_FIRST') {
    return fail(code, 'The API needs your private link. Paste it into the box and press Get code again.');
  }
  if (code === 'UPSTREAM_REJECTED' && (upstream === 401 || upstream === 403)) {
    return fail(code, 'The exam server rejected your signature — it may have expired. Reload the exam page, copy a fresh Q2 link, and try again.');
  }
  if (code === 'UPSTREAM_REJECTED') {
    return fail(code, `The exam server answered HTTP ${upstream || 'error'} for that link. Copy a fresh Q2 link and try again.`);
  }
  if (status === 422 && (code === 'NO_X_EXAM_CODE_HEADER' || code.startsWith('NO_'))) {
    return fail(code, 'The exam server answered but the response had no X-Exam-Code header. Copy a fresh Q2 link from the exam page and try again.');
  }
  if (status === 504 || code === 'UPSTREAM_TIMEOUT' || code === 'UPSTREAM_CONNECTION_FAILED') {
    return fail(code || 'UPSTREAM_TIMEOUT', 'The exam server did not answer in time. Wait a minute and press Get code again.');
  }
  if (status === 429) {
    return fail('RATE_LIMITED', 'The API is busy right now. Wait a minute and press Get code again.');
  }
  return fail(code || `HTTP_${status}`, `The API could not read your headers (${code || `HTTP ${status}`}). Wait a minute and try again; if it keeps failing, use the manual curl steps below.`);
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
 * Validate → wake the API → send the private link once → check the reply. Returns
 * `{ ok: true, code, fetchedAt }` or `{ ok: false, code, message }`; it never throws for expected failures.
 */
export async function fetchHeadersCode({
  email,
  rawUrl,
  useStored = false,
  origin = T3_GA1_API_ORIGIN,
  fetchImpl = globalThis.fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
  wake = true,
  sleep,
  now = Date.now,
  onStatus,
} = {}) {
  if (typeof fetchImpl !== 'function') {
    return fail('NO_FETCH', 'This browser cannot make network requests from the page. Use the manual curl steps below.');
  }

  // `useStored` sends no link at all: the API then uses the signature it saved when this email was
  // onboarded (Q15), and answers 409 if it has none.
  let checked = { ok: true, url: null };
  if (useStored) {
    try {
      apiEmail(email);
    } catch (error) {
      return fail('BAD_EMAIL', error.message);
    }
  } else {
    try {
      checked = validateQuestionDataUrl(rawUrl, email);
    } catch (error) {
      return fail('BAD_EMAIL', error.message);
    }
    if (!checked.ok) return checked;
  }

  if (wake) {
    onStatus?.('Checking that the API is awake…');
    const awake = await waitForApi({ origin, fetchImpl, sleep, now, onStatus });
    if (!awake) {
      return fail('API_UNREACHABLE', 'The API did not wake up in time, so your link was not sent. Open the /health link below, wait for it to load, then press Get code again.');
    }
  }

  onStatus?.(useStored ? 'Using the signature the API already has for you…' : 'Reading the X-Exam-Code header from the exam server…');
  let response;
  try {
    response = await fetchWithTimeout(fetchImpl, ga1Url(email, '/answers/headers', origin), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checked.url ? { question_data_url: checked.url } : {}),
      credentials: 'omit',
      cache: 'no-store',
    }, timeoutMs);
  } catch (error) {
    return error?.name === 'AbortError'
      ? fail('TIMEOUT', 'The API took too long to answer. Wait a minute and press Get code again.')
      : fail('NETWORK', `The API could not be reached (${error?.message || 'network error'}). Check your connection and press Get code again.`);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  if (!response.ok) return describeApiError(response.status, data);

  const code = typeof data?.answer_text === 'string' ? data.answer_text.trim() : '';
  const replyEmail = typeof data?.email === 'string' ? data.email.trim().toLowerCase() : '';
  if (!/^\S{3,128}$/.test(code) || (replyEmail && replyEmail !== apiEmail(email))) {
    return fail('BAD_RESPONSE', 'The API replied in an unexpected format, so it was not used. Press Get code again; if it repeats, use the manual curl steps below.');
  }
  return { ok: true, code, fetchedAt: now() };
}

const MANUAL_STEPS = [
  '#### Manual way (no API)',
  '',
  '1. Copy the `curl -i "https://exam.sanand.workers.dev/questionData?…"` command from Q2 on your exam page.',
  '2. Paste it into a terminal (Windows: `cmd` or PowerShell · Mac/Linux: Terminal) and press Enter.',
  '3. Find the line `X-Exam-Code: …` in the response headers and copy only the value after it.',
  '4. Paste that value into the Q2 answer box. Do **not** submit the response body.',
];

function formHtml(email) {
  const field = 'width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:1px solid var(--border,#3d5f96);background:var(--bg-input,#0b1930);color:var(--text-primary,#e8f0fe);font-family:var(--font-mono,monospace);font-size:12px;';
  return [
    `<div id="t3q2Root" data-email="${escapeHtml(email)}" style="border:1px solid var(--border,#2d4d80);border-radius:14px;padding:18px;margin:14px 0;background:rgba(77,166,255,0.06);">`,
    '<div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:var(--theme-primary,#4da6ff);margin-bottom:12px;">Get your X-Exam-Code</div>',
    '<label for="t3q2Email" style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;">1. Your exam email (from the main form)</label>',
    `<input id="t3q2Email" type="text" readonly value="${escapeHtml(email)}" style="${field}margin-bottom:12px;opacity:0.85;" />`,
    '<label for="t3q2Url" style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;">2. The private link from the Q2 curl command</label>',
    `<textarea id="t3q2Url" rows="3" spellcheck="false" autocomplete="off" placeholder="${escapeHtml(URL_HINT)}" style="${field}resize:vertical;"></textarea>`,
    '<button type="button" id="t3q2Go" onclick="window._t3ga1q2Generate()" style="margin-top:12px;background:var(--theme-primary,#3b82f6);color:#000;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">⚡ Get code</button>',
    '<div id="t3q2Status" role="status" aria-live="polite" style="margin-top:10px;font-size:13px;font-weight:600;min-height:18px;"></div>',
    '</div>',
  ].join('\n');
}

function privacyAndWake() {
  return [
    '#### What happens to your link',
    '',
    `The link contains your exam signature. Pressing **Get code** sends it once to this project's API (\`${T3_GA1_API_ORIGIN}\`), which asks the exam server for the headers and returns only the code. This page does not store the link, and the box is cleared after a successful lookup.`,
    '',
    '#### Good to know',
    '',
    '- **The code rotates every hour.** Press **Get code** right before you submit and press Check straight away.',
    `- The API sleeps when idle; the first request can take 30–50 seconds. This page wakes it first; you can also open [${T3_GA1_API_ORIGIN}/health](${T3_GA1_API_ORIGIN}/health).`,
  ];
}

function buildGuide(email, code, fetchedAt) {
  if (code) {
    const time = new Date(fetchedAt).toLocaleTimeString();
    return [
      `### ${title}`,
      '',
      `Your code is ready in the **Answer** box (fetched at ${time}). Paste it into Q2 and press **Check** — the code changes every hour, so do it now.`,
      '',
      '#### Need a fresh code?',
      '',
      formHtml(email),
      '',
      ...privacyAndWake(),
      '',
      helperSection('q2'),
      '',
      ...MANUAL_STEPS,
    ].join('\n');
  }
  return [
    `### ${title}`,
    '',
    'The code is hidden in an HTTP response header that your own signed link returns, so it is different for every student and refreshes hourly. **If you already generated your Q15 URL, this box fills itself within a minute** (the API remembers your signature). Otherwise do this once:',
    '',
    '1. Open **Q2** on your exam page and copy the URL inside the `curl -i "…"` command.',
    '2. Paste it into the box below and press **Get code**.',
    '3. The **Answer** box fills with the `X-Exam-Code` value. Paste it into the exam and press **Check**.',
    '',
    formHtml(email),
    '',
    ...privacyAndWake(),
    '',
    helperSection('q2'),
    '',
    ...MANUAL_STEPS,
  ].join('\n');
}

function solvedResult(email, code, fetchedAt) {
  return {
    type: 'solved',
    answer: code,
    variant: `X-Exam-Code for ${apiEmail(email)} (fetched ${new Date(fetchedAt).toLocaleTimeString()})`,
    guide: buildGuide(email, code, fetchedAt),
    answerDisplay: [
      `### ${title}`,
      '',
      '**Submit this code:**',
      '',
      markdownCodeBlock(code, 'text'),
      '',
      'It rotates every hour — fetch it again right before you press Check if some time has passed.',
    ].join('\n'),
    usesHostedApi: true,
  };
}

function registerQ2Interactive() {
  if (typeof window === 'undefined' || window._t3ga1q2Registered) return;
  window._t3ga1q2Registered = true;
  // Q15 calls this after onboarding, because that is when the API first holds the student's signature.
  window._t3ga1q2AutoFetch = (email) => startAuto(email, { force: true });

  window._t3ga1q2Generate = async function t3ga1q2Generate() {
    const root = document.getElementById('t3q2Root');
    if (!root) return;
    const email = root.dataset.email || '';
    const input = document.getElementById('t3q2Url');
    const button = document.getElementById('t3q2Go');
    const status = document.getElementById('t3q2Status');
    const show = (text, color) => {
      if (!status) return;
      status.style.color = color;
      status.textContent = text;
    };

    if (button) button.disabled = true;
    try {
      const outcome = await fetchHeadersCode({
        email,
        rawUrl: input ? input.value : '',
        onStatus: (text) => show(text, '#4da6ff'),
      });
      if (!outcome.ok) {
        show(outcome.message, '#e5484d');
        return;
      }
      if (input) input.value = '';
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, solvedResult(email, outcome.code, outcome.fetchedAt));
      if (!patched) show(`X-Exam-Code: ${outcome.code}`, '#198754');
    } finally {
      if (button) button.disabled = false;
    }
  };
}

// Real browsers only: Node (tests, tooling) reports a "Node.js/…" user agent and must never call the API.
function inRealBrowser() {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && /^Mozilla\//.test(String(navigator.userAgent || ''));
}

export const AUTO_TIMING = { patchPollMs: 500, patchTries: 120 };
const autoStarted = new Set();

/**
 * Tries to fill the Answer box without any click: wake the API, ask it for the code using the signature it
 * already stores for this email, and patch the result in as soon as the workspace has registered the
 * question. Silent when the API has no stored signature (the form in the guide is then the way in).
 * Resolves true only when the Answer box was filled.
 */
export async function autoFetchStored(email, { fetchImpl, sleep, now, patch } = {}) {
  const outcome = await fetchHeadersCode({ email, useStored: true, wake: true, fetchImpl, sleep, now });
  if (!outcome.ok) return false;
  const result = solvedResult(email, outcome.code, outcome.fetchedAt);
  const apply = patch || ((value) => typeof window !== 'undefined' && typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, value));
  const wait = sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
  for (let attempt = 0; attempt < AUTO_TIMING.patchTries; attempt += 1) {
    if (apply(result)) return true;
    await wait(AUTO_TIMING.patchPollMs);
  }
  return false;
}

function startAuto(email, { force = false } = {}) {
  let key;
  try {
    key = apiEmail(email);
  } catch {
    return Promise.resolve(false);
  }
  if (!force && autoStarted.has(key)) return Promise.resolve(false);
  autoStarted.add(key);
  return autoFetchStored(email).catch(() => false);
}

export async function solve(email) {
  registerQ2Interactive();
  registerHelperCopy();
  if (inRealBrowser()) startAuto(email);
  const normalized = apiEmail(email);
  return {
    type: 'guide',
    answer: 'NOT FETCHED YET — paste your private Q2 link into the form above and press “Get code”. This box will then show the X-Exam-Code to submit.',
    variant: 'Needs your private Q2 link',
    guide: buildGuide(normalized, '', 0),
    answerDisplay: '### Waiting for your private Q2 link\n\nUse the form in the **Implementation Guide** panel. Once it succeeds, the Answer box shows the X-Exam-Code.',
    usesHostedApi: true,
    debug: { question: 'Q2', needsUserInput: true, apiOrigin: T3_GA1_API_ORIGIN },
  };
}
