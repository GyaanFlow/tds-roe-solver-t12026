// Solver: Rename Files — FULLY auto-solvable
// Replicates seeded file generation + computes expected SHA256 hash

export const id = 'q-rename-files-server';
export const title = 'Reorganize Files (Shell SHA256)';

const CATEGORIES = ["documentation","reports","notes","configs","data","logs","scripts","templates","resources","archives"];
const UNICODE_CATS = ["résumé","naïve-bayes","日本語","münchen","café"];
const SCENARIOS = [
  { name: "documentation_cleanup", title: "Documentation Repository Reorganization", context: "technical documentation" },
  { name: "archive_migration", title: "Legacy Archive Migration", context: "historical archives" },
  { name: "content_management", title: "Content Management System Refactoring", context: "content files" },
  { name: "knowledge_base", title: "Knowledge Base Reorganization", context: "knowledge articles" }
];

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

async function sha256(str) {
  const data = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#${id}#roe-2026-01`);

  const scenario = SCENARIOS[Math.floor(rng() * SCENARIOS.length)];
  const dirs1 = ["docs","content","archive","project"];
  const dirs2 = ["chapter1","section-a","part 2","módulo-3","2024"];
  const dirs3 = ["intro","advanced","appendix","données","références"];

  const files = [];
  for (let f = 0; f < 30; f++) {
    const depth = 1 + Math.floor(rng() * 3);
    const parts = [];
    parts.push(dirs1[Math.floor(rng() * dirs1.length)]);
    if (depth >= 2) parts.push(dirs2[Math.floor(rng() * dirs2.length)]);
    if (depth >= 3) parts.push(dirs3[Math.floor(rng() * dirs3.length)]);

    if (rng() < 0.2) {
      const specials = ["spaces here","file-name","naïve","café-2024","test_file"];
      parts.push(specials[Math.floor(rng() * specials.length)]);
    }

    let fname = `file${String(f + 1).padStart(2, '0')}.txt`;
    const fnameUsed = rng() < 0.1 ? fname.replace('i', '\u0456') : fname;
    const fullPath = [...parts, fnameUsed].join('/');

    let category;
    if (rng() < 0.3 && UNICODE_CATS.length > 0) {
      category = UNICODE_CATS[Math.floor(rng() * UNICODE_CATS.length)];
    } else {
      category = CATEGORIES[Math.floor(rng() * CATEGORIES.length)];
    }

    files.push({ path: fullPath, category });
  }

  // Build expected file list
  const expectedFiles = files.map(f => {
    const segments = f.path.split('/');
    const filename = segments[segments.length - 1];
    const dirPart = segments.slice(0, -1).join('-');
    return `${f.category}/${dirPart}-${filename}`;
  });

  // LC_ALL=C sort (byte-order sort)
  expectedFiles.sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a.charCodeAt(i) !== b.charCodeAt(i)) return a.charCodeAt(i) - b.charCodeAt(i);
    }
    return a.length - b.length;
  });

  const fileList = expectedFiles.map(f => `./${f}`).join('\n') + '\n';
  const hash = await sha256(fileList);

  return {
    variant: `${scenario.title} — ${files.length} files, ${new Set(files.map(f => f.category)).size} categories`,
    answer: hash,
    type: 'solved',
    answerDisplay: `<strong>SHA256 hash:</strong> <code>${hash}</code><br><strong>Files:</strong> ${files.length}<br><strong>Categories:</strong> ${[...new Set(files.map(f => f.category))].join(', ')}`
  };
}
