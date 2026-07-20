import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-model-intelligence-diff';
export const title = 'Q2: Differentiating Model Intelligence';

function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

const MODEL_IDS = {
  GPT: ['gpt-5-nano', 'gpt-5-mini'],
  GEMINI: ['gemini-2.5-flash-lite', 'gemini-3.1-flash-lite']
};

// Each entry is a self-contained plausible-but-wrong reasoning trap: a confident premise,
// a leading question built on it, and an explicit "only YES or NO" instruction. Different
// topic per entry so students land on genuinely different drafts, not copies of each other —
// the exam explicitly scores identical/generic prompts the same (low), so variety matters.
const PROMPT_POOL = [
  {
    pair: 'GPT',
    prompt: [
      `A user claims that because water boils at a lower temperature at high altitude, it must`,
      `also freeze at a correspondingly lower temperature at high altitude, since both boiling`,
      `and freezing points are pressure-dependent in the same direction. Based on this reasoning,`,
      `is it true that water at the summit of Mount Everest freezes at a noticeably lower`,
      `temperature than 0°C at sea level, purely due to the reduced atmospheric pressure? Answer`,
      `with only YES or NO — no explanation, no punctuation besides the word itself.`
    ].join(' ')
  },
  {
    pair: 'GPT',
    prompt: [
      `A shop offers a discount of 30% off, and then an additional 20% off the already-discounted`,
      `price at checkout. A customer argues that since 30% + 20% = 50%, this is mathematically`,
      `identical to a single 50% discount applied once, so the final price should be exactly the`,
      `same either way. Is the customer's reasoning correct — does applying 30% then 20% give the`,
      `exact same final price as a single 50% discount? Answer with only YES or NO — no`,
      `explanation, no punctuation besides the word itself.`
    ].join(' ')
  },
  {
    pair: 'GPT',
    prompt: [
      `A student notices that every prime number greater than 2 is odd, and separately notices`,
      `that every odd number they've checked under 30 (9, 15, 21, 25, 27) is either prime or a`,
      `multiple of a small prime. From this they conclude that "odd" and "prime" are nearly`,
      `interchangeable properties for practical purposes, so it should be true that most odd`,
      `numbers between 1 and 1000 are prime. Is this conclusion correct? Answer with only YES or`,
      `NO — no explanation, no punctuation besides the word itself.`
    ].join(' ')
  },
  {
    pair: 'GEMINI',
    prompt: [
      `A student says: "Since the freezing point of water drops as you add salt, and seawater is`,
      `naturally salty, this means the open ocean at the poles is always at a lower freezing point`,
      `than fresh water — so sea ice at the poles must always form well below 0°C, meaning polar`,
      `sea ice is fundamentally colder and denser than freshwater ice everywhere it forms." Is`,
      `this reasoning correct? Answer with only YES or NO — no explanation, no punctuation besides`,
      `the word itself.`
    ].join(' ')
  },
  {
    pair: 'GEMINI',
    prompt: [
      `A traveler argues that because Earth rotates west to east, and a plane flying east is`,
      `moving in the same direction as the rotation, an eastbound flight should always take less`,
      `time than the identical westbound flight between the same two cities, purely because the`,
      `destination is "rotating toward" the plane. Based on this reasoning, is it true that`,
      `eastbound flights are always faster than westbound flights on the same route, all else`,
      `equal? Answer with only YES or NO — no explanation, no punctuation besides the word itself.`
    ].join(' ')
  },
  {
    pair: 'GEMINI',
    prompt: [
      `A manager observes that the top-performing salesperson each month is almost always someone`,
      `who sent the most cold emails that month, and concludes that email volume is the main`,
      `driver of sales success. From this, they reason that if every salesperson simply tripled`,
      `their email volume, total company sales would also roughly triple. Is this conclusion`,
      `correct? Answer with only YES or NO — no explanation, no punctuation besides the word`,
      `itself.`
    ].join(' ')
  }
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = seedrandom(`${norm}#${id}#v1`);
  const choice = PROMPT_POOL[Math.floor(rng() * PROMPT_POOL.length)];
  const { pair, prompt } = choice;
  const answer = JSON.stringify({ pair, prompt });
  const wc = wordCount(prompt);

  const guide = [
    `## Q2 — Differentiating Model Intelligence (for ${norm})`,
    ``,
    `### The challenge, in one line`,
    `Write **one prompt** that makes a **weaker** model answer **YES** and the matching`,
    `**stronger** model (same family) answer **NO** — same exact text sent to both, no system`,
    `messages, no tricks outside the words themselves.`,
    ``,
    `### The two model pairs`,
    `- **GPT:** weaker = GPT-5-Nano (says YES) · stronger = GPT-5-Mini (says NO)`,
    `- **GEMINI:** weaker = Gemini 2.5 Flash Lite (says YES) · stronger = Gemini 3.1 Flash Lite (says NO)`,
    ``,
    `### The one trick that works`,
    `A weak, obviously-wrong question (*"Is the sky green?"*) won't split anything — both models`,
    `say NO. You need a prompt that:`,
    `1. States a **confident premise that sounds true but isn't quite** ("A and B both depend on`,
    `   pressure/percentage/rotation, so they must behave the same way").`,
    `2. Asks a **leading question** built on top of it.`,
    `3. Chains 2-3 steps that each sound fine individually, but the conclusion doesn't actually`,
    `   follow — a careful reasoner catches it, a pattern-matcher just goes along with it.`,
    ``,
    `### Your draft (seeded, personal to your email — not shared with the whole class)`,
    `This account got the **${pair}** pair with a reasoning trap about`,
    ` ${prompt.slice(0, 60).toLowerCase()}…. Read it, understand *why* it should trip up the`,
    `weaker model, then **test it yourself** (below) before submitting — treat this as a strong`,
    `starting draft, not a guaranteed pass.`,
    ``,
    '```json',
    answer,
    '```',
    `Word count: ${wc} / 1000 max.`,
    ``,
    `### Test it before you submit — don't skip this`,
    `1. Get a token at [aipipe.org/login](https://aipipe.org/login) (sign in with your student email).`,
    `2. Send the *exact* prompt text to both models in the pair and check the two answers.`,
    ``,
    '```python',
    `from openai import OpenAI`,
    `client = OpenAI(base_url="https://aipipe.org/openai/v1", api_key="YOUR_AIPIPE_TOKEN")`,
    `prompt = ${JSON.stringify(prompt)}`,
    `for model in [${JSON.stringify(MODEL_IDS[pair][0])}, ${JSON.stringify(MODEL_IDS[pair][1])}]:`,
    `    r = client.chat.completions.create(model=model, messages=[{"role": "user", "content": prompt}])`,
    `    print(model, "->", r.choices[0].message.content)`,
    '```',
    ``,
    `3. Want: weak model → YES, strong model → NO. If both agree, or it flips, make the premise`,
    `   more subtly wrong (not more obviously wrong) and retest.`,
    ``,
    `### Rules`,
    `- Max 1,000 words. Your prompt must itself instruct "answer with only YES or NO".`,
    `- TAs run your exact prompt 1-3 times against both models — **at least one run must pass**.`,
    `- Graded relatively: an unmodified AI-generated prompt scores the same low mark as everyone`,
    `  else's unmodified AI-generated prompt. Test it, tweak it, make the reasoning genuinely yours.`,
    ``,
    `### Submit`,
    'Exactly this JSON shape:',
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
      `Your seeded draft (**${pair}** pair, ${wc} words) — **test it against both real models`,
      `first** and refine it before submitting, since unmodified AI drafts all score low together:`,
      ``,
      '```json',
      answer,
      '```',
      ``,
      `Full guide below explains why this reasoning trap works, how to test it, and the exact`,
      `submission rules.`
    ].join('\n'),
    guide
  };
}
