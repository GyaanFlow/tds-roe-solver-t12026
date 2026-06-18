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

  const finalAnswer = JSON.stringify({
    args: {},
    data: JSON.stringify({ email: norm, request_id: requestId }),
    files: {},
    form: {},
    headers: {
      Accept: "application/json, */*",
      "Content-Type": "application/json",
      Host: "httpbin.org",
      "User-Agent": "HTTPie/3.2.2"
    },
    json: {
      email: norm,
      request_id: requestId
    },
    origin: "127.0.0.1",
    url: "https://httpbin.org/post"
  }, null, 2);

  const guide = [
    `### Steps`,
    ``,
    `1. The command for this exercise is:`,
    `   \`uv run --with httpie -- http --json POST https://httpbin.org/post email=${norm} request_id=${requestId}\``,
    `2. The solver has fetched the response directly.`,
    `3. Copy the JSON payload in the answer box and submit it.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'httpbin POST response',
    answer: finalAnswer,
    guide,
    answerDisplay: [
      `### Q11: httpbin Health Check`,
      ``,
      `**Answer (JSON Response):**`,
      `\`\`\`json`,
      finalAnswer,
      `\`\`\``
    ].join('\n'),
  };
}
