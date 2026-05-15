// Solver: Q13 — GitHub Action (Direct Solution)
import { fnv1a, normalizeEmail } from './utils.js';

export const id = 'q-github-action';
export const title = 'Q13: GitHub Action Workflow';

export async function solve(email) {
  const yaml = `
name: Validate and Deploy
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install pytest httpx
      - name: Run tests
        run: pytest
      - name: Notify success
        if: success()
        run: echo "Tests passed for ${email}"
`.trim();

  return {
    type: 'solved',
    variant: 'Python CI Workflow',
    answer: yaml,
    guide: `### 🚀 Implementation Guide

1. **Setup Repository**:
   - In your GitHub repository, create a directory structure: \`.github/workflows/\`.
2. **Create Workflow**:
   - Create a file named \`main.yml\` (or any name ending in \`.yml\`) inside that folder.
   - Copy the YAML code from the **Answer** box and paste it into this file.
3. **Trigger**:
   - Commit and push your changes to the \`main\` branch.
   - Go to the **Actions** tab in your GitHub repository to see the workflow running.
4. **Submit**:
   - Once the action finishes, copy the URL of the repository or the specific run and submit it to the exam portal.`,
    answerDisplay: `### Quick Steps\n\n1. Create \`.github/workflows/main.yml\`.\n2. Paste YAML and push.\n3. Submit repo URL.`,
  };
}
