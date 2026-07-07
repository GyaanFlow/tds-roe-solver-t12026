import { normalizeEmail } from './utils.js';

export const id = 'q-korean-audio-dataset-server';
export const title = 'Q6: Korean Audio Dataset API Verification';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/answer-audio`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Korean Audio stats parser for ${norm}`,
    answerDisplay: [
      `### Q6: Korean Audio Dataset API Endpoint`,
      `Submit the following endpoint URL to the grader:`,
      `\`\`\`text`,
      answer,
      `\`\`\``,
      `*Grader will POST audio data directly to this URL.*`
    ].join('\n')
  };
}
