// Solver: Service Latency Spike Detection
import { normalizeEmail } from './utils.js';

export const id = 'q-latency-spike-detection';
export const title = 'Service Latency Spike Detection';

export function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(`${norm}#${id}`);

  const TOTAL_ROWS = 60;
  const SPIKE_COUNT = 5;

  const services = ["api-gateway","auth-svc","payment-svc","report-svc","inventory-svc"];
  const notes = ["health-check ok","scrape interval: 60s","prometheus export","from cloudwatch","agent-collected","manual poll","synthetic probe"];

  // Create indices for spike rows
  const indices = Array.from({ length: TOTAL_ROWS }, (_, i) => i);
  for (let i = 0; i < SPIKE_COUNT; i++) {
    const j = i + Math.floor(rng() * (TOTAL_ROWS - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const spikeSet = new Set(indices.slice(0, SPIKE_COUNT));

  // Determine SCALE_UP vs MONITOR for each spike
  const spikeActions = new Map();
  for (const idx of spikeSet) {
    spikeActions.set(idx, rng() < 0.55 ? "SCALE_UP" : "MONITOR");
  }

  const rows = [];
  for (let i = 0; i < TOTAL_ROWS; i++) {
    const r1 = rng(), r2 = rng(), r3 = rng(), r4 = rng(), r5 = rng(), r6 = rng();
    // Consume timestamp/service/note RNG
    const _service = services[Math.floor(r5 * services.length)];
    const _note = notes[Math.floor(r6 * notes.length)];

    const isSpike = spikeSet.has(i);
    let latency = 0, cpuUtil, ramUtil;

    if (isSpike) {
      if (spikeActions.get(i) === "SCALE_UP") {
        const a = 80 + Math.floor(r1 * 16);
        const b = 45 + Math.floor(r2 * 30);
        if (r3 < 0.5) { cpuUtil = a; ramUtil = b; }
        else { cpuUtil = b; ramUtil = a; }
      } else {
        cpuUtil = 35 + Math.floor(r1 * 40);
        ramUtil = 35 + Math.floor(r2 * 40);
      }
    } else {
      latency = 45 + Math.floor(r1 * 24);
      cpuUtil = 15 + Math.floor(r2 * 50);
      ramUtil = 15 + Math.floor(r3 * 50);
    }

    rows.push({ rowNum: i + 1, latency, cpuUtil, ramUtil, isSpike, r4 });
  }

  // Compute normal stats (from non-spike rows)
  const normalLatencies = rows.filter(r => !r.isSpike).map(r => r.latency);
  const normalMean = normalLatencies.reduce((a, b) => a + b, 0) / normalLatencies.length;
  const normalStd = Math.sqrt(normalLatencies.reduce((a, b) => a + (b - normalMean) ** 2, 0) / normalLatencies.length);

  // Set spike latencies using normal distribution parameters
  for (const row of rows) {
    if (row.isSpike) {
      row.latency = Math.round(normalMean + (3.8 + row.r4 * 1.5) * normalStd);
    }
  }

  // Now compute stats over ALL 60 rows (as exam requires)
  const allLatencies = rows.map(r => r.latency);
  const mean = allLatencies.reduce((a, b) => a + b, 0) / TOTAL_ROWS;
  const popStd = Math.sqrt(allLatencies.reduce((a, b) => a + (b - mean) ** 2, 0) / TOTAL_ROWS);
  const threshold = mean + 2 * popStd;

  // Find spikes and determine actions
  const spikes = rows
    .filter(r => r.latency > threshold)
    .map(r => ({
      rowNum: r.rowNum,
      action: Math.max(r.cpuUtil, r.ramUtil) >= 80 ? "SCALE_UP" : "MONITOR"
    }))
    .sort((a, b) => a.rowNum - b.rowNum);

  const tuples = spikes.map(s => `(${s.rowNum}, "${s.action}")`).join(', ');

  return {
    variant: `${spikes.length} spikes | Threshold: ${threshold.toFixed(1)}ms (mean=${mean.toFixed(1)}, σ=${popStd.toFixed(1)}) | SCALE_UP: ${spikes.filter(s=>s.action==='SCALE_UP').length}, MONITOR: ${spikes.filter(s=>s.action==='MONITOR').length}`,
    answer: `[${tuples}]`
  };
}
