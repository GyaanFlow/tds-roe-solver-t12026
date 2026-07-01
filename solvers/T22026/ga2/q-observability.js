import { normalizeEmail } from './utils.js';

export const id = 'q-observability-metrics-server';
export const title = 'Q6: Production Observability (Metrics & Logs)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q6`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Observability server for ${norm}`,
    answerDisplay: [
      `### Q6: Observability Server`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: \`${answer}/metrics\`, \`${answer}/work\`, \`${answer}/healthz\`, and \`${answer}/logs/tail\`*`
    ].join('\n')
  };
}
