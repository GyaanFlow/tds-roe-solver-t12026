import { normalizeEmail } from './utils.js';

export const id = 'q-duckdb-regression-analysis';
export const title = 'Q3: DuckDB — Multi-Table Linear Regression Analysis';

function escapeSqlString(value) {
  // Single-quote SQL string literal — double any embedded single quote, strip anything that
  // isn't printable text (defensive; location names are plain words in practice).
  return String(value).replace(/'/g, "''");
}

function buildQuery({ location, minSqft, minMonth }) {
  const loc = escapeSqlString(location.trim());
  const sqft = Number(minSqft);
  const month = Number(minMonth);
  return [
    'WITH store_totals AS (',
    '  SELECT',
    '    s.store_id,',
    '    s.square_footage,',
    '    SUM(sd.monthly_sales) AS total_sales',
    '  FROM stores s',
    '  JOIN sales_data sd ON s.store_id = sd.store_id',
    `  WHERE s.location = '${loc}'`,
    `    AND s.square_footage >= ${sqft}`,
    `    AND EXTRACT(MONTH FROM sd.sale_date) >= ${month}`,
    '  GROUP BY s.store_id, s.square_footage',
    ')',
    'SELECT',
    '  REGR_SLOPE(total_sales, square_footage) AS slope,',
    '  REGR_INTERCEPT(total_sales, square_footage) AS intercept,',
    '  REGR_R2(total_sales, square_footage) AS r_squared',
    'FROM store_totals;'
  ].join('\n');
}

function registerQ3Interactive() {
  if (typeof window === 'undefined' || window._ga6q3Registered) return;
  window._ga6q3Registered = true;

  window._ga6q3Generate = function () {
    const locationEl = document.getElementById('ga6q3Location');
    const sqftEl = document.getElementById('ga6q3MinSqft');
    const monthEl = document.getElementById('ga6q3MinMonth');
    const statusEl = document.getElementById('ga6q3Status');
    const outputEl = document.getElementById('ga6q3Output');

    const location = (locationEl?.value || '').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();
    const minSqft = sqftEl?.value || '';
    const minMonth = monthEl?.value || '';

    const errors = [];
    if (!location.trim()) errors.push('Location is required.');
    if (minSqft === '' || !Number.isFinite(Number(minSqft)) || Number(minSqft) < 0) {
      errors.push('Minimum square footage must be a non-negative number.');
    }
    if (minMonth === '' || !Number.isInteger(Number(minMonth)) || Number(minMonth) < 1 || Number(minMonth) > 12) {
      errors.push('Minimum month must be a whole number from 1 to 12.');
    }

    if (errors.length > 0) {
      if (statusEl) {
        statusEl.style.color = '#dc3545';
        statusEl.textContent = errors.join(' ');
      }
      if (outputEl) outputEl.value = '';
      return;
    }

    const sql = buildQuery({ location, minSqft, minMonth });
    if (outputEl) outputEl.value = sql;
    if (statusEl) {
      statusEl.style.color = '#198754';
      statusEl.textContent = 'Query generated below — copy it into the exam\'s SQL textarea and click Check.';
    }
  };

  window._ga6q3Copy = async function () {
    const outputEl = document.getElementById('ga6q3Output');
    const statusEl = document.getElementById('ga6q3Status');
    const text = outputEl?.value || '';
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (statusEl) {
        statusEl.style.color = '#198754';
        statusEl.textContent = 'Copied to clipboard.';
      }
    } catch {
      outputEl.focus();
      outputEl.select();
      if (statusEl) {
        statusEl.style.color = '#dc3545';
        statusEl.textContent = 'Clipboard access blocked — text is selected, press Ctrl+C / Cmd+C to copy.';
      }
    }
  };
}

export async function solve(email) {
  registerQ3Interactive();
  const norm = normalizeEmail(email);

  const summary = [
    `Write a single DuckDB SQL query joining "stores" and "sales_data", filtering to the`,
    `location + square-footage + month threshold shown on your own exam page, and computing`,
    `REGR_SLOPE/REGR_INTERCEPT/REGR_R2 between square footage and total sales. Unlike other`,
    `GA6 questions, this one's filter values are displayed directly on your live exam page and`,
    `your query runs against tables already loaded in that same browser tab — type them into`,
    `the form below and get the exact ready-to-paste query back.`
  ].join(' ');

  const guide = [
    `## Q3 — DuckDB Multi-Table Regression: step-by-step (for ${norm})`,
    ``,
    `### Why this solver can't give you the exact numeric answer`,
    `The three tables (\`stores\`, \`sales_data\`, \`marketing_spend\`) are generated with`,
    `per-student faker-seeded company names, dates, and thresholds, instantiated in a DuckDB-WASM`,
    `connection **inside your own browser tab** when you open the question. Your submitted SQL`,
    `runs against that same in-memory instance, so the actual slope/intercept/r² can only be`,
    `computed there. But the **query itself** doesn't depend on any hidden data — your`,
    `location/threshold values are already shown to you in plain text on the page.`,
    ``,
    `### 🚀 Generate your exact query — just type in what your page shows`,
    ``,
    '<div style="background:linear-gradient(135deg,#0f2444 0%,#1a3a6b 100%);border-radius:14px;padding:24px 28px;margin:18px 0;color:#e8f0fe;border:1px solid #2d4d80;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#4da6ff;text-transform:uppercase;margin-bottom:14px;font-weight:700;">🧭 Read these three values off your own exam page first</div>',
    '  <ol style="margin:0 0 18px;padding-left:20px;font-size:14px;line-height:1.8;color:#dbe9ff;">',
    `    <li>The question text names, in <strong>bold</strong>, a <strong>location</strong> (e.g. "Springfield"), a <strong>minimum square footage</strong> threshold, and a <strong>minimum month</strong> threshold (1-12).</li>`,
    `    <li>Type your own three values below — <strong>do not reuse someone else's numbers</strong>, they're seeded per student and won't match your own tables.</li>`,
    `    <li>Click <strong>"Generate My SQL Query"</strong> to get the exact query with your values already filled in, ready to paste.</li>`,
    '  </ol>',
    '  <div style="display:grid;gap:14px;max-width:480px;">',
    '    <label style="font-size:13px;font-weight:600;color:#9fc6ff;">Location <span style="font-weight:400;color:#7f9cc4;">(exactly as shown, case-sensitive)</span>',
    '      <input id="ga6q3Location" type="text" placeholder="Springfield" style="width:100%;margin-top:6px;padding:10px 12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-family:monospace;font-size:14px;box-sizing:border-box;" />',
    '    </label>',
    '    <label style="font-size:13px;font-weight:600;color:#9fc6ff;">Minimum square footage',
    '      <input id="ga6q3MinSqft" type="number" min="0" step="1" placeholder="3000" style="width:100%;margin-top:6px;padding:10px 12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-family:monospace;font-size:14px;box-sizing:border-box;" />',
    '    </label>',
    '    <label style="font-size:13px;font-weight:600;color:#9fc6ff;">Minimum month <span style="font-weight:400;color:#7f9cc4;">(1-12)</span>',
    '      <input id="ga6q3MinMonth" type="number" min="1" max="12" step="1" placeholder="6" style="width:100%;margin-top:6px;padding:10px 12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-family:monospace;font-size:14px;box-sizing:border-box;" />',
    '    </label>',
    '    <button onclick="window._ga6q3Generate()" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;border:none;border-radius:10px;padding:13px 20px;font-weight:700;font-size:14px;cursor:pointer;box-shadow:0 4px 14px rgba(59,130,246,0.4);">⚙️ Generate My SQL Query</button>',
    '    <div id="ga6q3Status" style="font-size:13px;min-height:18px;font-weight:600;"></div>',
    '    <textarea id="ga6q3Output" readonly rows="14" placeholder="Your generated query will appear here..." style="width:100%;padding:12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#a6e3a1;font-family:monospace;font-size:13px;box-sizing:border-box;resize:vertical;"></textarea>',
    '    <button onclick="window._ga6q3Copy()" style="background:#198754;color:#fff;border:none;border-radius:10px;padding:11px 18px;font-weight:700;font-size:13px;cursor:pointer;">📋 Copy Query to Clipboard</button>',
    '  </div>',
    '  <div style="margin-top:16px;font-size:12px;color:#8fb0dd;">🔒 Everything happens in your browser — nothing is sent anywhere.</div>',
    '</div>',
    ``,
    `### The three tables`,
    `- **stores**: \`store_id\`, \`store_name\`, \`opening_date\` (mixed formats: YYYY-MM-DD,`,
    `  MM/DD/YYYY, DD/MM/YYYY), \`location\`, \`square_footage\`.`,
    `- **sales_data**: \`store_id\`, \`sale_date\` (TIMESTAMP), \`monthly_sales\`, \`customer_count\`,`,
    `  \`avg_transaction\`.`,
    `- **marketing_spend**: \`store_id\`, \`spend_date\` (TIMESTAMP), \`marketing_spend\`,`,
    `  \`advertising_channel\` — not needed for this specific regression, only joined tables are.`,
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
    `Paste the generated query into the exam's SQL textarea and click Check. The console will`,
    `show your computed slope/intercept/r_squared next to the page's own reference values —`,
    `they must match within a small numeric tolerance.`,
    ``,
    `### Common mistakes`,
    `- Typing the location with different capitalization/spacing than what's shown — the`,
    `  comparison is exact-string, case-sensitive.`,
    `- Filtering on \`location\`/\`square_footage\` before joining sales data, which silently`,
    `  drops stores that would otherwise qualify once their sales are summed.`,
    `- Using \`monthly_sales\` directly in the regression instead of the store-level`,
    `  \`SUM(monthly_sales)\` — the regression is against **total** sales per store, not each`,
    `  month's row individually.`,
    `- Copy-pasting another student's location/threshold values instead of your own — these`,
    `  are seeded per student and won't match your own tables.`
  ].join('\n');

  return {
    type: 'solved',
    answer: summary,
    variant: `DuckDB Regression Query Generator for ${norm}`,
    answerDisplay: [
      `### Q3: DuckDB Multi-Table Linear Regression`,
      ``,
      `Your filter thresholds (Location, Min Sqft, Min Month) are displayed on your live exam page.`,
      `Use the interactive query generator form in the guide panel below to instantly output the exact, ready-to-paste DuckDB SQL query for your session:`,
      ``,
      '```sql',
      `WITH store_totals AS (`,
      `  SELECT s.store_id, s.square_footage, SUM(sd.monthly_sales) AS total_sales`,
      `  FROM stores s JOIN sales_data sd ON s.store_id = sd.store_id`,
      `  WHERE s.location = '<YOUR_LOCATION>' AND s.square_footage >= <MIN_SQFT> AND EXTRACT(MONTH FROM sd.sale_date) >= <MIN_MONTH>`,
      `  GROUP BY s.store_id, s.square_footage`,
      `)`,
      `SELECT REGR_SLOPE(total_sales, square_footage) AS slope, REGR_INTERCEPT(total_sales, square_footage) AS intercept, REGR_R2(total_sales, square_footage) AS r_squared FROM store_totals;`,
      '```'
    ].join('\n'),
    guide
  };
}
