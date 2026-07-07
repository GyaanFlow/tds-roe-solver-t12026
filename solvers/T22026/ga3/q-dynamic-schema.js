import { normalizeEmail } from './utils.js';

export const id = 'q-dynamic-extract-server';
export const title = 'Q4: Dynamic Schema Structured Extraction API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Dynamic Extractor for ${norm}`,
    answerDisplay: [
      `### Q4: Dynamic Schema Structured Extraction API`,
      `Submit the following endpoint URL to the grader:`,
      `\`\`\`text`,
      answer,
      `\`\`\``,
      `*Grader will query: \`POST ${answer}/dynamic-extract\`*`
    ].join('\n')
  };
}
