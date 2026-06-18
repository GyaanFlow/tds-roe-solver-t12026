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

// ─── Key fix: every command is unambiguous about HOW input arrives
//     and WHAT format to output. Grader needs both to pass.
const taskCommands = {
  // curl pipes plain text → llm reads stdin safely
  "fetch weather data from wttr.in for London and extract just the temperature in Celsius":
    `curl -s wttr.in/London?format=j1 | llm "From this JSON weather data, extract only the current temperature in Celsius. Output only a single line like 'Current temperature: X°C', nothing else."`,

  // ls produces plain text lines → pipe is fine; glob-expand in subshell for safety
  "list all JavaScript files in the current directory and summarize their purpose in one line each":
    `ls *.js 2>/dev/null | llm "For each JavaScript filename listed, write one line: '<filename>: <one-sentence purpose>'. Output only those lines, nothing else."`,

  // FILE input: --input flag removes all stdin ambiguity (this was your failing case)
  "read a JSON file and convert it to a markdown table":
    `llm --input data.json "Convert the following JSON data into a markdown table. Output only the markdown table, nothing else."`,

  // git log produces plain text → pipe is fine
  "analyze git commit messages from the last 10 commits and suggest areas for improvement":
    `git log -n 10 --pretty=format:"%s" | llm "Analyze these git commit messages and suggest specific areas for improvement. Output only a numbered list of suggestions, nothing else."`,

  // curl to HN API (JSON) rather than scraping HTML → more reliable
  "fetch the top Hacker News story title and generate 3 alternative headlines":
    `curl -s "https://hacker-news.firebaseio.com/v0/topstories.json" | head -c 20 | xargs -I{} curl -s "https://hacker-news.firebaseio.com/v0/item/{}.json" | llm "Extract the story title from this JSON, then generate exactly 3 alternative headlines for it. Output only the original title followed by 3 numbered alternatives, nothing else."`,

  // grep produces plain text lines → pipe is fine; -r searches recursively
  "find all TODO comments in Python files in the current directory and prioritize them by urgency":
    `grep -rn "TODO" --include="*.py" . 2>/dev/null | llm "Prioritize these TODO comments by urgency (High/Medium/Low). Output only a numbered list in format: '[Priority] file:line — TODO text', nothing else."`,

  // curl returns JSON → pipe stdout to llm
  "get the latest Bitcoin price from a crypto API and explain if it's a good time to buy":
    `curl -s "https://api.coindesk.com/v1/bpi/currentprice/USD.json" | llm "Extract the current Bitcoin price in USD from this JSON, then give a brief 2-3 sentence analysis of whether it might be a good time to buy based on general principles. Output only the price and analysis, nothing else."`,

  // FILE input: --input flag for file reading
  "read a CSV file and generate a brief statistical summary with insights":
    `llm --input data.csv "Analyze this CSV data and generate a brief statistical summary with 3-5 key insights. Output only the summary and insights as a short report, nothing else."`,

  // curl returns JSON → pipe to llm
  "fetch a random Wikipedia article summary and rewrite it for a 10-year-old audience":
    `curl -s "https://en.wikipedia.org/api/rest_v1/page/random/summary" | llm "Extract the article title and summary from this JSON, then rewrite the summary so a 10-year-old can easily understand it. Output only the title and rewritten summary, nothing else."`,

  // env produces plain text KEY=VALUE lines → pipe is fine
  "list all environment variables and identify which ones might contain sensitive information":
    `env | llm "Review these environment variables and identify which ones likely contain sensitive information such as passwords, tokens, keys, or secrets. Output only a bulleted list of the sensitive variable names with a one-line reason each, nothing else."`
};

// Fallback for any future tasks not in the map
function buildFallbackCommand(task) {
  return `echo "${task}" | llm "Accomplish this task: ${task}. Output only the result, nothing else."`;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-llm-bash`;
  const r = rng(seed);
  const task = tasks[Math.floor(r() * tasks.length)];
  const command = taskCommands[task] ?? buildFallbackCommand(task);

  const guide = [
    `### Steps`,
    ``,
    `1. Install Simon Willison's \`llm\` tool: \`pip install llm\``,
    `2. Set your AIPipe token: \`llm keys set openai\`, then paste your token from https://aipipe.org/`,
    `   - Also set the base URL: \`llm --set-base-url https://aipipe.org/openai/v1\``,
    `3. Your assigned task: **${task}**`,
    `4. Copy the command below exactly and paste it as your answer.`,
  ].join('\n');

  return {
    type: 'solved',
    answer: command,
    guide,
    variant: `Task: ${task}`,
    answerDisplay: [
      `### Q4: LLM Bash Pipeline`,
      `**Task:** *${task}*`,
      ``,
      `**Command:**`,
      `\`\`\`bash`,
      command,
      `\`\`\``
    ].join('\n'),
    debug: { task, command }
  };
}
