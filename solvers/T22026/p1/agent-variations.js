import seedrandom from './seedrandom.js';

// Q3 and Q4 each award 6.25 marks from an OFFLINE review of the agent log the student
// pastes in. If every student pastes a byte-identical system prompt, task list and status
// format, those logs read as one mass-produced submission — the same failure mode the exam
// explicitly punishes on Q2. So the agent's wording is seeded per (email, question): every
// student gets a genuinely different-looking transcript.
//
// CRITICAL INVARIANT: only prose varies. The gcloud commands, their order, and the
// error-transparency guarantees are identical in every variant — a student must never get a
// weaker or subtly broken notebook because of which bucket the RNG dropped them in. Each
// guardrail variant below says exactly the same four things in different words:
//   (a) run gcloud unwrapped, no self-written if/else or && success checks
//   (b) never redirect stderr (no 2>&1, no 2>/dev/null)
//   (c) never substitute an invented "STEP X ERROR" for real stderr
//   (d) prefer --format=json over --format=value(...) (unquoted parens break shell=True)

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

const PERSONAS = [
  'You are a cloud engineer agent running inside a Google Colab notebook.',
  'You are an experienced Google Cloud operations engineer working inside a Colab notebook.',
  'You act as an autonomous cloud infrastructure agent executing inside a Colab notebook.',
  'You are a DevOps automation agent operating in a Google Colab notebook session.',
  'You are a Google Cloud Platform specialist agent driving this Colab notebook.',
  'You are an infrastructure-as-code agent working through a Google Colab notebook.'
];

const TOOL_NOTES = [
  'You can run shell commands using the run_command tool.',
  'Shell access is available to you through the run_command tool.',
  'Use the run_command tool whenever you need to execute a shell command.',
  'Every shell command you need must be issued via the run_command tool.'
];

// Keyed by auth mode so the sentence always matches how the notebook actually authenticated.
const AUTH_NOTES = {
  serviceAccount: [
    'gcloud is already authenticated as a service account for this project — do not run gcloud auth login or activate-service-account again.',
    'A service-account credential is already active for this project; never re-run gcloud auth login or gcloud auth activate-service-account.',
    'Authentication is already complete via a service-account key — do not attempt any further gcloud auth login or activate-service-account calls.',
    'The session already holds active service-account credentials for this project, so skip gcloud auth login and activate-service-account entirely.'
  ],
  userAccount: [
    'gcloud is already installed and already authenticated via auth.authenticate_user() — do not run gcloud auth login.',
    'gcloud is preinstalled here and the user is already signed in through auth.authenticate_user(), so never invoke gcloud auth login.',
    'Authentication has already been completed with auth.authenticate_user() and gcloud is installed — do not run gcloud auth login.',
    'The Colab runtime already has gcloud installed and signed in via auth.authenticate_user(); any gcloud auth login call is unnecessary.'
  ]
};

const SHELL_NOTES = [
  'This is always a Linux bash shell.',
  'The environment is always a Linux bash shell, so use bash syntax throughout.',
  'You are always operating in a Linux bash shell — no shell detection is needed.',
  'Assume a Linux bash shell at all times.'
];

// All four variants are semantically identical — see the invariant note above.
const GUARDRAILS = [
  'CRITICAL: Never wrap gcloud commands in your own if/else or && success-checking logic, and never redirect stderr (no 2>&1, no 2>/dev/null). Run each gcloud command directly and unwrapped so its real exit code and error text propagate to the caller. Prefer --format=json over --format=value(...) for describe commands, since unquoted parentheses can break under a plain shell call. Do not invent your own STEP X ERROR messages that replace the actual error — always let the true stderr show through.',
  'IMPORTANT RULES: issue every gcloud command bare and unwrapped. Do not surround it with your own conditional or && success checks, and do not redirect stderr in any form (no 2>&1, no 2>/dev/null) — the genuine exit code and error text must reach you untouched. For describe commands use --format=json rather than --format=value(...), because unquoted parentheses can break a plain shell invocation. Never replace real error output with a placeholder message of your own such as STEP X ERROR; quote exactly what the command printed.',
  'STRICT REQUIREMENTS: run each gcloud command on its own, exactly as written, with no if/else wrapper and no && chaining used to test success. Stderr must never be redirected or discarded (no 2>&1, no 2>/dev/null) so that real failures surface verbatim. When describing resources, choose --format=json instead of --format=value(...) — unquoted parentheses can break under a plain shell call. Never fabricate a substitute error line like STEP X ERROR in place of the command output.',
  'NON-NEGOTIABLE: every gcloud invocation must be direct and unwrapped — no self-written if/else, no && success checks, and absolutely no stderr redirection (2>&1 and 2>/dev/null are both forbidden), so that true exit codes and error messages reach you intact. Use --format=json in place of --format=value(...) on describe commands, as unquoted parentheses can break a plain shell call. Never emit an invented STEP X ERROR string instead of the real stderr the command produced.'
];

const TASK_INTROS = [
  'Complete this task autonomously, printing a clear status line after each step. If a command fails, print the exact error and try one reasonable fix.',
  'Work through the following task on your own. After each step print a clear status line. Should a command fail, show the exact error text and attempt one sensible fix.',
  'Carry out the task below without asking me questions. Emit a clear status line as each step completes, and if any command fails, print its exact error before trying one reasonable correction.',
  'Execute the steps below autonomously. Announce each completed step with a clear status line; when a command fails, surface the exact error and make one reasonable attempt to fix it.'
];

const STATUS_FORMATS = [
  'STEP <n> DONE: ...',
  '[step <n> complete] ...',
  '== STEP <n> OK == ...',
  'PROGRESS <n>/<total>: ...',
  '--- step <n> finished --- ...'
];

const SUMMARY_LINES = [
  'Print a final summary of every result above.',
  'Finish by printing a consolidated summary of all results above.',
  'End with a complete summary covering every step and its output.',
  'Conclude with a full recap of each step and what it returned.'
];

const MAX_ITERATION_CHOICES = [18, 20, 22, 24];

const LOG_SUFFIXES = ['agent_log', 'run_log', 'agent_transcript', 'session_log'];

/**
 * Deterministic per-student agent wording for a P1 GCP question.
 *
 * @param {string} normalizedEmail  already lowercased/trimmed student email
 * @param {string} questionId       the solver id, so Q3 and Q4 differ for the same student
 * @param {'serviceAccount'|'userAccount'} authMode  which auth the notebook actually used
 * @param {string} logPrefix        'q3' or 'q4' — namespaces the log filename
 */
export function buildAgentVariation(normalizedEmail, questionId, authMode, logPrefix) {
  const rng = seedrandom(`${normalizedEmail}#${questionId}#${authMode}#agentvar#v1`);
  const authPool = AUTH_NOTES[authMode] || AUTH_NOTES.serviceAccount;

  return {
    persona: pick(rng, PERSONAS),
    toolNote: pick(rng, TOOL_NOTES),
    authNote: pick(rng, authPool),
    shellNote: pick(rng, SHELL_NOTES),
    guardrail: pick(rng, GUARDRAILS),
    taskIntro: pick(rng, TASK_INTROS),
    statusFormat: pick(rng, STATUS_FORMATS),
    summaryLine: pick(rng, SUMMARY_LINES),
    maxIterations: pick(rng, MAX_ITERATION_CHOICES),
    logFile: `${logPrefix}_${pick(rng, LOG_SUFFIXES)}.jsonl`
  };
}

/**
 * Renders the variation's system prompt as the list of Python string-literal lines that go
 * inside the agent cell's messages[0]. Chunked so no single source line runs absurdly long.
 */
export function systemPromptLines(variation, indent = '        ') {
  const full = [
    variation.persona,
    variation.toolNote,
    variation.authNote,
    variation.shellNote,
    variation.guardrail
  ].join(' ');

  // Wrap to ~88 chars per Python string literal, splitting on spaces only.
  const words = full.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if (current && (current + ' ' + word).length > 88) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);

  return lines.map((line, i) => {
    const escaped = line.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const trailingSpace = i < lines.length - 1 ? ' ' : '';
    return `${indent}"${escaped}${trailingSpace}"`;
  });
}
