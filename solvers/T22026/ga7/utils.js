export function normalizeEmail(email) {
  if (!email) return '';
  return String(email).trim().toLowerCase().replace(/\.+$/, '');
}

/**
 * Guard for the seeded solvers (Q7-Q10). Every per-student answer is derived from an RNG seeded
 * with the email, so a blank email still yields a perfectly deterministic -- and completely wrong
 * -- answer for every real student. Emitting that as `solved` would be a confidently-presented
 * wrong answer, so refuse instead.
 */
export function requireEmail(normalizedEmail, questionLabel) {
  if (!normalizedEmail || !String(normalizedEmail).trim()) {
    throw new Error(
      `${questionLabel} is generated from your exam email, and no email was provided. ` +
      `Enter your IITM email in the workspace and reinitialize -- an answer computed without it ` +
      `would be deterministic but wrong for you.`
    );
  }
  return String(normalizedEmail).trim();
}

// Seeded LCG using FNV-1a hash -- for cosmetic placeholder text only, not answer generation
// (answer generation uses the real seedrandom.js ARC4 generator, matching the exam bundle).
export function seededRng(seedStr) {
  let h = 2166136261;
  const s = (seedStr || 'anon').toLowerCase();
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  let st = h;
  return () => { st ^= st << 13; st ^= st >>> 17; st ^= st << 5; return (st >>> 0) / 4294967296; };
}
