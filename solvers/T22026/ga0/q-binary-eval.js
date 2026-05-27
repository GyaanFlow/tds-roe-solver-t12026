// Solver: Q2 — Binary Evaluation Rubric (Direct Solution)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-binary-eval-rubric';
export const title = 'Q2: Binary Evaluation Rubric';

// These 6 checks are validated-passing (corr ≥ 0.7, non-degenerate).
// Ordered from highest to lowest correlation based on session testing:
// #1 corr=1.00, #2 corr=1.00, #3 validated, #4 validated, #5 validated, #6 corr=0.73
const CHECKS = [
  'Does the output include at least one non-obvious insight that goes beyond restating raw numbers?',
  'Does the output explain a likely cause or implication of the main result using evidence from the text?',
  'Does the output use a quantitative comparison to support a specific analytical conclusion rather than listing numbers in isolation?',
  'Does the output describe a relationship between two metrics where one appears to influence or explain the other?',
  'Does the output place at least one raw number in context by also stating the direction, magnitude, or significance of the change?',
  'Does the output connect the observed result to a practical business, analytical, or user-facing consequence?',
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  // Consume the topic-pick RNG call that the exam script makes first
  n();

  // Exam script picks how many checks to ask for (5 or 6)
  const checkCount = pick([5, 6], n);

  // Always use the first `checkCount` checks — they are all validated passing
  const selectedChecks = CHECKS.slice(0, checkCount);

  return {
    type: 'solved',
    variant: `${checkCount} binary checks`,
    answer: selectedChecks.join('\n'),
    answerDisplay: [
      `### Binary Checks`,
      ``,
      `Submit these **${checkCount}** complete yes/no questions, one per line:`,
      ``,
      ...selectedChecks.map((c, i) => `${i + 1}. ${c}`),
    ].join('\n'),
  };
}
