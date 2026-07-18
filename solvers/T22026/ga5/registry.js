// Solver Registry — GA5 (all 11 solvers)
import * as mazeSolve from './q-maze-solve.js';
import * as prorationApi from './q-proration-api.js';
import * as guardrailApi from './q-guardrail-api.js';
import * as skillScanApi from './q-skill-scan-api.js';
import * as budgetGuardApi from './q-budget-guard-api.js';
import * as mcpServerApi from './q-mcp-server-api.js';
import * as lxdSandboxGuide from './q-lxd-sandbox-guide.js';
import * as guardrailRedteamApi from './q-guardrail-redteam-api.js';
import * as mailroomApi from './q-mailroom-api.js';
import * as a2aInvoiceApi from './q-a2a-invoice-api.js';
import * as incidentAgentApi from './q-incident-agent-api.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  mazeSolve,             // Q1
  prorationApi,          // Q2
  guardrailApi,          // Q3
  skillScanApi,          // Q4
  budgetGuardApi,        // Q5
  mcpServerApi,           // Q6
  lxdSandboxGuide,        // Q7
  guardrailRedteamApi,    // Q8
  mailroomApi,             // Q9
  a2aInvoiceApi,           // Q10
  incidentAgentApi         // Q11
].map(wrapSolverModule);
