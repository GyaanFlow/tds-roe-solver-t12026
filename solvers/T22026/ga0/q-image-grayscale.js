// Solver: Q14 — Image Grayscale Reconstruction (Direct Solution)
export const id = 'q-image-grayscale-rebuild';
export const title = 'Q14: Image Grayscale Reconstruction';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q-image-grayscale-rebuild/';

  return {
    type: 'solved',
    variant: 'Pre-deployed Forensic Jigsaw & Grayscale Sandbox',
    answer: directUrl,
    answerDisplay: `### Forensic Reconstruction Hub\n\nSubmit via the pre-deployed Drag & Drop utility:\n\n1. Open the **Reconstruction Tool**:\n   [${directUrl}](${directUrl})\n2. Download and drop your \`jigsaw.webp\` image.\n3. Instantly download the losslessly reassembled grayscale PNG and upload it to the exam portal.`,
    guide: `### 🚀 Submission Guide\n\n1. Click and open the pre-deployed Reconstruction tool:\n   [Forensic Reconstruction Hub](${directUrl})\n2. Download \`jigsaw.webp\` from the exam portal.\n3. Drop it inside the tool box to reconstruct.\n4. Click **Download Lossless PNG** to download your solved image.\n5. Upload the PNG to the exam portal.`,
  };
}
