import { normalizeEmail } from './utils.js';

export const id = 'q-agent-budget-loop-guardrail-server';
export const title = 'Q5: Agent Harness — Run Budget & Loop Guard';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga5/${encodeURIComponent(norm)}`;
  const url = `${base}/budget-guard`;

  return {
    type: 'solved',
    answer: url,
    variant: `Budget/loop guard endpoint for ${norm}`,
    answerDisplay: [
      `### Q5: Agent Harness — Run Budget & Loop Guard`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      `No AIPipe token needed — pure deterministic policy.`,
      `The grader POSTs \`{"budget_tokens","steps":[{"step_number","tool","args","tokens_used"}]}\``,
      `and expects \`{"decision":"continue"|"halt","reason"}\` back.`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50 s).`
    ].join('\n')
  };
}
