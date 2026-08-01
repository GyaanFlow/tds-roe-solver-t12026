// Backup / offline method for Q4 — Street View OSINT: Where Is This?
//
// Use this ONLY if the interactive in-browser normalizer on the ROE Q4 guide fails to load or
// run. Exact same ve()/be()/W() normalization functions as the browser tool and the real exam
// bundle, ported to plain Node.js. This does NOT extract the answer for you (the correct
// place/country/lat/lon is only ever hashed, never sent to the client) — it just formats your
// own best-guess candidate so the exam's exact string/number matching won't reject it on
// formatting alone.
//
// Usage:
//   node q4-streetview-osint.offline.mjs "Place Name" "Country Name" "37.0902" "-119.4179 W"

process.on('uncaughtException', (err) => {
  console.error(`Unexpected error: ${err.message}`);
  process.exit(1);
});

const [, , place, country, lat, lon] = process.argv;
if (place === undefined || country === undefined || lat === undefined || lon === undefined) {
  console.error('Usage: node q4-streetview-osint.offline.mjs "Place" "Country" "Latitude" "Longitude"');
  process.exit(1);
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
  let [, s, l, d = ''] = i, c = (s === '-') !== t, h = d.padEnd(o + 1, '0'), n = h.slice(0, o), f = h[o] >= '5', m = l + n;
  if (f) m = (BigInt(m) + 1n).toString().padStart(m.length, '0');
  let k = /^0+$/.test(m), u = c && !k ? '-' : '', b = m.length - o;
  return `${u}${m.slice(0, b) || '0'}.${m.slice(b)}`;
}

const latNorm = W(lat);
const lonNorm = W(lon);
if (latNorm === null) console.error(`WARNING: could not parse latitude "${lat}" as a number (with optional hemisphere letter).`);
if (lonNorm === null) console.error(`WARNING: could not parse longitude "${lon}" as a number (with optional hemisphere letter).`);

console.log(JSON.stringify({
  place_normalized: ve(place),
  country_normalized: be(country),
  latitude_normalized: latNorm,
  longitude_normalized: lonNorm,
  submit_as: `${place}, ${country}, ${latNorm ?? lat}, ${lonNorm ?? lon}`
}, null, 2));
