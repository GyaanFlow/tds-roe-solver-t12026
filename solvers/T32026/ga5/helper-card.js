// The "one line on your exam page" card shared by the GA5 guides.
import { card, escapeHtml } from '../p1/ui.js';

export const HELPER_URL = 'https://tds-portal-solver.vercel.app/solvers/T32026/ga5/exam-page.js';
export const HELPER_LINE = `await import("${HELPER_URL}?v=" + Date.now())`;

export function helperCard() {
  return card('Fastest way: fill Q1 to Q4 on your exam page', [
    '<ol><li>Open your signed-in <a href="https://exam.sanand.workers.dev/tds-2026-09-ga5" target="_blank" rel="noopener noreferrer">GA5 exam page</a> and wait until all questions show.</li>',
    '<li>Press <strong>Ctrl + Shift + J</strong> (Mac: Cmd + Option + J) to open the console. If it blocks pasting, type <code>allow pasting</code> and press Enter.</li>',
    '<li>Paste this line and press Enter:</li></ol>',
    `<pre class="mono" style="white-space:pre-wrap;word-break:break-all">${escapeHtml(HELPER_LINE)}</pre>`,
    '<p>A small panel shows progress: Q1 and Q4 get your own endpoint URLs, Q2 gets your matrix, and Q3 downloads your frames and tracks your ball in your browser (a minute or two). It <strong>never presses Check or Save</strong> and does not do Q5, which is your own peer review.</p>',
    '<p class="p1-foot">Code you paste into a console can act as you on that page. This one only reads your sign-in details to ask the exam site for your own data; its source is public at the address above.</p>',
  ].join(''), 'accent');
}
