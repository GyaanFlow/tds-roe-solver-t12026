import { normalizeEmail } from './utils.js';

export const id = 'q-ollama-tunnel-llm-server';
export const title = 'Q7: Expose a Local LLM through a Tunnel';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = {
    url: `https://tds-roe-solver-api-t12026.onrender.com/ga2/${norm}/q7/v1/chat/completions`,
    model: 'mock-model'
  };
  const answer = JSON.stringify(data);

  return {
    type: 'solved',
    answer: answer,
    variant: `LLM Completions config for ${norm}`,
    answerDisplay: [
      `### Q7: Local LLM completions config`,
      `**Answer (paste directly):**`,
      `\`\`\`json`,
      answer,
      `\`\`\``
    ].join('\n')
  };
}
