// Solver: ROE T2 2026 Q4 — Street View OSINT: Where Is This?
//
// Dynamic Direct Solver & SHA-256 Verifier:
// Calculates exact string normalizations ve(place), be(country), and W(lat/lon, 4),
// computes SHA-256 digests via Web Crypto, and scores candidate solutions.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-streetview-geolocation-server';
export const title = 'Q4: Street View OSINT — Where Is This?';

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

function ve(str) {
  return String(str ?? '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
}

function be(str) {
  return String(str ?? '').trim().toLowerCase().replace(/[.’']/g, '').replace(/\s+/g, ' ').trim();
}

function W(e, o = 4) {
  let a = String(e ?? '').trim().replace(/\s+/g, ' ').replace(/°/g, '').replace(/,/g, '');
  if (!a) return null;
  let t = false, r = a.match(/^([NSEWnsew])\s*(.+)$/) || a.match(/^(.+?)\s*([NSEWnsew])$/);
  if (r) {
    let [, v, S] = r, A = /^[NSEWnsew]$/.test(v), C = A ? v : S;
    a = (A ? S : v).trim();
    t = /[SWsw]/.test(C);
  }
  let i = a.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);
  if (!i) return null;
  let [, s, l, d = ''] = i, c = s === '-' !== t, h = d.padEnd(o + 1, '0'), n = h.slice(0, o), f = h[o] >= '5', m = l + n;
  if (f) {
    m = (BigInt(m) + 1n).toString().padStart(m.length, '0');
  }
  let k = /^0+$/.test(m), u = c && !k ? '-' : '', b = m.length - o;
  return `${u}${m.slice(0, b) || '0'}.${m.slice(b)}`;
}

async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function registerStreetViewInteractive() {
  if (typeof window === 'undefined' || window._roeStreetViewRegistered) return;
  window._roeStreetViewRegistered = true;

  window._roeTestStreetViewCandidates = async function () {
    const rawPlace = document.getElementById('roeSvPlaceInput')?.value || '';
    const rawCountry = document.getElementById('roeSvCountryInput')?.value || '';
    const rawLat = document.getElementById('roeSvLatInput')?.value || '';
    const rawLon = document.getElementById('roeSvLonInput')?.value || '';

    const targetPlaceHash = (document.getElementById('roeSvTargetPlaceHash')?.value || '').trim().toLowerCase();
    const targetCountryHash = (document.getElementById('roeSvTargetCountryHash')?.value || '').trim().toLowerCase();
    const targetLatHash = (document.getElementById('roeSvTargetLatHash')?.value || '').trim().toLowerCase();
    const targetLonHash = (document.getElementById('roeSvTargetLonHash')?.value || '').trim().toLowerCase();

    const statusEl = document.getElementById('roeSvStatus');
    const outEl = document.getElementById('roeSvOutput');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.innerHTML = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    const normPlace = ve(rawPlace);
    const normCountry = be(rawCountry);
    const normLat = W(rawLat, 4);
    const normLon = W(rawLon, 4);

    if (!normPlace || !normCountry || !normLat || !normLon) {
      setStatus('Please enter place, country, latitude, and longitude.', '#dc3545');
      return;
    }

    const hashPlace = await sha256Hex(normPlace);
    const hashCountry = await sha256Hex(normCountry);
    const hashLat = await sha256Hex(normLat);
    const hashLon = await sha256Hex(normLon);

    const matches = [];
    if (targetPlaceHash) matches.push({ field: 'place', match: hashPlace === targetPlaceHash });
    if (targetCountryHash) matches.push({ field: 'country', match: hashCountry === targetCountryHash });
    if (targetLatHash) matches.push({ field: 'lat', match: hashLat === targetLatHash });
    if (targetLonHash) matches.push({ field: 'lon', match: hashLon === targetLonHash });

    const result = {
      place_name: normPlace,
      country: normCountry,
      latitude: normLat,
      longitude: normLon
    };

    if (outEl) outEl.value = JSON.stringify(result, null, 2);

    let matchMsg = '';
    if (matches.length > 0) {
      const matchCount = matches.filter(m => m.match).length;
      matchMsg = ` | Match Score: <strong>${matchCount} / ${matches.length}</strong> hashes matched!`;
    }

    setStatus(`✅ Formatted candidate certificate generated!${matchMsg}`, '#198754');
  };

  window._roeCopySvOutput = async function () {
    const el = document.getElementById('roeSvOutput');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const statusEl = document.getElementById('roeSvStatus');
      if (statusEl) statusEl.textContent = 'Copied location certificate to clipboard!';
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerStreetViewInteractive();
  const norm = normalizeEmail(email);
  const rng = createRng(`${norm}#q4-seed`);

  const samplePlaces = ['eiffel tower', 'taj mahal', 'machu picchu', 'colosseum', 'petra'];
  const sampleCountries = ['france', 'india', 'peru', 'italy', 'jordan'];
  const sampleIdx = Math.floor(rng() * samplePlaces.length);

  const samplePlace = samplePlaces[sampleIdx];
  const sampleCountry = sampleCountries[sampleIdx];

  const summary = [
    `Interactive Street View OSINT Verifier for ${norm}.`,
    `Enter candidate coordinates and place details below to apply string normalizations ve(place), be(country), and W(coord, 4), calculate SHA-256 hashes, and generate your 4-field location certificate for ${norm}.`
  ].join(' ');

  const guide = [
    `## Q4 — Street View OSINT: Where Is This? (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> 🌍 **Where in the world is this?** You've been given one Street View image on your exam page.`,
    `> Using only publicly available information (visual clues, reverse image search, road signs,`,
    `> architecture, vegetation, language on signage, etc.), identify exactly where it was taken.`,
    `>`,
    `> **What to submit:** enter your answer as 4 comma-separated values, in this order —`,
    `> \`Place, Country, Latitude, Longitude\` (e.g. \`California, United States, 37.0902, -119.4179\`).`,
    `> Each of the 4 values is graded independently and worth 25% of this question — partial credit`,
    `> is given for whichever parts you get right.`,
    `>`,
    `> **Grading notes:**`,
    `> - Place and country matching ignores case, spacing, and punctuation — but write the full name`,
    `>   (e.g. "United States", not "USA").`,
    `> - Latitude/longitude must match to exactly 4 decimal places — no tolerance. You can write a`,
    `>   hemisphere letter (e.g. \`94.5583 W\`) instead of a minus sign if you prefer.`,
    `> - Checking your answer is instant and never calls an external API — everything is verified`,
    `>   against a one-way hash, so the correct answer can't be read off the network. Your final`,
    `>   submission is independently re-verified on the server the same way.`,
    ``,
    `### 💯 Grading — each field is worth 25%, submit all 4 even if unsure`,
    `Place, country, latitude, and longitude are graded **independently** — each is worth exactly `,
    `25% of this question's marks. A correct country alone is real, free credit even if you can't `,
    `pin the exact coordinates. Never leave a field blank just because you're not confident in it.`,
    ``,
    `### ⚡ Dynamic Geolocation Candidate Tester (Unique for ${norm})`,
    ``,
    `> 🔧 **Backup method:** if this in-browser tool fails to load or run, the same ve()/be()/W()`,
    '> normalizers are also available as a standalone Node.js script: `solvers/T22026/roe/offline-scripts/q4-streetview-osint.offline.mjs`.',
    '> Run `node q4-streetview-osint.offline.mjs "Place" "Country" "Lat" "Lon"`.',
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">1. Candidate Location Inputs</div>',
    '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">',
    '    <input id="roeSvPlaceInput" type="text" placeholder="Place Name (e.g. ' + samplePlace + ')" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <input id="roeSvCountryInput" type="text" placeholder="Country (e.g. ' + sampleCountry + ')" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <input id="roeSvLatInput" type="text" placeholder="Latitude (e.g. 48.8584)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;" />',
    '    <input id="roeSvLonInput" type="text" placeholder="Longitude (e.g. 2.2945)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;" />',
    '  </div>',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">2. Target SHA-256 Hashes (Optional — For Match Verification)</div>',
    '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">',
    '    <input id="roeSvTargetPlaceHash" type="text" placeholder="Target Place Hash (64-char hex)" style="padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;" />',
    '    <input id="roeSvTargetCountryHash" type="text" placeholder="Target Country Hash (64-char hex)" style="padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;" />',
    '    <input id="roeSvTargetLatHash" type="text" placeholder="Target Lat Hash (64-char hex)" style="padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;" />',
    '    <input id="roeSvTargetLonHash" type="text" placeholder="Target Lon Hash (64-char hex)" style="padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;" />',
    '  </div>',
    '  <button onclick="window._roeTestStreetViewCandidates()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Normalize & Generate Location Certificate</button>',
    '  <div id="roeSvStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '</div>',
    ``,
    '<div style="background:rgba(255,255,255,0.03);border:1px solid #334155;border-radius:14px;padding:20px 22px;margin:14px 0;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Submission Certificate</div>',
    '  <textarea id="roeSvOutput" readonly rows="6" placeholder=\'{"place_name":"...","country":"...","latitude":"...","longitude":"..."}\' style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#0f172a;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <button onclick="window._roeCopySvOutput()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Location Certificate</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Street view OSINT solver for ${norm}`,
    answerDisplay: [
      `### Q4: Street View OSINT — Where Is This?`,
      ``,
      `Enter candidate location details into the interactive normalizer below to compute your certificate for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
