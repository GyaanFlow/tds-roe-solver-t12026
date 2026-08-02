// Solver Registry — T2 2026 ROE (Re-Exam), all 12 questions in official bundle order.
// Weights from the bundle's own assembly call (verified by tracing the real
// exam-tds-2026-05-roe.js): 5, .2, .2, 5, 5, 5, 2, 2, .2, .2, 2, 1 (total 27.8).
// The Secret Handshake question (q-handshake-server) was removed from the exam bundle
// and is no longer part of this registry.
import * as streetviewOsint from './q-streetview-osint.js';
import * as donateMarks from './q-donate-marks.js';
import * as donateAudio from './q-donate-audio.js';
import * as incidentAtlas from './q-incident-atlas.js';
import * as unicodeLedger from './q-unicode-ledger.js';
import * as httpCache from './q-http-cache.js';
import * as aiContentDetection from './q-ai-content-detection.js';
import * as aiOpportunityDiscovery from './q-ai-opportunity-discovery.js';
import * as unusualEssay from './q-unusual-essay.js';
import * as initiativeAudio from './q-initiative-audio.js';
import * as externalDatasetInsight from './q-external-dataset-insight.js';
import * as aiTutorChallenge from './q-ai-tutor-challenge-server.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  streetviewOsint,          // 5   marks — Interactive Hash Verifier & Normalizer ✅
  donateMarks,              // 0.2 marks — SOLVED ✅
  donateAudio,              // 0.2 marks — Interactive Audio Pre-flight Checker ✅
  incidentAtlas,            // 5   marks — Interactive Direct Solver ✅
  unicodeLedger,            // 5   marks — Interactive Direct Solver ✅
  httpCache,                // 5   marks — Interactive Direct Solver ✅
  aiContentDetection,       // 2   marks — Format Validator + Prompt Template ✅
  aiOpportunityDiscovery,   // 2   marks — Case Assignment + Format Validator ✅
  unusualEssay,             // 0.2 marks — Interactive Word Counter & Strategy ✅
  initiativeAudio,          // 0.2 marks — Interactive Audio Pre-flight Checker ✅
  externalDatasetInsight,   // 2   marks — Format Validator + Template ✅
  aiTutorChallenge,         // 1   mark  — Strategy Guide (no client-computable path) ✅
].map(wrapSolverModule);
