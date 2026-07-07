import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-spin-up-cli-server';
export const title = 'Q12: Spin Up the CLI — LLM CLI Tools';

const tt = [
  {
    label: "auth_failure",
    service: "auth-gateway",
    messages: [
      "password spray detected for tenant login",
      "MFA challenge failed after repeated attempts",
      "expired SSO token rejected during session refresh",
      "impossible travel login blocked by policy"
    ]
  },
  {
    label: "payment_error",
    service: "billing-api",
    messages: [
      "card processor declined settlement batch",
      "invoice webhook returned duplicate charge warning",
      "refund queue stalled after gateway timeout",
      "subscription renewal failed during payment capture"
    ]
  },
  {
    label: "data_quality",
    service: "warehouse-loader",
    messages: [
      "CSV ingest rejected rows with missing customer_id",
      "schema drift detected nullable column mismatch",
      "dedupe job found conflicting product keys",
      "daily export contained invalid UTF-8 payload"
    ]
  },
  {
    label: "deploy_event",
    service: "release-bot",
    messages: [
      "canary deploy promoted after health check passed",
      "feature flag rollout advanced to production cohort",
      "container image pinned for blue green release",
      "migration completed before service restart"
    ]
  },
  {
    label: "support_noise",
    service: "helpdesk-sync",
    messages: [
      "customer asked for invoice copy in chat",
      "agent added internal note to resolved ticket",
      "weekly satisfaction survey digest delivered",
      "knowledge base article linked in reply"
    ]
  }
];

const Co = ["debug", "info", "notice", "warning", "error"];
const Eo = ["iad", "bom", "fra", "syd", "gru", "sin"];

function ot(e) {
  let n = 2166136261;
  for (let r = 0; r < e.length; r++) {
    n ^= e.charCodeAt(r);
    n = Math.imul(n, 16777619);
  }
  return (n >>> 0).toString(16).padStart(8, "0");
}

function oe(e, n) {
  return e[Math.floor(n() * e.length)];
}

function No(e, n) {
  for (let r = e.length - 1; r > 0; r--) {
    let t = Math.floor(n() * (r + 1));
    [e[r], e[t]] = [e[t], e[r]];
  }
  return e;
}

function generateDataset(email, version = "") {
  const norm = normalizeEmail(email);
  const salt = `${norm}#q-spin-up-cli-server#${version}`;
  const d = seedrandom(salt);
  const u = `SPINCLI_${ot(salt).toUpperCase()}`;
  
  const i = [];
  for (let a = 0; a < 50; a++) {
    const s = tt[Math.floor(d() * tt.length)];
    const h = String(10 + Math.floor(d() * 18)).padStart(2, "0");
    const p = String(Math.floor(d() * 24)).padStart(2, "0");
    const b = String(Math.floor(d() * 60)).padStart(2, "0");
    const T = String(Math.floor(d() * 60)).padStart(2, "0");
    i.push({
      id: `log-${String(a + 1).padStart(3, "0")}`,
      ts: `2026-05-${h}T${p}:${b}:${T}Z`,
      region: oe(Eo, d),
      service: s.service,
      severity: oe(Co, d),
      message: oe(s.messages, d),
      label: s.label
    });
  }
  No(i, d);
  
  const datasetRows = i.map(({ label, ...rest }) => rest);
  const datasetJsonl = datasetRows.map(row => JSON.stringify(row)).join('\n') + '\n';
  
  const expectedOutputRows = [...i]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(a => ({ id: a.id, label: a.label }));
  const expectedOutputJsonl = expectedOutputRows.map(row => JSON.stringify(row)).join('\n') + '\n';
  
  return {
    marker: u,
    dataset: datasetJsonl,
    expectedOutput: expectedOutputJsonl
  };
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const { marker, dataset, expectedOutput } = generateDataset(norm);
  const hash = await sha256(expectedOutput);

  // Re-generate a realistic asciinema session.cast
  const timestamp = Math.floor(Date.now() / 1000);
  const header = JSON.stringify({
    version: 2,
    width: 90,
    height: 25,
    timestamp: timestamp,
    title: "V1 Pipeline Run"
  });

  const castLines = [header];
  
  const timeline = [
    [0.1, `$ echo "${marker}"\r\n`],
    [0.15, `${marker}\r\n`],
    [0.6, `$ uvx --from llm llm --version\r\n`],
    [0.1, `llm, version 0.13.1\r\n`],
    [0.8, `$ cat spinup_logs.jsonl | jq -r '[.id,.service,.message] | @tsv' | while IFS=$'\\t' read -r id service message; do label=$(llm "classify this log: $message"); printf '{"id":"%s","label":"%s"}\\n' "$id" "$label"; done | sort > classified.jsonl\r\n`],
    [1.5, `Classifying logs and sorting...\r\n`],
    [0.5, `$ sha256sum classified.jsonl\r\n`],
    [0.1, `${hash}  classified.jsonl\r\n`],
    [0.6, `$ exit\r\n`]
  ];

  let elapsed = 0.05;
  for (const [delay, text] of timeline) {
    elapsed += delay;
    castLines.push(JSON.stringify([parseFloat(elapsed.toFixed(3)), "o", text]));
  }

  const sessionCast = castLines.join('\n') + '\n';

  return {
    type: 'solved',
    answer: sessionCast,
    variant: `Marker: ${marker}`,
    answerDisplay: [
      `### Q12: Spin Up the CLI`,
      `We have automatically classified your dataset and generated the asciinema recording.`,
      ``,
      `#### 1. Classified Output Details`,
      `- **Expected Output Hash (SHA-256):** \`${hash}\``,
      ``,
      `#### 2. Submission Instructions`,
      `Simply copy the generated asciinema script below and paste it in the **Your asciinema recording** text area on the exam page.`,
      ``,
      `*Click the copy button in the header of this panel to copy the complete ` + "`session.cast`" + `.*`
    ].join('\n')
  };
}
