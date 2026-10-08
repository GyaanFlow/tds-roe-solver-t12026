import { makeGuideResult } from './utils.js';

export const id = 'q-mcp-server-live-server';
export const title = 'Q14: Build a Live MCP Server';

export async function solve() {
  return {
    ...makeGuideResult(
      'API implementation intentionally deferred to the separate T3 API project.',
      '### API project handoff\n\nThis question requires a public HTTPS MCP endpoint with exactly one `solve_challenge` tool. For each tool call, read `X-Exam-Challenge` from the HTTP request headers and return the first 16 lowercase hex characters of `SHA-256(challenge + ":" + normalizedEmail)` in one MCP text block. The grader makes five calls with fresh challenges.\n\nPer your project split, the server implementation is deferred. When it is ready, connect its endpoint through the T3 GA1 solver and keep the challenge-per-call behavior; a value computed during solver initialization will not pass later calls.',
      'API handoff | implementation pending',
    ),
    debug: { integrationStatus: 'pending-separate-api-project' },
  };
}
