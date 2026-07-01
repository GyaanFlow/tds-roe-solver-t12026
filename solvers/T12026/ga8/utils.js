// Shared utilities for GA8 solvers

export function normalizeEmail(user) {
  const email = typeof user === 'string' ? user : String(user?.email ?? user?.id ?? 'anonymous');
  return email.trim().replace(/\.+$/, '').trim().toLowerCase();
}

// SHA-256 hash via Web Crypto API (same as exam uses)
export async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create seeded RNG (uses global Math.seedrandom from CDN)
export function rng(seed) {
  return new Math.seedrandom(seed);
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

// Random int in [min, max] inclusive
export function randInt(rngFn, min, max) {
  return Math.floor(rngFn() * (max - min + 1)) + min;
}

// Random float in [min, max) with 1 decimal
export function randFloat1(rngFn, min, max) {
  return +(rngFn() * (max - min) + min).toFixed(1);
}
