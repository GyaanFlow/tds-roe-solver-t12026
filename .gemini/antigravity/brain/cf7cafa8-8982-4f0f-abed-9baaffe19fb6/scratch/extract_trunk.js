import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\bonsai_generation_formatted.js`;
const content = fs.readFileSync(filePath, 'utf-8');

// The trunk coordinates start right after "Lh(e.x*Th, e.y*Th+wh/2, e.z*Th, t, `rock` }),"
// which is index 901 in the formatted array. Let's extract the array block.
// The array block begins with [{ x:0, y:9, z:0 }, ... ] and ends before .forEach

const startIdx = content.indexOf('Lh(e.x*Th,\n e.y*Th+wh/2,\n e.z*Th,\n t,\n `rock`)\n}\n),\n[{');
if (startIdx === -1) {
  console.log('Failed to find start index.');
  process.exit(1);
}

const arrayStart = content.indexOf('[{', startIdx);
const arrayEnd = content.indexOf('].forEach(e=>{\nlet t=Ih(kh);', arrayStart);

if (arrayStart === -1 || arrayEnd === -1) {
  console.log('Failed to find array limits.');
  process.exit(1);
}

let arrayStr = content.substring(arrayStart, arrayEnd + 1);

// Clean up whitespace to make it one clean string representing array of objects
arrayStr = arrayStr.replace(/\s+/g, ' ');

console.log('Trunk Array Length in chars:', arrayStr.length);

const outPath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\trunk_array.json`;
fs.writeFileSync(outPath, arrayStr, 'utf-8');
console.log(`Extracted trunk array and saved to ${outPath}`);
