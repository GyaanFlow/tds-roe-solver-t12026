# T2 2026 Tools in Data Science End-Term Advanced Mock Bank: Question Paper

## Official End-Term Format Reference

- Total: 80 marks.
- Section 1: 30 MCQ/MSQ questions, 39 marks, topics 1-5.
- Section 2: 9 short-answer questions, 41 marks, topic 6 applied AI-era judgment, manually graded.
- This artifact contains an expanded practice pool of 175 MCQs, 25 MSQs, and 100 subjective questions, not one official-length paper.

> Original reference-only practice material based on the current syllabus. It is not an official paper, answer key, prediction, or score guarantee.

Attempt the expanded practice pool in study mode, or select 30 objective and 9 subjective prompts to simulate the official length. The separate solutions guide contains detailed answers and self-assessment rubrics.

## Section A: Objective Questions

### MCQ-001 | W0 | Paths and WSL | Concept | Foundation

Which statement most accurately explains the main principle of Paths and WSL?

A. Use an explicit, portable path model and distinguish relative, absolute, home, and parent paths.
B. Hard-code the current desktop path
C. Use a relative path without checking the process working directory
D. Treat every path as a URL

### MCQ-002 | W0 | Paths and WSL | Application | Application

A script works from one folder but fails when launched from another. What should the team do first?

A. Hard-code the current desktop path
B. Use a relative path without checking the process working directory
C. Treat every path as a URL
D. Resolve the path from a known base such as the project or script directory, then test it from both launch locations

### MCQ-003 | W0 | Paths and WSL | Debugging | Analysis

While debugging Paths and WSL, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Hard-code the current desktop path
D. Resolve the path from a known base such as the project or script directory, then test it from both launch locations

### MCQ-004 | W0 | Paths and WSL | Practical | Application

A Python file is `/home/riya/app/main.py`, its data file is `/home/riya/app/data/users.csv`, and the program may be launched from any working directory. Which expression is the safest base for the data path?

A. `Path.home() / "users.csv"`
B. `Path(__file__).resolve().parent / "data" / "users.csv"`
C. `Path("data/users.csv")` without controlling the working directory
D. `Path("/tmp/data/users.csv")`

### MCQ-005 | W0 | Shell pipelines and redirection | Concept | Foundation

Which statement most accurately explains the main principle of Shell pipelines and redirection?

A. Use one giant command with no quoting
B. Redirect everything to /dev/null
C. Run each command manually and copy output by hand
D. Use pipes to stream stdout between commands and choose overwrite, append, or stderr redirection deliberately.

### MCQ-006 | W0 | Shell pipelines and redirection | Application | Application

A diagnostic command must retain old output while recording new errors separately. What should the team do first?

A. Redirect everything to /dev/null
B. Run each command manually and copy output by hand
C. Append stdout and redirect stderr explicitly
D. Use one giant command with no quoting

### MCQ-007 | W0 | Shell pipelines and redirection | Debugging | Analysis

While debugging Shell pipelines and redirection, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Redirect everything to /dev/null
C. Append stdout and redirect stderr explicitly
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-008 | W0 | Shell pipelines and redirection | Practical | Application

Which Bash command appends standard output to `run.log` while overwriting standard error in `errors.log`?

A. `python job.py >> run.log 2> errors.log`
B. `python job.py > run.log 2>&1`
C. `python job.py 2>> run.log > errors.log`
D. `python job.py | run.log | errors.log`

### MCQ-009 | W0 | uv project workflow | Concept | Foundation

Which statement most accurately explains the main principle of uv project workflow?

A. Copy the site-packages directory
B. Rely on the active shell history
C. Declare dependencies in project metadata and use uv to create or reproduce an isolated environment.
D. Install packages globally

### MCQ-010 | W0 | uv project workflow | Application | Application

A teammate needs the same Python dependencies on a clean machine. What should the team do first?

A. Rely on the active shell history
B. Commit project metadata and the lockfile
C. Install packages globally
D. Copy the site-packages directory

### MCQ-011 | W0 | uv project workflow | Debugging | Analysis

While debugging uv project workflow, which proposed response is the least defensible?

A. Rely on the active shell history
B. Commit project metadata and the lockfile
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-012 | W0 | uv project workflow | Practical | Application

After cloning a UV project that already contains `pyproject.toml` and `uv.lock`, which command recreates the project environment from the lockfile?

A. `uv init`
B. `uv add --all`
C. `pip freeze`
D. `uv sync`

### MCQ-013 | W0 | HTTP methods and status codes | Concept | Foundation

Which statement most accurately explains the main principle of HTTP methods and status codes?

A. Inspect only the response body
B. Interpret the method, status code, headers, and body together instead of treating every non-200 response as the same error.
C. Retry every response forever
D. Replace every response with 200

### MCQ-014 | W0 | HTTP methods and status codes | Application | Application

A client receives 401, 403, 404, and 500 responses from different requests. What should the team do first?

A. Diagnose authentication, authorization, routing, and server failure separately
B. Retry every response forever
C. Replace every response with 200
D. Inspect only the response body

### MCQ-015 | W0 | HTTP methods and status codes | Debugging | Analysis

While debugging HTTP methods and status codes, which proposed response is the least defensible?

A. Diagnose authentication, authorization, routing, and server failure separately
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Retry every response forever

### MCQ-016 | W0 | HTTP methods and status codes | Practical | Application

A FastAPI endpoint receives syntactically valid JSON, but a required integer field contains the string `"many"`. Which status is most likely?

A. `404 Not Found` because the field is missing from the URL
B. `500 Internal Server Error` because every type error is a server crash
C. `422 Unprocessable Entity` because request validation failed
D. `200 OK` because the JSON syntax is valid

### MCQ-017 | W0 | Git basic flow | Concept | Foundation

Which statement most accurately explains the main principle of Git basic flow?

A. Move deliberately from working tree to index to commit, preserve a safe history, and use force-push or rewrite operations only with review and an understood recovery path.
B. Force-push the default branch without warning
C. Leave the secret active because the commit is old
D. Edit the remote directly

### MCQ-018 | W0 | Git basic flow | Application | Application

A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret. What should the team do first?

A. Force-push the default branch without warning
B. Leave the secret active because the commit is old
C. Edit the remote directly
D. Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely

### MCQ-019 | W0 | Git basic flow | Debugging | Analysis

While debugging Git basic flow, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Leave the secret active because the commit is old
D. Revoke the secret, rewrite only the affected history with coordination, verify the diff, and push the intended branch safely

### MCQ-020 | W0 | Git basic flow | Practical | Application

You edited `app.py`, ran `git add app.py`, and then edited `app.py` again. Which command shows only the version currently staged for the next commit?

A. `git log -1`
B. `git diff --staged`
C. `git diff`
D. `git status --short` only

### MCQ-021 | W1 | VS Code workspaces | Concept | Foundation

Which statement most accurately explains the main principle of VS Code workspaces?

A. Install a second editor
B. Rename every import
C. Disable diagnostics globally
D. Open the project folder and configure workspace-scoped settings so tools resolve files and interpreters consistently.

### MCQ-022 | W1 | VS Code workspaces | Application | Application

The editor shows the wrong Python interpreter and unresolved imports. What should the team do first?

A. Rename every import
B. Disable diagnostics globally
C. Select the project interpreter and verify workspace settings
D. Install a second editor

### MCQ-023 | W1 | VS Code workspaces | Debugging | Analysis

While debugging VS Code workspaces, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Disable diagnostics globally
C. Select the project interpreter and verify workspace settings
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-024 | W1 | VS Code workspaces | Evidence | Evaluation

Select all evidence that would materially support saying that the VS Code workspaces solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Select the project interpreter and verify workspace settings. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

### MCQ-025 | W1 | Dependency locking | Concept | Foundation

Which statement most accurately explains the main principle of Dependency locking?

A. Copy random package versions from a colleague
B. Grant the package broad build permissions without review
C. Keep declared dependencies separate from a verified lock, review transitive changes, and harden the supply chain with provenance, hashes, and reproducible installs.
D. Ignore the lockfile

### MCQ-026 | W1 | Dependency locking | Application | Application

A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions. What should the team do first?

A. Grant the package broad build permissions without review
B. Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading
C. Ignore the lockfile
D. Copy random package versions from a colleague

### MCQ-027 | W1 | Dependency locking | Debugging | Analysis

While debugging Dependency locking, which proposed response is the least defensible?

A. Ignore the lockfile
B. Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-028 | W1 | Dependency locking | Evidence | Evaluation

Select all evidence that would materially support saying that the Dependency locking solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Pin or lock the graph, verify provenance or hashes, and review the dependency diff before upgrading. The test includes normal and edge cases.

### MCQ-029 | W1 | Bash scripting | Concept | Foundation

Which statement most accurately explains the main principle of Bash scripting?

A. Assume the shell will infer intent
B. Quote variables, check exit codes, make inputs explicit, and keep destructive operations guarded.
C. Expand every variable unquoted
D. Use rm -rf on the parent directory

### MCQ-030 | W1 | Bash scripting | Application | Application

A cleanup script receives a filename containing spaces and an empty variable. What should the team do first?

A. Quote inputs and fail safely before deleting
B. Expand every variable unquoted
C. Use rm -rf on the parent directory
D. Assume the shell will infer intent

### MCQ-031 | W1 | Bash scripting | Debugging | Analysis

While debugging Bash scripting, which proposed response is the least defensible?

A. Quote inputs and fail safely before deleting
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use rm -rf on the parent directory

### MCQ-032 | W1 | Bash scripting | Evidence | Evaluation

Select all evidence that would materially support saying that the Bash scripting solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Quote inputs and fail safely before deleting. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

### MCQ-033 | W1 | SQLite | Concept | Foundation

Which statement most accurately explains the main principle of SQLite?

A. Use parameterized queries, transactions, appropriate indexes, and explicit joins for small local relational workloads.
B. Build SQL by string concatenation
C. Commit after every character
D. Store the database as a screenshot

### MCQ-034 | W1 | SQLite | Application | Application

An import must either commit all rows or leave the database unchanged. What should the team do first?

A. Build SQL by string concatenation
B. Commit after every character
C. Store the database as a screenshot
D. Wrap the import in a transaction and use parameters

### MCQ-035 | W1 | SQLite | Debugging | Analysis

While debugging SQLite, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Store the database as a screenshot
D. Wrap the import in a transaction and use parameters

### MCQ-036 | W1 | SQLite | Practical | Application

A SQLite import of 1,000 rows must leave zero new rows if row 731 violates a constraint. What is the essential design?

A. Disable constraints during the import and never recheck them
B. Run all inserts inside one transaction and roll back on any error
C. Commit after every row so earlier rows remain
D. Build one SQL string by concatenating every value

### MCQ-037 | W1 | HTTP clients and data formats | Concept | Foundation

Which statement most accurately explains the main principle of HTTP clients and data formats?

A. Call JSON.parse on every body blindly
B. Silently accept HTML as data
C. Ignore encoding and delimiters
D. Validate timeouts, content types, schemas, encodings, and JSON or CSV assumptions at the boundary.

### MCQ-038 | W1 | HTTP clients and data formats | Application | Application

An API sometimes returns an HTML error page where JSON was expected. What should the team do first?

A. Silently accept HTML as data
B. Ignore encoding and delimiters
C. Check status and content type before parsing
D. Call JSON.parse on every body blindly

### MCQ-039 | W1 | HTTP clients and data formats | Debugging | Analysis

While debugging HTTP clients and data formats, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Call JSON.parse on every body blindly
C. Check status and content type before parsing
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-040 | W1 | HTTP clients and data formats | Practical | Application

A client expects JSON but receives a body beginning with `<!doctype html>`. What should it inspect before calling the JSON parser?

A. The HTTP status and `Content-Type`, then the raw body if either is unexpected
B. Only whether the URL ends in `.json`
C. Only whether the request took less than one second
D. Nothing; retry `JSON.parse` until it succeeds

### MCQ-041 | W2 | FastAPI fundamentals | Concept | Foundation

Which statement most accurately explains the main principle of FastAPI fundamentals?

A. Parse raw strings in every route
B. Return a different response shape per request
C. Keep request handling stateless, put durable state in an explicit store, separate validation from business logic, and return precise API errors.
D. Keep state in a module global and return 500 for every failure

### MCQ-042 | W2 | FastAPI fundamentals | Application | Application

A service works on one instance but loses a user job after a restart and returns inconsistent error shapes. What should the team do first?

A. Return a different response shape per request
B. Persist durable state outside the process and use a documented status and error contract
C. Keep state in a module global and return 500 for every failure
D. Parse raw strings in every route

### MCQ-043 | W2 | FastAPI fundamentals | Debugging | Analysis

While debugging FastAPI fundamentals, which proposed response is the least defensible?

A. Parse raw strings in every route
B. Persist durable state outside the process and use a documented status and error contract
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-044 | W2 | FastAPI fundamentals | Practical | Application

Which FastAPI feature most directly keeps request validation and generated OpenAPI documentation aligned?

A. A comment describing the expected JSON
B. Manual string splitting inside every route
C. Returning status 200 for invalid bodies
D. A typed Pydantic request model used in the route signature

### MCQ-045 | W2 | CORS and middleware | Concept | Foundation

Which statement most accurately explains the main principle of CORS and middleware?

A. Change the database schema without inspecting the request identity
B. Treat CORS, authentication, and authorization as distinct controls, then verify their ordered middleware behavior.
C. Add a wildcard credentialed origin and trust the prompt
D. Disable all middleware

### MCQ-046 | W2 | CORS and middleware | Application | Application

A browser call fails while curl works, and a logged-in user can see a resource belonging to another user. What should the team do first?

A. Check origin and preflight separately from authentication, then enforce resource authorization on the server
B. Add a wildcard credentialed origin and trust the prompt
C. Disable all middleware
D. Change the database schema without inspecting the request identity

### MCQ-047 | W2 | CORS and middleware | Debugging | Analysis

While debugging CORS and middleware, which proposed response is the least defensible?

A. Check origin and preflight separately from authentication, then enforce resource authorization on the server
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Change the database schema without inspecting the request identity

### MCQ-048 | W2 | CORS and middleware | Practical | Application

A browser sends a CORS preflight before a credentialed cross-origin `POST`. Which HTTP method is used for the preflight?

A. `PATCH`
B. `CONNECT`
C. `OPTIONS`
D. `TRACE`

### MCQ-049 | W2 | OAuth 2.0 | Concept | Foundation

Which statement most accurately explains the main principle of OAuth 2.0?

A. Distinguish authentication of the user from delegated authorization to a provider, using authorization-code flow, state, and secure redirects.
B. Ask for the provider password
C. Put the client secret in browser JavaScript
D. Reuse an access token forever

### MCQ-050 | W2 | OAuth 2.0 | Application | Application

A web app needs access to a user-owned provider resource without collecting the provider password. What should the team do first?

A. Ask for the provider password
B. Put the client secret in browser JavaScript
C. Reuse an access token forever
D. Redirect for authorization and exchange the code securely for scoped delegated access

### MCQ-051 | W2 | OAuth 2.0 | Debugging | Analysis

While debugging OAuth 2.0, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Ask for the provider password
D. Redirect for authorization and exchange the code securely for scoped delegated access

### MCQ-052 | W2 | OAuth 2.0 | Practical | Application

What is the main security purpose of the OAuth `state` value in an authorization-code flow?

A. Increase the lifetime of a refresh token
B. Bind the callback to the login attempt and reduce CSRF/login-substitution attacks
C. Encrypt the access token
D. Replace the provider redirect URI

### MCQ-053 | W2 | Configuration and secrets | Concept | Foundation

Which statement most accurately explains the main principle of Configuration and secrets?

A. Delete the log and keep using the token
B. Print all secrets during health checks
C. Hard-code a new credential in the repository
D. Load validated environment-specific configuration, keep secrets out of source control and logs, and respond to leaked credentials by revoking, rotating, auditing, and redeploying safely.

### MCQ-054 | W2 | Configuration and secrets | Application | Application

A production token appears in a public CI log while the same service runs locally, in CI, and in production. What should the team do first?

A. Print all secrets during health checks
B. Hard-code a new credential in the repository
C. Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement
D. Delete the log and keep using the token

### MCQ-055 | W2 | Configuration and secrets | Debugging | Analysis

While debugging Configuration and secrets, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Print all secrets during health checks
C. Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-056 | W2 | Configuration and secrets | Evidence | Evaluation

Select all evidence that would materially support saying that the Configuration and secrets solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Revoke the token immediately, rotate it through the secret manager, audit use, remove the exposure, and verify the replacement. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

### MCQ-057 | W2 | Containers and deployment | Concept | Foundation

Which statement most accurately explains the main principle of Containers and deployment?

A. Bake credentials into the image
B. Assume host localhost names every container
C. Build a minimal reproducible image, bind to the platform interface and configured port, understand container networking, and separate build-time configuration from runtime secrets.
D. Bind only to localhost inside the container

### MCQ-058 | W2 | Containers and deployment | Application | Application

A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost. What should the team do first?

A. Assume host localhost names every container
B. Bind to the configured interface and port, use the service network name, and keep secrets outside the image
C. Bind only to localhost inside the container
D. Bake credentials into the image

### MCQ-059 | W2 | Containers and deployment | Debugging | Analysis

While debugging Containers and deployment, which proposed response is the least defensible?

A. Assume host localhost names every container
B. Bind to the configured interface and port, use the service network name, and keep secrets outside the image
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-060 | W2 | Containers and deployment | Practical | Application

A container platform provides port `8080`, but the app listens on `127.0.0.1:8000`. Which change is normally required?

A. Keep loopback and expose a random Docker port
B. Bake the platform credentials into the image
C. Write the server output to a local HTML file
D. Listen on `0.0.0.0` and the platform-provided port

### MCQ-061 | W2 | Logging, testing, and observability | Concept | Foundation

Which statement most accurately explains the main principle of Logging, testing, and observability?

A. Restart every service until the dashboard looks normal
B. Read averages and percentiles together, compare rates rather than raw counts, correlate telemetry across services, and distinguish liveness from readiness.
C. Use the average and raw error count alone
D. Treat a green liveness probe as proof of readiness

### MCQ-062 | W2 | Logging, testing, and observability | Application | Application

Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency. What should the team do first?

A. Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix
B. Use the average and raw error count alone
C. Treat a green liveness probe as proof of readiness
D. Restart every service until the dashboard looks normal

### MCQ-063 | W2 | Logging, testing, and observability | Debugging | Analysis

While debugging Logging, testing, and observability, which proposed response is the least defensible?

A. Compare rate-normalized metrics and percentiles, trace one request across services, and separate liveness from readiness before choosing a fix
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use the average and raw error count alone

### MCQ-064 | W2 | Logging, testing, and observability | Practical | Application

Which Prometheus design is safest for measuring API latency?

A. Put the full URL, token, and user email in metric labels
B. Create a new metric name for every request
C. Use a histogram with bounded labels such as route and method, and keep user IDs in logs/traces
D. Use a gauge labeled with every request ID

### MCQ-065 | W3 | Prompt foundations | Concept | Foundation

Which statement most accurately explains the main principle of Prompt foundations?

A. State the task, constraints, context, output requirements, and examples with unambiguous instructions.
B. Make the prompt shorter by removing constraints
C. Ask for a secret chain of thought
D. Randomize the labels

### MCQ-066 | W3 | Prompt foundations | Application | Application

An LLM returns inconsistent formats for the same classification task. What should the team do first?

A. Make the prompt shorter by removing constraints
B. Ask for a secret chain of thought
C. Randomize the labels
D. Specify the contract and include representative examples

### MCQ-067 | W3 | Prompt foundations | Debugging | Analysis

While debugging Prompt foundations, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Ask for a secret chain of thought
D. Specify the contract and include representative examples

### MCQ-068 | W3 | Prompt foundations | Evidence | Evaluation

Select all evidence that would materially support saying that the Prompt foundations solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Specify the contract and include representative examples. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

### MCQ-069 | W3 | Reliable output control | Concept | Foundation

Which statement most accurately explains the main principle of Reliable output control?

A. Regex any text without checking failure
B. Accept missing or unknown fields forever
C. Ask the model to be more confident
D. Verify AI-generated output against a schema, source or business invariant, bounded retries, and explicit refusal or uncertainty behavior rather than trusting fluent prose.

### MCQ-070 | W3 | Reliable output control | Application | Application

A downstream service expects an enum and two required fields, but the model sometimes invents a third value. What should the team do first?

A. Accept missing or unknown fields forever
B. Ask the model to be more confident
C. Validate structured output and the relevant invariant, then reject or repair only within a bounded policy
D. Regex any text without checking failure

### MCQ-071 | W3 | Reliable output control | Debugging | Analysis

While debugging Reliable output control, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Ask the model to be more confident
C. Validate structured output and the relevant invariant, then reject or repair only within a bounded policy
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-072 | W3 | Reliable output control | Practical | Application

An LLM response must contain `status` as one of `approved|rejected` and a non-empty `reason`. What is the strongest control?

A. Request schema-constrained output, validate it, and use a bounded repair or failure path
B. Search the prose for the word `approved`
C. Accept missing fields and guess their values
D. Ask the model to be more confident without validation

### MCQ-073 | W3 | Context and prompt caching | Concept | Foundation

Which statement most accurately explains the main principle of Context and prompt caching?

A. Put secrets in the cache key
B. Disable expiration for every cache
C. Supply the smallest relevant context and cache only content whose reuse and invalidation semantics are understood.
D. Cache all user data indefinitely

### MCQ-074 | W3 | Context and prompt caching | Application | Application

A large stable system instruction is repeated across thousands of requests. What should the team do first?

A. Disable expiration for every cache
B. Cache the stable prefix and isolate user-specific content
C. Cache all user data indefinitely
D. Put secrets in the cache key

### MCQ-075 | W3 | Context and prompt caching | Debugging | Analysis

While debugging Context and prompt caching, which proposed response is the least defensible?

A. Cache all user data indefinitely
B. Cache the stable prefix and isolate user-specific content
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-076 | W3 | Context and prompt caching | Practical | Application

Which request layout is most likely to benefit from provider prompt caching?

A. A different system prompt at the start of every request
B. Random bytes inserted before the reusable document
C. Only a short unique user message with no reusable prefix
D. A large stable instruction/document prefix followed by a small changing user query

### MCQ-077 | W3 | Embeddings and similarity | Concept | Foundation

Which statement most accurately explains the main principle of Embeddings and similarity?

A. Sort by document length alone
B. Represent meaning as vectors and compare with an appropriate distance metric while respecting model and normalization assumptions.
C. Compare raw strings only
D. Use a random vector per document

### MCQ-078 | W3 | Embeddings and similarity | Application | Application

A search system must retrieve semantically related documents despite different wording. What should the team do first?

A. Embed queries and documents consistently, then inspect similarity quality
B. Compare raw strings only
C. Use a random vector per document
D. Sort by document length alone

### MCQ-079 | W3 | Embeddings and similarity | Debugging | Analysis

While debugging Embeddings and similarity, which proposed response is the least defensible?

A. Embed queries and documents consistently, then inspect similarity quality
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use a random vector per document

### MCQ-080 | W3 | Embeddings and similarity | Practical | Application

Two already normalized embedding vectors are `a = [1, 0]` and `b = [0.8, 0.6]`. What is their cosine similarity?

A. `1.4`
B. `0.0`
C. `0.8`
D. `0.6`

### MCQ-081 | W3 | LLM architecture and tooling | Concept | Foundation

Which statement most accurately explains the main principle of LLM architecture and tooling?

A. Choose model, modality, CLI, coding assistant, tracing, and gateway components according to latency, cost, capability, and control needs.
B. Hard-code one provider in every call site
C. Log only the final answer
D. Optimize latency without measuring it

### MCQ-082 | W3 | LLM architecture and tooling | Application | Application

A team needs provider portability and per-request cost traces. What should the team do first?

A. Hard-code one provider in every call site
B. Log only the final answer
C. Optimize latency without measuring it
D. Use an abstraction or gateway with explicit tracing and fallback policy

### MCQ-083 | W3 | LLM architecture and tooling | Debugging | Analysis

While debugging LLM architecture and tooling, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Optimize latency without measuring it
D. Use an abstraction or gateway with explicit tracing and fallback policy

### MCQ-084 | W3 | LLM architecture and tooling | Evidence | Evaluation

Select all evidence that would materially support saying that the LLM architecture and tooling solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use an abstraction or gateway with explicit tracing and fallback policy. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

### MCQ-085 | W4 | Vector databases and chunking | Concept | Foundation

Which statement most accurately explains the main principle of Vector databases and chunking?

A. Split every 10 characters
B. Remove all metadata
C. Embed the entire corpus as one vector
D. Store embeddings with metadata and choose chunk boundaries that preserve retrievable meaning without unnecessary context.

### MCQ-086 | W4 | Vector databases and chunking | Application | Application

A policy document contains headings, tables, and long sections. What should the team do first?

A. Remove all metadata
B. Embed the entire corpus as one vector
C. Chunk by semantic structure and retain source metadata
D. Split every 10 characters

### MCQ-087 | W4 | Vector databases and chunking | Debugging | Analysis

While debugging Vector databases and chunking, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Split every 10 characters
C. Chunk by semantic structure and retain source metadata
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-088 | W4 | Vector databases and chunking | Practical | Application

A Markdown policy manual has clear section headings, and answers must cite their section. Which initial chunking strategy is strongest?

A. Chunk by heading/section and retain heading plus source metadata
B. Split every ten characters and discard headings
C. Store the whole manual as one vector
D. Randomly shuffle paragraphs before embedding

### MCQ-089 | W4 | Late and contextual retrieval | Concept | Foundation

Which statement most accurately explains the main principle of Late and contextual retrieval?

A. Replace the chunk with a guess
B. Return the nearest chunk without its source
C. Use document context and retrieval-time enrichment to reduce ambiguity while preserving the original source trace.
D. Discard the parent heading

### MCQ-090 | W4 | Late and contextual retrieval | Application | Application

A short chunk says “this limit” but its meaning is defined in the parent section. What should the team do first?

A. Return the nearest chunk without its source
B. Attach useful context before embedding or retrieval and keep provenance
C. Discard the parent heading
D. Replace the chunk with a guess

### MCQ-091 | W4 | Late and contextual retrieval | Debugging | Analysis

While debugging Late and contextual retrieval, which proposed response is the least defensible?

A. Replace the chunk with a guess
B. Attach useful context before embedding or retrieval and keep provenance
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-092 | W4 | Late and contextual retrieval | Evidence | Evaluation

Select all evidence that would materially support saying that the Late and contextual retrieval solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Attach useful context before embedding or retrieval and keep provenance. The test includes normal and edge cases.

### MCQ-093 | W4 | Hybrid search and reranking | Concept | Foundation

Which statement most accurately explains the main principle of Hybrid search and reranking?

A. Rerank the entire internet without candidates
B. Combine lexical and semantic signals when exact identifiers and conceptual similarity both matter, then rerank a candidate set.
C. Use only a stopword count
D. Use only the first vector hit

### MCQ-094 | W4 | Hybrid search and reranking | Application | Application

A query contains a product code and a natural-language description. What should the team do first?

A. Retrieve with complementary signals and rerank the shortlist
B. Use only a stopword count
C. Use only the first vector hit
D. Rerank the entire internet without candidates

### MCQ-095 | W4 | Hybrid search and reranking | Debugging | Analysis

While debugging Hybrid search and reranking, which proposed response is the least defensible?

A. Retrieve with complementary signals and rerank the shortlist
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Rerank the entire internet without candidates

### MCQ-096 | W4 | Hybrid search and reranking | Practical | Application

With reciprocal rank fusion `score = 1/(60 + rank)`, a document ranks 1st in dense search and 4th in BM25. What is its approximate fused score?

A. `(0.8 + 12.0) / 2 = 6.4` using unrelated raw scores
B. `1/(60 + 1 + 4)`, approximately `0.0154`
C. `1/61 + 1/64`, approximately `0.0320`
D. `1 + 4 = 5`

### MCQ-097 | W4 | Query augmentation and semantic caching | Concept | Foundation

Which statement most accurately explains the main principle of Query augmentation and semantic caching?

A. Expand or rewrite queries carefully and reuse results only when the normalized intent and freshness policy match.
B. Cache every answer forever
C. Rewrite away critical identifiers
D. Ignore source freshness

### MCQ-098 | W4 | Query augmentation and semantic caching | Application | Application

Users ask the same question with minor wording changes while source data updates hourly. What should the team do first?

A. Cache every answer forever
B. Rewrite away critical identifiers
C. Ignore source freshness
D. Normalize intent, cache within a freshness boundary, and preserve variants

### MCQ-099 | W4 | Query augmentation and semantic caching | Debugging | Analysis

While debugging Query augmentation and semantic caching, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Cache every answer forever
D. Normalize intent, cache within a freshness boundary, and preserve variants

### MCQ-100 | W4 | Query augmentation and semantic caching | Evidence | Evaluation

Select all evidence that would materially support saying that the Query augmentation and semantic caching solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Normalize intent, cache within a freshness boundary, and preserve variants. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

### MCQ-101 | W4 | Grounding and RAG evaluation | Concept | Foundation

Which statement most accurately explains the main principle of Grounding and RAG evaluation?

A. Score only grammar
B. Treat a fluent answer as grounded
C. Remove citations to improve style
D. Ground claims in current, authorized sources and measure retrieval, faithfulness, answer relevance, and citation quality separately.

### MCQ-102 | W4 | Grounding and RAG evaluation | Application | Application

A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday. What should the team do first?

A. Treat a fluent answer as grounded
B. Remove citations to improve style
C. Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently
D. Score only grammar

### MCQ-103 | W4 | Grounding and RAG evaluation | Debugging | Analysis

While debugging Grounding and RAG evaluation, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Treat a fluent answer as grounded
C. Retrieve the current source, preserve a traceable citation and timestamp, and evaluate retrieval and generation independently
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-104 | W4 | Grounding and RAG evaluation | Practical | Application

A RAG answer is fluent and relevant, but several claims are not supported by retrieved passages. Which evaluation dimension is most directly weak?

A. Faithfulness/groundedness
B. Context recall only
C. Grammar quality
D. Embedding dimensionality

### MCQ-105 | W5 | Agent fundamentals and tool calling | Concept | Foundation

Which statement most accurately explains the main principle of Agent fundamentals and tool calling?

A. Let tool names be free-form code
B. Skip tool-result validation
C. Constrain an agent with explicit tools, typed arguments, permissions, and a termination policy.
D. Give the model unrestricted shell access

### MCQ-106 | W5 | Agent fundamentals and tool calling | Application | Application

An agent can read documents but must not execute arbitrary shell commands. What should the team do first?

A. Skip tool-result validation
B. Expose least-privilege tools with validated arguments
C. Give the model unrestricted shell access
D. Let tool names be free-form code

### MCQ-107 | W5 | Agent fundamentals and tool calling | Debugging | Analysis

While debugging Agent fundamentals and tool calling, which proposed response is the least defensible?

A. Skip tool-result validation
B. Expose least-privilege tools with validated arguments
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-108 | W5 | Agent fundamentals and tool calling | Evidence | Evaluation

Select all evidence that would materially support saying that the Agent fundamentals and tool calling solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Expose least-privilege tools with validated arguments. The test includes normal and edge cases.

### MCQ-109 | W5 | Agent evaluation | Concept | Foundation

Which statement most accurately explains the main principle of Agent evaluation?

A. Delete failed traces
B. Evaluate agents on task success, tool correctness, safety, latency, cost, and reproducibility using representative traces.
C. Use success rate alone
D. Evaluate on one happy path

### MCQ-110 | W5 | Agent evaluation | Application | Application

A benchmark score improves while unsafe tool calls increase. What should the team do first?

A. Track safety and operational metrics alongside success
B. Use success rate alone
C. Evaluate on one happy path
D. Delete failed traces

### MCQ-111 | W5 | Agent evaluation | Debugging | Analysis

While debugging Agent evaluation, which proposed response is the least defensible?

A. Track safety and operational metrics alongside success
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Use success rate alone

### MCQ-112 | W5 | Agent evaluation | Practical | Application

Agent A solves 88% of tasks but makes unsafe tool calls in 9%; Agent B solves 84% with no unsafe calls. Which conclusion is defensible?

A. Agent B always wins regardless of task requirements
B. Delete unsafe traces and compare success rate again
C. No single winner can be declared until safety thresholds and task costs are specified
D. Agent A always wins because 88 is larger than 84

### MCQ-113 | W5 | Memory and loop engineering | Concept | Foundation

Which statement most accurately explains the main principle of Memory and loop engineering?

A. Separate durable facts from transient context and bound loops with budgets, retries, and stop conditions.
B. Let the loop continue until the model stops
C. Store every observation forever
D. Retry instantly without changing state

### MCQ-114 | W5 | Memory and loop engineering | Application | Application

An agent repeats a failed search and grows its prompt without limit. What should the team do first?

A. Let the loop continue until the model stops
B. Store every observation forever
C. Retry instantly without changing state
D. Use scoped memory and explicit iteration, token, and time budgets

### MCQ-115 | W5 | Memory and loop engineering | Debugging | Analysis

While debugging Memory and loop engineering, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Store every observation forever
D. Use scoped memory and explicit iteration, token, and time budgets

### MCQ-116 | W5 | Memory and loop engineering | Evidence | Evaluation

Select all evidence that would materially support saying that the Memory and loop engineering solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use scoped memory and explicit iteration, token, and time budgets. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

### MCQ-117 | W5 | Multi-agent systems | Concept | Foundation

Which statement most accurately explains the main principle of Multi-agent systems?

A. Merge prose by concatenation
B. Give every worker every permission
C. Hide disagreements from the user
D. Assign narrow roles, define message contracts, and coordinate only where decomposition improves reliability or parallelism.

### MCQ-118 | W5 | Multi-agent systems | Application | Application

Several workers produce conflicting research claims. What should the team do first?

A. Give every worker every permission
B. Hide disagreements from the user
C. Use typed handoffs, provenance, and an adjudication step
D. Merge prose by concatenation

### MCQ-119 | W5 | Multi-agent systems | Debugging | Analysis

While debugging Multi-agent systems, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Hide disagreements from the user
C. Use typed handoffs, provenance, and an adjudication step
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-120 | W5 | Multi-agent systems | Evidence | Evaluation

Select all evidence that would materially support saying that the Multi-agent systems solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use typed handoffs, provenance, and an adjudication step. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

### MCQ-121 | W5 | MCP, async, and sandboxing | Concept | Foundation

Which statement most accurately explains the main principle of MCP, async, and sandboxing?

A. Ignore cancellation after dispatch
B. Run untrusted code on the host
C. Treat external tools as capabilities with explicit schemas, cancellation, concurrency limits, and isolation.
D. Spawn unlimited tasks

### MCQ-122 | W5 | MCP, async, and sandboxing | Application | Application

Parallel tasks can call a remote tool but must stop when the user cancels. What should the team do first?

A. Run untrusted code on the host
B. Propagate cancellation and bound concurrency inside a sandbox
C. Spawn unlimited tasks
D. Ignore cancellation after dispatch

### MCQ-123 | W5 | MCP, async, and sandboxing | Debugging | Analysis

While debugging MCP, async, and sandboxing, which proposed response is the least defensible?

A. Spawn unlimited tasks
B. Propagate cancellation and bound concurrency inside a sandbox
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-124 | W5 | MCP, async, and sandboxing | Practical | Application

A scraper launches 500 detail-page requests against a rate-limited service. Which async design is safest?

A. Start all requests without a limit
B. Run blocking HTTP calls directly inside the event loop
C. Ignore cancellation and failed tasks
D. Use a bounded semaphore, explicit timeouts, and collected per-task errors

### MCQ-125 | W6 | Legal and ethical scraping | Concept | Foundation

Which statement most accurately explains the main principle of Legal and ethical scraping?

A. Use personal data because it is public
B. Respect authorization, terms, robots guidance where applicable, privacy, rate limits, and the purpose of the data collection.
C. Scrape and publish everything
D. Bypass access controls

### MCQ-126 | W6 | Legal and ethical scraping | Application | Application

A public page contains personal information that is not needed for the task. What should the team do first?

A. Minimize collection and avoid using data outside the authorized purpose
B. Scrape and publish everything
C. Bypass access controls
D. Use personal data because it is public

### MCQ-127 | W6 | Legal and ethical scraping | Debugging | Analysis

While debugging Legal and ethical scraping, which proposed response is the least defensible?

A. Minimize collection and avoid using data outside the authorized purpose
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Bypass access controls

### MCQ-128 | W6 | Legal and ethical scraping | Evidence | Evaluation

Select all evidence that would materially support saying that the Legal and ethical scraping solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Minimize collection and avoid using data outside the authorized purpose. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

### MCQ-129 | W6 | Hidden JSON APIs and structured sources | Concept | Foundation

Which statement most accurately explains the main principle of Hidden JSON APIs and structured sources?

A. Inspect network behavior and documented structured sources, then reproduce the request with validation and attribution.
B. Parse only the visible pixels
C. Guess an undocumented URL repeatedly
D. Ignore pagination metadata

### MCQ-130 | W6 | Hidden JSON APIs and structured sources | Application | Application

The page renders a table from an XHR JSON response. What should the team do first?

A. Parse only the visible pixels
B. Guess an undocumented URL repeatedly
C. Ignore pagination metadata
D. Identify the endpoint, parameters, schema, and access conditions

### MCQ-131 | W6 | Hidden JSON APIs and structured sources | Debugging | Analysis

While debugging Hidden JSON APIs and structured sources, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Ignore pagination metadata
D. Identify the endpoint, parameters, schema, and access conditions

### MCQ-132 | W6 | Hidden JSON APIs and structured sources | Practical | Application

A page table is populated by an XHR request visible in DevTools. What is the best first extraction approach when use is authorized?

A. Copy browser-only headers and credentials into public code
B. Reproduce the minimal JSON request and validate its pagination and schema
C. OCR screenshots of every table row
D. Guess category URLs without observing the request

### MCQ-133 | W6 | Browser automation and pagination | Concept | Foundation

Which statement most accurately explains the main principle of Browser automation and pagination?

A. Loop a fixed number of clicks blindly
B. Use pixel coordinates as the only selector
C. Stop after the first viewport
D. Use stable selectors, wait for state, follow pagination or infinite-scroll boundaries, and deduplicate discovered records.

### MCQ-134 | W6 | Browser automation and pagination | Application | Application

A catalog loads the next page only after a button click. What should the team do first?

A. Use pixel coordinates as the only selector
B. Stop after the first viewport
C. Observe the UI state, paginate until exhaustion, and deduplicate by stable ID
D. Loop a fixed number of clicks blindly

### MCQ-135 | W6 | Browser automation and pagination | Debugging | Analysis

While debugging Browser automation and pagination, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Loop a fixed number of clicks blindly
C. Observe the UI state, paginate until exhaustion, and deduplicate by stable ID
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-136 | W6 | Browser automation and pagination | Evidence | Evaluation

Select all evidence that would materially support saying that the Browser automation and pagination solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Observe the UI state, paginate until exhaustion, and deduplicate by stable ID. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

### MCQ-137 | W6 | Authenticated scraping | Concept | Foundation

Which statement most accurately explains the main principle of Authenticated scraping?

A. Reuse a token forever
B. Download every account page
C. Keep credentials isolated, obtain authorization, protect session data, and avoid collecting unrelated account content.
D. Paste cookies into a public issue

### MCQ-138 | W6 | Authenticated scraping | Application | Application

A permitted internal dashboard requires a session cookie. What should the team do first?

A. Download every account page
B. Use the approved account and least-privilege scope without logging secrets
C. Paste cookies into a public issue
D. Reuse a token forever

### MCQ-139 | W6 | Authenticated scraping | Debugging | Analysis

While debugging Authenticated scraping, which proposed response is the least defensible?

A. Reuse a token forever
B. Use the approved account and least-privilege scope without logging secrets
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-140 | W6 | Authenticated scraping | Evidence | Evaluation

Select all evidence that would materially support saying that the Authenticated scraping solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use the approved account and least-privilege scope without logging secrets. The test includes normal and edge cases.

### MCQ-141 | W6 | Rate limits, retries, and caching | Concept | Foundation

Which statement most accurately explains the main principle of Rate limits, retries, and caching?

A. Treat every timeout as proof that no write happened
B. Handle partial or failed runs with checkpoints, retry uncertain writes only through idempotent operations, respect Retry-After, and bound exponential backoff.
C. Retry the write blindly until a 200 appears
D. Delete the partial output and restart without a run ID

### MCQ-142 | W6 | Rate limits, retries, and caching | Application | Application

A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry. What should the team do first?

A. Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects
B. Retry the write blindly until a 200 appears
C. Delete the partial output and restart without a run ID
D. Treat every timeout as proof that no write happened

### MCQ-143 | W6 | Rate limits, retries, and caching | Debugging | Analysis

While debugging Rate limits, retries, and caching, which proposed response is the least defensible?

A. Use a stable operation key, reconcile the uncertain result, and resume safely without duplicating side effects
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Treat every timeout as proof that no write happened

### MCQ-144 | W6 | Rate limits, retries, and caching | Practical | Application

A GET request receives `429` with `Retry-After: 12`. What is the best next action?

A. Change the request to POST and send it repeatedly
B. Treat the 429 response body as successful data
C. Wait at least the indicated period, add bounded retry logic with jitter, and reduce concurrency
D. Retry immediately in a tight loop

### MCQ-145 | W6 | Change detection and anti-bot resilience | Concept | Foundation

Which statement most accurately explains the main principle of Change detection and anti-bot resilience?

A. Use stable identity plus normalized fields or hashes to detect meaningful changes, preserve snapshots, and fail gracefully instead of bypassing defenses.
B. Treat every DOM change as a new record
C. Hash raw timestamps only
D. Bypass every challenge

### MCQ-146 | W6 | Change detection and anti-bot resilience | Application | Application

A page layout changes but the underlying product record does not, while one product later changes price. What should the team do first?

A. Treat every DOM change as a new record
B. Hash raw timestamps only
C. Bypass every challenge
D. Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance

### MCQ-147 | W6 | Change detection and anti-bot resilience | Debugging | Analysis

While debugging Change detection and anti-bot resilience, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Treat every DOM change as a new record
D. Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance

### MCQ-148 | W6 | Change detection and anti-bot resilience | Evidence | Evaluation

Select all evidence that would materially support saying that the Change detection and anti-bot resilience solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Match by stable record identity, compare normalized business fields, and retain the before-and-after provenance. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

### MCQ-149 | W6 | HTML, tabular, and document parsing | Concept | Foundation

Which statement most accurately explains the main principle of HTML, tabular, and document parsing?

A. Split on commas in raw HTML
B. Trust OCR without review
C. Discard source locations
D. Convert inputs with a parser that preserves structure, validates encoding, and records provenance before analysis.

### MCQ-150 | W6 | HTML, tabular, and document parsing | Application | Application

An HTML table contains merged cells and a document has scanned pages. What should the team do first?

A. Trust OCR without review
B. Discard source locations
C. Use format-aware parsing and flag uncertain extraction
D. Split on commas in raw HTML

### MCQ-151 | W6 | HTML, tabular, and document parsing | Debugging | Analysis

While debugging HTML, tabular, and document parsing, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Trust OCR without review
C. Use format-aware parsing and flag uncertain extraction
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-152 | W6 | HTML, tabular, and document parsing | Evidence | Evaluation

Select all evidence that would materially support saying that the HTML, tabular, and document parsing solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use format-aware parsing and flag uncertain extraction. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

### MCQ-153 | W6 | Vision, speech, and video acquisition | Concept | Foundation

Which statement most accurately explains the main principle of Vision, speech, and video acquisition?

A. Remove timestamps
B. Present OCR guesses as facts
C. Treat multimodal extraction as a pipeline with preprocessing, model confidence, timestamps, and human-verifiable outputs.
D. Use audio only

### MCQ-154 | W6 | Vision, speech, and video acquisition | Application | Application

A video contains spoken claims and on-screen figures. What should the team do first?

A. Present OCR guesses as facts
B. Align transcripts, frames, timestamps, and confidence before summarizing
C. Use audio only
D. Remove timestamps

### MCQ-155 | W6 | Vision, speech, and video acquisition | Debugging | Analysis

While debugging Vision, speech, and video acquisition, which proposed response is the least defensible?

A. Present OCR guesses as facts
B. Align transcripts, frames, timestamps, and confidence before summarizing
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-156 | W6 | Vision, speech, and video acquisition | Evidence | Evaluation

Select all evidence that would materially support saying that the Vision, speech, and video acquisition solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Align transcripts, frames, timestamps, and confidence before summarizing. The test includes normal and edge cases.

### MCQ-157 | W6 | OSINT and scheduled collection | Concept | Foundation

Which statement most accurately explains the main principle of OSINT and scheduled collection?

A. Overwrite the prior dossier
B. Use precise search operators, public records, source evaluation, scheduling, and reproducible evidence logs.
C. Search private accounts
D. Copy search snippets without URLs

### MCQ-158 | W6 | OSINT and scheduled collection | Application | Application

A dossier must be refreshed weekly without duplicating old findings. What should the team do first?

A. Schedule an authorized job with provenance, deduplication, and change history
B. Search private accounts
C. Copy search snippets without URLs
D. Overwrite the prior dossier

### MCQ-159 | W6 | OSINT and scheduled collection | Debugging | Analysis

While debugging OSINT and scheduled collection, which proposed response is the least defensible?

A. Schedule an authorized job with provenance, deduplication, and change history
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Search private accounts

### MCQ-160 | W6 | OSINT and scheduled collection | Evidence | Evaluation

Select all evidence that would materially support saying that the OSINT and scheduled collection solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Schedule an authorized job with provenance, deduplication, and change history. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

### MCQ-161 | W7 | CI/CD and advanced Docker | Concept | Foundation

Which statement most accurately explains the main principle of CI/CD and advanced Docker?

A. Isolate untrusted code from deployment credentials, harden the software supply chain, gate tests and scans, and promote immutable artifacts through progressive rollouts.
B. Expose deployment credentials to every pull-request step
C. Rebuild a different image in production and roll out to everyone at once
D. Skip scans because the branch is internal

### MCQ-162 | W7 | CI/CD and advanced Docker | Application | Application

A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression. What should the team do first?

A. Expose deployment credentials to every pull-request step
B. Rebuild a different image in production and roll out to everyone at once
C. Skip scans because the branch is internal
D. Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy

### MCQ-163 | W7 | CI/CD and advanced Docker | Debugging | Analysis

While debugging CI/CD and advanced Docker, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Rebuild a different image in production and roll out to everyone at once
D. Use least-privilege isolated jobs, pinned or verified dependencies, gated approvals, and a measurable canary rollback policy

### MCQ-164 | W7 | CI/CD and advanced Docker | Practical | Application

Which GitHub Actions policy is safest for deployment from pull requests created by untrusted forks?

A. Write secrets into build logs for debugging
B. Run tests with read-only permissions and do not expose deployment secrets to the forked code
C. Give every pull request production credentials
D. Deploy before tests so failures are visible sooner

### MCQ-165 | W7 | LLM security and OWASP risks | Concept | Foundation

Which statement most accurately explains the main principle of LLM security and OWASP risks?

A. Tell the model in a stronger prompt never to exfiltrate
B. Print the secret for debugging
C. Give the retriever admin permissions
D. Treat model and retrieved text as untrusted input, verify generated output, and enforce authorization in code and tool boundaries rather than in prompts.

### MCQ-166 | W7 | LLM security and OWASP risks | Application | Application

Retrieved text tells an agent to ignore its system policy and exfiltrate a secret. What should the team do first?

A. Print the secret for debugging
B. Give the retriever admin permissions
C. Treat retrieved text as untrusted data and enforce server-side authorization and tool limits
D. Tell the model in a stronger prompt never to exfiltrate

### MCQ-167 | W7 | LLM security and OWASP risks | Debugging | Analysis

While debugging LLM security and OWASP risks, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Give the retriever admin permissions
C. Treat retrieved text as untrusted data and enforce server-side authorization and tool limits
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-168 | W7 | LLM security and OWASP risks | Evidence | Evaluation

Select all evidence that would materially support saying that the LLM security and OWASP risks solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Treat retrieved text as untrusted data and enforce server-side authorization and tool limits. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

### MCQ-169 | W7 | VMs, SSH, serverless, and IaC | Concept | Foundation

Which statement most accurately explains the main principle of VMs, SSH, serverless, and IaC?

A. Share one root key
B. Apply the change directly because the plan is inconvenient
C. Use least-privilege identities, declarative infrastructure, protected state, and peer review for risky infrastructure changes before applying them.
D. Make manual console edits only

### MCQ-170 | W7 | VMs, SSH, serverless, and IaC | Application | Application

A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments. What should the team do first?

A. Apply the change directly because the plan is inconvenient
B. Review the diff and blast radius, test the plan, and apply with scoped access and protected state
C. Make manual console edits only
D. Share one root key

### MCQ-171 | W7 | VMs, SSH, serverless, and IaC | Debugging | Analysis

While debugging VMs, SSH, serverless, and IaC, which proposed response is the least defensible?

A. Make manual console edits only
B. Review the diff and blast radius, test the plan, and apply with scoped access and protected state
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-172 | W7 | VMs, SSH, serverless, and IaC | Evidence | Evaluation

Select all evidence that would materially support saying that the VMs, SSH, serverless, and IaC solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Review the diff and blast radius, test the plan, and apply with scoped access and protected state. The test includes normal and edge cases.

### MCQ-173 | W7 | Budgets and event-driven cloud | Concept | Foundation

Which statement most accurately explains the main principle of Budgets and event-driven cloud?

A. Ignore token usage until billing closes
B. Track AI token and request cost, budget burn rate, quotas, retries, idempotency, and durable event contracts for asynchronous systems.
C. Assume exactly-once delivery without evidence
D. Disable all retries

### MCQ-174 | W7 | Budgets and event-driven cloud | Application | Application

A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives. What should the team do first?

A. Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded
B. Assume exactly-once delivery without evidence
C. Disable all retries
D. Ignore token usage until billing closes

### MCQ-175 | W7 | Budgets and event-driven cloud | Debugging | Analysis

While debugging Budgets and event-driven cloud, which proposed response is the least defensible?

A. Make consumers idempotent, emit per-request cost telemetry, and alert or stop work before budget limits are exceeded
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Disable all retries

### MCQ-176 | W7 | Budgets and event-driven cloud | Practical | Application

A Pub/Sub consumer may receive the same `payment-recorded` event twice. What prevents duplicate business effects?

A. Acknowledge before processing and discard every error
B. Generate a new event ID on every retry
C. Store a stable event ID and make the consumer idempotently ignore an already-applied event
D. Assume the broker can never redeliver

### MCQ-177 | W8 | Cloud Storage and BigQuery ML | Concept | Foundation

Which statement most accurately explains the main principle of Cloud Storage and BigQuery ML?

A. Separate raw, curated, and feature data, version inputs, record query and feature lineage, and preserve provenance when correcting data or rerunning a model.
B. Overwrite raw data in place and keep no correction note
C. Use anonymous buckets
D. Train from an undocumented dashboard click

### MCQ-178 | W8 | Cloud Storage and BigQuery ML | Application | Application

A model training job must be traceable back to immutable input data, including a corrected source record. What should the team do first?

A. Overwrite raw data in place and keep no correction note
B. Use anonymous buckets
C. Train from an undocumented dashboard click
D. Write a versioned correction with reason, author, parent data version, and reproducible query lineage

### MCQ-179 | W8 | Cloud Storage and BigQuery ML | Debugging | Analysis

While debugging Cloud Storage and BigQuery ML, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Train from an undocumented dashboard click
D. Write a versioned correction with reason, author, parent data version, and reproducible query lineage

### MCQ-180 | W8 | Cloud Storage and BigQuery ML | Evidence | Evaluation

Select all evidence that would materially support saying that the Cloud Storage and BigQuery ML solution is ready.

A. The README says the feature is complete, although no executable check or measured result is included.
B. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Write a versioned correction with reason, author, parent data version, and reproducible query lineage. The test includes normal and edge cases.
C. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
D. The implementation worked once on the author's computer, but the input and environment were not recorded.

### MCQ-181 | W8 | MLflow | Concept | Foundation

Which statement most accurately explains the main principle of MLflow?

A. Promote from the best-looking chart
B. Delete failed runs
C. Track only the model filename
D. Track parameters, metrics, artifacts, data fingerprints, environment, and promotion decisions so data and model runs are reproducible and auditable.

### MCQ-182 | W8 | MLflow | Application | Application

A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown. What should the team do first?

A. Delete failed runs
B. Track only the model filename
C. Require a complete run record and evidence before promotion
D. Promote from the best-looking chart

### MCQ-183 | W8 | MLflow | Debugging | Analysis

While debugging MLflow, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Promote from the best-looking chart
C. Require a complete run record and evidence before promotion
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-184 | W8 | MLflow | Evidence | Evaluation

Select all evidence that would materially support saying that the MLflow solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Require a complete run record and evidence before promotion. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

### MCQ-185 | W8 | Fine-tuning strategy | Concept | Foundation

Which statement most accurately explains the main principle of Fine-tuning strategy?

A. Increase model size without diagnosis
B. Remove evaluation data
C. Choose prompting, retrieval, adapters, or full fine-tuning based on task, data, cost, and failure mode.
D. Fine-tune on random examples immediately

### MCQ-186 | W8 | Fine-tuning strategy | Application | Application

A model knows facts but consistently emits the wrong output format. What should the team do first?

A. Remove evaluation data
B. Fix the contract or use structured output before fine-tuning for facts
C. Fine-tune on random examples immediately
D. Increase model size without diagnosis

### MCQ-187 | W8 | Fine-tuning strategy | Debugging | Analysis

While debugging Fine-tuning strategy, which proposed response is the least defensible?

A. Increase model size without diagnosis
B. Fix the contract or use structured output before fine-tuning for facts
C. Reproduce the failure and record the relevant input, output, and environment before changing the system.
D. Test the normal path and at least one boundary or failure path before declaring the issue fixed.

### MCQ-188 | W8 | Fine-tuning strategy | Evidence | Evaluation

Select all evidence that would materially support saying that the Fine-tuning strategy solution is ready.

A. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
B. The implementation worked once on the author's computer, but the input and environment were not recorded.
C. The README says the feature is complete, although no executable check or measured result is included.
D. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Fix the contract or use structured output before fine-tuning for facts. The test includes normal and edge cases.

### MCQ-189 | W8 | Hugging Face and fine-tuning techniques | Concept | Foundation

Which statement most accurately explains the main principle of Hugging Face and fine-tuning techniques?

A. Publish without a card
B. Use dataset splits, tokenization, adapters, evaluation, and model cards with explicit training assumptions.
C. Train on the test set
D. Skip tokenization checks

### MCQ-190 | W8 | Hugging Face and fine-tuning techniques | Application | Application

A small domain dataset must adapt a base model while limiting memory use. What should the team do first?

A. Use an adapter-based method with held-out evaluation and documented provenance
B. Train on the test set
C. Skip tokenization checks
D. Publish without a card

### MCQ-191 | W8 | Hugging Face and fine-tuning techniques | Debugging | Analysis

While debugging Hugging Face and fine-tuning techniques, which proposed response is the least defensible?

A. Use an adapter-based method with held-out evaluation and documented provenance
B. Reproduce the failure and record the relevant input, output, and environment before changing the system.
C. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
D. Publish without a card

### MCQ-192 | W8 | Hugging Face and fine-tuning techniques | Evidence | Evaluation

Select all evidence that would materially support saying that the Hugging Face and fine-tuning techniques solution is ready.

A. The implementation worked once on the author's computer, but the input and environment were not recorded.
B. The README says the feature is complete, although no executable check or measured result is included.
C. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Use an adapter-based method with held-out evaluation and documented provenance. The test includes normal and edge cases.
D. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.

### MCQ-193 | W8 | Quantization and Gemma fine-tuning | Concept | Foundation

Which statement most accurately explains the main principle of Quantization and Gemma fine-tuning?

A. Trade precision and memory for throughput deliberately, validate quality after quantization, and match the method to hardware.
B. Assume lower precision is free
C. Quantize the labels only
D. Compare memory without evaluating outputs

### MCQ-194 | W8 | Quantization and Gemma fine-tuning | Application | Application

A model fits only after quantization but its factual accuracy changes. What should the team do first?

A. Assume lower precision is free
B. Quantize the labels only
C. Compare memory without evaluating outputs
D. Benchmark quality, latency, and memory before admitting the artifact

### MCQ-195 | W8 | Quantization and Gemma fine-tuning | Debugging | Analysis

While debugging Quantization and Gemma fine-tuning, which proposed response is the least defensible?

A. Reproduce the failure and record the relevant input, output, and environment before changing the system.
B. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
C. Assume lower precision is free
D. Benchmark quality, latency, and memory before admitting the artifact

### MCQ-196 | W8 | Quantization and Gemma fine-tuning | Practical | Application

Ignoring runtime overhead, approximately how much memory do 7 billion parameters require when stored at 4 bits each?

A. About `0.875 GB`
B. About `3.5 GB`
C. About `28 GB`
D. About `14 GB`

### MCQ-197 | W8 | Model publishing and cards | Concept | Foundation

Which statement most accurately explains the main principle of Model publishing and cards?

A. Publish only a marketing name
B. Hide evaluation failures
C. Reuse a mutable latest tag
D. Publish versioned artifacts with intended use, limitations, data, evaluation, license, and reproducibility details.

### MCQ-198 | W8 | Model publishing and cards | Application | Application

Users need to know whether a model is suitable for production. What should the team do first?

A. Hide evaluation failures
B. Reuse a mutable latest tag
C. Provide a model card and immutable version with limitations
D. Publish only a marketing name

### MCQ-199 | W8 | Model publishing and cards | Debugging | Analysis

While debugging Model publishing and cards, which proposed response is the least defensible?

A. Test the normal path and at least one boundary or failure path before declaring the issue fixed.
B. Hide evaluation failures
C. Provide a model card and immutable version with limitations
D. Reproduce the failure and record the relevant input, output, and environment before changing the system.

### MCQ-200 | W8 | Model publishing and cards | Evidence | Evaluation

Select all evidence that would materially support saying that the Model publishing and cards solution is ready.

A. A repeatable before-and-after test shows that the original failure is fixed after applying this response: Provide a model card and immutable version with limitations. The test includes normal and edge cases.
B. An independent failure-path test records the input, expected behavior, observed output, and environment needed to reproduce the result.
C. The implementation worked once on the author's computer, but the input and environment were not recorded.
D. The README says the feature is complete, although no executable check or measured result is included.

## Section B: Subjective Questions

### SUB-001 | W0 | Paths and WSL | Applied | 10 marks

You are responsible for this Paths and WSL problem: A script works from one folder but fails when launched from another. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-002 | W0 | Paths and WSL | Synthesis | 10 marks

A teammate proposes: "Hard-code the current desktop path." For this Paths and WSL situation (A script works from one folder but fails when launched from another.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-003 | W0 | Shell pipelines and redirection | Applied | 10 marks

You are responsible for this Shell pipelines and redirection problem: A diagnostic command must retain old output while recording new errors separately. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-004 | W0 | Shell pipelines and redirection | Synthesis | 10 marks

A teammate proposes: "Redirect everything to /dev/null." For this Shell pipelines and redirection situation (A diagnostic command must retain old output while recording new errors separately.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-005 | W0 | uv project workflow | Applied | 10 marks

You are responsible for this uv project workflow problem: A teammate needs the same Python dependencies on a clean machine. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-006 | W0 | uv project workflow | Synthesis | 10 marks

A teammate proposes: "Rely on the active shell history." For this uv project workflow situation (A teammate needs the same Python dependencies on a clean machine.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-007 | W0 | HTTP methods and status codes | Applied | 10 marks

You are responsible for this HTTP methods and status codes problem: A client receives 401, 403, 404, and 500 responses from different requests. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-008 | W0 | HTTP methods and status codes | Synthesis | 10 marks

A teammate proposes: "Retry every response forever." For this HTTP methods and status codes situation (A client receives 401, 403, 404, and 500 responses from different requests.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-009 | W0 | Git basic flow | Applied | 10 marks

You are responsible for this Git basic flow problem: A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-010 | W0 | Git basic flow | Synthesis | 10 marks

A teammate proposes: "Leave the secret active because the commit is old." For this Git basic flow situation (A change must be reviewed and reproduced by another developer, but an earlier local commit contains a secret.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-011 | W1 | VS Code workspaces | Applied | 10 marks

You are responsible for this VS Code workspaces problem: The editor shows the wrong Python interpreter and unresolved imports. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-012 | W1 | VS Code workspaces | Synthesis | 10 marks

A teammate proposes: "Disable diagnostics globally." For this VS Code workspaces situation (The editor shows the wrong Python interpreter and unresolved imports.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-013 | W1 | Dependency locking | Applied | 10 marks

You are responsible for this Dependency locking problem: A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-014 | W1 | Dependency locking | Synthesis | 10 marks

A teammate proposes: "Ignore the lockfile." For this Dependency locking situation (A deployment suddenly changes behavior after an unrelated package release and a new dependency asks for unexpected build permissions.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-015 | W1 | Bash scripting | Applied | 10 marks

You are responsible for this Bash scripting problem: A cleanup script receives a filename containing spaces and an empty variable. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-016 | W1 | Bash scripting | Synthesis | 10 marks

A teammate proposes: "Use rm -rf on the parent directory." For this Bash scripting situation (A cleanup script receives a filename containing spaces and an empty variable.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-017 | W1 | SQLite | Applied | 10 marks

You are responsible for this SQLite problem: An import must either commit all rows or leave the database unchanged. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-018 | W1 | SQLite | Synthesis | 10 marks

A teammate proposes: "Store the database as a screenshot." For this SQLite situation (An import must either commit all rows or leave the database unchanged.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-019 | W1 | HTTP clients and data formats | Applied | 10 marks

You are responsible for this HTTP clients and data formats problem: An API sometimes returns an HTML error page where JSON was expected. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-020 | W1 | HTTP clients and data formats | Synthesis | 10 marks

A teammate proposes: "Call JSON.parse on every body blindly." For this HTTP clients and data formats situation (An API sometimes returns an HTML error page where JSON was expected.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-021 | W2 | FastAPI fundamentals | Applied | 10 marks

You are responsible for this FastAPI fundamentals problem: A service works on one instance but loses a user job after a restart and returns inconsistent error shapes. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-022 | W2 | FastAPI fundamentals | Synthesis | 10 marks

A teammate proposes: "Parse raw strings in every route." For this FastAPI fundamentals situation (A service works on one instance but loses a user job after a restart and returns inconsistent error shapes.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-023 | W2 | CORS and middleware | Applied | 10 marks

You are responsible for this CORS and middleware problem: A browser call fails while curl works, and a logged-in user can see a resource belonging to another user. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-024 | W2 | CORS and middleware | Synthesis | 10 marks

A teammate proposes: "Change the database schema without inspecting the request identity." For this CORS and middleware situation (A browser call fails while curl works, and a logged-in user can see a resource belonging to another user.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-025 | W2 | OAuth 2.0 | Applied | 10 marks

You are responsible for this OAuth 2.0 problem: A web app needs access to a user-owned provider resource without collecting the provider password. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-026 | W2 | OAuth 2.0 | Synthesis | 10 marks

A teammate proposes: "Ask for the provider password." For this OAuth 2.0 situation (A web app needs access to a user-owned provider resource without collecting the provider password.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-027 | W2 | Configuration and secrets | Applied | 10 marks

You are responsible for this Configuration and secrets problem: A production token appears in a public CI log while the same service runs locally, in CI, and in production. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-028 | W2 | Configuration and secrets | Synthesis | 10 marks

A teammate proposes: "Print all secrets during health checks." For this Configuration and secrets situation (A production token appears in a public CI log while the same service runs locally, in CI, and in production.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-029 | W2 | Containers and deployment | Applied | 10 marks

You are responsible for this Containers and deployment problem: A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-030 | W2 | Containers and deployment | Synthesis | 10 marks

A teammate proposes: "Assume host localhost names every container." For this Containers and deployment situation (A container works locally but the platform reports that no port is listening and a second service cannot reach it by localhost.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-031 | W2 | Logging, testing, and observability | Applied | 10 marks

You are responsible for this Logging, testing, and observability problem: Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-032 | W2 | Logging, testing, and observability | Synthesis | 10 marks

A teammate proposes: "Use the average and raw error count alone." For this Logging, testing, and observability situation (Average latency is flat, p95 is rising, raw errors doubled because traffic doubled, and a green liveness probe hides a failed dependency.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-033 | W3 | Prompt foundations | Applied | 10 marks

You are responsible for this Prompt foundations problem: An LLM returns inconsistent formats for the same classification task. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-034 | W3 | Prompt foundations | Synthesis | 10 marks

A teammate proposes: "Ask for a secret chain of thought." For this Prompt foundations situation (An LLM returns inconsistent formats for the same classification task.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-035 | W3 | Reliable output control | Applied | 10 marks

You are responsible for this Reliable output control problem: A downstream service expects an enum and two required fields, but the model sometimes invents a third value. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-036 | W3 | Reliable output control | Synthesis | 10 marks

A teammate proposes: "Ask the model to be more confident." For this Reliable output control situation (A downstream service expects an enum and two required fields, but the model sometimes invents a third value.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-037 | W3 | Context and prompt caching | Applied | 10 marks

You are responsible for this Context and prompt caching problem: A large stable system instruction is repeated across thousands of requests. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-038 | W3 | Context and prompt caching | Synthesis | 10 marks

A teammate proposes: "Cache all user data indefinitely." For this Context and prompt caching situation (A large stable system instruction is repeated across thousands of requests.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-039 | W3 | Embeddings and similarity | Applied | 10 marks

You are responsible for this Embeddings and similarity problem: A search system must retrieve semantically related documents despite different wording. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-040 | W3 | Embeddings and similarity | Synthesis | 10 marks

A teammate proposes: "Use a random vector per document." For this Embeddings and similarity situation (A search system must retrieve semantically related documents despite different wording.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-041 | W3 | LLM architecture and tooling | Applied | 10 marks

You are responsible for this LLM architecture and tooling problem: A team needs provider portability and per-request cost traces. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-042 | W3 | LLM architecture and tooling | Synthesis | 10 marks

A teammate proposes: "Optimize latency without measuring it." For this LLM architecture and tooling situation (A team needs provider portability and per-request cost traces.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-043 | W4 | Vector databases and chunking | Applied | 10 marks

You are responsible for this Vector databases and chunking problem: A policy document contains headings, tables, and long sections. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-044 | W4 | Vector databases and chunking | Synthesis | 10 marks

A teammate proposes: "Split every 10 characters." For this Vector databases and chunking situation (A policy document contains headings, tables, and long sections.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-045 | W4 | Late and contextual retrieval | Applied | 10 marks

You are responsible for this Late and contextual retrieval problem: A short chunk says “this limit” but its meaning is defined in the parent section. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-046 | W4 | Late and contextual retrieval | Synthesis | 10 marks

A teammate proposes: "Replace the chunk with a guess." For this Late and contextual retrieval situation (A short chunk says “this limit” but its meaning is defined in the parent section.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-047 | W4 | Hybrid search and reranking | Applied | 10 marks

You are responsible for this Hybrid search and reranking problem: A query contains a product code and a natural-language description. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-048 | W4 | Hybrid search and reranking | Synthesis | 10 marks

A teammate proposes: "Rerank the entire internet without candidates." For this Hybrid search and reranking situation (A query contains a product code and a natural-language description.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-049 | W4 | Query augmentation and semantic caching | Applied | 10 marks

You are responsible for this Query augmentation and semantic caching problem: Users ask the same question with minor wording changes while source data updates hourly. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-050 | W4 | Query augmentation and semantic caching | Synthesis | 10 marks

A teammate proposes: "Cache every answer forever." For this Query augmentation and semantic caching situation (Users ask the same question with minor wording changes while source data updates hourly.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-051 | W4 | Grounding and RAG evaluation | Applied | 10 marks

You are responsible for this Grounding and RAG evaluation problem: A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-052 | W4 | Grounding and RAG evaluation | Synthesis | 10 marks

A teammate proposes: "Treat a fluent answer as grounded." For this Grounding and RAG evaluation situation (A chatbot sounds fluent but cites an outdated policy passage after the source changed yesterday.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-053 | W5 | Agent fundamentals and tool calling | Applied | 10 marks

You are responsible for this Agent fundamentals and tool calling problem: An agent can read documents but must not execute arbitrary shell commands. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-054 | W5 | Agent fundamentals and tool calling | Synthesis | 10 marks

A teammate proposes: "Skip tool-result validation." For this Agent fundamentals and tool calling situation (An agent can read documents but must not execute arbitrary shell commands.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-055 | W5 | Agent evaluation | Applied | 10 marks

You are responsible for this Agent evaluation problem: A benchmark score improves while unsafe tool calls increase. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-056 | W5 | Agent evaluation | Synthesis | 10 marks

A teammate proposes: "Use success rate alone." For this Agent evaluation situation (A benchmark score improves while unsafe tool calls increase.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-057 | W5 | Memory and loop engineering | Applied | 10 marks

You are responsible for this Memory and loop engineering problem: An agent repeats a failed search and grows its prompt without limit. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-058 | W5 | Memory and loop engineering | Synthesis | 10 marks

A teammate proposes: "Store every observation forever." For this Memory and loop engineering situation (An agent repeats a failed search and grows its prompt without limit.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-059 | W5 | Multi-agent systems | Applied | 10 marks

You are responsible for this Multi-agent systems problem: Several workers produce conflicting research claims. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-060 | W5 | Multi-agent systems | Synthesis | 10 marks

A teammate proposes: "Hide disagreements from the user." For this Multi-agent systems situation (Several workers produce conflicting research claims.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-061 | W5 | MCP, async, and sandboxing | Applied | 10 marks

You are responsible for this MCP, async, and sandboxing problem: Parallel tasks can call a remote tool but must stop when the user cancels. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-062 | W5 | MCP, async, and sandboxing | Synthesis | 10 marks

A teammate proposes: "Spawn unlimited tasks." For this MCP, async, and sandboxing situation (Parallel tasks can call a remote tool but must stop when the user cancels.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-063 | W6 | Legal and ethical scraping | Applied | 10 marks

You are responsible for this Legal and ethical scraping problem: A public page contains personal information that is not needed for the task. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-064 | W6 | Legal and ethical scraping | Synthesis | 10 marks

A teammate proposes: "Bypass access controls." For this Legal and ethical scraping situation (A public page contains personal information that is not needed for the task.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-065 | W6 | Hidden JSON APIs and structured sources | Applied | 10 marks

You are responsible for this Hidden JSON APIs and structured sources problem: The page renders a table from an XHR JSON response. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-066 | W6 | Hidden JSON APIs and structured sources | Synthesis | 10 marks

A teammate proposes: "Ignore pagination metadata." For this Hidden JSON APIs and structured sources situation (The page renders a table from an XHR JSON response.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-067 | W6 | Browser automation and pagination | Applied | 10 marks

You are responsible for this Browser automation and pagination problem: A catalog loads the next page only after a button click. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-068 | W6 | Browser automation and pagination | Synthesis | 10 marks

A teammate proposes: "Loop a fixed number of clicks blindly." For this Browser automation and pagination situation (A catalog loads the next page only after a button click.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-069 | W6 | Authenticated scraping | Applied | 10 marks

You are responsible for this Authenticated scraping problem: A permitted internal dashboard requires a session cookie. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-070 | W6 | Authenticated scraping | Synthesis | 10 marks

A teammate proposes: "Reuse a token forever." For this Authenticated scraping situation (A permitted internal dashboard requires a session cookie.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-071 | W6 | Rate limits, retries, and caching | Applied | 10 marks

You are responsible for this Rate limits, retries, and caching problem: A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-072 | W6 | Rate limits, retries, and caching | Synthesis | 10 marks

A teammate proposes: "Treat every timeout as proof that no write happened." For this Rate limits, retries, and caching situation (A collector times out after the remote service may have accepted a write, leaving the next run unsure whether to retry.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-073 | W6 | Change detection and anti-bot resilience | Applied | 10 marks

You are responsible for this Change detection and anti-bot resilience problem: A page layout changes but the underlying product record does not, while one product later changes price. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-074 | W6 | Change detection and anti-bot resilience | Synthesis | 10 marks

A teammate proposes: "Treat every DOM change as a new record." For this Change detection and anti-bot resilience situation (A page layout changes but the underlying product record does not, while one product later changes price.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-075 | W6 | HTML, tabular, and document parsing | Applied | 10 marks

You are responsible for this HTML, tabular, and document parsing problem: An HTML table contains merged cells and a document has scanned pages. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-076 | W6 | HTML, tabular, and document parsing | Synthesis | 10 marks

A teammate proposes: "Trust OCR without review." For this HTML, tabular, and document parsing situation (An HTML table contains merged cells and a document has scanned pages.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-077 | W6 | Vision, speech, and video acquisition | Applied | 10 marks

You are responsible for this Vision, speech, and video acquisition problem: A video contains spoken claims and on-screen figures. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-078 | W6 | Vision, speech, and video acquisition | Synthesis | 10 marks

A teammate proposes: "Present OCR guesses as facts." For this Vision, speech, and video acquisition situation (A video contains spoken claims and on-screen figures.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-079 | W6 | OSINT and scheduled collection | Applied | 10 marks

You are responsible for this OSINT and scheduled collection problem: A dossier must be refreshed weekly without duplicating old findings. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-080 | W6 | OSINT and scheduled collection | Synthesis | 10 marks

A teammate proposes: "Search private accounts." For this OSINT and scheduled collection situation (A dossier must be refreshed weekly without duplicating old findings.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-081 | W7 | CI/CD and advanced Docker | Applied | 10 marks

You are responsible for this CI/CD and advanced Docker problem: A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-082 | W7 | CI/CD and advanced Docker | Synthesis | 10 marks

A teammate proposes: "Rebuild a different image in production and roll out to everyone at once." For this CI/CD and advanced Docker situation (A pull request runs untrusted code, while production deployment uses cloud credentials and a canary must be stopped on regression.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-083 | W7 | LLM security and OWASP risks | Applied | 10 marks

You are responsible for this LLM security and OWASP risks problem: Retrieved text tells an agent to ignore its system policy and exfiltrate a secret. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-084 | W7 | LLM security and OWASP risks | Synthesis | 10 marks

A teammate proposes: "Give the retriever admin permissions." For this LLM security and OWASP risks situation (Retrieved text tells an agent to ignore its system policy and exfiltrate a secret.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-085 | W7 | VMs, SSH, serverless, and IaC | Applied | 10 marks

You are responsible for this VMs, SSH, serverless, and IaC problem: A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-086 | W7 | VMs, SSH, serverless, and IaC | Synthesis | 10 marks

A teammate proposes: "Make manual console edits only." For this VMs, SSH, serverless, and IaC situation (A proposed firewall rule would expose an internal service while a deployment must remain reproducible across two cloud environments.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-087 | W7 | Budgets and event-driven cloud | Applied | 10 marks

You are responsible for this Budgets and event-driven cloud problem: A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-088 | W7 | Budgets and event-driven cloud | Synthesis | 10 marks

A teammate proposes: "Disable all retries." For this Budgets and event-driven cloud situation (A message may be delivered more than once and a runaway LLM job could exceed its budget before the monthly invoice arrives.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-089 | W8 | Cloud Storage and BigQuery ML | Applied | 10 marks

You are responsible for this Cloud Storage and BigQuery ML problem: A model training job must be traceable back to immutable input data, including a corrected source record. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-090 | W8 | Cloud Storage and BigQuery ML | Synthesis | 10 marks

A teammate proposes: "Train from an undocumented dashboard click." For this Cloud Storage and BigQuery ML situation (A model training job must be traceable back to immutable input data, including a corrected source record.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-091 | W8 | MLflow | Applied | 10 marks

You are responsible for this MLflow problem: A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-092 | W8 | MLflow | Synthesis | 10 marks

A teammate proposes: "Promote from the best-looking chart." For this MLflow situation (A candidate model beats the baseline but its training data, dependency environment, and failed runs are unknown.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-093 | W8 | Fine-tuning strategy | Applied | 10 marks

You are responsible for this Fine-tuning strategy problem: A model knows facts but consistently emits the wrong output format. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-094 | W8 | Fine-tuning strategy | Synthesis | 10 marks

A teammate proposes: "Increase model size without diagnosis." For this Fine-tuning strategy situation (A model knows facts but consistently emits the wrong output format.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-095 | W8 | Hugging Face and fine-tuning techniques | Applied | 10 marks

You are responsible for this Hugging Face and fine-tuning techniques problem: A small domain dataset must adapt a base model while limiting memory use. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-096 | W8 | Hugging Face and fine-tuning techniques | Synthesis | 10 marks

A teammate proposes: "Publish without a card." For this Hugging Face and fine-tuning techniques situation (A small domain dataset must adapt a base model while limiting memory use.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-097 | W8 | Quantization and Gemma fine-tuning | Applied | 10 marks

You are responsible for this Quantization and Gemma fine-tuning problem: A model fits only after quantization but its factual accuracy changes. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-098 | W8 | Quantization and Gemma fine-tuning | Synthesis | 10 marks

A teammate proposes: "Assume lower precision is free." For this Quantization and Gemma fine-tuning situation (A model fits only after quantization but its factual accuracy changes.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.

### SUB-099 | W8 | Model publishing and cards | Applied | 10 marks

You are responsible for this Model publishing and cards problem: Users need to know whether a model is suitable for production. State the decision you must make, the most decision-useful evidence, one high-leverage question to ask before acting, the smallest robust fix in order, two failure checks, and the evidence required to accept the result.

### SUB-100 | W8 | Model publishing and cards | Synthesis | 10 marks

A teammate proposes: "Hide evaluation failures." For this Model publishing and cards situation (Users need to know whether a model is suitable for production.), separate the valid and invalid parts of the claim, weigh the main risk by probability and impact, identify the decision-changing unknown, propose the smallest safer fix, and give one trade-off plus an acceptance test.
