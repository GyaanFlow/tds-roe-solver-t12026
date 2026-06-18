// Solver: Q13 — Unicode to Markdown converter (convertToMarkdown function)
import { normalizeEmail } from './utils.js';

export const id = 'q-unicode-markdown';
export const title = 'Q13: Unicode → Markdown Converter';

// The actual converter code stored as a string to return to the student
function buildConverterCode() {
  return [
    'function convertToMarkdown(text) {',
    '  // Character maps for Unicode math styles',
    '  const BOLD_UPPER = "\u{1D5D4}\u{1D5D5}\u{1D5D6}\u{1D5D7}\u{1D5D8}\u{1D5D9}\u{1D5DA}\u{1D5DB}\u{1D5DC}\u{1D5DD}\u{1D5DE}\u{1D5DF}\u{1D5E0}\u{1D5E1}\u{1D5E2}\u{1D5E3}\u{1D5E4}\u{1D5E5}\u{1D5E6}\u{1D5E7}\u{1D5E8}\u{1D5E9}\u{1D5EA}\u{1D5EB}\u{1D5EC}\u{1D5ED}";',
    '  const BOLD_LOWER = "\u{1D5EE}\u{1D5EF}\u{1D5F0}\u{1D5F1}\u{1D5F2}\u{1D5F3}\u{1D5F4}\u{1D5F5}\u{1D5F6}\u{1D5F7}\u{1D5F8}\u{1D5F9}\u{1D5FA}\u{1D5FB}\u{1D5FC}\u{1D5FD}\u{1D5FE}\u{1D5FF}\u{1D600}\u{1D601}\u{1D602}\u{1D603}\u{1D604}\u{1D605}\u{1D606}\u{1D607}";',
    '  const ITAL_UPPER = "\u{1D608}\u{1D609}\u{1D60A}\u{1D60B}\u{1D60C}\u{1D60D}\u{1D60E}\u{1D60F}\u{1D610}\u{1D611}\u{1D612}\u{1D613}\u{1D614}\u{1D615}\u{1D616}\u{1D617}\u{1D618}\u{1D619}\u{1D61A}\u{1D61B}\u{1D61C}\u{1D61D}\u{1D61E}\u{1D61F}\u{1D620}\u{1D621}";',
    '  const ITAL_LOWER = "\u{1D622}\u{1D623}\u{1D624}\u{1D625}\u{1D626}\u{1D627}\u{1D628}\u{1D629}\u{1D62A}\u{1D62B}\u{1D62C}\u{1D62D}\u{1D62E}\u{1D62F}\u{1D630}\u{1D631}\u{1D632}\u{1D633}\u{1D634}\u{1D635}\u{1D636}\u{1D637}\u{1D638}\u{1D639}\u{1D63A}\u{1D63B}";',
    '  const MONO_UPPER = "\u{1D670}\u{1D671}\u{1D672}\u{1D673}\u{1D674}\u{1D675}\u{1D676}\u{1D677}\u{1D678}\u{1D679}\u{1D67A}\u{1D67B}\u{1D67C}\u{1D67D}\u{1D67E}\u{1D67F}\u{1D680}\u{1D681}\u{1D682}\u{1D683}\u{1D684}\u{1D685}\u{1D686}\u{1D687}\u{1D688}\u{1D689}";',
    '  const MONO_LOWER = "\u{1D68A}\u{1D68B}\u{1D68C}\u{1D68D}\u{1D68E}\u{1D68F}\u{1D690}\u{1D691}\u{1D692}\u{1D693}\u{1D694}\u{1D695}\u{1D696}\u{1D697}\u{1D698}\u{1D699}\u{1D69A}\u{1D69B}\u{1D69C}\u{1D69D}\u{1D69E}\u{1D69F}\u{1D6A0}\u{1D6A1}\u{1D6A2}\u{1D6A3}";',
    '  const NORMAL_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";',
    '  const NORMAL_LOWER = "abcdefghijklmnopqrstuvwxyz";',
    '',
    '  function buildMap(from, to) {',
    '    const map = new Map();',
    '    const f = [...from]; const t = [...to];',
    '    for (let i = 0; i < f.length; i++) if (t[i]) map.set(f[i], t[i]);',
    '    return map;',
    '  }',
    '',
    '  const boldMap = new Map([...buildMap(BOLD_UPPER, NORMAL_UPPER), ...buildMap(BOLD_LOWER, NORMAL_LOWER)]);',
    '  const italMap = new Map([...buildMap(ITAL_UPPER, NORMAL_UPPER), ...buildMap(ITAL_LOWER, NORMAL_LOWER)]);',
    '  const monoMap = new Map([...buildMap(MONO_UPPER, NORMAL_UPPER), ...buildMap(MONO_LOWER, NORMAL_LOWER)]);',
    '  const BULLETS = new Set(["\\u2022", "\\u25E6", "\\u25AA", "\\u25B8", "\\u2023"]);',
    '',
    '  const lines = text.split("\\n");',
    '  const result = [];',
    '',
    '  for (const line of lines) {',
    '    const chars = [...line];',
    '    if (chars.length > 0 && BULLETS.has(chars[0])) {',
    '      result.push("- " + chars.slice(1).map(c => boldMap.get(c) || italMap.get(c) || monoMap.get(c) || c).join("").trimStart());',
    '      continue;',
    '    }',
    '    let out = ""; let i = 0;',
    '    while (i < chars.length) {',
    '      const ch = chars[i];',
    '      if (boldMap.has(ch)) {',
    '        let seg = "";',
    '        while (i < chars.length && boldMap.has(chars[i])) { seg += boldMap.get(chars[i]); i++; }',
    '        out += "**" + seg + "**";',
    '      } else if (italMap.has(ch)) {',
    '        let seg = "";',
    '        while (i < chars.length && italMap.has(chars[i])) { seg += italMap.get(chars[i]); i++; }',
    '        out += "*" + seg + "*";',
    '      } else if (monoMap.has(ch)) {',
    '        let seg = "";',
    '        while (i < chars.length && monoMap.has(chars[i])) { seg += monoMap.get(chars[i]); i++; }',
    '        out += "`" + seg + "`";',
    '      } else { out += ch; i++; }',
    '    }',
    '    result.push(out);',
    '  }',
    '  return result.join("\\n");',
    '}',
  ].join('\n');
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const converterCode = buildConverterCode();

  const guide = [
    `### What this question asks`,
    ``,
    `Write a JavaScript function \`convertToMarkdown(text)\` that converts:`,
    `- Unicode **bold** characters → \`**Bold**\``,
    `- Unicode *italic* characters → \`*Italic*\``,
    `- Unicode monospace characters → \`code\``,
    `- Bullet points (•, ◦, ▪, ▸, ‣) → \`- Item\``,
    ``,
    `### Character Ranges`,
    ``,
    `| Style | Unicode Block |`,
    `|-------|---------------|`,
    `| Bold | Mathematical Sans-Serif Bold (U+1D5D4–U+1D607) |`,
    `| Italic | Mathematical Sans-Serif Italic (U+1D608–U+1D63B) |`,
    `| Monospace | Mathematical Monospace (U+1D670–U+1D6A3) |`,
    ``,
    `### How to submit`,
    ``,
    `The answer box contains a complete \`convertToMarkdown(text)\` function.`,
    `Paste it directly into the exam's code submission area.`,
    ``,
    `### Key implementation notes`,
    `- Group consecutive same-style characters into ONE markdown span`,
    `- Convert all bullet types (•◦▪▸‣) to \`- \``,
    `- Preserve normal characters unchanged`,
  ].join('\n');

  return {
    type: 'solved',
    variant: 'Complete convertToMarkdown function implementation',
    answer: converterCode,
    guide,
    answerDisplay: [
      `### Q13: Unicode → Markdown Converter`,
      ``,
      `The answer box contains a complete \`convertToMarkdown(text)\` function.`,
      ``,
      `**Conversions handled:**`,
      `- Mathematical Bold → \`**Bold**\``,
      `- Mathematical Italic → \`*Italic*\``,
      `- Mathematical Monospace → \`code\``,
      `- Bullet chars (•◦▪▸‣) → \`- Item\``,
      ``,
      `Paste the function into the exam's code editor.`,
    ].join('\n'),
  };
}
