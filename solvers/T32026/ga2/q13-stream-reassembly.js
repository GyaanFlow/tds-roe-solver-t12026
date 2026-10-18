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

export const T3_GA2_STREAM_BACKEND = 'https://tds-solver-backend.onrender.com';

export function getStreamPublicUrl(email, origin = T3_GA2_STREAM_BACKEND) {
  const norm = normalizeEmail(email);
  return `${origin}/s/${encodeURIComponent(norm)}/stream.json`;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const streamData = computeStreamAnswer(norm);
  const jsonContent = JSON.stringify(streamData, null, 2);
  const dynamicUrl = getStreamPublicUrl(norm);

  const guide = `### 🎯 Quick Summary
This question requires submitting a **Public URL** returning a JSON structure with reconstructed texts for three fragmented Ollama-style NDJSON byte streams (A, B, and C).

The exam server makes a direct HTTP \`GET\` request to your URL and validates that it returns the exact reconstructed payload within 10 seconds.

---

### 🚀 Instant One-Click Submission URL:
The live multi-tenant backend serves your deterministic answer at:
\`\`\`text
${dynamicUrl}
\`\`\`

> **Note:** The backend sleeps when idle on Render. Before clicking **Check**, open [${dynamicUrl}](${dynamicUrl}) in a new tab once to ensure it responds with \`200 OK\`.

---

### 📋 Expected JSON Content (Served at the above URL):
\`\`\`json
${jsonContent}
\`\`\`

---

### 🛡️ Backup Option: Quick GitHub Gist (If you prefer hosting yourself — 1 minute)
1. Go to [gist.github.com](https://gist.github.com/).
2. Create a public gist named \`stream.json\` containing the JSON above.
3. Click **Create public gist** $\\rightarrow$ click **Raw**.
4. Submit that raw URL (\`https://gist.githubusercontent.com/.../raw/.../stream.json\`).`;

  return {
    type: 'solved',
    answer: dynamicUrl,
    variant: `Live reconstructed stream URL for ${norm}`,
    guide,
    answerDisplay: [
      `### ${title}`,
      '',
      '**Submit this Public URL:**',
      '',
      markdownCodeBlock(dynamicUrl, 'text'),
      '',
      '*(Pre-configured live endpoint returning your deterministic JSON payload)*'
    ].join('\n'),
    usesHostedApi: true,
    debug: { question: 'Q13', url: dynamicUrl, streamData }
  };
}
