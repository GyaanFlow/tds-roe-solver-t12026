// Solver: Q17 — Network Game: Graph Detective (Direct Solution)

export const id = 'q-network-game-detective';
export const title = 'Q17: Network Game: Graph Detective';

export async function solve(email) {
  const directUrl = 'https://tds-games-solver.vercel.app/detective/';

  return {
    type: 'solved',
    variant: 'Interactive Graph Game Solver',
    answer: directUrl,
    answerDisplay: `### 🕵️ Network Game: Graph Detective Solver\n\nResolve this question instantly online:\n\n1. Open the **Network Game Solver**:\n   [${directUrl}](${directUrl})\n2. The solver automatically traverses the graph and finds the detective path.\n3. Copy the resulting **JWT token** and paste it into the exam portal!\n\n**How it works:** Uses BFS/shortest-path to trace the optimal route through the network graph.`,
    guide: `### 🚀 Submission Guide\n\n**Using the pre-deployed solver (recommended):**\n1. Open the solver: [Network Game Solver](${directUrl})\n2. Enter your game URL or input parameters.\n3. The solver traces the correct path and generates your validation JWT token.\n4. Copy the JWT token and paste it into the exam portal.\n\n---\n\n### 🎮 Game Strategy Tips\n\n**Understanding the game:**\n- You are given a network graph with nodes and edges.\n- Your goal is to find a specific path (the "detective route") through the graph.\n- The game validates your path and returns a JWT token on success.\n\n**Solving strategies:**\n- **BFS (Breadth-First Search):** Best for finding the shortest path between two nodes.\n- **DFS (Depth-First Search):** Useful for exploring all possible paths.\n- **Adjacency list:** Parse the graph data into an adjacency list for efficient traversal.\n\n**Common pitfalls:**\n- Visiting a node twice may invalidate your path.\n- The graph may be directed — pay attention to edge direction.\n- JWT tokens are time-sensitive; submit promptly after generation.`,
  };
}
