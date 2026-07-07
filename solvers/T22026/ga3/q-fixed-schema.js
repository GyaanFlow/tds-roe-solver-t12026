import { normalizeEmail } from './utils.js';

export const id = 'q-invoice-extract-server';
export const title = 'Q3: Fixed Schema Invoice Extraction API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Fixed Invoice Extractor for ${norm}`,
    answerDisplay: [
      `### Q3: Fixed Schema Invoice Extraction API`,
      `Submit the following endpoint URL to the grader:`,
      `\`\`\`text`,
      answer,
      `\`\`\``,
      `*Grader will query: \`POST ${answer}/extract\`*`
    ].join('\n')
  };
}
