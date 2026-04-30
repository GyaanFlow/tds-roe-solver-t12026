import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://discourse.onlinedegree.iitm.ac.in";
const COOKIE = process.env.DISCOURSE_COOKIE || "";
const CACHE = path.resolve("discourse-target-cache");

if (!COOKIE) throw new Error("Set DISCOURSE_COOKIE first.");

const slugByName = {
  "System Commands": "sc-kb",
  "Programming in Python": "python-kb",
  "Machine Learning Practices": "mlp-kb",
  "Statistics for Data Science II": "stats2-kb",
  "Machine Learning Techniques": "mlt-kb",
  "Database Management Systems": "dbms-kb",
  "Tools in Data Science": "tds-kb",
  "Modern Application Development I": "mad1-kb",
  "Mathematics for Data Science II": "maths2-kb",
  "Programming Concepts using Java": "java-kb",
  "Machine Learning Foundations": "mlf-kb",
  "Programming, Data Structures and Algorithms": "pdsa-kb",
  "Modern Application Development II": "mad2-kb",
  "English II": "english2-kb",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s ?? "").trim().replace(/\s+/g, " ").toLowerCase();
const parseDate = (s) => new Date(String(s).replace(/\.\d+Z$/, "Z"));
const startOf = (d) => new Date(`${d}T00:00:00Z`);
const endOf = (d) => new Date(`${d}T23:59:59Z`);
const inRange = (s, a, b) => parseDate(s) >= startOf(a) && parseDate(s) <= endOf(b);

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function getJSON(url, retries = 4) {
  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, {
      headers: {
        Cookie: COOKIE,
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0",
      },
    });
    if (res.status === 429 || res.status >= 500) {
      await sleep(2000 + i * 3000);
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${res.statusText}: ${url}\n${text.slice(0, 400)}`);
    }
    await sleep(250);
    return res.json();
  }
  throw new Error(`Failed after retries: ${url}`);
}

async function discoverCategories() {
  const site = await getJSON(`${BASE}/site.json`);
  const categories = new Map();
  for (const [name, slug] of Object.entries(slugByName)) {
    const c = (site.categories || []).find((x) => x.slug === slug);
    if (c) categories.set(name, c);
    else console.warn(`Category unavailable in this login: ${name} (${slug})`);
  }
  return categories;
}

async function fetchTopic(id) {
  await ensureDir(CACHE);
  const file = path.join(CACHE, `${id}.json`);
  if (await exists(file)) return JSON.parse(await fs.readFile(file, "utf8"));

  console.log(`fetch topic ${id}`);
  const first = await getJSON(`${BASE}/t/${id}.json`);
  const stream = first.post_stream?.stream || [];
  const posts = new Map();
  for (const p of first.post_stream?.posts || []) posts.set(p.id, p);

  for (let i = 0; i < stream.length; i += 20) {
    const ids = stream.slice(i, i + 20).filter((postId) => !posts.has(postId));
    if (!ids.length) continue;
    const qs = ids.map((postId) => `post_ids[]=${postId}`).join("&");
    const data = await getJSON(`${BASE}/t/${id}/posts.json?${qs}`);
    for (const p of data.post_stream?.posts || []) posts.set(p.id, p);
  }

  first.all_posts = [...posts.values()].sort((a, b) => (a.post_number || 0) - (b.post_number || 0));
  await fs.writeFile(file, JSON.stringify(first, null, 2));
  return first;
}

async function search(q) {
  const topicIds = new Set();
  const postTopicIds = new Set();
  for (let page = 1; page <= 50; page++) {
    const url = `${BASE}/search.json?q=${encodeURIComponent(q)}&page=${page}`;
    const data = await getJSON(url);
    for (const t of data.topics || []) topicIds.add(t.id);
    for (const p of data.posts || []) if (p.topic_id) postTopicIds.add(p.topic_id);
    const count = (data.topics || []).length + (data.posts || []).length;
    if (!count) break;
    if (!data.grouped_search_result?.more_posts && !data.grouped_search_result?.more_topics) break;
  }
  return [...new Set([...topicIds, ...postTopicIds])];
}

async function filterTopicsByCreated(category, start, end) {
  const slug = category.slug;
  const topics = [];
  for (let page = 0; page <= 50; page++) {
    const url = `${BASE}/filter.json?q=category:${slug}+status:solved+after:${start}+before:${end}&page=${page}`;
    const data = await getJSON(url);
    const pageTopics = data.topic_list?.topics || [];
    if (!pageTopics.length) break;
    topics.push(...pageTopics);
  }
  const seen = new Set();
  return topics.filter((t) => {
    if (seen.has(t.id)) return false;
    seen.add(t.id);
    return inRange(t.created_at, start, end);
  });
}

async function topicsWithPostsInRange(category, start, end) {
  const ids = await search(`category:${category.slug} status:solved after:${start} before:${end}`);
  const topics = [];
  for (const id of ids) {
    const t = await fetchTopic(id);
    if ((t.all_posts || []).some((p) => inRange(p.created_at, start, end))) topics.push(t);
  }
  return topics;
}

function firstPost(topic) {
  return (topic.all_posts || []).find((p) => p.post_number === 1) || topic.all_posts?.[0];
}

async function exactTopic(category, title, author, date) {
  const ids = await search(`"${title}" category:${category.slug} status:solved`);
  for (const id of ids) {
    const t = await fetchTopic(id);
    const fp = firstPost(t);
    if (
      norm(t.title) === norm(title) &&
      norm(fp?.username) === norm(author) &&
      String(fp?.created_at || t.created_at || "").startsWith(date)
    ) return t;
  }
  for (const id of ids) {
    const t = await fetchTopic(id);
    if (norm(t.title) === norm(title)) {
      console.warn(`Fallback exact title only: ${title} -> ${id}`);
      return t;
    }
  }
  console.warn(`NO MATCH: ${title}`);
  return null;
}

function likeCount(post) {
  return (post.actions_summary || []).find((a) => a.id === 2)?.count || 0;
}

function maxKey(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0]?.[0] ?? null;
}

async function acceptedPostId(category, title, author, date) {
  const t = await exactTopic(category, title, author, date);
  const p = t?.all_posts?.find((x) => x.accepted_answer === true);
  return p ? String(p.id) : null;
}

async function replyCountCompound(category, title, author, date) {
  const t = await exactTopic(category, title, author, date);
  if (!t) return null;
  const cutoff = parseDate("2026-12-31T23:59:59Z");
  const replies = (t.all_posts || []).filter((p) => p.post_number !== 1 && parseDate(p.created_at) <= cutoff);
  if (!replies.length) return "0-";
  replies.sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at) || a.post_number - b.post_number);
  return `${replies.length}-${replies.at(-1).id}`;
}

async function aggregateLikes(category, start, end) {
  const topics = await topicsWithPostsInRange(category, start, end);
  let total = 0;
  for (const t of topics) for (const p of t.all_posts || []) if (inRange(p.created_at, start, end)) total += likeCount(p);
  return total;
}

async function topLikedUser(category, start, end) {
  const topics = await topicsWithPostsInRange(category, start, end);
  const m = new Map();
  for (const t of topics) for (const p of t.all_posts || []) {
    if (inRange(p.created_at, start, end)) m.set(p.username, (m.get(p.username) || 0) + likeCount(p));
  }
  return maxKey(m);
}

async function topAnswerAuthor(category, start, end) {
  const topicList = await filterTopicsByCreated(category, start, end);
  const m = new Map();
  for (const item of topicList) {
    const t = await fetchTopic(item.id);
    const p = t.all_posts?.find((x) => x.accepted_answer === true);
    if (p) m.set(p.username, (m.get(p.username) || 0) + 1);
  }
  return maxKey(m);
}

async function tagCount(category, tag, start, end) {
  const topicList = await filterTopicsByCreated(category, start, end);
  return topicList.filter((t) => (t.tags || []).some((x) => (x.slug || x.name || x) === tag)).length;
}

async function tagCountCompound(category, tag, start, end) {
  const topicList = await filterTopicsByCreated(category, start, end);
  const matches = topicList.filter((t) => (t.tags || []).some((x) => (x.slug || x.name || x) === tag));
  if (!matches.length) return "0-";
  matches.sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at) || a.id - b.id);
  return `${matches.length}-${matches.at(-1).id}`;
}

async function topReplier(category, start, end) {
  const topics = await topicsWithPostsInRange(category, start, end);
  const m = new Map();
  for (const t of topics) for (const p of t.all_posts || []) {
    if (p.post_number !== 1 && inRange(p.created_at, start, end)) m.set(p.username, (m.get(p.username) || 0) + 1);
  }
  return maxKey(m);
}

async function totalPosts(category, start, end) {
  const topics = await topicsWithPostsInRange(category, start, end);
  let n = 0;
  for (const t of topics) for (const p of t.all_posts || []) if (inRange(p.created_at, start, end)) n++;
  return n;
}

async function main() {
  const C = await discoverCategories();
  const cat = (name) => {
    const c = C.get(name);
    if (!c) throw new Error(`Category not available: ${name}`);
    return c;
  };

  const a = {};

  a.task1 = await acceptedPostId(cat("System Commands"), "Not able to find course calendar", "Itz_abhi", "2025-09-30");
  a.task2 = await acceptedPostId(cat("System Commands"), "Unable to login to VM - ssh-keygen not working", "23f2005175", "2025-07-04");
  a.task3 = await replyCountCompound(cat("System Commands"), "OPPE Rescheduling Requests", "23f3003591", "2025-12-05");
  a.task4 = await acceptedPostId(cat("System Commands"), "PPA/GRPA not visible on VM due to white background color", "24f2000396", "2026-02-17");
  a.task5 = await replyCountCompound(cat("System Commands"), "How to exit Vim", "MKS", "2025-05-29");
  a.task6 = await acceptedPostId(cat("System Commands"), "How to setup BPT1?", "Cpsingh", "2026-02-22");
  a.task7 = await acceptedPostId(cat("System Commands"), "ET doubt - syllabus", "Vigneshwar_2006", "2025-12-16");
  a.task8 = await aggregateLikes(cat("System Commands"), "2025-01-01", "2025-12-31");
  a.task9 = await acceptedPostId(cat("System Commands"), "Please share the command for checking the test cases in oppe", "25dp1000034", "2025-08-15");
  a.task10 = await replyCountCompound(cat("System Commands"), "BPT 2 Score Clarification", "24f2007572", "2025-10-31");

  a.task11 = await replyCountCompound(cat("Programming in Python"), "Clarity on python oppe eligibility rule", "24f2007031", "2026-03-05");
  a.task12 = await topLikedUser(cat("Programming in Python"), "2025-07-01", "2025-09-30");
  a.task13 = await acceptedPostId(cat("Programming in Python"), "JANUARY 2026 Term Candidate Here. It will be very helpful if you could release the question paper and answer key for the OPPE1 sets recently concluded in the portal so that we can learn from our mistakes and better perform in the upcoming OPPE2", "25f3005576", "2026-04-22");
  a.task14 = await topAnswerAuthor(cat("Programming in Python"), "2025-07-01", "2025-12-31");
  a.task15 = await topLikedUser(cat("Programming in Python"), "2025-01-01", "2025-06-30");
  a.task16 = await acceptedPostId(cat("Programming in Python"), "About code doubt in oope set 2024 set 3", "23f3001054", "2025-02-25");
  a.task17 = await acceptedPostId(cat("Programming in Python"), "Error in running program for GrPA3 week 10", "ch22b106", "2025-03-23");

  a.task18 = await acceptedPostId(cat("Machine Learning Practices"), "MLP video walkthrough of your notebook", "Bhaskar321", "2026-03-10");
  a.task19 = await acceptedPostId(cat("Machine Learning Practices"), "Oppe 1 syllabus - mlp", "Jessica05", "2025-10-28");
  a.task20 = await acceptedPostId(cat("Machine Learning Practices"), "OPPE2 misprint in preprocessing section", "muskan2431", "2025-12-17");
  a.task21 = await replyCountCompound(cat("Machine Learning Practices"), "Urgent! doubt regarding OPPE 1 grading", "23f3004043", "2025-07-18");
  a.task22 = await tagCount(cat("Machine Learning Practices"), "diploma-level", "2025-04-01", "2025-12-31");

  a.task23 = await acceptedPostId(cat("Statistics for Data Science II"), "Doubt in W2 Activity 2.1 Question 2", "Subm", "2025-10-13");
  a.task24 = await replyCountCompound(cat("Statistics for Data Science II"), "Problem in Quiz 1 scores", "24f3005230", "2025-07-20");
  a.task25 = await tagCount(cat("Statistics for Data Science II"), "foundation-level", "2026-01-01", "2026-04-30");
  a.task26 = await acceptedPostId(cat("Statistics for Data Science II"), "Explanation for slide", "Sony", "2025-12-08");

  a.task27 = await tagCount(cat("Machine Learning Techniques"), "clarification", "2025-04-01", "2025-12-31");
  a.task28 = await acceptedPostId(cat("Machine Learning Techniques"), "Need clarification for a question in solve with us week-8", "24ds1000054", "2025-03-15");
  a.task29 = await acceptedPostId(cat("Machine Learning Techniques"), "Clarification GA1- Q5- MLT", "22f3002468", "2025-09-28");
  a.task30 = await topAnswerAuthor(cat("Machine Learning Techniques"), "2025-01-01", "2025-09-30");

  a.task31 = await replyCountCompound(cat("Database Management Systems"), "ET PYQ DOUBT - 2025 Apr13", "24f3000060", "2025-08-27");
  a.task32 = await topLikedUser(cat("Database Management Systems"), "2025-07-01", "2025-09-30");
  a.task33 = await replyCountCompound(cat("Database Management Systems"), "Incorrect GAA-1 marks for DBMS", "25f1002177", "2025-12-18");

  a.task34 = await aggregateLikes(cat("Tools in Data Science"), "2025-10-01", "2025-12-31");
  a.task35 = await tagCountCompound(cat("Tools in Data Science"), "clarification", "2025-07-01", "2025-09-30");
  a.task36 = await replyCountCompound(cat("Tools in Data Science"), "Collaboration for ROE", "24f2005505", "2026-04-04");

  a.task37 = await acceptedPostId(cat("Modern Application Development I"), "MAD-1 Project Tracking Doubt", "dungeon_master", "2025-09-23");
  a.task38 = await acceptedPostId(cat("Modern Application Development I"), "Week 7 Lab issues?", "25f1002703", "2025-11-07");
  a.task39 = await topReplier(cat("Modern Application Development I"), "2025-04-01", "2025-12-31");

  a.task40 = await acceptedPostId(cat("Mathematics for Data Science II"), "Jan_2025_Term_Quiz 1, Math_2,_Q.ID_4718", "24f3002643", "2025-02-25");
  a.task41 = await replyCountCompound(cat("Mathematics for Data Science II"), "Time limit for Quiz 1?", "rawfiul", "2025-07-10");
  a.task42 = await replyCountCompound(cat("Mathematics for Data Science II"), "Can someone explain answer to quiz-1 question 2", "peat", "2026-03-16");

  a.task43 = await replyCountCompound(cat("Programming Concepts using Java"), "Wrong scores in dashboard", "Gurkirat", "2025-10-09");
  a.task44 = await acceptedPostId(cat("Programming Concepts using Java"), "OPPE 2 marks not yet received", "24f2006018", "2025-12-13");

  a.task45 = await topLikedUser(cat("Machine Learning Foundations"), "2025-10-01", "2025-12-31");
  a.task46 = await replyCountCompound(cat("Machine Learning Foundations"), "MLF-Week4-L4.1", "23f3004014", "2025-02-03");

  a.task47 = await totalPosts(cat("Programming, Data Structures and Algorithms"), "2025-04-01", "2025-12-31");
  a.task48 = await replyCountCompound(cat("Programming, Data Structures and Algorithms"), "PDSA and other subjects textbooks?", "24f2000918", "2025-05-10");

  a.task49 = await topReplier(cat("Modern Application Development II"), "2025-01-01", "2025-12-31");
  a.task50 = C.has("English II") ? await totalPosts(cat("English II"), "2025-01-01", "2025-09-30") : null;

  await fs.writeFile("discourse-answers-targeted.json", JSON.stringify(a, null, 2));
  console.log(JSON.stringify(a, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
