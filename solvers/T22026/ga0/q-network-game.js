// Solver: Q17 — Network Game: Graph Detective (Direct Solution)
import { fnv1a, normalizeEmail } from './utils.js';

export const id = 'q-network-game-detective';
export const title = 'Q17: Network Game: Graph Detective';

export async function solve(email) {
  const url = "https://tds-network-games.sanand.workers.dev/detective/";
  const solverUrl = "https://tds-games-solver.vercel.app/detective/";

  return {
    type: 'guide',
    variant: 'Interactive Graph Game',
    answer: `SOLVER URL: ${solverUrl}\nGAME URL: ${url}\n\n1. Use the solver URL to get the answer.\n2. Paste the resulting JWT token into the exam portal.`,
    answerDisplay: `### Strategy\n\n1. Use the [Graph Detective Solver](${solverUrl}) to automatically solve the game.\n2. Alternatively, play the [Graph Detective Game](${url}) manually.\n3. Paste the resulting **JWT token** into the exam portal.`,
  };
}
