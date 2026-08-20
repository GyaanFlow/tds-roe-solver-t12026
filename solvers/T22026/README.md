# 🏛️ Term 2 2026 (T22026) Solver Suite

Welcome to the **T2 2026 Master Solver Suite** for IIT Madras Tools in Data Science (TDS). This directory encapsulates 127+ deterministic solvers, interactive visual tools, forensic extractors, and rubric evaluation engines across 12 distinct exam modules.

---

## 📊 Exam Suite Index & Coverage

| Module | Exam Title | Solvers | Engine Type | Key Capabilities |
| :--- | :--- | :---: | :--- | :--- |
| [`ga0/`](./ga0) | **GA0 — Warm-up Exam** | **25** | Deterministic & Hosted API | Python fundamentals, CSV forensics, ngrok tunneling, FastAPI endpoints, and Colab backup fallbacks. |
| [`ga1/`](./ga1) | **GA1 — Developer Tools** | **20** | Seeded Client Solve | Git history analysis, VS Code multi-cursor workflows, bash pipelines, SQL schemas, and Markdown tables. |
| [`ga2/`](./ga2) | **GA2 — API & Cloud Services** | **10** | Seeded Client Solve | CORS descriptive stats, OAuth JWT validation, 12-factor config precedence, Prometheus metrics, and Redis queues. |
| [`ga3/`](./ga3) | **GA3 — System & API Architecture** | **13** | Seeded & Proof-of-Work | Automated video metadata curation, multimodal QA, fixed/dynamic schema extraction, PoW nonce mining, and Context Heists. |
| [`ga4/`](./ga4) | **GA4 — RAG & Retrieval Engineering** | **13** | Algorithmic RAG Engine | Hybrid search, RRF rank fusion, HyDE expansion, GraphRAG queries, late chunking, semantic caching, and vector reranking. |
| [`ga5/`](./ga5) | **GA5 — Agentic Systems & Guardrails** | **11** | Agent Protocols & Hosted API | Model Context Protocol (MCP) servers, A2A invoice workflows, budget governors, incident response triage, and backup endpoints. |
| [`ga6/`](./ga6) | **GA6 — Data Forensics & Automation** | **10** | Client-Side CV/DSP & DuckDB | Upload-and-solve Canvas 2D image tile de-scrambling, Web Audio FFT modem burst decoding, and DuckDB SQL generators. |
| [`ga7/`](./ga7) | **GA7 — Policy Gates & OSINT** | **10** | Hosted Engine & Seeded Sim | LLM action firewalls, Terraform IAM policies, WAF rule-order simulation, GitHub Actions workflow audits, and OSINT. |
| [`ga8/`](./ga8) | **GA8 — LLM Evaluation & MLOps** | **10** | Evaluator & Benchmarks | Hallucination scanners, semantic guardrail benchmarks, model drift analyzers, and Cloud Run deploy templates. |
| [`p1/`](./p1) | **Project 1 — AI Agent Sandbox** | **5** | Seeded Client & Colab Guides | Model-intelligence differentiation solver, automated requirements interview, and shared GCS bucket workflows. |
| [`p2/`](./p2) | **Project 2 — Forensic Case Studies** | **8** | FNV-1a Variations & Rubric AI | 8 complete case studies (100 marks), combinatorial variations engine, and the **Rubric Intelligence Terminal**. |
| [`roe/`](./roe) | **ROE — Re-Exam Comprehensive** | **12** | Client-Side & Node CLI | Incident atlas routing, Unicode ledger forensics, HTTP cache simulation, HMAC transcriptions, and offline scripts. |

---

## 🏛️ Standard Module Anatomy

Every module follows a unified, hardened ESM architectural pattern:

```
solvers/T22026/<exam-id>/
├── 📄 registry.js        ← Ordered `solvers` array export (matches official live exam sequence)
├── 📄 runtime.js         ← wrapSolverModule: timeout protection, access control & diagnostics
├── 📄 utils.js           ← normalizeEmail(), FNV-1a hashing & mathematical helpers
├── 📄 lock-config.js     ← Access control configuration (whitelist + master lock switch)
├── 📄 q-*.js             ← Individual question solvers exporting { id, title, solve(email, token) }
└── 📄 README.md          ← Dedicated module documentation & rubric guidelines
```

---

## 🔒 Security & Academic Integrity

All modules enforce the **IIT Madras Student Code of Conduct**:
- Programmatic answer generation can be locked via `lock-config.js` while still providing interactive diagnostic tools and rubric coaching for student self-study.
- Solvers execute 100% client-side in the browser with zero external telemetric logging.
