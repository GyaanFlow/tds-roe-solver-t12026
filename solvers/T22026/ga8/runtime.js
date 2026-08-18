import { normalizeEmail, formatDuration } from './utils.js';
import { lockConfig } from './lock-config.js';

const SOLVER_TIMEOUT_MS = 30000;

function validateResultShape(result) {
  const errors = [];
  if (!result || typeof result !== 'object') {
    return ['solver returned a non-object result'];
  }
  if (typeof result.answer !== 'string') {
    errors.push('answer must be a string');
  }
  if (result.answer && result.answer.length === 0) {
    errors.push('answer must not be empty');
  }
  if (result.type && !['solved', 'guide', 'bypass', 'error'].includes(result.type)) {
    errors.push(`unexpected type "${result.type}"`);
  }
  if (result.type === 'solved' && (!result.answer || result.answer.length === 0)) {
    errors.push('solved type requires a non-empty answer');
  }
  return errors;
}

export function wrapSolverModule(mod) {
  const id = mod.id;
  const title = mod.title;
  const solveImpl = mod.solve;

  if (typeof id !== 'string' || !id) {
    throw new Error('GA8 solver module is missing a valid id.');
  }
  if (typeof title !== 'string' || !title) {
    throw new Error(`GA8 solver ${id} is missing a valid title.`);
  }
  if (typeof solveImpl !== 'function') {
    throw new Error(`GA8 solver ${id} is missing a solve() function.`);
  }

  return {
    id,
    title,
    async solve(email, sessionToken) {
      const startedAt = performance.now();
      const normalizedEmail = normalizeEmail(email);
      const isWhitelisted = lockConfig.allowedEmails
        .map(e => normalizeEmail(e).toLowerCase())
        .includes(normalizedEmail.toLowerCase());
      const isLocked = lockConfig.locked && !isWhitelisted;

      const diagnostics = {
        solverId: id,
        normalizedEmail,
        warnings: []
      };

      try {
        let result;
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Solver timed out after ${SOLVER_TIMEOUT_MS}ms`)), SOLVER_TIMEOUT_MS)
        );
        const solvePromise = (async () => {
          return await solveImpl(normalizedEmail, sessionToken);
        })();
        result = await Promise.race([solvePromise, timeoutPromise]);

        const durationMs = performance.now() - startedAt;
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);

        const shapeErrors = validateResultShape(result);
        if (shapeErrors.length > 0) {
          diagnostics.warnings.push(`result shape: ${shapeErrors.join(', ')}`);
          if (!result || typeof result !== 'object') {
            result = { answer: '', type: 'error' };
          }
          if (!result.type) result.type = 'error';
          if (typeof result.answer !== 'string') result.answer = String(result.answer ?? '');
        }

        let finalResult = result;
        if (isLocked) {
          finalResult = {
            type: 'guide',
            answer: 'This solver is locked. Access is restricted.',
            variant: 'Locked',
            answerDisplay: [
              'This solver is restricted to registered students.',
              'Please contact the course team for access.'
            ].join('\n'),
            guide: [
              '# Solver Locked',
              'This solver is currently locked. Enter a valid registered email.'
            ].join('\n'),
            debug: { ...diagnostics, isLocked: true }
          };
        } else {
          finalResult.debug = {
            ...diagnostics,
            ...(finalResult.debug || {})
          };
        }

        return finalResult;
      } catch (error) {
        const durationMs = performance.now() - startedAt;
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);
        diagnostics.error = error.message;

        return {
          answer: `Error: ${error.message}`,
          type: 'error',
          variant: 'Execution Failed',
          answerDisplay: `Error executing solver: ${error.message}`,
          guide: `# Solver Error\n\nFailed with message:\n\`\`\`\n${error.stack || error.message}\n\`\`\``,
          debug: diagnostics
        };
      }
    }
  };
}
