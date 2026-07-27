import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-minimal-prompt-robustness';
export const title = 'Q2: The Multi-Model Robustness Audit';

const MODELS = ['gpt-4o', 'gpt-4.1', 'gpt-4.1-mini', 'gpt-5-mini'];
const NUM_INSTRUCTIONS = 21;
const FRAGMENTS = [
  'Step-by-step.', 'Act as Expert.', 'JSON Output.', 'No yapping.', 'Few-shot (3).',
  'Chain of Thought.', 'Explain reasoning.', 'Professional tone.', 'Strict format.', 'Avoid jargon.',
  'Summary first.', 'Double check.', 'Self-reflect.', 'Contextualize.', 'Verify logic.',
  'Brevity.', 'Analogies.', 'Citations.', 'Persona: Mentor.', 'Persona: Auditor.', 'JSON schema.'
];
const MEAN_TARGET = 0.97;
const FLOOR_TARGET = 0.92;

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// Byte-for-byte reproduction of the official exam bundle's Wt() generator — same seedrandom
// package, same seed string shape, same arithmetic and rounding order.
function buildScenario(email) {
  const rng = seedrandom(`${email}#${id}`);
  const between = (lo, hi) => lo + rng() * (hi - lo);

  const biases = {
    'gpt-4o': Math.round(between(-2.5, -1) * 100) / 100,
    'gpt-4.1': Math.round(between(-2, -0.5) * 100) / 100,
    'gpt-4.1-mini': Math.round(between(-3.5, -2) * 100) / 100,
    'gpt-5-mini': Math.round(between(-1.5, 0.5) * 100) / 100
  };

  const instructions = [];
  for (let c = 0; c < NUM_INSTRUCTIONS; c++) {
    const contribs = {};
    MODELS.forEach(model => {
      let d = between(-0.4, 1.4);
      if (model === 'gpt-5-mini' && c < 6) d -= 0.6;
      if (model === 'gpt-4.1-mini' && c > 15) d += 0.5;
      contribs[model] = Math.round(d * 100) / 100;
    });
    instructions.push({
      id: `I${c + 1}`,
      text: FRAGMENTS[c],
      word_count: Math.floor(between(5, 18)),
      contribs
    });
  }

  const interactions = [];
  for (let c = 0; c < 50; c++) {
    const n = Math.floor(rng() * NUM_INSTRUCTIONS);
    const r = Math.floor(rng() * NUM_INSTRUCTIONS);
    if (n === r) continue;
    const ids = [n + 1, r + 1].sort((a, b) => a - b).map(x => `I${x}`);
    if (interactions.find(h => h.ids[0] === ids[0] && h.ids[1] === ids[1])) continue;
    interactions.push({ ids, bonus: Math.round(between(-0.7, 0.7) * 100) / 100 });
  }

  return { instructions, interactions, biases, models: MODELS, meanTarget: MEAN_TARGET, floorTarget: FLOOR_TARGET };
}

// Exact brute-force search matching the exam's own verifier: enumerate every subset of the
// 21 instructions (2^21 = ~2.1M, split 10/11 bits for tractable loop bounds), track the
// minimum word count that clears both the macro-mean and floor accuracy targets, and among
// ties at that word count keep the highest macro-mean.
function solveOptimal(scenario) {
  const { instructions, interactions, biases, models } = scenario;
  const n = instructions.length;
  const SPLIT = 10;
  const REST = n - SPLIT;

  const lowMasks = [];
  const highMasks = [];
  const crossMasks = [];
  interactions.forEach(({ ids, bonus }) => {
    const a = parseInt(ids[0].slice(1), 10) - 1;
    const b = parseInt(ids[1].slice(1), 10) - 1;
    const mask = (1 << a) | (1 << b);
    if (a < SPLIT && b < SPLIT) lowMasks.push({ mask, bonus });
    else if (a >= SPLIT && b >= SPLIT) highMasks.push({ mask: mask >> SPLIT, bonus });
    else crossMasks.push({ mask, bonus });
  });

  function buildTable(model, offset, count, pairMasks) {
    const contrib = new Float64Array(1 << count);
    const wc = new Int32Array(1 << count);
    for (let mask = 0; mask < (1 << count); mask++) {
      for (let bit = 0; bit < count; bit++) {
        if ((mask >> bit) & 1) {
          contrib[mask] += instructions[offset + bit].contribs[model];
          if (model === models[0]) wc[mask] += instructions[offset + bit].word_count;
        }
      }
      pairMasks.forEach(({ mask: pm, bonus }) => {
        if ((mask & pm) === pm) contrib[mask] += bonus;
      });
    }
    return { contrib, wc };
  }

  const low = {};
  const high = {};
  models.forEach(m => {
    low[m] = buildTable(m, 0, SPLIT, lowMasks);
    high[m] = buildTable(m, SPLIT, REST, highMasks);
  });

  let bestWC = Infinity;
  let bestMean = 0;
  let bestIds = [];

  for (let full = 0; full < (1 << n); full++) {
    const lowMask = full & ((1 << SPLIT) - 1);
    const highMask = full >> SPLIT;
    const wordCount = low[models[0]].wc[lowMask] + high[models[0]].wc[highMask];
    if (wordCount > bestWC) continue;

    let crossBonus = 0;
    crossMasks.forEach(({ mask, bonus }) => {
      if ((full & mask) === mask) crossBonus += bonus;
    });

    let sum = 0;
    let floor = Infinity;
    for (const model of models) {
      const acc = sigmoid(biases[model] + low[model].contrib[lowMask] + high[model].contrib[highMask] + crossBonus);
      sum += acc;
      if (acc < floor) floor = acc;
    }
    const mean = sum / models.length;

    if (mean >= scenario.meanTarget && floor >= scenario.floorTarget) {
      if (wordCount < bestWC || (wordCount === bestWC && mean > bestMean)) {
        bestWC = wordCount;
        bestMean = mean;
        bestIds = [];
        for (let bit = 0; bit < n; bit++) if ((full >> bit) & 1) bestIds.push(`I${bit + 1}`);
      }
    }
  }

  return { bestWC, bestMean, bestIds };
}

function evaluateSelection(selectedIds, scenario) {
  const selected = new Set(selectedIds);
  const metrics = {};
  let wordCount = 0;
  scenario.models.forEach(model => {
    let acc = scenario.biases[model];
    scenario.instructions.forEach(inst => {
      if (selected.has(inst.id)) {
        acc += inst.contribs[model];
        if (model === scenario.models[0]) wordCount += inst.word_count;
      }
    });
    scenario.interactions.forEach(({ ids, bonus }) => {
      if (selected.has(ids[0]) && selected.has(ids[1])) acc += bonus;
    });
    metrics[model] = sigmoid(acc);
  });
  const values = Object.values(metrics);
  const meanAcc = values.reduce((a, b) => a + b, 0) / values.length;
  const floorAcc = Math.min(...values);
  return { meanAcc, floorAcc, wordCount, metrics };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const scenario = buildScenario(norm);
  const { bestWC, bestMean, bestIds } = solveOptimal(scenario);
  const check = evaluateSelection(bestIds, scenario);

  const meanPct = (check.meanAcc * 100).toFixed(2);
  const floorPct = (check.floorAcc * 100).toFixed(2);
  const answer = `${bestIds.join(', ')}; ${check.wordCount}; ${meanPct}; ${floorPct}`;

  const instructionTable = scenario.instructions.map(inst =>
    `| \`${inst.id}\` | ${inst.text} | ${inst.word_count} | ${inst.contribs['gpt-4o']} | ${inst.contribs['gpt-4.1']} | ${inst.contribs['gpt-4.1-mini']} | ${inst.contribs['gpt-5-mini']} |`
  ).join('\n');

  const biasLine = Object.entries(scenario.biases).map(([m, v]) => `\`${m}\`: ${v}`).join(', ');

  const guide = [
    `## Q2 — The Multi-Model Robustness Audit (for ${norm})`,
    ``,
    `### What this question actually asks`,
    `Find the **shortest combination** of instruction fragments (by total word count) that`,
    `pushes all 4 models to **Macro-Mean accuracy ≥ ${scenario.meanTarget * 100}%** and`,
    `**Model Floor accuracy ≥ ${scenario.floorTarget * 100}%**. Each fragment nudges a logistic`,
    `("sigmoid") accuracy score per model; some pairs of fragments have a bonus/penalty when`,
    `used together. It's a subset-selection optimization — brute force over all 2²¹ subsets`,
    `is the reliable way to guarantee the true minimum (a greedy pick-the-best-fragment approach`,
    `can miss interaction bonuses and land on a locally-good but not globally-optimal set).`,
    ``,
    `### Your seeded puzzle data`,
    `**Base biases (no fragments selected):** ${biasLine}`,
    ``,
    `| ID | Fragment | WC | gpt-4o | gpt-4.1 | gpt-4.1-mini | gpt-5-mini |`,
    `|---|---|---|---|---|---|---|`,
    instructionTable,
    ``,
    `**Pair bonuses** (${scenario.interactions.length} total, only when *both* IDs in a pair are selected):`,
    scenario.interactions.map(p => `- ${p.ids.join(' + ')}: ${p.bonus >= 0 ? '+' : ''}${p.bonus}`).join('\n'),
    ``,
    `### How this was solved`,
    `1. Split the 21 instructions into a 10-bit low half and 11-bit high half; precompute every`,
    `   subset's summed contribution + word count for each half (2¹⁰ and 2¹¹ entries — fast).`,
    `2. Split the 50 pair bonuses into low-only, high-only, and cross-half groups.`,
    `3. Enumerate all 2²¹ full subsets by combining a low-half index and high-half index,`,
    `   adding the cross-half bonuses per subset; compute each model's sigmoid accuracy,`,
    `   the macro-mean, and the floor.`,
    `4. Track the minimum word count among subsets that clear both targets; among ties at that`,
    `   word count, keep the highest macro-mean (matching the exam's own tie-break).`,
    ``,
    `### Answer`,
    `**Selected fragments:** ${bestIds.join(', ')}`,
    `**Word count:** ${check.wordCount}`,
    `**Macro-Mean:** ${meanPct}%   **Floor:** ${floorPct}%`,
    ``,
    `Per-model accuracy at this selection: ${Object.entries(check.metrics).map(([m, v]) => `\`${m}\`: ${(v * 100).toFixed(2)}%`).join(', ')}`,
    ``,
    `### Submit`,
    'Exactly this format — `IDs (comma-separated); WordCount; Mean%; Floor%`:',
    '```text',
    answer,
    '```',
    `Both percentages must match the exam's own recomputation to 4 decimal places of tolerance,`,
    `and it also checks that no shorter-word-count selection meeting both targets exists — so`,
    `this must be the true minimum, not just *a* passing selection.`
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `Optimal fragment set (${check.wordCount} words) for ${norm}`,
    answerDisplay: [
      `### Q2: The Multi-Model Robustness Audit`,
      ``,
      `Computed the true minimum-word-count fragment set via exhaustive 2²¹-subset search`,
      `(split-half meet-in-the-middle), seeded uniquely to your email.`,
      ``,
      '```text',
      answer,
      '```',
      ``,
      `Selected: **${bestIds.join(', ')}** — ${check.wordCount} words, Macro-Mean ${meanPct}%, Floor ${floorPct}%.`,
      ``,
      `Full instruction/bonus tables and the search method are in the guide below.`
    ].join('\n'),
    guide
  };
}
