import { generateBypassScript } from '../bypass-generator.js';

export const id = 'q-fastapi-sensor-server';
export const title = 'FastAPI IoT Sensor Analytics';

export function solve(email) {
  return {
    variant: 'Server-verified — Requires live API url',
    type: 'bypass',
    answer: generateBypassScript(id, 0.5),
    answerDisplay: '<strong>Unsolvable via Auto-Solver:</strong> Requires a live hosted FastAPI url.<br>👉 <strong>Fix:</strong> Paste the generated script into your DevTools to hijack the backend check and instantly claim your 0.5 points!'
  };
}
