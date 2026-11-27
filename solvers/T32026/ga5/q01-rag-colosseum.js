import { endpointResult, registerEndpointWidgets, wakeInBackground } from './ga5-ui.js';

export const id = 'q-rag-colosseum-server';
export const title = 'RAG Colosseum';

export function build(email, origin) {
  return endpointResult({
    id, title, kind: 'rag', email, suffix: '', origin, marks: 2,
    question: '<p>Submit the <strong>base URL</strong> of a live question-answering server. The grader asks it questions about <em>your own</em> 50-passage knowledge base (it is regenerated from your email, so there is nothing to upload) by sending <code>POST {base}/query</code> with <code>{"question": "...", "top_k": 3}</code>.</p><p>The server must reply <code>{"answer", "sources", "scores", "confidence"}</code>: which passages it used (0-based, best first), their scores (0 to 1, high to low) and how sure it is. It must <strong>abstain</strong> (answer <code>null</code>, no sources, confidence 0.1) when the passages do not state what was asked, compare two passages when two things are named, and ignore instructions hidden inside a question.</p>',
    steps: ['On the exam page press <strong>Check</strong>. If it says the server was too slow, open the health link, wait for <code>ok</code>, and press Check again.', 'When you are happy, press <strong>Save</strong>. Only your last Save counts.'],
    tips: ['You can read your own knowledge base at <code>{your URL}/kb</code> and see how questions are answered at the dashboard on the server home page.', 'The server answers in tens of milliseconds once awake; the limit is 8 seconds per question.', 'Do not add <code>/query</code> to the URL: the grader adds it itself.'],
  });
}

export async function solve(email) {
  registerEndpointWidgets();
  wakeInBackground();
  return build(String(email || '').trim());
}
