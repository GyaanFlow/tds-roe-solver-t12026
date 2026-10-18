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

export const T3_GA2_DOCKER_BACKEND = 'https://tds-solver-backend.onrender.com';

export function getDockerPublicUrl(email, origin = T3_GA2_DOCKER_BACKEND) {
  const norm = normalizeEmail(email);
  return `${origin}/s/${encodeURIComponent(norm)}/docker.json`;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const costs = computeDockerCosts(norm);
  const answerObj = computeDockerAnswer(norm);
  const jsonContent = JSON.stringify(answerObj, null, 2);
  const dynamicUrl = getDockerPublicUrl(norm);

  const guide = `### 🎯 Quick Summary
This question requires submitting a **Public URL** returning a JSON structure with Docker layer cache invalidation steps and execution times across scenarios A through E.

The exam server makes a direct HTTP \`GET\` request to your URL and validates that it returns the exact computed timing and steps within 10 seconds.

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

### 🧠 Logic Explanation for Each Scenario:
- **A (src/app.py changed):** Invalidation starts at **L3** (\`COPY src/ ./src/\`), so L3, L4, L5 run again. Total seconds = compile (${costs.compile}) + test (${costs.test}) = **${costs.compile + costs.test}s**.
- **B (requirements.txt changed):** Invalidation starts at **L1** (\`COPY requirements.txt ./\`), so L1, L2, L3, L4, L5 run again. Total seconds = install (${costs.install}) + compile (${costs.compile}) + test (${costs.test}) = **${costs.install + costs.compile + costs.test}s**.
- **C (Only mtime changed via touch):** Docker COPY checks file content checksums, not modification times! All layers remain cached. Steps = \`[]\`, seconds = **0**.
- **D (README.md changed):** README.md is in \`.dockerignore\`! The build context is unchanged. All layers remain cached. Steps = \`[]\`, seconds = **0**.
- **E (Only L4 command changed):** Cache is valid up to L3. Invalidation starts at **L4**, so L4 and L5 run again. Total seconds = compile (${costs.compile}) + test (${costs.test}) = **${costs.compile + costs.test}s**.

---

### 🛡️ Backup Option: Quick GitHub Gist (If you prefer hosting yourself — 1 minute)
1. Go to [gist.github.com](https://gist.github.com/).
2. Create a public gist named \`docker.json\` containing the JSON above.
3. Click **Create public gist** $\\rightarrow$ click **Raw**.
4. Submit that raw URL (\`https://gist.githubusercontent.com/.../raw/.../docker.json\`).`;

  return {
    type: 'solved',
    answer: dynamicUrl,
    variant: `Live Docker layer cache URL for ${norm}`,
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
    debug: { question: 'Q14', url: dynamicUrl, costs, answerObj }
  };
}
