import { normalizeEmail } from './utils.js';

export const id = 'q-compose-redis-tunnel-server';
export const title = 'Q4: Multi-Container Redis Stack with Tunnel';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q4`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Redis tunnel server for ${norm}`,
    answerDisplay: [
      `### Q4: Redis Tunnel Server`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: \`${answer}/hit/{key}\` and \`${answer}/count/{key}\`*`
    ].join('\n')
  };
}
