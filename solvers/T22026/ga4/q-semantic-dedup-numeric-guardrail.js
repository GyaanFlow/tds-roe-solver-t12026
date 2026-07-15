import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-semantic-dedup-numeric-guardrail-server';
export const title = 'Semantic Deduplication with Numeric-Fact Guardrails';

const SALT = 'tds-ga4-dedup-data-18aae18831e243c9bea945c8822447aeb7cbcf66ee5c48e59044f142adc1f1e7d26da7f2760f94825cbc6b5d7f0a60b4';

const NUM_FAMILIES = 50;
const NUM_TRAPS = 55;
const NUM_SINGLETONS = 70;
const DIM = 32;
const NOISE = 0.03;

function pad(n, w) { return String(n).padStart(w, '0'); }
function normVec(v) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map(x => Number((x / norm).toFixed(6)));
}
function jitter(v, rng, mag) { return normVec(v.map(x => x + (rng() * 2 - 1) * mag)); }
function hashKey(str) {
  return String(str || '').trim().toLowerCase().split('').reduce((o, i) => (Math.imul(o, 33) + i.charCodeAt(0)) >>> 0, 5381);
}

function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = hashKey(o);
  const s = [];
  let m = 0;
  const d = [];
  for (let e = 0; e < NUM_FAMILIES; e++) {
    const r = normVec(Array.from({ length: DIM }, () => seedrandom(`${SALT}#family-${o}-${e}`)() * 2 - 1));
    const c = 3000 + (e * 37 + i) % 90 * 500;
    const t = 3 + (e * 7 + i) % 5;
    d.push({ baseVector: r, numericFact: c });
    for (let a = 0; a < t; a++) {
      m += 1;
      s.push({ doc_id: `SD_${pad(m, 4)}`, embedding: jitter(r, seedrandom(`${o}#fam#${e}#${a}`), NOISE), numeric_fact: c });
    }
  }
  for (let e = 0; e < NUM_TRAPS; e++) {
    const r = d[(e * 13 + i) % NUM_FAMILIES];
    const c = e % 2 === 0 ? 1 : -1;
    const t = 200 + e % 5 * 37;
    m += 1;
    s.push({ doc_id: `SD_${pad(m, 4)}`, embedding: jitter(r.baseVector, seedrandom(`${o}#trap#${e}`), NOISE), numeric_fact: r.numericFact + c * t });
  }
  for (let e = 0; e < NUM_SINGLETONS; e++) {
    const r = normVec(Array.from({ length: DIM }, () => seedrandom(`${SALT}#singleton-${o}-${e}`)() * 2 - 1));
    m += 1;
    s.push({ doc_id: `SD_${pad(m, 4)}`, embedding: jitter(r, seedrandom(`${o}#single#${e}`), NOISE), numeric_fact: 3000 + (e * 53 + i) % 90 * 500 });
  }
  return { docs: s, rules: { similarity_threshold: 0.92, numeric_tolerance: 50 } };
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

class UnionFind {
  constructor(ids) {
    this.parent = new Map(ids.map(id2 => [id2, id2]));
  }
  find(x) {
    while (this.parent.get(x) !== x) {
      this.parent.set(x, this.parent.get(this.parent.get(x)));
      x = this.parent.get(x);
    }
    return x;
  }
  union(a, b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return;
    // arbitrary union; canonical determined later by lexicographic min
    this.parent.set(ra, rb);
  }
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = generateDataset(norm);
  const { docs, rules } = data;
  const { similarity_threshold, numeric_tolerance } = rules;

  const uf = new UnionFind(docs.map(d => d.doc_id));
  for (let a = 0; a < docs.length; a++) {
    for (let b = a + 1; b < docs.length; b++) {
      const da = docs[a], db = docs[b];
      if (Math.abs(da.numeric_fact - db.numeric_fact) > numeric_tolerance) continue;
      const sim = cosine(da.embedding, db.embedding);
      if (sim >= similarity_threshold) uf.union(da.doc_id, db.doc_id);
    }
  }

  const groups = new Map();
  for (const d of docs) {
    const root = uf.find(d.doc_id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(d.doc_id);
  }

  const answer = {};
  for (const members of groups.values()) {
    const canonical = [...members].sort()[0];
    for (const id2 of members) answer[id2] = canonical;
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `Semantic dedup canonical mapping for ${norm}`,
    answerDisplay: [
      `### Semantic Deduplication with Numeric-Fact Guardrails`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
