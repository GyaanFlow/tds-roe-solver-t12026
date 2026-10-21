// Deadlines for the four T3 P1 questions, taken from the official question text (exam-tds-2026-09-p1.js).
// All instants are absolute, so the maths is the same in every time zone; IST is only used for display.

const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;
const at = (iso) => Date.parse(iso);

export const WINDOWS = {
  audio: {
    key: 'audio',
    label: 'Human Exchange recording',
    opens: at('2026-10-19T08:00:00+05:30'),
    closes: at('2026-10-21T23:59:59+05:30'),
    graceMs: 2 * 60 * 1000,
    note: 'Up to three uploads in total (an initial one and two revisions); only the latest counts.',
  },
  airInk: {
    key: 'airInk',
    label: 'Air Ink drawings',
    opens: null,
    closes: at('2026-10-26T23:59:59+05:30'),
    graceMs: 2 * 60 * 1000,
    note: 'The set of three drawings can be submitted up to three times; the latest received set counts.',
  },
  invoice: {
    key: 'invoice',
    label: 'Missing Invoice game',
    opens: at('2026-10-21T12:00:00+05:30'),
    closes: at('2026-10-23T12:00:00+05:30'),
    graceMs: 0,
    requestsClose: at('2026-10-23T04:00:00+05:30'),
    note: 'Requests close 8 hours before the end; an unanswered request after 8 hours goes to a volunteer or TA.',
  },
  market: {
    key: 'market',
    label: 'AI Pipe prediction market',
    opens: null,
    closes: at('2026-11-09T00:00:00Z'),
    graceMs: 0,
    targetStart: '2026-11-02',
    targetEnd: '2026-11-08',
    settlementFrom: at('2026-11-09T00:00:00Z'),
    settlementTo: at('2026-11-16T23:59:59Z'),
    note: 'Predictions can be saved and revised until trading closes; the result token exists only after settlement.',
  },
};

/** The two-digit pad used by every formatter below. */
const pad = (value) => String(value).padStart(2, '0');

/** "21 Oct 2026, 23:59 IST" for any instant, independent of the viewer's time zone. */
export function formatIst(ms) {
  const shifted = new Date(ms + IST_OFFSET_MS);
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][shifted.getUTCMonth()];
  return `${shifted.getUTCDate()} ${month} ${shifted.getUTCFullYear()}, ${pad(shifted.getUTCHours())}:${pad(shifted.getUTCMinutes())} IST`;
}

/** "1 d 3 h 20 min" (or "45 min"); never negative. */
export function formatRemaining(ms) {
  const total = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(total / 1440);
  const hours = Math.floor((total % 1440) / 60);
  const minutes = total % 60;
  if (days) return `${days} d ${hours} h ${minutes} min`;
  if (hours) return `${hours} h ${minutes} min`;
  return `${minutes} min`;
}

/**
 * Where a window stands at `now` (milliseconds). `state` is 'before', 'open', 'grace' (inside the upload
 * grace period after the close) or 'closed'; `text` is a plain sentence for the guide.
 */
export function windowStatus(window, now = Date.now()) {
  if (window.opens && now < window.opens) {
    return { state: 'before', msLeft: window.opens - now, text: `Opens ${formatIst(window.opens)} (in ${formatRemaining(window.opens - now)}).` };
  }
  if (now < window.closes) {
    return { state: 'open', msLeft: window.closes - now, text: `Open — closes ${formatIst(window.closes)} (${formatRemaining(window.closes - now)} left).` };
  }
  if (window.graceMs && now < window.closes + window.graceMs) {
    return { state: 'grace', msLeft: window.closes + window.graceMs - now, text: `Closed at ${formatIst(window.closes)}; the short upload grace period is still running (${formatRemaining(window.closes + window.graceMs - now)}).` };
  }
  return { state: 'closed', msLeft: 0, text: `Closed ${formatIst(window.closes)}.` };
}
