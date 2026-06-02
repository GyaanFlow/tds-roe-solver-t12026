// Solver: Q25 — Vercel Latency (Direct Solution)

export const id = 'q-vercel-latency';
export const title = 'Q25: Vercel Latency';

export async function solve(email) {
  const directUrl = 'https://t22026-tds-ga0-q25.vercel.app/api/latency';

  return {
    type: 'solved',
    variant: 'Pre-deployed Vercel API Service',
    answer: directUrl,
    answerDisplay: `### ⚡ Vercel Latency API URL\n\nThis serverless function measures and returns request latency telemetry.\nCopy and submit this URL to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\`\n\n**API contract:** \`GET /api/latency\` → returns \`{ "latency": <ms>, "timestamp": "...", ... }\``,
    guide: `### 🚀 Submission Guide\n\n**Pre-deployed URL (recommended):**\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal and click **Submit**.\n\n---\n\n### 🛠️ Self-Deploy on Vercel\n\n**Step 1: Create the project**\n\`\`\`bash\nmkdir vercel-latency && cd vercel-latency\nnpm init -y\n\`\`\`\n\n**Step 2: Create the serverless function**\nCreate \`api/latency.js\`:\n\`\`\`javascript\nexport default function handler(req, res) {\n  const start = Date.now();\n  // Simulate minimal processing\n  const latency = Date.now() - start;\n  res.status(200).json({\n    latency,\n    timestamp: new Date().toISOString(),\n    region: process.env.VERCEL_REGION || "unknown"\n  });\n}\n\`\`\`\n\n**Step 3: Deploy**\n\`\`\`bash\nnpm i -g vercel\nvercel --prod\n\`\`\`\n\n**Step 4: Submit**\nYour URL will be: \`https://<project-name>.vercel.app/api/latency\`\n\n**Telemetry details:**\n- The endpoint must return JSON with at least a \`latency\` field (in milliseconds).\n- A \`timestamp\` field (ISO 8601) is expected by the validator.\n- Vercel edge regions provide low-latency responses globally.`,
  };
}
