import { makeCorrectedJson } from './generators.js';

export const id = 'q-broken-json-server';
export const title = 'Q5: Fix Broken JSON File';

export async function solve(email) {
  const result = makeCorrectedJson(email);
  const guide = `### Reconstructed source JSON\n\nThe official generator creates ${result.recordCount} ordered records and then corrupts a copy. This is the matching valid source data for the registered email. Copy the full Answer value and submit it after validating it with python -m json.tool or JSON.parse.\n\nScenario: ${result.scenario.title}. Only repair syntax in the downloaded file if you are practicing the file-repair workflow.`;
  return {
    type: 'solved',
    answer: result.json,
    variant: `${result.recordCount} records | ${result.scenario.name}`,
    guide,
    answerDisplay: `### Reconstructed ${result.recordCount}-record JSON\n\nThe full corrected JSON is in the Answer panel. Use **Copy Answer** to copy it without truncation.\n\nScenario: ${result.scenario.title}.`,
    debug: { recordCount: result.recordCount, scenario: result.scenario.name },
  };
}
