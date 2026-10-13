import { solvePrettierHash } from './generators.js';
import { makeGuideResult } from './utils.js';

export const id = 'q-npx-prettier';
export const title = 'Q4: Run Prettier with npx';

export async function solve(email) {
  const result = await solvePrettierHash(email);
  if (result.hash) {
    const guide = `### Personalized SHA-256\n\nThe exam bundle generates a personalized README.md, formats it with Prettier 3.4.2 using the Markdown parser, then hashes the formatted bytes.\n\n**Submit:** ${result.hash}\n\nGenerated input size: ${result.sourceBytes} bytes.`;
    return { type: 'solved', answer: result.hash, variant: 'Prettier 3.4.2 Markdown SHA-256', guide, answerDisplay: `### Answer\n\n${result.hash}` };
  }
  return makeGuideResult(
    'Run the pinned command in the implementation guide to obtain the personalized hash.',
    `### Prettier dependency unavailable\n\n${result.error}\n\nThe official grader uses npx -y prettier@3.4.2 README.md | sha256sum. Keep the generated README bytes unchanged and submit the first hash field.`,
    'External formatter unavailable',
  );
}
