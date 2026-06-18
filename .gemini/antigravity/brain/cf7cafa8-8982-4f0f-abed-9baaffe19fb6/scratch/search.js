import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\.system_generated\\steps\\705\\content.md`;
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
console.log('Extracting lines 8100 to 8138...');
for (let i = 8090; i < 8138; i++) {
  if (lines[i]) {
    console.log(`[Line ${i + 1}]: ${lines[i]}`);
  }
}
