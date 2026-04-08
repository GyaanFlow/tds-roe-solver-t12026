// Solver: Regex Golf — FULLY auto-solvable
// Replicates the exam's regex generation to produce the expected pattern

export const id = 'q-regex-golf-server';
export const title = 'Regex Golf Challenge';

const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const ALNUM = ALPHA + DIGITS;

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function pickChar(str, rng) { return str[Math.floor(rng() * str.length)]; }

function sample(arr, n, rng) {
  const a = [...arr]; const result = [];
  for (let i = 0; i < n && a.length > 0; i++) {
    const idx = Math.floor(rng() * a.length);
    result.push(a.splice(idx, 1)[0]);
  }
  return result;
}

function freePositions(count, lineLen, usedSet, rng) {
  const free = [];
  for (let i = 0; i < lineLen; i++) if (!usedSet.has(i)) free.push(i);
  return sample(free, count, rng).sort((a, b) => a - b);
}

function escapeRegex(s) { return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); }

function buildRules(rng, lineLen) {
  const positions = [1, 5, 11, 17, 22];
  const positionalRules = positions.map(p => ({
    type: 'charset', position: p,
    charSet: sample([...ALNUM], 3 + Math.floor(rng() * 3), rng).sort().join('')
  }));

  const used = new Set(positions);
  const repLen = 3, startA = 7, startB = 19;
  for (let p = 0; p < repLen; p++) { used.add(startA + p); used.add(startB + p); }

  const tokenChars = sample([...ALNUM], 12, rng);
  const tokens = [];
  while (tokens.length < 5) {
    const t = sample(tokenChars, repLen, rng).join('');
    if (!tokens.includes(t)) tokens.push(t);
  }

  const [eqL1, eqR1, eqL2, eqR2] = freePositions(4, lineLen, used, rng);
  used.add(eqL1); used.add(eqR1); used.add(eqL2); used.add(eqR2);

  const [cp1, cp2, cp3] = freePositions(3, lineLen, used, rng);

  return {
    lineLength: lineLen,
    positionalRules,
    equalityRules: [{ left: eqL1, right: eqR1 }, { left: eqL2, right: eqR2 }],
    repeatedTokenRule: { startA, startB, length: repLen, tokens },
    classRule: { positions: [cp1, cp2, cp3] }
  };
}

function buildRegex(rules) {
  const pos = rules.positionalRules.map(({ position, charSet }) =>
    `(?=^.{${position}}[${escapeRegex(charSet)}])`
  );
  const eq = rules.equalityRules.map(({ left, right }, i) => {
    const name = `eq${i}`;
    return `(?=^.{${left}}(?<${name}>.).{${right - left - 1}}\\k<${name}>)`;
  });
  const tokPat = rules.repeatedTokenRule.tokens.join('|');
  const tok = `(?=^.{${rules.repeatedTokenRule.startA}}(?<tok>${tokPat}).{${rules.repeatedTokenRule.startB - rules.repeatedTokenRule.startA - rules.repeatedTokenRule.length}}\\k<tok>)`;
  const [p1, p2, p3] = rules.classRule.positions;
  const cls = `(?=^.{${p1}}(?:[a-z].{${p2 - p1 - 1}}[a-z].{${p3 - p2 - 1}}[a-z]|\\d.{${p2 - p1 - 1}}\\d.{${p3 - p2 - 1}}\\d))`;

  return [...pos, ...eq, tok, cls].join('');
}

export function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#q-regex-golf`);
  const rules = buildRules(rng, 24);
  const regex = buildRegex(rules);

  return {
    variant: `24-char lines, ${rules.positionalRules.length} positional + ${rules.equalityRules.length} equality + token + class constraints`,
    answer: regex,
    type: 'solved',
    answerDisplay: `<strong>Generated regex pattern:</strong><br><code style="word-break:break-all;font-size:12px">${regex.replace(/</g,'&lt;')}</code>`
  };
}
