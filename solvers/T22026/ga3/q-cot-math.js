import { normalizeEmail } from './utils.js';

export const id = 'q-cot-math-verifier-server';
export const title = 'Q9: Reliable Reasoning — Word-Problem Solver API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}`;

  return {
    type: 'solved',
    answer: answer,
    variant: `CoT Word Problem Solver API for ${norm}`,
    answerDisplay: [
      `### Q9: Reliable Reasoning Solver API URL`,
      `Submit the following endpoint URL to the grader:`,
      `\`\`\`text`,
      answer,
      `\`\`\``,
      `*Grader will query: \`POST ${answer}/solve\`*`
    ].join('\n')
  };
}
