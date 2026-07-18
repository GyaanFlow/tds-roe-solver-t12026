import { normalizeEmail } from './utils.js';

export const id = 'q-a2a-durable-delegate-server';
export const title = 'Q10: A2A Invoice Action Agent';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const enc = encodeURIComponent(norm);
  const tok = sessionToken ? encodeURIComponent(sessionToken) : '<TOKEN>';
  const base = `${HOST}/ga5/${enc}/${tok}/a2a/`;
  const dashboard = `${HOST}/ga5/`;
  const health = `${HOST}/ga5/${enc}/health`;

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
      `A2A 1.0 protocol at \`${base}message:send\`, \`${base}tasks/{id}\`, \`${base}tasks\`, \`${base}tasks/{id}:cancel\`.`,
      `Requires \`Authorization: Bearer <TOKEN>\` and \`A2A-Version: 1.0\` headers on every call.`,
      `Warm the dyno before submitting: \`GET ${health}\` (cold start ~50 s).`
    ].join('\n')
  };
}
