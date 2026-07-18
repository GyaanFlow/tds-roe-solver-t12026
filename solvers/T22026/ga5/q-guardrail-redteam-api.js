import { normalizeEmail } from './utils.js';

export const id = 'q-agent-guardrail-redteam-server';
export const title = 'Q8: Guardrail Red-Team Round-Trip';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga5/${encodeURIComponent(norm)}`;
  const url = `${base}/guardrail-redteam`;

  return {
    type: 'solved',
    answer: url,
    variant: `Guardrail red-team endpoint for ${norm}`,
    answerDisplay: [
      `### Q8: Guardrail Red-Team Round-Trip`,
      `Submit this URL as your answer (must be https://):`,
      `\`\`\``,
      url,
      `\`\`\``,
      `No AIPipe token needed — pure deterministic policy, real execution.`,
      `The grader POSTs \`{"tool":"read_file"|"fetch_url","arguments":{...}}\``,
      `and expects \`{"action","reason","result"}\` back (\`result\` present only when allowed).`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50 s).`
    ].join('\n')
  };
}
