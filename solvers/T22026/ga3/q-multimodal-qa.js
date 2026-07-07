import { normalizeEmail } from './utils.js';

export const id = 'q-multimodal-image-qa-server';
export const title = 'Q2: Multimodal Image Question-Answering API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Multimodal QA API for ${norm}`,
    answerDisplay: [
      `### Q2: Multimodal Image QA API URL`,
      `Submit the following endpoint URL to the grader:`,
      `\`\`\`text`,
      answer,
      `\`\`\``,
      `*Grader will query: \`POST ${answer}/answer-image\`*`
    ].join('\n')
  };
}
