import { normalizeEmail } from './utils.js';

export const id = 'q-dynamic-extract-server';
export const title = 'Q4: Dynamic Schema Structured Extraction API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const baseUrl = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/q4`;

  return {
    type: 'solved',
    answer: baseUrl,
    variant: `Dynamic Extractor for ${norm}`,
    answerDisplay: [
      `### Q4: Dynamic Schema Structured Extraction API`,
      `Submit this base URL to the grader:`,
      `\`\`\`text`,
      baseUrl,
      `\`\`\``,
      `The grader will call \`POST ${baseUrl}/dynamic-extract\``,
      ``,
      `**Request format:**`,
      `\`\`\`json`,
      JSON.stringify({
        text: 'Rahul bought 3 notebooks for Rs. 240 on 12 June 2026 from Alpha Store.',
        schema: { customer_name: 'string', quantity: 'integer', amount: 'float', purchase_date: 'date', store: 'string' }
      }, null, 2),
      `\`\`\``,
      `**Response format:**`,
      `\`\`\`json`,
      JSON.stringify({
        customer_name: 'Rahul',
        quantity: 3,
        amount: 240.0,
        purchase_date: '2026-06-12',
        store: 'Alpha Store'
      }, null, 2),
      `\`\`\``,
    ].join('\n'),
    guide: [
      `## Q4: Dynamic Schema Extraction — Implementation Guide`,
      ``,
      `Deploy an API that extracts structured data following a per-request schema.`,
      ``,
      `### API spec`,
      `- **Endpoint:** POST /dynamic-extract`,
      `- **Request:** { "text": "...", "schema": { "field_name": "type", ... } }`,
      `- **Supported types:** string, integer, float, boolean, date, array[string], array[integer]`,
      `- **Response:** JSON matching the schema exactly, with correct types`,
      `- **CORS:** Must be enabled`,
      ``,
      `### Implementation`,
      `1. Pass text + schema to an LLM with a strict type-coercion prompt`,
      `2. Validate and coerce types: integer → JSON number, date → YYYY-MM-DD, float → JSON number`,
      `3. Return ONLY the keys in the schema — no extra keys, no missing keys`,
      `4. Deploy publicly`,
      ``,
      `### Pre-deployed API`,
      `Use the URL above. The grader sends hidden (text, schema) pairs.`,
    ].join('\n')
  };
}
