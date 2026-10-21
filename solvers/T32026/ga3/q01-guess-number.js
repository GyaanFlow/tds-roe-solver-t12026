import { page, card, details } from './ui.js';

export const id = 'q-guess-number-server';
export const title = 'Guess your number';

const MAX = 10000;

/** The next guess that halves the remaining range, or null when the range is not two whole numbers in order. */
export function nextGuess(low, high) {
  const lo = Math.trunc(Number(low));
  const hi = Math.trunc(Number(high));
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo < 0 || hi > MAX || lo > hi) return null;
  return Math.floor((lo + hi) / 2);
}

/** Narrow the range after the page said "too low" or "too high" for `guess`. */
export function narrow(range, guess, verdict) {
  const g = Math.trunc(Number(guess));
  const v = String(verdict || '').toLowerCase();
  if (!Number.isInteger(g) || g < 0 || g > MAX) return null;
  if (/low/.test(v)) return { low: Math.max(range.low, g + 1), high: range.high };
  if (/high/.test(v)) return { low: range.low, high: Math.min(range.high, g - 1) };
  if (/correct|right|match/.test(v)) return { low: g, high: g };
  return null;
}

function widgetHtml() {
  return [
    '<div id="t3ga3-guess">',
    '<div class="p1-grid"><div><label for="t3ga3GuessLow">Lowest number still possible</label><input type="text" id="t3ga3GuessLow" inputmode="numeric" value="0"></div>',
    '<div><label for="t3ga3GuessHigh">Highest number still possible</label><input type="text" id="t3ga3GuessHigh" inputmode="numeric" value="10000"></div></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3ga3Guess.suggest()">Suggest my guess</button></div>',
    '<div id="t3ga3GuessOut" class="p1-status" role="status"></div></div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3ga3Guess) return;
  window._t3ga3Guess = {
    suggest() {
      const out = document.getElementById('t3ga3GuessOut');
      const guess = nextGuess(document.getElementById('t3ga3GuessLow')?.value, document.getElementById('t3ga3GuessHigh')?.value);
      if (!out) return;
      out.textContent = guess === null ? 'Enter two whole numbers between 0 and 10000, lowest first.' : `Guess ${guess}. If it says too low, set the lowest to ${guess + 1}; if too high, set the highest to ${guess - 1}.`;
    },
  };
}

export async function solve() {
  register();
  const guide = page({
    title: 'Guess your number',
    chips: [{ text: '0 marks', tone: '' }, { text: '3 guesses per 24 h', tone: 'warn' }],
    sections: [
      card('What this is', '<p class="p1-note">This question earns <strong>no marks</strong>. Your number is private and chosen for you, so nothing can know it in advance. Trying is optional.</p><p>Each Check or Save uses one of only 3 guesses a day, and the page keeps the last one for Save. Guessing the middle of the range each time is the smartest strategy.</p>', 'accent'),
      card('Step by step for beginners', '<ol><li>Type <strong>5000</strong> in the box and press Check.</li><li>If it says too low, your number is above 5000; if too high, it is below. Use the helper below to pick the next middle guess.</li><li>With only 3 tries a day you may not reach the number. That is fine, it is worth nothing.</li><li>Do not press Save with no tries left; that gives 0, which is the same as skipping.</li></ol>'),
      card('Next-guess helper', widgetHtml()),
      details('Good to know', '<ul><li>Nothing is submitted by this helper; it only does the arithmetic.</li></ul>'),
    ],
  });
  return {
    type: 'guide',
    answer: 'No marks for this question. Optional: guess 5000 first, then halve the range. Skipping it costs nothing.',
    variant: 'Optional · 0 marks',
    guide,
    answerDisplay: '### Guess your number (0 marks)\n\nThere is no way to know your private number in advance. Skipping costs nothing; if you try, start with `5000` and halve the range after each reply.',
    debug: { question: 'Q1', needsUserInput: true },
  };
}
