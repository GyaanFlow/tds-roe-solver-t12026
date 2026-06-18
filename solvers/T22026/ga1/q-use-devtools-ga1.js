// Solver: Q12 — Use DevTools (hidden input secret value)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-use-devtools';
export const title = 'Q12: Use DevTools';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-use-devtools`;
  const r = rng(seed);
  const secret = r().toString(36).slice(-10);

  return {
    type: 'solved',
    answer: secret,
    variant: `Seeded DevTools secret for ${norm}`,
    answerDisplay: [
      `### Q12: Use DevTools`,
      `**Answer:** \`${secret}\``,
      ``,
      `**Verification details:**`,
      `- Hidden input secret: \`${secret}\``,
      `- Seed used: \`${seed}\``
    ].join('\n')
  };
}
