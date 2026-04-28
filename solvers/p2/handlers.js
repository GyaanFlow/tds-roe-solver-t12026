/**
 * Discourse KB Solver — Handlers for all 11 query types.
 *
 * Each handler receives a parsed task object and a facts array for the
 * matching category. Facts come from compact_facts.json (frozen 2026-04-25).
 *
 * All handlers are defensive: they guard against missing params,
 * missing fields, empty arrays, and unexpected data shapes.
 */

// ─── Utilities ──────────────────────────────────────────────────────

/**
 * Check if an ISO date string falls within [start, end] inclusive.
 * Compares only the YYYY-MM-DD prefix.
 */
function inRange(iso, start, end) {
  if (!iso || !start || !end) return false;
  const d = iso.slice(0, 10);
  return d >= start && d <= end;
}

/**
 * Multi-strategy topic lookup by title.
 * Tries: exact → exact+date → case-insensitive → whitespace-normalized → combined.
 */
function findTopicByTitle(facts, title, opUsername, datePrefix) {
  if (!title) return null;

  const matchOp = (f) => !opUsername || f.op_username === opUsername;
  const matchDate = (f) => !datePrefix || (f.created_at || '').startsWith(datePrefix);

  // Pass 1: exact title + op + date
  for (const f of facts) {
    if (f.title === title && matchOp(f) && matchDate(f)) return f;
  }
  // Pass 2: exact title + op (ignore date)
  for (const f of facts) {
    if (f.title === title && matchOp(f)) return f;
  }
  // Pass 3: case-insensitive title + op
  const titleLower = title.toLowerCase();
  for (const f of facts) {
    if ((f.title || '').toLowerCase() === titleLower && matchOp(f)) return f;
  }
  // Pass 4: whitespace-normalized title + op
  const norm = title.replace(/\s+/g, ' ').trim();
  const normLower = norm.toLowerCase();
  for (const f of facts) {
    const fNorm = (f.title || '').replace(/\s+/g, ' ').trim().toLowerCase();
    if (fNorm === normLower && matchOp(f)) return f;
  }
  // Pass 5: relaxed — just title match, any op
  for (const f of facts) {
    if ((f.title || '').toLowerCase() === titleLower) return f;
  }
  return null;
}

// ─── Handler Implementations ────────────────────────────────────────

function handleAcceptedPostId(task, facts) {
  const p = task.params || {};
  if (!p.title) return 'MISSING_PARAMS';
  const f = findTopicByTitle(facts, p.title, p.op, p.date);
  if (f && f.accepted_post_id) return String(f.accepted_post_id);
  return 'NOT_FOUND';
}

function handleReplyCountCompound(task, facts) {
  const p = task.params || {};
  if (!p.title) return 'MISSING_PARAMS';
  const f = findTopicByTitle(facts, p.title, p.op, p.date);
  if (!f) return 'NOT_FOUND';
  return `${f.reply_count}-${f.latest_reply_post_id}`;
}

function handleTotalPosts(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end) return 'MISSING_PARAMS';
  let n = 0;
  for (const f of facts) {
    const posts = f.posts || [];
    for (const q of posts) {
      if (inRange(q.c, p.start, p.end)) n++;
    }
  }
  return String(n);
}

function handleAggregateLikes(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end) return 'MISSING_PARAMS';
  let n = 0;
  for (const f of facts) {
    const posts = f.posts || [];
    for (const q of posts) {
      if (inRange(q.c, p.start, p.end)) n += (q.l || 0);
    }
  }
  return String(n);
}

function handleTagCount(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end || !p.tag) return 'MISSING_PARAMS';
  const tagLower = p.tag.toLowerCase();
  let n = 0;
  for (const f of facts) {
    if (!inRange(f.created_at, p.start, p.end)) continue;
    const tags = f.tags || [];
    if (tags.some(t => t.toLowerCase() === tagLower)) n++;
  }
  return String(n);
}

function handleTagCountCompound(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end || !p.tag) return 'MISSING_PARAMS';
  const tagLower = p.tag.toLowerCase();
  const matching = [];
  for (const f of facts) {
    if (!inRange(f.created_at, p.start, p.end)) continue;
    const tags = f.tags || [];
    if (tags.some(t => t.toLowerCase() === tagLower)) matching.push(f);
  }
  if (!matching.length) return '0-NONE';
  const latest = matching.reduce((best, f) =>
    (f.created_at || '') > (best.created_at || '') ? f : best
  );
  return `${matching.length}-${latest.topic_id}`;
}

function handleTopLikedUser(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end) return 'MISSING_PARAMS';
  const counts = {};
  for (const f of facts) {
    const posts = f.posts || [];
    for (const q of posts) {
      if (inRange(q.c, p.start, p.end)) {
        counts[q.u] = (counts[q.u] || 0) + (q.l || 0);
      }
    }
  }
  const entries = Object.entries(counts);
  if (!entries.length) return 'NOT_FOUND';
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function handleTopReplier(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end) return 'MISSING_PARAMS';
  const counts = {};
  for (const f of facts) {
    const posts = f.posts || [];
    for (let i = 0; i < posts.length; i++) {
      if (i === 0) continue; // skip OP post
      const q = posts[i];
      if (inRange(q.c, p.start, p.end)) {
        counts[q.u] = (counts[q.u] || 0) + 1;
      }
    }
  }
  const entries = Object.entries(counts);
  if (!entries.length) return 'NOT_FOUND';
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function handleTopAnswerAuthor(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end) return 'MISSING_PARAMS';
  const counts = {};
  for (const f of facts) {
    if (!f.accepted_username) continue;
    if (!inRange(f.created_at, p.start, p.end)) continue;
    counts[f.accepted_username] = (counts[f.accepted_username] || 0) + 1;
  }
  const entries = Object.entries(counts);
  if (!entries.length) return 'NOT_FOUND';
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0][0];
}

function handleUniqueCreators(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end) return 'MISSING_PARAMS';
  const s = new Set();
  for (const f of facts) {
    if (inRange(f.created_at, p.start, p.end)) {
      s.add(f.op_username);
    }
  }
  return String(s.size);
}

function handleUniqueCreatorsCompound(task, facts) {
  const p = task.params || {};
  if (!p.start || !p.end) return 'MISSING_PARAMS';
  const matching = facts.filter(f => inRange(f.created_at, p.start, p.end));
  if (!matching.length) return '0-NONE';
  const unique = new Set(matching.map(f => f.op_username));
  const latest = matching.reduce((best, f) =>
    (f.created_at || '') > (best.created_at || '') ? f : best
  );
  return `${unique.size}-${latest.topic_id}`;
}

// ─── Handler Registry ───────────────────────────────────────────────

export const HANDLERS = {
  accepted_post_id: handleAcceptedPostId,
  reply_count_compound: handleReplyCountCompound,
  total_posts: handleTotalPosts,
  aggregate_likes: handleAggregateLikes,
  tag_count: handleTagCount,
  tag_count_compound: handleTagCountCompound,
  top_liked_user: handleTopLikedUser,
  top_replier: handleTopReplier,
  top_answer_author: handleTopAnswerAuthor,
  unique_creators: handleUniqueCreators,
  unique_creators_compound: handleUniqueCreatorsCompound,
};
