import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-rag-chunking-hybrid-search-server';
export const title = 'Q1: End-to-End Chunking & Hybrid Retrieval Pipeline';

const SALT = 'tds-ga4-q1-data-484877bff41818b2ff1c545a889b81a3a7f9cd8ce89d9d02';

const DOC_TEMPLATES = [
  {title:"Autonomous Fleet Routing and Dispatch",sections:[{header:"Dynamic Route Optimization",paragraphs:["Autonomous dispatch systems utilize real-time traffic feeds and weather alerts to recalculate optimal paths. By analyzing congestion patterns, the fleet manager can redirect vehicles to alternative corridors.","Vehicle-to-Infrastructure (V2I) communication allows trucks to receive signal phase and timing data. This minimizes idle time at intersections and reduces fuel consumption by up to fifteen percent.","Route deviation alerts are triggered when an autonomous vehicle departs from its pre-planned corridor by more than two hundred meters. Emergency halting is initiated if telemetry connection is lost for ten seconds."]},{header:"Battery and Charging Management",paragraphs:["Electric delivery vans must schedule charging stops when battery state of charge drops below twenty percent. Smart grid integration ensures vehicles charge during off-peak hours to minimize operational costs.","High-power DC fast chargers can replenish battery capacity from ten to eighty percent in twenty-five minutes. Frequent fast charging, however, accelerates battery degradation by twelve percent annually.","Thermal management systems regulate battery temperature during charging cycles. Optimal performance is maintained between twenty and thirty-five degrees Celsius."]}]},
  {title:"Automated Warehouse Inventory Control",sections:[{header:"ASRS Integration and Throughput",paragraphs:["Automated Storage and Retrieval Systems (ASRS) optimize vertical warehouse space. High-speed cranes retrieve pallets from double-deep racking systems with a positioning accuracy of two millimeters.","System throughput is measured in dual-cycles per hour, representing simultaneous storage and retrieval operations. The target efficiency is ninety-five cycles per hour under peak loads.","Safety light curtains are installed at all ASRS entry points. Any beam interruption immediately cuts power to the drive motors within fifty milliseconds."]},{header:"RFID Tracking and Discrepancy Resolution",paragraphs:["RFID portals at dock doors scan incoming pallets automatically. The system compares scanned item counts against the digital shipping manifest in real-time.","Discrepancies exceeding five units trigger an automated quarantine workflow. Warehouse staff are notified via handheld terminals to perform a manual count within fifteen minutes.","Metal-mount RFID tags are required for all liquid containers and metallic parts. Standard paper tags suffer from signal attenuation when placed directly on conductive surfaces."]}]},
  {title:"Predictive Maintenance for Logistics Assets",sections:[{header:"Vibration Analysis on Conveyor Belts",paragraphs:["Accelerometers mounted on conveyor drive shafts monitor vibration frequencies. An increase in the acceleration envelope indicates bearing wear or misalignment.","Spectral analysis identifies outer race defects when frequency peaks match calculated bearing frequencies. Maintenance should be scheduled when amplitude exceeds 0.5 inches per second.","Belt tension is monitored via load cells. Automatic tensioning systems adjust belt slack to maintain a constant tension of four hundred Newtons."]},{header:"Forklift Telemetry and Diagnostic Codes",paragraphs:["On-board diagnostics track forklift operating parameters including hydraulic pressure and motor temperature. Code E102 indicates hydraulic fluid temperature exceeding ninety degrees Celsius.","Forklifts must undergo safety inspections every two hundred operating hours. The system automatically restricts maximum travel speed to three kilometers per hour if inspection is overdue.","Regenerative braking systems recover energy during deceleration. This increases overall battery runtime by eight percent per shift."]}]},
  {title:"Cold Chain Monitoring and Quality Assurance",sections:[{header:"Temperature Excursion Protocols",paragraphs:["Refrigerated trailers must maintain a constant temperature of minus twenty degrees Celsius for frozen seafood. Temperature sensors log readings every five minutes.","A temperature excursion occurs when the temperature rises above minus fifteen degrees Celsius for more than thirty consecutive minutes. This triggers an audible alarm and SMS notification.","Dry ice sublimation rates are calculated based on external temperature. Standard insulated shippers require two kilograms of dry ice per twenty-four hours of transit."]},{header:"Ethylene Gas and Ripening Control",paragraphs:["Ethylene scrubbers in banana ripening rooms regulate gas concentrations. Maintaining ethylene levels below 0.1 parts per million prevents premature ripening during transport.","Controlled atmosphere containers adjust oxygen and carbon dioxide levels. Reducing oxygen to three percent extends the shelf life of green produce by two weeks.","Relative humidity must be maintained at ninety percent to prevent moisture loss and shriveling. Dehumidification cycles are initiated if humidity exceeds ninety-five percent."]}]}
];

const QUERY_TEMPLATES = [
  {text:"How does V2I communication reduce fuel consumption?"},
  {text:"What happens when an autonomous vehicle departs from its corridor?"},
  {text:"At what battery charge level should electric vans schedule charging?"},
  {text:"How fast can DC fast chargers replenish battery capacity?"},
  {text:"What is the positioning accuracy of ASRS cranes?"},
  {text:"What triggers the automated quarantine workflow for RFID?"},
  {text:"When should maintenance be scheduled based on vibration analysis?"},
  {text:"What does forklift diagnostic code E102 indicate?"},
  {text:"What is the temperature excursion protocol for seafood?"},
  {text:"How do ethylene scrubbers affect banana ripening?"}
];

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = seedrandom(`${SALT}#${o}#q-rag-chunking-hybrid-search#data`);
  const s = o.split('').reduce((b, f) => Math.imul(31, b) + f.charCodeAt(0) | 0, 0);
  const m = Math.abs(s) % 97;
  const d = shuffle(DOC_TEMPLATES, i);
  const l = [];
  for (let b = 0; b < 64; b++) {
    const f = d[b % d.length];
    const p = `DOC_${b + 1}`;
    const x = m + b;
    let v = `# ${f.title} (Rev ${b + 1}-${m})\n\n`;
    f.sections.forEach(_ => {
      v += `## ${_.header}\n\n`;
      _.paragraphs.forEach(S => {
        const $ = S.replace("fifteen percent", `${x % 20 + 8} percent`)
          .replace("two hundred meters", `${x * 3 % 150 + 100} meters`)
          .replace("twenty percent", `${x % 15 + 10}%`)
          .replace("ninety-five cycles", `${x % 15 + 80} cycles`)
          .replace("five units", `${x % 7 + 2} units`)
          .replace("twelve percent", `${x % 10 + 8} percent`)
          .replace("twenty-five minutes", `${x % 20 + 15} minutes`)
          .replace("ten seconds", `${x % 8 + 5} seconds`);
        v += `${$}\n\n`;
      });
    });
    l.push({ doc_id: p, title: `${f.title} (V${b + 1})`, text: v.trim() });
  }
  const e = "sentence";
  const r = 2 + Math.floor(i() * 2);
  const c = 1;
  const h = { strategy: e, chunk_size: r, overlap: c, rrf_k: 60, top_k: 5 };
  const u = [];
  l.forEach(b => {
    const f = b.text.split(/[.!?]\s+/).map(p => p.trim()).filter(p => p.length > 0);
    for (let p = 0; p < f.length; p += r - c) {
      const x = f.slice(p, p + r);
      if (x.length === 0) break;
      u.push({ chunk_id: `${b.doc_id}_CHUNK_${String(u.length).padStart(3, '0')}`, text: x.join('. ') + '.' });
      if (p + r >= f.length) break;
    }
  });
  const g = {};
  u.forEach(b => {
    const f = [];
    const p = seedrandom(`${SALT}#${o}#q1#chunk#${b.chunk_id}`);
    for (let x = 0; x < 100; x++) f.push(parseFloat((p() * 2 - 1).toFixed(4)));
    g[b.chunk_id] = f;
  });
  const w = [], y = {};
  const k = QUERY_TEMPLATES;
  for (let b = 0; b < 80; b++) {
    const f = k[b % k.length];
    const p = `Q${String(b + 1).padStart(3, '0')}`;
    const x = `${f.text} (Ref: ${p})`;
    w.push({ query_id: p, text: x });
    const v = [];
    const _ = seedrandom(`${SALT}#${o}#q1#query#${p}`);
    for (let S = 0; S < 100; S++) v.push(parseFloat((_() * 2 - 1).toFixed(4)));
    y[p] = v;
  }
  return { documents: l, chunk_rules: h, chunks: u, chunk_embeddings: g, queries: w, query_embeddings: y };
}

function tokenize(text) {
  return (text.toLowerCase().match(/\b[a-z0-9]+\b/g) || []);
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function bm25Rank(queryTokens, chunks, k1 = 1.5, b = 0.75) {
  const N = chunks.length;
  const docTokens = chunks.map(c => tokenize(c.text));
  const df = new Map();
  const uniqQ = [...new Set(queryTokens)];
  uniqQ.forEach(t => {
    let count = 0;
    docTokens.forEach(dt => { if (dt.includes(t)) count++; });
    df.set(t, count);
  });
  const avgdl = docTokens.reduce((s, dt) => s + dt.length, 0) / N;
  const scores = chunks.map((c, idx) => {
    const dt = docTokens[idx];
    let score = 0;
    uniqQ.forEach(t => {
      const dfT = df.get(t) || 0;
      const idf = Math.log((N - dfT + 0.5) / (dfT + 0.5) + 1);
      const f = dt.filter(x => x === t).length;
      if (f === 0) return;
      score += idf * f * (k1 + 1) / (f + k1 * (1 - b + b * dt.length / avgdl));
    });
    return { chunk_id: c.chunk_id, score };
  });
  return scores;
}

function rankByScore(scores) {
  return [...scores].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.chunk_id.localeCompare(b.chunk_id);
  });
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = generateDataset(norm);
  const { chunks, chunk_embeddings, queries, query_embeddings, chunk_rules } = data;
  const rrf_k = chunk_rules.rrf_k, top_k = chunk_rules.top_k;

  const answer = {};
  for (const q of queries) {
    const qTokens = tokenize(q.text);
    const bm25Scores = bm25Rank(qTokens, chunks);
    const bm25Ranked = rankByScore(bm25Scores);
    const qEmb = query_embeddings[q.query_id];
    const cosScores = chunks.map(c => ({ chunk_id: c.chunk_id, score: cosine(qEmb, chunk_embeddings[c.chunk_id]) }));
    const cosRanked = rankByScore(cosScores);

    const rankSparse = new Map();
    bm25Ranked.forEach((c, idx) => rankSparse.set(c.chunk_id, idx + 1));
    const rankDense = new Map();
    cosRanked.forEach((c, idx) => rankDense.set(c.chunk_id, idx + 1));

    const rrfScores = chunks.map(c => {
      const rs = rankSparse.get(c.chunk_id);
      const rd = rankDense.get(c.chunk_id);
      let score = 0;
      if (rs !== undefined) score += 1 / (rrf_k + rs);
      if (rd !== undefined) score += 1 / (rrf_k + rd);
      return { chunk_id: c.chunk_id, score };
    });
    rrfScores.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.chunk_id.localeCompare(b.chunk_id);
    });
    answer[q.query_id] = rrfScores.slice(0, top_k).map(c => c.chunk_id);
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `RAG chunking/hybrid search mapping for ${norm}`,
    answerDisplay: [
      `### Q1: End-to-End Chunking & Hybrid Retrieval Pipeline`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
