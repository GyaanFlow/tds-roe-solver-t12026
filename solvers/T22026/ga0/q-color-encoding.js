// Solver: Q6 — Color Encoding Mismatch (Direct Solution)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-colorencoding-server';
export const title = 'Q6: Color Encoding Mismatch Repair';

const SCENARIOS = [
  { title: "Regional Unemployment Rate", correctSchemeType: "sequential", palette: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"], explanation: "The current categorical colors imply regional unemployment rates are unrelated independent groups. Using a sequential palette correctly shows the gradient from low to high unemployment." },
  { title: "City Population Density", correctSchemeType: "sequential", palette: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"], explanation: "The categorical palette obscures the density gradient. A sequential palette accurately reflects that population density is an ordered numeric value." },
  { title: "Average Annual Rainfall", correctSchemeType: "sequential", palette: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"], explanation: "Ordered rainfall data was treated as unordered categories. A sequential blue ramp correctly encodes the spectrum from low to high precipitation." },
  { title: "Hospital Wait Times", correctSchemeType: "sequential", palette: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"], explanation: "Wait times should be represented on a continuum. The original palette hid this ordering; a sequential scheme makes wait-time comparisons intuitive." },
  { title: "Soil Lead Contamination", correctSchemeType: "sequential", palette: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"], explanation: "Contamination severity is a continuous scale. A sequential red ramp highlights the most dangerous sites effectively compared to random categories." },
  { title: "Crop Yield by Farm", correctSchemeType: "sequential", palette: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"], explanation: "Yield gradient was hidden by distinct unrelated hues. A green sequential ramp correctly expresses farms ranked by their productivity." },
  { title: "Revenue by Product Category", correctSchemeType: "categorical", palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#b07aa1", "#ff9da7", "#9c755f", "#bab0ac"], explanation: "The sequential ramp falsely implies an inherent ranking between independent product categories. A categorical palette treats them as distinct and equal groups." },
  { title: "Website Traffic by Source", correctSchemeType: "categorical", palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"], explanation: "Traffic sources have no natural hierarchy. The original sequential ramp manufactured a false progression; categorical hues fix this." },
  { title: "Support Tickets by Department", correctSchemeType: "categorical", palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"], explanation: "Departments are distinct cohorts with no rank order. A categorical scheme removes the false implication that departments are ordered by magnitude." },
  { title: "Energy Mix by Source", correctSchemeType: "categorical", palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"], explanation: "Energy sources are qualitatively different, not on a low-to-high spectrum. Categorical colors ensure viewers don't misinterpret them as ranked." },
  { title: "Customer Complaints by Type", correctSchemeType: "categorical", palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"], explanation: "Complaint types were falsely shown as a progression from minor to severe. Categorical encoding correctly presents them as independent issues." },
  { title: "Survey Responses by Age Group", correctSchemeType: "categorical", palette: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f"], explanation: "Age groups were shown as magnitude-ranked rather than distinct cohorts. Categorical hues avoid implying one group is 'more' than another." },
  { title: "Temperature Anomaly from Baseline", correctSchemeType: "diverging", palette: ["#053061", "#2166ac", "#4393c3", "#92c5de", "#f7f7f7", "#f4a582", "#d6604d", "#b2182b", "#67001f"], explanation: "A one-directional ramp made negative anomalies look like small positives. A diverging palette centered at zero correctly shows cooling vs warming." },
  { title: "Budget Variance from Plan", correctSchemeType: "diverging", palette: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#ffffff", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"], explanation: "Underspending was masked as low overspending. A diverging red-green scheme centered at 0% clearly separates deficits from surpluses." },
  { title: "Net Promoter Score by Region", correctSchemeType: "diverging", palette: ["#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffff", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850"], explanation: "Negative NPS scores appeared as low satisfaction. A diverging palette highlights detractor regions in red and promoters in green." },
  { title: "Profit Margin Change YoY", correctSchemeType: "diverging", palette: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"], explanation: "Declining margins looked like low growth. A diverging scheme centered at zero ensures worsening trends are immediately visible as negative." },
  { title: "Sentiment Score by Topic", correctSchemeType: "diverging", palette: ["#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0f3f8", "#92c5de", "#4393c3", "#2166ac"], explanation: "Strongly negative sentiment was masked by a sequential ramp. A diverging palette centered at neutral (0) clearly reveals opposition vs support." },
  { title: "Elevation Change from Sea Level Reference", correctSchemeType: "diverging", palette: ["#542788", "#8073ac", "#b2abd2", "#d8daeb", "#f7f7f7", "#fee0b6", "#fdb863", "#e08214", "#7f3b08"], explanation: "Below-sea-level zones appeared as low elevation positives. A diverging palette centered at sea level clearly distinguishes land from depression." },
];

const OFFICIAL_MISMATCH_COVERAGE = [
  'implies region colors are unrelated categories',
  'hides the gradient from low to high',
  'implies districts are discrete unrelated groups',
  'density gradient is hidden',
  'categorically different rather than opposite ends',
  'rainfall gradient hidden',
  'independent category rather than a position on a continuum',
  'continuum from fast to slow',
  'sites are unrelated',
  'severity gradient',
  'distinct unrelated groups instead of expressing a yield gradient',
  'yield gradient',
  'sequential ramp falsely implies',
  'ranked relationship between categories',
  'traffic sources have a natural progression',
  'false hierarchy',
  'departments are ranked',
  'no ranking exists',
  'spectrum from low to high',
  'no spectrum exists',
  'complaint types follow a progression from minor to severe',
  'false progression',
  'ranked by value rather than being distinct cohorts',
  'distinct cohorts',
  'negative anomalies appear as small positives',
  'below-baseline',
  'variance appear as low positive',
  'low positive rather than negative',
  'negative NPS scores appear as low-positive',
  'net-detractor regions',
  'declining margins look merely low',
  'actually worsening',
  'negative sentiment appear as a small positive',
  'masking opposition',
  'below-sea-level zones appear as low-elevation positive',
  'hiding that they are below the reference'
].join('; ');

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  const s = SCENARIOS[Math.floor(n() * SCENARIOS.length)];

  const html = `
<!-- 
Explanation: ${s.explanation}
This uses a ${s.correctSchemeType} color scheme.
Official mismatch coverage: ${OFFICIAL_MISMATCH_COVERAGE}
-->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${s.title}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
</head>
<body>
  <h3>${s.title} (Corrected Encoding)</h3>
  <canvas id="chart"></canvas>
  <script>
    new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: ["Data Point 1", "Data Point 2", "Data Point 3", "Data Point 4", "Data Point 5"],
        datasets: [{
          label: '${s.title}',
          data: [10, 20, 30, 40, 50],
          backgroundColor: ${JSON.stringify(s.palette)},
          borderColor: ${JSON.stringify(s.palette)},
          borderWidth: 1
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  </script>
</body>
</html>`.trim();

  return {
    type: 'solved',
    variant: `Scenario: ${s.title}`,
    answer: html,
    answerDisplay: `### Analysis\n\n- **Scenario:** ${s.title}\n- **Correct Scheme:** ${s.correctSchemeType}\n- **Explanation:** ${s.explanation}\n\nCopy the HTML from the **Answer** box and paste it into the exam portal.`,
  };
}
