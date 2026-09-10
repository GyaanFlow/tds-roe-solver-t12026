# T2 2026 End-Term Mock

This target exposes the generated May 2026 mock bank as a first-class portal exam.

- `registry.js` maps 175 MCQs, 25 MSQs, and 100 subjective questions into the standard solver registry contract.
- `mock-banks/T2-2026-End-Term-Mock.browser.js` is generated data; edit the generator, not that file.
- `app.js` recognizes the returned `quizItem` and renders the dedicated interactive quiz UI.
- Attempts, bookmarks, drafts, answer reveals, and rubric checks are stored locally per email.

Regenerate and validate:

```powershell
npm run mock:generate
npm run mock:check
npm run check
```

This is original practice material, not an official IIT Madras exam paper or prediction.
