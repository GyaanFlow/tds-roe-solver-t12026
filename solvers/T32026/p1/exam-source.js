// Audit snapshot of https://exam.sanand.workers.dev/exam-tds-2026-09-p1.js (prettier 3.4.2), fetched 2026-11-21.
// check.mjs compares the question ids, titles and order in this file with the registry. Do not edit.
var V = Object.defineProperty;
var h = (t, a) => () => (t && (a = t((t = 0))), a);
var p = (t, a) => {
  for (var e in a) V(t, e, { get: a[e], enumerable: !0 });
};
var T = {};
p(T, { default: () => X });
import { html as y } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function X({ user: t, weight: a = 1 }) {
  let e = "q-prediction-aipipe-server",
    s = "Predict AI Pipe usage: 2\u20138 November 2026",
    d = new URLSearchParams({
      email: t.email,
      quizSign: t.quizSign || "",
      questionId: e,
    }),
    n,
    l;
  try {
    let o = await fetch(`./questionData?${d}`),
      r = await o.json();
    if (!o.ok) throw new Error(r.error || "Unable to load your sign-in code.");
    n = r;
  } catch (o) {
    l = o.message;
  }
  let u = y`
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
        n
          ? y`
        <p><a href="${n.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open AI Pipe prediction market</a></p>
        <label for="${e}-signin" class="form-label">Your personalized sign-in code for ${n.email}</label>
        <textarea id="${e}-signin" class="form-control font-monospace" rows="4" readonly spellcheck="false">${n.launch_token}</textarea>
        <p class="form-text">Keep this code private. Anyone with this code, including another student or an AI agent, can trade as you, make unwanted trades, and use up your credits and trading turns. The link signs you in automatically, or you can paste the code into the market's sign-in form.
          It expires after 20 minutes. Reload this exam to get a new code.</p>
      `
          : y`<p class="alert alert-warning" role="alert">${l} Reload this exam to try again.</p>`
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
    weight: a,
    question: u,
    answer: async (o) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            response: o,
            weight: a,
          }),
        }),
        i = await r.json();
      if (!r.ok)
        throw new Error(i.error || "Unable to verify your market result.");
      return i;
    },
  };
}
var I = h(() => {
  "use strict";
});
var $ = {};
p($, { default: () => Q });
import { html as f } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function Q({ user: t, weight: a = 1 }) {
  let e = "q-audio-tds-human-exchange",
    s = "TDS Human Exchange: Offer something useful",
    d = new URLSearchParams({
      email: t.email,
      quizSign: t.quizSign || "",
      questionId: e,
    }),
    n,
    l;
  try {
    let o = await fetch(`./questionData?${d}`),
      r = await o.json();
    if (!o.ok)
      throw new Error(
        r.error || "Unable to load your personal recording link.",
      );
    n = r;
  } catch (o) {
    l = o.message;
  }
  let u = f`
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
      <p><strong>You can practice recording and listen to your take now, without uploading it.</strong> Submissions open <strong>Monday, 19 October 2026 at 8:00 AM IST</strong> and close <strong>Thursday, 5 November 2026 at 11:59:59 PM IST.</strong>
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
        n
          ? f`
        <p><a href="${n.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Record your Human Exchange offer</a></p>
        <p class="form-text">Your link signs you in to the audio recorder. It expires after 20 minutes.
          Reload Project 1 for a fresh link. Do not share your link or sign-in code; someone else could use your submissions.</p>
      `
          : f`<p class="alert alert-warning" role="alert">${l} Reload Project 1 to try again.</p>`
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
    weight: a,
    question: u,
    answer: async (o) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            response: o,
            weight: a,
          }),
        }),
        i = await r.json();
      if (!r.ok)
        throw new Error(i.error || "Unable to verify your audio submission.");
      return i;
    },
  };
}
var q = h(() => {
  "use strict";
});
var A = {};
p(A, { default: () => Z });
import { html as w } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function Z({ user: t, weight: a = 1 }) {
  let e = "q-motion-air-ink",
    s = "Motion games: Air Ink character drawing",
    d = new URLSearchParams({
      email: t.email,
      quizSign: t.quizSign || "",
      questionId: e,
    }),
    n,
    l;
  try {
    let o = await fetch(`./questionData?${d}`),
      r = await o.json();
    if (!o.ok) throw new Error(r.error || "Unable to load your Air Ink link.");
    n = r;
  } catch (o) {
    l = o.message;
  }
  let u = w`
    <div class="mb-3">
      <p>Draw the three short character codes assigned to you by tilting your phone. Tilt to move, hold to ink, and release to lift.
        You may practise and redo drawings freely. The complete set of three drawings is one submission; you may submit it up to three times total.</p>
      <p><strong>Consent comes first.</strong> During this exercise we record motion sensors, device orientation, pen events, timing, geolocation, battery and network information. We use these recordings anonymously for later course exercises and research. Geolocation is optional; declining it will not stop you from completing the exercise.</p>
      <p>The exercise begins with calibration. Follow the prompts to hold your phone flat, tilt left, right, forward and back, then draw a circle. Calibration checks that orientation and motion sensors work well enough to cover the canvas. If it fails, follow the suggested fix; a phone and an HTTPS page are required for many sensor APIs.</p>
      <p>There is no live OCR or score. Each drawing will be checked offline by OCR. It passes if the character is clearly legible; it does not need to be perfect.</p>
      <p>Complete this part yourself; <strong>do not use AI agents</strong>. Agent use may receive a small penalty. The drawing exercise is intentionally short.</p>
      <p>Submissions close <strong>Sunday, 1 November 2026 at 11:59:59 PM IST</strong>. A two-minute upload grace period accommodates slow networks. Submit after you are happy with all three drawings. You can revise twice; the latest received set is used.</p>
      ${
        n
          ? w`
        <p><a href="${n.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open Motion games: Air Ink</a></p>
        <p class="form-text">Your link signs you in and expires after 20 minutes. Reload Project 1 for a fresh link. Keep it private because it can use your submissions.</p>
      `
          : w`<p class="alert alert-warning" role="alert">${l} Reload Project 1 to try again.</p>`
      }
      <p>After the game confirms an upload, return here and press <strong>Check</strong>, then <strong>Save</strong>. The exam verifies the authenticated server upload; typing cannot replace it. Participation is confirmed here, and drawing legibility is reviewed offline.</p>
      <label for="${e}" class="form-label">Upload acknowledgment (any text triggers the check)</label>
      <input type="text" id="${e}" name="${e}" class="form-control" placeholder="uploaded" autocomplete="off" />
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: a,
    question: u,
    answer: async (o) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            response: o,
            weight: a,
          }),
        }),
        i = await r.json();
      if (!r.ok)
        throw new Error(i.error || "Unable to verify your Air Ink upload.");
      return i;
    },
  };
}
var E = h(() => {
  "use strict";
});
var P = {};
p(P, { default: () => ee });
import { html as b } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function ee({ user: t, weight: a = 1 }) {
  let e = "q-trading-missing-invoice",
    s = "Trading game: Reconcile the Missing Invoice",
    d = new URLSearchParams({
      email: t.email,
      quizSign: t.quizSign || "",
      questionId: e,
    }),
    n,
    l;
  try {
    let o = await fetch(`./questionData?${d}`),
      r = await o.json();
    if (!o.ok)
      throw new Error(r.error || "Unable to load your personal game link.");
    n = r;
  } catch (o) {
    l = o.message;
  }
  let u = b`
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
        n
          ? b`<p><a href="${n.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open your desk</a></p>
          <p class="form-text">Your link signs you in for 12 hours and expires if unused after 20 minutes. Reload this page for a new one. Do not share it.</p>`
          : b`<p class="alert alert-warning" role="alert">${l} Reload this page to try again.</p>`
      }
      <p>After the game closes, press <strong>Check</strong>, then <strong>Save</strong>. The exam reads your signed result from the game. Typing an answer here does nothing.</p>
      <label for="${e}" class="form-label">Acknowledgement (you may type "played")</label>
      <input type="text" id="${e}" name="${e}" class="form-control" placeholder="played" autocomplete="off" />
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: a,
    question: u,
    answer: async (o) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            response: o,
            weight: a,
          }),
        }),
        i = await r.json();
      if (!r.ok) throw new Error(i.error || "Unable to check your result.");
      return i;
    },
  };
}
var O = h(() => {
  "use strict";
});
var C = {};
p(C, { default: () => oe });
import { html as te } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function oe({ weight: t = 0 } = {}) {
  let a = "q-face-expressions",
    e = "Capture 10 facial expressions (preparation for the next task)",
    s = te`
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
    <label for="${a}" class="form-label"><strong>Confirmation</strong></label>
    <input type="text" id="${a}" name="${a}" class="form-control"
      placeholder="completed" autocomplete="off" />
  `;
  return {
    id: a,
    title: e,
    question: s,
    weight: t,
    answer: async (n) =>
      String(n ?? "")
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
var R = h(() => {
  "use strict";
});
var N = {};
p(N, { default: () => re });
import { html as v } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function re({ user: t, weight: a = 1 }) {
  let e = "q-trading-human-exchange-r1",
    s = "Trading game: Human Exchange, Round 1",
    d = new URLSearchParams({
      email: t.email,
      quizSign: t.quizSign || "",
      questionId: e,
    }),
    n,
    l;
  try {
    let o = await fetch(`./questionData?${d}`),
      r = await o.json();
    if (!o.ok)
      throw new Error(r.error || "Unable to load your personal game link.");
    n = r;
  } catch (o) {
    l = o.message;
  }
  let u = v`
    <div class="mb-3">
      <p>In the audio question you recorded a service you can offer classmates. Now trade it.
        The <strong>Human Exchange</strong> lists everyone's offers as text, under a pseudonym. Buy services from classmates and sell yours.</p>
      <p class="alert alert-info">This is a separate game. Bonus credit for participation is awarded outside the regular exam score.</p>
      <h3 class="h6">How a trade works</h3>
      <ol>
        <li><strong>Buy.</strong> You start with 10 credits. Buying holds 1 credit for 48 hours (you can extend once). You can have 3 open orders.</li>
        <li><strong>Arrange it.</strong> Chat privately on the order, agree a price of 1 to 10 credits and get the service outside the site. You can swap course emails if you both choose to.</li>
        <li><strong>Pay.</strong> Enter the price and one sentence saying what you received.</li>
        <li><strong>Seller confirms.</strong> The seller enters one sentence saying what they delivered. Only then do credits move and marks count. The seller has 48 hours.</li>
      </ol>
      <h3 class="h6">Game score (up to 10; bonus credit is awarded separately)</h3>
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
        n
          ? v`<p><a href="${n.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open the Human Exchange</a></p>
          <p class="form-text">Your link signs you in for 12 hours and expires if unused after 20 minutes. Reload this page for a new one. Do not share it.</p>`
          : v`<p class="alert alert-warning" role="alert">${l} Reload this page to try again.</p>`
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
    weight: a,
    question: u,
    answer: async (o) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            response: o,
            weight: a,
          }),
        }),
        i = await r.json();
      if (!r.ok) throw new Error(i.error || "Unable to check your result.");
      return i;
    },
  };
}
var Y = h(() => {
  "use strict";
});
var U = {};
p(U, { default: () => ae });
import { html as k } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function ae({ user: t, weight: a = 1 }) {
  let e = "q-trading-picture-story",
    s = "Trading game: Picture Stories",
    d = new URLSearchParams({
      email: t.email,
      quizSign: t.quizSign || "",
      questionId: e,
    }),
    n,
    l;
  try {
    let o = await fetch(`./questionData?${d}`),
      r = await o.json();
    if (!o.ok)
      throw new Error(r.error || "Unable to load your personal game link.");
    n = r;
  } catch (o) {
    l = o.message;
  }
  let u = k`
    <div class="mb-3">
      <p>Make one <strong>wordless</strong> picture that tells a story. Then tell classmates' picture stories aloud and decide which stories are better.</p>
      <h3 class="h6">1. Create: Saturday 24 October, 12 noon IST, to Thursday 29 October, 12 noon IST</h3>
      <ul>
        <li>Upload one square picture that tells a story. Draw it, photograph a drawing on paper, make a collage or use an AI tool: anything works. One to four panels usually works best.</li>
        <li>Pictures can use drawings, collages, photographs or AI tools. All submitted pictures have been accepted, including pictures containing words.</li>
        <li>Write your story privately, ideally in three lines: the situation, what changes, the outcome. Only the course team and the marking AI read it.</li>
        <li>You can replace your picture or story until the deadline. Then pictures freeze, so readers never see something that might still change.</li>
        <li>If you upload nothing, you get 0 creator marks. You can still earn reader marks.</li>
      </ul>
      <h3 class="h6">2. Narrate and rank: Thursday 29 October, 12 noon IST, to Sunday 1 November, 12 noon IST</h3>
      <ul>
        <li>First, the game checks your microphone and gives you a practice picture to narrate. Nothing from the practice is saved or marked.</li>
        <li>The game shows you 10 classmates' pictures, one at a time, only when you ask. Take a break whenever you like.</li>
        <li>When a picture appears, a <strong>45-second recording</strong> starts at once. Say what happens: who is there, what changes, how it ends. Speak in any language. You get one retake inside the same 45 seconds.</li>
        <li>After each one, place it in your ranking: better than these, worse than those. Rank by <em>which is the better story</em>, not which looks better.</li>
        <li>At the end, confirm your full order. Volunteers can narrate more than 10.</li>
      </ul>
      <h3 class="h6">How marks work (out of 10)</h3>
      <p><strong>Creator: 80% of your total. Reader: 20% of your total.</strong> Each part is marked out of 10.</p>
      <ul>
        <li><strong>Creator /10.</strong> Understanding (5): how often the AI matched classmates' narrations to your story. Preference (5): how highly classmates ranked your story.</li>
        <li><strong>Reader /10.</strong> Complete your narrations and ranking (2). Understand the stories you read (5). Rank the stories in line with other readers (3).</li>
        <li><strong>Your total /10 = 0.8 × creator + 0.2 × reader.</strong> For creator 8 and reader 6, your total is 7.6.</li>
        <li>All submitted pictures were accepted, including pictures with text. The separate story-quality score on the public results site includes uniqueness. It does not affect your exam marks.</li>
      </ul>
      <p class="alert alert-secondary"><strong>Recordings and research.</strong> The game asks for your consent before you start. It records your voice for up to 45 seconds per picture and stores your picture, private story, recordings, rankings and their timings. Recordings are never played to other students; the course team transcribes and translates them offline with AI models to mark them. After the game closes, each author sees anonymous transcripts of what readers said about their picture. We use these anonymously for later course exercises and research.</p>
      <p><strong>AI agents:</strong> an agent can read your desk through the game's API, but the recording is your own first reading, and confirming your final order needs you to confirm it's you with Google.</p>
      ${
        n
          ? k`<p><a href="${n.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open Picture Stories</a></p>
          <p class="form-text">Your link signs you in for 12 hours and expires if unused after 20 minutes. Reload this page for a new one. Do not share it.</p>`
          : k`<p class="alert alert-warning" role="alert">${l} Reload this page to try again.</p>`
      }
      <p>After the game closes, open it, go to <strong>Result</strong>, copy your <strong>final receipt</strong>
        and paste it below by Tuesday 17 November. Press <strong>Check</strong>, then <strong>Save</strong>. Receipts copied before the game closes are provisional and are rejected.</p>
      <label for="${e}" class="form-label">Final receipt</label>
      <textarea id="${e}" name="${e}" class="form-control font-monospace" rows="4" placeholder="eyJhbGciOiJFUzI1NiIs…" autocomplete="off" spellcheck="false"></textarea>
    </div>
  `;
  return {
    id: e,
    title: s,
    weight: a,
    question: u,
    answer: async (o) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            response: o,
            weight: a,
          }),
        }),
        i = await r.json();
      if (!r.ok) throw new Error(i.error || "Unable to check your result.");
      return i;
    },
  };
}
var j = h(() => {
  "use strict";
});
function M(t, a) {
  let e = URL.createObjectURL(t),
    s = document.createElement("a");
  (s.href = e),
    (s.download = a),
    document.body.appendChild(s),
    s.click(),
    document.body.removeChild(s),
    URL.revokeObjectURL(e);
}
var D = h(() => {
  "use strict";
});
function _(t) {
  if (typeof t != "string" || !t.trim())
    throw new Error("Upload a JSON model first.");
  if (new TextEncoder().encode(t).byteLength > 65536)
    throw new Error("The JSON model must be at most 64 KiB.");
  let a;
  try {
    a = JSON.parse(t);
  } catch {
    throw new Error("Invalid JSON. Upload a complete JSON file.");
  }
  if (
    !a ||
    typeof a != "object" ||
    Array.isArray(a) ||
    Object.keys(a).sort().join(",") !== "version,weights"
  )
    throw new Error(
      'The JSON must have exactly two keys: "version" and "weights".',
    );
  if (a.version !== z) throw new Error(`"version" must be "${z}".`);
  if (!Array.isArray(a.weights) || a.weights.length !== se.length)
    throw new Error(
      '"weights" must contain exactly 10 arrays, one per expression.',
    );
  if (
    !a.weights.every(
      (e) =>
        Array.isArray(e) &&
        e.length === 156 &&
        e.every((s) => typeof s == "number" && Number.isFinite(s)),
    )
  )
    throw new Error(
      "Each weights row must contain exactly 156 finite JSON numbers.",
    );
  return {
    correct: !0,
    score: 0,
    validMessage:
      "Valid model JSON. Click Save. Your bonus score is evaluated after the deadline.",
  };
}
var z,
  se,
  F = h(() => {
    "use strict";
    (z = "linear-rank-v1"),
      (se = [
        "neutral",
        "happy",
        "sad",
        "angry",
        "surprised",
        "contempt",
        "restrained-amusement",
        "scepticism",
        "uncertainty",
        "hopelessness",
      ]);
  });
var J = {};
p(J, { default: () => ie });
import { html as ne } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function ie({ user: t, weight: a = 0 }) {
  let e = "q-face-expression-classifier",
    s = "Train a face-expression classifier (10 bonus marks later)",
    l = ne`
    <p><strong>Train a model that matches ten expressions to ten photographs of someone it has never seen.</strong>
      The expressions are neutral, happy, sad, angry, surprised, contempt, restrained amusement,
      scepticism, uncertainty and hopelessness. The label is what the person was <em>asked to show</em>.
      It may not match how they felt or even how their expression looks.</p>

    <h3 class="h6">1. Download 300 labeled photographs</h3>
    <p>Google sign-in is required. Your ZIP has <strong>30 people with 10 photos each</strong> and a
      <code>features.csv</code> with 78 numerical features per photo. People are numbered <code>01</code> to
      <code>30</code>. Files such as <code>photos/01-03.jpg</code> match the <code>photo_id</code> column.
      Both the people and their photo order are randomized for you, but stay the same on repeated downloads.
      IITM email accounts get different subsets. All other Google accounts share one subset.</p>
    <p><button type="button" class="btn btn-primary" @click=${async (c) => {
      let o = c.currentTarget,
        r = document.getElementById(`${e}-download-status`);
      (o.disabled = !0), (r.textContent = "Preparing your personal dataset...");
      try {
        let i = await fetch(
          `/face-expression-dataset?${new URLSearchParams({ email: t.email })}`,
          {
            headers: { Authorization: `Bearer ${t.faceDatasetToken || ""}` },
            cache: "no-store",
          },
        );
        if (!i.ok)
          throw new Error(
            i.status === 403
              ? "Sign out and sign in with Google again, then retry."
              : `Download unavailable (HTTP ${i.status}). Contact the course team if this continues.`,
          );
        M(await i.blob(), "tds-2026-09-p1-face-expressions.zip"),
          (r.textContent =
            "Dataset downloaded. You will get the same people every time you download it.");
      } catch (i) {
        r.textContent = i.message;
      } finally {
        o.disabled = !1;
      }
    }}>Download my training data (ZIP)</button>
      <span id="${e}-download-status" role="status" class="ms-2"></span></p>

    <h3 class="h6">2. Understand the features, then make more data</h3>
    <p>We used <strong>Py-Feat 2.1.5, Detectorv2</strong>. RetinaFace finds the face. Py-Feat's multitask
      model then predicts <strong>51 blendshape values</strong> (facial movements), <strong>20 Action Unit
      values</strong> (muscle movements) and <strong>7 emotion scores</strong>. These 78 numbers are model
      predictions, not facts about someone's feelings. The <code>intended_expression</code> label came from
      the photograph's original instructions, not from Py-Feat.</p>
    <p><strong>We strongly encourage you to collect many more examples.</strong> Ask yourself and willing friends
      to photograph all ten requested expressions. Try appropriately licensed photos or face datasets from
      the Internet too. Use only photos you have permission to process; avoid identifying people or
      uploading classmates' photos to outside services. Web photographs rarely tell you which expression
      someone was <em>asked</em> to show, so label new training examples carefully.</p>
    <p><a href="/face-expression-features.py" download>Download the Python feature extractor</a>.
      It runs on your computer and produces the same 78 feature columns. Install <code>uv</code>, save the
      script, put photos in a folder using names such as <code>sara-01.jpg</code> and
      <code>sara-02.jpg</code>, then run:</p>
    <pre class="p-2 bg-body-tertiary border rounded"><code>uv run face-expression-features.py photos/ --labels labels.csv --output more-features.csv</code></pre>
    <p class="form-text">For labeled photos, <code>labels.csv</code> has columns
      <code>photo_id,intended_expression</code>, for example <code>sara-01,happy</code>.
      Omit <code>--labels labels.csv</code> to explore unlabeled photos. The first run downloads model
      weights. Keep each person's ten images together when splitting training and validation data.</p>

    <h3 class="h6">3. Train a model and submit its JSON</h3>
    <p>Predict a score for each of the ten expressions for each photo. You may also use 78 extra numbers:
      each feature's rank among that person's ten photographs, scaled from 0 to 1 (ties use their average
      rank). The grader calculates the ranks and matches each expression to exactly one photograph,
      choosing the assignment with the highest total score.</p>
    <p>Submit JSON with <strong>exactly two keys</strong>: <code>"version":"linear-rank-v1"</code> and
      <code>"weights"</code>, a matrix of <strong>10 rows × 156 finite numbers</strong>. The row order is
      <code>neutral, happy, sad, angry, surprised, contempt, restrained-amusement, scepticism, uncertainty, hopelessness</code>.
      Use the 78 feature columns in the CSV, followed by the 78 within-person ranks in the same order.
      The grader computes <code>scores = weights × inputs</code>. For a scikit-learn linear model trained
      with <code>StandardScaler</code>, divide each coefficient by <code>scale_</code>. Bias terms cancel
      because all ten labels are used once. Maximum JSON size: 64 KiB.</p>
    <p>You may use AI, share code and combine training sets with classmates. Check accuracy on <em>new people</em>
      before submitting. You can update your JSON and <strong>Check and Save as often as you like</strong>
      until Project 1 closes. Only your latest saved version counts.</p>
    <p><strong>Marks:</strong> a valid JSON earns <strong>0 marks now</strong>. We will evaluate it on
      unseen people <em>after</em> Project 1 closes, for up to <strong>10 bonus marks</strong>.
      The provisional scale is 0 at 60% accuracy, 5 at 70% and 10 at 80% or above.
      Checking validates the JSON, not your model's accuracy.</p>
    <label for="${e}-file" class="form-label">Choose your model JSON file</label>
    <input type="file" id="${e}-file" accept=".json,application/json" class="form-control mb-2" @change=${async (
      c,
    ) => {
      let o = c.target.files?.[0];
      if (!o) return;
      let r = document.getElementById(e),
        i = document.getElementById(`${e}-model-status`);
      if (o.size > 65536) {
        i.textContent = "Model JSON must be 64 KiB or smaller.";
        return;
      }
      (r.value = await o.text()),
        r.dispatchEvent(new Event("input", { bubbles: !0 })),
        (i.textContent = `Loaded ${o.name}. Click Check, then Save.`);
    }} />
    <p id="${e}-model-status" role="status" class="form-text"></p>
    <label for="${e}" class="form-label">Your JSON model (loaded from the file, or paste it here)</label>
    <textarea id="${e}" name="${e}" rows="4" class="form-control font-monospace" spellcheck="false"
      placeholder='{"version":"linear-rank-v1","weights":[...]}'></textarea>
    <p class="form-text">Click <strong>Check</strong> to validate the JSON. Then click <strong>Save</strong> to submit it.</p>
  `;
  return {
    id: e,
    title: s,
    weight: a,
    question: l,
    answer: async (c) => {
      _(c);
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: t.quiz,
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            response: c,
            weight: a,
          }),
        }),
        r = await o.json();
      if (!o.ok) throw new Error(r.error || "Unable to validate your model.");
      return r;
    },
  };
}
var L = h(() => {
  "use strict";
  D();
  F();
});
var B = {};
p(B, { default: () => de });
import { html as m } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function de({ user: t, weight: a = 0 }) {
  let e = "q-air-ink-classifier",
    s = "Invisible Ink: read phone writing (10 bonus marks later)",
    d = new URLSearchParams({
      email: t.email,
      quizSign: t.quizSign || "",
      questionId: e,
    }),
    n,
    l;
  try {
    let o = await fetch(`./questionData?${d}`, { cache: "no-store" }),
      r = await o.json();
    if (!o.ok) throw Error(r.error || "Could not get your personal game link.");
    n = r;
  } catch (o) {
    l = o.message || "Could not load your game link.";
  }
  let u = m`
  <p><strong>Recover letters written without visible ink.</strong> Students moved a phone to draw random letter codes. The phone recorded its movement. The recording does not show when the student pressed the button to draw. Your task is to work out what they wrote.</p>
  <p>Each code has 3, 4 or 5 letters from <code>ACEFHJKMNPRTUVWXY</code>. Codes are random: <code>XRM</code> is valid, even though it is not a word.</p>
  <p><strong>What you will learn:</strong> how to make predictions from incomplete sensor data, check them against unseen examples and improve them with other people or AI tools.</p>

  <h3 class="h6">1. Prepare your predictor</h3>
  <p>Open your personal game link. Download <strong>60 labeled examples</strong>: 50 are the same for everyone; 10 are chosen for you from a larger pool of 500. Each example includes the correct code and when the pen was down.</p>
  <p>Use the <a href="${le}/motion/ink-viewer/" target="_blank" rel="noopener noreferrer">motion viewer</a> to watch one or more recordings. Make a predictor using any method: code, AI or your own eyes. <strong>You may share examples, use AI and work with classmates.</strong> You do not need to upload your predictor.</p>

  <h3 class="h6">2. Join one or more live sessions</h3>
  <p>Each session stays open for one hour. You can enter the waiting room <strong>2 minutes early</strong> and watch the countdown. The game opens without reloading. Press Start during the first 40 minutes to get your own full 20 minutes.</p>
  <table class="table table-sm"><thead><tr><th>Date</th><th>Session (IST)</th><th>Last start (IST)</th></tr></thead><tbody>
   ${ce.map(([o, r, i]) => m`<tr><td>${o} 2026</td><td>${r}</td><td>${i}</td></tr>`)}
  </tbody></table>
  <p>You may play once in each session. Each session uses a different set of test recordings.</p>

  <h3 class="h6">3. Guess the codes</h3>
  <ol>
   <li><strong>First 2 minutes:</strong> you get six recordings in a random order. You can view or download all six. Guess <strong>Drawing 1 only</strong>. This first guess is worth <strong>20%</strong>.</li>
   <li><strong>Next 18 minutes:</strong> use your predictor, AI or classmates to guess all six codes. You can change any final guess. These six codes are worth <strong>80%</strong>.</li>
   <li><strong>At 20 minutes:</strong> the answer form closes. Complete codes save automatically. A message beside Save confirms when the server has received your answers.</li>
   <li><strong>For one more minute:</strong> the server accepts any last save or retry if your connection is slow. You cannot change your answers.</li>
  </ol>
  <p>Each correctly placed letter earns credit. All six final codes count equally. A blank letter earns no marks.</p>

  <h3 class="h6">4. Save your signed record in P1</h3>
  <p>After the extra minute, the game gives you a <strong>signed record (JWT)</strong>. It contains your guesses, <strong>not your score or the correct answers</strong>. Copy the full record into the box below. Press <strong>Check</strong>, then <strong>Save</strong> in P1.</p>
  <p>We mark the saved record offline after the sessions. If you play more than once, you choose which session's record to save. The last one you save in P1 counts.</p>
  ${n?.launch_url ? m`<p><a class="btn btn-primary" target="_blank" rel="noopener noreferrer" href="${n.launch_url}">Open my Invisible Ink game</a></p><p class="form-text">This link is personal and expires after 20 minutes. Open P1 again for a fresh link if needed. Do not share it.</p>` : m`<p class="alert alert-info" role="status">${l || "Your personal game link is not ready. Reload P1."}</p>`}
  <label class="form-label" for="${e}"><strong>Signed record from the game (JWT)</strong></label>
  <textarea id="${e}" name="${e}" class="form-control font-monospace" rows="5" spellcheck="false" autocomplete="off" placeholder="Paste your signed record here"></textarea>
  <p class="form-text">Check verifies your record but shows no marks yet. <strong>Save is still required in P1</strong> to submit it.</p>
 `;
  return {
    id: e,
    title: s,
    weight: a,
    question: u,
    answer: async (o) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: t.email,
            quizSign: t.quizSign,
            questionId: e,
            quiz: "tds-2026-09-p1",
            response: o,
            weight: a,
          }),
        }),
        i = await r.json();
      if (!r.ok) throw Error(i.error || "Could not verify this signed record.");
      return i;
    },
  };
}
var le,
  ce,
  W = h(() => {
    "use strict";
    (le = "https://tds-network-games.sanand.workers.dev"),
      (ce = [
        ["Sat 14 Nov", "4:00\u20135:00 PM", "4:40 PM"],
        ["Sun 15 Nov", "8:00\u20139:00 AM", "8:40 AM"],
        ["Sun 15 Nov", "8:00\u20139:00 PM", "8:40 PM"],
      ]);
  });
import {
  html as g,
  render as K,
} from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
var S = (t, a) =>
  `${t} ${t == 1 ? "mark" : "marks"}` +
  (a === void 0 ? "" : ` \xB7 Bonus: ${a} ${a == 1 ? "mark" : "marks"}`);
function x(t, a) {
  let e = g`<ol class="mt-3">
    ${t.map(({ id: n, title: l, weight: u, bonus: c }) => g`<li><a href="#h${n}">${l}</a> (${S(u, c)})</li>`)}
  </ol>`,
    s = [
      g`<h1 class="display-6">Questions</h1>`,
      e,
      ...t.map(
        (
          {
            id: n,
            title: l,
            weight: u,
            bonus: c,
            bonusMessage: o,
            question: r,
            help: i,
          },
          G,
        ) => (
          i && !Array.isArray(i) && (i = [i]),
          g`
        <details class="card my-5" data-question="${n}" id="h${n}" open>
          <summary class="card-header d-flex align-items-center gap-2">
            <span class="badge text-bg-primary">${G + 1}</span>
            <span class="flex-grow-1">${l} (${S(u, c)})</span>
            <span class="badge text-bg-success solved-badge d-none"><i class="bi bi-check-circle-fill me-1"></i>Solved</span>
            <i class="bi bi-chevron-up question-chevron" aria-hidden="true"></i>
          </summary>
          ${
            c === void 0
              ? ""
              : g`<div class="alert alert-info m-3 mb-0" role="note">
            <strong>Bonus question.</strong> This question carries <strong>0 regular marks</strong>.
            ${o || (c ? g`Students who attempted it will receive <strong>${c} bonus ${c == 1 ? "mark" : "marks"}</strong>, awarded separately (not included in the exam score).` : g`It originally carried 0 marks, so no additional bonus marks are available. Participation is still recorded.`)}
          </div>`
          }
          ${i ? i.map((H) => g`<div class="card-body border-bottom">${H}</div>`) : ""}
          <div class="card-body">${r}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${n}">Check</button>
          </div>
        </details>
      `
        ),
      ),
    ],
    d = { index: e, questions: s };
  for (let [n, l] of a) K(d[l], n);
}
async function Ae(t, a) {
  let e = [
    {
      ...(await Promise.resolve()
        .then(() => (I(), T))
        .then((s) => s.default({ user: t, weight: 1 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => (q(), $))
        .then((s) => s.default({ user: t, weight: 1 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => (E(), A))
        .then((s) => s.default({ user: t, weight: 1 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => (O(), P))
        .then((s) => s.default({ user: t, weight: 0 }))),
      bonus: 1,
    },
    {
      ...(await Promise.resolve()
        .then(() => (R(), C))
        .then((s) => s.default({ weight: 0 }))),
      bonus: 0,
    },
    {
      ...(await Promise.resolve()
        .then(() => (Y(), N))
        .then((s) => s.default({ user: t, weight: 0 }))),
      bonus: 10,
    },
    {
      ...(await Promise.resolve()
        .then(() => (j(), U))
        .then((s) => s.default({ user: t, weight: 10 }))),
    },
    {
      ...(await Promise.resolve()
        .then(() => (L(), J))
        .then((s) => s.default({ user: t, weight: 0 }))),
      bonus: 10,
      bonusMessage:
        "Your saved model will be evaluated after Project 1 closes, for up to 10 bonus marks awarded separately.",
    },
    {
      ...(await Promise.resolve()
        .then(() => (W(), B))
        .then((s) => s.default({ user: t, weight: 0 }))),
      bonus: 10,
      bonusMessage:
        "We will mark your signed Invisible Ink record after the live sessions, for up to 10 bonus marks awarded separately.",
    },
  ];
  return x(e, a), Object.fromEntries(e.map(({ id: s, ...d }) => [s, d]));
}
export { Ae as questions };
