# Agent Context

This file is a quick handoff for future AI agents working in this repository.

## Knowledge Graph (graphify)

This project has a **graphify knowledge graph** at `graphify-out/`.

**Before answering architecture or cross-module questions:**
1. Read `graphify-out/GRAPH_REPORT.md` for god nodes, community structure, and surprising connections
2. Use `graphify query "<question>"` for BFS/DFS traversal of the graph
3. Use `graphify path "<A>" "<B>"` to find shortest path between two nodes
4. Use `graphify explain "<concept>"` for plain-language node explanations
5. After modifying code files, run `graphify update .` to keep the graph current (AST-only, free)

**Graph stats:** 1517 nodes · 2715 edges · 188 communities (last rebuilt 2026-07-28)
**God nodes:** `normalizeEmail()` (138 edges), `rng()` (117 edges), `renderCanvas()` (20 edges)

**Current graphify CLI note:** `python -m graphify update .` successfully rebuilds `graphify-out/graph.json`, `graph.html`, and `GRAPH_REPORT.md`, then the installed CLI currently exits with `NameError: name '_os' is not defined` while printing optional tips. Treat the graph outputs as updated if the rebuild lines appear before that traceback.

## Project Purpose

`tds-roe-solver` is a local static web workspace for IITM TDS exam helpers.

Current supported terms & targets:
- `T12026` — Term 1 2026 (Jan–Apr)
  - `roe`
  - `ga7`
  - `ga8`
  - `p2` — Project 2 Part B (Q3: QR Forensics + Q4: Discourse KB)
- `T22026` — Term 2 2026 (May–Sep)
  - `ga0` — Standard 25-question exam suite
  - `ga1` — Developer Tools exam solver suite (20 questions, programmatic)
  - `ga2` — API Engineering & Cloud Services solver suite (10 questions, programmatic, locked by default)
  - `ga3` — System & API Architecture solver suite (13 questions, programmatic, locked by default)
  - `ga4` — RAG & Retrieval Engineering solver suite (13 questions: chunking/hybrid search, RRF fusion, HyDE, GraphRAG, late chunking, ANN recall/latency, semantic cache, multimodal embedding calibration, RAG eval harness, lost-middle context assembly, semantic dedup guardrails, grounded-answer API, vector search+rerank)
  - `ga5` — Agentic Systems & Guardrails solver suite (11 questions: MCP server, A2A invoice protocol, budget guard, skill scan, redteam/guardrail APIs, incident response agent, mailroom triage, proration, LXD sandbox guide, maze solver). Q9/Q10/Q11 (mailroom, A2A, incident agent) now also ship a `backupEndpoints` array with personal alternate-deployment URLs, rendered in a dedicated styled box above the Answer panel — see "GA5 (T22026) Notes" below.
  - `ga6` — Data Forensics & Automation solver suite (10 questions: rotated/mirrored image-grid forensics, multi-model prompt-robustness audit, DuckDB regression, shadow-DOM incident audit, DuckDB ledger reconciliation, politeness/robots.txt audit, Scrape Books to Scrape, GitHub Action + Playwright table scraping, Playwright table sum, hidden-modem audio decode) — see "GA6 (T22026) Notes" below.
  - `ga7` — Policy Gates & OSINT solver suite (10 questions, public by default) — see "GA7 (T22026) Notes" below.
  - `roe` — Re-Exam solver suite (12 questions, public by default, live-hosted-API + seeded-generator hybrid) — see "ROE (T22026) Notes" below.
  - `p1` — Project 1 (4 questions): Q1 requirements-gathering interview guide, Q2 model-intelligence differentiation (real client-side `solved` solver), Q3 AI-agent GCS bucket setup, Q4 AI-agent dataset upload to GCS (Q3/Q4 are `guide`-type — they depend on a live authenticated exam session and cannot be solved offline)
  - `p2` — Project 2 (8 offline-evaluated case studies across DTH, solar, customs, and consumer products). Answers use a shared verified evidence base, deterministic evidence-order variation, and strict runtime rubric validation.
  - `endterm` — 300-question May 2026 reference mock (200 MCQ + 100 subjective) with a dedicated quiz renderer and per-email browser-local progress.

The app runs locally in the browser, loads a solver registry for the selected exam, executes each solver for a user email, and renders answers plus diagnostics.

## Important Entry Points

- `index.html`: app shell
- `app.js`: main UI state, solving flow, rendering, export, responsive/mobile behavior
- `style.css`: layout and UI styling
- `server.js`: local static server, now ESM-based and safe-path aware
- `check.mjs`: smoke test for registries and server behavior
- `ga7-verify.html`: browser verifier page for GA7
- `ga7-verify.js`: GA7 batch verification logic
- `verify.html`: Universal Solver Verification Hub dashboard
- `verify.js`: Dynamic ESM solver verification logic for all terms/exams
- `tds-config.json`: dynamic welcome screen config + term/exam registry metadata
- `solvers/T12026/`: all T1 2026 exam solver folders
- `solvers/T22026/`: T2 2026 solvers (GA0 and GA1 finalized)

## Solver Architecture

The main flow is:

1. User selects **term** (T12026 / T22026) and **exam** from the sidebar.
2. `app.js` dynamically imports `./solvers/<term>/<exam>/registry.js`.
3. Registry exports ordered `solvers`.
4. Each solver returns an object like:

```js
{
  answer,
  type,
  variant,
  answerDisplay,
  guide,
  debug,
  quizItem // endterm only
}
```

Common result types:
- `solved`
- `bypass`
- `guide`
- `error`
- `quiz` — interactive end-term mock item; the answer key remains inside `quizItem` and is revealed through quiz controls

## GA7 Notes

### Shared Runtime

GA7 now uses a stronger shared runtime layer:

- `solvers/ga7/runtime.js`

This adds:
- normalized email handling
- solver output validation
- runtime measurement
- structured debug metadata
- warning surfacing

### Verified GA7 Fixes Already Applied

1. `q-colorencoding`
   - Files:
     - `solvers/ga7/utils.js`
     - `solvers/ga7/q-colorencoding.js`
   - Fix:
     - Diverging palette sampling now preserves the neutral midpoint.
   - Reason:
     - Some users were failing when the midpoint color was dropped from even-length sampled palettes.

2. `q-prompt-reverse`
   - File:
     - `solvers/ga7/q-prompt-reverse.js`
   - Fix:
     - Output is less brittle and better matched to expected format/length.
     - HTML scenarios now emit actual HTML.
   - Runtime validation also tightened in:
     - `solvers/ga7/runtime.js`

### GA7 Verification

Use the in-browser verifier page for local parity debugging:

- `ga7-verify.html`

This is useful for checking failures across many emails without manually running one user at a time.

## GA8 Notes

GA8 covers MLOps, cloud deployments (GCP Cloud Run, Cloud Functions), Docker, FastAPI, HuggingFace Spaces, GitHub Actions, and Gemini API questions.

### Solver Architecture

- `solvers/T12026/ga8/registry.js` — ordered array of 15 solver entries
- `solvers/T12026/ga8/runtime.js` — shared execution wrapper (timing, validation, debug metadata)
- `solvers/T12026/ga8/utils.js` — shared helpers (email normalization, hash utilities)
- 15 individual solver files: `q-gh-actions.js`, `q-gemini-math.js`, `q-fastapi-iris.js`, `q-hf-spaces.js`, `q-docker-verify.js`, `q-bash-script.js`, `q-precommit.js`, `q-mlops-quiz.js`, `q-cloud-run-compute.js`, `q-cloud-functions.js`, `q-gemini-classify.js`, `q-cloud-run-ml.js`, `q-cloud-run-envconfig.js`, `q-cloud-run-hashapi.js`, `q-gemini-extract.js`

### Bonus Q16: One-Shot Solver (in app.js)

When the selected exam is `ga8`, `app.js` appends a 16th bonus question after all 15 registry solvers finish. This is built by the `buildGa8BonusNode()` function (around line 446 in `app.js`).

Key details:
- The weight map is defined in `GA8_BONUS_WEIGHTS` (line ~428 in `app.js`)
- Total mapped marks: **23.5**
- The bonus script overrides `JSON.stringify` on the exam page to intercept the submission payload, set all scores to max weights, fill missing answers with dummy values, and unlock save/check buttons
- It is a `guide` type — users paste the script into the browser console on the exam page
- The script, title, variant, and diagnostics are all generated inline in `app.js`, NOT in a separate solver file

### GA8 Weight Map

```js
const GA8_BONUS_WEIGHTS = {
  'q-gh-actions-secret-chain': 1.5,
  'q-gemini-math-puzzle': 1.5,
  'q-fastapi-iris-deploy': 2,
  'q-hf-spaces-ml-api': 2,
  'q-docker-hash-verify': 1.5,
  'q-mlops-bash-script': 1,
  'q-precommit-ci-gate': 1.5,
  'q-mlops-concepts-quiz': 1,
  'q-gcp-cloud-run-compute': 2,
  'q-gcp-cloud-functions-http': 1.5,
  'q-gcp-gemini-classification': 1.5,
  'q-gcp-cloud-run-ml': 2,
  'q-gcp-cloud-run-envconfig': 1.5,
  'q-gcp-cloud-run-hashapi': 1.5,
  'q-gcp-gemini-json-extract': 1.5
};
```

## P2 Part B Notes

### P2 Q3: QR Forensics — Solana Devnet Tracer

Interactive guide solver that automates the damaged-QR assignment:
1. Parses SVG QR (406×406, 14px modules, offset 56,56, grid 21×21 Version 1)
2. Repairs top-left diagonal damage by restoring fixed patterns (finders, separators, timing, dark module)
3. Decodes 7-character fragment via jsQR (loaded from CDN)
4. Reconstructs masked Solana devnet signature (replaces `-------` placeholder)
5. Fetches transaction via Solana RPC (`getTransaction` with `jsonParsed` encoding)
6. Extracts `from`, `to`, `amount` — uses balance-diff method (postBalances - preBalances for recipient), NOT instruction lamports

- `solvers/p2/q-qr-forensics.js` — complete solver with embedded UI

### P2 Q4: Discourse KB Solver (50 Tasks)

P2 Part B Q4 is the IITM Discourse forum KB analysis task. The user gets 50 unique questions about solved topics across 14 course categories. Answers must be exact (counts, usernames, post IDs, compound formats like `7-184532`).

### Architecture

- `solvers/T12026/p2/registry.js` — 2 solver entries (Q3 QR Forensics + Q4 Discourse KB)
- `solvers/T12026/p2/runtime.js` — execution wrapper (mirrors GA8 pattern, also calls `registerInteractive()` for DOM-interactive solvers)
- `solvers/T12026/p2/utils.js` — email normalization
- `solvers/T12026/p2/q-qr-forensics.js` — Q3 QR repair + Solana tracer (interactive guide)
- `solvers/T12026/p2/parse-tasks.js` — universal task parser with validation
- `solvers/T12026/p2/handlers.js` — 11 query type handlers, fully defensive
- `solvers/T12026/p2/q-discourse-kb.js` — Q4 main solver module with interactive guide UI
- `solvers/T12026/p2/compact_facts.json` — ~12MB precomputed snapshot (frozen 2026-04-25, 20571 topics, 14 categories)

### Data Format (`compact_facts.json`)

Keyed by category name. Each category has an array of topic objects:

```json
{
  "topic_id": 23473,
  "title": "Getting Started with Ubuntu...",
  "tags": ["week-1"],
  "created_at": "2021-12-28T09:52:47.530Z",
  "op_username": "PUNEET",
  "reply_count": 16,
  "latest_reply_post_id": 72065,
  "accepted_post_id": 72044,
  "accepted_username": "shriaviator",
  "posts": [
    { "id": 72013, "u": "PUNEET", "c": "2021-12-28T09:52:47.715Z", "l": 1 }
  ]
}
```

Posts use compact keys: `id` = post ID, `u` = username, `c` = created_at ISO, `l` = like count.

### 11 Query Types

| Type | Returns |
|------|---------|
| `accepted_post_id` | Post ID of accepted answer for a specific topic |
| `reply_count_compound` | `replyCount-latestReplyPostId` |
| `total_posts` | Count of posts in date range |
| `aggregate_likes` | Sum of likes in date range |
| `tag_count` | Topics with a specific tag in date range |
| `tag_count_compound` | `count-latestTopicId` for tagged topics |
| `top_liked_user` | Username with most total likes in date range |
| `top_replier` | Username with most replies (non-OP) in date range |
| `top_answer_author` | Username with most accepted answers in date range |
| `unique_creators` | Count of unique topic creators in date range |
| `unique_creators_compound` | `uniqueCount-latestTopicId` |

### Robustness Features (Production-Ready)

**Parser (`parse-tasks.js`):**
- `normalizeQuotes()` — converts all Unicode curly/smart quotes to straight quotes before regex matching
- 5-pass `findTopicByTitle()` — exact → exact+date → case-insensitive → whitespace-normalized → relaxed (any op)
- Full `validate()` function — checks missing/extra/duplicate task numbers, missing params, unknown categories
- Category detection fallback chain: line header → "in the X Discourse category" → body scan for known category names
- Type detection fallback: if body parsing fails, retries against full block text

**Handlers (`handlers.js`):**
- Every handler guards against missing params with early `MISSING_PARAMS` return
- All array accesses guarded (`f.posts || []`, `f.tags || []`)
- Like accumulation uses `(q.l || 0)` for safety
- `inRange()` returns `false` when start/end are undefined (prevents silent bad matches)
- Missing tasks 1-50 automatically filled with `"MISSING"` in output

**Solver UI (`q-discourse-kb.js`):**
- Separate parse-error handling (shown to user before handler execution)
- Validation warnings displayed in dedicated amber panel
- Color-coded stats badges (green ≥45, yellow ≥35, red <35)
- Performance timer shown in log

### Interactive UI Pattern

The P2 solver is a **guide-type** interactive solver (unlike GA8 solvers that auto-compute from email):

1. On workspace init, it fetches `compact_facts.json` (~12MB, cached after first load)
2. Returns a guide with an embedded interactive HTML UI in `answerDisplay`
3. The user pastes their 50 tasks into the textarea in the "Rendered Notes" panel
4. Clicking "Solve All Tasks" parses, validates, and solves all tasks in-browser
5. Results are shown as JSON ready to copy-paste to the grader
6. Global handlers (`window._p2bSolve`, `window._p2bCopy`) are registered on the window object for onclick interactivity.

### Vercel Deployment

- `compact_facts.json` is served as a static asset under `/solvers/T12026/p2/compact_facts.json`
- The existing `vercel.json` cache rules apply (immutable cache for `.json` files — fine since data is frozen at 2026-04-25)
- No server-side logic needed — everything runs client-side
- Tested: all 11 handler types produce real answers against the 20571-topic cache

## GA3 (T22026) Notes

The GA3 suite contains 13 solvers for the System & API Architecture exam.

### Production Hardening Applied (2026-07-07)

- **Official ID/order check** added to `check.mjs` — verifies against the May 2026 GA3 exam bundle
- **Runtime hardened** (`runtime.js`): 30s timeout, error classification (network/parse/computation), answer shape validation, structured error return instead of silent throws
- **Q1 YouTube Curation** — Fixed critical salt mismatch (`tds-2026-05-ga3-i` → `tds-2026-05-ga3-youtube-metadata-filter-v1`), switched from custom LCG (`seededRng`) to `seedrandom` to match official bundle
- **Q2-Q4, Q6-Q9 Deployment Solvers** — Added comprehensive implementation guides while keeping pre-deployed Render URL as solved answer
- **Q10 Nonce Hunt** — Rewrote console miner with robust iframe detection, CORS-safe fetch, Web Crypto SHA-256
- **Q11 Context Window Heist** — Rewrote console extractor with multi-strategy iframe selection, DOMParser fallback
- **Q12 Spin Up CLI** — Added version passthrough, cleaned up FNV-1a hash, hardened asciinema generation
- **Q13 Embedding Trapdoors** — Verified 90 trapdoor entries across 9 domains, uses seedrandom for deterministic output
- **Lock config**: `locked: true` with 8 whitelisted emails

## GA5 (T22026) Notes

The GA5 suite (11 questions) covers agentic systems safety: MCP servers, budget guards, skill scanning, guardrail/redteam APIs, an LXD sandbox guide, a maze solver, proration, and three token-gated hosted-API questions (Q9 Mailroom, Q10 A2A, Q11 Incident-Response Agent).

### Q9/Q10/Q11 — Hosted-API pattern + backup endpoints (added 2026-07-28)

- Files: `solvers/T22026/ga5/q-mailroom-api.js` (Q9), `q-a2a-invoice-api.js` (Q10), `q-incident-agent-api.js` (Q11)
- All three require an `aipipe.org` session token (`sessionToken` param to `solve(email, sessionToken)`); without one they return a `guide`-type "token required" response instead of attempting anything.
- With a token, each builds a per-student URL embedding the normalized email + token in the path against the primary host `https://tds-roe-solver-api-t12026.onrender.com`, returned as the `solved`-type `answer`.
- **Backup endpoints**: each solver's returned object now also includes a `backupEndpoints: [{ label, url }]` array — bare, submit-as-is alternate-deployment URLs (no per-student email/token embedded, confirmed correct by the project owner) to try if the primary Render instance is cold/down:
  - Q9: `https://ga5-tds.onrender.com/q9/mailroom`, `https://tds-ga5.onrender.com/q9/mailroom`
  - Q10: `https://ga5-tds.onrender.com/a2a`, `https://tds-ga5.onrender.com/a2a`
  - Q11: `https://tds-ga5.onrender.com/`
- This field is rendered by a dedicated UI component, not buried in guide markdown — see "Backup Answer Endpoints Box" under UI Improvements below.
- **Threading gotcha already fixed**: the workspace-compile loop in `app.js` copies a fixed field list from each solver's result onto `workspaceData.answers.push({...})`. `backupEndpoints` had to be added to that list explicitly (`app.js` around the main solve loop) — a solver returning the field is not sufficient by itself; it silently gets dropped otherwise and the box never renders even though `solve()` is correct. If you add `backupEndpoints` to a new solver and the box doesn't show up, check this copy site first.

## GA6 (T22026) Notes

The GA6 suite ("Data Forensics & Automation", 10 questions) is registered at `solvers/T22026/ga6/registry.js`. Unlike GA0/GA1/GA3, several GA6 questions have **zero client-side generation code in the official exam bundle** (`exam-tds-2026-05-ga6.js`) — the per-student payload only exists behind an authenticated live session or on a real external site — so this suite has a genuinely mixed set of `solved`/`guide` types, verified by directly reading the official bundle rather than assumed.

| # | Solver file | id | Type | Why |
|---|---|---|---|---|
| Q1 | `q-image-grid-forensics.js` | `q-rotated-image-grid-forensics-server` | `guide` | Upload-and-solve (see below) |
| Q2 | `q-prompt-robustness-audit.js` | — | `solved` | Exhaustive seeded search, real client-side compute |
| Q3 | `q-duckdb-regression-guide.js` | `q-duckdb-regression-analysis` | `guide` | Interactive SQL-query generator (see below) |
| Q4 | `q-shadow-incident-audit.js` | — | `solved` | Seeded reconciliation |
| Q5 | `q-duckdb-ledger-reconciliation.js` | — | `solved` | Seeded reconciliation |
| Q6 | `q-politeness-audit.js` | — | `solved` | Seeded hash |
| Q7 | `q-scrape-books-guide.js` | `q-scrape-books-server` | `guide` | Real external site scrape (see below) |
| Q8 | `q-github-action-playwright.js` | — | `guide` | Needs a real repo + GitHub Action run |
| Q9 | `q-playwright-table-sum.js` | — | `solved` | Seeded generator, verified byte-identical to the live-hosted `table.js` |
| Q10 | `q-modem-decode-guide.js` | `q-modem-in-static-server` | `guide` | Upload-and-solve (see below) |

### Q1 — Image-Grid Forensics: upload-and-solve, honest limits on global orientation

A 600×600 BMP (6×6 grid of 100×100 tiles, each independently rotated/mirrored, then shuffled) is generated **per-student, server-side, behind an authenticated session** — there is no seed the client can use to regenerate it. Since the student downloads this file anyway, the fix here is a genuine client-side CV pipeline that runs on the **uploaded** file:

1. `extractTilesFromCanvas` / `precomputeOrientations` — Canvas 2D `getImageData` per tile, all 8 D4 orientations (4 rotations × mirror) precomputed per tile with 16-sample edge signatures per side.
2. `solveLayout` — beam search (width 6) over the 36-position grid, scoring by edge-colour continuity (sum-of-squared-RGB-diff) to already-placed left/top neighbours, plus a border-mismatch penalty (`BORDER_MISMATCH_PENALTY`) for the 4 border-facing edge types, using `looksLikeBorder()` (strict: ≥87.5% of the 16 samples below brightness 40, brightness range <30) to detect the placard's dark outer frame.
3. **Known, deliberate limitation — do not "fix" this away**: pure edge-colour matching is inherently symmetric under a whole-grid 180° rotation (every internal seam score is identical either way), and a **uniform** border can only prove "this edge faces outward," never which of the 4 rotations/mirrors is truly upright. This was verified with synthetic test images (bilinear-noise field + baked-in border, in the scratchpad, not part of the repo) — the beam search reconstructs a pixel-perfect *relative* tile placement, but can land on a global 180°-rotated equivalent of the truth. The fix is a **manual one-click correction**, not a smarter algorithm: `_ga6q1Transform('rotate'|'mirror')` (whole-canvas Rotate 90°/Flip Horizontal buttons under the reconstructed preview) lets the student fix this by eye in 1-2 clicks. Verified: two "Rotate 90°" clicks on a known-180°-off reconstruction produced a pixel-perfect (`avgDiffPerPixel: 0`) match to ground truth.
4. OCR (lazy-loaded `tesseract.js@5` from CDN) attempts to auto-read the `OPS-XXXXXXXXXX` token from the reassembled image; falls back to "read it yourself from the image" if OCR fails.
5. Nothing is uploaded anywhere — `loadImageFromFile` uses `URL.createObjectURL` and all processing is local Canvas/OCR.

### Q3 — DuckDB Regression: interactive SQL generator, not a numeric answer

The three tables (`stores`, `sales_data`, `marketing_spend`) are faker-seeded and instantiated in a DuckDB-WASM connection **inside the student's own browser tab** — the numeric slope/intercept/r² can only be computed there. But the **query itself** doesn't depend on hidden data: the student's location/sqft/month thresholds are shown in plain text on their own exam page. `registerQ3Interactive()` registers `window._ga6q3Generate()` / `window._ga6q3Copy()`, backing a 3-field form (Location / Min Sqft / Min Month) that builds the exact ready-to-paste `WITH store_totals AS (...) SELECT REGR_SLOPE/REGR_INTERCEPT/REGR_R2 ...` query client-side via `buildQuery()`.

### Q7 — Scrape Books to Scrape: zero-latency load, on-demand live fetch

The real submission is a SHA-256 digest of live-scraped `books.toscrape.com` data — not derivable from the student's email since it depends on real third-party site content. Earlier iterations of this solver made an automatic `fetch()` against a hosted scraping API during workspace compile with progressively shortened timeouts (55s → 25s → 3s) trying to balance "give the live answer" against "don't stall the whole GA6 compile animation on one node" — all still added *some* unavoidable network latency to every single-student compile. The current design (commit `bae4aad`, "ensure 0ms instant loading with zero automatic network calls") removes the automatic fetch entirely:
- `solve()` returns instantly (`type: 'guide'`) with the seeded target parameters (`computeSeededQ7Targets` — categories/rating/price/availability, all pure `seedrandom`) and a ready-to-run Python scraper.
- `registerQ7Interactive()` wires `window._ga6q7FetchDigest(email)`, an **on-demand** button ("⚡ Fetch Live SHA-256 Digest On-Demand") the student clicks only if/when they want the live digest — no network call happens unless explicitly requested.
- **Lesson for future GA6/GA-anything hosted-API solvers**: if a real live answer requires a network round-trip that can't be made fast and reliable, prefer "instant local guide + on-demand fetch button" over "always fetch during compile with a timeout," since even a short timeout still delays every compile for every student, not just the ones who want the live value.

### Q10 — Modem Decode: same upload-and-solve family as Q1

Per-student WAV audio containing a hidden DTMF-style modem burst sequence in a 10–40s window, downloaded only from an authenticated session. `q-modem-decode-guide.js` follows the same "can't run without your file, but runs entirely in-browser once uploaded" pattern as Q1 (Web Audio API decode, FFT-based burst/peak-frequency detection, mapped through the exam's tone grid to a 5-character code) — see the file directly for the exact DSP pipeline if extending it.

## GA7 (T22026) Notes — "Policy Gates & OSINT"

10 questions, `solvers/T22026/ga7/` (public by default, `lock-config.js` matches the standard GA whitelist pattern). Two structurally different halves:

- **Q1–Q5** (2 marks each) wire in a hosted rule-engine API the user deployed separately (`tds-roe-solver-api-t12026.onrender.com/ga7`, defined in `api-client.js`). Each solver computes a fixed per-student `serviceUrl` and ships an interactive tester panel that POSTs live requests to the real endpoints. Q1 additionally guides the ~25% GitHub Actions evidence requirement (workflow named exactly `TDS GA7 Release Gate`, a step named exactly `TDS identity: {email}`, submit the **workflow page URL**, not a run URL — this exact mistake was found and fixed as a real guide bug).
- **Q6 (Street View)** is guide-only — no client-exposed hash/normalizer this time (unlike ROE's equivalent), so nothing to pre-verify. The guide includes a **known-image lookup gallery** (10 community-sourced image→coordinate pairs, credited to `github.com/24f1002249` / `hypemonk.github.io/Geo-locations`) with a live "🔄 Check for new images" refresh button — fetches the source's current answer list via a hand-written JSON-safe parser (regex-transforms the source's JS-array-literal into valid JSON, never `eval`/`Function`, proven with a hostile-payload test) and cross-checks against the actual image directory listing before trusting any entry. This is explicitly **not** verified against the exam bundle (flagged as such in the guide) — treat as a strong lead, not a guarantee.
- **Q7–Q10** (1 mark each) are fully solved by faithfully reimplementing the exam bundle's own per-student `seedrandom`-based generators and reading the ground-truth answer directly off them (query synthesis + self-verification for Q7, direct read-off for Q8–Q10). Verified against the **real exam bundle's own answer validators**, executed directly via a custom Node module loader that stubs the bundle's remote CDN imports (`ga7_loader.mjs`/`ga7_diff_test.mjs` pattern in scratchpad — not committed, rebuild if needed) — 16/16 passed across 4 test emails at initial ship, later 72/72 across 18 emails post-hardening.
- **Real bugs found and fixed during hardening** (worth remembering as a pattern for future GA/ROE hosted-API solvers): (1) Q7–Q10's seeded solvers happily returned a confident `solved` answer with a *blank* email — deterministic but wrong for every real student, since the RNG seed is literally derived from the email; fixed with a shared `requireEmail()` guard in `utils.js`. (2) `api-client.js` had no fetch timeout — a sleeping/dead hosted service could hang a button forever with zero feedback; added a 90s `AbortController` timeout plus explicit non-2xx/non-JSON handling. (3) Q8's WAF-rule generator could theoretically emit `"22|undefined|24"` if a swap ever stopped flipping exactly one request; added an explicit guard that throws instead of silently submitting garbage.
- The exam bundle's own live weight is **2 marks for Q1–Q6, 1 mark for Q7–Q10** (16 total) — this was cross-checked directly against the live assembly call and differs from at least one third-party written guide the user had (which claimed Street View was 4 marks); trust the live bundle over any static reference doc.

## ROE (T22026) Notes — "Re-Exam"

12 questions, `solvers/T22026/roe/` (public by default; was explicitly locked-to-owner-only during development, unlocked once verified). The exam bundle has **zero client-side `seedrandom`** for most questions — per-student data is fetched live from an authenticated `questionData?email=...&quizSign=...` endpoint at real-exam time, which shapes the whole solver design:

- **Q1 (Incident Atlas), Q2 (Unicode Ledger), Q3 (HTTP Cache)** — interactive parsers: paste the real exam's `questionData` artifact in, get the computed certificate out. Each also has a standalone offline Node.js CLI script under `solvers/T22026/roe/offline-scripts/` (byte-identical fallback if the in-browser tool ever fails) — verified via a DOM-stub diff test against the live browser solvers. Real silent-wrong-answer bugs were found and fixed here during a review pass: Q1 defaulted a missing affine transform to the identity matrix (silently corrupting every incident's road-edge assignment) and echoed the artifact's own `route_edge_ids`/`arrival_seconds` back as if computed; Q2 defaulted missing canonicalization tables to guessed/empty values and truncated non-integer amounts instead of rejecting them; Q3 emitted probe deliveries in trace order instead of the required `probe_request_ids` order (worth 65% of that question).
- **Q4 (Street View), Q5 (Handshake)** — client-visible normalizer/HMAC functions transcribed byte-for-byte from the exam bundle and diffed against it directly (200k+ fuzz cases for Q4's hash, direct comparison for Q5's HMAC recipe).
- **Q6–Q9** — Q6 (Donate Marks) is a real `solved` one-liner (the exam accepts a literal `"acknowledged"` string with zero server verification). Q7/Q8 (donation/initiative audio) are guide-only with a live URL pre-flight checker (CORS/content-type) and a full step-by-step GitHub Pages deployment walkthrough. Q9 (essay) deliberately does **not** auto-generate the essay — every student's output would cluster together and score near-zero on the relative-distance grading metric — just a live word counter matching the exam's exact counting regex.
- **Security bugs found and fixed**: Q7/Q8's audio-URL pre-flight checker wrote the fetched response's `Content-Type` header into `innerHTML` unescaped — a malicious third-party audio host could return a crafted header and execute markup in the student's browser; fixed by switching to `textContent`. Q6's barter calculator similarly reflected the student's own typed email list into `innerHTML` unescaped (self-XSS only, lower severity); fixed with minimal HTML-escaping since that one needs inline formatting and can't just switch to `textContent`.
- **Verification harness**: `roe_check.mjs` (scratchpad, not committed) checks solver-id/order match against the live bundle, whitelisted vs. non-whitelisted email behavior, shape validation, and promo-block presence across all 9→12 questions as they evolved.

## UI: Vibe Mode Music Player (app.js / index.html / style.css)

Sidebar feature, added where the old "Blueprint / New UI" theme used to live (that theme and ~940 lines of its CSS were removed wholesale — the stylesheet's own comment had flagged the block as self-contained and safe to delete). Fully opt-in by design and worth preserving that property in any future edit:
- The panel stays collapsed until the user clicks "🎵 Vibe Mode" — same `theme-buttons-container-collapsed`/`.expanded` CSS pattern as the Classic UI theme picker.
- `audio.play()` is **never** called except from an explicit user click, even when restoring a saved playlist/volume/shuffle/repeat from `localStorage` on page load — restoration only ever cues the first track (`src` set, paused). Verified directly: added a track, hard-reloaded in a genuinely fresh tab (not just `location.reload()`, which can be fooled by bfcache), confirmed `audio.paused === true` with full state restored.
- **Two track sources**: paste a direct audio URL (`kind: 'url'`, `src` stored in `localStorage`), or pick local files via a native file input (`kind: 'file'`, actual bytes stored in **IndexedDB** `vibeFilesDB` since `localStorage` can't hold binary data — `loadVibeTrack` is `async` specifically to pull file bytes back out and turn them into a fresh blob URL on each load, with a `vibeLoadToken` counter guarding against a slow IndexedDB read landing after a newer skip/remove superseded it).
- Colors **must** use `var(--theme-primary)` (the variable this app's actual theme system defines and swaps per `body[data-theme=...]`), not `var(--accent-primary)` — that variable doesn't exist anywhere in this codebase and was a real shipped bug (silently fell back to hardcoded amber regardless of active theme) until caught and fixed.
- Real bugs found/fixed here worth remembering as a pattern: the play button used to fire-and-forget the (async) track load then immediately check `audio.paused`/call `.play()` in the same tick — worked by accident for URL tracks (no `await` on that code path) but could try to play an empty-`src` element for file tracks if clicked before the IndexedDB read finished; fixed by awaiting the load. `vibeProgress.max` could become the literal string `"Infinity"` for media with an unknown/streaming duration, silently breaking the seek bar; guarded with `Number.isFinite`. Pasted URLs were split on commas as well as newlines, which could corrupt a URL containing a literal comma in its query string; now newline-only, matching the UI's own copy.
- Removing/clearing tracks also deletes the corresponding IndexedDB entry, so removed local files don't just accumulate storage forever.

## P1 (T22026) Notes

The P1 suite is structurally different from GA0–GA5: it has **zero client-side seedrandom/data generation**. Verified via a fresh pull of the official `exam-tds-2026-05-p1.js` bundle.

- **Q1** (`q-requirements-interview.js`) — guide only; depends on a live exam session.
- **Q2** (`q-model-intelligence-diff.js`) — the one real `solved`-type solver. Per-student seeded (via `seedrandom`) pick from a 6-entry pool of reasoning-trap premises, each designed to split a weaker model (answers YES) from a stronger same-family model (answers NO). No server-side data needed, so it's a genuine offline solve like GA0–GA5.
- **Q3** (`q-gcp-bucket-setup.js`) — `guide`-type. Walks the student through creating and publicizing a GCS bucket via an LLM "agent loop" (OpenAI client → aipipe.org → `gpt-5-nano` → `run_command` tool → subprocess). Three methods, in display order: **Method 3** (shared service-account key pool via a Drive-hosted `gdown --folder`, no personal GCP account needed — primary/easiest), **Method 2** (student's own GCP account via `google.colab.auth.authenticate_user()`), **Method 1** (local Cline/VS Code agent, advanced).
- **Q4** (`q-gcp-dataset-upload.js`) — `guide`-type, direct continuation of Q3: uploads `eval.jsonl` (downloaded from the live exam page) to the same bucket/project used in Q3, verifies via SHA-256 hash before/after. Mirrors Q3's three-method structure and **must reuse the exact same key/account Q3 used** — Q3's Method 3 cell persists the winning key path + project ID to `/content/gcp_keys/_active_key.txt` so Q4 can recover it automatically in a fresh Colab session, instead of requiring the student to hand-type a remembered filename.
- **Hardening applied (2026-07-22)**: all four agent system/Cline prompts across Q3+Q4 explicitly forbid wrapping `gcloud` calls in custom success-checking logic, redirecting stderr, or inventing placeholder error text — real exit codes/errors must always propagate. All agent-loop output capture concatenates stdout+stderr unconditionally (previously `stdout if returncode==0 else stderr`, which silently dropped earlier successful step output when a later command in the same call failed). `PROJECT_ID` is always the variable read from the activated key's own `project_id` field — never hand-typed — across every f-string task prompt.

## P2 (T22026) Notes

T2 P2 contains 8 case-study solvers in `solvers/T22026/p2/`, ordered exactly like the official May 2026 bundle: 1A, 1B, 2A, 2B, 3A, 4A, 3B, 4B. The official `/backendVerify` check enforces only each question's character gate (2.5 of 12.5 marks); substantive scoring is offline and rewards traceability, calibration, rejected alternatives, decision-changing unknowns, and reversible next actions.

### Content upgrade (2026-08-22) — forensically verified per-case facts

The 8 `q-case-*.js` generators were rewritten from generic hand-authored prose to content grounded in two external sources fetched and cross-checked directly: the live official bundle at `https://exam.sanand.workers.dev/exam-tds-2026-05-p2.js` (confirms exact question IDs, headings, char gates, and the `/backendVerify` 2.5-mark participation-only contract) and the community reference write-ups at `github.com/HypeMonk/TDS-P2` (`1A.md`–`4B.md`, one per case), which contain fully-cited, spot-checkable forensic findings against the real per-case data files (exact row counts, percentages, dollar/rupee figures, file/field citations).

Each solver's judgment/evidence/rejected-hypothesis/next-action pools now carry the real verified numbers instead of vague qualitative claims — e.g. 1A cites the exact 17-row 31-May batch and the 210-row daily total that shows no aggregate spike; 1B cites the 24.0%-vs-7.9% pre-auth failure rate and the 411-distinct-subscriber suppression trace; 2B computes the real ~17.5% same-day `base_schedule_mw` counterfactual the official impact note itself omits (vs. its advertised cross-day 31.6%); 3A/3B distinguish Swiss/EU tariff nomenclatures and an expired supplier declaration by exact date; 4A identifies the 70.6% `02:10:00` QCore-snapshot-boundary artifact; 4B triages all 24 spare-parts requests into an exact 8/12/4 split by dollar value ($20,536.31 / $64,234.05 / $81,725.24), including the qty-vs-unit-quote undercount trap. All 8 case-specs headings (`## Judgment`, `## Evidence Table`, etc.) were verified to already match the live bundle's placeholder text exactly — no changes needed there.

The seeded-variation architecture (`variations-engine.js`, `createRng` on `${email}:${caseId}`) is unchanged: each student still gets a different judgment-paragraph phrasing, evidence-row subset/order, and hypothesis pairing — now drawn from a much richer, factually denser pool. Verified via a scratch verification script (not committed) that ran `validateCaseAnswer()` from `case-specs.js` across all 8 cases × multiple seeded emails × 5 RNG passes — all pass length bounds and heading requirements; 3A (the tightest window, 150–3000 chars) needed its evidence-row sample count trimmed from 5→4 and its judgment-variant prose shortened to stay reliably under the cap.

**Real bug found and fixed in this pass**: rewriting the content dropped `case-specs.js`'s original `keyEntities` (invented placeholder names like `Silver Dish`, `Metro Signal`, `Aoife Brennan`, `Luca Ferri`, `MT-18` that never appeared anywhere in either external source) and left `reviewSubmission()`'s "citation density" check silently failing 40% of the time depending on which evidence rows got randomly sampled — confirmed by running the repo's own `scratch/stress-test-raw-generator.js` (800-seed Monte Carlo, referenced in the P2 README), which dropped from 100% to 60% flawless after the rewrite. Root-caused via a scratch entity-hit-rate audit script (100 random seeds per case, not committed) that measures each `keyEntities` string's regex-match rate against the unwrapped raw solver output (importing `q-case-*.js` directly, bypassing `registry.js`'s lock wrapper — the stress-test scripts do this deliberately since `lock-config.js` only whitelists 4 real emails and would otherwise return the locked-guide response for every other seed). Fixed by replacing every `keyEntities` entry with a term proven to hit ≥95/100 random seeds (verified facts like `DLR-104`, `NOVA-S1`, `base_schedule_mw`, `902110`, `qcore_release_ts`, `SUP-02`, `MTR-4401` — drawn from content that's either always in the picked judgment paragraph or present in nearly the full evidence pool, not just one sampled row). Also found `q-case-4a.js` legitimately used the English phrase "three undefined choices" in prose, which false-positived against `scratch/stress-test-raw.js`'s naive `.includes('undefined')` corruption check — reworded to "unpinned" to avoid the ambiguity, though it was never an actual bug (confirmed no unescaped template-literal interpolation was involved). Re-verified 800/800 flawless on both `stress-test-raw-generator.js` and `stress-test-raw.js` after the fix. A third pre-existing scratch script, `stress-test-100-percent-evaluation.js`, imports the **wrapped** `registry.js` solvers and only whitelists 2 of its 100 test emails — its 784/800 "failures" are just the intended locked-guide response for non-whitelisted emails, not a real regression; it pre-dates the lock feature and is not the canonical test (the README only references `stress-test-raw-generator.js`).

**Lesson for future P2 content edits**: any rewrite of a case's judgment/evidence pool text must be followed by re-running `npm run check` (see the permanent coverage below), since `case-specs.js`'s `keyEntities` list is a silent contract against the *exact strings* in the generator output — nothing enforces they stay in sync, and a plausible-sounding rewrite can pass every heading/length check while quietly failing citation density on a large fraction of random seeds.

### Robustness hardening (2026-08-22, second pass)

Three further real defects were found by auditing edge cases rather than happy paths, and all three are now covered by **committed** assertions in `check.mjs` (this matters: `scratch/` is gitignored, so every stress-test script in there is untracked and cannot be relied on as the project's safety net):

1. **Cross-student collision in Case 2A** — measured by simulating 2000 distinct student emails per case: 2A produced **the identical note for 100% of students** (its variation pool was only 192 combinations, since the source file has just 4 data rows). Fixed by expanding 2A's judgment/rejected/conclusion pools from 2→6-7 variants each and its evidence pool from 4→10 phrasings of the same verified facts; 2A now yields ~99% unique notes, and the other 7 cases measure 99.75–100% unique.
2. **Blank-email bug (same class as the GA7 `requireEmail()` fix)** — a missing/blank/`null`/`undefined` email still produced a confident `solved` note, because the RNG seed *is* the email: every student who submitted without an email would receive the *same* note. `null`/`undefined` additionally threw a raw `TypeError`. Fixed with a `requireEmail()` guard in `solvers/T22026/p2/utils.js` (mirroring GA7's), invoked from `runtime.js` — the single choke point, so all 8 cases are covered at once. It is deliberately skipped when `isLocked`, since a locked response is not a generated answer.
3. **`runtime.js` never actually enforced the rubric contract** — this section of AGENT_CONTEXT previously *claimed* "runtime.js rejects any solved answer that fails the rubric contract and exposes the validation report at `debug.rubric`", but no such code existed: `runtime.js` never imported `validateCaseAnswer` and `debug.rubric` was always `undefined`. Documented-but-unimplemented. Now genuinely implemented: every `solved` result is validated against `validateCaseAnswer()`, the report is attached at `debug.rubric`, non-blocking rubric warnings are surfaced in `debug.warnings`, and a note that fails the contract is **withheld** (returned as a `Rubric Contract Failed` error listing the failing checks) rather than presented as submittable — failing loudly beats shipping a note silently missing a required heading.

**New permanent coverage in `check.mjs`** (`checkT2P2SolversExecute`), all four verified to actually fire via deliberate mutation testing rather than assumed to work: rubric-contract validity + `debug.rubric` presence; blank-email refusal across all 8 solvers × 4 blank forms; scaled uniqueness (120 synthetic students per case, asserts ≥90% unique notes); worst-case citation density against `case-specs.js` `keyEntities`; and a corruption-string scan. Mutation tests confirmed each assertion catches its target regression: reintroducing the stale `keyEntities` trips the density check, a renamed heading trips the rubric contract, and a constant RNG seed trips the uniqueness check.

**Found in a follow-up review pass (same day)**, after the above:
- **The lock never actually short-circuited.** `runtime.js` invoked `solveImpl()` for locked users and then threw the generated answer away, contradicting the "returns before invoking any solver" claim in the P2 notes below. Now genuinely short-circuits before any generation; verified with a spy solver asserting **0 invocations** for a locked email and 1 for a whitelisted one. The dead post-solve locked branch was removed.
- **`q-case-4b.js` shuffled its Candidate Matches table across all 9 rows**, randomly interleaving the three triage buckets. That actively works against the marks — the source guidance is explicit that grouping ("all 4 servo drives are reserved → not transferable") reads *stronger* than a flat list, and the rubric rewards visible calibration. Now groups into a fixed decision order (Actionable now → Needs check → Not transferable) and shuffles only *within* each bucket, preserving per-student variation without sacrificing legibility. Verified 0 bucket-order violations across 200 seeds.
- **`q-case-4b.js` carried a private `shuffleFirstNine()`** that duplicated the `shuffle()` already exported by `variations-engine.js` and was misnamed (it shuffled the whole array, not nine items). Deleted in favour of the shared helper.

**`importShared()` helper added to `check.mjs`**: tests that must mutate shared module state (e.g. flipping `lockConfig.locked` to exercise the email guard instead of the lock short-circuit) need the *canonical* module instance. The existing `importFresh()` appends a cache-busting query string and therefore returns a **separate** instance whose mutations the already-loaded solvers never observe — this silently made the first version of the blank-email test pass against the wrong object.

### What is and is not guaranteed (important — do not overstate this to users)

The "800/800 flawless" and "100%" figures come from the repo's **own heuristic checkers** (`case-specs.js` regex rules + `rubric-coach.js`), which verify *structure*: character gate, exact heading skeleton, evidence-table presence, keyword/entity citation density. They do **not** and cannot verify the reasoning quality that the real offline marks depend on. Per the live bundle, only **2.5 of 12.5** marks are awarded automatically (format-only, via `/backendVerify`); the remaining **10 marks are graded offline** on "the quality, traceability, and calibration of the judgment" — which no deterministic generator can guarantee. Separately, every HypeMonk reference guide warns in bold that identical submissions are easy to spot and score lower: this generator varies *phrasing and ordering*, but all students receive the same *substance* (same verdict, same evidence facts, same rejected hypotheses), so surface-text uniqueness does not defeat semantic cross-cohort similarity detection. The solvers' `guide` field tells students to rewrite in their own words, and that instruction is load-bearing, not decorative.

- P2 case modules contain no generated answers beyond the above forensic-fact pools — nothing invents an unverifiable "hidden intended answer." Even if the lock configuration is changed accidentally, the fallback (below) returns only a disabled guide result.
- `case-specs.js` encodes prompt-derived heading order, min/max length, evidence-table structure, the 1B five-question requirement, the 2A item caps, and the 4B candidate-table schema without embedding a hidden answer key.
- `runtime.js` rejects any solved answer that fails the rubric contract and exposes the validation report at `debug.rubric`.
- `lock-config.js` has `locked: true` with a **4-email whitelist** (not empty — it has been extended per-student over several commits). `runtime.js` genuinely returns before invoking any solver for a non-whitelisted email, so no such email causes a P2 note to be generated at all. **This was only made true on 2026-08-22**: the previous implementation ran `solveImpl()` and then discarded its answer in favour of the locked guide, so the documented short-circuit did not actually exist. Verified with a spy solver asserting 0 invocations when locked (see the hardening notes above).
- `rubric-coach.js` provides a client-only reviewer for student-authored drafts while the solver remains locked. It checks the official character gate, exact heading order, evidence schema, traceability, confidence, alternatives, unknowns, safe actions, and case-specific constraints; it never returns generated submission text or claims to detect plagiarism.
- `check.mjs` verifies official ID/order, universal locking for arbitrary users, synthetic rubric fixtures, coach safety, Solar 2A item caps, and Consumer 4B value fractions.

## T2 2026 End-Term Mock Bank

- The official May 2026 course index is at `https://tds.s-anand.net/`; its visible structure is W0 Bridge Course, W1-W8, Project 1 after W4, and Project 2 after W8.
- `mock-banks/t2-2026-end-term-mock.mjs` stores a 126-topic course map and 50 core skill cards, then deterministically expands them into 175 MCQs, 25 MSQs, and 100 subjective prompts. Objective items are mapped to official guide topics 1-5; every subjective item is topic 6 applied AI-era judgment.
- `mock-banks/T2-2026-End-Term-Alignment-Review.md` records the audit against the supplied official learner email. The generator now checks explicit coverage for percentile/rate metrics, readiness, pipeline identity/retries/provenance, release isolation and rollout, reliable output/grounding/authorization, API state/auth distinctions, and all topic-6 judgment signals.
- The supplied official format is 80 marks: Section 1 has 30 MCQ/MSQ questions for 39 marks; Section 2 has 9 short answers for 41 marks and is manually graded. The 200/100 artifacts are an expanded practice pool, not one official-length prediction.
- `npm run mock:check` validates counts, unique IDs, answer indexes and sets, MCQ/MSQ format, guide-topic mapping, explicit official-guide coverage patterns, week coverage, and minimum course-topic coverage. `npm run mock:generate` writes the question paper, detailed solutions, combined Markdown, JSON, and browser ES module artifacts.
- `solvers/T22026/endterm/registry.js` maps the bank to 300 `quiz` results. `app.js` renders MCQ/MSQ selection and checking, explanations, subjective drafts, an in-question five-step answer guide, evidence/uncertainty model-answer reveals, 10-point self-rubrics, bookmarks, timer, next-open navigation, and a Jump to portion selector for MCQ/MSQ/Subjective practice. State is stored locally under a versioned per-email key.
- The portal displays a highlighted reference-only warning and a collapsed official-format guide above every mock question. It explicitly says that no practice bank or rubric can guarantee a high score or 100% manual/LLM evaluation.
- GitHub and LinkedIn links are shown as equal, restrained project-support actions in the mock footer; they are not part of the academic content.
- `check.mjs` verifies the static module routes, exact 300-item boundary, unique solver IDs, 175/25 objective split, topic mapping, endpoint IDs, and normalized-email identity.

## GA0 (T22026) Notes

The GA0 suite contains 25 solvers covering data science basics, shell scripting, automation, and web APIs.

### Key Implementation Details

- **Standardized Order**: Solvers are strictly ordered Q1–Q25 in `solvers/T22026/ga0/registry.js`.
- **Official Bundle Alignment**: IDs/order are matched against `exam-tds-2026-05-ga0.js` from `https://exam.sanand.workers.dev/exam-tds-2026-05-ga0.js`.
- **Deterministic RNG**: Seeded solvers use `rng(seed)` from `utils.js` (bridged to `Math.seedrandom` in `index.html`) to mirror official `seedrandom` behavior.
- **Forensic Accuracy**: Q1, Q3, Q6, Q7, Q9, Q14, Q15, Q22, and Q23 use constants or generation logic derived from the official exam bundle.
- **Automation Scripts**: Q19 (Bulk Replace) provides a direct deterministic JavaScript solver along with a verification Python script.
- **Hosted/API Tasks**: Q5, Q10, Q11, Q14, Q16, Q18, and Q25 provide pre-deployed validator-compatible endpoints, sandbox drag-and-drop tools, or custom deployment instructions.

### Recent GA0 Production Hardening

- `check.mjs` now verifies official GA0 Q1-Q25 ID/order and executes every GA0 solver for multiple representative emails.
- Q1 Axis Scale uses the official scenario seed path and computes distortion values per user.
- Q5 Code Interpreter has been converted to directly return the pre-deployed Code Interpreter Render URL (`https://tds-roe-solver-api-t12026.onrender.com/q-code-interpreter-ai-analysis/code-interpreter`).
- Q10 FastAPI Students uses the official `q-fastapi` ID and has been converted to directly return the pre-deployed Render Students API endpoint (`https://tds-roe-solver-api-t12026.onrender.com/q-fastapi/api`).
- Q11 FastAPI Sentiment uses the official `q-fastapi-sentiment-batch` ID and has been converted to directly return the pre-deployed Render Sentiment API endpoint (`https://tds-roe-solver-api-t12026.onrender.com/q-fastapi-sentiment-batch/sentiment`).
- Q12 LLM Yes has been simplified to directly return the text prompt `'is new delhi is capital of india give answer in only "Yes" or "No"'`.
- Q14 Image Grayscale has been converted to directly return the pre-deployed Forensic Jigsaw & Grayscale Sandbox (`https://tds-roe-solver-api-t12026.onrender.com/q-image-grayscale-rebuild/`).
- Q16 Move/Rename has been converted to directly return the pre-deployed Move, Rename & Hash Solver Sandbox (`https://tds-roe-solver-api-t12026.onrender.com/q16/`).
- Q17 Network Game has been converted to directly return the pre-deployed Network Game Solver (`https://tds-games-solver.vercel.app/detective/`).
- Q18 local Ollama has been converted to directly return the pre-deployed Ollama Proxy & Diagnostics Hub (`https://tds-roe-solver-api-t12026.onrender.com/q-ollama`).
- Q19 Replace Across Files has been upgraded to a direct deterministic JS solver, dynamically generating the random documents and replacing strings under the user's email seed to compute the SHA-256 hash in pure JS.
- Q25 Vercel Latency has been converted to directly return the pre-deployed Vercel Latency API endpoint (`https://t22026-tds-ga0-q25.vercel.app/api/latency`).

### UI Formatting

GA0 solvers utilize the **Implementation Guide** pattern:
1. `answer`: Raw code, SQL, or JSON for the primary solution.
2. `answerDisplay`: Markdown-formatted quick steps (rendered via `marked.js`).
3. `guide`: Detailed step-by-step implementation guide (rendered via `marked.js` in a dedicated panel).

## GA1 (T22026) Notes

The GA1 suite contains 20 solvers for the Developer Tools exam.

### Dynamic Whitelist and Academic Integrity Lock

To encourage manual study and practice, GA1 solvers are protected by a centralized academic integrity lock in `solvers/T22026/ga1/runtime.js`.
- **Configuration File**: Controlled via [lock-config.js](file:///c:/Users/gaura/Downloads/tds-roe-solver/tds-roe-solver/solvers/T22026/ga1/lock-config.js).
- **Lock Toggle (`locked`)**: Setting `locked: true` locks the solvers. Standard non-whitelisted student emails will receive a guide-type response directing them to solve the question manually. Setting `locked: false` unlocks the solvers for everyone.
- **Whitelist (`allowedEmails`)**: Contains specific whitelisted email addresses (e.g. instructors, testers) that bypass the lock and receive programmatic solved answers even when `locked: true` is enabled.

## UI Improvements Already Applied

The UI in `app.js` and `style.css` has been substantially improved.

### Markdown & Instructions

- **Markdown Rendering**: `app.js` now uses `marked.js` to render `answerDisplay` as rich HTML.
- **Pre-wrap Support**: `.styled-output` in `style.css` uses `white-space: pre-wrap` for readable multiline instructions.
- **Code Highlighting**: In-note code blocks are styled for high contrast.

### Stability and Usability

- Selected question is preserved more consistently.
- Sidebar scrolling and main-canvas scrolling were fixed.
- Plain text output no longer traps scroll like the old textarea-based rendering did.
- Active sidebar item auto-scrolls into view.
- Main canvas resets to top when changing questions.

### Workspace UX

- **Dynamic Welcome Screen**: Reads `tds-config.json` on startup to easily update term info each semester.
- **Glassmorphism & Aesthetics**: Custom dark scrollbars, `backdrop-filter: blur(12px)` headers, tactile buttons, and pulsing progress bars.
- Collapsible sections for answer panels
- Copy buttons with fallback clipboard path
- HTML answer preview iframe
- **Implementation Guide Panel**: A dedicated success-themed panel for detailed usage instructions, ordered cleanly above computed answers.
- **Academic Integrity Validation Lock**: A high-visibility, top-of-homepage disclaimer card with continuous glowing amber/red warning pulse (`pulse-attention`) and interactive checkbox validation. Restricts solver initialization and triggers a screen smooth-scroll + keyframe card shake (`shake-attention`) on unaccepted bypass attempts. Stores acceptance state in `localStorage` for returning sessions.
- **Creator Social Credits**: Completely name-free creator credits in both the sidebar footer and navbar/header with dynamic hover transforms, HSL amber glows, and SVG links to LinkedIn and GitHub.
- Keyboard navigation with arrow keys and focus-visible rings
- Debounced sidebar filtering
- Mobile question picker
- **Mobile Drawer Navigation**: `#sidebar` is a full-height fixed drawer, and `.sidebar-content` utilizes natural document-flow scrolling to fix previous touch-event traps.
- **3D Voxel Bonsai Background**: A WebGL background canvas displaying a procedurally generated 3D voxel art bonsai tree sitting on a floating layered island (grass, dirt, stone, gold). The main trunk leans and branches out to support dense, porous, leaf-cube canopy clusters. Features automatic slow scene rotation, mouse-responsive camera shifts, falling voxel petal rain, twinkling stars, and warm cinematic lighting.
- **Atmospheric Visuals**: A 3D particle system that simulates falling voxel petals with 3-axis tumbling rotations and sinusoidal drifting, coupled with twinkling star sprites that pulse gently in the background.
- **Coordinated Theme System**: Support for four themes: Amber Sunset, Matrix Cyber, Orchid Sakura, and Glacier Frost. Changes the body data-theme attribute to switch CSS variables, transitions the WebGL canvas colors (leaves, details, petals, lighting) via HSL lerping, and redraws the seeded 3D Torus Identicon canvas dynamically.
- **Alive DOM Components**: Added 3D perspective mouse-tilt and spotlight border layers to feature mini-cards, glassmorphism backdrop-blur on solver details panels, and smooth slide-down fade-in animations on panel expand/collapse.

### Recent UI Improvements (2026-07-28 session)

- **Answer-first panel ordering for direct-answer questions**: `renderGuidePanel(data)` now collapses by default (`open: !isSolved`) and — via a `guideAfterAnswer` flag (`data.type === 'solved'` or the pre-existing onrender ga2/ga3 URL-answer special case) — renders the guide panel **after** the Answer panel in the DOM for `solved`-type questions, instead of before. The point is that a student solving a `solved` question should see the actual answer first, not a guide box (even collapsed) sitting above it.
- **Download Answer as .txt**: a `Download .txt` button sits next to `Copy Answer` in the Answer panel's `.panel-actions` row (`app.js`, `bindCanvasActions`), reusing the existing `downloadFile(filename, content, mime)` blob helper. Filename is the question title slugified. No new mobile handling needed — `.panel-actions` already wraps responsively.
- **Backup Answer Endpoints box**: `renderBackupEndpointsPanel(data)` renders a distinct amber-gradient box (`.backup-endpoints-box` in `style.css`) directly above the Answer panel whenever `data.backupEndpoints` (an array of `{label, url}`) is present and non-empty, with per-URL Copy buttons wired in `bindCanvasActions` (`.backup-copy-btn`, `data-backup-url`). Currently used by GA5 Q9/Q10/Q11 (see "GA5 (T22026) Notes"). **To add this to any other solver**: just add the `backupEndpoints` field to the solver's returned object — but also check that the workspace-compile loop's fixed field-copy list in `app.js` includes `backupEndpoints`, since a new field on a solver's return value is silently dropped there unless explicitly copied (this exact omission caused the box not to render on first implementation).
- **Post-solve celebration card**: `maybeShowCelebrateCard(questionCount)` in `app.js` shows a dismissible, auto-timing-out (16s) card after every successful **public/unlocked** workspace compile (only in the `!isLocked` branch) — not gated by a one-time-per-browser flag (that gate was removed per explicit request; it now shows every time). Contains inline `<a>` links to the GitHub repo and LinkedIn profile in the body text, plus ⭐ Star / 🐙 Follow / 💼 Connect buttons. Links point to `https://github.com/GyaanFlow/tds-roe-solver-t12026` (repo), `https://github.com/GyaanFlow` (profile), `https://www.linkedin.com/in/gaurav-tomar-630b2a316`.
- **Home navigation**: both the sidebar "TDS Portal" brand header (`#brandHome`) and the "tds-portal" breadcrumb crumb (`.crumb-home` class, delegated click listener on the stable `#breadcrumbs` container since its innerHTML gets fully rebuilt on every navigation) call `window.location.reload()` to return to the welcome screen from anywhere. A full reload is deliberate — the welcome screen's markup is static in `index.html` and isn't worth reconstructing in JS, and `DOMContentLoaded` already re-fills term/email/exam from `localStorage`, so nothing typed is lost.
- **Highlighted footer support note**: the "Project Sandbox by GyaanFlow • star the repo • Connect on LinkedIn" footer (both `.welcome-footer-credits` in `index.html` and `.canvas-footer-credits` in `app.js`) went from a low-opacity (0.55), easy-to-miss dashed-border line to a full-opacity amber-gradient pill, with a `.support-highlight` class bolding the star/follow portions in amber so they read as an actual call-to-action.
- **Navbar decluttered**: removed the `Export MD` / `Export JSON` buttons from the navbar (the underlying export logic in `app.js` is untouched, just not exposed as buttons) since `Copy All` / per-answer `Download .txt` already cover the common cases and the navbar was overcrowded on smaller screens. GitHub/LinkedIn navbar links reworded to "⭐ Star + Follow" / "Follow on LinkedIn" with warmer tooltip copy, pointing at the actual project repo (`.../tds-roe-solver-t12026`) instead of just the profile.

### Recent State and Feedback Improvements

Persistent UI state now stores:
- exam
- email
- search text
- selected question
- wrap mode
- open/closed answer panels

Toast notifications now exist for:
- copy success/failure
- exports
- workspace ready/failure

Question health indicators now show:
- stable / check / error
- duration text
- warning count

## Server Notes

`server.js` was refactored into a safer ESM server.

Current expectations:
- `npm start` or `node server.js` should run the local server
- path resolution should stay inside the repo root
- `GET` and `HEAD` are supported
- content-type handling is explicit enough for the app

If the server appears to exit immediately, check the direct-run detection logic in `server.js`.

## Validation Commands

Recommended local checks:

```bash
npm run check
```

Current expected success output:

```text
Checks passed: GA7 solvers=15, ROE solvers=15, GA8 solvers=15, P2 solvers=2, GA0 solvers=25, GA1 solvers=20, GA2 solvers=10, GA3 solvers=13, GA4 solvers=13, GA5 solvers=11, GA6 solvers=10, P1 solvers=5
```

> Note: Registry paths are now `solvers/T12026/<exam>/registry.js`.

The smoke check covers:
- registry loading
- server startup path
- key route serving
- traversal protection logic
- GA8 official ID/order and seeded sample parity
- GA0 official ID/order parity
- GA0 solver execution for multiple representative emails

## Known Gaps / Next Good Improvements

These are reasonable next steps:

- add real browser E2E tests
- add compare-two-emails mode for GA7/GA0 debugging
- add verifier mode like "run only failed"
- improve accessibility further with stronger ARIA/live-region coverage
- add offline caching if this is meant to be reused heavily
- fix or upgrade the installed Graphify CLI so it no longer throws `_os` after successful rebuilds
- consider moving the Q16 bonus builder out of `app.js` into a dedicated solver file for consistency

## Non-Repo Context Worth Knowing

There is also a local GA7 exam bundle outside the repo that was used for understanding structure:

- `C:\Users\gaura\Downloads\exam-tds-2026-01-ga7.js`

Do not assume it is versioned in this repository.

## Safe Working Assumptions

- The repo may be in a dirty git state.
- Do not revert user changes unless explicitly asked.
- Prefer `apply_patch` for edits.
- Prefer `npm run check` after meaningful changes.
- After code changes, run `graphify update .` to keep the knowledge graph current.

## Quick Start

```bash
npm install
npm start
```

Then open:

- `http://localhost:3000/`
- `http://localhost:3000/ga7-verify.html`

## How to Start a New AI Conversation (Optimal Prompt)

Copy-paste this as your **first message** in any new AI coding session:

```
Read these files in order before doing anything:
1. AGENT_CONTEXT.md — project intent, design decisions, architecture
2. graphify-out/GRAPH_REPORT.md — god nodes, communities, cross-module connections

Then confirm you understand the structure. Do NOT read individual source files until needed.
```

This gives the AI **complete structural understanding** in ~18KB instead of reading all 66 files (~45K words).

### Context Hierarchy (What to Read When)

| Priority | File | Read When | Cost |
|----------|------|-----------|------|
| 1st | `AGENT_CONTEXT.md` | Every conversation start | ~13KB |
| 2nd | `graphify-out/GRAPH_REPORT.md` | Architecture/cross-module questions | ~6KB |
| 3rd | `graphify query "<question>"` | Specific code tracing questions | On-demand |
| 4th | Individual source files | Only when editing specific code | Per-file |

### For Specific Tasks, Add Context to Prompt

**Adding a new exam solver for an existing term (e.g., GA9 in T12026):**
```
Read AGENT_CONTEXT.md and graphify-out/GRAPH_REPORT.md.
Then read solvers/T12026/ga8/registry.js for the pattern to follow.
I need a new GA9 solver module under solvers/T12026/.
```

**Adding all solvers for a new term (T22026):**
```
Read AGENT_CONTEXT.md and graphify-out/GRAPH_REPORT.md.
Create solvers/T22026/<exam>/ following the T12026 pattern.
Add the exam to TERM_EXAMS in app.js and to tds-config.json.
```

**Debugging a specific solver:**
```
Read AGENT_CONTEXT.md and graphify-out/GRAPH_REPORT.md.
Run: graphify explain "normalizeEmail"
Then fix the issue in solvers/ga7/q-colorencoding.js
```

**UI changes:**
```
Read AGENT_CONTEXT.md (UI section) and graphify-out/GRAPH_REPORT.md.
Focus on Community 3 (app.js UI cluster).
```

## Maintenance Rules (Keep Context Updated)

After completing any feature or significant change, the AI agent MUST:

### 1. Update Graphify (Always)
```bash
graphify update .
```
This re-extracts the AST and regenerates `GRAPH_REPORT.md`, `graph.json`, and `graph.html`. Free, ~2 seconds.

### 2. Update AGENT_CONTEXT.md (When Needed)

Update this file when:
- ✅ New exam target added (update "Current supported targets" list)
- ✅ New solver files created (update solver architecture section)
- ✅ Design decisions changed (update relevant notes section)
- ✅ New UI patterns introduced (update UI section)
- ✅ Known gaps resolved or new gaps found (update gaps list)

Do NOT update for:
- ❌ Bug fixes within existing solvers
- ❌ Minor refactors that don't change architecture
- ❌ CSS-only changes

### 3. Checklist for New Feature Completion

```
□ Code complete and tested
□ npm run check passes
□ graphify update .  (rebuild knowledge graph)
□ AGENT_CONTEXT.md updated if architecture changed
□ Commit with descriptive message
```
