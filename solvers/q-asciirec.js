// Bypass: Asciinema Recording (weight=0.5)
export const id = 'q-asciirec-server';
export const title = 'Terminal Recording (asciinema)';

export function solve(email) {
  return {
    variant: 'Requires recording a terminal session with asciinema',
    type: 'bypass',
    answer: `// 🔥 GUIDE: q-asciirec-server (0.5 marks)
//
// STEPS:
// 1. Install asciinema: pip install asciinema  (or use uvx)
// 2. Start recording: uvx asciinema rec session.cast
// 3. Type the EXACT commands shown on the exam page:
//    a. echo 'SESSION_MARKER_FROM_EXAM'  ← copy the exact marker
//    b. Then type the second command shown
// 4. Press Ctrl+D to stop recording
// 5. cat session.cast → copy the entire JSON output
// 6. Paste into the answer field
//
// Console helper to extract required commands:
(() => {
  const qId = 'q-asciirec-server';
  const card = document.querySelector(\`[data-question="\${qId}"]\`);
  if (!card) { console.warn('Card not found'); return; }

  // Extract the session marker and commands from the question
  const text = card.innerText;
  const markerMatch = text.match(/echo '([^']+)'/);
  if (markerMatch) {
    console.log('%cSession Marker:', 'color: #34d399; font-weight: bold;');
    console.log("echo '" + markerMatch[1] + "'");
  }

  // Find the second command
  const lines = text.split('\\n').filter(l => l.trim());
  console.log('%cFull command sequence from exam:', 'color: #818cf8; font-weight: bold;');
  lines.forEach(l => {
    if (l.includes('echo') || l.includes('$')) console.log('  → ' + l.trim());
  });
})();`,
    answerDisplay: '<strong>Steps:</strong> Install asciinema → Record session with the exact commands shown → Submit the .cast file contents as JSON.'
  };
}
