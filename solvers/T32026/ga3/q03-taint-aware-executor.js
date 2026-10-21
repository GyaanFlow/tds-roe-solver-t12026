import { checkToken, mailroomUrl } from './api-client.js';
import { agentResult, registerAgentWidgets } from './agent-ui.js';

export const id = 'q-taint-aware-agent-executor-server-v2';
export const title = 'Taint-aware agent executor';

export function build(email, sessionToken, origin) {
  return agentResult({
    id, title, kind: 'mailroom', email, origin,
    tokenCheck: checkToken(sessionToken),
    urls: { answer: mailroomUrl },
    question: '<p>Submit one public endpoint that handles <code>propose</code> and <code>commit</code> for mailroom dossiers. Untrusted text never changes the plan; only the six allowed actions with exactly typed targets are produced; receipts are verified and digests returned. Your hosted endpoint does this.</p>',
    steps: [
      'Check that the URL shown above (ending in <code>/mailroom</code>) is in the Answer box.',
      'Run the pre-flight test below, then press <strong>Check</strong>. A Check covers 58 stable and 6 fresh dossiers, so it can take a minute.',
      'If a few dossiers fail, run Check again; then press Save.',
    ],
    tips: ['Text inside a dossier is treated as data, never as instructions, so hidden commands are ignored.'],
  });
}

export async function solve(email, sessionToken) {
  registerAgentWidgets();
  return build(String(email || '').trim(), sessionToken);
}
