// Solver: Q14 — SQL schema from CSV files (eShopCo database)
import { normalizeEmail } from './utils.js';

export const id = 'q-sql-schema';
export const title = 'Q14: SQL Schema from CSV Files';

const SCHEMA_SQL = `-- eShopCo Database Schema
-- Generated from CSV analysis

CREATE TABLE customers (
    customer_id TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    city        TEXT,
    country     TEXT,
    created_at  TEXT NOT NULL
);

CREATE TABLE products (
    product_id  TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT NOT NULL,
    price       REAL NOT NULL CHECK (price > 0),
    stock       INTEGER NOT NULL CHECK (stock >= 0),
    description TEXT
);

CREATE TABLE orders (
    order_id    TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    status      TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    order_date  TEXT NOT NULL,
    total       REAL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    item_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id    TEXT NOT NULL,
    product_id  TEXT NOT NULL,
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    unit_price  REAL NOT NULL CHECK (unit_price > 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);`;

export async function solve(email) {
  const norm = normalizeEmail(email);

  const guide = [
    `### Steps`,
    ``,
    `1. Download the ZIP from the exam portal.`,
    `2. Examine each CSV file to understand the schema:`,
    ``,
    `\`\`\`bash`,
    `head customers.csv`,
    `head products.csv`,
    `head orders.csv`,
    `head order_items.csv`,
    `\`\`\``,
    ``,
    `3. Identify data types and relationships.`,
    `4. Write SQL DDL statements.`,
    `5. Test with SQLite:`,
    ``,
    `\`\`\`bash`,
    `sqlite3 test.db < schema.sql`,
    `sqlite3 test.db ".mode csv" ".import customers.csv customers"`,
    `\`\`\``,
    ``,
    `### Data Type Rules`,
    `- IDs (CUST0001, PROD0001) → \`TEXT\``,
    `- Whole numbers → \`INTEGER\``,
    `- Prices / amounts → \`REAL\``,
    `- Everything else → \`TEXT\``,
    ``,
    `### Constraint Rules`,
    `- Every table needs \`PRIMARY KEY\``,
    `- FK columns (\`*_id\`) need \`FOREIGN KEY\` references`,
    `- Required fields: \`NOT NULL\``,
    `- Business rules: \`CHECK\` constraints`,
    `- Unique fields: \`UNIQUE\` (e.g., email)`,
    ``,
    `### Default Schema (adapt to your CSV headers)`,
    ``,
    `The answer box contains a standard eShopCo schema. Adjust column names and types to match your CSV.`,
    ``,
    `> **Note**: The actual CSV column names may differ. Inspect your downloaded files and adapt the schema accordingly.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'Standard eShopCo 4-table schema — adapt column names to your CSV',
    answer: SCHEMA_SQL,
    guide,
    answerDisplay: [
      `### Q14: SQL Schema`,
      ``,
      `The answer box contains the complete SQL DDL for the eShopCo database.`,
      ``,
      `**Tables:** \`customers\`, \`products\`, \`orders\`, \`order_items\``,
      ``,
      `**Constraints included:** PRIMARY KEY, FOREIGN KEY, NOT NULL, CHECK, UNIQUE`,
      ``,
      `> ⚠️ Inspect your downloaded CSV files and adapt column names if needed.`,
      ``,
      `Read the **Implementation Guide** for testing instructions.`,
    ].join('\n'),
  };
}
