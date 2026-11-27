import { page, card, details, escapeHtml } from '../p1/ui.js';
import { rng } from '../ga1/utils.js';
import { T3_API_ORIGIN, datasetUrl, examEmail, scriptUrl } from './api-client.js';
import { ollamaCommands, parseMatrixText, validateMatrix } from './ga5-tools.js';
import { buildMatrix } from './matrix.js';
import { helperCard, codeBlock } from './helper-card.js';

export const id = 'q-ollama-faiss-rank-correlation-server';
export const title = 'Dual Embedding Alignment: Ollama, FAISS, and Rank Correlation';

let lastGood = '';
const origin = T3_API_ORIGIN;

function widgetHtml() {
  return [
    '<div id="t3ga5-matrix">',
    '<p>Computed a matrix yourself? Paste it here to check it against the exam\'s rules. Nothing is sent anywhere.</p>',
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
        ? '<div>10 rows × 7 numbers, all document numbers between 0 and 49, distinct top-3s and sensible rho values.</div>'
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

function buildGuide(email, computed) {
  const commands = (os) => codeBlock(ollamaCommands(email, origin, os).join('\n'), os === 'windows' ? 'powershell' : 'bash');
  const local = email
    ? [`<p><a class="p1-btn ghost" href="${escapeHtml(scriptUrl(email, origin))}" download="ollama_matrix.py">Download ollama_matrix.py</a> <a class="p1-btn ghost" href="${escapeHtml(datasetUrl(email, origin))}" target="_blank" rel="noopener noreferrer">See my dataset.json</a></p>`,
      '<p>Install <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer">Ollama</a> and Python 3, save the script, then run these in its folder.</p>',
      '<p><strong>Windows</strong></p>', commands('windows'), '<p><strong>macOS or Linux</strong></p>', commands('mac')].join('')
    : '<p>Enter your exam email in the sidebar to get your own commands.</p>';
  return page({
    title: '🧮 Embedding rank correlation',
    chips: [{ text: computed ? 'Computed for you' : 'Email needed', tone: computed ? 'ok' : 'warn' }, { text: '2 marks', tone: '' }, { text: 'No install needed', tone: 'ok' }],
    sections: [
      card('Your matrix', computed
        ? `<p class="p1-note"><strong>It is in the Answer box.</strong> Copy it into the exam, press <strong>Check</strong>, then <strong>Save</strong>.</p>${codeBlock(computed)}<p class="p1-foot">Your 50 sentences are drawn from a fixed pool using your email, and the two models' scores for that pool were computed once with the real models, so your table follows without installing anything.</p>`
        : '<p class="p1-note">Enter your full IITM exam email in the sidebar and initialize again: your sentences are chosen from it.</p>', 'accent'),
      card('Step by step for beginners', '<ol><li>Check that the email in the sidebar is the one you use for the exam (the sentences depend on it).</li><li>Copy the Answer box exactly: it starts with <code>[[</code> and ends with <code>]]</code>.</li><li>Paste it into the Q2 box on the exam page, press <strong>Check</strong>, then <strong>Save</strong>.</li></ol>'),
      helperCard(),
      details('Check another matrix', widgetHtml()),
      details('Prefer to compute it yourself with Ollama?', local),
      details('What the numbers mean', '<p>Each row is one of the 10 queries: the three best documents (0 to 49) according to <code>nomic-embed-text</code>, the three best according to <code>mxbai-embed-large</code>, then Spearman\'s ρ between the two models\' scores over all 50 documents (rounded to 4 decimals).</p>'),
    ],
  });
}

export async function solve(email) {
  lastGood = '';
  register();
  const clean = examEmail(email);
  if (!clean) {
    return { type: 'guide', answer: 'Enter your full IITM exam email in the sidebar and initialize again to get your matrix.', variant: 'Email needed', guide: buildGuide('', ''), answerDisplay: '### Email needed\n\nEnter your exam email, then initialize again.', debug: { question: 'Q2', needsUserInput: true, hasEmail: false } };
  }
  const { text } = buildMatrix(clean, rng);
  return {
    type: 'solved',
    answer: text,
    variant: 'Rank-correlation matrix for your dataset',
    guide: buildGuide(clean, text),
    answerDisplay: `### Your 10 × 7 matrix\n\n\`\`\`json\n${text}\n\`\`\`\n\nPaste it into Q2, press **Check**, then **Save**.`,
    debug: { question: 'Q2', hasEmail: true, source: 'precomputed-scores' },
  };
}
