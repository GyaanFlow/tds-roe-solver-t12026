import * as q01 from './q01-prediction-aipipe.js';
import * as q02 from './q02-human-exchange.js';
import * as q03 from './q03-air-ink.js';
import * as q04 from './q04-missing-invoice.js';
import { wrapSolverModule } from './runtime.js';

// Same order as the official bundle (exam-tds-2026-09-p1.js). Every question here needs the student's own action or
// documents, so each solver is a tool that takes that input (forecast, script builder, device check, invoice calculator)
// plus a beginner step-by-step guide, never a fabricated answer.
export const solvers = [
  q01, // Q1 - Predict AI Pipe usage (prediction market; result token only after settlement)
  q02, // Q2 - TDS Human Exchange (60-second recording)
  q03, // Q3 - Motion games: Air Ink (phone drawing; no AI agents)
  q04, // Q4 - Trading game: Reconcile the Missing Invoice
].map(wrapSolverModule);

export const metadata = {
  exam: 'p1',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-p1.js',
  questionCount: 4,
};
