// Live session times for the two GA4 games. The games site publishes its schedule (open to browsers), so the guides read
// it at run time and fall back to the fixed times they ship with if the site cannot be reached or the reply looks wrong.
// Nothing about the student is sent: it is one anonymous GET of a public schedule.

export const GAMES_ORIGIN = 'https://tds-network-games.sanand.workers.dev';

export function isRealBrowser() {
  return typeof navigator !== 'undefined' && typeof window !== 'undefined' && /^Mozilla\//.test(String(navigator.userAgent || ''));
}

/** "Tue 10 Nov, 6:00 pm IST" for any instant, whatever the viewer's time zone. */
export function labelIst(ms) {
  return `${new Date(ms).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true })} IST`;
}

/** Keeps the usable sessions of one exam from a schedule reply: not cancelled, a real start time, sorted, no duplicates. */
export function normalizeSchedule(json, exam) {
  const list = Array.isArray(json?.sessions) ? json.sessions : [];
  const seen = new Set();
  const out = [];
  for (const s of list) {
    if (!s || typeof s !== 'object' || s.status === 'cancelled') continue;
    if (exam && s.exam !== exam) continue;
    const startsAt = Number(s.starts_at);
    if (!Number.isFinite(startsAt) || startsAt < Date.parse('2026-01-01T00:00:00Z') || startsAt > Date.parse('2030-01-01T00:00:00Z') || seen.has(startsAt)) continue;
    seen.add(startsAt);
    const endsAt = Number(s.ends_at);
    out.push({ startsAt, endsAt: Number.isFinite(endsAt) && endsAt > startsAt ? endsAt : null, label: labelIst(startsAt) });
  }
  return out.sort((a, b) => a.startsAt - b.startsAt);
}

/** `fallback` is returned unchanged whenever the live schedule is unreachable or empty. Never throws. */
export async function loadSessions({ game, exam, fallback, fetchImpl = globalThis.fetch, timeoutMs = 4000 } = {}) {
  if (typeof fetchImpl !== 'function') return { sessions: fallback, live: false };
  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetchImpl(`${GAMES_ORIGIN}/realtime/api/schedule?game=${encodeURIComponent(game)}`, { cache: 'no-store', credentials: 'omit', signal: controller?.signal });
    if (!response?.ok) return { sessions: fallback, live: false };
    const sessions = normalizeSchedule(await response.json(), exam);
    return sessions.length ? { sessions, live: true } : { sessions: fallback, live: false };
  } catch {
    return { sessions: fallback, live: false };
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/** Where the sessions stand at `now`: 'live', 'before' (with the next one) or 'over'. */
export function sessionClock(sessions, now, lengthMs, graceMs = 60000) {
  const live = sessions.find((s) => now >= s.startsAt && now <= (s.endsAt ?? s.startsAt + lengthMs) + graceMs);
  if (live) return { state: 'live', session: live };
  const next = sessions.find((s) => s.startsAt > now);
  return next ? { state: 'before', session: next } : { state: 'over', session: null };
}
