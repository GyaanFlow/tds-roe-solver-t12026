import { normalizeEmail } from './utils.js';

export const id = 'q-proof-of-work-server';
export const title = 'Q10: Proof-of-Work Nonce Hunt';

function leadingZeroBits(digest) {
  let bits = 0;
  for (let i = 0; i < digest.length; i++) {
    if (digest[i] === 0) {
      bits += 8;
    } else {
      let b = digest[i];
      while (b < 128) { bits++; b <<= 1; }
      break;
    }
  }
  return bits;
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
  let preMinedNonce = null;
  let preMinedTime = null;
  let isInputProvided = false;

  if (sessionToken && sessionToken.includes('|')) {
    const parts = sessionToken.split('|');
    token = parts[0].trim();
    difficulty = parseInt(parts[1], 10);
    
    if (parts.length >= 3) {
      preMinedNonce = parts[2].trim();
      preMinedTime = parts.length >= 4 ? parts[3].trim() : 'pre-computed';
    }
    
    if (token && !isNaN(difficulty)) {
      isInputProvided = true;
    }
  }

  if (isInputProvided) {
    try {
      let nonce, time;
      if (preMinedNonce !== null) {
        nonce = preMinedNonce;
        time = preMinedTime;
      } else {
        // Fallback for automated environment tests (check.mjs)
        const result = await mineNonce(token, difficulty);
        nonce = result.nonce;
        time = result.time;
      }

      const timeLabel = time === 'pre-computed' ? 'externally' : time === 'colab' ? 'via Colab' : `in ${time}s`;
      const outputMsg = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.4); padding: 12px; border-radius: 8px; color: var(--text-primary); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
          <span style="color: #34d399; font-weight: bold;">Success:</span> Nonce mined ${timeLabel}!
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
${nonce}
\`\`\`
      `.trim();

      return {
        type: 'solved',
        answer: String(nonce),
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
    // Return config input form with both options
    const statusAlert = `
      <div style="background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.4); padding: 12px; border-radius: 8px; color: var(--text-primary); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
        <span style="color: #fbbf24; font-weight: bold;">Mining Required:</span> Paste your Token and Difficulty below, then choose a mining method.
      </div>
    `.trim();

    const htmlContent = `
### Q10: Proof-of-Work Nonce Hunt

${statusAlert}

<details open class="panel-section" style="margin-bottom: 16px; border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; background: rgba(255, 255, 255, 0.01);">
  <summary style="cursor: pointer; font-size: 13px; font-weight: 600; color: var(--theme-primary); outline: none; user-select: none;">⚡ Browser Miner — Built-in (~15-60s at diff 26)</summary>
  <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;" class="heist-card-panel">
    <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
      Mines in your browser using all CPU cores. No setup needed — just click start.
    </p>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <label style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">YOUR TOKEN</label>
      <input type="text" id="pow-token-input" placeholder="Paste token from exam page" style="width: 100%; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <label style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">REQUIRED DIFFICULTY (ZERO BITS)</label>
      <input type="number" id="pow-difficulty-input" placeholder="Enter difficulty from exam" style="width: 100%; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
      <div id="pow-estimate" style="font-size: 11px; color: var(--text-muted); min-height: 16px; margin-top: 2px;"></div>
    </div>
    <button id="pow-mine-btn" style="background: var(--theme-primary); color: #000; border: none; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px var(--theme-glow); transition: transform 0.2s; align-self: flex-start; margin-top: 4px;">Start Mining Nonce</button>
  </div>
</details>

<details class="panel-section" style="margin-bottom: 16px; border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; background: rgba(255, 255, 255, 0.01);">
  <summary style="cursor: pointer; font-size: 13px; font-weight: 600; color: var(--theme-primary); outline: none; user-select: none;">🚀 Colab Miner — Faster (~2-10s at diff 26)</summary>
  <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;" class="heist-card-panel">
    <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
      Python's native hashlib is 10-20x faster than browser crypto. Generate a script, paste it into a
      <a href="https://colab.research.google.com/" target="_blank" rel="noopener" style="color: var(--theme-primary);">Google Colab</a>
      cell, run it, then paste the nonce back here.
    </p>
    <button id="gen-colab-script-btn" style="background: transparent; color: var(--theme-primary); border: 1px solid var(--theme-primary); padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; align-self: flex-start;">Generate Colab Script</button>
    <div id="colab-script-area" style="display: none;">
      <textarea id="colab-script-output" readonly style="width: 100%; height: 260px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 10px 14px; border-radius: 6px; font-size: 11px; font-family: monospace; outline: none; box-sizing: border-box; resize: vertical;"></textarea>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="copy-colab-script-btn" style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border); padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">Copy Script</button>
      </div>
      <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px; flex-wrap: wrap;">
        <input type="text" id="colab-nonce-input" placeholder="Paste nonce from Colab output" style="flex: 1; min-width: 180px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
        <button id="submit-colab-nonce-btn" style="background: var(--theme-primary); color: #000; border: none; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px var(--theme-glow);">Use This Nonce</button>
      </div>
    </div>
  </div>
</details>
    `.trim();

    return {
      type: 'guide',
      answer: 'Enter your Token and Difficulty, then pick a mining method.',
      variant: 'No token configured',
      answerDisplay: htmlContent
    };
  }
}
