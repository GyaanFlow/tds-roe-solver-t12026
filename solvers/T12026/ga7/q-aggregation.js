// Solver: Broken Aggregation and Sort Order Repair
import { fnvHash, normalizeEmail, rng, shuffle } from './utils.js';

const QID = 'q-broken-aggregation-sort-repair';
const TOP = 10;
const ALL_CATS = ["Electronics","Home","Apparel","Food","Sports","Beauty","Toys","Automotive","Books","Garden","Office","Health","Pet","Travel","Gaming","Outdoors"];

const METRICS = [
  { title: "Top 10 categories by average revenue per transaction", correctAgg: "avgRevenue", wrongAgg: "sumRevenue" },
  { title: "Top 10 categories by total units sold", correctAgg: "sumUnits", wrongAgg: "avgUnits" },
  { title: "Top 10 categories by median session duration", correctAgg: "medianSessionDuration", wrongAgg: "meanSessionDuration" },
  { title: "Top 10 categories by maximum single-day spike", correctAgg: "maxSpike", wrongAgg: "sumSpike" },
];

function pickCategories(scenarioId, r) {
  const t = [...ALL_CATS];
  // Shuffle then pick 12
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  const offset = scenarioId % 3;
  return t.slice(offset, offset + 12);
}

function generateTransactions(scenarioId, categories, r) {
  const count = 50 + Math.floor(r() * 151);
  const weights = categories.map((_, d) => 1 + (d + scenarioId) % 5 * 0.2 + r() * 0.35);
  const totalW = weights.reduce((a, b) => a + b, 0);

  function pickCat() {
    let s = r() * totalW, acc = 0;
    for (let i = 0; i < categories.length; i++) {
      acc += weights[i];
      if (s <= acc) return categories[i];
    }
    return categories[categories.length - 1];
  }

  const txns = [];
  for (let s = 0; s < count; s++) {
    const cat = pickCat();
    const c = categories.indexOf(cat);
    const baseRev = 40 + c * 6.5 + scenarioId % 4 * 3.2;
    const revenue = Number((baseRev + r() * 90 + s % 7 * 1.4).toFixed(2));
    const baseUnits = 2 + c % 4;
    const units = Math.max(1, Math.round(baseUnits + r() * 14 + s % 5 * 0.8));
    const baseSess = 3.2 + c * 0.35 + scenarioId % 5 * 0.22;
    const session = Number((baseSess + r() * 8.5 + s % 6 * 0.18).toFixed(2));
    const baseSpike = 18 + c * 4.8 + scenarioId % 3 * 2.4;
    const spike = Number((baseSpike + r() * 125 + s % 9 * 1.6).toFixed(2));
    txns.push({ category: cat, revenue, units, session_duration_min: session, daily_spike: spike });
  }
  return txns;
}

function aggregate(txns, categories, aggType) {
  const groups = new Map(categories.map(c => [c, []]));
  for (const t of txns) groups.get(t.category)?.push(t);

  const result = {};
  for (const cat of categories) {
    const items = groups.get(cat) ?? [];
    if (!items.length) { result[cat] = 0; continue; }
    switch (aggType) {
      case 'avgRevenue': result[cat] = Number((items.reduce((s, i) => s + i.revenue, 0) / items.length).toFixed(2)); break;
      case 'sumRevenue': result[cat] = Number(items.reduce((s, i) => s + i.revenue, 0).toFixed(2)); break;
      case 'sumUnits': result[cat] = Number(items.reduce((s, i) => s + i.units, 0).toFixed(2)); break;
      case 'avgUnits': result[cat] = Number((items.reduce((s, i) => s + i.units, 0) / items.length).toFixed(2)); break;
      case 'medianSessionDuration': {
        const sorted = items.map(i => i.session_duration_min).sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        result[cat] = Number((sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]).toFixed(2));
        break;
      }
      case 'meanSessionDuration': result[cat] = Number((items.reduce((s, i) => s + i.session_duration_min, 0) / items.length).toFixed(2)); break;
      case 'maxSpike': result[cat] = Number(Math.max(...items.map(i => i.daily_spike)).toFixed(2)); break;
      case 'sumSpike': result[cat] = Number(items.reduce((s, i) => s + i.daily_spike, 0).toFixed(2)); break;
      default: result[cat] = 0;
    }
  }
  return result;
}

export const id = QID;
export const title = 'Broken Aggregation and Sort Order Repair';

export function solve(email) {
  const norm = normalizeEmail(email);
  const scenarioId = fnvHash(norm) % 20;
  const metric = METRICS[scenarioId % METRICS.length];
  const r = rng(`q20-ranking-${norm}-${scenarioId}`);
  const categories = pickCategories(scenarioId, r);
  const txns = generateTransactions(scenarioId, categories, r);

  const correctAgg = aggregate(txns, categories, metric.correctAgg);
  const sorted = Object.entries(correctAgg)
    .sort((a, b) => b[1] !== a[1] ? b[1] - a[1] : a[0].localeCompare(b[0]))
    .slice(0, TOP);

  const labels = sorted.map(e => e[0]);
  const values = sorted.map(e => e[1]);
  const colors = labels.map((_, i) => i === 0 ? '#f28e2b' : '#4e79a7');

  const answer = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${metric.title}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"><\/script>
  <style>
    body { font-family: sans-serif; margin: 16px; }
    canvas { max-height: 320px; }
  </style>
</head>
<body>
  <h3>${metric.title}</h3>
  <canvas id="chart"></canvas>
  <script>
    new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [{
          label: ${JSON.stringify(metric.title)},
          data: ${JSON.stringify(values)},
          backgroundColor: ${JSON.stringify(colors)},
          borderColor: '#1f2937',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, title: { display: true, text: ${JSON.stringify(metric.title)} } },
        scales: { y: { beginAtZero: true } }
      }
    });
  <\/script>
</body>
</html>`;

  return {
    variant: `Scenario #${scenarioId + 1} | Metric: ${metric.correctAgg} | Top: ${labels[0]} (${values[0]})`,
    answer
  };
}
