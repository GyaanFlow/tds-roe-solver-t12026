# T2 2026 End-Term Mock Bank

This bank is generated from the official May 2026 course index at <https://tds.s-anand.net/> and the supplied end-term study guide. The source module contains the week-by-week coverage map and 50 high-yield skill scenarios. It deterministically expands them into 175 MCQs, 25 MSQs, and 100 subjective questions. Objective items map to guide topics 1-5; subjective items are written for topic 6, applied AI-era judgment, with model answers, evidence, uncertainty, failure checks, trade-offs, and 10-point self-rubrics.

The official format is 80 marks: 30 MCQ/MSQ questions for 39 marks, followed by 9 manually graded short answers for 41 marks. The 175/25/100 bank is an expanded practice pool, not a prediction or a single official-length paper. The portal's **Jump to portion** control separates MCQ, MSQ, and subjective practice, and every subjective screen includes the five-step answer guide.

Read [T2-2026-May-Course-Deep-Dive.md](./T2-2026-May-Course-Deep-Dive.md) for the topic-by-topic research, historical-evidence limits, cross-topic competencies, and recommended blueprint. Read [T2-2026-End-Term-Alignment-Review.md](./T2-2026-End-Term-Alignment-Review.md) for the guide-to-bank audit and explicit coverage checklist.

Generate the readable Markdown and machine-readable JSON artifacts with:

```powershell
node mock-banks/t2-2026-end-term-mock.mjs
```

Validate counts, IDs, answer indexes, guide-topic mapping, and week coverage without rewriting artifacts:

```powershell
node mock-banks/t2-2026-end-term-mock.mjs --check
```

Generated files:

- `T2-2026-End-Term-Question-Paper.md`: questions only for a timed attempt
- `T2-2026-End-Term-Detailed-Solutions.md`: answers, explanations, model answers, and rubrics
- `T2-2026-End-Term-Mock.md`: combined guided-study edition
- `T2-2026-End-Term-Mock.json`: machine-readable question bank
- `T2-2026-End-Term-Mock.browser.js`: generated browser module used by the portal quiz

The questions are original reference-only practice material, not official exam questions, answers, or predictions. No bank, rubric, or AI-assisted review can guarantee a 100% manual or LLM evaluation score. Verify explanations against the official course notes and write answers in your own words.
