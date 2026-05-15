// Solver: Data-Narrative Number Reconciliation
import { fnvHash, normalizeEmail, rng, MONTHS } from './utils.js';

const QID = 'q-data-narrative-number-reconciliation';

function generateDataset(e) {
  const rows = [];
  for (let l = 0; l < 12; l++) {
    const units = Math.round(980 + e * 37 + l * 46 + (e + l) % 5 * 17);
    const priceFactor = 18.5 + e % 7 * 1.15 + l % 4 * 0.85;
    const revenue = Math.round(units * priceFactor);
    const returnRate = Number((2.8 + (e + l) % 6 * 0.45 + (l % 2 ? 0.2 : 0)).toFixed(1));
    const onlineOrders = Math.round(units * (0.44 + e % 4 * 0.03 + (l % 3 - 1) * 0.018));
    rows.push({ month: MONTHS[l], units, revenue, avgRevenuePerUnit: Number((revenue / units).toFixed(2)), returnRate, onlineOrders });
  }
  const dropStart = (e * 5 + 2) % 11;
  const peakRate = Number((5.4 + e % 5 * 0.4).toFixed(1));
  const delta = 110 + e * 29 % 130;
  const nextRate = Number((peakRate - delta / 100).toFixed(1));
  rows[dropStart].returnRate = peakRate;
  rows[dropStart + 1].returnRate = Math.max(1.2, nextRate);
  const deltaBps = Math.round((rows[dropStart].returnRate - rows[dropStart + 1].returnRate) * 100);
  return { rows, dropStart, deltaBps };
}

function fmtMoney(v) { return `$${Math.round(v).toLocaleString('en-US')}`; }
function fmtNum(v) { return Math.round(v).toLocaleString('en-US'); }
function fmtPct(v) { return `${v.toFixed(1)}%`; }

function buildScenario(e) {
  const name = `Portfolio ${String.fromCharCode(65 + e % 20)}`;
  const { rows, dropStart, deltaBps } = generateDataset(e);
  const a = (e * 2 + 1) % 12;
  const l = (e * 3 + 4) % 12;
  const i2 = (e * 7 + 5) % 12;
  const q = e % 4 + 1;
  const qStart = (q - 1) * 3;
  const qRevenue = rows.slice(qStart, qStart + 3).reduce((s, r) => s + r.revenue, 0);
  const onlineShare = Number((rows[i2].onlineOrders / rows[i2].units * 100).toFixed(1));

  const claims = [
    { label: `Units in ${rows[a].month}`, correct: fmtNum(rows[a].units), wrong: fmtNum(rows[Math.min(11, a + 1)].units) },
    { label: `Avg rev/unit in ${rows[l].month}`, correct: `$${rows[l].avgRevenuePerUnit.toFixed(2)}`, wrong: fmtMoney(rows[l].revenue) },
    { label: `Return rate direction`, correct: `fell by ${deltaBps} basis points`, wrong: `rose by ${deltaBps} basis points` },
    { label: `Q${q} total revenue`, correct: fmtMoney(qRevenue), wrong: fmtMoney(rows[qStart + 1].revenue) },
    { label: `${rows[i2].month} online share`, correct: fmtPct(onlineShare), wrong: fmtNum(rows[i2].onlineOrders) },
  ];

  const ctx = {
    monthA: rows[a].month, monthB: rows[l].month,
    prevMonth: rows[dropStart].month, currMonth: rows[dropStart + 1].month,
    quarter: q, monthD: rows[i2].month
  };

  return { name, rows, claims, ctx };
}

function buildParagraph(scenario, values) {
  const c = scenario.ctx;
  return [
    `The monthly performance review for ${scenario.name} indicates a generally controlled quarter with a few pressure points that deserve targeted follow-up before the next operating cycle.`,
    `In ${c.monthA}, total units sold were ${values[0]}, which established the volume baseline used in the rest of this assessment.`,
    `Pricing quality held up in ${c.monthB}, where average revenue per unit reached ${values[1]}, suggesting that discount leakage remained contained in that period.`,
    `Service stability improved as the return rate ${values[2]} from ${c.prevMonth} to ${c.currMonth}, a shift that points to better fulfillment discipline.`,
    `At the aggregate level, Q${c.quarter} total revenue came to ${values[3]}, confirming that end-of-quarter demand carried the top line despite product-mix changes.`,
    `Channel mix remains strategically material: ${c.monthD} online order share was ${values[4]}, so digital demand now has direct implications for staffing and fulfillment cadence.`,
    `Overall, the pattern supports focused intervention rather than broad alarm, because the core demand signal stayed stable while only a few execution levers moved significantly.`
  ].join(' ');
}

function selectWrongIndices(r, count) {
  const indices = Array.from({length: 5}, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices.slice(0, count).sort((a, b) => a - b);
}

export const id = QID;
export const title = 'Data-Narrative Number Reconciliation';

export function solve(email) {
  const norm = normalizeEmail(email);
  const scenarioIdx = fnvHash(norm) % 20;
  const scenario = buildScenario(scenarioIdx);
  const r = rng(`${norm}#${QID}`);
  const wrongCount = r() < 0.5 ? 3 : 4;
  const wrongIndices = selectWrongIndices(r, wrongCount);

  // Build corrected paragraph (all correct values)
  const correctValues = scenario.claims.map(c => c.correct);
  const correctedParagraph = buildParagraph(scenario, correctValues);

  // Build info about what was wrong
  const wrongInfo = wrongIndices.map(i => `Claim ${i + 1}: "${scenario.claims[i].label}" was ${scenario.claims[i].wrong} → corrected to ${scenario.claims[i].correct}`).join('\n');

  return {
    variant: `Paragraph #${scenarioIdx + 1}: ${scenario.name} | ${wrongCount} planted errors at positions [${wrongIndices.map(i => i + 1).join(', ')}]\n${wrongInfo}`,
    answer: correctedParagraph
  };
}
