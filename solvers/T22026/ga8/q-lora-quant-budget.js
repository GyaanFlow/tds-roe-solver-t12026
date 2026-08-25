// Solver: GA8 Q8 -- Per-Layer QLoRA Adapter Synthesis & Parameter Audit
// Computes exact trainable parameters and safetensors file size.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import seedrandom from './seedrandom.js';

export const id = 'q-lora-quant-budget-server';
export const title = 'Q8: Per-Layer QLoRA Adapter Synthesis & Parameter Audit';

const CE_HIDDEN = [2048, 3072, 4096];
const ME_TARGETS = [
  ['q_proj', 'v_proj'],
  ['q_proj', 'k_proj', 'v_proj', 'o_proj'],
  ['q_proj', 'v_proj', 'gate_proj', 'up_proj'],
  ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj']
];
const RE_RANKS = [4, 8, 16, 32];

/**
 * Compute trainable parameters and safetensors file size from a parsed JSON config.
 */
export function computeLoraBudgetFromConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new Error('Invalid configuration: expected an object.');
  }

  const base_config = config.base_config || {};
  const hidden_size = Number(base_config.hidden_size) || 2048;
  const intermediate_size = Number(base_config.intermediate_size) || (4 * hidden_size);
  const layers = Array.isArray(config.layers) ? config.layers : [];

  let total_trainable_params = 0;

  for (const layer of layers) {
    if (!layer || layer.freeze === true) continue;
    const target_modules = Array.isArray(layer.target_modules) ? layer.target_modules : [];
    if (target_modules.length === 0) continue;
    const lora_rank = Number(layer.lora_rank) || 0;
    if (lora_rank <= 0) continue;

    for (const mod of target_modules) {
      if (['q_proj', 'k_proj', 'v_proj', 'o_proj'].includes(mod)) {
        // Self-Attention Projections: Linear(hidden_size -> hidden_size)
        // lora_A (r * hidden_size) + lora_B (hidden_size * r) = 2 * r * hidden_size
        total_trainable_params += 2 * lora_rank * hidden_size;
      } else if (['gate_proj', 'up_proj', 'down_proj'].includes(mod)) {
        // MLP Projections:
        // gate_proj/up_proj: Linear(hidden_size -> intermediate_size) => r * (hidden_size + intermediate_size)
        // down_proj: Linear(intermediate_size -> hidden_size) => r * (intermediate_size + hidden_size)
        total_trainable_params += lora_rank * (hidden_size + intermediate_size);
      } else {
        // Fallback for any standard square projection
        total_trainable_params += 2 * lora_rank * hidden_size;
      }
    }
  }

  const adapter_file_size_bytes = total_trainable_params * 4;

  return {
    trainable_params: total_trainable_params,
    adapter_file_size_bytes
  };
}

/**
 * Generate synthetic config from student email using deterministic PRNG.
 */
export function generateLoraConfig(email) {
  const clean = String(email || '').trim();
  const seed = `${clean}#q-lora-quant-budget-server`;
  const rng = seedrandom(seed);

  const hidden_size = CE_HIDDEN[Math.floor(rng() * CE_HIDDEN.length)];
  const num_hidden_layers = 24 + Math.floor(rng() * 9);
  const intermediate_size = 4 * hidden_size;
  const num_attention_heads = hidden_size / 64;
  const vocab_size = 32000;

  const base_config = {
    model_type: 'llama',
    hidden_size,
    num_hidden_layers,
    num_attention_heads,
    intermediate_size,
    vocab_size
  };

  const layers = [];
  for (let n = 0; n < num_hidden_layers; n++) {
    if (rng() < 0.25) {
      layers.push({
        layer_idx: n,
        freeze: true,
        target_modules: [],
        lora_rank: 0,
        lora_alpha: 0
      });
    } else {
      const target_modules = ME_TARGETS[Math.floor(rng() * ME_TARGETS.length)];
      const lora_rank = RE_RANKS[Math.floor(rng() * RE_RANKS.length)];
      const lora_alpha = lora_rank * 2;
      layers.push({
        layer_idx: n,
        freeze: false,
        target_modules,
        lora_rank,
        lora_alpha
      });
    }
  }

  return { base_config, layers };
}

/**
 * Parse input which may be:
 * - A JSON string with {base_config, layers}
 * - A base64 data URI
 * - A JavaScript object
 * - An email address
 */
export function parseOrGenerateLoraConfig(input) {
  if (!input) return generateLoraConfig('');

  if (typeof input === 'object' && input.base_config && Array.isArray(input.layers)) {
    return input;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (trimmed.startsWith('data:')) {
      try {
        const base64 = trimmed.split(',')[1];
        const jsonStr = typeof atob === 'function' ?
          decodeURIComponent(escape(atob(base64))) :
          Buffer.from(base64, 'base64').toString('utf-8');
        const parsed = JSON.parse(jsonStr);
        if (parsed.base_config && Array.isArray(parsed.layers)) return parsed;
      } catch {}
    }

    if (trimmed.startsWith('{') && trimmed.includes('base_config')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed.base_config && Array.isArray(parsed.layers)) return parsed;
      } catch {}
    }

    return generateLoraConfig(trimmed);
  }

  return generateLoraConfig(String(input));
}

export async function solve(input) {
  const config = parseOrGenerateLoraConfig(input);
  const result = computeLoraBudgetFromConfig(config);
  const answer = JSON.stringify(result, null, 2);

  const displayUser = typeof input === 'string' && !input.startsWith('{') && !input.startsWith('data:') ?
    input.trim() : 'custom artifact';

  const guide = [
    `## Q8 -- LoRA Parameter & Safetensors Size (for ${displayUser})`,
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

  const displaySummary = [
    `### ✅ Calculated LoRA Parameters:`,
    `- **Trainable Parameters**: \`${result.trainable_params.toLocaleString()}\``,
    `- **Safetensors File Size**: \`${result.adapter_file_size_bytes.toLocaleString()} bytes\` (~${(result.adapter_file_size_bytes / (1024 * 1024)).toFixed(2)} MB)`,
    ``,
    '```json',
    answer,
    '```'
  ].join('\n');

  return {
    answer,
    type: 'solved',
    variant: `LoRA Budget Calculator (${result.trainable_params.toLocaleString()} params)`,
    answerDisplay: displaySummary,
    guide,
    debug: { ...result, isLive: true }
  };
}
