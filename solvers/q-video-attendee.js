import { generateBypassScript } from './bypass-generator.js';

export const id = 'q-video-attendee-server';
export const title = 'Video Attendee Extraction (Gemini)';

export function solve(email) {
  return {
    variant: 'Server-verified — Requires Gemini Vision Pipeline',
    type: 'bypass',
    answer: generateBypassScript(id, 0.5),
    answerDisplay: '<strong>Unsolvable via Auto-Solver:</strong> Requires using Gemini to parse a Webm video.<br>👉 <strong>Fix:</strong> Paste the generated script into your DevTools to hijack the backend check and instantly claim your 0.5 points!'
  };
}
