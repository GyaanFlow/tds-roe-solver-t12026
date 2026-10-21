import { page, card, details, escapeHtml, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst } from './windows.js';
import { FIELDS, IDEAS, MAX_SECONDS, buildScript, countWords, suggestIdeas, WORDS_PER_SECOND } from './human-exchange-script.js';

export const id = 'q-audio-tds-human-exchange';
export const title = 'TDS Human Exchange: Offer something useful';

function fieldHtml(field) {
  const long = field.key !== 'title';
  const control = long
    ? `<textarea id="t3p1He_${field.key}" rows="2" style="min-height:56px;font-family:inherit;font-size:13px" placeholder="${escapeHtml(field.hint)}"></textarea>`
    : `<input type="text" id="t3p1He_${field.key}" maxlength="80" placeholder="${escapeHtml(field.hint)}">`;
  return `<div><label for="t3p1He_${field.key}">${escapeHtml(field.label)}</label>${control}</div>`;
}

function widgetHtml(email) {
  const ideas = suggestIdeas(email, 3);
  const options = IDEAS.map((idea) => `<option value="${escapeHtml(idea.id)}">${escapeHtml(idea.title)}</option>`).join('');
  return [
    `<div id="t3p1HeRoot" data-email="${escapeHtml(email)}">`,
    '<div class="p1-kicker">1 · Pick a starting idea (or write your own)</div>',
    `<p>Ideas picked for you: ${ideas.map((idea) => `<a href="#" onclick="window._t3p1He.load('${escapeHtml(idea.id)}');return false">${escapeHtml(idea.title)}</a>`).join(' · ')}</p>`,
    `<label for="t3p1HeIdea">Or choose from all ideas</label><select id="t3p1HeIdea" onchange="window._t3p1He.load(this.value)"><option value="">— choose —</option>${options}</select>`,
    '<div class="p1-kicker" style="margin-top:12px">2 · Make it yours — answer in short, plain words</div>',
    `<div class="p1-grid">${FIELDS.map(fieldHtml).join('')}</div>`,
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1He.build()">Build my 60-second script</button><button type="button" class="p1-btn ghost" onclick="window._t3p1He.clear()">Clear</button></div>',
    '<div id="t3p1HeStatus" class="p1-status" role="status"></div>',
    '<div class="p1-kicker" style="margin-top:12px">3 · Your script</div>',
    '<textarea id="t3p1HeScript" style="min-height:190px;font-family:inherit;font-size:14px" spellcheck="true"></textarea>',
    '<div id="t3p1HeMeter" class="p1-foot"></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1He.copy()">📋 Copy script</button><button type="button" class="p1-btn ghost" onclick="window._t3p1He.rehearse()">⏱ Start 60-second practice timer</button></div>',
    '<div id="t3p1HeTimer" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function buildGuide(email) {
  const status = windowStatus(WINDOWS.audio);
  const beginner = [
    '<ol>',
    '<li><strong>Think of one small thing you can do for a classmate.</strong> Anything legal and safe: testing their website, explaining a topic, checking a chart. The ideas list in the tool gives you a start.</li>',
    '<li><strong>Fill the seven boxes</strong> in the tool below, in short sentences. Each box answers one question: what they get, why it helps, what you do, how fast, what you will not do, and how they can check you did it.</li>',
    '<li><strong>Press “Build my 60-second script”.</strong> The tool writes what to say and tells you how many seconds it takes. Change any word you do not like.</li>',
    '<li><strong>Practise out loud</strong> with the practice timer. Speak in your own natural voice, slowly and clearly.</li>',
    '<li><strong>On the exam page, press “Record your Human Exchange offer”</strong> (your private link). Allow the microphone, record, <em>listen to your recording</em>, then upload.</li>',
    '<li><strong>Come back, type “recorded”</strong> in the box, press <strong>Check</strong>, then <strong>Save</strong>.</li>',
    '</ol>',
  ].join('');
  return page({
    title: '🎙️ TDS Human Exchange',
    chips: [
      { text: status.state === 'open' ? 'Open' : status.state === 'grace' ? 'Grace period' : status.state === 'before' ? 'Not open yet' : 'Closed', tone: toneForState(status.state) },
      { text: `Closes ${formatIst(WINDOWS.audio.closes)}`, tone: '' },
      { text: 'Max 60 seconds · 3 uploads', tone: '' },
    ],
    sections: [
      card('Deadline', `<p>${escapeHtml(status.text)}</p><p>${escapeHtml(WINDOWS.audio.note)} You can practise and re-record on your own device as often as you like — only an upload uses an attempt, and you cannot play an earlier upload back, so listen first.</p>`, 'accent'),
      card('Step by step for beginners', beginner),
      card('Script builder', widgetHtml(email), 'accent'),
      card('What a good offer sounds like', '<ul><li><strong>Specific:</strong> a buyer can picture exactly what arrives.</li><li><strong>Feasible:</strong> something you can really do in the time you promise.</li><li><strong>Verifiable:</strong> the buyer can check it was delivered (a recording, a document, screenshots).</li><li><strong>Yours:</strong> say what <em>you</em> will do — an agent can help you prepare, but the offer is your promise.</li></ul>'),
      details('Rules from the question (read once)', '<ul><li>The service must be legal and follow the IITM BS programme guidelines. No credentials, private data, unsafe activities, or contacting third parties without consent.</li><li>Use your <strong>own natural voice</strong>. Reading a script written with an agent is welcome; synthetic or cloned narration may lose a small amount of marks.</li><li>Speak in the language you are comfortable with. You do <em>not</em> need to deliver or trade this week.</li><li>The recorder is on the exam page and needs your private link (it expires after 20 minutes — reload the exam page for a new one). Do not share the link.</li><li>The answer box only says “recorded”; the exam checks the real upload on its server.</li></ul>'),
      details('Recording tips', '<ul><li>Use a quiet room, hold the phone or mic close, and test a 5-second clip first.</li><li>Speak a little slower than normal: about 2 words per second, so 60 seconds is roughly 125–135 words.</li><li>Stop after your last sentence; do not trail on. Under 60 seconds is fine.</li><li>Listen to the whole take before uploading. If it sounds rushed or unclear, record again — re-recording locally is free.</li></ul>'),
    ],
  });
}

function register() {
  if (typeof window === 'undefined' || window._t3p1He) return;
  const $ = (name) => document.getElementById(name);
  const emailOf = () => $('t3p1HeRoot')?.dataset.email || '';
  const read = () => Object.fromEntries(FIELDS.map((f) => [f.key, $(`t3p1He_${f.key}`)?.value ?? '']));
  const say = (elementId, text, tone) => {
    const el = $(elementId);
    if (!el) return;
    el.textContent = text;
    el.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd';
  };
  let timer = null;

  function meter() {
    const script = $('t3p1HeScript')?.value ?? '';
    const words = countWords(script);
    const seconds = words / WORDS_PER_SECOND;
    const over = seconds > MAX_SECONDS;
    say('t3p1HeMeter', `${words} words ≈ ${seconds.toFixed(0)} seconds at a calm pace (limit ${MAX_SECONDS}).${over ? ' Too long — cut some words.' : ''}`, over ? 'bad' : 'ok');
  }

  window._t3p1He = {
    load(ideaId) {
      const idea = IDEAS.find((item) => item.id === ideaId);
      if (!idea) return;
      for (const field of FIELDS) {
        const el = $(`t3p1He_${field.key}`);
        if (el) el.value = idea[field.key] ?? '';
      }
      say('t3p1HeStatus', `Loaded “${idea.title}”. Change any box to match what you can really do, then build the script.`, 'ok');
    },
    build() {
      const result = buildScript(read(), { email: emailOf() });
      const box = $('t3p1HeScript');
      if (box) box.value = result.script;
      meter();
      const notes = [...result.missing.length ? [`Fill in: ${result.missing.join(', ')}.`] : [], ...result.flags, ...result.warnings];
      say('t3p1HeStatus', notes.length ? notes.join(' ') : `Script ready — about ${result.seconds} seconds. Read it aloud once, then record it in your own voice.`, notes.length ? 'bad' : 'ok');
    },
    clear() {
      for (const field of FIELDS) { const el = $(`t3p1He_${field.key}`); if (el) el.value = ''; }
      const box = $('t3p1HeScript');
      if (box) box.value = '';
      say('t3p1HeStatus', '', '');
      meter();
    },
    async copy() {
      try {
        await navigator.clipboard.writeText($('t3p1HeScript')?.value ?? '');
        say('t3p1HeStatus', 'Script copied.', 'ok');
      } catch {
        $('t3p1HeScript')?.select?.();
        say('t3p1HeStatus', 'Press Ctrl+C to copy the selected script.', '');
      }
    },
    rehearse() {
      if (timer) clearInterval(timer);
      let left = MAX_SECONDS;
      say('t3p1HeTimer', `Go! ${left} s left — read your script aloud.`, 'ok');
      timer = setInterval(() => {
        left -= 1;
        if (left <= 0) { clearInterval(timer); timer = null; say('t3p1HeTimer', 'Time! A real recording must stop at 60 seconds. If you were not finished, shorten the script.', 'bad'); return; }
        say('t3p1HeTimer', `${left} s left`, left <= 10 ? 'bad' : 'ok');
      }, 1000);
    },
  };
  document.addEventListener?.('input', (event) => { if (event.target?.id === 't3p1HeScript') meter(); });
}

export async function solve(email) {
  register();
  const status = windowStatus(WINDOWS.audio);
  return {
    type: 'guide',
    answer: 'Record your offer in the audio recorder on the exam page (it is checked on the server). When the recorder confirms the upload, type: recorded',
    variant: `Recording needed · ${status.state === 'open' ? 'open' : status.state}`,
    guide: buildGuide(String(email || '').trim()),
    answerDisplay: `### Type \`recorded\` after the recorder confirms your upload\n\n${status.text}\n\nUse the script builder in the Implementation Guide to prepare what to say.`,
    debug: { question: 'Q2', needsUserInput: true, windowState: status.state },
  };
}
