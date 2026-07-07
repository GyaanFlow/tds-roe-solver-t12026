import { normalizeEmail } from './utils.js';

export const id = 'q-invoice-extract-server';
export const title = 'Q3: Fixed Schema Invoice Extraction API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const baseUrl = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/q3`;

  return {
    type: 'solved',
    answer: baseUrl,
    variant: `Fixed Invoice Extractor for ${norm}`,
    answerDisplay: [
      `### Q3: Fixed Schema Invoice Extraction API`,
      `Submit this base URL to the grader:`,
      `\`\`\`text`,
      baseUrl,
      `\`\`\``,
      `The grader will call \`POST ${baseUrl}/extract\``,
      ``,
      `**Response format (always all 6 keys):**`,
      `\`\`\`json`,
      JSON.stringify({
        invoice_no: 'INV-2026-0041',
        date: '2026-03-15',
        vendor: 'TechParts Pvt Ltd',
        amount: 2199.0,
        tax: 395.82,
        currency: 'INR'
      }, null, 2),
      `\`\`\``,
    ].join('\n'),
    guide: [
      `## Q3: Fixed Schema Invoice Extraction — Implementation Guide`,
      ``,
      `Deploy an API that extracts structured fields from raw invoice text.`,
      ``,
      `### API spec`,
      `- **Endpoint:** POST /extract`,
      `- **Request:** { "invoice_text": "..." }`,
      `- **Response:** Always return all 6 keys: invoice_no, date, vendor, amount, tax, currency`,
      `  - Use \`null\` for missing fields`,
      `  - date must be ISO format YYYY-MM-DD`,
      `  - amount = subtotal BEFORE tax; tax = tax amount only`,
      `- **CORS:** Must be enabled`,
      ``,
      `### Implementation`,
      `1. Pass raw invoice text to an LLM with a strict schema prompt`,
      `2. Coerce types: amount/tax → float, date → YYYY-MM-DD`,
      `3. Strip trailing dots from vendor names`,
      `4. Never omit keys — always return all 6`,
      `5. Deploy publicly`,
      ``,
      `### Pre-deployed API`,
      `Use the URL above. The grader sends hidden invoice texts to POST /extract.`,
    ].join('\n')
  };
}
