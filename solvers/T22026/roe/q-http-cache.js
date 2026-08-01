// Solver: ROE T2 2026 Q3 — HTTP Cache Time Machine
//
// Ultra-Advanced Interactive Direct Solver & Per-User Simulation Engine:
// Executes deterministic TDS-RFC9111-SUBSET-1 simulation over student's questionData trace.
import { normalizeEmail } from './utils.js';

export const id = 'q-http-cache-time-machine-server';
export const title = 'Q3: HTTP Cache Time Machine — Reconstruct the Shared Cache';

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash = Math.imul(hash ^ str.charCodeAt(i), 16777619);
  }
  return hash >>> 0;
}

function createRng(seedStr) {
  let s = hashString(seedStr);
  return function () {
    s = (s ^ (s << 13)) >>> 0;
    s = (s ^ (s >> 17)) >>> 0;
    s = (s ^ (s << 5)) >>> 0;
    return (s >>> 0) / 4294967296;
  };
}

function fnv1a32Hex(str) {
  const bytes = new TextEncoder().encode(str);
  let h = 2166136261;
  for (const b of bytes) {
    h = Math.imul(h ^ b, 16777619);
  }
  return 'fnv1a32:' + (h >>> 0).toString(16).padStart(8, '0');
}

function parseCacheControl(ccHeader) {
  if (!ccHeader) return {};
  const res = {};
  const parts = String(ccHeader).split(',').map(s => s.trim());
  for (const p of parts) {
    const [k, v] = p.split('=').map(s => s.trim());
    if (k) {
      res[k.toLowerCase()] = v ? (isNaN(Number(v)) ? v : Number(v)) : true;
    }
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
      if (idx > 0) {
        const k = line.slice(0, idx).trim().toLowerCase();
        const v = line.slice(idx + 1).trim();
        res[k] = v;
      }
    }
    return res;
  }
  for (const [k, v] of Object.entries(headersObj)) {
    res[String(k).toLowerCase()] = String(v);
  }
  return res;
}

function registerHttpCacheInteractive() {
  if (typeof window === 'undefined' || window._roeHttpCacheRegistered) return;
  window._roeHttpCacheRegistered = true;

  window._roeSolveHttpCache = function () {
    const rawInput = (document.getElementById('roeHcArtifactInput')?.value || '').trim();
    const statusEl = document.getElementById('roeHcStatus');
    const outEl = document.getElementById('roeHcOutput');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    if (!rawInput) {
      setStatus('Please paste your questionData JSON artifact from the exam page.', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }

    try {
      let data;
      try {
        data = JSON.parse(rawInput);
      } catch (err) {
        throw new Error('Invalid JSON format. Make sure you copy the complete JSON artifact from the questionData frame.');
      }

      const schedule = data.origin_schedule || data.schedule || data.originSchedule || [];
      const trace = data.request_trace || data.requests || data.trace || [];
      const probeIds = data.probe_request_ids || data.probes || data.probe_ids || [];

      if (!Array.isArray(trace) || trace.length === 0) {
        throw new Error('No request_trace found in JSON artifact.');
      }

      let storedEntries = [];
      let originRequestCount = 0;
      const probeDeliveries = [];

      function getOriginRow(uri, t) {
        const matching = schedule.filter(row => row.uri === uri && Number(row.effective_at) <= Number(t));
        if (matching.length === 0) return null;
        matching.sort((a, b) => Number(b.effective_at) - Number(a.effective_at));
        return matching[0];
      }

      for (const req of trace) {
        const reqId = req.request_id || req.id;
        const method = (req.method || 'GET').toUpperCase();
        const uri = req.uri;
        const t = Number(req.time ?? req.t ?? req.timestamp ?? 0);
        const reqHeaders = normalizeHeaders(req.headers);
        const isProbe = probeIds.includes(reqId) || req.is_probe;

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
            if (String(reqVal) !== String(varVal)) {
              matchesVary = false;
              break;
            }
          }
          if (matchesVary) {
            matchingEntryIndex = i;
            break;
          }
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
          if (!originRow) {
            throw new Error(`No origin row found for URI ${uri} at t=${t}`);
          }

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

            if (matchingEntryIndex >= 0) {
              storedEntries.splice(matchingEntryIndex, 1);
            }

            const isNoStore = Boolean(originCc['no-store']);
            const isPrivate = Boolean(originCc['private']);
            const hasExplicitLifetime = ('s-maxage' in originCc) || ('max-age' in originCc);

            if (!isNoStore && !isPrivate && hasExplicitLifetime) {
              const freshnessLifetime = Number(originCc['s-maxage'] ?? originCc['max-age'] ?? 0);
              
              const varyHeader = originRowHeaders['vary'] || originRow.vary || '';
              const varyNames = varyHeader.split(',').map(s => s.trim()).filter(Boolean);
              const varyValues = varyNames.map(n => [n.toLowerCase(), reqHeaders[n.toLowerCase()] ?? '']);

              const newEntry = {
                uri,
                vary_values: varyValues,
                body_version: deliveredBodyVersion,
                etag: originEtag,
                stored_at: t,
                freshness_lifetime: freshnessLifetime
              };

              storedEntries.push(newEntry);
            }
          }
        }

        if (isProbe) {
          probeDeliveries.push({
            request_id: reqId,
            body_version: deliveredBodyVersion,
            source: deliverySource
          });
        }
      }

      function entryStoredAt(e) { return Number(e.stored_at); }
      function entryFreshnessLifetime(e) { return Number(e.freshness_lifetime); }

      storedEntries.sort((a, b) => {
        const keyA = a.uri + '\n' + a.vary_values.map(([n, v]) => n + ':' + v).join('\n');
        const keyB = b.uri + '\n' + b.vary_values.map(([n, v]) => n + ':' + v).join('\n');
        return keyA < keyB ? -1 : keyA > keyB ? 1 : 0;
      });

      const formattedEntries = storedEntries.map(e => ({
        uri: e.uri,
        vary_values: e.vary_values,
        body_version: e.body_version,
        etag: e.etag,
        stored_at: e.stored_at,
        freshness_lifetime: e.freshness_lifetime
      }));

      const compactJson = JSON.stringify(formattedEntries);
      const finalDigest = fnv1a32Hex(compactJson);

      const resultObj = {
        probe_deliveries: probeDeliveries,
        origin_request_count: originRequestCount,
        final_cache_digest: finalDigest
      };

      outEl.value = JSON.stringify(resultObj, null, 2);
      setStatus(`Simulation complete! Probes: ${probeDeliveries.length}, Origin requests: ${originRequestCount}, Digest: ${finalDigest}`, '#198754');
    } catch (err) {
      setStatus(`Simulation failed: ${err.message}`, '#dc3545');
      if (outEl) outEl.value = '';
    }
  };

  window._roeCopyHcOutput = async function () {
    const el = document.getElementById('roeHcOutput');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const statusEl = document.getElementById('roeHcStatus');
      if (statusEl) statusEl.textContent = 'Copied certificate to clipboard!';
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerHttpCacheInteractive();
  const norm = normalizeEmail(email);
  const rng = createRng(`${norm}#q3-seed`);

  const sampleReqId = `R${String(Math.floor(rng() * 89 + 10)).padStart(2, '0')}`;
  const sampleOriginCount = Math.floor(rng() * 10 + 2);
  const sampleDigest = fnv1a32Hex(`${norm}:${sampleOriginCount}`);

  const summary = [
    `Interactive HTTP Cache Time Machine Solver for ${norm}.`,
    `Paste your questionData JSON trace below to execute deterministic TDS-RFC9111-SUBSET-1`,
    `simulation and calculate probe deliveries, origin request count, and final cache FNV-1a digest for ${norm}.`
  ].join(' ');

  const guide = [
    `## Q3 — HTTP Cache Time Machine (for ${norm})`,
    ``,
    `### ⚡ Dynamic Interactive Direct Solver (Unique for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#07111f 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 1 — Paste your questionData JSON artifact</div>',
    '  <textarea id="roeHcArtifactInput" rows="7" placeholder="Paste the JSON artifact from your questionData frame here..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <button onclick="window._roeSolveHttpCache()" style="margin-top:10px;background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Simulate Cache & Generate Certificate</button>',
    '  <div id="roeHcStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 2 — Copy Your Submission Certificate</div>',
    '  <textarea id="roeHcOutput" readonly rows="9" placeholder=\'{"probe_deliveries":[{"request_id":"' + sampleReqId + '","body_version":"v1","source":"cache"}],"origin_request_count":' + sampleOriginCount + ',"final_cache_digest":"' + sampleDigest + '"}\' style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <button onclick="window._roeCopyHcOutput()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Certificate JSON</button>',
    '</div>'
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `HTTP cache time machine solver for ${norm}`,
    answerDisplay: [
      `### Q3: HTTP Cache Time Machine — Reconstruct the Shared Cache`,
      ``,
      `Paste your assignment artifact into the interactive solver below to run the protocol simulation for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
