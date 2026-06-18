import fs from 'fs';
import path from 'path';

const filePath = `C:\\Users\\gaura\\.gemini\\antigravity\\brain\\cf7cafa8-8982-4f0f-abed-9baaffe19fb6\\.system_generated\\steps\\705\\content.md`;
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
const line = lines[8133];

const kws = ['Dh=', 'Oh=', 'Eh=', 'wh=', 'Th=', 'Ah=', 'jh=', 'og='];
kws.forEach(kw => {
  let idx = line.indexOf(kw);
  if (idx !== -1) {
    console.log(`Keyword "${kw}" found: ${line.substring(idx, idx + 300)}`);
  } else {
    // try space around equal
    let idx2 = line.indexOf(kw.replace('=', ' ='));
    if (idx2 !== -1) {
      console.log(`Keyword "${kw}" found: ${line.substring(idx2, idx2 + 300)}`);
    } else {
      console.log(`Keyword "${kw}" not found.`);
    }
  }
});
