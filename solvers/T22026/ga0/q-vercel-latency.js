// Solver: Q25 — Vercel Latency (Direct Solution)

export const id = 'q-vercel-latency';
export const title = 'Q25: Vercel Latency';

export async function solve(email) {
  const directUrl = 'https://t22026-tds-ga0-q25.vercel.app/api/latency';

  return {
    type: 'solved',
    variant: 'Pre-deployed Vercel API Service',
    answer: directUrl,
    answerDisplay: `### Direct Answer URL\n\nCopy and submit this URL directly to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\``,
    guide: `### 🚀 Submission Guide\n\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal.\n3. Click **Submit** to verify.`,
  };
}
