var pt=Object.create;var Y=Object.defineProperty;var ht=Object.getOwnPropertyDescriptor;var ft=Object.getOwnPropertyNames;var mt=Object.getPrototypeOf,gt=Object.prototype.hasOwnProperty;var U=(o,n)=>()=>(o&&(n=o(o=0)),n);var O=(o,n)=>()=>(n||o((n={exports:{}}).exports,n),n.exports),_=(o,n)=>{for(var r in n)Y(o,r,{get:n[r],enumerable:!0})},wt=(o,n,r,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let c of ft(n))!gt.call(o,c)&&c!==r&&Y(o,c,{get:()=>n[c],enumerable:!(t=ht(n,c))||t.enumerable});return o};var j=(o,n,r)=>(r=o!=null?pt(mt(o)):{},wt(n||!o||!o.__esModule?Y(r,"default",{value:o,enumerable:!0}):r,o));var se={};_(se,{default:()=>Et});import{html as $t}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function kt({user:o,weight:n,questionId:r,version:t=""}){return async c=>{let l=String(c||"").trim();if(!l)throw new Error("Enter the service and GitHub Actions workflow URLs as JSON.");let i;try{i=JSON.parse(l)}catch{throw new Error("Enter valid JSON with serviceUrl and workflowUrl.")}if(!i||typeof i!="object"||typeof i.serviceUrl!="string"||typeof i.workflowUrl!="string")throw new Error("Enter valid JSON with string serviceUrl and workflowUrl values.");for(let u of[i.serviceUrl,i.workflowUrl]){let a;try{a=new URL(u)}catch{throw new Error("Both values must be valid URLs.")}if(a.protocol!=="http:"&&a.protocol!=="https:")throw new Error("Both URLs must start with http:// or https://.")}let e=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.email,quizSign:o.quizSign,response:l,weight:n,questionId:r,version:t})}),s=await e.json();if(!e.ok)throw new Error(s.error||"Unable to verify the service.");return s}}async function Et({user:o,weight:n=2,version:r=""}){let t="q-cicd-container-release-gate-server",c="CI/CD Container Release Gate",l=$t`
    <div class="mb-3">
      <p class="lead">
        Build a deterministic policy endpoint that decides whether a GitHub Actions run may promote a
        container image. This combines least-privilege CI, complete matrix testing, action pinning, and
        hardened Docker images into one release gate.
      </p>

      <p><strong>Endpoint:</strong> <code>POST /release-gate</code></p>
      <p>The request has this shape (the grader changes every value and may combine failures):</p>
      <pre><code>{
  "target": "preview | production",
  "event": "pull_request | push",
  "ref": "refs/heads/...",
  "workflow": {
    "trigger": "pull_request | pull_request_target | push",
    "permissions": {"contents":"read", "packages":"write", "id-token":"none"},
    "testsPassed": true, "matrixComplete": true, "failFast": false,
    "actions": [{"owner":"actions", "name":"checkout", "ref":"v4"}]
  },
  "image": {
    "multiStage": true, "runsAsRoot": false, "secretMode": "none | buildkit | arg | copy",
    "criticalVulnerabilities": 0, "digestPinned": true
  }
}</code></pre>

      <p><strong>Apply all of these rules:</strong></p>
      <ul>
        <li>
          Permissions must be exactly least privilege for a release: <code>contents: read</code>,
          <code>packages: write</code>, and <code>id-token: none</code>. No additional scopes may be present.
        </li>
        <li>
          A pull request must use <code>pull_request</code>, never <code>pull_request_target</code>. Tests must
          pass, the whole matrix must finish, and <code>failFast</code> must be <code>false</code>.
        </li>
        <li>
          Actions owned by <code>actions</code> may use a version tag. Every third-party action must be pinned
          to a full 40-character lowercase hexadecimal commit SHA.
        </li>
        <li>
          The image must be multi-stage, run as non-root, use either no build secret or a BuildKit secret
          mount, have zero critical vulnerabilities, and be referenced by digest.
        </li>
        <li>
          Production additionally requires a <code>push</code> on <code>refs/heads/main</code> and an
          <code>environmentApproval: true</code> field on <code>workflow</code>.
        </li>
      </ul>

      <p>Return exactly the applicable violation codes (order does not matter):</p>
      <p><code>EXCESS_PERMISSION</code>, <code>UNSAFE_PR_TRIGGER</code>, <code>TESTS_INCOMPLETE</code>,
        <code>MUTABLE_ACTION</code>, <code>SINGLE_STAGE_IMAGE</code>, <code>ROOT_RUNTIME</code>,
        <code>SECRET_IN_LAYER</code>, <code>CRITICAL_CVE</code>, <code>UNPINNED_IMAGE</code>,
        <code>INVALID_PRODUCTION_REF</code>, <code>APPROVAL_REQUIRED</code>.</p>
      <pre><code>{"decision":"promote | block", "violations":["CODE", "..."]}</code></pre>
      <p>
        Use <code>promote</code> only when the violations array is empty. The grader sends fresh safe, unsafe,
        and multi-failure payloads in shuffled order, so a constant allow/block response cannot pass.
      </p>

      <p><strong>GitHub Actions evidence:</strong></p>
      <ol>
        <li>Put the service in a public GitHub repository.</li>
        <li>
          Create a workflow named exactly <code>TDS GA7 Release Gate</code> that runs on a push to
          <code>main</code> and tests your release-gate implementation.
        </li>
        <li>
          Add a step named exactly <code>TDS identity: ${o.email}</code>, then run the workflow successfully
          on a push to <code>main</code>.
        </li>
      </ol>
      <p>
        Submit the workflow page URL, not an individual run URL. The backend reads the public workflow file and
        GitHub's <code>main</code>/<code>push</code> status badge—no GitHub API or token is used. This evidence is
        25% of the question; the live hidden policy probes are 75%.
      </p>

      <label for="${t}" class="form-label"><strong>Your submission JSON</strong></label>
      <textarea id="${t}" name="${t}" class="form-control font-monospace" rows="4"
        placeholder='{"serviceUrl":"https://release-gate.example.workers.dev","workflowUrl":"https://github.com/OWNER/REPO/actions/workflows/release-gate.yml"}'></textarea>
    </div>
  `,i=kt({user:o,weight:n,questionId:t,version:r});return{id:t,title:c,weight:n,question:l,answer:i}}var ce=U(()=>{"use strict"});var le={};_(le,{default:()=>Lt});import{html as St}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import At from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function qt({user:o,weight:n,questionId:r,version:t=""}){return async c=>{let l=String(c||"").trim();if(!l)throw new Error("Enter your deployed service base URL.");let i;try{i=new URL(l)}catch{throw new Error("Enter a valid URL.")}if(i.protocol!=="http:"&&i.protocol!=="https:")throw new Error("The URL must start with http:// or https://.");let e=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.email,quizSign:o.quizSign,response:l,weight:n,questionId:r,version:t})}),s=await e.json();if(!e.ok)throw new Error(s.error||"Unable to verify the service.");return s}}function Tt(o,n){let r=At(`q-llm-action-firewall-server#${String(o||"").trim().toLowerCase()}#${n}`),t=()=>Array.from({length:7},()=>"abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(r()*36)]).join("");return{tenantId:`tenant-${t()}`,emailDomain:`notify-${t()}.example`}}async function Lt({user:o,weight:n=2,version:r=""}){let t="q-llm-action-firewall-server",c="LLM Action Firewall",l=Tt(o.email,r),i=St`
    <div class="mb-3">
      <p class="lead">
        Assume an LLM can be compromised by prompt injection. Build a small deterministic firewall that checks
        its proposed action after generation and before any tool runs. Do not use an LLM or suspicious-phrase
        list for this check.
      </p>

      <div class="alert alert-secondary">
        <strong>Your assigned scope</strong><br />
        Tenant: <code>${l.tenantId}</code><br />
        Email recipient domain: <code>${l.emailDomain}</code>
      </div>

      <p><strong>Endpoint:</strong> <code>POST /action-firewall</code></p>
      <pre><code>{
  "provenance": "trusted | untrusted",
  "humanApproved": false,
  "untrustedContent": "optional text the model read",
  "action": {"tool": "...", "args": {...}}
}</code></pre>

      <p><strong>Allowed tools:</strong></p>
      <ul>
        <li><code>search</code>: exactly <code>{"query":"1–200 characters"}</code>.</li>
        <li>
          <code>lookup_record</code>: exactly <code>{"tenantId":"...","recordId":"non-empty"}</code>;
          <code>tenantId</code> must equal your assigned tenant.
        </li>
        <li>
          <code>send_email</code>: exactly <code>{"to":"...","subject":"...","body":"..."}</code>;
          the recipient domain must match exactly and <code>humanApproved</code> must be true.
        </li>
        <li>
          <code>render_html</code>: exactly <code>{"html":"..."}</code>; block scripts, iframes, inline event
          handlers, and <code>javascript:</code> URLs.
        </li>
      </ul>
      <p>
        A valid read-only action stays allowed even if <code>untrustedContent</code> contains an instruction to
        ignore prior rules. Schemas, scopes, approval, and safe rendering—not phrase matching—are the boundary.
      </p>

      <p>Return one reason:</p>
      <pre><code>{"decision":"allow | block", "reason":"ALLOW | INVALID_SCHEMA | TOOL_NOT_ALLOWED | TENANT_SCOPE | EGRESS_DENIED | APPROVAL_REQUIRED | UNSAFE_OUTPUT"}</code></pre>
      <p>
        Check the top-level schema, tool allowlist, selected tool's argument schema, tenant scope, exact email
        domain, human approval, and HTML safety in that order. Return the first applicable reason. Use
        <code>{"decision":"allow","reason":"ALLOW"}</code> if no rule fails. Hidden requests contain one
        fault at a time, plus several valid requests, so the expected result is unambiguous.
      </p>

      <label for="${t}" class="form-label"><strong>Your deployed service base URL</strong></label>
      <input id="${t}" name="${t}" class="form-control font-monospace" type="url"
        placeholder="https://firewall.example.workers.dev" />
    </div>
  `,e=qt({user:o,weight:n,questionId:t,version:r});return{id:t,title:c,weight:n,question:i,answer:e}}var de=U(()=>{"use strict"});var ue={};_(ue,{default:()=>_t});import{html as It}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import Rt from"https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";function Ct({user:o,weight:n,questionId:r,version:t=""}){return async c=>{let l=String(c||"").trim();if(!l)throw new Error("Enter your deployed service base URL.");let i;try{i=new URL(l)}catch{throw new Error("Enter a valid URL.")}if(i.protocol!=="http:"&&i.protocol!=="https:")throw new Error("The URL must start with http:// or https://.");let e=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.email,quizSign:o.quizSign,response:l,weight:n,questionId:r,version:t})}),s=await e.json();if(!e.ok)throw new Error(s.error||"Unable to verify the service.");return s}}function Ut(o,n){let r=Rt(`q-terraform-plan-guard-server#${String(o||"").trim().toLowerCase()}#${n}`),t=c=>Array.from({length:c},()=>"abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(r()*36)]).join("");return{environment:`prod-${t(6)}`,labels:{owner:`student-${t(5)}`,environment:"production",cost_center:`cc-${t(4)}`}}}async function _t({user:o,weight:n=2,version:r=""}){let t="q-terraform-plan-guard-server",c="Terraform Plan Policy Gate",l=Ut(o.email,r),i=It`
    <div class="mb-3">
      <p class="lead">
        Implement a policy-as-code endpoint that reviews one normalized Terraform resource change before
        <code>apply</code>. It must protect remote state, reject plaintext secrets and accidental destruction,
        and enforce labels used for cloud-cost ownership.
      </p>

      <div class="alert alert-secondary">
        <strong>Your production workspace:</strong> <code>${l.environment}</code><br />
        <strong>Required labels:</strong> <code>${JSON.stringify(l.labels)}</code>
      </div>

      <p><strong>Endpoint:</strong> <code>POST /terraform/plan</code></p>
      <pre><code>{
  "environment": "${l.environment}",
  "state": {"backend":"gcs", "locked":true},
  "providerVersion": "~> 6.0",
  "destroyApproved": false,
  "resource": {
    "address": "google_storage_bucket.data",
    "type": "storage_bucket",
    "action": "create | update | delete",
    "labels": ${JSON.stringify(l.labels)},
    "secret": null,
    "forceDestroy": false
  }
}</code></pre>

      <p><strong>Check these rules in order:</strong></p>
      <ol>
        <li>The request and nested objects must have the shown value types.</li>
        <li>The environment must exactly match your assigned workspace.</li>
        <li>
          State must use <code>gcs</code>, <code>s3</code>, <code>azurerm</code>, or <code>remote</code>, and
          <code>locked</code> must be true.
        </li>
        <li>
          The provider must be exact (<code>6.2.1</code> or <code>= 6.2.1</code>) or pessimistically pinned
          (<code>~> 6.0</code>). <code>&gt;=</code>, <code>*</code>, and <code>latest</code> are unpinned.
        </li>
        <li>All three assigned labels must be present with exact values.</li>
        <li><code>secret</code> must be <code>null</code> or a non-empty <code>secret://...</code> reference.</li>
        <li>
          Deleting a <code>storage_bucket</code>, <code>sql_database</code>, or <code>persistent_disk</code> requires
          <code>destroyApproved: true</code>.
        </li>
        <li>A production <code>storage_bucket</code> may never use <code>forceDestroy: true</code>.</li>
      </ol>

      <p>Return the first applicable reason from the order above:</p>
      <pre><code>{"decision":"approve | reject", "reason":"APPROVE | INVALID_PLAN | ENVIRONMENT_MISMATCH | STATE_UNSAFE | UNPINNED_PROVIDER | MISSING_LABELS | PLAINTEXT_SECRET | DELETE_NOT_APPROVED | FORCE_DESTROY"}</code></pre>
      <p>
        Use <code>{"decision":"approve","reason":"APPROVE"}</code> when every rule passes. Hidden requests use
        fresh resource addresses and contain one fault at a time, plus valid creates, updates, and approved
        deletes. This is a normalized policy input, not Terraform's full internal plan JSON.
      </p>

      <label for="${t}" class="form-label"><strong>Your deployed service base URL</strong></label>
      <input id="${t}" name="${t}" class="form-control font-monospace" type="url"
        placeholder="https://iac-policy.example.workers.dev" />
    </div>
  `,e=Ct({user:o,weight:n,questionId:t,version:r});return{id:t,title:c,weight:n,question:i,answer:e}}var pe=U(()=>{"use strict"});var fe=O((he,X)=>{(function(o,n,r){function t(e){var s=this,u=i();s.next=function(){var a=2091639*s.s0+s.c*23283064365386963e-26;return s.s0=s.s1,s.s1=s.s2,s.s2=a-(s.c=a|0)},s.c=1,s.s0=u(" "),s.s1=u(" "),s.s2=u(" "),s.s0-=u(e),s.s0<0&&(s.s0+=1),s.s1-=u(e),s.s1<0&&(s.s1+=1),s.s2-=u(e),s.s2<0&&(s.s2+=1),u=null}function c(e,s){return s.c=e.c,s.s0=e.s0,s.s1=e.s1,s.s2=e.s2,s}function l(e,s){var u=new t(e),a=s&&s.state,d=u.next;return d.int32=function(){return u.next()*4294967296|0},d.double=function(){return d()+(d()*2097152|0)*11102230246251565e-32},d.quick=d,a&&(typeof a=="object"&&c(a,u),d.state=function(){return c(u,{})}),d}function i(){var e=4022871197,s=function(u){u=String(u);for(var a=0;a<u.length;a++){e+=u.charCodeAt(a);var d=.02519603282416938*e;e=d>>>0,d-=e,d*=e,e=d>>>0,d-=e,e+=d*4294967296}return(e>>>0)*23283064365386963e-26};return s}n&&n.exports?n.exports=l:r&&r.amd?r(function(){return l}):this.alea=l})(he,typeof X=="object"&&X,typeof define=="function"&&define)});var ge=O((me,V)=>{(function(o,n,r){function t(i){var e=this,s="";e.x=0,e.y=0,e.z=0,e.w=0,e.next=function(){var a=e.x^e.x<<11;return e.x=e.y,e.y=e.z,e.z=e.w,e.w^=e.w>>>19^a^a>>>8},i===(i|0)?e.x=i:s+=i;for(var u=0;u<s.length+64;u++)e.x^=s.charCodeAt(u)|0,e.next()}function c(i,e){return e.x=i.x,e.y=i.y,e.z=i.z,e.w=i.w,e}function l(i,e){var s=new t(i),u=e&&e.state,a=function(){return(s.next()>>>0)/4294967296};return a.double=function(){do var d=s.next()>>>11,p=(s.next()>>>0)/4294967296,h=(d+p)/(1<<21);while(h===0);return h},a.int32=s.next,a.quick=a,u&&(typeof u=="object"&&c(u,s),a.state=function(){return c(s,{})}),a}n&&n.exports?n.exports=l:r&&r.amd?r(function(){return l}):this.xor128=l})(me,typeof V=="object"&&V,typeof define=="function"&&define)});var ve=O((we,F)=>{(function(o,n,r){function t(i){var e=this,s="";e.next=function(){var a=e.x^e.x>>>2;return e.x=e.y,e.y=e.z,e.z=e.w,e.w=e.v,(e.d=e.d+362437|0)+(e.v=e.v^e.v<<4^(a^a<<1))|0},e.x=0,e.y=0,e.z=0,e.w=0,e.v=0,i===(i|0)?e.x=i:s+=i;for(var u=0;u<s.length+64;u++)e.x^=s.charCodeAt(u)|0,u==s.length&&(e.d=e.x<<10^e.x>>>4),e.next()}function c(i,e){return e.x=i.x,e.y=i.y,e.z=i.z,e.w=i.w,e.v=i.v,e.d=i.d,e}function l(i,e){var s=new t(i),u=e&&e.state,a=function(){return(s.next()>>>0)/4294967296};return a.double=function(){do var d=s.next()>>>11,p=(s.next()>>>0)/4294967296,h=(d+p)/(1<<21);while(h===0);return h},a.int32=s.next,a.quick=a,u&&(typeof u=="object"&&c(u,s),a.state=function(){return c(s,{})}),a}n&&n.exports?n.exports=l:r&&r.amd?r(function(){return l}):this.xorwow=l})(we,typeof F=="object"&&F,typeof define=="function"&&define)});var be=O((ye,J)=>{(function(o,n,r){function t(i){var e=this;e.next=function(){var u=e.x,a=e.i,d,p,h;return d=u[a],d^=d>>>7,p=d^d<<24,d=u[a+1&7],p^=d^d>>>10,d=u[a+3&7],p^=d^d>>>3,d=u[a+4&7],p^=d^d<<7,d=u[a+7&7],d=d^d<<13,p^=d^d<<9,u[a]=p,e.i=a+1&7,p};function s(u,a){var d,p,h=[];if(a===(a|0))p=h[0]=a;else for(a=""+a,d=0;d<a.length;++d)h[d&7]=h[d&7]<<15^a.charCodeAt(d)+h[d+1&7]<<13;for(;h.length<8;)h.push(0);for(d=0;d<8&&h[d]===0;++d);for(d==8?p=h[7]=-1:p=h[d],u.x=h,u.i=0,d=256;d>0;--d)u.next()}s(e,i)}function c(i,e){return e.x=i.x.slice(),e.i=i.i,e}function l(i,e){i==null&&(i=+new Date);var s=new t(i),u=e&&e.state,a=function(){return(s.next()>>>0)/4294967296};return a.double=function(){do var d=s.next()>>>11,p=(s.next()>>>0)/4294967296,h=(d+p)/(1<<21);while(h===0);return h},a.int32=s.next,a.quick=a,u&&(u.x&&c(u,s),a.state=function(){return c(s,{})}),a}n&&n.exports?n.exports=l:r&&r.amd?r(function(){return l}):this.xorshift7=l})(ye,typeof J=="object"&&J,typeof define=="function"&&define)});var $e=O((xe,Q)=>{(function(o,n,r){function t(i){var e=this;e.next=function(){var u=e.w,a=e.X,d=e.i,p,h;return e.w=u=u+1640531527|0,h=a[d+34&127],p=a[d=d+1&127],h^=h<<13,p^=p<<17,h^=h>>>15,p^=p>>>12,h=a[d]=h^p,e.i=d,h+(u^u>>>16)|0};function s(u,a){var d,p,h,m,b,v=[],k=128;for(a===(a|0)?(p=a,a=null):(a=a+"\0",p=0,k=Math.max(k,a.length)),h=0,m=-32;m<k;++m)a&&(p^=a.charCodeAt((m+32)%a.length)),m===0&&(b=p),p^=p<<10,p^=p>>>15,p^=p<<4,p^=p>>>13,m>=0&&(b=b+1640531527|0,d=v[m&127]^=p+b,h=d==0?h+1:0);for(h>=128&&(v[(a&&a.length||0)&127]=-1),h=127,m=512;m>0;--m)p=v[h+34&127],d=v[h=h+1&127],p^=p<<13,d^=d<<17,p^=p>>>15,d^=d>>>12,v[h]=p^d;u.w=b,u.X=v,u.i=h}s(e,i)}function c(i,e){return e.i=i.i,e.w=i.w,e.X=i.X.slice(),e}function l(i,e){i==null&&(i=+new Date);var s=new t(i),u=e&&e.state,a=function(){return(s.next()>>>0)/4294967296};return a.double=function(){do var d=s.next()>>>11,p=(s.next()>>>0)/4294967296,h=(d+p)/(1<<21);while(h===0);return h},a.int32=s.next,a.quick=a,u&&(u.X&&c(u,s),a.state=function(){return c(s,{})}),a}n&&n.exports?n.exports=l:r&&r.amd?r(function(){return l}):this.xor4096=l})(xe,typeof Q=="object"&&Q,typeof define=="function"&&define)});var Ee=O((ke,K)=>{(function(o,n,r){function t(i){var e=this,s="";e.next=function(){var a=e.b,d=e.c,p=e.d,h=e.a;return a=a<<25^a>>>7^d,d=d-p|0,p=p<<24^p>>>8^h,h=h-a|0,e.b=a=a<<20^a>>>12^d,e.c=d=d-p|0,e.d=p<<16^d>>>16^h,e.a=h-a|0},e.a=0,e.b=0,e.c=-1640531527,e.d=1367130551,i===Math.floor(i)?(e.a=i/4294967296|0,e.b=i|0):s+=i;for(var u=0;u<s.length+20;u++)e.b^=s.charCodeAt(u)|0,e.next()}function c(i,e){return e.a=i.a,e.b=i.b,e.c=i.c,e.d=i.d,e}function l(i,e){var s=new t(i),u=e&&e.state,a=function(){return(s.next()>>>0)/4294967296};return a.double=function(){do var d=s.next()>>>11,p=(s.next()>>>0)/4294967296,h=(d+p)/(1<<21);while(h===0);return h},a.int32=s.next,a.quick=a,u&&(typeof u=="object"&&c(u,s),a.state=function(){return c(s,{})}),a}n&&n.exports?n.exports=l:r&&r.amd?r(function(){return l}):this.tychei=l})(ke,typeof K=="object"&&K,typeof define=="function"&&define)});var Se=O(()=>{});var qe=O((Ae,z)=>{(function(o,n,r){var t=256,c=6,l=52,i="random",e=r.pow(t,c),s=r.pow(2,l),u=s*2,a=t-1,d;function p(x,y,f){var w=[];y=y==!0?{entropy:!0}:y||{};var $=v(b(y.entropy?[x,T(n)]:x??k(),3),w),S=new h(w),A=function(){for(var q=S.g(c),I=e,L=0;q<s;)q=(q+L)*t,I*=t,L=S.g(1);for(;q>=u;)q/=2,I/=2,L>>>=1;return(q+L)/I};return A.int32=function(){return S.g(4)|0},A.quick=function(){return S.g(4)/4294967296},A.double=A,v(T(S.S),n),(y.pass||f||function(q,I,L,C){return C&&(C.S&&m(C,S),q.state=function(){return m(S,{})}),L?(r[i]=q,I):q})(A,$,"global"in y?y.global:this==r,y.state)}function h(x){var y,f=x.length,w=this,$=0,S=w.i=w.j=0,A=w.S=[];for(f||(x=[f++]);$<t;)A[$]=$++;for($=0;$<t;$++)A[$]=A[S=a&S+x[$%f]+(y=A[$])],A[S]=y;(w.g=function(q){for(var I,L=0,C=w.i,g=w.j,E=w.S;q--;)I=E[C=a&C+1],L=L*t+E[a&(E[C]=E[g=a&g+I])+(E[g]=I)];return w.i=C,w.j=g,L})(t)}function m(x,y){return y.i=x.i,y.j=x.j,y.S=x.S.slice(),y}function b(x,y){var f=[],w=typeof x,$;if(y&&w=="object")for($ in x)try{f.push(b(x[$],y-1))}catch{}return f.length?f:w=="string"?x:x+"\0"}function v(x,y){for(var f=x+"",w,$=0;$<f.length;)y[a&$]=a&(w^=y[a&$]*19)+f.charCodeAt($++);return T(y)}function k(){try{var x;return d&&(x=d.randomBytes)?x=x(t):(x=new Uint8Array(t),(o.crypto||o.msCrypto).getRandomValues(x)),T(x)}catch{var y=o.navigator,f=y&&y.plugins;return[+new Date,o,f,o.screen,T(n)]}}function T(x){return String.fromCharCode.apply(0,x)}if(v(r.random(),n),typeof z=="object"&&z.exports){z.exports=p;try{d=Se()}catch{}}else typeof define=="function"&&define.amd?define(function(){return p}):r["seed"+i]=p})(typeof self<"u"?self:Ae,[],Math)});var D=O((Eo,Te)=>{var Nt=fe(),Ot=ge(),Mt=ve(),Dt=be(),jt=$e(),Ht=Ee(),M=qe();M.alea=Nt;M.xor128=Ot;M.xorwow=Mt;M.xorshift7=Dt;M.xor4096=jt;M.tychei=Ht;Te.exports=M});var Ie={};_(Ie,{default:()=>zt});import{html as Pt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Wt({user:o,weight:n,questionId:r,version:t=""}){return async c=>{let l=String(c||"").trim();if(!l)throw new Error("Enter your deployed service base URL.");let i;try{i=new URL(l)}catch{throw new Error("Enter a valid URL.")}if(i.protocol!=="http:"&&i.protocol!=="https:")throw new Error("The URL must start with http:// or https://.");let e=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.email,quizSign:o.quizSign,response:l,weight:n,questionId:r,version:t})}),s=await e.json();if(!e.ok)throw new Error(s.error||"Unable to verify the service.");return s}}function Gt(o,n){let r=(0,Le.default)(`q-llm-output-sanitizer-server#${String(o||"").trim().toLowerCase()}#${n}`),t=()=>Array.from({length:7},()=>"abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(r()*36)]).join("");return{allowedHosts:[`cdn-${t()}.example`,`app-${t()}.example`]}}async function zt({user:o,weight:n=2,version:r=""}){let t="q-llm-output-sanitizer-server",c="LLM Output Handling Gate (OWASP LLM05)",l=Gt(o.email,r),i=Pt`
    <div class="mb-3">
      <p class="lead">
        Model output is untrusted input. Build a deterministic gate that decides whether a model's output is safe to
        hand to a given sink. No LLM, no suspicious-phrase list — only the rules below.
      </p>

      <div class="alert alert-secondary">
        <strong>Your assigned allowlist of external hosts</strong><br />
        <code>${l.allowedHosts[0]}</code><br />
        <code>${l.allowedHosts[1]}</code><br />
        <span class="text-muted">Exact hostname matches only — subdomains of these are <em>not</em> allowed.</span>
      </div>

      <p><strong>Endpoint:</strong> <code>POST /sanitize-output</code></p>
      <pre><code>{"channel": "html | markdown | url | sql | shell", "output": "the model's output"}</code></pre>
      <p>Respond with exactly:</p>
      <pre><code>{"safe": true | false, "reason": "SAFE | INVALID_SCHEMA | SCRIPT_TAG | EVENT_HANDLER | DANGEROUS_SCHEME | EXTERNAL_EXFIL | SQL_METACHAR | SHELL_METACHAR | ENCODED_PAYLOAD"}</code></pre>
      <p><code>safe</code> is <code>true</code> only when <code>reason</code> is <code>SAFE</code>.</p>

      <h5>Rules, applied in this exact order</h5>
      <ol>
        <li>
          <strong>INVALID_SCHEMA</strong> — body is not an object, <code>channel</code> is not one of the five
          values, <code>output</code> is not a string, or <code>output</code> is longer than 20000 characters.
        </li>
        <li>
          <strong>ENCODED_PAYLOAD</strong> — decode the output <em>once</em> (percent-escapes, then HTML entities
          — numeric <code>&amp;#NN;</code>/<code>&amp;#xNN;</code> and the named entities
          <code>&amp;lt; &amp;gt; &amp;quot; &amp;apos; &amp;amp;</code> — then <code>\\uXXXX</code> escapes). If the
          decoded string <em>differs</em> from the original <em>and</em> the decoded string would trip any rule
          below, the reason is <code>ENCODED_PAYLOAD</code>.
        </li>
        <li>
          Then apply the channel rules below to the <strong>original</strong> output, first match wins.
        </li>
      </ol>

      <h5>Channel rules</h5>
      <table class="table table-sm">
        <thead>
          <tr><th>Channel</th><th>Checks, in order</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>html</code></td>
            <td>
              <code>SCRIPT_TAG</code> (an opening <code>script</code>, <code>iframe</code>, <code>object</code> or
              <code>embed</code> tag) → <code>EVENT_HANDLER</code> (an <code>on…=</code> attribute) →
              <code>DANGEROUS_SCHEME</code> → <code>EXTERNAL_EXFIL</code>
            </td>
          </tr>
          <tr><td><code>markdown</code></td><td><code>DANGEROUS_SCHEME</code> → <code>EXTERNAL_EXFIL</code></td></tr>
          <tr><td><code>url</code></td><td><code>DANGEROUS_SCHEME</code> → <code>EXTERNAL_EXFIL</code></td></tr>
          <tr><td><code>sql</code></td><td><code>SQL_METACHAR</code></td></tr>
          <tr><td><code>shell</code></td><td><code>SHELL_METACHAR</code></td></tr>
        </tbody>
      </table>

      <ul>
        <li>
          <strong>DANGEROUS_SCHEME</strong>: the text contains <code>javascript:</code>, <code>data:</code> or
          <code>vbscript:</code> (case-insensitive, optional whitespace before the colon), or an extracted URL uses
          any scheme other than <code>http</code>/<code>https</code>.
        </li>
        <li>
          <strong>EXTERNAL_EXFIL</strong>: an extracted <em>absolute</em> URL's hostname is not exactly one of your
          two allowed hosts. Relative references such as <code>/local/page</code> are fine. A
          <strong>protocol-relative</strong> reference such as <code>//host/path</code> counts as absolute (resolve
          it as <code>https:</code>), because a browser will fetch it.
        </li>
        <li>
          Compare the parsed <strong>hostname</strong> only. Credentials
          (<code>https://allowed@attacker.example/</code>) and query strings
          (<code>https://attacker.example/?next=https://allowed/</code>) can both contain an allowed host while the
          request still goes somewhere else.
        </li>
        <li>
          <strong>Extracting URLs</strong> — <code>html</code>: the values of quoted <code>src=</code> and
          <code>href=</code> attributes. <code>markdown</code>: the target inside <code>](…)</code>.
          <code>url</code>: the whole trimmed output.
        </li>
        <li>
          <strong>SQL_METACHAR</strong>: a single quote, double quote, semicolon, <code>--</code>,
          <code>/*</code>, the word <code>union</code>, or <code>or 1=1</code> (case-insensitive).
        </li>
        <li>
          <strong>SHELL_METACHAR</strong>: any of
          <code>; &amp; | &#96; &lt; &gt;</code> or <code>$(</code> or <code>$&#123;</code>.
        </li>
      </ul>

      <p>
        Hidden probes include benign output for every channel, one fault at a time, an allowed host used correctly,
        and a host that merely <em>looks</em> like an allowed host. Substring matching on the allowlist will fail.
      </p>

      <label for="${t}" class="form-label"><strong>Your deployed service base URL</strong></label>
      <input id="${t}" name="${t}" class="form-control font-monospace" type="url"
        placeholder="https://sanitizer.example.workers.dev" />
    </div>
  `,e=Wt({user:o,weight:n,questionId:t,version:r});return{id:t,title:c,weight:n,question:i,answer:e}}var Le,Re=U(()=>{"use strict";Le=j(D(),1)});var Ue={};_(Ue,{default:()=>Vt});import{html as Bt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Yt({user:o,weight:n,questionId:r,version:t=""}){return async c=>{let l=String(c||"").trim();if(!l)throw new Error("Enter your deployed service base URL.");let i;try{i=new URL(l)}catch{throw new Error("Enter a valid URL.")}if(i.protocol!=="http:"&&i.protocol!=="https:")throw new Error("The URL must start with http:// or https://.");let e=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.email,quizSign:o.quizSign,response:l,weight:n,questionId:r,version:t})}),s=await e.json();if(!e.ok)throw new Error(s.error||"Unable to verify the service.");return s}}function Xt(o,n){let r=(0,Ce.default)(`q-osint-corroboration-server#${String(o||"").trim().toLowerCase()}#${n}`);return{subject:`${Array.from({length:6},()=>"abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(r()*36)]).join("")}.example`,stalenessDays:[90,120,180,365][Math.floor(r()*4)]}}async function Vt({user:o,weight:n=2,version:r=""}){let t="q-osint-corroboration-server",c="OSINT Corroboration Engine",l=Xt(o.email,r),i=Bt`
    <div class="mb-3">
      <p class="lead">
        Collecting open-source records is the easy half. Build the half that matters: a service that decides whether
        the evidence actually <em>supports</em> a claim, how confident that makes you, and which sources justify it.
      </p>

      <div class="alert alert-secondary">
        <strong>Your assigned subject</strong>: <code>${l.subject}</code><br />
        <span class="text-muted">
          Every request carries its own <code>asOf</code> timestamp and <code>stalenessDays</code> window, so your
          service must never read the wall clock.
        </span>
      </div>

      <p><strong>Endpoint:</strong> <code>POST /corroborate</code></p>
      <pre><code>{
  "claim": {"subject": "...", "predicate": "resolves_to", "value": "203.0.113.20"},
  "asOf": "2026-08-01T00:00:00Z",
  "stalenessDays": ${l.stalenessDays},
  "sources": [
    {"id": "s1", "type": "dns", "origin": "resolver-a",
     "observedAt": "2026-07-30T00:00:00Z", "value": "203.0.113.20", "authoritative": false}
  ]
}</code></pre>
      <p>Respond with exactly:</p>
      <pre><code>{"verdict": "supported | contradicted | unverified | invalid",
 "confidence": "high | medium | low",
 "corroboratingSources": ["s1", "s2"]}</code></pre>

      <h5>Definitions</h5>
      <ul>
        <li>
          <strong>Fresh</strong>: <code>asOf − observedAt ≤ stalenessDays</code>. Anything older is
          <strong>stale</strong> and carries no weight.
        </li>
        <li>
          <strong>Independent</strong>: sources are independent only when their <code>origin</code> values differ.
          Two records from the same <code>origin</code> are mirrors and count <strong>once</strong>.
        </li>
        <li>
          <strong>Valid source</strong>: <code>id</code>, <code>origin</code>, <code>value</code> and
          <code>observedAt</code> are strings and <code>type</code> is one of <code>dns</code>,
          <code>ct_log</code>, <code>registry</code>, <code>archive</code>, <code>scan</code>. Any other source is
          ignored entirely.
        </li>
      </ul>

      <h5>Decision rules, in this exact order</h5>
      <ol>
        <li>
          <strong>invalid</strong> / <code>low</code> / <code>[]</code> — the body is not an object,
          <code>claim.value</code> is not a string, <code>asOf</code> is missing or unparseable,
          <code>stalenessDays</code> is not a number, or <code>sources</code> is not an array.
        </li>
        <li>
          <strong>contradicted</strong> — at least one <em>fresh</em> source with
          <code>authoritative: true</code> reports a <code>value</code> different from the claim.
          Confidence <code>low</code>. <code>corroboratingSources</code> = the ids of those contradicting sources,
          sorted ascending.
        </li>
        <li>
          <strong>supported</strong> — after keeping only fresh sources whose <code>value</code> equals the claim,
          and reducing them to one representative per <code>origin</code> (the representative is the source with the
          <strong>lexicographically smallest id</strong> for that origin), <strong>two or more</strong>
          representatives remain.
          <ul>
            <li>Confidence <code>high</code> if those representatives span <strong>two or more</strong> distinct
              <code>type</code> values.</li>
            <li>Confidence <code>medium</code> if they all share a single <code>type</code>.</li>
            <li><code>corroboratingSources</code> = the representative ids, sorted ascending.</li>
          </ul>
        </li>
        <li>
          <strong>unverified</strong> / <code>low</code> / <code>[]</code> — anything else: no sources, a single
          independent source, only mirrors of one origin, or agreement that is entirely stale.
        </li>
      </ol>

      <p>
        A stale authoritative disagreement does <strong>not</strong> contradict a fresh, well-corroborated claim.
        Disagreement from a non-authoritative source neither contradicts nor supports — it simply is not counted.
      </p>

      <label for="${t}" class="form-label"><strong>Your deployed service base URL</strong></label>
      <input id="${t}" name="${t}" class="form-control font-monospace" type="url"
        placeholder="https://corroborate.example.workers.dev" />
    </div>
  `,e=Yt({user:o,weight:n,questionId:t,version:r});return{id:t,title:c,weight:n,question:i,answer:e}}var Ce,_e=U(()=>{"use strict";Ce=j(D(),1)});var Oe={};_(Oe,{default:()=>Jt});import{html as Ne}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Jt({user:o,weight:n=4,version:r=""}){let t="q-streetview-geolocation-server",c="Street View OSINT: Where Is This?",l=`./questionData?email=${encodeURIComponent(o.email)}&quizSign=${encodeURIComponent(o.quizSign||"")}&questionId=${encodeURIComponent(t)}&version=${encodeURIComponent(r)}`,i=null,e=null;try{let p=await fetch(l);if(!p.ok)throw new Error(await p.text()||`HTTP ${p.status}`);i=await p.json()}catch(p){e=p instanceof Error?p.message:String(p)}if(!i){let p=Ne`
      <div class="alert alert-danger" role="alert">
        <strong><i class="bi bi-exclamation-triangle-fill"></i> Could not load this question's data.</strong>
        <p class="mb-0">${e}</p>
        <p class="mb-0">Try reloading the page. If this persists, contact the exam team.</p>
      </div>
    `;return{id:t,title:c,weight:n,question:p,answer:async()=>({correct:!1,message:e})}}let s=`${Ft}/${i.file}`,u=i.toleranceMetres??100,a=Ne`
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
        ${n} ${n==1?"mark":"marks"} only if the place, the country, <em>and</em> the
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
            <strong>${u} metres</strong> of the true spot. You don't need the exact decimals — get
            the right street corner and you're in. You can write a hemisphere letter
            (e.g. <code>94.5583 W</code>) instead of a minus sign if you prefer.</li>
          <li>Each <kbd>Check</kbd> is graded on the server, so it needs a moment. Your final submission is
            re-verified the same way.</li>
        </ul>
      </div>

      <p class="text-muted">
        Worth <strong>${n} ${n==1?"mark":"marks"}</strong>.
      </p>
    </div>
  `;return{id:t,title:c,weight:n,question:a,answer:async p=>{let h=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:o.email,quizSign:o.quizSign,response:p,weight:n,questionId:t,version:r})}),m=await h.json();if(!h.ok)throw new Error(m.error||"Verification failed.");return m}}}var Ft,Me=U(()=>{"use strict";Ft="https://files.s-anand.net/pages/tds-roe-2026-05-images"});var ze={};_(ze,{default:()=>Zt,generateDorkIndex:()=>Ge,runQuery:()=>We,tokenizeQuery:()=>Pe});import{html as Qt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function Pe(o){let n=[],r="",t=!1,c=0;for(let l of String(o)){if(l==='"'&&(t=!t),l==="("&&!t&&c++,l===")"&&!t&&c--,/\s/.test(l)&&!t&&c===0){r&&n.push(r),r="";continue}r+=l}if(r&&n.push(r),t)throw new Error("Unbalanced quote in your query.");if(c!==0)throw new Error("Unbalanced parenthesis in your query.");return n}function De(o,n){let r=o.startsWith("-"),t=r?o.slice(1):o,c=t.indexOf(":"),l=c>0?N(t.slice(0,c)):"",i=c>0?t.slice(c+1):t,e=N(i.replace(/^"|"$/g,""));if(!e)throw new Error(`Empty value in token: ${o}`);let s;if(l==="site")s=n.host===e||n.host.endsWith(`.${e}`);else if(l==="filetype")s=n.filetype===e;else if(l==="inurl")s=N(n.url).includes(e);else if(l==="intitle")s=N(n.title).includes(e);else if(l==="intext")s=N(n.body).includes(e);else if(l==="after")s=n.year>Number(e);else if(l==="before")s=n.year<Number(e);else{if(l)throw new Error(`Unsupported operator: ${l}:`);s=N(n.title).includes(e)||N(n.body).includes(e)}if((l==="after"||l==="before")&&!Number.isFinite(Number(e)))throw new Error(`${l}: needs a year, got "${i}".`);return r?!s:s}function Kt(o,n){return o.every(r=>{if(r.startsWith("(")&&r.endsWith(")")){let t=r.slice(1,-1).split(/\s+OR\s+/);if(t.length<2)throw new Error("An OR group needs at least two alternatives.");return t.some(c=>De(c.trim(),n))}return De(r,n)})}function je(o){return o.length}function We(o,n){let r=Pe(o);if(!r.length)throw new Error("Enter a query.");if(je(r)>Z)throw new Error(`Use at most ${Z} tokens. You used ${je(r)}.`);return n.filter(t=>Kt(r,t)).map(t=>t.url)}function Ge(o,n=""){let r=(0,He.default)(`q-google-dorks-advanced#${N(String(o).trim())}#${n}`),t=f=>f[Math.floor(r()*f.length)],c=(f,w)=>f+Math.floor(r()*(w-f+1)),l=t(["nagarpalika","stateboard","portcity","civicdata","waterworks"]),i=`${l}.example`,e=[i,`data.${i}`,`docs.${i}`,`legacy.${i}`,`mirror.${l}-cdn.example`],s=t(["annual water audit","ward level rainfall","tender evaluation notes","ledger of receipts"]),u=t(["audit","rainfall","tender","ledger"]),a=c(2019,2022),d=["reports","drafts","archive","open-data","notices"],p=["pdf","csv","xlsx","html"],h=[],m=new Set,b=f=>{m.has(f.url)||(m.add(f.url),h.push(f))},v=c(6,9);for(let f=0;f<v;f++){let w=t([i,`data.${i}`,`docs.${i}`]),$=t(["reports","archive","open-data","notices"]);b({url:`https://${w}/${$}/${u}-${c(100,999)}.pdf`,host:w,title:`District ${u} summary ${c(1,40)}`,body:`Prepared for review. Contains the ${s} for the period.`,filetype:"pdf",year:c(a+1,2026)})}let k=[()=>({filetype:t(["csv","xlsx","html"])}),()=>({year:c(2015,a)}),()=>({title:`District summary ${c(1,40)}`}),()=>({body:`Prepared for review. Contains the ${s.split(" ")[0]} totals only.`}),()=>({section:"drafts"}),()=>({host:`mirror.${l}-cdn.example`}),()=>({host:`legacy.${i}`,section:"drafts"})];for(let f=0;f<60;f++){let w=k[f%k.length](),$=w.host??t([i,`data.${i}`,`docs.${i}`,`legacy.${i}`]),S=w.section??t(["reports","archive","open-data","notices"]),A=w.filetype??"pdf";b({url:`https://${$}/${S}/${u}-${c(1e3,9999)}.${A}`,host:$,title:w.title??`District ${u} summary ${c(41,99)}`,body:w.body??`Prepared for review. Contains the ${s} for the period.`,filetype:A,year:w.year??c(a+1,2026)})}let T=["budget","roster","minutes","sanitation","transport","heritage"];for(;h.length<180;){let f=t(e),w=t(p),$=t(T);b({url:`https://${f}/${t(d)}/${$}-${c(1e3,9999)}.${w}`,host:f,title:`${$[0].toUpperCase()}${$.slice(1)} notes ${c(1,900)}`,body:`Routine ${$} record. No audit content in this document.`,filetype:w,year:c(2015,2026)})}let x=f=>(f.host===i||f.host.endsWith(`.${i}`))&&f.filetype==="pdf"&&f.year>a&&N(f.title).includes(u)&&N(f.body).includes(s)&&!f.url.includes("/drafts/"),y=h.filter(x).map(f=>f.url).sort();return{docs:h,targets:y,apex:i,cutoff:a}}async function Zt({user:o,weight:n=1,version:r=""}){let t="q-google-dorks-advanced",c="Advanced Search Operators: Hit the Target Set Exactly",{docs:l,targets:i}=Ge(o.email,r),e=u=>{let a=We(String(u||"").trim(),l).sort();if(a.length===0)throw new Error("Your query matched nothing.");let d=a.filter(h=>!i.includes(h)),p=i.filter(h=>!a.includes(h));if(d.length||p.length)throw new Error(`Matched ${a.length} documents: ${p.length} target(s) missing, ${d.length} extra. You need exactly the target set \u2014 no more, no less.`);return!0},s=Qt`
    <div class="mb-3">
      <p class="lead">
        Below is a snapshot of a search index (${l.length} documents). Write <strong>one</strong> query that
        returns <strong>exactly</strong> the ${i.length} target URLs listed underneath — every target, and
        nothing else.
      </p>

      <p>
        You are not told <em>which</em> properties make the targets special. Work that out by comparing them
        against the rest of the index. Several documents differ from a target in exactly one respect, so a nearly
        right query will pull them in.
      </p>

      <p><strong>Supported tokens</strong> (all tokens are ANDed together):</p>
      <pre><code>site:HOST        filetype:EXT     inurl:TEXT     intitle:TEXT    intext:TEXT
after:YYYY       before:YYYY      "exact phrase"                 bareTerm
prefix any token with - to negate it
(tokenA OR tokenB)   one level of OR grouping, counts as one token</code></pre>
      <ul>
        <li><code>site:</code> matches the host itself or any subdomain of it.</li>
        <li><code>after:</code>/<code>before:</code> are strict (<code>after:2020</code> excludes 2020).</li>
        <li>A bare term matches the title or the body. All matching is case-insensitive substring matching.</li>
        <li>
          <strong>Limit: ${Z} tokens.</strong> Listing the target URLs one by one will not fit.
        </li>
      </ul>

      <h5 class="mt-4">Target URLs (${i.length})</h5>
      <pre style="white-space: pre-wrap"><code>${i.join(`
`)}</code></pre>

      <h5 class="mt-4">The index</h5>
      <pre style="max-height: 22rem; overflow: auto; white-space: pre-wrap"><code class="language-json">
${JSON.stringify(l,null,1)}
      </code></pre>

      <label for="${t}" class="form-label"><strong>Your query</strong></label>
      <input class="form-control font-monospace" id="${t}" name="${t}"
        placeholder='site:example.com filetype:pdf "some phrase"' />
      <p class="text-muted">
        Graded on set equality against the target list. Partial overlap scores zero.
      </p>
    </div>
  `;return{id:t,title:c,weight:n,question:s,answer:e}}var He,Z,N,Be=U(()=>{"use strict";He=j(D(),1),Z=6,N=o=>String(o).toLowerCase()});var Ze={};_(Ze,{countReachingOrigin:()=>te,default:()=>oo,evaluateExpression:()=>W,exemptVerifiedBots:()=>Qe,generateWafScenario:()=>Ke,renderExpression:()=>B,swapRules:()=>Je,verdictFor:()=>Ve});import{html as eo}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function B(o){if(o.op==="not")return`not ${B(o.args[0])}`;if(o.op==="and"||o.op==="or")return`(${o.args.map(B).join(` ${o.op} `)})`;let n=to[o.field];if(o.cmp==="in")return`${n} in {${o.value.map(t=>Ye(t)).join(" ")}}`;let r={eq:"eq",ne:"ne",lt:"lt",gt:"gt",contains:"contains",starts_with:"starts_with"}[o.cmp];return`${n} ${r} ${Ye(o.value)}`}function W(o,n){if(o.op==="not")return!W(o.args[0],n);if(o.op==="and")return o.args.every(t=>W(t,n));if(o.op==="or")return o.args.some(t=>W(t,n));let r=n[o.field];switch(o.cmp){case"eq":return r===o.value;case"ne":return r!==o.value;case"lt":return Number(r)<Number(o.value);case"gt":return Number(r)>Number(o.value);case"contains":return String(r).includes(String(o.value));case"starts_with":return String(r).startsWith(String(o.value));case"in":return o.value.includes(r);default:throw new Error(`Unknown comparison ${o.cmp}`)}}function Ve(o,n){for(let r of o)if(W(r.expr,n)&&r.action!=="log")return{action:r.action,ruleNumber:r.n};return{action:"allow",ruleNumber:null}}function Je(o,n,r){let t=[...o],c=t.findIndex(i=>i.n===n),l=t.findIndex(i=>i.n===r);return[t[c],t[l]]=[t[l],t[c]],Fe(t)}function Qe(o,n){return o.map(r=>r.n===n?{...r,expr:{op:"and",args:[r.expr,{op:"not",args:[{field:"verifiedBot",cmp:"eq",value:!0}]}]}}:r)}function Ke(o,n=""){let r=(0,Xe.default)(`q-cloudflare-waf-bypass#${String(o||"").trim().toLowerCase()}#${n}`),t=g=>g[Math.floor(r()*g.length)],c=(g,E)=>g+Math.floor(r()*(E-g+1)),l=`https://app-${c(100,999)}.example`,i=[`203.0.113.${c(2,60)}`,`198.51.100.${c(2,60)}`],e=["/","/login","/api/v2/items","/api/v2/search","/admin/settings","/blog/post","/assets/logo.svg"],s=["Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/17.4","curl/8.6.0","python-httpx/0.28.1","Googlebot/2.1 (+http://www.google.com/bot.html)","UptimeMonitor/1.2"],u=["IN","US","DE","SG","BR"],a=Array.from({length:58},(g,E)=>({id:`req-${(E+1).toString().padStart(2,"0")}`,method:t(["GET","GET","GET","POST"]),path:t(e),ua:t(s),botScore:c(1,99),verifiedBot:r()<.18,origin:r()<.6?l:t([`https://evil-${c(10,99)}.example`,""]),ip:r()<.2?t(i):`${c(11,199)}.${c(0,255)}.${c(0,255)}.${c(1,254)}`,country:t(u),threatScore:c(0,60)}));a.push({id:"req-59",method:"GET",path:"/blog/post",ua:"Googlebot/2.1 (+http://www.google.com/bot.html)",botScore:c(4,24),verifiedBot:!0,origin:"",ip:`66.249.${c(64,79)}.${c(1,254)}`,country:"US",threatScore:c(0,5)});let d={id:"req-60",method:"GET",path:"/api/v2/items",ua:"UptimeMonitor/1.2",botScore:c(30,39),verifiedBot:!0,origin:l,ip:`${c(11,199)}.${c(0,255)}.${c(0,255)}.${c(1,254)}`,country:"SG",threatScore:c(0,10)};a.push(d);for(let g of a)g.id!==d.id&&g.path.startsWith("/api")&&g.botScore<40&&g.verifiedBot&&(g.verifiedBot=!1);if(!a.some(g=>g.id!==d.id&&g.verifiedBot&&g.botScore<30)){let g=a.find(E=>E.id==="req-59");g&&(g.botScore=12)}let p=[()=>({action:"log",expr:{field:"country",cmp:"in",value:[t(u),t(u)]}}),()=>({action:"block",expr:{op:"and",args:[{field:"path",cmp:"starts_with",value:"/admin"},{op:"not",args:[{field:"ip",cmp:"in",value:i}]}]}}),()=>({action:"block",expr:{field:"ua",cmp:"contains",value:"curl"}}),()=>({action:"block",expr:{op:"and",args:[{field:"method",cmp:"eq",value:"POST"},{op:"not",args:[{field:"origin",cmp:"eq",value:l}]}]}}),()=>({action:"log",expr:{field:"threatScore",cmp:"gt",value:c(45,58)}}),()=>({action:"block",expr:{field:"ua",cmp:"contains",value:"python-httpx"}}),()=>({action:"skip",expr:{field:"path",cmp:"starts_with",value:"/assets/"}}),()=>({action:"challenge",expr:{op:"and",args:[{field:"path",cmp:"eq",value:"/login"},{field:"threatScore",cmp:"gt",value:c(20,35)}]}}),()=>({action:"log",expr:{field:"method",cmp:"eq",value:"GET"}}),()=>({action:"block",expr:{op:"or",args:[{field:"path",cmp:"contains",value:"/.git"},{field:"path",cmp:"contains",value:"/.env"}]}})],h=[];for(let g=0;g<30;g++)h.push(p[g%p.length]());let m={action:"block",expr:{field:"botScore",cmp:"lt",value:30},planted:"overblock"},b={action:"challenge",expr:{op:"and",args:[{field:"path",cmp:"starts_with",value:"/api"},{field:"botScore",cmp:"lt",value:40}]},planted:"pivotA"},v={action:"skip",expr:{field:"verifiedBot",cmp:"eq",value:!0},planted:"pivotB"},k=c(1,4),T=c(6,9),x=c(11,15);h.splice(k,0,m),h.splice(T,0,b),h.splice(x,0,v);for(let g=a.length-1;g>0;g--){let E=Math.floor(r()*(g+1));[a[g],a[E]]=[a[E],a[g]]}a.forEach((g,E)=>{g.id=`req-${(E+1).toString().padStart(2,"0")}`});let y=Fe(h),f=g=>y.find(E=>E.planted===g).n,w=f("pivotA"),$=f("pivotB"),S=f("overblock"),A=Je(y,w,$),q=()=>a.filter(g=>ee(y,g)!==ee(A,g)).map(g=>g.id);for(let g=0;g<60;g++){let E=q().filter(G=>G!==d.id);if(!E.length)break;for(let G of a)E.includes(G.id)&&(G.verifiedBot=!1)}let I=te(y,a),L=q(),C=te(Qe(y,S),a);return{rules:y.map(({planted:g,...E})=>E),requests:a,swapA:w,swapB:$,baseline:I,flipped:L,fixedCount:C,overBlockNumber:S}}async function oo({user:o,weight:n=1,version:r=""}){let t="q-cloudflare-waf-bypass",c="WAF Rule Order: Find What Reaches the Origin",l=Ke(o.email,r),{rules:i,requests:e,swapA:s,swapB:u,baseline:a,flipped:d,fixedCount:p}=l,h=v=>{let k=String(v||"").trim().split("|").map(f=>f.trim());if(k.length!==3)throw new Error("Answer must be three values separated by | (count|request-id|count).");let[T,x,y]=k;if(T!==String(a))throw new Error("Part 1 (requests reaching the origin) is wrong.");if(x.toLowerCase()!==d[0].toLowerCase())throw new Error("Part 2 (the flipped request id) is wrong.");if(y!==String(p))throw new Error("Part 3 (count after the exemption fix) is wrong.");return!0},m=i.map(v=>`${String(v.n).padStart(2," ")}. ${v.action.toUpperCase().padEnd(9)} ${B(v.expr)}`),b=eo`
    <div class="mb-3">
      <p class="lead">
        A Cloudflare-style WAF evaluates its rules <strong>top to bottom</strong>. The first rule that matches and
        is <em>terminal</em> decides the request. Work out what actually reaches the origin.
      </p>

      <div class="alert alert-secondary">
        <strong>Evaluation semantics</strong>
        <ul class="mb-0">
          <li><code>BLOCK</code>, <code>CHALLENGE</code> and <code>SKIP</code> are terminal — evaluation stops.</li>
          <li><code>LOG</code> is <em>not</em> terminal — evaluation continues to the next rule.</li>
          <li>If no terminal rule matches, the request is allowed.</li>
          <li>
            A request <strong>reaches the origin</strong> only if the outcome is <code>SKIP</code> or allowed.
            <code>CHALLENGE</code> does <strong>not</strong> reach the origin.
          </li>
          <li>
            <code>eq</code>/<code>ne</code> are exact, <code>contains</code>/<code>starts_with</code> are substring
            and prefix, <code>in {…}</code> is exact membership, <code>lt</code>/<code>gt</code> are strict.
          </li>
          <li>Parentheses show precedence explicitly; <code>not</code> binds to the expression that follows it.</li>
        </ul>
      </div>

      <h5>Rules (in order)</h5>
      <pre style="max-height: 20rem; overflow: auto"><code>${m.join(`
`)}</code></pre>

      <h5>Requests (${e.length})</h5>
      <pre style="max-height: 20rem; overflow: auto; white-space: pre-wrap"><code class="language-json">
${JSON.stringify(e,null,1)}
      </code></pre>

      <h5 class="mt-4">Answer all three parts</h5>
      <ol>
        <li>
          How many of the ${e.length} requests <strong>reach the origin</strong> under the rules exactly as
          listed?
        </li>
        <li>
          Swap rule <strong>${s}</strong> and rule <strong>${u}</strong> (they exchange positions; every
          other rule keeps its relative order). Exactly one request changes between reaching the origin and not.
          Give its <code>id</code>.
        </li>
        <li>
          Rule <strong>${l.overBlockNumber}</strong> blocks low-scoring clients without exempting verified
          bots such as search-engine crawlers. In the <em>original</em> order, rewrite that rule as
          <code>(&lt;original expression&gt; and not cf.bot_management.verified_bot)</code>, leave every other rule
          unchanged, and report how many requests then reach the origin.
        </li>
      </ol>

      <label for="${t}" class="form-label">
        <strong>Answer as <code>count|request-id|count</code></strong> — for example <code>17|req-42|19</code>
      </label>
      <input class="form-control font-monospace" id="${t}" name="${t}" placeholder="count|req-xx|count" />
      <p class="text-muted">All three parts must be correct.</p>
    </div>
  `;return{id:t,title:c,weight:n,question:b,answer:h}}var Xe,to,Ye,ee,te,Fe,et=U(()=>{"use strict";Xe=j(D(),1),to={path:"http.request.uri.path",method:"http.request.method",ua:"http.user_agent",botScore:"cf.bot_management.score",verifiedBot:"cf.bot_management.verified_bot",origin:'http.request.headers["origin"][0]',ip:"ip.src",country:"ip.geoip.country",threatScore:"cf.threat_score"},Ye=o=>typeof o=="string"?`"${o}"`:String(o);ee=(o,n)=>{let r=Ve(o,n).action;return r==="allow"||r==="skip"},te=(o,n)=>n.filter(r=>ee(o,r)).length,Fe=o=>o.map((n,r)=>({...n,n:r+1}))});var at={};_(at,{TONE_TABLE:()=>oe,default:()=>so,generateMediaScenario:()=>nt});import{html as ro}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function no(o,n){let r=[...n].flatMap(t=>t.charCodeAt(0).toString(2).padStart(8,"0").split("").map(Number));r.push(...Array(16).fill(0));for(let t=0;t<r.length;t++){let c=t*4+2;o.data[c]=o.data[c]&254|r[t]}}function ao(o){let n=new Uint8Array(44+o.length*2),r=new DataView(n.buffer),t=(l,i)=>[...i].forEach((e,s)=>r.setUint8(l+s,e.charCodeAt(0)));t(0,"RIFF"),r.setUint32(4,36+o.length*2,!0),t(8,"WAVEfmt "),r.setUint32(16,16,!0),r.setUint16(20,1,!0),r.setUint16(22,1,!0),r.setUint32(24,H,!0),r.setUint32(28,H*2,!0),r.setUint16(32,2,!0),r.setUint16(34,16,!0),t(36,"data"),r.setUint32(40,o.length*2,!0);for(let l=0;l<o.length;l++)r.setInt16(44+l*2,Math.max(-1,Math.min(1,o[l]))*32767,!0);let c="";for(let l of n)c+=String.fromCharCode(l);return`data:audio/wav;base64,${btoa(c)}`}function nt(o,n=""){let r=(0,tt.default)(`q-media-forensics#${String(o||"").trim().toLowerCase()}#${n}`),t=(h,m)=>h+Math.floor(r()*(m-h+1)),c=h=>Array.from({length:h},()=>ot[t(0,15)]).join(""),l=`TDS-${c(6).toUpperCase()}`,i=c(8),e=[[222,62,62],[58,148,214],[246,196,62],[86,186,118],[150,96,208],[232,132,60],[70,190,196],[200,96,150]],s=24,u=[],a=s,d=-1;for(;a>0;){let h=Math.min(a,t(2,6)),m=t(0,e.length-1);for(;m===d;)m=t(0,e.length-1);d=m,u.push({colourIndex:m,length:h}),a-=h}let p=u.length-1;return{imageToken:l,audioDigits:i,scenes:u,palette:e,frameCount:s,sceneChanges:p,random:r}}function io(o){let{imageToken:n,audioDigits:r,scenes:t,palette:c,random:l}=o,i=document.createElement("canvas");i.width=128,i.height=128;let e=i.getContext("2d"),s=e.createImageData(128,128);for(let m=0;m<s.data.length;m+=4)s.data[m]=Math.floor(l()*256),s.data[m+1]=Math.floor(l()*256),s.data[m+2]=Math.floor(l()*256),s.data[m+3]=255;no(s,n),e.putImageData(s,0,0);let u=[];for(let m of r){let{hz:b}=oe.find(k=>k.digit===m),v=Math.round(H*rt);for(let k=0;k<v;k++)u.push(.6*Math.sin(2*Math.PI*b*k/H));for(let k=0;k<Math.round(H*.04);k++)u.push(0)}let a=64,d=document.createElement("canvas");d.width=a*6,d.height=a*4;let p=d.getContext("2d");return t.flatMap(({colourIndex:m,length:b})=>Array(b).fill(m)).forEach((m,b)=>{let[v,k,T]=c[m],x=b%6*a,y=Math.floor(b/6)*a,f=p.createImageData(a,a);for(let w=0;w<f.data.length;w+=4){let $=Math.floor(l()*13)-6;f.data[w]=Math.max(0,Math.min(255,v+$)),f.data[w+1]=Math.max(0,Math.min(255,k+$)),f.data[w+2]=Math.max(0,Math.min(255,T+$)),f.data[w+3]=255}p.putImageData(f,x,y)}),{imageUrl:i.toDataURL("image/png"),audioUrl:ao(u),framesUrl:d.toDataURL("image/png")}}async function so({user:o,weight:n=1,version:r=""}){let t="q-media-forensics",c="Media Forensics: Image, Audio and Frame Sequence",l=nt(o.email,r),{imageToken:i,audioDigits:e,sceneChanges:s,frameCount:u}=l,a=io(l),d=m=>{let b=String(m||"").trim().split("|").map(v=>v.trim());if(b.length!==3)throw new Error("Answer must be three values separated by | (token|digits|count).");if(b[0].toUpperCase()!==i.toUpperCase())throw new Error("Part 1 (the hidden image token) is wrong.");if(b[1].toLowerCase()!==e.toLowerCase())throw new Error("Part 2 (the audio digits) is wrong.");if(b[2]!==String(s))throw new Error("Part 3 (the scene-change count) is wrong.");return!0},p=Array.from({length:4},(m,b)=>oe.slice(b*4,b*4+4).map(({digit:v,hz:k})=>`${v} = ${String(k).padStart(4," ")} Hz`).join("     ")).join(`
`),h=ro`
    <div class="mb-3">
      <p class="lead">
        Three artifacts, each hiding one value. Download them and extract all three — none of this needs an AI
        model, but all of it needs correct signal handling.
      </p>

      <h5>1. Image — least-significant-bit payload</h5>
      <p>
        A 128×128 PNG of random noise. An ASCII string is hidden in the <strong>least significant bit of the blue
        channel</strong>, one bit per pixel, in row-major order (left→right, top→bottom), most-significant bit of
        each byte first. The string ends at the first NUL byte. Recover it.
      </p>
      <p>
        <a href="${a.imageUrl}" download="forensics-image.png">Download forensics-image.png</a>
      </p>
      <img src="${a.imageUrl}" alt="noise image" width="128" height="128"
        style="image-rendering: pixelated; border: 1px solid #888; display: block" />

      <h5 class="mt-4">2. Audio — tone sequence</h5>
      <p>
        A mono 16-bit WAV at ${H} Hz. It contains 8 tones of ${rt*1e3} ms each, separated by
        40 ms of silence. Each tone is a pure sine wave whose frequency maps to one hex digit:
      </p>
      <pre><code>${p}</code></pre>
      <p>Report the 8 hex digits in order (lower-case).</p>
      <p><a href="${a.audioUrl}" download="forensics-audio.wav">Download forensics-audio.wav</a></p>
      <audio controls src="${a.audioUrl}"></audio>

      <h5 class="mt-4">3. Frames — scene changes</h5>
      <p>
        A sprite sheet of ${u} video frames sampled at 1 fps, laid out 6 across and 4 down in playback
        order. Consecutive frames belonging to the same scene share a base colour; each frame carries ±6 of
        per-pixel noise, which never changes the base colour. Count the <strong>scene changes</strong> — the number
        of positions where frame <em>n</em> and frame <em>n+1</em> belong to different scenes.
      </p>
      <p><a href="${a.framesUrl}" download="forensics-frames.png">Download forensics-frames.png</a></p>
      <img src="${a.framesUrl}" alt="frame sheet" width="384" height="256"
        style="border: 1px solid #888; display: block" />

      <label for="${t}" class="form-label mt-4">
        <strong>Answer as <code>token|digits|count</code></strong> — for example <code>TDS-1A2B3C|0f3a91cd|5</code>
      </label>
      <input class="form-control font-monospace" id="${t}" name="${t}" placeholder="TOKEN|digits|count" />
      <p class="text-muted">All three parts must be correct.</p>
    </div>
  `;return{id:t,title:c,weight:n,question:h,answer:d}}var tt,ot,H,rt,oe,it=U(()=>{"use strict";tt=j(D(),1),ot="0123456789abcdef",H=8e3,rt=.25,oe=ot.split("").map((o,n)=>({digit:o,hz:400+n*160}))});var dt={};_(dt,{FINDING_CODES:()=>re,default:()=>lo,generateWorkflowScenario:()=>lt});import{html as co}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function lt(o,n=""){let r=(0,ct.default)(`q-actions-workflow-audit#${String(o||"").trim().toLowerCase()}#${n}`),t=v=>v[Math.floor(r()*v.length)],c=t(["pr-preview","preview-build","pr-artifacts","review-app"]),l=t(["ship-prod","release","deploy-prod","publish"]),i=t(["acme-ci","buildkit-labs","shipfast","deploy-tools"]),e=st(r),s=new Set(["W1"]);for(let v of["W2","W3","W4","W5","W6"])r()<.55&&s.add(v);for(let v of["W4","W2","W5"]){if(s.size>=3)break;s.add(v)}let u=v=>s.has(v),a=u("W3")?`  contents: write
  pull-requests: write
  id-token: write`:"  contents: read",d=u("W2")?`${i}/setup-action@v3`:`${i}/setup-action@${e}`,p=u("W4")?'      - name: Show configuration\n        run: echo "registry token is ${{ secrets.REGISTRY_TOKEN }}"':`      - name: Show configuration
        run: echo "registry host is $REGISTRY_HOST"
        env:
          REGISTRY_HOST: \${{ vars.REGISTRY_HOST }}`,h=u("W5")?"":`    environment:
      name: production
`,m=u("W6")?`      - name: Label the build
        run: |
          echo "Building \${{ github.event.pull_request.title }}" >> notes.txt`:`      - name: Label the build
        run: |
          echo "Building $PR_TITLE" >> notes.txt
        env:
          PR_TITLE: \${{ github.event.pull_request.title }}`;return{workflow:`name: CI and release

on:
  pull_request_target:
    branches: [main]
  push:
    branches: [main]
  workflow_dispatch:

permissions:
${a}

jobs:
  ${c}:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: \${{ github.event.pull_request.head.sha }}
      - uses: ${d}
      - name: Install and build
        run: npm ci && npm run build
${m}
      - name: Upload preview
        uses: actions/upload-artifact@v4
        with:
          name: preview
          path: dist/

  unit-tests:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      - run: npm ci && npm test

  ${l}:
    needs: [unit-tests]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
${h}    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@v4
      - uses: ${i}/deploy-action@${st(r)}
        with:
          project: storefront
${p}
      - name: Deploy
        run: ./scripts/deploy.sh --env production
        env:
          DEPLOY_TOKEN: \${{ secrets.DEPLOY_TOKEN }}
`,previewJob:c,deployJob:l,findings:[...s].sort()}}async function lo({user:o,weight:n=1,version:r=""}){let t="q-actions-workflow-audit",c="Audit a GitHub Actions Workflow",{workflow:l,findings:i,previewJob:e}=lt(o.email,r),s=d=>{let p=String(d||"").trim().split("|").map(b=>b.trim());if(p.length!==2)throw new Error("Answer must be two parts separated by | (codes|job-id).");let h=p[0].toUpperCase().split(",").map(b=>b.trim()).filter(Boolean).sort(),m=h.filter(b=>!re.some(v=>v.code===b));if(m.length)throw new Error(`Unknown finding code(s): ${m.join(", ")}.`);if(h.join(",")!==i.join(","))throw new Error(`Part 1 is wrong. You listed ${h.length} finding(s); the code list is not correct.`);if(p[1]!==e)throw new Error("Part 2 (the exploitable job id) is wrong.");return!0},u=re.map(({code:d,label:p})=>`${d}  ${p}`).join(`
`),a=co`
    <div class="mb-3">
      <p class="lead">
        Audit this workflow. Report <strong>exactly</strong> which of the six findings below are present — no more,
        no fewer. Some patterns in the file look dangerous but are in fact safe, and some safe-looking ones are not.
      </p>

      <h5>Finding codes</h5>
      <pre><code>${u}</code></pre>

      <div class="alert alert-secondary">
        <strong>Rules the audit applies</strong>
        <ul class="mb-0">
          <li>
            Actions under the <code>actions/</code> namespace are first-party and may be referenced by major tag.
            <strong>Third-party</strong> actions must be pinned to a full 40-character commit SHA.
          </li>
          <li>
            A secret is "written to the build log" only if its value can appear in step output. Passing a secret
            through <code>env:</code> to a script that does not print it is acceptable.
          </li>
          <li>
            Interpolating <code>\${{ … }}</code> attacker-controlled event data <em>directly into a shell command</em>
            is script injection. Passing the same value through <code>env:</code> and referencing the shell variable
            is safe.
          </li>
          <li>
            Workflow-level <code>permissions</code> are too broad if no job in the file needs the extra scopes.
          </li>
          <li>A production deploy needs an <code>environment:</code> to attach approval protection.</li>
        </ul>
      </div>

      <h5>.github/workflows/ci.yml</h5>
      <pre style="max-height: 30rem; overflow: auto"><code class="language-yaml">${l}</code></pre>

      <h5 class="mt-4">Answer both parts</h5>
      <ol>
        <li>The finding codes present, comma-separated in ascending order (e.g. <code>W1,W3,W5</code>).</li>
        <li>
          The <code>id</code> of the single job an untrusted outside contributor can abuse to run their own code in
          a privileged context.
        </li>
      </ol>

      <label for="${t}" class="form-label"><strong>Answer as <code>codes|job-id</code></strong></label>
      <input class="form-control font-monospace" id="${t}" name="${t}" placeholder="W1,W2,W4|job-id" />
      <p class="text-muted">Both parts must be correct. Listing a finding that is not present is wrong.</p>
    </div>
  `;return{id:t,title:c,weight:n,question:a,answer:s}}var ct,re,st,ut=U(()=>{"use strict";ct=j(D(),1),re=[{code:"W1",label:"Untrusted pull-request code runs in a privileged context"},{code:"W2",label:"A third-party action is not pinned to a full commit SHA"},{code:"W3",label:"Workflow-level permissions are broader than any job needs"},{code:"W4",label:"A secret is written to the build log"},{code:"W5",label:"A production deploy has no environment approval gate"},{code:"W6",label:"Attacker-controlled event data is interpolated into a shell command"}],st=o=>Array.from({length:40},()=>"0123456789abcdef"[Math.floor(o()*16)]).join("")});import{html as P,render as vt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function ne(o,n){let r=P`<ol class="mt-3">
    ${o.map(({id:l,title:i,weight:e})=>P`<li><a href="#h${l}">${i}</a> (${e} ${e==1?"mark":"marks"})</li>`)}
  </ol>`,t=[P`<h1 class="display-6">Questions</h1>`,r,...o.map(({id:l,title:i,weight:e,question:s,help:u},a)=>(u&&!Array.isArray(u)&&(u=[u]),P`
        <div class="card my-5" data-question="${l}" id="h${l}">
          <div class="card-header">
            <span class="badge text-bg-primary me-2">${a+1}</span>
            ${i} (${e} ${e==1?"mark":"marks"})
          </div>
          ${u?u.map(d=>P`<div class="card-body border-bottom">${d}</div>`):""}
          <div class="card-body">${s}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${l}">Check</button>
          </div>
        </div>
      `))],c={index:r,questions:t};for(let[l,i]of n)vt(c[i],l)}import{unsafeHTML as yt}from"https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js";import{Marked as bt}from"https://cdn.jsdelivr.net/npm/marked@13/+esm";var ae="https://tds.s-anand.net",ie=o=>o&&!o.match(/^(https?|mailto):/),xt=new bt({renderer:{image(o,n,r){return ie(o)&&(o=`${ae}/${o}`),`<img src="${o}" alt="${r}" ${n?`title="${n}"`:""} class="img-fluid" loading="lazy">`},link(o,n,r){return ie(o)&&(o=`${ae}/${o.endsWith(".md")?`#/${o.replace(/\.md$/,"")}`:o}`),`<a href="${o}" ${n?`title="${n}"`:""} target="_blank">${r}</a>`}}}),R=o=>yt(xt.parse(o));async function _o(o,n){let r=[{...await Promise.resolve().then(()=>(ce(),se)).then(t=>t.default({user:o,weight:2,version:"v1"})),help:[R(`
### Ask AI

- [How do I implement a deterministic policy endpoint for CI release metadata?](#askai)
- [How should I validate full-SHA action pins, least-privilege permissions, and protected production deploys?](#askai)
- [Which Docker build properties prevent secret leaks and unsafe root runtimes?](#askai)
        `)]},{...await Promise.resolve().then(()=>(de(),le)).then(t=>t.default({user:o,weight:2,version:"v1"})),help:[R(`
### Ask AI

- [How do I schema-validate LLM tool calls without relying on an LLM guardrail?](#askai)
- [How can exact tenant and email-domain allowlists prevent confused-deputy and exfiltration attacks?](#askai)
- [How should I reject unsafe model-generated HTML and gate side effects?](#askai)
        `)]},{...await Promise.resolve().then(()=>(pe(),ue)).then(t=>t.default({user:o,weight:2,version:"v1"})),help:[R(`
### Ask AI

- [How do I validate a normalized Terraform resource change with policy-as-code?](#askai)
- [Why do Terraform remote state, locking, and provider pinning matter?](#askai)
- [How can an apply gate reject plaintext secrets, missing labels, and unapproved stateful deletes?](#askai)
        `)]},{...await Promise.resolve().then(()=>(Re(),Ie)).then(t=>t.default({user:o,weight:2,version:"v1"})),help:[R(`
### Ask AI

- [Why is LLM output untrusted input, and what is improper output handling?](#askai)
- [How do I detect script tags, event-handler attributes, and dangerous URL schemes without an allowlist of phrases?](#askai)
- [How can a markdown image exfiltrate data, and how do I stop it with an exact host allowlist?](#askai)
- [Why must I decode percent-escapes and HTML entities before applying a security check?](#askai)
- [Why does exact hostname matching beat substring matching for allowlists?](#askai)
        `)]},{...await Promise.resolve().then(()=>(_e(),Ue)).then(t=>t.default({user:o,weight:2,version:"v1"})),help:[R(`
### Ask AI

- [What does corroboration mean in open-source intelligence, and why is one source only a lead?](#askai)
- [How do I decide whether two records are independent or mirrors of the same origin?](#askai)
- [How should a staleness window change my confidence in an observation?](#askai)
- [Why should an authoritative source outrank agreement from several weaker sources?](#askai)
- [How do I make a verification service deterministic by never reading the wall clock?](#askai)
        `)]},{...await Promise.resolve().then(()=>(Me(),Oe)).then(t=>t.default({user:o,weight:2,version:"ga7-2026-05-v2"})),help:[R(`
### Ask AI

- [How do I geolocate a photograph from road signs, scripts, and vegetation?](#askai)
- [Which visual cues reveal the country: driving side, plate shapes, utility poles, kerb markings?](#askai)
- [How can I narrow a location with sun position and shadow direction?](#askai)
        `)]},{...await Promise.resolve().then(()=>(Be(),ze)).then(t=>t.default({user:o,weight:1,version:"v1"})),help:[R(`
### Ask AI

- [What do the site:, filetype:, inurl:, intitle:, and intext: search operators match exactly?](#askai)
- [Does site: match subdomains, and are after:/before: inclusive or exclusive?](#askai)
- [How do I find the smallest set of operators that separates one group of documents from another?](#askai)
- [How can I write code to test a search query against a list of documents?](#askai)
        `)]},{...await Promise.resolve().then(()=>(et(),Ze)).then(t=>t.default({user:o,weight:1,version:"v1"})),help:[R(`
### Ask AI

- [How does a WAF evaluate ordered rules, and which actions are terminal?](#askai)
- [What is the difference between eq, contains, starts_with, and in for firewall fields?](#askai)
- [Why does rule order change the outcome, and how do I test a reordering?](#askai)
- [Why must bot-score rules exempt verified bots such as search-engine crawlers?](#askai)
- [How do I evaluate many requests against many rules reliably instead of by eye?](#askai)
        `)]},{...await Promise.resolve().then(()=>(it(),at)).then(t=>t.default({user:o,weight:1,version:"v1"})),help:[R(`
### Ask AI

- [How do I read the least significant bit of a colour channel from a PNG in Python?](#askai)
- [How do I convert a bit stream into ASCII characters and stop at a NUL byte?](#askai)
- [How can I identify the dominant frequency of a tone in a WAV file with an FFT or the Goertzel algorithm?](#askai)
- [How do I split a sprite sheet into frames and compare consecutive frames?](#askai)
        `)]},{...await Promise.resolve().then(()=>(ut(),dt)).then(t=>t.default({user:o,weight:1,version:"v1"})),help:[R(`
### Ask AI

- [Why is pull_request_target with a checkout of the pull-request head dangerous?](#askai)
- [Why should third-party actions be pinned to a full commit SHA instead of a tag?](#askai)
- [What is script injection in a run: block, and why does passing values through env: fix it?](#askai)
- [How do GitHub environments add approval protection to a deployment?](#askai)
- [How do I choose least-privilege permissions for a workflow?](#askai)
        `)]}];return ne(r,n),Object.fromEntries(r.map(({id:t,...c})=>[t,c]))}export{_o as questions};
