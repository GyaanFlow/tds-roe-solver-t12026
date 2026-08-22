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

/**
 * Like sample(), but guarantees the selection covers as many distinct keys as possible before
 * doubling up on any one of them.
 *
 * Used for evidence-table rows keyed on their Source column: a plain random sample could return
 * six rows that all cite the SAME file, producing a note that never mentions the other data files
 * the case supplies. Graders reward traceability across sources, so breadth is picked first and
 * the remaining slots are filled randomly (which preserves per-student variation).
 */
/**
 * Normalize an evidence-table Source cell down to the underlying file(s), so that
 * "country_tariff_matrix.xlsx (Swiss Matrix)" and "country_tariff_matrix.xlsx (EU Matrix)"
 * count as the SAME source for diversity purposes — otherwise a sample can look varied while
 * every row actually cites one file.
 */
// Recognized data-file extensions across the P2 case files (csv/jsonl/eml/pdf/md/xlsx/txt).
const FILE_TOKEN_RE = /[a-z0-9_.-]+\.(?:csv|jsonl|eml|pdf|md|xlsx|txt)\b/gi;

/**
 * Reduce a Source cell down to JUST the underlying file name(s), ignoring everything else in the
 * cell (sheet/tab names, column names, row counts, quoted text).
 *
 * This has to extract file tokens specifically rather than hashing the whole string: once evidence
 * rows started citing "file.csv, column X, N rows" for traceability, two rows naming the SAME file
 * but different columns produced different whole-string keys, silently defeating the diversity
 * sampling this function exists for (a real regression caught by the citation-density check in
 * check.mjs — some seeds ended up with 6 rows that all cited one file despite looking varied).
 */
export function sourceKey(source) {
  const text = String(source || '');
  const files = text.match(FILE_TOKEN_RE);
  if (files && files.length > 0) {
    return [...new Set(files.map(f => f.toLowerCase()))].sort().join(' ');
  }
  // Fallback for a Source cell with no recognizable filename (rare/free-text case).
  return text.toLowerCase().trim();
}

export function sampleDiverse(rng, arr, count, keyFn) {
  const byKey = new Map();
  for (const item of shuffle(rng, arr)) {
    const key = keyFn(item);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(item);
  }

  const picked = [];
  const leftovers = [];
  for (const group of shuffle(rng, [...byKey.values()])) {
    picked.push(group[0]);
    leftovers.push(...group.slice(1));
  }

  const result = picked.slice(0, count);
  if (result.length < count) {
    result.push(...shuffle(rng, leftovers).slice(0, count - result.length));
  }
  return shuffle(rng, result);
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
