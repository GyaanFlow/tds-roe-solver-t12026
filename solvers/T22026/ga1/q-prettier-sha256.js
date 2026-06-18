// Solver: Q2 — Prettier SHA256 hash of README.md
import { normalizeEmail } from './utils.js';

export const id = 'q-prettier-sha256';
export const title = 'Q2: Prettier SHA256 of README.md';

export async function solve(email) {
  const norm = normalizeEmail(email);

  const guide = [
    `### Steps`,
    ``,
    `1. Download the \`README.md\` file from the exam portal.`,
    `2. Place it in a directory and make sure it is named exactly **\`README.md\`**.`,
    `3. Open a terminal in that directory and run:`,
    ``,
    `\`\`\`bash`,
    `npx -y prettier@3.4.2 README.md | sha256sum`,
    `\`\`\``,
    ``,
    `4. Copy the hash (the first 64 hex characters) and submit it.`,
    ``,
    `### Windows note`,
    ``,
    `On Windows (PowerShell), use:`,
    ``,
    `\`\`\`powershell`,
    `npx -y prettier@3.4.2 README.md | sha256sum`,
    `# Or if sha256sum is not available:`,
    `(npx -y prettier@3.4.2 README.md) | Get-FileHash -Algorithm SHA256 | Select-Object -ExpandProperty Hash`,
    `\`\`\``,
    ``,
    `Or use Git Bash / WSL for the \`sha256sum\` command.`,
    ``,
    `### Why?`,
    `Prettier re-formats the Markdown file. The SHA256 hash is of the formatted output, `,
    `not the original file. Two students with the same \`README.md\` file get the same hash.`,
    ``,
    `> **Note**: This answer is file-specific. Download your exam file and run the command above.`,
  ].join('\n');

  return {
    type: 'guide',
    answer: 'npx -y prettier@3.4.2 README.md | sha256sum',
    guide,
    answerDisplay: [
      `### Q2: Prettier SHA256 of README.md`,
      ``,
      `1. Download your \`README.md\` from the exam portal.`,
      `2. In that directory, run:`,
      ``,
      `\`\`\`bash`,
      `npx -y prettier@3.4.2 README.md | sha256sum`,
      `\`\`\``,
      ``,
      `3. Submit the 64-char hex hash.`,
      ``,
      `Read the **Implementation Guide** for Windows-specific instructions.`,
    ].join('\n'),
  };
}
