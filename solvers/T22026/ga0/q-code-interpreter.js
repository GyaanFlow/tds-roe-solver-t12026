// Solver: Q5 - Code Interpreter Service
import { normalizeEmail } from './utils.js';

export const id = 'q-code-interpreter-ai-analysis';
export const title = 'Q5: Code Interpreter Service';

export async function solve(email) {
  const norm = normalizeEmail(email);

  const code = `
# /// script
# dependencies = [
#   "fastapi",
#   "uvicorn",
# ]
# ///
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import StringIO
import contextlib
import sys
import traceback

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

class CodeRequest(BaseModel):
    code: str

def traceback_line_numbers(tb_text: str) -> list[int]:
    lines = []
    for line in tb_text.splitlines():
        line = line.strip()
        if line.startswith('File "<string>", line '):
            try:
                number = int(line.split('line ', 1)[1].split(',', 1)[0])
                lines.append(number)
            except Exception:
                pass
    # The official validator expects the actual failing source line, not every
    # stack frame involved in reaching it. In Python tracebacks this is the
    # deepest <string> frame.
    return [lines[-1]] if lines else []

@app.post("/code-interpreter")
async def code_interpreter(req: CodeRequest):
    stdout = StringIO()
    namespace = {}
    try:
        compiled = compile(req.code, "<string>", "exec")
        with contextlib.redirect_stdout(stdout):
            exec(compiled, namespace, namespace)
        return {"error": [], "result": stdout.getvalue()}
    except Exception:
        tb = traceback.format_exc()
        return {"error": traceback_line_numbers(tb), "result": tb}

@app.get("/")
async def health():
    return {"ok": True, "email": "${norm}", "endpoint": "/code-interpreter"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`.trim();

  return {
    type: 'guide',
    variant: 'FastAPI /code-interpreter endpoint',
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
   - Submit this base URL to the exam portal. The portal will append \`/code-interpreter\` to verify your service.`,
    answerDisplay: `### Quick Steps\n\n1. Save \`main.py\`.\n2. Run \`uv run main.py\`.\n3. Ngrok port 8000.\n4. Submit base URL.`,
  };
}
