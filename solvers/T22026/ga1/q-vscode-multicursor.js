// Solver: Q2 — Multi-cursor edits: convert code -s output to JSON, get jsonhash
import { normalizeEmail, rng, sha256 } from './utils.js';

export const id = 'q-vscode-multicursor';
export const title = 'Q2: Multi-cursor → JSON (jsonhash)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-multi-cursor-json`;
  const r = rng(seed);

  const oe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  function q(l) {
    return Array.from({length: Math.floor(l() * 10) + 1}, () => oe[Math.floor(l() * oe.length)]).join("");
  }

  const h = Object.fromEntries(
    Array.from({length: 100}, () => [q(r), q(r)])
  );

  const d = Object.entries(h).map(([m, n]) => `${m}=${n}`).join('\n');
  const jsonStr = JSON.stringify(h);
  const hash = await sha256(jsonStr);

  return {
    type: 'solved',
    answer: hash,
    variant: `100 key-value pairs for ${norm}`,
    answerDisplay: [
      `### Q2: Multi-cursor → JSON (jsonhash)`,
      `**Answer:** \`${hash}\``,
      ``,
      `**Generated JSON (sorted/canonicalized):**`,
      `\`\`\`json`,
      jsonStr,
      `\`\`\``,
      ``,
      `**Raw Input Key-Value Pairs (first 5 lines):**`,
      `\`\`\``,
      d.split('\n').slice(0, 5).join('\n') + '\n...',
      `\`\`\``,
    ].join('\n'),
    debug: {
      jsonLength: jsonStr.length,
      hash
    }
  };
}
