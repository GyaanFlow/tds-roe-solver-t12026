// Solver Registry — GA1 May 2026 (all 18 solvers)
import * as vscodeJson from './q-vscode-json.js';
import * as prettierSha256 from './q-prettier-sha256.js';
import * as llmBashPipeline from './q-llm-bash-pipeline.js';
import * as fileReorganizer from './q-file-reorganizer.js';
import * as asciinemaSession from './q-asciinema-session.js';
import * as threeWayMerge from './q-three-way-merge.js';
import * as gitHistory from './q-git-history.js';
import * as githubPages from './q-github-pages.js';
import * as githubAction from './q-github-action-ga1.js';
import * as httpbinPost from './q-httpbin-post.js';
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
  vscodeJson,          // Q1  — VS Code output → JSON
  prettierSha256,      // Q2  — Prettier SHA256 of README.md
  llmBashPipeline,     // Q3  — LLM bash pipeline (llm tool)
  fileReorganizer,     // Q4  — File reorganizer by category tag
  asciinemaSession,    // Q5  — Asciinema terminal session
  threeWayMerge,       // Q6  — Three-way merge conflict count
  gitHistory,          // Q7  — Git history parent commit hash
  githubPages,         // Q8  — GitHub Pages with email in HTML
  githubAction,        // Q9  — GitHub Action with email in step name
  httpbinPost,         // Q10 — eShopCo httpbin POST health check
  fixJson,             // Q11 — Fix broken JSON file
  monthlySales,        // Q12 — Monthly sales verification
  unicodeMarkdown,     // Q13 — Unicode → Markdown converter
  sqlSchema,           // Q14 — SQL schema from CSV files
  sqlAvgOrderValue,    // Q15 — SQL average order value (shipped)
  markdownArchitecture, // Q16 — Markdown architecture document
  promptEngineering,   // Q17 — Prompt engineering (PromptOps)
  debugAiCode,         // Q18 — Debug AI-generated code (DevShield)
].map(wrapSolverModule);
