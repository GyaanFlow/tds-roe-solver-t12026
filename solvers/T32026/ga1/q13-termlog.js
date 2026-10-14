import { makeGuideResult } from './utils.js';
import { helperSection, registerHelperCopy } from './console-helper-guide.js';

export const id = 'q-termlog-rec-server';
export const title = 'Q13: Decode It in the Terminal (termlog)';

export async function solve(email) {
  registerHelperCopy();
  const guide = `### 🎯 Quick Summary
This question tests using **termlog** (a tool that records and digitally signs terminal sessions). You record yourself decoding a 3-step transformed secret (ROT13, Hex, and Reverse String).

---

### 📋 Super-Simple Step-by-Step Instructions:

#### Step 1: Install termlog & Log in
Open your terminal (macOS/Linux or Git Bash on Windows):
\`\`\`bash
# 1. Install termlog (if not already installed)
npm install -g termlog
# OR follow github.com/mynkpdr/termlog instructions

# 2. Login with your exact exam email:
termlog login
\`\`\`
*(When prompted in the browser, log in with \`${email || 'your exam email'}\`)*.

---

#### Step 2: Start Recording
In the same terminal window, run:
\`\`\`bash
termlog rec demo.cast
\`\`\`
*(Your terminal is now recording! Everything you type will be saved).*

---

#### Step 3: Fetch your challenge
Inside the recording, paste the curl command shown on your exam page:
\`\`\`bash
curl -s "https://exam.sanand.workers.dev/questionData?email=${encodeURIComponent(email || 'YOUR_EMAIL')}&quizSign=...&questionId=q-termlog-rec-server"
\`\`\`
You will see an encoded text (for example: \`676e...ed63\`).

---

#### Step 4: Decode it with real shell commands (inside the recording)
Your challenge was put through three reversible steps — ROT13, hex and reversal — in some order. Save the cipher text and try all six orders; exactly one prints readable text:

\`\`\`bash
tr -d '\\r\\n ' < challenge.txt > cipher.txt      # if the output was JSON, put just the cipher text in cipher.txt
cat cipher.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m' | xxd -r -p | rev
cat cipher.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m' | rev | xxd -r -p
cat cipher.txt | xxd -r -p | tr 'A-Za-z' 'N-ZA-Mn-za-m' | rev
cat cipher.txt | xxd -r -p | rev | tr 'A-Za-z' 'N-ZA-Mn-za-m'
cat cipher.txt | rev | tr 'A-Za-z' 'N-ZA-Mn-za-m' | xxd -r -p
cat cipher.txt | rev | xxd -r -p | tr 'A-Za-z' 'N-ZA-Mn-za-m'
\`\`\`
The readable result is your code. The commands must run **inside the recording** (the grader checks the recording itself), and the code changes every 3 hours, so fetch and decode in one sitting. (\`xxd\` ships with Git for Windows, macOS and most Linux; on Windows use Git Bash.)

---

#### Step 5: Stop recording & Pack the submission
In the terminal, type:
\`\`\`bash
exit
\`\`\`
termlog will create two files: \`demo.cast\` and \`demo.cast.jwt\`.

Now compress them into a tar.gz archive:
\`\`\`bash
tar -czf submission.tar.gz demo.cast demo.cast.jwt
\`\`\`

---

#### Step 6: Upload & Submit
1. Upload \`submission.tar.gz\` to any public link:
   - **GitHub Release** / **GitHub raw** repository file
   - **Google Drive** (shared as "Anyone with link can view")
   - Any public file host (like \`filebin.net\` or \`catbox.moe\`)
2. Paste the public download URL of \`submission.tar.gz\` into the answer box and click **Submit**!`;

  return makeGuideResult(
    'Follow the 6 simple steps to record termlog session, decode it with the six real shell pipelines, and submit the tar.gz URL.',
    `${guide}\n\n---\n\n${helperSection('q13')}`,
    'Signed Terminal Recording Walkthrough'
  );
}
