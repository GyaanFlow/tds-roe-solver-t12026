import { fnv1a, makeGuideResult, normalizeEmail } from './utils.js';

export const id = 'q-termlog-ollama-modelfile-server';
export const title = 'Q15: Create a Custom Ollama Model (termlog)';

export function computeModelAssignment(email) {
  const norm = normalizeEmail(email);
  const t = fnv1a(norm);
  const hex = t.toString(16);
  return {
    model: `ga2-assistant-${hex}`,
    system: `You are the deployment assistant for project ${hex}. Give concise answers and never invent commands.`,
    temperature: [0.1, 0.2, 0.3][t % 3],
    num_ctx: [2048, 4096][t % 2],
    seed: 10 + (t % 990),
    num_predict: 64 + (t % 65)
  };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const a = computeModelAssignment(norm);

  const modelfileContent = [
    'FROM llama3.2',
    `SYSTEM """${a.system}"""`,
    `PARAMETER temperature ${a.temperature}`,
    `PARAMETER num_ctx ${a.num_ctx}`,
    `PARAMETER seed ${a.seed}`,
    `PARAMETER num_predict ${a.num_predict}`
  ].join('\n');

  const guide = `### 🎯 Quick Summary
This question tests creating a custom Ollama model configuration using a **Modelfile** and capturing it in a signed terminal recording using **termlog**.
Your personal parameters are:
- **Model Name:** \`${a.model}\`
- **Temperature:** \`${a.temperature}\`
- **Num Context (num_ctx):** \`${a.num_ctx}\`
- **Seed:** \`${a.seed}\`
- **Num Predict:** \`${a.num_predict}\`
- **System Prompt:**
  \`\`\`text
  ${a.system}
  \`\`\`

---

### 🧒 Child-Friendly Step-by-Step Instructions:

#### Step 1: Install Ollama & termlog
1. Make sure [Ollama](https://ollama.com/) is installed and running on your computer.
2. In your terminal, pull any small base model:
   \`\`\`bash
   ollama pull llama3.2
   \`\`\`
3. Log in to termlog with your registered email:
   \`\`\`bash
   termlog login
   # (Enter: ${norm})
   \`\`\`

---

#### Step 2: Start the Recording Session
Start the recording:
\`\`\`bash
termlog rec model.cast
\`\`\`

---

#### Step 3: Write the Modelfile Inside the Recording
Create the \`Modelfile\` by running:
\`\`\`bash
cat << 'EOF' > Modelfile
${modelfileContent}
EOF
\`\`\`

---

#### Step 4: Build the Model & Run Verification Markers
Run these exact commands in order:

**1. Create the model:**
\`\`\`bash
ollama create ${a.model} -f Modelfile
\`\`\`

**2. Print verification markers and inspect configuration:**
\`\`\`bash
printf '\\nMODELFILE_BEGIN ${a.model}\\n'
ollama show --modelfile ${a.model}
printf '\\nMODELFILE_END ${a.model}\\n'
\`\`\`

---

#### Step 5: Finish & Package the Archive
Exit the recording session and create the submission tarball:
\`\`\`bash
exit
tar -czf submission.tar.gz model.cast model.cast.jwt
\`\`\`

---

#### Step 6: Upload and Submit the Public URL
1. Upload \`submission.tar.gz\` to a public file host (GitHub release, Catbox, Transfer.sh, etc.).
2. Paste the public download link (e.g. \`https://.../submission.tar.gz\`) into the answer box and click **Check**!`;

  return makeGuideResult({
    title,
    answer: 'Follow the step-by-step guide to record your Ollama modelfile with termlog, then paste the public URL of submission.tar.gz.',
    guide,
    variant: `Seeded Ollama model configuration (${a.model})`
  });
}
