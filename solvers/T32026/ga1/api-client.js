import { markdownCodeBlock, normalizeEmail } from './utils.js';

// Live T3 GA1 API (Q6 config, Q14 MCP, Q15 ledger). Render is the only host that can reach the
// exam server for Q15, so all three questions use it; see tds-roe-solver-api/T32026/GA1.
export const T3_GA1_API_ORIGIN = 'https://tds-roe-solver-api-t12026.onrender.com';

export const T3_GA1_HEALTH_URL = `${T3_GA1_API_ORIGIN}/health`;

/**
 * Trimmed, lower-cased exam email — the form every T3 GA1 API route and the graders expect
 * (Q14's challenge hash uses the same normalisation). Throws instead of building a URL for an
 * address that cannot be a real exam login.
 */
export function apiEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized || !/^[^\s@]+@[^\s@]+$/.test(normalized)) {
    throw new Error('A valid exam email is required to build the API URL.');
  }
  return normalized;
}

/** `{origin}/ga1/{url-encoded email}{suffix}` — `@` becomes `%40`, `+` becomes `%2B`. */
export function ga1Url(email, suffix, origin = T3_GA1_API_ORIGIN) {
  return `${origin}/ga1/${encodeURIComponent(apiEmail(email))}${suffix}`;
}

/** Shared result shape for the two URL-only answers (Q6, Q14). */
export function apiAnswer({ title, url, notes, variant = 'Live T3 GA1 endpoint', debug = {} }) {
  const guide = [
    `### ${title}`,
    '',
    'Submit the URL exactly as shown in the Answer box. It is built from your trimmed, lower-cased exam email, so it is different for every student.',
    '',
    notes,
    '',
    '#### Before you press Check',
    '',
    `The API runs on Render's free tier and sleeps when idle; the first request after a sleep can take 30–50 seconds, which is long enough for the live grader to give up. Open [${T3_GA1_HEALTH_URL}](${T3_GA1_HEALTH_URL}) in a new tab, wait for it to answer, and then press **Check** straight away.`,
    '',
    `Your URL is: ${url}`,
  ].join('\n');

  return {
    type: 'solved',
    answer: url,
    variant,
    guide,
    answerDisplay: [`### ${title}`, '', '**Submit this URL:**', '', markdownCodeBlock(url, 'text'), '', notes].join('\n'),
    usesHostedApi: true,
    debug: { endpoint: url, apiOrigin: T3_GA1_API_ORIGIN, ...debug },
  };
}
