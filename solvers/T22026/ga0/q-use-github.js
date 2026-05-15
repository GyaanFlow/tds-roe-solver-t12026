// Solver: Q24 — Use GitHub (Direct Solution)
import { normalizeEmail } from './utils.js';

export const id = 'q-use-github';
export const title = 'Q24: Use GitHub';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const jsonContent = JSON.stringify({ email: norm }, null, 2);

  return {
    type: 'solved',
    variant: 'GitHub JSON Payload',
    answer: jsonContent,
    answerDisplay: `### Instructions\n\n1. Create a public GitHub repository.\n2. Create a file named \`email.json\` with the JSON content shown below.\n3. Commit and push the file.\n4. Click **'Raw'** on the file in GitHub and paste that URL into the exam portal.`,
  };
}
