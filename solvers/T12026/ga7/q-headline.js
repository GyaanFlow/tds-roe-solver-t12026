// Solver: Headline Rewriting (Description vs Finding)
import { fnvHash, normalizeEmail, rng } from './utils.js';

const DATASETS = [
  {id:0,name:"Regional revenue",metric:"Revenue (M USD)",rows:[{period:"2022",north:48,south:52,east:38,west:50},{period:"2023",north:54,south:55,east:42,west:53},{period:"2024",north:71,south:57,east:44,west:56}],
   headlines:[{text:"Regional Revenue by Year",kind:"description",required:"north grew fastest",syns:["north leads growth","north accelerated fastest"]},{text:"Northeast revenue grew 3× faster than the average",kind:"finding"},{text:"South remained nearly flat after 2023",kind:"finding"},{text:"Revenue Comparison Across Regions",kind:"description",required:"east remains lowest",syns:["east still lowest","east lags all regions"]},{text:"Annual Trends in West Region Revenue",kind:"description",required:"west shows steady gains",syns:["west grows steadily","west increases consistently"]},{text:"Only East stayed below 45M in 2024",kind:"finding"}]},
  {id:1,name:"Customer churn",metric:"Churn (%)",rows:[{period:"Q1",basic:7.8,plus:5.4,premium:3.2},{period:"Q2",basic:8.1,plus:5.3,premium:3.0},{period:"Q3",basic:8.4,plus:5.0,premium:2.8},{period:"Q4",basic:8.5,plus:4.7,premium:2.7}],
   headlines:[{text:"Quarterly Churn by Plan",kind:"description",required:"basic churn worsened",syns:["basic churn increased","basic plan deteriorated"]},{text:"Premium churn fell below 3% by Q3",kind:"finding"},{text:"Plan-wise Churn Analysis",kind:"description",required:"premium lowest all quarters",syns:["premium consistently lowest","premium stays lowest"]},{text:"Plus plan churn steadily improved",kind:"finding"},{text:"Churn Trend Comparison",kind:"description",required:"gap widened between basic and premium",syns:["basic premium gap widened","difference expanded"]},{text:"Basic ended 1.8x premium churn",kind:"finding"}]},
  {id:2,name:"Hospital wait times",metric:"Median minutes",rows:[{period:"Jan",er:61,surgery:38,diagnostics:42},{period:"Feb",er:64,surgery:39,diagnostics:40},{period:"Mar",er:72,surgery:41,diagnostics:39},{period:"Apr",er:70,surgery:40,diagnostics:37}],
   headlines:[{text:"Department Wait Times",kind:"description",required:"er spikes in march",syns:["er peaked in march","march er spike"]},{text:"Diagnostics improved each month",kind:"finding"},{text:"Monthly Median Wait Duration",kind:"description",required:"er remains longest queue",syns:["er still longest","er highest waits"]},{text:"Surgery queue stayed stable near 40 minutes",kind:"finding"},{text:"Comparison of ER, Surgery, and Diagnostics",kind:"description",required:"diagnostics overtook surgery by april",syns:["diagnostics below surgery by april","diagnostics becomes shortest"]},{text:"ER wait time reversed slightly after March",kind:"finding"}]},
  {id:3,name:"City transit ridership",metric:"Daily riders (k)",rows:[{period:"Mon",bus:220,metro:310,tram:120},{period:"Tue",bus:224,metro:318,tram:118},{period:"Wed",bus:229,metro:330,tram:121},{period:"Thu",bus:232,metro:335,tram:125}],
   headlines:[{text:"Weekday Ridership by Mode",kind:"description",required:"metro dominates volume",syns:["metro highest each day","metro leads every day"]},{text:"Tram recovered after Tuesday dip",kind:"finding"},{text:"Transit Usage Report",kind:"description",required:"bus rises steadily",syns:["bus climbs daily","bus shows steady increase"]},{text:"Metro crossed 330k by Wednesday",kind:"finding"},{text:"Mode-wise Daily Comparison",kind:"description",required:"tram remains smallest mode",syns:["tram lowest ridership","tram trails bus and metro"]},{text:"Gap between metro and bus widened by Thursday",kind:"finding"}]},
  {id:4,name:"Energy mix",metric:"Share (%)",rows:[{period:"2021",solar:12,wind:21,coal:43},{period:"2022",solar:14,wind:23,coal:39},{period:"2023",solar:18,wind:25,coal:34}],
   headlines:[{text:"Generation Mix by Source",kind:"description",required:"coal declines sharply",syns:["coal fell fastest","coal dropped most"]},{text:"Solar gained 6 points in two years",kind:"finding"},{text:"Share of Solar, Wind and Coal",kind:"description",required:"renewables exceed 40%",syns:["solar plus wind above 40","renewables passed forty"]},{text:"Wind remained the largest renewable source",kind:"finding"},{text:"Annual Energy Source Trends",kind:"description",required:"solar growth accelerates after 2022",syns:["solar acceleration after 2022","solar jump in 2023"]},{text:"Coal fell below one-third only in 2023",kind:"finding"}]},
  {id:5,name:"Student completion",metric:"Completion (%)",rows:[{period:"Cohort A",online:68,hybrid:73,inperson:81},{period:"Cohort B",online:70,hybrid:75,inperson:82},{period:"Cohort C",online:74,hybrid:77,inperson:83}],
   headlines:[{text:"Completion by Delivery Mode",kind:"description",required:"in-person remains highest",syns:["in person highest","inperson leads all cohorts"]},{text:"Online closed one-third of the gap to hybrid",kind:"finding"},{text:"Course Completion Trends",kind:"description",required:"online improves most",syns:["online gains fastest","online sees largest increase"]},{text:"Hybrid improved but stayed mid-tier",kind:"finding"},{text:"Comparison of Learning Modes",kind:"description",required:"gap narrows by cohort c",syns:["differences narrow in cohort c","spread shrinks by final cohort"]},{text:"No cohort saw a decline in completion",kind:"finding"}]},
  {id:6,name:"App latency",metric:"P95 latency (ms)",rows:[{period:"v1.0",web:340,ios:310,android:330},{period:"v1.1",web:290,ios:292,android:305},{period:"v1.2",web:260,ios:274,android:280}],
   headlines:[{text:"Latency by Platform Version",kind:"description",required:"web improved the most",syns:["web drops fastest","web biggest latency reduction"]},{text:"Android remained slowest through v1.2",kind:"finding"},{text:"Performance Comparison Report",kind:"description",required:"ios nearly converges with web",syns:["ios approaches web","ios web gap shrinks"]},{text:"All platforms improved every release",kind:"finding"},{text:"P95 Latency Trends",kind:"description",required:"largest drop happened in v1.0 to v1.1",syns:["biggest reduction first release","largest improvement in first step"]},{text:"Web fell below 300ms by v1.1",kind:"finding"}]},
  {id:7,name:"Marketing funnel",metric:"Users",rows:[{period:"Jan",visits:120000,signup:9600,purchase:2100},{period:"Feb",visits:118000,signup:10400,purchase:2300},{period:"Mar",visits:122000,signup:11200,purchase:2800}],
   headlines:[{text:"Funnel Stage Volumes",kind:"description",required:"purchase conversion improved",syns:["purchase rate improved","visit to purchase rose"]},{text:"Signup volume rose despite flat traffic",kind:"finding"},{text:"Monthly Funnel Analysis",kind:"description",required:"largest gain at purchase stage",syns:["purchase stage gained most","bottom funnel improved fastest"]},{text:"Visits stayed nearly constant across months",kind:"finding"},{text:"Traffic to Purchase Comparison",kind:"description",required:"march outperforms on all stages",syns:["march leads all stages","march strongest funnel"]},{text:"Purchase count jumped one-third in March",kind:"finding"}]},
  {id:8,name:"Loan default",metric:"Default rate (%)",rows:[{period:"Prime",2022:1.8,2023:1.6,2024:1.7},{period:"Near-prime",2022:3.2,2023:3.1,2024:3.4},{period:"Sub-prime",2022:6.5,2023:6.1,2024:6.8}],
   headlines:[{text:"Default Rates by Segment",kind:"description",required:"sub-prime rebound in 2024",syns:["subprime rises in 2024","sub-prime reverses upward"]},{text:"Prime stayed below 2% every year",kind:"finding"},{text:"Credit Risk Segment Comparison",kind:"description",required:"near-prime drifted upward after 2023",syns:["near prime worsened in 2024","near-prime uptick"]},{text:"Sub-prime remained ~4x prime risk",kind:"finding"},{text:"Annual Default Trend Overview",kind:"description",required:"2023 was temporary improvement",syns:["improvement in 2023 reversed","short lived decline"]},{text:"All segments improved from 2022 to 2023",kind:"finding"}]},
  {id:9,name:"Warehouse defects",metric:"Defect rate (%)",rows:[{period:"Site A",pre:2.7,post:1.9},{period:"Site B",pre:2.3,post:2.0},{period:"Site C",pre:2.5,post:2.6}],
   headlines:[{text:"Defect Rates Before and After",kind:"description",required:"site a improves most",syns:["site a largest reduction","site a biggest improvement"]},{text:"Only Site C worsened after intervention",kind:"finding"},{text:"Site-wise Quality Metrics",kind:"description",required:"site b modest improvement",syns:["site b slight drop","site b small gain"]},{text:"Average defects still fell overall",kind:"finding"},{text:"Pre/Post Defect Comparison",kind:"description",required:"spread between best and worst widened",syns:["variance widened","gap between sites increased"]},{text:"Intervention benefits were uneven across sites",kind:"finding"}]},
];

export const id = 'q-headline-rewriting';
export const title = 'Headline Rewriting: Description vs Finding';

export function solve(email) {
  const norm = normalizeEmail(email);
  const dataset = DATASETS[fnvHash(norm) % DATASETS.length];
  const r = rng(`headline:${norm}`);

  // Shuffle headlines (same logic as exam)
  const indexed = dataset.headlines.map((h, i) => ({ ...h, origIdx: i }));
  const shuffled = [...indexed];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Generate answer lines
  const lines = shuffled.map((h, i) => {
    const num = i + 1;
    if (h.kind === 'finding') {
      return `${num}|finding|`;
    } else {
      // Rewrite description as finding using the required phrase
      const rewrite = h.required.charAt(0).toUpperCase() + h.required.slice(1);
      return `${num}|description|${rewrite}`;
    }
  });

  const headlineList = shuffled.map((h, i) => `  ${i + 1}. "${h.text}" → ${h.kind}`).join('\n');

  return {
    variant: `Dataset: ${dataset.name} (#${dataset.id + 1}/10)\nShuffled order:\n${headlineList}`,
    answer: lines.join('\n')
  };
}
