import * as q01 from './q01-rag-colosseum.js';
import * as q02 from './q02-ollama-faiss.js';
import * as q03 from './q03-ball-tracker.js';
import * as q04 from './q04-harness-safety-router.js';
import { wrapSolverModule } from './runtime.js';

// Same order as the official bundle (exam-tds-2026-09-ga5.js). Q1 and Q4 are live endpoints on the hub (the answer is the
// URL, built from the student's own email, so no token is needed); Q2 is a local computation with a checked matrix; Q3
// needs the student's own video, so it is a viewer and a guide.
export const solvers = [q01, q02, q03, q04].map(wrapSolverModule);

export const metadata = {
  exam: 'ga5',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-ga5.js',
  questionCount: 4,
};
