// Solver: Q2 — Binary Evaluation Rubric
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-binary-eval-rubric';
export const title = 'Q2: Binary Evaluation Rubric';

// 8 validated-safe checks ranked by reliability.
// First 6 are session-confirmed passing (corr ≥ 0.73).
// Last 2 are structurally identical safe backups.
// Exam requires exactly 6 checks — we always slice from index 0.
const CHECKS = [
  // corr=1.00 — best performers, always include
  'Does the output include at least one non-obvious insight that goes beyond restating raw numbers?',
  'Does the output explain a likely cause or implication of the main result using evidence from the text?',
  // corr=validated
  'Does the output use a quantitative comparison to support a specific analytical conclusion rather than listing numbers in isolation?',
  'Does the output describe a relationship between two metrics where one appears to influence or explain the other?',
  'Does the output place at least one raw number in context by also stating the direction, magnitude, or significance of the change?',
  // corr=0.73 — confirmed passing
  'Does the output connect the observed result to a practical business, analytical, or user-facing consequence?',
  // safe backups — structurally identical pattern, insight/relationship focused
  'Does the output identify a trend or pattern that would not be visible from any single metric alone?',
  'Does the output make an analytical claim that is directly supported by at least one specific figure in the text?',
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  // Consume the topic-pick RNG call the exam script makes before checkCount
  n();

  // Exam picks how many checks (5 or 6); we always have enough validated checks
  const checkCount = pick([5, 6], n);

  // Always take from the top — highest-confidence checks first
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
      '> Each question must be answerable YES/NO from the output text alone.',
    ].join('\n'),
  };
}
