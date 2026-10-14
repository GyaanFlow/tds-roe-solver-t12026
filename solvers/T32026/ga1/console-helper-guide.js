// Shared "Console helper" section for the Q9 and Q13 guides. The helper itself lives in
// console/t3-ga1-helper.js (served by the portal) and runs on the student's own exam page.

export const HELPER_PATH = 'console/t3-ga1-helper.js';
export const HELPER_EXAM_URL = 'https://exam.sanand.workers.dev/tds-2026-09-ga1';

const BUTTON_STYLE = 'background:var(--theme-primary,#3b82f6);color:#000;border:none;border-radius:8px;padding:9px 16px;font-weight:700;font-size:13px;cursor:pointer;';

/** Markdown (with one small HTML control block) explaining how to use the helper for one question. */
export function helperSection(question) {
  const steps = question === 'q9'
    ? [
        '3. Run `t3ga1.q9.commands()` and run the printed commands in **your own terminal** (needs `git` and the GitHub CLI `gh`). They create a public repo, push the ready-made `index.html` and turn on Pages.',
        '4. When your site is live, run `await t3ga1.q9.check("https://YOUR-USER.github.io/tds-ga1-portfolio/")`. It downloads your live page, confirms your email is really inside the `<!--email_off-->` markers, and only then fills the answer box.',
      ]
    : [
        '3. Run `t3ga1.q13.commands()` and run the printed workflow in **your own terminal**: `termlog login`, `termlog rec`, fetch your challenge, try the six real decodings, `exit`, then pack and upload `submission.tar.gz`.',
        '4. Run `await t3ga1.q13.check("https://…/submission.tar.gz")`. It checks that the link downloads a gzip archive (when the host allows it) and fills the answer box.',
      ];
  return [
    '### ⚡ Console helper (optional, runs only on your own exam page)',
    '',
    '<div style="border:1px solid var(--border,#2d4d80);border-radius:12px;padding:14px;margin:10px 0;background:rgba(77,166,255,0.06);">'
      + `<button type="button" onclick="window._t3ga1CopyHelper()" style="${BUTTON_STYLE}">📋 Copy helper script</button> `
      + `<a href="${HELPER_PATH}" target="_blank" rel="noopener noreferrer" style="margin-left:8px;font-size:13px;">view the script</a>`
      + '<div id="t3HelperStatus" role="status" style="margin-top:8px;font-size:13px;min-height:18px;"></div></div>',
    '',
    `1. Open your exam page — [${HELPER_EXAM_URL}](${HELPER_EXAM_URL}) — logged in, then press **F12** and open the **Console** tab. (If Chrome warns about pasting, type \`allow pasting\` first.)`,
    '2. Press **Copy helper script**, paste it into the console and press Enter. It prints a menu and adds a `t3ga1` object.',
    ...steps,
    '',
    '**What the helper does and does not do**',
    '',
    '- It reads your email and signed link from the page you are already logged in to, and uses them only to print commands for you. Nothing is sent anywhere; its only network request is a GET of the public URL you ask it to check.',
    '- It does **not** fake any check, answer for you, or record the terminal session — the page must really be published and the recording must really be yours.',
    '- Read it before you paste it: it is one short file (link above).',
  ].join('\n');
}

export function registerHelperCopy() {
  if (typeof window === 'undefined' || window._t3ga1CopyHelperRegistered) return;
  window._t3ga1CopyHelperRegistered = true;
  window._t3ga1CopyHelper = async function t3ga1CopyHelper() {
    const status = document.getElementById('t3HelperStatus');
    const show = (text, color) => {
      if (!status) return;
      status.style.color = color;
      status.textContent = text;
    };
    try {
      const response = await fetch(new URL(HELPER_PATH, document.baseURI).href, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
      show('Copied. Now paste it into the console on your exam page.', '#198754');
    } catch (error) {
      show(`Could not copy automatically (${error?.message || 'blocked'}). Use “view the script”, select all, copy, and paste it into the console.`, '#e5484d');
    }
  };
}
