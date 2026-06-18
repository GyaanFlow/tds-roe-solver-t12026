// Solver: Q7 — Git history: find parent commit hash (7-char short hash)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-git-history';
export const title = 'Q7: Git History — Parent Commit Hash';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-git-history`);

  // The timeout value is seeded per student
  const timeoutValues = [100, 200, 300, 500, 750, 1000, 1500, 2000, 3000, 5000];
  const timeoutValue = timeoutValues[Math.floor(r() * timeoutValues.length)];

  const guide = [
    `### Steps`,
    ``,
    `1. Download the repository ZIP from the exam portal.`,
    `2. Extract it and navigate into the repository folder.`,
    `3. Find the commit where \`config.json\` changed the \`timeout\` value to \`${timeoutValue}\`:`,
    ``,
    `\`\`\`bash`,
    `# Search git log for the commit that changed timeout to ${timeoutValue}`,
    `git log --all --oneline -- config.json`,
    ``,
    `# For each commit, check what the timeout was:`,
    `git log -p -- config.json | grep -A2 -B2 '"timeout"'`,
    ``,
    `# Or find it directly:`,
    `git log --all -p -- config.json | grep -B10 '"timeout": ${timeoutValue}' | grep '^commit'`,
    `\`\`\``,
    ``,
    `4. Once you find the commit hash, get its **parent** commit:`,
    ``,
    `\`\`\`bash`,
    `# Show the parent of a specific commit:`,
    `git log --pretty=format:"%h %P" | grep <commit-hash>`,
    ``,
    `# Or directly:`,
    `git rev-parse --short <commit-hash>^`,
    ``,
    `# Or using git show:`,
    `git show --pretty=format:"%P" -s <commit-hash> | cut -c1-7`,
    `\`\`\``,
    ``,
    `5. Submit the 7-character short hash of the **parent commit**.`,
    ``,
    `### Example workflow`,
    ``,
    `\`\`\`bash`,
    `# Find commits touching config.json:`,
    `git log --oneline -- config.json`,
    `# Output: abc1234 Updated timeout  ← this is the target commit`,
    `#         def5678 Initial config   ← this would be the parent`,
    ``,
    `# Get parent hash:`,
    `git rev-parse --short abc1234^`,
    `# Output: def5678  ← this is your answer`,
    `\`\`\``,
    ``,
    `> **Note**: The timeout value in your exam is **${timeoutValue}**. Find the commit where \`config.json\`'s timeout was changed to this value.`,
  ].join('\n');

  return {
    type: 'guide',
    answer: `Find parent commit of the commit that changed timeout to ${timeoutValue}`,
    guide,
    answerDisplay: [
      `### Q7: Git History Investigation`,
      ``,
      `Find the commit in the downloaded repo where \`config.json\` changed \`timeout\` to \`${timeoutValue}\`,`,
      `then identify its **parent commit** and submit the 7-char short hash.`,
      ``,
      `\`\`\`bash`,
      `git log --all -p -- config.json | grep -B20 '"timeout": ${timeoutValue}' | grep '^commit' | head -1`,
      `\`\`\``,
      ``,
      `Read the **Implementation Guide** for the full workflow.`,
    ].join('\n'),
  };
}
