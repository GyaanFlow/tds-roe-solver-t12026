import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\.system_generated\\steps\\705\\content.md`;
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
console.log('Searching for voxel and tree generator keywords...');

lines.forEach((line, idx) => {
  // Check if line contains keywords related to procedural tree generation
  if (line.includes('trunk') || line.includes('leaf') || line.includes('foliage') || line.includes('fruit') || line.includes('voxel')) {
    console.log(`[Line ${idx + 1}]: ${line.substring(0, 250)}`);
  }
});
