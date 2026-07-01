import { normalizeEmail } from './utils.js';

export const id = 'q-oauth-jwks-verify-server';
export const title = 'Q2: OAuth JWT Verification Service';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q2/verify`;

  return {
    type: 'solved',
    answer: answer,
    variant: `JWT verification endpoint for ${norm}`,
    answerDisplay: [
      `### Q2: JWT Verification Endpoint`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query POST /verify with tokens.*`
    ].join('\n')
  };
}
