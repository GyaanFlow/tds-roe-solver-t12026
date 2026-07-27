import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-github-action-playwright';
export const title = 'Q8: GitHub Action — Scrape Table Sums with Playwright';

// The exact same generator as Q9's `table.js` (verified byte-identical live: same seedrandom
// default import, same Math.round(random()*1000) grid) — Q8 just seeds it with its own
// question id, so the 10 page-seeds (and therefore the expected sum) differ from Q9's.
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
  return { seeds, total };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const { seeds, total } = computeExpectedSum(norm);

  const summary = [
    `Build a GitHub Action in your own repo that runs Playwright to scrape your 10 seeded table`,
    `pages, sum every number, print the total in the Action's logs, and name one workflow step`,
    `with your own email. The exact expected total (${total}) is precomputed below — this needs`,
    `a real repo + GitHub Action run either way, since that's what's actually graded, but now you`,
    `have ground truth to verify your scraper against instead of guessing.`
  ].join(' ');

  const guide = [
    `## Q8 — GitHub Action + Playwright: step-by-step (for ${norm})`,
    ``,
    `### Why this solver can't submit it for you (but can tell you the exact answer)`,
    `Grading fetches **your own** repo's latest GitHub Action run log via the GitHub API and`,
    `checks it for the correct sum **and** a workflow step named with your email — that part is`,
    `real infrastructure only you can create and run. But the underlying table generator`,
    `(\`table.js\`, fetched live and confirmed byte-identical to this project's own seeded`,
    `generator) is a pure function of your email — so the exact expected total sum **is**`,
    `computable in advance, removing all guesswork about whether your scraper got it right.`,
    ``,
    `### Your seeded pages and precomputed answer`,
    `Seeds: ${seeds.join(', ')}`,
    `(each: \`https://sanand0.github.io/tdsdata/js_table/?seed=${seeds[0]}\` through`,
    `\`...?seed=${seeds[seeds.length - 1]}\`)`,
    ``,
    `**Expected total sum across all 10 tables:**`,
    '```text',
    String(total),
    '```',
    `Use this to verify your Action's log printed the right number — don't just trust that the`,
    `script "ran without errors."`,
    ``,
    `### Step 1 — Write the Playwright scraper`,
    `In a new or existing public repo:`,
    '```python',
    `# scrape_tables.py`,
    `import re`,
    `from playwright.sync_api import sync_playwright`,
    ``,
    `SEEDS = [${seeds.join(', ')}]  # your 10 seeds, precomputed above`,
    ``,
    `def main():`,
    `    total = 0`,
    `    with sync_playwright() as p:`,
    `        browser = p.chromium.launch()`,
    `        page = browser.new_page()`,
    `        for seed in SEEDS:`,
    `            page.goto(f"https://sanand0.github.io/tdsdata/js_table/?seed={seed}")`,
    `            page.wait_for_selector("table")`,
    `            for cell_text in page.locator("table td").all_inner_texts():`,
    `                match = re.search(r"-?\\d+(\\.\\d+)?", cell_text)`,
    `                if match:`,
    `                    total += float(match.group())`,
    `        browser.close()`,
    `    print(f"TOTAL_SUM={total}")`,
    `    assert int(total) == ${total}, f"Expected ${total}, got {total} — check your scraping logic"`,
    ``,
    `if __name__ == "__main__":`,
    `    main()`,
    '```',
    `The \`assert\` line fails loudly in your Action's log if your scraper's total doesn't match`,
    `the precomputed value — much better than silently submitting a wrong number.`,
    ``,
    `### Step 2 — Add the GitHub Action workflow`,
    `Create \`.github/workflows/scrape.yml\`. **One step's \`name\` must literally contain your`,
    `email** (${norm}):`,
    '```yaml',
    `name: Scrape Table Sums`,
    `on: [push, workflow_dispatch]`,
    `jobs:`,
    `  scrape:`,
    `    runs-on: ubuntu-latest`,
    `    steps:`,
    `      - uses: actions/checkout@v4`,
    `      - uses: actions/setup-python@v5`,
    `        with:`,
    `          python-version: "3.11"`,
    `      - name: Install dependencies`,
    `        run: pip install playwright && playwright install --with-deps chromium`,
    `      - name: Run scrape for ${norm}`,
    `        run: python scrape_tables.py`,
    '```',
    `The step named \`Run scrape for ${norm}\` satisfies the "email in a step name" requirement`,
    `— adjust the exact wording however you like as long as your email substring is present.`,
    ``,
    `### Step 3 — Push, run, and verify the log`,
    `1. Push the workflow, then trigger it (push a commit, or use "Run workflow" if you kept`,
    `   \`workflow_dispatch\`).`,
    `2. Open the run's log — confirm \`TOTAL_SUM=${total}\` printed exactly, the assertion passed,`,
    `   and the step name shows your email.`,
    ``,
    `### Step 4 — Get a GitHub Personal Access Token`,
    `Create one at`,
    `[github.com settings → tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)`,
    `with at least \`repo\` read scope (classic token) or equivalent fine-grained "Actions: Read"`,
    `+ "Contents: Read" permissions, scoped to this repository.`,
    ``,
    `### Submit`,
    `Space-separated repo URL and token:`,
    '```text',
    `https://github.com/<user>/<repo> <token>`,
    '```',
    `The grader fetches your **latest** Action run's logs (checking for \`${total}\`) and its jobs`,
    `list (checking a step name containing your email) — make sure the most recent run on the`,
    `default branch is the one you want graded.`,
    ``,
    `### Common mistakes`,
    `- The most recent Action run isn't the one with the correct sum (e.g. you fixed a bug but`,
    `  never re-ran it) — always re-trigger after your last change and confirm the log shows`,
    `  \`${total}\`.`,
    `- Token lacks permission to read Action logs for that repo.`,
    `- Forgetting the email substring in a step \`name\` — it's checked literally, not in the`,
    `  script's stdout.`,
    `- Summing on the wrong table cells (headers, or a decorative table) — if your total doesn't`,
    `  match ${total}, check which elements actually hold the seeded numbers before assuming`,
    `  your Playwright selectors are right.`
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `GitHub Action Playwright walkthrough for ${norm} (expected sum: ${total})`,
    answerDisplay: [
      `### Q8: GitHub Action + Playwright Table Scraping`,
      ``,
      `This needs a real repo, a real GitHub Action run, and a real Personal Access Token —`,
      `inherently your own infrastructure that this offline tool can't create or run for you.`,
      `But the table generator is fully seeded from your email, so the exact expected sum below`,
      `**is** precomputable — use it to verify your scraper instead of guessing.`,
      ``,
      `**Expected total sum:**`,
      '```text',
      String(total),
      '```',
      ``,
      summary,
      ``,
      `Full scraper script (with a built-in assertion against this exact number), workflow YAML,`,
      `and submission format are in the guide below.`
    ].join('\n'),
    guide
  };
}
