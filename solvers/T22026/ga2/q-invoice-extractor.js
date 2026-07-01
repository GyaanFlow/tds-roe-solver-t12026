import { normalizeEmail } from './utils.js';

export const id = 'q-local-llm-structured-server';
export const title = 'Q8: Local LLM Structured-Output Service';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const answer = `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q8/extract`;

  return {
    type: 'solved',
    answer: answer,
    variant: `Structured extraction endpoint for ${norm}`,
    answerDisplay: [
      `### Q8: Structured Invoice Extraction Endpoint`,
      `**URL:** \`${answer}\``,
      ``,
      `*Grader will query: POST \`${answer}\` with text*`
    ].join('\n')
  };
}
