// Backup / offline method for Q2 — Unicode Doppelganger Ledger Forensics.
//
// Use this ONLY if the interactive in-browser solver on the ROE Q2 guide fails to load or run.
// Exact same algorithm as the browser tool, ported to a plain Node.js CLI script with no DOM
// dependency — same guardrails (throws instead of guessing on missing ignorable/confusable
// tables or non-integer amounts).
//
// Usage:
//   node q2-unicode-ledger.offline.mjs path/to/your-questionData-artifact.json

import { readFileSync } from 'node:fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node q2-unicode-ledger.offline.mjs <artifact.json>');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(filePath, 'utf8'));
} catch (err) {
  console.error(`Could not read/parse ${filePath}: ${err.message}`);
  process.exit(1);
}

function fail(msg) { console.error(msg); process.exit(1); }

function fnv1a32Hex(str) {
  const bytes = new TextEncoder().encode(str);
  let h = 2166136261;
  for (const b of bytes) h = Math.imul(h ^ b, 16777619);
  return 'fnv1a32:' + (h >>> 0).toString(16).padStart(8, '0');
}

function parseCodePoint(val) {
  if (typeof val === 'number') return String.fromCodePoint(val);
  const str = String(val).trim();
  if (/^U\+[0-9A-Fa-f]+$/i.test(str)) return String.fromCodePoint(parseInt(str.slice(2), 16));
  if (/^[0-9A-Fa-f]{4,6}$/i.test(str) && !isNaN(parseInt(str, 16))) return String.fromCodePoint(parseInt(str, 16));
  return str;
}

const events = data.events || data.ledger_events || data.transactions || (Array.isArray(data) ? data : []);
if (!Array.isArray(events) || events.length === 0) fail('No events array found in the provided JSON artifact.');

const rawIgnorable = data.default_ignorable || data.default_ignorable_scalars || data.ignorable;
if (!Array.isArray(rawIgnorable) || rawIgnorable.length === 0) {
  fail(
    'No default-ignorable scalar list found in the artifact (looked for "default_ignorable", ' +
    '"default_ignorable_scalars", "ignorable"). Artifact top-level keys seen: ' + Object.keys(data).join(', ')
  );
}
const ignorableSet = new Set(rawIgnorable.map(parseCodePoint));

const rawConfusableMap = data.confusable_map || data.confusables || data.confusableMap;
if (!rawConfusableMap || typeof rawConfusableMap !== 'object' || Object.keys(rawConfusableMap).length === 0) {
  fail(
    'No confusable map found in the artifact (looked for "confusable_map", "confusables", ' +
    '"confusableMap"). Artifact top-level keys seen: ' + Object.keys(data).join(', ')
  );
}
const confusableMap = {};
for (const [k, v] of Object.entries(rawConfusableMap)) confusableMap[parseCodePoint(k)] = parseCodePoint(v);

function canonicalize(str) {
  if (!str) return '';
  let s = String(str).normalize('NFKC').toLowerCase();
  s = [...s].filter(ch => !ignorableSet.has(ch)).join('');
  return [...s].map(ch => confusableMap[ch] ?? ch).join('');
}

const accountCanonicalMap = new Map();
const suspiciousAccounts = new Set();

events.forEach(evt => {
  const rawAcct = evt.account_id || evt.handle || evt.user || evt.account;
  if (rawAcct) {
    const can = canonicalize(rawAcct);
    if (!accountCanonicalMap.has(can)) accountCanonicalMap.set(can, new Set());
    accountCanonicalMap.get(can).add(rawAcct);
  }
});
accountCanonicalMap.forEach(rawSet => { if (rawSet.size > 1) rawSet.forEach(raw => suspiciousAccounts.add(raw)); });
if (Array.isArray(data.suspicious_account_ids)) data.suspicious_account_ids.forEach(id => suspiciousAccounts.add(id));

const seenRawEvents = new Set();
const uniqueTransportEvents = [];
events.forEach(evt => {
  const repr = evt.event_id ? evt.event_id : JSON.stringify(evt);
  if (!seenRawEvents.has(repr)) { seenRawEvents.add(repr); uniqueTransportEvents.push(evt); }
});

const revisionGroups = new Map();
uniqueTransportEvents.forEach(evt => {
  const key = evt.transaction_key || evt.event_key || evt.business_key || evt.invoice_id || evt.id || evt.event_id;
  if (!revisionGroups.has(key)) revisionGroups.set(key, []);
  revisionGroups.get(key).push(evt);
});

const winningRevisions = [];
revisionGroups.forEach(group => {
  group.sort((a, b) => {
    const revA = Number(a.revision ?? a.sequence ?? 0);
    const revB = Number(b.revision ?? b.sequence ?? 0);
    if (revA !== revB) return revB - revA;
    const timeA = new Date(a.emitted_at || a.timestamp || 0).getTime();
    const timeB = new Date(b.emitted_at || b.timestamp || 0).getTime();
    if (timeA !== timeB) return timeB - timeA;
    return String(b.event_id || '').localeCompare(String(a.event_id || ''));
  });
  winningRevisions.push(group[0]);
});

const eligibleEvents = winningRevisions.filter(evt => {
  if (evt.eligible === false) return false;
  if (evt.status && ['VOID', 'REJECTED', 'DELETED', 'DRAFT'].includes(String(evt.status).toUpperCase())) return false;
  if (evt.operation && String(evt.operation).toUpperCase() === 'DELETE') return false;
  return true;
});

const canonicalBusinessKeysSeen = new Set();
const acceptedEvents = [];
eligibleEvents.forEach(evt => {
  const rawKey = evt.business_key || evt.transaction_key || evt.event_key || evt.event_id;
  const canKey = canonicalize(rawKey);
  if (!canonicalBusinessKeysSeen.has(canKey)) { canonicalBusinessKeysSeen.add(canKey); acceptedEvents.push(evt); }
});

let netMinor = 0n;
acceptedEvents.forEach((evt, idx) => {
  const raw = evt.amount_minor ?? evt.amount ?? evt.minor_units ?? evt.net_minor;
  const evtLabel = evt.event_id || evt.id || `#${idx}`;
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    fail(`Event ${evtLabel} has no amount (looked for "amount_minor", "amount", "minor_units", "net_minor"). Keys: ${Object.keys(evt).join(', ')}`);
  }
  const s = String(raw).trim();
  if (!/^[+-]?\d+$/.test(s)) {
    fail(`Event ${evtLabel} has a non-integer amount ${JSON.stringify(s)}. Amounts must be signed minor units (whole numbers).`);
  }
  netMinor += BigInt(s);
});

const acceptedEventIds = acceptedEvents.map(e => String(e.event_id || e.id)).filter(Boolean);
const suspiciousAccountIds = Array.from(suspiciousAccounts);

const digestInput = data.digest_template
  ? data.digest_template.replace('{accepted}', acceptedEventIds.slice().sort().join(',')).replace('{net}', netMinor.toString())
  : `${acceptedEventIds.slice().sort().join(',')}:${netMinor.toString()}`;

const evidenceDigest = fnv1a32Hex(digestInput);

console.log(JSON.stringify({
  suspicious_account_ids: suspiciousAccountIds,
  accepted_event_ids: acceptedEventIds,
  net_minor_units: netMinor.toString(),
  evidence_digest: evidenceDigest
}, null, 2));
