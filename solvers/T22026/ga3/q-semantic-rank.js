import { normalizeEmail } from './utils.js';

export const id = 'q-semantic-rank-server';
export const title = 'Q8: Semantic Search — Top-K Ranking API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Semantic Search Ranking API for ${norm}`,
    answerDisplay: [
      `### Q8: Semantic Search — Top-K Ranking API URL`,
      `Submit the following endpoint URL to the grader:`,
      `\`\`\`text`,
      answer,
      `\`\`\``,
      `*Grader will query: \`POST ${answer}/rank\`*`
    ].join('\n')
  };
}
