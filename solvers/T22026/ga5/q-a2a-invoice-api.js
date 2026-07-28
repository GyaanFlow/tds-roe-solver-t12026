import { normalizeEmail } from './utils.js';

export const id = 'q-a2a-durable-delegate-server';
export const title = 'Q10: A2A Invoice Action Agent';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const health = `${HOST}/ga5/${enc}/health`;
  const dashboard = `${HOST}/ga5/`;

  if (!sessionToken) {
    return {
      type: 'guide',
      answer: '',
      variant: `Token required for Q10 (${norm})`,
      answerDisplay: [
        `### Q10: A2A Invoice Action Agent`,
        `⚠️ **AIPipe token is required for this question.**`,
        `Enter your aipipe.org token in the token field above and click Solve again.`,
        `The token is embedded in the base URL path for per-user LLM routing.`,
        `Warm the dyno first: \`GET ${health}\` (cold start ~50 s).`
      ].join('\n')
    };
  }

  const base = `${HOST}/ga5/${enc}/${encodeURIComponent(sessionToken)}/a2a/`;

  return {
    type: 'solved',
    answer: base,
    variant: `A2A invoice agent base URL for ${norm}`,
    answerDisplay: [
      `### Q10: A2A Invoice Action Agent`,
      `Submit this base URL as your answer:`,
      `\`\`\``,
      base,
      `\`\`\``,
      `⚠️ **Before submitting**: open [${dashboard}](${dashboard}), enter your email + token, and click`,
      `**Generate URLs** at least once. This registers your base URL in the shared Agent Card`,
      `(\`/.well-known/agent-card.json\`), which the A2A spec requires.`,
      ``,
      `AIPipe token is **required** — embedded in the URL path.`,
      ``,
      `💡 **Note on LLM usage & tokens:**`,
      `- LLMs can occasionally hallucinate or fail randomly. If the grader fails, try running/submitting **2 or 3 times**.`,
      `- If you are using a token saved from previous sessions in your local storage, it may have expired. If you get errors, please grab a fresh token from aipipe.org, paste it in the input field above, and click Solve again to generate a new URL.`,
      ``,
      `A2A 1.0 protocol at \`${base}message:send\`, \`${base}tasks/{id}\`, \`${base}tasks\`, \`${base}tasks/{id}:cancel\`.`,
      `Requires \`Authorization: Bearer <TOKEN>\` and \`A2A-Version: 1.0\` headers on every call.`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`,
      ``,
      `### 🔁 Backup answer endpoints (if the above doesn't respond)`,
      `If the primary API is cold/down and retrying doesn't help, try these alternate deployments`,
      `of the same A2A agent instead:`,
      `- \`https://ga5-tds.onrender.com/a2a\``,
      `- \`https://tds-ga5.onrender.com/a2a\``,
      `These are separate hosted instances — submit whichever one actually responds.`
    ].join('\n')
  };
}
