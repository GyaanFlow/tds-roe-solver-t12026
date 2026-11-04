// Reads the signed "face-review participation" receipt that the review app issues, and tells the student in plain words
// whether it is ready to paste into the exam. The server signs the receipt from the votes it recorded itself, so nothing
// here can create one; the exam server verifies the signature. This only catches copy mistakes and unfinished categories.
import { cleanReceipt, decodePart } from '../p1/receipt.js';

export const ISSUER = 'tds-network-games.sanand.workers.dev';
export const AUDIENCE = 'tds-exam';
export const PURPOSE = 'ga3-face-assessment-counts';
export const REVIEWED_EXAM = 'tds-2026-09-ga3';
export const CATEGORIES = [
  { id: 'q-3d-face-model', label: '3D faces (which resembles its photo more?)', short: '3D faces' },
  { id: 'q-face-morph-video', label: 'Morph videos (which is more convincing?)', short: 'Morph videos' },
  { id: 'q-face-morph-rank', label: 'Face pairs (which is easier to morph?)', short: 'Face pairs' },
];
export const REQUIRED_PER_CATEGORY = 8;
export const MAX_PER_CATEGORY = 32;

const B64URL = /^[A-Za-z0-9_-]+$/;
const sameEmail = (a, b) => String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

/**
 * @param raw the pasted text; opts.email the workspace email (the receipt must be for the same student); opts.now in ms.
 * Returns { ok, receipt, problems[], warnings[], categories[], issuedAt, expiresAt, subject }.
 */
export function checkFaceReceipt(raw, { email = '', now = Date.now() } = {}) {
  const receipt = cleanReceipt(raw);
  const out = { ok: false, receipt, problems: [], warnings: [], categories: [], issuedAt: null, expiresAt: null, subject: '' };
  if (!receipt) { out.problems.push('Paste the receipt first.'); return out; }
  if (receipt.length > 8000) { out.receipt = ''; out.problems.push('That is far too long to be a receipt. Copy only the receipt text.'); return out; }
  if (/^https?:/i.test(receipt)) { out.problems.push('That is a web link, not the receipt. In the review app open "Assessment receipt for GA3" and press "Generate & copy receipt".'); return out; }
  const parts = receipt.split('.');
  if (parts.length !== 3 || !parts.every((p) => p && B64URL.test(p))) {
    out.problems.push('A receipt is three blocks of letters and digits joined by two dots, and it starts with "eyJ". Copy it again from the review app.');
    return out;
  }
  const header = decodePart(parts[0]);
  const payload = decodePart(parts[1]);
  if (!header || !payload || typeof payload !== 'object') { out.problems.push('The receipt text is damaged (it cannot be read). Copy it again, taking all of it.'); return out; }
  if (header.alg !== 'ES256') out.problems.push('This does not look like a review-app receipt (it should be signed with ES256).');
  if (payload.purpose !== PURPOSE) out.problems.push('This receipt is for something else. You need the one from "Assessment receipt for GA3" in the face-review app.');
  if (payload.iss && payload.iss !== ISSUER) out.warnings.push('The issuer is not the usual face-review site.');
  if (payload.aud && payload.aud !== AUDIENCE) out.warnings.push('The audience is not the usual one for the exam.');
  if (payload.exam && payload.exam !== REVIEWED_EXAM) out.warnings.push('This receipt names a different exam than GA3.');
  out.subject = String(payload.sub ?? '').slice(0, 120);
  if (!out.subject) out.problems.push('The receipt has no student email in it.');
  else if (email && !sameEmail(out.subject, email)) out.problems.push(`This receipt belongs to ${out.subject}, not to ${email}. Each student must use their own receipt, signed in through their own exam page.`);
  const assessments = payload.assessments && typeof payload.assessments === 'object' ? payload.assessments : {};
  out.categories = CATEGORIES.map((c) => {
    const item = assessments[c.id];
    const count = Number.isFinite(Number(item?.count)) ? Math.max(0, Math.floor(Number(item.count))) : 0;
    const required = Number.isFinite(Number(item?.required)) ? Number(item.required) : REQUIRED_PER_CATEGORY;
    return { id: c.id, label: c.short, count, required, done: count >= required && item?.completed !== false, missing: Math.max(0, required - count) };
  });
  const behind = out.categories.filter((c) => !c.done);
  if (behind.length) out.problems.push(`Not finished: ${behind.map((c) => `${c.label} ${c.count}/${c.required}`).join(', ')}. Review more, then generate a newer receipt.`);
  else if (payload.completed !== true) out.problems.push('The receipt says the requirements are not complete yet. Review more, then generate a newer receipt.');
  const iat = Number(payload.iat); const exp = Number(payload.exp);
  if (Number.isFinite(iat)) out.issuedAt = iat * 1000;
  if (Number.isFinite(exp)) {
    out.expiresAt = exp * 1000;
    if (exp * 1000 < now) out.problems.push('This receipt has expired. Generate a fresh one in the review app.');
  }
  out.ok = out.problems.length === 0;
  return out;
}

/** What is still needed, given the counts the student has so far (any number of categories may be unknown). */
export function reviewPlan(counts = {}) {
  const rows = CATEGORIES.map((c) => {
    const n = Number(counts[c.id]);
    const count = Number.isFinite(n) && n >= 0 ? Math.min(MAX_PER_CATEGORY, Math.floor(n)) : 0;
    return { id: c.id, label: c.short, count, missing: Math.max(0, REQUIRED_PER_CATEGORY - count) };
  });
  const total = rows.reduce((sum, r) => sum + r.count, 0);
  const missing = rows.reduce((sum, r) => sum + r.missing, 0);
  return { rows, total, missing, done: missing === 0 };
}
