// Calculator and checklist for the P1 "Reconcile the Missing Invoice" game.
// The game's rule: pay for goods RECEIVED at the PURCHASE ORDER price, add GST at the PURCHASE ORDER rate, subtract VALID
// credit notes. The student reads the real documents on their own desk; this module only does the arithmetic exactly
// (no floating-point money) and lists what to double-check. It makes no decisions about other students' requests.

/* ------------------------------ exact decimals ------------------------------ */

// A number is { n: BigInt, s: scale } meaning n / 10^s. Products add scales; nothing is rounded until the very end.
const TEN = 10n;

export function parseDecimal(input) {
  const text = String(input ?? '').trim().replace(/,/g, '').replace(/^[₹$]\s*/, '');
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(text)) return null;
  const negative = text.startsWith('-');
  const unsigned = text.replace(/^[+-]/, '');
  const [whole = '0', fraction = ''] = unsigned.split('.');
  if (fraction.length > 12) return null;
  const n = BigInt((whole || '0') + fraction) * (negative ? -1n : 1n);
  return { n, s: fraction.length };
}

const align = (a, b) => {
  const s = Math.max(a.s, b.s);
  return [a.n * TEN ** BigInt(s - a.s), b.n * TEN ** BigInt(s - b.s), s];
};
export const add = (a, b) => { const [x, y, s] = align(a, b); return { n: x + y, s }; };
export const sub = (a, b) => { const [x, y, s] = align(a, b); return { n: x - y, s }; };
export const mul = (a, b) => ({ n: a.n * b.n, s: a.s + b.s });
export const ZERO = { n: 0n, s: 0 };

/** Round half away from zero to `places` decimals, returned as a plain string such as "1234.50". */
export function toFixed(value, places = 2) {
  const shift = places - value.s;
  let n = value.n;
  if (shift >= 0) n *= TEN ** BigInt(shift);
  else {
    const divisor = TEN ** BigInt(-shift);
    const negative = n < 0n;
    const abs = negative ? -n : n;
    let q = abs / divisor;
    if ((abs % divisor) * 2n >= divisor) q += 1n;
    n = negative ? -q : q;
  }
  const negative = n < 0n;
  const digits = (negative ? -n : n).toString().padStart(places + 1, '0');
  const whole = digits.slice(0, digits.length - places);
  const fraction = places ? `.${digits.slice(digits.length - places)}` : '';
  return `${negative ? '-' : ''}${whole}${fraction}`;
}

/* ------------------------------ the reconciliation ------------------------------ */

const required = (label, raw, { min = 0 } = {}) => {
  const value = parseDecimal(raw);
  if (!value) return { error: `${label}: "${String(raw ?? '').trim()}" is not a number.` };
  if (value.n < BigInt(min) * TEN ** BigInt(value.s)) return { error: `${label} cannot be negative.` };
  return { value };
};

/**
 * lines:  [{ item, orderedQty, receivedQty, poPrice, gstRate? }]   (gstRate is a percentage; falls back to defaultGstRate)
 * credits: [{ ref, amount, status: 'valid' | 'cancelled' | 'replacement', replaces? }]
 *   valid        counts.
 *   cancelled    never counts.
 *   replacement  counts only when the credit note it replaces is cancelled (that is the rule's replacement case).
 */
export function reconcile({ lines = [], credits = [], defaultGstRate = '0', invoiceTotal = '' } = {}) {
  const errors = [];
  const warnings = [];
  const steps = [];
  if (!Array.isArray(lines) || lines.length === 0) return { ok: false, errors: ['Add at least one line from the purchase order.'], warnings, steps };

  let subtotal = ZERO;
  let gst = ZERO;
  const lineResults = [];
  for (const [index, line] of lines.entries()) {
    const name = String(line.item || `Line ${index + 1}`).trim();
    const received = required(`${name}: quantity received`, line.receivedQty);
    const price = required(`${name}: purchase-order price`, line.poPrice);
    const rateRaw = String(line.gstRate ?? '').trim() === '' ? defaultGstRate : line.gstRate;
    const rate = required(`${name}: GST rate`, rateRaw);
    if (received.error || price.error || rate.error) {
      errors.push(...[received.error, price.error, rate.error].filter(Boolean));
      continue;
    }
    if (String(line.orderedQty ?? '').trim() !== '') {
      const ordered = parseDecimal(line.orderedQty);
      if (!ordered) errors.push(`${name}: quantity ordered "${line.orderedQty}" is not a number.`);
      else {
        const gap = sub(received.value, ordered).n;
        if (gap > 0n) warnings.push(`${name}: received (${line.receivedQty}) is more than ordered (${line.orderedQty}). Check which document governs before paying for the extra.`);
        else if (gap < 0n) warnings.push(`${name}: only ${line.receivedQty} of ${line.orderedQty} ordered were received — you pay for what was received.`);
      }
    }
    const amount = mul(received.value, price.value);
    const tax = mul(amount, mul(rate.value, { n: 1n, s: 2 }));
    subtotal = add(subtotal, amount);
    gst = add(gst, tax);
    lineResults.push({ item: name, amount, tax });
    steps.push(`${name}: ${line.receivedQty} received × ${line.poPrice} = ${toFixed(amount, 2)}; GST at ${rateRaw}% = ${toFixed(tax, 4)}`);
  }
  if (errors.length) return { ok: false, errors, warnings, steps };

  const refs = new Set();
  let creditTotal = ZERO;
  const creditResults = [];
  const statusByRef = new Map(credits.map((c) => [String(c.ref || '').trim(), c.status]));
  for (const [index, credit] of credits.entries()) {
    const ref = String(credit.ref || `Credit note ${index + 1}`).trim();
    const amount = required(`${ref}: amount`, credit.amount);
    if (amount.error) { errors.push(amount.error); continue; }
    if (refs.has(ref)) warnings.push(`${ref} is listed twice. Count each credit note once.`);
    refs.add(ref);
    let counts = false;
    let why = '';
    if (credit.status === 'valid') { counts = true; why = 'valid'; }
    else if (credit.status === 'cancelled') why = 'cancelled — never subtracted';
    else if (credit.status === 'replacement') {
      const original = String(credit.replaces || '').trim();
      if (!original) { warnings.push(`${ref}: say which credit note it replaces.`); why = 'replacement of an unknown credit note — not subtracted until you name the original'; }
      else if (statusByRef.get(original) === 'cancelled') { counts = true; why = `replaces cancelled ${original} — subtracted`; }
      else { why = `its original ${original} is not cancelled — not subtracted`; warnings.push(`${ref} replaces ${original}, which is not marked cancelled. Only subtract a replacement when the original was cancelled.`); }
    } else { warnings.push(`${ref}: choose valid, cancelled or replacement.`); why = 'status not chosen — not subtracted'; }
    if (counts) creditTotal = add(creditTotal, amount.value);
    creditResults.push({ ref, amount: amount.value, counts, why });
    steps.push(`${ref}: ${credit.amount} — ${why}`);
  }
  if (errors.length) return { ok: false, errors, warnings, steps };

  const net = sub(add(subtotal, gst), creditTotal);
  const result = { ok: true, errors: [], warnings, steps, lines: lineResults, credits: creditResults, subtotal, gst, creditTotal, net, text: {
    subtotal: toFixed(subtotal, 2), gst: toFixed(gst, 2), credits: toFixed(creditTotal, 2), net: toFixed(net, 2), netExact: toFixed(net, 6),
  } };
  if (net.n < 0n) warnings.push('The credits are larger than the amount due — re-check which credit notes really apply.');
  if (String(invoiceTotal ?? '').trim() !== '') {
    const claimed = parseDecimal(invoiceTotal);
    if (!claimed) warnings.push(`The invoice total "${invoiceTotal}" is not a number, so it was not compared.`);
    else {
      const difference = sub(claimed, add(subtotal, gst));
      result.invoiceDifference = toFixed(difference, 2);
      if (difference.n !== 0n) warnings.push(`The invoice (${toFixed(claimed, 2)}) differs from goods received at PO prices plus GST (${toFixed(add(subtotal, gst), 2)}) by ${toFixed(difference, 2)}. The rule says to pay by the purchase order and goods received, not the invoice.`);
    }
  }
  return result;
}

/* ------------------------------ checklist and request screening ------------------------------ */

export const CHECKLIST = [
  'Read all four documents: invoice, purchase order, goods received note, and the supplier email.',
  'Quantity: use the goods received note — not the invoice and not the order.',
  'Price: use the purchase-order price for every line, even if the invoice charges more.',
  'GST: use the purchase-order rate, applied to the goods received at PO prices.',
  'The supplier email names the classmate who holds your credit note. Ask that person through the desk (you have 3 requests).',
  'Subtract only valid credit notes. If one is cancelled, ask for its replacement instead.',
  'List exactly the documents you relied on, and avoid requests you do not need.',
  'Confirm with Google yourself. The game says an agent may read and draft, but you decide.',
];

const CONCERN_RULES = [
  { id: 'override', weight: 3, pattern: /\b(ignore|disregard|forget)\b.{0,40}\b(previous|prior|above|earlier|all|your)\b.{0,30}\b(instructions?|rules?|prompt)\b|\bsystem prompt\b|\bas an ai\b|\byou are now\b|\bdeveloper mode\b/i, message: 'It tries to override your instructions — a classic prompt-injection pattern.' },
  { id: 'secret', weight: 3, pattern: /\b(password|passcode|otp|one[- ]time (code|pin)|api[- ]?key|secret|credentials?|sign[- ]?in (code|token)|quizsign)\b/i, message: 'It asks for a password, key, sign-in code or similar secret. Never share those.' },
  { id: 'authority', weight: 2, pattern: /\b(i am|this is)\b.{0,25}\b(your )?(manager|boss|admin(istrator)?|ceo|director|teacher|instructor|ta|professor|support)\b|\bon behalf of (the )?(admin|management|instructor)\b/i, message: 'It leans on an authority claim you cannot verify.' },
  { id: 'urgency', weight: 1, pattern: /\b(urgent(ly)?|immediately|right now|asap|within (the )?(next )?\d+ ?(minutes?|mins?)|last chance|final warning)\b/i, message: 'It pressures you to act immediately.' },
  { id: 'bypass', weight: 2, pattern: /\b(skip|bypass|without) (the )?(check|verification|confirmation|review|google)\b|\bno need to (confirm|verify|check)\b/i, message: 'It asks you to skip a check or confirmation.' },
  { id: 'link', weight: 1, pattern: /https?:\/\/\S+|\b(click|open) (this|the) link\b/i, message: 'It includes a link you were not expecting.' },
  { id: 'everything', weight: 2, pattern: /\b(all|every|entire)\b.{0,20}\b(documents?|files?|records?|notes?)\b|\bsend (me )?everything\b/i, message: 'It asks for more than one specific document.' },
];

const GENUINE_HINTS = [
  { pattern: /\b(credit note|purchase order|invoice|goods received|grn|po)\b.{0,20}\b[A-Z]{1,4}[-\s]?\d{2,}\b|\b[A-Z]{1,4}-\d{2,}\b/, message: 'It names a specific document id.' },
  { pattern: /\b(replacement|replaces|cancelled|canceled)\b/i, message: 'It refers to a replacement or cancellation — the rule says to grant a replacement when the original was cancelled.' },
];

/**
 * Advisory screen for a request someone sent you. It highlights red flags and genuine-looking details; it can be
 * wrong in both directions, and the decision to grant or refuse (and the Google confirmation) is always yours.
 */
export function assessRequest(text) {
  const body = String(text ?? '').trim();
  if (!body) return { ok: false, message: 'Paste the request text first.' };
  const concerns = CONCERN_RULES.filter((rule) => rule.pattern.test(body));
  const hints = GENUINE_HINTS.filter((rule) => rule.pattern.test(body));
  const score = concerns.reduce((total, rule) => total + rule.weight, 0);
  const verdict = score >= 3 ? 'looks suspicious' : score >= 1 ? 'needs care' : 'no red flags found';
  return {
    ok: true,
    score,
    verdict,
    concerns: concerns.map((rule) => ({ id: rule.id, message: rule.message })),
    hints: hints.map((rule) => rule.message),
    reminder: 'This is only a screen. Compare the request with your own records and decide yourself: grant genuine requests (including a replacement for a cancelled credit note) and refuse everything else.',
  };
}
