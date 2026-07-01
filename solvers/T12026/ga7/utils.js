// Shared utilities for all solvers

// FNV-1a hash (same as exam uses)
export function fnvHash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function normalizeEmail(user) {
  const email = typeof user === 'string' ? user : String(user?.email ?? user?.id ?? 'anonymous');
  return email.trim().replace(/\.+$/, '').trim().toLowerCase();
}

// Create seeded RNG (uses global Math.seedrandom from CDN)
export function rng(seed) {
  return new Math.seedrandom(seed);
}

// SHA-256 hash (for reconciliation/aggregation verification)
export async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Deterministic shuffle using seeded RNG
export function shuffle(arr, rngFn) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rngFn() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick N evenly spaced items from palette
export function pickColors(palette, n) {
  if (n >= palette.length) return palette.slice(0, n);
  if (n === 1) return [palette[0]];
  const result = [];
  for (let i = 0; i < n; i++) {
    const idx = Math.round(i * (palette.length - 1) / (n - 1));
    result.push(palette[idx]);
  }
  return result;
}

// Pick N colors from a diverging palette while preserving a light midpoint.
// The GA7 validator checks color at floor(n / 2), so even-length outputs still
// need the neutral center color to land at that index.
export function pickDivergingColors(palette, n) {
  if (n >= palette.length) return palette.slice(0, n);
  if (n <= 1) return [palette[Math.floor(palette.length / 2)]];

  const mid = Math.floor(palette.length / 2);
  const sampleRange = (start, end, count) => {
    if (count <= 0) return [];
    if (count === 1) return [palette[start]];

    const span = end - start;
    const colors = [];
    for (let i = 0; i < count; i++) {
      const idx = start + Math.round((i * span) / (count - 1));
      colors.push(palette[idx]);
    }
    return colors;
  };

  const leftCount = Math.floor(n / 2);
  const rightCount = n - leftCount - 1;
  const left = sampleRange(0, mid - 1, leftCount);
  const right = sampleRange(mid + 1, palette.length - 1, rightCount);

  return [...left, palette[mid], ...right];
}

// Month names
export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Well-known palettes that pass validation
export const PALETTES = {
  sequential: ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'],
  categorical: ['#4e79a7','#f28e2b','#e15759','#76b7b2','#59a14f','#edc948','#b07aa1','#ff9da7','#9c755f','#bab0ac'],
  diverging: ['#d73027','#f46d43','#fdae61','#fee08b','#ffffff','#d9ef8b','#a6d96a','#66bd63','#1a9850'],
};
