// Solver: Q10 — FastAPI Students CSV Service (Direct Solution)

export const id = 'q-fastapi';
export const title = 'Q10: FastAPI Students CSV Service';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q-fastapi/api';

  return {
    type: 'solved',
    variant: 'Pre-deployed Render API Service',
    answer: directUrl,
    answerDisplay: `### ⚠️ Backup Google Colab Solution Available\n\n**Q10, Q18, and Q25** are special cases involving user-specific environments, APIs, or dynamic data. These questions are not reliably solvable through the public solver interface for every user, so repeatedly trying them on the solver may waste your time.\n\nTo address this, we have prepared a dedicated Colab-based solution:\n\n📓 **Colab Link:** [Open Colab Workspace](https://colab.research.google.com/drive/1pVBlYAwBpQUqRhM9pUeX6Wt2CJWF6orH?usp=sharing)\n\n*Before running the Colab, edit Cell 1 and replace:* \n* \`YOUR_EMAIL\` with your IITM exam email\n* \`NGROK_TOKEN\` with your ngrok auth token\n\n---\n\n### 🔗 FastAPI Students CSV Service URL\n\nThis API serves student data from a CSV file and supports filtering by \`class\`.\nCopy and submit this URL to the exam portal:\n\`\`\`\n${directUrl}\n\`\`\`\n\n**API contract:** \`GET /api/students?class=1\` → returns \`{ "students": [{ "studentId": 1, "class": 1, ... }] }\``,
    guide: `### ⚠️ Backup Google Colab Solution Available\n\n**Q10, Q18, and Q25** are special cases involving user-specific environments, APIs, or dynamic data. These questions are not reliably solvable through the public solver interface for every user, so repeatedly trying them on the solver may waste your time.\n\nTo address this, we have prepared a dedicated Colab-based solution:\n\n📓 **Colab Link:** [Open Colab Workspace](https://colab.research.google.com/drive/1pVBlYAwBpQUqRhM9pUeX6Wt2CJWF6orH?usp=sharing)\n\n*Before running the Colab, edit Cell 1 and replace:* \n* \`YOUR_EMAIL\` with your IITM exam email\n* \`NGROK_TOKEN\` with your ngrok auth token\n\n---\n\n### 🚀 Submission Guide\n\n**Pre-deployed URL (recommended):**\n1. Copy the URL from the **Answer** box:\n   \`${directUrl}\`\n2. Paste it directly into the exam portal and click **Submit**.\n\n---\n\n### 🛠️ Self-Deploy Reference\n\n**Data format:** The CSV contains columns like \`studentId\`, \`class\`, and other student attributes.\n\n**API requirements:**\n- \`GET /api/students\` — returns all students as JSON.\n- \`GET /api/students?class=X\` — filters students by the \`class\` column.\n- Response format: \`{ "students": [ ... ] }\`\n\n**⚠️ CORS is required!** The exam validator makes cross-origin requests. Add this to your FastAPI app:\n\`\`\`python\nfrom fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])\n\`\`\`\n\n**Key dependencies:** \`fastapi\`, \`uvicorn\`, \`pandas\``,
  };
}
