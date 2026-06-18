import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\bonsai_generation_formatted.js`;
const content = fs.readFileSync(filePath, 'utf-8');

// Let's find "x:0,\n y:9,\n z:0" or similar in the text
const targetStr = 'x:0,\n y:9,\n z:0';
const startIdx = content.indexOf(targetStr);
if (startIdx === -1) {
  console.log('Could not find x:0, y:9, z:0');
  process.exit(1);
}

// Search backwards for the start of this array "[{"
let arrayStart = content.lastIndexOf('[', startIdx);

// Search forwards for the end of the array followed by ".forEach(e=>{" and "trunk"
let arrayEnd = content.indexOf('].forEach(e=>', startIdx);

if (arrayStart === -1 || arrayEnd === -1) {
  console.log('Failed to find array limits.');
  process.exit(1);
}

let arrayStr = content.substring(arrayStart, arrayEnd + 1);
arrayStr = arrayStr.replace(/\s+/g, ' ');

console.log('Trunk Array length:', arrayStr.length);
const outPath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\trunk_array.json`;
fs.writeFileSync(outPath, arrayStr, 'utf-8');
console.log(`Saved trunk array to ${outPath}`);
