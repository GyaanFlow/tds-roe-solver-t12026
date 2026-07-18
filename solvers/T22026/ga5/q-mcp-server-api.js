import { normalizeEmail } from './utils.js';

export const id = 'q-mcp-server-live-server';
export const title = 'Q6: Build a Live MCP Server';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga5/${encodeURIComponent(norm)}`;
  const url = `${base}/mcp`;

  return {
    type: 'solved',
    answer: url,
    variant: `MCP endpoint for ${norm}`,
    answerDisplay: [
      `### Q6: Build a Live MCP Server`,
      `Submit this URL as your answer (must be https://):`,
      `\`\`\``,
      url,
      `\`\`\``,
      `No AIPipe token needed — pure deterministic policy.`,
      `The grader POSTs JSON-RPC 2.0 (\`initialize\`, \`tools/list\`, \`tools/call\`).`,
      `On \`tools/call\`, it reads the \`X-Exam-Challenge\` header and expects`,
      `\`sha256(challenge:email)\` truncated to 16 hex chars back.`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50 s).`
    ].join('\n')
  };
}
