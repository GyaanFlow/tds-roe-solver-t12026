// Solver Registry — GA4 (all 13 solvers)
import * as ragChunkingHybridSearch from './q-rag-chunking-hybrid-search.js';
import * as ragEvaluationHarness from './q-rag-evaluation-harness.js';
import * as groundedAnswerApi from './q-grounded-answer-api.js';
import * as vectorSearchRerankApi from './q-vector-search-rerank-api.js';
import * as graphragPipelineApi from './q-graphrag-pipeline-api.js';
import * as lateChunkingContextRetrieval from './q-late-chunking-context-retrieval.js';
import * as semanticCacheQueryAugmentation from './q-semantic-cache-query-augmentation.js';
import * as multimodalEmbeddingCalibration from './q-multimodal-embedding-calibration.js';
import * as hydeHypotheticalRetrieval from './q-hyde-hypothetical-retrieval.js';
import * as annIndexRecallLatency from './q-ann-index-recall-latency.js';
import * as semanticDedupNumericGuardrail from './q-semantic-dedup-numeric-guardrail.js';
import * as contextAssemblyLostMiddle from './q-context-assembly-lost-middle.js';
import * as rrfFusion from './q-rrf-fusion.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  ragChunkingHybridSearch,          // Q1
  ragEvaluationHarness,             // Q2
  groundedAnswerApi,                // Q3
  vectorSearchRerankApi,            // Q4
  graphragPipelineApi,              // Q5
  lateChunkingContextRetrieval,     // Q6
  semanticCacheQueryAugmentation,   // Q7
  multimodalEmbeddingCalibration,   // Q8
  hydeHypotheticalRetrieval,        // Q9
  annIndexRecallLatency,            // Q10
  semanticDedupNumericGuardrail,    // Q11
  contextAssemblyLostMiddle,        // Q12
  rrfFusion                         // Q13
].map(wrapSolverModule);
