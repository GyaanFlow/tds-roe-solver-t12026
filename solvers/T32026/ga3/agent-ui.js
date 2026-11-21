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

/**
 * No token is needed: the shared endpoint is the answer for everyone. A student who adds an aipipe.org token (optional)
 * also gets a personalized endpoint of their own, with a pre-flight test, and that becomes the main answer.
 */
export function agentResult({ id, title, kind, email, tokenCheck, urls, primaryUrl, question, steps, tips, extraCards = [], note = '', origin = GA3_API_ORIGIN }) {
  const personal = tokenCheck.ok;
  const answerUrl = personal ? urls.answer(email, tokenCheck.token, origin) : primaryUrl || '';
  const hasAnswer = Boolean(answerUrl);
  const health = healthUrl(email, origin);
  if (personal) credentials.set(kind, { email, token: tokenCheck.token, url: answerUrl });
  const badToken = !personal && tokenCheck.code !== 'NO_TOKEN';

  const urlCard = personal
    ? card('Your personalized answer is ready', '<p>Your account-specific URL is in the Answer box. Copy it into the exam and do not share it, because it contains your private token. The shared endpoint below also works if you prefer not to use it.</p>', 'accent')
    : card('No token needed', `<p>The shared endpoint is in the Answer box. Copy it into the exam exactly as it is.</p>${hasAnswer ? `<pre class="mono" style="white-space:pre-wrap;word-break:break-all">${escapeHtml(answerUrl)}</pre>` : ''}<p class="p1-foot">Optional: if you would rather have an endpoint of your own, paste a fresh aipipe.org token in the sidebar and initialize this exam again.</p>`, 'accent');

  const chips = [
    { text: personal ? 'Personalized answer ready' : 'Shared endpoint, no token needed', tone: 'ok' },
    { text: '10 Checks per 24 h', tone: '' },
    { text: '4 marks', tone: '' },
  ];
  const stepCard = card('Step by step for beginners', list([
    personal ? 'Copy the personalized URL from the Answer box into the exam answer box.' : 'Copy the shared endpoint URL from the Answer box into the exam answer box. No aipipe.org token is needed.',
    ...steps,
    ...(personal ? [`Before testing your personalized endpoint, open <a href="${escapeHtml(health)}" target="_blank" rel="noopener noreferrer">the API health link</a> and wait for <code>"status":"ok"</code>.`] : []),
    ...(personal ? [] : ['If the exam says it cannot reach the endpoint, or the address shows "Service Suspended", the shared service is switched off. Then add an aipipe.org token in the sidebar (free allowance) and initialize again to get your own working endpoint.']),
  ]));

  const sections = [urlCard, card('What the exam wants', question), stepCard];
  if (badToken) sections.unshift(`<div class="p1-note">${escapeHtml(tokenCheck.message)} The shared endpoint still works without a token.</div>`);
  if (personal) sections.push(card('Test your personalized endpoint', widgetHtml(kind, email), 'accent'));
  sections.push(...extraCards);
  sections.push(details('Good to know', list([...tips,
    'A language model makes the decisions, so a result can occasionally wobble. If a Check fails on a decision, run it again once or twice before changing anything.',
    'Each Check or Save uses one of your 10 daily tries, and the page keeps the last one for Save. Only your most recent Save counts.',
    'If you add a token, it is spent from your own aipipe.org allowance (a first Check costs roughly a cent). All exam cases are synthetic; never put real data in.'], 'ul')));
  if (note) sections.unshift(`<div class="p1-note">${escapeHtml(note)}</div>`);

  const guide = page({ title, chips, sections });
  const common = { guide, usesHostedApi: true, backupEndpoints: primaryUrl ? [{ label: 'Shared endpoint', url: primaryUrl }] : [] };
  if (!hasAnswer) {
    return { ...common, type: 'guide', answer: tokenCheck.message, variant: `${title} — token needed`, answerDisplay: `### ${title}\n\n${tokenCheck.message}`, debug: { question: kind, apiOrigin: origin, mode: 'none', primaryReady: false } };
  }
  return {
    ...common,
    type: 'solved',
    answer: answerUrl,
    variant: personal ? `${title} — your personalized endpoint` : `${title} — shared endpoint (no token needed)`,
    answerDisplay: personal
      ? `### ${title}\n\n**Your personalized endpoint:**\n\n\`\`\`text\n${answerUrl}\n\`\`\`\n\nThe shared endpoint (${primaryUrl}) also works.`
      : `### ${title}\n\n**Submit this URL (no token needed):**\n\n\`\`\`text\n${answerUrl}\n\`\`\``,
    debug: { question: kind, apiOrigin: origin, mode: personal ? 'personal' : 'shared', tokenExpiresAt: personal ? tokenCheck.expiresAt ?? null : null, primaryReady: personal },
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
