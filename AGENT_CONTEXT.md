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

**Graph stats:** 475 nodes · 889 edges · 28 communities · 87% EXTRACTED edges
**God nodes:** `rng()` (38 edges), `normalizeEmail()` (26 edges), `renderCanvas()` (17 edges)

## Project Purpose

`tds-roe-solver` is a local static web workspace for IITM TDS exam helpers.

Current supported targets:
- `roe`
- `ga7`
- `ga8`
- `p2` — Project 2 Part B (Q3: QR Forensics + Q4: Discourse KB)

The app runs locally in the browser, loads a solver registry for the selected exam, executes each solver for a user email, and renders answers plus diagnostics.

## Important Entry Points

- `index.html`: app shell
- `app.js`: main UI state, solving flow, rendering, export, responsive/mobile behavior
- `style.css`: layout and UI styling
- `server.js`: local static server, now ESM-based and safe-path aware
- `check.mjs`: smoke test for registries and server behavior
- `ga7-verify.html`: browser verifier page for GA7
- `ga7-verify.js`: GA7 batch verification logic

## Solver Architecture

The main flow is:

1. User selects exam and enters email.
2. `app.js` dynamically imports `./solvers/<exam>/registry.js`.
3. Registry exports ordered `solvers`.
4. Each solver returns an object like:

```js
{
  answer,
  type,
  variant,
  answerDisplay,
  debug
}
```

Common result types:
- `solved`
- `bypass`
- `guide`
- `error`

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

- `solvers/ga8/registry.js` — ordered array of 15 solver entries
- `solvers/ga8/runtime.js` — shared execution wrapper (timing, validation, debug metadata)
- `solvers/ga8/utils.js` — shared helpers (email normalization, hash utilities)
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

- `solvers/p2/registry.js` — 2 solver entries (Q3 QR Forensics + Q4 Discourse KB)
- `solvers/p2/runtime.js` — execution wrapper (mirrors GA8 pattern, also calls `registerInteractive()` for DOM-interactive solvers)
- `solvers/p2/utils.js` — email normalization
- `solvers/p2/q-qr-forensics.js` — Q3 QR repair + Solana tracer (interactive guide)
- `solvers/p2/parse-tasks.js` — universal task parser with validation
- `solvers/p2/handlers.js` — 11 query type handlers, fully defensive
- `solvers/p2/q-discourse-kb.js` — Q4 main solver module with interactive guide UI
- `solvers/p2/compact_facts.json` — ~12MB precomputed snapshot (frozen 2026-04-25, 20571 topics, 14 categories)

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

Global handlers (`window._p2bSolve`, `window._p2bCopy`) are registered on the window object for onclick interactivity.

### Vercel Deployment

- `compact_facts.json` is served as a static asset under `/solvers/p2/compact_facts.json`
- The existing `vercel.json` cache rules apply (immutable cache for `.json` files — fine since data is frozen at 2026-04-25)
- No server-side logic needed — everything runs client-side
- Tested: all 11 handler types produce real answers against the 20571-topic cache

## UI Improvements Already Applied

The UI in `app.js` and `style.css` has been substantially improved.

### Stability and Usability

- Selected question is preserved more consistently.
- Sidebar scrolling and main-canvas scrolling were fixed.
- Plain text output no longer traps scroll like the old textarea-based rendering did.
- Active sidebar item auto-scrolls into view.
- Main canvas resets to top when changing questions.

### Workspace UX

- Collapsible sections for answer panels
- Copy buttons with fallback clipboard path
- HTML answer preview iframe
- Keyboard navigation with arrow keys
- Debounced sidebar filtering
- Mobile question picker
- Mobile drawer navigation
- Better responsive layout and touch scrolling

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
Checks passed: GA7 solvers=15, GA8 solvers=15, ROE solvers=15, P2 solvers=2
```

The smoke check covers:
- registry loading
- server startup path
- key route serving
- traversal protection logic

## Known Gaps / Next Good Improvements

These are reasonable next steps:

- add real browser E2E tests
- add compare-two-emails mode for GA7 debugging
- add verifier mode like "run only failed"
- improve accessibility further with stronger ARIA/live-region coverage
- add offline caching if this is meant to be reused heavily
- add GA8 verification page similar to `ga7-verify.html`
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

**Adding a new exam solver (e.g., GA9):**
```
Read AGENT_CONTEXT.md and graphify-out/GRAPH_REPORT.md.
Then read solvers/ga8/registry.js for the pattern to follow.
I need a new GA9 solver module.
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
