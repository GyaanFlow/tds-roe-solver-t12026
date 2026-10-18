import { apiAnswer, ga2Url } from './api-client.js';
import { rng } from './utils.js';

export const id = 'q-middleware-ratelimit-cors-server';
export const title = 'Q12: Middleware Stack: Rate-Limit + CORS + Request Context';

export function computeMiddlewareConfig(email) {
  const norm = (email || '').trim().toLowerCase();
  const r = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const random = rng(`q-middleware-ratelimit-cors-server#${norm}#`);
  const code = Array.from({ length: 6 }, () => r[Math.floor(random() * r.length)]).join('');
  return {
    allowedOrigin: `https://app-${code}.example.com`,
    bucket: 8 + Math.floor(random() * 8)
  };
}

export async function solve(email) {
  const url = ga2Url(email, '/q10');
  const config = computeMiddlewareConfig(email);

  return apiAnswer({
    title,
    url,
    variant: `Middleware Stack (bucket: ${config.bucket} req/10s)`,
    notes: `Your assigned values are:\n- **Allowed CORS Origin:** \`${config.allowedOrigin}\`\n- **Rate-limit bucket (B):** \`${config.bucket} requests / 10s\`\n\nThe backend exposes \`GET /ping\`, propagates \`X-Request-ID\` (echoing supplied IDs or generating fresh UUIDs), enforces scoped CORS, and applies per-client rate limiting returning HTTP 429 after ${config.bucket} requests.`,
    debug: { question: 'Q12', route: '/q10', config }
  });
}
