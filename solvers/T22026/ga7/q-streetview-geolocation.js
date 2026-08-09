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
      setStatus('✅ Formatted. This is all-or-nothing (no partial credit) -- double check place/country spelling and that your pin is within the stated tolerance before submitting.', '#198754');
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
    `Street View OSINT submission helper for ${norm}.`,
    `This question is fully server-graded with no client-exposed check -- there is no way to compute the answer without actually looking at your assigned image. Use the format helper below once you've identified the location.`
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
    `> Longitude. This question is **all-or-nothing**: there is no partial credit. You earn full`,
    `> marks only if the place, the country, and the coordinates are all correct. Getting the place`,
    `> and country right on their own scores zero.`,
    `>`,
    `> **Grading notes:**`,
    `> - Place and country matching ignores case, spacing, and punctuation -- but write the full`,
    `>   name (e.g. "United States", not "USA").`,
    `> - Latitude/longitude are correct if your pin is within the stated tolerance of the true spot`,
    `>   -- you don't need exact decimals, get the right street corner. A hemisphere letter (e.g.`,
    `>   \`94.5583 W\`) works instead of a minus sign.`,
    `> - Each Check is graded on the server, so it needs a moment. Your final submission is`,
    `>   re-verified the same way.`,
    ``,
    `### ⚠️ Why no solver is possible here`,
    `Unlike some other geolocation questions, this one has **no client-side hash or normalizer`,
    `function exposed at all** -- your typed answer is POSTed straight to the server and checked`,
    `there. There is nothing to extract, decode, or pre-verify. The only real path is genuine OSINT:`,
    `driving side of the road, vegetation/sun angle, road-marking colours, signage language/script,`,
    `licence-plate shape, utility-pole material, architecture, then reverse image search to pin the`,
    `exact spot.`,
    ``,
    `### ⚡ Answer Format Helper (for ${norm})`,
    `This only formats your own identification into the required comma-separated shape -- it cannot`,
    `verify correctness.`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">',
    '    <input id="ga7SvPlace" type="text" placeholder="Place (e.g. California)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <input id="ga7SvCountry" type="text" placeholder="Country (e.g. United States)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:sans-serif;font-size:13px;" />',
    '    <input id="ga7SvLat" type="text" placeholder="Latitude (e.g. 37.0902)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;" />',
    '    <input id="ga7SvLon" type="text" placeholder="Longitude (e.g. -119.4179)" style="padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;" />',
    '  </div>',
    '  <button onclick="window._ga7SvBuildAnswer()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Format Answer</button>',
    '  <div id="ga7SvStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '  <input id="ga7SvOutput" readonly style="width:100%;padding:10px;border-radius:8px;border:1px solid #334155;background:#071120;color:#4ade80;font-family:monospace;font-size:13px;box-sizing:border-box;margin-top:10px;" />',
    '  <button onclick="window._ga7SvCopyAnswer()" style="margin-top:8px;background:#16a34a;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Copy Answer</button>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `Street View OSINT submission helper for ${norm}`,
    answerDisplay: [
      `### Q6: Street View OSINT`,
      ``,
      `No client-computable solver exists for this question. Use the format helper below once you've identified the location, for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
