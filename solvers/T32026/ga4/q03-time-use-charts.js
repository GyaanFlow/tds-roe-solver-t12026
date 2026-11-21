import { page, card, details } from '../p1/ui.js';
import { recordWidgetHtml, registerRecordWidget } from './record-check.js';

export const id = 'q-time-use-charts';
export const title = 'Time Use Charts: make a data poster with your team, live (45 minutes)';

export const DATA_URL = 'https://microdata.gov.in/NADA/index.php/catalog/236';
export const SESSIONS = [
  { startsAt: Date.parse('2026-11-12T15:30:00Z'), label: 'Thu 12 Nov, 9:00 pm IST' },
  { startsAt: Date.parse('2026-11-13T12:30:00Z'), label: 'Fri 13 Nov, 6:00 pm IST' },
  { startsAt: Date.parse('2026-11-14T02:30:00Z'), label: 'Sat 14 Nov, 8:00 am IST' },
];
const SESSION_MS = 45 * 60 * 1000;

export function sessionState(now = Date.now()) {
  const live = SESSIONS.find((s) => now >= s.startsAt && now <= s.startsAt + SESSION_MS + 60000);
  if (live) return { state: 'live', text: `A session is running now (started ${live.label}).` };
  const next = SESSIONS.find((s) => s.startsAt > now);
  if (next) return { state: 'before', text: `The next session starts ${next.label}.` };
  return { state: 'over', text: 'All three sessions are finished. If you played one, paste your signed record below; if you did not, there is nothing left to do for this question.' };
}

function buildGuide(email) {
  const status = sessionState();
  return page({
    title: '📊 Time Use Charts',
    chips: [{ text: status.state === 'over' ? 'Sessions over' : status.state === 'live' ? 'Live now' : 'Upcoming', tone: status.state === 'live' ? 'ok' : status.state === 'over' ? 'bad' : 'warn' }, { text: '10 marks (poster marked later)', tone: '' }, { text: 'Team of 3', tone: '' }],
    sections: [
      card('What this is', `<p class="p1-note"><strong>With 2 teammates and the same theme you study India\'s Time Use Survey 2024 and, in 45 live minutes, agree on one idea and make a data poster.</strong></p><p>${status.text}</p><ul>${SESSIONS.map((s) => `<li><strong>${s.label}</strong></li>`).join('')}</ul><p>Check gives 0 marks now; the posters are marked some days after the sessions. If you play more than one session, your best one counts.</p>`, 'accent'),
      card('Step by step for beginners', `<ol><li><strong>Before the session:</strong> download the <a href="${DATA_URL}" target="_blank" rel="noopener noreferrer">Time Use Survey 2024 data</a> and study it. Open your game link on the exam page to see your theme (it stays the same in every session).</li><li><strong>Join on time</strong> (up to 15 minutes early). You get a role: <strong>Designer</strong> (makes and uploads the chart), <strong>Writer</strong> (title, subtitle, bottom text, evidence) or <strong>Reviewer</strong> (checks and chats; cannot edit).</li><li><strong>00:00 to 15:00, alone:</strong> write one short idea from the data. You cannot chat or see others\' ideas.</li><li><strong>15:00 to 45:00, together:</strong> everyone must vote for the <strong>same</strong> idea (a majority is not enough), then make the poster. If you do not agree, you make nothing.</li><li><strong>Submit:</strong> everyone online approves the same version. Editing stops at 45:00 and you have 15 seconds to approve. <strong>Stay for all 45 minutes</strong>: if one person leaves, the team may be unable to submit and nobody gets marks for that session.</li><li><strong>When it ends,</strong> copy your signed record (a long text starting with eyJ), check it below, paste it into the exam box, press <strong>Check</strong>, then <strong>Save</strong>. You may use AI and outside help.</li></ol>`),
      card('Check your signed record', recordWidgetHtml('timeuse', 'Time Use Charts record', email), 'accent'),
      details('How the poster is marked', '<ul><li><strong>Uniqueness (25%):</strong> is your finding different from other teams\' findings? The finding is compared, not the words or design.</li><li><strong>Correctness (25%):</strong> does the poster match the data and the idea your team chose? Wrong or misleading claims lose marks.</li><li><strong>Comprehension (25%):</strong> shown only the poster, can people and AI tell what your idea is?</li><li><strong>Preference (25%):</strong> classmates compare two posters at a time, without names, and choose the better one.</li><li>The person whose idea the team chooses gets 20% of the marks; everyone gets the other 80%. If the team does not agree or does not submit a poster, nobody in the team gets marks for that session.</li></ul>'),
      details('Tips for a strong idea (for next time)', '<ul><li>Pick something surprising, important and <strong>true</strong>: check it in the data before you chart it.</li><li>One clear message per poster: a title that states the finding, a subtitle with the group and measure, and a note on the source.</li><li>Choose a chart that makes the difference obvious (a simple bar or line beats a busy one).</li><li>Different teams often pick the obvious finding, so look for a twist in your theme\'s questions.</li></ul>'),
      details('If something goes wrong', '<ul><li><strong>Your team did not agree:</strong> nothing is submitted for that session; another session may still be open.</li><li><strong>The checker says the record belongs to someone else:</strong> each student must use their own record.</li><li><strong>Check says not valid:</strong> copy the whole text again, with all three dot-separated parts.</li></ul>'),
    ],
  });
}

export async function solve(email) {
  registerRecordWidget({ timeuse: id });
  const status = sessionState();
  return {
    type: 'guide',
    answer: 'Play a live Time Use Charts session with your team, copy your signed record from the game, paste it here and press Check and Save. If the sessions are over and you did not play, there is nothing to submit.',
    variant: `Live team game + signed record · ${status.state}`,
    guide: buildGuide(String(email || '').trim()),
    answerDisplay: `### Play with your team, then paste your signed record\n\n${status.text}\n\nCopy the signed record from the game, check it in the Implementation Guide, paste it here, then press Check and Save.`,
    debug: { question: 'Q3', needsUserInput: true, sessionState: status.state },
  };
}
