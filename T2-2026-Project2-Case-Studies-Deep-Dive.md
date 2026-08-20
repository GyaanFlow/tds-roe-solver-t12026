# TDS May 2026 (T2-2026) Project 2 — Complete Case Studies Specification & Deep-Dive

**Source URL**: `https://exam.sanand.workers.dev/exam-tds-2026-05-p2.js`  
**Total Weight**: 100 Marks (8 Questions × 12.5 Marks each)  
**Evaluation Scheme**:
- **2.5 marks** awarded immediately upon online submission format check (`/backendVerify`).
- **10.0 marks** assessed offline based on rigorous analytical depth, evidence tables, rejected hypotheses, causal calibration, and safe next actions.

---

## Complete Question Inventory & Schema

| # | Question ID | Title | Weight | Char Limits | Data Directory / Base URL |
|---|---|---|---|---|---|
| **1A** | `q-case-dth-month-end-server` | Case Study 1A — DTH Month-End Mystery | 12.5 | 200 – 6,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/dth-retention/` |
| **1B** | `q-case-dth-complaints-quiet-server` | Case Study 1B — DTH Complaints Went Quiet | 12.5 | 200 – 6,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/dth-retention/` |
| **2A** | `q-case-solar-smell-test-server` | Case Study 2A — Solar Inverter Smell Test | 12.5 | 150 – 3,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/solar-panels/` |
| **2B** | `q-case-solar-impact-claim-server` | Case Study 2B — Solar 31.6% Impact Claim | 12.5 | 200 – 6,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/solar-panels/` |
| **3A** | `q-case-customs-mismatch-server` | Case Study 3A — Swiss Mismatch Control | 12.5 | 150 – 3,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/customs-review/CH-2025-000522/` |
| **3B** | `q-case-customs-preference-server` | Case Study 3B — Is the Irish Preference Claim Supported? | 12.5 | 200 – 6,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/customs-review/IE-2025-000411/` |
| **4A** | `q-case-consumer-qc-queue-server` | Case Study 4A — QC Queue Smell Test | 12.5 | 200 – 6,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/consumer-products/` |
| **4B** | `q-case-consumer-spares-search-server` | Case Study 4B — Spare-Parts Search | 12.5 | 200 – 6,000 | `https://files.s-anand.net/pages/tds-2026-05-p2/data/consumer-products/` |

---

## Detailed Case Study Breakdown

### Case Study 1A: DTH Month-End Mystery
- **Entity**: SkyWave Direct · DTH Retention
- **Scenario**: You are the retention analytics manager. A reviewer flagged a cluster of West-region annual-plan renewals posted on 31 May. Decide whether it indicates duplicate revenue, manipulated reporting, a pipeline defect, or no material issue based on supplied evidence.
- **Files**:
  - `recharges.csv`: Recharge events with effective and posting dates.
  - `dealer_import_log.csv`: Batch controls and reconciliations.
  - `email-dealer-reconciliation.eml`: Operations explanation of the upload process.
- **Required Submission Structure**:
  1. A direct escalation judgment.
  2. Evidence table: `claim | source | confidence`.
  3. Rejected hypotheses and the evidence used to reject them.
  4. Material unknowns and evidence that would change your decision.
  5. A safe, reversible next action.

---

### Case Study 1B: DTH Complaints Went Quiet
- **Entity**: SkyWave Direct · Customer Care
- **Scenario**: Forward-deployed analyst embedded with customer care. South-region complaint cases fell after the NovaIVR pilot. Assess whether this is evidence that self-service improved customer experience and whether the pilot should expand nationally.
- **Files**:
  - `tickets.csv`
  - `ivr_interactions.jsonl`
  - `service_events.csv`
  - `email-ivr-pilot.eml`
  - People: `farah-iqbal.md` (Customer Care Operations), `dev-khanna.md` (Billing Systems).
- **Required Submission Structure**:
  1. Direct recommendation on evidence and national expansion.
  2. Evidence table: `claim | source | confidence`.
  3. Rejected hypotheses, material unknowns, and a safe next action.
  4. The one person you would question and exactly five questions you would ask.

---

### Case Study 2A: Solar Inverter Smell Test
- **Entity**: ARPL Solar · Plant Operations
- **Scenario**: Reviewing small inverter-event export before a broader analysis session. Does anything in this file smell wrong enough to escalate? Identify at most two things worth checking.
- **Files**:
  - `inverter_events.csv`
- **Required Submission Structure**:
  1. At most two prioritized findings, with evidence and claim-specific confidence.
  2. Evidence table: `claim | source | confidence`.
  3. At least one genuinely rejected hypothesis and why.
  4. Scoped conclusion: escalate, perform one cheap check, or stop.

---

### Case Study 2B: Solar 31.6% Impact Claim
- **Entity**: ARPL Solar · Wind-Stow Pilot
- **Scenario**: Assess whether evidence supports the impact note's claim that the pilot reduced DSM penalty by 31.6%. State the strongest conclusion defendable and what the evidence cannot establish.
- **Files**:
  - `AI_Pilot_Impact_Note.md`
  - `dispatch_blocks.csv`
  - `DSM_Commercial_Extract.pdf`
- **Required Submission Structure**:
  1. Direct conclusion about 31.6% claim and narrower claim supported.
  2. Evidence table: `claim | source | confidence`.
  3. Rejected hypotheses and what remains causally unidentified.
  4. One decision-changing next measurement or validation design.
  5. Safe recommendation for continued use or expansion.

---

### Case Study 3A: Swiss Mismatch Control
- **Entity**: Asterion Ortho · EMEA Customs
- **Scenario**: Automated comparison on Swiss packet `CH-2025-000522` flagged a mismatch to Helios 90211090. Decide whether this code mismatch should be escalated as a likely declaration error.
- **Files**:
  - `declaration.pdf`, `commercial_invoice.pdf`, `air_waybill.pdf`
  - `review_note.txt`, `packet_manifest.txt`
  - `product_master_current.xlsx`, `country_tariff_matrix.xlsx`, `canonical-schema-v0.3.md`
- **Required Submission Structure**:
  1. Direct answer or decision.
  2. Evidence table: `claim | source | confidence`.
  3. Hypotheses rejected and why.
  4. Missing evidence that could change judgment.
  5. Safe next action.

---

### Case Study 3B: Is the Irish Preference Claim Supported?
- **Entity**: Asterion Ortho · EMEA Customs
- **Scenario**: Preference indicator present on Irish packet `IE-2025-000411`, but supplier support is not linked in ClearView. Assess whether preferential-origin claim is supported.
- **Files**:
  - `declaration.pdf`, `commercial_invoice.pdf`, `air_waybill.pdf`
  - `review_note.txt`, `packet_manifest.txt`
  - `supplier_declaration_reference.txt`, `supplier_origin_register.csv`, `origin-workshop.md`
- **Required Submission Structure**:
  1. Direct answer or decision.
  2. Evidence table: `claim | source | confidence`.
  3. Hypotheses rejected and why.
  4. Missing evidence that could change judgment.
  5. Safe next action.

---

### Case Study 4A: QC Queue Smell Test
- **Entity**: Aurelia Consumer Products · Quality Systems
- **Scenario**: Operations claims routine QC release "takes about a day and a half" and wants a dashboard. Does anything smell wrong in QC release extract and process note before using cycle time as KPI?
- **Files**:
  - `batch_release.csv`, `qc_release_sop.md`, `source_freshness.csv`
- **Required Submission Structure**:
  1. Answer or recommendation.
  2. Evidence table: `claim | source | confidence`.
  3. Hypotheses rejected and why.
  4. What you would ask for next.

---

### Case Study 4B: Spare-Parts Search
- **Entity**: Aurelia Consumer Products · Maintenance
- **Scenario**: Plants buying spare parts already existing elsewhere due to differing descriptions. Semantic search pilot opportunity: produce candidate match table and classify value into actionable now, needs engineering check, or not transferable.
- **Files**:
  - `spare_parts.csv`, `part_requests.csv`, `part_restrictions.csv`
  - `spares_transfer_policy.md`, `maintenance_email.txt`, `source_freshness.csv`
- **Required Submission Structure**:
  1. Recommendation + candidate-match table (`Part | Match | Actionable now / Needs check / Not transferable`).
  2. Evidence table: `claim | source | confidence`.
  3. Hypotheses considered and rejected, with why.
  4. What to ask for next.
