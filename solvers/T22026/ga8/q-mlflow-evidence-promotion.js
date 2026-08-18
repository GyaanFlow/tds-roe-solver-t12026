// Solver: GA8 Q3 -- MLflow Evidence Promotion Gate
// Submit the fixed hosted-service URL; the exam grader POSTs its probes to /promote.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga8Post } from './api-client.js';

export const id = 'q-mlflow-evidence-promotion-server';
export const title = 'Q3: MLflow Evidence Promotion Gate';

const SAMPLE_REQUEST = {
  policy: {
    accuracyFloor: 0.85,
    minImprovement: 0.02,
    maxAgeSeconds: 86400,
    maxLatencyMs: 50,
    maxSizeBytes: 100000000
  },
  champion: {
    version: '1',
    accuracy: 0.88,
    latencyMs: 30,
    sizeBytes: 50000000,
    createdAt: '2026-01-01T00:00:00Z'
  },
  candidates: [{
    version: '2',
    accuracy: 0.93,
    latencyMs: 35,
    sizeBytes: 52000000,
    createdAt: '2026-01-01T01:00:00Z'
  }]
};

function registerInteractive() {
  if (typeof window === 'undefined' || window._ga8Q3Registered) return;
  window._ga8Q3Registered = true;

  window._ga8Q3TestRequest = async function () {
    const email = document.getElementById('ga8Q3Email')?.value || '';
    const raw = document.getElementById('ga8Q3RequestInput')?.value || '';
    const statusEl = document.getElementById('ga8Q3TestStatus');
    const outEl = document.getElementById('ga8Q3TestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /promote… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga8Post(email, 'promote', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus(`✅ Action: ${result.action}, Selected: ${result.selectedVersion}`, result.action === 'promote' ? '#198754' : '#d97706');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga8Q3UseSample = function () {
    const inputEl = document.getElementById('ga8Q3RequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST, null, 2);
  };

  window._ga8Q3CopyUrl = async function () {
    const el = document.getElementById('ga8Q3SubmitUrl');
    const btn = document.getElementById('ga8Q3CopyBtn');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1800);
      }
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const guide = [
    `## Q3 -- MLflow Evidence Promotion Gate (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `The exam grader sends candidate evaluations and champion states to \`${serviceUrl}/promote\`.`,
    ``,
    `### 💡 Promotion Gate Rules`,
    `1. **Evidence Integrity**: \`datasetDigest\` and \`schemaDigest\` must match policy; \`artifactDigest\` matches candidate version.`,
    `2. **Temporal Freshness**: \`asOf - maxAgeSeconds <= createdAt <= asOf\` (rejects \`FUTURE_EVALUATION\` or \`STALE_EVALUATION\`).`,
    `3. **Hard Ceiling Checks**: \`accuracy >= accuracyFloor\`, \`latencyMs <= maxLatencyMs\`, \`sizeBytes <= maxSizeBytes\`, and all required slices met.`,
    `4. **Decision Logic**:`,
    `   - If champion fails gate: \`action: "block"\`, \`selectedVersion: null\`.`,
    `   - Challenger improvement $= \\text{round}(\\text{challenger.accuracy} - \\text{champion.accuracy}, 12)$.`,
    `   - If improvement $\\ge \\text{minImprovement}$: \`action: "promote"\`, \`selectedVersion: challenger_id\`, \`aliasMutation: {"alias":"champion","version":challenger_id}\`.`,
    `   - Else: \`action: "retain"\`, \`selectedVersion: champion_id\`.`,
    ``,
    `### 🧪 Interactive Service Probe`,
    `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`,
    `  <div style="display:flex;gap:8px;align-items:center;">`,
    `    <input id="ga8Q3SubmitUrl" type="text" value="${serviceUrl}" readonly style="flex:1;padding:6px;border-radius:4px;background:#1e1e1e;border:1px solid #444;color:#fff;font-family:monospace;font-size:12px;" />`,
    `    <button id="ga8Q3CopyBtn" type="button" onclick="window._ga8Q3CopyUrl()" class="btn-sm" style="padding:6px 12px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;">Copy URL</button>`,
    `    <button type="button" onclick="window._ga8Q3UseSample()" class="btn-sm" style="padding:6px 12px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;">Load Sample</button>`,
    `  </div>`,
    `  <input id="ga8Q3Email" type="hidden" value="${norm}" />`,
    `  <textarea id="ga8Q3RequestInput" rows="5" style="width:100%;padding:6px;border-radius:4px;background:#111;border:1px solid #333;color:#9cdcfe;font-family:monospace;font-size:11px;" placeholder="Paste test JSON payload here..."></textarea>`,
    `  <button type="button" onclick="window._ga8Q3TestRequest()" style="padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;">POST /promote</button>`,
    `  <span id="ga8Q3TestStatus" style="font-size:11px;color:#9fc6ff;"></span>`,
    `  <textarea id="ga8Q3TestOutput" rows="5" readonly style="width:100%;padding:6px;border-radius:4px;background:#0d1117;border:1px solid #222;color:#7ee787;font-family:monospace;font-size:11px;" placeholder="Response JSON will appear here..."></textarea>`,
    `</div>`,
    ...promoLines
  ].join('\n');

  return {
    answer: serviceUrl,
    type: 'solved',
    variant: `MLflow Promotion Policy Gate for ${norm}`,
    answerDisplay: serviceUrl,
    guide,
    debug: { serviceUrl, endpoint: 'POST /promote' }
  };
}
