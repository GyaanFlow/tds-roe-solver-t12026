import { escapeHtml } from './utils.js';

export const id = 'q-llm-yes-no-split';
export const title = 'Q12: One Prompt, Two Models, Two Answers';

// Constants mirror the official exam bundle (exam-tds-2026-09-ga1.js).
export const PROMPT_LIMIT = 100;
export const MODEL_YES = 'gpt-5.6-luna';
export const MODEL_NO = 'gpt-5.4-mini';
export const AI_PIPE_URL = 'https://aipipe.org/openai/v1/chat/completions';

const ONE_WORD = 'Reply with exactly one word: Yes or No.';

// Prompts that passed every live run (2026-10-13, via AI Pipe) and nothing else.
// The exam sends the same prompt to both models with no system prompt. Asking a model about its
// own name does not work (neither model knows "gpt-5.6-luna": both answered No), but exact
// arithmetic does: gpt-5.6-luna multiplies four-digit numbers exactly, while gpt-5.4-mini is
// off by roughly 0.01-0.2% every time. Each prompt states a TRUE fact about products (their
// digit sums, or a sum of products), so luna confirms it (Yes) and mini's wrong product does not
// match (No). `tested` is "runs passed/runs" with both models answering correctly in the same
// run; only prompts that passed every run are listed, most-tested first.
const ASK = 'Reply with exactly one word: Yes or No.';
const ASK_SHORT = 'One word: Yes or No.';
export const CANDIDATES = [
  { category: 'Digit sum · 8191×9973', prompt: `Is the digit sum of 8191*9973 equal to 46? ${ASK}`, tested: '19/19', why: "Needs the exact product; mini's product has a different digit sum." },
  { category: 'Digit sum · 7523×9461', prompt: `Is the digit sum of 7523*9461 equal to 25? ${ASK}`, tested: '19/19', why: 'Same idea with a different pair, in case one pair behaves differently later.' },
  { category: 'Three products added', prompt: `Is 7919*6271 + 8191*9973 + 4567*8923 equal to 172100233? ${ASK}`, tested: '19/19', why: "Three exact products and their sum: mini's errors compound and it rejects the total." },
  { category: 'Digit sum · 8221×7507', prompt: `Is the digit sum of 8221*7507 equal to 31? ${ASK}`, tested: '14/14', why: 'Fresh numbers, same mechanism.' },
  { category: 'Two products · 8803×7001', prompt: `Is 8803*7001 + 7129*9619 equal to 130203654? ${ASK}`, tested: '14/14', why: 'Sum of two exact products.' },
  { category: 'Two products · 8387×7243', prompt: `Is 8387*7243 + 6673*9391 equal to 123413184? ${ASK}`, tested: '14/14', why: 'Sum of two exact products with other numbers.' },
  { category: 'Two digit sums · set A', prompt: `Are the digit sums of 8191*9973 and 7523*9461 equal to 46 and 25? ${ASK_SHORT}`, tested: '8/8', why: "Both digit sums must match, so a lucky match by mini is far less likely." },
  { category: 'Two digit sums · set B', prompt: `Are the digit sums of 4567*8923 and 6841*7253 equal to 25 and 44? ${ASK_SHORT}`, tested: '8/8', why: 'Two products checked at once.' },
  { category: 'Two digit sums · set C', prompt: `Are the digit sums of 8387*7243 and 6673*9391 equal to 29 and 34? ${ASK_SHORT}`, tested: '8/8', why: 'Two products checked at once.' },
  { category: 'Two digit sums · set D', prompt: `Are the digit sums of 8803*7001 and 7129*9619 equal to 35 and 43? ${ASK_SHORT}`, tested: '8/8', why: 'Two products checked at once.' },
  { category: 'Three products · set E', prompt: `Is 8191*9973 + 7523*9461 + 8221*7507 equal to 214578993? ${ASK_SHORT}`, tested: '8/8', why: 'Three-term sum with the short output rule.' },
  { category: 'Three products · set F', prompt: `Is 8053*7699 + 4567*8923 + 6841*7253 equal to 152369161? ${ASK_SHORT}`, tested: '8/8', why: 'Three-term sum with the short output rule.' },
];

// Same word-boundary, case-sensitive test the exam uses.
export const hasWord = (text, word) => new RegExp(`\\b${word}\\b`).test(String(text));

export function judgeReplies(yesReply, noReply) {
  const yesOk = hasWord(yesReply, 'Yes') && !hasWord(yesReply, 'No');
  const noOk = hasWord(noReply, 'No') && !hasWord(noReply, 'Yes');
  return { yesOk, noOk, pass: yesOk && noOk };
}

export function validatePrompt(raw) {
  const prompt = String(raw ?? '').trim();
  if (!prompt) return { ok: false, message: 'Enter a prompt.' };
  if (prompt.length > PROMPT_LIMIT) return { ok: false, message: `Prompt is ${prompt.length} characters; the limit is ${PROMPT_LIMIT}.` };
  return { ok: true, prompt };
}

export class AiPipeError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'AiPipeError';
    this.code = code;
  }
}

// One chat completion through AI Pipe. The token is only ever sent to aipipe.org.
export async function askModel({ model, prompt, token, fetchImpl = globalThis.fetch, timeoutMs = 45000 }) {
  if (typeof fetchImpl !== 'function') throw new AiPipeError('NO_FETCH', 'This browser cannot make network requests.');
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  let response;
  try {
    response = await fetchImpl(AI_PIPE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ model, messages: [{ role: 'user', content: prompt }] }),
      signal: controller?.signal,
    });
  } catch (error) {
    throw new AiPipeError('NETWORK', error?.name === 'AbortError' ? `${model} did not answer within ${timeoutMs / 1000}s.` : `Could not reach AI Pipe (${error?.message || 'network error'}).`);
  } finally {
    if (timer) clearTimeout(timer);
  }
  if (response.status === 401 || response.status === 403) throw new AiPipeError('AUTH', 'AI Pipe rejected the token. Paste a fresh token from aipipe.org.');
  if (response.status === 402 || response.status === 429) throw new AiPipeError('LIMIT', 'AI Pipe says the token is out of budget or rate-limited. Wait a bit or use a fresh token.');
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new AiPipeError(`HTTP_${response.status}`, `${model} returned no text (${String(data?.error?.message || data?.error || `HTTP ${response.status}`).slice(0, 120)}).`);
  }
  return content;
}

// Runs every prompt `trials` times against both models and ranks them by pass rate. LLM output
// varies between runs, so a prompt only counts as robust when it passes every trial.
export async function testCandidates({ token, prompts, trials = 2, concurrency = 4, fetchImpl, onProgress } = {}) {
  const cleanToken = String(token ?? '').trim();
  if (!cleanToken) throw new AiPipeError('NO_TOKEN', 'Paste your aipipe.org token first.');
  const results = prompts.map((prompt) => ({ prompt, trials: [], passes: 0, errors: 0 }));
  const jobs = [];
  for (let trial = 0; trial < trials; trial += 1) {
    results.forEach((entry) => jobs.push(entry));
  }
  let next = 0;
  let done = 0;
  let fatal = null;
  async function worker() {
    while (!fatal) {
      const index = next;
      next += 1;
      if (index >= jobs.length) return;
      const entry = jobs[index];
      try {
        const [yesReply, noReply] = await Promise.all([
          askModel({ model: MODEL_YES, prompt: entry.prompt, token: cleanToken, fetchImpl }),
          askModel({ model: MODEL_NO, prompt: entry.prompt, token: cleanToken, fetchImpl }),
        ]);
        const verdict = judgeReplies(yesReply, noReply);
        entry.trials.push({ yesReply, noReply, ...verdict });
        if (verdict.pass) entry.passes += 1;
      } catch (error) {
        if (error instanceof AiPipeError && (error.code === 'AUTH' || error.code === 'LIMIT')) fatal = error;
        entry.errors += 1;
        entry.trials.push({ error: error?.message || String(error), pass: false });
      }
      done += 1;
      if (typeof onProgress === 'function') onProgress(done, jobs.length);
    }
  }
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, jobs.length)) }, worker));
  if (fatal) throw fatal;
  const ranked = results
    .map((entry) => ({ ...entry, rate: entry.passes / trials, robust: entry.passes === trials && trials > 0 }))
    .sort((a, b) => b.rate - a.rate || a.errors - b.errors);
  return { ranked, trials, best: ranked[0]?.rate > 0 ? ranked[0] : null };
}

function shorten(text, max = 70) {
  const flat = String(text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

export function resultsHtml(outcome) {
  const rows = outcome.ranked.map((entry, index) => {
    const sample = entry.trials.find((t) => !t.error) || entry.trials[0] || {};
    const verdict = entry.robust ? '✅ every trial' : entry.passes ? `⚠️ ${entry.passes}/${outcome.trials}` : entry.errors === outcome.trials ? '⛔ errors' : '❌ none';
    const replies = sample.error
      ? escapeHtml(shorten(sample.error))
      : `${MODEL_YES}: <b>${escapeHtml(shorten(sample.yesReply, 40))}</b><br>${MODEL_NO}: <b>${escapeHtml(shorten(sample.noReply, 40))}</b>`;
    const use = entry.passes
      ? `<button type="button" onclick="window._t3ga1q12Use(${index})" style="background:var(--theme-primary,#3b82f6);color:#000;border:none;border-radius:6px;padding:5px 10px;font-weight:700;font-size:12px;cursor:pointer;">Use</button>`
      : '';
    return `<tr><td style="padding:6px;border-top:1px solid var(--border,#2d4d80);vertical-align:top;">${escapeHtml(entry.prompt)}<br><small style="opacity:0.7;">${entry.prompt.length}/${PROMPT_LIMIT} chars</small></td><td style="padding:6px;border-top:1px solid var(--border,#2d4d80);vertical-align:top;font-size:12px;">${replies}</td><td style="padding:6px;border-top:1px solid var(--border,#2d4d80);vertical-align:top;white-space:nowrap;">${verdict}</td><td style="padding:6px;border-top:1px solid var(--border,#2d4d80);vertical-align:top;">${use}</td></tr>`;
  });
  return `<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:10px;"><thead><tr><th style="text-align:left;padding:6px;">Prompt</th><th style="text-align:left;padding:6px;">First replies</th><th style="text-align:left;padding:6px;">Result</th><th></th></tr></thead><tbody>${rows.join('')}</tbody></table>`;
}

function formHtml() {
  const field = 'width:100%;padding:9px 12px;border-radius:8px;border:1px solid var(--border,#2d4d80);background:var(--bg-input,#0b1220);color:var(--text-primary,#e6edf7);font-size:13px;box-sizing:border-box;';
  return [
    '<div id="t3q12Root" style="border:1px solid var(--border,#2d4d80);border-radius:14px;padding:18px;margin:14px 0;background:rgba(77,166,255,0.06);">',
    '<strong>🧪 Live prompt tester</strong>',
    '<p style="margin:6px 0 12px;font-size:13px;opacity:0.85;">Runs the listed prompts below (and your own, if you add one) against both exam models through AI Pipe, several times each, and ranks them. Your token stays in this browser tab, goes only to aipipe.org and is never saved.</p>',
    '<label style="font-size:12px;opacity:0.8;" for="t3q12Token">aipipe.org token</label>',
    `<input id="t3q12Token" type="password" autocomplete="off" spellcheck="false" placeholder="Paste a fresh token from aipipe.org" style="${field}margin-bottom:10px;" />`,
    '<label style="font-size:12px;opacity:0.8;" for="t3q12Custom">Your own prompt (optional)</label>',
    `<input id="t3q12Custom" type="text" maxlength="${PROMPT_LIMIT}" autocomplete="off" placeholder="Up to ${PROMPT_LIMIT} characters" style="${field}margin-bottom:10px;" />`,
    '<label style="font-size:12px;opacity:0.8;" for="t3q12Trials">Runs per prompt</label>',
    `<select id="t3q12Trials" style="${field}margin-bottom:12px;"><option value="1">1 run (fast)</option><option value="2" selected>2 runs (recommended)</option><option value="3">3 runs (most reliable)</option></select>`,
    '<button type="button" id="t3q12Go" onclick="window._t3ga1q12Test()" style="background:var(--theme-primary,#3b82f6);color:#000;border:none;border-radius:8px;padding:10px 18px;font-weight:700;font-size:13px;cursor:pointer;">▶ Test all prompts</button>',
    '<div id="t3q12Status" role="status" style="margin-top:10px;font-size:13px;min-height:18px;"></div>',
    '<div id="t3q12Results"></div>',
    '</div>',
  ].join('');
}

function candidateList() {
  return CANDIDATES.map((item, index) => `**${index + 1}. ${item.category}** (${item.prompt.length} chars, live-tested ${item.tested})\n\`\`\`text\n${item.prompt}\n\`\`\`\n*${item.why}*`).join('\n\n');
}

function buildGuide(recommended) {
  return `### 🎯 What you need
**One prompt of at most ${PROMPT_LIMIT} characters.** The same prompt goes to both models with no system prompt:
- \`${MODEL_YES}\` must reply with the word **Yes** and not **No**.
- \`${MODEL_NO}\` must reply with the word **No** and not **Yes**.
- The words are case-sensitive, and model output varies — so a prompt has to pass repeatedly, not once.

---

### 📋 Recommended prompt (${recommended.length}/${PROMPT_LIMIT} chars)
\`\`\`text
${recommended}
\`\`\`
**Why it works:** I called both real models through AI Pipe on 2026-10-13. Neither knows the name "gpt-5.6-luna" (asking "are you luna?" made both say No), so name tricks are unreliable. What does differ is arithmetic: \`${MODEL_YES}\` multiplies four-digit numbers exactly every time, while \`${MODEL_NO}\` is off by roughly 0.01–0.2%. These prompts state a **true** fact about a product, so the full model confirms it and the mini model's wrong product doesn't match.

> ✅ Live-tested: each prompt below passed on both models at once in every run (see the counts). LLM behaviour can change over time, so press **Check** in the exam once before submitting — or re-run the tester below.

---

### 🧪 Live prompt tester (re-checks everything with your own token)
${formHtml()}

---

### 🛡️ ${CANDIDATES.length} live-tested prompts (all under ${PROMPT_LIMIT} characters, every run passed)
${candidateList()}

---

### 🔧 If one ever stops passing
- Try the next prompt — they use different numbers, so a model that stumbles on one pair often passes another.
- A reply containing **both** words fails. Keep "Reply with exactly one word".
- Do not rely on name prompts. If a prompt fails once in the exam, the exam re-uses its cached replies for an identical prompt — change one character or use the next prompt to force a fresh run. In testing, "Reply No if your model name contains 'mini', otherwise Yes" passed only about 3 runs in 4, and "Are you gpt-5.6-luna?" never passed.
- Add your own wording in the tester's custom field — it is ranked next to the listed prompts.`;
}

function solvedResult(prompt, variant) {
  return {
    type: 'solved',
    answer: prompt,
    variant,
    guide: buildGuide(prompt),
    answerDisplay: `### Prompt (${prompt.length}/${PROMPT_LIMIT} characters)\n\n\`\`\`text\n${prompt}\n\`\`\`\n\n*Live-tested against both models — paste it into the exam's prompt box.*`,
  };
}

function registerQ12Interactive() {
  if (typeof window === 'undefined' || window._t3ga1q12Registered) return;
  window._t3ga1q12Registered = true;
  let last = null;

  window._t3ga1q12Test = async function t3ga1q12Test() {
    const token = document.getElementById('t3q12Token');
    const customInput = document.getElementById('t3q12Custom');
    const trialsInput = document.getElementById('t3q12Trials');
    const button = document.getElementById('t3q12Go');
    const status = document.getElementById('t3q12Status');
    const results = document.getElementById('t3q12Results');
    const show = (text, color) => {
      if (!status) return;
      status.style.color = color;
      status.textContent = text;
    };

    const prompts = CANDIDATES.map((item) => item.prompt);
    const custom = String(customInput?.value ?? '').trim();
    if (custom) {
      const checked = validatePrompt(custom);
      if (!checked.ok) {
        show(checked.message, '#e5484d');
        return;
      }
      prompts.unshift(checked.prompt);
    }
    const trials = Math.min(5, Math.max(1, Number(trialsInput?.value) || 2));
    if (button) button.disabled = true;
    if (results) results.innerHTML = '';
    try {
      const outcome = await testCandidates({
        token: token?.value,
        prompts,
        trials,
        onProgress: (done, total) => show(`Testing… ${done}/${total} runs finished`, '#4da6ff'),
      });
      last = outcome;
      if (results) results.innerHTML = resultsHtml(outcome);
      if (!outcome.best) show('No prompt passed on both models. Try your own wording in the custom field.', '#e5484d');
      else if (outcome.best.robust) show(`Best prompt passed all ${trials} run(s). Press “Use” to put it in the Answer box.`, '#198754');
      else show(`Best prompt passed ${outcome.best.passes}/${trials} runs — not fully reliable. Re-run or try your own wording.`, '#d97706');
    } catch (error) {
      show(error?.message || 'The test failed.', '#e5484d');
    } finally {
      if (button) button.disabled = false;
    }
  };

  window._t3ga1q12Use = function t3ga1q12Use(index) {
    const entry = last?.ranked?.[index];
    if (!entry || typeof window.tdsPatchAnswer !== 'function') return;
    const rate = `${entry.passes}/${last.trials} live runs passed`;
    window.tdsPatchAnswer(id, solvedResult(entry.prompt, `Live-tested prompt (${entry.prompt.length} chars, ${rate})`));
  };
}

export async function solve() {
  registerQ12Interactive();
  const best = CANDIDATES[0];
  return solvedResult(best.prompt, `Live-tested prompt (${best.prompt.length} chars, passed ${best.tested} runs) + ${CANDIDATES.length - 1} more + tester`);
}
