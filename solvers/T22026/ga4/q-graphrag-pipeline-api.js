import { normalizeEmail } from './utils.js';

export const id = 'q-graphrag-pipeline-api-server';
export const title = 'Q5: GraphRAG Pipeline: Extract → Index → Query';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc  = encodeURIComponent(norm);
  const tok  = sessionToken ? encodeURIComponent(sessionToken) : '<TOKEN>';
  const base = `${HOST}/ga4/${enc}/${tok}`;
  const health = `${HOST}/ga4/${enc}/health`;

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
      `Your AIPipe token is embedded in the URL path — the server bills LLM calls to your token.`,
      `Endpoints the grader will call:`,
      `- \`POST ${base}/extract-graph\` → {"entities":[{"name","type"}], "relationships":[{"source","target","relation"}]}`,
      `- \`POST ${base}/graph-query\` → {"answer","reasoning_path":[...],"hops"}`,
      `- \`POST ${base}/community-summary\` → {"community_id","summary"}`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
