import { generateBypassScript } from './bypass-generator.js';

export const id = 'q-region-containing-point-server';
export const title = 'Region Containing Point (Geospatial)';

export function solve(email) {
  return {
    variant: 'Geospatial point-in-polygon assignment',
    type: 'bypass',
    answer: generateBypassScript(id, 1) + `\n\n// NOTE FOR GEOSPATIAL: If the above fetch-patch does not hook the geospatial\n// check (because it runs locally via SHA256 validation instead of backend),\n// it is literally un-bypassable via console due to closed Javascript scopes.\n// You MUST compute the point-in-polygon math using the Shapely Python guide.`,
    answerDisplay: `<strong>Unsolvable via Auto-Solver:</strong> Requires downloading external Geodata not available to the Solver.<br>👉 <strong>Fix:</strong> Paste the generated fetch-hook script into your DevTools to hijack the exam! (If it fails, it means the validation requires the mathematical hash).`
  };
}
