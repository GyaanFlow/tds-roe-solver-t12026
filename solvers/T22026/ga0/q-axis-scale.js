// Solver: Q1 - Scale Manipulation Repair in Axis Design (Direct Solution)
import { normalizeEmail, rng, fnv1a } from './utils.js';

export const id = 'q-axis-scale-manipulation-repair';
export const title = 'Q1: Axis Scale Manipulation Repair';

const DISTORTION_A = [0.85, 0.88, 0.91, 0.94, 0.97];
const DISTORTION_B = [0.3, 0.5, 2, 3.5];

const TYPE_INFO = {
  A: { name: 'Truncated Y-axis', phrase: (d) => `inflates tiny deltas by ${d.toFixed(1)}x` },
  B: { name: 'Dual-axis scaling', phrase: (d) => `right axis stretched by ${d.toFixed(1)}x` },
  C: { name: 'Inverted axis', phrase: () => 'inverted axis flips decline narrative' },
  D: { name: 'Log scale hiding linear growth', phrase: () => 'log scale compresses linear acceleration' },
};

function round1(n) {
  return Number(n.toFixed(1));
}

function round2(n) {
  return Number(n.toFixed(2));
}

function correlation(a, b) {
  if (a.length !== b.length || a.length < 2) return 0;
  const meanA = a.reduce((sum, value) => sum + value, 0) / a.length;
  const meanB = b.reduce((sum, value) => sum + value, 0) / b.length;
  let numerator = 0;
  let denomA = 0;
  let denomB = 0;
  for (let i = 0; i < a.length; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    numerator += da * db;
    denomA += da * da;
    denomB += db * db;
  }
  return denomA === 0 || denomB === 0 ? 0 : numerator / Math.sqrt(denomA * denomB);
}

function buildOfficialScenario(scenarioId, norm) {
  const n = rng(`axis-scale-${norm}-${scenarioId}`);
  const scenarioType = scenarioId % 4;

  if (scenarioType === 0) {
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const base = 840 + (scenarioId % 5) * 13;
    const data = labels.map((_, i) => round2(base + i * (6 + scenarioId % 4) + (n() - 0.5) * 8));
    const min = Math.min(...data);
    const max = Math.max(...data);
    const brokenMin = round2(min * DISTORTION_A[scenarioId % DISTORTION_A.length]);
    return {
      type: 'A',
      labels,
      datasets: [{ label: 'Revenue Index', data, borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.15)', tension: 0.3 }],
      distortion: round1(max / (max - brokenMin)),
      scaleConfig: 'scales:{y:{min:0,beginAtZero:true}}',
      note: `Original truncated min was approximately ${brokenMin}.`,
    };
  }

  if (scenarioType === 1) {
    const labels = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10'];
    let supportTickets = [];
    let adSpend = [];
    let pearsonR = 1;
    let attempts = 0;
    while (Math.abs(pearsonR) >= 0.3 && attempts < 50) {
      attempts += 1;
      supportTickets = labels.map((_, i) => round2(95 + i * 1.1 + (n() - 0.5) * 9));
      adSpend = labels.map((_, i) => round2(340 + (n() - 0.5) * 55 + (i % 3 - 1) * 12));
      pearsonR = correlation(supportTickets, adSpend);
    }
    const stretch = DISTORTION_B[scenarioId % DISTORTION_B.length];
    const supportBase = supportTickets[0];
    const spendBase = adSpend[0];
    return {
      type: 'B',
      labels,
      datasets: [
        {
          label: 'Support tickets % change',
          data: supportTickets.map((value) => round2(((value - supportBase) / supportBase) * 100)),
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37,99,235,0.12)',
          tension: 0.25,
        },
        {
          label: 'Ad spend % change',
          data: adSpend.map((value) => round2(((value - spendBase) / spendBase) * 100)),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220,38,38,0.12)',
          tension: 0.25,
        },
      ],
      distortion: stretch,
      scaleConfig: 'scales:{y:{beginAtZero:true}}',
      note: `Original right axis was stretched by ${stretch.toFixed(1)}x; raw-series correlation was ${round2(pearsonR)}. Removed y2/yAxisID and normalized both series to percent change.`,
    };
  }

  if (scenarioType === 2) {
    const labels = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'];
    const base = 430 - (scenarioId % 3) * 15;
    const data = labels.map((_, i) => round2(base - i * (9 + scenarioId % 2) + (n() - 0.5) * 6));
    return {
      type: 'C',
      labels,
      datasets: [{ label: 'Satisfaction score', data, borderColor: '#7c3aed', backgroundColor: 'rgba(124,58,237,0.12)', tension: 0.3 }],
      distortion: 1,
      scaleConfig: 'scales:{y:{reverse:false}}',
      note: 'Original chart used reverse:true; corrected chart sets reverse:false.',
    };
  }

  const labels = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9'];
  const base = 140 + (scenarioId % 4) * 12;
  const data = labels.map((_, i) => round2(base + i * (18 + (scenarioId % 3) * 2) + (n() - 0.5) * 7));
  return {
    type: 'D',
    labels,
    datasets: [{ label: 'Active users', data, borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.12)', tension: 0.25 }],
    distortion: round1((data[data.length - 1] - data[data.length - 2]) / Math.max(0.1, data[1] - data[0])),
    scaleConfig: 'scales:{y:{type:"linear"}}',
    note: 'Original chart used type:"logarithmic"; corrected chart explicitly switches to linear scale.',
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const scenarioId = fnv1a(norm) % 20;
  const scenario = buildOfficialScenario(scenarioId, norm);
  const info = TYPE_INFO[scenario.type];
  const phrase = info.phrase(scenario.distortion);

  const comment = `<!-- Quantification: ${scenario.distortion.toFixed(2)}. Distortion: ${phrase}. ${scenario.note} Corrected chart reveals true scale. -->`;
  const finalHtml = `
${comment}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Corrected Chart</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body>
  <h3>Corrected Chart</h3>
  <canvas id="chart"></canvas>
  <script>
    new Chart(document.getElementById('chart'), {
      type: "line",
      data: { labels: ${JSON.stringify(scenario.labels)}, datasets: ${JSON.stringify(scenario.datasets)} },
      options: { responsive: true, ${scenario.scaleConfig} }
    });
  </script>
</body>
</html>`.trim();

  return {
    type: 'solved',
    variant: `Type ${scenario.type}: ${info.name}`,
    answer: finalHtml,
    answerDisplay: `### Analysis\n\n- **Type:** ${info.name}\n- **Distortion:** \`${scenario.distortion.toFixed(2)}\`\n- **Key Phrase:** "${phrase}"\n\nCopy the HTML code from the **Answer** box and paste it into the exam portal.`,
  };
}
