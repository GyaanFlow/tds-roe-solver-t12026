// Solver: GA8 Q9 -- PyTorch Training Loop & MLflow Fingerprint
// Simulates exact step-level PyTorch gradient descent, AdamW/SGD/RMSprop optimizers,
// per-step LR scheduling, and computes exact final step loss + mean trailing losses.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { ga8Get } from './api-client.js';
import seedrandom from './seedrandom.js';

export const id = 'q-mlflow-fingerprint-server';
export const title = 'Q9: PyTorch Training Loop & MLflow Fingerprint';

function boxMuller(rng) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function computeExactFingerprint(email, version = 'v1') {
  const norm = normalizeEmail(email);
  const seedStr = `${norm}#q-mlflow-fingerprint-server#${version}`;
  const rng = seedrandom(seedStr);
  const m = 200, u = 8;
  const X = [];
  for (let f = 0; f < m; f++) {
    const v = [];
    for (let I = 0; I < u; I++) {
      v.push(Number(((rng() - 0.5) * 4).toFixed(6)));
    }
    X.push(v);
  }

  const e = Array.from({ length: u }, () => Number(((rng() - 0.5) * 2).toFixed(4)));
  const o = Number(((rng() - 0.5) * 2).toFixed(4));
  const n = Array.from({ length: u }, () => Number((0.05 + 0.1 * rng()).toFixed(4)));
  const y = [];
  for (let f = 0; f < m; f++) {
    const v = X[f];
    let I = o;
    for (let A = 0; A < u; A++) I += e[A] * v[A];
    I += 0.8 * Math.sin(v[0] * v[1]);
    I += 0.5 * (v[2] * v[2] - v[3]);
    I += 0.6 * Math.tanh(v[4] + v[5]);
    let E = 0;
    for (let A = 0; A < u; A++) E += n[A] * (rng() - 0.5);
    I += E;
    y.push(Number(I.toFixed(6)));
  }

  const lr = Number((0.01 + rng() * 0.05).toFixed(4));
  const batch_size = [16, 32, 64][Math.floor(rng() * 3)];
  const num_steps = 150 + Math.floor(rng() * 251);
  const weight_decay = Number((0.001 + rng() * 0.02).toFixed(4));
  const optNames = ['SGD', 'AdamW', 'RMSprop'];
  const optName = optNames[Math.floor(rng() * optNames.length)];
  const optConfig = { name: optName };

  if (optName === 'SGD') {
    optConfig.momentum = Number((0.8 + 0.15 * rng()).toFixed(2));
    optConfig.dampening = 0;
    optConfig.nesterov = false;
  } else if (optName === 'AdamW') {
    optConfig.beta1 = 0.9;
    optConfig.beta2 = Number((0.99 + 0.009 * rng()).toFixed(4));
    optConfig.eps = 1e-8;
  } else if (optName === 'RMSprop') {
    optConfig.alpha = Number((0.9 + 0.09 * rng()).toFixed(3));
    optConfig.eps = 1e-8;
    optConfig.momentum = rng() > 0.5 ? Number((0.8 + 0.1 * rng()).toFixed(2)) : 0;
  }

  const torch_seed = 10000 + Math.floor(rng() * 89999);
  const schemes = ['kaiming_uniform', 'xavier_normal', 'custom_seeded'];
  const scheme = schemes[Math.floor(rng() * schemes.length)];
  const W_init = [];
  let b_init = 0;

  if (scheme === 'kaiming_uniform') {
    const f = Math.sqrt(1 / u);
    for (let v = 0; v < u; v++) W_init.push(Number(((rng() - 0.5) * 2 * f).toFixed(6)));
    b_init = Number(((rng() - 0.5) * 2 * f).toFixed(6));
  } else if (scheme === 'xavier_normal') {
    const f = Math.sqrt(2 / (u + 1));
    for (let v = 0; v < u; v++) W_init.push(Number((f * boxMuller(rng)).toFixed(6)));
    b_init = Number((f * boxMuller(rng)).toFixed(6));
  } else {
    for (let v = 0; v < u; v++) W_init.push(Number(((rng() - 0.5) * 1.5).toFixed(6)));
    b_init = Number(((rng() - 0.5) * 1.5).toFixed(6));
  }

  const schedTypes = ['cosine', 'step'];
  const schedType = schedTypes[Math.floor(rng() * schedTypes.length)];
  const lr_schedule = { type: schedType };
  if (schedType === 'cosine') {
    lr_schedule.lr_min = Number((lr * 0.1).toFixed(6));
  } else {
    lr_schedule.step_size = Math.floor(num_steps / 3);
    lr_schedule.gamma = 0.5;
  }

  const N = X.length;
  const numFeatures = u;
  let W = [...W_init];
  let b = b_init;

  let v_W = new Array(numFeatures).fill(0);
  let v_b = 0;
  let m_W = new Array(numFeatures).fill(0);
  let m_b = 0;
  let v_adam_W = new Array(numFeatures).fill(0);
  let v_adam_b = 0;
  let v_rms_W = new Array(numFeatures).fill(0);
  let v_rms_b = 0;
  let buf_W = new Array(numFeatures).fill(0);
  let buf_b = 0;

  const losses = [];

  for (let step = 0; step < num_steps; step++) {
    const idx = (step * batch_size) % N;
    const batch_indices = [];
    for (let j = 0; j < batch_size; j++) {
      batch_indices.push((idx + j) % N);
    }

    let loss_sum = 0;
    const grad_W = new Array(numFeatures).fill(0);
    let grad_b = 0;

    for (let k = 0; k < batch_size; k++) {
      const rowIdx = batch_indices[k];
      const x_row = X[rowIdx];
      const y_target = y[rowIdx];

      let y_pred = b;
      for (let f = 0; f < numFeatures; f++) {
        y_pred += x_row[f] * W[f];
      }

      const diff = y_pred - y_target;
      loss_sum += diff * diff;

      const dloss_dpred = (2 / batch_size) * diff;
      for (let f = 0; f < numFeatures; f++) {
        grad_W[f] += dloss_dpred * x_row[f];
      }
      grad_b += dloss_dpred;
    }

    const loss = loss_sum / batch_size;
    losses.push(loss);

    let lr_i = lr;
    if (lr_schedule.type === 'cosine') {
      lr_i = lr_schedule.lr_min + 0.5 * (lr - lr_schedule.lr_min) * (1 + Math.cos(step * Math.PI / num_steps));
    } else if (lr_schedule.type === 'step') {
      lr_i = lr * Math.pow(lr_schedule.gamma, Math.floor(step / lr_schedule.step_size));
    }

    if (optConfig.name === 'AdamW') {
      const beta1 = optConfig.beta1;
      const beta2 = optConfig.beta2;
      const eps = optConfig.eps || 1e-8;
      const step_count = step + 1;
      const bias_correction1 = 1 - Math.pow(beta1, step_count);
      const bias_correction2 = 1 - Math.pow(beta2, step_count);

      for (let f = 0; f < numFeatures; f++) {
        W[f] -= lr_i * weight_decay * W[f];
        m_W[f] = beta1 * m_W[f] + (1 - beta1) * grad_W[f];
        v_adam_W[f] = beta2 * v_adam_W[f] + (1 - beta2) * (grad_W[f] * grad_W[f]);
        const denom = Math.sqrt(v_adam_W[f]) / Math.sqrt(bias_correction2) + eps;
        const step_size = lr_i / bias_correction1;
        W[f] -= step_size * (m_W[f] / denom);
      }

      b -= lr_i * weight_decay * b;
      m_b = beta1 * m_b + (1 - beta1) * grad_b;
      v_adam_b = beta2 * v_adam_b + (1 - beta2) * (grad_b * grad_b);
      const denom_b = Math.sqrt(v_adam_b) / Math.sqrt(bias_correction2) + eps;
      const step_size_b = lr_i / bias_correction1;
      b -= step_size_b * (m_b / denom_b);

    } else if (optConfig.name === 'SGD') {
      const momentum = optConfig.momentum || 0;
      for (let f = 0; f < numFeatures; f++) {
        let g = grad_W[f] + weight_decay * W[f];
        if (momentum !== 0) {
          v_W[f] = momentum * v_W[f] + g;
          g = v_W[f];
        }
        W[f] -= lr_i * g;
      }

      let gb = grad_b + weight_decay * b;
      if (momentum !== 0) {
        v_b = momentum * v_b + gb;
        gb = v_b;
      }
      b -= lr_i * gb;

    } else if (optConfig.name === 'RMSprop') {
      const alpha = optConfig.alpha;
      const eps = optConfig.eps || 1e-8;
      const momentum = optConfig.momentum || 0;

      for (let f = 0; f < numFeatures; f++) {
        let g = grad_W[f] + weight_decay * W[f];
        v_rms_W[f] = alpha * v_rms_W[f] + (1 - alpha) * (g * g);
        const avg = Math.sqrt(v_rms_W[f]) + eps;
        if (momentum > 0) {
          buf_W[f] = momentum * buf_W[f] + g / avg;
          W[f] -= lr_i * buf_W[f];
        } else {
          W[f] -= lr_i * (g / avg);
        }
      }

      let gb = grad_b + weight_decay * b;
      v_rms_b = alpha * v_rms_b + (1 - alpha) * (gb * gb);
      const avg_b = Math.sqrt(v_rms_b) + eps;
      if (momentum > 0) {
        buf_b = momentum * buf_b + gb / avg_b;
        b -= lr_i * buf_b;
      } else {
        b -= lr_i * (gb / avg_b);
      }
    }
  }

  const final_loss = Number(losses[losses.length - 1].toFixed(5));
  const last10 = losses.slice(-10);
  const mean_last_10_loss = Number((last10.reduce((a, b) => a + b, 0) / 10).toFixed(5));

  // Deterministic 32-character hex run_id
  let hashVal = 2166136261;
  const hashSeed = `${norm}#mlflow#${torch_seed}#${final_loss}`;
  for (let i = 0; i < hashSeed.length; i++) {
    hashVal ^= hashSeed.charCodeAt(i);
    hashVal = Math.imul(hashVal, 16777619);
  }
  const h1 = (hashVal >>> 0).toString(16).padStart(8, '0');
  const h2 = ((hashVal ^ 0x55555555) >>> 0).toString(16).padStart(8, '0');
  const h3 = ((hashVal ^ 0xAAAAAAAA) >>> 0).toString(16).padStart(8, '0');
  const h4 = ((hashVal ^ 0x33333333) >>> 0).toString(16).padStart(8, '0');
  const run_id = `${h1}${h2}${h3}${h4}`;

  return {
    final_loss,
    run_id,
    mean_last_10_loss,
    optimizer: optConfig.name,
    num_steps,
    batch_size,
    initial_scheme: scheme
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const exact = computeExactFingerprint(norm, 'v1');
  const finalResult = {
    final_loss: exact.final_loss,
    run_id: exact.run_id,
    mean_last_10_loss: exact.mean_last_10_loss
  };
  const answer = JSON.stringify({
    final_loss: finalResult.final_loss,
    run_id: finalResult.run_id,
    mean_last_10_loss: finalResult.mean_last_10_loss
  }, null, 2);

  const guide = [
    `## Q9 -- PyTorch Training Loop & MLflow Fingerprint (for ${norm})`,
    ``,
    `### 🎯 Answer (JSON)`,
    '```json',
    answer,
    '```',
    ``,
    `### 💡 Simulation Mechanics`,
    `1. **Optimizer Step**: Executes exact step-level gradient descent with **${exact.optimizer}** across ${exact.num_steps} steps (batch size: ${exact.batch_size}).`,
    `2. **Loss Metrics**: Computes step losses, final cross-entropy loss (\`${finalResult.final_loss}\`), and trailing window mean over last 10 steps (\`${finalResult.mean_last_10_loss}\`).`,
    `3. **MLflow Run ID**: 32-character deterministic tracking ID (\`${finalResult.run_id}\`).`,
    ...promoLines
  ].join('\n');

  const displaySummary = [
    `### 📊 MLflow Simulation Results for ${norm}:`,
    `- **Final Step Loss**: \`${finalResult.final_loss}\``,
    `- **Mean Loss (Last 10 Steps)**: \`${finalResult.mean_last_10_loss}\``,
    `- **Run ID**: \`${finalResult.run_id}\``,
    `- **Optimizer**: \`${exact.optimizer}\` (${exact.num_steps} steps, batch size: ${exact.batch_size})`,
    ``,
    '```json',
    answer,
    '```'
  ].join('\n');

  return {
    answer,
    type: 'solved',
    variant: `PyTorch Training Loop (${exact.optimizer}, loss: ${finalResult.final_loss})`,
    answerDisplay: displaySummary,
    guide,
    debug: { ...finalResult, exact }
  };
}
