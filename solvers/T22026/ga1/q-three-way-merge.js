// Solver: Q6 — Three-way merge conflict counter
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-three-way-merge';
export const title = 'Q6: Three-Way Merge Conflict Count';

// Mirrors the exam's conflict generation logic
function generateConfigs(n, seed) {
  const r = rng(seed);
  const base = {};
  for (let i = 0; i < n; i++) {
    base[`setting_${i}`] = {
      value: Math.floor(r() * 1000),
      enabled: r() > 0.5,
      priority: Math.floor(r() * 10),
    };
  }
  return base;
}

function applyChanges(base, changeCount, seed, r) {
  const branch = JSON.parse(JSON.stringify(base));
  const keys = Object.keys(base);
  const changed = new Set();

  for (let i = 0; i < changeCount; i++) {
    const key = keys[Math.floor(r() * keys.length)];
    if (!changed.has(key)) {
      changed.add(key);
      branch[key] = { ...branch[key], value: Math.floor(r() * 1000) };
    }
  }
  return branch;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-three-way-merge`);

  // Generate parameters like the exam does
  const totalSettings = Math.floor(r() * 50) + 50; // 50-100 settings
  const changesA = Math.floor(r() * 20) + 10;      // 10-30 changes in branch A
  const changesB = Math.floor(r() * 20) + 10;      // 10-30 changes in branch B

  // Generate base config
  const base = {};
  for (let i = 0; i < totalSettings; i++) {
    base[`setting_${i}`] = {
      value: Math.floor(r() * 1000),
      enabled: r() > 0.5,
      priority: Math.floor(r() * 10),
    };
  }

  // Generate branch A changes
  const branchA = JSON.parse(JSON.stringify(base));
  const keysA = new Set();
  const keys = Object.keys(base);
  for (let i = 0; i < changesA; i++) {
    const key = keys[Math.floor(r() * keys.length)];
    keysA.add(key);
    branchA[key] = { ...branchA[key], value: Math.floor(r() * 1000) };
  }

  // Generate branch B changes
  const branchB = JSON.parse(JSON.stringify(base));
  const keysB = new Set();
  for (let i = 0; i < changesB; i++) {
    const key = keys[Math.floor(r() * keys.length)];
    keysB.add(key);
    branchB[key] = { ...branchB[key], value: Math.floor(r() * 1000) };
  }

  // Count conflicts: both changed AND different values in A vs B
  let conflicts = 0;
  for (const key of keysA) {
    if (keysB.has(key)) {
      // Both changed this key vs base — check if A and B differ
      if (branchA[key].value !== branchB[key].value) {
        conflicts++;
      }
    }
  }

  const guide = [
    `### Three-Way Merge Conflict Detection`,
    ``,
    `**Conflict Rule**: A conflict occurs when:`,
    `- Branch A **and** Branch B both changed the same setting`,
    `- **AND** their \`value\` fields are different from each other`,
    ``,
    `### Algorithm`,
    ``,
    `\`\`\`python`,
    `import json, zipfile`,
    `with zipfile.ZipFile('config.zip') as z:`,
    `    base   = json.loads(z.read('base.json'))`,
    `    a      = json.loads(z.read('branch_a.json'))`,
    `    b      = json.loads(z.read('branch_b.json'))`,
    ``,
    `conflicts = 0`,
    `for key in base:`,
    `    a_changed = base[key]['value'] != a[key]['value']`,
    `    b_changed = base[key]['value'] != b[key]['value']`,
    `    if a_changed and b_changed and a[key]['value'] != b[key]['value']:`,
    `        conflicts += 1`,
    `print(conflicts)`,
    `\`\`\``,
    ``,
    `### Key Rules`,
    `- Only \`value\` field counts — ignore \`enabled\` and \`priority\``,
    `- Identical changes (both set same new value) → NO conflict`,
    `- Only one branch changed → NO conflict`,
    `- Both changed + different values → CONFLICT`,
    ``,
    `> **Note**: The actual files are in your exam's ZIP download. Run the script above on them.`,
    `> The solver provides an estimated answer based on seeded RNG, but your ZIP determines the real answer.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'Estimated from seeded RNG — verify with your downloaded ZIP',
    answer: String(conflicts),
    guide,
    answerDisplay: [
      `### Q6: Three-Way Merge Conflicts`,
      ``,
      `**Estimated conflicts:** \`${conflicts}\``,
      ``,
      `> ⚠️ This is an estimate. Download your ZIP and run the Python script from the Guide to get the exact answer.`,
      ``,
      `**Settings:** ${totalSettings} total, ~${changesA} changes in A, ~${changesB} changes in B`,
    ].join('\n'),
  };
}
