# T2 2026 Tools in Data Science End-Term Advanced Mock Bank

Source syllabus: https://tds.s-anand.net/

## Official End-Term Format Reference

- **Total:** 80 marks
- **Section 1:** 30 MCQ/MSQ questions for 39 marks, covering observability and monitoring, data pipeline integrity, CI/CD and release security, reliable AI/LLM systems, and web/API/infra fundamentals.
- **Section 2:** 9 short-answer questions for 41 marks, manually graded for applied AI-era judgment.

> Original reference-only practice material based on the current syllabus. It is not an official paper, answer key, prediction, or score guarantee.

This edition contains exactly **175 MCQs**, **25 MSQs**, and **100 subjective questions**. Answers are placed immediately after each question for guided study. Hide the answer area or use the JSON file when running a timed attempt.

Objective practice pool format: 175 MCQ and 25 MSQ. Use the official-length format above for a timed sitting.

## Coverage

- **W0: Bridge Course** — Setup Day; Linux & Shell Essentials; VS Code + Python Projects with uv; HTTP, APIs & Chrome DevTools; Git & GitHub Workflow
- **W1: Dev Environment & Tooling** — VS Code Basics; VS Code Advanced; uv Basics; uv Advanced; Bash Scripting; Git & GitHub; SQLite; HTTP Clients; Requestly; Data Formats; GitHub Pages; LaTeX; Publish a Python library to PyPI; Web Traffic Debugging with Burp Suite
- **W2: Deployment & API Engineering** — FastAPI Fundamentals; CORS & Middleware; Google OAuth 2.0; Config Management; Docker & Compose; Deployment Platforms; Logging & Testing; Observability; Cloudflare Tunnels; Local LLMs Basics; LM Studio & Ollama; llama.cpp & vLLM; MLX Labs; Private LLMs with vLLM & API Gateway; WebSocket Chat with Redis & PostgreSQL
- **W3: LLM Engineering** — Prompt Engineering Foundations; Reliable Reasoning & Output Control; Prompted Applications & Production Practice; Context Engineering; Prompt Caching; Structured Output; LLM Architecture Survey; Multimodal Inputs; Vector Embeddings; Similarity Search; LLM CLI Tools; AI Coding Assistants; LangSmith & LiteLLM; YouTube to Subtitles to Topics; Cost-tracking Dashboard
- **W4: RAG & Hybrid RAG** — Vector Databases; Chunking Strategies; Late Chunking; Contextual Retrieval; Hybrid Search; Reranking; Query Augmentation; Semantic Caching; Multimodal Embeddings; GraphRAG; LLM Grounding & Citations; RAGAS Evaluation; RAGAS Evaluation Dashboard; BS Degree Chatbot
- **W5: Agentic AI** — Agent Fundamentals; Tool / Function Calling; Agent Evaluation & Benchmarking; Agent Memory Systems; Loop Engineering; Multi-Agent Systems; Specialized Agents; Model Context Protocol (MCP); Async & Parallelism; Sandboxing Agent Code; Autonomous Research Agent
- **W6: Web Data Acquisition & OSINT** — Legal & Ethical Scraping; Hidden JSON APIs; Sitemaps, RSS & Structured Data; Wayback Machine & Common Crawl; Playwright & Selenium; Playwright Advanced; Pagination & Infinite Scroll; Authenticated Scraping; Rate Limits, Retries & Caching; Change Detection & Dedup; Anti-bot Patterns; Cloudflare Bot Protection; HTML to Markdown for LLMs; DuckDB + Parquet; Document Parsing; Vision Models for Scraping; Image Processing Pipeline; Speech AI; Video Understanding; Google Dorking; OSINT Infrastructure & Records; Scheduled Scraping; Scheduled Scraper with GitHub Actions; Open-Source Organisation Dossier; Job Posting Scraper; AI Signature Detection; Live Multilingual Translator
- **W7: CI/CD, Security & Cloud** — GitHub Actions Advanced; Advanced Docker; LLM Security Offensive; LLM Safety Defensive; OWASP LLM Top 10; Cloudflare Defender Side; Dorking for Recon & Exposure; Person & Social OSINT; VMs & SSH; Serverless Functions; Terraform & IaC; Cost Alerting & Budgets; Pub/Sub & Event-Driven; Red-team Your Own API; Full CI/CD to Cloud Run
- **W8: MLOps & Fine-Tuning** — Cloud Storage for ML; BigQuery ML; MLflow; Fine-Tuning Strategy; HuggingFace Ecosystem; Fine-Tuning Techniques; Quantization; Gemma 4 Fine-Tuning; Model Publishing & Cards; Full GCP Walkthrough

## MCQ Bank

### MCQ-001 | W0 | Paths and WSL | Concept | Foundation

Which statement most accurately explains the main principle of Paths and WSL?

A. Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.
B. Hard-code the current desktop path
C. Use a relative path without checking the process working directory
D. Treat every path as a URL

**Answer:** A. Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.

**Simple explanation:** Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Paths and WSL.

**Exam takeaway:** Remember: Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.

### MCQ-002 | W0 | Paths and WSL | Application | Application

A script works from one folder but fails when launched from another. What should the team do first?

A. Hard-code the current desktop path
B. Use a relative path without checking the process working directory
C. Treat every path as a URL
D. Resolve the path from a known base such as the project or script directory, then test it from both launch locations

**Answer:** D. Resolve the path from a known base such as the project or script directory, then test it from both launch locations

**Simple explanation:** Resolve the path from a known base such as the project or script directory, then test it from both launch locations. This directly addresses the stated situation while following the principle: use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.

### MCQ-003 | W0 | Paths and WSL | Debugging | Analysis

While debugging Paths and WSL, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Hard-code the current desktop path
D. Resolve the path from a known base such as the project or script directory, then test it from both launch locations

**Answer:** C. Hard-code the current desktop path

**Simple explanation:** The response "Hard-code the current desktop path" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.

### MCQ-004 | W0 | Paths and WSL | Practical | Application

A Python file is `/home/riya/app/main.py`, its data file is `/home/riya/app/data/users.csv`, and the program may be launched from any working directory. Which expression is the safest base for the data path?

A. `Path.home() / "users.csv"`
B. `Path(__file__).resolve().parent / "data" / "users.csv"`
C. `Path("data/users.csv")` without controlling the working directory
D. `Path("/tmp/data/users.csv")`

**Answer:** B. `Path(__file__).resolve().parent / "data" / "users.csv"`

**Simple explanation:** `__file__` identifies the script file. Resolving its parent makes the data path independent of the directory from which Python was launched.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Relative paths are resolved from the process working directory unless code deliberately chooses another base.

**Exam takeaway:** Relative paths are resolved from the process working directory unless code deliberately chooses another base.

### MCQ-005 | W0 | Shell pipelines and redirection | Concept | Foundation

Which statement most accurately explains the main principle of Shell pipelines and redirection?

A. Use one giant command with no quoting
B. Redirect everything to /dev/null
C. Run each command manually and copy output by hand
D. Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

**Answer:** D. Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

**Simple explanation:** Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Shell pipelines and redirection.

**Exam takeaway:** Remember: Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

### MCQ-006 | W0 | Shell pipelines and redirection | Application | Application

A diagnostic command must retain old output while recording new errors separately. What should the team do first?

A. Redirect everything to /dev/null
B. Run each command manually and copy output by hand
C. Append stdout and redirect stderr explicitly
D. Use one giant command with no quoting

**Answer:** C. Append stdout and redirect stderr explicitly

**Simple explanation:** Append stdout and redirect stderr explicitly. This directly addresses the stated situation while following the principle: use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

### MCQ-007 | W0 | Shell pipelines and redirection | Debugging | Analysis

While debugging Shell pipelines and redirection, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Redirect everything to /dev/null
C. Append stdout and redirect stderr explicitly
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Redirect everything to /dev/null

**Simple explanation:** The response "Redirect everything to /dev/null" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

### MCQ-008 | W0 | Shell pipelines and redirection | Practical | Application

Which Bash command appends standard output to `run.log` while overwriting standard error in `errors.log`?

A. `python job.py >> run.log 2> errors.log`
B. `python job.py > run.log 2>&1`
C. `python job.py 2>> run.log > errors.log`
D. `python job.py | run.log | errors.log`

**Answer:** A. `python job.py >> run.log 2> errors.log`

**Simple explanation:** `>>` appends file descriptor 1 (stdout). `2>` redirects file descriptor 2 (stderr) and overwrites its target. The two streams therefore remain in separate files with the requested update behavior.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. `>` overwrites, `>>` appends, and `2>` targets stderr.

**Exam takeaway:** `>` overwrites, `>>` appends, and `2>` targets stderr.

### MCQ-009 | W0 | uv project workflow | Concept | Foundation

Which statement most accurately explains the main principle of uv project workflow?

A. Copy the site-packages directory
B. Rely on the active shell history
C. Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.
D. Install packages globally

**Answer:** C. Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.

**Simple explanation:** Declare dependencies in project metadata and use uv to create or reproduce an isolated environment. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of uv project workflow.

**Exam takeaway:** Remember: Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.

### MCQ-010 | W0 | uv project workflow | Application | Application

A teammate needs the same Python dependencies on a clean machine. What should the team do first?

A. Rely on the active shell history
B. Commit project metadata and the lockfile
C. Install packages globally
D. Copy the site-packages directory

**Answer:** B. Commit project metadata and the lockfile

**Simple explanation:** Commit project metadata and the lockfile. This directly addresses the stated situation while following the principle: declare dependencies in project metadata and use uv to create or reproduce an isolated environment.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.

### MCQ-011 | W0 | uv project workflow | Debugging | Analysis

While debugging uv project workflow, which proposed response is the least defensible?

A. Rely on the active shell history
B. Commit project metadata and the lockfile
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Rely on the active shell history

**Simple explanation:** The response "Rely on the active shell history" is the weakest choice because it does not solve the root problem and conflicts with this principle: Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.

### MCQ-012 | W0 | uv project workflow | Practical | Application

After cloning a UV project that already contains `pyproject.toml` and `uv.lock`, which command recreates the project environment from the lockfile?

A. `uv init`
B. `uv add --all`
C. `pip freeze`
D. `uv sync`

**Answer:** D. `uv sync`

**Simple explanation:** `uv sync` creates or updates the project environment so its installed dependencies match the project metadata and lockfile.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Use `uv sync` after cloning or after pulling dependency changes.

**Exam takeaway:** Use `uv sync` after cloning or after pulling dependency changes.

### MCQ-013 | W0 | HTTP methods and status codes | Concept | Foundation

Which statement most accurately explains the main principle of HTTP methods and status codes?

A. Inspect only the response body
B. Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.
C. Retry every response forever
D. Replace every response with 200

**Answer:** B. Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.

**Simple explanation:** Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of HTTP methods and status codes.

**Exam takeaway:** Remember: Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.

### MCQ-014 | W0 | HTTP methods and status codes | Application | Application

A client receives 401, 403, 404, and 500 responses from different requests. What should the team do first?

A. Diagnose authentication, authorization, routing, and server failure separately
B. Retry every response forever
C. Replace every response with 200
D. Inspect only the response body

**Answer:** A. Diagnose authentication, authorization, routing, and server failure separately

**Simple explanation:** Diagnose authentication, authorization, routing, and server failure separately. This directly addresses the stated situation while following the principle: interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.

### MCQ-015 | W0 | HTTP methods and status codes | Debugging | Analysis

While debugging HTTP methods and status codes, which proposed response is the least defensible?

A. Diagnose authentication, authorization, routing, and server failure separately
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Retry every response forever

**Answer:** D. Retry every response forever

**Simple explanation:** The response "Retry every response forever" is the weakest choice because it does not solve the root problem and conflicts with this principle: Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.

### MCQ-016 | W0 | HTTP methods and status codes | Practical | Application

A FastAPI endpoint receives syntactically valid JSON, but a required integer field contains the string `"many"`. Which status is most likely?

A. `404 Not Found` because the field is missing from the URL
B. `500 Internal Server Error` because every type error is a server crash
C. `422 Unprocessable Entity` because request validation failed
D. `200 OK` because the JSON syntax is valid

**Answer:** C. `422 Unprocessable Entity` because request validation failed

**Simple explanation:** The route can exist and the JSON can parse while the request still violates the declared body schema. FastAPI reports this as a validation error.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Separate JSON syntax, route matching, schema validation, and server execution.

**Exam takeaway:** Separate JSON syntax, route matching, schema validation, and server execution.

### MCQ-017 | W0 | Git basic flow | Concept | Foundation

Which statement most accurately explains the main principle of Git basic flow?

A. Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.
B. Force-push the default branch without warning
C. Leave the secret active because the commit is old
D. Edit the remote directly

**Answer:** A. Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.

**Simple explanation:** Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Git basic flow.

**Exam takeaway:** Remember: Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.

### MCQ-018 | W0 | Git basic flow | Application | Application

A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret. What should the team do first?

A. Force-push the default branch without warning
B. Leave the secret active because the commit is old
C. Edit the remote directly
D. Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely

**Answer:** D. Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely

**Simple explanation:** Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely. This directly addresses the stated situation while following the principle: move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.

### MCQ-019 | W0 | Git basic flow | Debugging | Analysis

While debugging Git basic flow, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Leave the secret active because the commit is old
D. Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely

**Answer:** C. Leave the secret active because the commit is old

**Simple explanation:** The response "Leave the secret active because the commit is old" is the weakest choice because it does not solve the root problem and conflicts with this principle: Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.

### MCQ-020 | W0 | Git basic flow | Practical | Application

You edited `app.py`, ran `git add app.py`, and then edited `app.py` again. Which command shows only the version currently staged for the next commit?

A. `git log -1`
B. `git diff --staged`
C. `git diff`
D. `git status --short` only

**Answer:** B. `git diff --staged`

**Simple explanation:** `git add` stores a snapshot in the index. `git diff --staged` compares that index with `HEAD`; plain `git diff` shows the later unstaged edit.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. One file can contain both staged and unstaged changes at the same time.

**Exam takeaway:** One file can contain both staged and unstaged changes at the same time.

### MCQ-021 | W1 | VS Code workspaces | Concept | Foundation

Which statement most accurately explains the main principle of VS Code workspaces?

A. Install a second editor
B. Rename every import
C. Disable diagnostics globally
D. Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

**Answer:** D. Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

**Simple explanation:** Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of VS Code workspaces.

**Exam takeaway:** Remember: Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

### MCQ-022 | W1 | VS Code workspaces | Application | Application

The editor shows the wrong Python interpreter and unresolved imports. What should the team do first?

A. Rename every import
B. Disable diagnostics globally
C. Select the project interpreter and verify workspace settings
D. Install a second editor

**Answer:** C. Select the project interpreter and verify workspace settings

**Simple explanation:** Select the project interpreter and verify workspace settings. This directly addresses the stated situation while following the principle: open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

### MCQ-023 | W1 | VS Code workspaces | Debugging | Analysis

While debugging VS Code workspaces, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Disable diagnostics globally
C. Select the project interpreter and verify workspace settings
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Disable diagnostics globally

**Simple explanation:** The response "Disable diagnostics globally" is the weakest choice because it does not solve the root problem and conflicts with this principle: Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

### MCQ-024 | W1 | VS Code workspaces | Evidence | Evaluation

Select all evidence that would materially support saying that the VS Code workspaces solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Select the project interpreter and verify workspace settings. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Select the project interpreter and verify workspace settings. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

### MCQ-025 | W1 | Dependency locking | Concept | Foundation

Which statement most accurately explains the main principle of Dependency locking?

A. Copy random package versions from a colleague
B. Grant the package broad build permissions without review
C. Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.
D. Ignore the lockfile

**Answer:** C. Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

**Simple explanation:** Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Dependency locking.

**Exam takeaway:** Remember: Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

### MCQ-026 | W1 | Dependency locking | Application | Application

A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions. What should the team do first?

A. Grant the package broad build permissions without review
B. Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading
C. Ignore the lockfile
D. Copy random package versions from a colleague

**Answer:** B. Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading

**Simple explanation:** Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading. This directly addresses the stated situation while following the principle: keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

### MCQ-027 | W1 | Dependency locking | Debugging | Analysis

While debugging Dependency locking, which proposed response is the least defensible?

A. Ignore the lockfile
B. Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Ignore the lockfile

**Simple explanation:** The response "Ignore the lockfile" is the weakest choice because it does not solve the root problem and conflicts with this principle: Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

### MCQ-028 | W1 | Dependency locking | Evidence | Evaluation

Select all evidence that would materially support saying that the Dependency locking solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading. The test includes normal and edge cases.

**Answer:** A, D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result. | A repeatable before-and-after test shows that the original failure is fixed after applying this response: Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading. The test includes normal and edge cases.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

### MCQ-029 | W1 | Bash scripting | Concept | Foundation

Which statement most accurately explains the main principle of Bash scripting?

A. Assume the shell will infer intent
B. Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.
C. Expand every variable unquoted
D. Use rm -rf on the parent directory

**Answer:** B. Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

**Simple explanation:** Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Bash scripting.

**Exam takeaway:** Remember: Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

### MCQ-030 | W1 | Bash scripting | Application | Application

A cleanup script receives a filename containing spaces and an empty variable. What should the team do first?

A. Quote inputs and fail safely before deleting
B. Expand every variable unquoted
C. Use rm -rf on the parent directory
D. Assume the shell will infer intent

**Answer:** A. Quote inputs and fail safely before deleting

**Simple explanation:** Quote inputs and fail safely before deleting. This directly addresses the stated situation while following the principle: quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

### MCQ-031 | W1 | Bash scripting | Debugging | Analysis

While debugging Bash scripting, which proposed response is the least defensible?

A. Quote inputs and fail safely before deleting
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use rm -rf on the parent directory

**Answer:** D. Use rm -rf on the parent directory

**Simple explanation:** The response "Use rm -rf on the parent directory" is the weakest choice because it does not solve the root problem and conflicts with this principle: Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

### MCQ-032 | W1 | Bash scripting | Evidence | Evaluation

Select all evidence that would materially support saying that the Bash scripting solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Quote inputs and fail safely before deleting. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Answer:** C, D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Quote inputs and fail safely before deleting. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

### MCQ-033 | W1 | SQLite | Concept | Foundation

Which statement most accurately explains the main principle of SQLite?

A. Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.
B. Build SQL by string concatenation
C. Commit after every character
D. Store the database as a screenshot

**Answer:** A. Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.

**Simple explanation:** Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of SQLite.

**Exam takeaway:** Remember: Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.

### MCQ-034 | W1 | SQLite | Application | Application

An import must either commit all rows or leave the database unchanged. What should the team do first?

A. Build SQL by string concatenation
B. Commit after every character
C. Store the database as a screenshot
D. Wrap the import in a transaction and use parameters

**Answer:** D. Wrap the import in a transaction and use parameters

**Simple explanation:** Wrap the import in a transaction and use parameters. This directly addresses the stated situation while following the principle: use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.

### MCQ-035 | W1 | SQLite | Debugging | Analysis

While debugging SQLite, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Store the database as a screenshot
D. Wrap the import in a transaction and use parameters

**Answer:** C. Store the database as a screenshot

**Simple explanation:** The response "Store the database as a screenshot" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.

### MCQ-036 | W1 | SQLite | Practical | Application

A SQLite import of 1,000 rows must leave zero new rows if row 731 violates a constraint. What is the essential design?

A. Disable constraints during the import and never recheck them
B. Run all inserts inside one transaction and roll back on any error
C. Commit after every row so earlier rows remain
D. Build one SQL string by concatenating every value

**Answer:** B. Run all inserts inside one transaction and roll back on any error

**Simple explanation:** A transaction gives the import all-or-nothing behavior. Parameterized inserts also protect values from being interpreted as SQL.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Atomic work belongs in one transaction with explicit error handling.

**Exam takeaway:** Atomic work belongs in one transaction with explicit error handling.

### MCQ-037 | W1 | HTTP clients and data formats | Concept | Foundation

Which statement most accurately explains the main principle of HTTP clients and data formats?

A. Call JSON.parse on every body blindly
B. Silently accept HTML as data
C. Ignore encoding and delimiters
D. Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

**Answer:** D. Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

**Simple explanation:** Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of HTTP clients and data formats.

**Exam takeaway:** Remember: Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

### MCQ-038 | W1 | HTTP clients and data formats | Application | Application

An API sometimes returns an HTML error page where JSON was expected. What should the team do first?

A. Silently accept HTML as data
B. Ignore encoding and delimiters
C. Check status and content type before parsing
D. Call JSON.parse on every body blindly

**Answer:** C. Check status and content type before parsing

**Simple explanation:** Check status and content type before parsing. This directly addresses the stated situation while following the principle: validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

### MCQ-039 | W1 | HTTP clients and data formats | Debugging | Analysis

While debugging HTTP clients and data formats, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Call JSON.parse on every body blindly
C. Check status and content type before parsing
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Call JSON.parse on every body blindly

**Simple explanation:** The response "Call JSON.parse on every body blindly" is the weakest choice because it does not solve the root problem and conflicts with this principle: Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

### MCQ-040 | W1 | HTTP clients and data formats | Practical | Application

A client expects JSON but receives a body beginning with `<!doctype html>`. What should it inspect before calling the JSON parser?

A. The HTTP status and `Content-Type`, then the raw body if either is unexpected
B. Only whether the URL ends in `.json`
C. Only whether the request took less than one second
D. Nothing; retry `JSON.parse` until it succeeds

**Answer:** A. The HTTP status and `Content-Type`, then the raw body if either is unexpected

**Simple explanation:** An HTML error page or SPA fallback may still arrive over HTTP. Status and media type identify that boundary failure before parsing.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Validate the response contract before decoding the body.

**Exam takeaway:** Validate the response contract before decoding the body.

### MCQ-041 | W2 | FastAPI fundamentals | Concept | Foundation

Which statement most accurately explains the main principle of FastAPI fundamentals?

A. Parse raw strings in every route
B. Return a different response shape per request
C. Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.
D. Keep state in a module global and return 500 for every failure

**Answer:** C. Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.

**Simple explanation:** Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of FastAPI fundamentals.

**Exam takeaway:** Remember: Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.

### MCQ-042 | W2 | FastAPI fundamentals | Application | Application

A service works on one instance but loses a user job after a restart and returns inconsistent error shapes. What should the team do first?

A. Return a different response shape per request
B. Persist durable state outside the process and use a documented status and error contract
C. Keep state in a module global and return 500 for every failure
D. Parse raw strings in every route

**Answer:** B. Persist durable state outside the process and use a documented status and error contract

**Simple explanation:** Persist durable state outside the process and use a documented status and error contract. This directly addresses the stated situation while following the principle: keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.

### MCQ-043 | W2 | FastAPI fundamentals | Debugging | Analysis

While debugging FastAPI fundamentals, which proposed response is the least defensible?

A. Parse raw strings in every route
B. Persist durable state outside the process and use a documented status and error contract
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Parse raw strings in every route

**Simple explanation:** The response "Parse raw strings in every route" is the weakest choice because it does not solve the root problem and conflicts with this principle: Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.

### MCQ-044 | W2 | FastAPI fundamentals | Practical | Application

Which FastAPI feature most directly keeps request validation and generated OpenAPI documentation aligned?

A. A comment describing the expected JSON
B. Manual string splitting inside every route
C. Returning status 200 for invalid bodies
D. A typed Pydantic request model used in the route signature

**Answer:** D. A typed Pydantic request model used in the route signature

**Simple explanation:** FastAPI derives validation and schema documentation from type declarations and Pydantic models, keeping one executable contract.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Prefer executable schemas over duplicated prose contracts.

**Exam takeaway:** Prefer executable schemas over duplicated prose contracts.

### MCQ-045 | W2 | CORS and middleware | Concept | Foundation

Which statement most accurately explains the main principle of CORS and middleware?

A. Change the database schema without inspecting the request identity
B. Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.
C. Add a wildcard credentialed origin and trust the prompt
D. Disable all middleware

**Answer:** B. Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.

**Simple explanation:** Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of CORS and middleware.

**Exam takeaway:** Remember: Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.

### MCQ-046 | W2 | CORS and middleware | Application | Application

A browser call fails while curl works, and a logged-in user can see a resource belonging to another user. What should the team do first?

A. Check origin and preflight separately from authentication, then enforce resource authorization on the server
B. Add a wildcard credentialed origin and trust the prompt
C. Disable all middleware
D. Change the database schema without inspecting the request identity

**Answer:** A. Check origin and preflight separately from authentication, then enforce resource authorization on the server

**Simple explanation:** Check origin and preflight separately from authentication, then enforce resource authorization on the server. This directly addresses the stated situation while following the principle: treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.

### MCQ-047 | W2 | CORS and middleware | Debugging | Analysis

While debugging CORS and middleware, which proposed response is the least defensible?

A. Check origin and preflight separately from authentication, then enforce resource authorization on the server
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Change the database schema without inspecting the request identity

**Answer:** D. Change the database schema without inspecting the request identity

**Simple explanation:** The response "Change the database schema without inspecting the request identity" is the weakest choice because it does not solve the root problem and conflicts with this principle: Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.

### MCQ-048 | W2 | CORS and middleware | Practical | Application

A browser sends a CORS preflight before a credentialed cross-origin `POST`. Which HTTP method is used for the preflight?

A. `PATCH`
B. `CONNECT`
C. `OPTIONS`
D. `TRACE`

**Answer:** C. `OPTIONS`

**Simple explanation:** The browser uses an `OPTIONS` request to ask whether the target origin permits the intended method, headers, and credentials.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. CORS preflight is browser policy negotiation, so curl may succeed even when the browser blocks the call.

**Exam takeaway:** CORS preflight is browser policy negotiation, so curl may succeed even when the browser blocks the call.

### MCQ-049 | W2 | OAuth 2.0 | Concept | Foundation

Which statement most accurately explains the main principle of OAuth 2.0?

A. Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.
B. Ask for the provider password
C. Put the client secret in browser JavaScript
D. Reuse an access token forever

**Answer:** A. Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.

**Simple explanation:** Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of OAuth 2.0.

**Exam takeaway:** Remember: Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.

### MCQ-050 | W2 | OAuth 2.0 | Application | Application

A web app needs access to a user-owned provider resource without collecting the provider password. What should the team do first?

A. Ask for the provider password
B. Put the client secret in browser JavaScript
C. Reuse an access token forever
D. Redirect for authorization and exchange the code securely for scoped delegated access

**Answer:** D. Redirect for authorization and exchange the code securely for scoped delegated access

**Simple explanation:** Redirect for authorization and exchange the code securely for scoped delegated access. This directly addresses the stated situation while following the principle: distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.

### MCQ-051 | W2 | OAuth 2.0 | Debugging | Analysis

While debugging OAuth 2.0, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Ask for the provider password
D. Redirect for authorization and exchange the code securely for scoped delegated access

**Answer:** C. Ask for the provider password

**Simple explanation:** The response "Ask for the provider password" is the weakest choice because it does not solve the root problem and conflicts with this principle: Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.

### MCQ-052 | W2 | OAuth 2.0 | Practical | Application

What is the main security purpose of the OAuth `state` value in an authorization-code flow?

A. Increase the lifetime of a refresh token
B. Bind the callback to the login attempt and reduce CSRF/login-substitution attacks
C. Encrypt the access token
D. Replace the provider redirect URI

**Answer:** B. Bind the callback to the login attempt and reduce CSRF/login-substitution attacks

**Simple explanation:** The client creates an unpredictable state value before redirecting and verifies the same value on callback. A mismatch means the response is not tied to that login attempt.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. State protects the authorization flow; it is not token encryption.

**Exam takeaway:** State protects the authorization flow; it is not token encryption.

### MCQ-053 | W2 | Configuration and secrets | Concept | Foundation

Which statement most accurately explains the main principle of Configuration and secrets?

A. Delete the log and keep using the token
B. Print all secrets during health checks
C. Hard-code a new credential in the repository
D. Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

**Answer:** D. Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

**Simple explanation:** Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Configuration and secrets.

**Exam takeaway:** Remember: Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

### MCQ-054 | W2 | Configuration and secrets | Application | Application

A production token appears in a public CI log while the same service runs locally, in CI, and in production. What should the team do first?

A. Print all secrets during health checks
B. Hard-code a new credential in the repository
C. Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement
D. Delete the log and keep using the token

**Answer:** C. Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement

**Simple explanation:** Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement. This directly addresses the stated situation while following the principle: load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

### MCQ-055 | W2 | Configuration and secrets | Debugging | Analysis

While debugging Configuration and secrets, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Print all secrets during health checks
C. Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Print all secrets during health checks

**Simple explanation:** The response "Print all secrets during health checks" is the weakest choice because it does not solve the root problem and conflicts with this principle: Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

### MCQ-056 | W2 | Configuration and secrets | Evidence | Evaluation

Select all evidence that would materially support saying that the Configuration and secrets solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

### MCQ-057 | W2 | Containers and deployment | Concept | Foundation

Which statement most accurately explains the main principle of Containers and deployment?

A. Bake credentials into the image
B. Assume host localhost names every container
C. Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.
D. Bind only to localhost inside the container

**Answer:** C. Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.

**Simple explanation:** Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Containers and deployment.

**Exam takeaway:** Remember: Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.

### MCQ-058 | W2 | Containers and deployment | Application | Application

A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost. What should the team do first?

A. Assume host localhost names every container
B. Bind to the configured interface and port, use the service network name, and keep secrets outside the image
C. Bind only to localhost inside the container
D. Bake credentials into the image

**Answer:** B. Bind to the configured interface and port, use the service network name, and keep secrets outside the image

**Simple explanation:** Bind to the configured interface and port, use the service network name, and keep secrets outside the image. This directly addresses the stated situation while following the principle: build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.

### MCQ-059 | W2 | Containers and deployment | Debugging | Analysis

While debugging Containers and deployment, which proposed response is the least defensible?

A. Assume host localhost names every container
B. Bind to the configured interface and port, use the service network name, and keep secrets outside the image
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Assume host localhost names every container

**Simple explanation:** The response "Assume host localhost names every container" is the weakest choice because it does not solve the root problem and conflicts with this principle: Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.

### MCQ-060 | W2 | Containers and deployment | Practical | Application

A container platform provides port `8080`, but the app listens on `127.0.0.1:8000`. Which change is normally required?

A. Keep loopback and expose a random Docker port
B. Bake the platform credentials into the image
C. Write the server output to a local HTML file
D. Listen on `0.0.0.0` and the platform-provided port

**Answer:** D. Listen on `0.0.0.0` and the platform-provided port

**Simple explanation:** Loopback accepts connections only from inside the container. The platform router needs the process to listen on all container interfaces and the assigned port.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. `0.0.0.0` changes the bind interface; the platform still controls external routing.

**Exam takeaway:** `0.0.0.0` changes the bind interface; the platform still controls external routing.

### MCQ-061 | W2 | Logging, testing, and observability | Concept | Foundation

Which statement most accurately explains the main principle of Logging, testing, and observability?

A. Restart every service until the dashboard looks normal
B. Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.
C. Use the average and raw error count alone
D. Treat a green liveness probe as proof of readiness

**Answer:** B. Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.

**Simple explanation:** Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Logging, testing, and observability.

**Exam takeaway:** Remember: Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.

### MCQ-062 | W2 | Logging, testing, and observability | Application | Application

Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency. What should the team do first?

A. Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix
B. Use the average and raw error count alone
C. Treat a green liveness probe as proof of readiness
D. Restart every service until the dashboard looks normal

**Answer:** A. Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix

**Simple explanation:** Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix. This directly addresses the stated situation while following the principle: read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.

### MCQ-063 | W2 | Logging, testing, and observability | Debugging | Analysis

While debugging Logging, testing, and observability, which proposed response is the least defensible?

A. Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use the average and raw error count alone

**Answer:** D. Use the average and raw error count alone

**Simple explanation:** The response "Use the average and raw error count alone" is the weakest choice because it does not solve the root problem and conflicts with this principle: Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.

### MCQ-064 | W2 | Logging, testing, and observability | Practical | Application

Which Prometheus design is safest for measuring API latency?

A. Put the full URL, token, and user email in metric labels
B. Create a new metric name for every request
C. Use a histogram with bounded labels such as route and method, and keep user IDs in logs/traces
D. Use a gauge labeled with every request ID

**Answer:** C. Use a histogram with bounded labels such as route and method, and keep user IDs in logs/traces

**Simple explanation:** Histograms support latency distributions and quantiles. Bounded labels avoid the high-cardinality explosion caused by per-user or per-request values.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Metrics aggregate; logs and traces carry high-cardinality request detail.

**Exam takeaway:** Metrics aggregate; logs and traces carry high-cardinality request detail.

### MCQ-065 | W3 | Prompt foundations | Concept | Foundation

Which statement most accurately explains the main principle of Prompt foundations?

A. State the task, constraints, context, output requirements, and examples with unambiguous instructions.
B. Make the prompt shorter by removing constraints
C. Ask for a secret chain of thought
D. Randomize the labels

**Answer:** A. State the task, constraints, context, output requirements, and examples with unambiguous instructions.

**Simple explanation:** State the task, constraints, context, output requirements, and examples with unambiguous instructions. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Prompt foundations.

**Exam takeaway:** Remember: State the task, constraints, context, output requirements, and examples with unambiguous instructions.

### MCQ-066 | W3 | Prompt foundations | Application | Application

An LLM returns inconsistent formats for the same classification task. What should the team do first?

A. Make the prompt shorter by removing constraints
B. Ask for a secret chain of thought
C. Randomize the labels
D. Specify the contract and include representative examples

**Answer:** D. Specify the contract and include representative examples

**Simple explanation:** Specify the contract and include representative examples. This directly addresses the stated situation while following the principle: state the task, constraints, context, output requirements, and examples with unambiguous instructions.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: State the task, constraints, context, output requirements, and examples with unambiguous instructions.

### MCQ-067 | W3 | Prompt foundations | Debugging | Analysis

While debugging Prompt foundations, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Ask for a secret chain of thought
D. Specify the contract and include representative examples

**Answer:** C. Ask for a secret chain of thought

**Simple explanation:** The response "Ask for a secret chain of thought" is the weakest choice because it does not solve the root problem and conflicts with this principle: State the task, constraints, context, output requirements, and examples with unambiguous instructions.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: State the task, constraints, context, output requirements, and examples with unambiguous instructions.

### MCQ-068 | W3 | Prompt foundations | Evidence | Evaluation

Select all evidence that would materially support saying that the Prompt foundations solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Specify the contract and include representative examples. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

**Answer:** B, C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Specify the contract and include representative examples. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: State the task, constraints, context, output requirements, and examples with unambiguous instructions.

### MCQ-069 | W3 | Reliable output control | Concept | Foundation

Which statement most accurately explains the main principle of Reliable output control?

A. Regex any text without checking failure
B. Accept missing or unknown fields forever
C. Ask the model to be more confident
D. Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

**Answer:** D. Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

**Simple explanation:** Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Reliable output control.

**Exam takeaway:** Remember: Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

### MCQ-070 | W3 | Reliable output control | Application | Application

A downstream service expects an enum and two required fields, but the model sometimes invents a third value. What should the team do first?

A. Accept missing or unknown fields forever
B. Ask the model to be more confident
C. Validate structured output and the relevant invariant, then reject or repair only within a bounded policy
D. Regex any text without checking failure

**Answer:** C. Validate structured output and the relevant invariant, then reject or repair only within a bounded policy

**Simple explanation:** Validate structured output and the relevant invariant, then reject or repair only within a bounded policy. This directly addresses the stated situation while following the principle: verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

### MCQ-071 | W3 | Reliable output control | Debugging | Analysis

While debugging Reliable output control, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Ask the model to be more confident
C. Validate structured output and the relevant invariant, then reject or repair only within a bounded policy
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Ask the model to be more confident

**Simple explanation:** The response "Ask the model to be more confident" is the weakest choice because it does not solve the root problem and conflicts with this principle: Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

### MCQ-072 | W3 | Reliable output control | Practical | Application

An LLM response must contain `status` as one of `approved|rejected` and a non-empty `reason`. What is the strongest control?

A. Request schema-constrained output, validate it, and use a bounded repair or failure path
B. Search the prose for the word `approved`
C. Accept missing fields and guess their values
D. Ask the model to be more confident without validation

**Answer:** A. Request schema-constrained output, validate it, and use a bounded repair or failure path

**Simple explanation:** A schema makes allowed values and required fields executable. Validation catches malformed output; a bounded repair prevents infinite retry loops.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Valid JSON is not enough; validate the required types and semantic constraints.

**Exam takeaway:** Valid JSON is not enough; validate the required types and semantic constraints.

### MCQ-073 | W3 | Context and prompt caching | Concept | Foundation

Which statement most accurately explains the main principle of Context and prompt caching?

A. Put secrets in the cache key
B. Disable expiration for every cache
C. Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.
D. Cache all user data indefinitely

**Answer:** C. Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.

**Simple explanation:** Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Context and prompt caching.

**Exam takeaway:** Remember: Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.

### MCQ-074 | W3 | Context and prompt caching | Application | Application

A large stable system instruction is repeated across thousands of requests. What should the team do first?

A. Disable expiration for every cache
B. Cache the stable prefix and isolate user-specific content
C. Cache all user data indefinitely
D. Put secrets in the cache key

**Answer:** B. Cache the stable prefix and isolate user-specific content

**Simple explanation:** Cache the stable prefix and isolate user-specific content. This directly addresses the stated situation while following the principle: supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.

### MCQ-075 | W3 | Context and prompt caching | Debugging | Analysis

While debugging Context and prompt caching, which proposed response is the least defensible?

A. Cache all user data indefinitely
B. Cache the stable prefix and isolate user-specific content
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Cache all user data indefinitely

**Simple explanation:** The response "Cache all user data indefinitely" is the weakest choice because it does not solve the root problem and conflicts with this principle: Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.

### MCQ-076 | W3 | Context and prompt caching | Practical | Application

Which request layout is most likely to benefit from provider prompt caching?

A. A different system prompt at the start of every request
B. Random bytes inserted before the reusable document
C. Only a short unique user message with no reusable prefix
D. A large stable instruction/document prefix followed by a small changing user query

**Answer:** D. A large stable instruction/document prefix followed by a small changing user query

**Simple explanation:** Prompt caches match reusable prefixes. Stable material should appear before changing request-specific content so many calls can share it.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Small changes near the beginning can invalidate the reusable prefix.

**Exam takeaway:** Small changes near the beginning can invalidate the reusable prefix.

### MCQ-077 | W3 | Embeddings and similarity | Concept | Foundation

Which statement most accurately explains the main principle of Embeddings and similarity?

A. Sort by document length alone
B. Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.
C. Compare raw strings only
D. Use a random vector per document

**Answer:** B. Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.

**Simple explanation:** Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Embeddings and similarity.

**Exam takeaway:** Remember: Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.

### MCQ-078 | W3 | Embeddings and similarity | Application | Application

A search system must retrieve semantically related documents despite different wording. What should the team do first?

A. Embed queries and documents consistently, then inspect similarity quality
B. Compare raw strings only
C. Use a random vector per document
D. Sort by document length alone

**Answer:** A. Embed queries and documents consistently, then inspect similarity quality

**Simple explanation:** Embed queries and documents consistently, then inspect similarity quality. This directly addresses the stated situation while following the principle: represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.

### MCQ-079 | W3 | Embeddings and similarity | Debugging | Analysis

While debugging Embeddings and similarity, which proposed response is the least defensible?

A. Embed queries and documents consistently, then inspect similarity quality
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use a random vector per document

**Answer:** D. Use a random vector per document

**Simple explanation:** The response "Use a random vector per document" is the weakest choice because it does not solve the root problem and conflicts with this principle: Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.

### MCQ-080 | W3 | Embeddings and similarity | Practical | Application

Two already normalized embedding vectors are `a = [1, 0]` and `b = [0.8, 0.6]`. What is their cosine similarity?

A. `1.4`
B. `0.0`
C. `0.8`
D. `0.6`

**Answer:** C. `0.8`

**Simple explanation:** For normalized vectors, cosine similarity equals the dot product: `(1 x 0.8) + (0 x 0.6) = 0.8`. No additional magnitude division changes the result because each vector already has length one.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Cosine similarity is the dot product divided by both vector magnitudes.

**Exam takeaway:** Cosine similarity is the dot product divided by both vector magnitudes.

### MCQ-081 | W3 | LLM architecture and tooling | Concept | Foundation

Which statement most accurately explains the main principle of LLM architecture and tooling?

A. Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.
B. Hard-code one provider in every call site
C. Log only the final answer
D. Optimize latency without measuring it

**Answer:** A. Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

**Simple explanation:** Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of LLM architecture and tooling.

**Exam takeaway:** Remember: Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

### MCQ-082 | W3 | LLM architecture and tooling | Application | Application

A team needs provider portability and per-request cost traces. What should the team do first?

A. Hard-code one provider in every call site
B. Log only the final answer
C. Optimize latency without measuring it
D. Use an abstraction or gateway with explicit tracing and fallback policy

**Answer:** D. Use an abstraction or gateway with explicit tracing and fallback policy

**Simple explanation:** Use an abstraction or gateway with explicit tracing and fallback policy. This directly addresses the stated situation while following the principle: choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

### MCQ-083 | W3 | LLM architecture and tooling | Debugging | Analysis

While debugging LLM architecture and tooling, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Optimize latency without measuring it
D. Use an abstraction or gateway with explicit tracing and fallback policy

**Answer:** C. Optimize latency without measuring it

**Simple explanation:** The response "Optimize latency without measuring it" is the weakest choice because it does not solve the root problem and conflicts with this principle: Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

### MCQ-084 | W3 | LLM architecture and tooling | Evidence | Evaluation

Select all evidence that would materially support saying that the LLM architecture and tooling solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use an abstraction or gateway with explicit tracing and fallback policy. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

**Answer:** B, C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use an abstraction or gateway with explicit tracing and fallback policy. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

### MCQ-085 | W4 | Vector databases and chunking | Concept | Foundation

Which statement most accurately explains the main principle of Vector databases and chunking?

A. Split every 10 characters
B. Remove all metadata
C. Embed the entire corpus as one vector
D. Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

**Answer:** D. Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

**Simple explanation:** Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Vector databases and chunking.

**Exam takeaway:** Remember: Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

### MCQ-086 | W4 | Vector databases and chunking | Application | Application

A policy document contains headings, tables, and long sections. What should the team do first?

A. Remove all metadata
B. Embed the entire corpus as one vector
C. Chunk by semantic structure and retain source metadata
D. Split every 10 characters

**Answer:** C. Chunk by semantic structure and retain source metadata

**Simple explanation:** Chunk by semantic structure and retain source metadata. This directly addresses the stated situation while following the principle: store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

### MCQ-087 | W4 | Vector databases and chunking | Debugging | Analysis

While debugging Vector databases and chunking, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Split every 10 characters
C. Chunk by semantic structure and retain source metadata
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Split every 10 characters

**Simple explanation:** The response "Split every 10 characters" is the weakest choice because it does not solve the root problem and conflicts with this principle: Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

### MCQ-088 | W4 | Vector databases and chunking | Practical | Application

A Markdown policy manual has clear section headings, and answers must cite their section. Which initial chunking strategy is strongest?

A. Chunk by heading/section and retain heading plus source metadata
B. Split every ten characters and discard headings
C. Store the whole manual as one vector
D. Randomly shuffle paragraphs before embedding

**Answer:** A. Chunk by heading/section and retain heading plus source metadata

**Simple explanation:** Header-based chunks align retrieval units with the document structure and preserve the context needed for meaningful citations.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Choose chunk boundaries that match answerable units, then measure retrieval quality.

**Exam takeaway:** Choose chunk boundaries that match answerable units, then measure retrieval quality.

### MCQ-089 | W4 | Late and contextual retrieval | Concept | Foundation

Which statement most accurately explains the main principle of Late and contextual retrieval?

A. Replace the chunk with a guess
B. Return the nearest chunk without its source
C. Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.
D. Discard the parent heading

**Answer:** C. Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

**Simple explanation:** Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Late and contextual retrieval.

**Exam takeaway:** Remember: Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

### MCQ-090 | W4 | Late and contextual retrieval | Application | Application

A short chunk says “this limit” but its meaning is defined in the parent section. What should the team do first?

A. Return the nearest chunk without its source
B. Attach useful context before embedding or retrieval and keep provenance
C. Discard the parent heading
D. Replace the chunk with a guess

**Answer:** B. Attach useful context before embedding or retrieval and keep provenance

**Simple explanation:** Attach useful context before embedding or retrieval and keep provenance. This directly addresses the stated situation while following the principle: use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

### MCQ-091 | W4 | Late and contextual retrieval | Debugging | Analysis

While debugging Late and contextual retrieval, which proposed response is the least defensible?

A. Replace the chunk with a guess
B. Attach useful context before embedding or retrieval and keep provenance
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Replace the chunk with a guess

**Simple explanation:** The response "Replace the chunk with a guess" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

### MCQ-092 | W4 | Late and contextual retrieval | Evidence | Evaluation

Select all evidence that would materially support saying that the Late and contextual retrieval solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Attach useful context before embedding or retrieval and keep provenance. The test includes normal and edge cases.

**Answer:** A, D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result. | A repeatable before-and-after test shows that the original failure is fixed after applying this response: Attach useful context before embedding or retrieval and keep provenance. The test includes normal and edge cases.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

### MCQ-093 | W4 | Hybrid search and reranking | Concept | Foundation

Which statement most accurately explains the main principle of Hybrid search and reranking?

A. Rerank the entire internet without candidates
B. Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.
C. Use only a stopword count
D. Use only the first vector hit

**Answer:** B. Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.

**Simple explanation:** Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Hybrid search and reranking.

**Exam takeaway:** Remember: Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.

### MCQ-094 | W4 | Hybrid search and reranking | Application | Application

A query contains a product code and a natural-language description. What should the team do first?

A. Retrieve with complementary signals and rerank the shortlist
B. Use only a stopword count
C. Use only the first vector hit
D. Rerank the entire internet without candidates

**Answer:** A. Retrieve with complementary signals and rerank the shortlist

**Simple explanation:** Retrieve with complementary signals and rerank the shortlist. This directly addresses the stated situation while following the principle: combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.

### MCQ-095 | W4 | Hybrid search and reranking | Debugging | Analysis

While debugging Hybrid search and reranking, which proposed response is the least defensible?

A. Retrieve with complementary signals and rerank the shortlist
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Rerank the entire internet without candidates

**Answer:** D. Rerank the entire internet without candidates

**Simple explanation:** The response "Rerank the entire internet without candidates" is the weakest choice because it does not solve the root problem and conflicts with this principle: Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.

### MCQ-096 | W4 | Hybrid search and reranking | Practical | Application

With reciprocal rank fusion `score = 1/(60 + rank)`, a document ranks 1st in dense search and 4th in BM25. What is its approximate fused score?

A. `(0.8 + 12.0) / 2 = 6.4` using unrelated raw scores
B. `1/(60 + 1 + 4)`, approximately `0.0154`
C. `1/61 + 1/64`, approximately `0.0320`
D. `1 + 4 = 5`

**Answer:** C. `1/61 + 1/64`, approximately `0.0320`

**Simple explanation:** RRF adds one reciprocal term for each ranking: about `0.01639 + 0.01563 = 0.03202`. It combines ranks, not incomparable raw scores.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. RRF rewards documents that rank well across complementary retrievers.

**Exam takeaway:** RRF rewards documents that rank well across complementary retrievers.

### MCQ-097 | W4 | Query augmentation and semantic caching | Concept | Foundation

Which statement most accurately explains the main principle of Query augmentation and semantic caching?

A. Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.
B. Cache every answer forever
C. Rewrite away critical identifiers
D. Ignore source freshness

**Answer:** A. Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

**Simple explanation:** Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Query augmentation and semantic caching.

**Exam takeaway:** Remember: Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

### MCQ-098 | W4 | Query augmentation and semantic caching | Application | Application

Users ask the same question with minor wording changes while source data updates hourly. What should the team do first?

A. Cache every answer forever
B. Rewrite away critical identifiers
C. Ignore source freshness
D. Normalize intent, cache within a freshness boundary, and preserve variants

**Answer:** D. Normalize intent, cache within a freshness boundary, and preserve variants

**Simple explanation:** Normalize intent, cache within a freshness boundary, and preserve variants. This directly addresses the stated situation while following the principle: expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

### MCQ-099 | W4 | Query augmentation and semantic caching | Debugging | Analysis

While debugging Query augmentation and semantic caching, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Cache every answer forever
D. Normalize intent, cache within a freshness boundary, and preserve variants

**Answer:** C. Cache every answer forever

**Simple explanation:** The response "Cache every answer forever" is the weakest choice because it does not solve the root problem and conflicts with this principle: Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

### MCQ-100 | W4 | Query augmentation and semantic caching | Evidence | Evaluation

Select all evidence that would materially support saying that the Query augmentation and semantic caching solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Normalize intent, cache within a freshness boundary, and preserve variants. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

**Answer:** B, C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Normalize intent, cache within a freshness boundary, and preserve variants. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

### MCQ-101 | W4 | Grounding and RAG evaluation | Concept | Foundation

Which statement most accurately explains the main principle of Grounding and RAG evaluation?

A. Score only grammar
B. Treat a fluent answer as grounded
C. Remove citations to improve style
D. Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

**Answer:** D. Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

**Simple explanation:** Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Grounding and RAG evaluation.

**Exam takeaway:** Remember: Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

### MCQ-102 | W4 | Grounding and RAG evaluation | Application | Application

A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday. What should the team do first?

A. Treat a fluent answer as grounded
B. Remove citations to improve style
C. Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently
D. Score only grammar

**Answer:** C. Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently

**Simple explanation:** Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently. This directly addresses the stated situation while following the principle: ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

### MCQ-103 | W4 | Grounding and RAG evaluation | Debugging | Analysis

While debugging Grounding and RAG evaluation, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Treat a fluent answer as grounded
C. Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Treat a fluent answer as grounded

**Simple explanation:** The response "Treat a fluent answer as grounded" is the weakest choice because it does not solve the root problem and conflicts with this principle: Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

### MCQ-104 | W4 | Grounding and RAG evaluation | Practical | Application

A RAG answer is fluent and relevant, but several claims are not supported by retrieved passages. Which evaluation dimension is most directly weak?

A. Faithfulness/groundedness
B. Context recall only
C. Grammar quality
D. Embedding dimensionality

**Answer:** A. Faithfulness/groundedness

**Simple explanation:** Faithfulness asks whether the answer claims follow from the supplied evidence. Relevance alone does not prove support: an answer can discuss the correct subject while inventing details that no retrieved passage contains.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Evaluate retrieval and generation separately; a good-sounding answer can still be ungrounded.

**Exam takeaway:** Evaluate retrieval and generation separately; a good-sounding answer can still be ungrounded.

### MCQ-105 | W5 | Agent fundamentals and tool calling | Concept | Foundation

Which statement most accurately explains the main principle of Agent fundamentals and tool calling?

A. Let tool names be free-form code
B. Skip tool-result validation
C. Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.
D. Give the model unrestricted shell access

**Answer:** C. Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

**Simple explanation:** Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Agent fundamentals and tool calling.

**Exam takeaway:** Remember: Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

### MCQ-106 | W5 | Agent fundamentals and tool calling | Application | Application

An agent can read documents but must not execute arbitrary shell commands. What should the team do first?

A. Skip tool-result validation
B. Expose least-privilege tools with validated arguments
C. Give the model unrestricted shell access
D. Let tool names be free-form code

**Answer:** B. Expose least-privilege tools with validated arguments

**Simple explanation:** Expose least-privilege tools with validated arguments. This directly addresses the stated situation while following the principle: constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

### MCQ-107 | W5 | Agent fundamentals and tool calling | Debugging | Analysis

While debugging Agent fundamentals and tool calling, which proposed response is the least defensible?

A. Skip tool-result validation
B. Expose least-privilege tools with validated arguments
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Skip tool-result validation

**Simple explanation:** The response "Skip tool-result validation" is the weakest choice because it does not solve the root problem and conflicts with this principle: Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

### MCQ-108 | W5 | Agent fundamentals and tool calling | Evidence | Evaluation

Select all evidence that would materially support saying that the Agent fundamentals and tool calling solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Expose least-privilege tools with validated arguments. The test includes normal and edge cases.

**Answer:** A, D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result. | A repeatable before-and-after test shows that the original failure is fixed after applying this response: Expose least-privilege tools with validated arguments. The test includes normal and edge cases.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

### MCQ-109 | W5 | Agent evaluation | Concept | Foundation

Which statement most accurately explains the main principle of Agent evaluation?

A. Delete failed traces
B. Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.
C. Use success rate alone
D. Evaluate on one happy path

**Answer:** B. Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.

**Simple explanation:** Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Agent evaluation.

**Exam takeaway:** Remember: Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.

### MCQ-110 | W5 | Agent evaluation | Application | Application

A benchmark score improves while unsafe tool calls increase. What should the team do first?

A. Track safety and operational metrics alongside success
B. Use success rate alone
C. Evaluate on one happy path
D. Delete failed traces

**Answer:** A. Track safety and operational metrics alongside success

**Simple explanation:** Track safety and operational metrics alongside success. This directly addresses the stated situation while following the principle: evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.

### MCQ-111 | W5 | Agent evaluation | Debugging | Analysis

While debugging Agent evaluation, which proposed response is the least defensible?

A. Track safety and operational metrics alongside success
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use success rate alone

**Answer:** D. Use success rate alone

**Simple explanation:** The response "Use success rate alone" is the weakest choice because it does not solve the root problem and conflicts with this principle: Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.

### MCQ-112 | W5 | Agent evaluation | Practical | Application

Agent A solves 88% of tasks but makes unsafe tool calls in 9%; Agent B solves 84% with no unsafe calls. Which conclusion is defensible?

A. Agent B always wins regardless of task requirements
B. Delete unsafe traces and compare success rate again
C. No single winner can be declared until safety thresholds and task costs are specified
D. Agent A always wins because 88 is larger than 84

**Answer:** C. No single winner can be declared until safety thresholds and task costs are specified

**Simple explanation:** Agent evaluation is multi-dimensional. A safety threshold may disqualify Agent A, while task context determines how to trade success, cost, latency, and risk.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Define acceptance thresholds before comparing agents.

**Exam takeaway:** Define acceptance thresholds before comparing agents.

### MCQ-113 | W5 | Memory and loop engineering | Concept | Foundation

Which statement most accurately explains the main principle of Memory and loop engineering?

A. Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.
B. Let the loop continue until the model stops
C. Store every observation forever
D. Retry instantly without changing state

**Answer:** A. Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

**Simple explanation:** Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Memory and loop engineering.

**Exam takeaway:** Remember: Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

### MCQ-114 | W5 | Memory and loop engineering | Application | Application

An agent repeats a failed search and grows its prompt without limit. What should the team do first?

A. Let the loop continue until the model stops
B. Store every observation forever
C. Retry instantly without changing state
D. Use scoped memory and explicit iteration, token, and time budgets

**Answer:** D. Use scoped memory and explicit iteration, token, and time budgets

**Simple explanation:** Use scoped memory and explicit iteration, token, and time budgets. This directly addresses the stated situation while following the principle: separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

### MCQ-115 | W5 | Memory and loop engineering | Debugging | Analysis

While debugging Memory and loop engineering, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Store every observation forever
D. Use scoped memory and explicit iteration, token, and time budgets

**Answer:** C. Store every observation forever

**Simple explanation:** The response "Store every observation forever" is the weakest choice because it does not solve the root problem and conflicts with this principle: Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

### MCQ-116 | W5 | Memory and loop engineering | Evidence | Evaluation

Select all evidence that would materially support saying that the Memory and loop engineering solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use scoped memory and explicit iteration, token, and time budgets. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

**Answer:** B, C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use scoped memory and explicit iteration, token, and time budgets. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

### MCQ-117 | W5 | Multi-agent systems | Concept | Foundation

Which statement most accurately explains the main principle of Multi-agent systems?

A. Merge prose by concatenation
B. Give every worker every permission
C. Hide disagreements from the user
D. Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

**Answer:** D. Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

**Simple explanation:** Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Multi-agent systems.

**Exam takeaway:** Remember: Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

### MCQ-118 | W5 | Multi-agent systems | Application | Application

Several workers produce conflicting research claims. What should the team do first?

A. Give every worker every permission
B. Hide disagreements from the user
C. Use typed handoffs, provenance, and an adjudication step
D. Merge prose by concatenation

**Answer:** C. Use typed handoffs, provenance, and an adjudication step

**Simple explanation:** Use typed handoffs, provenance, and an adjudication step. This directly addresses the stated situation while following the principle: assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

### MCQ-119 | W5 | Multi-agent systems | Debugging | Analysis

While debugging Multi-agent systems, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Hide disagreements from the user
C. Use typed handoffs, provenance, and an adjudication step
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Hide disagreements from the user

**Simple explanation:** The response "Hide disagreements from the user" is the weakest choice because it does not solve the root problem and conflicts with this principle: Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

### MCQ-120 | W5 | Multi-agent systems | Evidence | Evaluation

Select all evidence that would materially support saying that the Multi-agent systems solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use typed handoffs, provenance, and an adjudication step. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use typed handoffs, provenance, and an adjudication step. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

### MCQ-121 | W5 | MCP, async, and sandboxing | Concept | Foundation

Which statement most accurately explains the main principle of MCP, async, and sandboxing?

A. Ignore cancellation after dispatch
B. Run untrusted code on the host
C. Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.
D. Spawn unlimited tasks

**Answer:** C. Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.

**Simple explanation:** Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of MCP, async, and sandboxing.

**Exam takeaway:** Remember: Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.

### MCQ-122 | W5 | MCP, async, and sandboxing | Application | Application

Parallel tasks can call a remote tool but must stop when the user cancels. What should the team do first?

A. Run untrusted code on the host
B. Propagate cancellation and bound concurrency inside a sandbox
C. Spawn unlimited tasks
D. Ignore cancellation after dispatch

**Answer:** B. Propagate cancellation and bound concurrency inside a sandbox

**Simple explanation:** Propagate cancellation and bound concurrency inside a sandbox. This directly addresses the stated situation while following the principle: treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.

### MCQ-123 | W5 | MCP, async, and sandboxing | Debugging | Analysis

While debugging MCP, async, and sandboxing, which proposed response is the least defensible?

A. Spawn unlimited tasks
B. Propagate cancellation and bound concurrency inside a sandbox
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Spawn unlimited tasks

**Simple explanation:** The response "Spawn unlimited tasks" is the weakest choice because it does not solve the root problem and conflicts with this principle: Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.

### MCQ-124 | W5 | MCP, async, and sandboxing | Practical | Application

A scraper launches 500 detail-page requests against a rate-limited service. Which async design is safest?

A. Start all requests without a limit
B. Run blocking HTTP calls directly inside the event loop
C. Ignore cancellation and failed tasks
D. Use a bounded semaphore, explicit timeouts, and collected per-task errors

**Answer:** D. Use a bounded semaphore, explicit timeouts, and collected per-task errors

**Simple explanation:** A semaphore caps in-flight work, timeouts bound waiting, and explicit result/error collection prevents silent task failures.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Concurrency improves I/O throughput only when resource and failure limits are explicit.

**Exam takeaway:** Concurrency improves I/O throughput only when resource and failure limits are explicit.

### MCQ-125 | W6 | Legal and ethical scraping | Concept | Foundation

Which statement most accurately explains the main principle of Legal and ethical scraping?

A. Use personal data because it is public
B. Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.
C. Scrape and publish everything
D. Bypass access controls

**Answer:** B. Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

**Simple explanation:** Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Legal and ethical scraping.

**Exam takeaway:** Remember: Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

### MCQ-126 | W6 | Legal and ethical scraping | Application | Application

A public page contains personal information that is not needed for the task. What should the team do first?

A. Minimize collection and avoid using data outside the authorized purpose
B. Scrape and publish everything
C. Bypass access controls
D. Use personal data because it is public

**Answer:** A. Minimize collection and avoid using data outside the authorized purpose

**Simple explanation:** Minimize collection and avoid using data outside the authorized purpose. This directly addresses the stated situation while following the principle: respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

### MCQ-127 | W6 | Legal and ethical scraping | Debugging | Analysis

While debugging Legal and ethical scraping, which proposed response is the least defensible?

A. Minimize collection and avoid using data outside the authorized purpose
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Bypass access controls

**Answer:** D. Bypass access controls

**Simple explanation:** The response "Bypass access controls" is the weakest choice because it does not solve the root problem and conflicts with this principle: Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

### MCQ-128 | W6 | Legal and ethical scraping | Evidence | Evaluation

Select all evidence that would materially support saying that the Legal and ethical scraping solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Minimize collection and avoid using data outside the authorized purpose. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Answer:** C, D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Minimize collection and avoid using data outside the authorized purpose. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

### MCQ-129 | W6 | Hidden JSON APIs and structured sources | Concept | Foundation

Which statement most accurately explains the main principle of Hidden JSON APIs and structured sources?

A. Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.
B. Parse only the visible pixels
C. Guess an undocumented URL repeatedly
D. Ignore pagination metadata

**Answer:** A. Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.

**Simple explanation:** Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Hidden JSON APIs and structured sources.

**Exam takeaway:** Remember: Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.

### MCQ-130 | W6 | Hidden JSON APIs and structured sources | Application | Application

The page renders a table from an XHR JSON response. What should the team do first?

A. Parse only the visible pixels
B. Guess an undocumented URL repeatedly
C. Ignore pagination metadata
D. Identify the endpoint, parameters, schema, and access conditions

**Answer:** D. Identify the endpoint, parameters, schema, and access conditions

**Simple explanation:** Identify the endpoint, parameters, schema, and access conditions. This directly addresses the stated situation while following the principle: inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.

### MCQ-131 | W6 | Hidden JSON APIs and structured sources | Debugging | Analysis

While debugging Hidden JSON APIs and structured sources, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Ignore pagination metadata
D. Identify the endpoint, parameters, schema, and access conditions

**Answer:** C. Ignore pagination metadata

**Simple explanation:** The response "Ignore pagination metadata" is the weakest choice because it does not solve the root problem and conflicts with this principle: Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.

### MCQ-132 | W6 | Hidden JSON APIs and structured sources | Practical | Application

A page table is populated by an XHR request visible in DevTools. What is the best first extraction approach when use is authorized?

A. Copy browser-only headers and credentials into public code
B. Reproduce the minimal JSON request and validate its pagination and schema
C. OCR screenshots of every table row
D. Guess category URLs without observing the request

**Answer:** B. Reproduce the minimal JSON request and validate its pagination and schema

**Simple explanation:** The structured endpoint is usually simpler and less fragile than rendered HTML. The request still needs authorization, pagination, and schema checks.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Prefer the cleanest legitimate structured source, not the most visually obvious source.

**Exam takeaway:** Prefer the cleanest legitimate structured source, not the most visually obvious source.

### MCQ-133 | W6 | Browser automation and pagination | Concept | Foundation

Which statement most accurately explains the main principle of Browser automation and pagination?

A. Loop a fixed number of clicks blindly
B. Use pixel coordinates as the only selector
C. Stop after the first viewport
D. Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

**Answer:** D. Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

**Simple explanation:** Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Browser automation and pagination.

**Exam takeaway:** Remember: Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

### MCQ-134 | W6 | Browser automation and pagination | Application | Application

A catalog loads the next page only after a button click. What should the team do first?

A. Use pixel coordinates as the only selector
B. Stop after the first viewport
C. Observe the UI state, paginate until exhaustion, and deduplicate by stable ID
D. Loop a fixed number of clicks blindly

**Answer:** C. Observe the UI state, paginate until exhaustion, and deduplicate by stable ID

**Simple explanation:** Observe the UI state, paginate until exhaustion, and deduplicate by stable ID. This directly addresses the stated situation while following the principle: use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

### MCQ-135 | W6 | Browser automation and pagination | Debugging | Analysis

While debugging Browser automation and pagination, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Loop a fixed number of clicks blindly
C. Observe the UI state, paginate until exhaustion, and deduplicate by stable ID
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Loop a fixed number of clicks blindly

**Simple explanation:** The response "Loop a fixed number of clicks blindly" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

### MCQ-136 | W6 | Browser automation and pagination | Evidence | Evaluation

Select all evidence that would materially support saying that the Browser automation and pagination solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Observe the UI state, paginate until exhaustion, and deduplicate by stable ID. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Observe the UI state, paginate until exhaustion, and deduplicate by stable ID. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

### MCQ-137 | W6 | Authenticated scraping | Concept | Foundation

Which statement most accurately explains the main principle of Authenticated scraping?

A. Reuse a token forever
B. Download every account page
C. Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.
D. Paste cookies into a public issue

**Answer:** C. Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

**Simple explanation:** Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Authenticated scraping.

**Exam takeaway:** Remember: Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

### MCQ-138 | W6 | Authenticated scraping | Application | Application

A permitted internal dashboard requires a session cookie. What should the team do first?

A. Download every account page
B. Use the approved account and least-privilege scope without logging secrets
C. Paste cookies into a public issue
D. Reuse a token forever

**Answer:** B. Use the approved account and least-privilege scope without logging secrets

**Simple explanation:** Use the approved account and least-privilege scope without logging secrets. This directly addresses the stated situation while following the principle: keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

### MCQ-139 | W6 | Authenticated scraping | Debugging | Analysis

While debugging Authenticated scraping, which proposed response is the least defensible?

A. Reuse a token forever
B. Use the approved account and least-privilege scope without logging secrets
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Reuse a token forever

**Simple explanation:** The response "Reuse a token forever" is the weakest choice because it does not solve the root problem and conflicts with this principle: Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

### MCQ-140 | W6 | Authenticated scraping | Evidence | Evaluation

Select all evidence that would materially support saying that the Authenticated scraping solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use the approved account and least-privilege scope without logging secrets. The test includes normal and edge cases.

**Answer:** A, D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result. | A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use the approved account and least-privilege scope without logging secrets. The test includes normal and edge cases.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

### MCQ-141 | W6 | Rate limits, retries, and caching | Concept | Foundation

Which statement most accurately explains the main principle of Rate limits, retries, and caching?

A. Treat every timeout as proof that no write happened
B. Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.
C. Retry the write blindly until a 200 appears
D. Delete the partial output and restart without a run ID

**Answer:** B. Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.

**Simple explanation:** Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Rate limits, retries, and caching.

**Exam takeaway:** Remember: Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.

### MCQ-142 | W6 | Rate limits, retries, and caching | Application | Application

A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry. What should the team do first?

A. Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects
B. Retry the write blindly until a 200 appears
C. Delete the partial output and restart without a run ID
D. Treat every timeout as proof that no write happened

**Answer:** A. Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects

**Simple explanation:** Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects. This directly addresses the stated situation while following the principle: handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.

### MCQ-143 | W6 | Rate limits, retries, and caching | Debugging | Analysis

While debugging Rate limits, retries, and caching, which proposed response is the least defensible?

A. Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Treat every timeout as proof that no write happened

**Answer:** D. Treat every timeout as proof that no write happened

**Simple explanation:** The response "Treat every timeout as proof that no write happened" is the weakest choice because it does not solve the root problem and conflicts with this principle: Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.

### MCQ-144 | W6 | Rate limits, retries, and caching | Practical | Application

A GET request receives `429` with `Retry-After: 12`. What is the best next action?

A. Change the request to POST and send it repeatedly
B. Treat the 429 response body as successful data
C. Wait at least the indicated period, add bounded retry logic with jitter, and reduce concurrency
D. Retry immediately in a tight loop

**Answer:** C. Wait at least the indicated period, add bounded retry logic with jitter, and reduce concurrency

**Simple explanation:** `Retry-After` communicates the server delay. Bounded retries and lower concurrency reduce another burst and avoid an endless retry cycle.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Retry only appropriate operations, obey server guidance, and cap attempts and total time.

**Exam takeaway:** Retry only appropriate operations, obey server guidance, and cap attempts and total time.

### MCQ-145 | W6 | Change detection and anti-bot resilience | Concept | Foundation

Which statement most accurately explains the main principle of Change detection and anti-bot resilience?

A. Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.
B. Treat every DOM change as a new record
C. Hash raw timestamps only
D. Bypass every challenge

**Answer:** A. Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

**Simple explanation:** Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Change detection and anti-bot resilience.

**Exam takeaway:** Remember: Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

### MCQ-146 | W6 | Change detection and anti-bot resilience | Application | Application

A page layout changes but the underlying product record does not, while one product later changes price. What should the team do first?

A. Treat every DOM change as a new record
B. Hash raw timestamps only
C. Bypass every challenge
D. Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance

**Answer:** D. Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance

**Simple explanation:** Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance. This directly addresses the stated situation while following the principle: use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

### MCQ-147 | W6 | Change detection and anti-bot resilience | Debugging | Analysis

While debugging Change detection and anti-bot resilience, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Treat every DOM change as a new record
D. Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance

**Answer:** C. Treat every DOM change as a new record

**Simple explanation:** The response "Treat every DOM change as a new record" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

### MCQ-148 | W6 | Change detection and anti-bot resilience | Evidence | Evaluation

Select all evidence that would materially support saying that the Change detection and anti-bot resilience solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

**Answer:** B, C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

### MCQ-149 | W6 | HTML, tabular, and document parsing | Concept | Foundation

Which statement most accurately explains the main principle of HTML, tabular, and document parsing?

A. Split on commas in raw HTML
B. Trust OCR without review
C. Discard source locations
D. Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

**Answer:** D. Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

**Simple explanation:** Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of HTML, tabular, and document parsing.

**Exam takeaway:** Remember: Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

### MCQ-150 | W6 | HTML, tabular, and document parsing | Application | Application

An HTML table contains merged cells and a document has scanned pages. What should the team do first?

A. Trust OCR without review
B. Discard source locations
C. Use format-aware parsing and flag uncertain extraction
D. Split on commas in raw HTML

**Answer:** C. Use format-aware parsing and flag uncertain extraction

**Simple explanation:** Use format-aware parsing and flag uncertain extraction. This directly addresses the stated situation while following the principle: convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

### MCQ-151 | W6 | HTML, tabular, and document parsing | Debugging | Analysis

While debugging HTML, tabular, and document parsing, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Trust OCR without review
C. Use format-aware parsing and flag uncertain extraction
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Trust OCR without review

**Simple explanation:** The response "Trust OCR without review" is the weakest choice because it does not solve the root problem and conflicts with this principle: Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

### MCQ-152 | W6 | HTML, tabular, and document parsing | Evidence | Evaluation

Select all evidence that would materially support saying that the HTML, tabular, and document parsing solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use format-aware parsing and flag uncertain extraction. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use format-aware parsing and flag uncertain extraction. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

### MCQ-153 | W6 | Vision, speech, and video acquisition | Concept | Foundation

Which statement most accurately explains the main principle of Vision, speech, and video acquisition?

A. Remove timestamps
B. Present OCR guesses as facts
C. Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.
D. Use audio only

**Answer:** C. Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

**Simple explanation:** Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Vision, speech, and video acquisition.

**Exam takeaway:** Remember: Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

### MCQ-154 | W6 | Vision, speech, and video acquisition | Application | Application

A video contains spoken claims and on-screen figures. What should the team do first?

A. Present OCR guesses as facts
B. Align transcripts, frames, timestamps, and confidence before summarizing
C. Use audio only
D. Remove timestamps

**Answer:** B. Align transcripts, frames, timestamps, and confidence before summarizing

**Simple explanation:** Align transcripts, frames, timestamps, and confidence before summarizing. This directly addresses the stated situation while following the principle: treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

### MCQ-155 | W6 | Vision, speech, and video acquisition | Debugging | Analysis

While debugging Vision, speech, and video acquisition, which proposed response is the least defensible?

A. Present OCR guesses as facts
B. Align transcripts, frames, timestamps, and confidence before summarizing
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Present OCR guesses as facts

**Simple explanation:** The response "Present OCR guesses as facts" is the weakest choice because it does not solve the root problem and conflicts with this principle: Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

### MCQ-156 | W6 | Vision, speech, and video acquisition | Evidence | Evaluation

Select all evidence that would materially support saying that the Vision, speech, and video acquisition solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Align transcripts, frames, timestamps, and confidence before summarizing. The test includes normal and edge cases.

**Answer:** A, D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result. | A repeatable before-and-after test shows that the original failure is fixed after applying this response: Align transcripts, frames, timestamps, and confidence before summarizing. The test includes normal and edge cases.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

### MCQ-157 | W6 | OSINT and scheduled collection | Concept | Foundation

Which statement most accurately explains the main principle of OSINT and scheduled collection?

A. Overwrite the prior dossier
B. Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.
C. Search private accounts
D. Copy search snippets without URLs

**Answer:** B. Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

**Simple explanation:** Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of OSINT and scheduled collection.

**Exam takeaway:** Remember: Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

### MCQ-158 | W6 | OSINT and scheduled collection | Application | Application

A dossier must be refreshed weekly without duplicating old findings. What should the team do first?

A. Schedule an authorized job with provenance, deduplication, and change history
B. Search private accounts
C. Copy search snippets without URLs
D. Overwrite the prior dossier

**Answer:** A. Schedule an authorized job with provenance, deduplication, and change history

**Simple explanation:** Schedule an authorized job with provenance, deduplication, and change history. This directly addresses the stated situation while following the principle: use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

### MCQ-159 | W6 | OSINT and scheduled collection | Debugging | Analysis

While debugging OSINT and scheduled collection, which proposed response is the least defensible?

A. Schedule an authorized job with provenance, deduplication, and change history
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Search private accounts

**Answer:** D. Search private accounts

**Simple explanation:** The response "Search private accounts" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

### MCQ-160 | W6 | OSINT and scheduled collection | Evidence | Evaluation

Select all evidence that would materially support saying that the OSINT and scheduled collection solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Schedule an authorized job with provenance, deduplication, and change history. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Answer:** C, D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Schedule an authorized job with provenance, deduplication, and change history. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

### MCQ-161 | W7 | CI/CD and advanced Docker | Concept | Foundation

Which statement most accurately explains the main principle of CI/CD and advanced Docker?

A. Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.
B. Expose deployment credentials to every pull-request step
C. Rebuild a different image in production and roll out to everyone at once
D. Skip scans because the branch is internal

**Answer:** A. Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.

**Simple explanation:** Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of CI/CD and advanced Docker.

**Exam takeaway:** Remember: Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.

### MCQ-162 | W7 | CI/CD and advanced Docker | Application | Application

A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression. What should the team do first?

A. Expose deployment credentials to every pull-request step
B. Rebuild a different image in production and roll out to everyone at once
C. Skip scans because the branch is internal
D. Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy

**Answer:** D. Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy

**Simple explanation:** Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy. This directly addresses the stated situation while following the principle: isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.

### MCQ-163 | W7 | CI/CD and advanced Docker | Debugging | Analysis

While debugging CI/CD and advanced Docker, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Rebuild a different image in production and roll out to everyone at once
D. Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy

**Answer:** C. Rebuild a different image in production and roll out to everyone at once

**Simple explanation:** The response "Rebuild a different image in production and roll out to everyone at once" is the weakest choice because it does not solve the root problem and conflicts with this principle: Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.

### MCQ-164 | W7 | CI/CD and advanced Docker | Practical | Application

Which GitHub Actions policy is safest for deployment from pull requests created by untrusted forks?

A. Write secrets into build logs for debugging
B. Run tests with read-only permissions and do not expose deployment secrets to the forked code
C. Give every pull request production credentials
D. Deploy before tests so failures are visible sooner

**Answer:** B. Run tests with read-only permissions and do not expose deployment secrets to the forked code

**Simple explanation:** Forked code is untrusted and can read or exfiltrate anything made available to its job. Deployment should occur only in a trusted, reviewed context.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Workflow permissions and secret availability are part of the application security boundary.

**Exam takeaway:** Workflow permissions and secret availability are part of the application security boundary.

### MCQ-165 | W7 | LLM security and OWASP risks | Concept | Foundation

Which statement most accurately explains the main principle of LLM security and OWASP risks?

A. Tell the model in a stronger prompt never to exfiltrate
B. Print the secret for debugging
C. Give the retriever admin permissions
D. Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

**Answer:** D. Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

**Simple explanation:** Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of LLM security and OWASP risks.

**Exam takeaway:** Remember: Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

### MCQ-166 | W7 | LLM security and OWASP risks | Application | Application

Retrieved text tells an agent to ignore its system policy and exfiltrate a secret. What should the team do first?

A. Print the secret for debugging
B. Give the retriever admin permissions
C. Treat retrieved text as untrusted data and enforce server-side authorization and tool limits
D. Tell the model in a stronger prompt never to exfiltrate

**Answer:** C. Treat retrieved text as untrusted data and enforce server-side authorization and tool limits

**Simple explanation:** Treat retrieved text as untrusted data and enforce server-side authorization and tool limits. This directly addresses the stated situation while following the principle: treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

### MCQ-167 | W7 | LLM security and OWASP risks | Debugging | Analysis

While debugging LLM security and OWASP risks, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Give the retriever admin permissions
C. Treat retrieved text as untrusted data and enforce server-side authorization and tool limits
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Give the retriever admin permissions

**Simple explanation:** The response "Give the retriever admin permissions" is the weakest choice because it does not solve the root problem and conflicts with this principle: Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

### MCQ-168 | W7 | LLM security and OWASP risks | Evidence | Evaluation

Select all evidence that would materially support saying that the LLM security and OWASP risks solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Treat retrieved text as untrusted data and enforce server-side authorization and tool limits. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Treat retrieved text as untrusted data and enforce server-side authorization and tool limits. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

### MCQ-169 | W7 | VMs, SSH, serverless, and IaC | Concept | Foundation

Which statement most accurately explains the main principle of VMs, SSH, serverless, and IaC?

A. Share one root key
B. Apply the change directly because the plan is inconvenient
C. Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.
D. Make manual console edits only

**Answer:** C. Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

**Simple explanation:** Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of VMs, SSH, serverless, and IaC.

**Exam takeaway:** Remember: Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

### MCQ-170 | W7 | VMs, SSH, serverless, and IaC | Application | Application

A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments. What should the team do first?

A. Apply the change directly because the plan is inconvenient
B. Review the diff and blast radius, test the plan, and apply with scoped access and protected state
C. Make manual console edits only
D. Share one root key

**Answer:** B. Review the diff and blast radius, test the plan, and apply with scoped access and protected state

**Simple explanation:** Review the diff and blast radius, test the plan, and apply with scoped access and protected state. This directly addresses the stated situation while following the principle: use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

### MCQ-171 | W7 | VMs, SSH, serverless, and IaC | Debugging | Analysis

While debugging VMs, SSH, serverless, and IaC, which proposed response is the least defensible?

A. Make manual console edits only
B. Review the diff and blast radius, test the plan, and apply with scoped access and protected state
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Make manual console edits only

**Simple explanation:** The response "Make manual console edits only" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

### MCQ-172 | W7 | VMs, SSH, serverless, and IaC | Evidence | Evaluation

Select all evidence that would materially support saying that the VMs, SSH, serverless, and IaC solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Review the diff and blast radius, test the plan, and apply with scoped access and protected state. The test includes normal and edge cases.

**Answer:** A, D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result. | A repeatable before-and-after test shows that the original failure is fixed after applying this response: Review the diff and blast radius, test the plan, and apply with scoped access and protected state. The test includes normal and edge cases.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

### MCQ-173 | W7 | Budgets and event-driven cloud | Concept | Foundation

Which statement most accurately explains the main principle of Budgets and event-driven cloud?

A. Ignore token usage until billing closes
B. Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.
C. Assume exactly-once delivery without evidence
D. Disable all retries

**Answer:** B. Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.

**Simple explanation:** Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Budgets and event-driven cloud.

**Exam takeaway:** Remember: Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.

### MCQ-174 | W7 | Budgets and event-driven cloud | Application | Application

A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives. What should the team do first?

A. Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded
B. Assume exactly-once delivery without evidence
C. Disable all retries
D. Ignore token usage until billing closes

**Answer:** A. Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded

**Simple explanation:** Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded. This directly addresses the stated situation while following the principle: track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.

### MCQ-175 | W7 | Budgets and event-driven cloud | Debugging | Analysis

While debugging Budgets and event-driven cloud, which proposed response is the least defensible?

A. Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Disable all retries

**Answer:** D. Disable all retries

**Simple explanation:** The response "Disable all retries" is the weakest choice because it does not solve the root problem and conflicts with this principle: Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.

### MCQ-176 | W7 | Budgets and event-driven cloud | Practical | Application

A Pub/Sub consumer may receive the same `payment-recorded` event twice. What prevents duplicate business effects?

A. Acknowledge before processing and discard every error
B. Generate a new event ID on every retry
C. Store a stable event ID and make the consumer idempotently ignore an already-applied event
D. Assume the broker can never redeliver

**Answer:** C. Store a stable event ID and make the consumer idempotently ignore an already-applied event

**Simple explanation:** At-least-once delivery permits duplicates. A stable event identity plus an atomic processed check makes repeated delivery safe.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Design consumers for duplicate and out-of-order delivery.

**Exam takeaway:** Design consumers for duplicate and out-of-order delivery.

### MCQ-177 | W8 | Cloud Storage and BigQuery ML | Concept | Foundation

Which statement most accurately explains the main principle of Cloud Storage and BigQuery ML?

A. Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.
B. Overwrite raw data in place and keep no correction note
C. Use anonymous buckets
D. Train from an undocumented dashboard click

**Answer:** A. Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

**Simple explanation:** Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Cloud Storage and BigQuery ML.

**Exam takeaway:** Remember: Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

### MCQ-178 | W8 | Cloud Storage and BigQuery ML | Application | Application

A model training job must be traceable back to immutable input data, including a corrected source record. What should the team do first?

A. Overwrite raw data in place and keep no correction note
B. Use anonymous buckets
C. Train from an undocumented dashboard click
D. Write a versioned correction with reason, author, parent data version, and reproducible query lineage

**Answer:** D. Write a versioned correction with reason, author, parent data version, and reproducible query lineage

**Simple explanation:** Write a versioned correction with reason, author, parent data version, and reproducible query lineage. This directly addresses the stated situation while following the principle: separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

### MCQ-179 | W8 | Cloud Storage and BigQuery ML | Debugging | Analysis

While debugging Cloud Storage and BigQuery ML, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Train from an undocumented dashboard click
D. Write a versioned correction with reason, author, parent data version, and reproducible query lineage

**Answer:** C. Train from an undocumented dashboard click

**Simple explanation:** The response "Train from an undocumented dashboard click" is the weakest choice because it does not solve the root problem and conflicts with this principle: Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

### MCQ-180 | W8 | Cloud Storage and BigQuery ML | Evidence | Evaluation

Select all evidence that would materially support saying that the Cloud Storage and BigQuery ML solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Write a versioned correction with reason, author, parent data version, and reproducible query lineage. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

**Answer:** B, C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Write a versioned correction with reason, author, parent data version, and reproducible query lineage. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

### MCQ-181 | W8 | MLflow | Concept | Foundation

Which statement most accurately explains the main principle of MLflow?

A. Promote from the best-looking chart
B. Delete failed runs
C. Track only the model filename
D. Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

**Answer:** D. Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

**Simple explanation:** Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of MLflow.

**Exam takeaway:** Remember: Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

### MCQ-182 | W8 | MLflow | Application | Application

A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown. What should the team do first?

A. Delete failed runs
B. Track only the model filename
C. Require a complete run record and evidence before promotion
D. Promote from the best-looking chart

**Answer:** C. Require a complete run record and evidence before promotion

**Simple explanation:** Require a complete run record and evidence before promotion. This directly addresses the stated situation while following the principle: track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

### MCQ-183 | W8 | MLflow | Debugging | Analysis

While debugging MLflow, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Promote from the best-looking chart
C. Require a complete run record and evidence before promotion
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Promote from the best-looking chart

**Simple explanation:** The response "Promote from the best-looking chart" is the weakest choice because it does not solve the root problem and conflicts with this principle: Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

### MCQ-184 | W8 | MLflow | Evidence | Evaluation

Select all evidence that would materially support saying that the MLflow solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Require a complete run record and evidence before promotion. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Require a complete run record and evidence before promotion. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

### MCQ-185 | W8 | Fine-tuning strategy | Concept | Foundation

Which statement most accurately explains the main principle of Fine-tuning strategy?

A. Increase model size without diagnosis
B. Remove evaluation data
C. Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.
D. Fine-tune on random examples immediately

**Answer:** C. Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

**Simple explanation:** Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Fine-tuning strategy.

**Exam takeaway:** Remember: Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

### MCQ-186 | W8 | Fine-tuning strategy | Application | Application

A model knows facts but consistently emits the wrong output format. What should the team do first?

A. Remove evaluation data
B. Fix the contract or use structured output before fine-tuning for facts
C. Fine-tune on random examples immediately
D. Increase model size without diagnosis

**Answer:** B. Fix the contract or use structured output before fine-tuning for facts

**Simple explanation:** Fix the contract or use structured output before fine-tuning for facts. This directly addresses the stated situation while following the principle: choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

### MCQ-187 | W8 | Fine-tuning strategy | Debugging | Analysis

While debugging Fine-tuning strategy, which proposed response is the least defensible?

A. Increase model size without diagnosis
B. Fix the contract or use structured output before fine-tuning for facts
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

**Answer:** A. Increase model size without diagnosis

**Simple explanation:** The response "Increase model size without diagnosis" is the weakest choice because it does not solve the root problem and conflicts with this principle: Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

### MCQ-188 | W8 | Fine-tuning strategy | Evidence | Evaluation

Select all evidence that would materially support saying that the Fine-tuning strategy solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Fix the contract or use structured output before fine-tuning for facts. The test includes normal and edge cases.

**Answer:** A, D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result. | A repeatable before-and-after test shows that the original failure is fixed after applying this response: Fix the contract or use structured output before fine-tuning for facts. The test includes normal and edge cases.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

### MCQ-189 | W8 | Hugging Face and fine-tuning techniques | Concept | Foundation

Which statement most accurately explains the main principle of Hugging Face and fine-tuning techniques?

A. Publish without a card
B. Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.
C. Train on the test set
D. Skip tokenization checks

**Answer:** B. Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

**Simple explanation:** Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Hugging Face and fine-tuning techniques.

**Exam takeaway:** Remember: Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

### MCQ-190 | W8 | Hugging Face and fine-tuning techniques | Application | Application

A small domain dataset must adapt a base model while limiting memory use. What should the team do first?

A. Use an adapter-based method with held-out evaluation and documented provenance
B. Train on the test set
C. Skip tokenization checks
D. Publish without a card

**Answer:** A. Use an adapter-based method with held-out evaluation and documented provenance

**Simple explanation:** Use an adapter-based method with held-out evaluation and documented provenance. This directly addresses the stated situation while following the principle: use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

### MCQ-191 | W8 | Hugging Face and fine-tuning techniques | Debugging | Analysis

While debugging Hugging Face and fine-tuning techniques, which proposed response is the least defensible?

A. Use an adapter-based method with held-out evaluation and documented provenance
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Publish without a card

**Answer:** D. Publish without a card

**Simple explanation:** The response "Publish without a card" is the weakest choice because it does not solve the root problem and conflicts with this principle: Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

### MCQ-192 | W8 | Hugging Face and fine-tuning techniques | Evidence | Evaluation

Select all evidence that would materially support saying that the Hugging Face and fine-tuning techniques solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use an adapter-based method with held-out evaluation and documented provenance. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Answer:** C, D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use an adapter-based method with held-out evaluation and documented provenance. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

### MCQ-193 | W8 | Quantization and Gemma fine-tuning | Concept | Foundation

Which statement most accurately explains the main principle of Quantization and Gemma fine-tuning?

A. Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.
B. Assume lower precision is free
C. Quantize the labels only
D. Compare memory without evaluating outputs

**Answer:** A. Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.

**Simple explanation:** Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Quantization and Gemma fine-tuning.

**Exam takeaway:** Remember: Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.

### MCQ-194 | W8 | Quantization and Gemma fine-tuning | Application | Application

A model fits only after quantization but its factual accuracy changes. What should the team do first?

A. Assume lower precision is free
B. Quantize the labels only
C. Compare memory without evaluating outputs
D. Benchmark quality, latency, and memory before admitting the artifact

**Answer:** D. Benchmark quality, latency, and memory before admitting the artifact

**Simple explanation:** Benchmark quality, latency, and memory before admitting the artifact. This directly addresses the stated situation while following the principle: trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.

### MCQ-195 | W8 | Quantization and Gemma fine-tuning | Debugging | Analysis

While debugging Quantization and Gemma fine-tuning, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Assume lower precision is free
D. Benchmark quality, latency, and memory before admitting the artifact

**Answer:** C. Assume lower precision is free

**Simple explanation:** The response "Assume lower precision is free" is the weakest choice because it does not solve the root problem and conflicts with this principle: Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.

### MCQ-196 | W8 | Quantization and Gemma fine-tuning | Practical | Application

Ignoring runtime overhead, approximately how much memory do 7 billion parameters require when stored at 4 bits each?

A. About `0.875 GB`
B. About `3.5 GB`
C. About `28 GB`
D. About `14 GB`

**Answer:** B. About `3.5 GB`

**Simple explanation:** `7 billion x 4 bits = 28 billion bits`; divide by 8 for bytes to get about 3.5 billion bytes. Real inference needs additional memory for runtime state and KV cache.

**Why the other choices are weaker:** The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. Weight size is a lower bound, not total runtime memory.

**Exam takeaway:** Weight size is a lower bound, not total runtime memory.

### MCQ-197 | W8 | Model publishing and cards | Concept | Foundation

Which statement most accurately explains the main principle of Model publishing and cards?

A. Publish only a marketing name
B. Hide evaluation failures
C. Reuse a mutable latest tag
D. Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

**Answer:** D. Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

**Simple explanation:** Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details. This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.

**Why the other choices are weaker:** The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of Model publishing and cards.

**Exam takeaway:** Remember: Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

### MCQ-198 | W8 | Model publishing and cards | Application | Application

Users need to know whether a model is suitable for production. What should the team do first?

A. Hide evaluation failures
B. Reuse a mutable latest tag
C. Provide a model card and immutable version with limitations
D. Publish only a marketing name

**Answer:** C. Provide a model card and immutable version with limitations

**Simple explanation:** Provide a model card and immutable version with limitations. This directly addresses the stated situation while following the principle: publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

**Why the other choices are weaker:** The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.

**Exam takeaway:** Remember: Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

### MCQ-199 | W8 | Model publishing and cards | Debugging | Analysis

While debugging Model publishing and cards, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Hide evaluation failures
C. Provide a model card and immutable version with limitations
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

**Answer:** B. Hide evaluation failures

**Simple explanation:** The response "Hide evaluation failures" is the weakest choice because it does not solve the root problem and conflicts with this principle: Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

**Why the other choices are weaker:** The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.

**Exam takeaway:** Remember: Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

### MCQ-200 | W8 | Model publishing and cards | Evidence | Evaluation

Select all evidence that would materially support saying that the Model publishing and cards solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Provide a model card and immutable version with limitations. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

**Answer:** A, B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Provide a model card and immutable version with limitations. The test includes normal and edge cases. | An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

**Simple explanation:** Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.

**Why the other choices are weaker:** A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.

**Exam takeaway:** Remember: Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

## Subjective Bank

### SUB-001 | W0 | Paths and WSL | Applied

You are responsible for this Paths and WSL problem: A script works from one folder but fails when launched from another. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to resolve the path from a known base such as the project or script directory, then test it from both launch locations.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Paths and WSL.

**Decision-useful evidence:** For Paths and WSL, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A script works from one folder but fails when launched from another.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Hard-code the current desktop path" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Paths and WSL, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A script works from one folder but fails when launched from another.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Resolve the path from a known base such as the project or script directory, then test it from both launch locations. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A script works from one folder but fails when launched from another." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Paths and WSL principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-002 | W0 | Paths and WSL | Synthesis

A teammate proposes: "Hard-code the current desktop path." For this Paths and WSL situation (A script works from one folder but fails when launched from another.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Resolve the path from a known base such as the project or script directory, then test it from both launch locations.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Paths and WSL, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A script works from one folder but fails when launched from another.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Hard-code the current desktop path" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Paths and WSL, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Hard-code the current desktop path." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Resolve the path from a known base such as the project or script directory, then test it from both launch locations. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.

**Failure checks:**

- Repeat the original case and verify that "A script works from one folder but fails when launched from another." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Paths and WSL principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-003 | W0 | Shell pipelines and redirection | Applied

You are responsible for this Shell pipelines and redirection problem: A diagnostic command must retain old output while recording new errors separately. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to append stdout and redirect stderr explicitly.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Shell pipelines and redirection.

**Decision-useful evidence:** For Shell pipelines and redirection, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A diagnostic command must retain old output while recording new errors separately.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Redirect everything to /dev/null" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Shell pipelines and redirection, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A diagnostic command must retain old output while recording new errors separately.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Append stdout and redirect stderr explicitly. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A diagnostic command must retain old output while recording new errors separately." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Shell pipelines and redirection principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-004 | W0 | Shell pipelines and redirection | Synthesis

A teammate proposes: "Redirect everything to /dev/null." For this Shell pipelines and redirection situation (A diagnostic command must retain old output while recording new errors separately.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Append stdout and redirect stderr explicitly.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Shell pipelines and redirection, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A diagnostic command must retain old output while recording new errors separately.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Redirect everything to /dev/null" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Shell pipelines and redirection, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Redirect everything to /dev/null." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Append stdout and redirect stderr explicitly. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

**Failure checks:**

- Repeat the original case and verify that "A diagnostic command must retain old output while recording new errors separately." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Shell pipelines and redirection principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-005 | W0 | uv project workflow | Applied

You are responsible for this uv project workflow problem: A teammate needs the same Python dependencies on a clean machine. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to commit project metadata and the lockfile.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for uv project workflow.

**Decision-useful evidence:** For uv project workflow, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A teammate needs the same Python dependencies on a clean machine.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Rely on the active shell history" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For uv project workflow, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A teammate needs the same Python dependencies on a clean machine.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Commit project metadata and the lockfile. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Declare dependencies in project metadata and use uv to create or reproduce an isolated environment. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A teammate needs the same Python dependencies on a clean machine." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the uv project workflow principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-006 | W0 | uv project workflow | Synthesis

A teammate proposes: "Rely on the active shell history." For this uv project workflow situation (A teammate needs the same Python dependencies on a clean machine.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Commit project metadata and the lockfile.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For uv project workflow, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A teammate needs the same Python dependencies on a clean machine.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Rely on the active shell history" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For uv project workflow, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Rely on the active shell history." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Commit project metadata and the lockfile. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.

**Failure checks:**

- Repeat the original case and verify that "A teammate needs the same Python dependencies on a clean machine." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the uv project workflow principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-007 | W0 | HTTP methods and status codes | Applied

You are responsible for this HTTP methods and status codes problem: A client receives 401, 403, 404, and 500 responses from different requests. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to diagnose authentication, authorization, routing, and server failure separately.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for HTTP methods and status codes.

**Decision-useful evidence:** For HTTP methods and status codes, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A client receives 401, 403, 404, and 500 responses from different requests.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Retry every response forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For HTTP methods and status codes, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A client receives 401, 403, 404, and 500 responses from different requests.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Diagnose authentication, authorization, routing, and server failure separately. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A client receives 401, 403, 404, and 500 responses from different requests." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the HTTP methods and status codes principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-008 | W0 | HTTP methods and status codes | Synthesis

A teammate proposes: "Retry every response forever." For this HTTP methods and status codes situation (A client receives 401, 403, 404, and 500 responses from different requests.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Diagnose authentication, authorization, routing, and server failure separately.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For HTTP methods and status codes, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A client receives 401, 403, 404, and 500 responses from different requests.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Retry every response forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For HTTP methods and status codes, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Retry every response forever." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Diagnose authentication, authorization, routing, and server failure separately. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.

**Failure checks:**

- Repeat the original case and verify that "A client receives 401, 403, 404, and 500 responses from different requests." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the HTTP methods and status codes principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-009 | W0 | Git basic flow | Applied

You are responsible for this Git basic flow problem: A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Git basic flow.

**Decision-useful evidence:** For Git basic flow, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Leave the secret active because the commit is old" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Git basic flow, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Git basic flow principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-010 | W0 | Git basic flow | Synthesis

A teammate proposes: "Leave the secret active because the commit is old." For this Git basic flow situation (A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Git basic flow, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Leave the secret active because the commit is old" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Git basic flow, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Leave the secret active because the commit is old." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.

**Failure checks:**

- Repeat the original case and verify that "A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Git basic flow principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-011 | W1 | VS Code workspaces | Applied

You are responsible for this VS Code workspaces problem: The editor shows the wrong Python interpreter and unresolved imports. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to select the project interpreter and verify workspace settings.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for VS Code workspaces.

**Decision-useful evidence:** For VS Code workspaces, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (The editor shows the wrong Python interpreter and unresolved imports.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Disable diagnostics globally" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For VS Code workspaces, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: The editor shows the wrong Python interpreter and unresolved imports.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Select the project interpreter and verify workspace settings. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "The editor shows the wrong Python interpreter and unresolved imports." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the VS Code workspaces principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-012 | W1 | VS Code workspaces | Synthesis

A teammate proposes: "Disable diagnostics globally." For this VS Code workspaces situation (The editor shows the wrong Python interpreter and unresolved imports.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Select the project interpreter and verify workspace settings.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For VS Code workspaces, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (The editor shows the wrong Python interpreter and unresolved imports.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Disable diagnostics globally" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For VS Code workspaces, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Disable diagnostics globally." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Select the project interpreter and verify workspace settings. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

**Failure checks:**

- Repeat the original case and verify that "The editor shows the wrong Python interpreter and unresolved imports." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the VS Code workspaces principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-013 | W1 | Dependency locking | Applied

You are responsible for this Dependency locking problem: A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Dependency locking.

**Decision-useful evidence:** For Dependency locking, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ignore the lockfile" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Dependency locking, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Dependency locking principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-014 | W1 | Dependency locking | Synthesis

A teammate proposes: "Ignore the lockfile." For this Dependency locking situation (A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Dependency locking, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ignore the lockfile" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Dependency locking, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Ignore the lockfile." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.

**Failure checks:**

- Repeat the original case and verify that "A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Dependency locking principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-015 | W1 | Bash scripting | Applied

You are responsible for this Bash scripting problem: A cleanup script receives a filename containing spaces and an empty variable. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to quote inputs and fail safely before deleting.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Bash scripting.

**Decision-useful evidence:** For Bash scripting, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A cleanup script receives a filename containing spaces and an empty variable.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use rm -rf on the parent directory" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Bash scripting, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A cleanup script receives a filename containing spaces and an empty variable.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Quote inputs and fail safely before deleting. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A cleanup script receives a filename containing spaces and an empty variable." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Bash scripting principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-016 | W1 | Bash scripting | Synthesis

A teammate proposes: "Use rm -rf on the parent directory." For this Bash scripting situation (A cleanup script receives a filename containing spaces and an empty variable.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Quote inputs and fail safely before deleting.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Bash scripting, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A cleanup script receives a filename containing spaces and an empty variable.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use rm -rf on the parent directory" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Bash scripting, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Use rm -rf on the parent directory." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Quote inputs and fail safely before deleting. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.

**Failure checks:**

- Repeat the original case and verify that "A cleanup script receives a filename containing spaces and an empty variable." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Bash scripting principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-017 | W1 | SQLite | Applied

You are responsible for this SQLite problem: An import must either commit all rows or leave the database unchanged. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to wrap the import in a transaction and use parameters.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for SQLite.

**Decision-useful evidence:** For SQLite, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An import must either commit all rows or leave the database unchanged.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Store the database as a screenshot" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For SQLite, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: An import must either commit all rows or leave the database unchanged.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Wrap the import in a transaction and use parameters. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "An import must either commit all rows or leave the database unchanged." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the SQLite principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-018 | W1 | SQLite | Synthesis

A teammate proposes: "Store the database as a screenshot." For this SQLite situation (An import must either commit all rows or leave the database unchanged.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Wrap the import in a transaction and use parameters.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For SQLite, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An import must either commit all rows or leave the database unchanged.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Store the database as a screenshot" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For SQLite, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Store the database as a screenshot." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Wrap the import in a transaction and use parameters. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.

**Failure checks:**

- Repeat the original case and verify that "An import must either commit all rows or leave the database unchanged." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the SQLite principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-019 | W1 | HTTP clients and data formats | Applied

You are responsible for this HTTP clients and data formats problem: An API sometimes returns an HTML error page where JSON was expected. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to check status and content type before parsing.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for HTTP clients and data formats.

**Decision-useful evidence:** For HTTP clients and data formats, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An API sometimes returns an HTML error page where JSON was expected.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Call JSON.parse on every body blindly" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For HTTP clients and data formats, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: An API sometimes returns an HTML error page where JSON was expected.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Check status and content type before parsing. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "An API sometimes returns an HTML error page where JSON was expected." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the HTTP clients and data formats principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-020 | W1 | HTTP clients and data formats | Synthesis

A teammate proposes: "Call JSON.parse on every body blindly." For this HTTP clients and data formats situation (An API sometimes returns an HTML error page where JSON was expected.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Check status and content type before parsing.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For HTTP clients and data formats, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An API sometimes returns an HTML error page where JSON was expected.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Call JSON.parse on every body blindly" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For HTTP clients and data formats, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Call JSON.parse on every body blindly." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Check status and content type before parsing. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

**Failure checks:**

- Repeat the original case and verify that "An API sometimes returns an HTML error page where JSON was expected." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the HTTP clients and data formats principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-021 | W2 | FastAPI fundamentals | Applied

You are responsible for this FastAPI fundamentals problem: A service works on one instance but loses a user job after a restart and returns inconsistent error shapes. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to persist durable state outside the process and use a documented status and error contract.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for FastAPI fundamentals.

**Decision-useful evidence:** For FastAPI fundamentals, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A service works on one instance but loses a user job after a restart and returns inconsistent error shapes.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Parse raw strings in every route" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For FastAPI fundamentals, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A service works on one instance but loses a user job after a restart and returns inconsistent error shapes.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Persist durable state outside the process and use a documented status and error contract. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A service works on one instance but loses a user job after a restart and returns inconsistent error shapes." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the FastAPI fundamentals principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-022 | W2 | FastAPI fundamentals | Synthesis

A teammate proposes: "Parse raw strings in every route." For this FastAPI fundamentals situation (A service works on one instance but loses a user job after a restart and returns inconsistent error shapes.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Persist durable state outside the process and use a documented status and error contract.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For FastAPI fundamentals, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A service works on one instance but loses a user job after a restart and returns inconsistent error shapes.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Parse raw strings in every route" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For FastAPI fundamentals, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Parse raw strings in every route." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Persist durable state outside the process and use a documented status and error contract. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.

**Failure checks:**

- Repeat the original case and verify that "A service works on one instance but loses a user job after a restart and returns inconsistent error shapes." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the FastAPI fundamentals principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-023 | W2 | CORS and middleware | Applied

You are responsible for this CORS and middleware problem: A browser call fails while curl works, and a logged-in user can see a resource belonging to another user. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to check origin and preflight separately from authentication, then enforce resource authorization on the server.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for CORS and middleware.

**Decision-useful evidence:** For CORS and middleware, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A browser call fails while curl works, and a logged-in user can see a resource belonging to another user.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Change the database schema without inspecting the request identity" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For CORS and middleware, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A browser call fails while curl works, and a logged-in user can see a resource belonging to another user.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Check origin and preflight separately from authentication, then enforce resource authorization on the server. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A browser call fails while curl works, and a logged-in user can see a resource belonging to another user." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the CORS and middleware principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-024 | W2 | CORS and middleware | Synthesis

A teammate proposes: "Change the database schema without inspecting the request identity." For this CORS and middleware situation (A browser call fails while curl works, and a logged-in user can see a resource belonging to another user.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Check origin and preflight separately from authentication, then enforce resource authorization on the server.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For CORS and middleware, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A browser call fails while curl works, and a logged-in user can see a resource belonging to another user.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Change the database schema without inspecting the request identity" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For CORS and middleware, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Change the database schema without inspecting the request identity." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Check origin and preflight separately from authentication, then enforce resource authorization on the server. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.

**Failure checks:**

- Repeat the original case and verify that "A browser call fails while curl works, and a logged-in user can see a resource belonging to another user." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the CORS and middleware principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-025 | W2 | OAuth 2.0 | Applied

You are responsible for this OAuth 2.0 problem: A web app needs access to a user-owned provider resource without collecting the provider password. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to redirect for authorization and exchange the code securely for scoped delegated access.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for OAuth 2.0.

**Decision-useful evidence:** For OAuth 2.0, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A web app needs access to a user-owned provider resource without collecting the provider password.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ask for the provider password" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For OAuth 2.0, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A web app needs access to a user-owned provider resource without collecting the provider password.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Redirect for authorization and exchange the code securely for scoped delegated access. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A web app needs access to a user-owned provider resource without collecting the provider password." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the OAuth 2.0 principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-026 | W2 | OAuth 2.0 | Synthesis

A teammate proposes: "Ask for the provider password." For this OAuth 2.0 situation (A web app needs access to a user-owned provider resource without collecting the provider password.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Redirect for authorization and exchange the code securely for scoped delegated access.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For OAuth 2.0, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A web app needs access to a user-owned provider resource without collecting the provider password.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ask for the provider password" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For OAuth 2.0, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Ask for the provider password." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Redirect for authorization and exchange the code securely for scoped delegated access. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.

**Failure checks:**

- Repeat the original case and verify that "A web app needs access to a user-owned provider resource without collecting the provider password." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the OAuth 2.0 principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-027 | W2 | Configuration and secrets | Applied

You are responsible for this Configuration and secrets problem: A production token appears in a public CI log while the same service runs locally, in CI, and in production. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Configuration and secrets.

**Decision-useful evidence:** For Configuration and secrets, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A production token appears in a public CI log while the same service runs locally, in CI, and in production.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Print all secrets during health checks" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Configuration and secrets, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A production token appears in a public CI log while the same service runs locally, in CI, and in production.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A production token appears in a public CI log while the same service runs locally, in CI, and in production." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Configuration and secrets principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-028 | W2 | Configuration and secrets | Synthesis

A teammate proposes: "Print all secrets during health checks." For this Configuration and secrets situation (A production token appears in a public CI log while the same service runs locally, in CI, and in production.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Configuration and secrets, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A production token appears in a public CI log while the same service runs locally, in CI, and in production.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Print all secrets during health checks" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Configuration and secrets, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Print all secrets during health checks." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

**Failure checks:**

- Repeat the original case and verify that "A production token appears in a public CI log while the same service runs locally, in CI, and in production." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Configuration and secrets principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-029 | W2 | Containers and deployment | Applied

You are responsible for this Containers and deployment problem: A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to bind to the configured interface and port, use the service network name, and keep secrets outside the image.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Containers and deployment.

**Decision-useful evidence:** For Containers and deployment, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Assume host localhost names every container" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Containers and deployment, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Bind to the configured interface and port, use the service network name, and keep secrets outside the image. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Containers and deployment principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-030 | W2 | Containers and deployment | Synthesis

A teammate proposes: "Assume host localhost names every container." For this Containers and deployment situation (A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Bind to the configured interface and port, use the service network name, and keep secrets outside the image.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Containers and deployment, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Assume host localhost names every container" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Containers and deployment, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Assume host localhost names every container." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Bind to the configured interface and port, use the service network name, and keep secrets outside the image. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.

**Failure checks:**

- Repeat the original case and verify that "A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Containers and deployment principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-031 | W2 | Logging, testing, and observability | Applied

You are responsible for this Logging, testing, and observability problem: Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Logging, testing, and observability.

**Decision-useful evidence:** For Logging, testing, and observability, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use the average and raw error count alone" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Logging, testing, and observability, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Logging, testing, and observability principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-032 | W2 | Logging, testing, and observability | Synthesis

A teammate proposes: "Use the average and raw error count alone." For this Logging, testing, and observability situation (Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Logging, testing, and observability, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use the average and raw error count alone" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Logging, testing, and observability, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Use the average and raw error count alone." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.

**Failure checks:**

- Repeat the original case and verify that "Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Logging, testing, and observability principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-033 | W3 | Prompt foundations | Applied

You are responsible for this Prompt foundations problem: An LLM returns inconsistent formats for the same classification task. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to specify the contract and include representative examples.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Prompt foundations.

**Decision-useful evidence:** For Prompt foundations, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An LLM returns inconsistent formats for the same classification task.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ask for a secret chain of thought" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Prompt foundations, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: An LLM returns inconsistent formats for the same classification task.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Specify the contract and include representative examples. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: State the task, constraints, context, output requirements, and examples with unambiguous instructions. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "An LLM returns inconsistent formats for the same classification task." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Prompt foundations principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-034 | W3 | Prompt foundations | Synthesis

A teammate proposes: "Ask for a secret chain of thought." For this Prompt foundations situation (An LLM returns inconsistent formats for the same classification task.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Specify the contract and include representative examples.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Prompt foundations, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An LLM returns inconsistent formats for the same classification task.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ask for a secret chain of thought" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Prompt foundations, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Ask for a secret chain of thought." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Specify the contract and include representative examples. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: State the task, constraints, context, output requirements, and examples with unambiguous instructions.

**Failure checks:**

- Repeat the original case and verify that "An LLM returns inconsistent formats for the same classification task." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Prompt foundations principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-035 | W3 | Reliable output control | Applied

You are responsible for this Reliable output control problem: A downstream service expects an enum and two required fields, but the model sometimes invents a third value. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to validate structured output and the relevant invariant, then reject or repair only within a bounded policy.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Reliable output control.

**Decision-useful evidence:** For Reliable output control, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A downstream service expects an enum and two required fields, but the model sometimes invents a third value.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ask the model to be more confident" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Reliable output control, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A downstream service expects an enum and two required fields, but the model sometimes invents a third value.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Validate structured output and the relevant invariant, then reject or repair only within a bounded policy. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A downstream service expects an enum and two required fields, but the model sometimes invents a third value." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Reliable output control principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-036 | W3 | Reliable output control | Synthesis

A teammate proposes: "Ask the model to be more confident." For this Reliable output control situation (A downstream service expects an enum and two required fields, but the model sometimes invents a third value.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Validate structured output and the relevant invariant, then reject or repair only within a bounded policy.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Reliable output control, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A downstream service expects an enum and two required fields, but the model sometimes invents a third value.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ask the model to be more confident" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Reliable output control, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Ask the model to be more confident." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Validate structured output and the relevant invariant, then reject or repair only within a bounded policy. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

**Failure checks:**

- Repeat the original case and verify that "A downstream service expects an enum and two required fields, but the model sometimes invents a third value." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Reliable output control principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-037 | W3 | Context and prompt caching | Applied

You are responsible for this Context and prompt caching problem: A large stable system instruction is repeated across thousands of requests. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to cache the stable prefix and isolate user-specific content.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Context and prompt caching.

**Decision-useful evidence:** For Context and prompt caching, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A large stable system instruction is repeated across thousands of requests.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Cache all user data indefinitely" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Context and prompt caching, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A large stable system instruction is repeated across thousands of requests.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Cache the stable prefix and isolate user-specific content. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A large stable system instruction is repeated across thousands of requests." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Context and prompt caching principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-038 | W3 | Context and prompt caching | Synthesis

A teammate proposes: "Cache all user data indefinitely." For this Context and prompt caching situation (A large stable system instruction is repeated across thousands of requests.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Cache the stable prefix and isolate user-specific content.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Context and prompt caching, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A large stable system instruction is repeated across thousands of requests.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Cache all user data indefinitely" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Context and prompt caching, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Cache all user data indefinitely." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Cache the stable prefix and isolate user-specific content. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.

**Failure checks:**

- Repeat the original case and verify that "A large stable system instruction is repeated across thousands of requests." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Context and prompt caching principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-039 | W3 | Embeddings and similarity | Applied

You are responsible for this Embeddings and similarity problem: A search system must retrieve semantically related documents despite different wording. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to embed queries and documents consistently, then inspect similarity quality.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Embeddings and similarity.

**Decision-useful evidence:** For Embeddings and similarity, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A search system must retrieve semantically related documents despite different wording.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use a random vector per document" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Embeddings and similarity, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A search system must retrieve semantically related documents despite different wording.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Embed queries and documents consistently, then inspect similarity quality. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A search system must retrieve semantically related documents despite different wording." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Embeddings and similarity principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-040 | W3 | Embeddings and similarity | Synthesis

A teammate proposes: "Use a random vector per document." For this Embeddings and similarity situation (A search system must retrieve semantically related documents despite different wording.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Embed queries and documents consistently, then inspect similarity quality.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Embeddings and similarity, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A search system must retrieve semantically related documents despite different wording.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use a random vector per document" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Embeddings and similarity, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Use a random vector per document." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Embed queries and documents consistently, then inspect similarity quality. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.

**Failure checks:**

- Repeat the original case and verify that "A search system must retrieve semantically related documents despite different wording." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Embeddings and similarity principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-041 | W3 | LLM architecture and tooling | Applied

You are responsible for this LLM architecture and tooling problem: A team needs provider portability and per-request cost traces. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use an abstraction or gateway with explicit tracing and fallback policy.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for LLM architecture and tooling.

**Decision-useful evidence:** For LLM architecture and tooling, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A team needs provider portability and per-request cost traces.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Optimize latency without measuring it" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For LLM architecture and tooling, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A team needs provider portability and per-request cost traces.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use an abstraction or gateway with explicit tracing and fallback policy. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A team needs provider portability and per-request cost traces." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the LLM architecture and tooling principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-042 | W3 | LLM architecture and tooling | Synthesis

A teammate proposes: "Optimize latency without measuring it." For this LLM architecture and tooling situation (A team needs provider portability and per-request cost traces.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use an abstraction or gateway with explicit tracing and fallback policy.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For LLM architecture and tooling, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A team needs provider portability and per-request cost traces.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Optimize latency without measuring it" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For LLM architecture and tooling, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Optimize latency without measuring it." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use an abstraction or gateway with explicit tracing and fallback policy. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.

**Failure checks:**

- Repeat the original case and verify that "A team needs provider portability and per-request cost traces." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the LLM architecture and tooling principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-043 | W4 | Vector databases and chunking | Applied

You are responsible for this Vector databases and chunking problem: A policy document contains headings, tables, and long sections. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to chunk by semantic structure and retain source metadata.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Vector databases and chunking.

**Decision-useful evidence:** For Vector databases and chunking, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A policy document contains headings, tables, and long sections.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Split every 10 characters" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Vector databases and chunking, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A policy document contains headings, tables, and long sections.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Chunk by semantic structure and retain source metadata. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A policy document contains headings, tables, and long sections." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Vector databases and chunking principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-044 | W4 | Vector databases and chunking | Synthesis

A teammate proposes: "Split every 10 characters." For this Vector databases and chunking situation (A policy document contains headings, tables, and long sections.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Chunk by semantic structure and retain source metadata.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Vector databases and chunking, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A policy document contains headings, tables, and long sections.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Split every 10 characters" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Vector databases and chunking, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Split every 10 characters." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Chunk by semantic structure and retain source metadata. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

**Failure checks:**

- Repeat the original case and verify that "A policy document contains headings, tables, and long sections." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Vector databases and chunking principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-045 | W4 | Late and contextual retrieval | Applied

You are responsible for this Late and contextual retrieval problem: A short chunk says “this limit” but its meaning is defined in the parent section. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to attach useful context before embedding or retrieval and keep provenance.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Late and contextual retrieval.

**Decision-useful evidence:** For Late and contextual retrieval, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A short chunk says “this limit” but its meaning is defined in the parent section.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Replace the chunk with a guess" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Late and contextual retrieval, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A short chunk says “this limit” but its meaning is defined in the parent section.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Attach useful context before embedding or retrieval and keep provenance. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A short chunk says “this limit” but its meaning is defined in the parent section." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Late and contextual retrieval principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-046 | W4 | Late and contextual retrieval | Synthesis

A teammate proposes: "Replace the chunk with a guess." For this Late and contextual retrieval situation (A short chunk says “this limit” but its meaning is defined in the parent section.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Attach useful context before embedding or retrieval and keep provenance.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Late and contextual retrieval, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A short chunk says “this limit” but its meaning is defined in the parent section.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Replace the chunk with a guess" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Late and contextual retrieval, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Replace the chunk with a guess." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Attach useful context before embedding or retrieval and keep provenance. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.

**Failure checks:**

- Repeat the original case and verify that "A short chunk says “this limit” but its meaning is defined in the parent section." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Late and contextual retrieval principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-047 | W4 | Hybrid search and reranking | Applied

You are responsible for this Hybrid search and reranking problem: A query contains a product code and a natural-language description. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to retrieve with complementary signals and rerank the shortlist.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Hybrid search and reranking.

**Decision-useful evidence:** For Hybrid search and reranking, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A query contains a product code and a natural-language description.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Rerank the entire internet without candidates" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Hybrid search and reranking, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A query contains a product code and a natural-language description.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Retrieve with complementary signals and rerank the shortlist. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A query contains a product code and a natural-language description." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Hybrid search and reranking principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-048 | W4 | Hybrid search and reranking | Synthesis

A teammate proposes: "Rerank the entire internet without candidates." For this Hybrid search and reranking situation (A query contains a product code and a natural-language description.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Retrieve with complementary signals and rerank the shortlist.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Hybrid search and reranking, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A query contains a product code and a natural-language description.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Rerank the entire internet without candidates" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Hybrid search and reranking, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Rerank the entire internet without candidates." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Retrieve with complementary signals and rerank the shortlist. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.

**Failure checks:**

- Repeat the original case and verify that "A query contains a product code and a natural-language description." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Hybrid search and reranking principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-049 | W4 | Query augmentation and semantic caching | Applied

You are responsible for this Query augmentation and semantic caching problem: Users ask the same question with minor wording changes while source data updates hourly. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to normalize intent, cache within a freshness boundary, and preserve variants.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Query augmentation and semantic caching.

**Decision-useful evidence:** For Query augmentation and semantic caching, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Users ask the same question with minor wording changes while source data updates hourly.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Cache every answer forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Query augmentation and semantic caching, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: Users ask the same question with minor wording changes while source data updates hourly.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Normalize intent, cache within a freshness boundary, and preserve variants. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "Users ask the same question with minor wording changes while source data updates hourly." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Query augmentation and semantic caching principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-050 | W4 | Query augmentation and semantic caching | Synthesis

A teammate proposes: "Cache every answer forever." For this Query augmentation and semantic caching situation (Users ask the same question with minor wording changes while source data updates hourly.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Normalize intent, cache within a freshness boundary, and preserve variants.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Query augmentation and semantic caching, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Users ask the same question with minor wording changes while source data updates hourly.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Cache every answer forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Query augmentation and semantic caching, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Cache every answer forever." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Normalize intent, cache within a freshness boundary, and preserve variants. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.

**Failure checks:**

- Repeat the original case and verify that "Users ask the same question with minor wording changes while source data updates hourly." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Query augmentation and semantic caching principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-051 | W4 | Grounding and RAG evaluation | Applied

You are responsible for this Grounding and RAG evaluation problem: A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Grounding and RAG evaluation.

**Decision-useful evidence:** For Grounding and RAG evaluation, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Treat a fluent answer as grounded" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Grounding and RAG evaluation, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Grounding and RAG evaluation principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-052 | W4 | Grounding and RAG evaluation | Synthesis

A teammate proposes: "Treat a fluent answer as grounded." For this Grounding and RAG evaluation situation (A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Grounding and RAG evaluation, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Treat a fluent answer as grounded" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Grounding and RAG evaluation, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Treat a fluent answer as grounded." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

**Failure checks:**

- Repeat the original case and verify that "A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Grounding and RAG evaluation principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-053 | W5 | Agent fundamentals and tool calling | Applied

You are responsible for this Agent fundamentals and tool calling problem: An agent can read documents but must not execute arbitrary shell commands. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to expose least-privilege tools with validated arguments.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Agent fundamentals and tool calling.

**Decision-useful evidence:** For Agent fundamentals and tool calling, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An agent can read documents but must not execute arbitrary shell commands.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Skip tool-result validation" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Agent fundamentals and tool calling, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: An agent can read documents but must not execute arbitrary shell commands.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Expose least-privilege tools with validated arguments. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "An agent can read documents but must not execute arbitrary shell commands." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Agent fundamentals and tool calling principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-054 | W5 | Agent fundamentals and tool calling | Synthesis

A teammate proposes: "Skip tool-result validation." For this Agent fundamentals and tool calling situation (An agent can read documents but must not execute arbitrary shell commands.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Expose least-privilege tools with validated arguments.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Agent fundamentals and tool calling, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An agent can read documents but must not execute arbitrary shell commands.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Skip tool-result validation" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Agent fundamentals and tool calling, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Skip tool-result validation." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Expose least-privilege tools with validated arguments. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.

**Failure checks:**

- Repeat the original case and verify that "An agent can read documents but must not execute arbitrary shell commands." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Agent fundamentals and tool calling principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-055 | W5 | Agent evaluation | Applied

You are responsible for this Agent evaluation problem: A benchmark score improves while unsafe tool calls increase. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to track safety and operational metrics alongside success.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Agent evaluation.

**Decision-useful evidence:** For Agent evaluation, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A benchmark score improves while unsafe tool calls increase.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use success rate alone" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Agent evaluation, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A benchmark score improves while unsafe tool calls increase.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Track safety and operational metrics alongside success. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A benchmark score improves while unsafe tool calls increase." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Agent evaluation principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-056 | W5 | Agent evaluation | Synthesis

A teammate proposes: "Use success rate alone." For this Agent evaluation situation (A benchmark score improves while unsafe tool calls increase.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Track safety and operational metrics alongside success.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Agent evaluation, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A benchmark score improves while unsafe tool calls increase.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Use success rate alone" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Agent evaluation, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Use success rate alone." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Track safety and operational metrics alongside success. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.

**Failure checks:**

- Repeat the original case and verify that "A benchmark score improves while unsafe tool calls increase." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Agent evaluation principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-057 | W5 | Memory and loop engineering | Applied

You are responsible for this Memory and loop engineering problem: An agent repeats a failed search and grows its prompt without limit. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use scoped memory and explicit iteration, token, and time budgets.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Memory and loop engineering.

**Decision-useful evidence:** For Memory and loop engineering, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An agent repeats a failed search and grows its prompt without limit.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Store every observation forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Memory and loop engineering, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: An agent repeats a failed search and grows its prompt without limit.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use scoped memory and explicit iteration, token, and time budgets. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "An agent repeats a failed search and grows its prompt without limit." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Memory and loop engineering principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-058 | W5 | Memory and loop engineering | Synthesis

A teammate proposes: "Store every observation forever." For this Memory and loop engineering situation (An agent repeats a failed search and grows its prompt without limit.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use scoped memory and explicit iteration, token, and time budgets.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Memory and loop engineering, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An agent repeats a failed search and grows its prompt without limit.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Store every observation forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Memory and loop engineering, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Store every observation forever." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use scoped memory and explicit iteration, token, and time budgets. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.

**Failure checks:**

- Repeat the original case and verify that "An agent repeats a failed search and grows its prompt without limit." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Memory and loop engineering principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-059 | W5 | Multi-agent systems | Applied

You are responsible for this Multi-agent systems problem: Several workers produce conflicting research claims. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use typed handoffs, provenance, and an adjudication step.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Multi-agent systems.

**Decision-useful evidence:** For Multi-agent systems, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Several workers produce conflicting research claims.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Hide disagreements from the user" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Multi-agent systems, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: Several workers produce conflicting research claims.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use typed handoffs, provenance, and an adjudication step. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "Several workers produce conflicting research claims." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Multi-agent systems principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-060 | W5 | Multi-agent systems | Synthesis

A teammate proposes: "Hide disagreements from the user." For this Multi-agent systems situation (Several workers produce conflicting research claims.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use typed handoffs, provenance, and an adjudication step.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Multi-agent systems, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Several workers produce conflicting research claims.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Hide disagreements from the user" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Multi-agent systems, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Hide disagreements from the user." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use typed handoffs, provenance, and an adjudication step. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

**Failure checks:**

- Repeat the original case and verify that "Several workers produce conflicting research claims." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Multi-agent systems principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-061 | W5 | MCP, async, and sandboxing | Applied

You are responsible for this MCP, async, and sandboxing problem: Parallel tasks can call a remote tool but must stop when the user cancels. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to propagate cancellation and bound concurrency inside a sandbox.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for MCP, async, and sandboxing.

**Decision-useful evidence:** For MCP, async, and sandboxing, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Parallel tasks can call a remote tool but must stop when the user cancels.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Spawn unlimited tasks" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For MCP, async, and sandboxing, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: Parallel tasks can call a remote tool but must stop when the user cancels.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Propagate cancellation and bound concurrency inside a sandbox. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "Parallel tasks can call a remote tool but must stop when the user cancels." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the MCP, async, and sandboxing principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-062 | W5 | MCP, async, and sandboxing | Synthesis

A teammate proposes: "Spawn unlimited tasks." For this MCP, async, and sandboxing situation (Parallel tasks can call a remote tool but must stop when the user cancels.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Propagate cancellation and bound concurrency inside a sandbox.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For MCP, async, and sandboxing, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Parallel tasks can call a remote tool but must stop when the user cancels.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Spawn unlimited tasks" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For MCP, async, and sandboxing, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Spawn unlimited tasks." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Propagate cancellation and bound concurrency inside a sandbox. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.

**Failure checks:**

- Repeat the original case and verify that "Parallel tasks can call a remote tool but must stop when the user cancels." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the MCP, async, and sandboxing principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-063 | W6 | Legal and ethical scraping | Applied

You are responsible for this Legal and ethical scraping problem: A public page contains personal information that is not needed for the task. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to minimize collection and avoid using data outside the authorized purpose.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Legal and ethical scraping.

**Decision-useful evidence:** For Legal and ethical scraping, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A public page contains personal information that is not needed for the task.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Bypass access controls" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Legal and ethical scraping, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A public page contains personal information that is not needed for the task.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Minimize collection and avoid using data outside the authorized purpose. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A public page contains personal information that is not needed for the task." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Legal and ethical scraping principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-064 | W6 | Legal and ethical scraping | Synthesis

A teammate proposes: "Bypass access controls." For this Legal and ethical scraping situation (A public page contains personal information that is not needed for the task.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Minimize collection and avoid using data outside the authorized purpose.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Legal and ethical scraping, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A public page contains personal information that is not needed for the task.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Bypass access controls" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Legal and ethical scraping, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Bypass access controls." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Minimize collection and avoid using data outside the authorized purpose. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.

**Failure checks:**

- Repeat the original case and verify that "A public page contains personal information that is not needed for the task." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Legal and ethical scraping principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-065 | W6 | Hidden JSON APIs and structured sources | Applied

You are responsible for this Hidden JSON APIs and structured sources problem: The page renders a table from an XHR JSON response. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to identify the endpoint, parameters, schema, and access conditions.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Hidden JSON APIs and structured sources.

**Decision-useful evidence:** For Hidden JSON APIs and structured sources, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (The page renders a table from an XHR JSON response.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ignore pagination metadata" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Hidden JSON APIs and structured sources, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: The page renders a table from an XHR JSON response.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Identify the endpoint, parameters, schema, and access conditions. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "The page renders a table from an XHR JSON response." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Hidden JSON APIs and structured sources principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-066 | W6 | Hidden JSON APIs and structured sources | Synthesis

A teammate proposes: "Ignore pagination metadata." For this Hidden JSON APIs and structured sources situation (The page renders a table from an XHR JSON response.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Identify the endpoint, parameters, schema, and access conditions.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Hidden JSON APIs and structured sources, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (The page renders a table from an XHR JSON response.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Ignore pagination metadata" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Hidden JSON APIs and structured sources, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Ignore pagination metadata." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Identify the endpoint, parameters, schema, and access conditions. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.

**Failure checks:**

- Repeat the original case and verify that "The page renders a table from an XHR JSON response." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Hidden JSON APIs and structured sources principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-067 | W6 | Browser automation and pagination | Applied

You are responsible for this Browser automation and pagination problem: A catalog loads the next page only after a button click. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to observe the UI state, paginate until exhaustion, and deduplicate by stable ID.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Browser automation and pagination.

**Decision-useful evidence:** For Browser automation and pagination, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A catalog loads the next page only after a button click.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Loop a fixed number of clicks blindly" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Browser automation and pagination, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A catalog loads the next page only after a button click.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Observe the UI state, paginate until exhaustion, and deduplicate by stable ID. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A catalog loads the next page only after a button click." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Browser automation and pagination principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-068 | W6 | Browser automation and pagination | Synthesis

A teammate proposes: "Loop a fixed number of clicks blindly." For this Browser automation and pagination situation (A catalog loads the next page only after a button click.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Observe the UI state, paginate until exhaustion, and deduplicate by stable ID.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Browser automation and pagination, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A catalog loads the next page only after a button click.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Loop a fixed number of clicks blindly" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Browser automation and pagination, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Loop a fixed number of clicks blindly." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Observe the UI state, paginate until exhaustion, and deduplicate by stable ID. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

**Failure checks:**

- Repeat the original case and verify that "A catalog loads the next page only after a button click." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Browser automation and pagination principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-069 | W6 | Authenticated scraping | Applied

You are responsible for this Authenticated scraping problem: A permitted internal dashboard requires a session cookie. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use the approved account and least-privilege scope without logging secrets.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Authenticated scraping.

**Decision-useful evidence:** For Authenticated scraping, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A permitted internal dashboard requires a session cookie.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Reuse a token forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Authenticated scraping, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A permitted internal dashboard requires a session cookie.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use the approved account and least-privilege scope without logging secrets. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A permitted internal dashboard requires a session cookie." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Authenticated scraping principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-070 | W6 | Authenticated scraping | Synthesis

A teammate proposes: "Reuse a token forever." For this Authenticated scraping situation (A permitted internal dashboard requires a session cookie.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use the approved account and least-privilege scope without logging secrets.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Authenticated scraping, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A permitted internal dashboard requires a session cookie.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Reuse a token forever" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Authenticated scraping, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Reuse a token forever." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use the approved account and least-privilege scope without logging secrets. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.

**Failure checks:**

- Repeat the original case and verify that "A permitted internal dashboard requires a session cookie." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Authenticated scraping principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-071 | W6 | Rate limits, retries, and caching | Applied

You are responsible for this Rate limits, retries, and caching problem: A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Rate limits, retries, and caching.

**Decision-useful evidence:** For Rate limits, retries, and caching, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Treat every timeout as proof that no write happened" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Rate limits, retries, and caching, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Rate limits, retries, and caching principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-072 | W6 | Rate limits, retries, and caching | Synthesis

A teammate proposes: "Treat every timeout as proof that no write happened." For this Rate limits, retries, and caching situation (A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Rate limits, retries, and caching, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Treat every timeout as proof that no write happened" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Rate limits, retries, and caching, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Treat every timeout as proof that no write happened." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.

**Failure checks:**

- Repeat the original case and verify that "A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Rate limits, retries, and caching principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-073 | W6 | Change detection and anti-bot resilience | Applied

You are responsible for this Change detection and anti-bot resilience problem: A page layout changes but the underlying product record does not, while one product later changes price. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to match by stable record identity, compare normalized business fields, and retain the before-and-after provenance.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Change detection and anti-bot resilience.

**Decision-useful evidence:** For Change detection and anti-bot resilience, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A page layout changes but the underlying product record does not, while one product later changes price.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Treat every DOM change as a new record" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Change detection and anti-bot resilience, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A page layout changes but the underlying product record does not, while one product later changes price.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A page layout changes but the underlying product record does not, while one product later changes price." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Change detection and anti-bot resilience principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-074 | W6 | Change detection and anti-bot resilience | Synthesis

A teammate proposes: "Treat every DOM change as a new record." For this Change detection and anti-bot resilience situation (A page layout changes but the underlying product record does not, while one product later changes price.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Change detection and anti-bot resilience, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A page layout changes but the underlying product record does not, while one product later changes price.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Treat every DOM change as a new record" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Change detection and anti-bot resilience, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Treat every DOM change as a new record." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.

**Failure checks:**

- Repeat the original case and verify that "A page layout changes but the underlying product record does not, while one product later changes price." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Change detection and anti-bot resilience principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-075 | W6 | HTML, tabular, and document parsing | Applied

You are responsible for this HTML, tabular, and document parsing problem: An HTML table contains merged cells and a document has scanned pages. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use format-aware parsing and flag uncertain extraction.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for HTML, tabular, and document parsing.

**Decision-useful evidence:** For HTML, tabular, and document parsing, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An HTML table contains merged cells and a document has scanned pages.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Trust OCR without review" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For HTML, tabular, and document parsing, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: An HTML table contains merged cells and a document has scanned pages.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use format-aware parsing and flag uncertain extraction. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "An HTML table contains merged cells and a document has scanned pages." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the HTML, tabular, and document parsing principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-076 | W6 | HTML, tabular, and document parsing | Synthesis

A teammate proposes: "Trust OCR without review." For this HTML, tabular, and document parsing situation (An HTML table contains merged cells and a document has scanned pages.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use format-aware parsing and flag uncertain extraction.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For HTML, tabular, and document parsing, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (An HTML table contains merged cells and a document has scanned pages.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Trust OCR without review" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For HTML, tabular, and document parsing, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Trust OCR without review." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use format-aware parsing and flag uncertain extraction. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

**Failure checks:**

- Repeat the original case and verify that "An HTML table contains merged cells and a document has scanned pages." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the HTML, tabular, and document parsing principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-077 | W6 | Vision, speech, and video acquisition | Applied

You are responsible for this Vision, speech, and video acquisition problem: A video contains spoken claims and on-screen figures. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to align transcripts, frames, timestamps, and confidence before summarizing.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Vision, speech, and video acquisition.

**Decision-useful evidence:** For Vision, speech, and video acquisition, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A video contains spoken claims and on-screen figures.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Present OCR guesses as facts" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Vision, speech, and video acquisition, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A video contains spoken claims and on-screen figures.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Align transcripts, frames, timestamps, and confidence before summarizing. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A video contains spoken claims and on-screen figures." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Vision, speech, and video acquisition principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-078 | W6 | Vision, speech, and video acquisition | Synthesis

A teammate proposes: "Present OCR guesses as facts." For this Vision, speech, and video acquisition situation (A video contains spoken claims and on-screen figures.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Align transcripts, frames, timestamps, and confidence before summarizing.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Vision, speech, and video acquisition, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A video contains spoken claims and on-screen figures.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Present OCR guesses as facts" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Vision, speech, and video acquisition, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Present OCR guesses as facts." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Align transcripts, frames, timestamps, and confidence before summarizing. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.

**Failure checks:**

- Repeat the original case and verify that "A video contains spoken claims and on-screen figures." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Vision, speech, and video acquisition principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-079 | W6 | OSINT and scheduled collection | Applied

You are responsible for this OSINT and scheduled collection problem: A dossier must be refreshed weekly without duplicating old findings. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to schedule an authorized job with provenance, deduplication, and change history.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for OSINT and scheduled collection.

**Decision-useful evidence:** For OSINT and scheduled collection, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A dossier must be refreshed weekly without duplicating old findings.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Search private accounts" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For OSINT and scheduled collection, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A dossier must be refreshed weekly without duplicating old findings.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Schedule an authorized job with provenance, deduplication, and change history. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A dossier must be refreshed weekly without duplicating old findings." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the OSINT and scheduled collection principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-080 | W6 | OSINT and scheduled collection | Synthesis

A teammate proposes: "Search private accounts." For this OSINT and scheduled collection situation (A dossier must be refreshed weekly without duplicating old findings.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Schedule an authorized job with provenance, deduplication, and change history.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For OSINT and scheduled collection, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A dossier must be refreshed weekly without duplicating old findings.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Search private accounts" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For OSINT and scheduled collection, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Search private accounts." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Schedule an authorized job with provenance, deduplication, and change history. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.

**Failure checks:**

- Repeat the original case and verify that "A dossier must be refreshed weekly without duplicating old findings." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the OSINT and scheduled collection principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-081 | W7 | CI/CD and advanced Docker | Applied

You are responsible for this CI/CD and advanced Docker problem: A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for CI/CD and advanced Docker.

**Decision-useful evidence:** For CI/CD and advanced Docker, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Rebuild a different image in production and roll out to everyone at once" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For CI/CD and advanced Docker, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the CI/CD and advanced Docker principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-082 | W7 | CI/CD and advanced Docker | Synthesis

A teammate proposes: "Rebuild a different image in production and roll out to everyone at once." For this CI/CD and advanced Docker situation (A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For CI/CD and advanced Docker, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Rebuild a different image in production and roll out to everyone at once" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For CI/CD and advanced Docker, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Rebuild a different image in production and roll out to everyone at once." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.

**Failure checks:**

- Repeat the original case and verify that "A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the CI/CD and advanced Docker principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-083 | W7 | LLM security and OWASP risks | Applied

You are responsible for this LLM security and OWASP risks problem: Retrieved text tells an agent to ignore its system policy and exfiltrate a secret. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to treat retrieved text as untrusted data and enforce server-side authorization and tool limits.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for LLM security and OWASP risks.

**Decision-useful evidence:** For LLM security and OWASP risks, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Retrieved text tells an agent to ignore its system policy and exfiltrate a secret.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Give the retriever admin permissions" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For LLM security and OWASP risks, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: Retrieved text tells an agent to ignore its system policy and exfiltrate a secret.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Treat retrieved text as untrusted data and enforce server-side authorization and tool limits. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "Retrieved text tells an agent to ignore its system policy and exfiltrate a secret." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the LLM security and OWASP risks principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-084 | W7 | LLM security and OWASP risks | Synthesis

A teammate proposes: "Give the retriever admin permissions." For this LLM security and OWASP risks situation (Retrieved text tells an agent to ignore its system policy and exfiltrate a secret.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Treat retrieved text as untrusted data and enforce server-side authorization and tool limits.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For LLM security and OWASP risks, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Retrieved text tells an agent to ignore its system policy and exfiltrate a secret.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Give the retriever admin permissions" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For LLM security and OWASP risks, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Give the retriever admin permissions." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Treat retrieved text as untrusted data and enforce server-side authorization and tool limits. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

**Failure checks:**

- Repeat the original case and verify that "Retrieved text tells an agent to ignore its system policy and exfiltrate a secret." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the LLM security and OWASP risks principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-085 | W7 | VMs, SSH, serverless, and IaC | Applied

You are responsible for this VMs, SSH, serverless, and IaC problem: A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to review the diff and blast radius, test the plan, and apply with scoped access and protected state.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for VMs, SSH, serverless, and IaC.

**Decision-useful evidence:** For VMs, SSH, serverless, and IaC, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Make manual console edits only" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For VMs, SSH, serverless, and IaC, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Review the diff and blast radius, test the plan, and apply with scoped access and protected state. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the VMs, SSH, serverless, and IaC principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-086 | W7 | VMs, SSH, serverless, and IaC | Synthesis

A teammate proposes: "Make manual console edits only." For this VMs, SSH, serverless, and IaC situation (A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Review the diff and blast radius, test the plan, and apply with scoped access and protected state.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For VMs, SSH, serverless, and IaC, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Make manual console edits only" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For VMs, SSH, serverless, and IaC, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Make manual console edits only." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Review the diff and blast radius, test the plan, and apply with scoped access and protected state. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.

**Failure checks:**

- Repeat the original case and verify that "A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the VMs, SSH, serverless, and IaC principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-087 | W7 | Budgets and event-driven cloud | Applied

You are responsible for this Budgets and event-driven cloud problem: A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Budgets and event-driven cloud.

**Decision-useful evidence:** For Budgets and event-driven cloud, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Disable all retries" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Budgets and event-driven cloud, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Budgets and event-driven cloud principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-088 | W7 | Budgets and event-driven cloud | Synthesis

A teammate proposes: "Disable all retries." For this Budgets and event-driven cloud situation (A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Budgets and event-driven cloud, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Disable all retries" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Budgets and event-driven cloud, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Disable all retries." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.

**Failure checks:**

- Repeat the original case and verify that "A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Budgets and event-driven cloud principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-089 | W8 | Cloud Storage and BigQuery ML | Applied

You are responsible for this Cloud Storage and BigQuery ML problem: A model training job must be traceable back to immutable input data, including a corrected source record. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to write a versioned correction with reason, author, parent data version, and reproducible query lineage.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Cloud Storage and BigQuery ML.

**Decision-useful evidence:** For Cloud Storage and BigQuery ML, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A model training job must be traceable back to immutable input data, including a corrected source record.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Train from an undocumented dashboard click" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Cloud Storage and BigQuery ML, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A model training job must be traceable back to immutable input data, including a corrected source record.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Write a versioned correction with reason, author, parent data version, and reproducible query lineage. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A model training job must be traceable back to immutable input data, including a corrected source record." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Cloud Storage and BigQuery ML principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-090 | W8 | Cloud Storage and BigQuery ML | Synthesis

A teammate proposes: "Train from an undocumented dashboard click." For this Cloud Storage and BigQuery ML situation (A model training job must be traceable back to immutable input data, including a corrected source record.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Write a versioned correction with reason, author, parent data version, and reproducible query lineage.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Cloud Storage and BigQuery ML, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A model training job must be traceable back to immutable input data, including a corrected source record.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Train from an undocumented dashboard click" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Cloud Storage and BigQuery ML, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Train from an undocumented dashboard click." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Write a versioned correction with reason, author, parent data version, and reproducible query lineage. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.

**Failure checks:**

- Repeat the original case and verify that "A model training job must be traceable back to immutable input data, including a corrected source record." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Cloud Storage and BigQuery ML principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-091 | W8 | MLflow | Applied

You are responsible for this MLflow problem: A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to require a complete run record and evidence before promotion.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for MLflow.

**Decision-useful evidence:** For MLflow, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Promote from the best-looking chart" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For MLflow, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Require a complete run record and evidence before promotion. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the MLflow principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-092 | W8 | MLflow | Synthesis

A teammate proposes: "Promote from the best-looking chart." For this MLflow situation (A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Require a complete run record and evidence before promotion.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For MLflow, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Promote from the best-looking chart" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For MLflow, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Promote from the best-looking chart." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Require a complete run record and evidence before promotion. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

**Failure checks:**

- Repeat the original case and verify that "A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the MLflow principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-093 | W8 | Fine-tuning strategy | Applied

You are responsible for this Fine-tuning strategy problem: A model knows facts but consistently emits the wrong output format. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to fix the contract or use structured output before fine-tuning for facts.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Fine-tuning strategy.

**Decision-useful evidence:** For Fine-tuning strategy, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A model knows facts but consistently emits the wrong output format.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Increase model size without diagnosis" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Fine-tuning strategy, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A model knows facts but consistently emits the wrong output format.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Fix the contract or use structured output before fine-tuning for facts. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A model knows facts but consistently emits the wrong output format." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Fine-tuning strategy principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-094 | W8 | Fine-tuning strategy | Synthesis

A teammate proposes: "Increase model size without diagnosis." For this Fine-tuning strategy situation (A model knows facts but consistently emits the wrong output format.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Fix the contract or use structured output before fine-tuning for facts.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Fine-tuning strategy, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A model knows facts but consistently emits the wrong output format.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Increase model size without diagnosis" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Fine-tuning strategy, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Increase model size without diagnosis." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Fix the contract or use structured output before fine-tuning for facts. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.

**Failure checks:**

- Repeat the original case and verify that "A model knows facts but consistently emits the wrong output format." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Fine-tuning strategy principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-095 | W8 | Hugging Face and fine-tuning techniques | Applied

You are responsible for this Hugging Face and fine-tuning techniques problem: A small domain dataset must adapt a base model while limiting memory use. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to use an adapter-based method with held-out evaluation and documented provenance.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Hugging Face and fine-tuning techniques.

**Decision-useful evidence:** For Hugging Face and fine-tuning techniques, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A small domain dataset must adapt a base model while limiting memory use.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Publish without a card" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Hugging Face and fine-tuning techniques, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A small domain dataset must adapt a base model while limiting memory use.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Use an adapter-based method with held-out evaluation and documented provenance. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A small domain dataset must adapt a base model while limiting memory use." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Hugging Face and fine-tuning techniques principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-096 | W8 | Hugging Face and fine-tuning techniques | Synthesis

A teammate proposes: "Publish without a card." For this Hugging Face and fine-tuning techniques situation (A small domain dataset must adapt a base model while limiting memory use.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Use an adapter-based method with held-out evaluation and documented provenance.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Hugging Face and fine-tuning techniques, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A small domain dataset must adapt a base model while limiting memory use.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Publish without a card" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Hugging Face and fine-tuning techniques, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Publish without a card." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Use an adapter-based method with held-out evaluation and documented provenance. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.

**Failure checks:**

- Repeat the original case and verify that "A small domain dataset must adapt a base model while limiting memory use." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Hugging Face and fine-tuning techniques principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-097 | W8 | Quantization and Gemma fine-tuning | Applied

You are responsible for this Quantization and Gemma fine-tuning problem: A model fits only after quantization but its factual accuracy changes. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to benchmark quality, latency, and memory before admitting the artifact.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Quantization and Gemma fine-tuning.

**Decision-useful evidence:** For Quantization and Gemma fine-tuning, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A model fits only after quantization but its factual accuracy changes.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Assume lower precision is free" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Quantization and Gemma fine-tuning, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: A model fits only after quantization but its factual accuracy changes.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Benchmark quality, latency, and memory before admitting the artifact. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "A model fits only after quantization but its factual accuracy changes." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Quantization and Gemma fine-tuning principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-098 | W8 | Quantization and Gemma fine-tuning | Synthesis

A teammate proposes: "Assume lower precision is free." For this Quantization and Gemma fine-tuning situation (A model fits only after quantization but its factual accuracy changes.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Benchmark quality, latency, and memory before admitting the artifact.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Quantization and Gemma fine-tuning, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (A model fits only after quantization but its factual accuracy changes.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Assume lower precision is free" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Quantization and Gemma fine-tuning, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Assume lower precision is free." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Benchmark quality, latency, and memory before admitting the artifact. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.

**Failure checks:**

- Repeat the original case and verify that "A model fits only after quantization but its factual accuracy changes." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Quantization and Gemma fine-tuning principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-099 | W8 | Model publishing and cards | Applied

You are responsible for this Model publishing and cards problem: Users need to know whether a model is suitable for production. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

**Model answer**

Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to provide a model card and immutable version with limitations.

**Valid vs invalid claim:** Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for Model publishing and cards.

**Decision-useful evidence:** For Model publishing and cards, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Users need to know whether a model is suitable for production.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Hide evaluation failures" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Model publishing and cards, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: Users need to know whether a model is suitable for production.
2. Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.
3. Apply the smallest robust response: Provide a model card and immutable version with limitations. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.
4. Verify that the result follows this governing principle: Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details. Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.

**Failure checks:**

- Repeat the original case and verify that "Users need to know whether a model is suitable for production." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Model publishing and cards principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

### SUB-100 | W8 | Model publishing and cards | Synthesis

A teammate proposes: "Hide evaluation failures." For this Model publishing and cards situation (Users need to know whether a model is suitable for production.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

**Model answer**

Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: Provide a model card and immutable version with limitations.

**Valid vs invalid claim:** Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.

**Decision-useful evidence:** For Model publishing and cards, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (Users need to know whether a model is suitable for production.), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.

**Rejected alternative:** Reject "Hide evaluation failures" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.

**Decision-changing uncertainty:** For Model publishing and cards, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.

**Steps:**

1. Treat the proposal as an unverified claim, not a conclusion: "Hide evaluation failures." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.
2. Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.
3. Use this precise safer response instead: Provide a model card and immutable version with limitations. Apply it first to the smallest reversible scope and define rollback before expansion.
4. Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

**Failure checks:**

- Repeat the original case and verify that "Users need to know whether a model is suitable for production." no longer produces the bad outcome.
- Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.

**Trade-off:** The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the Model publishing and cards principle.

**Simple explanation:** In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.

**Marking rubric (10 marks):**

- 2 marks: States a defensible decision and separates observed facts from inference
- 2 marks: Chooses decision-useful evidence with provenance instead of decorative evidence
- 2 marks: Names a high-leverage question or unknown and weighs probability with impact
- 2 marks: Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code
- 2 marks: Includes relevant failure checks, trade-off, and observable acceptance evidence

## Sources

1. Official May 2026 course index: https://tds.s-anand.net/
2. Topic research and mock blueprint: mock-banks/T2-2026-May-Course-Deep-Dive.md
3. Historical material was used only for broad question behavior. Old topic weights and questions were not copied.