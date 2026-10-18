import { apiAnswer, ga2Url } from './api-client.js';
import { rng } from './utils.js';

export const id = 'q-fastapi-metrics-cors-server';
export const title = 'Q3: Deploy a CORS-Aware Metrics API';

export function computeAllowedOrigin(email) {
  const norm = (email || '').trim().toLowerCase();
  const r = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const random = rng(`q-fastapi-metrics-cors-server#${norm}#`);
  const code = Array.from({ length: 6 }, () => r[Math.floor(random() * r.length)]).join('');
  return `https://dash-${code}.example.com`;
}

export async function solve(email) {
  const url = ga2Url(email, '/q1');
  const allowedOrigin = computeAllowedOrigin(email);

  return apiAnswer({
    title,
    url,
    variant: `CORS-Aware Metrics API (assigned origin: ${allowedOrigin})`,
    notes: `Your assigned allowed CORS origin is: \`${allowedOrigin}\`.\n\nThe backend computes descriptive statistics (\`count\`, \`sum\`, \`min\`, \`max\`, \`mean\`), enforces strict per-origin CORS (returning ACAO only for your assigned origin and rejecting evil origins), and sets \`X-Request-ID\` and \`X-Process-Time\` middleware response headers.`,
    debug: { question: 'Q3', route: '/q1', allowedOrigin }
  });
}
