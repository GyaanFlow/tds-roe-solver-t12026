// Solver: Q5 — Reorganize Files with Shell Commands (Category Hash)
import { normalizeEmail, rng, sha256 } from './utils.js';

export const id = 'q-file-reorganizer';
export const title = 'Q5: Reorganize Files with Shell Commands';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-rename-files-server`;
  const r = rng(seed);

  const it = ["documentation", "reports", "notes", "configs", "data", "logs", "scripts", "templates", "resources", "archives"];
  const ge = ["résumé", "naïve-bayes", "日本語", "münchen", "café"];
  const at = [
    {name:"documentation_cleanup",title:"Documentation Repository Reorganization",description:"Reorganize scattered documentation files into a category-based flat structure",context:"technical documentation"},
    {name:"archive_migration",title:"Legacy Archive Migration",description:"Migrate legacy archive files from nested structure to categorized flat layout",context:"historical archives"},
    {name:"content_management",title:"Content Management System Refactoring",description:"Restructure CMS content files from hierarchical to category-based organization",context:"content files"},
    {name:"knowledge_base",title:"Knowledge Base Reorganization",description:"Flatten knowledge base articles while preserving category information",context:"knowledge articles"}
  ];

  const scenario = at[Math.floor(r() * at.length)];
  const h = [];
  const d = ["docs", "content", "archive", "project"];
  const e = ["chapter1", "section-a", "part 2", "módulo-3", "2024"];
  const c = ["intro", "advanced", "appendix", "données", "références"];

  for (let s = 0; s < 30; s++) {
    let o = 1 + Math.floor(r() * 3);
    let p = [];
    p.push(d[Math.floor(r() * d.length)]);
    if (o >= 2) p.push(e[Math.floor(r() * e.length)]);
    if (o >= 3) p.push(c[Math.floor(r() * c.length)]);
    if (r() < 0.2) {
      let C = ["spaces here", "file-name", "naïve", "café-2024", "test_file"];
      p.push(C[Math.floor(r() * C.length)]);
    }
    let y = `file${String(s + 1).padStart(2, "0")}.txt`;
    let S = r() < 0.1 ? y.replace("i", "\u0456") : y; // Cyrillic i replace
    let pathStr = [...p, S].join("/");
    let f;
    if (r() < 0.3 && ge.length > 0) {
      f = ge[Math.floor(r() * ge.length)];
    } else {
      f = it[Math.floor(r() * it.length)];
    }
    h.push({ path: pathStr, category: f });
  }

  let m = h.map(s => {
    let o = s.path.split("/");
    let p = o[o.length - 1];
    let y = o.slice(0, -1).join("-");
    return `${s.category}/${y}-${p}`;
  });

  m.sort((s, o) => {
    for (let p = 0; p < Math.min(s.length, o.length); p++) {
      if (s.charCodeAt(p) !== o.charCodeAt(p)) {
        return s.charCodeAt(p) - o.charCodeAt(p);
      }
    }
    return s.length - o.length;
  });

  const fileListStr = m.map(s => `./${s}`).join('\n') + '\n';
  const expectedHash = await sha256(fileListStr);

  return {
    type: 'solved',
    answer: expectedHash,
    variant: `${scenario.title} (${norm})`,
    answerDisplay: [
      `### Q5: Reorganize Files with Shell Commands`,
      `**Expected Hash:** \`${expectedHash}\``,
      ``,
      `**Reorganized Files (first 5):**`,
      `\`\`\dots`,
      m.slice(0, 5).join('\n') + '\n...',
      `\`\`\``,
    ].join('\n'),
    debug: {
      hash: expectedHash,
      scenario: scenario.name
    }
  };
}
