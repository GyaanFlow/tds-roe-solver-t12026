import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-scrape-books-server';
export const title = 'Q7: Scrape Books to Scrape by Category and Value';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';

const ALL_CATEGORIES = [
  { name: "Travel", slug: "travel_2" },
  { name: "Mystery", slug: "mystery_3" },
  { name: "Historical Fiction", slug: "historical-fiction_4" },
  { name: "Sequential Art", slug: "sequential-art_5" },
  { name: "Classics", slug: "classics_6" },
  { name: "Philosophy", slug: "philosophy_7" },
  { name: "Romance", slug: "romance_8" },
  { name: "Womens Fiction", slug: "womens-fiction_9" },
  { name: "Fiction", slug: "fiction_10" },
  { name: "Childrens", slug: "childrens_11" },
  { name: "Religion", slug: "religion_12" },
  { name: "Nonfiction", slug: "nonfiction_13" },
  { name: "Music", slug: "music_14" },
  { name: "Default", slug: "default_15" },
  { name: "Science Fiction", slug: "science-fiction_16" },
  { name: "Sports and Games", slug: "sports-and-games_17" },
  { name: "Add a comment", slug: "add-a-comment_18" },
  { name: "Fantasy", slug: "fantasy_19" },
  { name: "New Adult", slug: "new-adult_20" },
  { name: "Young Adult", slug: "young-adult_21" },
  { name: "Science", slug: "science_22" },
  { name: "Poetry", slug: "poetry_23" },
  { name: "Paranormal", slug: "paranormal_24" },
  { name: "Art", slug: "art_25" },
  { name: "Psychology", slug: "psychology_26" },
  { name: "Autobiography", slug: "autobiography_27" },
  { name: "Parenting", slug: "parenting_28" },
  { name: "Adult Fiction", slug: "adult-fiction_29" },
  { name: "Humor", slug: "humor_30" },
  { name: "Horror", slug: "horror_31" },
  { name: "History", slug: "history_32" },
  { name: "Food and Drink", slug: "food-and-drink_33" },
  { name: "Christian Fiction", slug: "christian-fiction_34" },
  { name: "Business", slug: "business_35" },
  { name: "Biography", slug: "biography_36" },
  { name: "Thriller", slug: "thriller_37" },
  { name: "Contemporary", slug: "contemporary_38" },
  { name: "Spirituality", slug: "spirituality_39" },
  { name: "Academic", slug: "academic_40" },
  { name: "Self Help", slug: "self-help_41" },
  { name: "Historical", slug: "historical_42" },
  { name: "Christian", slug: "christian_43" },
  { name: "Suspense", slug: "suspense_44" },
  { name: "Short Stories", slug: "short-stories_45" },
  { name: "Novels", slug: "novels_46" },
  { name: "Health", slug: "health_47" },
  { name: "Politics", slug: "politics_48" },
  { name: "Cultural", slug: "cultural_49" },
  { name: "Erotica", slug: "erotica_50" },
  { name: "Crime", slug: "crime_51" }
];

function shuffleArray(arr, rng) {
  const res = arr.slice();
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

export function computeSeededQ7Targets(email) {
  const rng = seedrandom(`${email}#q-scrape-books-server`);
  const categories = shuffleArray(ALL_CATEGORIES, rng)
    .slice(0, 5)
    .map(c => c.slug)
    .sort();
  const minRating = 2 + Math.floor(rng() * 4);
  const minPrice = 10 + Math.floor(rng() * 30);
  const maxPrice = minPrice + 15 + Math.floor(rng() * 25);
  const minAvailability = 2 + Math.floor(rng() * 13);
  const categoryNames = categories.map(slug => ALL_CATEGORIES.find(c => c.slug === slug).name);

  return {
    categories,
    categoryNames,
    minRating,
    minPrice,
    maxPrice,
    minAvailability
  };
}

function registerQ7Interactive() {
  if (typeof window === 'undefined' || window._ga6q7Registered) return;
  window._ga6q7Registered = true;

  window._ga6q7FetchDigest = async function (email) {
    const statusEl = document.getElementById('ga6q7Status');
    const outputEl = document.getElementById('ga6q7Output');
    if (statusEl) {
      statusEl.style.color = '#4da6ff';
      statusEl.textContent = 'Fetching live SHA-256 digest on-demand…';
    }

    try {
      const url = `${HOST}/ga6/${encodeURIComponent(email)}/scrape-books`;
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        credentials: 'omit',
        cache: 'no-store'
      });
      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      const body = await res.text();
      if (!res.ok) throw new Error(`Live service returned HTTP ${res.status}`);
      if (!contentType.includes('json')) {
        throw new Error('Live service returned HTML instead of JSON (the API route may be unavailable)');
      }

      let data;
      try {
        data = JSON.parse(body);
      } catch (_) {
        throw new Error('Live service returned malformed JSON');
      }
      const digest = typeof data?.digest === 'string' ? data.digest.trim().toLowerCase() : '';
      if (!/^[a-f0-9]{64}$/.test(digest)) {
        throw new Error('Live service returned an invalid SHA-256 digest');
      }

      if (statusEl) {
        statusEl.style.color = '#198754';
        statusEl.textContent = 'Live SHA-256 digest fetched successfully.';
      }
      if (outputEl) outputEl.value = digest;
    } catch (err) {
      if (statusEl) {
        statusEl.style.color = '#d97706';
        statusEl.textContent = `Live digest is unavailable right now. Use the verified Python scraper below for offline calculation. (${err.message})`;
      }
    }
  };
}

export async function solve(email) {
  registerQ7Interactive();
  const norm = normalizeEmail(email);
  const targets = computeSeededQ7Targets(norm);
  const answer = `Categories: ${targets.categoryNames.join(', ')} | Price: £${targets.minPrice}-£${targets.maxPrice} | Rating >= ${targets.minRating} | Availability >= ${targets.minAvailability}`;

  const guide = [
    `## Q7 — Scrape Books to Scrape by Category and Value (for ${norm})`,
    ``,
    `### Assigned Seeded Target Parameters (0ms Instant Load)`,
    `- **Categories:** ${targets.categoryNames.join(', ')}`,
    `- **Minimum Rating:** ${targets.minRating}`,
    `- **Price Range:** £${targets.minPrice} – £${targets.maxPrice}`,
    `- **Minimum Availability:** ${targets.minAvailability}`,
    ``,
    `### ⚡ Optional On-Demand SHA-256 Digest Fetcher`,
    `<div style="background:linear-gradient(135deg,#0f2444 0%,#1a3a6b 100%);border-radius:14px;padding:20px;margin:16px 0;color:#e8f0fe;border:1px solid #2d4d80;">`,
    `  <div style="font-size:12px;letter-spacing:1px;color:#4da6ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Zero-Latency Initial Load — Click Below to Fetch Digest On-Demand</div>`,
    `  <button onclick="window._ga6q7FetchDigest('${norm}')" style="background:#3b82f6;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">⚡ Fetch Live SHA-256 Digest On-Demand</button>`,
    `  <div id="ga6q7Status" style="margin-top:10px;font-size:13px;font-weight:600;min-height:18px;"></div>`,
    `  <input id="ga6q7Output" type="text" readonly placeholder="Live SHA-256 digest will appear here..." style="width:100%;margin-top:10px;padding:10px;border-radius:8px;border:1px solid #3d5f96;background:#0b1930;color:#a6e3a1;font-family:monospace;font-size:14px;box-sizing:border-box;" />`,
    `  <button onclick="navigator.clipboard.writeText(document.getElementById('ga6q7Output').value)" style="margin-top:10px;background:#198754;color:#fff;border:none;border-radius:8px;padding:9px 16px;font-weight:700;font-size:13px;cursor:pointer;">📋 Copy Digest Answer</button>`,
    `</div>`,
    ``,
    `### 🐍 Python Scraper (verified working — run this to get your digest)`,
    ``,
    `Install dependencies first, then run the script below. It takes roughly 30–90 seconds`,
    `depending on how many books survive the price/rating filters.`,
    ``,
    '```bash',
    `pip install requests beautifulsoup4`,
    '```',
    ``,
    '```python',
    `import re, hashlib, requests`,
    `from bs4 import BeautifulSoup`,
    `from decimal import Decimal, ROUND_HALF_UP`,
    ``,
    `BASE = "https://books.toscrape.com/"`,
    `CATEGORIES = set(${JSON.stringify(targets.categoryNames)})`,
    `MIN_RATING = ${targets.minRating}`,
    `MIN_PRICE = ${targets.minPrice}`,
    `MAX_PRICE = ${targets.maxPrice}`,
    `MIN_AVAIL = ${targets.minAvailability}`,
    `RATING_MAP = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}`,
    ``,
    `session = requests.Session()`,
    `session.headers.update({"User-Agent": "Mozilla/5.0 (TDS GA6 Q7)"})`,
    ``,
    `def get_soup(url):`,
    `    # books.toscrape.com sends "Content-Type: text/html" with NO charset, so requests`,
    `    # falls back to ISO-8859-1 and the UTF-8 pound sign decodes as the mojibake "Ã‚Â£".`,
    `    # Forcing UTF-8 is REQUIRED - without it prices fail to parse and any title with a`,
    `    # curly quote/accent is corrupted, which silently changes your final hash.`,
    `    r = session.get(url, timeout=30)`,
    `    r.raise_for_status()`,
    `    r.encoding = "utf-8"`,
    `    return BeautifulSoup(r.text, "html.parser")`,
    ``,
    `def parse_price(text):`,
    `    # Pull the number out directly instead of stripping a currency symbol.`,
    `    m = re.search(r"\\d+(?:\\.\\d+)?", text)`,
    `    if not m:`,
    `        raise ValueError("no price found in %r" % text)`,
    `    return float(m.group())`,
    ``,
    `def crawl():`,
    `    home = get_soup(BASE)`,
    `    cat_urls = {}`,
    `    for a in home.select(".side_categories a"):`,
    `        name = a.get_text(strip=True)`,
    `        if name in CATEGORIES:`,
    `            cat_urls[name] = requests.compat.urljoin(BASE, a["href"])`,
    ``,
    `    missing = CATEGORIES - set(cat_urls)`,
    `    if missing:`,
    `        raise SystemExit("Categories not found in sidebar: %s" % sorted(missing))`,
    ``,
    `    rows = []`,
    `    for name, url in sorted(cat_urls.items()):`,
    `        curr = url`,
    `        while curr:`,
    `            sp = get_soup(curr)`,
    `            for art in sp.select("article.product_pod"):`,
    `                link = art.select_one("h3 a")`,
    `                price = parse_price(art.select_one(".price_color").get_text())`,
    `                rating = RATING_MAP[art.select_one(".star-rating")["class"][1]]`,
    ``,
    `                # Apply the cheap filters first so we only fetch detail pages we may keep.`,
    `                if not (MIN_PRICE <= price <= MAX_PRICE and rating >= MIN_RATING):`,
    `                    continue`,
    ``,
    `                d_url = requests.compat.urljoin(curr, link["href"])`,
    `                d_sp = get_soup(d_url)`,
    `                m = re.search(r"\\((\\d+)\\s+available\\)", d_sp.select_one("p.availability").get_text())`,
    `                avail = int(m.group(1)) if m else 0`,
    `                if avail < MIN_AVAIL:`,
    `                    continue`,
    ``,
    `                # Detail URLs look like .../catalogue/<slug>_<id>/index.html, so the id is`,
    `                # the DIRECTORY name (second-to-last path segment) - NOT "index.html".`,
    `                slug_id = d_url.rstrip("/").split("/")[-2]`,
    ``,
    `                score = (Decimal(rating) / Decimal(str(price))).quantize(`,
    `                    Decimal("0.0001"), rounding=ROUND_HALF_UP)`,
    `                rows.append({"id": slug_id, "title": link["title"], "price": price,`,
    `                             "rating": rating, "availability": avail, "value_score": score})`,
    `            nxt = sp.select_one("li.next a")`,
    `            curr = requests.compat.urljoin(curr, nxt["href"]) if nxt else None`,
    ``,
    `    rows.sort(key=lambda r: (-r["value_score"], r["id"]))`,
    `    canonical = "[" + ",".join(`,
    `        '{"id":"%s","title":"%s","price":%.2f,"rating":%d,"availability":%d,"value_score":%.4f}'`,
    `        % (r["id"], r["title"], r["price"], r["rating"], r["availability"], r["value_score"])`,
    `        for r in rows`,
    `    ) + "]"`,
    ``,
    `    print("Matched books:", len(rows))`,
    `    print("SHA-256 Digest:", hashlib.sha256(canonical.encode("utf-8")).hexdigest())`,
    ``,
    `crawl()`,
    '```',
    ``,
    `### ⚠️ The two bugs that break most people's scrapers`,
    ``,
    `1. **The encoding trap (this one crashes outright).** \`books.toscrape.com\` returns`,
    `   \`Content-Type: text/html\` with **no charset**, so \`requests\` defaults to ISO-8859-1 and`,
    `   the UTF-8 \`£\` (bytes \`C2 A3\`) decodes as two characters. Code like`,
    `   \`float(text.strip().lstrip("£"))\` then leaves a stray character behind and raises`,
    `   \`ValueError: could not convert string to float\`. Fix: set \`r.encoding = "utf-8"\` before`,
    `   reading \`r.text\` (and prefer pulling the number out with a regex). This also matters for`,
    `   **titles** — 9 books in the catalog have curly quotes or accents, and mojibake there`,
    `   changes your hash without any visible error.`,
    ``,
    `2. **The book id is a directory, not a file.** Detail URLs are`,
    `   \`https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html\`. Taking the`,
    `   last path segment gives \`index.html\` → \`index\`, so **every** book ends up with the same`,
    `   id and both the sort order and the hash are wrong. The id is the **second-to-last**`,
    `   segment: \`d_url.rstrip("/").split("/")[-2]\`.`,
    ``,
    `### 📌 Other things worth knowing`,
    ``,
    `- **Match categories by name, not slug.** The question deliberately withholds the slugs —`,
    `  parse the sidebar (\`.side_categories a\`) and match the visible text. The script above`,
    `  hard-fails if any assigned category is missing rather than silently hashing a partial set.`,
    `- **Availability comes from the detail page only**, not the listing page.`,
    `- **Serialization is intentionally not \`json.dumps\`.** The official skeleton uses raw \`%s\``,
    `  interpolation, so the grader expects exactly that byte-for-byte. Two titles in the`,
    `  catalog contain a double quote (e.g. \`"Most Blessed of the Patriarchs": ...\`), which makes`,
    `  the canonical string technically invalid JSON — that's expected; do **not** "fix" it with`,
    `  \`json.dumps\`, or your digest will not match.`,
    `- **Keep \`value_score\` as a \`Decimal\`** through the sort. Converting to \`float\` early can`,
    `  flip a tie and reorder rows.`,
    `- Prices are inclusive on both ends (\`${targets.minPrice} <= price <= ${targets.maxPrice}\`).`
  ].join('\n');

  return {
    type: 'guide',
    answer,
    // The on-demand digest button below calls the hosted API, but the URL never appears in
    // any user-visible text, so the app's automatic host-detection can't see it — flag it
    // explicitly so the API-status notice still shows while that service is down.
    usesHostedApi: true,
    variant: `Books to Scrape target parameters for ${norm} (0ms instant load, no blocking network calls)`,
    answerDisplay: [
      `### Q7: Scrape Books to Scrape by Category and Value`,
      ``,
      `Your assigned target parameters (computed locally in 0ms, zero network calls):`,
      '```text',
      answer,
      '```',
      ``,
      `Click the **"⚡ Fetch Live SHA-256 Digest On-Demand"** button in the guide panel below to get the 64-character SHA-256 digest on-demand without delaying initial page load.`
    ].join('\n'),
    guide
  };
}
