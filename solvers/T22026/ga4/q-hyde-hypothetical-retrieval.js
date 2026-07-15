import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-hyde-hypothetical-retrieval-server';
export const title = 'HyDE: Hypothetical Document Embeddings for Query Augmentation';

const SALT = 'tds-ga4-hyde-data-5203f61502e12bdcacc52e5a3078c423fb3268646470906a2b5fcff1076a66071613d66507f5fe8365838d3f2c6f8441';

const Q_CATS = ["billing", "enrollment", "assessment", "curriculum", "aid", "integrity", "records", "helpdesk"];
const W_YEARS = [2023, 2024, 2025, 2026];

function pad(n, w) { return String(n).padStart(w, '0'); }
function normVec(v) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map(x => Number((x / norm).toFixed(6)));
}
function jitter(v, rng, mag) { return normVec(v.map(x => x + (rng() * 2 - 1) * mag)); }
function sumVecs(vecs) {
  const out = Array.from({ length: vecs[0].length }, () => 0);
  for (const v of vecs) for (let i = 0; i < out.length; i++) out[i] += v[i];
  return normVec(out);
}

// Mirrors the exam's Nt(n): ONE generator seeded once, drawn 32 times.
function Nt(n) {
  const rng = seedrandom(`${SALT}#${n}`);
  return normVec(Array.from({ length: 32 }, () => rng() * 2 - 1));
}

export function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = seedrandom(`${SALT}#${o}#hyde-data`);
  const s = Object.fromEntries(Q_CATS.map(r => [r, Nt(`category-${r}`)]));
  const m = Object.fromEntries(W_YEARS.map(r => [r, Nt(`year-${r}`)]));

  const d = [];
  for (let r = 0; r < 500; r++) {
    const c = Q_CATS[(r + Math.floor(i() * 7)) % Q_CATS.length];
    const t = W_YEARS[(r * 2 + Math.floor(i() * 7)) % W_YEARS.length];
    const a = sumVecs([s[c], m[t]]);
    d.push({ item_id: `KB_I_${pad(r + 1, 4)}`, category: c, publish_year: t, text_embedding: jitter(a, seedrandom(`${o}#item#${r}`), 0.05) });
  }
  const l = [];
  for (let r = 0; r < 40; r++) {
    const c = Q_CATS[(r + Math.floor(i() * 9)) % Q_CATS.length];
    const t = W_YEARS[(r * 3 + Math.floor(i() * 9)) % W_YEARS.length];
    const a = sumVecs([s[c], m[t]]);
    const h = r % 3 === 0 ? 0.3 : 0.4;
    l.push({
      query_id: `HQ_${pad(r + 1, 3)}`,
      query_text: `Something is wrong with my ${c} — what should I do?`,
      target_category: c, min_year: t,
      raw_weight: h, hyde_weight: Number((1 - h).toFixed(2)),
      query_embedding: jitter(a, seedrandom(`${o}#query#${r}`), 0.14),
      hypothetical_answers: [0, 1, 2].map(u => ({
        text: `Hypothetical answer ${u + 1} for query ${r + 1} about ${c} policies from ${t}.`,
        embedding: jitter(a, seedrandom(`${o}#hyde#${r}#${u}`), 0.05)
      }))
    });
  }
  return { items: d, queries: l, rules: { top_k: 5, category_match_boost: 0.03, recency_boost: 0.02 } };
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
  const { items, queries, rules } = data;
  const { top_k, category_match_boost, recency_boost } = rules;

  const answer = {};
  for (const q of queries) {
    const hydeVec = sumVecs(q.hypothetical_answers.map(h => h.embedding));
    const finalVec = normVec(q.query_embedding.map((v, idx) => q.raw_weight * v + q.hyde_weight * hydeVec[idx]));

    const scored = items.map(it => {
      let score = cosine(finalVec, it.text_embedding);
      if (it.category === q.target_category) score += category_match_boost;
      if (it.publish_year >= q.min_year) score += recency_boost;
      return { item_id: it.item_id, score };
    });
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.item_id.localeCompare(b.item_id);
    });
    answer[q.query_id] = scored.slice(0, top_k).map(x => x.item_id);
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `HyDE retrieval ranking for ${norm}`,
    answerDisplay: [
      `### HyDE: Hypothetical Document Embeddings`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
