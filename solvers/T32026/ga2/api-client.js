import { markdownCodeBlock, normalizeEmail } from './utils.js';

// Live T3 GA2 API origin (Render multi-tenant hub).
export const T3_GA2_API_ORIGIN = 'https://tds-roe-solver-api-t12026.onrender.com';
export const T3_GA2_HEALTH_URL = `${T3_GA2_API_ORIGIN}/health`;

export function apiEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized || !/^[^\s@]+@[^\s@]+$/.test(normalized)) {
    throw new Error('A valid exam email is required to build the API URL.');
  }
  return normalized;
}

/** `{origin}/ga2/{normalized_email}/{suffix}` */
export function ga2Url(email, suffix, origin = T3_GA2_API_ORIGIN) {
  const norm = apiEmail(email);
  const cleanSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;
  return `${origin}/ga2/${norm}${cleanSuffix}`;
}

export function apiAnswer({ title, url, notes, variant = 'Live T3 GA2 API Endpoint', debug = {} }) {
  const guide = [
    `### ${title}`,
    '',
    'Submit the URL exactly as shown in the Answer box. It is dynamically generated using your lower-cased exam email and routes to our pre-configured production multi-tenant backend.',
    '',
    notes,
    '',
    '#### ⚠️ Important: Before you press Check on the exam page',
    '',
    `The backend runs on Render and sleeps when idle. If it has been idle, the first wake-up request can take 30–50 seconds, which can cause the live grader to timeout.`,
    '',
    `1. Open [${T3_GA2_HEALTH_URL}](${T3_GA2_HEALTH_URL}) in a new tab.`,
    `2. Wait for it to respond with \`{"status": "ok"}\` or similar.`,
    `3. Return to the exam portal and click **Check** immediately!`,
    '',
    `**Your endpoint URL:**`,
    markdownCodeBlock(url, 'text')
  ].join('\n');

  return {
    type: 'solved',
    answer: url,
    variant,
    guide,
    answerDisplay: [
      `### ${title}`,
      '',
      '**Submit this URL:**',
      '',
      markdownCodeBlock(url, 'text'),
      '',
      notes,
    ].join('\n'),
    usesHostedApi: true,
    debug: { endpoint: url, apiOrigin: T3_GA2_API_ORIGIN, ...debug },
  };
}
