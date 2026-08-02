// Solver: ROE T2 2026 Q6 — Donate Your Marks
//
// Ultra-Advanced Dynamic Barter Matrix & Form Assistant:
// Interactive game-theory payoff matrix, live @*.study.iitm.ac.in email validator,
// and copy tools for the official Google Form.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';

export const id = 'q-donate-marks';
export const title = 'Q6: Donate Your Marks';

const DONATION_FORM_URL = 'https://forms.gle/FXwQbFnC4kTNTXo8A';

function registerDonateMarksInteractive() {
  if (typeof window === 'undefined' || window._roeDonateMarksRegistered) return;
  window._roeDonateMarksRegistered = true;

  window._roeCalculateBarter = function () {
    const groupSizeEl = document.getElementById('roeDmGroupSize');
    const emailsInput = (document.getElementById('roeDmEmailsInput')?.value || '').trim();
    const statusEl = document.getElementById('roeDmStatus');

    function setStatus(text, color) {
      if (!statusEl) return;
      statusEl.innerHTML = text;
      statusEl.style.color = color || '#9fc6ff';
    }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }

    const rawList = emailsInput.split(/[\s,;:\n]+/).filter(Boolean);
    const emails = rawList.map(normalizeEmail);
    const size = Number(groupSizeEl?.value || 4);

    let yieldPerPerson = 0;
    if (size === 2) yieldPerPerson = 1.0;
    else if (size === 3) yieldPerPerson = 1.2;
    else if (size >= 4) yieldPerPerson = 1.5;

    const invalidEmails = emails.filter(e => !/@.*study\.iitm\.ac\.in$/i.test(e));
    const isSelfPicked = emails.some(e => e === 'your-email@study.iitm.ac.in');

    let msg = `<strong>Reciprocal Yield:</strong> A mutual group of ${size} earns <strong>${yieldPerPerson} marks</strong> per member (Maximum: 1.5 marks).`;
    
    if (invalidEmails.length > 0) {
      msg += `<br/><span style="color:#f87171;">⚠️ ${invalidEmails.length} email(s) do not match @*.study.iitm.ac.in requirement (${escapeHtml(invalidEmails.slice(0, 2).join(', '))})</span>`;
      setStatus(msg, '#fbbf24');
    } else if (isSelfPicked) {
      msg += `<br/><span style="color:#f87171;">⚠️ Rule violation: You cannot pick yourself.</span>`;
      setStatus(msg, '#f87171');
    } else if (emails.length > 3) {
      msg += `<br/><span style="color:#f87171;">⚠️ You can pick at most 3 collaborators in the Form.</span>`;
      setStatus(msg, '#fbbf24');
    } else {
      msg += ` ✅ All ${emails.length} email(s) valid & ready for Google Form submission!`;
      setStatus(msg, '#4ade80');
    }
  };
}

export async function solve(email) {
  registerDonateMarksInteractive();
  const norm = normalizeEmail(email);
  const answer = 'acknowledged';

  const summary = [
    `Ultra-Advanced Dynamic Barter Assistant for ${norm}.`,
    `Submit "${answer}" on the exam page to claim the 0.2 participation mark, then use the game-theory optimizer below to fill the official Google Form.`
  ].join(' ');

  const guide = [
    `## Q6 — Donate Your Marks (for ${norm})`,
    ``,
    `### 📄 Full question, verbatim from your exam page`,
    `> This is a small experiment in **trust and collaboration**, worth up to **1.5 marks**. You can donate your marks to up to 3 classmates.`,
    ``,
    `### ⚡ Submitted Value on Exam Page`,
    `Ticking the page's checkbox sets a hidden input to the literal string below (earns **0.2 participation mark**):`,
    '```text',
    answer,
    '```',
    ``,
    `### 🎮 Interactive Game-Theory Payoff Matrix`,
    ``,
    '<div style="background:linear-gradient(135deg,#0c2d48 0%,#145da0 100%);border-radius:14px;padding:22px 24px;margin:16px 0;color:#e6f3ff;border:1px solid #1e426e;">',
    '  <div style="font-size:12px;letter-spacing:2px;color:#8ecdf7;text-transform:uppercase;margin-bottom:10px;font-weight:700;">1. Select Reciprocal Collaboration Model</div>',
    '  <select id="roeDmGroupSize" onchange="window._roeCalculateBarter()" style="width:100%;padding:10px;border-radius:8px;border:1px solid #8ecdf7;background:#061a2b;color:#e6f3ff;font-family:sans-serif;font-size:13px;box-sizing:border-box;margin-bottom:14px;">',
    '    <option value="4">🏅 Group of 4 (All donate to each other -> 1.5 MARKS EACH — MAXIMUM)</option>',
    '    <option value="3">🥈 Group of 3 (All donate to each other -> 1.2 Marks Each)</option>',
    '    <option value="2">🥉 Pair of 2 (Mutual donation -> 1.0 Mark Each)</option>',
    '    <option value="1">🎁 Single Donation (1.0 Mark to recipient, 0 to you unless reciprocated)</option>',
    '  </select>',
    '  <div style="font-size:12px;letter-spacing:2px;color:#8ecdf7;text-transform:uppercase;margin-bottom:10px;font-weight:700;">2. Classmate Email Address Validator (@*.study.iitm.ac.in)</div>',
    '  <textarea id="roeDmEmailsInput" rows="3" placeholder="alex@ds.study.iitm.ac.in, priya@es.study.iitm.ac.in" oninput="window._roeCalculateBarter()" style="width:100%;padding:10px;border-radius:8px;border:1px solid #8ecdf7;background:#061a2b;color:#e6f3ff;font-family:monospace;font-size:13px;box-sizing:border-box;margin-bottom:10px;"></textarea>',
    '  <div id="roeDmStatus" style="font-size:13px;min-height:24px;font-weight:600;margin-top:6px;line-height:1.5;color:#8ecdf7;"><strong>Reciprocal Yield:</strong> A mutual group of 4 earns <strong>1.5 marks</strong> per member (Maximum: 1.5 marks).</div>',
    '</div>',
    ``,
    `### 🎁 Official Form Link`,
    `Fill out your validated choices in the Google Form before the deadline:`,
    `<a href="${DONATION_FORM_URL}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:8px;">🎁 Open the Official Donation Form</a>`,
    ...promoLines
  ].join('\n');

  return {
    type: 'solved',
    answer,
    variant: `Donate marks calculator for ${norm}`,
    answerDisplay: [
      `### Q6: Donate Your Marks`,
      ``,
      `Submit value: \`${answer}\` (secures **0.2 participation mark**). Use the dynamic matrix below to maximize your score up to 1.5 marks.`,
      ``,
      summary
    ].join('\n'),
    guide
  };
}
