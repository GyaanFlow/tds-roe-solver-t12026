// Solver: Flaw Priority Ranking — EXACT RNG replication from exam source
import { normalizeEmail } from './utils.js';

export const id = 'q-flaw-priority-ranking';
export const title = 'Flaw Priority Ranking';

// Exact severity function from exam: ni(e,r)
function ni(e, r) { return e >= 80 || (e >= 70 && r >= 70) ? "S1" : e >= 50 ? "S2" : "S3"; }

export function solve(email) {
  const norm = normalizeEmail(email);
  const n = new Math.seedrandom(`${norm}#${id}`);

  // Exact arrays from exam
  const a = ["slide-design","data-accuracy","narrative-flow","visual-hierarchy","colour-usage","typography","annotation","chart-choice","audience-fit","source-citation"];
  const l = ["alice","bob","carol","dave","eve","frank","grace","heidi","ivan","judy"];
  const i = ["Axis label missing on secondary chart","Legend overlaps data region","Slide title does not match content","Font size below 14pt on key slide","Colour contrast fails WCAG AA","Bar chart baseline not at zero","No source cited for key statistic","Dual-axis scale distorts comparison","Bullet text exceeds 7 lines","Inconsistent rounding across slides","Gradient background reduces readability","Incorrect percentage in executive summary","Chart type inappropriate for time series","Annotation arrow points to wrong bar","Speaker notes absent on complex slide","Data labels overlap adjacent bars","Title slide missing presenter name","Pie chart has more than 6 slices","Y-axis does not start at consistent value","Transition animation distracts from content"];

  // Exact helpers
  const s = (m, y) => m + Math.floor(n() * (y - m + 1));
  const d = m => m[Math.floor(n() * m.length)];
  const c = m => { n(); n(); return m; }; // pad: 2 RNG
  const x = () => { let m = Math.floor(n() * i.length); return i[m]; }; // description picker: 1 RNG

  const u = 15;
  const p = ["S1","S1","S1","S2","S2","S2","S3","S3","S3","decoy","decoy","decoy","decoy","decoy","decoy"];
  const R = [];

  // EXACT loop from exam
  for (let m = 0; m < u; m++) {
    let y = p[m], h, b, C;
    if (y === "S1") { h = s(82, 100); b = s(15, 100); C = 1; }
    else if (y === "S2") { h = s(52, 68); b = s(10, 100); C = 1; }
    else if (y === "S3") { h = s(5, 45); b = s(10, 95); C = 1; }
    else { h = s(40, 98); b = s(40, 98); C = 0; }

    // Metadata — exact RNG order from exam
    let E = `FP-${String(m + 1).padStart(3, "0")}`;
    let D = s(1, 30);       // slideNo -> 1 RNG
    let L = d(a);            // category -> 1 RNG
    let P = x();             // description -> 1 RNG
    let q = d(l);            // reporter -> 1 RNG
    let F_round = s(1, 4);   // round -> 1 RNG
    let F_ticket = s(1e3, 9999); // ticket# -> 1 RNG

    // Padding for XLSX — 9 c() calls = 18 RNG
    c(E); c(String(D)); c(L); c(P); c(q); c(String(h)); c(String(b)); c(String(C)); c('');

    R.push({ impact: h, frequency: b, isReal: C });
  }

  // Shuffle — exact same as exam
  for (let m = u - 1; m > 0; m--) {
    let y = Math.floor(n() * (m + 1));
    [R[m], R[y]] = [R[y], R[m]];
  }

  // Assign display IDs
  R.forEach((m, y) => { m.displayId = y + 1; });

  // Compute answer
  const M = { S1: 3, S2: 2, S3: 1 };
  const w = R.filter(m => m.isReal === 1)
    .map(m => ({
      displayId: m.displayId,
      severity: ni(m.impact, m.frequency),
      impact: m.impact,
      frequency: m.frequency,
    }))
    .sort((m, y) => {
      let h = M[y.severity] - M[m.severity];
      if (h !== 0) return h;
      if (y.impact !== m.impact) return y.impact - m.impact;
      return y.frequency - m.frequency;
    });

  const tuples = w.map(r => `(${r.displayId}, "${r.severity}")`).join(', ');
  return {
    variant: `${w.length} real flaws | S1: ${w.filter(r=>r.severity==='S1').length}, S2: ${w.filter(r=>r.severity==='S2').length}, S3: ${w.filter(r=>r.severity==='S3').length} | ${u - w.length} decoys excluded`,
    answer: `[${tuples}]`
  };
}
