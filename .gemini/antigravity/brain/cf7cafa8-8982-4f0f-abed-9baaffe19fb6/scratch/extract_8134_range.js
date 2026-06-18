import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\.system_generated\\steps\\705\\content.md`;
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
const line = lines[8133]; // line 8134 (index 8133)

const start = 75000;
const end = 98000;
const chunk = line.substring(start, end);

const outPath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\bonsai_generation_extracted.js`;
fs.writeFileSync(outPath, chunk, 'utf-8');
console.log(`Extracted indices ${start} to ${end} of line 8134. Saved to ${outPath}`);
