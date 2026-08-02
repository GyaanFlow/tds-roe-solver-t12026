// Solver: ROE T2 2026 Q12 — Insights from NSS80 Telecom Data
//
// Format is the only client-checkable part (exactly 3 objects, exact field set, word caps).
// The actual insights require exploring the real MoSPI NSS 80th Round telecom dataset, so this
// validates structure/limits and offers a submission template -- it cannot invent real findings.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-external-dataset-insight';
export const title = 'Q12: Insights from NSS80 Telecom Data';

const REQUIRED_FIELDS = ['title', 'body', 'verification'];

function countWords(str) {
  const trimmed = (str || '').trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

const TEMPLATE_JSON = JSON.stringify([
  {
    title: 'Headline for insight 1 (max 8 words)',
    body: 'Newspaper-style explanation for a general audience -- what did you find and why does it matter? (max 100 words)',
    verification: 'Step-by-step method a journalist could follow to verify this from the MoSPI NSS 80th Round Telecom dataset itself -- which table, filter, or field to check. (max 200 words)'
  },
  {
    title: 'Headline for insight 2 (max 8 words)',
    body: 'Second insight explanation. (max 100 words)',
    verification: 'Second verification method. (max 200 words)'
  },
  {
    title: 'Headline for insight 3 (max 8 words)',
    body: 'Third insight explanation. (max 100 words)',
    verification: 'Third verification method. (max 200 words)'
  }
], null, 2);

function registerExternalDatasetInteractive() {
  if (typeof window === 'undefined' || window._roeExternalDatasetRegistered) return;
  window._roeExternalDatasetRegistered = true;

  window._roeCheckDatasetInsights = function () {
    const raw = document.getElementById('roeEdiJsonInput')?.value || '';
    const statusEl = document.getElementById('roeEdiStatus');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setStatus('Submit a valid JSON array.', '#dc3545');
      return;
    }
    if (!Array.isArray(parsed) || parsed.length !== 3) {
      setStatus('Submit exactly three insight objects in a JSON array.', '#dc3545');
      return;
    }
    for (let i = 0; i < parsed.length; i++) {
      const obj = parsed[i];
      const idx = i + 1;
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
        setStatus(`Insight ${idx} must be an object.`, '#dc3545');
        return;
      }
      const keys = Object.keys(obj).sort().join(',');
      if (keys !== 'body,title,verification') {
        setStatus(`Insight ${idx} must contain only title, body, and verification (got: ${keys || 'nothing'}).`, '#dc3545');
        return;
      }
      for (const field of REQUIRED_FIELDS) {
        if (typeof obj[field] !== 'string' || !obj[field].trim()) {
          setStatus(`Insight ${idx} must have a non-empty ${field} field.`, '#dc3545');
          return;
        }
      }
      if (countWords(obj.title) > 8) {
        setStatus(`Insight ${idx} title has ${countWords(obj.title)} words -- must be at most 8.`, '#dc3545');
        return;
      }
      if (countWords(obj.body) > 100) {
        setStatus(`Insight ${idx} body has ${countWords(obj.body)} words -- must be at most 100.`, '#dc3545');
        return;
      }
      if (countWords(obj.verification) > 200) {
        setStatus(`Insight ${idx} verification has ${countWords(obj.verification)} words -- must be at most 200.`, '#dc3545');
        return;
      }
    }
    setStatus('✅ Format valid: 3 insights, correct fields, all within word limits. This secures the 0.1 format mark -- the remaining 1.9 marks are judged offline on insight quality, correctness, and distinctness.', '#198754');
  };

  window._roeUseEdiTemplate = function () {
    const inputEl = document.getElementById('roeEdiJsonInput');
    if (inputEl) inputEl.value = TEMPLATE_JSON;
    window._roeCheckDatasetInsights();
  };

  window._roeCopyEdiJson = async function () {
    const el = document.getElementById('roeEdiJsonInput');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const statusEl = document.getElementById('roeEdiStatus');
      if (statusEl) statusEl.textContent = 'Copied JSON to clipboard!';
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerExternalDatasetInteractive();
  const norm = normalizeEmail(email);

  const summary = [
    `NSS80 Telecom Dataset Insight assistant for ${norm}.`,
    `Explore the MoSPI Comprehensive Modular Survey: Telecom (NSS 80th Round) dataset via the MoSPI MCP, then use the validator below to confirm your 3-insight JSON submission is correctly formatted before submitting.`
  ].join(' ');

  const guide = [
    `## Q12 — Insights from NSS80 Telecom Data (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> Use the MoSPI MCP at https://mcp.mospi.gov.in/ to work with the Comprehensive Modular Survey:`,
    `> Telecom (NSS 80th Round) dataset.`,
    `>`,
    `> Find exactly three impactful, practical, and surprising insights. Return a JSON array`,
    `> containing exactly three objects. Each object must contain exactly these text fields:`,
    `> - \`title\`: a newspaper headline explaining the insight. Max 8 words.`,
    `> - \`body\`: an explanation of the insight, as if for a popular newspaper, to educate and`,
    `>   engage the readers. Max 100 words.`,
    `> - \`verification\`: a step-by-step method to help a journalist verify the correctness of the`,
    `>   insight from the provided source. Max 200 words.`,
    `>`,
    `> A valid submission earns 0.1 mark. The remaining 1.9 marks will be awarded offline: 1 mark`,
    `> from a low-cost LLM evaluating quality/correctness of all submissions, and 0.9 marks after`,
    `> normalizing scores, from a higher-cost agent evaluating the top 100 submissions.`,
    `>`,
    `> Scores are graded relatively across submissions, including insight quality, correctness,`,
    `> verification quality, and distinctness (assessed via embedding distance).`,
    ``,
    `### 💯 Grading breakdown`,
    `- **0.1 mark** — client-side format check only: exactly 3 objects, exactly the 3 named fields,`,
    `  each within its word cap. Instant, deterministic.`,
    `- **1.0 mark** (offline) — a low-cost LLM judges quality/correctness of all submissions.`,
    `- **0.9 marks** (offline, top ~100 only) — a higher-cost agent re-evaluates the leading`,
    `  submissions relatively, penalizing insights too similar to other students' (embedding distance).`,
    ``,
    `### 🧠 What makes an insight score well`,
    `- **"Impactful, practical, and surprising"** — a stat that's technically true but expected (e.g.`,
    `  "urban areas have more internet users than rural") won't score; look for something counter-`,
    `  intuitive that survives scrutiny.`,
    `- **Newspaper framing in \`body\`** — write for a general reader, not a statistician: concrete`,
    `  numbers, plain language, why it matters to someone's life or a policy decision.`,
    `- **\`verification\` must be genuinely followable** — name the actual table/filter/field in the`,
    `  NSS 80th Round Telecom dataset, not a vague "check the data".`,
    `- **Distinctness matters as much as correctness** — three insights that echo the most obvious`,
    `  headline everyone else will also find are penalized relative to less-obvious, well-verified ones.`,
    ``,
    `### ⚡ Interactive Format Validator (for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your 3-Insight JSON Array</div>',
    '  <textarea id="roeEdiJsonInput" rows="16" placeholder=\'[{"title":"...","body":"...","verification":"..."}, ...]\' style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;box-sizing:border-box;"></textarea>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">',
    '    <button onclick="window._roeCheckDatasetInsights()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Check Format</button>',
    '    <button onclick="window._roeUseEdiTemplate()" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Load Template</button>',
    '    <button onclick="window._roeCopyEdiJson()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Copy JSON</button>',
    '  </div>',
    '  <div id="roeEdiStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `NSS80 telecom dataset insight assistant for ${norm}`,
    answerDisplay: [
      `### Q12: Insights from NSS80 Telecom Data`,
      ``,
      `Use the interactive validator below to confirm your 3-insight JSON submission for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
