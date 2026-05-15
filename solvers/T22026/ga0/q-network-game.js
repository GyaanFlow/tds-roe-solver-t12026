// Solver: Q17 — Network Game: Graph Detective (Direct Solution)
import { fnv1a, normalizeEmail } from './utils.js';

export const id = 'q-network-game-detective';
export const title = 'Q17: Network Game: Graph Detective';

export async function solve(email) {
  const url = "https://tds-network-games.sanand.workers.dev/detective/";

  return {
    type: 'guide',
    variant: 'Interactive Graph Game',
    answer: `GAME URL: ${url}\n\n1. Play the game and win.\n2. Paste the resulting JWT token into the exam portal.`,
    answerDisplay: `### Strategy\n\n1. Open the [Graph Detective Game](${url}).\n2. Use BFS to identify the compromised node.\n3. Win the game to get your **JWT token**.\n4. Paste that token here and in the exam portal.`,
  };
}
