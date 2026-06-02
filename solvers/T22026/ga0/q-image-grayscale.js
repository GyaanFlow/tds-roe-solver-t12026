// Solver: Q14 — Image Grayscale Reconstruction (Direct Solution)
export const id = 'q-image-grayscale-rebuild';
export const title = 'Q14: Image Grayscale Reconstruction';

export async function solve(email) {
  const directUrl = 'https://tds-roe-solver-api-t12026.onrender.com/q-image-grayscale-rebuild/';

  return {
    type: 'solved',
    variant: 'Pre-deployed Forensic Jigsaw & Grayscale Sandbox',
    answer: directUrl,
    answerDisplay: `### 🧩 Forensic Reconstruction Hub\n\nSubmit via the pre-deployed Drag & Drop utility:\n\n1. Open the **Reconstruction Tool**:\n   [${directUrl}](${directUrl})\n2. Download and drop your \`jigsaw.webp\` image.\n3. Instantly download the losslessly reassembled grayscale PNG and upload it to the exam portal.\n\n**What it does:** Unscrambles jigsaw tiles, converts to grayscale, and outputs a lossless PNG.`,
    guide: `### 🚀 Submission Guide\n\n**Using the pre-deployed tool (recommended):**\n1. Open the Reconstruction tool: [Forensic Reconstruction Hub](${directUrl})\n2. Download \`jigsaw.webp\` from the exam portal.\n3. Drop the image into the tool's upload area.\n4. Click **Download Lossless PNG** to get your solved image.\n5. Upload the PNG to the exam portal.\n\n---\n\n### 🛠️ Manual Approach with Pillow\n\nIf you want to solve it yourself using Python:\n\n\`\`\`python\nfrom PIL import Image\nimport numpy as np\n\n# 1. Load the scrambled image\nimg = Image.open("jigsaw.webp")\npixels = np.array(img)\n\n# 2. Split into tiles (e.g. the image is divided into an NxN grid)\n# Determine tile size from image dimensions\ntile_h, tile_w = pixels.shape[0] // N, pixels.shape[1] // N\n\n# 3. Rearrange tiles into correct order\n# (The ordering logic depends on the specific scramble pattern)\n\n# 4. Convert to grayscale\ngray = Image.fromarray(reconstructed).convert("L")\n\n# 5. Save as lossless PNG\ngray.save("output.png", format="PNG")\n\`\`\`\n\n**Key tips:**\n- Output MUST be a lossless PNG (not JPEG).\n- Convert to grayscale using \`.convert("L")\` — do NOT average RGB manually.\n- Tile order may follow row-major or a specific permutation embedded in metadata.`,
  };
}
