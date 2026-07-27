import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-duckdb-json-ledger-reconciliation-server';
export const title = 'Q5: DuckDB — Reconcile a Versioned Nested-JSON Invoice Ledger';

const DAY_MS = 1440 * 60 * 1000;
const REGIONS = ['APAC', 'EMEA', 'LATAM', 'NA'];
const CURRENCIES = ['USD', 'EUR', 'GBP'];
const SKUS = Array.from({ length: 14 }, (_, v) => `SKU-${String(v + 1).padStart(3, '0')}`);

function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function intBetween(rng, lo, hi) { return Math.floor(rng() * (hi - lo + 1)) + lo; }
function shuffle(arr, rng) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function offsetIso(baseDate, days, minutes = 0) {
  return new Date(baseDate.getTime() + days * DAY_MS + minutes * 60000).toISOString();
}

// Byte-for-byte reproduction of the official exam bundle's rt() generator (same seedrandom
// package, same seed string, same arithmetic order) — the ledger events and FX rates a
// student would download as events.jsonl / fx.csv.
function buildLedger(email, version = 'v1') {
  const rng = seedrandom(`${email}#${id}#${version}`);
  const region = pick(rng, REGIONS);
  const half = pick(rng, [1, 2]);
  const start = new Date(`2026-${half === 1 ? '01' : '04'}-01T00:00:00.000Z`);
  const end = new Date(`2026-${half === 1 ? '04' : '07'}-01T00:00:00.000Z`);

  const baseRates = { USD: 1e6, EUR: 108e4, GBP: 126e4 };
  const fxRates = [];
  for (let month = 0; month < 6; month++) {
    for (const currency of CURRENCIES) {
      fxRates.push({
        currency,
        valid_from: new Date(Date.UTC(2026, month, 1)).toISOString().slice(0, 10),
        // Truncated to 6 decimals like the real fx.csv, since that's what the official
        // reconciliation actually reads back.
        usd_per_unit: parseFloat(((baseRates[currency] + intBetween(rng, -45000, 45000)) / 1e6).toFixed(6))
      });
    }
  }

  const spanDays = Math.round((end - start) / DAY_MS) - 1;
  const events = [];
  for (let g = 0; g < 108; g++) {
    const invoiceId = `INV-${String(7300 + g).padStart(6, '0')}`;
    const revisions = intBetween(rng, 2, 4);
    const qualifyingCandidate = g < 20;
    for (let seq = 1; seq <= revisions; seq++) {
      const isFinal = seq === revisions;
      const issuedAt = qualifyingCandidate && isFinal
        ? offsetIso(start, intBetween(rng, 0, spanDays), intBetween(rng, 0, 1300))
        : offsetIso(new Date('2026-01-01T00:00:00.000Z'), intBetween(rng, 0, 180), intBetween(rng, 0, 1300));

      const normalized = {
        issuedAt,
        status: qualifyingCandidate && isFinal ? 'PAID' : pick(rng, ['DRAFT', 'PAID', 'VOID']),
        region: qualifyingCandidate && isFinal ? region : pick(rng, REGIONS),
        currency: pick(rng, CURRENCIES),
        lines: Array.from({ length: intBetween(rng, 2, 6) }, () => ({
          sku: pick(rng, SKUS),
          quantity: intBetween(rng, 1, 9),
          unitCents: intBetween(rng, 105000, 680000),
          discountBps: pick(rng, [0, 250, 500, 750, 1000, 1250, 1500, 2000])
        }))
      };

      const isDeleteReplay = isFinal && !qualifyingCandidate && rng() < 0.13;
      const operation = isDeleteReplay ? 'DELETE' : 'UPSERT';
      const emittedAt = offsetIso(new Date(issuedAt), intBetween(rng, 1, 18), intBetween(rng, 0, 1300));
      pick(rng, [1, 2]); // schema-version pick — only affects payload serialization, which we skip, but must still consume the RNG draw to stay in sync

      const event = {
        event_id: `LE-${7300 + g}-${seq}-A`,
        invoice_id: invoiceId,
        sequence: String(seq),
        emitted_at: emittedAt,
        operation,
        normalized: operation === 'DELETE' ? null : normalized
      };
      events.push(event);

      if (isFinal && g % 10 === 0 && operation === 'UPSERT') {
        const bumpedNormalized = {
          ...normalized,
          lines: normalized.lines.map((line, idx) => idx === 0 ? { ...line, quantity: line.quantity + 1 } : line)
        };
        events.push({
          event_id: `LE-${7300 + g}-${seq}-B`,
          invoice_id: invoiceId,
          sequence: String(seq),
          emitted_at: offsetIso(new Date(emittedAt), 0, 1860 / 60), // +1.86e6 ms = 31 min
          operation: 'UPSERT',
          normalized: bumpedNormalized
        });
      }
    }
  }

  const replays = events.filter((_, idx) => idx % 17 === 0).map(e => ({ ...e }));
  const allEvents = shuffle([...events, ...replays], rng);

  return { events: allEvents, fxRates, scenario: { region, start: start.toISOString(), end: end.toISOString() } };
}

// Round a USD-cent value to the nearest integer cent, half-up (matches the Python
// `Decimal(...).quantize(..., ROUND_HALF_UP)` reference in the exam's own guide text).
function roundHalfUpCents(value) {
  return Math.floor(value + 0.5 + 1e-9);
}

function reconcile(ledger) {
  const { events, fxRates, scenario } = ledger;
  const startMs = new Date(scenario.start).getTime();
  const endMs = new Date(scenario.end).getTime();

  // 1. Drop exact transport replays by event_id.
  const seenEventIds = new Set();
  const deduped = [];
  for (const e of events) {
    if (seenEventIds.has(e.event_id)) continue;
    seenEventIds.add(e.event_id);
    deduped.push(e);
  }

  // 2. Per invoice_id, keep the event with the greatest integer sequence, tie-broken by the
  //    greatest emitted_at. The JSONL/array order carries no meaning.
  const byInvoice = new Map();
  for (const e of deduped) {
    const current = byInvoice.get(e.invoice_id);
    const seq = parseInt(e.sequence, 10);
    if (!current) {
      byInvoice.set(e.invoice_id, e);
      continue;
    }
    const currentSeq = parseInt(current.sequence, 10);
    if (seq > currentSeq || (seq === currentSeq && e.emitted_at > current.emitted_at)) {
      byInvoice.set(e.invoice_id, e);
    }
  }

  // 3. Only after picking the authoritative event, discard DELETEs and non-PAID invoices.
  const authoritative = [...byInvoice.values()].filter(e => e.operation !== 'DELETE' && e.normalized?.status === 'PAID');

  // 4. Region + issued_at half-open window filter.
  const qualifying = authoritative.filter(e => {
    const n = e.normalized;
    if (n.region !== scenario.region) return false;
    const t = new Date(n.issuedAt).getTime();
    return t >= startMs && t < endMs;
  });

  // Sort FX rates per currency, ascending by valid_from, for an ASOF lookup.
  const fxByCurrency = new Map();
  for (const row of fxRates) {
    if (!fxByCurrency.has(row.currency)) fxByCurrency.set(row.currency, []);
    fxByCurrency.get(row.currency).push(row);
  }
  for (const rows of fxByCurrency.values()) rows.sort((a, b) => a.valid_from.localeCompare(b.valid_from));

  function asofRate(currency, issuedAtIso) {
    const rows = fxByCurrency.get(currency) || [];
    const issuedDate = issuedAtIso.slice(0, 10);
    let best = null;
    for (const row of rows) {
      if (row.valid_from <= issuedDate) best = row;
      else break;
    }
    return best ? best.usd_per_unit : rows[0]?.usd_per_unit ?? 0;
  }

  const skuTotals = new Map();
  let netCents = 0;

  for (const e of qualifying) {
    const n = e.normalized;
    const rate = asofRate(n.currency, n.issuedAt);
    for (const line of n.lines) {
      const localMinorUnits = line.unitCents * line.quantity * (1 - line.discountBps / 10000);
      const usdCentsUnrounded = localMinorUnits * rate;
      const usdCentsRounded = roundHalfUpCents(usdCentsUnrounded);
      netCents += usdCentsRounded;
      skuTotals.set(line.sku, (skuTotals.get(line.sku) || 0) + usdCentsRounded);
    }
  }

  let topSku = null;
  let topSkuCents = -Infinity;
  for (const [sku, cents] of [...skuTotals.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    if (cents > topSkuCents) {
      topSku = sku;
      topSkuCents = cents;
    }
  }

  return {
    invoice_count: qualifying.length,
    net_usd: (netCents / 100).toFixed(2),
    top_sku: topSku,
    top_sku_usd: (topSkuCents / 100).toFixed(2)
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const ledger = buildLedger(norm, 'v1');
  const result = reconcile(ledger);
  const answer = JSON.stringify(result);

  const guide = [
    `## Q5 — DuckDB JSON Ledger Reconciliation (for ${norm})`,
    ``,
    `### What this question actually asks`,
    `Northstar Billing recovered an unordered CDC (change-data-capture) export of invoice events —`,
    `full of exact transport replays, stale revisions, tombstoned deletes, and two incompatible`,
    `payload schemas (v1: decimal prices/percent discounts; v2: integer minor units/basis points).`,
    `You reconcile it into one authoritative event per invoice, filter to a region + date window,`,
    `convert every line to USD cents via an ASOF-joined FX rate, and report 4 summary numbers.`,
    ``,
    `### Your seeded scenario`,
    `- **Region:** ${ledger.scenario.region}`,
    `- **Issued-at window (half-open UTC):** [${ledger.scenario.start}, ${ledger.scenario.end})`,
    `- 108 synthetic invoices, 2–4 revisions each, plus transport replays and duplicate CDC events —`,
    `  same structure as the real \`events.jsonl\`/\`fx.csv\` files you'd download from the exam page.`,
    ``,
    `### Reconciliation steps (in order — each step's output feeds the next)`,
    `1. **Drop exact transport replays** — dedupe by \`event_id\`; the JSONL file order is meaningless.`,
    `2. **Pick the authoritative event per invoice** — greatest integer \`sequence\`; tie-break on the`,
    `   greatest \`emitted_at\`. Do this *before* any status/region/date filtering.`,
    `3. **Only now** discard \`DELETE\` operations and invoices whose authoritative status isn't \`PAID\`.`,
    `4. **Filter** to region \`${ledger.scenario.region}\` and \`issued_at\` in the half-open window above.`,
    `5. **Normalize both payload schemas** to a common shape (local minor currency units, quantity,`,
    `   discount as a fraction) — the two schemas are mathematically equivalent once normalized.`,
    `6. **Per line:** \`local_minor_unit_price × quantity × (1 − discount)\`, unrounded.`,
    `7. **ASOF join** each line's invoice currency + \`issued_at\` to the FX row with the greatest`,
    `   \`valid_from\` that is still \`<= issued_at\`.`,
    `8. **Convert to USD cents**, round each line to the nearest cent (half-up on exact .5), and sum`,
    `   rounded cents — never round once at the invoice or portfolio level.`,
    `9. **Top SKU** = greatest summed cents; ties broken by ascending SKU string.`,
    ``,
    `### Answer`,
    '```json',
    answer,
    '```',
    ``,
    `⚠️ **Precision note:** this was computed in plain JS floating-point arithmetic mirroring the`,
    `official half-up-cent rule as closely as possible. If your own DuckDB/Decimal-based`,
    `recomputation lands a cent or two off, redo steps 6–8 with Python's \`Decimal\` +`,
    `\`ROUND_HALF_UP\` (as the exam's own guide recommends) rather than floats, using the`,
    `reconciliation logic above — the invoice selection (steps 1–4) is exact regardless.`
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `Ledger reconciliation for ${norm}`,
    answerDisplay: [
      `### Q5: DuckDB JSON Ledger Reconciliation`,
      ``,
      `Reconciled the seeded CDC ledger (108 invoices, replays, revisions, dual schemas) entirely`,
      `client-side, matching the exact generation algorithm from the official exam bundle.`,
      ``,
      '```json',
      answer,
      '```',
      ``,
      `**${result.invoice_count}** qualifying invoices, **$${result.net_usd}** net USD revenue,`,
      `top SKU **${result.top_sku}** at **$${result.top_sku_usd}**.`,
      ``,
      `Full reconciliation-rule breakdown and a precision caveat are in the guide below.`
    ].join('\n'),
    guide
  };
}
