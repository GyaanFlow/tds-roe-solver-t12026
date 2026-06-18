import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\.system_generated\\steps\\705\\content.md`;
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
const line = lines[8133]; // line 8134 is 0-indexed index 8133

console.log('Line 8134 length:', line.length);

const kws = ['voxel', 'trunk', 'branch', 'leaf', 'fruit', 'island', 'tree', 'generate'];
kws.forEach(kw => {
  let idx = 0;
  while (true) {
    idx = line.indexOf(kw, idx);
    if (idx === -1) break;
    console.log(`Keyword "${kw}" found at index ${idx}: ${line.substring(Math.max(0, idx - 80), Math.min(line.length, idx + 120))}`);
    idx += kw.length;
  }
});
