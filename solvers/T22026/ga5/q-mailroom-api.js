import { normalizeEmail } from './utils.js';

export const id = 'q-taint-aware-agent-executor-server';
export const title = 'Q9: Lethal-Trifecta Mailroom Action Gate';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const tok = sessionToken ? encodeURIComponent(sessionToken) : '<TOKEN>';
  const base = `${HOST}/ga5/${enc}/${tok}`;
  const health = `${HOST}/ga5/${enc}/health`;
  const url = `${base}/mailroom`;

  return {
    type: 'solved',
    answer: url,
    variant: `Mailroom action gate endpoint for ${norm}`,
    answerDisplay: [
      `### Q9: Lethal-Trifecta Mailroom Action Gate`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      `AIPipe token is **required** — real LLM semantic judgment, embedded in the URL path.`,
      `The grader POSTs \`{"operation":"propose"|"commit", ...}\` (two-phase durable protocol).`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
