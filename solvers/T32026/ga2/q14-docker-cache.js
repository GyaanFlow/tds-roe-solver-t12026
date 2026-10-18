import { fnv1a, markdownCodeBlock, normalizeEmail } from './utils.js';

export const id = 'q-docker-build-cache-server';
export const title = 'Q14: Diagnose Docker Build Cache Misses';

export function computeDockerCosts(email) {
  const norm = normalizeEmail(email);
  const t = fnv1a(norm);
  return {
    install: 40 + (t % 31),
    compile: 10 + (t % 11),
    test: 15 + (t % 16)
  };
}

export function computeDockerAnswer(email) {
  const { install, compile, test } = computeDockerCosts(email);
  return {
    A: {
      steps: ['L3', 'L4', 'L5'],
      seconds: compile + test
    },
    B: {
      steps: ['L1', 'L2', 'L3', 'L4', 'L5'],
      seconds: install + compile + test
    },
    C: {
      steps: [],
      seconds: 0
    },
    D: {
      steps: [],
      seconds: 0
    },
    E: {
      steps: ['L4', 'L5'],
      seconds: compile + test
    }
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const costs = computeDockerCosts(norm);
  const answerObj = computeDockerAnswer(norm);
  const jsonContent = JSON.stringify(answerObj, null, 2);

  const guide = `### 🎯 Quick Summary
This question requires serving a JSON response predicting Docker layer cache invalidation steps and execution times across scenarios A through E.
Your individual costs derived from \`${norm}\` are:
- **L2 (install):** ${costs.install}s
- **L4 (compile):** ${costs.compile}s
- **L5 (test):** ${costs.test}s

The exact computed solution is:
\`\`\`json
${jsonContent}
\`\`\`

---

### 🧠 Logic Explanation for Each Scenario:
- **A (src/app.py changed):** Invalidation starts at **L3** (\`COPY src/ ./src/\`), so L3, L4, L5 run again. Total seconds = compile (${costs.compile}) + test (${costs.test}) = **${costs.compile + costs.test}s**.
- **B (requirements.txt changed):** Invalidation starts at **L1** (\`COPY requirements.txt ./\`), so L1, L2, L3, L4, L5 run again. Total seconds = install (${costs.install}) + compile (${costs.compile}) + test (${costs.test}) = **${costs.install + costs.compile + costs.test}s**.
- **C (Only mtime changed via touch):** Docker COPY checks file content checksums, not modification times! All layers remain cached. Steps = \`[]\`, seconds = **0**.
- **D (README.md changed):** README.md is in \`.dockerignore\`! The build context is unchanged. All layers remain cached. Steps = \`[]\`, seconds = **0**.
- **E (Only L4 command changed):** Cache is valid up to L3. Invalidation starts at **L4**, so L4 and L5 run again. Total seconds = compile (${costs.compile}) + test (${costs.test}) = **${costs.compile + costs.test}s**.

---

### 🧒 Child-Friendly Step-by-Step Instructions:

#### Option 1: Quick GitHub Gist (Easiest & Fastest — 2 minutes)
1. Go to [gist.github.com](https://gist.github.com/).
2. Create a new gist:
   - **Filename:** \`docker.json\`
   - **File contents:** Copy and paste the exact JSON above:
     \`\`\`json
     ${jsonContent}
     \`\`\`
3. Click **Create public gist**.
4. Click the **"Raw"** button at the top right of the file.
5. Copy the raw URL from your browser address bar (it looks like \`https://gist.githubusercontent.com/.../raw/.../docker.json\`).
6. Paste that raw URL into the exam answer box and click **Check**!

---

#### Option 2: Deploy on Render / Vercel / Cloudflare Worker / Python HTTP Server
Serve the exact JSON above with \`Content-Type: application/json\` on any public endpoint (e.g. \`GET /docker.json\`).`;

  return {
    type: 'solved',
    answer: JSON.stringify(answerObj),
    variant: `Docker layer cache calculation for ${norm}`,
    guide,
    answerDisplay: [
      `### ${title}`,
      '',
      '**Computed Docker Layer Solution (Host this at a public URL):**',
      '',
      markdownCodeBlock(jsonContent, 'json'),
      '',
      '*Follow the 2-minute GitHub Gist instructions in the Implementation Guide below to get your public submission URL.*'
    ].join('\n'),
    debug: { question: 'Q14', costs, answerObj }
  };
}
