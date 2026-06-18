// Solver: Q8 — Git History Parent Commit Hash (programmatic)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-git-time-travel';
export const title = 'Q8: Git Time Travel: History Investigation';

// Helper functions for Git hashing
async function ne(l) {
  let u = typeof l === "string" ? new TextEncoder().encode(l) : l;
  let t = await crypto.subtle.digest("SHA-1", u);
  return Array.from(new Uint8Array(t)).map(r => r.toString(16).padStart(2, "0")).join("");
}

async function xe(l) {
  let u = new TextEncoder();
  let t = u.encode(l);
  let i = `blob ${t.length}\0`;
  let r = u.encode(i);
  let h = new Uint8Array(r.length + t.length);
  h.set(r, 0);
  h.set(t, r.length);
  let d = await ne(h);
  return { hash: d, content: l, size: t.length };
}

async function Ct(l) {
  let u = [...l].sort((n, a) => n.name < a.name ? -1 : n.name > a.name ? 1 : 0);
  let t = [];
  for (let n of u) {
    let s = `${n.mode || "100644"} ${n.name}\0`;
    t.push(new TextEncoder().encode(s));
    let o = new Uint8Array(20);
    for (let p = 0; p < 20; p++) {
      o[p] = parseInt(n.hash.substring(p * 2, p * 2 + 2), 16);
    }
    t.push(o);
  }
  let i = t.reduce((n, a) => n + a.length, 0);
  let r = new Uint8Array(i);
  let h = 0;
  for (let n of t) {
    r.set(n, h);
    h += n.length;
  }
  let d = new TextEncoder().encode(`tree ${r.length}\0`);
  let e = new Uint8Array(d.length + r.length);
  e.set(d, 0);
  e.set(r, d.length);
  let c = await ne(e);
  return { hash: c };
}

async function Et({ treeHash: l, parentHash: u, message: t, author: i, timestamp: r }) {
  let h = `tree ${l}\n`;
  if (u) {
    h += `parent ${u}\n`;
  }
  let d = Math.floor(r.getTime() / 1000);
  h += `author ${i.name} <${i.email}> ${d} +0000\n`;
  h += `committer ${i.name} <${i.email}> ${d} +0000\n`;
  h += `\n${t}\n`;
  let c = `commit ${h.length}\0` + h;
  let m = await ne(c);
  return { hash: m, content: h };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const t = "q-git-time-travel";
  const r = rng(`${norm}#${t}`);

  const At = [{first:"Alice",last:"Johnson"},{first:"Bob",last:"Smith"},{first:"Carol",last:"Davis"},{first:"David",last:"Miller"},{first:"Eve",last:"Wilson"},{first:"Frank",last:"Moore"},{first:"Grace",last:"Taylor"},{first:"Hank",last:"Anderson"},{first:"Ivy",last:"Thomas"},{first:"Jack",last:"Jackson"}];
  const nr = ["example.com","test.com","sample.org","demo.net"];
  const rr = ["Initial commit","Add configuration file","Update README","Fix typo in docs","Update timeout settings","Refactor config structure","Add logging configuration","Update API endpoint","Fix configuration bug","Bump version number","Add error handling config","Update database settings","Modify retry settings","Change cache duration","Update security settings","Add feature flags","Update rate limiting","Fix memory leak config","Add monitoring settings","Update connection pool","Refactor timeout logic","Add backup configuration","Update SSL settings","Fix race condition","Add health check config","Update worker threads","Modify batch size","Change log level","Update compression settings","Add circuit breaker","Fix deadlock issue","Update queue settings","Add throttling config","Update pagination","Fix null pointer config","Add validation rules","Update serialization","Modify buffer size","Change polling interval","Update proxy settings","Add failover config","Fix timeout overflow","Update auth settings","Add CORS configuration","Modify chunk size","Change heartbeat interval","Update session timeout","Add cleanup config","Fix memory settings","Update thread pool","Add graceful shutdown","Modify max connections","Change request timeout","Update response cache"];

  const _ = (arr, rngFn) => arr[Math.floor(rngFn() * arr.length)];
  const D = (rngFn, min, max) => Math.floor(rngFn() * (max - min + 1)) + min;
  const tt = (l, u) => {
    for (let j = l.length - 1; j > 0; j--) {
      let i = Math.floor(u() * (j + 1));
      [l[j], l[i]] = [l[i], l[j]];
    }
    return l;
  };

  const d = `${_(At, r).first} ${_(At, r).last}`;
  const e = `${d.toLowerCase().replace(/ /g, ".")}@${_(nr, r)}`;
  const c = D(r, 50, 60);
  const m = [30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360, 420, 480, 540, 600, 900, 1200];
  const n = _(m, r);
  const a = D(r, 10, c - 10);
  const s = [];
  const o = new Set();

  for (let g = 0; g < c; g++) {
    if (g === a) {
      s.push(n);
      o.add(n);
    } else {
      let E;
      do {
        E = _(m.filter(k => k !== n), r);
      } while (o.has(E) && o.size < m.length - 1);
      s.push(E);
      o.add(E);
    }
  }

  const p = [];
  const y = tt([...rr], r);
  for (let g = 0; g < c; g++) {
    let E;
    if (g === 0) {
      E = "Initial commit";
    } else if (g === a) {
      E = "Update timeout settings";
    } else {
      E = y[g % y.length] + ` (#${D(r, 100, 999)})`;
    }
    const k = new Date("2025-08-01T10:00:00Z").getTime();
    const w = g * D(r, 7200, 172800) * 1000;
    p.push({
      message: E,
      timeout: s[g],
      timestamp: new Date(k + w),
      retries: D(r, 1, 5),
      maxConnections: D(r, 10, 100),
      debug: r() > 0.7
    });
  }

  const v = [];
  let N = null;
  let T = null;
  const authorInfo = { name: d, email: e };

  for (let Y = 0; Y < p.length; Y++) {
    const B = p[Y];
    const Te = {
      appName: t,
      version: `${D(r, 1, 3)}.${Y}.${D(r, 0, 9)}`,
      environment: _(["development", "staging", "production"], r),
      settings: {
        timeout: B.timeout,
        retries: B.retries,
        maxConnections: B.maxConnections,
        debug: B.debug,
        logLevel: _(["debug", "info", "warn", "error"], r)
      },
      metadata: {
        lastUpdated: B.timestamp.toISOString(),
        updatedBy: authorInfo.name
      }
    };
    const Ae = JSON.stringify(Te, null, 2);
    const ke = (Y === 0 || r() > 0.8) ? `# ${t}\n\nVersion ${Te.version}\n\nA sample project for testing.\n\n## Configuration\n\nSee config.json for settings.\n` : T;

    const V = await xe(Ae);
    const G = await xe(ke);

    const Z = await Ct([
      { mode: "100644", name: "config.json", hash: V.hash },
      { mode: "100644", name: "README.md", hash: G.hash }
    ]);

    const W = await Et({
      treeHash: Z.hash,
      parentHash: N,
      message: B.message,
      author: authorInfo,
      timestamp: B.timestamp
    });

    v.push(W.hash);
    N = W.hash;
    T = ke;
  }

  const parentHash = v[a - 1].substring(0, 7);

  return {
    type: 'solved',
    answer: parentHash,
    variant: `Target timeout ${n} changed at commit ${a} (${norm})`,
    answerDisplay: [
      `### Q8: Git History — Parent Commit Hash`,
      `**Answer:** \`${parentHash}\` (parent of the commit that set timeout to \`${n}\`)`,
      ``,
      `**Details:**`,
      `- Commit index of change: ${a}`,
      `- Commit hash of change: \`${v[a].substring(0, 7)}\``,
      `- Parent commit hash: \`${parentHash}\``,
      `- Author: ${d} <${e}>`
    ].join('\n'),
    debug: {
      parentHash,
      targetCommitIndex: a,
      targetTimeout: n,
      commitsCount: c
    }
  };
}
