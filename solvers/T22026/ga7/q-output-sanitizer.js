// Solver: GA7 Q4 -- LLM Output Handling Gate (LLM05)
// Submit the fixed hosted-service URL; the exam POSTs its own probes to /sanitize-output.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga7Post, ga7Scope } from './api-client.js';

export const id = 'q-llm-output-sanitizer-server';
export const title = 'Q4: LLM Output Handling Gate (LLM05)';

function sampleRequest(scope) {
  const host = scope?.sanitizer?.allowedHosts?.[0] || 'cdn-example.example';
  return { channel: 'html', output: `<img src="https://${host}/logo.png">` };
}

function registerSanitizerInteractive() {
  if (typeof window === 'undefined' || window._ga7SoRegistered) return;
  window._ga7SoRegistered = true;

  window._ga7SoFetchScope = async function () {
    const email = document.getElementById('ga7SoEmail')?.value || '';
    const statusEl = document.getElementById('ga7SoScopeStatus');
    const outEl = document.getElementById('ga7SoScopeOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    setStatus('Fetching your assigned scope… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const scope = await ga7Scope(email);
      if (outEl) outEl.value = JSON.stringify(scope, null, 2);
      window._ga7SoLastScope = scope;
      setStatus('✅ Loaded. allowedHosts below are your exact allowlist for EXTERNAL_EXFIL checks.', '#198754');
    } catch (err) {
      setStatus(`Failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga7SoTestRequest = async function () {
    const email = document.getElementById('ga7SoEmail')?.value || '';
    const raw = document.getElementById('ga7SoRequestInput')?.value || '';
    const statusEl = document.getElementById('ga7SoTestStatus');
    const outEl = document.getElementById('ga7SoTestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /sanitize-output…', '#e9d5ff');
    try {
      const result = await ga7Post(email, 'sanitize-output', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus(`✅ safe: ${result.safe}, reason: ${result.reason}`, result.safe ? '#198754' : '#d97706');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga7SoUseSample = function () {
    const inputEl = document.getElementById('ga7SoRequestInput');
    if (inputEl) inputEl.value = JSON.stringify(sampleRequest(window._ga7SoLastScope), null, 2);
  };

  window._ga7SoCopyUrl = async function () {
    const el = document.getElementById('ga7SoSubmitUrl');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerSanitizerInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const summary = [
    `LLM Output Handling Gate assistant for ${norm}.`,
    `Submit exactly this URL: ${serviceUrl} -- the exam's hidden grader POSTs its own test cases to ${serviceUrl}/sanitize-output and checks the decisions server-side.`
  ].join(' ');

  const guide = [
    `## Q4 -- LLM Output Handling Gate (LLM05) (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `That's the entire answer -- the exam POSTs its own probes to \`${serviceUrl}/sanitize-output\`.`,
    ``,
    `### 💡 Evaluation order`,
    `1. \`INVALID_SCHEMA\` -- bad body, bad channel, non-string output, or > 20000 chars`,
    `2. \`ENCODED_PAYLOAD\` -- decode once (percent → HTML entities → \\uXXXX); if the decoded string`,
    `   differs **and** would trip a rule below`,
    `3. Channel rules, applied to the **original** output, first match wins:`,
    ``,
    '| Channel | Checks in order |',
    '|---|---|',
    '| `html` | `SCRIPT_TAG` → `EVENT_HANDLER` → `DANGEROUS_SCHEME` → `EXTERNAL_EXFIL` |',
    '| `markdown` | `DANGEROUS_SCHEME` → `EXTERNAL_EXFIL` |',
    '| `url` | `DANGEROUS_SCHEME` → `EXTERNAL_EXFIL` |',
    '| `sql` | `SQL_METACHAR` |',
    '| `shell` | `SHELL_METACHAR` |',
    ``,
    `> **Exact hostname only** -- subdomains of an allowed host are NOT allowed (a substring-match`,
    `> allowlist implementation will fail the hidden probes). \`data:\` URIs ARE blocked here`,
    `> (opposite of \`/action-firewall\`, by design).`,
    ``,
    `### ⚡ Interactive Tester (for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <input type="hidden" id="ga7SoEmail" value="' + norm + '" />',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Assigned Allowed Hosts</div>',
    '  <button onclick="window._ga7SoFetchScope()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Fetch My Scope</button>',
    '  <div id="ga7SoScopeStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '  <textarea id="ga7SoScopeOutput" readonly rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:12px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '</div>',
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Test a /sanitize-output Request</div>',
    '  <textarea id="ga7SoRequestInput" rows="8" placeholder="Paste a request JSON body, or click Load Sample below (fetch scope first)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;box-sizing:border-box;"></textarea>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">',
    '    <button onclick="window._ga7SoUseSample()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Load Sample (safe, allowed host)</button>',
    '    <button onclick="window._ga7SoTestRequest()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Call /sanitize-output</button>',
    '  </div>',
    '  <div id="ga7SoTestStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready</div>',
    '  <textarea id="ga7SoTestOutput" readonly rows="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:12px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Submission URL</div>',
    '  <input id="ga7SoSubmitUrl" readonly value="' + serviceUrl + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;" />',
    '  <button onclick="window._ga7SoCopyUrl()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy URL</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'solved',
    answer: serviceUrl,
    variant: `LLM output sanitizer assistant for ${norm}`,
    answerDisplay: [
      `### Q4: LLM Output Handling Gate (LLM05)`,
      ``,
      `Submit: \`${serviceUrl}\``,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
