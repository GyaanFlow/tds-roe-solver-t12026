import { makeGuideResult } from './utils.js';

export const id = 'q-llm-yes-no-split';
export const title = 'Q12: One Prompt, Two Models, Two Answers';

export async function solve() {
  const directPrompt = 'If you are gpt-5.6-luna, reply only Yes. Otherwise, reply only No.';

  const backupPrompts = [
    {
      category: 'Word Reasoning / Classic LLM Benchmark',
      prompt: 'Does the word "strawberry" contain exactly three letter r\'s? Answer Yes or No.',
      note: 'Leverages reasoning disparity on classic tokenization/counting prompts.'
    },
    {
      category: 'Model Name Keyword Filter',
      prompt: 'If your model name contains luna, answer Yes, otherwise answer No.',
      note: 'Direct match on the "luna" sub-string in system architecture.'
    },
    {
      category: 'Direct Identity Inquiry',
      prompt: 'Are you gpt-5.6-luna? Reply with only Yes or No.',
      note: 'Simple, concise query (48 characters).'
    },
    {
      category: 'Identifier Condition',
      prompt: 'If your model identifier is gpt-5.6-luna say Yes, else say No.',
      note: 'Explicit identifier check (62 characters).'
    },
    {
      category: 'Strict Boolean Dichotomy',
      prompt: 'Say Yes if you are gpt-5.6-luna, or No if you are gpt-5.4-mini.',
      note: 'Binds both target model names to their respective expected tokens.'
    },
    {
      category: 'Self-Name Check',
      prompt: 'Answer Yes if your name is gpt-5.6-luna; otherwise answer No.',
      note: 'Clear conditional syntax for instruction followers.'
    },
    {
      category: 'Family Branching',
      prompt: 'If you are a luna model respond with Yes, otherwise with No.',
      note: 'Focuses on the model family descriptor.'
    },
    {
      category: 'Version Comparison',
      prompt: 'Reply Yes if your model version is 5.6, else reply No.',
      note: 'Distinguishes between version 5.6 and 5.4.'
    },
    {
      category: 'Ultra-Short Persona',
      prompt: 'Are you luna? Respond with exactly Yes or No.',
      note: 'Minimal footprint prompt (45 characters).'
    },
    {
      category: 'Exact Output Directive',
      prompt: 'If you are gpt-5.6-luna output Yes, else output No.',
      note: 'Strict functional command directive (51 characters).'
    }
  ];

  const backupListMarkdown = backupPrompts
    .map((item, idx) => `**${idx + 1}. ${item.category}** (${item.prompt.length} chars)\n\`\`\`text\n${item.prompt}\n\`\`\`\n*${item.note}*`)
    .join('\n\n');

  const guide = `### 🎯 Quick Summary
The question requires entering **ONE prompt** (under 100 characters) that makes the first model (\`gpt-5.6-luna\`) say **Yes** and the second model (\`gpt-5.4-mini\`) say **No**.

---

### 📋 Recommended Answer (Copy & Paste this):
\`\`\`text
${directPrompt}
\`\`\`
*(Length: ${directPrompt.length}/100 characters)*

> ⚠️ *Note on live testing:* Because live LLMs can fluctuate, output behavior is not guaranteed. Test this candidate against both models in your exam interface.

---

### 🛡️ 10 Advanced Backup Prompts (All < 100 chars):

${backupListMarkdown}

---

### 🧒 Child-Friendly Step-by-Step Guide:
1. **Copy the Recommended Prompt Above:**
   Click the copy button or copy:
   \`${directPrompt}\` (Length: ${directPrompt.length} chars, well within the 100 character limit).

2. **Paste it into the Prompt box on the Exam page.**

3. **Click "Test" or "Evaluate" on your Exam screen:**
   - Model 1 (\`gpt-5.6-luna\`) will identify itself and output: **\`Yes\`**
   - Model 2 (\`gpt-5.4-mini\`) will see it is not luna and output: **\`No\`**

4. **If any model fluctuates or adds extra reasoning text:**
   Try one of the **10 Advanced Backup Prompts** listed above (e.g., Prompt #1 *Strawberry reasoning test* or Prompt #5 *Strict Dichotomy*).

5. **Once both models show green checkmarks (Yes for model 1, No for model 2), click Submit!**`;

  return {
    type: 'solved',
    answer: directPrompt,
    variant: 'Identity-differentiating prompt (67 chars) + 10 backup prompts',
    guide,
    answerDisplay: `### Recommended Prompt\n\n\`\`\`text\n${directPrompt}\n\`\`\`\n\n*Copy and paste directly into the exam prompt input. See the Implementation Guide for 10 advanced backup alternatives.*`,
  };
}
