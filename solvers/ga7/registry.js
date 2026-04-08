// Solver Registry — GA7 Jan 2026 (all 15 solvers)
import * as colorencoding from './q-colorencoding.js';
import * as chartjunk from './q-chartjunk.js';
import * as narrative from './q-narrative.js';
import * as reconciliation from './q-reconciliation.js';
import * as aggregation from './q-aggregation.js';
import * as axisScale from './q-axis-scale.js';
import * as headline from './q-headline.js';
import * as promptReverse from './q-prompt-reverse.js';
import * as promptStructural from './q-prompt-structural.js';
import * as anomalyDetection from './q-anomaly-detection.js';
import * as poisonedDocument from './q-poisoned-document.js';
import * as flawPriority from './q-flaw-priority.js';
import * as chartError from './q-chart-error.js';
import * as deploymentCost from './q-deployment-cost.js';
import * as latencySpike from './q-latency-spike.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  colorencoding, chartjunk, narrative, reconciliation, aggregation,
  axisScale, headline, promptReverse, promptStructural, anomalyDetection,
  poisonedDocument, flawPriority, chartError, deploymentCost, latencySpike,
].map(wrapSolverModule);
