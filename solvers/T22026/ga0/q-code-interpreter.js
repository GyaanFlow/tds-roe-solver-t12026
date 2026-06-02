// Solver: Q5 - Code Interpreter Service (Direct Solution)

export const id = 'q-code-interpreter-ai-analysis';
export const title = 'Q5: Code Interpreter Service';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q-code-interpreter-ai-analysis/code-interpreter';

  return {
    type: 'solved',
    variant: 'Pre-deployed Code Interpreter Service',
    answer: directUrl,
    answerDisplay: `### 🔗 Code Interpreter Service URL\n\nThis pre-deployed FastAPI service wraps a Gemini-based code interpreter.\nCopy and submit this URL to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\`\n\n**What it does:** Accepts a POST with a code snippet, executes it via Gemini's code execution tool, and returns the output.`,
    guide: `### 🚀 Submission Guide\n\n**Pre-deployed URL (recommended):**\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal and click **Submit**.\n\n---\n\n### 🛠️ How It Works (Self-Deploy Reference)\n\nIf you want to build your own:\n\n1. **Create a FastAPI app** with a POST endpoint (e.g. \`/execute\`).\n2. **Integrate Gemini API** with code execution enabled:\n   - Use \`google-generativeai\` Python SDK.\n   - Set \`tools=[{"code_execution": {}}]\` in your model config.\n3. **Endpoint contract:**\n   - Input: \`{ "code": "<python_code>" }\`\n   - Output: \`{ "result": "<execution_output>" }\`\n4. **Deploy** to Render, Railway, or any public host.\n5. Submit the public URL to the exam portal.\n\n**Key dependencies:** \`fastapi\`, \`uvicorn\`, \`google-generativeai\``,
  };
}
