import { makeGuideResult, markdownCodeBlock } from './utils.js';
import { helperSection, registerHelperCopy } from './console-helper-guide.js';

export const id = 'q-github-pages';
export const title = 'Q9: Host Your Portfolio on GitHub Pages';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export async function solve(email) {
  registerHelperCopy();
  const safeEmail = escapeHtml(email);
  const markerHtml = `<!--email_off-->${safeEmail}<!--/email_off-->`;
  const pageHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>My TDS Portfolio</title>
</head>
<body>
  <main>
    <h1>My Tools in Data Science Portfolio</h1>
    <p>This page is published with GitHub Pages.</p>
    <p>Student email: ${markerHtml}</p>
  </main>
</body>
</html>`;
  const guide = [
    '### Publish your page with GitHub Pages',
    '',
    'The page must be deployed under a GitHub account you control. The grader checks the URL you submit and looks for your exact registered email in the published HTML. The complete ready-to-publish index.html is in this guide.',
    '',
    '#### 1. Create a repository',
    '',
    '1. Sign in to [GitHub](https://github.com/).',
    '2. Select **New repository**. Give it a simple name such as tds-ga1-portfolio (use another name if that one already exists).',
    '3. Set it to **Public**, then select **Create repository**. A public site is required for the standard free GitHub Pages setup.',
    '',
    '#### 2. Add the home page',
    '',
    '1. On the repository page, choose **Add file → Create new file**.',
    '2. Name the file exactly index.html at the repository root. Do not put it in a subfolder.',
    '3. Copy all HTML from the Ready-to-publish index.html section below and paste it into the editor. Keep the <!--email_off--> and <!--/email_off--> markers around your registered email; they prevent Cloudflare email obfuscation from hiding it in the response HTML.',
    '4. Select **Commit changes** and commit to the main branch.',
    '',
    '#### 3. Turn on Pages',
    '',
    '1. Open the repository **Settings → Pages**.',
    '2. Under **Build and deployment**, choose **Deploy from a branch**.',
    '3. Select branch main and folder /(root), then select **Save**.',
    '4. Wait for Pages deployment to finish. The repository **Actions** tab or **Settings → Pages** shows deployment status and the published URL.',
    '',
    '#### 4. Verify and submit',
    '',
    'The project-site URL format is https://YOUR-GITHUB-USERNAME.github.io/REPOSITORY-NAME/. Replace both capitalized parts with the account and repository you actually created; do not submit the example. Open the URL in a private/incognito window and confirm the page loads. You can also choose **View page source** and search for the exact email and its surrounding marker comments. Submit this real URL to the exam.',
    '',
    '#### Common problems',
    '',
    '- **404:** confirm index.html is at the selected publishing source root, branch is main, folder is /(root), and deployment completed.',
    '- **Old page:** wait for the latest deployment, then hard-refresh; a harmless query such as ?v=2 can bypass browser cache.',
    '- **Email not found:** make sure the page source contains the exact registered address inside both marker comments; check that the email was not edited.',
    '- **Wrong URL:** use the URL displayed in Pages settings. Repository project sites include the repository name after .github.io/.',
    '',
    "GitHub's current guides: [configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [troubleshoot 404 errors](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites).",
  ].join('\n');

  return makeGuideResult(
    'Publish the provided index.html from your own GitHub repository, then submit its live Pages URL.',
    `${guide}\n\n${helperSection('q9')}\n\n### Ready-to-publish index.html\n\n${markdownCodeBlock(pageHtml, 'html')}`,
    'Your GitHub account and deployment are required',
  );
}
