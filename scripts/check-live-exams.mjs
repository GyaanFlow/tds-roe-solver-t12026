// Compares the LIVE exam bundles with what this repo has built, so a new question, a moved deadline or a changed marking
// rule is noticed the day it happens instead of when a student reports it.
//
//   node scripts/check-live-exams.mjs            # all T3 exams listed in tds-config.json
//   node scripts/check-live-exams.mjs ga4 p1     # only these exams
//
// Needs the network, so it is deliberately not part of `npm run check`. Exit code 1 means something drifted.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'tds-config.json'), 'utf8'));
const TERM = 'T32026';
const wanted = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const exams = (wanted.length ? wanted : config.terms[TERM].exams);
const SHOW = 12;

// Question ids as the bundle declares them: `let a = "q-..."`, `id: "q-..."` or `x = "q-..."`. HTML attributes such as
// id="q-..." or for="q-..." (form fields inside a question) are not questions and are skipped.
const ID_PATTERN = /(?:let\s+(\w+)\s*=|\bid:|(?<![\w$.-])(\w+)\s*=)\s*"(q-[a-z0-9-]{4,})"/g;
const HTML_ATTRIBUTES = new Set(['id', 'for', 'name', 'htmlFor']);

function questionIds(source) {
  const ids = [];
  for (const m of source.matchAll(ID_PATTERN)) {
    const variable = m[1] || m[2];
    if (variable && HTML_ATTRIBUTES.has(variable)) continue;
    ids.push(m[3]);
  }
  return [...new Set(ids)];
}

/** Sentences of visible question text: the contents of template literals, tags removed. Formatting-proof. */
function prose(source) {
  const lines = new Set();
  for (const m of source.matchAll(/`([^`]*)`/g)) {
    const text = m[1]
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
      .replace(/\\n/g, '\n')
      .replace(/\$\{[^}]*\}/g, ' ')
      .replace(/<[^>]+>/g, '\n')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    for (const raw of text.split('\n')) {
      const line = raw.replace(/\s+/g, ' ').trim();
      // Prose only: skip anything that reads like code left over from a ${...} expression inside the template.
      const looksLikeCode = /^(let|var|const|return|await|if|else|for|while)\b|^\(+[\w$]+\.[\w$.]+\s*[=(]|^[\w$.]+\s*[:=(]|[;{}]|=>/.test(line);
      if (line.split(' ').length >= 5 && /^[A-Za-z0-9"'(\[*•\-–—]/.test(line) && !looksLikeCode) lines.add(line);
    }
  }
  return lines;
}

function snapshotPath(exam) {
  const candidates = [path.join(root, 'solvers', TERM, exam, 'exam-source.js'), path.join(root, `exam-tds-2026-09-${exam}.js`)];
  return candidates.find((file) => fs.existsSync(file)) || null;
}

let drift = false;
for (const exam of exams) {
  const url = `https://exam.sanand.workers.dev/exam-tds-2026-09-${exam}.js`;
  let live;
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    live = await response.text();
  } catch (error) {
    console.log(`${exam}: could not fetch ${url} (${error.message})`);
    drift = true;
    continue;
  }
  const registry = await import(pathToFileURL(path.join(root, 'solvers', TERM, exam, 'registry.js')).href);
  const built = registry.solvers.map((s) => s.id);
  const liveIds = questionIds(live);
  const missing = liveIds.filter((id) => !built.includes(id));
  const gone = built.filter((id) => !liveIds.includes(id));
  const orderLive = liveIds.filter((id) => built.includes(id));
  const orderBuilt = built.filter((id) => liveIds.includes(id));
  const problems = [];
  if (missing.length) problems.push(`NEW in the live exam, not built: ${missing.join(', ')}`);
  if (gone.length) problems.push(`built but no longer in the live exam: ${gone.join(', ')}`);
  if (!missing.length && !gone.length && JSON.stringify(orderLive) !== JSON.stringify(orderBuilt)) problems.push('question order changed');

  const snapshot = snapshotPath(exam);
  let textNote = 'no saved snapshot to compare text with';
  if (snapshot) {
    const before = prose(fs.readFileSync(snapshot, 'utf8'));
    const now = prose(live);
    const added = [...now].filter((line) => !before.has(line));
    const removed = [...before].filter((line) => !now.has(line));
    // The two generic bonus-banner sentences appear in every bundle; they are not question changes.
    const generic = (line) => /^Students who attempted it will receive|^It originally carried 0 marks/.test(line);
    const realAdded = added.filter((line) => !generic(line));
    const realRemoved = removed.filter((line) => !generic(line));
    textNote = `question text: +${realAdded.length} -${realRemoved.length}`;
    if (realAdded.length || realRemoved.length) {
      problems.push(`question text changed (${textNote})`);
      for (const line of realAdded.slice(0, SHOW)) problems.push(`   + ${line.slice(0, 200)}`);
      for (const line of realRemoved.slice(0, SHOW)) problems.push(`   - ${line.slice(0, 200)}`);
      if (realAdded.length + realRemoved.length > SHOW * 2) problems.push('   … (more lines not shown)');
    }
  }
  if (problems.length) {
    drift = true;
    console.log(`${exam}: DRIFT (${liveIds.length} live ids, ${built.length} built)`);
    for (const p of problems) console.log(`  ${p}`);
  } else {
    console.log(`${exam}: in sync (${liveIds.length} questions; ${textNote})`);
  }
}
if (drift) {
  console.log('\nDrift found. Re-read the changed questions, update the solvers and the exam-source.js snapshot, then run this again.');
  process.exit(1);
}
console.log('\nAll checked exams match the live bundles.');
