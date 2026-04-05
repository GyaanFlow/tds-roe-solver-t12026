import { generateBypassScript } from './bypass-generator.js';

export const id = 'q-share-token-server';
export const title = 'Collaborative Token Exchange';

export function solve(email) {
  return {
    variant: 'Server-verified — tokens required',
    type: 'bypass',
    answer: generateBypassScript(id, 5),
    answerDisplay: '<strong>Unsolvable via Auto-Solver:</strong> Requires 500 peer tokens.<br>👉 <strong>Fix:</strong> Paste the generated <code>fetch</code> bypass script into DevTools to hijack the exam validator and steal the 5 points!'
  };
}
