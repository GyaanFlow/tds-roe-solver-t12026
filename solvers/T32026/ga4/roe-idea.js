// Pure helpers for GA4 Q4 ("Invent an ROE question"): the four parts the exam asks for, a text builder, and a checker.
// The exam only requires 10 or more characters; the bonus is decided by faculty (up to +10, or -1 if not selected).

export const SECTIONS = [
  { key: 'question', label: 'Question', ask: 'What exactly would students do?' },
  { key: 'evaluation', label: 'Evaluation', ask: 'How would we grade their work in an automated way?' },
  { key: 'learning', label: 'Learning', ask: 'What would they learn and why is that useful?' },
  { key: 'resistance', label: 'Agent/solver resistance', ask: 'Why would an agent or off-the-shelf solver alone score poorly, and what could a student contribute to do better?' },
];
export const MIN_CHARS = 10;
export const MAX_CHARS = 6000;

const clean = (text) => String(text ?? '').replace(/\r\n/g, '\n').trim();

/** Builds the submission text from the four answers. Returns { ok, text, missing[] }. */
export function buildIdea(parts = {}) {
  const missing = SECTIONS.filter((s) => clean(parts[s.key]).length < 15).map((s) => s.label);
  const text = SECTIONS.map((s) => `${s.label}: ${clean(parts[s.key])}`).join('\n\n').slice(0, MAX_CHARS);
  return { ok: missing.length === 0, text, missing };
}

/** Mirrors the exam's rule (blank or under 10 characters = opt out) and says which of the four parts a pasted idea lacks. */
export function checkIdea(raw) {
  const text = clean(raw);
  if (text.length < MIN_CHARS) return { ok: false, optedOut: true, message: 'Blank or under 10 characters means you opt out: no bonus and no penalty.', missing: SECTIONS.map((s) => s.label) };
  const lower = text.toLowerCase();
  const has = (s) => lower.includes(`${s.label.toLowerCase()}:`) || (s.key === 'resistance' && /(resist|solver|agent)/.test(lower));
  const missing = SECTIONS.filter((s) => !has(s)).map((s) => s.label);
  const warnings = [];
  if (text.length > MAX_CHARS) warnings.push('This is very long; faculty read a subset, so a tight idea works better.');
  if (text.length < 200) warnings.push('This is short for four parts. A clear, specific idea scores better than a vague one.');
  return { ok: missing.length === 0, optedOut: false, message: missing.length ? `Missing: ${missing.join(', ')}.` : 'All four parts are present.', missing, warnings };
}
