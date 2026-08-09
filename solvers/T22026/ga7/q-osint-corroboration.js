// Solver: GA7 Q5 -- OSINT Corroboration Engine
// Submit the fixed hosted-service URL; the exam POSTs its own probes to /corroborate.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga7Post } from './api-client.js';

export const id = 'q-osint-corroboration-server';
export const title = 'Q5: OSINT Corroboration Engine';

const SAMPLE_REQUEST = {
  claim: { subject: 'x.example', predicate: 'resolves_to', value: '203.0.113.20' },
  asOf: '2026-08-01T00:00:00Z',
  stalenessDays: 90,
  sources: [
    { id: 's1', type: 'dns', origin: 'resolver-a', observedAt: '2026-07-30T00:00:00Z', value: '203.0.113.20', authoritative: false },
    { id: 's2', type: 'ct_log', origin: 'resolver-b', observedAt: '2026-07-29T00:00:00Z', value: '203.0.113.20', authoritative: false }
  ]
};

function registerCorroborationInteractive() {
  if (typeof window === 'undefined' || window._ga7OcRegistered) return;
  window._ga7OcRegistered = true;

  window._ga7OcTestRequest = async function () {
    const email = document.getElementById('ga7OcEmail')?.value || '';
    const raw = document.getElementById('ga7OcRequestInput')?.value || '';
    const statusEl = document.getElementById('ga7OcTestStatus');
    const outEl = document.getElementById('ga7OcTestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /corroborate… (first call after idle may take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga7Post(email, 'corroborate', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus(`✅ verdict: ${result.verdict}, confidence: ${result.confidence}`, result.verdict === 'supported' ? '#198754' : '#d97706');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga7OcUseSample = function () {
    const inputEl = document.getElementById('ga7OcRequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST, null, 2);
  };

  window._ga7OcCopyUrl = async function () {
    const el = document.getElementById('ga7OcSubmitUrl');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerCorroborationInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const summary = [
    `OSINT Corroboration Engine assistant for ${norm}.`,
    `Submit exactly this URL: ${serviceUrl} -- the exam's hidden grader POSTs its own test cases to ${serviceUrl}/corroborate and checks the verdicts server-side.`
  ].join(' ');

  const guide = [
    `## Q5 -- OSINT Corroboration Engine (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `That's the entire answer -- the exam POSTs its own probes to \`${serviceUrl}/corroborate\`.`,
    `Never reads the wall clock -- every decision comes from the request's own \`asOf\` and`,
    `\`stalenessDays\`, so it's fully deterministic and reproducible.`,
    ``,
    `### 💡 Rules in order`,
    `1. **invalid** / low / [] -- malformed body, non-string \`claim.value\`, unparseable \`asOf\`,`,
    `   non-numeric \`stalenessDays\`, non-array \`sources\``,
    `2. **contradicted** / low -- ≥1 fresh source with \`authoritative: true\` whose value differs.`,
    `   \`corroboratingSources\` = those contradicting ids, sorted`,
    `3. **supported** -- keep fresh sources matching the claim, reduce to one representative per`,
    `   \`origin\` (lexicographically smallest id); if ≥2 remain: \`high\` if they span ≥2 distinct`,
    `   \`type\` values, \`medium\` if all one type`,
    `4. **unverified** / low / [] -- anything else`,
    ``,
    `*Fresh* = \`asOf − observedAt ≤ stalenessDays\`. *Independent* = different \`origin\` (same origin =`,
    `mirrors, count once). A source is valid only if \`id\`/\`origin\`/\`value\`/\`observedAt\` are strings`,
    `and \`type\` ∈ \`dns|ct_log|registry|archive|scan\` -- anything else is ignored entirely.`,
    ``,
    `> Two traps: a **stale** authoritative disagreement does NOT contradict a fresh well-corroborated`,
    `> claim, and disagreement from a **non-authoritative** source neither contradicts nor supports --`,
    `> it simply isn't counted.`,
    ``,
    `### ⚡ Interactive Tester (for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <input type="hidden" id="ga7OcEmail" value="' + norm + '" />',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Test a /corroborate Request</div>',
    '  <textarea id="ga7OcRequestInput" rows="14" placeholder="Paste a request JSON body, or click Load Sample below" style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;box-sizing:border-box;"></textarea>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">',
    '    <button onclick="window._ga7OcUseSample()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Load Sample (2 fresh, high confidence)</button>',
    '    <button onclick="window._ga7OcTestRequest()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Call /corroborate</button>',
    '  </div>',
    '  <div id="ga7OcTestStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready</div>',
    '  <textarea id="ga7OcTestOutput" readonly rows="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:12px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Submission URL</div>',
    '  <input id="ga7OcSubmitUrl" readonly value="' + serviceUrl + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;" />',
    '  <button onclick="window._ga7OcCopyUrl()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy URL</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'solved',
    answer: serviceUrl,
    variant: `OSINT corroboration engine assistant for ${norm}`,
    answerDisplay: [
      `### Q5: OSINT Corroboration Engine`,
      ``,
      `Submit: \`${serviceUrl}\``,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
