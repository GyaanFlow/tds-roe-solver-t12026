// Solver: ROE T2 2026 Q10 — Prompt for Detecting AI-Generated Content
//
// Format is the only client-checkable part (5-500 chars, non-empty). The remaining 1.9 of
// 2 marks are graded offline by an LLM judge, so this provides a strong ready-to-submit prompt
// template plus guidance on what the rubric rewards, rather than pretending to compute a score.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-ai-content-detection';
export const title = 'Q10: Prompt for Detecting AI-Generated Content';

const TEMPLATE_PROMPT = `You are auditing a news article for signs of AI generation. Do not assume AI or human authorship by default -- require concrete evidence before concluding either way.

Score the article 0-100 (100 = certainly AI-written) using this rubric, citing the exact phrase or sentence that supports each point you award:
1. Repetitive sentence openers or transition words used more than twice ("Moreover", "In conclusion", "It is important to note").
2. Generic hedging or filler that adds no new information ("various factors", "in today's world").
3. Uniform sentence length and rhythm across paragraphs, with little variation in structure.
4. Absence of any concrete named detail (no specific dates, numbers, names, or direct quotes) where the topic would normally have them.
5. Overly balanced "on the one hand / on the other hand" framing with no clear stance, even on factual claims.

If the article shows strong, idiosyncratic voice, first-person anecdote, specific verifiable facts, or natural inconsistency (typos, colloquialisms, uneven pacing), treat these as evidence AGAINST AI authorship and say so explicitly.

If the article gives few or no indicators either way, output a score near 50 and say the evidence is insufficient -- do not force a confident verdict.

Output format:
Score: <0-100>
Verdict: <likely AI-generated | likely human-written | insufficient evidence>
Evidence: <bulleted list, one bullet per rubric point actually observed, quoting the supporting phrase>`;

function countWords(str) {
  const trimmed = (str || '').trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

function registerContentDetectionInteractive() {
  if (typeof window === 'undefined' || window._roeAiContentDetectionRegistered) return;
  window._roeAiContentDetectionRegistered = true;

  window._roeCheckAiContentPrompt = function () {
    const raw = (document.getElementById('roeAcdPromptInput')?.value || '');
    const statusEl = document.getElementById('roeAcdStatus');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    if (typeof raw !== 'string' || countWords(raw) === 0) {
      setStatus('Submit one non-empty prompt.', '#dc3545');
      return;
    }
    if (raw.length < 5 || raw.length > 500) {
      setStatus(`Length is ${raw.length} characters -- the prompt must be 5 to 500 characters (yours needs to ${raw.length < 5 ? 'grow' : 'shrink'}).`, '#dc3545');
      return;
    }
    setStatus(`✅ Format valid (${raw.length}/500 characters). This alone secures the 0.1 format mark -- the remaining 1.9 marks are judged offline on how well your rubric actually distinguishes AI from human text.`, '#198754');
  };

  window._roeUseAcdTemplate = function () {
    const inputEl = document.getElementById('roeAcdPromptInput');
    if (inputEl) inputEl.value = TEMPLATE_PROMPT;
    window._roeCheckAiContentPrompt();
  };

  window._roeCopyAcdPrompt = async function () {
    const el = document.getElementById('roeAcdPromptInput');
    if (!el || !el.value) return;
    try {
      await navigator.clipboard.writeText(el.value);
      const statusEl = document.getElementById('roeAcdStatus');
      if (statusEl) statusEl.textContent = 'Copied prompt to clipboard!';
    } catch {
      el.focus();
      el.select();
    }
  };
}

export async function solve(email) {
  registerContentDetectionInteractive();
  const norm = normalizeEmail(email);

  const summary = [
    `AI Content Detection Prompt Assistant for ${norm}.`,
    `Submitting any well-formed 5-500 character prompt secures the 0.1 format mark instantly; the remaining 1.9 marks depend on how well your rubric actually separates AI from human writing, judged offline.`
  ].join(' ');

  const guide = [
    `## Q10 — Prompt for Detecting AI-Generated Content (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> Submit one prompt of 5 to 500 characters for an LLM or agent to detect AI-generated content in`,
    `> an article. Define the rubric and judgement criteria in the prompt.`,
    `>`,
    `> The evaluator will run the prompt on hidden article variants and assess both the rubric and`,
    `> the resulting judgements. The rubric should require concrete evidence, distinguish AI-generated`,
    `> content from ordinary style, avoid certainty about authorship, and handle articles with few or`,
    `> no indicators.`,
    `>`,
    `> A valid submission earns 0.1 mark. Your prompt will be evaluated offline in two stages. In`,
    `> stage 1, a smart model checks how good your prompt is likely to be at differentiating AI and`,
    `> human content — this fetches up to 1 mark. In stage 2, only the top-scoring answers (maybe`,
    `> 100) are run against real human- and AI-generated content, earning up to 0.9 marks based on`,
    `> performance and distinctness (you'll score less if you copy — but if you copy from someone`,
    `> smart, you might score more). Scores are normalized across submissions, and distinctness is`,
    `> assessed using embedding distance.`,
    ``,
    `### 💯 Grading breakdown`,
    `- **0.1 mark** — client-side format check only: 5-500 non-empty characters. Instant, deterministic.`,
    `- **Up to 1.0 mark** — offline stage 1: an LLM judges how good your rubric *design* is likely to be.`,
    `- **Up to 0.9 marks** — offline stage 2 (top ~100 only): actually run against real articles, scored`,
    `  relatively, penalized for being too similar to other submissions (copying someone mediocre hurts`,
    `  you; copying someone excellent might still help, but distinctness itself carries weight).`,
    ``,
    `### 🧠 What actually makes a rubric score well`,
    `- Require **concrete evidence** for every judgement — a rubric that just says "does it feel AI-like?"`,
    `  is exactly the vague kind the grader is designed to catch and penalize.`,
    `- Explicitly **distinguish AI-generated text from merely plain/formal style** — many real human`,
    `  writers use formal, repetitive structures too; a good rubric doesn't confuse the two.`,
    `- **Never force certainty.** Articles with weak or no signal should get a genuinely uncertain verdict,`,
    `  not a coin-flip dressed up as confident.`,
    `- Ask for **specific textual evidence quoted from the article** for each point scored, not just a`,
    `  number — this is what lets the offline judge verify your rubric is actually being followed.`,
    `- Keep it **short and unambiguous** (well under the 500-char cap) — a bloated prompt with vague`,
    `  criteria scores worse than a tight, checklist-style one.`,
    ``,
    `### ⚡ Interactive Prompt Validator (for ${norm})`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#1e293b 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#f8fafc;border:1px solid #334155;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#38bdf8;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Detection Prompt</div>',
    '  <textarea id="roeAcdPromptInput" rows="10" placeholder="Write your AI-content-detection prompt here (5-500 characters)..." style="width:100%;padding:10px;border-radius:8px;border:1px solid #38bdf8;background:#0f172a;color:#f8fafc;font-family:monospace;font-size:13px;box-sizing:border-box;"></textarea>',
    '  <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">',
    '    <button onclick="window._roeCheckAiContentPrompt()" style="background:linear-gradient(135deg,#0284c7,#0369a1);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Check Format</button>',
    '    <button onclick="window._roeUseAcdTemplate()" style="background:linear-gradient(135deg,#16a34a,#15803d);color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Use Ready-Made Template</button>',
    '    <button onclick="window._roeCopyAcdPrompt()" style="background:#334155;color:#fff;border:none;border-radius:9px;padding:12px 22px;font-weight:700;font-size:14px;cursor:pointer;">Copy Prompt</button>',
    '  </div>',
    '  <div id="roeAcdStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#38bdf8;">Ready for ' + norm + '</div>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `AI content detection prompt assistant for ${norm}`,
    answerDisplay: [
      `### Q10: Prompt for Detecting AI-Generated Content`,
      ``,
      `Use the interactive validator below, or the ready-made template, to submit a well-formed detection prompt for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
