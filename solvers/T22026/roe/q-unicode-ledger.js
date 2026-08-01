// Solver: ROE T2 2026 Q2 — Unicode Doppelganger Ledger Forensics
//
// Ultra-Advanced Interactive Direct Solver & Per-User Forensic Engine:
// Paste your questionData JSON artifact, and this tool executes full canonicalization,
// replay removal, revision selection, eligibility filtering, BigInt accounting, and FNV-1a-32 hashing.
import { normalizeEmail } from './utils.js';

export const id = 'q-unicode-doppelganger-ledger-server';
export const title = 'Q2: Unicode Doppelganger Ledger Forensics';

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

function parseCodePoint(val) {
  if (typeof val === 'number') return String.fromCodePoint(val);
  const str = String(val).trim();
  if (/^U\+[0-9A-Fa-f]+$/i.test(str)) {
    return String.fromCodePoint(parseInt(str.slice(2), 16));
  }
  if (/^[0-9A-Fa-f]{4,6}$/i.test(str) && !isNaN(parseInt(str, 16))) {
    return String.fromCodePoint(parseInt(str, 16));
  }
  return str;
}

function registerUnicodeLedgerInteractive() {
  if (typeof window === 'undefined' || window._roeUnicodeLedgerRegistered) return;
  window._roeUnicodeLedgerRegistered = true;

  window._roeSolveUnicodeLedger = function () {
    const rawInput = (document.getElementById('roeUlArtifactInput')?.value || '').trim();
    const statusEl = document.getElementById('roeUlStatus');
    const outEl = document.getElementById('roeUlOutput');

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

      const events = data.events || data.ledger_events || data.transactions || (Array.isArray(data) ? data : []);
      if (!Array.isArray(events) || events.length === 0) {
        throw new Error('No events array found in the provided JSON artifact.');
      }

      const rawIgnorable = data.default_ignorable || data.default_ignorable_scalars || data.ignorable || ["\u200B", "\u200C", "\u200D", "\u00AD", "\u200E", "\u200F", "\uFEFF"];
      const ignorableSet = new Set(rawIgnorable.map(parseCodePoint));

      const rawConfusableMap = data.confusable_map || data.confusables || data.confusableMap || {};
      const confusableMap = {};
      for (const [k, v] of Object.entries(rawConfusableMap)) {
        confusableMap[parseCodePoint(k)] = parseCodePoint(v);
      }

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
          if (!accountCanonicalMap.has(can)) {
            accountCanonicalMap.set(can, new Set());
          }
          accountCanonicalMap.get(can).add(rawAcct);
        }
      });

      accountCanonicalMap.forEach((rawSet) => {
        if (rawSet.size > 1) {
          rawSet.forEach(raw => suspiciousAccounts.add(raw));
        }
      });

      if (Array.isArray(data.suspicious_account_ids)) {
        data.suspicious_account_ids.forEach(id => suspiciousAccounts.add(id));
      }

      const seenRawEvents = new Set();
      const uniqueTransportEvents = [];
      events.forEach(evt => {
        const repr = evt.event_id ? evt.event_id : JSON.stringify(evt);
        if (!seenRawEvents.has(repr)) {
          seenRawEvents.add(repr);
          uniqueTransportEvents.push(evt);
        }
      });

      const revisionGroups = new Map();
      uniqueTransportEvents.forEach(evt => {
        const key = evt.transaction_key || evt.event_key || evt.business_key || evt.invoice_id || evt.id || evt.event_id;
        if (!revisionGroups.has(key)) {
          revisionGroups.set(key, []);
        }
        revisionGroups.get(key).push(evt);
      });

      const winningRevisions = [];
      revisionGroups.forEach((group) => {
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
        if (!canonicalBusinessKeysSeen.has(canKey)) {
          canonicalBusinessKeysSeen.add(canKey);
          acceptedEvents.push(evt);
        }
      });

      let netMinor = 0n;
      acceptedEvents.forEach(evt => {
        const amt = evt.amount_minor ?? evt.amount ?? evt.minor_units ?? evt.net_minor ?? 0;
        netMinor += BigInt(String(amt).split('.')[0]);
      });

      const acceptedEventIds = acceptedEvents.map(e => String(e.event_id || e.id)).filter(Boolean);
      const suspiciousAccountIds = Array.from(suspiciousAccounts);

      const digestInput = data.digest_template
        ? data.digest_template
            .replace('{accepted}', acceptedEventIds.slice().sort().join(','))
            .replace('{net}', netMinor.toString())
        : `${acceptedEventIds.slice().sort().join(',')}:${netMinor.toString()}`;

      const evidenceDigest = fnv1a32Hex(digestInput);

      const resultObj = {
        suspicious_account_ids: suspiciousAccountIds,
        accepted_event_ids: acceptedEventIds,
        net_minor_units: netMinor.toString(),
        evidence_digest: evidenceDigest
      };

      outEl.value = JSON.stringify(resultObj, null, 2);
      setStatus(`Successfully processed ${events.length} events! Net minor units: ${netMinor.toString()}`, '#198754');
    } catch (err) {
      setStatus(`Processing failed: ${err.message}`, '#dc3545');
      if (outEl) outEl.value = '';
    }
  };

  window._roeCopyUlOutput = async function () {
    const el = document.getElementById('roeUlOutput');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const statusEl = document.getElementById('roeUlStatus');
      if (statusEl) statusEl.textContent = 'Copied to clipboard!';
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerUnicodeLedgerInteractive();
  const norm = normalizeEmail(email);
  const rng = createRng(`${norm}#q2-seed`);

  const sampleAcct = `acct-${Math.floor(rng() * 8999 + 1000)}`;
  const sampleEvt = `evt-${Math.floor(rng() * 8999 + 1000)}`;
  const sampleNet = (BigInt(Math.floor(rng() * 9e10 + 1e10)) * 100n).toString();
  const sampleDigest = fnv1a32Hex(`${sampleEvt}:${sampleNet}`);

  const summary = [
    `Interactive Unicode Doppelganger Ledger Solver for ${norm}.`,
    `Paste your questionData JSON artifact below to execute automatic canonicalization,`,
    `revision selection, BigInt accounting, and FNV-1a-32 evidence digest calculation for ${norm}.`
  ].join(' ');

  const guide = [
    `## Q2 — Unicode Doppelganger Ledger Forensics (for ${norm})`,
    ``,
    `### ⚡ Dynamic Interactive Direct Solver (Unique for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#07111f 0%,#0c2540 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#e6f3ff;border:1px solid #1e3a5f;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 1 — Paste your questionData JSON artifact</div>',
    '  <textarea id="roeUlArtifactInput" rows="7" placeholder="Paste the JSON content from your questionData iframe here..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#030a14;color:#e2e8f0;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <button onclick="window._roeSolveUnicodeLedger()" style="margin-top:10px;background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Generate 4-Field Forensic Certificate</button>',
    '  <div id="roeUlStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #1e3a5f;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Step 2 — Copy Your Submission Certificate</div>',
    '  <textarea id="roeUlOutput" readonly rows="9" placeholder=\'{"suspicious_account_ids":["' + sampleAcct + '"],"accepted_event_ids":["' + sampleEvt + '"],"net_minor_units":"' + sampleNet + '","evidence_digest":"' + sampleDigest + '"}\' style="width:100%;padding:10px;border-radius:8px;border:1px solid #1e3a5f;background:#030a14;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <button onclick="window._roeCopyUlOutput()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Certificate JSON</button>',
    '</div>'
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Unicode ledger solver for ${norm}`,
    answerDisplay: [
      `### Q2: Unicode Doppelganger Ledger Forensics`,
      ``,
      `Paste your assignment artifact into the interactive solver below to compute your forensic certificate for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
