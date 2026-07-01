// Solver Registry — GA2 May 2026 (all 10 solvers)
import * as metricsCors from './q-metrics-cors.js';
import * as oauthJwt from './q-oauth-jwt.js';
import * as configPrecedence from './q-config-precedence.js';
import * as redisCounter from './q-redis-counter.js';
import * as analytics from './q-analytics.js';
import * as observability from './q-observability.js';
import * as llmChat from './q-llm-chat.js';
import * as invoiceExtractor from './q-invoice-extractor.js';
import * as ordersApi from './q-orders-api.js';
import * as pingMiddleware from './q-ping-middleware.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  metricsCors,      // Q1
  oauthJwt,         // Q2
  configPrecedence, // Q3
  redisCounter,     // Q4
  analytics,        // Q5
  observability,    // Q6
  llmChat,          // Q7
  invoiceExtractor, // Q8
  ordersApi,        // Q9
  pingMiddleware    // Q10
].map(wrapSolverModule);
