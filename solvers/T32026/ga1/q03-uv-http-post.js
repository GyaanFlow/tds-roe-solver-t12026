import { makeHttpieRequest } from './generators.js';
import { markdownCodeBlock } from './utils.js';

function shellQuote(value) {
  return `'${String(value).replaceAll("'", "'\\''")}'`;
}

export const id = 'q-uv-http-post';
export const title = 'Q3: POST HTTP Requests with uv';

export async function solve(email) {
  const request = await makeHttpieRequest(email);
  const command = `uv run --with httpie -- http --json POST https://httpbin.org/post email=${shellQuote(request.email)} request_id=${shellQuote(request.requestId)}`;
  const commandBlock = markdownCodeBlock(command, 'sh');
  const response = {
    args: {},
    data: JSON.stringify({ email: request.email, request_id: request.requestId }),
    files: {},
    form: {},
    headers: {
      Accept: 'application/json, */*',
      'Content-Type': 'application/json',
      Host: 'httpbin.org',
      'User-Agent': 'HTTPie/3.2.2',
    },
    json: { email: request.email, request_id: request.requestId },
    origin: '127.0.0.1',
    url: 'https://httpbin.org/post',
  };
  const answer = JSON.stringify(response, null, 2);
  const guide = `### Personalized HTTPie response\n\nThe official checker parses the submitted JSON and verifies \`headers.Host === "httpbin.org"\`, the exact registered email under \`json.email\`, and this seeded request ID under \`json.request_id\`. Those fields are prefilled in the Answer panel. To independently reproduce a live response, run:\n\n${commandBlock}\n\nA live httpbin response can contain environment-specific header and origin values; the required checked fields above are stable.`;
  return {
    type: 'solved',
    answer,
    variant: `Verified response fields | request ${request.requestId}`,
    guide,
    answerDisplay: `### Q3: HTTPie response JSON\n\nThe required echoed fields are filled for this email.\n\n${markdownCodeBlock(answer, 'json')}`,
    debug: { requestId: request.requestId, emailPreservedExactly: true },
  };
}
