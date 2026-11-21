import { page, card, details } from '../p1/ui.js';
import { recordWidgetHtml, registerRecordWidget } from './record-check.js';
import { isRealBrowser, labelIst, loadSessions, sessionClock } from './schedule.js';

export const id = 'q-food-court-discount';
export const title = 'Food Court: share a food court, live (20 minutes)';

const EXAM = 'tds-2026-09-ga4';
const startsAt = (iso) => ({ startsAt: Date.parse(iso), endsAt: null, label: labelIst(Date.parse(iso)) });
// Shipped fallback: the three sessions on the games site schedule. In a browser the live schedule replaces these.
export const SESSIONS = [startsAt('2026-11-10T12:30:00Z'), startsAt('2026-11-11T02:00:00Z'), startsAt('2026-11-11T15:30:00Z')];
const SESSION_MS = 20 * 60 * 1000;
const JOIN_CLOSES_S = 90;

/** Which session is next/live/over right now, for the status line. */
export function sessionState(now = Date.now(), sessions = SESSIONS) {
  const clock = sessionClock(sessions, now, SESSION_MS);
  if (clock.state === 'live') return { state: 'live', text: `A session is running now (started ${clock.session.label}). Joining closes ${JOIN_CLOSES_S} seconds after the start.` };
  if (clock.state === 'before') return { state: 'before', text: `The next session starts ${clock.session.label}.` };
  return { state: 'over', text: 'All sessions are finished. If you played one, paste your best signed result below; if you did not, there is nothing left to do for this question.' };
}

function buildGuide(email, sessions, liveSchedule) {
  const status = sessionState(Date.now(), sessions);
  const rows = sessions.map((s) => `<li><strong>${s.label}</strong></li>`).join('');
  return page({
    title: '🍜 Food Court',
    chips: [{ text: status.state === 'over' ? 'Sessions over' : status.state === 'live' ? 'Live now' : 'Upcoming', tone: status.state === 'live' ? 'ok' : status.state === 'over' ? 'bad' : 'warn' }, { text: '10 marks', tone: '' }, { text: '20-minute live game', tone: '' }],
    sections: [
      card('What this is', `<p class="p1-note"><strong>You run one of 4 or 5 restaurants in a shared food court for a year. Each month you choose 0%, 10% or 20% off. Your mark is 60% your room's total profit and 40% your own profit.</strong></p><p>${status.text}</p><ul>${rows}</ul><p class="p1-foot">${liveSchedule ? 'Session times were just read from the games site.' : 'Session times are the ones published for this exam; check the exam page if they have changed.'}</p><p>Your mark is the final score out of 100 times 10. Any valid final result counts, and if you played more than one session you paste your best.</p>`, 'accent'),
      card('Step by step for beginners', '<ol><li><strong>Before the session:</strong> open <strong>Open Food Court</strong> on the exam page up to 15 minutes early (the link is personal and expires after 20 minutes; reload for a new one).</li><li>Press <strong>Join</strong>. Be on time: joining closes 90 seconds after the start. You are placed in a room of 4 or 5; if you cannot be placed it does not count against you, so join another session.</li><li><strong>Choose a discount for each month</strong> (0%, 10% or 20%) and press <strong>Save</strong>. Only saved plans count; the game records plans at 07:00, 12:00, 17:00 and at the end.</li><li><strong>Talk with your room</strong> in the chat. The best result for everyone comes from agreeing a plan.</li><li><strong>At the end</strong> copy your signed result (a long text starting with eyJ).</li><li>Paste it in the checker below, then into the exam box, press <strong>Check</strong>, then <strong>Save</strong>. You can use AI agents and outside help.</li></ol>'),
      card('How to think about the discount', '<p>A discount wins customers from the other restaurants and brings more visitors to everyone, but you keep less from every meal. Your mark mixes the room\'s total (60%) with your own (40%), so:</p><ul><li>If <strong>only you</strong> discount, you steal customers and your own profit usually rises, but the room\'s total moves little.</li><li>If <strong>everyone</strong> discounts heavily, the customers just split again while every meal earns less, so the room\'s total drops. This is a trap that rooms fall into.</li><li>So propose a shared plan in the first minutes (for example, the same moderate discount for everyone) and check that people keep to it. Re-plan during the year if the room drifts.</li></ul><p class="p1-foot">This is general reasoning, not a tested strategy: the game\'s exact numbers are only visible in the game.</p>'),
      card('Check your signed result', recordWidgetHtml('foodcourt', 'Food Court result', email), 'accent'),
      details('If something goes wrong', '<ul><li><strong>You were not placed in a room:</strong> it does not count and is not a zero; join another session if one is left.</li><li><strong>The checker says the record belongs to someone else:</strong> every student must use their own record from their own game link.</li><li><strong>The exam says the result is not valid:</strong> copy the whole text again, including all three dot-separated parts.</li></ul>'),
    ],
  });
}

export async function solve(email, _sessionToken, options = {}) {
  registerRecordWidget({ foodcourt: id });
  // Only a real browser asks the games site; Node (tests, previews) uses the shipped times.
  const loaded = options.fetchImpl || isRealBrowser()
    ? await loadSessions({ game: 'food-court', exam: EXAM, fallback: SESSIONS, fetchImpl: options.fetchImpl })
    : { sessions: SESSIONS, live: false };
  const status = sessionState(Date.now(), loaded.sessions);
  return {
    type: 'guide',
    answer: 'Play a live Food Court session, copy your signed result from the game, paste it here and press Check and Save. If the sessions are over and you did not play, there is nothing to submit.',
    variant: `Live game + signed result · ${status.state}`,
    guide: buildGuide(String(email || '').trim(), loaded.sessions, loaded.live),
    answerDisplay: `### Play, then paste your signed result\n\n${status.text}\n\nCopy the signed result from the game, check it in the Implementation Guide, paste it here, then press Check and Save.`,
    debug: { question: 'Q2', needsUserInput: true, sessionState: status.state, liveSchedule: loaded.live },
  };
}
