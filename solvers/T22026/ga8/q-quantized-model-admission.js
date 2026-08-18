// Solver: GA8 Q5 -- Quantized Model Admission Gate
// Submit the fixed hosted-service URL; the exam grader POSTs its probes to /quantize.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga8Post } from './api-client.js';

export const id = 'q-quantized-model-admission-server';
export const title = 'Q5: Quantized Model Admission Gate';

const SAMPLE_REQUEST_FREEZE = {
  phase: 'freeze',
  freezeId: 'freeze-001',
  calibrationDigest: 'calib-123456',
  tokenizerDigest: 'tok-123456',
  packages: [{
    packageId: 'pkg-int8',
    loadable: true,
    files: [{ name: 'model.safetensors', sizeBytes: 4000000000, digest: 'sha256-abc' }]
  }]
};

function registerInteractive() {
  if (typeof window === 'undefined' || window._ga8Q5Registered) return;
  window._ga8Q5Registered = true;

  window._ga8Q5TestRequest = async function () {
    const email = document.getElementById('ga8Q5Email')?.value || '';
    const raw = document.getElementById('ga8Q5RequestInput')?.value || '';
    const statusEl = document.getElementById('ga8Q5TestStatus');
    const outEl = document.getElementById('ga8Q5TestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /quantize… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga8Post(email, 'quantize', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus('✅ Success: Quantization phase executed cleanly.', '#198754');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga8Q5UseSample = function () {
    const inputEl = document.getElementById('ga8Q5RequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST_FREEZE, null, 2);
  };

  window._ga8Q5CopyUrl = async function () {
    const el = document.getElementById('ga8Q5SubmitUrl');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const guide = [
    `## Q5 -- Quantized Model Admission Gate (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `The exam grader sends stateful two-phase quantization evaluations to \`${serviceUrl}/quantize\`.`,
    ``,
    `### 💡 Gate Workflow`,
    `1. **Phase 1 (\`freeze\`)**:`,
    `   - Computes package file inventory digests and sizes.`,
    `   - Binds \`packageDigest = sha256(compact_json(inventory))\`.`,
    `   - Enforces calibration & tokenizer digests and \`loadable: true\` $\\to$ returns status \`"frozen"\`.`,
    `2. **Phase 2 (\`select\`)**:`,
    `   - Verifies candidate inventory matches stored freeze record (else \`INVALID_MANIFEST\` / \`INVALID_LINEAGE\`).`,
    `   - Evaluates candidate slice and aggregate accuracies against floors.`,
    `   - Enforces \`totalBytes <= maxBytes\` and \`latencyMs <= maxLatencyMs\`.`,
    `   - Ranks admitted packages by \`bytes asc -> latencyMs asc -> candidateOrder index\`.`,
    ``,
    `### 🧪 Interactive Service Probe`,
    `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`,
    `  <div style="display:flex;gap:8px;align-items:center;">`,
    `    <input id="ga8Q5SubmitUrl" type="text" value="${serviceUrl}" readonly style="flex:1;padding:6px;border-radius:4px;background:#1e1e1e;border:1px solid #444;color:#fff;font-family:monospace;font-size:12px;" />`,
    `    <button type="button" onclick="window._ga8Q5CopyUrl()" class="btn-sm" style="padding:6px 12px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;">Copy URL</button>`,
    `    <button type="button" onclick="window._ga8Q5UseSample()" class="btn-sm" style="padding:6px 12px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;">Load Sample</button>`,
    `  </div>`,
    `  <input id="ga8Q5Email" type="hidden" value="${norm}" />`,
    `  <textarea id="ga8Q5RequestInput" rows="5" style="width:100%;padding:6px;border-radius:4px;background:#111;border:1px solid #333;color:#9cdcfe;font-family:monospace;font-size:11px;" placeholder="Paste test JSON payload here..."></textarea>`,
    `  <button type="button" onclick="window._ga8Q5TestRequest()" style="padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;">POST /quantize</button>`,
    `  <span id="ga8Q5TestStatus" style="font-size:11px;color:#9fc6ff;"></span>`,
    `  <textarea id="ga8Q5TestOutput" rows="5" readonly style="width:100%;padding:6px;border-radius:4px;background:#0d1117;border:1px solid #222;color:#7ee787;font-family:monospace;font-size:11px;" placeholder="Response JSON will appear here..."></textarea>`,
    `</div>`,
    ...promoLines
  ].join('\n');

  return {
    answer: serviceUrl,
    type: 'solved',
    variant: `Quantized Model Admission Policy for ${norm}`,
    answerDisplay: serviceUrl,
    guide,
    debug: { serviceUrl, endpoint: 'POST /quantize' }
  };
}
