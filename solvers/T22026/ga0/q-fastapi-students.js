// Solver: Q10 — FastAPI Students CSV Service (Direct Solution)
import { normalizeEmail } from './utils.js';

export const id = 'q-fastapi';
export const title = 'Q10: FastAPI Students CSV Service';

export async function solve(email) {
  const norm = normalizeEmail(email);
  
  const code = `
# /// script
# dependencies = [
#   "fastapi",
#   "uvicorn",
# ]
# ///
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import csv

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/api")
async def get_students(class_: list[str] = Query(default=None, alias="class")):
    csv_path = Path("q-fastapi.csv")
    if not csv_path.exists():
        csv_path = Path("q-fastapi.csv")

    with csv_path.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    students = [
        {"studentId": int(row["studentId"]), "class": row["class"]}
        for row in rows
    ]

    if class_:
        wanted = set(class_)
        students = [student for student in students if student["class"] in wanted]

    return {"students": students}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`.trim();

  return {
    type: 'solved',
    variant: 'FastAPI + Pandas CSV',
    answer: code,
    guide: `### 🚀 Implementation Guide

1. **Prerequisites**: Ensure you have Python installed. We recommend using **uv** for easy dependency management.
2. **Setup**:
   - Create a new directory and save the code from the **Answer** box as \`main.py\`.
   - Download \`q-fastapi.csv\` from the exam portal and place it in the same directory.
3. **Run**:
   - Using uv (recommended): \`uv run main.py\`
   - Using pip: \`pip install fastapi uvicorn && python main.py\`
4. **Tunnel**:
   - Since the exam validator needs to reach your local server, use **ngrok**:
     \`ngrok http 8000\`
5. **Submit**:
   - Copy the **Forwarding** URL from ngrok (e.g., \`https://abcd-123.ngrok-free.app\`).
   - Append \`/api\` to it: \`https://abcd-123.ngrok-free.app/api\`
   - Paste this URL into the exam portal and click **Submit**.`,
    answerDisplay: `### Quick Steps\n\n1. Save \`main.py\` and \`q-fastapi.csv\` in one folder.\n2. Run \`uv run main.py\`.\n3. Expose port 8000 via ngrok.\n4. Submit URL + \`/api\`.`,
  };
}
