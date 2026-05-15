// Solver: Scale Manipulation Repair
import { fnvHash, normalizeEmail, rng } from './utils.js';

const TOTAL = 20;
const Y_MULTS = [0.85, 0.88, 0.91, 0.94, 0.97];
const DUAL_SCALES = [0.3, 0.5, 2, 3.5];

function phraseSet(type, val, idx) {
  if (type === 'A') {
    const n = val.toFixed(1);
    return [`inflates tiny deltas by ${n}x`, `magnifies small movement about ${n}x`, `makes mild change look ${n}x`];
  }
  if (type === 'B') return ['rescaled axis fakes synchronized trend', 'dual-axis scaling manufactures false correlation', 'secondary scale distorts cross-series comparison', `right axis stretched by ${val.toFixed(1)}x`];
  if (type === 'C') return ['inverted axis flips decline narrative', 'descending scale reverses trend meaning', 'axis direction turns fall into rise'];
  return ['log scale compresses linear acceleration', 'log axis hides arithmetic growth pace', 'linear growth appears flattened on log', `growth visually compressed by ${val.toFixed(1)}x`];
}

function buildTypeA(idx, r) {
  const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug'];
  const base = 840 + idx % 5 * 13;
  const data = labels.map((_, i) => Number((base + i * (6 + idx % 4) + (r() - 0.5) * 8).toFixed(2)));
  const minV = Math.min(...data), maxV = Math.max(...data);
  const mult = Y_MULTS[idx % Y_MULTS.length];
  const brokenMin = Number((minV * mult).toFixed(2));
  const distortion = Number((maxV / (maxV - brokenMin)).toFixed(1));
  return { type: 'A', labels, data, distortion, phrases: phraseSet('A', distortion, idx), fix: 'min: 0' };
}

function correlation(a, b) {
  const n = a.length;
  const ma = a.reduce((s, v) => s + v, 0) / n;
  const mb = b.reduce((s, v) => s + v, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) {
    const dx = a[i] - ma, dy = b[i] - mb;
    num += dx * dy; da += dx * dx; db += dy * dy;
  }
  return da === 0 || db === 0 ? 0 : num / Math.sqrt(da * db);
}

function buildTypeB(idx, r) {
  const labels = ['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10'];
  let seriesA, seriesB, corr = 1, tries = 0;
  while (Math.abs(corr) >= 0.3 && tries < 50) {
    tries++;
    seriesA = labels.map((_, i) => Number((95 + i * 1.1 + (r() - 0.5) * 9).toFixed(2)));
    seriesB = labels.map((_, i) => Number((340 + (r() - 0.5) * 55 + (i % 3 - 1) * 12).toFixed(2)));
    corr = correlation(seriesA, seriesB);
  }
  const scale = DUAL_SCALES[idx % DUAL_SCALES.length];
  const distortion = scale;
  return { type: 'B', labels, data: seriesA, seriesB, distortion, phrases: phraseSet('B', distortion, idx), fix: 'remove y2/yAxisID and normalize both series to % change' };
}

function buildTypeC(idx, r) {
  const labels = ['Q1','Q2','Q3','Q4','Q5','Q6','Q7','Q8'];
  const base = 430 - idx % 3 * 15;
  const data = labels.map((_, i) => Number((base - i * (9 + idx % 2) + (r() - 0.5) * 6).toFixed(2)));
  return { type: 'C', labels, data, distortion: 1, phrases: phraseSet('C', 1, idx), fix: 'reverse: false' };
}

function buildTypeD(idx, r) {
  const labels = ['M1','M2','M3','M4','M5','M6','M7','M8','M9'];
  const base = 140 + idx % 4 * 12;
  const data = labels.map((_, i) => Number((base + i * (18 + idx % 3 * 2) + (r() - 0.5) * 7).toFixed(2)));
  const earlySlope = data[1] - data[0];
  const lateSlope = data[data.length - 1] - data[data.length - 2];
  const distortion = Number((lateSlope / Math.max(0.1, earlySlope)).toFixed(1));
  return { type: 'D', labels, data, distortion, phrases: phraseSet('D', distortion, idx), fix: 'type: "linear"' };
}

function buildScenario(scenarioId, email) {
  const r = rng(`axis-scale-${email}-${scenarioId}`);
  const typeIdx = scenarioId % 4;
  const builders = [buildTypeA, buildTypeB, buildTypeC, buildTypeD];
  return { scenarioId, ...builders[typeIdx](scenarioId, r) };
}

function genCorrectedHTML(s) {
  const distNum = s.distortion;
  const phraseStr = s.phrases[0];

  if (s.type === 'A') {
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><title>Corrected Chart</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"><\/script>
<style>body{font-family:system-ui,sans-serif;margin:16px}canvas{max-height:340px}</style></head><body>
<!-- Quantification: ${distNum}. Distortion: ${phraseStr}. The truncated Y-axis inflates tiny deltas by ${distNum}x, making mild changes look dramatic. Corrected chart starts at zero showing actual magnitude. -->
<h3>Corrected: Y-axis starts at zero</h3><canvas id="chart"></canvas>
<script>new Chart(document.getElementById('chart'),{type:'line',data:{labels:${JSON.stringify(s.labels)},datasets:[{label:'Revenue Index',data:${JSON.stringify(s.data)},borderColor:'#2563eb',backgroundColor:'rgba(37,99,235,0.15)',tension:0.3}]},options:{responsive:true,plugins:{title:{display:true,text:'Revenue — axis starts at 0'}},scales:{y:{min: 0,beginAtZero:true}}}});<\/script></body></html>`;
  }
  if (s.type === 'B') {
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><title>Corrected Chart</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"><\/script>
<style>body{font-family:system-ui,sans-serif;margin:16px}canvas{max-height:340px}</style></head><body>
<!-- Quantification: ${distNum}. Distortion: ${phraseStr}. The dual-axis scaling manufactures false correlation between uncorrelated series. Corrected chart normalizes to percent change on single axis. right axis stretched by ${distNum}x -->
<h3>Corrected: Single-axis % change comparison</h3><canvas id="chart"></canvas>
<script>
const a=${JSON.stringify(s.data)};const b=${JSON.stringify(s.seriesB)};
const pctA=a.map((v,i)=>i===0?0:((v-a[0])/a[0]*100).toFixed(2));
const pctB=b.map((v,i)=>i===0?0:((v-b[0])/b[0]*100).toFixed(2));
new Chart(document.getElementById('chart'),{type:'line',data:{labels:${JSON.stringify(s.labels)},datasets:[{label:'Support tickets (% change)',data:pctA,borderColor:'#2563eb',tension:0.25},{label:'Ad spend (% change)',data:pctB,borderColor:'#dc2626',tension:0.25}]},options:{responsive:true,plugins:{title:{display:true,text:'Percent change comparison'}},scales:{y:{beginAtZero:true}}}});<\/script></body></html>`;
  }
  if (s.type === 'C') {
    return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><title>Corrected Chart</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"><\/script>
<style>body{font-family:system-ui,sans-serif;margin:16px}canvas{max-height:340px}</style></head><body>
<!-- Quantification: ${distNum}. Distortion: ${phraseStr}. The inverted axis flips decline narrative making a falling trend appear to rise. Corrected chart uses ascending axis direction. -->
<h3>Corrected: Normal ascending axis</h3><canvas id="chart"></canvas>
<script>new Chart(document.getElementById('chart'),{type:'line',data:{labels:${JSON.stringify(s.labels)},datasets:[{label:'Satisfaction score',data:${JSON.stringify(s.data)},borderColor:'#7c3aed',backgroundColor:'rgba(124,58,237,0.12)',tension:0.3}]},options:{responsive:true,plugins:{title:{display:true,text:'Satisfaction is actually declining'}},scales:{y:{reverse:false}}}});<\/script></body></html>`;
  }
  // Type D
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><title>Corrected Chart</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"><\/script>
<style>body{font-family:system-ui,sans-serif;margin:16px}canvas{max-height:340px}</style></head><body>
<!-- Quantification: ${distNum}. Distortion: ${phraseStr}. The log scale compresses linear acceleration hiding arithmetic growth pace. Corrected chart uses linear scale. Growth visually compressed by ${distNum}x on log axis. linear -->
<h3>Corrected: Linear scale reveals true growth</h3><canvas id="chart"></canvas>
<script>new Chart(document.getElementById('chart'),{type:'line',data:{labels:${JSON.stringify(s.labels)},datasets:[{label:'Active users',data:${JSON.stringify(s.data)},borderColor:'#059669',backgroundColor:'rgba(5,150,105,0.12)',tension:0.25}]},options:{responsive:true,plugins:{title:{display:true,text:'Growth is actually accelerating'}},scales:{y:{type:"linear"}}}});<\/script></body></html>`;
}

export const id = 'q-axis-scale-manipulation-repair';
export const title = 'Scale Manipulation Repair';

export function solve(email) {
  const norm = normalizeEmail(email);
  const scenarioId = fnvHash(norm) % TOTAL;
  const s = buildScenario(scenarioId, norm);

  return {
    variant: `Scenario #${scenarioId + 1} | Type ${s.type} | Distortion: ${s.distortion}`,
    answer: genCorrectedHTML(s)
  };
}
