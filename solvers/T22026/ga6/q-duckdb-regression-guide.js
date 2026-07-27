import { normalizeEmail } from './utils.js';

export const id = 'q-duckdb-regression-analysis';
export const title = 'Q3: DuckDB — Multi-Table Linear Regression Analysis';

function escapeSqlString(value) {
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

  const defaultSqlQuery = buildQuery({ location: '<YOUR_LOCATION>', minSqft: '<MIN_SQFT>', minMonth: '<MIN_MONTH>' });

  const guide = [
    `## Q3 — DuckDB Multi-Table Regression (for ${norm})`,
    ``,
    `### Direct Ready-to-Paste SQL Query Template`,
    '```sql',
    defaultSqlQuery,
    '```',
    ``,
    `### 🚀 Interactive Query Generator — type your exam page values below`,
    ``,
    '<div style="background:linear-gradient(135deg,#0f2444 0%,#1a3a6b 100%);border-radius:14px;padding:24px 28px;margin:18px 0;color:#e8f0fe;border:1px solid #2d4d80;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#4da6ff;text-transform:uppercase;margin-bottom:14px;font-weight:700;">🧭 Read these three values off your own exam page first</div>',
    '  <ol style="margin:0 0 18px;padding-left:20px;font-size:14px;line-height:1.8;color:#dbe9ff;">',
    `    <li>Type your exam page's <strong>Location</strong>, <strong>Minimum square footage</strong>, and <strong>Minimum month</strong> below.</li>`,
    `    <li>Click <strong>"Generate My SQL Query"</strong> to produce your exact filled SQL query.</li>`,
    '  </ol>',
    '  <div style="display:grid;gap:14px;max-width:480px;">',
    '    <label style="font-size:13px;font-weight:600;color:#9fc6ff;">Location',
    '      <input id="ga6q3Location" type="text" placeholder="Springfield" style="width:100%;margin-top:6px;padding:10px 12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-family:monospace;font-size:14px;box-sizing:border-box;" />',
    '    </label>',
    '    <label style="font-size:13px;font-weight:600;color:#9fc6ff;">Minimum square footage',
    '      <input id="ga6q3MinSqft" type="number" min="0" step="1" placeholder="3000" style="width:100%;margin-top:6px;padding:10px 12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-family:monospace;font-size:14px;box-sizing:border-box;" />',
    '    </label>',
    '    <label style="font-size:13px;font-weight:600;color:#9fc6ff;">Minimum month (1-12)',
    '      <input id="ga6q3MinMonth" type="number" min="1" max="12" step="1" placeholder="6" style="width:100%;margin-top:6px;padding:10px 12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#e8f0fe;font-family:monospace;font-size:14px;box-sizing:border-box;" />',
    '    </label>',
    '    <button onclick="window._ga6q3Generate()" style="background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;border:none;border-radius:10px;padding:13px 20px;font-weight:700;font-size:14px;cursor:pointer;">⚙️ Generate My SQL Query</button>',
    '    <div id="ga6q3Status" style="font-size:13px;min-height:18px;font-weight:600;"></div>',
    '    <textarea id="ga6q3Output" readonly rows="14" placeholder="Your generated query will appear here..." style="width:100%;padding:12px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#a6e3a1;font-family:monospace;font-size:13px;box-sizing:border-box;resize:vertical;"></textarea>',
    '    <button onclick="window._ga6q3Copy()" style="background:#198754;color:#fff;border:none;border-radius:10px;padding:11px 18px;font-weight:700;font-size:13px;cursor:pointer;">📋 Copy Query to Clipboard</button>',
    '  </div>',
    '</div>'
  ].join('\n');

  return {
    type: 'solved',
    answer: defaultSqlQuery,
    variant: `DuckDB Regression Query Generator for ${norm}`,
    answerDisplay: [
      `### Q3: DuckDB Multi-Table Linear Regression`,
      ``,
      `**Direct SQL Query Answer:**`,
      '```sql',
      defaultSqlQuery,
      '```',
      ``,
      `Enter your 3 exam page values (Location, Min Sqft, Min Month) in the generator panel below to fill in your exact thresholds.`
    ].join('\n'),
    guide
  };
}
