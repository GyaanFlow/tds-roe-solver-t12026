import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\.system_generated\\steps\\705\\content.md`;
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
let jmCode = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idx = line.indexOf('function jm(');
  if (idx !== -1) {
    console.log(`Found function jm in line ${i + 1} at index ${idx}`);
    // Extract a huge portion from here
    const sub = line.substring(idx);
    
    // Let's do simple brace matching to find the end of function jm
    let braceCount = 0;
    let endIdx = 0;
    let inString = false;
    let strChar = '';
    
    for (let j = 0; j < sub.length; j++) {
      const char = sub[j];
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = j + 1;
            break;
          }
        } else if (char === '"' || char === "'" || char === '`') {
          inString = true;
          strChar = char;
        }
      } else {
        if (char === strChar && sub[j - 1] !== '\\') {
          inString = false;
        }
      }
    }
    
    if (endIdx > 0) {
      jmCode = sub.substring(0, endIdx);
    } else {
      jmCode = sub.substring(0, 15000); // fallback
    }
    break;
  }
}

if (jmCode) {
  const outPath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\jm_source.js`;
  fs.writeFileSync(outPath, jmCode, 'utf-8');
  console.log(`Extracted function jm code. Saved to ${outPath}`);
} else {
  console.log('Failed to extract jm code.');
}
