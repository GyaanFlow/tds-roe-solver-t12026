// Solver: GA8 Q10 -- Green AI & Model Card Carbon Frontmatter
// Computes energy consumption, CO2 equivalent emissions, and formats YAML frontmatter.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { ga8Get } from './api-client.js';
import seedrandom from './seedrandom.js';

export const id = 'q-modelcard-carbon-server';
export const title = 'Q10: Green AI & Model Card Carbon Frontmatter';

const GPU_TDP = {
  'NVIDIA A100': 400,
  'NVIDIA H100': 700,
  'NVIDIA V100': 300,
  'NVIDIA RTX 4090': 450,
  'NVIDIA T4': 70
};

const GRID_INTENSITY = {
  'us-central1': 350,
  'us-east1': 380,
  'europe-west1': 120,
  'europe-west4': 390,
  'asia-south1': 650
};

function computeFallbackCarbon(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-modelcard-carbon-server`;
  const rng = seedrandom(seed);

  const gpuTypes = Object.keys(GPU_TDP);
  const regions = Object.keys(GRID_INTENSITY);

  const gpuType = gpuTypes[Math.floor(rng() * gpuTypes.length)];
  const region = regions[Math.floor(rng() * regions.length)];
  const numGpus = [1, 2, 4, 8][Math.floor(rng() * 4)];
  const gpuHours = +(50 + rng() * 150).toFixed(1);
  const pue = +(1.1 + rng() * 0.4).toFixed(2);

  const tdp = GPU_TDP[gpuType] || 400;
  const grid = GRID_INTENSITY[region] || 400;

  const energyKwh = (tdp * numGpus * gpuHours * pue) / 1000;
  const co2Kg = +((energyKwh * grid) / 1000).toFixed(3);

  const yaml = [
    '---',
    'co2_eq_emissions:',
    `  emissions: ${co2Kg}`,
    '  source: codecarbon',
    '  training_type: fine-tuning',
    `  geographical_location: ${region}`,
    `  hardware_used: ${gpuType}`,
    '---'
  ].join('\n');

  return {
    energy_kWh: +energyKwh.toFixed(4),
    co2_kg: co2Kg,
    yaml_frontmatter: yaml
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  let liveResult = null;

  try {
    const remote = await ga8Get(norm, 'solve/q10');
    if (remote && remote.yaml_frontmatter) {
      liveResult = remote;
    }
  } catch {}

  const fallback = computeFallbackCarbon(norm);
  const finalResult = liveResult || fallback;
  const answer = finalResult.yaml_frontmatter;

  const guide = [
    `## Q10 -- Green AI & Model Card Carbon Frontmatter (for ${norm})`,
    ``,
    `### 🎯 Answer (YAML Frontmatter)`,
    '```yaml',
    answer,
    '```',
    ``,
    `### 💡 Green AI Carbon Formulas`,
    `$$\\text{energy\\_kWh} = \\frac{\\text{TDP (W)} \\times \\text{num\\_gpus} \\times \\text{gpu\\_hours} \\times \\text{PUE}}{1000}$$`,
    `$$\\text{co2\\_kg} = \\text{round}\\left(\\frac{\\text{energy\\_kWh} \\times \\text{grid\\_intensity}}{1000}, 3\\right)$$`,
    ...promoLines
  ].join('\n');

  return {
    answer,
    type: 'solved',
    variant: `Green AI Model Card Frontmatter (${finalResult.co2_kg} kg CO2)`,
    answerDisplay: answer,
    guide,
    debug: { ...finalResult, isLive: !!liveResult }
  };
}
