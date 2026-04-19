// Solver: Deploy FastAPI Iris Classifier (Guide)
import { normalizeEmail } from './utils.js';

export const id = 'q-fastapi-iris-deploy';
export const title = 'Deploy a FastAPI Iris Classifier';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(norm + '#' + id);

  const sl = +(rng() * (7.9 - 4.5) + 4.5).toFixed(1);
  const sw = +(rng() * (4.4 - 2) + 2).toFixed(1);
  const pl = +(rng() * (6.7 - 1.2) + 1.2).toFixed(1);
  const pw = +(rng() * (2.4 - 0.2) + 0.2).toFixed(1);

  let prediction;
  if (pl <= 2.45) prediction = 0;
  else if (pw <= 1.75) prediction = 1;
  else prediction = 2;

  const classNames = ['setosa', 'versicolor', 'virginica'];

  return {
    type: 'guide',
    variant: `sl=${sl}, sw=${sw}, pl=${pl}, pw=${pw} → ${classNames[prediction]}`,
    answer: `Deploy a FastAPI app with these endpoints:
• GET /health → {"status": "ok"}
• GET /predict?sl=${sl}&sw=${sw}&pl=${pl}&pw=${pw} → {"prediction": ${prediction}, "class_name": "${classNames[prediction]}"}

Expected prediction: ${prediction} (${classNames[prediction]})

App code (app.py):
from fastapi import FastAPI
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
import numpy as np

app = FastAPI()
iris = load_iris()
model = DecisionTreeClassifier(random_state=42)
model.fit(iris.data, iris.target)
class_names = ["setosa", "versicolor", "virginica"]

@app.get("/health")
async def health(): return {"status": "ok"}

@app.get("/predict")
async def predict(sl: float, sw: float, pl: float, pw: float):
    features = np.array([[sl, sw, pl, pw]])
    pred = int(model.predict(features)[0])
    return {"prediction": pred, "class_name": class_names[pred]}

requirements.txt: fastapi uvicorn scikit-learn numpy

Deploy to: *.hf.space, *.vercel.app, or *.onrender.com
Submit: your deployed URL`,
    answerDisplay: `Features: sl=${sl}, sw=${sw}, pl=${pl}, pw=${pw}\nPrediction: ${prediction} (${classNames[prediction]})`
  };
}
