// Solver: GA8 Q4 -- PEFT Choice & Training Repair
// Submit the fixed hosted-service URL; the exam grader POSTs its probes to /adapt.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga8Post } from './api-client.js';

export const id = 'q-peft-repair-server';
export const title = 'Q4: PEFT Choice & Training Repair';

const SAMPLE_REQUEST_CHOOSE = {
  operation: 'choose',
  horizonRequests: 10000,
  qualityFloor: 0.85,
  maxLatencyMs: 60,
  maxMemoryGb: 16,
  maxDataRows: 50000,
  costBudget: 500.0,
  candidates: [
    { name: 'lora', quality: 0.91, latencyMs: 45, memoryGb: 12, maxDataRows: 100000, oneTimeCost: 50, recurringCost: 0.001 }
  ]
};

function registerInteractive() {
  if (typeof window === 'undefined' || window._ga8Q4Registered) return;
  window._ga8Q4Registered = true;

  window._ga8Q4TestRequest = async function () {
    const email = document.getElementById('ga8Q4Email')?.value || '';
    const raw = document.getElementById('ga8Q4RequestInput')?.value || '';
    const statusEl = document.getElementById('ga8Q4TestStatus');
    const outEl = document.getElementById('ga8Q4TestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /adapt… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga8Post(email, 'adapt', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus('✅ Success: Operation executed cleanly.', '#198754');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga8Q4UseSample = function () {
    const inputEl = document.getElementById('ga8Q4RequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST_CHOOSE, null, 2);
  };

  window._ga8Q4CopyUrl = async function () {
    const el = document.getElementById('ga8Q4SubmitUrl');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const guide = [
    `## Q4 -- PEFT Choice & Training Repair (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `The exam grader sends dual-mode requests to \`${serviceUrl}/adapt\`.`,
    ``,
    `### 💡 Dual-Mode Protocol Details`,
    `1. **Operation: \`choose\`**:`,
    `   - Evaluates candidates in priority order: \`prompt_only -> retrieval -> lora -> qlora\`.`,
    `   - Total cost calculation: $\\text{round}(\\text{oneTimeCost} + \\text{horizonRequests} \\times \\text{recurringCost}, 12)$.`,
    `   - Enforces quality, freshness, latency, memory, data, and budget ceilings. Returns first eligible candidate in priority order.`,
    `2. **Operation: \`repair\`**:`,
    `   - **Loss Masking**: Assistant tokens with \`padding: false\` keep their \`id\`; all user/system/padding tokens get label \`-100\`.`,
    `   - **Trainable Parameters**: Filters parameter names ending in \`.lora_A.weight\` or \`.lora_B.weight\` within \`allowedTargets\`.`,
    `   - **Verification Checks**: Validates single template application, \`inferenceMode: false\`, artifact files \`["adapter_config.json", "adapter_model.safetensors"]\`, eval dropout disabled, and disjoint train/eval row sets.`,
    ``,
    `### 🧪 Interactive Service Probe`,
    `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`,
    `  <div style="display:flex;gap:8px;align-items:center;">`,
    `    <input id="ga8Q4SubmitUrl" type="text" value="${serviceUrl}" readonly style="flex:1;padding:6px;border-radius:4px;background:#1e1e1e;border:1px solid #444;color:#fff;font-family:monospace;font-size:12px;" />`,
    `    <button type="button" onclick="window._ga8Q4CopyUrl()" class="btn-sm" style="padding:6px 12px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;">Copy URL</button>`,
    `    <button type="button" onclick="window._ga8Q4UseSample()" class="btn-sm" style="padding:6px 12px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;">Load Sample</button>`,
    `  </div>`,
    `  <input id="ga8Q4Email" type="hidden" value="${norm}" />`,
    `  <textarea id="ga8Q4RequestInput" rows="5" style="width:100%;padding:6px;border-radius:4px;background:#111;border:1px solid #333;color:#9cdcfe;font-family:monospace;font-size:11px;" placeholder="Paste test JSON payload here..."></textarea>`,
    `  <button type="button" onclick="window._ga8Q4TestRequest()" style="padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;">POST /adapt</button>`,
    `  <span id="ga8Q4TestStatus" style="font-size:11px;color:#9fc6ff;"></span>`,
    `  <textarea id="ga8Q4TestOutput" rows="5" readonly style="width:100%;padding:6px;border-radius:4px;background:#0d1117;border:1px solid #222;color:#7ee787;font-family:monospace;font-size:11px;" placeholder="Response JSON will appear here..."></textarea>`,
    `</div>`,
    ...promoLines
  ].join('\n');

  return {
    answer: serviceUrl,
    type: 'solved',
    variant: `PEFT Adaptation & Repair Gateway for ${norm}`,
    answerDisplay: serviceUrl,
    guide,
    debug: { serviceUrl, endpoint: 'POST /adapt' }
  };
}
