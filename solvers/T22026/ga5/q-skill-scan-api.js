import { normalizeEmail } from './utils.js';

export const id = 'q-skill-safety-audit-server';
export const title = 'Q4: Skill Safety Audit — Scanner API';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const health = `${HOST}/ga5/${enc}/health`;

  // Q4's canonical route is token-less (regex heuristic). A token is an
  // optional enhancement (LLM pass) — never fabricate a fake <TOKEN> segment
  // when none is set, since that would submit a broken URL.
  const hasToken = Boolean(sessionToken);
  const url = hasToken
    ? `${HOST}/ga5/${enc}/${encodeURIComponent(sessionToken)}/skill-scan`
    : `${HOST}/ga5/${enc}/skill-scan`;

  return {
    type: 'solved',
    answer: url,
    variant: `Skill scan endpoint for ${norm}`,
    answerDisplay: [
      `### Q4: Skill Safety Audit — Scanner API`,
      `Submit this URL as your answer:`,
      `\`\`\``,
      url,
      `\`\`\``,
      hasToken
        ? `AIPipe token is embedded — uses the more accurate LLM pass.`
        : `No AIPipe token set — this uses the regex heuristic (works, just less accurate).` +
          ` Set a token in the workspace to switch to \`/ga5/${enc}/<TOKEN>/skill-scan\` for the LLM pass.`,
      ``,
      `💡 **Note on LLM usage & tokens:**`,
      `- LLMs can occasionally hallucinate or fail randomly. If the grader fails, try running/submitting **2 or 3 times**.`,
      `- If you are using a token saved from previous sessions in your local storage, it may have expired. If you get errors, please grab a fresh token from aipipe.org, paste it in the input field above, and click Solve again to generate a new URL.`,
      ``,
      `The grader POSTs \`{"skill": "<markdown text>"}\``,
      `and expects \`{"categories": [...]}\` back`,
      `(subset of \`hardcoded_secret\`, \`prompt_injection\`, \`excessive_permissions\`, \`unclear_provenance\`).`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
