// Shared utilities for GA0 solvers

// Normalize email the same way as exam (ra() function in source)
export function normalizeEmail(user) {
  const email = typeof user === 'string' ? user : String(user?.email ?? user?.id ?? 'anonymous');
  return email.trim().replace(/\.+$/, '').trim().toLowerCase();
}

// FNV-1a 32-bit hash (matches oa() in exam source)
export function fnv1a(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const le = sha256;

// Create seeded RNG (uses global Math.seedrandom from CDN, same as exam's seedrandom pkg)
export function rng(seed) {
  return new Math.seedrandom(seed);
}

// Deterministic shuffle (Fisher-Yates with seeded RNG) — matches z() in exam
export function shuffle(arr, rngFn) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rngFn() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pick random element from array using seeded RNG — matches U() in exam
export function pick(arr, rngFn) {
  return arr[Math.floor(rngFn() * arr.length)];
}

// Round to n decimal places
export function round(n, places = 2) {
  return Number(n.toFixed(places));
}

// Safe JSON parse with fallback — use for parsing LLM responses
export function safeJsonParse(str, fallback = null) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

// Retry with exponential backoff for async operations (LLM/network calls)
export async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 500) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 200;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}
