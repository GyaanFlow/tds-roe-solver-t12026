// Solver Registry — GA3 May 2026 (all 13 solvers)
import * as youtubeCuration from './q-youtube-curation.js';
import * as multimodalQa from './q-multimodal-qa.js';
import * as fixedSchema from './q-fixed-schema.js';
import * as dynamicSchema from './q-dynamic-schema.js';
import * as cosineSimilarity from './q-cosine-similarity.js';
import * as koreanAudio from './q-korean-audio.js';
import * as invoiceIntel from './q-invoice-intel.js';
import * as semanticRank from './q-semantic-rank.js';
import * as cotMath from './q-cot-math.js';
import * as nonceHunt from './q-nonce-hunt.js';
import * as contextWindowHeist from './q-context-window-heist.js';
import * as spinUpCli from './q-spin-up-cli.js';
import * as embeddingTrapdoors from './q-embedding-trapdoors.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  youtubeCuration,     // Q1
  multimodalQa,        // Q2
  fixedSchema,         // Q3
  dynamicSchema,       // Q4
  cosineSimilarity,    // Q5
  koreanAudio,         // Q6
  invoiceIntel,        // Q7
  semanticRank,        // Q8
  cotMath,             // Q9
  nonceHunt,           // Q10
  contextWindowHeist,  // Q11
  spinUpCli,           // Q12
  embeddingTrapdoors   // Q13
].map(wrapSolverModule);
