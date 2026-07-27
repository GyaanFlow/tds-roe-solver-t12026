import { normalizeEmail } from './utils.js';

export const id = 'q-scrape-books-server';
export const title = 'Q7: Scrape Books to Scrape by Category and Value';

const HOST = 'https://tds-roe-solver-api-t12026.onrender.com';
const FETCH_TIMEOUT_MS = 55000; // Render free-tier cold start can take ~50s

function buildManualGuide(norm) {
  return [
    `## Q7 — Scrape Books to Scrape: manual method (for ${norm})`,
    ``,
    `The hosted API below normally computes this for you. If it's unavailable (cold start`,
    `timeout, or the service is down), here's the exact manual method as a fallback.`,
    ``,
    `### Why this data can't be regenerated offline`,
    `[Books to Scrape](https://books.toscrape.com/) is a real, live external website. Your`,
    `assigned categories and thresholds are seeded per student, but the actual book data`,
    `(titles, prices, ratings, availability) lives only on that real site.`,
    ``,
    `### Step 1 — Read your assignment off your own exam page`,
    `Note your **assigned categories**, **minimum rating** (1–5), **min/max price** range in`,
    `£, and **minimum availability** count — all shown directly on the page, seeded per student.`,
    ``,
    `### Step 2 — Find your categories' URL slugs and crawl with pagination`,
    '```python',
    `import requests`,
    `from bs4 import BeautifulSoup`,
    ``,
    `BASE = "https://books.toscrape.com/"`,
    `ASSIGNED_CATEGORIES = {"Travel", "Mystery"}  # replace with your own assigned list`,
    ``,
    `def get_category_urls():`,
    `    soup = BeautifulSoup(requests.get(BASE).text, "html.parser")`,
    `    urls = {}`,
    `    for a in soup.select(".side_categories a"):`,
    `        name = a.get_text(strip=True)`,
    `        if name in ASSIGNED_CATEGORIES:`,
    `            urls[name] = BASE + a["href"]`,
    `    return urls`,
    ``,
    `def iter_category_pages(start_url):`,
    `    url = start_url`,
    `    while url:`,
    `        soup = BeautifulSoup(requests.get(url).text, "html.parser")`,
    `        yield soup`,
    `        next_link = soup.select_one("li.next a")`,
    `        url = requests.compat.urljoin(url, next_link["href"]) if next_link else None`,
    '```',
    ``,
    `### Step 3 — Extract each book and its detail-page availability`,
    '```python',
    `RATING_WORDS = {"One": 1, "Two": 2, "Three": 3, "Four": 4, "Five": 5}`,
    `import re`,
    ``,
    `def parse_book(article, base_url):`,
    `    link = article.select_one("h3 a")`,
    `    detail_url = requests.compat.urljoin(base_url, link["href"])`,
    `    price = float(article.select_one(".price_color").text.strip().lstrip("£"))`,
    `    rating_word = article.select_one(".star-rating")["class"][1]`,
    `    rating = RATING_WORDS[rating_word]`,
    ``,
    `    detail_soup = BeautifulSoup(requests.get(detail_url).text, "html.parser")`,
    `    avail_text = detail_soup.select_one(".availability").get_text(strip=True)`,
    `    availability = int(re.search(r"\\((\\d+) available\\)", avail_text).group(1))`,
    ``,
    `    slug_and_id = detail_url.rstrip("/").rsplit("/", 1)[-1].removesuffix(".html")`,
    `    title = link["title"]`,
    `    return {"id": slug_and_id, "title": title, "price": price, "rating": rating, "availability": availability}`,
    '```',
    ``,
    `### Step 4 — Filter, score, sort, hash`,
    '```python',
    `import hashlib`,
    `from decimal import Decimal, ROUND_HALF_UP`,
    ``,
    `def value_score(rating, price):`,
    `    return float((Decimal(rating) / Decimal(str(price))).quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP))`,
    ``,
    `rows = [b for b in all_books if MIN_PRICE <= b["price"] <= MAX_PRICE and b["rating"] >= MIN_RATING and b["availability"] >= MIN_AVAILABILITY]`,
    `for b in rows:`,
    `    b["value_score"] = value_score(b["rating"], b["price"])`,
    ``,
    `rows.sort(key=lambda r: (-r["value_score"], r["id"]))`,
    `canonical = "[" + ",".join(`,
    `    '{"id":"%s","title":"%s","price":%.2f,"rating":%d,"availability":%d,"value_score":%.4f}'`,
    `    % (r["id"], r["title"], r["price"], r["rating"], r["availability"], r["value_score"])`,
    `    for r in rows`,
    `) + "]"`,
    `data_hash = hashlib.sha256(canonical.encode("utf-8")).hexdigest()`,
    `print(data_hash)`,
    '```',
    ``,
    `### Submit`,
    `Just the 64-character lowercase hex SHA-256 digest — **not** the JSON array itself.`
  ].join('\n');
}

async function fetchDigest(norm) {
  const url = `${HOST}/ga6/${encodeURIComponent(norm)}/scrape-books`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`API returned HTTP ${res.status}`);
    const data = await res.json();
    if (!data || typeof data.digest !== 'string' || !/^[0-9a-f]{64}$/i.test(data.digest)) {
      throw new Error('API response did not include a valid digest.');
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function solve(email) {
  const norm = normalizeEmail(email);

  try {
    const data = await fetchDigest(norm);

    const guide = [
      `## Q7 — Scrape Books to Scrape by Category and Value (for ${norm})`,
      ``,
      `### Live-computed via hosted API`,
      `The scraping, filtering, scoring, and hashing all happened server-side just now against`,
      `the real [books.toscrape.com](https://books.toscrape.com/) catalog, scoped to your seeded`,
      `assignment:`,
      ``,
      `- **Assigned categories:** ${data.assignedCategories.join(', ')}`,
      `- **Minimum rating:** ${data.minRating}`,
      `- **Price range:** £${data.minPrice} – £${data.maxPrice}`,
      `- **Minimum availability:** ${data.minAvailability}`,
      `- **Matching books found:** ${data.matchCount}`,
      ``,
      `### Answer`,
      '```text',
      data.digest,
      '```',
      `Submit just this 64-character lowercase hex digest — not the JSON array.`,
      ``,
      `---`,
      ``,
      buildManualGuide(norm)
    ].join('\n');

    return {
      type: 'solved',
      answer: data.digest,
      variant: `Books to Scrape digest for ${norm} (${data.matchCount} matching books)`,
      answerDisplay: [
        `### Q7: Scrape Books to Scrape by Category and Value`,
        ``,
        `Computed live against the real books.toscrape.com catalog via the hosted scraping API.`,
        ``,
        '```text',
        data.digest,
        '```',
        ``,
        `**${data.matchCount}** matching books — categories: ${data.assignedCategories.join(', ')};`,
        `rating ≥ ${data.minRating}; price £${data.minPrice}–£${data.maxPrice}; availability ≥ ${data.minAvailability}.`,
        ``,
        `Manual fallback method is in the guide below in case you need to double-check it.`
      ].join('\n'),
      guide
    };
  } catch (error) {
    const norm2 = norm;
    const summary = [
      `The hosted scraping API didn't respond in time (${error.message}). Crawl the real`,
      `public site books.toscrape.com yourself, scoped to your seeded categories and`,
      `price/rating/availability thresholds, and submit a SHA-256 digest of the matching`,
      `books sorted by value score — full method below.`
    ].join(' ');

    return {
      type: 'guide',
      answer: summary,
      variant: `Books to Scrape crawl walkthrough for ${norm2} (API unavailable)`,
      answerDisplay: [
        `### Q7: Scrape Books to Scrape by Category and Value`,
        ``,
        `⚠️ The hosted scraping API didn't respond in time: **${error.message}**`,
        `(Render free-tier services can take up to ~50s to cold-start — try Solve again in a`,
        `moment, or follow the manual method below.)`,
        ``,
        summary
      ].join('\n'),
      guide: buildManualGuide(norm2)
    };
  }
}
