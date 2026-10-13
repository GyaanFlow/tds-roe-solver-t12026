import { apiAnswer, ga1Url } from './api-client.js';

export const id = 'q-mcp-server-live-server';
export const title = 'Q14: Build a Live MCP Server';

export async function solve(email) {
  const url = ga1Url(email, '/mcp');
  return apiAnswer({
    title,
    url,
    variant: 'Live MCP endpoint',
    notes: 'The server exposes exactly one tool, `solve_challenge`. On every call it reads that call\'s fresh `X-Exam-Challenge` header and returns the first 16 lowercase hex characters of `SHA-256("{challenge}:{your email}")`. Nothing is precomputed, because the grader makes five calls with five different challenges and any single failure scores zero.',
    debug: { question: 'Q14', route: '/mcp' },
  });
}
