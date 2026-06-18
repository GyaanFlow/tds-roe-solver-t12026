// Solver: Q4 — File reorganizer (flatten nested dirs by category tag → sha256sum hash)
import { normalizeEmail, rng, sha256 } from './utils.js';

export const id = 'q-file-reorganizer';
export const title = 'Q4: File Reorganizer (Category Hash)';

export async function solve(email) {
  const norm = normalizeEmail(email);

  const bashScript = `#!/bin/bash
# Step 1: Extract zip and navigate into the directory
# unzip your-file.zip && cd extracted-folder

# Step 2: Reorganize files by category
for file in $(find . -type f -name "*.txt"); do
  # Extract category from first matching line
  category=$(grep -m 1 "^category:" "$file" | cut -d' ' -f2- | tr -d '\\r')
  if [ -z "$category" ]; then continue; fi
  
  # Create category directory
  mkdir -p "$category"
  
  # Convert path: remove ./ prefix, replace / with -
  relpath=$(echo "$file" | sed 's|^\\./||')
  newname=$(echo "$relpath" | tr '/' '-')
  
  # Move file to category/new-name
  mv "$file" "$category/$newname"
done

# Step 3: Clean up empty directories
find . -type d -empty -delete

# Step 4: Generate verification hash
find . -type f | LC_ALL=C sort | sha256sum`;

  const guide = [
    `### Steps`,
    ``,
    `1. Download and extract the ZIP from the exam portal.`,
    `2. Navigate into the extracted directory.`,
    `3. Run the bash script below to reorganize files.`,
    `4. The script outputs a SHA256 hash — submit that hash.`,
    ``,
    `### Bash Script`,
    ``,
    `\`\`\`bash`,
    bashScript,
    `\`\`\``,
    ``,
    `### How it works`,
    ``,
    `- Each \`.txt\` file has a \`category: name\` line at the top.`,
    `- Files are moved to \`{category}/{path-with-dashes}-{filename}\`.`,
    `- Example: \`docs/chapter1/lesson1.txt\` (category: reports) → \`reports/docs-chapter1-lesson1.txt\``,
    ``,
    `### Important Notes`,
    ``,
    `- Always use \`LC_ALL=C sort\` for consistent ASCII-based sorting.`,
    `- Quote all variables: \`"$file"\` not \`$file\`.`,
    `- If on Windows, use WSL or Git Bash.`,
    `- Handle Windows line endings: add \`| tr -d '\\r'\` when reading category.`,
    ``,
    `> **Note**: Your hash depends on the ZIP file downloaded from your exam. Run the script on your extracted files.`,
  ].join('\n');

  return {
    type: 'guide',
    answer: 'find . -type f | LC_ALL=C sort | sha256sum',
    guide,
    answerDisplay: [
      `### Q4: File Reorganizer`,
      ``,
      `This question generates a unique ZIP for your account. You must:`,
      `1. Download and extract the ZIP.`,
      `2. Reorganize files by their \`category:\` tag.`,
      `3. Run \`find . -type f | LC_ALL=C sort | sha256sum\`.`,
      `4. Submit the hash.`,
      ``,
      `Read the **Implementation Guide** for the full bash script.`,
    ].join('\n'),
  };
}
