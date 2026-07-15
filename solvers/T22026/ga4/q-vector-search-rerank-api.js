import { normalizeEmail } from './utils.js';

export const id = 'q-vector-search-rerank-api-server';
export const title = 'Q4: Production Vector Search API with Re-ranking';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga4/${encodeURIComponent(norm)}`;
  const url = `${base}/vector-search`;

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
      `The grader POSTs \`{"query_id","query_vector","documents","embeddings","reranker_scores","filter","top_k","rerank_top_n"}\``,
      `and expects \`{"matches": [...]}\` back.`,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50s).`
    ].join('\n')
  };
}
