import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-rag-evaluation-harness-server';
export const title = 'Q2: RAG Evaluation Harness (RAGAS-style Metrics)';

const SALT = 'tds-ga4-q2-data-f7adee089cc927803d18f5dd04b18879c5cf11a0a4e3b081';

const TRACE_TEMPLATES = [
  {question:"What is the primary benefit of using V2I communication in autonomous trucking?",reference:"V2I communication allows trucks to receive signal phase and timing data, which reduces idle time at intersections and cuts fuel consumption by fifteen percent.",chunks:[{chunk_id:"C1",text:"V2I communication allows trucks to receive signal phase and timing data."},{chunk_id:"C2",text:"By minimizing idle time at intersections, V2I reduces fuel consumption by fifteen percent."},{chunk_id:"C3",text:"Autonomous trucks use lidar and radar for obstacle detection."}],correct_chunks:["C1","C2"]},
  {question:"How does ASRS improve warehouse storage efficiency?",reference:"ASRS optimizes vertical warehouse space by using high-speed cranes to retrieve pallets from double-deep racking systems with two millimeter accuracy.",chunks:[{chunk_id:"C1",text:"ASRS optimizes vertical warehouse space using high-speed cranes."},{chunk_id:"C2",text:"Cranes retrieve pallets from double-deep racking systems with two millimeter accuracy."},{chunk_id:"C3",text:"Manual forklifts are still used for short distance transport."}],correct_chunks:["C1","C2"]},
  {question:"What is the protocol for temperature excursions in seafood cold chains?",reference:"A temperature excursion occurs when the temperature rises above minus fifteen degrees Celsius for over thirty minutes, triggering an audible alarm and SMS.",chunks:[{chunk_id:"C1",text:"Frozen seafood must be maintained at constant temperature of minus twenty degrees Celsius."},{chunk_id:"C2",text:"An excursion is triggered if temperature rises above minus fifteen degrees for over thirty minutes."},{chunk_id:"C3",text:"SMS and audible alarms are sent immediately upon excursion detection."}],correct_chunks:["C2","C3"]},
  {question:"How do ethylene scrubbers prevent premature ripening of bananas?",reference:"Ethylene scrubbers maintain ethylene levels below 0.1 parts per million in ripening rooms, preventing premature ripening during transit.",chunks:[{chunk_id:"C1",text:"Banana ripening is accelerated by ethylene gas concentrations."},{chunk_id:"C2",text:"Scrubbers maintain ethylene levels below 0.1 parts per million."},{chunk_id:"C3",text:"Relative humidity must be kept at ninety percent to prevent moisture loss."}],correct_chunks:["C2"]}
];

function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = seedrandom(`${SALT}#${o}#q-rag-evaluation-harness#data`);
  const s = [], m = [], d = {}, l = {};
  for (let e = 0; e < 96; e++) {
    const r = `T${String(e + 1).padStart(3, '0')}`;
    const c = TRACE_TEMPLATES[e % TRACE_TEMPLATES.length];
    const t = ` (ID: ${r})`;
    const a = c.question.replace("?", "") + t + "?";
    const h = c.reference + t;
    const u = c.chunks.map(p => ({ chunk_id: p.chunk_id, text: p.text + t }));
    const g = Math.floor(i() * 3);
    let w = "";
    if (g === 0) w = c.reference + t;
    else if (g === 1) w = c.chunks[0].text + ". However, " + c.chunks[2].text + t;
    else w = "The system operates using blockchain technology and quantum computing." + t;
    s.push({ trace_id: r, question: a, retrieved_chunks: u, generated_answer: w });
    m.push({ trace_id: r, reference_answer: h, relevant_chunk_ids: c.correct_chunks });
    const y = [], k = [];
    const b = seedrandom(`${SALT}#${o}#q2#embed#${r}`);
    const f = g === 2 ? 0.3 : 0.85;
    for (let p = 0; p < 50; p++) {
      const x = b() * 2 - 1;
      y.push(parseFloat(x.toFixed(4)));
      const v = (b() * 2 - 1) * (1 - f);
      k.push(parseFloat((x * f + v).toFixed(4)));
    }
    d[r] = y; l[r] = k;
  }
  return { traces: s, ground_truth: m, question_embeddings: d, answer_embeddings: l };
}

function tokenize(text) {
  return (text.toLowerCase().match(/\b[a-z0-9]+\b/g) || []);
}

function overlap(a, b) {
  const ta = tokenize(a), tb = new Set(tokenize(b));
  if (ta.length === 0) return 0;
  let interCount = 0;
  for (const t of ta) { if (tb.has(t)) interCount++; }
  return interCount / ta.length;
}

function splitSentences(text) {
  return text.split(/[.!?]\s+/).map(s => s.trim()).filter(s => s.length > 5);
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function round2(x) { return Math.round(x * 100) / 100; }

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = generateDataset(norm);
  const { traces, ground_truth, question_embeddings, answer_embeddings } = data;
  const gtMap = new Map(ground_truth.map(g => [g.trace_id, g]));

  const answer = {};
  for (const tr of traces) {
    const gt = gtMap.get(tr.trace_id);

    // Faithfulness
    const genSentences = splitSentences(tr.generated_answer);
    let faithfulCount = 0;
    for (const sent of genSentences) {
      let maxOverlap = 0;
      for (const ch of tr.retrieved_chunks) {
        const ov = overlap(sent, ch.text);
        if (ov > maxOverlap) maxOverlap = ov;
      }
      if (maxOverlap >= 0.5) faithfulCount++;
    }
    const faithfulness = genSentences.length > 0 ? faithfulCount / genSentences.length : 0;

    // Answer Relevance
    const qEmb = question_embeddings[tr.trace_id];
    const aEmb = answer_embeddings[tr.trace_id];
    const answerRelevance = cosine(qEmb, aEmb);

    // Context Recall
    const refSentences = splitSentences(gt.reference_answer);
    const concatChunks = tr.retrieved_chunks.map(c => c.text).join(' ');
    let recalledCount = 0;
    for (const sent of refSentences) {
      const ov = overlap(sent, concatChunks);
      if (ov >= 0.5) recalledCount++;
    }
    const contextRecall = refSentences.length > 0 ? recalledCount / refSentences.length : 0;

    // Context Precision
    const totalRelevant = gt.relevant_chunk_ids.length;
    let cp = 0;
    if (totalRelevant > 0) {
      let relevantSoFar = 0;
      let sumPrecRel = 0;
      tr.retrieved_chunks.forEach((c, i) => {
        const rel = gt.relevant_chunk_ids.includes(c.chunk_id) ? 1 : 0;
        if (rel) relevantSoFar++;
        const precAtI = relevantSoFar / (i + 1);
        sumPrecRel += precAtI * rel;
      });
      cp = sumPrecRel / totalRelevant;
    }

    answer[tr.trace_id] = {
      faithfulness: round2(faithfulness),
      answer_relevance: round2(answerRelevance),
      context_recall: round2(contextRecall),
      context_precision: round2(cp)
    };
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `RAG evaluation metrics for ${norm}`,
    answerDisplay: [
      `### Q2: RAG Evaluation Harness`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
