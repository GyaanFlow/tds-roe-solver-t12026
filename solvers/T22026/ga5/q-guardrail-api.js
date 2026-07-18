import { normalizeEmail } from './utils.js';

export const id = 'q-agent-tool-guardrail-server';
export const title = 'Q3: Agent Harness — Pre-Tool-Call Guardrail Hook';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga5/${encodeURIComponent(norm)}`;
  const url = `${base}/guardrail`;

  return {
    type: 'solved',
    answer: url,
    variant: `Guardrail endpoint for ${norm}`,
    answerDisplay: [
      `### Q3: Agent Harness — Pre-Tool-Call Guardrail Hook`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      `No AIPipe token needed — pure deterministic policy.`,
      `The grader POSTs \`{"tool":"bash"|"write_file"|"http_request", ...}\``,
      `and expects \`{"decision":"allow"|"block","reason"}\` back.`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50 s).`
    ].join('\n')
  };
}
