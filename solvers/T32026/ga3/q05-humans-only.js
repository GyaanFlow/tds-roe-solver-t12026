import { page, card, details, escapeHtml, toneForState } from './ui.js';
import { HUMANS_ONLY, windowStatus, formatIst } from './windows.js';

export const id = 'q-trading-humans-only';
export const title = 'Trading game: Humans Only';

function buildGuide() {
  const rows = ['draw', 'guess', 'submit'].map((key) => {
    const w = HUMANS_ONLY[key];
    return `<tr><td>${escapeHtml(w.label)}</td><td>${escapeHtml(formatIst(w.opens))} → ${escapeHtml(formatIst(w.closes))}</td><td>${escapeHtml(windowStatus(w).text)}</td></tr>`;
  }).join('');
  const drawState = windowStatus(HUMANS_ONLY.draw).state;
  return page({
    title: 'Humans Only (drawing game)',
    chips: [{ text: drawState === 'open' ? 'Drawing open' : drawState === 'before' ? 'Not open yet' : 'Drawing closed', tone: toneForState(drawState) }, { text: '1 mark', tone: '' }],
    sections: [
      card('This one is played, not solved', `<p class="p1-note">You play the game on the exam page with your own hands. Each guess needs you to confirm it is you with Google, so nothing can be filled in for you.</p><table><thead><tr><th>Phase</th><th>When</th><th>Now</th></tr></thead><tbody>${rows}</tbody></table>`, 'accent'),
      card('Step by step for beginners', '<ol><li>Press <strong>Open your desk</strong> on the exam page (reload the page if the link expired).</li><li><strong>Draw:</strong> you get 3 words and 60 seconds each. Use a finger or mouse. Do not write letters or numbers. Make the shape clear but a bit unusual: you earn more when classmates get it right and the AI gets it wrong.</li><li><strong>Guess:</strong> from Thursday noon, guess 15 classmates\' drawings (30 seconds each). Pick the word from 10 options. Skipped guesses count as wrong, so always pick one.</li><li>On Sunday 25 October afternoon the results appear. Type <code>played</code> in the exam box, press <strong>Check</strong>, then <strong>Save</strong> before 11:59 pm IST.</li></ol>'),
      details('Tips that stay fair', '<ul><li>Draw big and simple; very detailed drawings are easy for the AI panel.</li><li>Use all your guesses before the guessing window closes.</li><li>Keep your desk link private; it signs you in as you.</li></ul>'),
    ],
  });
}

export async function solve() {
  const state = windowStatus(HUMANS_ONLY.draw).state;
  return {
    type: 'guide',
    answer: 'Play the game on the exam page, then type: played',
    variant: `Game needed · draw ${state}`,
    guide: buildGuide(),
    answerDisplay: '### Play, then type `played`\n\nDraw your 3 words, guess 15 drawings, then once results appear type `played`, press Check and Save.',
    debug: { question: 'Q5', needsUserInput: true, drawState: state },
  };
}
