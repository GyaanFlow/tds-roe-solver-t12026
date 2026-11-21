import { endpointResult, registerEndpointWidgets } from './ga5-ui.js';

export const id = 'q-harness-safety-router-server';
export const title = 'Harness Engineering: Contextual Safety and Model Routing';

export function build(email, origin) {
  return endpointResult({
    id, title, kind: 'harness', email, suffix: '/harness', origin, marks: 2,
    question: '<p>Submit the <strong>exact POST route</strong> of a safety-router server. The grader sends four batches of 24 cases (two at a time) to it. For every case the server decides the request (content policy and security-research scope), the proposed tool call (exact, unrevoked user approval; isolation facts; production preflight and rollback), the model route and the trajectory.</p><p>It must reply <code>{"profile", "batchId", "results": [{"caseId", "requestDecision", "toolDecision", "route", "trajectory"}]}</code>. Cases are judged one by one in any order, a duplicate <code>caseId</code> gets 422, and one malformed case gets a safe default instead of failing the whole batch.</p>',
    steps: ['On the exam page press <strong>Check</strong>. If a batch fails, open the health link, wait for <code>ok</code>, and try again.', 'When you are happy, press <strong>Save</strong>. Only your last Save counts.'],
    tips: ['The URL must end with <code>/harness</code> (this is the exact route the grader posts to).', 'The rules follow the policy text printed in the exam; the exam\'s 96 cases are unseen, so your Check result is the real test.'],
  });
}

export async function solve(email) {
  registerEndpointWidgets();
  return build(String(email || '').trim());
}
