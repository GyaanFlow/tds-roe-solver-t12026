// Solver: Q7 — Three-way merge conflict count (programmatic)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-config-merge-conflicts';
export const title = 'Q7: Three-Way Configuration Merge: Detect Conflicts';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-config-merge-conflicts`;
  const r = rng(seed);

  const h = 50 + Math.floor(r() * 30);
  const d = Array.from({length: h}, (C, g) => `setting_${String(g + 1).padStart(3, "0")}`);
  const e = {};
  d.forEach(C => {
    e[C] = {
      value: Math.floor(r() * 100),
      enabled: r() < 0.7,
      priority: Math.floor(r() * 10)
    };
  });

  const c = JSON.parse(JSON.stringify(e));
  const m = new Set();
  const n = Math.floor(h * 0.3);
  for (let C = 0; C < n; C++) {
    const g = d[Math.floor(r() * d.length)];
    m.add(g);
    c[g].value = Math.floor(r() * 100);
  }

  const a = JSON.parse(JSON.stringify(e));
  const s = new Set();
  const o = Math.floor(h * 0.3);
  for (let C = 0; C < o; C++) {
    const g = d[Math.floor(r() * d.length)];
    s.add(g);
    a[g].value = Math.floor(r() * 100);
  }

  let p = 0;
  const y = [];
  m.forEach(C => {
    if (s.has(C) && c[C].value !== a[C].value) {
      p++;
      y.push(C);
    }
  });

  return {
    type: 'solved',
    answer: String(p),
    variant: `${h} settings for ${norm}`,
    answerDisplay: [
      `### Q7: Three-Way Configuration Merge: Detect Conflicts`,
      `**Conflict Count:** \`${p}\``,
      ``,
      `**Details:**`,
      `- Total settings: ${h}`,
      `- Changed in Branch A: ${m.size}`,
      `- Changed in Branch B: ${s.size}`,
      `- Conflicting keys: ${y.join(', ') || 'none'}`,
    ].join('\n'),
    debug: {
      settingsCount: h,
      conflictsCount: p,
      conflictingKeys: y
    }
  };
}
