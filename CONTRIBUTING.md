# Contributing

Thanks for helping improve TDS Portal. Contributions should keep the project useful as a study tool, respect course policies, and avoid exposing private data.

## Before opening a pull request

1. Open an issue first for broad changes, new solver families, or behavior changes. Small fixes can go directly to a pull request.
2. Keep changes focused and explain the user-visible behavior, affected terms/questions, and any assumptions.
3. Never commit credentials, session cookies, private student data, local scrape caches, generated bundles, or `.env` files. Use fake data in tests and examples.
4. When adding or changing a solver, compare it with the relevant official prompt/validator where available. Do not claim guaranteed marks or accuracy.
5. Update generated catalog artifacts with `npm run build` when registry metadata changes.

## Local validation

Use Node.js 22 or newer; Node.js 24 LTS is recommended. From a clean checkout:

```sh
npm ci
npm run build
git diff --exit-code -- catalog.json index.html sitemap.xml robots.txt
npm run mock:check
npm test
```

The full check binds to `127.0.0.1:3000`; stop any process using that port first. Explain clearly if an external dependency prevents a check from running.

## Pull requests

- Describe the problem and the smallest safe fix.
- Include focused tests or reproducible manual steps for UI changes.
- Call out migrations, generated files, or deployment configuration changes.
- Do not include unrelated formatting, local environment files, or screenshots containing personal information.

By submitting a contribution, you agree that it may be distributed under the repository's MIT license, subject to third-party material retaining its own rights and notices.
