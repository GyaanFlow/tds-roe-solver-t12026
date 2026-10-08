import { makeGuideResult, markdownCodeBlock } from './utils.js';

export const id = 'q-git-forensics-token-server';
export const title = 'Q10: Git Forensics — Recover the Leaked Token';

export async function solve() {
  const gitBashCommands = [
    'mkdir t3-ga1-forensics',
    'cd t3-ga1-forensics',
    'git init',
    'git fast-import < ../history.fi',
    'git log --all --graph --decorate --oneline',
    'git log --all --oneline --name-only',
  ].join('\n');
  const searchCommands = [
    "git log --all -G 'stg_[A-Za-z0-9_]+' --format='%H %s' --",
    "git log --all -p --",
    "git log --all --reverse -S'THE_FULL_TOKEN' --format='%H%x09%s' --",
    'git show --format=fuller --stat COMMIT_HASH',
    'git show COMMIT_HASH --',
  ].join('\n');
  const guide = [
    '### Git Forensics: find where the token first entered history',
    '',
    'This question provides a personalized Git fast-import stream inside its exam question-data frame. The token and commit subject are different per exam data, so this guide shows how to inspect your own artifact; do not use sample credentials or publish the repository.',
    '',
    '#### 1. Save the supplied history safely',
    '',
    '1. In the exam, locate the Git history frame for this question. Open its question-data URL or use the provided download control, then save the raw response as history.fi.',
    '2. Keep history.fi private on your computer. It contains a deliberately leaked staging token. Do not upload it to GitHub, paste the token into a public issue, or commit the imported repository anywhere.',
    '3. Install Git for Windows if Git Bash is not available. Open **Git Bash** in a folder next to history.fi. The commands below assume history.fi is one folder above the new working folder.',
    '',
    '#### 2. Rebuild the repository',
    '',
    `Run these commands in Git Bash:\n\n${markdownCodeBlock(gitBashCommands, 'bash')}`,
    '',
    'The fast-import command reads the stream from standard input and reconstructs its commits and branches. If you saved the file elsewhere, replace ../history.fi with its actual path. Keep this work in a fresh directory so unrelated Git history cannot confuse the search.',
    '',
    '#### 3. Locate token changes',
    '',
    'First inspect the commit graph and file names printed by the commands above. Then search for likely staging-token patterns and review patches. Git history searches are case-sensitive by default.',
    '',
    `${markdownCodeBlock(searchCommands, 'bash')}`,
    '',
    'Replace THE_FULL_TOKEN with the token you found, without the placeholder quotes. The -S search lists commits where that exact string was added or removed. Read each matching patch: the answer is the commit where the token first appears as an addition, not the later commit that deletes or rotates it. The -G search is a useful starting point when the token has a recognizable prefix such as stg_.',
    '',
    'If the -G expression finds nothing, use git log --all -p and search the terminal output for words such as token, secret, or stg_. You can also inspect an individual file at a commit with git show COMMIT_HASH:path/to/file.',
    '',
    '#### 4. Confirm the commit subject',
    '',
    'Use the full commit hash from the search result with git show --format=fuller --stat COMMIT_HASH. Check the patch with git show COMMIT_HASH -- and make sure it introduces the token. Copy the subject line exactly; do not use the later rotation/deletion commit subject.',
    '',
    '#### 5. Submit the required JSON',
    '',
    'Return one valid JSON object using the exact keys requested by the exam, for example {"token":"the-found-value","commit_subject":"the exact subject"}. Replace both example values. Escape any double quotes or backslashes if they occur in a value, and do not add Markdown fences or explanatory text around the JSON.',
    '',
    'Troubleshooting: if git fast-import reports a fatal parse error, make sure you saved the raw stream rather than an HTML error page; if git log shows no commits, check that the import command ran from the new repository and that the input path exists.',
  ].join('\n');
  return makeGuideResult(
    'Inspect the exam-provided history locally and submit the token plus its introducing commit subject as JSON.',
    guide,
    'Authenticated per-student Git history required',
  );
}
