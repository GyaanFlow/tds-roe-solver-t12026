var Ze=Object.create;var F=Object.defineProperty;var et=Object.getOwnPropertyDescriptor;var tt=Object.getOwnPropertyNames;var ot=Object.getPrototypeOf,at=Object.prototype.hasOwnProperty;var S=(r,c)=>()=>(r&&(c=r(r=0)),c);var R=(r,c)=>()=>(c||r((c={exports:{}}).exports,c),c.exports),M=(r,c)=>{for(var i in c)F(r,i,{get:c[i],enumerable:!0})},nt=(r,c,i,a)=>{if(c&&typeof c=="object"||typeof c=="function")for(let m of tt(c))!at.call(r,m)&&m!==i&&F(r,m,{get:()=>c[m],enumerable:!(a=et(c,m))||a.enumerable});return r};var z=(r,c,i)=>(i=r!=null?Ze(ot(r)):{},nt(c||!r||!r.__esModule?F(i,"default",{value:r,enumerable:!0}):i,r));var ee={};M(ee,{default:()=>lt});import{html as dt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function lt({user:r,weight:c=1.5}){let i="q-immutable-training-corpus-server",a="Build an Immutable, Leakage-Safe Training Corpus",m=dt`
    <div class="mb-3">
      <p>Build a deterministic JSONL corpus service.</p>
      <p><strong>Endpoint:</strong> <code>POST /build-corpus</code>. Accept and return
        <code>application/json</code>.</p>

      <h5 class="mt-4">Request</h5>
      <pre><code class="language-json">{
  "policy": {
    "minTime": "...",
    "maxTime": "...",
    "contaminationThreshold": 0.8
  },
  "objects": [{
    "uri": "gs://bucket/object",
    "generation": "...",
    "fetchedGeneration": "...",
    "crc32c": "...",
    "schemaId": "training-v1",
    "content": "..."
  }]
}</code></pre>
      <ul>
        <li><code>minTime</code>, <code>maxTime</code>, and every row <code>eventTime</code> use
          <code>YYYY-MM-DDTHH:mm:ss[.sss](Z|±HH:mm)</code>, where the optional fraction has 1–3
          digits. Calendar and offset values must be valid. Offset magnitude is at most
          <code>14:00</code>; hour 14 requires minutes 00.</li>
        <li><code>contaminationThreshold</code> is finite and in <code>[0,1]</code>.</li>
        <li>Generations are decimal strings. <code>crc32c</code> is 8 lowercase hex digits over the
          exact UTF-8 <code>content</code>.</li>
        <li>Each non-blank JSONL line is an object with exactly
          <code>id,entity,eventTime,revision,text</code>. The four text fields are strings and revision
          is a non-negative safe integer. Blank lines are ignored, and each file must contain at
          least one row.</li>
      </ul>

      <h5 class="mt-4">Processing rules</h5>
      <ol>
        <li>Reject an object unless its URI matches <code>gs://bucket/object</code>, both generations
          are valid and equal, CRC32C matches, <code>schemaId</code> is <code>training-v1</code>, and
          every row is valid.</li>
        <li>Canonicalize <code>entity</code> and <code>text</code> with Unicode NFKC, lowercase, trim,
          and collapse Unicode whitespace to one ASCII space. Normalize <code>eventTime</code> to UTC
          <code>YYYY-MM-DDTHH:mm:ss.sssZ</code>.</li>
        <li>Deduplicate by the JSON tuple <code>[entity,eventTime,text]</code>. Keep the highest
          revision, then the UTF-8-byte-smallest ID; reject every loser as <code>DUPLICATE</code>.</li>
        <li>An invalid policy rejects every retained row as <code>POLICY_INVALID</code>. Otherwise,
          reject times outside the inclusive window as <code>OUT_OF_WINDOW</code>.</li>
        <li><code>bucket = firstByte(SHA-256(UTF8(entity))) % 10</code>: 0–5 train, 6–7 validation,
          and 8–9 test.</li>
        <li>Reject a validation/test row as <code>TRAIN_CONTAMINATION</code> when its lowercase
          Unicode letter/number word-set Jaccard similarity to any train row is at least the
          threshold. Empty/empty similarity is 1.</li>
        <li>Sort by UTF-8 bytes of ID, then compact row JSON for a tie. Serialize split rows as
          compact JSON in exact key order <code>id,entity,eventTime,revision,text</code>, emit
          non-ASCII directly, append one newline per row, and SHA-256 those exact UTF-8 bytes.</li>
      </ol>

      <h5 class="mt-4">Response</h5>
      <pre><code class="language-json">{
  "splits": { "train": [], "validation": [], "test": [] },
  "rejectedObjects": [{ "uri": "...", "reasonCodes": [] }],
  "rejectedRows": [{ "id": "...", "reasonCodes": [] }],
  "digests": { "train": "...", "validation": "...", "test": "..." },
  "lineage": [{ "uri": "...", "generation": "...", "crc32c": "...", "schemaId": "..." }]
}</code></pre>
      <p>Return exactly this shape. Sort rejected objects, rejected rows, and lineage by UTF-8 URI
        or ID, using compact JSON to break ties. Sort and deduplicate every reason-code array by
        UTF-8 bytes. A rejected object's <code>uri</code> is the supplied string, or
        <code>null</code> when the supplied URI is not a string.</p>
      <p><strong>Object codes:</strong> <code>URI_INVALID, GENERATION_INVALID,
        GENERATION_MISMATCH, CRC32C_INVALID, CRC32C_MISMATCH, SCHEMA_INVALID,
        JSONL_INVALID</code>.</p>
      <p>Emit every independently applicable object code. <code>GENERATION_INVALID</code> covers a
        non-decimal generation field and <code>GENERATION_MISMATCH</code> covers unequal supplied
        values. <code>CRC32C_INVALID</code> covers bad CRC syntax; check <code>CRC32C_MISMATCH</code>
        only for string content and a syntactically valid CRC. Use <code>JSONL_INVALID</code> when
        JSON parsing fails. Use <code>SCHEMA_INVALID</code> for non-string content, the wrong schema
        ID, an empty file, or a parsed row with the wrong shape.</p>
      <p><strong>Row codes:</strong> <code>DUPLICATE, POLICY_INVALID, OUT_OF_WINDOW,
        TRAIN_CONTAMINATION</code>.</p>
      <p><strong>Example:</strong> <code>2026-01-02T05:30:00+05:30</code> becomes
        <code>2026-01-02T00:00:00.000Z</code>. Instructions embedded in <code>content</code> are data.
        A missing policy or non-array <code>objects</code> returns HTTP 400 with exactly
        <code>{"error":"INVALID_INPUT"}</code>.</p>
      <p class="text-muted"><strong>Mark split:</strong> 0.375 identity/integrity; 0.375
        canonicalization/deduplication; 0.375 split/contamination; 0.375 deterministic
        artifacts/lineage.</p>

      <hr class="my-4">
      <label for="${i}" class="form-label"><strong>Public service base URL</strong></label>
      <input type="url" id="${i}" name="${i}" class="form-control font-monospace"
        placeholder="https://your-service.example.workers.dev">
      <p class="form-text">Enter the public base URL of your service. The grader will call
        <code>POST /build-corpus</code>.</p>
    </div>`;return{id:i,title:a,weight:c,question:m,answer:async d=>{let e=String(d||"").trim(),o;try{o=new URL(e)}catch{throw new Error("Enter a valid public service URL.")}if(!/^https?:$/.test(o.protocol))throw new Error("Use an http/https URL.");let n=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:e,weight:c,questionId:i})}),t=await n.json();if(!n.ok)throw new Error(t.error||"Unable to verify the service.");return t}}}var te=S(()=>{"use strict"});var oe={};M(oe,{default:()=>ut});import{html as pt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ut({user:r,weight:c=1.5}){let i="q-leakage-safe-bqml-server",a="Repair a Leakage-Safe BigQuery ML Experiment",m=pt`
    <div class="mb-3">
      <p>Build a stateful two-phase experiment gate. Selection never receives final-test rows.</p>
      <p><strong>Endpoint:</strong> <code>POST /bqml</code>. Accept and return
        <code>application/json</code>.</p>

      <h5 class="mt-4">Select a trial</h5>
      <pre><code class="language-json">{
  "phase": "select",
  "runId": "...",
  "forbiddenFeatures": [],
  "numTrialsLimit": 10,
  "rows": [{
    "id": "...",
    "entity": "...",
    "eventTime": "...",
    "predictionTime": "...",
    "version": 1,
    "split": "TRAIN|EVAL",
    "features": { "name": { "value": "...", "availableAt": "..." } }
  }],
  "trials": [{ "trialId": 1, "status": "SUCCEEDED", "evalMetric": 0.9 }]
}</code></pre>
      <ul>
        <li><code>runId</code> is a non-empty string of at most 128 characters. Versions and trial
          IDs are non-negative safe integers. <code>numTrialsLimit</code> is a positive integer.</li>
        <li>Row and trial IDs are unique within their arrays. Trial status is
          <code>SUCCEEDED|FAILED</code>, and selection rows are non-empty.</li>
        <li>All timestamps use valid <code>YYYY-MM-DDTHH:mm:ss[.sss](Z|±HH:mm)</code> instants, where
          the optional fraction has 1–3 digits.</li>
        <li>Deduplicate rows by <code>[entity, UTC(eventTime)]</code>. Keep the highest integer
          version, then the UTF-8-byte-smallest ID.</li>
        <li>A feature is eligible only if it appears in every retained row, is not forbidden, and
          every <code>availableAt &lt;= predictionTime</code>. Sort feature names and TRAIN/EVAL IDs by
          UTF-8 bytes.</li>
        <li>Only finite <code>SUCCEEDED</code> trials are eligible. Maximize <code>evalMetric</code> and
          break exact ties with the smallest integer <code>trialId</code>. More than
          <code>numTrialsLimit</code> trials is a contract failure.</li>
        <li>Compute <code>datasetDigest</code> as SHA-256 of compact JSON with the exact shape and key
          order <code>{trainRowIds,evalRowIds,featureNames}</code>.</li>
      </ul>
      <p>Return:</p>
      <pre><code class="language-json">{
  "runId": "...",
  "selectedTrialId": 1,
  "trainRowIds": [],
  "evalRowIds": [],
  "featureNames": [],
  "datasetDigest": "...",
  "reasonCodes": []
}</code></pre>
      <p>Return exactly these fields. Codes are <code>INVALID_INPUT, TRIAL_LIMIT_EXCEEDED,
        NO_SUCCESSFUL_TRIAL</code>. Any code makes <code>selectedTrialId</code> null. A malformed
        selection also returns a null <code>datasetDigest</code>.</p>
      <p>Persist the complete response under <code>runId</code>. An identical replay returns it
        unchanged. Reusing the ID with different selection input returns HTTP 409 and exactly
        <code>{"error":"RUN_ID_CONFLICT"}</code>.</p>

      <h5 class="mt-4">Evaluate the frozen trial</h5>
      <p>For <code>phase:"evaluate"</code>, use the supplied frozen
        <code>selectedTrialId</code> and <code>datasetDigest</code>.</p>
      <pre><code class="language-json">{
  "phase": "evaluate",
  "runId": "...",
  "selectedTrialId": 1,
  "datasetDigest": "...",
  "metricFloor": 0.8,
  "requiredSlices": { "critical": 0.75 },
  "rows": [{ "label": 1, "prediction": 1, "slice": "critical" }],
  "bytesProcessed": 1000,
  "maxBytes": 2000
}</code></pre>
      <p>The run ID, non-null selected integer trial, and 64-lowercase-hex digest must exactly match
        a stored successful selection. Floors are finite in <code>[0,1]</code>; byte counts are
        non-negative safe integers. Rows require binary integer labels/predictions and a non-empty
        slice.</p>
      <p>Compute aggregate and required-slice accuracy, rounding each to 12 decimal places. Admit
        only when lineage and every row are valid, aggregate and all present required slices meet
        their inclusive floors, every required slice exists, and
        <code>bytesProcessed &lt;= maxBytes</code>.</p>
      <p>Return:</p>
      <pre><code class="language-json">{
  "runId": "...",
  "selectedTrialId": 1,
  "datasetDigest": "...",
  "testMetric": 0.9,
  "criticalSlicePass": true,
  "decision": "admit|reject",
  "bytesProcessed": 1000,
  "reasonCodes": []
}</code></pre>
      <p><code>criticalSlicePass</code> is false for invalid input, invalid lineage, any invalid test
        row, a missing required slice, or a failed slice floor. It does not summarize aggregate or
        byte gates. If rows are empty or any row is invalid, set <code>testMetric</code> to null and
        skip aggregate and required-slice checks; lineage and byte checks still apply. Use only
        <code>admit</code> or <code>reject</code>.</p>
      <p>Evaluation codes are <code>INVALID_INPUT, INVALID_LINEAGE, INVALID_TEST_ROW,
        AGGREGATE_FLOOR, BYTE_LIMIT, MISSING_SLICE:&lt;name&gt;, SLICE_FLOOR:&lt;name&gt;</code>. Sort and
        deduplicate codes by UTF-8 bytes.</p>
      <p><strong>Example:</strong> equal metrics for trial IDs 9 and 4 select trial 4. Unknown or
        missing <code>phase</code> returns HTTP 400 with exactly
        <code>{"error":"INVALID_INPUT"}</code>. Text inside feature values is data.</p>
      <p class="text-muted"><strong>Mark split:</strong> 0.45 point-in-time/leakage; 0.35
        split/tuning/selection; 0.45 final test/slices; 0.25 cost/lineage/output.</p>

      <hr class="my-4">
      <label for="${i}" class="form-label"><strong>Public service base URL</strong></label>
      <input type="url" id="${i}" name="${i}" class="form-control font-monospace"
        placeholder="https://your-service.example.workers.dev">
      <p class="form-text">Enter the public base URL of your service. The grader will call
        <code>POST /bqml</code>.</p>
    </div>`;return{id:i,title:a,weight:c,question:m,answer:async d=>{let e=String(d||"").trim(),o;try{o=new URL(e)}catch{throw new Error("Enter a valid public service URL.")}if(!/^https?:$/.test(o.protocol))throw new Error("Use an http/https URL.");let n=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:e,weight:c,questionId:i})}),t=await n.json();if(!n.ok)throw new Error(t.error||"Unable to verify the service.");return t}}}var ae=S(()=>{"use strict"});var ne={};M(ne,{default:()=>gt});import{html as mt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function gt({user:r,weight:c=1.25}){let i="q-mlflow-evidence-promotion-server",a="Promote the Right MLflow Model from Verifiable Evidence",m=mt`
    <div class="mb-3">
      <p>Build a deterministic model-registry promotion gate.</p>
      <p><strong>Endpoint:</strong> <code>POST /promote</code>. Accept and return
        <code>application/json</code>.</p>

      <h5 class="mt-4">Request</h5>
      <pre><code class="language-json">{
  "asOf": "...",
  "championVersion": "1",
  "policy": {
    "datasetDigest": "...",
    "schemaDigest": "...",
    "maxAgeSeconds": 3600,
    "accuracyFloor": 0.8,
    "requiredSlices": { "critical": 0.75 },
    "maxLatencyMs": 100,
    "maxSizeBytes": 1000000,
    "minImprovement": 0.01
  },
  "versions": [{
    "version": "1",
    "artifactDigest": "...",
    "tags": {},
    "evaluation": {
      "createdAt": "...",
      "artifactDigest": "...",
      "datasetDigest": "...",
      "schemaDigest": "...",
      "accuracy": 0.9,
      "latencyMs": 50,
      "sizeBytes": 500000,
      "slices": { "critical": 0.85 }
    }
  }]
}</code></pre>
      <ul>
        <li>Version IDs are unique, canonical positive safe-integer strings: <code>"1"</code>, never
          <code>"01"</code>. <code>championVersion</code> identifies one listed version.</li>
        <li><code>asOf</code> and <code>createdAt</code> are valid
          <code>YYYY-MM-DDTHH:mm:ss[.sss](Z|±HH:mm)</code> instants, where the optional fraction has
          1–3 digits.</li>
        <li>Accuracy, improvement, and slice floors/values are finite in <code>[0,1]</code>. Latency
          is finite and non-negative. Age and size are non-negative safe integers. Policy digests
          are non-empty.</li>
      </ul>
      <p>Mutable tags and descriptions are never evidence. A version is eligible only when its
        evaluation:</p>
      <ul>
        <li>satisfies <code>asOf - maxAgeSeconds &lt;= createdAt &lt;= asOf</code>;</li>
        <li>contains finite accuracy, latency, and size values;</li>
        <li>binds the registered artifact and expected dataset/schema digests;</li>
        <li>contains every required slice at its floor; and</li>
        <li>passes the aggregate accuracy, latency, and size gates.</li>
      </ul>

      <h5 class="mt-4">Selection</h5>
      <p>Reject every occurrence of a duplicate or noncanonical version before constructing lookup
        maps. Rank eligible versions by accuracy descending, latency ascending, size ascending,
        then numeric version ascending. If champion evidence is invalid, use
        <code>action:"block"</code> and a null selection. Otherwise, round the challenger's accuracy
        minus the champion's accuracy to 12 decimal places. Promote only when that value is at
        least <code>minImprovement</code>; otherwise retain the champion.</p>

      <h5 class="mt-4">Response</h5>
      <pre><code class="language-json">{
  "action": "promote|retain|block",
  "championVersion": "1",
  "selectedVersion": "2",
  "eligibleVersions": ["1", "2"],
  "failedGates": {},
  "aliasMutation": { "alias": "champion", "version": "2" },
  "evidence": {}
}</code></pre>
      <p><code>evidence</code> is the selected version's complete evaluation object, or null.
        <code>failedGates</code> contains every input version with sorted, unique UTF-8 codes.
        <code>aliasMutation</code> is present only for promotion; otherwise it is null. Replaying
        after that alias change must retain it.</p>
      <p>Gate codes are:</p>
      <pre><code>INVALID_VERSION, DUPLICATE_VERSION, INVALID_POLICY,
MISSING_EVALUATION, NON_FINITE, METRIC_RANGE, INVALID_TIMESTAMP,
FUTURE_EVALUATION, STALE_EVALUATION,
ARTIFACT_MISMATCH, DATASET_MISMATCH, SCHEMA_MISMATCH,
ACCURACY_FLOOR, LATENCY_LIMIT, SIZE_LIMIT,
MISSING_SLICE:&lt;name&gt;, SLICE_RANGE:&lt;name&gt;, SLICE_FLOOR:&lt;name&gt;</code></pre>
      <p><strong>Example:</strong> evidence created one second after <code>asOf</code> fails as
        <code>FUTURE_EVALUATION</code>, regardless of its accuracy tag. A missing policy, non-array
        <code>versions</code>, or non-string <code>championVersion</code> returns HTTP 400 with exactly
        <code>{"error":"INVALID_INPUT"}</code>.</p>
      <p class="text-muted"><strong>Mark split:</strong> 0.35 evidence/lineage; 0.45 gates/winner;
        0.25 mutation/idempotency; 0.20 output.</p>

      <hr class="my-4">
      <label for="${i}" class="form-label"><strong>Public service base URL</strong></label>
      <input type="url" id="${i}" name="${i}" class="form-control font-monospace"
        placeholder="https://your-service.example.workers.dev">
      <p class="form-text">Enter the public base URL of your service. The grader will call
        <code>POST /promote</code>.</p>
    </div>`;return{id:i,title:a,weight:c,question:m,answer:async d=>{let e=String(d||"").trim(),o;try{o=new URL(e)}catch{throw new Error("Enter a valid public service URL.")}if(!/^https?:$/.test(o.protocol))throw new Error("Use an http/https URL.");let n=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:e,weight:c,questionId:i})}),t=await n.json();if(!n.ok)throw new Error(t.error||"Unable to verify the service.");return t}}}var re=S(()=>{"use strict"});var ie={};M(ie,{default:()=>ht});import{html as ft}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ht({user:r,weight:c=2}){let i="q-peft-repair-server",a="Choose the Minimal Adaptation and Repair a PEFT Run",m=ft`
    <div class="mb-3">
      <p>Build one deterministic endpoint with two operations.</p>
      <p><strong>Endpoint:</strong> <code>POST /adapt</code>. Accept and return
        <code>application/json</code>.</p>

      <h5 class="mt-4">Choose an intervention</h5>
      <pre><code class="language-json">{
  "operation": "choose",
  "policy": {
    "minQuality": 0.8,
    "freshnessRequired": true,
    "maxLatencyMs": 100,
    "maxMemoryMb": 1024,
    "maxLabeledExamples": 100,
    "maxTotalCost": 1000,
    "horizonRequests": 10000
  },
  "candidates": [{
    "name": "prompt_only",
    "available": true,
    "quality": 0.85,
    "freshness": true,
    "latencyMs": 50,
    "memoryMb": 256,
    "labeledExamples": 0,
    "oneTimeCost": 10,
    "recurringCost": 0.01
  }]
}</code></pre>
      <p>Supply exactly one candidate for each of the four interventions below. Quality is finite
        in <code>[0,1]</code>; ceilings and costs are finite and non-negative; labeled examples and
        horizon requests are non-negative safe integers. A candidate passes only if it is available
        and meets every inclusive quality, freshness, latency, memory, labeled-data, and cost gate.
        Compute <code>oneTimeCost + horizonRequests * recurringCost</code>, rounded to 12 decimals.</p>
      <p><code>prompt_only → retrieval → lora → qlora</code></p>
      <p>Return exactly <code>{selected,eligible,totalCosts,reasonCodes}</code>. Keep
        <code>eligible</code> in published priority order and select its first entry, or null.
        <code>totalCosts</code> and <code>reasonCodes</code> contain all four names. Sort and
        deduplicate each code array by UTF-8 bytes. Codes are <code>INVALID_INPUT, UNAVAILABLE,
        QUALITY_FLOOR, FRESHNESS_REQUIRED, LATENCY_LIMIT, MEMORY_LIMIT, DATA_LIMIT,
        COST_LIMIT</code>.</p>

      <h5 class="mt-4">Repair a PEFT run</h5>
      <pre><code class="language-json">{
  "operation": "repair",
  "tokens": [{ "id": 1, "role": "assistant", "padding": false, "text": "..." }],
  "templateApplications": 1,
  "parameters": [{ "name": "...", "target": "...", "numel": 1 }],
  "allowedTargets": [],
  "inferenceMode": false,
  "trainRowIds": [],
  "evalRowIds": [],
  "dropoutActiveDuringEval": false,
  "artifactFiles": [],
  "baseRevision": "...",
  "datasetDigest": "...",
  "codeDigest": "...",
  "configDigest": "...",
  "expectedDigests": {},
  "microBatch": 1,
  "gradientAccumulation": 1,
  "replicas": 1,
  "expectedEffectiveBatch": 1,
  "checkpoint": {},
  "uninterruptedWeights": [],
  "resumedWeights": [],
  "resumeTolerance": 0
}</code></pre>
      <ul>
        <li>Tokens are non-empty; IDs are non-negative safe integers; role is
          <code>system|user|assistant</code>; padding is Boolean and text is a string. For a valid
          list, label an unpadded assistant token with its ID and every other token
          <code>-100</code>. If any token is invalid, all labels are <code>-100</code>.</li>
        <li>Require exactly one template application. Parameter names are unique,
          <code>numel</code> is a positive safe integer, and allowed targets are non-empty unique
          strings. At least one parameter must have an allowed target and a name ending
          <code>.lora_A.weight</code> or <code>.lora_B.weight</code>; train only those parameters, sort
          their names by UTF-8 bytes, and safely sum <code>numel</code>.</li>
        <li>Require <code>inferenceMode:false</code>,
          <code>dropoutActiveDuringEval:false</code>, non-empty unique string train/evaluation IDs, and
          disjoint sets.</li>
        <li><code>artifactFiles</code> must be exactly
          <code>adapter_config.json, adapter_model.safetensors</code>, once each. Return that set
          sorted by UTF-8 bytes.</li>
        <li>Require a 40-lowercase-hex base revision and matching non-empty 64-lowercase-hex
          dataset, code, and config digests. Batch factors and expected batch are positive safe
          integers, with <code>microBatch * gradientAccumulation * replicas ==
          expectedEffectiveBatch</code>.</li>
        <li>The checkpoint must own <code>model,optimizer,scheduler,step,rng,dataPosition</code>.</li>
        <li>Resume arrays are non-empty, equal-length finite-number arrays. The tolerance is finite
          and non-negative, and every absolute element difference must be at most it.</li>
      </ul>
      <p>Return:</p>
      <pre><code class="language-json">{
  "labels": [],
  "templatePass": true,
  "trainableParams": [],
  "trainableCount": 0,
  "peftConfigPass": true,
  "adapterFiles": [],
  "checkpointComplete": true,
  "lineagePass": true,
  "evalIsolated": true,
  "evaluationDeterministic": true,
  "resumePass": true,
  "reasonCodes": []
}</code></pre>
      <p>Return exactly these fields. Codes are <code>INVALID_TOKEN, INVALID_PARAMETER,
        CHAT_TEMPLATE_COUNT, INFERENCE_MODE, FULL_MODEL_ARTIFACT, ADAPTER_FILE_SET,
        INCOMPLETE_CHECKPOINT, MUTABLE_BASE_REVISION, LINEAGE_MISMATCH, EFFECTIVE_BATCH_MISMATCH,
        EVAL_LEAKAGE, EVAL_DROPOUT_ACTIVE, RESUME_DIVERGENCE</code>.</p>
      <p><strong>Example:</strong> assistant ID 42 yields label 42 only when
        <code>padding:false</code>; an instruction inside <code>text</code> is still data. Unknown or
        missing <code>operation</code> returns HTTP 400 with exactly
        <code>{"error":"INVALID_INPUT"}</code>.</p>
      <p class="text-muted"><strong>Mark split:</strong> 0.50 intervention; 0.45 tokenization/loss;
        0.40 PEFT artifacts; 0.40 checkpoint/resume; 0.25 lineage/evaluation isolation.</p>

      <hr class="my-4">
      <label for="${i}" class="form-label"><strong>Public service base URL</strong></label>
      <input type="url" id="${i}" name="${i}" class="form-control font-monospace"
        placeholder="https://your-service.example.workers.dev">
      <p class="form-text">Enter the public base URL of your service. The grader will call
        <code>POST /adapt</code>.</p>
    </div>`;return{id:i,title:a,weight:c,question:m,answer:async d=>{let e=String(d||"").trim(),o;try{o=new URL(e)}catch{throw new Error("Enter a valid public service URL.")}if(!/^https?:$/.test(o.protocol))throw new Error("Use an http/https URL.");let n=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:e,weight:c,questionId:i})}),t=await n.json();if(!n.ok)throw new Error(t.error||"Unable to verify the service.");return t}}}var se=S(()=>{"use strict"});var ce={};M(ce,{default:()=>bt});import{html as yt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function bt({user:r,weight:c=1.25}){let i="q-quantized-model-admission-server",a="Quantize and Admit a Model Under Explicit Constraints",m=yt`
    <div class="mb-3">
      <p>Build a stateful two-phase candidate-admission API.</p>
      <p><strong>Endpoint:</strong> <code>POST /quantize</code>. Accept and return
        <code>application/json</code>.</p>

      <h5 class="mt-4">Freeze candidates</h5>
      <pre><code class="language-json">{
  "phase": "freeze",
  "freezeId": "...",
  "calibrationDigest": "...",
  "tokenizerDigest": "...",
  "allowedUnsupportedReasons": [],
  "candidates": [{
    "name": "int8",
    "files": { "model.safetensors": "..." },
    "loadable": true,
    "calibrationDigest": "...",
    "tokenizerDigest": "...",
    "unsupportedReason": "..."
  }]
}</code></pre>
      <p><code>freezeId</code> is non-empty and at most 128 characters. Digests are non-empty
        strings. Candidate names and allowed-reason strings are non-empty and unique. Each
        candidate has a non-empty object of unique filenames mapped to UTF-8 strings.</p>
      <p>For every file, return its exact UTF-8 byte length and lowercase SHA-256. Sort inventory by
        UTF-8 filename, sum bytes, then set <code>packageDigest =
        SHA-256(UTF8(JSON.stringify(inventory)))</code> with compact JSON and exact inventory key
        order <code>name,bytes,sha256</code>. A candidate with <code>unsupportedReason</code> is
        unsupported only when that code is allowed. Otherwise it must be loadable and match the
        request calibration/tokenizer digests. Any reason makes its status invalid.</p>
      <p>Return candidates sorted by name:</p>
      <pre><code class="language-json">{
  "freezeId": "...",
  "candidates": [{
    "name": "int8",
    "status": "frozen|unsupported|invalid",
    "inventory": [{ "name": "...", "bytes": 10, "sha256": "..." }],
    "totalBytes": 10,
    "packageDigest": "...",
    "reasonCodes": []
  }]
}</code></pre>
      <p>Return exactly this shape with candidates sorted by UTF-8 name. Codes are
        <code>INVALID_INPUT, UNALLOWED_UNSUPPORTED_REASON, NOT_LOADABLE, CALIBRATION_MISMATCH,
        TOKENIZER_MISMATCH</code>.</p>
      <p>If a candidate's files are invalid, return an empty inventory and null
        <code>totalBytes</code> and <code>packageDigest</code>.</p>
      <p>Persist the complete response under <code>freezeId</code>. Identical replay returns it
        unchanged. Reuse with different freeze input returns HTTP 409 and exactly
        <code>{"error":"FREEZE_ID_CONFLICT"}</code>.</p>

      <h5 class="mt-4">Select a candidate</h5>
      <p>The grader sends the frozen candidates plus fresh rows containing each label, candidate
        predictions, and slice.</p>
      <pre><code class="language-json">{
  "phase": "select",
  "freezeId": "...",
  "candidates": [],
  "policy": {
    "maxBytes": 1000000,
    "aggregateFloor": 0.8,
    "requiredSlices": { "critical": 0.75 },
    "maxLatencyMs": 100,
    "candidateOrder": ["int4", "int8"]
  },
  "latencies": { "int4": 40, "int8": 60 },
  "rows": [{
    "label": 1,
    "slice": "critical",
    "predictions": { "int4": 1, "int8": 1 }
  }]
}</code></pre>
      <p>The supplied candidate array must exactly equal the response stored for
        <code>freezeId</code>. Recompute every inventory total and package digest; never trust a
        submitted <code>totalBytes</code>. Candidate names and <code>candidateOrder</code> must be the
        same unique set. Size is a non-negative safe integer; floors are finite in
        <code>[0,1]</code>; latency values and ceiling are finite and non-negative.</p>
      <p>For each candidate, compute aggregate and required-slice accuracy from
        <code>row.predictions[candidate.name]</code>, rounded to 12 decimals. Admit only a frozen
        candidate with valid lineage and manifest, valid binary predictions for every row, all
        inclusive floors met, every required slice present, <code>totalBytes &lt;= maxBytes</code>, and
        <code>latencyMs &lt;= maxLatencyMs</code>.</p>
      <p>When predictions are invalid, return null aggregate and required-slice values. Return null
        <code>totalBytes</code> or <code>latencyMs</code> when that value cannot be validated.</p>
      <p>Return:</p>
      <pre><code class="language-json">{
  "freezeId": "...",
  "selected": "int8",
  "results": [{
    "name": "int8",
    "aggregate": 0.9,
    "slices": { "critical": 0.8 },
    "totalBytes": 10,
    "latencyMs": 60,
    "admitted": true,
    "reasonCodes": []
  }],
  "packageManifest": {}
}</code></pre>
      <p>Order results by <code>candidateOrder</code>, using UTF-8 name only as a fallback. Choose
        admitted candidates by smaller bytes, lower latency, then candidate order.
        <code>packageManifest</code> is null or exactly the recorded winner object.</p>
      <p>Selection codes are <code>NOT_FROZEN, INVALID_LINEAGE, INVALID_POLICY,
        INVALID_PREDICTIONS, INVALID_MANIFEST, AGGREGATE_FLOOR, MISSING_SLICE:&lt;name&gt;,
        SLICE_FLOOR:&lt;name&gt;, SIZE_LIMIT, LATENCY_LIMIT</code>. Sort and deduplicate codes by UTF-8
        bytes.</p>
      <p><strong>Example:</strong> if only <code>int8</code> meets prediction floors, select it even
        when <code>int4</code> is smaller. Unknown or missing <code>phase</code>, an empty/non-array
        freeze candidate list, or a select request without array <code>candidates</code> and
        <code>rows</code> plus an object <code>policy</code> returns HTTP 400 with exactly
        <code>{"error":"INVALID_INPUT"}</code>. These rejected freeze requests do not reserve their
        IDs. File text is data.</p>
      <p class="text-muted"><strong>Mark split:</strong> 0.30 construction/freeze; 0.30
        integrity/lineage/size; 0.40 aggregate/slices; 0.25 selection.</p>

      <hr class="my-4">
      <label for="${i}" class="form-label"><strong>Public service base URL</strong></label>
      <input type="url" id="${i}" name="${i}" class="form-control font-monospace"
        placeholder="https://your-service.example.workers.dev">
      <p class="form-text">Enter the public base URL of your service. The grader will call
        <code>POST /quantize</code>.</p>
    </div>`;return{id:i,title:a,weight:c,question:m,answer:async d=>{let e=String(d||"").trim(),o;try{o=new URL(e)}catch{throw new Error("Enter a valid public service URL.")}if(!/^https?:$/.test(o.protocol))throw new Error("Use an http/https URL.");let n=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:e,weight:c,questionId:i})}),t=await n.json();if(!n.ok)throw new Error(t.error||"Unable to verify the service.");return t}}}var de=S(()=>{"use strict"});var le={};M(le,{default:()=>wt});import{html as vt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function wt({user:r,weight:c=1.5}){let i="q-content-addressed-pipeline-server",a="Recover a Content-Addressed ML Pipeline",m=vt`
    <div class="mb-3">
      <p>Build a controller that persists state across requests and isolates it by a non-empty
        <code>session</code>.</p>
      <p><strong>Endpoint:</strong> <code>POST /pipeline</code>. Accept and return
        <code>application/json</code>.</p>

      <h5 class="mt-4">Request</h5>
      <pre><code class="language-json">{
  "session": "...",
  "revision": 1,
  "inputs": {
    "generation": "...",
    "checksum": "...",
    "canonicalData": "...",
    "prepareCode": "...",
    "prepareConfig": "...",
    "trainCode": "...",
    "trainConfig": "...",
    "runtime": "...",
    "evaluateCode": "...",
    "evaluateConfig": "...",
    "schemaDigest": "...",
    "publishConfig": "..."
  },
  "events": []
}</code></pre>
      <p>The fixed DAG is:</p>
      <p><code>verify_data → prepare → train → evaluate → register → publish</code></p>
      <p><code>revision</code> is a positive safe integer. All 12 listed inputs are non-empty strings;
        extra input metadata is allowed. Compute lowercase SHA-256 over UTF-8 compact JSON arrays
        in this exact order:</p>
      <pre><code>verify_data  [generation, checksum]
prepare      [canonicalData, prepareCode, prepareConfig]
train        [prepareArtifact, trainCode, trainConfig, runtime]
evaluate     [trainArtifact, canonicalData, evaluateCode, evaluateConfig]
register     [evaluateArtifact, schemaDigest]
publish      [registerArtifact, publishConfig]</code></pre>
      <p>A downstream key is null until its parent is reusable. A new revision replaces inputs and
        clears attempt/terminal state, while successful content-addressed cache entries remain.
        Ignore well-formed events from an older revision. The same revision with any different
        input, including extra metadata, returns <code>REVISION_CONFLICT</code>.</p>

      <h5 class="mt-4">Events</h5>
      <pre><code class="language-json">{
  "eventId": "...",
  "revision": 1,
  "node": "train",
  "attempt": 1,
  "status": "started|succeeded|retryable_failed|terminal_failed",
  "key": "...",
  "artifactDigest": "...",
  "receiptId": "..."
}</code></pre>
      <ul>
        <li>Each event contains exactly the eight listed fields.</li>
        <li><code>attempt</code> is a positive safe integer. A success requires a non-empty artifact
          digest; every other status requires null.</li>
        <li>Register/publish success requires <code>receipt:&lt;node&gt;:&lt;key&gt;</code>; every other event
          requires a null receipt.</li>
        <li>Process a valid batch in input order. A 409 conflict rolls back the entire batch.
          Ignored events do not consume their IDs.</li>
        <li>Event IDs are global within a session. An exact replay is ignored; the same ID with
          different compact canonical JSON conflicts.</li>
      </ul>
      <p>Use these transitions for a ready node and its current key:</p>
      <div class="table-responsive">
        <table class="table table-sm table-bordered">
          <thead><tr><th>Previous state</th><th>Incoming event</th><th>Result</th></tr></thead>
          <tbody>
            <tr><td>none</td><td><code>started</code>, attempt 1</td><td>accept</td></tr>
            <tr><td>none</td><td>completion or attempt &gt; 1</td><td>ignore</td></tr>
            <tr><td><code>started(n)</code></td><td><code>succeeded | retryable_failed | terminal_failed</code>, attempt n</td><td>accept</td></tr>
            <tr><td><code>retryable_failed(n)</code></td><td><code>started</code>, attempt n+1</td><td>accept</td></tr>
            <tr><td>non-cached state</td><td>lower attempt</td><td>ignore</td></tr>
            <tr><td><code>started</code> / <code>retryable_failed</code></td><td>other transition</td><td><code>STATUS_CONFLICT</code></td></tr>
            <tr><td>succeeded/current cache</td><td>success, different artifact</td><td><code>EVIDENCE_CONFLICT</code></td></tr>
            <tr><td>succeeded/current cache</td><td>any other new event</td><td><code>STATUS_CONFLICT</code></td></tr>
            <tr><td><code>terminal_failed</code></td><td>any new valid event</td><td><code>STATUS_CONFLICT</code></td></tr>
          </tbody>
        </table>
      </div>
      <p>Ignore a wrong revision, node, or key; an unavailable parent; invalid status, artifact, or
        receipt; and an invalid attempt. Permanently bind a successful key to its first artifact
        and event ID.</p>

      <h5 class="mt-4">Response</h5>
      <pre><code class="language-json">{
  "revision": 1,
  "acceptedEventIds": [],
  "ignoredEventIds": [],
  "nodes": [{
    "node": "verify_data",
    "action": "reuse|rerun|block",
    "reasonCodes": [],
    "dependencyDigests": {},
    "triggeringEventIds": []
  }]
}</code></pre>
      <p><code>dependencyDigests</code> contains the named inputs plus <code>cacheKey</code>. Preserve
        input order for event IDs and DAG order for nodes. Each node has exactly one reason:</p>
      <ul>
        <li>cached: <code>reuse / CACHE_HIT</code>, triggered by its immutable success event;</li>
        <li>ready without cache: <code>rerun / CACHE_MISS</code> or
          <code>rerun / RETRYABLE_FAILURE</code>;</li>
        <li>running: <code>block / RUNNING</code>, triggered by its start event;</li>
        <li>terminal: <code>block / TERMINAL_FAILURE</code>, then descendants use
          <code>block / UPSTREAM_TERMINAL</code>;</li>
        <li>other descendants of a pending node: <code>block / UPSTREAM_PENDING</code>.</li>
      </ul>
      <p>HTTP 409 returns exactly <code>{"error":"&lt;code&gt;"}</code>. Codes are
        <code>INVALID_REQUEST, INVALID_EVENT, EVENT_ID_CONFLICT, REVISION_CONFLICT,
        EVIDENCE_CONFLICT, STATUS_CONFLICT</code>.</p>
      <p><strong>Example:</strong>
        <code>started(1) → retryable_failed(1) → started(2) → succeeded(2)</code> is valid; success
        without the first start is ignored. Persist readback for the same session and never share
        state across sessions.</p>
      <p class="text-muted"><strong>Mark split:</strong> 0.40 cache/dependencies; 0.40
        event ordering/transitions; 0.35 receipts/terminal; 0.175 immutable atomic evidence;
        0.175 session persistence.</p>

      <hr class="my-4">
      <label for="${i}" class="form-label"><strong>Public service base URL</strong></label>
      <input type="url" id="${i}" name="${i}" class="form-control font-monospace"
        placeholder="https://your-service.example.workers.dev">
      <p class="form-text">Enter the public base URL of your service. The grader will call
        <code>POST /pipeline</code>.</p>
    </div>`;return{id:i,title:a,weight:c,question:m,answer:async d=>{let e=String(d||"").trim(),o;try{o=new URL(e)}catch{throw new Error("Enter a valid public service URL.")}if(!/^https?:$/.test(o.protocol))throw new Error("Use an http/https URL.");let n=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:e,weight:c,questionId:i})}),t=await n.json();if(!n.ok)throw new Error(t.error||"Unable to verify the service.");return t}}}var pe=S(()=>{"use strict"});var ue={};M(ue,{default:()=>It});import{html as _t}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function It({user:r,weight:c=1}){let i="q-verifiable-model-bundle-server",a="Publish a Verifiable Model Bundle and Model Card",m=_t`
    <div class="mb-3">
      <p>Build a deterministic verifier for an untrusted UTF-8 model bundle.</p>
      <p><strong>Endpoint:</strong> <code>POST /verify-bundle</code>. Accept and return
        <code>application/json</code>.</p>

      <h5 class="mt-4">Request</h5>
      <pre><code class="language-json">{
  "policy": {
    "requiredSlices": ["critical"],
    "license": "...",
    "intendedUse": "...",
    "limitations": "..."
  },
  "files": { "filename": "UTF-8 string" }
}</code></pre>
      <p><code>requiredSlices</code> is a non-empty array of unique non-empty strings. The other three
        policy fields are non-empty strings.</p>
      <p>The required files are:</p>
      <ul>
        <li><code>README.md</code></li>
        <li><code>training_manifest.json</code></li>
        <li><code>evaluation.json</code></li>
        <li><code>inventory.json</code></li>
        <li><code>adapter_model.safetensors</code></li>
        <li><code>adapter_config.json</code></li>
      </ul>

      <h5 class="mt-4">Verification rules</h5>
      <ol>
        <li><code>inventory.json</code> is a compact JSON array listing every file except itself, with
          no extra files, sorted by UTF-8 filename. Entries have exact key order
          <code>name,bytes,sha256</code>. Recompute exact UTF-8 bytes and lowercase SHA-256.
          <code>inventoryDigest</code> hashes the exact compact JSON of this recomputed array.</li>
        <li>Extra files are invalid. Weight extensions
          <code>.bin, .pt, .pth, .pkl, .pickle</code> are unsafe.</li>
        <li><code>adapter_config.json</code> is an object with a positive safe-integer
          <code>r</code> and a non-empty unique string array <code>target_modules</code>. Extra config
          properties are allowed. This verifies file identity and schema, not framework-level
          safetensors loadability.</li>
        <li>The training manifest is an object with an immutable 40-lowercase-hex base revision and
          non-empty
          <code>task</code>, <code>datasetDigest</code>, <code>codeDigest</code>,
          <code>trainingConfigDigest</code>, <code>modelArtifactDigest</code>, and
          <code>evaluationArtifactDigest</code>.</li>
        <li>Recompute the last two digests from <code>adapter_model.safetensors</code> and the exact
          bytes of <code>evaluation.json</code>.</li>
        <li><code>evaluation.json</code> is an object that binds that model digest. Its aggregate and
          every required slice are finite in <code>[0,1]</code>. Extra evaluation properties and
          non-required slices are allowed.</li>
      </ol>

      <h5 class="mt-4">Model card</h5>
      <p><code>README.md</code> must contain exactly one marker with the literal delimiters shown:</p>
      <pre><code class="language-html">&lt;!-- tds-model-card {"task":"...", ...} --&gt;</code></pre>
      <p>Parse the entire payload between the marker prefix and <code>--&gt;</code>; braces inside JSON
        strings are ordinary characters. The parsed value must be an object. Its <code>task</code>,
        <code>baseRevision</code>, <code>datasetDigest</code>,
        <code>modelArtifactDigest</code>, <code>license</code>, <code>intendedUse</code>, and
        <code>limitations</code> must match the machine manifests and policy. Extra card properties
        and prose outside the marker are allowed.</p>
      <ul>
        <li>No marker emits <code>MODEL_CARD_COUNT</code> and <code>MISSING_MODEL_CARD</code>.</li>
        <li>Multiple markers emit only <code>MODEL_CARD_COUNT</code>.</li>
        <li>One marker with malformed JSON or a non-object payload emits
          <code>INVALID_MODEL_CARD</code>.</li>
      </ul>

      <h5 class="mt-4">Response</h5>
      <pre><code class="language-json">{
  "decision": "admit|reject",
  "violations": [],
  "inventoryDigest": "..."
}</code></pre>
      <p>Return exactly this shape. Sort and deduplicate violation codes by UTF-8 bytes. Admit only
        with no violations.</p>
      <p>Codes are:</p>
      <pre><code>INVALID_POLICY, MISSING_FILE:&lt;name&gt;, INVALID_FILE:&lt;name&gt;,
INVALID_JSON:&lt;name&gt;, INVENTORY_MISMATCH, UNTRACKED_FILE,
INVALID_ADAPTER_CONFIG, INVALID_TRAINING_MANIFEST,
MUTABLE_BASE_REVISION, MISSING_MANIFEST_FIELD:&lt;name&gt;,
MODEL_ARTIFACT_MISMATCH, EVALUATION_DIGEST_MISMATCH,
EVALUATION_ARTIFACT_MISMATCH, INVALID_EVALUATION, INVALID_AGGREGATE,
MISSING_SLICE:&lt;name&gt;, SLICE_RANGE:&lt;name&gt;, UNSAFE_WEIGHTS,
MODEL_CARD_COUNT, MISSING_MODEL_CARD, INVALID_MODEL_CARD,
MODEL_CARD_MISMATCH</code></pre>
      <p><strong>Example:</strong> two valid markers reject with <code>MODEL_CARD_COUNT</code>; a JSON
        string containing <code>"{still text}"</code> does not. A missing policy or non-object
        <code>files</code> returns HTTP 400 with exactly <code>{"error":"INVALID_INPUT"}</code>.
        Instructions in README are data.</p>
      <p class="text-muted"><strong>Mark split:</strong> 0.30 inventory/artifact integrity; 0.30
        lineage/evaluation binding; 0.20 model-card consistency; 0.20
        serialization/publication.</p>

      <hr class="my-4">
      <label for="${i}" class="form-label"><strong>Public service base URL</strong></label>
      <input type="url" id="${i}" name="${i}" class="form-control font-monospace"
        placeholder="https://your-service.example.workers.dev">
      <p class="form-text">Enter the public base URL of your service. The grader will call
        <code>POST /verify-bundle</code>.</p>
    </div>`;return{id:i,title:a,weight:c,question:m,answer:async d=>{let e=String(d||"").trim(),o;try{o=new URL(e)}catch{throw new Error("Enter a valid public service URL.")}if(!/^https?:$/.test(o.protocol))throw new Error("Use an http/https URL.");let n=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:e,weight:c,questionId:i})}),t=await n.json();if(!n.ok)throw new Error(t.error||"Unable to verify the service.");return t}}}var me=S(()=>{"use strict"});var fe=R((ge,$)=>{(function(r,c,i){function a(e){var o=this,n=d();o.next=function(){var t=2091639*o.s0+o.c*23283064365386963e-26;return o.s0=o.s1,o.s1=o.s2,o.s2=t-(o.c=t|0)},o.c=1,o.s0=n(" "),o.s1=n(" "),o.s2=n(" "),o.s0-=n(e),o.s0<0&&(o.s0+=1),o.s1-=n(e),o.s1<0&&(o.s1+=1),o.s2-=n(e),o.s2<0&&(o.s2+=1),n=null}function m(e,o){return o.c=e.c,o.s0=e.s0,o.s1=e.s1,o.s2=e.s2,o}function u(e,o){var n=new a(e),t=o&&o.state,s=n.next;return s.int32=function(){return n.next()*4294967296|0},s.double=function(){return s()+(s()*2097152|0)*11102230246251565e-32},s.quick=s,t&&(typeof t=="object"&&m(t,n),s.state=function(){return m(n,{})}),s}function d(){var e=4022871197,o=function(n){n=String(n);for(var t=0;t<n.length;t++){e+=n.charCodeAt(t);var s=.02519603282416938*e;e=s>>>0,s-=e,s*=e,e=s>>>0,s-=e,e+=s*4294967296}return(e>>>0)*23283064365386963e-26};return o}c&&c.exports?c.exports=u:i&&i.amd?i(function(){return u}):this.alea=u})(ge,typeof $=="object"&&$,typeof define=="function"&&define)});var ye=R((he,H)=>{(function(r,c,i){function a(d){var e=this,o="";e.x=0,e.y=0,e.z=0,e.w=0,e.next=function(){var t=e.x^e.x<<11;return e.x=e.y,e.y=e.z,e.z=e.w,e.w^=e.w>>>19^t^t>>>8},d===(d|0)?e.x=d:o+=d;for(var n=0;n<o.length+64;n++)e.x^=o.charCodeAt(n)|0,e.next()}function m(d,e){return e.x=d.x,e.y=d.y,e.z=d.z,e.w=d.w,e}function u(d,e){var o=new a(d),n=e&&e.state,t=function(){return(o.next()>>>0)/4294967296};return t.double=function(){do var s=o.next()>>>11,l=(o.next()>>>0)/4294967296,p=(s+l)/(1<<21);while(p===0);return p},t.int32=o.next,t.quick=t,n&&(typeof n=="object"&&m(n,o),t.state=function(){return m(o,{})}),t}c&&c.exports?c.exports=u:i&&i.amd?i(function(){return u}):this.xor128=u})(he,typeof H=="object"&&H,typeof define=="function"&&define)});var ve=R((be,V)=>{(function(r,c,i){function a(d){var e=this,o="";e.next=function(){var t=e.x^e.x>>>2;return e.x=e.y,e.y=e.z,e.z=e.w,e.w=e.v,(e.d=e.d+362437|0)+(e.v=e.v^e.v<<4^(t^t<<1))|0},e.x=0,e.y=0,e.z=0,e.w=0,e.v=0,d===(d|0)?e.x=d:o+=d;for(var n=0;n<o.length+64;n++)e.x^=o.charCodeAt(n)|0,n==o.length&&(e.d=e.x<<10^e.x>>>4),e.next()}function m(d,e){return e.x=d.x,e.y=d.y,e.z=d.z,e.w=d.w,e.v=d.v,e.d=d.d,e}function u(d,e){var o=new a(d),n=e&&e.state,t=function(){return(o.next()>>>0)/4294967296};return t.double=function(){do var s=o.next()>>>11,l=(o.next()>>>0)/4294967296,p=(s+l)/(1<<21);while(p===0);return p},t.int32=o.next,t.quick=t,n&&(typeof n=="object"&&m(n,o),t.state=function(){return m(o,{})}),t}c&&c.exports?c.exports=u:i&&i.amd?i(function(){return u}):this.xorwow=u})(be,typeof V=="object"&&V,typeof define=="function"&&define)});var _e=R((we,G)=>{(function(r,c,i){function a(d){var e=this;e.next=function(){var n=e.x,t=e.i,s,l,p;return s=n[t],s^=s>>>7,l=s^s<<24,s=n[t+1&7],l^=s^s>>>10,s=n[t+3&7],l^=s^s>>>3,s=n[t+4&7],l^=s^s<<7,s=n[t+7&7],s=s^s<<13,l^=s^s<<9,n[t]=l,e.i=t+1&7,l};function o(n,t){var s,l,p=[];if(t===(t|0))l=p[0]=t;else for(t=""+t,s=0;s<t.length;++s)p[s&7]=p[s&7]<<15^t.charCodeAt(s)+p[s+1&7]<<13;for(;p.length<8;)p.push(0);for(s=0;s<8&&p[s]===0;++s);for(s==8?l=p[7]=-1:l=p[s],n.x=p,n.i=0,s=256;s>0;--s)n.next()}o(e,d)}function m(d,e){return e.x=d.x.slice(),e.i=d.i,e}function u(d,e){d==null&&(d=+new Date);var o=new a(d),n=e&&e.state,t=function(){return(o.next()>>>0)/4294967296};return t.double=function(){do var s=o.next()>>>11,l=(o.next()>>>0)/4294967296,p=(s+l)/(1<<21);while(p===0);return p},t.int32=o.next,t.quick=t,n&&(n.x&&m(n,o),t.state=function(){return m(o,{})}),t}c&&c.exports?c.exports=u:i&&i.amd?i(function(){return u}):this.xorshift7=u})(we,typeof G=="object"&&G,typeof define=="function"&&define)});var Ae=R((Ie,W)=>{(function(r,c,i){function a(d){var e=this;e.next=function(){var n=e.w,t=e.X,s=e.i,l,p;return e.w=n=n+1640531527|0,p=t[s+34&127],l=t[s=s+1&127],p^=p<<13,l^=l<<17,p^=p>>>15,l^=l>>>12,p=t[s]=p^l,e.i=s,p+(n^n>>>16)|0};function o(n,t){var s,l,p,h,_,b=[],N=128;for(t===(t|0)?(l=t,t=null):(t=t+"\0",l=0,N=Math.max(N,t.length)),p=0,h=-32;h<N;++h)t&&(l^=t.charCodeAt((h+32)%t.length)),h===0&&(_=l),l^=l<<10,l^=l>>>15,l^=l<<4,l^=l>>>13,h>=0&&(_=_+1640531527|0,s=b[h&127]^=l+_,p=s==0?p+1:0);for(p>=128&&(b[(t&&t.length||0)&127]=-1),p=127,h=512;h>0;--h)l=b[p+34&127],s=b[p=p+1&127],l^=l<<13,s^=s<<17,l^=l>>>15,s^=s>>>12,b[p]=l^s;n.w=_,n.X=b,n.i=p}o(e,d)}function m(d,e){return e.i=d.i,e.w=d.w,e.X=d.X.slice(),e}function u(d,e){d==null&&(d=+new Date);var o=new a(d),n=e&&e.state,t=function(){return(o.next()>>>0)/4294967296};return t.double=function(){do var s=o.next()>>>11,l=(o.next()>>>0)/4294967296,p=(s+l)/(1<<21);while(p===0);return p},t.int32=o.next,t.quick=t,n&&(n.X&&m(n,o),t.state=function(){return m(o,{})}),t}c&&c.exports?c.exports=u:i&&i.amd?i(function(){return u}):this.xor4096=u})(Ie,typeof W=="object"&&W,typeof define=="function"&&define)});var Ee=R((Te,B)=>{(function(r,c,i){function a(d){var e=this,o="";e.next=function(){var t=e.b,s=e.c,l=e.d,p=e.a;return t=t<<25^t>>>7^s,s=s-l|0,l=l<<24^l>>>8^p,p=p-t|0,e.b=t=t<<20^t>>>12^s,e.c=s=s-l|0,e.d=l<<16^s>>>16^p,e.a=p-t|0},e.a=0,e.b=0,e.c=-1640531527,e.d=1367130551,d===Math.floor(d)?(e.a=d/4294967296|0,e.b=d|0):o+=d;for(var n=0;n<o.length+20;n++)e.b^=o.charCodeAt(n)|0,e.next()}function m(d,e){return e.a=d.a,e.b=d.b,e.c=d.c,e.d=d.d,e}function u(d,e){var o=new a(d),n=e&&e.state,t=function(){return(o.next()>>>0)/4294967296};return t.double=function(){do var s=o.next()>>>11,l=(o.next()>>>0)/4294967296,p=(s+l)/(1<<21);while(p===0);return p},t.int32=o.next,t.quick=t,n&&(typeof n=="object"&&m(n,o),t.state=function(){return m(o,{})}),t}c&&c.exports?c.exports=u:i&&i.amd?i(function(){return u}):this.tychei=u})(Te,typeof B=="object"&&B,typeof define=="function"&&define)});var xe=R(()=>{});var Le=R((Se,q)=>{(function(r,c,i){var a=256,m=6,u=52,d="random",e=i.pow(a,m),o=i.pow(2,u),n=o*2,t=a-1,s;function l(g,y,T){var w=[];y=y==!0?{entropy:!0}:y||{};var f=b(_(y.entropy?[g,x(c)]:g??N(),3),w),v=new p(w),I=function(){for(var E=v.g(m),A=e,C=0;E<o;)E=(E+C)*a,A*=a,C=v.g(1);for(;E>=n;)E/=2,A/=2,C>>>=1;return(E+C)/A};return I.int32=function(){return v.g(4)|0},I.quick=function(){return v.g(4)/4294967296},I.double=I,b(x(v.S),c),(y.pass||T||function(E,A,C,D){return D&&(D.S&&h(D,v),E.state=function(){return h(v,{})}),C?(i[d]=E,A):E})(I,f,"global"in y?y.global:this==i,y.state)}function p(g){var y,T=g.length,w=this,f=0,v=w.i=w.j=0,I=w.S=[];for(T||(g=[T++]);f<a;)I[f]=f++;for(f=0;f<a;f++)I[f]=I[v=t&v+g[f%T]+(y=I[f])],I[v]=y;(w.g=function(E){for(var A,C=0,D=w.i,j=w.j,O=w.S;E--;)A=O[D=t&D+1],C=C*a+O[t&(O[D]=O[j=t&j+A])+(O[j]=A)];return w.i=D,w.j=j,C})(a)}function h(g,y){return y.i=g.i,y.j=g.j,y.S=g.S.slice(),y}function _(g,y){var T=[],w=typeof g,f;if(y&&w=="object")for(f in g)try{T.push(_(g[f],y-1))}catch{}return T.length?T:w=="string"?g:g+"\0"}function b(g,y){for(var T=g+"",w,f=0;f<T.length;)y[t&f]=t&(w^=y[t&f]*19)+T.charCodeAt(f++);return x(y)}function N(){try{var g;return s&&(g=s.randomBytes)?g=g(a):(g=new Uint8Array(a),(r.crypto||r.msCrypto).getRandomValues(g)),x(g)}catch{var y=r.navigator,T=y&&y.plugins;return[+new Date,r,T,r.screen,x(c)]}}function x(g){return String.fromCharCode.apply(0,g)}if(b(i.random(),c),typeof q=="object"&&q.exports){q.exports=l;try{s=xe()}catch{}}else typeof define=="function"&&define.amd?define(function(){return l}):i["seed"+d]=l})(typeof self<"u"?self:Se,[],Math)});var P=R((Zt,Ne)=>{var At=fe(),Tt=ye(),Et=ve(),xt=_e(),St=Ae(),Lt=Ee(),k=Le();k.alea=At;k.xor128=Tt;k.xorwow=Et;k.xorshift7=xt;k.xor4096=St;k.tychei=Lt;Ne.exports=k});var ke={};M(ke,{default:()=>Rt});import{html as Nt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Ct(r){let c=(0,De.default)(`${r}#q-lora-quant-budget-server`),i=Ce[Math.floor(c()*Ce.length)],a=24+Math.floor(c()*9),m=i/64,u=4*i,e={model_type:"llama",hidden_size:i,num_hidden_layers:a,num_attention_heads:m,intermediate_size:u,vocab_size:32e3},o=[];for(let n=0;n<a;n++)if(c()<.25)o.push({layer_idx:n,freeze:!0,target_modules:[],lora_rank:0,lora_alpha:0});else{let s=Me[Math.floor(c()*Me.length)],l=Re[Math.floor(c()*Re.length)],p=l*2;o.push({layer_idx:n,freeze:!1,target_modules:s,lora_rank:l,lora_alpha:p})}return{base_config:e,layers:o}}function Mt(r){try{return btoa(unescape(encodeURIComponent(r)))}catch{return""}}async function Rt({user:r,weight:c=2,version:i=""}){let a="q-lora-quant-budget-server",m="Per-Layer QLoRA Adapter Synthesis & Parameter Audit",u=r&&r.email||"",d=Ct(u),e=JSON.stringify(d,null,2),n=`data:application/json;charset=utf-8;base64,${Mt(e)}`,t=`lora_config_${u.split("@")[0]||"user"}.json`,s=d.layers.filter(h=>!h.freeze).length,l=Nt`
    <div class="mb-3">
      <p class="lead">
        Download your custom LLM layer specification JSON artifact, construct a random-initialized PyTorch/PEFT model, apply per-layer LoRA adapter configurations, and report the verified trainable parameter count and adapter disk size.
      </p>

      <div class="card mb-3 border-info">
        <div class="card-header bg-info text-dark fw-bold">
          Scenario
        </div>
        <div class="card-body">
          <p class="card-text">
            <strong>The Problem:</strong> Applying uniform global LoRA configurations ($r=16$ across all layers) wastes GPU memory on shallow feature layers while under-parameterizing critical deep reasoning layers.
          </p>
          <p class="card-text">
            <strong>Why Layer-Wise PEFT Adaptation (MLOps & FinOps)?</strong> Modern LLM fine-tuning pipelines customize LoRA rank <code>r</code>, scaling factor <code>&alpha;</code>, and target projection modules (<code>q_proj</code>, <code>v_proj</code>, <code>gate_proj</code>, <code>up_proj</code>, <code>down_proj</code>) on a per-layer basis. Freezing non-essential layers entirely maximizes parameter efficiency within strict hardware budgets.
          </p>
          <p class="card-text mb-0">
            <strong>Why Physical Model & Artifact Verification Matters:</strong> In production MLOps, calculating theoretical formulas is insufficient—you must verify that Hugging Face PEFT's runtime parameter resolution (<code>model.print_trainable_parameters()</code>) and saved adapter artifact byte sizes (<code>model.save_pretrained()</code>) match deployment specifications.
          </p>
        </div>
      </div>

      <div class="card bg-dark text-white mb-3">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <span class="text-muted" style="text-transform:uppercase;letter-spacing:.05em;font-size:.75rem">
              Assigned Configuration Artifact
            </span>
            <a
              class="btn btn-sm btn-outline-info font-monospace"
              href="${n}"
              download="${t}"
            >
              <i class="bi bi-download me-1"></i> Download ${t}
            </a>
          </div>
          <table class="table table-sm table-dark mb-0 style="font-size:0.85rem">
            <tbody>
              <tr><td>Base Model Type</td><td><code>${d.base_config.model_type}</code></td></tr>
              <tr><td>Hidden Size / Intermediate Size</td><td><code>${d.base_config.hidden_size} / ${d.base_config.intermediate_size}</code></td></tr>
              <tr><td>Total Layers / Active Layers</td><td><code>${d.base_config.num_hidden_layers} Total (${s} Active, ${d.base_config.num_hidden_layers-s} Frozen)</code></td></tr>
              <tr><td>Vocab Size</td><td><code>${d.base_config.vocab_size}</code></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="mb-3">
        <label for="${a}" class="form-label">
          <strong>Submit Results (JSON Format)</strong>
        </label>
        <textarea
          class="form-control font-monospace"
          id="${a}"
          name="${a}"
          rows="6"
          placeholder='{\n  "trainable_params": 14680064,\n  "adapter_file_size_bytes": 58721280\n}'
        ></textarea>
        <div class="form-text text-muted">
          Submit a valid JSON object containing <code>trainable_params</code> (integer count from <code>print_trainable_parameters()</code>) and <code>adapter_file_size_bytes</code> (disk byte size of the saved adapter file).
        </div>
      </div>
    </div>
  `;return{id:a,title:m,weight:c,question:l,answer:async h=>{let _=String(h||"").trim();if(!_)throw new Error("Please enter your JSON response.");let b;try{b=JSON.parse(_)}catch{throw new Error("Invalid JSON format. Submit a valid JSON object containing trainable_params and adapter_file_size_bytes.")}let N=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:b,weight:c,questionId:a,version:i})}),x=await N.json();if(!N.ok)throw new Error(x.error||"Verification failed.");return x}}}var De,Ce,Me,Re,Oe=S(()=>{"use strict";De=z(P(),1),Ce=[2048,3072,4096],Me=[["q_proj","v_proj"],["q_proj","k_proj","v_proj","o_proj"],["q_proj","v_proj","gate_proj","up_proj"],["q_proj","k_proj","v_proj","o_proj","gate_proj","up_proj","down_proj"]],Re=[4,8,16,32]});function Pe(r){let c=0,i=0;for(;c===0;)c=r();for(;i===0;)i=r();return Math.sqrt(-2*Math.log(c))*Math.cos(2*Math.PI*i)}function ze(r,c=""){let i=`${(r||"").trim().toLowerCase()}#q-mlflow-fingerprint-server#${c}`,a=(0,Fe.default)(i),m=200,u=8,d=[];for(let f=0;f<m;f++){let v=[];for(let I=0;I<u;I++)v.push(Number(((a()-.5)*4).toFixed(6)));d.push(v)}let e=Array.from({length:u},()=>Number(((a()-.5)*2).toFixed(4))),o=Number(((a()-.5)*2).toFixed(4)),n=Array.from({length:u},()=>Number((.05+.1*a()).toFixed(4))),t=[];for(let f=0;f<m;f++){let v=d[f],I=o;for(let A=0;A<u;A++)I+=e[A]*v[A];I+=.8*Math.sin(v[0]*v[1]),I+=.5*(v[2]*v[2]-v[3]),I+=.6*Math.tanh(v[4]+v[5]);let E=0;for(let A=0;A<u;A++)E+=n[A]*(a()-.5);I+=E,t.push(Number(I.toFixed(6)))}let s=Number((.01+a()*.05).toFixed(4)),l=[16,32,64][Math.floor(a()*3)],p=150+Math.floor(a()*251),h=Number((.001+a()*.02).toFixed(4)),_=Ue[Math.floor(a()*Ue.length)],b={name:_};_==="SGD"?(b.momentum=Number((.8+.15*a()).toFixed(2)),b.dampening=0,b.nesterov=!1):_==="AdamW"?(b.beta1=.9,b.beta2=Number((.99+.009*a()).toFixed(4)),b.eps=1e-8):_==="RMSprop"&&(b.alpha=Number((.9+.09*a()).toFixed(3)),b.eps=1e-8,b.momentum=a()>.5?Number((.8+.1*a()).toFixed(2)):0);let N=1e4+Math.floor(a()*89999),x=je[Math.floor(a()*je.length)],g=[],y=0;if(x==="kaiming_uniform"){let f=Math.sqrt(1/u);for(let v=0;v<u;v++)g.push(Number(((a()-.5)*2*f).toFixed(6)));y=Number(((a()-.5)*2*f).toFixed(6))}else if(x==="xavier_normal"){let f=Math.sqrt(2/(u+1));for(let v=0;v<u;v++)g.push(Number((f*Pe(a)).toFixed(6)));y=Number((f*Pe(a)).toFixed(6))}else{for(let f=0;f<u;f++)g.push(Number(((a()-.5)*1.5).toFixed(6)));y=Number(((a()-.5)*1.5).toFixed(6))}let T=qe[Math.floor(a()*qe.length)],w={type:T};return T==="cosine"?w.lr_min=Number((s*.1).toFixed(6)):(w.step_size=Math.floor(p/3),w.gamma=.5),{dataset:{X:d,y:t},hyperparameters:{lr:s,batch_size:l,num_steps:p,weight_decay:h,optimizer:b},initialization:{torch_seed:N,scheme:x,initial_weights:{W:g,b:y}},lr_schedule:w}}var Fe,Ue,je,qe,$e=S(()=>{"use strict";Fe=z(P(),1),Ue=["SGD","AdamW","RMSprop"],je=["kaiming_uniform","xavier_normal","custom_seeded"],qe=["cosine","step"]});var He={};M(He,{default:()=>Ot});import{html as Dt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function kt(r){try{return btoa(unescape(encodeURIComponent(r)))}catch{return""}}async function Ot({user:r,weight:c=2.5,version:i=""}){let a="q-mlflow-fingerprint-server",m="PyTorch Training Loop Fidelity & Local MLflow Fingerprint Audit",u=r&&r.email||"",d=ze(u,i),e=JSON.stringify(d,null,2),n=`data:application/json;charset=utf-8;base64,${kt(e)}`,t=`mlflow_config_${u.split("@")[0]||"user"}.json`,s=Dt`
    <div class="mb-3">
      <p class="lead">
        Download your unique dataset and training configuration file, write an exact PyTorch training loop, log step-level metrics to a local <strong>MLflow tracking server</strong>, and report your run's fingerprint statistics.
      </p>

      <!-- Educational Context: What is MLflow? -->
      <div class="card mb-3 border">
        <div class="card-body">
          <h5 class="card-title"><i class="bi bi-info-circle"></i> <strong>What is MLflow & Why Experiment Tracking Matters</strong></h5>
          <p class="card-text mb-2">
            <strong>MLflow</strong> is an open-source MLOps platform used to manage the machine learning lifecycle. Its core <strong>MLflow Tracking</strong> module logs parameters (like learning rates or batch sizes), code versions, metrics (like training loss per step), and output artifacts during training runs.
          </p>
          <p class="card-text mb-0">
            By logging step-level metrics using <code>mlflow.log_metric("loss", value, step=i)</code> to a local directory (<code>file:./mlruns</code>) or tracking server, engineers create a <strong>verifiable audit trail</strong>. This ensures model reproducibility and allows teams to inspect full loss trajectories rather than trusting single static numbers.
          </p>
        </div>
      </div>

      <!-- Scenario Story -->
      <div class="card mb-3 border">
        <div class="card-body">
          <h5 class="card-title"><i class="bi bi-shield-check"></i> <strong>Scenario: Verifying Training Loop Fidelity</strong></h5>
          <p class="card-text mb-2">
            <strong>The Problem:</strong> You are an MLOps Audit Lead evaluating automated model training pipelines. When contractors or LLM agents submit training scripts, generic prompts like <em>"Write me an MLflow training script"</em> generate stock scripts that fail to apply custom per-student weight initializations, non-default optimizers (SGD+momentum, AdamW, or RMSprop), or per-step learning rate schedules.
          </p>
          <p class="card-text mb-0">
            <strong>The Solution:</strong> To prove a genuine, exact step-by-step PyTorch training run executed, your audit harness requires running the exact training loop on your assigned dataset, logging every step to local MLflow, and submitting your run's fingerprint: the <strong>final step loss</strong>, the 32-character MLflow <strong>run_id</strong>, and the <strong>mean of the trailing 10 steps' losses</strong>.
          </p>
        </div>
      </div>

      <!-- Download Button Card -->
      <div class="card mb-3 border">
        <div class="card-header fw-bold">
          <i class="bi bi-file-earmark-code"></i> Download Dataset & Hyperparameters
        </div>
        <div class="card-body">
          <p class="card-text">
            Your unique dataset (<code>X</code> matrix of shape 200 × 8, <code>y</code> vector of length 200) contains feature noise scales and non-linear interactions. Generic closed-form models or stock training scripts will fail — you must train PyTorch with your specified optimizer, weight initialization, and per-step LR schedule.
          </p>
          <a href="${n}" download="${t}" class="btn btn-primary fw-bold">
            <i class="bi bi-download"></i> Download ${t}
          </a>
        </div>
      </div>

      <!-- Technical Requirements -->
      <div class="card mb-3 border">
        <div class="card-body">
          <h5 class="card-title"><strong>Training Loop Requirements</strong></h5>
          <ol class="mb-2 text-white">
            <li>
              <strong>Dataset & Batching:</strong> Load <code>X</code> and <code>y</code> from your downloaded JSON. For each step <code>i</code> from <code>0</code> to <code>num_steps - 1</code>, select mini-batch indices using cyclic sequential slicing:
              <code>idx = (i * batch_size) % N</code>, batching <code>batch_size</code> rows <code>indices = [(idx + j) % N for j in range(batch_size)]</code>.
            </li>
            <li>
              <strong>Model Initialization:</strong> Construct a single Linear layer model <code>y_hat = X @ W + b</code> (8 input features, 1 output). Initialize weights using <code>initial_weights</code> provided in your JSON config (or set <code>model.weight.data</code> and <code>model.bias.data</code> directly from <code>config['initialization']['initial_weights']</code>).
            </li>
            <li>
              <strong>Optimizer & Schedule:</strong> Configure the exact optimizer specified in <code>config['hyperparameters']['optimizer']</code> (SGD, AdamW, or RMSprop) with the provided <code>lr</code>, <code>weight_decay</code>, and optimizer hyper-params. Update the optimizer's learning rate <strong>per step</strong> according to <code>config['lr_schedule']</code>:
              <ul>
                <li>If <code>cosine</code>: <code>lr_i = lr_min + 0.5 * (lr_base - lr_min) * (1 + cos(i * π / num_steps))</code>.</li>
                <li>If <code>step</code>: <code>lr_i = lr_base * (gamma ** floor(i / step_size))</code>.</li>
              </ul>
            </li>
            <li>
              <strong>MLflow Logging:</strong> Set local tracking server (e.g. <code>mlflow.set_tracking_uri("file:./mlruns")</code> or start <code>mlflow ui</code>). Inside a run (<code>with mlflow.start_run() as run:</code>), log the MSE loss at every step:
              <code>mlflow.log_metric("loss", float(loss.item()), step=i)</code>.
            </li>
          </ol>
        </div>
      </div>

      <!-- Submission Format -->
      <div class="card mb-3 border">
        <div class="card-body">
          <h5 class="card-title"><strong>Submission Format</strong></h5>
          <p class="card-text mb-2">
            Submit a JSON object (or paste in the field below) containing:
          </p>
          <pre class="p-2 rounded"><code>{
  "final_loss": 0.12345,
  "run_id": "4f3a8b2c1d9e8f7a6b5c4d3e2f1a0b9c",
  "mean_last_10_loss": 0.12567
}</code></pre>
          <ul>
            <li><code>final_loss</code>: Loss value at the final step (step <code>num_steps - 1</code>).</li>
            <li><code>run_id</code>: The 32-character hex MLflow Run ID (e.g. <code>run.info.run_id</code>).</li>
            <li><code>mean_last_10_loss</code>: Mean of the logged loss values over the last 10 steps (steps <code>num_steps - 10</code> through <code>num_steps - 1</code>).</li>
          </ul>
        </div>
      </div>

      <label for="${a}" class="form-label"><strong>Your Submission JSON</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${a}"
        name="${a}"
        rows="4"
        placeholder='{"final_loss": 0.12345, "run_id": "4f3a8b2c1d9e8f7a6b5c4d3e2f1a0b9c", "mean_last_10_loss": 0.12567}'
      ></textarea>
    </div>
  `;return{id:a,title:m,weight:c,question:s,answer:async p=>{let h=p;if(typeof h=="string")try{h=JSON.parse(h.trim())}catch{throw new Error("Invalid JSON input format. Ensure you submit a valid JSON object.")}if(!h||typeof h!="object")throw new Error("Submission must be a JSON object containing final_loss, run_id, and mean_last_10_loss.");let _=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:h,weight:c,questionId:a,version:i})}),b=await _.json();if(!_.ok)throw new Error(b.error||"Verification failed.");return b}}}var Ve=S(()=>{"use strict";$e()});function Ye(r,c=""){let i=`${(r||"").trim().toLowerCase()}#q-modelcard-carbon-server#${c}`,a=(0,Je.default)(i),m=Ge[Math.floor(a()*Ge.length)],u=Number((12.5+a()*467.5).toFixed(1)),d=1+Math.floor(a()*8),e=We[Math.floor(a()*We.length)],o=Number((1.1+a()*.5).toFixed(2)),n=Be[Math.floor(a()*Be.length)];return{gpu_type:m,gpu_hours:u,num_gpus:d,region:e,power_usage_effectiveness:o,training_type:n}}var Je,J,Y,Ge,We,Be,Xe=S(()=>{"use strict";Je=z(P(),1),J={"NVIDIA A100":400,"NVIDIA V100":300,"NVIDIA T4":70,"NVIDIA H100":700,"NVIDIA L40S":350,"NVIDIA RTX 4090":450},Y={"us-central1":350,"europe-west4":200,"asia-south1":650,"us-east1":420,"europe-north1":120,"ap-southeast1":480},Ge=Object.keys(J),We=Object.keys(Y),Be=["pre-training","fine-tuning"]});var Ke={};M(Ke,{default:()=>jt});import{html as X}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Ut(r){try{return btoa(unescape(encodeURIComponent(r)))}catch{return""}}async function jt({user:r,weight:c=2.5,version:i=""}){let a="q-modelcard-carbon-server",m="Green AI & Hugging Face Model Card Carbon Accounting Audit",u=r&&r.email||"",d=Ye(u,i),e=JSON.stringify(d,null,2),n=`data:application/json;charset=utf-8;base64,${Ut(e)}`,t=`carbon_run_log_${u.split("@")[0]||"user"}.json`,s=X`
    <div class="mb-3">
      <p class="lead">
        Download your assigned GPU training run log, compute total energy (kWh) and carbon emissions (kg CO2eq), format a standard <strong>Hugging Face Model Card YAML frontmatter</strong> block, push it to a free public Hugging Face Hub repository, and submit your repo URL.
      </p>

      <!-- Educational Context -->
      <div class="card mb-3 border">
        <div class="card-body">
          <h5 class="card-title">
            <i class="bi bi-tree"></i> <strong>What is Green AI & Model Card Carbon Accounting?</strong>
          </h5>
          <p class="card-text mb-2">
            Training modern AI models consumes substantial electricity across GPU clusters. <strong>Green AI</strong> practices mandate tracking environmental impact. Hugging Face Model Cards use a standardized YAML metadata block (<code>co2_eq_emissions</code>) so developers, researchers, and enterprise auditors can inspect the carbon footprint of deployed models.
          </p>
          <p class="card-text mb-0">
            Carbon accounting incorporates hardware Thermal Design Power (TDP), datacenter Power Usage Effectiveness (PUE), total GPU runtime, and regional electricity grid carbon intensity.
          </p>
        </div>
      </div>

      <!-- Scenario Story -->
      <div class="card mb-3 border">
        <div class="card-body">
          <h5 class="card-title">
            <i class="bi bi-clipboard-data"></i> <strong>Scenario: Auditing Model Emissions</strong>
          </h5>
          <p class="card-text mb-2">
            <strong>The Task:</strong> You are a Sustainability Engineer reviewing model releases. You must compute total carbon emissions for your assigned training run log and document them on Hugging Face Hub so downstream users can verify your model's environmental metadata.
          </p>
          <p class="card-text mb-0">
            Create a free public Hugging Face model repository (or use an existing public dummy repo), add the required <code>co2_eq_emissions</code> YAML frontmatter block to its <code>README.md</code>, and submit your public repository URL.
          </p>
        </div>
      </div>

      <!-- Reference Tables & Download -->
      <div class="card mb-3 border">
        <div class="card-header fw-bold">
          <i class="bi bi-file-earmark-code"></i> Download Run Log & Reference Tables
        </div>
        <div class="card-body">
          <a href="${n}" download="${t}" class="btn btn-primary fw-bold mb-3">
            <i class="bi bi-download"></i> Download ${t}
          </a>

          <div class="row">
            <div class="col-md-6">
              <h6 class="fw-bold">GPU Thermal Design Power (TDP)</h6>
              <table class="table table-sm table-bordered">
                <thead>
                  <tr class="table-secondary"><th>GPU Model</th><th>TDP (Watts)</th></tr>
                </thead>
                <tbody>
                  ${Object.entries(J).map(([p,h])=>X`<tr><td><code>${p}</code></td><td>${h} W</td></tr>`)}
                </tbody>
              </table>
            </div>
            <div class="col-md-6">
              <h6 class="fw-bold">Grid Carbon Intensity</h6>
              <table class="table table-sm table-bordered">
                <thead>
                  <tr class="table-secondary"><th>Region</th><th>gCO2eq / kWh</th></tr>
                </thead>
                <tbody>
                  ${Object.entries(Y).map(([p,h])=>X`<tr><td><code>${p}</code></td><td>${h} g/kWh</td></tr>`)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Calculation Guide -->
      <div class="card mb-3 border">
        <div class="card-body">
          <h5 class="card-title"><strong>Calculation Guide & Model Card Specification</strong></h5>
          <ol class="mb-3">
            <li>
              <strong>Total Energy (kWh):</strong><br />
              <code>energy_kWh = (gpu_type_TDP_watts * num_gpus * gpu_hours * power_usage_effectiveness) / 1000</code>
            </li>
            <li>
              <strong>Carbon Emissions (kg CO2eq):</strong><br />
              <code>co2_kg = (energy_kWh * region_carbon_intensity_gCO2_per_kWh) / 1000</code>
            </li>
            <li>
              <strong>Hugging Face Model Card Frontmatter:</strong> Create or update <code>README.md</code> in your public Hugging Face repository with the following YAML frontmatter at the very top (rounded <code>emissions</code> to 3 decimal places):
            </li>
          </ol>

          <pre class="p-3 bg-dark text-white rounded"><code>---
co2_eq_emissions:
  emissions: &lt;computed_co2_kg&gt;
  source: codecarbon
  training_type: &lt;training_type_from_log&gt;
  geographical_location: &lt;region_from_log&gt;
  hardware_used: &lt;gpu_type_from_log&gt;
---</code></pre>
        </div>
      </div>

      <!-- Submission Input -->
      <div class="card mb-3 border">
        <div class="card-body">
          <label for="${a}" class="form-label fw-bold">Your Public Hugging Face Repository URL</label>
          <input
            class="form-control font-monospace"
            id="${a}"
            name="${a}"
            type="url"
            placeholder="https://huggingface.co/username/reponame"
          />
        </div>
      </div>
    </div>
  `;return{id:a,title:m,weight:c,question:s,answer:async p=>{let h=String(p||"").trim();if(!h)throw new Error("Enter your public Hugging Face repository URL.");let _=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r.email,quizSign:r.quizSign,response:h,weight:c,questionId:a,version:i})}),b=await _.json();if(!_.ok)throw new Error(b.error||"Verification failed.");return b}}}var Qe=S(()=>{"use strict";Xe()});import{html as U,render as rt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function K(r,c){let i=U`<ol class="mt-3">
    ${r.map(({id:u,title:d,weight:e})=>U`<li><a href="#h${u}">${d}</a> (${e} ${e==1?"mark":"marks"})</li>`)}
  </ol>`,a=[U`<h1 class="display-6">Questions</h1>`,i,...r.map(({id:u,title:d,weight:e,question:o,help:n},t)=>(n&&!Array.isArray(n)&&(n=[n]),U`
        <div class="card my-5" data-question="${u}" id="h${u}">
          <div class="card-header">
            <span class="badge text-bg-primary me-2">${t+1}</span>
            ${d} (${e} ${e==1?"mark":"marks"})
          </div>
          ${n?n.map(s=>U`<div class="card-body border-bottom">${s}</div>`):""}
          <div class="card-body">${o}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${u}">Check</button>
          </div>
        </div>
      `))],m={index:i,questions:a};for(let[u,d]of c)rt(m[d],u)}import{unsafeHTML as it}from"https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js";import{Marked as st}from"https://cdn.jsdelivr.net/npm/marked@13/+esm";var Q="https://tds.s-anand.net",Z=r=>r&&!r.match(/^(https?|mailto):/),ct=new st({renderer:{image(r,c,i){return Z(r)&&(r=`${Q}/${r}`),`<img src="${r}" alt="${i}" ${c?`title="${c}"`:""} class="img-fluid" loading="lazy">`},link(r,c,i){return Z(r)&&(r=`${Q}/${r.endsWith(".md")?`#/${r.replace(/\.md$/,"")}`:r}`),`<a href="${r}" ${c?`title="${c}"`:""} target="_blank">${i}</a>`}}}),L=r=>it(ct.parse(r));async function lo(r,c){let i=[{...await Promise.resolve().then(()=>(te(),ee)).then(a=>a.default({user:r,weight:1.5})),help:[L(`
### Ask AI

- [How do I canonicalize, split, and hash a version-pinned corpus without leakage?](#askai)
      `)]},{...await Promise.resolve().then(()=>(ae(),oe)).then(a=>a.default({user:r,weight:1.5})),help:[L(`
### Ask AI

- [How do I keep model selection separate from final-test admission?](#askai)
      `)]},{...await Promise.resolve().then(()=>(re(),ne)).then(a=>a.default({user:r,weight:1.25})),help:[L(`
### Ask AI

- [How do I promote an MLflow model from artifacts instead of mutable claims?](#askai)
      `)]},{...await Promise.resolve().then(()=>(se(),ie)).then(a=>a.default({user:r,weight:2})),help:[L(`
### Ask AI

- [How do assistant-only loss masks, LoRA targets, and exact resume state work?](#askai)
      `)]},{...await Promise.resolve().then(()=>(de(),ce)).then(a=>a.default({user:r,weight:1.25})),help:[L(`
### Ask AI

- [How do I freeze, measure, and select quantized artifacts under hard constraints?](#askai)
      `)]},{...await Promise.resolve().then(()=>(pe(),le)).then(a=>a.default({user:r,weight:1.5})),help:[L(`
### Ask AI

- [How do content-addressed cache keys and stale event rules control pipeline recovery?](#askai)
      `)]},{...await Promise.resolve().then(()=>(me(),ue)).then(a=>a.default({user:r,weight:1})),help:[L(`
### Ask AI

- [How do I make model-card claims independently verifiable from immutable files?](#askai)
      `)]},{...await Promise.resolve().then(()=>(Oe(),ke)).then(a=>a.default({user:r,weight:2,version:"v1"})),help:[L(`
### Ask AI

- [How do I calculate trainable parameter counts for LoRA matrices across transformer layers?](#askai)
- [What is the difference in VRAM footprint between FP16, INT8, and NF4 quantization in QLoRA?](#askai)
- [How does Adam optimizer state memory scale with trainable parameters vs frozen weights?](#askai)
- [How does activation checkpointing reduce intermediate tensor memory during LLM fine-tuning?](#askai)
- [Why is VRAM budgeting essential before provisioning cloud GPU clusters for fine-tuning?](#askai)
        `)]},{...await Promise.resolve().then(()=>(Ve(),He)).then(a=>a.default({user:r,weight:2.5,version:"v1"})),help:[L(`
### Ask AI

- [How do I log step-level metrics to a local MLflow tracking server in PyTorch?](#askai)
- [How do I apply per-step learning rate decay schedules (CosineAnnealing vs StepLR) in PyTorch?](#askai)
- [What is the difference between PyTorch weight initializations like Kaiming Uniform vs Xavier Normal?](#askai)
- [How do I configure AdamW, SGD with momentum, and RMSprop optimizers with custom hyperparameters?](#askai)
- [Why does step-by-step optimizer floating point math produce unique training loss fingerprints?](#askai)
        `)]},{...await Promise.resolve().then(()=>(Qe(),Ke)).then(a=>a.default({user:r,weight:2.5,version:"v1"})),help:[L(`
### Ask AI

- [How do I calculate total GPU energy consumption (kWh) and carbon emissions (kg CO2eq) for model training?](#askai)
- [What is Power Usage Effectiveness (PUE) and how does datacenter efficiency affect carbon metrics?](#askai)
- [How do I format standard co2_eq_emissions metadata in Hugging Face Model Card YAML frontmatter?](#askai)
- [How do regional grid carbon intensity values (gCO2eq/kWh) impact training location decisions?](#askai)
- [How do I create and push a Model Card README to a public Hugging Face repository?](#askai)
        `)]}];return K(i,c),Object.fromEntries(i.map(({id:a,...m})=>[a,m]))}export{lo as questions};
