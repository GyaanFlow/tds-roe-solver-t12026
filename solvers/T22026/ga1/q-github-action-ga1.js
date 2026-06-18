// Solver: Q9 — GitHub Actions with email in step name
import { normalizeEmail } from './utils.js';

export const id = 'q-github-action-ga1';
export const title = 'Q10: GitHub Action with Email in Step Name';

function escapeYamlSingleQuoted(value) {
  return String(value).replace(/'/g, "''");
}

export async function solve(email) {
  const norm = normalizeEmail(email);

  const yaml = `name: TDS GA1 Validation

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: '${escapeYamlSingleQuoted(norm)}'
        run: echo "Hello, world!"
`.trim();

  let repoUrl = 'https://github.com/[YOUR-USERNAME]/[REPO-NAME]';
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const { execSync } = await import('child_process');
      const remote = execSync('git remote get-url origin', { encoding: 'utf8', timeout: 1000 }).trim();
      const match = remote.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
      if (match) {
        repoUrl = `https://github.com/${match[1]}/${match[2]}`;
      }
    } catch (e) {
      // ignore
    }
  }

  const guide = [
    `### Implementation Guide`,
    ``,
    `1. Make sure this repository (or your fork) has GitHub Actions enabled.`,
    `2. Create a file named \`.github/workflows/main.yml\` with this content:`,
    `\`\`\`yaml`,
    yaml,
    `\`\`\``,
    `3. Commit and push it to your \`main\` branch.`,
    `4. Wait for the run to succeed on GitHub Actions (green checkmark).`,
    `5. Submit your repository URL in the answer box.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'Email in GitHub Actions step name — read Implementation Guide for details',
    answer: repoUrl,
    guide,
    answerDisplay: [
      `### Q10: GitHub Action`,
      ``,
      `**Suggested Repository URL:** \`${repoUrl}\``,
      ``,
      `Create \`.github/workflows/main.yml\` with the following content:`,
      `\`\`\`yaml`,
      yaml,
      `\`\`\``,
      ``,
      `Read the **Implementation Guide** for details on running the workflow.`,
    ].join('\n'),
  };
}
