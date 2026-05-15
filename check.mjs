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

  assert(Array.isArray(ga7Registry.solvers) && ga7Registry.solvers.length > 0, 'GA7 registry did not load solvers.');
  assert(Array.isArray(roeRegistry.solvers) && roeRegistry.solvers.length > 0, 'ROE registry did not load solvers.');
  assert(Array.isArray(ga8Registry.solvers) && ga8Registry.solvers.length > 0, 'GA8 registry did not load solvers.');
  assert(Array.isArray(p2Registry.solvers) && p2Registry.solvers.length === 2, 'P2 registry should have exactly 2 solvers (Q3 + Q4).');
  assert(Array.isArray(ga0Registry.solvers) && ga0Registry.solvers.length === 25, `GA0 registry should have exactly 25 solvers, got ${ga0Registry.solvers.length}.`);
  await checkGa8OfficialParity(ga8Registry.solvers);
  checkGa0OfficialOrder(ga0Registry.solvers);
  await checkGa0SolversExecute(ga0Registry.solvers);

  await checkServerRoutes();

  console.log(`Checks passed: GA7 solvers=${ga7Registry.solvers.length}, ROE solvers=${roeRegistry.solvers.length}, GA8 solvers=${ga8Registry.solvers.length}, P2 solvers=${p2Registry.solvers.length}, GA0 solvers=${ga0Registry.solvers.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
