// Solver: Q17 — SQL: Average Order Value (programmatic query)
import { normalizeEmail } from './utils.js';

export const id = 'q-sql-order-average';
export const title = 'Q17: SQL: Average Order Value';

const SQL_QUERY = `SELECT AVG(quantity * unit_price) FROM orders WHERE LOWER(status) = 'shipped';`;

export async function solve(email) {
  const norm = normalizeEmail(email);

  return {
    type: 'solved',
    answer: SQL_QUERY,
    variant: `SQL query for ${norm}`,
    answerDisplay: [
      `### Q17: SQL: Average Order Value`,
      `**Answer (SQL Query):**`,
      `\`\`\`sql`,
      SQL_QUERY,
      `\`\`\``
    ].join('\n')
  };
}
