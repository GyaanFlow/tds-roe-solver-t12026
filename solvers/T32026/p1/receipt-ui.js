import { escapeHtml } from './ui.js';
import { checkReceipt } from './receipt.js';

const finals = new Map();

/** The paste-and-check box used by the two trading games. `key` is a short unique name, `finalFrom` when final receipts exist (ms). */
export function receiptWidgetHtml(key, finalFrom) {
  finals.set(key, finalFrom);
  return [
    `<div id="t3p1R-${key}">`,
    '<p>When the game has closed, open it, go to <strong>Result</strong>, copy your <strong>final receipt</strong> and paste it here to catch copy mistakes before you use a Check.</p>',
    `<textarea id="t3p1R-${key}-text" rows="3" spellcheck="false" autocomplete="off" placeholder="Paste the receipt here"></textarea>`,
    `<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1Receipt.check('${key}')">Check my receipt</button></div>`,
    `<div id="t3p1R-${key}-out" class="p1-status" role="status"></div>`,
    '</div>',
  ].join('');
}

export function registerReceiptWidget() {
  if (typeof window === 'undefined' || window._t3p1Receipt) return;
  window._t3p1Receipt = {
    check(key) {
      const out = document.getElementById(`t3p1R-${key}-out`);
      const box = document.getElementById(`t3p1R-${key}-text`);
      if (!out || !box) return;
      const result = checkReceipt(box.value, { finalFrom: finals.get(key) });
      const lines = [
        `<strong style="color:${result.ok ? '#34d399' : '#f87171'}">${result.ok ? 'The receipt looks right.' : 'Not ready yet.'}</strong>`,
        ...result.problems.map((p) => `<div style="color:#f87171">❌ ${escapeHtml(p)}</div>`),
        ...result.warnings.map((w) => `<div style="color:#fbbf24">⚠️ ${escapeHtml(w)}</div>`),
      ];
      if (result.ok) {
        lines.push('<div>Copy it exactly into the exam box, press <strong>Check</strong>, then <strong>Save</strong>. The exam server confirms the signature.</div>');
        if (result.fields && Object.keys(result.fields).length) lines.push(`<details><summary>What the receipt says</summary><div class="p1-inner">${Object.entries(result.fields).map(([k, v]) => `<div class="mono">${escapeHtml(k)}: ${escapeHtml(v)}</div>`).join('')}</div></details>`);
        box.value = result.receipt;
      }
      out.style.color = '';
      out.innerHTML = lines.join('');
    },
  };
}
