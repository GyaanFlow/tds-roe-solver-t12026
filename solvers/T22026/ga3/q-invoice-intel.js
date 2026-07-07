import { normalizeEmail } from './utils.js';

export const id = 'q-structured-extraction-server';
export const title = 'Q7: Invoice Intelligence — Structured Extraction API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const baseUrl = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/q7`;

  return {
    type: 'solved',
    answer: baseUrl,
    variant: `Invoice Intelligence API for ${norm}`,
    answerDisplay: [
      `### Q7: Invoice Intelligence API`,
      `Submit this base URL to the grader:`,
      `\`\`\`text`,
      baseUrl,
      `\`\`\``,
      `The grader will call \`POST ${baseUrl}/extract\` with schema.`,
      ``,
      `**Request format:**`,
      `\`\`\`json`,
      JSON.stringify({
        text: 'Invoice No: INV-2026-0041',
        schema: { type: 'object', properties: { invoice_no: { type: 'string' } } },
        document_id: 'doc0'
      }, null, 2),
      `\`\`\``,
    ].join('\n'),
    guide: [
      `## Q7: Invoice Intelligence — Implementation Guide`,
      ``,
      `Deploy an API that extracts structured fields from invoice text using a flexible schema.`,
      ``,
      `### API spec`,
      `- **Endpoint:** POST /extract (with schema/document_id in request)`,
      `- **Request:** { "text": "...", "schema": {...}, "document_id": "..." }`,
      `- **Response:** JSON matching the requested schema`,
      `- **CORS:** Must be enabled`,
      ``,
      `### Implementation`,
      `1. Use an LLM with the schema as a strict output format`,
      `2. Coerce types: currency strings → floats, dates → YYYY-MM-DD`,
      `3. Return null for missing fields`,
      `4. Deploy publicly`,
      ``,
      `### Pre-deployed API`,
      `Use the URL above. The grader sends hidden invoice texts with schemas.`,
    ].join('\n')
  };
}
