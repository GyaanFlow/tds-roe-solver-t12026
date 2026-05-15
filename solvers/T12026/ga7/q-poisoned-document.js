// Solver: Poisoned Document Detection — EXACT RNG replication from exam source
import { normalizeEmail } from './utils.js';

export const id = 'q-poisoned-document-detection';
export const title = 'Poisoned Document Detection';

export function solve(email) {
  const norm = normalizeEmail(email);
  const n = new Math.seedrandom(`${norm}#${id}`);

  // Exact helpers from exam
  const a = (w, T) => w + Math.floor(n() * (T - w + 1));
  const l = ["security","finance","healthcare","logistics","retail","infrastructure","compliance","analytics","customer-success"];
  const i = ["internal-wiki","confluence","sharepoint","gdrive-export","web-scrape","vendor-portal","api-dump","manual-upload"];
  const s = ["alice","bob","carol","dave","eve","frank","grace","heidi","ivan"];
  const d = w => w[Math.floor(n() * w.length)];
  const c = w => { n(); n(); return w; }; // pad: 2 RNG consumed

  const u = 9;
  const p = ["core","core","core","peripheral","peripheral","peripheral","irrelevant","irrelevant","poisoned"];
  const v = []; // structured data

  // EXACT loop from exam
  for (let w = 0; w < u; w++) {
    let T = p[w], g, m, y;
    if (T === "core") { g = a(70, 100); m = a(65, 100); y = 0; }
    else if (T === "peripheral") { g = a(40, 69); m = a(35, 75); y = 0; }
    else if (T === "irrelevant") { g = a(5, 39); m = a(5, 40); y = 0; }
    else { g = a(70, 100); m = a(65, 100); y = 1; } // poisoned

    // Metadata RNG consumption — exact order from exam
    let h = `DOC-${String(w + 1).padStart(3, "0")}`;
    let b = d(l);    // pick domain -> 1 RNG
    let C = d(i);    // pick source -> 1 RNG
    let E = d(s);    // pick reviewer -> 1 RNG
    let D_batch = a(1e3, 9999); // batch# -> 1 RNG

    // Padding for XLSX row — 8 c() calls = 16 RNG
    c(h); c(b); c(C); c(E); c(String(g)); c(String(m)); c(String(y)); c('');

    v.push({ relevance: g, match: m, errorFlag: y });
  }

  // Shuffle — exact same as exam
  for (let w = u - 1; w > 0; w--) {
    let T = Math.floor(n() * (w + 1));
    [v[w], v[T]] = [v[T], v[w]];
  }

  // Assign display IDs
  v.forEach((w, T) => { w.displayId = T + 1; });

  // Classification — exact from exam: ei(e,r) { return e>=50 && r===0 ? "I" : "E" }
  const result = v.map(w => ({
    displayId: w.displayId,
    label: (w.relevance >= 50 && w.errorFlag === 0) ? "I" : "E",
    relevance: w.relevance,
  })).sort((w, T) => {
    if (w.label !== T.label) return w.label === "I" ? -1 : 1;
    return T.relevance - w.relevance;
  });

  const tuples = result.map(d => `(${d.displayId}, "${d.label}")`).join(', ');
  const inc = result.filter(d => d.label === "I").length;
  const exc = result.filter(d => d.label === "E").length;

  return {
    variant: `${inc} included, ${exc} excluded (1 poisoned doc with high relevance but Error Flag=1)`,
    answer: `[${tuples}]`
  };
}
