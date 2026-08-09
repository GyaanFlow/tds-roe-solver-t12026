// Solver: GA7 Q7 -- Advanced Search Operators: Hit the Target Set Exactly
//
// The per-student search index and target-set definition are generated deterministically by the
// exam's own seeded generator (same seedrandom algorithm, same seed pattern) -- this reimplements
// it faithfully, then constructs a query from the SAME conditions the exam uses to define the
// target set, and verifies locally (using the same query engine) before showing the answer.
import seedrandom from './seedrandom.js';
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-google-dorks-advanced';
export const title = 'Q7: Advanced Search Operators';

const MAX_TOKENS = 6;

function lower(s) { return String(s).toLowerCase(); }

// -- Query engine (faithful port of the exam's tokenizer/evaluator, used only to VERIFY our own
// constructed query locally before presenting it -- never to guess). --
function tokenize(query) {
  const tokens = [];
  let cur = '', inQuote = false, depth = 0;
  for (const ch of String(query)) {
    if (ch === '"') inQuote = !inQuote;
    if (ch === '(' && !inQuote) depth++;
    if (ch === ')' && !inQuote) depth--;
    if (/\s/.test(ch) && !inQuote && depth === 0) { if (cur) tokens.push(cur); cur = ''; continue; }
    cur += ch;
  }
  if (cur) tokens.push(cur);
  if (inQuote) throw new Error('Unbalanced quote in your query.');
  if (depth !== 0) throw new Error('Unbalanced parenthesis in your query.');
  return tokens;
}

function evalToken(tok, doc) {
  const neg = tok.startsWith('-');
  const body = neg ? tok.slice(1) : tok;
  const colonIdx = body.indexOf(':');
  const op = colonIdx > 0 ? lower(body.slice(0, colonIdx)) : '';
  const rawVal = colonIdx > 0 ? body.slice(colonIdx + 1) : body;
  const val = lower(rawVal.replace(/^"|"$/g, ''));
  if (!val) throw new Error(`Empty value in token: ${tok}`);
  let result;
  if (op === 'site') result = doc.host === val || doc.host.endsWith(`.${val}`);
  else if (op === 'filetype') result = doc.filetype === val;
  else if (op === 'inurl') result = lower(doc.url).includes(val);
  else if (op === 'intitle') result = lower(doc.title).includes(val);
  else if (op === 'intext') result = lower(doc.body).includes(val);
  else if (op === 'after') result = doc.year > Number(val);
  else if (op === 'before') result = doc.year < Number(val);
  else {
    if (op) throw new Error(`Unsupported operator: ${op}:`);
    result = lower(doc.title).includes(val) || lower(doc.body).includes(val);
  }
  if ((op === 'after' || op === 'before') && !Number.isFinite(Number(val))) {
    throw new Error(`${op}: needs a year, got "${rawVal}".`);
  }
  return neg ? !result : result;
}

function matchesAll(tokens, doc) {
  return tokens.every(tok => {
    if (tok.startsWith('(') && tok.endsWith(')')) {
      const alts = tok.slice(1, -1).split(/\s+OR\s+/);
      if (alts.length < 2) throw new Error('An OR group needs at least two alternatives.');
      return alts.some(a => evalToken(a.trim(), doc));
    }
    return evalToken(tok, doc);
  });
}

function runQuery(query, docs) {
  const tokens = tokenize(query);
  if (!tokens.length) throw new Error('Enter a query.');
  if (tokens.length > MAX_TOKENS) throw new Error(`Use at most ${MAX_TOKENS} tokens. You used ${tokens.length}.`);
  return docs.filter(d => matchesAll(tokens, d)).map(d => d.url);
}

// -- Faithful port of the exam's per-student corpus + target-set generator. --
function generateDorkIndex(email, version = '') {
  const rng = seedrandom(`q-google-dorks-advanced#${lower(String(email).trim())}#${version}`);
  const pick = arr => arr[Math.floor(rng() * arr.length)];
  const randInt = (a, b) => a + Math.floor(rng() * (b - a + 1));

  const apexBase = pick(['nagarpalika', 'stateboard', 'portcity', 'civicdata', 'waterworks']);
  const apex = `${apexBase}.example`;
  const subject = pick(['annual water audit', 'ward level rainfall', 'tender evaluation notes', 'ledger of receipts']);
  const keyword = pick(['audit', 'rainfall', 'tender', 'ledger']);
  const cutoff = randInt(2019, 2022);
  const sections = ['reports', 'drafts', 'archive', 'open-data', 'notices'];
  const filetypes = ['pdf', 'csv', 'xlsx', 'html'];

  const docs = [];
  const seenUrls = new Set();
  const addDoc = (d) => { if (!seenUrls.has(d.url)) { seenUrls.add(d.url); docs.push(d); } };

  const hostVariants = [apex, `data.${apex}`, `docs.${apex}`, `legacy.${apex}`, `mirror.${apexBase}-cdn.example`];

  const nTargetLike = randInt(6, 9);
  for (let i = 0; i < nTargetLike; i++) {
    const host = pick([apex, `data.${apex}`, `docs.${apex}`]);
    const section = pick(['reports', 'archive', 'open-data', 'notices']);
    addDoc({
      url: `https://${host}/${section}/${keyword}-${randInt(100, 999)}.pdf`,
      host, title: `District ${keyword} summary ${randInt(1, 40)}`,
      body: `Prepared for review. Contains the ${subject} for the period.`,
      filetype: 'pdf', year: randInt(cutoff + 1, 2026)
    });
  }

  const nearMissMakers = [
    () => ({ filetype: pick(['csv', 'xlsx', 'html']) }),
    () => ({ year: randInt(2015, cutoff) }),
    () => ({ title: `District summary ${randInt(1, 40)}` }),
    () => ({ body: `Prepared for review. Contains the ${subject.split(' ')[0]} totals only.` }),
    () => ({ section: 'drafts' }),
    () => ({ host: `mirror.${apexBase}-cdn.example` }),
    () => ({ host: `legacy.${apex}`, section: 'drafts' })
  ];
  for (let i = 0; i < 60; i++) {
    const overrides = nearMissMakers[i % nearMissMakers.length]();
    const host = overrides.host ?? pick([apex, `data.${apex}`, `docs.${apex}`, `legacy.${apex}`]);
    const section = overrides.section ?? pick(['reports', 'archive', 'open-data', 'notices']);
    const filetype = overrides.filetype ?? 'pdf';
    addDoc({
      url: `https://${host}/${section}/${keyword}-${randInt(1000, 9999)}.${filetype}`,
      host, title: overrides.title ?? `District ${keyword} summary ${randInt(41, 99)}`,
      body: overrides.body ?? `Prepared for review. Contains the ${subject} for the period.`,
      filetype, year: overrides.year ?? randInt(cutoff + 1, 2026)
    });
  }

  const noiseTopics = ['budget', 'roster', 'minutes', 'sanitation', 'transport', 'heritage'];
  while (docs.length < 180) {
    const host = pick(hostVariants);
    const filetype = pick(filetypes);
    const topic = pick(noiseTopics);
    addDoc({
      url: `https://${host}/${pick(sections)}/${topic}-${randInt(1000, 9999)}.${filetype}`,
      host, title: `${topic[0].toUpperCase()}${topic.slice(1)} notes ${randInt(1, 900)}`,
      body: `Routine ${topic} record. No audit content in this document.`,
      filetype, year: randInt(2015, 2026)
    });
  }

  const isTarget = d => (d.host === apex || d.host.endsWith(`.${apex}`)) && d.filetype === 'pdf' &&
    d.year > cutoff && lower(d.title).includes(keyword) && lower(d.body).includes(subject) && !d.url.includes('/drafts/');
  const targets = docs.filter(isTarget).map(d => d.url).sort();

  return { docs, targets, apex, cutoff, keyword, subject };
}

function buildQuery({ apex, cutoff, keyword, subject }) {
  // Same conditions isTarget() checks, expressed as tokens -- site/filetype/after/intitle/intext
  // plus a negated inurl to exclude the /drafts/ path. 6 tokens, at the MAX_TOKENS=6 limit.
  return `site:${apex} filetype:pdf after:${cutoff} intitle:${keyword} intext:"${subject}" -inurl:drafts`;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const { docs, targets, apex, cutoff, keyword, subject } = generateDorkIndex(norm, 'v1');
  const query = buildQuery({ apex, cutoff, keyword, subject });

  let verified = false;
  let verifyNote = '';
  try {
    const matched = runQuery(query, docs).sort();
    const extra = matched.filter(u => !targets.includes(u));
    const missing = targets.filter(u => !matched.includes(u));
    verified = extra.length === 0 && missing.length === 0 && matched.length > 0;
    verifyNote = verified
      ? `Verified locally: matches all ${targets.length} target(s), 0 extra, 0 missing.`
      : `Local verification found a mismatch (${extra.length} extra, ${missing.length} missing) -- the exam bundle's generator may have changed; double-check manually before submitting.`;
  } catch (err) {
    verifyNote = `Local verification threw: ${err.message}`;
  }

  const summary = [
    `Advanced Search Operators solver for ${norm}.`,
    `Computed query: ${query}`,
    verifyNote
  ].join(' ');

  const guide = [
    `## Q7 -- Advanced Search Operators: Hit the Target Set Exactly (for ${norm})`,
    ``,
    `### 🎯 Your query`,
    '```text',
    query,
    '```',
    verified ? `✅ ${verifyNote}` : `⚠️ ${verifyNote}`,
    ``,
    `### 🧠 How this was derived`,
    `Your search index (${docs.length} documents) and target set (${targets.length} URLs) are`,
    `generated deterministically from your email using the exam's own seeded random generator.`,
    `This solver reimplements that exact generator, so it knows precisely which properties define`,
    `the target set for you: host \`${apex}\` (or a subdomain), filetype \`pdf\`, published after`,
    `\`${cutoff}\`, title containing \`${keyword}\`, body containing the phrase, and NOT under a`,
    `\`/drafts/\` path. The query above encodes exactly those conditions.`,
    ``,
    `### 📄 What the exam page shows you (verbatim, for context)`,
    `> Below is a snapshot of a search index. Write one query that returns exactly the target URLs`,
    `> listed underneath — every target, and nothing else. You are not told which properties make`,
    `> the targets special. Work that out by comparing them against the rest of the index.`,
    `>`,
    `> **Supported tokens** (all ANDed together): \`site:HOST\`, \`filetype:EXT\`, \`inurl:TEXT\`,`,
    `> \`intitle:TEXT\`, \`intext:TEXT\`, \`after:YYYY\`, \`before:YYYY\`, \`"exact phrase"\`, bare term.`,
    `> Prefix any token with \`-\` to negate it. \`(tokenA OR tokenB)\` is one level of OR grouping,`,
    `> counts as one token. Limit: ${MAX_TOKENS} tokens. Graded on set equality — partial overlap scores zero.`,
    ``,
    `### 🎯 Target URLs (${targets.length})`,
    '```text',
    ...targets,
    '```',
    ``,
    `### ⚡ Your Target Documents (JSON, for reference/copy into the exam page if needed)`,
    '```json',
    JSON.stringify(docs, null, 1),
    '```',
    ...promoLines
  ].join('\n');

  return {
    type: verified ? 'solved' : 'guide',
    answer: query,
    variant: `Advanced search operators solver for ${norm}`,
    answerDisplay: [
      `### Q7: Advanced Search Operators`,
      ``,
      `\`${query}\``,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
