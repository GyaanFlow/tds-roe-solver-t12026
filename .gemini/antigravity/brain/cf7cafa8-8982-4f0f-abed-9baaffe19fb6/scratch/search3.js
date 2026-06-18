import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\.system_generated\\steps\\705\\content.md`;
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
console.log('Extracting lines 8110 to 8133...');
// Let's print line 8110 specifically, which is probably very long (minified JS on a single line)
const line8110 = lines[8109];
console.log(`Line 8110 length: ${line8110.length}`);

// Let's search inside line 8110 for "function jm" and get a chunk around it
const idx = line8110.indexOf('function jm(');
if (idx !== -1) {
  console.log('Found function jm at index:', idx);
  console.log(line8110.substring(idx, idx + 10000)); // Print 10,000 characters
} else {
  console.log('Could not find function jm inside line 8110');
}
