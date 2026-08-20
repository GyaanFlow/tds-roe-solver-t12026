# TDS May 2026 (T2-2026) Project 2 — Comprehensive Master Guide & Analytical Reference

This guide provides an exhaustive analytical breakdown, mathematical models, evidence tables, and defensible conclusions for all 8 Case Studies in **TDS May 2026 Project 2**.

---

## Universal Strategy & Grading Mechanics

1. **Length Gate & Instant Participation Marks**:
   - Every question has an accepted character range (either `150–3000` or `200–6000`).
   - Clicking `Check` sends a payload to `/backendVerify` and immediately awards **2.5 marks** for passing the format/length validation.
2. **Offline Evaluation (10.0 Marks per Case)**:
   - Evaluated by human evaluators based on **evidence quality, traceability, calibrated confidence, and falsifiability**.
   - You are scored on the rigor and transparency of your reasoning, not on guessing a hidden single word.
   - An evidence-backed *"insufficient evidence"* or *"partial support"* conclusion scores **higher** than an uncalibrated overconfident claim.
3. **Skeleton Fidelity**:
   - Each answer must strictly match the exact Markdown headings pre-populated in the exam interface.

---

## Summary Matrix of the 8 Case Studies

| # | Question ID | Case Study | Char Limit | Recommended Verdict | Load-Bearing Numerical / Fact Finding |
|---|---|---|---|---|---|
| **1A** | `q-case-dth-month-end-server` | **DTH Month-End Mystery** | 200–6000 | **No Material Issue** | 31-May batch is standard annual renewal run (`BAT-2025-05-31-W`); reconciles to ₹0.00 discrepancy. |
| **1B** | `q-case-dth-complaints-quiet-server` | **DTH Complaints Went Quiet** | 200–6000 | **Do Not Expand Nationally** | Ticket decline is caused by pre-auth IVR customer drop-off (abandonment), not true self-service resolution. Person to question: **Farah Iqbal**. |
| **2A** | `q-case-solar-smell-test-server` | **Solar Inverter Smell Test** | 150–3000 | **Do Not Escalate** | Export contains 4 benign events; all have `impact_mw = 0` and `cleared = yes`. |
| **2B** | `q-case-solar-impact-claim-server` | **Solar 31.6% Impact Claim** | 200–6000 | **Claim Overstated (Report ~17.5%)** | 31.6% is a naive cross-day comparison. Clean same-day counterfactual (holding actual generation fixed) yields **~17.5%** savings over 12 revised blocks. |
| **3A** | `q-case-customs-mismatch-server` | **Swiss Mismatch Control** | 150–3000 | **Do Not Escalate** | Declared `9021.10.00` is the authentic Swiss national tariff code; matches EU `9021.10.90` at the standard 6-digit WCO HS level (`9021.10`). |
| **3B** | `q-case-customs-preference-server` | **Irish Preference Claim** | 200–6000 | **Not Supported (Hold & Request LTSD)** | Supplier declaration on file expired on 2024-12-31 (prior to 2025 entry date). Hold shipment for valid Long-Term Supplier Declaration; not intentional fraud. |
| **4A** | `q-case-consumer-qc-queue-server` | **QC Queue Smell Test** | 200–6000 | **Smells Wrong — Hold Dashboard** | 70.6% of release timestamps clamp to `02:10:00` daily batch snapshot run. Measures ETL schedule latency rather than physical QC testing time. |
| **4B** | `q-case-consumer-spares-search-server` | **Spare-Parts Search** | 200–6000 | **$166,495.60 Total Value** | 24 open requests: **8 Actionable Now**, **12 Needs Engineering Check**, **4 Not Transferable** (restricted critical-line servo motors). |

---

## Detailed Analytical Solutions

### Case 1A: SkyWave Direct · DTH Month-End Mystery
- **Heading Skeleton**:
  ```markdown
  ## Judgment
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypotheses
  ## Unknowns and Decision-Changing Evidence
  ## Safe Next Action
  ```
- **Key Evidence**:
  - `recharges.csv`: 1,420 West-region annual recharge transactions posted on 31 May.
  - `dealer_import_log.csv`: Batch `BAT-2025-05-31-W` imported cleanly with status `SUCCESS` and variance `0.00`.
  - `email-dealer-reconciliation.eml`: Operations confirms dealer credit settlements and automated cycle renewals are aggregated and posted on the final calendar day of each month.
- **Rejected Hypotheses**:
  - *Revenue Inflation / Fraud*: Rejected because all transactions map to active subscriber IDs with verified gateway settlement references and zero balance mismatch.
  - *Duplicate Ingestion*: Rejected because transaction unique keys show no duplicate hash collisions.

---

### Case 1B: SkyWave Direct · DTH Complaints Went Quiet
- **Heading Skeleton**:
  ```markdown
  ## Judgment
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypotheses and Unknowns
  ## Safe Next Action
  ## Person and Five Questions
  1.
  2.
  3.
  4.
  5.
  ```
- **Key Evidence**:
  - `ivr_interactions.jsonl`: Sharp spike in unauthenticated user disconnects at step 2 (menu navigation loop).
  - `tickets.csv`: Reduced ticket volume directly mirrors drop in callers reaching human queue.
  - `service_events.csv`: Outage frequency remained constant, proving customer issues did not decrease.
- **Person to Question**: **Farah Iqbal** (Customer Care Operations)
- **5 Diagnostic Questions**:
  1. What is the step-by-step drop-off and call abandonment rate at each IVR prompt in the NovaIVR pilot vs legacy queue?
  2. How many repeat calls occur from the same mobile number within 24–48 hours after an abandoned IVR interaction?
  3. Are customers hanging up before completing SMS/OTP authentication due to telephony timeouts or latency?
  4. What percentage of unassisted disconnects resulted in churn or social media escalation during the pilot window?
  5. What fallback mechanism exists for non-tech-savvy subscribers who cannot navigate the automated self-service tree?

---

### Case 2A: ARPL Solar · Inverter Event Smell Test
- **Heading Skeleton**:
  ```markdown
  ## Prioritized Findings
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypothesis
  ## Conclusion
  ```
- **Key Evidence**:
  - `inverter_events.csv`: Exactly 4 rows exported.
  - `impact_mw`: All 0.00 MW across all 4 events.
  - `cleared`: `yes` across all events; durations are momentary self-clearing transient fluctuations.
- **Rejected Hypothesis**:
  - *Grid Disconnection / Component Burnout*: Rejected by 0 MW generation loss and immediate self-reset logs.
- **Conclusion**:
  - Do not escalate to engineering plant shutdown. Run a cheap data completeness check to confirm export filter did not truncate records.

---

### Case 2B: ARPL Solar · Solar 31.6% Impact Claim
- **Heading Skeleton**:
  ```markdown
  ## Judgment
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypotheses and Causal Limits
  ## Next Measurement
  ## Recommendation
  ```
- **Mathematical Dissection**:
  - **Asserted Claim**: 31.6% DSM (Deviation Settlement Mechanism) penalty reduction.
  - **Data Reality**: The 31.6% figure was calculated by naively comparing 29 May total DSM penalty against 28 May total DSM penalty (a confounded cross-day comparison under different weather/cloud covers).
  - **Counterfactual True Impact**: Re-computing 29 May penalty with `base_schedule` vs `revised_schedule` on identical actual generation gives **~17.5%** true savings across the 12 wind-stow pilot blocks.
- **Recommendation**:
  - Adopt the wind-stow model for high-wind conditions but document the true ~17.5% block-level impact rather than the inflated 31.6% claim.

---

### Case 3A: Asterion Ortho · Swiss Mismatch Control
- **Heading Skeleton**:
  ```markdown
  ## Decision
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypotheses
  ## Missing Evidence
  ## Safe Next Action
  ```
- **Key Findings**:
  - Automated scanner flagged declared tariff code `9021.10.00` as mismatching ERP/Helios master code `9021.10.90`.
  - `country_tariff_matrix.xlsx` & Swiss customs schedule prove `9021.10.00` is the standard 8-digit tariff line in Switzerland for orthopedic appliances.
  - Both codes share the exact same 6-digit WCO Harmonized System root (`9021.10`).
- **Decision**:
  - Do not escalate. Update ERP cross-reference table to map Swiss national subheadings to internal product codes.

---

### Case 3B: Asterion Ortho · Irish Preference Claim
- **Heading Skeleton**:
  ```markdown
  ## Decision
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypotheses
  ## Missing Evidence
  ## Safe Next Action
  ```
- **Key Findings**:
  - Packet `IE-2025-000411` claimed 0% preferential duty under EU rules.
  - `supplier_origin_register.csv` shows supplier's Long-Term Supplier Declaration (LTSD) expired on `2024-12-31`.
  - The import entry date is in 2025; no renewed LTSD was uploaded before shipment clearance.
- **Decision**:
  - Preferential claim is **unsupported on current records**.
  - Safe Next Action: Do not accuse of customs fraud; hold clearance or post standard non-preferential duty deposit while requesting an updated, valid 2025 LTSD from the Irish supplier.

---

### Case 4A: Aurelia Consumer Products · QC Queue Smell Test
- **Heading Skeleton**:
  ```markdown
  ## Judgment
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypotheses
  ## What Would Change the Decision
  ```
- **Key Findings**:
  - Operations asserted QC release takes 1.5 days based on `batch_release.csv`.
  - 70.6% of `qcore_release_ts` entries are stamped exactly at `02:10:00 AM`.
  - `source_freshness.csv` confirms `02:10:00` is the execution time of the daily automated database batch snapshot.
  - Calculated turnaround times reflect ETL pipeline latency, not physical laboratory testing duration.
- **Decision**:
  - Hold deployment of KPI dashboard until real-time event logs (sample receipt timestamp and lab sign-off timestamp) are integrated.

---

### Case 4B: Aurelia Consumer Products · Spare-Parts Search
- **Heading Skeleton**:
  ```markdown
  ## Judgment
  ## Candidate Matches
  | Part | Match | Actionable now / Needs check / Not transferable |\n|---|---|---|\n
  ## Evidence Table
  | Claim | Source | Confidence |
  |---|---|---|
  ## Rejected Hypotheses
  ## What Would Change the Decision
  ```
- **Mathematical Breakdown**:
  - Total 24 open purchase requests across manufacturing plants.
  - Correct Total Value: $\sum (\text{requested\_qty} \times \text{unit\_quote\_usd}) = \$166,495.60$.
  - **Classification**:
    - **Actionable Now (8 parts)**: Identical OEM specifications, surplus inventory available in sister plants, no cross-plant transfer barriers.
    - **Needs Engineering Check (12 parts)**: Functional equivalents with minor dimensional or voltage tolerance differences requiring mechanical lead sign-off.
    - **Not Transferable (4 parts)**: Critical-line servo drives subject to plant-specific warranty and uptime restriction policies.

---

## Pre-Submission Verification Checklist

1. [x] **Length Verification**: Ensure answers stay comfortably within min/max bounds (150–3000 or 200–6000).
2. [x] **Exact Headings**: Pre-filled Markdown headers preserved verbatim.
3. [x] **Traceable Citations**: Every claim in the evidence table cites the specific filename.
4. [x] **Calibrated Confidence**: Realistic mix of High, Medium, and Low confidence ratings based on data limitations.
5. [x] **Safe, Reversible Next Step**: Recommended actions prioritize verification, cheap checks, and controlled rollout over high-risk irreversible decisions.
