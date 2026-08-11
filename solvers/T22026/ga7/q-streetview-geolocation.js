// Solver: GA7 Q6 -- Street View OSINT: Where Is This?
//
// Fully server-graded: your typed answer is POSTed to /backendVerify and checked there, with
// no client-exposed hash/normalizer function this time (unlike ROE's equivalent question). There
// is no client-computable path to derive an arbitrary image's answer from first principles -- but
// the exam appears to draw from a small recurring image pool rather than a unique image per
// student, so a known-image lookup gallery is genuinely useful: compare your assigned image
// against these thumbnails, and if it matches, copy the exact answer instantly.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-streetview-geolocation-server';
export const title = 'Q6: Street View OSINT: Where Is This?';

// Community-sourced by 24f1002249 (github.com/24f1002249) from observed exam sessions --
// see hypemonk.github.io/Geo-locations. This is NOT
// derived or verified against the exam bundle itself -- unlike every other GA7 answer in this
// project, these coordinates are unverified third-party data. Treat a match as a strong lead to
// double-check against your own image, not a guaranteed answer.
//
// TO ADD A NEW IMAGE LATER: append an object to this array (n = next unused number, running
// count doesn't need to stay contiguous with the source repo). Two ways to point at the image:
//   1. img: 'https://full-url-to-your-image.jpg'   -- any hosted image (GitHub raw link, imgur, etc.)
//   2. omit `img`                                   -- falls back to IMAGE_BASE/{n}.jpg (the
//                                                       original repo's numbering only)
// Minimal template to copy-paste:
//   { n: 11, place: '___', country: '___', lat: '___', lon: '___', img: 'https://...' },
// If a location has two acceptable answers (e.g. suburb vs. city), add `note` + `alt` like #2 below.
// Mutable: `let`, not `const` -- the live refresh below replaces this array's contents in place
// so newly added entries in the source repo show up without any code change here.
let KNOWN_IMAGES = [
  { n: 1, place: 'Helsinki', country: 'Finland', lat: '60.1878', lon: '24.9526' },
  {
    n: 2, place: 'Cape Town', country: 'South Africa', lat: '-33.949509', lon: '18.379933',
    note: 'Suburb vs. city -- try Cape Town first; if Check says wrong, use the alternate below.',
    alt: { place: 'Camps Bay', country: 'South Africa', lat: '-33.949509', lon: '18.379933' }
  },
  { n: 3, place: 'Lisbon', country: 'Portugal', lat: '38.709688', lon: '-9.146171' },
  { n: 4, place: 'Gangtok', country: 'India', lat: '27.3378635', lon: '88.6152478' },
  { n: 5, place: 'Vienna', country: 'Austria', lat: '48.237170', lon: '16.392560' },
  { n: 6, place: 'Prague', country: 'Czech Republic', lat: '50.08424', lon: '14.37920' },
  { n: 7, place: 'Hiroshima', country: 'Japan', lat: '34.3905', lon: '132.4519' },
  { n: 8, place: 'Nairobi', country: 'Kenya', lat: '-1.2655', lon: '36.8441' },
  { n: 9, place: 'Queenstown', country: 'New Zealand', lat: '-45.0327', lon: '168.6586' },
  { n: 10, place: 'Kansas City', country: 'United States', lat: '39.07388', lon: '-94.55802' },

  // -- Add new entries below this line --
];

const IMAGE_BASE = 'https://raw.githubusercontent.com/HypeMonk/Geo-locations/main/images';
const SOURCE_HTML_URL = 'https://raw.githubusercontent.com/HypeMonk/Geo-locations/main/index.html';
const SOURCE_IMAGES_API_URL = 'https://api.github.com/repos/HypeMonk/Geo-locations/contents/images';

function imageSrc(entry) {
  return entry.img || `${IMAGE_BASE}/${entry.n}.jpg`;
}

/**
 * Extracts the `const ANSWERS = [...]` array from the source repo's index.html and parses it
 * WITHOUT eval()/Function() -- untrusted remote text never gets executed as code. The source
 * array is plain-enough JS (unquoted object keys, double-quoted strings, trailing commas) that a
 * small regex transform turns it into valid JSON, which JSON.parse can handle safely.
 */
function parseAnswersSource(html) {
  const startMarker = 'const ANSWERS = [';
  const start = html.indexOf(startMarker);
  if (start === -1) throw new Error('Could not find the ANSWERS array in the source page -- its format may have changed.');

  // Bracket-match to find the matching closing `]`, respecting nested arrays/objects and strings.
  let i = start + startMarker.length - 1; // position of the opening [
  let depth = 0, inString = false, quoteChar = '';
  let end = -1;
  for (; i < html.length; i++) {
    const ch = html[i];
    if (inString) {
      if (ch === '\\') { i++; continue; }
      if (ch === quoteChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inString = true; quoteChar = ch; continue; }
    if (ch === '[') depth++;
    if (ch === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error('Unbalanced brackets while parsing the ANSWERS array.');

  let body = html.slice(start + startMarker.length - 1, end + 1);
  body = body.replace(/([{,[]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g, '$1"$2":'); // quote bare keys
  body = body.replace(/,(\s*[}\]])/g, '$1'); // strip trailing commas
  body = body.replace(/'/g, '"'); // normalize single to double quotes (source has none, but be safe)

  let parsed;
  try {
    parsed = JSON.parse(body);
  } catch (err) {
    throw new Error(`Source array did not parse as expected (format may have changed): ${err.message}`);
  }
  if (!Array.isArray(parsed)) throw new Error('Parsed ANSWERS is not an array.');

  function parseAnswerString(str) {
    const parts = String(str).split(',').map(p => p.trim());
    if (parts.length !== 4) return null;
    const [place, country, lat, lon] = parts;
    if (!place || !country || !lat || !lon) return null;
    return { place, country, lat, lon };
  }

  const entries = [];
  parsed.forEach((item, idx) => {
    const n = idx + 1;
    if (typeof item === 'string') {
      const parsedEntry = parseAnswerString(item);
      if (parsedEntry) entries.push({ n, ...parsedEntry });
    } else if (item && typeof item === 'object' && Array.isArray(item.alts) && item.alts.length) {
      const primary = parseAnswerString(item.alts[0]);
      if (!primary) return;
      const entry = { n, ...primary };
      if (typeof item.note === 'string') entry.note = item.note;
      if (item.alts[1]) {
        const alt = parseAnswerString(item.alts[1]);
        if (alt) entry.alt = alt;
      }
      entries.push(entry);
    }
  });
  return entries;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function formatAnswer(entry) {
  return `${entry.place}, ${entry.country}, ${entry.lat}, ${entry.lon}`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function registerStreetViewInteractive() {
  if (typeof window === 'undefined' || window._ga7SvRegistered) return;
  window._ga7SvRegistered = true;

  window._ga7SvFilterGallery = function () {
    const query = (document.getElementById('ga7SvGalleryFilter')?.value || '').trim().toLowerCase();
    for (const entry of KNOWN_IMAGES) {
      const row = document.getElementById(`ga7SvRow${entry.n}`);
      if (!row) continue;
      const text = `${entry.place} ${entry.country} ${entry.alt ? entry.alt.place + ' ' + entry.alt.country : ''}`.toLowerCase();
      const matches = !query || text.includes(query);
      if (row.style) row.style.display = matches ? '' : 'none';
    }
  };

  window._ga7SvCopyGalleryAnswer = async function (n, which) {
    const entry = KNOWN_IMAGES.find(e => e.n === n);
    if (!entry) return;
    const text = which === 'alt' && entry.alt ? formatAnswer(entry.alt) : formatAnswer(entry);
    const btn = document.getElementById(`ga7SvCopyBtn${n}${which === 'alt' ? 'Alt' : ''}`);
    try {
      await navigator.clipboard.writeText(text);
      if (btn) { const orig = btn.textContent; btn.textContent = 'Copied ✓'; setTimeout(() => { if (btn) btn.textContent = orig; }, 1200); }
    } catch {
      if (btn) btn.textContent = text;
    }
  };

  window._ga7SvRefreshGallery = async function () {
    const statusEl = document.getElementById('ga7SvRefreshStatus');
    const rowsEl = document.getElementById('ga7SvGalleryRows');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#94a3b8'; } }

    setStatus('🔄 Checking source for new images…', '#e9d5ff');
    try {
      const [htmlRes, imagesRes] = await Promise.all([
        fetchWithTimeout(SOURCE_HTML_URL),
        fetchWithTimeout(SOURCE_IMAGES_API_URL, { headers: { Accept: 'application/vnd.github+json' } })
      ]);
      if (!htmlRes.ok) throw new Error(`Could not fetch source page (HTTP ${htmlRes.status}).`);
      const html = await htmlRes.text();
      const parsedEntries = parseAnswersSource(html);

      // Cross-check against the actual image directory listing so an entry never points at a
      // file that doesn't exist -- fall back to the numbered convention only for files present.
      let availableNumbers = null;
      if (imagesRes.ok) {
        const files = await imagesRes.json();
        if (Array.isArray(files)) {
          availableNumbers = new Set(
            files.map(f => (String(f.name).match(/^(\d+)\.[a-z0-9]+$/i) || [])[1]).filter(Boolean).map(Number)
          );
        }
      }
      const validEntries = availableNumbers
        ? parsedEntries.filter(e => e.img || availableNumbers.has(e.n))
        : parsedEntries;

      if (!validEntries.length) throw new Error('Parsed zero valid entries -- source format may have changed.');

      const previousCount = KNOWN_IMAGES.length;
      KNOWN_IMAGES = validEntries;

      if (rowsEl) {
        rowsEl.innerHTML = KNOWN_IMAGES.map(galleryRowHtml).join('\n');
      }
      window._ga7SvFilterGallery();

      const delta = KNOWN_IMAGES.length - previousCount;
      const deltaText = delta > 0 ? ` (${delta} new since last check)` : delta < 0 ? ' (some entries were removed upstream)' : ' (no change)';
      setStatus(`✅ Loaded ${KNOWN_IMAGES.length} images from source${deltaText}.`, '#4ade80');
    } catch (err) {
      const msg = err.name === 'AbortError' ? 'Request timed out.' : err.message;
      setStatus(`⚠️ Could not refresh (${msg}). Showing the built-in list -- try again later.`, '#d97706');
    }
  };

  window._ga7SvOpenLightbox = function (src) {
    const lb = document.getElementById('ga7SvLightbox');
    const img = document.getElementById('ga7SvLightboxImg');
    if (img) img.src = src;
    if (lb) {
      // `position: fixed` positions relative to the nearest transformed/filtered ancestor, not
      // the viewport, if one exists between here and <body> (common in panel/animation wrappers).
      // That's exactly why the lightbox could appear scrolled-away instead of centered on screen
      // for images further down the gallery. Re-parenting straight onto <body> guarantees it's
      // never trapped inside such an ancestor, regardless of where in the page it was clicked from.
      if (document.body && lb.parentElement !== document.body) {
        document.body.appendChild(lb);
      }
      lb.style.display = 'flex';
    }
  };

  window._ga7SvCloseLightbox = function () {
    const lb = document.getElementById('ga7SvLightbox');
    if (lb) lb.style.display = 'none';
  };

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

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1`;
      const res = await fetch(url, { headers: { 'User-Agent': 'TDS-ROE-Solver/1.0' }, signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !data.length) throw new Error('Location not found. Try a broader city/landmark name.');

      const item = data[0];
      const addr = item.address || {};
      const placeName = addr.city || addr.town || addr.village || addr.suburb || addr.state || addr.county || query.split(',')[0].trim();
      const countryName = addr.country || '';
      const latVal = Number(item.lat).toFixed(4);
      const lonVal = Number(item.lon).toFixed(4);

      if (placeEl) placeEl.value = placeName;
      if (countryEl) countryEl.value = countryName;
      if (latEl) latEl.value = latVal;
      if (lonEl) lonEl.value = lonVal;

      const formatted = `${placeName}, ${countryName}, ${latVal}, ${lonVal}`;
      if (outEl) outEl.value = formatted;

      setStatus(`✅ Geocoded. Formatted: ${formatted} -- verify this actually matches your image before submitting.`, '#198754');
    } catch (err) {
      const msg = err.name === 'AbortError' ? 'Request timed out.' : err.message;
      setStatus(`⚠️ Geocoding note: ${msg}. You can still type the values manually below.`, '#d97706');
    } finally {
      clearTimeout(timer);
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

function galleryRowHtml(entry) {
  const src = imageSrc(entry);
  const answer = formatAnswer(entry);
  const altBlock = entry.alt ? [
    `      <div style="margin-top:6px;font-size:12px;color:#fbbf24;">⚠️ ${escapeHtml(entry.note || '')}</div>`,
    '      <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">',
    `        <code style="background:#071120;padding:6px 10px;border-radius:6px;color:#fbbf24;font-size:12.5px;">${escapeHtml(formatAnswer(entry.alt))}</code>`,
    `        <button id="ga7SvCopyBtn${entry.n}Alt" onclick="window._ga7SvCopyGalleryAnswer(${entry.n},'alt')" style="background:#334155;color:#fff;border:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;">Copy alt</button>`,
    '      </div>'
  ].join('\n') : '';

  return [
    `  <div id="ga7SvRow${entry.n}" style="display:flex;gap:14px;align-items:flex-start;padding:12px 0;border-bottom:1px solid #334155;">`,
    `    <div style="flex:0 0 26px;color:#64748b;font-size:13px;padding-top:4px;">${entry.n}.</div>`,
    `    <img src="${src}" alt="Street View reference ${entry.n}" loading="lazy" onclick="window._ga7SvOpenLightbox('${src}')" style="width:140px;height:90px;object-fit:cover;border-radius:8px;cursor:zoom-in;border:1px solid #334155;flex:0 0 auto;" />`,
    '    <div style="flex:1;min-width:0;">',
    '      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">',
    `        <code style="background:#071120;padding:6px 10px;border-radius:6px;color:#4ade80;font-size:12.5px;">${escapeHtml(answer)}</code>`,
    `        <button id="ga7SvCopyBtn${entry.n}" onclick="window._ga7SvCopyGalleryAnswer(${entry.n})" style="background:#16a34a;color:#fff;border:none;border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;">Copy</button>`,
    '      </div>',
    altBlock,
    '    </div>',
    '  </div>'
  ].filter(Boolean).join('\n');
}

export async function solve(email) {
  registerStreetViewInteractive();
  const norm = normalizeEmail(email);

  const summary = [
    `Street View OSINT solver for ${norm}.`,
    `Check the known-image gallery first (${KNOWN_IMAGES.length} previously observed images with confirmed coordinates) -- if your assigned image matches one, copy the exact answer instantly. Otherwise use the geocoding/manual tools as a fallback.`
  ].join(' ');

  const guide = [
    `## Q6 -- Street View OSINT: Where Is This? (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> You've been given one Street View image. Using only publicly available information (visual`,
    `> clues, reverse image search, road signs, architecture, vegetation, language on signage,`,
    `> etc.), identify where it was taken.`,
    `>`,
    `> Enter your answer as 4 comma-separated values, in this order: Place, Country, Latitude,`,
    `> Longitude. This question is **all-or-nothing**: there is no partial credit. Getting the place`,
    `> and country right on their own scores zero.`,
    `>`,
    `> **Grading notes:** place/country matching ignores case, spacing, and punctuation (write the`,
    `> full name, e.g. "United States" not "USA"); latitude/longitude are correct if your pin is`,
    `> within the stated tolerance of the true spot. Each Check is graded on the server.`,
    ``,
    `### ⚠️ Why there's no automatic solver`,
    `Your typed answer is POSTed straight to the server with no client-exposed hash or normalizer`,
    `to pre-check against -- there's nothing to extract or decode. The gallery below is the closest`,
    `thing to a solver: a set of images the exam has been observed to reuse, with their confirmed`,
    `correct coordinates, contributed by past students. **This is third-party data, not something`,
    `verified against the exam bundle** (unlike every other GA7 answer in this project) -- treat a`,
    `visual match as a strong lead, not a guarantee, and always sanity-check against your own image`,
    `before submitting.`,
    ``,
    `**Credit:** compiled by [24f1002249](https://github.com/24f1002249), hosted at`,
    `[hypemonk.github.io/Geo-locations](https://hypemonk.github.io/Geo-locations/). Thanks for`,
    `sharing it with the class -- if it helped you, consider starring their repo too.`,
    ``,
    `### 🖼️ Known Image Gallery -- compare your image, then copy`,
    `Scroll or search to find your assigned image among these ${KNOWN_IMAGES.length}. Click a`,
    `thumbnail to zoom in and compare details. Click **Check for new images** to pull the latest`,
    `list from the source live -- newly added entries appear automatically, no code change needed.`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:20px 22px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="display:flex;gap:10px;margin-bottom:6px;flex-wrap:wrap;">',
    '    <input id="ga7SvGalleryFilter" type="text" oninput="window._ga7SvFilterGallery()" placeholder="Filter by place or country…" style="flex:1;min-width:180px;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;box-sizing:border-box;" />',
    '    <button onclick="window._ga7SvRefreshGallery()" style="background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;border:none;border-radius:8px;padding:10px 16px;font-weight:700;font-size:13px;cursor:pointer;white-space:nowrap;">🔄 Check for new images</button>',
    '  </div>',
    '  <div id="ga7SvRefreshStatus" style="font-size:12px;min-height:16px;color:#94a3b8;margin-bottom:10px;"></div>',
    '  <div id="ga7SvGalleryRows">',
    ...KNOWN_IMAGES.map(galleryRowHtml),
    '  </div>',
    '</div>',
    ``,
    '<div id="ga7SvLightbox" onclick="window._ga7SvCloseLightbox()" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;cursor:zoom-out;">',
    '  <img id="ga7SvLightboxImg" src="" alt="Zoomed reference" style="max-width:90vw;max-height:90vh;border-radius:8px;box-shadow:0 10px 40px rgba(0,0,0,0.6);" />',
    '</div>',
    ``,
    `### 🔍 Fallback: Auto-Geocode by Name (OpenStreetMap)`,
    `If your image doesn't match the gallery, identify the location yourself (driving side, road`,
    `signs, language, architecture, then reverse image search), then look it up here.`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="display:flex;gap:10px;margin-bottom:14px;">',
    '    <input id="ga7SvGeocodeQuery" type="text" placeholder="Enter landmark/place (e.g. Marine Drive, Mumbai)" style="flex:1;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <button onclick="window._ga7SvGeocodeLocation()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Geocode</button>',
    '  </div>',
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
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Street View OSINT solver for ${norm}`,
    answerDisplay: [
      `### Q6: Street View OSINT`,
      ``,
      `Check the ${KNOWN_IMAGES.length}-image known gallery first, then use the geocode/manual fallback tools below, for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
