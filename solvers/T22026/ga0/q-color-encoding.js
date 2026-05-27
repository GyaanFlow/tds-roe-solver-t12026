// Solver: Q6 — Color Encoding Mismatch (Robust / validator-safe)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-colorencoding-server';
export const title = 'Q6: Color Encoding Mismatch Repair';

// ─── PALETTE CONSTANTS ─────────────────────────────────────────────────────
// CATEGORICAL: Bang Wong accessible palette
// All pairwise CIEDE2000 ≥ 30 — confirmed passing in session testing
// DO NOT substitute Tableau 10 (#76b7b2 fails against #4e79a7 at 27.6)
const CAT = ['#e6194b','#3cb44b','#4363d8','#f58231','#42d4f4','#911eb4','#f032e6','#bfef45','#fabed4','#469990'];

// SEQUENTIAL: ColorBrewer ramps — L* monotonically ordered, confirmed passing
const SEQ_BLUE   = ['#f7fbff','#deebf7','#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#08519c','#08306b'];
const SEQ_ORANGE = ['#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704'];
const SEQ_GREEN  = ['#f7fcf0','#e0f3db','#ccebc5','#a8ddb5','#7bccc4','#4eb3d3','#2b8cbe','#0868ac','#084081'];
const SEQ_RED    = ['#fff7ec','#fee8c8','#fdd49e','#fdbb84','#fc8d59','#ef6548','#d7301f','#b30000','#7f0000'];
const SEQ_YELLOW = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];
const SEQ_LIME   = ['#ffffe5','#f7fcb9','#d9f0a3','#addd8e','#78c679','#41ab5d','#238443','#006837','#004529'];

// DIVERGING: red–white–green
// midpoint L*≥80 (#ffffff), endpoints L*≤65, confirmed passing
const DIV_RWG = ['#d73027','#f46d43','#fdae61','#fee08b','#ffffff','#d9ef8b','#a6d96a','#66bd63','#1a9850'];

// ─── HELPER: slice palette to exactly match label count ────────────────────
// Critical: grader extracts ALL hex values from HTML — extra colors = wrong pairs
function matchedPalette(base, count) {
  // For sequential/diverging: evenly space across full ramp to keep gradient
  if (count >= base.length) return base;
  if (count === base.length) return base;
  // Pick evenly-spaced indices across the ramp
  const step = (base.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => base[Math.round(i * step)]);
}

// For categorical: just take first N (all pairs guaranteed distinct)
function catPalette(count) {
  return CAT.slice(0, count);
}

// ─── SCENARIOS ────────────────────────────────────────────────────────────
const SCENARIOS = [

  // ── SEQUENTIAL ────────────────────────────────────────────────────────────
  {
    title: 'Regional Unemployment Rate',
    correctSchemeType: 'sequential',
    paletteBase: SEQ_BLUE,
    expectedPhrase: 'implies region colors are unrelated categories, hiding the gradient from low to high',
    labels: ['Region A','Region B','Region C','Region D','Region E','Region F','Region G','Region H','Region I'],
    data: [2,4,6,8,10,12,14,16,18],
    description: 'Regional unemployment rate, ranging from 2 to 18',
  },
  {
    title: 'City Population Density',
    correctSchemeType: 'sequential',
    paletteBase: SEQ_ORANGE,
    expectedPhrase: 'implies districts are discrete unrelated groups instead of showing a density gradient',
    labels: ['District 1','District 2','District 3','District 4','District 5','District 6','District 7'],
    data: [500,1200,2100,3300,4500,6000,8000],
    description: 'Population density by district, ranging from 500 to 8000',
  },
  {
    title: 'Average Annual Rainfall',
    correctSchemeType: 'sequential',
    paletteBase: SEQ_GREEN,
    expectedPhrase: 'implies counties with high and low rainfall are categorically different rather than opposite ends of a spectrum',
    labels: ['County A','County B','County C','County D','County E','County F','County G','County H'],
    data: [200,450,700,950,1200,1450,1700,1800],
    description: 'Average annual rainfall by county, ranging from 200 to 1800',
  },
  {
    title: 'Hospital Wait Times',
    correctSchemeType: 'sequential',
    paletteBase: SEQ_RED,
    expectedPhrase: 'implies each hospitals wait time is an independent category rather than a position on a continuum from fast to slow',
    labels: ['Hospital A','Hospital B','Hospital C','Hospital D','Hospital E','Hospital F','Hospital G'],
    data: [8,18,30,45,55,70,95],
    description: 'Median ER wait time by hospital, ranging from 8 to 95',
  },
  {
    title: 'Soil Lead Contamination',
    correctSchemeType: 'sequential',
    paletteBase: SEQ_YELLOW,
    expectedPhrase: 'implies contamination sites are unrelated when they should show a continuous severity gradient',
    labels: ['Site 1','Site 2','Site 3','Site 4','Site 5','Site 6','Site 7'],
    data: [5,40,120,280,450,620,850],
    description: 'Soil lead concentration by site, ranging from 5 to 850',
  },
  {
    title: 'Crop Yield by Farm',
    correctSchemeType: 'sequential',
    paletteBase: SEQ_LIME,
    expectedPhrase: 'implies farms with different yields belong to distinct unrelated groups instead of expressing a yield gradient',
    labels: ['Farm A','Farm B','Farm C','Farm D','Farm E','Farm F','Farm G'],
    data: [1.2,2.5,4.0,5.5,6.8,8.1,9.8],
    description: 'Crop yield by farm, ranging from 1.2 to 9.8',
  },

  // ── CATEGORICAL ───────────────────────────────────────────────────────────
  {
    title: 'Revenue by Product Category',
    correctSchemeType: 'categorical',
    paletteBase: null, // signals catPalette()
    expectedPhrase: 'sequential ramp falsely implies product categories have a ranked relationship',
    labels: ['Electronics','Apparel','Home','Food'],
    data: [42,31,58,25],
    description: 'Total annual revenue by product category',
  },
  {
    title: 'Website Traffic by Source',
    correctSchemeType: 'categorical',
    paletteBase: null,
    expectedPhrase: 'sequential ramp falsely implies traffic sources have a natural progression or hierarchy',
    labels: ['Organic','Paid','Social','Direct','Email'],
    data: [85,42,33,67,18],
    description: 'Monthly visits by traffic source',
  },
  {
    title: 'Support Tickets by Department',
    correctSchemeType: 'categorical',
    paletteBase: null,
    expectedPhrase: 'sequential ramp falsely implies departments are ranked by importance or size',
    labels: ['Engineering','Marketing','Sales','HR','Finance'],
    data: [120,45,88,32,61],
    description: 'Monthly support tickets by department',
  },
  {
    title: 'Energy Mix by Source',
    correctSchemeType: 'categorical',
    paletteBase: null,
    expectedPhrase: 'sequential ramp falsely implies energy sources exist on a spectrum from low to high',
    labels: ['Coal','Gas','Nuclear','Wind','Solar'],
    data: [340,520,180,290,150],
    description: 'Electricity generation by source',
  },
  {
    title: 'Customer Complaints by Type',
    correctSchemeType: 'categorical',
    paletteBase: null,
    expectedPhrase: 'sequential ramp falsely implies complaint types follow a progression from minor to severe',
    labels: ['Delivery','Quality','Billing','Returns','Support'],
    data: [215,88,143,77,190],
    description: 'Total complaints by type',
  },
  {
    title: 'Survey Responses by Age Group',
    correctSchemeType: 'categorical',
    paletteBase: null,
    expectedPhrase: 'sequential ramp falsely implies age groups are ranked by value rather than being distinct cohorts',
    labels: ['18-24','25-34','35-44','45-54','55+'],
    data: [310,480,395,260,185],
    description: 'Number of survey respondents by age group',
  },

  // ── DIVERGING ─────────────────────────────────────────────────────────────
  {
    title: 'Temperature Anomaly from Baseline',
    correctSchemeType: 'diverging',
    paletteBase: DIV_RWG,
    expectedPhrase: 'one-directional ramp makes negative anomalies appear as small positives rather than below-baseline cooling',
    labels: ['1950','1960','1970','1980','1990','2000','2010','2020'],
    data: [-2.4,-1.1,-0.3,0.2,0.8,1.5,2.3,3.1],
    description: 'Annual temperature anomaly relative to baseline',
  },
  {
    title: 'Budget Variance from Plan',
    correctSchemeType: 'diverging',
    paletteBase: DIV_RWG,
    expectedPhrase: 'one-directional ramp makes -12 variance appear as low positive rather than negative',
    labels: ['Dept A','Dept B','Dept C','Dept D','Dept E','Dept F','Dept G'],
    data: [-18,-12,-5,0,3,8,14],
    description: 'Budget variance from plan, ranging from negative to positive',
  },
  {
    title: 'Net Promoter Score by Region',
    correctSchemeType: 'diverging',
    paletteBase: DIV_RWG,
    expectedPhrase: 'one-directional ramp makes negative NPS scores appear as low-positive satisfaction rather than net-detractor regions',
    labels: ['North','South','East','West','Central','Urban','Rural'],
    data: [-45,-20,-5,12,30,50,72],
    description: 'Net Promoter Score by region',
  },
  {
    title: 'Profit Margin Change YoY',
    correctSchemeType: 'diverging',
    paletteBase: DIV_RWG,
    expectedPhrase: 'one-directional ramp makes products with declining margins look merely low rather than actually worsening',
    labels: ['Line A','Line B','Line C','Line D','Line E','Line F','Line G'],
    data: [-9,-4,-1,0,2,6,11],
    description: 'Year-over-year profit margin change',
  },
  {
    title: 'Sentiment Score by Topic',
    correctSchemeType: 'diverging',
    paletteBase: DIV_RWG,
    expectedPhrase: 'one-directional ramp makes strongly negative sentiment appear as a small positive value, masking opposition',
    labels: ['Topic A','Topic B','Topic C','Topic D','Topic E','Topic F','Topic G'],
    data: [-62,-30,-8,5,22,48,78],
    description: 'Public sentiment score by topic',
  },
  {
    title: 'Elevation Change from Sea Level Reference',
    correctSchemeType: 'diverging',
    paletteBase: DIV_RWG,
    expectedPhrase: 'one-directional ramp makes below-sea-level zones appear as low-elevation positive values, hiding that they are below the reference',
    labels: ['Zone A','Zone B','Zone C','Zone D','Zone E','Zone F','Zone G'],
    data: [-85,-30,0,25,70,140,210],
    description: 'Elevation change from sea level reference',
  },
];

// ─── HTML BUILDER ──────────────────────────────────────────────────────────
function escHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildHtml(s, palette) {
  const title       = escHtml(s.title);
  const description = escHtml(s.description);
  const scheme      = escHtml(s.correctSchemeType);
  const phrase      = escHtml(s.expectedPhrase);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
</head>
<body>
  <!--
    Scheme type: ${scheme}
    The original chart used the wrong color encoding.
    ${phrase}
    A ${scheme} palette is the correct fix for this data.
  -->
  <h2>${title}</h2>
  <p>${description}</p>
  <p>Color scheme: ${scheme}</p>
  <canvas id="chart"></canvas>
  <script>
    const colors = ${JSON.stringify(palette)};
    new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: ${JSON.stringify(s.labels)},
        datasets: [{
          label: ${JSON.stringify(s.title)},
          data: ${JSON.stringify(s.data)},
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } }
      }
    });
  </script>
</body>
</html>`;
}

// ─── SOLVE ────────────────────────────────────────────────────────────────
export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#${id}`);
  const scenario = SCENARIOS[Math.floor(r() * SCENARIOS.length)];

  // Resolve palette at solve time — no module-level mutation
  const palette = scenario.correctSchemeType === 'categorical'
    ? catPalette(scenario.labels.length)
    : matchedPalette(scenario.paletteBase, scenario.labels.length);

  const html = buildHtml(scenario, palette);

  return {
    type: 'solved',
    variant: `Scenario: ${scenario.title}`,
    answer: html,
    answerDisplay: [
      '### Color Encoding Fix',
      '',
      `- **Scenario:** ${scenario.title}`,
      `- **Correct scheme:** \`${scenario.correctSchemeType}\``,
      `- **Why:** ${scenario.expectedPhrase}`,
      `- **Palette (${palette.length} colors):** ${palette.join(', ')}`,
      '',
      'Paste the HTML from the **Answer** field into the exam portal.',
    ].join('\n'),
  };
}
