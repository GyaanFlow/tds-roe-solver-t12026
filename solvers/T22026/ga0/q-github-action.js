// Solver: Q13 — GitHub Action Workflow
import { normalizeEmail } from './utils.js';

export const id = 'q-github-action';
export const title = 'Q13: GitHub Action Workflow';

function escapeYamlSingleQuoted(value) {
  return String(value).replace(/'/g, "''");
}

export async function solve(email) {
  const normalizedEmail = normalizeEmail(email);

  const yaml = `
name: Validate and Deploy

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: '${escapeYamlSingleQuoted(normalizedEmail)}'
        run: echo "Hello, world!"
`.trim();

  const guide = [
    `### Implementation Guide`,
    ``,
    `1. Create a public GitHub repository.`,
    `2. Create this file exactly: \`.github/workflows/main.yml\`.`,
    `3. Paste the YAML from the answer box.`,
    `4. Commit the file to the \`main\` branch.`,
    `5. Open the repo's **Actions** tab and wait until the workflow has a run.`,
    `6. Submit the repository URL, for example: \`https://github.com/USER/REPO\`.`,
    ``,
    `### Validator Notes`,
    ``,
    `The checker calls GitHub's API for the latest workflow run, then checks every job step name.`,
    `So the email must appear in the step name exactly like this:`,
    ``,
    `\`\`\`yaml`,
    `- name: '${escapeYamlSingleQuoted(normalizedEmail)}'`,
    `  run: echo "Hello, world!"`,
    `\`\`\``,
    ``,
    `Do not put the email only inside \`run\`; that will not pass.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'Email in GitHub Actions step name',
    answer: yaml,
    guide,
    answerDisplay: [
      `### GitHub Action YAML`,
      ``,
      `Create \`.github/workflows/main.yml\` with the generated YAML.`,
      ``,
      `The important part is that the step name contains your email:`,
      ``,
      `\`\`\`yaml`,
      `- name: '${escapeYamlSingleQuoted(normalizedEmail)}'`,
      `  run: echo "Hello, world!"`,
      `\`\`\``,
      ``,
      `After it runs, submit the repo URL, not the YAML.`,
    ].join('\n'),
  };
}
