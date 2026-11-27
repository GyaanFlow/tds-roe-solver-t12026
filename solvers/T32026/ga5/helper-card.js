// The "one line on your exam page" card shared by the GA5 guides.
// Guides are one contiguous HTML block rendered through marked; the portal adds a Copy button to every <pre><code> block
// (addCodeCopyButtons in app.js), so code shown here uses exactly <pre><code>…</code></pre>.
import { card, escapeHtml } from '../p1/ui.js';

export const HELPER_URL = 'https://tds-portal-solver.vercel.app/solvers/T32026/ga5/exam-page.js';
export const HELPER_LINE = `await import("${HELPER_URL}?v=" + Date.now())`;
export const EXAM_URL = 'https://exam.sanand.workers.dev/tds-2026-09-ga5';
// Same code as the console line, as a bookmark: one click on the exam page, no console and no "allow pasting".
export const BOOKMARKLET = `javascript:(()=>{import("${HELPER_URL}?v="+Date.now()).catch(e=>alert("GA5 helper could not load: "+e.message))})()`;

/** A code block the portal will give a Copy button. */
export const codeBlock = (text, lang = '') => `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapeHtml(text)}</code></pre>`;

export function helperCard() {
  registerHelperActions();
  return card('Fastest way: fill Q1 to Q4 on your exam page', [
    '<div class="p1-actions" style="margin:0 0 12px">',
    '<button type="button" class="p1-btn" onclick="window._t3ga5help && window._t3ga5help.copyAndOpen(this)">📋 Copy the line &amp; open the exam</button>',
    '<button type="button" class="p1-btn ghost" onclick="window._t3ga5help && window._t3ga5help.copy(this)">Copy the line only</button>',
    '</div>',
    '<div id="t3ga5-help-status" class="p1-status" role="status" aria-live="polite" style="margin:0 0 10px"></div>',
    '<p class="p1-foot" style="margin:0 0 8px">Needs a computer browser (Chrome, Edge, Firefox or Safari): phones cannot open the console.</p>',
    '<ol>',
    `<li>Open your signed-in <a href="${EXAM_URL}" target="_blank" rel="noopener noreferrer">GA5 exam page</a> and wait until all five questions show.</li>`,
    '<li>Open the console: <strong>Ctrl + Shift + J</strong> (Windows/Linux) or <strong>Cmd + Option + J</strong> (Mac).</li>',
    '<li>Paste the line and press <strong>Enter</strong>. If the console refuses the paste, type <code>allow pasting</code> yourself, press Enter, and paste again.</li>',
    '</ol>',
    codeBlock(HELPER_LINE, 'javascript'),
    '<details style="margin:10px 0 0"><summary>No console? Use a one-click bookmark instead</summary><div class="p1-inner">',
    '<p>Drag this button to your bookmarks bar once (press <strong>Ctrl + Shift + B</strong> / <strong>Cmd + Shift + B</strong> if the bar is hidden). Then, on the signed-in exam page, just click the bookmark.</p>',
    `<p><a class="p1-btn ghost" onclick="return false" draggable="true" href="${escapeHtml(BOOKMARKLET)}" title="Drag me to your bookmarks bar">⭐ GA5 helper</a></p>`,
    '<p class="p1-foot">Clicking it here does nothing on purpose: it only works on the exam page. It loads exactly the same file as the console line.</p>',
    '</div></details>',
    '<p style="margin-top:12px">A small panel on the exam page shows progress: Q1 and Q4 get your own endpoint URLs, Q2 gets your matrix, and Q3 downloads your frames and tracks your ball in your browser (a minute or two). It <strong>never presses Check or Save</strong> and does not do Q5, which is your own peer review.</p>',
    '<p class="p1-foot">Code you paste into a console can act as you on that page. This one only reads your sign-in details to ask the exam site for your own data; its source is public at the address above.</p>',
  ].join(''), 'accent');
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ghost = document.createElement('textarea');
    ghost.value = text;
    ghost.setAttribute('readonly', 'true');
    ghost.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
    document.body.appendChild(ghost);
    ghost.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ghost.remove();
    return ok;
  }
}

function flash(btn, text) {
  if (!btn) return;
  const original = btn.dataset.label || btn.textContent;
  btn.dataset.label = original;
  btn.textContent = text;
  setTimeout(() => { btn.textContent = btn.dataset.label; }, 1800);
}

export function registerHelperActions() {
  if (typeof window === 'undefined' || window._t3ga5help) return;
  const say = (text, ok) => {
    const el = document.getElementById('t3ga5-help-status');
    if (el) { el.textContent = text; el.style.color = ok ? '#34d399' : '#f87171'; }
  };
  window._t3ga5help = {
    async copy(btn) {
      const ok = await copyText(HELPER_LINE);
      flash(btn, ok ? 'Copied ✓' : 'Copy failed');
      say(ok ? 'Copied. On the exam page open the console (Ctrl + Shift + J) and paste it.' : 'Your browser blocked copying: select the line below and copy it by hand.', ok);
    },
    async copyAndOpen(btn) {
      // open first, inside the click, so pop-up blockers allow the new tab
      // ('noopener' as a window feature makes window.open return null, which would hide a blocked pop-up)
      const tab = window.open(EXAM_URL, '_blank');
      if (tab) { try { tab.opener = null; } catch { /* cross-origin: already isolated */ } }
      const ok = await copyText(HELPER_LINE);
      flash(btn, ok ? 'Copied ✓' : 'Copy failed');
      if (ok) say(tab === null ? 'Copied. Your browser blocked the new tab: open the GA5 exam yourself, then press Ctrl + Shift + J and paste.' : 'Copied and the exam is opening. Wait until the questions show, press Ctrl + Shift + J, then paste and press Enter.', true);
      else say('Your browser blocked copying: select the line below and copy it by hand.', false);
    },
  };
}
