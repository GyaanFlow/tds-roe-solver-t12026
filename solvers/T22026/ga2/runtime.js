// Solver: GA2 Runtime Wrapper
import { normalizeEmail } from './utils.js';

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
    throw new Error('GA2 solver module is missing a valid id.');
  }
  if (typeof title !== 'string' || !title) {
    throw new Error(`GA2 solver ${id} is missing a valid title.`);
  }
  if (typeof solveImpl !== 'function') {
    throw new Error(`GA2 solver ${id} is missing a solve(email) function.`);
  }

  return {
    id,
    title,
    async solve(email) {
      const startedAt = performance.now();
      const normalizedEmail = normalizeEmail(email);

      const diagnostics = {
        solverId: id,
        normalizedEmail,
        warnings: [],
      };

      try {
        const result = await solveImpl(normalizedEmail);
        const durationMs = performance.now() - startedAt;
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);

        return {
          ...result,
          debug: {
            ...diagnostics,
          },
        };
      } catch (error) {
        const durationMs = performance.now() - startedAt;
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);
        diagnostics.errorMessage = error.message;
        throw error;
      }
    }
  };
}
