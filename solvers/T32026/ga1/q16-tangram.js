import { makeGuideResult, rng } from './utils.js';
import { targets } from './tangram-targets.js';

export const id = 'q-visual-game-tangram';
export const title = 'Q16: Geometric Reasoning — Tangram';

function makeTargetSilhouetteImage(svgPath) {
  const svgMarkup = `<svg viewBox="0 0 768 576" xmlns="http://www.w3.org/2000/svg"><rect width="768" height="576" fill="#0d140e" rx="16"/><path d="${svgPath}" fill="#22c55e" stroke="#4ade80" stroke-width="3" fill-rule="evenodd"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;
}

export async function solve(email) {
  const seed = `${email}#q-visual-game-tangram`;
  const random = rng(seed);
  const targetIndex = Math.floor(random() * targets.length);
  const target = targets[targetIndex] || targets[0];
  const targetImgSrc = makeTargetSilhouetteImage(target.svgPath);

  const guide = `## 🧩 Tangram Master Challenge: Visual Solver HUD

<div class="tangram-hud-card" style="background: linear-gradient(135deg, #090e0b 0%, #111d15 100%); border: 1px solid rgba(74, 222, 128, 0.35); border-radius: 14px; padding: clamp(14px, 3vw, 24px); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45), 0 0 24px rgba(34, 197, 94, 0.12); margin-bottom: 24px; color: #f0fdf4;">

<div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; border-bottom: 1px solid rgba(74, 222, 128, 0.2); padding-bottom: 14px; margin-bottom: 18px;">
<div>
<span style="background: rgba(34, 197, 94, 0.15); color: #4ade80; font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.06em; border: 1px solid rgba(74, 222, 128, 0.35); display: inline-block;">Target Calibration</span>
<h3 style="color: #f0fdf4; margin: 8px 0 0; font-size: clamp(1.15rem, 2.5vw, 1.45rem); font-weight: 700; letter-spacing: -0.01em;">Target ID: <span style="color: #4ade80;">${target.id}</span> <span style="font-size: 0.85rem; font-weight: 400; color: #86efac;">(${target.family})</span></h3>
</div>
<div style="display: flex; gap: 8px; flex-wrap: wrap;">
<a href="https://tds-network-games.sanand.workers.dev/tangram/" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #052e16; font-weight: 700; padding: 9px 18px; border-radius: 8px; text-decoration: none; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 0 20px rgba(34, 197, 94, 0.45); transition: transform 0.15s ease;">
<span>🎮</span> Launch Game Board
</a>
</div>
</div>

<div style="background: #050806; border: 1px solid #1c2b20; border-radius: 12px; padding: clamp(12px, 2.5vw, 20px); text-align: center; position: relative; overflow: hidden; background-image: radial-gradient(rgba(74, 222, 128, 0.18) 1.2px, transparent 1.2px); background-size: 18px 18px;">
<div style="display: flex; justify-content: space-between; align-items: center; font-family: monospace; font-size: 0.72rem; color: #4ade80; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
<span style="background: rgba(6, 78, 59, 0.6); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(74, 222, 128, 0.25);">MATRIX // 576×432</span>
<span style="background: rgba(6, 78, 59, 0.6); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(74, 222, 128, 0.25);">ACTIVE SEED ✓</span>
</div>

<div style="display: flex; justify-content: center; align-items: center; padding: 10px 0;">
<img src="${targetImgSrc}" alt="Target Silhouette ${target.id}" style="width: 100%; max-width: 380px; height: auto; border-radius: 10px; border: 1.5px solid #4ade80; box-shadow: 0 0 24px rgba(74, 222, 128, 0.35); object-fit: contain; background: #0d140e;" />
</div>

<div style="font-family: monospace; font-size: clamp(0.7rem, 1.8vw, 0.78rem); color: #86efac; margin-top: 10px; word-break: break-all;">
Target Silhouette: <span style="color: #4ade80; font-weight: bold;">${target.id}</span> | Family: <span style="color: #86efac;">${target.family}</span>
</div>
</div>

<div style="margin-top: 20px;">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
<span style="font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em;">7 Piece Inventory (Assemble Here)</span>
<span style="font-size: 0.72rem; color: #64748b; font-family: monospace;">Total Area = 32 Units</span>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px;">
<div style="background: rgba(30, 58, 138, 0.25); border: 1px solid rgba(79, 134, 198, 0.45); border-radius: 8px; padding: 8px 10px; text-align: left; color: #93c5fd; font-size: 0.78rem;">
<div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;"><polygon points="2,22 22,22 2,2" fill="#4f86c6" stroke="#93c5fd" stroke-width="1.5"/></svg>
<span>Large △ A</span>
</div>
<div style="font-size: 0.7rem; color: #60a5fa; margin-top: 4px;">Area: 8 units</div>
</div>

<div style="background: rgba(20, 83, 45, 0.25); border: 1px solid rgba(90, 164, 105, 0.45); border-radius: 8px; padding: 8px 10px; text-align: left; color: #86efac; font-size: 0.78rem;">
<div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;"><polygon points="2,22 22,22 22,2" fill="#5aa469" stroke="#86efac" stroke-width="1.5"/></svg>
<span>Large △ B</span>
</div>
<div style="font-size: 0.7rem; color: #4ade80; margin-top: 4px;">Area: 8 units</div>
</div>

<div style="background: rgba(127, 29, 29, 0.25); border: 1px solid rgba(196, 109, 94, 0.45); border-radius: 8px; padding: 8px 10px; text-align: left; color: #fca5a5; font-size: 0.78rem;">
<div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;"><polygon points="4,20 20,20 4,4" fill="#c46d5e" stroke="#fca5a5" stroke-width="1.5"/></svg>
<span>Medium △</span>
</div>
<div style="font-size: 0.7rem; color: #f87171; margin-top: 4px;">Area: 4 units</div>
</div>

<div style="background: rgba(120, 53, 15, 0.25); border: 1px solid rgba(216, 160, 61, 0.45); border-radius: 8px; padding: 8px 10px; text-align: left; color: #fde047; font-size: 0.78rem;">
<div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;"><polygon points="5,19 19,19 5,5" fill="#d8a03d" stroke="#fde047" stroke-width="1.5"/></svg>
<span>Small △ A</span>
</div>
<div style="font-size: 0.7rem; color: #facc15; margin-top: 4px;">Area: 2 units</div>
</div>

<div style="background: rgba(88, 28, 135, 0.25); border: 1px solid rgba(143, 107, 179, 0.45); border-radius: 8px; padding: 8px 10px; text-align: left; color: #d8b4fe; font-size: 0.78rem;">
<div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;"><polygon points="5,19 19,19 19,5" fill="#8f6bb3" stroke="#d8b4fe" stroke-width="1.5"/></svg>
<span>Small △ B</span>
</div>
<div style="font-size: 0.7rem; color: #c084fc; margin-top: 4px;">Area: 2 units</div>
</div>

<div style="background: rgba(19, 78, 74, 0.25); border: 1px solid rgba(74, 166, 166, 0.45); border-radius: 8px; padding: 8px 10px; text-align: left; color: #5eead4; font-size: 0.78rem;">
<div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;"><rect x="4" y="4" width="16" height="16" fill="#4aa6a6" stroke="#5eead4" stroke-width="1.5" rx="1"/></svg>
<span>Square □</span>
</div>
<div style="font-size: 0.7rem; color: #2dd4bf; margin-top: 4px;">Area: 4 units</div>
</div>

<div style="background: rgba(131, 24, 67, 0.25); border: 1px solid rgba(196, 91, 142, 0.45); border-radius: 8px; padding: 8px 10px; text-align: left; color: #f472b6; font-size: 0.78rem;">
<div style="display: flex; align-items: center; gap: 8px; font-weight: 600;">
<svg width="18" height="18" viewBox="0 0 24 24" style="flex-shrink:0;"><polygon points="7,4 21,4 17,20 3,20" fill="#c45b8e" stroke="#f472b6" stroke-width="1.5"/></svg>
<span>Parallelogram</span>
</div>
<div style="font-size: 0.7rem; color: #f43f5e; margin-top: 4px;">Area: 4 units (Flip: F)</div>
</div>
</div>
</div>

</div>

---

### 📋 Rapid 3-Step Solve Process

#### 1️⃣ Open Game & Paste Email
Open **[Tangram Game Board](https://tds-network-games.sanand.workers.dev/tangram/)**. At the top, paste your exact exam email:
\`\`\`text
${email}
\`\`\`
*(Shortcut on game page: Press \`F12\` $\\to$ Console and run: \`document.getElementById("email").value = "${email}";\`)*

---

#### 2️⃣ Assembly & Device Controls
Drag the 7 shapes into the green silhouette outline:
- **Desktop:**
  - **Move:** Click & drag any shape.
  - **Rotate (45°):** Double-click a shape OR press <kbd>Q</kbd> / <kbd>E</kbd> on keyboard.
  - **Flip Parallelogram:** Press <kbd>F</kbd> on keyboard to reflect horizontally.
- **Mobile / Tablet:**
  - **Move:** Touch & drag pieces.
  - **Rotate:** Double tap a piece to rotate in 45° increments.
- **Goal:** Fill the entire silhouette without overlapping any pieces.

---

#### 3️⃣ Harvest Your Signed Token
- Once the 7 pieces form the silhouette, the board turns **green**.
- Click the button: **"Generate signed payload"**.
- Your browser copies the ES256 completion token (\`eyJhbGciOi...\`).
- Paste into the exam answer box and hit **Submit**!`;

  return {
    type: 'guide',
    answer: `Follow the step-by-step guide to get your signed token for target ${target.id}.`,
    guide,
    variant: `Target: ${target.id} (${target.family})`,
    answerDisplay: guide,
  };
}
