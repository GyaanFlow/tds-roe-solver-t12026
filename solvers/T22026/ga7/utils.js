export function normalizeEmail(email) {
  if (!email) return '';
  return email.trim().toLowerCase().replace(/\.+$/, '');
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
