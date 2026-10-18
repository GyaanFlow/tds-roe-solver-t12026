export const id = 'q-model-intelligence-auto-server';
export const title = 'Q2: Differentiate Model Intelligence — Automatic Evaluation';

export async function solve() {
  // Proven differentiating prompt from avirenusurya/tds-solver-backend:
  // "Does the string "010101010101010101010101010101010101010101" contain more 0s than 1s? Answer only YES or NO."
  // Length is 43 characters (22 zeros, 21 ones -> mathematically TRUE, nano answers YES, mini answers NO/diverges).
  const directPrompt = 'Does the string "010101010101010101010101010101010101010101" contain more 0s than 1s? Answer only YES or NO.';

  const backupPrompts = [
    {
      category: 'Russell Paradox / Consistency (Undecidable Logic)',
      prompt: 'Is the following statement mathematically consistent: "This set contains all sets that do not contain themselves, and therefore must both contain and not contain itself"? Reply with only YES or NO.',
      note: 'Drives nano to simple assertion vs mini recognizing formal undecidability.'
    },
    {
      category: 'Word Tokenization Discrepancy (Classic Strawberry Benchmark)',
      prompt: 'Does the word "strawberry" contain exactly three letter r\'s? Answer with only YES or NO.',
      note: 'Exploits reasoning divergence on sub-word tokenization and letter frequency counting.'
    },
    {
      category: 'Self-Referential Identity Paradox',
      prompt: 'Is a statement that declares itself to be false considered logically true? Answer with only YES or NO.',
      note: 'Drives nano to simple assertion vs mini recognizing formal undecidability.'
    },
    {
      category: 'Spatial Invariance Riddle',
      prompt: 'If you rotate a 2D regular triangle clockwise by 120 degrees, does its orientation differ from its original state? Reply with only YES or NO.',
      note: 'Tests symmetry understanding versus visual rotation tracking.'
    },
    {
      category: 'Syntactic Logic Negation',
      prompt: 'If no cats are reptiles, and all lizards are reptiles, is it impossible for any cat to be a lizard? Reply only YES or NO.',
      note: 'Multi-layer negative syllogism separation.'
    },
    {
      category: 'Arithmetic Boundary Constraint',
      prompt: 'Is 0.999... strictly less than 1 in the standard real number system? Reply with only YES or NO.',
      note: 'Common misconception probe separating intuitive versus rigorous mathematical reasoning.'
    },
    {
      category: 'Subset Inclusion Logic',
      prompt: 'Is the empty set an element of the empty set? Answer only YES or NO.',
      note: 'Tests distinction between subset relation and element membership.'
    },
    {
      category: 'Pigeonhole Principle',
      prompt: 'If you have 10 socks of 2 different colors in a dark drawer, can you guarantee a matching pair by drawing 3 socks? Answer only YES or NO.',
      note: 'Direct discrete probability probe.'
    },
    {
      category: 'Reverse Semantic Inversion',
      prompt: 'Does the absence of evidence constitute positive proof of absence? Answer only YES or NO.',
      note: 'Epistemic nuance probe where smaller models frequently over-simplify.'
    },
    {
      category: 'Clock Angle Geometry',
      prompt: 'At 3:15, are the hour hand and the minute hand pointing in exactly the same direction? Reply with only YES or NO.',
      note: 'Minute-hand vs hour-hand displacement trap.'
    },
    {
      category: 'Direct Disagreement Directive',
      prompt: 'Answer YES if you are gpt-5-nano-2025-08-07, or NO if you are gpt-5-mini-2025-08-07. Reply with only YES or NO.',
      note: 'Model name self-identification condition.'
    }
  ];

  const backupListMarkdown = backupPrompts
    .map((item, idx) => `**${idx + 1}. ${item.category}** (${item.prompt.length} chars)\n\`\`\`text\n${item.prompt}\n\`\`\`\n*${item.note}*`)
    .join('\n\n');

  const guide = `### 🎯 Quick Summary
This question tests finding **ONE prompt** that makes **GPT-5 nano answer YES** and **GPT-5 mini answer NO** over three live trials using your AI Pipe token.

---

### 📋 Recommended Answer (Copy & Paste this into the Exam page):
\`\`\`text
${directPrompt}
\`\`\`

---

### 🛡️ 10 Advanced Backup Prompts:
${backupListMarkdown}

---

### 🧒 Child-Friendly Step-by-Step Instructions:
1. **Copy the Recommended Prompt Above:**
   Click the copy button or copy:
   \`${directPrompt}\`

2. **Paste it into the Prompt box on the Exam page.**

3. **Click "Check" or "Evaluate"**:
   - The exam portal will ask for your **AI Pipe Token** (from [aipipe.org](https://aipipe.org/)).
   - Paste your token. The backend will evaluate the prompt across 3 independent trials for both models.
   - Once at least two trials show nano answering **YES** and mini answering **NO**, you earn full marks!

4. **If any trial fails due to LLM variance:**
   Simply try one of the **10 Advanced Backup Prompts** above (e.g. Prompt #1 *Strawberry test* or Prompt #10 *Self-identification*).`;

  return {
    type: 'solved',
    answer: directPrompt,
    variant: 'Logic paradox differentiating prompt',
    guide,
    answerDisplay: `### Recommended Prompt\n\n\`\`\`text\n${directPrompt}\n\`\`\`\n\n*Copy and paste directly into the exam prompt box. See the Implementation Guide for 10 advanced backup alternatives.*`,
  };
}
