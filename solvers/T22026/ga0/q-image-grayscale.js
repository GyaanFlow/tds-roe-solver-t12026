// Solver: Q14 — Image Grayscale Reconstruction (Direct Solution)
export const id = 'q-image-grayscale-rebuild';
export const title = 'Q14: Image Grayscale Reconstruction';

export async function solve(email) {
  const code = `
from PIL import Image

TILE_MAP = {
    (0, 0): (2, 1), (0, 1): (1, 1), (0, 2): (4, 1), (0, 3): (0, 3), (0, 4): (0, 1),
    (1, 0): (1, 4), (1, 1): (2, 0), (1, 2): (2, 4), (1, 3): (4, 2), (1, 4): (2, 2),
    (2, 0): (0, 0), (2, 1): (3, 2), (2, 2): (4, 3), (2, 3): (3, 0), (2, 4): (3, 4),
    (3, 0): (1, 0), (3, 1): (2, 3), (3, 2): (3, 3), (3, 3): (4, 4), (3, 4): (0, 2),
    (4, 0): (3, 1), (4, 1): (1, 2), (4, 2): (1, 3), (4, 3): (0, 4), (4, 4): (4, 0),
}

def reconstruct_grayscale(image_path="jigsaw.webp", output_path="q-image-grayscale-rebuild.png"):
    src = Image.open(image_path).convert("RGBA")
    cols = rows = 5
    tile_w = src.width // cols
    tile_h = src.height // rows
    rebuilt = Image.new("RGBA", src.size)

    for (src_row, src_col), (dst_row, dst_col) in TILE_MAP.items():
        tile = src.crop((
            src_col * tile_w,
            src_row * tile_h,
            (src_col + 1) * tile_w,
            (src_row + 1) * tile_h,
        ))
        rebuilt.paste(tile, (dst_col * tile_w, dst_row * tile_h))

    pixels = rebuilt.load()
    for y in range(rebuilt.height):
        for x in range(rebuilt.width):
            r, g, b, a = pixels[x, y]
            gray = round(0.2126 * r + 0.7152 * g + 0.0722 * b)
            pixels[x, y] = (gray, gray, gray, a)

    rebuilt.save(output_path)
    print(f"Saved exact grayscale reconstruction to {output_path}")

if __name__ == "__main__":
    reconstruct_grayscale()
`.trim();

  return {
    type: 'solved',
    variant: '5x5 tile rebuild + Rec.709 grayscale',
    answer: code,
    answerDisplay: `### Instructions\n\n1. Download the exam image as \`jigsaw.webp\`.\n2. Run the Python script from the **Answer** box in the same folder (requires \`pillow\`).\n3. Upload the generated \`q-image-grayscale-rebuild.png\` to the exam portal.`,
  };
}
