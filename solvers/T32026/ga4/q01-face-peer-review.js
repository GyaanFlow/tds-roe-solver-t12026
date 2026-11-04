import { page, card, details, escapeHtml } from '../p1/ui.js';
import { CATEGORIES, REQUIRED_PER_CATEGORY, checkFaceReceipt, reviewPlan } from './face-receipt.js';

export const id = 'q-ga4-face-peer-review-server';
export const title = 'Review classmates\' GA3 faces (24 comparisons)';

let workspaceEmail = '';
let lastGood = '';

function widgetHtml() {
  const planner = CATEGORIES.map((c, i) => `<div><label for="t3g4C${i}">${escapeHtml(c.short)} done so far</label><input type="text" id="t3g4C${i}" inputmode="numeric" value="0"></div>`).join('');
  return [
    '<div id="t3g4">',
    '<div class="p1-kicker">1 · Progress planner</div>',
    `<div class="p1-grid">${planner}</div>`,
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3g4.plan()">What is left?</button></div>',
    '<div id="t3g4Plan" class="p1-status" role="status"></div>',
    '<div class="p1-kicker" style="margin-top:14px">2 · Check your receipt</div>',
    '<p>In the review app open <strong>Assessment receipt for GA3</strong> and press <strong>Generate &amp; copy receipt</strong>. Paste it here to see if it is ready. Nothing is sent anywhere.</p>',
    '<textarea id="t3g4Text" rows="4" spellcheck="false" autocomplete="off" placeholder="Paste the receipt here"></textarea>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3g4.check()">Check my receipt</button><button type="button" class="p1-btn ghost" id="t3g4Fill" disabled onclick="window._t3g4.fill()">Put it in the answer box</button></div>',
    '<div id="t3g4Out" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3g4) return;
  const $ = (name) => document.getElementById(name);
  window._t3g4 = {
    plan() {
      const out = $('t3g4Plan');
      if (!out) return;
      const counts = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, $(`t3g4C${i}`)?.value]));
      const plan = reviewPlan(counts);
      out.style.color = plan.done ? '#34d399' : '';
      out.innerHTML = plan.done
        ? '<strong>All three categories have 8 or more.</strong> Generate your receipt now.'
        : `<strong>${plan.missing} more comparison${plan.missing === 1 ? '' : 's'} needed:</strong> ${plan.rows.filter((r) => r.missing).map((r) => `${escapeHtml(r.label)} ${r.count}/${REQUIRED_PER_CATEGORY}`).join(', ')}.`;
    },
    check() {
      const out = $('t3g4Out');
      const box = $('t3g4Text');
      if (!out || !box) return;
      const result = checkFaceReceipt(box.value, { email: workspaceEmail });
      lastGood = result.ok ? result.receipt : '';
      if ($('t3g4Fill')) $('t3g4Fill').disabled = !result.ok;
      const rows = result.categories.length ? `<table><tbody>${result.categories.map((c) => `<tr><td>${c.done ? '✅' : '❌'}</td><td>${escapeHtml(c.label)}</td><td>${c.count} / ${c.required}</td></tr>`).join('')}</tbody></table>` : '';
      out.style.color = '';
      out.innerHTML = [
        `<strong style="color:${result.ok ? '#34d399' : '#f87171'}">${result.ok ? 'The receipt is ready.' : 'Not ready yet.'}</strong>`,
        rows,
        ...result.problems.map((p) => `<div style="color:#f87171">❌ ${escapeHtml(p)}</div>`),
        ...result.warnings.map((w) => `<div style="color:#fbbf24">⚠️ ${escapeHtml(w)}</div>`),
        result.ok ? `<div>Valid until ${new Date(result.expiresAt).toUTCString()}. Copy it into the exam box, press <strong>Check</strong>, then <strong>Save</strong>. The exam server confirms the signature.</div>` : '',
      ].join('');
      if (result.ok) box.value = result.receipt;
    },
    fill() {
      const out = $('t3g4Out');
      if (!lastGood) return;
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, { type: 'solved', answer: lastGood, variant: 'Face-review receipt', answerDisplay: '### Your receipt\n\nPress **Check**, then **Save**.' });
      if (out) out.insertAdjacentHTML('beforeend', `<div>${patched ? 'Done. The answer box now has your receipt. Press Check, then Save.' : 'Copy the receipt into the exam box yourself, then press Check and Save.'}</div>`);
    },
  };
}

function buildGuide() {
  return page({
    title: '🧑‍⚖️ Review classmates\' GA3 faces',
    chips: [{ text: '1 mark', tone: '' }, { text: `${REQUIRED_PER_CATEGORY} reviews × 3 categories = 24`, tone: '' }],
    sections: [
      card('What you need to do', '<p class="p1-note"><strong>Compare two classmates\' work at a time, 8 times in each of 3 categories, then paste the signed receipt the review app gives you.</strong></p><p>The receipt is signed by the review server from the votes it recorded, so it cannot be created anywhere else. Your own honest comparisons are the only way to get it. “Can\'t judge” answers do not count towards the 24, and careless or repetitive choices may be checked.</p>', 'accent'),
      card('Step by step for beginners', '<ol><li>On the exam page, press <strong>Open your face-review desk</strong>. If it says the review is not open yet, come back later and reload the exam page. The link is personal and expires after 20 minutes, so reload for a new one.</li><li>Pick a category in the <strong>Compare</strong> box: 3D faces, morph videos or face pairs. You need <strong>8 in each</strong>.</li><li><strong>3D faces:</strong> you see a reference photo and two 3D models. Drag a model to turn it. Choose the one that looks <em>more like the photo</em> (face shape, what makes the face distinctive, and whether it is really 3D).</li><li><strong>Morph videos:</strong> you see the two faces and two videos. Choose the one that starts and ends with the right faces and changes <em>more smoothly</em>, with fewer jumps or warping.</li><li><strong>Face pairs:</strong> you see two pairs of faces. Choose the pair that would be <em>easier to morph</em> (similar pose, light, face shape and expression).</li><li>Press <strong>A</strong> or <strong>B</strong> (or the buttons) to vote, <strong>T</strong> if they are really equal, and <strong>S</strong> if something will not load. Only A, B and T count.</li><li>When the app says <strong>All 24 reviews complete</strong>, open <strong>Assessment receipt for GA3</strong> and press <strong>Generate &amp; copy receipt</strong> (or <strong>Get signed proof for GA3</strong>).</li><li>Paste the receipt in the checker below. When it shows all three categories done, paste it into the exam box, press <strong>Check</strong>, then <strong>Save</strong>.</li></ol>'),
      card('Planner and receipt checker', widgetHtml(), 'accent'),
      details('How to judge fairly', '<ul><li>Look at both choices for a few seconds before you decide; very fast, repeated choices (always A) can be flagged.</li><li>Do not judge your own work.</li><li>Choose “Both about equal” only when they really are.</li><li>You may review up to 32 per category, but extra reviews do not add marks.</li></ul>'),
      details('If something goes wrong', '<ul><li><strong>The app asks you to sign in:</strong> open it again from the exam page; the link is personal and short-lived.</li><li><strong>A model or video will not load:</strong> press “Can\'t judge”; it does not count, so do another.</li><li><strong>The exam says not completed:</strong> check the counts in the checker, review more in the weak category, and generate a <em>new</em> receipt.</li><li><strong>The checker says the receipt belongs to someone else:</strong> each student must use their own receipt, made through their own exam page.</li></ul>'),
    ],
  });
}

export async function solve(email) {
  workspaceEmail = String(email || '').trim();
  lastGood = '';
  register();
  return {
    type: 'guide',
    answer: 'Do 8 honest comparisons in each of the 3 categories in the face-review app, generate your receipt there, then paste it here and press Check and Save.',
    variant: 'Peer review + receipt · guide',
    guide: buildGuide(),
    answerDisplay: '### Review, then paste your receipt\n\nDo 8 comparisons in each category (24 in total) in the face-review app, generate the signed receipt, check it in the Implementation Guide, then paste it here and press Check and Save.',
    debug: { question: 'Q1', needsUserInput: true, required: REQUIRED_PER_CATEGORY * CATEGORIES.length },
  };
}
