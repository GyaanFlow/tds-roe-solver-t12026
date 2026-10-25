import * as q01 from './q01-guess-number.js';
import * as q02 from './q02-a2a-invoice-agent.js';
import * as q03 from './q03-taint-aware-executor.js';
import * as q04 from './q04-agent-trace-integrity.js';
import * as q05 from './q05-humans-only.js';
import * as q06 from './q06-famous-face-3d.js';
import * as q07 from './q07-face-morph-video.js';
import * as q08 from './q08-face-morph-rank.js';
import { wrapSolverModule } from './runtime.js';

// Same order as the official bundle (exam-tds-2026-09-ga3.js). Q2-Q4 give the student's personal API URL (needs their
// aipipe.org token in the sidebar); the rest need the student's own play or private photos, so they are guides with helpers.
export const solvers = [q01, q02, q03, q04, q05, q06, q07, q08].map(wrapSolverModule);

export const metadata = {
  exam: 'ga3',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-ga3.js',
  questionCount: 8,
};
