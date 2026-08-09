// Solver: GA7 Q10 -- Audit a GitHub Actions Workflow
//
// The per-student workflow YAML and its findings are generated deterministically by the exam's
// own seeded generator -- faithful port, reads findings/job-id off the generator directly.
import seedrandom from './seedrandom.js';
import { normalizeEmail, requireEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-actions-workflow-audit';
export const title = 'Q10: Audit a GitHub Actions Workflow';

const FINDING_CODES = [
  ['W1', 'Untrusted pull-request code runs in a privileged context'],
  ['W2', 'A third-party action is not pinned to a full commit SHA'],
  ['W3', 'Workflow-level permissions are broader than any job needs'],
  ['W4', 'A secret is written to the build log'],
  ['W5', 'A production deploy has no environment approval gate'],
  ['W6', 'Attacker-controlled event data is interpolated into a shell command']
];

function randomSha(rng) {
  return Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(rng() * 16)]).join('');
}

function generateWorkflowScenario(email, version = '') {
  const rng = seedrandom(`q-actions-workflow-audit#${String(email || '').trim().toLowerCase()}#${version}`);
  const pick = arr => arr[Math.floor(rng() * arr.length)];

  const previewJob = pick(['pr-preview', 'preview-build', 'pr-artifacts', 'review-app']);
  const deployJob = pick(['ship-prod', 'release', 'deploy-prod', 'publish']);
  const orgName = pick(['acme-ci', 'buildkit-labs', 'shipfast', 'deploy-tools']);
  const pinnedSha = randomSha(rng);

  const findings = new Set(['W1']);
  for (const code of ['W2', 'W3', 'W4', 'W5', 'W6']) {
    if (rng() < 0.55) findings.add(code);
  }
  for (const code of ['W4', 'W2', 'W5']) {
    if (findings.size >= 3) break;
    findings.add(code);
  }
  const has = (code) => findings.has(code);

  const permissionsBlock = has('W3')
    ? '  contents: write\n  pull-requests: write\n  id-token: write'
    : '  contents: read';
  const setupActionRef = has('W2') ? `${orgName}/setup-action@v3` : `${orgName}/setup-action@${pinnedSha}`;
  const secretStep = has('W4')
    ? '      - name: Show configuration\n        run: echo "registry token is ${{ secrets.REGISTRY_TOKEN }}"'
    : '      - name: Show configuration\n        run: echo "registry host is $REGISTRY_HOST"\n        env:\n          REGISTRY_HOST: ${{ vars.REGISTRY_HOST }}';
  const environmentBlock = has('W5') ? '' : '    environment:\n      name: production\n';
  const labelStep = has('W6')
    ? '      - name: Label the build\n        run: |\n          echo "Building ${{ github.event.pull_request.title }}" >> notes.txt'
    : '      - name: Label the build\n        run: |\n          echo "Building $PR_TITLE" >> notes.txt\n        env:\n          PR_TITLE: ${{ github.event.pull_request.title }}';

  const workflow = `name: CI and release

on:
  pull_request_target:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
${permissionsBlock}

jobs:
  ${previewJob}:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
      - uses: ${setupActionRef}
      - name: Install and build
        run: npm ci && npm run build
${labelStep}
      - name: Upload preview
        uses: actions/upload-artifact@v4
        with:
          name: preview
          path: dist/

  unit-tests:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm ci && npm test

  ${deployJob}:
    needs: [unit-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
${environmentBlock}    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: ${orgName}/deploy-action@${randomSha(rng)}
        with:
          project: storefront
${secretStep}
      - name: Deploy
        run: ./scripts/deploy.sh --env production
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
`;

  return { workflow, previewJob, deployJob, findings: [...findings].sort() };
}

function registerActionsAuditInteractive() {
  if (typeof window === 'undefined' || window._ga7AwaRegistered) return;
  window._ga7AwaRegistered = true;
  window._ga7AwaCopyAnswer = async function () {
    const el = document.getElementById('ga7AwaOutput');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerActionsAuditInteractive();
  const norm = requireEmail(normalizeEmail(email), 'Q10 (GitHub Actions Workflow Audit)');
  const scenario = generateWorkflowScenario(norm, 'v1');
  const answer = `${scenario.findings.join(',')}|${scenario.previewJob}`;

  const summary = [
    `GitHub Actions Workflow Audit solver for ${norm}.`,
    `Computed answer: ${answer} (finding codes present, and the id of the job an untrusted contributor can abuse).`
  ].join(' ');

  const guide = [
    `## Q10 -- Audit a GitHub Actions Workflow (for ${norm})`,
    ``,
    `### 🎯 Your answer`,
    '```text',
    answer,
    '```',
    `Format: \`codes|job-id\`. Findings present: **${scenario.findings.join(', ')}**. The job an`,
    `untrusted outside contributor can abuse to run code in a privileged context is`,
    `**\`${scenario.previewJob}\`** (it checks out \`pull_request_target\`'s head SHA -- attacker code`,
    `-- while running with the workflow's elevated \`pull_request_target\` privileges).`,
    ``,
    `### 🧠 How this was derived`,
    `Your assigned workflow YAML is generated deterministically from your email using the exam's`,
    `own seeded random generator -- which finding codes are "planted" in your specific copy is`,
    `part of that same seed. This solver reimplements that exact generator, so it reads the`,
    `finding list and vulnerable job id directly rather than re-auditing the rendered YAML by eye.`,
    ``,
    `### 📋 Finding codes`,
    '| Code | Description |',
    '|---|---|',
    ...FINDING_CODES.map(([code, desc]) => `| \`${code}\` | ${desc} |`),
    ``,
    `### 📄 Your workflow file (\`.github/workflows/ci.yml\`)`,
    '```yaml',
    scenario.workflow,
    '```',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Answer</div>',
    '  <input id="ga7AwaOutput" readonly value="' + answer + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;" />',
    '  <button onclick="window._ga7AwaCopyAnswer()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Answer</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `GitHub Actions workflow audit solver for ${norm}`,
    answerDisplay: [
      `### Q10: Audit a GitHub Actions Workflow`,
      ``,
      `\`${answer}\``,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
