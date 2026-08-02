// Shared utilities for T2 2026 ROE solvers

// Normalize email the same way as the exam bundle typically does.
export function normalizeEmail(user) {
  const email = typeof user === 'string' ? user : String(user?.email ?? user?.id ?? 'anonymous');
  return email.trim().replace(/\.+$/, '').trim().toLowerCase();
}

// FNV-1a 32-bit hash — common in exam bundles for compact deterministic ids.
export function fnv1a(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// FNV-1a 32-bit over the string's UTF-8 BYTES, returned as 8 lowercase hex digits.
// Deliberately separate from fnv1a() above: that one walks UTF-16 code units, which only
// coincides with UTF-8 for pure ASCII. The ROE certificates specify "FNV-1a 32-bit over its
// UTF-8 bytes", so anything non-ASCII (very much in play for the Unicode ledger question)
// would silently produce a different digest with the code-unit version.
export function fnv1a32Utf8Hex(str) {
  const bytes = new TextEncoder().encode(str);
  let h = 2166136261;
  for (let i = 0; i < bytes.length; i++) {
    h = Math.imul(h ^ bytes[i], 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Seeded RNG — uses the global Math.seedrandom patched in by the CDN script in index.html,
// same convention as GA0/GA1/GA2 and the T1 2026 ROE solvers.
export function rng(seed) {
  return new Math.seedrandom(seed);
}

// Deterministic Fisher-Yates shuffle with a seeded RNG.
export function shuffle(arr, rngFn) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rngFn() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick a random element from an array using a seeded RNG.
export function pick(arr, rngFn) {
  return arr[Math.floor(rngFn() * arr.length)];
}

export function round(n, places = 2) {
  return Number(n.toFixed(places));
}

export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}
