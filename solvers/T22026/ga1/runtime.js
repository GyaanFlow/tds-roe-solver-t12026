// Solver: GA1 Runtime Wrapper
import { normalizeEmail } from './utils.js';

import { lockConfig } from './lock-config.js';

function formatDuration(ms) {
  if (ms < 1) return `${ms.toFixed(3)}ms`;
  if (ms < 100) return `${ms.toFixed(1)}ms`;
  return `${Math.round(ms)}ms`;
}

export function wrapSolverModule(mod) {
  const id = mod.id;
  const title = mod.title;
  const solveImpl = mod.solve;

  if (typeof id !== 'string' || !id) {
    throw new Error('GA1 solver module is missing a valid id.');
  }
  if (typeof title !== 'string' || !title) {
    throw new Error(`GA1 solver ${id} is missing a valid title.`);
  }
  if (typeof solveImpl !== 'function') {
    throw new Error(`GA1 solver ${id} is missing a solve(email) function.`);
  }

  return {
    id,
    title,
    async solve(email) {
      const startedAt = performance.now();
      const normalizedEmail = normalizeEmail(email);
      const isWhitelisted = lockConfig.allowedEmails
        .map(e => normalizeEmail(e).toLowerCase())
        .includes(normalizedEmail.toLowerCase());
      const isLocked = lockConfig.locked && !isWhitelisted;

      const diagnostics = {
        solverId: id,
        normalizedEmail,
        warnings: [],
      };

      if (!normalizedEmail.includes('@')) {
        diagnostics.warnings.push('Input email did not look like a standard address after normalization.');
      }

      try {
        const timeoutMs = 60000; // 60 second timeout
        const resultPromise = Promise.resolve(solveImpl(normalizedEmail));
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Solver ${id} timed out after ${timeoutMs}ms`)), timeoutMs)
        );
        const result = await Promise.race([resultPromise, timeoutPromise]);

        const durationMs = performance.now() - startedAt;
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);

        let finalResult = result;
        if (isLocked) {
          finalResult = {
            type: 'guide',
            answer: 'This solver is locked. Access to answers and guides is restricted.',
            variant: 'Locked',
            answerDisplay: [
              `### ${title}`,
              `⚠️ **Access Restricted**: This solver is locked.`,
              `You do not have permission to access the solutions or step-by-step guides for this exam.`,
            ].join('\n'),
            guide: 'Access to this solver and its guide is restricted. Please complete the tasks yourself.'
          };
        }

        return {
          ...finalResult,
          debug: {
            ...diagnostics,
            locked: isLocked
          },
        };
      } catch (error) {
        const durationMs = performance.now() - startedAt;
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);
        diagnostics.errorType = error.message?.includes('timed out') ? 'timeout'
          : error.message?.includes('fetch') ? 'network_error'
          : 'computation_error';
        diagnostics.errorMessage = error.message;
        throw error; // re-throw so app.js catch block handles it
      }
    }
  };
}
