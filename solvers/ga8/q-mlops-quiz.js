// Solver: MLOps Concepts Quiz (AUTO-SOLVED)
import { normalizeEmail } from './utils.js';

export const id = 'q-mlops-concepts-quiz';
export const title = 'MLOps Concepts: Hash-Verified Quiz';

const ALL_QUESTIONS = [
  { q: 'What does CI stand for in CI/CD?', answer: 'b' },
  { q: 'Which tool is used for container orchestration?', answer: 'c' },
  { q: 'What is the primary purpose of MLflow?', answer: 'b' },
  { q: 'Which protocol does Prometheus use to scrape metrics?', answer: 'c' },
  { q: 'What is a "multi-stage build" in Docker primarily used for?', answer: 'b' },
  { q: 'Which file defines GitHub Actions workflows?', answer: 'a' },
  { q: 'What does "IaC" stand for?', answer: 'b' },
  { q: 'Which observability pillar tracks request rates, errors, and durations?', answer: 'c' },
  { q: 'What is the purpose of a pre-commit hook?', answer: 'b' },
  { q: 'Which GCP service is used for serverless container deployment?', answer: 'b' },
];

export function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(`${norm}#${id}`);

  // Replicate exam's shuffle: Fisher-Yates on indices
  const indices = ALL_QUESTIONS.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  // Pick first 3
  const selected = indices.slice(0, 3).map(idx => ALL_QUESTIONS[idx]);
  const answers = selected.map(q => q.answer);

  return {
    type: 'solved',
    variant: selected.map((q, i) => `Q${i + 1}: "${q.q}" → ${q.answer}`).join(' | '),
    answer: answers.join(','),
    answerDisplay: selected.map((q, i) =>
      `Q${i + 1}: ${q.q}\n   Answer: ${q.answer.toUpperCase()}`
    ).join('\n\n')
  };
}
