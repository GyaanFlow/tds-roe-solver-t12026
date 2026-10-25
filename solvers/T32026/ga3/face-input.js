// Turns what a student pastes (their personal questionData link, or the JSON that link shows) into the faces assigned to
// them, and turns face landmarks into the 0-2 ratings used for the morph ranking. Pure code: no DOM, no network.

export const EXAM_HOST = 'exam.sanand.workers.dev';
export const QUESTION_IDS = { q6: 'q-3d-face-model', q7: 'q-face-morph-video', q8: 'q-face-morph-rank' };

const httpsUrl = (value) => {
  try {
    const url = new URL(String(value ?? '').trim());
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
};

/**
 * Accepts the questionData link from ANY GA3 face question and re-targets it at `kind` (q6/q7/q8), because the signature
 * identifies the student, not the question. Returns `{ ok, url }` or `{ ok:false, message }`.
 */
export function parseQuestionDataLink(raw, kind) {
  const text = String(raw ?? '').trim();
  if (!text) return { ok: false, code: 'EMPTY', message: 'Paste your personal link first.' };
  if (text.startsWith('{') || text.startsWith('[')) return { ok: false, code: 'JSON', message: 'That looks like data, not a link. Paste it into the second box instead.' };
  let url;
  try { url = new URL(text, `https://${EXAM_HOST}/`); } catch { return { ok: false, code: 'NOT_URL', message: 'That is not a web address.' }; }
  if (url.protocol !== 'https:' || url.hostname !== EXAM_HOST) return { ok: false, code: 'WRONG_HOST', message: `The link must be on ${EXAM_HOST} (copy it from the address of your exam page's questionData request).` };
  if (!/\/questionData\/?$/.test(url.pathname)) return { ok: false, code: 'WRONG_PATH', message: 'The link must contain /questionData (see the steps for how to get it).' };
  const email = url.searchParams.get('email');
  const sign = url.searchParams.get('quizSign');
  if (!email || !sign) return { ok: false, code: 'MISSING', message: 'The link is missing your email or quizSign. Copy the whole address.' };
  const target = new URL(`https://${EXAM_HOST}/questionData`);
  target.searchParams.set('email', email);
  target.searchParams.set('quizSign', sign);
  target.searchParams.set('questionId', QUESTION_IDS[kind]);
  return { ok: true, url: target.toString(), email };
}

const IMAGE_MD = /!\[([^\]]*)\]\(\s*<?(https:\/\/[^\s)>]+)>?\s*\)/g;
const cleanUrl = (raw) => httpsUrl(String(raw).replace(/\\([_*()[\]])/g, '$1'));

/**
 * Reads the faces from the question text copied off the exam page (markdown with ![alt](url) images). Pairs are matched
 * by their alt text ("From face, pair 3", "Start face", "Reference photograph of …"), never by de-duplicating photos,
 * because the same photo can appear in two pairs.
 */
export function extractFromPageText(kind, text) {
  const images = [...String(text ?? '').matchAll(IMAGE_MD)].map((m) => ({ alt: m[1].trim(), url: cleanUrl(m[2]) })).filter((i) => i.url);
  if (kind === 'q6') {
    const hit = images.find((i) => /reference photograph|photograph of/i.test(i.alt)) || images[0];
    if (!hit) return null;
    const title = hit.alt.replace(/^reference photograph of\s*/i, '').trim();
    return { url: hit.url, title };
  }
  if (kind === 'q7') {
    const from = images.find((i) => /^start face$/i.test(i.alt) || /from/i.test(i.alt)) || images[0];
    const to = images.find((i) => /^end face$/i.test(i.alt) || /to/i.test(i.alt)) || images[1];
    return from && to ? { from: { url: from.url }, to: { url: to.url } } : null;
  }
  if (kind === 'q8') {
    const pairs = new Map();
    for (const image of images) {
      const m = /^(from|to) face,?\s*pair\s*(\d+)/i.exec(image.alt);
      if (!m) continue;
      const n = Number(m[2]);
      const entry = pairs.get(n) || { number: n };
      entry[m[1].toLowerCase()] = { url: image.url };
      pairs.set(n, entry);
    }
    return pairs.size ? [...pairs.values()] : null;
  }
  return null;
}

/** Reads the assigned faces from the JSON the questionData endpoint returns, or from the page text copied off the exam. */
export function normalizeAssigned(kind, input) {
  let data = input;
  if (typeof input === 'string') {
    const text = input.trim();
    if (/^[{[]/.test(text)) {
      try { data = JSON.parse(text); } catch { return { ok: false, message: 'That text is not valid JSON. Copy everything the link shows, from the first { or [ to the last } or ].' }; }
    } else {
      data = extractFromPageText(kind, text);
      if (!data) return { ok: false, message: 'No photos found in that text. Copy the whole question from the exam page (select it all and copy), or paste the data the link shows.' };
    }
  }
  if (kind === 'q6') {
    const photo = httpsUrl(data?.url);
    return photo ? { ok: true, title: String(data.title ?? '').slice(0, 120), photo } : { ok: false, message: 'No photograph found in that data (expected a "url").' };
  }
  if (kind === 'q7') {
    const from = httpsUrl(data?.from?.url);
    const to = httpsUrl(data?.to?.url);
    return from && to ? { ok: true, from, to } : { ok: false, message: 'No pair of faces found in that data (expected from.url and to.url).' };
  }
  if (kind === 'q8') {
    if (!Array.isArray(data) || data.length !== 10) return { ok: false, message: 'Expected exactly 10 face pairs in that data.' };
    const pairs = data.map((item) => ({ number: Number(item?.number), from: httpsUrl(item?.from?.url), to: httpsUrl(item?.to?.url) }));
    const numbers = new Set(pairs.map((p) => p.number));
    if (pairs.some((p) => !Number.isInteger(p.number) || p.number < 1 || p.number > 10 || !p.from || !p.to) || numbers.size !== 10) return { ok: false, message: 'Each pair needs a number from 1 to 10 and two https face URLs.' };
    return { ok: true, pairs: pairs.sort((a, b) => a.number - b.number) };
  }
  return { ok: false, message: 'Unknown question.' };
}

/* ---------------------------- landmarks -> ratings ---------------------------- */

const pt = (list, i) => list?.[i];
const dist = (a, b, w = 1, h = 1) => Math.hypot((a.x - b.x) * w, (a.y - b.y) * h);

/**
 * Pose and shape numbers from 468+ MediaPipe face landmarks (normalised 0..1). Returns null without a usable face.
 * yaw: nose offset from the cheek midline as a share of face width (0 = frontal). roll in degrees.
 */
export function faceMetrics(landmarks, width, height) {
  if (!Array.isArray(landmarks) || landmarks.length < 400 || !(width > 0) || !(height > 0)) return null;
  const nose = pt(landmarks, 1); const chin = pt(landmarks, 152); const top = pt(landmarks, 10);
  const left = pt(landmarks, 234); const right = pt(landmarks, 454);
  const eyeL = pt(landmarks, 33); const eyeR = pt(landmarks, 263);
  const lipU = pt(landmarks, 13); const lipL = pt(landmarks, 14);
  if (![nose, chin, top, left, right, eyeL, eyeR, lipU, lipL].every((p) => p && Number.isFinite(p.x) && Number.isFinite(p.y))) return null;
  const faceW = dist(left, right, width, height);
  const faceH = dist(top, chin, width, height);
  if (!(faceW > 0) || !(faceH > 0)) return null;
  const midX = (left.x + right.x) / 2;
  return {
    yaw: ((nose.x - midX) * width) / faceW,
    roll: (Math.atan2((eyeR.y - eyeL.y) * height, (eyeR.x - eyeL.x) * width) * 180) / Math.PI,
    ratio: faceW / faceH,
    size: faceH / height,
    mouth: dist(lipU, lipL, width, height) / faceH,
  };
}

const band = (value, mild, strong) => (value >= strong ? 2 : value >= mild ? 1 : 0);

/** Suggested 0-2 ratings for pose, face shape, expression and lighting from two sets of metrics (+ average brightness 0-255). */
export function suggestRatings(a, b, brightnessA, brightnessB) {
  const out = {};
  if (!a || !b) {
    out.pose = 2; out.faceShape = 1; out.expression = 0; // no face found in one photo: assume the awkward case
  } else {
    const turn = Math.max(band(Math.abs(a.yaw - b.yaw), 0.08, 0.2), band(Math.abs(a.roll - b.roll), 6, 15), Math.min(1, band(Math.max(Math.abs(a.yaw), Math.abs(b.yaw)), 0.15, 0.3)));
    out.pose = turn;
    out.faceShape = Math.max(band(Math.abs(a.ratio - b.ratio), 0.05, 0.12), band(Math.abs(a.size - b.size) / Math.max(a.size, b.size), 0.25, 0.5));
    out.expression = band(Math.abs(a.mouth - b.mouth), 0.025, 0.06);
  }
  out.skin = Number.isFinite(brightnessA) && Number.isFinite(brightnessB) ? band(Math.abs(brightnessA - brightnessB), 30, 60) : 0;
  return out;
}
