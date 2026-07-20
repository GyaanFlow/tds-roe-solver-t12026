// Solver Registry — T2 2026 Project 1 (all 4 questions)
import * as requirementsInterview from './q-requirements-interview.js';
import * as modelIntelligenceDiff from './q-model-intelligence-diff.js';
import * as gcpBucketSetup from './q-gcp-bucket-setup.js';
import * as gcpDatasetUpload from './q-gcp-dataset-upload.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  requirementsInterview, // Q1: Requirements Interview — guide (real recording + Drive folder)
  modelIntelligenceDiff, // Q2: Differentiating Model Intelligence — guide + draft prompt
  gcpBucketSetup,        // Q3: GCS Bucket Setup — guide (real GCP infra)
  gcpDatasetUpload        // Q4: Dataset Upload to GCS — guide (real GCP infra)
].map(wrapSolverModule);
