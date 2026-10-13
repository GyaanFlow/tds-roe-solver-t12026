import { escapeHtml, markdownCodeBlock } from './utils.js';
import { FastImportError, analyzeFastImport } from './git-history.js';

export const id = 'q-git-forensics-token-server';
export const title = 'Q10: Git Forensics — Recover the Leaked Token';

const MAX_BYTES = 80 * 1024 * 1024;
const PLACEHOLDER_ANSWER = 'NOT FOUND YET — choose your saved history.fi in the form above and press “Find the token”. This box will then show the JSON to submit.';

/**
 * Analyse an uploaded fast-import stream. Returns `{ ok: false, message }` for anything the student
 * can fix, or `{ ok: true, result, patch }` where `patch` is the new Answer-box content.
 */
export function describeHistory(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length === 0) {
    return { ok: false, message: 'That file is empty. Save the raw history from the Q10 frame again and choose it here.' };
  }
  if (bytes.length > MAX_BYTES) {
    return { ok: false, message: `That file is ${(bytes.length / 1048576).toFixed(0)} MB, which is far larger than a Q10 history. Check that you saved the right response.` };
  }

  let result;
  try {
    result = analyzeFastImport(bytes);
  } catch (error) {
    if (error instanceof FastImportError) {
      return { ok: false, message: `This does not read as a git fast-import stream: ${error.message} Save the raw response of the Q10 history frame (not the web page) and try again.` };
    }
    return { ok: false, message: `The file could not be analysed (${error?.message || 'unexpected error'}).` };
  }
  if (result.commitCount === 0) {
    return { ok: false, message: 'The file parsed, but it contains no commits. Check that you saved the history for Q10.' };
  }
  if (result.tokens.length === 0) {
    return { ok: false, message: `No stg_… token appears anywhere in these ${result.commitCount} commits. If your token uses a different prefix, follow the manual Git steps below.` };
  }

  const best = result.best;
  const patch = {
    answer: result.answer,
    type: result.confident ? 'solved' : 'guide',
    variant: result.confident ? 'Token and commit subject found locally' : 'Check the candidates before submitting',
    guide: buildGuide(result),
    answerDisplay: [
      `### ${title}`,
      '',
      result.confident
        ? `Found the staging token that was added and later removed, and the commit that first introduced it (${result.commitCount} commits analysed locally).`
        : 'A best guess is in the Answer box, but the history is ambiguous — read the warnings and the table in the Implementation Guide before submitting.',
      '',
      markdownCodeBlock(result.answer, 'json'),
    ].join('\n'),
    debug: { commitsAnalysed: result.commitCount, tokensFound: result.tokens.length, confident: result.confident, suggestedToken: best.token },
  };
  return { ok: true, result, patch };
}

function finderHtml() {
  const field = 'width:100%;box-sizing:border-box;padding:10px;border-radius:8px;border:1px solid var(--border,#3d5f96);background:var(--bg-input,#0b1930);color:var(--text-primary,#e8f0fe);font-family:var(--font-mono,monospace);font-size:13px;';
  return [
    '<div id="t3q10Root" style="border:1px solid var(--border,#2d4d80);border-radius:14px;padding:18px;margin:14px 0;background:rgba(77,166,255,0.06);">',
    '<div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:var(--theme-primary,#4da6ff);margin-bottom:12px;">Find the token automatically — your file never leaves this browser</div>',
    '<label for="t3q10File" style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;">1. Choose the history file you saved (history.fi)</label>',
    `<input id="t3q10File" type="file" style="${field}margin-bottom:12px;" />`,
    '<label for="t3q10Paste" style="display:block;font-size:12px;font-weight:600;margin-bottom:4px;">…or paste its contents here instead</label>',
    `<textarea id="t3q10Paste" rows="3" spellcheck="false" autocomplete="off" placeholder="blob&#10;mark :1&#10;data 12&#10;…" style="${field}resize:vertical;"></textarea>`,
    '<button type="button" id="t3q10Go" onclick="window._t3ga1q10Analyze()" style="margin-top:12px;background:var(--theme-primary,#3b82f6);color:#000;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">🔎 Find the token</button>',
    '<div id="t3q10Status" role="status" aria-live="polite" style="margin-top:10px;font-size:13px;font-weight:600;min-height:18px;"></div>',
    '</div>',
  ].join('\n');
}

function statusLabel(entry) {
  if (entry.rotatedOut) return 'Added, then removed ✔';
  if (entry.stillPresent) return 'Still present at the latest commit';
  return 'Not at any branch tip';
}

function resultsHtml(result) {
  const cell = 'padding:6px 8px;border:1px solid var(--border,#2d4d80);vertical-align:top;text-align:left;';
  const rows = result.tokens.map((entry) => {
    const isBest = entry === result.best;
    const removed = entry.removals.length ? entry.removals.map((commit) => escapeHtml(commit.subject)).join('<br>') : '—';
    return `<tr${isBest ? ' style="background:rgba(77,166,255,0.14);"' : ''}>`
      + `<td style="${cell}font-family:var(--font-mono,monospace);">${isBest ? '★ ' : ''}${escapeHtml(entry.token)}</td>`
      + `<td style="${cell}">${escapeHtml(statusLabel(entry))}</td>`
      + `<td style="${cell}">${escapeHtml(entry.first.subject)}<br><small>commit ${entry.first.index + 1} of ${result.commitCount} · ${escapeHtml(entry.first.ref)}</small></td>`
      + `<td style="${cell}">${removed}</td>`
      + `<td style="${cell}font-family:var(--font-mono,monospace);">${entry.files.map(escapeHtml).join('<br>') || '—'}</td>`
      + '</tr>';
  }).join('');
  const head = ['Token', 'Status', 'First added by (subject)', 'Removed by', 'File(s)']
    .map((label) => `<th style="${cell}">${label}</th>`).join('');
  return `<table style="border-collapse:collapse;width:100%;font-size:12.5px;margin:10px 0;"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table>`;
}

function manualSteps() {
  const gitBashCommands = [
    'mkdir t3-ga1-forensics',
    'cd t3-ga1-forensics',
    'git init',
    'git fast-import < ../history.fi',
    'git log --all --graph --decorate --oneline',
    'git log --all --oneline --name-only',
  ].join('\n');
  const searchCommands = [
    "git log --all -G 'stg_[A-Za-z0-9_]+' --format='%H %s' --",
    'git log --all -p --',
    "git log --all --reverse -S'THE_FULL_TOKEN' --format='%H%x09%s' --",
    'git show --format=fuller --stat COMMIT_HASH',
    'git show COMMIT_HASH --',
  ].join('\n');
  return [
    '### Manual method with Git (use this to double-check the result)',
    '',
    '#### 1. Save the supplied history safely',
    '',
    '1. In the exam, locate the Git history frame for this question. Open its question-data URL or use the provided download control, then save the raw response as history.fi.',
    '2. Keep history.fi private on your computer. It contains a deliberately leaked staging token. Do not upload it to GitHub, paste the token into a public issue, or commit the imported repository anywhere.',
    '3. Install Git for Windows if Git Bash is not available. Open **Git Bash** in a folder next to history.fi. The commands below assume history.fi is one folder above the new working folder.',
    '',
    '#### 2. Rebuild the repository',
    '',
    `Run these commands in Git Bash:\n\n${markdownCodeBlock(gitBashCommands, 'bash')}`,
    '',
    'The fast-import command reads the stream from standard input and reconstructs its commits and branches. If you saved the file elsewhere, replace ../history.fi with its actual path. Keep this work in a fresh directory so unrelated Git history cannot confuse the search.',
    '',
    '#### 3. Locate token changes',
    '',
    'First inspect the commit graph and file names printed by the commands above. Then search for likely staging-token patterns and review patches. Git history searches are case-sensitive by default.',
    '',
    `${markdownCodeBlock(searchCommands, 'bash')}`,
    '',
    'Replace THE_FULL_TOKEN with the token you found, without the placeholder quotes. The -S search lists commits where that exact string was added or removed. Read each matching patch: the answer is the commit where the token first appears as an addition, not the later commit that deletes or rotates it. The -G search is a useful starting point when the token has a recognizable prefix such as stg_.',
    '',
    'If the -G expression finds nothing, use git log --all -p and search the terminal output for words such as token, secret, or stg_. You can also inspect an individual file at a commit with git show COMMIT_HASH:path/to/file.',
    '',
    '#### 4. Confirm the commit subject',
    '',
    'Use the full commit hash from the search result with git show --format=fuller --stat COMMIT_HASH. Check the patch with git show COMMIT_HASH -- and make sure it introduces the token. Copy the subject line exactly; do not use the later rotation/deletion commit subject.',
    '',
    '#### 5. Submit the required JSON',
    '',
    'Return one valid JSON object using the exact keys requested by the exam, for example {"token":"the-found-value","commit_subject":"the exact subject"}. Replace both example values. Escape any double quotes or backslashes if they occur in a value, and do not add Markdown fences or explanatory text around the JSON.',
    '',
    'Troubleshooting: if git fast-import reports a fatal parse error, make sure you saved the raw stream rather than an HTML error page; if git log shows no commits, check that the import command ran from the new repository and that the input path exists.',
  ];
}

function buildGuide(result) {
  const lines = [
    '### Git Forensics: find where the token first entered history',
    '',
    'The exam serves a personalised Git history as a `git fast-import` stream. This page can read that stream itself: save it once, choose it below, and it reports which commit **first introduced** each `stg_…` token and whether the token was later rotated out. Nothing is uploaded — the file is read and analysed inside this browser tab.',
    '',
    '**How to save the file:** on the exam page, right-click the Q10 history frame and choose *Open frame in new tab* (or open Q10\'s question-data link), press Ctrl+S, and save it as `history.fi`. It must be the raw text, not a saved web page.',
    '',
    finderHtml(),
  ];
  if (result) {
    lines.push(
      '',
      `### Result — ${result.commitCount} commit${result.commitCount === 1 ? '' : 's'} analysed (${escapeHtml(result.refNames.join(', '))})`,
      '',
      'Submit this JSON (it is also in the Answer box):',
      '',
      markdownCodeBlock(result.answer, 'json'),
    );
    if (result.warnings.length) lines.push('', ...result.warnings.map((warning) => `- ⚠️ ${warning}`));
    if (result.normalizedLineEndings) lines.push('', '- ℹ️ The file had Windows line endings, which were converted before reading. Prefer saving the response without opening it in an editor.');
    lines.push('', resultsHtml(result), '', 'Always confirm with the manual Git method below if anything looks unusual: the commit subject must be the commit that **added** the token, not the one that rotated it out.');
  }
  lines.push('', ...manualSteps());
  return lines.join('\n');
}

function registerQ10Interactive() {
  if (typeof window === 'undefined' || window._t3ga1q10Registered) return;
  window._t3ga1q10Registered = true;

  window._t3ga1q10Analyze = async function t3ga1q10Analyze() {
    const status = document.getElementById('t3q10Status');
    const button = document.getElementById('t3q10Go');
    const show = (text, color) => {
      if (!status) return;
      status.style.color = color;
      status.textContent = text;
    };

    if (button) button.disabled = true;
    try {
      const file = document.getElementById('t3q10File')?.files?.[0];
      const pasted = document.getElementById('t3q10Paste')?.value ?? '';
      let bytes;
      if (file) {
        if (file.size > MAX_BYTES) {
          show(`That file is ${(file.size / 1048576).toFixed(0)} MB — far larger than a Q10 history. Check that you chose the right file.`, '#e5484d');
          return;
        }
        show(`Reading ${file.name}…`, '#4da6ff');
        bytes = new Uint8Array(await file.arrayBuffer());
      } else if (pasted.trim()) {
        bytes = new TextEncoder().encode(pasted);
      } else {
        show('Choose your saved history.fi (or paste its contents) first.', '#e5484d');
        return;
      }

      show('Analysing the history…', '#4da6ff');
      await new Promise((resolve) => setTimeout(resolve, 20)); // let the message paint before the parse
      const outcome = describeHistory(bytes);
      if (!outcome.ok) {
        show(outcome.message, '#e5484d');
        return;
      }
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, outcome.patch);
      if (!patched) show(`Result: ${outcome.result.answer}`, '#198754');
    } finally {
      if (button) button.disabled = false;
    }
  };
}

export async function solve() {
  registerQ10Interactive();
  return {
    type: 'guide',
    answer: PLACEHOLDER_ANSWER,
    variant: 'Upload your history.fi to solve',
    guide: buildGuide(null),
    answerDisplay: '### Waiting for your history file\n\nUse the form in the **Implementation Guide** panel. Once it succeeds, the Answer box shows the JSON to submit: the token and the subject of the commit that first introduced it.',
    debug: { question: 'Q10', needsUserInput: true },
  };
}
