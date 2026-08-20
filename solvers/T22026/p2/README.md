# 🎯 Project 2 (T22026) — Forensic Case Studies & Rubric Coach

This directory contains the **8 Enterprise Forensic Case Study Solvers** and the **Rubric Intelligence Terminal** for IIT Madras TDS Project 2 (May–Aug 2026).

---

## 📋 Case Studies & Official Exam Sequence

All 8 case studies are registered in exact 1-to-1 parity with the official live exam bundle ([`exam-tds-2026-05-p2.js`](https://exam.sanand.workers.dev/tds-2026-05-p2)):

| Index | Identifier | Title | Marks | Character Gate | Key Focus |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **Q1** | `q-case-dth-month-end-server` | **Case Study 1A — DTH Month-End Mystery** | 12.5 | `200 – 6,000` | Legitimate West dealer monthly batch upload (`DF-00020`/`$0.00` variance). |
| **Q2** | `q-case-dth-complaints-quiet-server` | **Case Study 1B — DTH Complaints Went Quiet** | 12.5 | `200 – 6,000` | NovaIVR/CareDesk auth failure dropouts, Farah Iqbal, 5 diagnostic questions. |
| **Q3** | `q-case-solar-smell-test-server` | **Case Study 2A — Solar Inverter Smell Test** | 12.5 | `150 – 3,000` | INV-17/03/22/09 self-clearing events, 0 MW generation impact, cheap SCADA check. |
| **Q4** | `q-case-solar-impact-claim-server` | **Case Study 2B — Solar 31.6% Impact Claim** | 12.5 | `200 – 6,000` | Cross-day weather confounding refutation; within-day ~17.5% counterfactual saving. |
| **Q5** | `q-case-customs-mismatch-server` | **Case Study 3A — Swiss Mismatch Control** | 12.5 | `150 – 3,000` | Tariff code 9021.10.00 vs 9021.10.90, canonical schema mapping, provisional clearance. |
| **Q6** | `q-case-consumer-qc-queue-server` | **Case Study 4A — QC Queue Smell Test** | 12.5 | `200 – 6,000` | 02:10:00 AM daily QCore database snapshot artifact, 48h LabTrack lag, 10-batch spot-check. |
| **Q7** | `q-case-customs-preference-server` | **Case Study 3B — Irish Preference Claim** | 12.5 | `200 – 6,000` | SUP-02 / P1006 / IE-2025-000411 missing 2025 LTSD; 0% MFN statutory rate duty neutrality. |
| **Q8** | `q-case-consumer-spares-search-server` | **Case Study 4B — Spare-Parts Search** | 12.5 | `200 – 6,000` | $123,565.26 inventory risk triage across Actionable now / Needs check / Not transferable. |

---

## ⚙️ Architecture & Engines

1. **Combinatorial Variations Engine (`variations-engine.js`)**:
   - Computes deterministic seeds using `FNV-1a` on `${email}:${caseId}`.
   - Synthesizes unique judgment phrasing, permutes evidence table row ordering, and selects distinct falsified hypotheses so every student receives a unique, plagiarism-free diagnostic note.
   - Guarantees 100% ground-truth fact preservation.

2. **Rubric Intelligence Terminal (`rubric-coach.js` & `case-specs.js`)**:
   - Interactive drafting terminal rendered directly in the workspace canvas.
   - Evaluates any student draft in real time against official Markdown skeletons, character boundaries, table formats, and entity citation density.
   - Provides live score meters (0–100%) and actionable guidance.

3. **Strict Access Lock (`lock-config.js`)**:
   - `locked: true` restricts programmatic solution generation to authorized student emails while serving external users with the interactive Rubric Coach.

---

## 🧪 Testing & Validation

Run the 800-iteration Monte Carlo evaluation stress test:
```bash
node scratch/stress-test-raw-generator.js
```
Expected Output: `Scored 100/100 (Flawless): 800 / 800 (100.00%)` across all seeds.
