// Pure maths for the P1 "Predict AI Pipe usage" question: reading the public usage feed, turning it into a
// probability for each of the market's cost ranges, and pricing trades under the market's LMSR rule.
// Nothing here touches the network, the DOM or any credential, so it runs unchanged in Node (check.mjs).

/* ------------------------------ cost ranges ------------------------------ */

// Lower limits in US dollars. The question names 17 ranges (0–1¢, 1–2¢, 2–5¢ … $500–$1,000, $1,000 or more);
// this 1-2-5 ladder is the one that fits that description. The market's own labels always win, so the tool
// lets the student overwrite these limits.
export const DEFAULT_LIMITS = [0, 0.01, 0.02, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];

function dollars(value) {
  if (value >= 1) return `$${Number.isInteger(value) ? value.toLocaleString('en-US') : value}`;
  return `${Math.round(value * 100)}¢`;
}

export function buildRanges(limits = DEFAULT_LIMITS) {
  return limits.map((lo, index) => {
    const hi = index + 1 < limits.length ? limits[index + 1] : Infinity;
    return { index, lo, hi, label: hi === Infinity ? `${dollars(lo)} or more` : `${dollars(lo)}–${dollars(hi)}` };
  });
}

/** Parses "0, 0.01, 0.02, …" (or an array) into a strictly increasing list starting at 0. */
export function parseLimits(input) {
  const list = Array.isArray(input) ? input : String(input ?? '').split(/[\s,;]+/).filter(Boolean);
  const numbers = list.map(Number);
  if (numbers.length < 2 || numbers.some((n) => !Number.isFinite(n) || n < 0)) return { ok: false, message: 'Give at least two non-negative numbers, such as 0, 0.01, 0.02, 0.05 …' };
  if (numbers[0] !== 0) return { ok: false, message: 'The first limit must be 0.' };
  for (let i = 1; i < numbers.length; i += 1) {
    if (!(numbers[i] > numbers[i - 1])) return { ok: false, message: 'The limits must be strictly increasing.' };
  }
  return { ok: true, limits: numbers };
}

/** Each range includes its lower limit and excludes its upper limit; the total is never rounded first. */
export function rangeIndex(totalUsd, limits = DEFAULT_LIMITS) {
  if (!Number.isFinite(totalUsd) || totalUsd < 0) return -1;
  let found = 0;
  for (let i = 0; i < limits.length; i += 1) {
    if (totalUsd >= limits[i]) found = i;
  }
  return found;
}

/* ------------------------------ the feed ------------------------------ */

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates a pasted or fetched feed. A day counts as usable only when it is complete, available and has a finite,
 * non-negative `total.spend_usd`; a missing or unavailable day is reported, never treated as zero.
 */
export function parseFeed(input) {
  let feed = input;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return { ok: false, errors: ['Paste the JSON from https://stats.aipipe.org/usage.json first.'] };
    try {
      feed = JSON.parse(trimmed);
    } catch (error) {
      return { ok: false, errors: [`That is not valid JSON (${error.message}). Copy the whole page at https://stats.aipipe.org/usage.json.`] };
    }
  }
  if (!feed || typeof feed !== 'object' || !Array.isArray(feed.days)) {
    return { ok: false, errors: ['The feed must be an object with a "days" list. Copy the whole page from https://stats.aipipe.org/usage.json.'] };
  }
  if (feed.days.length > 400) return { ok: false, errors: ['The feed has far more days than expected; refusing to use it.'] };

  const warnings = [];
  const seen = new Map();
  for (const [position, day] of feed.days.entries()) {
    if (!day || typeof day !== 'object' || !DATE.test(String(day.date))) {
      warnings.push(`Day #${position + 1} has no valid date and was ignored.`);
      continue;
    }
    if (seen.has(day.date)) warnings.push(`${day.date} appears twice; the later entry was used.`);
    const spend = day.total?.spend_usd;
    const numeric = typeof spend === 'number' && Number.isFinite(spend) && spend >= 0;
    seen.set(day.date, {
      date: day.date,
      complete: day.complete === true,
      available: day.available !== false,
      spend: numeric ? spend : null,
      usable: day.complete === true && day.available !== false && numeric,
    });
    if (day.complete === true && day.available !== false && !numeric) warnings.push(`${day.date} is marked complete but has no valid total.spend_usd, so it was not used.`);
  }
  const days = [...seen.values()].sort((a, b) => a.date.localeCompare(b.date));
  for (const day of days) {
    if (!day.usable && !day.complete) warnings.push(`${day.date} is not a completed day, so it is left out (an incomplete day is not a cost of zero).`);
    else if (!day.usable && !day.available) warnings.push(`${day.date} is unavailable in the feed, so it is left out (missing is not zero).`);
  }
  if (days.length === 0) return { ok: false, errors: ['The feed contains no usable days.'] };
  return {
    ok: true,
    feed: {
      days,
      publishedAt: typeof feed.published_at === 'string' ? feed.published_at : '',
      collectionStartedOn: typeof feed.collection_started_on === 'string' ? feed.collection_started_on : '',
    },
    warnings,
    errors: [],
  };
}

/** A short fingerprint of what the feed currently says, to tell a genuinely new report from a refreshed copy. */
export function reportFingerprint(feed) {
  const usable = feed.days.filter((d) => d.usable);
  const total = usable.reduce((sum, d) => sum + d.spend, 0);
  return `${feed.publishedAt || 'unknown'}|${usable.length}|${total.toFixed(6)}`;
}

export function compareReports(previous, current) {
  if (!previous) return { different: true, reason: 'No earlier report was recorded.' };
  if (previous === current) return { different: false, reason: 'Same report as your last prediction — refreshing it does not count as new evidence.' };
  const [previousAt, previousDays, previousTotal] = previous.split('|');
  const [currentAt, currentDays, currentTotal] = current.split('|');
  if (previousDays === currentDays && previousTotal === currentTotal) return { different: false, reason: 'The numbers are unchanged; only the publication time moved.' };
  return { different: true, reason: `New evidence: ${currentDays} usable days totalling $${Number(currentTotal).toFixed(2)} (was ${previousDays} days, $${Number(previousTotal).toFixed(2)}).` };
}

/* ------------------------------ statistics ------------------------------ */

const sum = (values) => values.reduce((a, b) => a + b, 0);
const mean = (values) => (values.length ? sum(values) / values.length : NaN);
const sorted = (values) => [...values].sort((a, b) => a - b);

function quantileSorted(list, q) {
  if (!list.length) return NaN;
  const position = (list.length - 1) * q;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return list[lower] + (list[upper] - list[lower]) * (position - lower);
}

export function summarize(feed) {
  const values = feed.days.filter((d) => d.usable).map((d) => d.spend);
  const ordered = sorted(values);
  const avg = mean(values);
  const variance = values.length > 1 ? sum(values.map((v) => (v - avg) ** 2)) / (values.length - 1) : NaN;
  const sd = Math.sqrt(variance);
  const trim = ordered.length >= 5 ? ordered.slice(1, -1) : ordered;
  return {
    count: values.length,
    values,
    mean: avg,
    median: quantileSorted(ordered, 0.5),
    trimmedMean: mean(trim),
    sd,
    cv: avg > 0 ? sd / avg : NaN,
    min: ordered[0],
    max: ordered[ordered.length - 1],
    lastThreeMean: mean(values.slice(-3)),
    weekly: { mean: avg * 7, median: quantileSorted(ordered, 0.5) * 7, trimmed: mean(trim) * 7 },
  };
}

/* ------------------------------ forecasting ------------------------------ */

// mulberry32: a tiny seeded generator, so the same feed and settings always give the same table.
export function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(random) {
  let u = 0;
  while (u === 0) u = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
}

export function hashSeed(text) {
  let h = 2166136261;
  for (const ch of String(text)) {
    h ^= ch.codePointAt(0);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

/**
 * Week-total probability for every range. Each simulated week resamples days (with replacement) from the usable
 * history, then multiplies the whole week by one lognormal factor (mean 1) that stands for demand shifting — deadlines,
 * weekends, new models. `known` is the sum of target days that are already complete; only the rest are simulated.
 */
export function forecastWeek(dailySpend, { daysToSimulate = 7, known = 0, scale = 1, sigma = 0.5, samples = 20000, seed = 1, limits = DEFAULT_LIMITS } = {}) {
  const history = dailySpend.filter((v) => Number.isFinite(v) && v >= 0);
  const ranges = buildRanges(limits);
  if (history.length === 0) return { ok: false, message: 'There are no completed days to learn from yet.' };
  if (!(daysToSimulate >= 0 && daysToSimulate <= 7)) return { ok: false, message: 'Days to simulate must be between 0 and 7.' };
  if (!(scale > 0) || !Number.isFinite(scale)) return { ok: false, message: 'The scale factor must be a positive number.' };
  if (!(sigma >= 0) || !Number.isFinite(sigma)) return { ok: false, message: 'The uncertainty must be zero or more.' };

  const random = seededRandom(seed);
  const counts = new Array(ranges.length).fill(0);
  const totals = new Array(samples);
  for (let s = 0; s < samples; s += 1) {
    let week = 0;
    for (let d = 0; d < daysToSimulate; d += 1) week += history[Math.floor(random() * history.length)];
    const shift = sigma > 0 ? Math.exp(sigma * normal(random) - (sigma * sigma) / 2) : 1;
    const total = known + week * scale * shift;
    totals[s] = total;
    counts[rangeIndex(total, limits)] += 1;
  }
  const ordered = sorted(totals);
  // A tiny floor keeps a range from being declared impossible just because 20,000 draws missed it.
  const floor = 0.5 / samples;
  const raw = counts.map((c) => c / samples + floor);
  const norm = sum(raw);
  const probs = raw.map((p) => p / norm);
  const rank = probs.map((p, index) => ({ index, p })).sort((a, b) => b.p - a.p);
  return {
    ok: true,
    ranges,
    probs,
    best: rank[0],
    second: rank[1],
    mean: mean(totals),
    quantiles: { p05: quantileSorted(ordered, 0.05), p25: quantileSorted(ordered, 0.25), p50: quantileSorted(ordered, 0.5), p75: quantileSorted(ordered, 0.75), p95: quantileSorted(ordered, 0.95) },
    // How decided the call is: a top range under 50% (or a runner-up within 15 points) means "close call".
    closeCall: rank[0].p < 0.5 || rank[0].p - rank[1].p < 0.15,
  };
}

/** Splits the feed into target-week days (already complete) and the history used to simulate the rest. */
export function planTargetWeek(feed, { targetStart = '2026-11-02', targetEnd = '2026-11-08' } = {}) {
  const inTarget = feed.days.filter((d) => d.date >= targetStart && d.date <= targetEnd);
  const knownDays = inTarget.filter((d) => d.usable);
  const history = feed.days.filter((d) => d.usable && !(d.date >= targetStart && d.date <= targetEnd));
  const missing = 7 - knownDays.length;
  return {
    known: sum(knownDays.map((d) => d.spend)),
    knownCount: knownDays.length,
    daysToSimulate: missing,
    history: (history.length ? history : feed.days.filter((d) => d.usable)).map((d) => d.spend),
    usingTargetDaysAsHistory: history.length === 0,
  };
}

/* ------------------------------ the written reason ------------------------------ */

export const REASON_MIN_WORDS = 3;
export const REASON_MIN_CHARS = 15;
export const REASON_MAX_CHARS = 1000;

export function validateReason(text) {
  const trimmed = String(text ?? '').trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  if (words < REASON_MIN_WORDS || trimmed.length < REASON_MIN_CHARS) return { ok: false, message: `Write at least ${REASON_MIN_WORDS} words and ${REASON_MIN_CHARS} characters (yours has ${words} words, ${trimmed.length} characters).` };
  if (trimmed.length > REASON_MAX_CHARS) return { ok: false, message: `Shorten the reason to ${REASON_MAX_CHARS} characters or fewer (it has ${trimmed.length}).` };
  return { ok: true, words, chars: trimmed.length };
}

const usd = (value) => (value >= 100 ? `$${value.toFixed(0)}` : `$${value.toFixed(2)}`);

/** A first draft the student should edit in their own words. Always within the 1,000-character limit. */
export function draftReason({ summary, forecast, choice, planned, previousChoice = '', newEvidence = '' }) {
  const days = summary.count;
  const parts = [];
  if (previousChoice && previousChoice !== choice.label) parts.push(`I am changing my prediction from ${previousChoice} to ${choice.label}.`);
  if (newEvidence) parts.push(newEvidence);
  parts.push(`I used the ${days} completed UTC days in the public AI Pipe usage feed (daily spend ${usd(summary.min)} to ${usd(summary.max)}, mean ${usd(summary.mean)}, median ${usd(summary.median)}).`);
  if (planned && planned.knownCount > 0) parts.push(`${planned.knownCount} target days are already complete, totalling ${usd(planned.known)}, and I simulated the remaining ${planned.daysToSimulate}.`);
  else parts.push('I resampled those days to simulate the seven target days, 2–8 November, and added a demand-shift uncertainty because the history is short.');
  parts.push(`The simulation puts the total between ${usd(forecast.quantiles.p05)} and ${usd(forecast.quantiles.p95)} (median ${usd(forecast.quantiles.p50)}), which makes ${choice.label} the most likely range at about ${Math.round(forecast.probs[choice.index] * 100)}%.`);
  if (forecast.closeCall) parts.push('It is a close call: a small change in daily spend could move the total into a neighbouring range, so I will revisit it when a new report is published.');
  parts.push('Feed gaps are not treated as zero.');
  let text = parts.join(' ');
  if (text.length > REASON_MAX_CHARS) text = `${text.slice(0, REASON_MAX_CHARS - 1).replace(/\s+\S*$/, '')}…`;
  return text;
}

/* ------------------------------ LMSR (the market maker) ------------------------------ */

// For a buy of `delta` shares of one range priced at `p` (all other ranges untouched), the LMSR gives closed forms:
//   cost  = b · ln(1 + p · (e^(delta/b) − 1))        price afterwards = p · e^(delta/b) / (1 + p · (e^(delta/b) − 1))
// where b is the liquidity parameter. A fresh market with 17 ranges has p = 1/17 for every range.

export function lmsrPrices(quantities, b) {
  const max = Math.max(...quantities);
  const exps = quantities.map((q) => Math.exp((q - max) / b));
  const total = sum(exps);
  return exps.map((e) => e / total);
}

export function lmsrCost(quantities, b) {
  const max = Math.max(...quantities);
  return max + b * Math.log(sum(quantities.map((q) => Math.exp((q - max) / b))));
}

function checkTrade(p, b) {
  if (!(p > 0 && p < 1)) return 'The price must be between 0 and 1 (credits per share).';
  if (!(b > 0) || !Number.isFinite(b)) return 'The liquidity parameter b must be a positive number.';
  return '';
}

export function costToBuy(p, shares, b) {
  const error = checkTrade(p, b);
  if (error) return { ok: false, message: error };
  if (!(shares >= 0) || !Number.isFinite(shares)) return { ok: false, message: 'Shares must be zero or more.' };
  const growth = Math.expm1(shares / b);
  return { ok: true, cost: b * Math.log1p(p * growth), priceAfter: (p * Math.exp(shares / b)) / (1 + p * growth) };
}

/** Shares a given budget (credits) buys. */
export function sharesForBudget(p, budget, b) {
  const error = checkTrade(p, b);
  if (error) return { ok: false, message: error };
  if (!(budget >= 0) || !Number.isFinite(budget)) return { ok: false, message: 'The budget must be zero or more.' };
  const shares = b * Math.log1p(Math.expm1(budget / b) / p);
  const after = costToBuy(p, shares, b);
  return { ok: true, shares, priceAfter: after.priceAfter, averagePrice: shares > 0 ? budget / shares : p };
}

/** The market limits one trade to a 15-percentage-point move in any range's chance. */
export function exceedsMoveCap(p, priceAfter, capPoints = 15) {
  return (priceAfter - p) * 100 > capPoints + 1e-9;
}

/** Recovers b from one quote the market showed you (price p, `shares` bought for `quotedCost` credits). */
export function estimateB(p, shares, quotedCost) {
  if (!(p > 0 && p < 1) || !(shares > 0) || !(quotedCost > 0)) return { ok: false, message: 'Enter a price between 0 and 1, a positive share count and a positive cost.' };
  const floor = p * shares;
  if (!(quotedCost > floor + 1e-12) || !(quotedCost < shares - 1e-12)) {
    return { ok: false, message: `For these numbers the cost must be between ${floor.toFixed(4)} (price × shares) and ${shares} (one credit per share). Re-check the quote.` };
  }
  let lo = 1e-6;
  let hi = 1e9;
  for (let i = 0; i < 200; i += 1) {
    const mid = Math.sqrt(lo * hi);
    if (costToBuy(p, shares, mid).cost > quotedCost) lo = mid; else hi = mid;
  }
  return { ok: true, b: Math.sqrt(lo * hi) };
}

/** Expected credits per share if your own probability is `belief` and the market charges `price`. */
export function expectedValuePerShare(belief, price) {
  return belief - price;
}
