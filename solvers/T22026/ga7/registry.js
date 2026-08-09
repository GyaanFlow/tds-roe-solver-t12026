// Solver Registry — GA7 (all 10 questions in official bundle order).
// Weights verified directly from the live exam-tds-2026-05-ga7.js assembly: 2 marks each for
// Q1-Q6 (the 5 hosted-API questions plus Street View), 1 mark each for Q7-Q10 (total 16).
import * as releaseGate from './q-release-gate.js';
import * as actionFirewall from './q-action-firewall.js';
import * as terraformPlanGuard from './q-terraform-plan-guard.js';
import * as outputSanitizer from './q-output-sanitizer.js';
import * as osintCorroboration from './q-osint-corroboration.js';
import * as streetviewGeolocation from './q-streetview-geolocation.js';
import * as googleDorksAdvanced from './q-google-dorks-advanced.js';
import * as cloudflareWafBypass from './q-cloudflare-waf-bypass.js';
import * as mediaForensics from './q-media-forensics.js';
import * as actionsWorkflowAudit from './q-actions-workflow-audit.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  releaseGate,             // Q1:  2 marks — Hosted API (75%) + workflow evidence guide (25%)
  actionFirewall,          // Q2:  2 marks — Hosted API, submit URL directly
  terraformPlanGuard,      // Q3:  2 marks — Hosted API, submit URL directly
  outputSanitizer,         // Q4:  2 marks — Hosted API, submit URL directly
  osintCorroboration,      // Q5:  2 marks — Hosted API, submit URL directly
  streetviewGeolocation,   // Q6:  2 marks — Guide only (no client-exposed check)
  googleDorksAdvanced,     // Q7:  1 mark  — Solved (seeded corpus + constructed query, self-verified)
  cloudflareWafBypass,     // Q8:  1 mark  — Solved (seeded rule engine, read off directly)
  mediaForensics,          // Q9:  1 mark  — Solved (seeded token/digits/scene-count, read off directly)
  actionsWorkflowAudit,    // Q10: 1 mark  — Solved (seeded workflow generator, read off directly)
].map(wrapSolverModule);
