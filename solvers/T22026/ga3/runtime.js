// Solver: GA3 Runtime Wrapper
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
    throw new Error('GA3 solver module is missing a valid id.');
  }
  if (typeof title !== 'string' || !title) {
    throw new Error(`GA3 solver ${id} is missing a valid title.`);
  }
  if (typeof solveImpl !== 'function') {
    throw new Error(`GA3 solver ${id} is missing a solve() function.`);
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
        warnings: [],
      };

      try {
        const result = await solveImpl(normalizedEmail, sessionToken);
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
            ...(finalResult.debug || {}),
            locked: isLocked
          }
        };
      } catch (error) {
        const durationMs = performance.now() - startedAt;
        diagnostics.durationMs = durationMs;
        diagnostics.durationText = formatDuration(durationMs);
        throw error;
      }
    }
  };
}
