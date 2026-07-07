import { normalizeEmail } from './utils.js';

export const id = 'q-structured-extraction-server';
export const title = 'Q7: Invoice Intelligence — Structured Extraction API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Invoice Intelligence API for ${norm}`,
    answerDisplay: [
      `### Q7: Invoice Intelligence API URL`,
      `Submit the following endpoint URL to the grader:`,
      `\`\`\`text`,
      answer,
      `\`\`\``,
      `*Grader will query: \`POST ${answer}/extract\`*`
    ].join('\n')
  };
}
