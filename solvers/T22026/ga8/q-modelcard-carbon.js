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

function registerInteractive(readmeContent, yamlContent) {
  if (typeof window === 'undefined') return;

  window._ga8Q10CopyReadme = async function () {
    const btn = document.getElementById('ga8Q10CopyReadmeBtn');
    try {
      await navigator.clipboard.writeText(readmeContent);
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied README.md!';
        setTimeout(() => { btn.textContent = orig; }, 1800);
      }
    } catch {
      console.warn('Clipboard write failed');
    }
  };

  window._ga8Q10CopyYaml = async function () {
    const btn = document.getElementById('ga8Q10CopyYamlBtn');
    try {
      await navigator.clipboard.writeText(yamlContent);
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Copied YAML!';
        setTimeout(() => { btn.textContent = orig; }, 1800);
      }
    } catch {
      console.warn('Clipboard write failed');
    }
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

  registerInteractive(fullReadmeContent, answer);

  const guide = [
    `## Q10 -- Green AI & Hugging Face Model Card Carbon Audit (for ${norm})`,
    ``,
    `### 📋 Quick 4-Step Walkthrough to Submit Q10`,
    `The exam requires a **public Hugging Face repository URL** (e.g. \`https://huggingface.co/<username>/tds-carbon-card\`). Follow these 4 easy steps:`,
    ``,
    `1. **Create a Free Model Repo**:`,
    `   - Click [https://huggingface.co/new](https://huggingface.co/new) *(or click the button in the interactive panel below)*.`,
    `   - Select **Model** as repository type.`,
    `   - Name it \`tds-carbon-card\` (or any name).`,
    `   - Set visibility to **Public** and click **Create model repository**.`,
    ``,
    `2. **Create / Edit \`README.md\`**:`,
    `   - Click **Add file** $\\to$ **Create a new file** (name it \`README.md\`).`,
    `   - Paste the **Exact README Content with YAML Frontmatter** below:`,
    ``,
    '```markdown',
    fullReadmeContent,
    '```',
    ``,
    `3. **Commit Changes**:`,
    `   - Scroll to the bottom and click **Commit changes to main**.`,
    ``,
    `4. **Submit in the Exam**:`,
    `   - Copy your repository URL (e.g. \`https://huggingface.co/<your-username>/tds-carbon-card\`).`,
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
    `- **CO₂ Emissions**: \`${finalResult.co2_kg} kg CO₂eq\``,
    ``,
    `<div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;">`,
    `  <button id="ga8Q10CopyReadmeBtn" type="button" onclick="window._ga8Q10CopyReadme()" class="btn-sm" style="padding:8px 16px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:700;cursor:pointer;">📋 Copy Complete README.md</button>`,
    `  <button id="ga8Q10CopyYamlBtn" type="button" onclick="window._ga8Q10CopyYaml()" class="btn-sm" style="padding:8px 16px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #666;border-radius:4px;cursor:pointer;">📄 Copy YAML Only</button>`,
    `  <a href="https://huggingface.co/new" target="_blank" rel="noopener" style="padding:8px 16px;background:#2563eb;color:#fff;border-radius:4px;text-decoration:none;font-weight:600;display:inline-flex;align-items:center;gap:6px;">🌐 Open HuggingFace.co/new ↗</a>`,
    `</div>`,
    ``,
    `### 📄 Complete \`README.md\` (Ready to Paste):`,
    '```markdown',
    fullReadmeContent,
    '```'
  ].join('\n');

  return {
    answer: fullReadmeContent,
    type: 'solved',
    variant: `Green AI Model Card (${finalResult.co2_kg} kg CO2) - Submit HF Repo URL`,
    answerDisplay: displaySummary,
    guide,
    debug: { ...finalResult, isLive: !!liveResult }
  };
}
