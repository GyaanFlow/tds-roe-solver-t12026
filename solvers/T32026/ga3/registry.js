import * as q01 from './q01-guess-number.js';
import * as q02 from './q02-a2a-invoice-agent.js';
import * as q03 from './q03-taint-aware-executor.js';
import * as q04 from './q04-agent-trace-integrity.js';
import * as q05 from './q05-humans-only.js';
import * as q06 from './q06-famous-face-3d.js';
import { wrapSolverModule } from './runtime.js';

// The checked-in official snapshot predates Q6; its prompt was supplied by the user. Q1/Q5/Q6 require user action.
export const solvers = [q01, q02, q03, q04, q05, q06].map(wrapSolverModule);

export const metadata = {
  exam: 'ga3',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-ga3.js',
  questionCount: 6,
};
