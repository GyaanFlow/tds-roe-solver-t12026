// Solver: HF Spaces Sentiment API (Guide)
export const id = 'q-hf-spaces-ml-api';
export const title = 'Hugging Face Spaces: ML Model API';

export async function solve(_email) {
  return {
    type: 'guide',
    variant: 'Deploy sentiment analysis API on HF Spaces',
    answer: `Deploy a sentiment analysis API to Hugging Face Spaces with:
• POST /predict accepting {"text": "..."} → {"label": "POSITIVE/NEGATIVE", "score": 0.99}

Test sentences the grader sends:
1. "I absolutely loved this movie, it was fantastic!" → POSITIVE
2. "This is the worst experience I've ever had." → NEGATIVE
3. "The weather is okay today." → either (2/3 must pass)

app.py (FastAPI):
from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline

app = FastAPI()
classifier = pipeline("sentiment-analysis")

class TextRequest(BaseModel):
    text: str

@app.post("/predict")
async def predict(request: TextRequest):
    result = classifier(request.text)[0]
    return {"label": result["label"], "score": result["score"]}

requirements.txt: fastapi uvicorn transformers torch

Deploy to HF Spaces (Docker SDK):
Dockerfile:
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]

Submit: https://username-repo.hf.space`,
    answerDisplay: 'Deploy sentiment API → HF Spaces URL'
  };
}
