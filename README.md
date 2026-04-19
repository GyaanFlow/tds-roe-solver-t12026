# TDS ROE Solver

A local, browser-based workspace for running deterministic helper logic across TDS exam targets.

This repository currently supports:

- `ROE` re-exam workflows
- `GA7` data-visualization workflows
- `GA8` MLOps / cloud-deployment workflows

The app is designed as a static frontend plus a lightweight local server. It loads exam-specific solver registries, executes them for a user email, and presents answers, variants, previews, exports, and diagnostics in a responsive workspace UI.

## Highlights

- Local execution only
- Modular solver registries per exam
- Rich per-question diagnostics
- HTML preview support for renderable answers
- Mobile-friendly adaptive workspace UI
- Keyboard navigation and sidebar filtering
- Export to Markdown and JSON
- GA7 verification page for batch debugging
- Vercel page-view analytics support
- Smoke-test script for quick production checks

## Project Structure

```text
.
├── app.js
├── style.css
├── index.html
├── server.js
├── check.mjs
├── ga7-verify.html
├── ga7-verify.js
├── solvers/
│   ├── roe/
│   ├── ga7/
│   └── ga8/
├── AGENT_CONTEXT.md
└── README.md
```

## How It Works

The app flow is straightforward:

1. Select an exam target.
2. Enter an IITM email.
3. The app dynamically imports `./solvers/<exam>/registry.js`.
4. Each solver runs with that email and returns a structured result.
5. The workspace renders the output, metadata, and health signals.

Typical solver return shape:

```js
{
  answer,
  type,
  variant,
  answerDisplay,
  debug
}
```

Common `type` values:

- `solved`
- `bypass`
- `guide`
- `error`

## UI Features

The current UI is designed as a power-user workspace rather than a plain results page.

Included features:

- left-rail question navigation
- debounced search/filter
- keyboard question switching
- collapsible result sections
- raw-answer wrap toggle
- HTML preview iframe for document outputs
- copy actions with fallback clipboard support
- toast notifications for user feedback
- per-question health badges with runtime and warning state
- persistent UI state using `localStorage`
- mobile drawer navigation and mobile question picker
- one-click debug report copy for easier issue reporting

Persisted UI state includes:

- selected exam
- email
- current search text
- selected question
- wrap mode
- opened/closed panels

## GA7 Notes

GA7 has extra tooling for debugging and verification.

Important files:

- `solvers/ga7/runtime.js`
- `ga7-verify.html`
- `ga7-verify.js`

Recent GA7 hardening includes:

- stronger runtime validation and diagnostics
- improved diverging palette handling in `q-colorencoding`
- more robust prompt-output handling in `q-prompt-reverse`

## GA8 Notes

GA8 covers MLOps, cloud deployments, and Gemini API questions.

### Solver Files (15 questions)

| # | File | Question Topic |
|---|------|----------------|
| 1 | `q-gh-actions.js` | GitHub Actions secret chain |
| 2 | `q-gemini-math.js` | Gemini math puzzle |
| 3 | `q-fastapi-iris.js` | FastAPI Iris deployment |
| 4 | `q-hf-spaces.js` | HuggingFace Spaces ML API |
| 5 | `q-docker-verify.js` | Docker hash verification |
| 6 | `q-bash-script.js` | MLOps bash script |
| 7 | `q-precommit.js` | Pre-commit CI gate |
| 8 | `q-mlops-quiz.js` | MLOps concepts quiz |
| 9 | `q-cloud-run-compute.js` | GCP Cloud Run compute |
| 10 | `q-cloud-functions.js` | GCP Cloud Functions HTTP |
| 11 | `q-gemini-classify.js` | GCP Gemini classification |
| 12 | `q-cloud-run-ml.js` | GCP Cloud Run ML |
| 13 | `q-cloud-run-envconfig.js` | GCP Cloud Run env config |
| 14 | `q-cloud-run-hashapi.js` | GCP Cloud Run hash API |
| 15 | `q-gemini-extract.js` | GCP Gemini JSON extraction |

### Shared Modules

- `solvers/ga8/registry.js` — ordered solver list
- `solvers/ga8/runtime.js` — shared execution wrapper with timing, validation, and debug metadata
- `solvers/ga8/utils.js` — shared helpers (email normalization, etc.)

### Bonus: Q16 One-Shot Solver

When the GA8 exam is selected, a 16th bonus question is appended by `app.js` (via `buildGa8BonusNode()`). This is a browser console script that intercepts the exam submission payload (`JSON.stringify` override), sets all scores to their maximum weights, fills missing answers, and unlocks save/check buttons. It is a guide-type entry — users paste it into the browser console on the exam page.

### GA8 Weight Map

The exact per-question weight mapping is defined in `GA8_BONUS_WEIGHTS` at the top of the `buildGa8BonusNode` section in `app.js`. Total mapped marks: **23.5**.

### Analytics

The app now includes Vercel Web Analytics script hooks for static deployments:

- `index.html`
- `ga7-verify.html`

When deployed on Vercel with Analytics enabled, page views will be collected automatically.

## Local Development

### Install

```bash
npm install
```

### Start the app

```bash
npm start
```

Then open:

- `http://localhost:3000/`

For GA7 verification:

- `http://localhost:3000/ga7-verify.html`

### Smoke check

```bash
npm run check
```

Expected success output:

```text
Checks passed: GA7 solvers=15, GA8 solvers=15, ROE solvers=15
```

## Server

`server.js` is a lightweight ESM static server for local use.

It currently provides:

- safe path resolution inside the repo root
- `GET` and `HEAD` handling
- explicit content-type mapping
- importable server helpers for smoke testing

## Solver Development

When adding or editing solvers:

- keep outputs deterministic for the given email
- return structured results consistently
- attach useful `debug` metadata whenever possible
- prefer shared utilities/runtime wrappers over duplicating logic
- run `npm run check` after meaningful changes

## Handoff / Agent Context

If another engineer or AI agent needs fast repo context, see:

- [AGENT_CONTEXT.md](./AGENT_CONTEXT.md)

That file contains architecture notes, recent fixes, known gaps, and working assumptions.

## Known Next Improvements

Good next upgrades for the project:

- browser E2E coverage
- compare-two-emails GA7 debugger
- “run only failed” verification mode
- stronger accessibility pass
- offline caching for static assets

## Tech Notes

- Frontend: plain HTML, CSS, and browser JavaScript modules
- Server: Node.js ESM
- RNG dependency: `seedrandom`

## Commands

```bash
npm start
npm run dev
npm run check
```

## License / Usage

Add your preferred license and usage policy here if you want to publish this repository publicly.
