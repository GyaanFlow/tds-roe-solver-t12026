import { normalizeEmail } from './utils.js';

export const id = 'q-proof-of-work-server';
export const title = 'Q10: Proof-of-Work Nonce Hunt';

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
      if (preMinedNonce === null) {
        return {
          type: 'error',
          answer: '',
          variant: 'No nonce provided',
          answerDisplay: 'Only token and difficulty provided. Use the Colab script below to mine a nonce, then re-submit as `token|difficulty|nonce` or use the Colab submission button.'
        };
      }

      const timeLabel = preMinedTime === 'pre-computed' ? 'externally' : preMinedTime === 'colab' ? 'via Colab' : `in ${preMinedTime}s`;
      const outputMsg = `
        <div style="background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.4); padding: 12px; border-radius: 8px; color: var(--text-primary); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
          <span style="color: #34d399; font-weight: bold;">Success:</span> Nonce mined ${timeLabel}!
        </div>
      `.trim();

      const htmlContent = `
### Q10: Proof-of-Work Nonce Hunt

${outputMsg}

<details open class="panel-section" style="margin-bottom: 16px; border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; background: rgba(255, 255, 255, 0.01);">
  <summary style="cursor: pointer; font-size: 13px; font-weight: 600; color: var(--theme-primary); outline: none; user-select: none;">Mining Config</summary>
  <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px;" class="heist-card-panel">
    <div style="font-size: 12px; color: var(--text-secondary);">Token: <code style="color: var(--theme-primary); font-weight: bold;">${token}</code> at difficulty <code style="color: var(--theme-primary); font-weight: bold;">${difficulty}</code></div>
    <div style="display: flex; gap: 8px;">
      <button id="pow-clear-btn" style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border); border-radius: 6px; padding: 8px 18px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">Reset</button>
    </div>
  </div>
</details>

#### Mined Nonce Answer
\`\`\`text
${preMinedNonce}
\`\`\`
      `.trim();

      return {
        type: 'solved',
        answer: String(preMinedNonce),
        variant: `POW nonce for ${norm}`,
        answerDisplay: htmlContent
      };
    } catch (e) {
      return {
        type: 'error',
        answer: '',
        variant: 'Mining failed',
        answerDisplay: `Error: ${e.message}`
      };
    }
  } else {
    const statusAlert = `
      <div style="background: rgba(245, 158, 11, 0.08); border: 1px dashed rgba(245, 158, 11, 0.4); padding: 12px; border-radius: 8px; color: var(--text-primary); font-size: 13px; margin-bottom: 16px; line-height: 1.5;">
        <span style="color: #fbbf24; font-weight: bold;">Mining Required:</span> Paste your Token and Difficulty, generate the Colab script, run it, then paste the nonce back.
      </div>
    `.trim();

    const htmlContent = `
### Q10: Proof-of-Work Nonce Hunt

${statusAlert}

<div class="panel-section" style="margin-bottom: 16px; border: 1px solid var(--border); border-radius: 8px; padding: 12px 16px; background: rgba(255, 255, 255, 0.01);">
  <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 10px;">
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <label style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">YOUR TOKEN</label>
      <input type="text" id="pow-token-input" placeholder="Paste token from exam page" style="width: 100%; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
    </div>
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <label style="font-size: 11px; color: var(--text-secondary); font-weight: 600;">REQUIRED DIFFICULTY (ZERO BITS)</label>
      <input type="number" id="pow-difficulty-input" placeholder="Enter difficulty from exam" style="width: 100%; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
    </div>
    <p style="font-size: 12px; color: var(--text-muted); margin: 0;">
      Python's native <code>hashlib.sha256</code> mines 10-20x faster than browser JavaScript.
      Generate a script, run it in
      <a href="https://colab.research.google.com/" target="_blank" rel="noopener" style="color: var(--theme-primary);">Google Colab</a>
      (free), then paste the nonce result below.
    </p>
    <div id="pow-estimate" style="font-size: 12px; color: var(--text-secondary); min-height: 18px; margin: 4px 0;"></div>
    <button id="gen-colab-script-btn" style="background: var(--theme-primary); color: #000; border: none; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px var(--theme-glow); transition: transform 0.2s; align-self: flex-start;">Generate Colab Script</button>
    <div id="colab-script-area" style="display: none;">
      <div style="background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 6px; padding: 10px 14px; font-size: 11px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 8px;">
        <strong style="color: #34d399;">How to use:</strong>
        <ol style="margin: 4px 0 0 0; padding-left: 18px;">
          <li>Click <strong>Copy Script</strong> below (or select all and copy).</li>
          <li>Open <a href="https://colab.research.google.com/" target="_blank" rel="noopener" style="color: var(--theme-primary);">Google Colab</a> → <strong>File &gt; New Notebook</strong>.</li>
          <li>Paste the script into the first cell.</li>
          <li>Click the <strong>Run</strong> button (▶) and wait for mining to finish.</li>
          <li>Copy the <strong>Nonce</strong> number from the highlighted output box.</li>
          <li>Paste it into the field below and click <strong>Use This Nonce</strong>.</li>
        </ol>
      </div>
      <textarea id="colab-script-output" readonly style="width: 100%; height: 240px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 10px 14px; border-radius: 6px; font-size: 11px; font-family: monospace; outline: none; box-sizing: border-box; resize: vertical;"></textarea>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="copy-colab-script-btn" style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border); padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">Copy Script</button>
      </div>
      <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px; flex-wrap: wrap;">
        <input type="text" id="colab-nonce-input" placeholder="Paste nonce from Colab output" style="flex: 1; min-width: 180px; border: 1px solid var(--border); background: var(--bg-input); color: var(--text-primary); padding: 8px 12px; border-radius: 6px; font-size: 13px; outline: none; box-sizing: border-box;">
        <button id="submit-colab-nonce-btn" style="background: var(--theme-primary); color: #000; border: none; padding: 8px 18px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px var(--theme-glow);">Use This Nonce</button>
      </div>
    </div>
  </div>
</div>
    `.trim();

    return {
      type: 'guide',
      answer: 'Enter Token and Difficulty, generate Colab script, run it, paste nonce result.',
      variant: 'No token configured',
      answerDisplay: htmlContent
    };
  }
}
