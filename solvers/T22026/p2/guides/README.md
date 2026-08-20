<!-- Universal guide · TDS 2026 May · Paper 2 -->

# TDS 2026 May · Project 2 — Universal Case-Study Guide

**Project 2 · 8 case studies · 12.5 marks each = 100.**

The heavy data analysis has been **done once** and **frozen as cited plain text** so you don't burn hours (or tokens) re-deriving the same numbers from the same shared files. Each case has its own file with the verified findings, the traps, reusable building blocks, a fill-in template that matches the exam's answer box, and one worked model answer.

> [!CAUTION]
> This guide exists to save you time and give you a defensible starting point — **the analysis, the judgment, and the words must become yours.** Verify the facts you rely on, pick a stance you can defend under questioning, and write your own submission. A guide is a little help — it is *not* the answer.
---

> [!WARNING]
> **This is a head-start, not an answer key. Read this first.**
> - **It saves you time and tokens** and shows you *how to reason* — it does **not** hand you "the" answer. These are **judgment** questions; there is no single hidden correct answer to copy.
> - **Don't blindly trust it.** Every finding was computed carefully against the live data (and MD5-checked against the source), but files can change and mistakes happen. **Every fact is cited to its file — spot-check at least the one number your conclusion depends on.**
> - **The judgment is yours.** Pick a stance *you can defend* and **write your submission in your own words.** These are graded by humans on a rubric; near-identical answers stand out and score **lower**, and copying teaches you nothing for the viva/next exam.
> - **Marks come from your reasoning** — evidence, calibration, and traceability — not from matching a template. Use this to reason *faster*, not to skip reasoning.

---

## 1 · What this project is

Eight independent **case studies**, each a realistic "analyst gets messy data + a claim + a decision to make" scenario. You get a short business brief, a set of data files (CSV / XLSX / PDF / TXT / MD), and you submit a **short written disposition** (a decision + evidence + reasoning). Cases are grouped in four pairs by domain:

| Pair | Domain | Company |
|:--|:--|:--|
| **1A / 1B** | DTH / subscription TV analytics | SkyWave Direct |
| **2A / 2B** | Solar plant operations | ARPL Solar |
| **3A / 3B** | Customs / trade compliance | Asterion Ortho (EMEA) |
| **4A / 4B** | Consumer-products quality & maintenance | Aurelia Consumer Products |

Every case is **worth 12.5 marks**. They are **independent** — do them in any order.

---

## 2 · How grading actually works (read this — it changes your strategy)

Each case shows an **"Offline evaluation"** banner. Here's what that means in practice:

- **The `Check` button validates *format only*.** It checks that your answer is within the **character gate** (a min/max length). If it is, you get the **2.5 participation marks**. `Check` does **not** read your reasoning.
- **The remaining ~10 marks are graded offline by humans**, on the **quality of your analysis** — is your decision supported by evidence, is your confidence calibrated, did you consider and reject alternatives, did you name what you *don't* know.
- **Evidence is scored before the conclusion.** A well-evidenced *"insufficient evidence"* or a defensible *alternative* verdict can earn **full marks**. You are **not** scored on recovering a hidden "intended" answer — the exam says so explicitly:
  > *"You are not scored on recovering a hidden intended answer. You are scored on the quality, traceability, and calibration of the judgment available from the materials."*
- **Do not treat an assertion as proof.** Several cases hand you a confident claim (a KPI, a 31.6% result, a mismatch flag, a preference indicator) that the **data does not actually support**. Testing the claim against the data — and saying so — is the point.

**Strategy consequence:** first make sure you clear the **length gate** (banks the 2.5). Then spend your effort on a **tight, evidence-first, calibrated** note — not on length or polish.

---

## 3 · The universal answer recipe

Every case reduces to the same five moves. **The section *headings* differ per case** (see §6) — but the underlying shape is constant:

1. **Decision / Judgment** — a *direct* answer. Take a stance; don't hedge into mush.
2. **Evidence Table** — `| Claim | Source | Confidence |`. One row per load-bearing fact, each **cited to a file**, each with **High / Med / Low** confidence.
3. **Rejected Hypotheses** — the tempting wrong readings, each with the **specific evidence that kills it**. (This is where easy marks hide.)
4. **Unknowns / Missing Evidence** — what you *don't* have that could **change the decision**. Naming this is a sign of calibration, not weakness.
5. **Safe Next Action** — the cheapest, most reversible next step. Usually "verify X before committing," not "ship it" or "escalate."

> [!TIP]
> **Calibration is the most-rewarded skill in this exam.** "It smells, don't ship it yet" · "reproduces exactly but overstates — report the identifiable ~17.5%, not the 31.6% headline" · "not supported → hold and verify, not fraud" — these calibrated verdicts score **higher** than a confident yes/no that the evidence can't carry.

---

## 4 · Golden rules (tick these on every case)

- [ ] **Match the exam's answer-box headings *verbatim*.** Each textarea is **pre-filled** with the exact `##` skeleton the grader expects. Use those headings, in that order (see §6). The heading **wins** over any different wording in the prose brief.
- [ ] **Clear the character gate first** — it banks the 2.5 participation marks. Don't undershoot the min or blow past the max.
- [ ] **Every claim is cited to a file.** `claim | source | confidence`. No uncited assertions.
- [ ] **Calibrate confidence per claim** — don't mark everything "High." If the data can't confirm it, say **Med/Low** and say why.
- [ ] **Reject at least one tempting hypothesis** with the evidence that rejects it.
- [ ] **Name the missing evidence** that would change your mind.
- [ ] **Never infer from wording/names.** Scary event names, a KPI's title, a "mismatch" flag, a "preference" tick — none of these is evidence. Check the columns/documents.
- [ ] **Test the claim against the data.** If a number is asserted, reproduce it (or show you can't).
- [ ] **Prefer the cheap, reversible next step.** "Confirm before committing" beats "escalate"/"ship."
- [ ] **Write it in your own words.** Human-graded; identical answers score lower.

---

## 5 · The eight cases (index)

Click any case for its full guide. **Verdicts below are the defensible stance this guide argues — not the only valid one.**

| # | Case | Team | Length gate | Time | Defensible verdict (in one line) |
|:--|:--|:--|:--|:--|:--|
| **1A** | [DTH Month-End Mystery](1A.md) | SkyWave · DTH Retention | 200–6000 | 10 min | **No material issue** — the 31-May spike is a legitimate month-end batch of **annual renewals**; reconciles to the cent. |
| **1B** | [DTH Complaints Went Quiet](1B.md) | SkyWave · Customer Care | 200–6000 | 30 min | **Not clean evidence of improvement — don't expand nationally.** Measurement + auth artifact (pre-auth drop-off, containment inflated by denominator). Deliverable names a **person + 5 questions**. |
| **2A** | [Solar Inverter Smell Test](2A.md) | ARPL · Plant Operations | **150–3000** | 10 min | **Do not escalate.** The export is **4 benign rows** (all `impact_mw=0`, `cleared=yes`); only real check is completeness. |
| **2B** | [Solar 31.6% Impact Claim](2B.md) | ARPL · Wind-Stow Pilot | 200–6000 | 30 min | **31.6% reproduces exactly — but it's a *cross-day* figure that overstates the pilot.** The clean *same-day* counterfactual (recompute 29 May on the no-pilot `base_schedule`, generation held fixed) is **~17.5%**, concentrated entirely on the 12 revised blocks. |
| **3A** | [Swiss Mismatch Control](3A.md) | Asterion · EMEA Customs | **150–3000** | 15 min | **Do not escalate.** Declared `90211000` **is** the Swiss-approved code; the flag compares it to the EU/Helios code — a **cross-code-system false positive** (same HS6). |
| **3B** | [Is the Irish Preference Claim Supported?](3B.md) | Asterion · EMEA Customs | 200–6000 | 45 min | **Not supported on the evidence — hold & verify.** No linked support; the only Irish declaration is **expired** before the entry. **"Not established," not fraud.** |
| **4A** | [QC Queue Smell Test](4A.md) | Aurelia · Quality Systems | 200–6000 | 15 min | **It smells — don't ship the KPI yet.** 70.6% of `qcore_release_ts` sit on the **02:10 daily-snapshot boundary** (wrong clock); exceptions not excluded. |
| **4B** | [Spare-Parts Search](4B.md) | Aurelia · Maintenance | 200–6000 | 30 min | **Transfer 8 · needs-check 12 · not-transferable 4** of 24 open buys (**$166,495.60** apparent value = qty × unit quote; a naive `external_quote_usd` column-sum undercounts at $152,558). The 4 non-transferable are servo parts reserved for critical lines. |

> [!NOTE]
> **Gates differ:** **2A and 3A** use the **shorter 150–3000** window (concise answers expected); the other six use **200–6000**. All eight award **2.5 participation marks** for a valid-length submission; the other 10 are graded offline.

---

## 6 · Answer-box skeletons (match these verbatim)

Each case's textarea is pre-filled with an exact `##` heading skeleton. **Copy it exactly** — headings, order, and the evidence-table header row. They are **not** all the same.

**1A — Month-End Mystery**
```
## Judgment
## Evidence Table
## Rejected Hypotheses
## Unknowns and Decision-Changing Evidence
## Safe Next Action
```

**1B — Complaints Went Quiet** *(the box pre-numbers 1.–5. under the last heading)*
```
## Judgment
## Evidence Table
## Rejected Hypotheses and Unknowns
## Safe Next Action
## Person and Five Questions
```

**2A — Inverter Smell Test** *(note: singular "Hypothesis"; ends at "Conclusion")*
```
## Prioritized Findings
## Evidence Table
## Rejected Hypothesis
## Conclusion
```

**2B — 31.6% Impact Claim**
```
## Judgment
## Evidence Table
## Rejected Hypotheses and Causal Limits
## Next Measurement
## Recommendation
```

**3A — Swiss Mismatch** and **3B — Irish Preference** *(identical skeleton)*
```
## Decision
## Evidence Table
## Rejected Hypotheses
## Missing Evidence
## Safe Next Action
```

**4A — QC Queue Smell Test**
```
## Judgment
## Evidence Table
## Rejected Hypotheses
## What Would Change the Decision
```

**4B — Spare-Parts Search** *(extra "Candidate Matches" table)*
```
## Judgment
## Candidate Matches
## Evidence Table
## Rejected Hypotheses
## What Would Change the Decision
```

Every **Evidence Table** uses the same header:
```
| Claim | Source | Confidence |
|---|---|---|
```

---

## 7 · How to use this repo (suggested workflow)

1. **Open the case file** (e.g. [2B.md](2B.md)). Read **§1 TL;DR** and **§2 Scenario** to load the problem.
2. **Skim §5 Verified findings** and **§7 Traps.** These are the frozen analysis + the mistakes to avoid.
3. **Spot-check one number.** Pick the fact your conclusion leans on hardest and confirm it in the raw file. (Trust, but verify.)
4. **Assemble from §8 Building blocks.** Choose your evidence rows, the hypotheses to reject, your stance (options are laid out A/B/C).
5. **Paste the §9 fill-in template** into the answer box — it already matches the exam skeleton — then **rewrite it in your own words.**
6. **Check the length gate**, hit `Check` to bank the 2.5, and submit.
7. **§10** has a full worked model answer for reference, and **§11** is a pre-submit checklist. Don't paste §10 verbatim.

---

## 8 · Data provenance & integrity

- All case data lives at base URL `https://files.s-anand.net/pages/tds-2026-05-p2/data/<folder>/` (each case file lists its exact files + folder).
- Every file used in this guide was **downloaded from the live source and MD5-verified** against a fresh re-download, and each headline number was **recomputed with independent code** before being frozen into the case files. Where a number is definition-sensitive (e.g. 1B's containment rate, 2B's penalty), the guide shows the **exact definition** that reproduces it.
- Confidence labels in the evidence tables reflect **what the data can actually support** — not optimism. A "Med/Low" is a deliberate signal that the claim is only as strong as its source.

---

> [!CAUTION]
> **Final reminder.** This guide exists to save you time and give you a defensible starting point — **the analysis, the judgment, and the words must become yours.** Verify the facts you rely on, pick a stance you can defend under questioning, and write your own submission. A guide is a little help — it is *not* the answer.

*Good luck. Reason well, cite everything, and calibrate.*



