import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-semantic-cache-query-augmentation-server';
export const title = 'Semantic Caching and Query Augmentation';

const SALT = 'tds-ga4-semantic-cache-data-0c52326402a2404371ad5f1ae83cb12fd628e05cd6e0c0477ab2836185b6db3c13cef8923de5922d3f14f5dab500763b';

const P = ["degree", "diploma", "foundation"];
const CHANNELS = ["web", "mobile", "ivr"];
const LANGS = ["en", "hi"];
const G = [
  ["fee", "refund", "receipt", "payment"],
  ["exam", "hallticket", "slot", "reschedule"],
  ["course", "credit", "drop", "withdraw"],
  ["project", "review", "rubric", "deadline"],
  ["login", "otp", "profile", "identity"],
  ["certificate", "transcript", "grade", "dispatch"],
  ["scholarship", "waiver", "income", "document"],
  ["proctoring", "camera", "browser", "violation"]
];
const EXPANSION_MAP = {
  fee: ["payment", "receipt"], refund: ["reversal", "bank"], exam: ["assessment", "slot"],
  hallticket: ["admitcard", "exam"], course: ["subject", "term"], project: ["submission", "rubric"],
  login: ["signin", "otp"], certificate: ["transcript", "dispatch"], scholarship: ["waiver", "income"],
  proctoring: ["camera", "browser"]
};

function pad(n, w) { return String(n).padStart(w, '0'); }
function normVec(v) {
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map(x => Number((x / norm).toFixed(6)));
}
function jitter(v, rng, mag) {
  return normVec(v.map(x => x + (rng() * 2 - 1) * mag));
}

// Mirrors the exam's St(n): ONE generator seeded once, drawn 36 times.
// (Creating a fresh seedrandom per element would yield 36 identical values.)
function St(n) {
  const rng = seedrandom(`${SALT}#vector#${n}`);
  return normVec(Array.from({ length: 36 }, () => rng() * 2 - 1));
}

export function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = seedrandom(`${SALT}#${o}#semantic-cache-data`);
  const topicVecs = G.map((e, r) => St(`${r}-${e.join('-')}`));
  const m = [];
  for (let e = 0; e < 960; e++) {
    const r = e % G.length;
    const c = P[(e + Math.floor(i() * 10)) % P.length];
    const t = CHANNELS[(e + Math.floor(i() * 10)) % CHANNELS.length];
    const a = LANGS[(e + Math.floor(i() * 10)) % LANGS.length];
    const h = G[r];
    const u = `${h[e % h.length]} ${h[(e + 1) % h.length]} help ${c} term ${2024 + e % 4}`;
    m.push({
      cache_id: `SC_C_${pad(e + 1, 4)}`, tenant: c, channel: t, language: a,
      created_minute: 1000 + e * 3, query: u,
      embedding: jitter(topicVecs[r], seedrandom(`${o}#cache#${e}`), 0.045),
      answer_id: `ANS_${pad((r + 1) * 100 + e % 97, 4)}`
    });
  }
  const d = [];
  for (let e = 0; e < 72; e++) {
    const r = e % 4 !== 3;
    const c = m[(e * 37 + Math.floor(i() * 23)) % m.length];
    const t = G.findIndex(b => b.some(f => c.query.includes(f)));
    const a = G[Math.max(0, t)];
    const h = r ? c.tenant : P[(P.indexOf(c.tenant) + 1) % P.length];
    const u = c.channel, g = c.language;
    const w = r ? c.created_minute + 120 + e % 90 : c.created_minute + 900 + e;
    const y = `${a[(e + 2) % a.length]} ${a[(e + 3) % a.length]} status ${h}`;
    const k = r
      ? jitter(c.embedding, seedrandom(`${o}#request-hit#${e}`), 0.025)
      : jitter(St(`miss-${e}-${o}`), seedrandom(`${o}#request-miss#${e}`), 0.12);
    d.push({ request_id: `SC_R_${pad(e + 1, 3)}`, tenant: h, channel: u, language: g, at_minute: w, query: y, embedding: k });
  }
  return { cache_entries: m, requests: d, expansion_map: EXPANSION_MAP, rules: { ttl_minutes: 480, similarity_threshold: 0.91 } };
}

function tokenize(text) { return (text.toLowerCase().match(/\b[a-z0-9]+\b/g) || []); }
function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}
function round4(x) { return Math.round(x * 10000) / 10000; }

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = generateDataset(norm);
  const { cache_entries, requests, expansion_map, rules } = data;

  const answer = {};
  for (const req of requests) {
    const tokens = tokenize(req.query);
    const addedTerms = new Set();
    tokens.forEach(t => {
      if (expansion_map[t]) expansion_map[t].forEach(term => addedTerms.add(term));
    });
    const addedTermsSorted = [...addedTerms].sort();

    const candidates = cache_entries.filter(c =>
      c.tenant === req.tenant && c.channel === req.channel && c.language === req.language &&
      (req.at_minute - c.created_minute) <= rules.ttl_minutes
    );

    let best = null, bestSim = -Infinity;
    for (const c of candidates) {
      const sim = cosine(req.embedding, c.embedding);
      if (sim > bestSim) { bestSim = sim; best = c; }
    }

    if (best && bestSim >= rules.similarity_threshold) {
      answer[req.request_id] = { decision: 'HIT', cache_id: best.cache_id, nearest_similarity: round4(bestSim), added_terms: addedTermsSorted };
    } else {
      answer[req.request_id] = { decision: 'MISS', cache_id: null, nearest_similarity: best ? round4(bestSim) : 0, added_terms: addedTermsSorted };
    }
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `Semantic cache decisions for ${norm}`,
    answerDisplay: [
      `### Semantic Caching and Query Augmentation`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
