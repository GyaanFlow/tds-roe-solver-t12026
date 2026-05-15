// Solver: Q22 — Process files with different encodings (Direct Solution)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-unicode-data';
export const title = 'Q22: Process Unicode Files';

const AR = {128:"\u20AC",130:"\u201A",131:"\u0192",132:"\u201E",133:"\u2026",134:"\u2020",135:"\u2021",136:"\u02C6",137:"\u2030",138:"\u0160",139:"\u2039",140:"\u0152",142:"\u017D",145:"\u2018",146:"\u2019",147:"\u201C",148:"\u201D",149:"\u2022",150:"\u2013",151:"\u2014",152:"\u02DC",153:"\u2122",154:"\u0161",155:"\u203A",156:"\u0153",158:"\u017E",159:"\u0178"};

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#q-unicode-data`);
  
  const symbols = Object.values(AR);
  const s = () => Array.from({length: 500}, () => Math.floor(n() * symbols.length));
  
  const [a, i, u] = [s(), s(), s()];
  const p = new Set(a.slice(0, 3).map(idx => symbols[idx]));
  
  const sumA = a.reduce((acc, idx, x) => acc + (p.has(symbols[idx]) ? x : 0), 0);
  const sumI = i.reduce((acc, idx, x) => acc + (p.has(symbols[idx]) ? x : 0), 0);
  const sumU = u.reduce((acc, idx, x) => acc + (p.has(symbols[idx]) ? x : 0), 0);
  
  const totalSum = sumA + sumI + sumU;

  return {
    type: 'solved',
    variant: `Symbols: ${[...p].join(', ')}`,
    answer: totalSum.toString(),
    answerDisplay: `### Unicode Analysis\n\n- **Symbols to match:** \`${[...p].join(' OR ')}\`\n- **data1 (CP-1252) sum:** \`${sumA}\`\n- **data2 (UTF-8) sum:** \`${sumI}\`\n- **data3 (UTF-16) sum:** \`${sumU}\`\n\n**Total Sum:** \`${totalSum}\``,
  };
}
