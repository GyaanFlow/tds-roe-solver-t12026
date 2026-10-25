// Pure helpers for the three face questions (3D model, morph video, morph ranking). No DOM, no network.
// The limits mirror the official exam bundle: GLB <= 2,000,000 bytes, video < 100,000 bytes, ranking = each of 1..10 once.

export const GLB_MAX_BYTES = 2000000;
export const VIDEO_MAX_BYTES = 100000; // the exam rejects 100,000 and above
export const PAIR_COUNT = 10;

const clean = (value) => String(value ?? '').trim();

/** Validates a hosted-file link before the student pastes it into the exam. `ext` is 'glb' or a list like ['mp4','webm']. */
export function checkHostedUrl(raw, ext) {
  const exts = [].concat(ext).map((e) => e.toLowerCase());
  const text = clean(raw);
  if (!text) return { ok: false, code: 'EMPTY', message: 'Paste the link first.' };
  let url;
  try { url = new URL(text); } catch { return { ok: false, code: 'NOT_URL', message: 'That is not a web address. It must start with https://' }; }
  if (url.protocol !== 'https:') return { ok: false, code: 'NOT_HTTPS', message: 'The link must start with https:// (not http://).' };
  const host = url.hostname.toLowerCase();
  if (host === 'github.com' && /\/blob\//.test(url.pathname)) {
    return { ok: false, code: 'GITHUB_BLOB', message: 'That is GitHub\'s preview page. Open the file on GitHub, press the Raw button, and copy that address (it starts with https://raw.githubusercontent.com/).' };
  }
  if (host === 'github.com' && /\/tree\//.test(url.pathname)) return { ok: false, code: 'GITHUB_TREE', message: 'That is a folder page. Link to the file itself using its Raw button.' };
  if (/(^|\.)(drive|docs)\.google\.com$/.test(host) || /(^|\.)dropbox\.com$/.test(host) || /(^|\.)wetransfer\.com$/.test(host)) {
    return { ok: false, code: 'SHARE_PAGE', message: 'File-sharing pages do not send the file directly and usually block the exam check. Host it on a GitHub repository instead and use the Raw link.' };
  }
  const last = decodeURIComponent(url.pathname.split('/').pop() || '').toLowerCase();
  if (!exts.some((e) => last.endsWith(`.${e}`))) {
    return { ok: false, code: 'WRONG_EXT', message: `The link should end with .${exts.join(' or .')} (this one ends with "${last || 'nothing'}").` };
  }
  const warn = host === 'github.com' ? [] : host === 'raw.githubusercontent.com' ? [] : ['Make sure this host allows other websites to download the file (CORS). Raw GitHub links do.'];
  return { ok: true, url: url.toString(), warnings: warn };
}

/** Builds the Raw GitHub link from the three things a student sees on GitHub. */
export function rawGithubUrl(user, repo, file, branch = 'main') {
  const safe = (value) => clean(value).replace(/^\/+|\/+$/g, '');
  const parts = [safe(user), safe(repo), safe(branch), safe(file)];
  if (parts.some((p) => !p || /[\s?#]/.test(p))) return null;
  if (!/^[A-Za-z0-9-]+$/.test(parts[0]) || !/^[A-Za-z0-9._-]+$/.test(parts[1])) return null;
  return `https://raw.githubusercontent.com/${parts[0]}/${parts[1]}/${parts[2]}/${parts[3].split('/').map(encodeURIComponent).join('/')}`;
}

/** Same rule as the exam: ten whole numbers 1..10, each exactly once, separated by commas or spaces. */
export function validateOrder(raw) {
  const parts = clean(raw).split(/[\s,]+/).filter(Boolean);
  const nums = parts.map(Number);
  const ok = parts.length === PAIR_COUNT && nums.every((n, i) => Number.isInteger(n) && String(n) === parts[i] && n >= 1 && n <= PAIR_COUNT) && new Set(nums).size === PAIR_COUNT;
  return ok ? { ok: true, order: nums, text: nums.join(',') } : { ok: false, message: 'Enter each pair number from 1 to 10 exactly once, easiest first, separated by commas.' };
}

/**
 * How hard a face pair is to morph, from what the student sees. Each trait is 0 (same) .. 2 (very different).
 * Bigger score = harder. Weights come from what usually breaks a morph: pose and gender/age/hair/face shape, then accessories.
 */
export const TRAITS = [
  { key: 'pose', label: 'Head angle / pose', weight: 3, hint: '0 = both facing the same way, 2 = one is turned or tilted a lot' },
  { key: 'gender', label: 'Gender look', weight: 2.5, hint: '0 = same, 2 = clearly different' },
  { key: 'age', label: 'Age', weight: 2, hint: '0 = similar age, 2 = very different (e.g. young vs old)' },
  { key: 'hair', label: 'Hair (length, style, covering the face)', weight: 2, hint: '0 = similar, 2 = very different (e.g. bald vs long hair)' },
  { key: 'faceShape', label: 'Face shape and size in the photo', weight: 2, hint: '0 = similar, 2 = very different (round vs long, close-up vs far)' },
  { key: 'glasses', label: 'Glasses / beard / hat', weight: 1.5, hint: '0 = same, 1 = one has it, 2 = one has several' },
  { key: 'skin', label: 'Skin tone / lighting', weight: 1.5, hint: '0 = same, 2 = very different' },
  { key: 'expression', label: 'Expression (smile, open mouth)', weight: 1, hint: '0 = same, 2 = very different' },
];

export function difficulty(ratings) {
  const bad = [];
  let score = 0;
  for (const trait of TRAITS) {
    const raw = ratings?.[trait.key];
    const value = raw === '' || raw === undefined || raw === null ? 0 : Number(raw);
    if (!Number.isFinite(value) || value < 0 || value > 2) { bad.push(trait.label); continue; }
    score += value * trait.weight;
  }
  return { score, bad };
}

/** `pairs` is [{number, ratings}] for numbers 1..10; returns the easiest-first order (ties: lower number first). */
export function rankPairs(pairs) {
  if (!Array.isArray(pairs) || pairs.length !== PAIR_COUNT) return { ok: false, message: 'Rate all 10 pairs first.' };
  const seen = new Set();
  const scored = [];
  for (const pair of pairs) {
    const n = Number(pair?.number);
    if (!Number.isInteger(n) || n < 1 || n > PAIR_COUNT || seen.has(n)) return { ok: false, message: 'Pair numbers must be 1 to 10, each once.' };
    seen.add(n);
    const d = difficulty(pair.ratings);
    if (d.bad.length) return { ok: false, message: `Pair ${n}: use 0, 1 or 2 for ${d.bad.join(', ')}.` };
    scored.push({ number: n, score: d.score });
  }
  scored.sort((a, b) => a.score - b.score || a.number - b.number);
  return { ok: true, order: scored.map((s) => s.number), text: scored.map((s) => s.number).join(','), scores: scored };
}

/**
 * Plans the bitrate attempts for a morph video so it ends under the exam's size limit.
 * Returns bits-per-second values from best quality down to smallest.
 */
export function bitrateLadder(seconds, limitBytes = VIDEO_MAX_BYTES) {
  const s = Number.isFinite(seconds) && seconds > 0 ? seconds : 2;
  const budget = Math.floor(((limitBytes * 0.8) * 8) / s); // leave 20% for container overhead
  const ladder = [budget, Math.floor(budget * 0.75), Math.floor(budget * 0.55), Math.floor(budget * 0.4), Math.floor(budget * 0.28)];
  return [...new Set(ladder.filter((b) => b >= 20000))];
}

/** The file-type check the exam applies to the first bytes of the video (MP4 "ftyp" or WebM/Matroska header). */
export function sniffVideo(bytes) {
  if (!bytes || bytes.length < 16) return { ok: false, message: 'Video file is too small to be valid.' };
  if (bytes.length >= VIDEO_MAX_BYTES) return { ok: false, message: 'Video must be under 100 KB (100,000 bytes).' };
  const ftyp = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]) === 'ftyp';
  const webm = bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3;
  if (!ftyp && !webm) return { ok: false, message: 'Submit a valid MP4 or WebM video file.' };
  return { ok: true, type: ftyp ? 'video/mp4' : 'video/webm', bytes: bytes.length };
}

/** Smoothstep easing for the dissolve (0..1). */
export const ease = (t) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };
