// Local analysis of a `git fast-import` stream (T3 GA1 Q10).
//
// The exam serves a personalised history as a fast-import stream. Instead of requiring Git, this
// parses the documented stream format, rebuilds the file tree after every commit, and reports which
// commit first INTRODUCED each `stg_…` token and whether it was later rotated out. Pure functions
// only (no DOM, no network) so the same code is exercised by check.mjs under Node.

export class FastImportError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FastImportError';
  }
}

export const DEFAULT_TOKEN_PATTERN = /stg_[A-Za-z0-9_]+/g;
const TOKEN_BOUNDARY = /[A-Za-z0-9_]/;

const utf8 = new TextDecoder('utf-8');
const LF = 10;

/** `git log --format=%s`: the first paragraph of the message, with line breaks folded to spaces. */
export function commitSubject(message) {
  const lines = String(message).replace(/\r\n/g, '\n').split('\n');
  while (lines.length && lines[0].trim() === '') lines.shift();
  const paragraph = [];
  for (const line of lines) {
    if (line.trim() === '') break;
    paragraph.push(line.trim());
  }
  return paragraph.join(' ');
}

/** Undo git's C-style path quoting (`"a\"b"`, `\t`, and `\303\251` octal UTF-8 bytes). */
export function unquotePath(text) {
  if (!text.startsWith('"')) return text;
  const bytes = [];
  const source = new TextEncoder().encode(text);
  const simple = { 97: 7, 98: 8, 102: 12, 110: 10, 114: 13, 116: 9, 118: 11, 34: 34, 92: 92 };
  for (let index = 1; index < source.length; index += 1) {
    const byte = source[index];
    if (byte === 34) break; // closing quote
    if (byte !== 92) {
      bytes.push(byte);
      continue;
    }
    index += 1;
    const next = source[index];
    if (next >= 48 && next <= 55) {
      let value = next - 48;
      for (let digits = 1; digits < 3 && source[index + 1] >= 48 && source[index + 1] <= 55; digits += 1) {
        index += 1;
        value = value * 8 + (source[index] - 48);
      }
      bytes.push(value & 0xff);
    } else if (next in simple) {
      bytes.push(simple[next]);
    } else if (next !== undefined) {
      bytes.push(92, next);
    }
  }
  return utf8.decode(Uint8Array.from(bytes));
}

function scanTokens(text, pattern, into) {
  pattern.lastIndex = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const token = match[0];
    // Do not report the tail of a longer identifier (`x_stg_…`): the character before must not be a word char.
    if (match.index > 0 && TOKEN_BOUNDARY.test(text[match.index - 1])) continue;
    if (into.has(token)) continue;
    const lineStart = text.lastIndexOf('\n', match.index) + 1;
    let lineEnd = text.indexOf('\n', match.index);
    if (lineEnd === -1) lineEnd = text.length;
    into.set(token, text.slice(lineStart, Math.min(lineEnd, lineStart + 200)).trim());
  }
}

/**
 * Parse a fast-import stream into commits (in stream order, which always lists parents first)
 * with the full file tree reconstructed after each one. Blob bodies are scanned for tokens and then
 * dropped, so memory stays proportional to the number of files, not their size.
 */
export function parseFastImport(input, { tokenPattern = DEFAULT_TOKEN_PATTERN } = {}) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  if (!(bytes instanceof Uint8Array)) throw new FastImportError('Expected the stream as text or bytes.');

  let pos = 0;
  const blobsByMark = new Map(); // ":12" -> Map<token, context>
  const commitByMark = new Map(); // ":3" -> commit index
  const refs = new Map(); // "refs/heads/main" -> commit index
  const commits = [];
  let inlineCounter = 0;

  const fail = (message) => new FastImportError(`${message} (byte ${pos}).`);

  function peekLine() {
    if (pos >= bytes.length) return null;
    let end = bytes.indexOf(LF, pos);
    if (end === -1) end = bytes.length;
    return { text: utf8.decode(bytes.subarray(pos, end)), next: Math.min(end + 1, bytes.length) };
  }
  function readLine() {
    const line = peekLine();
    if (!line) return null;
    pos = line.next;
    return line.text;
  }

  // `data <n>` + n raw bytes (+ optional LF), or `data <<DELIM` … `DELIM`.
  function readData() {
    const header = readLine();
    if (header === null || !header.startsWith('data ')) throw fail(`Expected "data" but found "${(header ?? 'end of stream').slice(0, 40)}"`);
    const spec = header.slice(5);
    if (spec.startsWith('<<')) {
      const delimiter = spec.slice(2);
      const start = pos;
      for (;;) {
        const line = peekLine();
        if (line === null) throw fail(`Unterminated delimited data (missing "${delimiter}")`);
        if (line.text === delimiter) {
          const body = bytes.subarray(start, pos);
          pos = line.next;
          return body;
        }
        pos = line.next;
      }
    }
    if (!/^\d+$/.test(spec)) throw fail(`Invalid data length "${spec.slice(0, 30)}"`);
    const length = Number(spec);
    if (pos + length > bytes.length) throw fail(`Data block claims ${length} bytes but only ${bytes.length - pos} remain — the file looks truncated or re-encoded`);
    const body = bytes.subarray(pos, pos + length);
    pos += length;
    if (bytes[pos] === LF) pos += 1;
    return body;
  }

  function tokensOf(body) {
    const found = new Map();
    scanTokens(utf8.decode(body), tokenPattern, found);
    return found;
  }

  function resolveCommitish(text) {
    const ref = text.trim();
    if (!ref || /^0{40}$/.test(ref)) return null;
    if (ref.startsWith(':')) {
      if (!commitByMark.has(ref)) throw fail(`Unknown commit mark ${ref}`);
      return commitByMark.get(ref);
    }
    if (refs.has(ref)) return refs.get(ref);
    if (refs.has(`refs/heads/${ref}`)) return refs.get(`refs/heads/${ref}`);
    if (refs.has(`refs/tags/${ref}`)) return refs.get(`refs/tags/${ref}`);
    return undefined; // an object id from outside the stream: no tree available
  }

  function splitTwoPaths(rest) {
    // `<src> <dst>` where src is quoted, or unquoted without spaces.
    if (rest.startsWith('"')) {
      let end = 1;
      while (end < rest.length && !(rest[end] === '"' && rest[end - 1] !== '\\')) end += 1;
      return [unquotePath(rest.slice(0, end + 1)), unquotePath(rest.slice(end + 2))];
    }
    const space = rest.indexOf(' ');
    return [rest.slice(0, space), unquotePath(rest.slice(space + 1))];
  }

  function applyOp(tree, line) {
    if (line === 'deleteall') {
      tree.clear();
      return;
    }
    const kind = line[0];
    if (kind === 'M') {
      const first = line.indexOf(' ', 2);
      const mode = line.slice(2, first);
      const second = line.indexOf(' ', first + 1);
      const dataref = line.slice(first + 1, second);
      const path = unquotePath(line.slice(second + 1));
      let key;
      if (dataref.startsWith(':')) {
        if (!blobsByMark.has(dataref)) throw fail(`File ${path} references unknown blob ${dataref}`);
        key = dataref;
      } else {
        key = `sha:${dataref}`; // object defined outside the stream; contents unknown
        if (!blobsByMark.has(key)) blobsByMark.set(key, new Map());
      }
      if (mode === '040000' || mode === '160000') key = `opaque:${mode}`;
      if (key.startsWith('opaque:') && !blobsByMark.has(key)) blobsByMark.set(key, new Map());
      tree.set(path, key);
    } else if (kind === 'D') {
      const path = unquotePath(line.slice(2));
      const prefix = `${path}/`;
      for (const existing of [...tree.keys()]) if (existing === path || existing.startsWith(prefix)) tree.delete(existing);
    } else if (kind === 'R' || kind === 'C') {
      const [from, to] = splitTwoPaths(line.slice(2));
      const prefix = `${from}/`;
      const moved = [...tree.entries()].filter(([name]) => name === from || name.startsWith(prefix));
      if (kind === 'R') for (const [name] of moved) tree.delete(name);
      for (const [name, key] of moved) tree.set(name === from ? to : `${to}/${name.slice(prefix.length)}`, key);
    }
    // 'N' (notes) and anything else carries no file content we care about.
  }

  // Inline `data` blocks must be read in stream order, so file ops are collected first and applied
  // once the commit's base tree is known.
  function runCommit(refName) {
    const commit = { ref: refName, mark: null, author: '', committer: '', message: '', subject: '', parents: [], tree: null, index: commits.length };
    for (;;) {
      const line = peekLine();
      if (line === null) throw fail('Commit ended before its message');
      const text = line.text;
      if (text.startsWith('mark ')) commit.mark = text.slice(5).trim();
      else if (text.startsWith('author ')) commit.author = text.slice(7);
      else if (text.startsWith('committer ')) commit.committer = text.slice(10);
      else if (text.startsWith('original-oid ') || text.startsWith('encoding ')) { /* metadata only */ }
      else if (text.startsWith('data ')) break;
      else throw fail(`Unexpected line inside a commit header: "${text.slice(0, 50)}"`);
      pos = line.next;
    }
    commit.message = utf8.decode(readData());
    commit.subject = commitSubject(commit.message);

    let baseIndex = refs.has(refName) ? refs.get(refName) : null;
    const mergeParents = [];
    const pending = []; // file ops, applied once the base tree is known
    for (;;) {
      const line = peekLine();
      if (line === null) break;
      const text = line.text;
      if (text === '') { pos = line.next; break; }
      if (text.startsWith('from ')) {
        pos = line.next;
        const resolved = resolveCommitish(text.slice(5));
        baseIndex = typeof resolved === 'number' ? resolved : null;
      } else if (text.startsWith('merge ')) {
        pos = line.next;
        const resolved = resolveCommitish(text.slice(6));
        if (typeof resolved === 'number') mergeParents.push(resolved);
      } else if (/^[MDRCN] /.test(text) || text === 'deleteall') {
        pos = line.next;
        pending.push(text);
        if (/^M \S+ inline /.test(text)) pending[pending.length - 1] = { text, data: readData() };
      } else break;
    }

    const tree = new Map(baseIndex !== null && commits[baseIndex] ? commits[baseIndex].tree : []);
    for (const op of pending) {
      if (typeof op === 'string') applyOp(tree, op);
      else {
        const key = `inline:${inlineCounter += 1}`;
        blobsByMark.set(key, tokensOf(op.data));
        const first = op.text.indexOf(' ', 2);
        const second = op.text.indexOf(' ', first + 1);
        tree.set(unquotePath(op.text.slice(second + 1)), key);
      }
    }
    commit.tree = tree;
    commit.parents = [baseIndex, ...mergeParents].filter((value) => typeof value === 'number');
    return commit;
  }

  const first = peekLine();
  if (first && /^\s*</.test(first.text)) {
    throw new FastImportError('It looks like an HTML web page rather than raw git history.');
  }

  for (;;) {
    const line = readLine();
    if (line === null) break;
    if (line === '' || line.startsWith('#')) continue;
    if (line === 'blob') {
      let mark = null;
      for (;;) {
        const header = peekLine();
        if (header === null) throw fail('Blob ended before its data');
        if (header.text.startsWith('mark ')) mark = header.text.slice(5).trim();
        else if (header.text.startsWith('original-oid ')) { /* ignore */ }
        else break;
        pos = header.next;
      }
      const tokens = tokensOf(readData());
      if (mark) blobsByMark.set(mark, tokens);
    } else if (line.startsWith('commit ')) {
      const refName = line.slice(7).trim();
      const commit = runCommit(refName);
      commits.push(commit);
      refs.set(refName, commit.index);
      if (commit.mark) commitByMark.set(commit.mark, commit.index);
    } else if (line.startsWith('reset ')) {
      const refName = line.slice(6).trim();
      const next = peekLine();
      if (next && next.text.startsWith('from ')) {
        pos = next.next;
        const resolved = resolveCommitish(next.text.slice(5));
        if (typeof resolved === 'number') refs.set(refName, resolved);
        else refs.delete(refName);
      } else refs.delete(refName);
    } else if (line.startsWith('tag ')) {
      for (;;) {
        const header = peekLine();
        if (header === null) throw fail('Tag ended before its message');
        if (header.text.startsWith('data ')) break;
        pos = header.next;
      }
      readData();
    } else if (/^(progress |feature |option |get-mark |cat-blob |ls |alias)/.test(line) || line === 'checkpoint' || line === 'done') {
      // control commands that do not change history
    } else {
      throw fail(`Not a fast-import command: "${line.slice(0, 60)}"`);
    }
  }

  return { commits, refs, blobTokens: blobsByMark };
}

function tokensInTree(tree, blobTokens) {
  const present = new Set();
  for (const key of tree.values()) {
    const found = blobTokens.get(key);
    if (found) for (const token of found.keys()) present.add(token);
  }
  return present;
}

/**
 * For every distinct token: the commit(s) that first added it, any commit that removed it, whether
 * it is still present at the tip of any branch, and the file/line it was found in.
 */
export function analyzeHistory(parsed) {
  const { commits, refs, blobTokens } = parsed;
  const present = commits.map((commit) => tokensInTree(commit.tree, blobTokens));
  const records = new Map();

  const recordFor = (token) => {
    if (!records.has(token)) records.set(token, { token, introductions: [], removals: [], files: new Set(), context: '' });
    return records.get(token);
  };
  const describe = (commit) => ({ index: commit.index, mark: commit.mark, subject: commit.subject, author: commit.author, committer: commit.committer, ref: commit.ref });

  for (const commit of commits) {
    const here = present[commit.index];
    const before = new Set();
    for (const parent of commit.parents) for (const token of present[parent]) before.add(token);
    for (const token of here) {
      if (before.has(token)) continue;
      const record = recordFor(token);
      record.introductions.push(describe(commit));
      for (const [path, key] of commit.tree) {
        const context = blobTokens.get(key)?.get(token);
        if (context !== undefined) {
          record.files.add(path);
          if (!record.context) record.context = context;
        }
      }
    }
    const firstParent = commit.parents[0];
    if (firstParent !== undefined) {
      for (const token of present[firstParent]) {
        if (!here.has(token)) recordFor(token).removals.push(describe(commit));
      }
    }
  }

  const tipTokens = new Set();
  for (const index of refs.values()) for (const token of present[index]) tipTokens.add(token);

  const tokens = [...records.values()].map((record) => ({
    ...record,
    files: [...record.files].sort(),
    stillPresent: tipTokens.has(record.token),
    rotatedOut: !tipTokens.has(record.token) && record.removals.length > 0,
    introducedMoreThanOnce: record.introductions.length > 1,
    first: record.introductions[0],
  }));
  tokens.sort((a, b) => a.first.index - b.first.index || a.token.localeCompare(b.token));

  const rotated = tokens.filter((entry) => entry.rotatedOut);
  const warnings = [];
  let best = null;
  if (rotated.length === 1) {
    best = rotated[0];
  } else if (rotated.length > 1) {
    best = rotated[0];
    warnings.push(`${rotated.length} tokens were added and later removed. The earliest is suggested, but check the table to pick the one the question describes.`);
  } else if (tokens.length === 1) {
    best = tokens[0];
    warnings.push('The only token found is still present at the tip of a branch, but the question says it was rotated out. Double-check it before submitting.');
  } else if (tokens.length > 1) {
    warnings.push('No token was removed from history. Review the table to decide which one is the leaked staging token.');
  }
  if (best?.introducedMoreThanOnce) {
    warnings.push(`That token was added ${best.introductions.length} times (it was removed and re-added, or added on separate branches). The first addition is used.`);
  }

  return {
    commitCount: commits.length,
    refNames: [...refs.keys()],
    tokens,
    best,
    warnings,
    answer: best ? JSON.stringify({ token: best.token, commit_subject: best.first.subject }) : '',
    confident: Boolean(best) && rotated.length === 1 && !best.introducedMoreThanOnce,
  };
}

/** Parse + analyse in one call; retries once with Windows line endings normalised if the byte counts do not add up. */
export function analyzeFastImport(input, options) {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  try {
    return { ...analyzeHistory(parseFastImport(bytes, options)), normalizedLineEndings: false };
  } catch (error) {
    if (!(error instanceof FastImportError) || !bytes.includes(13)) throw error;
    const normalized = new TextEncoder().encode(utf8.decode(bytes).replace(/\r\n/g, '\n'));
    return { ...analyzeHistory(parseFastImport(normalized, options)), normalizedLineEndings: true };
  }
}
