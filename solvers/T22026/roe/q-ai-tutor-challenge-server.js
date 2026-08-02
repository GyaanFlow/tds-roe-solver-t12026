// Solver: ROE T2 2026 Q13 — AI Tutor Challenge (Hidden-Formula Puzzle)
//
// There is genuinely no client-computable path here: each student's rule table and formula are
// generated server-side and delivered only inside an iframe (the formula code never reaches the
// browser). Grading is all-or-none via backendVerify. This is a strategy guide for using the AI
// tutor chat effectively to deduce the formula yourself, not a solver.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-ai-tutor-challenge-server';
export const title = 'Q13: AI Tutor Challenge';

function registerAiTutorInteractive() {
  if (typeof window === 'undefined' || window._roeAiTutorRegistered) return;
  window._roeAiTutorRegistered = true;

  window._roeCheckAiTutorAnswer = function () {
    const raw = (document.getElementById('roeAtcAnswerInput')?.value || '').trim();
    const statusEl = document.getElementById('roeAtcStatus');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.textContent = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    if (!raw) {
      setStatus('Enter the numeric output you computed for the target row.', '#dc3545');
      return;
    }
    if (!/^-?\d+(\.\d+)?$/.test(raw)) {
      setStatus(`"${raw}" doesn't look like a plain number. Double-check your final computed value before submitting on the exam page.`, '#d97706');
      return;
    }
    setStatus(`✅ "${raw}" is a well-formed number, ready to paste on the exam page. This does NOT verify it's the correct answer -- only the exam's own backendVerify check can do that (scoring is all-or-none).`, '#198754');
  };
}

export async function solve(email) {
  registerAiTutorInteractive();
  const norm = normalizeEmail(email);

  const summary = [
    `AI Tutor Challenge strategy guide for ${norm}.`,
    `Your rule table and hidden formula are generated per-student server-side and only ever delivered inside an iframe on the real exam page -- there is no way to compute or extract them from outside that page. Use the strategy below to deduce your formula efficiently via the AI tutor chat.`
  ].join(' ');

  const guide = [
    `## Q13 — AI Tutor Challenge (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> Each fictional operator (e.g. ZOK, VEX) follows a hidden mathematical formula. Study the`,
    `> worked examples, deduce the formula, then compute the target row's output.`,
    `>`,
    `> 1. **Observe.** Each row shows \`Op(A, B) = Output\`. Look for patterns — does the output`,
    `>    scale with A? Does swapping A and B change the result?`,
    `> 2. **Hypothesise.** The formula may be linear (\`p*A + q*B\`), quadratic (\`p*A^2 + q*B\`), a`,
    `>    shifted product, or XOR-based. Try to pin down the formula type before guessing coefficients.`,
    `> 3. **Ask the tutor.** Describe your hypothesis and the tutor will confirm or correct your`,
    `>    reasoning. Once you know the exact formula, plug in the target values yourself — the tutor`,
    `>    will not compute the final answer for you.`,
    `>`,
    `> Scoring is all-or-none: full marks for the correct value, zero otherwise.`,
    ``,
    `### ⚠️ Why no solver is possible here (and why that's by design)`,
    `Your specific rule table is generated on the server per-student and delivered only inside an`,
    `iframe on the real exam page — the formula code itself never reaches your browser as`,
    `inspectable JavaScript. There is nothing to extract, decode, or reverse-engineer from outside`,
    `that page. The only real path is: open your real exam page, read your assigned worked`,
    `examples, and reason through them (with the AI tutor's help) yourself.`,
    ``,
    `### 🧠 A systematic approach to the worked examples`,
    `1. **List every \`Op(A, B) = Output\` row you're given.** Write them as a table — A, B, Output —`,
    `   before hypothesizing anything.`,
    `2. **Test linearity first.** Hold A fixed, vary B across two rows: does Output change by a`,
    `   constant multiple of the change in B? Repeat holding B fixed. If both hold, you likely have`,
    `   \`Output = p*A + q*B (+ r)\` — solve for p, q, r using two or three rows as simultaneous`,
    `   equations, then check every other row still fits.`,
    `3. **If linear fails, test quadratic/power terms.** Does doubling A roughly quadruple the`,
    `   Output contribution (suggesting \`A^2\`)? Does the operator look asymmetric (swapping A and B`,
    `   changes the result) — that rules out purely symmetric formulas like \`A*B\`.`,
    `4. **Test bitwise/XOR patterns** if A and B are small integers and the outputs look "jumpy"`,
    `   rather than smoothly scaling — compute \`A XOR B\`, \`A AND B\`, \`A OR B\` for each row and see`,
    `   if any matches, possibly with an added/multiplied constant.`,
    `5. **Use the tutor to confirm, not to compute.** Describe your hypothesis precisely (e.g. "I`,
    `   think it's \`2*A + B - 3\`, is that the right shape?") — the tutor is designed to correct your`,
    `   reasoning, not hand you the final number. Asking it to "just solve it" wastes your limited`,
    `   chat budget (the message box has a character cap) without getting real signal.`,
    `6. **Verify your formula against every worked example you have**, not just the ones you used to`,
    `   derive it, before computing the target row — a formula that fits 2 rows but not the 3rd is wrong.`,
    `7. **Compute the target row yourself** once confident — the tutor will not give you the final`,
    `   number, and scoring is all-or-none, so a single arithmetic slip costs the full mark.`,
    ``,
    `### ⚡ Answer Format Checker (for ${norm})`,
    `This only checks that your final answer is a well-formed number ready to paste on the exam`,
    `page — it cannot verify correctness, since the formula is private to your exam session.`,
    ``,
    '<div style="background:linear-gradient(135deg,#0d1117 0%,#161b22 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#c9d1d9;border:1px solid #30363d;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#58a6ff;text-transform:uppercase;margin-bottom:10px;font-weight:700;">Your Computed Output</div>',
    '  <input id="roeAtcAnswerInput" type="text" placeholder="e.g. 42" style="width:100%;padding:10px;border-radius:8px;border:1px solid #58a6ff;background:#0d1117;color:#c9d1d9;font-family:monospace;font-size:14px;box-sizing:border-box;margin-bottom:10px;" />',
    '  <button onclick="window._roeCheckAiTutorAnswer()" style="background:#238636;color:#fff;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">Check Format</button>',
    '  <div id="roeAtcStatus" style="font-size:13px;min-height:20px;font-weight:600;margin-top:10px;color:#58a6ff;">Ready for ' + norm + '</div>',
    '</div>',
    ...promoLines
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `AI tutor challenge strategy guide for ${norm}`,
    answerDisplay: [
      `### Q13: AI Tutor Challenge`,
      ``,
      `No solver is possible for this question -- your rule table is private and server-generated per student. Use the strategy guide below for ${norm}.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
