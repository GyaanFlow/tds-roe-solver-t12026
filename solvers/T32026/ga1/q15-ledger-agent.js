import { makeGuideResult } from './utils.js';

export const id = 'q-ledger-agent-server';
export const title = 'Q15: The Ledger Agent';

export async function solve() {
  return {
    ...makeGuideResult(
      'API implementation intentionally deferred to the separate T3 API project.',
      `### API project handoff\n\nThis question requires two connected systems: inspect the authenticated order-ledger API and its reachable schema/data, then deploy a public HTTPS \`POST {"question":"..."}\` service returning \`{"answer":...}\`. The grader asks several unseen questions about revenue, refunds, products, and customers; each must finish within 15 seconds.\n\nPer your project split, implementation is deferred to the separate API project. When integrating it here, the endpoint must use the current learner's private dataset and handle paraphrased questions rather than memorizing sample prompts.`,
      'API handoff | implementation pending',
    ),
    debug: { integrationStatus: 'pending-separate-api-project' },
  };
}
