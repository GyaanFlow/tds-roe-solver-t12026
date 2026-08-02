// Solver Registry — T2 2026 ROE (Re-Exam), all 9 questions in official bundle order.
// Weights from the bundle's own assembly call: 5 marks each for Q1–Q5, 0.2 each for Q6–Q9
// (total 25.8). Verified against exam-tds-2026-05-roe.js.
import * as incidentAtlas from './q-incident-atlas.js';
import * as unicodeLedger from './q-unicode-ledger.js';
import * as httpCache from './q-http-cache.js';
import * as streetviewOsint from './q-streetview-osint.js';
import * as handshake from './q-handshake.js';
import * as donateMarks from './q-donate-marks.js';
import * as donateAudio from './q-donate-audio.js';
import * as initiativeAudio from './q-initiative-audio.js';
import * as unusualEssay from './q-unusual-essay.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  incidentAtlas,    // Q1: 5   marks — Ultra-Advanced Interactive Direct Solver ✅
  unicodeLedger,    // Q2: 5   marks — Ultra-Advanced Interactive Direct Solver ✅
  httpCache,        // Q3: 5   marks — Ultra-Advanced Interactive Direct Solver ✅
  streetviewOsint,  // Q4: 5   marks — Ultra-Advanced Interactive Hash Verifier & Solver ✅
  handshake,        // Q5: 5   marks — Interactive HMAC Toolkit ✅
  donateMarks,      // Q6: 0.2 marks — SOLVED ✅
  donateAudio,      // Q7: 0.2 marks — Interactive Audio Pre-flight Checker ✅
  initiativeAudio,  // Q8: 0.2 marks — Interactive Audio Pre-flight Checker ✅
  unusualEssay,     // Q9: 0.2 marks — Interactive Word Counter & Strategy ✅
].map(wrapSolverModule);
