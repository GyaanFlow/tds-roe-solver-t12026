import { normalizeEmail } from './utils.js';

export const id = 'q-middleware-ratelimit-cors-server';
export const title = 'Q10: Middleware Stack (Rate-Limit, CORS & Context)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q10`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Middleware stack server for ${norm}`,
    answerDisplay: [
      `### Q10: Middleware Stack Server`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: GET \`${answer}/ping\`*`
    ].join('\n')
  };
}
