# T2 2026 End-Term Mock Alignment Review

Reviewed against the supplied official learner email and the May 2026 course dossier in `T2-2026-May-Course-Deep-Dive.md`.

## Official Contract

- Total: 80 marks.
- Section 1: 30 MCQ/MSQ questions for 39 marks, covering guide topics 1-5.
- Section 2: 9 short-answer questions for 41 marks, covering guide topic 6 and manually graded.
- The official guide gives topics only. It does not publish question wording, scenarios, answer keys, topic weights, or a score guarantee.

The portal therefore exposes an expanded practice pool of 175 MCQs, 25 MSQs, and 100 subjective prompts. A timed simulation should select 30 objective and 9 subjective prompts.

## Guide Coverage

| Guide topic | Required reasoning signals now represented | Status |
|---|---|---|
| 1. Observability & Monitoring | averages versus percentiles, rates versus raw counts, cross-service telemetry, liveness versus readiness, AI token/request cost and budget burn | Covered explicitly |
| 2. Data Pipeline Integrity | stable identity, normalized change detection, partial/failed runs, uncertain writes, idempotent retries, reproducible data/model runs, correction provenance | Covered explicitly |
| 3. CI/CD & Release Security | untrusted code isolation, deployment credential boundaries, supply-chain verification, infrastructure blast-radius review, leaked-secret rotation, canary/progressive rollout | Covered explicitly |
| 4. Reliable AI/LLM Systems | output/schema/invariant verification, bounded repair, current-source grounding, citations and freshness, server-side authorization instead of prompt-only controls | Covered explicitly |
| 5. Web/API/Infra Fundamentals | stateless services and durable state, precise API errors, CORS/authentication/authorization separation, delegated access, safe history rewriting, container networking | Covered explicitly |
| 6. Applied AI-Era Judgment | robust prompts, decision-useful evidence, high-leverage unknowns, probability and impact, valid versus invalid claims, precise minimal fixes, acceptance tests, self-rubrics | Covered in every subjective item |

## Quality Controls

- The generated bank maps objective items to guide topics 1-5 and subjective items to guide topic 6.
- Every subjective answer includes a claim assessment, evidence requirement, rejected alternative, uncertainty, ordered fix, failure checks, trade-off, and 10-point self-rubric.
- MSQ grading requires the complete correct set; partial selection is not silently accepted.
- Generated content is validated for counts, unique IDs/prompts, option integrity, answer-position balance, rubric totals, course-week coverage, and official-guide coverage patterns.
- The UI labels the mock as reference-only and states that it is not an official paper, prediction, answer key, or score guarantee.

## Limits

This is original practice content informed by the course map and broad historical question behavior. It is not a recovered end-term paper. No mock or model answer can guarantee 100% manual or LLM evaluation accuracy; learners should verify concepts against the current official notes and write responses in their own words.
