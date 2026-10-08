import { normalizeEmail, trimEmail, rng, sha256 } from './utils.js';

export async function makeHttpieRequest(email) {
  const studentEmail = trimEmail(email);
  const random = rng(`${studentEmail}#q-uv-http-post`);
  const hex = '0123456789abcdef';
  let requestId = '';
  for (let i = 0; i < 8; i += 1) requestId += hex[Math.floor(random() * hex.length)];
  return { email: studentEmail, requestId };
}

function makePrettierInput(email) {
  const random = rng(`${trimEmail(email)}#q-npx-prettier`);
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomText = Array.from({ length: 300 }, () => {
    const value = random();
    if (value < 0.8) return alphabet[Math.floor((value / 0.8) * alphabet.length)];
    if (value < 0.99) return ' ';
    return '\n';
  }).join('');
  const base = [
    '#  Badly  Formatted  Markdown    ',
    '',
    '*  This is an uneven list',
    '* With inconsistent spacing',
    '   *    And weird indentation',
    '',
    '>This quote has no space',
    '>   This one has too many',
    '',
  ].join('\n');
  return `${base}\n${randomText}`;
}

let prettierModulesPromise;

function loadPrettierModules() {
  if (!prettierModulesPromise) {
    let timeoutId;
    const imports = Promise.all([
      import('https://cdn.jsdelivr.net/npm/prettier@3.4.2/+esm'),
      import('https://cdn.jsdelivr.net/npm/prettier@3.4.2/plugins/markdown.mjs'),
    ]);
    const timeout = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Prettier CDN load timed out after 12 seconds.')), 12000);
    });
    prettierModulesPromise = Promise.race([imports, timeout])
      .finally(() => clearTimeout(timeoutId))
      .catch((error) => {
        prettierModulesPromise = null;
        throw error;
      });
  }
  return prettierModulesPromise;
}

export async function solvePrettierHash(email) {
  const source = makePrettierInput(email);
  try {
    const [{ format }, { default: markdownPlugin }] = await loadPrettierModules();
    const formatted = await format(source, { parser: 'markdown', plugins: [markdownPlugin] });
    return { hash: await sha256(formatted), sourceBytes: new TextEncoder().encode(source).length };
  } catch (error) {
    return { error: `Pinned Prettier 3.4.2 could not load: ${error.message}` };
  }
}

const JSON_SCENARIOS = [
  { title: 'Fix Corrupted Configuration Export', context: 'application configuration', dataType: 'configuration settings' },
  { title: 'Repair Malformed API Response', context: 'API integration', dataType: 'API records' },
  { title: 'Fix Broken Database Export', context: 'data migration', dataType: 'database records' },
  { title: 'Repair Corrupted Log Export', context: 'log analysis', dataType: 'log entries' },
];

export function makeCorrectedJson(email) {
  const random = rng(`${trimEmail(email)}#q-broken-json-server`);
  const scenario = JSON_SCENARIOS[Math.floor(random() * JSON_SCENARIOS.length)];
  const records = [];
  const categories = ['alpha', 'beta', 'gamma', 'delta'];
  const sources = ['system_a', 'system_b', 'system_c'];

  for (let index = 0; index < 300; index += 1) {
    records.push({
      id: `record_${String(index).padStart(5, '0')}`,
      name: `Entry ${index}`,
      value: Math.floor(random() * 10000),
      status: random() < 0.5 ? 'active' : 'inactive',
      category: categories[Math.floor(random() * categories.length)],
      timestamp: `2024-${String(Math.floor(random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(random() * 24)).padStart(2, '0')}:${String(Math.floor(random() * 60)).padStart(2, '0')}:00Z`,
      metadata: {
        source: sources[Math.floor(random() * sources.length)],
        priority: Math.floor(random() * 5) + 1,
        tags: ['tag1', 'tag2', 'tag3'].slice(0, Math.floor(random() * 3) + 1),
      },
      description: `This is a sample ${scenario.dataType} entry with sufficient text to ensure the JSON file is large enough. `.repeat(3),
    });
  }
  return { scenario, json: JSON.stringify(records, null, 2), recordCount: records.length };
}

const FILE_SCENARIOS = [
  { name: 'documentation_cleanup', title: 'Documentation Repository Reorganization', context: 'technical documentation' },
  { name: 'archive_migration', title: 'Legacy Archive Migration', context: 'historical archives' },
  { name: 'content_management', title: 'Content Management System Refactoring', context: 'content files' },
  { name: 'knowledge_base', title: 'Knowledge Base Reorganization', context: 'knowledge articles' },
];
const FILE_CATEGORIES = ['documentation', 'reports', 'notes', 'configs', 'data', 'logs', 'scripts', 'templates', 'resources', 'archives'];
const FILE_TAGS = ['résumé', 'naïve-bayes', '日本語', 'münchen', 'café'];

function compareCodePointOrder(left, right) {
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    if (left.charCodeAt(index) !== right.charCodeAt(index)) return left.charCodeAt(index) - right.charCodeAt(index);
  }
  return left.length - right.length;
}

export async function makeFileReorganization(email) {
  const random = rng(`${trimEmail(email)}#q-rename-files-server`);
  const scenario = FILE_SCENARIOS[Math.floor(random() * FILE_SCENARIOS.length)];
  const directories = ['docs', 'content', 'archive', 'project'];
  const sections = ['chapter1', 'section-a', 'part 2', 'módulo-3', '2024'];
  const leafFolders = ['intro', 'advanced', 'appendix', 'données', 'références'];
  const files = [];

  for (let index = 0; index < 30; index += 1) {
    const depth = 1 + Math.floor(random() * 3);
    const parts = [directories[Math.floor(random() * directories.length)]];
    if (depth >= 2) parts.push(sections[Math.floor(random() * sections.length)]);
    if (depth >= 3) parts.push(leafFolders[Math.floor(random() * leafFolders.length)]);
    if (random() < 0.2) {
      const special = ['spaces here', 'file-name', 'naïve', 'café-2024', 'test_file'];
      parts.push(special[Math.floor(random() * special.length)]);
    }
    const filename = `file${String(index + 1).padStart(2, '0')}.txt`;
    const path = [...parts, random() < 0.1 ? filename.replace('i', 'і') : filename].join('/');
    const category = random() < 0.3 && FILE_TAGS.length
      ? FILE_TAGS[Math.floor(random() * FILE_TAGS.length)]
      : FILE_CATEGORIES[Math.floor(random() * FILE_CATEGORIES.length)];
    files.push({ path, category });
  }

  const expectedFiles = files.map(({ path, category }) => {
    const parts = path.split('/');
    const filename = parts.at(-1);
    const parent = parts.slice(0, -1).join('-');
    return `${category}/${parent ? `${parent}-` : ''}${filename}`;
  }).sort(compareCodePointOrder);
  const fileList = `${expectedFiles.map((file) => `./${file}`).join('\n')}\n`;
  return { scenario, files, expectedFiles, hash: await sha256(fileList) };
}

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const PRODUCTS = ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Headset'];

export function makeCsvRevenue(email) {
  const random = rng(`${trimEmail(email)}#q-csv-sales-analysis-server`);
  const targetCity = CITIES[Math.floor(random() * CITIES.length)];
  const targetMonth = MONTHS[Math.floor(random() * MONTHS.length)];
  const rowCount = 100 + Math.floor(random() * 50);
  let revenue = 0;

  for (let index = 0; index < rowCount; index += 1) {
    const month = MONTHS[Math.floor(random() * MONTHS.length)];
    Math.floor(random() * 28) + 1;
    const city = CITIES[Math.floor(random() * CITIES.length)];
    Math.floor(random() * PRODUCTS.length);
    const quantity = Math.floor(random() * 10) + 1;
    const price = (Math.floor(random() * 50000) + 10000) / 100;
    if (city === targetCity && month === targetMonth) revenue += quantity * price;
  }
  return { targetCity, targetMonth, rowCount, revenue: Math.round(revenue) };
}

const VECTOR_SEED = 'tds-2026-05-ga3-cosine-sim-client-v1';
const TOPICS = {
  ML: ['neural', 'gradient', 'backprop', 'loss', 'epoch', 'batch', 'model', 'train', 'feature', 'weight', 'activation', 'layer', 'dropout', 'learning', 'inference', 'embedding', 'transformer', 'attention'],
  DATA: ['query', 'database', 'index', 'schema', 'table', 'row', 'column', 'join', 'aggregate', 'filter', 'pipeline', 'etl', 'warehouse', 'stream', 'batch', 'partition', 'shard', 'replica'],
  WEB: ['http', 'request', 'response', 'cache', 'cookie', 'session', 'token', 'api', 'endpoint', 'rest', 'graphql', 'websocket', 'latency', 'throughput', 'bandwidth', 'proxy', 'cdn', 'tls'],
  MATH: ['vector', 'matrix', 'eigenvalue', 'integral', 'derivative', 'probability', 'distribution', 'variance', 'covariance', 'correlation', 'regression', 'hypothesis', 'bayes', 'entropy', 'gradient', 'manifold'],
  CLOUD: ['container', 'kubernetes', 'docker', 'pod', 'service', 'deployment', 'scaling', 'ingress', 'node', 'cluster', 'autoscale', 'loadbalancer', 'microservice', 'serverless', 'function', 'bucket', 'volume'],
};

function normalSample(random) {
  let first = 0;
  let second = 0;
  while (first === 0) first = random();
  while (second === 0) second = random();
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

function unitVector(random, dimensions) {
  const vector = Array.from({ length: dimensions }, () => normalSample(random));
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return vector.map((value) => value / magnitude);
}

function noisyVector(random, base, dimensions) {
  const noise = unitVector(random, dimensions);
  const vector = base.map((value, index) => value * 0.85 + noise[index] * 0.15);
  const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  return vector.map((value) => value / magnitude);
}

export function makeCosineSearchAnswer(email) {
  const random = rng(`${VECTOR_SEED}#${normalizeEmail(email)}#`);
  const topics = Object.keys(TOPICS);
  const dimensions = 64;
  const topicVectors = Object.fromEntries(topics.map((topic) => [topic, unitVector(random, dimensions)]));
  const documents = [];
  for (let index = 0; index < 250; index += 1) {
    const topic = topics[index % topics.length];
    const embedding = noisyVector(random, topicVectors[topic], dimensions);
    const words = Array.from({ length: 4 }, () => TOPICS[topic][Math.floor(random() * TOPICS[topic].length)]);
    documents.push({ id: `D${String(index + 1).padStart(6, '0')}`, embedding });
  }

  const answer = {};
  for (let index = 0; index < 10; index += 1) {
    const topic = topics[index % topics.length];
    const query = noisyVector(random, topicVectors[topic], dimensions);
    Array.from({ length: 3 }, () => TOPICS[topic][Math.floor(random() * TOPICS[topic].length)]);
    const ranked = documents.map((document) => ({
      id: document.id,
      score: document.embedding.reduce((sum, value, dimension) => sum + value * query[dimension], 0),
    })).sort((left, right) => right.score - left.score || compareCodePointOrder(left.id, right.id));
    answer[`Q${String(index + 1).padStart(3, '0')}`] = ranked.slice(0, 5).map(({ id }) => id);
  }
  return answer;
}
