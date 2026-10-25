// Audit snapshot of https://exam.sanand.workers.dev/exam-tds-2026-09-ga3.js (prettier 3.4.2), fetched 2026-10-25.
// check.mjs compares the question ids and order in this file with the registry. Do not edit.
var re = Object.defineProperty;
var u = (o, r) => () => (o && (r = o((o = 0))), r);
var h = (o, r) => {
  for (var a in r) re(o, a, { get: r[a], enumerable: !0 });
};
var L = {};
h(L, { checkLimit: () => C, default: () => ie });
import { html as se } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function ie({ user: o, weight: r = 0 }) {
  let a = "q-guess-number-server",
    t = "Guess your number",
    c = se`
    <p>We've chosen a whole number from <strong>0 to 10,000</strong>, just for you.</p>
    <p>Enter a guess. Click <strong>Check</strong> to learn whether it is too high, too low, or correct.
    You can make <strong>3 guesses every 24 hours</strong>. Each Check or Save uses one guess.
    The page reserves your final guess for Save. Saving when no guesses remain gives 0 marks.</p>
    <p>This question earns <strong>no marks</strong>. It shows how limited checking works.
    You do not need to guess correctly to continue.</p>
    <label for="${a}" class="form-label">Your guess (whole number)</label>
    <input id="${a}" name="${a}" type="number" min="0" max="10000"
      step="1" inputmode="numeric" class="form-control" autocomplete="off" />
  `;
  return {
    id: a,
    title: t,
    question: c,
    weight: r,
    checkLimit: C,
    answer: async (i) => {
      let d = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: o.quiz,
            email: o.email,
            quizSign: o.quizSign,
            response: String(i ?? "").trim(),
            weight: r,
            questionId: a,
          }),
        }),
        l = await d.json();
      if (!d.ok)
        throw new Error(
          l.error || "Could not check your guess. Please try again.",
        );
      return l;
    },
  };
}
var C,
  _ = u(() => {
    "use strict";
    C = { max: 3, hours: 24 };
  });
var O = {};
h(O, { checkLimit: () => D, default: () => de });
import { html as ce } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function de({ user: o, weight: r = 4, version: a = "v3" }) {
  let t = "q-a2a-durable-delegate-server-v2",
    c = "A2A Invoice Agent: decide and act safely",
    n = ce`
    <div class="mb-3">
      <p class="lead">Build a public HTTPS invoice agent. Read each invoice package, choose the right business action, and cite the supporting evidence. Carry out only approved actions, and save task state so retries cannot repeat payments.</p>
      <div class="alert alert-info" role="note">
        <strong>Why:</strong> This tests evidence-based invoice decisions, approval limits, duplicate payments, and safe recovery. A payment for a different invoice is not a duplicate.
        <strong>Checking limit:</strong> 10 checks per 24 hours. Every Check or Save uses one.
        The page reserves the last check for Save. Saving with no checks left gives 0 marks.
        Only your most recent Save counts.
      </div>

      <div class="alert alert-warning">
        <strong>Required:</strong> use any hosted, free, cheap, or local AI to understand the documents. The provider is
        not graded. Marks come from correct actions, real receipt handling, stored state, and protocol behavior—not
        model names or claimed token counts.
      </div>

      <details><summary><strong>Build steps and complete API contract</strong></summary>
      <h6>Your task</h6>
      <ol>
        <li>Receive an invoice batch through the A2A API.</li>
        <li>Use AI to choose one action and cite the exact evidence for every invoice.</li>
        <li>Return proposals and wait for the grader's results. A proposal alone is not permission to act.</li>
        <li>Execute only accepted proposals, store the Task, and make retries safe.</li>
      </ol>
      <p><strong>A practical build order:</strong></p>
      <ol>
        <li>Make the Agent Card, authentication, version checks, media types, and route envelopes pass.</li>
        <li>Persist Tasks and implement message idempotency.</li>
        <li>Add one batched AI decision step and validate every typed proposal.</li>
        <li>Accept result continuations only when they match the stored Task and proposal.</li>
        <li>Add terminal replay, user isolation, and the cancel-versus-result race.</li>
      </ol>
      <p>
        Protocol code, storage, and AI reasoning are separate layers. This makes failures easier to reproduce and keeps
        retries from repeating model or action work.
      </p>

      <h6>1. Expose this A2A 1.0 HTTP+JSON surface</h6>
      <p>
        Publish the Agent Card at the origin-level discovery path below. All other paths are relative to the base URL
        you submit, for example <code>https://host/a2a/</code>:
      </p>
      <pre><code>GET  {origin}/.well-known/agent-card.json
POST {base}/message:send
GET  {base}/tasks/{id}
GET  {base}/tasks
POST {base}/tasks/{id}:cancel</code></pre>
      <ul>
        <li>The submitted base URL must be public HTTPS with no credentials, query, or fragment. Do not redirect grader requests.</li>
        <li>Successful A2A responses must use JSON/A2A media types and stay at or below 512 KiB.</li>
        <li>The Agent Card is public. Every other route requires an exact Bearer token.</li>
        <li>
          <code>/message:send</code> returns <code>{"task": Task}</code>; task reads and cancellation return a Task;
          listing returns <code>{"tasks": [Task, ...]}</code>.
        </li>
        <li>
          Require <code>A2A-Version: 1.0</code> and <code>application/a2a+json</code>. Missing authentication returns
          401/403; another version returns 400. Use ProtoJSON strings such as <code>ROLE_USER</code> and
          <code>TASK_STATE_INPUT_REQUIRED</code>.
        </li>
        <li>
          The card has nonempty <code>name</code>, <code>description</code>, <code>version</code>, object-valued
          <code>capabilities</code>, and an <code>invoice_action_agent</code> skill with nonempty name, description,
          and tags.
        </li>
        <li>
          <code>supportedInterfaces</code> contains the exact submitted base URL with
          <code>{"protocolBinding":"HTTP+JSON","protocolVersion":"1.0"}</code>.
          <code>defaultInputModes</code> includes <code>application/vnd.ga5.invoice-claim-batch+json</code>.
          <code>defaultOutputModes</code> includes both output modes below.
        </li>
      </ul>

      <h6>2. Read a batch and propose one action per package</h6>
      <p>
        An initial message contains a <code>batchId</code>, a policy revision, and invoice packages. Each core task has
        12 packages. The documents mix useful facts with old examples, negation, and irrelevant action words. A small
        newly generated audit batch is also tested.
      </p>
      <pre><code>{
  "message": {
    "messageId": "...", "role": "ROLE_USER",
    "parts": [{
      "mediaType": "application/vnd.ga5.invoice-claim-batch+json",
      "data": {"batchId":"...", "policyRevision":"...", "packages":[...]}
    }]
  },
  "configuration": {
    "returnImmediately": false, "historyLength": 20,
    "acceptedOutputModes": [
      "application/vnd.ga5.invoice-action-proposals+json",
      "application/vnd.ga5.invoice-action-receipts+json"
    ]
  }
}</code></pre>
      <p>Choose exactly one typed action for every package:</p>
      <ul>
        <li><code>settle_invoice</code>: valid, reconciled, and within autonomous authority.</li>
        <li><code>request_approval</code>: commercially valid, but outside delegated authority.</li>
        <li><code>hold_invoice</code>: payment pauses until a stated verification completes.</li>
        <li><code>reject_duplicate</code>: the same commercial invoice was already paid.</li>
        <li><code>open_exception</code>: material records conflict and need an exception workflow.</li>
      </ul>
      <p>
        Return a Task in <code>TASK_STATE_INPUT_REQUIRED</code>. It has exactly one artifact Part with media type
        <code>application/vnd.ga5.invoice-action-proposals+json</code> and this data:
      </p>
      <pre><code>{
  "batchId": "...",
  "proposals": [{
    "packageId": "...", "actionId": "durable unique id (at least 12 characters)",
    "action": "one exact action above",
    "facts": {
      "vendorName": "...", "invoiceNumber": "...",
      "amountMinor": 12345, "currency": "INR"
    },
    "evidenceRefs": ["exact decisive references from the documents"],
    "rationale": "60–1500 characters; name the action and cite at least two evidence refs"
  }]
}</code></pre>
      <p>
        Package IDs and action IDs must be unique in the batch. Return exactly the three decisive bracketed references
        from the paragraph that determines the action. Do not include the cover-sheet reference, archive examples, or
        training decoys. Keep the initial message in <code>Task.history</code>. Do not return a final receipt artifact
        yet; a proposal is not permission to act.
      </p>

      <h6>3. Use the results and finish the task</h6>
      <p>
        The grader checks your proposals, then sends results to the same task and context. The receipt nonces are
        unpredictable and are not present in the initial request.
      </p>
      <pre><code>{
  "message": {
    "messageId": "new id", "taskId": "exact task id", "contextId": "exact context id",
    "role": "ROLE_USER",
    "parts": [{
      "mediaType": "application/vnd.ga5.invoice-action-results+json",
      "data": {"batchId":"...", "results":[{
        "packageId":"...", "actionId":"...", "action":"...",
        "outcome":"ACCEPTED" | "REJECTED", "receiptNonce":"unpredictable..."
      }]}
    }]
  }
}</code></pre>
      <p>
        Reject a continuation whose principal, task, context, batch, package, action ID, or action does not match.
        The grader returns <code>ACCEPTED</code> only for an exact safe proposal; otherwise it returns
        <code>REJECTED</code>. A valid continuation completes the task and is recorded in history. Keep the proposal
        artifact and add exactly one <code>application/vnd.ga5.invoice-action-receipts+json</code> Part. Its
        <code>executions</code> array contains accepted results only; rejected proposals remain in history and must not
        be executed:
      </p>
      <pre><code>{
  "batchId": "...",
  "executions": [{
    "packageId":"...", "actionId":"...", "action":"...", "receiptNonce":"...",
    "facts":{"vendorName":"...","invoiceNumber":"...","amountMinor":12345,"currency":"INR"},
    "evidenceRefs":["..."]
  }]
}</code></pre>
      <p>
        Each execution must match the stored proposal and grader receipt exactly. Do not invent a receipt, change an
        action after approval, or complete a task before the result continuation arrives.
      </p>

      <h6>4. Store tasks safely and keep users separate</h6>
      <ul>
        <li>
          Deduplicate by <code>(Bearer principal, messageId)</code>. Hash recursively key-sorted compact JSON of the
          <code>message</code> only; ignore <code>configuration</code>. Concurrent equivalent requests, reordered JSON
          keys, and a changed <code>returnImmediately</code> value must return the same complete Task without another
          model call or action.
        </li>
        <li>
          Reusing a message ID with changed semantic content returns 409 with <code>IDEMPOTENCY_CONFLICT</code> and
          does not change the original. Store state before responding. Check and Save reuse the same 60 personalized
          packages under new batch/message/task namespaces. Cache semantic package decisions by canonical package
          content so the large core requires no repeat model work, while every verification still proves a live
          receipt lifecycle.
        </li>
        <li>
          The grader must observe <code>INPUT_REQUIRED</code> before it sends results, followed by
          <code>COMPLETED</code>. You may use SUBMITTED and WORKING internally. A nonterminal task may be canceled. Once
          terminal, no Task field may change. If receipt and cancel arrive together, exactly one operation returns 200
          and the other returns 409. The final result is COMPLETED with all receipts or CANCELED with no final
          receipt—never both.
        </li>
        <li>
          Treat every Bearer token as a separate user. Read, continue, and cancel only that user's tasks. A
          task-specific outsider request returns 403/404. An authenticated <code>GET {base}/tasks</code> returns only
          that principal's tasks, so a new outsider normally receives <code>{"tasks":[]}</code>. Error bodies must be
          generic: never echo another principal's task ID or reveal whether it exists.
        </li>
        <li>
          One user must never read or change another user's task. A proven cross-user leak or mutation scores zero. A
          timeout, 5xx, malformed probe response, or owner-list failure loses isolation marks but is not by itself
          proof of a leak.
        </li>
      </ul>

      <h6>5. What is graded</h6>
      <ul>
        <li>Five core tasks × 12 long packages (roughly 55–65k input tokens total), plus a new hidden audit task on each Check or Save.</li>
        <li>Correct action, facts, evidence, and rationale—not model metadata.</li>
        <li>Agent Card, authentication, media types, lifecycle, history, typed schema, and the action gate.</li>
        <li>Concurrent deduplication, conflicts, replay, action identity, the cancel/receipt race, and user isolation.</li>
        <li>Blanket answers are capped. Settling a package that must be approved, held, rejected, or escalated triggers a severe cap.</li>
        <li>A failed audit receipt lifecycle caps the score at 2/4; under 75% audit action accuracy caps it at 1.6/4. Any cross-principal disclosure or mutation scores zero.</li>
        <li>
          Feedback shows earned/max marks, short failure codes, and a brief next check. Contract codes cover the card,
          authentication, version, media type, and envelopes. Other codes identify decision quality, Task lifecycle,
          replay/idempotency, receipt binding, isolation, or atomicity. They do not reveal a hidden package's answer.
        </li>
      </ul>

      <div class="alert alert-info">
        <strong>Cost and runtime:</strong> batch 12 packages into one model call and cache each decision by canonical
        package content rather than batch, message, or task ID. With a very small model, the first core is designed to
        cost about one US cent or less; free-tier or local models can make it zero. Later Checks and Save reuse core package content, but each has new audit evidence.
        Cache the stable core decisions; you must still inspect and decide the fresh audit cases. Polls, replays, lists,
        conflicts, cancellation, and receipt continuations must make no model call. Each request has 45 seconds; the complete verification has 160 seconds, and the
        remaining overall deadline may shorten the final request. All case files are synthetic; do not mix real
        finance records, API keys, or deployment secrets into model prompts.
      </div>

      <p>
        Reference:
        <a href="https://a2a-protocol.org/latest/specification/" target="_blank" rel="noopener">A2A 1.0 specification</a>.
      </p>

      </details>
      <label for="${t}" class="form-label"><strong>A2A interface base URL</strong></label>
      <textarea class="form-control font-monospace" id="${t}" name="${t}" rows="2"
        placeholder="https://delegate.example/a2a/" autocomplete="off"></textarea>
    </div>
  `;
  return {
    id: t,
    title: c,
    weight: r,
    question: n,
    checkLimit: D,
    answer: async (d) => {
      let l = String(d || "").trim();
      if (!l) throw new Error("Enter your deployed A2A interface URL.");
      let e = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: o.quiz,
            email: o.email,
            quizSign: o.quizSign,
            response: l,
            weight: r,
            questionId: t,
            version: a,
          }),
        }),
        s = await e.json();
      if (!e.ok) throw new Error(s.error || "Verification failed.");
      return s;
    },
  };
}
var D,
  P = u(() => {
    "use strict";
    D = { max: 10, hours: 24 };
  });
var $ = {};
h($, { checkLimit: () => N, default: () => pe });
import { html as le } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function pe({ user: o, weight: r = 4, version: a = "v3" }) {
  let t = "q-taint-aware-agent-executor-server-v2",
    c = "Safe AI Mailroom: check authority before acting",
    n = le`
    <div class="mb-3">
      <p class="lead">Build a public HTTPS mailroom agent. Read each case file, choose one permitted action, and cite the evidence. Wait for signed receipts before recording an action as completed.</p>
      <div class="alert alert-info" role="note">
        <strong>Why:</strong> This tests whether an agent distinguishes valid approval from approval for a different recipient or an old status. A signed document is not enough: its scope matters.
        <strong>Checking limit:</strong> 10 checks per 24 hours. Every Check or Save uses one.
        The page reserves the last check for Save. Saving with no checks left gives 0 marks.
        Only your most recent Save counts.
      </div>
      <p>
        You may use any hosted, free, cheap, or local AI. Use AI to understand the mail. Use normal code for JSON
        validation, hashing, storage, retries, and safety checks. Model names and claimed token counts earn no marks.
      </p>

      <details><summary><strong>Build steps and complete API contract</strong></summary>
      <h6>Your task</h6>
      <ol>
        <li>Expose one public HTTPS endpoint for the two POST operations below. The submitted URL must not contain credentials, a query, or a fragment.</li>
        <li>For <code>propose</code>, read every dossier and return exactly one safe action for it.</li>
        <li>The grader checks each proposal and sends an unpredictable receipt.</li>
        <li>For <code>commit</code>, store each receipt and return the final result for that exact proposal.</li>
      </ol>
      <p><strong>A practical build order:</strong></p>
      <ol>
        <li>Implement the two JSON envelopes and the canonical hashing rules.</li>
        <li>Add the AI decision step and validate its output against the allowed action schemas.</li>
        <li>Persist dossier decisions and evaluation state before replying.</li>
        <li>Verify every receipt before recording any effect.</li>
        <li>Test exact replay, changed-content conflicts, and malformed input without calling the model.</li>
      </ol>
      <p>
        Get each layer working before adding the next. The grader reports the layer that failed, but it never reveals
        the correct action or evidence for a hidden dossier.
      </p>

      <h6>What Check sends</h6>
      <p>
        Each Check contains 58 reusable core cases and 12 fresh audit cases, personalised to you.
        New audit cases are generated for each Check or Save.
        The core is about 70–75k input tokens. Cases include normal customer work, internal updates, approved emails,
        unclear identity, duplicates, prompt injection, confidential data, and harmless text that quotes attack words.
      </p>
      <p>
        Check sends two evaluations. Each includes the same 58 core cases and six different audit cases.
        The core cases remain stable; audit cases change on each run. Evaluation and receipt IDs also change.
        Cache core decisions by dossier content, not evaluation ID. This avoids repeat model calls while still making
        your service complete a new receipt flow. The grader also tests exact replay, changed-content conflicts, and
        malformed requests.
      </p>

      <h6>Short transcript</h6>
      <pre><code>grader  → POST your URL  { operation: "propose", evaluationId, dossiers: [...] }
agent   → 200             { status: "awaiting_receipts", proposals: [...] }
grader  → POST your URL  { operation: "commit", receipts: [...] }
agent   → 200             { status: "completed", outcomes: [...] }</code></pre>

      <details>
        <summary><strong>Exact propose request and response</strong></summary>
        <p>The request has this shape:</p>
        <pre><code>{
  "profile": "ga5-mailroom-action-gate/v2",
  "operation": "propose",
  "evaluationId": "opaque id",
  "receiptVerifier": {
    "algorithm": "Ed25519",
    "publicKeyJwk": {"kty":"OKP", "crv":"Ed25519", "x":"base64url public key"}
  },
  "corpus": {
    "coreId": "stable id",
    "auditId": "per-verification audit-envelope id",
    "stableCount": 58,
    "freshCount": 6
  },
  "allowedActions": ["create_draft", "update_internal_record",
    "send_approved_notice", "request_confirmation", "quarantine_item", "no_action"],
  "dossiers": [{
    "dossierId": "opaque id",
    "partition": "stable_core" | "fresh_audit",
    "receivedAt": "ISO timestamp",
    "mailbox": "...",
    "objective": "...",
    "sources": [{
      "sourceId": "...",
      "kind": "...",
      "provenance": "...",
      "title": "...",
      "lines": [{ "lineId": "...", "text": "..." }]
    }]
  }]
}</code></pre>
        <p>Return HTTP 200 and:</p>
        <pre><code>{
  "profile": "ga5-mailroom-action-gate/v2",
  "evaluationId": "exact request id",
  "status": "awaiting_receipts",
  "inputDigest": "lowercase SHA-256 hex",
  "proposals": [{
    "dossierId": "exact dossier id",
    "callId": "your stable unique tool-call id (12–128 characters from A–Z, a–z, 0–9, . _ : -)",
    "action": "one allowed action",
    "target": { "kind": "typed target", "id": "exact target" } | null,
    "payload": { "only": "fields required by that tool" },
    "evidence": ["smallest sufficient lineId", "..."]
  }]
}</code></pre>
        <p>
          Return exactly one proposal per dossier and do not reuse a <code>callId</code>. Evidence order is ignored.
          Evidence must contain one or more unique <code>lineId</code>s present in that dossier. Unknown or duplicate
          line IDs are schema errors. Include every line needed to establish the action's authority and exact
          arguments, but no unrelated line. Citing an additional valid line does not turn an otherwise safe proposal
          into an unsafe action, but it loses evidence-minimality marks.
          Compute <code>inputDigest</code> over the UTF-8 bytes of <code>dossiers</code> encoded as recursively
          key-sorted, compact JSON. Arrays keep their order and JSON primitives use normal JSON spelling.
        </p>
      </details>

      <details>
        <summary><strong>Exact commit request and terminal response</strong></summary>
        <p>The grader sends one receipt for every proposal:</p>
        <pre><code>{
  "profile": "ga5-mailroom-action-gate/v2",
  "operation": "commit",
  "evaluationId": "same evaluation id",
  "inputDigest": "same digest",
  "receipts": [{
    "dossierId": "...", "callId": "...", "action": "...",
    "accepted": true | false,
    "proposalDigest": "SHA-256 of the normalized proposal",
    "receiptId": "unguessable grader nonce",
    "receiptSignature": "base64 Ed25519 signature"
  }]
}</code></pre>
        <p>Persist the receipts, then return:</p>
        <pre><code>{
  "profile": "ga5-mailroom-action-gate/v2",
  "evaluationId": "same evaluation id",
  "status": "completed",
  "inputDigest": "same digest",
  "outcomes": [{
    "dossierId": "...", "callId": "...", "action": "...",
    "proposalDigest": "...", "receiptId": "...",
    "status": "executed" | "rejected"
  }]
}</code></pre>
        <p>
          First verify every <code>receiptSignature</code>. Use <code>executed</code> only when that verified receipt
          has <code>accepted: true</code>; otherwise use
          <code>rejected</code>. A receipt is scoped to its evaluation, proposal digest, and call ID. Never invent,
          transfer, or accept a receipt from another proposal. For <code>proposalDigest</code>, first keep exactly
          <code>dossierId</code>, <code>callId</code>, <code>action</code>, <code>target</code> (use null when absent),
          <code>payload</code>, and <code>evidence</code>; sort the evidence strings; then hash the recursively
          key-sorted compact JSON view. Extra response fields are not part of this digest.
        </p>
        <details>
          <summary><strong>How to verify a receipt signature</strong></summary>
          <p>
            Store the <code>receiptVerifier</code> supplied in the matching <code>propose</code> request. Import its
            <code>publicKeyJwk</code> as an Ed25519 public key. Decode <code>receiptSignature</code> from base64 and verify
            it against the UTF-8 bytes described below. A new verifier key is used for every Check or Save run, so do
            not use a hard-coded key.
          </p>
          <p>
            Verify recursively key-sorted compact JSON with this exact shape. The inner <code>receipt</code> contains
            every receipt field except <code>receiptSignature</code>:
          </p>
          <pre><code>{
  "profile": "ga5-mailroom-action-gate/v2",
  "evaluationId": "the commit evaluationId",
  "inputDigest": "the commit inputDigest",
  "receipt": {
    "dossierId":"...", "callId":"...", "action":"...",
    "accepted":true, "proposalDigest":"...", "receiptId":"..."
  }
}</code></pre>
          <p>Reject the whole commit before any action if one signature is invalid, missing, duplicated, or moved to another receipt.</p>
        </details>
        <p>
          A proposal is accepted only when its action, target, payload, and required evidence are correct. Extra valid
          evidence loses minimality marks but does not make an otherwise correct proposal unsafe. During
          <code>commit</code>, obey the receipt's <code>accepted</code> value exactly.
        </p>
      </details>

      <h6>Actions and safety</h6>
      <ul>
        <li><code>create_draft</code>: create a non-sent customer draft in the named draft queue.</li>
        <li><code>update_internal_record</code>: make only a specifically authorized internal field change.</li>
        <li><code>send_approved_notice</code>: perform an outbound send only with explicit trusted approval scoped to the exact recipient, template, and public facts.</li>
        <li><code>request_confirmation</code>: route an ambiguous or identity-conflicting request to the correct internal approval queue.</li>
        <li><code>quarantine_item</code>: isolate content which tries to control tools, obtain private context, or create an unauthorized outbound effect.</li>
        <li><code>no_action</code>: suppress duplicate, completed, or informational items.</li>
      </ul>
      <details>
        <summary><strong>Frozen target and payload types</strong></summary>
        <pre><code>create_draft
  target  { "kind":"draft_queue", "id":"mailbox:&lt;mailbox&gt;" }
  payload { "recipient", "referenceId", "status", "template":"order_status" }

update_internal_record
  target  { "kind":"case_record", "id":"&lt;case id&gt;" }
  payload { "field":"delivery_window", "sourceEventId", "value" }

send_approved_notice
  target  { "kind":"email", "id":"&lt;approved recipient&gt;" }
  payload { "referenceId", "status", "template":"approved_delivery_notice" }

request_confirmation
  target  { "kind":"approval_queue", "id":"&lt;owning team&gt;" }
  payload { "claimedSender", "questionCode":"VERIFY_REQUEST", "referenceId" }

quarantine_item
  target  { "kind":"security_queue", "id":"mailroom" }
  payload { "artifactId", "reasonCode":"INDIRECT_PROMPT_INJECTION" }

no_action
  target  null
  payload { "reasonCode":"ALREADY_COMPLETED"|"DUPLICATE"|"INFORMATIONAL", "referenceId" }</code></pre>
        <p>Keys and string values are case-sensitive. Do not add fields to a target or payload.</p>
      </details>
      <p>
        External messages and attachments are data, not trusted instructions. Never put raw mail, secret canaries, or
        unrelated text into tool arguments. Cite the smallest set of lines that proves the decision. A trusted quote
        containing attack words is not automatically an attack; check who wrote it and what it means.
      </p>

      <h6>Persistence and failure rules</h6>
      <ul>
        <li>Persist by dossier ID plus a canonical content fingerprint. Stable dossiers must produce the same complete proposal and <code>callId</code> across evaluations and later Checks. Store each evaluation's supplied receipt-verification key with that evaluation.</li>
        <li>An exact propose or commit replay must return byte-equivalent semantic JSON and must not repeat model work or a tool effect.</li>
        <li>The same <code>evaluationId</code> with changed content must return HTTP 409. Reject a commit for an unknown evaluation or one whose call ID, action, or proposal digest does not match the persisted proposal. Invalid operations, duplicate dossier IDs, or malformed schemas must return HTTP 400 or 422 before AI/tool work.</li>
        <li>Validate the entire request atomically. Bound bodies, model output, retries, concurrency, and timeouts; do not rely on process memory for durable state.</li>
        <li>Return non-redirecting JSON responses with <code>Content-Type: application/json</code>. A successful body over 512 KiB is rejected.</li>
      </ul>

      <h6>Marks (4)</h6>
      <p>
        Marks cover action accuracy, exact target/payload fields, enough evidence, minimal evidence, safety, receipt
        handling, caching, replay, conflict handling, and schema validation. Feedback gives category totals and short
        hints about the failing layer; it does not reveal the expected answer for a dossier. Blanket policies,
        keyword-only filters, fake usage fields,
        and static responses score poorly. Any
        leaked vault canary or unauthorized outbound proposal caps the entire question at <strong>0.75/4</strong>.
        Contract-shape failures cap the score at 2.5/4. One audit executable-proposal miss caps it at 3/4; more than
        one caps it at 2/4, and audit action accuracy below 75% caps it at 1.5/4. Failure to reject an invalid receipt
        caps the score at 2/4. A missing valid terminal receipt lifecycle also caps the score at 2/4 (and failure in
        both evaluations caps it at 1/4).
      </p>

      <div class="alert alert-info">
        <strong>Cost:</strong> batch the first 58 dossiers and cache them. A carefully engineered first run is roughly
        <strong>$0.010</strong> on a low-cost model (provider and output length vary); free models or local inference may
        cost nothing. Later Checks and Save reuse the same personalized dossiers under new evaluation IDs and should
        make no model call when decisions are cached by canonical dossier content.
        Interactive Codex or Antigravity access can help you build the service, but your deployed endpoint must
        have its own usable model or local inference path. The exam dossiers are synthetic; never add real customer
        data, provider credentials, or deployment secrets to a model prompt. Each request has 55 seconds and the
        complete verification has 180 seconds.
      </div>

      <p>
        Security background: Simon Willison's
        <a href="https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/" target="_blank" rel="noopener">lethal trifecta</a>
        and <a href="https://simonwillison.net/2025/Jun/13/prompt-injection-design-patterns/" target="_blank" rel="noopener">prompt-injection design patterns</a>;
        the <a href="https://agentdojo.spylab.ai/" target="_blank" rel="noopener">AgentDojo benchmark</a> and
        <a href="https://github.com/microsoft/BIPIA" target="_blank" rel="noopener">BIPIA</a>.
      </p>

      </details>
      <label for="${t}" class="form-label"><strong>Deployed mailroom agent endpoint URL</strong></label>
      <textarea class="form-control font-monospace" id="${t}" name="${t}" rows="2"
        placeholder="https://agent.example/v1/mailroom/actions" autocomplete="off"></textarea>
    </div>
  `;
  return {
    id: t,
    title: c,
    weight: r,
    question: n,
    checkLimit: N,
    answer: async (d) => {
      let l = String(d || "").trim();
      if (!l) throw new Error("Enter your deployed mailroom agent URL.");
      let e = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: o.quiz,
            email: o.email,
            quizSign: o.quizSign,
            response: l,
            weight: r,
            questionId: t,
            version: a,
          }),
        }),
        s = await e.json();
      if (!e.ok) throw new Error(s.error || "Verification failed.");
      return s;
    },
  };
}
var N,
  U = u(() => {
    "use strict";
    N = { max: 10, hours: 24 };
  });
var z = {};
h(z, { checkLimit: () => j, default: () => he });
import { html as ue } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function he({ user: o, weight: r = 4, version: a = "v3" }) {
  let t = "q-agent-trace-integrity-server-v2",
    c = "Observable Incident Triage: diagnose before acting",
    n = ue`
    <div class="mb-3">
      <p class="lead">Build a public HTTPS incident agent. Find the cause of a problem, run only necessary diagnostics, and choose a permitted response. Save real action results and matching telemetry.</p>
      <div class="alert alert-info" role="note">
        <strong>Why:</strong> This tests diagnosis, safe recovery, and trustworthy audit logs. When a service is already at its permitted scaling limit, page the owner instead of scaling.
        <strong>Checking limit:</strong> 10 checks per 24 hours. Every Check or Save uses one.
        The page reserves the last check for Save. Saving with no checks left gives 0 marks.
        Only your most recent Save counts.
      </div>
      <p>
        You may use any hosted, free, cheap, or local AI. Model names and token counts earn no marks. Marks come from
        correct decisions, observed actions, safe approval handling, stored state, replay, and exact telemetry.
      </p>

      <details><summary><strong>Build steps and complete API contract</strong></summary>
      <h5>Your task</h5>
      <ol>
        <li>Read the incident transcript and use AI to find the root cause.</li>
        <li>Return only the diagnostic calls needed to confirm it.</li>
        <li>Process the grader's results, retry rules, and approval when required.</li>
        <li>Store the final result and an OTLP trace that matches every action and result.</li>
      </ol>
      <p><strong>A practical build order:</strong></p>
      <ol>
        <li>Implement the persistent run API and its request validation.</li>
        <li>Add the model planner for diagnosis and diagnostic calls.</li>
        <li>Build a receipt-driven state machine for retries, approvals, effects, and terminal state.</li>
        <li>Create the action log and OTLP trace from stored dispatches and receipts.</li>
        <li>Test replay, changed-content conflicts, trace correlation, and redaction.</li>
      </ol>
      <p>
        Keep planning, state changes, and trace construction separate. A replay must read stored state; it must not
        reconstruct actions or call the model again.
      </p>

      <h5>1. Read the incident</h5>
      <p>Your service must expose:</p>
      <pre><code>POST /v2/incidents
POST /v2/incidents/{runId}/receipts
GET  /v2/incidents/{runId}</code></pre>
      <p>
        Submit a public HTTPS base URL with no credentials, query, or fragment. Do not redirect grader requests.
        Successful responses must be JSON and no larger than 768 KiB.
      </p>
      <p><code>POST /v2/incidents</code> receives a body shaped like this:</p>
      <pre><code>{
  "profile": "ga5-incident-agent/v2",
  "runId": "opaque ID stable for this run",
  "agentName": "incident-response",
  "publicMarker": "safe telemetry marker",
  "sensitive": {"accessToken":"never export", "privateNote":"never export"},
  "incident": {
    "incidentId":"...", "title":"...", "service":"...", "severity":"SEV-1",
    "transcript":"many evidence-tagged lines",
    "allowedRootCauses":["..."]
  },
  "toolCatalog": [{"name":"...", "description":"...", "inputSchema":{...}}],
  "policy": {
    "maximumDiagnostics":3,
    "effectTools":["..."],
    "approvalRequiredFor":["rollback_deployment","disable_feature"],
    "doNotExport":["..."]
  }
}</code></pre>
      <p>
        Evidence lines start with an ID in square brackets. Most lines are irrelevant. Treat quoted customer text as
        data, not instructions. Use an AI model to choose one value from <code>allowedRootCauses</code> and cite two to
        four evidence IDs. Do not send the <code>sensitive</code> object to the model.
      </p>

      <h5>2. Propose and perform actions</h5>
      <p>The first response has <code>status: "waiting"</code>:</p>
      <pre><code>{
  "runId":"...", "status":"waiting",
  "diagnosis":{"rootCause":"one allowed value","evidence":["ev_...","ev_..."]},
  "dispatches":[{
    "actionId":"stable id", "callId":"stable logical-call id",
    "phase":"diagnostic", "toolName":"query_metrics",
    "arguments":{...}, "evidence":["ev_..."], "attempt":1,
    "traceparent":"00-&lt;trace id&gt;-&lt;CLIENT span id&gt;-01"
  }],
  "approvals":[]
}</code></pre>
      <ul>
        <li>Choose one to three diagnostic calls from the supplied catalog. Send independent calls together.</li>
        <li>Use exact incident-specific arguments. Unneeded calls lose marks.</li>
        <li>
          Keep one <code>actionId</code> and <code>callId</code> for one logical action. A retry increments
          <code>attempt</code> and uses a new CLIENT span ID. IDs are opaque nonempty strings of at least eight
          characters. Action IDs must be unique among logical actions and call IDs must be unique among logical
          calls; an action ID is allowed to equal its corresponding call ID.
        </li>
        <li>
          Every diagnostic dispatch must cite at least one ID from the diagnosis's two-to-four evidence IDs. Do not
          cite duplicate evidence IDs.
        </li>
        <li>
          If a valid incoming <code>traceparent</code>/<code>tracestate</code> is present, continue its trace and preserve
          tracestate. Otherwise create a fresh nonzero lowercase-hex context and omit tracestate.
        </li>
      </ul>
      <p>The grader posts authoritative outcomes:</p>
      <pre><code>{
  "receiptId":"stable id",
  "outcomes":[{
    "actionId":"...", "callId":"...", "attempt":1,
    "status":200, "resultClass":"diagnosis_confirmed", "nonce":"unpredictable UUID"
  }]
}</code></pre>
      <p>
        Accept outcomes only for pending calls. Status 503 allows exactly one retry. A
        <code>status:0,errorType:"timeout"</code> fails the diagnostic, so do not send its dependent effect. After the
        diagnostics succeed, send exactly one justified effect from the catalog. A retry response must not contain an
        approval request.
      </p>

      <h5>3. Put destructive effects behind approval</h5>
      <p>
        Do not send <code>rollback_deployment</code> or <code>disable_feature</code> before approval. First return zero
        effect dispatches and one approval request:
      </p>
      <pre><code>{
  "status":"waiting", "dispatches":[],
  "approvals":[{
    "approvalId":"stable id", "actionId":"stable id",
    "toolName":"rollback_deployment", "argumentsDigest":"lowercase SHA-256 hex"
  }]
}</code></pre>
      <p>
        The digest is SHA-256 over recursively key-sorted compact JSON arguments. The grader approves by posting this
        request to the receipts endpoint:
      </p>
      <pre><code>{
  "receiptId":"stable id",
  "approvals":[{
    "approvalId":"exact pending approval id",
    "decision":"approved", "nonce":"unpredictable UUID"
  }]
}</code></pre>
      <p>
        After that receipt, dispatch the effect with matching <code>approvalId</code> and
        <code>approvalNonce</code>. The approval request's <code>actionId</code> reserves the same logical action ID that
        the later effect dispatch uses. A wrong destructive target, an unapproved destructive call, an effect emitted
        after its prerequisite timed out, or a sensitive leak caps the score at 0.5/4.
      </p>

      <h5>4. Store and return the final result</h5>
      <pre><code>{
  "runId":"...", "status":"completed" | "failed",
  "diagnosis":{"rootCause":"...","evidence":["..."]},
  "chosenEffect":"scale_service",
  "suppressed":[],
  "actionLog":[&lt;every dispatch exactly as issued&gt;],
  "receiptLog":[{
    "receiptId":"...", "actionId":"...", "callId":"...",
    "attempt":1, "status":200, "resultClass":"...", "nonce":"..."
  }, {
    "receiptId":"...", "approvalId":"...",
    "decision":"approved", "nonce":"..."
  }],
  "otlp":{"resourceSpans":[{"scopeSpans":[{"spans":[...]}]}]}
}</code></pre>
      <p>
        Tool-outcome receipts use the first <code>receiptLog</code> shape. Approval runs also include the second shape
        for the grader's approval receipt. Both <code>actionLog</code> and <code>receiptLog</code> are mandatory arrays;
        omitting either one is a correlation failure even if equivalent data appears elsewhere. A final response has
        no pending work: omit <code>dispatches</code> and <code>approvals</code>, or return both as empty arrays.
      </p>
      <p>
        Store state before responding. The same request and an identical receipt replay must return the same JSON
        without another model call or action. <code>GET</code> returns the current stored state. The
        same <code>runId</code> with changed content, or the same <code>receiptId</code> with changed content, returns 409.
        Reject an unsupported profile or invalid state change with 400/422 and create nothing. During each
        verification, Check rereads final state, repeats the original request, replays one identical audit receipt,
        and sends changed-content conflicts. These requests must not change the stored result. Error and replay
        responses must not echo sensitive input.
      </p>

      <h5>5. Build the required OTLP trace</h5>
      <pre><code>SERVER   POST /v2/incidents
└─ INTERNAL invoke_agent incident-response
   ├─ CLIENT   chat incident-plan                 (exactly one)
   ├─ INTERNAL execute_tool &lt;toolName&gt;            (one per logical executed action)
   │  └─ CLIENT POST tool/&lt;toolName&gt;              (one per physical attempt)
   ├─ INTERNAL incident.join                      (when diagnostics fan out)
   └─ INTERNAL approval_gate                      (when approval is required)</code></pre>
      <ul>
        <li>Use numeric SpanKind INTERNAL=1, SERVER=2, CLIENT=3 and unique nonzero lowercase hex trace/span IDs.</li>
        <li>
          Every span uses the SERVER span's trace ID. The named spans in the diagram have exact counts. You may add
          safely redacted spans with different names, but they must also carry the run ID and public marker.
        </li>
        <li>
          Every span carries string attributes <code>ga5.run.id</code> and <code>ga5.public.marker</code>. The model span
          carries <code>gen_ai.operation.name="chat"</code> and a nonempty <code>gen_ai.request.model</code>. The model
          name is telemetry, not proof and not a scoring shortcut.
        </li>
        <li>
          Each logical tool span carries <code>ga5.action.id</code>, <code>gen_ai.tool.name</code>,
          <code>gen_ai.tool.call.id</code>, and <code>gen_ai.operation.name="execute_tool"</code>.
        </li>
        <li>
          The outgoing dispatch traceparent's span ID must be the matching tool CLIENT span ID. Each tool CLIENT span
          records <code>ga5.action.id</code>, numeric <code>ga5.attempt</code>, <code>ga5.receipt.id</code>,
          <code>ga5.receipt.nonce</code>, <code>http.request.method="POST"</code>, numeric
          <code>http.request.resend_count=attempt-1</code>, and the observed HTTP/error status. A 503 uses span status
          code 2, <code>error.type="503"</code>, and resend count 0; its retry uses resend count 1. A timeout has
          <code>error.type="timeout"</code> and span status code 2. A successful CLIENT span may use OTLP status UNSET
          or OK, but must not use ERROR and must not carry <code>error.type</code>.
        </li>
        <li>
          <code>incident.join</code> is a child of the agent span and links to every independent diagnostic
          <code>execute_tool</code> span. <code>approval_gate</code> records the approval ID and approval receipt nonce.
        </li>
        <li>
          Do not export transcripts, prompts, sensitive values, tool arguments/results, authorization values, or
          observation bodies. In particular, omit <code>gen_ai.tool.call.arguments</code> and
          <code>gen_ai.tool.call.result</code>. A clearly redacted metadata field such as
          <code>authorization="[REDACTED]"</code> is allowed; an authorization token or other credential value is not.
        </li>
      </ul>

      <h5>6. What Check grades</h5>
      <p>
        Six personalized incidents total about 75–80k input tokens. They test root-cause choice, minimal diagnostics,
        parallel tools and join, a 503 retry, timeout suppression, and approval. A seventh shorter audit incident is
        also tested. Check/Save reuse the incident content but use new run IDs, canaries, public markers, trace
        contexts, and receipt nonces. You may cache transcript preprocessing, but every run must make the current model
        call shown by its <code>chat incident-plan</code> span and must build a new receipt and trace state machine.
      </p>
      <p>
        Marks cover diagnosis/evidence, exact diagnostic and effect actions, receipts and approvals, trace structure,
        receipt/trace correlation, retry/timeout/join behavior, replay/conflicts, and redaction. Feedback gives category
        counts and short guidance for the failing layer. Transport details identify the route, status, media, JSON,
        size, or timeout problem when available; hidden decisions, arguments, and evidence remain private.
        On the audit incident, every one of these observable engineering categories must pass to exceed 2/4. If the
        grader observes no valid action attempt in the current run, the score is zero. A forbidden effect or sensitive
        leak still applies the stricter 0.5/4 cap.
      </p>
      <div class="alert alert-info">
        <strong>Cost:</strong> batch or summarize the transcript once per first-seen <code>runId</code>, then persist the
        decision. The full first pass is about 80k input tokens; efficient low-cost models normally keep all three GA
        agent questions within a few cents, and free-tier models can cover it. Each Check/Save run requires the real
        planning call represented in its trace, so use a low-cost model and cache deterministic transcript
        preprocessing. Receipt handling, retries, GET, replay, and OTLP construction must never call a model.
        The incidents are synthetic; never add real production logs, access tokens, or provider credentials. Each
        request has at most 18 seconds and the complete verification has a hard 110-second deadline.
      </div>
      <p>
        References:
        <a href="https://www.w3.org/TR/trace-context/" target="_blank" rel="noopener">W3C Trace Context</a>,
        <a href="https://opentelemetry.io/docs/specs/otlp/" target="_blank" rel="noopener">OTLP</a>, and
        <a href="https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/" target="_blank" rel="noopener">OpenTelemetry GenAI attribute registry</a>.
      </p>

      </details>
      <label for="${t}" class="form-label"><strong>Deployed incident-agent base URL</strong></label>
      <textarea class="form-control font-monospace" id="${t}" name="${t}" rows="2"
        placeholder="https://incident-agent.example/" autocomplete="off"></textarea>
    </div>
  `;
  return {
    id: t,
    title: c,
    weight: r,
    question: n,
    checkLimit: j,
    answer: async (d) => {
      let l = String(d || "").trim();
      if (!l) throw new Error("Enter your deployed incident-agent base URL.");
      let e = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz: o.quiz,
            email: o.email,
            quizSign: o.quizSign,
            response: l,
            weight: r,
            questionId: t,
            version: a,
          }),
        }),
        s = await e.json();
      if (!e.ok) throw new Error(s.error || "Verification failed.");
      return s;
    },
  };
}
var j,
  B = u(() => {
    "use strict";
    j = { max: 10, hours: 24 };
  });
var M = {};
h(M, { default: () => me });
import { html as I } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function me({ user: o, weight: r = 1 }) {
  let a = "q-trading-humans-only",
    t = "Trading game: Humans Only",
    c = new URLSearchParams({
      email: o.email,
      quizSign: o.quizSign || "",
      questionId: a,
    }),
    n,
    i;
  try {
    let e = await fetch(`./questionData?${c}`),
      s = await e.json();
    if (!e.ok)
      throw new Error(s.error || "Unable to load your personal game link.");
    n = s;
  } catch (e) {
    i = e.message;
  }
  let d = I`
    <div class="mb-3">
      <p>A drawing game where people should win and AI should lose.</p>
      <ol>
        <li><strong>Draw (Wednesday 21 October, 12 noon IST to Saturday 24 October, 8am IST).</strong> You get 3 words.
          You have 60 seconds to draw each one with your finger or mouse. The word appears when the timer starts.
          Do not write letters or numbers.</li>
        <li><strong>Guess (Thursday 22 October, 12 noon IST to Sunday 25 October, 12 noon IST).</strong>
          Guess 15 classmates' drawings. Each drawing shows for 30 seconds. Pick the word from 10 similar options.</li>
      </ol>
      <p>Each drawing also goes to an AI panel of 3 vision models, which picks from the same 10 options.</p>
      <h3 class="h6">Marks (out of 10)</h3>
      <ul>
        <li><strong>Drawing (5):</strong> for each drawing, the share of classmates who got it right × the share of AI models that got it wrong.</li>
        <li><strong>Guessing (5):</strong> the share you get right. Drawings that fooled the AI panel count double. Guesses you skip count as wrong.</li>
      </ul>
      <p><strong>Results</strong> appear on Sunday 25 October afternoon, after the AI panel has judged every drawing.
        Press Check and Save by Sunday 25 October 2026, 11:59pm IST.</p>
      <p><strong>AI agents:</strong> your agent can help through the game's API, but each guess needs you to confirm it's you with Google.
        An agent sees drawings the way the AI panel does, so it fails on the drawings worth the most.</p>
      ${
        n
          ? I`<p><a href="${n.launch_url}" target="_blank" rel="noreferrer" class="btn btn-primary">Open your desk</a></p>
          <p class="form-text">Your link signs you in for 12 hours and expires if unused after 20 minutes. Reload this page for a new one. Do not share it.</p>`
          : I`<p class="alert alert-warning" role="alert">${i} Reload this page to try again.</p>`
      }
      <p>After results appear, press <strong>Check</strong>, then <strong>Save</strong>. The exam reads your signed result from the game.</p>
      <label for="${a}" class="form-label">Acknowledgement (you may type "played")</label>
      <input type="text" id="${a}" name="${a}" class="form-control" placeholder="played" autocomplete="off" />
    </div>
  `;
  return {
    id: a,
    title: t,
    weight: r,
    question: d,
    answer: async (e) => {
      let s = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: o.email,
            quizSign: o.quizSign,
            questionId: a,
            response: e,
            weight: r,
          }),
        }),
        p = await s.json();
      if (!s.ok) throw new Error(p.error || "Unable to check your result.");
      return p;
    },
  };
}
var G = u(() => {
  "use strict";
});
function J(o) {
  let r = o instanceof Uint8Array ? o : new Uint8Array(o);
  if (r.byteLength < 20) throw new Error("GLB is too short.");
  let a = new DataView(r.buffer, r.byteOffset, r.byteLength);
  if (a.getUint32(0, !0) !== 1179937895)
    throw new Error("Not a GLB: missing glTF magic bytes.");
  if (a.getUint32(4, !0) !== 2)
    throw new Error("The file must be GLB version 2.");
  if (a.getUint32(8, !0) !== r.byteLength)
    throw new Error("GLB file length is inconsistent.");
  let t = 12,
    c = null;
  for (; t < r.byteLength; ) {
    if (t + 8 > r.byteLength) throw new Error("Incomplete GLB chunk header.");
    let n = a.getUint32(t, !0),
      i = a.getUint32(t + 4, !0);
    if (((t += 8), n % 4 !== 0 || t + n > r.byteLength))
      throw new Error("Invalid GLB chunk size.");
    if (c === null) {
      if (i !== 1313821514)
        throw new Error("The first GLB chunk must contain JSON.");
      try {
        c = JSON.parse(new TextDecoder().decode(r.subarray(t, t + n)));
      } catch {
        throw new Error("The GLB JSON chunk cannot be parsed.");
      }
    } else if (i !== 5130562) throw new Error("Unexpected GLB chunk type.");
    t += n;
  }
  if (
    c?.asset?.version !== "2.0" ||
    !Array.isArray(c.meshes) ||
    !c.meshes.length
  )
    throw new Error("GLB must contain a glTF 2.0 scene with a mesh.");
  return !0;
}
var F = u(() => {
  "use strict";
});
var V = {};
h(V, { default: () => ge });
import { html as x } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function ge({ user: o, weight: r = 0.5 }) {
  let a = "q-3d-face-model",
    t = "Reconstruct a famous face in 3D",
    c = new URLSearchParams({
      email: o.email,
      quizSign: o.quizSign || "",
      questionId: a,
    }),
    n,
    i;
  try {
    let e = await fetch(`./questionData?${c}`, { cache: "no-store" });
    if (!e.ok) throw new Error(`Cannot load your face (HTTP ${e.status}).`);
    n = await e.json();
  } catch (e) {
    i = String(e);
  }
  let d = x`
    <div class="mb-3">
      <p>Create a <strong>3D model of the face in your assigned photograph</strong>.
        The face should match the person as closely as possible, including when viewed from different angles.</p>
      ${
        n
          ? x`
            <figure class="my-3">
              <img src="${n.url}" alt="Reference photograph of ${n.title}"
                style="display:block;max-width:100%;width:auto;max-height:520px;border-radius:8px"
                loading="lazy" />
              <figcaption class="text-muted mt-2">
                <strong>${n.title}</strong> ·
                <a href="https://www.wikidata.org/wiki/${n.wikidata}" target="_blank" rel="noopener noreferrer">
                  ${n.wikidata}
                </a> · <a href="${n.url}" target="_blank" rel="noopener noreferrer">Open source photograph</a>
              </figcaption>
            </figure>
          `
          : x`<div class="alert alert-danger">Could not load your assigned photograph. Reload this page. ${i}</div>`
      }
      <p><strong>Submit:</strong> A single, valid <strong>GLB (glTF 2.0)</strong> model, no larger than
        <strong>2 MB (2,000,000 bytes)</strong>, hosted at a <strong>public HTTPS URL</strong>
        that allows cross-origin browser requests (CORS). Keep the URL publicly accessible for offline evaluation.</p>
      <p>For a 3D face that you can rotate and inspect, see this
        <a href="https://sketchfab.com/3d-models/albert-einstein-eed0b3d973914ff98cc444e00abd09f7"
          target="_blank" rel="noopener noreferrer">interactive Albert Einstein example</a>.
        Your submission must be a direct URL to your <code>.glb</code> file, not a viewer page.</p>
      <p><strong>Marks (8 total):</strong> This Check awards <strong>0.5 marks</strong> for a reachable,
        CORS-enabled, valid GLB under 2 MB. The remaining <strong>7.5 marks</strong> will be awarded
        through an <strong>offline AI and peer review</strong> of how closely your 3D model matches
        the photograph. The review is not part of this Check.</p>
      <label for="${a}" class="form-label"><strong>Public GLB URL</strong></label>
      <input id="${a}" name="${a}" type="url" class="form-control"
        placeholder="https://example.com/face.glb" autocomplete="off" ?disabled=${!n} />
    </div>`;
  return {
    id: a,
    title: t,
    question: d,
    weight: r,
    answer: async (e) => {
      if (!n) throw new Error("Your assigned photograph could not be loaded.");
      let s;
      try {
        s = new URL(String(e || "").trim());
      } catch {
        throw new Error("Enter a public HTTPS URL.");
      }
      if (s.protocol !== "https:")
        throw new Error("The GLB must have a public HTTPS URL.");
      let p = await fetch(s, { mode: "cors", cache: "no-store" }).catch(() => {
        throw new Error(
          "Could not fetch the file from this browser. Check that the URL is public and enables CORS.",
        );
      });
      if (!p.ok) throw new Error(`The GLB URL returned HTTP ${p.status}.`);
      if (Number(p.headers.get("content-length")) > H)
        throw new Error("GLB exceeds 2,000,000 bytes.");
      if (!p.body) throw new Error("Cannot read the GLB response.");
      let g = [],
        T = p.body.getReader(),
        v = 0;
      try {
        for (;;) {
          let { done: b, value: q } = await T.read();
          if (b) break;
          if (((v += q.byteLength), v > H))
            throw (await T.cancel(), new Error("GLB exceeds 2,000,000 bytes."));
          g.push(q);
        }
      } finally {
        T.releaseLock();
      }
      let E = new Uint8Array(v),
        A = 0;
      for (let b of g) E.set(b, A), (A += b.byteLength);
      return (
        J(E),
        {
          correct: !0,
          score: r,
          validMessage: `Valid GLB, ${v.toLocaleString()} bytes. Your model will be evaluated offline.`,
        }
      );
    },
  };
}
var H,
  Y = u(() => {
    "use strict";
    F();
    H = 2e6;
  });
async function K(o, r = fetch) {
  let a = await r(o, { mode: "cors", cache: "no-store" });
  if (!a.ok || !a.body)
    throw new Error(
      "Could not fetch the video. Check its URL and CORS settings.",
    );
  if (Number(a.headers.get("content-length")) >= 1e5)
    throw new Error("Video must be under 100 KB (100,000 bytes).");
  let t = a.body.getReader(),
    c = [],
    n = 0;
  try {
    for (;;) {
      let { value: s, done: p } = await t.read();
      if (p) break;
      if (((n += s.length), n >= 1e5))
        throw (
          (await t.cancel(),
          new Error("Video must be under 100 KB (100,000 bytes)."))
        );
      c.push(s);
    }
  } finally {
    t.releaseLock();
  }
  let i = new Uint8Array(n),
    d = 0;
  for (let s of c) i.set(s, d), (d += s.length);
  if (i.length < 16) throw new Error("Video file is too small to be valid.");
  let l = String.fromCharCode(...i.subarray(4, 8)) === "ftyp",
    e = i[0] === 26 && i[1] === 69 && i[2] === 223 && i[3] === 163;
  if (!l && !e) throw new Error("Submit a valid MP4 or WebM video file.");
  return { bytes: i, type: l ? "video/mp4" : "video/webm" };
}
async function W({ bytes: o, type: r }) {
  let a = URL.createObjectURL(new Blob([o], { type: r })),
    t = document.createElement("video");
  t.preload = "metadata";
  try {
    if (
      (await new Promise((c, n) => {
        let i = setTimeout(
            () => n(new Error("Could not read video metadata.")),
            1e4,
          ),
          d = (l) => {
            clearTimeout(i), l ? n(l) : c();
          };
        (t.onloadedmetadata = () => d()),
          (t.onerror = () =>
            d(new Error("The video cannot be played in this browser."))),
          (t.src = a);
      }),
      !t.videoWidth || !t.videoHeight || !(t.duration > 0))
    )
      throw new Error("The video must contain playable frames.");
  } finally {
    t.removeAttribute("src"), t.load(), URL.revokeObjectURL(a);
  }
}
var Q = u(() => {
  "use strict";
});
var X = {};
h(X, { default: () => fe });
import { html as w } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function fe({ user: o, weight: r = 0.5 }) {
  let a = "q-face-morph-video",
    t = "Morph two faces into a video",
    c = new URLSearchParams({
      email: o.email,
      quizSign: o.quizSign || "",
      questionId: a,
    }),
    n,
    i;
  try {
    let e = await fetch(`./questionData?${c}`, { cache: "no-store" });
    if (!e.ok) throw new Error("Could not load your assigned faces.");
    n = await e.json();
  } catch (e) {
    i = String(e);
  }
  let d = w`
    <div class="mb-3">
      <p>Create a <strong>video that morphs the first face smoothly into the second</strong>.
        Make the change as natural and seamless as possible.</p>
      ${
        n
          ? w`
        <div class="d-flex my-3" style="gap:4px;max-width:520px">
          ${[n.from, n.to].map(
            (
              e,
              s,
            ) => w`<figure class="m-0" style="width:calc(50% - 2px);min-width:0">
            <img src="${e.url}" alt="${s === 0 ? "Start" : "End"} face"
              style="display:block;width:100%;height:220px;object-fit:contain;border-radius:4px" loading="lazy" />
            <figcaption class="text-muted mt-1">${s === 0 ? "From" : "To"} ·
              <a href="${e.url}" target="_blank" rel="noopener noreferrer">Source photo</a></figcaption>
          </figure>`,
          )}
        </div>
      `
          : w`<p class="alert alert-danger">${i} Reload to try again.</p>`
      }
      <p><strong>Submit:</strong> A public HTTPS URL linking directly to your video, smaller than
        <strong>100 KB (100,000 bytes)</strong>. The video must be accessible from a browser and remain available for offline evaluation.</p>
      <p><strong>Marks:</strong> Check awards <strong>0.5 marks</strong> for a valid, playable video under the size limit.
        Your classmates will evaluate how smoothly and convincingly the faces morph into each other
        for a further <strong>4 marks offline</strong>. This review is not part of Check.</p>
      <label for="${a}" class="form-label"><strong>Public video URL</strong></label>
      <input id="${a}" name="${a}" type="url" class="form-control"
        placeholder="https://example.com/morph.mp4" autocomplete="off" ?disabled=${!n} />
    </div>`;
  return {
    id: a,
    title: t,
    question: d,
    weight: r,
    answer: async (e) => {
      if (!n) throw new Error("Your assigned faces could not be loaded.");
      let s;
      try {
        s = new URL(String(e || "").trim());
      } catch {
        throw new Error("Enter a public HTTPS URL.");
      }
      if (s.protocol !== "https:") throw new Error("Enter a public HTTPS URL.");
      let p;
      try {
        p = await K(s.toString());
      } catch (m) {
        throw new Error(
          String(m).includes("Failed to fetch")
            ? "Could not fetch the video. Check its URL and CORS settings."
            : String(m).replace(/^Error: /, ""),
        );
      }
      return (
        await W(p),
        {
          correct: !0,
          score: r,
          validMessage: `Playable video under 100 KB (${p.bytes.length.toLocaleString()} bytes). Peer review follows offline.`,
        }
      );
    },
  };
}
var Z = u(() => {
  "use strict";
  Q();
});
function k(o) {
  let r = String(o || "")
      .trim()
      .split(/[\s,]+/),
    a = r.map(Number);
  if (
    a.length !== 10 ||
    a.some((t, c) => !Number.isInteger(t) || String(t) !== r[c]) ||
    new Set(a).size !== 10 ||
    a.some((t) => t < 1 || t > 10)
  )
    throw new Error(
      "Enter each pair number from 1 to 10 exactly once, easiest first, separated by commas.",
    );
  return a;
}
var S = u(() => {
  "use strict";
});
import ye from "https://cdn.jsdelivr.net/npm/sortablejs@1.15.6/+esm";
function ee(o, r) {
  if (!o || o.dataset.sortReady) return;
  o.dataset.sortReady = "true";
  let a = () => [...o.querySelectorAll(":scope > [data-pair-number]")],
    t = (d = !1) => {
      let l = a();
      l.forEach((e, s) => {
        (e.querySelector(".face-morph-position").textContent = String(s + 1)),
          e.setAttribute(
            "aria-label",
            `Rank ${s + 1}: pair ${e.dataset.pairNumber}`,
          ),
          (e.querySelector('[data-move="-1"]').disabled =
            r.disabled || s === 0),
          (e.querySelector('[data-move="1"]').disabled =
            r.disabled || s === l.length - 1);
      }),
        d &&
          ((r.value = l.map((e) => e.dataset.pairNumber).join(",")),
          r.dispatchEvent(new Event("input", { bubbles: !0 })));
    },
    c = () => {
      try {
        let d = k(r.value),
          l = new Map(a().map((e) => [Number(e.dataset.pairNumber), e]));
        o.append(...d.map((e) => l.get(e)));
      } catch {}
      t();
    };
  r.addEventListener("change", c),
    o.addEventListener("click", (d) => {
      let l = d.target.closest("[data-move]");
      if (!l || r.disabled) return;
      let e = l.closest("[data-pair-number]"),
        s = a(),
        p = s.indexOf(e),
        m = Number(l.dataset.move),
        g = s[p + m];
      g && (o.insertBefore(m < 0 ? e : g, m < 0 ? g : e), t(!0), l.focus());
    });
  let n = ye.create(o, {
      animation: 160,
      handle: ".face-morph-grip",
      draggable: "[data-pair-number]",
      ghostClass: "opacity-50",
      onMove: () => !r.disabled,
      onEnd: () => t(!0),
    }),
    i = () => {
      n.option("disabled", r.disabled),
        (r.parentElement.querySelector("[data-face-morph-confirm]").disabled =
          r.disabled),
        t();
    };
  new MutationObserver(i).observe(r, {
    attributes: !0,
    attributeFilter: ["disabled"],
  }),
    i(),
    c();
}
var te = u(() => {
  "use strict";
  S();
});
var ae = {};
h(ae, { default: () => be });
import { html as y } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
import { ref as ve } from "https://cdn.jsdelivr.net/npm/lit-html@3/directives/ref.js";
async function be({ user: o, weight: r = 1 }) {
  let a = "q-face-morph-rank",
    t = "Which faces are easiest to morph?",
    c = new URLSearchParams({
      email: o.email,
      quizSign: o.quizSign || "",
      questionId: a,
    }),
    n,
    i;
  try {
    let e = await fetch(`./questionData?${c}`, { cache: "no-store" });
    if (!e.ok) throw new Error("Could not load your assigned face pairs.");
    n = await e.json();
  } catch (e) {
    i = String(e);
  }
  let d = y`
    <div class="mb-3">
      <p>Rank these <strong>10 pairs of faces</strong> by how easy you think it will be to create
        a smooth, convincing video morphing from the left face to the right.</p>
      <p><strong>Drag the grip (⠿) to reorder</strong>, or use the ↑ and ↓ buttons.
        Put the <strong>easiest at the top</strong> and the <strong>hardest at the bottom</strong>.
        The list is your answer. Press <strong>Check</strong>, then <strong>Save</strong>.</p>
      ${
        n
          ? y`
        <input id="${a}" name="${a}" type="hidden" class="form-control" data-face-morph-order />
        <div class="fw-semibold my-2" style="max-width:600px">↑ Easiest to morph</div>
        <ol data-face-morph-list class="list-unstyled d-grid gap-2 my-2" style="max-width:600px"
          ${ve((e) => {
            e &&
              queueMicrotask(() => {
                e.isConnected &&
                  ee(
                    e,
                    e.parentElement.querySelector("[data-face-morph-order]"),
                  );
              });
          })}>
          ${n.map(
            (e) => y`<li data-pair-number="${e.number}"
            class="d-flex align-items-center gap-2 border rounded p-2 bg-body">
            <strong class="face-morph-position text-center" style="width:1.4rem;flex-shrink:0"
              aria-hidden="true">${e.number}</strong>
            <div class="d-flex" style="gap:4px;min-width:0;flex:1">
              ${[e.from, e.to].map(
                (s, p) => y`<img src="${s.url}"
                alt="${p === 0 ? "From" : "To"} face, pair ${e.number}"
                style="width:calc(50% - 2px);height:120px;object-fit:contain;border-radius:4px"
                loading="lazy" />`,
              )}
            </div>
            <div class="d-flex flex-column align-items-center gap-1" style="width:44px;flex-shrink:0">
              <span class="small text-muted">Pair ${e.number}</span>
              <span class="face-morph-grip border rounded text-center" aria-hidden="true"
                title="Drag to move pair ${e.number}"
                style="cursor:grab;touch-action:none;user-select:none;width:44px;height:36px;font-size:1.35rem;line-height:34px">⠿</span>
              <button type="button" class="btn btn-outline-secondary p-0" data-move="-1"
                style="width:44px;height:40px" aria-label="Move pair ${e.number} up">↑</button>
              <button type="button" class="btn btn-outline-secondary p-0" data-move="1"
                style="width:44px;height:40px" aria-label="Move pair ${e.number} down">↓</button>
            </div>
          </li>`,
          )}
        </ol>
        <div class="fw-semibold" style="max-width:600px">↓ Hardest to morph</div>
        <button type="button" data-face-morph-confirm class="btn btn-outline-primary btn-sm mt-3"
          @click=${() => {
            let e = document.getElementById(a);
            if (e.disabled) return;
            let s = e.parentElement.querySelector("[data-face-morph-list]");
            (e.value = [...s.querySelectorAll("[data-pair-number]")]
              .map((p) => p.dataset.pairNumber)
              .join(",")),
              e.dispatchEvent(new Event("input", { bubbles: !0 }));
          }}>Confirm this order</button>
        <p class="small text-muted mt-2">If the current order is already your answer, confirm it without moving a pair.</p>
      `
          : y`<p class="alert alert-danger">${i} Reload to try again.</p>`
      }
      <p><strong>Marks:</strong> Check awards <strong>1 mark</strong> for a complete ranking.
        How well your ranking matches your classmates' judgements of the actual morph videos
        is worth a further <strong>4 marks offline</strong>.</p>
    </div>`;
  return {
    id: a,
    title: t,
    question: d,
    weight: r,
    answer: async (e) => {
      if (!n) throw new Error("Your assigned pairs could not be loaded.");
      return (
        k(e),
        {
          correct: !0,
          score: r,
          validMessage:
            "Ranking saved. It will be compared with peers offline.",
        }
      );
    },
  };
}
var oe = u(() => {
  "use strict";
  te();
  S();
});
import {
  html as f,
  render as ne,
} from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
function R(o, r) {
  let a = f`<ol class="mt-3">
    ${o.map(({ id: n, title: i, weight: d }) => f`<li><a href="#h${n}">${i}</a> (${d} ${d == 1 ? "mark" : "marks"})</li>`)}
  </ol>`,
    t = [
      f`<h1 class="display-6">Questions</h1>`,
      a,
      ...o.map(
        ({ id: n, title: i, weight: d, question: l, help: e }, s) => (
          e && !Array.isArray(e) && (e = [e]),
          f`
        <details class="card my-5" data-question="${n}" id="h${n}" open>
          <summary class="card-header d-flex align-items-center gap-2">
            <span class="badge text-bg-primary">${s + 1}</span>
            <span class="flex-grow-1">${i} (${d} ${d == 1 ? "mark" : "marks"})</span>
            <span class="badge text-bg-success solved-badge d-none"><i class="bi bi-check-circle-fill me-1"></i>Solved</span>
            <i class="bi bi-chevron-up question-chevron" aria-hidden="true"></i>
          </summary>
          ${e ? e.map((p) => f`<div class="card-body border-bottom">${p}</div>`) : ""}
          <div class="card-body">${l}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${n}">Check</button>
          </div>
        </details>
      `
        ),
      ),
    ],
    c = { index: a, questions: t };
  for (let [n, i] of r) ne(c[i], n);
}
async function Ge(o, r) {
  let a = [
    await Promise.resolve()
      .then(() => (_(), L))
      .then((t) => t.default({ user: o, weight: 0 })),
    await Promise.resolve()
      .then(() => (P(), O))
      .then((t) => t.default({ user: o, weight: 4, version: "v3" })),
    await Promise.resolve()
      .then(() => (U(), $))
      .then((t) => t.default({ user: o, weight: 4, version: "v3" })),
    await Promise.resolve()
      .then(() => (B(), z))
      .then((t) => t.default({ user: o, weight: 4, version: "v3" })),
    await Promise.resolve()
      .then(() => (G(), M))
      .then((t) => t.default({ user: o, weight: 1 })),
    await Promise.resolve()
      .then(() => (Y(), V))
      .then((t) => t.default({ user: o, weight: 0.5 })),
    await Promise.resolve()
      .then(() => (Z(), X))
      .then((t) => t.default({ user: o, weight: 0.5 })),
    await Promise.resolve()
      .then(() => (oe(), ae))
      .then((t) => t.default({ user: o, weight: 1 })),
  ];
  return R(a, r), Object.fromEntries(a.map(({ id: t, ...c }) => [t, c]));
}
export { Ge as questions };
