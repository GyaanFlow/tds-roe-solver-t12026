var ue=Object.defineProperty;var f=(e,o)=>()=>(e&&(o=e(e=0)),o);var g=(e,o)=>{for(var r in o)ue(e,r,{get:o[r],enumerable:!0})};var M={};g(M,{default:()=>pe});import{html as _}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function pe({user:e,weight:o=4,version:r=""}){let t="q-streetview-geolocation-server",n="Street View OSINT: Where Is This?",l=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(r)}`,i=null,a=null;try{let p=await fetch(l);if(!p.ok)throw new Error(await p.text()||`HTTP ${p.status}`);i=await p.json()}catch(p){a=p instanceof Error?p.message:String(p)}if(!i){let p=_`
      <div class="alert alert-danger" role="alert">
        <strong><i class="bi bi-exclamation-triangle-fill"></i> Could not load this question's data.</strong>
        <p class="mb-0">${a}</p>
        <p class="mb-0">Try reloading the page. If this persists, contact the exam team.</p>
      </div>
    `;return{id:t,title:n,weight:o,question:p,answer:async()=>({correct:!1,message:a})}}let s=`${he}/${i.file}`,d=i.toleranceMetres??100,c=_`
    <div class="mb-3">
      <div style="background:linear-gradient(135deg,#0c2d48 0%,#145da0 100%);border-radius:12px;padding:22px 26px;margin-bottom:20px;color:#e6f3ff;">
        <div style="font-size:11px;letter-spacing:2px;color:#8ecdf7;text-transform:uppercase;margin-bottom:6px;">OSINT · Street View Geolocation</div>
        <div style="font-size:20px;font-weight:700;margin-bottom:8px;">🌍 Where in the world is this?</div>
        <div style="font-size:15px;line-height:1.6;">
          You've been given <strong>one</strong> Street View image below. Using only publicly available
          information (visual clues, reverse image search, road signs, architecture, vegetation, language on
          signage, etc.), identify where it was taken.
        </div>
      </div>

      <img
        src="${s}"
        alt="Street View location to identify"
        loading="lazy"
        style="display:block;max-width:100%;width:100%;border-radius:10px;border:1px solid #dee2e6;margin-bottom:18px;"
      />

      <h5><i class="bi bi-list-check"></i> What to submit</h5>
      <p>
        Enter your answer as <strong>4 comma-separated values, in this order</strong>:
        <code>Place, Country, Latitude, Longitude</code>. This question is
        <strong>all-or-nothing</strong>: there is <strong>no partial credit</strong>. You earn the full
        ${o} ${o==1?"mark":"marks"} only if the place, the country, <em>and</em> the
        coordinates are all correct. Getting the place and country right on their own scores <strong>zero</strong>.
      </p>

      <input
        class="form-control font-monospace"
        id="${t}"
        name="${t}"
        placeholder="California, United States, 37.0902, -119.4179"
        autocomplete="off"
      />

      <div class="alert alert-info mt-3" role="alert">
        <strong><i class="bi bi-info-circle-fill"></i> Grading notes</strong>
        <ul class="mb-0 mt-1">
          <li>Place and country matching ignores case, spacing, and punctuation — but write the full name
            (e.g. "United States", not "USA").</li>
          <li>Latitude/longitude are correct if your pin is within
            <strong>${d} metres</strong> of the true spot. You don't need the exact decimals — get
            the right street corner and you're in. You can write a hemisphere letter
            (e.g. <code>94.5583 W</code>) instead of a minus sign if you prefer.</li>
          <li>Each <kbd>Check</kbd> is graded on the server, so it needs a moment. Your final submission is
            re-verified the same way.</li>
        </ul>
      </div>

      <p class="text-muted">
        Worth <strong>${o} ${o==1?"mark":"marks"}</strong>.
      </p>
    </div>
  `;return{id:t,title:n,weight:o,question:c,answer:async p=>{let w=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:p,weight:o,questionId:t,version:r})}),x=await w.json();if(!w.ok)throw new Error(x.error||"Verification failed.");return x}}}var he,j=f(()=>{"use strict";he="https://files.s-anand.net/pages/tds-roe-2026-05-images"});var D={};g(D,{default:()=>ye});import{html as fe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ye({user:e,weight:o=.2}){let r="q-donate-marks",t="Donate Your Marks",n=fe`
    <div class="mb-3">
      <p>
        This is a small experiment in <strong>trust and collaboration</strong>, worth up to
        <strong>1.5 marks</strong>. You can <strong>donate your marks to up to 3 classmates</strong>. You
        cannot pick yourself, and every email must be a valid <code>@*.study.iitm.ac.in</code> address.
      </p>

      <p class="mb-1"><strong>How the marks work</strong> &mdash; you <em>receive</em> whatever others choose to donate to you:</p>
      <table class="table table-sm table-bordered w-auto">
        <thead>
          <tr><th>You pick&hellip;</th><th>Each person you pick gets</th></tr>
        </thead>
        <tbody>
          <tr><td>1 person</td><td><strong>1.0</strong> mark</td></tr>
          <tr><td>2 people</td><td><strong>0.6</strong> each</td></tr>
          <tr><td>3 people</td><td><strong>0.5</strong> each</td></tr>
        </tbody>
      </table>
      <p>
        Submitting a valid answer (1&ndash;3 valid emails, not yourself) earns you <strong>0.2 marks</strong>
        just for taking part.
      </p>

      <p>
        <strong>You are welcome to barter.</strong> If two of you donate to each other, you each walk away
        with 1 mark. A group of 3 who all donate to each other gets <strong>1.2 each</strong>; a group of 4
        gets <strong>1.5 each</strong> &mdash; the maximum. To earn the most, collaborate as widely as you
        can&hellip; but of course, <em>that requires trust</em>. They have to put your name down too. Will they?
      </p>

      <p>
        <strong>You <em>could</em> cheat</strong>. Make false promises to 10 people, get 10 marks, donate only to some.
        But the list of donations <em>will be made public</em> after the deadline.
      </p>

      <label class="form-label" for="${r}"><strong>Donate to (1&ndash;3 email IDs)</strong></label>
      <textarea class="form-control font-monospace" id="${r}" name="${r}" rows="3"
        placeholder="one@ds.study.iitm.ac.in, two@ds.study.iitm.ac.in"></textarea>
      <div class="form-text">Separate email IDs with commas, spaces, semicolons, or new lines.</div>
      <p class="text-muted small mt-2">
        A valid portal submission earns <strong>${o} ${o==1?"mark":"marks"}</strong> for
        participation. Marks donated to you are settled after the deadline and added to your final grade.
      </p>
    </div>
  `;return{id:r,title:t,weight:o,question:n,answer:async i=>{let a=String(i||"").trim().split(/[,;\s]+/).filter(Boolean).map(s=>s.toLowerCase());if(a.length<1||a.length>3)throw new Error("Enter 1 to 3 email IDs.");if(new Set(a).size!==a.length)throw new Error("Enter each email ID only once.");if(!a.every(s=>ge.test(s)))throw new Error("Each email must be a valid @*.study.iitm.ac.in address.");if(a.includes(String(e?.email||"").trim().toLowerCase()))throw new Error("You cannot donate marks to yourself.");return{correct:!0,score:o,validMessage:"Saved. Your portal submission as of the deadline is final."}}}}var ge,P=f(()=>{"use strict";ge=/^[^@\s]+@[a-z0-9-]+\.study\.iitm\.ac\.in$/i});var Y={};g(Y,{default:()=>we});import{html as be}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function we({weight:e=.2}={}){let o="q-donate-audio",r="Why Did You Donate (Audio)",t=async l=>{let i=(l||"").trim();if(!i)throw new Error("Submission is empty. Paste your public, CORS-enabled audio URL.");let a;try{a=new URL(i)}catch{throw new Error(`Not a valid URL: "${i.slice(0,80)}"`)}if(!/^https?:$/.test(a.protocol))throw new Error("URL must start with http:// or https://");let s="We couldn't fetch it from the browser. Make sure it's public, CORS-enabled, actually an audio file, and stays live for at least 1 week after the ROE. It will be graded offline.",d;try{let c=await fetch(i,{method:"GET",mode:"cors",cache:"no-store"});if(c.ok){let m=c.headers.get("content-type")||"";ve.test(m)?(d="\u2705 Reachable and CORS-enabled, and it looks like audio. Keep it live for 1 week after the ROE.",s=null):s=`Reachable and CORS-enabled, but the Content-Type is "${m||"unknown"}", not audio/*. Double-check you linked the audio file itself.`}else s=`The URL returned HTTP ${c.status}. Make sure it's publicly accessible. Graded offline.`}catch{}return s?{correct:!1,score:0,invalidMessage:s}:{correct:!0,score:e,validMessage:`Saved. ${d}`}},n=be`
    <div class="mb-3">
      <div style="background:linear-gradient(135deg,#3b0764 0%,#7e22ce 100%);border-radius:12px;padding:22px 26px;margin-bottom:20px;color:#f3e8ff;">
        <div style="font-size:11px;letter-spacing:2px;color:#e9d5ff;text-transform:uppercase;margin-bottom:6px;">Follow-up to “Donate Your Marks”</div>
        <div style="font-size:20px;font-weight:700;margin-bottom:8px;">🎙️ Tell them <em>why</em> — in your own voice</div>
        <div style="font-size:15px;line-height:1.6;">
          Record a short audio in which you <strong>name the collaborators you donated your marks to</strong>
          (their names and email IDs) and explain <strong>why you chose each of them</strong>. The person you
          donated to will hear this — and an AI, <em>speaking as that person</em>, will judge whether it sounds
          genuine.
        </div>
      </div>

      <h5 class="mt-4"><i class="bi bi-list-check"></i> What to submit</h5>
      <div style="display:grid;gap:10px;margin-bottom:18px;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="background:#7e22ce;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">1</div>
          <div><strong>Record your voice</strong> naming your collaborators (names + email IDs) and your honest reason for choosing each. Speak naturally — a thoughtful, specific reason scores higher than generic flattery.</div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="background:#7e22ce;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">2</div>
          <div>
            <strong>Host the audio at a public, CORS-enabled URL</strong> that stays live for
            <strong>at least 1 week after the ROE</strong>. The link must point directly at the audio file
            (e.g. <code>.mp3</code>, <code>.m4a</code>, <code>.webm</code>, <code>.opus</code>) and return an
            <code>audio/*</code> content type with <code>Access-Control-Allow-Origin: *</code>.
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="background:#7e22ce;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">3</div>
          <div><strong>Paste the audio URL below</strong> and press <kbd>Check</kbd> — we'll try to fetch it from your browser and tell you whether the CORS setup works.</div>
        </div>
      </div>

      <div class="alert alert-warning" role="alert">
        <strong><i class="bi bi-graph-up-arrow"></i> Relative grading, judged offline.</strong>
        This is scored <strong>relative to everyone else</strong> by an LLM playing the role of the person you
        donated to. A generic, AI-sounding "you're a great teammate" scores like every other generic answer —
        which is low. Be specific about <em>why</em>. Barter is a perfectly valid reason. So is cheating.
      </div>

      <div class="alert alert-danger" role="alert">
        <strong><i class="bi bi-megaphone-fill"></i> This recording will be shared publicly.</strong>
        Your audio and its transcript become part of the public reveal. If the link is broken, private, not an
        audio file, or taken down before the reveal, you lose the audio marks.
      </div>

      <p class="text-muted">
        Worth <strong>${e} ${e==1?"mark":"marks"}</strong> now for a valid submission; the
        professor may raise this to <strong>up to 2 marks</strong>, decided later from the offline evaluation.
      </p>

      <label for="${o}" class="form-label"><strong>Public, CORS-enabled audio URL</strong></label>
      <input
        type="url"
        class="form-control font-monospace"
        id="${o}"
        name="${o}"
        placeholder="https://your-host.example.com/why-i-chose-them.mp3"
      />
    </div>
  `;return{id:o,title:r,weight:e,question:n,answer:t}}var ve,N=f(()=>{"use strict";ve=/^audio\//i});var B={};g(B,{default:()=>ke});import{html as xe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ke({user:e,weight:o=4,version:r=""}){let t="q-incident-atlas-route-server",n="tds-2026-05-roe",l="Incident Atlas \u2014 Georegister and Route",i=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&quiz=${encodeURIComponent(n)}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(r)}`,a=xe`
    <div class="mb-3">
      <p class="lead text-primary">
        A response team has a directed road network and a separately exported raster incident atlas. Recover the
        incident records from the pixels, georegister them to directed road edges, and submit an earliest valid route
        that visits the mandatory checkpoint.
      </p>

      <div class="alert alert-warning">
        This is a combined raster-forensics, affine-coordinate, and time-dependent routing task. Edge direction, the
        published turn restriction, half-open incident windows, and optional waiting all affect the certificate.
      </div>

      <iframe
        title="Your authenticated incident-atlas assignment"
        src="${i}"
        style="width:100%;height:760px;border:1px solid #cbd5e1;border-radius:12px;background:#fff"
      ></iframe>

      <label for="${t}" class="form-label mt-3"><strong>Your incident records and route certificate (JSON)</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${t}"
        name="${t}"
        rows="14"
        spellcheck="false"
        placeholder='{"incidents":[{"edge_id":"H00E","effect":"CLOSED","window_id":"W1"}],"route_edge_ids":["H00E"],"arrival_seconds":123}'
      ></textarea>
      <p class="form-text">
        Use exactly the three fields described in the assignment. Incident order does not matter; route edge order
        does. Well-formed work earns separate credit for decoded incidents and for the route certificate.
      </p>
    </div>
  `;return{id:t,title:l,weight:o,question:a,answer:async d=>{let c=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,quiz:n,response:d,weight:o,questionId:t,version:r})}),m=await c.json();if(!c.ok)throw new Error(m.error||"Unable to verify the route certificate.");return m}}}var H=f(()=>{"use strict"});var W={};g(W,{default:()=>Se});import{html as $e}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Se({user:e,weight:o=5,version:r=""}){let t="q-unicode-doppelganger-ledger-server",n="tds-2026-05-roe",l="Unicode Doppelganger Ledger Forensics",i=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&quiz=${encodeURIComponent(n)}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(r)}`,a=$e`
    <div class="mb-3">
      <p class="lead text-primary">
        <strong>Incident:</strong> A payments ledger may have merged Unicode doppelganger identities and replayed
        revised events. Produce a deterministic forensic certificate from your private assignment artifact.
      </p>
      <p>
        This is deliberately not a visual matching exercise. Handles and transaction keys contain composed versus
        decomposed accents, fullwidth forms, mixed-script Cyrillic look-alikes, and explicitly listed invisible code
        points. The ledger also contains exact transport replays, superseded revisions, equal-revision corrections,
        business-level duplicates, and integer values too large for safe floating-point arithmetic.
      </p>

      <iframe
        title="Your Unicode doppelganger ledger artifact"
        src="${i}"
        style="width:100%;height:590px;border:1px solid #dee2e6;border-radius:12px;background:#07111f"
      ></iframe>

      <div class="card my-3 border-info">
        <div class="card-body">
          <h5 class="card-title"><strong>What makes the certificate auditable</strong></h5>
          <ul class="mb-0">
            <li>
              The downloadable JSON pins the exact ordered canonicalization: Unicode 15.1 NFKC, locale-independent
              lowercase, removal of only the listed default-ignorable scalars, then one pass of the supplied
              confusable map.
            </li>
            <li>
              Apply replay removal, revision selection and its tie-break, eligibility, then canonical business-key
              deduplication in precisely the documented order.
            </li>
            <li>
              Compute the signed minor-unit net with arbitrary-precision integers and reproduce the documented
              FNV-1a-32 evidence digest. The artifact contains the complete procedure, but no certificate values.
            </li>
          </ul>
        </div>
      </div>

      <label for="${t}" class="form-label"><strong>Your four-field JSON certificate</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${t}"
        name="${t}"
        rows="10"
        spellcheck="false"
        placeholder='{"suspicious_account_ids":["acct-..."],"accepted_event_ids":["evt-..."],"net_minor_units":"12345678901234567","evidence_digest":"fnv1a32:0123abcd"}'
        style="font-size:0.8rem;"
      ></textarea>
      <small class="form-text text-muted">
        ID-array order is ignored. The four components receive independent partial credit, but malformed types,
        duplicate IDs, extra keys, or oversized submissions are rejected.
      </small>
    </div>
  `;return{id:t,title:l,weight:o,question:a,answer:async d=>{let c=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,quiz:n,response:d,weight:o,questionId:t,version:r})}),m=await c.json();if(!c.ok)throw new Error(m.error||"Unable to verify the forensic certificate.");return m}}}var F=f(()=>{"use strict"});var J={};g(J,{HTTP_CACHE_TIME_MACHINE_QUESTION_ID:()=>V,default:()=>Te});import{html as Ie}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Te({user:e,weight:o=4,version:r=""}){let t=V,n="tds-2026-05-roe",l="HTTP Cache Time Machine \u2014 Reconstruct the Shared Cache",i=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&quiz=${encodeURIComponent(n)}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(r)}`,a=Ie`
    <div class="mb-3">
      <p class="lead text-primary">
        <strong>Incident:</strong> users swear an API served the past. You have the origin's version schedule and the
        exact request trace, but the shared-cache log was lost. Reconstruct what every marked probe delivered, how
        many requests reached origin, and the final cache state.
      </p>
      <p>
        This is a deterministic protocol simulation, not a browser experiment. Use only the complete
        <strong>TDS-RFC9111-SUBSET-1</strong> below. Times and ages are integer seconds; the cache starts empty; requests
        execute serially in timeline order with zero network delay. There is no heuristic freshness, clock skew,
        <code>Age</code>, stale serving, range handling, authorization rule, or rule not written here.
      </p>

      <iframe
        title="Assigned HTTP cache timeline"
        src="${i}"
        style="width:100%;height:650px;border:1px solid #334155;border-radius:12px;background:#07111f"
      ></iframe>

      <div class="card my-3 border-info">
        <div class="card-body">
          <h5 class="card-title">The exact cache machine</h5>
          <ol class="mb-0">
            <li>
              <strong>Origin schedule.</strong> For a GET at time <code>t</code>, its current representation is the row
              for that URI having the greatest <code>effective_at &lt;= t</code>. A change is effective before a request
              at the same second. A normal origin GET returns that row as 200. An ETag comparison is opaque,
              case-sensitive, and includes the displayed quote characters.
            </li>
            <li>
              <strong>Variant lookup.</strong> Header names are case-insensitive; values are exact and case-sensitive.
              A stored entry matches only when its URI matches and, for every lower-cased name in that entry's
              response <code>Vary</code> list, the current request value equals the value recorded when stored. A
              missing request header has value <code>""</code>. <code>Vary</code> order is the response's left-to-right
              order. The supplied trace never has two matching entries.
            </li>
            <li>
              <strong>Freshness.</strong> In this shared cache, <code>s-maxage=N</code> overrides <code>max-age=M</code>.
              Otherwise <code>max-age</code> is used. The current age is <code>t - stored_at</code>; an entry is fresh
              exactly when <code>age &lt; freshness_lifetime</code>, so equality is stale. A matching fresh entry is
              delivered without origin unless the request contains <code>Cache-Control: no-cache</code>.
            </li>
            <li>
              <strong>Forwarding and validation.</strong> A miss, a stale match, or request <code>no-cache</code> sends
              one origin request. If a matching entry has an ETag, the cache conditionally validates it. Equal current
              and cached ETags produce 304: deliver the cached body, set <code>stored_at=t</code>, and refresh that
              entry's ETag and freshness lifetime from the current origin row. Unequal ETags (or no matching entry)
              produce 200 with the current origin body.
            </li>
            <li>
              <strong>200 storage.</strong> Before handling a forwarded 200, remove the matching old entry, if any.
              A shared cache never stores a response containing <code>no-store</code> or <code>private</code>. Otherwise
              a GET 200 with explicit <code>s-maxage</code> or <code>max-age</code> is stored, replacing an entry with
              the same URI and Vary values. Request <code>no-cache</code> does not prohibit storing the response.
            </li>
            <li>
              <strong>Unsafe methods.</strong> Every supplied POST, PUT, or DELETE goes to origin, receives 204, has no
              body delivery to report, and then invalidates <em>all</em> cached variants whose URI is exactly its URI.
              It does not alter the independently listed origin version schedule.
            </li>
            <li>
              <strong>Sources and origin count.</strong> A probe's <code>source</code> is exactly <code>cache</code> for a
              fresh hit, <code>origin-304</code> when validation returns 304, or <code>origin-200</code> when the delivered
              body came from a 200. Count every forwarded GET and every unsafe request once; do not count cache hits.
            </li>
          </ol>
        </div>
      </div>

      <div class="card my-3 border-warning">
        <div class="card-body">
          <h5 class="card-title">Final-cache digest (fully specified)</h5>
          <p>
            After the final request, turn each stored entry into an object whose keys occur in exactly this order:
          </p>
          <pre><code>{"uri":"...","vary_values":[["header","value"]],"body_version":"...","etag":"\"...\"","stored_at":1700000000,"freshness_lifetime":7}</code></pre>
          <ul class="mb-0">
            <li>
              Keep <code>vary_values</code> in response-Vary order. Sort the objects ascending by the ASCII/code-unit
              cache key <code>uri + "\n" + vary_values.map(([n,v]) =&gt; n + ":" + v).join("\n")</code>.
            </li>
            <li>
              Serialize the array with compact <code>JSON.stringify</code> (no spaces). All generated values are ASCII.
            </li>
            <li>
              Compute FNV-1a 32-bit over its UTF-8 bytes: start <code>h=2166136261</code>; for every byte set
              <code>h = ((h XOR byte) * 16777619) modulo 2^32</code>. Use exact 32-bit multiplication (JavaScript:
              <code>Math.imul</code>). Submit <code>fnv1a32:</code> plus eight lower-case hex digits.
            </li>
          </ul>
        </div>
      </div>

      <p><strong>Submit strict JSON with exactly these keys and no others:</strong></p>
      <pre><code>{
  "probe_deliveries": [
    {"request_id": "R02", "body_version": "version-from-the-trace", "source": "cache"}
  ],
  "origin_request_count": 0,
  "final_cache_digest": "fnv1a32:00000000"
}</code></pre>
      <p>
        Include every ID in <code>probe_request_ids</code>, exactly once and in that listed order. The delivery section
        is 65% (divided equally across probe rows), the exact origin count is 20%, and the exact digest is 15%.
        Structurally malformed JSON, extra keys, wrong types, duplicate/missing probe IDs, or submissions above 20,000
        characters are rejected rather than guessed.
      </p>

      <label for="${t}" class="form-label"><strong>Your cache certificate (JSON)</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${t}"
        name="${t}"
        rows="18"
        spellcheck="false"
        placeholder='{"probe_deliveries":[],"origin_request_count":0,"final_cache_digest":"fnv1a32:00000000"}'
      ></textarea>
    </div>
  `;return{id:t,title:l,weight:o,question:a,answer:async d=>{let c=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,quiz:n,response:d,weight:o,questionId:t,version:r})}),m=await c.json();if(!c.ok)throw new Error(m.error||"Unable to verify the cache certificate.");return m}}}var V,G=f(()=>{"use strict";V="q-http-cache-time-machine-server"});var K={};g(K,{default:()=>Ae});import{html as qe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Ee(e){return e.trim()?e.trim().split(/\s+/u).length:0}async function Ae({weight:e=2}){let o="q-ai-content-detection",r="Prompt for Detecting AI-Generated Content",t=qe`
    <div class="mb-3">
      <p>
        Submit one prompt of 5 to 500 characters for an LLM or agent to detect
        AI-generated content in an article. Define the rubric and judgement criteria in
        the prompt.
      </p>
      <p>
        The evaluator will run the prompt on hidden article variants and assess both the
        rubric and the resulting judgements. The rubric should require concrete
        evidence, distinguish AI-generated content from ordinary style, avoid certainty
        about authorship, and handle articles with few or no indicators.
      </p>
      <p>A valid submission earns 0.1 mark.
        Your prompt be evaluated <em>offline</em> in two stages. In stage 1, a smart model
        will check how good your prompt is likely to be at differentiating AI and human
        content. This fetches up to one mark.
      </p>
      <p>
        In stage 2, only the top scoring answers (maybe 100) amongst these will be run against real
        human and AI-generated content. These will earn up to 0.9 marks based on their
        performance and distinctness (i.e you'll score less if you copy - but if you copy
        from someone smart, you might score more.)
      </p>
      <p>
        Scores are normalized across submissions, and prompt
        distinctness is assessed using embedding distance.
      </p>
      <label for="${o}" class="form-label"><strong>Your prompt</strong></label>
      <textarea
        class="form-control"
        id="${o}"
        name="${o}"
        required
        spellcheck="true"
      ></textarea>
    </div>
  `;return{id:o,title:r,weight:e,question:t,answer:l=>{if(typeof l!="string"||Ee(l)===0)throw new Error("Submit one non-empty prompt.");if(l.length<5||l.length>500)throw new Error("The prompt must contain 5 to 500 characters.");return{correct:!0,score:.1,validMessage:"Format accepted. The remaining 1.9 marks will be evaluated offline."}}}}var Q=f(()=>{"use strict"});var X={};g(X,{default:()=>Oe});import{html as Re}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Ue(e,o){let r=2166136261;for(let t of new TextEncoder().encode(`${String(e||"").trim().toLowerCase()}#ai-opportunity-discovery#${o}`))r=Math.imul(r^t,16777619)>>>0;return r<2147483648?"A":"B"}async function Oe({user:e,weight:o=2,version:r="roe-2026-05-v1"}){let t="q-ai-opportunity-discovery",n=Ue(e.email,r),i=Re`
    <div class="mb-3">
      <h5>AI opportunity discovery: SkyWave Direct</h5>
      <p>
        You have joined SkyWave Direct's AI Innovation team. In your first week, you receive a partial
        internal data room containing strategy and process documents, operational datasets, financial or
        retention records, and selected communications.
      </p>
      <p>
        Download your assigned data room: <a href="${n==="A"?ze:Ce}" target="_blank" rel="noreferrer">Case ${n}</a>.
        Your assignment remains the same if you refresh. The materials are incomplete: some later records,
        internal discussions, and incident evidence are unavailable.
      </p>
      <p>
        Do not build an AI system yet. First decide what the organization should investigate and where AI could
        create value safely. Treat every metric and document as evidence produced by a process, not as ground truth.
      </p>
      <p>
        <strong>Warning</strong>: Some information has been deliberately hidden, like in a real organization.
        This may be because of politics, organization structure, real-life data quality issues, or just plain forgetfulness.
        However, some signals will leak through. Your agent may not be able to find these. But can you?
      </p>
      <p>Submit a Markdown memo of at most <strong>1,800 words</strong>, using exactly this structure:</p>
      <pre class="border rounded bg-body-tertiary p-3"><code># Organization and process map
Brief narrative: departments, systems, decisions, and information flows.

## Interview questions
| # | Stakeholder/team | Question | Why this matters | Evidence prompting it |
|---|---|---|---|---|
| 1 | ... | ... | ... | filename, field/date/query/passage |
<!-- Include exactly 8 rows. -->

## Ranked AI use cases
| Rank | Use case and business decision | Evidence | Value | Difficulty | Risks and validation step |
|---|---|---|---|---|---|
| 1 | ... | ... | High/Medium/Low | High/Medium/Low | ... |
<!-- Include exactly 3 rows. -->

## Safest first action
One prioritized, reversible action and why it is safe under the current uncertainty.</code></pre>
      <p>
        Cite filenames and relevant fields, dates, cohorts, passages, or queries precisely. This is evaluated
        offline and relatively within your assigned case for evidence traceability, investigative judgment,
        calibration, and usefulness. A valid saved submission is required; final marks are assigned after offline evaluation.
      </p>
      <p>
        This will be evaluated offline by an agent that knows what was withheld and will check
        if you can uncover the right signals and penalize you for following the wrong ones.
        <strong>Intuition helps.</strong>
      </p>
      <label for="${t}" class="form-label"><strong>Your memo</strong></label>
      <textarea class="form-control" id="${t}" name="${t}" rows="18" required spellcheck="true"></textarea>
    </div>
  `;return{id:t,title:"AI Opportunity Discovery",weight:o,question:i,answer:s=>{let d=String(s||"").trim();if(d.length<500)throw new Error("Submit a substantive memo (at least 500 characters).");if(d.split(/\s+/u).length>1800)throw new Error("Keep the memo to at most 1,800 words.");for(let c of["# Organization and process map","## Interview questions","## Ranked AI use cases","## Safest first action"])if(!d.includes(c))throw new Error(`Include the required heading: ${c}`);return!0}}}var ze,Ce,Z=f(()=>{"use strict";ze="https://drive.google.com/drive/folders/13-pfSILZ9SlepNhwj8XFzVffoD-fJlyn?usp=drive_link",Ce="https://drive.google.com/drive/folders/1EjFSdmrUQ1f2zN3WoqeLAYfK_IzkIN8q?usp=drive_link"});var ee={};g(ee,{default:()=>Me});import{html as Le}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Me({user:e,weight:o=.2}={}){let r="q-unusual-useful-essay-server",t="The Unusual Useful Essay",n=async i=>{let a=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:i,weight:o,questionId:r})}),s=await a.json();if(!a.ok)throw new Error(s.error||"Unable to validate your essay.");return s},l=Le`
    <div class="mb-3">
      <div class="rounded-3 p-4 mb-3 text-white" style="background:linear-gradient(135deg,#0f172a,#4338ca)">
        <div class="small text-uppercase" style="letter-spacing:.12em;color:#c7d2fe">Public · distinct writing · offline marks</div>
        <h4 class="mt-2 mb-0">The unusual useful essay</h4>
        <p class="mb-0 mt-2" style="color:#e0e7ff">
          Everyone writes about the same idea. Your task is to express it in a way that nobody else does.
        </p>
      </div>

      <svg viewBox="0 0 760 190" width="100%" role="img" aria-label="Writing challenge: begin with the same topic as everyone else, choose an original lens, and do not sound like another essay." style="display:block;margin:0 0 1rem">
        <defs>
          <linearGradient id="essay-bg" x1="0" x2="1">
            <stop offset="0" stop-color="#eef2ff"></stop>
            <stop offset="1" stop-color="#fff7ed"></stop>
          </linearGradient>
          <marker id="essay-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1"></path></marker>
        </defs>
        <rect x="4" y="8" width="752" height="126" rx="18" fill="url(#essay-bg)"></rect>
        <path d="M 205 70 H 274 M 486 70 H 555" stroke="#6366f1" stroke-width="3" stroke-linecap="round" marker-end="url(#essay-arrow)"></path>

        <rect x="20" y="28" width="176" height="84" rx="14" fill="#fff" stroke="#c7d2fe" stroke-width="2"></rect>
        <circle cx="48" cy="52" r="16" fill="#4f46e5"></circle>
        <text x="48" y="57" text-anchor="middle" font-family="system-ui" font-size="14" font-weight="700" fill="#fff">1</text>
        <text x="70" y="52" font-family="system-ui" font-size="14" font-weight="800" fill="#312e81">SAME TOPIC</text>
        <text x="36" y="82" font-family="system-ui" font-size="13" fill="#4f46e5">Every student starts</text>
        <text x="36" y="100" font-family="system-ui" font-size="13" fill="#4f46e5">from the same idea.</text>

        <rect x="282" y="28" width="196" height="84" rx="14" fill="#fff" stroke="#86efac" stroke-width="2"></rect>
        <circle cx="310" cy="52" r="16" fill="#059669"></circle>
        <path d="M 310 41 L 313 49 L 321 52 L 313 55 L 310 63 L 307 55 L 299 52 L 307 49 Z" fill="#fff"></path>
        <text x="332" y="52" font-family="system-ui" font-size="14" font-weight="800" fill="#065f46">TWIST THE LENS</text>
        <text x="298" y="82" font-family="system-ui" font-size="13" fill="#047857">Choose your voice, form,</text>
        <text x="298" y="100" font-family="system-ui" font-size="13" fill="#047857">viewpoint, or imagery.</text>

        <rect x="563" y="28" width="176" height="84" rx="14" fill="#fff" stroke="#fdba74" stroke-width="2"></rect>
        <circle cx="591" cy="52" r="16" fill="#ea580c"></circle>
        <path d="M 583 52 H 599 M 591 44 V 60" stroke="#fff" stroke-width="3" stroke-linecap="round"></path>
        <text x="613" y="52" font-family="system-ui" font-size="14" font-weight="800" fill="#9a3412">NO LOOK-ALIKES</text>
        <text x="579" y="82" font-family="system-ui" font-size="13" fill="#c2410c">Do not sound like</text>
        <text x="579" y="100" font-family="system-ui" font-size="13" fill="#c2410c">another response.</text>

        <rect x="86" y="148" width="588" height="32" rx="16" fill="#312e81"></rect>
        <text x="380" y="169" text-anchor="middle" font-family="system-ui" font-size="15" font-weight="800" fill="#fff">Your task is to express it in a way that nobody else does.</text>
      </svg>

      <p class="lead">Write a <strong>110–150 word</strong> piece answering this shared topic:</p>
      <blockquote class="blockquote border-start border-primary border-4 ps-3 py-1 mb-3">
        <p class="mb-0">${_e}</p>
      </blockquote>

      <div class="alert alert-warning">
        <strong>Marks are decided later.</strong> Meeting the word-count and format constraints earns
        <strong>0.2 marks</strong>. This is only for meeting the constraints. After the ROE, we will compare your
        writing with other students' answers. Its unusualness will be measured using semantic embeddings: the
        distance from your five closest fellow-student responses, minus the distance from the shared topic. If it
        is similar to another answer, you lose marks. All other whole or partial marks for this essay will be
        decided offline.
      </div>

      <div class="alert alert-danger">
        <strong>This is public course material.</strong> Your submitted essay may be shared with the class and used
        in the later comparison. Do not include private, sensitive, or identifying information about yourself or
        anyone else.
      </div>

      <label for="${r}" class="form-label"><strong>Your essay</strong></label>
      <textarea
        class="form-control"
        id="${r}"
        name="${r}"
        rows="9"
        maxlength="1800"
        placeholder="Write 110–150 words…"
        aria-describedby="counter-${r}"
        oninput="
          const words = (this.value.match(/[\\p{L}\\p{N}]+(?:['’][\\p{L}\\p{N}]+)*/gu) || []).length;
          document.getElementById('counter-${r}').textContent = words + ' / 110–150 words';
          this.closest('.was-validated')?.classList.remove('was-validated');
        "
      ></textarea>
      <div id="counter-${r}" class="text-end text-muted small mt-1">0 / 110–150 words</div>
    </div>
  `;return{id:r,title:t,weight:o,question:l,answer:n}}var _e,te=f(()=>{"use strict";_e="Which human skills will matter most in the AI era, and why?"});var re={};g(re,{default:()=>Be});import{html as je}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function oe(e,o){let r;try{r=new URL(e)}catch{throw new Error(`${o} is not a valid URL: "${e.slice(0,80)}"`)}if(!/^https?:$/.test(r.protocol))throw new Error(`${o} must start with http:// or https://`);return r.href}function Ye(e){let o=(e||"").trim();if(!o)throw new Error("Submission is empty. Paste your audio URL, optionally followed by a proof link.");let r=o.search(/\s/),t=r===-1?o:o.slice(0,r),n=r===-1?"":o.slice(r).trim(),l=oe(t,"Audio URL");if(n)for(let i of n.split(/\s+/).filter(Boolean))oe(i,"Proof link");return{audioUrl:l,proofRaw:n}}function Ne(e){return new Promise(o=>{let r=!1,t=i=>{r||(r=!0,clearTimeout(l),n.removeAttribute("src"),o(i))},n=new Audio;n.preload="metadata",n.crossOrigin="anonymous",n.addEventListener("loadedmetadata",()=>{let i=n.duration;t(Number.isFinite(i)&&i>0?i:null)}),n.addEventListener("error",()=>t(null));let l=setTimeout(()=>t(null),Pe);n.src=e})}async function Be({weight:e=.2}={}){let o="q-initiative-audio",r="Something You Did On Your Own Initiative (Audio)",t=async l=>{let{audioUrl:i,proofRaw:a}=Ye(l),s="\u26A0\uFE0F We couldn't fetch the audio from the browser. Make sure it's public, CORS-enabled, actually an audio file, and stays live for at least 1 week after the ROE. It will be graded offline.";try{let c=await fetch(i,{method:"GET",mode:"cors",cache:"no-store"});if(c.ok){let m=c.headers.get("content-type")||"";if(De.test(m)){let p=await Ne(i);p==null?s=`\u2705 Audio is reachable and CORS-enabled. We couldn't measure its duration from the browser (this check is optional) \u2014 keep it under ${I}s and live for 1 week after the ROE.`:p<=I+2?s=`\u2705 Audio is reachable and CORS-enabled, and about ${Math.round(p)}s long (\u2264 ${I}s). Keep it live for 1 week after the ROE.`:s=`\u26A0\uFE0F Audio is reachable and CORS-enabled, but it looks like ~${Math.round(p)}s long \u2014 over the ${I}s limit. This duration check is advisory only and won't block this mark, but it will count against you offline.`}else s=`\u26A0\uFE0F Audio URL is reachable and CORS-enabled, but the Content-Type is "${m||"unknown"}", not audio/*. Double-check you linked the audio file itself.`}else s=`\u26A0\uFE0F The audio URL returned HTTP ${c.status}. Make sure it's publicly accessible. Graded offline.`}catch{}let d=a?` Proof link saved (${a.split(/\s+/).length} URL${a.split(/\s+/).length===1?"":"s"}).`:" No proof link provided \u2014 you can still add one (space-separated after the audio URL).";return{correct:!0,score:e,validMessage:`Saved. ${s}${d}`}},n=je`
    <div class="mb-3">
      <div style="background:linear-gradient(135deg,#064e3b 0%,#059669 100%);border-radius:12px;padding:22px 26px;margin-bottom:20px;color:#ecfdf5;">
        <div style="font-size:11px;letter-spacing:2px;color:#a7f3d0;text-transform:uppercase;margin-bottom:6px;">The classic interview question</div>
        <div style="font-size:20px;font-weight:700;margin-bottom:8px;">🎙️ "Tell me about something you did on your own initiative"</div>
        <div style="font-size:15px;line-height:1.6;">
          Record a short voice answer (<strong>at most 120 seconds</strong>) about a task you did
          <strong>because you chose to</strong> — nobody assigned it, asked for it, or required it. Then,
          <em>in the same recording</em>, explain how an agent with only internet access could verify (a) that
          this really happened, and (b) that it was genuinely self-initiated rather than something someone
          told you to do.
        </div>
      </div>

      <div class="alert alert-primary border-start border-4 border-primary" role="alert">
        <strong><i class="bi bi-skip-forward-fill"></i> You <em>could</em> skip this question if you have nothing credible to show.</strong>
        But would you do that in an interview?
        Remember: an agent will verify your claim offline, and if it cannot find the evidence you describe, you score nothing.
      </div>

      <h5 class="mt-4"><i class="bi bi-list-check"></i> What to submit</h5>
      <div style="display:grid;gap:10px;margin-bottom:18px;">
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="background:#059669;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">1</div>
          <div>
            <strong>Record your voice, ≤ 120 seconds</strong>, telling the story: what you did, why you chose
            to do it, and — most importantly — <strong>one specific public artifact</strong> an agent could look
            up online to confirm it. State the exact URL, name, or ID out loud (spell it if it's unusual).
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="background:#059669;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">2</div>
          <div>
            <strong>Explain how the agent can tell it was your initiative, not an assignment.</strong> For
            example: contrast it with what was actually required of you at the time, point to a timestamp that
            predates any related deadline or announcement, or explain the motivation in your own words.
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="background:#059669;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">3</div>
          <div>
            <strong>Host the audio at a public, CORS-enabled URL</strong> that stays live for
            <strong>at least 1 week after the ROE</strong>. The link must point directly at the audio file
            (e.g. <code>.mp3</code>, <code>.m4a</code>, <code>.webm</code>, <code>.wav</code>) and return an
            <code>audio/*</code> content type with <code>Access-Control-Allow-Origin: *</code>.
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;">
          <div style="background:#059669;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;font-size:13px;">4</div>
          <div>
            <strong>Paste below, space-separated:</strong>
            <code>audio_url</code> and (strongly recommended)
            <code>proof_url</code> — any public link that backs up what you claimed (GitHub PR, blog post,
            package page, etc.). Press <kbd>Check</kbd> — we'll try to fetch the audio from your browser, and
            if possible, estimate its duration. The proof link is only validated as a URL here; an agent
            checks it offline.
          </div>
        </div>
      </div>

      <h5 class="mt-4"><i class="bi bi-globe"></i> What counts as a good public artifact?</h5>
      <p>Anything a stranger (or an agent) can independently find and check. For each type, paste
        <code>audio_url</code> then a space then the proof link — for example:</p>
      <ul>
        <li class="mb-3">
          A GitHub repo, commit, issue, or pull request — <strong>ideally dated well before this exam</strong>,
          but just before or even during the exam window is acceptable
          <div class="form-text font-monospace mt-1 mb-0">
            https://cdn.example.com/initiative.mp3 https://github.com/you/repo/pull/42
          </div>
        </li>
        <li class="mb-3">
          A blog post, forum post, or Stack Overflow answer with a visible date and your name/handle
          <div class="form-text font-monospace mt-1 mb-0">
            https://cdn.example.com/initiative.mp3 https://stackoverflow.com/a/12345678
          </div>
        </li>
        <li class="mb-3">
          A published package (npm, PyPI, etc.), a live demo/website, or a dataset/notebook you released publicly
          <div class="form-text font-monospace mt-1 mb-0">
            https://cdn.example.com/initiative.mp3 https://pypi.org/project/your-package/
          </div>
        </li>
        <li class="mb-3">
          A hackathon or competition entry, leaderboard placement, or a public certificate-verification page
          <div class="form-text font-monospace mt-1 mb-0">
            https://cdn.example.com/initiative.mp3 https://devpost.com/software/your-project
          </div>
        </li>
        <li class="mb-3">
          A video, talk, or public post you can link to, with a visible upload/publish date
          <div class="form-text font-monospace mt-1 mb-0">
            https://cdn.example.com/initiative.mp3 https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </div>
        </li>
      </ul>
      <p class="text-muted">
        Vague claims with nothing an agent can look up ("I read a book on weekends") will score low, even if
        true — the whole point is <em>verifiability</em>. If none of the examples above fit something you
        already did, <strong>skip this question</strong>.
      </p>

      <div class="alert alert-warning" role="alert">
        <strong><i class="bi bi-graph-up-arrow"></i> Relative grading, judged offline.</strong>
        This is scored <strong>relative to everyone else</strong> by an agent that (1) judges how clearly you
        articulated a verification method, and then (2) actually attempts that verification online. A
        generic, unverifiable, or clearly-assigned task scores like every other weak answer — which is low.
      </div>

      <div class="alert alert-danger" role="alert">
        <strong><i class="bi bi-shield-lock-fill"></i> Don't share private information.</strong>
        Only point to artifacts that are already public. Do not include anyone else's private data, and do
        not link to anything that could get taken down before the offline evaluation runs.
      </div>

      <p class="text-muted">
        Worth <strong>${e} ${e==1?"mark":"marks"}</strong> now for a valid submission; the
        professor may raise this based on how well you articulated the verification method and whether the
        agent's offline verification actually succeeds.
      </p>

      <label for="${o}" class="form-label">
        <strong>Audio URL</strong>
        <span class="text-muted fw-normal"> + optional proof link(s), space-separated</span>
      </label>
      <input
        type="text"
        class="form-control font-monospace"
        id="${o}"
        name="${o}"
        autocomplete="off"
        spellcheck="false"
        placeholder="https://your-host.example.com/my-initiative.mp3 https://github.com/you/repo/pull/12"
      />
      <p class="form-text">
        Format: <code>https://…/audio.mp3 https://…/proof</code>. Audio first; then any proof URL(s).
        Audio alone is accepted, but a proof link makes offline verification much easier.
      </p>
    </div>
  `;return{id:o,title:r,weight:e,question:n,answer:t}}var De,I,Pe,ae=f(()=>{"use strict";De=/^audio\//i,I=120,Pe=6e3});var ie={};g(ie,{default:()=>We});import{html as He}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function A(e){return e.trim()?e.trim().split(/\s+/u).length:0}async function We({weight:e=2}){let o="q-external-dataset-insight",r="Insights from NSS80 Telecom Data",t=He`
    <div class="mb-3">
      <p>
        Use the MoSPI MCP at
        <a href="https://mcp.mospi.gov.in/" target="_blank" rel="noreferrer">https://mcp.mospi.gov.in/</a>
        to work with the <strong>Comprehensive Modular Survey: Telecom (NSS 80th Round)</strong>
        dataset.
      </p>
      <p>
        Find exactly three impactful, practical, and surprising insights.
      </p>
      <p>
        Return a JSON array containing exactly three objects. Each object must contain
        exactly these text fields:
      </p>
      <ul>
        <li><code>title</code>: a newspaper headline explaining the insight. Max 8 words.</li>
        <li><code>body</code>: an explanation of the insight, as if for a popular newspaper, to educate and engage the readers. Max 100 words.</li>
        <li><code>verification</code>: a step-by-step method to help a journalist verify the correctness of the insight from the provided source. Max 200 words.</li>
      </ul>
      <p>
        A valid submission earns 0.1 mark. The remaining 1.9 marks will be awarded
        offline:
      </p>
      <ul>
        <li>1 mark: a low-cost LLM evaluates the quality and correctness of all submissions.</li>
        <li>0.9 marks: after normalizing the scores, a higher-cost agent evaluates the top 100 submissions.</li>
      </ul>
      <p>
        Scores are graded relatively across submissions, including insight quality,
        correctness, verification quality, and distinctness. Distinctness is assessed
        using embedding distance.
      </p>
      <label for="${o}" class="form-label"><strong>Your JSON answer</strong></label>
      <textarea
        class="form-control"
        id="${o}"
        name="${o}"
        required
        spellcheck="true"
      ></textarea>
    </div>
  `;return{id:o,title:r,weight:e,question:t,answer:l=>{let i;try{i=JSON.parse(l)}catch{throw new Error("Submit a valid JSON array.")}if(!Array.isArray(i)||i.length!==3)throw new Error("Submit exactly three insight objects in a JSON array.");for(let[a,s]of i.entries()){if(!s||typeof s!="object"||Array.isArray(s))throw new Error(`Insight ${a+1} must be an object.`);if(Object.keys(s).sort().join(",")!=="body,title,verification")throw new Error(`Insight ${a+1} must contain only title, body, and verification.`);for(let c of["title","body","verification"])if(typeof s[c]!="string"||!s[c].trim())throw new Error(`Insight ${a+1} must have a non-empty ${c} field.`);if(A(s.title)>8)throw new Error(`Insight ${a+1} title must contain at most 8 words.`);if(A(s.body)>100)throw new Error(`Insight ${a+1} body must contain at most 100 words.`);if(A(s.verification)>200)throw new Error(`Insight ${a+1} verification must contain at most 200 words.`)}return{correct:!0,score:.1,validMessage:"Format accepted. The remaining 1.9 marks will be evaluated offline."}}}}var se=f(()=>{"use strict"});var le={};g(le,{default:()=>Qe});import{html as Fe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import Ve from"https://cdn.jsdelivr.net/npm/marked-katex-extension@5/+esm";import{Marked as Je}from"https://cdn.jsdelivr.net/npm/marked@13/+esm";function Ge(e){return e?String(e).replace(/\\\[([\s\S]*?)\\\]/g,(o,r)=>`$$${r.trim()}$$`).replace(/\\\(([\s\S]*?)\\\)/g,(o,r)=>`$${r.trim()}$`):""}function Ke(e){return String(e||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function Qe({user:e,weight:o=1,version:r=""}){let t="AI Tutor Challenge",n=`/questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&questionId=${encodeURIComponent(u)}&version=${encodeURIComponent(r)}`;setTimeout(()=>{let a=document.getElementById(`${u}-root`),s=a?.closest("form");if(!a||!s)return;let d=document.getElementById(u),c=document.getElementById(`${u}-message`),m=document.getElementById(`${u}-ask`),p=document.getElementById(`${u}-token`),w=document.getElementById(`${u}-transcript`),x=document.getElementById(`${u}-status`),T=document.getElementById(`${u}-charcount`),q=document.getElementById(`${u}-iframe`),de=document.querySelector(`.check-answer[data-question="${u}"]`),k={transcript:[]},R=()=>{s.dispatchEvent(new Event("input",{bubbles:!0})),a.closest(".was-validated")?.classList.remove("was-validated")},z=()=>{w.innerHTML=k.transcript.length?k.transcript.map(h=>`<div class="atc-turn atc-turn--${h.role==="assistant"?"tutor":"you"}">
                  <span class="atc-turn-label">${h.role==="assistant"?"Tutor":"You"}</span>
                  <span class="atc-turn-content">${h.role==="assistant"?ne.parse(Ge(h.content)):Ke(h.content)}</span>
                </div>`).join(""):'<div class="atc-empty">No tutor interactions yet \u2014 ask a question above.</div>'},C=(h=!1)=>(h&&(globalThis.aiPipeToken=""),globalThis.aiPipeToken||(globalThis.aiPipeToken=prompt("Enter your AI Pipe token (from aipipe.org)")||""),globalThis.aiPipeToken),y=(h,S)=>{x.className=`atc-status atc-status--${h}`,x.textContent=S,x.hidden=!1};q?.addEventListener("load",()=>{try{let h=q.contentDocument?.body?.scrollHeight;h&&(q.style.height=`${h+24}px`)}catch{}}),c.addEventListener("input",()=>{let h=c.value.length;T.textContent=`${h} / ${v}`,T.style.color=h>v*.9?"#ff8866":""}),d.addEventListener("input",R),p.addEventListener("click",()=>{C(!0),globalThis.aiPipeToken&&y("info","Token updated.")}),m.addEventListener("click",async()=>{let h=c.value.trim();if(!h){y("warning","Type a question for the tutor first.");return}if(h.length>v){y("warning",`Message too long (max ${v} characters).`);return}let S=C();if(!S){y("warning","Enter an AI Pipe token to use the tutor.");return}m.disabled=!0,m.innerHTML='<span class="atc-spinner" role="status" aria-label="Loading"></span> Thinking\u2026',y("info","Asking the tutor\u2026");try{let b=await fetch("/aiTutorChat",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${S}`},body:JSON.stringify({email:e.email,quizSign:e.quizSign,message:h,transcript:k.transcript,version:r})}),E=await b.json().catch(()=>({}));if(!b.ok){let O=E?.error?.message||E?.message||`Tutor service returned HTTP ${b.status}`;b.status===401||b.status===402||b.status===429?y("warning",`${O}  \u2014  Try another AI Pipe token if your quota ran out.`):y("danger",O);return}let U=String(E?.choices?.[0]?.message?.content||"").trim();if(!U){y("danger","Tutor returned an empty response. Try again.");return}k.transcript.push({role:"user",content:h}),k.transcript.push({role:"assistant",content:U}),c.value="",T.textContent=`0 / ${v}`,y("success","Tutor replied \u2014 enter your computed answer below when ready."),z(),w.scrollTop=w.scrollHeight}catch(b){y("danger",b instanceof Error?b.message:String(b))}finally{m.disabled=!1,m.textContent="Ask tutor"}}),de?.addEventListener("click",R),z()},100);let l=Fe`
    <div id="${u}-root" class="mb-3">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css">
      <style>
        /* ---- layout & reset ---- */
        #${u}-root { font-family: 'Inter', 'Segoe UI', sans-serif; }

        /* ---- intro text ---- */
        .atc-intro { margin-bottom: 1rem; line-height: 1.65; color: #9aabbf; font-size: 0.9rem; }
        .atc-intro a { color: #6c8aff; }
        .atc-intro strong { color: #c9d1e0; }
        .atc-intro code {
          font-family: 'Fira Mono', monospace;
          background: #1a1d27;
          border-radius: 3px;
          padding: 0 0.3em;
          font-size: 0.82em;
          color: #a9d4ff;
        }

        /* ---- how-to steps ---- */
        .atc-steps {
          margin: 0 0 1.25rem;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .atc-steps li {
          font-size: 0.85rem;
          color: #9aabbf;
          line-height: 1.6;
          padding-left: 1.4rem;
          position: relative;
        }
        .atc-steps li::before {
          content: counter(atc-step);
          counter-increment: atc-step;
          position: absolute;
          left: 0;
          font-weight: 700;
          color: #6c8aff;
        }
        .atc-steps { counter-reset: atc-step; }
        .atc-steps li strong { color: #c9d1e0; }
        .atc-steps code {
          font-family: 'Fira Mono', monospace;
          background: #1a1d27;
          border-radius: 3px;
          padding: 0 0.3em;
          font-size: 0.82em;
          color: #a9d4ff;
        }

        /* ---- iframe card (table is served from authenticated server route) ---- */
        .atc-iframe-card {
          border: 1px solid #2d3147;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 1.25rem;
          background: #0f1117;
        }
        .atc-iframe-card iframe {
          display: block;
          width: 100%;
          border: none;
          min-height: 300px;
          transition: height 0.2s ease;
        }

        /* ---- tutor section ---- */
        .atc-tutor-section {
          border: 1px solid #2d3147;
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1.25rem;
          background: #12141e;
        }
        .atc-tutor-title {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9988dd;
          margin: 0 0 0.75rem;
          font-weight: 700;
        }
        #${u}-message {
          display: block;
          width: 100%;
          min-height: 4.2rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.92rem;
          line-height: 1.55;
          color: #c9d1e0;
          background: #0f1117;
          border: 1px solid #2d3147;
          border-radius: 7px;
          resize: vertical;
          box-sizing: border-box;
          transition: border-color 0.15s;
        }
        #${u}-message:focus {
          border-color: #6c8aff;
          outline: none;
          box-shadow: 0 0 0 3px rgba(108, 138, 255, 0.18);
        }
        .atc-charcount {
          font-size: 0.7rem;
          color: #445;
          text-align: right;
          margin-top: 0.2rem;
        }
        .atc-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 0.65rem;
        }
        .atc-btn-ask {
          padding: 0.42rem 1.1rem;
          background: linear-gradient(135deg, #4a6cf7, #7c3aed);
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.1s;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .atc-btn-ask:disabled { opacity: 0.5; cursor: not-allowed; }
        .atc-btn-ask:not(:disabled):hover { opacity: 0.88; transform: translateY(-1px); }
        .atc-btn-token {
          padding: 0.4rem 0.9rem;
          background: transparent;
          color: #7788aa;
          border: 1px solid #2d3147;
          border-radius: 6px;
          font-size: 0.82rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .atc-btn-token:hover { border-color: #6c8aff; color: #aab; }

        /* ---- spinner ---- */
        .atc-spinner {
          display: inline-block;
          width: 0.9em;
          height: 0.9em;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: atc-spin 0.6s linear infinite;
          vertical-align: middle;
        }
        @keyframes atc-spin { to { transform: rotate(360deg); } }

        /* ---- status messages ---- */
        .atc-status {
          margin-top: 0.6rem;
          padding: 0.45rem 0.9rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        .atc-status--info    { background: #1a2840; color: #88bbff; border: 1px solid #224; }
        .atc-status--success { background: #0f2018; color: #7dd98a; border: 1px solid #234; }
        .atc-status--warning { background: #251d08; color: #ffcc66; border: 1px solid #432; }
        .atc-status--danger  { background: #200e0e; color: #ff8888; border: 1px solid #422; }

        /* ---- transcript ---- */
        #${u}-transcript {
          margin-top: 0.75rem;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 4px;
        }
        .atc-empty { font-size: 0.82rem; color: #445; font-style: italic; }
        .atc-turn {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.6rem;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .atc-turn-label { flex-shrink: 0; font-weight: 700; width: 3.5rem; }
        .atc-turn--you .atc-turn-label { color: #88aaff; }
        .atc-turn--tutor .atc-turn-label { color: #9988dd; }
        .atc-turn-content { color: #b0bcd4; white-space: pre-wrap; word-break: break-word; }

        /* ---- final answer section ---- */
        .atc-answer-section { margin-top: 0.5rem; }
        .atc-answer-label { font-weight: 600; margin-bottom: 0.4rem; display: block; color: #c9d1e0; }
        .atc-answer-hint { font-size: 0.78rem; color: #556; margin-top: 0.35rem; }
      </style>

      <!-- Intro -->
      <div class="atc-intro">
        <p>
          A <strong>unique arithmetic puzzle</strong> has been generated just for you.
          Each fictional operator (e.g. <code>ZOK</code>, <code>VEX</code>) follows a hidden
          mathematical formula. Study the worked examples, deduce the formula, then compute
          the <strong>target row's output</strong> (marked <code style="color:#a8d98a">?</code>).
        </p>
      </div>

      <!-- How-to steps -->
      <ol class="atc-steps">
        <li>
          <strong>Observe.</strong> Each row shows <code>Op(A, B) = Output</code>.
          Look for patterns — does the output scale with A? Does swapping A and B change the result?
        </li>
        <li>
          <strong>Hypothesise.</strong> The formula may be linear (<code>p*A + q*B</code>),
          quadratic (<code>p*A^2 + q*B</code>), a shifted product, or XOR-based.
          Try to pin down the formula type before guessing coefficients.
        </li>
        <li>
          <strong>Ask the tutor.</strong> Describe your hypothesis and the tutor will
          confirm or correct your reasoning. Once you know the exact formula, plug in
          the target values yourself — the tutor will not compute the final answer for you.
        </li>
      </ol>

      <!-- Artifact table (rendered server-side; formula code never reaches browser) -->
      <div class="atc-iframe-card">
        <iframe
          id="${u}-iframe"
          title="Your assigned rule table"
          src="${n}"
        ></iframe>
      </div>

      <!-- Tutor chat -->
      <div class="atc-tutor-section">
        <p class="atc-tutor-title">Chat here with AI</p>
        <textarea
          id="${u}-message"
          maxlength="${v}"
          placeholder='e.g. "I think ZOK multiplies A by something and adds B — is that right?"'
          rows="3"
        ></textarea>
        <div class="atc-charcount"><span id="${u}-charcount">0 / ${v}</span></div>
        <div class="atc-actions">
          <button type="button" class="atc-btn-ask" id="${u}-ask">Ask tutor</button>
          <button type="button" class="atc-btn-token" id="${u}-token">Use another AI Pipe token</button>
        </div>
        <div id="${u}-status" hidden></div>
        <div id="${u}-transcript"></div>
      </div>

      <!-- Final answer -->
      <div class="atc-answer-section">
        <label for="${u}" class="atc-answer-label">Your computed output for the target row</label>
        <input
          class="form-control"
          id="${u}"
          name="${u}"
          autocomplete="off"
          placeholder="Enter the numeric output, e.g. 42"
          style="max-width: 200px; font-family: monospace; font-size: 1.05rem;"
        />
        <p class="atc-answer-hint">
          Scoring is all-or-none: full marks for the correct value, zero otherwise.
        </p>
      </div>
    </div>
  `;return{id:u,title:t,weight:o,question:l,answer:async a=>{let s=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:a,weight:o,questionId:u,version:r})}),d=await s.json();if(!s.ok)throw new Error(d.error||"Unable to verify your answer.");return d}}}var ne,u,v,ce=f(()=>{"use strict";ne=new Je;ne.use(Ve({throwOnError:!1,nonStandard:!0}));u="q-ai-tutor-challenge-server",v=700});import{html as $,render as me}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function L(e,o){let r=$`<ol class="mt-3">
    ${e.map(({id:l,title:i,weight:a})=>$`<li><a href="#h${l}">${i}</a> (${a} ${a==1?"mark":"marks"})</li>`)}
  </ol>`,t=[$`<h1 class="display-6">Questions</h1>`,r,...e.map(({id:l,title:i,weight:a,question:s,help:d},c)=>(d&&!Array.isArray(d)&&(d=[d]),$`
        <div class="card my-5" data-question="${l}" id="h${l}">
          <div class="card-header">
            <span class="badge text-bg-primary me-2">${c+1}</span>
            ${i} (${a} ${a==1?"mark":"marks"})
          </div>
          ${d?d.map(m=>$`<div class="card-body border-bottom">${m}</div>`):""}
          <div class="card-body">${s}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${l}">Check</button>
          </div>
        </div>
      `))],n={index:r,questions:t};for(let[l,i]of o)me(n[i],l)}async function gt(e,o){let r=[{...await Promise.resolve().then(()=>(j(),M)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(P(),D)).then(t=>t.default({user:e,weight:.2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(N(),Y)).then(t=>t.default({user:e,weight:.2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(H(),B)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(F(),W)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(G(),J)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(Q(),K)).then(t=>t.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(Z(),X)).then(t=>t.default({user:e,weight:2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(te(),ee)).then(t=>t.default({user:e,weight:.2}))},{...await Promise.resolve().then(()=>(ae(),re)).then(t=>t.default({user:e,weight:.2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(se(),ie)).then(t=>t.default({user:e,weight:2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(ce(),le)).then(t=>t.default({user:e,weight:1,version:"roe-2026-05-v1"}))}];return L(r,o),Object.fromEntries(r.map(({id:t,...n})=>[t,n]))}export{gt as questions};
