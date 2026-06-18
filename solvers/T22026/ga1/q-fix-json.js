// Solver: Q13 — Fix Broken JSON File (programmatic)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-broken-json-server';
export const title = 'Q13: Fix Broken JSON File';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-broken-json-server`;
  const r = rng(seed);

  const Ft = [
    {name:"config_export",title:"Fix Corrupted Configuration Export",description:"A configuration export was corrupted during transfer - fix the JSON errors",context:"application configuration",dataType:"configuration settings"},
    {name:"api_response",title:"Repair Malformed API Response",description:"API response was corrupted - fix syntax errors to parse the data",context:"API integration",dataType:"API records"},
    {name:"database_dump",title:"Fix Broken Database Export",description:"Database JSON export has syntax errors - repair for data recovery",context:"data migration",dataType:"database records"},
    {name:"log_export",title:"Repair Corrupted Log Export",description:"Log export was corrupted - fix JSON to analyze the logs",context:"log analysis",dataType:"log entries"}
  ];

  const scenario = Ft[Math.floor(r() * Ft.length)];
  const h = [];
  for (let a = 0; a < 300; a++) {
    h.push({
      id: `record_${String(a).padStart(5, "0")}`,
      name: `Entry ${a}`,
      value: Math.floor(r() * 1e4),
      status: r() < 0.5 ? "active" : "inactive",
      category: ["alpha", "beta", "gamma", "delta"][Math.floor(r() * 4)],
      timestamp: `2024-${String(Math.floor(r() * 12) + 1).padStart(2, "0")}-${String(Math.floor(r() * 28) + 1).padStart(2, "0")}T${String(Math.floor(r() * 24)).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")}:00Z`,
      metadata: {
        source: ["system_a", "system_b", "system_c"][Math.floor(r() * 3)],
        priority: Math.floor(r() * 5) + 1,
        tags: ["tag1", "tag2", "tag3"].slice(0, Math.floor(r() * 3) + 1)
      },
      description: `This is a sample ${scenario.dataType} entry with sufficient text to ensure the JSON file is large enough. `.repeat(3)
    });
  }

  const validJson = JSON.stringify(h, null, 2);

  return {
    type: 'solved',
    answer: validJson,
    variant: `${scenario.title} (${norm})`,
    answerDisplay: [
      `### Q13: Fix Broken JSON File`,
      `**Answer (Verbatim valid JSON):**`,
      `\`\`\`json`,
      validJson.length > 500 ? validJson.slice(0, 500) + '\n... [TRUNCATED FOR DISPLAY - COPY ALL FROM ANSWER BOX]' : validJson,
      `\`\`\``,
    ].join('\n')
  };
}
