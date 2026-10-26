// Checks the shape of a "final receipt" copied from a trading game before the student pastes it into the exam.
// The exam server verifies the signature and whether the receipt is final; this only catches copy mistakes early.
// Nothing here is sent anywhere, and the decoded fields are shown only to the student.

const B64URL = /^[A-Za-z0-9_-]+$/;

function decodePart(part) {
  try {
    const padded = part.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - (part.length % 4)) % 4);
    const text = typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary');
    const bytes = Uint8Array.from(text, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}

/** Cleans what a student pasted: quotes, spaces and line breaks are removed (a receipt has none). */
export function cleanReceipt(raw) {
  return String(raw ?? '').trim().replace(/^["'`]+|["'`]+$/g, '').replace(/\s+/g, '');
}

/**
 * @param raw the pasted text
 * @param opts.now current time in ms; opts.finalFrom when final receipts exist (ms)
 * Returns { ok, receipt, problems[], warnings[], fields }.
 */
export function checkReceipt(raw, { now = Date.now(), finalFrom = null } = {}) {
  const receipt = cleanReceipt(raw);
  const problems = [];
  const warnings = [];
  if (!receipt) return { ok: false, receipt, problems: ['Paste the receipt first.'], warnings, fields: null };
  if (receipt.length > 20000) return { ok: false, receipt: '', problems: ['That is far too long to be a receipt. Copy only the receipt text.'], warnings, fields: null };
  if (/^https?:/i.test(receipt)) problems.push('That is a web link, not the receipt. In the game open Result and copy the long receipt text.');
  const parts = receipt.split('.');
  if (parts.length !== 3 || !parts.every((p) => p && B64URL.test(p))) {
    problems.push('A receipt is three blocks of letters and digits joined by two dots, and it starts with "eyJ". Copy it again from the game\'s Result page, using the Copy button if there is one.');
    return { ok: false, receipt, problems, warnings, fields: null };
  }
  const header = decodePart(parts[0]);
  const payload = decodePart(parts[1]);
  if (!header || !payload || typeof payload !== 'object') {
    problems.push('The receipt text is damaged (it cannot be read). Copy it again, making sure you take all of it.');
    return { ok: false, receipt, problems, warnings, fields: null };
  }
  if (header.alg && header.alg !== 'ES256') warnings.push(`This receipt is signed with ${String(header.alg).slice(0, 20)}, not the usual ES256. The exam may still accept it.`);
  const flat = JSON.stringify(payload).toLowerCase();
  if (payload.final === false || payload.provisional === true || /"(status|state|kind|type)":"provisional"/.test(flat)) {
    problems.push('This looks like a provisional receipt (copied before the game closed). The exam rejects those. Wait until the game has closed, then copy the final receipt.');
  }
  if (typeof payload.exp === 'number' && payload.exp * 1000 < now) warnings.push('The receipt says it has expired. Open the game, go to Result and copy it again.');
  if (finalFrom && now < finalFrom) warnings.push('The game has not closed yet, so any receipt you copy now is provisional and will be rejected.');
  const fields = Object.fromEntries(Object.entries(payload).filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v)).slice(0, 12).map(([k, v]) => [k, String(v).slice(0, 80)]));
  return { ok: problems.length === 0, receipt, problems, warnings, fields };
}
