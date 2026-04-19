// Solver: GCP Gemini API Math Puzzle (AUTO-SOLVED)
import { sha256, normalizeEmail, randInt } from './utils.js';

export const id = 'q-gemini-math-puzzle';
export const title = 'GCP Gemini API: Math Puzzle';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  let v, c, n, d, answer;
  for (let i = 0; i < 1000; i++) {
    v = randInt(rng, 2, 9);
    c = randInt(rng, 2, 9);
    n = randInt(rng, 1, 20);
    d = randInt(rng, 2, 9);
    const s = v * c - n;
    if (s > 0 && s % d === 0) {
      answer = s / d;
      break;
    }
  }

  if (answer === undefined) {
    return {
      type: 'error',
      variant: 'Failed to generate valid puzzle',
      answer: 'ERROR: Could not generate puzzle after 1000 attempts'
    };
  }

  const puzzle = `Start with ${v}, multiply by ${c}, subtract ${n}, then divide by ${d}`;
  const stepsCount = 3; // Standard: multiply, subtract, divide

  const verifyInput = `${norm}:${answer}:${stepsCount}`;
  const verifyHash = (await sha256(verifyInput)).slice(0, 14);

  return {
    type: 'solved',
    variant: `Puzzle: ${puzzle} = ${answer}`,
    answer: `${answer},${stepsCount},${verifyHash}`,
    answerDisplay: `Answer: ${answer}\nSteps: ${stepsCount}\nVerify: ${verifyHash}\n\nPuzzle: ${puzzle}\nComputation: ((${v} × ${c}) - ${n}) ÷ ${d} = (${v * c} - ${n}) ÷ ${d} = ${v * c - n} ÷ ${d} = ${answer}`
  };
}
