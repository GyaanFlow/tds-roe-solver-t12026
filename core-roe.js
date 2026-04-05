var jt=Object.create;var pe=Object.defineProperty;var Dt=Object.getOwnPropertyDescriptor;var Vt=Object.getOwnPropertyNames;var zt=Object.getPrototypeOf,Ft=Object.prototype.hasOwnProperty;var k=(e,n)=>()=>(e&&(n=e(e=0)),n);var D=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports),M=(e,n)=>{for(var o in n)pe(e,o,{get:n[o],enumerable:!0})},Jt=(e,n,o,a)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of Vt(n))!Ft.call(e,i)&&i!==o&&pe(e,i,{get:()=>n[i],enumerable:!(a=Dt(n,i))||a.enumerable});return e};var _=(e,n,o)=>(o=e!=null?jt(zt(e)):{},Jt(n||!e||!e.__esModule?pe(o,"default",{value:e,enumerable:!0}):o,e));var je={};M(je,{default:()=>Ut});import{html as Gt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Ut({user:e,weight:n=5}){let o="q-share-token-server",a="Collaborative Token Exchange",i=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&questionId=${encodeURIComponent(o)}`,r=Gt`
    <div class="mb-3">
      <p>
        Each student gets one pre-created 10-character token assigned from a hidden server-side pool of 1,000 tokens.
        Collaborate with classmates to collect as many <strong>unique valid tokens</strong> as possible.
      </p>
      <p>
        Your score for this question is <code>min(unique_valid_tokens, 500) / 500</code>.
        That means 500 or more unique valid tokens gives full marks for this question.
      </p>
      <p>
        Your own token is rendered below by the server in HTML. Share it with others, and include it in your final
        submission.
      </p>
      <iframe
        title="Your assigned token"
        src="${i}"
        style="width:100%;height:280px;border:1px solid #dee2e6;border-radius:12px;background:#fff"
      ></iframe>

      <label for="${o}" class="form-label"><strong>Submission Tokens</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${o}"
        name="${o}"
        rows="10"
        placeholder='["abc123def4", "p9q8r7s6t5"] or one token per line'
      ></textarea>
      <p class="form-text mt-2">
        You may submit plain text, one token per line, comma-separated tokens, a JSON array, or
        <code>{"tokens":[...]}</code>.
      </p>
    </div>
  `;return{id:o,title:a,weight:n,question:r,answer:async t=>{let c=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:t,weight:n,questionId:o})}),l=await c.json();if(!c.ok)throw new Error(l.error||"Unable to verify tokens.");return l}}}var De=k(()=>{"use strict"});var Ve={};M(Ve,{default:()=>Ht});import{html as Kt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function Ht({user:e,weight:n=3}){let o="q-korean-audio-dataset-server",a="\u97D3\u56FD\u8A9E\u97F3\u58F0\u30C7\u30FC\u30BF\u30BB\u30C3\u30C8API\u691C\u8A3C",r=Kt`
    <div class="mb-3">
      <p>
        あなたの提出は <strong>APIエンドポイントURLのみ</strong> です。サーバーはそのURLに対して
        音声（base64）を送信し、返されたJSONを厳密一致で検証します。
      </p>
      <p>
        1人あたり4件の音声をサーバー側で固定シード抽出し、すべて一致した場合のみ正解です。
      </p>

      <h6>受信リクエスト</h6>
      <pre><code>{"audio_id":"q0","audio_base64":"..."}</code></pre>

      <h6>返却JSONの必須構造</h6>
      <pre><code>${JSON.stringify({rows:0,columns:[],mean:{},std:{},variance:{},min:{},max:{},median:{},mode:{},range:{},allowed_values:{},value_range:{},correlation:[]},null,2)}</code></pre>
      <p class="form-text">
        各音声に対して、上記キーを含むJSONを返してください（値は音声ごとの仕様に一致させること）。
      </p>

      <label for="${o}" class="form-label"><strong>APIエンドポイントURL</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${o}"
        name="${o}"
        rows="3"
        placeholder="https://example.com/your-api"
      ></textarea>
    </div>
  `;return{id:o,title:a,weight:n,question:r,answer:async t=>{let c=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:{url:t,phase:"preview"},weight:n,questionId:o})}),l=await c.json();if(!c.ok)throw new Error(l.error||"\u691C\u8A3C\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002");return l}}}var ze=k(()=>{"use strict"});var Je=D((Fe,ue)=>{(function(e,n,o){function a(t){var c=this,l=s();c.next=function(){var h=2091639*c.s0+c.c*23283064365386963e-26;return c.s0=c.s1,c.s1=c.s2,c.s2=h-(c.c=h|0)},c.c=1,c.s0=l(" "),c.s1=l(" "),c.s2=l(" "),c.s0-=l(t),c.s0<0&&(c.s0+=1),c.s1-=l(t),c.s1<0&&(c.s1+=1),c.s2-=l(t),c.s2<0&&(c.s2+=1),l=null}function i(t,c){return c.c=t.c,c.s0=t.s0,c.s1=t.s1,c.s2=t.s2,c}function r(t,c){var l=new a(t),h=c&&c.state,d=l.next;return d.int32=function(){return l.next()*4294967296|0},d.double=function(){return d()+(d()*2097152|0)*11102230246251565e-32},d.quick=d,h&&(typeof h=="object"&&i(h,l),d.state=function(){return i(l,{})}),d}function s(){var t=4022871197,c=function(l){l=String(l);for(var h=0;h<l.length;h++){t+=l.charCodeAt(h);var d=.02519603282416938*t;t=d>>>0,d-=t,d*=t,t=d>>>0,d-=t,t+=d*4294967296}return(t>>>0)*23283064365386963e-26};return c}n&&n.exports?n.exports=r:o&&o.amd?o(function(){return r}):this.alea=r})(Fe,typeof ue=="object"&&ue,typeof define=="function"&&define)});var Ge=D((Be,me)=>{(function(e,n,o){function a(s){var t=this,c="";t.x=0,t.y=0,t.z=0,t.w=0,t.next=function(){var h=t.x^t.x<<11;return t.x=t.y,t.y=t.z,t.z=t.w,t.w^=t.w>>>19^h^h>>>8},s===(s|0)?t.x=s:c+=s;for(var l=0;l<c.length+64;l++)t.x^=c.charCodeAt(l)|0,t.next()}function i(s,t){return t.x=s.x,t.y=s.y,t.z=s.z,t.w=s.w,t}function r(s,t){var c=new a(s),l=t&&t.state,h=function(){return(c.next()>>>0)/4294967296};return h.double=function(){do var d=c.next()>>>11,f=(c.next()>>>0)/4294967296,b=(d+f)/(1<<21);while(b===0);return b},h.int32=c.next,h.quick=h,l&&(typeof l=="object"&&i(l,c),h.state=function(){return i(c,{})}),h}n&&n.exports?n.exports=r:o&&o.amd?o(function(){return r}):this.xor128=r})(Be,typeof me=="object"&&me,typeof define=="function"&&define)});var Ke=D((Ue,ge)=>{(function(e,n,o){function a(s){var t=this,c="";t.next=function(){var h=t.x^t.x>>>2;return t.x=t.y,t.y=t.z,t.z=t.w,t.w=t.v,(t.d=t.d+362437|0)+(t.v=t.v^t.v<<4^(h^h<<1))|0},t.x=0,t.y=0,t.z=0,t.w=0,t.v=0,s===(s|0)?t.x=s:c+=s;for(var l=0;l<c.length+64;l++)t.x^=c.charCodeAt(l)|0,l==c.length&&(t.d=t.x<<10^t.x>>>4),t.next()}function i(s,t){return t.x=s.x,t.y=s.y,t.z=s.z,t.w=s.w,t.v=s.v,t.d=s.d,t}function r(s,t){var c=new a(s),l=t&&t.state,h=function(){return(c.next()>>>0)/4294967296};return h.double=function(){do var d=c.next()>>>11,f=(c.next()>>>0)/4294967296,b=(d+f)/(1<<21);while(b===0);return b},h.int32=c.next,h.quick=h,l&&(typeof l=="object"&&i(l,c),h.state=function(){return i(c,{})}),h}n&&n.exports?n.exports=r:o&&o.amd?o(function(){return r}):this.xorwow=r})(Ue,typeof ge=="object"&&ge,typeof define=="function"&&define)});var We=D((He,ye)=>{(function(e,n,o){function a(s){var t=this;t.next=function(){var l=t.x,h=t.i,d,f,b;return d=l[h],d^=d>>>7,f=d^d<<24,d=l[h+1&7],f^=d^d>>>10,d=l[h+3&7],f^=d^d>>>3,d=l[h+4&7],f^=d^d<<7,d=l[h+7&7],d=d^d<<13,f^=d^d<<9,l[h]=f,t.i=h+1&7,f};function c(l,h){var d,f,b=[];if(h===(h|0))f=b[0]=h;else for(h=""+h,d=0;d<h.length;++d)b[d&7]=b[d&7]<<15^h.charCodeAt(d)+b[d+1&7]<<13;for(;b.length<8;)b.push(0);for(d=0;d<8&&b[d]===0;++d);for(d==8?f=b[7]=-1:f=b[d],l.x=b,l.i=0,d=256;d>0;--d)l.next()}c(t,s)}function i(s,t){return t.x=s.x.slice(),t.i=s.i,t}function r(s,t){s==null&&(s=+new Date);var c=new a(s),l=t&&t.state,h=function(){return(c.next()>>>0)/4294967296};return h.double=function(){do var d=c.next()>>>11,f=(c.next()>>>0)/4294967296,b=(d+f)/(1<<21);while(b===0);return b},h.int32=c.next,h.quick=h,l&&(l.x&&i(l,c),h.state=function(){return i(c,{})}),h}n&&n.exports?n.exports=r:o&&o.amd?o(function(){return r}):this.xorshift7=r})(He,typeof ye=="object"&&ye,typeof define=="function"&&define)});var Xe=D((Ye,we)=>{(function(e,n,o){function a(s){var t=this;t.next=function(){var l=t.w,h=t.X,d=t.i,f,b;return t.w=l=l+1640531527|0,b=h[d+34&127],f=h[d=d+1&127],b^=b<<13,f^=f<<17,b^=b>>>15,f^=f>>>12,b=h[d]=b^f,t.i=d,b+(l^l>>>16)|0};function c(l,h){var d,f,b,u,y,w=[],p=128;for(h===(h|0)?(f=h,h=null):(h=h+"\0",f=0,p=Math.max(p,h.length)),b=0,u=-32;u<p;++u)h&&(f^=h.charCodeAt((u+32)%h.length)),u===0&&(y=f),f^=f<<10,f^=f>>>15,f^=f<<4,f^=f>>>13,u>=0&&(y=y+1640531527|0,d=w[u&127]^=f+y,b=d==0?b+1:0);for(b>=128&&(w[(h&&h.length||0)&127]=-1),b=127,u=4*128;u>0;--u)f=w[b+34&127],d=w[b=b+1&127],f^=f<<13,d^=d<<17,f^=f>>>15,d^=d>>>12,w[b]=f^d;l.w=y,l.X=w,l.i=b}c(t,s)}function i(s,t){return t.i=s.i,t.w=s.w,t.X=s.X.slice(),t}function r(s,t){s==null&&(s=+new Date);var c=new a(s),l=t&&t.state,h=function(){return(c.next()>>>0)/4294967296};return h.double=function(){do var d=c.next()>>>11,f=(c.next()>>>0)/4294967296,b=(d+f)/(1<<21);while(b===0);return b},h.int32=c.next,h.quick=h,l&&(l.X&&i(l,c),h.state=function(){return i(c,{})}),h}n&&n.exports?n.exports=r:o&&o.amd?o(function(){return r}):this.xor4096=r})(Ye,typeof we=="object"&&we,typeof define=="function"&&define)});var Ze=D((Qe,ve)=>{(function(e,n,o){function a(s){var t=this,c="";t.next=function(){var h=t.b,d=t.c,f=t.d,b=t.a;return h=h<<25^h>>>7^d,d=d-f|0,f=f<<24^f>>>8^b,b=b-h|0,t.b=h=h<<20^h>>>12^d,t.c=d=d-f|0,t.d=f<<16^d>>>16^b,t.a=b-h|0},t.a=0,t.b=0,t.c=-1640531527,t.d=1367130551,s===Math.floor(s)?(t.a=s/4294967296|0,t.b=s|0):c+=s;for(var l=0;l<c.length+20;l++)t.b^=c.charCodeAt(l)|0,t.next()}function i(s,t){return t.a=s.a,t.b=s.b,t.c=s.c,t.d=s.d,t}function r(s,t){var c=new a(s),l=t&&t.state,h=function(){return(c.next()>>>0)/4294967296};return h.double=function(){do var d=c.next()>>>11,f=(c.next()>>>0)/4294967296,b=(d+f)/(1<<21);while(b===0);return b},h.int32=c.next,h.quick=h,l&&(typeof l=="object"&&i(l,c),h.state=function(){return i(c,{})}),h}n&&n.exports?n.exports=r:o&&o.amd?o(function(){return r}):this.tychei=r})(Qe,typeof ve=="object"&&ve,typeof define=="function"&&define)});var ea=D(()=>{});var ta=D((aa,se)=>{(function(e,n,o){var a=256,i=6,r=52,s="random",t=o.pow(a,i),c=o.pow(2,r),l=c*2,h=a-1,d;function f(g,m,x){var S=[];m=m==!0?{entropy:!0}:m||{};var I=w(y(m.entropy?[g,v(n)]:g??p(),3),S),$=new b(S),P=function(){for(var E=$.g(i),N=t,R=0;E<c;)E=(E+R)*a,N*=a,R=$.g(1);for(;E>=l;)E/=2,N/=2,R>>>=1;return(E+R)/N};return P.int32=function(){return $.g(4)|0},P.quick=function(){return $.g(4)/4294967296},P.double=P,w(v($.S),n),(m.pass||x||function(E,N,R,T){return T&&(T.S&&u(T,$),E.state=function(){return u($,{})}),R?(o[s]=E,N):E})(P,I,"global"in m?m.global:this==o,m.state)}function b(g){var m,x=g.length,S=this,I=0,$=S.i=S.j=0,P=S.S=[];for(x||(g=[x++]);I<a;)P[I]=I++;for(I=0;I<a;I++)P[I]=P[$=h&$+g[I%x]+(m=P[I])],P[$]=m;(S.g=function(E){for(var N,R=0,T=S.i,j=S.j,W=S.S;E--;)N=W[T=h&T+1],R=R*a+W[h&(W[T]=W[j=h&j+N])+(W[j]=N)];return S.i=T,S.j=j,R})(a)}function u(g,m){return m.i=g.i,m.j=g.j,m.S=g.S.slice(),m}function y(g,m){var x=[],S=typeof g,I;if(m&&S=="object")for(I in g)try{x.push(y(g[I],m-1))}catch{}return x.length?x:S=="string"?g:g+"\0"}function w(g,m){for(var x=g+"",S,I=0;I<x.length;)m[h&I]=h&(S^=m[h&I]*19)+x.charCodeAt(I++);return v(m)}function p(){try{var g;return d&&(g=d.randomBytes)?g=g(a):(g=new Uint8Array(a),(e.crypto||e.msCrypto).getRandomValues(g)),v(g)}catch{var m=e.navigator,x=m&&m.plugins;return[+new Date,e,x,e.screen,v(n)]}}function v(g){return String.fromCharCode.apply(0,g)}if(w(o.random(),n),typeof se=="object"&&se.exports){se.exports=f;try{d=ea()}catch{}}else typeof define=="function"&&define.amd?define(function(){return f}):o["seed"+s]=f})(typeof self<"u"?self:aa,[],Math)});var O=D((Do,oa)=>{var Wt=Je(),Yt=Ge(),Xt=Ke(),Qt=We(),Zt=Xe(),e1=Ze(),F=ta();F.alea=Wt;F.xor128=Yt;F.xorwow=Xt;F.xorshift7=Qt;F.xor4096=Zt;F.tychei=e1;oa.exports=F});function X(e,n,o){let a=[...e],i=[];for(let r=0;r<n&&a.length>0;r++){let s=Math.floor(o()*a.length);i.push(a.splice(s,1)[0])}return i}function ee(e,n){return e[Math.floor(n()*e.length)]}function Q(e,n){return e[Math.floor(n()*e.length)]}function na(e,n,o,a){let i=[];for(let r=0;r<n;r++)o.has(r)||i.push(r);return X(i,e,a).sort((r,s)=>r-s)}function a1(e,n){let o=[1,5,11,17,22],a=o.map(p=>({type:"charset",position:p,charSet:X([...J],3+Math.floor(e()*3),e).sort().join("")})),i=new Set(o),r=3,s=7,t=19;for(let p=0;p<r;p++)i.add(s+p),i.add(t+p);let c=X([...J],12,e),l=[];for(;l.length<5;){let p=X(c,r,e).join("");l.includes(p)||l.push(p)}let[h,d,f,b]=na(4,n,i,e);i.add(h),i.add(d),i.add(f),i.add(b);let[u,y,w]=na(3,n,i,e);return{lineLength:n,positionalRules:a,equalityRules:[{left:h,right:d},{left:f,right:b}],repeatedTokenRule:{startA:s,startB:t,length:r,tokens:l},classRule:{positions:[u,y,w]}}}function ia(e,n){return Array.from({length:e},()=>Q(J,n))}function ca(e,n,o){for(let{position:s,charSet:t}of n.positionalRules)e[s]=Q(t,o);for(let{left:s,right:t}of n.equalityRules){let c=Q(J,o);e[s]=c,e[t]=c}let a=ee(n.repeatedTokenRule.tokens,o);for(let s=0;s<n.repeatedTokenRule.length;s++)e[n.repeatedTokenRule.startA+s]=a[s],e[n.repeatedTokenRule.startB+s]=a[s];let r=o()<.5?Z:re;for(let s of n.classRule.positions)e[s]=Q(r,o)}function t1(e,n,o){let a=ia(e,o);return ca(a,n,o),a.join("")}function o1(e,n,o){let a=[...J].filter(i=>!n.charSet.includes(i));e[n.position]=ee(a,o)}function n1(e,n,o){let a=e[n.left],i=[...J].filter(r=>r!==a);e[n.right]=ee(i,o)}function s1(e,n,o){let a=e.slice(n.startA,n.startA+n.length).join(""),i=n.tokens.filter(s=>s!==a);if(i.length>0){let s=ee(i,o);for(let t=0;t<n.length;t++)e[n.startB+t]=s[t];return}let r=X([...J],n.length,o).join("");for(let s=0;s<n.length;s++)e[n.startB+s]=r[s]}function r1(e,n,o){let r=n.positions.map(s=>e[s]).every(s=>Z.includes(s))?re:Z;e[n.positions[0]]=Q(r,o)}function i1(e,n,o){let a=ia(e,o);ca(a,n,o);let i=[...n.positionalRules.map(s=>({kind:"charset",rule:s})),...n.equalityRules.map(s=>({kind:"equality",rule:s})),{kind:"token",rule:n.repeatedTokenRule},{kind:"class",rule:n.classRule}],r=ee(i,o);return r.kind==="charset"&&o1(a,r.rule,o),r.kind==="equality"&&n1(a,r.rule,o),r.kind==="token"&&s1(a,r.rule,o),r.kind==="class"&&r1(a,r.rule,o),a.join("")}function sa(e,n){if(e.length!==n.lineLength||!n.positionalRules.every(({position:l,charSet:h})=>h.includes(e[l]))||!n.equalityRules.every(({left:l,right:h})=>e[l]===e[h]))return!1;let i=e.slice(n.repeatedTokenRule.startA,n.repeatedTokenRule.startA+n.repeatedTokenRule.length),r=e.slice(n.repeatedTokenRule.startB,n.repeatedTokenRule.startB+n.repeatedTokenRule.length);if(i!==r||!n.repeatedTokenRule.tokens.includes(i))return!1;let s=n.classRule.positions.map(l=>e[l]),t=s.every(l=>Z.includes(l)),c=s.every(l=>re.includes(l));return!(!t&&!c)}function c1(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}function d1(e){let n=e.positionalRules.map(({position:l,charSet:h})=>`(?=^.{${l}}[${c1(h)}])`),o=e.equalityRules.map(({left:l,right:h},d)=>{let f=`eq${d}`;return`(?=^.{${l}}(?<${f}>.).{${h-l-1}}\\k<${f}>)`}),a=e.repeatedTokenRule.tokens.join("|"),i=`(?=^.{${e.repeatedTokenRule.startA}}(?<tok>${a}).{${e.repeatedTokenRule.startB-e.repeatedTokenRule.startA-e.repeatedTokenRule.length}}\\k<tok>)`,[r,s,t]=e.classRule.positions,c=`(?=^.{${r}}(?:[a-z].{${s-r-1}}[a-z].{${t-s-1}}[a-z]|\\d.{${s-r-1}}\\d.{${t-s-1}}\\d))`;return[...n,...o,i,c].join("")}function Se(e){let o=(0,ra.default)(`${e?.email??""}#q-regex-golf`),a=24,i=a1(o,a),r=new Set,s=[],t=[];for(;s.length<5e3;){let h=t1(a,i,o);r.has(h)||sa(h,i)&&(r.add(h),s.push(h))}for(;t.length<5e3;){let h=i1(a,i,o);r.has(h)||sa(h,i)||(r.add(h),t.push(h))}let c=d1(i),l=new RegExp(c);return{matchLines:s,rejectLines:t,rules:i,expectedRegexStr:c,expectedRegex:l}}function l1(e){let n=e?.email??"";return xe.has(n)||xe.set(n,Se(e)),xe.get(n)}async function da(e){return async n=>{let{matchLines:o,rejectLines:a}=l1(e),i=String(n??"").trim();if(!i)throw new Error("Please enter a regex pattern.");let r;try{r=new RegExp(i)}catch(c){throw new Error(`Invalid regex: ${c.message}`)}let s=o.filter(c=>r.test(c)).length,t=a.filter(c=>r.test(c)).length;if(s===5e3&&t===0)return!0;throw new Error(`Your regex matched ${s}/5000 match lines and ${t}/5000 reject lines.
Required: 5000/5000 matches and 0/5000 false positives.`)}}var ra,Z,re,J,xe,la=k(()=>{"use strict";ra=_(O(),1),Z="abcdefghijklmnopqrstuvwxyz",re="0123456789",J=Z+re,xe=new Map});function B(e,n){let o=URL.createObjectURL(e),a=document.createElement("a");a.href=o,a.download=n,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(o)}var ie=k(()=>{"use strict"});var fa={};M(fa,{default:()=>h1});import{html as f1}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function h1({user:e,weight:n=2}){let o="q-regex-golf-server",a="Regex Golf Challenge",{matchLines:i,rejectLines:r}=Se(e),s=new Blob([i.join(`
`)],{type:"text/plain"}),t=new Blob([r.join(`
`)],{type:"text/plain"});setTimeout(()=>{let f=document.querySelector(`.check-answer[data-question="${o}"]`);f&&f.addEventListener("click",()=>{let u=(document.getElementById(o)?.value??"").trim(),y=document.getElementById(`${o}-result`);if(!y)return;let w=(m,x)=>{y.replaceChildren();let S=document.createElement("div");S.className=`alert alert-${m}`;let I=Array.isArray(x)?x:[x];for(let $=0;$<I.length;$++)$>0&&S.appendChild(document.createElement("br")),S.appendChild(document.createTextNode(I[$]));y.appendChild(S)};if(!u){w("warning","Please enter a regex pattern.");return}let p;try{p=new RegExp(u)}catch(m){let x=m instanceof Error?m.message:String(m);w("danger",`Invalid regex: ${x}`);return}let v=i.filter(m=>p.test(m)).length,g=r.filter(m=>p.test(m)).length;v===5e3&&g===0?w("success",[`\u2705 Perfect! ${v}/5000 matches, ${g}/5000 false positives.`]):w("danger",[`\u274C Not quite. ${v}/5000 matches, ${g}/5000 false positives.`,"Required: 5000/5000 matches and 0/5000 false positives."])})},100);let c="max-height:400px;overflow-y:auto;border:1px solid var(--bs-border-color);border-radius:6px;padding:10px;font-family:monospace;font-size:12px;white-space:pre;background:var(--bs-tertiary-bg);color:var(--bs-body-color);",l=i.join(`
`),h=r.join(`
`),d=f1`
    <h2>Regex Golf Challenge</h2>
    <p>
      <strong>Scenario:</strong> You are given two files —
      <code>match.txt</code> (5000 lines) and <code>reject.txt</code> (5000 lines).
      Your task is to write a <strong>single regular expression</strong> that:
    </p>
    <ul>
      <li>✅ Matches <strong>ALL 5000 lines</strong> from <code>match.txt</code></li>
      <li>❌ Matches <strong>ZERO lines</strong> from <code>reject.txt</code></li>
    </ul>

    <p>
      <strong>The twist:</strong> Lines in both files are 24-character alphanumeric strings
      that look nearly identical. The reject lines are <em>adversarial near-misses</em> —
      they intentionally satisfy most of the hidden structure while breaking only one
      subtle property. Simple patterns like <code>.*</code>, <code>[a-z0-9]+</code>, or
      naive per-position checks will still overmatch. You need to reverse-engineer a
      combination of interacting constraints that jointly define <code>match.txt</code>.
    </p>

    <p><strong>Step 1 — Download your unique data files:</strong></p>
    <div style="margin:8px 0 16px;display:flex;gap:12px;flex-wrap:wrap">
      <button
        type="button"
        id="${o}-download-match"
        @click=${()=>B(s,"match.txt")}
        style="display:inline-block;padding:9px 18px;background:#198754;color:#fff;border:0;
               border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none;cursor:pointer"
      >⬇ Download match.txt (5000 lines)</button>
      <button
        type="button"
        id="${o}-download-reject"
        @click=${()=>B(t,"reject.txt")}
        style="display:inline-block;padding:9px 18px;background:#dc3545;color:#fff;border:0;
               border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none;cursor:pointer"
      >⬇ Download reject.txt (5000 lines)</button>
    </div>

    <p><strong>Step 2 — Examine both files side by side:</strong></p>
    <p class="text-muted" style="margin-top:-6px">
      This version is intentionally much harder: some constraints are positional, while
      others involve relationships between distant characters. Expect hidden structure,
      not just isolated columns.
    </p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div>
        <h6 style="margin:0 0 6px;color:#198754">
          <strong>✅ match.txt</strong>
          <small class="text-muted">(5000 lines — must ALL match)</small>
        </h6>
        <div style="${c}">${l}</div>
      </div>
      <div>
        <h6 style="margin:0 0 6px;color:#dc3545">
          <strong>❌ reject.txt</strong>
          <small class="text-muted">(5000 lines — must NONE match)</small>
        </h6>
        <div style="${c}">${h}</div>
      </div>
    </div>
    <!-- <p>Hint: don't solve this by checking columns one by one. Some characters must match other positions, one short block appears twice in the same line, and a few positions are either all letters or all digits together.</p> -->
    <div id="${o}-result"></div>

    <hr />
    <label for="${o}" class="form-label">
      Enter your regex pattern (without delimiters):
    </label>
    <input
      type="text"
      class="form-control font-monospace"
      id="${o}"
      name="${o}"
      placeholder="e.g. ^[a-z]+$"
      required
    />
    <small class="form-text text-muted">
      Enter a valid JavaScript regex pattern. Do not include <code>/</code> delimiters or flags.
      Your regex will be tested with <code>new RegExp(your_pattern).test(line)</code>.
    </small>
  `;return{id:o,title:a,weight:n,question:d,answer:await da(e),help:[]}}var ha=k(()=>{"use strict";la();ie()});function oe(e,n){let o=[...e];for(let a=o.length-1;a>0;a--){let i=Math.floor(n()*(a+1));[o[a],o[i]]=[o[i],o[a]]}return o}function L(e,n){return`${e},${n}`}function y1(e){let n=Array.from({length:A},()=>Array.from({length:A},()=>new Set(["up","down","left","right"]))),o=Array.from({length:A},()=>Array(A).fill(!1)),a=[],i=0,r=0;for(o[i][r]=!0,a.push([i,r]);a.length>0;){let[s,t]=a[a.length-1],c=oe(te,e).map(({dr:l,dc:h,name:d})=>({nr:s+l,nc:t+h,dir:d})).filter(({nr:l,nc:h})=>l>=0&&l<A&&h>=0&&h<A&&!o[l][h]);if(c.length===0)a.pop();else{let{nr:l,nc:h,dir:d}=c[0];n[s][t].delete(d),n[l][h].delete(g1[d]),o[l][h]=!0,a.push([l,h])}}return n}function w1(e,n,o,a,i){let r=new Set,s=[[n,o,[]]];for(r.add(L(n,o));s.length>0;){let[t,c,l]=s.shift(),h=[...l,[t,c]];if(t===a&&c===i)return h;for(let{dr:d,dc:f,name:b}of te){let u=t+d,y=c+f;u<0||u>=A||y<0||y>=A||r.has(L(u,y))||e[t][c].has(b)||(r.add(L(u,y)),s.push([u,y,h]))}}return null}function v1(e,n){let o=[],a=e.slice(1,-1);if(a.length<H){let i=oe([...Array(a.length).keys()],n).slice(0,H);i.sort((r,s)=>r-s);for(let r=0;r<i.length;r++){let[s,t]=a[i[r]];o.push({row:s,col:t,color:ae[r],index:r})}}else{let i=Math.floor(a.length/(H+1));for(let r=0;r<H;r++){let s=i*(r+1),[t,c]=a[s];o.push({row:t,col:c,color:ae[r],index:r})}}return o}function x1(e,n,o){let a=new Set(n.map(([t,c])=>L(t,c))),i=[];for(let t=0;t<A;t++)for(let c=0;c<A;c++)a.has(L(t,c))||i.push([t,c]);let r=oe(i,o),s=[];for(let t=0;t<b1&&t*2+1<r.length;t++)s.push({color:p1[t],a:{row:r[t*2][0],col:r[t*2][1]},b:{row:r[t*2+1][0],col:r[t*2+1][1]}});return s}function S1(e,n){let o=[],a=[];for(let s=0;s<e.length-1;s++){let[t,c]=e[s],[l,h]=e[s+1],d=te.find(f=>f.dr===l-t&&f.dc===h-c);d&&a.push({fromRow:t,fromCol:c,toRow:l,toCol:h,direction:d.name})}let i=a.slice(1,-1),r=oe(i,n).slice(0,Math.min(u1,i.length));for(let s of r)o.push(s);return o}function I1(e,n,o){let a=new Set(n.map(([t,c])=>L(t,c))),i=[],r=[];for(let t=0;t<A;t++)for(let c=0;c<A;c++)for(let{dr:l,dc:h,name:d}of te){let f=t+l,b=c+h;if(f<0||f>=A||b<0||b>=A||e[t][c].has(d))continue;a.has(L(t,c))&&a.has(L(f,b))||r.push({fromRow:t,fromCol:c,toRow:f,toCol:b,direction:d})}let s=oe(r,o).slice(0,Math.min(m1,r.length));for(let t of s)t.decaySteps=30+Math.floor(o()*71),i.push(t);return i}function k1(e,n){let o=[];for(let a=0;a<A;a++)for(let i=0;i<A;i++)for(let r of["right","down"])if(e[a][i].has(r)){let s=2+Math.floor(n()*3);for(let t=0;t<s;t++){let c=80+Math.floor(n()*100);if(r==="right"){let l=(i+1)*G,h=a*G+Math.floor(n()*G);o.push({x:l,y:h,brightness:c})}else{let l=i*G+Math.floor(n()*G),h=(a+1)*G;o.push({x:l,y:h,brightness:c})}}}return o}function Ie(e){let o=(0,ba.default)(`${e?.email??""}#q-maze-solver`),a=y1(o),i=w1(a,0,0,A-1,A-1),r=v1(i,o),s=x1(a,i,o),t=S1(i,o),c=I1(a,i,o),l=k1(a,o);return{gridSize:A,cellPx:G,walls:a,keys:r,teleporters:s,oneWays:t,decayingPaths:c,noisePositions:l,solutionPath:i,start:{row:0,col:0},end:{row:A-1,col:A-1}}}function C1(e,n){let{walls:o,keys:a,teleporters:i,oneWays:r,decayingPaths:s,gridSize:t}=n;if(!e||e.length<2)throw new Error("Path must contain at least 2 coordinates (start and end).");let[c,l]=e[0],[h,d]=e[e.length-1];if(c!==0||l!==0)throw new Error(`Path must start at (0,0). Your path starts at (${c},${l}).`);if(h!==t-1||d!==t-1)throw new Error(`Path must end at (${t-1},${t-1}). Your path ends at (${h},${d}).`);let f=new Map;for(let p of i)f.set(L(p.a.row,p.a.col),{row:p.b.row,col:p.b.col}),f.set(L(p.b.row,p.b.col),{row:p.a.row,col:p.a.col});let b=new Map;for(let p of r)b.set(`${p.fromRow},${p.fromCol}->${p.toRow},${p.toCol}`,!0),b.set(`${p.toRow},${p.toCol}->${p.fromRow},${p.fromCol}`,!1);let u=new Map;for(let p of s)u.set(`${p.fromRow},${p.fromCol}->${p.toRow},${p.toCol}`,p.decaySteps),u.set(`${p.toRow},${p.toCol}->${p.fromRow},${p.fromCol}`,p.decaySteps);let y=new Map;for(let p of a)y.set(L(p.row,p.col),p.index);let w=0;for(let p=1;p<e.length;p++){let[v,g]=e[p-1],[m,x]=e[p];if(m<0||m>=t||x<0||x>=t)throw new Error(`Step ${p}: (${m},${x}) is out of bounds.`);let S=L(v,g),I=f.get(S);if(!(I&&I.row===m&&I.col===x)){let E=m-v,N=x-g,R=te.find(j=>j.dr===E&&j.dc===N);if(!R)throw new Error(`Step ${p}: (${v},${g}) \u2192 (${m},${x}) is not adjacent or a valid teleporter.`);if(o[v][g].has(R.name))throw new Error(`Step ${p}: Wall blocks (${v},${g}) \u2192 (${m},${x}) [${R.name}].`);let T=`${v},${g}->${m},${x}`;if(b.has(T)&&b.get(T)===!1)throw new Error(`Step ${p}: (${v},${g}) \u2192 (${m},${x}) is a one-way corridor in the wrong direction.`);if(u.has(T)){let j=u.get(T);if(p>j)throw new Error(`Step ${p}: Path (${v},${g}) \u2192 (${m},${x}) has decayed (expired at step ${j}).`)}}let P=L(m,x);if(y.has(P)){let E=y.get(P);if(E===w)w++;else if(E>w)throw new Error(`Step ${p}: Visited ${ae[E]} key at (${m},${x}) out of order. Expected ${ae[w]} key next.`)}}if(w<H)throw new Error(`Path does not collect all keys. Collected ${w}/${H}. Missing: ${ae.slice(w).join(", ")}.`);return!0}async function pa(e){return async n=>{let o=Ie(e),a=String(n??"").trim();if(!a)throw new Error("Please enter your path as a coordinate sequence.");let i;try{i=a.split(/[\n;]+/).map(s=>s.trim()).filter(Boolean).map(s=>{let t=s.split(",").map(c=>parseInt(c.trim(),10));if(t.length!==2||t.some(isNaN))throw new Error(`Invalid coordinate: "${s}". Expected format: row,col`);return t})}catch(r){throw new Error(`Failed to parse path: ${r.message}`)}return C1(i,o)}}var ba,A,G,H,ae,b1,p1,u1,m1,te,g1,ua=k(()=>{"use strict";ba=_(O(),1),A=30,G=10,H=7,ae=["Red","Blue","Green","Yellow","Cyan","Magenta","White"],b1=3,p1=["Orange","Purple","Teal"],u1=10,m1=8,te=[{dr:-1,dc:0,name:"up"},{dr:1,dc:0,name:"down"},{dr:0,dc:-1,name:"left"},{dr:0,dc:1,name:"right"}],g1={up:"down",down:"up",left:"right",right:"left"}});var va={};M(va,{default:()=>N1});import{html as $1}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function ya(e,n){let{gridSize:o,cellPx:a,walls:i,keys:r,teleporters:s,oneWays:t,decayingPaths:c,noisePositions:l}=n,h=o*a;e.width=h,e.height=h;let d=e.getContext("2d");d.fillStyle=A1,d.fillRect(0,0,h,h);for(let f=0;f<o;f++)for(let b=0;b<o;b++){let u=b*a,y=f*a;d.fillStyle=ke,d.fillRect(u+1,y+1,a-2,a-2),!i[f][b].has("right")&&b<o-1&&(d.fillStyle=ke,d.fillRect(u+a-1,y+1,2,a-2)),!i[f][b].has("down")&&f<o-1&&(d.fillStyle=ke,d.fillRect(u+1,y+a-1,a-2,2))}for(let f of c){let b=f.fromCol*a+a/2,u=f.fromRow*a+a/2,y=f.toCol*a+a/2,w=f.toRow*a+a/2,p=Math.floor(60+(f.decaySteps-30)*(140/70)),v=(b+y)/2,g=(u+w)/2;d.fillStyle=`rgb(${p},${p},${Math.floor(p*.8)})`,d.fillRect(v-2,g-2,4,4)}for(let f of t){let b=f.fromCol*a+a/2,u=f.fromRow*a+a/2,{dx:y,dy:w}=P1[f.direction];for(let g=0;g<4;g++){let m=220-g*40,x=b+y*g,S=u+w*g;d.fillStyle=`rgb(${m},${m},${m})`,d.fillRect(x,S,1,1)}let p=b+y*3,v=u+w*3;y!==0?(d.fillStyle="rgb(100,100,100)",d.fillRect(p-y,v-1,1,1),d.fillRect(p-y,v+1,1,1)):(d.fillStyle="rgb(100,100,100)",d.fillRect(p-1,v-w,1,1),d.fillRect(p+1,v-w,1,1))}for(let f of s){let b=T1[f.color];for(let u of[f.a,f.b]){let y=u.col*a+a/2-1,w=u.row*a+a/2-1;d.fillStyle=b,d.fillRect(y,w,2,2)}}for(let f of r){let b=f.col*a+a/2-1,u=f.row*a+a/2-1;d.fillStyle=ga[f.color],d.fillRect(b,u,3,3)}d.strokeStyle=E1,d.lineWidth=2,d.strokeRect(1,1,a-2,a-2),d.strokeStyle=R1,d.lineWidth=2,d.strokeRect((o-1)*a+1,(o-1)*a+1,a-2,a-2);for(let f of l){let b=f.brightness;d.fillStyle=`rgb(${b},${b},${b})`,d.fillRect(f.x,f.y,1,1)}}function wa(e){let n=String(e??"").split(/[\n;]+/).map(a=>a.trim()).filter(Boolean),o=[];for(let a of n){let i=a.split(",").map(r=>Number.parseInt(r.trim(),10));if(i.length!==2||i.some(Number.isNaN))return null;o.push(i)}return o}function M1(e,n,o){let{gridSize:a,cellPx:i}=n,r=a*i;e.width=r,e.height=r;let s=e.getContext("2d");ya(e,n);let t=wa(o);if(!t||t.length===0)return;let c=t.map(([l,h])=>[h*i+i/2,l*i+i/2]);s.save(),s.lineJoin="round",s.lineCap="round",s.strokeStyle="rgba(255, 60, 60, 0.75)",s.lineWidth=3,s.beginPath(),s.moveTo(c[0][0],c[0][1]);for(let l=1;l<c.length;l++)s.lineTo(c[l][0],c[l][1]);s.stroke();for(let l=0;l<c.length;l++){let[h,d]=c[l],f=l===0,b=l===c.length-1;s.fillStyle=f?"rgba(46, 204, 113, 0.95)":b?"rgba(231, 76, 60, 0.95)":"rgba(255, 255, 255, 0.85)",s.beginPath(),s.arc(h,d,f||b?3:2,0,Math.PI*2),s.fill()}s.restore()}function ma(e,n){let o=()=>{let a=e();if(a){n(a);return}requestAnimationFrame(o)};requestAnimationFrame(o)}async function N1({user:e,weight:n=2}){let o="q-maze-solver-server",a="Maze Solver with Constraints",i=Ie(e);ma(()=>document.getElementById(`${o}-canvas`),t=>{ya(t,i);let c=document.getElementById(`${o}-download`);c&&(c.href="#",c.download="maze.png",c.style.display="inline-block",c.textContent="\u2B07 Download maze.png (300\xD7300)",c.addEventListener("click",l=>{l.preventDefault(),t.toBlob(h=>{if(!h)return;let d=URL.createObjectURL(h),f=document.createElement("a");f.href=d,f.download="maze.png",f.click(),URL.revokeObjectURL(d)})}))}),ma(()=>document.getElementById(o),t=>{let c=document.getElementById(`${o}-preview`);if(!c)return;let l="",h=()=>{let d=wa(t.value);d&&d.length>0&&(l=t.value),M1(c,i,l)};t.addEventListener("input",h),h()});let r=i.keys.map(t=>`<span style="color:${ga[t.color]};font-weight:bold;text-shadow:0 0 2px #000">${t.color}</span>`).join(" \u2192 "),s=$1`
    <h2>Maze Solver with Constraints</h2>
    <p>
      <strong>Scenario:</strong> You are given a per-student
      <strong>300×300 pixel maze image</strong>. This isn't just pathfinding — the
      maze has multiple constraint layers that must all be satisfied.
    </p>

    <h5>Constraints</h5>
    <ol>
      <li>
        <strong>Walls &amp; Paths:</strong> Dark pixels are walls, light pixels are paths.
        There is anti-aliasing noise on wall edges — don't use naive thresholding.
      </li>
      <li>
        <strong>7 Colored Keys (order matters):</strong> Collect keys in this exact order:
        <br /><span .innerHTML=${r}></span>
        <br />Visiting a key out of order is forbidden.
      </li>
      <li>
        <strong>One-way corridors:</strong> Subtle gradient arrows (light→dark) show allowed direction.
        Traversing the wrong way is blocked.
      </li>
      <li>
        <strong>Teleporters:</strong> Same-colored 2×2 dots warp you between two distant cells.
        Colors: <span style="color:#ff8800;font-weight:bold">Orange</span>,
        <span style="color:#8800ff;font-weight:bold">Purple</span>,
        <span style="color:#008888;font-weight:bold">Teal</span>.
      </li>
      <li>
        <strong>Decaying paths:</strong> Some corridor pixels are dimmer — brightness encodes how
        many steps they survive before disappearing. Dimmer = fewer steps remaining.
      </li>
    </ol>

    <h5>Your Maze</h5>
    <p>Start: <code>(0,0)</code> (green border, top-left) → End: <code>(29,29)</code> (red border, bottom-right)</p>

    <div style="margin:8px 0 16px">
      <a
        id="${o}-download"
        style="display:none;padding:9px 18px;background:#6c5ce7;color:#fff;
               border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none"
      >⏳ Rendering maze…</a>
    </div>

  <div style="display:flex;gap:16px;align-items:flex-start">
    <div style="border:2px solid var(--bs-border-color);border-radius:8px;
                padding:8px;background:var(--bs-tertiary-bg);flex-shrink:0">
      <canvas
        id="${o}-canvas"
        width="300"
        height="300"
        style="display:block;image-rendering:pixelated;width:300px;height:300px"
      ></canvas>
    </div>

    <!-- Legend Section -->
    <div>
      <h5 class="mt-0">Legend</h5>
      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));
                  gap:4px 16px;font-size:13px;max-width:500px">
      <div>🟩 <strong>Start</strong> — green border at (0,0)</div>
      <div>🟥 <strong>End</strong> — red border at (29,29)</div>
      <div>⬛ <strong>Wall</strong> — dark pixels</div>
      <div>⬜ <strong>Path</strong> — light pixels</div>
      <div>🔴🔵🟢🟡 <strong>Keys</strong> — 3×3 colored squares</div>
      <div>🟠🟣 <strong>Teleporters</strong> — 2×2 same-colored dots</div>
      <div>➡️ <strong>One-way</strong> — gradient arrows (light→dark)</div>
      <div>💡 <strong>Decaying</strong> — dim pixels (brightness = steps left)</div>
    </div>
  </div>
</div>

    <hr />
    <h5>Submit Your Path</h5>
    <p>
      Enter your path as a coordinate sequence — one <code>row,col</code> per line,
      from <code>0,0</code> to <code>29,29</code>. Each step must move to an adjacent
      cell (up/down/left/right) or use a teleporter.
    </p>

    <div style="display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;align-items:start">
      <div>
        <label for="${o}" class="form-label">Path (row,col per line):</label>
        <textarea
          class="form-control font-monospace"
          id="${o}"
          name="${o}"
          rows="10"
          placeholder="0,0\n0,1\n1,1\n..."
          required
          style="font-size:12px;width:100%;min-height:360px"
        ></textarea>
        <small class="form-text text-muted">
          The server replays your path step by step, checking walls, key order, one-way
          directions, teleporters, and decaying paths. All constraints must be satisfied.
        </small>
      </div>
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <strong>Live Path Preview</strong>
          <small class="text-muted">updates as you type</small>
        </div>
        <div style="border:2px solid var(--bs-border-color);border-radius:8px;padding:8px;background:var(--bs-tertiary-bg);width:100%;max-width:360px;aspect-ratio:1/1;overflow:hidden;box-sizing:border-box">
          <canvas
            id="${o}-preview"
            width="300"
            height="300"
            style="display:block;image-rendering:pixelated;width:100%;height:100%"
          ></canvas>
        </div>
      </div>
    </div>
  `;return{id:o,title:a,weight:n,question:s,answer:await pa(e),help:[]}}var A1,ke,E1,R1,ga,T1,P1,xa=k(()=>{"use strict";ua();A1="#1a1a2e",ke="#e8e8e8",E1="#2ecc71",R1="#e74c3c",ga={Red:"#ff0000",Blue:"#0000ff",Green:"#00cc00",Yellow:"#cccc00",Cyan:"#00cccc",Magenta:"#cc00cc",White:"#ffffff"},T1={Orange:"#ff8800",Purple:"#8800ff",Teal:"#008888"},P1={up:{dx:0,dy:-1},down:{dx:0,dy:1},left:{dx:-1,dy:0},right:{dx:1,dy:0}}});function q1(e,n){let o=e.charCodeAt(0);return o>=65&&o<=90?String.fromCharCode((o-65+n)%26+65):e}function Sa(e,n){return e.toUpperCase().split("").map(o=>q1(o,n)).join("")}function Ce(e,n){let o=[...e];for(let a=o.length-1;a>0;a--){let i=Math.floor(n()*(a+1));[o[a],o[i]]=[o[i],o[a]]}return o}function _1(e){let n=Array.from({length:V},()=>[]);function o(i,r){i!==r&&(n[i].includes(r)||n[i].push(r),n[r].includes(i)||n[r].push(i))}let a=Ce(Array.from({length:V},(i,r)=>r),e);for(let i=0;i<a.length-1;i++)o(a[i],a[i+1]);for(let i=0,r=0;i<30&&r<6;i++){let s=Math.floor(e()*V),t=Math.floor(e()*V);s!==t&&!n[s].includes(t)&&(o(s,t),r++)}return n.forEach(i=>i.sort((r,s)=>r-s)),n}function ka(e){let n=(e?.email??"").trim().toLowerCase(),o=(0,Ia.default)(`${n}#${L1}`),a=_1(o),r=Ce([...O1],o)[0],s=r.split(""),c=Ce(Array.from({length:V},(d,f)=>f),o).slice(0,s.length),l=Array.from({length:V},()=>1+Math.floor(o()*25)),h=[];for(let d=0;d<V;d++){let f=c.indexOf(d);if(f>=0)h.push(Sa(s[f],l[d]));else{let b=String.fromCharCode(65+Math.floor(o()*26));h.push(Sa(b,l[d]))}}return{adjacency:a,nodeCount:V,nodeShifts:l,fragments:h,answerWord:r,requiredNodes:c}}var Ia,V,L1,O1,Ca=k(()=>{"use strict";Ia=_(O(),1),V=12,L1="q-cipher-trail-server",O1=["NETWORK","CLUSTER","DECRYPT","TRANSIT","SIGNALS","QUANTUM","BEACON","VECTOR","MATRIX","BRIDGE","SOCKET","DAEMON","KERNEL","ROUTER","STREAM","BUFFER","PACKET","PORTAL","SHIELD","SYNTAX"]});var $a={};M($a,{default:()=>j1});import{html as ce}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function j1({user:e,weight:n=2}){let o="q-cipher-trail-server",a="Cipher Trail",i=ka(e),r=i.requiredNodes.map((d,f)=>({position:f,nodeId:d,encoded:i.fragments[d],shift:i.nodeShifts[d]})),s=r.length,t=[0,Math.floor(s/2),s-1],c=["x","y","z"];r.forEach((d,f)=>{let b=t.indexOf(f);b!==-1?(d.hideEncoded=!0,d.encodedPlaceholder=c[b]):d.hideEncoded=!1});let l=ce`
    <div class="mb-3">
      <p>
        You are given a sequence of <strong>Caesar-cipher encoded letters</strong> and the <strong>shift amount</strong> used to encode each one.
      </p>
      <p><strong>Your task:</strong></p>
      <ol>
        <li>For each letter (in order), look up its encoded value and shift amount</li>
        <li>Decode the letter by shifting it <em>back</em> by the shift amount (e.g. shift=3 means A→D, so D shifted back by 3 = A)</li>
        <li>Concatenate the decoded letters to form the hidden word</li>
        <li>Submit the word below</li>
      </ol>

      <table class="table table-sm table-bordered mt-3 mb-3" style="max-width:400px">
        <thead class="table-light">
          <tr><th>Position</th><th>Encoded</th><th>Shift</th></tr>
        </thead>
        <tbody>
          ${r.map(d=>ce`
              <tr>
                <td>${d.position}</td>
                <td>
                  ${d.hideEncoded?ce`<code data-secret-encoded="${d.encoded}" title="Inspect element to find the real value!">${d.encodedPlaceholder}</code>`:ce`<code>${d.encoded}</code>`}
                </td>
                <td>${d.shift}</td>
              </tr>
            `)}
        </tbody>
      </table>

      <label for="${o}" class="form-label"><strong>Your decoded word:</strong></label>
      <input
        class="form-control font-monospace"
        type="text"
        id="${o}"
        name="${o}"
        placeholder="e.g. NETWORK"
        style="max-width:300px;text-transform:uppercase"
        required
      />
      <small class="form-text text-muted">
        Decode each letter by shifting back, then concatenate in order.
      </small>
    </div>
  `;return{id:o,title:a,weight:n,question:l,answer:async d=>{let f=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:d,weight:n,questionId:o})}),b=await f.json();if(!f.ok)throw new Error(b.error||"Unable to verify answer.");return b},help:[]}}var Aa=k(()=>{"use strict";Ca()});var Ea={};M(Ea,{default:()=>V1});import{html as D1}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function V1({user:e,weight:n=3}){let o="q-decode-layered-server",a="Layered Encoding Challenge",i=`./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign||"")}&questionId=${encodeURIComponent(o)}`,r=D1`
    <div class="mb-3">
      <p>
        A string was encoded through multiple reversible transforms applied in a secret order
        with hidden parameters. Decode it back to the original value.
      </p>

      <div class="alert alert-secondary py-2 px-3" style="font-size:0.875rem; border-left:4px solid #6c757d;">
        📝 <strong>Hint:</strong>
        <em>"I am the first thing you gave us. Every locked door here opened because of me.
        Peel back every layer — and there I am."</em>
      </div>

      <iframe
        title="Your encoded challenge"
        src="${i}"
        style="width:100%;height:360px;border:1px solid #dee2e6;border-radius:12px;background:#fff"
      ></iframe>

      <label for="${o}" class="form-label"><strong>Your Answer (JSON)</strong></label>
      <textarea class="form-control font-monospace" id="${o}" name="${o}" rows="5"
        placeholder='{"decoded":"decodedstring|ABCDE"}'
        style="font-size:0.82rem;"></textarea>
      <p class="form-text mt-2">
        Submit <code>decoded</code>. You may optionally include <code>order</code> if you derived it.
      </p>
    </div>
  `;return{id:o,title:a,weight:n,question:r,answer:async t=>{let c=await fetch("/backendVerify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,quizSign:e.quizSign,response:t,weight:n,questionId:o})}),l=await c.json();if(!c.ok)throw new Error((l.error||"Unable to verify.")+(l.retryAfter?` Retry in ${l.retryAfter}s.`:""));return l}}}var Ra=k(()=>{"use strict"});var $e,Ta=k(()=>{$e=[{points:[[36.9017,132.8251],[29.4965,85.2866],[13.9989,-79.5222],[49.4597,-112.5548],[39.9186,165.4217]],hash:"d94b581367f48b0afd78d28bd4379408bcad769dc556b7d4dade3c6708231927"},{points:[[56.3003,21.7064],[31.9566,70.7456],[21.204,61.7357],[21.181,-86.085],[6.0763,-41.2843]],hash:"441e93acbc1b73479f255be08c42a5d86843f5f3ba5a7b01750cac0a6aedd66d"},{points:[[48.8083,-103.3525],[3.7597,100.0442],[34.615,151.8026],[21.204,61.7357],[39.9186,165.4217]],hash:"f07d585ae3cbcf1a76769ac9ccc5af7e01462668e305fd7b9de019c0c5562373"},{points:[[12.9435,-10.5061],[37.6408,64.5443],[39.9186,165.4217],[13.5328,-62.1142],[18.5631,19.2933]],hash:"24d8372f3f4592b071e3488f6e5d1ff026bdc5a346b46a2976dd0d5b9186f536"},{points:[[28.7959,65.2433],[31.0223,145.3114],[12.9435,-10.5061],[12.4228,109.8687],[13.1803,58.5281]],hash:"64052be2d8781e4210fe7a8db7e2f8359813bdddde633383965f62b4af729c6a"},{points:[[42.5826,72.1096],[26.1962,-13.3959],[41.2428,116.7191],[31.8472,110.8741],[49.4597,-112.5548]],hash:"3b921fe495901a8f41b8aff33e45c6d8506214f7d02ff9817054f685bce7de6b"},{points:[[12.4228,109.8687],[40.9467,-78.0269],[3.6808,79.7461],[10.0227,-46.5964],[10.7483,-78.7878]],hash:"49c39b5fe6e73819a3397f952f6a89b741409b684c570e184ea3e9f34920cf1d"},{points:[[51.5689,-4.9461],[39.9186,165.4217],[27.5906,81.3611],[41.3228,138.3305],[41.2428,116.7191]],hash:"f00cc664134cf3b649afc785fa73a7cc9ff44399cf7e0554fe39adcb8c63eeb0"},{points:[[38.9055,-103.5088],[49.4597,-112.5548],[13.9989,-79.5222],[24.1665,51.5626],[43.2322,145.7939]],hash:"710df2a271bde83e8cf899e2dcd7b3cae6778cfbf524e8b16014e268636d9168"},{points:[[29.4965,85.2866],[32.9613,-61.2046],[41.1456,-87.6977],[10.1791,-23.7994],[7.4864,40.4675]],hash:"693ecc36bca0a093ea98057e0163f85609c52fd4b17b282e1949035053f855c9"},{points:[[41.4759,62.1823],[7.9664,3.7745],[11.861,32.6943],[34.615,151.8026],[13.4225,36.3782]],hash:"b532a9771a80e9941ede9051cc48935163f58e41ff2ac1d23341a5ba9240d2b8"},{points:[[50.9811,-24.6377],[29.4965,85.2866],[7.3266,49.9125],[39.9186,165.4217],[30.8709,47.8341]],hash:"b41fcf1982d73f3c0c93aa2f282163f6a069699a619f3c392aaa4834a5b8cff0"},{points:[[29.1973,127.3654],[26.1962,-13.3959],[36.5347,122.8518],[20.2739,25.3633],[25.8916,23.3942]],hash:"1d03cbcb2bc555a62e8375b4044ee666ac0628232e01086a59c11f6291fd113c"},{points:[[18.5631,19.2933],[13.1803,58.5281],[29.6806,112.5277],[31.8472,110.8741],[12.4228,109.8687]],hash:"7f0e1a032958218769426ce631be437dacf1b42bdb7a78e6d30317058078d37f"},{points:[[43.2322,145.7939],[12.0013,27.8707],[36.9017,132.8251],[38.9055,-103.5088],[13.9989,-79.5222]],hash:"7638b9f0862279fcbd1648e7018400f82596208c3ec39ed8106d6354ed1f31a5"},{points:[[52.7298,-39.7147],[34.615,151.8026],[13.4225,36.3782],[41.3862,118.2505],[29.6806,112.5277]],hash:"434f22ad117012c57b496db1e94e1a00ea9f8d12a3d71f2bbdffd38450b74f47"},{points:[[52.7298,-39.7147],[6.272,100.2631],[12.9435,-10.5061],[10.1791,-23.7994],[7.3266,49.9125]],hash:"2ebe35734ce982f77d32ad45e224a4b7c84699890d8b2f503e64e57770093e15"},{points:[[31.8472,110.8741],[12.9435,-10.5061],[4.0558,17.1557],[41.4759,62.1823],[11.861,32.6943]],hash:"d39094b1ab440543544331222a865dfa5e51ee321641171299083063657e1cfa"},{points:[[31.0223,145.3114],[56.3865,.6975],[36.9017,132.8251],[24.1665,51.5626],[43.2322,145.7939]],hash:"7544f10ac8e33542ed2fa15b1b2b91ee0f83f57fea4e4b03d1afda7d3cc8ebaa"},{points:[[47.1796,84.961],[48.9839,-104.574],[22.6162,17.8949],[27.6981,22.4373],[4.0558,17.1557]],hash:"16b53d320b56400c82fabc8e56a8ee845bd918781917c42f5377e095eb952d1c"},{points:[[22.6162,17.8949],[50.9811,-24.6377],[41.1456,-87.6977],[31.8472,110.8741],[6.0763,-41.2843]],hash:"a6f6ef84545d0c917d912f97b18a1506833e94d48a1b8ffb09524a3233a489cd"},{points:[[47.7819,90.9181],[54.4585,11.4131],[40.5326,47.2158],[31.9566,70.7456],[52.7298,-39.7147]],hash:"a98cf107ff0e84387299ee583bf926864cd2ffd6612653a58fcc30f865e75060"},{points:[[47.0445,5.3387],[48.8083,-103.3525],[40.9467,-78.0269],[53.1787,58.6321],[56.3865,.6975]],hash:"0046a5f2f0e77354e2c3da5b490800b59d63b4737083b414806097db01444d25"},{points:[[48.8083,-103.3525],[41.2428,116.7191],[32.9613,-61.2046],[40.9594,156.3847],[47.0445,5.3387]],hash:"3c0544c3894af36b05529d4ac3943e1219149d9394fdf0cbb656403968079a2b"},{points:[[13.1803,58.5281],[24.7191,-61.3869],[36.9017,132.8251],[47.1796,84.961],[44.5508,143.3182]],hash:"c2d414b50dc353b7da1d52af145d4fbab41fab88c3cb51291757573e17ce6a82"},{points:[[21.181,-86.085],[42.5826,72.1096],[52.0059,-83.3751],[3.7597,100.0442],[52.1366,86.0042]],hash:"3877161854890d85e6e9d2543dda4a439b2d59bd9feca905ff02d098fc0c946d"},{points:[[33.4596,-78.0387],[37.3094,-7.929],[20.2739,25.3633],[47.7819,90.9181],[40.9467,-78.0269]],hash:"4b1104061360e8cc49be218b7fdd8a099c1f6aa7347b8a3c482a4ec6065cab61"},{points:[[26.1962,-13.3959],[22.6162,17.8949],[5.459,-3.0179],[34.1641,158.8395],[39.9186,165.4217]],hash:"5b3c646d1337b98e82c87b8cfc6f30cf833d534c6c26eedc207918ee9dece906"},{points:[[13.9989,-79.5222],[24.7191,-61.3869],[25.8916,23.3942],[24.533,40.2711],[47.0044,22.944]],hash:"748c7de65b3ca2e0676b4dc3708fe3125b7ac8c4207e3714574f93f3cbbadcc9"},{points:[[25.8916,23.3942],[31.8472,110.8741],[38.9055,-103.5088],[37.3094,-7.929],[32.9613,-61.2046]],hash:"b5ad4a3011a671b87bb516417657a4e2d2a3cd9b0dd9e6c10cdd6326fc20781c"},{points:[[10.7483,-78.7878],[12.4228,109.8687],[4.0558,17.1557],[50.9811,-24.6377],[13.5328,-62.1142]],hash:"4656c503a6ff4eb0c5e11a1a104579bb5904d93c157c213a0d7275d0c3820fe7"},{points:[[19.8871,-50.7798],[41.1456,-87.6977],[13.9989,-79.5222],[41.2428,116.7191],[49.4597,-112.5548]],hash:"ada1f174b8d24b5cd32ee03ad0930452c6dc2ca27f51c7127dfd126bc3ef9890"},{points:[[21.6993,-8.9028],[31.8472,110.8741],[24.533,40.2711],[5.459,-3.0179],[47.7819,90.9181]],hash:"46af80113251debf2f670fea8eb6666d6adb3caf00783eadf3a6ecbcca901198"},{points:[[34.615,151.8026],[47.7819,90.9181],[10.0227,-46.5964],[50.9811,-24.6377],[28.7959,65.2433]],hash:"952a6ea4337971500bb2bdad30bd8c7b310d613896119f539f3bb39fa0699520"},{points:[[29.6806,112.5277],[24.533,40.2711],[7.4864,40.4675],[40.5326,47.2158],[12.9435,-10.5061]],hash:"82243d556f27c166770f697628573251ce52fa9635b4d804bce8c821d537ab13"},{points:[[13.1803,58.5281],[31.8472,110.8741],[24.1665,51.5626],[40.9594,156.3847],[39.9186,165.4217]],hash:"95fe322fdedd8f4fc75639a9311079db449b6189e6c0251983f81a83c080729a"},{points:[[6.272,100.2631],[12.0013,27.8707],[19.1165,-1.557],[7.9664,3.7745],[39.0296,-85.1922]],hash:"a6751cf1a543d7ab1dd7d4488b3ca2c9ab3998bbef57006d8568b900a4385dda"},{points:[[10.0248,-2.2023],[48.9839,-104.574],[28.1059,112.0864],[3.6808,79.7461],[41.2428,116.7191]],hash:"93d30073739c1755623b98ebe1a167d19488d6dc364bed753358bdf8484dfd7b"},{points:[[12.9435,-10.5061],[18.5631,19.2933],[40.9594,156.3847],[48.9839,-104.574],[21.722,136.6048]],hash:"3f6902a54187b765173263bc589dfd291bf271e15da50612acedd3f8b638f712"},{points:[[41.3862,118.2505],[6.272,100.2631],[27.9592,112.9154],[13.1803,58.5281],[24.1665,51.5626]],hash:"7c5e0d9143e091d99c60938d4674fffb72bddb80269b732788d2caa0bf92ba11"},{points:[[48.8083,-103.3525],[51.5689,-4.9461],[40.9467,-78.0269],[34.1641,158.8395],[26.0238,-32.1693]],hash:"c25b3a7b766024b48e28138a43381e4e1bc51b4500442ac56716e4563c75cd2e"},{points:[[42.5826,72.1096],[26.0238,-32.1693],[13.5328,-62.1142],[40.5326,47.2158],[48.8083,-103.3525]],hash:"8daabbaff0a7c784182ff676fb8e601824bef7906df631af30e8d925c9bc3df2"},{points:[[52.7298,-39.7147],[14.1684,-21.7701],[31.9566,70.7456],[10.1791,-23.7994],[41.3862,118.2505]],hash:"5fa9466aeda69b2ca90f2917b28b4bc4517e10cec1e1e1b4d3aed81b31d52a5e"},{points:[[52.7298,-39.7147],[54.4585,11.4131],[12.4228,109.8687],[34.615,151.8026],[13.9989,-79.5222]],hash:"517c4b46b30da64837e2a89ddadadf910bdb0f1529c69fb566ec2e54ecce77f2"},{points:[[27.5906,81.3611],[27.6981,22.4373],[18.5631,19.2933],[36.9017,132.8251],[47.0044,22.944]],hash:"f0fe32864953b353a9f5536723cb0e4c11f3309d1b4a690757802e47a64d9f33"},{points:[[24.7191,-61.3869],[26.4021,-33.1847],[32.9613,-61.2046],[30.8709,47.8341],[36.5347,122.8518]],hash:"6d93a5f0360097db7ef9834a824ee3a168c435f4dc03b4589c8886ed1e1a33b7"},{points:[[7.1282,107.3975],[30.4574,150.0647],[35.6122,90.8085],[20.6307,.4236],[39.9186,165.4217]],hash:"c99be4ed3d3f2050cfebdbf36cf8def109504305fbf43c150503ca293cc10c4c"},{points:[[27.4646,102.2729],[26.0238,-32.1693],[30.8709,47.8341],[18.5631,19.2933],[13.4225,36.3782]],hash:"4ef0b22c2b75419ecc8737abb222ae319674c16c958c0f3bc946e7af7e03d42d"},{points:[[56.3865,.6975],[18.5631,19.2933],[40.9467,-78.0269],[10.0248,-2.2023],[21.204,61.7357]],hash:"799e4c549c4c40114b5e712f3012a42caa103528af775e7b224f1c8ca1f8052b"},{points:[[38.9055,-103.5088],[29.4965,85.2866],[41.2428,116.7191],[30.6483,76.4905],[35.6122,90.8085]],hash:"15de5d12ebf082c532e7f290568eb66e0524e580202384baa54c7b5455adf148"},{points:[[31.0223,145.3114],[19.1165,-1.557],[35.6122,90.8085],[27.5906,81.3611],[24.475,31.4889]],hash:"59644efd16df48928e38e1787f80f25ab1f415d9bf1df8ed368c78bf6435d02e"},{points:[[44.5508,143.3182],[41.2428,116.7191],[38.9055,-103.5088],[28.7959,65.2433],[56.3865,.6975]],hash:"607644a5d667768b358395cee923ef5eaba4513d0b04ef587f22144c02f9cd6a"},{points:[[21.722,136.6048],[35.6122,90.8085],[52.0059,-83.3751],[27.6981,22.4373],[12.4228,109.8687]],hash:"08437e1cac233a5b5bd403eeb27e71923143d0d8a2ef14e735935d492100c2fb"},{points:[[42.5826,72.1096],[29.4965,85.2866],[14.1684,-21.7701],[3.6808,79.7461],[40.9594,156.3847]],hash:"dcc89e27129c6c00c69268343c8676bd2da9c97d2ad00d0c7dbdf2b8b9d269a6"},{points:[[12.4228,109.8687],[47.1796,84.961],[29.1973,127.3654],[27.6981,22.4373],[47.7196,-85.2553]],hash:"e2adc62ecdf189a2eacdbb78bf352a1858f34090d1fba8db950205d50cd37ff2"},{points:[[12.9435,-10.5061],[47.7196,-85.2553],[43.2322,145.7939],[56.3865,.6975],[18.191,124.1161]],hash:"8de782ef0126318c5e233f5fe83424ea51a2947c59dacff1d87ed106ade80e64"},{points:[[36.9017,132.8251],[24.7191,-61.3869],[7.3266,49.9125],[13.1803,58.5281],[10.7483,-78.7878]],hash:"4c69575afb0bf4f6eb1652424023d0e59fa58a7660aef972e9bed85a1383d039"},{points:[[36.5347,122.8518],[21.722,136.6048],[31.8472,110.8741],[34.615,151.8026],[25.8916,23.3942]],hash:"b059a0e62bfa75d904350e51cbd26af328ed03b1774f224656871895fcc7039f"},{points:[[40.5326,47.2158],[28.1059,112.0864],[37.6408,64.5443],[13.5328,-62.1142],[30.8709,47.8341]],hash:"b24c3b16bcfa54c4de1ab332222851f5537e850a21e2364cc4ee631ca2beb812"},{points:[[53.1787,58.6321],[36.5347,122.8518],[19.1165,-1.557],[47.0445,5.3387],[56.3865,.6975]],hash:"ace207a425db450dabc90f4c11968095bb750c34bec92f3ac8c6aac406edeee4"},{points:[[24.1665,51.5626],[6.272,100.2631],[20.2739,25.3633],[54.4585,11.4131],[31.9566,70.7456]],hash:"35edf0f4047245b5a01ce6a80483c0aacf370999408381e0b224249c4139bc0b"},{points:[[31.9566,70.7456],[21.722,136.6048],[5.459,-3.0179],[30.6483,76.4905],[52.7298,-39.7147]],hash:"ff0b3a83ccf911f4bdfc0d1fba1640961ef9e0a35f5341d46080b0babbff17b7"},{points:[[13.9989,-79.5222],[28.1059,112.0864],[52.7298,-39.7147],[24.533,40.2711],[34.1641,158.8395]],hash:"55a7faffb888e4f960d5c2748f4e66e85289b5c19808f36f2cafacf3602ba8c4"},{points:[[31.0223,145.3114],[26.0238,-32.1693],[24.475,31.4889],[41.4759,62.1823],[48.8083,-103.3525]],hash:"dfcb7f86e695fc8a549f40eb03b4b1b88eb21b6feefaa7880cbd3605dc9a830c"},{points:[[7.4864,40.4675],[24.475,31.4889],[36.5347,122.8518],[26.4021,-33.1847],[20.2739,25.3633]],hash:"ba9ac29860869d2c01da41b217a49a4af4727f2f83f76f0957387e7b621f07b1"},{points:[[41.4759,62.1823],[32.9613,-61.2046],[42.5826,72.1096],[10.0248,-2.2023],[41.3228,138.3305]],hash:"d1cff2eadb4d6cd81a2cd18cc62cd6950c595404a7bec8eb5c75398d5d33cccd"},{points:[[37.3094,-7.929],[36.5347,122.8518],[41.3228,138.3305],[47.0445,5.3387],[27.9592,112.9154]],hash:"1ca663e85ae3c1853a42c55b4c5808c558d1e9ee1b126d790b3d623e414ee014"},{points:[[25.8916,23.3942],[31.9566,70.7456],[26.4021,-33.1847],[49.4597,-112.5548],[42.5826,72.1096]],hash:"ed64e62a3ff0ef751453ea4f176fc1f3762e350e0fb33ba2b1237b1d3fc72dce"},{points:[[38.9055,-103.5088],[40.9467,-78.0269],[30.6483,76.4905],[26.4021,-33.1847],[44.5508,143.3182]],hash:"cdb91074f54da92726bd029bf07c7d362f0e12a5325d693c7f102199b0884696"},{points:[[47.0445,5.3387],[47.1796,84.961],[27.5906,81.3611],[13.5328,-62.1142],[12.9435,-10.5061]],hash:"e230f0100f36e66aa6b108c52258ef483d2cb7c3da39bf274dc4a1d18f11bd77"},{points:[[33.4596,-78.0387],[25.8916,23.3942],[35.6122,90.8085],[47.0445,5.3387],[12.0013,27.8707]],hash:"ab7e2ac4e0379cd20adbc3453e4a239b5613de5cd3f069cb862d767d4cde7d33"},{points:[[30.6483,76.4905],[7.1282,107.3975],[35.7265,79.2414],[31.9566,70.7456],[33.4596,-78.0387]],hash:"92466ae4894c43b7b973e45e0221121bf528f42f0be942edbfa38af5e8666d7a"},{points:[[37.6408,64.5443],[3.7597,100.0442],[51.5689,-4.9461],[36.5347,122.8518],[48.9839,-104.574]],hash:"a703e38d78d111f69610dfd52599b5ac08e48d2563dddc5b72f86612348fec3a"},{points:[[44.523,-113.975],[41.2428,116.7191],[21.722,136.6048],[10.7483,-78.7878],[48.9839,-104.574]],hash:"fb097e9e4b275110934f974e652aa014af3fb08d7495eff238570c5e7cb86e18"},{points:[[36.5347,122.8518],[41.2428,116.7191],[47.7819,90.9181],[42.5826,72.1096],[35.7265,79.2414]],hash:"e0d7d903acb7e5fbfc9b1f35f533dbe5399ba41a8e3fad4aa46a10973cf2e138"},{points:[[38.9799,-12.1692],[22.6162,17.8949],[11.861,32.6943],[10.7483,-78.7878],[6.272,100.2631]],hash:"275035e5c3066dd8618f37f6acc28b7964324afa945d017d12368958fcd457a8"},{points:[[41.2428,116.7191],[47.7196,-85.2553],[3.7597,100.0442],[31.0223,145.3114],[7.4864,40.4675]],hash:"63d89c2689c1438c92dcf5a1e7a85deb6494b092599cf43a11d808967ce50a89"},{points:[[36.9017,132.8251],[48.8083,-103.3525],[31.9566,70.7456],[29.4965,85.2866],[26.1962,-13.3959]],hash:"0354bf95a7582b04cf8e368679b741f3f1267b0f50cb0bdf10fdcd3231b15acb"},{points:[[19.1165,-1.557],[24.475,31.4889],[21.204,61.7357],[41.1456,-87.6977],[13.1803,58.5281]],hash:"b8d058c46c4ae21237d40d235460aa106c18d193d8cbad52ebdf67ea6ee532e8"},{points:[[10.0248,-2.2023],[30.8709,47.8341],[32.9613,-61.2046],[7.4864,40.4675],[24.7191,-61.3869]],hash:"7ba7bd0b392fa50e524893abc1637b3fa0c2809ed9538f8fb2b4ecc96854ce17"},{points:[[47.7196,-85.2553],[4.0558,17.1557],[44.5508,143.3182],[7.1282,107.3975],[13.9989,-79.5222]],hash:"a20b0659a4fb8b69bd0f94cc8751e126b485127085f6b38f68f704eb07ae1eee"},{points:[[19.8871,-50.7798],[41.2428,116.7191],[18.191,124.1161],[41.4759,62.1823],[29.6806,112.5277]],hash:"c8a70b189862371a6e938ef658f96a680d05945768d945540e517995955c4fb8"},{points:[[37.3094,-7.929],[12.4228,109.8687],[52.1366,86.0042],[54.4585,11.4131],[27.6981,22.4373]],hash:"d716c80ce7bf3a7cb3c039df8bdeb995436bf9b6d88ed08bf6d612b77a074087"},{points:[[6.0763,-41.2843],[47.7819,90.9181],[47.7196,-85.2553],[7.1282,107.3975],[38.9799,-12.1692]],hash:"c267bd1444b5513b28986f8daaa7b3fd65577f1ac3912a9c3b8b44ce439e1f8d"},{points:[[29.1973,127.3654],[27.5906,81.3611],[39.9186,165.4217],[26.1962,-13.3959],[6.272,100.2631]],hash:"528f7a7aa7d5e335759c3b6b6b5f20dc48bc910c081b3dd013c59578fd56f9c8"},{points:[[24.7191,-61.3869],[13.5328,-62.1142],[56.3003,21.7064],[52.7298,-39.7147],[37.3094,-7.929]],hash:"07526d094d739a5df9c5bda4ce82194c82236159d3bfe470ad8403cd328fa3e6"},{points:[[18.191,124.1161],[31.0223,145.3114],[21.722,136.6048],[47.7819,90.9181],[35.6122,90.8085]],hash:"96ba1037eeed1ea78e4c66cc6171376f5f47837fb9f092f4645f7bf8351624ec"},{points:[[27.4646,102.2729],[54.4585,11.4131],[47.7819,90.9181],[13.5328,-62.1142],[21.6993,-8.9028]],hash:"17789201fb11fe54915cef100719c2e23f6377b648b59dfa6e4a14b78a6b5fc3"},{points:[[13.1803,58.5281],[27.6981,22.4373],[47.1796,84.961],[7.1282,107.3975],[56.3865,.6975]],hash:"17214c97c082771f661d6f7403b5096681d16fb4ed36696f18a09ed8297e993a"},{points:[[4.0558,17.1557],[56.3003,21.7064],[24.7191,-61.3869],[24.475,31.4889],[13.5328,-62.1142]],hash:"7f01dabf4925405de29a0356f2a3d29ec92ac65d99048b6d1384b67d57664755"},{points:[[35.7265,79.2414],[34.1641,158.8395],[25.8916,23.3942],[33.4596,-78.0387],[47.1796,84.961]],hash:"d50d30be078ae94901fce9c62719cad0b653ef1eb51f637e778f7a946f1350dc"},{points:[[41.3228,138.3305],[27.6981,22.4373],[49.4597,-112.5548],[31.8472,110.8741],[12.0013,27.8707]],hash:"6547c4c7d4524fc3f1301ed19ec1903ea6fa6e47d2cc1b268ad6e4ce40b9879d"},{points:[[24.7191,-61.3869],[53.1787,58.6321],[20.6307,.4236],[24.533,40.2711],[51.5689,-4.9461]],hash:"0aab1ce7c8d15948d77f5b36da5597c9f060c433fb7575897db0fe984f15439b"},{points:[[37.6408,64.5443],[39.0296,-85.1922],[41.3228,138.3305],[14.1684,-21.7701],[53.1787,58.6321]],hash:"214f9871cdf811eaa2ca28d59a0a56b4513324182c41164a2b70ba7c9704661a"},{points:[[12.4228,109.8687],[27.9592,112.9154],[21.204,61.7357],[48.8083,-103.3525],[11.861,32.6943]],hash:"e3ed2f9b972847081ee39a04ed445af832efb4ad9e901b8ab18bff9d201fd8b5"},{points:[[29.1973,127.3654],[18.191,124.1161],[3.7597,100.0442],[24.533,40.2711],[22.6162,17.8949]],hash:"769cc758a5051b8025fc8312ec0fd1077ae851a2d611ff1ddc741c69cfe69591"},{points:[[38.9055,-103.5088],[19.8871,-50.7798],[48.9839,-104.574],[21.6993,-8.9028],[7.3266,49.9125]],hash:"19ab05b98b8910fe4427abb0054a9029af447c941231adaa14d8d7cf4829b583"},{points:[[34.615,151.8026],[6.272,100.2631],[35.7265,79.2414],[27.5906,81.3611],[21.204,61.7357]],hash:"1f4cb79882d2770780af28da89101e779a8e5e4cb70ce7abd90d2eb3213c2b75"},{points:[[27.6981,22.4373],[22.6162,17.8949],[35.6122,90.8085],[13.1803,58.5281],[41.4759,62.1823]],hash:"f0300a5dff40e7b74ea49eed36859dc1749fa7b801d76e5c537dde72a65eb500"},{points:[[28.7959,65.2433],[21.204,61.7357],[31.8472,110.8741],[48.9839,-104.574],[32.9613,-61.2046]],hash:"1a6c89cf392031aab04953b66662a720688241509dbf0b929e286ed155b6f415"},{points:[[47.7196,-85.2553],[27.9592,112.9154],[40.9467,-78.0269],[21.181,-86.085],[13.1803,58.5281]],hash:"6d6f24d928ff8aa2a0e3cb12a46f9047732d0d00eb9f26ecc8b4b34a37e22df4"},{points:[[19.1165,-1.557],[36.5347,122.8518],[33.4596,-78.0387],[51.5689,-4.9461],[24.475,31.4889]],hash:"271fa78fb13612469b2f4e5c0e2be678644b277f03c292979f63797ec3197962"},{points:[[7.4864,40.4675],[28.1059,112.0864],[5.459,-3.0179],[56.3003,21.7064],[48.9839,-104.574]],hash:"2f4f19827f2e40d54468ddb81c035d785b82382674d8d2110cc944160494689c"},{points:[[13.5328,-62.1142],[12.0013,27.8707],[4.0558,17.1557],[10.0248,-2.2023],[56.3865,.6975]],hash:"40f11a95e81f43bfafb68d12f9661a831a5769c57fc5640c6cbec1a54da284a0"},{points:[[42.5826,72.1096],[52.1366,86.0042],[24.533,40.2711],[41.4759,62.1823],[50.9811,-24.6377]],hash:"21c982b9b69245af0d6d651497f2533515be3c04389c0448521b2c541e39de93"},{points:[[56.3865,.6975],[26.4021,-33.1847],[10.0248,-2.2023],[13.9989,-79.5222],[35.6122,90.8085]],hash:"15613c03c99332c083e5bbe2178414ada1a95e463d6f609151a3bd96b49e0a25"},{points:[[3.6808,79.7461],[38.9055,-103.5088],[52.0059,-83.3751],[10.0248,-2.2023],[44.523,-113.975]],hash:"29bb42f633c5a0ab8094a375f262a4abf33f46168930908ace4ec12b759f0d8f"},{points:[[40.9594,156.3847],[26.1962,-13.3959],[20.2739,25.3633],[41.2428,116.7191],[40.5326,47.2158]],hash:"54a06ba34d48591d2cc93a803497eed79e00d15e8aca18e5576ecd1c75b47ddf"},{points:[[44.523,-113.975],[56.3003,21.7064],[24.475,31.4889],[52.1366,86.0042],[30.6483,76.4905]],hash:"9220b70383f49cb0cbd681b76001f98505bd681359f61c574e12319e822df0a0"},{points:[[40.5326,47.2158],[5.459,-3.0179],[33.4596,-78.0387],[6.0763,-41.2843],[13.1803,58.5281]],hash:"d640116a741103e47ea5aff99c74d53d3f7090001deeab186a5eb5628488d90c"},{points:[[47.0044,22.944],[4.0558,17.1557],[3.6808,79.7461],[27.5906,81.3611],[31.8472,110.8741]],hash:"88f574279c41e60442342517cc425c808333c52102d6d3e2adcd553a273c02a2"},{points:[[11.861,32.6943],[13.1803,58.5281],[6.0763,-41.2843],[19.1165,-1.557],[31.8472,110.8741]],hash:"aee7571f0fddd91a847075c0653b846a3867013d94b8b1fdac84895edd2f9638"},{points:[[3.6808,79.7461],[27.9592,112.9154],[35.7265,79.2414],[31.9566,70.7456],[51.5689,-4.9461]],hash:"e4c404c9cece519f6fec07f1fe6f1ae6bfa3f1412b57b477dfc9ac05561ad11f"},{points:[[24.475,31.4889],[28.1059,112.0864],[41.3228,138.3305],[34.1641,158.8395],[3.6808,79.7461]],hash:"b6b84d682c60ce974e6065da9ed400c2291797cd09614eb70b3c7fc5283d3dea"},{points:[[30.6483,76.4905],[56.3003,21.7064],[31.0223,145.3114],[24.533,40.2711],[6.272,100.2631]],hash:"6fb0d6938277ddde2ae2237f07ed3147a44b8809bc91f15639b711fcb273ba84"},{points:[[13.4225,36.3782],[30.8709,47.8341],[18.5631,19.2933],[13.1803,58.5281],[33.4596,-78.0387]],hash:"3cd9e7067cd0128ca00dc7d68f69c6ca62d8cfd5afdd806334d4cca93cec2b6d"},{points:[[29.1973,127.3654],[28.1059,112.0864],[30.4574,150.0647],[27.5906,81.3611],[40.9594,156.3847]],hash:"a51cc54049fd0458356302b73909065f3709764392cf755a2534acb1362ccae7"},{points:[[10.7483,-78.7878],[10.0227,-46.5964],[51.5689,-4.9461],[52.1366,86.0042],[37.3094,-7.929]],hash:"3bc5f516aed85e528570262de10b336c681ba96ccc01af5547c761ec14b2e206"},{points:[[37.3094,-7.929],[13.5328,-62.1142],[26.0238,-32.1693],[56.3865,.6975],[29.6806,112.5277]],hash:"b8cbd342cdefa22907dfd1aa3a1156161731e4ec43b2fd13551cd63d6000410a"},{points:[[22.6162,17.8949],[31.9566,70.7456],[21.6993,-8.9028],[47.7819,90.9181],[10.7483,-78.7878]],hash:"c55e3e47ddb4de9452faff7ba3b2b65d585db3eb2b2f30c19fe43713bb459e49"},{points:[[35.6122,90.8085],[20.6307,.4236],[52.7298,-39.7147],[39.0296,-85.1922],[24.533,40.2711]],hash:"99781546178c7ac323e351de533c105d44a193323548f7bfe21418fc237e626d"},{points:[[41.3862,118.2505],[56.3003,21.7064],[18.191,124.1161],[27.5906,81.3611],[34.615,151.8026]],hash:"90cc849472388e2bc8212ed121fb2e68dee9639a6c9288d5546825703f88cecd"},{points:[[18.5631,19.2933],[42.5826,72.1096],[30.4574,150.0647],[35.7265,79.2414],[29.1973,127.3654]],hash:"92a83da58f5e36b56f889a00e2563e6d3cd79450291fab8bb79b085021a9372d"},{points:[[26.1962,-13.3959],[6.0763,-41.2843],[20.6307,.4236],[40.9594,156.3847],[26.0238,-32.1693]],hash:"5f57a81284be1cfe01a7d59de1fd3918afdc451b744d2594e1c85d5a0ea4b03a"},{points:[[7.4864,40.4675],[20.6307,.4236],[7.1282,107.3975],[42.5826,72.1096],[31.0223,145.3114]],hash:"bf7ce072ee79a1a245aec87decfe5f13abba6657c7494d7042d3a88a8ff8a925"},{points:[[21.181,-86.085],[32.9613,-61.2046],[41.3862,118.2505],[31.8472,110.8741],[36.5347,122.8518]],hash:"0b76c99d0f37ad5b63698a14c098060877c47d31f68977a97d08f6deacff61f0"},{points:[[56.3865,.6975],[11.861,32.6943],[47.7196,-85.2553],[41.4759,62.1823],[31.9566,70.7456]],hash:"8f2107a8cee7801057bd46f63614029a5a03c99ad3b47c0b6acac98dae48aef1"},{points:[[47.0445,5.3387],[20.2739,25.3633],[13.5328,-62.1142],[27.5906,81.3611],[10.0227,-46.5964]],hash:"d4bd99968f37ee3a316928e5ccd82d50e7e2900eb73bde9156ed57e33a69b399"},{points:[[27.9592,112.9154],[31.8472,110.8741],[52.0059,-83.3751],[48.9839,-104.574],[43.2322,145.7939]],hash:"a8536e4cd7f1447b20fde13b1920f1267ee6cfba0d45f2baa43e9db047856ab7"},{points:[[13.1803,58.5281],[13.9989,-79.5222],[40.5326,47.2158],[11.861,32.6943],[36.5347,122.8518]],hash:"14d198a9d9c96f0ea978407cd1972580bcc2c6b4c3012e7c48e229bbfdc719f3"},{points:[[35.7265,79.2414],[39.0296,-85.1922],[13.1803,58.5281],[5.459,-3.0179],[13.5328,-62.1142]],hash:"ca920b3e817017e1ebfb11a9c39c5bc783b7ea38e924770004a8695d2ff1244b"},{points:[[36.9017,132.8251],[50.9811,-24.6377],[20.2739,25.3633],[54.4585,11.4131],[48.9839,-104.574]],hash:"2cb143b4ee465deb8c148bc9a238bd64b9784b664b5452f4b541df3158163a7a"},{points:[[48.8083,-103.3525],[51.5689,-4.9461],[33.4596,-78.0387],[40.9467,-78.0269],[24.7191,-61.3869]],hash:"7c78e78214aef95ef2d9b699820b850a24c2694391de2ed172be415e5fae9deb"},{points:[[37.6408,64.5443],[24.1665,51.5626],[52.0059,-83.3751],[7.3266,49.9125],[37.3094,-7.929]],hash:"b3d5ca3a21c5391c0e045919d2692a5eed8157abe86a95d8087d2c51b8a69ca9"},{points:[[47.0044,22.944],[37.6408,64.5443],[52.1366,86.0042],[26.0238,-32.1693],[52.0059,-83.3751]],hash:"e32cf553ad640ebe83ec50492802f4ae2a54325d239acf16f8c2d090cb3db32e"},{points:[[36.5347,122.8518],[48.8083,-103.3525],[44.523,-113.975],[47.7819,90.9181],[50.9811,-24.6377]],hash:"9c70054bfd30d9ae56a676c1f8f31d75b422ddf844837efd5eac916f37931810"},{points:[[30.6483,76.4905],[48.9839,-104.574],[21.722,136.6048],[6.0763,-41.2843],[54.4585,11.4131]],hash:"a8c15a17374460c66cfe4fe6962c5ac3617208359d9916d068399f7e391bd145"},{points:[[13.5328,-62.1142],[52.0059,-83.3751],[47.0445,5.3387],[26.0238,-32.1693],[53.1787,58.6321]],hash:"567bf782fbb509c11fa69a980489b8ec89a330bd88386acd0feed822a867e2e3"},{points:[[34.615,151.8026],[19.8871,-50.7798],[13.9989,-79.5222],[26.0238,-32.1693],[22.6162,17.8949]],hash:"d8f7cba9d4804b7aca95a4d7f9c45cb8d29ed4f749eac1af25f2f3e82aafcef9"},{points:[[38.9055,-103.5088],[22.6162,17.8949],[40.9467,-78.0269],[25.8916,23.3942],[20.2739,25.3633]],hash:"36d83e16bdce9a30a53a7d95d90f5b3ba0202a7133aa26661a9af7579adbf89e"},{points:[[35.6122,90.8085],[47.0445,5.3387],[38.9055,-103.5088],[10.1791,-23.7994],[21.6993,-8.9028]],hash:"d1551217477994dec452691840a96e1bfdbae5f03d203f0632d0ef74402e8ead"},{points:[[30.4574,150.0647],[26.1962,-13.3959],[28.7959,65.2433],[47.1796,84.961],[44.523,-113.975]],hash:"5dc49ffa9332c1881220803eed556f21b6aab597a1b51e2ea238c8bd9638c43e"},{points:[[37.3094,-7.929],[26.0238,-32.1693],[13.1803,58.5281],[5.459,-3.0179],[11.861,32.6943]],hash:"c94fb3e0fb7692ffa6275c66795db47cf9064f2adc21ab4aa073928f7807bf8e"},{points:[[30.4574,150.0647],[40.9594,156.3847],[51.5689,-4.9461],[53.1787,58.6321],[21.722,136.6048]],hash:"8afca8e532bad4c30cd0f40c4f60a8af28904e642b5867cffd1936da3584d33b"},{points:[[21.6993,-8.9028],[11.861,32.6943],[30.6483,76.4905],[14.1684,-21.7701],[13.9989,-79.5222]],hash:"d76f581e1df9d8c3ca7c64882dfb163b91f36015be23fd4fb0c69608f81178de"},{points:[[31.8472,110.8741],[13.9989,-79.5222],[41.3228,138.3305],[48.9839,-104.574],[50.9811,-24.6377]],hash:"1d95c8be4b4fc1dafc8137f68500348494262d2f9ed6c7b234206d846596da0f"},{points:[[21.181,-86.085],[30.8709,47.8341],[20.6307,.4236],[52.7298,-39.7147],[18.5631,19.2933]],hash:"d46604e024abc7663e2d9a0a9766be97cc40988b5857b7c2d2a9ca704527b589"},{points:[[21.6993,-8.9028],[31.9566,70.7456],[41.2428,116.7191],[21.204,61.7357],[20.2739,25.3633]],hash:"a375b1b893776ead04a561d54443ed0a561869555487c0bc1dcb2f4eac80ef68"},{points:[[51.5689,-4.9461],[44.523,-113.975],[12.0013,27.8707],[40.5326,47.2158],[56.3003,21.7064]],hash:"f361d52aec3f38a263567b0e4072cb7a16aa79a8301a1e37ddae3bc3a248e3c3"},{points:[[19.8871,-50.7798],[47.0445,5.3387],[40.9594,156.3847],[47.7196,-85.2553],[26.4021,-33.1847]],hash:"4236e5e986bf04ad257d2780d62d13efd669904ee6969d03eb9e54cb39475b1b"},{points:[[34.1641,158.8395],[37.6408,64.5443],[31.0223,145.3114],[41.1456,-87.6977],[29.1973,127.3654]],hash:"e95c2607056b24cdbc3ea227b9883028eba250aff198bf1f378e875f60201184"},{points:[[40.9467,-78.0269],[20.6307,.4236],[34.1641,158.8395],[56.3003,21.7064],[12.4228,109.8687]],hash:"4bc9d4e40f4633411c7aec73eda4131cd3ef695e03d131610d734a3abfb9073f"},{points:[[5.459,-3.0179],[53.1787,58.6321],[10.1791,-23.7994],[39.0296,-85.1922],[31.8472,110.8741]],hash:"afc9912f4a539425fb090b3cb4ee89af8927f1b22696cfe9ccbaf366ff61db19"},{points:[[4.0558,17.1557],[41.4759,62.1823],[35.6122,90.8085],[36.9017,132.8251],[30.8709,47.8341]],hash:"6ddbd599b3dd105e917996dba2b4f1a6e3c4c568e843ff5a3508a1f9ec0e56f9"},{points:[[54.4585,11.4131],[33.4596,-78.0387],[24.7191,-61.3869],[51.5689,-4.9461],[31.0223,145.3114]],hash:"ba088b0ef06684faccd946ba3351a01c2863bed52eaa8db77ced52521b62e65a"},{points:[[19.8871,-50.7798],[7.1282,107.3975],[41.1456,-87.6977],[52.1366,86.0042],[37.3094,-7.929]],hash:"f7f008b3613d662f1283d27f47c0d9190695b0f533e0a3a535f8e422d67a5aa1"},{points:[[40.9467,-78.0269],[37.6408,64.5443],[10.0248,-2.2023],[20.2739,25.3633],[26.4021,-33.1847]],hash:"b65d22cf82602dc28583c21caf9e6909befb83269d57fde5bc516ff01457784b"},{points:[[56.3865,.6975],[30.8709,47.8341],[18.5631,19.2933],[52.7298,-39.7147],[36.9017,132.8251]],hash:"e5e805b411066583d159ec0926f9f6d11d60a5c9c4b21c3d91f4a7123a0af92b"},{points:[[18.191,124.1161],[11.861,32.6943],[56.3003,21.7064],[34.615,151.8026],[21.6993,-8.9028]],hash:"194aa2c480b4a33bb3e7b207a019c8100f87174f12228608b4a711997369451a"},{points:[[35.6122,90.8085],[14.1684,-21.7701],[29.6806,112.5277],[52.0059,-83.3751],[7.4864,40.4675]],hash:"d6c52c9871140de2b48a78b61418f94cbc17c5e9fbf1ab6387648cabe28bc744"},{points:[[10.7483,-78.7878],[12.4228,109.8687],[47.7196,-85.2553],[22.6162,17.8949],[27.6981,22.4373]],hash:"683580ab00bfb16575b09f6ebdde1a4fc246b548a1c92a68509d4a5ad2e0bf3f"},{points:[[6.0763,-41.2843],[14.1684,-21.7701],[40.9467,-78.0269],[5.459,-3.0179],[26.0238,-32.1693]],hash:"b57ad0b5acf870632f2660181bc14ebcaa6cc995b50ee7c8eb3f84c251041416"},{points:[[26.4021,-33.1847],[31.8472,110.8741],[13.1803,58.5281],[34.615,151.8026],[48.9839,-104.574]],hash:"0ab436c4f6b482378d9841d3a55927e20985e50e508d92e7a6320651d13e7a42"},{points:[[6.0763,-41.2843],[27.5906,81.3611],[13.5328,-62.1142],[26.1962,-13.3959],[47.0044,22.944]],hash:"73c2850a0f1b2853b33b415c1007013ee5eba1a57b2afc5de44646b18d73e79f"},{points:[[35.7265,79.2414],[41.1456,-87.6977],[29.4965,85.2866],[22.6162,17.8949],[39.9186,165.4217]],hash:"1ea45c6e1a90b4851bff2e02966a18539850fc18f606c9bf0862ea474a06a7b0"},{points:[[3.7597,100.0442],[47.0044,22.944],[13.4225,36.3782],[35.7265,79.2414],[40.9594,156.3847]],hash:"29fa86cdf4548fe3431865ad9f6fcea701c2454d3264cd57435364223cb5d272"},{points:[[7.1282,107.3975],[13.4225,36.3782],[18.191,124.1161],[56.3865,.6975],[38.9799,-12.1692]],hash:"6c73b84a44613896ed813de7b719dcf7ebbdf6b44f80b81d060706a4679ef3b7"},{points:[[26.4021,-33.1847],[20.6307,.4236],[41.2428,116.7191],[34.1641,158.8395],[31.0223,145.3114]],hash:"bf0934ecb4fa48d373c17d3379c39998427de24505a742d4b15e6b5a92d0c341"},{points:[[12.4228,109.8687],[48.8083,-103.3525],[54.4585,11.4131],[47.0445,5.3387],[30.8709,47.8341]],hash:"2bb60c8b0e8835e24c029c269401c196e92165db3f2f12eb88a5cafdcd6994cd"},{points:[[36.9017,132.8251],[19.8871,-50.7798],[13.1803,58.5281],[47.7196,-85.2553],[41.3228,138.3305]],hash:"0f7e2c6557e621f6a5c49e9ee9e66452ca3472f87ebacaa0d299b335a28de4f7"},{points:[[43.2322,145.7939],[33.4596,-78.0387],[27.9592,112.9154],[48.9839,-104.574],[51.5689,-4.9461]],hash:"c2f565edd1295656a5f268738bef1b77a7abb0a442d2c02a0212bbc736a8667b"},{points:[[22.6162,17.8949],[47.0445,5.3387],[44.5508,143.3182],[48.8083,-103.3525],[35.6122,90.8085]],hash:"b3d6fb58f52ee32dd81bffd2eec1fd5cb19cefd4cc0ba0dae706ad759f81250d"},{points:[[30.8709,47.8341],[19.8871,-50.7798],[12.4228,109.8687],[31.8472,110.8741],[47.1796,84.961]],hash:"702d912a3a67c6bc1a4f539383c7e661fdad1eedb41194813ecb794681a358a2"},{points:[[35.6122,90.8085],[34.615,151.8026],[52.0059,-83.3751],[53.1787,58.6321],[29.6806,112.5277]],hash:"38affa676a4ce8f331c4e53fc3b3223471ff5df48f85c09852b5f47f4f980427"},{points:[[13.1803,58.5281],[21.6993,-8.9028],[21.204,61.7357],[56.3865,.6975],[41.1456,-87.6977]],hash:"774c87829247085919b1b83a9dc7aeaa2c6e78e57b772874764a93f223991283"},{points:[[41.3228,138.3305],[27.9592,112.9154],[48.8083,-103.3525],[24.1665,51.5626],[25.8916,23.3942]],hash:"3bf272ad46e3ff94c0ea58d21c8e4aef397fae6d52f6a3e4028e17110a94dbab"},{points:[[24.533,40.2711],[31.9566,70.7456],[42.5826,72.1096],[21.6993,-8.9028],[30.6483,76.4905]],hash:"22e77aa44e07034fff02e96d0d053c4d9cfe96cee53e10fd45ec520d63ede800"},{points:[[14.1684,-21.7701],[52.7298,-39.7147],[34.1641,158.8395],[26.4021,-33.1847],[7.1282,107.3975]],hash:"1dbd2c8c3ad58b602299ae686370cb08ea30cc2cb29532197e5d9069d9b31eed"},{points:[[10.1791,-23.7994],[40.5326,47.2158],[4.0558,17.1557],[24.1665,51.5626],[31.9566,70.7456]],hash:"86468531ca05cb9434c5dc5fb245e0f3f2d45c794c9b808d493777728340f4c3"},{points:[[10.0248,-2.2023],[27.9592,112.9154],[48.8083,-103.3525],[21.204,61.7357],[22.6162,17.8949]],hash:"9104f9e39a99e87a7fe13d7f82538037316be5f911f17b3cfed84e18f58250ed"},{points:[[12.4228,109.8687],[41.1456,-87.6977],[10.7483,-78.7878],[40.5326,47.2158],[18.5631,19.2933]],hash:"64e6bdb4a633be76446ba2ff04f3ee3e14fe40e4a4344a8369183c43a009cc95"},{points:[[21.181,-86.085],[18.5631,19.2933],[50.9811,-24.6377],[33.4596,-78.0387],[18.191,124.1161]],hash:"87d38c44b80123a1cdf165285c05a29fd0b0a2fd10ea3781d999a60a5b47517a"},{points:[[3.6808,79.7461],[5.459,-3.0179],[21.204,61.7357],[24.533,40.2711],[12.0013,27.8707]],hash:"397eaab109d474663eb7a5c034b227660deac5b85fa4a6b3a5b8d876d45b3dd8"},{points:[[56.3865,.6975],[27.4646,102.2729],[7.1282,107.3975],[22.6162,17.8949],[44.523,-113.975]],hash:"a3e24eb0c518de14df82df87afc817dcab6d470df9fccea4cd135203fc8bb42e"},{points:[[31.9566,70.7456],[27.5906,81.3611],[25.8916,23.3942],[7.4864,40.4675],[7.9664,3.7745]],hash:"6140d209654c6f17aa341ca72e26fb7506694e7345366e7dee9f164070447e52"},{points:[[40.9594,156.3847],[34.615,151.8026],[31.8472,110.8741],[35.6122,90.8085],[29.4965,85.2866]],hash:"3091070d58d10bf741522b24e58024c74946c876635968bde94f74456c978784"},{points:[[30.6483,76.4905],[53.1787,58.6321],[42.5826,72.1096],[7.4864,40.4675],[29.1973,127.3654]],hash:"52a20be2fd396dec2d15a93eb1479dc7b9ab699114add64aa35fe161a715627b"},{points:[[52.1366,86.0042],[44.5508,143.3182],[41.3228,138.3305],[34.615,151.8026],[56.3865,.6975]],hash:"6adef5e70d1a02d64341433da4570dd1d2bf933bb7494912d1a815039d806047"},{points:[[47.0445,5.3387],[52.1366,86.0042],[25.8916,23.3942],[36.5347,122.8518],[11.861,32.6943]],hash:"63d43ef0004813b07d367b3002503dfc56ee48611a161e8fb2c1191fde74377f"},{points:[[36.9017,132.8251],[13.4225,36.3782],[37.6408,64.5443],[11.861,32.6943],[52.0059,-83.3751]],hash:"1c42d1325c7fb157153f49550fcef1f08e26800169fb387b779420da6398da9d"},{points:[[31.8472,110.8741],[53.1787,58.6321],[29.1973,127.3654],[27.4646,102.2729],[18.191,124.1161]],hash:"098050af9fbaf8aeb75953d7ba76a6c058a2784627aa47845217f59a15ebbfb9"},{points:[[52.0059,-83.3751],[36.9017,132.8251],[10.0248,-2.2023],[3.7597,100.0442],[26.4021,-33.1847]],hash:"e20c0e6114f4003f7e66c62b665b5fcc7971d0db3e1fe23a929f5d7e9b022b77"},{points:[[27.4646,102.2729],[36.5347,122.8518],[47.7196,-85.2553],[35.7265,79.2414],[25.8916,23.3942]],hash:"05358006528917550a4bdd087aa21a56fe2472e0ff0e5eccecd063384fc66c28"},{points:[[5.459,-3.0179],[56.3865,.6975],[30.4574,150.0647],[28.1059,112.0864],[24.533,40.2711]],hash:"25f2d6d025d6e86efca402b1827925b6b7a8a90fbd4d16b8a3d21768a73b81a0"},{points:[[24.1665,51.5626],[7.3266,49.9125],[7.4864,40.4675],[3.6808,79.7461],[4.0558,17.1557]],hash:"85f0564f24b0257d1a607ec587588f6c3bbebc55eff4effad84818080483ecdf"},{points:[[42.5826,72.1096],[25.8916,23.3942],[20.2739,25.3633],[52.7298,-39.7147],[19.8871,-50.7798]],hash:"9c2d4b15e99f3ceb982349aed5267ec9c42f68c0eec30159f82db7a14abb47d5"},{points:[[42.5826,72.1096],[32.9613,-61.2046],[31.0223,145.3114],[41.4759,62.1823],[13.1803,58.5281]],hash:"817f1e64a1747c987e324284014a25f723f951795b8b52c33554916e0a972f3a"},{points:[[21.6993,-8.9028],[13.4225,36.3782],[30.4574,150.0647],[10.0227,-46.5964],[18.191,124.1161]],hash:"33e9277d44e815d300a4635471a040deb20e98757c7331784d3c73406816bc83"},{points:[[14.1684,-21.7701],[12.4228,109.8687],[47.7819,90.9181],[24.533,40.2711],[10.0248,-2.2023]],hash:"ef809df266bf5c6321efc7eb9363f0d1724575bc0628551adf1f29ed1f32166c"},{points:[[6.0763,-41.2843],[29.4965,85.2866],[27.5906,81.3611],[21.204,61.7357],[20.2739,25.3633]],hash:"bd87afa1550124c7a5ede1a281c9f3873b0ca368ecc7eb1021d5b9d84215863a"},{points:[[41.4759,62.1823],[26.4021,-33.1847],[31.9566,70.7456],[10.7483,-78.7878],[27.4646,102.2729]],hash:"dbf8985d549e60d8c19a63628c327bf29214caee040e30e43aaf433bfd9d3207"},{points:[[3.6808,79.7461],[34.615,151.8026],[33.4596,-78.0387],[35.6122,90.8085],[21.722,136.6048]],hash:"a68a5ba8248db0dd4623a314e840d4a27cd47806f9d3daa65d673184d737a5a3"},{points:[[21.181,-86.085],[7.3266,49.9125],[7.1282,107.3975],[20.6307,.4236],[13.1803,58.5281]],hash:"19cc588f11495e60b04a456e144334e6f5b90fe0a553c0194ffd05c3e476da82"},{points:[[3.7597,100.0442],[10.7483,-78.7878],[21.722,136.6048],[41.2428,116.7191],[13.1803,58.5281]],hash:"95d1b4ba7c6a92a8d5037f93c9770006e3588a2d78d7112946b9f9c7d0bdccec"},{points:[[41.4759,62.1823],[41.3862,118.2505],[36.9017,132.8251],[47.0445,5.3387],[47.1796,84.961]],hash:"60b08419baefc743a799cebc55d86e634db2271b6024af05d7ffa2bf802d1fc0"},{points:[[33.4596,-78.0387],[21.6993,-8.9028],[36.5347,122.8518],[10.7483,-78.7878],[29.4965,85.2866]],hash:"0f9263d4ce408b26cd93eae862bd946315ce8aa217f0364b6d31003f69142928"},{points:[[27.9592,112.9154],[36.5347,122.8518],[52.1366,86.0042],[26.4021,-33.1847],[35.6122,90.8085]],hash:"d2a6e3ce58ebd6cf1cc8a374b1b60861620f4e176f587a24526cfd929163c7f5"},{points:[[34.1641,158.8395],[13.1803,58.5281],[38.9799,-12.1692],[47.7819,90.9181],[27.9592,112.9154]],hash:"c88c9acfe4c37d955139c7fa3e071d7d4cb261a7d563966f9794d501581cd4d1"},{points:[[30.6483,76.4905],[6.0763,-41.2843],[29.1973,127.3654],[50.9811,-24.6377],[47.7196,-85.2553]],hash:"be61502bf1a7c10855c82beaced36fc86d99930df2f774d1cda5a69bfe214650"},{points:[[7.9664,3.7745],[28.1059,112.0864],[51.5689,-4.9461],[41.3228,138.3305],[36.5347,122.8518]],hash:"c434ac0a447f08bad58d914740a1dfadf4c6b6f71a6c9421556cf150ea96bc64"},{points:[[37.6408,64.5443],[40.9594,156.3847],[7.9664,3.7745],[48.9839,-104.574],[24.1665,51.5626]],hash:"2878c9cb3192863073677958e590993f2d7445176ee09b7c02cdbb598aa68ba9"},{points:[[42.5826,72.1096],[21.722,136.6048],[37.3094,-7.929],[50.9811,-24.6377],[52.1366,86.0042]],hash:"18859fd80dc0239773be961ea7869cb0d9f39251295f45f8a272cc9b86b135ca"},{points:[[27.9592,112.9154],[27.4646,102.2729],[25.8916,23.3942],[38.9799,-12.1692],[42.5826,72.1096]],hash:"2bf74d67edc40054903913e3bfaa5282f6fb074029fd94379d4b2574dfcc82b0"},{points:[[30.4574,150.0647],[13.1803,58.5281],[38.9799,-12.1692],[24.1665,51.5626],[52.0059,-83.3751]],hash:"613d0d40ecacf5b4adf8f626aa3c7be2abd5416499b68eb43788a629908f61c4"},{points:[[11.861,32.6943],[25.8916,23.3942],[31.8472,110.8741],[24.7191,-61.3869],[52.0059,-83.3751]],hash:"08addd94f497335c8da7650c576a440b8cd4b7e8ffce5649e79f3ec900a1f331"},{points:[[52.7298,-39.7147],[10.0227,-46.5964],[20.2739,25.3633],[5.459,-3.0179],[37.6408,64.5443]],hash:"a0444017af90609481ae2d09f4205e48a38aa92886607627eb950f6a1621bef0"},{points:[[34.615,151.8026],[18.5631,19.2933],[5.459,-3.0179],[29.1973,127.3654],[19.8871,-50.7798]],hash:"b88bd5fe95e9704f43f875062cb310366def2601678d64ff6840cab1034d2af3"},{points:[[5.459,-3.0179],[12.4228,109.8687],[26.0238,-32.1693],[26.1962,-13.3959],[41.3862,118.2505]],hash:"9e7cbb6337c0db451083e35eaa47c3c0bae6d5eeb74b2f47aa78527fa069e1cd"},{points:[[30.4574,150.0647],[27.9592,112.9154],[12.0013,27.8707],[31.8472,110.8741],[47.1796,84.961]],hash:"e9794582d76a4a555145c44deb5aae224c8e6627676a40f2436a19ae63d228d2"},{points:[[48.8083,-103.3525],[31.9566,70.7456],[24.475,31.4889],[35.7265,79.2414],[12.4228,109.8687]],hash:"96054882ad94755381182eaaedefe8295145826f7f69bcdea1ca22291656d8ce"},{points:[[24.7191,-61.3869],[30.4574,150.0647],[20.6307,.4236],[35.7265,79.2414],[13.1803,58.5281]],hash:"43a040b530e8e4c94b34cad82c509092cc0d24f574cd1512934fd792887c698c"},{points:[[24.475,31.4889],[5.459,-3.0179],[39.9186,165.4217],[29.6806,112.5277],[14.1684,-21.7701]],hash:"02d0bc50f42f1658b3b2a70f8247f2be8f58e69595d9930f89d3bc5c1a091c8a"},{points:[[21.6993,-8.9028],[24.533,40.2711],[35.6122,90.8085],[7.3266,49.9125],[51.5689,-4.9461]],hash:"31efad46ee989f307ba246802d18c44135ceeb337f0061daad7c7fc39cdbc5e5"},{points:[[5.459,-3.0179],[53.1787,58.6321],[52.7298,-39.7147],[26.0238,-32.1693],[35.6122,90.8085]],hash:"d94e55421ed4005d89cec2ec9b4c7594b367601d327da531ba7ea44d48221a20"},{points:[[7.1282,107.3975],[29.1973,127.3654],[11.861,32.6943],[6.0763,-41.2843],[27.9592,112.9154]],hash:"35031d76409348bafd21ee18f121e02fe90be0f440aac42303087582e10acca4"},{points:[[41.3228,138.3305],[18.191,124.1161],[52.7298,-39.7147],[52.0059,-83.3751],[21.722,136.6048]],hash:"d10face620f93cbd404358b19a59eb37a268008648fd0b5a40747b1871756159"},{points:[[19.8871,-50.7798],[10.1791,-23.7994],[47.0044,22.944],[47.7196,-85.2553],[18.5631,19.2933]],hash:"589b15404fead95beb75cfdf1e56a8310a935bdca075aa9bd42b4d9621d30b89"},{points:[[19.8871,-50.7798],[11.861,32.6943],[47.1796,84.961],[10.0227,-46.5964],[27.9592,112.9154]],hash:"de009a4bc7b76676f59ee701c66b56233fbe36574cc750bf1d9a2b7d3d71d07d"},{points:[[39.9186,165.4217],[30.8709,47.8341],[21.6993,-8.9028],[26.0238,-32.1693],[30.4574,150.0647]],hash:"651ff0cc52efca32e6e0a2b589bc44a024139fa5438c484f52a0e7b09559027d"},{points:[[7.1282,107.3975],[26.1962,-13.3959],[24.533,40.2711],[14.1684,-21.7701],[18.191,124.1161]],hash:"483b09f86acdcf202287292baafc53b57a4a8a1c02da7967fa626122b8700133"},{points:[[6.272,100.2631],[37.3094,-7.929],[50.9811,-24.6377],[3.7597,100.0442],[21.204,61.7357]],hash:"e56b228868a4adc681681fd1c0a637ca9d31c068e0e5f587f3ea404aa2c76d06"},{points:[[10.7483,-78.7878],[21.6993,-8.9028],[56.3003,21.7064],[30.6483,76.4905],[38.9799,-12.1692]],hash:"601b40328968d242af2092f16b2bf7b4cdd8ef8e7067920e07b83a7c48ae66d9"},{points:[[30.8709,47.8341],[26.1962,-13.3959],[24.1665,51.5626],[10.0227,-46.5964],[24.475,31.4889]],hash:"960d3a9e38688ac471ebf9594e097b3b0f6da132d3fd776e9ff221e51a91fde2"},{points:[[48.8083,-103.3525],[35.7265,79.2414],[27.4646,102.2729],[12.0013,27.8707],[53.1787,58.6321]],hash:"2e2c25bcefa6cb51d3012a048a459477fd5efa2ca4c7b4eab33bd3929e543dc9"},{points:[[34.1641,158.8395],[47.0445,5.3387],[41.1456,-87.6977],[40.9467,-78.0269],[49.4597,-112.5548]],hash:"232aea350fe3850fe8afcec4e4509a8dda35cb12ceeeb2ace856d060211b67e7"},{points:[[4.0558,17.1557],[6.0763,-41.2843],[41.4759,62.1823],[47.7196,-85.2553],[19.8871,-50.7798]],hash:"6159decbcd5999e75ac791bd38d396c1a6480a94aea7f9e87f0f63f92d0a9a50"},{points:[[24.1665,51.5626],[35.7265,79.2414],[41.1456,-87.6977],[31.9566,70.7456],[47.7196,-85.2553]],hash:"13c1778410a338ddd54a5360c3bf3ebcc4d50291cacb8cf3b5b3add80739f1a3"},{points:[[41.3228,138.3305],[48.8083,-103.3525],[31.8472,110.8741],[32.9613,-61.2046],[37.3094,-7.929]],hash:"17ebd0fb20817eeff8b482d329ab976e96085f83160a6d4d1979c75df5ecf9c7"},{points:[[21.722,136.6048],[18.5631,19.2933],[7.1282,107.3975],[48.8083,-103.3525],[27.9592,112.9154]],hash:"7847f6ea5808646b92d844f422b6492ddca16c60ace53d1519cc4af238a237b5"},{points:[[7.3266,49.9125],[39.9186,165.4217],[27.5906,81.3611],[48.8083,-103.3525],[30.8709,47.8341]],hash:"e55c5fabbec70ba6009327f5f7e8a05ce68691027636d0c4b51d8162a222b89e"},{points:[[32.9613,-61.2046],[7.1282,107.3975],[36.5347,122.8518],[41.4759,62.1823],[29.6806,112.5277]],hash:"0ef5903f1d99c610f7f2f4f6d0f7b17e3a3f9d5f4616c55897d51981c3128bec"},{points:[[5.459,-3.0179],[20.6307,.4236],[20.2739,25.3633],[24.1665,51.5626],[10.7483,-78.7878]],hash:"e2dacde11074e49cec34214f987696b3799e3042a0067b706b58077ea94286c4"},{points:[[5.459,-3.0179],[28.7959,65.2433],[24.7191,-61.3869],[22.6162,17.8949],[39.0296,-85.1922]],hash:"3be05b94d7f97c23a4d743f4df843c95adc64c11069eb3d41f78b34d90f2eb53"},{points:[[10.1791,-23.7994],[49.4597,-112.5548],[30.6483,76.4905],[18.5631,19.2933],[31.8472,110.8741]],hash:"3de756cc051e4ebad3a386e2a55989b87b55655997c9b2ed10bca25eae90a7fe"},{points:[[13.1803,58.5281],[7.3266,49.9125],[24.1665,51.5626],[31.8472,110.8741],[25.8916,23.3942]],hash:"c602aa607e69b2d423c17d0d91d3248bd71b3df25fcd7acb49dea5e7c1b27f68"},{points:[[36.9017,132.8251],[21.722,136.6048],[44.5508,143.3182],[47.0445,5.3387],[29.1973,127.3654]],hash:"68beb6cd28642b631f67fc018ca40a941c965d96f360095ee8c5bc4876a0fa04"},{points:[[44.523,-113.975],[53.1787,58.6321],[41.3228,138.3305],[13.9989,-79.5222],[10.0227,-46.5964]],hash:"3f0159b14c0073148711b0d018eacddbf7dc91686360a36ad037eb610c1b1d88"},{points:[[12.4228,109.8687],[31.9566,70.7456],[13.9989,-79.5222],[37.6408,64.5443],[30.8709,47.8341]],hash:"5f837be4d30f0914f418a83f76e12565cbb53ab372fb633c520781216d086047"},{points:[[52.0059,-83.3751],[26.0238,-32.1693],[10.7483,-78.7878],[54.4585,11.4131],[10.0227,-46.5964]],hash:"5fb70b4b8f6c1b42308ec0f2be27a84a652bf3ea22463a0aded0cb8401b0743f"},{points:[[27.5906,81.3611],[38.9055,-103.5088],[30.6483,76.4905],[24.533,40.2711],[21.204,61.7357]],hash:"43fd57b9e2bd9b8e0713f6382762acffbb3c32198a19421b0d8a40153fc0854f"},{points:[[10.1791,-23.7994],[47.7196,-85.2553],[13.1803,58.5281],[20.6307,.4236],[27.9592,112.9154]],hash:"b4f0e8684aae9ccd35dcae6ead481d9ad0150f90f6acbe21e03f077aeec6d8f2"},{points:[[30.8709,47.8341],[47.0044,22.944],[48.8083,-103.3525],[29.6806,112.5277],[3.7597,100.0442]],hash:"fbe11ab7caf56c99300e67d2ea78d9794c8a1731ca58add617cf6321b4ae8ca4"},{points:[[27.4646,102.2729],[56.3865,.6975],[26.0238,-32.1693],[3.7597,100.0442],[19.8871,-50.7798]],hash:"311dbb2152912be53815aef7e852d5ee5bf5df200cce38b555d58e8710952be8"},{points:[[31.0223,145.3114],[4.0558,17.1557],[44.523,-113.975],[37.6408,64.5443],[24.533,40.2711]],hash:"37ca7fecce54a1f507bda7e1e7ee62a126b61a6af7eb659686e657824579c86c"},{points:[[20.6307,.4236],[11.861,32.6943],[38.9055,-103.5088],[27.6981,22.4373],[27.9592,112.9154]],hash:"4f7bc42722e01037905c8e83fa1322233f170e023f38598fdeb8807b97ba383f"},{points:[[40.9467,-78.0269],[24.533,40.2711],[48.9839,-104.574],[13.1803,58.5281],[41.3862,118.2505]],hash:"2991bf7e733436dcd9004040ffb3e8f1a7af99518adfee99235903fe1f4fa8a3"},{points:[[13.5328,-62.1142],[24.7191,-61.3869],[7.1282,107.3975],[30.4574,150.0647],[26.0238,-32.1693]],hash:"9ecfdb4267486fc352ebc5d21b413444e49ed1d4e8e34bb0964f2b8e3fd870ee"},{points:[[47.7819,90.9181],[10.7483,-78.7878],[7.3266,49.9125],[52.1366,86.0042],[5.459,-3.0179]],hash:"0e240f612f313e03de883e9a1d8381439ec6525266db0a496fea54315f5805f9"},{points:[[20.2739,25.3633],[31.8472,110.8741],[39.0296,-85.1922],[30.4574,150.0647],[37.3094,-7.929]],hash:"328cd6b25e8331de168223275b361e49b6f308bf88ea9d2065d1eab5caf64311"},{points:[[7.9664,3.7745],[18.5631,19.2933],[10.0227,-46.5964],[13.5328,-62.1142],[40.9594,156.3847]],hash:"6778f87a8eeb45a8c9b56accd33af9b6d8a14f73773f2a0a7ee6cde26e9a3de5"},{points:[[7.4864,40.4675],[33.4596,-78.0387],[35.7265,79.2414],[10.0227,-46.5964],[30.6483,76.4905]],hash:"e1fea7b767609684df54d0173eed3230e537fafc81c5693a0485967bcae61cc3"},{points:[[35.6122,90.8085],[24.1665,51.5626],[18.191,124.1161],[33.4596,-78.0387],[10.7483,-78.7878]],hash:"4cea742cf249e5aafae364f4de1c4f8f915b2d6888ac3055241df4a5fab510d3"},{points:[[10.7483,-78.7878],[38.9799,-12.1692],[26.0238,-32.1693],[11.861,32.6943],[18.5631,19.2933]],hash:"e42b0544360408b89e5a7280c97f2914b8e4f1323748c10470b8216e90bc45f8"},{points:[[52.7298,-39.7147],[53.1787,58.6321],[21.181,-86.085],[12.4228,109.8687],[56.3865,.6975]],hash:"669672a4695254c08148d80c5e1907091178a7dd0e5cc570e7e5da5ad458ecf5"},{points:[[25.8916,23.3942],[32.9613,-61.2046],[34.615,151.8026],[19.8871,-50.7798],[27.4646,102.2729]],hash:"84eb129950158779f564dad4e0dc45b9ff412b4bf0666df4bf853b9b24649942"},{points:[[34.615,151.8026],[38.9055,-103.5088],[21.181,-86.085],[27.4646,102.2729],[41.4759,62.1823]],hash:"11b4b9628070ee2856b890007f67089f0ada53f0edb51de209a926c826ef4b65"},{points:[[18.191,124.1161],[10.1791,-23.7994],[54.4585,11.4131],[7.9664,3.7745],[27.5906,81.3611]],hash:"582aecad6d75e6e7b806137239daeccfbceb566ca7c1ba3df0233f84b508f7b2"},{points:[[47.7196,-85.2553],[20.6307,.4236],[10.0227,-46.5964],[42.5826,72.1096],[52.0059,-83.3751]],hash:"f3c44f44530da8aa447478bded09e76e687182b80b3669c927d3837fda7cc995"},{points:[[51.5689,-4.9461],[10.1791,-23.7994],[14.1684,-21.7701],[44.523,-113.975],[12.0013,27.8707]],hash:"231d1366d00116461e8c779c4d2697f9fbcecf5ea02e14c5250ecaf4700134ae"},{points:[[10.0248,-2.2023],[32.9613,-61.2046],[47.1796,84.961],[13.4225,36.3782],[49.4597,-112.5548]],hash:"14e652996455ac73ecb72f0136784b49989d62023bd555df144a571440d49d90"},{points:[[53.1787,58.6321],[34.615,151.8026],[47.0445,5.3387],[40.5326,47.2158],[19.1165,-1.557]],hash:"44220ce491db444e31ec562f53b88b1cb10e3201fc2018d4044f42f16d404a66"},{points:[[19.8871,-50.7798],[27.6981,22.4373],[5.459,-3.0179],[7.4864,40.4675],[37.6408,64.5443]],hash:"047b4dd922c356e5713e080cbac46f848440f467708433f5765aa81d455a7e29"},{points:[[3.7597,100.0442],[19.8871,-50.7798],[18.191,124.1161],[20.6307,.4236],[27.9592,112.9154]],hash:"5b38ced9d88a87c58789f4cc23e15b872cc20778d4841b1e9c72a9fcd09f9917"},{points:[[27.4646,102.2729],[20.6307,.4236],[25.8916,23.3942],[10.7483,-78.7878],[41.4759,62.1823]],hash:"e4e9d8f5fe123cac2e958acc9c43863c458ccf3a28a100cb1256d3ef7631699a"},{points:[[56.3003,21.7064],[38.9055,-103.5088],[41.2428,116.7191],[56.3865,.6975],[26.0238,-32.1693]],hash:"525b4f5cac165d42217ea164d36d13d547ec71643ec8b4ba3edd7981a2f456bf"},{points:[[50.9811,-24.6377],[52.1366,86.0042],[6.0763,-41.2843],[28.7959,65.2433],[24.533,40.2711]],hash:"4fb80b19cac02d14e5efb8ae83d3d7da584c19c0afc16c1d5d5944785ebce3e9"},{points:[[35.6122,90.8085],[20.6307,.4236],[41.2428,116.7191],[21.6993,-8.9028],[21.722,136.6048]],hash:"8bb6015d06bbc1ad20288a4ae690cc45910c8a6cee95ef1c00028384c84ca1d5"},{points:[[10.0227,-46.5964],[43.2322,145.7939],[27.4646,102.2729],[28.7959,65.2433],[50.9811,-24.6377]],hash:"481b99f09790afd6ba4284e72e536e0559770eea4180932384a3c0add3264752"},{points:[[30.4574,150.0647],[27.6981,22.4373],[39.0296,-85.1922],[36.5347,122.8518],[31.9566,70.7456]],hash:"d4c65d24a50f273a4a449977fcc5c4dd07eadf1695c8375786f0343a268d8daf"},{points:[[12.0013,27.8707],[41.3862,118.2505],[32.9613,-61.2046],[54.4585,11.4131],[39.0296,-85.1922]],hash:"c4752b49b54e7d35744f4a428782b7ced446f999b47c0dfd5428a1399225d6f7"},{points:[[19.1165,-1.557],[37.6408,64.5443],[27.4646,102.2729],[48.8083,-103.3525],[24.1665,51.5626]],hash:"5cfa56258eb8e308d42e8447cec745258fcf6c31b1c728f9e33e27aff9d39750"},{points:[[52.1366,86.0042],[29.4965,85.2866],[27.6981,22.4373],[4.0558,17.1557],[14.1684,-21.7701]],hash:"62b87db6e15b41ba7a590dd96131e0f22dc164bcee1ede54e2733c23be455d67"},{points:[[5.459,-3.0179],[12.9435,-10.5061],[41.4759,62.1823],[18.5631,19.2933],[36.5347,122.8518]],hash:"9f668cc91569a45e5ffd54e399101ade8a2fe01ad93c1716fb6ae6ec65a3ef7c"},{points:[[34.1641,158.8395],[12.0013,27.8707],[48.8083,-103.3525],[21.6993,-8.9028],[10.7483,-78.7878]],hash:"4405480677e5387fe9e1a38c5797d8e7860697325c0290d51cf4d0be45ce93cb"},{points:[[7.4864,40.4675],[43.2322,145.7939],[52.1366,86.0042],[12.0013,27.8707],[27.6981,22.4373]],hash:"5cf6e672ba2457d4770faa559f4469092718544de3dec8ccf5b50fa4483df0a4"},{points:[[10.1791,-23.7994],[13.9989,-79.5222],[18.5631,19.2933],[14.1684,-21.7701],[38.9799,-12.1692]],hash:"22a2bc7794d5f1f03a70605cd91e5467e3ef315c5ca7392537a3676e11c2b685"},{points:[[24.533,40.2711],[56.3003,21.7064],[3.6808,79.7461],[40.5326,47.2158],[28.7959,65.2433]],hash:"d1bc7e945178b23cd18b4a76e410b91d4df5f622fa0436066ef982834dc98b8c"},{points:[[7.4864,40.4675],[44.5508,143.3182],[52.7298,-39.7147],[52.0059,-83.3751],[50.9811,-24.6377]],hash:"add2a1da3ddd4a4b29b6b3a46d037fe1e607a7626e5fae4020d7e029f8347874"},{points:[[7.4864,40.4675],[34.615,151.8026],[36.9017,132.8251],[41.4759,62.1823],[19.1165,-1.557]],hash:"ab1e61931dfdc332344dd1205226642da7122205d22e791b6dffcac2d4216de9"},{points:[[7.1282,107.3975],[7.9664,3.7745],[32.9613,-61.2046],[24.1665,51.5626],[7.4864,40.4675]],hash:"7e6e64200290f31b66438658dd3d2a17000cad9965a6a5aac14a2d28a1b343f4"},{points:[[30.6483,76.4905],[19.8871,-50.7798],[20.2739,25.3633],[38.9799,-12.1692],[26.0238,-32.1693]],hash:"187b5c1d151d073891af4918d4611cfdc5330557ee5b12721e94066de7e88f43"},{points:[[52.7298,-39.7147],[35.7265,79.2414],[27.6981,22.4373],[48.9839,-104.574],[33.4596,-78.0387]],hash:"d8128a5f5f8c3b64c49fc7804d13b970dbadb22d9a23458acccadc668ed4a609"},{points:[[41.1456,-87.6977],[24.475,31.4889],[51.5689,-4.9461],[48.9839,-104.574],[13.1803,58.5281]],hash:"783ad98f57a7bf2720ea327fa455e2a5f2d6e3b903a0209da09f259fcb8dbffb"},{points:[[18.191,124.1161],[20.2739,25.3633],[43.2322,145.7939],[3.7597,100.0442],[33.4596,-78.0387]],hash:"26ee98b7494cb4982d1708d2a0ff5dfe834b2c526b738fd7f231a9085f669e59"},{points:[[47.0044,22.944],[31.0223,145.3114],[24.475,31.4889],[13.5328,-62.1142],[49.4597,-112.5548]],hash:"3b45e2bf2e3d25f65fdde07467842926b5d283cd29d2900d56d4af5d1cefbc1c"},{points:[[10.0227,-46.5964],[22.6162,17.8949],[18.5631,19.2933],[27.6981,22.4373],[24.7191,-61.3869]],hash:"7a366f02f5a519acf8fe5d71d0e18d5774d9f0be11ba28cbd34730d7a0b755b6"},{points:[[44.5508,143.3182],[40.9594,156.3847],[19.8871,-50.7798],[12.0013,27.8707],[56.3003,21.7064]],hash:"5e88ec04454bb618e63c9580df17f8b62f61218f528c6615794d881aa23c9ac2"},{points:[[13.1803,58.5281],[24.7191,-61.3869],[35.6122,90.8085],[47.7196,-85.2553],[21.204,61.7357]],hash:"df8185d234ae41de904354ab82d20af87bf8adaa80b9760dec89734ecb9ba9dc"},{points:[[19.8871,-50.7798],[47.7819,90.9181],[50.9811,-24.6377],[13.1803,58.5281],[39.0296,-85.1922]],hash:"3d9bf52f841c80bdb9589a1c33e5cd359fc7937cc4040dca35ff3e851d81ca68"},{points:[[24.1665,51.5626],[27.6981,22.4373],[28.1059,112.0864],[56.3865,.6975],[49.4597,-112.5548]],hash:"c607f8359983d9defe1cf73e2a1cc8fea420c9090ffbde71593b1eab2107e0de"},{points:[[31.8472,110.8741],[13.1803,58.5281],[30.8709,47.8341],[41.1456,-87.6977],[50.9811,-24.6377]],hash:"5c838bd231e0e9e730066dd8ebaf03240b6637150dc125ac80cc9420f0546755"},{points:[[7.3266,49.9125],[7.1282,107.3975],[24.7191,-61.3869],[32.9613,-61.2046],[12.0013,27.8707]],hash:"2c8f71c3c61a5b8d69cc1f5a962b56fb4bbd9554d02d5ac205f68d9e466c94ce"},{points:[[13.9989,-79.5222],[47.7819,90.9181],[13.4225,36.3782],[11.861,32.6943],[30.6483,76.4905]],hash:"ef0a7240120638af01aa2d3f6e3319bd9849073763334b6b774c1f343e25acd3"},{points:[[26.1962,-13.3959],[40.9594,156.3847],[29.4965,85.2866],[20.2739,25.3633],[48.9839,-104.574]],hash:"d7a4f926df0e0ed07e713e10d9a342ccfa9b7d2b56e7aac50e732542f91bb3c1"},{points:[[27.6981,22.4373],[10.1791,-23.7994],[26.0238,-32.1693],[35.6122,90.8085],[29.6806,112.5277]],hash:"f71f20b8a4393b9570378d2f5bba8632f0636fcd4e3680f2ae9d49f90772c9f2"},{points:[[18.191,124.1161],[29.6806,112.5277],[21.6993,-8.9028],[41.3862,118.2505],[24.475,31.4889]],hash:"021d04112acfd231645564cf437aee4fa605db0c4c3873f80cb2cd47a9325c61"},{points:[[47.1796,84.961],[50.9811,-24.6377],[39.0296,-85.1922],[33.4596,-78.0387],[19.1165,-1.557]],hash:"5c21eb8cbf2be95ab71a553cafc161714ec64bc42fc426395ee4a71ff36555eb"},{points:[[27.6981,22.4373],[10.0248,-2.2023],[25.8916,23.3942],[26.0238,-32.1693],[52.7298,-39.7147]],hash:"2fd7a8a8878405031c0537683d0c28ca476a655f18082346fb4867b3753290a8"},{points:[[43.2322,145.7939],[24.1665,51.5626],[10.0248,-2.2023],[48.8083,-103.3525],[27.6981,22.4373]],hash:"114b16b9b05f4f6bd9072e87163e36b80c6e4941ffe229cd8b9117fb57dfbd26"},{points:[[30.8709,47.8341],[21.722,136.6048],[47.0044,22.944],[7.3266,49.9125],[31.9566,70.7456]],hash:"b94ba58c9440eb30160d3241ffae04371376ba955549cccfebc5f998a959e52f"},{points:[[10.7483,-78.7878],[43.2322,145.7939],[52.1366,86.0042],[44.5508,143.3182],[44.523,-113.975]],hash:"cb98ddf4edf3b8da981c035f0944df5c57c87cf7fb64ae4099ab9fcbbc8620ff"},{points:[[41.3228,138.3305],[29.1973,127.3654],[10.1791,-23.7994],[29.4965,85.2866],[34.615,151.8026]],hash:"f9c9896c390c9ad87363856cf776c762d71296c060a9992db9d590d3708341cb"},{points:[[14.1684,-21.7701],[27.9592,112.9154],[27.6981,22.4373],[31.9566,70.7456],[51.5689,-4.9461]],hash:"cfdf374e199906984abf7ddc65bd705f65299bef9c8426e1dc7e3fc353620ddb"},{points:[[10.0227,-46.5964],[37.3094,-7.929],[52.7298,-39.7147],[21.204,61.7357],[10.1791,-23.7994]],hash:"4cc7a9bbf02caf94c39a1f1a65a325fbb5cf740bd420d3ba40aee6bfcc5d8b3b"},{points:[[41.4759,62.1823],[44.5508,143.3182],[42.5826,72.1096],[13.5328,-62.1142],[29.6806,112.5277]],hash:"0bb830f044e7570a03b94dc0b32765894b7310d27da414e9edf564134b273183"},{points:[[44.5508,143.3182],[52.7298,-39.7147],[25.8916,23.3942],[41.3862,118.2505],[39.9186,165.4217]],hash:"a5d5d2b12f485ee7e5ea15b60cee96f0a19396cfcfbf1d3ba86f24b698ad2478"},{points:[[34.1641,158.8395],[37.3094,-7.929],[29.1973,127.3654],[27.6981,22.4373],[39.9186,165.4217]],hash:"3bc443367187b283258a52446a3592501a8ec35d06e7a51a7ff6846f888abdb7"},{points:[[10.0227,-46.5964],[24.1665,51.5626],[52.7298,-39.7147],[30.8709,47.8341],[38.9055,-103.5088]],hash:"9286a28bea031bba7275f01866dd9e17d3e7baa7bbdf826aaed262b79e155ac6"},{points:[[10.0227,-46.5964],[22.6162,17.8949],[31.9566,70.7456],[47.7196,-85.2553],[54.4585,11.4131]],hash:"85edf5469d3bf17d339fa5c960fe916f83813b5135750fc1b8903ced42c46cce"},{points:[[27.9592,112.9154],[53.1787,58.6321],[30.6483,76.4905],[56.3865,.6975],[49.4597,-112.5548]],hash:"4c448e0178efc5e1d77346d4174445c6b44624558656d79c507771799742d1ac"},{points:[[20.2739,25.3633],[47.1796,84.961],[36.5347,122.8518],[27.4646,102.2729],[24.533,40.2711]],hash:"b99f2a4e06cefce0a1a37f9bd62c2086e5f548c44e58d02406d7a940f4be4cb6"},{points:[[21.181,-86.085],[25.8916,23.3942],[43.2322,145.7939],[47.0445,5.3387],[32.9613,-61.2046]],hash:"ab86d365308dd58e66cd75649e4d02650e8d85bdcf7cedfac87731b92479e5a3"},{points:[[7.1282,107.3975],[32.9613,-61.2046],[54.4585,11.4131],[27.9592,112.9154],[7.9664,3.7745]],hash:"969aea901c5aea938f4378df36763b02d31a796fffbd67b971895c3783e83fc5"},{points:[[18.5631,19.2933],[41.3862,118.2505],[7.3266,49.9125],[56.3003,21.7064],[24.533,40.2711]],hash:"3ed7e44096ed92e995943abc62947d9562410ce86f84424eef252f29ee591c2a"},{points:[[10.0227,-46.5964],[38.9055,-103.5088],[47.0044,22.944],[56.3003,21.7064],[10.0248,-2.2023]],hash:"f669d2a0b2601f4c496196f1b92651812094e305734b2f437d503db260120ff3"},{points:[[44.5508,143.3182],[39.9186,165.4217],[18.191,124.1161],[39.0296,-85.1922],[47.7819,90.9181]],hash:"3a2fd6576d480a09efd85f32e368c6700debe5c80954d7912e3b0f625662c6c5"},{points:[[7.4864,40.4675],[32.9613,-61.2046],[7.9664,3.7745],[24.1665,51.5626],[47.7819,90.9181]],hash:"2ae0c71a9f1f4ef0d003fa65f04f4db0b4bed3f293635cf1523e305a6aa86d78"},{points:[[18.191,124.1161],[13.4225,36.3782],[24.1665,51.5626],[29.1973,127.3654],[36.5347,122.8518]],hash:"3d73a37d0d09efaa16c134414511de3a644cc62edaa92a62823bf3bb68d21bc7"},{points:[[37.6408,64.5443],[20.2739,25.3633],[21.204,61.7357],[39.9186,165.4217],[47.0445,5.3387]],hash:"002c139bd9a21f4a54325add52f3800ec60afb3168253aebb71b351581897bac"},{points:[[10.0227,-46.5964],[42.5826,72.1096],[21.6993,-8.9028],[39.0296,-85.1922],[30.4574,150.0647]],hash:"f2495a821037f17f82a1390fb5ae9beda7d0b03c7b1960bebee1bfb44d1ae105"},{points:[[27.6981,22.4373],[36.5347,122.8518],[26.1962,-13.3959],[30.6483,76.4905],[12.0013,27.8707]],hash:"61886dcc90da078b5c92b72d768e20228877febad89b4be07b08e1d7575a7f3e"},{points:[[19.8871,-50.7798],[10.7483,-78.7878],[27.9592,112.9154],[13.4225,36.3782],[44.523,-113.975]],hash:"3b61d360e944bc591f97c4d4fdfa03a696294e99b32e460524a81e1610cea768"},{points:[[52.7298,-39.7147],[37.6408,64.5443],[50.9811,-24.6377],[22.6162,17.8949],[19.8871,-50.7798]],hash:"1b02853a61a444bd663e86a2014a5af26ddee670198e4d7ea9345edf33e1584f"},{points:[[13.4225,36.3782],[24.475,31.4889],[31.0223,145.3114],[35.7265,79.2414],[47.0445,5.3387]],hash:"52bff915ed50307e250f0f781614844513a328f251dae5b42fbe0d5d63afc8a2"},{points:[[12.0013,27.8707],[24.1665,51.5626],[18.5631,19.2933],[27.6981,22.4373],[41.2428,116.7191]],hash:"9470d5a4196b052d8a2944ecce3dc5ac4527a6df8909cd92bc74fc8cce167d5c"},{points:[[24.7191,-61.3869],[14.1684,-21.7701],[28.1059,112.0864],[19.1165,-1.557],[21.181,-86.085]],hash:"b211ae82640b12f078b9286cc308f76ea6c207c8c001ca5906d9a51d9b15053e"},{points:[[11.861,32.6943],[25.8916,23.3942],[26.0238,-32.1693],[43.2322,145.7939],[26.4021,-33.1847]],hash:"af4b667570425ef24c45f2227b2b569906bc1233de4939f7c33e3097e52ac9e2"},{points:[[12.9435,-10.5061],[25.8916,23.3942],[31.8472,110.8741],[47.1796,84.961],[47.7819,90.9181]],hash:"23ee024f76ce669614988a42b996311695a5461bf22ed1119fc3a319d9dc0b4a"},{points:[[3.6808,79.7461],[11.861,32.6943],[20.2739,25.3633],[52.0059,-83.3751],[30.4574,150.0647]],hash:"937f7747d03aa506747131010f3a12bbff50b3f86719d5e91f2ea7ed9200721c"},{points:[[41.3862,118.2505],[5.459,-3.0179],[7.3266,49.9125],[29.6806,112.5277],[35.6122,90.8085]],hash:"6459cabe3ee40ba6ded5ba1b8953bddbda75e6dd31584a791e78779c5181dccd"},{points:[[47.1796,84.961],[26.4021,-33.1847],[10.7483,-78.7878],[48.9839,-104.574],[20.6307,.4236]],hash:"0ac98ac0ffb757db7c56e55e14902565663959e11ff6d5a46bbaacbd30cbcc9e"},{points:[[48.8083,-103.3525],[21.722,136.6048],[7.3266,49.9125],[20.2739,25.3633],[22.6162,17.8949]],hash:"13898ffb61a2b4c2ec04f6ae158c6437f7cc78bfba2088347ea5f2a1f4973ef0"},{points:[[26.0238,-32.1693],[25.8916,23.3942],[26.4021,-33.1847],[44.523,-113.975],[41.3228,138.3305]],hash:"7a00da914ea04418e2004c411a087f61de5ffc628d8fcf75a2f212e070fc25f9"},{points:[[29.4965,85.2866],[25.8916,23.3942],[4.0558,17.1557],[7.1282,107.3975],[21.181,-86.085]],hash:"473a1600b024bfc942f31bc0d23b97beb13adfed66c8aea7f812566f139ced81"},{points:[[53.1787,58.6321],[30.8709,47.8341],[11.861,32.6943],[12.4228,109.8687],[7.9664,3.7745]],hash:"7b4947e9870e35af108efa22f9c0936d4cdb7d9b8f8d20066f43cac87f127d97"},{points:[[41.3862,118.2505],[48.9839,-104.574],[56.3003,21.7064],[47.0044,22.944],[6.272,100.2631]],hash:"491dff29b6721d9198576f57d45feb026318a0dee344c47826b3b34faf2afde7"},{points:[[21.181,-86.085],[41.2428,116.7191],[52.0059,-83.3751],[26.1962,-13.3959],[19.1165,-1.557]],hash:"a77ff83ccf6fe08981fbc8e1888cb9ee94a5ffac2ae8aa4588186c5dcc2c16ce"},{points:[[41.4759,62.1823],[10.0248,-2.2023],[7.4864,40.4675],[27.5906,81.3611],[44.5508,143.3182]],hash:"40baec44de2ac3eec34e594b8e964d272f6d65912817949d9ec4814fce9a7c17"},{points:[[52.7298,-39.7147],[31.9566,70.7456],[3.6808,79.7461],[24.533,40.2711],[26.1962,-13.3959]],hash:"a697ff2dc9d871870a3e615543dac9efc772960da1d04664b7a9a8e455cade2c"},{points:[[41.2428,116.7191],[47.1796,84.961],[47.7196,-85.2553],[24.475,31.4889],[56.3003,21.7064]],hash:"ceafe34f5eed51484d54af87295f11283809da08bd27e2e8265abfd57de0c966"},{points:[[26.0238,-32.1693],[32.9613,-61.2046],[36.9017,132.8251],[25.8916,23.3942],[31.0223,145.3114]],hash:"b84d864ad7617fbf1161ec7472ae000328eff4764fa9690a55a768a00412698e"},{points:[[27.4646,102.2729],[12.4228,109.8687],[24.7191,-61.3869],[26.0238,-32.1693],[20.2739,25.3633]],hash:"0ae7297783543d572cb254768022f69bc9b3e2d6d684cf8e06627e5f5afdfd66"},{points:[[48.9839,-104.574],[26.0238,-32.1693],[26.4021,-33.1847],[5.459,-3.0179],[49.4597,-112.5548]],hash:"52a0b4cf66be27ec32ae84d5458d06b4fd097918ba5355e11717a5fbb361ed2e"},{points:[[7.4864,40.4675],[13.1803,58.5281],[7.1282,107.3975],[41.2428,116.7191],[48.8083,-103.3525]],hash:"f835a84e540e9b904ef0e87fab848769e3de6093b90b7beeed700331353b12cd"},{points:[[41.2428,116.7191],[56.3003,21.7064],[10.0248,-2.2023],[29.6806,112.5277],[34.1641,158.8395]],hash:"077e591c8ac17dbca348015a5d60f3708f49f05607f58074b210a5f42eb388cb"},{points:[[18.5631,19.2933],[24.475,31.4889],[36.9017,132.8251],[10.1791,-23.7994],[11.861,32.6943]],hash:"360d2929a0e8d5440ed0b23c7e5026f0e17f7e1c89d2c1fb1354a288baccf008"},{points:[[48.8083,-103.3525],[29.6806,112.5277],[56.3865,.6975],[4.0558,17.1557],[38.9055,-103.5088]],hash:"9b1cbb1d5e2cefe91e22fa928e2aafe5d4c2d6aeb222186265bb5255a860e9bb"},{points:[[49.4597,-112.5548],[56.3865,.6975],[31.9566,70.7456],[6.0763,-41.2843],[50.9811,-24.6377]],hash:"d8d378248669997e43ed282fe42eecc3574ae262d2e4af93a64f822c2397b188"},{points:[[38.9055,-103.5088],[43.2322,145.7939],[10.7483,-78.7878],[53.1787,58.6321],[21.6993,-8.9028]],hash:"2b46965aa809a5cc313c45eabb08c134184e518ad2266ae191f26259b45b191f"},{points:[[10.7483,-78.7878],[4.0558,17.1557],[38.9055,-103.5088],[12.4228,109.8687],[52.7298,-39.7147]],hash:"5bf2e287e5db9e200564c5f5b6e56cd7e67416f24f86ce685e0bfc9d7c9746ae"},{points:[[40.5326,47.2158],[24.533,40.2711],[40.9467,-78.0269],[27.4646,102.2729],[19.1165,-1.557]],hash:"5ce9c9ca648e72ab13728f94543c823e5c32eb429e924d622f29caae574dceab"},{points:[[33.4596,-78.0387],[10.0227,-46.5964],[4.0558,17.1557],[37.3094,-7.929],[34.1641,158.8395]],hash:"3a19894c50b29e47e677e77d1e651e0d525cd6fd74acc293e7a532866fc6fbf8"},{points:[[42.5826,72.1096],[41.4759,62.1823],[27.5906,81.3611],[48.9839,-104.574],[36.9017,132.8251]],hash:"3d5104925673c43bf026c30d84338fa9c9521ac9f3c37bf0dec5103769efb6ca"},{points:[[51.5689,-4.9461],[38.9055,-103.5088],[39.9186,165.4217],[47.7196,-85.2553],[36.9017,132.8251]],hash:"7129e2fafc7adc233d034fa8c1cff367316011ffc42998973b16383daa98f65e"},{points:[[14.1684,-21.7701],[33.4596,-78.0387],[42.5826,72.1096],[40.9594,156.3847],[6.0763,-41.2843]],hash:"2c94423b3b73313fcc7d5630307ea1328f8a60155b363813759703e3f40b5a2c"},{points:[[7.3266,49.9125],[35.7265,79.2414],[47.7196,-85.2553],[27.9592,112.9154],[28.7959,65.2433]],hash:"658ff55a9a162f06fb37208e66d1caa857f8155481b0a136f9ca36247e026bac"},{points:[[18.191,124.1161],[49.4597,-112.5548],[11.861,32.6943],[29.6806,112.5277],[52.1366,86.0042]],hash:"15ed8e6ef98b4069d3cfd45ee3ce005a7b69a8a007167293df80b931b971c027"},{points:[[10.1791,-23.7994],[28.7959,65.2433],[13.4225,36.3782],[41.1456,-87.6977],[24.475,31.4889]],hash:"7b567eebccd76b2c271b0ad751774dd2191c036acd95e1d298fa175721da9dc6"},{points:[[10.0227,-46.5964],[35.6122,90.8085],[40.9594,156.3847],[39.0296,-85.1922],[20.2739,25.3633]],hash:"0835d35a36187531049acbe30cf6bd68aecbe4702644e87af5392b8e7461cf41"},{points:[[27.6981,22.4373],[28.7959,65.2433],[52.1366,86.0042],[43.2322,145.7939],[31.9566,70.7456]],hash:"518dca251ceed33d2123c195fdf8358d64c5bd61697eca8632df7d2979793989"},{points:[[11.861,32.6943],[10.0248,-2.2023],[31.8472,110.8741],[53.1787,58.6321],[21.6993,-8.9028]],hash:"7c945ad854a202209190fc686ffc1b28e3166e11eb1b28f02ea964652dec46b1"},{points:[[19.1165,-1.557],[34.1641,158.8395],[40.9467,-78.0269],[12.0013,27.8707],[30.8709,47.8341]],hash:"741d791c870fb44ea7b1a7062b9c3c2bf40e3a6b1feaaab71906dec00d2d0d6a"},{points:[[10.0248,-2.2023],[35.6122,90.8085],[27.5906,81.3611],[27.9592,112.9154],[10.1791,-23.7994]],hash:"1f19a1d28444efe6230a972235a99a6ac53d8c50d04c5aaae970de10ccb6b71a"},{points:[[30.8709,47.8341],[41.4759,62.1823],[40.5326,47.2158],[24.533,40.2711],[22.6162,17.8949]],hash:"3618fb9a00646dfa684120890433b4112863a7eabee78de8c171c0aadfe67f67"},{points:[[18.5631,19.2933],[27.9592,112.9154],[47.7819,90.9181],[56.3865,.6975],[30.8709,47.8341]],hash:"046b22ca6c1e5f7b10ed534ad30e8d96cb92a8592509a4de796834810f8eee14"},{points:[[26.1962,-13.3959],[52.0059,-83.3751],[31.8472,110.8741],[54.4585,11.4131],[52.1366,86.0042]],hash:"ed1af08f718166f1253b29f48f5477d772ca547f0254dc0a2725c0be45647f23"},{points:[[35.6122,90.8085],[10.1791,-23.7994],[30.6483,76.4905],[13.9989,-79.5222],[49.4597,-112.5548]],hash:"9cb6a8edaa571a363822d3ac745c98e6681998ec1b65dc6dcecd23674d0dd454"},{points:[[47.7196,-85.2553],[12.4228,109.8687],[26.4021,-33.1847],[40.9594,156.3847],[4.0558,17.1557]],hash:"beeca910ede18e30659f446245ffa218900823603c596174c40fc89dd82d57f5"},{points:[[4.0558,17.1557],[3.6808,79.7461],[20.2739,25.3633],[18.191,124.1161],[37.6408,64.5443]],hash:"7e0246634be0b36c7659f3fd1a93c34490c80f8940dfffb42f80a7ef90b68eb6"},{points:[[51.5689,-4.9461],[5.459,-3.0179],[48.9839,-104.574],[6.0763,-41.2843],[12.4228,109.8687]],hash:"74f9fa64a3dc937a45b90c6132fe4c3b20e650c872de05081313d2a2c10465e3"},{points:[[52.1366,86.0042],[30.4574,150.0647],[24.533,40.2711],[30.6483,76.4905],[38.9799,-12.1692]],hash:"c0d13a87ad83a70a84f3a9ab8e4697cacbb82e39a584716552e8e6d828bcc1f4"},{points:[[47.7196,-85.2553],[7.4864,40.4675],[39.9186,165.4217],[22.6162,17.8949],[34.1641,158.8395]],hash:"20c2f07e569f78242471b8dfc88847489fc81140c963c47ab28beae8bb1df4c5"},{points:[[47.0445,5.3387],[47.0044,22.944],[32.9613,-61.2046],[25.8916,23.3942],[3.7597,100.0442]],hash:"2f5f0723d536aceb63406409ae439806257cf092a0e064848a555a4a6e365e8e"},{points:[[28.7959,65.2433],[21.204,61.7357],[19.1165,-1.557],[52.0059,-83.3751],[25.8916,23.3942]],hash:"42406574e90f6ea52d44adff257afd49a05b55b4867ff30ebdc42099c9ec4f03"},{points:[[24.475,31.4889],[30.6483,76.4905],[38.9799,-12.1692],[7.4864,40.4675],[56.3865,.6975]],hash:"8db45768ca48a39d6f59d28fb799b8a2776158ff343e963f6aa34643932b140d"},{points:[[6.272,100.2631],[29.1973,127.3654],[7.9664,3.7745],[56.3003,21.7064],[27.6981,22.4373]],hash:"d7f2c5a05dfb3cef742def30e574b61b28e6a1497981031b6ad98ac7d625fb00"},{points:[[50.9811,-24.6377],[44.5508,143.3182],[41.4759,62.1823],[34.615,151.8026],[40.9594,156.3847]],hash:"dc5212eb91744bed87c110bac1a4b5c9b0a62275b98b2e78d4dad825b5b5ed31"},{points:[[41.2428,116.7191],[30.6483,76.4905],[5.459,-3.0179],[54.4585,11.4131],[44.523,-113.975]],hash:"c846ae05ee6dd7731c6b1fc2d2ad73dd4c43b6c43afe4f78c10d9d598e32b1ba"},{points:[[30.6483,76.4905],[37.6408,64.5443],[44.5508,143.3182],[6.272,100.2631],[29.6806,112.5277]],hash:"b7681ef807245c3172f8539df30501c5137c6cee3eb852f3afa51eaf7a0a5400"},{points:[[10.0248,-2.2023],[21.204,61.7357],[41.1456,-87.6977],[7.4864,40.4675],[40.5326,47.2158]],hash:"f92aa0aea5c4cce4c69738d77bf6e795e584829603bc7101aa67c85289dd6aa8"},{points:[[19.8871,-50.7798],[7.3266,49.9125],[52.7298,-39.7147],[42.5826,72.1096],[56.3003,21.7064]],hash:"637c5c6516153ab284d1af06bced662d2df47d183edec39e7c0c60d2d586bd1f"},{points:[[41.3228,138.3305],[33.4596,-78.0387],[56.3865,.6975],[52.0059,-83.3751],[42.5826,72.1096]],hash:"9e04ee79e067dc80efea2478965d98535861fea8c0324e7c6077a0296e395ac8"},{points:[[47.7196,-85.2553],[51.5689,-4.9461],[13.9989,-79.5222],[10.1791,-23.7994],[20.6307,.4236]],hash:"d69736d0169caa0982dcd50c046a722b296e3f5486660fc2a829ce06a349eecc"},{points:[[7.1282,107.3975],[41.1456,-87.6977],[44.5508,143.3182],[18.191,124.1161],[37.6408,64.5443]],hash:"cd79738ec91d768a937aa0b477244a20ea2c2ee24c928c0237075010cd9a9817"},{points:[[30.6483,76.4905],[13.4225,36.3782],[43.2322,145.7939],[39.9186,165.4217],[39.0296,-85.1922]],hash:"be46f5928e23874b83e08adf9368bde96da560cf9c6fecb88f1d374aadad7977"},{points:[[37.3094,-7.929],[10.7483,-78.7878],[47.7819,90.9181],[42.5826,72.1096],[28.7959,65.2433]],hash:"792cd00f3c52cca430a94337b37956b14f090443682bec7645b9d9fb17365937"},{points:[[29.6806,112.5277],[41.3228,138.3305],[29.1973,127.3654],[13.9989,-79.5222],[35.7265,79.2414]],hash:"839bd34dfd851403754c8129cec48888842f850cec540215fc045adffe3cbd42"},{points:[[31.8472,110.8741],[30.8709,47.8341],[47.1796,84.961],[34.615,151.8026],[24.7191,-61.3869]],hash:"874b0d54c97e1598d38fcf10a3d66e019f83f2d7aa93a545bb6ea7674f9173da"},{points:[[52.0059,-83.3751],[6.0763,-41.2843],[51.5689,-4.9461],[12.4228,109.8687],[54.4585,11.4131]],hash:"f39bcf9133fbb747fc9e6c96b345b2864b43f2d49fcaf474dea5fed7ce7c0b82"},{points:[[3.7597,100.0442],[56.3003,21.7064],[10.0248,-2.2023],[37.6408,64.5443],[28.1059,112.0864]],hash:"9ea6e98e001c3643f36b0be87fee568b875565bda225cc5a7236a4182bd6fe95"},{points:[[24.7191,-61.3869],[21.722,136.6048],[56.3865,.6975],[26.1962,-13.3959],[7.9664,3.7745]],hash:"313dc6b7bd259be43e7471fe5ade4dd3ef82071cee9f8126a0dce1464b143450"},{points:[[25.8916,23.3942],[24.533,40.2711],[52.1366,86.0042],[21.181,-86.085],[3.6808,79.7461]],hash:"523a16953fb7cdfbacb3686441912942da4c881c5ded172fa2d3eab59ffe7791"},{points:[[35.6122,90.8085],[39.9186,165.4217],[41.1456,-87.6977],[53.1787,58.6321],[24.475,31.4889]],hash:"696bc6efc02bfe7262bc860669c648f457508457596711958f10084acf5e0415"},{points:[[47.0445,5.3387],[10.0248,-2.2023],[37.3094,-7.929],[19.1165,-1.557],[13.4225,36.3782]],hash:"27489c64a5b8e46cfc2cd83e5d7b075fd31ff0403d0efc2e21527c172cb45619"},{points:[[56.3865,.6975],[47.7819,90.9181],[31.0223,145.3114],[49.4597,-112.5548],[20.6307,.4236]],hash:"c0b156a08aeae1217b704e2778b9e7f2323b249803f357a38d72761ecd30eaf8"},{points:[[25.8916,23.3942],[21.722,136.6048],[27.6981,22.4373],[56.3865,.6975],[12.0013,27.8707]],hash:"53fadb38010b428efc27c5bc00190763c405da033bd9008bd8d7f2626d946785"},{points:[[35.6122,90.8085],[27.9592,112.9154],[35.7265,79.2414],[42.5826,72.1096],[33.4596,-78.0387]],hash:"cdaec8ec6bf1c7c6b73a6c9e959dcb58ebdbc796a77f48c5efedbab67f9c1e45"},{points:[[38.9799,-12.1692],[29.4965,85.2866],[21.204,61.7357],[41.2428,116.7191],[51.5689,-4.9461]],hash:"785017048cd9c67972980d24d165fa99af2269a27d176f263ac58d9ba1810302"},{points:[[36.9017,132.8251],[14.1684,-21.7701],[40.9467,-78.0269],[10.7483,-78.7878],[47.7819,90.9181]],hash:"e443316c2922a458fecc516c649a306bc10231b9fac70760f47d8002d80532e5"},{points:[[40.9467,-78.0269],[26.1962,-13.3959],[48.9839,-104.574],[24.7191,-61.3869],[54.4585,11.4131]],hash:"e1dff88892a8316212e4d20f74b0fb2a2316d67f0cc248415126a06226a48ce1"},{points:[[50.9811,-24.6377],[30.8709,47.8341],[24.1665,51.5626],[34.615,151.8026],[3.6808,79.7461]],hash:"f4846336b7affcc2a0362de46ec3b96a5ef6c1d1d3fbdcd8815260cd428b5b6f"},{points:[[20.6307,.4236],[56.3865,.6975],[40.9467,-78.0269],[13.1803,58.5281],[44.5508,143.3182]],hash:"c0fcc2228b9851951c902b1f26ba4aefeffc3b2472d269db598eb66ea94611b9"},{points:[[26.1962,-13.3959],[11.861,32.6943],[24.475,31.4889],[12.9435,-10.5061],[18.5631,19.2933]],hash:"b138dc27721c23b1447ffcb99ffb44aea627b34a18a2fc993c629ad178b3a55f"},{points:[[29.4965,85.2866],[37.6408,64.5443],[47.0445,5.3387],[4.0558,17.1557],[27.9592,112.9154]],hash:"319f24395c59bc352cacf245224a826586f8bdd4046d931ace13dde87b1b7343"},{points:[[29.4965,85.2866],[27.6981,22.4373],[44.523,-113.975],[39.9186,165.4217],[56.3865,.6975]],hash:"90fd485d8864a5906f87e913331e44ad85b922bbed63f6cd69fda57fe59db6d6"},{points:[[5.459,-3.0179],[26.1962,-13.3959],[22.6162,17.8949],[7.4864,40.4675],[21.204,61.7357]],hash:"db3cd4b783773843f5af6f2c190753a1083c07cc171f07f73db8d2de35b94155"},{points:[[53.1787,58.6321],[26.0238,-32.1693],[20.6307,.4236],[40.9594,156.3847],[26.1962,-13.3959]],hash:"f3a7f82e9191068536d938b9443d422202bb14e8e80ad306a1b9693b17a170b4"},{points:[[40.9467,-78.0269],[19.8871,-50.7798],[12.9435,-10.5061],[56.3865,.6975],[13.5328,-62.1142]],hash:"b32eb2413f8dc04a37caf6e613b8f7cf47555fe45da99a0624bad9cad4dbde97"},{points:[[6.0763,-41.2843],[44.523,-113.975],[36.5347,122.8518],[44.5508,143.3182],[3.6808,79.7461]],hash:"a9df39f98ada4098a2e8597ed31575a2d54159224ebd1e8519970a766a5548af"},{points:[[10.7483,-78.7878],[20.6307,.4236],[10.0227,-46.5964],[39.0296,-85.1922],[35.6122,90.8085]],hash:"ad676c1478fcd8e3f4d9f4a45e453e75c8d9be78a7f222e192331852020ea6ef"},{points:[[6.272,100.2631],[35.6122,90.8085],[37.3094,-7.929],[40.9467,-78.0269],[48.9839,-104.574]],hash:"f0b333ebec087d06a37345129eb5fca647edad068b1d2dec38296c37126b5bcb"},{points:[[32.9613,-61.2046],[21.204,61.7357],[43.2322,145.7939],[37.3094,-7.929],[51.5689,-4.9461]],hash:"f82474387cd7ec5bd40ea3f45aedfaa9d23edd34a925a453b9d828fe483859e3"},{points:[[42.5826,72.1096],[51.5689,-4.9461],[40.9594,156.3847],[26.1962,-13.3959],[48.8083,-103.3525]],hash:"6c744e1e3d21d5d3b0b05eb04f2b6e266b63dd212478aab792ca5b5fd4e1ef00"},{points:[[13.4225,36.3782],[47.1796,84.961],[41.1456,-87.6977],[10.7483,-78.7878],[30.6483,76.4905]],hash:"5f800f52a251a497b3fa4690a1166e3993808269966072c565283553a95c2cae"},{points:[[56.3003,21.7064],[48.8083,-103.3525],[52.1366,86.0042],[44.523,-113.975],[3.7597,100.0442]],hash:"a8248bbfae0562cc3c794dfe4769436ccc06bf444a086e4019e96f48aae7b1cf"},{points:[[22.6162,17.8949],[5.459,-3.0179],[28.7959,65.2433],[26.1962,-13.3959],[13.5328,-62.1142]],hash:"777ad989f2599eccd0d7fe65b0cd04e9623625c4ca2bd8c7d6a23f87fbe7e408"},{points:[[38.9055,-103.5088],[31.9566,70.7456],[22.6162,17.8949],[21.722,136.6048],[18.191,124.1161]],hash:"94f3f7937857e6a87b3fee7ad2be892e6e4f727fd5d3637ba1e90e7c3e43bd3c"},{points:[[34.1641,158.8395],[7.9664,3.7745],[13.4225,36.3782],[26.1962,-13.3959],[56.3865,.6975]],hash:"856e00d04153e52b90d421561141d57bb1fd443fa6e130b6a1ae1981a0641eed"},{points:[[19.8871,-50.7798],[22.6162,17.8949],[56.3003,21.7064],[24.533,40.2711],[21.181,-86.085]],hash:"32b8626bfba7eeb934c89d763eff29e9fcc6b596deccbc7fd2bcd6c6c3d6d6db"},{points:[[31.8472,110.8741],[18.191,124.1161],[13.9989,-79.5222],[51.5689,-4.9461],[21.181,-86.085]],hash:"dcd30ee46349aa77bd89905293d14376a4c3b2754692ce99e3cba24d003e80f4"},{points:[[18.5631,19.2933],[30.6483,76.4905],[40.5326,47.2158],[13.1803,58.5281],[14.1684,-21.7701]],hash:"da3d446f39d2db1342bb4fd35fdee20ccdb433bea1730952ee1bc304bcba2cc6"},{points:[[12.9435,-10.5061],[39.0296,-85.1922],[27.4646,102.2729],[7.9664,3.7745],[47.0445,5.3387]],hash:"3b2cd67ddef78557278dd37ebfa4fd2f7febf9f8eda507f28ae4b88595908d80"},{points:[[24.533,40.2711],[6.0763,-41.2843],[12.0013,27.8707],[27.5906,81.3611],[44.5508,143.3182]],hash:"0dc63bb96730588a8826e4fdeff6c3ee7973bde6030afbcf33736cba18573877"},{points:[[41.4759,62.1823],[48.8083,-103.3525],[20.2739,25.3633],[24.1665,51.5626],[12.9435,-10.5061]],hash:"c8fe6a36f5889d8bb1434c26f8d7fa87f630934ee9c1595749c82462845265ed"},{points:[[41.2428,116.7191],[24.533,40.2711],[24.1665,51.5626],[13.9989,-79.5222],[34.615,151.8026]],hash:"c2b889cca8dbc5d9b65739cf06cdd9bddf2caa757e19a404702c4f193dfcebe4"},{points:[[30.4574,150.0647],[30.6483,76.4905],[12.4228,109.8687],[41.4759,62.1823],[10.0227,-46.5964]],hash:"71f1ff823384d1cd76e9d6f15f3dcdb2cf5941ba212cb341c03f6d0e6720f02e"},{points:[[48.8083,-103.3525],[53.1787,58.6321],[50.9811,-24.6377],[34.615,151.8026],[39.0296,-85.1922]],hash:"52e6571c1da6754052ad5dc449d2be4c7087c689e49050d8aa2d50ce04bfc3b2"},{points:[[12.9435,-10.5061],[47.1796,84.961],[36.9017,132.8251],[21.6993,-8.9028],[35.7265,79.2414]],hash:"d8905a277e4096a3917b4a0cae4bc7c5fa37f3e4ab8df0101f1e69e25ce1e85a"},{points:[[26.4021,-33.1847],[30.8709,47.8341],[6.272,100.2631],[52.1366,86.0042],[18.191,124.1161]],hash:"f4f7b3345e26051aca46203bab61caf40db9dbb31319f9c238f3b0118dc96c44"},{points:[[20.6307,.4236],[18.191,124.1161],[24.533,40.2711],[21.181,-86.085],[25.8916,23.3942]],hash:"c24c4ccd80eb7535e301ee7cf49b30f3d5648ca3f9751ba29432816a7c5d1c2a"},{points:[[36.9017,132.8251],[37.3094,-7.929],[19.8871,-50.7798],[39.0296,-85.1922],[27.4646,102.2729]],hash:"bb3b526029a0737552f8f9641a90baa159daabaf3b3c20bdd11d6fec3fa6986a"},{points:[[24.1665,51.5626],[20.2739,25.3633],[52.1366,86.0042],[30.8709,47.8341],[12.9435,-10.5061]],hash:"0f53f7f43f396f9ab12a0b70617acb58fd65abbd4d42dc52f9cddc0361c6657d"},{points:[[36.5347,122.8518],[28.1059,112.0864],[40.9467,-78.0269],[21.722,136.6048],[27.5906,81.3611]],hash:"f0d4c07b0d39edf739197bdb405a1cfbfaeb4350cf0e18f9d2a50fcb37d762da"},{points:[[26.4021,-33.1847],[47.0445,5.3387],[36.5347,122.8518],[7.9664,3.7745],[34.1641,158.8395]],hash:"d0ee629426958fe650ca368a24bd9f611ef03111960d26aa78423f2dc2b0c08d"},{points:[[6.0763,-41.2843],[44.5508,143.3182],[21.181,-86.085],[32.9613,-61.2046],[47.0445,5.3387]],hash:"e01187acb4c8e10cf541a8461a6f108c889a65315bad19a9fb55ca395d9eaf1a"},{points:[[52.7298,-39.7147],[6.272,100.2631],[29.4965,85.2866],[41.3862,118.2505],[29.1973,127.3654]],hash:"ecb7ed1015f347a57f9b16c14b8b687769926a90cbe446762b006879c57a127e"},{points:[[56.3003,21.7064],[14.1684,-21.7701],[47.7196,-85.2553],[54.4585,11.4131],[51.5689,-4.9461]],hash:"19e59bfcbc3f33e6cab5ecc852dfcaa9e4e525098c451f8e69259155ba0f4062"},{points:[[47.1796,84.961],[56.3003,21.7064],[6.0763,-41.2843],[41.4759,62.1823],[20.6307,.4236]],hash:"65790e063898e41e799d66baba8d3edbab7dfdfec786797ad91ea9406a5cb4d2"},{points:[[33.4596,-78.0387],[35.7265,79.2414],[48.8083,-103.3525],[48.9839,-104.574],[13.5328,-62.1142]],hash:"aa8093135c0c384543c3e6a6f154b22b433034a1ccaaa5cd55b961c7f4f7c792"},{points:[[14.1684,-21.7701],[13.1803,58.5281],[43.2322,145.7939],[53.1787,58.6321],[30.8709,47.8341]],hash:"6cb08d2e7aa0d665f994c0a6fc24ff679d1d440170714b3ff8647c3a47d3e09f"},{points:[[10.1791,-23.7994],[34.615,151.8026],[27.9592,112.9154],[7.3266,49.9125],[29.1973,127.3654]],hash:"c78bae6d39e745c7196d06b51cf67f79bb3cd59f60c4eb80c0d5adbfa4099d80"},{points:[[51.5689,-4.9461],[21.181,-86.085],[37.3094,-7.929],[54.4585,11.4131],[13.1803,58.5281]],hash:"85dab7c403ae018d0800b0217775bda824313d2d05649b47dca64883d4ba744f"},{points:[[13.5328,-62.1142],[38.9055,-103.5088],[35.6122,90.8085],[44.5508,143.3182],[10.0248,-2.2023]],hash:"f26bca503e91f1b8fa1a9aa74344a9c0fd44f8f8247b9c87715cf0c79d4d5913"},{points:[[29.4965,85.2866],[29.1973,127.3654],[48.9839,-104.574],[56.3003,21.7064],[11.861,32.6943]],hash:"c059245f777e70d3ee7fa8d2cc30380df53341429a6dfe5f8617961f7a7467ba"},{points:[[47.7196,-85.2553],[28.7959,65.2433],[39.0296,-85.1922],[10.7483,-78.7878],[31.8472,110.8741]],hash:"f6315753cb98138e93d02bf937bbc17d6a514895c9ff16970eadf7fe44212891"},{points:[[27.6981,22.4373],[52.7298,-39.7147],[21.722,136.6048],[30.8709,47.8341],[41.4759,62.1823]],hash:"0e53f5d426030f8f5342323f33eb3955ccc61c87710432428d18b1f3d1cc9a18"},{points:[[52.0059,-83.3751],[27.4646,102.2729],[24.533,40.2711],[39.0296,-85.1922],[42.5826,72.1096]],hash:"12a4d18e85853d8c21b49e06bd7fc5b0354476c2365b717f4649f618e74e3cd4"},{points:[[39.9186,165.4217],[33.4596,-78.0387],[30.4574,150.0647],[12.4228,109.8687],[31.8472,110.8741]],hash:"a6cffa2efa6fe488782be6155bb63a82590e24195b76685a9d96bc9c9740ea2e"},{points:[[41.3862,118.2505],[26.4021,-33.1847],[7.1282,107.3975],[3.6808,79.7461],[20.2739,25.3633]],hash:"b1223f1cb8053224e787ab82ea2fa4b4d0a6c2b42c1f683ec5c0a110c01df36a"},{points:[[24.533,40.2711],[10.0248,-2.2023],[56.3003,21.7064],[40.9594,156.3847],[41.1456,-87.6977]],hash:"a25d353bcd698f33b458a878a85246ff40e49a7bed068fe42650bc3e4cb841da"},{points:[[19.1165,-1.557],[12.0013,27.8707],[41.4759,62.1823],[30.4574,150.0647],[54.4585,11.4131]],hash:"38cdd9ef0e4e716bf3e848302652b13095d043b4a789a1f6d097813fbc5bbe50"},{points:[[27.4646,102.2729],[3.7597,100.0442],[36.5347,122.8518],[36.9017,132.8251],[5.459,-3.0179]],hash:"a7726aa3813b84ae404db30d34f0c3ef5945c6a2b2b5246d181e5f9b036ee13b"},{points:[[32.9613,-61.2046],[18.191,124.1161],[52.1366,86.0042],[7.4864,40.4675],[7.1282,107.3975]],hash:"a978bdd9de94c932f4315237cc0bb8cb60ff3e73d162a03bc62cb4d3d5868fcb"},{points:[[50.9811,-24.6377],[41.4759,62.1823],[13.4225,36.3782],[39.9186,165.4217],[40.5326,47.2158]],hash:"62922888d5cb0698271dd351f4fe45f3627c808b210690ee3679e94becefc5d5"},{points:[[5.459,-3.0179],[41.4759,62.1823],[39.9186,165.4217],[7.3266,49.9125],[21.204,61.7357]],hash:"3269230dff4567f02ef881659df1696fadceae05679f92dc74327b4bc95f6dc3"},{points:[[26.0238,-32.1693],[56.3003,21.7064],[19.8871,-50.7798],[10.1791,-23.7994],[53.1787,58.6321]],hash:"3e7ccfd7de919d606b31de0decbede0ea71d143489ca77c95ffa67217d64b38d"},{points:[[7.3266,49.9125],[10.1791,-23.7994],[29.4965,85.2866],[40.9594,156.3847],[12.0013,27.8707]],hash:"10833bdad2bb20383e3cf92b876552b6f1d0c178e8784c9a6f0d30fdd92e1a0d"},{points:[[13.9989,-79.5222],[26.0238,-32.1693],[27.5906,81.3611],[38.9799,-12.1692],[22.6162,17.8949]],hash:"f136cb9d15f71bb7fb87352c00c0b4f96838471e629dafa03790341d863fa5fb"},{points:[[31.0223,145.3114],[52.1366,86.0042],[41.1456,-87.6977],[10.1791,-23.7994],[12.4228,109.8687]],hash:"a61242a7fcfa9fed776c26d0cfada60b4fd309a231a8dcaa9a37c380bca04ef0"},{points:[[13.1803,58.5281],[18.191,124.1161],[37.3094,-7.929],[3.7597,100.0442],[51.5689,-4.9461]],hash:"98a15a5d671ebf8ff818dacc8bc539f82a245b340aeb0933c0466039a02072fa"},{points:[[31.9566,70.7456],[41.4759,62.1823],[51.5689,-4.9461],[19.8871,-50.7798],[24.533,40.2711]],hash:"104a2c5a7bcb9bc93e493ab4684ce7d3216109078c6468458c731c9a11d822ad"},{points:[[47.7819,90.9181],[10.7483,-78.7878],[35.6122,90.8085],[12.0013,27.8707],[27.9592,112.9154]],hash:"6efdb2602ebdb37d955b0b1c1b79e1a37b7c681eb6867deb4ce9808aaf3a7e8c"},{points:[[10.0248,-2.2023],[31.8472,110.8741],[24.533,40.2711],[42.5826,72.1096],[34.615,151.8026]],hash:"77b4e86129fc0cd3815069564a7b11be30ebbba24b17ceb1a0e137921aa7ebcf"},{points:[[48.8083,-103.3525],[27.4646,102.2729],[53.1787,58.6321],[40.9594,156.3847],[24.475,31.4889]],hash:"1a13a00a8bc62df244879e45ead6bd2748878aa603d6297ba2c25ec95caaad5a"},{points:[[21.722,136.6048],[38.9055,-103.5088],[10.7483,-78.7878],[27.9592,112.9154],[21.181,-86.085]],hash:"ae1ca5c41c7ddd6ffb6af66807aafcf1c18ef4ea679bbf64708ccd2532b5e2de"},{points:[[50.9811,-24.6377],[21.204,61.7357],[7.4864,40.4675],[27.5906,81.3611],[56.3865,.6975]],hash:"cbc6b45c3c46657bea8ab6939061d612da27894ddfc097440c90fba0956b9077"},{points:[[12.9435,-10.5061],[10.7483,-78.7878],[50.9811,-24.6377],[4.0558,17.1557],[3.6808,79.7461]],hash:"a7a356b1355cf7f88904f2e57578efd0af9ff40e165d4bdf66b5a8631ef8345b"},{points:[[40.9594,156.3847],[13.4225,36.3782],[4.0558,17.1557],[18.5631,19.2933],[7.4864,40.4675]],hash:"aa5a67d8a29db8088aeba5d114c062c130fc9fb8f74aa94dda180d13c24556a6"},{points:[[21.204,61.7357],[27.4646,102.2729],[38.9055,-103.5088],[28.7959,65.2433],[20.6307,.4236]],hash:"63204243601f7fee236400bda0b711a4bfee859c1449179609a9c467ad9e0cc5"},{points:[[43.2322,145.7939],[47.0044,22.944],[24.1665,51.5626],[24.7191,-61.3869],[54.4585,11.4131]],hash:"51c4ba919b9d3eb044b3aaab8ab3468d52d5b861c3854d86964a12845ee53d0e"},{points:[[47.0445,5.3387],[6.272,100.2631],[50.9811,-24.6377],[26.0238,-32.1693],[51.5689,-4.9461]],hash:"2e23005d0b82eec288b65509d553ed05e3db289944f9e4a936d7f1eab02e1e67"},{points:[[12.4228,109.8687],[21.722,136.6048],[40.9467,-78.0269],[19.8871,-50.7798],[34.1641,158.8395]],hash:"256e1b55c93e8f07c4266ef7ffed2832cc8cd7c65b8c8185e6933862488cf4b1"},{points:[[51.5689,-4.9461],[12.4228,109.8687],[24.7191,-61.3869],[11.861,32.6943],[7.3266,49.9125]],hash:"70cc5f39384206091c13b82b53c413221ef7e868f06aaa6af2c28b65c07f4bd2"},{points:[[18.5631,19.2933],[22.6162,17.8949],[39.0296,-85.1922],[24.533,40.2711],[10.1791,-23.7994]],hash:"6e0682c2b55ea8cc542e09424612ddd09096cecf9db623bc193ae014a2630b86"},{points:[[30.4574,150.0647],[52.7298,-39.7147],[13.5328,-62.1142],[41.3228,138.3305],[18.5631,19.2933]],hash:"dc237dd48a1e6d2053deba2ce099de3c8e1a0b919fefa05a1de7ba2d9491f2ca"},{points:[[30.4574,150.0647],[53.1787,58.6321],[36.9017,132.8251],[34.1641,158.8395],[43.2322,145.7939]],hash:"ce57b40d9e54c3b2a87060acd1126b7659ff5121cef66ce24e58513669195a32"},{points:[[49.4597,-112.5548],[38.9055,-103.5088],[47.0445,5.3387],[13.4225,36.3782],[30.4574,150.0647]],hash:"70279ae0d8066f0d9be6d8e9de2cab0246b7ede3c9e5840736190ea4b5da1eac"},{points:[[26.0238,-32.1693],[19.1165,-1.557],[24.1665,51.5626],[37.3094,-7.929],[40.9467,-78.0269]],hash:"a75b11eb6beaa4c5e7be96b87dce1c1239da4627ef799dbe937c08a70a72a6ea"},{points:[[42.5826,72.1096],[10.0248,-2.2023],[41.2428,116.7191],[35.6122,90.8085],[19.8871,-50.7798]],hash:"b10d72d930d58b5f4086df20b20f91b3f7a897cfd276a0278cc7594f928cb62a"},{points:[[50.9811,-24.6377],[4.0558,17.1557],[12.0013,27.8707],[37.6408,64.5443],[31.0223,145.3114]],hash:"1261f17ed358fa57f5dfab815ac909e8fb1f852df137ee6a5ae8b3e45e6ff188"},{points:[[25.8916,23.3942],[3.7597,100.0442],[24.475,31.4889],[18.5631,19.2933],[27.4646,102.2729]],hash:"5f55dff84d180012a6b2d3731f72aeaa3edadb56b98dc06d8d4e98710b2d29a8"},{points:[[50.9811,-24.6377],[18.191,124.1161],[10.0248,-2.2023],[18.5631,19.2933],[3.7597,100.0442]],hash:"d76f136930c946f945f27de518bd254cc2eb2bd31c4b9bfa41dd995dd2832ecc"},{points:[[18.5631,19.2933],[11.861,32.6943],[52.0059,-83.3751],[35.6122,90.8085],[27.4646,102.2729]],hash:"ea8ae9a42d2b67061f1be8348a2cf3328bd326bf6b8d1229afef443ca5679978"},{points:[[21.6993,-8.9028],[10.1791,-23.7994],[40.5326,47.2158],[34.1641,158.8395],[40.9467,-78.0269]],hash:"5417f808ca73894e61dcf97accec107ef69306d943c621daac5f45639b81296d"},{points:[[54.4585,11.4131],[21.6993,-8.9028],[12.9435,-10.5061],[13.1803,58.5281],[40.5326,47.2158]],hash:"7c234cabc248d3f54c9066466e241a520579fa5f7ff5b995e6b58b435ee74a1a"},{points:[[27.5906,81.3611],[12.0013,27.8707],[50.9811,-24.6377],[28.7959,65.2433],[10.0248,-2.2023]],hash:"19ecebe82684393a0956f0ba0f927cb4fab80e1c163198dcfae6c94267d6daa6"},{points:[[40.9594,156.3847],[40.5326,47.2158],[41.3862,118.2505],[29.6806,112.5277],[18.191,124.1161]],hash:"6206de3251419f61d3295274f6c466fa23d22abf478a89ecd9a77f41308b10f8"},{points:[[30.6483,76.4905],[27.6981,22.4373],[19.8871,-50.7798],[39.0296,-85.1922],[52.0059,-83.3751]],hash:"bf2a76486a9c8cc46edb6494d8ddf8da44771cdfd6325b61575e24226c4e0e17"},{points:[[44.523,-113.975],[35.6122,90.8085],[14.1684,-21.7701],[20.2739,25.3633],[18.191,124.1161]],hash:"86027455f0a7662d5a283af79a4e25e27c7fae3029884081200344ad86f4c23e"},{points:[[52.7298,-39.7147],[26.1962,-13.3959],[47.0044,22.944],[3.7597,100.0442],[24.1665,51.5626]],hash:"bd4b3b20f53e8aeea31182aa69447153995e4a476ff501d4ff568cdd7aee3b5d"}]});async function Pa(e){let o=new TextEncoder().encode(e),a=await crypto.subtle.digest("SHA-256",o);return Array.from(new Uint8Array(a)).map(s=>s.toString(16).padStart(2,"0")).join("")}var Ma=k(()=>{"use strict"});async function La(e){let n="q-region-containing-point-server",o=e?.version??"";return async a=>{let i=(0,Na.default)(`${e.email}#${n}${o}`),{hash:r}=$e[Math.floor(i()*$e.length)],s=a.split(",").map(t=>t.trim()).join(",");return r===await Pa(s)}}var Na,Oa=k(()=>{"use strict";Na=_(O(),1);Ta();Ma()});var _a={};M(_a,{default:()=>F1});import{html as de}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function F1({user:e,weight:n=2,version:o=""}){let a="q-region-containing-point-server",i="Region Containing Point",r={...e,version:o},s=(0,qa.default)(`${e.email}#${a}${o}`),{cities:t,regions:c,groups:l}=await fetch("data-cities-regions.json").then(f=>f.json()),{points:h}=l[Math.floor(s()*l.length)],d=de`
    <p>
      You are the operations manager for World Courier. You have divided your business across ${c.length}
      franchisees, giving each a region. All couriers from inside the franchisee's region must be picked up by that
      franchisee.
    </p>
    <p>You have new requests from these latitudes and longitudes:</p>
    <table class="table">
      <thead>
        <tr>
          <th>Latitude</th>
          <th>Longitude</th>
        </tr>
      </thead>
      <tbody>
        ${h.map(([f,b])=>de`<tr>
              <td>${f}</td>
              <td>${b}</td>
            </tr>`)}
      </tbody>
    </table>

    <details class="my-3">
      <summary>Here are the franchisee numbers and the cities that mark their region's boundary.</summary>
      <table class="table">
        <thead>
          <tr>
            <th>Franchisee</th>
            <th>Cities [Latitude, Longitude]</th>
          </tr>
        </thead>
        <tbody>
          ${c.map((f,b)=>de`<tr>
                <td>${b+1}</td>
                <td>${f.map(u=>de`<div>${u} ${JSON.stringify(t[u])}</div>`)}</td>
              </tr>`)}
        </tbody>
      </table>
    </details>

    <p>Any point inside a region is served by the corresponding franchisee.</p>
    <p>Assume the Earth is flat.</p>
    <p>Write the answer as a sequence of franchisee numbers separated by commas (e.g. "20,9,12,12,3").</p>
    <input class="form-control" id="${a}" name="${a}" />
    <p class="text-muted">
      The franchisee numbers should be in the order of the pickup points. We strip spaces around the commas or
      franchisee numbers before checking. It's OK if multiple points fall into the same franchisee region.
    </p>
  `;return{id:a,title:i,weight:n,question:d,answer:await La(r)}}var qa,ja=k(()=>{"use strict";qa=_(O(),1);Oa()});async function Ee(e){let n="q-rename-files-server",o=e?.version??"",a=(0,za.default)(`${e?.email??""}#${n}${o}`),i=Va[Math.floor(a()*Va.length)],r=[],s=["docs","content","archive","project"],t=["chapter1","section-a","part 2","m\xF3dulo-3","2024"],c=["intro","advanced","appendix","donn\xE9es","r\xE9f\xE9rences"];for(let f=0;f<30;f++){let b=1+Math.floor(a()*3),u=[];if(u.push(s[Math.floor(a()*s.length)]),b>=2&&u.push(t[Math.floor(a()*t.length)]),b>=3&&u.push(c[Math.floor(a()*c.length)]),a()<.2){let x=["spaces here","file-name","na\xEFve","caf\xE9-2024","test_file"];u.push(x[Math.floor(a()*x.length)])}let y=`file${String(f+1).padStart(2,"0")}.txt`,p=a()<.1?y.replace("i","\u0456"):y,v=[...u,p].join("/"),g;a()<.3&&Ae.length>0?g=Ae[Math.floor(a()*Ae.length)]:g=Da[Math.floor(a()*Da.length)];let m=`category: ${g}

${i.context.toUpperCase()} - File ${f+1}

This is a test file for the reorganization exercise.
Path: ${v}
Category: ${g}

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`;r.push({path:v,category:g,content:m})}let l=r.map(f=>{let b=f.path.split("/"),u=b[b.length-1],y=b.slice(0,-1).join("-");return`${f.category}/${y}-${u}`});l.sort((f,b)=>{for(let u=0;u<Math.min(f.length,b.length);u++)if(f.charCodeAt(u)!==b.charCodeAt(u))return f.charCodeAt(u)-b.charCodeAt(u);return f.length-b.length});let h=l.map(f=>`./${f}`).join(`
`)+`
`,d=await J1(h);return{scenario:i,files:r,expectedFiles:l,expectedHash:d,fileList:h}}async function J1(e){let n=new TextEncoder().encode(e),o=await crypto.subtle.digest("SHA-256",n);return Array.from(new Uint8Array(o)).map(i=>i.toString(16).padStart(2,"0")).join("")}async function Fa(e){let{expectedHash:n}=await Ee(e);return async o=>{if(!o||typeof o!="string")throw new Error("Please submit the SHA256 hash from the find command.");if(o.trim().split(/\s+/)[0]===n)return!0;throw o.includes("-")?new Error("Please submit only the hash value (first part before the dash). Run: find . -type f | LC_ALL=C sort | sha256sum | cut -d' ' -f1"):new Error("Incorrect hash. This means the files were not renamed/moved correctly. Make sure to: (1) Extract the category from the FIRST line matching 'category: ...', (2) Create category directories, (3) Move files to {category}/{path-with-dashes}-{filename}, (4) Use LC_ALL=C sort for consistent ordering. Check the README.md for examples.")}}var za,Da,Ae,Va,Ja=k(()=>{"use strict";za=_(O(),1),Da=["documentation","reports","notes","configs","data","logs","scripts","templates","resources","archives"],Ae=["r\xE9sum\xE9","na\xEFve-bayes","\u65E5\u672C\u8A9E","m\xFCnchen","caf\xE9"],Va=[{name:"documentation_cleanup",title:"Documentation Repository Reorganization",description:"Reorganize scattered documentation files into a category-based flat structure",context:"technical documentation"},{name:"archive_migration",title:"Legacy Archive Migration",description:"Migrate legacy archive files from nested structure to categorized flat layout",context:"historical archives"},{name:"content_management",title:"Content Management System Refactoring",description:"Restructure CMS content files from hierarchical to category-based organization",context:"content files"},{name:"knowledge_base",title:"Knowledge Base Reorganization",description:"Flatten knowledge base articles while preserving category information",context:"knowledge articles"}]});var Ba={};M(Ba,{default:()=>U1});import B1 from"https://cdn.jsdelivr.net/npm/jszip@3/+esm";import{html as G1}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function U1({user:e,weight:n=1,version:o=""}){let a="q-rename-files-server",i="Reorganize Files with Shell Commands",r={...e,version:o},s=await Ee(r),{files:t}=s,c=new B1;for(let f of t)c.file(f.path,f.content);c.file("README.md",`# ${s.scenario.title}

## Task

You have ${t.length} text files scattered across a nested directory structure. Your job is to reorganize them into a flat structure based on categories.

**Rules:**
1. Read the **first line** in each .txt file that matches \`category: ...\`
2. Create a directory for each category
3. Move each file to: \`{category}/{path-with-dashes}-{filename}\`
   - Replace all \`/\` in the original path with \`-\`
   - Keep the filename as-is

**Example:**
- Original: \`docs/chapter1/file01.txt\` with first line \`category: reports\`
- New location: \`reports/docs-chapter1-file01.txt\`

**Example:**
- Original: \`project/part 2/intro/file15.txt\` with first line \`category: documentation\`
- New location: \`documentation/project-part 2-intro-file15.txt\`

## Instructions

1. Extract the ZIP file
2. Use shell commands (bash) to reorganize the files
3. After reorganization, run: \`find . -type f | LC_ALL=C sort | sha256sum\`
4. Submit the hash (first part before the space/dash)

## Important Notes

- Some filenames/paths contain **Unicode characters**, **spaces**, and **special characters**
- Some categories use **non-ASCII characters** (accents, diacritics, etc.)
- Use \`LC_ALL=C\` to ensure consistent sorting regardless of locale
- The hash must match exactly, including directory structure

## Hints

- Use \`grep -m 1\` to get the first matching line
- Use \`tr '/' '-'\` to replace slashes with dashes
- Use \`find\`, \`grep\`, \`cut\`, \`mkdir\`, \`mv\` commands
- Quote paths properly to handle spaces and special characters
`);let l=await c.generateAsync({type:"blob"}),h=URL.createObjectURL(l),d=G1`
    <p>
      <strong>Scenario:</strong> You're a DevOps engineer tasked with reorganizing a legacy file
      archive. The files are scattered across nested directories, but each file has a category tag. You
      need to flatten the structure while grouping files by category.
    </p>

    <p><strong>Your Task:</strong></p>
    <ol>
      <li>Download and extract the ZIP file (${t.length} text files in nested directories)</li>
      <li>Write a shell script to reorganize files based on their category</li>
      <li>Move each file to: <code>{category}/{path-with-dashes}-{filename}</code></li>
      <li>
        Run: <code>find . -type f | LC_ALL=C sort | sha256sum</code> to get the verification hash
      </li>
      <li>Submit the hash value</li>
    </ol>

    <p>
      <a href="${h}" download="files_to_reorganize.zip" class="btn btn-primary btn-sm">
        📥 Download Files (ZIP)
      </a>
    </p>

    <details class="my-3">
      <summary><strong>📋 Reorganization Rules</strong></summary>

      <p>Each <code>.txt</code> file contains a category on its first line matching this pattern:</p>
      <pre><code>category: {category-name}</code></pre>

      <p><strong>Transformation:</strong></p>
      <ul>
        <li>
          <strong>Before:</strong> <code>docs/chapter1/lesson1.txt</code> (contains
          <code>category: reports</code>)
        </li>
        <li><strong>After:</strong> <code>reports/docs-chapter1-lesson1.txt</code></li>
      </ul>

      <p><strong>Steps:</strong></p>
      <ol>
        <li>Extract category from first matching line in each file</li>
        <li>Create directory for the category (if it doesn't exist)</li>
        <li>Convert original path <code>a/b/c/file.txt</code> to <code>a-b-c-file.txt</code></li>
        <li>Move file to <code>{category}/{new-name}</code></li>
      </ol>
    </details>

    <details class="my-3">
      <summary><strong>💡 Shell Command Hints</strong></summary>

      <h6>Extract category from a file:</h6>
      <pre><code>grep -m 1 "^category:" file.txt | cut -d' ' -f2-</code></pre>

      <h6>Replace slashes with dashes:</h6>
      <pre><code>echo "path/to/file.txt" | tr '/' '-'
# Output: path-to-file.txt</code></pre>

      <h6>Find all .txt files:</h6>
      <pre><code>find . -type f -name "*.txt"</code></pre>

      <h6>Create directory if it doesn't exist:</h6>
      <pre><code>mkdir -p "category-name"</code></pre>

      <h6>Move file:</h6>
      <pre><code>mv "old/path/file.txt" "category/new-name.txt"</code></pre>

      <h6>Generate verification hash:</h6>
      <pre><code>find . -type f | LC_ALL=C sort | sha256sum</code></pre>

      <p class="text-warning mt-2">
        ⚠️ Important: Use <code>LC_ALL=C sort</code> to ensure consistent ASCII-based sorting regardless
        of your system locale. This is crucial for matching the expected hash.
      </p>
    </details>

    <details class="my-3">
      <summary><strong>🔧 Example Bash Script</strong></summary>

      <pre><code>#!/bin/bash

# Step 1: Extract categories and create directories
for file in $(find . -type f -name "*.txt"); do
  category=$(grep -m 1 "^category:" "$file" | cut -d' ' -f2-)
  mkdir -p "$category"
done

# Step 2: Move and rename files
for file in $(find . -type f -name "*.txt"); do
  category=$(grep -m 1 "^category:" "$file" | cut -d' ' -f2-)
  relpath=$(echo "$file" | sed 's|^\./||')  # Remove leading ./
  newname=$(echo "$relpath" | tr '/' '-')    # Replace / with -
  mv "$file" "$category/$newname"
done

# Step 3: Clean up empty directories
find . -type d -empty -delete

# Step 4: Generate and display hash
find . -type f | LC_ALL=C sort | sha256sum</code></pre>

      <p class="text-muted">
        You can adapt this script or write your own. Make sure to handle spaces and special characters
        properly by quoting variables!
      </p>
    </details>

    <details class="my-3">
      <summary><strong>⚠️ Common Pitfalls</strong></summary>

      <ul>
        <li>
          <strong>Locale issues:</strong> Always use <code>LC_ALL=C sort</code>, not just
          <code>sort</code>
        </li>
        <li>
          <strong>Spaces in paths:</strong> Quote variables: <code>"$file"</code> not
          <code>$file</code>
        </li>
        <li>
          <strong>Windows line endings:</strong> Category might have \r, use
          <code>tr -d '\r'</code>
        </li>
        <li>
          <strong>Wrong category:</strong> Extract from FIRST matching line only:
          <code>grep -m 1</code>
        </li>
        <li><strong>Keeping ./ prefix:</strong> Remove it with <code>sed 's|^\./||'</code></li>
      </ul>
    </details>

    <div class="mb-3">
      <label for="${a}" class="form-label">
        <strong
          >Submit the SHA256 hash from: <code>find . -type f | LC_ALL=C sort | sha256sum</code></strong
        >
      </label>
      <input
        type="text"
        class="form-control font-monospace"
        id="${a}"
        name="${a}"
        placeholder="e.g., 1a2b3c4d5e6f..."
        required
      />
      <div class="form-text">
        Copy only the hash value (first part before the space). Should be 64 hexadecimal characters for
        SHA256, or 32 for the hash function used by this system.
      </div>
    </div>

    <div class="alert alert-info" role="alert">
      <strong>🎓 This question tests your ability to:</strong>
      <ul class="mb-0">
        <li>Write effective bash scripts for file operations</li>
        <li>Use find, grep, sed, tr, and other Unix utilities</li>
        <li>Handle edge cases (spaces, unicode, special characters)</li>
        <li>Verify results with cryptographic hashes</li>
        <li>Understand locale-specific sorting behavior</li>
      </ul>
    </div>
  `;return{id:a,title:i,weight:n,question:d,answer:await Fa(r)}}var Ga=k(()=>{"use strict";Ja()});var le,U,K1,Re=k(()=>{"use strict";le=(e,n,o)=>K1([...e],o).slice(0,n),U=(e,n)=>e[Math.floor(n()*e.length)],K1=function(e,n){for(let o=e.length-1;o>0;o--){let a=Math.floor(n()*(o+1));[e[o],e[a]]=[e[a],e[o]]}return e}});function Te(e){let n="q-python-refactor-server",o=e?.version??"",a=(0,Ka.default)(`${e?.email??""}#${n}${o}`),i=Ua[Math.floor(a()*Ua.length)],r=le(H1,4,a),s=r,t=Y1(s,i,a),c=X1(t,s);return{scenario:i,namesToRefactor:r,wrongCode:t,correctCode:c}}function Y1(e,n,o){let[a,i,r,s]=e;return`"""
${n.title}

This module handles ${n.context}.
Note: This code uses camelCase naming which violates PEP 8.
Refactor the non-compliant names to snake_case.

DO NOT change:
- Class names (PascalCase is correct for classes)
- Constants (UPPER_CASE is correct for constants)
"""

import json
from typing import List, Dict, Optional


class DataProcessor:
    """Main data processor class - DO NOT RENAME"""

    MAX_ITEMS = 1000  # Constant - DO NOT RENAME

    def __init__(self, config: Dict):
        self.config = config
        self.${s.wrong} = 0  # Track current position
        self.items = []

    def ${a.wrong}(self, user_id: str) -> Optional[Dict]:
        """Fetch user data from the API"""
        # Using ${a.wrong} to retrieve information
        if not user_id:
            return None

        # Call ${a.wrong} multiple times for retry logic
        data = self._fetch_data(user_id)
        if data:
            # ${a.wrong} succeeded
            result = self.${i.wrong}(data)
            return result
        return None

    def ${i.wrong}(self, items: List[Dict]) -> List[Dict]:
        """Process items and apply transformations"""
        processed = []
        self.${s.wrong} = 0  # Reset ${s.wrong}

        for item in items:
            # ${i.wrong} handles each item
            if self.${r.wrong}(item):
                formatted = self.${s.wrong}Item(item)
                processed.append(formatted)
                self.${s.wrong} += 1  # Increment ${s.wrong}

        # ${i.wrong} returns processed items
        return processed

    def ${r.wrong}(self, data: Dict) -> bool:
        """Validate input data structure"""
        # ${r.wrong} checks required fields
        if not isinstance(data, dict):
            return False

        required_fields = ['id', 'name', 'value']
        # ${r.wrong} ensures all fields present
        for field in required_fields:
            if field not in data:
                return False

        # ${r.wrong} passed all checks
        return True

    def ${s.wrong}Item(self, item: Dict) -> Dict:
        """Format a single item - uses ${s.wrong} prefix"""
        # Note: Method name intentionally uses ${s.wrong}
        # This tests that you DON'T rename the variable inside the method name
        return {
            'id': item['id'],
            'processed': True,
            'index': self.${s.wrong}  # Reference to variable
        }

    def _fetch_data(self, user_id: str) -> Optional[List[Dict]]:
        """Internal helper method"""
        # Simulate API call
        return [{'id': user_id, 'name': 'Test', 'value': ${Math.floor(o()*100)}}]


def main():
    """Main execution function"""
    processor = DataProcessor(config={})

    # Test ${a.wrong}
    user_data = processor.${a.wrong}("user123")
    if user_data:
        # Process using ${i.wrong}
        items = [user_data]
        results = processor.${i.wrong}(items)

        # Validate using ${r.wrong}
        for result in results:
            if processor.${r.wrong}(result):
                print(f"Processed item at index {processor.${s.wrong}}")


if __name__ == "__main__":
    main()
`}function X1(e,n){let o=e;for(let a of n){let i=new RegExp(`\\b${a.wrong}\\b`,"g");o=o.replace(i,a.correct)}return o}function fe(e){return e.split(`
`).map(n=>n.trimEnd()).join(`
`).trim()}function Q1(e,n){let o=fe(e).split(`
`),a=fe(n).split(`
`),i=[],r=Math.max(o.length,a.length);for(let s=0;s<r;s++){let t=o[s]||"",c=a[s]||"";t!==c&&i.push({line:s+1,submitted:t,expected:c})}return i}async function Ha(e){return async n=>{let{correctCode:o,namesToRefactor:a}=Te(e);if(!n||typeof n!="string")throw new Error("Please submit the refactored Python code.");let i=fe(n),r=fe(o);if(i===r)return!0;let s=Q1(n,o);if(s.length===0)return!0;let t=[];for(let d of a)i.includes(d.wrong)&&t.push(d.wrong);if(t.length>0)throw new Error(`Incomplete refactoring. These names still need to be changed: ${t.join(", ")}. Use VS Code's "Rename Symbol" (F2) feature to refactor all occurrences.`);let c=[];for(let d of W1)r.includes(d)&&!i.includes(d)&&c.push(d);if(c.length>0)throw new Error(`Incorrect refactoring. You changed names that should NOT be changed: ${c.join(", ")}. Class names (PascalCase) and constants (UPPER_CASE) should remain unchanged.`);let h=s.slice(0,3).map(d=>`Line ${d.line}: Expected "${d.expected.trim()}" but got "${d.submitted.trim()}"`);throw new Error(`Code doesn't match expected refactoring. ${h.join("; ")}. Make sure to rename ALL occurrences of: ${a.map(d=>d.wrong).join(", ")}.`)}}var Ka,Ua,H1,W1,Wa=k(()=>{"use strict";Ka=_(O(),1);Re();Ua=[{name:"data_pipeline",title:"Data Processing Pipeline Refactoring",description:"Legacy data pipeline code that needs PEP 8 compliance",context:"data processing system"},{name:"api_service",title:"REST API Service Refactoring",description:"API service code written by JavaScript developers using camelCase",context:"REST API endpoints"},{name:"ml_model",title:"Machine Learning Model Refactoring",description:"ML model code that needs standardization to Python naming conventions",context:"machine learning pipeline"},{name:"web_scraper",title:"Web Scraper Refactoring",description:"Web scraping utility that needs to follow Python style guide",context:"web scraping operations"}],H1=[{wrong:"getUserData",correct:"get_user_data",type:"function"},{wrong:"processItems",correct:"process_items",type:"function"},{wrong:"calculateTotal",correct:"calculate_total",type:"function"},{wrong:"validateInput",correct:"validate_input",type:"function"},{wrong:"formatOutput",correct:"format_output",type:"function"},{wrong:"parseResponse",correct:"parse_response",type:"function"},{wrong:"maxRetries",correct:"max_retries",type:"variable"},{wrong:"baseUrl",correct:"base_url",type:"variable"},{wrong:"errorCount",correct:"error_count",type:"variable"},{wrong:"currentIndex",correct:"current_index",type:"variable"}],W1=["UserData","DataProcessor","ValidationError","MAX_ITEMS","DEFAULT_TIMEOUT","API_VERSION"]});var Xa={};M(Xa,{default:()=>eo});import Z1 from"https://cdn.jsdelivr.net/npm/jszip@3/+esm";import{html as Ya}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function eo({user:e,weight:n=1,version:o=""}){let a="q-python-refactor-server",i="Refactor Python Code with VS Code",r={...e,version:o},s=Te(r),{wrongCode:t,namesToRefactor:c}=s,l=new Z1;l.file("refactor_me.py",t),l.file("README.md",`# ${s.scenario.title}

## Task

This Python code violates PEP 8 naming conventions. Several variables and functions use camelCase instead of the Python standard snake_case.

**Your job:**
1. Open \`refactor_me.py\` in VS Code
2. Use VS Code's "Rename Symbol" feature (F2) to refactor the incorrect names
3. Change camelCase names to snake_case
4. Submit the refactored code

**Important:**
- DO NOT change class names (PascalCase is correct for classes)
- DO NOT change constants (UPPER_CASE is correct for constants)
- Use VS Code's refactoring tools, NOT find-and-replace
- The code intentionally has similar names that should NOT be changed

## How to Use VS Code Rename Symbol

1. Place your cursor on a variable/function name
2. Press **F2** (or right-click \u2192 "Rename Symbol")
3. Type the new name
4. Press Enter - VS Code will rename ALL occurrences

This is much faster and safer than manual find-and-replace!

## PEP 8 Naming Conventions

- Functions and variables: \`snake_case\`
- Classes: \`PascalCase\`
- Constants: \`UPPER_CASE\`
`);let h=await l.generateAsync({type:"blob"}),d=URL.createObjectURL(h),f=Ya`
    <p>
      <strong>Scenario:</strong> You're reviewing code from a developer who learned Python after
      JavaScript. The code works but violates
      <a href="https://peps.python.org/pep-0008/" target="_blank">PEP 8</a> naming conventions by using
      camelCase instead of snake_case.
    </p>

    <p><strong>Your Task:</strong></p>
    <ol>
      <li>Download the ZIP file containing Python code</li>
      <li>Open <code>refactor_me.py</code> in VS Code</li>
      <li>Use VS Code's "Rename Symbol" (F2) to refactor non-compliant names to snake_case</li>
      <li>
        DO NOT change class names (PascalCase) or constants (UPPER_CASE) - they're already correct
      </li>
      <li>Submit the complete refactored code</li>
    </ol>

    <p>
      <a href="${d}" download="python_refactor.zip" class="btn btn-primary btn-sm">
        📥 Download Python Code (ZIP)
      </a>
    </p>

    <details class="my-3">
      <summary><strong>💡 How to Use VS Code's Rename Symbol</strong></summary>

      <h6>Method 1: Keyboard Shortcut (Recommended)</h6>
      <ol>
        <li>Click on the variable or function name to refactor</li>
        <li>Press <kbd>F2</kbd> (Windows/Linux) or <kbd>Fn+F2</kbd> (Mac)</li>
        <li>Type the new snake_case name (e.g., <code>get_user_data</code>)</li>
        <li>Press <kbd>Enter</kbd></li>
        <li>✓ All occurrences are renamed automatically!</li>
      </ol>

      <h6>Method 2: Right-Click Menu</h6>
      <ol>
        <li>Right-click on the variable or function name</li>
        <li>Select "Rename Symbol" from the context menu</li>
        <li>Type the new name and press Enter</li>
      </ol>

      <h6>Why Use Rename Symbol vs Find-Replace?</h6>
      <ul>
        <li><strong>Safe:</strong> Only renames the actual symbol, not similar text in comments/strings</li>
        <li><strong>Smart:</strong> Understands code scope and context</li>
        <li><strong>Fast:</strong> One action renames all occurrences</li>
        <li><strong>Accurate:</strong> Won't accidentally rename partial matches</li>
      </ul>

      <p class="text-warning mt-2">
        ⚠️ This question intentionally has names that look similar but should NOT be changed. Simple
        find-and-replace will fail!
      </p>
    </details>

    <details class="my-3">
      <summary><strong>📚 PEP 8 Naming Quick Reference</strong></summary>

      <table class="table table-sm">
        <thead>
          <tr>
            <th>Type</th>
            <th>Convention</th>
            <th>Example</th>
            <th>Refactor?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Functions</td>
            <td>snake_case</td>
            <td><code>get_user_data()</code></td>
            <td class="text-success">✓ YES</td>
          </tr>
          <tr>
            <td>Variables</td>
            <td>snake_case</td>
            <td><code>max_retries</code></td>
            <td class="text-success">✓ YES</td>
          </tr>
          <tr>
            <td>Classes</td>
            <td>PascalCase</td>
            <td><code>DataProcessor</code></td>
            <td class="text-danger">✗ NO</td>
          </tr>
          <tr>
            <td>Constants</td>
            <td>UPPER_CASE</td>
            <td><code>MAX_ITEMS</code></td>
            <td class="text-danger">✗ NO</td>
          </tr>
        </tbody>
      </table>
    </details>

    <details class="my-3">
      <summary><strong>🎯 Names to Refactor</strong></summary>
      <p>You need to refactor these ${c.length} names from camelCase to snake_case:</p>
      <ul>
        ${c.map(b=>Ya`<li><code>${b.wrong}</code> → <code>${b.correct}</code></li>`)}
      </ul>
      <p class="text-muted">
        Each name appears multiple times in the code (~5-8 occurrences). Using VS Code's Rename Symbol
        (F2) will change all occurrences at once.
      </p>
    </details>

    <div class="mb-3">
      <label for="${a}" class="form-label">
        <strong>Paste your complete refactored Python code here</strong>
      </label>
      <textarea
        class="form-control font-monospace"
        id="${a}"
        name="${a}"
        rows="20"
        placeholder="Paste the entire contents of refactor_me.py after refactoring..."
        required
        style="font-size: 0.875rem"
      ></textarea>
      <div class="form-text">Copy all the code from VS Code after refactoring and paste it here.</div>
    </div>

    <div class="alert alert-info" role="alert">
      <strong>🎓 This question tests your ability to:</strong>
      <ul class="mb-0">
        <li>Use VS Code's powerful refactoring tools</li>
        <li>Apply Python PEP 8 naming conventions</li>
        <li>Understand the difference between safe refactoring and simple find-replace</li>
        <li>Work efficiently with code editing tools</li>
      </ul>
    </div>
  `;return{id:a,title:i,weight:n,question:f,answer:await Ha(r)}}var Qa=k(()=>{"use strict";Wa()});function Pe(e){let n="q-broken-json-server",o=e?.version??"",a=(0,at.default)(`${e?.email??""}#${n}${o}`),i=Za[Math.floor(a()*Za.length)],r=[];for(let d=0;d<300;d++)r.push({id:`record_${String(d).padStart(5,"0")}`,name:`Entry ${d}`,value:Math.floor(a()*1e4),status:a()<.5?"active":"inactive",category:["alpha","beta","gamma","delta"][Math.floor(a()*4)],timestamp:`2024-${String(Math.floor(a()*12)+1).padStart(2,"0")}-${String(Math.floor(a()*28)+1).padStart(2,"0")}T${String(Math.floor(a()*24)).padStart(2,"0")}:${String(Math.floor(a()*60)).padStart(2,"0")}:00Z`,metadata:{source:["system_a","system_b","system_c"][Math.floor(a()*3)],priority:Math.floor(a()*5)+1,tags:["tag1","tag2","tag3"].slice(0,Math.floor(a()*3)+1)},description:`This is a sample ${i.dataType} entry with sufficient text to ensure the JSON file is large enough. `.repeat(3)});let s=JSON.stringify(r,null,2),t=s,c=[],l=t.split(`
`),h=[];for(let d=0;d<20;d++){let f;do f=Math.floor(a()*l.length);while(h.includes(f));h.push(f)}h.sort((d,f)=>f-d);for(let d=0;d<h.length;d++){let f=h[d],b=l[f];switch(d%6){case 0:b.trim().endsWith(",")&&(l[f]=b.replace(/,$/,""),c.push({line:f+1,type:"missing_comma"}));break;case 1:(b.trim().endsWith("}")||b.trim().endsWith("]"))&&(l[f]=b.replace(/([}\]])$/,",$1"),c.push({line:f+1,type:"extra_comma"}));break;case 2:b.includes('":')&&(l[f]=b.replace(/"(\w+)":/,"$1:"),c.push({line:f+1,type:"missing_quote"}));break;case 3:b.includes('":')&&(l[f]=b.replace(/"(\w+)":/,"'$1':"),c.push({line:f+1,type:"single_quote"}));break;case 4:b.trim()==="{"&&(l[f]=b.replace("{",""),c.push({line:f+1,type:"missing_brace"}));break;case 5:(b.trim()==="},"||b.trim()==="}")&&(l[f]=b.replace("}","}}"),c.push({line:f+1,type:"extra_brace"}));break}}return t=l.join(`
`),{scenario:i,validJson:s,brokenJson:t,errorLog:c,errorCount:c.length}}function et(e){try{let n=JSON.parse(e);return JSON.stringify(n)}catch{return null}}async function tt(e){return async n=>{let{validJson:o}=Pe(e);if(!n||typeof n!="string")throw new Error("Please submit the fixed JSON.");let a=et(n);if(!a){let t="JSON is still invalid. ";try{JSON.parse(n)}catch(c){let l=c.message.match(/position (\d+)/);if(l){let h=parseInt(l[1]),d=n.substring(Math.max(0,h-50),h+50);t+=`Error near position ${h}: "${d}...". ${c.message}. Common issues: missing commas, extra commas, unquoted keys, single quotes, mismatched braces.`}else t+=`Parse error: ${c.message}`}throw new Error(t)}let i=et(o);if(a===i)return!0;let r=JSON.parse(n),s=JSON.parse(o);if(Array.isArray(r)&&Array.isArray(s)){if(r.length!==s.length)throw new Error(`Correct JSON syntax but wrong data. Expected ${s.length} records, got ${r.length}. Make sure you didn't accidentally delete or duplicate any records while fixing errors.`);for(let t=0;t<Math.min(3,r.length);t++)if(JSON.stringify(r[t])!==JSON.stringify(s[t]))throw new Error(`Record ${t} doesn't match expected data. Make sure you only fixed syntax errors without changing values.`)}throw new Error("Valid JSON but content doesn't match. Ensure you only fixed syntax errors without modifying any data values.")}}var at,Za,ot=k(()=>{"use strict";at=_(O(),1),Za=[{name:"config_export",title:"Fix Corrupted Configuration Export",description:"A configuration export was corrupted during transfer - fix the JSON errors",context:"application configuration",dataType:"configuration settings"},{name:"api_response",title:"Repair Malformed API Response",description:"API response was corrupted - fix syntax errors to parse the data",context:"API integration",dataType:"API records"},{name:"database_dump",title:"Fix Broken Database Export",description:"Database JSON export has syntax errors - repair for data recovery",context:"data migration",dataType:"database records"},{name:"log_export",title:"Repair Corrupted Log Export",description:"Log export was corrupted - fix JSON to analyze the logs",context:"log analysis",dataType:"log entries"}]});var nt={};M(nt,{default:()=>oo});import ao from"https://cdn.jsdelivr.net/npm/jszip@3/+esm";import{html as to}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function oo({user:e,weight:n=1,version:o=""}){let a="q-broken-json-server",i="Fix Broken JSON File",r={...e,version:o},s=Pe(r),{brokenJson:t,errorCount:c}=s,l=new ao;l.file("broken.json",t),l.file("README.md",`# ${s.scenario.title}

## Problem

This JSON file was corrupted during ${s.scenario.context}. It contains approximately ${c} syntax errors that prevent it from being parsed.

**Common error types:**
- Missing commas between array/object elements
- Extra commas before closing braces/brackets
- Missing quotes around property names
- Single quotes instead of double quotes
- Missing or extra braces/brackets

## Task

1. Download \`broken.json\`
2. Fix all syntax errors
3. Validate the JSON parses correctly
4. Submit the fixed JSON

## Validation

You can validate JSON using:

**Python:**
\`\`\`bash
python -m json.tool broken.json
\`\`\`

**Node.js:**
\`\`\`bash
node -e "JSON.parse(require('fs').readFileSync('broken.json', 'utf8'))"
\`\`\`

**Online:**
- https://jsonlint.com/
- VS Code: Install "JSON Tools" extension

## Tips

- Use a text editor with JSON syntax highlighting (VS Code, Sublime)
- Fix errors one at a time, validate frequently
- Look for: missing commas, extra commas, quote issues
- The file is ${(t.length/1024).toFixed(0)}KB - be patient!
`);let h=await l.generateAsync({type:"blob"}),d=URL.createObjectURL(h),f=to`
    <p>
      <strong>Scenario:</strong> A critical JSON file from your ${s.scenario.context} was
      corrupted. The file contains ~${c} syntax errors. Your job is to fix all errors so the
      JSON can be parsed.
    </p>

    <p><strong>Your Task:</strong></p>
    <ol>
      <li>Download the broken JSON file (~${(t.length/1024).toFixed(0)}KB)</li>
      <li>Identify and fix all syntax errors</li>
      <li>Validate the JSON parses correctly</li>
      <li>Submit the fixed JSON</li>
    </ol>

    <p>
      <a href="${d}" download="broken_json.zip" class="btn btn-primary btn-sm">
        📥 Download Broken JSON (ZIP)
      </a>
    </p>

    <details class="my-3">
      <summary><strong>🔍 Common JSON Errors</strong></summary>

      <table class="table table-sm">
        <thead>
          <tr>
            <th>Error Type</th>
            <th>Example (Wrong)</th>
            <th>Fixed</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Missing comma</td>
            <td><code>{"a": 1 "b": 2}</code></td>
            <td><code>{"a": 1, "b": 2}</code></td>
          </tr>
          <tr>
            <td>Extra comma</td>
            <td><code>{"a": 1, "b": 2,}</code></td>
            <td><code>{"a": 1, "b": 2}</code></td>
          </tr>
          <tr>
            <td>Missing quotes</td>
            <td><code>{name: "Alice"}</code></td>
            <td><code>{"name": "Alice"}</code></td>
          </tr>
          <tr>
            <td>Single quotes</td>
            <td><code>{'name': 'Alice'}</code></td>
            <td><code>{"name": "Alice"}</code></td>
          </tr>
          <tr>
            <td>Missing brace</td>
            <td><code>["a": 1}</code></td>
            <td><code>{"a": 1}</code></td>
          </tr>
          <tr>
            <td>Extra brace</td>
            <td><code>{"a": 1}}</code></td>
            <td><code>{"a": 1}</code></td>
          </tr>
        </tbody>
      </table>
    </details>

    <details class="my-3">
      <summary><strong>🛠️ Validation Tools</strong></summary>

      <h6>Command Line (Python):</h6>
      <pre><code># Validate JSON and pretty-print
python -m json.tool broken.json fixed.json

# Just validate (shows error position)
python -c "import json; json.load(open('broken.json'))"</code></pre>

      <h6>Command Line (Node.js):</h6>
      <pre><code># Validate and show errors
node -e "JSON.parse(require('fs').readFileSync('broken.json', 'utf8'))"

# Validate and pretty-print
node -e "console.log(JSON.stringify(JSON.parse(require('fs').readFileSync('broken.json')), null, 2))" > fixed.json</code></pre>

      <h6>VS Code:</h6>
      <ul>
        <li>Open the JSON file - syntax errors are highlighted in red</li>
        <li>Hover over red squiggles to see error messages</li>
        <li>Use "Format Document" (Shift+Alt+F) after fixing to check if valid</li>
      </ul>

      <h6>Online Validators:</h6>
      <ul>
        <li><a href="https://jsonlint.com/" target="_blank">JSONLint</a></li>
        <li><a href="https://jsonformatter.org/" target="_blank">JSON Formatter</a></li>
      </ul>
    </details>

    <details class="my-3">
      <summary><strong>💡 Fixing Strategy</strong></summary>

      <ol>
        <li>
          <strong>Use a good editor:</strong> VS Code or Sublime with JSON syntax highlighting
        </li>
        <li>
          <strong>Find first error:</strong> Run validation tool to find first error position
        </li>
        <li><strong>Fix one error:</strong> Fix the reported error</li>
        <li><strong>Validate again:</strong> Check if there are more errors</li>
        <li><strong>Repeat:</strong> Continue until JSON is valid</li>
        <li>
          <strong>Final check:</strong> Use <code>python -m json.tool</code> or online validator
        </li>
      </ol>

      <p class="text-warning mt-2">
        ⚠️ Don't try to fix all errors at once - fix one, validate, repeat!
      </p>
    </details>

    <details class="my-3">
      <summary><strong>⚠️ Important Notes</strong></summary>

      <ul>
        <li>
          <strong>Only fix syntax:</strong> Don't change any data values - only fix syntax errors
        </li>
        <li>
          <strong>Don't delete records:</strong> All ${(t.match(/\{/g)||[]).length} records
          must remain
        </li>
        <li>
          <strong>Preserve formatting:</strong> You can reformat, but don't change structure
        </li>
        <li>
          <strong>Validate thoroughly:</strong> Make sure the entire JSON parses without errors
        </li>
      </ul>
    </details>

    <div class="mb-3">
      <label for="${a}" class="form-label">
        <strong>Paste your fixed JSON here</strong>
      </label>
      <textarea
        class="form-control font-monospace"
        id="${a}"
        name="${a}"
        rows="20"
        placeholder="Paste the entire fixed JSON file..."
        required
        style="font-size: 0.875rem"
      ></textarea>
      <div class="form-text">
        The JSON must be syntactically valid and contain all original data (only syntax should be
        fixed).
      </div>
    </div>

    <div class="alert alert-info" role="alert">
      <strong>🎓 This question tests your ability to:</strong>
      <ul class="mb-0">
        <li>Debug JSON syntax errors</li>
        <li>Use validation tools effectively</li>
        <li>Work with large data files</li>
        <li>Apply systematic debugging methodology</li>
      </ul>
    </div>
  `;return{id:a,title:i,weight:n,question:f,answer:await tt(r)}}var st=k(()=>{"use strict";ot()});function Me(e){let n="q-cross-lingual-entity-disambiguation-server",o=e?.email??"",a=e?.version??"",i=(0,it.default)(`${o}#${n}${a}`),r=16+Math.floor(i()*6),s=le([...so],r,i),t={};s.forEach((h,d)=>{t[h.canonicalName]=`E${String(d+1).padStart(3,"0")}`});let c=[],l={};for(let h=0;h<1e3;h++){let d=`DOC-${String(h+1).padStart(4,"0")}`,f=U(s,i),b=U(rt,i),u=f.variants[b],y=U(ro[b],i),w=U(io[b],i),p=U(co,i),v=f.era.match(/(\d+)/g),g;if(v&&v.length>=1){let S=parseInt(v[0]),I=v.length>=2?parseInt(v[1]):S+50;g=S+Math.floor(i()*Math.max(1,I-S))}else g=U(ct,i);let m=u;if(i()<.08){let S=Math.floor(i()*Math.max(1,m.length-2))+1;m=m.slice(0,S)+m[S+1]+m[S]+m.slice(S+2)}let x=`${y} ${m} ${w} (${p}, ${g}).`;c.push({doc_id:d,language:b,year:g,text:x,mentioned_name:m,source_region:f.region}),l[d]=t[f.canonicalName]}return{documents:c,selectedEntities:s,entityMap:t,answerMapping:l,languages:rt,languageNames:no}}async function dt(e){return async n=>{let{answerMapping:o}=Me(e);if(!n||!n.trim())throw new Error("Please paste your CSV mapping.");let a=n.trim().split(/\r?\n/),i=a[0].toLowerCase().includes("doc_id")?1:0,r=a.slice(i);if(r.length!==1e3)throw new Error(`Expected 1000 data rows, got ${r.length}. Submit one row per document.`);let s=0,t=[];for(let l of r){let h=l.split(",").map(b=>b.trim());if(h.length<2){t.push(`Malformed line: "${l}"`);continue}let[d,f]=h;if(!o[d]){t.push(`Unknown doc_id: ${d}`);continue}o[d]===f&&s++}let c=s/1e3;if(c<.95)throw new Error(`Accuracy: ${(c*100).toFixed(1)}% (${s}/1000 correct). Need \u226595%. ${t.length>0?`First issue: ${t[0]}`:""}`);return!0}}var it,rt,no,so,ro,io,co,ct,lt=k(()=>{"use strict";it=_(O(),1);Re();rt=["en","es","fr","de","it","pt","nl","ru","pl","cs","ar","zh","ja","ko","tr"],no={en:"English",es:"Spanish",fr:"French",de:"German",it:"Italian",pt:"Portuguese",nl:"Dutch",ru:"Russian",pl:"Polish",cs:"Czech",ar:"Arabic",zh:"Chinese",ja:"Japanese",ko:"Korean",tr:"Turkish"},so=[{canonicalName:"John I of Portugal",role:"King",era:"1357\u20131433",region:"Portugal",variants:{en:"John I",es:"Juan I de Portugal",fr:"Jean Ier de Portugal",de:"Johann I. von Portugal",it:"Giovanni I del Portogallo",pt:"Jo\xE3o I de Portugal",nl:"Jan I van Portugal",ru:"\u0416\u0443\u0430\u043D I \u041F\u043E\u0440\u0442\u0443\u0433\u0430\u043B\u044C\u0441\u043A\u0438\u0439",pl:"Jan I Portugalski",cs:"Jan I. Portugalsk\xFD",ar:"\u062C\u0648\u0627\u0648 \u0627\u0644\u0623\u0648\u0644",zh:"\u82E5\u6602\u4E00\u4E16",ja:"\u30B8\u30E7\u30A2\u30F31\u4E16",ko:"\uC8FC\uC559 1\uC138",tr:"I. Jo\xE3o"}},{canonicalName:"John II of Castile",role:"King",era:"1405\u20131454",region:"Castile",variants:{en:"John II",es:"Juan II de Castilla",fr:"Jean II de Castille",de:"Johann II. von Kastilien",it:"Giovanni II di Castiglia",pt:"Jo\xE3o II de Castela",nl:"Jan II van Castili\xEB",ru:"\u0425\u0443\u0430\u043D II \u041A\u0430\u0441\u0442\u0438\u043B\u044C\u0441\u043A\u0438\u0439",pl:"Jan II Kastylijski",cs:"Jan II. Kastilsk\xFD",ar:"\u062E\u0648\u0627\u0646 \u0627\u0644\u062B\u0627\u0646\u064A",zh:"\u80E1\u5B89\u4E8C\u4E16",ja:"\u30D5\u30A2\u30F32\u4E16",ko:"\uD6C4\uC548 2\uC138",tr:"II. Juan"}},{canonicalName:"Ivan III of Russia",role:"Grand Prince",era:"1440\u20131505",region:"Russia",variants:{en:"Ivan III",es:"Iv\xE1n III de Rusia",fr:"Ivan III de Russie",de:"Iwan III.",it:"Ivan III di Russia",pt:"Iv\xE3 III da R\xFAssia",nl:"Ivan III van Rusland",ru:"\u0418\u0432\u0430\u043D III \u0412\u0435\u043B\u0438\u043A\u0438\u0439",pl:"Iwan III Srogi",cs:"Ivan III. Velik\xFD",ar:"\u0625\u064A\u0641\u0627\u0646 \u0627\u0644\u062B\u0627\u0644\u062B",zh:"\u4F0A\u51E1\u4E09\u4E16",ja:"\u30A4\u30F4\u30A1\u30F33\u4E16",ko:"\uC774\uBC18 3\uC138",tr:"III. \u0130van"}},{canonicalName:"Ivan IV of Russia",role:"Tsar",era:"1530\u20131584",region:"Russia",variants:{en:"Ivan IV the Terrible",es:"Iv\xE1n IV el Terrible",fr:"Ivan IV le Terrible",de:"Iwan IV. der Schreckliche",it:"Ivan IV il Terribile",pt:"Iv\xE3 IV o Terr\xEDvel",nl:"Ivan IV de Verschrikkelijke",ru:"\u0418\u0432\u0430\u043D IV \u0413\u0440\u043E\u0437\u043D\u044B\u0439",pl:"Iwan IV Gro\u017Any",cs:"Ivan IV. Hrozn\xFD",ar:"\u0625\u064A\u0641\u0627\u0646 \u0627\u0644\u0631\u0627\u0628\u0639 \u0627\u0644\u0631\u0647\u064A\u0628",zh:"\u4F0A\u51E1\u56DB\u4E16",ja:"\u30A4\u30F4\u30A1\u30F34\u4E16\u96F7\u5E1D",ko:"\uC774\uBC18 4\uC138",tr:"IV. \u0130van"}},{canonicalName:"Charles V, Holy Roman Emperor",role:"Emperor",era:"1500\u20131558",region:"Holy Roman Empire",variants:{en:"Charles V",es:"Carlos V",fr:"Charles Quint",de:"Karl V.",it:"Carlo V",pt:"Carlos V",nl:"Karel V",ru:"\u041A\u0430\u0440\u043B V",pl:"Karol V",cs:"Karel V.",ar:"\u0634\u0627\u0631\u0644 \u0627\u0644\u062E\u0627\u0645\u0633",zh:"\u67E5\u7406\u4E94\u4E16",ja:"\u30AB\u30FC\u30EB5\u4E16",ko:"\uCE74\uB97C 5\uC138",tr:"V. Karl"}},{canonicalName:"Charles I of England",role:"King",era:"1600\u20131649",region:"England",variants:{en:"Charles I",es:"Carlos I de Inglaterra",fr:"Charles Ier d'Angleterre",de:"Karl I. von England",it:"Carlo I d'Inghilterra",pt:"Carlos I de Inglaterra",nl:"Karel I van Engeland",ru:"\u041A\u0430\u0440\u043B I \u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439",pl:"Karol I Stuart",cs:"Karel I. Anglick\xFD",ar:"\u062A\u0634\u0627\u0631\u0644\u0632 \u0627\u0644\u0623\u0648\u0644",zh:"\u67E5\u7406\u4E00\u4E16",ja:"\u30C1\u30E3\u30FC\u30EB\u30BA1\u4E16",ko:"\uCC30\uC2A4 1\uC138",tr:"I. Charles"}},{canonicalName:"Peter the Great",role:"Tsar/Emperor",era:"1672\u20131725",region:"Russia",variants:{en:"Peter the Great",es:"Pedro el Grande",fr:"Pierre le Grand",de:"Peter der Gro\xDFe",it:"Pietro il Grande",pt:"Pedro o Grande",nl:"Peter de Grote",ru:"\u041F\u0451\u0442\u0440 \u0412\u0435\u043B\u0438\u043A\u0438\u0439",pl:"Piotr Wielki",cs:"Petr Velik\xFD",ar:"\u0628\u0637\u0631\u0633 \u0627\u0644\u0623\u0643\u0628\u0631",zh:"\u5F7C\u5F97\u5927\u5E1D",ja:"\u30D4\u30E7\u30FC\u30C8\u30EB\u5927\u5E1D",ko:"\uD45C\uD2B8\uB974 \uB300\uC81C",tr:"B\xFCy\xFCk Petro"}},{canonicalName:"Peter III of Russia",role:"Emperor",era:"1728\u20131762",region:"Russia",variants:{en:"Peter III",es:"Pedro III de Rusia",fr:"Pierre III de Russie",de:"Peter III.",it:"Pietro III di Russia",pt:"Pedro III da R\xFAssia",nl:"Peter III van Rusland",ru:"\u041F\u0451\u0442\u0440 III",pl:"Piotr III",cs:"Petr III.",ar:"\u0628\u0637\u0631\u0633 \u0627\u0644\u062B\u0627\u0644\u062B",zh:"\u5F7C\u5F97\u4E09\u4E16",ja:"\u30D4\u30E7\u30FC\u30C8\u30EB3\u4E16",ko:"\uD45C\uD2B8\uB974 3\uC138",tr:"III. Petro"}},{canonicalName:"Frederick the Great",role:"King",era:"1712\u20131786",region:"Prussia",variants:{en:"Frederick the Great",es:"Federico el Grande",fr:"Fr\xE9d\xE9ric le Grand",de:"Friedrich der Gro\xDFe",it:"Federico il Grande",pt:"Frederico o Grande",nl:"Frederik de Grote",ru:"\u0424\u0440\u0438\u0434\u0440\u0438\u0445 \u0412\u0435\u043B\u0438\u043A\u0438\u0439",pl:"Fryderyk Wielki",cs:"Fridrich Velik\xFD",ar:"\u0641\u0631\u064A\u062F\u0631\u064A\u0634 \u0627\u0644\u0639\u0638\u064A\u0645",zh:"\u8153\u7279\u70C8\u5927\u5E1D",ja:"\u30D5\u30EA\u30FC\u30C9\u30EA\u30D2\u5927\u738B",ko:"\uD504\uB9AC\uB4DC\uB9AC\uD788 \uB300\uC655",tr:"B\xFCy\xFCk Friedrich"}},{canonicalName:"Frederick I of Prussia",role:"King",era:"1657\u20131713",region:"Prussia",variants:{en:"Frederick I",es:"Federico I de Prusia",fr:"Fr\xE9d\xE9ric Ier de Prusse",de:"Friedrich I. in Preu\xDFen",it:"Federico I di Prussia",pt:"Frederico I da Pr\xFAssia",nl:"Frederik I van Pruisen",ru:"\u0424\u0440\u0438\u0434\u0440\u0438\u0445 I \u041F\u0440\u0443\u0441\u0441\u043A\u0438\u0439",pl:"Fryderyk I Pruski",cs:"Fridrich I. Prusk\xFD",ar:"\u0641\u0631\u064A\u062F\u0631\u064A\u0634 \u0627\u0644\u0623\u0648\u0644",zh:"\u8153\u7279\u70C8\u4E00\u4E16",ja:"\u30D5\u30EA\u30FC\u30C9\u30EA\u30D21\u4E16",ko:"\uD504\uB9AC\uB4DC\uB9AC\uD788 1\uC138",tr:"I. Friedrich"}},{canonicalName:"Louis XIV of France",role:"King",era:"1638\u20131715",region:"France",variants:{en:"Louis XIV",es:"Luis XIV de Francia",fr:"Louis XIV",de:"Ludwig XIV.",it:"Luigi XIV",pt:"Lu\xEDs XIV",nl:"Lodewijk XIV",ru:"\u041B\u044E\u0434\u043E\u0432\u0438\u043A XIV",pl:"Ludwik XIV",cs:"Ludv\xEDk XIV.",ar:"\u0644\u0648\u064A\u0633 \u0627\u0644\u0631\u0627\u0628\u0639 \u0639\u0634\u0631",zh:"\u8DEF\u6613\u5341\u56DB",ja:"\u30EB\u30A414\u4E16",ko:"\uB8E8\uC774 14\uC138",tr:"XIV. Louis"}},{canonicalName:"Louis XVI of France",role:"King",era:"1754\u20131793",region:"France",variants:{en:"Louis XVI",es:"Luis XVI de Francia",fr:"Louis XVI",de:"Ludwig XVI.",it:"Luigi XVI",pt:"Lu\xEDs XVI",nl:"Lodewijk XVI",ru:"\u041B\u044E\u0434\u043E\u0432\u0438\u043A XVI",pl:"Ludwik XVI",cs:"Ludv\xEDk XVI.",ar:"\u0644\u0648\u064A\u0633 \u0627\u0644\u0633\u0627\u062F\u0633 \u0639\u0634\u0631",zh:"\u8DEF\u6613\u5341\u516D",ja:"\u30EB\u30A416\u4E16",ko:"\uB8E8\uC774 16\uC138",tr:"XVI. Louis"}},{canonicalName:"Alexander the Great",role:"King/Conqueror",era:"356\u2013323 BC",region:"Macedonia",variants:{en:"Alexander the Great",es:"Alejandro Magno",fr:"Alexandre le Grand",de:"Alexander der Gro\xDFe",it:"Alessandro Magno",pt:"Alexandre o Grande",nl:"Alexander de Grote",ru:"\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 \u0412\u0435\u043B\u0438\u043A\u0438\u0439",pl:"Aleksander Wielki",cs:"Alexandr Velik\xFD",ar:"\u0627\u0644\u0625\u0633\u0643\u0646\u062F\u0631 \u0627\u0644\u0623\u0643\u0628\u0631",zh:"\u4E9A\u5386\u5C71\u5927\u5927\u5E1D",ja:"\u30A2\u30EC\u30AF\u30B5\u30F3\u30C9\u30ED\u30B9\u5927\u738B",ko:"\uC54C\uB809\uC0B0\uB4DC\uB85C\uC2A4 \uB300\uC655",tr:"B\xFCy\xFCk \u0130skender"}},{canonicalName:"Alexander I of Russia",role:"Emperor",era:"1777\u20131825",region:"Russia",variants:{en:"Alexander I",es:"Alejandro I de Rusia",fr:"Alexandre Ier de Russie",de:"Alexander I.",it:"Alessandro I di Russia",pt:"Alexandre I da R\xFAssia",nl:"Alexander I van Rusland",ru:"\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 I",pl:"Aleksander I",cs:"Alexandr I.",ar:"\u0623\u0644\u0643\u0633\u0646\u062F\u0631 \u0627\u0644\u0623\u0648\u0644",zh:"\u4E9A\u5386\u5C71\u5927\u4E00\u4E16",ja:"\u30A2\u30EC\u30AF\u30B5\u30F3\u30C9\u30EB1\u4E16",ko:"\uC54C\uB809\uC0B0\uB4DC\uB974 1\uC138",tr:"I. Aleksandr"}},{canonicalName:"Alexander II of Russia",role:"Emperor",era:"1818\u20131881",region:"Russia",variants:{en:"Alexander II",es:"Alejandro II de Rusia",fr:"Alexandre II de Russie",de:"Alexander II.",it:"Alessandro II di Russia",pt:"Alexandre II da R\xFAssia",nl:"Alexander II van Rusland",ru:"\u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 II",pl:"Aleksander II",cs:"Alexandr II.",ar:"\u0623\u0644\u0643\u0633\u0646\u062F\u0631 \u0627\u0644\u062B\u0627\u0646\u064A",zh:"\u4E9A\u5386\u5C71\u5927\u4E8C\u4E16",ja:"\u30A2\u30EC\u30AF\u30B5\u30F3\u30C9\u30EB2\u4E16",ko:"\uC54C\uB809\uC0B0\uB4DC\uB974 2\uC138",tr:"II. Aleksandr"}},{canonicalName:"Philip II of Spain",role:"King",era:"1527\u20131598",region:"Spain",variants:{en:"Philip II",es:"Felipe II de Espa\xF1a",fr:"Philippe II d'Espagne",de:"Philipp II.",it:"Filippo II di Spagna",pt:"Filipe II de Espanha",nl:"Filips II van Spanje",ru:"\u0424\u0438\u043B\u0438\u043F\u043F II \u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439",pl:"Filip II Hiszpa\u0144ski",cs:"Filip II. \u0160pan\u011Blsk\xFD",ar:"\u0641\u064A\u0644\u064A\u0628 \u0627\u0644\u062B\u0627\u0646\u064A",zh:"\u8153\u529B\u4E8C\u4E16",ja:"\u30D5\u30A7\u30EA\u30DA2\u4E16",ko:"\uD3A0\uB9AC\uD398 2\uC138",tr:"II. Felipe"}},{canonicalName:"Philip IV of Spain",role:"King",era:"1605\u20131665",region:"Spain",variants:{en:"Philip IV",es:"Felipe IV de Espa\xF1a",fr:"Philippe IV d'Espagne",de:"Philipp IV.",it:"Filippo IV di Spagna",pt:"Filipe IV de Espanha",nl:"Filips IV van Spanje",ru:"\u0424\u0438\u043B\u0438\u043F\u043F IV \u0418\u0441\u043F\u0430\u043D\u0441\u043A\u0438\u0439",pl:"Filip IV Hiszpa\u0144ski",cs:"Filip IV. \u0160pan\u011Blsk\xFD",ar:"\u0641\u064A\u0644\u064A\u0628 \u0627\u0644\u0631\u0627\u0628\u0639",zh:"\u8153\u529B\u56DB\u4E16",ja:"\u30D5\u30A7\u30EA\u30DA4\u4E16",ko:"\uD3A0\uB9AC\uD398 4\uC138",tr:"IV. Felipe"}},{canonicalName:"George III of Britain",role:"King",era:"1738\u20131820",region:"Great Britain",variants:{en:"George III",es:"Jorge III del Reino Unido",fr:"George III du Royaume-Uni",de:"Georg III.",it:"Giorgio III del Regno Unito",pt:"Jorge III",nl:"George III",ru:"\u0413\u0435\u043E\u0440\u0433 III",pl:"Jerzy III",cs:"Ji\u0159\xED III.",ar:"\u062C\u0648\u0631\u062C \u0627\u0644\u062B\u0627\u0644\u062B",zh:"\u4E54\u6CBB\u4E09\u4E16",ja:"\u30B8\u30E7\u30FC\u30B83\u4E16",ko:"\uC870\uC9C0 3\uC138",tr:"III. George"}},{canonicalName:"George I of Greece",role:"King",era:"1845\u20131913",region:"Greece",variants:{en:"George I of Greece",es:"Jorge I de Grecia",fr:"Georges Ier de Gr\xE8ce",de:"Georg I. von Griechenland",it:"Giorgio I di Grecia",pt:"Jorge I da Gr\xE9cia",nl:"George I van Griekenland",ru:"\u0413\u0435\u043E\u0440\u0433 I \u0413\u0440\u0435\u0447\u0435\u0441\u043A\u0438\u0439",pl:"Jerzy I Grecki",cs:"Ji\u0159\xED I. \u0158eck\xFD",ar:"\u062C\u0648\u0631\u062C \u0627\u0644\u0623\u0648\u0644 \u0645\u0644\u0643 \u0627\u0644\u064A\u0648\u0646\u0627\u0646",zh:"\u4E54\u6CBB\u4E00\u4E16",ja:"\u30B2\u30AA\u30EB\u30AE\u30AA\u30B91\u4E16",ko:"\uC694\uB974\uC694\uC2A4 1\uC138",tr:"I. Georgios"}},{canonicalName:"Henry VIII of England",role:"King",era:"1491\u20131547",region:"England",variants:{en:"Henry VIII",es:"Enrique VIII de Inglaterra",fr:"Henri VIII d'Angleterre",de:"Heinrich VIII.",it:"Enrico VIII d'Inghilterra",pt:"Henrique VIII",nl:"Hendrik VIII",ru:"\u0413\u0435\u043D\u0440\u0438\u0445 VIII",pl:"Henryk VIII",cs:"Jind\u0159ich VIII.",ar:"\u0647\u0646\u0631\u064A \u0627\u0644\u062B\u0627\u0645\u0646",zh:"\u4EA8\u5229\u516B\u4E16",ja:"\u30D8\u30F3\u30EA\u30FC8\u4E16",ko:"\uD5E8\uB9AC 8\uC138",tr:"VIII. Henry"}},{canonicalName:"Henry IV of France",role:"King",era:"1553\u20131610",region:"France",variants:{en:"Henry IV",es:"Enrique IV de Francia",fr:"Henri IV de France",de:"Heinrich IV. von Frankreich",it:"Enrico IV di Francia",pt:"Henrique IV de Fran\xE7a",nl:"Hendrik IV van Frankrijk",ru:"\u0413\u0435\u043D\u0440\u0438\u0445 IV \u0424\u0440\u0430\u043D\u0446\u0443\u0437\u0441\u043A\u0438\u0439",pl:"Henryk IV Francuski",cs:"Jind\u0159ich IV. Francouzsk\xFD",ar:"\u0647\u0646\u0631\u064A \u0627\u0644\u0631\u0627\u0628\u0639",zh:"\u4EA8\u5229\u56DB\u4E16",ja:"\u30A2\u30F3\u30EA4\u4E16",ko:"\uC559\uB9AC 4\uC138",tr:"IV. Henri"}},{canonicalName:"William I of England",role:"King",era:"1028\u20131087",region:"England",variants:{en:"William the Conqueror",es:"Guillermo el Conquistador",fr:"Guillaume le Conqu\xE9rant",de:"Wilhelm der Eroberer",it:"Guglielmo il Conquistatore",pt:"Guilherme o Conquistador",nl:"Willem de Veroveraar",ru:"\u0412\u0438\u043B\u044C\u0433\u0435\u043B\u044C\u043C \u0417\u0430\u0432\u043E\u0435\u0432\u0430\u0442\u0435\u043B\u044C",pl:"Wilhelm Zdobywca",cs:"Vil\xE9m Dobyvatel",ar:"\u0648\u0644\u064A\u0627\u0645 \u0627\u0644\u0641\u0627\u062A\u062D",zh:"\u5F81\u670D\u8005\u5A01\u5EC9",ja:"\u30A6\u30A3\u30EA\u30A2\u30E0\u5F81\u670D\u738B",ko:"\uC815\uBCF5\uC655 \uC70C\uB9AC\uC5C4",tr:"Fatih William"}},{canonicalName:"William III of England",role:"King",era:"1650\u20131702",region:"England/Netherlands",variants:{en:"William III",es:"Guillermo III de Inglaterra",fr:"Guillaume III d'Angleterre",de:"Wilhelm III.",it:"Guglielmo III d'Inghilterra",pt:"Guilherme III",nl:"Willem III",ru:"\u0412\u0438\u043B\u044C\u0433\u0435\u043B\u044C\u043C III",pl:"Wilhelm III",cs:"Vil\xE9m III.",ar:"\u0648\u0644\u064A\u0627\u0645 \u0627\u0644\u062B\u0627\u0644\u062B",zh:"\u5A01\u5EC9\u4E09\u4E16",ja:"\u30A6\u30A3\u30EA\u30A2\u30E03\u4E16",ko:"\uC70C\uB9AC\uC5C4 3\uC138",tr:"III. William"}},{canonicalName:"Catherine the Great",role:"Empress",era:"1729\u20131796",region:"Russia",variants:{en:"Catherine the Great",es:"Catalina la Grande",fr:"Catherine la Grande",de:"Katharina die Gro\xDFe",it:"Caterina la Grande",pt:"Catarina a Grande",nl:"Catharina de Grote",ru:"\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u0412\u0435\u043B\u0438\u043A\u0430\u044F",pl:"Katarzyna Wielka",cs:"Kate\u0159ina Velik\xE1",ar:"\u0643\u0627\u062B\u0631\u064A\u0646 \u0627\u0644\u0639\u0638\u0645\u0649",zh:"\u53F6\u5361\u6377\u7433\u5A1C\u5927\u5E1D",ja:"\u30A8\u30AB\u30C1\u30A7\u30EA\u30FC\u30CA\u5927\u5E1D",ko:"\uC608\uCE74\uD14C\uB9AC\uB098 \uB300\uC81C",tr:"B\xFCy\xFCk Katerina"}},{canonicalName:"Catherine de' Medici",role:"Queen",era:"1519\u20131589",region:"France",variants:{en:"Catherine de' Medici",es:"Catalina de M\xE9dici",fr:"Catherine de M\xE9dicis",de:"Katharina von Medici",it:"Caterina de' Medici",pt:"Catarina de M\xE9dici",nl:"Catharina de' Medici",ru:"\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u041C\u0435\u0434\u0438\u0447\u0438",pl:"Katarzyna Medycejska",cs:"Kate\u0159ina Medicejsk\xE1",ar:"\u0643\u0627\u062B\u0631\u064A\u0646 \u062F\u064A \u0645\u064A\u062F\u064A\u062A\u0634\u064A",zh:"\u51EF\u745F\u7433\xB7\u5FB7\xB7\u7F8E\u7B2C\u5947",ja:"\u30AB\u30C8\u30EA\u30FC\u30CC\u30FB\u30C9\u30FB\u30E1\u30C7\u30A3\u30B7\u30B9",ko:"\uCE74\uD2B8\uB9B0 \uB4DC \uBA54\uB514\uC2DC\uC2A4",tr:"Catherine de M\xE9dicis"}}],ro={en:["In the chronicles of","Historical records state that","According to the annals,","Scholars note that"],es:["En las cr\xF3nicas de","Los registros hist\xF3ricos indican que","Seg\xFAn los anales,","Los eruditos se\xF1alan que"],fr:["Dans les chroniques de","Les archives historiques montrent que","Selon les annales,","Les historiens notent que"],de:["In den Chroniken von","Historische Aufzeichnungen besagen, dass","Laut den Annalen,","Wissenschaftler stellen fest, dass"],it:["Nelle cronache di","I documenti storici affermano che","Secondo gli annali,","Gli studiosi notano che"],pt:["Nas cr\xF4nicas de","Os registros hist\xF3ricos indicam que","De acordo com os anais,","Os estudiosos observam que"],nl:["In de kronieken van","Historische verslagen vermelden dat","Volgens de annalen,","Geleerden merken op dat"],ru:["\u0412 \u0445\u0440\u043E\u043D\u0438\u043A\u0430\u0445","\u0418\u0441\u0442\u043E\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u0435 \u0437\u0430\u043F\u0438\u0441\u0438 \u0433\u043B\u0430\u0441\u044F\u0442, \u0447\u0442\u043E","\u0421\u043E\u0433\u043B\u0430\u0441\u043D\u043E \u043B\u0435\u0442\u043E\u043F\u0438\u0441\u044F\u043C,","\u0423\u0447\u0451\u043D\u044B\u0435 \u043E\u0442\u043C\u0435\u0447\u0430\u044E\u0442, \u0447\u0442\u043E"],pl:["W kronikach","Zapisy historyczne wskazuj\u0105, \u017Ce","Wed\u0142ug rocznik\xF3w,","Uczeni zauwa\u017Caj\u0105, \u017Ce"],cs:["V kronik\xE1ch","Historick\xE9 z\xE1znamy uv\xE1d\u011Bj\xED, \u017Ee","Podle letopis\u016F,","U\u010Denci poznamen\xE1vaj\xED, \u017Ee"],ar:["\u0641\u064A \u0633\u062C\u0644\u0627\u062A","\u062A\u0634\u064A\u0631 \u0627\u0644\u0648\u062B\u0627\u0626\u0642 \u0627\u0644\u062A\u0627\u0631\u064A\u062E\u064A\u0629 \u0625\u0644\u0649 \u0623\u0646","\u0648\u0641\u0642\u064B\u0627 \u0644\u0644\u062D\u0648\u0644\u064A\u0627\u062A\u060C","\u064A\u0644\u0627\u062D\u0638 \u0627\u0644\u0639\u0644\u0645\u0627\u0621 \u0623\u0646"],zh:["\u5728\u7F16\u5E74\u53F2\u4E2D","\u5386\u53F2\u8BB0\u5F55\u8868\u660E","\u6839\u636E\u53F2\u518C\u8BB0\u8F7D\uFF0C","\u5B66\u8005\u4EEC\u6CE8\u610F\u5230"],ja:["\u5E74\u4EE3\u8A18\u306B\u3088\u308B\u3068","\u6B74\u53F2\u7684\u8A18\u9332\u306F\u8FF0\u3079\u3066\u3044\u308B","\u5E74\u9451\u306B\u3088\u308C\u3070\u3001","\u5B66\u8005\u305F\u3061\u306F\u6307\u6458\u3059\u308B"],ko:["\uC5F0\uB300\uAE30\uC5D0 \uB530\uB974\uBA74","\uC5ED\uC0AC\uC801 \uAE30\uB85D\uC5D0 \uC758\uD558\uBA74","\uC5F0\uAC10\uC5D0 \uB530\uB974\uBA74,","\uD559\uC790\uB4E4\uC740 \uC9C0\uC801\uD55C\uB2E4"],tr:["Kroniklerde","Tarih\xEE kay\u0131tlar \u015Funu belirtir:","Y\u0131ll\u0131klara g\xF6re,","Bilginler \u015Funu not eder:"]},io={en:["ascended to the throne","declared war on","signed a treaty with","commissioned the construction of","was crowned in"],es:["ascendi\xF3 al trono","declar\xF3 la guerra a","firm\xF3 un tratado con","orden\xF3 la construcci\xF3n de","fue coronado en"],fr:["acc\xE9da au tr\xF4ne","d\xE9clara la guerre \xE0","signa un trait\xE9 avec","ordonna la construction de","fut couronn\xE9 \xE0"],de:["bestieg den Thron","erkl\xE4rte den Krieg gegen","unterzeichnete einen Vertrag mit","beauftragte den Bau von","wurde gekr\xF6nt in"],it:["sal\xEC al trono","dichiar\xF2 guerra a","firm\xF2 un trattato con","commission\xF2 la costruzione di","fu incoronato a"],pt:["ascendeu ao trono","declarou guerra a","assinou um tratado com","encomendou a constru\xE7\xE3o de","foi coroado em"],nl:["besteeg de troon","verklaarde de oorlog aan","tekende een verdrag met","opdracht gaf tot de bouw van","werd gekroond in"],ru:["\u0432\u0437\u043E\u0448\u0451\u043B \u043D\u0430 \u043F\u0440\u0435\u0441\u0442\u043E\u043B","\u043E\u0431\u044A\u044F\u0432\u0438\u043B \u0432\u043E\u0439\u043D\u0443","\u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043B \u0434\u043E\u0433\u043E\u0432\u043E\u0440 \u0441","\u0437\u0430\u043A\u0430\u0437\u0430\u043B \u0441\u0442\u0440\u043E\u0438\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u043E","\u0431\u044B\u043B \u043A\u043E\u0440\u043E\u043D\u043E\u0432\u0430\u043D \u0432"],pl:["wst\u0105pi\u0142 na tron","wypowiedzia\u0142 wojn\u0119","podpisa\u0142 traktat z","zleci\u0142 budow\u0119","zosta\u0142 koronowany w"],cs:["nastoupil na tr\u016Fn","vyhl\xE1sil v\xE1lku","podepsal smlouvu s","nechal postavit","byl korunov\xE1n v"],ar:["\u0627\u0639\u062A\u0644\u0649 \u0627\u0644\u0639\u0631\u0634","\u0623\u0639\u0644\u0646 \u0627\u0644\u062D\u0631\u0628 \u0639\u0644\u0649","\u0648\u0642\u0651\u0639 \u0645\u0639\u0627\u0647\u062F\u0629 \u0645\u0639","\u0623\u0645\u0631 \u0628\u0628\u0646\u0627\u0621","\u062A\u064F\u0648\u0651\u062C \u0641\u064A"],zh:["\u767B\u4E0A\u738B\u4F4D","\u5411\u2026\u5BA3\u6218","\u4E0E\u2026\u7B7E\u8BA2\u6761\u7EA6","\u4E0B\u4EE4\u5EFA\u9020","\u5728\u2026\u52A0\u5195"],ja:["\u738B\u4F4D\u306B\u5C31\u3044\u305F","\u306B\u5BA3\u6226\u5E03\u544A\u3057\u305F","\u3068\u6761\u7D04\u3092\u7D50\u3093\u3060","\u306E\u5EFA\u8A2D\u3092\u547D\u3058\u305F","\u3067\u6234\u51A0\u3057\u305F"],ko:["\uC655\uC704\uC5D0 \uC62C\uB790\uB2E4","\uC5D0 \uC120\uC804\uD3EC\uACE0\uD588\uB2E4","\uC640 \uC870\uC57D\uC744 \uCCB4\uACB0\uD588\uB2E4","\uAC74\uC124\uC744 \uBA85\uB839\uD588\uB2E4","\uC5D0\uC11C \uB300\uAD00\uC2DD\uC744 \uAC00\uC84C\uB2E4"],tr:["tahta \xE7\u0131kt\u0131","sava\u015F ilan etti","antla\u015Fma imzalad\u0131","in\u015Fa ettirdi","ta\xE7 giydi"]},co=["Constantinople","Rome","Paris","London","Madrid","Vienna","Berlin","Moscow","Prague","Warsaw","Lisbon","Amsterdam","Cairo","Beijing","Constantinople","Venice","Florence","Ankara","Athens","Stockholm","Copenhagen","Seoul","Kyoto"],ct=[];for(let e=1e3;e<=1900;e+=1)ct.push(e)});var ft={};M(ft,{default:()=>ho});import lo from"https://cdn.jsdelivr.net/npm/jszip@3/+esm";import{html as fo}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function ho({user:e,weight:n=1,version:o=""}){let a="q-cross-lingual-entity-disambiguation-server",i="Cross-Lingual Entity Disambiguation",r={...e,version:o},{documents:s,selectedEntities:t,entityMap:c,languages:l,languageNames:h}=Me(r),d=["entity_id,canonical_name,role,era,region"];for(let v of t)d.push(`${c[v.canonicalName]},"${v.canonicalName}",${v.role},"${v.era}",${v.region}`);let f=d.join(`
`),b=s.map(v=>JSON.stringify(v)).join(`
`),u=new lo;u.file("documents.jsonl",b),u.file("entity_reference.csv",f),u.file("README.md",`# Cross-Lingual Entity Disambiguation Challenge

## Dataset
- **documents.jsonl**: ${s.length} historical document excerpts across ${l.length} languages
- **entity_reference.csv**: Reference list of ${t.length} canonical historical entities

## Document Format (JSONL)
Each line is a JSON object with:
- \`doc_id\`: Unique document identifier (DOC-0001 to DOC-1000)
- \`language\`: ISO 639-1 language code (${l.join(", ")})
- \`year\`: Year of the event described
- \`text\`: The document text mentioning a historical figure
- \`mentioned_name\`: The name as it appears in the document (may include typos)
- \`source_region\`: Geographic region

## Entity Reference CSV
Contains canonical entity information:
- \`entity_id\`: Unique entity identifier (E001, E002, ...)
- \`canonical_name\`: The standardised English name
- \`role\`: Historical role (King, Emperor, etc.)
- \`era\`: Time period
- \`region\`: Geographic origin

## Task
Map each document to its correct entity_id. Names like "Juan", "Jean", "Johann",
"Giovanni", "Jo\xE3o", and "Ivan" may all refer to DIFFERENT historical persons.
Your pipeline must disambiguate based on context, era, region, and cross-lingual
name equivalences.

## Output Format
Submit a CSV with exactly two columns:
\`\`\`
doc_id,entity_id
DOC-0001,E003
DOC-0002,E017
...
\`\`\`
`);let y=await u.generateAsync({type:"blob"}),w=await dt(r),p=fo`
    <div class="mb-3">
      <h2 id="cross-lingual-entity-disambiguation">Cross-Lingual Entity Disambiguation Pipeline</h2>
      <p>
        <strong>HistoriGraph AI</strong> is building the world's largest knowledge graph of historical figures. They
        have collected <strong>1,000 document excerpts</strong> in <strong>${l.length} languages</strong>
        (${Object.values(h).join(", ")}), each mentioning a historical figure. However, the same person
        may be referred to by very different names across languages — e.g., <em>John</em> (English),
        <em>Juan</em> (Spanish), <em>Jean</em> (French), <em>Johann</em> (German), <em>Giovanni</em> (Italian),
        <em>Иван</em> (Russian).
      </p>

      <p>
        The challenge is that multiple <strong>different</strong> historical persons share the same root name.
        For example, "Ivan III" and "Ivan IV" are different people; "Catherine the Great" and
        "Catherine de' Medici" are different people — even though their names look similar within and across languages.
      </p>

      <h3>Your Task</h3>
      <ol>
        <li>Download the ZIP archive containing the document dataset and entity reference</li>
        <li>
          Build an <strong>LLM-powered pipeline</strong> that reads each document, identifies which historical
          entity is being mentioned, and maps it to the correct <code>entity_id</code> from the reference list
        </li>
        <li>
          Your pipeline must handle:
          <ul>
            <li><strong>Cross-lingual name variants</strong> (Juan = Jean = Johann = Giovanni = ...)</li>
            <li><strong>Disambiguation</strong> between similar entities (Ivan III ≠ Ivan IV)</li>
            <li><strong>Minor typos</strong> in names (~8% of documents have character swaps)</li>
            <li><strong>Contextual clues</strong> like era, region, and described events</li>
          </ul>
        </li>
        <li>Output a strict CSV with columns: <code>doc_id,entity_id</code></li>
      </ol>

      <p>
        <button class="btn btn-sm btn-outline-primary" type="button" @click=${()=>B(y,`${a}.zip`)}>
          📥 Download Dataset (ZIP)
        </button>
      </p>

      <details class="my-3">
        <summary><strong>📊 Dataset Statistics</strong></summary>
        <ul>
          <li><strong>Documents:</strong> ${s.length}</li>
          <li><strong>Languages:</strong> ${l.length} (${l.join(", ")})</li>
          <li><strong>Unique entities:</strong> ${t.length}</li>
          <li><strong>Documents with typos:</strong> ~8%</li>
        </ul>
      </details>

      <details class="my-3">
        <summary><strong>💡 Approach Hints</strong></summary>
        <h6>Recommended pipeline:</h6>
        <ol>
          <li>Parse the JSONL documents and entity reference CSV</li>
          <li>For each document, extract the <code>mentioned_name</code>, <code>language</code>, <code>year</code>,
              and <code>source_region</code></li>
          <li>Use an LLM to match mentioned names to entity candidates by considering:
            <ul>
              <li>Cross-lingual name equivalence tables</li>
              <li>Era/date range overlap</li>
              <li>Geographic context</li>
            </ul>
          </li>
          <li>For ambiguous cases, use the full document text for disambiguation</li>
        </ol>

        <h6>Python skeleton:</h6>
        <pre><code>import json, csv

# Load documents
docs = [json.loads(line) for line in open("documents.jsonl")]

# Load entity reference
entities = list(csv.DictReader(open("entity_reference.csv")))

# For each document, call LLM to disambiguate
results = []
for doc in docs:
    prompt = f"""Given this historical document excerpt:
    Text: {doc['text']}
    Language: {doc['language']}
    Year: {doc['year']}
    Mentioned name: {doc['mentioned_name']}

    Which of these entities is mentioned?
    {entities}

    Reply with just the entity_id."""

    entity_id = call_llm(prompt)  # Your LLM call here
    results.append({"doc_id": doc["doc_id"], "entity_id": entity_id})

# Write CSV
with open("output.csv", "w") as f:
    writer = csv.DictWriter(f, fieldnames=["doc_id", "entity_id"])
    writer.writeheader()
    writer.writerows(results)</code></pre>
      </details>

      <details class="my-3">
        <summary><strong>⚠️ Important Notes</strong></summary>
        <ul>
          <li><strong>Accuracy threshold:</strong> Your mapping must be ≥95% correct (at least 950/1000)</li>
          <li><strong>CSV format:</strong> Exactly two columns — <code>doc_id,entity_id</code></li>
          <li><strong>Include all 1000 documents</strong> in your output</li>
          <li><strong>Entity IDs</strong> must match exactly (e.g., E001, E017, not the canonical name)</li>
          <li>The header row <code>doc_id,entity_id</code> is optional</li>
        </ul>
      </details>

      <label for="${a}" class="form-label">
        <strong>Paste your CSV mapping below</strong> (doc_id,entity_id — 1000 rows)
      </label>
      <textarea
        class="form-control font-monospace"
        id="${a}"
        name="${a}"
        rows="15"
        placeholder="doc_id,entity_id&#10;DOC-0001,E003&#10;DOC-0002,E017&#10;..."
        required
        style="font-size: 0.875rem"
      ></textarea>
      <div class="form-text">
        Submit a CSV with 1000 rows mapping each doc_id to its entity_id. Accuracy must be ≥95%.
      </div>
    </div>

    <div class="alert alert-info" role="alert">
      <strong>🎓 This question tests your ability to:</strong>
      <ul class="mb-0">
        <li>Build an LLM-powered entity disambiguation pipeline</li>
        <li>Handle cross-lingual name variation (15 languages)</li>
        <li>Disambiguate similar entities using contextual clues</li>
        <li>Process large structured datasets programmatically</li>
        <li>Produce clean, validated CSV output</li>
      </ul>
    </div>
  `;return{id:a,title:i,weight:n,question:p,answer:w}}var ht=k(()=>{"use strict";lt();ie()});function Ne(e){let n="q-trick-question-server",o=e?.version??"",a=(0,ut.default)(`${e?.email??""}#${n}${o}`),i=bt[Math.floor(a()*bt.length)],r=pt[Math.floor(a()*pt.length)];return{decoyQuestion:i,realQuestion:r}}async function mt(e){return async n=>{let{realQuestion:o,decoyQuestion:a}=Ne(e);if(!n||typeof n!="string")throw new Error("Please submit your answer.");let i=n.toLowerCase().trim(),r=o.answer.toLowerCase();if(i===a.decoyAnswer.toLowerCase())throw new Error("This is a trick question. The answer you submitted is not correct. Read the instructions carefully.");if(i===r||i.includes(r))return!0;throw new Error("This is a trick question. Your answer is incorrect. Sometimes the real question isn't what it appears to be.")}}var ut,bt,pt,gt=k(()=>{"use strict";ut=_(O(),1),bt=[{question:"What is 2 + 2?",decoyAnswer:"4"},{question:"How many hours are in a day?",decoyAnswer:"24"},{question:"What color is the sky on a clear day?",decoyAnswer:"blue"},{question:"How many continents are there?",decoyAnswer:"7"},{question:"What is the capital of France?",decoyAnswer:"Paris"}],pt=[{chinese:"JavaScript\u4E2D\uFF0Ctypeof null\u8FD4\u56DE\u4EC0\u4E48\uFF1F",english:"In JavaScript, what does typeof null return?",answer:"object",hint:"JavaScript quirk"},{chinese:"HTTP\u72B6\u6001\u7801404\u4EE3\u8868\u4EC0\u4E48\u610F\u601D\uFF1F",english:"What does HTTP status code 404 mean?",answer:"not found",hint:"HTTP error"},{chinese:"\u5728SQL\u4E2D\uFF0C\u54EA\u4E2A\u5173\u952E\u5B57\u7528\u4E8E\u4ECE\u8868\u4E2D\u5220\u9664\u6240\u6709\u884C\uFF1F",english:"In SQL, which keyword is used to delete all rows from a table?",answer:"truncate",hint:"SQL command"},{chinese:"\u4EC0\u4E48\u662FREST API\u4E2D\u6700\u5E38\u7528\u7684\u6570\u636E\u683C\u5F0F\uFF1F",english:"What is the most commonly used data format in REST APIs?",answer:"json",hint:"Data format"},{chinese:"Git\u4E2D\u7528\u4E8E\u67E5\u770B\u63D0\u4EA4\u5386\u53F2\u7684\u547D\u4EE4\u662F\u4EC0\u4E48\uFF1F",english:"What is the Git command to view commit history?",answer:"git log",hint:"Git command"},{chinese:"\u5728Python\u4E2D\uFF0C\u7528\u4EC0\u4E48\u7B26\u53F7\u8868\u793A\u6CE8\u91CA\uFF1F",english:"What symbol is used for comments in Python?",answer:"#",hint:"Python syntax"},{chinese:"CSS\u4E2D\u7528\u4E8E\u9690\u85CF\u5143\u7D20\u7684display\u5C5E\u6027\u503C\u662F\u4EC0\u4E48\uFF1F",english:"What is the CSS display property value to hide an element?",answer:"none",hint:"CSS property"},{chinese:"\u5728Unix/Linux\u4E2D\uFF0C\u54EA\u4E2A\u547D\u4EE4\u7528\u4E8E\u67E5\u770B\u5F53\u524D\u76EE\u5F55\u8DEF\u5F84\uFF1F",english:"In Unix/Linux, which command shows the current directory path?",answer:"pwd",hint:"Shell command"}]});var yt={};M(yt,{default:()=>po});import{html as bo}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function po({user:e,weight:n=1,version:o=""}){let a="q-trick-question-server",i="Simple Question",r={...e,version:o},s=Ne(r),{decoyQuestion:t,realQuestion:c}=s,l=bo`
    <p><strong>Question:</strong> ${t.question}</p>

    <!-- 真正的问题在这里 -->
    <div class="comment" style="display: none;">
      <p>注意：这是一个技巧题。上面显示的问题不是真正的问题。</p>
      <p><strong>真正的问题是：</strong>${c.chinese}</p>
      <p>提示：使用浏览器的开发者工具（F12）查看源代码，或者右键点击页面选择"查看页面源代码"。</p>
      <p>找到这条消息后，使用AI工具（如ChatGPT、Claude、Google Translate等）翻译中文问题，然后回答翻译后的问题。</p>
    </div>
    <!-- End of hidden comment -->

    <p class="text-muted">
      This is a straightforward question. Just answer what is asked.
    </p>

    <div class="mb-3">
      <label for="${a}" class="form-label"> <strong>Your Answer:</strong> </label>
      <input
        type="text"
        class="form-control"
        id="${a}"
        name="${a}"
        placeholder="Type your answer here..."
        required
      />
      <div class="form-text">Enter your answer to the question above.</div>
    </div>

    <div class="alert alert-info" role="alert">
      <strong>💡 Tip:</strong> Sometimes in software development, things are not always as they appear.
      A good developer knows how to investigate and look beneath the surface.
    </div>
  `;return{id:a,title:i,weight:n,question:l,answer:await mt(r)}}var wt=k(()=>{"use strict";gt()});function Le(e){let n="q-asciirec-server",o=e?.version??"",a=(0,St.default)(`${e?.email??""}#${n}${o}`),i=vt[Math.floor(a()*vt.length)],r=xt[Math.floor(a()*xt.length)],s=`SESSION_${a().toString(36).substring(2,10).toUpperCase()}`;return{scenario:i,commands:r.commands,commandDescription:r.description,marker:s}}async function It(e){return async n=>{let{commands:o,marker:a}=Le(e);if(!n||typeof n!="string")throw new Error("Please submit the asciinema output file content.");let i=n.trim().split(`
`);if(i.length===0)throw new Error("Empty output submitted.");let r;try{r=JSON.parse(i[0])}catch{throw new Error("Invalid asciinema file format: Header is not valid JSON.")}r.version;let s="";for(let c=1;c<i.length;c++){let l=i[c].trim();if(l)try{let h=JSON.parse(l);if(Array.isArray(h)&&h.length===3){let[d,f,b]=h;f==="o"&&(s+=b)}}catch{continue}}if(!s.includes(a))throw new Error(`Missing session marker "${a}". Make sure to run the exact command sequence shown in the instructions.`);let t=[];for(let c of o)s.includes(c)||t.push(c);if(t.length>0)throw new Error(`Missing commands in output: ${t.join(", ")}. Make sure to type all commands exactly as shown.`);return!0}}var St,vt,xt,kt=k(()=>{"use strict";St=_(O(),1),vt=[{name:"git_workflow",title:"Record Git Workflow Tutorial",description:"Create a tutorial showing common Git commands",context:"version control tutorial"},{name:"file_operations",title:"Document File Operations",description:"Record file manipulation commands for documentation",context:"command line tutorial"},{name:"data_processing",title:"Create Data Processing Demo",description:"Record a data processing pipeline demonstration",context:"data analysis tutorial"},{name:"deployment_steps",title:"Record Deployment Procedure",description:"Document deployment steps with asciinema",context:"deployment documentation"}],xt=[{commands:["echo 'Hello World'","date","pwd"],description:"Basic shell commands"},{commands:["ls -la","cat /etc/os-release | head -5","whoami"],description:"System information"},{commands:["mkdir test_dir","cd test_dir","touch file.txt","ls"],description:"File operations"},{commands:["echo 'test' > output.txt","cat output.txt","wc -l output.txt"],description:"File manipulation"},{commands:["python --version","echo 'print(2 + 2)' | python","date +%Y-%m-%d"],description:"Python and date"}]});var $t={};M($t,{default:()=>uo});import{html as Ct}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";async function uo({user:e,weight:n=1,version:o=""}){let a="q-asciirec-server",i="Record Terminal Session with asciinema",r={...e,version:o},s=Le(r),{commands:t,marker:c,commandDescription:l}=s,h=Ct`
    <p>
      <strong>Scenario:</strong> You're creating ${s.scenario.context} for your team. Use
      <strong>asciinema</strong> (asciinema recorder) to record a terminal session showing
      ${l}.
    </p>

    <p><strong>Your Task:</strong></p>
    <ol>
      <li>Install/use asciinema: <code>uvx asciinema --version</code></li>
      <li>Start recording: <code>uvx asciinema rec session.cast</code></li>
      <li>Type the exact command sequence below (including the marker)</li>
      <li>Stop recording: Press <kbd>Ctrl+D</kbd></li>
      <li>Submit the contents of <code>session.cast</code> (JSON format)</li>
    </ol>

    <div class="alert alert-warning" role="alert">
      <strong>⚠️ IMPORTANT: Type these commands in this EXACT order:</strong>
      <ol class="mb-0">
        <li><code>echo '${c}'</code> <span class="text-danger">← Session marker (REQUIRED)</span></li>
        ${t.map(d=>Ct`<li><code>${d}</code></li>`)}
      </ol>
    </div>

    <details class="my-3">
      <summary><strong>📹 What is asciinema?</strong></summary>

      <p>
        <strong>asciinema</strong> (asciinema) is a terminal session recorder. It captures what you type
        and the output, saving it in a replayable format.
      </p>

      <h6>Why use it?</h6>
      <ul>
        <li>Create shareable terminal tutorials</li>
        <li>Document command sequences</li>
        <li>Debug issues by sharing exact terminal output</li>
        <li>Lightweight (text-based, not video)</li>
      </ul>

      <h6>Installation:</h6>
      <pre><code># Using uvx (no install needed)
uvx asciinema --version

# Or install globally
pip install asciinema</code></pre>
    </details>

    <details class="my-3">
      <summary><strong>🎬 How to Record</strong></summary>

      <h6>Step 1: Start Recording</h6>
      <pre><code>uvx asciinema rec session.cast</code></pre>

      <h6>Step 2: Type Commands</h6>
      <p>Your terminal is now being recorded. Type each command from the list above.</p>

      <h6>Step 3: Stop Recording</h6>
      <pre><code># Press Ctrl+D (or type 'exit')
# Recording saved to session.cast</code></pre>

      <h6>Step 4: View Output</h6>
      <pre><code># The .cast file is JSON format
cat session.cast

# Or play it back
uvx asciinema play session.cast</code></pre>

      <h6>Step 5: Submit</h6>
      <p>Copy the entire contents of <code>session.cast</code> and paste below.</p>
    </details>

    <details class="my-3">
      <summary><strong>💡 Tips & Troubleshooting</strong></summary>

      <h6>Common Issues:</h6>
      <ul>
        <li>
          <strong>Command not found:</strong> Use <code>uvx asciinema</code> instead of
          <code>asciinema</code>
        </li>
        <li>
          <strong>Wrong marker:</strong> Make sure to type the marker EXACTLY: <code>${c}</code>
        </li>
        <li>
          <strong>Missing commands:</strong> Type ALL commands in the list, in order
        </li>
        <li>
          <strong>Invalid output:</strong> Submit the raw JSON from .cast file, don't modify it
        </li>
      </ul>

      <h6>Testing:</h6>
      <pre><code># Test that asciinema works
uvx asciinema rec test.cast
echo "hello"
# Press Ctrl+D
cat test.cast</code></pre>
    </details>

    <details class="my-3">
      <summary><strong>📝 Example Output</strong></summary>

      <p>The <code>session.cast</code> file will look like this (JSON format):</p>
      <pre><code>{
  "version": 2,
  "width": 80,
  "height": 24,
  "timestamp": 1234567890,
  "env": {
    "SHELL": "/bin/bash",
    "TERM": "xterm-256color"
  },
  "stdout": [
    [0.1, "$ echo 'SESSION_MARKER'\\r\\n"],
    [0.2, "SESSION_MARKER\\r\\n"],
    [0.3, "$ command1\\r\\n"],
    [0.4, "output...\\r\\n"],
    ...
  ]
}</code></pre>
    </details>

    <div class="mb-3">
      <label for="${a}" class="form-label">
        <strong>Paste the contents of <code>session.cast</code> here</strong>
      </label>
      <textarea
        class="form-control font-monospace"
        id="${a}"
        name="${a}"
        rows="15"
        placeholder='{"version": 2, "width": 80, "height": 24, ...}'
        required
        style="font-size: 0.875rem"
      ></textarea>
      <div class="form-text">
        Submit the complete JSON output from <code>session.cast</code>. Must include marker
        <code>${c}</code> and all commands.
      </div>
    </div>

    <div class="alert alert-info" role="alert">
      <strong>🎓 This question tests your ability to:</strong>
      <ul class="mb-0">
        <li>Use terminal recording tools</li>
        <li>Follow command sequences precisely</li>
        <li>Capture and share terminal output</li>
        <li>Work with command-line tools like uvx</li>
      </ul>
    </div>

    <div class="alert alert-success" role="alert">
      <strong>✅ Verification:</strong> The session marker <code>${c}</code> proves you actually ran
      these commands (not copied from another student).
    </div>
  `;return{id:a,title:i,weight:n,question:h,answer:await It(r)}}var At=k(()=>{"use strict";kt()});var Rt={};M(Rt,{default:()=>wo});import{html as mo}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import go from"https://cdn.jsdelivr.net/npm/seedrandom/+esm";function yo(e,n,o){let a=[],i=new Date(n);for(let r=0;r<o;r++)for(let s of qe)for(let t of Oe){let c=new Date(i);c.setDate(i.getDate()+r),c.setHours(Math.floor(e()*24)),c.setMinutes(Math.floor(e()*60));let l;t==="temperature"?l=+(15+e()*20).toFixed(1):t==="humidity"?l=+(30+e()*50).toFixed(1):t==="pressure"?l=+(990+e()*30).toFixed(1):l=+(100+e()*800).toFixed(1),a.push({timestamp:c.toISOString(),location:s,sensor:t,value:l})}return a.sort((r,s)=>new Date(r.timestamp)-new Date(s.timestamp))}function Et(e,n,o,a,i){let r=e.filter(d=>{let f=new Date(d.timestamp),b=!n||d.location===n,u=!o||d.sensor===o,y=(!a||f>=new Date(a))&&(!i||f<=new Date(i));return b&&u&&y});if(r.length===0)return{count:0,avg:0,min:0,max:0};let s=r.map(d=>d.value),c=s.reduce((d,f)=>d+f,0)/s.length,l=Math.min(...s),h=Math.max(...s);return{count:r.length,avg:Number(c.toFixed(2)),min:Number(l.toFixed(2)),max:Number(h.toFixed(2))}}async function wo({user:e,weight:n=1,version:o=""}){let a="q-fastapi-timeseries-cache",i="FastAPI Time-Series Analytics with Caching",r=go(`${e.email}#${a}${o}`),c=yo(r,"2024-01-01",90),l=["timestamp,location,sensor,value",...c.map(p=>`${p.timestamp},${p.location},${p.sensor},${p.value}`)].join(`
`),h=new Blob([l],{type:"text/csv"}),d=qe[Math.floor(r()*qe.length)],f=Oe[Math.floor(r()*Oe.length)],b="2024-01-15",u="2024-02-15",y=async p=>{if(!p)throw new Error("URL is required");let v=p.trim().replace(/\/$/,""),g=new URLSearchParams({location:d,sensor:f}),m=await fetch(`${v}?${g.toString()}`);if(!m.ok)throw new Error(`Server returned HTTP ${m.status}`);let x=m.headers.get("access-control-allow-origin");if(x!==null&&x!=="*")throw new Error("Enable CORS with Access-Control-Allow-Origin: *");let S=await m.json(),I=Et(c,d,f,null,null);if(!S.stats)throw new Error("Response must include a 'stats' object");if(Math.abs(S.stats.avg-I.avg)>.1)throw new Error(`Incorrect avg: expected ${I.avg}, got ${S.stats.avg}`);if(S.stats.count!==I.count)throw new Error(`Incorrect count: expected ${I.count}, got ${S.stats.count}`);let $=await fetch(`${v}?${g.toString()}`);if(!$.ok)throw new Error("Second request failed");$.headers.get("x-cache")!=="HIT"&&console.warn("Warning: Second identical request should return X-Cache: HIT header");let E=new URLSearchParams({location:d,sensor:f,start_date:b,end_date:u}),N=await fetch(`${v}?${E.toString()}`);if(!N.ok)throw new Error("Date range query failed");let R=await N.json(),T=Et(c,d,f,b,u);if(Math.abs(R.stats.avg-T.avg)>.1)throw new Error(`Date range query incorrect: expected avg ${T.avg}, got ${R.stats.avg}`);return!0},w=mo`
    <div class="mb-3">
      <h4>Case Study: IoT Sensor Analytics Platform</h4>
      <p>
        <strong>SmartFactory</strong> is deploying thousands of IoT sensors across their manufacturing facilities. They
        need a FastAPI service that can quickly analyze sensor data with intelligent caching to handle repeated queries
        efficiently.
      </p>
      <p>
        Download the sensor data:
        <button class="btn btn-sm btn-outline-primary" type="button" @click=${()=>B(h,`${a}.csv`)}>
          ${a}.csv
        </button>
      </p>
      <p>
        The CSV contains time-series data with columns: <code>timestamp</code>, <code>location</code>,
        <code>sensor</code>, and <code>value</code>.
      </p>

      <h5>Your Task:</h5>
      <p>Create a FastAPI endpoint <code>/stats</code> that:</p>
      <ul>
        <li>
          Accepts query parameters: <code>location</code>, <code>sensor</code>, <code>start_date</code>,
          <code>end_date</code>
        </li>
        <li>
          Returns JSON with a <code>stats</code> object containing: <code>count</code>, <code>avg</code>,
          <code>min</code>, <code>max</code>
        </li>
        <li>Implements response caching - identical requests should return an <code>X-Cache: HIT</code> header</li>
        <li>Filters data by all provided parameters (all are optional)</li>
        <li>Enables CORS for all origins</li>
      </ul>

      <p><strong>Example Response:</strong></p>
      <pre><code class="language-json">{
  "stats": {
    "count": 45,
    "avg": 22.5,
    "min": 15.2,
    "max": 34.8
  }
}</code></pre>

      <p class="text-muted">
        <strong>Caching Hint:</strong> Use Python's <code>functools.lru_cache</code> or implement a simple
        dictionary-based cache with query parameters as keys. Return <code>X-Cache: HIT</code> for cached responses and
        <code>X-Cache: MISS</code> for fresh calculations.
      </p>

      <label for="${a}" class="form-label">FastAPI endpoint URL (e.g., http://127.0.0.1:8000/stats)</label>
      <input
        class="form-control"
        id="${a}"
        name="${a}"
        type="url"
        placeholder="http://127.0.0.1:8000/stats"
        required
      />
      <p class="text-muted">We'll test with: location=${d}, sensor=${f}, and date range queries</p>
    </div>
  `;return{id:a,title:i,weight:n,question:w,answer:y}}var Oe,qe,Tt=k(()=>{"use strict";ie();Oe=["temperature","humidity","pressure","light"],qe=["zone-a","zone-b","zone-c","zone-d"]});var qt={};M(qt,{default:()=>Po});import{html as vo}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";import{default as xo}from"https://cdn.jsdelivr.net/npm/seedrandom@3/+esm";function Io(e){let n=new Set,o=[];for(;o.length<z;){let a=Pt[Math.floor(e()*Pt.length)],i=Mt[Math.floor(e()*Mt.length)],r=`${a} ${i}`;if(n.has(r))continue;n.add(r);let s=2024+Math.floor(e()*3),t=1+Math.floor(e()*12),c=1+Math.floor(e()*28),l=[String(c).padStart(2,"0"),String(t).padStart(2,"0"),String(s)].join("/");o.push({name:r,date:l})}return o}function ko(e){let n=e.createLinearGradient(0,0,0,q);n.addColorStop(0,"#050d1a"),n.addColorStop(1,"#0a1f3d"),e.fillStyle=n,e.fillRect(0,0,C,q),e.fillStyle="rgba(100,160,255,0.04)";for(let o=20;o<C;o+=40)for(let a=20;a<q;a+=40)e.fillRect(o,a,2,2)}function Co(e){let n=e.createLinearGradient(0,0,C,0);n.addColorStop(0,"#0d2a52"),n.addColorStop(1,"#061530"),e.fillStyle=n,e.fillRect(0,0,C,72),e.font="bold 28px 'Courier New', monospace",e.fillStyle="#4fc3f7",e.textAlign="left",e.textBaseline="middle",e.fillText("\u25C6 NEXUS EVENTS",36,36),e.font="18px 'Courier New', monospace",e.fillStyle="rgba(255,255,255,0.55)",e.textAlign="center",e.fillText("LIVE ATTENDEE CHECK-IN FEED",C/2,36);let o=new Date,a=String(o.getHours()).padStart(2,"0"),i=String(o.getMinutes()).padStart(2,"0"),r=String(o.getSeconds()).padStart(2,"0");e.font="bold 20px 'Courier New', monospace",e.fillStyle="#4fc3f7",e.textAlign="right",e.fillText(`${a}:${i}:${r}`,C-36,36),e.strokeStyle="rgba(79,195,247,0.3)",e.lineWidth=1,e.beginPath(),e.moveTo(0,72),e.lineTo(C,72),e.stroke()}function $o(e,n,o){let a=Math.min(1,o*6);e.globalAlpha=a;let i=C/2-200,r=q/2-20,s=560,t=200;e.shadowColor="rgba(0,120,255,0.35)",e.shadowBlur=40,e.fillStyle="rgba(10,30,70,0.92)",K(e,i,r,s,t,16),e.fill(),e.shadowBlur=0,e.strokeStyle="rgba(79,195,247,0.6)",e.lineWidth=2,K(e,i,r,s,t,16),e.stroke(),e.fillStyle="#00c853",e.beginPath(),e.arc(i+s-28,r+28,20,0,Math.PI*2),e.fill(),e.font="bold 18px sans-serif",e.fillStyle="#fff",e.textAlign="center",e.textBaseline="middle",e.fillText("\u2713",i+s-28,r+28),e.font="12px 'Courier New', monospace",e.fillStyle="rgba(79,195,247,0.8)",e.textAlign="left",e.fillText("ATTENDEE NAME",i+28,r+38),e.font="bold 42px 'Georgia', serif",e.fillStyle="#ffffff",e.fillText(n.name,i+28,r+90),e.font="12px 'Courier New', monospace",e.fillStyle="rgba(79,195,247,0.8)",e.fillText("REGISTRATION DATE",i+28,r+126),e.font="bold 30px 'Courier New', monospace",e.fillStyle="#4fc3f7",e.fillText(n.date,i+28,r+168),e.globalAlpha=1,e.shadowBlur=0}function Nt(e,n){let o=C-340,a=90,i=310,r=q-140;e.fillStyle="rgba(5, 15, 40, 0.85)",K(e,o,a,i,r,12),e.fill(),e.strokeStyle="rgba(79,195,247,0.2)",e.lineWidth=1,K(e,o,a,i,r,12),e.stroke(),e.font="11px 'Courier New', monospace",e.fillStyle="rgba(79,195,247,0.7)",e.textAlign="left",e.fillText("\u25B8 RECENT CHECK-INS",o+16,a+24),e.strokeStyle="rgba(79,195,247,0.15)",e.beginPath(),e.moveTo(o+8,a+38),e.lineTo(o+i-8,a+38),e.stroke();let s=Math.min(n.length,8);for(let t=0;t<s;t++){let c=n[n.length-1-t],l=a+60+t*70,h=t===0?1:Math.max(.2,1-t*.12);e.globalAlpha=h,e.fillStyle=t===0?"rgba(79,195,247,0.12)":"rgba(255,255,255,0.03)",K(e,o+8,l-14,i-16,58,8),e.fill(),e.fillStyle=t===0?"#00c853":"rgba(79,195,247,0.5)",e.beginPath(),e.arc(o+22,l+12,5,0,Math.PI*2),e.fill(),e.font=`${t===0?"bold ":""}15px 'Georgia', serif`,e.fillStyle=t===0?"#fff":"rgba(255,255,255,0.75)",e.textAlign="left",e.fillText(c.name,o+36,l+16),e.font="12px 'Courier New', monospace",e.fillStyle=t===0?"#4fc3f7":"rgba(79,195,247,0.6)",e.fillText(c.date,o+36,l+36),e.globalAlpha=1}}function Ao(e,n,o){let a=q-44,i=20;e.fillStyle="rgba(5,15,40,0.8)",e.fillRect(0,a-8,C,52),e.strokeStyle="rgba(79,195,247,0.2)",e.lineWidth=1,e.beginPath(),e.moveTo(0,a-8),e.lineTo(C,a-8),e.stroke(),e.font="13px 'Courier New', monospace",e.fillStyle="#4fc3f7",e.textAlign="left",e.fillText(`CHECKED IN: ${n} / ${z}`,i,a+18),e.fillStyle="rgba(79,195,247,0.15)",K(e,C/2-200,a+4,400,12,6),e.fill();let s=400*Math.min(1,o/ne),t=e.createLinearGradient(C/2-200,0,C/2+200,0);t.addColorStop(0,"#0077ff"),t.addColorStop(1,"#00c8ff"),e.fillStyle=t,s>0&&(K(e,C/2-200,a+4,s,12,6),e.fill());let c=Math.floor(o),l=String(Math.floor(c/60)).padStart(2,"0"),h=String(c%60).padStart(2,"0");e.font="13px 'Courier New', monospace",e.fillStyle="rgba(255,255,255,0.45)",e.textAlign="right",e.fillText(`${l}:${h}`,C-i,a+18)}function Eo(e,n){let o=Math.min(1,n*3);e.globalAlpha=o,e.font="bold 52px 'Georgia', serif",e.fillStyle="#ffffff",e.textAlign="center",e.textBaseline="middle",e.fillText("NEXUS EVENTS",C/2,q/2-48),e.font="22px 'Courier New', monospace",e.fillStyle="#4fc3f7",e.fillText("ATTENDEE CHECK-IN SYSTEM",C/2,q/2+16),e.font="14px 'Courier New', monospace",e.fillStyle="rgba(255,255,255,0.4)",e.fillText("Recording session in progress\u2026",C/2,q/2+60),e.globalAlpha=1}function Ro(e){e.font="bold 40px 'Georgia', serif",e.fillStyle="#00c853",e.textAlign="center",e.textBaseline="middle",e.fillText("\u2713 Check-In Session Complete",C/2,q/2-20),e.font="18px 'Courier New', monospace",e.fillStyle="rgba(79,195,247,0.8)",e.fillText(`${z} attendees registered`,C/2,q/2+30)}function K(e,n,o,a,i,r){e.beginPath(),e.moveTo(n+r,o),e.lineTo(n+a-r,o),e.quadraticCurveTo(n+a,o,n+a,o+r),e.lineTo(n+a,o+i-r),e.quadraticCurveTo(n+a,o+i,n+a-r,o+i),e.lineTo(n+r,o+i),e.quadraticCurveTo(n,o+i,n,o+i-r),e.lineTo(n,o+r),e.quadraticCurveTo(n,o,n+r,o),e.closePath()}async function To(e,n){return new Promise((o,a)=>{let i=document.createElement("canvas");i.width=C,i.height=q;let r=i.getContext("2d"),s=["video/webm;codecs=vp9","video/webm;codecs=vp8","video/webm"].find(f=>MediaRecorder.isTypeSupported(f))||"video/webm",t=i.captureStream(30),c=new MediaRecorder(t,{mimeType:s,videoBitsPerSecond:25e5}),l=[];c.ondataavailable=f=>{f.data.size>0&&l.push(f.data)},c.onstop=()=>{let f=new Blob(l,{type:s});o(f)},c.onerror=a;let h=performance.now();c.start(200);function d(){let f=(performance.now()-h)/1e3;if(ko(r),Co(r,f),f<be)Eo(r,f/be);else{let b=f-be,u=Math.floor(b/he);if(u>=z)Nt(r,e),Ro(r);else{let y=b%he/he,w=e.slice(0,u+1);$o(r,e[u],y),w.length>0&&Nt(r,w)}Ao(r,Math.min(u+1,z),f)}n(Math.min(1,f/ne)),f<ne?requestAnimationFrame(d):c.stop()}requestAnimationFrame(d)})}function Lt(e){return String(e??"").trim().toLowerCase().replace(/\s+/g," ")}function Ot(e){return String(e??"").trim().replace(/\s/g,"")}async function Po({user:e,weight:n=1,version:o="#v2"}){let a="q-video-attendee-extraction",i="AI Video Attendee Extraction \u2013 Gemini Video API",r=xo(`${e.email}#${a}${o}`),s=Io(r),t=!1,c=async d=>{if(!d||!d.trim())throw new Error("Please paste your extracted JSON before submitting.");let f;try{f=JSON.parse(d.trim())}catch{throw new Error(`Could not parse your input as JSON.
Expected format: [{"name": "Alice Smith", "date": "15/02/2024"}, ...]`)}if(!Array.isArray(f))throw new Error('Your JSON must be an array of objects: [{"name":\u2026, "date":\u2026}, \u2026]');for(let p=0;p<f.length;p++){let v=f[p];if(typeof v!="object"||v===null||!v.name||!v.date)throw new Error(`Entry ${p+1} is missing 'name' or 'date' fields.
Got: ${JSON.stringify(v)}`)}let b=0,u=[],y=[];for(let p of s)f.find(g=>Lt(g.name)===Lt(p.name)&&Ot(g.date)===Ot(p.date))?(b++,u.push(p.name)):y.push(`${p.name} (${p.date})`);let w=Math.ceil(z*.75);if(b>=w)return!0;throw new Error(`Only ${b}/${z} entries matched correctly (need ${w}/20).

Tips:
\u2022 Watch the full video \u2013 entries appear one at a time over ~44 seconds.
\u2022 Make sure dates are in dd/mm/yyyy format.
\u2022 Check the "recent check-ins" panel on the right for entries you may have missed.`)};function l(){if(t)return;t=!0;let d=document.getElementById(`${a}-rec-btn`),f=document.getElementById(`${a}-prog-wrap`),b=document.getElementById(`${a}-prog-bar`),u=document.getElementById(`${a}-prog-label`),y=document.getElementById(`${a}-download`);d&&(d.disabled=!0,d.textContent="\u23FA Recording\u2026",d.style.background="#c62828"),f&&(f.style.display="block"),To(s,w=>{let p=Math.round(w*100);b&&(b.style.width=p+"%"),u&&(u.textContent=`Recording: ${p}% (${Math.round(w*ne)}s / ${Math.round(ne)}s)`)}).then(w=>{let p=URL.createObjectURL(w);y&&(y.href=p,y.download=`attendee_checkin_${e.email.split("@")[0]}.webm`,y.style.display="inline-block",y.textContent="\u2B07 Download your Attendee Video (.webm)"),d&&(d.textContent="\u2705 Recording Complete",d.style.background="#1b5e20"),u&&(u.textContent="\u2705 Video ready! Click download link above."),t=!1}).catch(w=>{console.error("Video generation error:",w),d&&(d.disabled=!1,d.textContent="\u{1F534} Retry Recording",d.style.background="#e65100"),u&&(u.textContent=`Error: ${w.message}`),t=!1})}setTimeout(()=>{let d=document.getElementById(`${a}-rec-btn`);d&&d.addEventListener("click",l)},100);let h=vo`
    <p>
      <strong>Situation:</strong> You're building an AI system for a corporate event company.
      They record attendee check-ins live on screen during events. You need to extract
      names and registration dates from a ~44-second video feed.
    </p>

    <div style="background:linear-gradient(135deg,#0d1f3c,#0a2a50);border:1px solid #1e4a8c;border-radius:10px;padding:18px 24px;margin:16px 0;color:#e8f4ff">
      <div style="font-size:13px;color:#4fc3f7;letter-spacing:2px;margin-bottom:10px">◆ YOUR MISSION</div>
      <ol style="margin:0;padding-left:22px;line-height:2">
        <li>Generate &amp; download your unique <strong>~44-second check-in video</strong> below</li>
        <li>Upload it to <strong>Gemini Files API</strong> (<code>client.files.upload()</code>)</li>
        <li>Use Gemini to extract <strong>all 20</strong> attendee <code>[name, date]</code> pairs from the video</li>
        <li>Return structured JSON: <code>[{"name": "John Doe", "date": "15/02/2026"}, …]</code></li>
        <li>Paste the JSON array into the field below</li>
      </ol>
      <div style="margin-top:12px;padding:10px;background:rgba(79,195,247,0.1);border-radius:6px;font-size:13px">
        📊 Expected: <strong>20 name-date pairs</strong> &nbsp;|&nbsp;
        Date format: <strong>dd/mm/yyyy</strong> &nbsp;|&nbsp;
        Pass if <strong>≥ 15/20 correct</strong>
      </div>
    </div>

    <!-- Step 1: Generate video -->
    <p><strong>Step 1 – Generate your unique video:</strong></p>
    <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:8px">
      <button
        id="${a}-rec-btn"
        style="padding:10px 22px;background:#1565c0;color:#fff;border:none;border-radius:6px;font-size:15px;cursor:pointer;font-weight:bold"
      >
        ⏺ Generate & Record Video
      </button>
      <a
        id="${a}-download"
        style="display:none;padding:10px 20px;background:#1b5e20;color:#fff;border-radius:6px;font-size:14px;font-weight:bold;text-decoration:none"
      >
        ⬇ Download your Attendee Video (.webm)
      </a>
    </div>

    <div id="${a}-prog-wrap" style="display:none;margin-bottom:16px">
      <div style="background:#0d1f3c;border-radius:6px;height:14px;overflow:hidden;margin-bottom:6px">
        <div id="${a}-prog-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#0077ff,#00c8ff);transition:width 0.5s;border-radius:6px"></div>
      </div>
      <small id="${a}-prog-label" style="color:#4fc3f7">Starting…</small>
    </div>

    <div style="background:#1a1a2e;border:1px solid #333;border-radius:6px;padding:12px 16px;margin-bottom:16px;font-size:13px;color:#aaa">
      ⏱ Recording takes ~44 seconds in real time. The browser draws each frame live — please keep this tab active during recording.
    </div>

    <!-- Step 2: Implement solution -->
    <p><strong>Step 2 – Use Gemini to extract attendees:</strong></p>
    <pre style="background:#0d1117;color:#c9d1d9;padding:14px;border-radius:8px;font-size:13px;overflow-x:auto"><code>pip install google-genai
export GEMINI_API_KEY=your_key_here
python main.py attendee_checkin.webm</code></pre>

    <p><strong>Expected JSON output format:</strong></p>
    <pre style="background:#0d1117;color:#c9d1d9;padding:14px;border-radius:8px;font-size:13px;overflow-x:auto"><code>[
  {"name": "Alice Smith",    "date": "03/07/2025"},
  {"name": "Benjamin Patel", "date": "21/11/2024"},
  ...
]</code></pre>

    <p><strong>Helpful Resources:</strong></p>
    <ul>
      <li>📖 <a href="https://ai.google.dev/gemini-api/docs/vision?lang=python#video-file-upload" target="_blank">Gemini – Video file upload &amp; analysis</a></li>
      <li>📖 <a href="https://ai.google.dev/api/files" target="_blank">Gemini Files API reference</a></li>
      <li>📖 <a href="https://ai.google.dev/gemini-api/docs/structured-output" target="_blank">Gemini Structured Outputs (JSON schema)</a></li>
    </ul>

    <hr />

    <label for="${a}" class="form-label">
      Paste your extracted JSON array (20 <code>{name, date}</code> objects):
    </label>
    <textarea
      class="form-control font-monospace"
      id="${a}"
      name="${a}"
      rows="8"
      placeholder='[{"name": "Alice Smith", "date": "03/07/2025"}, {"name": "Benjamin Patel", "date": "21/11/2024"}, ...]'
      required
      style="font-size:13px"
    ></textarea>
    <small class="form-text text-muted">
      Paste the complete JSON array printed by <code>main.py</code>. Accepted if ≥ 15 / 20 entries are correct.
    </small>
  `;return{id:a,title:i,weight:n,question:h,answer:c,help:[]}}var Pt,Mt,z,he,be,So,ne,C,q,_t=k(()=>{"use strict";Pt=["Aarav","Aditi","Aisha","Alexander","Amara","Ananya","Benjamin","Charlotte","Chen","David","Elena","Fatima","Gabriel","Haruto","Isabella","James","Kavya","Lena","Liam","Linh","Lucas","Maya","Mohammed","Naledi","Natasha","Noah","Olivia","Priya","Rafael","Rania","Rohan","Samuel","Sara","Siddharth","Sofia","Stefan","Tariq","Tomas","Uma","Valentina","Victor","Wanjiru","Xavier","Yuki","Zara","Arjun","Elif","Ingrid","Javier","Kenji","Laila","Miriam","Nadia","Omar","Petra","Rhea","Santiago","Thabo","Ulrike","Vivek","Wren","Yara","Zoe"],Mt=["Acharya","Aldridge","Andersen","Balogun","Barros","Campbell","Chen","Costa","Diallo","Dubois","Erikson","Fernandez","Fischer","Gomez","Gupta","Hansen","Hashimoto","Ibrahim","Jensen","Johansson","Kamau","Khan","Kumar","Laurent","Lee","Lindqvist","Lopez","Mehta","Moreau","Mukherjee","Nakamura","Nkosi","Okafor","Oliveira","Patel","Petrov","Rahman","Reyes","Russo","Schmidt","Sharma","Singh","Solis","Suzuki","Tan","Theron","Torres","Vargas","Weber","Zhang"],z=20,he=2.2,be=2,So=1.8,ne=be+z*he+So,C=1280,q=720});import{html as Y,render as Bt}from"https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";function _e(e,n){let o=Y`<ol class="mt-3">
    ${e.map(({id:r,title:s,weight:t})=>Y`<li><a href="#h${r}">${s}</a> (${t} ${t==1?"mark":"marks"})</li>`)}
  </ol>`,a=[Y`<h1 class="display-6">Questions</h1>`,o,...e.map(({id:r,title:s,weight:t,question:c,help:l},h)=>(l&&!Array.isArray(l)&&(l=[l]),Y`
        <div class="card my-5" data-question="${r}" id="h${r}">
          <div class="card-header">
            <span class="badge text-bg-primary me-2">${h+1}</span>
            ${s} (${t} ${t==1?"mark":"marks"})
          </div>
          ${l?l.map(d=>Y`<div class="card-body border-bottom">${d}</div>`):""}
          <div class="card-body">${c}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${r}">Check</button>
          </div>
        </div>
      `))],i={index:o,questions:a};for(let[r,s]of n)Bt(i[s],r)}async function jn(e,n){let o=[{...await Promise.resolve().then(()=>(De(),je)).then(a=>a.default({user:e,weight:5}))},{...await Promise.resolve().then(()=>(ze(),Ve)).then(a=>a.default({user:e,weight:5}))},{...await Promise.resolve().then(()=>(ha(),fa)).then(a=>a.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(xa(),va)).then(a=>a.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(Aa(),$a)).then(a=>a.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(Ra(),Ea)).then(a=>a.default({user:e,weight:2}))},{...await Promise.resolve().then(()=>(ja(),_a)).then(a=>a.default({user:e,weight:1,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(Ga(),Ba)).then(a=>a.default({user:e,weight:1,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(Qa(),Xa)).then(a=>a.default({user:e,weight:1,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(st(),nt)).then(a=>a.default({user:e,weight:1,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(ht(),ft)).then(a=>a.default({user:e,weight:1,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(wt(),yt)).then(a=>a.default({user:e,weight:.5,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(At(),$t)).then(a=>a.default({user:e,weight:.5,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(Tt(),Rt)).then(a=>a.default({user:e,weight:.5,version:"#roe-2026-01"}))},{...await Promise.resolve().then(()=>(_t(),qt)).then(a=>a.default({user:e,weight:.5,version:"#roe-2026-01"}))}];return _e(o,n),Object.fromEntries(o.map(({id:a,...i})=>[a,i]))}export{jn as questions};
