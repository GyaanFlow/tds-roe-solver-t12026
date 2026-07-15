import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-rrf-fusion-server';
export const title = 'Reciprocal Rank Fusion by Hand';

const NUM_DOCS = 150;

const TOPICS = [
  "invoice ledger revenue expense margin budget forecast audit payroll vendor asset liability equity tax cashflow profit loss credit debit capital accrual balance statement variance treasury",
  "shipment warehouse inventory carrier route freight delivery pallet dispatch tracking dock container manifest customs fulfillment barcode scanner transit fleet lastmile packaging returns supply demand reorder",
  "sensor device signal voltage current circuit gateway firmware telemetry battery antenna network protocol packet latency bandwidth module controller actuator calibration diagnostic frequency resistance connector hardware",
  "patient clinic diagnosis therapy dosage symptom vaccine screening nurse doctor hospital pharmacy medication allergy recovery treatment infection chronic acute laboratory sample trial wellness triage prescription",
  "student course lesson grade assignment quiz lecture campus faculty syllabus tutorial semester credit rubric library classroom enrollment degree alumni workshop mentor project exam feedback certificate",
  "server database cache api endpoint request response thread cluster container runtime deploy scaling memory cpu queue worker session token schema migration backup replica shard timeout",
  "campaign audience brand content channel conversion impression click creative segment retention loyalty promotion pricing survey persona funnel newsletter sponsor launch market social engagement lead growth",
  "weather climate rainfall temperature humidity pressure forecast storm monsoon drought wind cloud satellite radar season cyclone flood heatwave snowfall evaporation airmass front precipitation visibility barometer",
  "recipe ingredient kitchen flavor spice sauce baking grill roast simmer texture portion nutrition protein carbohydrate vitamin menu chef restaurant cuisine pantry grain vegetable dessert beverage",
  "contract clause policy compliance regulation license permit liability privacy security breach audit standard governance risk control evidence approval review obligation dispute retention consent jurisdiction filing",
  "image pixel camera render filter contrast brightness histogram texture object detection segmentation label frame video resolution channel mask feature vision caption scene depth color annotation",
  "graph node edge path degree centrality community network cluster bridge weight flow route matrix adjacency component link neighbor distance ranking pagerank subgraph cycle tree bipartite"
].map(s => s.split(' '));

const STOPWORDS = "the and for with from into using across between during after before under over within without near through about each many some every this that these those when where while".split(' ');

function randInt(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); }
function pickFrom(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function randomQueryWords(rng, arr) {
  const n = randInt(rng, 4, 6);
  const set = new Set();
  while (set.size < n) set.add(pickFrom(rng, arr));
  return [...set].join(' ');
}

function generateDataset({ email, id: qid = 'q-rrf-fusion-server', version = '' }) {
  const norm = normalizeEmail(email);
  const s = seedrandom(`${norm}#${qid}#${version ?? ''}`);
  const docs = [];
  for (let e = 1; e <= NUM_DOCS; e++) {
    const r = randInt(s, 0, TOPICS.length - 1);
    const c = randInt(s, 20, 45);
    const t = [];
    for (let a = 0; a < c; a++) t.push(s() < 0.65 ? pickFrom(s, TOPICS[r]) : pickFrom(s, STOPWORDS));
    docs.push({ id: e, text: t.join(' ') });
  }
  const d = randInt(s, 0, TOPICS.length - 1);
  const query = randomQueryWords(s, TOPICS[d]);
  return { docs, query };
}

function tokenize(text) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 0);
}

function bm25Rank(queryTerms, docs, k1 = 1.5, b = 0.75) {
  const N = docs.length;
  const docTokens = docs.map(d => tokenize(d.text));
  const uniqQ = [...new Set(queryTerms)];
  const df = new Map();
  uniqQ.forEach(t => {
    let count = 0;
    docTokens.forEach(dt => { if (dt.includes(t)) count++; });
    df.set(t, count);
  });
  const avgdl = docTokens.reduce((sum, dt) => sum + dt.length, 0) / N;
  const scores = docs.map((doc, idx) => {
    const dt = docTokens[idx];
    let score = 0;
    uniqQ.forEach(t => {
      const dfT = df.get(t) || 0;
      const idf = Math.log((N - dfT + 0.5) / (dfT + 0.5) + 1);
      const f = dt.filter(x => x === t).length;
      if (f === 0) return;
      score += idf * f * (k1 + 1) / (f + k1 * (1 - b + b * dt.length / avgdl));
    });
    return { id: doc.id, score };
  });
  scores.sort((a, b2) => {
    if (b2.score !== a.score) return b2.score - a.score;
    return a.id - b2.id;
  });
  return scores;
}

function fnv1a(token) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < token.length; i++) {
    hash = hash ^ token.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function hashVector(tokens, D = 64) {
  const vec = new Array(D).fill(0);
  for (const tok of tokens) {
    const h = fnv1a(tok);
    const bucket = h % D;
    const sign = ((h >>> 16) & 1) === 0 ? 1 : -1;
    vec[bucket] += sign;
  }
  const norm = Math.sqrt(vec.reduce((s, x) => s + x * x, 0));
  if (norm === 0) return vec;
  return vec.map(x => x / norm);
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function hashedRank(queryTokens, docs) {
  const qVec = hashVector(queryTokens);
  const scores = docs.map(doc => {
    const dVec = hashVector(tokenize(doc.text));
    const norm = Math.sqrt(dVec.reduce((s, x) => s + x * x, 0));
    const sim = norm === 0 ? 0 : dot(qVec, dVec);
    return { id: doc.id, score: sim };
  });
  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.id - b.id;
  });
  return scores;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const { docs, query } = generateDataset({ email: norm, id, version: '' });
  const queryTokens = tokenize(query);

  const bm25Ranked = bm25Rank(queryTokens, docs);
  const listA = bm25Ranked.slice(0, 20).map(d => d.id);

  const hashRanked = hashedRank(queryTokens, docs);
  const listB = hashRanked.slice(0, 20).map(d => d.id);

  const rankA = new Map();
  listA.forEach((docId, idx) => rankA.set(docId, idx + 1));
  const rankB = new Map();
  listB.forEach((docId, idx) => rankB.set(docId, idx + 1));

  const allIds = new Set([...listA, ...listB]);
  const rrf = [...allIds].map(docId => {
    const ra = rankA.get(docId);
    const rb = rankB.get(docId);
    let score = 0;
    if (ra !== undefined) score += 1 / (60 + ra);
    if (rb !== undefined) score += 1 / (60 + rb);
    return { id: docId, score: Math.round(score * 1e6) / 1e6 };
  });
  rrf.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.id - b.id;
  });

  const top5 = rrf.slice(0, 5).map(r => r.id);
  const thirdScore = rrf[2] ? rrf[2].score : 0;

  const answer = { top5, third_score: thirdScore };

  // Sanity-check the submission shape mirrors the exam's validator.
  const jsonStr = JSON.stringify(answer);
  if (jsonStr.length > 2000) throw new Error('RRF answer too large');
  if (Object.keys(answer).sort().join(',') !== 'third_score,top5') throw new Error('RRF answer keys mismatch');
  if (!Array.isArray(answer.top5) || answer.top5.length !== 5 || !answer.top5.every(Number.isInteger)) throw new Error('RRF top5 shape invalid');
  if (!Number.isFinite(answer.third_score)) throw new Error('RRF third_score invalid');

  return {
    type: 'solved',
    answer: jsonStr,
    variant: `RRF fusion answer for ${norm}`,
    answerDisplay: [
      `### Reciprocal Rank Fusion by Hand`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2),
      `\`\`\``
    ].join('\n')
  };
}
