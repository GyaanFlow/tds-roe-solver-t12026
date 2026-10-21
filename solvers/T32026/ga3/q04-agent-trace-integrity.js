import { checkToken, incidentBase } from './api-client.js';
import { agentResult, registerAgentWidgets } from './agent-ui.js';

export const id = 'q-agent-trace-integrity-server-v2';
export const title = 'Agent trace integrity';

export function build(email, sessionToken, origin) {
  return agentResult({
    id, title, kind: 'incident', email, origin,
    tokenCheck: checkToken(sessionToken),
    urls: { answer: incidentBase },
    question: '<p>Submit the base URL of an incident agent (the grader adds <code>/v2/incidents</code>). It must diagnose from evidence, ask approval before rollback or disabling a feature, retry on 503, report honest traces, and, new in this exam, page the owner instead of scaling when the service is already at its permitted scaling limit.</p>',
    steps: [
      'Check that the URL shown above is in the Answer box (no extra path).',
      'Run the pre-flight test below, then press <strong>Check</strong>.',
      'If a decision fails, run Check again; then press Save.',
    ],
    tips: ['The hosted agent pages the owner instead of scaling when a service is at its scaling limit.'],
  });
}

export async function solve(email, sessionToken) {
  registerAgentWidgets();
  return build(String(email || '').trim(), sessionToken);
}
