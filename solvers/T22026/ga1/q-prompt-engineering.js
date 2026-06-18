// Solver: Q17 — Prompt Engineering (PromptOps JSON response)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-prompt-engineering';
export const title = 'Q17: Prompt Engineering (PromptOps)';

const TASK_TYPES = [
  {
    task: 'Classify customer support tickets by urgency and category',
    failingPrompt: 'Classify this ticket: {ticket_text}',
    testInput: 'My account has been locked and I cannot access any of my data. This is urgent!'
  },
  {
    task: 'Extract structured data from product reviews',
    failingPrompt: 'Get info from this review: {review}',
    testInput: 'Amazing laptop! Battery lasts 12 hours. Keyboard feels great. Only issue is the fan noise.'
  },
  {
    task: 'Summarize meeting transcripts and extract action items',
    failingPrompt: 'Summarize: {transcript}',
    testInput: 'John said we need to finish the report by Friday. Sarah will handle the client presentation.'
  },
  {
    task: 'Detect sentiment and key topics in social media posts',
    failingPrompt: 'Analyze this post: {post}',
    testInput: 'Absolutely loving the new features! The dark mode is perfect. Though the loading could be faster.'
  }
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-prompt-engineering`);

  const taskData = TASK_TYPES[Math.floor(r() * TASK_TYPES.length)];

  const response = {
    problems: [
      `Problem 1: The prompt doesn't specify the output format, leading to inconsistent responses. Without a schema or example, the AI produces free-form text that can't be parsed programmatically.`,
      `Problem 2: No examples provided. The AI has no reference for what "correct" output looks like, causing it to guess at the structure and content.`,
      `Problem 3: The prompt doesn't handle edge cases (missing fields, ambiguous input, multiple interpretations). This leads to failures or hallucinations when input is incomplete.`,
      `Problem 4: The task description is too vague. '${taskData.failingPrompt.replace(/{[^}]+}/g, '[...]')}' doesn't specify what fields to extract, what format to use, or what to do with uncertainty.`
    ],
    improvedPrompt: `You are a precise data extraction assistant. Your task: ${taskData.task}.

INPUT:
\`\`\`
{input_text}
\`\`\`

OUTPUT REQUIREMENTS:
- Respond with ONLY valid JSON, no markdown, no explanation
- Use exactly this schema:

{
  "result": <your main extracted/classified value>,
  "confidence": <"high" | "medium" | "low">,
  "reasoning": <one sentence explaining your decision>,
  "metadata": {
    "word_count": <number of words in input>,
    "language": <detected language code, e.g. "en">
  }
}

RULES:
1. If input is empty or unintelligible, set result to null and confidence to "low"
2. Do not add fields not in the schema above
3. Do not include markdown fences in your response
4. Always populate all fields

EXAMPLE:
Input: "${taskData.testInput.slice(0, 50)}..."
Output: {"result": <appropriate value>, "confidence": "high", "reasoning": "Clear indicators present.", "metadata": {"word_count": 15, "language": "en"}}`,
    improvements: [
      `Added explicit JSON schema specification so output is always structured and parseable — eliminates format inconsistency.`,
      `Included a concrete example showing the exact input → output mapping, giving the model a reference pattern.`,
      `Added explicit handling for edge cases (empty/unintelligible input) with fallback values to prevent hallucinations.`,
      `Specified that ONLY valid JSON should be returned (no markdown fences, no explanation) to prevent extra output that breaks parsing.`
    ]
  };

  const guide = [
    `### What the exam asks`,
    ``,
    `Identify at least 3 problems with a failing prompt, write an improved version, and list at least 3 improvements.`,
    `The response must be valid JSON with this structure:`,
    ``,
    `\`\`\`json`,
    `{`,
    `  "problems": ["Problem 1: ...", "Problem 2: ...", "Problem 3: ..."],`,
    `  "improvedPrompt": "Your detailed improved prompt here...",`,
    `  "improvements": ["Improvement 1: ...", "Improvement 2: ...", "Improvement 3: ..."]`,
    `}`,
    `\`\`\``,
    ``,
    `### Prompt Engineering Principles`,
    ``,
    `1. **Specify output format explicitly** — JSON schema, fields, types`,
    `2. **Provide examples** — at least one concrete input → output pair`,
    `3. **Handle edge cases** — empty input, ambiguous data, errors`,
    `4. **Be specific about constraints** — what NOT to include, character limits`,
    `5. **Add context** — why this task matters, what "correct" looks like`,
    ``,
    `### Your estimated task`,
    ``,
    `Task: **${taskData.task}**`,
    ``,
    `> **Note**: The actual task in your exam may differ. Adapt the improved prompt to match your exam's specific task.`,
  ].join('\n');

  const answerJson = JSON.stringify(response, null, 2);

  return {
    type: 'solved',
    variant: 'Estimated prompt engineering response — adapt to your exam\'s specific task',
    answer: answerJson,
    guide,
    answerDisplay: [
      `### Q17: Prompt Engineering`,
      ``,
      `The answer box contains a JSON response with:`,
      `- **4 problems** identified with the failing prompt`,
      `- **Improved prompt** with explicit JSON schema, examples, and edge case handling`,
      `- **4 improvements** explained`,
      ``,
      `**Estimated task:** ${taskData.task}`,
      ``,
      `> ⚠️ Read your exam's actual failing prompt and test input, then adapt the improved prompt if needed.`,
    ].join('\n'),
  };
}
