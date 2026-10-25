import { page, card, details } from './ui.js';
import { VIDEO_MAX_BYTES, bitrateLadder, checkHostedUrl, ease, rawGithubUrl, sniffVideo } from './face-logic.js';

export const id = 'q-face-morph-video';
export const title = 'Morph two faces into a video';

const SIZE = 256;
const FPS = 15;

function widgetHtml() {
  return [
    '<div id="t3ga3-morph">',
    '<p>This makes a small video in <strong>your own browser</strong> (nothing is uploaded). Save the two photos from the exam page to your device first, then choose them here: the <strong>From</strong> face first, the <strong>To</strong> face second.</p>',
    '<div class="p1-grid"><div><label for="t3mFrom">From face (image file)</label><input type="file" id="t3mFrom" accept="image/*"></div>',
    '<div><label for="t3mTo">To face (image file)</label><input type="file" id="t3mTo" accept="image/*"></div>',
    '<div><label for="t3mSecs">Length in seconds</label><select id="t3mSecs"><option>2</option><option selected>3</option><option>4</option></select></div></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn" id="t3mGo" onclick="window._t3ga3Morph.make()">Make my morph video</button></div>',
    '<div id="t3mStatus" class="p1-status" role="status"></div>',
    '<div id="t3mOut"></div>',
    '<hr style="border:0;border-top:1px solid var(--border,rgba(255,255,255,.14));margin:14px 0">',
    '<div class="p1-grid"><div><label for="t3mUser">Your GitHub username</label><input type="text" id="t3mUser"></div><div><label for="t3mRepo">Repository name</label><input type="text" id="t3mRepo" value="face-morph"></div><div><label for="t3mFile">File name</label><input type="text" id="t3mFile" value="morph.webm"></div></div>',
    '<div class="p1-actions"><button type="button" class="p1-btn ghost" onclick="window._t3ga3Morph.link()">Build my link</button><button type="button" class="p1-btn ghost" onclick="window._t3ga3Morph.check()">Check link text</button></div>',
    '<label for="t3mUrl" style="margin-top:8px">Your video link</label><input type="text" id="t3mUrl" placeholder="https://raw.githubusercontent.com/…/morph.webm">',
    '<div id="t3mLinkOut" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

const loadImage = (file) => new Promise((resolve, reject) => {
  if (!file || !/^image\//.test(file.type)) { reject(new Error('Choose an image file for both faces.')); return; }
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
  img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That image could not be opened. Try a JPG or PNG.')); };
  img.src = url;
});

/** Draws the image to fill the square, keeping the upper part (where faces are) in view. */
function drawCover(ctx, img, scale = 1) {
  const ratio = Math.max(SIZE / img.width, SIZE / img.height) * scale;
  const w = img.width * ratio;
  const h = img.height * ratio;
  ctx.drawImage(img, (SIZE - w) / 2, Math.min(0, (SIZE - h) * 0.3), w, h);
}

async function recordOnce(a, b, seconds, bitrate) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  const mime = ['video/webm;codecs=vp8', 'video/webm'].find((m) => window.MediaRecorder?.isTypeSupported?.(m));
  if (!mime) throw new Error('This browser cannot record video. Use Chrome, Edge or Firefox on a computer.');
  const stream = canvas.captureStream(FPS);
  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: bitrate });
  const chunks = [];
  recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
  const done = new Promise((resolve) => { recorder.onstop = resolve; });
  const hold = 0.3;
  const start = performance.now();
  recorder.start();
  await new Promise((resolve) => {
    const frame = () => {
      const t = (performance.now() - start) / 1000;
      const mix = ease((t - hold) / Math.max(0.1, seconds - 2 * hold));
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, SIZE, SIZE);
      drawCover(ctx, a, 1 + 0.04 * mix);
      ctx.globalAlpha = mix;
      drawCover(ctx, b, 1.04 - 0.04 * mix);
      ctx.globalAlpha = 1;
      if (t >= seconds) resolve(); else setTimeout(frame, 1000 / FPS);
    };
    frame();
  });
  recorder.stop();
  await done;
  stream.getTracks().forEach((track) => track.stop());
  return new Blob(chunks, { type: 'video/webm' });
}

function register() {
  if (typeof window === 'undefined' || window._t3ga3Morph) return;
  const $ = (name) => document.getElementById(name);
  const say = (el, text, tone) => { const node = $(el); if (!node) return; node.textContent = text; node.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd'; };
  window._t3ga3Morph = {
    async make() {
      const go = $('t3mGo');
      try {
        go.disabled = true;
        const [a, b] = await Promise.all([loadImage($('t3mFrom')?.files?.[0]), loadImage($('t3mTo')?.files?.[0])]);
        const seconds = Number($('t3mSecs')?.value) || 3;
        let best = null;
        for (const [i, bitrate] of bitrateLadder(seconds).entries()) {
          say('t3mStatus', `Recording attempt ${i + 1} (keep this tab open for ${seconds} seconds)…`, '');
          const blob = await recordOnce(a, b, seconds, bitrate);
          const check = sniffVideo(new Uint8Array(await blob.arrayBuffer()));
          if (check.ok) { best = { blob, bytes: check.bytes }; break; }
          if (check.message !== 'Video must be under 100 KB (100,000 bytes).') throw new Error(check.message);
        }
        if (!best) throw new Error(`Could not get the video under ${VIDEO_MAX_BYTES.toLocaleString('en-US')} bytes. Try a shorter length (2 seconds).`);
        const url = URL.createObjectURL(best.blob);
        $('t3mOut').innerHTML = `<video src="${url}" controls loop autoplay muted playsinline style="width:${SIZE}px;max-width:100%;border-radius:8px"></video><p><a class="p1-btn" download="morph.webm" href="${url}">Download morph.webm</a></p>`;
        say('t3mStatus', `Done: ${best.bytes.toLocaleString('en-US')} bytes (limit ${VIDEO_MAX_BYTES.toLocaleString('en-US')}). Download it, then upload it to GitHub as shown above.`, 'ok');
      } catch (error) {
        say('t3mStatus', error?.message || 'Could not make the video.', 'bad');
      } finally {
        go.disabled = false;
      }
    },
    link() {
      const url = rawGithubUrl($('t3mUser')?.value, $('t3mRepo')?.value, $('t3mFile')?.value);
      if (!url) { say('t3mLinkOut', 'Fill in your GitHub username, repository name and file name (no spaces).', 'bad'); return; }
      $('t3mUrl').value = url;
      say('t3mLinkOut', url, 'ok');
    },
    check() {
      const result = checkHostedUrl($('t3mUrl')?.value, ['mp4', 'webm']);
      say('t3mLinkOut', result.ok ? 'The link looks right. Open it in a private window to see the video play.' : result.message, result.ok ? 'ok' : 'bad');
    },
  };
}

export async function solve() {
  register();
  const guide = page({
    title,
    chips: [{ text: '0.5 marks: playable video', tone: '' }, { text: '4 marks: classmate review', tone: '' }, { text: 'Under 100 KB', tone: 'warn' }],
    sections: [
      card('Your task', `<p>The exam page shows two faces (From and To), different for every student. Make a short video that turns the first face smoothly into the second, then submit a public HTTPS link to an <strong>MP4 or WebM</strong> file smaller than <strong>${VIDEO_MAX_BYTES.toLocaleString('en-US')} bytes</strong>. Check gives 0.5 marks for a playable video; classmates rate how smooth it looks for 4 more marks later.</p>`, 'accent'),
      card('Step by step for beginners', '<ol><li>On the exam page, right-click the <strong>From</strong> photo and save it. Then save the <strong>To</strong> photo.</li><li>Use the maker below: choose the From file, then the To file, and press <strong>Make my morph video</strong>. Wait while it records (a few seconds). It makes a small WebM that is already under the size limit.</li><li>Press <strong>Download</strong>. Play it once to check it looks smooth.</li><li>Put it online: create a <em>public</em> GitHub repository, press <strong>Add file → Upload files</strong>, drag the video in, press <strong>Commit changes</strong>. Then click the file, press <strong>Raw</strong>, and copy the address (starts with <code>https://raw.githubusercontent.com/</code>). The tool below can also build it.</li><li>Paste the link in the exam Answer box and press <strong>Check</strong>, then <strong>Save</strong>.</li></ol>'),
      card('Video maker and link helper', widgetHtml(), 'accent'),
      card('Want a more convincing morph?', '<p>The maker above does a smooth cross-dissolve with a slight zoom, which is enough for Check. Classmates score how natural the change looks, so for a better one:</p><ol><li>Use a free face-morph tool (search for “face morph video online”) with your two photos, keep the clip short (2 to 3 seconds).</li><li>Shrink it to under 100 KB: lower the resolution to about 240 to 320 pixels wide, 10 to 15 frames per second, no sound. An online “video compressor” can do this; check the exact size in your file properties (<strong>must be below 100,000 bytes</strong>).</li><li>Line up the eyes of the two photos before morphing; it makes the change look much more natural.</li></ol>'),
      details('If something goes wrong', '<ul><li><strong>“Could not fetch the video”</strong>: the link is not public, or the host blocks other websites. Use a GitHub Raw link.</li><li><strong>“Submit a valid MP4 or WebM”</strong>: you linked a web page. Use the Raw link to the file itself.</li><li><strong>Too big</strong>: choose 2 seconds and make it again, or compress further.</li><li>The maker needs a computer browser with video recording (Chrome, Edge or Firefox).</li></ul>'),
    ],
  });
  return {
    type: 'guide',
    answer: 'Make a small MP4/WebM morph (under 100,000 bytes) of your two assigned faces, host it publicly, and submit the direct HTTPS link.',
    variant: 'Morph video · maker + guide',
    guide,
    answerDisplay: '### Morph two faces into a video\n\nUse the maker in the Implementation Guide with your two photos, download the WebM (under 100,000 bytes), upload it to a public GitHub repository, and submit its Raw link.',
    debug: { question: 'Q7', needsUserInput: true, maxBytes: VIDEO_MAX_BYTES },
  };
}
