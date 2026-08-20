var O = Object.defineProperty;
var h = (i, t) => () => (i && (t = i((i = 0))), t);
var p = (i, t) => {
  for (var e in t) O(i, e, { get: t[e], enumerable: !0 });
};
var b = {};
p(b, { default: () => R });
import { html as M } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function R({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-dth-month-end-server",
    r = "Case Study 1A \u2014 DTH Month-End Mystery",
    [c, a, l] = [200, 6e3, 2.5],
    m = async (o) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: o,
            weight: t,
            questionId: e,
          }),
        }),
        u = await s.json();
      if (!s.ok)
        throw new Error(u.error || "Unable to validate your submission.");
      return u;
    },
    n = "https://files.s-anand.net/pages/tds-2026-05-p2/data/dth-retention/",
    d = M`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">SkyWave Direct · DTH Retention</h5>
        <h6 class="card-subtitle mb-3 text-muted">Month-End Mystery · Suggested time: 10 minutes</h6>
        <p class="mb-0">
          You are the retention analytics manager. A reviewer has flagged a cluster of West-region
          annual-plan renewals posted on 31 May. Decide whether it indicates duplicate revenue,
          manipulated reporting, a pipeline defect, or no material issue based on the supplied evidence.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Data files — use all three</h6>
        <ul class="mb-0">
          <li><a href="${n}recharges.csv" target="_blank" rel="noopener">recharges.csv</a> — recharge events with effective and posting dates</li>
          <li><a href="${n}dealer_import_log.csv" target="_blank" rel="noopener">dealer_import_log.csv</a> — batch controls and reconciliations</li>
          <li><a href="${n}email-dealer-reconciliation.eml" target="_blank" rel="noopener">email-dealer-reconciliation.eml</a> — operations explanation of the upload process</li>
        </ul>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit a one-page diagnostic note containing</h6>
        <ol class="mb-0">
          <li>A direct escalation judgment.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>Rejected hypotheses and the evidence used to reject them.</li>
          <li>Material unknowns and the evidence that would change your decision.</li>
          <li>A safe, reversible next action.</li>
        </ol>
        <p class="small text-muted mt-2 mb-0">
          Evidence is scored before conclusion. A precise, supported alternative or “insufficient evidence”
          judgment can earn full marks. Do not treat an email assertion as proof without testing the data.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your diagnostic response</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="16"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Judgment\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypotheses\n\n## Unknowns and Decision-Changing Evidence\n\n## Safe Next Action"
        @input=${(o) => {
          let s = document.getElementById(`counter-${e}`);
          s && (s.textContent = `${o.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: d, answer: m };
}
var g = h(() => {
  "use strict";
});
var y = {};
p(y, { default: () => H });
import { html as P } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function H({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-dth-complaints-quiet-server",
    r = "Case Study 1B \u2014 DTH Complaints Went Quiet",
    [c, a, l] = [200, 6e3, 2.5],
    m = async (o) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: o,
            weight: t,
            questionId: e,
          }),
        }),
        u = await s.json();
      if (!s.ok)
        throw new Error(u.error || "Unable to validate your submission.");
      return u;
    },
    n = "https://files.s-anand.net/pages/tds-2026-05-p2/data/dth-retention/",
    d = P`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">SkyWave Direct · Customer Care</h5>
        <h6 class="card-subtitle mb-3 text-muted">Complaints Went Quiet · Suggested time: 30 minutes</h6>
        <p class="mb-0">
          You are a forward-deployed analyst embedded with customer care. South-region complaint cases fell
          after the NovaIVR pilot. Assess whether this is evidence that self-service improved customer experience
          and whether the pilot should expand nationally.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Data and communications</h6>
        <ul>
          <li><a href="${n}tickets.csv" target="_blank" rel="noopener">tickets.csv</a></li>
          <li><a href="${n}ivr_interactions.jsonl" target="_blank" rel="noopener">ivr_interactions.jsonl</a></li>
          <li><a href="${n}service_events.csv" target="_blank" rel="noopener">service_events.csv</a></li>
          <li><a href="${n}email-ivr-pilot.eml" target="_blank" rel="noopener">email-ivr-pilot.eml</a></li>
        </ul>
        <h6>People you may choose to question</h6>
        <ul class="mb-0">
          <li><a href="${n}farah-iqbal.md" target="_blank" rel="noopener">Farah Iqbal</a> — Customer Care Operations</li>
          <li><a href="${n}dev-khanna.md" target="_blank" rel="noopener">Dev Khanna</a> — Billing Systems</li>
        </ul>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit a concise diagnostic note containing</h6>
        <ol class="mb-0">
          <li>A direct recommendation on the evidence and national expansion.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>Rejected hypotheses, material unknowns, and a safe next action.</li>
          <li>The one person you would question and exactly five questions you would ask.</li>
        </ol>
        <p class="small text-muted mt-2 mb-0">
          The five questions themselves are graded; no live interview answer is required in this online submission.
          Distinguish observed facts, inferences, causal claims, and remaining unknowns.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your diagnostic response</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="16"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Judgment\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypotheses and Unknowns\n\n## Safe Next Action\n\n## Person and Five Questions\n1.\n2.\n3.\n4.\n5."
        @input=${(o) => {
          let s = document.getElementById(`counter-${e}`);
          s && (s.textContent = `${o.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: d, answer: m };
}
var $ = h(() => {
  "use strict";
});
var w = {};
p(w, { default: () => N });
import { html as z } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function N({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-solar-smell-test-server",
    r = "Case Study 2A \u2014 Solar Inverter Smell Test",
    [c, a, l] = [150, 3e3, 2.5],
    m = async (d) => {
      let o = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: d,
            weight: t,
            questionId: e,
          }),
        }),
        s = await o.json();
      if (!o.ok)
        throw new Error(s.error || "Unable to validate your submission.");
      return s;
    },
    n = z`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">ARPL Solar · Plant Operations</h5>
        <h6 class="card-subtitle mb-3 text-muted">Inverter Event Smell Test · Suggested time: 10 minutes</h6>
        <p class="mb-2">
          You are reviewing a small inverter-event export before a broader analysis session. Does anything
          in this file smell wrong enough to escalate?
        </p>
        <p class="mb-0">
          Identify at most two things worth checking and explain why you would—or would not—spend more time
          on each. You may conclude that nothing warrants escalation, but your conclusion must be evidence-based.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Only file in scope</h6>
        <a href="https://files.s-anand.net/pages/tds-2026-05-p2/data/solar-panels/inverter_events.csv" target="_blank" rel="noopener">inverter_events.csv</a>
        <p class="small text-muted mt-2 mb-0">
          If another source would materially change your decision, name the smallest useful check; do not assume it is available.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit</h6>
        <ul class="mb-0">
          <li>At most two prioritized findings, with evidence and claim-specific confidence.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>At least one genuinely rejected hypothesis and why the evidence rejects it.</li>
          <li>A scoped conclusion: escalate, perform one cheap check, or stop.</li>
        </ul>
        <p class="small text-muted mt-2 mb-0">
          Keep the substantive response to at most five items in total (evidence-table rows and narrative
          bullets); headings and the table header do not count. Do not infer equipment failure, intent, or
          commercial impact from event wording alone.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your diagnostic response</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="12"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Prioritized Findings\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypothesis\n\n## Conclusion"
        @input=${(d) => {
          let o = document.getElementById(`counter-${e}`);
          o && (o.textContent = `${d.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: n, answer: m };
}
var x = h(() => {
  "use strict";
});
var k = {};
p(k, { default: () => U });
import { html as Y } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function U({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-solar-impact-claim-server",
    r = "Case Study 2B \u2014 Solar 31.6% Impact Claim",
    [c, a, l] = [200, 6e3, 2.5],
    m = async (o) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: o,
            weight: t,
            questionId: e,
          }),
        }),
        u = await s.json();
      if (!s.ok)
        throw new Error(u.error || "Unable to validate your submission.");
      return u;
    },
    n = "https://files.s-anand.net/pages/tds-2026-05-p2/data/solar-panels/",
    d = Y`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">ARPL Solar · Wind-Stow Pilot</h5>
        <h6 class="card-subtitle mb-3 text-muted">What Does the 31.6% Result Show? · Suggested time: 30 minutes</h6>
        <p class="mb-0">
          Assess whether the evidence supports the impact note’s claim that the pilot reduced DSM penalty by
          31.6%. State the strongest conclusion you can defend and what the evidence cannot establish.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Files in scope — use all three</h6>
        <ul class="mb-0">
          <li><a href="${n}AI_Pilot_Impact_Note.md" target="_blank" rel="noopener">AI_Pilot_Impact_Note.md</a></li>
          <li><a href="${n}dispatch_blocks.csv" target="_blank" rel="noopener">dispatch_blocks.csv</a></li>
          <li><a href="${n}DSM_Commercial_Extract.pdf" target="_blank" rel="noopener">DSM_Commercial_Extract.pdf</a></li>
        </ul>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit a one-page judgment containing</h6>
        <ol class="mb-0">
          <li>A direct conclusion about the 31.6% claim and the narrower claim the evidence supports.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>Rejected hypotheses and what remains causally unidentified.</li>
          <li>One decision-changing next measurement or validation design.</li>
          <li>A safe recommendation for continued use or expansion.</li>
        </ol>
        <p class="small text-muted mt-2 mb-0">
          Recompute what is reproducible from the block data. Do not assume that a favorable comparison is
          either causal proof or worthless evidence.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your judgment</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="16"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Judgment\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypotheses and Causal Limits\n\n## Next Measurement\n\n## Recommendation"
        @input=${(o) => {
          let s = document.getElementById(`counter-${e}`);
          s && (s.textContent = `${o.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: d, answer: m };
}
var _ = h(() => {
  "use strict";
});
var S = {};
p(S, { default: () => Q });
import { html as B } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function Q({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-customs-mismatch-server",
    r = "Case Study 3A \u2014 Swiss Mismatch Control",
    [c, a, l] = [150, 3e3, 2.5],
    m = async (o) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: o,
            weight: t,
            questionId: e,
          }),
        }),
        u = await s.json();
      if (!s.ok)
        throw new Error(u.error || "Unable to validate your submission.");
      return u;
    },
    n =
      "https://files.s-anand.net/pages/tds-2026-05-p2/data/customs-review/CH-2025-000522/",
    d = B`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">Asterion Ortho · EMEA Customs</h5>
        <h6 class="card-subtitle mb-3 text-muted">Swiss Mismatch Control · Suggested time: 15 minutes</h6>
        <p class="mb-0">
          An automated comparison on Swiss packet <strong>CH-2025-000522</strong> flagged a mismatch to
          Helios 90211090. Decide whether this code mismatch should be escalated as a likely declaration error.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Data files — packet CH-2025-000522 plus reference data</h6>
        <ul class="mb-0">
          <li><a href="${n}declaration.pdf" target="_blank" rel="noopener">declaration.pdf</a></li>
          <li><a href="${n}commercial_invoice.pdf" target="_blank" rel="noopener">commercial_invoice.pdf</a></li>
          <li><a href="${n}air_waybill.pdf" target="_blank" rel="noopener">air_waybill.pdf</a></li>
          <li><a href="${n}review_note.txt" target="_blank" rel="noopener">review_note.txt</a> — the automated flag</li>
          <li><a href="${n}packet_manifest.txt" target="_blank" rel="noopener">packet_manifest.txt</a></li>
          <li><a href="${n}product_master_current.xlsx" target="_blank" rel="noopener">product_master_current.xlsx</a></li>
          <li><a href="${n}country_tariff_matrix.xlsx" target="_blank" rel="noopener">country_tariff_matrix.xlsx</a></li>
          <li><a href="${n}canonical-schema-v0.3.md" target="_blank" rel="noopener">canonical-schema-v0.3.md</a> — field definitions</li>
        </ul>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit a half-page disposition containing</h6>
        <ol class="mb-0">
          <li>A direct answer or decision.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>Hypotheses you rejected and why.</li>
          <li>Missing evidence that could materially change your judgment.</li>
          <li>A safe next action.</li>
        </ol>
        <p class="small text-muted mt-2 mb-0">
          You are not scored on recovering a hidden intended answer. You are scored on the quality,
          traceability, and calibration of the judgment available from the materials.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your disposition</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="12"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Decision\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypotheses\n\n## Missing Evidence\n\n## Safe Next Action"
        @input=${(o) => {
          let s = document.getElementById(`counter-${e}`);
          s && (s.textContent = `${o.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: d, answer: m };
}
var C = h(() => {
  "use strict";
});
var q = {};
p(q, { default: () => W });
import { html as J } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function W({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-consumer-qc-queue-server",
    r = "Case Study 4A \u2014 QC Queue Smell Test",
    [c, a, l] = [200, 6e3, 2.5],
    m = async (o) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: o,
            weight: t,
            questionId: e,
          }),
        }),
        u = await s.json();
      if (!s.ok)
        throw new Error(u.error || "Unable to validate your submission.");
      return u;
    },
    n =
      "https://files.s-anand.net/pages/tds-2026-05-p2/data/consumer-products/",
    d = J`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">Aurelia Consumer Products · Quality Systems</h5>
        <h6 class="card-subtitle mb-3 text-muted">QC Queue Smell Test · Suggested time: 15 minutes</h6>
        <p class="mb-0">
          Operations says routine QC release "takes about a day and a half" and wants a dashboard by
          tomorrow. Before anyone builds it: does anything in the supplied QC release extract and process
          note smell wrong enough that you would verify it before using the apparent cycle time as a
          performance KPI? If yes, state the smallest verification you would do. If no, explain why not.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Data files — use all three</h6>
        <ul class="mb-0">
          <li><a href="${n}batch_release.csv" target="_blank" rel="noopener">batch_release.csv</a> — QC release extract</li>
          <li><a href="${n}qc_release_sop.md" target="_blank" rel="noopener">qc_release_sop.md</a> — the standard disposition process</li>
          <li><a href="${n}source_freshness.csv" target="_blank" rel="noopener">source_freshness.csv</a> — how current each upstream system's snapshot is</li>
        </ul>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit a one-page memo containing</h6>
        <ol class="mb-0">
          <li>Your answer or recommendation.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>Hypotheses you considered and rejected, with why.</li>
          <li>What you would ask for next if it could materially change the decision.</li>
        </ol>
        <p class="small text-muted mt-2 mb-0">
          Do not assume the brief is correctly framed. A justified "insufficient evidence" or reframing is a
          valid outcome. Cite file names and, where practical, rows, fields, or quoted text.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your diagnostic response</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="16"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Judgment\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypotheses\n\n## What Would Change the Decision"
        @input=${(o) => {
          let s = document.getElementById(`counter-${e}`);
          s && (s.textContent = `${o.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: d, answer: m };
}
var A = h(() => {
  "use strict";
});
var j = {};
p(j, { default: () => F });
import { html as V } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function F({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-customs-preference-server",
    r = "Case Study 3B \u2014 Is the Irish Preference Claim Supported?",
    [c, a, l] = [200, 6e3, 2.5],
    m = async (o) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: o,
            weight: t,
            questionId: e,
          }),
        }),
        u = await s.json();
      if (!s.ok)
        throw new Error(u.error || "Unable to validate your submission.");
      return u;
    },
    n =
      "https://files.s-anand.net/pages/tds-2026-05-p2/data/customs-review/IE-2025-000411/",
    d = V`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">Asterion Ortho · EMEA Customs</h5>
        <h6 class="card-subtitle mb-3 text-muted">Irish Preference Claim · Suggested time: 45 minutes</h6>
        <p class="mb-0">
          A preference indicator is present on Irish packet <strong>IE-2025-000411</strong>, but supplier support
          is not linked in ClearView. Assess whether the preferential-origin claim is supported by the available
          evidence, and what action is safe now.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Data files — packet IE-2025-000411 plus reference data</h6>
        <ul class="mb-0">
          <li><a href="${n}declaration.pdf" target="_blank" rel="noopener">declaration.pdf</a></li>
          <li><a href="${n}commercial_invoice.pdf" target="_blank" rel="noopener">commercial_invoice.pdf</a></li>
          <li><a href="${n}air_waybill.pdf" target="_blank" rel="noopener">air_waybill.pdf</a></li>
          <li><a href="${n}review_note.txt" target="_blank" rel="noopener">review_note.txt</a> — the automated flag</li>
          <li><a href="${n}packet_manifest.txt" target="_blank" rel="noopener">packet_manifest.txt</a></li>
          <li><a href="${n}supplier_declaration_reference.txt" target="_blank" rel="noopener">supplier_declaration_reference.txt</a></li>
          <li><a href="${n}supplier_origin_register.csv" target="_blank" rel="noopener">supplier_origin_register.csv</a></li>
          <li><a href="${n}origin-workshop.md" target="_blank" rel="noopener">origin-workshop.md</a> — meeting notes</li>
        </ul>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit a decision note containing</h6>
        <ol class="mb-0">
          <li>A direct answer or decision.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>Hypotheses you rejected and why.</li>
          <li>Missing evidence that could materially change your judgment.</li>
          <li>A safe next action.</li>
        </ol>
        <p class="small text-muted mt-2 mb-0">
          You are not scored on recovering a hidden intended answer. You are scored on the quality,
          traceability, and calibration of the judgment available from the materials.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your decision note</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="16"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Decision\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypotheses\n\n## Missing Evidence\n\n## Safe Next Action"
        @input=${(o) => {
          let s = document.getElementById(`counter-${e}`);
          s && (s.textContent = `${o.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: d, answer: m };
}
var T = h(() => {
  "use strict";
});
var E = {};
p(E, { default: () => K });
import { html as L } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function K({ user: i, weight: t = 12.5 } = {}) {
  let e = "q-case-consumer-spares-search-server",
    r = "Case Study 4B \u2014 Spare-Parts Search",
    [c, a, l] = [200, 6e3, 2.5],
    m = async (o) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: i.email,
            quizSign: i.quizSign,
            response: o,
            weight: t,
            questionId: e,
          }),
        }),
        u = await s.json();
      if (!s.ok)
        throw new Error(u.error || "Unable to validate your submission.");
      return u;
    },
    n =
      "https://files.s-anand.net/pages/tds-2026-05-p2/data/consumer-products/",
    d = L`
    <div class="mb-3">
      <div class="alert alert-warning" role="alert">
        <strong>Offline evaluation:</strong> this question is worth <strong>${t} marks</strong> in total.
        <kbd>Check</kbd> validates only the submission format and awards
        <strong>${l} participation marks</strong>. The remaining ${Math.round((t - l) * 100) / 100}
        marks assess your analysis offline.
      </div>

      <div class="card mb-4"><div class="card-body">
        <h5 class="card-title text-primary">Aurelia Consumer Products · Maintenance</h5>
        <h6 class="card-subtitle mb-3 text-muted">Spare-Parts Search · Suggested time: 30 minutes</h6>
        <p class="mb-0">
          Leadership suspects plants buy spare parts that already exist elsewhere because catalog descriptions
          differ. They want a semantic-search pilot and a quick estimate of potentially avoidable purchase value.
          Assess the opportunity in the sample: produce a short list of candidate matches and state what fraction
          of the apparent value you are prepared to call <strong>actionable now</strong>,
          <strong>needs engineering check</strong>, or <strong>not transferable from current evidence</strong>.
        </p>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Data files — use all six</h6>
        <ul class="mb-0">
          <li><a href="${n}spare_parts.csv" target="_blank" rel="noopener">spare_parts.csv</a></li>
          <li><a href="${n}part_requests.csv" target="_blank" rel="noopener">part_requests.csv</a></li>
          <li><a href="${n}part_restrictions.csv" target="_blank" rel="noopener">part_restrictions.csv</a></li>
          <li><a href="${n}spares_transfer_policy.md" target="_blank" rel="noopener">spares_transfer_policy.md</a></li>
          <li><a href="${n}maintenance_email.txt" target="_blank" rel="noopener">maintenance_email.txt</a></li>
          <li><a href="${n}source_freshness.csv" target="_blank" rel="noopener">source_freshness.csv</a> — how current each upstream system's snapshot is</li>
        </ul>
      </div></div>

      <div class="card mb-4"><div class="card-body">
        <h6>Submit a concise judgment memo containing</h6>
        <ol class="mb-0">
          <li>Your answer or recommendation, plus a candidate-match table.</li>
          <li>An evidence table: <code>claim | source | confidence</code>.</li>
          <li>Hypotheses you considered and rejected, with why.</li>
          <li>What you would ask for next if it could materially change the decision.</li>
        </ol>
        <p class="small text-muted mt-2 mb-0">
          Do not assume the brief is correctly framed. A justified "insufficient evidence" or reframing is a
          valid outcome. Cite file names and, where practical, rows, fields, or quoted text.
        </p>
      </div></div>

      <label for="${e}" class="form-label fw-semibold">Your diagnostic response</label>
      <textarea class="form-control font-monospace" id="${e}" name="${e}" rows="16"
        minlength="${c}" maxlength="${a}" aria-describedby="help-${e} counter-${e}"
        placeholder="## Judgment\n\n## Candidate Matches\n| Part | Match | Actionable now / Needs check / Not transferable |\n|---|---|---|\n\n## Evidence Table\n| Claim | Source | Confidence |\n|---|---|---|\n\n## Rejected Hypotheses\n\n## What Would Change the Decision"
        @input=${(o) => {
          let s = document.getElementById(`counter-${e}`);
          s && (s.textContent = `${o.target.value.length} / ${a} characters`);
        }}></textarea>
      <div id="counter-${e}" class="text-end small mt-1">0 / ${a} characters</div>
      <div id="help-${e}" class="form-text">
        Accepted length: ${c}–${a} characters. Requested sections are evaluated offline.
      </div>
    </div>`;
  return { id: e, title: r, weight: t, question: d, answer: m };
}
var I = h(() => {
  "use strict";
});
import {
  html as f,
  render as D,
} from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
function v(i, t) {
  let e = f`<ol class="mt-3">
    ${i.map(({ id: a, title: l, weight: m }) => f`<li><a href="#h${a}">${l}</a> (${m} ${m == 1 ? "mark" : "marks"})</li>`)}
  </ol>`,
    r = [
      f`<h1 class="display-6">Questions</h1>`,
      e,
      ...i.map(
        ({ id: a, title: l, weight: m, question: n, help: d }, o) => (
          d && !Array.isArray(d) && (d = [d]),
          f`
        <div class="card my-5" data-question="${a}" id="h${a}">
          <div class="card-header">
            <span class="badge text-bg-primary me-2">${o + 1}</span>
            ${l} (${m} ${m == 1 ? "mark" : "marks"})
          </div>
          ${d ? d.map((s) => f`<div class="card-body border-bottom">${s}</div>`) : ""}
          <div class="card-body">${n}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${a}">Check</button>
          </div>
        </div>
      `
        ),
      ),
    ],
    c = { index: e, questions: r };
  for (let [a, l] of t) D(c[l], a);
}
async function ce(i, t) {
  let e = [
    await Promise.resolve()
      .then(() => (g(), b))
      .then((r) => r.default({ user: i, weight: 12.5 })),
    await Promise.resolve()
      .then(() => ($(), y))
      .then((r) => r.default({ user: i, weight: 12.5 })),
    await Promise.resolve()
      .then(() => (x(), w))
      .then((r) => r.default({ user: i, weight: 12.5 })),
    await Promise.resolve()
      .then(() => (_(), k))
      .then((r) => r.default({ user: i, weight: 12.5 })),
    await Promise.resolve()
      .then(() => (C(), S))
      .then((r) => r.default({ user: i, weight: 12.5 })),
    await Promise.resolve()
      .then(() => (A(), q))
      .then((r) => r.default({ user: i, weight: 12.5 })),
    await Promise.resolve()
      .then(() => (T(), j))
      .then((r) => r.default({ user: i, weight: 12.5 })),
    await Promise.resolve()
      .then(() => (I(), E))
      .then((r) => r.default({ user: i, weight: 12.5 })),
  ];
  return (v(e, t), Object.fromEntries(e.map(({ id: r, ...c }) => [r, c])));
}
export { ce as questions };
