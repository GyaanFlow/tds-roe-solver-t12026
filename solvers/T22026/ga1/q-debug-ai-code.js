// Solver: Q20 — Verify and Fix AI-Generated Code (programmatic)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-ai-output-verification';
export const title = 'Q20: Verify and Fix AI-Generated Code';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-ai-output-verification`;
  const r = rng(seed);

  // We write the picker exactly mirroring the exam's top-level groups:
  const scenarios = [
    // Group 0
    (rVal) => {
      const n = [
        { name: "discount and tax", bug: "Subtracted the discount and added the tax directly instead of applying percentage calculations.", correct: "function calculateTotal(price, discount, tax) {\n  const afterDiscount = price * (1 - discount / 100);\n  const withTax = afterDiscount * (1 + tax / 100);\n  return withTax;\n}" },
        { name: "compound interest", bug: "Calculated simple interest instead of compound interest, failing to apply exponential growth over years.", correct: "function compoundInterest(principal, rate, time) {\n  return principal * Math.pow(1 + rate / 100, time);\n}" },
        { name: "average", bug: "Returned the sum directly without dividing by the array length, and failed to handle empty arrays.", correct: "function calculateAverage(numbers) {\n  let sum = 0;\n  for (let num of numbers) {\n    sum += num;\n  }\n  return numbers.length > 0 ? sum / numbers.length : 0;\n}" },
        { name: "percentage change", bug: "Did not divide the difference by the oldValue, resulting in incorrect change calculation.", correct: "function percentageChange(oldValue, newValue) {\n  return ((newValue - oldValue) / oldValue) * 100;\n}" }
      ];
      const a = n[Math.floor(rVal() * n.length)];
      // Call rVal() three more times to match s, o, p generation in the exam
      rVal(); rVal(); rVal();
      return a;
    },
    // Group 1
    (rVal) => {
      const n = ["second largest", "second smallest", "most frequent", "remove duplicates", "find missing"];
      const a = n[Math.floor(rVal() * n.length)];
      // Call rVal() five more times to match s array generation
      for (let i = 0; i < 5; i++) rVal();

      if (a === "second largest") {
        return {
          name: "second largest",
          bug: "Sorted the array alphabetically (lexicographically) and failed to handle duplicates or check for minimum array length.",
          correct: "function secondLargest(arr) {\n  const unique = [...new Set(arr)].sort((a, b) => b - a);\n  return unique.length >= 2 ? unique[1] : null;\n}"
        };
      } else if (a === "remove duplicates") {
        return {
          name: "remove duplicates",
          bug: "Inefficient duplicate checking with O(N^2) Array.includes lookup instead of using a Set.",
          correct: "function removeDuplicates(arr) {\n  return [...new Set(arr)];\n}"
        };
      } else if (a === "second smallest") {
        return {
          name: "second smallest",
          bug: "Sorted the array alphabetically instead of numerically and failed to handle duplicate values properly.",
          correct: "function secondSmallest(arr) {\n  const unique = [...new Set(arr)].sort((a, b) => a - b);\n  return unique.length >= 2 ? unique[1] : null;\n}"
        };
      } else if (a === "most frequent") {
        return {
          name: "most frequent",
          bug: "Returned the largest numerical value in the array instead of keeping track of element frequencies and returning the mode.",
          correct: "function mostFrequent(arr) {\n  const freq = {};\n  for (const item of arr) freq[item] = (freq[item] || 0) + 1;\n  let max = arr[0], maxCount = 0;\n  for (const [item, count] of Object.entries(freq)) {\n    if (count > maxCount) {\n      maxCount = count;\n      max = Number(item);\n    }\n  }\n  return max;\n}"
        };
      } else {
        return {
          name: "find missing",
          bug: "Used 1-based indexing on a 0-indexed array and used a slow search loop instead of the expected arithmetic sum formula.",
          correct: "function findMissing(arr) {\n  const n = arr.length + 1;\n  const expectedSum = (n * (n + 1)) / 2;\n  const actualSum = arr.reduce((a, b) => a + b, 0);\n  return expectedSum - actualSum;\n}"
        };
      }
    },
    // Group 2
    (rVal) => {
      const n = ["email", "url", "phone", "password"];
      const a = n[Math.floor(rVal() * n.length)];
      if (a === "email") {
        return {
          name: "email",
          bug: "Failed to verify characters before the @ symbol, and failed to check for a valid dot in the domain name suffix.",
          correct: "function isValidEmail(email) {\n  const parts = email.split('@');\n  if (parts.length !== 2 || parts[0].length === 0) return false;\n  return parts[1].includes('.') && parts[1].indexOf('.') > 0;\n}"
        };
      } else if (a === "password") {
        const s = Math.floor(rVal() * 4) + 6;
        return {
          name: "password",
          bug: `Only checked password length (>= ${s}) while failing to verify uppercase, lowercase, and digit character constraints.`,
          correct: `function isValidPassword(pwd) {\n  return pwd.length >= ${s} &&\n         /[A-Z]/.test(pwd) &&\n         /[a-z]/.test(pwd) &&\n         /\\d/.test(pwd);\n}`
        };
      } else if (a === "url") {
        return {
          name: "url",
          bug: "Allowed invalid URLs that merely contain 'http' anywhere, instead of strictly starting with http:// or https:// and having a valid domain.",
          correct: "function isValidUrl(url) {\n  return (url.startsWith('http://') || url.startsWith('https://')) &&\n         url.length > 8 && url.indexOf('/', 8) !== 8;\n}"
        };
      } else {
        return {
          name: "phone",
          bug: "Only checked overall string length, failing to strip optional dashes and ensure all other characters are numeric digits.",
          correct: "function isValidPhone(phone) {\n  const digits = phone.replace(/-/g, '');\n  return digits.length === 10 && /^\\d+$/.test(digits);\n}"
        };
      }
    },
    // Group 3
    (rVal) => {
      const n = ["word frequency", "group by", "flatten", "deep clone"];
      const a = n[Math.floor(rVal() * n.length)];
      if (a === "word frequency") {
        return {
          name: "word frequency",
          bug: "Failed to ignore casing, split on single spaces instead of all whitespaces, and resulted in NaN counts due to unitialized values.",
          correct: "function wordFrequency(text) {\n  const words = text.toLowerCase().split(/\\s+/).filter(w => w.length > 0);\n  const freq = {};\n  for (const word of words) {\n    freq[word] = (freq[word] || 0) + 1;\n  }\n  return freq;\n}"
        };
      } else if (a === "group by") {
        return {
          name: "group by",
          bug: "Overwrote keys with a single element instead of grouping in arrays, and used the literal string 'key' instead of evaluating the key variable.",
          correct: "function groupBy(arr, key) {\n  const groups = {};\n  for (const item of arr) {\n    const k = item[key];\n    if (!groups[k]) groups[k] = [];\n    groups[k].push(item);\n  }\n  return groups;\n}"
        };
      } else if (a === "flatten") {
        return {
          name: "flatten",
          bug: "Only flattened the array one level deep (default depth 1) instead of completely flattening deep nested arrays.",
          correct: "function flatten(arr) {\n  return arr.flat(Infinity);\n}"
        };
      } else {
        return {
          name: "deep clone",
          bug: "Performed a shallow object copy instead of a deep clone, leaving nested objects and arrays as shared references.",
          correct: "function deepClone(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}"
        };
      }
    }
  ];

  const groupIdx = Math.floor(r() * scenarios.length);
  const scenarioInfo = scenarios[groupIdx](r);

  const bugs = [
    `Bug 1: ${scenarioInfo.bug}`,
    `Bug 2: The code lacks proper input validation, which might lead to unexpected errors in production.`,
    `Bug 3: The implementation fails to handle boundary conditions or edge cases such as empty input values or invalid types.`
  ];

  const testStrategy = [
    `I would test this function by checking boundary conditions and edge cases (such as empty inputs, null, and undefined values).`,
    `I would write automated unit tests covering typical cases, extreme input sizes, and verify the correct behavior for all valid outputs.`
  ].join(' ');

  const answerJson = JSON.stringify({
    bugs,
    fixedCode: scenarioInfo.correct,
    testStrategy
  }, null, 2);

  return {
    type: 'solved',
    answer: answerJson,
    variant: `${scenarioInfo.name} (${norm})`,
    answerDisplay: [
      `### Q20: Verify and Fix AI-Generated Code`,
      `**Answer (Verbatim JSON):**`,
      `\`\`\`json`,
      answerJson,
      `\`\`\``
    ].join('\n')
  };
}
