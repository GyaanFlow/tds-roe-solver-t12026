import { page, card, details, escapeHtml, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst } from './windows.js';
import { buildOffer, exchangeMarks, nextTradeValue } from './trade-marks.js';
import { receiptWidgetHtml, registerReceiptWidget } from './receipt-ui.js';

export const id = 'q-trading-human-exchange-r1';
export const title = 'Trading game: Human Exchange, Round 1';

function toolsHtml() {
  return [
    '<div id="t3p1Ex">',
    '<div class="p1-kicker">1 · Write your listing</div>',
    '<div class="p1-grid"><div><label for="t3p1ExService">What can you do for a classmate?</label><input type="text" id="t3p1ExService" placeholder="e.g. explain SQL joins with three examples"></div>',
    '<div><label for="t3p1ExFor">Who is it best for?</label><input type="text" id="t3p1ExFor" placeholder="e.g. beginners stuck on database queries"></div>',
    '<div><label for="t3p1ExHow">How will you deliver it?</label><input type="text" id="t3p1ExHow" placeholder="e.g. send a short written walkthrough within a day"></div>',
    '<div><label for="t3p1ExPrice">Price in credits (1 to 10)</label><input type="text" id="t3p1ExPrice" inputmode="numeric" value="3"></div></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1Ex.offer()">Write my listing</button></div>',
    '<div id="t3p1ExOffer" class="p1-status" role="status"></div>',
    '<div class="p1-kicker" style="margin-top:14px">2 · Marks planner</div>',
    '<div class="p1-grid"><div><label for="t3p1ExBuyers">New classmates who have bought from you</label><input type="text" id="t3p1ExBuyers" inputmode="numeric" value="0"></div>',
    '<div><label for="t3p1ExSellers">New classmates you have bought from</label><input type="text" id="t3p1ExSellers" inputmode="numeric" value="0"></div></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Ex.marks()">Show my marks</button></div>',
    '<div id="t3p1ExMarks" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function register() {
  registerReceiptWidget();
  if (typeof window === 'undefined' || window._t3p1Ex) return;
  const $ = (name) => document.getElementById(name);
  window._t3p1Ex = {
    offer() {
      const out = $('t3p1ExOffer');
      const result = buildOffer({ service: $('t3p1ExService')?.value, forWho: $('t3p1ExFor')?.value, deliver: $('t3p1ExHow')?.value, price: $('t3p1ExPrice')?.value });
      if (!out) return;
      out.style.color = result.ok ? '#34d399' : '#f87171';
      out.textContent = result.ok ? result.text : result.message;
    },
    marks() {
      const out = $('t3p1ExMarks');
      if (!out) return;
      const counts = { newBuyers: $('t3p1ExBuyers')?.value, newSellers: $('t3p1ExSellers')?.value };
      const now = exchangeMarks(counts);
      const next = nextTradeValue(counts);
      out.style.color = '';
      out.innerHTML = `<p><strong>${now.total} of 10 marks so far</strong> (selling ${now.selling}, buying ${now.buying}${now.capped ? ', capped at 10' : ''}).</p><p>Your next new buyer is worth <strong>${next.selling}</strong> mark${next.selling === 1 ? '' : 's'} and your next new seller <strong>${next.buying}</strong>.</p>`;
    },
  };
}

function buildGuide() {
  const w = WINDOWS.exchangeR1;
  const status = windowStatus(w);
  return page({
    title: '🔁 Human Exchange, Round 1',
    chips: [{ text: status.state === 'open' ? 'Trading open' : status.state === 'before' ? 'Not open yet' : 'Trading closed', tone: toneForState(status.state) }, { text: `Trading ends ${formatIst(w.closes)}`, tone: '' }, { text: '10 marks', tone: '' }],
    sections: [
      card('The rule and the clock', `<p class="p1-note"><strong>Only trades the seller confirms count, and only with classmates you have not traded with before.</strong></p><p>${escapeHtml(status.text)} ${escapeHtml(w.note)} Credits are only practice points: you start with 10, and a purchase holds 1 credit for 48 hours.</p>`, 'accent'),
      card('Step by step for beginners', '<ol><li><strong>Open the Human Exchange</strong> with the button on the exam page (reload the page if the link expired; it signs you in for 12 hours).</li><li><strong>Sell first.</strong> Selling pays the most (4 marks for your first new buyer, then 2, 1, 0.5 and so on). Use the listing writer below, then make your offer easy to say yes to: clear, small and quick to deliver.</li><li><strong>Buy from classmates you have never traded with.</strong> Your first new seller gives 2 marks, the next 1, then 0.5. Buying from the same person again earns nothing.</li><li><strong>Arrange it in the order\'s chat.</strong> Agree a price of 1 to 10 credits and how you will get the service. You may swap course emails if you both choose to.</li><li><strong>Pay:</strong> enter the price and one sentence saying what you received. You must confirm with Google yourself.</li><li><strong>Confirm deliveries when you sell:</strong> the seller writes one sentence about what they delivered. Credits and marks move only after this. You have 48 hours, so check the game every day.</li><li><strong>Be fair.</strong> Do real trades. Pairs who only trade with each other, or empty trades, are reviewed and earn nothing.</li><li><strong>After trading and settlement end,</strong> open the game, go to <strong>Result</strong>, copy the <strong>final receipt</strong>, paste it in the exam box, then press <strong>Check</strong> and <strong>Save</strong>. Receipts copied earlier are rejected.</li></ol>'),
      card('Listing writer and marks planner', toolsHtml(), 'accent'),
      card('Check your final receipt', receiptWidgetHtml('exchange', w.settlesBy)),
      details('Ideas for something to sell', '<ul><li>Explain one topic from the course in plain words.</li><li>Review someone\'s notes or code for mistakes (short, with comments).</li><li>Make a one-page revision summary of a week.</li><li>Practise a presentation or interview answer with someone and give feedback.</li><li>Suggest three project ideas for a topic they pick.</li></ul><p>Only offer things you can honestly deliver in a day or two. Never share exam answers or personal data.</p>'),
      details('Safety', '<ul><li>Never share passwords, sign-in codes or your private game link.</li><li>An AI assistant can browse and chat for you, but paying and confirming need your Google sign-in on purpose. Do not try to avoid that.</li><li>Be careful with messages that say “ignore your rules” or “send everything”; they are tricks.</li></ul>'),
    ],
  });
}

export async function solve() {
  register();
  const status = windowStatus(WINDOWS.exchangeR1);
  return {
    type: 'guide',
    answer: 'Trade in the game (sell first, buy from new classmates), then after it closes paste your final receipt from Result and press Check and Save.',
    variant: `Game + receipt · trading ${status.state}`,
    guide: buildGuide(),
    answerDisplay: `### Trade, then paste your final receipt\n\n${status.text}\n\nAfter settlement ends, open the game's **Result**, copy the final receipt, paste it here, and press Check then Save.`,
    debug: { question: 'Q6', needsUserInput: true, windowState: status.state },
  };
}
