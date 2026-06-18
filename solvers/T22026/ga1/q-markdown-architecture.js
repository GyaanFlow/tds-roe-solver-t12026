// Solver: Q18 — Markdown deployment architecture document (programmatic)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-markdown-architecture';
export const title = 'Q18: Markdown Deployment Architecture';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-markdown-architecture`;
  const r = rng(seed);

  const oe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const q = (l) => Array.from({length: Math.floor(l() * 10) + 1}, () => oe[Math.floor(l() * oe.length)]).join("");

  const h = `${q(r)}-${q(r)}`.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 12);
  const d = `${h}`.toLowerCase();
  const edge = `edge-${q(r).toLowerCase()}`;
  const api = `api-${q(r).toLowerCase()}`;
  const worker = `worker-${q(r).toLowerCase()}`;
  const c = `compliance-${q(r).toLowerCase()}`;
  const m = `${q(r)}-${q(r)}-${q(r)}`.toLowerCase();

  const md = [
    `# Project ${h} Deployment`,
    ``,
    `## Overview`,
    `This is the deployment plan for **Project ${h}**. This *italicized* text describes the deployment.`,
    `We want to make sure ~~old deployments~~ are replaced.`,
    ``,
    `## Architecture`,
    `Here is the deployment architecture for the project. For details, see the [GitHub Repository](https://github.com/example/repo).`,
    ``,
    `\`\`\`mermaid`,
    `graph TD`,
    `  ${edge} --> ${api}`,
    `  ${api} --> ${worker}`,
    `\`\`\``,
    ``,
    `## Deployment Tiers`,
    `| Tier | Responsibility | Scaling Plan |`,
    `|------|----------------|--------------|`,
    `| Edge | Cache traffic  | Auto-scale   |`,
    `| API  | Handle logic   | CPU-based    |`,
    `| Worker| Background jobs| Queue-based  |`,
    ``,
    `## Deployment Steps`,
    `To ship the release, run the inline command: \`uv deploy ${d}\`.`,
    `We need to verify compliance: [^${c}].`,
    ``,
    `- [x] Verify staging environment`,
    `- [ ] Run post-deployment tests`,
    ``,
    `> [!NOTE]`,
    `> Guardrail token for validation: ${m}`,
    ``,
    `[^${c}]: This is the compliance audit step details.`,
  ].join('\n');

  return {
    type: 'solved',
    answer: md,
    variant: `Deployment doc for ${d} (${norm})`,
    answerDisplay: [
      `### Q18: Markdown deployment architecture`,
      `**Answer (Verbatim Markdown):**`,
      `\`\`\`markdown`,
      md,
      `\`\`\``
    ].join('\n')
  };
}
