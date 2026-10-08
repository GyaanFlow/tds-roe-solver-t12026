import { makeGuideResult } from './utils.js';

export const id = 'q-visual-game-tangram';
export const title = 'Q16: Geometric Reasoning — Tangram';

export async function solve() {
  const guide = `### Complete the assigned silhouette\n\nOpen the [Tangram Interactive Board](https://tds-network-games.sanand.workers.dev/tangram/) and enter your registered email. The board assigns the target and validates all seven standard pieces.\n\nUse the grid and collision state while placing pieces. Translation is allowed; rotation is in 45-degree steps, and the parallelogram may be flipped. When the arrangement matches, use **Generate signed payload** and submit that signed token here. The signing key is held by the game service, so a local solver cannot mint a valid completion token.`;
  return makeGuideResult('Solve the assigned board and submit its signed completion token.', guide, 'External interactive task');
}
