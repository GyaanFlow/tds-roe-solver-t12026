import { fnv1a, makeGuideResult, normalizeEmail } from './utils.js';

export const id = 'q-termlog-httpbin-server';
export const title = 'Q1: HTTPBin Terminal Lab (termlog)';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const hash = fnv1a(norm);
  const tag = `http-${hash.toString(16)}`;
  const quantity = 2 + (hash % 19);
  const status = [400, 404, 418, 422][hash % 4];

  const guide = `### 🎯 Quick Summary
This question tests your ability to execute standard HTTP requests using \`curl\` inside a signed terminal session using **termlog**.
Your personal parameters are:
- **Email:** \`${norm}\`
- **Tag & Dummy Token:** \`${tag}\`
- **Quantity:** \`${quantity}\`
- **Target Status Code:** \`${status}\`

---

### 🧒 Child-Friendly Step-by-Step Instructions:

#### Step 1: Open a Terminal & Log In
Open your Linux terminal (or WSL / Git Bash / macOS Terminal):
\`\`\`bash
# 1. Install termlog if not already installed
curl -fsSL https://raw.githubusercontent.com/mynkpdr/termlog/main/install.sh | bash

# 2. Login with your exact exam email
termlog login
# (Enter: ${norm})
\`\`\`

---

#### Step 2: Start the Recording Session
Start recording to \`httpbin.cast\`:
\`\`\`bash
termlog rec httpbin.cast
\`\`\`

---

#### Step 3: Define the Capture Helper
Copy and paste this helper function directly into your terminal session:
\`\`\`bash
capture() { task="$1"; shift; printf '\\nHTTPBIN_BEGIN ${tag} %s\\n' "$task"; "$@"; printf '\\nHTTPBIN_END ${tag} %s\\n' "$task"; }
\`\`\`

---

#### Step 4: Execute the 7 Exact Tasks in Order
Copy and run each command one by one:

**1. GET Request:**
\`\`\`bash
capture GET curl -sS "https://httpbin.org/get?course=TDS&tag=${tag}" -H "X-Exam-Tag: ${tag}"
\`\`\`

**2. POST Request (JSON):**
\`\`\`bash
capture POST curl -sS -X POST "https://httpbin.org/post" -H "Content-Type: application/json" -d '{"tag":"${tag}","quantity":${quantity},"active":true}'
\`\`\`

**3. FORM Request (PUT):**
\`\`\`bash
capture FORM curl -sS -X PUT "https://httpbin.org/put" -d "tag=${tag}&quantity=${quantity}"
\`\`\`

**4. AUTH Request (Bearer Token):**
\`\`\`bash
capture AUTH curl -sS "https://httpbin.org/bearer" -H "Authorization: Bearer ${tag}"
\`\`\`

**5. REDIRECT Request:**
\`\`\`bash
capture REDIRECT curl -sS -L "https://httpbin.org/redirect-to?url=https://httpbin.org/get?tag=${tag}"
\`\`\`

**6. COOKIES Request:**
\`\`\`bash
curl -sS -c cookies.txt "https://httpbin.org/cookies/set?exam=${tag}" > /dev/null
capture COOKIES curl -sS -b cookies.txt "https://httpbin.org/cookies"
\`\`\`

**7. STATUS Request:**
\`\`\`bash
capture STATUS curl -sS -o /dev/null -w "%{http_code}" "https://httpbin.org/status/${status}"
\`\`\`

---

#### Step 5: Finish & Package the Archive
Exit the recording session and bundle the archive:
\`\`\`bash
exit
tar -czf submission.tar.gz httpbin.cast httpbin.cast.jwt
\`\`\`

---

#### Step 6: Upload and Submit the Public URL
1. Upload \`submission.tar.gz\` to any public static file hosting:
   - **GitHub Release:** Create a draft release in any public GitHub repo and attach \`submission.tar.gz\`.
   - **Catbox / Transfer.sh / File.io:** Upload and copy the direct download link.
2. Paste the public download URL (e.g. \`https://.../submission.tar.gz\`) into the answer box and hit **Check**!`;

  return makeGuideResult({
    title,
    answer: 'Follow the step-by-step guide to generate and upload submission.tar.gz, then paste the public URL.',
    guide,
    variant: `Seeded termlog recording (tag: ${tag})`,
  });
}
