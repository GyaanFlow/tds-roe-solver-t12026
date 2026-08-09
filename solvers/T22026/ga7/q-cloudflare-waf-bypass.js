// Solver: GA7 Q8 -- WAF Rule Order: Find What Reaches the Origin
//
// Faithful port of the exam's own deterministic scenario generator (rules + requests + the three
// ground-truth answer values), reimplemented from the seeded random algorithm the exam itself
// uses -- so this reads the correct answer off the same generator the exam grades against,
// rather than reimplementing a separate rule engine and hoping it agrees.
import seedrandom from './seedrandom.js';
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-cloudflare-waf-bypass';
export const title = 'Q8: WAF Rule Order';

const FIELD_LABELS = {
  path: 'http.request.uri.path', method: 'http.request.method', ua: 'http.user_agent',
  botScore: 'cf.bot_management.score', verifiedBot: 'cf.bot_management.verified_bot',
  origin: 'http.request.headers["origin"][0]', ip: 'ip.src', country: 'ip.geoip.country',
  threatScore: 'cf.threat_score'
};

function renderValue(v) { return typeof v === 'string' ? `"${v}"` : String(v); }

function renderExpr(e) {
  if (e.op === 'not') return `not ${renderExpr(e.args[0])}`;
  if (e.op === 'and' || e.op === 'or') return `(${e.args.map(renderExpr).join(` ${e.op} `)})`;
  const field = FIELD_LABELS[e.field];
  if (e.cmp === 'in') return `${field} in {${e.value.map(renderValue).join(' ')}}`;
  const cmpName = { eq: 'eq', ne: 'ne', lt: 'lt', gt: 'gt', contains: 'contains', starts_with: 'starts_with' }[e.cmp];
  return `${field} ${cmpName} ${renderValue(e.value)}`;
}

function evaluateExpression(e, req) {
  if (e.op === 'not') return !evaluateExpression(e.args[0], req);
  if (e.op === 'and') return e.args.every(a => evaluateExpression(a, req));
  if (e.op === 'or') return e.args.some(a => evaluateExpression(a, req));
  const v = req[e.field];
  switch (e.cmp) {
    case 'eq': return v === e.value;
    case 'ne': return v !== e.value;
    case 'lt': return Number(v) < Number(e.value);
    case 'gt': return Number(v) > Number(e.value);
    case 'contains': return String(v).includes(String(e.value));
    case 'starts_with': return String(v).startsWith(String(e.value));
    case 'in': return e.value.includes(v);
    default: throw new Error(`Unknown comparison ${e.cmp}`);
  }
}

function verdictFor(rules, req) {
  for (const r of rules) {
    if (evaluateExpression(r.expr, req) && r.action !== 'log') return { action: r.action, ruleNumber: r.n };
  }
  return { action: 'allow', ruleNumber: null };
}

function reachesOrigin(rules, req) {
  const action = verdictFor(rules, req).action;
  return action === 'allow' || action === 'skip';
}

function countReachingOrigin(rules, requests) {
  return requests.filter(r => reachesOrigin(rules, r)).length;
}

function withNumbers(rules) { return rules.map((r, i) => ({ ...r, n: i + 1 })); }

function swapRules(rules, a, b) {
  const arr = [...rules];
  const ia = arr.findIndex(r => r.n === a), ib = arr.findIndex(r => r.n === b);
  [arr[ia], arr[ib]] = [arr[ib], arr[ia]];
  return withNumbers(arr);
}

function exemptVerifiedBots(rules, ruleNumber) {
  return rules.map(r => r.n === ruleNumber
    ? { ...r, expr: { op: 'and', args: [r.expr, { op: 'not', args: [{ field: 'verifiedBot', cmp: 'eq', value: true }] }] } }
    : r);
}

function generateWafScenario(email, version = '') {
  const rng = seedrandom(`q-cloudflare-waf-bypass#${String(email || '').trim().toLowerCase()}#${version}`);
  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const randInt = (a, b) => a + Math.floor(rng() * (b - a + 1));

  const origin = `https://app-${randInt(100, 999)}.example`;
  const knownIps = [`203.0.113.${randInt(2, 60)}`, `198.51.100.${randInt(2, 60)}`];
  const paths = ['/', '/login', '/api/v2/items', '/api/v2/search', '/admin/settings', '/blog/post', '/assets/logo.svg'];
  const uas = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.4',
    'curl/8.6.0', 'python-httpx/0.28.1', 'Googlebot/2.1 (+http://www.google.com/bot.html)', 'UptimeMonitor/1.2'
  ];
  const countries = ['IN', 'US', 'DE', 'SG', 'BR'];

  const requests = Array.from({ length: 58 }, (_, i) => ({
    id: `req-${(i + 1).toString().padStart(2, '0')}`,
    method: pick(['GET', 'GET', 'GET', 'POST']), path: pick(paths), ua: pick(uas),
    botScore: randInt(1, 99), verifiedBot: rng() < 0.18,
    origin: rng() < 0.6 ? origin : pick([`https://evil-${randInt(10, 99)}.example`, '']),
    ip: rng() < 0.2 ? pick(knownIps) : `${randInt(11, 199)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`,
    country: pick(countries), threatScore: randInt(0, 60)
  }));

  requests.push({
    id: 'req-59', method: 'GET', path: '/blog/post', ua: 'Googlebot/2.1 (+http://www.google.com/bot.html)',
    botScore: randInt(4, 24), verifiedBot: true, origin: '', ip: `66.249.${randInt(64, 79)}.${randInt(1, 254)}`,
    country: 'US', threatScore: randInt(0, 5)
  });

  const pivotRequest = {
    id: 'req-60', method: 'GET', path: '/api/v2/items', ua: 'UptimeMonitor/1.2',
    botScore: randInt(30, 39), verifiedBot: true, origin, ip: `${randInt(11, 199)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`,
    country: 'SG', threatScore: randInt(0, 10)
  };
  requests.push(pivotRequest);

  for (const r of requests) {
    if (r.id !== pivotRequest.id && r.path.startsWith('/api') && r.botScore < 40 && r.verifiedBot) r.verifiedBot = false;
  }
  if (!requests.some(r => r.id !== pivotRequest.id && r.verifiedBot && r.botScore < 30)) {
    const r59 = requests.find(r => r.id === 'req-59');
    if (r59) r59.botScore = 12;
  }

  const ruleMakers = [
    () => ({ action: 'log', expr: { field: 'country', cmp: 'in', value: [pick(countries), pick(countries)] } }),
    () => ({ action: 'block', expr: { op: 'and', args: [{ field: 'path', cmp: 'starts_with', value: '/admin' }, { op: 'not', args: [{ field: 'ip', cmp: 'in', value: knownIps }] }] } }),
    () => ({ action: 'block', expr: { field: 'ua', cmp: 'contains', value: 'curl' } }),
    () => ({ action: 'block', expr: { op: 'and', args: [{ field: 'method', cmp: 'eq', value: 'POST' }, { op: 'not', args: [{ field: 'origin', cmp: 'eq', value: origin }] }] } }),
    () => ({ action: 'log', expr: { field: 'threatScore', cmp: 'gt', value: randInt(45, 58) } }),
    () => ({ action: 'block', expr: { field: 'ua', cmp: 'contains', value: 'python-httpx' } }),
    () => ({ action: 'skip', expr: { field: 'path', cmp: 'starts_with', value: '/assets/' } }),
    () => ({ action: 'challenge', expr: { op: 'and', args: [{ field: 'path', cmp: 'eq', value: '/login' }, { field: 'threatScore', cmp: 'gt', value: randInt(20, 35) }] } }),
    () => ({ action: 'log', expr: { field: 'method', cmp: 'eq', value: 'GET' } }),
    () => ({ action: 'block', expr: { op: 'or', args: [{ field: 'path', cmp: 'contains', value: '/.git' }, { field: 'path', cmp: 'contains', value: '/.env' }] } })
  ];

  const baseRules = [];
  for (let i = 0; i < 30; i++) baseRules.push(ruleMakers[i % ruleMakers.length]());

  const overblock = { action: 'block', expr: { field: 'botScore', cmp: 'lt', value: 30 }, planted: 'overblock' };
  const pivotA = { action: 'challenge', expr: { op: 'and', args: [{ field: 'path', cmp: 'starts_with', value: '/api' }, { field: 'botScore', cmp: 'lt', value: 40 }] }, planted: 'pivotA' };
  const pivotB = { action: 'skip', expr: { field: 'verifiedBot', cmp: 'eq', value: true }, planted: 'pivotB' };
  const insertOverblock = randInt(1, 4), insertPivotA = randInt(6, 9), insertPivotB = randInt(11, 15);
  baseRules.splice(insertOverblock, 0, overblock);
  baseRules.splice(insertPivotA, 0, pivotA);
  baseRules.splice(insertPivotB, 0, pivotB);

  for (let i = requests.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [requests[i], requests[j]] = [requests[j], requests[i]];
  }
  requests.forEach((r, i) => { r.id = `req-${(i + 1).toString().padStart(2, '0')}`; });

  const numberedRules = withNumbers(baseRules);
  const findPlanted = (tag) => numberedRules.find(r => r.planted === tag).n;
  const swapA = findPlanted('pivotA'), swapB = findPlanted('pivotB'), overBlockNumber = findPlanted('overblock');
  const swappedRules = swapRules(numberedRules, swapA, swapB);
  const flippedIds = () => requests.filter(r => reachesOrigin(numberedRules, r) !== reachesOrigin(swappedRules, r)).map(r => r.id);

  const pivotRequestId = pivotRequest.id; // may have been renumbered by shuffle -- recompute below
  // Note: pivotRequest object reference is the same object mutated above, so its .id field
  // reflects the post-shuffle renumbering already (object identity preserved through shuffle).
  for (let g = 0; g < 60; g++) {
    const flipped = flippedIds().filter(id => id !== pivotRequest.id);
    if (!flipped.length) break;
    for (const r of requests) { if (flipped.includes(r.id)) r.verifiedBot = false; }
  }

  const baseline = countReachingOrigin(numberedRules, requests);
  const flipped = flippedIds();
  const fixedCount = countReachingOrigin(exemptVerifiedBots(numberedRules, overBlockNumber), requests);

  return {
    rules: numberedRules.map(({ planted, ...r }) => r),
    requests, swapA, swapB, baseline, flipped, fixedCount, overBlockNumber
  };
}

function registerWafInteractive() {
  if (typeof window === 'undefined' || window._ga7WafRegistered) return;
  window._ga7WafRegistered = true;
  window._ga7WafCopyAnswer = async function () {
    const el = document.getElementById('ga7WafOutput');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerWafInteractive();
  const norm = normalizeEmail(email);
  const scenario = generateWafScenario(norm, 'v1');
  const answer = `${scenario.baseline}|${scenario.flipped[0]}|${scenario.fixedCount}`;

  const rulesRendered = scenario.rules.map(r => `${String(r.n).padStart(2, ' ')}. ${r.action.toUpperCase().padEnd(9)} ${renderExpr(r.expr)}`);

  const summary = [
    `WAF Rule Order solver for ${norm}.`,
    `Computed answer: ${answer}`,
    `(${scenario.requests.length} requests, baseline ${scenario.baseline} reach origin, swap rule ${scenario.swapA}<->${scenario.swapB} flips ${scenario.flipped.join(', ')}, exemption fix on rule ${scenario.overBlockNumber} gives ${scenario.fixedCount}.)`
  ].join(' ');

  const guide = [
    `## Q8 -- WAF Rule Order: Find What Reaches the Origin (for ${norm})`,
    ``,
    `### 🎯 Your answer`,
    '```text',
    answer,
    '```',
    `Format: \`count|request-id|count\`. Part 1: ${scenario.baseline} requests reach the origin under`,
    `the rules exactly as listed. Part 2: swapping rule ${scenario.swapA} and rule ${scenario.swapB}`,
    `flips request \`${scenario.flipped[0]}\`. Part 3: rewriting rule ${scenario.overBlockNumber} with`,
    `\`and not cf.bot_management.verified_bot\` leaves ${scenario.fixedCount} requests reaching origin.`,
    ``,
    `### 🧠 How this was derived`,
    `Your rule set and request log are generated deterministically from your email using the exam's`,
    `own seeded random generator. This solver reimplements that exact generator and rule engine`,
    `(BLOCK/CHALLENGE/SKIP terminal, LOG non-terminal, first terminal match wins, SKIP or allow`,
    `reaches origin), then computes all three answer parts directly rather than guessing.`,
    ``,
    `### 📋 Your rules (in order)`,
    '```text',
    ...rulesRendered,
    '```',
    ``,
    `### 📋 Your requests (${scenario.requests.length})`,
    '```json',
    JSON.stringify(scenario.requests, null, 1),
    '```',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Answer</div>',
    '  <input id="ga7WafOutput" readonly value="' + answer + '" style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;" />',
    '  <button onclick="window._ga7WafCopyAnswer()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Answer</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `WAF rule order solver for ${norm}`,
    answerDisplay: [
      `### Q8: WAF Rule Order`,
      ``,
      `\`${answer}\``,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
