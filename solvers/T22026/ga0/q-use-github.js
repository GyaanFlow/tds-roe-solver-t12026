// Solver: Q24 — Use GitHub
import { normalizeEmail } from './utils.js';

export const id = 'q-use-github';
export const title = 'Q24: Use GitHub';

function buildRawUrlTemplate() {
  return 'https://raw.githubusercontent.com/<GITHUB_USERNAME>/<REPO_NAME>/main/email.json';
}

export async function solve(email) {
  const norm = normalizeEmail(email);

  const jsonContent = JSON.stringify({ email: norm }, null, 2);
  const rawUrlTemplate = buildRawUrlTemplate();

  const guide = [
    `### 📋 Step-by-Step Implementation Guide`,
    ``,
    `**Step 1:** Create a new **public** GitHub repository (any name, e.g. \`tds-jan-2025\`).`,
    ``,
    `**Step 2:** Create a file named exactly \`email.json\` in the repository **root** directory.`,
    ``,
    `**Step 3:** Paste this exact JSON content into the file:`,
    ``,
    `\`\`\`json`,
    jsonContent,
    `\`\`\``,
    ``,
    `**Step 4:** Commit the file to the \`main\` branch (this is the default branch).`,
    ``,
    `**Step 5:** Get the **raw** URL:`,
    `- Navigate to \`email.json\` on GitHub.`,
    `- Click the **Raw** button (top-right of the file viewer).`,
    `- Copy the URL from your browser's address bar.`,
    ``,
    `**Step 6:** Submit that raw URL in the exam portal.`,
    ``,
    `### 🔗 Raw URL Format`,
    ``,
    `Your submitted URL **must** follow this pattern:`,
    ``,
    `\`${rawUrlTemplate}\``,
    ``,
    `It must begin with \`https://raw.githubusercontent.com/\``,
    ``,
    `**Example:** \`https://raw.githubusercontent.com/johndoe/tds-jan-2025/main/email.json\``,
    ``,
    `### ⚠️ Common Mistakes`,
    ``,
    `- ❌ Do NOT submit \`https://github.com/.../blob/main/email.json\` (this is the HTML page, not raw JSON).`,
    `- ❌ Do NOT submit the repository URL (\`https://github.com/user/repo\`).`,
    `- ❌ Do NOT put \`email.json\` inside a subfolder — it must be in the repo root.`,
    `- ❌ Do NOT make the repository private — the validator must be able to fetch it.`,
    `- ✅ Submit ONLY the raw \`email.json\` URL.`,
    ``,
    `### ✅ Validator Notes`,
    ``,
    `The checker fetches your submitted URL and parses the response as JSON.`,
    `It passes only when the JSON contains exactly this email value:`,
    ``,
    `\`\`\`json`,
    jsonContent,
    `\`\`\``,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'GitHub raw email.json URL — see Implementation Guide for detailed instructions',
    answer: jsonContent,
    guide,
    answerDisplay: [
      `### 📄 email.json Content`,
      ``,
      `Create \`email.json\` in your **public** GitHub repo root with this exact content:`,
      ``,
      `\`\`\`json`,
      jsonContent,
      `\`\`\``,
      ``,
      `### 🔗 URL to Submit`,
      ``,
      `Navigate to the file on GitHub → click **Raw** → copy the URL. It should look like:`,
      ``,
      `\`${rawUrlTemplate}\``,
      ``,
      `📖 See the **Implementation Guide** tab for detailed step-by-step instructions.`,
    ].join('\n'),
  };
}
