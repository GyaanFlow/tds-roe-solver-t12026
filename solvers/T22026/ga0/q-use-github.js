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
    `### Implementation Guide`,
    ``,
    `1. Create a new **public** GitHub repository.`,
    `2. Create a file named exactly \`email.json\` in the repository root.`,
    `3. Paste this exact JSON into the file:`,
    ``,
    `\`\`\`json`,
    jsonContent,
    `\`\`\``,
    ``,
    `4. Commit the file to the \`main\` branch.`,
    `5. Open \`email.json\` on GitHub and click **Raw**.`,
    `6. Copy the URL from the browser address bar.`,
    `7. Submit that raw URL in the exam portal.`,
    ``,
    `### URL Format`,
    ``,
    `Your submitted URL must look like this:`,
    ``,
    `\`${rawUrlTemplate}\``,
    ``,
    `It must begin with:`,
    ``,
    `\`https://raw.githubusercontent.com/\``,
    ``,
    `### Validator Notes`,
    ``,
    `The checker fetches your submitted URL and parses it as JSON.`,
    `It passes only when the JSON has exactly this email value:`,
    ``,
    `\`\`\`json`,
    jsonContent,
    `\`\`\``,
    ``,
    `Do not submit the normal GitHub file page URL like \`https://github.com/.../blob/main/email.json\`.`,
    `Do not submit the repository URL.`,
    `Submit only the raw \`email.json\` URL.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'GitHub raw email.json URL — read Implementation Guide for details instruction how to use',
    answer: jsonContent,
    guide,
    answerDisplay: [
      `### email.json Content`,
      ``,
      `Create \`email.json\` with this content:`,
      ``,
      `\`\`\`json`,
      jsonContent,
      `\`\`\``,
      ``,
      `### Submit This Type of URL`,
      ``,
      `\`${rawUrlTemplate}\``,
      ``,
      `Read the Implementation Guide for details instruction how to use.`,
    ].join('\n'),
  };
}
