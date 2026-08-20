// Solver Registry — T2 2026 Project 2 (All 8 Case Studies)
import * as case1a from './q-case-1a.js';
import * as case1b from './q-case-1b.js';
import * as case2a from './q-case-2a.js';
import * as case2b from './q-case-2b.js';
import * as case3a from './q-case-3a.js';
import * as case3b from './q-case-3b.js';
import * as case4a from './q-case-4a.js';
import * as case4b from './q-case-4b.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  case1a, // Q1: Case Study 1A — DTH Month-End Mystery
  case1b, // Q2: Case Study 1B — DTH Complaints Went Quiet
  case2a, // Q3: Case Study 2A — Solar Inverter Smell Test
  case2b, // Q4: Case Study 2B — Solar 31.6% Impact Claim
  case3a, // Q5: Case Study 3A — Swiss Mismatch Control
  case3b, // Q6: Case Study 3B — Is the Irish Preference Claim Supported?
  case4a, // Q7: Case Study 4A — QC Queue Smell Test
  case4b  // Q8: Case Study 4B — Spare-Parts Search
].map(wrapSolverModule);
