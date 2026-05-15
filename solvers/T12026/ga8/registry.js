// Solver Registry — GA8 Jan 2026 (all 15 solvers)
import * as ghActions from './q-gh-actions.js';
import * as geminiMath from './q-gemini-math.js';
import * as fastapiIris from './q-fastapi-iris.js';
import * as hfSpaces from './q-hf-spaces.js';
import * as dockerVerify from './q-docker-verify.js';
import * as bashScript from './q-bash-script.js';
import * as precommit from './q-precommit.js';
import * as mlopsQuiz from './q-mlops-quiz.js';
import * as cloudRunCompute from './q-cloud-run-compute.js';
import * as cloudFunctions from './q-cloud-functions.js';
import * as geminiClassify from './q-gemini-classify.js';
import * as cloudRunMl from './q-cloud-run-ml.js';
import * as cloudRunEnvconfig from './q-cloud-run-envconfig.js';
import * as cloudRunHashapi from './q-cloud-run-hashapi.js';
import * as geminiExtract from './q-gemini-extract.js';
import { wrapSolverModule } from './runtime.js';

export const solvers = [
  ghActions,         // Q1:  1.5 marks — guide (GitHub Actions)
  geminiMath,        // Q2:  1.5 marks — AUTO-SOLVED ✅
  fastapiIris,       // Q3:  2 marks   — guide (deploy)
  hfSpaces,          // Q4:  2 marks   — guide (deploy)
  dockerVerify,      // Q5:  1.5 marks — guide (Docker)
  bashScript,        // Q6:  1 mark    — AUTO-SOLVED ✅
  precommit,         // Q7:  1.5 marks — guide (GitHub)
  mlopsQuiz,         // Q8:  1 mark    — AUTO-SOLVED ✅
  cloudRunCompute,   // Q9:  2 marks   — guide (deploy)
  cloudFunctions,    // Q10: 1.5 marks — guide (deploy)
  geminiClassify,    // Q11: 1.5 marks — AUTO-SOLVED ✅
  cloudRunMl,        // Q12: 2 marks   — guide (deploy)
  cloudRunEnvconfig, // Q13: 1.5 marks — guide (deploy)
  cloudRunHashapi,   // Q14: 1.5 marks — guide (deploy)
  geminiExtract,     // Q15: 1.5 marks — AUTO-SOLVED ✅
].map(wrapSolverModule);
