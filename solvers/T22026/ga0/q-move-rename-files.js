// Solver: Q16 — Move and Rename Files (Direct Solution)
export const id = 'q-move-rename-files';
export const title = 'Q16: Move and Rename Files';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q16/';

  return {
    type: 'solved',
    variant: 'Pre-deployed File Move & Rename Sandbox',
    answer: directUrl,
    answerDisplay: `### File Move, Rename & Hash Solver\n\nResolve this question instantly online:\n\n1. Open the **Hash Solver Tool**:\n   [${directUrl}](${directUrl})\n2. Download the exam task zip file (\`q-move-rename-files.zip\`).\n3. Upload the zip file, enter your registered student email, and copy the computed hash directly to the exam portal!`,
    guide: `### 🚀 Submission Guide\n\n1. Click and open the pre-deployed Hash Solver tool:\n   [File Move, Rename & Hash Solver](${directUrl})\n2. Download \`q-move-rename-files.zip\` from the exam portal.\n3. Upload the zip file into the tool and enter your registered student email.\n4. Click solve to instantly compute the correct SHA-256 hash.\n5. Copy the hash and paste it into the exam portal.`,
  };
}
