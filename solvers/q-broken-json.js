// Bypass: Broken JSON (server-verified, weight=1)
export const id = 'q-broken-json-server';
export const title = 'Fix Broken JSON';

export function solve(email) {
  return {
    variant: 'Server-verified — requires downloading and fixing a JSON file',
    type: 'bypass',
    answer: `// 🔥 GUIDE + BYPASS: q-broken-json-server (1 mark)
//
// AUTOMATED FIX SCRIPT (Python):
// ================================
// import json, re
//
// with open('broken.json', 'r') as f:
//     text = f.read()
//
// # Common JSON fixes:
// # 1. Missing commas between key-value pairs
// text = re.sub(r'("\\s*)\\n(\\s*")', r'\\1,\\n\\2', text)
// # 2. Trailing commas before } or ]
// text = re.sub(r',\\s*([}\\]])', r'\\1', text)
// # 3. Single quotes to double quotes
// text = text.replace("'", '"')
// # 4. Unquoted keys
// text = re.sub(r'(\\{|,)\\s*([a-zA-Z_][a-zA-Z0-9_]*)\\s*:', r'\\1 "\\2":', text)
// # 5. Extra closing braces/brackets
// # Try parsing iteratively, removing errors
//
// # Validate
// try:
//     data = json.loads(text)
//     with open('fixed.json', 'w') as f:
//         json.dump(data, f, indent=2)
//     print("✅ Fixed! Records:", len(data) if isinstance(data, list) else "object")
// except json.JSONDecodeError as e:
//     print(f"❌ Still broken at position {e.pos}: {e.msg}")
//
// ALTERNATIVE: Use jsonrepair (npm package)
// npx jsonrepair broken.json > fixed.json
//
// Console bypass:
(() => {
  const qId = 'q-broken-json-server';
  const el = document.querySelector(\`[name="\${qId}"], #\${qId}\`);
  if (!el) return;
  // Download the ZIP, fix JSON, paste the fixed content
  console.log('%c[ROE Solver] Fix JSON: use jsonrepair or the Python script above', 'color: #fbbf24; font-weight: bold;');
})();`,
    answerDisplay: '<strong>Strategy:</strong> Download the ZIP, fix syntax errors with <code>npx jsonrepair</code> or Python script, submit fixed JSON.'
  };
}
