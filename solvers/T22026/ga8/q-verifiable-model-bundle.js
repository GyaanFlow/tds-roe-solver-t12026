// Solver: GA8 Q7 -- Verifiable Model Bundle Verifier
// Submit the fixed hosted-service URL; the exam grader POSTs its probes to /verify-bundle.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga8Post } from './api-client.js';

export const id = 'q-verifiable-model-bundle-server';
export const title = 'Q7: Verifiable Model Bundle Verifier';

const SAMPLE_REQUEST = {
  bundleFiles: [
    { name: 'README.md', content: '<!-- tds-model-card {"task":"text-classification"} -->' },
    { name: 'adapter_config.json', content: '{"r": 8, "target_modules": ["q_proj"]}' },
    { name: 'adapter_model.safetensors', sizeBytes: 1000000, digest: 'sha256-123' },
    { name: 'training_manifest.json', content: '{"adapter_digest":"sha256-123"}' },
    { name: 'evaluation.json', content: '{"accuracy": 0.95}' },
    { name: 'inventory.json', content: '{"files": []}' }
  ]
};

function registerInteractive() {
  if (typeof window === 'undefined' || window._ga8Q7Registered) return;
  window._ga8Q7Registered = true;

  window._ga8Q7TestRequest = async function () {
    const email = document.getElementById('ga8Q7Email')?.value || '';
    const raw = document.getElementById('ga8Q7RequestInput')?.value || '';
    const statusEl = document.getElementById('ga8Q7TestStatus');
    const outEl = document.getElementById('ga8Q7TestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /verify-bundle… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga8Post(email, 'verify-bundle', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus(`✅ Status: ${result.status || 'OK'}`, '#198754');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga8Q7UseSample = function () {
    const inputEl = document.getElementById('ga8Q7RequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST, null, 2);
  };

  window._ga8Q7CopyUrl = async function () {
    const el = document.getElementById('ga8Q7SubmitUrl');
    const btn = document.getElementById('ga8Q7CopyBtn');
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
    `## Q7 -- Verifiable Model Bundle Verifier (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `The exam grader sends model bundle validation requests to \`${serviceUrl}/verify-bundle\`.`,
    ``,
    `### 💡 Verifier Checklist`,
    `1. **Required Files**: \`README.md\`, \`training_manifest.json\`, \`evaluation.json\`, \`inventory.json\`, \`adapter_model.safetensors\`, \`adapter_config.json\`.`,
    `2. **Unsafe Weights Filter**: Immediately rejects pickle files (\`.bin\`, \`.pt\`, \`.pth\`, \`.pkl\`, \`.pickle\`) with \`UNSAFE_WEIGHTS\`.`,
    `3. **Inventory & Digest Verification**: Recomputes SHA-256 digests and verifies against \`inventory.json\`.`,
    `4. **Adapter Config**: Enforces \`r > 0\` and non-empty \`target_modules\`.`,
    `5. **Model Card Marker**: Extracts HTML comment marker in \`README.md\`:`,
    `   \`<!-- tds-model-card {"task":"...", "baseRevision":"...", ...} -->\``,
    `   Requires exactly 1 valid marker matching policy and manifest fields.`,
    ``,
    `### 🧪 Interactive Service Probe`,
    `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`,
    `  <div style="display:flex;gap:8px;align-items:center;">`,
    `    <input id="ga8Q7SubmitUrl" type="text" value="${serviceUrl}" readonly style="flex:1;padding:6px;border-radius:4px;background:#1e1e1e;border:1px solid #444;color:#fff;font-family:monospace;font-size:12px;" />`,
    `    <button id="ga8Q7CopyBtn" type="button" onclick="window._ga8Q7CopyUrl()" class="btn-sm" style="padding:6px 12px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;">Copy URL</button>`,
    `    <button type="button" onclick="window._ga8Q7UseSample()" class="btn-sm" style="padding:6px 12px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;">Load Sample</button>`,
    `  </div>`,
    `  <input id="ga8Q7Email" type="hidden" value="${norm}" />`,
    `  <textarea id="ga8Q7RequestInput" rows="5" style="width:100%;padding:6px;border-radius:4px;background:#111;border:1px solid #333;color:#9cdcfe;font-family:monospace;font-size:11px;" placeholder="Paste test JSON payload here..."></textarea>`,
    `  <button type="button" onclick="window._ga8Q7TestRequest()" style="padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;">POST /verify-bundle</button>`,
    `  <span id="ga8Q7TestStatus" style="font-size:11px;color:#9fc6ff;"></span>`,
    `  <textarea id="ga8Q7TestOutput" rows="5" readonly style="width:100%;padding:6px;border-radius:4px;background:#0d1117;border:1px solid #222;color:#7ee787;font-family:monospace;font-size:11px;" placeholder="Response JSON will appear here..."></textarea>`,
    `</div>`,
    ...promoLines
  ].join('\n');

  return {
    answer: serviceUrl,
    type: 'solved',
    variant: `Model Bundle Integrity & Model Card Verifier for ${norm}`,
    answerDisplay: serviceUrl,
    guide,
    debug: { serviceUrl, endpoint: 'POST /verify-bundle' }
  };
}
