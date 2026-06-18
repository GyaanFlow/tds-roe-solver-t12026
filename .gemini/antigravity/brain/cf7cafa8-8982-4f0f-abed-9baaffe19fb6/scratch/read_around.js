import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\bonsai_generation_formatted.js`;
const content = fs.readFileSync(filePath, 'utf-8');

const target = 'y:9,\n';
const idx = content.indexOf(target);
if (idx !== -1) {
  console.log('Found target at index:', idx);
  console.log(content.substring(idx - 100, idx + 200));
} else {
  console.log('Target not found.');
}
