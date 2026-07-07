import { normalizeEmail } from './utils.js';

export const id = 'q-proof-of-work-server';
export const title = 'Q10: Proof-of-Work Nonce Hunt';

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);

  const consoleMinerScript = `
(async () => {
  console.log("=== Proof-of-Work Nonce Hunt Miner ===");
  const iframe = document.querySelector('iframe');
  if (!iframe) {
    console.error("Could not find the token/difficulty iframe!");
    return;
  }
  
  console.log("Fetching token and difficulty from iframe...");
  const res = await fetch(iframe.src);
  const html = await res.text();
  
  // Extract token and difficulty using robust regex
  const tokenMatch = html.match(/Token:\\s*<code[^>]*>([^<]+)<\\/code>/i) || html.match(/Token:\\s*([a-zA-Z0-9_\\-]+)/i);
  const diffMatch = html.match(/Difficulty:\\s*<code[^>]*>(\\d+)<\\/code>/i) || html.match(/Difficulty:\\s*(\\d+)/i);
  
  if (!tokenMatch || !diffMatch) {
    console.error("Failed to parse token or difficulty from iframe source! HTML context:", html.substring(0, 500));
    return;
  }
  
  const token = tokenMatch[1].trim();
  const difficulty = parseInt(diffMatch[1].trim(), 10);
  console.log(\`Token: "\${token}", Difficulty: \${difficulty} bits\`);
  
  console.log("Starting Web Crypto miner...");
  const textEncoder = new TextEncoder();
  const targetZeros = difficulty;
  
  let nonce = 0;
  const started = performance.now();
  
  while (true) {
    const inputStr = \`\${token}:\${nonce}\`;
    const data = textEncoder.encode(inputStr);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = new Uint8Array(hashBuffer);
    
    // Count leading zero bits
    let zeroBits = 0;
    for (let i = 0; i < hashArray.length; i++) {
      const byte = hashArray[i];
      if (byte === 0) {
        zeroBits += 8;
      } else {
        zeroBits += Math.clz32(byte) - 24;
        break;
      }
    }
    
    if (zeroBits >= targetZeros) {
      const duration = ((performance.now() - started) / 1000).toFixed(2);
      console.log(\`\\nSUCCESS! Found valid nonce in \${duration}s\`);
      console.log(\`Nonce: \${nonce}\`);
      console.log(\`Zero bits: \${zeroBits} (Target >= \${targetZeros})\`);
      
      const inputField = document.getElementById('q-proof-of-work-server');
      if (inputField) {
        inputField.value = nonce;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        console.log("Automatically populated the nonce field on the page!");
      }
      break;
    }
    
    nonce++;
    if (nonce % 50000 === 0) {
      console.log(\`Checked \${nonce} nonces...\`);
    }
  }
})();
  `.trim();

  return {
    type: 'guide',
    answer: 'See instructions in guide to mine the nonce automatically.',
    variant: `POW Miner for ${norm}`,
    answerDisplay: [
      `### Q10: Proof-of-Work Nonce Hunt`,
      `Due to browser cross-origin constraints (CORS), the token and difficulty must be read from the exam domain directly.`,
      `We have created an **automated console miner** that runs instantly on your exam page.`,
      ``,
      `#### Instructions`,
      `1. Open the **IITM Portal Exam Page** in your browser.`,
      `2. Press **F12** (or right-click and choose **Inspect**) and go to the **Console** tab.`,
      `3. Copy and paste the following script into the Console and press **Enter**:`,
      ``,
      `\`\`\`javascript`,
      consoleMinerScript,
      `\`\`\``,
      ``,
      `*The miner will automatically print the nonce and populate the answer input field on the page!*`
    ].join('\n')
  };
}
