export function trimEmail(value) {
  const email = typeof value === 'string' ? value : String(value?.email ?? value?.id ?? '');
  return email.trim();
}

export function normalizeEmail(value) {
  return trimEmail(value).toLowerCase();
}

export function fnv1a(text) {
  let h = 2166136261;
  for (let ch of String(text || '').trim().toLowerCase()) {
    h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  }
  return h;
}

export function markdownCodeBlock(value, language = '') {
  const content = String(value);
  const runs = content.match(/`+/g) || [];
  const fence = '`'.repeat(Math.max(3, ...runs.map((run) => run.length + 1)));
  return `${fence}${language}\n${content}\n${fence}`;
}

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
  if (typeof globalThis !== 'undefined' && globalThis.Math?.seedrandom) {
    return new globalThis.Math.seedrandom(seed);
  }
  throw new Error('The seeded random generator did not load. Reload the portal and try again.');
}

export function setSeedrandom(fn) {
  nodeSeedrandom = fn;
}

export function makeGuideResult({ title, answer, guide, variant = 'Manual Task / Guide' }) {
  return {
    type: 'guide',
    answer,
    variant,
    guide,
    answerDisplay: `### ${title}\n\n${guide}`,
  };
}
