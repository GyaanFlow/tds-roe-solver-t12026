// Solver: Q19 — Debug and Improve a Failing Prompt (programmatic)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-prompt-debugging';
export const title = 'Q19: Debug and Improve a Failing Prompt';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-prompt-debugging`;
  const r = rng(seed);

  // We mirror the exact task selection of the exam to get the scenario 'd'
  const h = [
    () => {
      const o = [
        { type:"product reviews",fields:["product","rating"],input:"customer feedback" },
        { type:"job postings",fields:["title","salary","location"],input:"job description" },
        { type:"email metadata",fields:["sender","subject","priority"],input:"email content" },
        { type:"meeting notes",fields:["action_items","decisions","attendees"],input:"meeting transcript" }
      ];
      const p = o[Math.floor(r() * o.length)];
      const y = Math.floor(r() * 2) + 2;
      const b = p.fields.slice(0, y);
      return {
        task: `Extract structured ${p.type} from ${p.input}`,
        failingPrompt: `Get the ${b.join(" and ")} from this: '[text]'. Return as JSON.`
      };
    },
    () => {
      const o = [
        { domain:"support tickets",levels:["critical","high","medium","low"],criteria:"urgency" },
        { domain:"user feedback",levels:["bug","feature","question","praise"],criteria:"type" },
        { domain:"content moderation",levels:["safe","warning","inappropriate","illegal"],criteria:"safety" },
        { domain:"lead scoring",levels:["hot","warm","cold","unqualified"],criteria:"quality" }
      ];
      const p = o[Math.floor(r() * o.length)];
      const y = Math.floor(r() * 2) + 3;
      return {
        task: `Classify ${p.domain} by ${p.criteria}`,
        failingPrompt: `What ${p.criteria} level is this ${p.domain.slice(0,-1)}? '[text]'. Just give me the level.`
      };
    },
    () => {
      const o = [
        { lang:"SQL",safety:["DELETE","DROP","TRUNCATE"],constraint:"schema" },
        { lang:"regex",safety:["backtracking","catastrophic"],constraint:"pattern examples" },
        { lang:"bash",safety:["rm -rf","sudo","> /dev"],constraint:"environment info" },
        { lang:"Python",safety:["eval","exec","__import__"],constraint:"dependencies" }
      ];
      const p = o[Math.floor(r() * o.length)];
      return {
        task: `Generate ${p.lang} code from natural language`,
        failingPrompt: `Write ${p.lang} for: '[query]'`
      };
    },
    () => {
      const o = [
        { source:"technical docs",audiences:["engineers","managers","customers"],preserve:["warnings","requirements"] },
        { source:"research papers",audiences:["experts","students","general public"],preserve:["findings","methods"] },
        { source:"legal contracts",audiences:["lawyers","clients","executives"],preserve:["obligations","risks"] },
        { source:"API documentation",audiences:["developers","PMs","support"],preserve:["endpoints","auth"] }
      ];
      const p = o[Math.floor(r() * o.length)];
      const y = p.audiences[Math.floor(r() * p.audiences.length)];
      return {
        task: `Summarize ${p.source} for ${y}`,
        failingPrompt: `Summarize this ${p.source}: '[doc]'`
      };
    }
  ];

  const d = h[Math.floor(r() * h.length)]();

  const problems = [
    `Problem 1: The original failing prompt "${d.failingPrompt}" does not specify the format constraints of the output JSON structure.`,
    `Problem 2: There are no examples or zero-shot constraints provided to guide the model on edge cases or expected values.`,
    `Problem 3: The prompt does not handle cases where the input text is empty, ambiguous, or lacks the required details.`
  ];

  // The prompt supports all four replacement placeholders in the exam.
  const improvedPrompt = [
    `You are an expert AI assistant tasked with: ${d.task}.`,
    `Please carefully analyze the provided input text.`,
    `Identify all relevant fields and return your response strictly as a structured JSON object.`,
    `Use the following format layout:`,
    `{`,
    `  "analysis": "Provide a brief step-by-step reasoning or explanation of your findings.",`,
    `  "output": "The extracted or classified values matching the schema."`,
    `}`,
    `Ensure the output format is valid JSON and handles edge cases like missing or ambiguous data by outputting null.`,
    `Input text to analyze: [review][ticket][query][doc]`
  ].join('\n');

  const improvements = [
    `Added explicit schema definition for the output JSON format to guarantee structural consistency.`,
    `Added detailed instructions to handle edge cases, missing parameters, and ambiguous information gracefully.`,
    `Requested step-by-step reasoning (chain of thought) in the JSON payload to improve accuracy and transparency.`
  ];

  const answerJson = JSON.stringify({
    problems,
    improvedPrompt,
    improvements
  }, null, 2);

  return {
    type: 'solved',
    answer: answerJson,
    variant: `${d.task} (${norm})`,
    answerDisplay: [
      `### Q19: Debug and Improve a Failing Prompt`,
      `**Answer (Verbatim JSON):**`,
      `\`\`\`json`,
      answerJson,
      `\`\`\``
    ].join('\n')
  };
}
