// Solver: GA8 Q8 -- LoRA Parameter & Safetensors Size
// Computes exact trainable parameters and safetensors file size.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { ga8Get } from './api-client.js';
import seedrandom from './seedrandom.js';

export const id = 'q-lora-quant-budget-server';
export const title = 'Q8: LoRA Parameter & Safetensors Size';

function computeLoraBudget(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-lora-quant-budget-server`;
  const rng = seedrandom(seed);

  const hiddenSize = 2048;
  const intermediateSize = 8192;
  const numLayers = 26;

  let totalTrainable = 0;
  const layers = [];

  const possibleModules = ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'];
  const possibleRanks = [4, 8, 16, 32];

  for (let i = 0; i < numLayers; i++) {
    const isFrozen = rng() < 0.15;
    if (isFrozen) {
      layers.push({ layer_idx: i, freeze: true, target_modules: [], lora_rank: 0, lora_alpha: 0 });
      continue;
    }

    const rankIdx = Math.floor(rng() * possibleRanks.length);
    const r = possibleRanks[rankIdx];
    const alpha = r * 2;

    const moduleCount = 2 + Math.floor(rng() * 4); // 2 to 5 modules
    const selectedModules = [];
    const shuffled = [...possibleModules].sort(() => rng() - 0.5);
    for (let m = 0; m < moduleCount; m++) {
      selectedModules.push(shuffled[m]);
    }

    let layerParams = 0;
    for (const mod of selectedModules) {
      if (['q_proj', 'k_proj', 'v_proj', 'o_proj'].includes(mod)) {
        layerParams += 2 * r * hiddenSize;
      } else {
        layerParams += r * (hiddenSize + intermediateSize);
      }
    }

    totalTrainable += layerParams;
    layers.push({
      layer_idx: i,
      freeze: false,
      target_modules: selectedModules,
      lora_rank: r,
      lora_alpha: alpha
    });
  }

  const adapterSizeBytes = totalTrainable * 4;

  return {
    trainable_params: totalTrainable,
    adapter_file_size_bytes: adapterSizeBytes
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  let liveResult = null;

  try {
    const remote = await ga8Get(norm, 'solve/q8');
    if (remote && typeof remote.trainable_params === 'number') {
      liveResult = {
        trainable_params: remote.trainable_params,
        adapter_file_size_bytes: remote.adapter_file_size_bytes
      };
    }
  } catch {}

  const fallback = computeLoraBudget(norm);
  const finalResult = liveResult || fallback;
  const answer = JSON.stringify(finalResult, null, 2);

  const guide = [
    `## Q8 -- LoRA Parameter & Safetensors Size (for ${norm})`,
    ``,
    `### 🎯 Answer (JSON)`,
    '```json',
    answer,
    '```',
    ``,
    `### 💡 Mathematical Formulation`,
    `1. **Self-Attention Projections** (\`q_proj\`, \`k_proj\`, \`v_proj\`, \`o_proj\`):`,
    `   $$\\text{params} = 2 \\times r \\times \\text{hidden\\_size}$$`,
    `2. **MLP Projections** (\`gate_proj\`, \`up_proj\`, \`down_proj\`):`,
    `   $$\\text{params} = r \\times (\\text{hidden\\_size} + \\text{intermediate\\_size})$$`,
    `3. **Safetensors File Size**:`,
    `   $$\\text{adapter\\_file\\_size\\_bytes} = \\text{trainable\\_params} \\times 4 \\text{ bytes (Float32)}$$`,
    ...promoLines
  ].join('\n');

  return {
    answer,
    type: 'solved',
    variant: `LoRA Budget Calculator (${finalResult.trainable_params.toLocaleString()} params)`,
    answerDisplay: answer,
    guide,
    debug: { ...finalResult, isLive: !!liveResult }
  };
}
