// Variations Engine for TDS T2-2026 Project 2
// Generates mathematically verified, rubric-perfect, email-seeded variations for 1000+ students.

export function createRng(seedStr) {
  let h = 2166136261;
  const s = String(seedStr || 'anonymous').toLowerCase().trim();
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
  }
  let st = h || 123456789;
  return () => {
    st ^= st << 13;
    st ^= st >>> 17;
    st ^= st << 5;
    return (st >>> 0) / 4294967296;
  };
}

export function pick(rng, arr) {
  if (!arr || arr.length === 0) return '';
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffle(rng, arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function sample(rng, arr, count) {
  const shuffled = shuffle(rng, arr);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function formatTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const rowLines = rows.map(r => `| ${r.join(' | ')} |`);
  return [headerLine, separatorLine, ...rowLines].join('\n');
}

export function ensureLength(text, minLen, maxLen, paddingOptions = []) {
  let result = text.trim();
  if (result.length > maxLen) {
    result = result.slice(0, maxLen - 20) + '...';
  }
  return result;
}
