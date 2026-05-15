import { normalizeEmail } from './utils.js';

const HTML_SOLVER_IDS = new Set([
  'q-colorencoding-server',
  'q-chartjunk-server',
  'q-axis-scale-manipulation-repair',
  'q-narrative-integration-repair',
  'q-broken-aggregation-sort-repair',
]);

const TUPLE_ARRAY_SOLVER_IDS = new Set([
  'q-ranked-anomaly-detection',
  'q-poisoned-document-detection',
  'q-flaw-priority-ranking',
  'q-chart-error-detection',
  'q-latency-spike-detection',
]);

const TEXT_SOLVER_IDS = new Set([
  'q-data-narrative-number-reconciliation',
  'q-headline-rewriting',
  'q-presentation-prompt-structural-repair',
  'q-prompt-reverse-engineering',
  'q-deployment-cost-analysis',
]);

const TUPLE_ARRAY_RE = /^\[(?:\((\d+),\s*"([^"]+)"\)(?:,\s*)?)*\]$/;
const DEPLOYMENT_RE = /^\("([A-C])",\s*(\d+\.\d{2})\)$/;

function formatDuration(ms) {
  if (ms < 1) return `${ms.toFixed(3)}ms`;
  if (ms < 100) return `${ms.toFixed(1)}ms`;
  return `${Math.round(ms)}ms`;
}

function assertSeedrandom() {
  if (typeof Math.seedrandom !== 'function') {
    throw new Error('Missing Math.seedrandom. Load seedrandom before running GA7 solvers.');
  }
}

function validateHtmlAnswer(answer) {
  const trimmed = answer.trim();
  if (!trimmed.startsWith('<!DOCTYPE html>')) {
    throw new Error('Expected a full HTML document beginning with <!DOCTYPE html>.');
  }
  if (!trimmed.includes('<canvas')) {
    throw new Error('Expected HTML answer to render a chart canvas.');
  }
  if (!trimmed.includes('new Chart(')) {
    throw new Error('Expected HTML answer to initialize Chart.js.');
  }
}

function validateTupleArray(answer) {
  const trimmed = answer.trim();
  if (!TUPLE_ARRAY_RE.test(trimmed)) {
    throw new Error('Expected a tuple array like [(1, "S1"), (2, "S2")].');
  }
}

function validateDeploymentAnswer(answer) {
  const trimmed = answer.trim();
  const match = DEPLOYMENT_RE.exec(trimmed);
  if (!match) {
    throw new Error('Expected deployment answer like ("A", 0.05).');
  }
  const cost = Number(match[2]);
  if (!Number.isFinite(cost) || cost <= 0) {
    throw new Error('Deployment cost must be a positive decimal.');
  }
}

function validateTextAnswer(answer, id) {
  const trimmed = answer.trim();
  if (!trimmed) {
    throw new Error('Expected a non-empty text answer.');
  }

  if (id === 'q-headline-rewriting') {
    const lines = trimmed.split(/\r?\n/).filter(Boolean);
    if (lines.length !== 6) {
      throw new Error(`Expected 6 headline answer lines, got ${lines.length}.`);
    }
    const badLine = lines.find(line => !/^\d+\|(description|finding)\|/.test(line));
    if (badLine) {
      throw new Error(`Invalid headline line format: ${badLine}`);
    }
  }

  if (id === 'q-presentation-prompt-structural-repair') {
    if (!trimmed.includes('Missing components:') || !trimmed.includes('Completed prompt:')) {
      throw new Error('Expected structural-repair answer to include missing components and completed prompt sections.');
    }
  }

  if (id === 'q-prompt-reverse-engineering') {
    if (!trimmed.includes('Prompt:') || !trimmed.includes('LLM Response:')) {
      throw new Error('Expected prompt-reverse answer to include both prompt and LLM response.');
    }
    const match = trimmed.match(/Prompt:\s*([\s\S]*?)\n\s*\nLLM Response:\s*([\s\S]*)$/);
    if (!match) {
      throw new Error('Prompt-reverse answer must keep Prompt and LLM Response as two sections.');
    }
    const promptWords = match[1].trim().split(/\s+/).filter(Boolean).length;
    if (promptWords < 50) {
      throw new Error(`Prompt-reverse prompt is too short (${promptWords} words).`);
    }
    if (!match[2].trim()) {
      throw new Error('Prompt-reverse answer must include a non-empty LLM response.');
    }
  }
}

function validateVariant(variant) {
  if (variant == null) return;
  if (typeof variant !== 'string') {
    throw new Error('Variant must be a string when provided.');
  }
}

function validateAnswerShape(id, answer) {
  if (typeof answer !== 'string') {
    throw new Error('Solver answer must be a string.');
  }

  if (HTML_SOLVER_IDS.has(id)) return validateHtmlAnswer(answer);
  if (TUPLE_ARRAY_SOLVER_IDS.has(id)) return validateTupleArray(answer);
  if (id === 'q-deployment-cost-analysis') return validateDeploymentAnswer(answer);
  if (TEXT_SOLVER_IDS.has(id)) return validateTextAnswer(answer, id);
}

function validateResult(id, title, result) {
  if (!result || typeof result !== 'object') {
    throw new Error('Solver must return an object result.');
  }

  if (result.title != null && result.title !== title) {
    throw new Error(`Returned title mismatch. Expected "${title}", got "${result.title}".`);
  }

  validateVariant(result.variant);
  validateAnswerShape(id, result.answer);
}

export function wrapSolverModule(mod) {
  const id = mod.id;
  const title = mod.title;
  const solveImpl = mod.solve;

  if (typeof id !== 'string' || !id) {
    throw new Error('GA7 solver module is missing a valid id.');
  }
  if (typeof title !== 'string' || !title) {
    throw new Error(`GA7 solver ${id} is missing a valid title.`);
  }
  if (typeof solveImpl !== 'function') {
    throw new Error(`GA7 solver ${id} is missing a solve(email) function.`);
  }

  return {
    id,
    title,
    async solve(email) {
      assertSeedrandom();

      const startedAt = performance.now();
      const normalizedEmail = normalizeEmail(email);
      const diagnostics = {
        solverId: id,
        normalizedEmail,
        warnings: [],
      };

      if (!normalizedEmail.includes('@')) {
        diagnostics.warnings.push('Input email did not look like a standard address after normalization.');
      }

      const result = await Promise.resolve(solveImpl(normalizedEmail));
      validateResult(id, title, result);

      const durationMs = performance.now() - startedAt;
      diagnostics.durationMs = durationMs;
      diagnostics.durationText = formatDuration(durationMs);

      return {
        ...result,
        debug: diagnostics,
      };
    }
  };
}

export function summarizeResult(result) {
  const debug = result?.debug;
  if (!debug) return 'No diagnostics available';
  const parts = [`${debug.solverId}`, debug.durationText || 'n/a'];
  if (debug.warnings?.length) parts.push(`${debug.warnings.length} warning(s)`);
  return parts.join(' | ');
}
