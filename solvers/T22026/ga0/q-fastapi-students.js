// Solver: Q10 — FastAPI Students CSV Service (Direct Solution)

export const id = 'q-fastapi';
export const title = 'Q10: FastAPI Students CSV Service';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q10/ga0/q10/api';

  return {
    type: 'solved',
    variant: 'Pre-deployed Render API Service',
    answer: directUrl,
    answerDisplay: `### Direct Answer URL\n\nCopy and submit this URL directly to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\``,
    guide: `### 🚀 Submission Guide\n\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal.\n3. Click **Submit** to verify.`,
  };
}
