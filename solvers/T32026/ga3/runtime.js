import { markdownCodeBlock, normalizeEmail, trimEmail } from './utils.js';

function messageFrom(error) {
  if (error instanceof Error && error.message) return error.message;
  try {
    return String(error ?? 'Unknown solver error.');
  } catch {
    return 'Unknown solver error.';
  }
}

export function wrapSolverModule(module) {
  if (typeof module.id !== 'string' || !module.id) throw new Error('T3 GA3 solver is missing an id.');
  if (typeof module.title !== 'string' || !module.title) throw new Error(`T3 GA3 ${module.id} is missing a title.`);
  if (typeof module.solve !== 'function') throw new Error(`T3 GA3 ${module.id} is missing solve(email).`);

  return {
    id: module.id,
    title: module.title,
    async solve(email, sessionToken) {
      const now = () => globalThis.performance?.now?.() ?? Date.now();
      const startedAt = now();
      let normalizedEmail = 'n/a';
      try {
        const solverEmail = trimEmail(email);
        normalizedEmail = normalizeEmail(solverEmail);
        if (!solverEmail) throw new Error('Enter the registered email before preparing GA3 helpers.');
        if (solverEmail.length > 254) throw new Error('Email is too long to be a valid address.');
        if (/[<>]/.test(solverEmail) || !/^[^\s@]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/.test(solverEmail)) {
          throw new Error('Enter a complete email address with a valid dotted domain.');
        }

        const result = await module.solve(solverEmail, sessionToken);
        if (!result || typeof result.answer !== 'string' || !result.answer.trim()) {
          throw new Error('Solver returned an empty or invalid answer.');
        }
        if (!['solved', 'guide', 'bypass'].includes(result.type)) {
          throw new Error(`Solver returned unsupported result type: ${String(result.type)}.`);
        }
        const durationMs = Math.max(0, now() - startedAt);
        return {
          ...result,
          debug: {
            ...result.debug,
            solverId: module.id,
            normalizedEmail,
            durationMs,
            durationText: `${durationMs.toFixed(1)}ms`,
            warnings: Array.isArray(result.debug?.warnings) ? result.debug.warnings : [],
          },
        };
      } catch (error) {
        const durationMs = Math.max(0, now() - startedAt);
        const message = messageFrom(error);
        return {
          type: 'error',
          answer: `Could not prepare this question: ${message}`,
          variant: 'Solver error',
          answerDisplay: `### ${module.title}\n\n${markdownCodeBlock(message, 'text')}`,
          debug: {
            solverId: module.id,
            normalizedEmail,
            durationMs,
            durationText: `${durationMs.toFixed(1)}ms`,
            warnings: [message],
          },
        };
      }
    },
  };
}
