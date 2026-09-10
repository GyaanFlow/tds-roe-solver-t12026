import { bank } from '../../../mock-banks/T2-2026-End-Term-Mock.browser.js';

function makeSolver(item, kind) {
  const isObjective = kind === 'mcq';
  return {
    id: `endterm-${item.id.toLowerCase()}`,
    title: `${item.id} | ${item.topic}`,
    solve(email) {
      return {
        answer: '',
        type: 'quiz',
        variant: `${item.week} | ${isObjective ? item.skill : item.difficulty}`,
        quizItem: { ...item, kind },
        debug: {
          solverId: `endterm-${item.id.toLowerCase()}`,
          normalizedEmail: String(email || '').trim().toLowerCase(),
          durationText: 'local',
          warnings: []
        }
      };
    }
  };
}

export const solvers = [
  ...bank.mcq.map((item) => makeSolver(item, 'mcq')),
  ...bank.subjective.map((item) => makeSolver(item, 'subjective'))
];

export const metadata = {
  ...bank.metadata,
  totalQuestions: solvers.length,
  objectiveQuestions: bank.mcq.length,
  subjectiveQuestions: bank.subjective.length
};
