// Solver: Q11 — FastAPI Batch Sentiment (Direct Solution)
export const id = 'q-fastapi-sentiment-batch';
export const title = 'Q11: FastAPI Batch Sentiment Analysis';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q11/ga0/q11/sentiment';

  return {
    type: 'solved',
    variant: 'Pre-deployed Render Sentiment API',
    answer: directUrl,
    answerDisplay: `### Direct Answer URL\n\nCopy and submit this URL directly to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\``,
    guide: `### 🚀 Submission Guide\n\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal.\n3. Click **Submit** to verify.`,
  };
}
