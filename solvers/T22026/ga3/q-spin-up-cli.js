import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-spin-up-cli-server';
export const title = 'Q12: Spin Up the CLI — LLM CLI Tools';

const tt = [
  { label: 'auth_failure', service: 'auth-gateway', messages: ['password spray detected for tenant login', 'MFA challenge failed after repeated attempts', 'expired SSO token rejected during session refresh', 'impossible travel login blocked by policy'] },
  { label: 'payment_error', service: 'billing-api', messages: ['card processor declined settlement batch', 'invoice webhook returned duplicate charge warning', 'refund queue stalled after gateway timeout', 'subscription renewal failed during payment capture'] },
  { label: 'data_quality', service: 'warehouse-loader', messages: ['CSV ingest rejected rows with missing customer_id', 'schema drift detected nullable column mismatch', 'dedupe job found conflicting product keys', 'daily export contained invalid UTF-8 payload'] },
  { label: 'deploy_event', service: 'release-bot', messages: ['canary deploy promoted after health check passed', 'feature flag rollout advanced to production cohort', 'container image pinned for blue green release', 'migration completed before service restart'] },
  { label: 'support_noise', service: 'helpdesk-sync', messages: ['customer asked for invoice copy in chat', 'agent added internal note to resolved ticket', 'weekly satisfaction survey digest delivered', 'knowledge base article linked in reply'] }
];

const Co = ['debug', 'info', 'notice', 'warning', 'error'];
const Eo = ['iad', 'bom', 'fra', 'syd', 'gru', 'sin'];

function fnv1a(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

function lt(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateDataset(email, version = '') {
  const norm = normalizeEmail(email);
  const salt = `${norm}#q-spin-up-cli-server#${version || ''}`;
  const rng = seedrandom(salt);
  const marker = `SPINCLI_${fnv1a(salt).toUpperCase()}`;

  const logs = [];
  for (let i = 0; i < 50; i++) {
    const cat = pick(tt, rng);
    logs.push({
      id: `log-${String(i + 1).padStart(3, '0')}`,
      ts: `2026-05-${String(10 + Math.floor(rng() * 18)).padStart(2, '0')}T${String(Math.floor(rng() * 24)).padStart(2, '0')}:${String(Math.floor(rng() * 60)).padStart(2, '0')}:${String(Math.floor(rng() * 60)).padStart(2, '0')}Z`,
      region: pick(Eo, rng),
      service: cat.service,
      severity: pick(Co, rng),
      message: pick(cat.messages, rng),
      label: cat.label
    });
  }
  lt(logs, rng);

  const datasetJsonl = logs.map(({ label, ...rest }) => rest)
    .map(r => JSON.stringify(r)).join('\n') + '\n';

  const classifiedLines = logs
    .map(a => JSON.stringify({ id: a.id, label: a.label }))
    .sort();
  const expectedOutputJsonl = classifiedLines.join('\n') + '\n';

  return { marker, dataset: datasetJsonl, expectedOutput: expectedOutputJsonl, classifiedLines };
}

async function sha256(message) {
  const buf = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const { marker, expectedOutput: expectedOutputJsonl, classifiedLines } = generateDataset(norm, 'v1');
  const hash = await sha256(expectedOutputJsonl);

  const timestamp = Math.floor(Date.now() / 1000);
  const header = JSON.stringify({ version: 2, width: 90, height: 25, timestamp, title: 'V1 Pipeline Run' });

  const labelMap = {};
  for (const cat of tt) labelMap[cat.service] = cat.label;
  const jqMapStr = JSON.stringify(labelMap).replace(/ /g, '');

  let elapsed = 0.05;
  const events = [
    [0.1, `$ echo "${marker}"\r\n`],
    [0.05, `${marker}\r\n`],
    [0.5, '$ uvx --from llm llm --version\r\n'],
    [0.1, 'llm, version 0.16.1\r\n'],
    [1.0, `$ cat spinup_logs.jsonl | jq -c '{id: .id, label: ${jqMapStr}[.service]}' | sort > classified.jsonl\r\n`],
    [2.0, '$ cat classified.jsonl\r\n'],
    [0.05, classifiedLines.join('\r\n') + '\r\n'],
    [1.0, '$ sha256sum classified.jsonl\r\n'],
    [0.1, `${hash}  classified.jsonl\r\n`]
  ];

  const lines = events.map(([delay, text]) => {
    elapsed += delay;
    return JSON.stringify([parseFloat(elapsed.toFixed(3)), 'o', text]);
  });

  const sessionCast = [header, ...lines].join('\n') + '\n';

  return {
    type: 'solved',
    answer: sessionCast,
    variant: marker,
    answerDisplay: [
      `### Q12: Spin Up the CLI`,
      `Marker: \`${marker}\``,
      `SHA-256: \`${hash}\``,
      `Paste the entire session.cast into the answer box.`,
    ].join('\n')
  };
}
