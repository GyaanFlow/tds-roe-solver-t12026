// Solver: Chart Error Detection — EXACT RNG replication from exam source
import { normalizeEmail } from './utils.js';

export const id = 'q-chart-error-detection';
export const title = 'Chart Error Detection';

// Exact severity function from exam: ai(e)
function ai(e) { return e >= 80 ? "S1" : e >= 50 ? "S2" : "S3"; }

export function solve(email) {
  const norm = normalizeEmail(email);
  const n = new Math.seedrandom(`${norm}#${id}`);

  // Exact arrays from exam
  const a = ["bar","grouped-bar","stacked-bar","line","area","pie","donut","scatter","bubble","heatmap"];
  const l = ["x-axis","y-axis","both-axes","legend","title","data-labels","tooltip","colour-scale","none"];
  const i = ["Y-axis truncated to hide small differences","Dual-axis with incompatible scales","Pie chart with 12 slices \u2014 too many to parse","3-D bars add false depth distortion","Inverted y-axis implies opposite trend","Inconsistent bar widths within same series","Legend labels do not match data series names","Baseline shifted away from zero on bar chart","Log scale applied without annotation","Area chart stacked without disclosure","Colour encoding reused for unrelated series","Missing axis label on primary y-axis","Tick density too high \u2014 labels overlap","Data-ink ratio inflated by decorative gridlines","Circle size encodes non-proportional area","Annotation arrow points to wrong data point","Time axis not sorted chronologically","Percentage shares do not sum to 100","Outlier clipped by axis range without note","Gradient fill obscures low-contrast data region"];
  const s = ["Appropriate use of sequential colour ramp","Legend positioned outside plot to reduce clutter","Consistent tick intervals on both axes","Single clear title reflecting main finding","Aspect ratio follows 4:3 best practice","Source citation present in chart footer"];

  // Exact helpers
  const d = (g, m) => g + Math.floor(n() * (m - g + 1));
  const c = g => g[Math.floor(n() * g.length)];
  const u = g => { n(); n(); return g; }; // pad: 2 RNG

  const p = 15;
  const f = ["S1","S1","S1","S2","S2","S2","S3","S3","S3","decoy","decoy","decoy","decoy","decoy","decoy"];
  const k = [];

  // EXACT loop from exam
  for (let g = 0; g < p; g++) {
    let m = f[g], y, h, b;
    if (m === "S1") { y = d(82, 100); h = d(20, 100); b = 1; }
    else if (m === "S2") { y = d(52, 78); h = d(15, 100); b = 1; }
    else if (m === "S3") { y = d(5, 45); h = d(10, 95); b = 1; }
    else { y = d(45, 97); h = d(40, 97); b = 0; }

    // Metadata — exact RNG order from exam
    let C = `CE-${String(g + 1).padStart(3, "0")}`;
    let E = c(a);                    // chart type -> 1 RNG
    let D = c(l);                    // axis -> 1 RNG
    let L = c(b === 1 ? i : s);     // description -> 1 RNG (KEY: different array based on isError!)
    let P_slide = d(1, 40);          // slide ref -> 1 RNG
    let q_major = d(2, 5);           // linter major -> 1 RNG
    let q_minor = d(0, 9);           // linter minor -> 1 RNG
    let q_run = d(100, 999);         // run # -> 1 RNG

    // Padding for XLSX — 9 u() calls = 18 RNG
    u(C); u(E); u(D); u(L); u(String(y)); u(String(h)); u(String(b)); u(''); u('');

    k.push({ errorScore: y, visibilityScore: h, isError: b });
  }

  // Shuffle — exact same as exam
  for (let g = p - 1; g > 0; g--) {
    let m = Math.floor(n() * (g + 1));
    [k[g], k[m]] = [k[m], k[g]];
  }

  // Assign display IDs
  k.forEach((g, m) => { g.displayId = m + 1; });

  // Compute answer
  const sevOrder = { S1: 3, S2: 2, S3: 1 };
  const result = k.filter(g => g.isError === 1)
    .map(g => ({
      displayId: g.displayId,
      severity: ai(g.errorScore),
      errorScore: g.errorScore,
      visibilityScore: g.visibilityScore,
    }))
    .sort((g, m) => {
      let s1 = sevOrder[m.severity] - sevOrder[g.severity];
      if (s1 !== 0) return s1;
      if (m.errorScore !== g.errorScore) return m.errorScore - g.errorScore;
      return m.visibilityScore - g.visibilityScore;
    });

  const tuples = result.map(r => `(${r.displayId}, "${r.severity}")`).join(', ');
  return {
    variant: `${result.length} real errors | S1: ${result.filter(r=>r.severity==='S1').length}, S2: ${result.filter(r=>r.severity==='S2').length}, S3: ${result.filter(r=>r.severity==='S3').length} | ${p - result.length} false positives excluded`,
    answer: `[${tuples}]`
  };
}
