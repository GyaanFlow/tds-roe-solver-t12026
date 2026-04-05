// Bypass: Decode Layered Encoding (server-verified, weight=2)
export const id = 'q-decode-layered-server';
export const title = 'Layered Encoding Challenge';

export function solve(email) {
  return {
    variant: 'Server-verified — encoded string loaded via iframe',
    type: 'bypass',
    answer: `// 🔥 BYPASS: q-decode-layered-server (2 marks)
// The hint says: "I am the first thing you gave us" = your EMAIL
// The original value is your email, encoded through reversible transforms.
//
// Strategy: The decoded value is likely your email address.
// Try submitting: {"decoded": "${email}"}
//
// If that doesn't work, inspect the iframe to see the encoded string
// and transforms, then reverse them.
//
// Console helper:
(() => {
  const qId = 'q-decode-layered-server';
  const el = document.querySelector(\`[name="\${qId}"], #\${qId}\`);
  if (!el) { console.warn('Input not found'); return; }

  // The hint says the decoded value = "the first thing you gave us" = email
  const email = document.querySelector('input[type="email"]')?.value || '';
  el.value = JSON.stringify({ decoded: email });
  el.dispatchEvent(new Event('input', { bubbles: true }));

  // Also try to read the iframe
  const iframe = el.closest('.card')?.querySelector('iframe');
  if (iframe) {
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      console.log('Iframe content:', doc.body?.innerText);
    } catch(e) { console.log('CORS blocked. Check iframe src manually.'); }
  }

  console.log('%c[ROE Solver] Layered decode: try submitting your email as decoded value', 'color: #818cf8; font-weight: bold;');
})();`,
    answerDisplay: `<strong>Hint:</strong> "I am the first thing you gave us" = your email address. Try <code>{"decoded": "${email}"}</code>`
  };
}
