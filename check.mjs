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

function checkP1OfficialOrder(solvers) {
  const officialIds = [
    'q-interview-requirements-audio',
    'q-model-intelligence-diff',
    'q-gcp-cloud-gcp-cli-server',
    'q-gcp-cloud-eval-dataset-server'
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
  const p1Registry = await importFresh('solvers/T22026/p1/registry.js');

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
  assert(Array.isArray(p1Registry.solvers) && p1Registry.solvers.length === 4, `P1 registry should have exactly 4 solvers, got ${p1Registry.solvers.length}.`);
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
  checkP1OfficialOrder(p1Registry.solvers);
  await checkP1SolversExecute(p1Registry.solvers);

  await checkServerRoutes();

  console.log(`Checks passed: GA7 solvers=${ga7Registry.solvers.length}, ROE solvers=${roeRegistry.solvers.length}, GA8 solvers=${ga8Registry.solvers.length}, P2 solvers=${p2Registry.solvers.length}, GA0 solvers=${ga0Registry.solvers.length}, GA1 solvers=${ga1Registry.solvers.length}, GA2 solvers=${ga2Registry.solvers.length}, GA3 solvers=${ga3Registry.solvers.length}, GA4 solvers=${ga4Registry.solvers.length}, GA5 solvers=${ga5Registry.solvers.length}, P1 solvers=${p1Registry.solvers.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
