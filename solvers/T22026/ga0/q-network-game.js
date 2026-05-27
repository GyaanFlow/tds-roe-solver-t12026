// Solver: Q17 — Network Game: Graph Detective (Direct Solution)

export const id = 'q-network-game-detective';
export const title = 'Q17: Network Game: Graph Detective';

export async function solve(email) {
  const directUrl = 'https://tds-games-solver.vercel.app/detective/';

  return {
    type: 'solved',
    variant: 'Interactive Graph Game Solver',
    answer: directUrl,
    answerDisplay: `### Network Game Solver\n\nResolve this question instantly online:\n\n1. Open the **Network Game Solver**:\n   [${directUrl}](${directUrl})\n2. Use the solver to automatically solve the game and trace the detective path.\n3. Copy the resulting **JWT token** and paste it into the exam portal!`,
    guide: `### 🚀 Submission Guide\n\n1. Click and open the pre-deployed Network Game Solver:\n   [Network Game Solver](${directUrl})\n2. Enter your game URL or input parameters to calculate the optimal detective route.\n3. The solver will trace the correct nodes instantly and generate your validation JWT token.\n4. Copy the JWT token and paste it into the exam portal.`,
  };
}
