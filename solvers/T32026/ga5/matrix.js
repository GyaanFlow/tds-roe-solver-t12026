// GA5 Q2: rebuild the student's dataset exactly as the exam page does, then compute the 10 x 7 matrix from the fixed
// two-model score table. Pure code; the seeded random generator is passed in so the same module runs in the portal, on
// the exam page and in tests.
import { DOMAINS, SALT, SCORES_BASE64 } from './embedding-data.js';

const DOCS_PER_TOPIC = 5; // of the 6 sentences in each topic
const POOL_PER_TOPIC = 6;

/** `random(seed)` must return a seedrandom-compatible generator. Mirrors the exam bundle's dataset function. */
export function buildDataset(email, random, version = '') {
  const student = String(email ?? '').trim().toLowerCase();
  if (!student.includes('@')) throw new Error('A valid exam email is required.');
  const next = random(`${SALT}#${student}#${version}`);
  const picked = [];
  DOMAINS.forEach((domain, topic) => {
    const order = [0, 1, 2, 3, 4, 5];
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(next() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    for (const k of order.slice(0, DOCS_PER_TOPIC)) picked.push({ pool: topic * POOL_PER_TOPIC + k, text: domain.sentences[k] });
  });
  for (let i = picked.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return { sentences: picked.map((p) => p.text), queries: DOMAINS.map((d) => d.query), poolIndex: picked.map((p) => p.pool) };
}

let cachedScores = null;
function scores() {
  if (cachedScores) return cachedScores;
  const text = typeof atob === 'function' ? atob(SCORES_BASE64) : Buffer.from(SCORES_BASE64, 'base64').toString('binary');
  const bytes = Uint8Array.from(text, (c) => c.charCodeAt(0));
  if (bytes.length !== 1200 * 8) throw new Error('The score table is incomplete. Reload the page.');
  const view = new DataView(bytes.buffer);
  cachedScores = Array.from({ length: 1200 }, (_, i) => view.getFloat64(i * 8, true));
  return cachedScores;
}

/** Average ranks (ties share the mean rank), 1-based, as SciPy does. */
export function ranks(values) {
  const order = values.map((value, index) => ({ value, index })).sort((a, b) => a.value - b.value);
  const out = new Array(values.length);
  for (let i = 0; i < order.length;) {
    let end = i + 1;
    while (end < order.length && order[end].value === order[i].value) end += 1;
    const rank = (i + end - 1) / 2 + 1;
    for (let k = i; k < end; k += 1) out[order[k].index] = rank;
    i = end;
  }
  return out;
}

export function spearman(a, b) {
  if (a.length !== b.length || a.length < 2) throw new Error('Spearman needs two equal lists.');
  const ra = ranks(a);
  const rb = ranks(b);
  const mean = (a.length + 1) / 2;
  let num = 0; let da = 0; let db = 0;
  for (let i = 0; i < a.length; i += 1) {
    const x = ra[i] - mean; const y = rb[i] - mean;
    num += x * y; da += x * x; db += y * y;
  }
  if (!da || !db) throw new Error('Constant scores have no correlation.');
  return num / Math.sqrt(da * db);
}

/** Best three document positions, highest score first; equal scores keep the lower position first. */
export const top3 = (values) => values.map((value, index) => ({ value, index })).sort((a, b) => b.value - a.value || a.index - b.index).slice(0, 3).map((x) => x.index);

/** The student's 10 x 7 matrix `[a1,a2,a3,b1,b2,b3,rho]` and the text to paste. */
export function buildMatrix(email, random, version = '') {
  const data = buildDataset(email, random, version);
  const all = scores();
  const matrix = data.queries.map((_, q) => {
    const a = data.poolIndex.map((d) => all[q * 60 + d]);
    const b = data.poolIndex.map((d) => all[600 + q * 60 + d]);
    return [...top3(a), ...top3(b), Math.round(spearman(a, b) * 10000) / 10000];
  });
  return { matrix, text: JSON.stringify(matrix), dataset: { sentences: data.sentences, queries: data.queries } };
}
