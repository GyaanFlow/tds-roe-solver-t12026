import { page, card, details, escapeHtml } from '../p1/ui.js';
import { clickToPixel, composeAnswer, findRedBall, parseFrames } from './ga5-tools.js';
import { decodePng, trackBall } from './tracker.js';
import { helperCard } from './helper-card.js';

export const id = 'q-ball-tracker-server';
export const title = 'Track the red ball';

// A small Python helper the student (or their coding assistant) can use to unpack the frames and start a tracker.
export const EXTRACTOR_PY = `#!/usr/bin/env python3
"""Unpack the Track-the-red-ball frames file into numbered PNG pictures.

Layout (all numbers big-endian uint32): fps, frame count, three target frame numbers, then for each frame
a length followed by that many PNG bytes.

    python ball_frames.py frames.bin frames_out
"""
import os
import struct
import sys

path, out = sys.argv[1], (sys.argv[2] if len(sys.argv) > 2 else "frames_out")
data = open(path, "rb").read()
fps, count, t1, t2, t3 = struct.unpack(">5I", data[:20])
print(f"fps={fps} frames={count} target frames={t1}, {t2}, {t3}")
os.makedirs(out, exist_ok=True)
at = 20
for i in range(count):
    (n,) = struct.unpack(">I", data[at:at + 4])
    at += 4
    open(os.path.join(out, f"{i:05d}.png"), "wb").write(data[at:at + n])
    at += n
print(f"wrote {count} PNG files to {out}/ (frame numbers start at 0; pixel (0,0) is the top-left corner)")
`;

let loaded = null; // { bytes, parsed } for the file the student chose (kept in memory only)
const marks = [null, null, null];
let current = 0;
let natural = { w: 0, h: 0 };

function widgetHtml() {
  return [
    '<div id="t3ga5Ball">',
    '<p>Save your frames file (steps above), then choose it here. The pictures stay in your browser; nothing is uploaded.</p>',
    '<input type="file" id="t3ga5BallFile" onchange="window._t3ga5Ball.load()">',
    '<div id="t3ga5BallStatus" class="p1-status" role="status"></div>',
    '<div id="t3ga5BallBox" style="display:none">',
    '<div class="p1-actions"><button type="button" class="p1-btn" id="t3ga5BallAuto" onclick="window._t3ga5Ball.auto()">Track my ball automatically</button></div>',
    '<div id="t3ga5BallAutoStatus" class="p1-status" role="status"></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3ga5Ball.step(-10)">−10</button><button type="button" class="p1-btn ghost" onclick="window._t3ga5Ball.step(-1)">−1</button><button type="button" class="p1-btn ghost" onclick="window._t3ga5Ball.step(1)">+1</button><button type="button" class="p1-btn ghost" onclick="window._t3ga5Ball.step(10)">+10</button><span id="t3ga5BallFrame" class="mono"></span></div>',
    '<input type="range" id="t3ga5BallSlider" min="0" max="0" value="0" style="width:100%" oninput="window._t3ga5Ball.go(Number(this.value))">',
    '<div class="p1-actions" id="t3ga5BallTargets"></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3ga5Ball.red()">Find my red ball (frame 0)</button><label style="margin:0">Zoom <select id="t3ga5BallZoom" onchange="window._t3ga5Ball.zoom()"><option value="1">1×</option><option value="2" selected>2×</option><option value="3">3×</option><option value="4">4×</option></select></label></div>',
    '<div style="overflow:auto;max-width:100%;border:1px solid var(--border,rgba(255,255,255,.14));border-radius:8px"><canvas id="t3ga5BallCanvas" style="display:block;cursor:crosshair" onclick="window._t3ga5Ball.click(event)"></canvas></div>',
    '<div id="t3ga5BallPos" class="p1-status" role="status"></div>',
    '<label for="t3ga5BallNumber" style="margin-top:8px">The number on your ball at the end</label><input type="text" id="t3ga5BallNumber" inputmode="numeric" placeholder="e.g. 42" oninput="window._t3ga5Ball.compose()">',
    '<div id="t3ga5BallMarks" class="p1-status" role="status"></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn" id="t3ga5BallFill" disabled onclick="window._t3ga5Ball.fill()">Put my answer in the answer box</button></div>',
    '<pre id="t3ga5BallAnswer" class="mono" style="white-space:pre-wrap"></pre>',
    '</div>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3ga5Ball) return;
  const $ = (name) => document.getElementById(name);
  const say = (text, ok) => { const el = $('t3ga5BallStatus'); if (el) { el.textContent = text; el.style.color = ok ? '#34d399' : '#f87171'; } };
  let composed = '';

  async function bitmap(index) {
    const [start, length] = loaded.parsed.frames[index];
    return createImageBitmap(new Blob([loaded.bytes.subarray(start, start + length)], { type: 'image/png' }));
  }

  async function draw() {
    const canvas = $('t3ga5BallCanvas');
    if (!loaded || !canvas) return;
    const image = await bitmap(current);
    natural = { w: image.width, h: image.height };
    canvas.width = image.width; canvas.height = image.height;
    const scale = Number($('t3ga5BallZoom')?.value) || 1;
    canvas.style.width = `${image.width * scale}px`; canvas.style.height = `${image.height * scale}px`;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);
    image.close?.();
    const mark = marks[loaded.parsed.targets.indexOf(current)];
    if (mark) {
      ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(mark.x - 12, mark.y + 0.5); ctx.lineTo(mark.x + 13, mark.y + 0.5); ctx.moveTo(mark.x + 0.5, mark.y - 12); ctx.lineTo(mark.x + 0.5, mark.y + 13); ctx.stroke();
    }
    $('t3ga5BallFrame').textContent = `frame ${current} of ${loaded.parsed.count - 1}`;
    $('t3ga5BallSlider').value = String(current);
  }

  function renderTargets() {
    const box = $('t3ga5BallTargets');
    if (!box || !loaded) return;
    box.innerHTML = loaded.parsed.targets.map((t, i) => `<button type="button" class="p1-btn ${marks[i] ? '' : 'ghost'}" onclick="window._t3ga5Ball.go(${t})">Target ${i + 1}: frame ${t}${marks[i] ? ` ✓ ${marks[i].x},${marks[i].y}` : ''}</button>`).join('');
  }

  window._t3ga5Ball = {
    async load() {
      const file = $('t3ga5BallFile')?.files?.[0];
      if (!file) return;
      try {
        if (file.size > 400 * 1024 * 1024) throw new Error('That file is too big to be the frames file.');
        const bytes = new Uint8Array(await file.arrayBuffer());
        const parsed = parseFrames(bytes);
        if (!parsed.ok) throw new Error(parsed.message);
        loaded = { bytes, parsed };
        marks[0] = marks[1] = marks[2] = null;
        $('t3ga5BallBox').style.display = 'block';
        $('t3ga5BallSlider').max = String(parsed.count - 1);
        say(`Loaded ${parsed.count} frames at ${parsed.fps} frames per second. Your three target frames are ${parsed.targets.join(', ')}.`, true);
        renderTargets();
        current = 0;
        await draw();
        window._t3ga5Ball.compose();
      } catch (error) {
        loaded = null;
        if ($('t3ga5BallBox')) $('t3ga5BallBox').style.display = 'none';
        say(error?.message || 'That file could not be read.', false);
      }
    },
    async auto() {
      if (!loaded) return;
      const button = $('t3ga5BallAuto');
      const status = $('t3ga5BallAutoStatus');
      const tell = (text, ok) => { if (status) { status.textContent = text; status.style.color = ok === false ? '#f87171' : ok ? '#34d399' : '#93c5fd'; } };
      const job = loaded;
      try {
        button.disabled = true;
        tell('Tracking (a minute or two; keep this tab open)…');
        const result = await trackBall({
          count: job.parsed.count,
          targets: job.parsed.targets,
          frameAt: (i) => decodePng(job.bytes.subarray(job.parsed.frames[i][0], job.parsed.frames[i][0] + job.parsed.frames[i][1])),
          onProgress: (f, n) => tell(`Tracking: frame ${f} of ${n}`),
        });
        if (loaded !== job) return;
        result.positions.forEach((point, i) => { marks[i] = { x: Math.round(point[0]), y: Math.round(point[1]) }; });
        $('t3ga5BallNumber').value = String(result.number);
        renderTargets();
        window._t3ga5Ball.compose();
        await window._t3ga5Ball.go(job.parsed.targets[0]);
        tell(`Done: ball number ${result.number}. The line is below.${result.margin < 3 ? ' Two balls came very close once, so check the three marks by eye.' : ' You can step through the frames to check it.'}`, true);
      } catch (error) {
        tell(error?.message || 'Tracking failed.', false);
      } finally {
        button.disabled = false;
      }
    },
    async go(frame) { if (!loaded) return; current = Math.max(0, Math.min(loaded.parsed.count - 1, Math.round(frame))); await draw(); },
    step(delta) { return window._t3ga5Ball.go(current + delta); },
    zoom() { return draw(); },
    async red() {
      if (!loaded) return;
      await window._t3ga5Ball.go(0);
      const canvas = $('t3ga5BallCanvas');
      const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      const found = findRedBall(data.data, canvas.width, canvas.height);
      $('t3ga5BallPos').textContent = found ? `Your red ball starts near x=${found.x}, y=${found.y} in frame 0. Follow it from there.` : 'No red ball found in frame 0. Look for it by eye, or check that this is your own frames file.';
      if (found) {
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = '#00e5ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(found.x, found.y, 14, 0, Math.PI * 2); ctx.stroke();
      }
    },
    async click(event) {
      if (!loaded) return;
      const canvas = $('t3ga5BallCanvas');
      const point = clickToPixel(event.clientX, event.clientY, canvas.getBoundingClientRect(), natural.w, natural.h);
      if (!point) return;
      const slot = loaded.parsed.targets.indexOf(current);
      $('t3ga5BallPos').textContent = slot >= 0 ? `Marked target ${slot + 1} (frame ${current}) at x=${point.x}, y=${point.y}.` : `You clicked x=${point.x}, y=${point.y} in frame ${current}. This is not a target frame, so it is not saved.`;
      if (slot >= 0) { marks[slot] = point; renderTargets(); window._t3ga5Ball.compose(); await draw(); }
    },
    compose() {
      const result = composeAnswer($('t3ga5BallNumber')?.value, marks);
      composed = result.ok ? result.text : '';
      if ($('t3ga5BallFill')) $('t3ga5BallFill').disabled = !result.ok;
      const done = marks.filter(Boolean).length;
      if ($('t3ga5BallMarks')) { $('t3ga5BallMarks').textContent = result.ok ? 'Ready.' : `${done} of 3 target frames marked. ${result.message}`; $('t3ga5BallMarks').style.color = result.ok ? '#34d399' : ''; }
      if ($('t3ga5BallAnswer')) $('t3ga5BallAnswer').textContent = composed;
    },
    fill() {
      if (!composed) return;
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, { type: 'solved', answer: composed, variant: 'Ball number and centres', answerDisplay: '### Your reading\n\nPress **Check**, then **Save**.' });
      const out = $('t3ga5BallMarks');
      if (out) { out.style.color = '#34d399'; out.textContent = patched ? 'Done. The answer box has your reading. Press Check, then Save.' : 'Copy the line above into the exam box yourself, then press Check and Save.'; }
    },
  };
}

function buildGuide() {
  return page({
    title: '🔴 Track the red ball',
    chips: [{ text: 'Needs your own video', tone: 'warn' }, { text: '2 marks', tone: '' }, { text: 'Automatic tracking', tone: 'ok' }],
    sections: [
      card('What this is', '<p class="p1-note"><strong>100 balls bounce in a circle. Your ball is red at the start, then turns grey like the others and the balls start colliding. When they stop, every ball shows a number. You report the number on YOUR ball and your ball\'s centre (x, y) in three target frames.</strong></p><p>The video is unique to you and only your signed-in exam page can download its frames. The one-line helper below tracks it there for you; or save the frames file and use the tracker on this page.</p>', 'accent'),
      helperCard(),
      card('Step by step for beginners', '<p>Only needed if you do not use the helper above.</p><ol><li>On the exam page press <strong>Make my video</strong> and wait. It shows your <strong>three target frame numbers</strong>. (Frames count from 0; pixels count from the top-left corner.)</li><li><strong>Save your frames file:</strong> open the browser\'s developer tools (right-click → Inspect), go to <strong>Network</strong>, reload the exam page and press Make my video again, find the request named <code>questionData…q-ball-tracker-server</code>, right-click it → <strong>Save response as…</strong> (or Copy → Save as file) and keep the file.</li><li>Choose that file in the viewer below and press <strong>Track my ball automatically</strong>. If it succeeds, skip to the last step.</li><li>If it cannot track it, press <strong>Find my red ball</strong> and follow it by hand:</li><li><strong>Follow your ball</strong> with the frame buttons or the slider: it turns grey, so keep watching where it goes, especially at collisions (two balls swap directions when they touch). Use zoom 2× to 4× and step 1 frame at a time through collisions.</li><li>Jump to <strong>Target 1</strong>, click the exact centre of your ball, then do the same for Target 2 and Target 3. A cyan cross shows each mark.</li><li>Go to the <strong>last frame</strong>, zoom in on your ball and read the number written on it. Type it in.</li><li>Press <strong>Put my answer in the answer box</strong>, then on the exam page press <strong>Check</strong> and <strong>Save</strong>. The format is <code>number; x,y; x,y; x,y</code>.</li></ol>'),
      card('Frame viewer and answer maker', widgetHtml(), 'accent'),
      card('Want to automate it? (for Python users and coding assistants)', `<p>Following one of 100 identical balls through many collisions by eye is slow. If you would rather write a tracker (AI help is allowed), this small script unpacks the file into numbered pictures first. Save it as <code>ball_frames.py</code> and run <code>python ball_frames.py frames.bin frames_out</code>.</p><p><a class="p1-btn ghost" href="data:text/x-python;charset=utf-8,${encodeURIComponent(EXTRACTOR_PY)}" download="ball_frames.py">Download ball_frames.py</a></p><pre class="mono" style="white-space:pre-wrap;max-height:260px;overflow:auto">${escapeHtml(EXTRACTOR_PY).split('\n').map((line) => (line.trim() === '' ? '&#8203;' : line)).join('\n')}</pre><p class="p1-foot">Idea for a tracker: find the red blob in frame 0, detect all ball centres in every frame, and link each ball to the nearest predicted position (position plus velocity), taking care when two balls touch. Check the three target frames with the viewer above before you submit.</p>`),
      details('If something goes wrong', '<ul><li><strong>“not the frames file”:</strong> you saved a web page instead of the response. Save the request named <code>questionData</code> itself, unchanged.</li><li><strong>“file stops early”:</strong> the download was cut short; reload and save it again.</li><li><strong>The ball turned grey and I lost it:</strong> go back to the last frame where you were sure and step one frame at a time through the next collision.</li><li><strong>Marks are off by a little:</strong> click the centre of the ball, not its edge, and use zoom 4×.</li></ul>'),
    ],
  });
}

export async function solve() {
  loaded = null;
  marks[0] = marks[1] = marks[2] = null;
  register();
  return {
    type: 'guide',
    answer: 'Run the one-line helper on your exam page (it tracks your ball and fills Q3), or load your frames file here and press Track my ball automatically. Format: number; x,y; x,y; x,y',
    variant: 'Your own video · automatic tracker',
    guide: buildGuide(),
    answerDisplay: '### Track your ball\n\nEasiest: run the one-line helper (Implementation Guide) on your signed-in exam page; it downloads your frames, tracks the ball and fills Q3.\n\nOr save your frames file, load it in the viewer here and press **Track my ball automatically**. Format: `number; x,y; x,y; x,y`.',
    debug: { question: 'Q3', needsUserInput: true },
  };
}
