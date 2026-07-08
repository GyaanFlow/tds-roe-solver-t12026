# GA3 API Server: Token & Setup Guide

This guide describes how to configure, test, and deploy the Python FastAPI backend server for the GA3 exam.

---

## 1. How to get your AIPipe Token

AIPipe (`aipipe.org`) acts as a secure, high-concurrency LLM gateway proxy. To obtain a token:

1. **Sign In:** Go to [https://aipipe.org](https://aipipe.org) and log in using your student credentials or OAuth.
2. **Generate Token:** Navigate to the **API Keys / Tokens** section of your dashboard.
3. **Create Key:** Click **Generate New Key / Token**, give it a name (e.g. `ga3-solver-api`), and copy the generated token string (usually starts with `ap_...` or a unique hash).
4. **Acquire Credits:** Ensure your account has sufficient query quota or free credits active to call models like `gpt-4o-mini` and `text-embedding-3-small`.

---

## 2. Environment Variables Configuration

The production script [ga3_production_api.py](file:///c:/Users/gaura/Downloads/tds-roe-solver/tds-roe-solver/scratch/ga3_production_api.py) relies on environment variables for security. Do **not** hardcode keys in the source file to prevent credentials from leaking.

Configure the following variables:

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `AIPIPE_TOKEN` | **Yes** | None | The API token you generated from `aipipe.org`. |
| `PORT` | No | `8000` | The port the server will bind to. (Render sets this automatically). |
| `OPENAI_API_URL` | No | `https://api.openai.com/v1` | If using AIPipe's OpenAI-compatible gateway, set this to: `https://aipipe.org/v1` or `https://api.openai.com/v1` (depending on router). |

---

## 3. Local Installation & Testing

To run the API server on your local machine before deploying:

1. **Create a virtual environment and install requirements:**
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install fastapi uvicorn httpx pydantic statistics
   ```
2. **Set your environment variables (PowerShell):**
   ```powershell
   $env:AIPIPE_TOKEN="your_actual_aipipe_token_here"
   $env:OPENAI_API_URL="https://aipipe.org/v1" # or the target gateway endpoint
   ```
3. **Launch the server:**
   ```bash
   python scratch/ga3_production_api.py
   ```
4. **Verify running state:** Open `http://127.0.0.1:8000/docs` in your browser to view the interactive Swagger API documentation.

---

## 4. Deploying to Render (`render.com`)

Render hosts web services directly from GitHub.

1. **Create Repository:** Create a new private repository on GitHub and commit your python file as `main.py`, along with a `requirements.txt` containing:
   ```text
   fastapi==0.111.0
   uvicorn==0.30.1
   httpx==0.27.0
   pydantic==2.7.4
   ```
2. **Create Render Service:** Go to [Render Dashboard](https://dashboard.render.com), click **New** -> **Web Service**, and connect your GitHub repository.
3. **Select Environment:** Select **Python** as the runtime.
4. **Command Config:**
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python main.py` or `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. **Set Environment Variables:** Go to the **Environment** tab on Render and add:
   - `AIPIPE_TOKEN` = `your_copied_token_from_aipipe`
   - `OPENAI_API_URL` = `https://aipipe.org/v1`
6. **Deploy:** Click **Deploy Web Service**. Render will build and assign you a public URL (e.g. `https://my-ga3-solver.onrender.com`).
