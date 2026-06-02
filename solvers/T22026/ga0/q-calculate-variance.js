// Solver: Q4 — Sample Variance (AUTO-SOLVED)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-calculate-variance';
export const title = 'Q4: Quality Control (Sample Variance)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  
  const baseValue = n() * 50 + 25;
  const measurements = Array.from({ length: 1000 }, () => {
    const drift = baseValue + (n() * 40 - 20);
    return Math.floor(Math.max(0, drift));
  });

  const count = measurements.length;
  const mean = measurements.reduce((a, b) => a + b, 0) / count;
  const sqDiffs = measurements.map(v => Math.pow(v - mean, 2));
  const variance = sqDiffs.reduce((a, b) => a + b, 0) / (count - 1);
  const result = variance.toFixed(2);

  return {
    type: 'solved',
    variant: `Sample size N=1000, Bessel-corrected (N-1)`,
    answer: result,
    answerDisplay: `### Calculation Results\n\n- **Sample Variance (s²):** \`${result}\`\n- **Mean (x̄):** \`${mean.toFixed(4)}\`\n- **Sample Size (N):** \`${count}\`\n- **Divisor:** \`N-1 = ${count - 1}\` (Bessel's correction)\n\nPaste the variance value into the exam portal.`,
  };
}
