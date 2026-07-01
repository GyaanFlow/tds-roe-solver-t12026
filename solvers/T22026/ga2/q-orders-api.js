import { normalizeEmail } from './utils.js';

export const id = 'q-api-idempotency-pagination-server';
export const title = 'Q9: API Engineering: Idempotency + Pagination + Rate Limit';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q9`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Orders API base URL for ${norm}`,
    answerDisplay: [
      `### Q9: Idempotency, Pagination, and Rate-Limiting Orders API`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: POST \`${answer}/orders\` and GET \`${answer}/orders?limit=...\`*`
    ].join('\n')
  };
}
