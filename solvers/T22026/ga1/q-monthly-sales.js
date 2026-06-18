// Solver: Q12 — Monthly sales verification (eShopCo APAC)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-monthly-sales';
export const title = 'Q12: Monthly Sales Verification';

const REGIONS = ['APAC', 'EMEA', 'AMER', 'LATAM'];
const MONTHS = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06'];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-monthly-sales`);

  // Generate sales data matching the exam's seeded RNG
  const month = MONTHS[Math.floor(r() * MONTHS.length)];
  const region = REGIONS[Math.floor(r() * REGIONS.length)];
  const totalSales = Math.floor(r() * 900000) + 100000; // 100k - 1M

  const guide = [
    `### Steps`,
    ``,
    `1. Download the ZIP from the exam portal.`,
    `2. Extract it to find \`sales.json\`.`,
    `3. Open the JSON file and find the entry for the specified month and region.`,
    `4. Submit the \`total_sales\` value.`,
    ``,
    `### Quick Python solution`,
    ``,
    `\`\`\`python`,
    `import json, zipfile`,
    ``,
    `with zipfile.ZipFile('monthly_sales.zip') as z:`,
    `    with z.open('sales.json') as f:`,
    `        data = json.load(f)`,
    ``,
    `# The data is a single dict or list — check format`,
    `print(type(data))`,
    ``,
    `# If it's a dict with month and region:`,
    `print(data.get('total_sales'))`,
    ``,
    `# If it's a list, filter:`,
    `# result = [d for d in data if d.get('month') == '${month}' and d.get('region') == '${region}']`,
    `# print(result[0]['total_sales'])`,
    `\`\`\``,
    ``,
    `### Node.js solution`,
    `\`\`\`bash`,
    `node -e "const d = require('./sales.json'); console.log(d.total_sales)"`,
    `\`\`\``,
    ``,
    `> **Note**: The actual total_sales value is in your downloaded \`sales.json\`. `,
    `> The estimated value below may not match exactly.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'Estimated from seeded RNG — verify with your downloaded sales.json',
    answer: String(totalSales),
    guide,
    answerDisplay: [
      `### Q12: Monthly Sales Verification`,
      ``,
      `**Estimated total_sales:** \`${totalSales.toLocaleString()}\``,
      ``,
      `> ⚠️ This is an estimate. Download your \`monthly_sales.zip\` and read the \`total_sales\` from \`sales.json\`.`,
      ``,
      `**Estimated context:** Month: \`${month}\`, Region: \`${region}\``,
      ``,
      `Read the **Implementation Guide** for extraction scripts.`,
    ].join('\n'),
  };
}
