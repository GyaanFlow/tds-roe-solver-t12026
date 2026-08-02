// Solver: ROE T2 2026 Q11 — AI Opportunity Discovery: SkyWave Direct
//
// This is entirely offline-graded (an investigative memo about a private, per-student data
// room), so there is no computable "answer" -- what this DOES provide is the deterministic
// case assignment (A or B, from the exam's own FNV-based split), an exact structural template,
// and a live format validator, since submitting the wrong structure or word count is an
// avoidable, purely mechanical way to lose marks.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-ai-opportunity-discovery';
export const title = 'Q11: AI Opportunity Discovery';

const CASE_A_URL = 'https://drive.google.com/drive/folders/13-pfSILZ9SlepNhwj8XFzVffoD-fJlyn?usp=drive_link';
const CASE_B_URL = 'https://drive.google.com/drive/folders/1EjFSdmrUQ1f2zN3WoqeLAYfK_IzkIN8q?usp=drive_link';
const VERSION = 'roe-2026-05-v1';

const REQUIRED_HEADINGS = [
  '# Organization and process map',
  '## Interview questions',
  '## Ranked AI use cases',
  '## Safest first action'
];

// Byte-for-byte the exam's own case-assignment function: FNV-1a 32-bit hash of
// `${email.trim().toLowerCase()}#ai-opportunity-discovery#${version}`, even/odd split.
function assignCase(email, version) {
  let hash = 2166136261;
  const bytes = new TextEncoder().encode(`${String(email || '').trim().toLowerCase()}#ai-opportunity-discovery#${version}`);
  for (const b of bytes) hash = Math.imul(hash ^ b, 16777619) >>> 0;
  return hash < 2147483648 ? 'A' : 'B';
}

function countWords(str) {
  const trimmed = (str || '').trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

const TEMPLATE_MEMO = `# Organization and process map
[Brief narrative: which departments, systems, decisions, and information flows does the data room actually show? Note where the trail visibly stops.]

## Interview questions
| # | Stakeholder/team | Question | Why this matters | Evidence prompting it |
|---|---|---|---|---|
| 1 | | | | filename, field/date/query/passage |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| 6 | | | | |
| 7 | | | | |
| 8 | | | | |

## Ranked AI use cases
| Rank | Use case and business decision | Evidence | Value | Difficulty | Risks and validation step |
|---|---|---|---|---|---|
| 1 | | | High/Medium/Low | High/Medium/Low | |
| 2 | | | | | |
| 3 | | | | | |

## Safest first action
[One prioritized, reversible action and why it is safe under the current uncertainty.]`;

function registerOpportunityDiscoveryInteractive() {
  if (typeof window === 'undefined' || window._roeAiOpportunityRegistered) return;
  window._roeAiOpportunityRegistered = true;

  window._roeCheckOpportunityMemo = function () {
    const raw = document.getElementById('roeAodMemoInput')?.value || '';
    const statusEl = document.getElementById('roeAodStatus');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    const trimmed = String(raw).trim();
    if (trimmed.length < 500) {
      setStatus(`Only ${trimmed.length} characters -- the memo must be at least 500 characters (substantive, not a stub).`, '#dc3545');
      return;
    }
    const words = countWords(trimmed);
    if (words > 1800) {
      setStatus(`${words} words -- must be at most 1,800 words. Trim ${words - 1800} words.`, '#dc3545');
      return;
    }
    const missing = REQUIRED_HEADINGS.filter(h => !trimmed.includes(h));
    if (missing.length > 0) {
      setStatus(`Missing required heading(s): ${missing.join(' | ')}`, '#dc3545');
      return;
    }
    setStatus(`✅ Format valid: ${trimmed.length} chars, ${words} words, all 4 required headings present. Ready to submit -- content is graded entirely offline.`, '#198754');
  };

  window._roeUseAodTemplate = function () {
    const inputEl = document.getElementById('roeAodMemoInput');
    if (inputEl) inputEl.value = TEMPLATE_MEMO;
    window._roeCheckOpportunityMemo();
  };

  window._roeCopyAodMemo = async function () {
    const el = document.getElementById('roeAodMemoInput');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const statusEl = document.getElementById('roeAodStatus');
      if (statusEl) statusEl.textContent = 'Copied memo to clipboard!';
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerOpportunityDiscoveryInteractive();
  const norm = normalizeEmail(email);
  const assignedCase = assignCase(norm, VERSION);
  const caseUrl = assignedCase === 'A' ? CASE_A_URL : CASE_B_URL;

  const summary = [
    `AI Opportunity Discovery memo assistant for ${norm}.`,
    `Your assigned data room is Case ${assignedCase} (deterministic -- same every time you refresh, computed from your own email). Content is graded entirely offline; use the structural template and live validator below to avoid losing marks on format alone.`
  ].join(' ');

  const guide = [
    `## Q11 — AI Opportunity Discovery: SkyWave Direct (for ${norm})`,
    ``,
    `### 🎯 Your assigned case: Case ${assignedCase}`,
    `Deterministically computed from your email — the same case every time you refresh, exactly`,
    `like the real exam page. Data room: [Case ${assignedCase}](${caseUrl})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> You have joined SkyWave Direct's AI Innovation team. In your first week, you receive a`,
    `> partial internal data room containing strategy and process documents, operational datasets,`,
    `> financial or retention records, and selected communications.`,
    `>`,
    `> The materials are incomplete: some later records, internal discussions, and incident evidence`,
    `> are unavailable. Do not build an AI system yet. First decide what the organization should`,
    `> investigate and where AI could create value safely. Treat every metric and document as`,
    `> evidence produced by a process, not as ground truth.`,
    `>`,
    `> **Warning:** Some information has been deliberately hidden, like in a real organization. This`,
    `> may be because of politics, organization structure, real-life data quality issues, or just`,
    `> plain forgetfulness. However, some signals will leak through. Your agent may not be able to`,
    `> find these. But can you?`,
    `>`,
    `> Submit a Markdown memo of at most 1,800 words using exactly the required structure (see`,
    `> template below). Cite filenames and relevant fields, dates, cohorts, passages, or queries`,
    `> precisely. This is evaluated offline and relatively within your assigned case for evidence`,
    `> traceability, investigative judgment, calibration, and usefulness.`,
    `>`,
    `> This will be evaluated offline by an agent that knows what was withheld and will check if you`,
    `> can uncover the right signals and penalize you for following the wrong ones. Intuition helps.`,
    ``,
    `### 💯 Grading breakdown`,
    `- **Format is required but not separately scored client-side** — a valid save requires the 4`,
    `  exact headings, 500-1800 word range. Get the structure right first; the memo is 100% offline-graded.`,
    `- Graded **relatively within your assigned case** (A vs A, B vs B) on: evidence traceability,`,
    `  investigative judgment, calibration (not over/under-confident), and usefulness.`,
    `- The grading agent **knows what was deliberately withheld** — it can tell the difference between`,
    `  a memo that noticed the gaps and one that took every document at face value.`,
    ``,
    `### 🧠 Investigative strategy`,
    `- **Every document is evidence of a process, not ground truth.** A metric that looks clean might`,
    `  reflect who compiled it and when, not what actually happened.`,
    `- **Look for what's conspicuously missing** — gaps in date ranges, departments never mentioned in`,
    `  communications, numbers that don't reconcile between two documents. These are the "signals`,
    `  that leak through" the question warns about.`,
    `- **Interview questions should target the gaps**, not just restate what's already documented — cite`,
    `  the specific filename/field/date/passage that made you suspicious enough to ask.`,
    `- **Rank AI use cases on evidence you can actually point to**, not generic "AI could help with X"`,
    `  ideas — the value/difficulty/risk columns need to reflect what the data room specifically shows.`,
    `- **The safest first action should be reversible** — something you could undo cheaply if your`,
    `  read on the incomplete evidence turns out wrong.`,
    ``,
    `### ⚡ Interactive Memo Validator (for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0f172a 0%,#4338ca 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #4338ca;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#c7d2fe;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Memo (Markdown)</div>',
    '  <textarea id="roeAodMemoInput" rows="16" placeholder="Paste your investigative memo here..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #6366f1;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:12px;box-sizing:border-box;"></textarea>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">',
    '    <button onclick="window._roeCheckOpportunityMemo()" style="background:linear-gradient(135deg,#6366f1,#4338ca);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Check Format</button>',
    '    <button onclick="window._roeUseAodTemplate()" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Load Structural Template</button>',
    '    <button onclick="window._roeCopyAodMemo()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Copy Memo</button>',
    '  </div>',
    '  <div id="roeAodStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#c7d2fe;">Ready for ' + norm + ' -- Case ' + assignedCase + '</div>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `AI opportunity discovery memo assistant for ${norm} (Case ${assignedCase})`,
    answerDisplay: [
      `### Q11: AI Opportunity Discovery`,
      ``,
      `Your assigned data room is **Case ${assignedCase}**. Use the structural template and validator below for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
