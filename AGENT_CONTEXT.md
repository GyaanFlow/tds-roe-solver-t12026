# Agent Context

This file is a quick handoff for future AI agents working in this repository.

## Project Purpose

`tds-roe-solver` is a local static web workspace for IITM TDS exam helpers.

Current supported targets:
- `roe`
- `ga7`

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
Checks passed: GA7 solvers=15, ROE solvers=15
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

## Non-Repo Context Worth Knowing

There is also a local GA7 exam bundle outside the repo that was used for understanding structure:

- `C:\Users\gaura\Downloads\exam-tds-2026-01-ga7.js`

Do not assume it is versioned in this repository.

## Safe Working Assumptions

- The repo may be in a dirty git state.
- Do not revert user changes unless explicitly asked.
- Prefer `apply_patch` for edits.
- Prefer `npm run check` after meaningful changes.

## Quick Start

```bash
npm install
npm start
```

Then open:

- `http://localhost:3000/`
- `http://localhost:3000/ga7-verify.html`

