// Solver: Q5 — Asciinema terminal session recorder
import { normalizeEmail } from './utils.js';

export const id = 'q-asciinema-session';
export const title = 'Q5: Asciinema Terminal Session';

export async function solve(email) {
  const norm = normalizeEmail(email);

  const guide = [
    `### Steps`,
    ``,
    `1. Check asciinema version:`,
    `   \`\`\`bash`,
    `   uvx asciinema --version`,
    `   \`\`\``,
    ``,
    `2. Start recording:`,
    `   \`\`\`bash`,
    `   uvx asciinema rec session.cast`,
    `   \`\`\``,
    ``,
    `3. Type the commands shown in your exam (the session marker and the required command):`,
    `   \`\`\`bash`,
    `   echo 'SESSION_MARKER_FROM_EXAM'    # ← REQUIRED: type this exactly`,
    `   # Then type the required command from your exam...`,
    `   \`\`\``,
    ``,
    `4. Stop recording by pressing **Ctrl+D** (or typing \`exit\`).`,
    ``,
    `5. The file \`session.cast\` is now created. Submit its contents.`,
    ``,
    `### View/verify the recording`,
    `\`\`\`bash`,
    `cat session.cast`,
    `# Or play it back:`,
    `uvx asciinema play session.cast`,
    `\`\`\``,
    ``,
    `### Expected format of session.cast`,
    ``,
    `\`\`\`json`,
    `{"version": 2, "width": 80, "height": 24, "timestamp": 1234567890,`,
    `"env": {"SHELL": "/bin/bash", "TERM": "xterm-256color"},`,
    `"stdout": [`,
    `  [0.1, "$ echo 'SESSION_MARKER'\\r\\n"],`,
    `  [0.2, "SESSION_MARKER\\r\\n"],`,
    `  ...`,
    `]}`,
    `\`\`\``,
    ``,
    `### Common Issues`,
    `- **Command not found**: Use \`uvx asciinema\` instead of \`asciinema\``,
    `- **Wrong marker**: Type the marker EXACTLY as shown in the exam`,
    `- **Missing commands**: Type ALL commands listed, in order`,
    `- **Invalid output**: Submit the raw JSON from \`.cast\` file, don't modify it`,
    ``,
    `> **Note**: The session marker and required commands are personalized in the exam. Check your exam question.`,
  ].join('\n');

  return {
    type: 'guide',
    answer: 'uvx asciinema rec session.cast',
    guide,
    answerDisplay: [
      `### Q5: Asciinema Terminal Session`,
      ``,
      `Record a terminal session with asciinema and submit the \`session.cast\` file contents.`,
      ``,
      `**Quick steps:**`,
      `1. Run: \`uvx asciinema rec session.cast\``,
      `2. Type the session marker (from your exam) then the required commands`,
      `3. Press Ctrl+D to stop recording`,
      `4. Submit contents of \`session.cast\``,
      ``,
      `Read the **Implementation Guide** for details and troubleshooting.`,
    ].join('\n'),
  };
}
