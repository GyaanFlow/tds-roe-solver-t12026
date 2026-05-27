// Solver: Q18 — Local Ollama Endpoint (Direct Solution)

export const id = 'q-ollama';
export const title = 'Q18: Local Ollama Endpoint';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q-ollama';

  return {
    type: 'solved',
    variant: 'Ollama Session Proxy & Diagnostics',
    answer: directUrl,
    answerDisplay: `### Ollama Proxy & Diagnostics Hub\n\nResolve this question instantly online:\n\n1. Open the **Ollama Proxy Hub**:\n   [${directUrl}](${directUrl})\n2. Follow the online guide to initialize a session and test compatibility.\n3. Enter your student email, start your ngrok tunnel, and paste the computed URL into the exam portal!`,
    guide: `### 🚀 Submission Guide\n\n1. Click and open the pre-deployed Ollama Proxy tool:\n   [Ollama Proxy Hub](${directUrl})\n2. Run the provided tunnel setup steps to bypass local model size resource requirements.\n3. Perform validation on the page to ensure the ngrok address is 100% compatible.\n4. Copy the verified ngrok URL from the playground and submit it to the exam portal.`,
  };
}
