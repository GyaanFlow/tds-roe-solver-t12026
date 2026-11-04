import * as q01 from './q01-face-peer-review.js';
import { wrapSolverModule } from './runtime.js';

// Same order as the official bundle (exam-tds-2026-09-ga4.js). The single question needs real peer reviews recorded by the
// face-review server, which signs the participation receipt itself; the solver is a guide with a planner and receipt checker.
export const solvers = [q01].map(wrapSolverModule);

export const metadata = {
  exam: 'ga4',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-ga4.js',
  questionCount: 1,
};
