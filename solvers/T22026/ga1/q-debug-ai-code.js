// Solver: Q18 — Debugging AI-Generated Code (DevShield)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-debug-ai-code';
export const title = 'Q18: Debug AI-Generated Code (DevShield)';

// Common buggy code scenarios the exam uses
const SCENARIOS = [
  {
    description: 'A function that is supposed to calculate the median of an array of numbers.',
    buggyCode: `function median(arr) {
  arr.sort();
  const mid = arr.length / 2;
  if (arr.length % 2 === 0) {
    return (arr[mid] + arr[mid - 1]) / 2;
  }
  return arr[mid];
}`,
    fixedCode: `function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid] + sorted[mid - 1]) / 2;
  }
  return sorted[mid];
}`,
    bugs: [
      'Bug 1: The sort() method sorts lexicographically by default (e.g., [10, 2, 1] sorts to [1, 10, 2]). It must use a numeric comparator: arr.sort((a, b) => a - b).',
      'Bug 2: The array is sorted in-place, mutating the input. A copy should be made first: const sorted = [...arr].sort((a, b) => a - b).',
      'Bug 3: When the array length is even, arr.length / 2 is a float, not an integer. Math.floor() must be used: Math.floor(arr.length / 2).'
    ],
    testStrategy: 'I would write unit tests for: (1) odd-length arrays to verify the middle element is returned, (2) even-length arrays to verify the average of the two middle elements, (3) arrays with duplicate values, (4) single-element arrays, (5) negative numbers, (6) already-sorted and reverse-sorted arrays to ensure the sort comparator works correctly.'
  },
  {
    description: 'A function that removes duplicate values from an array while preserving order.',
    buggyCode: `function removeDuplicates(arr) {
  let result = [];
  for (let i = 0; i <= arr.length; i++) {
    if (!result.includes(arr[i])) {
      result.push(arr[i]);
    }
  }
  return result;
}`,
    fixedCode: `function removeDuplicates(arr) {
  const result = [];
  const seen = new Set();
  for (let i = 0; i < arr.length; i++) {
    if (!seen.has(arr[i])) {
      seen.add(arr[i]);
      result.push(arr[i]);
    }
  }
  return result;
}`,
    bugs: [
      'Bug 1: The loop condition i <= arr.length causes an off-by-one error. When i === arr.length, arr[i] is undefined, so undefined gets pushed into result. Fix: use i < arr.length.',
      'Bug 2: Using Array.includes() in a loop has O(n²) complexity. A Set should be used for O(n) lookup: const seen = new Set().',
      'Bug 3: The undefined value from the out-of-bounds access passes the !result.includes(arr[i]) check on first encounter, adding undefined to the result.'
    ],
    testStrategy: 'I would test: (1) arrays with no duplicates to verify they are returned unchanged, (2) arrays with all duplicates to verify a single element remains, (3) arrays with mixed duplicates preserving original order, (4) empty arrays, (5) single-element arrays, (6) arrays with falsy values (0, false, null) to ensure they are handled correctly.'
  },
  {
    description: 'A function that flattens a nested array to a specified depth.',
    buggyCode: `function flattenArray(arr, depth = 1) {
  let result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result = result.concat(flattenArray(item, depth));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
    fixedCode: `function flattenArray(arr, depth = 1) {
  let result = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result = result.concat(flattenArray(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
    bugs: [
      'Bug 1: The depth parameter is not decremented in the recursive call: flattenArray(item, depth) should be flattenArray(item, depth - 1). Without decrementing, depth never reaches 0 and the recursion flattens all levels regardless of the requested depth.',
      'Bug 2: The infinite-depth flattening caused by the above bug means the function will fully flatten deeply nested arrays even when depth=1 is specified.',
      'Bug 3: No guard against infinite recursion for circular references in arrays — though this is an edge case, robust code should handle it.'
    ],
    testStrategy: 'I would test: (1) depth=0 to verify nothing is flattened, (2) depth=1 to verify only one level is flattened, (3) depth=2 for two levels, (4) Infinity for complete flattening, (5) empty arrays, (6) arrays with non-array items only, (7) mixed arrays with numbers, strings, and nested arrays.'
  }
];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const r = rng(`${norm}#q-debug-ai-code`);

  const scenario = SCENARIOS[Math.floor(r() * SCENARIOS.length)];

  const response = {
    bugs: scenario.bugs,
    fixedCode: scenario.fixedCode,
    testStrategy: scenario.testStrategy
  };

  const guide = [
    `### What the exam asks`,
    ``,
    `1. Identify all bugs in the AI-generated code`,
    `2. Write a corrected version that passes all test cases`,
    `3. Describe your testing strategy`,
    ``,
    `**Response format (JSON):**`,
    `\`\`\`json`,
    `{`,
    `  "bugs": ["Bug 1: ...", "Bug 2: ...", "Bug 3: ..."],`,
    `  "fixedCode": "function name(params) { /* corrected code */ }",`,
    `  "testStrategy": "I would test by..."`,
    `}`,
    `\`\`\``,
    ``,
    `### Common AI Code Bug Patterns`,
    ``,
    `1. **Off-by-one errors**: \`<= arr.length\` should be \`< arr.length\``,
    `2. **Missing sort comparator**: \`.sort()\` sorts lexicographically; use \`.sort((a, b) => a - b)\` for numbers`,
    `3. **Mutation of inputs**: Sort/splice in-place; should copy first with \`[...arr]\``,
    `4. **Wrong recursion depth**: Not decrementing depth counter in recursive calls`,
    `5. **Type coercion**: Using \`==\` instead of \`===\` for strict equality`,
    `6. **Edge cases**: Not handling empty arrays, null, undefined, negative numbers`,
    ``,
    `### Estimated scenario`,
    ``,
    `**${scenario.description}**`,
    ``,
    `> **Note**: The actual buggy code in your exam may differ. Read it carefully and adapt your response.`,
  ].join('\n');

  const answerJson = JSON.stringify(response, null, 2);

  return {
    type: 'solved',
    variant: 'Estimated debug response — adapt to your exam\'s actual buggy code',
    answer: answerJson,
    guide,
    answerDisplay: [
      `### Q18: Debug AI-Generated Code`,
      ``,
      `The answer box contains a JSON response identifying bugs, fixed code, and test strategy.`,
      ``,
      `**Estimated scenario:** ${scenario.description}`,
      ``,
      `**Bugs identified:** ${scenario.bugs.length}`,
      ``,
      `> ⚠️ Your exam has a specific buggy code snippet. Compare it to the scenario above and adapt if needed.`,
      ``,
      `Read the **Implementation Guide** for common AI code bug patterns.`,
    ].join('\n'),
  };
}
