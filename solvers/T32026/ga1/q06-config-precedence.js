import { apiAnswer, ga1Url } from './api-client.js';

export const id = 'q-config-precedence-server';
export const title = 'Q6: Resolve 12-Factor Config Precedence';

export async function solve(email) {
  const url = ga1Url(email, '/effective-config');
  return apiAnswer({
    title,
    url,
    variant: 'Live /effective-config endpoint',
    notes: 'The grader appends its own fresh `?set=key=value` overrides on every check, so submit the URL **without** any `?set=` of your own. The service merges your assigned defaults → YAML → `.env` → `APP_*` environment layers, applies the overrides last, coerces `port`/`workers` to integers and `debug` to a boolean, and always masks `api_key` as `****`.',
    debug: { question: 'Q6', route: '/effective-config' },
  });
}
