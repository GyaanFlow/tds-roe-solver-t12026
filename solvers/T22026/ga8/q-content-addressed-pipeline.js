// Solver: GA8 Q6 -- Content-Addressed DAG Pipeline
// Submit the fixed hosted-service URL; the exam grader POSTs its probes to /pipeline.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga8Post } from './api-client.js';

export const id = 'q-content-addressed-pipeline-server';
export const title = 'Q6: Content-Addressed DAG Pipeline';

const SAMPLE_REQUEST = {
  pipelineRunId: 'pipe-001',
  nodes: {
    verify_data: { generation: '101', checksum: 'a1b2c3' }
  }
};

function registerInteractive() {
  if (typeof window === 'undefined' || window._ga8Q6Registered) return;
  window._ga8Q6Registered = true;

  window._ga8Q6TestRequest = async function () {
    const email = document.getElementById('ga8Q6Email')?.value || '';
    const raw = document.getElementById('ga8Q6RequestInput')?.value || '';
    const statusEl = document.getElementById('ga8Q6TestStatus');
    const outEl = document.getElementById('ga8Q6TestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /pipeline… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga8Post(email, 'pipeline', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus('✅ Success: DAG transitions computed.', '#198754');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga8Q6UseSample = function () {
    const inputEl = document.getElementById('ga8Q6RequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST, null, 2);
  };

  window._ga8Q6CopyUrl = async function () {
    const el = document.getElementById('ga8Q6SubmitUrl');
    const btn = document.getElementById('ga8Q6CopyBtn');
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
    `## Q6 -- Content-Addressed DAG Pipeline (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `The exam grader sends DAG controller transitions to \`${serviceUrl}/pipeline\`.`,
    ``,
    `### 💡 6-Stage DAG Pipeline Specification`,
    `$$\\text{verify\\_data} \\to \\text{prepare} \\to \\text{train} \\to \\text{evaluate} \\to \\text{register} \\to \\text{publish}$$`,
    ``,
    `1. **Content-Addressed Keys**:`,
    `   - \`verify_data\`: \`sha256([generation, checksum])\``,
    `   - \`prepare\`: \`sha256([canonicalData, prepareCode, prepareConfig])\``,
    `   - \`train\`: \`sha256([prepareArtifact, trainCode, trainConfig, runtime])\``,
    `   - \`evaluate\`: \`sha256([trainArtifact, canonicalData, evaluateCode, evaluateConfig])\``,
    `   - \`register\`: \`sha256([evaluateArtifact, schemaDigest])\``,
    `   - \`publish\`: \`sha256([registerArtifact, publishConfig])\``,
    `2. **Node Actions**:`,
    `   - \`reuse\` (\`CACHE_HIT\`), \`rerun\` (\`CACHE_MISS\` or \`RETRYABLE_FAILURE\`), \`block\` (\`RUNNING\`, \`TERMINAL_FAILURE\`, \`UPSTREAM_TERMINAL\`, \`UPSTREAM_PENDING\`).`,
    `   - \`register\` & \`publish\` require valid receipt format: \`receipt:<node>:<key>\`.`,
    ``,
    `### 🧪 Interactive Service Probe`,
    `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`,
    `  <div style="display:flex;gap:8px;align-items:center;">`,
    `    <input id="ga8Q6SubmitUrl" type="text" value="${serviceUrl}" readonly style="flex:1;padding:6px;border-radius:4px;background:#1e1e1e;border:1px solid #444;color:#fff;font-family:monospace;font-size:12px;" />`,
    `    <button id="ga8Q6CopyBtn" type="button" onclick="window._ga8Q6CopyUrl()" class="btn-sm" style="padding:6px 12px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;">Copy URL</button>`,
    `    <button type="button" onclick="window._ga8Q6UseSample()" class="btn-sm" style="padding:6px 12px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;">Load Sample</button>`,
    `  </div>`,
    `  <input id="ga8Q6Email" type="hidden" value="${norm}" />`,
    `  <textarea id="ga8Q6RequestInput" rows="5" style="width:100%;padding:6px;border-radius:4px;background:#111;border:1px solid #333;color:#9cdcfe;font-family:monospace;font-size:11px;" placeholder="Paste test JSON payload here..."></textarea>`,
    `  <button type="button" onclick="window._ga8Q6TestRequest()" style="padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;">POST /pipeline</button>`,
    `  <span id="ga8Q6TestStatus" style="font-size:11px;color:#9fc6ff;"></span>`,
    `  <textarea id="ga8Q6TestOutput" rows="5" readonly style="width:100%;padding:6px;border-radius:4px;background:#0d1117;border:1px solid #222;color:#7ee787;font-family:monospace;font-size:11px;" placeholder="Response JSON will appear here..."></textarea>`,
    `</div>`,
    ...promoLines
  ].join('\n');

  return {
    answer: serviceUrl,
    type: 'solved',
    variant: `Content-Addressed DAG Controller for ${norm}`,
    answerDisplay: serviceUrl,
    guide,
    debug: { serviceUrl, endpoint: 'POST /pipeline' }
  };
}
