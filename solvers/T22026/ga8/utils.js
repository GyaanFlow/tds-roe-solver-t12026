// Common Utilities & Formatting for GA8 Solvers.

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

// Pure JS CRC32C (Castagnoli Polynomial 0x1EDC6F41 for GCS compatibility)
function makeCrc32cTable() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? ((crc >>> 1) ^ 0x82F63B78) : (crc >>> 1);
    }
    table[i] = crc >>> 0;
  }
  return table;
}

const CRC32C_TABLE = makeCrc32cTable();

export function crc32cHex(data) {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32C_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  const result = (crc ^ 0xFFFFFFFF) >>> 0;
  return result.toString(16).padStart(8, '0');
}

export function formatDuration(ms) {
  if (ms < 1) return `${ms.toFixed(3)}ms`;
  if (ms < 100) return `${ms.toFixed(1)}ms`;
  return `${Math.round(ms)}ms`;
}
