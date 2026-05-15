/**
 * Universal Task Parser for IITM Discourse KB Analysis assignments.
 *
 * Handles all reasonable input formats:
 *   - Standard "Task N / Category / type / body" 4-line blocks
 *   - Markdown headers (## Task 1, ### Task 1, etc.)
 *   - Numbered lists (1. In the System Commands ...)
 *   - JSON objects with task1..task50 keys
 *   - Extra blank lines, trailing whitespace, mixed line endings
 *   - Missing "type" header lines (auto-detects from question body)
 *   - Pasted HTML fragments (strips tags)
 *   - Unicode curly quotes
 */

const KNOWN_CATEGORIES = [
  "System Commands",
  "Programming in Python",
  "Machine Learning Practices",
  "Statistics for Data Science II",
  "Machine Learning Techniques",
  "Database Management Systems",
  "Tools in Data Science",
  "Modern Application Development I",
  "Mathematics for Data Science II",
  "Programming Concepts using Java",
  "Machine Learning Foundations",
  "Programming, Data Structures and Algorithms",
  "Modern Application Development II",
  "English II",
];

const _CAT_LOOKUP = {};
for (const c of KNOWN_CATEGORIES) {
  _CAT_LOOKUP[c.toLowerCase()] = c;
}

const DATE_RE = '(\\d{4}-\\d{2}-\\d{2})';

// All quote characters we might encounter
const QUOTE_OPEN = '["\\u201c\\u201e\\u00ab]';
const QUOTE_CLOSE = '["\\u201d\\u201f\\u00bb]';
const SINGLE_QUOTE = "['" + '\\u2018\\u2019\\u2032' + "]";

function stripHtml(text) {
  return text.replace(/<[^>]+>/g, '');
}

// ─── Category Normalization ──────────────────────────────────────────

function normalizeCategory(raw) {
  raw = raw.trim();
  const low = raw.toLowerCase();

  // Exact match
  if (_CAT_LOOKUP[low]) return _CAT_LOOKUP[low];

  // Substring match (either direction)
  for (const [key, canon] of Object.entries(_CAT_LOOKUP)) {
    if (key.includes(low) || low.includes(key)) return canon;
  }

  // Strip trailing "Discourse category" noise
  const cleaned = raw.replace(/\s*discourse\s*category\s*$/i, '').trim();
  const low2 = cleaned.toLowerCase();
  if (_CAT_LOOKUP[low2]) return _CAT_LOOKUP[low2];
  for (const [key, canon] of Object.entries(_CAT_LOOKUP)) {
    if (key.includes(low2) || low2.includes(key)) return canon;
  }
  return raw;
}

function detectCategoryFromBody(body) {
  // "in the X Discourse category"
  let m = body.match(/in the (.+?) Discourse category/);
  if (m) return normalizeCategory(m[1]);

  // "in the X KB Discourse" / "in X Discourse"
  m = body.match(/in (?:the )?(.+?)(?:\s+KB|\s+Knowledge Base)?\s+Discourse/i);
  if (m) return normalizeCategory(m[1]);

  // Fallback: scan body for any known category name
  for (const cat of KNOWN_CATEGORIES) {
    if (body.includes(cat)) return cat;
  }

  return null;
}

// ─── Type Detection ──────────────────────────────────────────────────

function detectTypeFromBody(body) {
  const low = body.toLowerCase();

  // Order matters — compound types checked before simple ones.
  if (low.includes('accepted answer') && low.includes('post id'))
    return 'accepted_post_id';
  if (low.includes('how many replies') && low.includes('latest_reply_post_id'))
    return 'reply_count_compound';
  if (low.includes('tagged with') && low.includes('latest_topic_id'))
    return 'tag_count_compound';
  if (low.includes('tagged with') && low.includes('how many'))
    return 'tag_count';
  if (low.includes('unique users started') && low.includes('latest_topic_id'))
    return 'unique_creators_compound';
  if (low.includes('unique users started'))
    return 'unique_creators';
  if (low.includes('most total likes') || low.includes('accumulated the most'))
    return 'top_liked_user';
  if (low.includes('posted the most replies'))
    return 'top_replier';
  if (low.includes('most posts marked as the accepted answer'))
    return 'top_answer_author';
  if (low.includes('total number of likes'))
    return 'aggregate_likes';
  if (low.includes('total number of posts'))
    return 'total_posts';

  return null;
}

// ─── Parameter Extraction ────────────────────────────────────────────

/**
 * Normalize all curly/smart quote variants to straight quotes for regex matching.
 */
function normalizeQuotes(text) {
  return text
    .replace(/[\u201c\u201e\u00ab]/g, '"')
    .replace(/[\u201d\u201f\u00bb]/g, '"')
    .replace(/[\u2018\u2019\u2032]/g, "'");
}

function extractParams(taskType, body) {
  const params = {};
  // Normalize quotes in body for easier regex
  const norm = normalizeQuotes(body);

  if (taskType === 'accepted_post_id') {
    // Pattern 1: solved topic "Title" (posted by user on YYYY-MM-DD)
    let m = norm.match(
      new RegExp('(?:the\\s+)?solved\\s+topic\\s+"(.+?)"\\s*\\(posted\\s+by\\s+(\\S+)\\s+on\\s+' + DATE_RE + '\\)')
    );
    if (m) {
      params.title = m[1];
      params.op = m[2];
      params.date = m[3];
    } else {
      // Pattern 2: topic "Title" ... posted by user on YYYY-MM-DD
      m = norm.match(
        new RegExp('topic\\s+"(.+?)".*?posted\\s+by\\s+(\\S+)\\s+on\\s+' + DATE_RE)
      );
      if (m) {
        params.title = m[1];
        params.op = m[2];
        params.date = m[3];
      }
    }
  } else if (taskType === 'reply_count_compound') {
    // Pattern 1: titled "Title" in the X category was posted by user on YYYY-MM-DD
    let m = norm.match(
      new RegExp('titled\\s+"(.+?)"\\s+in\\s+the\\s+.+?\\s+category\\s+was\\s+posted\\s+by\\s+(\\S+)\\s+on\\s+' + DATE_RE)
    );
    if (m) {
      params.title = m[1];
      params.op = m[2];
      params.date = m[3];
    } else {
      // Pattern 2: topic "Title" ... posted by user on YYYY-MM-DD
      m = norm.match(
        new RegExp('(?:topic|titled)\\s+"(.+?)".*?posted\\s+by\\s+(\\S+)\\s+on\\s+' + DATE_RE)
      );
      if (m) {
        params.title = m[1];
        params.op = m[2];
        params.date = m[3];
      }
    }
  } else if (taskType === 'total_posts' || taskType === 'aggregate_likes') {
    const m = norm.match(new RegExp('between\\s+' + DATE_RE + '\\s+and\\s+' + DATE_RE));
    if (m) {
      params.start = m[1];
      params.end = m[2];
    }
  } else if (taskType === 'tag_count' || taskType === 'tag_count_compound') {
    const m = norm.match(new RegExp('between\\s+' + DATE_RE + '\\s+and\\s+' + DATE_RE));
    if (m) {
      params.start = m[1];
      params.end = m[2];
    }
    // Try single-quoted tag first, then double-quoted
    let m2 = norm.match(/tagged\s+with\s+'([^']+)'/);
    if (!m2) {
      m2 = norm.match(/tagged\s+with\s+"([^"]+)"/);
    }
    if (m2) {
      params.tag = m2[1];
    }
  } else if (taskType === 'top_replier' || taskType === 'top_answer_author' || taskType === 'top_liked_user') {
    const m = norm.match(new RegExp('between\\s+' + DATE_RE + '\\s+and\\s+' + DATE_RE));
    if (m) {
      params.start = m[1];
      params.end = m[2];
    }
  } else if (taskType === 'unique_creators' || taskType === 'unique_creators_compound') {
    const m = norm.match(new RegExp('between\\s+' + DATE_RE + '\\s+and\\s+' + DATE_RE));
    if (m) {
      params.start = m[1];
      params.end = m[2];
    }
  }

  return params;
}

// ─── Block Parsing ───────────────────────────────────────────────────

const TYPE_HEADERS = new Set([
  'reply count compound', 'total posts', 'accepted post id',
  'tag count', 'tag count compound', 'top replier',
  'top answer author', 'top liked user', 'unique creators',
  'unique creators compound', 'aggregate likes',
]);

function extractTaskNum(block) {
  let m = block.match(/^(?:#{1,4}\s*)?Task\s+(\d+)/);
  if (m) return parseInt(m[1], 10);
  m = block.match(/^(\d{1,2})[.)]\s/);
  if (m) return parseInt(m[1], 10);
  return null;
}

function parseBlock(block) {
  block = stripHtml(block).trim();
  if (!block) return null;

  const taskNum = extractTaskNum(block);
  if (taskNum === null) return null;

  let lines = block.split('\n');
  lines = lines.slice(1); // drop task-number line

  // Skip leading blank lines
  while (lines.length && !lines[0].trim()) lines.shift();
  if (!lines.length) return null;

  let category = null;
  let bodyStart = 0;

  // Try to detect category from the first non-blank line
  const candidate = lines[0].trim();
  const normalized = normalizeCategory(candidate);
  if (KNOWN_CATEGORIES.includes(normalized)) {
    category = normalized;
    bodyStart = 1;
  }

  // Skip type header line if present (e.g. "accepted post id", "total posts")
  if (bodyStart < lines.length && TYPE_HEADERS.has(lines[bodyStart].trim().toLowerCase())) {
    bodyStart += 1;
  }

  // Skip any blank lines between header and body
  while (bodyStart < lines.length && !lines[bodyStart].trim()) bodyStart++;

  const body = lines.slice(bodyStart).join('\n').trim();

  if (!category) {
    category = detectCategoryFromBody(body);
  }
  if (!category) {
    // Last resort: try the full block for category detection
    category = detectCategoryFromBody(block);
  }
  if (!category) {
    console.warn(`WARN task ${taskNum}: could not determine category`);
    category = 'UNKNOWN';
  }

  const taskType = detectTypeFromBody(body);
  if (!taskType) {
    // Try detecting from the full block (in case type header was consumed)
    const typeFromBlock = detectTypeFromBody(block);
    if (typeFromBlock) {
      const params = extractParams(typeFromBlock, body || block);
      return { task_num: taskNum, category, type: typeFromBlock, params };
    }
    console.warn(`WARN task ${taskNum}: could not determine type from body`);
    return null;
  }

  const params = extractParams(taskType, body);
  if (!params || Object.keys(params).length === 0) {
    console.warn(`WARN task ${taskNum}: no params extracted for ${taskType}`);
  }

  return { task_num: taskNum, category, type: taskType, params };
}

// ─── Splitting Strategies ────────────────────────────────────────────

function splitStandard(text) {
  return text.trim().split(/\n(?=Task\s+\d+\b)/).map(b => b.trim()).filter(Boolean);
}

function splitMarkdownHeaders(text) {
  return text.trim().split(/\n(?=#{1,4}\s*Task\s+\d+)/).map(b => b.trim()).filter(Boolean);
}

function splitNumbered(text) {
  return text.trim().split(/\n(?=\d{1,2}[.)]\s)/).map(b => b.trim()).filter(Boolean);
}

function parseJsonFormat(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return null;
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const taskKeys = Object.keys(data).filter(k => /^task\d+$/i.test(k));
  if (taskKeys.length < 10) return null;

  const tasks = [];
  for (const key of taskKeys) {
    const m = key.match(/^task(\d+)$/i);
    if (!m) continue;
    const taskNum = parseInt(m[1], 10);
    const value = data[key];
    if (typeof value !== 'string') continue;

    const block = `Task ${taskNum}\n${value}`;
    const parsed = parseBlock(block);
    if (parsed) tasks.push(parsed);
  }

  if (tasks.length) tasks.sort((a, b) => a.task_num - b.task_num);
  return tasks.length ? tasks : null;
}

// ─── Validation ──────────────────────────────────────────────────────

/**
 * Validate parsed tasks and return warnings array.
 * @param {Array} tasks - Parsed task objects
 * @returns {{ ok: boolean, warnings: string[] }}
 */
export function validate(tasks) {
  const warnings = [];
  const nums = tasks.map(t => t.task_num);
  const expected = new Set();
  for (let i = 1; i <= 50; i++) expected.add(i);
  const found = new Set(nums);

  const missing = [...expected].filter(n => !found.has(n));
  const extra = [...found].filter(n => !expected.has(n));
  const dupes = nums.filter((n, i) => nums.indexOf(n) !== i);

  if (missing.length) warnings.push(`Missing task numbers: ${missing.join(', ')}`);
  if (extra.length) warnings.push(`Unexpected task numbers: ${extra.join(', ')}`);
  if (dupes.length) warnings.push(`Duplicate task numbers: ${[...new Set(dupes)].join(', ')}`);

  for (const t of tasks) {
    const p = t.params || {};
    if (!p || Object.keys(p).length === 0) {
      warnings.push(`Task ${t.task_num} (${t.type}): no parameters extracted`);
    } else if (t.type === 'accepted_post_id' && !p.title) {
      warnings.push(`Task ${t.task_num}: accepted_post_id but no title found`);
    } else if (t.type === 'reply_count_compound' && !p.title) {
      warnings.push(`Task ${t.task_num}: reply_count_compound but no title found`);
    } else if ((t.type === 'tag_count' || t.type === 'tag_count_compound') && !p.tag) {
      warnings.push(`Task ${t.task_num}: ${t.type} but no tag found`);
    } else if (t.type !== 'accepted_post_id' && t.type !== 'reply_count_compound' && (!p.start || !p.end)) {
      warnings.push(`Task ${t.task_num}: ${t.type} missing date range`);
    }

    if (t.category === 'UNKNOWN') {
      warnings.push(`Task ${t.task_num}: category is UNKNOWN`);
    } else if (!KNOWN_CATEGORIES.includes(t.category)) {
      warnings.push(`Task ${t.task_num}: unrecognized category '${t.category}'`);
    }
  }

  return { ok: warnings.length === 0, warnings };
}

// ─── Main Entry Point ────────────────────────────────────────────────

/**
 * Parse raw task text (any format) into structured task objects.
 * @param {string} text - Raw pasted task text
 * @returns {Array} Array of parsed task objects
 */
export function parseText(text) {
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Try JSON format first
  const jsonResult = parseJsonFormat(text);
  if (jsonResult && jsonResult.length >= 10) return jsonResult;

  let best = [];
  for (const splitter of [splitStandard, splitMarkdownHeaders, splitNumbered]) {
    const blocks = splitter(text);
    const tasks = blocks.map(b => parseBlock(b)).filter(Boolean);
    if (tasks.length > best.length) best = tasks;
    if (tasks.length >= 48) break;
  }

  if (!best.length) {
    throw new Error('Could not find any parseable task blocks. Make sure the input contains "Task 1", "Task 2", etc. or is in JSON format with task1..task50 keys.');
  }

  best.sort((a, b) => a.task_num - b.task_num);
  return best;
}

export { KNOWN_CATEGORIES };
