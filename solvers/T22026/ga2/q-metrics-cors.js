import { normalizeEmail } from './utils.js';

export const id = 'q-fastapi-metrics-cors-server';
export const title = 'Q1: Descriptive Statistics with strict CORS';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q1`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Descriptive statistics server for ${norm}`,
    answerDisplay: [
      `### Q1: Descriptive Statistics Server`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: \`${answer}/stats?values=...\`*`
    ].join('\n')
  };
}
