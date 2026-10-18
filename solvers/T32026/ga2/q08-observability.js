import { apiAnswer, ga2Url } from './api-client.js';

export const id = 'q-observability-metrics-server';
export const title = 'Q8: Production Observability: Metrics, Health & Structured Logs';

export async function solve(email) {
  const url = ga2Url(email, '/q6');

  return apiAnswer({
    title,
    url,
    variant: 'Production Observability live endpoint',
    notes: 'The backend implements the complete observability stack: a live-incrementing Prometheus counter `http_requests_total` at `GET /metrics`, an uptime reporter at `GET /healthz`, a mock work processor at `GET /work?n=K`, and structured log capture at `GET /logs/tail?limit=N`.',
    debug: { question: 'Q8', route: '/q6' }
  });
}
