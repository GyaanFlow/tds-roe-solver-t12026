import { page, card, details, escapeHtml } from '../p1/ui.js';
import { T3_API_ORIGIN, datasetUrl, examEmail, scriptUrl } from './api-client.js';
import { ollamaCommands, parseMatrixText, validateMatrix } from './ga5-tools.js';

export const id = 'q-ollama-faiss-rank-correlation-server';
export const title = 'Dual Embedding Alignment: Ollama, FAISS, and Rank Correlation';

let lastGood = '';
let origin = T3_API_ORIGIN;

function widgetHtml() {
  return [
    '<div id="t3ga5-matrix">',
    '<p>Paste the line the script printed (it starts with <code>[[</code>). This checks it against the exam\'s rules before you use a Check. Nothing is sent anywhere.</p>',
    '<textarea id="t3ga5MatrixText" rows="5" spellcheck="false" autocomplete="off" placeholder="[[14, 2, 38, 14, 45, 2, 0.7642], ... 10 rows]"></textarea>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3ga5Matrix.check()">Check my matrix</button><button type="button" class="p1-btn ghost" id="t3ga5MatrixFill" disabled onclick="window._t3ga5Matrix.fill()">Put it in the answer box</button></div>',
    '<div id="t3ga5MatrixOut" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3ga5Matrix) return;
  const $ = (name) => document.getElementById(name);
  const say = (html, ok) => { const out = $('t3ga5MatrixOut'); if (out) { out.style.color = ''; out.innerHTML = `<strong style="color:${ok ? '#34d399' : '#f87171'}">${ok ? 'The matrix is ready.' : 'Not ready yet.'}</strong>${html}`; } };
  window._t3ga5Matrix = {
    check() {
      const parsed = parseMatrixText($('t3ga5MatrixText')?.value);
      lastGood = '';
      if (!parsed.ok) { if ($('t3ga5MatrixFill')) $('t3ga5MatrixFill').disabled = true; say(`<div style="color:#f87171">❌ ${escapeHtml(parsed.message)}</div>`, false); return; }
      const result = validateMatrix(parsed.value);
      if (result.ok) lastGood = result.compact;
      if ($('t3ga5MatrixFill')) $('t3ga5MatrixFill').disabled = !result.ok;
      say(result.ok
        ? '<div>10 rows × 7 numbers, all document numbers between 0 and 49, distinct top-3s and sensible rho values. The exam still compares your rho values with its own reference (±0.05), so use the script below unchanged.</div>'
        : result.problems.slice(0, 8).map((p) => `<div style="color:#f87171">❌ ${escapeHtml(p)}</div>`).join(''), result.ok);
    },
    fill() {
      if (!lastGood) return;
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, { type: 'solved', answer: lastGood, variant: 'Rank-correlation matrix', answerDisplay: '### Your matrix\n\nPress **Check**, then **Save**.' });
      const out = $('t3ga5MatrixOut');
      if (out) out.insertAdjacentHTML('beforeend', `<div>${patched ? 'Done. The answer box now has your matrix. Press Check, then Save.' : 'Copy the matrix into the exam box yourself, then press Check and Save.'}</div>`);
    },
  };
}

function commandBlock(label, commands) {
  return `<p><strong>${label}</strong></p><pre class="mono" style="white-space:pre-wrap;word-break:break-all">${escapeHtml(commands.join('\n'))}</pre>`;
}

function buildGuide(email) {
  const downloads = email
    ? `<p><a class="p1-btn" href="${escapeHtml(scriptUrl(email, origin))}" download="ollama_matrix.py">Download ollama_matrix.py</a> <a class="p1-btn ghost" href="${escapeHtml(datasetUrl(email, origin))}" target="_blank" rel="noopener noreferrer">See my dataset.json</a></p><p class="p1-foot">The server regenerates your exact dataset from your email (it matches the exam page's own generator), so the script can fetch it for you: no copying needed.</p>`
    : '<p class="p1-note">Enter your full exam email in the sidebar and initialize again to get your own download links and commands.</p>';
  const commands = email
    ? [commandBlock('Windows (PowerShell or Command Prompt)', ollamaCommands(email, origin, 'windows')), commandBlock('macOS or Linux (Terminal)', ollamaCommands(email, origin, 'mac'))].join('')
    : '<p>Your commands appear here once your email is known.</p>';
  return page({
    title: '🧮 Ollama + rank correlation',
    chips: [{ text: 'Runs on your computer', tone: 'warn' }, { text: '2 marks', tone: '' }, { text: 'Script and checker ready', tone: 'ok' }],
    sections: [
      card('What this is', '<p class="p1-note"><strong>You compute a 10 × 7 table on your own computer with two real embedding models, then paste it. A website cannot do this for you, because the graded value must match the exam\'s own run of the same two models.</strong></p><p>For each of 10 queries the table holds the top-3 documents found by <code>nomic-embed-text</code>, the top-3 found by <code>mxbai-embed-large</code>, and Spearman\'s ρ (how much the two models agree about the ranking of all 50 documents).</p>', 'accent'),
      card('Step by step for beginners', `<ol><li><strong>Install Ollama</strong> from <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer">ollama.com/download</a> and open it so it keeps running in the background. Install <strong>Python 3</strong> from <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer">python.org</a> if you do not have it (tick “Add Python to PATH” on Windows).</li><li>Open a terminal in a folder you can find again (for example the Downloads folder).</li><li><strong>Download the script</strong> with the button below. Save it as <code>ollama_matrix.py</code> in that folder.</li><li>Run the four commands for your system below, one at a time. The first two download the models (a few hundred MB, only once). The last one runs the script and takes a few minutes.</li><li>It prints one long line starting with <code>[[</code>. Copy that whole line.</li><li>Paste it into the checker below. When it says ready, press <strong>Put it in the answer box</strong>, then on the exam page press <strong>Check</strong> and <strong>Save</strong>.</li></ol>`),
      card('Your script and commands', downloads + commands, 'accent'),
      card('Check your matrix', widgetHtml(), 'accent'),
      details('If something goes wrong', '<ul><li><strong>“Cannot reach Ollama”:</strong> start the Ollama app, or run <code>ollama serve</code> in another terminal.</li><li><strong>“Model … is not installed”:</strong> run the matching <code>ollama pull</code> command again.</li><li><strong>“python is not recognised”:</strong> reinstall Python with “Add Python to PATH”, or try <code>py</code> instead of <code>python</code> on Windows.</li><li><strong>The first run is slow</strong> while the models load; later runs are faster.</li><li><strong>The exam says ρ is off:</strong> use the script as downloaded (do not change the models or add prefixes) and paste its output unchanged.</li><li>The server sleeps when idle. If the script cannot fetch your dataset, open <code>' + escapeHtml(origin) + '/t3ga5/health</code> in a browser, wait for “ok”, then run it again.</li></ul>'),
      details('What the script does (so you can trust it)', '<p>It embeds your 50 sentences and 10 queries with both models, scales each embedding to length 1, scores every document for every query, takes each model\'s top 3, and computes Spearman\'s ρ between the two models\' score lists. It follows the exam\'s own starter script but needs neither FAISS nor SciPy, and its rank maths was tested against SciPy.</p>'),
    ],
  });
}

export async function solve(email) {
  lastGood = '';
  origin = T3_API_ORIGIN;
  register();
  const clean = examEmail(email);
  return {
    type: 'guide',
    answer: 'Run the downloaded ollama_matrix.py on your own computer (two Ollama models), then paste the 10 × 7 matrix it prints.',
    variant: 'Local script · guide',
    guide: buildGuide(clean),
    answerDisplay: `### Run the script, then paste your matrix\n\nInstall Ollama and Python, download \`ollama_matrix.py\` from the Implementation Guide, run the four commands for your system, and paste the 10 × 7 matrix it prints. Check it in the guide first.${clean ? '' : '\n\nEnter your exam email to get your personal commands.'}`,
    debug: { question: 'Q2', needsUserInput: true, hasEmail: Boolean(clean) },
  };
}
