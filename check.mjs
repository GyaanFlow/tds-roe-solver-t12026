import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

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

  if (typeof Math.seedrandom !== 'function') {
    Math.seedrandom = (seed = '') => {
      let state = 2166136261 >>> 0;
      for (const char of String(seed)) {
        state ^= char.charCodeAt(0);
        state = Math.imul(state, 16777619) >>> 0;
      }
      return () => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return state / 4294967296;
      };
    };
  }
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
      ['/solvers/ga7/registry.js', 200]
    ];

    for (const [pathname, expectedStatus] of checks) {
      const res = await fetch(`${serverUrl}${pathname}`);
      assert(res.status === expectedStatus, `Expected ${pathname} to return ${expectedStatus}, got ${res.status}.`);
    }

  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function main() {
  installBrowserStubs();

  assert(fs.existsSync(path.join(rootDir, 'index.html')), 'Missing index.html.');
  assert(fs.existsSync(path.join(rootDir, 'style.css')), 'Missing style.css.');
  assert(fs.existsSync(path.join(rootDir, 'ga7-verify.html')), 'Missing ga7-verify.html.');

  await importFresh('app.js');
  await importFresh('ga7-verify.js');

  const ga7Registry = await importFresh('solvers/ga7/registry.js');
  const roeRegistry = await importFresh('solvers/roe/registry.js');

  assert(Array.isArray(ga7Registry.solvers) && ga7Registry.solvers.length > 0, 'GA7 registry did not load solvers.');
  assert(Array.isArray(roeRegistry.solvers) && roeRegistry.solvers.length > 0, 'ROE registry did not load solvers.');

  await checkServerRoutes();

  console.log(`Checks passed: GA7 solvers=${ga7Registry.solvers.length}, ROE solvers=${roeRegistry.solvers.length}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
