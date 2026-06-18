// Solver: Q16 — Markdown architecture note (mermaid, GFM task list, table, callout, footnote)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-markdown-architecture';
export const title = 'Q16: Markdown Architecture Document';

const EDGE_NODES = ['CDN', 'CloudFront', 'Varnish', 'Fastly', 'EdgeCache'];
const API_NODES = ['API', 'FastAPI', 'NginxProxy', 'Gateway', 'LoadBalancer'];
const WORKER_NODES = ['Worker', 'Celery', 'RQ', 'Dramatiq', 'SidekiqWorker'];
const PROJECT_NAMES = ['Phoenix', 'Orion', 'Nova', 'Atlas', 'Nexus', 'Aurora', 'Titan'];
const DEPLOY_PKGS = ['tds-backend', 'tds-api', 'tds-service', 'data-platform', 'ml-pipeline'];
const TOKENS = ['alpha-7f3a', 'beta-2d9c', 'gamma-5b1e', 'delta-8e4f', 'epsilon-3c7a'];
const FOOTNOTE_LABELS = ['1', 'audit', 'deploy', 'sec', 'ops'];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-markdown-architecture`);

  const project = pick(PROJECT_NAMES, r);
  const edge = pick(EDGE_NODES, r);
  const api = pick(API_NODES, r);
  const worker = pick(WORKER_NODES, r);
  const deployPkg = pick(DEPLOY_PKGS, r);
  const token = pick(TOKENS, r);
  const footnoteLabel = pick(FOOTNOTE_LABELS, r);

  const doc = `# Project ${project} Deployment

This document describes how the **${project}** data product moves from *staging* to production.
The pipeline is managed using \`uv deploy ${deployPkg}\` and monitored with guardrail token ${token}. [^${footnoteLabel}]

For the latest release notes, see the [Changelog](https://example.com/changelog).
~~Legacy deployment scripts~~ have been deprecated in favour of the modern pipeline.

## Architecture Overview

\`\`\`mermaid
graph TD
    ${edge}[Edge Cache / ${edge}] --> ${api}[API Tier / ${api}]
    ${api} --> ${worker}[Background Worker / ${worker}]
    ${worker} --> DB[(Database)]
\`\`\`

## Deployment Command

To ship a release, run:

\`uv deploy ${deployPkg}\`

This triggers the CI/CD pipeline and promotes the staging build to production.

> [!NOTE]
> The guardrail token **${token}** must be present in every deployment manifest.
> Contact the platform team if the token is missing from your environment.

## Deployment Tasks

- [x] Validate staging environment health checks
- [x] Run integration test suite
- [ ] Promote build to production
- [ ] Monitor error rates for 30 minutes post-deploy
- [ ] Update incident runbook

## Tier Summary

| Tier | Component | Responsibility | Scaling Plan |
|------|-----------|---------------|--------------|
| Edge | ${edge} | Cache static assets, terminate TLS | Horizontal auto-scaling |
| API | ${api} | Route requests, handle auth | Kubernetes HPA (CPU-based) |
| Worker | ${worker} | Process async jobs, run ML inference | Queue-depth-based scaling |
| Storage | Database | Persist data | Read replicas + connection pooling |

[^${footnoteLabel}]: Audit step: Every deployment is logged to the security audit trail with a timestamp and operator ID. The guardrail token ${token} is verified against the central secrets manager before the deployment proceeds.
`;

  const guide = [
    `### What the exam requires`,
    ``,
    `A Markdown document that includes ALL of:`,
    `- **H1 heading**: \`# Project ${project} Deployment\``,
    `- **Mermaid diagram** with nodes: \`${edge}\`, \`${api}\`, \`${worker}\``,
    `- **Inline code**: \`uv deploy ${deployPkg}\``,
    `- **GFM task list** with at least one ✅ checked and one ☐ unchecked item`,
    `- **Table** summarising tiers, responsibility, scaling`,
    `- **Callout**: \`> [!NOTE]\` referencing guardrail token \`${token}\``,
    `- **Footnote**: \`[^${footnoteLabel}]\` in body + definition at end`,
    `- **Bold**, *italic*, ~~strikethrough~~ text`,
    `- At least one hyperlink`,
    ``,
    `### Your personalised values`,
    ``,
    `| Element | Your value |`,
    `|---------|-----------|`,
    `| Project | \`${project}\` |`,
    `| Edge node | \`${edge}\` |`,
    `| API node | \`${api}\` |`,
    `| Worker node | \`${worker}\` |`,
    `| Deploy pkg | \`uv deploy ${deployPkg}\` |`,
    `| Guardrail token | \`${token}\` |`,
    `| Footnote label | \`[^${footnoteLabel}]\` |`,
    ``,
    `The answer box contains a complete, ready-to-submit document. Review it against your exam's exact node names.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'Complete Markdown architecture document with all required elements',
    answer: doc,
    guide,
    answerDisplay: [
      `### Q16: Markdown Architecture Document`,
      ``,
      `The answer box contains the complete document with all required elements.`,
      ``,
      `**Key elements included:**`,
      `- H1: \`# Project ${project} Deployment\``,
      `- Mermaid: \`${edge}\` → \`${api}\` → \`${worker}\``,
      `- Deploy: \`uv deploy ${deployPkg}\``,
      `- Token: \`${token}\``,
      `- Footnote: \`[^${footnoteLabel}]\``,
      ``,
      `> ⚠️ Cross-check node names (\`${edge}\`, \`${api}\`, \`${worker}\`) with your exam's values.`,
    ].join('\n'),
  };
}
