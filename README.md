# 🌌 TDS Exam Portal — Elite Workspace

<p align="center">
  <img src="https://img.shields.io/badge/execution-local_only-fbbf24?style=for-the-badge&logo=javascript" alt="Execution" />
  <img src="https://img.shields.io/badge/dependencies-zero-10b981?style=for-the-badge&logo=node.js" alt="Dependencies" />
  <img src="https://img.shields.io/badge/deployment-vercel_ready-000000?style=for-the-badge&logo=vercel" alt="Vercel Ready" />
  <img src="https://img.shields.io/badge/architecture-deterministic_esm-3b82f6?style=for-the-badge&logo=dependency-weaver" alt="Architecture" />
  <img src="https://img.shields.io/badge/solvers-162+_active-8b5cf6?style=for-the-badge" alt="Active Solvers" />
  <img src="https://img.shields.io/badge/evaluator-rubric_coach_ai-ec4899?style=for-the-badge" alt="Rubric Coach AI" />
</p>

---

## 🌟 The Vision

**TDS Portal** is a production-grade, highly secure, browser-based sandbox environment engineered for the automated execution, verification, and forensic analysis of deterministic computational solvers. Built specifically as an advanced study companion for the **IIT Madras Tools in Data Science (TDS)** degree curriculum, the portal bridges the gap between intricate, multi-layered data science pipelines and reproducible, instantaneous client-side computations.

Constructed around a core philosophy of **visual excellence**, **academic transparency**, and **mathematical determinism**, the platform registers and orchestrates **162+ specialized solvers across 14 exam suites**, delivering sub-millisecond output vectors, interactive diagnostic notes, and automated rubric evaluations 100% client-side.

---

## 🏗️ Core Architectural Pillars

The workspace relies on four highly optimized client-side subsystems to maintain absolute security, speed, and mathematical rigor:

```mermaid
graph TD
    A["User Interface (Glassmorphism Dark IDE)"] -->|"Normalized Input (Email + Token)"| B("app.js (Core Orchestrator)")
    B -->|"Active Checkbox Guard"| C{"Academic Integrity Guard"}
    C -->|"Pass (Read Storage)"| D["Dynamic ESM Import"]
    C -->|"Fail (Block Action)"| A
    D -->|"Import Registry"| E["Term Registry Map (T1/T2)"]
    E -->|"Load Target Solver"| F["Shared runtime.js"]
    F -->|"Access Lock Check"| G{"lockConfig.locked?"}
    G -->|"Authorized / Open"| H("Seeded Variations Engine (FNV-1a / PRNG)")
    G -->|"Restricted / External"| I["Lock Screen + Rubric Coach Terminal"]
    H -->|"Deterministic Solved Vector"| J(("Deterministic Case Solution"))
    J -->|"Native DOM Mount"| K["Rendered Answer + Notes Panel"]
    I -->|"Native DOM Mount"| L["Interactive Rubric Coach Evaluator"]
    K --> A
    L --> A

    style A fill:#121214,stroke:#374151,stroke-width:2px,color:#fff
    style C fill:#451a03,stroke:#ea580c,stroke-width:2px,color:#fbbf24
    style G fill:#2e1065,stroke:#8b5cf6,stroke-width:2px,color:#c084fc
    style H fill:#064e3b,stroke:#059669,stroke-width:2px,color:#34d399
    style J fill:#1e1b4b,stroke:#4f46e5,stroke-width:2px,color:#818cf8
    style L fill:#831843,stroke:#db2777,stroke-width:2px,color:#f472b6
```

### 1. Seeded Mathematical Invariance
Total replicability across multiple devices is accomplished through two core functions:
*   **`normalizeEmail()`**: Standardizes user-supplied emails by trimming trailing whitespace and casting all characters to lowercase.
*   **`rng()` / `createRng()`**: Cryptographically stable, seeded pseudo-random number generator wrapped around `seedrandom.js` and fast `FNV-1a` 32-bit hashing. Using the standardized email as the entropy seed guarantees that every shuffle, parameter selection, variation synthesis, and index split is 100% identical for a given student across different browsers or systems.

### 2. Combinatorial Variations Engine
For open-ended qualitative case studies (Project 2), the system features a dynamic linguistic generator:
*   **Plagiarism Prevention**: Permutes sentence formulations, evidentiary row orderings, and hypothesis refutations uniquely per student seed (`${email}:${questionId}`).
*   **Fact Invariance**: Guarantees that despite lexical divergence, 100% of underlying ground-truth data points (batch IDs, file paths, monetary sums, timestamp anomalies, and confidence ratings) remain intact.

### 3. Multi-Term ESM Dynamic Registry
Rather than bloating runtime memory with pre-cached assets, the engine employs a dynamic lazy loading architecture:
*   **Decoupled Modules**: Solver files are encapsulated in modular ES6 classes that only load when an exam is selected.
*   **Structured Interface Contract**: Every resolver must adhere to a strict structural interface:
    ```typescript
    interface SolverResponse {
      id?: string;                 // Canonical question identifier
      title: string;               // Display title
      answer: string;              // The literal computed solution / raw text
      type: "solved" | "guide" | "bypass" | "error"; 
      variant: string;             // Variant identification metadata
      answerDisplay: string;       // Rich formatted Markdown preview
      guide?: string;              // Implementation walkthroughs for CLI steps
      rubricCoachHtml?: string;    // Interactive Rubric Coach terminal component
      debug?: Record<string, any>; // Computational trace logs & benchmark stats
    }
    ```

### 4. Interactive Rubric Intelligence Terminal
Every case study workspace embeds a dedicated **Rubric Coach & Draft Evaluator**:
*   **Live Heuristic Parsing**: Analyzes user-drafted Markdown in real-time, validating heading skeletons (`## Judgment`, `## Evidence Table`, etc.), character count gates (`[150–3,000]` or `[200–6,000]`), and evidence matrix columns (`| Claim | Source | Confidence |`).
*   **Citation Density Matrix**: Scans draft text for high-impact entities (e.g. `DF-00020`, `Farah Iqbal`, `INV-17`, `~17.5%`, `9021.10.00`, `SUP-02`, `02:10:00`, `$123,565.26`).
*   **Live Scorecard**: Generates an instant rubric score (0–100%) with categorized passed checks, unmet criteria, and strategic recommendations.

---

## 🔒 Academic Integrity & Access Security

To align fully with the **IIT Madras Student Code of Conduct**, the workspace implements strict multi-layer protections:

> [!WARNING]
> **MALPRACTICE ALERT**: This sandbox is strictly designed for local educational research, study, algorithm verification, and rubric calibration. Using this portal during active, live, proctored, or graded exams is a direct violation of university rules and constitutes academic dishonesty.

1. **Mandatory Integrity Disclaimer**: All workspace inputs and solver executions are blocked until the user explicitly acknowledges the honor code checkbox.
2. **Configurable Access Locking (`lock-config.js`)**: Granular per-exam security locks allow developers to restrict programmatic answer generation to authorized whitelist emails while providing external students with the interactive Rubric Coach to verify their own manual work.
3. **Stateful Local Persistence**: The acceptance vector is saved to browser `localStorage` as `academic_integrity_agreed === 'true'`.

---

## 🎯 Complete Exam Registry & Computational Engines

The registry includes Term 1 2026 (`T12026`), Term 2 2026 (`T22026`), and Term 3 2026 (`T32026`; official term dates TBD). T3 GA1 follows the official September 2026 question bundle and preserves all 16 question slots. Five deterministic questions have local answer generation; three API deployment questions are explicit handoffs to the separate API project; other live-personal tasks are shown as guides rather than guessed answers. T1/T2 solver suites and the dedicated 300-question T2 end-term practice workspace are available:

| Target Engine | Term | Scope | Technical Highlights & Capabilities |
| :--- | :--- | :--- | :--- |
| **GA1** | `T32026` | **Developer Tools (September 2026)** | **16 official question slots** with a pinned source snapshot. Seeded generators for Q3/Q4/Q5/Q7/Q8/Q11; **live API URLs for Q6/Q14** and an on-demand **Q15** form (private Ledger link → live URL, filled into the Answer box); a local **Q10** Git-history finder (upload/paste `history.fi`); **Q12** live-tested prompts plus an in-browser tester (your own aipipe.org token, never stored); guides for Q2/Q9/Q13/Q16 where the student must act. |
| **P1** | `T32026` | **Project 1 (October–November 2026)** | **4 interactive questions**, each with a tool that takes the student's own input and a beginner step-by-step guide: an AI Pipe usage **forecast** with exact LMSR trade maths, a 60-second **Human Exchange script builder**, an **Air Ink** phone-readiness check (no AI agents), and an exact **invoice calculator** with a request screen. Nothing uses the private launch links. |
| **End-Term Mock** | `T22026` | **May 2026 Full-Course Practice** | **300-question pool**: 175 MCQs, 25 MSQs, and 100 subjective prompts, presented in a dedicated quiz UI with section jumping, answer checking, a five-step subjective guide, detailed explanations, model answers, self-assessment rubrics, bookmarks, timer, and per-email local progress. Reference-only practice material; no score guarantee. |
| **P2** | `T22026` | **Project 2 — Forensic Case Studies** | **8 Case Studies (100 Marks)**: DTH Month-End Mystery (`DF-00020`/`$0.00`), DTH Complaints Quiet (NovaIVR/CareDesk dropouts, 5 diagnostic questions), Solar Inverter Smell Test (INV-17/0 MW telemetry), Solar 31.6% DSM Claim (within-day ~17.5% counterfactual decomposition), Swiss Customs Mismatch (tariff 9021.10.00 schema mapping), QC Queue Smell Test (02:10:00 AM QCore snapshot / 48h LabTrack latency), Irish Preference Claim (SUP-02 / P1006 / IE-2025-000411 2025 LTSD), and Spare-Parts Search ($123,565.26 inventory risk classification). Includes the full **Rubric Intelligence Terminal**. |
| **GA8** | `T22026` | **LLM Eval, Guardrails & MLOps** | **10 Solvers**: Automated RAG hallucination scanners, LLM benchmark pipelines, semantic guardrail firewalls, model drift analyzers, and Docker/Cloud Run deployment scripts. |
| **GA7** | `T22026` | Policy Gates & OSINT | **10 Solvers**: 5 hosted rule-engine APIs (release gates, LLM action firewall, Terraform policy, output sanitizer, OSINT corroboration); 4 seeded generators (Google-dork queries, WAF rule-order simulation, media forensics, GitHub Actions audit); Street View image intelligence. |
| **GA6** | `T22026` | Data Forensics & Automation | **10 Solvers**: Seeded prompt-robustness audit, shadow-DOM incident audit, DuckDB ledger reconciliation, politeness/robots.txt audit, client-side Canvas 2D tile reconstruction, Web Audio FFT burst decoding, and interactive SQL generators. |
| **GA5** | `T22026` | Agentic Systems & Guardrails | **11 Solvers**: MCP servers, A2A invoice protocols, budget guards, skill scanning, redteam/guardrail APIs, incident-response agents, mailroom triage, proration, and personal backup endpoints for Q9/Q10/Q11. |
| **GA4** | `T22026` | RAG & Retrieval Engineering | **13 Solvers**: Hybrid-search chunking, RRF fusion, HyDE, GraphRAG pipelines, late chunking, ANN recall/latency tuning, semantic caching, multimodal embedding calibration, and vector-rerank APIs. |
| **GA3** | `T22026` | System & API Architecture | **13 Solvers**: Automated video metadata curation, multimodal QA, fixed/dynamic schema extraction, cosine similarity mapping, browser-based Proof-of-Work nonce miner, Context Window Heist extractor, and asciinema pipelines. |
| **GA2** | `T22026` | API & Cloud | **10 Solvers**: Descriptive statistics with CORS, OAuth JWT verification, 12-factor config precedence, multi-container Redis stacks, POST analytics aggregation, Prometheus observability, and rate-limiting. |
| **GA1** | `T22026` | Developer Tools | **20 Solvers**: Git history analysis, VS Code multi-cursor edits, shell pipelines, SQL schemas, Markdown layout docs, HTTP POST requests, and asciinema recordings. |
| **GA0** | `T22026` | Intro to Data Science | **25 Solvers**: Standard exam solvers, detailed ngrok setups, FastAPI templates, CORS configurations, and forensic sandboxing guides. |
| **P1** | `T22026` | Project 1 | **4 Solvers**: Requirements-interview guide, seeded model-intelligence differentiation solver, and Colab AI-agent guides with shared service-account pools. |
| **ROE** | `T22026` | Re-Exam Suite | **12 Solvers**: Incident-atlas routing, Unicode ledger forensics, HTTP cache simulation with standalone offline Node.js CLI fallbacks, byte-verified hash/HMAC transcriptions, and audio/essay pre-flight checkers. |
| **ROE** | `T12026` | Re-exam Workflows | **15 Solvers**: Procedural maze pathfinding, regex golf parsing, and programmatic arithmetic validation. |
| **GA7 / GA8 / P2**| `T12026` | Data Viz, MLOps & Solana | **15 Solvers**: Midpoint diverging palette sampler, chartjunk analyzers, Docker verification hashes, Cloud Run triggers, and Solana devnet QR transaction repair + Discourse facts indexer. |

---

## 🏠 Home Page Solver Index, SEO & Dynamic Config

The home page lists every term, exam and question the portal supports, so students and search engines can see the whole project without running a solver.

*   **Source of truth:** `tds-config.json` (terms, their exams, the term label such as `"T3 2026 (Sep–Dec)"`) plus each exam's `registry.js`. Nothing about terms or years is hard-coded in the generator.
*   **Generator:** `node scripts/build-catalog.mjs` rewrites marker blocks in `index.html` (`CATALOG`, `SEO`, `TERMS`), the intro description (visible text, meta, Open Graph, Twitter and `tds-config.json`), and writes `catalog.json`, `sitemap.xml` and `robots.txt`. `--check` fails if anything is stale (line endings ignored); `check.mjs` runs it.
*   **Latest additions:** the newest work of the newest term (up to four cards), filled from the previous term when it has fewer than four. Term status (Current / Recent / Archive) and colours follow recency, not term ids.
*   **Dynamic UI pieces:** the **T1 · T2 · T3** pills under the title and the sidebar **Term** selector come from the config; new terms appear without edits. Exams missing from the label table in the script get a label derived from their id.
*   **Deploy:** `vercel.json` runs the generator on every build (`buildCommand`, falling back to the committed files if it fails), so a push is enough to refresh the index, sitemap and descriptions.
*   **Still manual for a new exam:** add it to `tds-config.json`, the exam menu (`TERM_EXAMS` in `app.js`) and create `solvers/<term>/<exam>/registry.js`.
*   **Wording rule:** generated copy must not contain the words "answer(s)" or "solution(s)" (IITM academic-integrity expectations); the generator throws if it does.
*   **Creator card:** photo (hover popup with GitHub and LinkedIn links), live GitHub follower and star counts (cached for an hour, hidden if the API is unreachable), and LinkedIn/GitHub/repo chips.
*   **Production:** https://tds-portal-solver.vercel.app (Vercel; `main` deploys to production, `dev` gets a preview).

---

## 🎨 Premium Glassmorphic UI & Workspace Experience

The user interface is crafted to mirror an elite dark-themed IDE workspace:

*   **Glassmorphic Terminal Panels**: High-performance CSS glassmorphism leveraging `backdrop-filter: blur(16px)`, reactive focus glows matching the active color theme, and sub-pixel typography.
*   **Answer-First Visual Flow**: Solved answers are displayed immediately in high-contrast monospaced blocks, while implementation guides collapse cleanly below.
*   **Instant Utilities**: One-click **Copy Answer**, **Copy Variant**, **Download as `.txt`**, and **Focus Mode** toggles.
*   **Rubric Draft Toolkit**: Fast clipboard ingestion (`📋 Paste`), template loading (`📑 Insert Skeleton`), draft resetting (`🧹 Clear`), and live character/word counters with reactive boundary indicators (**Green** for valid gates, **Red** for violations).
*   **Vibe Audio Studio**: Built-in, non-intrusive ambient audio player with customizable local track loading via IndexedDB, custom equalizers, and theme-matched glowing animations.

---

## 📂 Codebase Architecture Blueprint

```bash
tds-roe-solver/
├── 📂 .agents/                   # Agent behavioral profiles and configurations
├── 📂 solvers/
│   ├── 📂 T12026/                # Term 1 2026 Exam Registry (GA7, GA8, ROE, P2)
│   │   ├── 📂 ga7/               # Midpoint color generators & standard RNG hooks
│   │   ├── 📂 ga8/               # Docker verification & Cloud Run triggers
│   │   ├── 📂 roe/               # Maze pathfinding & regex golf solvers
│   │   └── 📂 p2/                # Solana devnet QR & Discourse facts indexer
│   ├── 📂 T22026/                # Term 2 2026 Exam Registry (GA0–GA8 + ROE + P1 + P2)
│   │   ├── 📂 ga0/ ... 📂 ga8/   # Modular deterministic solvers (GA0 through GA8)
│   │   ├── 📂 p1/                # Project 1 AI Agent & GCS setups
│   │   ├── 📂 p2/                # Project 2 Case Study Engine & Rubric Coach
│   │   │   ├── 📄 case-specs.js  # Case boundaries, headings & rubric criteria
│   │   │   ├── 📄 rubric-coach.js# Rubric Coach terminal & draft evaluator
│   │   │   ├── 📄 lock-config.js # Access control configuration & whitelist
│   │   │   ├── 📄 runtime.js     # Solver execution wrapper & diagnostics
│   │   │   ├── 📄 variations-engine.js # PRNG variation & table generator
│   │   │   ├── 📄 registry.js    # Ordered question registry (1-to-1 live exam match)
│   │   │   ├── 📄 q-case-1a.js   # Case 1A: DTH Month-End Mystery
│   │   │   ├── 📄 q-case-1b.js   # Case 1B: DTH Complaints Went Quiet
│   │   │   ├── 📄 q-case-2a.js   # Case 2A: Solar Inverter Smell Test
│   │   │   ├── 📄 q-case-2b.js   # Case 2B: Solar 31.6% Impact Claim
│   │   │   ├── 📄 q-case-3a.js   # Case 3A: Swiss Mismatch Control
│   │   │   ├── 📄 q-case-4a.js   # Case 4A: QC Queue Smell Test
│   │   │   ├── 📄 q-case-3b.js   # Case 3B: Irish Preference Claim
│   │   │   └── 📄 q-case-4b.js   # Case 4B: Spare-Parts Search
│   └── 📂 T32026/                # Term 3 (GA1 Developer Tools & GA2 API Engineering)
│       ├── 📂 ga1/               # GA1 16 official slots (Tangram SVG, Git forensics, Ledger)
│       └── 📂 ga2/               # GA2 15 official slots (CORS, OAuth, Observability, Ollama)
├── 📂 scratch/                   # Automated Monte Carlo stress test harnesses
├── 📂 scripts/
│   └── 📄 build-catalog.mjs      # Generates the home-page index, SEO files and term selector
├── 📄 app.js                     # Central UI state machine & event orchestrator
├── 📄 check.mjs                  # Comprehensive multi-term test suite (14 modules)
├── 📄 index.html                 # Main portal shell (contains generated CATALOG/SEO/TERMS blocks)
├── 📄 catalog.json               # Generated machine-readable solver index
├── 📄 sitemap.xml / robots.txt   # Generated SEO files
├── 📄 tds-config.json            # Terms, exams and intro text (source of truth for the home page)
├── 📄 vercel.json                # Build command (runs the generator) and cache headers
├── 📄 server.js                  # Traversal-safe lightweight local static server
├── 📄 style.css                  # Master stylesheets & Rubric Coach terminal styles
├── 📄 sw.js                      # Progressive Web App offline Service Worker
└── 📄 verify.html                # Universal Solver Verification Hub Dashboard
```

---

## 🚀 Quickstart & Developer Hub

### 1. Spinning Up the Portal
Run the lightweight ESM server with zero external dependencies:
```bash
npm install
npm run dev
```
🌐 **Local Endpoint**: `http://localhost:3000/`

### 2. Running the Full Test Suite
Verify that all 14 exam registries, deterministic outputs, character boundaries, and dynamic exports perform cleanly with 0 regressions:
```bash
npm run check
```

### 3. Running the Project 2 Rubric & Offline Evaluation Stress Test
Execute the 800-generation Monte Carlo simulation across 100 random student seeds:
```bash
node scratch/stress-test-raw-generator.js
```

### 4. Generating the T2 2026 End-Term Mock Bank
The official May 2026 course index is mapped into a reproducible practice bank with exactly 175 MCQs, 25 MSQs, and 100 subjective prompts:
```bash
npm run mock:check
npm run mock:generate
```
Generated artifacts are written to `mock-banks/T2-2026-End-Term-Mock.md`, `mock-banks/T2-2026-End-Term-Mock.json`, and the browser data module. Select **T2 2026 → End-Term Mock** in the portal to use the interactive quiz. Use **Jump to portion** to practice MCQ, MSQ, or subjective questions separately. Progress, drafts, bookmarks, and rubric checks are saved locally per email.

> **Reference-only notice:** this mock is original practice material, not an official IIT Madras paper, answer key, or prediction. It cannot guarantee a high end-term score and is intended only for revision and last-minute practice.

---

<p align="center">
  Crafted with ❤️ for the IITM TDS Research & Learning Community.
</p>
