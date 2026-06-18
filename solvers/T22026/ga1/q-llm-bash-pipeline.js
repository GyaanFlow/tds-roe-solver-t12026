// Solver: Q4 — LLM bash pipeline (Simon Willison's llm tool)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-llm-bash-pipeline';
export const title = 'Q4: LLM Bash Pipeline';

const tasks = [
  "fetch weather data from wttr.in for London and extract just the temperature in Celsius",
  "list all JavaScript files in the current directory and summarize their purpose in one line each",
  "read a JSON file and convert it to a markdown table",
  "analyze git commit messages from the last 10 commits and suggest areas for improvement",
  "fetch the top Hacker News story title and generate 3 alternative headlines",
  "find all TODO comments in Python files in the current directory and prioritize them by urgency",
  "get the latest Bitcoin price from a crypto API and explain if it's a good time to buy",
  "read a CSV file and generate a brief statistical summary with insights",
  "fetch a random Wikipedia article summary and rewrite it for a 10-year-old audience",
  "list all environment variables and identify which ones might contain sensitive information"
];

const taskCommands = {
  "fetch weather data from wttr.in for London and extract just the temperature in Celsius":
    'curl -s wttr.in/London | llm "extract just the temperature in Celsius"',
  "list all JavaScript files in the current directory and summarize their purpose in one line each":
    'ls *.js | llm "summarize their purpose in one line each"',
  "read a JSON file and convert it to a markdown table":
    'cat data.json | llm "convert this JSON to a markdown table"',
  "analyze git commit messages from the last 10 commits and suggest areas for improvement":
    'git log -n 10 --oneline | llm "analyze these commit messages and suggest areas for improvement"',
  "fetch the top Hacker News story title and generate 3 alternative headlines":
    'curl -s https://news.ycombinator.com/ | llm "extract the top Hacker News story title and generate 3 alternative headlines"',
  "find all TODO comments in Python files in the current directory and prioritize them by urgency":
    'find . -name "*.py" | xargs grep "TODO" | llm "prioritize these TODO comments by urgency"',
  "get the latest Bitcoin price from a crypto API and explain if it\'s a good time to buy":
    'curl -s https://api.coindesk.com/v1/bpi/currentprice.json | llm "extract latest Bitcoin price and explain if it\'s a good time to buy"',
  "read a CSV file and generate a brief statistical summary with insights":
    'cat data.csv | llm "generate a brief statistical summary with insights from this CSV"',
  "fetch a random Wikipedia article summary and rewrite it for a 10-year-old audience":
    'curl -s https://en.wikipedia.org/api/rest_v1/page/random/summary | llm "rewrite this Wikipedia summary for a 10-year-old audience"',
  "list all environment variables and identify which ones might contain sensitive information":
    'env | llm "identify which of these environment variables might contain sensitive info"'
};

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-llm-bash`;
  const r = rng(seed);
  const task = tasks[Math.floor(r() * tasks.length)];
  const command = taskCommands[task] || `echo "input" | llm "${task}"`;

  const guide = [
    `### Steps`,
    ``,
    `1. Make sure Simon Willison's \`llm\` tool is installed: \`pip install llm\`.`,
    `2. Configure your API Pipe token: \`llm keys set openai\`, then paste your token from https://aipipe.org/.`,
    `3. The target task for this email is: **${task}**.`,
    `4. Copy the generated command below and paste it in the answer field.`,
  ].join('\n');

  return {
    type: 'solved',
    answer: command,
    guide,
    variant: `Task: ${task}`,
    answerDisplay: [
      `### Q4: LLM Bash Pipeline`,
      `**Task:** *${task}*`,
      `**Generated Command:**`,
      `\`\`\`bash`,
      command,
      `\`\`\``
    ].join('\n'),
    debug: {
      task,
      command
    }
  };
}
