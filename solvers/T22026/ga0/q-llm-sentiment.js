// Solver: Q15 — LLM Sentiment Analysis (Direct Solution)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-llm-sentiment-analysis';
export const title = 'Q15: LLM Sentiment Analysis (httpx)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const n = rng(`${norm}#${id}`);
  const text = Array.from({length: 50}, () => {
    const v = n();
    if (v < 0.8) return charset[Math.floor(v / 0.8 * charset.length)];
    if (v < 0.99) return " ";
    return "\n";
  }).join("").trim();

  const code = `
import httpx

url = "https://aipipe.org/openai/v1/chat/completions"
headers = {"Authorization": "Bearer DUMMY", "Content-Type": "application/json"}
payload = {
    "model": "gpt-4o-mini",
    "messages": [
        {"role": "system", "content": "Analyze sentiment: GOOD, BAD, or NEUTRAL."},
        {"role": "user", "content": ${JSON.stringify(text)}}
    ]
}
response = httpx.post(url, headers=headers, json=payload)
print(response.json())
`.trim();

  return {
    type: 'solved',
    variant: 'httpx mock request',
    answer: code,
    answerDisplay: `### Analysis\n\nSubmit the Python code from the **Answer** box. It includes the specific meaningless text assigned to your email: \`${text}\`.`,
  };
}
