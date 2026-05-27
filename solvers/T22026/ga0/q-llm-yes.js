// Solver: Q12 — Get LLM to say Yes
export const id = 'q-get-llm-to-say-yes';
export const title = 'Q12: Get LLM to say Yes';

const PROMPTS = [
  'Answer exactly one word, either "Yes" or "No": Is India a nation?',
  'Answer exactly one word, either "Yes" or "No": Is New Delhi the capital of India?',
  'For this binary factual check, reply with exactly one word: Yes or No. Question: Is water wet?',
  'Complete this true statement with exactly one word: India is a nation. Answer: Yes or No?',
  'Choose the correct answer and output only that word. Question: Is New Delhi in India? Options: Yes, No.',
  'Return only the correct option text. Question: Is the sky usually visible during the day? Options: Yes, No.',
];

const PRIMARY_PROMPT = PROMPTS[0];

function assertPromptLooksUseful(prompt) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('[Q12] Prompt must be a non-empty string.');
  }

  if (!/\bYes\b/.test(prompt)) {
    throw new Error('[Q12] Prompt should include the exact case-sensitive target word "Yes".');
  }

  if (!/\bNo\b/.test(prompt)) {
    throw new Error('[Q12] Prompt should include "No" as the alternative answer.');
  }

  return prompt.trim();
}

export async function solve(email) {
  const prompt = assertPromptLooksUseful(PRIMARY_PROMPT);

  return {
    type: 'solved',
    variant: 'Case-sensitive target word: Yes',
    answer: prompt,
    answerDisplay: [
      `### Prompt`,
      ``,
      `Submit this prompt:`,
      ``,
      `\`${prompt}\``,
      ``,
      `### Why this works`,
      ``,
      `The checker is case-sensitive and looks for the exact word \`Yes\` in the LLM response.`,
      `A simple factual yes/no question is more reliable than an obvious jailbreak instruction.`,
      ``,
      `### Backup prompts`,
      ``,
      ...PROMPTS.slice(1).map((p, i) => `${i + 1}. \`${p}\``),
      ``,
      `### Guide`,
      ``,
      `If the first prompt ever fails, try the backup prompts one by one.`,
      `Once the model returns a response containing exactly \`Yes\`, submit immediately and do not regenerate.`,
    ].join('\n'),
  };
}
