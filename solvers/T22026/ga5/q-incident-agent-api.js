import { normalizeEmail } from './utils.js';

export const id = 'q-agent-trace-integrity-server';
export const title = 'Q11: Build an Observable Incident-Response Agent';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const tok = sessionToken ? encodeURIComponent(sessionToken) : '<TOKEN>';
  const base = `${HOST}/ga5/${enc}/${tok}`;
  const health = `${HOST}/ga5/${enc}/health`;

  return {
    type: 'solved',
    answer: base,
    variant: `Incident-response agent base URL for ${norm}`,
    answerDisplay: [
      `### Q11: Build an Observable Incident-Response Agent`,
      `Submit this base URL as your answer (grader appends the sub-paths):`,
      `\`\`\``,
      base,
      `\`\`\``,
      `AIPipe token is **required** — embedded in the URL path.`,
      `Endpoints the grader will call:`,
      `- \`POST ${base}/v2/incidents\``,
      `- \`POST ${base}/v2/incidents/{runId}/receipts\``,
      `- \`GET ${base}/v2/incidents/{runId}\``,
      `Durable diagnose → approve → effect agent with an OTLP trace.`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
