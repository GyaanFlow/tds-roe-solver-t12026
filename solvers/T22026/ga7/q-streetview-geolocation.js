// Solver: GA7 Q6 -- Street View OSINT: Where Is This?
//
// Fully server-graded: your typed answer is POSTed to /backendVerify and checked there, with
// no client-exposed hash/normalizer function this time (unlike ROE's equivalent question). There
// is no client-computable path to the answer -- this is a format guide + submission helper.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-streetview-geolocation-server';
export const title = 'Q6: Street View OSINT: Where Is This?';

function registerStreetViewInteractive() {
  if (typeof window === 'undefined' || window._ga7SvRegistered) return;
  window._ga7SvRegistered = true;

  window._ga7SvGeocodeLocation = async function () {
    const query = (document.getElementById('ga7SvGeocodeQuery')?.value || '').trim();
    const statusEl = document.getElementById('ga7SvStatus');
    const placeEl = document.getElementById('ga7SvPlace');
    const countryEl = document.getElementById('ga7SvCountry');
    const latEl = document.getElementById('ga7SvLat');
    const lonEl = document.getElementById('ga7SvLon');
    const outEl = document.getElementById('ga7SvOutput');

    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }

    if (!query) {
      setStatus('Enter a landmark or place name to auto-geocode (e.g. Eiffel Tower, Paris).', '#dc3545');
      return;
    }

    setStatus(`🔍 Geocoding "${query}" via OpenStreetMap API...`, '#e9d5ff');

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'TDS-ROE-Solver/1.0' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !data.length) throw new Error('Location not found. Try a broader city/landmark name.');

      const item = data[0];
      const addr = item.address || {};
      const placeName = addr.city || addr.town || addr.village || addr.suburb || addr.state || addr.county || query.split(',')[0].trim();
      const countryName = addr.country || 'United States';
      const latVal = Number(item.lat).toFixed(4);
      const lonVal = Number(item.lon).toFixed(4);

      if (placeEl) placeEl.value = placeName;
      if (countryEl) countryEl.value = countryName;
      if (latEl) latEl.value = latVal;
      if (lonEl) lonEl.value = lonVal;

      const formatted = `${placeName}, ${countryName}, ${latVal}, ${lonVal}`;
      if (outEl) outEl.value = formatted;

      setStatus(`✅ Successfully geocoded! Formatted: ${formatted}`, '#198754');
    } catch (err) {
      setStatus(`⚠️ Geocoding note: ${err.message}. You can still type the values manually below.`, '#d97706');
    }
  };

  window._ga7SvBuildAnswer = function () {
    const place = (document.getElementById('ga7SvPlace')?.value || '').trim();
    const country = (document.getElementById('ga7SvCountry')?.value || '').trim();
    const lat = (document.getElementById('ga7SvLat')?.value || '').trim();
    const lon = (document.getElementById('ga7SvLon')?.value || '').trim();
    const outEl = document.getElementById('ga7SvOutput');
    const statusEl = document.getElementById('ga7SvStatus');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }

    if (!place || !country || !lat || !lon) {
      setStatus('Fill in all four fields.', '#dc3545');
      if (outEl) outEl.value = '';
      return;
    }
    if (!/^[+-]?\d+(\.\d+)?\s*[NnSsEeWw]?$/.test(lat) || !/^[+-]?\d+(\.\d+)?\s*[NnSsEeWw]?$/.test(lon)) {
      setStatus('Latitude/longitude should be a plain number, optionally with a trailing N/S/E/W letter.', '#d97706');
    } else {
      setStatus('✅ Formatted. This is all-or-nothing (no partial credit) -- double check place/country spelling and coordinates.', '#198754');
    }
    if (outEl) outEl.value = `${place}, ${country}, ${lat}, ${lon}`;
  };

  window._ga7SvCopyAnswer = async function () {
    const el = document.getElementById('ga7SvOutput');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerStreetViewInteractive();
  const norm = normalizeEmail(email);

  const summary = [
    `Advanced Street View OSINT solver for ${norm}.`,
    `Use the built-in OpenStreetMap Geocoding engine and OSINT toolkit below to auto-fetch coordinates and format your 4-part answer.`
  ].join(' ');

  const guide = [
    `## Q6 -- Street View OSINT: Where Is This? (Advanced Solver for ${norm})`,
    ``,
    `### ⚡ Automated OpenStreetMap Geocoding & OSINT Engine`,
    `Type any landmark or place name below (e.g. \`Eiffel Tower, Paris\` or \`Times Square, New York\`) to automatically lookup coordinates, city, country, and format the exact submission string!`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">1-Click Automated Geocoding Lookup</div>',
    '  <div style="display:flex;gap:10px;margin-bottom:14px;">',
    '    <input id="ga7SvGeocodeQuery" type="text" placeholder="Enter landmark/place (e.g. Marine Drive, Mumbai)" style="flex:1;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <button onclick="window._ga7SvGeocodeLocation()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">⚡ Auto-Geocode</button>',
    '  </div>',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Formatted Submission Components</div>',
    '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">',
    '    <input id="ga7SvPlace" type="text" placeholder="Place (e.g. California)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <input id="ga7SvCountry" type="text" placeholder="Country (e.g. United States)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <input id="ga7SvLat" type="text" placeholder="Latitude (e.g. 37.0902)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;" />',
    '    <input id="ga7SvLon" type="text" placeholder="Longitude (e.g. -119.4179)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;" />',
    '  </div>',
    '  <button onclick="window._ga7SvBuildAnswer()" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Format Answer String</button>',
    '  <div id="ga7SvStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '  <input id="ga7SvOutput" readonly style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;margin-top:10px;" />',
    '  <button onclick="window._ga7SvCopyAnswer()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Answer</button>',
    '</div>',
    ``,
    `### 📄 Exam Rules & Grading Notes`,
    `> **Submission Format:** \`Place, Country, Latitude, Longitude\``,
    `> - Place and country matching ignores case, spacing, and punctuation -- but write the full name (e.g. "United States", not "USA").`,
    `> - Latitude/longitude are correct if your pin is within 100 metres of the true spot.`,
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Advanced Street View OSINT solver for ${norm}`,
    answerDisplay: [
      `### Q6: Street View OSINT`,
      ``,
      `Use the automated OpenStreetMap geocoding engine and formatting toolkit below for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
