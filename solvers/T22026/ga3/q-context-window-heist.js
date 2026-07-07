import { normalizeEmail } from './utils.js';

export const id = 'q-context-window-heist-server';
export const title = 'Q11: Context Window Heist';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);

  const consoleExtractorScript = `
(async () => {
  console.log("=== Context Window Heist Auto-Extractor ===");
  const iframe = document.querySelector('iframe[title*="haystack"]');
  const src = iframe ? iframe.src : window.location.href;
  
  console.log("Fetching haystack content...");
  const res = await fetch(src);
  const text = await res.text();
  
  // Parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const bodyText = doc.body.innerText;
  
  const answers = {};
  
  // Patterns for latest facts
  const patterns = {
    q1: /The current active retrieval strategy is ([a-zA-Z0-9_\\-]+)/i,
    q2: /The reranker model code is ([a-zA-Z0-9_\\-]+)/i,
    q3: /The chunk overlap is (\\d+) tokens/i,
    q4: /The per-section summary budget is (\\d+) tokens/i,
    q5: /The citation tag prefix is ([a-zA-Z0-9_\\-]+)/i,
    q6: /The recency rule is ([a-zA-Z0-9_\\-]+)/i,
    q7: /The needle namespace is ([a-zA-Z0-9_\\-]+)/i,
    q8: /The target compression ratio is (\\d+:\\d+)/i,
    q9: /The answer checksum is ([a-zA-Z0-9_\\-]+)/i,
    q10: /The dispatch queue name is ([a-zA-Z0-9_\\-]+)/i
  };
  
  for (const [key, regex] of Object.entries(patterns)) {
    const match = bodyText.match(regex);
    if (match) {
      answers[key] = match[1].trim();
      console.log(\`\${key}: \${answers[key]}\`);
    } else {
      console.warn(\`Could not find answer for \${key}\`);
    }
  }
  
  const answerStr = JSON.stringify(answers, null, 2);
  console.log("\\nExtracted Answers JSON:");
  console.log(answerStr);
  
  const inputField = document.getElementById('q-context-window-heist-server');
  if (inputField) {
    inputField.value = answerStr;
    inputField.dispatchEvent(new Event('input', { bubbles: true }));
    console.log("Successfully populated the answer field on the page!");
  }
})();
  `.trim();

  return {
    type: 'guide',
    answer: 'See instructions in guide to solve the Context Window Heist automatically.',
    variant: `Context Window Heist helper for ${norm}`,
    answerDisplay: [
      `### Q11: Context Window Heist Solution`,
      `Due to browser cross-origin constraints (CORS), the haystack data is isolated inside an iframe.`,
      `We have created a helper script that you can run in your browser console to automatically extract and populate the answers.`,
      ``,
      `#### Instructions`,
      `1. Open the **IITM Portal Exam Page** in your browser.`,
      `2. Press **F12** (or right-click and choose **Inspect**) and go to the **Console** tab.`,
      `3. Copy and paste the following script into the Console and press **Enter**:`,
      ``,
      `\`\`\`javascript`,
      consoleExtractorScript,
      `\`\`\``,
      ``,
      `*The script will automatically parse the haystack, display the correct values, and populate the textarea on the page!*`
    ].join('\n')
  };
}
