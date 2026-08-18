// Solver: GA8 Q1 -- Immutable Training Corpus
// Submit the fixed hosted-service URL; the exam grader POSTs its probes to /build-corpus.
import { normalizeEmail } from './utils.js';
import { promoLines } from './promo.js';
import { serviceUrlFor, ga8Post } from './api-client.js';

export const id = 'q-immutable-training-corpus-server';
export const title = 'Q1: Immutable Training Corpus';

const SAMPLE_REQUEST = {
  policy: {
    minTime: '2026-01-01T00:00:00Z',
    maxTime: '2026-01-02T00:00:00Z',
    contaminationThreshold: 0.8
  },
  objects: [{
    uri: 'gs://bucket/object',
    generation: '123',
    fetchedGeneration: '123',
    crc32c: 'e3069283',
    schemaId: 'training-v1',
    content: '{"id":"r1","entity":"User A","eventTime":"2026-01-01T10:00:00Z","revision":1,"text":"hello world"}\n'
  }]
};

function registerInteractive() {
  if (typeof window === 'undefined' || window._ga8Q1Registered) return;
  window._ga8Q1Registered = true;

  window._ga8Q1TestRequest = async function () {
    const email = document.getElementById('ga8Q1Email')?.value || '';
    const raw = document.getElementById('ga8Q1RequestInput')?.value || '';
    const statusEl = document.getElementById('ga8Q1TestStatus');
    const outEl = document.getElementById('ga8Q1TestOutput');
    function setStatus(text, color) { if (statusEl) { statusEl.textContent = text; statusEl.style.color = color || '#9fc6ff'; } }
    let body;
    try { body = JSON.parse(raw); } catch { setStatus('Request body is not valid JSON.', '#dc3545'); return; }
    setStatus('Calling /build-corpus… (cold start can take ~30-50s)', '#e9d5ff');
    try {
      const result = await ga8Post(email, 'build-corpus', body);
      if (outEl) outEl.value = JSON.stringify(result, null, 2);
      setStatus('✅ Success: Corpus partitioned & digests computed.', '#198754');
    } catch (err) {
      setStatus(`Request failed: ${err.message}`, '#dc3545');
    }
  };

  window._ga8Q1UseSample = function () {
    const inputEl = document.getElementById('ga8Q1RequestInput');
    if (inputEl) inputEl.value = JSON.stringify(SAMPLE_REQUEST, null, 2);
  };

  window._ga8Q1CopyUrl = async function () {
    const el = document.getElementById('ga8Q1SubmitUrl');
    if (!el || !el.value) return;
    try { await navigator.clipboard.writeText(el.value); } catch { el.focus(); el.select(); }
  };
}

export async function solve(email) {
  registerInteractive();
  const norm = normalizeEmail(email);
  const serviceUrl = serviceUrlFor(norm);

  const guide = [
    `## Q1 -- Immutable Training Corpus (for ${norm})`,
    ``,
    `### 🎯 Submit this exact URL`,
    '```text',
    serviceUrl,
    '```',
    `The exam grader POSTs its validation datasets and GCS manifests to \`${serviceUrl}/build-corpus\`.`,
    `No authentication required, open CORS enabled.`,
    ``,
    `### 💡 Grader Pipeline Rules`,
    `1. **GCS Check**: Validates generation decimal string and pure Castagnoli CRC32C checksum match.`,
    `2. **Normalization**: Canonicalizes text & entity with Unicode NFKC, lowercase, trimmed whitespace.`,
    `3. **Deduplication**: Rows grouped by \`[entity, eventTime, text]\`. Highest revision retained; ties broken with UTF-8 byte-smallest ID.`,
    `4. **Partition Hash Split**:`,
    `   - \`bucket = firstByte(SHA256(UTF8(entity))) % 10\``,
    `   - \`0..5\` → **train** | \`6..7\` → **validation** | \`8..9\` → **test**`,
    `5. **Contamination Guard**: Computes lowercase alphanumeric word-set Jaccard similarity of val/test rows against all train rows. Rejects with \`TRAIN_CONTAMINATION\` if \`>= contaminationThreshold\`.`,
    `6. **Deterministic Digests**: Outputs sorted compact newline-terminated SHA-256 digests.`,
    ``,
    `### 🧪 Interactive Service Probe`,
    `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:rgba(255,255,255,0.04);border-radius:8px;border:1px solid rgba(255,255,255,0.1);">`,
    `  <div style="display:flex;gap:8px;align-items:center;">`,
    `    <input id="ga8Q1SubmitUrl" type="text" value="${serviceUrl}" readonly style="flex:1;padding:6px;border-radius:4px;background:#1e1e1e;border:1px solid #444;color:#fff;font-family:monospace;font-size:12px;" />`,
    `    <button type="button" onclick="window._ga8Q1CopyUrl()" class="btn-sm" style="padding:6px 12px;background:var(--theme-primary,#f59e0b);color:#111;border:none;border-radius:4px;font-weight:600;cursor:pointer;">Copy URL</button>`,
    `    <button type="button" onclick="window._ga8Q1UseSample()" class="btn-sm" style="padding:6px 12px;background:rgba(255,255,255,0.1);color:#fff;border:1px solid #555;border-radius:4px;cursor:pointer;">Load Sample</button>`,
    `  </div>`,
    `  <input id="ga8Q1Email" type="hidden" value="${norm}" />`,
    `  <textarea id="ga8Q1RequestInput" rows="5" style="width:100%;padding:6px;border-radius:4px;background:#111;border:1px solid #333;color:#9cdcfe;font-family:monospace;font-size:11px;" placeholder="Paste test JSON payload here..."></textarea>`,
    `  <button type="button" onclick="window._ga8Q1TestRequest()" style="padding:6px 12px;background:#2563eb;color:#fff;border:none;border-radius:4px;font-weight:600;cursor:pointer;">POST /build-corpus</button>`,
    `  <span id="ga8Q1TestStatus" style="font-size:11px;color:#9fc6ff;"></span>`,
    `  <textarea id="ga8Q1TestOutput" rows="5" readonly style="width:100%;padding:6px;border-radius:4px;background:#0d1117;border:1px solid #222;color:#7ee787;font-family:monospace;font-size:11px;" placeholder="Response JSON will appear here..."></textarea>`,
    `</div>`,
    ...promoLines
  ].join('\n');

  return {
    answer: serviceUrl,
    type: 'solved',
    variant: `Live Corpus Builder Engine for ${norm}`,
    answerDisplay: serviceUrl,
    guide,
    debug: { serviceUrl, endpoint: 'POST /build-corpus' }
  };
}
