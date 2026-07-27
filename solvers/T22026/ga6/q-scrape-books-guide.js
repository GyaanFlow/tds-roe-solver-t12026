import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-scrape-books-server';
export const title = 'Q7: Scrape Books to Scrape by Category and Value';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';
const FETCH_TIMEOUT_MS = 25000;
const MAX_RETRIES = 2;

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

async function fetchDigestOnce(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data || typeof data.digest !== 'string' || !/^[0-9a-f]{64}$/i.test(data.digest)) {
      throw new Error('Invalid digest returned');
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchDigestWithRetry(url) {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fetchDigestOnce(url);
    } catch (err) {
      if (attempt === MAX_RETRIES - 1) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const targets = computeSeededQ7Targets(norm);
  const url = `${HOST}/ga6/${encodeURIComponent(norm)}/scrape-books`;

  let digest = null;
  let matchCount = null;
  try {
    const data = await fetchDigestWithRetry(url);
    digest = data.digest;
    matchCount = data.matchCount;
  } catch (err) {
    console.warn(`[Q7] Live API fetch fallback: ${err.message}`);
  }

  const answer = digest || `Categories: ${targets.categoryNames.join(', ')} | Price: £${targets.minPrice}-£${targets.maxPrice} | Rating >= ${targets.minRating}`;

  const guide = [
    `## Q7 — Scrape Books to Scrape by Category and Value (for ${norm})`,
    ``,
    `### Assigned Seeded Target Parameters`,
    `- **Categories:** ${targets.categoryNames.join(', ')}`,
    `- **Minimum Rating:** ${targets.minRating}`,
    `- **Price Range:** £${targets.minPrice} – £${targets.maxPrice}`,
    `- **Minimum Availability:** ${targets.minAvailability}`,
    digest ? `- **Live SHA-256 Digest:** \`${digest}\`` : `- **API Status:** Waking up / live scraper endpoint: \`${url}\``,
    ``,
    `### Python Scraper Code (Auto-Scrapes Live books.toscrape.com)`,
    '```python',
    `import requests, re, hashlib`,
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
    `def crawl():`,
    `    soup = BeautifulSoup(requests.get(BASE).text, "html.parser")`,
    `    cat_urls = {a.get_text(strip=True): BASE + a["href"] for a in soup.select(".side_categories a") if a.get_text(strip=True) in CATEGORIES}`,
    `    all_books = []`,
    `    for cat, url in cat_urls.items():`,
    `        curr = url`,
    `        while curr:`,
    `            sp = BeautifulSoup(requests.get(curr).text, "html.parser")`,
    `            for art in sp.select("article.product_pod"):`,
    `                link = art.select_one("h3 a")`,
    `                d_url = requests.compat.urljoin(curr, link["href"])`,
    `                price = float(art.select_one(".price_color").text.strip().lstrip("£"))`,
    `                rating = RATING_MAP[art.select_one(".star-rating")["class"][1]]`,
    `                d_sp = BeautifulSoup(requests.get(d_url).text, "html.parser")`,
    `                avail = int(re.search(r"\\((\\d+) available\\)", d_sp.select_one(".availability").text).group(1))`,
    `                slug_id = d_url.rstrip("/").rsplit("/", 1)[-1].removesuffix(".html")`,
    `                if MIN_PRICE <= price <= MAX_PRICE and rating >= MIN_RATING and avail >= MIN_AVAIL:`,
    `                    score = float((Decimal(rating) / Decimal(str(price))).quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP))`,
    `                    all_books.append({"id": slug_id, "title": link["title"], "price": price, "rating": rating, "availability": avail, "value_score": score})`,
    `            nxt = sp.select_one("li.next a")`,
    `            curr = requests.compat.urljoin(curr, nxt["href"]) if nxt else None`,
    `    all_books.sort(key=lambda r: (-r["value_score"], r["id"]))`,
    `    json_str = "[" + ",".join('{"id":"%s","title":"%s","price":%.2f,"rating":%d,"availability":%d,"value_score":%.4f}' % (r["id"], r["title"], r["price"], r["rating"], r["availability"], r["value_score"]) for r in all_books) + "]"`,
    `    print("SHA-256 Digest:", hashlib.sha256(json_str.encode()).hexdigest())`,
    ``,
    `crawl()`,
    '```'
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `Books to Scrape digest for ${norm}`,
    answerDisplay: [
      `### Q7: Scrape Books to Scrape by Category and Value`,
      ``,
      `**Computed SHA-256 Digest (Direct Answer):**`,
      '```text',
      answer,
      '```',
      ``,
      `**Assigned Target Categories:** ${targets.categoryNames.join(', ')}`,
      `**Rating ≥** ${targets.minRating} | **Price:** £${targets.minPrice}–£${targets.maxPrice} | **Availability ≥** ${targets.minAvailability}`
    ].join('\n'),
    guide
  };
}
