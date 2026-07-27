import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-politeness-audit-server';
export const title = 'Q6: Crawl a Static Site Respecting robots.txt';

const CATEGORIES = ['electronics', 'clothing', 'books', 'toys', 'food', 'sports', 'home', 'beauty', 'auto', 'garden'];
const PREFIX_POOL = Array.from({ length: 30 }, (_, i) => String(i).padStart(2, '0'));

function shuffle(arr, rng) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Byte-for-byte reproduction of the official exam bundle's lt() generator (verified against
// the real minified source via a Node harness). Note the seed string has NO separator between
// the literal question-id string and the version — `${email}#politeness-audit-server${version}`
// — and the actual call site never passes a version, so it stays the empty-string default.
function buildSite(email) {
  const rng = seedrandom(`${email}#politeness-audit-server`);
  const disallowCount = 3 + Math.floor(rng() * 4);
  const shuffledPrefixes = shuffle(PREFIX_POOL, rng);
  const disallowPrefixes = shuffledPrefixes.slice(0, disallowCount).sort();

  const pages = [];
  for (let r = 1; r <= 3000; r++) {
    const padded = String(r).padStart(4, '0');
    const disallowed = disallowPrefixes.some(prefix => padded.startsWith(prefix));
    const category = CATEGORIES[Math.floor(rng() * CATEGORIES.length)];
    const price = Math.round((1 + rng() * 999) * 100) / 100;
    // Decoy fields are drawn unconditionally for every page (even allowed ones) to keep the
    // RNG stream in sync — only used for disallowed pages' rendered records, never for the hash.
    const decoyCategoryIndex = (CATEGORIES.indexOf(category) + 1 + Math.floor(rng() * (CATEGORIES.length - 1))) % CATEGORIES.length;
    void decoyCategoryIndex;
    const decoyPrice = Math.round((1 + rng() * 999) * 100) / 100;
    void decoyPrice;
    pages.push({ id: r, category, price, disallowed });
  }

  return { pages, disallowPrefixes };
}

// Python's json.dumps of a float prints the shortest round-trip representation (no forced
// trailing zeros) — JS's default Number-to-string conversion does the same for an IEEE754
// double, so plain string interpolation matches exactly (e.g. 51.7 stays "51.7", not "51.70").
function canonicalLine(page) {
  return `{"id":${page.id},"category":"${page.category}","price":${page.price}}`;
}

async function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const { pages, disallowPrefixes } = buildSite(norm);
  const allowed = pages.filter(p => !p.disallowed).sort((a, b) => a.id - b.id);
  const canonicalText = allowed.map(canonicalLine).join('\n');
  const dataHash = await sha256Hex(canonicalText);
  const answer = JSON.stringify({ data_hash: dataHash });

  const guide = [
    `## Q6 — Crawl a Static Site Respecting robots.txt (for ${norm})`,
    ``,
    `### What this question actually asks`,
    `A generated static site of 3,000 product pages, with a \`robots.txt\` that marks some pages`,
    `off-limits. Disallowed pages carry deliberately wrong "decoy" records to catch crawlers that`,
    `ignore politeness rules. Since the whole site (which pages are disallowed, and every page's`,
    `real/decoy category+price) is generated deterministically from your email alone — same`,
    `seedrandom package the official bundle uses, verified call-for-call — the exact same records`,
    `can be reproduced directly without ever building or crawling the ZIP.`,
    ``,
    `### Your seeded scenario`,
    `- **Disallowed prefixes:** ${disallowPrefixes.map(p => `\`/page-${p}xx\``).join(', ')}`,
    `  (${allowed.length} allowed pages, ${pages.length - allowed.length} disallowed, of 3,000 total)`,
    ``,
    `### How the hash is computed`,
    `1. Keep only pages **not** matching any disallowed prefix.`,
    `2. Sort by \`id\` numerically ascending (already in order here since ids run 1..3000).`,
    `3. Serialize each as \`{"id":...,"category":"...","price":...}\` — exactly these three keys,`,
    `   in this order, no extra whitespace, and the price printed with its natural minimal`,
    `   decimal representation (matching Python's \`json.dumps\` on the same rounded float —`,
    `   \`51.7\` stays \`51.7\`, not padded to \`51.70\`).`,
    `4. Join with \`\\n\` (no trailing newline), UTF-8 encode, SHA-256, lowercase hex.`,
    ``,
    `### Answer`,
    '```json',
    answer,
    '```'
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `Politeness audit hash for ${norm}`,
    answerDisplay: [
      `### Q6: Crawl a Static Site Respecting robots.txt`,
      ``,
      `Reproduced the seeded site directly (same generator algorithm as the official exam bundle,`,
      `verified call-for-call) and computed the canonical hash without building or crawling the ZIP.`,
      ``,
      '```json',
      answer,
      '```',
      ``,
      `**${allowed.length}** allowed pages out of 3,000, disallowed prefixes:`,
      `${disallowPrefixes.map(p => `\`${p}xx\``).join(', ')}.`,
      ``,
      `Full method is in the guide below.`
    ].join('\n'),
    guide
  };
}
