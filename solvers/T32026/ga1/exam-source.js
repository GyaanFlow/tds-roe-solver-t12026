var r4 = Object.create;
var Q = Object.defineProperty;
var i4 = Object.getOwnPropertyDescriptor;
var n4 = Object.getOwnPropertyNames;
var c4 = Object.getPrototypeOf,
  s4 = Object.prototype.hasOwnProperty;
var u = (e, o) => () => (e && (o = e((e = 0))), o);
var T = (e, o) => () => (o || e((o = { exports: {} }).exports, o), o.exports),
  M = (e, o) => {
    for (var a in o) Q(e, a, { get: o[a], enumerable: !0 });
  },
  d4 = (e, o, a, L) => {
    if ((o && typeof o == "object") || typeof o == "function")
      for (let l of n4(o))
        !s4.call(e, l) &&
          l !== a &&
          Q(e, l, {
            get: () => o[l],
            enumerable: !(L = i4(o, l)) || L.enumerable,
          });
    return e;
  };
var R = (e, o, a) => (
  (a = e != null ? r4(c4(e)) : {}),
  d4(
    o || !e || !e.__esModule
      ? Q(a, "default", { value: e, enumerable: !0 })
      : a,
    e,
  )
);
var _e = {};
M(_e, { default: () => g4 });
import { html as m4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function g4({ weight: e = 1 }) {
  let o = "q-vs-code-version",
    a = "VS Code Version",
    L = (s) =>
      s.match(/Version:\s*Code\s*(\d+\.\d+\.\d+)/) && s.match(/OS Version:/),
    l = m4`
    <div class="mb-3">
      <p>
        Install and run Visual Studio Code. In your Terminal (or Command Prompt), type <code>code -s</code> and press
        Enter. Copy and paste the <em>entire output</em> below.
      </p>

      <label for="${o}" class="form-label">What is the output of <code>code -s</code>?</label>
      <textarea class="form-control" id="${o}" name="${o}" rows="3"></textarea>
    </div>
  `;
  return { id: o, title: a, weight: e, question: l, answer: L };
}
var ve = u(() => {
  "use strict";
});
var xe = {};
M(xe, { default: () => y4 });
import { html as b4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function y4({ user: e, weight: o = 1 }) {
  let a = "q-http-headers-server",
    L = "Find the code in the response headers",
    l = `${location.origin}/questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign || "")}&questionId=${encodeURIComponent(a)}`,
    s = b4`
    <div class="mb-3">
      <p>
        Most of what a web page tells you isn't in the text you read — it's in the HTTP response
        headers, which normal browsing never shows you.
      </p>
      <p>Fetch this URL, but ask for the headers too:</p>
      <pre class="mt-2"><code>curl -i "${l}"</code></pre>
      <p>
        The page body says nothing useful. Look for a header named <code>X-Exam-Code</code> — that's
        your answer. The code changes every hour, so fetch it again if yours has expired.
      </p>
      <label for="${a}" class="form-label">Code from the X-Exam-Code header</label>
      <input class="form-control" id="${a}" name="${a}" placeholder="e.g. 7F3KQ9M2" />
    </div>
  `;
  return {
    id: a,
    title: L,
    weight: o,
    question: s,
    answer: async (t) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            response: t,
            weight: o,
            questionId: a,
          }),
        }),
        n = await r.json();
      if (!r.ok) throw new Error(n.error || "Unable to verify.");
      return n;
    },
  };
}
var we = u(() => {
  "use strict";
});
var Me = T((ke, X) => {
  (function (e, o, a) {
    function L(t) {
      var r = this,
        n = c();
      ((r.next = function () {
        var i = 2091639 * r.s0 + r.c * 23283064365386963e-26;
        return ((r.s0 = r.s1), (r.s1 = r.s2), (r.s2 = i - (r.c = i | 0)));
      }),
        (r.c = 1),
        (r.s0 = n(" ")),
        (r.s1 = n(" ")),
        (r.s2 = n(" ")),
        (r.s0 -= n(t)),
        r.s0 < 0 && (r.s0 += 1),
        (r.s1 -= n(t)),
        r.s1 < 0 && (r.s1 += 1),
        (r.s2 -= n(t)),
        r.s2 < 0 && (r.s2 += 1),
        (n = null));
    }
    function l(t, r) {
      return ((r.c = t.c), (r.s0 = t.s0), (r.s1 = t.s1), (r.s2 = t.s2), r);
    }
    function s(t, r) {
      var n = new L(t),
        i = r && r.state,
        d = n.next;
      return (
        (d.int32 = function () {
          return (n.next() * 4294967296) | 0;
        }),
        (d.double = function () {
          return d() + ((d() * 2097152) | 0) * 11102230246251565e-32;
        }),
        (d.quick = d),
        i &&
          (typeof i == "object" && l(i, n),
          (d.state = function () {
            return l(n, {});
          })),
        d
      );
    }
    function c() {
      var t = 4022871197,
        r = function (n) {
          n = String(n);
          for (var i = 0; i < n.length; i++) {
            t += n.charCodeAt(i);
            var d = 0.02519603282416938 * t;
            ((t = d >>> 0),
              (d -= t),
              (d *= t),
              (t = d >>> 0),
              (d -= t),
              (t += d * 4294967296));
          }
          return (t >>> 0) * 23283064365386963e-26;
        };
      return r;
    }
    o && o.exports
      ? (o.exports = s)
      : a && a.amd
        ? a(function () {
            return s;
          })
        : (this.alea = s);
  })(ke, typeof X == "object" && X, typeof define == "function" && define);
});
var Se = T((Ze, ee) => {
  (function (e, o, a) {
    function L(c) {
      var t = this,
        r = "";
      ((t.x = 0),
        (t.y = 0),
        (t.z = 0),
        (t.w = 0),
        (t.next = function () {
          var i = t.x ^ (t.x << 11);
          return (
            (t.x = t.y),
            (t.y = t.z),
            (t.z = t.w),
            (t.w ^= (t.w >>> 19) ^ i ^ (i >>> 8))
          );
        }),
        c === (c | 0) ? (t.x = c) : (r += c));
      for (var n = 0; n < r.length + 64; n++)
        ((t.x ^= r.charCodeAt(n) | 0), t.next());
    }
    function l(c, t) {
      return ((t.x = c.x), (t.y = c.y), (t.z = c.z), (t.w = c.w), t);
    }
    function s(c, t) {
      var r = new L(c),
        n = t && t.state,
        i = function () {
          return (r.next() >>> 0) / 4294967296;
        };
      return (
        (i.double = function () {
          do
            var d = r.next() >>> 11,
              f = (r.next() >>> 0) / 4294967296,
              p = (d + f) / (1 << 21);
          while (p === 0);
          return p;
        }),
        (i.int32 = r.next),
        (i.quick = i),
        n &&
          (typeof n == "object" && l(n, r),
          (i.state = function () {
            return l(r, {});
          })),
        i
      );
    }
    o && o.exports
      ? (o.exports = s)
      : a && a.amd
        ? a(function () {
            return s;
          })
        : (this.xor128 = s);
  })(Ze, typeof ee == "object" && ee, typeof define == "function" && define);
});
var Ae = T(($e, te) => {
  (function (e, o, a) {
    function L(c) {
      var t = this,
        r = "";
      ((t.next = function () {
        var i = t.x ^ (t.x >>> 2);
        return (
          (t.x = t.y),
          (t.y = t.z),
          (t.z = t.w),
          (t.w = t.v),
          ((t.d = (t.d + 362437) | 0) +
            (t.v = t.v ^ (t.v << 4) ^ (i ^ (i << 1)))) |
            0
        );
      }),
        (t.x = 0),
        (t.y = 0),
        (t.z = 0),
        (t.w = 0),
        (t.v = 0),
        c === (c | 0) ? (t.x = c) : (r += c));
      for (var n = 0; n < r.length + 64; n++)
        ((t.x ^= r.charCodeAt(n) | 0),
          n == r.length && (t.d = (t.x << 10) ^ (t.x >>> 4)),
          t.next());
    }
    function l(c, t) {
      return (
        (t.x = c.x),
        (t.y = c.y),
        (t.z = c.z),
        (t.w = c.w),
        (t.v = c.v),
        (t.d = c.d),
        t
      );
    }
    function s(c, t) {
      var r = new L(c),
        n = t && t.state,
        i = function () {
          return (r.next() >>> 0) / 4294967296;
        };
      return (
        (i.double = function () {
          do
            var d = r.next() >>> 11,
              f = (r.next() >>> 0) / 4294967296,
              p = (d + f) / (1 << 21);
          while (p === 0);
          return p;
        }),
        (i.int32 = r.next),
        (i.quick = i),
        n &&
          (typeof n == "object" && l(n, r),
          (i.state = function () {
            return l(r, {});
          })),
        i
      );
    }
    o && o.exports
      ? (o.exports = s)
      : a && a.amd
        ? a(function () {
            return s;
          })
        : (this.xorwow = s);
  })($e, typeof te == "object" && te, typeof define == "function" && define);
});
var Ee = T((Ce, ae) => {
  (function (e, o, a) {
    function L(c) {
      var t = this;
      t.next = function () {
        var n = t.x,
          i = t.i,
          d,
          f,
          p;
        return (
          (d = n[i]),
          (d ^= d >>> 7),
          (f = d ^ (d << 24)),
          (d = n[(i + 1) & 7]),
          (f ^= d ^ (d >>> 10)),
          (d = n[(i + 3) & 7]),
          (f ^= d ^ (d >>> 3)),
          (d = n[(i + 4) & 7]),
          (f ^= d ^ (d << 7)),
          (d = n[(i + 7) & 7]),
          (d = d ^ (d << 13)),
          (f ^= d ^ (d << 9)),
          (n[i] = f),
          (t.i = (i + 1) & 7),
          f
        );
      };
      function r(n, i) {
        var d,
          f,
          p = [];
        if (i === (i | 0)) f = p[0] = i;
        else
          for (i = "" + i, d = 0; d < i.length; ++d)
            p[d & 7] =
              (p[d & 7] << 15) ^ ((i.charCodeAt(d) + p[(d + 1) & 7]) << 13);
        for (; p.length < 8; ) p.push(0);
        for (d = 0; d < 8 && p[d] === 0; ++d);
        for (
          d == 8 ? (f = p[7] = -1) : (f = p[d]), n.x = p, n.i = 0, d = 256;
          d > 0;
          --d
        )
          n.next();
      }
      r(t, c);
    }
    function l(c, t) {
      return ((t.x = c.x.slice()), (t.i = c.i), t);
    }
    function s(c, t) {
      c == null && (c = +new Date());
      var r = new L(c),
        n = t && t.state,
        i = function () {
          return (r.next() >>> 0) / 4294967296;
        };
      return (
        (i.double = function () {
          do
            var d = r.next() >>> 11,
              f = (r.next() >>> 0) / 4294967296,
              p = (d + f) / (1 << 21);
          while (p === 0);
          return p;
        }),
        (i.int32 = r.next),
        (i.quick = i),
        n &&
          (n.x && l(n, r),
          (i.state = function () {
            return l(r, {});
          })),
        i
      );
    }
    o && o.exports
      ? (o.exports = s)
      : a && a.amd
        ? a(function () {
            return s;
          })
        : (this.xorshift7 = s);
  })(Ce, typeof ae == "object" && ae, typeof define == "function" && define);
});
var qe = T((Te, Le) => {
  (function (e, o, a) {
    function L(c) {
      var t = this;
      t.next = function () {
        var n = t.w,
          i = t.X,
          d = t.i,
          f,
          p;
        return (
          (t.w = n = (n + 1640531527) | 0),
          (p = i[(d + 34) & 127]),
          (f = i[(d = (d + 1) & 127)]),
          (p ^= p << 13),
          (f ^= f << 17),
          (p ^= p >>> 15),
          (f ^= f >>> 12),
          (p = i[d] = p ^ f),
          (t.i = d),
          (p + (n ^ (n >>> 16))) | 0
        );
      };
      function r(n, i) {
        var d,
          f,
          p,
          h,
          _,
          Z = [],
          $ = 128;
        for (
          i === (i | 0)
            ? ((f = i), (i = null))
            : ((i = i + "\0"), (f = 0), ($ = Math.max($, i.length))),
            p = 0,
            h = -32;
          h < $;
          ++h
        )
          (i && (f ^= i.charCodeAt((h + 32) % i.length)),
            h === 0 && (_ = f),
            (f ^= f << 10),
            (f ^= f >>> 15),
            (f ^= f << 4),
            (f ^= f >>> 13),
            h >= 0 &&
              ((_ = (_ + 1640531527) | 0),
              (d = Z[h & 127] ^= f + _),
              (p = d == 0 ? p + 1 : 0)));
        for (
          p >= 128 && (Z[((i && i.length) || 0) & 127] = -1), p = 127, h = 512;
          h > 0;
          --h
        )
          ((f = Z[(p + 34) & 127]),
            (d = Z[(p = (p + 1) & 127)]),
            (f ^= f << 13),
            (d ^= d << 17),
            (f ^= f >>> 15),
            (d ^= d >>> 12),
            (Z[p] = f ^ d));
        ((n.w = _), (n.X = Z), (n.i = p));
      }
      r(t, c);
    }
    function l(c, t) {
      return ((t.i = c.i), (t.w = c.w), (t.X = c.X.slice()), t);
    }
    function s(c, t) {
      c == null && (c = +new Date());
      var r = new L(c),
        n = t && t.state,
        i = function () {
          return (r.next() >>> 0) / 4294967296;
        };
      return (
        (i.double = function () {
          do
            var d = r.next() >>> 11,
              f = (r.next() >>> 0) / 4294967296,
              p = (d + f) / (1 << 21);
          while (p === 0);
          return p;
        }),
        (i.int32 = r.next),
        (i.quick = i),
        n &&
          (n.X && l(n, r),
          (i.state = function () {
            return l(r, {});
          })),
        i
      );
    }
    o && o.exports
      ? (o.exports = s)
      : a && a.amd
        ? a(function () {
            return s;
          })
        : (this.xor4096 = s);
  })(Te, typeof Le == "object" && Le, typeof define == "function" && define);
});
var Re = T((Ie, oe) => {
  (function (e, o, a) {
    function L(c) {
      var t = this,
        r = "";
      ((t.next = function () {
        var i = t.b,
          d = t.c,
          f = t.d,
          p = t.a;
        return (
          (i = (i << 25) ^ (i >>> 7) ^ d),
          (d = (d - f) | 0),
          (f = (f << 24) ^ (f >>> 8) ^ p),
          (p = (p - i) | 0),
          (t.b = i = (i << 20) ^ (i >>> 12) ^ d),
          (t.c = d = (d - f) | 0),
          (t.d = (f << 16) ^ (d >>> 16) ^ p),
          (t.a = (p - i) | 0)
        );
      }),
        (t.a = 0),
        (t.b = 0),
        (t.c = -1640531527),
        (t.d = 1367130551),
        c === Math.floor(c)
          ? ((t.a = (c / 4294967296) | 0), (t.b = c | 0))
          : (r += c));
      for (var n = 0; n < r.length + 20; n++)
        ((t.b ^= r.charCodeAt(n) | 0), t.next());
    }
    function l(c, t) {
      return ((t.a = c.a), (t.b = c.b), (t.c = c.c), (t.d = c.d), t);
    }
    function s(c, t) {
      var r = new L(c),
        n = t && t.state,
        i = function () {
          return (r.next() >>> 0) / 4294967296;
        };
      return (
        (i.double = function () {
          do
            var d = r.next() >>> 11,
              f = (r.next() >>> 0) / 4294967296,
              p = (d + f) / (1 << 21);
          while (p === 0);
          return p;
        }),
        (i.int32 = r.next),
        (i.quick = i),
        n &&
          (typeof n == "object" && l(n, r),
          (i.state = function () {
            return l(r, {});
          })),
        i
      );
    }
    o && o.exports
      ? (o.exports = s)
      : a && a.amd
        ? a(function () {
            return s;
          })
        : (this.tychei = s);
  })(Ie, typeof oe == "object" && oe, typeof define == "function" && define);
});
var Oe = T(() => {});
var Ne = T((Pe, J) => {
  (function (e, o, a) {
    var L = 256,
      l = 6,
      s = 52,
      c = "random",
      t = a.pow(L, l),
      r = a.pow(2, s),
      n = r * 2,
      i = L - 1,
      d;
    function f(m, b, v) {
      var x = [];
      b = b == !0 ? { entropy: !0 } : b || {};
      var g = Z(_(b.entropy ? [m, A(o)] : (m ?? $()), 3), x),
        y = new p(x),
        w = function () {
          for (var S = y.g(l), E = t, C = 0; S < r; )
            ((S = (S + C) * L), (E *= L), (C = y.g(1)));
          for (; S >= n; ) ((S /= 2), (E /= 2), (C >>>= 1));
          return (S + C) / E;
        };
      return (
        (w.int32 = function () {
          return y.g(4) | 0;
        }),
        (w.quick = function () {
          return y.g(4) / 4294967296;
        }),
        (w.double = w),
        Z(A(y.S), o),
        (
          b.pass ||
          v ||
          function (S, E, C, q) {
            return (
              q &&
                (q.S && h(q, y),
                (S.state = function () {
                  return h(y, {});
                })),
              C ? ((a[c] = S), E) : S
            );
          }
        )(w, g, "global" in b ? b.global : this == a, b.state)
      );
    }
    function p(m) {
      var b,
        v = m.length,
        x = this,
        g = 0,
        y = (x.i = x.j = 0),
        w = (x.S = []);
      for (v || (m = [v++]); g < L; ) w[g] = g++;
      for (g = 0; g < L; g++)
        ((w[g] = w[(y = i & (y + m[g % v] + (b = w[g])))]), (w[y] = b));
      (x.g = function (S) {
        for (var E, C = 0, q = x.i, U = x.j, N = x.S; S--; )
          ((E = N[(q = i & (q + 1))]),
            (C = C * L + N[i & ((N[q] = N[(U = i & (U + E))]) + (N[U] = E))]));
        return ((x.i = q), (x.j = U), C);
      })(L);
    }
    function h(m, b) {
      return ((b.i = m.i), (b.j = m.j), (b.S = m.S.slice()), b);
    }
    function _(m, b) {
      var v = [],
        x = typeof m,
        g;
      if (b && x == "object")
        for (g in m)
          try {
            v.push(_(m[g], b - 1));
          } catch {}
      return v.length ? v : x == "string" ? m : m + "\0";
    }
    function Z(m, b) {
      for (var v = m + "", x, g = 0; g < v.length; )
        b[i & g] = i & ((x ^= b[i & g] * 19) + v.charCodeAt(g++));
      return A(b);
    }
    function $() {
      try {
        var m;
        return (
          d && (m = d.randomBytes)
            ? (m = m(L))
            : ((m = new Uint8Array(L)),
              (e.crypto || e.msCrypto).getRandomValues(m)),
          A(m)
        );
      } catch {
        var b = e.navigator,
          v = b && b.plugins;
        return [+new Date(), e, v, e.screen, A(o)];
      }
    }
    function A(m) {
      return String.fromCharCode.apply(0, m);
    }
    if ((Z(a.random(), o), typeof J == "object" && J.exports)) {
      J.exports = f;
      try {
        d = Oe();
      } catch {}
    } else
      typeof define == "function" && define.amd
        ? define(function () {
            return f;
          })
        : (a["seed" + c] = f);
  })(typeof self < "u" ? self : Pe, [], Math);
});
var I = T((D1, De) => {
  var u4 = Me(),
    _4 = Se(),
    v4 = Ae(),
    x4 = Ee(),
    w4 = qe(),
    k4 = Re(),
    O = Ne();
  O.alea = u4;
  O.xor128 = _4;
  O.xorwow = v4;
  O.xorshift7 = x4;
  O.xor4096 = w4;
  O.tychei = k4;
  De.exports = O;
});
var je = {};
M(je, { default: () => Z4 });
import { html as M4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function Z4({ user: e, weight: o = 1 }) {
  let a = "q-uv-http-post",
    L = "POST HTTP requests with uv",
    l = (0, ze.default)(`${e.email}#${a}`),
    s = "0123456789abcdef",
    c = "";
  for (let n = 0; n < 8; n++) c += s[Math.floor(l() * s.length)];
  let t = (n) => {
      let i = JSON.parse(n);
      return (
        i.headers?.Host == "httpbin.org" &&
        i.json?.email === e.email &&
        i.json?.request_id === c
      );
    },
    r = M4`
    <div class="mb-3">
      <h4>Case Study: eShopCo API Health Check</h4>
      <p>
        As part of eShopCo’s CLI health suite, you must POST a JSON payload to
        <code>https://httpbin.org/post</code> containing your <code>email</code> and a unique <code>request_id</code>.
        We’ll verify that the server echoes it back correctly.
      </p>
      <p>Run in your terminal:</p>
      <pre><code>uv run --with httpie -- http --json POST https://httpbin.org/post email=${e.email} request_id=${c}</code></pre>
      <p>
        HTTPie returns a JSON object; your payload appears under the
        <code>json</code> field.
      </p>
      <label for="${a}" class="form-label"> Paste the <strong>full</strong> response: </label>
      <input class="form-control" id="${a}" name="${a}" />
    </div>
  `;
  return { id: a, title: L, weight: o, question: r, answer: t };
}
var ze,
  Ue = u(() => {
    "use strict";
    ze = R(I(), 1);
  });
function H(e, o) {
  let a = URL.createObjectURL(e),
    L = document.createElement("a");
  ((L.href = a),
    (L.download = o),
    document.body.appendChild(L),
    L.click(),
    document.body.removeChild(L),
    URL.revokeObjectURL(a));
}
var re = u(() => {
  "use strict";
});
async function Je(e) {
  let a = new TextEncoder().encode(e),
    L = await crypto.subtle.digest("SHA-256", a);
  return Array.from(new Uint8Array(L))
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("");
}
var He = u(() => {
  "use strict";
});
function Ve(e, o) {
  return Array.from({ length: e }, () => {
    let a = o();
    return a < 0.8
      ? We[Math.floor((a / 0.8) * We.length)]
      : a < 0.99
        ? " "
        : `
`;
  });
}
var We,
  Be = u(() => {
    "use strict";
    We = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  });
var Ye = {};
M(Ye, { default: () => C4 });
import { html as S4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
import { format as $4 } from "https://cdn.jsdelivr.net/npm/prettier@3.4.2/+esm";
import A4 from "https://cdn.jsdelivr.net/npm/prettier@3.4.2/plugins/markdown.mjs";
async function C4({ user: e, weight: o = 1 }) {
  let a = "q-npx-prettier",
    L = "Run command with npx",
    l = [
      "#  Badly  Formatted  Markdown    ",
      "",
      "*  This is an uneven list",
      "* With inconsistent spacing",
      "   *    And weird indentation",
      "",
      ">This quote has no space",
      ">   This one has too many",
      "",
    ].join(`
`),
    s = (0, Fe.default)(`${e.email}#${a}`),
    c =
      l +
      `
` +
      Ve(300, s).join(""),
    t = new Blob([c], { type: "text/markdown" }),
    r = await $4(c, { parser: "markdown", plugins: [A4] }),
    n = await Je(r),
    i = (f) => f.trim().split(/\s+/).at(0) === n,
    d = S4`
    <div class="mb-3">
      <p>Let's make sure you know how to use <code>npx</code> and <code>prettier</code>.</p>
      <p>
        Download
        <button class="btn btn-sm btn-outline-primary" type="button" @click=${() => H(t, "README.md")}>
          README.md</button
        >. In the directory where you downloaded it, make sure it is called <code>README.md</code>, and run
        <code>npx -y prettier@3.4.2 README.md | sha256sum</code>.
      </p>

      <label for="${a}" class="form-label">What is the output of the command?</label>
      <input class="form-control" id="${a}" name="${a}" />
    </div>
  `;
  return { id: a, title: L, weight: o, question: d, answer: i };
}
var Fe,
  Ge = u(() => {
    "use strict";
    Fe = R(I(), 1);
    re();
    He();
    Be();
  });
function ie(e) {
  let o = "q-broken-json-server",
    a = e?.version ?? "",
    L = (0, Xe.default)(`${e?.email ?? ""}#${o}${a}`),
    l = Ke[Math.floor(L() * Ke.length)],
    s = [];
  for (let d = 0; d < 300; d++)
    s.push({
      id: `record_${String(d).padStart(5, "0")}`,
      name: `Entry ${d}`,
      value: Math.floor(L() * 1e4),
      status: L() < 0.5 ? "active" : "inactive",
      category: ["alpha", "beta", "gamma", "delta"][Math.floor(L() * 4)],
      timestamp: `2024-${String(Math.floor(L() * 12) + 1).padStart(2, "0")}-${String(Math.floor(L() * 28) + 1).padStart(2, "0")}T${String(Math.floor(L() * 24)).padStart(2, "0")}:${String(Math.floor(L() * 60)).padStart(2, "0")}:00Z`,
      metadata: {
        source: ["system_a", "system_b", "system_c"][Math.floor(L() * 3)],
        priority: Math.floor(L() * 5) + 1,
        tags: ["tag1", "tag2", "tag3"].slice(0, Math.floor(L() * 3) + 1),
      },
      description:
        `This is a sample ${l.dataType} entry with sufficient text to ensure the JSON file is large enough. `.repeat(
          3,
        ),
    });
  let c = JSON.stringify(s, null, 2),
    t = c,
    r = [],
    n = t.split(`
`),
    i = [];
  for (let d = 0; d < 20; d++) {
    let f;
    do f = Math.floor(L() * n.length);
    while (i.includes(f));
    i.push(f);
  }
  i.sort((d, f) => f - d);
  for (let d = 0; d < i.length; d++) {
    let f = i[d],
      p = n[f];
    switch (d % 6) {
      case 0:
        p.trim().endsWith(",") &&
          ((n[f] = p.replace(/,$/, "")),
          r.push({ line: f + 1, type: "missing_comma" }));
        break;
      case 1:
        (p.trim().endsWith("}") || p.trim().endsWith("]")) &&
          ((n[f] = p.replace(/([}\]])$/, ",$1")),
          r.push({ line: f + 1, type: "extra_comma" }));
        break;
      case 2:
        p.includes('":') &&
          ((n[f] = p.replace(/"(\w+)":/, "$1:")),
          r.push({ line: f + 1, type: "missing_quote" }));
        break;
      case 3:
        p.includes('":') &&
          ((n[f] = p.replace(/"(\w+)":/, "'$1':")),
          r.push({ line: f + 1, type: "single_quote" }));
        break;
      case 4:
        p.trim() === "{" &&
          ((n[f] = p.replace("{", "")),
          r.push({ line: f + 1, type: "missing_brace" }));
        break;
      case 5:
        (p.trim() === "}," || p.trim() === "}") &&
          ((n[f] = p.replace("}", "}}")),
          r.push({ line: f + 1, type: "extra_brace" }));
        break;
    }
  }
  return (
    (t = n.join(`
`)),
    {
      scenario: l,
      validJson: c,
      brokenJson: t,
      errorLog: r,
      errorCount: r.length,
    }
  );
}
function Qe(e) {
  try {
    let o = JSON.parse(e);
    return JSON.stringify(o);
  } catch {
    return null;
  }
}
async function et(e) {
  return async (o) => {
    let { validJson: a } = ie(e);
    if (!o || typeof o != "string")
      throw new Error("Please submit the fixed JSON.");
    let L = Qe(o);
    if (!L) {
      let t = "JSON is still invalid. ";
      try {
        JSON.parse(o);
      } catch (r) {
        let n = r.message.match(/position (\d+)/);
        if (n) {
          let i = parseInt(n[1]),
            d = o.substring(Math.max(0, i - 50), i + 50);
          t += `Error near position ${i}: "${d}...". ${r.message}. Common issues: missing commas, extra commas, unquoted keys, single quotes, mismatched braces.`;
        } else t += `Parse error: ${r.message}`;
      }
      throw new Error(t);
    }
    let l = Qe(a);
    if (L === l) return !0;
    let s = JSON.parse(o),
      c = JSON.parse(a);
    if (Array.isArray(s) && Array.isArray(c)) {
      if (s.length !== c.length)
        throw new Error(
          `Correct JSON syntax but wrong data. Expected ${c.length} records, got ${s.length}. Make sure you didn't accidentally delete or duplicate any records while fixing errors.`,
        );
      for (let t = 0; t < Math.min(3, s.length); t++)
        if (JSON.stringify(s[t]) !== JSON.stringify(c[t]))
          throw new Error(
            `Record ${t} doesn't match expected data. Make sure you only fixed syntax errors without changing values.`,
          );
    }
    throw new Error(
      "Valid JSON but content doesn't match. Ensure you only fixed syntax errors without modifying any data values.",
    );
  };
}
var Xe,
  Ke,
  tt = u(() => {
    "use strict";
    ((Xe = R(I(), 1)),
      (Ke = [
        {
          name: "config_export",
          title: "Fix Corrupted Configuration Export",
          description:
            "A configuration export was corrupted during transfer - fix the JSON errors",
          context: "application configuration",
          dataType: "configuration settings",
        },
        {
          name: "api_response",
          title: "Repair Malformed API Response",
          description:
            "API response was corrupted - fix syntax errors to parse the data",
          context: "API integration",
          dataType: "API records",
        },
        {
          name: "database_dump",
          title: "Fix Broken Database Export",
          description:
            "Database JSON export has syntax errors - repair for data recovery",
          context: "data migration",
          dataType: "database records",
        },
        {
          name: "log_export",
          title: "Repair Corrupted Log Export",
          description:
            "Log export was corrupted - fix JSON to analyze the logs",
          context: "log analysis",
          dataType: "log entries",
        },
      ]));
  });
var at = {};
M(at, { default: () => q4 });
import E4 from "https://cdn.jsdelivr.net/npm/jszip@3/+esm";
import { html as T4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function q4({ user: e, weight: o = 1, version: a = "" }) {
  let L = "q-broken-json-server",
    l = "Fix Broken JSON File",
    s = { ...e, version: a },
    c = ie(s),
    { brokenJson: t, errorCount: r } = c,
    n = new E4();
  (n.file("broken.json", t),
    n.file(
      "README.md",
      `# ${c.scenario.title}

## Problem

This JSON file was corrupted during ${c.scenario.context}. It contains approximately ${r} syntax errors that prevent it from being parsed.

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
- The file is ${(t.length / 1024).toFixed(0)}KB - be patient!
`,
    ));
  let i = await n.generateAsync({ type: "blob" }),
    d = URL.createObjectURL(i),
    f = T4`
    <p>
      <strong>Scenario:</strong> A critical JSON file from your ${c.scenario.context} was
      corrupted. The file contains ~${r} syntax errors. Your job is to fix all errors so the
      JSON can be parsed.
    </p>

    <p><strong>Your Task:</strong></p>
    <ol>
      <li>Download the broken JSON file (~${(t.length / 1024).toFixed(0)}KB)</li>
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
          <strong>Don't delete records:</strong> All ${(t.match(/\{/g) || []).length} records
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
      <label for="${L}" class="form-label">
        <strong>Paste your fixed JSON here</strong>
      </label>
      <textarea
        class="form-control font-monospace"
        id="${L}"
        name="${L}"
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
  `;
  return { id: L, title: l, weight: o, question: f, answer: await et(s) };
}
var Lt = u(() => {
  "use strict";
  tt();
});
var it = {};
M(it, { default: () => U4 });
import { html as I4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
import R4 from "https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";
function rt(e, o) {
  return e === "port" || e === "workers"
    ? parseInt(o, 10)
    : e === "debug"
      ? /^(1|true|yes|on)$/i.test(String(o))
      : String(o);
}
function N4(e, o = "") {
  let a = R4(
      `q-config-precedence-server#${(e || "").trim().toLowerCase()}#${o}`,
    ),
    L = (p) => p[Math.floor(a() * p.length)],
    l = (p, h) => p + Math.floor(a() * (h - p + 1)),
    s = {
      port: 8e3,
      workers: 1,
      debug: !1,
      log_level: "info",
      api_key: "default-secret-000",
    },
    c = () => {
      let p = {};
      for (let h of ne)
        a() < 0.5 &&
          (h === "port"
            ? (p[h] = l(8e3, 9e3))
            : h === "workers"
              ? (p[h] = l(1, 16))
              : h === "debug"
                ? (p[h] = a() < 0.5)
                : h === "log_level"
                  ? (p[h] = L(ce))
                  : (p[h] = `key-${P4(a, 10)}`));
      return p;
    },
    t = c(),
    r = c(),
    n = c(),
    i = (p) =>
      Object.fromEntries(
        Object.entries(p).map(([h, _]) => [
          h === "num_workers" ? "workers" : h,
          _,
        ]),
      ),
    d = { ...s, ...i(t), ...i(r), ...i(n) },
    f = {};
  for (let p of ne) f[p] = rt(p, d[p]);
  return { baseEffective: f, fileYaml: t, dotenv: r, osenv: n };
}
function D4(e) {
  return Object.entries(e).map(
    ([o, a]) => `${o}: ${typeof a == "boolean" ? String(a) : a}`,
  ).join(`
`);
}
function z4(e) {
  return Object.entries(e).map(
    ([o, a]) =>
      `${o === "workers" ? "NUM_WORKERS" : `APP_${o.toUpperCase()}`}=${a}`,
  ).join(`
`);
}
function j4(e) {
  return Object.entries(e).map(([o, a]) => `${`APP_${o.toUpperCase()}`}=${a}`)
    .join(`
`);
}
async function U4({ user: e, weight: o = 1, version: a = "" }) {
  let L = "q-config-precedence-server",
    l = "Resolve 12-Factor Config Precedence",
    { baseEffective: s, fileYaml: c, dotenv: t, osenv: r } = N4(e.email, a),
    n =
      "background:#212529;color:#f8f9fa;padding:8px 10px;border-radius:4px;font-size:0.82rem;margin:4px 0 0;white-space:pre",
    i = I4`
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
            <pre style="${n}">port: 8000\nworkers: 1\ndebug: false\nlog_level: info\napi_key: default-secret-000</pre>
          </div>
          <div>
            <span style="color:#94a3b8">2. config.development.yaml</span>
            <pre style="${n}">${Object.keys(c).length ? D4(c) : "(empty)"}</pre>
          </div>
          <div>
            <span style="color:#94a3b8">3. .env file</span>
            <pre style="${n}">${Object.keys(t).length ? z4(t) : "(empty)"}</pre>
          </div>
          <div>
            <span style="color:#94a3b8">4. OS env vars (APP_* prefix)</span>
            <pre style="${n}">${Object.keys(r).length ? j4(r) : "(empty)"}</pre>
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
      <label for="${L}" class="form-label"><strong>Your deployed /effective-config endpoint URL</strong></label>
      <input class="form-control font-monospace" id="${L}" name="${L}" type="url"
        placeholder="https://my-config.example.workers.dev/effective-config" />
    </div>
  `;
  return {
    id: L,
    title: l,
    weight: o,
    question: i,
    answer: async (f) => {
      let p = String(f || "").trim();
      if (!p) throw new Error("Enter a URL.");
      if (!/^https?:\/\//i.test(p))
        throw new Error("URL must start with http:// or https://.");
      let h;
      try {
        h = new URL(p).hostname;
      } catch {
        throw new Error("That doesn't look like a valid URL.");
      }
      if (
        /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?)/i.test(
          h,
        )
      )
        throw new Error(
          "The grader can't reach a private/localhost address \u2014 deploy it publicly.",
        );
      let _ = Math.random,
        Z = [...O4].sort(() => _() - 0.5).slice(0, 1 + Math.floor(_() * 2)),
        $ = {},
        A = [];
      for (let g of Z) {
        let y;
        if (g === "port")
          do y = String(8e3 + Math.floor(_() * 1e3));
          while (Number(y) === s.port);
        else if (g === "workers")
          do y = String(1 + Math.floor(_() * 16));
          while (Number(y) === s.workers);
        else if (g === "debug") y = s.debug ? "false" : "true";
        else
          do y = ce[Math.floor(_() * ce.length)];
          while (y === s.log_level);
        (($[g] = y),
          A.push(`set=${encodeURIComponent(g)}=${encodeURIComponent(y)}`));
      }
      let m = { ...s };
      for (let [g, y] of Object.entries($)) m[g] = rt(g, y);
      m.api_key = "****";
      let b = p + (p.includes("?") ? "&" : "?") + A.join("&"),
        v;
      try {
        v = await fetch(b, { headers: { Accept: "application/json" } });
      } catch (g) {
        throw new Error(
          `Could not reach ${p}. Is the service public and CORS enabled? ${g.message || g}`,
        );
      }
      if (!v.ok)
        throw new Error(`GET /effective-config returned HTTP ${v.status}.`);
      let x;
      try {
        x = await v.json();
      } catch {
        throw new Error("Response must be a JSON object.");
      }
      for (let g of ne) {
        let y = x[g],
          w = m[g];
        if (typeof y != typeof w)
          throw new Error(
            `"${g}" should be a ${typeof w} (${JSON.stringify(w)}), got ${JSON.stringify(y)} \u2014 check type coercion/masking.`,
          );
        if (y !== w)
          throw new Error(
            `"${g}" should resolve to ${JSON.stringify(w)} (with CLI ${JSON.stringify($)}), got ${JSON.stringify(y)}.`,
          );
      }
      return {
        correct: !0,
        score: o,
        message:
          "Config precedence, type coercion, alias, and secret masking all verified. \u2705",
      };
    },
  };
}
var ne,
  O4,
  ce,
  ot,
  P4,
  nt = u(() => {
    "use strict";
    ((ne = ["port", "workers", "debug", "log_level", "api_key"]),
      (O4 = ["port", "workers", "debug", "log_level"]),
      (ce = ["debug", "info", "warning", "error"]),
      (ot = "abcdefghijklmnopqrstuvwxyz0123456789"),
      (P4 = (e, o) =>
        Array.from({ length: o }, () => ot[Math.floor(e() * ot.length)]).join(
          "",
        )));
  });
async function de(e) {
  let o = "q-rename-files-server",
    a = e?.version ?? "",
    L = (0, dt.default)(`${e?.email ?? ""}#${o}${a}`),
    l = st[Math.floor(L() * st.length)],
    s = [],
    c = ["docs", "content", "archive", "project"],
    t = ["chapter1", "section-a", "part 2", "m\xF3dulo-3", "2024"],
    r = ["intro", "advanced", "appendix", "donn\xE9es", "r\xE9f\xE9rences"];
  for (let f = 0; f < 30; f++) {
    let p = 1 + Math.floor(L() * 3),
      h = [];
    if (
      (h.push(c[Math.floor(L() * c.length)]),
      p >= 2 && h.push(t[Math.floor(L() * t.length)]),
      p >= 3 && h.push(r[Math.floor(L() * r.length)]),
      L() < 0.2)
    ) {
      let v = [
        "spaces here",
        "file-name",
        "na\xEFve",
        "caf\xE9-2024",
        "test_file",
      ];
      h.push(v[Math.floor(L() * v.length)]);
    }
    let _ = `file${String(f + 1).padStart(2, "0")}.txt`,
      $ = L() < 0.1 ? _.replace("i", "\u0456") : _,
      A = [...h, $].join("/"),
      m;
    L() < 0.3 && se.length > 0
      ? (m = se[Math.floor(L() * se.length)])
      : (m = ct[Math.floor(L() * ct.length)]);
    let b = `category: ${m}

${l.context.toUpperCase()} - File ${f + 1}

This is a test file for the reorganization exercise.
Path: ${A}
Category: ${m}

Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
`;
    s.push({ path: A, category: m, content: b });
  }
  let n = s.map((f) => {
    let p = f.path.split("/"),
      h = p[p.length - 1],
      _ = p.slice(0, -1).join("-");
    return `${f.category}/${_}-${h}`;
  });
  n.sort((f, p) => {
    for (let h = 0; h < Math.min(f.length, p.length); h++)
      if (f.charCodeAt(h) !== p.charCodeAt(h))
        return f.charCodeAt(h) - p.charCodeAt(h);
    return f.length - p.length;
  });
  let i =
      n.map((f) => `./${f}`).join(`
`) +
      `
`,
    d = await J4(i);
  return {
    scenario: l,
    files: s,
    expectedFiles: n,
    expectedHash: d,
    fileList: i,
  };
}
async function J4(e) {
  let o = new TextEncoder().encode(e),
    a = await crypto.subtle.digest("SHA-256", o);
  return Array.from(new Uint8Array(a))
    .map((l) => l.toString(16).padStart(2, "0"))
    .join("");
}
async function lt(e) {
  let { expectedHash: o } = await de(e);
  return async (a) => {
    if (!a || typeof a != "string")
      throw new Error("Please submit the SHA256 hash from the find command.");
    if (a.trim().split(/\s+/)[0] === o) return !0;
    throw a.includes("-")
      ? new Error(
          "Please submit only the hash value (first part before the dash). Run: find . -type f | LC_ALL=C sort | sha256sum | cut -d' ' -f1",
        )
      : new Error(
          "Incorrect hash. This means the files were not renamed/moved correctly. Make sure to: (1) Extract the category from the FIRST line matching 'category: ...', (2) Create category directories, (3) Move files to {category}/{path-with-dashes}-{filename}, (4) Use LC_ALL=C sort for consistent ordering. Check the README.md for examples.",
        );
  };
}
var dt,
  ct,
  se,
  st,
  ft = u(() => {
    "use strict";
    ((dt = R(I(), 1)),
      (ct = [
        "documentation",
        "reports",
        "notes",
        "configs",
        "data",
        "logs",
        "scripts",
        "templates",
        "resources",
        "archives",
      ]),
      (se = [
        "r\xE9sum\xE9",
        "na\xEFve-bayes",
        "\u65E5\u672C\u8A9E",
        "m\xFCnchen",
        "caf\xE9",
      ]),
      (st = [
        {
          name: "documentation_cleanup",
          title: "Documentation Repository Reorganization",
          description:
            "Reorganize scattered documentation files into a category-based flat structure",
          context: "technical documentation",
        },
        {
          name: "archive_migration",
          title: "Legacy Archive Migration",
          description:
            "Migrate legacy archive files from nested structure to categorized flat layout",
          context: "historical archives",
        },
        {
          name: "content_management",
          title: "Content Management System Refactoring",
          description:
            "Restructure CMS content files from hierarchical to category-based organization",
          context: "content files",
        },
        {
          name: "knowledge_base",
          title: "Knowledge Base Reorganization",
          description:
            "Flatten knowledge base articles while preserving category information",
          context: "knowledge articles",
        },
      ]));
  });
var pt = {};
M(pt, { default: () => V4 });
import H4 from "https://cdn.jsdelivr.net/npm/jszip@3/+esm";
import { html as W4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function V4({ user: e, weight: o = 1, version: a = "" }) {
  let L = "q-rename-files-server",
    l = "Reorganize Files with Shell Commands",
    s = { ...e, version: a },
    c = await de(s),
    { files: t } = c,
    r = new H4();
  for (let f of t) r.file(f.path, f.content);
  r.file(
    "README.md",
    `# ${c.scenario.title}

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
`,
  );
  let n = await r.generateAsync({ type: "blob" }),
    i = URL.createObjectURL(n),
    d = W4`
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
      <a href="${i}" download="files_to_reorganize.zip" class="btn btn-primary btn-sm">
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
      <label for="${L}" class="form-label">
        <strong
          >Submit the SHA256 hash from: <code>find . -type f | LC_ALL=C sort | sha256sum</code></strong
        >
      </label>
      <input
        type="text"
        class="form-control font-monospace"
        id="${L}"
        name="${L}"
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
  `;
  return { id: L, title: l, weight: o, question: d, answer: await lt(s) };
}
var ht = u(() => {
  "use strict";
  ft();
});
function le(e) {
  let a = (0, gt.default)(`${e?.email ?? ""}#q-csv-sales-analysis-server`),
    L = W[Math.floor(a() * W.length)],
    l = V[Math.floor(a() * V.length)],
    s = 100 + Math.floor(a() * 50),
    c = ["date,city,product,quantity,price"],
    t = 0;
  for (let n = 0; n < s; n += 1) {
    let i = V[Math.floor(a() * V.length)],
      d = Math.floor(a() * 28) + 1,
      f = W[Math.floor(a() * W.length)],
      p = mt[Math.floor(a() * mt.length)],
      h = Math.floor(a() * 10) + 1,
      _ = (Math.floor(a() * 5e4) + 1e4) / 100;
    (c.push(`2025-${i}-${d},${f},${p},${h},${_}`),
      f === L && i === l && (t += h * _));
  }
  let r = Math.round(t);
  return {
    csvContent: c.join(`
`),
    numRows: s,
    targetCity: L,
    targetMonth: l,
    expectedRevenue: r,
  };
}
async function bt(e) {
  return async (o) => {
    let { expectedRevenue: a, targetCity: L, targetMonth: l } = le(e),
      s = Number(String(o ?? "").trim());
    if (!Number.isFinite(s))
      throw new Error("Please provide a valid integer for the total revenue.");
    if (Math.abs(s - a) > 2)
      throw new Error(
        `The total revenue ${s} is incorrect. Ensure you're calculating: SUM(quantity * price) for city=${L} AND month=${l}. Round to nearest integer.`,
      );
    return !0;
  };
}
var gt,
  W,
  mt,
  V,
  yt = u(() => {
    "use strict";
    ((gt = R(I(), 1)),
      (W = [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Chennai",
        "Kolkata",
        "Pune",
      ]),
      (mt = [
        "Laptop",
        "Phone",
        "Tablet",
        "Monitor",
        "Keyboard",
        "Mouse",
        "Headset",
      ]),
      (V = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]));
  });
var ut = {};
M(ut, { default: () => Y4 });
import B4 from "https://cdn.jsdelivr.net/npm/jszip@3/+esm";
import { html as F4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function Y4({ user: e, weight: o = 1 }) {
  let a = "q-csv-sales-analysis-server",
    L = "Extract and Analyze CSV Sales Data from ZIP",
    l = le(e),
    { csvContent: s, numRows: c, targetCity: t, targetMonth: r } = l,
    n = new B4();
  (n.file("sales_data.csv", s),
    n.file(
      "README.txt",
      `Sales Data Archive - Q1 2025

This CSV contains sales transactions with columns:
- date: Transaction date (YYYY-MMM-DD format)
- city: City where sale occurred
- product: Product sold
- quantity: Number of units
- price: Price per unit

Analyze this data to extract business insights.
`,
    ));
  let i = await n.generateAsync({ type: "blob" }),
    d = URL.createObjectURL(i),
    f = F4`
    <p>
      <strong>Scenario:</strong> You are a business analyst at <strong>TechMart Electronics</strong>. The sales team has
      archived Q1 2025 transaction data in CSV format and needs you to calculate regional performance metrics.
    </p>

    <p><strong>Task:</strong></p>
    <ol>
      <li>Download and extract the ZIP archive containing sales data CSV</li>
      <li>Load the CSV file <code>sales_data.csv</code></li>
      <li>
        Calculate <strong>total revenue</strong> for transactions in <strong>${t}</strong> during
        <strong>${r} 2025</strong>
      </li>
      <li>Formula: Revenue = SUM(quantity × price) for matching rows</li>
      <li>Round to nearest integer and submit</li>
    </ol>

    <p>
      <a href="${d}" download="sales_data.zip" class="btn btn-primary btn-sm"> 📥 Download Sales Data (ZIP) </a>
    </p>

    <p><strong>Data Format:</strong></p>
    <ul>
      <li><strong>File:</strong> sales_data.csv</li>
      <li><strong>Columns:</strong> date, city, product, quantity, price</li>
      <li><strong>Rows:</strong> ~${c} transactions</li>
      <li>Filter by: city = "${t}" AND month = "${r}"</li>
    </ul>

    <div class="mb-3">
      <label for="${a}" class="form-label">
        Enter total revenue for ${t} in ${r} 2025 (rounded integer)
      </label>
      <input type="number" class="form-control" id="${a}" name="${a}" placeholder="e.g., 45230" required />
    </div>

    <details>
      <summary>💡 Implementation Hints</summary>

      <p><strong>Using Python with Pandas:</strong></p>
      <pre><code>import pandas as pd
import zipfile

# Extract ZIP
with zipfile.ZipFile('sales_data.zip', 'r') as zip_ref:
    zip_ref.extractall('extracted')

# Load CSV
df = pd.read_csv('extracted/sales_data.csv')

# Extract month from date
df['month'] = df['date'].str.split('-').str[1]

# Filter data
filtered = df[(df['city'] == '${t}') & (df['month'] == '${r}')]

# Calculate revenue
filtered['revenue'] = filtered['quantity'] * filtered['price']
total_revenue = round(filtered['revenue'].sum())

print(f"Total Revenue: {total_revenue}")</code></pre>

      <p><strong>Alternative: Using Standard Library:</strong></p>
      <pre><code>import csv
import zipfile

with zipfile.ZipFile('sales_data.zip', 'r') as zip_ref:
    zip_ref.extractall('extracted')

total_revenue = 0
with open('extracted/sales_data.csv', 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        date_parts = row['date'].split('-')
        month = date_parts[1]
        city = row['city']

        if city == '${t}' and month == '${r}':
            quantity = int(row['quantity'])
            price = float(row['price'])
            total_revenue += quantity * price

print(f"Total Revenue: {round(total_revenue)}")</code></pre>
    </details>

    <details>
      <summary>📊 Data Analysis Tips</summary>
      <ul>
        <li>Extract month from date column using string operations</li>
        <li>Filter rows where BOTH city AND month match your criteria</li>
        <li>Calculate revenue per row: quantity × price</li>
        <li>Sum all matching revenues</li>
        <li>Round to nearest integer for final answer</li>
      </ul>
    </details>
  `;
  return { id: a, title: L, weight: o, question: f, answer: await bt(e) };
}
var _t = u(() => {
  "use strict";
  yt();
});
var vt = {};
M(vt, { default: () => K4 });
import { html as G4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function K4({ user: e, weight: o = 1 }) {
  let a = "q-github-pages",
    L = "Host your portfolio on GitHub Pages",
    l = async (c) => {
      if (((c = c.trim()), !new URL(c).hostname.includes("github.io")))
        throw new Error("URL should be hosted on github.io");
      let r = await fetch(`/proxy/${c}`).then((n) => n.text());
      if (!r.match(e.email))
        throw new Error(
          `${e.email} is not in the response: ${r.slice(0, 1e3)}...`,
        );
      return !0;
    },
    s = G4`
    <div class="mb-3">
      <p>
        Publish a page using <a href="https://pages.github.com/">GitHub Pages</a> that showcases your work. Ensure that
        your email address <strong><code>${e.email}</code></strong> is in the page's HTML.
      </p>
      <p>
        GitHub pages are served via CloudFlare which
        <a href="https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/">obfuscates emails</a>.
        So, wrap your email address inside a:
        <pre><code class="language-html">&lt;!--email_off--&gt;${e.email}&lt;!--/email_off--&gt;</code></pre>
      </p>
      <label for="${a}" class="form-label">
        What is the GitHub Pages URL? It might look like:
        <code>https://[USER].github.io/[REPO]/</code>
      </label>
      <input class="form-control" id="${a}" name="${a}" />
      <p class="text-muted">
        If a recent change that's not reflected, add <code>?v=1</code>, <code>?v=2</code> to the URL to bust the cache.
      </p>
    </div>
  `;
  return { id: a, title: L, weight: o, question: s, answer: l };
}
var xt = u(() => {
  "use strict";
});
var wt = {};
M(wt, { default: () => X4 });
import { html as Q4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function X4({ user: e, weight: o = 4, version: a = "" }) {
  let L = "q-git-forensics-token-server",
    l = "Git Forensics: Recover the Leaked Token",
    s = `./questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign || "")}&questionId=${encodeURIComponent(L)}`,
    c = Q4`
    <div class="mb-3">
      <p>
        A staging token was committed to a repository and later rotated out. Download the history,
        rebuild it with <code>git fast-import</code>, and use git history tools
        (<code>git log -p</code>, <code>git log -S</code>, <code>git show</code>) to find the
        commit that <strong>introduced</strong> the token.
      </p>
      <iframe
        title="Git history"
        src="${s}"
        style="width:100%;height:420px;border:1px solid #dee2e6;border-radius:12px;background:#fff"
      ></iframe>
      <label for="${L}" class="form-label mt-2"><strong>Your Answer (JSON)</strong></label>
      <textarea class="form-control font-monospace" id="${L}" name="${L}" rows="4"
        placeholder='{"token": "stg_...", "commit_subject": "..."}'
        style="font-size:0.82rem;"></textarea>
    </div>
  `;
  return {
    id: L,
    title: l,
    weight: o,
    question: c,
    answer: async (r) => {
      let n = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            response: r,
            weight: o,
            questionId: L,
            version: a,
          }),
        }),
        i = await n.json();
      if (!n.ok) throw new Error(i.error || "Unable to verify.");
      return i;
    },
  };
}
var kt = u(() => {
  "use strict";
});
var St = {};
M(St, { default: () => n1 });
import { html as e1 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
import t1 from "https://cdn.jsdelivr.net/npm/seedrandom@3.0.5/+esm";
function o1(e) {
  let o = 0,
    a = 0;
  for (; o === 0; ) o = e();
  for (; a === 0; ) a = e();
  return Math.sqrt(-2 * Math.log(o)) * Math.cos(2 * Math.PI * a);
}
function Zt(e, o) {
  let a = Array.from({ length: o }, () => o1(e)),
    L = Math.sqrt(a.reduce((l, s) => l + s * s, 0));
  return a.map((l) => l / L);
}
function Mt(e, o, a) {
  let L = Zt(e, a),
    l = o.map((c, t) => c * 0.85 + L[t] * 0.15),
    s = Math.sqrt(l.reduce((c, t) => c + t * t, 0));
  return l.map((c) => c / s);
}
function r1(e, o, a = "") {
  let L = t1(
      `${e}#${String(o || "")
        .trim()
        .toLowerCase()}#${a}`,
    ),
    l = {};
  for (let t of z) l[t] = Zt(L, P);
  let s = [];
  for (let t = 0; t < B; t++) {
    let r = z[t % z.length],
      n = Mt(L, l[r], P),
      i = fe[r],
      d = Array.from({ length: 4 }, () => i[Math.floor(L() * i.length)]);
    s.push({
      doc_id: `D${String(t + 1).padStart(6, "0")}`,
      topic: r,
      title: d.join(" ") + " overview",
      embedding: n,
    });
  }
  let c = [];
  for (let t = 0; t < F; t++) {
    let r = z[t % z.length],
      n = Mt(L, l[r], P),
      i = fe[r],
      d = Array.from({ length: 3 }, () => i[Math.floor(L() * i.length)]);
    c.push({
      query_id: `Q${String(t + 1).padStart(3, "0")}`,
      query_text: d.join(" ") + " techniques",
      embedding: n,
    });
  }
  return { documents: s, queries: c };
}
function i1(e, o = "") {
  let { documents: a, queries: L } = r1(a1, e, o);
  return {
    description: [
      "Your task: for each query, find the top 5 most similar documents by cosine similarity.",
      `Documents: ${B} | Queries: ${F} | Embedding dimension: ${P}`,
      "Submit a JSON object mapping each query_id to a list of 5 doc_ids (ordered by similarity, highest first).",
      "Tie-break rule: if two documents have equal similarity, the one with the smaller doc_id comes first.",
    ].join(`
`),
    num_documents: B,
    num_queries: F,
    embedding_dim: P,
    documents: a.map(({ doc_id: l, title: s, embedding: c }) => ({
      doc_id: l,
      title: s,
      embedding: c,
    })),
    queries: L.map(({ query_id: l, query_text: s, embedding: c }) => ({
      query_id: l,
      query_text: s,
      embedding: c,
    })),
    expected_answer_format: {
      Q001: ["D000001", "D000002", "D000003", "D000004", "D000005"],
      "...": "...",
    },
  };
}
async function n1({ user: e, weight: o = 1, version: a = "" }) {
  let L = L1,
    l = "Cosine Similarity Search (VecSearch Labs)",
    s = i1(e.email, a),
    c = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" }),
    t = e1`
    <div class="mb-3">
      <p>
        <strong>Scenario:</strong> <em>VecSearch Labs</em> is building a lightweight semantic search engine
        over a corpus of technical documents. Instead of calling an embedding API, the embeddings are
        precomputed and provided directly. Your task is to implement the <strong>cosine similarity ranking</strong>
        that powers the search results.
      </p>

      <svg viewBox="0 0 760 175" width="100%" style="margin:20px 0;max-width: 960px;display:block;background:#fafafa;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 4px 6px -1px rgba(0,0,0,.05)" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-cs" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/></pattern>
          <filter id="sh-cs"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0f172a" flood-opacity=".08"/></filter>
          <marker id="arr-cs" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b"/></marker>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-cs)" rx="12"/>
        <!-- Document corpus box -->
        <g transform="translate(18,20)" filter="url(#sh-cs)">
          <rect width="185" height="135" rx="8" fill="#fff" stroke="#cbd5e1" stroke-width="1.5"/>
          <rect width="185" height="22" rx="8" fill="#e0f2fe"/>
          <text x="10" y="15" font-family="system-ui,sans-serif" font-size="9" font-weight="bold" fill="#0369a1">250 DOCUMENTS (64-dim)</text>
          <text x="10" y="38" font-family="monospace" font-size="8" fill="#0f172a">D000001: [0.12, -0.34, ...]</text>
          <text x="10" y="51" font-family="monospace" font-size="8" fill="#0f172a">D000002: [0.89,  0.11, ...]</text>
          <text x="10" y="64" font-family="monospace" font-size="8" fill="#64748b">D000003: [0.45, -0.67, ...]</text>
          <text x="10" y="77" font-family="monospace" font-size="8" fill="#64748b">...  (250 rows)</text>
          <line x1="10" y1="90" x2="175" y2="90" stroke="#e2e8f0" stroke-width="1"/>
          <text x="10" y="105" font-family="system-ui,sans-serif" font-size="8" font-weight="bold" fill="#0369a1">10 QUERIES</text>
          <text x="10" y="118" font-family="monospace" font-size="8" fill="#0f172a">Q001: [0.22,  0.71, ...]</text>
          <text x="10" y="131" font-family="monospace" font-size="8" fill="#64748b">...  (10 queries)</text>
        </g>
        <!-- Arrow -->
        <path d="M 215 87 L 255 87" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3" fill="none" marker-end="url(#arr-cs)"/>
        <!-- Cosine computation box -->
        <g transform="translate(265,28)" filter="url(#sh-cs)">
          <rect width="215" height="120" rx="8" fill="#1e293b"/>
          <rect width="215" height="24" rx="8" fill="#0f172a"/>
          <text x="12" y="16" font-family="monospace" font-size="10" font-weight="bold" fill="#38bdf8">Cosine Similarity</text>
          <text x="12" y="42" font-family="monospace" font-size="8.5" fill="#94a3b8">cos(q, d) = q·d / (|q| × |d|)</text>
          <line x1="10" y1="55" x2="205" y2="55" stroke="#334155" stroke-width="1"/>
          <text x="12" y="70" font-family="monospace" font-size="8.5" fill="#fcd34d">import numpy as np</text>
          <text x="12" y="83" font-family="monospace" font-size="8.5" fill="#fcd34d">sims = D_emb @ q_emb</text>
          <text x="12" y="96" font-family="monospace" font-size="8.5" fill="#fcd34d">top5 = np.argsort(-sims)[:5]</text>
          <text x="12" y="109" font-family="monospace" font-size="8.5" fill="#34d399">→ sort desc, tie-break by id</text>
        </g>
        <!-- Arrow -->
        <path d="M 492 87 L 522 87" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3" fill="none" marker-end="url(#arr-cs)"/>
        <!-- Result box -->
        <g transform="translate(532,30)" filter="url(#sh-cs)">
          <rect width="208" height="115" rx="8" fill="#fff" stroke="#0ea5e9" stroke-width="2"/>
          <rect width="208" height="22" rx="8" fill="#f0f9ff"/>
          <text x="10" y="15" font-family="system-ui,sans-serif" font-size="9" font-weight="bold" fill="#0369a1">TOP-5 RESULTS (JSON)</text>
          <text x="10" y="37" font-family="monospace" font-size="8.5" fill="#0f172a">{"Q001": ["D000151",</text>
          <text x="10" y="50" font-family="monospace" font-size="8.5" fill="#0f172a">  "D000146", "D000166",</text>
          <text x="10" y="63" font-family="monospace" font-size="8.5" fill="#0f172a">  "D000091", "D000126"],</text>
          <text x="10" y="76" font-family="monospace" font-size="8.5" fill="#64748b"> "Q002": ["D000097",</text>
          <text x="10" y="89" font-family="monospace" font-size="8.5" fill="#64748b">  "D000012", ...],</text>
          <text x="10" y="102" font-family="monospace" font-size="8.5" fill="#64748b"> ... 10 queries total}</text>
        </g>
      </svg>

      <p><strong>Your task:</strong></p>
      <ol>
        <li>Load the downloaded JSON file — it contains <strong>${B} documents</strong> and <strong>${F} queries</strong>, each with a precomputed ${P}-dimensional embedding.</li>
        <li>For each query, compute the <strong>cosine similarity</strong> to all 250 documents.</li>
        <li>Return the <strong>top 5 document IDs</strong> per query, sorted by similarity descending.</li>
        <li>Tie-break rule: if two documents have equal similarity, the one with the <strong>smaller doc_id</strong> comes first.</li>
      </ol>

      <p><strong>Answer format:</strong></p>
      <pre style="font-size:0.82rem;border:1px solid #e2e8f0;border-radius:6px;padding:10px">{
  "Q001": ["D000151", "D000146", "D000166", "D000091", "D000126"],
  "Q002": ["D000097", "D000012", "D000092", "D000232", "D000177"],
  ...
}</pre>

      <p>
        <strong>Step 1:</strong> Download your personalised task file:
        <button class="btn btn-sm btn-outline-primary ms-2" type="button" @click=${() => H(c, L + ".json")}>
          Download ${L}.json
        </button>
      </p>
      <p class="text-muted" style="font-size:0.85rem">
        Hint: Use <code>numpy</code> — <code>D_emb @ q_emb</code> gives all cosine similarities at once if embeddings are already unit-normalised (they are).
      </p>
      <div class="mb-3">
        <label for="${L}" class="form-label"><strong>Step 2: Paste your JSON answer:</strong></label>
        <textarea class="form-control font-monospace" id="${L}" name="${L}" rows="6"
          placeholder='{"Q001": ["D000001", ...], "Q002": [...], ...}'></textarea>
      </div>
    </div>
  `;
  return {
    id: L,
    title: l,
    weight: o,
    question: t,
    answer: async (n) => {
      let i;
      try {
        i = JSON.parse(String(n || "").trim());
      } catch {
        throw new Error("Answer must be valid JSON.");
      }
      if (typeof i != "object" || Array.isArray(i))
        throw new Error(
          "Answer must be a JSON object mapping query IDs to arrays of doc IDs.",
        );
      let d = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            response: i,
            weight: o,
            questionId: L,
            version: a,
          }),
        }),
        f = await d.json();
      if (!d.ok) throw new Error(f.error || "Unable to verify.");
      return f;
    },
  };
}
var a1,
  L1,
  fe,
  z,
  P,
  B,
  F,
  $t = u(() => {
    "use strict";
    re();
    ((a1 = "tds-2026-05-ga3-cosine-sim-client-v1"),
      (L1 = "q-cosine-similarity-server"),
      (fe = {
        ML: [
          "neural",
          "gradient",
          "backprop",
          "loss",
          "epoch",
          "batch",
          "model",
          "train",
          "feature",
          "weight",
          "activation",
          "layer",
          "dropout",
          "learning",
          "inference",
          "embedding",
          "transformer",
          "attention",
        ],
        DATA: [
          "query",
          "database",
          "index",
          "schema",
          "table",
          "row",
          "column",
          "join",
          "aggregate",
          "filter",
          "pipeline",
          "etl",
          "warehouse",
          "stream",
          "batch",
          "partition",
          "shard",
          "replica",
        ],
        WEB: [
          "http",
          "request",
          "response",
          "cache",
          "cookie",
          "session",
          "token",
          "api",
          "endpoint",
          "rest",
          "graphql",
          "websocket",
          "latency",
          "throughput",
          "bandwidth",
          "proxy",
          "cdn",
          "tls",
        ],
        MATH: [
          "vector",
          "matrix",
          "eigenvalue",
          "integral",
          "derivative",
          "probability",
          "distribution",
          "variance",
          "covariance",
          "correlation",
          "regression",
          "hypothesis",
          "bayes",
          "entropy",
          "gradient",
          "manifold",
        ],
        CLOUD: [
          "container",
          "kubernetes",
          "docker",
          "pod",
          "service",
          "deployment",
          "scaling",
          "ingress",
          "node",
          "cluster",
          "autoscale",
          "loadbalancer",
          "microservice",
          "serverless",
          "function",
          "bucket",
          "volume",
        ],
      }),
      (z = Object.keys(fe)),
      (P = 64),
      (B = 250),
      (F = 10));
  });
var Tt = {};
M(Tt, { default: () => s1 });
import { html as c1 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function Et(e, o) {
  let L = await (
      await fetch("https://aipipe.org/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${globalThis.aiPipeToken}`,
        },
        body: JSON.stringify({
          model: e,
          messages: [{ role: "user", content: o }],
        }),
      })
    ).json(),
    l = L.choices?.[0]?.message?.content;
  if (typeof l != "string") throw new Error(`${e}: ${JSON.stringify(L)}`);
  return l;
}
async function s1({ weight: e = 2 }) {
  let o = "q-llm-yes-no-split",
    a = "One prompt, two models, two answers",
    L = c1`
    <p>
      Different LLMs answer the same question differently — they know different things, reason differently, and
      follow instructions differently. Knowing where models disagree helps you pick the right one for a job.
    </p>
    <p>
      Write <strong>one prompt, at most ${j} characters</strong>, that makes <code>${Y}</code> say
      <code>Yes</code> and <code>${G}</code> say <code>No</code>.
    </p>
    <ul>
      <li>The same prompt is sent to both models, with no system prompt.</li>
      <li><code>${Y}</code>'s reply must contain the word <code>Yes</code> and not <code>No</code>.</li>
      <li><code>${G}</code>'s reply must contain the word <code>No</code> and not <code>Yes</code>.</li>
      <li>Words are case-sensitive: <code>yes</code> or <code>YES</code> don't count.</li>
    </ul>
    <p>Use your <a href="https://aipipe.org/">AI Pipe</a> token when prompted.</p>
    <div class="mb-3">
      <label for="${o}" class="form-label">Your prompt (max ${j} characters)</label>
      <input class="form-control" id="${o}" name="${o}" maxlength="${j}" />
      <p class="text-muted">
        LLM answers vary from run to run. Make your prompt robust, not lucky.
      </p>
    </div>
  `;
  return {
    id: o,
    title: a,
    weight: e,
    question: L,
    answer: async (s) => {
      if (((s = (s || "").trim()), !s)) throw new Error("Enter a prompt.");
      if (s.length > j)
        throw new Error(`Prompt is ${s.length} characters; the limit is ${j}.`);
      At !== s &&
        (globalThis.aiPipeToken ||
          (globalThis.aiPipeToken = prompt("Enter your AI Pipe Token")),
        (Ct = await Promise.all([Et(Y, s), Et(G, s)])),
        (At = s));
      let [c, t] = Ct,
        r = K(c, "Yes") && !K(c, "No"),
        n = K(t, "No") && !K(t, "Yes");
      if (!r || !n)
        throw new Error(
          `${r ? "\u2713" : "\u2717"} ${Y} (needs Yes) said: ${c}  |  ${n ? "\u2713" : "\u2717"} ${G} (needs No) said: ${t}`,
        );
      return !0;
    },
  };
}
var j,
  Y,
  G,
  K,
  At,
  Ct,
  qt = u(() => {
    "use strict";
    ((j = 100),
      (Y = "gpt-5.6-luna"),
      (G = "gpt-5.4-mini"),
      (K = (e, o) => new RegExp(`\\b${o}\\b`).test(e)));
  });
var It = {};
M(It, { default: () => l1 });
import { html as d1 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function l1({ user: e, weight: o = 1 }) {
  let a = "q-termlog-rec-server",
    L = "Decode it in the terminal (termlog)",
    l = `${location.origin}/questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign || "")}&questionId=${encodeURIComponent(a)}`,
    s = d1`
    <div class="mb-3">
      <p>
        <a href="https://github.com/mynkpdr/termlog" target="_blank" rel="noopener">termlog</a>
        records your terminal and signs the recording with your Google login.
      </p>
      <ol>
        <li>Install termlog and run <code>termlog login</code> with <strong>${e.email}</strong>.</li>
        <li>Start recording: <code>termlog rec demo.cast</code></li>
        <li>Inside the recording, fetch your challenge:<pre class="mt-2"><code>curl -s "${l}"</code></pre></li>
        <li>
          Decode it <strong>using shell commands, in the same recording</strong>. It's your code, put through 3
          reversible transforms.
        </li>
        <li>Type <code>exit</code>. termlog writes <code>demo.cast</code> and <code>demo.cast.jwt</code>.</li>
        <li>
          Pack both into one archive:
          <pre class="mt-2"><code>tar -czf submission.tar.gz demo.cast demo.cast.jwt</code></pre>
        </li>
        <li>
          Upload <code>submission.tar.gz</code> somewhere public the exam server can fetch.
        </li>
      </ol>
      <details class="mb-2">
        <summary>Hint</summary>
        <p class="mt-2 mb-0">
          The transforms are, in some order: ROT13, hex encoding, and string reversal. Each one has a common
          shell one-liner that undoes it (think <code>tr</code>, <code>xxd</code> and friends). Work out the
          order by inspecting the cipher text — what does it look like right before the last transform was
          applied?
        </p>
      </details>
      <label for="${a}" class="form-label">Public URL of submission.tar.gz</label>
      <input class="form-control" id="${a}" name="${a}" type="url" placeholder="https://.../submission.tar.gz" />
      <p class="form-text">
        Everything you type in the recording is captured. Don't type passwords or API keys. The code changes
        every 3 hours — decode it in the same recording where you fetched it, not an old one.
      </p>
    </div>
  `;
  return {
    id: a,
    title: L,
    weight: o,
    question: s,
    answer: async (t) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            response: t,
            weight: o,
            questionId: a,
          }),
        }),
        n = await r.json();
      if (!r.ok) throw new Error(n.error || "Unable to verify.");
      return n;
    },
  };
}
var Rt = u(() => {
  "use strict";
});
var Ot = {};
M(Ot, { default: () => p1 });
import { html as f1 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function p1({ user: e, weight: o = 1, version: a = "v1" }) {
  let L = "q-mcp-server-live-server",
    l = "Build a Live MCP Server",
    s = f1`
    <div class="mb-3">
      <p class="lead">
        Build and deploy a publicly reachable <strong>MCP server</strong> that exposes one tool. The grader will
        connect to your server as a real MCP client, list its tools, and call your tool with fresh per-call HTTP
        headers.
      </p>
      <p>
        This is the same server-side contract MCP-based tools, IDE integrations, agent frameworks, and data
        connectors must implement to be usable by an MCP client. The handshake and tool-call shape here are the real
        protocol at minimal scope.
      </p>

      <h6>What to implement</h6>
      <ul>
        <li>Deploy an MCP endpoint over HTTPS.</li>
        <li>Expose exactly one required tool named <code>solve_challenge</code>.</li>
        <li>The tool input schema has no required properties.</li>
        <li>On every <code>tools/call</code>, read the challenge from the HTTP request headers, not from the JSON body.</li>
      </ul>

      <h6>Headers the grader sends on each tool call</h6>
      <ul>
        <li>
          <code>X-Exam-Challenge</code>: 32 lowercase hex characters, generated freshly for that call and never reused.
        </li>
        <li><code>X-Exam-Timestamp</code>: Unix milliseconds at generation time.</li>
        <li>
          <code>X-Exam-Signature</code>: hex HMAC-SHA256 over
          <code>${"${challenge}.${timestamp}.${normalizedEmail}"}</code>, keyed by an exam-only secret.
          This lets you reject requests that do not look like they came from the exam system if you want to.
          Signature verification is optional and unscored.
        </li>
      </ul>

      <h6>Required tool response</h6>
      <p>
        Return a single MCP text content block. Its text must be the first 16 lowercase hex characters of
        <code>SHA-256("${"${challenge}:${normalizedEmail}"}")</code>, where:
      </p>
      <ul>
        <li><code>challenge</code> is the raw value of <code>X-Exam-Challenge</code> for that one call.</li>
        <li><code>normalizedEmail</code> is your registered exam email, trimmed and lowercased:
          <code>${String(e.email || "")
            .trim()
            .toLowerCase()}</code>.</li>
      </ul>

      <h6>Worked example</h6>
      <p>These values are fake and only illustrate the format:</p>
      <pre><code>X-Exam-Challenge: 0123456789abcdef0123456789abcdef
registered email: learner@example.com
tool text response: 8f4a2c6e1b90d735</code></pre>

      <h6>How grading works</h6>
      <ul>
        <li>The grader submits an MCP <code>initialize</code> request to your URL.</li>
        <li>It sends <code>notifications/initialized</code>, then calls <code>tools/list</code>.</li>
        <li>It confirms a tool literally named <code>solve_challenge</code> exists.</li>
        <li>It calls <code>solve_challenge</code> five times with five fresh random challenges.</li>
        <li>All five calls must return the correct text for full credit. Any failed live check receives zero.</li>
      </ul>

      <div class="alert alert-warning" role="alert">
        <strong>Live grading note:</strong> your score reflects your server's live behavior at the moment each check
        runs. Keep it running and correct through the grading deadline. A score you got earlier does not carry over if
        your server is down or broken later.
      </div>

      <label for="${L}" class="form-label"><strong>Public MCP endpoint URL</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${L}"
        name="${L}"
        rows="2"
        placeholder="https://your-mcp-server.example.com/mcp"
        autocomplete="off"
      ></textarea>
      <p class="form-text text-muted mb-0">Only public HTTPS URLs are accepted.</p>
    </div>
  `;
  return {
    id: L,
    title: l,
    weight: o,
    question: s,
    answer: async (t) => {
      let r = String(t || "").trim();
      if (!r) throw new Error("Enter your public MCP endpoint URL.");
      if (!r.startsWith("https://"))
        throw new Error("URL must start with https://.");
      try {
        new URL(r);
      } catch {
        throw new Error("Enter a valid HTTPS URL.");
      }
      let n = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            response: r,
            weight: o,
            questionId: L,
            version: a,
          }),
        }),
        i = await n.json();
      if (!n.ok) throw new Error(i.error || "Verification failed.");
      return i;
    },
  };
}
var Pt = u(() => {
  "use strict";
});
var Nt = {};
M(Nt, { default: () => m1 });
import { html as h1 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
async function m1({ user: e, weight: o = 4 }) {
  let a = "q-ledger-agent-server",
    L = "The Ledger Agent",
    l = `${location.origin}/questionData?email=${encodeURIComponent(e.email)}&quizSign=${encodeURIComponent(e.quizSign || "")}&questionId=${encodeURIComponent(a)}&path=/`,
    s = h1`
    <div class="mb-3">
      <p class="lead">
        Acme Appliances has an order ledger API. Nobody wrote docs for it. Build a service that answers questions
        about it in plain English.
      </p>
      <p>Your company's API (it's yours alone — other students see different data):</p>
      <pre><code>${l}</code></pre>
      <p>Start there. Everything you need to know about the data is reachable from that URL.</p>

      <h6>What to build</h6>
      <ul>
        <li>
          A public HTTPS endpoint that accepts <code>POST</code> with JSON <code>{"question": "..."}</code> and
          replies with JSON <code>{"answer": ...}</code>.
        </li>
        <li>
          Questions are about revenue, refunds, products, and customers — for example:
          <em>"What was the total revenue in USD from the North region in March 2026?"</em>
        </li>
        <li>Numbers can be plain numbers. Money is in USD, correct to the cent. Product names as the API spells them.</li>
      </ul>

      <h6>How it's graded</h6>
      <ul>
        <li>We send several questions at once, worded in different ways, that you haven't seen before.</li>
        <li>Every one must be answered correctly within 15 seconds.</li>
        <li>If any answer is wrong or late, we stop and tell you which one.</li>
      </ul>

      <label for="${a}" class="form-label"><strong>Your endpoint URL</strong></label>
      <input class="form-control font-monospace" id="${a}" name="${a}" placeholder="https://your-service.example.com/answer" />
    </div>
  `;
  return {
    id: a,
    title: L,
    weight: o,
    question: s,
    answer: async (t) => {
      let r = await fetch("/backendVerify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: e.email,
            quizSign: e.quizSign,
            response: t,
            weight: o,
            questionId: a,
          }),
        }),
        n = await r.json();
      if (!r.ok) throw new Error(n.error || "Unable to verify.");
      return n;
    },
  };
}
var Dt = u(() => {
  "use strict";
});
var pe,
  zt = u(() => {
    pe = [
      {
        target_id: "tg-001",
        family: "deep-concavity",
        expected_match_key:
          "961265cc5fddf7dc86990c4fbd34ea066ce6d86c8db83a8baa0d1446e41cdb73",
        svg_path:
          "M 77 241 L 32 286 L 32 287 L 58 287 L 59 288 L 59 352 L 140 433 L 140 434 L 96 478 L 96 479 L 186 479 L 187 480 L 187 544 L 188 544 L 252 480 L 252 416 L 316 352 L 316 351 L 312 351 L 311 350 L 311 260 L 310 260 L 219 351 L 125 351 L 124 350 L 124 287 L 78 241 Z",
      },
      {
        target_id: "tg-002",
        family: "mixed",
        expected_match_key:
          "e47bb383681ba2422703bbfc000cc7af906a664b4b099d751713e1ab3ce7ace1",
        svg_path:
          "M 33 287 L 33 414 L 31 415 L 31 544 L 160 544 L 224 480 L 224 479 L 162 417 L 162 416 L 226 352 L 226 351 L 162 287 Z M 98 481 L 99 480 L 158 480 L 159 481 L 159 540 L 158 541 Z M 96 354 L 97 355 L 97 414 L 95 415 L 95 476 L 94 477 L 34 417 L 34 416 Z M 160 290 L 161 291 L 161 350 L 160 351 L 101 351 L 100 350 Z",
      },
      {
        target_id: "tg-003",
        family: "deep-concavity",
        expected_match_key:
          "80df0dff5fd7a7b273467b795ff877f17b4b8edb89e476867b2dcebf0233eddd",
        svg_path:
          "M 31 351 L 31 352 L 95 416 L 95 544 L 96 544 L 192 448 L 223 448 L 314 539 L 315 539 L 315 449 L 316 448 L 320 448 L 320 383 L 318 383 L 277 342 L 277 341 L 321 297 L 321 296 L 231 296 L 190 255 L 189 255 L 189 384 L 252 384 L 253 385 L 223 415 L 160 415 L 96 351 Z",
      },
      {
        target_id: "tg-004",
        family: "diagonal",
        expected_match_key:
          "2d2d0da4a268cc2efc42a581919d229b540b984c023056e01481a56b3403b5f7",
        svg_path:
          "M 32 71 L 32 163 L 75 206 L 74 207 L 45 207 L 45 271 L 44 272 L 32 272 L 32 363 L 33 364 L 33 545 L 35 543 L 125 543 L 125 452 L 124 451 L 124 270 L 122 272 L 111 272 L 110 271 L 110 207 L 79 207 L 78 206 L 78 117 Z",
      },
      {
        target_id: "tg-005",
        family: "deep-concavity",
        expected_match_key:
          "f070c74304df916b9391f32c1ceab6e2925acad345d88bdbb026c1d770c1e0d2",
        svg_path:
          "M 350 331 L 259 331 L 213 377 L 212 376 L 212 286 L 122 376 L 32 376 L 32 467 L 33 467 L 76 424 L 77 424 L 122 469 L 212 469 L 213 470 L 213 505 L 175 543 L 175 544 L 240 544 L 240 480 L 342 378 L 342 377 L 307 377 L 306 376 L 350 332 Z",
      },
      {
        target_id: "tg-006",
        family: "deep-concavity",
        expected_match_key:
          "5508e19a47d1b123bd0216fde65218ffc7f1aa8ca160783cdc30e909c26560bd",
        svg_path:
          "M 387 405 L 387 314 L 296 314 L 251 359 L 161 359 L 160 358 L 160 343 L 31 343 L 31 344 L 159 472 L 161 473 L 161 543 L 205 499 L 206 499 L 250 543 L 251 543 L 251 453 L 297 407 L 297 405 L 341 361 L 342 361 L 386 405 Z",
      },
      {
        target_id: "tg-007",
        family: "deep-concavity",
        expected_match_key:
          "6bc0317c234f942c65829c02fbd00b5b781b1f0ce4d4aec849ea1ffce2519df9",
        svg_path:
          "M 213 459 L 213 460 L 277 524 L 278 524 L 278 459 Z M 97 167 L 33 231 L 33 232 L 94 232 L 95 233 L 33 295 L 33 360 L 32 361 L 30 361 L 120 451 L 120 452 L 208 452 L 209 453 L 165 497 L 165 498 L 210 543 L 211 543 L 211 453 L 212 452 L 303 452 L 213 362 L 213 361 L 99 361 L 98 360 L 98 296 L 162 232 L 162 231 L 98 167 Z",
      },
      {
        target_id: "tg-008",
        family: "deep-concavity",
        expected_match_key:
          "30927089e8c55956c6679982e7d20ba5487ff8edb2aca61d7336357097fea2ec",
        svg_path:
          "M 416 477 L 352 413 L 288 413 L 224 349 L 223 349 L 159 413 L 95 413 L 95 415 L 31 479 L 31 544 L 32 544 L 94 482 L 95 483 L 95 542 L 96 542 L 177 461 L 178 461 L 223 506 L 224 506 L 269 461 L 270 461 L 351 542 L 352 542 L 352 481 L 353 480 L 415 542 L 416 542 Z",
      },
      {
        target_id: "tg-009",
        family: "deep-concavity",
        expected_match_key:
          "87417c6669ed7acc9ba5732a3bf8c6c7caff12147e5b34f7400262df541b31c1",
        svg_path:
          "M 161 296 L 161 298 L 160 299 L 95 299 L 95 301 L 31 365 L 31 430 L 32 430 L 34 428 L 98 428 L 98 365 L 99 364 L 160 364 L 161 365 L 161 412 L 159 413 L 31 541 L 31 542 L 223 542 L 225 544 L 226 544 L 290 480 L 290 479 L 163 479 L 162 478 L 252 388 L 252 387 Z",
      },
      {
        target_id: "tg-010",
        family: "deep-concavity",
        expected_match_key:
          "5da94999a82c4621b9cd21c4a611a4b02e9ccaa4ec84d6c1db83341ca885a0fb",
        svg_path:
          "M 410 251 L 281 251 L 281 252 L 344 315 L 343 316 L 259 316 L 216 273 L 217 272 L 246 272 L 246 207 L 181 207 L 181 272 L 210 272 L 211 273 L 121 363 L 30 363 L 121 454 L 123 455 L 123 544 L 125 543 L 215 543 L 215 542 L 169 496 L 169 407 L 214 362 L 305 362 L 305 361 L 349 317 L 349 316 L 347 315 L 410 252 Z",
      },
      {
        target_id: "tg-011",
        family: "deep-concavity",
        expected_match_key:
          "a7bc82e43311a939cbc5bc703a2ae3b73d914d1cfc64183ec36b539a64b8958a",
        svg_path:
          "M 138 162 L 138 253 L 139 253 L 152 240 L 180 240 L 181 241 L 92 330 L 94 330 L 95 331 L 95 390 L 94 391 L 32 329 L 31 329 L 31 394 L 95 458 L 95 460 L 99 458 L 119 478 L 119 544 L 184 544 L 184 543 L 144 503 L 144 502 L 189 457 L 189 456 L 145 412 L 145 411 L 224 332 L 225 330 L 275 330 L 186 241 L 187 240 L 216 240 L 216 176 L 229 163 L 229 162 Z",
      },
      {
        target_id: "tg-012",
        family: "few-anchors",
        expected_match_key:
          "9da7346ee9f5e93d5dfd25b6d78e3dbdb475f37df856df00648c6951adaa627a",
        svg_path:
          "M 31 543 L 31 544 L 160 544 L 224 480 L 287 480 L 351 544 L 480 544 L 480 543 L 352 415 L 159 415 Z",
      },
      {
        target_id: "tg-013",
        family: "few-anchors",
        expected_match_key:
          "a78171dac1dfb9a4e0f1938fce11c4f4ca951dbb1077e7405d75f25330cfabe9",
        svg_path: "M 31 543 L 31 544 L 352 544 L 352 415 L 159 415 Z",
      },
      {
        target_id: "tg-014",
        family: "deep-concavity",
        expected_match_key:
          "9ed1a6ff28e2e5de7987128d73072fc302f74a2075433ecbf1a097bc6f1b6b00",
        svg_path:
          "M 206 195 L 205 195 L 160 240 L 160 294 L 159 295 L 31 295 L 31 296 L 67 332 L 67 511 L 35 543 L 35 544 L 164 544 L 164 543 L 101 480 L 101 479 L 157 423 L 160 424 L 205 379 L 205 287 L 207 285 L 297 285 L 297 284 L 252 239 L 250 239 Z",
      },
      {
        target_id: "tg-015",
        family: "deep-concavity",
        expected_match_key:
          "9fad9ac619e044c82b65033112db734e1de90489204b85e7d5e151e96f122048",
        svg_path:
          "M 320 319 L 195 319 L 194 318 L 237 275 L 237 274 L 192 229 L 191 229 L 146 274 L 146 275 L 190 319 L 190 320 L 63 447 L 63 448 L 124 448 L 125 449 L 95 479 L 31 479 L 31 544 L 32 544 L 64 512 L 128 512 L 192 448 L 273 448 L 319 494 L 320 494 L 365 449 L 365 448 L 321 448 L 257 384 L 257 383 L 320 320 Z",
      },
      {
        target_id: "tg-016",
        family: "deep-concavity",
        expected_match_key:
          "094f18e9ff972a190f41369efd0a14853d024dd3fd654f8c2b09241f830a33a8",
        svg_path:
          "M 251 214 L 250 214 L 205 259 L 205 260 L 249 304 L 248 305 L 185 305 L 57 433 L 57 434 L 118 434 L 119 435 L 56 498 L 32 498 L 32 499 L 77 544 L 78 544 L 123 499 L 123 497 L 185 435 L 186 435 L 217 466 L 217 530 L 282 530 L 282 529 L 250 497 L 250 370 L 314 306 L 314 305 L 253 305 L 252 304 L 296 260 L 296 259 Z",
      },
      {
        target_id: "tg-017",
        family: "diagonal",
        expected_match_key:
          "b6dfa0a8fd420e2b5a493cdc2ae6026416bb2f6d5c12f72794a8d114f90646a8",
        svg_path:
          "M 32 406 L 32 407 L 78 453 L 78 543 L 167 543 L 168 544 L 351 544 L 261 454 L 261 452 L 238 429 L 238 365 L 174 365 L 171 362 L 79 362 L 77 361 Z M 79 452 L 79 451 L 123 407 L 125 408 L 212 408 L 213 409 L 169 453 L 80 453 Z",
      },
      {
        target_id: "tg-018",
        family: "deep-concavity",
        expected_match_key:
          "7b6ae4721c625c42eb65cd0cdd4dd7ab0358ef62f16100b566f94321df5bf792",
        svg_path:
          "M 37 113 L 37 242 L 38 242 L 58 222 L 59 223 L 59 351 L 58 352 L 32 352 L 32 443 L 33 443 L 58 418 L 59 419 L 59 480 L 88 480 L 89 481 L 89 544 L 154 544 L 154 543 L 92 481 L 93 480 L 124 480 L 124 416 L 188 352 L 188 351 L 60 223 L 58 222 L 70 210 L 134 210 L 134 146 L 166 114 L 166 113 Z",
      },
      {
        target_id: "tg-019",
        family: "deep-concavity",
        expected_match_key:
          "26818bd3a5857e766241309ba7efe7fbedbe8fa3d0463419d1b06d6ecbd49b4a",
        svg_path:
          "M 379 350 L 334 305 L 333 305 L 223 415 L 160 415 L 96 351 L 31 351 L 31 352 L 95 416 L 95 544 L 96 544 L 160 480 L 287 480 L 351 544 L 352 544 L 352 352 L 353 351 L 379 351 Z",
      },
      {
        target_id: "tg-020",
        family: "deep-concavity",
        expected_match_key:
          "76da9833dc0ce984b3e385696b5a0c170873185512dda2ee8d34ad315d78811b",
        svg_path:
          "M 32 118 L 32 119 L 77 164 L 77 448 L 140 511 L 140 512 L 109 543 L 109 544 L 174 544 L 174 480 L 270 384 L 270 383 L 206 383 L 123 300 L 123 118 Z",
      },
      {
        target_id: "tg-021",
        family: "mixed",
        expected_match_key:
          "18510f0d65bd8b09cb1743fc888c5079525a0114b61232ec4e26b643e2428460",
        svg_path:
          "M 159 287 L 31 415 L 31 480 L 32 480 L 94 418 L 95 419 L 95 544 L 96 544 L 159 481 L 160 481 L 223 544 L 224 544 L 224 419 L 225 418 L 287 480 L 288 480 L 288 415 L 160 287 Z",
      },
      {
        target_id: "tg-022",
        family: "mixed",
        expected_match_key:
          "bbe179d8653798a29420897008a77b17414866a458249329c3d688f2b88aa38f",
        svg_path:
          "M 97 287 L 33 351 L 33 352 L 92 352 L 93 353 L 31 415 L 31 416 L 33 417 L 33 480 L 97 544 L 226 544 L 226 543 L 189 506 L 189 505 L 279 415 L 99 415 L 98 414 L 160 352 L 162 352 L 162 287 Z",
      },
      {
        target_id: "tg-023",
        family: "deep-concavity",
        expected_match_key:
          "6514a9005f6f4768fdcfb598367719bb8927139a82d13fe8efbb72ffb7479857",
        svg_path:
          "M 159 287 L 95 351 L 95 414 L 94 415 L 32 353 L 31 353 L 31 482 L 32 482 L 94 420 L 95 421 L 95 480 L 159 544 L 160 544 L 288 416 L 287 413 L 332 368 L 332 367 L 287 322 L 286 322 L 241 367 L 240 367 L 160 287 Z M 158 354 L 159 355 L 159 476 L 158 477 L 97 416 L 97 415 Z",
      },
      {
        target_id: "tg-024",
        family: "mixed",
        expected_match_key:
          "99764a092ebb10af9ce65b4ada5e942620ff3057975602f85f333225515a88a5",
        svg_path:
          "M 124 262 L 34 352 L 31 351 L 31 480 L 33 480 L 97 544 L 162 544 L 226 480 L 226 415 L 225 415 L 161 479 L 160 479 L 124 443 L 124 331 L 125 330 L 189 330 L 190 331 L 190 357 L 191 357 L 236 312 L 236 311 L 190 265 L 125 265 L 124 264 Z",
      },
      {
        target_id: "tg-025",
        family: "deep-concavity",
        expected_match_key:
          "beb2be1240a2b4d619a0b15b343a6aedaa2531760155353bd49bbc044eab8a16",
        svg_path:
          "M 210 193 L 209 193 L 164 238 L 164 239 L 185 260 L 184 261 L 59 261 L 59 262 L 97 300 L 97 414 L 95 415 L 31 479 L 31 480 L 95 544 L 96 544 L 96 482 L 142 436 L 298 436 L 298 371 L 297 371 L 278 390 L 189 390 L 188 389 L 188 358 L 252 294 L 252 293 L 189 293 L 188 292 L 188 265 L 189 264 L 209 284 L 210 284 L 255 239 L 255 238 Z",
      },
      {
        target_id: "tg-026",
        family: "few-anchors",
        expected_match_key:
          "85492615bbfc376b094e59517f1b2dacef5e4f738899fd625051afa62c424154",
        svg_path:
          "M 121 259 L 30 350 L 56 350 L 57 351 L 57 544 L 186 544 L 186 351 L 187 350 L 213 350 L 122 259 Z",
      },
      {
        target_id: "tg-027",
        family: "mixed",
        expected_match_key:
          "db5f957727bee7a9c70359fde8f4efcc08422536102056bd8c58ad3e59828e6e",
        svg_path:
          "M 31 287 L 31 352 L 95 352 L 287 544 L 288 544 L 352 480 L 352 351 L 223 351 L 223 412 L 222 413 L 96 287 Z",
      },
      {
        target_id: "tg-028",
        family: "few-anchors",
        expected_match_key:
          "ceed0e07f423f75960748361856221102c151782bc0f7234cb48c813474cf33a",
        svg_path:
          "M 31 479 L 31 480 L 95 544 L 416 544 L 480 480 L 480 479 L 289 479 L 288 478 L 288 415 L 159 415 L 159 478 L 158 479 Z",
      },
      {
        target_id: "tg-029",
        family: "deep-concavity",
        expected_match_key:
          "33f0411993c2f8de3679648005a9bed607f988ffb246a0ea42d3268576001c76",
        svg_path:
          "M 33 239 L 33 368 L 32 369 L 123 460 L 124 460 L 149 435 L 150 435 L 166 451 L 166 452 L 121 497 L 31 497 L 31 498 L 76 543 L 168 543 L 168 542 L 212 498 L 214 498 L 214 370 L 215 369 L 99 369 L 98 368 L 98 304 L 117 285 L 207 285 L 207 284 L 162 239 Z",
      },
      {
        target_id: "tg-030",
        family: "deep-concavity",
        expected_match_key:
          "98ad884599727b7c90cd429528e674f1697b25026cb8b99bb9a916edd9e94e8e",
        svg_path:
          "M 336 245 L 271 245 L 271 309 L 236 344 L 235 344 L 191 300 L 191 298 L 146 253 L 145 253 L 100 298 L 100 299 L 145 344 L 146 344 L 189 301 L 190 302 L 190 390 L 165 415 L 161 415 L 160 413 L 96 349 L 95 349 L 31 413 L 31 414 L 128 414 L 129 415 L 129 544 L 130 544 L 258 416 L 258 414 L 302 370 L 393 370 L 303 280 L 303 279 L 336 246 Z",
      },
      {
        target_id: "tg-031",
        family: "mixed",
        expected_match_key:
          "747348236c0984545883a56dd73890e8bee8d07c45227e124c23b581e7cba75c",
        svg_path:
          "M 31 415 L 31 480 L 95 544 L 224 544 L 224 499 L 225 498 L 269 542 L 270 542 L 316 496 L 316 431 L 270 385 L 269 385 L 225 429 L 224 428 L 224 415 L 160 351 L 159 351 L 95 415 L 95 476 L 94 477 L 32 415 Z M 225 431 L 250 431 L 251 432 L 251 495 L 250 496 L 225 496 L 224 495 L 224 432 Z",
      },
      {
        target_id: "tg-032",
        family: "deep-concavity",
        expected_match_key:
          "8e18e4988e07e3b3f41cc32848e8018ad8050995ec07f017d237793f1a99edcb",
        svg_path:
          "M 95 283 L 31 347 L 31 412 L 95 476 L 96 476 L 96 415 L 97 414 L 159 476 L 159 540 L 160 540 L 201 499 L 202 499 L 246 543 L 247 543 L 247 453 L 288 412 L 288 348 L 289 347 L 313 347 L 313 346 L 268 301 L 267 301 L 222 346 L 223 348 L 223 410 L 222 411 L 161 411 L 160 410 L 160 347 L 96 283 Z",
      },
      {
        target_id: "tg-033",
        family: "few-anchors",
        expected_match_key:
          "a349558dff7603eff759212afc1e2cbae4906d03171662f7faa8cd2e74c34fba",
        svg_path: "M 31 287 L 31 544 L 160 544 L 160 287 Z",
      },
      {
        target_id: "tg-034",
        family: "elongated",
        expected_match_key:
          "6fdc862d04220d1e57931f5e3328d98de3b37000c65eef00242e54f8370871ad",
        svg_path:
          "M 31 543 L 31 544 L 160 544 L 160 481 L 161 480 L 220 480 L 221 481 L 221 544 L 286 544 L 286 481 L 287 480 L 350 480 L 351 481 L 351 544 L 480 544 L 480 543 L 352 415 L 159 415 Z",
      },
      {
        target_id: "tg-035",
        family: "mixed",
        expected_match_key:
          "e6a650e787a2b6551c739a62a5776fb2c5c137931400ec4a27a4fe569785c7a2",
        svg_path:
          "M 122 260 L 31 351 L 31 480 L 95 544 L 160 544 L 224 480 L 224 415 L 178 369 L 177 369 L 132 414 L 132 415 L 158 415 L 159 416 L 159 476 L 158 477 L 122 441 L 122 331 L 124 330 L 188 266 L 188 265 L 123 265 L 122 264 Z",
      },
      {
        target_id: "tg-036",
        family: "elongated",
        expected_match_key:
          "b04ca78e2e39d5a059e805f70fa263c4bd2f09388e8853828a717563e30c3d57",
        svg_path:
          "M 30 417 L 120 507 L 120 508 L 85 543 L 85 544 L 342 544 L 342 543 L 305 506 L 305 505 L 395 415 L 212 415 L 211 417 Z",
      },
      {
        target_id: "tg-037",
        family: "deep-concavity",
        expected_match_key:
          "2c1ff777a143e865369b33c07b26b61ae00a451f0bd9a359146860f5863ceff9",
        svg_path:
          "M 32 256 L 32 347 L 77 392 L 77 394 L 141 394 L 205 458 L 207 459 L 207 505 L 169 543 L 169 544 L 298 544 L 298 415 L 207 324 L 207 328 L 206 329 L 141 329 L 124 346 L 123 345 L 123 256 L 122 256 L 78 300 L 77 300 L 33 256 Z",
      },
      {
        target_id: "tg-038",
        family: "elongated",
        expected_match_key:
          "0f5895be051ebabe92c95903fe3aa3478c0503bc1f9b207707fe7720bdfdc0ab",
        svg_path:
          "M 95 139 L 31 203 L 31 204 L 94 204 L 95 205 L 95 331 L 67 359 L 67 360 L 69 362 L 69 541 L 68 543 L 159 543 L 159 453 L 160 451 L 158 449 L 158 270 L 160 268 L 160 139 Z",
      },
      {
        target_id: "tg-039",
        family: "deep-concavity",
        expected_match_key:
          "34b4208dbfc995fa024d1303ef046516871ad5c0851dc0ca9286c50e0b3bd3f9",
        svg_path:
          "M 31 540 L 96 540 L 96 481 L 97 480 L 223 480 L 287 544 L 352 544 L 352 543 L 288 479 L 288 417 L 289 416 L 352 416 L 416 352 L 416 351 L 351 351 L 287 415 L 163 415 L 162 414 L 224 352 L 224 351 L 31 351 L 31 416 L 94 416 L 95 417 L 95 475 L 31 539 Z",
      },
      {
        target_id: "tg-040",
        family: "deep-concavity",
        expected_match_key:
          "86533506cbb92552221c4028009ce0b3d6a0e01f1bb0e9bda98f59291f5537e7",
        svg_path:
          "M 333 190 L 242 190 L 242 280 L 160 362 L 159 362 L 96 299 L 31 299 L 31 300 L 211 480 L 211 544 L 276 544 L 276 543 L 224 491 L 224 429 L 225 428 L 254 428 L 255 429 L 255 492 L 320 492 L 320 491 L 258 429 L 259 428 L 288 428 L 288 236 L 333 191 Z",
      },
      {
        target_id: "tg-041",
        family: "deep-concavity",
        expected_match_key:
          "151116a046e14cbe16003fc7cf83de3d4dc49b89c7f9af25cc01187a6ecef78c",
        svg_path:
          "M 31 293 L 31 294 L 95 294 L 159 358 L 158 359 L 249 450 L 251 450 L 295 494 L 295 495 L 253 537 L 253 538 L 318 538 L 318 474 L 341 451 L 342 451 L 386 495 L 386 543 L 387 543 L 432 498 L 432 497 L 386 451 L 386 312 L 339 359 L 225 359 L 224 357 L 96 229 L 95 229 Z",
      },
      {
        target_id: "tg-042",
        family: "deep-concavity",
        expected_match_key:
          "3296bbcec0902a62f48ab09d70c0b4107ef1a27797cf6c5c3a37a2b18ed50435",
        svg_path:
          "M 433 543 L 433 453 L 434 451 L 343 360 L 343 418 L 342 419 L 31 419 L 31 484 L 225 484 L 251 510 L 252 510 L 278 484 L 342 484 L 343 485 L 343 541 L 342 543 Z",
      },
      {
        target_id: "tg-043",
        family: "deep-concavity",
        expected_match_key:
          "eb17dc5ee5c1165e1a1b29d7a9b82fe88d45a05a9874135863edcf1eaa97054a",
        svg_path:
          "M 341 414 L 296 369 L 295 369 L 249 415 L 168 415 L 162 409 L 163 408 L 222 408 L 222 279 L 221 279 L 189 311 L 61 311 L 61 312 L 124 375 L 124 376 L 93 407 L 93 408 L 95 409 L 95 471 L 31 535 L 31 536 L 96 536 L 160 472 L 223 472 L 295 544 L 296 544 L 296 416 L 297 415 L 341 415 Z",
      },
      {
        target_id: "tg-044",
        family: "deep-concavity",
        expected_match_key:
          "45da14995b21bc973477ed8b2fbc9202884b96a4242dbd9a531b7349d6fc6bff",
        svg_path:
          "M 450 436 L 450 372 L 451 370 L 361 370 L 360 369 L 360 351 L 359 351 L 295 415 L 166 415 L 122 371 L 31 371 L 31 372 L 76 417 L 166 417 L 167 418 L 167 544 L 232 544 L 232 481 L 233 480 L 294 480 L 295 481 L 295 544 L 360 544 L 360 462 L 386 436 Z",
      },
      {
        target_id: "tg-045",
        family: "elongated",
        expected_match_key:
          "30b59763025aa10d5a536d904e1c0f6c45061f66812f74fb2ddf229e69c1241a",
        svg_path:
          "M 160 159 L 159 159 L 31 287 L 31 288 L 94 288 L 95 289 L 33 351 L 33 352 L 94 352 L 95 353 L 33 415 L 33 416 L 94 416 L 95 417 L 33 479 L 33 480 L 94 480 L 95 481 L 33 543 L 33 544 L 162 544 L 162 287 L 160 286 Z",
      },
      {
        target_id: "tg-046",
        family: "deep-concavity",
        expected_match_key:
          "4d90a8dd69331d447e06f2d0806706ebda9449237ec778b64a8870c7188b5263",
        svg_path:
          "M 77 279 L 77 405 L 76 406 L 76 497 L 75 498 L 32 498 L 32 499 L 77 544 L 168 544 L 214 498 L 169 498 L 168 497 L 168 411 L 169 410 L 213 454 L 214 454 L 259 409 L 259 408 L 214 363 L 213 363 L 169 407 L 168 406 L 168 318 L 202 284 L 203 284 L 267 348 L 268 348 L 268 283 L 205 283 L 204 282 L 206 280 L 206 279 Z",
      },
      {
        target_id: "tg-047",
        family: "deep-concavity",
        expected_match_key:
          "6443b7ffe8381b2ae43a7a32b78f0e196252a9cb49f071bcf17c56b43c2f21c8",
        svg_path:
          "M 59 287 L 59 415 L 58 416 L 32 416 L 32 417 L 123 508 L 123 544 L 124 544 L 186 482 L 187 483 L 187 544 L 316 544 L 316 543 L 234 461 L 234 373 L 236 372 L 281 327 L 281 326 L 189 326 L 188 325 L 188 413 L 187 414 L 60 287 Z",
      },
      {
        target_id: "tg-048",
        family: "deep-concavity",
        expected_match_key:
          "23335fc2ae60cc267ea150ed0a6d52f3de85fa0a27ebc5da2d63632749b6ba12",
        svg_path:
          "M 57 233 L 57 234 L 79 256 L 79 344 L 77 345 L 32 390 L 32 481 L 35 480 L 99 544 L 228 544 L 228 543 L 191 506 L 191 505 L 281 415 L 101 415 L 100 414 L 123 391 L 125 392 L 125 300 L 122 297 L 122 233 Z",
      },
      {
        target_id: "tg-049",
        family: "mixed",
        expected_match_key:
          "8e9edef36213410b1f208ba758660d2201fc62bccb1d36362275891382caa0e3",
        svg_path:
          "M 146 246 L 146 339 L 158 351 L 158 352 L 95 415 L 95 476 L 94 477 L 32 415 L 31 415 L 31 480 L 95 544 L 224 544 L 224 415 L 193 384 L 193 383 L 237 339 L 237 246 L 236 246 L 192 290 L 191 290 L 147 246 Z",
      },
      {
        target_id: "tg-050",
        family: "diagonal",
        expected_match_key:
          "b47dfb4c935742c4f46260dbcfc41c0d934791ae92b52d49a2f44ddbf8f5b1ab",
        svg_path:
          "M 32 360 L 32 451 L 33 451 L 77 407 L 78 408 L 78 499 L 123 544 L 124 544 L 124 542 L 126 540 L 307 540 L 217 450 L 217 449 L 252 414 L 252 413 L 216 413 L 215 412 L 215 322 L 214 322 L 124 412 L 123 411 L 123 360 L 78 315 L 77 315 Z",
      },
      {
        target_id: "tg-051",
        family: "deep-concavity",
        expected_match_key:
          "12c46ef3201ac6bf411a4f989680d8761a8f9a208752945bfccc35eb70aa288c",
        svg_path:
          "M 95 189 L 31 253 L 31 254 L 95 254 L 159 318 L 159 446 L 222 446 L 223 447 L 223 509 L 189 543 L 189 544 L 254 544 L 254 480 L 352 382 L 352 381 L 289 381 L 288 380 L 288 253 L 287 253 L 224 316 L 223 316 L 96 189 Z",
      },
      {
        target_id: "tg-052",
        family: "few-anchors",
        expected_match_key:
          "1c20a714a735444884aa0ad54568e8be19baffffae5d2fbb59d30e7597468de6",
        svg_path: "M 31 543 L 31 544 L 416 544 L 416 543 L 288 415 L 159 415 Z",
      },
      {
        target_id: "tg-053",
        family: "deep-concavity",
        expected_match_key:
          "bf141b3865b479a55dbed6026b67231c97187bb2df0ffc701e2b380b30fd60ab",
        svg_path:
          "M 97 177 L 97 242 L 162 242 L 163 243 L 163 411 L 161 413 L 160 412 L 160 351 L 159 351 L 95 415 L 95 445 L 31 509 L 31 510 L 96 510 L 96 480 L 124 452 L 159 452 L 204 497 L 204 498 L 160 542 L 160 543 L 251 543 L 251 453 L 252 452 L 252 324 L 254 322 L 254 321 L 162 229 L 162 177 Z",
      },
      {
        target_id: "tg-054",
        family: "mixed",
        expected_match_key:
          "3585f699ca5672dd73ec525a8b380d93d83e7a3f29be471ae2bbe43013e5db9d",
        svg_path:
          "M 31 323 L 31 452 L 32 452 L 113 371 L 114 372 L 114 460 L 95 479 L 95 480 L 126 480 L 127 481 L 127 544 L 192 544 L 192 481 L 193 480 L 224 480 L 224 479 L 206 461 L 206 373 L 207 372 L 287 452 L 288 452 L 288 323 Z",
      },
      {
        target_id: "tg-055",
        family: "deep-concavity",
        expected_match_key:
          "56e20541b694119a26585d81dc018b33b0925deb9865f412277a5a5607e2e621",
        svg_path:
          "M 122 160 L 32 250 L 32 251 L 123 251 L 124 252 L 124 361 L 123 362 L 123 545 L 213 455 L 215 456 L 215 545 L 306 454 L 306 453 L 215 362 L 214 363 L 170 319 L 170 227 L 125 182 L 123 181 L 123 160 Z",
      },
      {
        target_id: "tg-056",
        family: "deep-concavity",
        expected_match_key:
          "28cf82b081f50afbcd53272e48ed9afdfa6ee7249433fbc6d9d9ed0a33a98ce2",
        svg_path:
          "M 324 305 L 195 305 L 195 434 L 197 434 L 213 450 L 213 451 L 168 496 L 77 496 L 33 452 L 32 452 L 32 543 L 214 542 L 259 497 L 262 498 L 326 434 L 326 433 L 324 432 Z",
      },
      {
        target_id: "tg-057",
        family: "diagonal",
        expected_match_key:
          "0d530a369f11fe325c697d60e4e886487ca4cc844eb365f1647157e03ccd1663",
        svg_path:
          "M 396 351 L 331 351 L 267 415 L 207 415 L 206 414 L 215 405 L 215 404 L 122 404 L 77 449 L 77 451 L 32 496 L 32 497 L 76 541 L 75 544 L 204 544 L 285 463 L 375 463 L 375 462 L 331 418 L 331 417 L 396 352 Z",
      },
      {
        target_id: "tg-058",
        family: "deep-concavity",
        expected_match_key:
          "7f65eed641882984486995f11f671d5e95ecedf614d4e1608cc6c0e871ec6708",
        svg_path:
          "M 182 191 L 181 191 L 136 236 L 136 237 L 157 258 L 156 259 L 31 259 L 31 260 L 49 278 L 49 368 L 95 414 L 95 452 L 96 453 L 96 543 L 187 543 L 187 542 L 143 498 L 143 497 L 188 452 L 223 452 L 255 484 L 256 484 L 301 439 L 301 438 L 211 438 L 160 387 L 160 263 L 161 262 L 181 282 L 182 282 L 227 237 L 227 236 Z",
      },
      {
        target_id: "tg-059",
        family: "diagonal",
        expected_match_key:
          "8f202973c9d29af1d36069e2f9e3d4414629451ad790ad6bc26b05629c7f8a39",
        svg_path:
          "M 30 544 L 276 544 L 278 542 L 459 542 L 368 451 L 367 451 L 339 479 L 336 479 L 290 433 L 288 433 L 244 389 L 243 389 L 199 433 L 197 433 L 151 479 L 148 479 L 122 453 L 121 453 Z",
      },
      {
        target_id: "tg-060",
        family: "diagonal",
        expected_match_key:
          "b625675a962d3971a5e5a92e0c00c80f8338b87f5c21ea3b8a6a1f441a390eca",
        svg_path:
          "M 30 544 L 213 544 L 214 543 L 302 543 L 304 544 L 349 499 L 349 407 L 165 407 L 120 452 L 120 454 Z",
      },
      {
        target_id: "tg-061",
        family: "deep-concavity",
        expected_match_key:
          "db9717407c90b9b646a9606d9223f1bcf75c6a90516b7376eb28708f1b2f7ed2",
        svg_path:
          "M 31 285 L 31 542 L 157 542 L 158 543 L 249 543 L 249 542 L 205 498 L 205 496 L 115 496 L 96 477 L 96 447 L 97 446 L 160 446 L 160 381 L 97 381 L 96 380 L 96 350 L 114 332 L 204 332 L 250 286 L 161 286 L 160 285 Z",
      },
      {
        target_id: "tg-062",
        family: "deep-concavity",
        expected_match_key:
          "3c8f4f8ad65ec2c6f197345a9a25cf0af693f13d8983295ca166c6a7ecdb0cca",
        svg_path:
          "M 414 303 L 413 303 L 349 367 L 349 412 L 348 413 L 221 413 L 220 415 L 160 415 L 96 351 L 96 349 L 31 349 L 31 414 L 94 414 L 95 415 L 95 544 L 96 544 L 160 480 L 221 480 L 285 544 L 286 544 L 286 481 L 287 480 L 349 542 L 350 542 L 350 432 L 414 368 Z",
      },
      {
        target_id: "tg-063",
        family: "deep-concavity",
        expected_match_key:
          "a38d83ee224ee908eae28faedf0a95ba0bd32c335e097a4712a02d03cf76bb1c",
        svg_path:
          "M 415 496 L 326 496 L 325 495 L 369 451 L 367 451 L 366 449 L 302 385 L 273 385 L 272 384 L 315 341 L 315 340 L 270 295 L 269 295 L 224 340 L 224 341 L 267 384 L 266 385 L 237 385 L 237 386 L 301 450 L 300 451 L 186 451 L 186 452 L 159 479 L 31 479 L 31 480 L 95 544 L 96 544 L 98 542 L 279 542 L 280 541 L 368 541 L 370 542 L 415 497 Z",
      },
      {
        target_id: "tg-064",
        family: "deep-concavity",
        expected_match_key:
          "ae7263aaac3a492ab3bdd406cec219ce03c50143aa015ab04b843a7a2f3ff92c",
        svg_path:
          "M 31 287 L 31 352 L 94 352 L 95 353 L 95 406 L 94 407 L 94 499 L 139 544 L 140 544 L 140 455 L 142 454 L 188 408 L 223 408 L 248 433 L 248 523 L 249 523 L 294 478 L 294 477 L 288 471 L 288 408 L 352 344 L 352 343 L 288 279 L 287 279 L 287 342 L 286 343 L 160 343 L 96 279 L 95 279 L 95 286 L 94 287 Z",
      },
      {
        target_id: "tg-065",
        family: "few-anchors",
        expected_match_key:
          "4f07a23d71463f08faa9adea500bb91e669dc46bdf27ffa93b2eb7875e50821f",
        svg_path:
          "M 31 479 L 31 480 L 156 480 L 157 481 L 95 543 L 95 544 L 288 544 L 288 543 L 226 481 L 227 480 L 352 480 L 352 479 L 224 351 L 159 351 Z",
      },
      {
        target_id: "tg-066",
        family: "few-anchors",
        expected_match_key:
          "9bb81ab20fef1a0c04037e08eb0350f463e1a6e2755a016f2f9651911cb3ed3e",
        svg_path:
          "M 159 287 L 31 415 L 31 544 L 32 544 L 159 417 L 160 417 L 287 544 L 288 544 L 288 415 L 160 287 Z",
      },
      {
        target_id: "tg-067",
        family: "deep-concavity",
        expected_match_key:
          "4fd334fcdc4276235e1b1591723d224c4dccd18fcddcddc2348311f17ce2e4ef",
        svg_path:
          "M 32 274 L 32 275 L 76 319 L 76 411 L 121 456 L 123 457 L 123 545 L 213 455 L 214 455 L 295 536 L 296 536 L 296 409 L 298 408 L 298 407 L 234 343 L 233 343 L 215 361 L 214 361 L 170 317 L 169 317 L 124 362 L 123 361 L 123 274 Z",
      },
      {
        target_id: "tg-068",
        family: "deep-concavity",
        expected_match_key:
          "8e7803b74e9c7f2616ca33e3ee495a156fb427385e893ba5e226a5c1b85b8a44",
        svg_path:
          "M 77 195 L 32 240 L 32 241 L 65 274 L 65 517 L 38 544 L 221 544 L 194 517 L 194 453 L 131 390 L 131 389 L 155 365 L 156 365 L 191 400 L 192 400 L 256 336 L 256 335 L 128 335 L 79 286 L 79 285 L 123 241 L 123 240 L 78 195 Z",
      },
      {
        target_id: "tg-069",
        family: "deep-concavity",
        expected_match_key:
          "e79f9723b188f53d3f23593f35ecd9d50596003904dec224ebec6fe15f34172d",
        svg_path:
          "M 30 387 L 57 414 L 57 542 L 122 542 L 122 478 L 146 454 L 275 454 L 301 480 L 301 544 L 366 544 L 366 416 L 393 389 L 213 389 L 212 388 L 213 387 Z",
      },
      {
        target_id: "tg-070",
        family: "deep-concavity",
        expected_match_key:
          "7346762b401a5e0b767b630e7b6821a59989f6cf4a5981baaed5db753f6408a5",
        svg_path:
          "M 370 323 L 305 323 L 241 387 L 124 387 L 78 341 L 77 341 L 32 386 L 32 387 L 111 387 L 112 388 L 49 451 L 49 516 L 50 516 L 112 454 L 113 455 L 113 516 L 114 516 L 178 452 L 215 452 L 306 543 L 307 543 L 307 499 L 308 498 L 372 498 L 372 497 L 308 433 L 306 432 L 306 389 L 307 388 L 370 388 Z",
      },
      {
        target_id: "tg-071",
        family: "deep-concavity",
        expected_match_key:
          "e37022999dab98c42c86fb011bc70dcd09a74e4ca4d31e3869565cf8dce9f1b2",
        svg_path:
          "M 121 97 L 121 188 L 165 232 L 164 233 L 135 233 L 135 296 L 134 297 L 103 297 L 103 298 L 121 316 L 121 317 L 31 407 L 31 408 L 121 498 L 121 499 L 76 544 L 259 544 L 123 408 L 123 407 L 232 298 L 232 297 L 201 297 L 200 296 L 200 233 L 168 233 L 167 232 L 167 142 L 122 97 Z",
      },
      {
        target_id: "tg-072",
        family: "diagonal",
        expected_match_key:
          "ba06409c7655328c49a55413071c2b23a60975ced2e1440ad6adf96eea56b50a",
        svg_path:
          "M 95 323 L 95 387 L 31 451 L 31 452 L 61 452 L 62 453 L 62 543 L 152 543 L 153 544 L 155 543 L 245 543 L 245 453 L 246 452 L 277 452 L 186 361 L 185 361 L 161 385 L 160 384 L 160 323 Z",
      },
      {
        target_id: "tg-073",
        family: "deep-concavity",
        expected_match_key:
          "6f1c7aa78c108de77a8c9e7867426915ee413c97728b06034f43f8792094bab0",
        svg_path:
          "M 250 289 L 248 290 L 160 290 L 159 289 L 160 287 L 95 287 L 31 351 L 31 544 L 160 544 L 160 415 L 97 415 L 96 414 L 96 352 L 113 335 L 201 335 L 202 336 L 185 353 L 185 354 L 314 354 L 314 353 Z",
      },
      {
        target_id: "tg-074",
        family: "deep-concavity",
        expected_match_key:
          "3524617db56a882d1d5043ae15674104d290672d26160057bd8ada1915da588e",
        svg_path:
          "M 30 544 L 213 544 L 169 500 L 169 499 L 259 409 L 260 407 L 304 451 L 304 453 L 348 497 L 348 498 L 302 544 L 485 544 L 395 454 L 396 451 L 351 406 L 262 406 L 261 405 L 322 344 L 322 343 L 193 343 L 193 344 L 256 407 L 255 408 L 168 408 L 123 453 L 121 453 Z",
      },
      {
        target_id: "tg-075",
        family: "deep-concavity",
        expected_match_key:
          "379155da24f89a970db78a2dacc8af3db0f370844524a979b7ee4c17c08810aa",
        svg_path:
          "M 226 172 L 135 263 L 135 264 L 221 350 L 220 351 L 160 351 L 96 287 L 31 287 L 31 288 L 157 414 L 156 415 L 63 415 L 63 544 L 64 544 L 192 416 L 287 416 L 319 448 L 320 448 L 320 319 L 319 319 L 256 382 L 255 382 L 226 353 Z",
      },
      {
        target_id: "tg-076",
        family: "few-anchors",
        expected_match_key:
          "5bbac718708e90bf3f9f06d882c6cb17389946a18aad3c7ff98ad87250e7dbf3",
        svg_path:
          "M 31 479 L 31 480 L 95 544 L 288 544 L 352 480 L 352 479 L 288 415 L 95 415 Z",
      },
      {
        target_id: "tg-077",
        family: "mixed",
        expected_match_key:
          "4cd74e87fd8e6f3ddd1cb9b9f9753f25baead4e5f4568416e62ab0a5e1665ab1",
        svg_path:
          "M 31 453 L 31 454 L 122 545 L 122 519 L 123 518 L 252 518 L 253 519 L 253 545 L 344 454 L 344 453 L 253 362 L 253 388 L 252 389 L 123 389 L 122 388 L 122 362 Z",
      },
      {
        target_id: "tg-078",
        family: "deep-concavity",
        expected_match_key:
          "337f9409639279f5713b5df439f052af8429f5506777c21a51b6cea5e0855055",
        svg_path:
          "M 395 362 L 394 362 L 350 406 L 349 406 L 305 362 L 304 362 L 304 452 L 303 453 L 120 453 L 120 454 L 78 496 L 77 495 L 77 407 L 31 453 L 31 543 L 30 544 L 213 544 L 213 543 L 238 518 L 366 518 L 366 517 L 349 500 L 351 499 L 396 454 L 395 452 Z M 348 499 L 349 498 L 350 499 L 349 500 Z M 347 498 L 348 497 L 349 498 L 348 499 Z M 346 497 L 347 496 L 348 497 L 347 498 Z M 345 496 L 346 495 L 347 496 L 346 497 Z M 344 495 L 345 494 L 346 495 L 345 496 Z M 343 494 L 344 493 L 345 494 L 344 495 Z M 342 493 L 343 492 L 344 493 L 343 494 Z M 341 492 L 342 491 L 343 492 L 342 493 Z M 340 491 L 341 490 L 342 491 L 341 492 Z M 339 490 L 340 489 L 341 490 L 340 491 Z M 338 489 L 339 488 L 340 489 L 339 490 Z M 337 488 L 338 487 L 339 488 L 338 489 Z M 336 487 L 337 486 L 338 487 L 337 488 Z M 335 486 L 336 485 L 337 486 L 336 487 Z M 334 485 L 335 484 L 336 485 L 335 486 Z M 333 484 L 334 483 L 335 484 L 334 485 Z M 332 483 L 333 482 L 334 483 L 333 484 Z M 331 482 L 332 481 L 333 482 L 332 483 Z M 330 481 L 331 480 L 332 481 L 331 482 Z M 329 480 L 330 479 L 331 480 L 330 481 Z M 328 479 L 329 478 L 330 479 L 329 480 Z M 327 478 L 328 477 L 329 478 L 328 479 Z M 326 477 L 327 476 L 328 477 L 327 478 Z M 325 476 L 326 475 L 327 476 L 326 477 Z M 324 475 L 325 474 L 326 475 L 325 476 Z M 323 474 L 324 473 L 325 474 L 324 475 Z M 322 473 L 323 472 L 324 473 L 323 474 Z M 321 472 L 322 471 L 323 472 L 322 473 Z M 320 471 L 321 470 L 322 471 L 321 472 Z M 319 470 L 320 469 L 321 470 L 320 471 Z M 318 469 L 319 468 L 320 469 L 319 470 Z M 317 468 L 318 467 L 319 468 L 318 469 Z M 316 467 L 317 466 L 318 467 L 317 468 Z M 315 466 L 316 465 L 317 466 L 316 467 Z M 314 465 L 315 464 L 316 465 L 315 466 Z M 313 464 L 314 463 L 315 464 L 314 465 Z M 312 463 L 313 462 L 314 463 L 313 464 Z M 311 462 L 312 461 L 313 462 L 312 463 Z M 310 461 L 311 460 L 312 461 L 311 462 Z M 309 460 L 310 459 L 311 460 L 310 461 Z M 308 459 L 309 458 L 310 459 L 309 460 Z M 307 458 L 308 457 L 309 458 L 308 459 Z M 306 457 L 307 456 L 308 457 L 307 458 Z M 305 456 L 306 455 L 307 456 L 306 457 Z M 304 455 L 305 454 L 306 455 L 305 456 Z M 303 454 L 304 453 L 305 454 L 304 455 Z",
      },
      {
        target_id: "tg-079",
        family: "deep-concavity",
        expected_match_key:
          "49b60d356d87e5ea3b69907bc9af1b399ba44292178ed0d89938fe2ffff14308",
        svg_path:
          "M 96 138 L 51 183 L 51 184 L 95 228 L 94 229 L 31 229 L 31 230 L 159 358 L 159 422 L 160 423 L 160 512 L 129 543 L 129 544 L 194 544 L 194 480 L 205 469 L 298 469 L 342 513 L 343 513 L 343 422 L 341 423 L 289 423 L 288 421 L 160 293 L 160 229 L 99 229 L 98 228 L 142 184 L 142 183 L 97 138 Z",
      },
      {
        target_id: "tg-080",
        family: "deep-concavity",
        expected_match_key:
          "2ac1c176b7eeae67daf48930ff7b870f298b49137754eef7e56035fcfac64c67",
        svg_path:
          "M 95 285 L 31 349 L 31 350 L 94 413 L 94 415 L 95 416 L 95 544 L 224 544 L 224 543 L 141 460 L 141 459 L 186 414 L 223 414 L 287 478 L 288 478 L 288 413 L 224 349 L 160 349 L 96 285 Z M 205 281 L 205 346 L 270 346 L 270 281 Z",
      },
      {
        target_id: "tg-081",
        family: "diagonal",
        expected_match_key:
          "8d0d7c9e997f4839567de7199fec95a15d4bed9e46ef0bf78c4b6e51919802f7",
        svg_path:
          "M 79 135 L 34 180 L 32 179 L 32 271 L 33 272 L 33 453 L 34 454 L 34 543 L 125 543 L 124 541 L 124 360 L 123 359 L 123 271 L 124 269 L 81 226 L 81 225 L 125 181 L 125 180 L 80 135 Z",
      },
      {
        target_id: "tg-082",
        family: "diagonal",
        expected_match_key:
          "5fda4fa979bbdd10e4af1bffdc9a1a0bf47de81d167149cc294b4546219892fe",
        svg_path:
          "M 32 471 L 33 471 L 76 428 L 77 429 L 77 518 L 205 518 L 232 545 L 233 545 L 369 409 L 369 408 L 279 408 L 233 362 L 232 362 L 124 470 L 123 469 L 123 380 L 78 335 L 77 335 L 32 380 Z",
      },
      {
        target_id: "tg-083",
        family: "deep-concavity",
        expected_match_key:
          "d81fed19406d67fa175b5aa7308d3af049b8b2301961e825b312e9111f8285e5",
        svg_path:
          "M 31 397 L 31 398 L 160 398 L 160 397 L 143 380 L 143 379 L 187 335 L 188 335 L 267 414 L 266 415 L 205 415 L 205 544 L 334 544 L 334 415 L 206 287 L 141 287 L 141 289 L 97 333 L 95 333 Z",
      },
      {
        target_id: "tg-084",
        family: "deep-concavity",
        expected_match_key:
          "2b50bf1920e0bb9b5d2261fd8fb52d87d99763b58ce1a959f2bc95f2cc82706f",
        svg_path:
          "M 129 210 L 128 210 L 37 301 L 38 303 L 38 393 L 39 393 L 83 349 L 84 349 L 123 388 L 123 389 L 79 433 L 79 434 L 123 478 L 122 479 L 95 479 L 31 543 L 31 544 L 224 544 L 224 543 L 160 479 L 127 479 L 126 478 L 170 434 L 170 433 L 130 393 L 130 392 L 173 349 L 174 349 L 218 393 L 219 393 L 219 303 L 220 301 Z",
      },
      {
        target_id: "tg-085",
        family: "deep-concavity",
        expected_match_key:
          "7c830265f582cbd31808a62c6d1eec338ebf6dc23956eae4db4377ffbf6cb313",
        svg_path:
          "M 76 101 L 76 193 L 119 236 L 118 237 L 89 237 L 89 300 L 88 301 L 57 301 L 57 302 L 76 321 L 76 409 L 74 410 L 74 500 L 30 544 L 213 544 L 168 499 L 168 320 L 186 302 L 186 301 L 155 301 L 154 300 L 154 237 L 123 237 L 122 236 L 122 147 Z M 118 453 L 119 452 L 120 453 L 119 454 Z M 117 452 L 118 451 L 119 452 L 118 453 Z M 116 451 L 117 450 L 118 451 L 117 452 Z M 115 450 L 116 449 L 117 450 L 116 451 Z M 114 449 L 115 448 L 116 449 L 115 450 Z M 113 448 L 114 447 L 115 448 L 114 449 Z M 112 447 L 113 446 L 114 447 L 113 448 Z M 111 446 L 112 445 L 113 446 L 112 447 Z M 110 445 L 111 444 L 112 445 L 111 446 Z M 109 444 L 110 443 L 111 444 L 110 445 Z M 108 443 L 109 442 L 110 443 L 109 444 Z M 107 442 L 108 441 L 109 442 L 108 443 Z M 106 441 L 107 440 L 108 441 L 107 442 Z M 105 440 L 106 439 L 107 440 L 106 441 Z M 104 439 L 105 438 L 106 439 L 105 440 Z M 103 438 L 104 437 L 105 438 L 104 439 Z M 102 437 L 103 436 L 104 437 L 103 438 Z M 101 436 L 102 435 L 103 436 L 102 437 Z M 100 435 L 101 434 L 102 435 L 101 436 Z M 99 434 L 100 433 L 101 434 L 100 435 Z M 98 433 L 99 432 L 100 433 L 99 434 Z M 97 432 L 98 431 L 99 432 L 98 433 Z M 96 431 L 97 430 L 98 431 L 97 432 Z M 95 430 L 96 429 L 97 430 L 96 431 Z M 94 429 L 95 428 L 96 429 L 95 430 Z M 93 428 L 94 427 L 95 428 L 94 429 Z M 92 427 L 93 426 L 94 427 L 93 428 Z M 91 426 L 92 425 L 93 426 L 92 427 Z M 90 425 L 91 424 L 92 425 L 91 426 Z M 89 424 L 90 423 L 91 424 L 90 425 Z M 88 423 L 89 422 L 90 423 L 89 424 Z M 87 422 L 88 421 L 89 422 L 88 423 Z M 86 421 L 87 420 L 88 421 L 87 422 Z M 85 420 L 86 419 L 87 420 L 86 421 Z M 84 419 L 85 418 L 86 419 L 85 420 Z M 83 418 L 84 417 L 85 418 L 84 419 Z M 82 417 L 83 416 L 84 417 L 83 418 Z M 81 416 L 82 415 L 83 416 L 82 417 Z M 80 415 L 81 414 L 82 415 L 81 416 Z M 79 414 L 80 413 L 81 414 L 80 415 Z M 78 413 L 79 412 L 80 413 L 79 414 Z M 77 412 L 78 411 L 79 412 L 78 413 Z",
      },
      {
        target_id: "tg-086",
        family: "deep-concavity",
        expected_match_key:
          "24e3cb20f56de331f2b56134a8ce4938649c39f6ccc90cb5915f66f8e5241658",
        svg_path:
          "M 31 253 L 31 382 L 32 382 L 96 318 L 158 318 L 159 319 L 115 363 L 115 364 L 159 408 L 159 409 L 116 452 L 114 452 L 114 543 L 115 543 L 159 499 L 162 499 L 207 544 L 207 452 L 163 408 L 163 407 L 206 364 L 206 363 L 162 319 L 163 318 L 223 318 L 287 382 L 288 382 L 288 253 Z",
      },
      {
        target_id: "tg-087",
        family: "deep-concavity",
        expected_match_key:
          "c4a35fb3213b3cb302ffdcfe8b771a4b7fd7043f99d7d37c9fa5418660f5206b",
        svg_path:
          "M 416 351 L 352 287 L 351 287 L 223 415 L 160 415 L 96 351 L 31 351 L 31 352 L 95 416 L 95 544 L 96 544 L 160 480 L 287 480 L 332 525 L 333 525 L 333 435 L 352 416 L 352 353 L 353 352 L 416 352 Z",
      },
      {
        target_id: "tg-088",
        family: "diagonal",
        expected_match_key:
          "fe23ba15e7ad21282d69725a891e74b1e5a446073b7b6044e09a9bd2cf0bc64c",
        svg_path:
          "M 33 360 L 33 541 L 32 543 L 216 544 L 216 543 L 214 541 L 214 360 L 187 387 L 157 387 L 156 386 L 156 323 L 91 323 L 91 386 L 90 387 L 60 387 Z",
      },
      {
        target_id: "tg-089",
        family: "deep-concavity",
        expected_match_key:
          "29583961f6adfe54370011769338eefe7c988fa9d5d70cd01e09701644c58b85",
        svg_path:
          "M 294 373 L 230 309 L 229 309 L 229 316 L 228 317 L 165 317 L 164 319 L 76 319 L 75 318 L 75 499 L 30 544 L 213 544 L 213 543 L 257 499 L 259 499 L 259 409 L 294 374 Z M 212 365 L 229 382 L 229 437 L 213 453 L 211 453 L 167 497 L 166 497 L 123 454 L 123 453 L 166 410 L 166 409 L 123 366 L 124 365 Z",
      },
      {
        target_id: "tg-090",
        family: "few-anchors",
        expected_match_key:
          "82717e00b9aa21c1fb4bf657b7edc21b91c0b7c439da3f0c64dff9ecd77696e3",
        svg_path:
          "M 31 389 L 31 454 L 94 517 L 94 518 L 68 544 L 251 544 L 225 518 L 225 517 L 288 454 L 288 389 Z",
      },
      {
        target_id: "tg-091",
        family: "few-anchors",
        expected_match_key:
          "3fd54b15e82ffbaf09384d1d4c4008711252a1437fbc6dc26e79068e9e98ed0c",
        svg_path:
          "M 31 351 L 31 544 L 224 544 L 224 351 Z M 160 476 L 160 417 L 161 416 L 220 416 L 221 417 L 161 477 Z M 158 354 L 159 355 L 159 414 L 158 415 L 99 415 L 98 414 Z",
      },
      {
        target_id: "tg-092",
        family: "deep-concavity",
        expected_match_key:
          "f1a52c68ca252f9a24af25141bd0e12aa94bf41857ba9ed62e2031fa9949c539",
        svg_path:
          "M 267 206 L 266 206 L 221 251 L 221 252 L 265 296 L 264 297 L 174 297 L 218 341 L 218 342 L 95 465 L 31 465 L 31 530 L 32 530 L 64 498 L 128 498 L 192 434 L 193 432 L 217 432 L 265 480 L 265 544 L 330 544 L 330 543 L 309 522 L 309 433 L 311 432 L 267 388 L 267 387 L 357 297 L 269 297 L 268 296 L 312 252 L 312 251 Z",
      },
      {
        target_id: "tg-093",
        family: "deep-concavity",
        expected_match_key:
          "51ddc506e8907ad8b18878d9007427ced50b45aa702e7ec0471bd142fc6592da",
        svg_path:
          "M 118 150 L 118 241 L 119 241 L 139 221 L 140 221 L 157 238 L 157 417 L 31 543 L 31 544 L 96 544 L 160 480 L 222 480 L 223 481 L 223 544 L 224 544 L 288 480 L 288 479 L 224 415 L 224 352 L 248 328 L 248 327 L 187 266 L 187 265 L 231 221 L 231 220 L 186 175 L 186 174 L 209 151 L 209 150 Z",
      },
      {
        target_id: "tg-094",
        family: "elongated",
        expected_match_key:
          "c3f3f34db001911c20aeab9ed5dff01a190ca7b9c367763fc7212a3df6edd664",
        svg_path:
          "M 414 539 L 286 411 L 285 411 L 267 429 L 266 429 L 222 385 L 221 385 L 177 429 L 176 429 L 160 413 L 159 413 L 159 415 L 31 543 L 31 544 L 160 544 L 161 542 L 288 542 L 289 540 L 414 540 Z",
      },
      {
        target_id: "tg-095",
        family: "deep-concavity",
        expected_match_key:
          "5973b1620d744c4959205c2fd3563370761c10b8760e83def2fcac649e644543",
        svg_path:
          "M 91 207 L 91 271 L 90 272 L 76 272 L 31 317 L 31 318 L 75 318 L 76 319 L 76 409 L 78 410 L 78 498 L 32 544 L 215 544 L 168 497 L 168 318 L 169 317 L 215 317 L 215 316 L 170 271 L 168 272 L 157 272 L 156 271 L 156 207 Z",
      },
      {
        target_id: "tg-096",
        family: "deep-concavity",
        expected_match_key:
          "a2a85fd8306843ed507d01d39d7268036f8831e55eb413c29c511b19dc94fe52",
        svg_path:
          "M 441 286 L 440 286 L 396 330 L 395 330 L 354 289 L 353 289 L 353 352 L 352 353 L 225 353 L 161 417 L 160 415 L 95 415 L 31 479 L 31 544 L 96 544 L 96 480 L 160 416 L 161 417 L 161 482 L 162 482 L 226 418 L 289 418 L 353 482 L 354 482 L 354 419 L 355 418 L 482 418 L 482 417 L 441 376 Z",
      },
      {
        target_id: "tg-097",
        family: "deep-concavity",
        expected_match_key:
          "314746da763f0bd48b8e4d7a406498fd3d40a0df19fc323bf57fbca7282f7118",
        svg_path:
          "M 92 450 L 47 495 L 47 496 L 92 541 L 93 541 L 93 450 Z M 182 81 L 181 81 L 136 126 L 136 127 L 158 149 L 158 150 L 31 277 L 31 278 L 95 342 L 95 470 L 96 470 L 113 453 L 114 454 L 114 543 L 205 543 L 205 542 L 160 497 L 160 153 L 161 152 L 181 172 L 182 172 L 227 127 L 227 126 Z",
      },
      {
        target_id: "tg-098",
        family: "deep-concavity",
        expected_match_key:
          "0e91a9548aca2512c8de9d2bbe65acf28fb35bba97e831aa5af5ab5bdbd7ca28",
        svg_path:
          "M 412 299 L 348 235 L 283 235 L 219 299 L 218 298 L 218 296 L 159 355 L 31 355 L 31 356 L 94 419 L 94 420 L 36 478 L 126 478 L 127 479 L 127 544 L 192 544 L 192 543 L 128 479 L 129 478 L 217 478 L 218 479 L 219 478 L 218 477 L 218 365 L 220 364 L 284 300 L 412 300 Z",
      },
      {
        target_id: "tg-099",
        family: "deep-concavity",
        expected_match_key:
          "5c56d7895cb5f3c236d9ea219352ab9d2e8636d8e93e37cbda9e92bcf23f56f9",
        svg_path:
          "M 284 239 L 283 239 L 219 303 L 219 304 L 301 386 L 301 387 L 257 431 L 256 431 L 213 388 L 213 387 L 30 387 L 120 477 L 120 478 L 210 478 L 211 479 L 211 544 L 276 544 L 276 543 L 212 479 L 213 478 L 303 478 L 303 477 L 348 432 L 348 367 L 286 305 L 287 304 L 348 304 L 348 303 Z",
      },
      {
        target_id: "tg-100",
        family: "deep-concavity",
        expected_match_key:
          "6dc467e6322ed5c0f03c90f95aeb6c34442bc93958ab08a3fc99e4dd118f3ef5",
        svg_path:
          "M 268 289 L 267 289 L 203 353 L 139 353 L 123 369 L 122 369 L 78 325 L 77 325 L 32 370 L 32 461 L 33 461 L 76 418 L 89 418 L 180 509 L 180 510 L 147 543 L 147 544 L 276 544 L 276 543 L 213 480 L 213 479 L 227 465 L 317 465 L 317 464 L 273 420 L 273 419 L 269 419 L 268 418 Z",
      },
    ];
  });
var jt,
  Ut = u(() => {
    "use strict";
    jt = {
      keys: [
        {
          kty: "EC",
          x: "53HZMYemLsYLHdNRRtYVRAHtDhCbcv8jJdupXH810Zk",
          y: "BqkOYJibv8XR-HxlDBeZ11jeEivqTwYa6Bv6eHc3Q3E",
          crv: "P-256",
          use: "sig",
          kid: "tds-2025",
        },
        {
          kty: "EC",
          x: "sNfFwjvtHDv0PV_AFk9JLvmhZCwlowxc9wa6BnIR7aA",
          y: "GsZtkxr-kSkmBhNGQ1jArPw5AGNMWSLCRgYg-ubpaPw",
          crv: "P-256",
          use: "sig",
          kid: "tds-dev-local",
        },
      ],
    };
  });
function Bt(e) {
  return String(e ?? "")
    .trim()
    .toLowerCase();
}
function y1(e) {
  return (e + "=".repeat((4 - (e.length % 4 || 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
}
function Yt(e) {
  let o = y1(e);
  if (typeof atob == "function") {
    let a = atob(o);
    return Uint8Array.from(a, (L) => L.charCodeAt(0));
  }
  if (typeof Buffer < "u") return Uint8Array.from(Buffer.from(o, "base64"));
  throw new Error("No base64 decoder available in this runtime");
}
function Ft(e, o) {
  try {
    return JSON.parse(b1.decode(Yt(e)));
  } catch {
    throw new Error(`Invalid JWT ${o}`);
  }
}
function u1(e) {
  let o = String(e ?? "").trim();
  if (!o) throw new Error("Submit the visual receipt token from the game");
  let a = o.split(".");
  if (a.length !== 3)
    throw new Error("JWT must have header.payload.signature format");
  let [L, l, s] = a;
  return {
    token: o,
    header: Ft(L, "header"),
    payload: Ft(l, "payload"),
    signingInput: new TextEncoder().encode(`${L}.${l}`),
    signature: Yt(s),
  };
}
function _1(e, o) {
  let L = (Array.isArray(e?.keys) ? e.keys : []).filter(
    (s) => s?.kty === "EC" && s?.crv === "P-256",
  );
  if (!L.length)
    throw new Error("JWKS did not contain any ES256 verification keys");
  if (!o) return L;
  let l = L.filter((s) => s.kid === o);
  if (!l.length) throw new Error(`No JWKS key matched kid ${o}`);
  return l;
}
async function v1(e) {
  let o = `${e.kid ?? ""}:${e.x}:${e.y}`;
  return (
    me.has(o) ||
      me.set(
        o,
        crypto.subtle.importKey(
          "jwk",
          e,
          { name: "ECDSA", namedCurve: "P-256" },
          !1,
          ["verify"],
        ),
      ),
    me.get(o)
  );
}
async function x1({ signingInput: e, signature: o, jwks: a, kid: L }) {
  for (let l of _1(a, L)) {
    let s = await v1(l);
    if (await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, s, o, e))
      return !0;
  }
  return !1;
}
async function w1() {
  return (he || (he = Promise.resolve(jt)), he);
}
function k1({ payload: e, email: o, expected: a, timePolicy: L = null }) {
  if (e?.iss !== Jt)
    throw new Error(`Expected iss=${Jt}, got ${e?.iss ?? "missing"}`);
  if (e?.aud !== Ht)
    throw new Error(`Expected aud=${Ht}, got ${e?.aud ?? "missing"}`);
  if (e?.purpose !== Wt)
    throw new Error(`Expected purpose=${Wt}, got ${e?.purpose ?? "missing"}`);
  if (e?.receipt_version !== Vt)
    throw new Error(
      `Expected receipt_version=${Vt}, got ${e?.receipt_version ?? "missing"}`,
    );
  if (Bt(e?.sub) !== Bt(o))
    throw new Error(
      `JWT sub (${e?.sub ?? "missing"}) must match your email: ${o}`,
    );
  if (e?.game !== a.game)
    throw new Error(`JWT game must be ${a.game}, got ${e?.game ?? "missing"}`);
  if (a.game_version !== void 0 && e?.game_version !== a.game_version)
    throw new Error(
      `JWT game_version must be ${a.game_version}, got ${e?.game_version ?? "missing"}`,
    );
  if (a.config_id !== void 0 && e?.config_id !== a.config_id)
    throw new Error(
      `JWT config_id must be ${a.config_id}, got ${e?.config_id ?? "missing"}`,
    );
  if (a.state_version !== void 0 && e?.state_version !== a.state_version)
    throw new Error(
      `JWT state_version must be ${a.state_version}, got ${e?.state_version ?? "missing"}`,
    );
  if (
    a.equivalence_version !== void 0 &&
    e?.equivalence_version !== a.equivalence_version
  )
    throw new Error(
      `JWT equivalence_version must be ${a.equivalence_version}, got ${e?.equivalence_version ?? "missing"}`,
    );
  if (e?.invalid !== !1)
    throw new Error(
      "Your Tangram arrangement is invalid (e.g. shapes overlap or extend outside the board). Fix the layout and generate a new signed payload.",
    );
  if (Array.isArray(e?.errors) && e.errors.length > 0)
    throw new Error(`Arrangement has errors: ${JSON.stringify(e.errors)}`);
  if (typeof e?.match_key != "string" || !/^[0-9a-f]{64}$/.test(e.match_key))
    throw new Error(
      "Receipt does not contain a valid 64-character SHA-256 match key",
    );
  if (a.expected_match_key && e.match_key !== a.expected_match_key)
    throw new Error(
      "The submitted arrangement does not match your assigned target silhouette. Reconstruct the target shown above.",
    );
  if (L) {
    let l = Date.parse(e?.received_at ?? "");
    if (Number.isNaN(l))
      throw new Error("Invalid received_at timestamp in receipt");
    if (L.not_before && l < Date.parse(L.not_before))
      throw new Error("Receipt predates the assignment window");
    if (L.not_after && l > Date.parse(L.not_after))
      throw new Error("Receipt was generated after the assignment deadline");
  }
}
async function Gt({
  token: e,
  email: o,
  expected: a,
  timePolicy: L = null,
  jwks: l = null,
}) {
  let { header: s, payload: c, signingInput: t, signature: r } = u1(e);
  if (s?.alg !== "ES256")
    throw new Error(`Expected ES256 JWT, got ${s?.alg ?? "unknown"}`);
  if (s?.typ && s.typ !== "JWT")
    throw new Error(`Expected typ=JWT, got ${s.typ}`);
  let n = l ?? (await w1());
  if (!(await x1({ signingInput: t, signature: r, jwks: n, kid: s?.kid })))
    throw new Error(
      "JWT signature verification failed. Make sure you generated the payload from the official TDS game server.",
    );
  return (k1({ payload: c, email: o, expected: a, timePolicy: L }), c);
}
var b1,
  Jt,
  Ht,
  Wt,
  Vt,
  he,
  me,
  Kt = u(() => {
    "use strict";
    Ut();
    ((b1 = new TextDecoder()),
      (Jt = "tds-network-games.sanand.workers.dev"),
      (Ht = "tds-visual-grader"),
      (Wt = "visual-state-receipt"),
      (Vt = 1),
      (me = new Map()));
  });
async function Xt({
  email: e,
  target: o = null,
  timePolicy: a = null,
  jwks: L = null,
}) {
  if (!o) {
    let l = (0, Qt.default)(`${e}#q-visual-game-tangram`),
      s = Math.floor(l() * pe.length);
    o = pe[s];
  }
  return async (l) => (
    await Gt({
      token: l,
      email: e,
      expected: {
        game: "tangram",
        game_version: 1,
        config_id: "standard-seven-v1",
        state_version: 1,
        equivalence_version: 2,
        expected_match_key: o.expected_match_key,
      },
      timePolicy: a,
      jwks: L,
    }),
    !0
  );
}
var Qt,
  e4 = u(() => {
    "use strict";
    Qt = R(I(), 1);
    zt();
    Kt();
  });
var ge,
  t4 = u(() => {
    ge = [
      {
        target_id: "tg-001",
        family: "deep-concavity",
        expected_match_key:
          "961265cc5fddf7dc86990c4fbd34ea066ce6d86c8db83a8baa0d1446e41cdb73",
        svg_path:
          "M 77 241 L 32 286 L 32 287 L 58 287 L 59 288 L 59 352 L 140 433 L 140 434 L 96 478 L 96 479 L 186 479 L 187 480 L 187 544 L 188 544 L 252 480 L 252 416 L 316 352 L 316 351 L 312 351 L 311 350 L 311 260 L 310 260 L 219 351 L 125 351 L 124 350 L 124 287 L 78 241 Z",
      },
      {
        target_id: "tg-002",
        family: "mixed",
        expected_match_key:
          "e47bb383681ba2422703bbfc000cc7af906a664b4b099d751713e1ab3ce7ace1",
        svg_path:
          "M 33 287 L 33 414 L 31 415 L 31 544 L 160 544 L 224 480 L 224 479 L 162 417 L 162 416 L 226 352 L 226 351 L 162 287 Z M 98 481 L 99 480 L 158 480 L 159 481 L 159 540 L 158 541 Z M 96 354 L 97 355 L 97 414 L 95 415 L 95 476 L 94 477 L 34 417 L 34 416 Z M 160 290 L 161 291 L 161 350 L 160 351 L 101 351 L 100 350 Z",
      },
      {
        target_id: "tg-003",
        family: "deep-concavity",
        expected_match_key:
          "80df0dff5fd7a7b273467b795ff877f17b4b8edb89e476867b2dcebf0233eddd",
        svg_path:
          "M 31 351 L 31 352 L 95 416 L 95 544 L 96 544 L 192 448 L 223 448 L 314 539 L 315 539 L 315 449 L 316 448 L 320 448 L 320 383 L 318 383 L 277 342 L 277 341 L 321 297 L 321 296 L 231 296 L 190 255 L 189 255 L 189 384 L 252 384 L 253 385 L 223 415 L 160 415 L 96 351 Z",
      },
      {
        target_id: "tg-004",
        family: "diagonal",
        expected_match_key:
          "2d2d0da4a268cc2efc42a581919d229b540b984c023056e01481a56b3403b5f7",
        svg_path:
          "M 32 71 L 32 163 L 75 206 L 74 207 L 45 207 L 45 271 L 44 272 L 32 272 L 32 363 L 33 364 L 33 545 L 35 543 L 125 543 L 125 452 L 124 451 L 124 270 L 122 272 L 111 272 L 110 271 L 110 207 L 79 207 L 78 206 L 78 117 Z",
      },
      {
        target_id: "tg-005",
        family: "deep-concavity",
        expected_match_key:
          "f070c74304df916b9391f32c1ceab6e2925acad345d88bdbb026c1d770c1e0d2",
        svg_path:
          "M 350 331 L 259 331 L 213 377 L 212 376 L 212 286 L 122 376 L 32 376 L 32 467 L 33 467 L 76 424 L 77 424 L 122 469 L 212 469 L 213 470 L 213 505 L 175 543 L 175 544 L 240 544 L 240 480 L 342 378 L 342 377 L 307 377 L 306 376 L 350 332 Z",
      },
      {
        target_id: "tg-006",
        family: "deep-concavity",
        expected_match_key:
          "5508e19a47d1b123bd0216fde65218ffc7f1aa8ca160783cdc30e909c26560bd",
        svg_path:
          "M 387 405 L 387 314 L 296 314 L 251 359 L 161 359 L 160 358 L 160 343 L 31 343 L 31 344 L 159 472 L 161 473 L 161 543 L 205 499 L 206 499 L 250 543 L 251 543 L 251 453 L 297 407 L 297 405 L 341 361 L 342 361 L 386 405 Z",
      },
      {
        target_id: "tg-007",
        family: "deep-concavity",
        expected_match_key:
          "6bc0317c234f942c65829c02fbd00b5b781b1f0ce4d4aec849ea1ffce2519df9",
        svg_path:
          "M 213 459 L 213 460 L 277 524 L 278 524 L 278 459 Z M 97 167 L 33 231 L 33 232 L 94 232 L 95 233 L 33 295 L 33 360 L 32 361 L 30 361 L 120 451 L 120 452 L 208 452 L 209 453 L 165 497 L 165 498 L 210 543 L 211 543 L 211 453 L 212 452 L 303 452 L 213 362 L 213 361 L 99 361 L 98 360 L 98 296 L 162 232 L 162 231 L 98 167 Z",
      },
      {
        target_id: "tg-008",
        family: "deep-concavity",
        expected_match_key:
          "30927089e8c55956c6679982e7d20ba5487ff8edb2aca61d7336357097fea2ec",
        svg_path:
          "M 416 477 L 352 413 L 288 413 L 224 349 L 223 349 L 159 413 L 95 413 L 95 415 L 31 479 L 31 544 L 32 544 L 94 482 L 95 483 L 95 542 L 96 542 L 177 461 L 178 461 L 223 506 L 224 506 L 269 461 L 270 461 L 351 542 L 352 542 L 352 481 L 353 480 L 415 542 L 416 542 Z",
      },
      {
        target_id: "tg-009",
        family: "deep-concavity",
        expected_match_key:
          "87417c6669ed7acc9ba5732a3bf8c6c7caff12147e5b34f7400262df541b31c1",
        svg_path:
          "M 161 296 L 161 298 L 160 299 L 95 299 L 95 301 L 31 365 L 31 430 L 32 430 L 34 428 L 98 428 L 98 365 L 99 364 L 160 364 L 161 365 L 161 412 L 159 413 L 31 541 L 31 542 L 223 542 L 225 544 L 226 544 L 290 480 L 290 479 L 163 479 L 162 478 L 252 388 L 252 387 Z",
      },
      {
        target_id: "tg-010",
        family: "deep-concavity",
        expected_match_key:
          "5da94999a82c4621b9cd21c4a611a4b02e9ccaa4ec84d6c1db83341ca885a0fb",
        svg_path:
          "M 410 251 L 281 251 L 281 252 L 344 315 L 343 316 L 259 316 L 216 273 L 217 272 L 246 272 L 246 207 L 181 207 L 181 272 L 210 272 L 211 273 L 121 363 L 30 363 L 121 454 L 123 455 L 123 544 L 125 543 L 215 543 L 215 542 L 169 496 L 169 407 L 214 362 L 305 362 L 305 361 L 349 317 L 349 316 L 347 315 L 410 252 Z",
      },
      {
        target_id: "tg-011",
        family: "deep-concavity",
        expected_match_key:
          "a7bc82e43311a939cbc5bc703a2ae3b73d914d1cfc64183ec36b539a64b8958a",
        svg_path:
          "M 138 162 L 138 253 L 139 253 L 152 240 L 180 240 L 181 241 L 92 330 L 94 330 L 95 331 L 95 390 L 94 391 L 32 329 L 31 329 L 31 394 L 95 458 L 95 460 L 99 458 L 119 478 L 119 544 L 184 544 L 184 543 L 144 503 L 144 502 L 189 457 L 189 456 L 145 412 L 145 411 L 224 332 L 225 330 L 275 330 L 186 241 L 187 240 L 216 240 L 216 176 L 229 163 L 229 162 Z",
      },
      {
        target_id: "tg-012",
        family: "few-anchors",
        expected_match_key:
          "9da7346ee9f5e93d5dfd25b6d78e3dbdb475f37df856df00648c6951adaa627a",
        svg_path:
          "M 31 543 L 31 544 L 160 544 L 224 480 L 287 480 L 351 544 L 480 544 L 480 543 L 352 415 L 159 415 Z",
      },
      {
        target_id: "tg-013",
        family: "few-anchors",
        expected_match_key:
          "a78171dac1dfb9a4e0f1938fce11c4f4ca951dbb1077e7405d75f25330cfabe9",
        svg_path: "M 31 543 L 31 544 L 352 544 L 352 415 L 159 415 Z",
      },
      {
        target_id: "tg-014",
        family: "deep-concavity",
        expected_match_key:
          "9ed1a6ff28e2e5de7987128d73072fc302f74a2075433ecbf1a097bc6f1b6b00",
        svg_path:
          "M 206 195 L 205 195 L 160 240 L 160 294 L 159 295 L 31 295 L 31 296 L 67 332 L 67 511 L 35 543 L 35 544 L 164 544 L 164 543 L 101 480 L 101 479 L 157 423 L 160 424 L 205 379 L 205 287 L 207 285 L 297 285 L 297 284 L 252 239 L 250 239 Z",
      },
      {
        target_id: "tg-015",
        family: "deep-concavity",
        expected_match_key:
          "9fad9ac619e044c82b65033112db734e1de90489204b85e7d5e151e96f122048",
        svg_path:
          "M 320 319 L 195 319 L 194 318 L 237 275 L 237 274 L 192 229 L 191 229 L 146 274 L 146 275 L 190 319 L 190 320 L 63 447 L 63 448 L 124 448 L 125 449 L 95 479 L 31 479 L 31 544 L 32 544 L 64 512 L 128 512 L 192 448 L 273 448 L 319 494 L 320 494 L 365 449 L 365 448 L 321 448 L 257 384 L 257 383 L 320 320 Z",
      },
      {
        target_id: "tg-016",
        family: "deep-concavity",
        expected_match_key:
          "094f18e9ff972a190f41369efd0a14853d024dd3fd654f8c2b09241f830a33a8",
        svg_path:
          "M 251 214 L 250 214 L 205 259 L 205 260 L 249 304 L 248 305 L 185 305 L 57 433 L 57 434 L 118 434 L 119 435 L 56 498 L 32 498 L 32 499 L 77 544 L 78 544 L 123 499 L 123 497 L 185 435 L 186 435 L 217 466 L 217 530 L 282 530 L 282 529 L 250 497 L 250 370 L 314 306 L 314 305 L 253 305 L 252 304 L 296 260 L 296 259 Z",
      },
      {
        target_id: "tg-017",
        family: "diagonal",
        expected_match_key:
          "b6dfa0a8fd420e2b5a493cdc2ae6026416bb2f6d5c12f72794a8d114f90646a8",
        svg_path:
          "M 32 406 L 32 407 L 78 453 L 78 543 L 167 543 L 168 544 L 351 544 L 261 454 L 261 452 L 238 429 L 238 365 L 174 365 L 171 362 L 79 362 L 77 361 Z M 79 452 L 79 451 L 123 407 L 125 408 L 212 408 L 213 409 L 169 453 L 80 453 Z",
      },
      {
        target_id: "tg-018",
        family: "deep-concavity",
        expected_match_key:
          "7b6ae4721c625c42eb65cd0cdd4dd7ab0358ef62f16100b566f94321df5bf792",
        svg_path:
          "M 37 113 L 37 242 L 38 242 L 58 222 L 59 223 L 59 351 L 58 352 L 32 352 L 32 443 L 33 443 L 58 418 L 59 419 L 59 480 L 88 480 L 89 481 L 89 544 L 154 544 L 154 543 L 92 481 L 93 480 L 124 480 L 124 416 L 188 352 L 188 351 L 60 223 L 58 222 L 70 210 L 134 210 L 134 146 L 166 114 L 166 113 Z",
      },
      {
        target_id: "tg-019",
        family: "deep-concavity",
        expected_match_key:
          "26818bd3a5857e766241309ba7efe7fbedbe8fa3d0463419d1b06d6ecbd49b4a",
        svg_path:
          "M 379 350 L 334 305 L 333 305 L 223 415 L 160 415 L 96 351 L 31 351 L 31 352 L 95 416 L 95 544 L 96 544 L 160 480 L 287 480 L 351 544 L 352 544 L 352 352 L 353 351 L 379 351 Z",
      },
      {
        target_id: "tg-020",
        family: "deep-concavity",
        expected_match_key:
          "76da9833dc0ce984b3e385696b5a0c170873185512dda2ee8d34ad315d78811b",
        svg_path:
          "M 32 118 L 32 119 L 77 164 L 77 448 L 140 511 L 140 512 L 109 543 L 109 544 L 174 544 L 174 480 L 270 384 L 270 383 L 206 383 L 123 300 L 123 118 Z",
      },
      {
        target_id: "tg-021",
        family: "mixed",
        expected_match_key:
          "18510f0d65bd8b09cb1743fc888c5079525a0114b61232ec4e26b643e2428460",
        svg_path:
          "M 159 287 L 31 415 L 31 480 L 32 480 L 94 418 L 95 419 L 95 544 L 96 544 L 159 481 L 160 481 L 223 544 L 224 544 L 224 419 L 225 418 L 287 480 L 288 480 L 288 415 L 160 287 Z",
      },
      {
        target_id: "tg-022",
        family: "mixed",
        expected_match_key:
          "bbe179d8653798a29420897008a77b17414866a458249329c3d688f2b88aa38f",
        svg_path:
          "M 97 287 L 33 351 L 33 352 L 92 352 L 93 353 L 31 415 L 31 416 L 33 417 L 33 480 L 97 544 L 226 544 L 226 543 L 189 506 L 189 505 L 279 415 L 99 415 L 98 414 L 160 352 L 162 352 L 162 287 Z",
      },
      {
        target_id: "tg-023",
        family: "deep-concavity",
        expected_match_key:
          "6514a9005f6f4768fdcfb598367719bb8927139a82d13fe8efbb72ffb7479857",
        svg_path:
          "M 159 287 L 95 351 L 95 414 L 94 415 L 32 353 L 31 353 L 31 482 L 32 482 L 94 420 L 95 421 L 95 480 L 159 544 L 160 544 L 288 416 L 287 413 L 332 368 L 332 367 L 287 322 L 286 322 L 241 367 L 240 367 L 160 287 Z M 158 354 L 159 355 L 159 476 L 158 477 L 97 416 L 97 415 Z",
      },
      {
        target_id: "tg-024",
        family: "mixed",
        expected_match_key:
          "99764a092ebb10af9ce65b4ada5e942620ff3057975602f85f333225515a88a5",
        svg_path:
          "M 124 262 L 34 352 L 31 351 L 31 480 L 33 480 L 97 544 L 162 544 L 226 480 L 226 415 L 225 415 L 161 479 L 160 479 L 124 443 L 124 331 L 125 330 L 189 330 L 190 331 L 190 357 L 191 357 L 236 312 L 236 311 L 190 265 L 125 265 L 124 264 Z",
      },
      {
        target_id: "tg-025",
        family: "deep-concavity",
        expected_match_key:
          "beb2be1240a2b4d619a0b15b343a6aedaa2531760155353bd49bbc044eab8a16",
        svg_path:
          "M 210 193 L 209 193 L 164 238 L 164 239 L 185 260 L 184 261 L 59 261 L 59 262 L 97 300 L 97 414 L 95 415 L 31 479 L 31 480 L 95 544 L 96 544 L 96 482 L 142 436 L 298 436 L 298 371 L 297 371 L 278 390 L 189 390 L 188 389 L 188 358 L 252 294 L 252 293 L 189 293 L 188 292 L 188 265 L 189 264 L 209 284 L 210 284 L 255 239 L 255 238 Z",
      },
      {
        target_id: "tg-026",
        family: "few-anchors",
        expected_match_key:
          "85492615bbfc376b094e59517f1b2dacef5e4f738899fd625051afa62c424154",
        svg_path:
          "M 121 259 L 30 350 L 56 350 L 57 351 L 57 544 L 186 544 L 186 351 L 187 350 L 213 350 L 122 259 Z",
      },
      {
        target_id: "tg-027",
        family: "mixed",
        expected_match_key:
          "db5f957727bee7a9c70359fde8f4efcc08422536102056bd8c58ad3e59828e6e",
        svg_path:
          "M 31 287 L 31 352 L 95 352 L 287 544 L 288 544 L 352 480 L 352 351 L 223 351 L 223 412 L 222 413 L 96 287 Z",
      },
      {
        target_id: "tg-028",
        family: "few-anchors",
        expected_match_key:
          "ceed0e07f423f75960748361856221102c151782bc0f7234cb48c813474cf33a",
        svg_path:
          "M 31 479 L 31 480 L 95 544 L 416 544 L 480 480 L 480 479 L 289 479 L 288 478 L 288 415 L 159 415 L 159 478 L 158 479 Z",
      },
      {
        target_id: "tg-029",
        family: "deep-concavity",
        expected_match_key:
          "33f0411993c2f8de3679648005a9bed607f988ffb246a0ea42d3268576001c76",
        svg_path:
          "M 33 239 L 33 368 L 32 369 L 123 460 L 124 460 L 149 435 L 150 435 L 166 451 L 166 452 L 121 497 L 31 497 L 31 498 L 76 543 L 168 543 L 168 542 L 212 498 L 214 498 L 214 370 L 215 369 L 99 369 L 98 368 L 98 304 L 117 285 L 207 285 L 207 284 L 162 239 Z",
      },
      {
        target_id: "tg-030",
        family: "deep-concavity",
        expected_match_key:
          "98ad884599727b7c90cd429528e674f1697b25026cb8b99bb9a916edd9e94e8e",
        svg_path:
          "M 336 245 L 271 245 L 271 309 L 236 344 L 235 344 L 191 300 L 191 298 L 146 253 L 145 253 L 100 298 L 100 299 L 145 344 L 146 344 L 189 301 L 190 302 L 190 390 L 165 415 L 161 415 L 160 413 L 96 349 L 95 349 L 31 413 L 31 414 L 128 414 L 129 415 L 129 544 L 130 544 L 258 416 L 258 414 L 302 370 L 393 370 L 303 280 L 303 279 L 336 246 Z",
      },
      {
        target_id: "tg-031",
        family: "mixed",
        expected_match_key:
          "747348236c0984545883a56dd73890e8bee8d07c45227e124c23b581e7cba75c",
        svg_path:
          "M 31 415 L 31 480 L 95 544 L 224 544 L 224 499 L 225 498 L 269 542 L 270 542 L 316 496 L 316 431 L 270 385 L 269 385 L 225 429 L 224 428 L 224 415 L 160 351 L 159 351 L 95 415 L 95 476 L 94 477 L 32 415 Z M 225 431 L 250 431 L 251 432 L 251 495 L 250 496 L 225 496 L 224 495 L 224 432 Z",
      },
      {
        target_id: "tg-032",
        family: "deep-concavity",
        expected_match_key:
          "8e18e4988e07e3b3f41cc32848e8018ad8050995ec07f017d237793f1a99edcb",
        svg_path:
          "M 95 283 L 31 347 L 31 412 L 95 476 L 96 476 L 96 415 L 97 414 L 159 476 L 159 540 L 160 540 L 201 499 L 202 499 L 246 543 L 247 543 L 247 453 L 288 412 L 288 348 L 289 347 L 313 347 L 313 346 L 268 301 L 267 301 L 222 346 L 223 348 L 223 410 L 222 411 L 161 411 L 160 410 L 160 347 L 96 283 Z",
      },
      {
        target_id: "tg-033",
        family: "few-anchors",
        expected_match_key:
          "a349558dff7603eff759212afc1e2cbae4906d03171662f7faa8cd2e74c34fba",
        svg_path: "M 31 287 L 31 544 L 160 544 L 160 287 Z",
      },
      {
        target_id: "tg-034",
        family: "elongated",
        expected_match_key:
          "6fdc862d04220d1e57931f5e3328d98de3b37000c65eef00242e54f8370871ad",
        svg_path:
          "M 31 543 L 31 544 L 160 544 L 160 481 L 161 480 L 220 480 L 221 481 L 221 544 L 286 544 L 286 481 L 287 480 L 350 480 L 351 481 L 351 544 L 480 544 L 480 543 L 352 415 L 159 415 Z",
      },
      {
        target_id: "tg-035",
        family: "mixed",
        expected_match_key:
          "e6a650e787a2b6551c739a62a5776fb2c5c137931400ec4a27a4fe569785c7a2",
        svg_path:
          "M 122 260 L 31 351 L 31 480 L 95 544 L 160 544 L 224 480 L 224 415 L 178 369 L 177 369 L 132 414 L 132 415 L 158 415 L 159 416 L 159 476 L 158 477 L 122 441 L 122 331 L 124 330 L 188 266 L 188 265 L 123 265 L 122 264 Z",
      },
      {
        target_id: "tg-036",
        family: "elongated",
        expected_match_key:
          "b04ca78e2e39d5a059e805f70fa263c4bd2f09388e8853828a717563e30c3d57",
        svg_path:
          "M 30 417 L 120 507 L 120 508 L 85 543 L 85 544 L 342 544 L 342 543 L 305 506 L 305 505 L 395 415 L 212 415 L 211 417 Z",
      },
      {
        target_id: "tg-037",
        family: "deep-concavity",
        expected_match_key:
          "2c1ff777a143e865369b33c07b26b61ae00a451f0bd9a359146860f5863ceff9",
        svg_path:
          "M 32 256 L 32 347 L 77 392 L 77 394 L 141 394 L 205 458 L 207 459 L 207 505 L 169 543 L 169 544 L 298 544 L 298 415 L 207 324 L 207 328 L 206 329 L 141 329 L 124 346 L 123 345 L 123 256 L 122 256 L 78 300 L 77 300 L 33 256 Z",
      },
      {
        target_id: "tg-038",
        family: "elongated",
        expected_match_key:
          "0f5895be051ebabe92c95903fe3aa3478c0503bc1f9b207707fe7720bdfdc0ab",
        svg_path:
          "M 95 139 L 31 203 L 31 204 L 94 204 L 95 205 L 95 331 L 67 359 L 67 360 L 69 362 L 69 541 L 68 543 L 159 543 L 159 453 L 160 451 L 158 449 L 158 270 L 160 268 L 160 139 Z",
      },
      {
        target_id: "tg-039",
        family: "deep-concavity",
        expected_match_key:
          "34b4208dbfc995fa024d1303ef046516871ad5c0851dc0ca9286c50e0b3bd3f9",
        svg_path:
          "M 31 540 L 96 540 L 96 481 L 97 480 L 223 480 L 287 544 L 352 544 L 352 543 L 288 479 L 288 417 L 289 416 L 352 416 L 416 352 L 416 351 L 351 351 L 287 415 L 163 415 L 162 414 L 224 352 L 224 351 L 31 351 L 31 416 L 94 416 L 95 417 L 95 475 L 31 539 Z",
      },
      {
        target_id: "tg-040",
        family: "deep-concavity",
        expected_match_key:
          "86533506cbb92552221c4028009ce0b3d6a0e01f1bb0e9bda98f59291f5537e7",
        svg_path:
          "M 333 190 L 242 190 L 242 280 L 160 362 L 159 362 L 96 299 L 31 299 L 31 300 L 211 480 L 211 544 L 276 544 L 276 543 L 224 491 L 224 429 L 225 428 L 254 428 L 255 429 L 255 492 L 320 492 L 320 491 L 258 429 L 259 428 L 288 428 L 288 236 L 333 191 Z",
      },
      {
        target_id: "tg-041",
        family: "deep-concavity",
        expected_match_key:
          "151116a046e14cbe16003fc7cf83de3d4dc49b89c7f9af25cc01187a6ecef78c",
        svg_path:
          "M 31 293 L 31 294 L 95 294 L 159 358 L 158 359 L 249 450 L 251 450 L 295 494 L 295 495 L 253 537 L 253 538 L 318 538 L 318 474 L 341 451 L 342 451 L 386 495 L 386 543 L 387 543 L 432 498 L 432 497 L 386 451 L 386 312 L 339 359 L 225 359 L 224 357 L 96 229 L 95 229 Z",
      },
      {
        target_id: "tg-042",
        family: "deep-concavity",
        expected_match_key:
          "3296bbcec0902a62f48ab09d70c0b4107ef1a27797cf6c5c3a37a2b18ed50435",
        svg_path:
          "M 433 543 L 433 453 L 434 451 L 343 360 L 343 418 L 342 419 L 31 419 L 31 484 L 225 484 L 251 510 L 252 510 L 278 484 L 342 484 L 343 485 L 343 541 L 342 543 Z",
      },
      {
        target_id: "tg-043",
        family: "deep-concavity",
        expected_match_key:
          "eb17dc5ee5c1165e1a1b29d7a9b82fe88d45a05a9874135863edcf1eaa97054a",
        svg_path:
          "M 341 414 L 296 369 L 295 369 L 249 415 L 168 415 L 162 409 L 163 408 L 222 408 L 222 279 L 221 279 L 189 311 L 61 311 L 61 312 L 124 375 L 124 376 L 93 407 L 93 408 L 95 409 L 95 471 L 31 535 L 31 536 L 96 536 L 160 472 L 223 472 L 295 544 L 296 544 L 296 416 L 297 415 L 341 415 Z",
      },
      {
        target_id: "tg-044",
        family: "deep-concavity",
        expected_match_key:
          "45da14995b21bc973477ed8b2fbc9202884b96a4242dbd9a531b7349d6fc6bff",
        svg_path:
          "M 450 436 L 450 372 L 451 370 L 361 370 L 360 369 L 360 351 L 359 351 L 295 415 L 166 415 L 122 371 L 31 371 L 31 372 L 76 417 L 166 417 L 167 418 L 167 544 L 232 544 L 232 481 L 233 480 L 294 480 L 295 481 L 295 544 L 360 544 L 360 462 L 386 436 Z",
      },
      {
        target_id: "tg-045",
        family: "elongated",
        expected_match_key:
          "30b59763025aa10d5a536d904e1c0f6c45061f66812f74fb2ddf229e69c1241a",
        svg_path:
          "M 160 159 L 159 159 L 31 287 L 31 288 L 94 288 L 95 289 L 33 351 L 33 352 L 94 352 L 95 353 L 33 415 L 33 416 L 94 416 L 95 417 L 33 479 L 33 480 L 94 480 L 95 481 L 33 543 L 33 544 L 162 544 L 162 287 L 160 286 Z",
      },
      {
        target_id: "tg-046",
        family: "deep-concavity",
        expected_match_key:
          "4d90a8dd69331d447e06f2d0806706ebda9449237ec778b64a8870c7188b5263",
        svg_path:
          "M 77 279 L 77 405 L 76 406 L 76 497 L 75 498 L 32 498 L 32 499 L 77 544 L 168 544 L 214 498 L 169 498 L 168 497 L 168 411 L 169 410 L 213 454 L 214 454 L 259 409 L 259 408 L 214 363 L 213 363 L 169 407 L 168 406 L 168 318 L 202 284 L 203 284 L 267 348 L 268 348 L 268 283 L 205 283 L 204 282 L 206 280 L 206 279 Z",
      },
      {
        target_id: "tg-047",
        family: "deep-concavity",
        expected_match_key:
          "6443b7ffe8381b2ae43a7a32b78f0e196252a9cb49f071bcf17c56b43c2f21c8",
        svg_path:
          "M 59 287 L 59 415 L 58 416 L 32 416 L 32 417 L 123 508 L 123 544 L 124 544 L 186 482 L 187 483 L 187 544 L 316 544 L 316 543 L 234 461 L 234 373 L 236 372 L 281 327 L 281 326 L 189 326 L 188 325 L 188 413 L 187 414 L 60 287 Z",
      },
      {
        target_id: "tg-048",
        family: "deep-concavity",
        expected_match_key:
          "23335fc2ae60cc267ea150ed0a6d52f3de85fa0a27ebc5da2d63632749b6ba12",
        svg_path:
          "M 57 233 L 57 234 L 79 256 L 79 344 L 77 345 L 32 390 L 32 481 L 35 480 L 99 544 L 228 544 L 228 543 L 191 506 L 191 505 L 281 415 L 101 415 L 100 414 L 123 391 L 125 392 L 125 300 L 122 297 L 122 233 Z",
      },
      {
        target_id: "tg-049",
        family: "mixed",
        expected_match_key:
          "8e9edef36213410b1f208ba758660d2201fc62bccb1d36362275891382caa0e3",
        svg_path:
          "M 146 246 L 146 339 L 158 351 L 158 352 L 95 415 L 95 476 L 94 477 L 32 415 L 31 415 L 31 480 L 95 544 L 224 544 L 224 415 L 193 384 L 193 383 L 237 339 L 237 246 L 236 246 L 192 290 L 191 290 L 147 246 Z",
      },
      {
        target_id: "tg-050",
        family: "diagonal",
        expected_match_key:
          "b47dfb4c935742c4f46260dbcfc41c0d934791ae92b52d49a2f44ddbf8f5b1ab",
        svg_path:
          "M 32 360 L 32 451 L 33 451 L 77 407 L 78 408 L 78 499 L 123 544 L 124 544 L 124 542 L 126 540 L 307 540 L 217 450 L 217 449 L 252 414 L 252 413 L 216 413 L 215 412 L 215 322 L 214 322 L 124 412 L 123 411 L 123 360 L 78 315 L 77 315 Z",
      },
      {
        target_id: "tg-051",
        family: "deep-concavity",
        expected_match_key:
          "12c46ef3201ac6bf411a4f989680d8761a8f9a208752945bfccc35eb70aa288c",
        svg_path:
          "M 95 189 L 31 253 L 31 254 L 95 254 L 159 318 L 159 446 L 222 446 L 223 447 L 223 509 L 189 543 L 189 544 L 254 544 L 254 480 L 352 382 L 352 381 L 289 381 L 288 380 L 288 253 L 287 253 L 224 316 L 223 316 L 96 189 Z",
      },
      {
        target_id: "tg-052",
        family: "few-anchors",
        expected_match_key:
          "1c20a714a735444884aa0ad54568e8be19baffffae5d2fbb59d30e7597468de6",
        svg_path: "M 31 543 L 31 544 L 416 544 L 416 543 L 288 415 L 159 415 Z",
      },
      {
        target_id: "tg-053",
        family: "deep-concavity",
        expected_match_key:
          "bf141b3865b479a55dbed6026b67231c97187bb2df0ffc701e2b380b30fd60ab",
        svg_path:
          "M 97 177 L 97 242 L 162 242 L 163 243 L 163 411 L 161 413 L 160 412 L 160 351 L 159 351 L 95 415 L 95 445 L 31 509 L 31 510 L 96 510 L 96 480 L 124 452 L 159 452 L 204 497 L 204 498 L 160 542 L 160 543 L 251 543 L 251 453 L 252 452 L 252 324 L 254 322 L 254 321 L 162 229 L 162 177 Z",
      },
      {
        target_id: "tg-054",
        family: "mixed",
        expected_match_key:
          "3585f699ca5672dd73ec525a8b380d93d83e7a3f29be471ae2bbe43013e5db9d",
        svg_path:
          "M 31 323 L 31 452 L 32 452 L 113 371 L 114 372 L 114 460 L 95 479 L 95 480 L 126 480 L 127 481 L 127 544 L 192 544 L 192 481 L 193 480 L 224 480 L 224 479 L 206 461 L 206 373 L 207 372 L 287 452 L 288 452 L 288 323 Z",
      },
      {
        target_id: "tg-055",
        family: "deep-concavity",
        expected_match_key:
          "56e20541b694119a26585d81dc018b33b0925deb9865f412277a5a5607e2e621",
        svg_path:
          "M 122 160 L 32 250 L 32 251 L 123 251 L 124 252 L 124 361 L 123 362 L 123 545 L 213 455 L 215 456 L 215 545 L 306 454 L 306 453 L 215 362 L 214 363 L 170 319 L 170 227 L 125 182 L 123 181 L 123 160 Z",
      },
      {
        target_id: "tg-056",
        family: "deep-concavity",
        expected_match_key:
          "28cf82b081f50afbcd53272e48ed9afdfa6ee7249433fbc6d9d9ed0a33a98ce2",
        svg_path:
          "M 324 305 L 195 305 L 195 434 L 197 434 L 213 450 L 213 451 L 168 496 L 77 496 L 33 452 L 32 452 L 32 543 L 214 542 L 259 497 L 262 498 L 326 434 L 326 433 L 324 432 Z",
      },
      {
        target_id: "tg-057",
        family: "diagonal",
        expected_match_key:
          "0d530a369f11fe325c697d60e4e886487ca4cc844eb365f1647157e03ccd1663",
        svg_path:
          "M 396 351 L 331 351 L 267 415 L 207 415 L 206 414 L 215 405 L 215 404 L 122 404 L 77 449 L 77 451 L 32 496 L 32 497 L 76 541 L 75 544 L 204 544 L 285 463 L 375 463 L 375 462 L 331 418 L 331 417 L 396 352 Z",
      },
      {
        target_id: "tg-058",
        family: "deep-concavity",
        expected_match_key:
          "7f65eed641882984486995f11f671d5e95ecedf614d4e1608cc6c0e871ec6708",
        svg_path:
          "M 182 191 L 181 191 L 136 236 L 136 237 L 157 258 L 156 259 L 31 259 L 31 260 L 49 278 L 49 368 L 95 414 L 95 452 L 96 453 L 96 543 L 187 543 L 187 542 L 143 498 L 143 497 L 188 452 L 223 452 L 255 484 L 256 484 L 301 439 L 301 438 L 211 438 L 160 387 L 160 263 L 161 262 L 181 282 L 182 282 L 227 237 L 227 236 Z",
      },
      {
        target_id: "tg-059",
        family: "diagonal",
        expected_match_key:
          "8f202973c9d29af1d36069e2f9e3d4414629451ad790ad6bc26b05629c7f8a39",
        svg_path:
          "M 30 544 L 276 544 L 278 542 L 459 542 L 368 451 L 367 451 L 339 479 L 336 479 L 290 433 L 288 433 L 244 389 L 243 389 L 199 433 L 197 433 L 151 479 L 148 479 L 122 453 L 121 453 Z",
      },
      {
        target_id: "tg-060",
        family: "diagonal",
        expected_match_key:
          "b625675a962d3971a5e5a92e0c00c80f8338b87f5c21ea3b8a6a1f441a390eca",
        svg_path:
          "M 30 544 L 213 544 L 214 543 L 302 543 L 304 544 L 349 499 L 349 407 L 165 407 L 120 452 L 120 454 Z",
      },
      {
        target_id: "tg-061",
        family: "deep-concavity",
        expected_match_key:
          "db9717407c90b9b646a9606d9223f1bcf75c6a90516b7376eb28708f1b2f7ed2",
        svg_path:
          "M 31 285 L 31 542 L 157 542 L 158 543 L 249 543 L 249 542 L 205 498 L 205 496 L 115 496 L 96 477 L 96 447 L 97 446 L 160 446 L 160 381 L 97 381 L 96 380 L 96 350 L 114 332 L 204 332 L 250 286 L 161 286 L 160 285 Z",
      },
      {
        target_id: "tg-062",
        family: "deep-concavity",
        expected_match_key:
          "3c8f4f8ad65ec2c6f197345a9a25cf0af693f13d8983295ca166c6a7ecdb0cca",
        svg_path:
          "M 414 303 L 413 303 L 349 367 L 349 412 L 348 413 L 221 413 L 220 415 L 160 415 L 96 351 L 96 349 L 31 349 L 31 414 L 94 414 L 95 415 L 95 544 L 96 544 L 160 480 L 221 480 L 285 544 L 286 544 L 286 481 L 287 480 L 349 542 L 350 542 L 350 432 L 414 368 Z",
      },
      {
        target_id: "tg-063",
        family: "deep-concavity",
        expected_match_key:
          "a38d83ee224ee908eae28faedf0a95ba0bd32c335e097a4712a02d03cf76bb1c",
        svg_path:
          "M 415 496 L 326 496 L 325 495 L 369 451 L 367 451 L 366 449 L 302 385 L 273 385 L 272 384 L 315 341 L 315 340 L 270 295 L 269 295 L 224 340 L 224 341 L 267 384 L 266 385 L 237 385 L 237 386 L 301 450 L 300 451 L 186 451 L 186 452 L 159 479 L 31 479 L 31 480 L 95 544 L 96 544 L 98 542 L 279 542 L 280 541 L 368 541 L 370 542 L 415 497 Z",
      },
      {
        target_id: "tg-064",
        family: "deep-concavity",
        expected_match_key:
          "ae7263aaac3a492ab3bdd406cec219ce03c50143aa015ab04b843a7a2f3ff92c",
        svg_path:
          "M 31 287 L 31 352 L 94 352 L 95 353 L 95 406 L 94 407 L 94 499 L 139 544 L 140 544 L 140 455 L 142 454 L 188 408 L 223 408 L 248 433 L 248 523 L 249 523 L 294 478 L 294 477 L 288 471 L 288 408 L 352 344 L 352 343 L 288 279 L 287 279 L 287 342 L 286 343 L 160 343 L 96 279 L 95 279 L 95 286 L 94 287 Z",
      },
      {
        target_id: "tg-065",
        family: "few-anchors",
        expected_match_key:
          "4f07a23d71463f08faa9adea500bb91e669dc46bdf27ffa93b2eb7875e50821f",
        svg_path:
          "M 31 479 L 31 480 L 156 480 L 157 481 L 95 543 L 95 544 L 288 544 L 288 543 L 226 481 L 227 480 L 352 480 L 352 479 L 224 351 L 159 351 Z",
      },
      {
        target_id: "tg-066",
        family: "few-anchors",
        expected_match_key:
          "9bb81ab20fef1a0c04037e08eb0350f463e1a6e2755a016f2f9651911cb3ed3e",
        svg_path:
          "M 159 287 L 31 415 L 31 544 L 32 544 L 159 417 L 160 417 L 287 544 L 288 544 L 288 415 L 160 287 Z",
      },
      {
        target_id: "tg-067",
        family: "deep-concavity",
        expected_match_key:
          "4fd334fcdc4276235e1b1591723d224c4dccd18fcddcddc2348311f17ce2e4ef",
        svg_path:
          "M 32 274 L 32 275 L 76 319 L 76 411 L 121 456 L 123 457 L 123 545 L 213 455 L 214 455 L 295 536 L 296 536 L 296 409 L 298 408 L 298 407 L 234 343 L 233 343 L 215 361 L 214 361 L 170 317 L 169 317 L 124 362 L 123 361 L 123 274 Z",
      },
      {
        target_id: "tg-068",
        family: "deep-concavity",
        expected_match_key:
          "8e7803b74e9c7f2616ca33e3ee495a156fb427385e893ba5e226a5c1b85b8a44",
        svg_path:
          "M 77 195 L 32 240 L 32 241 L 65 274 L 65 517 L 38 544 L 221 544 L 194 517 L 194 453 L 131 390 L 131 389 L 155 365 L 156 365 L 191 400 L 192 400 L 256 336 L 256 335 L 128 335 L 79 286 L 79 285 L 123 241 L 123 240 L 78 195 Z",
      },
      {
        target_id: "tg-069",
        family: "deep-concavity",
        expected_match_key:
          "e79f9723b188f53d3f23593f35ecd9d50596003904dec224ebec6fe15f34172d",
        svg_path:
          "M 30 387 L 57 414 L 57 542 L 122 542 L 122 478 L 146 454 L 275 454 L 301 480 L 301 544 L 366 544 L 366 416 L 393 389 L 213 389 L 212 388 L 213 387 Z",
      },
      {
        target_id: "tg-070",
        family: "deep-concavity",
        expected_match_key:
          "7346762b401a5e0b767b630e7b6821a59989f6cf4a5981baaed5db753f6408a5",
        svg_path:
          "M 370 323 L 305 323 L 241 387 L 124 387 L 78 341 L 77 341 L 32 386 L 32 387 L 111 387 L 112 388 L 49 451 L 49 516 L 50 516 L 112 454 L 113 455 L 113 516 L 114 516 L 178 452 L 215 452 L 306 543 L 307 543 L 307 499 L 308 498 L 372 498 L 372 497 L 308 433 L 306 432 L 306 389 L 307 388 L 370 388 Z",
      },
      {
        target_id: "tg-071",
        family: "deep-concavity",
        expected_match_key:
          "e37022999dab98c42c86fb011bc70dcd09a74e4ca4d31e3869565cf8dce9f1b2",
        svg_path:
          "M 121 97 L 121 188 L 165 232 L 164 233 L 135 233 L 135 296 L 134 297 L 103 297 L 103 298 L 121 316 L 121 317 L 31 407 L 31 408 L 121 498 L 121 499 L 76 544 L 259 544 L 123 408 L 123 407 L 232 298 L 232 297 L 201 297 L 200 296 L 200 233 L 168 233 L 167 232 L 167 142 L 122 97 Z",
      },
      {
        target_id: "tg-072",
        family: "diagonal",
        expected_match_key:
          "ba06409c7655328c49a55413071c2b23a60975ced2e1440ad6adf96eea56b50a",
        svg_path:
          "M 95 323 L 95 387 L 31 451 L 31 452 L 61 452 L 62 453 L 62 543 L 152 543 L 153 544 L 155 543 L 245 543 L 245 453 L 246 452 L 277 452 L 186 361 L 185 361 L 161 385 L 160 384 L 160 323 Z",
      },
      {
        target_id: "tg-073",
        family: "deep-concavity",
        expected_match_key:
          "6f1c7aa78c108de77a8c9e7867426915ee413c97728b06034f43f8792094bab0",
        svg_path:
          "M 250 289 L 248 290 L 160 290 L 159 289 L 160 287 L 95 287 L 31 351 L 31 544 L 160 544 L 160 415 L 97 415 L 96 414 L 96 352 L 113 335 L 201 335 L 202 336 L 185 353 L 185 354 L 314 354 L 314 353 Z",
      },
      {
        target_id: "tg-074",
        family: "deep-concavity",
        expected_match_key:
          "3524617db56a882d1d5043ae15674104d290672d26160057bd8ada1915da588e",
        svg_path:
          "M 30 544 L 213 544 L 169 500 L 169 499 L 259 409 L 260 407 L 304 451 L 304 453 L 348 497 L 348 498 L 302 544 L 485 544 L 395 454 L 396 451 L 351 406 L 262 406 L 261 405 L 322 344 L 322 343 L 193 343 L 193 344 L 256 407 L 255 408 L 168 408 L 123 453 L 121 453 Z",
      },
      {
        target_id: "tg-075",
        family: "deep-concavity",
        expected_match_key:
          "379155da24f89a970db78a2dacc8af3db0f370844524a979b7ee4c17c08810aa",
        svg_path:
          "M 226 172 L 135 263 L 135 264 L 221 350 L 220 351 L 160 351 L 96 287 L 31 287 L 31 288 L 157 414 L 156 415 L 63 415 L 63 544 L 64 544 L 192 416 L 287 416 L 319 448 L 320 448 L 320 319 L 319 319 L 256 382 L 255 382 L 226 353 Z",
      },
      {
        target_id: "tg-076",
        family: "few-anchors",
        expected_match_key:
          "5bbac718708e90bf3f9f06d882c6cb17389946a18aad3c7ff98ad87250e7dbf3",
        svg_path:
          "M 31 479 L 31 480 L 95 544 L 288 544 L 352 480 L 352 479 L 288 415 L 95 415 Z",
      },
      {
        target_id: "tg-077",
        family: "mixed",
        expected_match_key:
          "4cd74e87fd8e6f3ddd1cb9b9f9753f25baead4e5f4568416e62ab0a5e1665ab1",
        svg_path:
          "M 31 453 L 31 454 L 122 545 L 122 519 L 123 518 L 252 518 L 253 519 L 253 545 L 344 454 L 344 453 L 253 362 L 253 388 L 252 389 L 123 389 L 122 388 L 122 362 Z",
      },
      {
        target_id: "tg-078",
        family: "deep-concavity",
        expected_match_key:
          "337f9409639279f5713b5df439f052af8429f5506777c21a51b6cea5e0855055",
        svg_path:
          "M 395 362 L 394 362 L 350 406 L 349 406 L 305 362 L 304 362 L 304 452 L 303 453 L 120 453 L 120 454 L 78 496 L 77 495 L 77 407 L 31 453 L 31 543 L 30 544 L 213 544 L 213 543 L 238 518 L 366 518 L 366 517 L 349 500 L 351 499 L 396 454 L 395 452 Z M 348 499 L 349 498 L 350 499 L 349 500 Z M 347 498 L 348 497 L 349 498 L 348 499 Z M 346 497 L 347 496 L 348 497 L 347 498 Z M 345 496 L 346 495 L 347 496 L 346 497 Z M 344 495 L 345 494 L 346 495 L 345 496 Z M 343 494 L 344 493 L 345 494 L 344 495 Z M 342 493 L 343 492 L 344 493 L 343 494 Z M 341 492 L 342 491 L 343 492 L 342 493 Z M 340 491 L 341 490 L 342 491 L 341 492 Z M 339 490 L 340 489 L 341 490 L 340 491 Z M 338 489 L 339 488 L 340 489 L 339 490 Z M 337 488 L 338 487 L 339 488 L 338 489 Z M 336 487 L 337 486 L 338 487 L 337 488 Z M 335 486 L 336 485 L 337 486 L 336 487 Z M 334 485 L 335 484 L 336 485 L 335 486 Z M 333 484 L 334 483 L 335 484 L 334 485 Z M 332 483 L 333 482 L 334 483 L 333 484 Z M 331 482 L 332 481 L 333 482 L 332 483 Z M 330 481 L 331 480 L 332 481 L 331 482 Z M 329 480 L 330 479 L 331 480 L 330 481 Z M 328 479 L 329 478 L 330 479 L 329 480 Z M 327 478 L 328 477 L 329 478 L 328 479 Z M 326 477 L 327 476 L 328 477 L 327 478 Z M 325 476 L 326 475 L 327 476 L 326 477 Z M 324 475 L 325 474 L 326 475 L 325 476 Z M 323 474 L 324 473 L 325 474 L 324 475 Z M 322 473 L 323 472 L 324 473 L 323 474 Z M 321 472 L 322 471 L 323 472 L 322 473 Z M 320 471 L 321 470 L 322 471 L 321 472 Z M 319 470 L 320 469 L 321 470 L 320 471 Z M 318 469 L 319 468 L 320 469 L 319 470 Z M 317 468 L 318 467 L 319 468 L 318 469 Z M 316 467 L 317 466 L 318 467 L 317 468 Z M 315 466 L 316 465 L 317 466 L 316 467 Z M 314 465 L 315 464 L 316 465 L 315 466 Z M 313 464 L 314 463 L 315 464 L 314 465 Z M 312 463 L 313 462 L 314 463 L 313 464 Z M 311 462 L 312 461 L 313 462 L 312 463 Z M 310 461 L 311 460 L 312 461 L 311 462 Z M 309 460 L 310 459 L 311 460 L 310 461 Z M 308 459 L 309 458 L 310 459 L 309 460 Z M 307 458 L 308 457 L 309 458 L 308 459 Z M 306 457 L 307 456 L 308 457 L 307 458 Z M 305 456 L 306 455 L 307 456 L 306 457 Z M 304 455 L 305 454 L 306 455 L 305 456 Z M 303 454 L 304 453 L 305 454 L 304 455 Z",
      },
      {
        target_id: "tg-079",
        family: "deep-concavity",
        expected_match_key:
          "49b60d356d87e5ea3b69907bc9af1b399ba44292178ed0d89938fe2ffff14308",
        svg_path:
          "M 96 138 L 51 183 L 51 184 L 95 228 L 94 229 L 31 229 L 31 230 L 159 358 L 159 422 L 160 423 L 160 512 L 129 543 L 129 544 L 194 544 L 194 480 L 205 469 L 298 469 L 342 513 L 343 513 L 343 422 L 341 423 L 289 423 L 288 421 L 160 293 L 160 229 L 99 229 L 98 228 L 142 184 L 142 183 L 97 138 Z",
      },
      {
        target_id: "tg-080",
        family: "deep-concavity",
        expected_match_key:
          "2ac1c176b7eeae67daf48930ff7b870f298b49137754eef7e56035fcfac64c67",
        svg_path:
          "M 95 285 L 31 349 L 31 350 L 94 413 L 94 415 L 95 416 L 95 544 L 224 544 L 224 543 L 141 460 L 141 459 L 186 414 L 223 414 L 287 478 L 288 478 L 288 413 L 224 349 L 160 349 L 96 285 Z M 205 281 L 205 346 L 270 346 L 270 281 Z",
      },
      {
        target_id: "tg-081",
        family: "diagonal",
        expected_match_key:
          "8d0d7c9e997f4839567de7199fec95a15d4bed9e46ef0bf78c4b6e51919802f7",
        svg_path:
          "M 79 135 L 34 180 L 32 179 L 32 271 L 33 272 L 33 453 L 34 454 L 34 543 L 125 543 L 124 541 L 124 360 L 123 359 L 123 271 L 124 269 L 81 226 L 81 225 L 125 181 L 125 180 L 80 135 Z",
      },
      {
        target_id: "tg-082",
        family: "diagonal",
        expected_match_key:
          "5fda4fa979bbdd10e4af1bffdc9a1a0bf47de81d167149cc294b4546219892fe",
        svg_path:
          "M 32 471 L 33 471 L 76 428 L 77 429 L 77 518 L 205 518 L 232 545 L 233 545 L 369 409 L 369 408 L 279 408 L 233 362 L 232 362 L 124 470 L 123 469 L 123 380 L 78 335 L 77 335 L 32 380 Z",
      },
      {
        target_id: "tg-083",
        family: "deep-concavity",
        expected_match_key:
          "d81fed19406d67fa175b5aa7308d3af049b8b2301961e825b312e9111f8285e5",
        svg_path:
          "M 31 397 L 31 398 L 160 398 L 160 397 L 143 380 L 143 379 L 187 335 L 188 335 L 267 414 L 266 415 L 205 415 L 205 544 L 334 544 L 334 415 L 206 287 L 141 287 L 141 289 L 97 333 L 95 333 Z",
      },
      {
        target_id: "tg-084",
        family: "deep-concavity",
        expected_match_key:
          "2b50bf1920e0bb9b5d2261fd8fb52d87d99763b58ce1a959f2bc95f2cc82706f",
        svg_path:
          "M 129 210 L 128 210 L 37 301 L 38 303 L 38 393 L 39 393 L 83 349 L 84 349 L 123 388 L 123 389 L 79 433 L 79 434 L 123 478 L 122 479 L 95 479 L 31 543 L 31 544 L 224 544 L 224 543 L 160 479 L 127 479 L 126 478 L 170 434 L 170 433 L 130 393 L 130 392 L 173 349 L 174 349 L 218 393 L 219 393 L 219 303 L 220 301 Z",
      },
      {
        target_id: "tg-085",
        family: "deep-concavity",
        expected_match_key:
          "7c830265f582cbd31808a62c6d1eec338ebf6dc23956eae4db4377ffbf6cb313",
        svg_path:
          "M 76 101 L 76 193 L 119 236 L 118 237 L 89 237 L 89 300 L 88 301 L 57 301 L 57 302 L 76 321 L 76 409 L 74 410 L 74 500 L 30 544 L 213 544 L 168 499 L 168 320 L 186 302 L 186 301 L 155 301 L 154 300 L 154 237 L 123 237 L 122 236 L 122 147 Z M 118 453 L 119 452 L 120 453 L 119 454 Z M 117 452 L 118 451 L 119 452 L 118 453 Z M 116 451 L 117 450 L 118 451 L 117 452 Z M 115 450 L 116 449 L 117 450 L 116 451 Z M 114 449 L 115 448 L 116 449 L 115 450 Z M 113 448 L 114 447 L 115 448 L 114 449 Z M 112 447 L 113 446 L 114 447 L 113 448 Z M 111 446 L 112 445 L 113 446 L 112 447 Z M 110 445 L 111 444 L 112 445 L 111 446 Z M 109 444 L 110 443 L 111 444 L 110 445 Z M 108 443 L 109 442 L 110 443 L 109 444 Z M 107 442 L 108 441 L 109 442 L 108 443 Z M 106 441 L 107 440 L 108 441 L 107 442 Z M 105 440 L 106 439 L 107 440 L 106 441 Z M 104 439 L 105 438 L 106 439 L 105 440 Z M 103 438 L 104 437 L 105 438 L 104 439 Z M 102 437 L 103 436 L 104 437 L 103 438 Z M 101 436 L 102 435 L 103 436 L 102 437 Z M 100 435 L 101 434 L 102 435 L 101 436 Z M 99 434 L 100 433 L 101 434 L 100 435 Z M 98 433 L 99 432 L 100 433 L 99 434 Z M 97 432 L 98 431 L 99 432 L 98 433 Z M 96 431 L 97 430 L 98 431 L 97 432 Z M 95 430 L 96 429 L 97 430 L 96 431 Z M 94 429 L 95 428 L 96 429 L 95 430 Z M 93 428 L 94 427 L 95 428 L 94 429 Z M 92 427 L 93 426 L 94 427 L 93 428 Z M 91 426 L 92 425 L 93 426 L 92 427 Z M 90 425 L 91 424 L 92 425 L 91 426 Z M 89 424 L 90 423 L 91 424 L 90 425 Z M 88 423 L 89 422 L 90 423 L 89 424 Z M 87 422 L 88 421 L 89 422 L 88 423 Z M 86 421 L 87 420 L 88 421 L 87 422 Z M 85 420 L 86 419 L 87 420 L 86 421 Z M 84 419 L 85 418 L 86 419 L 85 420 Z M 83 418 L 84 417 L 85 418 L 84 419 Z M 82 417 L 83 416 L 84 417 L 83 418 Z M 81 416 L 82 415 L 83 416 L 82 417 Z M 80 415 L 81 414 L 82 415 L 81 416 Z M 79 414 L 80 413 L 81 414 L 80 415 Z M 78 413 L 79 412 L 80 413 L 79 414 Z M 77 412 L 78 411 L 79 412 L 78 413 Z",
      },
      {
        target_id: "tg-086",
        family: "deep-concavity",
        expected_match_key:
          "24e3cb20f56de331f2b56134a8ce4938649c39f6ccc90cb5915f66f8e5241658",
        svg_path:
          "M 31 253 L 31 382 L 32 382 L 96 318 L 158 318 L 159 319 L 115 363 L 115 364 L 159 408 L 159 409 L 116 452 L 114 452 L 114 543 L 115 543 L 159 499 L 162 499 L 207 544 L 207 452 L 163 408 L 163 407 L 206 364 L 206 363 L 162 319 L 163 318 L 223 318 L 287 382 L 288 382 L 288 253 Z",
      },
      {
        target_id: "tg-087",
        family: "deep-concavity",
        expected_match_key:
          "c4a35fb3213b3cb302ffdcfe8b771a4b7fd7043f99d7d37c9fa5418660f5206b",
        svg_path:
          "M 416 351 L 352 287 L 351 287 L 223 415 L 160 415 L 96 351 L 31 351 L 31 352 L 95 416 L 95 544 L 96 544 L 160 480 L 287 480 L 332 525 L 333 525 L 333 435 L 352 416 L 352 353 L 353 352 L 416 352 Z",
      },
      {
        target_id: "tg-088",
        family: "diagonal",
        expected_match_key:
          "fe23ba15e7ad21282d69725a891e74b1e5a446073b7b6044e09a9bd2cf0bc64c",
        svg_path:
          "M 33 360 L 33 541 L 32 543 L 216 544 L 216 543 L 214 541 L 214 360 L 187 387 L 157 387 L 156 386 L 156 323 L 91 323 L 91 386 L 90 387 L 60 387 Z",
      },
      {
        target_id: "tg-089",
        family: "deep-concavity",
        expected_match_key:
          "29583961f6adfe54370011769338eefe7c988fa9d5d70cd01e09701644c58b85",
        svg_path:
          "M 294 373 L 230 309 L 229 309 L 229 316 L 228 317 L 165 317 L 164 319 L 76 319 L 75 318 L 75 499 L 30 544 L 213 544 L 213 543 L 257 499 L 259 499 L 259 409 L 294 374 Z M 212 365 L 229 382 L 229 437 L 213 453 L 211 453 L 167 497 L 166 497 L 123 454 L 123 453 L 166 410 L 166 409 L 123 366 L 124 365 Z",
      },
      {
        target_id: "tg-090",
        family: "few-anchors",
        expected_match_key:
          "82717e00b9aa21c1fb4bf657b7edc21b91c0b7c439da3f0c64dff9ecd77696e3",
        svg_path:
          "M 31 389 L 31 454 L 94 517 L 94 518 L 68 544 L 251 544 L 225 518 L 225 517 L 288 454 L 288 389 Z",
      },
      {
        target_id: "tg-091",
        family: "few-anchors",
        expected_match_key:
          "3fd54b15e82ffbaf09384d1d4c4008711252a1437fbc6dc26e79068e9e98ed0c",
        svg_path:
          "M 31 351 L 31 544 L 224 544 L 224 351 Z M 160 476 L 160 417 L 161 416 L 220 416 L 221 417 L 161 477 Z M 158 354 L 159 355 L 159 414 L 158 415 L 99 415 L 98 414 Z",
      },
      {
        target_id: "tg-092",
        family: "deep-concavity",
        expected_match_key:
          "f1a52c68ca252f9a24af25141bd0e12aa94bf41857ba9ed62e2031fa9949c539",
        svg_path:
          "M 267 206 L 266 206 L 221 251 L 221 252 L 265 296 L 264 297 L 174 297 L 218 341 L 218 342 L 95 465 L 31 465 L 31 530 L 32 530 L 64 498 L 128 498 L 192 434 L 193 432 L 217 432 L 265 480 L 265 544 L 330 544 L 330 543 L 309 522 L 309 433 L 311 432 L 267 388 L 267 387 L 357 297 L 269 297 L 268 296 L 312 252 L 312 251 Z",
      },
      {
        target_id: "tg-093",
        family: "deep-concavity",
        expected_match_key:
          "51ddc506e8907ad8b18878d9007427ced50b45aa702e7ec0471bd142fc6592da",
        svg_path:
          "M 118 150 L 118 241 L 119 241 L 139 221 L 140 221 L 157 238 L 157 417 L 31 543 L 31 544 L 96 544 L 160 480 L 222 480 L 223 481 L 223 544 L 224 544 L 288 480 L 288 479 L 224 415 L 224 352 L 248 328 L 248 327 L 187 266 L 187 265 L 231 221 L 231 220 L 186 175 L 186 174 L 209 151 L 209 150 Z",
      },
      {
        target_id: "tg-094",
        family: "elongated",
        expected_match_key:
          "c3f3f34db001911c20aeab9ed5dff01a190ca7b9c367763fc7212a3df6edd664",
        svg_path:
          "M 414 539 L 286 411 L 285 411 L 267 429 L 266 429 L 222 385 L 221 385 L 177 429 L 176 429 L 160 413 L 159 413 L 159 415 L 31 543 L 31 544 L 160 544 L 161 542 L 288 542 L 289 540 L 414 540 Z",
      },
      {
        target_id: "tg-095",
        family: "deep-concavity",
        expected_match_key:
          "5973b1620d744c4959205c2fd3563370761c10b8760e83def2fcac649e644543",
        svg_path:
          "M 91 207 L 91 271 L 90 272 L 76 272 L 31 317 L 31 318 L 75 318 L 76 319 L 76 409 L 78 410 L 78 498 L 32 544 L 215 544 L 168 497 L 168 318 L 169 317 L 215 317 L 215 316 L 170 271 L 168 272 L 157 272 L 156 271 L 156 207 Z",
      },
      {
        target_id: "tg-096",
        family: "deep-concavity",
        expected_match_key:
          "a2a85fd8306843ed507d01d39d7268036f8831e55eb413c29c511b19dc94fe52",
        svg_path:
          "M 441 286 L 440 286 L 396 330 L 395 330 L 354 289 L 353 289 L 353 352 L 352 353 L 225 353 L 161 417 L 160 415 L 95 415 L 31 479 L 31 544 L 96 544 L 96 480 L 160 416 L 161 417 L 161 482 L 162 482 L 226 418 L 289 418 L 353 482 L 354 482 L 354 419 L 355 418 L 482 418 L 482 417 L 441 376 Z",
      },
      {
        target_id: "tg-097",
        family: "deep-concavity",
        expected_match_key:
          "314746da763f0bd48b8e4d7a406498fd3d40a0df19fc323bf57fbca7282f7118",
        svg_path:
          "M 92 450 L 47 495 L 47 496 L 92 541 L 93 541 L 93 450 Z M 182 81 L 181 81 L 136 126 L 136 127 L 158 149 L 158 150 L 31 277 L 31 278 L 95 342 L 95 470 L 96 470 L 113 453 L 114 454 L 114 543 L 205 543 L 205 542 L 160 497 L 160 153 L 161 152 L 181 172 L 182 172 L 227 127 L 227 126 Z",
      },
      {
        target_id: "tg-098",
        family: "deep-concavity",
        expected_match_key:
          "0e91a9548aca2512c8de9d2bbe65acf28fb35bba97e831aa5af5ab5bdbd7ca28",
        svg_path:
          "M 412 299 L 348 235 L 283 235 L 219 299 L 218 298 L 218 296 L 159 355 L 31 355 L 31 356 L 94 419 L 94 420 L 36 478 L 126 478 L 127 479 L 127 544 L 192 544 L 192 543 L 128 479 L 129 478 L 217 478 L 218 479 L 219 478 L 218 477 L 218 365 L 220 364 L 284 300 L 412 300 Z",
      },
      {
        target_id: "tg-099",
        family: "deep-concavity",
        expected_match_key:
          "5c56d7895cb5f3c236d9ea219352ab9d2e8636d8e93e37cbda9e92bcf23f56f9",
        svg_path:
          "M 284 239 L 283 239 L 219 303 L 219 304 L 301 386 L 301 387 L 257 431 L 256 431 L 213 388 L 213 387 L 30 387 L 120 477 L 120 478 L 210 478 L 211 479 L 211 544 L 276 544 L 276 543 L 212 479 L 213 478 L 303 478 L 303 477 L 348 432 L 348 367 L 286 305 L 287 304 L 348 304 L 348 303 Z",
      },
      {
        target_id: "tg-100",
        family: "deep-concavity",
        expected_match_key:
          "6dc467e6322ed5c0f03c90f95aeb6c34442bc93958ab08a3fc99e4dd118f3ef5",
        svg_path:
          "M 268 289 L 267 289 L 203 353 L 139 353 L 123 369 L 122 369 L 78 325 L 77 325 L 32 370 L 32 461 L 33 461 L 76 418 L 89 418 L 180 509 L 180 510 L 147 543 L 147 544 L 276 544 L 276 543 L 213 480 L 213 479 L 227 465 L 317 465 L 317 464 L 273 420 L 273 419 L 269 419 L 268 418 Z",
      },
    ];
  });
var L4 = {};
M(L4, { default: () => $1 });
import { html as Z1 } from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
function S1(e) {
  if (typeof document > "u")
    return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg viewBox="0 0 768 576" xmlns="http://www.w3.org/2000/svg"><rect width="768" height="576" fill="white"/><path d="${e}" fill="black" fill-rule="evenodd"/></svg>`)}`;
  let o = document.createElement("canvas");
  ((o.width = 768), (o.height = 576));
  let a = o.getContext("2d");
  return a
    ? ((a.fillStyle = "#ffffff"),
      a.fillRect(0, 0, 768, 576),
      (a.fillStyle = "#000000"),
      a.fill(new Path2D(e), "evenodd"),
      o.toDataURL("image/png"))
    : `data:image/svg+xml;utf8,${encodeURIComponent(`<svg viewBox="0 0 768 576" xmlns="http://www.w3.org/2000/svg"><rect width="768" height="576" fill="white"/><path d="${e}" fill="black" fill-rule="evenodd"/></svg>`)}`;
}
async function $1({ user: e, weight: o = 2 }) {
  let a = "q-visual-game-tangram",
    L = "Geometric Reasoning: Tangram Silhouette Dissection",
    l = (0, a4.default)(`${e.email}#${a}`),
    s = Math.floor(l() * ge.length),
    c = ge[s],
    t = await Xt({ email: e.email, target: c }),
    n = Z1`
    <div class="mb-3">
      <p class="lead">
        The <strong>Tangram</strong> is a classical geometric dissection puzzle. Seven flat polygons (five triangles,
        one square, and one parallelogram) must be arranged without overlap to form a specific silhouette.
      </p>

      <p>
        In computational geometry and spatial reasoning, decomposing an arbitrary polygon into a fixed inventory of
        rigid tiles is an NP-complete search problem. Your task is to find the exact arrangement of the seven pieces
        that forms your assigned silhouette.
      </p>

      <div class="card my-4 border-light-subtle shadow-sm">
        <div class="card-header py-2">
          <strong>Your Target Silhouette</strong>
        </div>
        <div class="card-body text-center py-4">
          <img
            src="${S1(c.svg_path)}"
            alt="Target Silhouette"
            class="img-fluid border rounded p-2"
            style="max-height: 280px; width: auto; object-fit: contain;"
          />
          <p class="text-muted small mt-2 mb-0">
            Reconstruct this shape using all seven pieces. You may build it anywhere on the board.
          </p>
        </div>
      </div>

      <h6>Instructions</h6>
      <ol>
        <li>
          Open the <a href="${"https://tds-network-games.sanand.workers.dev/tangram/"}" target="_blank" rel="noopener"><strong>Tangram Interactive Board</strong></a> in a new tab.
        </li>
        <li>
          Enter your registered email address (<code>${e.email}</code>) in the email field.
        </li>
        <li>
          Assemble the seven pieces to reproduce the target silhouette:
          <ul>
            <li><strong>Move:</strong> Drag any piece across the board (pieces snap to the grid).</li>
            <li><strong>Rotate:</strong> Double-click a piece or press <kbd>Q</kbd> / <kbd>E</kbd> to rotate by 45°.</li>
            <li><strong>Flip:</strong> Press <kbd>F</kbd> to reflect the parallelogram across its axis when needed.</li>
            <li><strong>Constraints:</strong> Pieces may share edges, but cannot overlap or cross the board boundary.</li>
            <li><strong>Translation invariance:</strong> Your solution is valid anywhere on the board.</li>
          </ul>
        </li>
        <li>
          When your reconstruction is complete, click <strong>Generate signed payload</strong>.
          The validator verifies your geometry and copies your signed completion token to the clipboard.
        </li>
        <li>
          Paste the token into the text area below and click <kbd>Check</kbd>.
        </li>
      </ol>

      <h6>Programmatic Interaction &amp; WebMCP</h6>
      <p>
        Because polygon dissection is an NP-complete search problem, the game board supports programmatic interaction
        via <strong>WebMCP</strong> (Model Context Protocol in the browser) exposed through
        <code>document.modelContext</code> / <code>navigator.modelContext</code>:
      </p>
      <ul>
        <li><code>tangram_get_state</code>: Query piece poses, snap rules (1/16-unit ticks), and collision validation.</li>
        <li><code>tangram_set_piece_pose</code> &amp; <code>tangram_apply_actions</code>: Move, rotate (45° steps), and flip pieces programmatically.</li>
        <li><code>tangram_attest</code>: Validate arrangement and generate the signed completion token for your email.</li>
      </ul>
      <p class="text-muted small">
        You may solve the puzzle manually on the interactive board or use an AI coding agent with WebMCP / browser automation to search and place pieces.
      </p>

      <div class="alert alert-secondary my-3" role="alert">
        <strong>Validation Requirements:</strong>
        <ul class="mb-0 small">
          <li>All seven standard Tangram pieces must be placed on the board without collision.</li>
          <li>The combined silhouette must geometrically match the assigned target.</li>
          <li>The completion token must be verified for your email address: <code>${e.email}</code>.</li>
        </ul>
      </div>

      <label for="${a}" class="form-label"><strong>Completion Token</strong></label>
      <textarea
        class="form-control font-monospace"
        id="${a}"
        name="${a}"
        rows="4"
        placeholder="eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6..."
        spellcheck="false"
        required
      ></textarea>
      <div class="form-text">Paste the signed verification payload generated by the game board.</div>
    </div>
  `;
  return { id: a, title: L, weight: o, question: n, answer: t };
}
var a4,
  o4 = u(() => {
    "use strict";
    a4 = R(I(), 1);
    e4();
    t4();
  });
import {
  html as D,
  render as l4,
} from "https://cdn.jsdelivr.net/npm/lit-html@3/lit-html.js";
function be(e, o) {
  let a = D`<ol class="mt-3">
    ${e.map(({ id: s, title: c, weight: t }) => D`<li><a href="#h${s}">${c}</a> (${t} ${t == 1 ? "mark" : "marks"})</li>`)}
  </ol>`,
    L = [
      D`<h1 class="display-6">Questions</h1>`,
      a,
      ...e.map(
        ({ id: s, title: c, weight: t, question: r, help: n }, i) => (
          n && !Array.isArray(n) && (n = [n]),
          D`
        <div class="card my-5" data-question="${s}" id="h${s}">
          <div class="card-header">
            <span class="badge text-bg-primary me-2">${i + 1}</span>
            ${c} (${t} ${t == 1 ? "mark" : "marks"})
          </div>
          ${n ? n.map((d) => D`<div class="card-body border-bottom">${d}</div>`) : ""}
          <div class="card-body">${r}</div>
          <div class="card-footer d-flex">
            <button type="button" class="btn btn-primary check-answer" data-question="${s}">Check</button>
          </div>
        </div>
      `
        ),
      ),
    ],
    l = { index: a, questions: L };
  for (let [s, c] of o) l4(l[c], s);
}
import { unsafeHTML as f4 } from "https://cdn.jsdelivr.net/npm/lit-html@3/directives/unsafe-html.js";
import { Marked as p4 } from "https://cdn.jsdelivr.net/npm/marked@13/+esm";
var ye = "https://tds.s-anand.net",
  ue = (e) => e && !e.match(/^(https?|mailto):/),
  h4 = new p4({
    renderer: {
      image(e, o, a) {
        return (
          ue(e) && (e = `${ye}/${e}`),
          `<img src="${e}" alt="${a}" ${o ? `title="${o}"` : ""} class="img-fluid" loading="lazy">`
        );
      },
      link(e, o, a) {
        return (
          ue(e) &&
            (e = `${ye}/${e.endsWith(".md") ? `#/${e.replace(/\.md$/, "")}` : e}`),
          `<a href="${e}" ${o ? `title="${o}"` : ""} target="_blank">${a}</a>`
        );
      },
    },
  }),
  k = (e) => f4(h4.parse(e));
async function T3(e, o) {
  let a = [
    {
      ...(await Promise.resolve()
        .then(() => (ve(), _e))
        .then((L) => L.default({ user: e, weight: 0.5 }))),
      help: k(`
### Ask AI

- [How do I install VS Code and make the code command available in my terminal?](#askai)
- [What does code -s show, and why is it useful when reporting a VS Code problem?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (we(), xe))
        .then((L) => L.default({ user: e, weight: 0.5 }))),
      help: k(`
### Ask AI

- [What's the difference between curl's response body and its response headers, and how do I see both?](#askai)
- [What do curl -i and curl -D- do differently?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (Ue(), je))
        .then((L) => L.default({ user: e, weight: 0.5 }))),
      help: k(`
### Ask AI

- [What does uv run --with do, and how is it different from installing a package with pip?](#askai)
- [How do I send a JSON POST request with HTTPie, and what does httpbin.org/post send back?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (Ge(), Ye))
        .then((L) => L.default({ user: e, weight: 0.5 }))),
      help: k(`
### Ask AI

- [What does npx do, and how is it different from installing a package globally with npm?](#askai)
- [Why pin a tool version like prettier@3.4.2, and how does sha256sum help compare outputs?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (Lt(), at))
        .then((L) => L.default({ user: e, weight: 1 }))),
      help: k(`
### Ask AI

- [What are the most common reasons JSON.parse throws, and how do I fix each one?](#askai)
- [How do I validate and pretty-print a JSON file from the command line?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (nt(), it))
        .then((L) => L.default({ user: e, weight: 1 }))),
      help: k(`
### Ask AI

- [In a typical CLI tool, what order do CLI flags, environment variables, and config files take precedence in?](#askai)
- [What is the 12-factor app config principle, and why does it matter?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (ht(), pt))
        .then((L) => L.default({ user: e, weight: 1 }))),
      help: k(`
### Ask AI

- [What's the difference between find -exec and a for loop over find's output in bash?](#askai)
- [How do I safely rename many files at once from the command line?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (_t(), ut))
        .then((L) => L.default({ user: e, weight: 1 }))),
      help: k(`
### Ask AI

- [How do I query a CSV file directly with DuckDB or sqlite3 without loading it into a database first?](#askai)
- [What's a reliable way to compute a sum or average grouped by a column from the command line?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (xt(), vt))
        .then((L) => L.default({ user: e, weight: 1 }))),
      help: k(`
### Ask AI

- [How do I publish a static HTML page with GitHub Pages from a repository?](#askai)
- [Why would GitHub Pages hide an email address in my HTML, and how do I stop it?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (kt(), wt))
        .then((L) => L.default({ user: e, weight: 1.5 }))),
      help: k(`
### Ask AI

- [How does git log -p differ from git log -S when searching history?](#askai)
- [What does git rebase actually do to commit history, and how do I read it with git reflog?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => ($t(), St))
        .then((L) => L.default({ user: e, weight: 1.5 }))),
      help: k(`
### Ask AI

- [What is a text embedding, and how does cosine similarity measure how close two embeddings are?](#askai)
- [How do I compute embeddings for a list of sentences and find the most similar one to a query?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (qt(), Tt))
        .then((L) => L.default({ user: e, weight: 1 }))),
      help: k(`
### Ask AI

- [Why do different LLMs give different answers to the same prompt?](#askai)
- [How can I make an LLM answer with a single word like Yes or No, reliably?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (Rt(), It))
        .then((L) => L.default({ user: e, weight: 2 }))),
      help: k(`
### Ask AI

- [How do I install a prebuilt Rust CLI binary from GitHub releases and put it on my PATH?](#askai)
- [What is an asciicast file and how do I replay a terminal recording?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (Pt(), Ot))
        .then((L) => L.default({ user: e, weight: 3 }))),
      help: k(`
### Ask AI

- [What is the Model Context Protocol (MCP), and what does a minimal MCP server need to implement?](#askai)
- [How do I read a custom HTTP request header inside an MCP tool call handler?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (Dt(), Nt))
        .then((L) => L.default({ user: e, weight: 4 }))),
      help: k(`
### Ask AI

- [How do I explore an undocumented JSON API and figure out how its pagination and data work?](#askai)
- [How can I use an LLM to turn a plain-English question into a structured query over my data?](#askai)
`),
    },
    {
      ...(await Promise.resolve()
        .then(() => (o4(), L4))
        .then((L) => L.default({ user: e, weight: 2 }))),
      help: k(`
### Ask AI

- [What algorithms (such as geometric backtracking or polygon decomposition) can solve a Tangram silhouette puzzle?](#askai)
- [How can I extract the contour of a silhouette image using Python and OpenCV or Pillow?](#askai)
- [How can an AI coding agent use WebMCP or browser automation to place and test Tangram pieces programmatically?](#askai)
- [Why is Tangram decomposition invariant to translation, and how do discrete grids simplify piece alignment?](#askai)
`),
    },
  ];
  return (be(a, o), Object.fromEntries(a.map(({ id: L, ...l }) => [L, l])));
}
export { T3 as questions };
