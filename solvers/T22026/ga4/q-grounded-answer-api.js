import { normalizeEmail } from './utils.js';

export const id = 'q-grounded-answer-api-server';
export const title = 'Q3: Anti-Hallucination Grounded Answer API';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc  = encodeURIComponent(norm);
  const tok  = sessionToken ? encodeURIComponent(sessionToken) : '<TOKEN>';
  const llmBase = `${HOST}/ga4/${enc}/${tok}`;
  const url     = `${llmBase}/grounded-answer`;
  const health  = `${HOST}/ga4/${enc}/health`;

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
      `The grader POSTs \`{"question", "chunks":[{"chunk_id","text"}]}\` to this endpoint and expects`,
      `\`{"answer", "citations", "confidence", "answerable"}\` back.`,
      `Your AIPipe token is embedded in the URL path — the server bills LLM calls to your token.`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
