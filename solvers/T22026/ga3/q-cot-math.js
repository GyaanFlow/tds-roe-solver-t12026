import { normalizeEmail } from './utils.js';

export const id = 'q-cot-math-verifier-server';
export const title = 'Q9: Reliable Reasoning — Word-Problem Solver API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const baseUrl = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/q9`;

  return {
    type: 'solved',
    answer: baseUrl,
    variant: `CoT Word Problem Solver API for ${norm}`,
    answerDisplay: [
      `### Q9: Reliable Reasoning Solver API`,
      `Submit this base URL to the grader:`,
      `\`\`\`text`,
      baseUrl,
      `\`\`\``,
      `The grader will call \`POST ${baseUrl}/solve\``,
      ``,
      `**Request format:**`,
      `\`\`\`json`,
      JSON.stringify({ problem_id: 'p0', problem: 'Solve X + Y...' }, null, 2),
      `\`\`\``,
      `**Response format:**`,
      `\`\`\`json`,
      JSON.stringify({ problem_id: 'p0', answer: 42, reasoning: 'Step-by-step...' }, null, 2),
      `\`\`\``,
    ].join('\n'),
    guide: [
      `## Q9: Chain-of-Thought Word Solver — Implementation Guide`,
      ``,
      `Deploy an API that solves math word problems with chain-of-thought reasoning.`,
      ``,
      `### API spec`,
      `- **Endpoint:** POST /solve`,
      `- **Request:** { "problem_id": "...", "problem": "..." }`,
      `- **Response:** { "problem_id": "...", "answer": <integer>, "reasoning": "..." }`,
      `- **CORS:** Must be enabled`,
      ``,
      `### Implementation`,
      `1. Use GPT-4o or similar high-capability model for math precision`,
      `2. Ensure reasoning is at least 80 characters`,
      `3. Coerce the final answer to a clean integer`,
      `4. Return problem_id unchanged`,
      `5. Deploy publicly`,
      ``,
      `### Pre-deployed API`,
      `Use the URL above. The grader sends hidden math problems.`,
    ].join('\n')
  };
}
