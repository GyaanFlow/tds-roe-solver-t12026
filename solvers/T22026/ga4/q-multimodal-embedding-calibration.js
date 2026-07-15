import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-multimodal-embedding-calibration-server';
export const title = 'Multimodal Embedding Calibration';

const SALT = 'tds-ga4-multimodal-data-50b663aeac4714b9eb240a19f7a7566a5842a9c2ccd6b33c4c75cfa5643d3f6890ca7d0e9d5250b97eb7ed110731c069';

const H = ["poster", "invoice", "certificate", "diagram", "screenshot", "id_card"];
const LOCALES = ["en", "hi", "ta", "te"];
const U = ["blue", "green", "red", "yellow", "gray", "violet"];
const V = ["dense", "spacious", "two_column", "bordered", "minimal", "annotated"];

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

function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = seedrandom(`${SALT}#${o}#multimodal-data`);
  const s = Object.fromEntries(H.map(t => [t, normVec(Array.from({ length: 48 }, () => seedrandom(`${SALT}#category-${t}`)() * 2 - 1))]));
  const m = Object.fromEntries(U.map(t => [t, normVec(Array.from({ length: 48 }, () => seedrandom(`${SALT}#color-${t}`)() * 2 - 1))]));
  const d = Object.fromEntries(V.map(t => [t, normVec(Array.from({ length: 48 }, () => seedrandom(`${SALT}#layout-${t}`)() * 2 - 1))]));
  const l = normVec(Array.from({ length: 48 }, (t, a) => (a % 5 - 2) / 50));

  const e = [];
  for (let t = 0; t < 780; t++) {
    const a = H[(t + Math.floor(i() * 9)) % H.length];
    const h = LOCALES[(t + Math.floor(i() * 9)) % LOCALES.length];
    const u = U[(t * 2 + Math.floor(i() * 9)) % U.length];
    const g = V[(t * 3 + Math.floor(i() * 9)) % V.length];
    const w = sumVecs([s[a], m[u], d[g]]);
    const y = sumVecs([s[a], m[u], d[g], l]);
    e.push({
      item_id: `MM_I_${pad(t + 1, 4)}`, category: a, locale: h, color: u, layout: g,
      caption: `${h} ${u} ${g} ${a} artifact ${pad(t + 1, 4)}`,
      text_embedding: jitter(w, seedrandom(`${o}#text#${t}`), 0.05),
      image_embedding: jitter(y, seedrandom(`${o}#image#${t}`), 0.06)
    });
  }
  const r = [];
  for (let t = 0; t < 42; t++) {
    const a = H[(t + Math.floor(i() * 11)) % H.length];
    const h = LOCALES[(t + Math.floor(i() * 7)) % LOCALES.length];
    const u = U[(t + Math.floor(i() * 13)) % U.length];
    const g = V[(t + Math.floor(i() * 17)) % V.length];
    const w = sumVecs([s[a], m[u], d[g]]);
    const y = sumVecs([s[a], m[u], d[g], l]);
    r.push({
      query_id: `MM_Q_${pad(t + 1, 3)}`, text: `Find ${h} ${u} ${g} ${a} artifacts.`,
      target_category: a, target_locale: h,
      category_filter: t % 5 === 0 ? null : a,
      locale_filter: t % 6 === 0 ? null : h,
      text_weight: t % 3 === 0 ? 0.65 : 0.55,
      image_weight: t % 3 === 0 ? 0.35 : 0.45,
      text_embedding: jitter(w, seedrandom(`${o}#query-text#${t}`), 0.04),
      image_embedding: jitter(y, seedrandom(`${o}#query-image#${t}`), 0.045)
    });
  }
  return { items: e, queries: r, calibration: { image_delta: l, category_match_boost: 0.025, locale_match_boost: 0.015, top_k: 5 } };
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
  const { items, queries, calibration } = data;
  const { image_delta, category_match_boost, locale_match_boost, top_k } = calibration;

  const calibratedItems = items.map(it => ({
    ...it,
    calibrated_image: normVec(it.image_embedding.map((v, idx) => v - image_delta[idx]))
  }));

  const answer = {};
  for (const q of queries) {
    const filtered = calibratedItems.filter(it =>
      (q.category_filter === null || it.category === q.category_filter) &&
      (q.locale_filter === null || it.locale === q.locale_filter)
    );
    const scored = filtered.map(it => {
      let score = q.text_weight * cosine(q.text_embedding, it.text_embedding) +
        q.image_weight * cosine(q.image_embedding, it.calibrated_image);
      if (it.category === q.target_category) score += category_match_boost;
      if (it.locale === q.target_locale) score += locale_match_boost;
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
    variant: `Multimodal calibration ranking for ${norm}`,
    answerDisplay: [
      `### Multimodal Embedding Calibration`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
