import { page, card, details } from '../p1/ui.js';
import { recordWidgetHtml, registerRecordWidget } from '../ga4/record-check.js';

export const id = 'q-time-use-review-server';
export const title = 'Time Use Charts: which data story would you share?';
export const REQUIRED_COMPARISONS = 8;

function buildGuide(email) {
  return page({
    title: '🗳️ Poster review',
    chips: [{ text: 'Do it yourself', tone: 'warn' }, { text: '2 marks', tone: '' }, { text: `${REQUIRED_COMPARISONS} comparisons`, tone: '' }],
    sections: [
      card('What this is', `<p class="p1-note"><strong>Compare classmates' Time Use posters two at a time, then paste the signed receipt the review app gives you.</strong></p><p>Marks reward finishing ${REQUIRED_COMPARISONS} valid comparisons (16 posters), not agreeing with others. The receipt is signed by the review server from your own choices, so it cannot be made anywhere else.</p>`, 'accent'),
      card('Step by step for beginners', `<ol><li>On the exam page, in Q5, press <strong>Compare Time Use Charts</strong>. If it says the review is not open, reload the exam page later.</li><li>Read <strong>both</strong> posters in a pair.</li><li>Choose which story you would rather share: <strong>A</strong>, <strong>B</strong> or <strong>Both about equal</strong>.</li><li>Type a short, honest reason (a few words are enough, for example “clearer chart”).</li><li>Use <strong>Can't judge</strong> only for broken or unreadable posters; those do not count.</li><li>Repeat until you have <strong>${REQUIRED_COMPARISONS} valid comparisons</strong>. You can stop and resume.</li><li>Press the button that generates your signed receipt and copy it.</li><li>Check it below, paste it into the Q5 box on the exam page, press <strong>Check</strong>, then <strong>Save</strong>.</li></ol>`),
      card('Check your signed receipt', recordWidgetHtml('review', 'review receipt', email), 'accent'),
      details('If something goes wrong', '<ul><li><strong>The link stopped working:</strong> reload the exam page for a new one.</li><li><strong>The checker says the receipt belongs to someone else:</strong> use your own link and your own receipt.</li><li><strong>The exam says it is not complete:</strong> finish more comparisons, then generate a new receipt.</li></ul>'),
    ],
  });
}

export async function solve(email) {
  registerRecordWidget({ review: id });
  return {
    type: 'guide',
    answer: `Compare at least ${REQUIRED_COMPARISONS} poster pairs yourself in the review app, then paste your signed receipt and press Check and Save.`,
    variant: 'Peer review + receipt · guide',
    guide: buildGuide(String(email || '').trim()),
    answerDisplay: `### Review the posters, then paste your receipt\n\nComplete ${REQUIRED_COMPARISONS} comparisons with a short reason for each, copy the signed receipt, paste it into Q5, then Check and Save.`,
    debug: { question: 'Q5', needsUserInput: true, required: REQUIRED_COMPARISONS },
  };
}
