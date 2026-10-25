import { page, card, details, escapeHtml } from './ui.js';
import { GLB_MAX_BYTES, checkHostedUrl, rawGithubUrl } from './face-logic.js';

export const id = 'q-3d-face-model';
export const title = 'Reconstruct a famous face in 3D';

// Every student gets a different person, so nothing here names one: the student types the name they see on the exam page
// (optional) and the guide fills it into file names and checklists.
const slug = (text) => String(text ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'face';

export function fileNames(person) {
  const base = slug(person);
  return { repo: `${base}-3d`, file: `${base}.glb` };
}

function widgetHtml() {
  return [
    '<div id="t3ga3-face3d">',
    '<p>Fill these in as you go. Nothing is uploaded from this box; it only prepares names and checks your link.</p>',
    '<div class="p1-grid">',
    '<div><label for="t3f3Person">Name of the person in your photo (shown on the exam page)</label><input type="text" id="t3f3Person" placeholder="e.g. Marie Curie"></div>',
    '<div><label for="t3f3User">Your GitHub username</label><input type="text" id="t3f3User" placeholder="e.g. my-name"></div>',
    '<div><label for="t3f3Repo">Repository name</label><input type="text" id="t3f3Repo" placeholder="filled in for you"></div>',
    '<div><label for="t3f3File">File name</label><input type="text" id="t3f3File" placeholder="filled in for you"></div>',
    '</div>',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3ga3Face.names()">Suggest repository and file names</button><button type="button" class="p1-btn ghost" onclick="window._t3ga3Face.link()">Build my link</button></div>',
    '<div id="t3f3Out" class="p1-status" role="status"></div>',
    '<hr style="border:0;border-top:1px solid var(--border,rgba(255,255,255,.14));margin:14px 0">',
    '<label for="t3f3Url">Already have a link? Paste it to check it</label><input type="text" id="t3f3Url" placeholder="https://raw.githubusercontent.com/…/face.glb">',
    '<div class="p1-actions"><button type="button" class="p1-btn" onclick="window._t3ga3Face.check()">Check my link</button></div>',
    '<div id="t3f3CheckOut" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3ga3Face) return;
  const $ = (name) => document.getElementById(name);
  const say = (el, text, tone) => { const node = $(el); if (!node) return; node.textContent = text; node.style.color = tone === 'bad' ? '#f87171' : tone === 'ok' ? '#34d399' : '#93c5fd'; };
  window._t3ga3Face = {
    names() {
      const names = fileNames($('t3f3Person')?.value);
      if ($('t3f3Repo')) $('t3f3Repo').value = names.repo;
      if ($('t3f3File')) $('t3f3File').value = names.file;
      say('t3f3Out', `Create a public repository called "${names.repo}" and upload a file called "${names.file}".`, 'ok');
    },
    link() {
      const url = rawGithubUrl($('t3f3User')?.value, $('t3f3Repo')?.value, $('t3f3File')?.value);
      if (!url) { say('t3f3Out', 'Fill in your GitHub username, repository name and file name (letters, numbers, dashes only; no spaces).', 'bad'); return; }
      say('t3f3Out', url, 'ok');
      if ($('t3f3Url')) $('t3f3Url').value = url;
    },
    check() {
      const result = checkHostedUrl($('t3f3Url')?.value, 'glb');
      say('t3f3CheckOut', result.ok ? `Looks right. ${result.warnings.join(' ')} Open it in a private window: it should download or show a file, not a web page.` : result.message, result.ok ? 'ok' : 'bad');
    },
  };
}

export async function solve() {
  register();
  const guide = page({
    title,
    chips: [{ text: '0.5 marks: file check', tone: '' }, { text: '7.5 marks: likeness review', tone: '' }, { text: 'Your own photo', tone: 'warn' }],
    sections: [
      card('Your task', `<p>The exam page shows <strong>one photograph of a famous person, different for every student</strong>. Create a rotatable 3D face of that person, then submit one direct public HTTPS link to a valid <code>.glb</code> file. The file must allow cross-origin requests and be no larger than <strong>${GLB_MAX_BYTES.toLocaleString('en-US')} bytes</strong>.</p><p class="p1-note">Use the photograph and name shown on <em>your</em> exam page. Nothing here can know your person, so the tools below ask you for it.</p>`, 'accent'),
      card('Step by step: make the 3D face', '<ol><li>On the exam page, right-click your photograph and save it to your device (or press “Open source photograph”).</li><li>Open <a href="https://www.meshy.ai/" target="_blank" rel="noopener noreferrer">Meshy</a> and sign in.</li><li>Choose <strong>Image to 3D</strong> and select <strong>Meshy 6 Lite</strong>.</li><li>Upload your saved photograph as the reference image. Use the supplied photograph, not a different person.</li><li>Generate the model and wait. Check that the face looks like the photograph, not a generic person.</li><li>Generate the texture too: click the large green texture button shown after the first generation, then wait for it to finish.</li><li>Rotate the preview: front, sides, back. If the likeness is poor, try again with a clearer image prepared by GPT or Gemini. Tell it to keep the person\'s distinctive features and match the reference exactly; do not ask it to invent a different face.</li><li>Export/download as <strong>GLB</strong> (glTF 2.0). Do not submit a screenshot, OBJ, ZIP, or a viewer-page link.</li></ol>'),
      card('Make the file fit the limit', `<ol><li>Check the downloaded file ends in <code>.glb</code> and see its size in your file properties.</li><li>If it is over ${GLB_MAX_BYTES.toLocaleString('en-US')} bytes, ask GPT to compress it. Prompt: <blockquote>Compress this attached 3D model into a valid GLB (glTF 2.0) no larger than 1,900,000 bytes. Preserve the face likeness, shape, and texture as much as possible. Return the compressed .glb file and tell me its exact byte size. Do not return a viewer link or change it to another format.</blockquote></li><li>Download the result and check its exact size again. If it is still too large, ask for another pass or lower the texture size.</li><li>Open the final GLB in a viewer and rotate it once. Keep a backup of the original export.</li></ol>`),
      card('Easy hosting with GitHub', '<ol><li>Sign in to <a href="https://github.com/" target="_blank" rel="noopener noreferrer">GitHub</a>.</li><li>Open <a href="https://github.com/new" target="_blank" rel="noopener noreferrer">github.com/new</a>. Use the repository name suggested by the tool below, choose <strong>Public</strong>, press <strong>Create repository</strong>. It must be public so the exam can download the model.</li><li>On the new repository page press <strong>Add file → Upload files</strong>, drag in your final GLB, and press <strong>Commit changes</strong>. You do not need GitHub Pages.</li><li>Click the uploaded file, press <strong>Raw</strong>, and copy the address. It starts with <code>https://raw.githubusercontent.com/</code>. Or let the tool below build it from your username, repository and file name.</li><li>Never submit the repository page or a <code>github.com/…/blob/…</code> link; those are preview pages.</li><li>Open the link in a private window where you are signed out. A file should download or show; if it says 404, the repository is not public or the name is wrong.</li></ol>'),
      card('Helper: names, link builder and link check', widgetHtml(), 'accent'),
      card('Run the exam check', '<ol><li>Paste the link in the Answer box and press <strong>Check</strong>. It verifies the link is reachable, allows CORS, is a valid GLB and is within the size limit (0.5 marks).</li><li>The other 7.5 marks come later from offline AI and peer review of how closely the model matches the photograph, so spend your effort on likeness.</li><li>If Check fails, make sure the repository is public, copy the link again using <strong>Raw</strong>, and recheck the file size. Keep the file online at the same address.</li></ol>'),
      details('Quick checklist before Check', '<ul><li>One file, GLB / glTF 2.0.</li><li>At most 2,000,000 bytes.</li><li>HTTPS, public, direct link ending in <code>.glb</code>.</li><li>Host allows CORS and stays online.</li><li>The face matches your photograph from more than one angle.</li></ul>'),
    ],
  });

  return {
    type: 'guide',
    answer: 'Create and host one public, CORS-enabled GLB (maximum 2,000,000 bytes) of the person in your own photograph, then submit its direct HTTPS .glb link.',
    variant: '3D model task · guide',
    guide,
    answerDisplay: '### Reconstruct your assigned face in 3D\n\nUse Meshy with the photograph on your exam page, export a textured GLB under 2,000,000 bytes, host it on a public GitHub repository, and submit the Raw link.',
    debug: { question: 'Q6', needsUserInput: true, fileFormat: 'GLB', maxBytes: GLB_MAX_BYTES },
  };
}
