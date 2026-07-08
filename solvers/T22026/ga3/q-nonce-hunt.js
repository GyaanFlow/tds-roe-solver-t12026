import { normalizeEmail } from './utils.js';

export const id = 'q-proof-of-work-server';
export const title = 'Q10: Proof-of-Work Nonce Hunt';

function leadingZeroBits(digest) {
  for (let i = 0; i < digest.length; i++) {
    if (digest[i] === 0) continue;
    return i * 8 + (8 - digest[i].toString(2).padStart(8, '0').indexOf('1'));
  }
  return digest.length * 8;
}

async function mineNonce(token, difficulty) {
  const enc = new TextEncoder();
  let nonce = 0;
  const start = Date.now();
  while (true) {
    const data = enc.encode(`${token}:${nonce}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hash);
    if (leadingZeroBits(bytes) >= difficulty) {
      return { nonce, time: ((Date.now() - start) / 1000).toFixed(1) };
    }
    nonce++;
    if (nonce % 100000 === 0) await new Promise(r => setTimeout(r, 0));
  }
}

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);

  let token = '';
  let difficulty = 26;
  let isInputProvided = false;

  if (sessionToken && sessionToken.includes('|')) {
    const parts = sessionToken.split('|');
    token = parts[0].trim();
    difficulty = parseInt(parts[1], 10);
    if (token && !isNaN(difficulty)) {
      isInputProvided = true;
    }
  }

  if (isInputProvided) {
    try {
      const result = await mineNonce(token, difficulty);
      const outputMsg = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.4); padding: 12px; border-radius: 8px; color: var(--text-primary); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
          <span style="color: #34d399; font-weight: bold;">Success:</span> Nonce mined successfully in ${result.time} seconds!
        </div>
      `.trim();

      const htmlContent = `
### Q10: Proof-of-Work Nonce Hunt

${outputMsg}

<details open class="panel-section" style="margin-bottom: 16px; border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; background: rgba(255, 255, 255, 0.01);">
  <summary style="cursor: pointer; font-size: 13px; font-weight: 600; color: var(--theme-primary); outline: none; user-select: none;">📄 Mining Config</summary>
  <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;" class="heist-card-panel">
    <div style="font-size: 12px; color: var(--text-secondary);">Mined for Token: <code style="color: var(--theme-primary); font-weight: bold;">${token}</code> at difficulty <code style="color: var(--theme-primary); font-weight: bold;">${difficulty}</code></div>
    <div style="display: flex; gap: 8px;">
      <button id="pow-clear-btn" style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 8px 18px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Reset Miner</button>
    </div>
  </div>
</details>

#### Mined Nonce Answer
\`\`\`text
${result.nonce}
\`\`\`
      `.trim();

      return {
        type: 'solved',
        answer: String(result.nonce),
        variant: `POW nonce for ${norm}`,
        answerDisplay: htmlContent
      };
    } catch (e) {
      return {
        type: 'error',
        answer: '',
        variant: 'Mining failed',
        answerDisplay: `Error mining: ${e.message}`
      };
    }
  } else {
    // Return config input form
    const statusAlert = `
      <div style="background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.4); padding: 12px; border-radius: 8px; color: var(--text-primary); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
        <span style="color: #fbbf24; font-weight: bold;">Mining Required:</span> Paste your Token and Difficulty below to start mining in your browser.
      </div>
    `.trim();

    const htmlContent = `
### Q10: Proof-of-Work Nonce Hunt

${statusAlert}

<details open class="panel-section" style="margin-bottom: 16px; border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; background: rgba(255, 255, 255, 0.01);">
  <summary style="cursor: pointer; font-size: 13px; font-weight: 600; color: var(--theme-primary); outline: none; user-select: none;">📄 Browser Auto-Miner Configuration</summary>
  <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;" class="heist-card-panel">
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <label style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">YOUR TOKEN</label>
      <input type="text" id="pow-token-input" placeholder="e.g. 03f96129a8f5ce79" style="width: 100%; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <label style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">REQUIRED DIFFICULTY (ZERO BITS)</label>
      <input type="number" id="pow-difficulty-input" placeholder="e.g. 26" value="26" style="width: 100%; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
    </div>
    <button id="pow-mine-btn" style="background: var(--theme-primary); color: #000; border: none; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px var(--theme-glow); transition: transform 0.2s; align-self: flex-start; margin-top: 4px;">Start Mining Nonce</button>
  </div>
</details>
    `.trim();

    return {
      type: 'guide',
      answer: 'Please enter your Token and Difficulty in the card panel and click "Start Mining Nonce" to solve.',
      variant: 'No token configured',
      answerDisplay: htmlContent
    };
  }
}
