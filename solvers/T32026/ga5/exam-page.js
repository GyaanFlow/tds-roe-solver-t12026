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
    const result = await trackBall({ count: parsed.count, targets: parsed.targets, onProgress, frameAt });
    return Object.assign(result, { frames: bytes });
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
 * Fills everything that can be filled. `report(key, state, text, extra)` is called as each question progresses
 * (state: 'working', 'done', 'failed' or 'manual'; extra may carry {value, progress, frames}). One failing question
 * never stops the others.
 */
export async function fillAll({ doc, user, origin, random, fetchImpl = globalThis.fetch.bind(globalThis), decode = decodePng, report = () => {}, EventClass, wake = wakeApi, onBallFailure = () => {} }) {
  const done = {};
  const put = (key, value, note, extra = {}) => {
    if (setField(doc, IDS[key], value, EventClass)) { done[key] = value; report(key, 'done', note, { value, ...extra }); return; }
    report(key, 'failed', 'The answer box was not found or is locked. Use Copy and paste it yourself.', { value, ...extra });
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
    report('ball', 'working', 'Downloading your frames…', { progress: 0 });
    try {
      const result = await solveBall({ user, origin, fetchImpl, decode, onProgress: (f, n) => report('ball', 'working', `Tracking your ball: frame ${f} of ${n}`, { progress: n ? f / n : 0 }) });
      const close = result.margin < 3;
      put('ball', result.answer, `Number ${result.number} read; positions filled.${close ? ' Two balls came very close once: save your frames and double-check in the viewer.' : ''}`,
        { progress: 1, frames: close ? result.frames : undefined });
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
const AUTOMATIC = ['rag', 'ollama', 'ball', 'harness'];
const PANEL_CSS = `
#tds-ga5-panel{position:fixed;right:16px;bottom:16px;z-index:99999;width:min(380px,calc(100vw - 32px));max-height:75vh;overflow:auto;
  border-radius:14px;background:#0f172a;color:#f1f5f9;font:13px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 12px 36px rgba(0,0,0,.45);border:1px solid #1e293b}
#tds-ga5-panel *{box-sizing:border-box}
#tds-ga5-panel .g5-head{position:sticky;top:0;display:flex;align-items:center;gap:8px;padding:10px 12px;background:#111c33;border-bottom:1px solid #1e293b;border-radius:14px 14px 0 0}
#tds-ga5-panel .g5-title{font-weight:750;flex:1}
#tds-ga5-panel button{font:inherit;cursor:pointer;border-radius:8px}
#tds-ga5-panel .g5-icon{background:transparent;border:0;color:#93c5fd;padding:2px 8px;font-size:15px;line-height:1}
#tds-ga5-panel .g5-icon:hover,#tds-ga5-panel .g5-icon:focus-visible{background:#1e293b;outline:none}
#tds-ga5-panel .g5-body{padding:10px 12px 12px}
#tds-ga5-panel .g5-summary{margin:0 0 8px;padding:6px 10px;border-radius:8px;background:#1e293b;font-weight:650}
#tds-ga5-panel .g5-row{padding:7px 0;border-bottom:1px solid #1e293b}
#tds-ga5-panel .g5-row:last-of-type{border-bottom:0}
#tds-ga5-panel .g5-line{display:flex;gap:6px;align-items:flex-start}
#tds-ga5-panel .g5-text{flex:1;word-break:break-word}
#tds-ga5-panel .g5-label{font-weight:650}
#tds-ga5-panel .g5-acts{display:flex;gap:6px;margin:5px 0 0 22px;flex-wrap:wrap}
#tds-ga5-panel .g5-btn{background:#1e293b;border:1px solid #334155;color:#e2e8f0;padding:2px 10px;font-size:12px}
#tds-ga5-panel .g5-btn:hover,#tds-ga5-panel .g5-btn:focus-visible{border-color:#60a5fa;outline:none}
#tds-ga5-panel .g5-bar{height:6px;margin:6px 0 0 22px;border-radius:3px;background:#1e293b;overflow:hidden}
#tds-ga5-panel .g5-bar>span{display:block;height:100%;width:0;background:linear-gradient(90deg,#3b82f6,#22d3ee);transition:width .25s}
#tds-ga5-panel .g5-next{margin-top:10px;padding:8px 10px;border-radius:8px;border:1px solid #1d4ed8;background:#0b1f4a;color:#dbeafe}
#tds-ga5-panel .g5-foot{margin-top:10px;color:#94a3b8;font-size:12px}
#tds-ga5-panel .g5-foot-acts{display:flex;gap:8px;margin-top:8px}
#tds-ga5-panel a{color:#93c5fd}
#tds-ga5-panel.g5-min .g5-body{display:none}
.tds-ga5-flash{outline:3px solid #22d3ee !important;outline-offset:3px;transition:outline-color .3s}
`;

async function copyText(doc, text) {
  try {
    await globalThis.navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ghost = doc.createElement('textarea');
    ghost.value = text;
    ghost.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    doc.body.append(ghost);
    ghost.select();
    let ok = false;
    try { ok = doc.execCommand('copy'); } catch { ok = false; }
    ghost.remove();
    return ok;
  }
}

/** The floating progress panel. Returns report(key, state, text, extra) with report.ballFailed attached. */
export function panel(doc, { onRerun } = {}) {
  doc.getElementById('tds-ga5-panel')?.remove();
  if (!doc.getElementById('tds-ga5-style')) {
    const style = doc.createElement('style');
    style.id = 'tds-ga5-style';
    style.textContent = PANEL_CSS;
    doc.head.append(style);
  }
  const el = (tag, cls, text) => { const n = doc.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const box = el('div');
  box.id = 'tds-ga5-panel';
  box.setAttribute('role', 'region');
  box.setAttribute('aria-label', 'GA5 helper progress');

  const head = el('div', 'g5-head');
  const title = el('div', 'g5-title', 'GA5 helper');
  const minBtn = el('button', 'g5-icon', '–');
  minBtn.type = 'button'; minBtn.title = 'Minimise'; minBtn.setAttribute('aria-label', 'Minimise the panel');
  const closeBtn = el('button', 'g5-icon', '×');
  closeBtn.type = 'button'; closeBtn.title = 'Close (Esc)'; closeBtn.setAttribute('aria-label', 'Close the panel');
  head.append(title, minBtn, closeBtn);

  const body = el('div', 'g5-body');
  const summary = el('div', 'g5-summary', 'Starting…');
  summary.setAttribute('role', 'status');
  summary.setAttribute('aria-live', 'polite');
  body.append(summary);

  const state = {};
  const rows = {};
  for (const key of Object.keys(LABELS)) {
    const row = el('div', 'g5-row');
    const line = el('div', 'g5-line');
    const icon = el('span', '', '⬜');
    const text = el('span', 'g5-text');
    const label = el('span', 'g5-label', LABELS[key]);
    const msg = el('span', '', '');
    text.append(label, msg);
    line.append(icon, text);
    const acts = el('div', 'g5-acts');
    acts.hidden = true;
    row.append(line, acts);
    if (key === 'ball') {
      const bar = el('div', 'g5-bar');
      bar.hidden = true;
      bar.append(el('span'));
      row.append(bar);
      rows[key] = { row, icon, msg, acts, bar };
    } else {
      rows[key] = { row, icon, msg, acts };
    }
    body.append(row);
  }

  const next = el('div', 'g5-next', 'Next: press Check on Q1 and Q4 (server is awake), check Q2 and Q3, do the Q5 review and paste its receipt, then press Save.');
  next.hidden = true;
  body.append(next);
  const foot = el('div', 'g5-foot', 'Nothing is submitted for you. Read each box, then press Check and Save yourself.');
  const footActs = el('div', 'g5-foot-acts');
  if (onRerun) {
    const again = el('button', 'g5-btn', '↻ Run again');
    again.type = 'button';
    again.onclick = () => onRerun();
    footActs.append(again);
  }
  foot.append(footActs);
  body.append(foot);
  box.append(head, body);
  doc.body.append(box);

  const onKey = (event) => { if (event.key === 'Escape') shut(); };
  function shut() { box.remove(); doc.removeEventListener('keydown', onKey); }
  doc.addEventListener('keydown', onKey);
  closeBtn.onclick = shut;
  minBtn.onclick = () => {
    const min = box.classList.toggle('g5-min');
    minBtn.textContent = min ? '+' : '–';
    minBtn.setAttribute('aria-label', min ? 'Expand the panel' : 'Minimise the panel');
  };

  const button = (label, onClick) => { const b = el('button', 'g5-btn', label); b.type = 'button'; b.onclick = onClick; return b; };
  const flash = (b, text) => { const o = b.textContent; b.textContent = text; setTimeout(() => { b.textContent = o; }, 1500); };
  const show = (key) => {
    const field = findField(doc, IDS[key]);
    if (!field) return;
    const target = field.closest?.('.question, .card, details') || field;
    target.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
    field.classList.add('tds-ga5-flash');
    setTimeout(() => field.classList.remove('tds-ga5-flash'), 2200);
    try { field.focus({ preventScroll: true }); } catch { /* not focusable */ }
  };
  const saveLink = (frames, label) => {
    const a = el('a', '', label);
    a.download = 'ga5-frames.bin';
    a.href = URL.createObjectURL(new Blob([frames], { type: 'application/octet-stream' }));
    return a;
  };

  const refresh = () => {
    const filled = AUTOMATIC.filter((k) => state[k] === 'done').length;
    const failed = AUTOMATIC.filter((k) => state[k] === 'failed').length;
    const working = AUTOMATIC.some((k) => state[k] === 'working') || state.server === 'working';
    summary.textContent = working
      ? `Working… ${filled}/4 automatic answers filled`
      : failed
        ? `${filled}/4 filled, ${failed} need attention (see ❌ below)`
        : `${filled}/4 automatic answers filled. Q5 is yours to do.`;
    summary.style.background = !working && !failed && filled === 4 ? '#064e3b' : failed && !working ? '#4c0519' : '#1e293b';
    next.hidden = working || filled === 0;
  };

  const report = (key, st, text, extra = {}) => {
    const r = rows[key];
    if (!r) return;
    state[key] = st;
    r.icon.textContent = ICON[st] || '⬜';
    r.msg.textContent = text ? `: ${text}` : '';
    if (r.bar) {
      const working = st === 'working' && typeof extra.progress === 'number';
      r.bar.hidden = !working;
      if (working) r.bar.firstChild.style.width = `${Math.round(Math.min(1, Math.max(0, extra.progress)) * 100)}%`;
    }
    if (st !== 'working') {
      r.acts.replaceChildren();
      if (findField(doc, IDS[key]) && key !== 'server') r.acts.append(button('Show', () => show(key)));
      if (extra.value) {
        const copy = button('Copy', async () => flash(copy, (await copyText(doc, extra.value)) ? 'Copied ✓' : 'Copy failed'));
        r.acts.append(copy);
      }
      if (extra.frames) r.acts.append(saveLink(extra.frames, 'Save frames for the viewer'));
      r.acts.hidden = !r.acts.childElementCount;
    }
    refresh();
  };
  // When Q3 fails: print what was seen, and let the student keep the frames file (to open in the viewer or to report).
  report.ballFailed = ({ frames, report: seen }) => {
    console.log('GA5 Q3 report (copy this when asking for help):\n' + JSON.stringify(seen));
    const r = rows.ball;
    r.acts.append(saveLink(frames, 'Save my frames file (viewer / report)'));
    r.acts.hidden = false;
  };
  report.close = shut;
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
  const report = panel(doc, { onRerun: () => run(env).catch((error) => console.error(`GA5 helper: ${error.message}`)) });
  return fillAll({ doc, user, origin: location.origin, random: seedrandom, report, onBallFailure: report.ballFailed, EventClass: env.Event });
}

if (typeof window !== 'undefined' && window.location?.hostname === EXAM_HOST) {
  run(window).catch((error) => {
    console.error(`GA5 helper: ${error.message}`);
    try { window.alert(`GA5 helper: ${error.message}`); } catch { /* no dialogs */ }
  });
}
