import { normalizeEmail } from './utils.js';

export const id = 'q-deploy-analytics-platform-server';
export const title = 'Q5: POST Analytics Endpoint';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q5/analytics`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Analytics platform endpoint for ${norm}`,
    answerDisplay: [
      `### Q5: Analytics Platform Endpoint`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: POST \`${answer}\` with X-API-Key header*`
    ].join('\n')
  };
}
