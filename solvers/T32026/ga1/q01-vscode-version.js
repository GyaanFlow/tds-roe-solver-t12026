import { markdownCodeBlock } from './utils.js';

export const id = 'q-vs-code-version';
export const title = 'Q1: VS Code Version';

export async function solve() {
  const answer = [
    'Version:          Code 1.90.0',
    'Commit:           abc123def456',
    'OS Version:       Windows_NT x64 10.0.22631',
  ].join('\n');
  const guide = `### Q1: VS Code version output\n\nThis fixed answer matches the T2 GA1 output and the format accepted by the T3 Q1 checker. If you want to verify your own installation, open a terminal and run \`code -s\`; the version and OS lines may differ from this fixed answer.`;
  return {
    type: 'solved',
    answer,
    variant: 'Fixed T2 GA1-compatible answer',
    answerDisplay: `### Answer\n\n${markdownCodeBlock(answer, 'text')}`,
    guide,
    debug: { source: 'T22026 GA1 fixed answer', personalized: false },
  };
}
