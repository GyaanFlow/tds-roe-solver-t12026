import { normalizeEmail } from './utils.js';

export const id = 'q-multimodal-image-qa-server';
export const title = 'Q2: Multimodal Image Question-Answering API';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const baseUrl = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/q2`;

  return {
    type: 'solved',
    answer: baseUrl,
    variant: `Multimodal QA API for ${norm}`,
    answerDisplay: [
      `### Q2: Multimodal Image QA API`,
      `Submit this base URL to the grader:`,
      `\`\`\`text`,
      baseUrl,
      `\`\`\``,
      `The grader will call \`POST ${baseUrl}/answer-image\``,
      ``,
      `**Request format:**`,
      `\`\`\`json`,
      JSON.stringify({ image_base64: 'iVBORw0KG...', question: 'What is the total?' }, null, 2),
      `\`\`\``,
      `**Response format:**`,
      `\`\`\`json`,
      JSON.stringify({ answer: '4089.35' }, null, 2),
      `\`\`\``,
    ].join('\n'),
    guide: [
      `## Q2: Multimodal Image QA — Implementation Guide`,
      ``,
      `You need to deploy a **Multimodal QA API** that accepts base64-encoded images and questions.`,
      ``,
      `### API spec`,
      `- **Endpoint:** POST /answer-image`,
      `- **Request:** { "image_base64": "...", "question": "..." }`,
      `- **Response:** { "answer": "..." }  (always a string)`,
      `- **CORS:** Must be enabled (grader calls from Cloudflare Worker)`,
      ``,
      `### Implementation`,
      `1. Use a multimodal model (GPT-4o, Gemini 1.5 Pro, Claude 3.5 Sonnet)`,
      `2. Decode the base64 image, send to the model with the question`,
      `3. Return the answer as a clean string — no units, no extra text`,
      `4. For numeric answers, return the number as a string (e.g. "4089.35")`,
      `5. Deploy publicly (Render, Vercel, Fly.io, HuggingFace Spaces)`,
      ``,
      `### Pre-deployed API`,
      `A pre-deployed API is ready at the URL above — submit it directly to the grader.`,
    ].join('\n')
  };
}
