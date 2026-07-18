import { normalizeEmail } from './utils.js';

export const id = 'q-spec-driven-correction-server';
export const title = 'Q2: Spec-Driven Development: The Proration Bug';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga5/${encodeURIComponent(norm)}`;
  const url = `${base}/proration`;

  return {
    type: 'solved',
    answer: url,
    variant: `Proration endpoint for ${norm}`,
    answerDisplay: [
      `### Q2: Spec-Driven Development — The Proration Bug`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      `No AIPipe token needed — pure deterministic policy.`,
      `The grader POSTs \`{"old_price","new_price","days_remaining","days_in_actual_month","spec":"v1"|"v2"}\``,
      `and expects \`{"charge"}\` back.`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50 s).`
    ].join('\n')
  };
}
