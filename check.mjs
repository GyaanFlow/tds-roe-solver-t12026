import fs from 'node:fs';
import path from 'node:path';
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
      ['/solvers/T12026/ga7/registry.js', 200],
      ['/solvers/T12026/ga8/registry.js', 200]
    ];

    for (const [pathname, expectedStatus] of checks) {
      const res = await fetch(`${serverUrl}${pathname}`);
      assert(res.status === expectedStatus, `Expected ${pathname} to return ${expectedStatus}, got ${res.status}.`);
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
    '24f2004141@ds.study.iitm.ac.in'
  ];
  const lockedEmails = [
    'random_student@ds.study.iitm.ac.in',
    'other_user@gmail.com'
  ];
  const sessionToken = 'quiz_sign_mock_token_1234';

  // 1. Whitelisted emails get full solved diagnostic notes
  for (const email of whitelistedEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email, sessionToken);
      assert(result && typeof result === 'object', `T2 P2 ${solver.id} returned non-object.`);
      assert(typeof result.answer === 'string', `T2 P2 ${solver.id} answer must be string.`);
      assert(result.answer.length >= 150, `T2 P2 ${solver.id} answer too short: ${result.answer.length}`);
      assert(result.answer.length <= 6000, `T2 P2 ${solver.id} answer exceeds max length: ${result.answer.length}`);
      assert(result.type === 'solved', `T2 P2 ${solver.id} should be solved for whitelisted email, got ${result.type}`);

      // Determinism
      const result2 = await solver.solve(email, sessionToken);
      assert(result.answer === result2.answer, `T2 P2 ${solver.id} non-deterministic for same email.`);
    }
  }

  // 2. Non-whitelisted emails get locked access restriction
  for (const email of lockedEmails) {
    for (const solver of solvers) {
      const result = await solver.solve(email, sessionToken);
      assert(result.debug && result.debug.locked === true, `T2 P2 ${solver.id} should be locked for ${email}`);
      assert(result.variant === 'Locked', `T2 P2 ${solver.id} should show Locked variant`);
    }
  }

  // 3. Uniqueness across different whitelisted emails
  for (const solver of solvers) {
    const res1 = await solver.solve(whitelistedEmails[0], sessionToken);
    const res2 = await solver.solve(whitelistedEmails[1], sessionToken);
    const res3 = await solver.solve(whitelistedEmails[2], sessionToken);
    const res4 = await solver.solve(whitelistedEmails[3], sessionToken);
    assert(res1.answer !== res2.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 2.`);
    assert(res1.answer !== res3.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 3.`);
    assert(res2.answer !== res3.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 2 and 3.`);
    assert(res1.answer !== res4.answer, `T2 P2 ${solver.id} produced duplicate identical answer across email 1 and 4.`);
  }

  // 4. Rubric contract: runtime must validate every generated note and expose the report.
  for (const solver of solvers) {
    const result = await solver.solve(whitelistedEmails[0], sessionToken);
    assert(result.debug && result.debug.rubric, `T2 P2 ${solver.id} did not expose debug.rubric — runtime rubric enforcement is missing.`);
    assert(result.debug.rubric.valid === true, `T2 P2 ${solver.id} generated a note that fails its own rubric contract: ${(result.debug.rubric.errors || []).join('; ')}`);
    assert(result.variant !== 'Rubric Contract Failed', `T2 P2 ${solver.id} withheld its note for failing the rubric contract.`);
  }

  // 5. Blank/missing email must be refused, never answered with a seeded-but-identical note.
  //    (Same bug class as the GA7 requireEmail fix: the RNG seed IS the email.)
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

  // 6. Scaled uniqueness + citation-density contract across many synthetic students.
  //    Guards two real regressions: (a) a case whose variation pool is too small collides across
  //    students (Case 2A once produced ONE note for every student), and (b) case-specs keyEntities
  //    drifting out of sync with generator text, silently tanking citation density on most seeds.
  {
    const { lockConfig } = await importShared('solvers/T22026/p2/lock-config.js');
    const { CASE_SPECS } = await importFresh('solvers/T22026/p2/case-specs.js');
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
          assert(minEntityHits >= required, `T2 P2 ${solver.id} worst-case citation density is ${minEntityHits}/${spec.keyEntities.length}, below the ${required} the rubric coach requires — case-specs keyEntities are out of sync with the generator text.`);
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

async function main() {
  installBrowserStubs();

  assert(fs.existsSync(path.join(rootDir, 'index.html')), 'Missing index.html.');
  assert(fs.existsSync(path.join(rootDir, 'style.css')), 'Missing style.css.');
  assert(fs.existsSync(path.join(rootDir, 'ga7-verify.html')), 'Missing ga7-verify.html.');

  await importFresh('app.js');
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

  await checkServerRoutes();

  console.log(`Checks passed: GA7 solvers=${ga7Registry.solvers.length}, ROE solvers=${roeRegistry.solvers.length}, GA8 solvers=${ga8Registry.solvers.length}, P2 solvers=${p2Registry.solvers.length}, GA0 solvers=${ga0Registry.solvers.length}, GA1 solvers=${ga1Registry.solvers.length}, GA2 solvers=${ga2Registry.solvers.length}, GA3 solvers=${ga3Registry.solvers.length}, GA4 solvers=${ga4Registry.solvers.length}, GA5 solvers=${ga5Registry.solvers.length}, GA6 solvers=${ga6Registry.solvers.length}, P1 solvers=${p1Registry.solvers.length}, T2 GA8 solvers=${t2Ga8Registry.solvers.length}, T2 P2 solvers=${t2P2Registry.solvers.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
