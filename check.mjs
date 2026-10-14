import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import seedrandom from 'seedrandom';

const rootDir = process.cwd();
const serverUrl = 'http://127.0.0.1:3000';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function makeClassList() {
  return {
    add() {},
    remove() {},
    toggle() {}
  };
}

function makeElement() {
  return {
    value: '',
    innerHTML: '',
    innerText: '',
    textContent: '',
    style: {},
    dataset: {},
    options: [],
    classList: makeClassList(),
    appendChild() {},
    setAttribute() {},
    addEventListener() {},
    removeEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    scrollTo() {},
    scrollIntoView() {},
    focus() {}
  };
}

function installBrowserStubs() {
  globalThis.performance = globalThis.performance || { now: () => 0 };

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: globalThis.localStorage || {
      getItem() { return null; },
      setItem() {},
      removeItem() {}
    }
  });

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    writable: true,
    value: globalThis.navigator || {
      clipboard: { writeText: async () => {} }
    }
  });

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    writable: true,
    value: globalThis.document || {
      body: { appendChild() {}, removeChild() {} },
      head: { appendChild() {} },
      createElement() { return makeElement(); },
      getElementById() { return makeElement(); },
      querySelector() { return null; },
      querySelectorAll() { return []; },
      addEventListener() {},
      removeEventListener() {},
      execCommand() { return true; }
    }
  });

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: globalThis.window || {
      addEventListener() {},
      setTimeout,
      clearTimeout,
      matchMedia() { return { matches: false, addEventListener() {}, removeEventListener() {} }; },
      Prism: null
    }
  });

  if (!globalThis.crypto) {
    globalThis.crypto = {};
  }

  Math.seedrandom = seedrandom;
}

function importFresh(relativePath) {
  const url = pathToFileURL(path.join(rootDir, relativePath)).href;
  return import(`${url}?check=${Date.now()}-${Math.random().toString(16).slice(2)}`);
}

/**
 * Import the CANONICAL (module-cached) instance of a module — no cache-busting query.
 * Needed when a test must mutate shared module state that already-loaded solvers observe:
 * importFresh() would hand back a separate instance whose mutations nothing else can see.
 */
function importShared(relativePath) {
  return import(pathToFileURL(path.join(rootDir, relativePath)).href);
}

async function checkServerRoutes() {
  const serverModule = await importFresh('server.js');
  const createAppServer = serverModule.default?.createAppServer || serverModule.createAppServer;
  const resolvePath = serverModule.default?.resolveRequestPath || serverModule.resolveRequestPath;
  assert(typeof createAppServer === 'function', 'Server module did not expose createAppServer().');
  assert(typeof resolvePath === 'function', 'Server module did not expose resolveRequestPath().');
  assert(resolvePath('/../package.json') === null, 'Traversal path should be blocked by resolver.');
  const server = createAppServer();

  try {
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(3000, '127.0.0.1', resolve);
    });

    const checks = [
      ['/', 200],
      ['/ga7-verify.html', 200],
      ['/verify.html', 200],
      ['/style.css', 200],
      ['/vendor/seedrandom.min.js', 200],
      ['/solvers/T12026/ga7/registry.js', 200],
      ['/solvers/T12026/ga8/registry.js', 200],
      ['/solvers/T32026/ga1/registry.js', 200],
      ['/solvers/T22026/endterm/registry.js', 200],
      ['/mock-banks/T2-2026-End-Term-Mock.browser.js', 200]
    ];

    for (const [pathname, expectedStatus] of checks) {
      const res = await fetch(`${serverUrl}${pathname}`);
      assert(res.status === expectedStatus, `Expected ${pathname} to return ${expectedStatus}, got ${res.status}.`);
      // Read the body to the end. fetch() keeps the socket reserved for an unread body, and then
      // server.close() below waits forever for that connection — which used to hang the whole
      // suite after every check had already passed, so "Checks passed" never printed.
      const body = await res.arrayBuffer();
      assert(body.byteLength > 0, `Expected ${pathname} to return a non-empty body.`);
    }

  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function checkGa8OfficialParity(solvers) {
  const officialIds = [
    'q-gh-actions-secret-chain',
    'q-gemini-math-puzzle',
    'q-fastapi-iris-deploy',
    'q-hf-spaces-ml-api',
    'q-docker-hash-verify',
    'q-mlops-bash-script',
    'q-precommit-ci-gate',
    'q-mlops-concepts-quiz',
    'q-gcp-cloud-run-compute',
    'q-gcp-cloud-functions-http',
    'q-gcp-gemini-classification',
    'q-gcp-cloud-run-ml',
    'q-gcp-cloud-run-envconfig',
    'q-gcp-cloud-run-hashapi',
    'q-gcp-gemini-json-extract'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} GA8 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'GA8 solver order/IDs no longer match the official Jan 2026 GA8 bundle.'
  );

  const sampleEmail = '21f1000000@ds.study.iitm.ac.in';
  const byId = Object.fromEntries(solvers.map((solver) => [solver.id, solver]));
  const expectedAnswers = {
    'q-gemini-math-puzzle': '2,3,e0237deb3f1e29',
    'q-mlops-bash-script': 'DIR:data|FILES:6|HASH:7e392af1',
    'q-mlops-concepts-quiz': 'b,b,a',
    'q-gcp-gemini-classification': 'POSITIVE,POSITIVE,POSITIVE,37,ed97ce048af7f6',
    'q-gcp-gemini-json-extract': 'Elena Nakamura,37,Mumbai,cloud architect,Amazon,cd1ec7d88a85fc'
  };

  for (const [id, expected] of Object.entries(expectedAnswers)) {
    const result = await byId[id].solve(sampleEmail);
    assert(result.answer === expected, `${id} sample answer drifted. Expected "${expected}", got "${result.answer}".`);
  }

  const expectedSnippets = {
    'q-gh-actions-secret-chain': ['MY_SECRET = 787586a9046b', 'verify-hash-0cc8a1af', '|8c1fdd99eb'],
    'q-fastapi-iris-deploy': ['sl=7.2&sw=3.4&pl=3.5&pw=1.1', '"prediction": 1', '"class_name": "versicolor"'],
    'q-docker-hash-verify': ['n_estimators = 60', 'random_state = 68', 'test_size = 0.2'],
    'q-gcp-cloud-run-compute': ['{"a": 13, "b": 13}', '"verify": "d1db4bc30e"'],
    'q-gcp-cloud-functions-http': ['"text": "docker-observability-monitoring-registry-deployment"', '"verify": "74e87adfaf1f"'],
    'q-gcp-cloud-run-ml': ['sl=7.2&sw=3.7&pl=3.6&pw=0.9', '"prediction": 1', '"confidence": 1.0'],
    'q-gcp-cloud-run-envconfig': ['THEME_COLOR = crimson', 'APP_MODE = production', 'BUILD_NUMBER = 464', '"config_hash": "c2c7a5cf5881"'],
    'q-gcp-cloud-run-hashapi': ['"text": "epsilon-build"', '"salt": "1700"', '"salted_sha256": "ce552aafd18b703a"']
  };

  for (const [id, snippets] of Object.entries(expectedSnippets)) {
    const result = await byId[id].solve(sampleEmail);
    const output = `${result.answer}\n${result.answerDisplay || ''}`;
    for (const snippet of snippets) {
      assert(output.includes(snippet), `${id} sample output missing official seeded snippet: ${snippet}`);
    }
  }
}

function checkGa0OfficialOrder(solvers) {
  const officialIds = [
    'q-axis-scale-manipulation-repair',
    'q-binary-eval-rubric',
    'q-bug-hunter-property-based-testing',
    'q-calculate-variance',
    'q-code-interpreter-ai-analysis',
    'q-colorencoding-server',
    'q-crawl-html',
    'q-css-selectors-sum',
    'q-dbt-operations-dashboard',
    'q-fastapi',
    'q-fastapi-sentiment-batch',
    'q-get-llm-to-say-yes',
    'q-github-action',
    'q-image-grayscale-rebuild',
    'q-llm-sentiment-analysis',
    'q-move-rename-files',
    'q-network-game-detective',
    'q-ollama',
    'q-replace-across-files',
    'q-sort-filter-json',
    'q-sql-average-salary',
    'q-unicode-data',
    'q-use-devtools',
    'q-use-github',
    'q-vercel-latency'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} GA0 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'GA0 solver order/IDs no longer match the official May 2026 GA0 bundle.'
  );
}

async function checkGa0SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+GA0@Example.COM'
  ];

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email);
      assert(result && typeof result === 'object', `GA0 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `GA0 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `GA0 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `GA0 ${solver.id} returned unexpected result type: ${result.type}.`
      );
    }
  }
}

async function checkGa1SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+GA1@Example.COM'
  ];

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email);
      assert(result && typeof result === 'object', `GA1 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `GA1 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `GA1 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `GA1 ${solver.id} returned unexpected result type: ${result.type}.`
      );
    }
  }
}

async function checkT3Ga1(solvers, metadata) {
  const officialIds = [
    'q-vs-code-version',
    'q-http-headers-server',
    'q-uv-http-post',
    'q-npx-prettier',
    'q-broken-json-server',
    'q-config-precedence-server',
    'q-rename-files-server',
    'q-csv-sales-analysis-server',
    'q-github-pages',
    'q-git-forensics-token-server',
    'q-cosine-similarity-server',
    'q-llm-yes-no-split',
    'q-termlog-rec-server',
    'q-mcp-server-live-server',
    'q-ledger-agent-server',
    'q-visual-game-tangram'
  ];
  assert(solvers.length === officialIds.length, `T3 GA1 should expose ${officialIds.length} official slots.`);
  assert(solvers.map((solver) => solver.id).join('|') === officialIds.join('|'), 'T3 GA1 order/IDs drifted from the September 2026 official bundle.');
  assert(new Set(solvers.map((solver) => solver.id)).size === officialIds.length, 'T3 GA1 solver IDs must be unique.');
  assert(metadata.questionCount === 16, 'T3 GA1 metadata questionCount should be 16.');
  assert(metadata.apiHandoffQuestions.join('|') === [
    'q-config-precedence-server',
    'q-mcp-server-live-server',
    'q-ledger-agent-server'
  ].join('|'), 'T3 GA1 API handoff metadata changed unexpectedly.');

  const config = JSON.parse(fs.readFileSync(path.join(rootDir, 'tds-config.json'), 'utf8'));
  assert(config.terms?.T32026?.exams?.includes('ga1'), 'T3 GA1 is missing from tds-config.json.');
  assert(fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8').includes("value: 'ga1', label: 'GA 1 (Developer Tools)'"), 'T3 GA1 is missing from the portal exam menu.');
  const page = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(page.includes('vendor/seedrandom.min.js?v=v54') && !page.includes('cdn.jsdelivr.net/npm/seedrandom'), 'Seeded solvers must use the pinned local seedrandom fallback.');
  const localSeedrandomSource = fs.readFileSync(path.join(rootDir, 'vendor/seedrandom.min.js'), 'utf8');
  const sandboxMath = Object.create(Math);
  vm.runInNewContext(localSeedrandomSource, { Math: sandboxMath });
  const localRng = new sandboxMath.seedrandom('T3 GA1 local dependency fixture');
  const packageRng = seedrandom('T3 GA1 local dependency fixture');
  for (let index = 0; index < 8; index += 1) {
    assert(localRng() === packageRng(), `Vendored seedrandom output diverged at sample ${index}.`);
  }

  const byId = Object.fromEntries(solvers.map((solver) => [solver.id, solver]));
  const t2Json = await importFresh('solvers/T22026/ga1/q-fix-json.js');
  const t2Files = await importFresh('solvers/T22026/ga1/q-file-reorganizer.js');
  for (const email of ['21f1000000@ds.study.iitm.ac.in', 'student.two@example.org']) {
    const t3Json = JSON.parse((await byId['q-broken-json-server'].solve(email)).answer);
    const t2JsonResult = JSON.parse((await t2Json.solve(email)).answer);
    assert(JSON.stringify(t3Json) === JSON.stringify(t2JsonResult), `T3 GA1 Q5 JSON generator diverged from the matching T2 implementation for ${email}.`);

    const t3FileHash = (await byId['q-rename-files-server'].solve(email)).answer;
    const t2FileHash = (await t2Files.solve(email)).answer;
    assert(t3FileHash === t2FileHash, `T3 GA1 Q7 file-reorganization generator diverged from the matching T2 implementation for ${email}.`);
  }
  for (const email of ['21f1000000@ds.study.iitm.ac.in', ' USER.Test+T3@Example.COM ']) {
    for (const solver of solvers) {
      const result = await solver.solve(email);
      assert(result && typeof result === 'object', `T3 GA1 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string' && result.answer.length > 0, `T3 GA1 ${solver.id} returned an empty answer.`);
      assert(['solved', 'guide', 'bypass'].includes(result.type), `T3 GA1 ${solver.id} returned invalid type ${result.type}.`);
      assert(result.debug?.solverId === solver.id, `T3 GA1 ${solver.id} is missing wrapper diagnostics.`);
    }
  }
  const invalidEmail = await solvers[0].solve('<img src=x onerror=alert(1)>@example.com');
  assert(invalidEmail.type === 'error' && invalidEmail.debug?.solverId === solvers[0].id, 'T3 GA1 should fail safely for malformed or markup-bearing email input.');
  const delimiterEmail = 'student```@example.com';
  const safeQ3 = await byId['q-uv-http-post'].solve(delimiterEmail);
  const safeQ9 = await byId['q-github-pages'].solve(delimiterEmail);
  assert(safeQ3.guide.includes('````sh') && safeQ9.guide.includes('````html'), 'T3 GA1 dynamic Markdown fences must not be breakable by unusual but accepted local-part characters.');
  const q1Fallback = await byId['q-vs-code-version'].solve('learner@example.org');
  assert(q1Fallback.type === 'solved' && q1Fallback.answer === 'Version:          Code 1.90.0\nCommit:           abc123def456\nOS Version:       Windows_NT x64 10.0.22631', 'T3 GA1 Q1 must preserve the requested T2 GA1 fixed answer exactly.');
  assert(safeQ9.guide.includes('Ready-to-publish index.html') && safeQ9.guide.includes('<!--email_off-->student```@example.com<!--/email_off-->') && safeQ9.guide.includes('Settings → Pages'), 'T3 GA1 Q9 must include a personalized page and beginner deployment steps.');
  const q10Guide = await byId['q-git-forensics-token-server'].solve('learner@example.org');
  assert(q10Guide.guide.includes('git fast-import < ../history.fi') && q10Guide.guide.includes('git log --all -p') && q10Guide.guide.toLowerCase().includes('do not upload it to github'), 'T3 GA1 Q10 guide is missing beginner Git-history steps or token-safety guidance.');

  const sampleEmail = '21f1000000@ds.study.iitm.ac.in';
  const httpie = await byId['q-uv-http-post'].solve(sampleEmail);
  const httpieResponse = JSON.parse(httpie.answer);
  assert(httpie.type === 'solved' && httpieResponse.headers.Host === 'httpbin.org' && httpieResponse.json.email === sampleEmail && httpieResponse.json.request_id === '1646f296', 'T3 GA1 Q3 grader-required response fields or personalized request ID drifted.');
  const mixedCaseRequest = await byId['q-uv-http-post'].solve(' USER.Test+T3@Example.COM ');
  const mixedCaseResponse = JSON.parse(mixedCaseRequest.answer);
  assert(mixedCaseResponse.json.email === 'USER.Test+T3@Example.COM' && mixedCaseResponse.json.request_id === '14de35a9', 'T3 GA1 Q3 must preserve case for source generators that seed from the exact registered email.');
  const generatedJson = await byId['q-broken-json-server'].solve(sampleEmail);
  const jsonRecords = JSON.parse(generatedJson.answer);
  assert(jsonRecords.length === 300, 'T3 GA1 Q5 should generate 300 valid JSON records.');
  assert(jsonRecords[0].value === 2279 && jsonRecords[0].metadata.source === 'system_c', 'T3 GA1 Q5 first seeded record drifted.');
  assert((await byId['q-rename-files-server'].solve(sampleEmail)).answer === '7dc47674858336e89f736c28c60df6bf7cb21507d4cd21093cb0c6b1e4136fb3', 'T3 GA1 Q7 seeded file hash drifted.');
  assert((await byId['q-csv-sales-analysis-server'].solve(sampleEmail)).answer === '9156', 'T3 GA1 Q8 seeded revenue drifted.');
  const cosine = await byId['q-cosine-similarity-server'].solve(sampleEmail);
  const rankings = JSON.parse(cosine.answer);
  assert(Object.keys(rankings).length === 10, 'T3 GA1 Q11 should rank all 10 query vectors.');
  assert(Object.values(rankings).every((ids) => ids.length === 5), 'T3 GA1 Q11 should return five document IDs per query.');
  assert(rankings.Q001.join(',') === 'D000131,D000056,D000016,D000091,D000181', 'T3 GA1 Q11 first seeded ranking drifted.');
  const mixedCaseRankings = JSON.parse((await byId['q-cosine-similarity-server'].solve(' USER.Test+T3@Example.COM ')).answer);
  const normalizedRankings = JSON.parse((await byId['q-cosine-similarity-server'].solve('user.test+t3@example.com')).answer);
  assert(JSON.stringify(mixedCaseRankings) === JSON.stringify(normalizedRankings), 'T3 GA1 Q11 must use its source-defined lowercase email normalization.');
  await checkT3Ga1LlmPrompts(byId, sampleEmail);
  await checkT3Ga1Tangram(byId, sampleEmail);
  await checkT3Ga1Headers(byId, sampleEmail);
  await checkT3Ga1ConsoleHelper(byId, sampleEmail);
  await checkT3Ga1GitHistory(byId);
  await checkT3Ga1ApiQuestions(byId, sampleEmail);
}

// A real `git fast-export --all` stream (git 2.52): byte-counted `data` blocks (é is 2 bytes), octal-quoted
// paths, blob marks, and a tag emitted as `reset`. Token stg_8f3Kq2ZxLm91 is added by commit 2 and rotated out by commit 4.
const REAL_GIT_FAST_EXPORT = "blob\nmark :1\ndata 64\n# service\nSee docs. Example placeholder: stg_example_do_not_use\n\nreset refs/heads/main\ncommit refs/heads/main\nmark :2\nauthor Dev <dev@example.com> 1700000100 +0000\ncommitter Dev <dev@example.com> 1700000100 +0000\ndata 15\nInitial commit\nM 100644 :1 README.md\n\nblob\nmark :3\ndata 39\nDEBUG=0\nSTAGING_TOKEN=stg_8f3Kq2ZxLm91\n\ncommit refs/heads/main\nmark :4\nauthor Dev <dev@example.com> 1700000200 +0000\ncommitter Dev <dev@example.com> 1700000200 +0000\ndata 40\nAdd staging \"config\" for café <deploy>\nfrom :2\nM 100644 :3 \"caf\\303\\251/app.env\"\n\nblob\nmark :5\ndata 17\nunrelated change\n\ncommit refs/heads/main\nmark :6\nauthor Dev <dev@example.com> 1700000300 +0000\ncommitter Dev <dev@example.com> 1700000300 +0000\ndata 13\nUpdate notes\nfrom :4\nM 100644 :5 docs/notes.txt\n\nblob\nmark :7\ndata 40\nDEBUG=0\nSTAGING_TOKEN=stg_N3wR0tat3dVal\n\ncommit refs/heads/main\nmark :8\nauthor Dev <dev@example.com> 1700000400 +0000\ncommitter Dev <dev@example.com> 1700000400 +0000\ndata 21\nRotate staging token\nfrom :6\nM 100644 :7 \"caf\\303\\251/app.env\"\n\nreset refs/tags/v1\nfrom :8\n\n";

async function checkT3Ga1GitHistory(byId) {
  const history = await importFresh('solvers/T32026/ga1/git-history.js');
  const q10 = await importFresh('solvers/T32026/ga1/q10-git-forensics.js');
  const { analyzeFastImport, parseFastImport, commitSubject, unquotePath, FastImportError } = history;
  const enc = new TextEncoder();

  // ---- stream builder for hand-written fixtures (computes UTF-8 byte counts) ----
  const block = (text) => `data ${enc.encode(text).length}\n${text}`;
  const fiCommit = ({ ref = 'refs/heads/main', mark, subject, from, merges = [], ops = [] }) => [
    `commit ${ref}`, mark ? `mark :${mark}` : null,
    'author Dev <dev@example.com> 1700000000 +0000', 'committer Dev <dev@example.com> 1700000000 +0000',
    block(subject), from ? `from :${from}` : null, ...merges.map((m) => `merge :${m}`),
    ...ops.map((op) => (typeof op === 'string' ? op : `M 100644 inline ${op.path}\n${block(op.content)}`)),
  ].filter((line) => line !== null).join('\n') + '\n';
  const build = (...parts) => parts.join('\n');
  const tok = (name) => `TOKEN=${name}\n`;

  // ---- real git output ----
  let r = analyzeFastImport(REAL_GIT_FAST_EXPORT);
  assert(r.commitCount === 4 && r.refNames.includes('refs/heads/main') && r.refNames.includes('refs/tags/v1'), 'T3 GA1 Q10 must read a real git fast-export stream (commits, branch and tag).');
  assert(r.tokens.length === 3 && r.best.token === 'stg_8f3Kq2ZxLm91' && r.best.first.subject === 'Add staging "config" for café <deploy>', 'T3 GA1 Q10 must pick the token that was added then removed, with its exact UTF-8 subject.');
  assert(r.best.rotatedOut && !r.best.stillPresent && r.best.files[0] === 'café/app.env' && r.confident, 'T3 GA1 Q10 must decode octal-quoted paths and be confident when exactly one token was rotated out.');
  assert(r.tokens.find((t) => t.token === 'stg_example_do_not_use').stillPresent && r.tokens.find((t) => t.token === 'stg_N3wR0tat3dVal').stillPresent, 'T3 GA1 Q10 must report decoy and replacement tokens as still present.');
  assert(JSON.parse(r.answer).commit_subject === 'Add staging "config" for café <deploy>', 'T3 GA1 Q10 answer must be valid JSON carrying the exact subject.');

  // ---- scenarios ----
  const c = (o) => fiCommit(o);
  r = analyzeFastImport(build(
    c({ mark: 1, subject: 'Initial', ops: [{ path: 'README.md', content: 'see stg_decoy_value_1 as an example\n' }] }),
    c({ mark: 2, subject: 'Add config', from: 1, ops: [{ path: 'a/app.env', content: tok('stg_leaked_AAA') }] }),
    c({ mark: 3, subject: 'Rotate', from: 2, ops: [{ path: 'a/app.env', content: tok('stg_fresh_BBB') }] }),
  ));
  assert(r.best.token === 'stg_leaked_AAA' && r.best.first.subject === 'Add config' && r.confident && r.warnings.length === 0, 'T3 GA1 Q10 must ignore a decoy that is still present and find the rotated-out token.');

  r = analyzeFastImport(build(
    'blob\nmark :10\n' + block('TOKEN=stg_shared_blob_1\n') + '\n',
    c({ mark: 1, subject: 'Add two copies', ops: ['M 100644 :10 one.env', 'M 100644 :10 two.env'] }),
    c({ mark: 2, subject: 'Remove one copy', from: 1, ops: ['D one.env'] }),
    c({ mark: 3, subject: 'Remove last copy', from: 2, ops: ['D two.env'] }),
  ));
  assert(r.best.token === 'stg_shared_blob_1' && r.best.first.subject === 'Add two copies' && r.best.removals.length === 1 && r.best.removals[0].subject === 'Remove last copy', 'T3 GA1 Q10 must treat a token as present while ANY file still holds it (shared blob mark).');

  r = analyzeFastImport(build(
    c({ mark: 1, subject: 'First leak', ops: [{ path: 'x.env', content: tok('stg_first_one') }] }),
    c({ mark: 2, subject: 'Second leak', from: 1, ops: [{ path: 'y.env', content: tok('stg_second_two') }] }),
    c({ mark: 3, subject: 'Rotate both', from: 2, ops: [{ path: 'x.env', content: 'gone\n' }, { path: 'y.env', content: 'gone\n' }] }),
  ));
  assert(r.tokens.filter((t) => t.rotatedOut).length === 2 && r.best.token === 'stg_first_one' && !r.confident && r.warnings.length === 1, 'T3 GA1 Q10 must flag ambiguity (not confident) when several tokens were rotated out.');

  r = analyzeFastImport(build(
    c({ mark: 1, subject: 'Add', ops: [{ path: 'k.env', content: tok('stg_comes_back') }] }),
    c({ mark: 2, subject: 'Remove', from: 1, ops: [{ path: 'k.env', content: 'x\n' }] }),
    c({ mark: 3, subject: 'Re-add by mistake', from: 2, ops: [{ path: 'k.env', content: tok('stg_comes_back') }] }),
    c({ mark: 4, subject: 'Remove again', from: 3, ops: [{ path: 'k.env', content: 'x\n' }] }),
  ));
  assert(r.best.introductions.length === 2 && r.best.first.subject === 'Add' && !r.confident && r.warnings.some((w) => w.includes('2 times')), 'T3 GA1 Q10 must use the FIRST addition and warn when a token is re-added.');

  r = analyzeFastImport(build(
    c({ mark: 1, subject: 'Add', ops: [{ path: 'old/k.env', content: tok('stg_moves_around') }] }),
    c({ mark: 2, subject: 'Rename file', from: 1, ops: ['R old/k.env new/k.env'] }),
    c({ mark: 3, subject: 'Copy file', from: 2, ops: ['C new/k.env copy/k.env'] }),
    c({ mark: 4, subject: 'Delete directory', from: 3, ops: ['D new', 'D copy'] }),
  ));
  assert(r.best.introductions.length === 1 && r.best.first.subject === 'Add' && r.best.removals[0].subject === 'Delete directory', 'T3 GA1 Q10 must follow renames/copies and directory deletes without inventing additions.');

  r = analyzeFastImport(build(
    c({ mark: 1, subject: 'Add', ops: [{ path: 'k.env', content: tok('stg_wiped_by_deleteall') }] }),
    c({ mark: 2, subject: 'Start over', from: 1, ops: ['deleteall', { path: 'fresh.txt', content: 'clean\n' }] }),
  ));
  assert(r.best.rotatedOut && r.best.removals[0].subject === 'Start over', 'T3 GA1 Q10 must honour deleteall.');

  r = analyzeFastImport(build(
    c({ mark: 1, subject: 'Base', ops: [{ path: 'a.txt', content: 'a\n' }] }),
    c({ ref: 'refs/heads/side', mark: 2, subject: 'Leak on side branch', from: 1, ops: [{ path: 's.env', content: tok('stg_side_branch_1') }] }),
    c({ mark: 3, subject: 'Main work', from: 1, ops: [{ path: 'b.txt', content: 'b\n' }] }),
    c({ mark: 4, subject: 'Merge side', from: 3, merges: [2], ops: [] }),
  ));
  assert(r.best.first.subject === 'Leak on side branch' && r.best.introductions.length === 1 && r.best.stillPresent, 'T3 GA1 Q10 must introduce a token once even when a merge brings it onto another branch.');

  assert(analyzeFastImport(build(
    'blob\nmark :1\ndata <<END\nTOKEN=stg_delimited_data\nEND\n',
    c({ mark: 2, subject: 'Delimited', ops: ['M 100644 :1 d.env'] }),
  )).best.token === 'stg_delimited_data', 'T3 GA1 Q10 must read delimited (data <<DELIM) blocks.');
  assert(analyzeFastImport(build(c({ mark: 1, subject: 'Quoted', ops: [{ path: '"caf\\303\\251/\\"q\\"\\ttab.env"', content: tok('stg_quoted_path_1') }] }))).tokens[0].files[0] === 'café/"q"\ttab.env', 'T3 GA1 Q10 must decode quoted paths with octal, quote and tab escapes.');
  assert(unquotePath('"a\\\\b\\"c\\n"') === 'a\\b"c\n' && unquotePath('plain/path') === 'plain/path', 'T3 GA1 Q10 unquotePath must handle escapes and leave plain paths alone.');
  assert(commitSubject('Line one\nline two\n\nBody text') === 'Line one line two' && commitSubject('\n\nLeading blanks\nsecond') === 'Leading blanks second' && commitSubject('') === '', 'T3 GA1 Q10 subjects must match `git log --format=%s` folding.');
  assert(analyzeFastImport(build(c({ mark: 1, subject: 'Multi\nline\n\nbody', ops: [{ path: 'k.env', content: tok('stg_multiline_subject') }] }))).best.first.subject === 'Multi line', 'T3 GA1 Q10 must fold multi-line subjects.');
  assert(analyzeFastImport(build(c({ mark: 1, subject: 'Boundary', ops: [{ path: 'k.txt', content: 'my_stg_not_a_token and xstg_also_not\n' }] }))).tokens.length === 0, 'T3 GA1 Q10 must not report the tail of a longer identifier as a token.');

  // ---- bad input ----
  const rejects = (input, pattern, label) => {
    try { analyzeFastImport(input); } catch (error) { assert(error instanceof FastImportError && pattern.test(error.message), `T3 GA1 Q10 ${label}: wrong error ${error?.name}: ${error?.message}`); return; }
    throw new Error(`T3 GA1 Q10 ${label}: expected a FastImportError.`);
  };
  rejects('<!doctype html><html><body>Unauthorized</body></html>', /HTML/, 'must recognise a saved web page');
  rejects('commit refs/heads/main\nmark :1\ncommitter A <a@b.c> 1 +0000\ndata 500\nshort', /truncated|re-encoded/, 'must reject a truncated data block');
  rejects('hello world, definitely not git', /Not a fast-import command/, 'must reject arbitrary text');
  rejects('commit refs/heads/main\nmark :1\ncommitter A <a@b.c> 1 +0000\ndata 1\nx\nfrom :99\n', /Unknown commit mark/, 'must reject a dangling parent mark');

  // Windows line endings: counts no longer match, so the analyser must normalise and say so.
  const crlf = analyzeFastImport(enc.encode(build(
    c({ mark: 1, subject: 'Add', ops: [{ path: 'k.env', content: 'TOKEN=stg_crlf_case_1' }] }),
    c({ mark: 2, subject: 'Rotate', from: 1, ops: [{ path: 'k.env', content: 'TOKEN=gone' }] }),
  ).replaceAll('\n', '\r\n')));
  assert(crlf.normalizedLineEndings && crlf.best.token === 'stg_crlf_case_1', 'T3 GA1 Q10 must recover from CRLF-converted files.');

  // ---- the user-facing layer ----
  const describe = (text) => q10.describeHistory(typeof text === 'string' ? enc.encode(text) : text);
  assert(!describe(new Uint8Array()).ok && /empty/.test(describe(new Uint8Array()).message), 'T3 GA1 Q10 must explain an empty file.');
  assert(/no commits/.test(describe('# nothing here\n').message), 'T3 GA1 Q10 must explain a stream with no commits.');
  assert(/No stg_/.test(describe(build(c({ mark: 1, subject: 'Plain', ops: [{ path: 'a.txt', content: 'hello\n' }] }))).message), 'T3 GA1 Q10 must explain when no token exists.');
  assert(!describe('<html>nope</html>').ok && /not read as a git fast-import/.test(describe('<html>nope</html>').message), 'T3 GA1 Q10 must wrap parser errors for students.');
  const outcome = describe(REAL_GIT_FAST_EXPORT);
  assert(outcome.ok && outcome.patch.type === 'solved' && outcome.patch.answer === JSON.stringify({ token: 'stg_8f3Kq2ZxLm91', commit_subject: 'Add staging "config" for café <deploy>' }), 'T3 GA1 Q10 must fill the Answer box with the exact JSON when the history is unambiguous.');
  assert(outcome.patch.guide.includes('id="t3q10Go"') && outcome.patch.guide.includes('git fast-import < ../history.fi') && outcome.patch.guide.includes('stg_8f3Kq2ZxLm91'), 'T3 GA1 Q10 result guide must keep the upload form and the manual method.');
  const ambiguous = describe(build(
    c({ mark: 1, subject: 'A', ops: [{ path: 'x.env', content: tok('stg_amb_one') }] }),
    c({ mark: 2, subject: 'B', from: 1, ops: [{ path: 'y.env', content: tok('stg_amb_two') }] }),
    c({ mark: 3, subject: 'C', from: 2, ops: [{ path: 'x.env', content: 'z\n' }, { path: 'y.env', content: 'z\n' }] }),
  ));
  assert(ambiguous.ok && ambiguous.patch.type === 'guide' && ambiguous.patch.variant.includes('candidates'), 'T3 GA1 Q10 must NOT present an ambiguous result as solved.');

  const hostile = describe(build(
    c({ mark: 1, subject: 'Init', ops: [{ path: 'r.md', content: 'x\n' }] }),
    c({ mark: 2, subject: 'Add <img src=x onerror=alert(1)> & <script>alert(2)</script>', from: 1, ops: [{ path: '<b>x</b>/k.env', content: tok('stg_hostile_subject') }] }),
    c({ mark: 3, subject: 'Rotate', from: 2, ops: [{ path: '<b>x</b>/k.env', content: 'gone\n' }] }),
  ));
  const outsideFences = (markdown) => markdown.replace(/(`{3,})[\s\S]*?\1/g, '');
  assert(hostile.ok && !/<(img|script|b)\b/i.test(outsideFences(hostile.patch.guide)) && !/<(img|script|b)\b/i.test(outsideFences(hostile.patch.answerDisplay)), 'T3 GA1 Q10 must HTML-escape commit subjects and paths everywhere outside code fences.');
  assert(JSON.parse(hostile.patch.answer).commit_subject === 'Add <img src=x onerror=alert(1)> & <script>alert(2)</script>', 'T3 GA1 Q10 must keep the exact raw subject in the answer JSON.');

  const q10Solved = await byId['q-git-forensics-token-server'].solve('learner@example.org');
  assert(q10Solved.type === 'guide' && !q10Solved.answer.includes('{') && q10Solved.guide.includes('id="t3q10File"') && typeof globalThis.window._t3ga1q10Analyze === 'function', 'T3 GA1 Q10 must start as a guide with an upload form and a registered handler.');

  // ---- robustness: corrupted streams may be rejected, but never crash with anything but FastImportError ----
  const base = enc.encode(REAL_GIT_FAST_EXPORT);
  let seed = 20260313;
  const next = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  for (let round = 0; round < 300; round += 1) {
    const mutated = Uint8Array.from(base);
    const kind = round % 4;
    let input = mutated;
    if (kind === 0) input = mutated.subarray(0, Math.floor(next() * mutated.length));
    else if (kind === 1) for (let i = 0; i < 3; i += 1) mutated[Math.floor(next() * mutated.length)] = Math.floor(next() * 256);
    else if (kind === 2) { const cut = Math.floor(next() * mutated.length); input = Uint8Array.from([...mutated.subarray(0, cut), ...mutated.subarray(cut + Math.floor(next() * 40))]); }
    else for (let i = 0; i < 2; i += 1) { const at = Math.floor(next() * mutated.length); mutated[at] = 48 + Math.floor(next() * 10); }
    try { parseFastImport(input); } catch (error) { assert(error instanceof FastImportError, `T3 GA1 Q10 fuzz round ${round} threw ${error?.name}: ${error?.message}`); }
  }
}

async function checkT3Ga1ConsoleHelper(byId, sampleEmail) {
  const source = fs.readFileSync(path.join(rootDir, 'console/t3-ga1-helper.js'), 'utf8');
  const email = '21f1000000@ds.study.iitm.ac.in';
  const quizSign = 'S3cr3t+sig=';

  // Runs the helper exactly as pasted, against a fake exam page, and records everything it does.
  const boot = ({ origin = 'https://exam.sanand.workers.dev', pathname = '/tds-2026-09-ga1', user = { email, quizSign }, fetchImpl } = {}) => {
    const logs = [], errors = [], events = [], fetched = [];
    const elements = {};
    for (const id of ['q-http-headers-server', 'q-github-pages', 'q-termlog-rec-server']) {
      elements[id] = { value: '', dispatchEvent(e) { events.push([id, e.type]); } };
    }
    const sandbox = {
      location: { origin, pathname },
      localStorage: { getItem: (key) => (key === 'user' && user ? JSON.stringify(user) : null) },
      document: { getElementById: (id) => elements[id] || null },
      console: { log: (...a) => logs.push(a.join(' ')), error: (...a) => errors.push(a.join(' ')) },
      fetch: async (url, init = {}) => { fetched.push({ url: String(url), init }); return fetchImpl(url, init); },
      URL, Event: class { constructor(type) { this.type = type; } }, setTimeout, Date, Uint8Array, JSON, RegExp, Set, Promise, Error,
    };
    sandbox.window = sandbox;
    vm.runInNewContext(source, sandbox);
    return { t3ga1: sandbox.window.t3ga1, logs, errors, events, fetched, elements };
  };
  const bootError = (options) => { try { boot(options); } catch (error) { return error.message; } return ''; };
  const page = (inner) => ({ ok: true, status: 200, text: async () => inner });
  const html = (e = email) => `<!doctype html><p><!--email_off-->${e}<!--/email_off--></p>`;

  // Guard rails: only on the logged-in GA1 exam page.
  assert(/exam\.sanand\.workers\.dev/.test(bootError({ origin: 'https://evil.example' })), 'T3 GA1 helper must refuse to run outside the exam page.');
  assert(/tds-2026-09-ga1/.test(bootError({ pathname: '/tds-2026-05-ga0' })), 'T3 GA1 helper must refuse to run on another exam.');
  assert(/not logged in/i.test(bootError({ user: null })) && /not logged in/i.test(bootError({ user: {} })), 'T3 GA1 helper must refuse to run when logged out.');
  const env = boot({ fetchImpl: async () => page(html()) });
  assert(env.t3ga1 && typeof env.t3ga1.q9.check === 'function' && typeof env.t3ga1.q13.commands === 'function' && env.logs.join('\n').includes('t3ga1.q9.commands()'), 'T3 GA1 helper must expose t3ga1 and print its menu.');
  assert(env.fetched.length === 0, 'T3 GA1 helper must not make any request until asked.');

  // Q9 page and commands.
  const q9html = env.t3ga1.q9.page();
  assert(q9html.includes(`<!--email_off-->${email}<!--/email_off-->`) && q9html.includes('<!doctype html>'), 'T3 GA1 helper Q9 page must wrap the email in the email_off markers.');
  const amp = boot({ user: { email: 'a&b@x.com', quizSign }, fetchImpl: async () => page('') });
  assert(amp.t3ga1.q9.page().includes('a&amp;b@x.com'), 'T3 GA1 helper Q9 page must HTML-escape the email.');
  const q9cmd = env.t3ga1.q9.commands('../x; rm -rf ~');
  const repoName = q9cmd.match(/^mkdir (\S+) && cd/m)?.[1] || '';
  assert(/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(repoName) && !q9cmd.includes('rm -rf'), 'T3 GA1 helper Q9 commands must sanitise the repository name.');
  assert(q9cmd.includes('gh repo create') && q9cmd.includes('repos/{owner}/{repo}/pages') && q9cmd.includes(email) && q9cmd.includes('<!--email_off-->'), 'T3 GA1 helper Q9 commands must create the repo, publish the page and enable Pages.');
  assert(!q9cmd.includes(quizSign), 'T3 GA1 helper Q9 commands must not include the signed link.');

  // Q9 check: the page must really contain the wrapped email before anything is filled.
  const pagesUrl = 'https://student.github.io/tds-ga1-portfolio/';
  let run = boot({ fetchImpl: async () => page(html()) });
  let outcome = await run.t3ga1.q9.check(pagesUrl);
  assert(outcome.ok && outcome.filled && run.elements['q-github-pages'].value === pagesUrl && run.events.some((e) => e[1] === 'input') && run.events.some((e) => e[1] === 'change'), 'T3 GA1 helper Q9 check must fill the answer box and notify the page when the email is on the live page.');
  assert(run.fetched.length === 1 && run.fetched[0].url.startsWith(pagesUrl) && run.fetched[0].init.credentials === 'omit' && !run.fetched[0].url.includes('quizSign'), 'T3 GA1 helper Q9 check must make exactly one anonymous request, to the student\'s own URL.');
  run = boot({ fetchImpl: async () => page(html()) });
  run.elements['q-github-pages'].value = pagesUrl;
  assert((await run.t3ga1.q9.check()).ok, 'T3 GA1 helper Q9 check must fall back to the URL already typed in the box.');
  const failCases = [
    ['missing email', async () => page('<p>hello</p>'), undefined],
    ['unwrapped email', async () => page(`<p>${email}</p>`), 'NOT wrapped'],
    ['someone else\'s email', async () => page(html('other@example.com')), undefined],
    ['HTTP 404', async () => ({ ok: false, status: 404, text: async () => '' }), '404'],
    ['network failure', async () => { throw new Error('Failed to fetch'); }, 'could not read'],
  ];
  for (const [label, impl, needle] of failCases) {
    run = boot({ fetchImpl: impl });
    outcome = await run.t3ga1.q9.check(pagesUrl);
    assert(!outcome.ok && run.elements['q-github-pages'].value === '' && run.events.length === 0 && (!needle || outcome.message.includes(needle)), `T3 GA1 helper Q9 check must not fill the box for: ${label}.`);
  }
  run = boot({ fetchImpl: async () => page(html()) });
  assert(!(await run.t3ga1.q9.check('http://student.github.io/x/')).ok && !(await run.t3ga1.q9.check('not a url')).ok && !(await run.t3ga1.q9.check()).ok && run.fetched.length === 0, 'T3 GA1 helper Q9 check must reject http, junk and empty input without any request.');

  // Q13 commands.
  const q13cmd = env.t3ga1.q13.commands();
  assert(q13cmd.includes(`email=${encodeURIComponent(email)}`) && q13cmd.includes('quizSign=S3cr3t%2Bsig%3D') && q13cmd.includes('questionId=q-termlog-rec-server') && q13cmd.includes('termlog rec demo.cast') && q13cmd.includes('tar -czf submission.tar.gz demo.cast demo.cast.jwt') && q13cmd.includes('termlog verify demo.cast --expect-email') && q13cmd.includes('3 hours'), 'T3 GA1 helper Q13 commands must be personalised and cover record, decode, verify and pack.');
  assert((q13cmd.match(/--- order \d/g) || []).length === 6 && new Set(q13cmd.match(/echo "--- order \d: [^"]+"/g)).size === 6 && q13cmd.includes("tr 'A-Za-z' 'N-ZA-Mn-za-m'") && q13cmd.includes('xxd -r -p') && q13cmd.includes('| rev'), 'T3 GA1 helper Q13 commands must try all six real decoding orders.');
  const quoted = boot({ user: { email: "o'brien@x.com", quizSign }, fetchImpl: async () => page('') }).t3ga1.q13.commands();
  assert(quoted.includes(`--expect-email 'o'"'"'brien@x.com'`), 'T3 GA1 helper Q13 commands must shell-quote the email.');
  assert(env.t3ga1.q13.url().startsWith('https://exam.sanand.workers.dev/questionData?') && !env.logs.some((line) => line.includes(quizSign)), 'T3 GA1 helper must keep the signed link out of the console unless asked.');

  // Q13 check.
  const archiveUrl = 'https://files.example/ga1/submission.tar.gz';
  const bytes = (...b) => ({ ok: true, status: 200, arrayBuffer: async () => Uint8Array.from(b).buffer });
  run = boot({ fetchImpl: async () => bytes(0x1f, 0x8b, 8, 0) });
  outcome = await run.t3ga1.q13.check(archiveUrl);
  assert(outcome.ok && outcome.verified === true && run.elements['q-termlog-rec-server'].value === archiveUrl && run.fetched.length === 1 && run.fetched[0].init.credentials === 'omit', 'T3 GA1 helper Q13 check must accept a gzip download and fill the box.');
  run = boot({ fetchImpl: async () => bytes(0x3c, 0x21, 0x64, 0x6f) });
  outcome = await run.t3ga1.q13.check(archiveUrl);
  assert(!outcome.ok && run.elements['q-termlog-rec-server'].value === '', 'T3 GA1 helper Q13 check must reject a web page served instead of the archive.');
  run = boot({ fetchImpl: async () => ({ ok: false, status: 403, arrayBuffer: async () => new ArrayBuffer(0) }) });
  assert(!(await run.t3ga1.q13.check(archiveUrl)).ok, 'T3 GA1 helper Q13 check must reject a link that answers an error.');
  run = boot({ fetchImpl: async () => { throw new Error('blocked by CORS'); } });
  outcome = await run.t3ga1.q13.check(archiveUrl);
  assert(outcome.ok && outcome.verified === false && run.elements['q-termlog-rec-server'].value === archiveUrl && /open the link once/i.test(outcome.message), 'T3 GA1 helper Q13 check must still fill the box, but say it could not verify, when the host blocks the browser.');
  run = boot({ fetchImpl: async () => bytes(0x1f, 0x8b) });
  assert(!(await run.t3ga1.q13.check('http://files.example/x.tar.gz')).ok && !(await run.t3ga1.q13.check('')).ok && run.fetched.length === 0, 'T3 GA1 helper Q13 check must reject http and empty input without any request.');

  // Q2: reads X-Exam-Code from the student's own signed link on the exam server.
  const withHeader = (value, status = 200) => ({ ok: status >= 200 && status < 300, status, headers: { get: (name) => (String(name).toLowerCase() === 'x-exam-code' ? value : null) } });
  run = boot({ fetchImpl: async () => withHeader('  7F3KQ9M2 ') });
  outcome = await run.t3ga1.q2.fill();
  const q2Request = new URL(run.fetched[0].url);
  assert(outcome.ok && outcome.code === '7F3KQ9M2' && outcome.filled && run.elements['q-http-headers-server'].value === '7F3KQ9M2' && run.events.some((e) => e[1] === 'input') && run.events.some((e) => e[1] === 'change'), 'T3 GA1 helper Q2 must fill the answer box with the X-Exam-Code header.');
  assert(run.fetched.length === 1 && q2Request.origin === 'https://exam.sanand.workers.dev' && q2Request.pathname === '/questionData' && q2Request.searchParams.get('email') === email && q2Request.searchParams.get('quizSign') === quizSign && q2Request.searchParams.get('questionId') === 'q-http-headers-server' && run.fetched[0].init.credentials === 'omit', 'T3 GA1 helper Q2 must request only your own Q2 link on the exam server.');
  assert(!JSON.stringify([run.logs, run.errors]).includes('S3cr3t'), 'T3 GA1 helper Q2 must not print the signature.');
  for (const [label, impl, wanted] of [
    ['no header', async () => withHeader(null), 'no X-Exam-Code'],
    ['blank header', async () => withHeader('   '), 'no X-Exam-Code'],
    ['expired signature', async () => withHeader(null, 403), 'rejected your signature'],
    ['server error', async () => withHeader(null, 500), 'HTTP 500'],
    ['network failure', async () => { throw new Error('offline'); }, 'could not reach'],
  ]) {
    run = boot({ fetchImpl: impl });
    outcome = await run.t3ga1.q2.fill();
    assert(!outcome.ok && outcome.message.includes(wanted) && run.elements['q-http-headers-server'].value === '' && run.events.length === 0, `T3 GA1 helper Q2 must not fill the box for: ${label}.`);
  }
  assert(env.logs.some((line) => line.includes('t3ga1.q2.fill()')), 'T3 GA1 helper menu must list Q2.');

  // The helper never talks to anything but the URL it was asked to check, and never fakes a response.
  assert(!/window\.fetch\s*=|Response\(|backendVerify|localStorage\.setItem/.test(source), 'T3 GA1 helper must not patch fetch, fabricate responses or write storage.');

  // Portal guides: the section, the copy control and the helper file are all in place.
  const q9Guide = (await byId['q-github-pages'].solve(sampleEmail)).guide;
  const q13Guide = (await byId['q-termlog-rec-server'].solve(sampleEmail)).guide;
  const q2Guide = (await byId['q-http-headers-server'].solve(sampleEmail)).guide;
  assert(q2Guide.includes('Console helper') && q2Guide.includes('t3ga1.q2.fill()') && q2Guide.includes('window._t3ga1CopyHelper()'), 'T3 GA1 Q2 guide must offer the console helper.');
  for (const [label, guide] of [['Q9', q9Guide], ['Q13', q13Guide]]) {
    assert(guide.includes('Console helper') && guide.includes('window._t3ga1CopyHelper()') && guide.includes('console/t3-ga1-helper.js') && guide.includes('t3ga1.'), `T3 GA1 ${label} guide must explain the console helper and offer the copy button.`);
  }
  assert((q13Guide.match(/xxd -r -p/g) || []).length >= 6 && q13Guide.includes('inside the recording'), 'T3 GA1 Q13 guide must show all six real decoding pipelines.');
  assert(fs.existsSync(path.join(rootDir, 'console/t3-ga1-helper.js')), 'T3 GA1 console helper file is missing.');
}

async function checkT3Ga1Headers(byId, sampleEmail) {
  const apiOrigin = 'https://tds-roe-solver-api-t12026.onrender.com';
  const q2 = await importFresh('solvers/T32026/ga1/q02-http-headers.js');
  const email = '21f1000000@ds.study.iitm.ac.in';
  const link = 'https://exam.sanand.workers.dev/questionData?email=21f1000000%40ds.study.iitm.ac.in&quizSign=abc%2Bdef%3D&questionId=q-http-headers-server';
  const codeOf = (raw, who = email) => q2.validateQuestionDataUrl(raw, who).code ?? 'OK';

  // Link validation happens before anything leaves the browser.
  assert(codeOf(link) === 'OK' && q2.validateQuestionDataUrl(link, email).url === link, 'T3 GA1 Q2 must accept the official Q2 link unchanged.');
  assert(q2.validateQuestionDataUrl(`curl -i "${link}"`, email).url === link && q2.validateQuestionDataUrl(`  \`${link}\`,  `, email).url === link, 'T3 GA1 Q2 must extract the link from a curl -i line, quotes and backticks.');
  assert(codeOf(link.replace('q-http-headers-server', 'q-ledger-agent-server')) === 'OK', 'T3 GA1 Q2 must accept a link from any GA1 question (same signature).');
  assert(codeOf('https://exam.sanand.workers.dev/questionData?email=a+b@x.com&quizSign=s&questionId=q-http-headers-server', 'a+b@x.com') === 'OK', 'T3 GA1 Q2 must tolerate an unescaped + in the link email.');
  assert(codeOf('') === 'EMPTY' && codeOf('nothing') === 'EMPTY' && codeOf(null) === 'EMPTY', 'T3 GA1 Q2 must report an empty paste.');
  assert(codeOf(link.replace('https://exam', 'https://evil.example/x?')) === 'WRONG_HOST' && codeOf(link.replace('https:', 'http:')) === 'WRONG_HOST', 'T3 GA1 Q2 must refuse other hosts and plain http.');
  assert(codeOf('https://exam.sanand.workers.dev.evil.example/questionData?email=a&quizSign=s&questionId=q-http-headers-server') === 'WRONG_HOST', 'T3 GA1 Q2 must refuse look-alike hosts.');
  assert(codeOf(link.replace('/questionData', '/other')) === 'WRONG_PATH', 'T3 GA1 Q2 must refuse other paths.');
  assert(codeOf(link.replace('&questionId=q-http-headers-server', '')) === 'WRONG_QUESTION' && codeOf(link.replace('q-http-headers-server', 'Not A Question')) === 'WRONG_QUESTION', 'T3 GA1 Q2 must refuse a link without a valid question id.');
  assert(codeOf(link.replace('&quizSign=abc%2Bdef%3D', '')) === 'NO_SIGNATURE', 'T3 GA1 Q2 must refuse a link without quizSign.');
  assert(codeOf(link, 'someone.else@example.com') === 'EMAIL_MISMATCH', 'T3 GA1 Q2 must refuse another account\'s link.');

  // Scripted API: record every call so ordering and secrecy can be asserted.
  const script = (handler) => {
    const calls = [];
    return { calls, fetchImpl: async (url, init = {}) => { calls.push({ url, method: init.method || 'GET', body: init.body, init }); return handler(url, init, calls); } };
  };
  const reply = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
  const instant = { sleep: async () => {}, now: () => 1700000000000 };
  const goodReply = { question_id: 'q-http-headers-server', email, answer: '7F3KQ9M2', answer_text: '7F3KQ9M2' };
  const endpoint = `${apiOrigin}/ga1/${encodeURIComponent(email)}/answers/headers`;
  const run = (handler, extra = {}) => {
    const s = script(handler);
    return { ...s, go: () => q2.fetchHeadersCode({ email, rawUrl: link, fetchImpl: s.fetchImpl, ...instant, ...extra }) };
  };

  let r = run((url) => (url.endsWith('/health') ? reply(200, { status: 'ok' }) : reply(200, goodReply)));
  let outcome = await r.go();
  assert(outcome.ok && outcome.code === '7F3KQ9M2' && outcome.fetchedAt === 1700000000000, 'T3 GA1 Q2 must return the X-Exam-Code from the API.');
  assert(r.calls.length === 2 && r.calls[0].url === `${apiOrigin}/health` && r.calls[1].url === endpoint && r.calls[1].method === 'POST', 'T3 GA1 Q2 must wake the API first, then POST once to /answers/headers.');
  assert(r.calls[1].body === JSON.stringify({ question_data_url: link }) && r.calls[1].init.credentials === 'omit' && r.calls[0].body === undefined, 'T3 GA1 Q2 must send only the private link, only to the API, and never to /health.');

  r = run(() => reply(200, goodReply));
  await q2.fetchHeadersCode({ email, rawUrl: 'not a link', fetchImpl: r.fetchImpl, ...instant });
  await q2.fetchHeadersCode({ email, rawUrl: link.replace('exam.sanand', 'evil'), fetchImpl: r.fetchImpl, ...instant });
  assert(r.calls.length === 0, 'T3 GA1 Q2 must not touch the network for an invalid link.');
  let clock = 0;
  r = run((url) => (url.endsWith('/health') ? reply(503, {}) : reply(200, goodReply)));
  outcome = await q2.fetchHeadersCode({ email, rawUrl: link, fetchImpl: r.fetchImpl, sleep: async () => {}, now: () => (clock += 40000) });
  assert(!outcome.ok && outcome.code === 'API_UNREACHABLE' && r.calls.every((c) => c.url.endsWith('/health')), 'T3 GA1 Q2 must never send the link to an API that did not wake.');
  r = run((url) => (url.endsWith('/health') ? reply(502, {}) : reply(200, goodReply)));
  let polls = 0;
  r = run((url) => (url.endsWith('/health') ? reply(++polls < 3 ? 502 : 200, {}) : reply(200, goodReply)));
  outcome = await r.go();
  assert(outcome.ok && polls === 3 && r.calls.at(-1).url === endpoint, 'T3 GA1 Q2 must keep polling /health until the API wakes.');

  const failWith = async (handler, wanted, label) => {
    const result = await run((url, init) => (url.endsWith('/health') ? reply(200, {}) : handler(url, init))).go();
    assert(!result.ok && result.code === wanted && typeof result.message === 'string' && result.message.length > 20, `T3 GA1 Q2 ${label}: expected ${wanted}, got ${result.code}.`);
    assert(!result.message.includes('quizSign') && !result.message.includes('abc'), `T3 GA1 Q2 ${label} must not echo the signed link.`);
  };
  await failWith(() => reply(400, { error: 'VALID_QUESTION_DATA_URL_REQUIRED' }), 'VALID_QUESTION_DATA_URL_REQUIRED', 'rejected link');
  await failWith(() => reply(409, { error: 'POST_YOUR_QUESTION_DATA_URL_OR_ONBOARD_FIRST' }), 'POST_YOUR_QUESTION_DATA_URL_OR_ONBOARD_FIRST', 'missing link');
  await failWith(() => reply(502, { error: 'UPSTREAM_REJECTED', upstream_status: 403 }), 'UPSTREAM_REJECTED', 'expired signature');
  await failWith(() => reply(502, { error: 'UPSTREAM_REJECTED', upstream_status: 500 }), 'UPSTREAM_REJECTED', 'exam server error');
  await failWith(() => reply(422, { error: 'NO_X_EXAM_CODE_HEADER' }), 'NO_X_EXAM_CODE_HEADER', 'no header');
  await failWith(() => reply(504, { error: 'UPSTREAM_TIMEOUT' }), 'UPSTREAM_TIMEOUT', 'exam timeout');
  await failWith(() => reply(429, {}), 'RATE_LIMITED', 'rate limit');
  await failWith(() => reply(500, { error: 'BOOM' }), 'BOOM', 'unknown error');
  await failWith(() => ({ ok: false, status: 502, json: async () => { throw new Error('html'); } }), 'HTTP_502', 'non-JSON error');
  await failWith(() => reply(200, { ...goodReply, answer_text: '' }), 'BAD_RESPONSE', 'empty code');
  await failWith(() => reply(200, { ...goodReply, answer_text: 'two words' }), 'BAD_RESPONSE', 'code with spaces');
  await failWith(() => reply(200, { ...goodReply, email: 'other@example.com' }), 'BAD_RESPONSE', 'reply for another email');
  await failWith(() => { throw new Error('offline'); }, 'NETWORK', 'network failure');
  await failWith(() => { const e = new Error('aborted'); e.name = 'AbortError'; throw e; }, 'TIMEOUT', 'timeout');
  outcome = await q2.fetchHeadersCode({ email, rawUrl: link, fetchImpl: null });
  assert(!outcome.ok && outcome.code === 'NO_FETCH', 'T3 GA1 Q2 must report a browser without fetch.');

  // Stored-signature mode: no link in the request; the API uses the signature it saved at onboarding.
  r = run((url) => (url.endsWith('/health') ? reply(200, {}) : reply(200, goodReply)), {});
  outcome = await q2.fetchHeadersCode({ email, useStored: true, fetchImpl: r.fetchImpl, ...instant });
  assert(outcome.ok && outcome.code === '7F3KQ9M2' && r.calls[1].url === endpoint && r.calls[1].body === '{}', 'T3 GA1 Q2 stored-signature mode must POST an empty body and return the code.');
  r = run((url) => (url.endsWith('/health') ? reply(200, {}) : reply(409, { error: 'POST_YOUR_QUESTION_DATA_URL_OR_ONBOARD_FIRST' })));
  outcome = await q2.fetchHeadersCode({ email, useStored: true, fetchImpl: r.fetchImpl, ...instant });
  assert(!outcome.ok && outcome.code === 'POST_YOUR_QUESTION_DATA_URL_OR_ONBOARD_FIRST', 'T3 GA1 Q2 stored-signature mode must report when the API has no stored signature.');
  assert(!(await q2.fetchHeadersCode({ email: 'not-an-email', useStored: true, fetchImpl: r.fetchImpl, ...instant })).ok, 'T3 GA1 Q2 stored-signature mode must still reject a bad email.');

  // Automatic fill: wait for the API, fetch, then keep patching until the workspace has registered the question.
  q2.AUTO_TIMING.patchPollMs = 1;
  const autoServer = (handler) => script((url, init) => (url.endsWith('/health') ? reply(200, {}) : handler(url, init)));
  let patches = [];
  let ready = 0;
  r = autoServer(() => reply(200, goodReply));
  const filled = await q2.autoFetchStored(email, { fetchImpl: r.fetchImpl, ...instant, patch: (value) => { patches.push(value); return ++ready >= 3; } });
  assert(filled === true && patches.length === 3 && patches.at(-1).type === 'solved' && patches.at(-1).answer === '7F3KQ9M2' && patches.at(-1).usesHostedApi === true, 'T3 GA1 Q2 automatic fill must keep trying to patch until the workspace is ready, then fill the code.');
  patches = [];
  r = autoServer(() => reply(409, { error: 'POST_YOUR_QUESTION_DATA_URL_OR_ONBOARD_FIRST' }));
  assert((await q2.autoFetchStored(email, { fetchImpl: r.fetchImpl, ...instant, patch: (value) => { patches.push(value); return true; } })) === false && patches.length === 0, 'T3 GA1 Q2 automatic fill must stay silent when the API has no stored signature.');
  const savedTries = q2.AUTO_TIMING.patchTries;
  q2.AUTO_TIMING.patchTries = 4;
  r = autoServer(() => reply(200, goodReply));
  assert((await q2.autoFetchStored(email, { fetchImpl: r.fetchImpl, ...instant, patch: () => false })) === false, 'T3 GA1 Q2 automatic fill must give up if the workspace never registers the question.');
  q2.AUTO_TIMING.patchTries = savedTries;

  // solve(): Node never calls the API; a real browser starts the automatic fill, once per email, and Q15 can re-trigger it.
  const savedFetch = globalThis.fetch, savedWindow = globalThis.window;
  const savedNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const solveCalls = [];
  try {
    globalThis.fetch = async (url, init = {}) => { solveCalls.push({ url: String(url), body: init.body }); return String(url).endsWith('/health') ? reply(200, {}) : reply(200, { ...goodReply, email: 'auto.user@ds.study.iitm.ac.in' }); };
    await q2.solve('auto.user@ds.study.iitm.ac.in');
    await new Promise((resolve) => setTimeout(resolve, 20));
    assert(solveCalls.length === 0, 'T3 GA1 Q2 must not call the API from Node.');

    const patched = [];
    globalThis.window = { tdsPatchAnswer: (pid, value) => { patched.push([pid, value]); return true; } };
    Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'Mozilla/5.0 (check)' }, configurable: true });
    const first = await q2.solve('auto.user@ds.study.iitm.ac.in');
    assert(first.type === 'guide', 'T3 GA1 Q2 must still return the guide immediately in the browser.');
    for (let i = 0; i < 50 && patched.length === 0; i += 1) await new Promise((resolve) => setTimeout(resolve, 10));
    assert(patched.length === 1 && patched[0][0] === 'q-http-headers-server' && patched[0][1].answer === '7F3KQ9M2' && solveCalls.some((c) => c.body === '{}'), 'T3 GA1 Q2 must fill the Answer box by itself in the browser when the API holds a signature.');
    const before = solveCalls.length;
    await q2.solve('auto.user@ds.study.iitm.ac.in');
    await new Promise((resolve) => setTimeout(resolve, 30));
    assert(solveCalls.length === before, 'T3 GA1 Q2 must not repeat the automatic fetch for the same email in one page load.');
    assert(typeof globalThis.window._t3ga1q2AutoFetch === 'function', 'T3 GA1 Q2 must expose the hook Q15 uses.');
    await globalThis.window._t3ga1q2AutoFetch('auto.user@ds.study.iitm.ac.in');
    assert(solveCalls.length > before && patched.length === 2, 'T3 GA1 Q2 hook must re-run the automatic fetch on demand.');
  } finally {
    globalThis.fetch = savedFetch;
    if (savedWindow === undefined) delete globalThis.window; else globalThis.window = savedWindow;
    if (savedNavigator) Object.defineProperty(globalThis, 'navigator', savedNavigator); else delete globalThis.navigator;
  }
  assert(fs.readFileSync(path.join(rootDir, 'solvers/T32026/ga1/q15-ledger-agent.js'), 'utf8').includes('_t3ga1q2AutoFetch'), 'T3 GA1 Q15 must trigger the Q2 automatic fetch after onboarding.');

  // The solver itself: a guide with the form until the student supplies the private link.
  const guideResult = await byId['q-http-headers-server'].solve(sampleEmail);
  assert(guideResult.type === 'guide' && guideResult.answer.startsWith('NOT FETCHED YET') && guideResult.guide.includes('id="t3q2Root"') && guideResult.guide.includes('window._t3ga1q2Generate()') && guideResult.guide.includes('curl -i') && guideResult.guide.includes('rotates every hour') && guideResult.usesHostedApi === true, 'T3 GA1 Q2 must explain the private-link step, keep the manual curl steps and mention hourly rotation.');
  const hostile = await q2.solve('"><img/src=x/onerror=alert(1)>@x.com');
  assert(!/<img.src=x/i.test(hostile.guide), 'T3 GA1 Q2 must escape the email in the form.');
}

async function checkT3Ga1Tangram(byId, sampleEmail) {
  const q16 = await importFresh('solvers/T32026/ga1/q16-tangram.js');
  const geometry = await importFresh('solvers/T32026/ga1/tangram-geometry.js');
  const { targets } = await importFresh('solvers/T32026/ga1/tangram-targets.js');
  const { solutions } = await importFresh('solvers/T32026/ga1/tangram-solutions.js');

  // The exam bundle's own target list is the source of truth for ids, outlines and expected match keys.
  const official = fs.readFileSync(path.join(rootDir, 'solvers/T32026/ga1/exam-source.js'), 'utf8');
  assert(targets.length === 100 && new Set(targets.map((t) => t.id)).size === 100, 'T3 GA1 Q16 must list the exam\'s 100 distinct silhouettes.');
  for (const t of targets.slice(0, 100)) {
    assert(official.includes(t.matchKey) && official.includes(t.svgPath), `T3 GA1 Q16 target ${t.id} no longer matches the official exam source.`);
  }

  // Every stored arrangement must pass the game's own validator and hash to the exam's expected key.
  let verified = 0;
  const missing = [];
  for (const t of targets) {
    const pieces = q16.posesFor(t.id);
    if (!pieces) { missing.push(t.id); continue; }
    const result = await q16.verifyArrangement(t, pieces);
    assert(result.ok, `T3 GA1 Q16 stored arrangement for ${t.id} fails verification: ${result.reason}`);
    verified += 1;
  }
  assert(Object.keys(solutions).every((tid) => targets.some((t) => t.id === tid)), 'T3 GA1 Q16 has an arrangement for an unknown target.');
  assert(verified === 100 && missing.length === 0, `T3 GA1 Q16 must have a verified arrangement for all 100 silhouettes (has ${verified}; missing: ${missing.join(', ')}).`);

  // A deliberately wrong arrangement must be rejected (mutation check of the verifier).
  const sample = q16.posesFor(targets[1].id);
  const moved = sample.map((p, i) => (i === 3 ? { ...p, x: p.x + 3 } : p));
  assert(!(await q16.verifyArrangement(targets[1], moved)).ok, 'T3 GA1 Q16 verifier must reject a shifted piece.');
  assert(!(await q16.verifyArrangement(targets[2], sample)).ok, 'T3 GA1 Q16 verifier must reject another target\'s arrangement.');

  // Board link round-trips through the game's own decoder.
  const link = q16.boardLink(sample);
  const fragment = new URLSearchParams(link.split('#')[1]);
  assert(link.startsWith(`${q16.GAME_URL}#v=1&s=`) && fragment.get('v') === '1', 'T3 GA1 Q16 board link must use the game\'s state-link format.');
  const padded = fragment.get('s').replace(/-/g, '+').replace(/_/g, '/');
  const decoded = geometry.tangramAdapter.decodeCandidate(Uint8Array.from(Buffer.from(padded, 'base64')), geometry.TANGRAM_CONFIG);
  assert(JSON.stringify(decoded.pieces.map((p) => [p.x, p.y, p.orientation, p.reflected])) === JSON.stringify(sample.map((p) => [p.x, p.y, p.orientation, p.reflected])), 'T3 GA1 Q16 board link must decode back to the same arrangement.');

  // Target assignment matches the exam's seeded pick and spreads over the pool.
  const seen = new Set();
  for (let i = 0; i < 1000; i += 1) {
    const email = `student${i}@ds.study.iitm.ac.in`;
    const { index, target } = q16.targetForEmail(email);
    const expectedIndex = Math.floor(seedrandom(`${email}#q-visual-game-tangram`)() * targets.length);
    assert(index === expectedIndex && target.id === targets[index].id, `T3 GA1 Q16 target pick differs from the exam for ${email}.`);
    seen.add(target.id);
  }
  assert(seen.size >= 60, 'T3 GA1 Q16 target assignment must spread across the silhouette pool.');

  // Guide (Node: no automatic signing) — arrangement, board link, widget, escaping.
  const guideResult = await byId['q-visual-game-tangram'].solve(sampleEmail);
  const { target: myTarget } = q16.targetForEmail(sampleEmail);
  assert(guideResult.type === 'guide' && guideResult.guide.includes(myTarget.id) && guideResult.guide.includes('id="t3q16Root"') && guideResult.guide.includes('<svg') && guideResult.guide.includes(q16.GAME_URL), 'T3 GA1 Q16 guide must show the target, the diagram, the signing widget and the board link.');
  assert(guideResult.debug.verified === true && guideResult.debug.matchKey === myTarget.matchKey, 'T3 GA1 Q16 must verify the stored arrangement before showing it.');
  const hostile = await q16.solve('"><img src=x onerror=alert(1)>@x.com');
  assert(!/<img src=x/i.test(hostile.guide), 'T3 GA1 Q16 must escape the email in the guide.');

  // Token requests against a scripted game server.
  const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
  const jwt = (payload) => `${b64({ alg: 'ES256', typ: 'JWT' })}.${b64(payload)}.c2ln`;
  const pieces = q16.posesFor(myTarget.id);
  const calls = [];
  const server = (override) => async (url, init) => {
    const body = JSON.parse(init.body);
    calls.push({ url, init, body });
    const forced = override?.(body);
    if (forced) return forced;
    return { status: 200, ok: true, json: async () => ({ invalid: false, errors: [], match_key: myTarget.matchKey, receipt: jwt({ sub: sampleEmail, game: 'tangram' }) }) };
  };
  const good = await q16.requestToken({ email: sampleEmail, target: myTarget, pieces, fetchImpl: server() });
  assert(good.token.split('.').length === 3 && good.payload.sub === sampleEmail, 'T3 GA1 Q16 must return the signed token.');
  const sent = calls[0];
  assert(sent.url === q16.ATTEST_URL && sent.init.credentials === 'omit' && sent.body.email === sampleEmail && sent.body.game === 'tangram' && sent.body.config_id === 'standard-seven-v1' && sent.body.state === q16.stateBase64Url(pieces) && sent.body.client_report.events.length === 0, 'T3 GA1 Q16 must send only the documented attestation fields.');
  const expectFail = async (override, code) => {
    try {
      await q16.requestToken({ email: sampleEmail, target: myTarget, pieces, fetchImpl: override });
    } catch (error) {
      assert(error.code === code, `T3 GA1 Q16 expected ${code}, got ${error.code} (${error.message})`);
      return;
    }
    throw new Error(`T3 GA1 Q16 expected a ${code} failure.`);
  };
  await expectFail(server(() => ({ status: 200, ok: true, json: async () => ({ invalid: true, errors: [{ code: 'overlap' }], receipt: 'x' }) })), 'REJECTED');
  await expectFail(server(() => ({ status: 200, ok: true, json: async () => ({ invalid: false, errors: [], match_key: 'f'.repeat(64), receipt: jwt({ sub: sampleEmail }) }) })), 'MISMATCH');
  await expectFail(server(() => ({ status: 200, ok: true, json: async () => ({ invalid: false, errors: [], match_key: myTarget.matchKey, receipt: jwt({ sub: 'someone@else.com' }) }) })), 'WRONG_EMAIL');
  await expectFail(server(() => ({ status: 200, ok: true, json: async () => ({ invalid: false, errors: [], match_key: myTarget.matchKey, receipt: 'not-a-jwt' }) })), 'BAD_TOKEN');
  await expectFail(server(() => ({ status: 429, ok: false, json: async () => ({}) })), 'RATE_LIMITED');
  await expectFail(server(() => ({ status: 500, ok: false, json: async () => ({ message: 'boom' }) })), 'HTTP_500');
  await expectFail(server(() => ({ status: 502, ok: false, json: async () => { throw new Error('html'); } })), 'HTTP_502');
  await expectFail(async () => { throw new Error('offline'); }, 'NETWORK');
  await expectFail(async () => { const e = new Error('aborted'); e.name = 'AbortError'; throw e; }, 'NETWORK');
  try {
    await q16.requestToken({ email: sampleEmail, target: myTarget, pieces: sample, fetchImpl: server() });
    throw new Error('wrong arrangement must not be signed');
  } catch (error) {
    assert(error.code === 'BAD_ARRANGEMENT', 'T3 GA1 Q16 must refuse to sign an arrangement that fails local verification.');
  }

  // Browser path: solve() signs automatically, caches the token, and falls back to the guide on failure.
  const savedWindow = globalThis.window, savedFetch = globalThis.fetch;
  const savedNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  try {
    globalThis.window = {};
    Object.defineProperty(globalThis, 'navigator', { value: { userAgent: 'Mozilla/5.0 (check)' }, configurable: true });
    calls.length = 0;
    globalThis.fetch = server();
    const auto = await q16.solve(sampleEmail);
    assert(auto.type === 'solved' && auto.answer.split('.').length === 3 && auto.debug.autoSigned === true && auto.usesHostedApi === true, 'T3 GA1 Q16 must fill the signed token automatically in the browser.');
    await q16.solve(sampleEmail);
    assert(calls.length === 1, 'T3 GA1 Q16 must not re-request a token it already has.');
    globalThis.fetch = async () => { throw new Error('offline'); };
    const offlineResult = await q16.solve('someone.else@ds.study.iitm.ac.in');
    assert(offlineResult.type === 'guide' && offlineResult.guide.includes('Automatic signing did not complete'), 'T3 GA1 Q16 must fall back to the guide when signing fails.');
  } finally {
    if (savedWindow === undefined) delete globalThis.window; else globalThis.window = savedWindow;
    globalThis.fetch = savedFetch;
    if (savedNavigator) Object.defineProperty(globalThis, 'navigator', savedNavigator); else delete globalThis.navigator;
  }
}

async function checkT3Ga1LlmPrompts(byId, sampleEmail) {
  const q12 = await importFresh('solvers/T32026/ga1/q12-llm-yes-no.js');
  const official = fs.readFileSync(path.join(rootDir, 'solvers/T32026/ga1/exam-source.js'), 'utf8');
  assert(official.includes(`(j = ${q12.PROMPT_LIMIT})`) && official.includes(`(Y = "${q12.MODEL_YES}")`) && official.includes(`(G = "${q12.MODEL_NO}")`) && official.includes('(K = (e, o) => new RegExp('), 'T3 GA1 Q12 model names, prompt limit or word test no longer match the official exam source.');

  // The ten prompts: distinct, within the limit, and never contradicting the exam's own rules.
  assert(q12.CANDIDATES.length >= 5, 'T3 GA1 Q12 must offer several live-tested prompts.');
  assert(new Set(q12.CANDIDATES.map((c) => c.prompt)).size === q12.CANDIDATES.length && new Set(q12.CANDIDATES.map((c) => c.category)).size === q12.CANDIDATES.length, 'T3 GA1 Q12 prompts and categories must all be distinct.');
  for (const candidate of q12.CANDIDATES) {
    assert(candidate.prompt.length <= q12.PROMPT_LIMIT && candidate.prompt === candidate.prompt.trim() && candidate.why, `T3 GA1 Q12 prompt is over the limit or incomplete: ${candidate.prompt}`);
  }

  // Judging mirrors the exam: case-sensitive whole words, and the other word must be absent.
  const judged = (yes, no) => q12.judgeReplies(yes, no);
  assert(judged('Yes', 'No').pass && judged('Yes.', 'No.').pass && judged('**Yes**', 'No\n').pass, 'T3 GA1 Q12 must accept plain Yes/No replies.');
  assert(!judged('yes', 'No').yesOk && !judged('YES', 'No').yesOk && !judged('Yes', 'no').noOk, 'T3 GA1 Q12 judging must be case-sensitive.');
  assert(!judged('Yes, not No', 'No').yesOk && !judged('Yes', 'No, not Yes').noOk, 'T3 GA1 Q12 judging must reject replies containing both words.');
  assert(!judged('Yesterday', 'Nothing').pass && !judged('Notable', 'Yes').pass, 'T3 GA1 Q12 judging must use word boundaries.');
  assert(!q12.validatePrompt('').ok && !q12.validatePrompt('x'.repeat(101)).ok && q12.validatePrompt(`  ${'x'.repeat(100)}  `).ok, 'T3 GA1 Q12 prompt validation must enforce the 100-character limit after trimming.');

  // Guide: starting prompt, all ten ideas, tester widget, honest about being unverified, no token field leaks.
  const solved = await byId['q-llm-yes-no-split'].solve(sampleEmail);
  assert(solved.type === 'solved' && solved.answer === q12.CANDIDATES[0].prompt, 'T3 GA1 Q12 must answer with the first live-tested candidate.');
  assert(q12.CANDIDATES.every((c) => {
    const [passed, runs] = c.tested.split('/').map(Number);
    return passed === runs && runs >= 8;
  }), 'T3 GA1 Q12 prompts must only be listed with a perfect live-test record of at least 8 runs.');
  assert(q12.CANDIDATES.every((c) => solved.guide.includes(c.prompt)) && solved.guide.includes('Live-tested') && solved.guide.includes('press **Check**') && solved.guide.includes('id="t3q12Root"') && solved.guide.includes('type="password"'), 'T3 GA1 Q12 guide must list every prompt, include the tester and tell the student to re-check before submitting.');

  // Live tester against a scripted AI Pipe: ranking, header use, error handling.
  const calls = [];
  const flakyPrompt = 'Custom flaky prompt';
  const winner = q12.CANDIDATES[3].prompt;
  const makeFetch = (override) => async (url, init) => {
    const body = JSON.parse(init.body);
    const prompt = body.messages[0].content;
    calls.push({ url, auth: init.headers.Authorization, model: body.model, prompt, body: init.body });
    if (override) {
      const forced = override(body, prompt);
      if (forced) return forced;
    }
    const isYesModel = body.model === q12.MODEL_YES;
    let text = isYesModel ? 'Yes' : 'No';
    if (prompt === flakyPrompt) text = isYesModel ? 'Yes' : (calls.filter((c) => c.prompt === flakyPrompt).length > 2 ? 'Yes' : 'No');
    else if (prompt !== winner) text = 'Yes';
    return { status: 200, json: async () => ({ choices: [{ message: { content: text } }] }) };
  };
  const secret = 'tok_secret_value_123';
  const outcome = await q12.testCandidates({ token: ` ${secret} `, prompts: [flakyPrompt, ...q12.CANDIDATES.map((c) => c.prompt)], trials: 2, fetchImpl: makeFetch() });
  assert(outcome.best.prompt === winner && outcome.best.robust && outcome.best.passes === 2, 'T3 GA1 Q12 tester must rank the prompt that passes every run first.');
  assert(outcome.ranked.length === q12.CANDIDATES.length + 1 && outcome.ranked.every((entry) => entry.trials.length === 2), 'T3 GA1 Q12 tester must run every prompt the requested number of times.');
  assert(calls.length === (q12.CANDIDATES.length + 1) * 2 * 2 && calls.every((c) => c.url === q12.AI_PIPE_URL && c.auth === `Bearer ${secret}` && !c.body.includes(secret)), 'T3 GA1 Q12 tester must send the trimmed token only in the Authorization header to AI Pipe.');
  assert(calls.filter((c) => c.model === q12.MODEL_YES).length === calls.filter((c) => c.model === q12.MODEL_NO).length, 'T3 GA1 Q12 tester must call both models equally.');
  const html = q12.resultsHtml(outcome);
  assert(html.includes(winner) && html.includes('✅') && !html.includes(secret), 'T3 GA1 Q12 results table must show the winner and never the token.');

  // Hostile model output must be rendered as text.
  const hostile = await q12.testCandidates({ token: secret, prompts: [winner], trials: 1, fetchImpl: makeFetch((body) => ({ status: 200, json: async () => ({ choices: [{ message: { content: '<img src=x onerror=alert(1)> Yes' } }] }) })) });
  const hostileHtml = q12.resultsHtml(hostile);
  assert(!/<img/i.test(hostileHtml) && hostileHtml.includes('&lt;img'), 'T3 GA1 Q12 results must escape model replies.');

  // Failure handling.
  const expectCode = async (promise, code, label) => {
    try {
      await promise;
    } catch (error) {
      assert(error.code === code, `${label}: expected ${code}, got ${error.code}`);
      return;
    }
    throw new Error(`${label}: expected a ${code} error.`);
  };
  calls.length = 0;
  await expectCode(q12.testCandidates({ token: '', prompts: ['x'], fetchImpl: makeFetch() }), 'NO_TOKEN', 'empty token');
  assert(calls.length === 0, 'T3 GA1 Q12 must not call the network without a token.');
  await expectCode(q12.testCandidates({ token: 'bad', prompts: q12.CANDIDATES.map((c) => c.prompt), trials: 3, fetchImpl: makeFetch(() => ({ status: 401, json: async () => ({}) })) }), 'AUTH', 'rejected token');
  assert(calls.length <= 8, `T3 GA1 Q12 must stop after an auth failure instead of spamming AI Pipe (${calls.length} calls).`);
  await expectCode(q12.testCandidates({ token: 'x', prompts: ['p'], fetchImpl: makeFetch(() => ({ status: 429, json: async () => ({}) })) }), 'LIMIT', 'rate limit');
  const broken = await q12.testCandidates({ token: 'x', prompts: ['p'], trials: 1, fetchImpl: makeFetch(() => ({ status: 200, json: async () => ({ error: { message: 'model overloaded' } }) })) });
  assert(broken.best === null && broken.ranked[0].errors === 1 && broken.ranked[0].trials[0].error.includes('model overloaded'), 'T3 GA1 Q12 must report a model error without crashing.');
  const offline = await q12.testCandidates({ token: 'x', prompts: ['p'], trials: 1, fetchImpl: async () => { throw new Error('offline'); } });
  assert(offline.ranked[0].trials[0].error.includes('offline'), 'T3 GA1 Q12 must report network failures per run.');
  const noJson = await q12.testCandidates({ token: 'x', prompts: ['p'], trials: 1, fetchImpl: async () => ({ status: 502, json: async () => { throw new Error('bad json'); } }) });
  assert(noJson.ranked[0].errors === 1, 'T3 GA1 Q12 must survive a non-JSON AI Pipe response.');
}

async function checkT3Ga1ApiQuestions(byId, sampleEmail) {
  const apiOrigin = 'https://tds-roe-solver-api-t12026.onrender.com';
  const mixedEmail = ' USER.Test+T3@Example.COM ';

  // Q6 and Q14: live API URLs built from the trimmed, lower-cased, URL-encoded email.
  for (const [apiId, suffix] of [['q-config-precedence-server', '/effective-config'], ['q-mcp-server-live-server', '/mcp']]) {
    const plain = await byId[apiId].solve(sampleEmail);
    assert(plain.type === 'solved' && plain.answer === `${apiOrigin}/ga1/21f1000000%40ds.study.iitm.ac.in${suffix}`, `T3 GA1 ${apiId} must answer with its live API URL.`);
    const mixed = await byId[apiId].solve(mixedEmail);
    assert(mixed.answer === `${apiOrigin}/ga1/user.test%2Bt3%40example.com${suffix}`, `T3 GA1 ${apiId} must trim, lower-case and URL-encode the email (+ and @).`);
    assert(!mixed.answer.includes('?'), `T3 GA1 ${apiId} must not append a sample query string (the grader adds its own).`);
    assert(plain.usesHostedApi === true && plain.guide.includes(`${apiOrigin}/health`), `T3 GA1 ${apiId} must tell students to wake the Render API before pressing Check.`);
  }

  // Q15: no URL can exist before the student supplies their private Ledger link.
  const q15 = await byId['q-ledger-agent-server'].solve(sampleEmail);
  assert(q15.type === 'guide' && !/https?:\/\//i.test(q15.answer), 'T3 GA1 Q15 must not put a submittable-looking URL in the Answer box before generation.');
  assert(q15.guide.includes('id="t3q15Root"') && q15.guide.includes('data-email="21f1000000@ds.study.iitm.ac.in"') && q15.guide.includes('id="t3q15Url"'), 'T3 GA1 Q15 must render its email + private-URL form.');
  assert(typeof globalThis.window._t3ga1q15Generate === 'function', 'T3 GA1 Q15 must register its Generate handler.');
  const hostileEmail = 'a"onmouseover=alert(1)@example.com';
  const hostile = await byId['q-ledger-agent-server'].solve(hostileEmail);
  assert(!hostile.guide.includes('data-email="a"onmouseover') && hostile.guide.includes('data-email="a&quot;onmouseover=alert(1)@example.com"'), 'T3 GA1 Q15 must HTML-escape the email in its form attributes.');

  const q15Module = await importFresh('solvers/T32026/ga1/q15-ledger-agent.js');
  const { validateLedgerUrl, extractLedgerUrl, onboardLedger, isExpectedSubmitUrl } = q15Module;
  const ledgerEmail = '21f1000000@ds.study.iitm.ac.in';
  const goodLink = 'https://exam.sanand.workers.dev/questionData?email=21f1000000%40ds.study.iitm.ac.in&quizSign=abc%2Bdef%3D&questionId=q-ledger-agent-server&path=/';
  const codeOf = (link, email = ledgerEmail) => validateLedgerUrl(link, email).code ?? 'OK';

  assert(codeOf(goodLink) === 'OK' && validateLedgerUrl(goodLink, ledgerEmail).url === goodLink, 'T3 GA1 Q15 must accept the official Ledger link unchanged.');
  assert(extractLedgerUrl(`curl "${goodLink}".`) === goodLink && validateLedgerUrl(`  \`${goodLink}\`,  `, ledgerEmail).url === goodLink, 'T3 GA1 Q15 must extract the link from curl lines, quotes, backticks and trailing punctuation.');
  assert(codeOf(goodLink.replace('21f1000000%40', '21F1000000%40')) === 'OK', 'T3 GA1 Q15 must compare the link email case-insensitively.');
  assert(codeOf(goodLink.replace('https://exam', 'HTTPS://EXAM')) === 'OK', 'T3 GA1 Q15 must accept a differently-cased scheme and host.');
  assert(codeOf('https://a.example/questionData?email=a+b@x.com&quizSign=s&questionId=q-ledger-agent-server', 'a+b@x.com') === 'WRONG_HOST', 'T3 GA1 Q15 must reject non-exam hosts.');
  assert(codeOf('https://exam.sanand.workers.dev/questionData?email=a+b@x.com&quizSign=s&questionId=q-ledger-agent-server', 'a+b@x.com') === 'OK', 'T3 GA1 Q15 must tolerate an unescaped + in the link email.');
  assert(codeOf('') === 'EMPTY' && codeOf('no link here') === 'EMPTY' && codeOf(null) === 'EMPTY', 'T3 GA1 Q15 must report an empty paste.');
  assert(codeOf(goodLink.replace('https:', 'http:')) === 'WRONG_HOST', 'T3 GA1 Q15 must reject plain http.');
  assert(codeOf('https://exam.sanand.workers.dev.evil.example/questionData?email=a&quizSign=s&questionId=q-ledger-agent-server') === 'WRONG_HOST', 'T3 GA1 Q15 must reject look-alike hosts.');
  assert(codeOf(goodLink.replace('/questionData', '/questionData/')) === 'WRONG_PATH', 'T3 GA1 Q15 must reject other paths.');
  assert(codeOf(goodLink.replace('q-ledger-agent-server', 'q-vs-code-version')) === 'WRONG_QUESTION', 'T3 GA1 Q15 must reject links copied from another question.');
  assert(codeOf(goodLink.replace('&quizSign=abc%2Bdef%3D', '')) === 'NO_SIGNATURE', 'T3 GA1 Q15 must reject a link without quizSign.');
  assert(codeOf(goodLink, 'someone.else@example.com') === 'EMAIL_MISMATCH', 'T3 GA1 Q15 must reject another account\'s link.');

  // Response trust: only a URL back on the same API, for the same email, in the documented shape.
  const submit = (email, key = 'AbC_-123') => `${apiOrigin}/ga1/${encodeURIComponent(email)}/ledger/${key}/answer`;
  assert(isExpectedSubmitUrl(submit(ledgerEmail), ledgerEmail), 'T3 GA1 Q15 must accept the documented submit URL.');
  assert(isExpectedSubmitUrl(submit('user.test+t3@example.com'), mixedEmail), 'T3 GA1 Q15 must accept the submit URL for a + email.');
  assert(isExpectedSubmitUrl(`${apiOrigin}/ga1/user.test%2Bt3%40example.com/ledger/k/answer`, mixedEmail) && isExpectedSubmitUrl(`${apiOrigin}/ga1/user.test+t3%40example.com/ledger/k/answer`, mixedEmail), 'T3 GA1 Q15 must compare the decoded email segment, so %2B and a literal + in the path both match.');
  assert(!isExpectedSubmitUrl(`${apiOrigin}/ga1/user.test%20t3%40example.com/ledger/k/answer`, mixedEmail), 'T3 GA1 Q15 must not treat an encoded space as a plus.');
  for (const bad of [submit('other@example.com'), `https://evil.example/ga1/${encodeURIComponent(ledgerEmail)}/ledger/k/answer`, `${submit(ledgerEmail)}?x=1`, `${apiOrigin}/ga1/${encodeURIComponent(ledgerEmail)}/ledger/answer`, `${apiOrigin}/ga1/${encodeURIComponent(ledgerEmail)}/ledger/k/answer/extra`, 'not a url', '']) {
    assert(!isExpectedSubmitUrl(bad, ledgerEmail), `T3 GA1 Q15 must reject an unexpected submit URL: ${bad}`);
  }

  // Onboarding flow with a scripted fetch: record every call so ordering and secrecy can be asserted.
  const script = (handler) => {
    const calls = [];
    const fetchImpl = async (url, init = {}) => {
      calls.push({ url, method: init.method || 'GET', body: init.body });
      return handler(url, init, calls);
    };
    return { calls, fetchImpl };
  };
  const reply = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });
  const instant = { sleep: async () => {}, wake: true };
  const goodSubmit = submit(ledgerEmail);

  let run = script((url) => (url.endsWith('/health') ? reply(200, { status: 'ok' }) : reply(200, { status: 'ok', submit_url: goodSubmit })));
  let outcome = await onboardLedger({ email: ledgerEmail, rawUrl: goodLink, fetchImpl: run.fetchImpl, ...instant });
  assert(outcome.ok && outcome.submitUrl === goodSubmit, 'T3 GA1 Q15 onboarding must return the API\'s submit URL.');
  assert(run.calls.length === 2 && run.calls[0].url === `${apiOrigin}/health` && run.calls[1].url === `${apiOrigin}/ga1/onboard` && run.calls[1].method === 'POST', 'T3 GA1 Q15 must wake the API (/health) before posting to /ga1/onboard.');
  assert(!run.calls[0].body && JSON.stringify(JSON.parse(run.calls[1].body)) === JSON.stringify({ email: ledgerEmail, question_data_url: goodLink }), 'T3 GA1 Q15 must send the link only in the onboard POST, with the normalised email.');

  let healthCalls = 0;
  run = script((url) => {
    if (url.endsWith('/health')) {
      healthCalls += 1;
      if (healthCalls === 1) throw new TypeError('Failed to fetch');
      return healthCalls === 2 ? reply(503, null) : reply(200, { status: 'ok' });
    }
    return reply(200, { submit_url: goodSubmit });
  });
  outcome = await onboardLedger({ email: ledgerEmail, rawUrl: goodLink, fetchImpl: run.fetchImpl, ...instant });
  assert(outcome.ok && healthCalls === 3 && run.calls.filter((call) => call.method === 'POST').length === 1, 'T3 GA1 Q15 must keep polling a sleeping API and post exactly once after it wakes.');

  let clock = 0;
  run = script((url) => (url.endsWith('/health') ? reply(503, null) : reply(200, { submit_url: goodSubmit })));
  outcome = await onboardLedger({ email: ledgerEmail, rawUrl: goodLink, fetchImpl: run.fetchImpl, sleep: async () => {}, now: () => (clock += 40000) });
  assert(!outcome.ok && outcome.code === 'API_UNREACHABLE' && run.calls.every((call) => call.method === 'GET'), 'T3 GA1 Q15 must never send the signed link to an API that did not wake up.');

  run = script(() => reply(200, { submit_url: goodSubmit }));
  for (const [rawUrl, email] of [['', ledgerEmail], [goodLink.replace('https', 'http'), ledgerEmail], [goodLink, 'someone.else@example.com'], [goodLink, '']]) {
    outcome = await onboardLedger({ email, rawUrl, fetchImpl: run.fetchImpl, ...instant });
    assert(!outcome.ok, 'T3 GA1 Q15 must reject invalid input.');
  }
  assert(run.calls.length === 0, 'T3 GA1 Q15 must not make any network request for invalid input.');

  const failureCases = [
    [reply(400, { error: 'VALID_LEDGER_QUESTION_DATA_URL_REQUIRED' }), 'VALID_LEDGER_QUESTION_DATA_URL_REQUIRED', /Copy it again/],
    [reply(400, { error: 'VALID_EMAIL_REQUIRED' }), 'VALID_EMAIL_REQUIRED', /valid email/],
    [reply(502, { error: 'LEDGER_UPSTREAM_REJECTED', upstream_status: 403 }), 'LEDGER_UPSTREAM_REJECTED', /signature/],
    [reply(502, { error: 'LEDGER_UPSTREAM_REJECTED', upstream_status: 401 }), 'LEDGER_UPSTREAM_REJECTED', /signature/],
    [reply(502, { error: 'LEDGER_UPSTREAM_REJECTED', upstream_status: 500 }), 'LEDGER_UPSTREAM_REJECTED', /HTTP 500/],
    [reply(504, { error: 'LEDGER_DISCOVERY_TIMEOUT' }), 'LEDGER_DISCOVERY_TIMEOUT', /in time/],
    [reply(429, null), 'RATE_LIMITED', /busy/],
    [reply(500, { error: 'BOOM' }), 'BOOM', /BOOM/],
    [reply(503, null), 'HTTP_503', /HTTP 503/],
    [reply(200, { status: 'ok' }), 'BAD_RESPONSE', /unexpected format/],
    [reply(200, { submit_url: submit('other@example.com') }), 'BAD_RESPONSE', /unexpected format/],
    [{ ok: true, status: 200, json: async () => { throw new SyntaxError('bad json'); } }, 'BAD_RESPONSE', /unexpected format/],
  ];
  for (const [response, expectedCode, pattern] of failureCases) {
    run = script((url) => (url.endsWith('/health') ? reply(200, { status: 'ok' }) : response));
    outcome = await onboardLedger({ email: ledgerEmail, rawUrl: goodLink, fetchImpl: run.fetchImpl, ...instant });
    assert(!outcome.ok && outcome.code === expectedCode && pattern.test(outcome.message), `T3 GA1 Q15 mishandled API response ${expectedCode}: ${JSON.stringify(outcome)}`);
  }
  run = script((url) => { if (url.endsWith('/health')) return reply(200, {}); throw new TypeError('Failed to fetch'); });
  outcome = await onboardLedger({ email: ledgerEmail, rawUrl: goodLink, fetchImpl: run.fetchImpl, ...instant });
  assert(!outcome.ok && outcome.code === 'NETWORK', 'T3 GA1 Q15 must report a network failure during onboarding.');
  run = script((url) => { if (url.endsWith('/health')) return reply(200, {}); const abort = new Error('aborted'); abort.name = 'AbortError'; throw abort; });
  outcome = await onboardLedger({ email: ledgerEmail, rawUrl: goodLink, fetchImpl: run.fetchImpl, ...instant });
  assert(!outcome.ok && outcome.code === 'TIMEOUT', 'T3 GA1 Q15 must report an onboarding timeout.');
  outcome = await onboardLedger({ email: ledgerEmail, rawUrl: goodLink, fetchImpl: null, ...instant });
  assert(!outcome.ok && outcome.code === 'NO_FETCH', 'T3 GA1 Q15 must fail clearly when fetch is unavailable.');
}

async function checkT3Ga1Scale(solvers, studentCount = 1000) {
  for (let student = 0; student < studentCount; student += 1) {
    const email = `student${String(student).padStart(4, '0')}@scale-test.example`;
    const results = {};
    for (const solver of solvers) {
      const result = await solver.solve(email);
      assert(result.type !== 'error', `T3 GA1 ${solver.id} failed for scale-test student ${student}: ${result.answer}`);
      assert(typeof result.answer === 'string' && result.answer.length > 0, `T3 GA1 ${solver.id} returned empty output for student ${student}.`);
      results[solver.id] = result;
    }

    const jsonAnswer = JSON.parse(results['q-broken-json-server'].answer);
    assert(jsonAnswer.length === 300, `T3 GA1 Q5 generated an incomplete dataset for student ${student}.`);
    assert(/^[a-f0-9]{64}$/.test(results['q-rename-files-server'].answer), `T3 GA1 Q7 returned an invalid digest for student ${student}.`);
    assert(/^\d+$/.test(results['q-csv-sales-analysis-server'].answer), `T3 GA1 Q8 returned a non-integer revenue for student ${student}.`);
    const rankings = JSON.parse(results['q-cosine-similarity-server'].answer);
    assert(Object.keys(rankings).length === 10 && Object.values(rankings).every((ids) => ids.length === 5), `T3 GA1 Q11 returned malformed rankings for student ${student}.`);
  }
}

async function checkGa2SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+GA2@Example.COM'
  ];

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email);
      assert(result && typeof result === 'object', `GA2 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `GA2 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `GA2 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `GA2 ${solver.id} returned unexpected result type: ${result.type}.`
      );
    }
  }
}

function checkGa3OfficialOrder(solvers) {
  const officialIds = [
    'q-youtube-metadata-filter-server',
    'q-multimodal-image-qa-server',
    'q-invoice-extract-server',
    'q-dynamic-extract-server',
    'q-cosine-similarity-server',
    'q-korean-audio-dataset-server',
    'q-structured-extraction-server',
    'q-semantic-rank-server',
    'q-cot-math-verifier-server',
    'q-proof-of-work-server',
    'q-context-window-heist-server',
    'q-spin-up-cli-server',
    'q-embedding-trap-neighbors-server'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} GA3 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'GA3 solver order/IDs no longer match the official May 2026 GA3 bundle.'
  );
}

async function checkGa3SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+GA3@Example.COM'
  ];
  const sessionToken = 'quiz_sign_mock_token_1234';

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email, sessionToken);
      assert(result && typeof result === 'object', `GA3 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `GA3 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `GA3 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `GA3 ${solver.id} returned unexpected result type: ${result.type}.`
      );
    }
  }
}

function checkGa4OfficialOrder(solvers) {
  const officialIds = [
    'q-rag-chunking-hybrid-search-server',
    'q-rag-evaluation-harness-server',
    'q-grounded-answer-api-server',
    'q-vector-search-rerank-api-server',
    'q-graphrag-pipeline-api-server',
    'q-late-chunking-context-retrieval-server',
    'q-semantic-cache-query-augmentation-server',
    'q-multimodal-embedding-calibration-server',
    'q-hyde-hypothetical-retrieval-server',
    'q-ann-index-recall-latency-server',
    'q-semantic-dedup-numeric-guardrail-server',
    'q-context-assembly-lost-middle-server',
    'q-rrf-fusion-server'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} GA4 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'GA4 solver order/IDs no longer match the official May 2026 GA4 bundle.'
  );
}

async function checkGa4SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+GA4@Example.COM',
    '' // empty email must not crash a solver
  ];
  const sessionToken = 'quiz_sign_mock_token_1234';

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email, sessionToken);
      assert(result && typeof result === 'object', `GA4 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `GA4 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `GA4 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `GA4 ${solver.id} returned unexpected result type: ${result.type}.`
      );
      if (result.answer.trim().startsWith('{') || result.answer.trim().startsWith('[')) {
        try {
          JSON.parse(result.answer);
        } catch (e) {
          assert(false, `GA4 ${solver.id} answer is not valid JSON: ${e.message}`);
        }
      }
      // Determinism: same email must yield the same answer every time.
      const result2 = await solver.solve(email, sessionToken);
      assert(result.answer === result2.answer, `GA4 ${solver.id} is non-deterministic for the same email.`);
    }
  }
}

function checkGa5OfficialOrder(solvers) {
  const officialIds = [
    'maze-solve-server',
    'q-spec-driven-correction-server',
    'q-agent-tool-guardrail-server',
    'q-skill-safety-audit-server',
    'q-agent-budget-loop-guardrail-server',
    'q-mcp-server-live-server',
    'q-lxd-sandbox-live-server',
    'q-agent-guardrail-redteam-server',
    'q-taint-aware-agent-executor-server',
    'q-a2a-durable-delegate-server',
    'q-agent-trace-integrity-server'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} GA5 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'GA5 solver order/IDs no longer match the official May 2026 GA5 bundle.'
  );
}

async function checkGa5SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+GA5@Example.COM',
    '' // empty email must not crash a solver
  ];
  const sessionToken = 'quiz_sign_mock_token_1234';

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email, sessionToken);
      assert(result && typeof result === 'object', `GA5 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `GA5 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `GA5 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `GA5 ${solver.id} returned unexpected result type: ${result.type}.`
      );
      if (result.answer.trim().startsWith('{') || result.answer.trim().startsWith('[')) {
        try {
          JSON.parse(result.answer);
        } catch (e) {
          assert(false, `GA5 ${solver.id} answer is not valid JSON: ${e.message}`);
        }
      }
      // Determinism: same email must yield the same answer every time.
      const result2 = await solver.solve(email, sessionToken);
      assert(result.answer === result2.answer, `GA5 ${solver.id} is non-deterministic for the same email.`);
    }
  }

  // The maze solver's answer must be a legal, complete U/D/L/R path from start to end.
  const mazeSolver = solvers.find((s) => s.id === 'maze-solve-server');
  assert(mazeSolver, 'GA5 maze-solve-server not found in registry.');
  const { generateMaze } = await importFresh('solvers/T22026/ga5/q-maze-solve.js');
  for (const email of ['21f1000000@ds.study.iitm.ac.in', '23f1000805@ds.study.iitm.ac.in']) {
    const maze = generateMaze(email);
    const result = await mazeSolver.solve(email, sessionToken);
    assert(/^[UDLR]+$/.test(result.answer), `GA5 maze answer for ${email} has illegal characters.`);
    const DIR = { U: [0, -1, 1], R: [1, 0, 2], D: [0, 1, 4], L: [-1, 0, 8] };
    let [x, y] = maze.start;
    for (const ch of result.answer) {
      const [dx, dy, bit] = DIR[ch];
      assert((maze.openMask[y][x] & bit) !== 0, `GA5 maze answer for ${email} makes an illegal move through a wall.`);
      x += dx;
      y += dy;
    }
    assert(x === maze.end[0] && y === maze.end[1], `GA5 maze answer for ${email} does not end at the maze exit.`);
  }
}

function checkGa6OfficialOrder(solvers) {
  const officialIds = [
    'q-rotated-image-grid-forensics-server',
    'q-minimal-prompt-robustness',
    'q-duckdb-regression-analysis',
    'q-playwright-shadow-incident-audit-server',
    'q-duckdb-json-ledger-reconciliation-server',
    'q-politeness-audit-server',
    'q-scrape-books-server',
    'q-github-action-playwright',
    'q-playwright-table-server',
    'q-modem-in-static-server'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} GA6 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'GA6 solver order/IDs no longer match the official May 2026 GA6 bundle.'
  );
}

async function checkGa6SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+GA6@Example.COM',
    '' // empty email must not crash a solver
  ];

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email);
      assert(result && typeof result === 'object', `GA6 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `GA6 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `GA6 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `GA6 ${solver.id} returned unexpected result type: ${result.type}.`
      );
      if (result.answer.trim().startsWith('{') || result.answer.trim().startsWith('[')) {
        try {
          JSON.parse(result.answer);
        } catch (e) {
          assert(false, `GA6 ${solver.id} answer is not valid JSON: ${e.message}`);
        }
      }
      // Determinism: same email must yield the same answer every time — except Q7, which
      // does a real, short-timeout live fetch against a Render-hosted API by design. Its
      // fallback path (manual guide) is an intentional, correct alternative to a cold-start
      // timeout, not a bug, so two calls close together can legitimately differ (one live
      // digest, one fallback) depending on whether the API happened to be warm.
      const result2 = await solver.solve(email);
      if (solver.id !== 'q-scrape-books-server') {
        assert(result.answer === result2.answer, `GA6 ${solver.id} is non-deterministic for the same email.`);
      }
    }
  }

  // Sanity-check the shape of the 4 real "solved" JSON answers beyond just "is valid JSON".
  const promptAudit = solvers.find((s) => s.id === 'q-minimal-prompt-robustness');
  assert(promptAudit, 'GA6 q-minimal-prompt-robustness not found in registry.');
  const promptResult = await promptAudit.solve('23f1000805@ds.study.iitm.ac.in');
  assert(/^I\d+(, I\d+)*; \d+; \d+\.\d+; \d+\.\d+$/.test(promptResult.answer), `GA6 prompt robustness answer has an unexpected format: ${promptResult.answer}`);

  const ledger = solvers.find((s) => s.id === 'q-duckdb-json-ledger-reconciliation-server');
  assert(ledger, 'GA6 q-duckdb-json-ledger-reconciliation-server not found in registry.');
  const ledgerResult = JSON.parse((await ledger.solve('23f1000805@ds.study.iitm.ac.in')).answer);
  for (const key of ['invoice_count', 'net_usd', 'top_sku', 'top_sku_usd']) {
    assert(key in ledgerResult, `GA6 ledger reconciliation answer missing key "${key}".`);
  }

  const incidentAudit = solvers.find((s) => s.id === 'q-playwright-shadow-incident-audit-server');
  assert(incidentAudit, 'GA6 q-playwright-shadow-incident-audit-server not found in registry.');
  const incidentResult = JSON.parse((await incidentAudit.solve('23f1000805@ds.study.iitm.ac.in')).answer);
  for (const key of ['resolved_incidents', 'downtime_minutes', 'loss_usd', 'p95_minutes']) {
    assert(key in incidentResult, `GA6 incident audit answer missing key "${key}".`);
  }

  const politeness = solvers.find((s) => s.id === 'q-politeness-audit-server');
  assert(politeness, 'GA6 q-politeness-audit-server not found in registry.');
  const politenessResult = JSON.parse((await politeness.solve('23f1000805@ds.study.iitm.ac.in')).answer);
  assert(/^[0-9a-f]{64}$/.test(politenessResult.data_hash), `GA6 politeness audit data_hash is not a 64-char lowercase hex digest: ${politenessResult.data_hash}`);

  const tableSum = solvers.find((s) => s.id === 'q-playwright-table-server');
  assert(tableSum, 'GA6 q-playwright-table-server not found in registry.');
  const tableSumResult = await tableSum.solve('23f1000805@ds.study.iitm.ac.in');
  assert(/^\d+$/.test(tableSumResult.answer), `GA6 table sum answer is not a plain integer: ${tableSumResult.answer}`);
}

function checkP1OfficialOrder(solvers) {
  const officialIds = [
    'q-interview-requirements-audio',
    'q-model-intelligence-diff',
    'q-gcp-cloud-gcp-cli-server',
    'q-gcp-cloud-eval-dataset-server',
    'q-tds-project-telegram-bot'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} P1 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'P1 solver order/IDs no longer match the official May 2026 P1 bundle.'
  );
}
async function checkP1SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'USER.Test+P1@Example.COM',
    '' // empty email must not crash a solver
  ];
  const sessionToken = 'quiz_sign_mock_token_1234';

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email, sessionToken);
      assert(result && typeof result === 'object', `P1 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `P1 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `P1 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `P1 ${solver.id} returned unexpected result type: ${result.type}.`
      );
      // Determinism: same email must yield the same answer every time.
      const result2 = await solver.solve(email, sessionToken);
      assert(result.answer === result2.answer, `P1 ${solver.id} is non-deterministic for the same email.`);
    }
  }

  // Q2's answer is real submitted JSON. Mirror the exam's own client-side validator
  // exactly (pair is GPT/GEMINI, prompt is non-empty, <=1000 words) so a structural
  // failure is caught here rather than at submission time.
  const q2Solver = solvers.find((s) => s.id === 'q-model-intelligence-diff');
  assert(q2Solver, 'P1 q-model-intelligence-diff not found in registry.');
  const seenPrompts = new Set();
  for (const email of ['21f1000000@ds.study.iitm.ac.in', '23f1000805@ds.study.iitm.ac.in', 'a@x.com', 'b@x.com', 'c@x.com']) {
    const result = await q2Solver.solve(email, sessionToken);
    let parsed;
    try {
      parsed = JSON.parse(result.answer);
    } catch (e) {
      assert(false, `P1 Q2 answer for ${email} is not valid JSON: ${e.message}`);
    }
    const pair = String(parsed.pair || '').trim().toUpperCase();
    const prompt = String(parsed.prompt || '').trim();
    assert(pair === 'GPT' || pair === 'GEMINI', `P1 Q2 "pair" for ${email} must be GPT or GEMINI, got "${parsed.pair}".`);
    assert(prompt.length > 0, `P1 Q2 "prompt" for ${email} must not be empty.`);
    const words = prompt.split(/\s+/).filter(Boolean).length;
    assert(words <= 1000, `P1 Q2 prompt for ${email} exceeds the 1000-word limit (${words} words).`);
    assert(/\b(YES|NO)\b/i.test(prompt), `P1 Q2 prompt for ${email} does not mention YES/NO at all.`);
    seenPrompts.add(prompt);
  }
  assert(seenPrompts.size > 1, 'P1 Q2 returns the identical prompt for every email — must vary per user.');
}

async function checkT2P2SolversExecute(solvers) {
  assert(solvers.length === 8, `T2 P2 should have exactly 8 solvers, got ${solvers.length}.`);

  const whitelistedEmails = [
    '23f1000805@ds.study.iitm.ac.in',
    '23f3001077@ds.study.iitm.ac.in',
    '23f2005160@ds.study.iitm.ac.in',
    '24f2004141@ds.study.iitm.ac.in',
    '24f3003125@ds.study.iitm.ac.in',
    '24f3005089@ds.study.iitm.ac.in'
  ];
  const lockedEmails = [
    'random_student@ds.study.iitm.ac.in',
    'other_user@gmail.com'
  ];
  const sessionToken = 'quiz_sign_mock_token_1234';

  const { CASE_SPECS, validateCaseAnswer, analyzeDraft } = await importFresh('solvers/T22026/p2/case-specs.js');

  // 1. Whitelisted emails get full solved diagnostic notes
  for (const email of whitelistedEmails) {
    for (const solver of solvers) {
      const spec = CASE_SPECS[solver.id];
      const result = await solver.solve(email, sessionToken);
      assert(result && typeof result === 'object', `T2 P2 ${solver.id} returned non-object.`);
      assert(typeof result.answer === 'string', `T2 P2 ${solver.id} answer must be string.`);
      assert(result.answer.length >= spec.minChars, `T2 P2 ${solver.id} answer too short: ${result.answer.length} < ${spec.minChars}`);
      assert(result.answer.length <= spec.maxChars, `T2 P2 ${solver.id} answer exceeds max length: ${result.answer.length} > ${spec.maxChars}`);
      assert(result.type === 'solved', `T2 P2 ${solver.id} should be solved for whitelisted email, got ${result.type}`);

      // Deep Rubric Validation
      const gate = validateCaseAnswer(solver.id, result.answer);
      assert(gate.valid === true, `T2 P2 ${solver.id} failed hard gate for ${email}: ${gate.errors.join('; ')}`);

      const analysis = analyzeDraft(solver.id, result.answer);
      assert(analysis.qualityPct >= 90, `T2 P2 ${solver.id} quality score ${analysis.qualityPct}% is below 90% target for ${email}`);
      assert(analysis.formatMarks === 2.5, `T2 P2 ${solver.id} formatMarks should be 2.5, got ${analysis.formatMarks}`);

      // Determinism
      const result2 = await solver.solve(email, sessionToken);
      assert(result.answer === result2.answer, `T2 P2 ${solver.id} non-deterministic for same email.`);
    }
  }

  // 2. Non-whitelisted emails get locked access restriction when locked is enabled
  {
    const { lockConfig } = await importShared('solvers/T22026/p2/lock-config.js');
    const originalLocked = lockConfig.locked;
    const originalWhitelisted = lockConfig.whitelistedEmails;
    lockConfig.locked = true;
    lockConfig.whitelistedEmails = whitelistedEmails;
    try {
      for (const email of lockedEmails) {
        for (const solver of solvers) {
          const result = await solver.solve(email, sessionToken);
          assert(result.debug && result.debug.locked === true, `T2 P2 ${solver.id} should be locked for ${email}`);
          assert(result.variant === 'Locked', `T2 P2 ${solver.id} should show Locked variant`);
        }
      }
    } finally {
      lockConfig.locked = originalLocked;
      lockConfig.whitelistedEmails = originalWhitelisted;
    }
  }

  // 3. Uniqueness across different whitelisted emails
  for (const solver of solvers) {
    const res1 = await solver.solve(whitelistedEmails[0], sessionToken);
    const res2 = await solver.solve(whitelistedEmails[1], sessionToken);
    const res3 = await solver.solve(whitelistedEmails[2], sessionToken);
    const res4 = await solver.solve(whitelistedEmails[3], sessionToken);
    const res5 = await solver.solve(whitelistedEmails[4], sessionToken);
    const res6 = await solver.solve(whitelistedEmails[5], sessionToken);
    assert(res1.answer !== res2.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 2.`);
    assert(res1.answer !== res3.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 3.`);
    assert(res2.answer !== res3.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 2 and 3.`);
    assert(res1.answer !== res4.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 4.`);
    assert(res1.answer !== res5.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 5.`);
    assert(res1.answer !== res6.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 6.`);
  }

  // 4. Rubric contract: runtime must validate every generated note and expose the report.
  for (const solver of solvers) {
    const result = await solver.solve(whitelistedEmails[0], sessionToken);
    assert(result.debug && result.debug.rubric, `T2 P2 ${solver.id} did not expose debug.rubric — runtime rubric enforcement is missing.`);
    assert(result.debug.rubric.valid === true, `T2 P2 ${solver.id} generated a note that fails its own rubric contract: ${(result.debug.rubric.errors || []).join('; ')}`);
    assert(result.variant !== 'Rubric Contract Failed', `T2 P2 ${solver.id} withheld its note for failing the rubric contract.`);
  }

  // 5. Blank/missing email must be refused, never answered with a seeded-but-identical note.
  {
    const { lockConfig } = await importShared('solvers/T22026/p2/lock-config.js');
    const originalLocked = lockConfig.locked;
    lockConfig.locked = false; // exercise the guard rather than the lock short-circuit
    try {
      for (const solver of solvers) {
        for (const blank of ['', '   ', null, undefined]) {
          const result = await solver.solve(blank, sessionToken);
          assert(result.type === 'error', `T2 P2 ${solver.id} returned type=${result.type} for a blank email — must refuse.`);
          assert(!result.answer, `T2 P2 ${solver.id} emitted an answer for a blank email.`);
        }
      }
    } finally {
      lockConfig.locked = originalLocked;
    }
  }

  // 6. Scaled uniqueness + citation-density + full rubric contract across 120 synthetic students.
  {
    const { lockConfig } = await importShared('solvers/T22026/p2/lock-config.js');
    const originalLocked = lockConfig.locked;
    lockConfig.locked = false;
    try {
      const SAMPLE = 120;
      const emails = Array.from({ length: SAMPLE }, (_, i) => `23f${String(1000000 + i * 8191).slice(0, 7)}@ds.study.iitm.ac.in`);
      for (const solver of solvers) {
        const spec = CASE_SPECS[solver.id];
        const seen = new Set();
        let minEntityHits = Infinity;
        for (const email of emails) {
          const { answer } = await solver.solve(email, sessionToken);
          seen.add(answer);
          assert(!/undefined|NaN|\[object Object\]/.test(answer), `T2 P2 ${solver.id} produced corrupted output for ${email}.`);
          assert(answer.length >= spec.minChars && answer.length <= spec.maxChars, `T2 P2 ${solver.id} length bounds violated for ${email}: ${answer.length} chars (spec: ${spec.minChars}-${spec.maxChars})`);
          
          const gate = validateCaseAnswer(solver.id, answer);
          assert(gate.valid === true, `T2 P2 ${solver.id} failed hard gate for ${email}: ${gate.errors.join('; ')}`);
          
          const analysis = analyzeDraft(solver.id, answer);
          assert(analysis.qualityPct >= 90, `T2 P2 ${solver.id} scored quality ${analysis.qualityPct}% < 90% for ${email}`);

          if (spec && spec.keyEntities) {
            const hits = spec.keyEntities.filter(ent =>
              new RegExp(ent.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i').test(answer)
            ).length;
            minEntityHits = Math.min(minEntityHits, hits);
          }
        }
        const uniqueRatio = seen.size / SAMPLE;
        assert(uniqueRatio >= 0.9, `T2 P2 ${solver.id} only produced ${seen.size}/${SAMPLE} unique notes (${Math.round(uniqueRatio * 100)}%) — variation pool is too small, students will collide.`);
        if (spec && spec.keyEntities) {
          const required = Math.ceil(spec.keyEntities.length / 2);
          assert(minEntityHits >= required, `T2 P2 ${solver.id} worst-case citation density is ${minEntityHits}/${spec.keyEntities.length}, below the ${required} the rubric coach requires.`);
        }
      }
    } finally {
      lockConfig.locked = originalLocked;
    }
  }
}

function checkT2Ga8OfficialOrder(solvers) {
  const officialIds = [
    'q-immutable-training-corpus-server',
    'q-leakage-safe-bqml-server',
    'q-mlflow-evidence-promotion-server',
    'q-peft-repair-server',
    'q-quantized-model-admission-server',
    'q-content-addressed-pipeline-server',
    'q-verifiable-model-bundle-server',
    'q-lora-quant-budget-server',
    'q-mlflow-fingerprint-server',
    'q-modelcard-carbon-server'
  ];

  assert(solvers.length === officialIds.length, `Expected ${officialIds.length} T2 GA8 solvers, got ${solvers.length}.`);
  assert(
    solvers.map((solver) => solver.id).join('|') === officialIds.join('|'),
    'T2 GA8 solver order/IDs do not match the official May 2026 GA8 bundle.'
  );
}

async function checkT2Ga8SolversExecute(solvers) {
  const sampleEmails = [
    '21f1000000@ds.study.iitm.ac.in',
    '23f1000805@ds.study.iitm.ac.in',
    'USER.Test+GA8@Example.COM',
    '' // empty email must not crash a solver
  ];

  for (const email of sampleEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email);
      assert(result && typeof result === 'object', `T2 GA8 ${solver.id} returned a non-object result.`);
      assert(typeof result.answer === 'string', `T2 GA8 ${solver.id} answer must be a string.`);
      assert(result.answer.length > 0, `T2 GA8 ${solver.id} answer must not be empty.`);
      assert(
        ['solved', 'guide', 'bypass', 'error'].includes(result.type),
        `T2 GA8 ${solver.id} returned unexpected result type: ${result.type}.`
      );
    }
  }
}

async function checkT2EndTermMock(solvers) {
  assert(solvers.length === 300, `T2 end-term mock should expose 300 questions, got ${solvers.length}.`);
  assert(new Set(solvers.map((solver) => solver.id)).size === 300, 'T2 end-term mock solver IDs must be unique.');

  const sampleEmail = '23f1000805@ds.study.iitm.ac.in';
  const checkpoints = [
    [0, 'mcq', 'MCQ-001'],
    [199, 'mcq', 'MCQ-200'],
    [200, 'subjective', 'SUB-001'],
    [299, 'subjective', 'SUB-100']
  ];

  for (const [index, kind, id] of checkpoints) {
    const result = await solvers[index].solve(sampleEmail);
    assert(result.type === 'quiz', `T2 end-term ${id} should return quiz type.`);
    assert(result.quizItem?.kind === kind, `T2 end-term ${id} should be ${kind}.`);
    assert(result.quizItem?.id === id, `T2 end-term index ${index} expected ${id}, got ${result.quizItem?.id}.`);
    assert(result.debug?.normalizedEmail === sampleEmail, `T2 end-term ${id} did not preserve normalized email progress identity.`);
  }

  const bankItems = solvers.map((solver) => solver.solve(sampleEmail).quizItem);
  const objective = bankItems.filter((item) => item.kind === 'mcq');
  const subjective = bankItems.filter((item) => item.kind === 'subjective');
  assert(objective.filter((item) => item.format === 'MCQ').length === 175, 'T2 end-term objective pool should contain 175 MCQs.');
  assert(objective.filter((item) => item.format === 'MSQ').length === 25, 'T2 end-term objective pool should contain 25 MSQs.');
  assert(objective.every((item) => [1, 2, 3, 4, 5].includes(item.guideTopic)), 'T2 end-term objective items must map to guide topics 1-5.');
  assert(subjective.every((item) => item.guideTopic === 6), 'T2 end-term subjective items must map to applied AI-era judgment topic 6.');
  assert(subjective.every((item) => item.modelAnswer?.claimAssessment && item.modelAnswer?.evidence && item.modelAnswer?.uncertainty), 'T2 end-term subjective model answers must expose claim assessment, evidence, and uncertainty fields.');
}

async function main() {
  installBrowserStubs();

  if (process.argv.includes('--t3-ga1-only')) {
    const registry = await importFresh('solvers/T32026/ga1/registry.js');
    await checkT3Ga1(registry.solvers, registry.metadata);
    console.log(`T3 GA1 checks passed: ${registry.solvers.length} official question slots.`);
    return;
  }

  if (process.argv.includes('--t3-ga1-scale')) {
    const registry = await importFresh('solvers/T32026/ga1/registry.js');
    await checkT3Ga1(registry.solvers, registry.metadata);
    await checkT3Ga1Scale(registry.solvers, 1000);
    console.log(`T3 GA1 scale checks passed: ${registry.solvers.length} questions across 1,000 distinct email seeds.`);
    return;
  }

  assert(fs.existsSync(path.join(rootDir, 'index.html')), 'Missing index.html.');
  assert(fs.existsSync(path.join(rootDir, 'style.css')), 'Missing style.css.');
  assert(fs.existsSync(path.join(rootDir, 'ga7-verify.html')), 'Missing ga7-verify.html.');
  const appSource = fs.readFileSync(path.join(rootDir, 'app.js'), 'utf8');
  const catalogRun = spawnSync(process.execPath, ['scripts/build-catalog.mjs', '--check'], { cwd: rootDir, encoding: 'utf8' });
  assert(catalogRun.status === 0, `Home-page solver index is stale (run node scripts/build-catalog.mjs): ${catalogRun.stderr}${catalogRun.stdout}`);
  const catalogLabels = [...fs.readFileSync(path.join(rootDir, 'scripts/build-catalog.mjs'), 'utf8').matchAll(/\['(\w+)', '[^']+', '([^']+)', '/g)].map((m) => m[2]);
  for (const label of catalogLabels) assert(appSource.includes(`label: '${label}'`), `Catalog label "${label}" is missing from TERM_EXAMS in app.js.`);
  assert(appSource.includes('endtermSectionJump'), 'End-term section jump control is missing from app.js.');
  assert(appSource.includes('value="MSQ"') && appSource.includes('value="SUBJECTIVE"'), 'End-term section jump options are incomplete.');
  assert(appSource.includes('previousCanvasScrollTop'), 'End-term re-renders should capture the quiz-pane scroll position.');
  assert(appSource.includes('previousWindowScrollY'), 'End-term re-renders should capture mobile page scroll position.');
  assert(appSource.includes('requestAnimationFrame(restoreScroll)'), 'End-term re-renders should restore scroll after layout.');
  assert(appSource.includes('getEndTermDisplayMeta'), 'End-term UI should number MCQ, MSQ, and subjective sections independently.');

  await importFresh('app.js');
  // T3 GA1 Q15 fills its Answer box through this hook; it must exist and refuse anything it
  // cannot safely apply (unknown question, or a patch without a real answer).
  assert(typeof globalThis.window.tdsPatchAnswer === 'function', 'app.js must expose window.tdsPatchAnswer for T3 GA1 Q15.');
  assert(globalThis.window.tdsPatchAnswer('q-not-in-workspace', { answer: 'x' }) === false, 'tdsPatchAnswer must ignore unknown questions.');
  assert(globalThis.window.tdsPatchAnswer('q-ledger-agent-server', { answer: '   ' }) === false, 'tdsPatchAnswer must refuse a patch with a blank answer.');
  assert(globalThis.window.tdsPatchAnswer('q-ledger-agent-server', null) === false, 'tdsPatchAnswer must refuse a missing patch.');
  await importFresh('ga7-verify.js');

  const ga7Registry = await importFresh('solvers/T12026/ga7/registry.js');
  const roeRegistry = await importFresh('solvers/T12026/roe/registry.js');
  const ga8Registry = await importFresh('solvers/T12026/ga8/registry.js');
  const p2Registry = await importFresh('solvers/T12026/p2/registry.js');
  const ga0Registry = await importFresh('solvers/T22026/ga0/registry.js');
  const ga1Registry = await importFresh('solvers/T22026/ga1/registry.js');
  const ga2Registry = await importFresh('solvers/T22026/ga2/registry.js');
  const ga3Registry = await importFresh('solvers/T22026/ga3/registry.js');
  const ga4Registry = await importFresh('solvers/T22026/ga4/registry.js');
  const ga5Registry = await importFresh('solvers/T22026/ga5/registry.js');
  const ga6Registry = await importFresh('solvers/T22026/ga6/registry.js');
  const p1Registry = await importFresh('solvers/T22026/p1/registry.js');
  const t2Ga8Registry = await importFresh('solvers/T22026/ga8/registry.js');
  const t2P2Registry = await importFresh('solvers/T22026/p2/registry.js');
  const endTermRegistry = await importFresh('solvers/T22026/endterm/registry.js');
  const t3Ga1Registry = await importFresh('solvers/T32026/ga1/registry.js');

  assert(Array.isArray(ga7Registry.solvers) && ga7Registry.solvers.length > 0, 'GA7 registry did not load solvers.');
  assert(Array.isArray(roeRegistry.solvers) && roeRegistry.solvers.length > 0, 'ROE registry did not load solvers.');
  assert(Array.isArray(ga8Registry.solvers) && ga8Registry.solvers.length > 0, 'GA8 registry did not load solvers.');
  assert(Array.isArray(p2Registry.solvers) && p2Registry.solvers.length === 2, 'P2 registry should have exactly 2 solvers (Q3 + Q4).');
  assert(Array.isArray(ga0Registry.solvers) && ga0Registry.solvers.length === 25, `GA0 registry should have exactly 25 solvers, got ${ga0Registry.solvers.length}.`);
  assert(Array.isArray(ga1Registry.solvers) && ga1Registry.solvers.length === 20, `GA1 registry should have exactly 20 solvers, got ${ga1Registry.solvers.length}.`);
  assert(Array.isArray(ga2Registry.solvers) && ga2Registry.solvers.length === 10, `GA2 registry should have exactly 10 solvers, got ${ga2Registry.solvers.length}.`);
  assert(Array.isArray(ga3Registry.solvers) && ga3Registry.solvers.length === 13, `GA3 registry should have exactly 13 solvers, got ${ga3Registry.solvers.length}.`);
  assert(Array.isArray(ga4Registry.solvers) && ga4Registry.solvers.length === 13, `GA4 registry should have exactly 13 solvers, got ${ga4Registry.solvers.length}.`);
  assert(Array.isArray(ga5Registry.solvers) && ga5Registry.solvers.length === 11, `GA5 registry should have exactly 11 solvers, got ${ga5Registry.solvers.length}.`);
  assert(Array.isArray(ga6Registry.solvers) && ga6Registry.solvers.length === 10, `GA6 registry should have exactly 10 solvers, got ${ga6Registry.solvers.length}.`);
  assert(Array.isArray(p1Registry.solvers) && p1Registry.solvers.length === 5, `P1 registry should have exactly 5 solvers, got ${p1Registry.solvers.length}.`);
  assert(Array.isArray(t2Ga8Registry.solvers) && t2Ga8Registry.solvers.length === 10, `T2 GA8 registry should have exactly 10 solvers, got ${t2Ga8Registry.solvers.length}.`);
  assert(Array.isArray(t2P2Registry.solvers), 'T2 P2 registry should export solvers array.');
  assert(Array.isArray(endTermRegistry.solvers), 'T2 end-term registry should export solvers array.');
  await checkGa8OfficialParity(ga8Registry.solvers);
  checkGa0OfficialOrder(ga0Registry.solvers);
  await checkGa0SolversExecute(ga0Registry.solvers);
  await checkGa1SolversExecute(ga1Registry.solvers);
  await checkGa2SolversExecute(ga2Registry.solvers);
  checkGa3OfficialOrder(ga3Registry.solvers);
  await checkGa3SolversExecute(ga3Registry.solvers);
  checkGa4OfficialOrder(ga4Registry.solvers);
  await checkGa4SolversExecute(ga4Registry.solvers);
  checkGa5OfficialOrder(ga5Registry.solvers);
  await checkGa5SolversExecute(ga5Registry.solvers);
  checkGa6OfficialOrder(ga6Registry.solvers);
  await checkGa6SolversExecute(ga6Registry.solvers);
  checkP1OfficialOrder(p1Registry.solvers);
  await checkP1SolversExecute(p1Registry.solvers);
  checkT2Ga8OfficialOrder(t2Ga8Registry.solvers);
  await checkT2Ga8SolversExecute(t2Ga8Registry.solvers);
  await checkT2P2SolversExecute(t2P2Registry.solvers);
  await checkT2EndTermMock(endTermRegistry.solvers);
  await checkT3Ga1(t3Ga1Registry.solvers, t3Ga1Registry.metadata);

  await checkServerRoutes();

  console.log(`Checks passed: GA7 solvers=${ga7Registry.solvers.length}, ROE solvers=${roeRegistry.solvers.length}, GA8 solvers=${ga8Registry.solvers.length}, P2 solvers=${p2Registry.solvers.length}, GA0 solvers=${ga0Registry.solvers.length}, GA1 solvers=${ga1Registry.solvers.length}, GA2 solvers=${ga2Registry.solvers.length}, GA3 solvers=${ga3Registry.solvers.length}, GA4 solvers=${ga4Registry.solvers.length}, GA5 solvers=${ga5Registry.solvers.length}, GA6 solvers=${ga6Registry.solvers.length}, P1 solvers=${p1Registry.solvers.length}, T2 GA8 solvers=${t2Ga8Registry.solvers.length}, T2 P2 solvers=${t2P2Registry.solvers.length}, T2 end-term questions=${endTermRegistry.solvers.length}, T3 GA1 questions=${t3Ga1Registry.solvers.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
