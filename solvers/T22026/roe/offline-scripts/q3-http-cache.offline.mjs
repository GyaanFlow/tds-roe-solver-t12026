// Backup / offline method for Q3 — HTTP Cache Time Machine: Reconstruct the Shared Cache.
//
// Use this ONLY if the interactive in-browser solver on the ROE Q3 guide fails to load or run.
// Exact same TDS-RFC9111-SUBSET-1 simulation as the browser tool, ported to a plain Node.js CLI
// script with no DOM dependency — including the probe_request_ids ordering fix (deliveries must
// come out in that listed order, not trace order).
//
// Usage:
//   node q3-http-cache.offline.mjs path/to/your-questionData-artifact.json

import { readFileSync } from 'node:fs';

process.on('uncaughtException', (err) => {
  console.error(`Unexpected error while processing the artifact: ${err.message}`);
  process.exit(1);
});

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node q3-http-cache.offline.mjs <artifact.json>');
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

function parseCacheControl(ccHeader) {
  if (!ccHeader) return {};
  const res = {};
  const parts = String(ccHeader).split(',').map(s => s.trim());
  for (const p of parts) {
    const [k, v] = p.split('=').map(s => s.trim());
    if (k) res[k.toLowerCase()] = v ? (isNaN(Number(v)) ? v : Number(v)) : true;
  }
  return res;
}

function normalizeHeaders(headersObj) {
  const res = {};
  if (!headersObj) return res;
  if (typeof headersObj === 'string') {
    const lines = headersObj.split('\n');
    for (const line of lines) {
      const idx = line.indexOf(':');
      if (idx > 0) res[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    }
    return res;
  }
  for (const [k, v] of Object.entries(headersObj)) res[String(k).toLowerCase()] = String(v);
  return res;
}

const schedule = data.origin_schedule || data.schedule || data.originSchedule || [];
const trace = data.request_trace || data.requests || data.trace || [];
const probeIds = data.probe_request_ids || data.probes || data.probe_ids || [];

if (!Array.isArray(trace) || trace.length === 0) fail('No request_trace found in JSON artifact.');

let storedEntries = [];
let originRequestCount = 0;
const deliveryById = new Map();

function getOriginRow(uri, t) {
  const matching = schedule.filter(row => row.uri === uri && Number(row.effective_at) <= Number(t));
  if (matching.length === 0) return null;
  matching.sort((a, b) => Number(b.effective_at) - Number(a.effective_at));
  return matching[0];
}
function entryStoredAt(e) { return Number(e.stored_at); }
function entryFreshnessLifetime(e) { return Number(e.freshness_lifetime); }

for (const req of trace) {
  const reqId = req.request_id || req.id;
  const method = (req.method || 'GET').toUpperCase();
  const uri = req.uri;
  const t = Number(req.time ?? req.t ?? req.timestamp ?? 0);
  const reqHeaders = normalizeHeaders(req.headers);

  if (method !== 'GET') {
    originRequestCount++;
    storedEntries = storedEntries.filter(entry => entry.uri !== uri);
    continue;
  }

  const reqCc = parseCacheControl(reqHeaders['cache-control']);
  const reqHasNoCache = Boolean(reqCc['no-cache']);

  let matchingEntryIndex = -1;
  for (let i = 0; i < storedEntries.length; i++) {
    const entry = storedEntries[i];
    if (entry.uri !== uri) continue;
    let matchesVary = true;
    for (const [varName, varVal] of entry.vary_values) {
      const reqVal = reqHeaders[varName.toLowerCase()] ?? '';
      if (String(reqVal) !== String(varVal)) { matchesVary = false; break; }
    }
    if (matchesVary) { matchingEntryIndex = i; break; }
  }

  const matchedEntry = matchingEntryIndex >= 0 ? storedEntries[matchingEntryIndex] : null;

  let isFresh = false;
  if (matchedEntry) {
    const age = t - entryStoredAt(matchedEntry);
    const lifetime = entryFreshnessLifetime(matchedEntry);
    isFresh = age < lifetime;
  }

  let deliveredBodyVersion = null;
  let deliverySource = null;

  if (matchedEntry && isFresh && !reqHasNoCache) {
    deliveredBodyVersion = matchedEntry.body_version;
    deliverySource = 'cache';
  } else {
    originRequestCount++;
    const originRow = getOriginRow(uri, t);
    if (!originRow) fail(`No origin row found for URI ${uri} at t=${t}`);

    const originEtag = originRow.etag;
    const cachedEtag = matchedEntry ? matchedEntry.etag : null;

    const originRowHeaders = normalizeHeaders(originRow.headers);
    const originCc = parseCacheControl(originRowHeaders['cache-control'] || originRow.cache_control);

    if (matchedEntry && cachedEtag && originEtag && cachedEtag === originEtag) {
      deliveredBodyVersion = matchedEntry.body_version;
      deliverySource = 'origin-304';
      const freshLifetime = Number(originCc['s-maxage'] ?? originCc['max-age'] ?? 0);
      matchedEntry.stored_at = t;
      matchedEntry.etag = originEtag;
      matchedEntry.freshness_lifetime = freshLifetime;
    } else {
      deliveredBodyVersion = originRow.body_version || originRow.version || originRow.body;
      deliverySource = 'origin-200';
      if (matchingEntryIndex >= 0) storedEntries.splice(matchingEntryIndex, 1);

      const isNoStore = Boolean(originCc['no-store']);
      const isPrivate = Boolean(originCc['private']);
      const hasExplicitLifetime = ('s-maxage' in originCc) || ('max-age' in originCc);

      if (!isNoStore && !isPrivate && hasExplicitLifetime) {
        const freshnessLifetime = Number(originCc['s-maxage'] ?? originCc['max-age'] ?? 0);
        const varyHeader = originRowHeaders['vary'] || originRow.vary || '';
        const varyNames = varyHeader.split(',').map(s => s.trim()).filter(Boolean);
        const varyValues = varyNames.map(n => [n.toLowerCase(), reqHeaders[n.toLowerCase()] ?? '']);

        storedEntries.push({
          uri,
          vary_values: varyValues,
          body_version: deliveredBodyVersion,
          etag: originEtag,
          stored_at: t,
          freshness_lifetime: freshnessLifetime
        });
      }
    }
  }

  deliveryById.set(reqId, { request_id: reqId, body_version: deliveredBodyVersion, source: deliverySource });
}

let effectiveProbeIds = Array.isArray(probeIds) ? probeIds.filter(Boolean) : [];
if (effectiveProbeIds.length === 0) {
  effectiveProbeIds = trace.filter(r => r.is_probe).map(r => r.request_id || r.id).filter(Boolean);
}
if (effectiveProbeIds.length === 0) {
  fail(
    'No probe request ids found. Expected a "probe_request_ids" array (or per-request "is_probe" flags) ' +
    'in the artifact. Artifact top-level keys seen: ' + Object.keys(data).join(', ')
  );
}
const missingProbes = effectiveProbeIds.filter(id => !deliveryById.has(id));
if (missingProbes.length > 0) {
  fail(`These probe ids are listed but never appear as a GET in the request trace: ${missingProbes.join(', ')}.`);
}
const probeDeliveries = effectiveProbeIds.map(id => deliveryById.get(id));

storedEntries.sort((a, b) => {
  const keyA = a.uri + '\n' + a.vary_values.map(([n, v]) => n + ':' + v).join('\n');
  const keyB = b.uri + '\n' + b.vary_values.map(([n, v]) => n + ':' + v).join('\n');
  return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
});

const formattedEntries = storedEntries.map(e => ({
  uri: e.uri, vary_values: e.vary_values, body_version: e.body_version,
  etag: e.etag, stored_at: e.stored_at, freshness_lifetime: e.freshness_lifetime
}));

const finalDigest = fnv1a32Hex(JSON.stringify(formattedEntries));

console.log(JSON.stringify({
  probe_deliveries: probeDeliveries,
  origin_request_count: originRequestCount,
  final_cache_digest: finalDigest
}, null, 2));
