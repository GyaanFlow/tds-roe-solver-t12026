// Solver: Cloud Deployment Cost & Performance Analysis
import { normalizeEmail } from './utils.js';

export const id = 'q-deployment-cost-analysis';
export const title = 'Cloud Deployment Cost & Performance Analysis';

const INSTANCES = [
  { letter: "A", cpu: 2, ram: 4, cost: 0.05 },
  { letter: "B", cpu: 4, ram: 8, cost: 0.10 },
  { letter: "C", cpu: 8, ram: 16, cost: 0.20 },
];
const BASE_LATENCY = 50;

function computeLatency(cpuReq, ramReq, inst) {
  return BASE_LATENCY * Math.max(1, cpuReq / inst.cpu + ramReq / inst.ram);
}

export function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(`${norm}#${id}`);

  const NUM_REQUESTS = 28;
  const SPIKE_COUNT = 3;

  // Determine scenario index
  const scenarioIdx = Math.floor(rng() * 3);
  const currentInst = INSTANCES[scenarioIdx];
  const prevInst = scenarioIdx > 0 ? INSTANCES[scenarioIdx - 1] : null;

  const requests = [];
  for (let i = 0; i < NUM_REQUESTS; i++) {
    const r1 = rng(), r2 = rng(), r3 = rng(), r4 = rng(), r5 = rng(), r6 = rng();
    // Consume padding RNG values
    const _padL = [Math.floor(rng()*3), Math.floor(rng()*3), Math.floor(rng()*3), Math.floor(rng()*3)];
    const _padR = [Math.floor(rng()*2), Math.floor(rng()*2), Math.floor(rng()*2), Math.floor(rng()*2)];

    let cpuReq, ramReq, latThreshold;

    if (i < SPIKE_COUNT && prevInst !== null) {
      // Spike requests designed to fail prevInst but pass currentInst
      const cpuLo = prevInst.cpu * 0.82;
      const cpuHi = currentInst.cpu * 0.91;
      const ramLo = prevInst.ram * 0.82;
      const ramHi = currentInst.ram * 0.91;
      cpuReq = Math.round((cpuLo + r1 * (cpuHi - cpuLo)) * 10) / 10;
      ramReq = Math.round((ramLo + r2 * (ramHi - ramLo)) * 10) / 10;
      cpuReq = Math.max(0.1, cpuReq);
      ramReq = Math.max(0.1, ramReq);

      const latPrev = computeLatency(cpuReq, ramReq, prevInst);
      const latCurr = computeLatency(cpuReq, ramReq, currentInst);
      const gap = latPrev - latCurr;

      if (gap > 2) {
        latThreshold = Math.floor(latCurr + r3 * gap * 0.4);
      } else {
        cpuReq = Math.round(prevInst.cpu * 0.94 * 10) / 10;
        ramReq = Math.round(prevInst.ram * 0.94 * 10) / 10;
        const lp2 = computeLatency(cpuReq, ramReq, prevInst);
        const lc2 = computeLatency(cpuReq, ramReq, currentInst);
        latThreshold = Math.floor(lc2 + (lp2 - lc2) * 0.35);
      }
      latThreshold = Math.max(latThreshold, Math.ceil(computeLatency(cpuReq, ramReq, currentInst)));
    } else {
      cpuReq = Math.round((0.3 + r1 * (currentInst.cpu * 0.72 - 0.3)) * 10) / 10;
      ramReq = Math.round((0.5 + r2 * (currentInst.ram * 0.72 - 0.5)) * 10) / 10;
      cpuReq = Math.max(0.1, cpuReq);
      ramReq = Math.max(0.1, ramReq);
      const latCurr = computeLatency(cpuReq, ramReq, currentInst);
      latThreshold = Math.floor(latCurr * (1.3 + r3 * 0.7));
    }

    requests.push({ cpuReq, ramReq, latThreshold });
  }

  // Shuffle requests
  for (let i = requests.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [requests[i], requests[j]] = [requests[j], requests[i]];
  }

  // Find cheapest viable instance
  let cheapest = INSTANCES[INSTANCES.length - 1]; // default to most expensive
  for (const inst of INSTANCES) {
    const viable = requests.every(r => computeLatency(r.cpuReq, r.ramReq, inst) <= r.latThreshold);
    if (viable) {
      cheapest = inst;
      break;
    }
  }

  return {
    variant: `${NUM_REQUESTS} requests | Cheapest viable: Instance ${cheapest.letter} ($${cheapest.cost.toFixed(2)}/hr)`,
    answer: `("${cheapest.letter}", ${cheapest.cost.toFixed(2)})`
  };
}
