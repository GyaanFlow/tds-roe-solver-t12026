import { normalizeEmail } from './utils.js';

export const id = 'q-config-precedence-server';
export const title = 'Q3: 12-Factor Config Precedence';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q3/effective-config`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Config precedence endpoint for ${norm}`,
    answerDisplay: [
      `### Q3: Config Precedence Endpoint`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: \`${answer}?set=...\`*`
    ].join('\n')
  };
}
