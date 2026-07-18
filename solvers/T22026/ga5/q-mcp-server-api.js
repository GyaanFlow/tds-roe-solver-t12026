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
      `No AIPipe token needed — real MCP protocol (JSON-RPC 2.0), no LLM.`,
      `Handles \`initialize\`, \`notifications/initialized\` (202, no body), \`tools/list\``,
      `(one tool: \`solve_challenge\`), and \`tools/call\`.`,
      `On \`tools/call\`, it reads the \`X-Exam-Challenge\` HTTP header (not the JSON body)`,
      `and returns:`,
      '```json',
      `{"content":[{"type":"text","text":"<first 16 hex chars of SHA-256(challenge:normalizedEmail)>"}],"isError":false}`,
      '```',
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50 s).`
    ].join('\n')
  };
}
