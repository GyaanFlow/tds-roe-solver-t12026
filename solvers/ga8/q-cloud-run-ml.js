// Solver: GCP Cloud Run ML Classifier (Guide)
import { normalizeEmail } from './utils.js';

export const id = 'q-gcp-cloud-run-ml';
export const title = 'GCP Cloud Run: Deploy an ML Classifier';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  const sl = +(rng() * 3.4 + 4.5).toFixed(1);
  const sw = +(rng() * 2.4 + 2).toFixed(1);
  const pl = +(rng() * 5.5 + 1.2).toFixed(1);
  const pw = +(rng() * 2.2 + 0.2).toFixed(1);

  let prediction;
  if (pl <= 2.45) prediction = 0;
  else if (pw <= 1.75) prediction = 1;
  else prediction = 2;

  const classNames = { 0: 'setosa', 1: 'versicolor', 2: 'virginica' };

  return {
    type: 'guide',
    variant: `sl=${sl}, sw=${sw}, pl=${pl}, pw=${pw} → ${classNames[prediction]}`,
    answer: `Deploy an ML inference service with 3 endpoints:
• GET /health → {"status": "ok", "model": "iris-classifier"}
• GET /info → {"model_type": "DecisionTreeClassifier", "random_state": 42, "dataset": "iris", "classes": [...]}
• GET /predict?sl=${sl}&sw=${sw}&pl=${pl}&pw=${pw} → {"prediction": ${prediction}, "class_name": "${classNames[prediction]}", "confidence": 1.0}

app.py:
import numpy as np
from fastapi import FastAPI
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier

app = FastAPI()
iris = load_iris()
model = DecisionTreeClassifier(random_state=42)
model.fit(iris.data, iris.target)
CLASS_NAMES = ["setosa", "versicolor", "virginica"]

@app.get("/health")
async def health(): return {"status": "ok", "model": "iris-classifier"}

@app.get("/info")
async def info():
    return {"model_type": "DecisionTreeClassifier", "random_state": 42,
            "dataset": "iris", "classes": CLASS_NAMES}

@app.get("/predict")
async def predict(sl: float, sw: float, pl: float, pw: float):
    features = np.array([[sl, sw, pl, pw]])
    pred = int(model.predict(features)[0])
    proba = model.predict_proba(features)[0]
    return {"prediction": pred, "class_name": CLASS_NAMES[pred],
            "confidence": round(float(max(proba)), 4)}

requirements.txt: fastapi uvicorn scikit-learn numpy
Deploy to GCP Cloud Run (or AWS/Azure)
Submit: your deployment URL`,
    answerDisplay: `Features: sl=${sl}, sw=${sw}, pl=${pl}, pw=${pw}\nPrediction: ${prediction} (${classNames[prediction]})`
  };
}
