# T3 2026 Solver Notes

T3 is selectable in the portal; official term dates remain TBD. GA1 is the September 2026 exam bundle.

## GA1: Developer Tools

- Official source snapshot: `ga1/exam-source.js` from `https://exam.sanand.workers.dev/exam-tds-2026-09-ga1.js`.
- The ordered registry exposes all 16 official question IDs and keeps their original order.
- Exact local generation is implemented where the bundle's answer is reproducible without a live user environment: Q3 grader-compatible HTTPie response, Q4 Prettier hash, Q5 valid JSON source, Q7 reorganization hash, Q8 revenue, and Q11 cosine rankings.
- Q6, Q14, and Q15 are explicit API project handoffs as requested. Do not represent them as completed solutions until the separate APIs are implemented and integrated.
- Q1 returns the fixed T2 GA1-compatible three-line answer for every user; it is a shared constant, not machine-detected output. Q9 includes a personalized, ready-to-publish page and a beginner deployment/troubleshooting guide, but each learner must publish and submit their own GitHub Pages URL. Q10 has a beginner Git-forensics walkthrough, while the token remains specific to the authenticated exam artifact. Other guide questions require authenticated data, live LLM calls, signed recording/game artifacts, or the separate API project.
- T2 GA1 parity tests protect shared Q5 JSON and Q7 file-reorganization algorithms for lowercase emails. T3's case-sensitive seeds remain authoritative; do not import T2's email normalization into T3.

## Architecture

- `ga1/registry.js`: official question order and API handoff metadata.
- `ga1/runtime.js`: shared response normalization, diagnostics, and failure containment.
- `ga1/utils.js`: exact-vs-normalized email handling, local seeded RNG access, SHA-256, safe dynamic Markdown fences, and guide result helper.
- `ga1/generators.js`: deterministic generation/reconstruction routines.
- `ga1/qNN-*.js`: question-specific solver or guide modules.
- `ga1/exam-source.js`: pinned official bundle snapshot used for audits; do not load it in the application.
- `../../vendor/seedrandom.min.js`: pinned local `seedrandom@3.0.5`; the seeded answers do not depend on a third-party RNG CDN. Q4's pinned Prettier CDN load has a 12-second timeout and degrades to actionable instructions if unavailable.

Run `node check.mjs --t3-ga1-only` for focused contract/seed checks, or `node check.mjs --t3-ga1-scale` to exercise all 16 questions across 1,000 distinct email seeds. `npm run check` includes the GA1 focused checks with the existing project suite.
