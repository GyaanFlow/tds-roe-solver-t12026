// Solver: GA7 Q1 -- CI/CD Container Release Gate
//
// The hosted GA7 API answers 75% of this question (the live policy probes against
// /release-gate). The remaining 25% requires the student's own public GitHub Actions
// workflow (a repo/workflow this service cannot create on their behalf) -- so this solver
// auto-fills the serviceUrl half and provides a guided form + interactive tester for the rest.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga7Post } from './api-client.js';

export const id = 'q-cicd-container-release-gate-server';
export const title = 'Q1: CI/CD Container Release Gate';

const VIOLATION_CODES = [
  ['EXCESS_PERMISSION', 'permissions ≠ exactly {contents:read, packages:write, id-token:none}'],
  ['UNSAFE_PR_TRIGGER', 'trigger is pull_request_target'],
  ['TESTS_INCOMPLETE', 'testsPassed≠true, or matrixComplete≠true, or failFast≠false'],
  ['MUTABLE_ACTION', 'a non-actions owner without a full 40-char lowercase hex SHA'],
  ['SINGLE_STAGE_IMAGE', 'multiStage≠true'],
  ['ROOT_RUNTIME', 'runsAsRoot≠false'],
  ['SECRET_IN_LAYER', 'secretMode not none/buildkit'],
  ['CRITICAL_CVE', 'criticalVulnerabilities≠0'],
  ['UNPINNED_IMAGE', 'digestPinned≠true'],
  ['INVALID_PRODUCTION_REF', 'production without push on refs/heads/main'],
  ['APPROVAL_REQUIRED', 'production without environmentApproval: true']
];

const SAMPLE_CLEAN_PREVIEW = {
  target: 'preview', event: 'pull_request', ref: 'refs/heads/feature-x',
  workflow: {
    trigger: 'pull_request', permissions: { contents: 'read', packages: 'write', 'id-token': 'none' },
    testsPassed: true, matrixComplete: true, failFast: false,
    actions: [{ owner: 'actions', name: 'checkout', ref: 'v4' }], environmentApproval: true
  },
  image: { multiStage: true, runsAsRoot: false, secretMode: 'none', criticalVulnerabilities: 0, digestPinned: true }
};

function registerReleaseGateInteractive() {
  if (typeof window === 'undefined' || window._ga7RgRegistered) return;
  window._ga7RgRegistered = true;

  window._ga7RgTestRequest = async function () {
    const email = document.getElementById('ga7RgEmail')?.value || '';
    const raw = document.getElementById('ga7RgRequestInput')?.value || '';
    const statusEl = document.getElementById('ga7RgTestStatus');
    const outEl = document.getElementById('ga7RgTestOutput');

    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }

    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }

    setStatus('Calling /release-gate… (first call after idle may take ~30-50s, cold start)', '#e9d5ff');
    try {
      const result = await ga7Post(email, 'release-gate', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus(`✅ decision: ${result.decision}${result.violations?.length ? `, violations: ${result.violations.join(', ')}` : ''}`, result.decision === 'promote' ? '#198754' : '#d97706');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga7RgUseSample = function () {
    const inputEl = document.getElementById('ga7RgRequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_CLEAN_PREVIEW, null, 2);
  };

  window._ga7RgBuildAnswer = function () {
    const email = document.getElementById('ga7RgEmail')?.value || '';
    const workflowUrl = (document.getElementById('ga7RgWorkflowUrl')?.value || '').trim();
    const outEl = document.getElementById('ga7RgAnswerOutput');
    const statusEl = document.getElementById('ga7RgAnswerStatus');

    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }

    if (!workflowUrl) {
      setStatus('Paste your GitHub Actions workflow PAGE url first (…/actions/workflows/FILE.yml) -- this half is on you, the API cannot create it for you.', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }
    // The exam is explicit: "Submit the workflow page URL, not an individual run URL." A run URL
    // (/actions/runs/12345) is the single most likely mistake here and silently costs the 25%.
    let urlWarning = '';
    if (/\/actions\/runs\//i.test(workflowUrl)) {
      urlWarning = '⚠️ That looks like an individual RUN url. The exam wants the workflow PAGE url instead: …/actions/workflows/YOUR-FILE.yml';
    } else if (!/^https:\/\/github\.com\//i.test(workflowUrl)) {
      urlWarning = '⚠️ That should be a https://github.com/… url pointing at your public workflow page.';
    } else if (!/\/actions\/workflows\//i.test(workflowUrl)) {
      urlWarning = '⚠️ Expected a workflow page url of the form https://github.com/OWNER/REPO/actions/workflows/FILE.yml';
    }
    let answer;
    try {
      answer = { serviceUrl: serviceUrlFor(email), workflowUrl };
    } catch (err) {
      setStatus(err.message, '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }
    if (outEl) outEl.value = JSON.stringify(answer, null, 2);
    setStatus(
      urlWarning || '✅ Submission JSON ready. Copy this into the exam answer box.',
      urlWarning ? '#d97706' : '#198754'
    );
  };

  window._ga7RgCopyAnswer = async function () {
    const el = document.getElementById('ga7RgAnswerOutput');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerReleaseGateInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const summary = [
    `CI/CD Container Release Gate assistant for ${norm}.`,
    `Your hosted service URL is ${serviceUrl}. Submit it together with your own public GitHub Actions workflow PAGE url as {"serviceUrl":"...","workflowUrl":"..."} -- the workflow half is 25% of this question and can't be auto-generated.`
  ].join(' ');

  const guide = [
    `## Q1 -- CI/CD Container Release Gate (for ${norm})`,
    ``,
    `### 🎯 Your service URL`,
    '```text',
    serviceUrl,
    '```',
    `This alone covers **75%** of this question -- the exam's hidden grader POSTs test cases`,
    `directly to \`${serviceUrl}/release-gate\` and checks the decisions. No auth, no token, CORS open.`,
    ``,
    `### ⚠️ The 25% Evidence Requirement: Step-by-Step Setup Guide`,
    `A hosted API cannot create a GitHub repository on your behalf. Follow these exact steps to complete your submission:`,
    ``,
    `#### 📌 Step 1: Create a Public GitHub Repository`,
    `1. Go to [GitHub New Repository](https://github.com/new).`,
    `2. Name your repository (e.g. \`tds-ga7-release-gate\`).`,
    `3. **Crucial:** Make sure the visibility is set to **Public** (the exam grader cannot access private repos).`,
    `4. Click **Create repository**.`,
    ``,
    `#### 📌 Step 2: Create the Workflow File`,
    `Inside your repository, create a file at exactly this path:`,
    `\`.github/workflows/tds-ga7-release-gate.yml\``,
    ``,
    `#### 📌 Step 3: Copy and Paste This Complete Workflow YAML`,
    `Copy and paste the exact YAML snippet below into \`.github/workflows/tds-ga7-release-gate.yml\`:`,
    ``,
    '```yaml',
    `name: "TDS GA7 Release Gate"`,
    ``,
    `on:`,
    `  push:`,
    `    branches: [main]`,
    ``,
    `jobs:`,
    `  test-release-gate:`,
    `    runs-on: ubuntu-latest`,
    `    steps:`,
    `      - name: "TDS identity: ${norm}"`,
    `        run: echo "Verifying identity for ${norm}"`,
    ``,
    `      - name: "Test Hosted Release Gate API"`,
    `        run: |`,
    `          curl -f -X POST "${serviceUrl}/release-gate" \\`,
    `            -H "Content-Type: application/json" \\`,
    `            -d '{"target":"preview","event":"pull_request","ref":"refs/heads/feature","workflow":{"trigger":"pull_request","permissions":{"contents":"read","packages":"write","id-token":"none"},"testsPassed":true,"matrixComplete":true,"failFast":false,"actions":[{"owner":"actions","name":"checkout","ref":"v4"}],"environmentApproval":true},"image":{"multiStage":true,"runsAsRoot":false,"secretMode":"none","criticalVulnerabilities":0,"digestPinned":true}}'`,
    '```',
    ``,
    `#### 📌 Step 4: Commit and Push to \`main\``,
    `1. Commit your new file and push to the **\`main\`** branch.`,
    `2. Open the **Actions** tab in your GitHub repository and verify that the workflow runs and shows a green checkmark ✅.`,
    ``,
    `#### 📌 Step 5: Get Your Workflow Page URL`,
    `1. In your repository on GitHub, click the **Actions** tab.`,
    `2. In the left sidebar under "Workflows", click **TDS GA7 Release Gate**.`,
    `3. Copy the URL from your browser address bar. It MUST look like:`,
    `   \`https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/tds-ga7-release-gate.yml\``,
    `   *(Do NOT submit an individual run URL ending in /actions/runs/123456)*`,
    ``,
    `#### 📌 Step 6: Build Your Final Submission JSON`,
    `Paste your workflow URL into the interactive tool below or construct the JSON directly:`,
    '```json',
    JSON.stringify({ serviceUrl, workflowUrl: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/tds-ga7-release-gate.yml` }, null, 2),
    '```',
    ``,
    `### 💡 Decision logic (for understanding live probes)`,
    `Returns a **violation set**, not a first-match reason -- multiple failures all appear together.`,
    `\`{"decision":"promote"|"block","violations":["CODE",...]}\` -- \`promote\` only when \`violations\` is empty.`,
    ``,
    '| Code | Fires when |',
    '|---|---|',
    ...VIOLATION_CODES.map(([code, desc]) => `| \`${code}\` | ${desc} |`),
    ``,
    `> Actions owned by \`actions\` may use a version tag (e.g. \`v4\`). Everyone else needs a full`,
    `> 40-char commit SHA, and it must be **lowercase** -- an uppercase SHA is rejected.`,
    ``,
    `### ⚡ Interactive Tester & Submission Builder (for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <input type="hidden" id="ga7RgEmail" value="' + norm + '" />',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Test a /release-gate Request</div>',
    '  <textarea id="ga7RgRequestInput" rows="12" placeholder="Paste a request JSON body, or click Load Sample below" style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;box-sizing:border-box;"></textarea>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">',
    '    <button onclick="window._ga7RgUseSample()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Load Clean Preview Sample</button>',
    '    <button onclick="window._ga7RgTestRequest()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Call /release-gate</button>',
    '  </div>',
    '  <div id="ga7RgTestStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready</div>',
    '  <textarea id="ga7RgTestOutput" readonly rows="4" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:12px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '</div>',
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Build Your Submission JSON</div>',
    '  <input id="ga7RgWorkflowUrl" type="url" placeholder="https://github.com/your-user/your-repo/actions/workflows/tds-ga7-release-gate.yml" style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;" />',
    '  <button onclick="window._ga7RgBuildAnswer()" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Build Submission JSON</button>',
    '  <div id="ga7RgAnswerStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '  <textarea id="ga7RgAnswerOutput" readonly rows="3" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;margin-top:8px;"></textarea>',
    '  <button onclick="window._ga7RgCopyAnswer()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Submission JSON</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `CI/CD release gate assistant for ${norm}`,
    answerDisplay: [
      `### Q1: CI/CD Container Release Gate`,
      ``,
      `Your service URL: \`${serviceUrl}\`. Set up your GitHub Actions workflow, then build the full submission JSON below for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
