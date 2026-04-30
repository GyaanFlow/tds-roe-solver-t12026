import fs from "node:fs/promises";
import path from "node:path";

const BASE = "https://discourse.onlinedegree.iitm.ac.in";
const COOKIE = process.env.DISCOURSE_COOKIE || "";
const CACHE = path.resolve("discourse-cache");

if (!COOKIE) {
  throw new Error("Set DISCOURSE_COOKIE before running this script.");
}

const wanted = [
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

const slugByAssignmentName = {
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const norm = (s) => String(s ?? "").trim().replace(/\s+/g, " ").toLowerCase();
const dayStart = (d) => new Date(`${d}T00:00:00Z`);
const dayEnd = (d) => new Date(`${d}T23:59:59Z`);
const parseDate = (s) => new Date(String(s).replace(/\.\d+Z$/, "Z"));
const inRange = (s, start, end) => parseDate(s) >= dayStart(start) && parseDate(s) <= dayEnd(end);

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function getJSON(url, retries = 4) {
  for (let attempt = 0; attempt < retries; attempt++) {
    const res = await fetch(url, {
      headers: {
        Cookie: COOKIE,
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });
    if (res.status === 429 || res.status >= 500) {
      await sleep(2000 + attempt * 3000);
      continue;
    }
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status} ${res.statusText} for ${url}\n${text.slice(0, 500)}`);
    }
    await sleep(300);
    return res.json();
  }
  throw new Error(`Failed after retries: ${url}`);
}

function flattenCategories(categories, parent = null, out = []) {
  for (const c of categories || []) {
    out.push({ ...c, parent_name: parent?.name ?? null, parent_slug: parent?.slug ?? null });
    flattenCategories(c.subcategory_list || [], c, out);
  }
  return out;
}

async function discoverCategories() {
  const data = await getJSON(`${BASE}/site.json`);
  const flat = flattenCategories(data.categories || []);
  const byName = new Map();
  for (const name of wanted) {
    const slug = slugByAssignmentName[name];
    const c = flat.find((cat) => cat.slug === slug) || flat.find((cat) => norm(cat.name) === norm(name));
    if (c) byName.set(name, c);
  }
  console.log("Discovered categories:");
  for (const name of wanted) {
    const c = byName.get(name);
    console.log(`- ${name}: ${c ? `${c.slug} (id ${c.id})` : "MISSING"}`);
  }
  return byName;
}

async function fetchSolvedTopicList(categorySlug) {
  const all = [];
  for (let page = 0; ; page++) {
    const url = `${BASE}/filter.json?q=category:${categorySlug}+status:solved&page=${page}`;
    const data = await getJSON(url);
    const topics = data.topic_list?.topics || [];
    if (!topics.length) break;
    all.push(...topics);
    console.log(`  page ${page}: ${topics.length} topics`);
  }
  return all;
}

async function fetchTopic(topicId) {
  const first = await getJSON(`${BASE}/t/${topicId}.json`);
  const needed = first.post_stream?.stream || [];
  const postsById = new Map();
  for (const p of first.post_stream?.posts || []) postsById.set(p.id, p);

  for (let i = 0; i < needed.length; i += 20) {
    const ids = needed.slice(i, i + 20).filter((id) => !postsById.has(id));
    if (!ids.length) continue;
    const params = ids.map((id) => `post_ids[]=${id}`).join("&");
    const data = await getJSON(`${BASE}/t/${topicId}/posts.json?${params}`);
    for (const p of data.post_stream?.posts || []) postsById.set(p.id, p);
  }

  first.all_posts = [...postsById.values()].sort((a, b) => (a.post_number || 0) - (b.post_number || 0));
  return first;
}

async function downloadCategory(name, c) {
  const dir = path.join(CACHE, `${c.id}-${c.slug}`);
  await ensureDir(dir);
  const indexFile = path.join(dir, "_topics.json");
  let topics;
  if (await exists(indexFile)) {
    topics = JSON.parse(await fs.readFile(indexFile, "utf8"));
    if (!topics.length) {
      console.log(`Refetching empty cached list: ${name}`);
      topics = await fetchSolvedTopicList(c.slug);
      await fs.writeFile(indexFile, JSON.stringify(topics, null, 2));
    }
  } else {
    console.log(`Downloading topic list: ${name}`);
    topics = await fetchSolvedTopicList(c.slug);
    await fs.writeFile(indexFile, JSON.stringify(topics, null, 2));
  }
  console.log(`${name}: ${topics.length} solved topics`);

  for (const t of topics) {
    const file = path.join(dir, `${t.id}.json`);
    if (await exists(file)) continue;
    console.log(`  topic ${t.id}: ${t.title}`);
    const full = await fetchTopic(t.id);
    await fs.writeFile(file, JSON.stringify(full, null, 2));
  }
}

async function loadTopics(c) {
  const dir = path.join(CACHE, `${c.id}-${c.slug}`);
  const names = await fs.readdir(dir);
  const topics = [];
  for (const file of names) {
    if (!file.endsWith(".json") || file.startsWith("_")) continue;
    topics.push(JSON.parse(await fs.readFile(path.join(dir, file), "utf8")));
  }
  return topics;
}

function firstPost(topic) {
  return (topic.all_posts || []).find((p) => p.post_number === 1) || topic.all_posts?.[0];
}

function findTopic(topics, title, author, date) {
  let matches = topics.filter((t) => {
    const fp = firstPost(t);
    return norm(t.title) === norm(title) &&
      norm(fp?.username) === norm(author) &&
      String(fp?.created_at || t.created_at || "").startsWith(date);
  });
  if (matches.length !== 1) {
    const fallback = topics.filter((t) => norm(t.title) === norm(title));
    if (fallback.length) {
      console.warn(`Using title fallback for "${title}" (${matches.length} exact, ${fallback.length} title matches)`);
      matches = fallback;
    }
  }
  if (!matches.length) {
    console.warn(`NO MATCH: ${title} / ${author} / ${date}`);
    return null;
  }
  return matches[0];
}

function likeCount(post) {
  const a = (post.actions_summary || []).find((x) => x.id === 2);
  return a?.count || 0;
}

function acceptedPostId(topics, title, author, date) {
  const t = findTopic(topics, title, author, date);
  const p = t?.all_posts?.find((post) => post.accepted_answer === true);
  return p ? String(p.id) : null;
}

function replyCountCompound(topics, title, author, date, before = "2026-12-31T23:59:59Z") {
  const t = findTopic(topics, title, author, date);
  if (!t) return null;
  const cutoff = parseDate(before);
  const replies = (t.all_posts || []).filter((p) => p.post_number !== 1 && parseDate(p.created_at) <= cutoff);
  if (!replies.length) return "0-";
  replies.sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at) || a.post_number - b.post_number);
  return `${replies.length}-${replies.at(-1).id}`;
}

function aggregateLikes(topics, start, end) {
  let total = 0;
  for (const t of topics) for (const p of t.all_posts || []) if (inRange(p.created_at, start, end)) total += likeCount(p);
  return total;
}

function maxKey(map) {
  return [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0]?.[0] ?? null;
}

function topLikedUser(topics, start, end) {
  const m = new Map();
  for (const t of topics) for (const p of t.all_posts || []) {
    if (inRange(p.created_at, start, end)) m.set(p.username, (m.get(p.username) || 0) + likeCount(p));
  }
  return maxKey(m);
}

function topAnswerAuthor(topics, start, end) {
  const m = new Map();
  for (const t of topics) for (const p of t.all_posts || []) {
    if (p.accepted_answer === true && inRange(p.created_at, start, end)) m.set(p.username, (m.get(p.username) || 0) + 1);
  }
  return maxKey(m);
}

function tagCount(topics, tag, start, end) {
  return topics.filter((t) => inRange(t.created_at, start, end) && (t.tags || []).includes(tag)).length;
}

function tagCountCompound(topics, tag, start, end) {
  const m = topics.filter((t) => inRange(t.created_at, start, end) && (t.tags || []).includes(tag));
  if (!m.length) return "0-";
  m.sort((a, b) => parseDate(a.created_at) - parseDate(b.created_at) || a.id - b.id);
  return `${m.length}-${m.at(-1).id}`;
}

function topReplier(topics, start, end) {
  const m = new Map();
  for (const t of topics) for (const p of t.all_posts || []) {
    if (p.post_number !== 1 && inRange(p.created_at, start, end)) m.set(p.username, (m.get(p.username) || 0) + 1);
  }
  return maxKey(m);
}

function totalPosts(topics, start, end) {
  let n = 0;
  for (const t of topics) for (const p of t.all_posts || []) if (inRange(p.created_at, start, end)) n++;
  return n;
}

async function main() {
  await ensureDir(CACHE);
  const categories = await discoverCategories();
  for (const name of wanted) {
    const c = categories.get(name);
    if (c) await downloadCategory(name, c);
  }

  const T = {};
  for (const name of wanted) T[name] = categories.get(name) ? await loadTopics(categories.get(name)) : [];

  const a = {};
  a.task1 = acceptedPostId(T["System Commands"], "Not able to find course calendar", "Itz_abhi", "2025-09-30");
  a.task2 = acceptedPostId(T["System Commands"], "Unable to login to VM - ssh-keygen not working", "23f2005175", "2025-07-04");
  a.task3 = replyCountCompound(T["System Commands"], "OPPE Rescheduling Requests", "23f3003591", "2025-12-05");
  a.task4 = acceptedPostId(T["System Commands"], "PPA/GRPA not visible on VM due to white background color", "24f2000396", "2026-02-17");
  a.task5 = replyCountCompound(T["System Commands"], "How to exit Vim", "MKS", "2025-05-29");
  a.task6 = acceptedPostId(T["System Commands"], "How to setup BPT1?", "Cpsingh", "2026-02-22");
  a.task7 = acceptedPostId(T["System Commands"], "ET doubt - syllabus", "Vigneshwar_2006", "2025-12-16");
  a.task8 = aggregateLikes(T["System Commands"], "2025-01-01", "2025-12-31");
  a.task9 = acceptedPostId(T["System Commands"], "Please share the command for checking the test cases in oppe", "25dp1000034", "2025-08-15");
  a.task10 = replyCountCompound(T["System Commands"], "BPT 2 Score Clarification", "24f2007572", "2025-10-31");

  a.task11 = replyCountCompound(T["Programming in Python"], "Clarity on python oppe eligibility rule", "24f2007031", "2026-03-05");
  a.task12 = topLikedUser(T["Programming in Python"], "2025-07-01", "2025-09-30");
  a.task13 = acceptedPostId(T["Programming in Python"], "JANUARY 2026 Term Candidate Here. It will be very helpful if you could release the question paper and answer key for the OPPE1 sets recently concluded in the portal so that we can learn from our mistakes and better perform in the upcoming OPPE2", "25f3005576", "2026-04-22");
  a.task14 = topAnswerAuthor(T["Programming in Python"], "2025-07-01", "2025-12-31");
  a.task15 = topLikedUser(T["Programming in Python"], "2025-01-01", "2025-06-30");
  a.task16 = acceptedPostId(T["Programming in Python"], "About code doubt in oope set 2024 set 3", "23f3001054", "2025-02-25");
  a.task17 = acceptedPostId(T["Programming in Python"], "Error in running program for GrPA3 week 10", "ch22b106", "2025-03-23");

  a.task18 = acceptedPostId(T["Machine Learning Practices"], "MLP video walkthrough of your notebook", "Bhaskar321", "2026-03-10");
  a.task19 = acceptedPostId(T["Machine Learning Practices"], "Oppe 1 syllabus - mlp", "Jessica05", "2025-10-28");
  a.task20 = acceptedPostId(T["Machine Learning Practices"], "OPPE2 misprint in preprocessing section", "muskan2431", "2025-12-17");
  a.task21 = replyCountCompound(T["Machine Learning Practices"], "Urgent! doubt regarding OPPE 1 grading", "23f3004043", "2025-07-18");
  a.task22 = tagCount(T["Machine Learning Practices"], "diploma-level", "2025-04-01", "2025-12-31");

  a.task23 = acceptedPostId(T["Statistics for Data Science II"], "Doubt in W2 Activity 2.1 Question 2", "Subm", "2025-10-13");
  a.task24 = replyCountCompound(T["Statistics for Data Science II"], "Problem in Quiz 1 scores", "24f3005230", "2025-07-20");
  a.task25 = tagCount(T["Statistics for Data Science II"], "foundation-level", "2026-01-01", "2026-04-30");
  a.task26 = acceptedPostId(T["Statistics for Data Science II"], "Explanation for slide", "Sony", "2025-12-08");

  a.task27 = tagCount(T["Machine Learning Techniques"], "clarification", "2025-04-01", "2025-12-31");
  a.task28 = acceptedPostId(T["Machine Learning Techniques"], "Need clarification for a question in solve with us week-8", "24ds1000054", "2025-03-15");
  a.task29 = acceptedPostId(T["Machine Learning Techniques"], "Clarification GA1- Q5- MLT", "22f3002468", "2025-09-28");
  a.task30 = topAnswerAuthor(T["Machine Learning Techniques"], "2025-01-01", "2025-09-30");

  a.task31 = replyCountCompound(T["Database Management Systems"], "ET PYQ DOUBT - 2025 Apr13", "24f3000060", "2025-08-27");
  a.task32 = topLikedUser(T["Database Management Systems"], "2025-07-01", "2025-09-30");
  a.task33 = replyCountCompound(T["Database Management Systems"], "Incorrect GAA-1 marks for DBMS", "25f1002177", "2025-12-18");

  a.task34 = aggregateLikes(T["Tools in Data Science"], "2025-10-01", "2025-12-31");
  a.task35 = tagCountCompound(T["Tools in Data Science"], "clarification", "2025-07-01", "2025-09-30");
  a.task36 = replyCountCompound(T["Tools in Data Science"], "Collaboration for ROE", "24f2005505", "2026-04-04");

  a.task37 = acceptedPostId(T["Modern Application Development I"], "MAD-1 Project Tracking Doubt", "dungeon_master", "2025-09-23");
  a.task38 = acceptedPostId(T["Modern Application Development I"], "Week 7 Lab issues?", "25f1002703", "2025-11-07");
  a.task39 = topReplier(T["Modern Application Development I"], "2025-04-01", "2025-12-31");

  a.task40 = acceptedPostId(T["Mathematics for Data Science II"], "Jan_2025_Term_Quiz 1, Math_2,_Q.ID_4718", "24f3002643", "2025-02-25");
  a.task41 = replyCountCompound(T["Mathematics for Data Science II"], "Time limit for Quiz 1?", "rawfiul", "2025-07-10");
  a.task42 = replyCountCompound(T["Mathematics for Data Science II"], "Can someone explain answer to quiz-1 question 2", "peat", "2026-03-16");

  a.task43 = replyCountCompound(T["Programming Concepts using Java"], "Wrong scores in dashboard", "Gurkirat", "2025-10-09");
  a.task44 = acceptedPostId(T["Programming Concepts using Java"], "OPPE 2 marks not yet received", "24f2006018", "2025-12-13");

  a.task45 = topLikedUser(T["Machine Learning Foundations"], "2025-10-01", "2025-12-31");
  a.task46 = replyCountCompound(T["Machine Learning Foundations"], "MLF-Week4-L4.1", "23f3004014", "2025-02-03");

  a.task47 = totalPosts(T["Programming, Data Structures and Algorithms"], "2025-04-01", "2025-12-31");
  a.task48 = replyCountCompound(T["Programming, Data Structures and Algorithms"], "PDSA and other subjects textbooks?", "24f2000918", "2025-05-10");

  a.task49 = topReplier(T["Modern Application Development II"], "2025-01-01", "2025-12-31");
  a.task50 = totalPosts(T["English II"], "2025-01-01", "2025-09-30");

  await fs.writeFile("discourse-answers.json", JSON.stringify(a, null, 2));
  console.log("\nFINAL ANSWERS\n");
  console.log(JSON.stringify(a, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
