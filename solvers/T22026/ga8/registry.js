// Solver Registry — GA8 MLOps & LLM Systems Gateway (10 questions in official bundle order).
import * as immutableTrainingCorpus from './q-immutable-training-corpus.js';
import * as leakageSafeBqml from './q-leakage-safe-bqml.js';
import * as mlflowEvidencePromotion from './q-mlflow-evidence-promotion.js';
import * as peftRepair from './q-peft-repair.js';
import * as quantizedModelAdmission from './q-quantized-model-admission.js';
import * as contentAddressedPipeline from './q-content-addressed-pipeline.js';
import * as verifiableModelBundle from './q-verifiable-model-bundle.js';
import * as loraQuantBudget from './q-lora-quant-budget.js';
import * as mlflowFingerprint from './q-mlflow-fingerprint.js';
import * as modelcardCarbon from './q-modelcard-carbon.js';

import { wrapSolverModule } from './runtime.js';

export const solvers = [
  immutableTrainingCorpus,    // Q1:  Hosted API — POST /build-corpus
  leakageSafeBqml,           // Q2:  Hosted API — POST /bqml (two-phase select -> evaluate)
  mlflowEvidencePromotion,   // Q3:  Hosted API — POST /promote
  peftRepair,                // Q4:  Hosted API — POST /adapt (choose & repair)
  quantizedModelAdmission,   // Q5:  Hosted API — POST /quantize (freeze -> select)
  contentAddressedPipeline,  // Q6:  Hosted API — POST /pipeline (6-stage DAG)
  verifiableModelBundle,     // Q7:  Hosted API — POST /verify-bundle
  loraQuantBudget,           // Q8:  LoRA Parameter & Safetensors Size (JSON answer)
  mlflowFingerprint,         // Q9:  PyTorch Training Loop & MLflow Fingerprint (JSON answer)
  modelcardCarbon            // Q10: Green AI & Model Card Carbon Frontmatter (YAML answer)
].map(wrapSolverModule);
