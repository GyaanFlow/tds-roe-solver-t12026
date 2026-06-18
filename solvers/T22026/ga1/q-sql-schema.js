// Solver: Q16 — SQL schema from CSV files (programmatic)
import { normalizeEmail } from './utils.js';

export const id = 'q-generate-schema';
export const title = 'Q16: Infer SQL Schema from CSVs';

const SCHEMA_SQL = `CREATE TABLE customers (
    customer_id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    signup_date TEXT NOT NULL,
    account_status TEXT NOT NULL CHECK (account_status IN ('active', 'inactive')),
    loyalty_points INTEGER NOT NULL CHECK (loyalty_points >= 0)
);

CREATE TABLE products (
    product_id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL CHECK (price > 0),
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    supplier_id TEXT NOT NULL
);

CREATE TABLE orders (
    order_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    order_date TEXT NOT NULL,
    total_amount REAL NOT NULL CHECK (total_amount > 0),
    status TEXT NOT NULL CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),
    shipping_address TEXT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE order_items (
    order_item_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price REAL NOT NULL CHECK (unit_price > 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);`;

export async function solve(email) {
  const norm = normalizeEmail(email);

  return {
    type: 'solved',
    answer: SCHEMA_SQL,
    variant: `Standard normalized DDL for ${norm}`,
    answerDisplay: [
      `### Q16: Infer SQL Schema from CSVs`,
      `**Answer (Verbatim SQL DDL):**`,
      `\`\`\`sql`,
      SCHEMA_SQL,
      `\`\`\``
    ].join('\n')
  };
}
