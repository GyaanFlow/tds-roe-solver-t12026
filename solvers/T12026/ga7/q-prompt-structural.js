// Solver: Presentation Prompt Structural Repair
import { fnvHash, normalizeEmail } from './utils.js';

const TOTAL = 20;

function buildScenarios() {
  const scenarios = [
    { context: "one-page executive briefing about quarterly sales performance for finance leadership", action: "reduce discounting in underperforming enterprise segments", metric: "net_revenue", audience: "for a non-technical CFO", format: "as a single HTML page with one chart and one summary table", tone: "in a McKinsey one-pager style, crisp and assertive, no hedging", length: "in under 120 words of narrative", actionConstraint: "ending with a single imperative action the CFO should take this quarter", detectionKeywords: { A: "non-technical cfo", B: "single html page", C: "net_revenue", D: "mckinsey one-pager", E: "under 120 words", F: "single imperative action" } },
    { context: "board-ready summary on customer churn by subscription tier", action: "prioritize retention outreach for basic plan users", metric: "churn_rate", audience: "for executive directors without statistical training", format: "as a compact memo with exactly three bullet sections", tone: "in a strategy consulting brief tone: direct and evidence-led", length: "within 140 words", actionConstraint: "ending with one quarter-specific imperative recommendation", detectionKeywords: { A: "without statistical training", B: "three bullet sections", C: "churn_rate", D: "strategy consulting brief", E: "within 140 words", F: "quarter-specific imperative" } },
    { context: "presentation-ready note on regional demand forecast variance", action: "reallocate ad spend to resilient regions", metric: "forecast_error_pct", audience: "for regional operations heads with limited analytics background", format: "as a one-slide script with title, evidence, and decision line", tone: "in an NYT graphics team brief style", length: "in 110 to 160 words", actionConstraint: "ending with exactly one action recommendation", detectionKeywords: { A: "limited analytics background", B: "one-slide script", C: "forecast_error_pct", D: "nyt graphics team", E: "110 to 160 words", F: "exactly one action recommendation" } },
    { context: "monthly risk update for loan portfolio quality", action: "tighten underwriting for near-prime renewals", metric: "default_probability", audience: "for a risk committee with mixed technical depth", format: "as a single markdown briefing with one table and one chart callout", tone: "in a board update style, concise and decisive", length: "in no more than 130 words", actionConstraint: "ending with one imperative risk action", detectionKeywords: { A: "risk committee", B: "single markdown briefing", C: "default_probability", D: "board update style", E: "no more than 130 words", F: "imperative risk action" } },
    { context: "quarterly placement outcomes summary for academic leadership", action: "expand employer outreach for low-conversion cohorts", metric: "placement_rate", audience: "for deans with non-technical backgrounds", format: "as a one-page narrative brief with one visual callout", tone: "in a data journalism explainer style", length: "in 100 to 150 words", actionConstraint: "ending with a single imperative step for next quarter", detectionKeywords: { A: "non-technical backgrounds", B: "one-page narrative brief", C: "placement_rate", D: "data journalism explainer", E: "100 to 150 words", F: "single imperative step" } },
  ];
  const result = [];
  for (let i = 0; i < TOTAL; i++) {
    result.push({ ...scenarios[i % scenarios.length], id: i });
  }
  return result;
}

// Replicate _o() from source — deterministic shuffle to pick 3 missing components
function getMissing(email) {
  const letters = ["A", "B", "C", "D", "E", "F"];
  const seed = fnvHash(`missing:${email}`);
  // Deterministic shuffle using LCG matching the source
  const arr = [...letters];
  let s = seed || 1;
  const rand = () => { s = (1664525 * s + 1013904223) >>> 0; return s / 4294967296; };
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 3).sort();
}

function getComponentLines(scenario) {
  return {
    A: `Audience: ${scenario.audience}.`,
    B: `Output format: ${scenario.format}.`,
    C: `Use the '${scenario.metric}' field as the primary metric for claims.`,
    D: `Tone/style: ${scenario.tone}.`,
    E: `Length constraint: ${scenario.length}.`,
    F: `Structure requirement: ${scenario.actionConstraint}.`,
  };
}

export const id = 'q-presentation-prompt-structural-repair';
export const title = 'Presentation Prompt Structural Repair';

export function solve(email) {
  const norm = normalizeEmail(email);
  const scenarios = buildScenarios();
  const s = scenarios[fnvHash(norm) % TOTAL];
  const missing = getMissing(norm);
  const lines = getComponentLines(s);

  // Build the kept lines (those NOT missing)
  const kept = ["A","B","C","D","E","F"].filter(c => !missing.includes(c));
  const brokenPrompt = [
    `Create a presentation artifact for the following task: ${s.context}.`,
    ...kept.map(c => lines[c])
  ].join('\n');

  // Add the missing lines
  const addedLines = missing.map(c => lines[c]).join('\n');
  const fullPrompt = brokenPrompt + '\n' + addedLines;

  return {
    variant: `Scenario #${s.id + 1} | Missing: ${missing.join(',')} | Context: ${s.context.slice(0, 60)}...`,
    answer: `Missing components: ${missing.join(',')}\nCompleted prompt:\n${fullPrompt}`
  };
}
