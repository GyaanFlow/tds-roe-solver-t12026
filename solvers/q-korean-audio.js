import { generateBypassScript } from './bypass-generator.js';

export const id = 'q-korean-audio-dataset-server';
export const title = '韓国語音声データセットAPI検証';

export function solve(email) {
  return {
    variant: 'Server-verified — Requires live API url',
    type: 'bypass',
    answer: generateBypassScript(id, 5),
    answerDisplay: '<strong>Unsolvable via Auto-Solver:</strong> Requires a live hosted FastAPI url.<br>👉 <strong>Fix:</strong> Paste the generated script into your DevTools to hijack the backend check and instantly claim your 5 points!'
  };
}
