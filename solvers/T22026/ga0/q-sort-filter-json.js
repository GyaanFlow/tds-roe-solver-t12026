// Solver: Q20 — Sort and Filter JSON Product Catalog (AUTO-SOLVED)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-sort-filter-json';
export const title = 'Q20: Sort and Filter JSON Catalog';

const CATEGORIES = ["Electronics", "Apparel", "Books", "Home", "Toys"];
const PREFIXES = ["Super", "Ultra", "Eco", "Smart", "Deluxe", "Mini", "Pro"];
const ITEMS = ["Widget", "Gadget", "Device", "Kit", "Set", "Tool", "Item"];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  
  const products = Array.from({ length: 100 }, () => ({
    category: CATEGORIES[Math.floor(n() * CATEGORIES.length)],
    price: Number((20 + n() * 180).toFixed(2)),
    name: `${PREFIXES[Math.floor(n() * PREFIXES.length)]} ${ITEMS[Math.floor(n() * ITEMS.length)]}`
  }));

  const threshold = Number((50 + n() * 100).toFixed(2));

  const filtered = products
    .filter(p => p.price >= threshold)
    .sort((a, b) => {
      const catComp = a.category.localeCompare(b.category);
      if (catComp !== 0) return catComp;
      const priceComp = b.price - a.price;
      if (priceComp !== 0) return priceComp;
      return a.name.localeCompare(b.name);
    });

  const result = JSON.stringify(filtered, null, 2);

  return {
    type: 'solved',
    variant: `Threshold: $${threshold.toFixed(2)}`,
    answer: result,
    answerDisplay: `### Filter Results\n\n- **Price Threshold:** \`$${threshold}\`\n- **Matched Items:** \`${filtered.length}\`\n\nCopy the JSON from the **Answer** box and paste it into the exam portal.`,
  };
}
