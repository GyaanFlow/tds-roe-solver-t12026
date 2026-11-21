import { page, card, details, escapeHtml } from './ui.js';
import { APP_URL, COLS, MAX_BYTES, ROWS, expectedBonus, validateModel } from './model-json.js';

export const id = 'q-face-expression-classifier';
export const title = 'Train a face-expression classifier (10 bonus marks later)';

let lastGood = '';

function widgetHtml() {
  return [
    '<div id="t3p1Fx">',
    '<p>Choose the <code>model.json</code> you downloaded from the app (or paste its text). This checks the format only and sends nothing anywhere.</p>',
    '<input type="file" id="t3p1FxFile" accept=".json,application/json" onchange="window._t3p1Fx.load()">',
    '<label for="t3p1FxText" style="margin-top:8px">…or paste the JSON text</label>',
    '<textarea id="t3p1FxText" rows="3" spellcheck="false" autocomplete="off" placeholder="{&quot;version&quot;:&quot;linear-rank-v1&quot;,&quot;weights&quot;:[...]}"></textarea>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1Fx.check()">Check my model file</button><button type="button" class="p1-btn ghost" id="t3p1FxFill" disabled onclick="window._t3p1Fx.fill()">Put it in the answer box</button></div>',
    '<div id="t3p1FxOut" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3p1Fx) return;
  const $ = (name) => document.getElementById(name);
  const say = (text, ok) => { const out = $('t3p1FxOut'); if (out) { out.textContent = text; out.style.color = ok ? '#34d399' : '#f87171'; } };
  window._t3p1Fx = {
    async load() {
      const file = $('t3p1FxFile')?.files?.[0];
      if (!file) return;
      if (file.size > MAX_BYTES) { say(`That file is ${file.size.toLocaleString('en-US')} bytes; the limit is ${MAX_BYTES.toLocaleString('en-US')} bytes.`, false); return; }
      $('t3p1FxText').value = await file.text();
      window._t3p1Fx.check();
    },
    check() {
      const result = validateModel($('t3p1FxText')?.value);
      lastGood = result.ok ? result.compact : '';
      if ($('t3p1FxFill')) $('t3p1FxFill').disabled = !result.ok;
      say(result.ok ? `${result.message} The exam will test its accuracy on new people after Project 1 closes.` : result.message, result.ok);
    },
    fill() {
      if (!lastGood) return;
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, { type: 'solved', answer: lastGood, variant: 'Face-expression model JSON', answerDisplay: '### Your model JSON\n\nPress **Check** to validate it, then **Save**.' });
      say(patched ? 'Done. The answer box now has your model. Press Check, then Save.' : 'Copy the JSON into the exam box yourself, then press Check and Save.', true);
    },
  };
}

function buildGuide() {
  const link = `<a href="${escapeHtml(APP_URL)}" target="_blank" rel="noopener noreferrer">Open the Face Expression Matcher app</a>`;
  return page({
    title: '🙂 Face-expression classifier',
    chips: [{ text: '10 bonus marks later', tone: '' }, { text: `Model: ${ROWS} × ${COLS} numbers`, tone: '' }, { text: 'Save as often as you like', tone: 'ok' }],
    sections: [
      card('What you submit', `<p class="p1-note"><strong>One small JSON file with two keys: <code>version</code> and <code>weights</code> (10 rows of 156 numbers). A ready-made app produces it for you.</strong></p><p>The exam tests your model on photos of people it has never seen, after Project 1 closes. Provisional scale: 0 marks at 60% accuracy, 5 at 70%, 10 at 80% or more. Check only validates the file format, not accuracy. ${link} (your own tool; the model in it reports ${expectedBonus(69.9)} of 10 on that scale at its measured 69.9% on unseen people, so treat that as an estimate).</p>`, 'accent'),
      card('Step by step for beginners (easiest route)', `<ol><li>${link}. If it says it is sleeping, press the wake-up button and wait a minute.</li><li>Open the <strong>Get submission JSON</strong> tab.</li><li>Under <strong>Route A</strong> press <strong>Download model.json</strong>. This model was trained on 66 different people.</li><li>Come back here, choose that file in the checker below, and press <strong>Check my model file</strong>.</li><li>When it says Valid, press <strong>Put it in the answer box</strong> (or paste the JSON yourself).</li><li>On the exam page press <strong>Check</strong>, then <strong>Save</strong>. You can replace it any time before Project 1 closes; only your latest saved version counts.</li></ol>`),
      card('Model file checker', widgetHtml(), 'accent'),
      card('Want to train it on your own data (Route B)', `<ol><li>On the exam page press <strong>Download my training data (ZIP)</strong> (Google sign-in needed). Unzip it: you will see a <code>photos</code> folder and <code>features.csv</code>.</li><li>In the app open <strong>Get submission JSON</strong>, go to <strong>Route B</strong>, upload your <code>features.csv</code>, keep the ridge strength at 1000 (higher is safer with only 30 people), and press <strong>Train and build JSON</strong>.</li><li>Download the JSON and check it here as above. With one ZIP (about 30 people) expect lower accuracy than Route A, so only use it if you add more data or compare the two.</li></ol>`),
      details('Test it on photos (optional)', '<p>The app\'s <strong>Test with photos</strong> tab takes ten photos of one person and shows which expression the model gave each one. Use only photos you have permission to process; the app says it stores nothing, but avoid uploading other people\'s faces to outside services.</p>'),
      details('How the model is used', '<p>The grader gives each photo 78 numbers from Py-Feat plus 78 within-person rank numbers, multiplies them by your weights to get one score per expression, then matches each expression to exactly one of the ten photos so that the total score is highest. That is why every expression appears exactly once per person, and why a constant offset per expression does not matter.</p>'),
      details('If something goes wrong', '<ul><li><strong>“exactly two keys”:</strong> you edited the file or used a different export. Download model.json again and do not open it in a spreadsheet.</li><li><strong>“64 KiB”:</strong> use the app\'s download, which is already small enough.</li><li><strong>The app is slow:</strong> free hosting sleeps; wait a minute after opening it.</li><li><strong>Accuracy matters later:</strong> a valid file earns nothing until the exam tests it on unseen people.</li></ul>'),
    ],
  });
}

export async function solve() {
  lastGood = '';
  register();
  return {
    type: 'guide',
    answer: 'Download model.json from the Face Expression Matcher app (Get submission JSON, Route A), check it here, then paste it in the exam box and press Check and Save.',
    variant: 'Model JSON · app + checker',
    guide: buildGuide(),
    answerDisplay: `### Download your model, check it, then Save\n\nOpen the Face Expression Matcher app (${APP_URL}), take **Route A → Download model.json**, check it in the Implementation Guide, paste it here, then press Check and Save. A valid file earns 0 now; the exam tests accuracy on unseen people later.`,
    debug: { question: 'Q8', needsUserInput: true, appUrl: APP_URL },
  };
}
