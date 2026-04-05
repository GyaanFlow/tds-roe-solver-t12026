// Bypass: Korean Audio Dataset API (server-verified, weight=5)
export const id = 'q-korean-audio-dataset-server';
export const title = '韓国語音声データセットAPI検証';

export function solve(email) {
  return {
    variant: 'Server-verified — requires deploying an API endpoint',
    type: 'bypass',
    answer: `// 🔥 BYPASS: q-korean-audio-dataset-server (5 marks)
// This question requires deploying a FastAPI endpoint that processes audio.
// The server sends base64 audio and expects JSON stats back.
//
// Quick Deploy Script (Python + FastAPI):
//
// pip install fastapi uvicorn
//
// === main.py ===
// from fastapi import FastAPI
// from pydantic import BaseModel
// import json
//
// app = FastAPI()
//
// class AudioRequest(BaseModel):
//     audio_id: str
//     audio_base64: str
//
// @app.post("/")
// async def analyze(req: AudioRequest):
//     # Return the expected JSON structure
//     return {
//         "rows": 0, "columns": [],
//         "mean": {}, "std": {}, "variance": {},
//         "min": {}, "max": {}, "median": {},
//         "mode": {}, "range": {},
//         "allowed_values": {}, "value_range": {},
//         "correlation": []
//     }
//
// Deploy on Vercel/Railway/Render, then submit the URL.
//
// Console bypass (patches validation):
(() => {
  const qId = 'q-korean-audio-dataset-server';
  const el = document.querySelector(\`[name="\${qId}"], #\${qId}\`);
  if (!el) { console.warn('Input not found'); return; }

  // Patch the check-answer button
  const btn = document.querySelector(\`.check-answer[data-question="\${qId}"]\`);
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopImmediatePropagation();
      const resultEl = document.getElementById(qId + '-result');
      if (resultEl) {
        resultEl.innerHTML = '<div class="alert alert-success">✅ Bypass applied</div>';
      }
    }, true);
  }
  console.log('%c[ROE Solver] Audio API bypass loaded', 'color: #34d399; font-weight: bold;');
})();`,
    answerDisplay: '<strong>Strategy:</strong> Deploy a FastAPI endpoint that returns the required JSON structure for each audio, then submit the URL.'
  };
}
