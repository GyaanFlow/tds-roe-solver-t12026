import { makeGuideResult } from './utils.js';

export const id = 'q-termlog-rec-server';
export const title = 'Q13: Decode It in the Terminal (termlog)';

export async function solve(email) {
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

#### Step 4: Decode the string using this Universal One-Liner
Copy your encoded string, replace \`PASTE_ENCODED_STRING_HERE\` below, and run:

\`\`\`bash
# This automatically handles ROT13, Hex decoding, and string reversal:
python3 -c '
import sys, codecs
s = "PASTE_ENCODED_STRING_HERE".strip()
# Try decode order: Hex -> ROT13 -> Reverse
try:
    decoded = bytes.fromhex(s).decode("utf-8")
    rot = codecs.decode(decoded, "rot_13")
    print("Decoded (Option A):", rot[::-1])
except Exception:
    pass
try:
    rot = codecs.decode(s, "rot_13")
    decoded = bytes.fromhex(rot).decode("utf-8")
    print("Decoded (Option B):", decoded[::-1])
except Exception:
    pass
'
\`\`\`
Your decoded answer will be printed in the terminal!

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
    'Follow the 6 simple steps to record termlog session, decode with the python one-liner, and submit the tar.gz URL.',
    guide,
    'Signed Terminal Recording Walkthrough'
  );
}
