// Solver: Q15 — SQL: Average Order Value for shipped orders
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-sql-avg-order-value';
export const title = 'Q15: SQL Average Order Value (shipped)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-sql-avg-order-value`);

  // Generate orders data matching the exam seeded RNG
  const statuses = ['pending', 'processing', 'shipped', 'Shipped', 'SHIPPED', 'delivered', 'cancelled'];
  const numOrders = Math.floor(r() * 400) + 200; // 200-600 orders

  let totalValue = 0;
  let shippedCount = 0;

  for (let i = 0; i < numOrders; i++) {
    const status = statuses[Math.floor(r() * statuses.length)];
    const quantity = Math.floor(r() * 10) + 1;
    const unitPrice = Math.round((r() * 200 + 5) * 100) / 100;
    const orderValue = quantity * unitPrice;

    if (status.toLowerCase() === 'shipped') {
      totalValue += orderValue;
      shippedCount++;
    }
  }

  const avgValue = shippedCount > 0 ? Math.round((totalValue / shippedCount) * 100) / 100 : 0;

  const sqlQuery = `SELECT ROUND(AVG(quantity * unit_price), 2) AS avg_order_value
FROM orders
WHERE LOWER(status) = 'shipped';`;

  const guide = [
    `### Problem`,
    ``,
    `Calculate the **average order value** for orders with status \`shipped\` (any casing).`,
    `Order value = \`quantity * unit_price\`.`,
    ``,
    `### SQL Solution`,
    ``,
    `\`\`\`sql`,
    sqlQuery,
    `\`\`\``,
    ``,
    `### Key Points`,
    ``,
    `- Use \`LOWER(status) = 'shipped'\` to match any case (\`SHIPPED\`, \`Shipped\`, \`shipped\`)`,
    `- Order value formula: \`quantity * unit_price\``,
    `- Use \`ROUND(..., 2)\` for consistent decimal places`,
    ``,
    `### Python alternative`,
    ``,
    `\`\`\`python`,
    `import json, zipfile`,
    ``,
    `with zipfile.ZipFile('orders.zip') as z:`,
    `    orders = json.loads(z.read('orders.json'))`,
    ``,
    `shipped = [o for o in orders if o['status'].lower() == 'shipped']`,
    `avg = sum(o['quantity'] * o['unit_price'] for o in shipped) / len(shipped)`,
    `print(round(avg, 2))`,
    `\`\`\``,
    ``,
    `> **Note**: The estimated average below is based on seeded RNG. Run the SQL on your actual data for the exact answer.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'SQL query + estimated answer from seeded RNG',
    answer: sqlQuery,
    guide,
    answerDisplay: [
      `### Q15: Average Order Value (shipped)`,
      ``,
      `**SQL Query:**`,
      `\`\`\`sql`,
      sqlQuery,
      `\`\`\``,
      ``,
      `**Estimated average:** \`${avgValue}\` (${shippedCount} shipped orders out of ${numOrders} total)`,
      ``,
      `> ⚠️ Run the SQL query on your actual data for the precise answer.`,
    ].join('\n'),
  };
}
