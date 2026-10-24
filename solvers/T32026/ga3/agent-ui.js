// Shared guide and result shape for the three T3 GA3 engineering questions.
import { page, card, details, escapeHtml } from './ui.js';
import { GA3_API_ORIGIN, checkToken, healthUrl, onboardTenant, probeA2a, probeIncident, probeMailroom, redact, summarizeProbes } from './api-client.js';

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
    '<p>This checks your personalized main endpoint before you use an exam Check. It does not call an AI model.</p>',
    `<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3ga3.test('${kind}')">Run pre-flight test</button>${register}</div>`,
    `<div id="t3ga3-${kind}-status" class="p1-status" role="status"></div>`,
    `<div id="t3ga3-${kind}-out"></div>`,
    '</div>',
  ].join('');
}

const list = (items, tag = 'ol') => `<${tag}>${items.map((i) => `<li>${i}</li>`).join('')}</${tag}>`;

/** The personalized endpoint is primary; the supplied shared endpoint stays available as a fallback. */
export function agentResult({ id, title, kind, email, tokenCheck, urls, primaryUrl, question, steps, tips, extraCards = [], note = '', origin = GA3_API_ORIGIN }) {
  const answerUrl = tokenCheck.ok ? urls.answer(email, tokenCheck.token, origin) : '';
  const health = healthUrl(email, origin);
  if (tokenCheck.ok) credentials.set(kind, { email, token: tokenCheck.token, url: answerUrl });

  const urlCard = tokenCheck.ok
    ? card('Personalized main answer ready', `<p>Your account-specific URL is in the Answer box. Copy it there into the exam; do not share it because it contains your private token.</p>`, 'accent')
    : card('Personalized main answer needs a token', `<p class="p1-note">${escapeHtml(tokenCheck.message)}</p><p>The shared endpoint is still available in the backup section below.</p>`, 'accent');

  const chips = [
    { text: tokenCheck.ok ? 'Personalized main answer ready' : 'Token needed for main answer', tone: tokenCheck.ok ? 'ok' : 'warn' },
    { text: '10 Checks per 24 h', tone: '' },
    { text: '4 marks', tone: '' },
  ];
  const stepCard = card('Step by step for beginners', list([
    ...(tokenCheck.ok
      ? ['Copy the personalized main URL shown above into the exam answer box.']
      : ['To create your personalized main URL, paste a fresh aipipe.org token into the sidebar and initialize GA3 again. Until then, the shared endpoint below is available as a backup.']),
    ...steps,
    ...(tokenCheck.ok ? [
      'The shared fallback endpoint is listed separately below. Use it only if your personalized main endpoint is unavailable.',
      `Before testing the main endpoint, open <a href="${escapeHtml(health)}" target="_blank" rel="noopener noreferrer">the API health link</a> and wait for <code>"status":"ok"</code>.`,
    ] : []),
  ]));

  const sections = [
    urlCard,
    card('What the exam wants', question),
    stepCard,
  ];
  if (!tokenCheck.ok && tokenCheck.code !== 'NO_TOKEN') sections.unshift(`<div class="p1-note">${escapeHtml(tokenCheck.message)} Your personalized main answer is unavailable until you enter a valid token; the shared fallback remains listed below.</div>`);
  if (tokenCheck.ok) sections.push(card('Test your main endpoint', widgetHtml(kind, email), 'accent'));
  sections.push(...extraCards);
  sections.push(details('Good to know', list([...tips,
    'A language model makes the decisions, so a result can occasionally wobble. If a Check fails on a decision, run it again once or twice before changing anything.',
    'Each Check or Save uses one of your 10 daily tries, and the page keeps the last one for Save. Only your most recent Save counts.',
    'The token is spent from your own aipipe.org allowance (a first Check costs roughly a cent). All exam cases are synthetic; never put real data in.'], 'ul')));
  if (note) sections.unshift(`<div class="p1-note">${escapeHtml(note)}</div>`);

  const guide = page({ title, chips, sections });
  return {
    type: tokenCheck.ok ? 'solved' : 'guide',
    answer: tokenCheck.ok ? answerUrl : tokenCheck.message,
    variant: tokenCheck.ok ? `${title} — personalized main endpoint` : `${title} — token needed`,
    backupEndpoints: [{ label: 'Shared fallback endpoint', url: primaryUrl }],
    guide,
    answerDisplay: tokenCheck.ok
      ? `### ${title}\n\n**Personalized main answer:**\n\n\`\`\`text\n${answerUrl}\n\`\`\`\n\nThe shared fallback endpoint is available below.`
      : `### ${title}\n\n${tokenCheck.message}\n\nThe shared fallback endpoint is available below.`,
    usesHostedApi: true,
    debug: { question: kind, apiOrigin: origin, tokenExpiresAt: tokenCheck.ok ? tokenCheck.expiresAt ?? null : null, primaryReady: tokenCheck.ok },
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
