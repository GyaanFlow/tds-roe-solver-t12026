// Shared support/credits block appended to every T2 2026 ROE guide.
//
// Kept in ONE place on purpose: nine solvers embed it, so the links, wording and styling only
// ever need editing here. Self-contained inline styles (own background + light text) so it
// reads correctly against both the classic dark themes and the light Blueprint theme, rather
// than inheriting whichever panel it happens to land in.

const REPO_URL = 'https://github.com/GyaanFlow/tds-roe-solver-t12026';
const PROFILE_URL = 'https://github.com/GyaanFlow';
const LINKEDIN_URL = 'https://www.linkedin.com/in/gaurav-tomar-630b2a316';

const BTN = 'display:inline-flex;align-items:center;gap:7px;padding:10px 16px;border-radius:9px;' +
  'font-weight:700;font-size:13px;text-decoration:none;white-space:nowrap;' +
  'transition:transform 0.15s ease,filter 0.15s ease;';

/**
 * Markdown-safe HTML block (guides are rendered through marked with HTML passthrough).
 * Returned as an array of lines so callers can spread it straight into their guide array.
 */
export const promoLines = [
  ``,
  `---`,
  ``,
  '<div style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%);border-radius:14px;padding:20px 22px;margin:20px 0 4px;border:1px solid #4f46e5;box-shadow:0 8px 28px rgba(79,70,229,0.25);">',
  '  <div style="font-size:11px;letter-spacing:2px;color:#a5b4fc;text-transform:uppercase;font-weight:700;margin-bottom:8px;">⚡ Built by GyaanFlow &mdash; <span style="color:#fbbf24;">GT Indian</span></div>',
  '  <div style="font-size:14px;line-height:1.6;color:#e0e7ff;margin-bottom:14px;">',
  '    Cracked this question faster? A ⭐ or a follow genuinely helps this project reach more TDS students &mdash; it takes 5 seconds and costs you nothing.',
  '  </div>',
  '  <div style="display:flex;flex-wrap:wrap;gap:9px;">',
  `    <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer" style="${BTN}background:linear-gradient(120deg,#fbbf24,#f59e0b);color:#1a1a1a;">⭐ Star the Repo</a>`,
  `    <a href="${PROFILE_URL}" target="_blank" rel="noopener noreferrer" style="${BTN}background:linear-gradient(120deg,#e0e7ff,#c7d2fe);color:#1e1b4b;">🐙 Follow on GitHub</a>`,
  `    <a href="${LINKEDIN_URL}" target="_blank" rel="noopener noreferrer" style="${BTN}background:linear-gradient(120deg,#7dd3fc,#38bdf8);color:#0c2d48;">💼 Connect on LinkedIn</a>`,
  '  </div>',
  '</div>'
];

/** Convenience: the same block as a single joined string. */
export const promoBlock = promoLines.join('\n');
