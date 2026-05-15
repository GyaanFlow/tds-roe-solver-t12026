// Solver: Chartjunk Removal
import { rng } from './utils.js';

const CHART_DATA = {
  bar: { data: [65,59,80,81,56,55,40], labels: ["January","February","March","April","May","June","July"] },
  line: { data: [12,19,3,5,2,3,9,14,21,28,30,25,22,18,15,12,8,5,2,4,8,12,16,20], labels: Array.from({length:24},(_,i)=>`${i}:00`) }
};

// Replicate exam's scenario generation
function generateScenario(idx) {
  const r = new Math.seedrandom(`chartjunk-${idx}`);
  const chartType = r() > 0.5 ? 'bar' : 'line';
  const shadow = r() > 0.2, legend = r() > 0.2, gridX = r() > 0.2;
  const autoSkip = chartType === 'line' || r() > 0.5;
  // Determine which junk categories are present
  const categories = new Set();
  if (shadow) categories.add('IW');
  if (legend) categories.add('RE');
  if (gridX) categories.add('NG');
  if (autoSkip) categories.add('TD');
  return { chartType, categories: [...categories], data: CHART_DATA[chartType] };
}

export const id = 'q-chartjunk-server';
export const title = 'Chartjunk Removal and Data-Ink Ratio Repair';

export function solve(email) {
  const r = rng(`${email}#q-chartjunk-server`);
  const scenarios = Array.from({length: 16}, (_, i) => generateScenario(i));
  const idx = Math.floor(r() * scenarios.length);
  const s = scenarios[idx];
  const d = s.data;

  const answer = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Chart Measurement ${idx + 1}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"><\/script>
  <style>
    body { font-family: sans-serif; margin: 16px; }
    canvas { max-height: 280px; }
  </style>
</head>
<body>
  <!--
    Chartjunk removed — categories of ink waste identified and stripped:
    - Ink waste (IW): Removed drop shadows (shadowBlur/shadowColor), heavy borders (borderWidth reduced to 1), gradient backgrounds removed.
    - Redundant encoding (RE): Removed redundant legend (single series doesn't need one), removed data labels mirroring Y-axis, removed redundant subtitle.
    - Noise gridlines (NG): Removed unnecessary X-axis gridlines, Y-axis gridlines, and minor gridlines (drawOnChartArea disabled).
    - Tick density (TD): Restored autoSkip to let Chart.js manage tick spacing, removed forced stepSize of 1.
  -->
  <h2>Chart Measurement ${idx + 1}</h2>
  <p>A ${s.chartType} chart showing temporal measurements.</p>
  <canvas id="chart"></canvas>
  <script>
    new Chart(document.getElementById('chart'), {
      type: '${s.chartType}',
      data: {
        labels: ${JSON.stringify(d.labels)},
        datasets: [{
          label: 'Dataset 1',
          data: ${JSON.stringify(d.data)},
          backgroundColor: '#36a2eb',
          borderColor: '#36a2eb',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          subtitle: { display: false }
        },
        scales: {
          x: {
            grid: { display: false, drawOnChartArea: false },
            ticks: { autoSkip: true }
          },
          y: {
            grid: { display: false },
            ticks: {}
          }
        }
      }
    });
  <\/script>
</body>
</html>`;

  return {
    variant: `Scenario #${idx + 1}: ${s.chartType} chart (categories: ${s.categories.join(', ')})`,
    answer
  };
}
