// Audit snapshot of https://exam.sanand.workers.dev/exam-tds-2026-09-ga4.js (prettier 3.4.2), fetched 2026-11-21.
// check.mjs compares the question ids and order in this file with the registry. Do not edit.
var D = Object.defineProperty;
var v = (e, o) => () => (e && (o = e((e = 0))), o);
var k = (e, o) => {
  for (var s in o) D(e, s, { get: o[s], enumerable: !0 });
};
var C = {};
k(C, { default: () => N });
import { html as x } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function N({ user: e, weight: o = 1 }) {
  let s = "q-ga4-face-peer-review-server",
    n = "Review classmates' GA3 faces (24 comparisons)",
    g = new URLSearchParams({
      email: e.email,
      quizSign: e.quizSign || "",
      questionId: "q-face-peer-review",
    }),
    r,
    d;
  try {
    let i = await fetch(`./questionData?${g}`, { cache: "no-store" }),
      l = await i.json();
    if (!i.ok) throw new Error(l.error || "Could not get your review link.");
    if (!l.available)
      throw new Error(l.message || "Review is not open yet. Try again later.");
    r = l;
  } catch (i) {
    d = i instanceof Error ? i.message : String(i);
  }
  let m = x`
    <div class="mb-3">
      <p>Help evaluate the GA3 face assignments by comparing <strong>two examples at a time</strong>. You need
        <strong>8 valid comparisons in each of 3 categories (24 total)</strong> for <strong>1 mark</strong>.</p>
      <ul>
        <li><strong>3D face reconstructions:</strong> 8 comparisons of models against reference photos.</li>
        <li><strong>Morph videos:</strong> 8 comparisons of smoothness and fidelity.</li>
        <li><strong>Face pairs:</strong> 8 comparisons of how easy the pairs would be to morph.</li>
      </ul>
      <p>Choose A, B, or Both about equal. <strong>Can't judge / broken media</strong> does not count towards your 24.
        If anything fails to load, use Can't judge. You can stop and resume later.
        Once you complete 24, you may optionally review more (up to 32 per category); extra reviews do not increase the mark.</p>
      ${
        r
          ? x`<p><a href="${r.launch_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open your face-review desk</a></p>
            <p class="form-text">The link is personal and expires after 20 minutes. Reload GA4 for a new link. Do not share your link or sign-in token.</p>`
          : x`<p class="alert alert-info" role="status">${d || "Your review link is not available yet."} Reload this exam after the course announcement.</p>`
      }
      <p>In the review app, select <strong>Assessment receipt for GA3 → Generate &amp; copy receipt</strong>
        (or <strong>Get signed proof for GA3</strong> after completion). Return here, paste your JWT,
        press <strong>Check</strong> and then <strong>Save</strong>.</p>
      <label for="${s}" class="form-label"><strong>Signed face-review participation JWT</strong></label>
      <textarea id="${s}" name="${s}" class="form-control font-monospace" rows="5"
        spellcheck="false" autocomplete="off" placeholder="Paste the JWT from the face-review app"></textarea>
      <p class="form-text">A JWT with fewer than 8 assessments in any category earns 0 for now.
        You can continue reviewing and generate a newer JWT. A valid, completed JWT earns 1 mark;
        it does not certify the quality of individual judgements.</p>
    </div>
  `;
  return {
    id: s,
    title: n,
    weight: o,
    question: m,
    answer: async (i) => {
      let l = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            questionId: s,
            quiz: "tds-2026-09-ga4",
            response: i,
            weight: o,
          }),
        }),
        c = await l.json();
      if (!l.ok) throw new Error(c.error || "Unable to verify your receipt.");
      return c;
    },
  };
}
var E = v(() => {
  "use strict";
});
var P = {};
k(P, { default: () => J });
import { html as w } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function J({ user: e, weight: o = 1, quiz: s = "tds-2026-09-ga4" }) {
  let n = "q-food-court-discount",
    g = s === "aipl-2026-11-15",
    r = "Food Court: share a food court, live (20 minutes)",
    d = new URLSearchParams({
      email: e.email,
      quizSign: e.quizSign || "",
      questionId: n,
    }),
    m,
    u,
    i = [],
    [l, c] = await Promise.allSettled([
      fetch(`./questionData?${d}`, { cache: "no-store" }).then(async (a) => {
        let f = await a.json().catch(() => ({}));
        if (!a.ok) throw new Error(f.error || "Could not get your game link.");
        return f;
      }),
      fetch(`${z}/realtime/api/schedule?game=food-court`, {
        cache: "no-store",
      }).then((a) =>
        a.ok
          ? a.json()
          : Promise.reject(new Error("Could not load session times.")),
      ),
    ]);
  l.status === "fulfilled" ? (m = l.value) : (u = l.reason?.message),
    c.status === "fulfilled" &&
      (i = c.value.sessions.filter(
        (a) => a.status !== "cancelled" && a.exam === s,
      ));
  let p = g ? "Asia/Singapore" : "Asia/Kolkata",
    b = g ? "SGT" : "IST",
    $ = (a) =>
      new Date(a).toLocaleString("en-GB", {
        timeZone: p,
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: !0,
      }),
    S = (a) =>
      new Date(a).toLocaleString(void 0, {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    q = w`
    <div class="mb-3">
      <p>Run one of 4 or 5 restaurants in a shared food court for one year. Each month, choose
        <strong>0%, 10% or 20% off</strong>. Discounts win customers from other restaurants and bring more visitors to
        everyone, but you keep less from each meal. Your mark is <strong>60% team score</strong> (total food-court profit)
        plus <strong>40% your score</strong> (your own profit). You play live with classmates for 20 minutes.</p>
      <h3 class="h6">Sessions (choose any, up to all three)</h3>
      <ul>
        ${i.length ? i.map((a) => w`<li><strong>${$(a.starts_at)} ${b}</strong> <span class="text-muted">(your time: ${S(a.starts_at)})</span>${a.phase === "completed" ? w` <span class="badge text-bg-secondary">finished</span>` : a.phase === "live" ? w` <span class="badge text-bg-success">live now</span>` : ""}</li>`) : g ? w`<li>Sunday 15 November 2026, 12:00 noon, 12:30 PM and 1:00 PM SGT</li>` : w`<li>Tuesday 10 November 2026, 6:00 PM IST</li><li>Wednesday 11 November 2026, 7:30 AM IST</li><li>Wednesday 11 November 2026, 9:00 PM IST</li>`}
      </ul>
      <ol>
        <li>Open the game below up to 15 minutes before a session. Select <strong>Join</strong>. Be on time: joining closes 90 seconds after the start.</li>
        <li>We place you in a room of 4 or 5. If we cannot place you, it does not count and is not a zero. Join another session.</li>
        <li>Choose your discounts, talk with your room, and press <strong>Save</strong>. Only Saved plans count. We record them at 07:00, 12:00, 17:00 and at the end.</li>
        <li>At the end, copy your signed result. Paste it below, press <strong>Check</strong>, then <strong>Save</strong>.</li>
        <li>You can play each session once. Paste your best result. AI agents and outside help are allowed.</li>
      </ol>
      ${
        m
          ? w`<p><a href="${m.launch_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open Food Court</a></p>
            <p class="form-text">This link is personal and expires after 20 minutes. Reload the exam for a new link. Do not share it.</p>`
          : w`<p class="alert alert-info" role="status">${u || "Your game link is not available yet."} Reload this page to try again.</p>`
      }
      <label for="${n}" class="form-label"><strong>Your signed Food Court result (JWT)</strong></label>
      <textarea id="${n}" name="${n}" class="form-control font-monospace" rows="5" spellcheck="false" autocomplete="off"
        placeholder="Paste the result from the Food Court page"></textarea>
      <p class="form-text">Check verifies the signature and shows your mark (final score / 100 × ${o}). Any valid final result counts.</p>
    </div>
  `;
  return {
    id: n,
    title: r,
    weight: o,
    question: q,
    answer: async (a) => {
      let f = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            questionId: n,
            quiz: s,
            response: a,
            weight: o,
          }),
        }),
        T = await f.json();
      if (!f.ok) throw new Error(T.error || "Unable to verify your result.");
      return T;
    },
  };
}
var z,
  R = v(() => {
    "use strict";
    z = "https://tds-network-games.sanand.workers.dev";
  });
var W = {};
k(W, { default: () => L });
import { html as h } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function L({ user: e, weight: o = 1 }) {
  let s = "q-time-use-charts",
    n = "Time Use Charts: make a data poster with your team, live (45 minutes)",
    g = new URLSearchParams({
      email: e.email,
      quizSign: e.quizSign || "",
      questionId: s,
    }),
    r,
    d,
    m = [],
    u = null,
    [i, l] = await Promise.allSettled([
      fetch(`./questionData?${g}`, { cache: "no-store" }).then(async (t) => {
        let a = await t.json().catch(() => ({}));
        if (!t.ok) throw new Error(a.error || "Could not get your game link.");
        return a;
      }),
      fetch(`${U}/realtime/api/schedule?game=time-use-charts`, {
        cache: "no-store",
      }).then((t) =>
        t.ok
          ? t.json()
          : Promise.reject(new Error("Could not load session times.")),
      ),
    ]);
  i.status === "fulfilled" ? (r = i.value) : (d = i.reason?.message),
    l.status === "fulfilled" &&
      ((u = l.value.info),
      (m = l.value.sessions.filter((t) => t.status !== "cancelled")));
  let c = u?.themes ?? [],
    p = c.find((t) => t.id === r?.theme),
    b = (t) =>
      new Date(t).toLocaleString("en-GB", {
        timeZone: "Asia/Kolkata",
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "numeric",
        minute: "2-digit",
        hour12: !0,
      }),
    $ = (t) =>
      new Date(t).toLocaleString(void 0, {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    S = h`
    <div class="mb-3">
      <p>India's <a href="${G}" target="_blank" rel="noopener noreferrer">Time Use Survey 2024</a> (NSO, MoSPI) shows how
        people in India spend each minute of the day. <strong>Download the data and study it before your session.</strong>
        You play live for 45 minutes in a team of 3 classmates with the same theme. Sometimes a team has 2.</p>
      ${
        p
          ? h`<div class="alert alert-primary"><strong>Your theme: ${p.title}.</strong> <em>${p.hook}</em>
            <ul class="mb-0">${p.angles.map((t) => h`<li>${t}</li>`)}</ul>
            <span class="small">Your theme is the same in every session. These questions are only a start. Find something surprising, important and true.</span></div>`
          : h`<p class="alert alert-info">Open the game below to see your theme.</p>`
      }
      <div class="alert alert-warning"><strong>Stay for all 45 minutes.</strong> All of you must vote for the same idea before you can
        make the poster. If one person leaves, your whole team may be unable to submit. Then nobody in the team gets marks for that session.</div>
      <h3 class="h6">Sessions (play one, two or all three)</h3>
      <ul>
        ${m.length ? m.map((t) => h`<li><strong>${b(t.starts_at)} IST</strong> <span class="text-muted">(your time: ${$(t.starts_at)})</span>${t.phase === "completed" ? h` <span class="badge text-bg-secondary">finished</span>` : t.phase === "live" ? h` <span class="badge text-bg-success">live now</span>` : ""}</li>`) : h`<li>Thursday 12 November 2026, 9:00 PM IST</li><li>Friday 13 November 2026, 6:00 PM IST</li><li>Saturday 14 November 2026, 8:00 AM IST</li>`}
      </ul>
      <h3 class="h6">Your role</h3>
      <ul>
        <li><strong>Designer:</strong> makes the chart and uploads it.</li>
        <li><strong>Writer:</strong> writes the title, the subtitle, the text at the bottom and the evidence.</li>
        <li><strong>Reviewer:</strong> checks the poster, chats, and answers three questions. The Reviewer cannot change the poster.</li>
      </ul>
      <h3 class="h6">How it works</h3>
      <ol>
        <li>Open the game up to 15 minutes before a session. Select <strong>Join</strong>. Be on time.</li>
        <li><strong>00:00 to 15:00: work alone.</strong> Write one short idea from the data. You cannot see other ideas. You cannot chat.
          If you write nothing, your idea is blank. If you arrive late, you can join a team of two as its Reviewer until 15:00.</li>
        <li><strong>15:00 to 45:00: agree, then make.</strong> You see all the ideas. <strong>All</strong> of you must vote for the
          <strong>same</strong> idea. A majority is not enough. The clock does not stop. If you do not agree, you make nothing.
          When you agree, make the poster together.</li>
        <li><strong>Submit.</strong> Everyone online approves the same version. At 45:00 editing stops. You then have 15 seconds to approve.</li>
        <li>When the session ends, copy your signed record. Paste it below. Press <strong>Check</strong>. Then press <strong>Save</strong>.
          You may use AI and outside help.</li>
      </ol>
      <h3 class="h6">Marks (we mark the posters some days after the sessions)</h3>
      <ul>
        ${(
          u?.evaluation?.dimensions ?? [
            {
              label: "Uniqueness",
              weight: 0.25,
              text: "Is your finding different from other teams' findings? We compare the finding, not the words or the design.",
            },
            {
              label: "Correctness",
              weight: 0.25,
              text: "Does the poster match the data and the idea your team chose? Wrong or misleading claims lose marks.",
            },
            {
              label: "Comprehension",
              weight: 0.25,
              text: "We show only the poster to people and to AI. Can they tell what your team's idea is?",
            },
            {
              label: "Preference",
              weight: 0.25,
              text: "Classmates compare two posters at a time, without names, and choose the better one.",
            },
          ]
        ).map(
          (t) =>
            h`<li><strong>${t.label} (${Math.round(t.weight * 100)}%):</strong> ${t.text}</li>`,
        )}
      </ul>
      <p><strong>The person whose idea your team chooses gets 20% of the marks.</strong> Everyone in the team gets the other 80%.
        If your team does not agree, or does not submit a poster, nobody in the team gets marks for that session.
        If you play more than one session, we count your best one. Check gives 0 marks now. We add your marks (out of ${o}) later.</p>
      ${c.length ? h`<details class="mb-3"><summary>All six themes</summary><ul>${c.map((t) => h`<li><strong>${t.title}</strong>: ${t.hook}</li>`)}</ul></details>` : ""}
      ${
        r
          ? h`<p><a href="${r.launch_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open Time Use Charts</a></p>
            <p class="form-text">This link is only for you. It stops working after 20 minutes. Reload this page for a new link. Do not share it.</p>`
          : h`<p class="alert alert-info" role="status">${d || "Your game link is not ready yet."} Reload this page to try again.</p>`
      }
      <label for="${s}" class="form-label"><strong>Your signed Time Use Charts record (JWT)</strong></label>
      <textarea id="${s}" name="${s}" class="form-control font-monospace" rows="5" spellcheck="false" autocomplete="off"
        placeholder="Paste the record from the Time Use Charts page"></textarea>
      <p class="form-text">Check makes sure the record is real. It shows your role and if your team submitted a poster.</p>
    </div>
  `;
  return {
    id: s,
    title: n,
    weight: o,
    question: S,
    answer: async (t) => {
      let a = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            questionId: s,
            quiz: "tds-2026-09-ga4",
            response: t,
            weight: o,
          }),
        }),
        f = await a.json();
      if (!a.ok) throw new Error(f.error || "Unable to verify your record.");
      return f;
    },
  };
}
var U,
  G,
  Y = v(() => {
    "use strict";
    (U = "https://tds-network-games.sanand.workers.dev"),
      (G = "https://microdata.gov.in/NADA/index.php/catalog/236");
  });
var j = {};
k(j, { default: () => F });
import { html as _ } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function F({ weight: e = 0 } = {}) {
  let o = "q-roe-ideas",
    s = "Invent an ROE question",
    n = _`
    <p>Suggest one or more ideas for a <strong>45-minute ROE question</strong>. Your question should:</p>
    <ul>
      <li><strong>Teach something useful:</strong> even when everyone can use AI, friends, etc.</li>
      <li><strong>Need human contribution:</strong> Just running an agent/solver score low. A human supplying a missing ingredient is key.</li>
      <li><strong>Engaging:</strong> Students should enjoy it.</li>
    </ul>
    <p>For <strong>each idea</strong>, explain:</p>
    <ol>
      <li><strong>Question:</strong> What exactly would students do?</li>
      <li><strong>Evaluation:</strong> How would we grade their work in an <strong>automated way</strong>?</li>
      <li><strong>Learning:</strong> What would they learn and why is that useful?</li>
      <li><strong>Agent/solver resistance:</strong> Why would an agent or off-the-shelf solver alone score poorly,
        and what could a student contribute to do better?</li>
    </ol>
    <p>Agents and instructors will shortlist ideas against these criteria. Faculty will read a subset.</p>
    <p><strong>Bonus marks:</strong>
    <ul>
      <li><strong>Zero</strong> if you don't at attempt (or submit less than 10 characters).</li>
      <li><strong>Up to +10</strong> based on how much the faculty thinks this is a good idea (low probability).</li>
      <li><strong>MINUS 1</strong> if none of the above (high probability).
    </ul>
    <label for="${o}" class="form-label"><strong>Your ROE question idea(s)</strong></label>
    <textarea id="${o}" name="${o}" class="form-control" rows="10"
      placeholder="Question: ...\n\nEvaluation: ...\n\nLearning: ...\n\nAgent/solver resistance: ..."></textarea>
    <p class="form-text">If you choose to participate, write your idea, then press <strong>Check</strong> and
      <strong>Save</strong>. Leave this blank or keep it under 10 characters to opt out with no penalty.</p>
  `;
  return {
    id: o,
    title: s,
    weight: e,
    question: n,
    answer: async (r) =>
      r?.trim()
        ? {
            correct: !0,
            score: 0,
            validMessage:
              "Ready to save (0 marks now). Faculty may award bonus marks or a penalty after review.",
          }
        : {
            correct: !1,
            score: 0,
            invalidMessage:
              "Optional: leave blank to skip this question, or write an idea to participate.",
          },
  };
}
var O = v(() => {
  "use strict";
});
import {
  html as y,
  render as M,
} from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
var A = (e, o) =>
  `${e} ${e == 1 ? "mark" : "marks"}` +
  (o === void 0 ? "" : ` \xB7 Bonus: ${o} ${o == 1 ? "mark" : "marks"}`);
function I(e, o) {
  let s = y`<ol class="mt-3">
    ${e.map(({ id: r, title: d, weight: m, bonus: u }) => y`<li><a href="#h${r}">${d}</a> (${A(m, u)})</li>`)}
  </ol>`,
    n = [
      y`<h1 class="display-6">Questions</h1>`,
      s,
      ...e.map(
        (
          {
            id: r,
            title: d,
            weight: m,
            bonus: u,
            bonusMessage: i,
            question: l,
            help: c,
          },
          p,
        ) => (
          c && !Array.isArray(c) && (c = [c]),
          y`
        <details class="card my-5" data-question="${r}" id="h${r}" open>
          <summary class="card-header d-flex align-items-center gap-2">
            <span class="badge text-bg-primary">${p + 1}</span>
            <span class="flex-grow-1">${d} (${A(m, u)})</span>
            <span class="badge text-bg-success solved-badge d-none"><i class="bi bi-check-circle-fill me-1"></i>Solved</span>
            <i class="bi bi-chevron-up question-chevron" aria-hidden="true"></i>
          </summary>
          ${
            u === void 0
              ? ""
              : y`<div class="alert alert-info m-3 mb-0" role="note">
            <strong>Bonus question.</strong> This question carries <strong>0 regular marks</strong>.
            ${i || (u ? y`Students who attempted it will receive <strong>${u} bonus ${u == 1 ? "mark" : "marks"}</strong>, awarded separately (not included in the exam score).` : y`It originally carried 0 marks, so no additional bonus marks are available. Participation is still recorded.`)}
          </div>`
          }
          ${c ? c.map((b) => y`<div class="card-body border-bottom">${b}</div>`) : ""}
          <div class="card-body">${l}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${r}">Check</button>
          </div>
        </details>
      `
        ),
      ),
    ],
    g = { index: s, questions: n };
  for (let [r, d] of o) M(g[d], r);
}
async function te(e, o) {
  let s = [
    await Promise.resolve()
      .then(() => (E(), C))
      .then((n) => n.default({ user: e, weight: 1 })),
    await Promise.resolve()
      .then(() => (R(), P))
      .then((n) => n.default({ user: e, weight: 10 })),
    await Promise.resolve()
      .then(() => (Y(), W))
      .then((n) => n.default({ user: e, weight: 10 })),
    {
      ...(await Promise.resolve()
        .then(() => (O(), j))
        .then((n) => n.default({ weight: 0 }))),
      bonus: 10,
      bonusMessage:
        "After faculty review, up to +10 bonus marks if selected (unlikely), or -1 if not (likely).",
    },
  ];
  return I(s, o), Object.fromEntries(s.map(({ id: n, ...g }) => [n, g]));
}
export { te as questions };
