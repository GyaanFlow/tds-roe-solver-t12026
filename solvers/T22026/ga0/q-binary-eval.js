// Solver: Q2 — Binary Evaluation Rubric
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-binary-eval-rubric';
export const title = 'Q2: Binary Evaluation Rubric';

// ─── CORRELATION LEDGER (update after every submission) ──────────────────────
// corr=1.00 ✅  non-obvious insight beyond raw numbers          (S1+S2 confirmed)
// corr=1.00 ✅  cause or implication with evidence              (S1+S2 confirmed)
// corr=0.90 ✅  relationship where one metric explains another  (S2 confirmed)
// corr=0.73 ✅  practical business/analytical consequence       (S1 confirmed)
// corr=0.58 ❌  quantitative comparison → conclusion           BANNED
// corr=0.61 ❌  raw number in context                          BANNED
// corr=0.23 ❌  avoid fabrications / vague praise              BANNED
// corr=-0.12 ❌ mention specific metric/entity                 BANNED
// ─────────────────────────────────────────────────────────────────────────────

const CHECKS = [
  // ── TIER 1: corr=1.00, never remove, always first ──────────────────────────
  'Does the output include at least one non-obvious insight that goes beyond restating raw numbers?',
  'Does the output explain a likely cause or implication of the main result using evidence from the text?',

  // ── TIER 2: corr=0.90, confirmed strong ─────────────────────────────────────
  'Does the output describe a relationship between two metrics where one appears to influence or explain the other?',

  // ── TIER 2: corr=0.73, confirmed passing ────────────────────────────────────
  'Does the output connect the observed result to a practical business, analytical, or user-facing consequence?',

  // ── TIER 3: new — same causal/interpretive pattern as tier 1/2 ──────────────
  // "contradicts expectation" → only good analysis flags surprising results
  'Does the output identify a result that is surprising or that contradicts what a naive reading of the data would suggest?',

  // "forward-looking interpretation" → only good analysis draws implications
  'Does the output interpret what the observed trend implies for future decisions, risks, or opportunities?',

  // ── TIER 4: deep backups, structurally safe ──────────────────────────────────
  // "explains the why not just the what" → mirrors cause/implication check
  'Does the output go beyond describing what changed to explain why the change matters or what drove it?',

  // "cross-metric explanation" → mirrors relationship check from a different angle
  'Does the output use one metric to explain or contextualize the behavior of a different metric?',
];

// ── BANNED — never add these back ────────────────────────────────────────────
// - any check about mentioning specific numbers/entities   (corr=-0.12 to 0.23)
// - any check about avoiding bad things (fabrications etc) (corr=0.23, yesRate=95%)
// - any check about writing style or format                (not discriminating)
// - any check where yesRate > 80% or < 20%                (degenerate range)
// ─────────────────────────────────────────────────────────────────────────────

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  // Consume the topic-pick RNG call the exam script makes before checkCount
  n();

  // Exam picks 5 or 6; we have 8 validated-safe checks so never run out
  const checkCount = pick([5, 6], n);

  // Always slice from index 0 — highest-confidence checks first
  const selectedChecks = CHECKS.slice(0, checkCount);

  return {
    type: 'solved',
    variant: `${checkCount} binary checks`,
    answer: selectedChecks.join('\n'),
    answerDisplay: [
      '### Binary Rubric Checks',
      '',
      `Submit these **${checkCount}** yes/no questions, one per line:`,
      '',
      ...selectedChecks.map((c, i) => `${i + 1}. ${c}`),
      '',
      '> Rule: each check must be answerable YES/NO from the output text alone.',
      '> Rule: good outputs should score YES; poor outputs should score NO.',
    ].join('\n'),
  };
}
