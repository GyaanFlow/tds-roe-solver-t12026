// Solver: Q11 — FastAPI Batch Sentiment (Direct Solution)
export const id = 'q-fastapi-sentiment-batch';
export const title = 'Q11: FastAPI Batch Sentiment Analysis';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q-fastapi-sentiment-batch/sentiment';

  return {
    type: 'solved',
    variant: 'Pre-deployed Render Sentiment API',
    answer: directUrl,
    answerDisplay: `### 🔗 Batch Sentiment Analysis API URL\n\nThis API performs sentiment classification on batches of text.\nCopy and submit this URL to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\`\n\n**API contract:** \`POST /sentiment\` with \`{ "texts": ["text1", "text2"] }\` → \`{ "sentiments": [{"text": "...", "sentiment": "POSITIVE|NEGATIVE|NEUTRAL", "score": 0.95}] }\``,
    guide: `### 🚀 Submission Guide\n\n**Pre-deployed URL (recommended):**\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal and click **Submit**.\n\n---\n\n### 🛠️ Sentiment API Specification\n\n**Endpoint:** \`POST /sentiment\`\n\n**Request body:**\n\`\`\`json\n{ "texts": ["I love this!", "Terrible experience"] }\n\`\`\`\n\n**Response format:**\n\`\`\`json\n{\n  "sentiments": [\n    { "text": "I love this!", "sentiment": "POSITIVE", "score": 0.95 },\n    { "text": "Terrible experience", "sentiment": "NEGATIVE", "score": 0.88 }\n  ]\n}\n\`\`\`\n\n**Sentiment labels:** \`POSITIVE\`, \`NEGATIVE\`, or \`NEUTRAL\`\n\n**CORS:** Must be enabled (allow all origins) for the exam validator to reach your endpoint.\n\n**Key dependencies:** \`fastapi\`, \`uvicorn\`, \`textblob\` or any sentiment library`,
  };
}
