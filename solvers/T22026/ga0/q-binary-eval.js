// Solver: Q2 — Binary Evaluation Rubric (Direct Solution)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-binary-eval-rubric';
export const title = 'Q2: Binary Evaluation Rubric';

const CHECKS = [
  'Does the output include at least one non-obvious insight that goes beyond restating raw numbers?',
  'Does the output explain a likely cause or implication of the main result using evidence from the text?',
  'Does the output compare at least two concrete quantities, trends, or entities instead of listing facts only?',
  'Does the output avoid unsupported recommendations, fabricated facts, and vague praise?',
  'Does the output mention a specific metric, percentage, count, or named entity from the source material?',
  'Does the output connect the observed result to a practical business, analytical, or user-facing consequence?',
  'Does the output clearly distinguish signal from noise instead of treating every detail as equally important?'
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  const checkCount = pick([5, 6, 7], n);
  const selectedChecks = CHECKS.slice(0, checkCount);

  return {
    type: 'solved',
    variant: `${checkCount} binary checks`,
    answer: selectedChecks.join('\n'),
    answerDisplay: `### Binary Checks\n\nSubmit these **${checkCount}** complete yes/no questions, one per line:\n\n${selectedChecks.map((c, i) => `${i + 1}. ${c}`).join('\n')}`,
  };
}
