import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-ann-index-recall-latency-server';
export const title = 'ANN Index: IVF Recall vs. Latency Tradeoff';

const SALT = 'tds-ga4-ann-data-9b212e1877f9a0b061ad49307ed02d1e65cdb193b9d38ed4dcb9d7cb2ec9935349a039acec4e81f5c6f4f64382122d6e';

const NUM_CENTROIDS = 20;
const NUM_ITEMS = 900;
const NUM_QUERIES = 45;
const DIM = 8;
const ITEM_JITTER = 0.7;
const QUERY_JITTER = 0.55;

function pad(n, w) { return String(n).padStart(w, '0'); }
function normVec(v) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map(x => Number((x / norm).toFixed(6)));
}
function jitter(v, rng, mag) { return normVec(v.map(x => x + (rng() * 2 - 1) * mag)); }

function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = seedrandom(`${SALT}#${o}#ann-data`);
  const s = Array.from({ length: NUM_CENTROIDS }, (e, r) => ({
    centroid_id: `CEN_${pad(r, 2)}`,
    embedding: normVec(Array.from({ length: DIM }, () => seedrandom(`${SALT}#centroid-${o}-${r}`)() * 2 - 1))
  }));
  const m = [];
  for (let e = 0; e < NUM_ITEMS; e++) {
    const r = Math.floor(i() * NUM_CENTROIDS);
    m.push({ item_id: `VDB_I_${pad(e + 1, 4)}`, embedding: jitter(s[r].embedding, seedrandom(`${o}#item#${e}`), ITEM_JITTER) });
  }
  const d = [];
  for (let e = 0; e < NUM_QUERIES; e++) {
    const r = Math.floor(i() * NUM_CENTROIDS);
    d.push({ query_id: `ANN_Q_${pad(e + 1, 3)}`, nprobe: e % 4 + 1, embedding: jitter(s[r].embedding, seedrandom(`${o}#query#${e}`), QUERY_JITTER) });
  }
  return { centroids: s, items: m, queries: d, rules: { top_k: 5 } };
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = generateDataset(norm);
  const { centroids, items, queries, rules } = data;

  // Assign each item to nearest centroid
  const assignment = new Map();
  const lists = new Map(centroids.map(c => [c.centroid_id, []]));
  for (const it of items) {
    let best = null, bestSim = -Infinity;
    for (const c of centroids) {
      const sim = cosine(it.embedding, c.embedding);
      if (sim > bestSim || (sim === bestSim && c.centroid_id < best.centroid_id)) { bestSim = sim; best = c; }
    }
    assignment.set(it.item_id, best.centroid_id);
    lists.get(best.centroid_id).push(it);
  }

  const answer = {};
  for (const q of queries) {
    const centroidScores = centroids.map(c => ({ centroid_id: c.centroid_id, score: cosine(q.embedding, c.embedding) }));
    centroidScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.centroid_id.localeCompare(b.centroid_id);
    });
    const probed = centroidScores.slice(0, q.nprobe).map(c => c.centroid_id);
    const candidates = [];
    probed.forEach(cid => candidates.push(...lists.get(cid)));
    const scored = candidates.map(it => ({ item_id: it.item_id, score: cosine(q.embedding, it.embedding) }));
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item_id.localeCompare(b.item_id);
    });
    answer[q.query_id] = scored.slice(0, rules.top_k).map(x => x.item_id);
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `IVF ANN retrieval ranking for ${norm}`,
    answerDisplay: [
      `### ANN Index: IVF Recall vs. Latency Tradeoff`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
