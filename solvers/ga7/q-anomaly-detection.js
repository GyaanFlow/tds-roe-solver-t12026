// Solver: Ranked Anomaly Detection — EXACT RNG replication from exam source
import { normalizeEmail } from './utils.js';

export const id = 'q-ranked-anomaly-detection';
export const title = 'Ranked Anomaly Detection';

// Deviation and severity functions — exact copy from exam
function Qo(e, r, t) { let o = t - r; return o <= 0 ? 0 : e < r ? (r - e) / o : e > t ? (e - t) / o : 0; }
function Jo(e) { return e > .5 ? "S1" : e > .2 ? "S2" : e > 0 ? "S3" : "normal"; }

export function solve(email) {
  const norm = normalizeEmail(email);
  const n = new Math.seedrandom(`${norm}#${id}`);

  // Exact arrays from exam
  const a = ["CPU Usage (%)","Memory Usage (%)","Disk I/O (MB/s)","Network Latency (ms)","Request Rate (req/s)","Error Rate (%)","Queue Depth","Cache Hit Rate (%)"];
  const l = ["auth-svc","payment-svc","inventory-svc","notification-svc","gateway-svc","report-svc"];
  const i = ["host-01","host-02","host-03","host-04","host-05","host-06","host-07","host-08"];
  const s = ["auto-collected by monitoring agent","sampled at 1-minute interval","reported by health check","from prometheus scrape","via cloudwatch export"];

  // Exact helper functions from exam
  const d = (h, b) => h + Math.floor(n() * (b - h + 1));
  const c = h => h[Math.floor(n() * h.length)];
  const u = h => { n(); n(); return h; }; // pad: consumes 2 RNG (we don't need actual padding)
  const p = [h=>h, h=>h, h=>h, h=>h]; // 4 timestamp formatters (no RNG in them)
  const f = (h, b) => { n(); return null; }; // random date: consumes 1 RNG
  const x = h => { n(); u(''); return h; }; // x(): 1 RNG for format choice + u() = 3 total

  const v = 30;
  const k = ["S1","S1","S2","S2","S3","S3"];
  const S = [];

  // EXACT loop from exam — same variable evaluation order
  for (let h = 0; h < v; h++) {
    let b = c(l);       // pick service -> 1 RNG
    let C = c(i);       // pick host -> 1 RNG
    let E = c(a);       // pick metric -> 1 RNG
    let D = d(10, 60);  // rangeMin -> 1 RNG
    let L = D + d(15, 50); // rangeMax -> 1 RNG
    let P = L - D;
    let q, F = k[h];

    if (F === "S1") {
      let j = .55 + n() * .35;
      q = n() < .5 ? D - j * P : L + j * P;
    } else if (F === "S2") {
      let j = .22 + n() * .26;
      q = n() < .5 ? D - j * P : L + j * P;
    } else if (F === "S3") {
      let j = .05 + n() * .13;
      q = n() < .5 ? D - j * P : L + j * P;
    } else {
      q = D + n() * (L - D);
      q = Math.max(D, Math.min(L, q));
    }
    q = Math.round(q * 100) / 100;

    // These consume RNG in same order as exam:
    let ye = f(new Date(2024,0,1), new Date(2024,11,31)); // 1 RNG (date)
    let V = `EV-${String(h+1).padStart(5,"0")}`;           // no RNG
    let ue = c(p);                                          // 1 RNG (pick format), call it (no RNG)
    let J_note = c(s);                                      // 1 RNG (pick note)
    let J_batch = Math.floor(n() * 9e3 + 1e3);             // 1 RNG (batch#)

    // I.push padding — 9 u() calls + 1 x() call = exact RNG consumption
    u(V);              // u(V): 2 RNG
    u('');             // u(ue): 2 RNG
    u(b);              // u(b): 2 RNG
    u(C);              // u(C): 2 RNG
    u(E);              // u(E): 2 RNG
    x(q);              // x(q): 3 RNG (1 choice + 2 pad)
    u(String(D));      // u(rangeMin): 2 RNG
    u(String(L));      // u(rangeMax): 2 RNG
    u('');             // u(J): 2 RNG

    S.push({ value: q, rangeMin: D, rangeMax: L });
  }

  // Shuffle — exact same as exam
  for (let h = v - 1; h > 0; h--) {
    let b = Math.floor(n() * (h + 1));
    [S[h], S[b]] = [S[b], S[h]];
  }

  // Assign display IDs
  S.forEach((h, b) => { h.displayId = b + 1; });

  // Compute answer — exact same logic
  const T = { S1: 3, S2: 2, S3: 1 };
  const g = S.map(h => {
    let dev = Qo(h.value, h.rangeMin, h.rangeMax);
    return { displayId: h.displayId, dev, severity: Jo(dev) };
  }).filter(h => h.severity !== "normal")
    .sort((h, b) => {
      let C = T[b.severity] - T[h.severity];
      return C !== 0 ? C : b.dev - h.dev;
    });

  const tuples = g.map(a => `(${a.displayId}, "${a.severity}")`).join(', ');
  return {
    variant: `${g.length} anomalies | S1: ${g.filter(a=>a.severity==='S1').length}, S2: ${g.filter(a=>a.severity==='S2').length}, S3: ${g.filter(a=>a.severity==='S3').length}`,
    answer: `[${tuples}]`
  };
}
