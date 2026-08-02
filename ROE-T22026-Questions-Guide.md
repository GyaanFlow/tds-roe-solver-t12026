# TDS T2 2026 ROE (Re-Exam) — Full Question Guide

Source: `exam-tds-2026-05-roe.js`. **9 questions, 25.8 marks total** (5 marks × 5 questions +
0.2 marks × 4 questions).

**The one thing worth knowing before anything else:** almost every question here pulls its
actual data from a live, authenticated per-student endpoint at exam time — there is no way to
know your specific numbers, image, or dataset ahead of time. What *is* knowable in advance, and
what this document covers in full, is the exact rules, algorithms, submission formats, and
grading mechanics for each question — which is normally the hard part anyway.

---

## Quick reference

| # | Title | Marks | What it actually tests |
|---|---|---|---|
| 1 | Incident Atlas — Georegister and Route | 5 | Raster image forensics → affine coordinate transform → time-dependent graph routing |
| 2 | Unicode Doppelganger Ledger Forensics | 5 | Unicode canonicalization, ledger reconciliation, arbitrary-precision arithmetic |
| 3 | HTTP Cache Time Machine | 5 | Simulating an HTTP shared-cache (RFC 9111 subset) exactly |
| 4 | Street View OSINT — Where Is This? | 5 | Real-world visual geolocation reasoning |
| 5 | Secret Handshake — Prove You Collaborated | 5 | HMAC-SHA256, and actually finding a classmate |
| 6 | Donate Your Marks | 0.2 (of 1.5) | A real trust/game-theory exercise with classmates |
| 7 | Donate Your Marks — Tell Them Why (Audio) | 0.2 (up to 2) | Genuine, specific spoken gratitude, LLM-judged |
| 8 | Something You Did On Your Own Initiative (Audio) | 0.2 | A true, independently verifiable personal story |
| 9 | The Unusual Useful Essay | 0.2 (+ relative bonus) | Writing distinctly, not just correctly |

---

## Q1 — Incident Atlas: Georegister and Route
**5 marks**

### The scenario, verbatim
> A response team has a directed road network and a separately exported raster incident atlas.
> Recover the incident records from the pixels, georegister them to directed road edges, and
> submit an earliest valid route that visits the mandatory checkpoint.
>
> ⚠️ This is a combined raster-forensics, affine-coordinate, and time-dependent routing task.
> Edge direction, the published turn restriction, half-open incident windows, and optional
> waiting all affect the certificate.

### The three stages
1. **Raster forensics** — decode the atlas image pixel-by-pixel into incident records (edge id,
   effect such as `CLOSED`, window id). Work in integer pixel coordinates to avoid rounding
   drift before the next step.
2. **Georegistration** — apply the given affine transform
   (`x_map = a·px + b·py + c`, `y_map = d·px + e·py + f`) to convert pixels to map coordinates,
   then snap to the nearest **directed** edge. `H00E` and its reverse are different edges.
3. **Time-dependent routing** — earliest arrival visiting the mandatory checkpoint, respecting:
   - **Edge direction** — traverse only the permitted way.
   - **The published turn restriction** — a specific turn is banned, even on an otherwise
     faster path.
   - **Half-open incident windows** `[start, end)` — arriving *exactly* at `end` is **not**
     blocked.
   - **Optional waiting** at a node for a closure to lift — this means plain Dijkstra is
     insufficient; you need a time-dependent search where waiting is an explicit action.

### Submission format
```json
{"incidents":[{"edge_id":"H00E","effect":"CLOSED","window_id":"W1"}],"route_edge_ids":["H00E"],"arrival_seconds":123}
```
Exactly these three fields. Incident order doesn't matter; route edge order does. Decoded
incidents and the route certificate are credited **separately** — a correct incident list still
scores even with a wrong route, so submit partial work.

### Common traps
- Treating the network as undirected → shorter but invalid routes.
- Treating incident windows as closed intervals → wrongly blocking an arrival exactly at `end`.
- Forgetting waiting is allowed → false "unreachable" verdicts.
- Ignoring the turn restriction because the resulting path *looks* valid edge-by-edge.

---

## Q2 — Unicode Doppelganger Ledger Forensics
**5 marks**

### The scenario, verbatim
> **Incident:** A payments ledger may have merged Unicode doppelganger identities and replayed
> revised events. Produce a deterministic forensic certificate from your private assignment
> artifact.
>
> This is deliberately not a visual matching exercise. Handles and transaction keys contain
> composed versus decomposed accents, fullwidth forms, mixed-script Cyrillic look-alikes, and
> explicitly listed invisible code points. The ledger also contains exact transport replays,
> superseded revisions, equal-revision corrections, business-level duplicates, and integer
> values too large for safe floating-point arithmetic.
>
> **What makes the certificate auditable:** your artifact pins the exact ordered
> canonicalization (Unicode 15.1 NFKC, locale-independent lowercase, removal of only the listed
> default-ignorable scalars, then one pass of the supplied confusable map), the exact processing
> order (replay removal → revision selection + tie-break → eligibility → canonical business-key
> deduplication), and the documented FNV-1a-32 evidence-digest recipe. **The artifact contains
> the complete procedure, but no certificate values.**

### Canonicalization — public order, with the traps that cost marks
```js
const canonical = (s, ignorable, confusables) => {
  let t = s.normalize('NFKC').toLowerCase();       // NFKC BEFORE lowercasing
  t = [...t].filter(ch => !ignorable.has(ch)).join('');    // only the LISTED scalars
  return [...t].map(ch => confusables[ch] ?? ch).join(''); // exactly ONE pass
};
```
- Use plain `toLowerCase()`, never a locale-aware variant — a Turkish locale maps `I → ı` and
  would corrupt handles.
- Apply the confusable map **once** — do not iterate to a fixed point.

### Arithmetic — BigInt is mandatory
Values are explicitly stated to exceed safe floating-point range.
```js
let net = 0n;
for (const e of accepted) net += BigInt(e.amount_minor); // never Number()
const net_minor_units = net.toString();
```
A single `Number()` conversion silently rounds past 2^53 and loses the mark.

### The digest — UTF-8 bytes, not JS characters
```js
const bytes = new TextEncoder().encode(input);
let h = 2166136261;
for (const b of bytes) h = Math.imul(h ^ b, 16777619);
const digest = 'fnv1a32:' + (h >>> 0).toString(16).padStart(8, '0');
```
Iterating JS string characters instead of UTF-8 bytes gives a **different, wrong** digest for
any non-ASCII input — and this ledger is deliberately full of non-ASCII.

### Submission format
```json
{"suspicious_account_ids":["acct-..."],"accepted_event_ids":["evt-..."],"net_minor_units":"12345678901234567","evidence_digest":"fnv1a32:0123abcd"}
```
ID-array order is ignored. All four fields are credited independently, but malformed types,
duplicate IDs, extra keys, or oversized submissions are rejected outright.

---

## Q3 — HTTP Cache Time Machine: Reconstruct the Shared Cache
**5 marks**

### The scenario, verbatim
> **Incident:** users swear an API served the past. You have the origin's version schedule and
> the exact request trace, but the shared-cache log was lost. Reconstruct what every marked
> probe delivered, how many requests reached origin, and the final cache state.
>
> This is a deterministic protocol simulation, not a browser experiment. Use only the complete
> **TDS-RFC9111-SUBSET-1** below. Times and ages are integer seconds; the cache starts empty;
> requests execute serially in timeline order with zero network delay. There is no heuristic
> freshness, clock skew, `Age`, stale serving, range handling, authorization rule, or rule not
> written here.

### The complete cache machine
**1. Origin schedule.** For a GET at time `t`, the current representation is the row for that
URI with the greatest `effective_at <= t`. A change is effective *before* a request at the same
second. ETag comparison is opaque, case-sensitive, and includes the quote characters.

**2. Variant lookup.** Header names are case-insensitive; values are exact and case-sensitive. A
stored entry matches only when its URI matches and, for every lower-cased name in that entry's
response `Vary` list, the current request value equals the value recorded when stored. A
missing request header has value `""`. `Vary` order is the response's left-to-right order. The
trace never has two matching entries.

**3. Freshness.** `s-maxage=N` **overrides** `max-age=M` in a shared cache; otherwise `max-age`
is used. Age is `t - stored_at`, fresh exactly when `age < freshness_lifetime` — **equality is
stale**. A matching fresh entry is delivered without origin *unless* the request carries
`Cache-Control: no-cache`.

**4. Forwarding and validation.** A miss, a stale match, or request `no-cache` sends exactly one
origin request.
- Matching entry has an ETag → conditional validation. **Equal** ETags → **304**: deliver the
  *cached* body, set `stored_at = t`, refresh ETag/freshness from the current row.
- **Unequal** ETags, or no matching entry → **200** with the current origin body.

**5. Storing a 200.** Remove the matching old entry first, if any. Never store a response
containing `no-store` or `private`. Otherwise a GET 200 with explicit `s-maxage` or `max-age` is
stored, replacing any entry with the same URI + Vary values. Request `no-cache` does **not**
prevent storing.

**6. Unsafe methods.** Every POST/PUT/DELETE goes to origin, returns 204, delivers no body, and
invalidates **all** cached variants whose URI is exactly its URI. Does not alter the origin
version schedule.

**7. Sources and origin count.** `source` is `cache` (fresh hit), `origin-304` (validation
returned 304), or `origin-200` (body came from a 200). Count every forwarded GET **and** every
unsafe request once; never count cache hits.

### Final-cache digest
Each stored entry, keys in **exactly** this order:
```json
{"uri":"...","vary_values":[["header","value"]],"body_version":"...","etag":"\"...\"","stored_at":1700000000,"freshness_lifetime":7}
```
- Keep `vary_values` in response-`Vary` order.
- Sort ascending by `uri + "\n" + vary_values.map(([n,v]) => n+":"+v).join("\n")`.
- Compact `JSON.stringify` (no spaces), then FNV-1a-32 over UTF-8 bytes, prefixed `fnv1a32:`.

### Submission format
```json
{"probe_deliveries":[{"request_id":"R02","body_version":"...","source":"cache"}],"origin_request_count":0,"final_cache_digest":"fnv1a32:00000000"}
```
Every id in `probe_request_ids`, exactly once, in the listed order. Deliveries = 65% (split
equally across probe rows), origin count = 20%, digest = 15%. Malformed JSON, extra keys, wrong
types, duplicate/missing probe ids, or >20,000 characters are rejected outright.

---

## Q4 — Street View OSINT: Where Is This?
**5 marks**

### The scenario, verbatim
> 🌍 **Where in the world is this?** You've been given **one** Street View image below. Using
> only publicly available information (visual clues, reverse image search, road signs,
> architecture, vegetation, language on signage, etc.), identify exactly where it was taken.
>
> Enter your answer as **4 comma-separated values, in this order**: `Place, Country, Latitude,
> Longitude`. Each of the 4 values is graded independently and worth **25% of this question**.

### Grading mechanics (worth knowing exactly)
- Place/country matching ignores case, spacing, and punctuation, but write the **full** name
  ("United States", not "USA").
- **Latitude/longitude must match to exactly 4 decimal places — no tolerance** (≈11 metres). A
  hemisphere letter (`94.5583 W`) is accepted instead of a minus sign.
- Checked instantly, client-side, via a one-way hash comparison against a hash delivered with
  your assignment — the correct value can't be read off the network. The real submission is
  independently re-verified server-side the same way.

### A workable order of attack
1. **Narrow the hemisphere and region fast.** Driving side of the road, vegetation and sun angle
   (shadows south → northern hemisphere), road-marking colours (yellow vs white centre lines).
2. **Read the text.** Signage language/script is the strongest single clue — even a partial
   business name helps, and diacritics narrow things further (`ă/ș/ț` → Romanian, `ő/ű` →
   Hungarian).
3. **Use infrastructure fingerprints.** Licence-plate shape/colour, utility-pole material
   (concrete/wood/lattice), bollard and road-sign shapes (national standards), architecture and
   roofing material.
4. **Pin it down.** Reverse image search, cross-reference any legible name with your best-guess
   region, then read exact coordinates off the matched map location.

### Practical advice
Always submit all 4 fields even when unsure — a correct country alone is real, free credit
(25%). Given the zero-tolerance grading, aim for the *exact* capture point, not just the town.

---

## Q5 — Secret Handshake: Prove You Collaborated
**5 marks**

### The scenario, verbatim
> Shake hands with **N classmates** (N shown on your exam page). A handshake takes two codes,
> and each of you can only compute one of them — so you cannot do this alone, and a code copied
> from a group chat will never work for you.
>
> 1. Pick a classmate. Run `code("c", their_email)` and send them the result — your
>    **challenge**.
> 2. They run `code("r", your_challenge)` with *their* key and send it back — the **response**.
>    Only they can produce it.
> 3. Save the row, then do the same for them so you both get credit.
> 4. Repeat until you have N different classmates.

### The exact recipe
HMAC-SHA256, keep the first `tagLength` characters (almost always 16) of the lowercase hex
digest. Key and message are both plain UTF-8 text — **do not hex-decode the key**. Emails are
lowercased and trimmed. Separator is a single `|` with no spaces:
`challenge = code("c", their_email)`, `response = code("r", their_challenge)`.

```python
import hmac, hashlib
def code(tag, message, key):
    return hmac.new(key.encode(), f"{tag}|{message}".encode(), hashlib.sha256).hexdigest()[:16]
```

### Submission format
```json
[{"peer":"classmate1@ds.study.iitm.ac.in","challenge":"...","response":"..."}]
```
Partial work counts — submit whatever rows you have. Marks scale with verified classmates (N for
full marks); each classmate counts once; you cannot shake your own hand. If a row fails, the
feedback names which half was wrong — a bad challenge is yours to fix, a bad response is theirs.

---

## Q6 — Donate Your Marks
**0.2 marks (of up to 1.5)**

### The scenario, verbatim
> This is a small experiment in **trust and collaboration**, worth up to **1.5 marks**. You can
> **donate your marks to up to 3 classmates**. You cannot pick yourself, and every email must be
> a valid `@*.study.iitm.ac.in` address.
>
> **How the marks work** — you *receive* whatever others choose to donate to you:
>
> | You pick… | Each person you pick gets |
> |---|---|
> | 1 person | **1.0** mark |
> | 2 people | **0.6** each |
> | 3 people | **0.5** each |
>
> Submitting a valid answer (1–3 valid emails, not yourself) earns you **0.2 marks** just for
> taking part.
>
> **You are welcome to barter.** A mutual pair: **1.0 each**. A mutual group of 3: **1.2 each**.
> A mutual group of 4: **1.5 each** — the maximum. To earn the most, collaborate as widely as
> you can… but of course, *that requires trust*. They have to put your name down too. Will they?
>
> Record your donations in the Google Form (private there until the public reveal).

### The game theory in one line
Because payoff is reciprocal, the optimal outcome for everyone involved is a **mutual group of
exactly 4** donating to each other (1.5 each, the maximum) — but that requires 4 people to
genuinely trust each other to reciprocate. Smaller mutual groups are safer bets with a lower
ceiling (1.0 for a pair, 1.2 for a trio).

---

## Q7 — Donate Your Marks: Tell Them Why (Audio)
**0.2 marks now, up to 2 later**

### The scenario, verbatim
> 🎙️ **Tell them *why* — in your own voice.** Record a short audio in which you name the
> collaborators you donated your marks to (their names and email IDs) and explain why you chose
> each of them. The person you donated to will hear this — and an AI, *speaking as that
> person*, will judge whether it sounds genuine.
>
> ⚠️ **Relative grading, judged offline.** A generic, AI-sounding "you're a great teammate"
> scores like every other generic answer — which is low. Be specific about *why*.
>
> ⚠️ **This recording will be shared publicly.**

### What the live Check button verifies (and what it doesn't)
Only that your URL is reachable, CORS-enabled, and returns `Content-Type: audio/*`. Passing that
check is **not** the mark — it just confirms your link works. The actual content is judged
later, offline.

### Hosting requirements (all must hold)
- Public — no login, no signed URL that expires.
- **Direct link to the audio file itself** (`.mp3`/`.m4a`/`.webm`/`.wav`), not a player page — a
  Google Drive share page or Dropbox preview link will fail this.
- Returns `Content-Type: audio/*` with `Access-Control-Allow-Origin: *`.
- Stays live **at least 1 week after the ROE**.

A GitHub release asset or a GitHub Pages-hosted file satisfies all of this with no extra setup.

### What actually scores well
Full name **and** email ID for each person, one concrete and checkable reason each ("Priya
rewrote my DuckDB join in week 6 when I had the group-by wrong" beats "Priya is helpful" by a
wide margin), spoken naturally rather than read from a script.

---

## Q8 — Something You Did On Your Own Initiative (Audio)
**0.2 marks**

### The scenario, verbatim
> 🎙️ *"Tell me about something you did on your own initiative"* — the classic interview
> question. Record a short voice answer (**at most 120 seconds**) about a task you did because
> you chose to — nobody assigned it, asked for it, or required it. Then, in the same recording,
> explain how an agent with only internet access could verify (a) that this really happened,
> and (b) that it was genuinely self-initiated.

### The recording needs three things
1. The story, plus **one specific public artifact** an agent can look up — say the exact URL,
   name, or ID **out loud**, spelling it if unusual.
2. Why it was initiative and not an assignment (contrast with what was actually required, or a
   timestamp predating any related deadline).
3. Hosted publicly per the same rules as Q7 (CORS, `audio/*`, live 1+ week).

### What counts as a good artifact
A dated GitHub repo/commit/issue/PR, a dated blog/forum/Stack Overflow post, a published package
or live demo, a hackathon entry or leaderboard placement, a video/talk with a visible publish
date.

> "Vague claims with nothing an agent can look up ('I read a book on weekends') will score low,
> even if true — the whole point is *verifiability*."

### Grading
Two stages, both offline: (1) how clearly you articulated a verification method, (2) whether
that verification **actually succeeds** when the agent runs it. Optimise for checkability, not
for how impressive the story sounds — a small project with a real, dated, findable artifact
beats an ambitious one with nothing to point at.

---

## Q9 — The Unusual Useful Essay
**0.2 marks (+ relative bonus)**

### The scenario, verbatim
> Everyone writes about the same idea. Your task is to express it in a way that nobody else
> does.
>
> Write a **110–150 word** piece answering this shared topic:
> > **"Which human skills will matter most in the AI era, and why?"**
>
> **Marks are decided later.** Meeting the word-count and format constraints earns 0.2 marks.
> After the ROE, your writing is compared to other students' via semantic embeddings: the
> distance from your five closest fellow-student responses, minus the distance from the shared
> topic. **Similarity to another answer loses marks.**
>
> ⚠️ This essay becomes public course material.

### Why an AI-generated essay backfires here
Because the metric is *distance from your five nearest classmates*, any tool generating this
essay would produce near-identical text for everyone who used it — those students would become
each other's five nearest neighbours and **all** score near zero on the part that actually
carries marks. A generic, polished, AI-sounding essay is the single worst outcome under this
specific scoring rule.

### What tends to score well
- **An unusual vantage point** — write as a specific person in a specific moment (a
  radiographer double-checking a model's read, a farmer reading a yield forecast) rather than
  giving a general opinion.
- **One concrete anchor** — a single specific scene, dataset, tool, or number beats three
  abstract virtues.
- **A different shape** — a letter, field notes, an incident postmortem, a dialogue. Form alone
  is one of the cheapest ways to be distant from the pack.
- **Avoiding the obvious vocabulary** — "adaptability", "human touch", "irreplaceable", "in an
  ever-changing world" are exactly what the cluster of similar essays will be built from.
- **Answering the "why" with a mechanism**, not an adjective.
