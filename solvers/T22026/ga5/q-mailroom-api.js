import { normalizeEmail } from './utils.js';

export const id = 'q-taint-aware-agent-executor-server';
export const title = 'Q9: Lethal-Trifecta Mailroom Action Gate';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const health = `${HOST}/ga5/${enc}/health`;

  if (!sessionToken) {
    return {
      type: 'guide',
      answer: '',
      variant: `Token required for Q9 (${norm})`,
      answerDisplay: [
        `### Q9: Lethal-Trifecta Mailroom Action Gate`,
        `⚠️ **AIPipe token is required for this question.**`,
        `Enter your aipipe.org token in the token field above and click Solve again.`,
        `The token is embedded in the URL path for per-user LLM routing.`,
        `Warm the dyno first: \`GET ${health}\` (cold start ~50 s).`
      ].join('\n')
    };
  }

  const base = `${HOST}/ga5/${enc}/${encodeURIComponent(sessionToken)}`;
  const url = `${base}/mailroom`;

  return {
    type: 'solved',
    answer: url,
    variant: `Mailroom action gate endpoint for ${norm}`,
    answerDisplay: [
      `### Q9: Lethal-Trifecta Mailroom Action Gate`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      `AIPipe token is **required** — real LLM semantic judgment, embedded in the URL path.`,
      ``,
      `💡 **Note on LLM usage & tokens:**`,
      `- LLMs can occasionally hallucinate or fail randomly. If the grader fails, try running/submitting **2 or 3 times**.`,
      `- If you are using a token saved from previous sessions in your local storage, it may have expired. If you get errors, please grab a fresh token from aipipe.org, paste it in the input field above, and click Solve again to generate a new URL.`,
      ``,
      `The grader POSTs \`{"operation":"propose"|"commit", ...}\` (two-phase durable protocol).`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`,
      ``,
      `### 🔁 Backup answer endpoints (if the above doesn't respond)`,
      `If the primary API is cold/down and retrying doesn't help, try these alternate deployments`,
      `of the same mailroom endpoint instead:`,
      `- \`https://ga5-tds.onrender.com/q9/mailroom\``,
      `- \`https://tds-ga5.onrender.com/q9/mailroom\``,
      `These are separate hosted instances — submit whichever one actually responds.`
    ].join('\n')
  };
}
