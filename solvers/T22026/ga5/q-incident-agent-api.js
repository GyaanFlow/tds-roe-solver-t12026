import { normalizeEmail } from './utils.js';

export const id = 'q-agent-trace-integrity-server';
export const title = 'Q11: Build an Observable Incident-Response Agent';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const health = `${HOST}/ga5/${enc}/health`;

  if (!sessionToken) {
    return {
      type: 'guide',
      answer: '',
      variant: `Token required for Q11 (${norm})`,
      answerDisplay: [
        `### Q11: Build an Observable Incident-Response Agent`,
        `⚠️ **AIPipe token is required for this question.**`,
        `Enter your aipipe.org token in the token field above and click Solve again.`,
        `The token is embedded in the base URL path for per-user LLM routing.`,
        `Warm the dyno first: \`GET ${health}\` (cold start ~50 s).`
      ].join('\n')
    };
  }

  const base = `${HOST}/ga5/${enc}/${encodeURIComponent(sessionToken)}`;

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
      ``,
      `💡 **Note on LLM usage & tokens:**`,
      `- LLMs can occasionally hallucinate or fail randomly. If the grader fails, try running/submitting **2 or3 times**.`,
      `- If you are using a token saved from previous sessions in your local storage, it may have expired. If you get errors, please grab a fresh token from aipipe.org, paste it in the input field above, and click Solve again to generate a new URL.`,
      ``,
      `Endpoints the grader will call:`,
      `- \`POST ${base}/v2/incidents\``,
      `- \`POST ${base}/v2/incidents/{runId}/receipts\``,
      `- \`GET ${base}/v2/incidents/{runId}\``,
      `Durable diagnose → approve → effect agent with an OTLP trace.`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
