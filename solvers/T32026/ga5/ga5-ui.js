// Shared page chrome and the live-endpoint widget for the two hosted GA5 questions (Q1 RAG Colosseum, Q4 harness router).
import { page, card, details, escapeHtml } from '../p1/ui.js';
import { T3_API_ORIGIN, examEmail, healthUrl, probeHarness, probeRag, summarizeProbes, t3ga5Url, wakeApi } from './api-client.js';

export { page, card, details, escapeHtml };

const live = new Map();
const list = (items) => `<ol>${items.map((i) => `<li>${i}</li>`).join('')}</ol>`;

export function isRealBrowser() {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined' && /^Mozilla\//.test(String(navigator.userAgent || ''));
}

function widgetHtml(kind) {
  return [
    `<div id="t3ga5-${kind}">`,
    '<p>The free server sleeps when nobody uses it. <strong>Wake it, then test it, before you press Check</strong> (the Q1 gauntlet gives it only 8 seconds per request). The test asks your endpoint the same first questions the grader asks and never calls an AI model, so it costs nothing.</p>',
    `<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3ga5.wake('${kind}')">Wake the server</button><button type="button" class="p1-btn" onclick="window._t3ga5.test('${kind}')">Run pre-flight test</button></div>`,
    `<div id="t3ga5-${kind}-status" class="p1-status" role="status"></div>`,
    `<div id="t3ga5-${kind}-out"></div>`,
    '</div>',
  ].join('');
}

/** The result for a hosted-endpoint question: the answer is the URL itself, built from the student's own email. */
export function endpointResult({ id, title, kind, email, suffix, question, steps, tips, origin = T3_API_ORIGIN, marks }) {
  const clean = examEmail(email);
  if (!clean) {
    const message = 'Enter your full IITM exam email (like name@ds.study.iitm.ac.in) in the sidebar, then initialize again. The answer URL is built from it.';
    return { type: 'guide', answer: message, variant: 'Valid email needed', guide: page({ title, chips: [{ text: 'Email needed', tone: 'warn' }], sections: [card('One thing is missing', `<p class="p1-note">${escapeHtml(message)}</p>`, 'accent')] }), answerDisplay: `### ${title}\n\n${message}`, debug: { question: kind, needsUserInput: true } };
  }
  const url = t3ga5Url(clean, suffix, origin);
  const base = t3ga5Url(clean, '', origin);
  live.set(kind, { email: clean, url, base, origin });
  const guide = page({
    title,
    chips: [{ text: 'Direct answer', tone: 'ok' }, { text: `${marks} marks`, tone: '' }, { text: 'No token needed', tone: '' }],
    sections: [
      card('Your answer for the exam box', `<p>Copy this URL exactly (it is also in the Answer box):</p><pre class="mono" style="white-space:pre-wrap;word-break:break-all">${escapeHtml(url)}</pre><p class="p1-foot">It is built from your exam email, in the form the exam uses to make your private questions, so every student gets a different URL and nobody needs an AI token.</p>`, 'accent'),
      card('What the exam wants', question),
      card('Step by step for beginners', list([`Check that the Answer box shows the URL above, exactly. ${suffix ? '' : 'Do not add /query: the grader adds it.'}`, `Open <a href="${escapeHtml(healthUrl(origin))}" target="_blank" rel="noopener noreferrer">the server health link</a> and wait until it shows <code>"status":"ok"</code>. The free server can take up to a minute to wake.`, ...steps])),
      card('Wake and test your endpoint', widgetHtml(kind), 'accent'),
      details('Good to know', `<ul>${tips.map((t) => `<li>${t}</li>`).join('')}<li>Each Check or Save uses one of your daily tries and only your latest Save counts.</li><li>A Check result is the authority: the exam's cases are unseen, so a green test here means "the contract is right", not "full marks".</li></ul>`),
    ],
  });
  return {
    type: 'solved',
    answer: url,
    variant: `${title} — your live endpoint`,
    guide,
    answerDisplay: `### ${title}\n\n**Submit this URL:**\n\n\`\`\`text\n${url}\n\`\`\`\n\nOpen the health link first so the free server is awake, then run the pre-flight test in the Implementation Guide.`,
    usesHostedApi: true,
    debug: { question: kind, apiOrigin: origin },
  };
}

export function renderChecks(results) {
  const summary = summarizeProbes(results);
  const rows = results.map((r) => `<tr><td>${r.ok ? '✅' : '❌'}</td><td>${escapeHtml(r.label)}</td><td class="mono">${escapeHtml(r.detail)}</td></tr>`).join('');
  return `<p><strong>${summary.allPassed ? 'All checks passed' : `${summary.passed}/${summary.total} passed`}</strong>${summary.allPassed ? ' — your endpoint answers the first things the grader asks. You can use a Check.' : ' — fix the red rows first (the detail column says what came back).'}</p><table><tbody>${rows}</tbody></table>`;
}

export function registerEndpointWidgets() {
  if (typeof window === 'undefined' || window._t3ga5) return;
  const $ = (name) => document.getElementById(name);
  const say = (kind, text, tone) => { const el = $(`t3ga5-${kind}-status`); if (el) { el.textContent = text; el.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd'; } };
  window._t3ga5 = {
    async wake(kind) {
      const info = live.get(kind);
      if (!info) { say(kind, 'Press Initialize Workspace with your email first.', 'bad'); return; }
      const result = await wakeApi({ origin: info.origin, onStatus: (text) => say(kind, text, '') });
      say(kind, result.ok ? 'The server is awake.' : 'The server did not answer yet. Wait a minute and try again, or open the health link above.', result.ok ? 'ok' : 'bad');
    },
    async test(kind) {
      const info = live.get(kind);
      const out = $(`t3ga5-${kind}-out`);
      if (!info) { say(kind, 'Press Initialize Workspace with your email first.', 'bad'); return; }
      if (out) out.innerHTML = '';
      const awake = await wakeApi({ origin: info.origin, onStatus: (text) => say(kind, text, '') });
      if (!awake.ok) { say(kind, 'The server did not wake up. Wait a minute and try again.', 'bad'); return; }
      say(kind, 'Running the checks…', '');
      try {
        const results = kind === 'rag' ? await probeRag({ base: info.base }) : await probeHarness({ url: info.url });
        if (out) out.innerHTML = renderChecks(results);
        say(kind, 'Done.', 'ok');
      } catch (error) {
        say(kind, error?.message || 'The test could not run.', 'bad');
      }
    },
  };
}
