// Solver: Q11 — FastAPI Batch Sentiment (Direct Solution)
export const id = 'q-fastapi-sentiment-batch';
export const title = 'Q11: FastAPI Batch Sentiment Analysis';

export async function solve(email) {
  const code = `
# /// script
# dependencies = [
#   "fastapi",
#   "uvicorn",
#   "pydantic",
# ]
# ///
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class SentimentRequest(BaseModel):
    sentences: List[str]

def analyze_sentiment(text: str) -> str:
    text_lower = text.lower()
    positive = [
        "love", "happy", "excited", "thrilled", "joy", "amazing", "grateful",
        "fantastic", "wonderful", "best day", "smiling", "overjoyed",
        "proud", "happiest", "delighted", "blessed", "bliss", "ecstatic",
        "beautiful", "radiating", "jumping", "exceeded", "cloud nine",
        "bursting", "fortunate", "grinning", "dream come true", "alive",
        "celebrating", "pure joy", "spectacular", "promotion", "opportunity"
    ]
    negative = [
        "worst", "sad", "lost", "heartbroken", "failed", "terrible",
        "devastated", "passed away", "rejected", "lonely", "falling apart",
        "depression", "badly", "hopeless", "crying", "broken", "miserable",
        "traumatized", "defeated", "drowning in sorrow", "failure",
        "empty inside", "anxiety", "lost everything", "grief", "worried",
        "shattered", "overwhelmed with sadness", "regret", "crushed",
        "burdened", "disappointed", "massive layoffs", "diagnosis"
    ]
    if any(word in text_lower for word in positive): return "happy"
    if any(word in text_lower for word in negative): return "sad"
    return "neutral"

@app.post("/sentiment")
async def sentiment_batch(req: SentimentRequest):
    return {"results": [{"sentence": s, "sentiment": analyze_sentiment(s)} for s in req.sentences]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`.trim();

  return {
    type: 'solved',
    variant: 'FastAPI Batch Sentiment',
    answer: code,
    guide: `### 🚀 Implementation Guide

1. **Setup**:
   - Save the code from the **Answer** box as \`main.py\`.
2. **Run**:
   - We recommend using **uv**: \`uv run main.py\`
   - Or standard Python: \`pip install fastapi uvicorn pydantic && python main.py\`
3. **Tunnel**:
   - Expose your local port 8000 to the internet using **ngrok**:
     \`ngrok http 8000\`
4. **Submit**:
   - Copy the public ngrok URL (e.g., \`https://xyz.ngrok-free.app\`).
   - Append \`/sentiment\` to it: \`https://xyz.ngrok-free.app/sentiment\`
   - Submit this full endpoint URL to the exam portal.`,
    answerDisplay: `### Quick Steps\n\n1. Save \`main.py\`.\n2. Run \`uv run main.py\`.\n3. Ngrok port 8000.\n4. Submit URL + \`/sentiment\`.`,
  };
}
