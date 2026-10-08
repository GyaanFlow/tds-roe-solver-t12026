import { makeGuideResult } from './utils.js';

export const id = 'q-termlog-rec-server';
export const title = 'Q13: Decode It in the Terminal (termlog)';

export async function solve() {
  const guide = `### Record and submit the live challenge\n\nThis task requires a fresh challenge from the authenticated exam session and a signed termlog recording. Start the recording before fetching the challenge; decode that exact value in the same recording, then include both demo.cast and demo.cast.jwt in the archive.\n\nThe three transforms to reverse are ROT13, hexadecimal encoding, and string reversal. Identify their application order from the challenge representation and undo them in reverse order. Upload the archive to a public URL and submit it before the challenge expires.`;
  return makeGuideResult('Create the signed recording and submit a public archive URL.', guide, 'Live signed artifact required');
}
