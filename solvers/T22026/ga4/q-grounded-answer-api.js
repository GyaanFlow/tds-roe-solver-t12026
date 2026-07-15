import { normalizeEmail } from './utils.js';

export const id = 'q-grounded-answer-api-server';
export const title = 'Q3: Anti-Hallucination Grounded Answer API';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga4/${encodeURIComponent(norm)}`;
  const url = `${base}/grounded-answer`;

  return {
    type: 'solved',
    answer: url,
    variant: `Grounded QA endpoint for ${norm}`,
    answerDisplay: [
      `### Q3: Anti-Hallucination Grounded Answer API`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      `The grader POSTs \`{"question", "chunks"}\` to this endpoint and expects`,
      `\`{"answer", "citations", "confidence", "answerable"}\` back.`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50s).`
    ].join('\n')
  };
}
