import * as q01 from './q01-termlog-httpbin.js';
import * as q02 from './q02-model-intelligence.js';
import * as q03 from './q03-metrics-cors.js';
import * as q04 from './q04-oauth-jwt.js';
import * as q05 from './q05-config-precedence.js';
import * as q06 from './q06-redis-counter.js';
import * as q07 from './q07-analytics.js';
import * as q08 from './q08-observability.js';
import * as q09 from './q09-ollama-tunnel.js';
import * as q10 from './q10-invoice-extractor.js';
import * as q11 from './q11-orders-api.js';
import * as q12 from './q12-ping-middleware.js';
import * as q13 from './q13-stream-reassembly.js';
import * as q14 from './q14-docker-cache.js';
import * as q15 from './q15-termlog-modelfile.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  q01, // Q1  - HTTPBin terminal lab (termlog)
  q02, // Q2  - Differentiate model intelligence — automatic evaluation
  q03, // Q3  - Deploy a CORS-Aware Metrics API
  q04, // Q4  - OAuth 2.0 / OIDC Token Verification Service
  q05, // Q5  - Resolve 12-Factor Config Precedence
  q06, // Q6  - Multi-Container App via Compose, Exposed by Tunnel
  q07, // Q7  - Deploy a POST Analytics Endpoint
  q08, // Q8  - Production Observability: Metrics, Health & Structured Logs
  q09, // Q9  - Expose a Local LLM through a Tunnel
  q10, // Q10 - Local LLM Structured-Output Service
  q11, // Q11 - API Engineering: Idempotency + Pagination + Rate Limit
  q12, // Q12 - Middleware Stack: Rate-Limit + CORS + Request Context
  q13, // Q13 - Recover a fragmented LLM stream
  q14, // Q14 - Diagnose Docker build cache misses
  q15, // Q15 - Create a custom Ollama model (termlog)
].map(wrapSolverModule);

export const metadata = {
  exam: 'ga2',
  term: 'T32026',
  officialSource: 'exam-tds-2026-09-ga2.js',
  questionCount: 15,
};
