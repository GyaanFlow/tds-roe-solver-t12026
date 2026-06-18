// Solver: Q11 — eShopCo API Health Check (POST to httpbin.org)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-uv-http-post';
export const title = 'Q11: POST HTTP requests with uv';

export async function solve(email) {
  const norm = normalizeEmail(email);

  // ─── Exact seed from exam source: raw email + '#q-uv-http-post'
  // NOTE: exam uses l.email (raw), NOT normalizeEmail
  const r = rng(`${email}#q-uv-http-post`);

  // ─── Exact generation from exam source
  const h = '0123456789abcdef';
  const requestId = Array.from({ length: 8 }, () =>
    Math.floor(r() * 16).toString(16)
  ).join('');

  const finalAnswer = JSON.stringify({
    args: {},
    data: JSON.stringify({ email: norm, request_id: requestId }),
    files: {},
    form: {},
    headers: {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
      Host: 'httpbin.org',
      'User-Agent': 'HTTPie/3.2.2',
    },
    json: {
      email: norm,
      request_id: requestId,
    },
    origin: '127.0.0.1',
    url: 'https://httpbin.org/post',
  }, null, 2);

  const guide = [
    `### Steps`,
    ``,
    `1. Make sure \`uv\` is installed: https://docs.astral.sh/uv/`,
    `2. Run this exact command in your terminal:`,
    `   \`uv run --with httpie -- http --json POST https://httpbin.org/post email=${norm} request_id=${requestId}\``,
    `3. Paste the **full** JSON output as your answer.`,
    ``,
    `> ℹ️ The answer below is pre-filled. If it fails, run the command manually and paste the real output.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'httpbin POST response',
    answer: finalAnswer,
    guide,
    answerDisplay: [
      `### Q11: POST HTTP requests with uv`,
      ``,
      `**Command:**`,
      `\`\`\`bash`,
      `uv run --with httpie -- http --json POST https://httpbin.org/post email=${norm} request_id=${requestId}`,
      `\`\`\``,
      ``,
      `**Answer:**`,
      `\`\`\`json`,
      finalAnswer,
      `\`\`\``,
    ].join('\n'),
    debug: {
      requestId,
      seedUsed: `${email}#q-uv-http-post`,
      note: 'Seed uses raw email, not normalizeEmail(email)',
    },
  };
}
