import { makeGuideResult } from './utils.js';

export const id = 'q-http-headers-server';
export const title = 'Q2: Find the Code in the Response Headers';

export async function solve(email) {
  const guide = `### 🎯 Quick Summary
This question tests finding hidden information inside **HTTP response headers** (which browsers normally hide).

---

### 📋 Step-by-Step Instructions (Easy as 1-2-3)

1. **Look at the Question on your Exam Screen:**
   The exam gives you a special command that looks like:
   \`\`\`bash
   curl -i "https://exam.sanand.workers.dev/questionData?email=YOUR_EMAIL&quizSign=...&questionId=q-http-headers-server"
   \`\`\`

2. **Open Terminal or Command Prompt:**
   - **Windows:** Press \`Win + R\`, type \`cmd\` or \`powershell\`, and press Enter.
   - **Mac/Linux:** Open the **Terminal** app.

3. **Copy & Paste that curl command:**
   Paste the exact \`curl -i "..."\` line from your exam page and press Enter.

4. **Find \`X-Exam-Code\`:**
   Look near the top of the output in the header section. You will see lines like:
   \`\`\`http
   HTTP/2 200
   content-type: text/plain; charset=utf-8
   X-Exam-Code: 7F3KQ9M2
   date: ...
   \`\`\`
   Copy **ONLY** the code value next to \`X-Exam-Code:\` (e.g., \`7F3KQ9M2\`).

5. **Paste into the Answer box:**
   Paste that code into your exam and submit!

---

> 💡 **Tip:** This code refreshes every hour. Make sure to fetch and submit it within the same hour!
> ⚠️ **Common Mistake:** Do not submit the text body of the response; submit only the value from the \`X-Exam-Code\` header.`;

  return makeGuideResult(
    'Copy the curl -i command from your exam page, run it in terminal, and copy the X-Exam-Code header value.',
    guide,
    'Live Authenticated Header Extraction'
  );
}
