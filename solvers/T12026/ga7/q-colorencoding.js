// Solver: Fix the Color Encoding Mismatch
import { rng, pickColors, pickDivergingColors, PALETTES } from './utils.js';

// All 18 scenarios from exam (indices 0-5=sequential, 6-11=categorical, 12-17=diverging)
const SCENARIOS = [
  {title:"Regional Unemployment Rate",desc:"Unemployment rate (%) by region, ranging from 2% to 18%",data:[2,4,6,8,10,12,14,16,18],labels:["Region A","Region B","Region C","Region D","Region E","Region F","Region G","Region H","Region I"],phrase:"implies region colors are unrelated categories, hiding the gradient from low to high",syns:["implies region colors are unrelated categories","hides the gradient from low to high","treats ordered data as unordered","unrelated categories","hiding the gradient"]},
  {title:"City Population Density",desc:"Population density (people/km²) by city district, ranging from 500 to 8000",data:[500,1200,2100,3300,4500,6000,8000],labels:["District 1","District 2","District 3","District 4","District 5","District 6","District 7"],phrase:"implies districts are discrete unrelated groups instead of showing a density gradient",syns:["implies districts are discrete unrelated groups","density gradient is hidden","no implied order","unrelated groups","categorical colors obscure"]},
  {title:"Average Annual Rainfall",desc:"Average annual rainfall (mm) by county, ranging from 200 mm to 1800 mm",data:[200,450,700,950,1200,1450,1700,1800],labels:["County A","County B","County C","County D","County E","County F","County G","County H"],phrase:"implies counties with high and low rainfall are categorically different rather than opposite ends of a spectrum",syns:["categorically different rather than opposite ends","spectrum is hidden","unordered colors hide the rainfall gradient","opposite ends of a spectrum","rainfall gradient hidden"]},
  {title:"Hospital Wait Times",desc:"Median ER wait time (minutes) by hospital, ranging from 8 min to 95 min",data:[8,18,30,45,55,70,95],labels:["Hospital A","Hospital B","Hospital C","Hospital D","Hospital E","Hospital F","Hospital G"],phrase:"implies each hospital's wait time is an independent category rather than a position on a continuum from fast to slow",syns:["independent category rather than a position on a continuum","fast to slow continuum hidden","unordered hues hide wait-time ordering","position on a continuum","continuum from fast to slow"]},
  {title:"Soil Lead Contamination",desc:"Soil lead concentration (mg/kg) by site, ranging from 5 to 850 mg/kg",data:[5,40,120,280,450,620,850],labels:["Site 1","Site 2","Site 3","Site 4","Site 5","Site 6","Site 7"],phrase:"implies contamination sites are unrelated when they should show a continuous severity gradient",syns:["unrelated when they should show a continuous severity gradient","severity gradient is lost","continuous severity hidden","sites are unrelated","severity gradient"]},
  {title:"Crop Yield by Farm",desc:"Wheat yield (tonnes/hectare) by farm, ranging from 1.2 to 9.8 t/ha",data:[1.2,2.5,4,5.5,6.8,8.1,9.8],labels:["Farm A","Farm B","Farm C","Farm D","Farm E","Farm F","Farm G"],phrase:"implies farms with different yields belong to distinct unrelated groups instead of expressing a yield gradient",syns:["distinct unrelated groups instead of expressing a yield gradient","yield gradient is invisible","unrelated groups hide yield ordering","yield gradient","distinct unrelated groups"]},
  {title:"Revenue by Product Category",desc:"Total annual revenue ($M) for four product types: Electronics, Apparel, Home, Food",data:[42,31,58,25],labels:["Electronics","Apparel","Home","Food"],phrase:"sequential ramp falsely implies product categories have a ranked relationship",syns:["sequential ramp falsely implies","ranked relationship between categories","implies ordering where none exists","falsely implies product categories","no inherent order"]},
  {title:"Website Traffic by Source",desc:"Monthly visits (thousands) by traffic source: Organic, Paid, Social, Direct, Email",data:[85,42,33,67,18],labels:["Organic","Paid","Social","Direct","Email"],phrase:"sequential ramp falsely implies traffic sources have a natural progression or hierarchy",syns:["falsely implies traffic sources have a natural progression","hierarchy among sources","implies ordering among unordered sources","traffic sources have a natural progression","false hierarchy"]},
  {title:"Support Tickets by Department",desc:"Monthly support tickets by department: Engineering, Marketing, Sales, HR, Finance",data:[120,45,88,32,61],labels:["Engineering","Marketing","Sales","HR","Finance"],phrase:"sequential ramp falsely implies departments are ranked by importance or size",syns:["falsely implies departments are ranked","ranked by importance","departments are ordered","false ranking of departments","no ranking exists"]},
  {title:"Energy Mix by Source",desc:"Electricity generation (GWh) by source: Coal, Gas, Nuclear, Wind, Solar",data:[340,520,180,290,150],labels:["Coal","Gas","Nuclear","Wind","Solar"],phrase:"sequential ramp falsely implies energy sources exist on a spectrum from low to high",syns:["exist on a spectrum from low to high","false spectrum among energy sources","energy sources have no inherent order","spectrum from low to high","no spectrum exists"]},
  {title:"Customer Complaints by Type",desc:"Total complaints by type: Delivery, Quality, Billing, Returns, Support",data:[215,88,143,77,190],labels:["Delivery","Quality","Billing","Returns","Support"],phrase:"sequential ramp falsely implies complaint types follow a progression from minor to severe",syns:["follow a progression from minor to severe","implies complaint types are ordered","minor to severe progression implied","complaint types are not ordered","false progression"]},
  {title:"Survey Responses by Age Group",desc:"Number of survey respondents by age group: 18-24, 25-34, 35-44, 45-54, 55+",data:[310,480,395,260,185],labels:["18-24","25-34","35-44","45-54","55+"],phrase:"sequential ramp falsely implies age groups are ranked by value rather than being distinct cohorts",syns:["ranked by value rather than being distinct cohorts","age groups treated as ordered magnitude","distinct cohorts falsely ranked","distinct cohorts","falsely implies age groups are ranked"]},
  {title:"Temperature Anomaly from Baseline",desc:"Annual temperature anomaly (°C) relative to 1950-1980 baseline, ranging from -2.4 to +3.1°C",data:[-2.4,-1.1,-0.3,0.2,0.8,1.5,2.3,3.1],labels:["1950","1960","1970","1980","1990","2000","2010","2020"],phrase:"one-directional ramp makes negative anomalies appear as small positives rather than below-baseline cooling",syns:["negative anomalies appear as small positives","below-baseline cooling hidden","negative values look like low positives","makes negative anomalies appear","below-baseline"]},
  {title:"Budget Variance from Plan",desc:"Department budget variance (%) from plan, ranging from -18% to +14%",data:[-18,-12,-5,0,3,8,14],labels:["Dept A","Dept B","Dept C","Dept D","Dept E","Dept F","Dept G"],phrase:"one-directional ramp makes -12% variance appear as 'low positive' rather than 'negative'",syns:["makes variance appear as low positive","negative variance hidden","underspending looks like low overspending","-12% variance appear","low positive rather than negative"]},
  {title:"Net Promoter Score by Region",desc:"Net Promoter Score (NPS) by region, ranging from -45 to +72",data:[-45,-20,-5,12,30,50,72],labels:["North","South","East","West","Central","Urban","Rural"],phrase:"one-directional ramp makes negative NPS scores appear as low-positive satisfaction rather than net-detractor regions",syns:["negative NPS scores appear as low-positive","detractor regions hidden","negative NPS looks positive","appear as low-positive","net-detractor regions"]},
  {title:"Profit Margin Change YoY",desc:"Year-over-year profit margin change (pp) by product line, ranging from -9 to +11 percentage points",data:[-9,-4,-1,0,2,6,11],labels:["Line A","Line B","Line C","Line D","Line E","Line F","Line G"],phrase:"one-directional ramp makes products with declining margins look merely 'low' rather than actually worsening",syns:["declining margins look merely low","worsening margins hidden","negative change appears as low positive","declining margins look","actually worsening"]},
  {title:"Sentiment Score by Topic",desc:"Public sentiment score by policy topic (−100 to +100 scale), ranging from -62 to +78",data:[-62,-30,-8,5,22,48,78],labels:["Topic A","Topic B","Topic C","Topic D","Topic E","Topic F","Topic G"],phrase:"one-directional ramp makes strongly negative sentiment appear as a small positive value, masking opposition",syns:["negative sentiment appear as a small positive","masking opposition","opposition hidden by ramp","negative sentiment appear","masking opposition"]},
  {title:"Elevation Change from Sea Level Reference",desc:"Terrain elevation change (m) relative to local sea-level reference, from -85 m to +210 m",data:[-85,-30,0,25,70,140,210],labels:["Zone A","Zone B","Zone C","Zone D","Zone E","Zone F","Zone G"],phrase:"one-directional ramp makes below-sea-level zones appear as low-elevation positive values, hiding that they are below the reference",syns:["below-sea-level zones appear as low-elevation positive","below the reference hidden","negative elevation looks positive","below-sea-level zones","hiding that they are below the reference"]},
].map((e, i) => {
  const isSeq = i < 6, isDiv = i >= 12;
  return { ...e, id: i, correctSchemeType: isSeq ? 'sequential' : isDiv ? 'diverging' : 'categorical' };
});

export const id = 'q-colorencoding-server';
export const title = 'Fix the Color Encoding Mismatch';

export function solve(email) {
  const r = rng(`${email}#q-colorencoding-server`);
  const idx = Math.floor(r() * SCENARIOS.length);
  const s = SCENARIOS[idx];
  const scheme = s.correctSchemeType;
  const colors = scheme === 'categorical'
    ? PALETTES.categorical.slice(0, s.data.length)
    : scheme === 'diverging'
      ? pickDivergingColors(PALETTES[scheme], s.data.length)
      : pickColors(PALETTES[scheme], s.data.length);
  const colorsJson = JSON.stringify(colors);
  const dataJson = JSON.stringify(s.data);
  const labelsJson = JSON.stringify(s.labels);

  const htmlAnswer = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${s.title}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <style>
    body { font-family: sans-serif; margin: 16px; }
    canvas { max-height: 280px; }
  </style>
</head>
<body>
  <!-- ${scheme} color scheme -->
  <!-- The original chart used a wrong color scheme which ${s.syns[0]}. -->
  <!-- The correct scheme type is ${scheme} because the data represents ${scheme === 'sequential' ? 'an ordered low-to-high range' : scheme === 'categorical' ? 'unordered distinct groups' : 'values diverging around a meaningful midpoint'}. -->
  <!-- ${s.phrase} -->
  <h2>${s.title}</h2>
  <p>${s.desc}</p>
  <canvas id="chart"></canvas>
  <script>
    const colors = ${colorsJson};
    new Chart(document.getElementById('chart'), {
      type: 'bar',
      data: {
        labels: ${labelsJson},
        datasets: [{
          label: '${s.title}',
          data: ${dataJson},
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  </script>
</body>
</html>`;

  return {
    variant: `Scenario #${idx + 1}: ${s.title} (${scheme})`,
    answer: htmlAnswer
  };
}
