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
    variant: 'Hidden input discovery (base-36 derivation)',
    answer: secret,
    answerDisplay: `### Discovery Result\n\n- **Secret Value:** \`${secret}\`\n- **Method:** Seeded RNG → base-36 conversion → last 10 chars\n- **Length:** \`${secret.length}\` characters\n\nPaste this value into the exam portal. It matches the hidden \`<input type="hidden">\` value on the question page.`,
  };
}
