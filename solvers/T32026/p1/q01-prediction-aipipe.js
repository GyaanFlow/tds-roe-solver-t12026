import { page, card, details, escapeHtml, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst } from './windows.js';
import { snapshot, snapshotFetchedAt } from './aipipe-usage-snapshot.js';
import * as F from './aipipe-forecast.js';

export const id = 'q-prediction-aipipe-server';
export const title = 'Predict AI Pipe usage: 2–8 November 2026';
export const FEED_URL = 'https://stats.aipipe.org/usage.json';

const DEFAULTS = { sigma: 0.5, scale: 1 };

/**
 * Everything the forecast panel shows, as one pure function: the feed in, a recommendation and a draft reason out.
 * `previous` is what this student last recorded ({ label, fp }), used to tell new evidence from a refreshed copy.
 */
export function analyze({ feed, sigma = DEFAULTS.sigma, scale = DEFAULTS.scale, limits = F.DEFAULT_LIMITS, previous = null, samples = 20000, now = Date.now() }) {
  const summary = F.summarize(feed);
  if (summary.count === 0) return { ok: false, message: 'The feed has no completed days yet, so there is nothing to learn from.' };
  const plan = F.planTargetWeek(feed, { targetStart: WINDOWS.market.targetStart, targetEnd: WINDOWS.market.targetEnd });
  const fingerprint = F.reportFingerprint(feed);
  const forecast = F.forecastWeek(plan.history, {
    daysToSimulate: plan.daysToSimulate,
    known: plan.known,
    scale,
    sigma,
    samples,
    limits,
    seed: F.hashSeed(`${fingerprint}|${sigma}|${scale}|${limits.join(',')}`),
  });
  if (!forecast.ok) return forecast;
  const choice = forecast.ranges[forecast.best.index];
  const evidence = F.compareReports(previous?.fp, fingerprint);
  const reason = F.draftReason({
    summary, forecast, choice, planned: plan,
    previousChoice: previous?.label && previous.label !== choice.label ? previous.label : '',
    newEvidence: previous?.fp && evidence.different ? evidence.reason : '',
  });
  const warnings = [];
  if (summary.count < 7) warnings.push(`Only ${summary.count} completed days are available, so the spread is wide and the uncertainty setting matters. Revisit when new reports arrive.`);
  // A stale feed (for example the built-in copy opened weeks later) would quietly give out-of-date numbers.
  const newest = feed.days.filter((d) => d.usable).map((d) => d.date).sort().at(-1);
  const ageDays = (now - Date.parse(`${newest}T00:00:00Z`)) / 86400000;
  if (ageDays > 3) warnings.push(`The newest completed day in this feed is ${newest}, about ${Math.floor(ageDays)} days ago. Open ${FEED_URL}, copy the whole page and paste it above for current numbers.`);
  if (plan.usingTargetDaysAsHistory) warnings.push('All completed days fall inside the target week, so they are also used as the history for the remaining days.');
  return { ok: true, summary, plan, forecast, choice, fingerprint, evidence, reason, warnings };
}

/* ------------------------------ the page ------------------------------ */

const pct = (p) => `${(p * 100).toFixed(p < 0.01 ? 2 : 1)}%`;
const money = (v) => (v >= 100 ? `$${v.toFixed(0)}` : `$${v.toFixed(2)}`);

function widgetHtml(email) {
  const priceInputs = F.buildRanges().map((range) => `<div><label for="t3p1Price${range.index}">${escapeHtml(range.label)}</label><input type="number" id="t3p1Price${range.index}" min="0" max="1" step="0.001" placeholder="price"></div>`).join('');
  return [
    `<div id="t3p1Q1Root" data-email="${escapeHtml(email)}">`,
    '<div class="p1-kicker">1 · Load the usage feed</div>',
    `<p>The public feed at <a href="${FEED_URL}" target="_blank" rel="noopener noreferrer">stats.aipipe.org/usage.json</a> lists each UTC day's <code>total.spend_usd</code>. The forecast loads it live when you run it. If you are offline or it is blocked, the built-in copy is used, or you can open the link, copy the whole page and paste it below.</p>`,
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1Q1.live()">Load live feed</button><button type="button" class="p1-btn ghost" onclick="window._t3p1Q1.snapshot()">Use built-in copy</button><button type="button" class="p1-btn ghost" onclick="window._t3p1Q1.pasted()">Use pasted JSON</button></div>',
    '<label for="t3p1Feed" style="margin-top:10px">Paste feed JSON (optional)</label><textarea id="t3p1Feed" spellcheck="false" placeholder=\'{"schema_version":1,"days":[…]}\'></textarea>',
    '<div id="t3p1FeedInfo" class="p1-status" role="status"></div>',
    '<div class="p1-kicker" style="margin-top:12px">2 · Settings</div>',
    '<div class="p1-grid"><div><label for="t3p1Sigma">Demand-shift uncertainty (0 = none, 0.5 = wide)</label><input type="number" id="t3p1Sigma" min="0" max="3" step="0.05" value="0.5"></div><div><label for="t3p1Scale">Growth factor for the target week (1 = same as recent days)</label><input type="number" id="t3p1Scale" min="0.05" max="20" step="0.05" value="1"></div></div>',
    '<label for="t3p1Limits" style="margin-top:10px">Range lower limits in US dollars (change these if the market\'s ranges differ)</label>',
    `<input type="text" id="t3p1Limits" value="${F.DEFAULT_LIMITS.join(', ')}">`,
    '<details style="margin-top:10px"><summary>Market prices (optional — enter what the market shows)</summary><div class="p1-inner"><p>Price per share in credits for each range. The table then shows your edge: your chance minus the price.</p>',
    `<div class="p1-grid">${priceInputs}</div></div></details>`,
    '<div class="p1-actions"><button type="button" class="p1-btn" id="t3p1RunBtn" onclick="window._t3p1Q1.run()">Run forecast</button></div>',
    '<div id="t3p1Status" class="p1-status" role="status"></div>',
    '<div id="t3p1Out"></div>',
    '<div class="p1-kicker" style="margin-top:12px">3 · Your reason (edit it in your own words)</div>',
    '<textarea id="t3p1Reason" spellcheck="true" style="min-height:130px;font-family:inherit;font-size:13px"></textarea>',
    '<div id="t3p1ReasonInfo" class="p1-foot"></div>',
    '<div class="p1-kicker" style="margin-top:12px">4 · Keep a record</div>',
    '<p>After you save a prediction in the market, press the button so this page can tell you later whether a genuinely new report has arrived (refreshing the same report does not count). The record stays in this browser only.</p>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Q1.record()">I saved this prediction</button><button type="button" class="p1-btn ghost" onclick="window._t3p1Q1.forget()">Clear my record</button></div>',
    '<div id="t3p1Record" class="p1-status"></div>',
    '</div>',
  ].join('');
}

function lmsrHtml() {
  return [
    '<p>The market prices trades with a rule called LMSR. For a buy in one range priced at <em>p</em>, with liquidity <em>b</em>: <code>cost = b·ln(1 + p·(e^(shares/b) − 1))</code>. You do not know <em>b</em>, but one quote from the market reveals it.</p>',
    '<div class="p1-grid"><div><label for="t3p1Lp">Price p (credits per share, 0–1)</label><input type="number" id="t3p1Lp" min="0" max="1" step="0.001" value="0.059"></div>',
    '<div><label for="t3p1Lb">Liquidity b (leave empty to estimate)</label><input type="number" id="t3p1Lb" min="0" step="any"></div>',
    '<div><label for="t3p1Lq1">Quote: shares you tried</label><input type="number" id="t3p1Lq1" min="0" step="any"></div>',
    '<div><label for="t3p1Lq2">Quote: cost the market showed</label><input type="number" id="t3p1Lq2" min="0" step="any"></div>',
    '<div><label for="t3p1Lbudget">Credits you would spend</label><input type="number" id="t3p1Lbudget" min="0" step="any" value="10"></div></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Q1.lmsr()">Calculate</button></div>',
    '<div id="t3p1Lout" class="p1-status" role="status"></div>',
  ].join('');
}

function buildGuide(email) {
  const status = windowStatus(WINDOWS.market);
  return page({
    title: '📈 Predict AI Pipe usage',
    chips: [
      { text: status.state === 'open' ? 'Trading open' : 'Trading closed', tone: toneForState(status.state) },
      { text: `Closes ${formatIst(WINDOWS.market.closes)}`, tone: '' },
      { text: 'Result token after 9–16 Nov', tone: 'warn' },
    ],
    sections: [
      card('What this question needs', '<p>Predict the <strong>total AI Pipe cost for 2–8 November 2026</strong> (seven completed UTC days, the sum of each day\'s <code>total.spend_usd</code>) by choosing one of 17 cost ranges in the market. The answer box takes the <strong>signed result token</strong> you copy from the market <em>after</em> it is settled — it does not exist yet, and it cannot be computed here.</p><p class="p1-note">Your sign-in code is private: anyone with it can trade as you. Never paste it into this page or the answer box, and do not spend real AI Pipe usage to influence a practice market.</p>', 'accent'),
      card('How the marks work', '<ul><li><strong>10% participation</strong> — save a prediction before trading closes.</li><li><strong>22.5% early participation</strong> — the earlier your first prediction, the more you get.</li><li><strong>45% accuracy over time</strong> — each prediction counts for how long you held it; a wrong range earns nothing for that time.</li><li><strong>22.5% evidence-based revision</strong> — change your prediction at least once after a genuinely new report arrives and explain why. Refreshing the same report or repeating the same answer does not qualify.</li></ul><p>Reasons need at least 3 words and 15 characters (up to 1,000). Trading is optional: choose a range, write a reason, leave credits at 0 and press <strong>Save prediction</strong>.</p>'),
      card('Plan', '<ol><li>On the exam page press <strong>Open AI Pipe prediction market</strong> (your private link).</li><li>Run the forecast below, pick a range and <strong>save it early</strong> with a reason.</li><li>Come back when a new report is published (about every six hours) and see whether the evidence changed; revise with an honest explanation if it did.</li><li>After settlement, copy the signed <strong>result token</strong> from the market, paste it into the answer box, then press Check and Save.</li></ol>'),
      card('Forecast tool', widgetHtml(email), 'accent'),
      details('LMSR trade calculator (optional)', lmsrHtml()),
      details('Rules to remember', '<ul><li>The target is the <strong>sum</strong> of seven completed UTC days — not an average. One cent is $0.01.</li><li>Each range includes its lower limit and excludes its upper limit (exactly $2 is in $2–$5). The total is never rounded first.</li><li>Use each day\'s <code>total.spend_usd</code> once; do not add the provider subtotals again.</li><li>An incomplete or missing day is not zero. Trading pauses if the latest report is over 12 hours old.</li><li>Five trades in any rolling four hours, twenty per UTC day, and a single trade may move any range by at most 15 percentage points.</li><li>A sale does not save a new prediction — press <strong>Save prediction</strong> separately, then check <strong>My answers</strong>.</li></ul>'),
      `<div class="p1-foot">Built-in feed copy: ${escapeHtml(snapshotFetchedAt)}. This tool gives an estimate from limited public data; it is not a promise of the result.</div>`,
    ],
  });
}

/* ------------------------------ browser wiring ------------------------------ */

const storageKey = (email) => `t3p1q1:${String(email).trim().toLowerCase()}`;
function readRecord(email) {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(storageKey(email)) || 'null');
  } catch {
    return null;
  }
}
function writeRecord(email, value) {
  try {
    if (value) globalThis.localStorage?.setItem(storageKey(email), JSON.stringify(value));
    else globalThis.localStorage?.removeItem(storageKey(email));
    return true;
  } catch {
    return false;
  }
}

function register() {
  if (typeof window === 'undefined' || window._t3p1Q1) return;
  const $ = (name) => document.getElementById(name);
  const state = { feed: null, source: '', analysis: null };
  const emailOf = () => $('t3p1Q1Root')?.dataset.email || '';
  const say = (elementId, text, tone) => {
    const el = $(elementId);
    if (!el) return;
    el.textContent = text;
    el.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd';
  };

  function adopt(parsed, source) {
    if (!parsed.ok) { say('t3p1FeedInfo', parsed.errors.join(' '), 'bad'); return false; }
    state.feed = parsed.feed;
    state.source = source;
    const usable = parsed.feed.days.filter((d) => d.usable).length;
    state.info = `${source}: ${usable} completed days${parsed.feed.publishedAt ? `, published ${parsed.feed.publishedAt}` : ''}.${parsed.warnings.length ? ` Note: ${parsed.warnings.join(' ')}` : ''}`;
    say('t3p1FeedInfo', state.info, 'ok');
    return true;
  }

  function renderRecord() {
    const record = readRecord(emailOf());
    if (!record) { say('t3p1Record', 'Nothing recorded yet in this browser.', ''); return; }
    const current = state.feed ? F.compareReports(record.fp, F.reportFingerprint(state.feed)) : null;
    say('t3p1Record', `Last recorded: ${record.label} (${new Date(record.at).toLocaleString()}). ${current ? (current.different ? `A new report has arrived — ${current.reason}` : current.reason) : 'Load the feed to compare.'}`, current && current.different ? 'ok' : '');
  }

  function showReasonInfo() {
    const reason = $('t3p1Reason');
    if (!reason) return;
    const check = F.validateReason(reason.value);
    say('t3p1ReasonInfo', check.ok ? `${check.words} words, ${check.chars}/${F.REASON_MAX_CHARS} characters — valid.` : check.message, check.ok ? 'ok' : 'bad');
  }

  window._t3p1Q1 = {
    snapshot() { adopt(F.parseFeed(snapshot), `Built-in copy (${snapshotFetchedAt})`); renderRecord(); },
    async live() {
      say('t3p1FeedInfo', 'Loading the live feed…', '');
      try {
        const response = await fetch(FEED_URL, { cache: 'no-store', credentials: 'omit' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const ok = adopt(F.parseFeed(await response.text()), 'Live feed');
        renderRecord();
        return ok;
      } catch (error) {
        say('t3p1FeedInfo', `The live feed could not be loaded (${error?.message || 'network problem'}). Use the built-in copy, or open ${FEED_URL}, copy the whole page and paste it in the box.`, 'bad');
        renderRecord();
        return false;
      }
    },
    pasted() { adopt(F.parseFeed($('t3p1Feed')?.value ?? ''), 'Pasted feed'); renderRecord(); },
    async run() {
      if (!state.feed) {
        if (!(await this.live())) this.snapshot();
      }
      if (!state.feed) return;
      // The guide may have been re-rendered (switching questions) while the loaded feed is still in use.
      if (state.info && !$('t3p1FeedInfo')?.textContent) say('t3p1FeedInfo', state.info, 'ok');
      const limitsCheck = F.parseLimits($('t3p1Limits')?.value);
      if (!limitsCheck.ok) { say('t3p1Status', limitsCheck.message, 'bad'); return; }
      const sigma = Number($('t3p1Sigma')?.value);
      const scale = Number($('t3p1Scale')?.value);
      if (!(sigma >= 0) || !(scale > 0)) { say('t3p1Status', 'Check the uncertainty (0 or more) and growth factor (above 0).', 'bad'); return; }
      const analysis = analyze({ feed: state.feed, sigma, scale, limits: limitsCheck.limits, previous: readRecord(emailOf()) });
      if (!analysis.ok) { say('t3p1Status', analysis.message, 'bad'); return; }
      state.analysis = analysis;
      const { forecast, summary, plan, choice } = analysis;
      const prices = forecast.ranges.map((range) => Number($(`t3p1Price${range.index}`)?.value));
      const rows = forecast.ranges.map((range) => {
        const p = forecast.probs[range.index];
        const price = prices[range.index];
        const hasPrice = Number.isFinite(price) && price > 0 && price < 1;
        const edge = hasPrice ? F.expectedValuePerShare(p, price) : null;
        const star = range.index === choice.index ? ' ★' : '';
        return `<tr><td>${escapeHtml(range.label)}${star}</td><td class="mono">${pct(p)}</td><td style="width:34%"><span class="bar" style="width:${Math.max(2, Math.round(p * 100))}%"></span></td><td class="mono">${hasPrice ? `${edge >= 0 ? '+' : ''}${edge.toFixed(3)}` : '—'}</td></tr>`;
      }).join('');
      const out = $('t3p1Out');
      if (out) {
        out.innerHTML = [
          `<div class="p1-card" style="margin-top:12px"><div class="p1-kicker">Result</div>`,
          `<p><strong>Most likely: ${escapeHtml(choice.label)}</strong> (${pct(forecast.probs[choice.index])})${forecast.closeCall ? ' — <span class="p1-chip warn">close call</span>' : ''}. Runner-up: ${escapeHtml(forecast.ranges[forecast.second.index].label)} (${pct(forecast.second.p)}).</p>`,
          `<p>Estimated week total: median ${money(forecast.quantiles.p50)}, middle half ${money(forecast.quantiles.p25)}–${money(forecast.quantiles.p75)}, 90% interval ${money(forecast.quantiles.p05)}–${money(forecast.quantiles.p95)}.</p>`,
          `<p class="p1-foot">Data: ${summary.count} completed days, daily spend ${money(summary.min)}–${money(summary.max)}, mean ${money(summary.mean)}, median ${money(summary.median)}. ${plan.knownCount ? `${plan.knownCount} target days already complete (${money(plan.known)}).` : 'No target-week days are complete yet.'}</p>`,
          analysis.warnings.map((w) => `<div class="p1-note">${escapeHtml(w)}</div>`).join(''),
          `<table><thead><tr><th>Range</th><th>Chance</th><th></th><th>Edge vs price</th></tr></thead><tbody>${rows}</tbody></table>`,
          '</div>',
        ].join('');
      }
      const reason = $('t3p1Reason');
      if (reason && (!reason.value.trim() || reason.dataset.auto === '1')) { reason.value = analysis.reason; reason.dataset.auto = '1'; }
      showReasonInfo();
      say('t3p1Status', `Forecast done: ${choice.label} is the most likely range.`, 'ok');
      renderRecord();
    },
    record() {
      if (!state.analysis) { say('t3p1Record', 'Run the forecast first.', 'bad'); return; }
      const ok = writeRecord(emailOf(), { label: state.analysis.choice.label, fp: state.analysis.fingerprint, at: Date.now() });
      say('t3p1Record', ok ? `Recorded ${state.analysis.choice.label}. Come back after the next report.` : 'This browser blocked saving the record.', ok ? 'ok' : 'bad');
    },
    forget() { writeRecord(emailOf(), null); renderRecord(); },
    lmsr() {
      const num = (name) => { const raw = $(name)?.value; return raw === '' || raw == null ? NaN : Number(raw); };
      const p = num('t3p1Lp');
      let b = num('t3p1Lb');
      const lines = [];
      if (!Number.isFinite(b)) {
        const est = F.estimateB(p, num('t3p1Lq1'), num('t3p1Lq2'));
        if (!est.ok) { say('t3p1Lout', `${est.message} Or type a value for b.`, 'bad'); return; }
        b = est.b;
        lines.push(`Estimated b ≈ ${b.toFixed(2)} from your quote.`);
      }
      const budget = num('t3p1Lbudget');
      const result = F.sharesForBudget(p, budget, b);
      if (!result.ok) { say('t3p1Lout', result.message, 'bad'); return; }
      lines.push(`Spending ${budget} credits buys about ${result.shares.toFixed(2)} shares at an average price of ${result.averagePrice.toFixed(4)}; the range's price rises from ${p} to ${result.priceAfter.toFixed(4)}.`);
      if (F.exceedsMoveCap(p, result.priceAfter)) lines.push('That moves the range by more than 15 percentage points, so the market would reject it. Spend less.');
      say('t3p1Lout', lines.join(' '), 'ok');
    },
  };
  document.addEventListener?.('input', (event) => {
    if (event.target?.id === 't3p1Reason') { event.target.dataset.auto = '0'; showReasonInfo(); }
  });
}

export async function solve(email) {
  register();
  const status = windowStatus(WINDOWS.market);
  return {
    type: 'guide',
    answer: 'No result token exists yet — the market must be settled first (9–16 November). Until then: open the market from your exam page, save a prediction with a reason, and revise it when new evidence arrives. After settlement, paste the signed result token here.',
    variant: `Prediction market · ${status.state === 'open' ? 'trading open' : 'trading closed'}`,
    guide: buildGuide(String(email || '').trim()),
    answerDisplay: '### Waiting for settlement\n\nThe signed **result token** appears in the market only after the result is set (9–16 November). Use the Implementation Guide to forecast, save and revise your prediction until then.',
    debug: { question: 'Q1', needsUserInput: true, tradingStatus: status.state },
  };
}
