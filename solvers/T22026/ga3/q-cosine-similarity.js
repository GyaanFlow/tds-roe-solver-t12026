import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-cosine-similarity-server';
export const title = 'Q5: Cosine Similarity Search';

const B = {
  ML: ["neural", "gradient", "backprop", "loss", "epoch", "batch", "model", "train", "feature", "weight", "activation", "layer", "dropout", "learning", "inference", "embedding", "transformer", "attention"],
  DATA: ["query", "database", "index", "schema", "table", "row", "column", "join", "aggregate", "filter", "pipeline", "etl", "warehouse", "stream", "batch", "partition", "shard", "replica"],
  WEB: ["http", "request", "response", "cache", "cookie", "session", "token", "api", "endpoint", "rest", "graphql", "websocket", "latency", "throughput", "bandwidth", "proxy", "cdn", "tls"],
  MATH: ["vector", "matrix", "eigenvalue", "integral", "derivative", "probability", "distribution", "variance", "covariance", "correlation", "regression", "hypothesis", "bayes", "entropy", "gradient", "manifold"],
  CLOUD: ["container", "kubernetes", "docker", "pod", "service", "deployment", "scaling", "ingress", "node", "cluster", "autoscale", "loadbalancer", "microservice", "serverless", "function", "bucket", "volume"]
};

const U = Object.keys(B);
const M = 64;
const H = 250;
const J = 10;

function eo(e) {
  let n = 0, r = 0;
  while (n === 0) n = e();
  while (r === 0) r = e();
  return Math.sqrt(-2 * Math.log(n)) * Math.cos(2 * Math.PI * r);
}

function xe(e, n) {
  let r = Array.from({ length: n }, () => eo(e));
  let t = Math.sqrt(r.reduce((d, u) => d + u * u, 0));
  return r.map(d => d / t);
}

function be(e, n, r) {
  let t = xe(e, r);
  let d = n.map((i, o) => i * 0.85 + t[o] * 0.15);
  let u = Math.sqrt(d.reduce((i, o) => i + o * o, 0));
  return d.map(i => i / u);
}

function generateDataset(email) {
  const norm = normalizeEmail(email);
  const salt = 'tds-2026-05-ga3-cosine-sim-client-v1';
  const t = seedrandom(`${salt}#${norm}#`);
  
  const d = {};
  for (const o of U) {
    d[o] = xe(t, M);
  }
  
  const u = [];
  for (let o = 0; o < H; o++) {
    const l = U[o % U.length];
    const c = be(t, d[l], M);
    const a = B[l];
    const s = Array.from({ length: 4 }, () => a[Math.floor(t() * a.length)]);
    u.push({
      doc_id: `D${String(o + 1).padStart(6, '0')}`,
      topic: l,
      title: s.join(' ') + ' overview',
      embedding: c
    });
  }
  
  const i = [];
  for (let o = 0; o < J; o++) {
    const l = U[o % U.length];
    const c = be(t, d[l], M);
    const a = B[l];
    const s = Array.from({ length: 3 }, () => a[Math.floor(t() * a.length)]);
    i.push({
      query_id: `Q${String(o + 1).padStart(3, '0')}`,
      query_text: s.join(' ') + ' techniques',
      embedding: c
    });
  }
  
  return { documents: u, queries: i };
}

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const dataset = generateDataset(norm);
  
  const answer = {};
  
  for (const query of dataset.queries) {
    const qEmbed = query.embedding;
    const scoredDocs = dataset.documents.map(doc => {
      // Since both are unit vectors, cosine similarity is just the dot product
      let dot = 0;
      for (let k = 0; k < M; k++) {
        dot += qEmbed[k] * doc.embedding[k];
      }
      return {
        doc_id: doc.doc_id,
        score: dot
      };
    });
    
    // Sort descending by score, tie-break by doc_id ascending
    scoredDocs.sort((a, b) => {
      const diff = b.score - a.score;
      if (Math.abs(diff) > 1e-9) {
        return diff;
      }
      return a.doc_id.localeCompare(b.doc_id);
    });
    
    answer[query.query_id] = scoredDocs.slice(0, 5).map(d => d.doc_id);
  }

  return {
    type: 'solved',
    answer: JSON.stringify(answer, null, 2),
    variant: `Cosine Similarity mappings for ${norm}`,
    answerDisplay: [
      `### Q5: Cosine Similarity Search Results`,
      `\`\`\`json`,
      JSON.stringify(answer, null, 2),
      `\`\`\``
    ].join('\n')
  };
}
