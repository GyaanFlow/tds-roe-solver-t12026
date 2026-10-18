import { ga2Url, T3_GA2_HEALTH_URL } from './api-client.js';
import { markdownCodeBlock, normalizeEmail } from './utils.js';

export const id = 'q-ollama-tunnel-llm-server';
export const title = 'Q9: Expose a Local LLM through a Tunnel';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const endpointUrl = ga2Url(norm, '/q7/v1/chat/completions');
  const payload = {
    url: endpointUrl,
    model: 'llama3.2'
  };
  const jsonAnswer = JSON.stringify(payload);

  const guide = `### 🎯 Quick Summary
This question requires submitting a JSON payload pointing to an OpenAI-compatible \`/v1/chat/completions\` endpoint.
The grader performs:
1. **Echo test:** sends a random token (e.g. \`TK<6-hex>\`) and expects it in the response.
2. **Arithmetic reasoning test:** asks "What is A + B?" and checks for the correct numerical sum.

---

### 📋 Recommended Answer (Copy & Paste this JSON):
\`\`\`json
${jsonAnswer}
\`\`\`

---

### 🧒 Child-Friendly Step-by-Step Instructions:

#### Option A: Use Our Hosted Gateway (Instant & Automatic)
1. **Wake up the backend**: Open [${T3_GA2_HEALTH_URL}](${T3_GA2_HEALTH_URL}) in a new browser tab until it replies \`{"status": "ok"}\`.
2. **Copy the JSON** from the box above:
   \`\`\`json
   ${jsonAnswer}
   \`\`\`
3. **Paste into the Q9 answer box** on the exam portal and click **Check**!

---

#### Option B: Run Your Own Ollama Tunnel (Manual Method)
If you prefer running a local model on your machine:
1. Start Ollama with open CORS:
   \`\`\`bash
   OLLAMA_ORIGINS="*" ollama serve
   \`\`\`
2. In another terminal, pull a lightweight model:
   \`\`\`bash
   ollama run llama3.2
   \`\`\`
3. Expose port 11434 with Cloudflare tunnel:
   \`\`\`bash
   cloudflared tunnel --url http://localhost:11434
   \`\`\`
4. Copy the \`https://<your-subdomain>.trycloudflare.com\` URL and format your answer as:
   \`\`\`json
   {
     "url": "https://<your-subdomain>.trycloudflare.com/v1/chat/completions",
     "model": "llama3.2"
   }
   \`\`\``;

  return {
    type: 'solved',
    answer: jsonAnswer,
    variant: `OpenAI completions endpoint config for ${norm}`,
    guide,
    answerDisplay: [
      `### ${title}`,
      '',
      '**Copy and paste this JSON into the answer field:**',
      '',
      markdownCodeBlock(jsonAnswer, 'json'),
      '',
      '*See the Implementation Guide below if you prefer running your own local Ollama tunnel.*'
    ].join('\n'),
    usesHostedApi: true,
    debug: { question: 'Q9', endpointUrl, model: 'mock-model' }
  };
}
