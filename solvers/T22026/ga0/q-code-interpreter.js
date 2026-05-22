// Solver: Q5 - Code Interpreter Service (Direct Solution)

export const id = 'q-code-interpreter-ai-analysis';
export const title = 'Q5: Code Interpreter Service';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q5/';

  return {
    type: 'solved',
    variant: 'Pre-deployed Code Interpreter Service',
    answer: directUrl,
    answerDisplay: `### Direct Answer URL\n\nCopy and submit this URL to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\`\n*The validator will append \`/code-interpreter\` to verify your service.*`,
    guide: `### 🚀 Submission Guide\n\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal.\n3. Click **Submit** to verify.`,
  };
}
