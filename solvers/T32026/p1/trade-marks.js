// Pure helpers for the Human Exchange and Picture Stories guides: the published mark formulas, the offer text builder,
// the story/prompt builders and the square-picture geometry. No DOM and no network, so everything is unit-tested.

/** Human Exchange Round 1: selling pays 4, 2, 1, 0.5 ... per NEW buyer; buying pays 2, 1, 0.5 ... per NEW seller; capped at 10. */
export function exchangeMarks({ newBuyers = 0, newSellers = 0 } = {}) {
  const count = (n) => Math.max(0, Math.min(40, Math.floor(Number(n) || 0)));
  const series = (first, n) => { let total = 0; let part = first; for (let i = 0; i < n; i += 1) { total += part; part /= 2; } return total; };
  const selling = series(4, count(newBuyers));
  const buying = series(2, count(newSellers));
  return { selling, buying, total: Math.min(10, selling + buying), capped: selling + buying > 10 };
}

/** What the next new trade is worth, so a student can see where effort pays most. */
export function nextTradeValue({ newBuyers = 0, newSellers = 0 } = {}) {
  const n = (v) => Math.max(0, Math.min(40, Math.floor(Number(v) || 0)));
  return { selling: 4 / 2 ** n(newBuyers), buying: 2 / 2 ** n(newSellers) };
}

const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);

/** A clear, honest one-paragraph listing for the Human Exchange from three plain answers. */
export function buildOffer({ service, forWho, deliver, price } = {}) {
  const s = clean(service, 120); const w = clean(forWho, 120); const d = clean(deliver, 120);
  const missing = [['what you offer', s], ['who it helps', w], ['how you deliver it', d]].filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) return { ok: false, message: `Fill in: ${missing.join(', ')}.` };
  const credits = Math.min(10, Math.max(1, Math.round(Number(price) || 3)));
  const text = `I can ${s.replace(/^i can\s+/i, '').replace(/[.!]+$/, '')}. It is best for ${w.replace(/[.!]+$/, '')}. I will ${d.replace(/^i will\s+/i, '').replace(/[.!]+$/, '')}. Suggested price: ${credits} credit${credits === 1 ? '' : 's'}; happy to agree a different price in the chat.`;
  return { ok: true, text, credits };
}

/** The three-line story the game asks for (situation, change, outcome) plus a short narration script. */
export function buildStory({ situation, change, outcome } = {}) {
  const a = clean(situation, 160); const b = clean(change, 160); const c = clean(outcome, 160);
  const missing = [['the situation', a], ['what changes', b], ['the outcome', c]].filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) return { ok: false, message: `Fill in: ${missing.join(', ')}.` };
  const end = (v) => (/[.!?]$/.test(v) ? v : `${v}.`);
  const lines = [end(a), end(b), end(c)];
  return { ok: true, story: lines.join(' '), lines, words: lines.join(' ').split(' ').length };
}

/** A prompt for an AI image tool that keeps the picture wordless and square. */
export function buildPicturePrompt({ situation, change, outcome, style = 'simple flat illustration', panels = 3 } = {}) {
  const story = buildStory({ situation, change, outcome });
  if (!story.ok) return story;
  const n = Math.min(4, Math.max(1, Math.round(Number(panels) || 3)));
  const layout = n === 1 ? 'one single scene' : `${n} panels in a clear left-to-right (or 2x2) sequence`;
  return {
    ok: true,
    prompt: `Create a square image, ${layout}, that tells this story with NO words at all: ${story.story} Style: ${clean(style, 60) || 'simple flat illustration'}. Strict rules: absolutely no letters, numbers, captions, signs, signatures, logos or speech-bubble text anywhere; use arrows or pictorial symbols only if needed. Make the characters and the change between panels easy to see.`,
  };
}

/** Centre-crop rectangle that makes any picture square, and the size to draw it at (never upscaled). */
export function squareCrop(width, height, maxSide = 1024) {
  const w = Math.floor(Number(width)); const h = Math.floor(Number(height));
  if (!(w > 0) || !(h > 0)) return null;
  const side = Math.min(w, h);
  return { sx: Math.floor((w - side) / 2), sy: Math.floor((h - side) / 2), side, out: Math.max(16, Math.min(side, Math.floor(maxSide) || 1024)) };
}

/** Plain-language risks a student should read before uploading (shown as a checklist, not an automatic verdict). */
export const NO_WORDS_CHECKLIST = [
  'No letters or numbers anywhere, including on signs, clothes, screens, books, clocks or street names.',
  'No captions, titles, signatures or watermarks.',
  'No speech or thought bubbles that contain text (empty bubbles are fine).',
  'Arrows, hearts, stars and other pictures are fine.',
  'The picture is square and shows the whole story in one to four panels.',
];
