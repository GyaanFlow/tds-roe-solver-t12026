import { page, card, details, escapeHtml, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst } from './windows.js';
import { NO_WORDS_CHECKLIST, buildPicturePrompt, buildStory, squareCrop } from './trade-marks.js';
import { receiptWidgetHtml, registerReceiptWidget } from './receipt-ui.js';

export const id = 'q-trading-picture-story';
export const title = 'Trading game: Picture Stories';

function toolsHtml() {
  return [
    '<div id="t3p1Ps">',
    '<div class="p1-kicker">1 · Write your story in three lines</div>',
    '<div class="p1-grid"><div><label for="t3p1PsA">The situation (who is there, what is happening)</label><input type="text" id="t3p1PsA" placeholder="e.g. A small robot sits alone in the rain holding a broken umbrella"></div>',
    '<div><label for="t3p1PsB">What changes</label><input type="text" id="t3p1PsB" placeholder="e.g. A girl notices it and shares her big umbrella"></div>',
    '<div><label for="t3p1PsC">How it ends</label><input type="text" id="t3p1PsC" placeholder="e.g. They walk away together under the sun"></div>',
    '<div><label for="t3p1PsN">Number of panels (1 to 4)</label><input type="text" id="t3p1PsN" inputmode="numeric" value="3"></div></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3p1Ps.story()">Make my story and picture prompt</button></div>',
    '<div id="t3p1PsOut" class="p1-status" role="status"></div>',
    '<div class="p1-kicker" style="margin-top:14px">2 · Make your picture square</div>',
    '<p>Choose your finished picture (drawing photo, collage or AI image). The tool cuts the middle square and shrinks it. It runs in your browser only.</p>',
    '<input type="file" id="t3p1PsFile" accept="image/*">',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3p1Ps.square()">Make it square</button></div>',
    '<div id="t3p1PsSquare" class="p1-status" role="status"></div><div id="t3p1PsPreview"></div>',
    '<div class="p1-kicker" style="margin-top:14px">3 · No-words checklist (tick every line)</div>',
    NO_WORDS_CHECKLIST.map((line, i) => `<label style="display:flex;gap:8px;align-items:flex-start;margin:0 0 6px;color:inherit"><input type="checkbox" data-ps="${i}" onchange="window._t3p1Ps.tick()" style="margin-top:4px"><span>${escapeHtml(line)}</span></label>`).join(''),
    '<div id="t3p1PsTick" class="p1-status" role="status">0 of 5 ticked</div>',
    '</div>',
  ].join('');
}

function register() {
  registerReceiptWidget();
  if (typeof window === 'undefined' || window._t3p1Ps) return;
  const $ = (name) => document.getElementById(name);
  const value = (name) => $(name)?.value ?? '';
  window._t3p1Ps = {
    story() {
      const out = $('t3p1PsOut');
      if (!out) return;
      const input = { situation: value('t3p1PsA'), change: value('t3p1PsB'), outcome: value('t3p1PsC'), panels: value('t3p1PsN') };
      const story = buildStory(input);
      const prompt = buildPicturePrompt(input);
      if (!story.ok) { out.style.color = '#f87171'; out.textContent = story.message; return; }
      out.style.color = '';
      out.innerHTML = `<p><strong>Your story</strong> (paste it in the game\'s private story box):</p><pre class="mono" style="white-space:pre-wrap">${escapeHtml(story.story)}</pre><p><strong>Prompt for an AI image tool</strong> (or use it as a drawing plan):</p><pre class="mono" style="white-space:pre-wrap">${escapeHtml(prompt.prompt)}</pre>`;
    },
    async square() {
      const out = $('t3p1PsSquare');
      const file = $('t3p1PsFile')?.files?.[0];
      const say = (text, ok) => { if (out) { out.textContent = text; out.style.color = ok ? '#34d399' : '#f87171'; } };
      try {
        if (!file || !/^image\//.test(file.type)) throw new Error('Choose an image file first.');
        const url = URL.createObjectURL(file);
        const img = await new Promise((resolve, reject) => { const el = new Image(); el.onload = () => resolve(el); el.onerror = () => reject(new Error('That image could not be opened. Try a JPG or PNG.')); el.src = url; });
        URL.revokeObjectURL(url);
        const crop = squareCrop(img.naturalWidth, img.naturalHeight, 1024);
        if (!crop) throw new Error('That image has no size.');
        const canvas = document.createElement('canvas');
        canvas.width = crop.out; canvas.height = crop.out;
        canvas.getContext('2d').drawImage(img, crop.sx, crop.sy, crop.side, crop.side, 0, 0, crop.out, crop.out);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
        const href = URL.createObjectURL(blob);
        $('t3p1PsPreview').innerHTML = `<img src="${href}" alt="Your square picture" style="width:220px;max-width:100%;border-radius:8px;display:block;margin:8px 0"><a class="p1-btn" download="story-square.jpg" href="${href}">Download square picture</a>`;
        say(`Done: ${crop.out}×${crop.out} pixels. Look at the preview: if something important was cut off, redraw it nearer the middle.`, true);
      } catch (error) {
        say(error?.message || 'Could not make the picture square.', false);
      }
    },
    tick() {
      const n = document.querySelectorAll('#t3p1Ps input[data-ps]:checked').length;
      if ($('t3p1PsTick')) $('t3p1PsTick').textContent = `${n} of ${NO_WORDS_CHECKLIST.length} ticked`;
    },
  };
}

function buildGuide() {
  const create = windowStatus(WINDOWS.pictureCreate);
  const narrate = windowStatus(WINDOWS.pictureNarrate);
  const receipt = windowStatus(WINDOWS.pictureReceipt);
  const state = create.state === 'open' ? 'open' : narrate.state === 'open' ? 'narrate' : create.state;
  return page({
    title: '🖼️ Picture Stories',
    chips: [{ text: state === 'open' ? 'Create now' : state === 'narrate' ? 'Narrate now' : state === 'before' ? 'Not open yet' : 'Closed', tone: toneForState(state === 'narrate' ? 'open' : state) }, { text: `Create until ${formatIst(WINDOWS.pictureCreate.closes)}`, tone: '' }, { text: '10 marks', tone: '' }],
    sections: [
      card('The three stages', `<p class="p1-note"><strong>Make one wordless picture, then narrate 10 classmates\' pictures and rank them.</strong></p><ul><li><strong>Create</strong> (${escapeHtml(formatIst(WINDOWS.pictureCreate.opens))} to ${escapeHtml(formatIst(WINDOWS.pictureCreate.closes))}): ${escapeHtml(create.text)}</li><li><strong>Narrate and rank</strong> (to ${escapeHtml(formatIst(WINDOWS.pictureNarrate.closes))}): ${escapeHtml(narrate.text)}</li><li><strong>Final receipt:</strong> ${escapeHtml(receipt.text)}</li></ul>`, 'accent'),
      card('Step by step for beginners', '<ol><li><strong>Think of a tiny story</strong> with three parts: the situation, a change, the outcome. Funny, kind or surprising stories are easy to understand and remember.</li><li><strong>Make the picture.</strong> Draw it on paper and take a photo, make a collage, or use an AI image tool (the planner below writes a prompt that forbids words). One to four panels work best.</li><li><strong>No words at all.</strong> No letters, numbers, captions, signatures or text in speech bubbles, not even on a sign in the background. An AI checks every picture, and any word means 0 creator marks.</li><li><strong>Make it square</strong> with the tool below, and tick the checklist.</li><li><strong>Open the game</strong>, upload the picture, and write your story privately (the situation, what changes, the outcome). You can replace both until the create deadline.</li><li><strong>Narrate (after the create deadline):</strong> allow your microphone. A picture appears and a <strong>45-second recording starts at once</strong>. Say who is there, what changes and how it ends, in any language. You get one retake inside the same 45 seconds. Do this for 10 pictures; take breaks when you like.</li><li><strong>Rank</strong> each picture as better or worse than the ones you saw, judging <em>which is the better story</em>, not which looks prettier. At the end confirm your full order with Google.</li><li><strong>After the game closes,</strong> open it, go to <strong>Result</strong>, copy the <strong>final receipt</strong> and paste it in the exam box by the receipt deadline. Press <strong>Check</strong>, then <strong>Save</strong>.</li></ol>'),
      card('Story, picture and checklist tools', toolsHtml(), 'accent'),
      card('Check your final receipt', receiptWidgetHtml('stories', WINDOWS.pictureReceipt.opens)),
      details('How the marks work', '<ul><li><strong>Creator, 5:</strong> 2.5 if an AI reading a classmate\'s narration picks YOUR story out of five, and 2.5 for how highly readers rank it.</li><li><strong>Reader, 5:</strong> 1 for finishing (0.08 per narration up to 10, plus 0.2 for confirming your order), and the rest for how well your narrations match each author\'s story and how your ranking agrees with others.</li><li>Clear, specific narration beats long narration: say who, what changed, how it ends.</li></ul>'),
      details('Narration script for 45 seconds', '<ol><li>“I see…” (who and where, one sentence, about 8 seconds)</li><li>“Then…” (the change, one or two sentences, about 15 seconds)</li><li>“In the end…” (the outcome, one sentence, about 8 seconds)</li><li>Stop. Do not pad; clear beats long.</li></ol>'),
      details('Privacy', '<p>The game asks for your consent before it records your voice (up to 45 seconds per picture) and stores your picture, story, recordings and rankings for research and marking. Read it before you agree. Never put real names, faces of people who did not agree, or private details in your picture or story.</p>'),
    ],
  });
}

export async function solve() {
  register();
  const create = windowStatus(WINDOWS.pictureCreate);
  return {
    type: 'guide',
    answer: 'Play in the game (create a wordless picture, narrate and rank 10 pictures), then after it closes paste your final receipt from Result and press Check and Save.',
    variant: `Game + receipt · create ${create.state}`,
    guide: buildGuide(),
    answerDisplay: `### Create, narrate, then paste your final receipt\n\n${create.text}\n\nAfter the game closes, open **Result**, copy the final receipt, paste it here, and press Check then Save.`,
    debug: { question: 'Q7', needsUserInput: true, createState: create.state },
  };
}
