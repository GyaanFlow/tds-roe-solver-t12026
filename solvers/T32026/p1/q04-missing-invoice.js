import { page, card, details, escapeHtml, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst, formatRemaining } from './windows.js';
import { CHECKLIST, assessRequest, reconcile } from './invoice-calc.js';

export const id = 'q-trading-missing-invoice';
export const title = 'Trading game: Reconcile the Missing Invoice';

const lineRow = (n) => `<div class="p1-card" data-line="${n}" style="margin:0 0 8px;padding:10px"><div class="p1-grid"><div><label>Item</label><input type="text" data-f="item" placeholder="e.g. Notebooks"></div><div><label>Quantity ordered (PO)</label><input type="text" data-f="orderedQty" inputmode="decimal" placeholder="optional"></div><div><label>Quantity received (GRN)</label><input type="text" data-f="receivedQty" inputmode="decimal" placeholder="e.g. 90"></div><div><label>Price per unit (PO)</label><input type="text" data-f="poPrice" inputmode="decimal" placeholder="e.g. 125.50"></div><div><label>GST % (PO) — blank = default</label><input type="text" data-f="gstRate" inputmode="decimal" placeholder="e.g. 18"></div></div><div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Inv.removeLine(${n})">Remove line</button></div></div>`;
const creditRow = (n) => `<div class="p1-card" data-credit="${n}" style="margin:0 0 8px;padding:10px"><div class="p1-grid"><div><label>Credit note number</label><input type="text" data-f="ref" placeholder="e.g. CN-104"></div><div><label>Amount</label><input type="text" data-f="amount" inputmode="decimal" placeholder="e.g. 500"></div><div><label>Status</label><select data-f="status"><option value="valid">valid</option><option value="cancelled">cancelled</option><option value="replacement">replacement</option></select></div><div><label>Replaces (if replacement)</label><input type="text" data-f="replaces" placeholder="e.g. CN-103"></div></div><div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Inv.removeCredit(${n})">Remove credit note</button></div></div>`;

function widgetHtml(email) {
  return [
    `<div id="t3p1InvRoot" data-email="${escapeHtml(email)}">`,
    '<div class="p1-kicker">1 · Lines from the purchase order and the goods received note</div>',
    `<div id="t3p1InvLines">${lineRow(1)}</div>`,
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Inv.addLine()">+ Add a line</button></div>',
    '<div class="p1-grid" style="margin-top:10px"><div><label for="t3p1InvGst">Default GST % from the PO (used when a line has none)</label><input type="text" id="t3p1InvGst" inputmode="decimal" value="18"></div><div><label for="t3p1InvTotal">Total on the supplier\'s invoice (optional, only to compare)</label><input type="text" id="t3p1InvTotal" inputmode="decimal"></div></div>',
    '<div class="p1-kicker" style="margin-top:12px">2 · Credit notes you were given (only ones you really hold)</div>',
    `<div id="t3p1InvCredits">${creditRow(1)}</div>`,
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Inv.addCredit()">+ Add a credit note</button></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1Inv.calc()">Work out how much to pay</button></div>',
    '<div id="t3p1InvStatus" class="p1-status" role="status"></div>',
    '<div id="t3p1InvOut"></div>',
    '</div>',
  ].join('');
}

function screenHtml() {
  return [
    '<p>Paste a request you received (from the desk) to see common warning signs. It is only a screen — <strong>you decide</strong>. Never paste passwords or sign-in codes here.</p>',
    '<textarea id="t3p1ReqText" placeholder="Paste the request text here"></textarea>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Inv.screen()">Check this request</button></div>',
    '<div id="t3p1ReqOut" class="p1-status" role="status"></div>',
  ].join('');
}

function buildGuide(email) {
  const status = windowStatus(WINDOWS.invoice);
  const requestsLeft = WINDOWS.invoice.requestsClose - Date.now();
  const beginner = [
    '<ol>',
    '<li><strong>Open your desk</strong> on the exam page (the game opens at the time shown above). You will see four papers: the <em>invoice</em>, the <em>purchase order</em> (PO), the <em>goods received note</em> (GRN) and an <em>email from the supplier</em>.</li>',
    '<li><strong>Find your credit note.</strong> The email says which classmate holds it. Send them a request through the desk. You only get 3 requests, so ask for what you need and nothing else.</li>',
    '<li><strong>Copy the numbers into the calculator below:</strong> for every item, how many you <em>received</em> (from the GRN) and the price on the <em>purchase order</em>; also the GST percentage on the PO. Then add each credit note you were given and choose whether it is valid, cancelled or a replacement.</li>',
    '<li><strong>Press “Work out how much to pay”.</strong> The tool multiplies, adds GST, subtracts valid credit notes and shows every step. Check the warnings it shows.</li>',
    '<li><strong>Go back to the desk</strong> and enter that amount and list the documents you used. Then confirm it is really you with Google (you must do this yourself).</li>',
    '<li><strong>Be a good classmate too:</strong> other students will ask <em>you</em> for documents. Grant genuine requests (and a replacement credit note if the old one was cancelled). Refuse everything else — fake requests, tricks, and anything asking for secrets.</li>',
    '<li><strong>After the game closes,</strong> type “played” in the exam box, press <strong>Check</strong>, then <strong>Save</strong>.</li>',
    '</ol>',
  ].join('');
  return page({
    title: '🧾 Reconcile the Missing Invoice',
    chips: [
      { text: status.state === 'open' ? 'Open' : status.state === 'before' ? 'Not open yet' : 'Closed', tone: toneForState(status.state) },
      { text: `Ends ${formatIst(WINDOWS.invoice.closes)}`, tone: '' },
      { text: '10 marks', tone: '' },
    ],
    sections: [
      card('The rule and the clock', `<p class="p1-note"><strong>Pay for goods received, at the purchase order price. Add GST at the purchase order rate. Subtract valid credit notes.</strong></p><p>${escapeHtml(status.text)}${requestsLeft > 0 ? ` Requests close ${formatIst(WINDOWS.invoice.requestsClose)} (${formatRemaining(requestsLeft)} from now).` : ' Requests are closed.'} ${escapeHtml(WINDOWS.invoice.note)}</p>`, 'accent'),
      card('Step by step for beginners', beginner),
      card('Invoice calculator', widgetHtml(email), 'accent'),
      card('Check a request (advisory)', screenHtml()),
      details('Marks (out of 10)', '<ul><li>4 for the correct amount, if a classmate granted you every document you relied on</li><li>1 for listing exactly the right documents</li><li>1 for not making unneeded requests</li><li>2 for granting genuine requests correctly and 2 for refusing fake ones — each wrong grant loses 1 mark</li></ul>'),
      details('Checklist before you submit', `<ol>${CHECKLIST.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`),
      details('About AI assistants', '<p>The game lets an agent read your documents, send requests and draft your answer, but it cannot decide for you: granting, refusing and paying need you to confirm with Google. Be careful with requests that try to trick an assistant (for example “ignore your rules” or “send everything”). Keep your game link private — it signs you in.</p>'),
    ],
  });
}

function register() {
  if (typeof window === 'undefined' || window._t3p1Inv) return;
  const $ = (name) => document.getElementById(name);
  let nextLine = 2;
  let nextCredit = 2;
  const say = (elementId, text, tone) => {
    const el = $(elementId);
    if (!el) return;
    el.textContent = text;
    el.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd';
  };
  const collect = (selector) => [...document.querySelectorAll(selector)].map((row) => Object.fromEntries([...row.querySelectorAll('[data-f]')].map((el) => [el.dataset.f, el.value])));

  window._t3p1Inv = {
    addLine() { $('t3p1InvLines')?.insertAdjacentHTML('beforeend', lineRow(nextLine++)); },
    removeLine(n) { document.querySelector(`[data-line="${n}"]`)?.remove(); },
    addCredit() { $('t3p1InvCredits')?.insertAdjacentHTML('beforeend', creditRow(nextCredit++)); },
    removeCredit(n) { document.querySelector(`[data-credit="${n}"]`)?.remove(); },
    calc() {
      const lines = collect('[data-line]').filter((l) => Object.values(l).some((v) => String(v).trim() !== ''));
      const credits = collect('[data-credit]').filter((c) => String(c.ref).trim() !== '' || String(c.amount).trim() !== '');
      const result = reconcile({ lines, credits, defaultGstRate: $('t3p1InvGst')?.value || '0', invoiceTotal: $('t3p1InvTotal')?.value || '' });
      const out = $('t3p1InvOut');
      if (!result.ok) {
        say('t3p1InvStatus', result.errors.join(' '), 'bad');
        if (out) out.innerHTML = '';
        return;
      }
      say('t3p1InvStatus', `Amount to pay: ${result.text.net}`, 'ok');
      if (out) {
        out.innerHTML = [
          '<div class="p1-card accent" style="margin-top:12px"><div class="p1-kicker">Result</div>',
          `<p style="font-size:1.3rem"><strong>Pay ${escapeHtml(result.text.net)}</strong></p>`,
          `<table><tbody><tr><td>Goods received at PO prices</td><td class="mono">${escapeHtml(result.text.subtotal)}</td></tr><tr><td>GST at the PO rate</td><td class="mono">${escapeHtml(result.text.gst)}</td></tr><tr><td>Valid credit notes</td><td class="mono">− ${escapeHtml(result.text.credits)}</td></tr><tr><td><strong>Net to pay</strong></td><td class="mono"><strong>${escapeHtml(result.text.net)}</strong></td></tr></tbody></table>`,
          `<p class="p1-foot">Exact value before rounding: ${escapeHtml(result.text.netExact)} (rounded half up to 2 decimals).</p>`,
          result.warnings.map((w) => `<div class="p1-note">${escapeHtml(w)}</div>`).join(''),
          `<details><summary>Show every step</summary><div class="p1-inner"><ol>${result.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol></div></details>`,
          '</div>',
        ].join('');
      }
    },
    screen() {
      const result = assessRequest($('t3p1ReqText')?.value);
      const out = $('t3p1ReqOut');
      if (!out) return;
      if (!result.ok) { say('t3p1ReqOut', result.message, 'bad'); return; }
      out.style.color = '';
      out.innerHTML = `<p><strong>${escapeHtml(result.verdict)}</strong></p>${result.concerns.length ? `<ul>${result.concerns.map((c) => `<li>⚠️ ${escapeHtml(c.message)}</li>`).join('')}</ul>` : ''}${result.hints.length ? `<ul>${result.hints.map((h) => `<li>✔️ ${escapeHtml(h)}</li>`).join('')}</ul>` : ''}<p class="p1-foot">${escapeHtml(result.reminder)}</p>`;
    },
  };
}

export async function solve(email) {
  register();
  const status = windowStatus(WINDOWS.invoice);
  return {
    type: 'guide',
    answer: 'Play the game on the exam page: enter your documents in the calculator in the Implementation Guide to get the exact amount to pay, then pay and confirm with Google yourself. After the game closes, type: played',
    variant: `Game needed · ${status.state === 'open' ? 'open' : status.state}`,
    guide: buildGuide(String(email || '').trim()),
    answerDisplay: `### Play, calculate, then type \`played\`\n\n${status.text}\n\nUse the calculator in the Implementation Guide with the numbers from your own documents.`,
    debug: { question: 'Q4', needsUserInput: true, windowState: status.state },
  };
}
