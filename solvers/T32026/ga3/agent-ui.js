// Shared guide, widgets and result shape for the three T3 GA3 engineering questions (A2A invoice agent, mailroom action gate,
// incident triage). They all submit a personal URL on the hosted API, so the answer is direct once the student's own
// aipipe.org token is in the sidebar; the guide adds a pre-flight test (no model call, no Check spent) and beginner steps.
import { page, card, details, escapeHtml } from './ui.js';
import { GA3_API_ORIGIN, checkToken, healthUrl, onboardTenant, probeA2a, probeIncident, probeMailroom, redact, summarizeProbes } from './api-client.js';

export const FOOTNOTE = 'Your token is only ever sent to your own API route and to aipipe.org by that API. The URL contains your token, so do not share it.';

// Credentials live only in memory (never in the DOM, storage or logs); the widgets read them from here.
const credentials = new Map();

const KINDS = {
  a2a: { probe: ({ url, token }) => probeA2a({ base: url, token }) },
  mailroom: { probe: ({ url }) => probeMailroom({ url }) },
  incident: { probe: ({ url }) => probeIncident({ base: url }) },
};

export function isRealBrowser() {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && /^Mozilla\//.test(String(navigator.userAgent || ''));
}

function widgetHtml(kind, email) {
  const register = kind === 'a2a'
    ? `<button type="button" class="p1-btn ghost" onclick="window._t3ga3.register('${kind}')">Register my endpoints</button>`
    : '';
  return [
    `<div id="t3ga3-${kind}" data-kind="${kind}" data-email="${escapeHtml(email)}">`,
    '<p>Before you use one of your 10 daily Checks, run this quick test. It asks your own API the same first questions a grader would (headers, errors, no redirects) and never calls an AI model, so it costs nothing.</p>',
    `<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3ga3.test('${kind}')">Run pre-flight test</button>${register}</div>`,
    `<div id="t3ga3-${kind}-status" class="p1-status" role="status"></div>`,
    `<div id="t3ga3-${kind}-out"></div>`,
    '</div>',
  ].join('');
}

const list = (items, tag = 'ol') => `<${tag}>${items.map((i) => `<li>${i}</li>`).join('')}</${tag}>`;

/** The guide + answer for one agent question. `token` may be missing or invalid: the guide then says exactly what to do. */
export function agentResult({ id, title, kind, email, tokenCheck, urls, question, steps, tips, extraCards = [], note = '', origin = GA3_API_ORIGIN }) {
  const answerUrl = tokenCheck.ok ? urls.answer(email, tokenCheck.token, origin) : '';
  const health = healthUrl(email, origin);
  if (tokenCheck.ok) credentials.set(kind, { email, token: tokenCheck.token, url: answerUrl });

  const urlCard = tokenCheck.ok
    ? card('Your answer for the exam box', `<p>Copy this URL exactly (it is also in the Answer box):</p><pre class="mono" style="white-space:pre-wrap;word-break:break-all">${escapeHtml(answerUrl)}</pre><p class="p1-foot">${escapeHtml(FOOTNOTE)}</p>`, 'accent')
    : card('One thing is missing', `<p class="p1-note">${escapeHtml(tokenCheck.message)}</p><p>Your personal URL is built from your own aipipe.org token, so nothing can be shown until it is in the box.</p>`, 'accent');

  const chips = [
    { text: tokenCheck.ok ? 'Token ready' : 'Token needed', tone: tokenCheck.ok ? 'ok' : 'warn' },
    { text: '10 Checks per 24 h', tone: '' },
    { text: '4 marks', tone: '' },
  ];
  const stepCard = card('Step by step for beginners', list([
    'Get your token: open <a href="https://aipipe.org" target="_blank" rel="noopener noreferrer">aipipe.org</a>, sign in, and copy your token (everyone gets a small free weekly allowance).',
    'Paste it into the <strong>token box in the sidebar</strong> and press <strong>Initialize Workspace</strong>. This question\'s Answer box now shows your personal URL.',
    `The hosted API sleeps when nobody uses it. Open <a href="${escapeHtml(health)}" target="_blank" rel="noopener noreferrer">its health link</a> and wait until it shows <code>"status":"ok"</code> (the first time can take up to a minute).`,
    ...steps,
  ]));

  const sections = [
    urlCard,
    card('What the exam wants', question),
    stepCard,
  ];
  if (tokenCheck.ok) sections.push(card('Test your endpoint first', widgetHtml(kind, email), 'accent'));
  sections.push(...extraCards);
  sections.push(details('Good to know', list([...tips,
    'A language model makes the decisions, so a result can occasionally wobble. If a Check fails on a decision, run it again once or twice before changing anything.',
    'Each Check or Save uses one of your 10 daily tries, and the page keeps the last one for Save. Only your most recent Save counts.',
    'The token is spent from your own aipipe.org allowance (a first Check costs roughly a cent). All exam cases are synthetic; never put real data in.'], 'ul')));
  if (note) sections.unshift(`<div class="p1-note">${escapeHtml(note)}</div>`);

  const guide = page({ title, chips, sections });
  if (!tokenCheck.ok) {
    return {
      type: 'guide',
      answer: tokenCheck.message,
      variant: tokenCheck.code === 'NO_TOKEN' ? 'aipipe.org token needed' : 'Fix the token',
      guide,
      answerDisplay: `### ${title}\n\n${tokenCheck.message}`,
      usesHostedApi: true,
      debug: { question: kind, needsUserInput: true, tokenProblem: tokenCheck.code },
    };
  }
  return {
    type: 'solved',
    answer: answerUrl,
    variant: `${title} — your personal API URL`,
    guide,
    answerDisplay: `### ${title}\n\n**Submit this URL:**\n\n\`\`\`text\n${answerUrl}\n\`\`\`\n\nRun the pre-flight test in the Implementation Guide first, and open the API health link so it is awake before you press Check.`,
    usesHostedApi: true,
    debug: { question: kind, apiOrigin: origin, tokenExpiresAt: tokenCheck.expiresAt ?? null },
  };
}

/** Retries a patch until the workspace has registered the question (it is added just after solve() returns). */
export async function patchWhenReady(id, result, { tries = 120, delayMs = 500, patch } = {}) {
  const apply = patch || ((value) => typeof window !== 'undefined' && typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, value));
  for (let attempt = 0; attempt < tries; attempt += 1) {
    if (apply(id === undefined ? result : result)) return true;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return false;
}

export function renderChecks(results, token) {
  const summary = summarizeProbes(results);
  const rows = results.map((r) => `<tr><td>${r.ok ? '✅' : '❌'}</td><td>${escapeHtml(r.label)}</td><td class="mono">${escapeHtml(redact(r.detail, token))}</td></tr>`).join('');
  return `<p><strong>${summary.allPassed ? 'All checks passed' : `${summary.passed}/${summary.total} passed`}</strong>${summary.allPassed ? ' — your endpoint answers the first things a grader asks. You can use a Check.' : ' — fix the red rows first (the detail column says what came back).'}</p><table><tbody>${rows}</tbody></table>`;
}

export function registerAgentWidgets() {
  if (typeof window === 'undefined' || window._t3ga3) return;
  const $ = (name) => document.getElementById(name);
  const say = (kind, text, tone) => {
    const el = $(`t3ga3-${kind}-status`);
    if (!el) return;
    el.textContent = text;
    el.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd';
  };
  window._t3ga3 = {
    async test(kind) {
      const creds = credentials.get(kind);
      const out = $(`t3ga3-${kind}-out`);
      if (!creds || !KINDS[kind]) { say(kind, 'Press Initialize Workspace with your token first.', 'bad'); return; }
      say(kind, 'Waking the API and running the checks…', '');
      if (out) out.innerHTML = '';
      try {
        const awake = await onboardTenant({ email: creds.email, token: creds.token, wake: true, onStatus: (text) => say(kind, text, '') });
        // A failed registration is reported by the probes below; keep going so the student sees everything.
        const results = await KINDS[kind].probe(creds);
        if (out) out.innerHTML = renderChecks(results, creds.token);
        say(kind, awake.ok ? 'Done.' : `Done (registration problem: ${redact(awake.message, creds.token)})`, awake.ok ? 'ok' : 'bad');
      } catch (error) {
        say(kind, redact(error?.message || 'The test could not run.', creds.token), 'bad');
      }
    },
    async register(kind) {
      const creds = credentials.get(kind);
      if (!creds) { say(kind, 'Press Initialize Workspace with your token first.', 'bad'); return; }
      say(kind, 'Registering…', '');
      const result = await onboardTenant({ email: creds.email, token: creds.token, onStatus: (text) => say(kind, text, '') });
      say(kind, result.ok ? 'Registered. Your base URL is now in the shared Agent Card.' : redact(result.message, creds.token), result.ok ? 'ok' : 'bad');
    },
  };
}

export { checkToken };
