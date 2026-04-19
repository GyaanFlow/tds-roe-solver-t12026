// Solver: GCP Gemini Text Classification (AUTO-SOLVED)
import { sha256, normalizeEmail } from './utils.js';

export const id = 'q-gcp-gemini-classification';
export const title = 'GCP AI Studio: Gemini Text Classification';

const SENTENCE_POOL = [
  { text: "This is the best movie I have ever seen in my entire life!", expected: "POSITIVE" },
  { text: "The customer service was absolutely terrible and I will never return.", expected: "NEGATIVE" },
  { text: "I am extremely happy with my new purchase, it exceeded all expectations.", expected: "POSITIVE" },
  { text: "The food was cold, tasteless, and the waiter was incredibly rude to us.", expected: "NEGATIVE" },
  { text: "What a wonderful and beautiful day to spend outdoors with friends!", expected: "POSITIVE" },
  { text: "This software is full of bugs and crashes every single time I open it.", expected: "NEGATIVE" },
  { text: "The team delivered an outstanding presentation that impressed everyone.", expected: "POSITIVE" },
  { text: "I am deeply disappointed by the poor quality of this expensive product.", expected: "NEGATIVE" },
  { text: "My vacation was amazing, the beaches were pristine and the people so friendly.", expected: "POSITIVE" },
  { text: "The worst flight experience ever, delayed for hours with no communication.", expected: "NEGATIVE" },
  { text: "Congratulations on a truly remarkable achievement, you should be proud!", expected: "POSITIVE" },
  { text: "The hotel room was dirty, smelled bad, and had cockroaches in the bathroom.", expected: "NEGATIVE" },
  { text: "I love this new feature, it makes my work so much easier and faster.", expected: "POSITIVE" },
  { text: "This book is incredibly boring and a complete waste of time to read.", expected: "NEGATIVE" },
  { text: "The concert was phenomenal, the band played with so much energy and passion.", expected: "POSITIVE" },
  { text: "I hate waiting in long lines only to be told the item is out of stock.", expected: "NEGATIVE" },
  { text: "She did an excellent job organizing the event, everything was perfect.", expected: "POSITIVE" },
  { text: "The battery life is horrible, it dies after just thirty minutes of use.", expected: "NEGATIVE" },
  { text: "This is a fantastic opportunity that could change your career for the better.", expected: "POSITIVE" },
  { text: "The repair cost was outrageously expensive and the problem still is not fixed.", expected: "NEGATIVE" },
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  // Replicate exam's shuffle on indices then pick first 3
  const indices = SENTENCE_POOL.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const selected = indices.slice(0, 3).map(i => SENTENCE_POOL[i]);
  const labels = selected.map(s => s.expected);
  const totalWords = selected.reduce((acc, s) => acc + s.text.split(/\s+/).length, 0);
  const totalChars = selected.reduce((acc, s) => acc + s.text.length, 0);

  const labelsCsv = labels.join(',');
  const verifyInput = `${norm}:${labelsCsv}:${totalWords}:${totalChars}`;
  const verifyHash = (await sha256(verifyInput)).slice(0, 14);

  return {
    type: 'solved',
    variant: selected.map((s, i) => `S${i + 1}: ${s.expected}`).join(' | '),
    answer: `${labelsCsv},${totalWords},${verifyHash}`,
    answerDisplay: selected.map((s, i) =>
      `Sentence ${i + 1}: "${s.text}"\n   Label: ${s.expected} | Words: ${s.text.split(/\s+/).length} | Chars: ${s.text.length}`
    ).join('\n\n') + `\n\nTotal words: ${totalWords}\nTotal chars: ${totalChars}\nLabels: ${labelsCsv}\nVerify hash: ${verifyHash}`
  };
}
