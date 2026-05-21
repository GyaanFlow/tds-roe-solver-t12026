const fs = require('fs');
const content = fs.readFileSync('exam.js', 'utf-8');

const ids = [
  'q-axis-scale-manipulation-repair',
  'q-binary-eval-rubric',
  'q-bug-hunter-property-based-testing',
  'q-calculate-variance',
  'q-code-interpreter-ai-analysis',
  'q-colorencoding-server',
  'q-crawl-html',
  'q-css-selectors-sum',
  'q-dbt-operations-dashboard',
  'q-fastapi',
  'q-fastapi-sentiment-batch',
  'q-get-llm-to-say-yes',
  'q-github-action',
  'q-image-grayscale-rebuild',
  'q-llm-sentiment-analysis',
  'q-move-rename-files',
  'q-network-game-detective',
  'q-ollama',
  'q-replace-across-files',
  'q-sort-filter-json',
  'q-sql-average-salary',
  'q-unicode-data',
  'q-use-devtools',
  'q-use-github',
  'q-vercel-latency'
];

let output = '';
for (const id of ids) {
  const lines = content.split('\n');
  const matchingLineIndex = lines.findIndex(l => l.includes(id));
  if (matchingLineIndex !== -1) {
    const start = Math.max(0, matchingLineIndex - 2);
    const end = Math.min(lines.length, matchingLineIndex + 10);
    output += `\n--- ${id} ---\n` + lines.slice(start, end).join('\n') + '\n';
  } else {
    output += `\n--- ${id} --- NOT FOUND\n`;
  }
}

fs.writeFileSync('exam-analysis.txt', output);
