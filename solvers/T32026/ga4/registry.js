import * as q01 from './q01-face-peer-review.js';
import * as q02 from './q02-food-court.js';
import * as q03 from './q03-time-use-charts.js';
import * as q04 from './q04-roe-ideas.js';
import { wrapSolverModule } from './runtime.js';

// Same order as the official bundle (exam-tds-2026-09-ga4.js). Q1 needs real peer reviews recorded by the face-review
// server; Q2 and Q3 are live games whose servers sign the record; Q4 is an optional idea (bonus or -1). Each solver is
// a beginner guide with a small tool (planner / record checker / idea builder), never a fabricated result.
export const solvers = [q01, q02, q03, q04].map(wrapSolverModule);

export const metadata = {
  exam: 'ga4',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-ga4.js',
  questionCount: 4,
};
