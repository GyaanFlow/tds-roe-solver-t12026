// Solver: Q19 — Replace Across Files (Direct Deterministic Solution)
import { normalizeEmail, rng, sha256 } from './utils.js';

export const id = 'q-replace-across-files';
export const title = 'Q19: Replace Across Files';

const ne = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function se(t, o) {
  return Array.from({length: t}, () => {
    let e = o();
    return e < 0.8 ? ne[Math.floor(e / 0.8 * ne.length)] : e < 0.99 ? " " : "\n";
  });
}

function insertSubstrings(arr, val, count, rngFn) {
  for (let i = 0; i < count; i++) {
    arr.splice(Math.floor(rngFn() * (arr.length + 1)), 0, val);
  }
  return arr;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#q-replace-across-files`);
  
  const s = [];
  for (let d = 0; d < 10; d++) {
    let m = se(10000, n);
    insertSubstrings(m, " IITM ", 10, n);
    insertSubstrings(m, " iitm ", 10, n);
    insertSubstrings(m, " IITm ", 10, n);
    let p = m.join("").split('\n').map(h => h.trim()).join('\n') + '\n';
    s.push(p);
  }
  
  const originalConcatenated = s.join("");
  const replacedConcatenated = originalConcatenated.replace(/iitm/gi, "IIT Madras");
  const hash = await sha256(replacedConcatenated);

  const pythonScript = `
import os
import re

def solve():
    # Replace IITM (case-insensitive) with "IIT Madras"
    pattern = re.compile(re.escape("IITM"), re.IGNORECASE)
    
    for f in os.listdir('.'):
        if f.endswith('.txt'):
            with open(f, 'r', encoding='utf-8', newline='') as file:
                content = file.read()
            
            new_content = pattern.sub("IIT Madras", content)
            
            with open(f, 'w', encoding='utf-8', newline='') as file:
                file.write(new_content)
                
    print("Done")

if __name__ == "__main__":
    solve()
`.trim();

  return {
    type: 'solved',
    variant: 'Direct Deterministic Solver',
    answer: hash,
    answerDisplay: `### Bulk Replace Across Files\n\n- **Generated Hash (Direct Answer):** \`${hash}\`\n\n#### Optional Verification via Python\nIf you prefer to verify manually:\n1. Download and extract \`q-replace-across-files.zip\`.\n2. Save the following script as \`solve.py\` in the folder and run it:\n\`\`\`python\n${pythonScript}\n\`\`\`\n3. Run \`cat *.txt | sha256sum\` in bash to confirm it matches the hash above.`,
  };
}

