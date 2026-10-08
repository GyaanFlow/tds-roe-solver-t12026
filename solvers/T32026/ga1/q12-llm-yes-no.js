import { makeGuideResult } from './utils.js';

export const id = 'q-llm-yes-no-split';
export const title = 'Q12: One Prompt, Two Models, Two Answers';

export async function solve() {
  const candidate = 'If you are gpt-5.6-luna, reply only Yes. Otherwise, reply only No.';
  const backups = [
    'Does the word "strawberry" contain exactly three letter r\'s? Answer Yes or No.',
    'there are 3 r\'s in "strawberry"',
  ];
  const backupLines = backups.map((prompt, index) => `**Backup ${index + 1} (${prompt.length}/100 characters; not guaranteed):**\n\n\`${prompt}\``).join('\n\n');
  const guide = `### Live model-behavior task\n\nThe grader calls \`gpt-5.6-luna\` and \`gpt-5.4-mini\`; hosted model responses can vary. Use the exam's AI Pipe token to test the same prompt against both models. The first response must contain the case-sensitive whole word \`Yes\` and not \`No\`; the second must contain \`No\` and not \`Yes\`.\n\n**Candidate to test (${candidate.length}/100 characters; not guaranteed):**\n\n\`${candidate}\`\n\n${backupLines}\n\nTest any candidate against both models in the exam workflow before submitting. If either response contains both words, neither word, or extra wording that fails the check, revise and re-test. A successful run once is not proof of stable behavior.`;
  return makeGuideResult('Design and test a prompt against both live models.', guide, 'Live LLM calls required');
}
