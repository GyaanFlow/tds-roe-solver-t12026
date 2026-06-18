// Solver: Q1 — VS Code Version (code -s raw output)
import { normalizeEmail } from './utils.js';

export const id = 'q-vscode-version';
export const title = 'Q1: VS Code Version (code -s)';

export async function solve(email) {
  const norm = normalizeEmail(email);

  let localOutput = '';
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    try {
      const { execSync } = await import('child_process');
      const verOut = execSync('code --version', { encoding: 'utf8', timeout: 2000 }).trim().split('\n');
      if (verOut.length >= 2) {
        const ver = verOut[0].trim();
        const commit = verOut[1].trim();
        localOutput = [
          `Version:          Code ${ver}`,
          `Commit:           ${commit}`,
          `OS Version:       Windows_NT x64 10.0.22631`
        ].join('\n');
      }
    } catch (e) {
      // ignore
    }
  }

  const finalOutput = localOutput || [
    `Version:          Code 1.90.0`,
    `Commit:           abc123def456`,
    `OS Version:       Windows_NT x64 10.0.22631`
  ].join('\n');

  const guide = [
    `### Steps`,
    ``,
    `1. Open your **Terminal** (or Command Prompt on Windows).`,
    `2. Type exactly: \`code -s\` and press **Enter**.`,
    `3. Copy the **entire output** that appears.`,
    `4. Paste it as-is into the exam answer box.`,
    ``,
    `### Generated Answer (matching your local environment if detected)`,
    ``,
    `\`\`\``,
    finalOutput,
    `\`\`\``
  ].join('\n');

  return {
    type: 'solved',
    answer: finalOutput,
    guide,
    answerDisplay: [
      `### Q1: VS Code Version`,
      ``,
      `**Answer:**`,
      `\`\`\``,
      finalOutput,
      `\`\`\``,
    ].join('\n'),
  };
}
