import seedrandom from 'seedrandom';

const args = process.argv.slice(2);
let question = '';
let email = '';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--question') {
    question = args[i + 1];
  } else if (args[i] === '--email') {
    email = args[i + 1];
  }
}

if (!question || !email) {
  console.error("Missing --question or --email arguments");
  process.exit(1);
}

const ne = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

if (question === 'q-fastapi') {
  const rng = seedrandom(`${email}#q-fastapi`);
  
  const oo = (t, o, e) => {
    let r = Array.from({length: t}, (l, s) => ({
      studentId: s + 1,
      class: `${Math.floor(e() * 12) + 1}${String.fromCharCode(65 + Math.floor(e() * 26))}`
    })),
    n = r.flatMap(l => Array.from({length: Math.floor(e() * o) + 1}, (s, a) => ({
      studentId: l.studentId,
      subject: `Subject #${a + 1}`
    })));
    return { students: r, subjects: n };
  };

  const { students } = oo(2000, 400, rng);
  console.log(JSON.stringify(students));

} else if (question === 'q-move-rename-files') {
  const rng = seedrandom(`${email}#q-move-rename-files`);
  
  function Oe(t) {
    return Array.from({length: Math.floor(t() * 10) + 1}, () => ne[Math.floor(t() * ne.length)]).join("");
  }

  const files = {};
  const s = new Set();
  for (let m = 0; m < 3; m++) {
    let p = Oe(rng).toLowerCase();
    for (let h = 0; h < 10; h++) {
      let g = `${Oe(rng)}.txt`.toLowerCase();
      if (!s.has(g)) {
        s.add(g);
        files[`${p}/${g}`] = "x";
      }
    }
  }
  console.log(JSON.stringify(files));

} else if (question === 'q-replace-across-files') {
  const rng = seedrandom(`${email}#q-replace-across-files`);
  
  function se(t, o) {
    return Array.from({length: t}, () => {
      let e = o();
      return e < .8 ? ne[Math.floor(e / .8 * ne.length)] : e < .99 ? " " : "\n";
    });
  }
  function $e(t, o, e, r) {
    for (let n = 0; n < e; n++) t.splice(Math.floor(r() * (t.length + 1)), 0, o);
    return t;
  }

  const files = {};
  for (let d = 0; d < 10; d++) {
    let m = se(10000, rng);
    $e(m, " IITM ", 10, rng);
    $e(m, " iitm ", 10, rng);
    $e(m, " IITm ", 10, rng);
    let p = m.join("").split("\n").map(h => h.trim()).join("\n") + "\n";
    files[`file${d}.txt`] = p;
  }
  console.log(JSON.stringify(files));

} else if (question === 'q-vercel-latency') {
  const rng = seedrandom(`${email}#q-vercel-latency`);
  
  const pr = ["apac", "emea", "amer"];
  const mr = ["checkout", "catalog", "analytics", "recommendations", "payments", "support"];

  function Kt(t, o, e) {
    let r = [...t];
    for (let n = r.length - 1; n > 0; n--) {
      let l = Math.floor(e() * (n + 1));
      [r[n], r[l]] = [r[l], r[n]];
    }
    return r.slice(0, o);
  }

  const telemetry = [];
  for (let d of pr) {
    for (let m = 0; m < 12; m++) {
      let p = mr[Math.floor(rng() * mr.length)];
      let h = 110 + rng() * 120;
      let g = (rng() - 0.5) * 25;
      let f = +(h + g).toFixed(2);
      let y = +(97.1 + rng() * 2.4).toFixed(3);
      telemetry.push({
        region: d,
        service: p,
        latency_ms: f,
        uptime_pct: y,
        timestamp: 20250301 + m
      });
    }
  }

  const params = {
    regions: Kt(pr, 2, rng),
    threshold_ms: Math.round(150 + rng() * 40)
  };

  console.log(JSON.stringify({ telemetry, params }));
} else {
  console.error("Unknown question ID:", question);
  process.exit(1);
}
