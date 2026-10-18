var Re=Object.defineProperty;var x=(e,t)=>()=>(e&&(t=e(e=0)),t);var E=(e,t)=>{for(var r in t)Re(e,r,{get:t[r],enumerable:!0})};var Y={};E(Y,{default:()=>Ae,httpbinAssignment:()=>J});import{html as Ie}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function J(e){let t=2166136261;for(let r of String(e||"").trim().toLowerCase())t=Math.imul(t^r.charCodeAt(0),16777619)>>>0;return{tag:`http-${t.toString(16)}`,quantity:2+t%19,status:[400,404,418,422][t%4]}}async function Ae({user:e,weight:t=2}){let r="q-termlog-httpbin-server",o="HTTPBin terminal lab (termlog)",{tag:n,quantity:s,status:c}=J(e.email),d=`capture() { task="$1"; shift; printf '\\nHTTPBIN_BEGIN ${n} %s\\n' "$task"; "$@"; printf '\\nHTTPBIN_END ${n} %s\\n' "$task"; }`,l=Ie`
    <div class="mb-3">
      <p>Practice HTTP requests with <a href="https://httpbin.org/" target="_blank" rel="noopener">HTTPBin</a>.
        Complete all seven exercises with curl in one signed terminal recording.</p>
      <p>Install <a href="https://github.com/mynkpdr/termlog" target="_blank" rel="noopener">termlog</a>,
        run <code>termlog login</code> as <strong>${e.email}</strong>, then start
        <code>termlog rec httpbin.cast</code>. Use a bash-compatible shell.</p>
      <p>Your tag and dummy bearer token: <code>${n}</code>. Quantity: <code>${s}</code>.</p>
      <p>Inside the recording, define this helper. It wraps each command's output with grader markers:</p>
      <pre>${d}</pre>
      <p>Run each request as <code>capture TASK curl -sS ...</code>, replacing TASK with the label below
        and choosing the appropriate curl options. Do not use <code>-i</code> or print extra text inside captures.</p>
      <ol>
        <li><strong>GET:</strong> GET <code>https://httpbin.org/get</code> with query parameters
          <code>course=TDS</code>, <code>tag=${n}</code>, and request header <code>X-Exam-Tag: ${n}</code>.</li>
        <li><strong>POST:</strong> POST to <code>https://httpbin.org/post</code> using
          <code>Content-Type: application/json</code> and body
          <code>${JSON.stringify({tag:n,quantity:s,active:!0})}</code>. Preserve number and boolean types.</li>
        <li><strong>FORM:</strong> PUT to <code>https://httpbin.org/put</code> using URL-encoded form fields
          <code>tag=${n}</code> and <code>quantity=${s}</code>.</li>
        <li><strong>AUTH:</strong> GET <code>https://httpbin.org/bearer</code> with
          <code>Authorization: Bearer ${n}</code>. This is a dummy token; never use a real API key.</li>
        <li><strong>REDIRECT:</strong> Call <code>https://httpbin.org/redirect-to</code> with its
          <code>url</code> parameter pointing to <code>https://httpbin.org/get?tag=${n}</code>.
          Follow the redirect and capture the final JSON body.</li>
        <li><strong>COOKIES:</strong> First call <code>https://httpbin.org/cookies/set?exam=${n}</code>
          and save its cookie to a cookie jar. Then capture a GET to <code>https://httpbin.org/cookies</code>
          using that jar. Only the final GET belongs inside the COOKIES capture.</li>
        <li><strong>STATUS:</strong> Request <code>https://httpbin.org/status/${c}</code>, discard its body,
          and use curl's <code>--write-out</code> option to print only the numeric HTTP status. Capture that output.</li>
      </ol>
      <p>Inspect the real responses. If HTTPBin temporarily fails, repeat the affected task; the last complete
        capture for each label is checked. End with <code>exit</code> and package your recording and receipt:</p>
      <pre>tar -czf submission.tar.gz httpbin.cast httpbin.cast.jwt</pre>
      <p>Upload the archive to a public file URL. The grader checks the signed receipt, your account, exit event,
        recorded commands and all seven outputs. Maximum 1 MB compressed and 5 MB uncompressed.</p>
      <label for="${r}" class="form-label">Public URL of submission.tar.gz</label>
      <input class="form-control" id="${r}" name="${r}" type="url" placeholder="https://.../submission.tar.gz" />
    </div>`;return{id:r,title:o,weight:t,question:l,answer:async a=>{let u=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:a,weight:t,questionId:r})}),m=await u.json();if(!u.ok)throw new Error(m.error||"Unable to verify.");return m}}}var G=x(()=>{"use strict"});var B={};E(B,{default:()=>Le});import{html as Pe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Le({user:e,weight:t=2}){let r="q-model-intelligence-auto-server",o="Differentiate model intelligence \u2014 automatic evaluation",n=Pe`
    <div class="mb-3">
      <p>Write one prompt that makes <strong>GPT-5 nano answer YES</strong> and
        <strong>GPT-5 mini answer NO</strong>. Try a subtle contradiction, a misleading premise or a reasoning
        problem that separates their behavior. This is a measured disagreement challenge, not proof of a
        universal intelligence ranking.</p>
      <ul>
        <li>The backend sends the identical prompt as a single user message to
          <code>gpt-5-nano-2025-08-07</code> and <code>gpt-5-mini-2025-08-07</code> through AI Pipe.
          No system message, tools, prior conversation or model-specific instructions are added.</li>
        <li>Both use minimal reasoning effort and a 2,048 completion-token cap. Include an instruction
          to answer only YES or NO in your own prompt.</li>
        <li>Three independent trials are run. In at least two trials, nano must reply YES and mini NO
          in that same trial. This earns full marks; otherwise zero.</li>
        <li>Case and surrounding whitespace are ignored; one final period or exclamation mark is allowed.
          Explanations, quoted answers and answers containing both words fail.</li>
        <li>Maximum 1,000 words and 12,000 characters. Submit just the prompt, not JSON or a token.</li>
        <li>Each completed evaluation is stored for your account and exact trimmed prompt. Checking or saving
          it again reuses that result, including failed results. Edit the prompt for a new evaluation.</li>
        <li>At most three uncached evaluation attempts per minute. Each uses six model calls and may take
          up to 45 seconds. Provider errors are not graded or cached; they still consume an attempt slot.</li>
      </ul>
      <p>Use your own <a href="https://aipipe.org/" target="_blank" rel="noopener">AI Pipe</a> token when
        prompted, just like the YES/NO model question. Each new evaluation uses your AI Pipe quota.
        Your token stays in this page's memory and is sent to the backend only to run the evaluation;
        it is not included in your saved answer. Save reuses the verified result without needing the token.
        You can inspect all six replies below after checking.</p>
      <label for="${r}" class="form-label">Your prompt</label>
      <textarea class="form-control" id="${r}" name="${r}" rows="8" maxlength="12000"
        placeholder="Write a prompt that ends by requesting only YES or NO."></textarea>
      <pre id="${r}-feedback" class="mt-3" style="white-space:pre-wrap" aria-live="polite"></pre>
    </div>`;return{id:r,title:o,weight:t,question:n,answer:async c=>{if(c=String(c||"").trim(),!c)throw new Error("Enter your prompt.");if(c.length>12e3||c.split(/\s+/u).length>1e3)throw new Error("Use at most 1,000 words and 12,000 characters.");globalThis.aiPipeToken||(globalThis.aiPipeToken=prompt("Enter your AI Pipe Token"));let d=String(globalThis.aiPipeToken||"").trim();if(!d)throw new Error("An AI Pipe token is required to run the model evaluation.");let l=document.getElementById(`${r}-feedback`);l&&(l.textContent="Evaluating with your AI Pipe token\u2026");let i=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${d}`},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:c,weight:t,questionId:r})}),a=await i.json();if(!i.ok)throw String(a.error||"").includes("AI Pipe rejected your token")&&(globalThis.aiPipeToken=null),l&&(l.textContent=a.error||"Unable to verify."),new Error(a.error||"Unable to verify.");return l&&(l.textContent=[a.message,...(a.rounds||[]).map(([u,m],p)=>`Trial ${p+1}:
GPT-5 nano: ${u}
GPT-5 mini: ${m}`)].join(`

`)),a}}}var K=x(()=>{"use strict"});var X={};E(X,{default:()=>Me});import{html as Ce}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import Ue from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function Ne(e,t=""){let r="abcdefghijklmnopqrstuvwxyz0123456789",o=Ue(`q-fastapi-metrics-cors-server#${(e||"").trim().toLowerCase()}#${t}`);return{allowedOrigin:`https://dash-${(s=>Array.from({length:s},()=>r[Math.floor(o()*r.length)]).join(""))(6)}.example.com`}}async function Me({user:e,weight:t=1.5,version:r=""}){let o="q-fastapi-metrics-cors-server",n="Deploy a CORS-Aware Metrics API",{allowedOrigin:s}=Ne(e.email,r),c=Ce`
    <div class="mb-3">
      <p>
        Build and deploy a <strong>FastAPI</strong> service that computes descriptive statistics and
        enforces a strict per-origin CORS policy. The grader probes your live service with a fresh
        batch of random integers on every check, so you must compute results rather than return
        hard-coded values.
      </p>

      <div style="background:#1e293b;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:0.88rem">
        <div style="color:#94a3b8;font-size:0.75rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Your assigned values</div>
        <div>
          <span style="color:#94a3b8">Allowed CORS origin</span><br/>
          <code style="color:#6ee7b7;font-size:0.95rem">${s}</code>
        </div>
      </div>

      <p><strong>Endpoint: <code>GET /stats?values=1,2,3,…</code></strong></p>
      <ul>
        <li>Parse the comma-separated integers from the <code>values</code> query parameter.</li>
        <li>
          Return JSON: <code>{"email": "&lt;your-email&gt;", "count": N, "sum": S, "min": M, "max": X,
          "mean": F}</code> — mean must be within ±0.01 of the true value.
        </li>
        <li>Include <code>email</code> exactly as your logged-in address.</li>
      </ul>

      <p><strong>CORS policy</strong></p>
      <ul>
        <li>
          Only your <em>assigned</em> allowed origin (shown above) must receive the
          <code>Access-Control-Allow-Origin</code> header — no wildcards (<code>*</code>).
        </li>
        <li>
          Preflight <code>OPTIONS /stats</code> from the allowed origin must succeed (return ACAO
          header); preflights from any other origin must be rejected (no ACAO header).
        </li>
      </ul>

      <p><strong>Required middleware headers</strong> — every response must carry:</p>
      <ul>
        <li><code>X-Request-ID</code>: a unique identifier for this request (e.g. a UUID).</li>
        <li>
          <code>X-Process-Time</code>: the handler duration in seconds as a non-negative decimal number
          (e.g. <code>0.001234</code>).
        </li>
      </ul>

      <p><strong>What the grader checks</strong></p>
      <ol>
        <li>Preflight from the allowed origin — expects ACAO header.</li>
        <li>Preflight from a random evil origin — must receive no ACAO header.</li>
        <li>
          <code>GET /stats?values=…</code> with a fresh random batch — checks all five stat fields plus
          <code>email</code>, <code>X-Request-ID</code>, and <code>X-Process-Time</code>.
        </li>
      </ol>

      <p>
        Deploy to any public host (Vercel, Render, Fly.io, Cloudflare Workers, HF Spaces, etc.) and
        paste your base URL below.
      </p>
      <label for="${o}" class="form-label"><strong>Your deployed service base URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-metrics.example.workers.dev" />
    </div>
  `;return{id:o,title:n,weight:t,question:c,answer:async l=>{let i=String(l||"").trim();if(!i)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(i))throw new Error("URL must start with http:// or https://.");let a;try{a=new URL(i).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(a))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let u=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:i,weight:t,questionId:o,version:r})}),m=await u.json();if(!u.ok)throw new Error(m.error||"Unable to verify.");return m}}}var W=x(()=>{"use strict"});var F={};E(F,{default:()=>Ge});import{html as je}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import _e from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function Ye(e,t=""){let r="abcdefghijklmnopqrstuvwxyz0123456789",o=_e(`q-oauth-jwks-verify-server#${(e||"").trim().toLowerCase()}#${t}`),n=s=>Array.from({length:s},()=>r[Math.floor(o()*r.length)]).join("");return{iss:De,aud:`tds-${n(8)}.apps.exam.local`,sub:`sub-${n(12)}`}}async function Ge({user:e,weight:t=2,version:r=""}){let o="q-oauth-jwks-verify-server",n="OAuth 2.0 / OIDC Token Verification Service",{iss:s,aud:c}=Ye(e.email,r),l=je`
    <div class="mb-3">
      <p>
        A mock identity provider (IdP) issues <strong>RS256 JWTs</strong>. Deploy a
        <strong>FastAPI</strong> <code>POST /verify</code> endpoint that validates an incoming token
        and returns a structured result. The grader mints a fresh set of valid, expired,
        wrong-audience, and tampered tokens on every check.
      </p>

      <div style="background:#1e293b;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:0.88rem">
        <div style="color:#94a3b8;font-size:0.75rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Your assigned values</div>
        <div style="display:grid;gap:10px">
          <div>
            <span style="color:#94a3b8">Issuer (iss)</span><br/>
            <code style="color:#6ee7b7;font-size:0.95rem">${s}</code>
          </div>
          <div>
            <span style="color:#94a3b8">Audience (aud)</span><br/>
            <code style="color:#6ee7b7;font-size:0.95rem">${c}</code>
          </div>
          <div>
            <span style="color:#94a3b8">IdP public key (RS256)</span>
            <pre style="${"background:#212529;color:#f8f9fa;padding:8px 10px;border-radius:4px;font-size:0.78rem;margin:4px 0 0;white-space:pre-wrap;word-break:break-all"}">${Je}</pre>
          </div>
        </div>
      </div>

      <p><strong>Endpoint: <code>POST /verify</code></strong></p>
      <ul>
        <li>Request body: <code>{"token": "&lt;JWT string&gt;"}</code></li>
        <li>
          On a <strong>valid token</strong>: respond <code>200</code> with
          <code>{"valid": true, "email": "…", "sub": "…", "aud": "…"}</code> — echo the claims from
          inside the token.
        </li>
        <li>
          On <strong>any invalid token</strong>: respond with a non-200 status (401 recommended) and
          <code>{"valid": false}</code>.
        </li>
      </ul>

      <p><strong>Verification rules — reject the token if any of these fail:</strong></p>
      <ol>
        <li><strong>Signature</strong> — must verify against the RS256 public key shown above.</li>
        <li><strong>Issuer (<code>iss</code>)</strong> — must equal <code>${s}</code>.</li>
        <li><strong>Audience (<code>aud</code>)</strong> — must equal <code>${c}</code>.</li>
        <li><strong>Expiry (<code>exp</code>)</strong> — must be in the future.</li>
      </ol>

      <p><strong>What the grader checks (four probe tokens per verify call):</strong></p>
      <ol>
        <li>A freshly minted valid token → must return 200 + <code>valid: true</code> with correct claims.</li>
        <li>An expired token (exp in the past) → must be rejected.</li>
        <li>A token with the wrong audience → must be rejected.</li>
        <li>A token with a tampered payload and invalid signature → must be rejected.</li>
      </ol>

      <p>
        Deploy to any public host and paste your <code>/verify</code> endpoint URL below
        (include the full path, e.g. <code>https://my-app.example.com/verify</code>).
      </p>
      <label for="${o}" class="form-label"><strong>Your deployed /verify endpoint URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-oauth.example.workers.dev/verify" />
    </div>
  `;return{id:o,title:n,weight:t,question:l,answer:async a=>{let u=String(a||"").trim();if(!u)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(u))throw new Error("URL must start with http:// or https://.");let m;try{m=new URL(u).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(m))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let p=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:u,weight:t,questionId:o,version:r})}),h=await p.json();if(!p.ok)throw new Error(h.error||"Unable to verify.");return h}}}var De,ze,Je,H=x(()=>{"use strict";De="https://idp.exam.local",ze="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2okOHspNjgA+2rTLbeuYcxiP/hG8C6Sb9iwg3yiLAA4HCnpITcbWCSelbvbYGuc3EbNy4xFyf5Cbj5DHJMIDEkryOgyd2giIIIBOUBj8S63uGcnRpOBh9NFatfNwheKuzsPuVNldu6A9cNteNpXcWyJjG2axVfmq7i6SuKr1JoWYG7xTTAvKPujSl4OtsQfO3h5NepzdfXpr28oNnzfWed+zclR6BcmNNo/WVfJ4xyCLSf0BCOgdTgW6PdaChd1l9VDetJZVEgC5tkyvXsfISI6iyrYbKR0NEBSqq4XkadEjsCs4F1RncsS4LlgniT7GlkL9Mce3b0wGLs9/7ZIXdQIDAQAB",Je=`-----BEGIN PUBLIC KEY-----
${ze.match(/.{1,64}/g).join(`
`)}
-----END PUBLIC KEY-----`});var Z={};E(Z,{default:()=>Ze});import{html as Be}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import Ke from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function Q(e,t){return e==="port"||e==="workers"?parseInt(t,10):e==="debug"?/^(1|true|yes|on)$/i.test(String(t)):String(t)}function Fe(e,t=""){let r=Ke(`q-config-precedence-server#${(e||"").trim().toLowerCase()}#${t}`),o=p=>p[Math.floor(r()*p.length)],n=(p,h)=>p+Math.floor(r()*(h-p+1)),s={port:8e3,workers:1,debug:!1,log_level:"info",api_key:"default-secret-000"},c=()=>{let p={};for(let h of M)r()<.5&&(h==="port"?p[h]=n(8e3,9e3):h==="workers"?p[h]=n(1,16):h==="debug"?p[h]=r()<.5:h==="log_level"?p[h]=o(j):p[h]=`key-${We(r,10)}`);return p},d=c(),l=c(),i=c(),a=p=>Object.fromEntries(Object.entries(p).map(([h,y])=>[h==="num_workers"?"workers":h,y])),u={...s,...a(d),...a(l),...a(i)},m={};for(let p of M)m[p]=Q(p,u[p]);return{baseEffective:m,fileYaml:d,dotenv:l,osenv:i}}function He(e){return Object.entries(e).map(([t,r])=>`${t}: ${typeof r=="boolean"?String(r):r}`).join(`
`)}function Ve(e){return Object.entries(e).map(([t,r])=>`${t==="workers"?"NUM_WORKERS":`APP_${t.toUpperCase()}`}=${r}`).join(`
`)}function Qe(e){return Object.entries(e).map(([t,r])=>`${`APP_${t.toUpperCase()}`}=${r}`).join(`
`)}async function Ze({user:e,weight:t=1,version:r=""}){let o="q-config-precedence-server",n="Resolve 12-Factor Config Precedence",{baseEffective:s,fileYaml:c,dotenv:d,osenv:l}=Fe(e.email,r),i="background:#212529;color:#f8f9fa;padding:8px 10px;border-radius:4px;font-size:0.82rem;margin:4px 0 0;white-space:pre",a=Be`
    <div class="mb-3">
      <p>
        Deploy a <strong>FastAPI</strong> service that merges four configuration layers — defaults,
        environment-specific YAML, <code>.env</code> file, and OS-level environment variables — then
        applies <strong>CLI overrides</strong> passed as query parameters. The grader sends fresh
        random overrides on every check.
      </p>

      <div style="background:#1e293b;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:0.88rem">
        <div style="color:#94a3b8;font-size:0.75rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:10px">Your assigned config layers</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
          <div>
            <span style="color:#94a3b8">1. defaults (hardcoded)</span>
            <pre style="${i}">port: 8000\nworkers: 1\ndebug: false\nlog_level: info\napi_key: default-secret-000</pre>
          </div>
          <div>
            <span style="color:#94a3b8">2. config.development.yaml</span>
            <pre style="${i}">${Object.keys(c).length?He(c):"(empty)"}</pre>
          </div>
          <div>
            <span style="color:#94a3b8">3. .env file</span>
            <pre style="${i}">${Object.keys(d).length?Ve(d):"(empty)"}</pre>
          </div>
          <div>
            <span style="color:#94a3b8">4. OS env vars (APP_* prefix)</span>
            <pre style="${i}">${Object.keys(l).length?Qe(l):"(empty)"}</pre>
          </div>
        </div>
      </div>

      <p><strong>Endpoint: <code>GET /effective-config?set=key=value&amp;set=…</code></strong></p>
      <ul>
        <li>
          Merge the four config layers from low to high precedence:
          <strong>defaults → config.&lt;env&gt;.yaml → .env → OS env (APP_* prefix)</strong>.
        </li>
        <li>
          Apply any <code>?set=key=value</code> query parameters as the highest-precedence CLI overrides.
          Multiple <code>set</code> params are allowed.
        </li>
        <li>
          Return JSON: <code>{"port": 8000, "workers": 2, "debug": false, "log_level": "info",
          "api_key": "****"}</code>
        </li>
      </ul>

      <p><strong>Type coercion rules:</strong></p>
      <ul>
        <li><code>port</code>, <code>workers</code> → integer</li>
        <li><code>debug</code> → boolean (<code>true/1/yes/on</code> case-insensitive = <code>true</code>)</li>
        <li><code>log_level</code> and all other keys → string</li>
      </ul>

      <p><strong>Special cases:</strong></p>
      <ul>
        <li>
          <strong>Alias:</strong> <code>NUM_WORKERS</code> in the <code>.env</code> layer maps to the
          <code>workers</code> key.
        </li>
        <li>
          <strong>Secret masking:</strong> <code>api_key</code> must always appear as <code>"****"</code>
          in the response — never expose the real value.
        </li>
        <li>
          <strong>CORS:</strong> your service must allow cross-origin requests from this page so the
          browser can check it directly.
        </li>
      </ul>

      <p><strong>What the grader checks:</strong></p>
      <ol>
        <li>All five keys present with correct types (port as int, debug as bool, etc.).</li>
        <li>Alias <code>NUM_WORKERS → workers</code> correctly resolved.</li>
        <li><code>api_key</code> masked as <code>"****"</code>.</li>
        <li>
          Fresh CLI overrides (e.g. <code>?set=port=9000&amp;set=debug=true</code>) applied correctly
          with highest precedence.
        </li>
      </ol>

      <p>Deploy and paste your <code>/effective-config</code> endpoint URL below.</p>
      <label for="${o}" class="form-label"><strong>Your deployed /effective-config endpoint URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-config.example.workers.dev/effective-config" />
    </div>
  `;return{id:o,title:n,weight:t,question:a,answer:async m=>{let p=String(m||"").trim();if(!p)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(p))throw new Error("URL must start with http:// or https://.");let h;try{h=new URL(p).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(h))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let y=Math.random,b=[...Xe].sort(()=>y()-.5).slice(0,1+Math.floor(y()*2)),v={},g=[];for(let f of b){let w;if(f==="port")do w=String(8e3+Math.floor(y()*1e3));while(Number(w)===s.port);else if(f==="workers")do w=String(1+Math.floor(y()*16));while(Number(w)===s.workers);else if(f==="debug")w=s.debug?"false":"true";else do w=j[Math.floor(y()*j.length)];while(w===s.log_level);v[f]=w,g.push(`set=${encodeURIComponent(f)}=${encodeURIComponent(w)}`)}let k={...s};for(let[f,w]of Object.entries(v))k[f]=Q(f,w);k.api_key="****";let $=p+(p.includes("?")?"&":"?")+g.join("&"),S;try{S=await fetch($,{headers:{Accept:"application/json"}})}catch(f){throw new Error(`Could not reach ${p}. Is the service public and CORS enabled? ${f.message||f}`)}if(!S.ok)throw new Error(`GET /effective-config returned HTTP ${S.status}.`);let q;try{q=await S.json()}catch{throw new Error("Response must be a JSON object.")}for(let f of M){let w=q[f],R=k[f];if(typeof w!=typeof R)throw new Error(`"${f}" should be a ${typeof R} (${JSON.stringify(R)}), got ${JSON.stringify(w)} \u2014 check type coercion/masking.`);if(w!==R)throw new Error(`"${f}" should resolve to ${JSON.stringify(R)} (with CLI ${JSON.stringify(v)}), got ${JSON.stringify(w)}.`)}return{correct:!0,score:t,message:"Config precedence, type coercion, alias, and secret masking all verified. \u2705"}}}}var M,Xe,j,V,We,ee=x(()=>{"use strict";M=["port","workers","debug","log_level","api_key"],Xe=["port","workers","debug","log_level"],j=["debug","info","warning","error"],V="abcdefghijklmnopqrstuvwxyz0123456789",We=(e,t)=>Array.from({length:t},()=>V[Math.floor(e()*V.length)]).join("")});var te={};E(te,{default:()=>tt});import{html as et}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function tt({user:e,weight:t=2,version:r=""}){let o="q-compose-redis-tunnel-server",n="Multi-Container App via Compose, Exposed by Tunnel",s=et`
    <div class="mb-3">
      <p>
        Run a <code>docker compose</code> stack that pairs a <strong>FastAPI</strong> API service with a
        <strong>Redis</strong> backend, then expose the API over a public tunnel. The grader hits your
        live service with random hit sequences and expects Redis-backed persistence.
      </p>

      <p><strong>Services in your <code>docker-compose.yml</code>:</strong></p>
      <ul>
        <li><code>api</code> — FastAPI app that talks to redis over the internal compose network.</li>
        <li><code>redis</code> — standard Redis image; no external port needed.</li>
      </ul>

      <p><strong>Endpoints your API must expose:</strong></p>
      <ul>
        <li>
          <code>POST /hit/{key}</code> — atomically increment a Redis counter for
          <code>key</code> and return <code>{"key": "…", "count": N}</code>.
        </li>
        <li>
          <code>GET /count/{key}</code> — return the current counter value
          (<code>{"key": "…", "count": N}</code>); return 0 for an unseen key.
        </li>
        <li>
          <code>GET /healthz</code> — return <code>{"status": "ok", "redis": "up"}</code>;
          actually ping Redis (not a static response).
        </li>
      </ul>

      <p><strong>Correctness requirements:</strong></p>
      <ul>
        <li>Use Redis <code>INCR</code> — not an in-memory Python dict — so counts survive worker restarts.</li>
        <li>Each key must maintain its own independent counter.</li>
        <li>The count after K hits must equal exactly K.</li>
      </ul>

      <p><strong>What the grader checks:</strong></p>
      <ol>
        <li><code>GET /healthz</code> → <code>{"status": "ok", "redis": "up"}</code>.</li>
        <li>
          A random sequence of <code>POST /hit/{key}</code> calls across two different keys, then
          <code>GET /count/{key}</code> for each — counts must match exactly.
        </li>
        <li>Two different keys must maintain independent counters.</li>
      </ol>

      <p>
        Expose your <code>api</code> service via a tunnel (<code>cloudflared tunnel --url
        http://localhost:8000</code> or <code>lt --port 8000</code>) and paste the tunnel base URL.
      </p>
      <label for="${o}" class="form-label"><strong>Your public tunnel base URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-stack.trycloudflare.com" />
    </div>
  `;return{id:o,title:n,weight:t,question:s,answer:async d=>{let l=String(d||"").trim();if(!l)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(l))throw new Error("URL must start with http:// or https://.");let i;try{i=new URL(l).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(i))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let a=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:l,weight:t,questionId:o,version:r})}),u=await a.json();if(!a.ok)throw new Error(u.error||"Unable to verify.");return u}}}var oe=x(()=>{"use strict"});var se={};E(se,{default:()=>it});import{html as ot}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import rt from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function ne(e,t=""){let r=rt(`q-deploy-analytics-platform-server#${(e||"").trim().toLowerCase()}#${t}`);return{apiKey:`ak_${nt(r,24)}`}}function st(e){let t={},r=0;for(let s of e){let c=Number(s.amount);c>0&&(r+=c,t[s.user]=(t[s.user]||0)+c)}let o=null,n=-1/0;for(let[s,c]of Object.entries(t))c>n&&(n=c,o=s);return{total_events:e.length,unique_users:new Set(e.map(s=>s.user)).size,revenue:r,top_user:o}}function at(){let e=Array.from({length:4+Math.floor(Math.random()*3)},(n,s)=>`user-${s+1}`),t=[],r=8+Math.floor(Math.random()*10);for(let n=0;n<r;n++)t.push({user:e[Math.floor(Math.random()*e.length)],amount:Math.floor(Math.random()*551)-50,ts:175e7+Math.floor(Math.random()*1e6)});let o=0;for(;o++<50;){let n={};for(let d of t)d.amount>0&&(n[d.user]=(n[d.user]||0)+d.amount);let s=Object.values(n),c=Math.max(...s,0);if(s.filter(d=>d===c).length===1&&s.length>0)break;t.push({user:e[0],amount:600+o,ts:175e7})}return t}async function it({user:e,weight:t=1.5,version:r=""}){let o="q-deploy-analytics-platform-server",n="Deploy a POST Analytics Endpoint",{apiKey:s}=ne(e.email,r),c=ot`
    <div class="mb-3">
      <p>
        Deploy a stateless <code>POST /analytics</code> endpoint that authenticates via your assigned API
        key and aggregates a batch of events. The grader sends a fresh randomized
        event batch on every check — you must compute results, not hard-code them.
      </p>

      <div style="background:#1e293b;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:0.88rem">
        <div style="color:#94a3b8;font-size:0.75rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Your assigned values</div>
        <div>
          <span style="color:#94a3b8">API Key <code style="color:#94a3b8">(X-API-Key header)</code></span><br/>
          <code style="color:#6ee7b7;font-size:0.95rem">${s}</code>
        </div>
      </div>

      <p><strong>Endpoint: <code>POST /analytics</code></strong></p>
      <ul>
        <li>
          <strong>Auth:</strong> require header <code>X-API-Key: &lt;your-assigned-key&gt;</code>.
          Missing or wrong key → HTTP 401.
        </li>
        <li>
          <strong>Request body:</strong>
          <code>{"events": [{"user": "alice", "amount": 42.5, "ts": 1700000000}, …]}</code>
        </li>
        <li>
          <strong>Response:</strong>
          <code>{"email": "…", "total_events": N, "unique_users": N, "revenue": F, "top_user": "…"}</code>
        </li>
        <li>
          <strong>CORS:</strong> your endpoint must allow cross-origin requests from this page so the
          browser can verify it directly (set <code>Access-Control-Allow-Origin: *</code> or the exam
          domain).
        </li>
      </ul>

      <p><strong>Aggregation rules:</strong></p>
      <ul>
        <li><code>total_events</code> — count of all events in the batch.</li>
        <li><code>unique_users</code> — number of distinct <code>user</code> values.</li>
        <li>
          <code>revenue</code> — sum of <code>amount</code> values where <code>amount &gt; 0</code>
          only (ignore zero and negative amounts).
        </li>
        <li>
          <code>top_user</code> — the user whose positive-amount total is highest. The grader ensures
          there are no ties.
        </li>
        <li><code>email</code> — your logged-in email address.</li>
      </ul>

      <p><strong>What the grader checks:</strong></p>
      <ol>
        <li>Missing API key → 401.</li>
        <li>Wrong API key → 401.</li>
        <li>
          Valid key with a fresh 8-17 event batch (4-7 users, mixed positive/negative amounts) —
          checks all five response fields.
        </li>
      </ol>

      <p>Deploy to any public platform and paste your <code>/analytics</code> endpoint URL below.</p>
      <label for="${o}" class="form-label"><strong>Your deployed /analytics endpoint URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-app.vercel.app/analytics" />
    </div>
  `;return{id:o,title:n,weight:t,question:c,answer:async l=>{let i=String(l||"").trim();if(!i)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(i))throw new Error("URL must start with http:// or https://.");let a;try{a=new URL(i).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(a))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let{apiKey:u}=ne(e.email,r),m=(e.email||"").trim().toLowerCase(),p=async(g,k)=>{let $;try{$=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",...k?{"X-API-Key":k}:{}},body:JSON.stringify({events:g})})}catch(S){throw new Error(`Could not reach ${i}. Is it public with CORS enabled? ${S.message||S}`)}return $};if((await p([{user:"user-1",amount:1,ts:1}],"wrong-key")).status!==401)throw new Error("A wrong X-API-Key must return HTTP 401.");if((await p([{user:"user-1",amount:1,ts:1}],null)).status!==401)throw new Error("A missing X-API-Key must return HTTP 401.");let h=at(),y=await p(h,u);if(!y.ok)throw new Error(`POST /analytics with the correct key returned HTTP ${y.status}.`);let b;try{b=await y.json()}catch{throw new Error("Response must be a JSON object.")}if(String(b.email||"").trim().toLowerCase()!==m)throw new Error(`Response "email" must equal ${e.email}.`);let v=st(h);for(let g of["total_events","unique_users","revenue"])if(Number(b[g])!==v[g])throw new Error(`"${g}" should be ${v[g]}, got ${b[g]??"missing"}.`);if(String(b.top_user)!==String(v.top_user))throw new Error(`"top_user" should be ${v.top_user} (highest positive-amount total), got ${b.top_user??"missing"}.`);return{correct:!0,score:t,message:"Auth enforced and analytics aggregates verified on a random batch. \u2705"}}}}var re,nt,ae=x(()=>{"use strict";re="abcdefghijklmnopqrstuvwxyz0123456789",nt=(e,t)=>Array.from({length:t},()=>re[Math.floor(e()*re.length)]).join("")});var ie={};E(ie,{default:()=>ct});import{html as lt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ct({user:e,weight:t=1.5,version:r=""}){let o="q-observability-metrics-server",n="Production Observability: Metrics, Health & Structured Logs",s=lt`
    <div class="mb-3">
      <p>
        Deploy a <strong>FastAPI</strong> service instrumented with a Prometheus counter, a health
        check endpoint, and structured JSON logs. The grader drives real traffic to <code>/work</code>
        and then verifies that your counter actually increments and your logs record the requests.
      </p>

      <p><strong>Endpoints to implement:</strong></p>
      <ul>
        <li>
          <code>GET /work?n=K</code> — do K units of work, return
          <code>{"email": "…", "done": K}</code>. Each call must increment the request counter.
        </li>
        <li>
          <code>GET /metrics</code> — Prometheus text format. Must expose a counter named
          <code>http_requests_total</code> that increases with every request to any endpoint.
        </li>
        <li>
          <code>GET /healthz</code> — return <code>{"status": "ok", "uptime_s": &lt;number&gt;}</code>
          where <code>uptime_s</code> is a non-negative float representing seconds since startup.
        </li>
        <li>
          <code>GET /logs/tail?limit=N</code> — return a JSON array of the last N log entries. Each
          entry must be a JSON object with at minimum: <code>level</code>, <code>ts</code> (timestamp),
          <code>path</code> (request path), <code>request_id</code>.
        </li>
      </ul>

      <p><strong>What the grader checks:</strong></p>
      <ol>
        <li>
          Reads <code>http_requests_total</code> from <code>/metrics</code> as a baseline, then makes
          3-6 random calls to <code>/work?n=K</code>, then reads the counter again — it must have
          increased by at least the number of calls made.
        </li>
        <li>
          <code>/healthz</code> returns <code>status: "ok"</code> and a finite non-negative
          <code>uptime_s</code>.
        </li>
        <li>
          <code>/logs/tail</code> returns a valid JSON array where each object has the four required
          fields, and at least one entry has <code>path</code> containing <code>/work</code>.
        </li>
      </ol>

      <p>
        The counter must be live — a static Prometheus text file that doesn't update will fail. Deploy
        and paste your service base URL.
      </p>
      <label for="${o}" class="form-label"><strong>Your deployed service base URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-observable.example.workers.dev" />
    </div>
  `;return{id:o,title:n,weight:t,question:s,answer:async d=>{let l=String(d||"").trim();if(!l)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(l))throw new Error("URL must start with http:// or https://.");let i;try{i=new URL(l).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(i))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let a=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:l,weight:t,questionId:o,version:r})}),u=await a.json();if(!a.ok)throw new Error(u.error||"Unable to verify.");return u}}}var le=x(()=>{"use strict"});var ce={};E(ce,{default:()=>pt});import{html as dt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function pt({weight:e=1}){let t="q-ollama-tunnel-llm-server",r="Expose a Local LLM through a Tunnel",o=dt`
    <div class="mb-3">
      <p>
        Run a local LLM (e.g. <strong>Ollama</strong>) that exposes an
        <strong>OpenAI-compatible</strong> chat completions endpoint, expose it via a public tunnel,
        and submit the endpoint URL plus the model name. The grader sends two fresh prompts every check
        — an echo test and an arithmetic test.
      </p>

      <p><strong>Required setup:</strong></p>
      <ul>
        <li>
          Start Ollama (or any compatible server) so that
          <code>POST /v1/chat/completions</code> is accessible at your tunnel URL.
        </li>
        <li>
          Request format: <code>{"model": "…", "messages": [{"role": "user", "content": "…"}],
          "stream": false}</code>
        </li>
        <li>
          Response format: standard OpenAI structure — content is read from
          <code>choices[0].message.content</code> (or <code>choices[0].text</code> / top-level
          <code>response</code> as fallback).
        </li>
        <li>
          Enable CORS on your tunnel so this page can reach it directly
          (e.g. <code>OLLAMA_ORIGINS=*</code> for Ollama).
        </li>
      </ul>

      <p><strong>What the grader checks:</strong></p>
      <ol>
        <li>
          <strong>Echo test:</strong> asks the model to repeat a random token (format
          <code>TK&lt;6-hex&gt;</code>). The token must appear somewhere in the response (case-insensitive).
        </li>
        <li>
          <strong>Arithmetic test:</strong> asks "What is A + B?" with random integers (10-89). The
          correct sum must appear as digits in the response.
        </li>
      </ol>

      <p><strong>Submit as JSON:</strong></p>
      <pre style="background:#212529;color:#f8f9fa;padding:8px;border-radius:4px;font-size:0.85rem">{"url": "https://my-llm.trycloudflare.com/v1/chat/completions", "model": "llama3.2"}</pre>
      <ul>
        <li><code>url</code> — the full path to <code>/v1/chat/completions</code> at your tunnel.</li>
        <li><code>model</code> — the exact model name your server is running.</li>
      </ul>

      <label for="${t}" class="form-label"><strong>Your endpoint + model as JSON</strong></label>
      <textarea class="form-control font-monospace" id="${t}" name="${t}" rows="3"
        placeholder='{"url": "https://my-llm.trycloudflare.com/v1/chat/completions", "model": "llama3.2"}'></textarea>
    </div>
  `;return{id:t,title:r,weight:e,question:o,answer:async s=>{let c=String(s||"").trim();if(!c)throw new Error("Enter your answer as JSON.");let d;try{d=JSON.parse(c)}catch(g){throw new Error(`Your answer isn't valid JSON: ${g.message}`)}if(!d||typeof d!="object"||Array.isArray(d))throw new Error("Answer must be a JSON object.");let l=String(d.url||"").trim();if(!/^https?:\/\//i.test(l))throw new Error("`url` must start with http:// or https://.");let i;try{i=new URL(l).hostname}catch{throw new Error("`url` is not a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(i))throw new Error("The grader can't reach a private/localhost address \u2014 expose the model via a tunnel.");let a=String(d.model||"").trim();if(!a)throw new Error("Include the `model` name your server loads.");let u=g=>g?.choices?.[0]?.message?.content??g?.choices?.[0]?.text??g?.message?.content??g?.response??"",m=async g=>{let k;try{k=await fetch(l,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:a,messages:[{role:"user",content:g}],stream:!1,temperature:0})})}catch(S){throw new Error(`Could not reach ${l}. Is the tunnel up and CORS enabled (OLLAMA_ORIGINS=*)? ${S.message||S}`)}if(!k.ok)throw new Error(`The endpoint returned HTTP ${k.status}.`);let $;try{$=await k.json()}catch{throw new Error("The endpoint must return JSON.")}return String(u($)||"")},p=`TK${Math.random().toString(36).slice(2,8).toUpperCase()}`,h=await m(`Output ONLY this exact token and nothing else: ${p}`);if(!h.toUpperCase().includes(p))throw new Error(`Echo test failed: asked for "${p}", model replied "${h.slice(0,80)}".`);let y=10+Math.floor(Math.random()*80),b=10+Math.floor(Math.random()*80),v=await m(`What is ${y} + ${b}? Reply with only the number.`);if(!v.replace(/[^0-9]/g," ").split(/\s+/).includes(String(y+b)))throw new Error(`Reasoning test failed: ${y} + ${b} = ${y+b}, model replied "${v.slice(0,80)}".`);return{correct:!0,score:e,message:"Live local LLM verified: token echo and arithmetic both passed. \u2705"}}}}var de=x(()=>{"use strict"});var pe={};E(pe,{default:()=>ht});import{html as ut}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ht({user:e,weight:t=2,version:r=""}){let o="q-local-llm-structured-server",n="Local LLM Structured-Output Service",s=ut`
    <div class="mb-3">
      <p>
        Wrap a local LLM in a <strong>FastAPI</strong> <code>POST /extract</code> endpoint that
        extracts structured invoice fields from free-form text and returns schema-validated JSON. The
        grader sends randomized invoice texts on every check — you must extract the right values, not
        hard-code them.
      </p>

      <p><strong>Endpoint: <code>POST /extract</code></strong></p>
      <ul>
        <li>Request body: <code>{"text": "&lt;invoice text&gt;"}</code></li>
        <li>
          Response: a JSON object with exactly these fields:
          <ul>
            <li><code>vendor</code> — the vendor name as a string.</li>
            <li><code>amount</code> — the total due as a number (float or int).</li>
            <li><code>currency</code> — 3-letter currency code, uppercase (e.g. <code>USD</code>).</li>
            <li><code>date</code> — payment due date as <code>YYYY-MM-DD</code>.</li>
          </ul>
        </li>
      </ul>

      <p><strong>Accuracy requirements:</strong></p>
      <ul>
        <li><code>vendor</code>: extracted value must contain the vendor name (case-insensitive substring match).</li>
        <li><code>amount</code>: within ±0.01 of the correct value.</li>
        <li><code>currency</code>: exact 3-letter uppercase match.</li>
        <li><code>date</code>: must contain the <code>YYYY-MM-DD</code> substring.</li>
      </ul>

      <p><strong>Error handling:</strong></p>
      <ul>
        <li>
          Malformed or empty input must <strong>not</strong> crash with HTTP 500. Return a 422
          validation error or best-effort valid JSON.
        </li>
      </ul>

      <p><strong>What the grader checks (two randomized invoices per call):</strong></p>
      <ol>
        <li>
          Invoice text contains a planted vendor (e.g. <code>Acme-xxxx Industries Ltd.</code>), amount
          (50-9050), currency (USD/EUR/GBP), and date (2026-MM-DD). All four fields are checked.
        </li>
        <li>Empty/garbage input — must not return HTTP 500.</li>
      </ol>

      <p>
        Use a Pydantic response model to guarantee schema compliance. Deploy and paste your
        <code>/extract</code> endpoint URL.
      </p>
      <label for="${o}" class="form-label"><strong>Your deployed /extract endpoint URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-extractor.example.workers.dev/extract" />
    </div>
  `;return{id:o,title:n,weight:t,question:s,answer:async d=>{let l=String(d||"").trim();if(!l)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(l))throw new Error("URL must start with http:// or https://.");let i;try{i=new URL(l).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(i))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let a=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:l,weight:t,questionId:o,version:r})}),u=await a.json();if(!a.ok)throw new Error(u.error||"Unable to verify.");return u}}}var ue=x(()=>{"use strict"});var me={};E(me,{default:()=>ft});import{html as mt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import gt from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function he(e,t=""){let r=gt(`q-api-idempotency-pagination-server#${(e||"").trim().toLowerCase()}#${t}`),o=(n,s)=>n+Math.floor(r()*(s-n+1));return{total:o(40,60),rateLimit:o(15,20)}}async function ft({user:e,weight:t=2,version:r=""}){let o="q-api-idempotency-pagination-server",n="API Engineering: Idempotency + Pagination + Rate Limit",{total:s,rateLimit:c}=he(e.email,r),d=mt`
    <div class="mb-3">
      <p>
        Deploy a <strong>FastAPI</strong> orders API that demonstrates three production-grade API
        engineering patterns: idempotent POST, cursor-based pagination, and per-client rate limiting.
      </p>

      <div style="background:#1e293b;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:0.88rem">
        <div style="color:#94a3b8;font-size:0.75rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Your assigned values</div>
        <div style="display:flex;gap:24px;flex-wrap:wrap">
          <div><span style="color:#94a3b8">Total orders (T)</span><br/><code style="color:#6ee7b7;font-size:0.95rem">${s}</code></div>
          <div><span style="color:#94a3b8">Rate limit (R requests / 10s)</span><br/><code style="color:#6ee7b7;font-size:0.95rem">${c}</code></div>
        </div>
      </div>

      <p><strong>1. Idempotent order creation</strong></p>
      <ul>
        <li>
          <code>POST /orders</code> with header <code>Idempotency-Key: &lt;k&gt;</code>.
        </li>
        <li>
          On first call: create the order, return <code>{"id": "…", …}</code> with HTTP 201.
        </li>
        <li>
          On repeat calls with the same key: return the <strong>same</strong> order id — never create
          a duplicate.
        </li>
      </ul>

      <p><strong>2. Cursor pagination</strong></p>
      <ul>
        <li>
          <code>GET /orders?limit=P&amp;cursor=C</code> — return up to <code>P</code> orders from
          your fixed catalog of IDs 1 through T (your assigned total, shown above).
        </li>
        <li>
          Response: <code>{"items": [{"id": 1, …}, …], "next_cursor": "…"}</code> (or
          <code>"next"</code> / <code>"orders"</code> field aliases are accepted).
        </li>
        <li>
          Cursors are opaque — the grader passes back your returned cursor verbatim. Never return more
          than <code>limit</code> items; serve every ID 1..T with no gaps or repeats across pages.
        </li>
      </ul>

      <p><strong>3. Per-client rate limiting</strong></p>
      <ul>
        <li>
          Read the <code>X-Client-Id</code> request header; bucket each client ID independently.
        </li>
        <li>
          Your assigned bucket size is R requests per 10 seconds (shown above).
        </li>
        <li>
          After R requests from the same client ID within the window, return HTTP 429 with a
          <code>Retry-After</code> header. Different client IDs must not share a bucket.
        </li>
        <li>
          <strong>CORS:</strong> your service must allow cross-origin requests from this page so the
          browser can verify it directly.
        </li>
      </ul>

      <p><strong>What the grader checks:</strong></p>
      <ol>
        <li>Same idempotency key used twice — both responses must return the same order id.</li>
        <li>Full paginated scan of orders 1..T — checks no gaps, no repeats, no over-sized pages.</li>
        <li>R+1 requests from the same client ID — the (R+1)th must be HTTP 429 with Retry-After; a different client ID must still be accepted.</li>
      </ol>

      <label for="${o}" class="form-label"><strong>Your deployed orders API base URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-orders.example.workers.dev" />
    </div>
  `;return{id:o,title:n,weight:t,question:d,answer:async i=>{let a=String(i||"").trim();if(!a)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(a))throw new Error("URL must start with http:// or https://.");let u;try{u=new URL(a).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(u))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let{total:m,rateLimit:p}=he(e.email,r),h=a.replace(/\/+$/,""),y=async(T,{method:O="GET",clientId:A="grader",key:I}={})=>{let U={Accept:"application/json","X-Client-Id":A};I&&(U["Idempotency-Key"]=I),O==="POST"&&(U["Content-Type"]="application/json");let P={method:O,headers:U};O==="POST"&&(P.body=JSON.stringify({amount:100}));let _;try{_=await fetch(`${h}${T}`,P)}catch(D){throw new Error(`Could not reach ${h}${T} (${O}). Is it public with CORS enabled? ${D.message||D}`)}return _},b=async T=>{try{return await T.json()}catch{return{}}},v=`idem-${Math.random().toString(36).slice(2,12)}`,g=await y("/orders",{method:"POST",clientId:"grader-idem",key:v});if(!g.ok)throw new Error(`POST /orders returned HTTP ${g.status}.`);let k=(await b(g)).id;if(k==null)throw new Error('POST /orders must return {"id": ...}.');let $=await y("/orders",{method:"POST",clientId:"grader-idem",key:v}),S=(await b($)).id;if(String(S)!==String(k))throw new Error(`Reusing Idempotency-Key must return the same id (${k}), got ${S} \u2014 you created a duplicate.`);let q=6+Math.floor(Math.random()*5),f=new Set,w="",R=0;for(;R++<=m+3;){let T=`/orders?limit=${q}`+(w?`&cursor=${encodeURIComponent(w)}`:""),O=await y(T,{clientId:"grader-pager"});if(!O.ok)throw new Error(`GET /orders pagination returned HTTP ${O.status}.`);let A=await b(O),I=A.items||A.orders||[];if(!Array.isArray(I))throw new Error('GET /orders must return {"items": [...], "next_cursor": ...}.');if(I.length>q)throw new Error(`A page returned ${I.length} items but limit was ${q}.`);for(let U of I){let P=Number(U.id);if(f.has(P))throw new Error(`Order id ${P} appeared on two pages \u2014 pagination must not repeat.`);f.add(P)}if(w=A.next_cursor??A.next??null,!w)break}if(f.size!==m)throw new Error(`Paginating yielded ${f.size} unique orders; expected exactly ${m}.`);for(let T=1;T<=m;T++)if(!f.has(T))throw new Error(`Order id ${T} was missing \u2014 serve ids 1..${m} with no gaps.`);let L=!1,C=!1;for(let T=0;T<p+5;T++){let O=await y("/orders?limit=1",{clientId:"grader-flood"});if(O.status===429){L=!0,O.headers.get("retry-after")!==null&&(C=!0);break}}if(!L)throw new Error(`Sending ${p+5} requests from one X-Client-Id should trigger a 429 (limit ${p}/10s).`);if(!C)throw new Error("The 429 response must include a Retry-After header.");return{correct:!0,score:t,message:"Idempotency, cursor pagination, and per-client rate limiting all verified. \u2705"}}}}var ge=x(()=>{"use strict"});var ye={};E(ye,{default:()=>bt});import{html as yt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import wt from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function fe(e,t=""){let r="abcdefghijklmnopqrstuvwxyz0123456789",o=wt(`q-middleware-ratelimit-cors-server#${(e||"").trim().toLowerCase()}#${t}`);return{allowedOrigin:`https://app-${(s=>Array.from({length:s},()=>r[Math.floor(o()*r.length)]).join(""))(6)}.example.com`,bucket:8+Math.floor(o()*8)}}async function bt({user:e,weight:t=1.5,version:r=""}){let o="q-middleware-ratelimit-cors-server",n="Middleware Stack: Rate-Limit + CORS + Request Context",{allowedOrigin:s,bucket:c}=fe(e.email,r),d=yt`
    <div class="mb-3">
      <p>
        Build a <strong>FastAPI</strong> service that composes three middleware layers: a scoped CORS
        policy, a per-client rate limiter, and a request-context propagator.
      </p>

      <div style="background:#1e293b;border-radius:8px;padding:12px 16px;margin-bottom:12px;font-size:0.88rem">
        <div style="color:#94a3b8;font-size:0.75rem;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px">Your assigned values</div>
        <div style="display:flex;gap:24px;flex-wrap:wrap">
          <div><span style="color:#94a3b8">Allowed CORS origin</span><br/><code style="color:#6ee7b7;font-size:0.95rem">${s}</code></div>
          <div><span style="color:#94a3b8">Rate-limit bucket (B)</span><br/><code style="color:#6ee7b7;font-size:0.95rem">${c} req / 10s</code></div>
        </div>
      </div>

      <p><strong>Endpoint: <code>GET /ping</code></strong></p>
      <ul>
        <li>
          Return <code>{"email": "…", "request_id": "…"}</code> where <code>email</code> is your
          logged-in address and <code>request_id</code> is the request's ID (see context middleware
          below).
        </li>
      </ul>

      <p><strong>Middleware 1 — Request context</strong></p>
      <ul>
        <li>
          If the inbound request carries an <code>X-Request-ID</code> header, reuse that value as the
          <code>request_id</code>.
        </li>
        <li>Otherwise generate a fresh unique ID (e.g. UUID4).</li>
        <li>
          Always return the <code>request_id</code> both in the response JSON body and in the
          <code>X-Request-ID</code> response header.
        </li>
      </ul>

      <p><strong>Middleware 2 — CORS</strong></p>
      <ul>
        <li>
          Only your <em>assigned</em> allowed origin (shown above) may receive an
          <code>Access-Control-Allow-Origin</code> header — no wildcards (<code>*</code>).
        </li>
        <li>Preflight (<code>OPTIONS /ping</code>) from the allowed origin must succeed.</li>
        <li>Any other origin must not receive the ACAO header.</li>
        <li>
          <strong>Note:</strong> Also allow this exam page's origin so the browser can reach
          <code>/ping</code> during verification.
        </li>
      </ul>

      <p><strong>Middleware 3 — Per-client rate limiting</strong></p>
      <ul>
        <li>Read the <code>X-Client-Id</code> request header and bucket each ID independently.</li>
        <li>
          Your assigned bucket size is B requests (shown above). After B requests from
          the same client within the window, return HTTP 429. A fresh client ID must still be accepted.
        </li>
      </ul>

      <p><strong>What the grader checks (from your browser):</strong></p>
      <ol>
        <li>
          <code>GET /ping</code> with a supplied <code>X-Request-ID</code> — same value must appear
          in response body and response header.
        </li>
        <li>
          <code>GET /ping</code> without <code>X-Request-ID</code> — a fresh unique ID must be
          generated and appear in both places.
        </li>
        <li>${c+5} requests from the same client ID — must trigger 429; a different client ID must still succeed.</li>
      </ol>

      <label for="${o}" class="form-label"><strong>Your deployed service base URL</strong></label>
      <input class="form-control font-monospace" id="${o}" name="${o}" type="url"
        placeholder="https://my-mw.example.workers.dev" />
    </div>
  `;return{id:o,title:n,weight:t,question:d,answer:async i=>{let a=String(i||"").trim();if(!a)throw new Error("Enter a URL.");if(!/^https?:\/\//i.test(a))throw new Error("URL must start with http:// or https://.");let u;try{u=new URL(a).hostname}catch{throw new Error("That doesn't look like a valid URL.")}if(/^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(u))throw new Error("The grader can't reach a private/localhost address \u2014 deploy it publicly.");let{bucket:m}=fe(e.email,r),p=(e.email||"").trim().toLowerCase(),h=a.replace(/\/+$/,""),y=async(f,{headers:w={},method:R="GET"}={})=>{let L;try{L=await fetch(`${h}${f}`,{method:R,headers:w})}catch(C){throw new Error(`Could not reach ${h}${f}. Is it public with CORS enabled? ${C.message||C}`)}return L},b=`rid-${Math.random().toString(36).slice(2,12)}`,v=await y("/ping",{headers:{"X-Request-ID":b,"X-Client-Id":"m-ctx1"}});if(!v.ok)throw new Error(`GET /ping returned HTTP ${v.status}.`);let g={};try{g=await v.json()}catch{throw new Error("GET /ping must return a JSON object.")}if(String(g.email||"").trim().toLowerCase()!==p)throw new Error(`GET /ping "email" must equal ${e.email}.`);if(g.request_id!==b)throw new Error(`When X-Request-ID is supplied, echo it in request_id (sent ${b}, got ${g.request_id}).`);if(v.headers.get("x-request-id")!==b)throw new Error("Echo the inbound X-Request-ID in the response header too.");let k=await y("/ping",{headers:{"X-Client-Id":"m-ctx2"}}),$=await k.json().catch(()=>({}));if(!$.request_id||$.request_id===b)throw new Error("Without an inbound X-Request-ID, generate a fresh non-empty request_id.");if(!k.headers.get("x-request-id"))throw new Error("Always set the X-Request-ID response header.");let S=!1;for(let f=0;f<m+5;f++)if((await y("/ping",{headers:{"X-Client-Id":"m-flood"}})).status===429){S=!0;break}if(!S)throw new Error(`More than ${m} requests from one X-Client-Id should return 429.`);if((await y("/ping",{headers:{"X-Client-Id":"m-fresh"}})).status===429)throw new Error("A different X-Client-Id must not be rate-limited (buckets are per-client).");return{correct:!0,score:t,message:"Request-ID propagation and per-client rate limiting verified. \u2705"}}}}var we=x(()=>{"use strict"});var ve={};E(ve,{default:()=>kt,streamAssignment:()=>be});import{html as vt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function be(e){let t=2166136261;for(let s of String(e||"").trim().toLowerCase())t=Math.imul(t^s.charCodeAt(0),16777619)>>>0;let r=`job-${t.toString(16)}`,n=[[{response:`Report ${r}: `,done:!1},{thinking:"internal note",response:"",done:!1},{response:`caf\xE9
`,done:!1},{response:"Ready \u2713",done:!0,done_reason:"stop"}],[{response:`Partial ${r}`,done:!1}],[{response:`Draft ${r}`,done:!1},{error:"model unloaded"},{response:"IGNORE",done:!0}]].map((s,c)=>{let d=s.map(a=>JSON.stringify(a)).join(`
`)+`
`+(c===1?'{"response":"unfinished':""),l=new TextEncoder().encode(d),i=[];for(let a=0;a<l.length;){let u=Math.min(a+11+a%13,l.length),m=l.findIndex((p,h)=>h>=a&&h<u&&p>=192);m>=0&&(u=m+1),i.push(Array.from(l.slice(a,u),p=>p.toString(16).padStart(2,"0")).join("")),a=u}return i});return{tag:r,streams:n}}async function kt({user:e,weight:t=1.5}){let r="q-ollama-stream-reassembly-server",o="Recover a fragmented LLM stream",{streams:n}=be(e.email),s=vt`
    <div class="mb-3">

      <p>Your LLM client treats every network chunk as a complete JSON object and sometimes corrupts Unicode.
        Reconstruct these three independent native Ollama-style NDJSON streams.</p>
      <p>Each array contains ordered <strong>hex-encoded byte chunks</strong>, not JSON records. Decode the hex,
        preserve UTF-8 characters across chunk boundaries, buffer complete newline-delimited JSON records,
        and concatenate only their <code>response</code> strings. Ignore <code>thinking</code>.</p>
      <ul>
        <li>Include any response text on the first <code>done: true</code> record, then stop with
          <code>complete: true</code>.</li>
        <li>On an <code>error</code> record, preserve earlier response text, set that error string and stop
          with <code>complete: false</code>. Ignore subsequent records.</li>
        <li>At transport EOF without a terminal record, use <code>complete: false</code> and
          <code>error: null</code>. Ignore any incomplete trailing JSON record.</li>
        <li>Preserve spaces, escaped newlines and Unicode exactly. Use <code>error: null</code> unless
          an error record was encountered.</li>
      </ul>
      <details open><summary>Captured byte chunks</summary><pre>${JSON.stringify({A:n[0],B:n[1],C:n[2]},null,2)}</pre></details>
      <p>Serve this JSON structure at a public URL: <code>{"A":{"text":"...","complete":true,"error":null},"B":{...},"C":{...}}</code>.
        No model download is required. A publicly hosted JSON file or a GET endpoint is acceptable.</p>
      <p><a href="https://docs.ollama.com/api/streaming" target="_blank" rel="noopener">Ollama streaming reference</a></p>
      <p>Submit the URL below. The exam server sends a GET request and checks the returned JSON against
        your assigned cases. Serve raw JSON without authentication or an HTML wrapper, within 10 seconds
        and at most 64 KiB. Keep the URL available through grading. CORS is not required because the
        exam server fetches it directly.</p>
      <label for="${r}" class="form-label">Public URL returning your JSON answer</label>
      <input class="form-control font-monospace" id="${r}" name="${r}" type="url" placeholder="https://example.com/answer.json" />
    </div>`;return{id:r,title:o,weight:t,question:s,answer:async d=>{let l=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:d,weight:t,questionId:r})}),i=await l.json();if(!l.ok)throw new Error(i.error||"Unable to verify.");return i}}}var ke=x(()=>{"use strict"});var xe={};E(xe,{cacheAssignment:()=>Se,default:()=>xt});import{html as St}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Se(e){let t=2166136261;for(let r of String(e||"").trim().toLowerCase())t=Math.imul(t^r.charCodeAt(0),16777619)>>>0;return{install:40+t%31,compile:10+t%11,test:15+t%16}}async function xt({user:e,weight:t=1.5}){let r="q-docker-build-cache-server",o="Diagnose Docker build cache misses",{install:n,compile:s,test:c}=Se(e.email),d=St`
    <div class="mb-3">

      <p>A deployment pipeline keeps reinstalling dependencies unnecessarily. Determine which steps
        actually need to run again in this single-stage build.</p>
      <pre>FROM python:3.12-slim
WORKDIR /app
# L1
COPY requirements.txt ./
# L2
RUN pip install --no-cache-dir -r requirements.txt
# L3
COPY src/ ./src/
# L4
RUN python -m compileall src
# L5
RUN python -m unittest discover -s src</pre>
      <p>The build context contains only requirements.txt, src/, README.md and the Dockerfile.
        README.md is excluded by .dockerignore. A successful unchanged build is cached. The base-image digest,
        platform, build arguments and all other inputs remain fixed. There are no cache mounts or external
        cache changes. The pip flag affects pip's download cache, not Docker's layer cache.</p>
      <p>Treat each case independently against that original cached build:</p>
      <ol type="A">
        <li>Change the contents of src/app.py.</li>
        <li>Change the contents of requirements.txt.</li>
        <li>Only change src/app.py's modification time with touch; content and all other metadata stay unchanged.</li>
        <li>Change the contents of the excluded README.md.</li>
        <li>Change only L4 to <code>RUN python -m compileall -q src</code>.</li>
      </ol>
      <p>For this exercise, once a step misses cache, all later steps run again. List steps in build order.
        L2 costs ${n} seconds, L4 costs ${s} seconds, L5 costs ${c} seconds;
        COPY steps and cache hits cost zero. Apply these same costs in case E.</p>
      <p>Serve this JSON structure at a public URL: <code>{"A":{"steps":["L3",...],"seconds":N},"B":{...},"C":{...},"D":{...},"E":{...}}</code>.
        Include every re-executed step L1–L5, even zero-cost COPY steps. Use an empty array for all-cache-hit cases.</p>
      <p><a href="https://docs.docker.com/build/cache/invalidation/" target="_blank" rel="noopener">Docker cache invalidation reference</a></p>
      <p>Submit the URL below. The exam server sends a GET request and checks the returned JSON against
        your assigned cases. Serve raw JSON without authentication or an HTML wrapper, within 10 seconds
        and at most 64 KiB. Keep the URL available through grading. CORS is not required because the
        exam server fetches it directly.</p>
      <label for="${r}" class="form-label">Public URL returning your JSON answer</label>
      <input class="form-control font-monospace" id="${r}" name="${r}" type="url" placeholder="https://example.com/answer.json" />
    </div>`;return{id:r,title:o,weight:t,question:d,answer:async i=>{let a=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:i,weight:t,questionId:r})}),u=await a.json();if(!a.ok)throw new Error(u.error||"Unable to verify.");return u}}}var Ee=x(()=>{"use strict"});var $e={};E($e,{default:()=>Tt,modelAssignment:()=>Te});import{html as Et}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Te(e){let t=2166136261;for(let r of String(e||"").trim().toLowerCase())t=Math.imul(t^r.charCodeAt(0),16777619)>>>0;return{model:`ga2-assistant-${t.toString(16)}`,system:`You are the deployment assistant for project ${t.toString(16)}. Give concise answers and never invent commands.`,temperature:[.1,.2,.3][t%3],num_ctx:[2048,4096][t%2],seed:10+t%990,num_predict:64+t%65}}async function Tt({user:e,weight:t=2}){let r="q-termlog-ollama-modelfile-server",o="Create a custom Ollama model (termlog)",n=Te(e.email),s=Et`
    <div class="mb-3">

      <p>Create a reusable local deployment assistant with an Ollama Modelfile. This exercise checks
        the saved model configuration, not whether an LLM happens to follow a prompt.</p>
      <p>Before recording, install Ollama and download any small text-generation model your machine can run.
        Use it in your FROM instruction. Keep its default chat template.</p>
      <p>Your custom model name: <code>${n.model}</code>. Configure these exact values:</p>
      <pre>${JSON.stringify({temperature:n.temperature,num_ctx:n.num_ctx,seed:n.seed,num_predict:n.num_predict},null,2)}</pre>
      <p>Set this exact SYSTEM prompt:</p><pre>${n.system}</pre>
      <ol>
        <li>Install <a href="https://github.com/mynkpdr/termlog" target="_blank" rel="noopener">termlog</a>
          and log in with <code>termlog login</code> as <strong>${e.email}</strong>.</li>
        <li>Start <code>termlog rec model.cast</code>. Create your Modelfile inside the recording,
          using FROM, SYSTEM and PARAMETER instructions.</li>
        <li>Run <code>ollama create ${n.model} -f Modelfile</code> and wait for success.</li>
        <li>Run these commands individually. The markers must appear on their own output lines.
          Widen your terminal if it wraps output:
          <pre>printf '\nMODELFILE_BEGIN ${n.model}\n'
ollama show --modelfile ${n.model}
printf '\nMODELFILE_END ${n.model}\n'</pre></li>
        <li>Type <code>exit</code> and package the files:
          <pre>tar -czf submission.tar.gz model.cast model.cast.jwt</pre>
          Upload the archive to a public URL serving the actual file.</li>
      </ol>
      <p>The grader checks your signed recording, account, exit event, create/show commands and exported
        SYSTEM and parameter values. Each assigned parameter must appear once. Other inherited parameters
        are allowed. No public model endpoint is needed. Keep the archive under 1 MB compressed and
        5 MB uncompressed, and avoid recording secrets.</p>
      <p><a href="https://docs.ollama.com/modelfile" target="_blank" rel="noopener">Ollama Modelfile reference</a></p>
      <label for="${r}" class="form-label">Public URL of submission.tar.gz</label>
      <input class="form-control" id="${r}" name="${r}" type="url" placeholder="https://.../submission.tar.gz" />
    </div>`;return{id:r,title:o,weight:t,question:s,answer:async d=>{let l=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:d,weight:t,questionId:r})}),i=await l.json();if(!l.ok)throw new Error(i.error||"Unable to verify.");return i}}}var Oe=x(()=>{"use strict"});import{html as N,render as qe}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function z(e,t){let r=N`<ol class="mt-3">
    ${e.map(({id:s,title:c,weight:d})=>N`<li><a href="#h${s}">${c}</a> (${d} ${d==1?"mark":"marks"})</li>`)}
  </ol>`,o=[N`<h1 class="display-6">Questions</h1>`,r,...e.map(({id:s,title:c,weight:d,question:l,help:i},a)=>(i&&!Array.isArray(i)&&(i=[i]),N`
        <details class="card my-5" data-question="${s}" id="h${s}" open>
          <summary class="card-header d-flex align-items-center gap-2">
            <span class="badge text-bg-primary">${a+1}</span>
            <span class="flex-grow-1">${c} (${d} ${d==1?"mark":"marks"})</span>
            <span class="badge text-bg-success solved-badge d-none"><i class="bi bi-check-circle-fill me-1"></i>Solved</span>
            <i class="bi bi-chevron-up question-chevron" aria-hidden="true"></i>
          </summary>
          ${i?i.map(u=>N`<div class="card-body border-bottom">${u}</div>`):""}
          <div class="card-body">${l}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${s}">Check</button>
          </div>
        </details>
      `))],n={index:r,questions:o};for(let[s,c]of t)qe(n[c],s)}async function Vt(e,t){let r=[{...await Promise.resolve().then(()=>(G(),Y)).then(o=>o.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(K(),B)).then(o=>o.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(W(),X)).then(o=>o.default({user:e,weight:1.5}))},{...await Promise.resolve().then(()=>(H(),F)).then(o=>o.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(ee(),Z)).then(o=>o.default({user:e,weight:1}))},{...await Promise.resolve().then(()=>(oe(),te)).then(o=>o.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(ae(),se)).then(o=>o.default({user:e,weight:1.5}))},{...await Promise.resolve().then(()=>(le(),ie)).then(o=>o.default({user:e,weight:1.5}))},{...await Promise.resolve().then(()=>(de(),ce)).then(o=>o.default({user:e,weight:1}))},{...await Promise.resolve().then(()=>(ue(),pe)).then(o=>o.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(ge(),me)).then(o=>o.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(we(),ye)).then(o=>o.default({user:e,weight:1.5}))},{...await Promise.resolve().then(()=>(ke(),ve)).then(o=>o.default({user:e,weight:1.5}))},{...await Promise.resolve().then(()=>(Ee(),xe)).then(o=>o.default({user:e,weight:1.5}))},{...await Promise.resolve().then(()=>(Oe(),$e)).then(o=>o.default({user:e,weight:2}))}];return z(r,t),Object.fromEntries(r.map(({id:o,...n})=>[o,n]))}export{Vt as questions};
