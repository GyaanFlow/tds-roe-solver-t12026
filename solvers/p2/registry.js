// Solver Registry — P2 Part B (Discourse KB Solver)
import * as discourseKb from './q-discourse-kb.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  discourseKb,   // Q4: Discourse KB Analysis — 50 tasks, guide-type interactive solver
].map(wrapSolverModule);
