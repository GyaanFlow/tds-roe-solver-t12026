import { page, card, details } from './ui.js';

export const id = 'q-famous-face-3d-model';
export const title = 'Reconstruct a famous face in 3D';

const reference = 'https://upload.wikimedia.org/wikipedia/commons/c/cc/President_MPLA%2C_heer_Neto_door_Den_Uyl_ontvangen_premier_Den_Uyl_en_A_Neto_%28r%29%2C_Bestanddeelnr_927-8518_%28cropped%29.jpg';

export async function solve() {
  const guide = page({
    title,
    chips: [{ text: '0.5 marks: file check', tone: '' }, { text: '7.5 marks: likeness review', tone: '' }],
    sections: [
      card('Your task', `<p>Create a rotatable 3D face that resembles <strong>Agostinho Neto</strong> in the assigned photograph. Submit one direct public HTTPS link to a valid <code>.glb</code> file. The file must allow cross-origin requests and be no larger than <strong>2,000,000 bytes</strong>.</p><p><a href="${reference}" target="_blank" rel="noopener noreferrer">Open the assigned reference photograph</a> · <a href="https://www.wikidata.org/wiki/Q181665" target="_blank" rel="noopener noreferrer">Agostinho Neto on Wikidata</a></p>`, 'accent'),
      card('Step by step: make the 3D face', '<ol><li>Open <a href="https://www.meshy.ai/" target="_blank" rel="noopener noreferrer">Meshy</a> and sign in.</li><li>Choose <strong>Image to 3D</strong> and select <strong>Meshy 6 Lite</strong>.</li><li>Save the assigned photograph to your device, then upload it as the reference image. Use the supplied Agostinho Neto photograph, not a different person.</li><li>Generate the model and wait for it to finish. Check that the face looks like the photograph, not just a generic person.</li><li>Generate the texture too: click the large green square texture button shown after the first generation, then wait for texturing to finish.</li><li>Rotate the preview. Check the front, sides, and back. If the likeness is poor, try again with a clearer image prepared by GPT or Gemini. Tell it to preserve the person’s distinctive facial features and match the reference photo exactly; do not ask it to invent a different face.</li><li>Export/download as <strong>GLB</strong> (glTF 2.0). Do not submit a screenshot, OBJ, ZIP, or a Meshy viewer-page link.</li></ol>'),
      card('Make the file fit the limit', '<ol><li>Check the downloaded file ends in <code>.glb</code>.</li><li>If it is over 2,000,000 bytes, ask GPT to compress the attached GLB while preserving the face, texture, and GLB format. You can use this prompt: <blockquote>Compress this attached 3D model into a valid GLB (glTF 2.0) no larger than 1,900,000 bytes. Preserve the face likeness, shape, and texture as much as possible. Return the compressed .glb file and tell me its exact byte size. Do not return a viewer link or change it to another format.</blockquote></li><li>Download the compressed result and check its exact file size in your device’s file properties. It must be at most <strong>2,000,000 bytes</strong>. If it is still too large, ask for another compression pass or reduce texture resolution and polygon detail.</li><li>Open the final GLB in a viewer and rotate it once more. Compression should not have broken the model or removed its texture.</li></ol><p>Keep a backup of your original export until the final file passes these checks.</p>'),
      card('Put it online and submit the direct file URL', '<ol><li>Upload the final <code>.glb</code> to a public HTTPS file host that allows cross-origin browser requests (CORS).</li><li>Copy the file’s direct download URL. It should end in <code>.glb</code> and download the model itself; do not copy a page that displays the model in a viewer.</li><li>Open the link in a private/incognito browser window where you are not signed in. Confirm it is publicly reachable and downloads the GLB.</li><li>Paste that direct URL into the exam’s <strong>Public GLB URL</strong> field. Keep the file and link available until offline evaluation is over.</li><li>Press <strong>Check</strong>. This Check verifies reachability, CORS, GLB validity, and the 2,000,000-byte limit. It awards up to 0.5 marks; the remaining 7.5 marks come from offline AI and peer review of how closely your model matches the reference.</li></ol>', 'accent'),
      details('Quick checklist before Check', '<ul><li>One file, in GLB / glTF 2.0 format.</li><li>File size is at most 2,000,000 bytes.</li><li>URL uses HTTPS, is public, and points directly to the <code>.glb</code> file.</li><li>The host permits CORS and the file remains online for offline evaluation.</li><li>The face resembles Agostinho Neto when viewed from more than one angle.</li></ul>'),
    ],
  });

  return {
    type: 'guide',
    answer: 'Create and host one public, CORS-enabled GLB (maximum 2,000,000 bytes), then submit its direct HTTPS .glb URL.',
    variant: '3D model task · guide',
    guide,
    answerDisplay: '### Reconstruct Agostinho Neto in 3D\n\nUse Meshy 6 Lite with the assigned photograph, generate a textured model, export GLB, verify it is at most 2,000,000 bytes, host it at a public CORS-enabled HTTPS direct-file URL, and submit that URL.',
    debug: { question: 'Q6', needsUserInput: true, fileFormat: 'GLB', maxBytes: 2000000 },
  };
}
