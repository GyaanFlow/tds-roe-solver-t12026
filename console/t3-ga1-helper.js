/* T3 2026 GA1 — console helper for Q9 (GitHub Pages) and Q13 (termlog).
 *
 * Paste this into the browser console on YOUR logged-in exam page:
 *   https://exam.sanand.workers.dev/tds-2026-09-ga1
 * then run  t3ga1.help()
 *
 * What it does (everything stays in your browser):
 *   - reads your email and signed link from the page you are already logged in to,
 *   - prints commands personalised for you, to run in your OWN terminal,
 *   - checks the page / archive you published, and only then fills the answer box.
 *
 * What it never does: send your email, signature or any login anywhere, fake a server
 * response, or produce the proof of work for you. The only network request it can make is a
 * GET of the public URL you ask it to check.
 */
(() => {
  'use strict';
  const QUIZ = 'tds-2026-09-ga1';
  const EXAM_ORIGIN = 'https://exam.sanand.workers.dev';
  const Q9 = 'q-github-pages';
  const Q13 = 'q-termlog-rec-server';

  if (location.origin !== EXAM_ORIGIN || !location.pathname.includes(QUIZ)) {
    throw new Error(`Open ${EXAM_ORIGIN}/${QUIZ} (logged in), then paste this helper again.`);
  }
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    user = null;
  }
  if (!user || !user.email) throw new Error('You are not logged in (no saved user on this page). Log in, then paste the helper again.');
  const EMAIL = String(user.email).trim();
  const QUIZ_SIGN = String(user.quizSign || '');

  const say = (text) => { console.log(text); return text; };
  const shellQuote = (value) => `'${String(value).replace(/'/g, `'"'"'`)}'`;
  const escapeHtml = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Fills an exam answer box the way a keystroke would, so the page's own validation notices it.
  function fill(id, value) {
    const el = document.getElementById(id);
    if (!el) return false;
    const proto = Object.getPrototypeOf(el);
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(el, value); else el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  const currentValue = (id) => String(document.getElementById(id)?.value || '').trim();

  function parseHttps(raw, what) {
    let url;
    try {
      url = new URL(String(raw || '').trim());
    } catch {
      return { ok: false, message: `${what}: that is not a complete URL. Use the full https:// address.` };
    }
    if (url.protocol !== 'https:') return { ok: false, message: `${what}: use an https:// address (plain http is not accepted).` };
    return { ok: true, url };
  }

  /* ------------------------------ Q9: GitHub Pages ------------------------------ */
  function pageHtml() {
    const marked = `<!--email_off-->${escapeHtml(EMAIL)}<!--/email_off-->`;
    return [
      '<!doctype html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="utf-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1">',
      '  <title>My TDS Portfolio</title>',
      '</head>',
      '<body>',
      '  <main>',
      '    <h1>My Tools in Data Science Portfolio</h1>',
      '    <p>This page is published with GitHub Pages.</p>',
      `    <p>Student email: ${marked}</p>`,
      '  </main>',
      '</body>',
      '</html>',
      '',
    ].join('\n');
  }

  const q9 = {
    /** The ready-to-publish index.html (your email is wrapped in the email_off markers). */
    page({ download = false } = {}) {
      const html = pageHtml();
      if (download && typeof Blob === 'function' && typeof document.createElement === 'function') {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
        link.download = 'index.html';
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
      }
      say(html);
      return html;
    },

    /** Commands to run in YOUR terminal (needs git and the GitHub CLI `gh`, logged in with `gh auth login`). */
    commands(repo = 'tds-ga1-portfolio') {
      const name = String(repo).replace(/[^A-Za-z0-9._-]/g, '-').replace(/^[.-]+/, '') || 'tds-ga1-portfolio';
      return say([
        '# Q9 — publish your own GitHub Pages site. Run these in your own terminal.',
        '# Needs git and the GitHub CLI (https://cli.github.com/). Log in first:  gh auth login',
        `mkdir ${name} && cd ${name}`,
        "cat > index.html <<'HTML'",
        pageHtml().trimEnd(),
        'HTML',
        'git init -b main',
        'git add index.html',
        'git commit -m "TDS GA1 portfolio"',
        `gh repo create ${name} --public --source . --push`,
        'gh api -X POST repos/{owner}/{repo}/pages -f "source[branch]=main" -f "source[path]=/"',
        '# Your site address (it can take a minute or two to go live):',
        'gh api repos/{owner}/{repo}/pages --jq .html_url',
        '',
        `# Then, back in this console:  await t3ga1.q9.check('https://YOUR-USER.github.io/${name}/')`,
      ].join('\n'));
    },

    /** Fetches your published page and fills the answer box only if your email is really in it. */
    async check(rawUrl) {
      const target = rawUrl || currentValue(Q9);
      const parsed = parseHttps(target, 'Q9');
      if (!parsed.ok) { console.error(parsed.message); return { ok: false, message: parsed.message }; }
      const url = parsed.url;
      let text;
      try {
        const probe = new URL(url.href);
        probe.searchParams.set('t3ga1', String(Date.now()));
        const response = await fetch(probe.href, { cache: 'no-store', credentials: 'omit' });
        if (!response.ok) {
          const message = `Q9: your page answered HTTP ${response.status}. Check the repository is public, Pages is on (branch main, folder /), and wait for the deployment to finish.`;
          console.error(message);
          return { ok: false, status: response.status, message };
        }
        text = await response.text();
      } catch (error) {
        const message = `Q9: could not read ${url.href} from the browser (${error?.message || 'network error'}). Open it in a new tab to confirm it loads, then try again.`;
        console.error(message);
        return { ok: false, message };
      }
      const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const emailForms = [...new Set([EMAIL, escapeHtml(EMAIL)])].map(escapeRegExp).join('|');
      const wrapped = new RegExp(`<!--\\s*email_off\\s*-->\\s*(?:${emailForms})\\s*<!--\\s*/email_off\\s*-->`, 'i');
      if (!wrapped.test(text)) {
        const bare = text.toLowerCase().includes(EMAIL.toLowerCase());
        const message = bare
          ? 'Q9: your email is on the page but NOT wrapped in <!--email_off-->…<!--/email_off-->, so Cloudflare will hide it from the grader. Wrap it exactly like t3ga1.q9.page() shows, push, and check again.'
          : `Q9: ${EMAIL} was not found on that page. Publish the page from t3ga1.q9.page() (do not change the email) and check again.`;
        console.error(message);
        return { ok: false, message };
      }
      const filled = fill(Q9, url.href);
      const message = filled ? `Q9: found your email on the live page — answer box filled with ${url.href}. Press Check.` : `Q9: page verified. Paste ${url.href} into the answer box and press Check.`;
      console.log(message);
      return { ok: true, url: url.href, filled, message };
    },
  };

  /* ------------------------------ Q13: termlog ------------------------------ */
  const challengeUrl = () => {
    const url = new URL('/questionData', EXAM_ORIGIN);
    url.searchParams.set('email', EMAIL);
    url.searchParams.set('quizSign', QUIZ_SIGN);
    url.searchParams.set('questionId', Q13);
    return url.href;
  };

  const TRANSFORMS = { rot13: "tr 'A-Za-z' 'N-ZA-Mn-za-m'", hex: 'xxd -r -p', reverse: 'rev' };
  const ORDERS = [
    ['rot13', 'hex', 'reverse'], ['rot13', 'reverse', 'hex'], ['hex', 'rot13', 'reverse'],
    ['hex', 'reverse', 'rot13'], ['reverse', 'rot13', 'hex'], ['reverse', 'hex', 'rot13'],
  ];

  const q13 = {
    /** Your personal challenge link (contains your signature — keep it private). */
    url: challengeUrl,

    /** The whole local workflow, with your email and link filled in. Run it in YOUR terminal, in one go. */
    commands() {
      return say([
        '# Q13 — record the decoding with termlog. Run this in your own terminal; the recording is proof YOU did it.',
        '# The code changes every 3 hours: fetch it, decode it and finish the recording in one sitting.',
        '# Install termlog first: https://github.com/mynkpdr/termlog',
        `termlog login            # sign in with ${EMAIL}`,
        'termlog whoami           # check it shows that exact email',
        'mkdir ga1-termlog && cd ga1-termlog',
        'termlog rec demo.cast    # recording starts; everything below happens inside it',
        '',
        `curl -fsS ${shellQuote(challengeUrl())} | tee challenge.txt`,
        '# If the output is JSON, copy just the cipher text into cipher.txt; if it is plain text:',
        'tr -d "\\r\\n " < challenge.txt > cipher.txt',
        '',
        '# The code was put through ROT13, hex and reversal in some order. Try all six real decodings and',
        '# keep the one that gives readable text (not hex or gibberish):',
        ...ORDERS.map((order, index) => `echo "--- order ${index + 1}: ${order.join(' → ')}"; cat cipher.txt | ${order.map((name) => TRANSFORMS[name]).join(' | ')}; echo`),
        '',
        'exit                     # ends the recording; termlog writes demo.cast and demo.cast.jwt',
        `termlog verify demo.cast --expect-email ${shellQuote(EMAIL)}   # optional self-check`,
        'tar -czf submission.tar.gz demo.cast demo.cast.jwt',
        '',
        '# Upload submission.tar.gz somewhere PUBLIC that the exam server can download, for example:',
        '#   GitHub release:  gh release create ga1-termlog submission.tar.gz --repo YOUR-USER/YOUR-REPO --notes "TDS GA1"',
        "#   or a file host:  curl -fsS -F 'reqtype=fileupload' -F 'fileToUpload=@submission.tar.gz' https://catbox.moe/user/api.php",
        '# Do not type passwords or keys during the recording — everything typed is captured.',
        '',
        "# Then, back in this console:  await t3ga1.q13.check('https://…/submission.tar.gz')",
      ].join('\n'));
    },

    /** Checks the public archive (when the host allows it) and fills the answer box. */
    async check(rawUrl) {
      const target = rawUrl || currentValue(Q13);
      const parsed = parseHttps(target, 'Q13');
      if (!parsed.ok) { console.error(parsed.message); return { ok: false, message: parsed.message }; }
      const url = parsed.url;
      let verified = null;
      let note = '';
      try {
        const response = await fetch(url.href, { cache: 'no-store', credentials: 'omit', headers: { Range: 'bytes=0-1023' } });
        if (!response.ok) {
          const message = `Q13: that link answered HTTP ${response.status}. Make the file public and use its direct download URL.`;
          console.error(message);
          return { ok: false, status: response.status, message };
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        verified = bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
        if (!verified) {
          const message = 'Q13: that URL does not download a .tar.gz file (it returned something else, such as a web page). Use the direct download link.';
          console.error(message);
          return { ok: false, message };
        }
      } catch (error) {
        verified = false;
        note = ` The browser could not read the file to verify it (${error?.message || 'blocked by the host'}); that is common with file hosts, so open the link once yourself to confirm it downloads.`;
      }
      const filled = fill(Q13, url.href);
      const message = `Q13: ${verified ? 'the link downloads a gzip archive' : 'link recorded'} — ${filled ? 'answer box filled' : `paste ${url.href} into the answer box`}.${note} Press Check; the grader verifies the signed recording.`;
      console.log(message);
      return { ok: true, url: url.href, filled, verified, message };
    },
  };

  const help = () => say([
    `T3 GA1 helper — logged in as ${EMAIL}`,
    '',
    'Q9  GitHub Pages',
    '  t3ga1.q9.page()            the index.html to publish (your email already wrapped)',
    '  t3ga1.q9.page({download:true})  also downloads it as index.html',
    '  t3ga1.q9.commands()        git + gh commands to publish it, to run in your terminal',
    "  await t3ga1.q9.check(url)  verifies your live page, then fills the answer box",
    '',
    'Q13  termlog recording',
    '  t3ga1.q13.commands()       the full recording workflow with your link and email filled in',
    "  await t3ga1.q13.check(url) checks your uploaded submission.tar.gz, then fills the answer box",
    '',
    'Nothing here is sent anywhere. The helper cannot fake a check or record for you.',
  ].join('\n'));

  window.t3ga1 = { help, q9, q13 };
  help();
})();
