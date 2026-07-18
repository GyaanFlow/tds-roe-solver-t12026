import { normalizeEmail } from './utils.js';

export const id = 'q-skill-safety-audit-server';
export const title = 'Q4: Skill Safety Audit — Scanner API';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const tok = sessionToken ? encodeURIComponent(sessionToken) : '<TOKEN>';
  const base = `${HOST}/ga5/${enc}/${tok}`;
  const health = `${HOST}/ga5/${enc}/health`;
  const url = `${base}/skill-scan`;

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
      `AIPipe token is optional here (works without, better with — embedded in the URL path).`,
      `The grader POSTs \`{"skill": "<markdown text>"}\``,
      `and expects \`{"categories": [...]}\` back`,
      `(subset of \`hardcoded_secret\`, \`prompt_injection\`, \`excessive_permissions\`, \`unclear_provenance\`).`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
