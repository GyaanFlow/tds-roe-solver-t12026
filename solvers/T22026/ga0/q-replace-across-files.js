// Solver: Q19 — Replace Across Files (Direct Solution)
import { normalizeEmail } from './utils.js';

export const id = 'q-replace-across-files';
export const title = 'Q19: Replace Across Files';

export async function solve(email) {
  const script = `
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
                
    print("Run this in bash to get the answer:")
    print("cat * | sha256sum")

if __name__ == "__main__":
    solve()
`.trim();

  return {
    type: 'solved',
    variant: 'Python bulk replace script',
    answer: script,
    guide: `### 🚀 Implementation Guide

1. **Setup**:
   - Download and extract **q-replace-across-files.zip** from the exam portal.
   - Save the code from the **Answer** box as \`solve.py\` inside the extracted folder.
2. **Execution**:
   - Run the script: \`python solve.py\`
3. **Get Answer**:
   - Run the following command in your terminal (bash/git bash) inside the folder:
     \`cat *.txt | sha256sum\`
4. **Submit**:
   - Copy the resulting hash and paste it into the exam portal.`,
    answerDisplay: `### Quick Steps\n\n1. Save \`solve.py\` in the extracted zip folder.\n2. Run \`python solve.py\`.\n3. Run \`cat *.txt | sha256sum\` to get the hash.`,
  };
}
