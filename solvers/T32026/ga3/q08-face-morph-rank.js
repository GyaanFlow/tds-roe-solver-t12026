import { page, card, details, escapeHtml } from './ui.js';
import { PAIR_COUNT, TRAITS, rankPairs, validateOrder } from './face-logic.js';

export const id = 'q-face-morph-rank';
export const title = 'Which faces are easiest to morph?';

const select = (pair, trait) => `<select data-pair="${pair}" data-trait="${trait.key}" aria-label="Pair ${pair}: ${escapeHtml(trait.label)}"><option value="0">0</option><option value="1">1</option><option value="2">2</option></select>`;

function widgetHtml() {
  const header = `<tr><th>Pair</th>${TRAITS.map((t) => `<th title="${escapeHtml(t.hint)}">${escapeHtml(t.label)}</th>`).join('')}</tr>`;
  const rows = Array.from({ length: PAIR_COUNT }, (_, i) => `<tr><td><strong>${i + 1}</strong></td>${TRAITS.map((t) => `<td>${select(i + 1, t)}</td>`).join('')}</tr>`).join('');
  return [
    '<div id="t3ga3-rank">',
    '<p>For each pair on the exam page, look at the two faces and pick <strong>0</strong> (alike), <strong>1</strong> (a bit different) or <strong>2</strong> (very different) for each trait. Leave a trait at 0 if you cannot tell. Hover a column name for what 0 and 2 mean.</p>',
    `<div style="overflow-x:auto"><table><thead>${header}</thead><tbody>${rows}</tbody></table></div>`,
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3ga3Rank.rank()">Work out my order</button><button type="button" class="p1-btn ghost" onclick="window._t3ga3Rank.reset()">Reset</button></div>',
    '<div id="t3rStatus" class="p1-status" role="status"></div><div id="t3rOut"></div>',
    '<hr style="border:0;border-top:1px solid var(--border,rgba(255,255,255,.14));margin:14px 0">',
    '<label for="t3rCheck">Already have an order? Paste it to check it</label><input type="text" id="t3rCheck" placeholder="e.g. 3,1,4,10,2,5,6,9,7,8">',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3ga3Rank.check()">Check this order</button></div>',
    '<div id="t3rCheckOut" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3ga3Rank) return;
  const $ = (name) => document.getElementById(name);
  const say = (el, text, tone) => { const node = $(el); if (!node) return; node.textContent = text; node.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd'; };
  window._t3ga3Rank = {
    rank() {
      const pairs = Array.from({ length: PAIR_COUNT }, (_, i) => ({
        number: i + 1,
        ratings: Object.fromEntries(TRAITS.map((t) => [t.key, document.querySelector(`select[data-pair="${i + 1}"][data-trait="${t.key}"]`)?.value ?? '0'])),
      }));
      const result = rankPairs(pairs);
      if (!result.ok) { say('t3rStatus', result.message, 'bad'); return; }
      say('t3rStatus', `Your order, easiest first: ${result.text}`, 'ok');
      $('t3rOut').innerHTML = `<p>Type these numbers into the exam box (or drag the pairs into this order), press <strong>Confirm this order</strong>, then <strong>Check</strong> and <strong>Save</strong>.</p><pre class="mono">${escapeHtml(result.text)}</pre><details><summary>Show the scores</summary><div class="p1-inner"><ol>${result.scores.map((s) => `<li>Pair ${s.number}: ${s.score}</li>`).join('')}</ol></div></details>`;
    },
    reset() {
      document.querySelectorAll('#t3ga3-rank select').forEach((el) => { el.value = '0'; });
      say('t3rStatus', '', '');
      if ($('t3rOut')) $('t3rOut').innerHTML = '';
    },
    check() {
      const result = validateOrder($('t3rCheck')?.value);
      say('t3rCheckOut', result.ok ? `Valid: ${result.text}` : result.message, result.ok ? 'ok' : 'bad');
    },
  };
}

export async function solve() {
  register();
  const guide = page({
    title,
    chips: [{ text: '1 mark: complete ranking', tone: '' }, { text: '4 marks: matches classmates', tone: '' }],
    sections: [
      card('Your task', '<p>The exam page shows <strong>10 pairs of faces</strong>, different for every student. Put the pairs in order from <strong>easiest to hardest</strong> to turn the left face smoothly into the right one. Check gives 1 mark for any complete ranking; 4 more marks come later from how well your order matches what classmates judge after seeing the real morph videos.</p><p class="p1-note">Your pairs are private to you, so this tool cannot see them. You describe each pair with quick 0 to 2 ratings and it works out the order.</p>', 'accent'),
      card('Step by step for beginners', '<ol><li>Look at pair 1 on the exam page: two faces side by side.</li><li>In the table below, for pair 1 choose 0, 1 or 2 for each trait. <strong>0</strong> = the two faces are alike in that way, <strong>2</strong> = very different. Most important: are both faces looking the same direction, and are they the same gender and age?</li><li>Repeat for all 10 pairs, then press <strong>Work out my order</strong>.</li><li>On the exam page, drag the pairs (or use ↑ ↓) into the order shown, press <strong>Confirm this order</strong>, then <strong>Check</strong>, then <strong>Save</strong>.</li></ol>'),
      card('Rating helper', widgetHtml(), 'accent'),
      details('What makes a morph easy or hard?', '<ul><li><strong>Easy:</strong> both faces front-on, similar age and gender, similar hair, no glasses or beards, plain background.</li><li><strong>Hard:</strong> one face turned sideways, very different ages, hair covering the face, glasses or a beard on only one face, very different lighting or photo size.</li><li>If two pairs are close, put the one with the pose difference lower (harder): pose problems are the most visible in a video.</li></ul>'),
      details('If you only want the 1 mark', '<p>Any complete order earns the Check mark, for example <code>1,2,3,4,5,6,7,8,9,10</code>. The 4 extra marks depend on judging the pairs well, so using the helper is worth a few minutes.</p>'),
    ],
  });
  return {
    type: 'guide',
    answer: 'Rate your 10 pairs in the helper to get an easiest-to-hardest order, put the pairs in that order on the exam page, confirm it, then Check and Save.',
    variant: 'Ranking helper · guide',
    guide,
    answerDisplay: '### Which faces are easiest to morph?\n\nUse the rating helper in the Implementation Guide. It outputs a 10-number order (easiest first). Arrange your pairs that way, press **Confirm this order**, then Check and Save.',
    debug: { question: 'Q8', needsUserInput: true, pairs: PAIR_COUNT },
  };
}
