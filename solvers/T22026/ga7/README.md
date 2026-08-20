# 🛡️ GA7 — Policy Gates & OSINT Intelligence (T22026)

This module contains **10 solvers** covering policy engines, Web Application Firewalls (WAF), media forensics, and Open-Source Intelligence (OSINT).

---

## 📋 Topics & Solver Index

| Question | Title | Type | Technical Focus |
| :---: | :--- | :---: | :--- |
| **Q1** | LLM Release Gate | `solved` (Hosted API) | Automated model quality thresholds and regression gating. |
| **Q2** | LLM Action Firewall | `solved` (Hosted API) | Tool-calling permission filtering and privilege boundaries. |
| **Q3** | Terraform Policy Gate | `solved` (Hosted API) | HashiCorp Sentinel & Open Policy Agent (OPA) IAM checks. |
| **Q4** | Output Sanitizer | `solved` (Hosted API) | PII redaction and regex token masking. |
| **Q5** | OSINT Corroboration | `solved` (Hosted API) | Multi-source entity resolution and cross-verification. |
| **Q6** | Google-Dork Query Synthesis | `solved` | Advanced search operators (`filetype:`, `site:`, `inurl:`, `intitle:`). |
| **Q7** | WAF Rule-Order Simulation | `solved` | IP blocklist/allowlist order evaluation and regex routing. |
| **Q8** | Media Forensics | `solved` | EXIF metadata extraction and image compression artifact analysis. |
| **Q9** | GitHub Actions Workflow Audit | `solved` | OIDC token permissions and third-party action pinning. |
| **Q10** | Street View Intelligence | `guide` | Community-sourced, self-refreshing known-image gallery. |

---

## 🛠️ Execution & Testing

```bash
npm run check
```
