// Solver: GA7 Q3 -- Terraform Plan Policy Gate
// Submit the fixed hosted-service URL; the exam POSTs its own probes to /terraform/plan.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga7Post, ga7Scope } from './api-client.js';

export const id = 'q-terraform-plan-guard-server';
export const title = 'Q3: Terraform Plan Policy Gate';

const RULE_ORDER = [
  ['1. INVALID_PLAN', 'wrong value types'],
  ['2. ENVIRONMENT_MISMATCH', '≠ your assigned workspace'],
  ['3. STATE_UNSAFE', 'backend not gcs/s3/azurerm/remote, or not locked'],
  ['4. UNPINNED_PROVIDER', 'not 6.2.1 / = 6.2.1 / ~> 6.0'],
  ['5. MISSING_LABELS', 'any of the three assigned labels missing/wrong'],
  ['6. PLAINTEXT_SECRET', 'secret not null and not secret://…'],
  ['7. DELETE_NOT_APPROVED', 'deleting storage_bucket/sql_database/persistent_disk without destroyApproved: true'],
  ['8. FORCE_DESTROY', 'storage_bucket with forceDestroy: true']
];

function sampleCreate(scope) {
  return {
    environment: scope?.terraform?.environment || 'prod-xxxxxx',
    state: { backend: 'gcs', locked: true },
    providerVersion: '~> 6.0',
    destroyApproved: false,
    resource: {
      address: 'google_storage_bucket.data', type: 'storage_bucket', action: 'create',
      labels: scope?.terraform?.labels || { owner: 'student-xxxxx', environment: 'production', cost_center: 'cc-xxxx' },
      secret: null, forceDestroy: false
    }
  };
}

function registerTerraformInteractive() {
  if (typeof window === 'undefined' || window._ga7TfRegistered) return;
  window._ga7TfRegistered = true;

  window._ga7TfFetchScope = async function () {
    const email = document.getElementById('ga7TfEmail')?.value || '';
    const statusEl = document.getElementById('ga7TfScopeStatus');
    const outEl = document.getElementById('ga7TfScopeOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    setStatus('Fetching your assigned scope… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const scope = await ga7Scope(email);
      if (outEl) outEl.value = JSON.stringify(scope, null, 2);
      window._ga7TfLastScope = scope;
      setStatus('✅ Loaded. environment/labels below are your assigned Terraform workspace values.', '#198754');
    } catch (err) {
      setStatus(`Failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga7TfTestRequest = async function () {
    const email = document.getElementById('ga7TfEmail')?.value || '';
    const raw = document.getElementById('ga7TfRequestInput')?.value || '';
    const statusEl = document.getElementById('ga7TfTestStatus');
    const outEl = document.getElementById('ga7TfTestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /terraform/plan…', '#e9d5ff');
    try {
      const result = await ga7Post(email, 'terraform/plan', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus(`✅ decision: ${result.decision}, reason: ${result.reason}`, result.decision === 'approve' ? '#198754' : '#d97706');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga7TfUseSample = async function () {
    const inputEl = document.getElementById('ga7TfRequestInput');
    if (inputEl) inputEl.value = JSON.stringify(sampleCreate(window._ga7TfLastScope), null, 2);
  };

  window._ga7TfCopyUrl = async function () {
    const el = document.getElementById('ga7TfSubmitUrl');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerTerraformInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const summary = [
    `Terraform Plan Policy Gate assistant for ${norm}.`,
    `Submit exactly this URL: ${serviceUrl} -- the exam's hidden grader POSTs its own test cases to ${serviceUrl}/terraform/plan and checks the decisions server-side.`
  ].join(' ');

  const guide = [
    `## Q3 -- Terraform Plan Policy Gate (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `That's the entire answer -- the exam POSTs its own probes to \`${serviceUrl}/terraform/plan\`.`,
    ``,
    `### 💡 Rule order (first applicable reason wins)`,
    '| Order | Reason | Fires when |',
    '|---|---|---|',
    ...RULE_ORDER.map(([n, desc]) => { const [num, code] = n.split('. '); return `| ${num} | \`${code}\` | ${desc} |`; }),
    ``,
    `> \`secret: "secret://vault/db-password"\` is **approved** (a reference, not a plaintext value) --`,
    `> only a literal secret string like \`"hunter2"\` trips \`PLAINTEXT_SECRET\`.`,
    ``,
    `### ⚡ Interactive Tester (for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <input type="hidden" id="ga7TfEmail" value="' + norm + '" />',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Assigned Terraform Scope</div>',
    '  <button onclick="window._ga7TfFetchScope()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Fetch My Scope</button>',
    '  <div id="ga7TfScopeStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '  <textarea id="ga7TfScopeOutput" readonly rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:12px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '</div>',
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Test a /terraform/plan Request</div>',
    '  <textarea id="ga7TfRequestInput" rows="12" placeholder="Paste a request JSON body, or click Load Sample below (fetch scope first)" style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;box-sizing:border-box;"></textarea>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">',
    '    <button onclick="window._ga7TfUseSample()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Load Sample (clean create)</button>',
    '    <button onclick="window._ga7TfTestRequest()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Call /terraform/plan</button>',
    '  </div>',
    '  <div id="ga7TfTestStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready</div>',
    '  <textarea id="ga7TfTestOutput" readonly rows="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:12px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Submission URL</div>',
    '  <input id="ga7TfSubmitUrl" readonly value="' + serviceUrl + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;" />',
    '  <button onclick="window._ga7TfCopyUrl()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy URL</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'solved',
    answer: serviceUrl,
    variant: `Terraform plan policy gate assistant for ${norm}`,
    answerDisplay: [
      `### Q3: Terraform Plan Policy Gate`,
      ``,
      `Submit: \`${serviceUrl}\``,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
