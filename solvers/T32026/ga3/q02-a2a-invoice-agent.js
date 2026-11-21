import { checkToken, a2aBase } from './api-client.js';
import { agentResult, registerAgentWidgets } from './agent-ui.js';

export const id = 'q-a2a-durable-delegate-server-v2';
export const title = 'A2A Invoice Agent: decide and act safely';
export const PRIMARY_URL = 'https://tds-ga3-hir3.onrender.com';

export function build(email, sessionToken, origin) {
  return agentResult({
    id, title, kind: 'a2a', email, origin,
    tokenCheck: checkToken(sessionToken),
    urls: { answer: a2aBase },
    primaryUrl: PRIMARY_URL,
    question: '<p>Submit the public base URL of an A2A invoice agent. The grader reads the Agent Card, sends invoice packages, expects action proposals with cited evidence, then sends results and expects receipts handled safely and retries that never repeat a payment. Your hosted API already does all of this and uses your own AI Pipe token for the decisions.</p>',
    steps: [
      'Make sure the exam answer box holds exactly the URL shown above (keep any trailing slash).',
      'Optional: if you added a token, press <strong>Run pre-flight test</strong> in the box below. It never calls an AI model.',
      'On the exam page press <strong>Check</strong>. If a decision row fails, press Check again once or twice; the model can vary.',
      'When you are happy, press <strong>Save</strong>. Only your last Save counts.',
    ],
    tips: [
      'The agent separates people by the Bearer value the grader sends, so work never mixes between callers.',
      'Retries with the same message id return the stored result, so a payment is never repeated.',
    ],
  });
}

export async function solve(email, sessionToken) {
  registerAgentWidgets();
  return build(String(email || '').trim(), sessionToken);
}
