import * as q01 from './q01-prediction-aipipe.js';
import * as q02 from './q02-human-exchange.js';
import * as q03 from './q03-air-ink.js';
import * as q04 from './q04-missing-invoice.js';
import * as q05 from './q05-face-expressions.js';
import * as q06 from './q06-human-exchange-r1.js';
import * as q07 from './q07-picture-stories.js';
import { wrapSolverModule } from './runtime.js';

// Same order as the official bundle (exam-tds-2026-09-p1.js). Every question here needs the student's own action, camera,
// recording or game play, so each solver is a tool that takes that input (forecast, script builder, device check,
// invoice calculator, expression checklist, listing/marks planner, story and picture tools, receipt checker) plus a
// beginner step-by-step guide, never a fabricated answer.
export const solvers = [q01, q02, q03, q04, q05, q06, q07].map(wrapSolverModule);

export const metadata = {
  exam: 'p1',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-p1.js',
  questionCount: 7,
};
