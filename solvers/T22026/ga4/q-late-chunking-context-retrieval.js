import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-late-chunking-context-retrieval-server';
export const title = 'Late Chunking with Contextual Retrieval';

const SALT = 'tds-ga4-late-chunking-data-2b5414d4e08627bc19dffa210e83013d3b48245376cd160b797d6f4ba22d4bd43e2eb9a2d6c3c0b57c04fdfaa8cc016d';

const B = ["admissions", "course_catalog", "fees", "identity", "proctoring", "scholarships", "support", "transcripts"];
const REGIONS = ["apac", "emea", "latam", "na"];
const RELEASES = ["2026.05", "2026.06", "2026.07", "2026.08"];
const OWNERS = ["argo", "banyan", "cedar", "drona", "ember", "falcon", "gingko", "helios"];
const HEADINGS = ["Policy Exceptions", "Escalation Timers", "Evidence Windows", "Retry Controls", "Audit Labels", "Status Mapping"];
const ACTIONS = ["refresh the derived status before sending the answer", "attach the last verified event as supporting evidence", "route the request through the regional reviewer queue", "suppress stale draft notes from the final context", "prefer the section-level rule over global boilerplate", "raise a manual review flag when evidence is older than the limit"];
const MARKERS = ["amber", "bronze", "cobalt", "delta", "ember", "fennel", "granite", "harbor", "indigo", "juniper", "kepler", "lumen"];

function pad(n, w) { return String(n).padStart(w, '0'); }

function fnv1aLike(str) {
  return String(str || '').trim().toLowerCase().split('').reduce((o, i) => (Math.imul(o, 33) + i.charCodeAt(0)) >>> 0, 5381);
}

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

function buildSentences({ service, region, release, heading, owner, priority, docIndex, sectionIndex, emailNumber: r }, l, e) {
  const c = 12 + (r + l + e) % 9;
  const t = 2 + (r + l * 3 + e) % 7;
  const a = 40 + (r + l + e * 5) % 45;
  const h = MARKERS[(r + l + e) % MARKERS.length];
  const u = MARKERS[(r + l + e + 5) % MARKERS.length];
  const g = ACTIONS[(r + l + e) % ACTIONS.length];
  const markerRng = seedrandom(`${service}-${region}`);
  return [
    `The ${h} marker appears in many handbooks, but this ${heading.toLowerCase()} rule is scoped only to ${service} in ${region}.`,
    `For release ${release}, ${owner} must ${g} when the status age is above ${c} hours.`,
    `The answer should cite the local section before quoting the global handbook because the handbook omits the ${region} override.`,
    `A late chunk that carries the title and section metadata can distinguish ${service} from the similarly worded ${pick(B, markerRng)} memo.`,
    `If the request mentions signal ${u}, keep it in the candidate set but do not promote it unless the service and region also match.`,
    `The escalation timer is ${t} business days and the stale evidence threshold is ${a} minutes.`,
    `Operators should mark priority ${priority} on the retrieval trace so rerankers can explain why the section was selected.`,
    `When two chunks have identical body text, the chunk with release ${release} wins only if its contextual header names ${service} and ${region}.`
  ];
}

export function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = fnv1aLike(o);
  const s = seedrandom(`${SALT}#${o}#late-context-data`);
  const m = [], d = [];
  for (let t = 0; t < 32; t++) {
    const a = B[(t + i) % B.length];
    const h = REGIONS[(t + Math.floor(i / 7)) % REGIONS.length];
    const u = RELEASES[(t + Math.floor(i / 11)) % RELEASES.length];
    const g = { doc_id: `LC_DOC_${pad(t + 1, 3)}`, title: `${a.replace('_', ' ')} retrieval handbook ${pad(t + 1, 3)}`, region: h, release: u, sections: [] };
    for (let w = 0; w < 5; w++) {
      const y = HEADINGS[(t + w + i) % HEADINGS.length];
      const k = OWNERS[(t * 2 + w + i) % OWNERS.length];
      const b = 1 + (t + w + i) % 5;
      const f = B[(t + w + i) % B.length];
      const p = buildSentences({ service: f, region: h, release: u, heading: y, owner: k, priority: b, docIndex: t, sectionIndex: w, emailNumber: i }, t, w);
      const x = { section_id: `S${pad(w + 1, 2)}`, heading: y, service: f, owner: k, priority: b, sentences: p };
      g.sections.push(x);
      d.push({ doc: g, section: x, sentence: p[1], targetIndex: 1 });
    }
    m.push(g);
  }
  const l = [], seen = new Set();
  while (l.length < 28) {
    const t = Math.floor(s() * d.length);
    if (!seen.has(t)) { seen.add(t); l.push(d[t]); }
  }
  const r = l.map((t, a) => ({
    query_id: `LC_Q_${pad(a + 1, 3)}`,
    text: `Find the late chunk that explains what ${t.section.owner} must do for ${t.section.service} ${t.section.heading.toLowerCase()} in ${t.doc.region}.`,
    service: t.section.service,
    region: t.doc.region,
    release: t.doc.release,
    priority: t.section.priority
  }));
  return {
    documents: m,
    queries: r,
    rules: {
      chunk_sentence_count: 4,
      chunk_sentence_overlap: 1,
      top_k: 4,
      bm25_k1: 1.2,
      bm25_b: 0.75,
      contextual_template: "{title} {region} {release} {heading} {service} {owner} priority-{priority} {chunk_text}",
      query_template: "{text} {service} {region} {release} priority-{priority}"
    }
  };
}

function tokenize(text) {
  return (text.toLowerCase().match(/\b[a-z0-9_]+\b/g) || []);
}

function fillTemplate(tpl, vars) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = generateDataset(norm);
  const { documents, queries, rules } = data;
  const { chunk_sentence_count: csc, chunk_sentence_overlap: cso, top_k, bm25_k1: k1, bm25_b: b } = rules;

  // Build chunks: sliding window over sentences per section
  const chunks = [];
  documents.forEach(doc => {
    doc.sections.forEach(section => {
      const sents = section.sentences;
      let w = 0;
      for (let p = 0; p < sents.length; p += csc - cso) {
        const window = sents.slice(p, p + csc);
        if (window.length === 0) break;
        const chunkText = window.join(' ');
        const chunkId = `${doc.doc_id}:${section.section_id}:w${pad(w, 2)}`;
        const contextualText = fillTemplate(rules.contextual_template, {
          title: doc.title, region: doc.region, release: doc.release, heading: section.heading,
          service: section.service, owner: section.owner, priority: section.priority, chunk_text: chunkText
        });
        chunks.push({ chunk_id: chunkId, text: contextualText });
        w++;
        if (p + csc >= sents.length) break;
      }
    });
  });

  const docTokens = chunks.map(c => tokenize(c.text));
  const N = chunks.length;
  const avgdl = docTokens.reduce((s, dt) => s + dt.length, 0) / N;

  const answer = {};
  for (const q of queries) {
    const queryText = fillTemplate(rules.query_template, {
      text: q.text, service: q.service, region: q.region, release: q.release, priority: q.priority
    });
    const qTokens = tokenize(queryText);
    const uniqQ = [...new Set(qTokens)];
    const df = new Map();
    uniqQ.forEach(t => {
      let count = 0;
      docTokens.forEach(dt => { if (dt.includes(t)) count++; });
      df.set(t, count);
    });
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
    scores.sort((a2, b2) => {
      if (b2.score !== a2.score) return b2.score - a2.score;
      return a2.chunk_id.localeCompare(b2.chunk_id);
    });
    answer[q.query_id] = scores.slice(0, top_k).map(s => s.chunk_id);
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `Late chunking retrieval mapping for ${norm}`,
    answerDisplay: [
      `### Late Chunking with Contextual Retrieval`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
