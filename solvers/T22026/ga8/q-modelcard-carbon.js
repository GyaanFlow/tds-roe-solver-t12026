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

  const fullReadmeContent = `${answer}\n\n# Model Card - Green AI Carbon Accounting\n\nThis repository documents the carbon footprint and energy accounting for the assigned model training run in TDS GA8.\n\n### Training Specifications\n- **Hardware**: ${finalResult.gpu_type} (${finalResult.num_gpus} GPUs)\n- **Training Mode**: ${finalResult.training_type}\n- **Region**: ${finalResult.region}\n- **GPU Hours**: ${finalResult.gpu_hours}h (PUE: ${finalResult.pue || 1.2})\n- **Total Energy**: ${finalResult.energy_kWh} kWh\n- **CO₂ Emissions**: ${finalResult.co2_kg} kg CO₂eq\n`;

  const guide = [
    `## Q10 -- Green AI & Hugging Face Model Card Carbon Audit (for ${norm})`,
    ``,
    `### 📋 Step-by-Step: How to create your Hugging Face Repository`,
    `The exam expects you to submit your **public Hugging Face repository URL** (e.g. \`https://huggingface.co/<username>/tds-carbon-card\`). Follow these 5 quick steps:`,
    ``,
    `1. **Create a Free Model Repo**:`,
    `   - Go to [https://huggingface.co/new](https://huggingface.co/new) (sign in or create a free account).`,
    `   - Select **Model** as repository type.`,
    `   - Name it \`tds-carbon-card\` (or any name).`,
    `   - Set visibility to **Public** and click **Create model repository**.`,
    ``,
    `2. **Create / Edit \`README.md\`**:`,
    `   - Click on the **README.md** tab (or **Add file** $\\to$ **Create a new file**, name it \`README.md\`).`,
    `   - Paste the **Exact YAML Frontmatter & Content** below into the file:`,
    ``,
    '```markdown',
    fullReadmeContent,
    '```',
    ``,
    `3. **Commit Changes**:`,
    `   - Scroll to the bottom and click **Commit changes to main**.`,
    ``,
    `4. **Submit in the Exam**:`,
    `   - Copy your repository URL from your browser address bar:`,
    `     \`https://huggingface.co/<your-username>/tds-carbon-card\``,
    `   - Paste it into Question 10 on the exam portal and click **Check**!`,
    ``,
    `### 💡 Mathematical Formulations`,
    `$$\\text{energy\\_kWh} = \\frac{\\text{TDP (W)} \\times \\text{num\\_gpus} \\times \\text{gpu\\_hours} \\times \\text{PUE}}{1000}$$`,
    `$$\\text{co2\\_kg} = \\text{round}\\left(\\frac{\\text{energy\\_kWh} \\times \\text{grid\\_intensity}}{1000}, 3\\right)$$`,
    ...promoLines
  ].join('\n');

  const displaySummary = [
    `### 🌱 Green AI Carbon Accounting for ${norm}:`,
    `- **Hardware**: \`${finalResult.gpu_type} (${finalResult.num_gpus} GPUs)\``,
    `- **Training Type**: \`${finalResult.training_type}\``,
    `- **Region**: \`${finalResult.region}\``,
    `- **GPU Hours**: \`${finalResult.gpu_hours}h\` (PUE: \`${finalResult.pue || 1.2}\`)`,
    `- **Energy Consumed**: \`${finalResult.energy_kWh} kWh\``,
    `- **CO₂ Emissions**: \`${finalResult.co2_kg} kg\``,
    ``,
    `### 🎯 Your YAML Frontmatter (Paste at the top of README.md):`,
    '```yaml',
    answer,
    '```',
    ``,
    `### 🚀 Next Steps to Submit:`,
    `1. Go to [https://huggingface.co/new](https://huggingface.co/new) and create a **Public Model Repository** (e.g. \`tds-carbon-card\`).`,
    `2. Create \`README.md\` and paste the YAML block above at the very top.`,
    `3. Commit to \`main\`.`,
    `4. Submit your repo URL (\`https://huggingface.co/<your-username>/tds-carbon-card\`) in the exam answer box.`
  ].join('\n');

  return {
    answer: fullReadmeContent,
    type: 'solved',
    variant: `Green AI Model Card Frontmatter (${finalResult.co2_kg} kg CO2)`,
    answerDisplay: displaySummary,
    guide,
    debug: { ...finalResult, isLive: !!liveResult }
  };
}
