# T2 2026 Solvers

Covers **Term 2 2026 (May–Sep)** exams for IIT Madras TDS. All suites below are implemented and registered.

## Status: ✅ Implemented

| Folder | Exam | Solvers | Notes |
|---|---|---|---|
| `ga0/` | GA0 — Warm-up Exam | 25 | Standard data science basics, shell scripting, hosted-API endpoints for several questions |
| `ga1/` | GA1 — Developer Tools | 20 | Locked-by-default academic-integrity gate via `lock-config.js` (whitelist bypass) |
| `ga2/` | GA2 — API Engineering & Cloud Services | 10 | Locked by default |
| `ga3/` | GA3 — System & API Architecture | 13 | Locked by default; hardened against the official May 2026 bundle |
| `ga4/` | GA4 — RAG & Retrieval Engineering | 13 | Hybrid search, RRF, HyDE, GraphRAG, ANN tuning, semantic caching, and more |
| `ga5/` | GA5 — Agentic Systems & Guardrails | 11 | Q9/Q10/Q11 are token-gated hosted-API solvers with personal backup endpoints |
| `ga6/` | GA6 — Data Forensics & Automation | 10 | Q1/Q10 are upload-and-solve (client-side CV/DSP); Q3/Q7/Q8 are `guide`-type |
| `p1/` | Project 1 | 5 | Requirements interview, model-intelligence diff (real solve), GCS bucket setup + dataset upload guides |

Each folder follows the same pattern:

```
solvers/T22026/<exam>/
├── registry.js       ← ordered `solvers` array export
├── runtime.js         ← wrapSolverModule: timeout/lock/shape-validation wrapper
├── utils.js           ← normalizeEmail() and shared helpers
├── lock-config.js     ← (locked exams only) whitelist + master lock switch
└── q-*.js             ← one file per question, each exporting { id, title, solve(email, sessionToken) }
```

See the root [`AGENT_CONTEXT.md`](../../AGENT_CONTEXT.md) for detailed per-exam design notes (GA0, GA1, GA3, GA5, GA6, P1 all have dedicated sections), and [`README.md`](../../README.md) for the full project overview.

To add a new exam folder for a future term, follow this same structure — a `registry.js` exporting an ordered `solvers` array is the only hard requirement `app.js` depends on.
