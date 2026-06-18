import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\bonsai_generation_extracted.js`;
const content = fs.readFileSync(filePath, 'utf-8');

// Simple formatting: split at semicolons, braces
let formatted = content
  .replace(/\{/g, '{\n')
  .replace(/\}/g, '\n}\n')
  .replace(/;/g, ';\n')
  .replace(/,/g, ',\n');

const outPath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\bonsai_generation_formatted.js`;
fs.writeFileSync(outPath, formatted, 'utf-8');
console.log(`Formatted code saved to ${outPath}`);
