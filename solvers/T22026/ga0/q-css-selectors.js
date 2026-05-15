// Solver: Q8 — CSS: Featured-Sale Discount Sum (AUTO-SOLVED)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-css-selectors-sum';
export const title = 'Q8: CSS Selector Discount Sum';

const CLASSES = ["featured sale", "sale featured", "sale", "featured", "on-sale", "featured new", "sale vip", "featured sale vip", "vip sale", "new"];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  
  const count = 20;
  const items = Array.from({ length: count }, () => ({
    classes: CLASSES[Math.floor(n() * CLASSES.length)],
    discount: Math.floor(n() * 46) + 5
  }));

  const filtered = items.filter(item => {
    const cls = item.classes.split(/\s+/);
    return cls.includes("featured") && cls.includes("sale");
  });
  
  const sum = filtered.reduce((acc, item) => acc + item.discount, 0);

  return {
    type: 'solved',
    variant: `Filtered .featured.sale sum`,
    answer: sum.toString(),
    answerDisplay: `### Calculation Details\n\n- **Total Sum:** \`${sum}\`\n\n**Matching Items:**\n${filtered.map(item => `- [${item.classes}] discount=${item.discount}`).join('\n')}`,
  };
}
