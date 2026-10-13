import * as q01 from './q01-vscode-version.js';
import * as q02 from './q02-http-headers.js';
import * as q03 from './q03-uv-http-post.js';
import * as q04 from './q04-npx-prettier.js';
import * as q05 from './q05-broken-json.js';
import * as q06 from './q06-config-precedence.js';
import * as q07 from './q07-rename-files.js';
import * as q08 from './q08-csv-sales.js';
import * as q09 from './q09-github-pages.js';
import * as q10 from './q10-git-forensics.js';
import * as q11 from './q11-cosine-search.js';
import * as q12 from './q12-llm-yes-no.js';
import * as q13 from './q13-termlog.js';
import * as q14 from './q14-mcp-server.js';
import * as q15 from './q15-ledger-agent.js';
import * as q16 from './q16-tangram.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  q01, // Q1  - VS Code version from the local environment
  q02, // Q2  - live authenticated response header
  q03, // Q3  - deterministic HTTPie request plus live submission guide
  q04, // Q4  - pinned Prettier Markdown hash
  q05, // Q5  - reconstructed seeded JSON source data
  q06, // Q6  - FastAPI config precedence; live API URL
  q07, // Q7  - seeded file reorganization hash
  q08, // Q8  - seeded CSV revenue
  q09, // Q9  - personal GitHub Pages deployment
  q10, // Q10 - live authenticated Git history artifact
  q11, // Q11 - seeded cosine-similarity rankings
  q12, // Q12 - live calls to two LLMs
  q13, // Q13 - live signed termlog artifact
  q14, // Q14 - MCP server; live API URL
  q15, // Q15 - ledger agent API; live URL generated from the student's private Ledger link
  q16, // Q16 - interactive Tangram and signed game token
].map(wrapSolverModule);

export const metadata = {
  exam: 'ga1',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-ga1.js',
  questionCount: 16,
  apiHandoffQuestions: ['q-config-precedence-server', 'q-mcp-server-live-server', 'q-ledger-agent-server'],
};
