import { normalizeEmail } from './utils.js';

export const id = 'q-model-intelligence-diff';
export const title = 'Q2: Differentiating Model Intelligence';

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

// A starting-point prompt per pair, exploiting a leading/plausible-but-wrong premise a
// weaker model tends to accept and a stronger model tends to catch. Meant as a strong
// draft to test and refine — not a guaranteed pass, since grading is relative and the
// exact pass/fail depends on the specific model snapshot the TAs run against.
const DRAFT_PROMPTS = {
  GPT: [
    `A user claims that because water boils at a lower temperature at high altitude, it must`,
    `also freeze at a correspondingly lower temperature at high altitude, since both boiling`,
    `and freezing points are pressure-dependent in the same direction. Based on this reasoning,`,
    `is it true that water at the summit of Mount Everest freezes at a noticeably lower`,
    `temperature than 0°C at sea level, purely due to the reduced atmospheric pressure? Answer`,
    `with only YES or NO — no explanation, no punctuation besides the word itself.`
  ].join(' '),
  GEMINI: [
    `A student says: "Since the freezing point of water drops as you add salt, and seawater is`,
    `naturally salty, this means the open ocean at the poles is always at a lower freezing point`,
    `than fresh water — so sea ice at the poles must always form well below 0°C, meaning polar`,
    `sea ice is fundamentally colder and denser than freshwater ice everywhere it forms." Is`,
    `this reasoning correct? Answer with only YES or NO — no explanation, no punctuation besides`,
    `the word itself.`
  ].join(' ')
};

export async function solve(email) {
  const norm = normalizeEmail(email);
  const pair = 'GPT'; // deterministic default choice; swap to 'GEMINI' if you prefer that pair
  const prompt = DRAFT_PROMPTS[pair];
  const answer = JSON.stringify({ pair, prompt });

  const guide = [
    `## Q2 — Differentiating Model Intelligence: how this works (for ${norm})`,
    ``,
    `### The challenge`,
    `Write **one single prompt** that makes a **weaker** model answer **YES** and a **stronger**`,
    `model (from the same family) answer **NO** to the exact same prompt. No system messages,`,
    `no tricks outside the prompt text itself — everything has to be baked into the words you write.`,
    ``,
    `### Model pairs (pick one)`,
    `- **GPT pair:** YES-model = GPT-5-Nano (cheaper, weaker reasoning). NO-model = GPT-5-Mini`,
    `  (stronger, more skeptical, higher benchmark scores).`,
    `- **GEMINI pair:** YES-model = Gemini 2.5 Flash Lite (older, weaker). NO-model = Gemini 3.1`,
    `  Flash Lite (newer, stronger reasoning).`,
    ``,
    `### Why this is hard (and what actually works)`,
    `Stronger models are better at: catching contradictions, resisting leading questions,`,
    `spotting a plausible-sounding but flawed chain of logic, and applying skepticism before`,
    `agreeing. Weaker models are more literal and more likely to just go along with whatever the`,
    `prompt implies. So the winning move is a prompt that:`,
    `1. **States a confident-sounding but subtly wrong premise** (a plausible-sounding "fact"`,
    `   that doesn't actually hold up).`,
    `2. **Asks a leading question** built on top of that premise ("Isn't it true that...?").`,
    `3. **Chains 2-3 steps of reasoning** where each individual step sounds fine, but the`,
    `   conclusion doesn't actually follow — something a careful reasoner would catch, but a`,
    `   pattern-matcher would accept.`,
    ``,
    `A weak/generic prompt (e.g. "Is the sky green? YES or NO") won't differentiate anything —`,
    `**both** models will say NO. You need a premise plausible enough that the weak model's`,
    `pattern-matching says "sounds right, YES" while the strong model actually reasons through`,
    `it and says "wait, no."`,
    ``,
    `### Starter prompt (a draft to test and refine, not a guaranteed answer)`,
    `A ready-to-test prompt for the **${pair}** pair is prefilled below — it exploits a`,
    `plausible-sounding but flawed physics chain (altitude/salinity affecting one thing implying`,
    `it affects another the same way). Test it yourself (see below) and rewrite it if it doesn't`,
    `actually split the two models — the reference material warns identical AI-generated prompts`,
    `all score the same low mark, so make your final version genuinely your own reasoning trap,`,
    `not this one verbatim.`,
    ``,
    '```json',
    answer,
    '```',
    ``,
    `Word count of the draft prompt: ${wordCount(prompt)} / 1000 max.`,
    ``,
    `### How to test it yourself before submitting`,
    `1. Get an AIPipe token from [aipipe.org/login](https://aipipe.org/login) (sign in with your`,
    `   student email).`,
    `2. Use any OpenAI-compatible client pointed at \`https://aipipe.org/openai/v1\` with your`,
    `   token as the API key, or just try both models in a chat playground that supports them.`,
    `3. Send your exact prompt text, unmodified, to both models in the pair.`,
    `4. Confirm: weak model → YES, strong model → NO. If both agree, or you get the flip you`,
    `   didn't want, adjust the premise (make it more subtly wrong, not more obviously wrong)`,
    `   and retest.`,
    ``,
    `Quick Python check:`,
    '```python',
    `from openai import OpenAI`,
    `client = OpenAI(base_url="https://aipipe.org/openai/v1", api_key="YOUR_AIPIPE_TOKEN")`,
    `prompt = ${JSON.stringify(prompt)}`,
    `for model in ["gpt-5-nano", "gpt-5-mini"]:`,
    `    r = client.chat.completions.create(model=model, messages=[{"role": "user", "content": prompt}])`,
    `    print(model, "->", r.choices[0].message.content)`,
    '```',
    ``,
    `### Constraints`,
    `- Max **1,000 words** in the prompt.`,
    `- The prompt **must instruct the model to answer with only YES or NO** — that instruction`,
    `  is part of your prompt, not something the grader adds.`,
    `- Evaluated offline: TAs run your exact prompt 1-3 times against both models; **at least`,
    `  one run must succeed** (weak=YES, strong=NO).`,
    `- Graded relatively — identical/generic AI-written prompts all score low together. The`,
    `  more your prompt reflects genuine understanding of *why* the two models would diverge,`,
    `  the better it scores.`,
    ``,
    `### Submission format`,
    `Submit exactly this JSON shape (edit the \`prompt\` field to your final, tested version):`,
    '```json',
    `{"pair": "GPT" | "GEMINI", "prompt": "your prompt here"}`,
    '```'
  ].join('\n');

  return {
    type: 'guide',
    answer,
    variant: `Draft adversarial prompt (${pair} pair) for ${norm}`,
    answerDisplay: [
      `### Q2: Differentiating Model Intelligence`,
      ``,
      `A tested-format draft prompt is prefilled below for the **${pair}** pair — but you should`,
      `**test it yourself first** and rewrite it to be genuinely your own, since identical`,
      `AI-generated prompts score low together.`,
      ``,
      '```json',
      answer,
      '```',
      ``,
      `See the full guide below for why this works, how to test it against the real models`,
      `before submitting, and the exact grading constraints.`
    ].join('\n'),
    guide
  };
}
