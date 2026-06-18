// Solver: Q3 — Prettier SHA256 hash of README.md
import { normalizeEmail, rng, sha256 } from './utils.js';

export const id = 'q-prettier-sha256';
export const title = 'Q3: Prettier SHA256 of README.md';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-npx-prettier`;
  const r = rng(seed);

  const oe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function Ge(l, u) {
    return Array.from({length: l}, () => {
      let t = u();
      return t < 0.8 ? oe[Math.floor(t / 0.8 * oe.length)] : t < 0.99 ? " " : `\n`;
    });
  }

  const rText = [
    "#  Badly  Formatted  Markdown    ",
    "",
    "*  This is an uneven list",
    "* With inconsistent spacing",
    "   *    And weird indentation",
    "",
    ">This quote has no space",
    ">   This one has too many",
    ""
  ].join('\n');

  const d = rText + '\n' + Ge(300, r).join("");

  // Dynamically load Prettier based on environment
  let format;
  let markdownPlugin;
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    const prettier = await import('prettier');
    format = prettier.format;
    markdownPlugin = await import('prettier/plugins/markdown');
  } else {
    const prettier = await import('https://cdn.jsdelivr.net/npm/prettier@3.4.2/+esm');
    format = prettier.format;
    markdownPlugin = (await import('https://cdn.jsdelivr.net/npm/prettier@3.4.2/plugins/markdown.mjs')).default;
  }

  const formatted = await format(d, {
    parser: "markdown",
    plugins: [markdownPlugin]
  });

  const hash = await sha256(formatted);

  return {
    type: 'solved',
    answer: hash,
    variant: `Seeded README.md for ${norm}`,
    answerDisplay: [
      `### Q3: Prettier SHA256 of README.md`,
      `**Answer:** \`${hash}\``,
      ``,
      `**Formatted Markdown (first 5 lines):**`,
      `\`\`\`markdown`,
      formatted.split('\n').slice(0, 5).join('\n') + '\n...',
      `\`\`\``
    ].join('\n'),
    debug: {
      originalLength: d.length,
      formattedLength: formatted.length,
      hash
    }
  };
}
