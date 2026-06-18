// Solver Registry — GA1 May 2026 (all 20 solvers)
import * as vscodeVersion from './q-vscode-version.js';
import * as vscodeMulcursor from './q-vscode-multicursor.js';
import * as npxPrettier from './q-prettier-sha256.js';
import * as llmBashPipeline from './q-llm-bash-pipeline.js';
import * as fileReorganizer from './q-file-reorganizer.js';
import * as asciinemaSession from './q-asciinema-session.js';
import * as threeWayMerge from './q-three-way-merge.js';
import * as gitHistory from './q-git-history.js';
import * as githubPages from './q-github-pages.js';
import * as githubAction from './q-github-action-ga1.js';
import * as httpbinPost from './q-httpbin-post.js';
import * as useDevtools from './q-use-devtools-ga1.js';
import * as fixJson from './q-fix-json.js';
import * as monthlySales from './q-monthly-sales.js';
import * as unicodeMarkdown from './q-unicode-markdown.js';
import * as sqlSchema from './q-sql-schema.js';
import * as sqlAvgOrderValue from './q-sql-avg-order-value.js';
import * as markdownArchitecture from './q-markdown-architecture.js';
import * as promptEngineering from './q-prompt-engineering.js';
import * as debugAiCode from './q-debug-ai-code.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  vscodeVersion,       // Q1  — VS Code Version (code -s raw output)
  vscodeMulcursor,     // Q2  — Multi-cursor → JSON (jsonhash)
  npxPrettier,         // Q3  — npx prettier SHA256 of README.md
  llmBashPipeline,     // Q4  — LLM bash pipeline (llm CLI tool)
  fileReorganizer,     // Q5  — Reorganize files by category tag
  asciinemaSession,    // Q6  — Record terminal session with asciinema
  threeWayMerge,       // Q7  — Three-way merge conflict count
  gitHistory,          // Q8  — Git history parent commit hash
  githubPages,         // Q9  — GitHub Pages with email in HTML
  githubAction,        // Q10 — GitHub Action with email in step name
  httpbinPost,         // Q11 — POST with uv (httpbin health check)
  useDevtools,         // Q12 — Use DevTools (hidden input value)
  fixJson,             // Q13 — Fix broken JSON file
  monthlySales,        // Q14 — Extract JSON from ZIP (monthly sales)
  unicodeMarkdown,     // Q15 — Unicode formatting → Markdown converter
  sqlSchema,           // Q16 — Infer SQL schema from CSV files
  sqlAvgOrderValue,    // Q17 — SQL average order value (shipped)
  markdownArchitecture, // Q18 — Markdown deployment architecture doc
  promptEngineering,   // Q19 — Debug and improve a failing prompt
  debugAiCode,         // Q20 — Verify and fix AI-generated code
].map(wrapSolverModule);
