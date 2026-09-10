# T2 2026 May Term: Course Deep Dive and Mock Design Research

## Purpose

This dossier converts the official May 2026 Tools in Data Science curriculum into an exam-preparation model. It is not a question paper and does not claim to predict the end-term. Its job is to define what a high-quality mock must test before the mock format is chosen.

Research snapshot:

- Official course index: [May 2026 Tools in Data Science](https://tds.s-anand.net/)
- Official source repository: [sanand0/tools-in-data-science-public](https://github.com/sanand0/tools-in-data-science-public)
- Source snapshot inspected: commit `fc01e538d46b23fcb3a4ec15a96c28c85ed6f3cf` (2026-08-26)
- Core lesson corpus indexed: 127 Markdown files and approximately 189,000 words across the bridge course and Weeks 1-8
- Full official study corpus indexed: 150 Markdown files and approximately 222,000 words after adding labs, projects, and references
- Course-level assessment description: [IIT Madras BSSE2002](https://study.iitm.ac.in/ds/course_pages/BSSE2002.html)

The current course explicitly says that its notes are topic references, that practice must go beyond them, and that the course models unclear problems, messy data, deadlines, and limited support. Therefore, a useful mock must test transfer and diagnosis, not merely copied sentences.

## Evidence Rules

Evidence is ranked as follows:

1. **Primary:** May 2026 official lesson source and official course/assessment pages.
2. **Strong supporting:** official labs, capstones, project contracts, command cheatsheet, and tools glossary.
3. **Pattern evidence:** public practice sets and student reports, used only to study question form.
4. **Weak evidence:** older-term papers and third-party mocks. The May 2026 syllabus is substantially different, so these cannot define topic weight or exact content.

No publicly verifiable May 2026 end-term paper exists at this snapshot date because the official schedule places the exam on 13 September 2026. Historical analysis must therefore remain probabilistic.

## What The Course Actually Rewards

Across the official lessons, four recurring abilities dominate:

1. **Select:** choose the smallest correct tool or architecture under stated constraints.
2. **Execute:** know the concrete command, request, schema, or control flow that makes it work.
3. **Diagnose:** infer a failure from status codes, logs, browser behavior, resource limits, or malformed data.
4. **Defend:** explain security, cost, reproducibility, evaluation, and operational trade-offs.

A strong end-term mock should therefore contain:

- direct concept checks, but only as a minority;
- command/output prediction;
- short code and configuration debugging;
- scenario-based tool selection;
- ordering and pipeline questions;
- multiple-correct questions where several controls are required;
- numerical work for token cost, vector similarity, memory, retry timing, and cloud cost;
- subjective design answers graded with explicit evidence requirements.

## Week 0: Bridge Course

### Day 1 - Setup, Filesystems, and Paths

**Complete Notes**

- Core: Windows and Linux use different path syntax, separators, roots, home directories, and shell conventions. Portable code uses `pathlib` or equivalent path APIs instead of hard-coded separators.
- Practical: identify the current OS/shell, inspect `PATH`, locate executables, and distinguish terminal, shell, filesystem, editor, and runtime.
- Trap: a path can be syntactically valid but resolve relative to an unexpected working directory.
- Best mock form: predict which paths work on Windows, WSL, and Linux; repair a hard-coded path.

**Installation**

- Core: installation has three checks: package installed, executable discoverable, and expected version active.
- Practical: verify Git, Python, UV, VS Code, Node, and shell integration with version commands.
- Trap: installing a tool does not guarantee the active terminal can find it; stale terminals and multiple Python installations are common causes.
- Best mock form: diagnose `command not found`, wrong Python version, or a VS Code terminal using a different environment.

**File Structure: Windows vs Linux**

- Core: `/`, `/home`, `/etc`, `/var`, `/tmp`, drive letters, WSL mounts, case sensitivity, hidden files, and permissions have distinct roles.
- Practical: translate between `C:\Users\name\project` and `/mnt/c/Users/name/project` without assuming they are equivalent in every context.
- Trap: Linux is case-sensitive; `/tmp` is temporary; `/etc` is configuration, not a personal working folder.
- Best mock form: choose the correct directory for source, config, logs, temporary files, and user data.

**Path Reading**

- Core: absolute versus relative paths; `.`, `..`, `~`, root, path normalization, and current working directory.
- Practical: resolve a multi-step relative path and identify what `cd`, `pwd`, and `realpath` reveal.
- Trap: `~` expansion is a shell feature and quoted or programmatic paths may behave differently.
- Best mock form: compute the final path after a sequence of `cd` commands.

**Day 1 Quiz and Exercises**

- Coverage signal: the official exercises emphasize hands-on navigation, hidden files, environment verification, and platform translation.
- Mock implication: include executable terminal traces, not only definitions.

### Day 2 - Linux and Shell Essentials

**Survival Toolkit / Complete Notes**

- Core: navigation, creation, inspection, copying, moving, deletion, search, pipes, redirection, permissions, processes, and shell composition.
- Practical: combine small commands into auditable pipelines and inspect before destructive actions.
- Trap: shell quoting and expansion happen before a program receives its arguments.
- Best mock form: predict argv, stdout, stderr, and filesystem state after a command sequence.

**Terminal Navigation**

- Core: `pwd`, `ls`, `cd`, hidden entries, long listings, file types, ownership, and permissions.
- Practical: interpret `ls -la` output and navigate with absolute and relative paths.
- Trap: `.` and `..` are real directory entries; `ls` without `-a` omits dotfiles.
- Best mock form: infer permissions/type from an `ls -l` row and select the command that reaches a target.

**`touch`, `mkdir`, `rm`, `cp`, `mv`**

- Core: file creation/timestamp updates, recursive directory creation, copy versus move, recursive deletion, and overwrite behavior.
- Practical: use `mkdir -p`, `cp -r`, and carefully scoped `rm -r` commands.
- Trap: `rm` has no recycle bin; glob expansion can target more paths than expected; `touch` on an existing file changes timestamps.
- Best mock form: determine the resulting directory tree and identify the destructive command.

**Basic Script Writing**

- Core: shebang, executable permission, variables, positional parameters, exit status, quoting, and strict modes.
- Practical: run a script via `bash script.sh` or `./script.sh`, understand why `chmod +x` and a valid shebang matter.
- Trap: an unquoted variable can split into multiple arguments or expand globs.
- Best mock form: fix a script that fails on filenames containing spaces.

**Day 2 Quiz and Exercises**

- Coverage signal: the course expects actual command construction, counting, filtering, and safe file manipulation.
- Mock implication: include short terminal tasks with exact final output.

### Day 3 - VS Code, Virtual Environments, and UV

**VS Code Setup**

- Core: open the project folder, select the correct interpreter, use the integrated terminal, and distinguish user from workspace settings.
- Practical: use the Command Palette, extensions, file explorer, source control, and terminal in one project context.
- Trap: opening a single file can prevent workspace settings and interpreter discovery from behaving as expected.
- Best mock form: diagnose why imports work in one terminal but remain unresolved in VS Code.

**Virtual Environments**

- Core: environments isolate interpreters and dependencies; activation changes command resolution, not source code.
- Practical: create, activate, deactivate, and verify the active interpreter/package location.
- Trap: `pip` and `python` may refer to different installations; activation is shell-session specific.
- Best mock form: interpret `which python` / `where python` and repair dependency leakage.

**UV Workflow**

- Core: UV manages Python versions, environments, dependencies, lockfiles, scripts, and tools.
- Practical: distinguish `uv run`, `uv add`, `uv sync`, `uvx`, and `uv tool install`.
- Trap: `uv run` can manage an environment without manual activation; global tool installation and project dependency installation solve different problems.
- Best mock form: select the minimal command for a reproducible project or one-off CLI run.

**Day 3 Quiz and Exercises**

- Coverage signal: project initialization, dependency addition, script execution, and HTTP JSON use are joined into one workflow.
- Mock implication: test the complete project state, including `pyproject.toml` and lockfile behavior.

### Day 4 - HTTP, APIs, and Chrome DevTools

**HTTP Fundamentals**

- Core: request method, URL, headers, body, response status, headers, body, idempotency, and CRUD mapping.
- Practical: classify 2xx, 3xx, 4xx, and 5xx responses and choose GET/POST/PUT/PATCH/DELETE correctly.
- Trap: transport success is not application success; a `200` HTML fallback can still be the wrong API response.
- Best mock form: inspect a raw exchange and identify the failure layer.

**Chrome DevTools**

- Core: Network panel, request/response headers, payload, initiator, timing, cookies, storage, console, and cache controls.
- Practical: reproduce a browser request and distinguish frontend, CORS, authentication, and backend failures.
- Trap: the Console message is often only a symptom; the Network response body and headers contain the evidence.
- Best mock form: diagnose a screenshot/trace where `curl` works but the browser fails.

**API Testing with curl**

- Core: GET, headers, JSON bodies, authentication, verbose mode, redirects, status extraction, and output files.
- Practical: construct `curl` requests with `-i`, `-I`, `-v`, `-L`, `-H`, `-d`, and method selection.
- Trap: `-I` sends/requests headers for HEAD behavior; `-i` includes headers with the body; JSON requires the correct content type.
- Best mock form: choose the exact curl invocation and predict which part of the exchange it prints.

**Day 4 Quiz and Exercises**

- Coverage signal: status-code interpretation and browser-versus-CLI comparison are central.
- Mock implication: include HTML-as-JSON, redirects, preflight, and missing authorization scenarios.

### Day 5 - Git and GitHub

**Git Basic Flow**

- Core: working tree, staging area, repository, commits, branches, remotes, and the status-diff-add-commit loop.
- Practical: inspect before staging and understand what each Git area contains.
- Trap: `git add` stages a snapshot; later edits are not automatically part of that staged snapshot.
- Best mock form: infer staged and unstaged changes from `git status`/`git diff` outputs.

**`init`, `add`, `commit`**

- Core: repository initialization, tracked/untracked files, staging scope, commit identity, and history.
- Practical: use `git diff`, `git diff --staged`, `git log`, and precise path-based staging.
- Trap: a commit can succeed while omitting intended files or including secrets/generated artifacts.
- Best mock form: identify exactly what a commit contains after a sequence of edits and adds.

**GitHub SSH Login**

- Core: public/private key pair, agent, host verification, GitHub account association, and SSH remote URLs.
- Practical: generate an Ed25519 key, add the public key, test authentication, and protect the private key.
- Trap: never upload or share the private key; authentication success does not grant repository authorization.
- Best mock form: distinguish key files and debug `Permission denied (publickey)`.

**Day 5 Quiz and Exercises**

- Coverage signal: repository state inspection is tested more heavily than memorizing command names.
- Mock implication: use command sequences with a precise final repository state.

## Week 1: Development Environment and Tooling

### VS Code - Basics

- Core: folder/workspace scope, layout, Command Palette, settings precedence, integrated terminal, search, and extensions.
- Practical: verify the active folder, shell, runtime, and settings before debugging code.
- Trap: user settings, workspace settings, and language-specific settings can override one another.
- Mock: diagnose a configuration that works globally but not inside one repository.

### VS Code - Advanced

- Core: interpreter selection, virtual environments, breakpoints, watches, call stack, `launch.json`, tasks, Git integration, and remote workflows.
- Practical: debug by observing state rather than inserting uncontrolled prints.
- Trap: debugger configuration can launch a different module, directory, or interpreter than the terminal command.
- Mock: repair a `launch.json` or determine why breakpoints are unbound.

### UV - Basics

- Core: script dependencies, project initialization, environments, lock resolution, and reproducible execution.
- Practical: run a single-file script with inline metadata or a managed project with `uv run`.
- Trap: a successful local run without a lock/dependency declaration is not a reproducible environment.
- Mock: choose between inline script metadata and a full project.

### UV - Advanced

- Core: `requirements.txt` migration, `pyproject.toml`, lock/sync, workspaces, tool execution, Python pinning, and publishing workflows.
- Practical: distinguish ephemeral `uvx`, global `uv tool install`, and project-scoped `uv add`.
- Trap: editing dependency declarations without syncing can leave environment state inconsistent.
- Mock: repair a CI build whose environment differs from the lockfile.

### Bash Scripting

- Core: tokenization, quoting, expansion, variables, command substitution, pipes, redirection, conditions, loops, functions, exit codes, and strict mode.
- Practical: use `set -euo pipefail` with deliberate exception handling and quote variables safely.
- Trap: `set -e` is context-sensitive; pipelines hide earlier failures unless `pipefail` is enabled.
- Mock: trace a pipeline, identify the exit status, and fix unsafe word splitting.

### Git and GitHub

- Core: commits as graph nodes, branches, remotes, fetch/pull/push, merge/rebase, conflicts, `.gitignore`, tags, and collaboration.
- Practical: inspect history and choose a recovery operation based on whether work is committed, pushed, or only staged.
- Trap: rebase rewrites commit identities; ignored files already tracked remain tracked.
- Mock: choose a non-destructive recovery path and predict branch history.

### SQLite

- Core: schema, types/affinity, constraints, primary/foreign keys, CRUD, joins, aggregation, indexes, transactions, query plans, and WAL.
- Practical: parameterize Python queries, use transactions, and inspect `EXPLAIN QUERY PLAN`.
- Trap: string interpolation creates injection risk; an index can slow writes and does not guarantee use; `NULL` needs `IS NULL`.
- Mock: write/fix SQL, predict join cardinality, and select an index for a query.

### HTTP Clients

- Core: request anatomy, methods, status handling, timeouts, redirects, sessions, cookies, retries, streaming, and clients such as curl/httpx.
- Practical: set explicit timeouts, call `raise_for_status`, reuse clients, and separate connect/read failures.
- Trap: retries can duplicate non-idempotent writes; no timeout can hang indefinitely.
- Mock: identify a robust client configuration under flaky-network constraints.

### Requestly and Burp Suite

- Core: browser request rewriting versus intercepting proxying, DNS/hosts mapping, certificates, HTTPS interception, and traffic inspection.
- Practical: route browser traffic through a local proxy, install only the intended CA, and inspect/modify requests in a controlled lab.
- Trap: certificate warnings, proxy scope, and browser trust stores can make HTTPS failures look like application bugs.
- Mock: choose Requestly for lightweight browser rewrites versus Burp for full request/response interception.

### Data Formats

- Core: UTF-8, JSON, JSONL, YAML, TOML, CSV, XML, serialization, schemas, escaping, and numeric/date ambiguity.
- Practical: parse with format-aware libraries and validate the resulting types and record counts.
- Trap: CSV is not safely parsed by splitting commas; YAML implicit typing and duplicate keys can surprise; JSON has no comments.
- Mock: choose a format, repair malformed data, or predict a parser/type result.

### GitHub Pages

- Core: static hosting, user/project site paths, deployment source, relative URLs, custom domains, DNS, HTTPS, and Actions deployment.
- Practical: publish a minimal site and verify asset paths from the deployed base URL.
- Trap: GitHub Pages cannot run a Python backend; root-relative paths often break project sites.
- Mock: debug a local site whose CSS/JS returns 404 after deployment.

### LaTeX

- Core: document structure, packages, math, tables, figures, labels/references, bibliography, compilation passes, and generated artifacts.
- Practical: compile reproducibly and use semantic commands rather than visual spacing hacks.
- Trap: references and tables of contents need multiple passes; special characters require escaping.
- Mock: repair a compile error or choose correct math/table/reference syntax.

### Week 1 Labs

**Publish a Python Library to PyPI with UV** joins package layout, naming, build metadata, versioning, authentication, publishing, and installation verification. A mock should ask what evidence proves that the published wheel, not a local checkout, was imported.

**Web Traffic Debugging with Burp Suite** joins local hosting, proxy configuration, CA trust, interception, and request mutation. A mock should ask students to localize a failure across DNS, proxy, TLS, browser, and app layers.

## Week 2: Deployment and API Engineering

### FastAPI Fundamentals

- Core: application object, path/query/body parameters, Pydantic validation, response models, dependency injection, async handlers, errors, and OpenAPI.
- Practical: build typed endpoints, return correct status codes, and test through generated docs and an HTTP client.
- Trap: route order and path converters can swallow static segments; blocking work inside `async def` blocks the event loop.
- Mock: diagnose 404/422/500 behavior or derive an OpenAPI contract from code.

### CORS and Middleware

- Core: same-origin policy, origin triples, simple versus preflight requests, allowed origins/methods/headers, credentials, and request middleware.
- Practical: configure the narrowest browser access and attach request IDs/timing in middleware.
- Trap: CORS is enforced by browsers, not curl; wildcard origins cannot be combined casually with credentialed requests.
- Mock: explain why curl succeeds while a browser fails and repair the preflight response.

### Google OAuth 2.0

- Core: authorization code flow, redirect URI, state, scopes, ID/access/refresh tokens, sessions, cookies, bearer tokens, storage, CSRF, and XSS.
- Practical: validate tokens server-side, use exact redirect URIs, and choose secure cookie attributes.
- Trap: decoding a JWT is not signature/audience/issuer validation; localStorage improves convenience but increases XSS exposure.
- Mock: find the broken trust boundary in an OAuth callback/session design.

### Config Management

- Core: environment variables, `.env`, `.env.example`, settings validation, precedence, secret rotation, and environment separation.
- Practical: fail fast when required configuration is absent and keep real secrets out of Git/logs/images.
- Trap: `.gitignore` cannot erase a secret from history; frontend build-time variables may become public.
- Mock: classify config values and propose a safe dev/CI/prod loading strategy.

### Docker and Compose

- Core: images, containers, layers, Dockerfiles, build context, ports, volumes, networks, health checks, environment, and multi-service orchestration.
- Practical: make app/database/cache services discover each other by service name and persist only intended data.
- Trap: `localhost` inside a container refers to that container; Compose `depends_on` is not automatically application readiness.
- Mock: debug connectivity or predict the effect of volume and port mappings.

### Deployment Platforms

- Core: build versus runtime, bind address, platform-provided port, process command, statelessness, persistent services, secrets, and logs.
- Practical: bind to `0.0.0.0:$PORT`, externalize state, expose health checks, and verify from outside the platform.
- Trap: local filesystem persistence and local environment assumptions often fail after redeploy or horizontal scaling.
- Mock: choose a deployable command/configuration and localize a failed health check.

### Logging and Testing

- Core: structured logs, levels, context, exception logging, pytest, fixtures, TestClient, dependency overrides, mocks, and boundary tests.
- Practical: log request identifiers without secrets and test success, validation, authentication, and upstream failure paths.
- Trap: tests that call live external services are slow and nondeterministic; logging entire request bodies can leak credentials.
- Mock: improve a test suite that passes happy paths but misses contract failures.

### Observability

- Core: logs, metrics, traces, RED signals, Prometheus counters/gauges/histograms, labels, correlation IDs, dashboards, and alerts.
- Practical: instrument request count/latency/error rate and connect symptoms to traces and logs.
- Trap: high-cardinality labels such as user IDs can overwhelm metric systems; a metric name without units is ambiguous.
- Mock: choose the correct signal and metric type for an incident question.

### Cloudflare Tunnels

- Core: loopback, wildcard bind, LAN/public IP, NAT, inbound exposure, outbound tunnel connection, temporary versus named tunnels, and access controls.
- Practical: expose a local service without opening an inbound router port and verify the origin still runs locally.
- Trap: `0.0.0.0` changes listening interfaces but does not create Internet routing; a public tunnel can expose an unauthenticated dev service.
- Mock: explain reachability at each network boundary and select required safeguards.

### Local LLMs - Basics

- Core: model weights, inference runtime, tokenizer, GGUF/safetensors, parameter count, precision, quantization, context length, KV cache, RAM/VRAM, CPU/GPU, and licensing.
- Practical: estimate whether weights plus runtime/KV overhead fit available hardware.
- Trap: model file size is not total runtime memory; longer context increases KV-cache memory and latency.
- Mock: calculate rough memory and choose an appropriate model/quantization.

### LM Studio and Ollama

- Core: model discovery/download, local serving, OpenAI-compatible APIs, daemon lifecycle, model tags, storage, and client configuration.
- Practical: run a local model, query its HTTP endpoint, and point an SDK at the local base URL.
- Trap: a compatible wire API does not make model behavior/capability equivalent; daemon and model availability are separate states.
- Mock: diagnose connection, missing-model, or endpoint-compatibility failures.

### llama.cpp and vLLM

- Core: llama.cpp for efficient GGUF/local control; vLLM for high-throughput GPU serving, batching, KV-cache management, and OpenAI-compatible service.
- Practical: choose runtime based on hardware, format, concurrency, and throughput requirements.
- Trap: quantization/build backend/model format mismatches cause failures; maximum throughput and single-request latency are different goals.
- Mock: compare two deployment scenarios and justify the runtime.

### MLX Labs

- Core: Apple Silicon unified-memory execution, `mlx-lm`, conversion, quantization, serving, and adapter fine-tuning.
- Practical: choose MLX on compatible Apple hardware and verify model/license compatibility.
- Trap: MLX is platform-specific; instructions for CUDA or GGUF do not transfer directly.
- Mock: select the viable local stack from hardware and model-format constraints.

### Week 2 Labs

**Private LLM with vLLM and API Gateway** joins model serving, gateway routing, API-key middleware, rate/cost controls, and backend substitution. Strong questions ask where authentication, validation, and timeout/retry logic belong.

**WebSocket Chat with Redis and PostgreSQL** joins long-lived connections, async database access, OAuth, Redis sessions/pub-sub, and disconnect handling. Strong questions test state ownership and horizontal scaling.

## Week 3: LLM Engineering

### Prompt Engineering - Foundations

- Core: instruction/data separation, specificity, examples, model/settings, role hierarchy, delimiters, constraints, and output shape.
- Practical: write testable prompts whose success can be evaluated without guessing intent.
- Trap: adding verbosity does not fix contradictory or underspecified instructions.
- Mock: compare prompts and identify which requirement remains untestable.

### Reliable Reasoning and Output Control

- Core: decomposition, assumptions, success criteria, self-checks, examples, sampling, verification, and externally checkable intermediate artifacts.
- Practical: request concise rationale or verification without depending on hidden chain-of-thought.
- Trap: self-consistency can repeat a shared systematic error and multiplies cost.
- Mock: choose a reliability technique for arithmetic, classification, extraction, or planning.

### Prompted Applications and Production Practice

- Core: RAG, chunking, tool definitions, tool execution boundaries, structured output, prompt injection, evaluation sets, versioning, fallbacks, and cost/latency.
- Practical: let the model request an action while trusted code validates and executes it.
- Trap: tool calling is not authorization; retrieved text is untrusted data, not a system instruction.
- Mock: repair a production flow that directly executes model output.

### Context Engineering

- Core: context-window budget, system prompt, task state, retrieved evidence, memory, tool output, ordering, salience, compression, and stale context.
- Practical: allocate context to high-value evidence and preserve source identity/recency.
- Trap: more context can reduce quality through distraction, contradiction, or truncation.
- Mock: decide what to keep, summarize, retrieve, or discard in an overflowing agent context.

### Prompt Caching

- Core: stable prefixes, cache writes/hits, TTL, token accounting, provider rules, and cache invalidation.
- Practical: place reusable long instructions/documents before variable user content and measure actual hit rates.
- Trap: tiny prefix changes or wrong ordering destroy cache reuse; caching reduces repeated input work, not output-token cost.
- Mock: calculate savings and identify why two requests miss the cache.

### Structured Output

- Core: JSON Schema/Pydantic models, required fields, enums, nested types, validation, retries, provider-native output, and tool-call schemas.
- Practical: parse into typed objects and reject/repair semantically invalid results.
- Trap: valid JSON is not necessarily schema-valid or factually correct.
- Mock: derive the schema error or choose validation constraints for a contract.

### LLM Architecture Survey

- Core: transformer, tokenization, embeddings, self-attention, positional information, encoder-only, decoder-only, encoder-decoder, pretraining, and inference.
- Practical: map model architecture to classification, generation, embedding, and sequence-to-sequence tasks.
- Trap: parameter count, context length, and capability are related but not interchangeable measures.
- Mock: match task/model architecture and reason about attention/context complexity.

### Multimodal Inputs

- Core: image/audio/document inputs, URL versus base64/file transport, MIME types, multiple assets, detail/resolution, token cost, and structured extraction.
- Practical: provide semantically relevant media and ask targeted questions with a verifiable output schema.
- Trap: downsampling can erase small text; a model may infer unsupported details from an image.
- Mock: select the correct payload and evidence check for OCR/chart/image tasks.

### Vector Embeddings

- Core: dense vectors, dimensions, model compatibility, normalization, batching, cosine/dot/Euclidean similarity, multilingual embeddings, and semantic limitations.
- Practical: embed queries and documents with the same model/version and store lineage metadata.
- Trap: vectors from different models/spaces cannot be compared meaningfully; batching changes efficiency, not semantics.
- Mock: compute similarity/ranking and identify a dimension/model mismatch.

### Similarity Search

- Core: exact versus approximate nearest neighbor, FAISS index types, recall/latency/memory trade-offs, training, adding vectors, IDs, and persistence.
- Practical: use flat indexes for smaller exact search and ANN indexes when scale requires approximation.
- Trap: some indexes require training; returned vector positions need a stable mapping to document IDs.
- Mock: choose an index under scale/recall constraints and interpret search output.

### LLM CLI Tools

- Core: model aliases, provider keys, templates, logs, plugins, attachments, structured output, and pipelines around Simon Willison's `llm` CLI.
- Practical: make reproducible CLI calls and avoid leaking prompts/keys through shell history or logs.
- Trap: environment variables and saved logs can expose sensitive data.
- Mock: construct a CLI workflow and identify where provenance should be recorded.

### AI Coding Assistants

- Core: repository context, instructions, diffs, tests, review, permissions, tool execution, and human verification across CLI/IDE agents.
- Practical: give scoped tasks, inspect changes, run focused checks, and preserve unrelated work.
- Trap: a plausible patch or passing narrow test does not prove the requested behavior.
- Mock: evaluate an agent workflow and identify missing verification evidence.

### LangSmith and LiteLLM

- Core: tracing, spans, datasets, evaluations, costs, latency, provider routing, fallbacks, budgets, and a unified OpenAI-style gateway.
- Practical: attach metadata, compare prompt/model variants, and separate observability from business logic.
- Trap: traces can capture PII/secrets; automatic fallback can silently change quality/cost behavior.
- Mock: interpret a trace/cost table or design a safe fallback policy.

### Week 3 Labs

**YouTube to Subtitles to Topics to JSON** tests a staged media pipeline, fallbacks, schemas, and artifact provenance. Mock tasks should expose a failed stage and ask what can be retried or cached independently.

**Cost-Tracking Dashboard with LangSmith** tests strategy comparison, trace collection, token pricing, and dashboard aggregation. Mock tasks should require cost calculations and fair experiment design.

## Week 4: RAG and Hybrid RAG

### Vector Databases

- Core: vectors plus metadata, collections, indexing, filtering, persistence, CRUD, and managed/local choices across FAISS, Chroma, Qdrant, and Pinecone-like systems.
- Practical: preserve document/chunk IDs, model version, metadata, and deletion/update behavior.
- Trap: updating source text without re-embedding leaves stale vectors; metadata filtering occurs in a defined stage and can affect recall.
- Mock: choose a database/index and repair lineage/update bugs.

### Chunking Strategies

- Core: fixed, sentence/paragraph, header-based, recursive, parent-child, semantic, overlap, size, metadata, and evaluation.
- Practical: align chunks with answerable units and retain parent/source context.
- Trap: too small loses meaning; too large dilutes retrieval and consumes context; overlap duplicates evidence.
- Mock: choose chunking for Markdown, code, transcripts, tables, or policy documents.

### Late Chunking

- Core: embed a long contextual sequence first and pool token representations into later chunks so local passages retain document context.
- Practical: use a long-context embedding model and map token spans to chunks correctly.
- Trap: ordinary independent chunk embedding is early chunking; model context limits still apply.
- Mock: compare retrieval behavior for ambiguous pronouns/entities under early and late chunking.

### Contextual Retrieval

- Core: prepend/generate short document-specific context for each chunk before embedding/indexing, often with prompt caching to control cost.
- Practical: create context that disambiguates the chunk without replacing source text.
- Trap: generated context can introduce unsupported claims; both context and original chunk must remain traceable.
- Mock: identify a contextualization that improves retrieval without contaminating evidence.

### Hybrid Search

- Core: dense semantic retrieval, sparse/BM25 lexical retrieval, rank fusion, normalization, and filters.
- Practical: use reciprocal rank fusion to combine rankings without pretending incomparable raw scores share a scale.
- Trap: pure vector search misses exact identifiers; pure lexical search misses paraphrases; RRF uses rank, not raw-score addition.
- Mock: calculate fused ranks or choose retrieval for codes, names, and semantic questions.

### Reranking

- Core: two-stage retrieval, bi-encoder candidate generation, cross-encoder scoring, top-k choices, latency, and learned relevance.
- Practical: retrieve broadly enough for recall, then rerank a bounded candidate set for precision.
- Trap: a reranker cannot recover documents absent from the candidate set and is too expensive over the full corpus.
- Mock: optimize top-k/rerank-k under a latency budget.

### Query Augmentation

- Core: rewriting, multi-query, HyDE, decomposition, synonym/entity expansion, and result fusion.
- Practical: select augmentation based on ambiguity, vocabulary mismatch, or multi-part intent.
- Trap: HyDE content is a retrieval aid, not evidence; uncontrolled expansion increases cost and noise.
- Mock: match the augmentation technique to the query failure.

### Semantic Caching

- Core: embedding-based cache lookup, similarity threshold, TTL, namespaces, invalidation, exact versus semantic keys, and safety.
- Practical: cache only where semantically similar inputs can safely share an answer.
- Trap: high similarity does not imply authorization equivalence, time equivalence, or tenant equivalence.
- Mock: decide whether a candidate cache hit is safe and tune false-hit/false-miss trade-offs.

### Multimodal Embeddings

- Core: shared text-image spaces such as CLIP, image/document-page embeddings, ColPali-style retrieval, OCR versus visual retrieval, and modality-aware reranking.
- Practical: embed and compare supported modalities in the same model space.
- Trap: a text-only embedding cannot capture layout/visual evidence; OCR and visual retrieval solve overlapping but different problems.
- Mock: choose a pipeline for scanned forms, diagrams, product images, or text-heavy PDFs.

### GraphRAG

- Core: entity/relation extraction, graph construction, community detection/summaries, local versus global search, provenance, and indexing cost.
- Practical: use graph structure for multi-hop/entity/global questions that vector chunks answer poorly.
- Trap: extraction errors propagate into graph answers; GraphRAG is not automatically better for simple passage lookup.
- Mock: choose graph versus vector retrieval and trace a multi-hop answer to sources.

### LLM Grounding and Citations

- Core: answer only from supplied evidence, stable chunk IDs, inline citations, source mapping, abstention, claim-level verification, and citation quality.
- Practical: require each material claim to cite a supporting chunk and verify entailment.
- Trap: a citation can exist yet fail to support the claim; retrieved evidence can conflict or be stale.
- Mock: score citation correctness/completeness or repair an unsupported answer.

### RAGAS Evaluation

- Core: faithfulness, answer relevance, context precision, context recall, evaluation datasets, evaluator LLMs, baselines, and metric limitations.
- Practical: collect question, ground truth where available, answer, and retrieved contexts; compare controlled pipeline variants.
- Trap: one aggregate score hides trade-offs; LLM-based metrics need calibration and can vary.
- Mock: identify which component failed from a metric profile and design a fair experiment.

### Week 4 Labs and Capstone

**RAGAS Evaluation Dashboard** joins dataset collection, pipeline outputs, metric computation, comparison, and visualization. It should inspire interpretation questions, not metric-definition recall alone.

**BS Degree Chatbot** joins ingestion, retrieval, grounding, citations, user experience, and evaluation. It is the best Week 4 source for end-to-end subjective architecture questions.

## Week 5: Agentic AI

### Agent Fundamentals

- Core: agent versus chatbot, observe-think/plan-act loop, tools, state, stopping, verification, and common single-agent patterns.
- Practical: use an agent only when the task benefits from iterative decisions and external actions.
- Trap: an unbounded loop can spend indefinitely or repeat failed actions.
- Mock: convert a vague agent into an explicit state machine with stop conditions.

### Tool / Function Calling

- Core: name, description, JSON schema, arguments, tool result, validation, execution, retries, authorization, idempotency, and parallel calls.
- Practical: keep tools narrow and return structured errors/results that support the next decision.
- Trap: model-generated arguments are untrusted; schema validation does not grant permission.
- Mock: repair a dangerous tool definition or determine which calls can safely run in parallel.

### Agent Evaluation and Benchmarking

- Core: task set, success criteria, tool-call correctness, completion, groundedness, latency, cost, safety, reproducibility, and failure taxonomy.
- Practical: compare agents on the same frozen tasks/environment with repeated runs and retained traces.
- Trap: judging only final prose ignores harmful actions and wasted calls; one run is inadequate for stochastic systems.
- Mock: design an eval table and diagnose misleading benchmark conclusions.

### Agent Memory Systems

- Core: working, episodic, semantic, and procedural memory; write/read policies; consolidation; retrieval; expiry; privacy; and evaluation.
- Practical: store durable, relevant, sourced facts and keep temporary task state separate.
- Trap: storing everything creates noise and privacy risk; stale memory can override current evidence.
- Mock: decide what to store, retrieve, update, or forget in a user scenario.

### Loop Engineering

- Core: goal/state, planning, action, observation, verification, retry, budget, stop/escalate, and checkpoints.
- Practical: make loops bounded, observable, resumable, and explicit about success.
- Trap: retrying the same action without changing evidence/strategy is not recovery.
- Mock: trace loop state and select the correct retry, fallback, or escalation.

### Multi-Agent Systems

- Core: supervisor, handoff, debate, pipeline, shared state, contracts, A2A versus MCP, ownership, and coordination overhead.
- Practical: delegate only separable work and include objective, inputs, constraints, output format, and completion evidence in handoffs.
- Trap: more agents increase cost and consistency problems; parallel work can race on shared state.
- Mock: choose one agent versus multiple and repair an incomplete handoff.

### Specialized Agents

- Core: browser, coding, research, data, and domain agents; capability boundaries; tools; environment; and domain-specific evaluation.
- Practical: constrain observation/action space and match verification to the specialization.
- Trap: a specialist still needs permissions, stop conditions, and failure handling.
- Mock: specify the minimum tools and evals for a given specialist.

### Model Context Protocol (MCP)

- Core: host, client, server, tools, resources, prompts, transports, capability negotiation, lifecycle, authorization, and trust boundaries.
- Practical: expose bounded capabilities and validate every tool invocation at the server.
- Trap: MCP is a protocol, not an agent or security boundary; connecting a server expands attack surface.
- Mock: map components in a diagram or find a confused MCP/A2A/tool-calling claim.

### Async and Parallelism

- Core: sequential, concurrent, parallel, async I/O, tasks, gathering, bounded concurrency, cancellation, exceptions, rate limits, and shared state.
- Practical: parallelize independent I/O with a semaphore and preserve deterministic result association.
- Trap: unbounded concurrency causes throttling/resource exhaustion; blocking CPU work inside the event loop stalls peers.
- Mock: calculate execution time, find a race, or add bounded concurrency/error collection.

### Sandboxing Agent Code

- Core: isolation boundaries, container/gVisor/VM/process choices, filesystem/network/CPU/memory/time limits, disposable environments, inputs/outputs, and auditing.
- Practical: default-deny capabilities and define an execution contract before running generated code.
- Trap: a container is not automatically a complete security boundary, especially with dangerous mounts or privileged mode.
- Mock: audit a sandbox configuration and rank escape/blast-radius risks.

### Week 5 Capstone

**Autonomous Research Agent** joins scheduled discovery, source preferences, deduplication, memory, editorial quality, citations, loop limits, and publishing. Strong mock questions ask how to prevent repeated stories, stale evidence, unsupported claims, and runaway cost.

## Week 6: Web Data Acquisition and OSINT

### Legal and Ethical Scraping

- Core: authorization, terms, robots signals, copyright/database rights, privacy, personal data, load, purpose, and jurisdiction.
- Practical: document a pre-scrape decision, minimize collected data, identify contact/opt-out paths, and rate-limit responsibly.
- Trap: public accessibility is not blanket permission; `robots.txt` is a signal, not a complete legal determination.
- Mock: evaluate a proposed scrape across legality, ethics, privacy, and operational impact.

### Hidden JSON APIs

- Core: discover XHR/fetch calls in DevTools, reproduce request parameters/headers, inspect pagination, and validate response schemas.
- Practical: prefer stable structured endpoints over rendered HTML when authorized.
- Trap: private/undocumented endpoints may change, require tokens, or prohibit use; browser-only headers are not all necessary.
- Mock: derive the minimal reproducible request from a network trace.

### Sitemaps, RSS, and Structured Data

- Core: sitemap indexes/URL sets, namespaces, RSS/Atom entries, JSON-LD, schema.org, canonical URLs, and discovery completeness.
- Practical: parse XML with namespaces, recursively follow sitemap indexes, and extract JSON-LD arrays/graphs.
- Trap: these feeds can be incomplete, stale, duplicated, or inconsistent with rendered pages.
- Mock: choose the best discovery source and deduplicate its records.

### Wayback Machine and Common Crawl

- Core: CDX indexes, snapshots, timestamps, status/mime filters, replay URLs, WARC records, indexes, and historical provenance.
- Practical: select a snapshot near a date and retain capture time/source.
- Trap: archives have gaps, replay rewriting, robots exclusions, and changed encodings; absence is not proof of nonexistence.
- Mock: construct/interpret an archive query and assess evidentiary limits.

### Playwright and Selenium

- Core: browser automation, contexts/pages, waits, locators, navigation, forms, screenshots, and Playwright-versus-Selenium trade-offs.
- Practical: prefer role/label/test-id locators and event-based waits over sleeps.
- Trap: brittle CSS chains and fixed delays create flaky tests; forgotten browser/context cleanup leaks resources.
- Mock: repair a flaky automation script or select a resilient locator.

### Playwright Advanced

- Core: request interception, API capture, storage state, parallel contexts, blocked resource types, downloads, tracing, and performance.
- Practical: reuse authenticated storage carefully and intercept the page's API when that is the stable data source.
- Trap: sharing one context across parallel users leaks cookies/state; blocking required scripts breaks the page.
- Mock: optimize a slow scraper while preserving necessary resources and isolation.

### Pagination and Infinite Scroll

- Core: page/offset/cursor pagination, next links, termination, duplicate boundaries, total counts, scroll/load-more APIs, and checkpointing.
- Practical: follow server-provided next links/cursors, stop on explicit exhaustion, and deduplicate stable IDs.
- Trap: blindly incrementing pages can loop, skip, or repeat; DOM height is an unreliable sole termination condition.
- Mock: find the stopping bug and prove completeness.

### Authenticated Scraping

- Core: sessions, cookies, CSRF tokens, login flow, bearer tokens, browser storage state, expiry, MFA, and authorization scope.
- Practical: reuse an authorized session securely and refresh it deliberately.
- Trap: copying credentials/tokens into code or logs creates account risk; authentication never implies permission to scrape all data.
- Mock: order login/CSRF steps and identify secret-handling violations.

### Rate Limits, Retries, and Caching

- Core: 429/Retry-After, exponential backoff, jitter, retryable status/method classes, bounded concurrency, timeouts, cache validators, and negative caching.
- Practical: respect server guidance, retry idempotent operations selectively, and cap attempts and total elapsed time.
- Trap: synchronized retries create thundering herds; retrying every 4xx or POST can amplify damage.
- Mock: calculate backoff, choose retryable cases, or repair an unbounded fetcher.

### Change Detection and Deduplication

- Core: canonical keys, content hashes, normalized records, snapshots, seen-state stores, upserts, slowly changing data, and event generation.
- Practical: distinguish same entity from same content and persist enough state to explain changes.
- Trap: hashing raw HTML detects irrelevant template/timestamp changes; title-based IDs collide or drift.
- Mock: select identity/content keys and infer emitted change events.

### Anti-bot Patterns

- Core: honest headers, fingerprint consistency, timing, sessions, JavaScript challenges, CAPTCHAs, IP reputation, and an escalation ladder.
- Practical: begin with permitted APIs/feeds, reasonable identity/rate, caching, and browser automation only when legitimate.
- Trap: evasion can violate policy/law and often makes a scraper less reliable; random headers can create impossible fingerprints.
- Mock: identify the legitimate next step rather than an evasion trick.

### Cloudflare Bot Protection

- Core: network/TLS/browser/behavior signals, managed challenges, Turnstile, WAF/rate limits, cookies, and legitimate access paths.
- Practical: distinguish origin failure from an edge challenge and use official APIs/access where available.
- Trap: changing only `User-Agent` does not reproduce a browser fingerprint; challenge cookies are scoped and expiring.
- Mock: interpret response headers/status and choose a compliant remediation.

### HTML to Markdown for LLMs

- Core: boilerplate removal, readability extraction, link preservation, metadata, headings, tables, code, local versus hosted converters, and token reduction.
- Practical: retain source URL/title/date and validate that key factual content survived conversion.
- Trap: aggressive extraction drops navigation-like but meaningful content, tables, captions, or dynamically loaded text.
- Mock: compare converted outputs and select what must be preserved for grounded RAG.

### DuckDB and Parquet

- Core: columnar storage, compression, predicate/projection pushdown, partitioning, SQL over files, schema evolution, DuckDB analytics, and SQLite for state.
- Practical: query Parquet directly, select needed columns, and partition by useful low/moderate-cardinality fields.
- Trap: many tiny files and over-partitioning hurt performance; Parquet is poor for frequent row-level transactional updates.
- Mock: optimize a file layout/query and choose DuckDB/Parquet versus SQLite.

### Document Parsing

- Core: text PDFs, scanned PDFs/OCR, DOCX, PPTX, spreadsheets, layout, tables, metadata, page references, and Markdown normalization.
- Practical: choose parser by document type and preserve page/section provenance.
- Trap: text extraction order can differ from visual reading order; scanned pages may contain no text layer.
- Mock: design a fallback pipeline and validate extraction quality.

### Vision Models for Scraping

- Core: screenshot capture, targeted crops, OCR-plus-vision, structured schema, confidence/evidence, batching, and cost.
- Practical: use vision when layout or pixels carry information unavailable in DOM/API data.
- Trap: vision should not replace a clean JSON/DOM source; screenshots can omit off-screen or hidden state.
- Mock: choose DOM/API/vision and define a verification step.

### Image Processing Pipeline

- Core: decode, orientation, color mode, resize, crop, normalize, metadata, compression, exact/perceptual hashes, quality checks, and provenance.
- Practical: normalize before fingerprinting and retain the original when transformations are lossy.
- Trap: perceptual hashes deliberately collide for near-identical images and are not cryptographic integrity hashes.
- Mock: order transformations and select the correct hash for deduplication versus tamper detection.

### Speech AI

- Core: transcription, model size, language, timestamps, diarization, VAD, noise, chunking, confidence, and CPU/GPU trade-offs.
- Practical: retain segment timestamps and evaluate on representative accents/noise.
- Trap: transcription, translation, and speaker diarization are separate tasks; audio resampling/chunk boundaries affect quality.
- Mock: choose a pipeline and calculate/interpret timestamped segments.

### Video Understanding

- Core: ffmpeg probing, frame sampling, scene detection, audio extraction, transcription, visual analysis, temporal alignment, and summaries.
- Practical: avoid processing every frame; select frames/events and preserve timestamps linking evidence to the source.
- Trap: one-frame-per-second can miss short events and oversample static scenes.
- Mock: design an efficient pipeline under duration/cost constraints.

### Google Dorking

- Core: operators such as `site:`, `filetype:`, quoted phrases, exclusions, `intitle:`, `inurl:`, and date/domain narrowing.
- Practical: compose precise discovery queries and convert results into a sourced dataset manually or through permitted APIs.
- Trap: indexed content can be stale/sensitive and search-result scraping may violate service terms.
- Mock: construct the narrowest query and assess exposure responsibly.

### OSINT - Infrastructure and Records

- Core: DNS, WHOIS/RDAP, certificate transparency, IP/ASN, registries, public records, timestamps, pivots, corroboration, and uncertainty.
- Practical: use at least two independent sources and record query time because infrastructure changes.
- Trap: shared hosting/CDNs and stale registrations make attribution uncertain; correlation is not identity proof.
- Mock: build a cautious inference chain and identify unsupported attribution.

### Scheduled Scraping

- Core: cron/GitHub Actions schedules, UTC, idempotency, locks, retries, secrets, artifacts, empty-result guards, monitoring, and retention.
- Practical: make reruns safe and refuse to overwrite known-good data with an unexplained empty result.
- Trap: scheduled jobs can overlap, silently stop, or run at unexpected local times due to UTC/DST.
- Mock: repair a workflow YAML and design run-state/alert behavior.

### Week 6 Labs and Capstones

- **Scheduled Scraper:** emphasizes reproducible dependencies, cron, artifacts, validation, and idempotent updates.
- **Open-Source Organisation Dossier:** emphasizes corroborated OSINT, citations, scope, and automatic-zero risks such as unsupported claims.
- **Job Posting Tracker:** emphasizes pagination, stable IDs, change events, caching, and scheduled reliability.
- **AI Signature Detection and Cropper:** emphasizes image normalization, vision/OCR, coordinates, quality checks, and reproducible outputs.
- **Live Multilingual Translator:** emphasizes streaming speech, language handling, latency, partial/final transcript state, and failure fallbacks.
- Mock implication: subjective questions should cross at least three stages and require operational evidence, not just a tool list.

## Week 7: CI/CD, Security, and Cloud

### GitHub Actions Advanced

- Core: triggers, jobs/steps, matrices, caching, artifacts, environments, secrets, permissions, concurrency, reusable workflows, and supply-chain pinning.
- Practical: grant minimal `GITHUB_TOKEN` permissions, pin actions, cache by lockfile, and prevent conflicting deployments.
- Trap: cache is not an artifact; untrusted pull requests must not receive deployment secrets.
- Mock: audit a workflow for correctness, speed, and secret exposure.

### Advanced Docker

- Core: multi-stage builds, layer order/cache, small runtime images, non-root users, `.dockerignore`, health checks, signals, read-only filesystems, and scanning.
- Practical: copy dependency manifests before source to preserve cache and copy only built/runtime artifacts into the final stage.
- Trap: installing compilers and secrets in the final image increases size and attack surface; `latest` is not reproducible.
- Mock: reorder a Dockerfile and identify what remains in each stage/layer.

### LLM Security - Offensive

- Core: direct/indirect prompt injection, data exfiltration, insecure tool use, retrieval poisoning, privilege escalation, denial of wallet/service, and attack chains.
- Practical: red-team only authorized systems, log traces, and turn successful attacks into regression tests.
- Trap: a model saying it will ignore an injection is not a security control.
- Mock: trace an attack from untrusted content to a privileged tool and identify the first enforceable boundary.

### LLM Safety - Defensive

- Core: least privilege, trusted/untrusted separation, input/output validation, tool policy, human approval, sandboxing, rate/budget limits, monitoring, and incident response.
- Practical: enforce controls in deterministic code around the model.
- Trap: keyword filters and prompt-only defenses are brittle and cannot authorize actions.
- Mock: rank defense layers and repair a system where model output reaches a dangerous sink.

### OWASP LLM Top 10

- Core: the 2025 risk categories, especially prompt injection, sensitive information disclosure, supply chain, data/model poisoning, improper output handling, excessive agency, system prompt leakage, vector/embedding weaknesses, misinformation, and unbounded consumption.
- Practical: map concrete architecture flaws to risks and mitigations.
- Trap: labels overlap; the useful answer identifies source, trust boundary, sink, impact, and control rather than naming a category alone.
- Mock: classify a multi-stage incident and choose layered mitigations.

### Cloudflare - Defender's Side

- Core: DNS/CDN proxy, TLS, WAF, rate limiting, bot controls, Turnstile, Access, origin protection, headers, logs, and cache rules.
- Practical: verify Turnstile server-side and keep the origin from bypassing edge protections.
- Trap: client-side Turnstile success is not verification; exposing the origin IP can bypass configured controls.
- Mock: identify where each defense executes and diagnose a bypass.

### Dorking for Recon and Exposure

- Core: discover indexed secrets/backups/admin pages/repos, repository secret scanning, validation without misuse, remediation, rotation, and de-indexing.
- Practical: audit assets you own and treat discovered credentials as compromised.
- Trap: deleting a file does not revoke a secret or remove Git/search history.
- Mock: order the remediation steps after a leaked key is found.

### Person and Social OSINT

- Core: usernames, profile pivots, reverse image concepts, metadata, timelines, relationship inference, consent, uncertainty, and self-auditing.
- Practical: document source/time and separate verified facts from hypotheses.
- Trap: name/image similarity is weak identity evidence; doxxing and sensitive inference create real harm.
- Mock: assess confidence and ethical boundaries in an attribution scenario.

### VMs and SSH

- Core: instances/images, keys, users, permissions, firewalls, updates, SSH config, port forwarding, file transfer, tmux, systemd, and hardening.
- Practical: use keys, disable unsafe access, narrow firewall rules, and run durable services under a supervisor.
- Trap: opening `0.0.0.0/0` or copying private keys broadly destroys isolation; closing a shell kills unsupervised foreground jobs.
- Mock: harden a VM and select local/remote/dynamic forwarding.

### Serverless Functions

- Core: stateless requests, cold starts, concurrency, timeouts, ephemeral filesystem, event/HTTP triggers, scale-to-zero, identity, and vendor constraints.
- Practical: externalize state and design idempotent handlers with bounded work.
- Trap: background work after response may be terminated; instance reuse means globals can persist but cannot be trusted as durable state.
- Mock: decide whether a workload fits serverless and repair a stateful handler.

### Terraform and Infrastructure as Code

- Core: providers, resources, variables, outputs, plan/apply/destroy, state, drift, remote backends, locking, modules, and secrets.
- Practical: review plans, protect/lock state, pin versions, and separate environments.
- Trap: state can contain secrets; manual cloud changes cause drift; losing state does not safely mean resources disappeared.
- Mock: interpret a plan and choose the safe response to drift/state conflicts.

### Cost Alerting and Budgets

- Core: budgets/alerts, billing export, labels, quotas, in-code caps, max instances, token/request limits, anomaly detection, and cleanup.
- Practical: combine notifications with hard operational limits and ownership metadata.
- Trap: a budget alert usually does not stop spending; free-tier assumptions and orphaned resources are dangerous.
- Mock: calculate a cost envelope and design defense in depth.

### Pub/Sub and Event-Driven Architecture

- Core: producers, topics, subscriptions, consumers, acknowledgements, at-least-once delivery, retries, dead-letter queues, ordering, idempotency, and backpressure.
- Practical: assign stable event IDs and make consumers safe under duplicate delivery.
- Trap: exactly-once business effects do not follow automatically from broker guarantees.
- Mock: trace duplicate/out-of-order events and repair the consumer.

### Week 7 Labs

**Red-Team Your Own API** is an attack-build-defend-regress workflow. Questions should test exploit chains and evidence that the fix is enforced outside the prompt.

**Full CI/CD to Cloud Run** joins tests, image builds, registry, deployment identity, secrets, revisions, health, and rollback. Questions should ask which artifact/source revision is running and what evidence proves promotion was safe.

## Week 8: MLOps and Fine-Tuning

### Cloud Storage for ML

- Core: buckets/objects, regions, IAM, object paths, generations/versioning, lifecycle, checksums, signed access, raw/processed/model zones, and reproducibility.
- Practical: upload immutable/versioned datasets, models, and evaluation evidence with narrow access.
- Trap: overwriting `latest` destroys lineage; bucket names/locations and object permissions have operational consequences.
- Mock: design an artifact layout and access policy for reproducible training.

### BigQuery ML

- Core: dataset/table/model, `CREATE MODEL`, feature SQL, train/eval split, `ML.EVALUATE`, `ML.PREDICT`, leakage, bytes processed, and baselines.
- Practical: inspect data, train on one split, evaluate held-out rows, and compare with a simple baseline.
- Trap: evaluating on training rows inflates results; `LIMIT` does not always cap bytes scanned as expected.
- Mock: repair a leaky SQL ML workflow and interpret evaluation metrics.

### MLflow

- Core: experiments, runs, parameters, metrics, artifacts, tags, model signatures, registry, stages/aliases, backend store, and artifact store.
- Practical: log code/data/model lineage and compare genuinely comparable runs.
- Trap: a saved model without environment, signature, dataset version, and metrics is not reproducible.
- Mock: identify missing evidence in a run or choose what belongs as param/metric/artifact/tag.

### Fine-Tuning Strategy

- Core: prompting/RAG/tooling versus tuning, task definition, baseline eval, data quality, train/validation/test separation, contamination, cost, and rollback.
- Practical: choose the smallest intervention that fixes a measured failure.
- Trap: fine-tuning is poor for frequently changing factual knowledge and cannot repair a broken evaluation target.
- Mock: decide whether to tune and specify the baseline and acceptance test first.

### Hugging Face Ecosystem

- Core: Hub repositories, model/dataset cards, revisions, licenses, `transformers`, `datasets`, tokenizers, pipelines, caching, gated models, and publishing.
- Practical: pin revisions, inspect license/card/architecture, and version examples as well as code.
- Trap: a popular model may be incompatible, gated, unsafe for the intended license, or too large for hardware.
- Mock: select a model/dataset from card evidence and produce a reproducible load command.

### Fine-Tuning Techniques

- Core: SFT, LoRA, QLoRA, adapter rank/targets, response-only loss, learning rate, epochs, batch/accumulation, checkpoints, and evaluation.
- Practical: begin with a small clean dataset and adapter-based experiment when appropriate.
- Trap: training on prompt tokens can teach copying; more epochs can overfit; QLoRA quantizes the frozen base while training adapters.
- Mock: compare methods under memory/data constraints and diagnose a training curve.

### Quantization

- Core: FP32/FP16/BF16/INT8/4-bit, weight versus activation/KV quantization, post-training versus quantization-aware methods, memory estimates, calibration, and quality/latency trade-offs.
- Practical: estimate raw weight memory as parameter count times bits per parameter, then allow overhead.
- Trap: 4-bit weights do not mean total inference memory is exactly half of 8-bit; hardware/kernel support determines real speed.
- Mock: calculate lower-bound memory and choose a compatible quantization.

### Gemma 4 Fine-Tuning

- Core: model/license access, dataset creation, base baseline, guided Unsloth workflow, smallest safe configuration, adapters, evaluation, export, and evidence.
- Practical: prove improvement on held-out examples before publishing.
- Trap: notebook completion is not model quality; evaluating only hand-picked examples or training rows is invalid.
- Mock: audit an experiment for leakage, missing baseline, and unsupported improvement claims.

### Model Publishing and Cards

- Core: release type, versioned files, model/adapters/tokenizer/config, license, intended use, limitations, data, evaluation, reproducibility, safety, and provenance.
- Practical: publish an artifact whose consumers can load, evaluate, and understand risks.
- Trap: omitting the base model/revision makes an adapter unusable; a model card is evidence documentation, not marketing copy.
- Mock: identify missing release files/card sections and assess whether a claim is substantiated.

### Full GCP Milestone

- Core: project, billing, region, IAM principal-role-resource, service accounts, Secret Manager, GCS, BigQuery/BigQuery ML, Vertex AI, Model Registry, Artifact Registry, Cloud Build, Cloud Run, logging/monitoring, and budgets.
- Practical: choose the smallest architecture, keep connected services near each other, use workload identities, deploy versioned artifacts, and define deletion/cost controls.
- Trap: `Owner` is not a runtime role; budget alerts do not cap spend; source code is not a deployed service; GCS is not a SQL warehouse.
- Mock: draw a 6-10 component architecture and defend identity, data, deployment, observability, and cost decisions.

## Projects and Reference Material

### Project 1 and Project 2

- The checked-in Project 1 and Project 2 pages are pointers to live exam contracts, not stable lesson specifications. They should be used as integration evidence only after capturing the exact public contract version being studied.
- Project-derived mock questions may test transferable architecture, evaluation, deployment, and evidence practices, but must not copy a personalized task or imply that one student's generated requirements apply to everyone.
- Mock trap: reverse-engineering one seed or one submission into a universal requirement creates false coverage and can reward memorization rather than course understanding.

### Tools Glossary

- Core: maps acquisition, anti-bot, storage/query, documents/media, OSINT, security, cloud, CI/CD, and course-wide tools to the job each performs.
- Practical: use it as a tool-selection index, then verify behavior and constraints in the corresponding lesson.
- Trap: similar tools are not interchangeable; the correct choice depends on data shape, scale, trust, latency, platform, and maintenance constraints.
- Mock: give a constrained task and ask for the smallest fitting tool plus one reason the nearest alternative is weaker.

### Command Cheatsheet

- Core: runnable patterns for UV scripts, site inspection, archives, HTTP acquisition, parsing, media processing, DuckDB/Parquet, and related course workflows.
- Practical: recognize command structure and modify arguments without breaking quoting, encoding, or output semantics.
- Trap: a cheatsheet command is a starting point, not proof of completeness, authorization, error handling, or reproducibility.
- Mock: present a near-correct command and ask students to repair one semantic defect and one reliability defect.

## Cross-Topic Competencies

The best questions connect concepts that the syllabus teaches separately:

1. **Reproducibility chain:** Git commit -> lockfile -> test run -> container digest -> deployed revision -> logs/metrics.
2. **Data provenance chain:** source URL/time -> raw immutable artifact -> parsed/normalized data -> chunk/vector/model version -> cited answer.
3. **Trust chain:** untrusted web/user/retrieved content -> parser/schema -> policy/authorization -> sandboxed action -> verified result.
4. **Reliability chain:** timeout -> bounded concurrency -> selective retry with jitter -> idempotency -> cache/checkpoint -> alert.
5. **Evaluation chain:** frozen task/data set -> baseline -> controlled variant -> metric profile -> error analysis -> acceptance threshold.
6. **Cost chain:** workload volume -> token/compute/storage estimate -> cache/batch/quantization choice -> hard caps -> budgets and cleanup.
7. **Identity chain:** human/CI/runtime principal -> narrow role -> specific resource -> audited action.
8. **Agent chain:** objective -> state -> plan -> tool schema -> validated execution -> observation -> verification -> stop/escalate.

At least 35-45% of an advanced mock should be cross-topic. Otherwise students can memorize isolated notes without learning the system behavior the course emphasizes.

## Historical End-Term Investigation

### What is reliable

- The [official IITM course page](https://study.iitm.ac.in/ds/course_pages/BSSE2002.html) confirms this is a practical course with weekly assignments, a remote online exam, two projects, and an in-person end-term.
- The [May 2026 official repository](https://github.com/sanand0/tools-in-data-science-public) says the present course is harder and broader than the pre-2025 form, uses AI-heavy learning/evaluation, and treats lesson content as a topic reference rather than a complete preparation source.
- A student-maintained [IITM BS Community TDS page](https://sites.google.com/student.onlinedegree.iitm.ac.in/iitmbs-community/home_1/diploma-level/tds) reports that end-term questions range from deep to surface-level and recommends previous papers and mocks. This is experience evidence, not an official blueprint.

### What is not reliable enough to drive the mock

- The public [TDS FU end-term practice quiz](https://tdsfu.pages.dev/end-term) can reveal common practice UX and item forms, but it is third-party and tied to older content.
- A publicly indexed January 2025 mock is AI-generated and explicitly not the exact paper. It must not be treated as a previous-year paper.
- Very old TDS papers emphasize earlier modules such as spreadsheets, data cleaning, analysis, and visualization. May 2026 instead devotes large modules to RAG, agents, security/cloud, OSINT, and fine-tuning. Reusing old topic weights would produce a misleading mock.

### Defensible historical conclusion

Use historical material only for these form-level signals:

- expect a mixture of shallow recall and deep implementation details;
- practice exact commands/library behaviors where the official lessons demonstrate them;
- include MCQ, multiple-correct, and numerical/output reasoning rather than essay-only preparation;
- revisit graded-assignment failure modes because they instantiate the lesson concepts;
- do not assume repeated old questions or old week weightings.

## Recommended Mock Blueprint

This is a content blueprint, not the final format.

### Weight by current curriculum

| Area | Suggested share | Reason |
|---|---:|---|
| Week 0 + Week 1 | 13% | Foundation commands, environments, Git, HTTP, SQL, and formats support every later task |
| Week 2 | 12% | API/deployment contracts, auth, config, containers, observability, and local LLM operations |
| Week 3 | 13% | Prompt/context/structured output, embeddings/search, multimodal, and LLM operations |
| Week 4 | 13% | Retrieval design, hybrid/reranking/augmentation, grounding, and evaluation |
| Week 5 | 12% | Agent loops, tools, memory, coordination, MCP, concurrency, and sandboxing |
| Week 6 | 16% | Largest topic group; acquisition, reliability, transformation, multimodal, and OSINT |
| Week 7 | 12% | CI/CD, cloud operations, security, infrastructure, cost, and events |
| Week 8 | 9% | Storage/MLflow/BigQuery ML, tuning, quantization, publishing, and GCP integration |

Weights are proportional to current scope and integration value, not inferred official marks.

### Cognitive mix

| Level | Suggested share | Typical task |
|---|---:|---|
| Recall/recognition | 15% | identify a command, component, status class, or term |
| Application | 30% | choose a tool/configuration or complete a request/schema |
| Analysis/debugging | 35% | infer a fault from code, output, logs, metrics, or architecture |
| Synthesis/evaluation | 20% | design, compare, defend, or specify acceptance evidence |

### Item-style mix for 200 objective questions

The generated pool uses 175 single-answer MCQs and 25 multiple-select questions. The official end-term format is smaller: 30 MCQ/MSQ questions for 39 marks.

| Style | Count target |
|---|---:|
| Single-correct MCQ | 90 |
| Multiple-correct/MSQ | 45 |
| Numerical/output answer | 25 |
| Ordering/matching | 20 |
| Case-set questions sharing one scenario | 20 |

### Subjective mix for 100 questions

| Style | Count target |
|---|---:|
| Short diagnosis (2-4 points) | 25 |
| Code/config repair with explanation | 20 |
| Tool/architecture selection | 20 |
| Pipeline/security/evaluation design | 20 |
| Evidence-based critique or comparison | 15 |

### Difficulty bands

- 20% foundation: one concept, one decisive clue.
- 45% applied: two concepts or a realistic operational constraint.
- 25% advanced: three or more connected topics, incomplete/noisy evidence.
- 10% expert: subtle trust, concurrency, evaluation, provenance, or cost edge cases.

### Required quality controls

Every generated question should pass all of these checks:

1. It maps to one or more named May 2026 topics.
2. Its answer follows from provided facts plus official concepts, not hidden assumptions.
3. Distractors represent plausible misconceptions, not random wording.
4. Commands and schemas are syntactically valid for the stated platform/version.
5. Numerical questions state units and rounding rules.
6. Security questions do not reward bypass/evasion when a legitimate path exists.
7. Subjective rubrics award observable evidence and trade-off reasoning.
8. The explanation states why the answer is right and why the strongest distractor is wrong.
9. No old-course topic is presented as May 2026 content unless it appears in the current source.
10. No question reproduces a graded assignment, leaked paper, or third-party item verbatim.

## Coverage Gate Before Publishing The Mock

The final bank is ready only when:

- every topic in this dossier appears in at least one objective or subjective item;
- every week has command/output, debugging, and scenario-based coverage;
- every major lab/capstone inspires at least one integration case without copying its deliverable;
- all answer keys are independently recomputed or code-verified where possible;
- every multi-correct question has an explicit all-and-only correctness check;
- every subjective question has a point-based rubric and an example of minimum sufficient evidence;
- ambiguity review is completed by solving from the learner's view, without relying on author intent;
- the bank clearly labels itself original practice material rather than official or predicted questions.

## Source Index

- [Official May 2026 course site](https://tds.s-anand.net/)
- [Official course source repository](https://github.com/sanand0/tools-in-data-science-public)
- [Official IITM BSSE2002 course description](https://study.iitm.ac.in/ds/course_pages/BSSE2002.html)
- [Official command cheatsheet](https://tds.s-anand.net/2026-02/docs/reference/02-command-cheatsheet/)
- [Official tools glossary](https://tds.s-anand.net/2026-02/docs/reference/01-tools-glossary/)
- [Official all-labs index](https://tds.s-anand.net/2026-02/docs/labs/all-lab-assignments/)
- [Official capstone index](https://tds.s-anand.net/2026-02/docs/labs/capstone-projects/)
- [Student-maintained IITM BS Community TDS guidance](https://sites.google.com/student.onlinedegree.iitm.ac.in/iitmbs-community/home_1/diploma-level/tds)
- [Third-party TDS FU practice quiz](https://tdsfu.pages.dev/end-term)
