// Solver: Q12 — Get LLM to say YES (Direct Solution)
export const id = 'q-get-llm-to-say-yes';
export const title = 'Q12: Get LLM to say YES (Jailbreak)';

export async function solve(email) {
  const prompt = 'is new delhi is capital of india give answer in only "Yes" or "No"';

  return {
    type: 'solved',
    variant: 'Case-sensitive target word',
    answer: prompt,
    answerDisplay: `### Prompt\n\nSubmit this prompt. The official checker is case-sensitive and looks for the word **\`Yes\`**, not \`YES\`.`,
  };
}
