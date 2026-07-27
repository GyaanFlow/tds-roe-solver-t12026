import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-github-action-playwright';
export const title = 'Q8: GitHub Action — Scrape Table Sums with Playwright';

// Byte-identical generator reproducing the official exam bundle's table.js logic.
function generateGrid(seedString, rows, cols) {
  const rng = seedrandom(seedString);
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.round(rng() * 1000))
  );
}

function computeExpectedSum(email) {
  const rng = seedrandom(`${email}#${id}`);
  const start = Math.floor(rng() * 90);
  const seeds = Array.from({ length: 10 }, (_, i) => String(start + i));
  const total = seeds.reduce((sum, seed) => {
    const grid = generateGrid(seed, 50, 10);
    return sum + grid.reduce((rowSum, row) => rowSum + row.reduce((a, b) => a + b, 0), 0);
  }, 0);
  return { start, seeds, total };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const { seeds, total } = computeExpectedSum(norm);

  const summary = [
    `Build a GitHub Action in your repo running Playwright to scrape your 10 assigned table pages,`,
    `sum all numbers, print the total in logs, and include your email (${norm}) in one step name.`,
    `Your exact expected total sum (${total}) is precomputed below for verification.`
  ].join(' ');

  const guide = [
    `## Q8 — GitHub Action + Playwright: Complete Setup Guide (for ${norm})`,
    ``,
    `### 🎯 Your Seeded Assignment & Ground Truth Answer`,
    `- **Assigned Seeds:** ${seeds.join(', ')}`,
    `- **Expected Total Sum Across All 10 Tables:** \`${total}\``,
    ``,
    `Use this exact sum to verify that your Playwright scraper ran correctly in your GitHub Action log.`,
    ``,
    `---`,
    ``,
    `### 📄 Step 1: Create \`scrape_tables.py\``,
    `In your GitHub repository, create a file named \`scrape_tables.py\` with this exact code:`,
    ``,
    '```python',
    `import re`,
    `from playwright.sync_api import sync_playwright`,
    ``,
    `SEEDS = [${seeds.map(s => `"${s}"`).join(', ')}]  # Your 10 assigned seeds`,
    `EXPECTED_TOTAL = ${total}  # Precomputed target sum`,
    ``,
    `def main():`,
    `    total = 0`,
    `    with sync_playwright() as p:`,
    `        browser = p.chromium.launch(headless=True)`,
    `        page = browser.new_page()`,
    `        for seed in SEEDS:`,
    `            url = f"https://sanand0.github.io/tdsdata/js_table/?seed={seed}"`,
    `            print(f"Scraping {url}...")`,
    `            page.goto(url, wait_until="networkidle")`,
    `            page.wait_for_selector("table")`,
    `            cells = page.locator("table td").all_inner_texts()`,
    `            for cell_text in cells:`,
    `                match = re.search(r"-?\\d+(\\.\\d+)?", cell_text.strip())`,
    `                if match:`,
    `                    total += float(match.group())`,
    `        browser.close()`,
    ``,
    `    int_total = int(round(total))`,
    `    print(f"TOTAL_SUM={int_total}")`,
    `    assert int_total == EXPECTED_TOTAL, f"Scraped sum ({int_total}) does not match expected ({EXPECTED_TOTAL})!"`,
    `    print("Scraping completed successfully.")`,
    ``,
    `if __name__ == "__main__":`,
    `    main()`,
    '```',
    ``,
    `---`,
    ``,
    `### ⚙️ Step 2: Create \`.github/workflows/scrape.yml\``,
    `In your repository, create \`.github/workflows/scrape.yml\` (make sure one step name contains your email \`${norm}\`):`,
    ``,
    '```yaml',
    `name: Scrape Table Sums`,
    ``,
    `on:`,
    `  push:`,
    `    branches: [ main, master ]`,
    `  workflow_dispatch:`,
    ``,
    `jobs:`,
    `  scrape-and-sum:`,
    `    runs-on: ubuntu-latest`,
    `    steps:`,
    `      - name: Checkout code`,
    `        uses: actions/checkout@v4`,
    ``,
    `      - name: Set up Python 3.11`,
    `        uses: actions/setup-python@v5`,
    `        with:`,
    `          python-version: "3.11"`,
    ``,
    `      - name: Install Playwright & dependencies`,
    `        run: |`,
    `          pip install playwright`,
    `          playwright install --with-deps chromium`,
    ``,
    `      - name: Run Playwright scrape for ${norm}`,
    `        run: python scrape_tables.py`,
    '```',
    ``,
    `---`,
    ``,
    `### 🔑 Step 3: Create GitHub Personal Access Token & Submit`,
    `1. Go to **GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**.`,
    `2. Generate a token with \`repo\` scope (or fine-grained token with \`Actions: Read\` and \`Contents: Read\` permissions).`,
    `3. Submit your repo URL and Token separated by a single space in the exam portal:`,
    ``,
    '```text',
    `https://github.com/<user>/<repo> <your_github_token>`,
    '```',
    ``,
    `---`,
    ``,
    `### 🔍 Checklist for 100% Success`,
    `- [x] The Playwright script ran and printed \`TOTAL_SUM=${total}\`.`,
    `- [x] Workflow step name literally contains your email: \`Run Playwright scrape for ${norm}\`.`,
    `- [x] The GitHub Action run is the **most recent** run on your default branch.`,
    `- [x] Token has read access to GitHub Actions logs.`
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `GitHub Action Playwright walkthrough for ${norm} (expected sum: ${total})`,
    answerDisplay: [
      `### Q8: GitHub Action + Playwright Table Scraping`,
      ``,
      `**Expected Total Sum Across Your 10 Seeds:**`,
      '```text',
      String(total),
      '```',
      ``,
      `**Assigned Seeds:** ${seeds.join(', ')}`,
      ``,
      `Follow the complete step-by-step setup guide below for your Python scraper script (\`scrape_tables.py\`), GitHub Actions workflow (\`scrape.yml\`), and submission format.`
    ].join('\n'),
    guide
  };
}
