import { normalizeEmail } from './utils.js';

export const id = 'q-vector-search-rerank-api-server';
export const title = 'Q4: Production Vector Search API with Re-ranking';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  // Q4 uses no LLM → no token in path
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga4/${encodeURIComponent(norm)}`;
  const url  = `${base}/vector-search`;

  return {
    type: 'solved',
    answer: url,
    variant: `Vector search endpoint for ${norm}`,
    answerDisplay: [
      `### Q4: Production Vector Search API with Re-ranking`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      `The grader POSTs only \`{"query_id","query_vector":[100 floats],"top_k","rerank_top_n","filter"}\``,
      `and expects \`{"matches": [doc_id, ...]}\` back.`,
      `No AIPipe token needed for Q4 — no LLM is involved.`,
      `Filter ops supported: exact, {"gte"}, {"lte"}, {"in":[...]}.`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50 s).`
    ].join('\n')
  };
}
