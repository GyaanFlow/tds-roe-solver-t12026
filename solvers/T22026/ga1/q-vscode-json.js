// Solver: Q1 — VS Code Info (code -s output to JSON)
import { normalizeEmail } from './utils.js';

export const id = 'q-vscode-json';
export const title = 'Q1: VS Code Output → JSON';

export async function solve(email) {
  const norm = normalizeEmail(email);

  const guide = [
    `### Steps`,
    ``,
    `1. Open a terminal (or Command Prompt).`,
    `2. Run: \`code -s\``,
    `3. Copy the entire output.`,
    `4. Each line is \`key=value\`. Convert them ALL to a single JSON object:`,
    `   \`{ "key1": "value1", "key2": "value2", ... }\``,
    `5. Paste the JSON into the exam answer box.`,
    ``,
    `### Multi-cursor trick (VS Code)`,
    ``,
    `1. Paste the output into a new VS Code file.`,
    `2. Select all lines → **Add cursor at end of each line**.`,
    `3. Wrap each line: add \`"\` before and after the key and value.`,
    `4. Replace \`=\` with \`": "\`, add commas, wrap in \`{}\`.`,
    ``,
    `### Example`,
    ``,
    `\`\`\``,
    `# code -s output:`,
    `Version:          1.89.0`,
    `Commit:           abc1234`,
    ``,
    `# Becomes:`,
    `{"Version": "1.89.0", "Commit": "abc1234"}`,
    `\`\`\``,
    ``,
    `> **Note**: Your answer is personal — it depends on your installed VS Code version.`,
    `> This solver provides the guide; you must run \`code -s\` yourself.`,
  ].join('\n');

  return {
    type: 'guide',
    answer: 'Run `code -s` in your terminal, then convert the output to JSON.',
    guide,
    answerDisplay: [
      `### Q1: VS Code Info → JSON`,
      ``,
      `This question requires you to run \`code -s\` on your machine and convert the output.`,
      ``,
      `**Steps:**`,
      `1. Open a terminal and run: \`code -s\``,
      `2. Copy the entire output.`,
      `3. Convert each \`key=value\` line to a JSON object: \`{"key": "value", ...}\``,
      `4. Submit the JSON to the exam portal.`,
      ``,
      `Read the **Implementation Guide** for detailed instructions and the multi-cursor trick.`,
    ].join('\n'),
  };
}
