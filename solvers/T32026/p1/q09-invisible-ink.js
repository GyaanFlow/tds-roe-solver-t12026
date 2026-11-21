import { page, card, details, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst } from './windows.js';
import { receiptWidgetHtml, registerReceiptWidget } from './receipt-ui.js';

export const id = 'q-air-ink-classifier';
export const title = 'Invisible Ink: read phone writing (10 bonus marks later)';

export const SESSIONS = [
  ['Sat 14 Nov', '4:00–5:00 PM', '4:40 PM'],
  ['Sun 15 Nov', '8:00–9:00 AM', '8:40 AM'],
  ['Sun 15 Nov', '8:00–9:00 PM', '8:40 PM'],
];
export const LETTERS = 'ACEFHJKMNPRTUVWXY';

function buildGuide() {
  const w = WINDOWS.invisibleInk;
  const status = windowStatus(w);
  const rows = SESSIONS.map(([d, t, last]) => `<tr><td>${d} 2026</td><td>${t}</td><td>${last}</td></tr>`).join('');
  return page({
    title: '🖋️ Invisible Ink',
    chips: [{ text: status.state === 'open' ? 'Sessions running' : status.state === 'before' ? 'Not started' : 'Sessions over', tone: toneForState(status.state) }, { text: '10 bonus marks later', tone: '' }, { text: 'Save in P1 is required', tone: 'warn' }],
    sections: [
      card('What this is', `<p class="p1-note"><strong>Phones recorded how a student moved while drawing a random letter code in the air. You guess the codes from the recordings, in a live session, and save a signed record.</strong></p><p>${status.state === 'closed' ? 'The three live sessions are over (see the table). If you played one, your record is below; if you did not, there is nothing to submit and no penalty beyond missing the bonus.' : status.text} Codes have 3 to 5 letters from <code>${LETTERS}</code>; they are random, so <code>XRM</code> is valid even though it is not a word.</p><table><thead><tr><th>Date</th><th>Session (IST)</th><th>Last start (IST)</th></tr></thead><tbody>${rows}</tbody></table>`, 'accent'),
      card('Step by step for beginners', '<ol><li><strong>Before a session:</strong> open your personal game link from the exam page, download the 60 labeled examples (50 shared, 10 yours), and watch a few recordings in the motion viewer to see how letters look in the motion.</li><li><strong>Join a session</strong> (the waiting room opens 2 minutes early; press Start within the first 40 minutes to get your own full 20 minutes).</li><li><strong>First 2 minutes:</strong> six recordings arrive. Guess <strong>Drawing 1 only</strong>; that first guess is worth 20%.</li><li><strong>Next 18 minutes:</strong> guess all six codes using your own eyes, a predictor you built, AI, or classmates. You may change any guess. These six codes are worth 80%.</li><li><strong>At 20 minutes</strong> the answer form closes and complete codes save by themselves. You have one more minute for a slow connection.</li><li><strong>Copy the signed record</strong> (a long text starting with eyJ) from the game. It holds your guesses, not your score.</li><li><strong>Back in P1:</strong> paste the record in the box here, press <strong>Check</strong>, then <strong>Save</strong>. Saving in P1 is what submits it. If you played more than once, save the session you want marked; the last one you save counts.</li></ol>'),
      card('Check your signed record', receiptWidgetHtml('ink', null)),
      details('Tips for guessing', '<ul><li>Letters made of straight strokes (like E, F, H, K, M, N, T, V, W, X, Y) show sharp turns; round ones (C, J, U) show smooth curves.</li><li>The recording does not show when the pen was down, so expect extra movement between letters.</li><li>Use the 60 labeled examples to learn what each letter looks like before you start.</li></ul>'),
      details('Marks', '<p>Each correctly placed letter earns credit; all six final codes count equally, and a blank letter earns nothing. Marks are given offline after the sessions and awarded as separate bonus marks (up to 10).</p>'),
    ],
  });
}

export async function solve() {
  registerReceiptWidget();
  const status = windowStatus(WINDOWS.invisibleInk);
  return {
    type: 'guide',
    answer: 'Play a live Invisible Ink session, copy your signed record from the game, paste it here and press Check and Save. If the sessions are over and you did not play, there is nothing to submit.',
    variant: `Game + signed record · sessions ${status.state === 'closed' ? 'over' : status.state}`,
    guide: buildGuide(),
    answerDisplay: `### Play, then paste your signed record\n\n${status.state === 'closed' ? `The live sessions ended ${formatIst(WINDOWS.invisibleInk.closes)}.` : status.text}\n\nIf you played, paste the record from the game, press Check, then Save in P1.`,
    debug: { question: 'Q9', needsUserInput: true, windowState: status.state },
  };
}
