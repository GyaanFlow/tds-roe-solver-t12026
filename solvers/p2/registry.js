// Solver Registry — P2 Part B
import * as qrForensics from './q-qr-forensics.js';
import * as discourseKb from './q-discourse-kb.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  qrForensics,   // Q3: QR Forensics — Solana Devnet Tracer, guide-type interactive solver
  discourseKb,   // Q4: Discourse KB Analysis — 50 tasks, guide-type interactive solver
].map(wrapSolverModule);
