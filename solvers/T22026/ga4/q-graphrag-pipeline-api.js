import { normalizeEmail } from './utils.js';

export const id = 'q-graphrag-pipeline-api-server';
export const title = 'Q5: GraphRAG Pipeline: Extract → Index → Query';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const base = `${HOST}/ga4/${encodeURIComponent(norm)}`;

  return {
    type: 'solved',
    answer: base,
    variant: `GraphRAG base URL for ${norm}`,
    answerDisplay: [
      `### Q5: GraphRAG Pipeline`,
      `Submit this base URL as your answer (grader appends the sub-paths):`,
      `\`\`\``,
      base,
      `\`\`\``,
      `Endpoints the grader will call:`,
      `- \`POST ${base}/extract-graph\``,
      `- \`POST ${base}/graph-query\``,
      `- \`POST ${base}/community-summary\``,
      `Warm the dyno before submitting: \`GET ${base}/health\` (cold start ~50s).`
    ].join('\n')
  };
}
