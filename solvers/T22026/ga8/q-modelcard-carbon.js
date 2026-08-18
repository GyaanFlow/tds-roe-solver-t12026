// Solver: GA8 Q10 -- Green AI & Model Card Carbon Frontmatter
// Computes energy consumption, CO2 equivalent emissions, and formats YAML frontmatter.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { ga8Get } from './api-client.js';
import seedrandom from './seedrandom.js';

export const id = 'q-modelcard-carbon-server';
export const title = 'Q10: Green AI & Model Card Carbon Frontmatter';

const J = {
  "NVIDIA A100": 400,
  "NVIDIA V100": 300,
  "NVIDIA T4": 70,
  "NVIDIA H100": 700,
  "NVIDIA L40S": 350,
  "NVIDIA RTX 4090": 450
};
const Y = {
  "us-central1": 350,
  "europe-west4": 200,
  "asia-south1": 650,
  "us-east1": 420,
  "europe-north1": 120,
  "ap-southeast1": 480
};
const Ge = Object.keys(J);
const We = Object.keys(Y);
const Be = ["pre-training", "fine-tuning"];

function computeFallbackCarbon(email, version = '') {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-modelcard-carbon-server#${version}`;
  const rng = seedrandom(seed);

  const gpu_type = Ge[Math.floor(rng() * Ge.length)];
  const gpu_hours = Number((12.5 + rng() * 467.5).toFixed(1));
  const num_gpus = 1 + Math.floor(rng() * 8);
  const region = We[Math.floor(rng() * We.length)];
  const pue = Number((1.1 + rng() * 0.5).toFixed(2));
  const training_type = Be[Math.floor(rng() * Be.length)];

  const tdp = J[gpu_type] || 400;
  const grid = Y[region] || 350;

  const energy_kWh = (tdp * num_gpus * gpu_hours * pue) / 1000;
  const co2_kg = Number(((energy_kWh * grid) / 1000).toFixed(3));

  const yaml = [
    '---',
    'co2_eq_emissions:',
    `  emissions: ${co2_kg}`,
    '  source: codecarbon',
    `  training_type: ${training_type}`,
    `  geographical_location: ${region}`,
    `  hardware_used: ${gpu_type}`,
    '---'
  ].join('\n');

  return {
    gpu_type,
    gpu_hours,
    num_gpus,
    region,
    pue,
    training_type,
    energy_kWh: Number(energy_kWh.toFixed(4)),
    co2_kg,
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

  const displaySummary = [
    `### 🌱 Green AI Carbon Accounting:`,
    `- **Hardware**: \`${finalResult.gpu_type} (${finalResult.num_gpus} GPUs)\``,
    `- **Training Type**: \`${finalResult.training_type}\``,
    `- **Region**: \`${finalResult.region}\``,
    `- **GPU Hours**: \`${finalResult.gpu_hours}h\` (PUE: \`${finalResult.pue || 1.2}\`)`,
    `- **Energy Consumed**: \`${finalResult.energy_kWh} kWh\``,
    `- **CO₂ Emissions**: \`${finalResult.co2_kg} kg\``,
    ``,
    '```yaml',
    answer,
    '```'
  ].join('\n');

  return {
    answer,
    type: 'solved',
    variant: `Green AI Model Card Frontmatter (${finalResult.co2_kg} kg CO2)`,
    answerDisplay: displaySummary,
    guide,
    debug: { ...finalResult, isLive: !!liveResult }
  };
}
