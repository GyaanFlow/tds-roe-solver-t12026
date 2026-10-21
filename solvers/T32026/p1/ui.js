// Shared look for the four T3 P1 guides. Each guide is ONE contiguous HTML block (no blank lines), because the
// portal renders guides with a markdown parser that would turn indented lines after a blank line into code.
import { escapeHtml } from './utils.js';

export { escapeHtml };

export const P1_CSS = `<style>
.p1{--p1-accent:var(--theme-primary,#3b82f6);--p1-line:var(--border,rgba(255,255,255,.14));color:var(--text-primary,#e6edf7);font-size:14px;line-height:1.55}
.p1 *{box-sizing:border-box}
.p1-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px 10px;margin:0 0 14px}
.p1-title{font-size:1.2rem;font-weight:750;margin:0 8px 0 0}
.p1-chip{display:inline-flex;align-items:center;gap:6px;padding:3px 10px;border-radius:999px;font-size:12px;font-weight:650;border:1px solid var(--p1-line);background:rgba(255,255,255,.04);color:var(--text-secondary,#a1a1aa)}
.p1-chip.ok{color:#34d399;border-color:rgba(52,211,153,.5);background:rgba(52,211,153,.1)}
.p1-chip.warn{color:#fbbf24;border-color:rgba(251,191,36,.5);background:rgba(251,191,36,.1)}
.p1-chip.bad{color:#f87171;border-color:rgba(248,113,113,.5);background:rgba(248,113,113,.1)}
.p1-card{border:1px solid var(--p1-line);border-radius:14px;padding:16px;background:rgba(255,255,255,.03);margin:0 0 14px}
.p1-card.accent{border-color:var(--p1-accent);background:linear-gradient(135deg,rgba(77,166,255,.1),rgba(255,255,255,.02))}
.p1-kicker{font-size:11px;font-weight:750;letter-spacing:.12em;text-transform:uppercase;color:var(--text-secondary,#a1a1aa);margin:0 0 8px}
.p1-card p{margin:0 0 10px}.p1-card p:last-child{margin-bottom:0}
.p1-note{padding:8px 12px;margin:0 0 10px;border-radius:10px;border:1px solid rgba(245,158,11,.5);background:rgba(245,158,11,.1);color:#fbbf24;font-size:13px}
.p1-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
.p1 label{display:block;font-size:12px;font-weight:650;margin:0 0 4px;color:var(--text-secondary,#a1a1aa)}
.p1 input[type=text],.p1 input[type=number],.p1 select,.p1 textarea{width:100%;padding:8px 10px;border-radius:8px;border:1px solid var(--p1-line);background:rgba(0,0,0,.3);color:inherit;font:13px/1.4 inherit}
.p1 textarea{min-height:90px;resize:vertical;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.p1-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:9px 16px;border-radius:10px;border:1px solid var(--p1-accent);background:var(--p1-accent);color:#000;font:inherit;font-weight:750;cursor:pointer}
.p1-btn.ghost{background:transparent;color:var(--p1-accent)}
.p1-btn:disabled{opacity:.55;cursor:progress}
.p1-actions{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 0}
.p1-status{min-height:20px;margin-top:10px;font-size:13px}
.p1 table{border-collapse:collapse;width:100%;font-size:13px}
.p1 th{text-align:left;font-weight:650;color:var(--text-secondary,#a1a1aa);padding:6px 8px;border-bottom:1px solid var(--p1-line)}
.p1 td{padding:5px 8px;border-bottom:1px solid rgba(255,255,255,.06);vertical-align:middle}
.p1 .bar{display:block;height:8px;border-radius:4px;background:var(--p1-accent);min-width:2px}
.p1 .mono{font-family:ui-monospace,Menlo,Consolas,monospace}
.p1 details{border:1px solid var(--p1-line);border-radius:12px;margin:0 0 10px;background:rgba(255,255,255,.02)}
.p1 summary{cursor:pointer;padding:10px 14px;font-weight:650}
.p1 .p1-inner{padding:0 14px 14px;overflow-x:auto}
.p1 ul,.p1 ol{margin:0;padding-left:20px}.p1 li{margin:0 0 5px}
.p1 a{color:var(--p1-accent)}
.p1-foot{font-size:12px;color:var(--text-secondary,#a1a1aa)}
@media (max-width:480px){.p1-card{padding:12px}.p1-btn{width:100%}}
</style>`;

/** Wraps sections in the shared page chrome. `chips` is [{text, tone}]. */
export function page({ title, chips = [], sections = [] }) {
  const chipHtml = chips.map((chip) => `<span class="p1-chip ${escapeHtml(chip.tone || '')}">${escapeHtml(chip.text)}</span>`).join('');
  return [P1_CSS, '<div class="p1">', `<div class="p1-head"><h2 class="p1-title">${escapeHtml(title)}</h2>${chipHtml}</div>`, ...sections, '</div>'].join('');
}

export const card = (kicker, body, tone = '') => `<div class="p1-card ${tone}">${kicker ? `<div class="p1-kicker">${escapeHtml(kicker)}</div>` : ''}${body}</div>`;
export const details = (summary, body, open = false) => `<details${open ? ' open' : ''}><summary>${escapeHtml(summary)}</summary><div class="p1-inner">${body}</div></details>`;

export function toneForState(state) {
  return state === 'open' ? 'ok' : state === 'before' ? 'warn' : state === 'grace' ? 'warn' : 'bad';
}
