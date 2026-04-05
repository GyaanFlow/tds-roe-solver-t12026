// Bypass: Share Token Exchange (server-verified, weight=5)
export const id = 'q-share-token-server';
export const title = 'Collaborative Token Exchange';

export function solve(email) {
  return {
    variant: 'Server-verified — requires collecting tokens from classmates',
    type: 'bypass',
    answer: `// 🔥 BYPASS: q-share-token-server (5 marks)
// This question requires 500 unique tokens from classmates for full marks.
// Paste this in DevTools Console (F12) on the exam page:
(() => {
  const qId = 'q-share-token-server';
  const el = document.querySelector(\`[name="\${qId}"], #\${qId}\`);
  if (!el) { console.warn('Input not found for ' + qId); return; }

  // Strategy: The exam loads YOUR token in an iframe.
  // 1. Extract your own token from the iframe
  const iframe = document.querySelector('iframe[title*="token"]');
  if (iframe) {
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const tokenText = iframeDoc.body?.innerText || '';
      console.log('Your token (share this):', tokenText);
    } catch(e) { console.log('Cannot read iframe (CORS). Check iframe src manually.'); }
  }

  // 2. If you have tokens, paste them as JSON array:
  // el.value = JSON.stringify(["token1", "token2", ...]);
  // el.dispatchEvent(new Event('input', { bubbles: true }));

  console.log('%c[ROE Solver] Token exchange helper loaded. Share tokens with classmates!', 'color: #fbbf24; font-weight: bold;');
})();`,
    answerDisplay: '<strong>Strategy:</strong> Collect 500+ tokens from classmates and submit as JSON array. Each student gets 1 unique token.'
  };
}
