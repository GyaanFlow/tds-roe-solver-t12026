import { apiAnswer, ga2Url } from './api-client.js';

export const id = 'q-compose-redis-tunnel-server';
export const title = 'Q6: Multi-Container App via Compose, Exposed by Tunnel';

export async function solve(email) {
  const url = ga2Url(email, '/q4');

  return apiAnswer({
    title,
    url,
    variant: 'Multi-Container Redis Counter live endpoint',
    notes: 'The backend implements thread-safe independent atomic counters per key (\`POST /hit/{key}\` and \`GET /count/{key}\`), correctly returns 0 for unseen keys, and provides a health check at \`GET /healthz\` that reports \`{"status": "ok", "redis": "up"}\`.',
    debug: { question: 'Q6', route: '/q4' }
  });
}
