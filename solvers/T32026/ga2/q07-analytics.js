import { apiAnswer, ga2Url } from './api-client.js';
import { rng } from './utils.js';

export const id = 'q-deploy-analytics-platform-server';
export const title = 'Q7: Deploy a POST Analytics Endpoint';

export function computeAnalyticsApiKey(email) {
  const norm = (email || '').trim().toLowerCase();
  const re = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const random = rng(`q-deploy-analytics-platform-server#${norm}#`);
  const token = Array.from({ length: 24 }, () => re[Math.floor(random() * re.length)]).join('');
  return `ak_${token}`;
}

export async function solve(email) {
  const url = ga2Url(email, '/q5/analytics');
  const apiKey = computeAnalyticsApiKey(email);

  return apiAnswer({
    title,
    url,
    variant: `POST Analytics Endpoint (assigned key: ${apiKey})`,
    notes: `Your assigned API key is: \`${apiKey}\`.\n\nThe backend enforces header authentication via \`X-API-Key\` (returning HTTP 401 on missing or incorrect keys), dynamically aggregates batch events (\`total_events\`, \`unique_users\`, positive \`revenue\`, and \`top_user\`), and supports direct browser verification with open CORS.`,
    debug: { question: 'Q7', route: '/q5/analytics', apiKey }
  });
}
