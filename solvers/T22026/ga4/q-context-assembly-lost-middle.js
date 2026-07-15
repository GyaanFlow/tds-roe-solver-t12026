import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-context-assembly-lost-middle-server';
export const title = 'Context Assembly: Beating Lost-in-the-Middle';

const SALT = 'tds-ga4-context-assembly-data-271d73ad9bab61b3517cb379323b28edc716443bd31059bdafc8e7b17bd944fc5bec2f3ba9986e34e47d23f992d68767';
const NUM_QUERIES = 45;

function pad(n, w) { return String(n).padStart(w, '0'); }

function generateDataset(email) {
  const o = normalizeEmail(email);
  const i = seedrandom(`${SALT}#${o}#context-assembly-data`);
  const s = [];
  for (let d = 0; d < NUM_QUERIES; d++) {
    const l = 15 + Math.floor(i() * 16);
    const e = [];
    let r = 0;
    for (let a = 0; a < l; a++) {
      const h = 80 + Math.floor(i() * 321);
      const u = Number(i().toFixed(4));
      r += h;
      e.push({ chunk_id: `CTX_${pad(d + 1, 3)}_${pad(a + 1, 3)}`, token_count: h, relevance_score: u });
    }
    const c = 0.35 + d % 7 * 0.05;
    const t = Math.round(r * c);
    s.push({ query_id: `CA_Q_${pad(d + 1, 3)}`, token_budget: t, candidate_chunks: e });
  }
  return { queries: s };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const data = generateDataset(norm);

  const answer = {};
  for (const q of data.queries) {
    const sorted = [...q.candidate_chunks].sort((a, b) => {
      if (b.relevance_score !== a.relevance_score) return b.relevance_score - a.relevance_score;
      return a.chunk_id.localeCompare(b.chunk_id);
    });
    const selected = [];
    let remaining = q.token_budget;
    for (const c of sorted) {
      if (c.token_count <= remaining) {
        selected.push(c);
        remaining -= c.token_count;
      }
    }
    // Outside-in serpentine placement
    const n = selected.length;
    const result = new Array(n);
    let lo = 0, hi = n - 1;
    for (let idx = 0; idx < n; idx++) {
      if (idx % 2 === 0) {
        result[lo] = selected[idx];
        lo++;
      } else {
        result[hi] = selected[idx];
        hi--;
      }
    }
    answer[q.query_id] = result.map(c => c.chunk_id);
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer),
    variant: `Context assembly ordering for ${norm}`,
    answerDisplay: [
      `### Context Assembly: Beating Lost-in-the-Middle`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2).slice(0, 2000),
      `\`\`\``
    ].join('\n')
  };
}
