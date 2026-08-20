# 🔄 ROE — Re-Exam Comprehensive Solver Suite (T22026)

This module contains **12 solvers and standalone offline Node.js CLI scripts** for the TDS Re-Exam (ROE).

---

## 📋 Topics & Solver Index

| Question | Title | Type | Technical Focus |
| :---: | :--- | :---: | :--- |
| **Q1** | Incident Atlas Routing | `solved` (CLI Fallback) | Dijkstra shortest-path network routing with dynamic incident edge weights. |
| **Q2** | Unicode Ledger Forensics | `solved` (CLI Fallback) | Zero-width space detection and homoglyph normalization. |
| **Q3** | HTTP Cache Simulation | `solved` (CLI Fallback) | ETag validation, `Cache-Control: max-age` calculation, and 304 Not Modified parsing. |
| **Q4–Q6** | Cryptographic Transcriptions | `solved` | Byte-verified HMAC-SHA256 signatures and token verification. |
| **Q7–Q9** | Audio & Speech Forensics | `guide` | Spectral audio feature extraction and audio fingerprinting pre-flight tools. |
| **Q10–Q12** | Forensic Essay & Architectural Audits | `guide` | Security architecture reviews and pre-flight validation checklists. |

---

## 🛠️ Offline CLI Fallbacks
For heavy computational tasks (Q1–Q3), standalone offline Node.js CLI scripts are provided in [`offline-scripts/`](./offline-scripts/):
```bash
node solvers/T22026/roe/offline-scripts/q1-incident-atlas.js <email>
node solvers/T22026/roe/offline-scripts/q2-unicode-ledger.js <email>
node solvers/T22026/roe/offline-scripts/q3-http-cache.js <email>
```
