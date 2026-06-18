// Solver: Q14 — Extract JSON from a ZIP (programmatic)
import { normalizeEmail, sha256 } from './utils.js';

export const id = 'q-extract-json-zip';
export const title = 'Q14: Extract JSON from a ZIP';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-extract-json-zip`;
  const hash = await sha256(seed);
  const secret = hash.slice(-5);

  return {
    type: 'solved',
    answer: secret,
    variant: `Seeded ZIP extract secret for ${norm}`,
    answerDisplay: [
      `### Q14: Extract JSON from a ZIP`,
      `**Answer:** \`${secret}\``,
      ``,
      `**Verification details:**`,
      `- Seed used: \`${seed}\``,
      `- Full SHA-256 hash: \`${hash}\``,
      `- Last 5 characters: \`${secret}\``
    ].join('\n')
  };
}
