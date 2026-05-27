// Solver: Q16 — Move and Rename Files
import { normalizeEmail, rng, sha256 } from './utils.js';

export const id = 'q-move-rename-files';
export const title = 'Q16: Move and rename files';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomName(rngFn) {
  const length = Math.floor(rngFn() * 10) + 1;
  return Array.from(
    { length },
    () => CHARS[Math.floor(rngFn() * CHARS.length)]
  ).join('');
}

function renameDigits(filename) {
  return filename.replace(/[0-9]/g, (digit) => String((Number(digit) + 1) % 10));
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  const filenames = new Set();

  // Mirrors the exam generator:
  // 3 random folders, up to 10 globally unique .txt filenames each.
  for (let folderIndex = 0; folderIndex < 3; folderIndex++) {
    randomName(n).toLowerCase(); // folder name is generated but not used in final hash

    for (let fileIndex = 0; fileIndex < 10; fileIndex++) {
      const filename = `${randomName(n)}.txt`.toLowerCase();

      if (!filenames.has(filename)) {
        filenames.add(filename);
      }
    }
  }

  const grepSortedOutput = [...new Set(
    [...filenames].map((filename) => `${renameDigits(filename)}:x\n`)
  )].sort().join('');

  const hash = await sha256(grepSortedOutput);

  const bashGuide = `
# After extracting q-move-rename-files.zip:
mkdir -p output
find . -mindepth 2 -type f -name '*.txt' -exec sh -c '
  for file do
    base=$(basename "$file")
    new=$(printf "%s" "$base" | tr "0123456789" "1234567890")
    mv "$file" "output/$new"
  done
' sh {} +

cd output
grep . * | LC_ALL=C sort | sha256sum
`.trim();

  return {
    type: 'solved',
    variant: 'Direct deterministic hash — read Implementation Guide for details instruction how to use',
    answer: hash,
    guide: [
      `### Implementation Guide`,
      ``,
      `The direct answer is the hash in the answer box.`,
      ``,
      `If you want to verify manually:`,
      ``,
      `1. Download and extract \`q-move-rename-files.zip\`.`,
      `2. Move every \`.txt\` file from all subfolders into one empty folder.`,
      `3. Rename each file by replacing every digit with the next digit: \`1 -> 2\`, \`8 -> 9\`, \`9 -> 0\`.`,
      `4. Run this inside the final folder:`,
      ``,
      `\`\`\`bash`,
      `grep . * | LC_ALL=C sort | sha256sum`,
      `\`\`\``,
      ``,
      `### Bash Helper`,
      ``,
      `\`\`\`bash`,
      bashGuide,
      `\`\`\``,
    ].join('\n'),
    answerDisplay: [
      `### Move and Rename Files`,
      ``,
      `- **Generated hash:** \`${hash}\``,
      ``,
      `Submit this hash as the answer.`,
      ``,
      `Read the Implementation Guide for details instruction how to use.`,
    ].join('\n'),
  };
}
