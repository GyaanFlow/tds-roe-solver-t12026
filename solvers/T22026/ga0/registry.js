// Solver Registry — GA0 May 2026 (all 25 solvers)
import * as axisScale from './q-axis-scale.js';
import * as binaryEval from './q-binary-eval.js';
import * as bugHunter from './q-bug-hunter.js';
import * as variance from './q-calculate-variance.js';
import * as codeInterpreter from './q-code-interpreter.js';
import * as colorEncoding from './q-color-encoding.js';
import * as crawlHtml from './q-crawl-html.js';
import * as cssSelectors from './q-css-selectors.js';
import * as dbtOps from './q-dbt-operations.js';
import * as fastapiStudents from './q-fastapi-students.js';
import * as fastapiSentiment from './q-fastapi-sentiment.js';
import * as llmYes from './q-llm-yes.js';
import * as githubAction from './q-github-action.js';
import * as imageGrayscale from './q-image-grayscale.js';
import * as llmSentiment from './q-llm-sentiment.js';
import * as moveRename from './q-move-rename-files.js';
import * as networkGame from './q-network-game.js';
import * as ollama from './q-ollama.js';
import * as replaceAcross from './q-replace-across-files.js';
import * as sortFilterJson from './q-sort-filter-json.js';
import * as sqlAvgSalary from './q-sql-avg-salary.js';
import * as unicodeData from './q-unicode-data.js';
import * as useDevtools from './q-use-devtools.js';
import * as useGithub from './q-use-github.js';
import * as vercelLatency from './q-vercel-latency.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  axisScale,        // Q1
  binaryEval,       // Q2
  bugHunter,        // Q3
  variance,         // Q4
  codeInterpreter,  // Q5
  colorEncoding,    // Q6
  crawlHtml,        // Q7
  cssSelectors,     // Q8
  dbtOps,           // Q9
  fastapiStudents,  // Q10
  fastapiSentiment, // Q11
  llmYes,           // Q12
  githubAction,     // Q13
  imageGrayscale,   // Q14
  llmSentiment,     // Q15
  moveRename,       // Q16
  networkGame,      // Q17
  ollama,           // Q18
  replaceAcross,    // Q19
  sortFilterJson,   // Q20
  sqlAvgSalary,     // Q21
  unicodeData,      // Q22
  useDevtools,      // Q23
  useGithub,        // Q24
  vercelLatency,    // Q25
].map(wrapSolverModule);
