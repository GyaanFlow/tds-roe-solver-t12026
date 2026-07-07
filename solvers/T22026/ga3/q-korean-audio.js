import { normalizeEmail } from './utils.js';

export const id = 'q-korean-audio-dataset-server';
export const title = 'Q6: Korean Audio Dataset API Verification';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const baseUrl = `https://tds-roe-solver-api-t12026.onrender.com/ga3/${norm}/${sessionToken}/q6`;

  return {
    type: 'solved',
    answer: baseUrl,
    variant: `Korean Audio API for ${norm}`,
    answerDisplay: [
      `### Q6: Korean Audio Dataset API`,
      `Submit this endpoint URL to the grader:`,
      `\`\`\`text`,
      baseUrl,
      `\`\`\``,
      `The grader will POST audio data directly to this URL.`,
      ``,
      `**Response format:**`,
      `\`\`\`json`,
      JSON.stringify({
        rows: 140,
        columns: ['Height', 'Weight'],
        mean: { Height: 170.0 },
        std: { Height: 10.0 },
        variance: { Height: 100.0 },
        min: {},
        max: {},
        median: {},
        mode: {},
        range: {},
        allowed_values: {},
        value_range: {},
        correlation: [{ x: 'Height', y: 'Weight', type: 'positive' }]
      }, null, 2),
      `\`\`\``,
    ].join('\n'),
    guide: [
      `## Q6: Korean Audio Dataset — Implementation Guide`,
      ``,
      `Deploy an API that transcribes Korean audio and extracts statistical summaries.`,
      ``,
      `### API spec`,
      `- **Endpoint:** POST /answer-audio`,
      `- **Accepts:** JSON ({ audio_base64 }), multipart, or raw binary`,
      `- **Response:** JSON with rows, columns, mean, std, variance, min, max, etc.`,
      `- **CORS:** Must be enabled`,
      ``,
      `### Implementation`,
      `1. Detect MIME type from magic bytes (RIFF=WAV, ID3=MP3)`,
      `2. Transcribe with Whisper or Gemini`,
      `3. Extract numeric columns and compute statistics`,
      `4. Use Python's statistics.pstdev() and statistics.pvariance() for population stats`,
      `5. Return all required fields (even if empty)`,
      ``,
      `### Pre-deployed API`,
      `Use the URL above. The grader sends hidden Korean audio files.`,
    ].join('\n')
  };
}
