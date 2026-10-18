import { apiAnswer, ga2Url } from './api-client.js';

export const id = 'q-local-llm-structured-server';
export const title = 'Q10: Local LLM Structured-Output Service';

export async function solve(email) {
  const url = ga2Url(email, '/q8/extract');

  return apiAnswer({
    title,
    url,
    variant: 'Structured Invoice Extraction live endpoint',
    notes: 'The backend parses free-form invoice text and returns validated JSON with `vendor` (preserving punctuation like `Ltd.`), `amount`, 3-letter uppercase `currency`, and `date` (`YYYY-MM-DD`). It gracefully returns HTTP 422 on empty or malformed inputs without crashing.',
    debug: { question: 'Q10', route: '/q8/extract' }
  });
}
