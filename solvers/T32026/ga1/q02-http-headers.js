import { makeGuideResult } from './utils.js';

export const id = 'q-http-headers-server';
export const title = 'Q2: Find the Code in the Response Headers';

export async function solve() {
  const guide = `### Live response-header task\n\nThe exam code rotates hourly and the question-data endpoint requires the authenticated exam's quizSign. This local solver does not have that session credential, so it cannot safely produce the current code.\n\nIn the active exam session, run the provided curl -i command, inspect the X-Exam-Code response header, and submit its value. Do not use the response body as the answer.`;
  return makeGuideResult('Fetch the authenticated question data and read the `X-Exam-Code` header.', guide, 'Live authenticated task');
}
