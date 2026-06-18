// Solver: Q10 — eShopCo API Health Check (POST to httpbin.org)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-httpbin-post';
export const title = 'Q10: eShopCo API Health Check (httpbin POST)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-httpbin-post`);

  // Generate a deterministic request_id (matches exam seed pattern)
  const requestId = Array.from({ length: 8 }, () =>
    Math.floor(r() * 16).toString(16)
  ).join('');

  const command = `uv run --with httpie -- http --json POST https://httpbin.org/post email=${norm} request_id=${requestId}`;

  const guide = [
    `### Steps`,
    ``,
    `1. Open your terminal.`,
    `2. Run the command from the answer box:`,
    ``,
    `\`\`\`bash`,
    command,
    `\`\`\``,
    ``,
    `3. The server echoes back a JSON response. Look for the \`json\` field in the output:`,
    ``,
    `\`\`\`json`,
    `{`,
    `  "json": {`,
    `    "email": "${norm}",`,
    `    "request_id": "${requestId}"`,
    `  },`,
    `  ...`,
    `}`,
    `\`\`\``,
    ``,
    `4. Submit the **full JSON response** from the terminal output.`,
    ``,
    `### Alternative: curl`,
    ``,
    `\`\`\`bash`,
    `curl -s -X POST https://httpbin.org/post \\`,
    `  -H "Content-Type: application/json" \\`,
    `  -d '{"email": "${norm}", "request_id": "${requestId}"}'`,
    `\`\`\``,
    ``,
    `### What to submit`,
    `The exam likely asks you to confirm the output was correct. Check the \`json\` field in the response`,
    `has your email and the request_id that matches what the exam shows.`,
    ``,
    `> **Note**: The \`request_id\` in your exam may differ from the estimate above. Use the value shown in the exam.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'POST command with your email and request_id',
    answer: command,
    guide,
    answerDisplay: [
      `### Q10: httpbin Health Check`,
      ``,
      `Run this command in your terminal:`,
      ``,
      `\`\`\`bash`,
      command,
      `\`\`\``,
      ``,
      `- **Email:** \`${norm}\``,
      `- **request_id:** \`${requestId}\``,
      ``,
      `Submit the JSON response from the terminal. Read the **Implementation Guide** for alternatives.`,
    ].join('\n'),
  };
}
