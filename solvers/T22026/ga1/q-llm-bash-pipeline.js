// Solver: Q3 — LLM bash pipeline (Simon Willison's llm tool)
import { normalizeEmail } from './utils.js';

export const id = 'q-llm-bash-pipeline';
export const title = 'Q3: LLM Bash Pipeline';

export async function solve(email) {
  const norm = normalizeEmail(email);

  const guide = [
    `### About`,
    ``,
    `This question asks you to write a bash pipeline using [Simon Willison's **llm** tool](https://llm.datasette.io/)`,
    `to accomplish a specific task shown in the exam.`,
    ``,
    `### Setup`,
    ``,
    `\`\`\`bash`,
    `# Install llm`,
    `pip install llm`,
    `# Or use uvx (no install):`,
    `uvx llm --version`,
    ``,
    `# Configure your AI Pipe token as the OpenAI key:`,
    `llm keys set openai`,
    `# Paste your AIPipe token from https://aipipe.org/`,
    `\`\`\``,
    ``,
    `### Common llm pipeline patterns`,
    ``,
    `\`\`\`bash`,
    `# Prompt with input from a file:`,
    `cat input.txt | llm "Your task here"`,
    ``,
    `# Prompt with a system prompt:`,
    `echo "some input" | llm -s "System prompt here" "User prompt"`,
    ``,
    `# Chain with other Unix tools:`,
    `curl -s https://example.com | llm "summarize this" | tee output.txt`,
    `\`\`\``,
    ``,
    `### How to answer`,
    ``,
    `1. Read the specific task shown in your exam question carefully.`,
    `2. Write a bash pipeline that uses \`llm\` to accomplish it.`,
    `3. Your command will be verified by GPT-5 Nano — make it unambiguous.`,
    `4. The pipeline must be a single bash command (can use pipes \`|\`).`,
    ``,
    `> **Note**: The task description is personalized per student. Read your exam for the exact task.`,
  ].join('\n');

  return {
    type: 'guide',
    answer: 'echo "Your input" | llm "Your task description here"',
    guide,
    answerDisplay: [
      `### Q3: LLM Bash Pipeline`,
      ``,
      `Write a bash pipeline using \`llm\` (Simon Willison's tool) to accomplish the task shown in your exam.`,
      ``,
      `**Basic pattern:**`,
      `\`\`\`bash`,
      `echo "input" | llm "task description"`,
      `# or`,
      `cat file.txt | llm "task description"`,
      `\`\`\``,
      ``,
      `Read the **Implementation Guide** for setup instructions and common patterns.`,
    ].join('\n'),
  };
}
