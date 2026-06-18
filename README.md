# 🌌 TDS Exam Portal — Elite Workspace

![TDS Portal Banner](file:///C:/Users/gaura/.gemini/antigravity/brain/0ccffd48-bb4b-4185-a771-ef43fa52f090/tds_portal_banner_1778839734088.png)

<p align="center">
  <img src="https://img.shields.io/badge/execution-local_only-fbbf24?style=for-the-badge&logo=javascript" alt="Execution" />
  <img src="https://img.shields.io/badge/dependencies-zero-10b981?style=for-the-badge&logo=node.js" alt="Dependencies" />
  <img src="https://img.shields.io/badge/deployment-vercel_ready-000000?style=for-the-badge&logo=vercel" alt="Vercel Ready" />
  <img src="https://img.shields.io/badge/architecture-deterministic_esm-3b82f6?style=for-the-badge&logo=dependency-weaver" alt="Architecture" />
  <img src="https://img.shields.io/badge/ast_indexed-graphify-8b5cf6?style=for-the-badge" alt="AST Indexed" />
</p>

---

## 🌟 The Vision

**TDS Portal** is a production-grade, highly secure, browser-based sandbox environment designed for the automated execution of deterministic solver logic. Engineered specifically as a local study companion for the **IIT Madras Tools in Data Science (TDS)** curriculum, the portal bridges the gap between intricate, multi-layered data pipelines and highly reproducible, instant local computations.

Constructed around a core philosophy of **visual excellence** and **mathematical predictability**, the platform dynamically registers and orchestrates a suite of **90+ specialized solvers**, delivering near-instantaneous output vectors completely client-side.

---

## 🏗️ Core Architectural Pillars

The workspace relies on three highly optimized client-side pillars to maintain safety, speed, and complete environment isolation:

```mermaid
graph TD
    A["User Interface (Glassmorphism CSS)"] -->|"Normalized Input"| B("app.js (Core Orchestrator)")
    B -->|"Active Checkbox Verify"| C{"Academic Integrity Guard"}
    C -->|"Pass (Read Storage)"| D["Dynamic ESM Import"]
    C -->|"Fail (Block Action)"| A
    D -->|"Import Registry"| E["Term Registry Map"]
    E -->|"Load Solvers"| F["Shared runtime.js"]
    F -->|"Inject Normalized Email"| G("Seeded rng() Generator")
    G -->|"Deterministic Choices"| H(("Target Solver Module"))
    H -->|"Structural Output Contract"| B
    B -->|"High-Fidelity Render"| A

    style A fill:#121214,stroke:#374151,stroke-width:2px,color:#fff
    style C fill:#451a03,stroke:#ea580c,stroke-width:2px,color:#fbbf24
    style G fill:#064e3b,stroke:#059669,stroke-width:2px,color:#34d399
    style H fill:#1e1b4b,stroke:#4f46e5,stroke-width:2px,color:#818cf8
```

### 1. Seeded Mathematical Invariance
Total replicability across multiple devices is accomplished through two core functions:
*   **`normalizeEmail()`**: Standardizes user-supplied emails by trimming trailing spaces and casting all characters to lowercase.
*   **`rng()`**: A cryptographically stable, seeded pseudo-random number generator wrapped around `seedrandom.js`. Using the standardized email as the entropy seed guarantees that every shuffle, parameter selection, and index split is 100% identical for a given student across different browsers or systems.

### 2. Multi-Term ESM Dynamic Registry
Rather than bloating runtime memory with pre-cached assets, the engine employs a dynamic lazy loading architecture:
*   **Decoupled Modules**: Solver files are encapsulated in modular ES6 classes that only load when an exam is selected.
*   **Structured Interface Contract**: Every resolver must adhere to a strict structural interface:
    ```typescript
    interface SolverResponse {
      answer: string;              // The literal computed solution
      type: "solved" | "guide" | "bypass" | "error"; 
      variant: string;             // Variant identification metadata
      answerDisplay: string;       // Rich formatted preview text
      guide?: string;              // Implementation walkthroughs for CLI steps
      debug?: Record<string, any>; // Computational trace logs
    }
    ```

### 3. Graphify AST Indexing
The codebase is mapped inside an interactive knowledge graph (`graphify-out/`), tracing relationships between 545 nodes and 1,050 edges across 40 distinct architectural communities. Major high-degree hubs include `rng()`, `normalizeEmail()`, and `renderCanvas()`.

---

## 🔒 Academic Integrity & Malpractice Prevention Lock

To align fully with the **IIT Madras Student Code of Conduct**, the workspace implements a permanent, high-visibility interactive guard at the absolute top of the viewport:

> [!WARNING]
> **MALPRACTICE ALERT**: This sandbox is strictly designed for local educational research, study, and algorithm verification. Using this portal during active, live, proctored, or graded exams is a direct violation of university rules and constitutes academic dishonesty.

1. **High-Attention Glowing Notice**: Displays a beautiful warning banner featuring a custom amber/red pulse animation (`pulse-attention`) when the user has not accepted the terms.
2. **Interactive Block Checkbox**: All input elements (email text box, solver buttons, workspace actions) are strictly disabled until the disclaimer checkbox is actively ticked.
3. **Active Scroll & Shake Intercept**: If a bypass is attempted via devtools or DOM tampering, the core loop intercepts the invocation, triggers an error toast, scrolls the viewport to focus the notice, and applies a high-frequency CSS shake keyframe animation (`shake-attention`).
4. **Stateful Local Persistence**: The acceptance vector is saved to browser `localStorage` as `'agreeDisclaimerCheckbox' === 'true'`, preventing unnecessary friction for subsequent local study sessions.

---

## 🎯 Exam Registry & Computational Engines

The registry is split into Term 1 2026 (`T12026`) and Term 2 2026 (`T22026`), covering 70+ deterministic tasks:

| Target Engine | Term | Scope | Technical Highlights & Capabilities |
| :--- | :--- | :--- | :--- |
| **GA0** | `T22026` | Intro to Data Science | 25 standard exam solvers, detailed ngrok setups, FastAPI templates, CORS configurations, and forensic sandboxing guides. |
| **GA1** | `T22026` | Developer Tools | 20 standard developer tools solvers (Git history, VS Code multi-cursor edits, shell pipelines, SQL schemas, Markdown layout docs, HTTP POST requests, asciinema recordings). |
| **ROE** | `T12026` | Re-exam Workflows | Procedural maze pathfinding, regex golf parsing, and programmatic arithmetic validation. |
| **GA7** | `T12026` | Data Visualization | Midpoint-preserving diverging palette sampler, chartjunk analyzers, and inverse-engineered prompt structures. |
| **GA8** | `T12026` | Cloud & MLOps | Docker verification hashes, GCP Cloud Run environments, http trigger cloud functions, and an embedded console hook script. |
| **Project 2** | `T12026` | Devnet QR & Forum KB | **Q3 Solana devnet tracer** (SVG QR decoding, finder pattern repairs, RPC parses) and **Q4 Discourse facts indexer** (scanning 20,571 topics across 14 categories). |

---

## 🎨 Premium Glassmorphic UI & Styling System

The user interface is styled to resemble a premium dark-themed IDE workspace:

*   **Elite Backdrop Filters**: High-performance CSS glassmorphism leveraging `backdrop-filter: blur(12px)` overlays and harmonious custom HSL variables.
*   **Constant Credit Glows**: Developer social connections (GitHub & LinkedIn) feature persistent amber glows (`rgba(245, 158, 11, 0.4)`) by default. Hovering over them triggers a vibrant gold transformation (`#fbbf24`), custom drop-shadow intensity scaling, and a smooth `1.15x` scale lift.
*   **Actionable Utilities Only**: Cleaned header providing only essential high-utility actions (`Copy All`, `Print Cheat Sheet`, `Reset UI`).
*   **Zero-Crash Optional Chaining**: The core script `app.js` is fully guarded with ES6 optional chaining (`?.`) on all dynamic action elements to ensure zero DOM null pointer exceptions.
*   **Responsive Scrolling Drawer**: The sidebar adapts to mobile screens using a sliding bottom drawer layout with `overflow: visible` bounds to prevent trapped scrolls on short screens.
*   **Welcome Footer**: Features an elegant dashed border separator and soft hover triggers at the base of the landing page features grid.

---

## 📂 Codebase Directory Blueprint

```bash
tds-roe-solver/
├── 📂 .agents/                   # Agent behavioral profiles and configurations
├── 📂 solvers/
│   ├── 📂 T12026/                # Term 1 2026 Exam Registry (GA7, GA8, ROE, P2)
│   │   ├── 📂 ga7/
│   │   │   ├── 📄 runtime.js     # GA7 shared runtime and validation wrappers
│   │   │   └── 📄 utils.js       # Midpoint color generators & standard RNG hooks
│   │   └── 📂 p2/
│   │       ├── 📄 compact_facts.json # 12MB compressed Discourse dataset
│   │       └── 📄 q-qr-forensics.js   # QR Solana RPC transaction repair solver
│   └── 📂 T22026/                # Term 2 2026 Exam Registry (GA0 Suite)
├── 📄 AGENT_CONTEXT.md           # Deep context trace for subsequent AI engineers
├── 📄 app.js                     # Central UI state machine & event dispatcher
├── 📄 check.mjs                  # Offline smoke testing validation script
├── 📄 index.html                 # Main portal glassmorphic shell structure
├── 📄 server.js                  # Traversal-safe lightweight local static server
├── 📄 style.css                  # Master stylesheets containing keyframe animations
└── 📄 verify.html                # Universal Solver Verification Hub Dashboard
```

---

## 🚀 Quickstart & Developer Hub

### 1. Spinning Up the Portal
Run the lightweight ESM server with zero third-party dependencies:
```bash
npm install
npm run dev
```
🌐 **Local Endpoint**: `http://localhost:3000/`

### 2. Running Smoke Tests
Verify that all term registries, deterministic outputs, and dynamic exports perform cleanly without regressions:
```bash
npm run check
```

### 3. Syncing the Knowledge Graph
Ensure that any new modules or manual fixes are correctly indexed inside the codebase relationship graph:
```bash
python -m graphify update .
```

---

<p align="center">
  Crafted with ❤️ for the IITM TDS Research & Learning Community.
</p>
