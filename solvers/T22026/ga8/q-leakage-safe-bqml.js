// Solver: GA8 Q2 -- Leakage-Safe BigQuery ML Gate
// Submit the fixed hosted-service URL; the exam grader POSTs its probes to /bqml.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga8Post } from './api-client.js';

export const id = 'q-leakage-safe-bqml-server';
export const title = 'Q2: Leakage-Safe BigQuery ML Gate';

const SAMPLE_REQUEST_SELECT = {
  phase: 'select',
  runId: 'run-001',
  forbiddenFeatures: ['future_metric'],
  rows: [
    { id: '1', entity: 'u1', eventTime: '2026-01-01T00:00:00Z', version: 1, availableAt: '2026-01-01T00:00:00Z', predictionTime: '2026-01-01T01:00:00Z', f1: 10 }
  ],
  trials: [
    { trialId: 1, evalMetric: 0.92, status: 'SUCCESS' }
  ]
};

function registerInteractive() {
  if (typeof window === 'undefined' || window._ga8Q2Registered) return;
  window._ga8Q2Registered = true;

  window._ga8Q2TestRequest = async function () {
    const email = document.getElementById('ga8Q2Email')?.value || '';
    const raw = document.getElementById('ga8Q2RequestInput')?.value || '';
    const statusEl = document.getElementById('ga8Q2TestStatus');
    const outEl = document.getElementById('ga8Q2TestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /bqml… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga8Post(email, 'bqml', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus('✅ Success: Phase evaluated cleanly.', '#198754');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga8Q2UseSample = function () {
    const inputEl = document.getElementById('ga8Q2RequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST_SELECT, null, 2);
  };

  window._ga8Q2CopyUrl = async function () {
    const el = document.getElementById('ga8Q2SubmitUrl');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const guide = [
    `## Q2 -- Leakage-Safe BigQuery ML Gate (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `The exam grader sends stateful two-phase evaluations to \`${serviceUrl}/bqml\`.`,
    ``,
    `### 💡 Two-Phase Protocol Overview`,
    `1. **Phase 1 (\`select\`)**:`,
    `   - Deduplicates entity rows (keeps highest version, smallest ID).`,
    `   - Feature temporal leakage filter: \`availableAt <= predictionTime\` for all retained rows and feature not in \`forbiddenFeatures\`.`,
    `   - Selects successful trial with highest \`evalMetric\` (ties broken by smallest integer \`trialId\`).`,
    `   - Binds state under \`(tenant, runId)\`. Replays with different params return HTTP 409 (\`RUN_ID_CONFLICT\`).`,
    `2. **Phase 2 (\`evaluate\`)**:`,
    `   - Validates lineage (\`runId\`, \`selectedTrialId\`, \`datasetDigest\`).`,
    `   - Computes aggregate and slice accuracy rounded to **12 decimal places**.`,
    `   - Verifies \`aggregate >= metricFloor\` and slice requirements (\`AGGREGATE_FLOOR\`, \`SLICE_FLOOR:<slice>\`, \`BYTE_LIMIT\`).`,
    ``,
    `### 🧪 Interactive Service Probe`,
    `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`,
    `  <div style="display:flex;gap:8px;align-items:center;">`,
    `    <input id="ga8Q2SubmitUrl" type="text" value="${serviceUrl}" readonly style="flex:1;padding:6px;border-radius:4px;background:#1e1e1e;border:1px solid #444;color:#fff;font-family:monospace;font-size:12px;" />`,
    `    <button type="button" onclick="window._ga8Q2CopyUrl()" class="btn-sm" style="padding:6px 12px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;">Copy URL</button>`,
    `    <button type="button" onclick="window._ga8Q2UseSample()" class="btn-sm" style="padding:6px 12px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;">Load Sample</button>`,
    `  </div>`,
    `  <input id="ga8Q2Email" type="hidden" value="${norm}" />`,
    `  <textarea id="ga8Q2RequestInput" rows="5" style="width:100%;padding:6px;border-radius:4px;background:#111;border:1px solid #333;color:#9cdcfe;font-family:monospace;font-size:11px;" placeholder="Paste test JSON payload here..."></textarea>`,
    `  <button type="button" onclick="window._ga8Q2TestRequest()" style="padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;">POST /bqml</button>`,
    `  <span id="ga8Q2TestStatus" style="font-size:11px;color:#9fc6ff;"></span>`,
    `  <textarea id="ga8Q2TestOutput" rows="5" readonly style="width:100%;padding:6px;border-radius:4px;background:#0d1117;border:1px solid #222;color:#7ee787;font-family:monospace;font-size:11px;" placeholder="Response JSON will appear here..."></textarea>`,
    `</div>`,
    ...promoLines
  ].join('\n');

  return {
    answer: serviceUrl,
    type: 'solved',
    variant: `BigQuery ML Two-Phase Gate for ${norm}`,
    answerDisplay: serviceUrl,
    guide,
    debug: { serviceUrl, endpoint: 'POST /bqml' }
  };
}
