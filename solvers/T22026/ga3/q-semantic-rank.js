import { normalizeEmail } from './utils.js';

export const id = 'q-semantic-rank-server';
export const title = 'Q8: Semantic Search — Top-K Ranking API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const baseUrl = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/q8`;

  return {
    type: 'solved',
    answer: baseUrl,
    variant: `Semantic Ranking API for ${norm}`,
    answerDisplay: [
      `### Q8: Semantic Search Ranking API`,
      `Submit this base URL to the grader:`,
      `\`\`\`text`,
      baseUrl,
      `\`\`\``,
      `The grader will call \`POST ${baseUrl}/rank\``,
      ``,
      `**Request format:**`,
      `\`\`\`json`,
      JSON.stringify({
        query: 'vector integration',
        candidates: ['candidate text A', 'candidate text B', 'candidate text C']
      }, null, 2),
      `\`\`\``,
      `**Response format:**`,
      `\`\`\`json`,
      JSON.stringify({ ranking: [1, 0, 2] }, null, 2),
      `\`\`\``,
    ].join('\n'),
    guide: [
      `## Q8: Semantic Search Ranking — Implementation Guide`,
      ``,
      `Deploy an API that ranks candidate texts by semantic similarity to a query.`,
      ``,
      `### API spec`,
      `- **Endpoint:** POST /rank`,
      `- **Request:** { "query": "...", "candidates": ["...", "..."] }`,
      `- **Response:** { "ranking": [indices in descending order of similarity] }`,
      `- **CORS:** Must be enabled`,
      ``,
      `### Implementation`,
      `1. Use text-embedding-3-small (or similar) to embed the query and candidates`,
      `2. Compute cosine similarity between query and each candidate`,
      `3. Sort candidates by similarity descending`,
      `4. Return the indices in rank order`,
      `5. Deploy publicly`,
      ``,
      `### Pre-deployed API`,
      `Use the URL above. The grader sends hidden (query, candidates) pairs.`,
    ].join('\n')
  };
}
