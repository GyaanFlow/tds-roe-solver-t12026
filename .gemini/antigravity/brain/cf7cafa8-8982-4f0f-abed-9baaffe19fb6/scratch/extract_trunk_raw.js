import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\bonsai_generation_extracted.js`;
const content = fs.readFileSync(filePath, 'utf-8');

const targetStr = '[{x:0,y:9,z:0}';
const startIdx = content.indexOf(targetStr);
if (startIdx === -1) {
  console.log('Could not find targetStr');
  process.exit(1);
}

const endStr = '].forEach(e=>{let t=Ih(kh);';
const endIdx = content.indexOf(endStr, startIdx);
if (endIdx === -1) {
  console.log('Could not find endStr');
  process.exit(1);
}

const trunkArrayStr = content.substring(startIdx, endIdx + 1);
console.log('Trunk array char length:', trunkArrayStr.length);

const outPath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\scratch\\trunk_array_raw.json`;
fs.writeFileSync(outPath, trunkArrayStr, 'utf-8');
console.log(`Saved raw trunk array to ${outPath}`);
