// Solver: Q7 — Crawl HTML: Link Normalization (Direct Solution)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-crawl-html';
export const title = 'Q7: Crawl HTML: Link Normalization';

const FILE_COUNTS = {
  t: 9, n: 4, s: 12, i: 3, w: 8, e: 7, a: 6, p: 10, f: 8, m: 7,
  h: 5, c: 3, y: 1, o: 7, v: 3, r: 3, d: 4, l: 2, b: 2, q: 1, u: 1
};

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  const startIndex = Math.floor(n() * 16);
  const endIndex = startIndex + 10 + Math.floor(n() * (26 - startIndex - 10));
  const startLetter = String.fromCharCode(65 + startIndex);
  const endLetter = String.fromCharCode(65 + endIndex);
  const totalCount = Object.entries(FILE_COUNTS).reduce((sum, [letter, count]) => {
    const upper = letter.toUpperCase();
    return upper >= startLetter && upper <= endLetter ? sum + count : sum;
  }, 0);

  const matchedLetters = Object.entries(FILE_COUNTS)
    .filter(([letter]) => {
      const upper = letter.toUpperCase();
      return upper >= startLetter && upper <= endLetter;
    })
    .map(([letter, count]) => `${letter.toUpperCase()}=${count}`)
    .sort()
    .join(', ');

  return {
    type: 'solved',
    variant: `Letter Range: ${startLetter}-${endLetter}`,
    answer: totalCount.toString(),
    answerDisplay: `### Crawl Results\n\n- **Target Range:** Files starting with **${startLetter}** to **${endLetter}**\n- **Total Count:** \`${totalCount}\`\n- **Breakdown:** ${matchedLetters}\n\nPaste the count into the exam portal.`,
  };
}
