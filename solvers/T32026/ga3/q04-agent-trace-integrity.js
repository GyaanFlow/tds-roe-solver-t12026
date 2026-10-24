import { checkToken, incidentBase } from './api-client.js';
import { agentResult, registerAgentWidgets } from './agent-ui.js';

export const id = 'q-agent-trace-integrity-server-v2';
export const title = 'Agent trace integrity';
export const PRIMARY_URL = 'https://tds-ga3-hir3.onrender.com';

export function build(email, sessionToken, origin) {
  return agentResult({
    id, title, kind: 'incident', email, origin,
    tokenCheck: checkToken(sessionToken),
    urls: { answer: incidentBase },
    primaryUrl: PRIMARY_URL,
    question: '<p>Submit the base URL of an incident agent (the grader adds <code>/v2/incidents</code>). It must diagnose from evidence, ask approval before rollback or disabling a feature, retry on 503, report honest traces, and, new in this exam, page the owner instead of scaling when the service is already at its permitted scaling limit.</p>',
    steps: [
      'Copy your personalized main URL above exactly into the Answer box; the grader adds the incident path.',
      'The shared endpoint in the backup section is a fallback. The pre-flight test checks your personalized main URL. Then press <strong>Check</strong>.',
      'If a decision fails, run Check again; then press Save.',
    ],
    tips: ['The hosted agent pages the owner instead of scaling when a service is at its scaling limit.'],
  });
}

export async function solve(email, sessionToken) {
  registerAgentWidgets();
  return build(String(email || '').trim(), sessionToken);
}
