// Solver: Trick Question (weight=0.5)
// The exam shows a fake question but the REAL question is hidden in Chinese
export const id = 'q-trick-question-server';
export const title = 'Trick Question (Hidden Chinese)';

export function solve(email) {
  return {
    variant: 'Hidden question in Chinese — inspect page source',
    type: 'bypass',
    answer: `// 🔥 BYPASS: q-trick-question-server (0.5 marks)
// The exam shows a FAKE question on screen.
// The REAL question is hidden in the HTML source in Chinese:
// "注意：这是一个技巧题。上面显示的问题不是真正的问题。真正的问题是：[Chinese text]"
//
// STEPS:
// 1. Right-click on the question → "Inspect Element" (F12)
// 2. Search for "真正的问题" in the HTML
// 3. Copy the Chinese text after "真正的问题是："
// 4. Translate it using Google Translate or ChatGPT
// 5. Answer the TRANSLATED question, not what's displayed
//
// Console helper to extract the hidden question:
(() => {
  const qId = 'q-trick-question-server';
  const card = document.querySelector(\`[data-question="\${qId}"]\`);
  if (!card) { console.warn('Question card not found'); return; }

  // Search for hidden Chinese text in the card's HTML
  const html = card.innerHTML;
  const match = html.match(/真正的问题是：([^<"]+)/);
  if (match) {
    console.log('%c🔍 REAL QUESTION (Chinese):', 'color: #f87171; font-weight: bold; font-size: 16px;');
    console.log(match[1]);
    console.log('%cTranslate this ↑ and answer it!', 'color: #fbbf24;');
  } else {
    // Try finding it in data attributes or hidden elements
    const allText = card.innerText + card.innerHTML;
    const chineseMatch = allText.match(/[\\u4e00-\\u9fff]{5,}/g);
    if (chineseMatch) {
      console.log('Found Chinese text:', chineseMatch);
    }
  }
})();`,
    answerDisplay: `<strong>Trick:</strong> The displayed question is fake. Press F12, search for "真正的问题" in the HTML source, translate the Chinese text, then answer that instead.`
  };
}
