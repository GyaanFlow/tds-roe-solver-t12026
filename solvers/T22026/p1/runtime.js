import { normalizeEmail } from './utils.js';
import { lockConfig } from './lock-config.js';

const SOLVER_TIMEOUT_MS = 30000;

function formatDuration(ms) {
  if (ms < 1) return `${ms.toFixed(3)}ms`;
  if (ms < 100) return `${ms.toFixed(1)}ms`;
  return `${Math.round(ms)}ms`;
}

function classifyError(error) {
  if (error instanceof TypeError && error.message.includes('fetch')) return 'network_error';
  if (error instanceof SyntaxError) return 'parse_error';
  return 'computation_error';
}

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
    throw new Error('P1 solver module is missing a valid id.');
  }
  if (typeof title !== 'string' || !title) {
    throw new Error(`P1 solver ${id} is missing a valid title.`);
  }
  if (typeof solveImpl !== 'function') {
    throw new Error(`P1 solver ${id} is missing a solve() function.`);
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
              `### ${title}`,
              '⚠️ **Access Restricted**: This solver is locked.',
              'You do not have permission to access solutions or guides for this exam.',
            ].join('\n'),
            guide: 'Access restricted. Complete the tasks manually.'
          };
        }

        return {
          ...finalResult,
          debug: {
            ...diagnostics,
            ...(finalResult.debug || {}),
            locked: isLocked
          }
        };
      } catch (error) {
        const durationMs = performance.now() - startedAt;
        const errorType = classifyError(error);
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);
        diagnostics.errorType = errorType;

        return {
          id,
          title,
          type: 'error',
          answer: '',
          variant: 'Error',
          answerDisplay: `### ${title}\n\n**Error**: ${error.message}`,
          guide: `The solver encountered an error:\n\n> ${error.message}\n\nTry again or check the console for details.`,
          debug: {
            ...diagnostics,
            error: error.message,
            locked: isLocked
          }
        };
      }
    }
  };
}
