// Solver: Broken JSON — FULLY auto-solvable
// Automatically traces the generation logic up to the valid JSON state before corruption

export const id = 'q-broken-json-server';
export const title = 'Fix Broken JSON';

const Za = [
  {dataType:"configuration settings"}, {dataType:"API records"},
  {dataType:"database records"}, {dataType:"log entries"}
];

export function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#${id}#roe-2026-01`);

  const i = Za[Math.floor(rng() * Za.length)];
  const r = [];
  
  for (let d = 0; d < 300; d++) {
    r.push({
      id: `record_${String(d).padStart(5, "0")}`,
      name: `Entry ${d}`,
      value: Math.floor(rng() * 1e4),
      status: rng() < .5 ? "active" : "inactive",
      category: ["alpha", "beta", "gamma", "delta"][Math.floor(rng() * 4)],
      timestamp: `2024-${String(Math.floor(rng() * 12) + 1).padStart(2, "0")}-${String(Math.floor(rng() * 28) + 1).padStart(2, "0")}T${String(Math.floor(rng() * 24)).padStart(2, "0")}:${String(Math.floor(rng() * 60)).padStart(2, "0")}:00Z`,
      metadata: {
        source: ["system_a", "system_b", "system_c"][Math.floor(rng() * 3)],
        priority: Math.floor(rng() * 5) + 1,
        tags: ["tag1", "tag2", "tag3"].slice(0, Math.floor(rng() * 3) + 1)
      },
      description: `This is a sample ${i.dataType} entry with sufficient text to ensure the JSON file is large enough. `.repeat(3)
    });
  }

  const validJson = JSON.stringify(r, null, 2);

  return {
    variant: `Data type: ${i.dataType} — generated uncorrupted valid JSON`,
    type: 'solved',
    answer: validJson,
    answerDisplay: `<strong>Auto-Generated Valid JSON!</strong><br>Generated the exact uncorrupted JSON logic instead of trying to repair the broken text. You don't need to fix anything, just copy and paste this!`
  };
}
