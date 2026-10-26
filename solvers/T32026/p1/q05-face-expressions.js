import { page, card, details, toneForState } from './ui.js';
import { WINDOWS, windowStatus, formatIst } from './windows.js';

export const id = 'q-face-expressions';
export const title = 'Capture 10 facial expressions (preparation for the next task)';

export const EXPRESSIONS = [
  { name: 'Neutral', tip: 'Relax your face completely, mouth closed, eyes looking at the camera, as if waiting for a bus.' },
  { name: 'Happy', tip: 'Think of something that makes you laugh and smile with your teeth and your eyes.' },
  { name: 'Sad', tip: 'Let the corners of your mouth drop, lift the inner ends of your eyebrows, and look slightly down.' },
  { name: 'Angry', tip: 'Pull your eyebrows down and together, press your lips, and look straight at the camera.' },
  { name: 'Surprised', tip: 'Raise your eyebrows high, open your eyes wide, and let your mouth fall open a little.' },
  { name: 'Contempt', tip: 'Lift just ONE corner of your mouth (a half smirk) while the rest of your face stays still.' },
  { name: 'Restrained amusement', tip: 'You find something funny but are trying not to laugh: lips pressed together, eyes smiling.' },
  { name: 'Scepticism', tip: 'Raise one eyebrow, tilt your head a little, and look as if you do not believe what you heard.' },
  { name: 'Uncertainty', tip: 'Furrow your brows slightly, purse your lips to one side, and look unsure.' },
  { name: 'Hopelessness', tip: 'Let your shoulders and face go heavy: eyes down or far away, mouth slightly down, no energy.' },
];

function widgetHtml() {
  const rows = EXPRESSIONS.map((e, i) => `<label style="display:flex;gap:8px;align-items:flex-start;margin:0 0 6px;color:inherit"><input type="checkbox" data-expr="${i}" onchange="window._t3p1Face.tick()" style="margin-top:4px"><span><strong>${i + 1}. ${e.name}</strong> — ${e.tip}</span></label>`).join('');
  return [
    '<div id="t3p1Face">',
    '<p>Tick each expression when you have recorded and reviewed it. This list is only for you; nothing is sent anywhere.</p>',
    rows,
    '<div id="t3p1FaceCount" class="p1-status" role="status">0 of 10 done</div>',
    '<hr style="border:0;border-top:1px solid var(--border,rgba(255,255,255,.14));margin:12px 0">',
    '<label style="display:flex;gap:8px;align-items:flex-start;color:inherit"><input type="checkbox" id="t3p1FaceSubmitted" onchange="window._t3p1Face.tick()" style="margin-top:4px"><span>I have uploaded my ZIP and pressed <strong>Submit</strong> on the Google Form myself.</span></label>',
    '<div class="p1-actions"><button type="button" class="p1-btn" id="t3p1FaceFill" disabled onclick="window._t3p1Face.fill()">Put “completed” in the answer box</button></div>',
    '<div id="t3p1FaceStatus" class="p1-status" role="status"></div>',
    '</div>',
  ].join('');
}

function register() {
  if (typeof window === 'undefined' || window._t3p1Face) return;
  const $ = (name) => document.getElementById(name);
  window._t3p1Face = {
    tick() {
      const done = document.querySelectorAll('#t3p1Face input[data-expr]:checked').length;
      if ($('t3p1FaceCount')) $('t3p1FaceCount').textContent = `${done} of 10 done`;
      const ready = done === 10 && $('t3p1FaceSubmitted')?.checked;
      if ($('t3p1FaceFill')) $('t3p1FaceFill').disabled = !ready;
    },
    fill() {
      const out = $('t3p1FaceStatus');
      const patched = typeof window.tdsPatchAnswer === 'function' && window.tdsPatchAnswer(id, { type: 'solved', answer: 'completed', variant: 'Face expressions — acknowledgement', answerDisplay: '### Acknowledgement\n\nType `completed`, press **Check**, then **Save**.' });
      if (out) out.textContent = patched ? 'Done. The answer box now says completed. Press Check, then Save.' : 'Type completed in the exam box yourself, then press Check and Save.';
    },
  };
}

export async function solve() {
  register();
  const status = windowStatus(WINDOWS.faceExpressions);
  const guide = page({
    title: 'Capture 10 facial expressions',
    chips: [{ text: status.state === 'open' ? 'Open' : 'Closed', tone: toneForState(status.state) }, { text: `Due ${formatIst(WINDOWS.faceExpressions.closes)}`, tone: '' }, { text: '0 marks', tone: '' }],
    sections: [
      card('What this is', `<p>The course team is collecting photos of 10 facial expressions to train a small classifier next week. This question gives <strong>0 marks</strong> and only asks you to type <code>completed</code> afterwards. ${status.text}</p><p class="p1-note">Submitting photos of your own face is voluntary. If you prefer not to, contact the course team about an alternative. Typing “completed” does not upload anything; only type it if you really did the steps.</p>`, 'accent'),
      card('Step by step for beginners', '<ol><li>Find a place with <strong>soft light on your face</strong> (a window in front of you is perfect) and a plain background. Take off sunglasses and keep your hair off your eyes.</li><li>On the exam page press <strong>Open the face-expression camera</strong>. Allow the camera when your browser asks.</li><li>Hold the phone or laptop at eye level, an arm\'s length away, so your whole face fills most of the picture.</li><li>Record the 10 expressions in the order shown below. Make each one clear and a little bigger than normal; subtle faces are hard for a computer to learn.</li><li>Review all 10 pictures. Redo any that are blurry, dark or where your face is cut off.</li><li>Press the download button to save <strong>one ZIP file</strong>.</li><li>Press <strong>Upload ZIP to Google Form</strong>. Sign in, read the consent text, choose whether other students may see your images, upload the single ZIP, and press <strong>Submit</strong>.</li><li>Come back to the exam, type <code>completed</code> in the box, then press <strong>Check</strong> and <strong>Save</strong>. The button below can type it for you once you tick that you submitted the form.</li></ol>'),
      card('Your 10 expressions (checklist)', widgetHtml(), 'accent'),
      details('Tips for better pictures', '<ul><li>Use the same spot and light for all 10; change only your face.</li><li>Look at the camera lens, not at your own picture.</li><li>Take a breath between expressions and let your face reset to neutral.</li><li>If a result looks wrong, delete it and record that one again before you download.</li></ul>'),
    ],
  });
  return {
    type: 'guide',
    answer: 'Record the 10 expressions on the exam page, upload the ZIP to the Google Form yourself, then type: completed',
    variant: `Camera task · ${status.state === 'open' ? 'open' : 'closed'}`,
    guide,
    answerDisplay: '### Record, upload, then type `completed`\n\nThis question is worth 0 marks. Do the 10 expressions and the Google Form first; then type `completed`, press Check and Save.',
    debug: { question: 'Q5', needsUserInput: true, windowState: status.state },
  };
}
