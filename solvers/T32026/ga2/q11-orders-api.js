import { apiAnswer, ga2Url } from './api-client.js';
import { rng } from './utils.js';

export const id = 'q-api-idempotency-pagination-server';
export const title = 'Q11: API Engineering: Idempotency + Pagination + Rate Limit';

export function computeOrdersConfig(email) {
  const norm = (email || '').trim().toLowerCase();
  const random = rng(`q-api-idempotency-pagination-server#${norm}#`);
  const o = (n, s) => n + Math.floor(random() * (s - n + 1));
  return {
    total: o(40, 60),
    rateLimit: o(15, 20)
  };
}

export async function solve(email) {
  const url = ga2Url(email, '/q9');
  const config = computeOrdersConfig(email);

  return apiAnswer({
    title,
    url,
    variant: `Orders API (T: ${config.total} orders, rate limit: ${config.rateLimit}/10s)`,
    notes: `Your assigned values are:\n- **Total orders (T):** \`${config.total}\`\n- **Rate limit (R):** \`${config.rateLimit} requests / 10s\`\n\nThe backend implements idempotent order creation via \`Idempotency-Key\`, cursor-based pagination across IDs 1..${config.total} with no duplicates or gaps, and per-client bucket rate limiting returning HTTP 429 with \`Retry-After\`.`,
    debug: { question: 'Q11', route: '/q9', config }
  });
}
