var ce=Object.defineProperty;var p=(e,o)=>()=>(e&&(o=e(e=0)),o);var y=(e,o)=>{for(var a in o)ce(e,a,{get:o[a],enumerable:!0})};var L={};y(L,{default:()=>ue});import{html as he}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ue({user:e,weight:o=4,version:a=""}){let t="q-incident-atlas-route-server",r="tds-2026-05-roe",i="Incident Atlas \u2014 Georegister and Route",s=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&quiz=${encodeURIComponent(r)}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(a)}`,l=he`
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
        src="${s}"
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
  `;return{id:t,title:i,weight:o,question:l,answer:async c=>{let h=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,quiz:r,response:c,weight:o,questionId:t,version:a})}),n=await h.json();if(!h.ok)throw new Error(n.error||"Unable to verify the route certificate.");return n}}}var _=p(()=>{"use strict"});var P={};y(P,{default:()=>pe});import{html as me}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function pe({user:e,weight:o=5,version:a=""}){let t="q-unicode-doppelganger-ledger-server",r="tds-2026-05-roe",i="Unicode Doppelganger Ledger Forensics",s=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&quiz=${encodeURIComponent(r)}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(a)}`,l=me`
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
        src="${s}"
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
  `;return{id:t,title:i,weight:o,question:l,answer:async c=>{let h=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,quiz:r,response:c,weight:o,questionId:t,version:a})}),n=await h.json();if(!h.ok)throw new Error(n.error||"Unable to verify the forensic certificate.");return n}}}var N=p(()=>{"use strict"});var D={};y(D,{HTTP_CACHE_TIME_MACHINE_QUESTION_ID:()=>j,default:()=>ge});import{html as fe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ge({user:e,weight:o=4,version:a=""}){let t=j,r="tds-2026-05-roe",i="HTTP Cache Time Machine \u2014 Reconstruct the Shared Cache",s=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&quiz=${encodeURIComponent(r)}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(a)}`,l=fe`
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
        src="${s}"
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
  `;return{id:t,title:i,weight:o,question:l,answer:async c=>{let h=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,quiz:r,response:c,weight:o,questionId:t,version:a})}),n=await h.json();if(!h.ok)throw new Error(n.error||"Unable to verify the cache certificate.");return n}}}var j,H=p(()=>{"use strict";j="q-http-cache-time-machine-server"});async function x(e){let a=new TextEncoder().encode(e),t=await crypto.subtle.digest("SHA-256",a);return Array.from(new Uint8Array(t)).map(s=>s.toString(16).padStart(2,"0")).join("")}var M=p(()=>{"use strict"});var F={};y(F,{default:()=>xe});import{html as Y}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function be(e){return String(e??"").trim().toLowerCase().replace(/[.’']/g,"").replace(/\s+/g," ").trim()}function ve(e){return String(e??"").trim().toLowerCase().replace(/[^a-z0-9]/g,"")}function W(e,o=4){let a=String(e??"").trim().replace(/\s+/g," ").replace(/°/g,"").replace(/,/g,"");if(!a)return null;let t=!1,r=a.match(/^([NSEWnsew])\s*(.+)$/)||a.match(/^(.+?)\s*([NSEWnsew])$/);if(r){let[,v,S]=r,A=/^[NSEWnsew]$/.test(v),C=A?v:S;a=(A?S:v).trim(),t=/[SWsw]/.test(C)}let i=a.match(/^([+-]?)(\d+)(?:\.(\d+))?$/);if(!i)return null;let[,s,l,d=""]=i,c=s==="-"!==t,h=d.padEnd(o+1,"0"),n=h.slice(0,o),f=h[o]>="5",m=l+n;f&&(m=(BigInt(m)+1n).toString().padStart(m.length,"0"));let k=/^0+$/.test(m),u=c&&!k?"-":"",b=m.length-o;return`${u}${m.slice(0,b)||"0"}.${m.slice(b)}`}function we(e){let o=String(e??"").split(",").map(s=>s.trim());if(o.length!==4||o.some(s=>!s))throw new Error("Answer must be 4 comma-separated values: Place, Country, Latitude, Longitude.");let[a,t,r,i]=o;return{place:a,country:t,lat:r,lon:i}}async function xe({user:e,weight:o=4,version:a=""}){let t="q-streetview-geolocation-server",r="Street View OSINT: Where Is This?",i=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(a)}`,s=null,l=null;try{let n=await fetch(i);if(!n.ok)throw new Error(await n.text()||`HTTP ${n.status}`);s=await n.json()}catch(n){l=n instanceof Error?n.message:String(n)}if(!s){let n=Y`
      <div class="alert alert-danger" role="alert">
        <strong><i class="bi bi-exclamation-triangle-fill"></i> Could not load this question's data.</strong>
        <p class="mb-0">${l}</p>
        <p class="mb-0">Try reloading the page. If this persists, contact the exam team.</p>
      </div>
    `;return{id:t,title:r,weight:o,question:n,answer:async()=>({correct:!1,message:l})}}let d=`${ye}/${s.file}`,c=Y`
    <div class="mb-3">
      <div style="background:linear-gradient(135deg,#0c2d48 0%,#145da0 100%);border-radius:12px;padding:22px 26px;margin-bottom:20px;color:#e6f3ff;">
        <div style="font-size:11px;letter-spacing:2px;color:#8ecdf7;text-transform:uppercase;margin-bottom:6px;">OSINT · Street View Geolocation</div>
        <div style="font-size:20px;font-weight:700;margin-bottom:8px;">🌍 Where in the world is this?</div>
        <div style="font-size:15px;line-height:1.6;">
          You've been given <strong>one</strong> Street View image below. Using only publicly available
          information (visual clues, reverse image search, road signs, architecture, vegetation, language on
          signage, etc.), identify exactly where it was taken.
        </div>
      </div>

      <img
        src="${d}"
        alt="Street View location to identify"
        loading="lazy"
        style="display:block;max-width:100%;width:100%;border-radius:10px;border:1px solid #dee2e6;margin-bottom:18px;"
      />

      <h5><i class="bi bi-list-check"></i> What to submit</h5>
      <p>
        Enter your answer as <strong>4 comma-separated values, in this order</strong>:
        <code>Place, Country, Latitude, Longitude</code>. Each of the 4 values is graded
        independently and worth <strong>25% of this question</strong> — partial credit is given for
        whichever parts you get right.
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
          <li>Latitude/longitude must match to <strong>exactly 4 decimal places</strong> — no tolerance. You
            can write a hemisphere letter (e.g. <code>94.5583 W</code>) instead of a minus sign if you
            prefer.</li>
          <li>Checking your answer here is instant and never calls an external API — everything is verified
            against a one-way hash, so the correct answer can't be read off the network. Your final
            submission is independently re-verified on the server the same way.</li>
        </ul>
      </div>

      <p class="text-muted">
        Worth <strong>${o} ${o==1?"mark":"marks"}</strong> total, split evenly across the
        four values above.
      </p>
    </div>
  `;return{id:t,title:r,weight:o,question:c,answer:async n=>{let f=we(n),m=ve(f.place),k=be(f.country),u=W(f.lat),b=W(f.lon),[v,S,A,C]=await Promise.all([x(m),x(k),x(u??""),x(b??"")]),R={place:v===s.hashes.place,country:S===s.hashes.country,lat:u!==null&&A===s.hashes.lat,lon:b!==null&&C===s.hashes.lon},I=Object.entries(R).reduce((g,[ne,le])=>g+(le?q[ne]:0),0),E=Object.keys(q).filter(g=>R[g]).map(g=>B[g]),re=Object.keys(q).filter(g=>!R[g]).map(g=>B[g]),U=I===1?Number(o):Math.round(Number(o)*I*1e4)/1e4,ie=I===1?"All four correct: place, country, latitude, and longitude all match.":`${E.length}/4 correct. Matched: ${E.length?E.join(", "):"none"}. Recheck: ${re.join(", ")}.`;return{correct:U>0,score:U,message:ie}}}}var ye,q,B,G=p(()=>{"use strict";M();ye="https://temp.mynkpdr.in";q={place:.25,country:.25,lat:.25,lon:.25},B={place:"place",country:"country",lat:"latitude",lon:"longitude"}});var K={};y(K,{default:()=>Ae});import{html as O}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Se(e,o){let a=o.textContent;try{await navigator.clipboard.writeText(e),o.textContent="Copied"}catch{o.textContent="Press Ctrl+C"}setTimeout(()=>o.textContent=a,1200)}async function Ae({user:e,weight:o=5,version:a=""}){let t="q-handshake-server",r="Secret Handshake: Prove You Collaborated",i=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(a)}`,s=null,l=null;try{let u=await fetch(i);if(!u.ok)throw new Error(await u.text()||`HTTP ${u.status}`);s=await u.json()}catch(u){l=u instanceof Error?u.message:String(u)}if(!s){let u=O`
      <div class="alert alert-danger" role="alert">
        <strong><i class="bi bi-exclamation-triangle-fill"></i> Could not load this question's data.</strong>
        <p class="mb-0">${l}</p>
        <p class="mb-0">Try reloading the page. If this persists, contact the exam team.</p>
      </div>
    `;return{id:t,title:r,weight:o,question:u,answer:async()=>({correct:!1,message:l})}}let{key:d,email:c,target:h,tagLength:n}=s,f=ke(d),m=O`
    <div class="mb-3">
      <p class="fs-5 border-start border-4 border-primary ps-3 mb-4">
        Shake hands with <strong>${h} classmates</strong>. A handshake takes two codes, and each of you
        can only compute one of them — so you cannot do this alone, and a code copied from a group chat will
        never work for you.
      </p>

      <h6 class="text-uppercase text-secondary fw-semibold" style="letter-spacing:.06em">Your identity</h6>
      <div class="border rounded p-3 mb-4">
        <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
          <span class="text-secondary" style="min-width:6rem">Your email</span>
          <code class="fs-6">${c}</code>
          ${$(c)}
          <span class="form-text w-100 m-0">Classmates must use exactly this when making a code for you.</span>
        </div>
        <div class="d-flex flex-wrap align-items-center gap-2">
          <span class="text-secondary" style="min-width:6rem">Your key</span>
          <code class="fs-6">${d}</code>
          ${$(d)}
          <span class="form-text w-100 m-0">Yours alone. Keep it private — anyone with it can act as you.</span>
        </div>
      </div>

      <h6 class="text-uppercase text-secondary fw-semibold" style="letter-spacing:.06em">How it works</h6>
      <ol class="mb-4">
        <li class="mb-1">
          Pick a classmate. Run <code>code("c", their_email)</code> and send them the result. That is your
          <strong>challenge</strong>.
        </li>
        <li class="mb-1">
          They run <code>code("r", your_challenge)</code> with <em>their</em> key and send it back. That is the
          <strong>response</strong>. Only they can produce it.
        </li>
        <li class="mb-1">Save the row, then do the same for them so you both get credit.</li>
        <li>Repeat until you have ${h} different classmates.</li>
      </ol>

      <h6 class="text-uppercase text-secondary fw-semibold" style="letter-spacing:.06em">
        Your code, ready to run
        <span class="badge text-bg-light border align-middle ms-1 fw-normal text-lowercase">key already filled in</span>
      </h6>
      <div class="position-relative mb-2">
        <div class="position-absolute top-0 end-0 p-2">${$(f,"Copy code")}</div>
        <pre class="border rounded bg-body-tertiary p-3 mb-0"><code>${f}</code></pre>
      </div>
      <details class="mb-4">
        <summary class="text-secondary small">Exact recipe, if you would rather write your own</summary>
        <p class="form-text mb-0">
          HMAC-SHA256, keeping the first <strong>${n}</strong> characters of the lowercase hex digest.
          The key and the message are both plain UTF-8 text — do not hex-decode the key. Emails are lowercased
          and trimmed. The separator is one <code>|</code> with no spaces, so the messages are
          <code>"c|" + their_email</code> and <code>"r|" + challenge</code>.
        </p>
      </details>

      <h6 class="text-uppercase text-secondary fw-semibold" style="letter-spacing:.06em">What to submit</h6>
      <p class="mb-2">One row per classmate. Partial work counts, so submit whatever you have.</p>
      <div class="position-relative mb-3">
        <div class="position-absolute top-0 end-0 p-2">${$(V,"Copy format")}</div>
        <pre class="border rounded bg-body-tertiary p-3 mb-0"><code>${V}</code></pre>
      </div>

      <label for="${t}" class="form-label fw-semibold">Your handshakes</label>
      <textarea
        class="form-control font-monospace"
        id="${t}"
        name="${t}"
        rows="7"
        spellcheck="false"
        placeholder='[{"peer":"classmate1@ds.study.iitm.ac.in","challenge":"...","response":"..."}]'
      ></textarea>

      <p class="form-text mt-3 mb-0">
        Worth <strong>${o} ${o==1?"mark":"marks"}</strong>, scaled by verified classmates
        (${h} for full marks). Each classmate counts once; you cannot shake your own hand. If a row
        fails, the feedback names which half was wrong — a bad challenge is yours to fix, a bad response is
        theirs.
      </p>
    </div>
  `;return{id:t,title:r,weight:o,question:m,answer:async u=>{let b=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:u,weight:o,questionId:t,version:a})}),v=await b.json();if(!b.ok)throw new Error(v.error||"Verification failed.");return v}}}var ke,V,$,J=p(()=>{"use strict";ke=e=>`import hashlib
import hmac

MY_KEY = "${e}"


def code(tag, message):
    mac = hmac.new(MY_KEY.encode(), f"{tag}|{message}".encode(), hashlib.sha256)
    return mac.hexdigest()[:16]


# Step 1 -- your challenge for a classmate. Send them what this prints.
print(code("c", "classmate@ds.study.iitm.ac.in"))

# Step 2 -- your reply to a challenge they sent you. Send it back to them.
print(code("r", "paste-their-challenge-here"))`,V=`[
  { "peer": "classmate1@ds.study.iitm.ac.in", "challenge": "9d62f8f2634e1a32", "response": "2650e57a80bd4aaa" },
  { "peer": "classmate2@ds.study.iitm.ac.in", "challenge": "b7230cf892f795cb", "response": "7ce1e72f8b0f04ea" }
]`;$=(e,o="Copy")=>O`<button
    type="button"
    class="btn btn-sm btn-outline-secondary"
    @click=${a=>Se(e,a.currentTarget)}
  >${o}</button>`});var Q={};y(Q,{default:()=>Ce});import{html as $e}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Ce({weight:e=.2}){let o="q-donate-marks",a="Donate Your Marks",t=$e`
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
        <strong>Record your donations in the Google Form</strong> (your emails stay private there until the
        public reveal &mdash; they are not shown in the exam results):
      </p>
      <p>
        <a href="${Te}" target="_blank" rel="noopener" class="btn btn-primary">
          🎁 Open the Donation Form
        </a>
      </p>

      <div class="form-check mt-4">
        <input class="form-check-input" type="checkbox" id="${o}-ack" onchange="
          this.form['${o}'].value = this.checked ? 'acknowledged' : '';
          this.closest('.was-validated')?.classList.remove('was-validated');
          this.form.dispatchEvent(new Event('input', { bubbles: true }));
        ">
        <label class="form-check-label" for="${o}-ack">
          I have read the rules above and recorded my choice in the Donation Form.
        </label>
      </div>
      <input type="hidden" class="form-control" name="${o}" id="${o}">
      <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" onload="
        setTimeout(() => {
          const form = this.closest('form');
          if (!form) return;
          const hiddenInput = form['${o}'];
          setInterval(() => {
            const val = hiddenInput.value || '';
            if (val !== this.dataset.lastVal) {
              this.dataset.lastVal = val;
              const cb = form.querySelector('#${o}-ack');
              if (cb) cb.checked = val === 'acknowledged';
            }
          }, 300);
        }, 50);
      " style="display:none;" alt="">
      <p class="text-muted small mt-2">
        This card records your <strong>participation</strong> (${e} ${e==1?"mark":"marks"}).
        The rest of the 1.5 marks &mdash; whatever classmates donate to you &mdash; is settled from the Form
        after the deadline and added to your final grade.
      </p>
    </div>
  `;return{id:o,title:a,weight:e,question:t,answer:async i=>{if(!i)throw new Error("Tick the box to confirm you have recorded your choice in the Donation Form.");return{correct:!0,score:e,validMessage:"Acknowledged. Remember: your Form responses as of the deadline are final."}}}}var Te,X=p(()=>{"use strict";Te="https://forms.gle/FXwQbFnC4kTNTXo8A"});var Z={};y(Z,{default:()=>Ee});import{html as Re}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Ee({weight:e=.2}={}){let o="q-donate-audio",a="Donate Your Marks \u2014 Tell Them Why (Audio)",t=async i=>{let s=(i||"").trim();if(!s)throw new Error("Submission is empty. Paste your public, CORS-enabled audio URL.");let l;try{l=new URL(s)}catch{throw new Error(`Not a valid URL: "${s.slice(0,80)}"`)}if(!/^https?:$/.test(l.protocol))throw new Error("URL must start with http:// or https://");let d="\u26A0\uFE0F We couldn't fetch it from the browser. Make sure it's public, CORS-enabled, actually an audio file, and stays live for at least 1 week after the ROE. It will be graded offline.";try{let c=await fetch(s,{method:"GET",mode:"cors",cache:"no-store"});if(c.ok){let h=c.headers.get("content-type")||"";d=Ie.test(h)?"\u2705 Reachable and CORS-enabled, and it looks like audio. Keep it live for 1 week after the ROE.":`\u26A0\uFE0F Reachable and CORS-enabled, but the Content-Type is "${h||"unknown"}", not audio/*. Double-check you linked the audio file itself.`}else d=`\u26A0\uFE0F The URL returned HTTP ${c.status}. Make sure it's publicly accessible. Graded offline.`}catch{}return{correct:!0,score:e,validMessage:`Saved. ${d}`}},r=Re`
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
            (e.g. <code>.mp3</code>, <code>.m4a</code>, <code>.webm</code>, <code>.wav</code>) and return an
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
        which is low. Be specific about <em>why</em>.
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
  `;return{id:o,title:a,weight:e,question:r,answer:t}}var Ie,ee=p(()=>{"use strict";Ie=/^audio\//i});var te={};y(te,{default:()=>Le});import{html as qe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function ze(e){return new Promise(o=>{let a=!1,t=s=>{a||(a=!0,clearTimeout(i),r.removeAttribute("src"),o(s))},r=new Audio;r.preload="metadata",r.crossOrigin="anonymous",r.addEventListener("loadedmetadata",()=>{let s=r.duration;t(Number.isFinite(s)&&s>0?s:null)}),r.addEventListener("error",()=>t(null));let i=setTimeout(()=>t(null),Ue);r.src=e})}async function Le({weight:e=.2}={}){let o="q-initiative-audio",a="Something You Did On Your Own Initiative (Audio)",t=async i=>{let s=(i||"").trim();if(!s)throw new Error("Submission is empty. Paste your public, CORS-enabled audio URL.");let l;try{l=new URL(s)}catch{throw new Error(`Not a valid URL: "${s.slice(0,80)}"`)}if(!/^https?:$/.test(l.protocol))throw new Error("URL must start with http:// or https://");let d="\u26A0\uFE0F We couldn't fetch it from the browser. Make sure it's public, CORS-enabled, actually an audio file, and stays live for at least 1 week after the ROE. It will be graded offline.";try{let c=await fetch(s,{method:"GET",mode:"cors",cache:"no-store"});if(c.ok){let h=c.headers.get("content-type")||"";if(Oe.test(h)){let n=await ze(s);n==null?d=`\u2705 Reachable and CORS-enabled, and it looks like audio. We couldn't measure its duration from the browser (this check is optional) \u2014 keep it under ${T}s and live for 1 week after the ROE.`:n<=T+2?d=`\u2705 Reachable and CORS-enabled, audio, and about ${Math.round(n)}s long (\u2264 ${T}s). Keep it live for 1 week after the ROE.`:d=`\u26A0\uFE0F Reachable and CORS-enabled, and it's audio, but it looks like ~${Math.round(n)}s long \u2014 over the ${T}s limit. This duration check is advisory only and won't block this mark, but it will count against you offline.`}else d=`\u26A0\uFE0F Reachable and CORS-enabled, but the Content-Type is "${h||"unknown"}", not audio/*. Double-check you linked the audio file itself.`}else d=`\u26A0\uFE0F The URL returned HTTP ${c.status}. Make sure it's publicly accessible. Graded offline.`}catch{}return{correct:!0,score:e,validMessage:`Saved. ${d}`}},r=qe`
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
          <div><strong>Paste the audio URL below</strong> and press <kbd>Check</kbd> — we'll try to fetch it from your browser, and if possible, estimate its duration.</div>
        </div>
      </div>

      <h5 class="mt-4"><i class="bi bi-globe"></i> What counts as a good public artifact?</h5>
      <p>Anything a stranger (or an agent) can independently find and check, such as:</p>
      <ul>
        <li>A GitHub repo, commit, issue, or pull request — <strong>ideally dated well before this exam</strong>, but just before or even during the exam window is acceptable</li>
        <li>A blog post, forum post, or Stack Overflow answer with a visible date and your name/handle</li>
        <li>A published package (npm, PyPI, etc.), a live demo/website, or a dataset/notebook you released publicly</li>
        <li>A hackathon or competition entry, leaderboard placement, or a public certificate-verification page</li>
        <li>A video, talk, or public post you can link to, with a visible upload/publish date</li>
      </ul>
      <p class="text-muted">
        Vague claims with nothing an agent can look up ("I read a book on weekends") will score low, even if
        true — the whole point is <em>verifiability</em>.
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

      <label for="${o}" class="form-label"><strong>Public, CORS-enabled audio URL</strong></label>
      <input
        type="url"
        class="form-control font-monospace"
        id="${o}"
        name="${o}"
        placeholder="https://your-host.example.com/my-initiative.mp3"
      />
    </div>
  `;return{id:o,title:a,weight:e,question:r,answer:t}}var Oe,T,Ue,oe=p(()=>{"use strict";Oe=/^audio\//i,T=120,Ue=6e3});var ae={};y(ae,{default:()=>Ne});import{html as _e}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Ne({user:e,weight:o=.2}={}){let a="q-unusual-useful-essay-server",t="The Unusual Useful Essay",r=async s=>{let l=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:s,weight:o,questionId:a})}),d=await l.json();if(!l.ok)throw new Error(d.error||"Unable to validate your essay.");return d},i=_e`
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
        <p class="mb-0">${Pe}</p>
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

      <label for="${a}" class="form-label"><strong>Your essay</strong></label>
      <textarea
        class="form-control"
        id="${a}"
        name="${a}"
        rows="9"
        maxlength="1800"
        placeholder="Write 110–150 words…"
        aria-describedby="counter-${a}"
        oninput="
          const words = (this.value.match(/[\\p{L}\\p{N}]+(?:['’][\\p{L}\\p{N}]+)*/gu) || []).length;
          document.getElementById('counter-${a}').textContent = words + ' / 110–150 words';
          this.closest('.was-validated')?.classList.remove('was-validated');
        "
      ></textarea>
      <div id="counter-${a}" class="text-end text-muted small mt-1">0 / 110–150 words</div>
    </div>
  `;return{id:a,title:t,weight:o,question:i,answer:r}}var Pe,se=p(()=>{"use strict";Pe="Which human skills will matter most in the AI era, and why?"});import{html as w,render as de}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function z(e,o){let a=w`<ol class="mt-3">
    ${e.map(({id:i,title:s,weight:l})=>w`<li><a href="#h${i}">${s}</a> (${l} ${l==1?"mark":"marks"})</li>`)}
  </ol>`,t=[w`<h1 class="display-6">Questions</h1>`,a,...e.map(({id:i,title:s,weight:l,question:d,help:c},h)=>(c&&!Array.isArray(c)&&(c=[c]),w`
        <div class="card my-5" data-question="${i}" id="h${i}">
          <div class="card-header">
            <span class="badge text-bg-primary me-2">${h+1}</span>
            ${s} (${l} ${l==1?"mark":"marks"})
          </div>
          ${c?c.map(n=>w`<div class="card-body border-bottom">${n}</div>`):""}
          <div class="card-body">${d}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${i}">Check</button>
          </div>
        </div>
      `))],r={index:a,questions:t};for(let[i,s]of o)de(r[s],i)}async function et(e,o){let a=[{...await Promise.resolve().then(()=>(_(),L)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(N(),P)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(H(),D)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(G(),F)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(J(),K)).then(t=>t.default({user:e,weight:5,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(X(),Q)).then(t=>t.default({user:e,weight:.2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(ee(),Z)).then(t=>t.default({user:e,weight:.2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(oe(),te)).then(t=>t.default({user:e,weight:.2,version:"roe-2026-05-v1"}))},{...await Promise.resolve().then(()=>(se(),ae)).then(t=>t.default({user:e,weight:.2}))}];return z(a,o),Object.fromEntries(a.map(({id:t,...r})=>[t,r]))}export{et as questions};
