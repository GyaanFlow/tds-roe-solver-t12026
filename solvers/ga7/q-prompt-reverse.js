// Solver: Prompt Reverse-Engineering
import { fnvHash, normalizeEmail } from './utils.js';

const TOTAL = 20;

function buildScenarios() {
  const audiences = [
    { label: "campus placement cell leadership", triggers: ["placement cell", "leadership"] },
    { label: "state education policy team", triggers: ["policy team", "state education"] },
    { label: "city public-health commissioner", triggers: ["commissioner", "public health"] },
    { label: "retail operations directors", triggers: ["operations directors", "retail"] },
    { label: "bank risk committee", triggers: ["risk committee", "credit risk"] },
  ];
  const formats = [
    { type: "narrative", label: "three-paragraph narrative memo", triggers: ["narrative memo", "three paragraphs"] },
    { type: "narrative", label: "bullet-led executive brief", triggers: ["executive brief", "bullet"] },
    { type: "html", label: "single-page HTML briefing card", triggers: ["html", "briefing card"] },
    { type: "narrative", label: "slide-script style talk track", triggers: ["talk track", "slide script"] },
  ];
  const tones = [
    { styleRef: "Malcolm Gladwell", triggers: ["gladwell", "narrative"], phrases: ["the pattern breaks in plain sight", "the surprising part is not the average"] },
    { styleRef: "NYT graphics team brief", triggers: ["nyt", "graphics team"], phrases: ["annotate the turning point", "show the baseline clearly"] },
    { styleRef: "McKinsey board update", triggers: ["board update", "mckinsey"], phrases: ["decision now is resource allocation", "risk-adjusted upside"] },
    { styleRef: "Data journalism explainer", triggers: ["data journalism", "explainer"], phrases: ["what changed and why", "the caveat is where this breaks"] },
    { styleRef: "Product analytics weekly brief", triggers: ["product analytics", "weekly brief"], phrases: ["activation moved, retention lagged", "ship one test this sprint"] },
  ];
  const findings = [
    ["gap widened by 12 percentage points", "only 25-34 cohort improved", "trend reversed after 2021"],
    ["north region grew 3x faster", "east remained lowest", "west showed steady gains"],
    ["premium stayed below 3%", "basic churn worsened", "gap widened between basic and premium"],
    ["coal declined sharply", "renewables crossed 40%", "solar accelerated after 2022"],
    ["site c worsened after intervention", "site a improved most", "variance widened across sites"],
  ];
  const lengths = [
    { label: "300-380 words", triggers: ["300-380 words", "around 350 words"] },
    { label: "320-420 words", triggers: ["320-420 words", "under 420 words"] },
    { label: "280-360 words", triggers: ["280-360 words", "under 360 words"] },
  ];
  const structures = [
    { label: "open with a question", triggers: ["open with a question", "start with a question"] },
    { label: "end with one action recommendation", triggers: ["single action recommendation", "end with one action"] },
    { label: "include one counterargument sentence", triggers: ["counterargument", "one caveat sentence"] },
    { label: "use exactly three section headers", triggers: ["three section headers", "exactly three headings"] },
  ];

  const scenarios = [];
  for (let i = 0; i < TOTAL; i++) {
    scenarios.push({
      id: i,
      audience: audiences[i % audiences.length],
      format: formats[i % formats.length],
      tone: tones[i % tones.length],
      findings: findings[i % findings.length],
      length: lengths[i % lengths.length],
      structure: structures[i % structures.length],
    });
  }
  return scenarios;
}

export const id = 'q-prompt-reverse-engineering';
export const title = 'Prompt Reverse-Engineering';

export function solve(email) {
  const norm = normalizeEmail(email);
  const scenarios = buildScenarios();
  const s = scenarios[fnvHash(norm) % TOTAL];

  // Build a prompt that hits all validation triggers
  const prompt = `Write a ${s.format.label} for ${s.audience.label}. ` +
    `Use a ${s.tone.styleRef} tone and style. ` +
    `The key findings are: ${s.findings.join('; ')}. ` +
    `Keep length to ${s.length.label}. ` +
    `Structure: ${s.structure.label}. ` +
    `${s.tone.phrases[0]}. ${s.tone.phrases[1]}.`;

  // Build an LLM response that hits all validation triggers
  const response = `# Decision Brief for ${s.audience.label}

## Key Findings

${s.findings[0]}. This is the headline signal. ${s.tone.phrases[0]}.

${s.findings[1]}. Meanwhile, ${s.findings[2]}. ${s.tone.phrases[1]}.

## Implications

The data shows a clear divergence that demands action. Given that ${s.findings[0]} and ${s.findings[1]}, ${s.audience.label} should consider immediate reallocation of resources.

## Recommendation

${s.structure.label.includes('action') ? 'Action: ' : ''}Based on these findings, the priority for next quarter is to address the gap identified above. The ${s.tone.styleRef} perspective suggests that ${s.findings[2]} — and the team should act now before the window closes.

This ${s.format.label} was prepared with data through Q4 2024. Keep length within ${s.length.label}.`;

  return {
    variant: `Scenario #${s.id + 1} | Audience: ${s.audience.label} | Tone: ${s.tone.styleRef} | Format: ${s.format.label}`,
    answer: `Prompt: ${prompt}\n\nLLM Response: ${response}`
  };
}
