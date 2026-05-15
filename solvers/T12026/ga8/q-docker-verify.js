// Solver: Docker Multi-stage Build (Guide)
import { normalizeEmail } from './utils.js';

export const id = 'q-docker-hash-verify';
export const title = 'Docker Multi-stage Build: Verify Your Image';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const rng = new Math.seedrandom(`${norm}#${id}`);

  const estimatorOptions = [30, 40, 50, 60, 70, 80];
  const nEstimators = estimatorOptions[Math.floor(rng() * estimatorOptions.length)];
  const randomState = Math.floor(rng() * 90) + 10;
  const testSize = 0.2;

  return {
    type: 'guide',
    variant: `n_estimators=${nEstimators}, random_state=${randomState}, test_size=${testSize}`,
    answer: `Your unique parameters:
• n_estimators = ${nEstimators}
• random_state = ${randomState}
• test_size = ${testSize}

compute.py:
import hashlib
from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split

n_estimators = ${nEstimators}
random_state = ${randomState}
test_size = ${testSize}

data = load_breast_cancer()
X_train, X_test, y_train, y_test = train_test_split(
    data.data, data.target, test_size=test_size, random_state=random_state)

clf = GradientBoostingClassifier(n_estimators=n_estimators, random_state=random_state)
clf.fit(X_train, y_train)
acc = clf.score(X_test, y_test)
print(f"Accuracy: {acc:.4f}")

verify_input = f"n{n_estimators}:r{random_state}:acc{acc:.6f}"
verify = hashlib.sha256(verify_input.encode()).hexdigest()[:12]
print(f"Verify: {verify}")

Dockerfile (multi-stage):
FROM python:3.11-slim AS builder
WORKDIR /app
RUN pip install --no-cache-dir scikit-learn
COPY compute.py .
RUN python compute.py > output.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /app/output.txt .
CMD ["cat", "output.txt"]

Build & run:
docker build -t mlops-verify .
docker run --rm mlops-verify
docker images mlops-verify --format "{{.Size}}"

Submit: accuracy,verify_hash,image_size_mb (e.g. 0.9561,a1b2c3d4e5f6,125.0)`,
    answerDisplay: `Params: n_est=${nEstimators}, rs=${randomState}, ts=${testSize}\nRun compute.py to get accuracy & hash`
  };
}
