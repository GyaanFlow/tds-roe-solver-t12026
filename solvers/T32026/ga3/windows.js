// Humans Only game windows, from the official question text (exam-tds-2026-09-ga3.js). Re-uses the P1 clock helpers.
import { formatIst, formatRemaining, windowStatus } from '../p1/windows.js';

export { formatIst, formatRemaining, windowStatus };

const at = (iso) => Date.parse(iso);

export const HUMANS_ONLY = {
  draw: { key: 'draw', label: 'Draw', opens: at('2026-10-21T12:00:00+05:30'), closes: at('2026-10-24T08:00:00+05:30'), graceMs: 0 },
  guess: { key: 'guess', label: 'Guess', opens: at('2026-10-22T12:00:00+05:30'), closes: at('2026-10-25T12:00:00+05:30'), graceMs: 0 },
  submit: { key: 'submit', label: 'Check and Save', opens: at('2026-10-25T12:00:00+05:30'), closes: at('2026-10-25T23:59:00+05:30'), graceMs: 0 },
};
