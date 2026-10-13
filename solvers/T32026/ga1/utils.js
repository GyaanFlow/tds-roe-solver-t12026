export function trimEmail(value) {
  const email = typeof value === 'string' ? value : String(value?.email ?? value?.id ?? '');
  return email.trim();
}

export function normalizeEmail(value) {
  return trimEmail(value).toLowerCase();
}

export function markdownCodeBlock(value, language = '') {
  const content = String(value);
  const runs = content.match(/`+/g) || [];
  const fence = '`'.repeat(Math.max(3, ...runs.map((run) => run.length + 1)));
  return `${fence}${language}\n${content}\n${fence}`;
}

/** Escape text for safe use in HTML element content AND double/single-quoted attribute values. */
export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

let nodeSeedrandom = null;

export function rng(seed) {
  if (typeof Math.seedrandom === 'function') {
    return new Math.seedrandom(seed);
  }
  if (nodeSeedrandom) {
    return nodeSeedrandom(seed);
  }
  // If running in Node or testing environments
  if (typeof globalThis !== 'undefined' && globalThis.Math?.seedrandom) {
    return new globalThis.Math.seedrandom(seed);
  }
  throw new Error('The seeded random generator did not load. Reload the portal and try again.');
}

// Allow node/tests to set seedrandom generator
export function setSeedrandom(fn) {
  nodeSeedrandom = fn;
}

export async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function makeGuideResult(answer, guide, variant = 'Student action required') {
  return { type: 'guide', answer, guide, variant, answerDisplay: guide };
}
