// Solver: Q8 — GitHub Pages with email in HTML
import { normalizeEmail } from './utils.js';

export const id = 'q-github-pages';
export const title = 'Q8: GitHub Pages with Email';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function solve(email) {
  const norm = normalizeEmail(email);

  const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My TDS Portfolio</title>
</head>
<body>
  <h1>Tools in Data Science — Portfolio</h1>
  <p>Email: <!--email_off-->${escapeHtml(norm)}<!--/email_off--></p>
  <p>This page is published using GitHub Pages.</p>
</body>
</html>`;

  const guide = [
    `### Steps to publish a GitHub Pages site`,
    ``,
    `1. Create a **public** GitHub repository (any name, e.g. \`tds-portfolio\`).`,
    ``,
    `2. Create an \`index.html\` file with your email wrapped in the CloudFlare anti-obfuscation tag:`,
    ``,
    `\`\`\`html`,
    pageHtml,
    `\`\`\``,
    ``,
    `3. Commit and push \`index.html\` to the \`main\` branch.`,
    ``,
    `4. Enable **GitHub Pages**:`,
    `   - Go to repo Settings → Pages`,
    `   - Source: Deploy from branch → \`main\` → \`/ (root)\``,
    `   - Click **Save**`,
    ``,
    `5. Wait 1–2 minutes, then visit: \`https://[YOUR-USERNAME].github.io/[REPO-NAME]/\``,
    ``,
    `6. Submit that URL in the exam. If cache is stale, append \`?v=1\` to bust it.`,
    ``,
    `### ⚠️ CloudFlare email obfuscation`,
    ``,
    `GitHub Pages uses CloudFlare which auto-obfuscates emails in HTML.`,
    `**You must** wrap your email with:`,
    `\`\`\`html`,
    `<!--email_off-->${escapeHtml(norm)}<!--/email_off-->`,
    `\`\`\``,
    `This prevents CloudFlare from mangling it.`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'HTML template with your email — follow the Implementation Guide to publish',
    answer: `https://[YOUR-USERNAME].github.io/[REPO-NAME]/`,
    guide,
    answerDisplay: [
      `### Q8: GitHub Pages`,
      ``,
      `Create an \`index.html\` with your email (wrapped in \`<!--email_off-->\` tags) and publish via GitHub Pages.`,
      ``,
      `**Your email in HTML:**`,
      `\`\`\`html`,
      `<!--email_off-->${escapeHtml(norm)}<!--/email_off-->`,
      `\`\`\``,
      ``,
      `**Answer format:** \`https://[USERNAME].github.io/[REPO]/\``,
      ``,
      `Read the **Implementation Guide** for the full page template and setup steps.`,
    ].join('\n'),
  };
}
