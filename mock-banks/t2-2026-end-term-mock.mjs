import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const officialCourseUrl = 'https://tds.s-anand.net/';

export const officialExamGuide = {
  totalMarks: 80,
  section1: { name: 'MCQ / MSQ', questions: 30, marks: 39, guideTopics: [1, 2, 3, 4, 5] },
  section2: { name: 'Short Answer', questions: 9, marks: 41, guideTopics: [6], grading: 'Manually graded' },
  principle: 'Understanding why matters more than recalling what; new scenarios test reasoning.'
};

export const guideTopicNames = {
  1: 'Observability & Monitoring',
  2: 'Data Pipeline Integrity',
  3: 'CI/CD & Release Security',
  4: 'Reliable AI/LLM Systems',
  5: 'Web/API/Infra Fundamentals',
  6: 'Applied AI-Era Judgment'
};

function classifyGuideTopic(topic) {
  if (/observability|logging|monitoring|budget|cost/i.test(topic)) return 1;
  if (/sqlite|data format|cloud storage|bigquery|mlflow|change detection|parsing|structured source|scheduled collection|rate limit/i.test(topic)) return 2;
  if (/git|dependency|bash scripting|configuration and secrets|container|ci\/cd|security|iac|model publishing/i.test(topic)) return 3;
  if (/prompt|output control|embedding|llm|rag|retrieval|agent|memory|mcp|fine-tun|quantization|hugging face|vector database|hybrid search|query augmentation|semantic caching/i.test(topic)) return 4;
  return 5;
}

export const courseMap = [
  { week: 'W0', title: 'Bridge Course', topics: ['Setup Day', 'Linux & Shell Essentials', 'VS Code + Python Projects with uv', 'HTTP, APIs & Chrome DevTools', 'Git & GitHub Workflow'] },
  { week: 'W1', title: 'Dev Environment & Tooling', topics: ['VS Code Basics', 'VS Code Advanced', 'uv Basics', 'uv Advanced', 'Bash Scripting', 'Git & GitHub', 'SQLite', 'HTTP Clients', 'Requestly', 'Data Formats', 'GitHub Pages', 'LaTeX', 'Publish a Python library to PyPI', 'Web Traffic Debugging with Burp Suite'] },
  { week: 'W2', title: 'Deployment & API Engineering', topics: ['FastAPI Fundamentals', 'CORS & Middleware', 'Google OAuth 2.0', 'Config Management', 'Docker & Compose', 'Deployment Platforms', 'Logging & Testing', 'Observability', 'Cloudflare Tunnels', 'Local LLMs Basics', 'LM Studio & Ollama', 'llama.cpp & vLLM', 'MLX Labs', 'Private LLMs with vLLM & API Gateway', 'WebSocket Chat with Redis & PostgreSQL'] },
  { week: 'W3', title: 'LLM Engineering', topics: ['Prompt Engineering Foundations', 'Reliable Reasoning & Output Control', 'Prompted Applications & Production Practice', 'Context Engineering', 'Prompt Caching', 'Structured Output', 'LLM Architecture Survey', 'Multimodal Inputs', 'Vector Embeddings', 'Similarity Search', 'LLM CLI Tools', 'AI Coding Assistants', 'LangSmith & LiteLLM', 'YouTube to Subtitles to Topics', 'Cost-tracking Dashboard'] },
  { week: 'W4', title: 'RAG & Hybrid RAG', topics: ['Vector Databases', 'Chunking Strategies', 'Late Chunking', 'Contextual Retrieval', 'Hybrid Search', 'Reranking', 'Query Augmentation', 'Semantic Caching', 'Multimodal Embeddings', 'GraphRAG', 'LLM Grounding & Citations', 'RAGAS Evaluation', 'RAGAS Evaluation Dashboard', 'BS Degree Chatbot'] },
  { week: 'W5', title: 'Agentic AI', topics: ['Agent Fundamentals', 'Tool / Function Calling', 'Agent Evaluation & Benchmarking', 'Agent Memory Systems', 'Loop Engineering', 'Multi-Agent Systems', 'Specialized Agents', 'Model Context Protocol (MCP)', 'Async & Parallelism', 'Sandboxing Agent Code', 'Autonomous Research Agent'] },
  { week: 'W6', title: 'Web Data Acquisition & OSINT', topics: ['Legal & Ethical Scraping', 'Hidden JSON APIs', 'Sitemaps, RSS & Structured Data', 'Wayback Machine & Common Crawl', 'Playwright & Selenium', 'Playwright Advanced', 'Pagination & Infinite Scroll', 'Authenticated Scraping', 'Rate Limits, Retries & Caching', 'Change Detection & Dedup', 'Anti-bot Patterns', 'Cloudflare Bot Protection', 'HTML to Markdown for LLMs', 'DuckDB + Parquet', 'Document Parsing', 'Vision Models for Scraping', 'Image Processing Pipeline', 'Speech AI', 'Video Understanding', 'Google Dorking', 'OSINT Infrastructure & Records', 'Scheduled Scraping', 'Scheduled Scraper with GitHub Actions', 'Open-Source Organisation Dossier', 'Job Posting Scraper', 'AI Signature Detection', 'Live Multilingual Translator'] },
  { week: 'W7', title: 'CI/CD, Security & Cloud', topics: ['GitHub Actions Advanced', 'Advanced Docker', 'LLM Security Offensive', 'LLM Safety Defensive', 'OWASP LLM Top 10', 'Cloudflare Defender Side', 'Dorking for Recon & Exposure', 'Person & Social OSINT', 'VMs & SSH', 'Serverless Functions', 'Terraform & IaC', 'Cost Alerting & Budgets', 'Pub/Sub & Event-Driven', 'Red-team Your Own API', 'Full CI/CD to Cloud Run'] },
  { week: 'W8', title: 'MLOps & Fine-Tuning', topics: ['Cloud Storage for ML', 'BigQuery ML', 'MLflow', 'Fine-Tuning Strategy', 'HuggingFace Ecosystem', 'Fine-Tuning Techniques', 'Quantization', 'Gemma 4 Fine-Tuning', 'Model Publishing & Cards', 'Full GCP Walkthrough'] }
];

export const officialGuideCoverage = {
  1: ['averages vs percentiles', 'rates vs raw counts', 'liveness vs readiness', 'AI cost tracking'],
  2: ['stable identity and change detection', 'partial or failed runs', 'uncertain writes and safe retries', 'reproducible data and model runs', 'provenance when correcting data'],
  3: ['untrusted code and deployment credentials', 'supply-chain hardening', 'risky infrastructure review', 'leaked-secret response', 'progressive rollouts'],
  4: ['verify AI output', 'structured output', 'current-source grounding', 'authorization in code rather than prompts'],
  5: ['statelessness and durable storage', 'proper API errors', 'CORS, authentication, and authorization', 'identity versus delegated access', 'safe Git history changes', 'container networking'],
  6: ['robust prompts', 'decision-useful evidence', 'high-leverage questions', 'rubrics for flawed AI analysis', 'probability and impact', 'precise minimal fixes', 'valid and invalid claims']
};

const officialGuideCoveragePatterns = {
  1: [/average.{0,40}percentile/i, /rate.{0,40}raw count/i, /liveness.{0,40}readiness/i, /AI (?:token|request).{0,40}cost/i],
  2: [/stable identity/i, /partial|failed run/i, /uncertain (?:write|result)/i, /reproducible.{0,50}(?:data|model)|data and model runs/i, /provenance/i],
  3: [/untrusted.{0,50}(?:deployment|credential)|deployment credential/i, /supply chain/i, /(?:risky|blast radius|reviewed code).{0,50}(?:infrastructure|firewall|plan|state)/i, /(?:leaked|revoke).{0,50}(?:secret|token)|rotate.{0,30}(?:secret|token)/i, /progressive|canary/i],
  4: [/verify(?:ing)? AI|AI-generated output|validate.{0,40}invariant/i, /structured output|schema/i, /current.{0,40}source/i, /authorization.{0,50}code|server-side authorization/i],
  5: [/stateless|durable state/i, /API errors|status and error contract|status code/i, /CORS.{0,50}authentication.{0,50}authorization/i, /delegated (?:access|authorization)|authentication.{0,50}delegated/i, /safe history|rewrite.{0,50}history|force-push/i, /container network|service network|localhost/i],
  6: [/robust prompt|prompt/i, /decision-useful evidence/i, /high-leverage/i, /rubric/i, /probability.{0,30}impact/i, /precise|minimal|smallest safer fix/i, /valid and invalid/i]
};

// Five cards per major module, with W6 expanded because its official index is substantially larger.
const cards = [
  ['W0', 'Paths and WSL', 'Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.', 'A script works from one folder but fails when launched from another.', ['Resolve the path from a known base such as the project or script directory, then test it from both launch locations', 'Hard-code the current desktop path', 'Use a relative path without checking the process working directory', 'Treat every path as a URL']],
  ['W0', 'Shell pipelines and redirection', 'Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.', 'A diagnostic command must retain old output while recording new errors separately.', ['Append stdout and redirect stderr explicitly', 'Use one giant command with no quoting', 'Redirect everything to /dev/null', 'Run each command manually and copy output by hand']],
  ['W0', 'uv project workflow', 'Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.', 'A teammate needs the same Python dependencies on a clean machine.', ['Commit project metadata and the lockfile', 'Install packages globally', 'Copy the site-packages directory', 'Rely on the active shell history']],
  ['W0', 'HTTP methods and status codes', 'Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.', 'A client receives 401, 403, 404, and 500 responses from different requests.', ['Diagnose authentication, authorization, routing, and server failure separately', 'Retry every response forever', 'Replace every response with 200', 'Inspect only the response body']],
  ['W0', 'Git basic flow', 'Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.', 'A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret.', ['Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely', 'Force-push the default branch without warning', 'Leave the secret active because the commit is old', 'Edit the remote directly']],

  ['W1', 'VS Code workspaces', 'Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.', 'The editor shows the wrong Python interpreter and unresolved imports.', ['Select the project interpreter and verify workspace settings', 'Install a second editor', 'Rename every import', 'Disable diagnostics globally']],
  ['W1', 'Dependency locking', 'Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.', 'A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions.', ['Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading', 'Ignore the lockfile', 'Copy random package versions from a colleague', 'Grant the package broad build permissions without review']],
  ['W1', 'Bash scripting', 'Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.', 'A cleanup script receives a filename containing spaces and an empty variable.', ['Quote inputs and fail safely before deleting', 'Expand every variable unquoted', 'Use rm -rf on the parent directory', 'Assume the shell will infer intent']],
  ['W1', 'SQLite', 'Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.', 'An import must either commit all rows or leave the database unchanged.', ['Wrap the import in a transaction and use parameters', 'Build SQL by string concatenation', 'Commit after every character', 'Store the database as a screenshot']],
  ['W1', 'HTTP clients and data formats', 'Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.', 'An API sometimes returns an HTML error page where JSON was expected.', ['Check status and content type before parsing', 'Call JSON.parse on every body blindly', 'Silently accept HTML as data', 'Ignore encoding and delimiters']],

  ['W2', 'FastAPI fundamentals', 'Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.', 'A service works on one instance but loses a user job after a restart and returns inconsistent error shapes.', ['Persist durable state outside the process and use a documented status and error contract', 'Keep state in a module global and return 500 for every failure', 'Parse raw strings in every route', 'Return a different response shape per request']],
  ['W2', 'CORS and middleware', 'Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.', 'A browser call fails while curl works, and a logged-in user can see a resource belonging to another user.', ['Check origin and preflight separately from authentication, then enforce resource authorization on the server', 'Add a wildcard credentialed origin and trust the prompt', 'Disable all middleware', 'Change the database schema without inspecting the request identity']],
  ['W2', 'OAuth 2.0', 'Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.', 'A web app needs access to a user-owned provider resource without collecting the provider password.', ['Redirect for authorization and exchange the code securely for scoped delegated access', 'Ask for the provider password', 'Put the client secret in browser JavaScript', 'Reuse an access token forever']],
  ['W2', 'Configuration and secrets', 'Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.', 'A production token appears in a public CI log while the same service runs locally, in CI, and in production.', ['Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement', 'Delete the log and keep using the token', 'Print all secrets during health checks', 'Hard-code a new credential in the repository']],
  ['W2', 'Containers and deployment', 'Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.', 'A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost.', ['Bind to the configured interface and port, use the service network name, and keep secrets outside the image', 'Bind only to localhost inside the container', 'Bake credentials into the image', 'Assume host localhost names every container']],
  ['W2', 'Logging, testing, and observability', 'Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.', 'Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency.', ['Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix', 'Use the average and raw error count alone', 'Treat a green liveness probe as proof of readiness', 'Restart every service until the dashboard looks normal']],

  ['W3', 'Prompt foundations', 'State the task, constraints, context, output requirements, and examples with unambiguous instructions.', 'An LLM returns inconsistent formats for the same classification task.', ['Specify the contract and include representative examples', 'Make the prompt shorter by removing constraints', 'Ask for a secret chain of thought', 'Randomize the labels']],
  ['W3', 'Reliable output control', 'Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.', 'A downstream service expects an enum and two required fields, but the model sometimes invents a third value.', ['Validate structured output and the relevant invariant, then reject or repair only within a bounded policy', 'Regex any text without checking failure', 'Accept missing or unknown fields forever', 'Ask the model to be more confident']],
  ['W3', 'Context and prompt caching', 'Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.', 'A large stable system instruction is repeated across thousands of requests.', ['Cache the stable prefix and isolate user-specific content', 'Cache all user data indefinitely', 'Put secrets in the cache key', 'Disable expiration for every cache']],
  ['W3', 'Embeddings and similarity', 'Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.', 'A search system must retrieve semantically related documents despite different wording.', ['Embed queries and documents consistently, then inspect similarity quality', 'Compare raw strings only', 'Use a random vector per document', 'Sort by document length alone']],
  ['W3', 'LLM architecture and tooling', 'Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.', 'A team needs provider portability and per-request cost traces.', ['Use an abstraction or gateway with explicit tracing and fallback policy', 'Hard-code one provider in every call site', 'Log only the final answer', 'Optimize latency without measuring it']],

  ['W4', 'Vector databases and chunking', 'Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.', 'A policy document contains headings, tables, and long sections.', ['Chunk by semantic structure and retain source metadata', 'Split every 10 characters', 'Remove all metadata', 'Embed the entire corpus as one vector']],
  ['W4', 'Late and contextual retrieval', 'Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.', 'A short chunk says “this limit” but its meaning is defined in the parent section.', ['Attach useful context before embedding or retrieval and keep provenance', 'Discard the parent heading', 'Replace the chunk with a guess', 'Return the nearest chunk without its source']],
  ['W4', 'Hybrid search and reranking', 'Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.', 'A query contains a product code and a natural-language description.', ['Retrieve with complementary signals and rerank the shortlist', 'Use only a stopword count', 'Use only the first vector hit', 'Rerank the entire internet without candidates']],
  ['W4', 'Query augmentation and semantic caching', 'Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.', 'Users ask the same question with minor wording changes while source data updates hourly.', ['Normalize intent, cache within a freshness boundary, and preserve variants', 'Cache every answer forever', 'Rewrite away critical identifiers', 'Ignore source freshness']],
  ['W4', 'Grounding and RAG evaluation', 'Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.', 'A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday.', ['Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently', 'Score only grammar', 'Treat a fluent answer as grounded', 'Remove citations to improve style']],

  ['W5', 'Agent fundamentals and tool calling', 'Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.', 'An agent can read documents but must not execute arbitrary shell commands.', ['Expose least-privilege tools with validated arguments', 'Give the model unrestricted shell access', 'Let tool names be free-form code', 'Skip tool-result validation']],
  ['W5', 'Agent evaluation', 'Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.', 'A benchmark score improves while unsafe tool calls increase.', ['Track safety and operational metrics alongside success', 'Use success rate alone', 'Evaluate on one happy path', 'Delete failed traces']],
  ['W5', 'Memory and loop engineering', 'Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.', 'An agent repeats a failed search and grows its prompt without limit.', ['Use scoped memory and explicit iteration, token, and time budgets', 'Let the loop continue until the model stops', 'Store every observation forever', 'Retry instantly without changing state']],
  ['W5', 'Multi-agent systems', 'Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.', 'Several workers produce conflicting research claims.', ['Use typed handoffs, provenance, and an adjudication step', 'Merge prose by concatenation', 'Give every worker every permission', 'Hide disagreements from the user']],
  ['W5', 'MCP, async, and sandboxing', 'Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.', 'Parallel tasks can call a remote tool but must stop when the user cancels.', ['Propagate cancellation and bound concurrency inside a sandbox', 'Spawn unlimited tasks', 'Ignore cancellation after dispatch', 'Run untrusted code on the host']],

  ['W6', 'Legal and ethical scraping', 'Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.', 'A public page contains personal information that is not needed for the task.', ['Minimize collection and avoid using data outside the authorized purpose', 'Scrape and publish everything', 'Bypass access controls', 'Use personal data because it is public']],
  ['W6', 'Hidden JSON APIs and structured sources', 'Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.', 'The page renders a table from an XHR JSON response.', ['Identify the endpoint, parameters, schema, and access conditions', 'Parse only the visible pixels', 'Guess an undocumented URL repeatedly', 'Ignore pagination metadata']],
  ['W6', 'Browser automation and pagination', 'Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.', 'A catalog loads the next page only after a button click.', ['Observe the UI state, paginate until exhaustion, and deduplicate by stable ID', 'Loop a fixed number of clicks blindly', 'Use pixel coordinates as the only selector', 'Stop after the first viewport']],
  ['W6', 'Authenticated scraping', 'Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.', 'A permitted internal dashboard requires a session cookie.', ['Use the approved account and least-privilege scope without logging secrets', 'Paste cookies into a public issue', 'Reuse a token forever', 'Download every account page']],
  ['W6', 'Rate limits, retries, and caching', 'Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.', 'A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry.', ['Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects', 'Retry the write blindly until a 200 appears', 'Delete the partial output and restart without a run ID', 'Treat every timeout as proof that no write happened']],
  ['W6', 'Change detection and anti-bot resilience', 'Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.', 'A page layout changes but the underlying product record does not, while one product later changes price.', ['Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance', 'Treat every DOM change as a new record', 'Hash raw timestamps only', 'Bypass every challenge']],
  ['W6', 'HTML, tabular, and document parsing', 'Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.', 'An HTML table contains merged cells and a document has scanned pages.', ['Use format-aware parsing and flag uncertain extraction', 'Split on commas in raw HTML', 'Trust OCR without review', 'Discard source locations']],
  ['W6', 'Vision, speech, and video acquisition', 'Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.', 'A video contains spoken claims and on-screen figures.', ['Align transcripts, frames, timestamps, and confidence before summarizing', 'Use audio only', 'Remove timestamps', 'Present OCR guesses as facts']],
  ['W6', 'OSINT and scheduled collection', 'Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.', 'A dossier must be refreshed weekly without duplicating old findings.', ['Schedule an authorized job with provenance, deduplication, and change history', 'Search private accounts', 'Copy search snippets without URLs', 'Overwrite the prior dossier']],

  ['W7', 'CI/CD and advanced Docker', 'Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.', 'A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression.', ['Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy', 'Expose deployment credentials to every pull-request step', 'Rebuild a different image in production and roll out to everyone at once', 'Skip scans because the branch is internal']],
  ['W7', 'LLM security and OWASP risks', 'Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.', 'Retrieved text tells an agent to ignore its system policy and exfiltrate a secret.', ['Treat retrieved text as untrusted data and enforce server-side authorization and tool limits', 'Tell the model in a stronger prompt never to exfiltrate', 'Print the secret for debugging', 'Give the retriever admin permissions']],
  ['W7', 'VMs, SSH, serverless, and IaC', 'Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.', 'A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments.', ['Review the diff and blast radius, test the plan, and apply with scoped access and protected state', 'Make manual console edits only', 'Share one root key', 'Apply the change directly because the plan is inconvenient']],
  ['W7', 'Budgets and event-driven cloud', 'Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.', 'A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives.', ['Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded', 'Assume exactly-once delivery without evidence', 'Disable all retries', 'Ignore token usage until billing closes']],

  ['W8', 'Cloud Storage and BigQuery ML', 'Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.', 'A model training job must be traceable back to immutable input data, including a corrected source record.', ['Write a versioned correction with reason, author, parent data version, and reproducible query lineage', 'Overwrite raw data in place and keep no correction note', 'Use anonymous buckets', 'Train from an undocumented dashboard click']],
  ['W8', 'MLflow', 'Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.', 'A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown.', ['Require a complete run record and evidence before promotion', 'Promote from the best-looking chart', 'Delete failed runs', 'Track only the model filename']],
  ['W8', 'Fine-tuning strategy', 'Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.', 'A model knows facts but consistently emits the wrong output format.', ['Fix the contract or use structured output before fine-tuning for facts', 'Fine-tune on random examples immediately', 'Increase model size without diagnosis', 'Remove evaluation data']],
  ['W8', 'Hugging Face and fine-tuning techniques', 'Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.', 'A small domain dataset must adapt a base model while limiting memory use.', ['Use an adapter-based method with held-out evaluation and documented provenance', 'Train on the test set', 'Skip tokenization checks', 'Publish without a card']],
  ['W8', 'Quantization and Gemma fine-tuning', 'Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.', 'A model fits only after quantization but its factual accuracy changes.', ['Benchmark quality, latency, and memory before admitting the artifact', 'Assume lower precision is free', 'Quantize the labels only', 'Compare memory without evaluating outputs']],
  ['W8', 'Model publishing and cards', 'Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.', 'Users need to know whether a model is suitable for production.', ['Provide a model card and immutable version with limitations', 'Publish only a marketing name', 'Hide evaluation failures', 'Reuse a mutable latest tag']]
].map(([week, topic, principle, scenario, choices]) => ({
  week,
  topic,
  principle,
  scenario,
  bestAction: choices[0],
  wrongActions: choices.slice(1),
  guideTopic: classifyGuideTopic(topic),
  guideTopicName: guideTopicNames[classifyGuideTopic(topic)]
}));

export const coreCards = cards;

function rotate(values, offset) {
  const n = values.length;
  return values.map((_, index) => values[(index + offset) % n]);
}

function lowercaseFirst(value) {
  return value.charAt(0).toLowerCase() + value.slice(1);
}

function evidenceStatement(card) {
  return `A repeatable before-and-after test shows that the original failure is fixed after applying this response: ${card.bestAction}. The test includes normal and edge cases.`;
}

const practicalMcqOverrides = new Map([
  [0, {
    question: 'A Python file is `/home/riya/app/main.py`, its data file is `/home/riya/app/data/users.csv`, and the program may be launched from any working directory. Which expression is the safest base for the data path?',
    correct: '`Path(__file__).resolve().parent / "data" / "users.csv"`',
    wrong: ['`Path("data/users.csv")` without controlling the working directory', '`Path("/tmp/data/users.csv")`', '`Path.home() / "users.csv"`'],
    explanation: '`__file__` identifies the script file. Resolving its parent makes the data path independent of the directory from which Python was launched.',
    takeaway: 'Relative paths are resolved from the process working directory unless code deliberately chooses another base.'
  }],
  [1, {
    question: 'Which Bash command appends standard output to `run.log` while overwriting standard error in `errors.log`?',
    correct: '`python job.py >> run.log 2> errors.log`',
    wrong: ['`python job.py > run.log 2>&1`', '`python job.py 2>> run.log > errors.log`', '`python job.py | run.log | errors.log`'],
    explanation: '`>>` appends file descriptor 1 (stdout). `2>` redirects file descriptor 2 (stderr) and overwrites its target. The two streams therefore remain in separate files with the requested update behavior.',
    takeaway: '`>` overwrites, `>>` appends, and `2>` targets stderr.'
  }],
  [2, {
    question: 'After cloning a UV project that already contains `pyproject.toml` and `uv.lock`, which command recreates the project environment from the lockfile?',
    correct: '`uv sync`',
    wrong: ['`uv init`', '`uv add --all`', '`pip freeze`'],
    explanation: '`uv sync` creates or updates the project environment so its installed dependencies match the project metadata and lockfile.',
    takeaway: 'Use `uv sync` after cloning or after pulling dependency changes.'
  }],
  [3, {
    question: 'A FastAPI endpoint receives syntactically valid JSON, but a required integer field contains the string `"many"`. Which status is most likely?',
    correct: '`422 Unprocessable Entity` because request validation failed',
    wrong: ['`200 OK` because the JSON syntax is valid', '`404 Not Found` because the field is missing from the URL', '`500 Internal Server Error` because every type error is a server crash'],
    explanation: 'The route can exist and the JSON can parse while the request still violates the declared body schema. FastAPI reports this as a validation error.',
    takeaway: 'Separate JSON syntax, route matching, schema validation, and server execution.'
  }],
  [4, {
    question: 'You edited `app.py`, ran `git add app.py`, and then edited `app.py` again. Which command shows only the version currently staged for the next commit?',
    correct: '`git diff --staged`',
    wrong: ['`git diff`', '`git status --short` only', '`git log -1`'],
    explanation: '`git add` stores a snapshot in the index. `git diff --staged` compares that index with `HEAD`; plain `git diff` shows the later unstaged edit.',
    takeaway: 'One file can contain both staged and unstaged changes at the same time.'
  }],
  [8, {
    question: 'A SQLite import of 1,000 rows must leave zero new rows if row 731 violates a constraint. What is the essential design?',
    correct: 'Run all inserts inside one transaction and roll back on any error',
    wrong: ['Commit after every row so earlier rows remain', 'Build one SQL string by concatenating every value', 'Disable constraints during the import and never recheck them'],
    explanation: 'A transaction gives the import all-or-nothing behavior. Parameterized inserts also protect values from being interpreted as SQL.',
    takeaway: 'Atomic work belongs in one transaction with explicit error handling.'
  }],
  [9, {
    question: 'A client expects JSON but receives a body beginning with `<!doctype html>`. What should it inspect before calling the JSON parser?',
    correct: 'The HTTP status and `Content-Type`, then the raw body if either is unexpected',
    wrong: ['Only whether the URL ends in `.json`', 'Only whether the request took less than one second', 'Nothing; retry `JSON.parse` until it succeeds'],
    explanation: 'An HTML error page or SPA fallback may still arrive over HTTP. Status and media type identify that boundary failure before parsing.',
    takeaway: 'Validate the response contract before decoding the body.'
  }],
  [10, {
    question: 'Which FastAPI feature most directly keeps request validation and generated OpenAPI documentation aligned?',
    correct: 'A typed Pydantic request model used in the route signature',
    wrong: ['A comment describing the expected JSON', 'Manual string splitting inside every route', 'Returning status 200 for invalid bodies'],
    explanation: 'FastAPI derives validation and schema documentation from type declarations and Pydantic models, keeping one executable contract.',
    takeaway: 'Prefer executable schemas over duplicated prose contracts.'
  }],
  [11, {
    question: 'A browser sends a CORS preflight before a credentialed cross-origin `POST`. Which HTTP method is used for the preflight?',
    correct: '`OPTIONS`',
    wrong: ['`TRACE`', '`PATCH`', '`CONNECT`'],
    explanation: 'The browser uses an `OPTIONS` request to ask whether the target origin permits the intended method, headers, and credentials.',
    takeaway: 'CORS preflight is browser policy negotiation, so curl may succeed even when the browser blocks the call.'
  }],
  [12, {
    question: 'What is the main security purpose of the OAuth `state` value in an authorization-code flow?',
    correct: 'Bind the callback to the login attempt and reduce CSRF/login-substitution attacks',
    wrong: ['Encrypt the access token', 'Replace the provider redirect URI', 'Increase the lifetime of a refresh token'],
    explanation: 'The client creates an unpredictable state value before redirecting and verifies the same value on callback. A mismatch means the response is not tied to that login attempt.',
    takeaway: 'State protects the authorization flow; it is not token encryption.'
  }],
  [14, {
    question: 'A container platform provides port `8080`, but the app listens on `127.0.0.1:8000`. Which change is normally required?',
    correct: 'Listen on `0.0.0.0` and the platform-provided port',
    wrong: ['Keep loopback and expose a random Docker port', 'Bake the platform credentials into the image', 'Write the server output to a local HTML file'],
    explanation: 'Loopback accepts connections only from inside the container. The platform router needs the process to listen on all container interfaces and the assigned port.',
    takeaway: '`0.0.0.0` changes the bind interface; the platform still controls external routing.'
  }],
  [15, {
    question: 'Which Prometheus design is safest for measuring API latency?',
    correct: 'Use a histogram with bounded labels such as route and method, and keep user IDs in logs/traces',
    wrong: ['Use a gauge labeled with every request ID', 'Put the full URL, token, and user email in metric labels', 'Create a new metric name for every request'],
    explanation: 'Histograms support latency distributions and quantiles. Bounded labels avoid the high-cardinality explosion caused by per-user or per-request values.',
    takeaway: 'Metrics aggregate; logs and traces carry high-cardinality request detail.'
  }],
  [17, {
    question: 'An LLM response must contain `status` as one of `approved|rejected` and a non-empty `reason`. What is the strongest control?',
    correct: 'Request schema-constrained output, validate it, and use a bounded repair or failure path',
    wrong: ['Search the prose for the word `approved`', 'Accept missing fields and guess their values', 'Ask the model to be more confident without validation'],
    explanation: 'A schema makes allowed values and required fields executable. Validation catches malformed output; a bounded repair prevents infinite retry loops.',
    takeaway: 'Valid JSON is not enough; validate the required types and semantic constraints.'
  }],
  [18, {
    question: 'Which request layout is most likely to benefit from provider prompt caching?',
    correct: 'A large stable instruction/document prefix followed by a small changing user query',
    wrong: ['A different system prompt at the start of every request', 'Random bytes inserted before the reusable document', 'Only a short unique user message with no reusable prefix'],
    explanation: 'Prompt caches match reusable prefixes. Stable material should appear before changing request-specific content so many calls can share it.',
    takeaway: 'Small changes near the beginning can invalidate the reusable prefix.'
  }],
  [19, {
    question: 'Two already normalized embedding vectors are `a = [1, 0]` and `b = [0.8, 0.6]`. What is their cosine similarity?',
    correct: '`0.8`',
    wrong: ['`0.6`', '`1.4`', '`0.0`'],
    explanation: 'For normalized vectors, cosine similarity equals the dot product: `(1 x 0.8) + (0 x 0.6) = 0.8`. No additional magnitude division changes the result because each vector already has length one.',
    takeaway: 'Cosine similarity is the dot product divided by both vector magnitudes.'
  }],
  [21, {
    question: 'A Markdown policy manual has clear section headings, and answers must cite their section. Which initial chunking strategy is strongest?',
    correct: 'Chunk by heading/section and retain heading plus source metadata',
    wrong: ['Split every ten characters and discard headings', 'Store the whole manual as one vector', 'Randomly shuffle paragraphs before embedding'],
    explanation: 'Header-based chunks align retrieval units with the document structure and preserve the context needed for meaningful citations.',
    takeaway: 'Choose chunk boundaries that match answerable units, then measure retrieval quality.'
  }],
  [23, {
    question: 'With reciprocal rank fusion `score = 1/(60 + rank)`, a document ranks 1st in dense search and 4th in BM25. What is its approximate fused score?',
    correct: '`1/61 + 1/64`, approximately `0.0320`',
    wrong: ['`1 + 4 = 5`', '`(0.8 + 12.0) / 2 = 6.4` using unrelated raw scores', '`1/(60 + 1 + 4)`, approximately `0.0154`'],
    explanation: 'RRF adds one reciprocal term for each ranking: about `0.01639 + 0.01563 = 0.03202`. It combines ranks, not incomparable raw scores.',
    takeaway: 'RRF rewards documents that rank well across complementary retrievers.'
  }],
  [25, {
    question: 'A RAG answer is fluent and relevant, but several claims are not supported by retrieved passages. Which evaluation dimension is most directly weak?',
    correct: 'Faithfulness/groundedness',
    wrong: ['Context recall only', 'Grammar quality', 'Embedding dimensionality'],
    explanation: 'Faithfulness asks whether the answer claims follow from the supplied evidence. Relevance alone does not prove support: an answer can discuss the correct subject while inventing details that no retrieved passage contains.',
    takeaway: 'Evaluate retrieval and generation separately; a good-sounding answer can still be ungrounded.'
  }],
  [27, {
    question: 'Agent A solves 88% of tasks but makes unsafe tool calls in 9%; Agent B solves 84% with no unsafe calls. Which conclusion is defensible?',
    correct: 'No single winner can be declared until safety thresholds and task costs are specified',
    wrong: ['Agent A always wins because 88 is larger than 84', 'Agent B always wins regardless of task requirements', 'Delete unsafe traces and compare success rate again'],
    explanation: 'Agent evaluation is multi-dimensional. A safety threshold may disqualify Agent A, while task context determines how to trade success, cost, latency, and risk.',
    takeaway: 'Define acceptance thresholds before comparing agents.'
  }],
  [30, {
    question: 'A scraper launches 500 detail-page requests against a rate-limited service. Which async design is safest?',
    correct: 'Use a bounded semaphore, explicit timeouts, and collected per-task errors',
    wrong: ['Start all requests without a limit', 'Run blocking HTTP calls directly inside the event loop', 'Ignore cancellation and failed tasks'],
    explanation: 'A semaphore caps in-flight work, timeouts bound waiting, and explicit result/error collection prevents silent task failures.',
    takeaway: 'Concurrency improves I/O throughput only when resource and failure limits are explicit.'
  }],
  [32, {
    question: 'A page table is populated by an XHR request visible in DevTools. What is the best first extraction approach when use is authorized?',
    correct: 'Reproduce the minimal JSON request and validate its pagination and schema',
    wrong: ['OCR screenshots of every table row', 'Guess category URLs without observing the request', 'Copy browser-only headers and credentials into public code'],
    explanation: 'The structured endpoint is usually simpler and less fragile than rendered HTML. The request still needs authorization, pagination, and schema checks.',
    takeaway: 'Prefer the cleanest legitimate structured source, not the most visually obvious source.'
  }],
  [35, {
    question: 'A GET request receives `429` with `Retry-After: 12`. What is the best next action?',
    correct: 'Wait at least the indicated period, add bounded retry logic with jitter, and reduce concurrency',
    wrong: ['Retry immediately in a tight loop', 'Change the request to POST and send it repeatedly', 'Treat the 429 response body as successful data'],
    explanation: '`Retry-After` communicates the server delay. Bounded retries and lower concurrency reduce another burst and avoid an endless retry cycle.',
    takeaway: 'Retry only appropriate operations, obey server guidance, and cap attempts and total time.'
  }],
  [40, {
    question: 'Which GitHub Actions policy is safest for deployment from pull requests created by untrusted forks?',
    correct: 'Run tests with read-only permissions and do not expose deployment secrets to the forked code',
    wrong: ['Give every pull request production credentials', 'Deploy before tests so failures are visible sooner', 'Write secrets into build logs for debugging'],
    explanation: 'Forked code is untrusted and can read or exfiltrate anything made available to its job. Deployment should occur only in a trusted, reviewed context.',
    takeaway: 'Workflow permissions and secret availability are part of the application security boundary.'
  }],
  [43, {
    question: 'A Pub/Sub consumer may receive the same `payment-recorded` event twice. What prevents duplicate business effects?',
    correct: 'Store a stable event ID and make the consumer idempotently ignore an already-applied event',
    wrong: ['Assume the broker can never redeliver', 'Acknowledge before processing and discard every error', 'Generate a new event ID on every retry'],
    explanation: 'At-least-once delivery permits duplicates. A stable event identity plus an atomic processed check makes repeated delivery safe.',
    takeaway: 'Design consumers for duplicate and out-of-order delivery.'
  }],
  [48, {
    question: 'Ignoring runtime overhead, approximately how much memory do 7 billion parameters require when stored at 4 bits each?',
    correct: 'About `3.5 GB`',
    wrong: ['About `28 GB`', 'About `14 GB`', 'About `0.875 GB`'],
    explanation: '`7 billion x 4 bits = 28 billion bits`; divide by 8 for bytes to get about 3.5 billion bytes. Real inference needs additional memory for runtime state and KV cache.',
    takeaway: 'Weight size is a lower bound, not total runtime memory.'
  }]
]);

function buildPracticalMcq(card, cardIndex, spec) {
  const rawOptions = [spec.correct, ...spec.wrong];
  const options = rotate(rawOptions, (cardIndex + 3) % rawOptions.length);
  return {
    id: `MCQ-${String(cardIndex * 4 + 4).padStart(3, '0')}`,
    week: card.week,
    topic: card.topic,
    guideTopic: card.guideTopic,
    guideTopicName: card.guideTopicName,
    format: 'MCQ',
    skill: 'Practical',
    difficulty: 'Application',
    question: spec.question,
    options,
    answer: options.indexOf(spec.correct),
    answers: [options.indexOf(spec.correct)],
    answerText: spec.correct,
    explanation: spec.explanation,
    distractorNote: `The other choices conflict with the stated command semantics, calculation, protocol contract, or reliability requirement. ${spec.takeaway}`,
    takeaway: spec.takeaway
  };
}

function buildMcq(card, cardIndex, variant) {
  if (variant === 3 && practicalMcqOverrides.has(cardIndex)) {
    return buildPracticalMcq(card, cardIndex, practicalMcqOverrides.get(cardIndex));
  }
  let question;
  let rawOptions;
  let correct;
  let explanation;
  let distractorNote;
  let skill;
  let format = 'MCQ';
  let correctOptions;

  if (variant === 0) {
    skill = 'Concept';
    question = `Which statement most accurately explains the main principle of ${card.topic}?`;
    correct = card.principle;
    correctOptions = [correct];
    rawOptions = [correct, ...card.wrongActions];
    explanation = `${card.principle} This is the governing idea: it explains what must remain true even when the exact command, library, or platform changes.`;
    distractorNote = `The other choices describe shortcuts that remove validation, isolation, provenance, or control. They may appear faster, but they do not satisfy the central requirement of ${card.topic}.`;
  } else if (variant === 1) {
    skill = 'Application';
    question = `${card.scenario} What should the team do first?`;
    correct = card.bestAction;
    correctOptions = [correct];
    rawOptions = [correct, ...card.wrongActions];
    explanation = `${card.bestAction}. This directly addresses the stated situation while following the principle: ${lowercaseFirst(card.principle)}`;
    distractorNote = 'The other options either hide the symptom, increase risk, or act without checking the real boundary that failed.';
  } else if (variant === 2) {
    skill = 'Debugging';
    correct = card.wrongActions[cardIndex % card.wrongActions.length];
    correctOptions = [correct];
    question = `While debugging ${card.topic}, which proposed response is the least defensible?`;
    rawOptions = [
      correct,
      card.bestAction,
      'Reproduce the failure and record the relevant input, output, and environment before changing the system.',
      'Test the normal path and at least one boundary or failure path before declaring the issue fixed.'
    ];
    explanation = `The response "${correct}" is the weakest choice because it does not solve the root problem and conflicts with this principle: ${card.principle}`;
    distractorNote = 'The remaining choices gather evidence, apply the relevant fix, or verify behavior. Those are all defensible debugging steps.';
  } else {
    skill = 'Evidence';
    format = 'MSQ';
    correctOptions = [
      evidenceStatement(card),
      'An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.'
    ];
    correct = correctOptions[0];
    question = `Select all evidence that would materially support saying that the ${card.topic} solution is ready.`;
    rawOptions = [
      ...correctOptions,
      'The implementation worked once on the author\'s computer, but the input and environment were not recorded.',
      'The README says the feature is complete, although no executable check or measured result is included.'
    ];
    explanation = `Both selected items are observable, repeatable, and tied to the original requirement. Together they cover the intended behavior and a failure path instead of relying on one undocumented success.`;
    distractorNote = 'A prose claim or one unrecorded run is weak evidence because another person cannot reproduce it or inspect important failure paths.';
  }

  const options = rotate(rawOptions, (cardIndex + variant) % rawOptions.length);
  const answers = correctOptions.map(option => options.indexOf(option)).sort((a, b) => a - b);
  return {
    id: `MCQ-${String(cardIndex * 4 + variant + 1).padStart(3, '0')}`,
    week: card.week,
    topic: card.topic,
    guideTopic: card.guideTopic,
    guideTopicName: card.guideTopicName,
    format,
    skill,
    difficulty: ['Foundation', 'Application', 'Analysis', 'Evaluation'][variant],
    question,
    options,
    answer: answers[0],
    answers,
    answerText: answers.map(index => options[index]).join(' | '),
    explanation,
    distractorNote,
    takeaway: `Remember: ${card.principle}`
  };
}

function buildSubjective(card, cardIndex, variant) {
  const weakProposal = card.wrongActions[cardIndex % card.wrongActions.length];
  const implementation = variant === 0;
  const prompt = implementation
    ? `You are responsible for this ${card.topic} problem: ${card.scenario} State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.`
    : `A teammate proposes: "${weakProposal}." For this ${card.topic} situation (${card.scenario}), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.`;

  const steps = implementation
    ? [
        `Frame the decision as whether the system can be accepted for the stated use. Record the input, current output, environment, owner, and constraint behind this observation: ${card.scenario}`,
        `Collect the most decision-useful evidence first: a reproducible trace or measurement that distinguishes the suspected cause from plausible alternatives. Ask which missing fact would change the decision before widening the work.`,
        `Apply the smallest robust response: ${card.bestAction}. Keep the change at the failing boundary and preserve rollback, authorization, and provenance.`,
        `Verify that the result follows this governing principle: ${card.principle} Repeat the check in an independent environment and retain the command, configuration, log, trace, or measured output.`
      ]
    : [
        `Treat the proposal as an unverified claim, not a conclusion: "${weakProposal}." Any observation it contains may be valid, but the recommended action is invalid until cause, scope, and authority are established.`,
        `Rank the main risk using both probability and impact. Name the missing measurement, trace, sample, owner answer, or authorization fact that could reverse the decision.`,
        `Use this precise safer response instead: ${card.bestAction}. Apply it first to the smallest reversible scope and define rollback before expansion.`,
        `Adopt it only when a repeatable acceptance test supports the claim and no unacceptable security, cost, reliability, or data-quality regression appears. The governing principle is: ${card.principle}`
      ];

  const failureChecks = [
    `Repeat the original case and verify that "${card.scenario}" no longer produces the bad outcome.`,
    'Test one boundary or failure case, such as missing input, invalid data, timeout, duplicate execution, denied permission, or unavailable dependency, whichever fits the system.'
  ];

  return {
    id: `SUB-${String(cardIndex * 2 + variant + 1).padStart(3, '0')}`,
    week: card.week,
    topic: card.topic,
    guideTopic: 6,
    guideTopicName: guideTopicNames[6],
    domainGuideTopic: card.guideTopic,
    domainGuideTopicName: card.guideTopicName,
    difficulty: implementation ? 'Applied' : 'Synthesis',
    prompt,
    modelAnswer: {
      summary: implementation
        ? `Decision: do not accept the system for the stated use until the failure is reproduced and controlled. The smallest defensible response is to ${lowercaseFirst(card.bestAction)}.`
        : `Decision: do not accept the proposal as written. It may point to a real symptom, but it does not prove cause or safety. Replace it with this controlled response: ${card.bestAction}.`,
      claimAssessment: implementation
        ? `Valid claim: the reported situation is an observation worth testing. Invalid leap: the observation alone proves the cause or justifies a broad change. Keep the decision conditional on evidence for ${card.topic}.`
        : `Valid part: the proposal may describe a symptom or a useful goal. Invalid part: it treats that symptom as sufficient proof and skips cause, scope, authority, or acceptance evidence.`,
      evidence: `For ${card.topic}, prefer a timestamped, reproducible before-and-after trace or measurement tied to the stated situation (${card.scenario}), the same input, environment, version, and acceptance threshold. This is stronger than confidence, fluent prose, or one successful run.`,
      rejectedAlternative: `Reject "${weakProposal}" as the default action because it weakens validation, provenance, authorization, reversibility, or failure visibility.`,
      uncertainty: `For ${card.topic}, the decision-changing unknown is whether the observed failure is caused by the suspected boundary under representative conditions. Ask for the one trace, measurement, owner clarification, or authorization check that would separate that cause from alternatives. Treat high-impact uncertainty conservatively even when its probability is not yet known.`,
      steps,
      failureChecks,
      tradeoff: `The controlled approach adds setup, evidence collection, and possibly latency, but reduces the probability of a silent high-impact error. Measure that cost and use the smallest reversible control that still preserves the ${card.topic} principle.`,
      simpleExplanation: `In simple terms: separate facts from guesses, ask what missing fact would change the decision, make the smallest safe fix, test both success and failure, and keep evidence another person can verify.`
    },
    rubric: [
      { criterion: 'States a defensible decision and separates observed facts from inference', points: 2 },
      { criterion: 'Chooses decision-useful evidence with provenance instead of decorative evidence', points: 2 },
      { criterion: 'Names a high-leverage question or unknown and weighs probability with impact', points: 2 },
      { criterion: 'Proposes a precise, minimal, ordered, reversible fix with authorization enforced in code', points: 2 },
      { criterion: 'Includes relevant failure checks, trade-off, and observable acceptance evidence', points: 2 }
    ]
  };
}

export function buildMockBank() {
  const mcq = coreCards.flatMap((card, index) => [0, 1, 2, 3].map(variant => buildMcq(card, index, variant)));
  const subjective = coreCards.flatMap((card, index) => [0, 1].map(variant => buildSubjective(card, index, variant)));
  return {
    metadata: {
      title: 'T2 2026 Tools in Data Science End-Term Advanced Mock Bank',
      officialCourseUrl,
      researchBasis: 'T2-2026-May-Course-Deep-Dive.md',
      generatedFromCards: coreCards.length,
      objectiveCount: mcq.length,
      mcqCount: mcq.length,
      singleAnswerMcqCount: mcq.filter(item => item.format === 'MCQ').length,
      msqCount: mcq.filter(item => item.format === 'MSQ').length,
      subjectiveCount: subjective.length,
      objectiveFormatMix: {
        MCQ: mcq.filter(item => item.format === 'MCQ').length,
        MSQ: mcq.filter(item => item.format === 'MSQ').length
      },
      guideTopicMix: Object.fromEntries([1, 2, 3, 4, 5].map(topic => [guideTopicNames[topic], mcq.filter(item => item.guideTopic === topic).length])),
      officialExamGuide,
      officialGuideCoverage,
      disclaimer: 'Original reference-only practice material based on the current syllabus. It is not an official paper, answer key, prediction, or score guarantee.'
    },
    courseMap,
    mcq,
    subjective
  };
}

export function validateMockBank(bank = buildMockBank()) {
  const errors = [];
  if (bank.mcq.length !== 200) errors.push(`MCQ count must be exactly 200, got ${bank.mcq.length}`);
  if (bank.subjective.length !== 100) errors.push(`Subjective count must be exactly 100, got ${bank.subjective.length}`);
  if (new Set(bank.mcq.map(item => item.id)).size !== bank.mcq.length) errors.push('MCQ IDs are not unique');
  if (new Set(bank.subjective.map(item => item.id)).size !== bank.subjective.length) errors.push('Subjective IDs are not unique');
  if (new Set(bank.mcq.map(item => item.question)).size !== bank.mcq.length) errors.push('MCQ question text is not unique');
  if (new Set(bank.subjective.map(item => item.prompt)).size !== bank.subjective.length) errors.push('Subjective prompt text is not unique');
  for (const item of bank.mcq) {
    if (!item.question || item.options.length !== 4 || item.answer < 0 || item.answer > 3) errors.push(`${item.id} is malformed`);
    const answers = Array.isArray(item.answers) ? item.answers : [item.answer];
    if (item.format === 'MSQ') {
      if (answers.length < 2 || answers.some(index => !Number.isInteger(index) || index < 0 || index > 3)) errors.push(`${item.id} MSQ answer set is malformed`);
      if (item.answerText !== answers.map(index => item.options[index]).join(' | ')) errors.push(`${item.id} MSQ answer text mismatch`);
    } else if (item.options[item.answer] !== item.answerText || answers.length !== 1) {
      errors.push(`${item.id} answer index mismatch`);
    }
    if (![1, 2, 3, 4, 5].includes(item.guideTopic)) errors.push(`${item.id} is outside official objective guide topics 1-5`);
    if (new Set(item.options).size !== 4) errors.push(`${item.id} contains duplicate options`);
    if (item.explanation.length < 120 || item.distractorNote.length < 80) errors.push(`${item.id} explanation is too shallow`);
  }
  for (const item of bank.subjective) {
    const points = item.rubric.reduce((sum, row) => sum + row.points, 0);
    if (points !== 10) errors.push(`${item.id} rubric totals ${points}, expected 10`);
    if (item.modelAnswer.steps.length < 4 || item.modelAnswer.failureChecks.length < 2) errors.push(`${item.id} model answer is incomplete`);
    if (item.guideTopic !== 6 || item.modelAnswer.claimAssessment.length < 80 || item.modelAnswer.evidence.length < 80 || item.modelAnswer.uncertainty.length < 80) errors.push(`${item.id} does not implement the applied-judgment guide contract`);
  }
  const searchableBank = JSON.stringify([...bank.mcq, ...bank.subjective]);
  for (const topic of Object.keys(officialGuideCoveragePatterns)) {
    for (const pattern of officialGuideCoveragePatterns[topic]) {
      if (!pattern.test(searchableBank)) errors.push(`Official guide topic ${topic} is missing required coverage pattern ${pattern}`);
    }
  }
  const courseTopics = new Set(courseMap.flatMap(section => section.topics));
  const coveredWeeks = new Set([...bank.mcq, ...bank.subjective].map(item => item.week));
  for (const section of courseMap) if (!coveredWeeks.has(section.week)) errors.push(`${section.week} is not represented`);
  if (courseTopics.size < 100) errors.push(`Course map unexpectedly contains only ${courseTopics.size} topics`);
  const answerLetters = [0, 1, 2, 3].map(index => bank.mcq.reduce((count, item) => count + (item.answers || [item.answer]).includes(index), 0));
  if (Math.max(...answerLetters) - Math.min(...answerLetters) > 8) errors.push(`Answer positions are unbalanced: ${answerLetters.join(', ')}`);
  return {
    valid: errors.length === 0,
    errors,
    counts: {
      objective: bank.mcq.length,
      mcq: bank.mcq.filter(item => item.format === 'MCQ').length,
      msq: bank.mcq.filter(item => item.format === 'MSQ').length,
      subjective: bank.subjective.length,
      courseTopics: courseTopics.size
    },
    answerLetters
  };
}

function answerLabel(item) {
  return (item.answers || [item.answer])
    .map(index => String.fromCharCode(65 + index))
    .join(', ');
}

function markdown(bank) {
  const lines = [
    `# ${bank.metadata.title}`,
    '',
    `Source syllabus: ${bank.metadata.officialCourseUrl}`,
    '',
    '## Official End-Term Format Reference',
    '',
    '- **Total:** 80 marks',
    '- **Section 1:** 30 MCQ/MSQ questions for 39 marks, covering observability and monitoring, data pipeline integrity, CI/CD and release security, reliable AI/LLM systems, and web/API/infra fundamentals.',
    '- **Section 2:** 9 short-answer questions for 41 marks, manually graded for applied AI-era judgment.',
    '',
    `> ${bank.metadata.disclaimer}`,
    '',
    'This edition contains exactly **175 MCQs**, **25 MSQs**, and **100 subjective questions**. Answers are placed immediately after each question for guided study. Hide the answer area or use the JSON file when running a timed attempt.',
    '',
    `Objective practice pool format: ${bank.metadata.objectiveFormatMix.MCQ} MCQ and ${bank.metadata.objectiveFormatMix.MSQ} MSQ. Use the official-length format above for a timed sitting.`,
    '',
    '## Coverage',
    '',
    ...bank.courseMap.map(section => `- **${section.week}: ${section.title}** — ${section.topics.join('; ')}`),
    '',
    '## MCQ Bank',
    '',
    ...bank.mcq.flatMap(item => [
      `### ${item.id} | ${item.week} | ${item.topic} | ${item.skill} | ${item.difficulty}`,
      '',
      item.question,
      '',
      ...item.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
      '',
      `**Answer:** ${answerLabel(item)}. ${item.answerText}`,
      '',
      `**Simple explanation:** ${item.explanation}`,
      '',
      `**Why the other choices are weaker:** ${item.distractorNote}`,
      '',
      `**Exam takeaway:** ${item.takeaway}`,
      ''
    ]),
    '## Subjective Bank',
    '',
    ...bank.subjective.flatMap(item => [
      `### ${item.id} | ${item.week} | ${item.topic} | ${item.difficulty}`,
      '',
      item.prompt,
      '',
      '**Model answer**',
      '',
      item.modelAnswer.summary,
      '',
      `**Valid vs invalid claim:** ${item.modelAnswer.claimAssessment}`,
      '',
      `**Decision-useful evidence:** ${item.modelAnswer.evidence}`,
      '',
      `**Rejected alternative:** ${item.modelAnswer.rejectedAlternative}`,
      '',
      `**Decision-changing uncertainty:** ${item.modelAnswer.uncertainty}`,
      '',
      '**Steps:**',
      '',
      ...item.modelAnswer.steps.map((step, index) => `${index + 1}. ${step}`),
      '',
      '**Failure checks:**',
      '',
      ...item.modelAnswer.failureChecks.map(check => `- ${check}`),
      '',
      `**Trade-off:** ${item.modelAnswer.tradeoff}`,
      '',
      `**Simple explanation:** ${item.modelAnswer.simpleExplanation}`,
      '',
      '**Marking rubric (10 marks):**',
      '',
      ...item.rubric.map(row => `- ${row.points} marks: ${row.criterion}`),
      ''
    ]),
    '## Sources',
    '',
    `1. Official May 2026 course index: ${bank.metadata.officialCourseUrl}`,
    '2. Topic research and mock blueprint: mock-banks/T2-2026-May-Course-Deep-Dive.md',
    '3. Historical material was used only for broad question behavior. Old topic weights and questions were not copied.'
  ];
  return lines.join('\n');
}

function questionPaperMarkdown(bank) {
  return [
    `# ${bank.metadata.title}: Question Paper`,
    '',
    '## Official End-Term Format Reference',
    '',
    '- Total: 80 marks.',
    '- Section 1: 30 MCQ/MSQ questions, 39 marks, topics 1-5.',
    '- Section 2: 9 short-answer questions, 41 marks, topic 6 applied AI-era judgment, manually graded.',
    '- This artifact contains an expanded practice pool of 175 MCQs, 25 MSQs, and 100 subjective questions, not one official-length paper.',
    '',
    `> ${bank.metadata.disclaimer}`,
    '',
    'Attempt the expanded practice pool in study mode, or select 30 objective and 9 subjective prompts to simulate the official length. The separate solutions guide contains detailed answers and self-assessment rubrics.',
    '',
    '## Section A: Objective Questions',
    '',
    ...bank.mcq.flatMap(item => [
      `### ${item.id} | ${item.week} | ${item.topic} | ${item.skill} | ${item.difficulty}`,
      '',
      item.question,
      '',
      ...item.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
      ''
    ]),
    '## Section B: Subjective Questions',
    '',
    ...bank.subjective.flatMap(item => [
      `### ${item.id} | ${item.week} | ${item.topic} | ${item.difficulty} | 10 marks`,
      '',
      item.prompt,
      ''
    ])
  ].join('\n');
}

function solutionsMarkdown(bank) {
  return [
    `# ${bank.metadata.title}: Detailed Solutions`,
    '',
    `> ${bank.metadata.disclaimer}`,
    '',
    '## Section A: Objective Solutions',
    '',
    ...bank.mcq.flatMap(item => [
      `### ${item.id} | ${item.week} | ${item.topic}`,
      '',
      `**Answer:** ${answerLabel(item)}. ${item.answerText}`,
      '',
      `**Simple explanation:** ${item.explanation}`,
      '',
      `**Why the other choices are weaker:** ${item.distractorNote}`,
      '',
      `**Exam takeaway:** ${item.takeaway}`,
      ''
    ]),
    '## Section B: Subjective Model Answers',
    '',
    ...bank.subjective.flatMap(item => [
      `### ${item.id} | ${item.week} | ${item.topic} | 10 marks`,
      '',
      `**Question:** ${item.prompt}`,
      '',
      '**Model answer**',
      '',
      item.modelAnswer.summary,
      '',
      `**Valid vs invalid claim:** ${item.modelAnswer.claimAssessment}`,
      '',
      `**Decision-useful evidence:** ${item.modelAnswer.evidence}`,
      '',
      `**Rejected alternative:** ${item.modelAnswer.rejectedAlternative}`,
      '',
      `**Decision-changing uncertainty:** ${item.modelAnswer.uncertainty}`,
      '',
      '**Steps:**',
      '',
      ...item.modelAnswer.steps.map((step, index) => `${index + 1}. ${step}`),
      '',
      '**Failure checks:**',
      '',
      ...item.modelAnswer.failureChecks.map(check => `- ${check}`),
      '',
      `**Trade-off:** ${item.modelAnswer.tradeoff}`,
      '',
      `**Simple explanation:** ${item.modelAnswer.simpleExplanation}`,
      '',
      '**Marking rubric:**',
      '',
      ...item.rubric.map(row => `- ${row.points} marks: ${row.criterion}`),
      ''
    ])
  ].join('\n');
}

export function writeArtifacts(outputDir = fileURLToPath(new URL('.', import.meta.url))) {
  const bank = buildMockBank();
  const validation = validateMockBank(bank);
  if (!validation.valid) throw new Error(validation.errors.join('; '));
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'T2-2026-End-Term-Mock.md'), markdown(bank), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'T2-2026-End-Term-Question-Paper.md'), questionPaperMarkdown(bank), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'T2-2026-End-Term-Detailed-Solutions.md'), solutionsMarkdown(bank), 'utf8');
  fs.writeFileSync(path.join(outputDir, 'T2-2026-End-Term-Mock.json'), JSON.stringify(bank, null, 2), 'utf8');
  fs.writeFileSync(
    path.join(outputDir, 'T2-2026-End-Term-Mock.browser.js'),
    `// Generated by t2-2026-end-term-mock.mjs. Do not edit by hand.\nexport const bank = ${JSON.stringify(bank)};\n`,
    'utf8'
  );
  return validation;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const validation = validateMockBank();
  if (!validation.valid) {
    console.error(validation.errors.join('\n'));
    process.exitCode = 1;
  } else if (process.argv.includes('--check')) {
    console.log(JSON.stringify(validation));
  } else {
    console.log(JSON.stringify(writeArtifacts(), null, 2));
  }
}
