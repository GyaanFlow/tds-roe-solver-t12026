import { apiAnswer, ga2Url } from './api-client.js';

export const id = 'q-config-precedence-server';
export const title = 'Q5: Resolve 12-Factor Config Precedence';

export async function solve(email) {
  const url = ga2Url(email, '/q3/effective-config');

  return apiAnswer({
    title,
    url,
    variant: '12-Factor Config Precedence live endpoint',
    notes: 'The grader dynamically appends its own fresh `?set=key=value` query overrides on every check, so submit the URL **without** any query parameters. The backend merges defaults → YAML → `.env` → `APP_*` OS env layers, resolves the `NUM_WORKERS → workers` alias, correctly coerces types, applies dynamic query overrides with top precedence, and masks `api_key` as `****`.',
    debug: { question: 'Q5', route: '/q3/effective-config' }
  });
}
