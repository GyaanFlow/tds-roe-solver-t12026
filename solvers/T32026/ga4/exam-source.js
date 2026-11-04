// Audit snapshot of https://exam.sanand.workers.dev/exam-tds-2026-09-ga4.js (prettier 3.4.2), fetched 2026-11-04.
// check.mjs compares the question ids and order in this file with the registry. Do not edit.
var v = Object.defineProperty;
var b = (e, r) => () => (e && (r = e((e = 0))), r);
var k = (e, r) => {
  for (var a in r) v(e, a, { get: r[a], enumerable: !0 });
};
var h = {};
k(h, { default: () => q });
import { html as u } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function q({ user: e, weight: r = 1 }) {
  let a = "q-ga4-face-peer-review-server",
    c = "Review classmates' GA3 faces (24 comparisons)",
    d = new URLSearchParams({
      email: e.email,
      quizSign: e.quizSign || "",
      questionId: "q-face-peer-review",
    }),
    o,
    n;
  try {
    let s = await fetch(`./questionData?${d}`, { cache: "no-store" }),
      t = await s.json();
    if (!s.ok) throw new Error(t.error || "Could not get your review link.");
    if (!t.available)
      throw new Error(t.message || "Review is not open yet. Try again later.");
    o = t;
  } catch (s) {
    n = s instanceof Error ? s.message : String(s);
  }
  let p = u`
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
        o
          ? u`<p><a href="${o.launch_url}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">Open your face-review desk</a></p>
            <p class="form-text">The link is personal and expires after 20 minutes. Reload GA4 for a new link. Do not share your link or sign-in token.</p>`
          : u`<p class="alert alert-info" role="status">${n || "Your review link is not available yet."} Reload this exam after the course announcement.</p>`
      }
      <p>In the review app, select <strong>Assessment receipt for GA3 → Generate &amp; copy receipt</strong>
        (or <strong>Get signed proof for GA3</strong> after completion). Return here, paste your JWT,
        press <strong>Check</strong> and then <strong>Save</strong>.</p>
      <label for="${a}" class="form-label"><strong>Signed face-review participation JWT</strong></label>
      <textarea id="${a}" name="${a}" class="form-control font-monospace" rows="5"
        spellcheck="false" autocomplete="off" placeholder="Paste the JWT from the face-review app"></textarea>
      <p class="form-text">A JWT with fewer than 8 assessments in any category earns 0 for now.
        You can continue reviewing and generate a newer JWT. A valid, completed JWT earns 1 mark;
        it does not certify the quality of individual judgements.</p>
    </div>
  `;
  return {
    id: a,
    title: c,
    weight: r,
    question: p,
    answer: async (s) => {
      let t = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            questionId: a,
            quiz: "tds-2026-09-ga4",
            response: s,
            weight: r,
          }),
        }),
        m = await t.json();
      if (!t.ok) throw new Error(m.error || "Unable to verify your receipt.");
      return m;
    },
  };
}
var y = b(() => {
  "use strict";
});
import {
  html as l,
  render as $,
} from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
var f = (e, r) =>
  `${e} ${e == 1 ? "mark" : "marks"}` +
  (r === void 0 ? "" : ` \xB7 Bonus: ${r} ${r == 1 ? "mark" : "marks"}`);
function g(e, r) {
  let a = l`<ol class="mt-3">
    ${e.map(({ id: o, title: n, weight: p, bonus: i }) => l`<li><a href="#h${o}">${n}</a> (${f(p, i)})</li>`)}
  </ol>`,
    c = [
      l`<h1 class="display-6">Questions</h1>`,
      a,
      ...e.map(
        ({ id: o, title: n, weight: p, bonus: i, question: s, help: t }, m) => (
          t && !Array.isArray(t) && (t = [t]),
          l`
        <details class="card my-5" data-question="${o}" id="h${o}" open>
          <summary class="card-header d-flex align-items-center gap-2">
            <span class="badge text-bg-primary">${m + 1}</span>
            <span class="flex-grow-1">${n} (${f(p, i)})</span>
            <span class="badge text-bg-success solved-badge d-none"><i class="bi bi-check-circle-fill me-1"></i>Solved</span>
            <i class="bi bi-chevron-up question-chevron" aria-hidden="true"></i>
          </summary>
          ${
            i === void 0
              ? ""
              : l`<div class="alert alert-info m-3 mb-0" role="note">
            <strong>Bonus question.</strong> This question carries <strong>0 regular marks</strong>.
            ${i ? l`Students who attempted it will receive <strong>${i} bonus ${i == 1 ? "mark" : "marks"}</strong>, awarded separately (not included in the exam score).` : l`It originally carried 0 marks, so no additional bonus marks are available. Participation is still recorded.`}
          </div>`
          }
          ${t ? t.map((w) => l`<div class="card-body border-bottom">${w}</div>`) : ""}
          <div class="card-body">${s}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${o}">Check</button>
          </div>
        </details>
      `
        ),
      ),
    ],
    d = { index: a, questions: c };
  for (let [o, n] of r) $(d[n], o);
}
async function C(e, r) {
  let a = [
    await Promise.resolve()
      .then(() => (y(), h))
      .then((c) => c.default({ user: e, weight: 1 })),
  ];
  return g(a, r), Object.fromEntries(a.map(({ id: c, ...d }) => [c, d]));
}
export { C as questions };
