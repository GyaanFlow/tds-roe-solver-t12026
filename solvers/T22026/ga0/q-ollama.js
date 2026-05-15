// Solver: Q18 — Local Ollama Endpoint (Direct Solution)
import { fnv1a, normalizeEmail } from './utils.js';

export const id = 'q-ollama';
export const title = 'Q18: Local Ollama Endpoint';

export async function solve(email) {
  const command = `ngrok http 11434 --response-header-add "X-Email: ${email}" --response-header-add 'Access-Control-Expose-Headers: *' --response-header-add 'Access-Control-Allow-Headers: Authorization,Content-Type,User-Agent,Accept,Ngrok-skip-browser-warning'`.trim();

  return {
    type: 'solved',
    variant: 'ngrok Tunnel Command',
    answer: command,
    guide: `### 🚀 Implementation Guide

1. **Start Ollama**:
   - Ensure Ollama is installed and running.
   - Run the following in your terminal to allow CORS:
     \`export OLLAMA_ORIGINS="*" && ollama serve\`
     *(On Windows, set the environment variable in System Settings or use PowerShell: \`$env:OLLAMA_ORIGINS="*"; ollama serve\`)*
2. **Setup Tunnel**:
   - Install **ngrok** if you haven't already.
   - Copy the command from the **Answer** box and run it in a new terminal window.
3. **Submit**:
   - Look for the \`.ngrok-free.app\` URL in the ngrok output.
   - Copy that URL and paste it into the exam portal.`,
    answerDisplay: `### Quick Steps\n\n1. Serve Ollama with \`OLLAMA_ORIGINS="*"\`.\n2. Run the **ngrok** command from the **Answer** box.\n3. Submit the resulting ngrok URL.`,
  };
}
