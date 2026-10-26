// Audit snapshot of https://exam.sanand.workers.dev/exam-tds-2026-09-p1.js (prettier 3.4.2), fetched 2026-10-26.
// check.mjs compares the question ids, titles and order in this file with the registry. Do not edit.
var E = Object.defineProperty;
var h = (r, n) => () => (r && (n = r((r = 0))), n);
var p = (r, n) => {
  for (var e in n) E(r, e, { get: n[e], enumerable: !0 });
};
var x = {};
p(x, { default: () => z });
import { html as m } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function z({ user: r, weight: n = 1 }) {
  let e = "q-prediction-aipipe-server",
    s = "Predict AI Pipe usage: 2\u20138 November 2026",
    d = new URLSearchParams({
      email: r.email,
      quizSign: r.quizSign || "",
      questionId: e,
    }),
    a,
    i;
  try {
    let t = await fetch(`./questionData?${d}`),
      o = await t.json();
    if (!t.ok) throw new Error(o.error || "Unable to load your sign-in code.");
    a = o;
  } catch (t) {
    i = t.message;
  }
  let c = m`
    <div class="mb-3">
      <p>Predict the <strong>total AI Pipe cost in US dollars for 2–8 November 2026</strong>, using UTC dates.
        Add the seven daily <code>total.spend_usd</code> values from the
        <a href="https://stats.aipipe.org/usage.json" target="_blank" rel="noreferrer">public usage feed</a>.</p>
      <p>The market offers 17 cost ranges, from 0–1¢, 1–2¢, 2–5¢ and higher, through $500–$1,000 and $1,000 or more.
        Each range includes its lower limit and excludes its upper limit: exactly 1¢ belongs in 1–2¢. The total is not rounded before choosing the winning range.</p>
      <p>Choose a cost range in the market. Read new reports, update your prediction, and explain your reasons.
        Trading closes on <strong>9 November at 00:00 UTC</strong>. Start early: your marks depend on
        how long you hold each prediction and how you use new evidence. Trading credits are optional practice points.</p>
      ${
        a
          ? m`
        <p><a href="${a.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open AI Pipe prediction market</a></p>
        <label for="${e}-signin" class="form-label">Your personalized sign-in code for ${a.email}</label>
        <textarea id="${e}-signin" class="form-control font-monospace" rows="4" readonly spellcheck="false">${a.launch_token}</textarea>
        <p class="form-text">Keep this code private. Anyone with this code, including another student or an AI agent, can trade as you, make unwanted trades, and use up your credits and trading turns. The link signs you in automatically, or you can paste the code into the market's sign-in form.
          It expires after 20 minutes. Reload this exam to get a new code.</p>
      `
          : m`<p class="alert alert-warning" role="alert">${i} Reload this exam to try again.</p>`
      }
      <h2 class="h6">Rules: what counts, and when</h2>
      <ul>
        <li>The target is the <strong>sum of seven completed UTC days</strong>, not an average, token count, number of users, or your own bill.
          One cent is $0.01. The market uses the unrounded total, so exactly $2 belongs in $2–$5, not $1–$2.</li>
        <li>Use each day's <code>total.spend_usd</code> once. Do not add the provider subtotals again.
          Free models, personal provider keys, and unmetered requests are outside this feed's totals.</li>
        <li>Before 2 November, recent costs are comparison data. During the week, the displayed total includes only completed target days.
          Today's incomplete row is excluded. Missing or unavailable data is not zero.</li>
        <li>The feed is normally published every six hours; the market checks hourly and retains completed days as they leave the seven-day feed.
          Reports can be revised. Trading pauses if the latest report is more than 12 hours old.</li>
        <li>Trading ends on <strong>9 November, 00:00 UTC (05:30 IST)</strong>. The teacher sets the result during 9–16 November,
          once all seven completed daily costs are available. A missing day delays the result; it is never guessed as zero.</li>
      </ul>

      <details class="mb-3">
        <summary class="fw-semibold">How prices, shares, and credits work</summary>
        <ul class="mt-2">
          <li>You begin with <strong>1,000 practice credits</strong>. These are not US dollars or real money.
            Each share pays <strong>1 credit if its range wins, 0 otherwise</strong>. That is the payout, not your profit: subtract what you spent.</li>
          <li>An automated market maker, called LMSR, quotes trades without needing another student to take the opposite side.
            Buying a range raises its price and lowers the others; selling does the reverse. A large order changes its own price as it executes.</li>
          <li>A price of 0.20 credits per share can be read as a market-implied chance of about 20%.
            All 17 ranges start equally likely (about 5.9% each). Those starting prices are not a forecast from usage data.
            Later prices reflect trades, not a guaranteed result.</li>
          <li>Choose <strong>Spend credits</strong> for a fixed budget, or <strong>Buy shares</strong> for a fixed quantity.
            The displayed share price times your quantity is only an estimate because prices move during the order.
            Always use <strong>Review trade</strong>, read the total cost and quantity, then <strong>Confirm trade</strong>.</li>
          <li>If another action changes the quote, review it again. Your amount must not be silently changed.
            In <strong>Your shares</strong>, sell some or all of an owned holding by explaining why, reviewing the credits returned, then confirming.
            You cannot sell shares you do not own or spend credits you do not have.</li>
          <li>You may make <strong>five trades in any rolling four hours</strong>, with a further cap of <strong>20 per UTC day</strong>.
            Buys and sales both count. There is no fixed wait between trades while slots remain.
            One trade may move any range's chance by at most <strong>15 percentage points</strong>; an oversized order is rejected.</li>
        </ul>
      </details>

      <details class="mb-3">
        <summary class="fw-semibold">How to earn marks</summary>
        <p class="mt-2"><strong>Trading is optional.</strong> Choose your range, write a reason, leave credits at 0, and press
          <strong>Save prediction</strong>. You can do this even after spending all your credits. Saving a prediction uses no trading slot.</p>
        <ul>
          <li><strong>10% participation:</strong> save a prediction before trading closes.</li>
          <li><strong>45% accuracy over time:</strong> each prediction counts for how long you kept it during the full market window.
            Time before your first answer earns no accuracy credit. In the page's single-choice mode, a wrong range gets no accuracy credit for that time,
            even if it is next to the winning range.</li>
          <li><strong>22.5% early participation:</strong> the earlier your first prediction, the larger this component.</li>
          <li><strong>22.5% evidence-based revision:</strong> change your prediction at least once after a genuinely different source report arrives,
            and explain the change. Refreshing the same report, using dummy data, or repeating the same answer does not qualify.</li>
        </ul>
        <p>Reasons need at least <strong>3 words and 15 characters</strong>, up to 1,000 characters. More words or trades do not earn more marks.
          The computer checks these rules; it does not use AI to judge the quality of your writing. Credit profits do not increase your marks.</p>
        <p>A confirmed buy also saves the prediction selected in that form. A sale changes your holdings but does not save a new prediction:
          use <strong>Save prediction</strong> separately when your view changes. Check <strong>My answers</strong> after every action.
          Notes saved after the close cannot improve your marks.</p>
      </details>

      <details class="mb-3">
        <summary class="fw-semibold">Strategies and useful habits</summary>
        <ol class="mt-2">
          <li><strong>Start with a baseline.</strong> Estimate a typical completed day's cost, then multiply by seven.
            For example, a hypothetical $2 per day suggests $14 for the week, in the $10–$20 range. State how much data supports your estimate.</li>
          <li><strong>Update the remaining days.</strong> During the week, estimate
            <code>completed target-day total + remaining days × expected daily cost</code>.
            For example, $8 across three completed days plus four more days at $2 suggests $16.
            Consider deadlines, weekends, model choices, and changing demand rather than assuming every day will be identical.</li>
          <li><strong>Track uncertainty near a boundary.</strong> A $9.90 estimate is close to $10, so a small change could move the answer to another range.
            Explain a plausible low and high total. Revisit your choice when new evidence arrives; do not change it just to generate activity.</li>
          <li><strong>Compare your belief with the price.</strong> If you think a range has a 20% chance, its expected payout is 0.20 credits per share.
            A lower average purchase price may offer value; a higher price may not. This is a way to reason about a trade, not a promise of profit.
            Review the whole order because buying pushes the price upward.</li>
          <li><strong>Keep room to act.</strong> Start with small trades and retain credits and trading slots for later evidence.
            You can hold several ranges to spread trading risk, but your page prediction is still one selected range.
            Selling part of a holding can reduce risk or recover credits; it can also give up a later winning payout.</li>
          <li><strong>Keep a clear record.</strong> Write the dates and costs you used, your estimated total, and what would change your mind.
            Separate your evidence from the crowd's prices. Save early, then return for genuinely new reports.</li>
        </ol>
      </details>

      <details class="mb-3">
        <summary class="fw-semibold">Things to avoid</summary>
        <ul class="mt-2">
          <li>Do not confuse cents, US dollars, practice credits, or shares. Do not round the cost before choosing a range.</li>
          <li>Do not treat today's partial cost, missing data, or a pre-November comparison report as a completed target day.</li>
          <li>Do not chase the most popular range or buy a cheap range just because it looks cheap.
            Check the evidence and the price you would actually pay.</li>
          <li>Do not assume buying then immediately selling will return all your credits, or that the displayed sale estimate is guaranteed.</li>
          <li>Do not wait until the last day, spend all your credits at once, or use all five trade slots without a reason.
            More trades and forced answer changes do not improve your score.</li>
          <li>Do not spend real AI Pipe usage just to influence a market with practice credits.</li>
          <li>Keep your sign-in code private. Sharing your choice and sharing your reason are separate controls, private by default.
            You can change sharing later, but someone may already have copied what you shared.</li>
          <li>If a request is interrupted, check <strong>My answers</strong> and <strong>Your shares</strong> before submitting again.
            Do not repeatedly confirm an action whose result you have not checked.</li>
          <li>Do not submit your sign-in code as your answer. After settlement, get the signed <strong>result token</strong>, then Check and Save it here.</li>
        </ul>
      </details>

      <h2 class="h6">What to submit</h2>
      <p>After the market's final result is set (9–16 November), copy your signed result token from the market and paste it below.
        Your sign-in code is not a result token. Until settlement, no final result token is available.</p>
      <label for="${e}" class="form-label"><strong>Prediction market result token</strong></label>
      <textarea id="${e}" name="${e}" class="form-control font-monospace" rows="6" spellcheck="false" placeholder="Paste your signed result token after settlement"></textarea>
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: n,
    question: c,
    answer: async (t) => {
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: r.email,
            quizSign: r.quizSign,
            questionId: e,
            response: t,
            weight: n,
          }),
        }),
        l = await o.json();
      if (!o.ok)
        throw new Error(l.error || "Unable to verify your market result.");
      return l;
    },
  };
}
var S = h(() => {
  "use strict";
});
var T = {};
p(T, { default: () => D });
import { html as y } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function D({ user: r, weight: n = 1 }) {
  let e = "q-audio-tds-human-exchange",
    s = "TDS Human Exchange: Offer something useful",
    d = new URLSearchParams({
      email: r.email,
      quizSign: r.quizSign || "",
      questionId: e,
    }),
    a,
    i;
  try {
    let t = await fetch(`./questionData?${d}`),
      o = await t.json();
    if (!t.ok)
      throw new Error(
        o.error || "Unable to load your personal recording link.",
      );
    a = o;
  } catch (t) {
    i = t.message;
  }
  let c = y`
    <div class="mb-3">
      <p>Imagine a marketplace where TDS students can buy services from each other using credits.
        <strong>Offer a service that another student would find useful.</strong>
        It can be about anything, not just TDS. It must be legal and follow the IITM BS programme guidelines.</p>
      <p>You can use AI agents to plan your offering, prepare a script, and later deliver the service.
        Your task now is to <strong>record up to 60 seconds</strong> explaining your promise.
        Your latest submitted recording will become your marketplace offer, with its audio and transcript.
        Buyers should understand exactly what they would receive.</p>
      <p><strong>When the marketplace opens:</strong> You can buy and sell services as often as you wish.
        The buyer and seller agree on a price in credits. We will record each trade when both agree to it.</p>
      <p>Offers will appear in random order by default.
        You will be able to sort them by total credits traded, number of trades and other measures.</p>
      <p><strong>You can practice recording and listen to your take now, without uploading it.</strong> Submissions open <strong>Monday, 19 October 2026 at 8:00 AM IST</strong> and close <strong>Wednesday, 21 October 2026 at 11:59:59 PM IST.</strong>
        You may upload an initial recording and revise it <strong>twice</strong> — three total submissions.
        Only your latest submitted recording will be used. You may review and re-record locally without spending an attempt;
        submitting/uploading uses an attempt. A two-minute upload grace period accommodates slow networks.</p>
      <p class="alert alert-warning" role="note"><strong>Listen before submitting:</strong> You cannot play back or download an earlier submitted recording from the audio page. It shows only dates and durations. Review your take before uploading; each upload counts against your three allowed submissions.</p>
      <p>In your recording, explain what a buyer receives, why it is useful, what you will personally do or be responsible for,
        how quickly you can deliver, any limits, and how the buyer can verify delivery.</p>
      <p>Use your <strong>own natural speaking voice</strong>. Reading a script written by an agent is welcome.
        Synthetic narration, including a cloned version of your voice, may receive a small authenticity deduction
        if reliably established by instructor review; reasonable accessibility accommodations are available.
        Speak naturally in the language you are comfortable with.</p>
      <section class="mb-3" aria-labelledby="human-exchange-examples">
        <h3 id="human-exchange-examples" class="h5">Examples of useful services (ideas, not restrictions)</h3>
        <ol class="mt-2">
          <li><strong>Your First Confused User:</strong> Try a classmate's website without help; send a screen recording of where you get stuck.</li>
          <li><strong>I'll Misread Your Chart:</strong> Interpret a data visualization without explanation; tell the creator what you understood incorrectly.</li>
          <li><strong>Test on My Device:</strong> Test someone's app on your phone, browser, or connection and document failures.</li>
          <li><strong>Skeptical Customer:</strong> Listen to a three-minute product pitch, raise objections, and report what wasn't convincing.</li>
          <li><strong>Eyes on the Ground:</strong> Observe a safely accessible public location and report details not available online.</li>
          <li><strong>Real-World Data Points:</strong> Collect three local measurements with times, methods, and evidence.</li>
          <li><strong>One Human Answer:</strong> Ask a consenting person one neutral research question and share an anonymized response.</li>
          <li><strong>Device Test Service:</strong> Run requested tests on a device or environment someone else cannot access.</li>
          <li><strong>Accountability Witness:</strong> Check in on four agreed days and maintain a shared progress log.</li>
          <li><strong>Mock Interview:</strong> Ask unexpected follow-ups in a live interview and share specific feedback.</li>
          <li><strong>Explain It to Me:</strong> Listen to a difficult explanation, repeat what you understood, and identify confusion.</li>
          <li><strong>Find My Blind Spot:</strong> Try to disprove one assumption in a classmate's project with a concrete counterexample.</li>
          <li><strong>Reproduce My Bug:</strong> Reproduce a public software bug in a clean environment and report the minimal failure.</li>
          <li><strong>Consent-Based Introduction:</strong> Ask a relevant contact if they want an introduction and connect willing parties.</li>
          <li><strong>Paired Problem-Solving:</strong> Spend twenty minutes working together on a concrete problem and record next steps.</li>
        </ol>
      </section>
      <p>A service may be powered by agents, but ask what makes it worth <em>another student's credits</em>.
        Keep your offer specific and feasible. Do not offer credentials, private data, unsafe activities, or contact third parties without consent.
        The marketplace itself will launch separately; <strong>you do not need to deliver or trade this week</strong>.</p>
      ${
        a
          ? y`
        <p><a href="${a.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Record your Human Exchange offer</a></p>
        <p class="form-text">Your link signs you in to the audio recorder. It expires after 20 minutes.
          Reload Project 1 for a fresh link. Do not share your link or sign-in code; someone else could use your submissions.</p>
      `
          : y`<p class="alert alert-warning" role="alert">${i} Reload Project 1 to try again.</p>`
      }
      <p>After the recorder confirms your upload, return here and press <strong>Check</strong>, then <strong>Save</strong>.
        The exam checks the authenticated audio service; typing an answer cannot replace a recording.
        This confirms participation only. Later marketplace value and delivery will be assessed separately.</p>
      <label for="${e}" class="form-label">Recording acknowledgment (you may type "recorded")</label>
      <input type="text" id="${e}" name="${e}" class="form-control" placeholder="recorded" autocomplete="off" />
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: n,
    question: c,
    answer: async (t) => {
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: r.email,
            quizSign: r.quizSign,
            questionId: e,
            response: t,
            weight: n,
          }),
        }),
        l = await o.json();
      if (!o.ok)
        throw new Error(l.error || "Unable to verify your audio submission.");
      return l;
    },
  };
}
var I = h(() => {
  "use strict";
});
var q = {};
p(q, { default: () => N });
import { html as f } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function N({ user: r, weight: n = 1 }) {
  let e = "q-motion-air-ink",
    s = "Motion games: Air Ink character drawing",
    d = new URLSearchParams({
      email: r.email,
      quizSign: r.quizSign || "",
      questionId: e,
    }),
    a,
    i;
  try {
    let t = await fetch(`./questionData?${d}`),
      o = await t.json();
    if (!t.ok) throw new Error(o.error || "Unable to load your Air Ink link.");
    a = o;
  } catch (t) {
    i = t.message;
  }
  let c = f`
    <div class="mb-3">
      <p>Draw the three short character codes assigned to you by tilting your phone. Tilt to move, hold to ink, and release to lift.
        You may practise and redo drawings freely. The complete set of three drawings is one submission; you may submit it up to three times total.</p>
      <p><strong>Consent comes first.</strong> During this exercise we record motion sensors, device orientation, pen events, timing, geolocation, battery and network information. We use these recordings anonymously for later course exercises and research. Geolocation is optional; declining it will not stop you from completing the exercise.</p>
      <p>The exercise begins with calibration. Follow the prompts to hold your phone flat, tilt left, right, forward and back, then draw a circle. Calibration checks that orientation and motion sensors work well enough to cover the canvas. If it fails, follow the suggested fix; a phone and an HTTPS page are required for many sensor APIs.</p>
      <p>There is no live OCR or score. Each drawing will be checked offline by OCR. It passes if the character is clearly legible; it does not need to be perfect.</p>
      <p>Complete this part yourself; <strong>do not use AI agents</strong>. Agent use may receive a small penalty. The drawing exercise is intentionally short.</p>
      <p>Submissions close <strong>Monday, 26 October 2026 at 11:59:59 PM IST</strong>. A two-minute upload grace period accommodates slow networks. Submit after you are happy with all three drawings. You can revise twice; the latest received set is used.</p>
      ${
        a
          ? f`
        <p><a href="${a.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open Motion games: Air Ink</a></p>
        <p class="form-text">Your link signs you in and expires after 20 minutes. Reload Project 1 for a fresh link. Keep it private because it can use your submissions.</p>
      `
          : f`<p class="alert alert-warning" role="alert">${i} Reload Project 1 to try again.</p>`
      }
      <p>After the game confirms an upload, return here and press <strong>Check</strong>, then <strong>Save</strong>. The exam verifies the authenticated server upload; typing cannot replace it. Participation is confirmed here, and drawing legibility is reviewed offline.</p>
      <label for="${e}" class="form-label">Upload acknowledgment (any text triggers the check)</label>
      <input type="text" id="${e}" name="${e}" class="form-control" placeholder="uploaded" autocomplete="off" />
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: n,
    question: c,
    answer: async (t) => {
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: r.email,
            quizSign: r.quizSign,
            questionId: e,
            response: t,
            weight: n,
          }),
        }),
        l = await o.json();
      if (!o.ok)
        throw new Error(l.error || "Unable to verify your Air Ink upload.");
      return l;
    },
  };
}
var $ = h(() => {
  "use strict";
});
var A = {};
p(A, { default: () => F });
import { html as w } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function F({ user: r, weight: n = 1 }) {
  let e = "q-trading-missing-invoice",
    s = "Trading game: Reconcile the Missing Invoice",
    d = new URLSearchParams({
      email: r.email,
      quizSign: r.quizSign || "",
      questionId: e,
    }),
    a,
    i;
  try {
    let t = await fetch(`./questionData?${d}`),
      o = await t.json();
    if (!t.ok)
      throw new Error(o.error || "Unable to load your personal game link.");
    a = o;
  } catch (t) {
    i = t.message;
  }
  let c = w`
    <div class="mb-3">
      <p>You work in a shop's accounts team. A supplier has sent an invoice. Work out how much to pay.</p>
      <p>On your desk you have the invoice, the purchase order, the goods received note and an email from the supplier.
        The email says which classmate holds your <strong>credit note</strong>. Ask them for it through the desk.
        You can make 3 requests.</p>
      <p class="alert alert-info"><strong>The rule:</strong> pay for goods received at the purchase order price.
        Add GST at the purchase order rate. Subtract valid credit notes.</p>
      <p>You also hold documents for classmates. Some requests are genuine. Some are fake, and some try to trick AI assistants.
        Grant genuine requests. If a credit note is cancelled, grant its replacement. Refuse everything else.</p>
      <h3 class="h6">Marks (out of 10)</h3>
      <ul>
        <li>4 for the correct amount, if a classmate granted you every document you relied on</li>
        <li>1 for listing exactly the right documents</li>
        <li>1 for not making unneeded requests</li>
        <li>2 for granting genuine requests correctly and 2 for refusing fake ones. Each wrong grant loses 1 mark.</li>
      </ul>
      <p><strong>When:</strong> Wednesday 21 October 2026, 12 noon IST to Friday 23 October 2026, 12 noon IST (48 hours).
        Requests close 8 hours before the end. If you do not answer a request within 8 hours, it goes to a volunteer or a teaching assistant, and you lose those marks.</p>
      <p><strong>AI agents:</strong> your agent can read your documents, send requests and draft your answer through the game's API.
        It cannot decide for you. Granting, refusing and paying need you to confirm it's you with Google.</p>
      ${
        a
          ? w`<p><a href="${a.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open your desk</a></p>
          <p class="form-text">Your link signs you in for 12 hours and expires if unused after 20 minutes. Reload this page for a new one. Do not share it.</p>`
          : w`<p class="alert alert-warning" role="alert">${i} Reload this page to try again.</p>`
      }
      <p>After the game closes, press <strong>Check</strong>, then <strong>Save</strong>. The exam reads your signed result from the game. Typing an answer here does nothing.</p>
      <label for="${e}" class="form-label">Acknowledgement (you may type "played")</label>
      <input type="text" id="${e}" name="${e}" class="form-control" placeholder="played" autocomplete="off" />
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: n,
    question: c,
    answer: async (t) => {
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: r.email,
            quizSign: r.quizSign,
            questionId: e,
            response: t,
            weight: n,
          }),
        }),
        l = await o.json();
      if (!o.ok) throw new Error(l.error || "Unable to check your result.");
      return l;
    },
  };
}
var R = h(() => {
  "use strict";
});
var P = {};
p(P, { default: () => L });
import { html as _ } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function L({ weight: r = 0 } = {}) {
  let n = "q-face-expressions",
    e = "Capture 10 facial expressions (preparation for the next task)",
    s = _`
    <p>Use your phone or laptop camera to record <strong>10 expressions</strong>: neutral, happy, sad, angry,
      surprised, contempt, restrained amusement, scepticism, uncertainty, and hopelessness.
      This dataset will support next week's assignment: <strong>train a small classifier to distinguish
      facial expressions</strong>. The exact problem will be revealed next week.</p>
    <p><strong>Complete by Monday, 26 October 2026, 11:59 PM IST (end of day).</strong>
      This question awards <strong>0 marks</strong>, but please complete the data collection before
      the next phase of Project 1.</p>
    <ol>
      <li><a class="btn btn-primary my-2" href="/face-expressions.html" target="_blank" rel="noopener noreferrer">
        Open the face-expression camera <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>
        Record all 10 expressions, review them, and download the ZIP file.</li>
      <li><a class="btn btn-outline-primary my-2" href="https://docs.google.com/forms/d/e/1FAIpQLScwAJOL7DNkC5QLPJGa3CAp3nKRM3tLOHF3kMJcP4-fxUWQPg/viewform"
        target="_blank" rel="noopener noreferrer">Upload ZIP to Google Form
        <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i></a>
        Sign in, read the consent information, choose whether your images may be shared with other
        students, upload the single ZIP, and submit the form. The course team will use the photographs
        to train and validate models. You can opt out of sharing your images with other students.</li>
      <li>Return here, type <code>completed</code>, then click <strong>Check</strong> and <strong>Save</strong>.
        This acknowledgement does not upload your photos or verify your Google Form submission.</li>
    </ol>
    <p class="text-muted">Submitting photos of your own face is voluntary. If you prefer not to,
      contact the course team about an alternative for the next phase.</p>
    <label for="${n}" class="form-label"><strong>Confirmation</strong></label>
    <input type="text" id="${n}" name="${n}" class="form-control"
      placeholder="completed" autocomplete="off" />
  `;
  return {
    id: n,
    title: e,
    question: s,
    weight: r,
    answer: async (a) =>
      String(a ?? "")
        .trim()
        .toLowerCase() !== "completed"
        ? {
            correct: !1,
            score: 0,
            invalidMessage: "Enter completed after submitting the Google Form.",
          }
        : {
            correct: !0,
            score: 0,
            validMessage:
              "Acknowledged (0 marks). Your actual ZIP submission is recorded in Google Forms, not checked here.",
          },
  };
}
var O = h(() => {
  "use strict";
});
var C = {};
p(C, { default: () => W });
import { html as b } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function W({ user: r, weight: n = 1 }) {
  let e = "q-trading-human-exchange-r1",
    s = "Trading game: Human Exchange, Round 1",
    d = new URLSearchParams({
      email: r.email,
      quizSign: r.quizSign || "",
      questionId: e,
    }),
    a,
    i;
  try {
    let t = await fetch(`./questionData?${d}`),
      o = await t.json();
    if (!t.ok)
      throw new Error(o.error || "Unable to load your personal game link.");
    a = o;
  } catch (t) {
    i = t.message;
  }
  let c = b`
    <div class="mb-3">
      <p>In the audio question you recorded a service you can offer classmates. Now trade it.
        The <strong>Human Exchange</strong> lists everyone's offers as text, under a pseudonym. Buy services from classmates and sell yours.</p>
      <p class="alert alert-info">This is a separate game. Its marks are in addition to the audio question's marks.</p>
      <h3 class="h6">How a trade works</h3>
      <ol>
        <li><strong>Buy.</strong> You start with 10 credits. Buying holds 1 credit for 48 hours (you can extend once). You can have 3 open orders.</li>
        <li><strong>Arrange it.</strong> Chat privately on the order, agree a price of 1 to 10 credits and get the service outside the site. You can swap course emails if you both choose to.</li>
        <li><strong>Pay.</strong> Enter the price and one sentence saying what you received.</li>
        <li><strong>Seller confirms.</strong> The seller enters one sentence saying what they delivered. Only then do credits move and marks count. The seller has 48 hours.</li>
      </ol>
      <h3 class="h6">Marks (up to 10, added to this exam when the round closes)</h3>
      <ul>
        <li>Selling: 4 marks for your first new buyer, 2 for the second, 1 for the third, and so on, halving each time.</li>
        <li>Buying: 2 marks for your first new seller, 1 for the second, 0.5 for the third, and so on.</li>
        <li>Repeat trades with the same classmate, prices and credits earn nothing. Only seller-confirmed trades count.</li>
        <li>We review unusual trading patterns, such as pairs who only trade with each other.</li>
      </ul>
      <p><strong>When:</strong> trading is open from Thursday 22 October 2026, 12 noon IST, to Saturday 31 October 2026, midnight IST.
        Orders already open can be paid and confirmed until Monday 2 November 2026, midnight IST. Then the round closes and any credits still held are refunded.</p>
      <p><strong>AI agents:</strong> your agent can browse the market, place orders and chat through the game's API.
        Paying and confirming delivery need you to confirm it's you with Google.</p>
      ${
        a
          ? b`<p><a href="${a.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open the Human Exchange</a></p>
          <p class="form-text">Your link signs you in for 12 hours and expires if unused after 20 minutes. Reload this page for a new one. Do not share it.</p>`
          : b`<p class="alert alert-warning" role="alert">${i} Reload this page to try again.</p>`
      }
      <p>After the round closes on Monday 2 November 2026, midnight IST, open the game, go to <strong>Result</strong>,
        copy your <strong>final receipt</strong> and paste it below. Press <strong>Check</strong>, then <strong>Save</strong>.
        Receipts copied before the round closes are provisional and are rejected.</p>
      <label for="${e}" class="form-label">Final receipt</label>
      <textarea id="${e}" name="${e}" class="form-control font-monospace" rows="4" placeholder="eyJhbGciOiJFUzI1NiIs…" autocomplete="off" spellcheck="false"></textarea>
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: n,
    question: c,
    answer: async (t) => {
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: r.email,
            quizSign: r.quizSign,
            questionId: e,
            response: t,
            weight: n,
          }),
        }),
        l = await o.json();
      if (!o.ok) throw new Error(l.error || "Unable to check your result.");
      return l;
    },
  };
}
var Y = h(() => {
  "use strict";
});
var U = {};
p(U, { default: () => G });
import { html as k } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function G({ user: r, weight: n = 1 }) {
  let e = "q-trading-picture-story",
    s = "Trading game: Picture Stories",
    d = new URLSearchParams({
      email: r.email,
      quizSign: r.quizSign || "",
      questionId: e,
    }),
    a,
    i;
  try {
    let t = await fetch(`./questionData?${d}`),
      o = await t.json();
    if (!t.ok)
      throw new Error(o.error || "Unable to load your personal game link.");
    a = o;
  } catch (t) {
    i = t.message;
  }
  let c = k`
    <div class="mb-3">
      <p>Make one <strong>wordless</strong> picture that tells a story. Then tell classmates' picture stories aloud and decide which stories are better.</p>
      <h3 class="h6">1. Create: Saturday 24 October, 12 noon IST, to Thursday 29 October, 12 noon IST</h3>
      <ul>
        <li>Upload one square picture that tells a story. Draw it, photograph a drawing on paper, make a collage or use an AI tool: anything works. One to four panels usually works best.</li>
        <li><strong>No words</strong>: no letters, numbers, captions, signatures or text in speech bubbles. An AI model checks every picture after the game closes, and a picture with any words gets 0 creator marks. Arrows and pictorial symbols are fine.</li>
        <li>Write your story privately, ideally in three lines: the situation, what changes, the outcome. Only the course team and the marking AI read it.</li>
        <li>You can replace your picture or story until the deadline. Then pictures freeze, so readers never see something that might still change.</li>
        <li>If you upload nothing, you get 0 of the 5 creator marks. You can still earn the 5 reader marks.</li>
      </ul>
      <h3 class="h6">2. Narrate and rank: Thursday 29 October, 12 noon IST, to Sunday 1 November, 12 noon IST</h3>
      <ul>
        <li>First, the game checks your microphone and gives you a practice picture to narrate. Nothing from the practice is saved or marked.</li>
        <li>The game shows you 10 classmates' pictures, one at a time, only when you ask. Take a break whenever you like.</li>
        <li>When a picture appears, a <strong>45-second recording</strong> starts at once. Say what happens: who is there, what changes, how it ends. Speak in any language. You get one retake inside the same 45 seconds.</li>
        <li>After each one, place it in your ranking: better than these, worse than those. Rank by <em>which is the better story</em>, not which looks better.</li>
        <li>At the end, confirm your full order. Volunteers can narrate more than 10.</li>
      </ul>
      <h3 class="h6">Marks (up to 10, added to this exam after the game closes)</h3>
      <ul>
        <li><strong>Creator, 5.</strong> Understood (2.5): an AI gets each reader's narration and five private stories, yours and four others, and picks the one it describes; you earn the share it gets right. Preferred (2.5): how highly readers ranked your story.</li>
        <li><strong>Reader, 5.</strong> Completed (1): 0.08 per narration up to 10, plus 0.2 for confirming your final order. Read the story (2.5): an AI scores each narration 0 to 3 against the author's story, crediting other sensible readings; a story most readers missed does not count against anyone. Ranking agreement (1.5): how well your order agrees with everyone else's; close calls cost almost nothing.</li>
        <li>AI judgements never enter the ranking: only classmates' orders do.</li>
      </ul>
      <p class="alert alert-secondary"><strong>Recordings and research.</strong> The game asks for your consent before you start. It records your voice for up to 45 seconds per picture and stores your picture, private story, recordings, rankings and their timings. Recordings are never played to other students; the course team transcribes and translates them offline with AI models to mark them. After the game closes, each author sees anonymous transcripts of what readers said about their picture. We use these anonymously for later course exercises and research.</p>
      <p><strong>AI agents:</strong> an agent can read your desk through the game's API, but the recording is your own first reading, and confirming your final order needs you to confirm it's you with Google.</p>
      ${
        a
          ? k`<p><a href="${a.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open Picture Stories</a></p>
          <p class="form-text">Your link signs you in for 12 hours and expires if unused after 20 minutes. Reload this page for a new one. Do not share it.</p>`
          : k`<p class="alert alert-warning" role="alert">${i} Reload this page to try again.</p>`
      }
      <p>After the game closes on Monday 2 November 2026, open it, go to <strong>Result</strong>, copy your <strong>final receipt</strong>
        and paste it below by Tuesday 17 November. Press <strong>Check</strong>, then <strong>Save</strong>. Receipts copied before the game closes are provisional and are rejected.</p>
      <label for="${e}" class="form-label">Final receipt</label>
      <textarea id="${e}" name="${e}" class="form-control font-monospace" rows="4" placeholder="eyJhbGciOiJFUzI1NiIs…" autocomplete="off" spellcheck="false"></textarea>
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: n,
    question: c,
    answer: async (t) => {
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: r.email,
            quizSign: r.quizSign,
            questionId: e,
            response: t,
            weight: n,
          }),
        }),
        l = await o.json();
      if (!o.ok) throw new Error(l.error || "Unable to check your result.");
      return l;
    },
  };
}
var j = h(() => {
  "use strict";
});
import {
  html as g,
  render as M,
} from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
function v(r, n) {
  let e = g`<ol class="mt-3">
    ${r.map(({ id: a, title: i, weight: c }) => g`<li><a href="#h${a}">${i}</a> (${c} ${c == 1 ? "mark" : "marks"})</li>`)}
  </ol>`,
    s = [
      g`<h1 class="display-6">Questions</h1>`,
      e,
      ...r.map(
        ({ id: a, title: i, weight: c, question: u, help: t }, o) => (
          t && !Array.isArray(t) && (t = [t]),
          g`
        <details class="card my-5" data-question="${a}" id="h${a}" open>
          <summary class="card-header d-flex align-items-center gap-2">
            <span class="badge text-bg-primary">${o + 1}</span>
            <span class="flex-grow-1">${i} (${c} ${c == 1 ? "mark" : "marks"})</span>
            <span class="badge text-bg-success solved-badge d-none"><i class="bi bi-check-circle-fill me-1"></i>Solved</span>
            <i class="bi bi-chevron-up question-chevron" aria-hidden="true"></i>
          </summary>
          ${t ? t.map((l) => g`<div class="card-body border-bottom">${l}</div>`) : ""}
          <div class="card-body">${u}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${a}">Check</button>
          </div>
        </details>
      `
        ),
      ),
    ],
    d = { index: e, questions: s };
  for (let [a, i] of n) M(d[i], a);
}
async function oe(r, n) {
  let e = [
    {
      ...(await Promise.resolve()
        .then(() => (S(), x))
        .then((s) => s.default({ user: r, weight: 1 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => (I(), T))
        .then((s) => s.default({ user: r, weight: 1 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => ($(), q))
        .then((s) => s.default({ user: r, weight: 1 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => (R(), A))
        .then((s) => s.default({ user: r, weight: 1 }))),
    },
    await Promise.resolve()
      .then(() => (O(), P))
      .then((s) => s.default({ weight: 0 })),
    {
      ...(await Promise.resolve()
        .then(() => (Y(), C))
        .then((s) => s.default({ user: r, weight: 10 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => (j(), U))
        .then((s) => s.default({ user: r, weight: 10 }))),
    },
  ];
  return v(e, n), Object.fromEntries(e.map(({ id: s, ...d }) => [s, d]));
}
export { oe as questions };
