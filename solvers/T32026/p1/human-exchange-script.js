// Script builder for the P1 "TDS Human Exchange" recording (at most 60 seconds, in the student's own voice).
// The exam welcomes a script drafted with help, and asks for these points: what the buyer receives, why it is useful,
// what you personally do, how fast you deliver, the limits, and how the buyer can verify delivery. This module
// turns the student's own answers into a spoken script that fits the time limit — it does not invent the offer.

import { hashSeed } from './aipipe-forecast.js';

export const MAX_SECONDS = 60;
// 2.3 words a second is a calm, clear pace (about 138 words a minute); the target leaves a safety margin.
export const WORDS_PER_SECOND = 2.3;
export const TARGET_SECONDS = 54;

export const FIELDS = [
  { key: 'title', label: 'Name of your service', hint: 'A short, specific name', required: true },
  { key: 'receives', label: 'What the buyer receives', hint: 'The exact deliverable', required: true },
  { key: 'why', label: 'Why it is useful', hint: 'The problem it solves for another student', required: true },
  { key: 'personal', label: 'What you personally do', hint: 'Your own actions and responsibility', required: true },
  { key: 'delivery', label: 'How quickly you deliver', hint: 'For example: within 24 hours', required: true },
  { key: 'limits', label: 'Limits', hint: 'What you will not do or promise', required: true },
  { key: 'verify', label: 'How the buyer can verify delivery', hint: 'Evidence they can check', required: true },
];

// Starting points taken from the examples in the question (ideas, not restrictions). Every field stays editable.
export const IDEAS = [
  { id: 'confused-user', title: 'Your First Confused User', receives: 'a screen recording of me trying your website without any help', why: 'it shows exactly where a first-time visitor gets stuck', personal: 'I will use the site cold and narrate what I expect at each step', delivery: 'within 24 hours of the agreed time', limits: 'one site, ten minutes, and nothing that needs a login or payment', verify: 'by watching the recording and checking the timestamps of each stuck point' },
  { id: 'misread-chart', title: "I'll Misread Your Chart", receives: 'a short note on what I understood from your chart and what I got wrong', why: 'you learn whether the chart says what you meant', personal: 'I will read the chart with no explanation and write down my honest interpretation', delivery: 'within one day', limits: 'one visualization at a time, and I will not fix the chart for you', verify: 'by comparing my written reading with the message you intended' },
  { id: 'device-test', title: 'Test on My Device', receives: 'a test report with screenshots from my phone, browser and connection', why: 'it finds failures you cannot see on your own machine', personal: 'I will run your app on my device and record every failure I find', delivery: 'within 24 hours', limits: 'one device and one connection, and no destructive testing', verify: 'through the screenshots, the device details and the steps to reproduce' },
  { id: 'skeptical-customer', title: 'Skeptical Customer', receives: 'a written list of objections after hearing your three minute pitch', why: 'it shows which claims are not convincing before a real customer does', personal: 'I will listen carefully, raise honest objections and rate how convincing each answer was', delivery: 'the same day as the pitch', limits: 'three minutes of pitch, and I give opinions, not sales promises', verify: 'by reading my objections against the points you made' },
  { id: 'real-world-data', title: 'Real-World Data Points', receives: 'three local measurements with times, methods and photos', why: 'you get fresh data that is not available online', personal: 'I will take each measurement myself and note exactly how', delivery: 'within two days', limits: 'safe public places in my city only', verify: 'through the timestamps, photos and the method notes' },
  { id: 'mock-interview', title: 'Mock Interview', receives: 'a twenty minute live interview and specific written feedback', why: 'unexpected follow-up questions prepare you for the real thing', personal: 'I will prepare questions, interview you and write down strengths and gaps', delivery: 'at a time we agree within three days', limits: 'one role, one session, and no promise of a job outcome', verify: 'through the notes I share with the questions I asked' },
  { id: 'explain-it', title: 'Explain It to Me', receives: 'my plain-language restatement of your explanation and the points that confused me', why: 'it reveals gaps in your explanation', personal: 'I will listen, repeat back what I understood and mark every unclear step', delivery: 'during our call', limits: 'one topic and thirty minutes', verify: 'by checking my restatement against what you meant' },
  { id: 'find-blind-spot', title: 'Find My Blind Spot', receives: 'one concrete counterexample to an assumption in your project', why: 'you find a weakness before your reviewers do', personal: 'I will study your project and test one assumption until it breaks or holds', delivery: 'within two days', limits: 'one assumption, and I only report what I can show', verify: 'by running the counterexample I give you' },
  { id: 'reproduce-bug', title: 'Reproduce My Bug', receives: 'a clean-environment reproduction and the smallest steps that trigger the failure', why: 'maintainers fix bugs faster when they can reproduce them', personal: 'I will set up a fresh environment and write the minimal failing case', delivery: 'within 48 hours', limits: 'public software only, and I do not change your code', verify: 'by following my steps on your own machine' },
  { id: 'paired-problem', title: 'Paired Problem-Solving', receives: 'twenty minutes of working together on one concrete problem and written next steps', why: 'a second mind unblocks you faster', personal: 'I will prepare, think out loud with you and write the next steps afterwards', delivery: 'at a time we agree this week', limits: 'one problem and twenty minutes', verify: 'through the notes I send you after the session' },
];

const VARIANTS = {
  open: ['Hi, I am offering', 'Hello, my offer is called', 'Here is my offer:'],
  receives: ['You will receive', 'What you get is', 'The buyer receives'],
  why: ['This is useful because', 'It helps because', 'It matters because'],
  personal: ['Personally, I will', 'My part is that I will', 'I am responsible for this: I will'],
  delivery: ['I can deliver', 'You will have it', 'Delivery is'],
  limits: ['The limits are', 'To be clear about limits:', 'What I will not do:'],
  verify: ['You can verify delivery', 'To check I delivered, you can verify', 'Verification is simple:'],
  close: ['If that helps you, I would love to trade.', 'I would be glad to trade with you.', 'Please get in touch if this is useful.'],
};

const wordsOf = (text) => (String(text ?? '').trim() ? String(text).trim().split(/\s+/) : []);
export const countWords = (text) => wordsOf(text).length;
const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').replace(/[.!\s]+$/, '').trim();

function clip(value, maxWords) {
  const words = wordsOf(clean(value));
  return words.length <= maxWords ? words.join(' ') : words.slice(0, maxWords).join(' ');
}

const pick = (list, seed, salt) => list[(seed + salt * 7) % list.length];

// Things the exam says an offer must not involve; this is a reminder, not a judge.
const SAFETY_RULES = [
  { pattern: /\b(password|passcode|otp|one[- ]time (code|pin)|credentials?|api[- ]?keys?|secret|login details|cvv|card number|bank account|aadhaar|pan card)\b/i, message: 'It mentions credentials or private data. The offer must not involve those.' },
  { pattern: /\b(hack|crack|bypass|phish|impersonat|pirat|cheat|exam answers?|leak)\b/i, message: 'It sounds like something that may break the rules. The service must be legal and follow the IITM BS programme guidelines.' },
  { pattern: /\b(without (their |any )?(consent|permission)|secretly|spy on|stalk|track someone)\b/i, message: 'Contacting or observing people without consent is not allowed.' },
  { pattern: /\b(dangerous|unsafe|trespass|climb|explosive|weapon)\b/i, message: 'Unsafe activities are not allowed; keep it safe and publicly accessible.' },
];

export function safetyFlags(fields) {
  const text = FIELDS.map((f) => fields?.[f.key] ?? '').join(' . ');
  return SAFETY_RULES.filter((rule) => rule.pattern.test(text)).map((rule) => rule.message);
}

export function missingFields(fields) {
  return FIELDS.filter((f) => f.required && countWords(fields?.[f.key]) < (f.key === 'title' ? 1 : 3)).map((f) => f.label);
}

/** Deterministic, email-seeded suggestions so classmates are not all handed the same starting point. */
export function suggestIdeas(email, count = 3) {
  const seed = hashSeed(String(email ?? '').trim().toLowerCase() + '#t3-p1-human-exchange');
  const order = IDEAS.map((idea, index) => ({ idea, key: hashSeed(`${seed}:${index}`) })).sort((a, b) => a.key - b.key);
  return order.slice(0, Math.max(1, Math.min(count, IDEAS.length))).map((entry) => entry.idea);
}

/**
 * Builds the spoken script. If it would run past the target, each part is shortened a few words at a time
 * (never dropping a required point) until it fits; the result says what was trimmed.
 */
export function buildScript(fields, { email = '', wordsPerSecond = WORDS_PER_SECOND, targetSeconds = TARGET_SECONDS } = {}) {
  const seed = hashSeed(String(email).trim().toLowerCase() + '#t3-p1-human-exchange-script');
  const build = (limit) => {
    const f = (key, cap = limit) => clip(fields?.[key], key === 'title' ? 8 : cap);
    const lines = [
      `${pick(VARIANTS.open, seed, 1)} "${f('title')}".`,
      `${pick(VARIANTS.receives, seed, 2)} ${f('receives')}.`,
      `${pick(VARIANTS.why, seed, 3)} ${f('why')}.`,
      `${pick(VARIANTS.personal, seed, 4)} ${f('personal').replace(/^i (will )?/i, '')}.`,
      `${pick(VARIANTS.delivery, seed, 5)} ${f('delivery')}.`,
      `${pick(VARIANTS.limits, seed, 6)} ${f('limits')}.`,
      `${pick(VARIANTS.verify, seed, 7)} ${f('verify')}.`,
      pick(VARIANTS.close, seed, 8),
    ];
    return lines.join('\n');
  };

  const warnings = [];
  const missing = missingFields(fields);
  let limit = 26;
  let script = build(limit);
  let trimmed = false;
  while (countWords(script) / wordsPerSecond > targetSeconds && limit > 6) {
    limit -= 2;
    script = build(limit);
    trimmed = true;
  }
  const words = countWords(script);
  const seconds = words / wordsPerSecond;
  if (trimmed) warnings.push(`Some parts were shortened to fit under ${targetSeconds} seconds. Shorter, sharper answers in the form give a better script.`);
  if (seconds > MAX_SECONDS) warnings.push(`Even the shortest version runs about ${Math.round(seconds)} seconds. Cut words from the form fields.`);
  if (missing.length) warnings.push(`Still to fill in: ${missing.join(', ')}.`);
  const flags = safetyFlags(fields);
  return { script, words, seconds: Math.round(seconds * 10) / 10, fits: seconds <= MAX_SECONDS && missing.length === 0, missing, flags, warnings, trimmed };
}
