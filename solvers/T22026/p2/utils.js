export function normalizeEmail(email) {
  if (!email) return '';
  return String(email).trim().toLowerCase().replace(/\.+$/, '');
}

/**
 * Guard for the seeded case-study generators. Every per-student note is derived from an RNG seeded
 * with the email, so a blank/missing email still yields a perfectly deterministic answer -- but the
 * SAME one for every student who submits without an email, which is both wrong-for-you and a
 * plagiarism collision. Refuse instead of emitting a confident `solved` note.
 * Mirrors the requireEmail() guard added to solvers/T22026/ga7/utils.js for the same bug class.
 */
export function requireEmail(normalizedEmail) {
  if (!normalizedEmail || !String(normalizedEmail).trim()) {
    throw new Error(
      'This case-study note is seeded from your exam email, and no email was provided. ' +
      'Enter your IITM email in the workspace and reinitialize -- a note generated without it ' +
      'would be identical for every student who did the same.'
    );
  }
  return String(normalizedEmail).trim();
}

// Seeded LCG using FNV-1a hash
export function seededRng(seedStr) {
  let h = 2166136261;
  const s = (seedStr || 'anon').toLowerCase();
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  let st = h;
  return () => { st ^= st << 13; st ^= st >>> 17; st ^= st << 5; return (st >>> 0) / 4294967296; };
}

// Fisher-Yates shuffle using seeded RNG
export function shuffleArray(arr, rng) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
