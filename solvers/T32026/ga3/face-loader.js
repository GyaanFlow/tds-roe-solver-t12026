// Browser side of the face questions: fetch the student's assigned faces from their questionData link (or pasted data)
// and load images. Nothing is stored or sent anywhere except the request to the exam host that the student's own link makes.
import { normalizeAssigned, parseQuestionDataLink, faceMetrics } from './face-input.js';

const LANDMARKER_BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const LANDMARKER_MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

/** `linkText` and `dataText` are the two boxes; pasted data wins when present. Returns `{ ok, ...assigned }` or `{ ok:false, message }`. */
export async function loadAssigned(kind, linkText, dataText, fetchImpl = globalThis.fetch) {
  if (String(dataText ?? '').trim()) return normalizeAssigned(kind, dataText);
  const parsed = parseQuestionDataLink(linkText, kind);
  if (!parsed.ok) return parsed;
  try {
    const response = await fetchImpl(parsed.url, { cache: 'no-store', credentials: 'omit' });
    if (!response.ok) return { ok: false, message: `The exam site answered ${response.status}. Reload your exam page, copy the link again, and try once more.` };
    return normalizeAssigned(kind, await response.json());
  } catch {
    return { ok: false, message: 'Your browser could not fetch the link directly (the exam site may block other websites). Open the link in a new tab, copy everything it shows, and paste it into the second box.', blocked: true };
  }
}

export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('A photo could not be loaded (the photo site may block downloads). Save the photos and choose them as files instead.'));
    img.src = source;
  });
}

export function fileToImage(file) {
  if (!file || !/^image\//.test(file.type)) return Promise.reject(new Error('Choose an image file.'));
  const url = URL.createObjectURL(file);
  return loadImage(url).finally(() => URL.revokeObjectURL(url));
}

let landmarkerPromise = null;

/** Lazily loads the face-landmark model; resolves null if it cannot be loaded (offline, blocked). */
export function getLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      try {
        const vision = await import(`${LANDMARKER_BASE}/vision_bundle.mjs`);
        const files = await vision.FilesetResolver.forVisionTasks(`${LANDMARKER_BASE}/wasm`);
        return await vision.FaceLandmarker.createFromOptions(files, { baseOptions: { modelAssetPath: LANDMARKER_MODEL }, runningMode: 'IMAGE', numFaces: 1 });
      } catch {
        return null;
      }
    })();
  }
  return landmarkerPromise;
}

/** Average brightness (0-255) of the middle of the photo, where the face usually is. */
export function brightness(img) {
  const canvas = document.createElement('canvas');
  canvas.width = 32; canvas.height = 32;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, img.width * 0.25, img.height * 0.2, img.width * 0.5, img.height * 0.5, 0, 0, 32, 32);
  const data = ctx.getImageData(0, 0, 32, 32).data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) sum += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  return sum / (data.length / 4);
}

export async function measureFace(img, landmarker) {
  let metrics = null;
  try {
    const result = landmarker?.detect(img);
    metrics = faceMetrics(result?.faceLandmarks?.[0], img.naturalWidth || img.width, img.naturalHeight || img.height);
  } catch {
    metrics = null;
  }
  let light = NaN;
  try { light = brightness(img); } catch { light = NaN; }
  return { metrics, brightness: light };
}

/** The two paste boxes shared by Q6, Q7 and Q8 (`prefix` makes the element ids unique). */
export function assignedBoxesHtml(prefix, buttonLabel, onclick) {
  return [
    `<div class="p1-grid"><div><label for="${prefix}Link">Paste your personal questionData link</label><input type="text" id="${prefix}Link" placeholder="https://exam.sanand.workers.dev/questionData?email=…&quizSign=…"></div>`,
    `<div><label for="${prefix}Data">…or paste what that link shows (only if the first box fails)</label><textarea id="${prefix}Data" placeholder="{ ... }" style="min-height:60px"></textarea></div></div>`,
    `<div class="p1-actions"><button type="button" class="p1-btn" id="${prefix}Load" onclick="${onclick}">${buttonLabel}</button></div>`,
    `<div id="${prefix}LoadStatus" class="p1-status" role="status"></div>`,
  ].join('');
}

export const HOW_TO_LINK = '<ol><li>Open your exam page in Chrome or Edge, right-click anywhere and choose <strong>Inspect</strong>, then open the <strong>Network</strong> tab.</li><li>Reload the page. In the filter box type <code>questionData</code>.</li><li>Right-click the request for this question and choose <strong>Copy → Copy URL</strong>. Paste it in the box. (Any of the face questions\' links works; the tool switches it to the right question.)</li><li>If the tool says it cannot fetch the link, click the request, open <strong>Response</strong>, copy everything shown, and paste it into the second box.</li></ol>';
