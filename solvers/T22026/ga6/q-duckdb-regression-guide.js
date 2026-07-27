import { normalizeEmail } from './utils.js';

export const id = 'q-duckdb-regression-analysis';
export const title = 'Q3: DuckDB — Multi-Table Linear Regression Analysis';

export async function solve(email) {
  const norm = normalizeEmail(email);

  const summary = [
    `Write a single DuckDB SQL query joining "stores" and "sales_data", filtering to the`,
    `location + square-footage + month threshold shown on your own exam page, and computing`,
    `REGR_SLOPE/REGR_INTERCEPT/REGR_R2 between square footage and total sales. Unlike other`,
    `GA6 questions, this one's filter values are displayed directly on your live exam page and`,
    `your query runs against tables already loaded in that same browser tab — nothing to`,
    `precompute from your email offline.`
  ].join(' ');

  const guide = [
    `## Q3 — DuckDB Multi-Table Regression: step-by-step (for ${norm})`,
    ``,
    `### Why this solver can't give you the exact answer`,
    `The three tables (\`stores\`, \`sales_data\`, \`marketing_spend\`) are generated with`,
    `per-student faker-seeded company names, dates, and thresholds, instantiated in a DuckDB-WASM`,
    `connection **inside your own browser tab** when you open the question. Your submitted SQL`,
    `runs against that same in-memory instance. Since the exact thresholds are already shown to`,
    `you in plain text on the page itself, there's nothing to derive from your email — you just`,
    `need the right query. That's what this guide gives you.`,
    ``,
    `### The three tables`,
    `- **stores**: \`store_id\`, \`store_name\`, \`opening_date\` (mixed formats: YYYY-MM-DD,`,
    `  MM/DD/YYYY, DD/MM/YYYY), \`location\`, \`square_footage\`.`,
    `- **sales_data**: \`store_id\`, \`sale_date\` (TIMESTAMP), \`monthly_sales\`, \`customer_count\`,`,
    `  \`avg_transaction\`.`,
    `- **marketing_spend**: \`store_id\`, \`spend_date\` (TIMESTAMP), \`marketing_spend\`,`,
    `  \`advertising_channel\` — not needed for this specific regression, only joined tables are.`,
    ``,
    `### Read these three values off your own exam page before writing SQL`,
    `The question text names, in bold: a **location** (e.g. "Springfield"), a **minimum square`,
    `footage** threshold, and a **minimum month** threshold. Substitute your own values into the`,
    `template below — do not guess or reuse someone else's numbers, they're seeded per student.`,
    ``,
    `### The query template (fill in your own LOCATION / MIN_SQFT / MIN_MONTH)`,
    '```sql',
    `WITH store_totals AS (`,
    `  SELECT`,
    `    s.store_id,`,
    `    s.square_footage,`,
    `    SUM(sd.monthly_sales) AS total_sales`,
    `  FROM stores s`,
    `  JOIN sales_data sd ON s.store_id = sd.store_id`,
    `  WHERE s.location = 'LOCATION'`,
    `    AND s.square_footage >= MIN_SQFT`,
    `    AND EXTRACT(MONTH FROM sd.sale_date) >= MIN_MONTH`,
    `  GROUP BY s.store_id, s.square_footage`,
    `)`,
    `SELECT`,
    `  REGR_SLOPE(total_sales, square_footage) AS slope,`,
    `  REGR_INTERCEPT(total_sales, square_footage) AS intercept,`,
    `  REGR_R2(total_sales, square_footage) AS r_squared`,
    `FROM store_totals;`,
    '```',
    ``,
    `### Why this query is structured this way`,
    `1. **Join first, then filter** — the WHERE clause needs both \`stores.location\`/`,
    `   \`square_footage\` and \`sales_data.sale_date\`, so the join must happen before filtering.`,
    `2. **\`sale_date\` is already a TIMESTAMP column** in the table (DuckDB inserted it from the`,
    `   generator's own mixed-format strings at table-creation time) — you don't need to parse`,
    `   date formats yourself here; \`EXTRACT(MONTH FROM ...)\` works directly on the TIMESTAMP.`,
    `   (Mixed-format parsing only matters for the *other* GA6 DuckDB question, Q5.)`,
    `3. **Aggregate per store BEFORE regressing** — the regression is between one store's total`,
    `   *annual* sales (after filtering to qualifying months) and that store's square footage,`,
    `   not between individual monthly sales rows and square footage.`,
    `4. **\`REGR_SLOPE\`/\`REGR_INTERCEPT\`/\`REGR_R2\`** are DuckDB's built-in aggregate regression`,
    `   functions: given \`(y, x)\` pairs, they return the ordinary-least-squares slope,`,
    `   intercept, and R² directly — no manual sum-of-squares arithmetic needed.`,
    ``,
    `### Submit`,
    `Paste your SQL query into the textarea and click Check. The console will show your`,
    `computed slope/intercept/r_squared next to the page's own reference values — they must`,
    `match within a small numeric tolerance.`,
    ``,
    `### Common mistakes`,
    `- Filtering on \`location\`/\`square_footage\` before joining sales data, which silently`,
    `  drops stores that would otherwise qualify once their sales are summed.`,
    `- Using \`monthly_sales\` directly in the regression instead of the store-level`,
    `  \`SUM(monthly_sales)\` — the regression is against **total** sales per store, not each`,
    `  month's row individually.`,
    `- Forgetting \`GROUP BY\` both \`store_id\` **and** \`square_footage\` in the CTE — DuckDB`,
    `  requires every non-aggregated selected column in the GROUP BY.`,
    `- Copy-pasting another student's location/threshold values instead of reading your own`,
    `  page — these are seeded per student and won't match your own tables.`
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `DuckDB regression query template for ${norm}`,
    answerDisplay: [
      `### Q3: DuckDB Multi-Table Linear Regression`,
      ``,
      `Your filter thresholds are shown directly on your own exam page and your query runs`,
      `against tables already loaded in that same tab — this offline solver gives you the`,
      `correct, ready-to-fill SQL template instead.`,
      ``,
      summary,
      ``,
      `Full query template plus the reasoning behind each clause is in the guide below.`
    ].join('\n'),
    guide
  };
}
