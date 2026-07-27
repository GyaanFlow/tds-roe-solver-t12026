// Solver Registry — GA6 (all 10 questions)
import * as imageGridForensics from './q-image-grid-forensics.js';
import * as promptRobustnessAudit from './q-prompt-robustness-audit.js';
import * as duckdbRegressionGuide from './q-duckdb-regression-guide.js';
import * as shadowIncidentAudit from './q-shadow-incident-audit.js';
import * as duckdbLedgerReconciliation from './q-duckdb-ledger-reconciliation.js';
import * as politenessAudit from './q-politeness-audit.js';
import * as scrapeBooksGuide from './q-scrape-books-guide.js';
import * as githubActionPlaywright from './q-github-action-playwright.js';
import * as playwrightTableSum from './q-playwright-table-sum.js';
import * as modemDecodeGuide from './q-modem-decode-guide.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  imageGridForensics,           // Q1: Image forensics — guide (live per-student BMP)
  promptRobustnessAudit,        // Q2: Multi-Model Robustness Audit — solved (exhaustive search)
  duckdbRegressionGuide,        // Q3: DuckDB regression — guide (values shown on live page)
  shadowIncidentAudit,          // Q4: Shadow-DOM incident audit — solved (seeded reconciliation)
  duckdbLedgerReconciliation,   // Q5: DuckDB ledger reconciliation — solved (seeded reconciliation)
  politenessAudit,              // Q6: Politeness/robots.txt audit — solved (seeded hash)
  scrapeBooksGuide,             // Q7: Scrape Books to Scrape — guide (real external site)
  githubActionPlaywright,       // Q8: GitHub Action + Playwright — guide (real repo/Action)
  playwrightTableSum,           // Q9: Playwright table sum — solved (seeded generator)
  modemDecodeGuide              // Q10: Modem signal decode — guide (live per-student audio)
].map(wrapSolverModule);
