// Solver: Narrative Integration Repair
import { rng } from './utils.js';

const SCENARIOS = [
  {title:"Subscription Conversion",chartType:"line",labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"],values:[2.1,2.2,2.3,4.6,4.8,5,5.1,5],yLabel:"Conversion Rate (%)",descTitle:"Monthly Conversion Rate, 2025",required:"conversion rate doubled after April",syns:["conversions doubled after April","conversion doubled after April","post-April conversion doubled"],keyPoint:{x:"Apr",y:4.6},keyword:"accelerating"},
  {title:"Returns Rate",chartType:"line",labels:["Q1","Q2","Q3","Q4"],values:[7.1,7.4,7,3.2],yLabel:"Returns (%)",descTitle:"Quarterly Returns Rate, 2024",required:"returns rate reversed in Q4",syns:["return rate reversed in Q4","Q4 reversed returns","returns dropped sharply in Q4"],keyPoint:{x:"Q4",y:3.2},keyword:"reversed"},
  {title:"Channel CAC",chartType:"bar",labels:["Search","Social","Email","Affiliate","Events"],values:[42,48,39,44,91],yLabel:"CAC ($)",descTitle:"Customer Acquisition Cost by Channel",required:"events CAC is the outlier",syns:["events is the CAC outlier","events channel is the outlier","events cost is the outlier"],keyPoint:{x:"Events",y:91},keyword:"reallocate"},
  {title:"Fulfillment Delay",chartType:"line",labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],values:[1.2,1.1,1.3,1.2,1.4,3.8,3.6],yLabel:"Average Delay (days)",descTitle:"",required:"weekend delays spike sharply",syns:["weekend delays spiked","weekend delay spike","delays surge on weekends"],keyPoint:{x:"Sat",y:3.8},keyword:"staffing"},
  {title:"Campus Energy Use",chartType:"bar",labels:["Library","Labs","Hostels","Admin","Cafeteria"],values:[320,610,410,260,290],yLabel:"kWh per Day",descTitle:"Energy Use by Building",required:"labs consume far more energy",syns:["labs use far more energy","lab energy dominates","labs are the energy outlier"],keyPoint:{x:"Labs",y:610},keyword:"investigate"},
  {title:"Defect Rate",chartType:"line",labels:["Batch 1","Batch 2","Batch 3","Batch 4","Batch 5","Batch 6"],values:[2.4,2.6,2.5,6.9,2.7,2.5],yLabel:"Defect Rate (%)",descTitle:"Defect Rate by Batch",required:"batch 4 is the outlier",syns:["batch 4 is an outlier","batch 4 defect outlier","defects spike in batch 4"],keyPoint:{x:"Batch 4",y:6.9},keyword:"outlier"},
  {title:"Support Wait Time",chartType:"line",labels:["Jan","Feb","Mar","Apr","May","Jun"],values:[11,10,9,8,16,17],yLabel:"Minutes",descTitle:"Support Wait Time by Month",required:"wait times worsened after April",syns:["wait time worsened after April","after April waits worsened","wait times jumped after April"],keyPoint:{x:"May",y:16},keyword:"capacity"},
  {title:"Exam Completion",chartType:"bar",labels:["Cohort A","Cohort B","Cohort C","Cohort D"],values:[81,79,84,58],yLabel:"Completion Rate (%)",descTitle:"",required:"cohort D lags far behind",syns:["cohort D is far behind","cohort D trails badly","cohort D is lagging"],keyPoint:{x:"Cohort D",y:58},keyword:"intervene"},
  {title:"Ad Recall",chartType:"line",labels:["Week 1","Week 2","Week 3","Week 4","Week 5"],values:[31,33,47,48,49],yLabel:"Recall Score",descTitle:"Weekly Ad Recall Score",required:"ad recall jumped in week 3",syns:["recall jumped in week 3","week 3 recall jump","ad recall surged in week 3"],keyPoint:{x:"Week 3",y:47},keyword:"message"},
  {title:"Rainfall",chartType:"bar",labels:["North","South","East","West","Central"],values:[82,79,85,81,129],yLabel:"Rainfall (mm)",descTitle:"Regional Rainfall Totals",required:"central rainfall is the outlier",syns:["central is the rainfall outlier","central region is the outlier","central rainfall spikes"],keyPoint:{x:"Central",y:129},keyword:"outlier"},
  {title:"Donor Retention",chartType:"line",labels:["2019","2020","2021","2022","2023"],values:[61,60,59,66,68],yLabel:"Retention (%)",descTitle:"",required:"donor retention recovered after 2021",syns:["retention recovered after 2021","donor retention rebounded after 2021","retention turned after 2021"],keyPoint:{x:"2022",y:66},keyword:"recovery"},
  {title:"Queue Length",chartType:"line",labels:["08:00","09:00","10:00","11:00","12:00","13:00"],values:[7,8,9,21,20,18],yLabel:"People Waiting",descTitle:"Queue Length by Hour",required:"queues break at 11:00",syns:["queue breaks at 11:00","11:00 is the queue break","queues spike at 11:00"],keyPoint:{x:"11:00",y:21},keyword:"bottleneck"},
  {title:"Price Elasticity",chartType:"bar",labels:["Basic","Plus","Pro","Enterprise"],values:[-2,-4,-6,-19],yLabel:"Demand Change (%)",descTitle:"Demand Change by Plan",required:"enterprise demand fell the most",syns:["enterprise fell the most","enterprise demand dropped most","enterprise saw the steepest fall"],keyPoint:{x:"Enterprise",y:-19},keyword:"pricing"},
  {title:"Referral Share",chartType:"line",labels:["Jan","Feb","Mar","Apr","May","Jun"],values:[14,15,16,16,16,16],yLabel:"Referral Share (%)",descTitle:"",required:"referral share plateaued after March",syns:["referrals plateaued after March","referral plateau after March","referral share flattened after March"],keyPoint:{x:"Apr",y:16},keyword:"plateau"},
  {title:"Medication Adherence",chartType:"bar",labels:["18-24","25-34","35-44","45-54","55-64","65+"],values:[58,61,69,73,76,78],yLabel:"Adherence (%)",descTitle:"Adherence by Age Group",required:"young adults have the lowest adherence",syns:["young adults have lowest adherence","18-24 has the lowest adherence","youngest group lags adherence"],keyPoint:{x:"18-24",y:58},keyword:"target"},
  {title:"Shipment Accuracy",chartType:"line",labels:["Jan","Feb","Mar","Apr","May","Jun","Jul"],values:[96.1,96.4,96.2,96.3,92.1,92.4,92.6],yLabel:"Accuracy (%)",descTitle:"Shipment Accuracy by Month",required:"accuracy dropped after April",syns:["accuracy dropped after April","post-April accuracy fell","shipment accuracy fell after April"],keyPoint:{x:"May",y:92.1},keyword:"investigate"},
  {title:"Daily Active Users",chartType:"line",labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],values:[120,124,126,127,129,160,158],yLabel:"Users (k)",descTitle:"Daily Active Users by Day",required:"weekend usage surged",syns:["weekend usage surged sharply","usage surged on weekends","weekend users surged"],keyPoint:{x:"Sat",y:160},keyword:"campaign"},
  {title:"Store Margin",chartType:"bar",labels:["Store A","Store B","Store C","Store D","Store E"],values:[18,19,20,9,21],yLabel:"Margin (%)",descTitle:"",required:"store D is the margin outlier",syns:["store D is a margin outlier","store D margin outlier","store D underperforms margin"],keyPoint:{x:"Store D",y:9},keyword:"investigate"},
  {title:"Vaccination Uptake",chartType:"line",labels:["Phase 1","Phase 2","Phase 3","Phase 4"],values:[22,23,24,41],yLabel:"Uptake (%)",descTitle:"Vaccination Uptake by Phase",required:"uptake jumped in phase 4",syns:["uptake jumped in Phase 4","phase 4 drove uptake","uptake surged in phase 4"],keyPoint:{x:"Phase 4",y:41},keyword:"scale"},
  {title:"Reading Scores",chartType:"bar",labels:["School 1","School 2","School 3","School 4","School 5"],values:[71,69,72,54,70],yLabel:"Score",descTitle:"Reading Scores by School",required:"school 4 trails the pack",syns:["school 4 trails badly","school 4 lags the pack","school 4 is far behind"],keyPoint:{x:"School 4",y:54},keyword:"support"},
];

export const id = 'q-narrative-integration-repair';
export const title = 'Narrative Integration Repair';

export function solve(email) {
  const r = rng(`${email}#q-narrative-integration-repair`);
  const idx = Math.floor(r() * SCENARIOS.length);
  const s = SCENARIOS[idx];
  const kp = s.keyPoint;

  const answer = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${s.required}</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.0.1/dist/chartjs-plugin-annotation.min.js"><\/script>
  <style>
    body { font-family: Georgia, serif; margin: 20px; }
    .wrap { max-width: 760px; margin: 0 auto; }
    canvas { width: 100%; max-height: 340px; }
    .caption { margin-top: 12px; font-size: 0.95rem; color: #6b7280; }
  </style>
</head>
<body>
  <div class="wrap">
    <canvas id="chart"></canvas>
    <p class="caption">This finding should drive ${s.keyword} — the break point at ${kp.x} (${kp.y}) changes what someone should do or think differently about the situation.</p>
  </div>
  <script>
    const annotationPlugin = window['chartjs-plugin-annotation'] || window.ChartAnnotation;
    if (annotationPlugin) Chart.register(annotationPlugin);
    new Chart(document.getElementById('chart'), {
      type: '${s.chartType}',
      data: {
        labels: ${JSON.stringify(s.labels)},
        datasets: [{
          label: ${JSON.stringify(s.title)},
          data: ${JSON.stringify(s.values)},
          borderColor: '#2563eb',
          backgroundColor: '${s.chartType === 'bar' ? '#93c5fd' : 'rgba(37, 99, 235, 0.15)'}',
          borderWidth: 2,
          tension: 0.25,
          fill: ${s.chartType === 'line' ? 'false' : 'true'}
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: ${JSON.stringify(s.required)}
          },
          annotation: {
            annotations: {
              keyPoint: {
                type: 'point',
                xValue: ${JSON.stringify(kp.x)},
                yValue: ${kp.y},
                backgroundColor: 'rgba(255, 99, 132, 0.25)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 2,
                radius: 8,
                label: {
                  display: true,
                  content: 'Key: ${kp.x} = ${kp.y}',
                  position: 'start'
                }
              }
            }
          }
        },
        scales: {
          y: { title: { display: true, text: ${JSON.stringify(s.yLabel)} } }
        }
      }
    });
  <\/script>
</body>
</html>`;

  return {
    variant: `Scenario #${idx + 1}: ${s.title} — "${s.required}"`,
    answer
  };
}
