// Solver: Q23 — Use DevTools (Direct Solution)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-use-devtools';
export const title = 'Q23: Use DevTools';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#q-use-devtools`);
  const secret = n().toString(36).slice(-10);

  return {
    type: 'solved',
    variant: 'Hidden input discovery',
    answer: secret,
    answerDisplay: `### Discovery Result\n\nThe secret value hidden in the page input is: **\`${secret}\`**`,
  };
}
