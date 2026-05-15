// Solver: Q16 — Move and Rename Files (Direct Solution)
export const id = 'q-move-rename-files';
export const title = 'Q16: Move and Rename Files';

export async function solve(email) {
  const script = `
import os
import shutil
from pathlib import Path

def solve():
    root_dir = Path(".").resolve()
    # 1. Move all files from subdirectories to root
    for root, dirs, files in os.walk(root_dir):
        root = Path(root)
        if root == root_dir:
            continue
        for filename in files:
            src = root / filename
            dst = root_dir / filename
            if dst.exists():
                raise RuntimeError(f"Destination already exists: {dst.name}")
            shutil.move(str(src), str(dst))
            
    # 2. Delete empty directories, deepest first
    for root, dirs, files in os.walk(root_dir, topdown=False):
        root = Path(root)
        if root != root_dir and not any(root.iterdir()):
            root.rmdir()

    # 3. Rename files: digit -> (digit+1)%10
    files = [f for f in os.listdir('.') if os.path.isfile(f) and f.endswith('.txt')]
    for f in files:
        new_name = ""
        for char in f:
            if char.isdigit():
                new_name += str((int(char) + 1) % 10)
            else:
                new_name += char
        os.rename(f, new_name)

    print("Run this in bash to get the answer:")
    print("grep . * | LC_ALL=C sort | sha256sum")

if __name__ == "__main__":
    solve()
`.trim();

  return {
    type: 'solved',
    variant: 'Python automation script',
    answer: script,
    guide: `### 🚀 Implementation Guide

1. **Setup**:
   - Download and extract **q-move-rename-files.zip** from the exam portal.
   - Save the code from the **Answer** box as \`solve.py\` inside the extracted folder.
2. **Execution**:
   - Run the script: \`python solve.py\`
3. **Get Answer**:
   - Run the following command in your terminal (bash/git bash) inside the folder:
     \`grep . * | LC_ALL=C sort | sha256sum\`
4. **Submit**:
   - Copy the resulting hash and paste it into the exam portal.`,
    answerDisplay: `### Quick Steps\n\n1. Save \`solve.py\` in the extracted zip folder.\n2. Run \`python solve.py\`.\n3. Run \`grep . * | LC_ALL=C sort | sha256sum\` to get the hash.`,
  };
}
