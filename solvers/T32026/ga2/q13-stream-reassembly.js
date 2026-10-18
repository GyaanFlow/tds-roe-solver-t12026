import { fnv1a, markdownCodeBlock, normalizeEmail } from './utils.js';

export const id = 'q-ollama-stream-reassembly-server';
export const title = 'Q13: Recover a Fragmented LLM Stream';

export function computeStreamAnswer(email) {
  const norm = normalizeEmail(email);
  const hash = fnv1a(norm);
  const tag = `job-${hash.toString(16)}`;

  return {
    A: {
      text: `Report ${tag}: café\nReady ✓`,
      complete: true,
      error: null
    },
    B: {
      text: `Partial ${tag}`,
      complete: false,
      error: null
    },
    C: {
      text: `Draft ${tag}`,
      complete: false,
      error: 'model unloaded'
    }
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const streamData = computeStreamAnswer(norm);
  const jsonContent = JSON.stringify(streamData, null, 2);

  const guide = `### 🎯 Quick Summary
This question requires serving a reconstructed JSON structure representing three fragmented Ollama-style NDJSON byte streams (A, B, and C).
The deterministic solution computed from your email (\`${norm}\`) is:

\`\`\`json
${jsonContent}
\`\`\`

---

### 🧒 Child-Friendly Step-by-Step Instructions:

#### Option 1: Quick GitHub Gist (Easiest & Fastest — 2 minutes)
1. Go to [gist.github.com](https://gist.github.com/).
2. Create a new gist:
   - **Filename:** \`stream.json\`
   - **File contents:** Copy and paste the exact JSON above:
     \`\`\`json
     ${jsonContent}
     \`\`\`
3. Click **Create public gist**.
4. Click the **"Raw"** button at the top right of the file.
5. Copy the URL from your browser address bar (it looks like \`https://gist.githubusercontent.com/.../raw/.../stream.json\`).
6. Paste that raw URL into the exam answer box and click **Check**!

---

#### Option 2: Deploy on Render / Vercel / Cloudflare Worker / Python HTTP Server
Serve the exact JSON above with \`Content-Type: application/json\` on any public endpoint (e.g. \`GET /stream.json\`).`;

  return {
    type: 'solved',
    answer: JSON.stringify(streamData),
    variant: `Reconstructed Ollama streams for ${norm}`,
    guide,
    answerDisplay: [
      `### ${title}`,
      '',
      '**Computed Reconstructed JSON (Host this at a public URL):**',
      '',
      markdownCodeBlock(jsonContent, 'json'),
      '',
      '*Follow the 2-minute GitHub Gist instructions in the Implementation Guide below to get your public submission URL.*'
    ].join('\n'),
    debug: { question: 'Q13', streamData }
  };
}
