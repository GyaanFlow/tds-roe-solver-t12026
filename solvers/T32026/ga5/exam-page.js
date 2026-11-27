// GA5 one-line helper, run by the student in the browser console of their own signed-in GA5 exam page:
//   await import("https://tds-portal-solver.vercel.app/solvers/T32026/ga5/exam-page.js")
// It fills Q1 and Q4 (their endpoint URLs), computes the Q2 matrix, and tracks the Q3 ball from their own frames.
// It never presses Check or Save, never touches Q5 (peer review is done by the student), and sends their sign-in data
// nowhere except the exam site itself.
import { t3ga5Url, wakeApi } from './api-client.js';
import { buildMatrix } from './matrix.js';
import { decodePng, describeFrame, trackBall } from './tracker.js';
import { parseFrames } from './ga5-tools.js';

export const EXAM_HOST = 'exam.sanand.workers.dev';
export const IDS = {
  rag: 'q-rag-colosseum-server',
  ollama: 'q-ollama-faiss-rank-correlation-server',
  ball: 'q-ball-tracker-server',
  harness: 'q-harness-safety-router-server',
  review: 'q-time-use-review-server',
};

/** Reads the signed-in student from the exam page's storage. */
export function readUser(storage) {
  try {
    const user = JSON.parse(storage.getItem('user') || 'null');
    const email = String(user?.email ?? '').trim();
    const quizSign = String(user?.quizSign ?? '');
    return email.includes('@') ? { email, quizSign } : null;
  } catch {
    return null;
  }
}

// The exam draws Q1's box as <input id="rag-colosseum-url" name="q-rag-colosseum-server">; the other boxes use the
// question id as their element id.
const FIELD_ALIASES = { 'q-rag-colosseum-server': ['rag-colosseum-url'] };

/** A question's input, looked up by element id, then a known alias, then its name attribute. */
export function findField(doc, id) {
  return doc.getElementById(id)
    || (FIELD_ALIASES[id] || []).map((alias) => doc.getElementById(alias)).find(Boolean)
    || doc.querySelector?.(`input[name="${id}"], textarea[name="${id}"]`)
    || null;
}

/** Waits for the exam to draw its questions. Resolves true as soon as any GA5 box exists. */
export async function waitForQuestions(doc, { tries = 40, delayMs = 500, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
  for (let attempt = 0; attempt < tries; attempt += 1) {
    if (Object.values(IDS).some((id) => findField(doc, id))) return true;
    await sleep(delayMs);
  }
  return false;
}

/** Puts a value into an exam field the way typing would. Returns false when the field is missing or locked. */
export function setField(doc, id, value, EventClass = globalThis.Event) {
  const field = findField(doc, id);
  if (!field || field.disabled || field.readOnly) return false;
  field.value = value;
  field.dispatchEvent(new EventClass('input', { bubbles: true }));
  field.dispatchEvent(new EventClass('change', { bubbles: true }));
  return field.value === value;
}

/** Downloads the student's own frames from the exam site and tracks the red ball. */
export async function solveBall({ user, origin, fetchImpl, decode = decodePng, onProgress = () => {} }) {
  const url = new URL('/questionData', origin);
  url.searchParams.set('email', user.email);
  url.searchParams.set('quizSign', user.quizSign);
  url.searchParams.set('questionId', IDS.ball);
  const response = await fetchImpl(url.toString(), { cache: 'no-store' });
  if (!response.ok) throw new Error(`The exam site would not send your frames (HTTP ${response.status}). Reload the exam page and run the helper again.`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const parsed = parseFrames(bytes);
  if (!parsed.ok) throw Object.assign(new Error(parsed.message), { frames: bytes, report: { bytes: bytes.length, start: Array.from(bytes.subarray(0, 32)) } });
  const frameAt = (i) => decode(bytes.subarray(parsed.frames[i][0], parsed.frames[i][0] + parsed.frames[i][1]));
  try {
    return await trackBall({ count: parsed.count, targets: parsed.targets, onProgress, frameAt });
  } catch (error) {
    // Keep what is needed to fix the tracker: the frames themselves and a short description of two of them.
    const report = { error: error.message, fps: parsed.fps, frames: parsed.count, targets: parsed.targets };
    try {
      report.firstFrame = describeFrame(await frameAt(0));
      report.lastFrame = describeFrame(await frameAt(parsed.count - 1));
    } catch (inner) {
      report.describeFailed = inner.message;
    }
    throw Object.assign(error, { frames: bytes, report });
  }
}

/**
 * Fills everything that can be filled. `report(key, state, text)` is called as each question progresses
 * (state: 'working', 'done' or 'failed'). One failing question never stops the others.
 */
export async function fillAll({ doc, user, origin, random, fetchImpl = globalThis.fetch.bind(globalThis), decode = decodePng, report = () => {}, EventClass, wake = wakeApi, onBallFailure = () => {} }) {
  const done = {};
  const put = (key, value, note) => {
    if (setField(doc, IDS[key], value, EventClass)) { done[key] = value; report(key, 'done', note); return; }
    report(key, 'failed', 'The answer box was not found or is locked. Copy it by hand: ' + value);
  };
  const guard = async (key, work) => {
    try { await work(); } catch (error) { report(key, 'failed', error?.message || String(error)); }
  };
  await guard('rag', async () => { put('rag', t3ga5Url(user.email), 'Endpoint URL filled.'); });
  await guard('harness', async () => { put('harness', t3ga5Url(user.email, '/harness'), 'Endpoint URL filled.'); });
  await guard('ollama', async () => { report('ollama', 'working', 'Computing your matrix…'); put('ollama', buildMatrix(user.email, random).text, 'Matrix computed and filled.'); });
  report('server', 'working', 'Waking your API server…');
  const awake = wake({ onStatus: () => {} }).then((r) => report('server', r.ok ? 'done' : 'failed', r.ok ? 'Server awake: you can Check Q1 and Q4.' : 'The server did not wake; wait a minute before checking Q1 and Q4.'));
  await guard('ball', async () => {
    report('ball', 'working', 'Downloading your frames…');
    try {
      const result = await solveBall({ user, origin, fetchImpl, decode, onProgress: (f, n) => report('ball', 'working', `Tracking your ball: frame ${f} of ${n}`) });
      put('ball', result.answer, `Number ${result.number} read; positions filled.${result.margin < 3 ? ' Two balls came very close once: double-check in the viewer.' : ''}`);
    } catch (error) {
      if (error?.frames) onBallFailure({ frames: error.frames, report: error.report });
      throw error;
    }
  });
  report('review', 'manual', 'Do the poster review yourself, then paste your signed receipt.');
  await awake;
  return done;
}

const LABELS = { rag: 'Q1 RAG', ollama: 'Q2 matrix', ball: 'Q3 ball', harness: 'Q4 harness', review: 'Q5 review', server: 'API server' };
const ICON = { working: '⏳', done: '✅', failed: '❌', manual: '✍️' };

function panel(doc) {
  doc.getElementById('tds-ga5-panel')?.remove();
  const box = doc.createElement('div');
  box.id = 'tds-ga5-panel';
  box.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:99999;max-width:360px;max-height:70vh;overflow:auto;padding:14px 16px;border-radius:12px;background:#111827;color:#f9fafb;font:13px/1.5 system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.4)';
  const title = doc.createElement('div');
  title.style.cssText = 'display:flex;justify-content:space-between;gap:12px;font-weight:700;margin-bottom:6px';
  title.textContent = 'GA5 helper';
  const close = doc.createElement('button');
  close.type = 'button'; close.textContent = 'Close';
  close.style.cssText = 'background:transparent;color:#93c5fd;border:0;cursor:pointer';
  close.onclick = () => box.remove();
  title.append(close);
  box.append(title);
  const rows = {};
  for (const key of Object.keys(LABELS)) {
    const row = doc.createElement('div');
    row.textContent = `⬜ ${LABELS[key]}`;
    rows[key] = row; box.append(row);
  }
  const foot = doc.createElement('div');
  foot.style.cssText = 'margin-top:8px;color:#9ca3af';
  foot.textContent = 'Nothing is submitted for you. Read the boxes, then press Check and Save yourself.';
  box.append(foot);
  doc.body.append(box);
  const report = (key, state, text) => { if (rows[key]) rows[key].textContent = `${ICON[state] || '⬜'} ${LABELS[key]}: ${text}`; };
  // When Q3 fails: print what was seen, and let the student keep the frames file (to open in the viewer or to report).
  report.ballFailed = ({ frames, report: seen }) => {
    console.log('GA5 Q3 report (copy this when asking for help):\n' + JSON.stringify(seen));
    const save = doc.createElement('a');
    save.textContent = 'Save my frames file (for the viewer or to report the problem)';
    save.download = 'ga5-frames.bin';
    save.href = URL.createObjectURL(new Blob([frames], { type: 'application/octet-stream' }));
    save.style.cssText = 'display:block;margin-top:8px;color:#93c5fd';
    box.append(save);
  };
  return report;
}

/** Entry point when imported on the exam page. */
export async function run(env = globalThis) {
  const { document: doc, location, localStorage } = env;
  if (!doc || location?.hostname !== EXAM_HOST) throw new Error(`Open your signed-in GA5 exam page on ${EXAM_HOST} first, then run this line in that page's console.`);
  const user = readUser(localStorage);
  if (!user) throw new Error('Sign in on the exam page first, then run this line again.');
  if (!(await waitForQuestions(doc))) throw new Error('This page does not show the GA5 questions. Open the GA5 exam, sign in, wait until the questions appear, then run the line again.');
  const { default: seedrandom } = await import('https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm');
  const report = panel(doc);
  return fillAll({ doc, user, origin: location.origin, random: seedrandom, report, onBallFailure: report.ballFailed, EventClass: env.Event });
}

if (typeof window !== 'undefined' && window.location?.hostname === EXAM_HOST) {
  run(window).catch((error) => console.error(`GA5 helper: ${error.message}`));
}
