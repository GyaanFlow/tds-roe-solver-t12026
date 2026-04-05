// Solver: Python Refactor — FULLY auto-solvable
// Replicates the seeded code generation and applies correct refactoring

export const id = 'q-python-refactor-server';
export const title = 'Refactor Python Code (PEP 8)';

const SCENARIOS = [
  { name: "data_pipeline", title: "Data Processing Pipeline Refactoring", context: "data processing system" },
  { name: "api_service", title: "REST API Service Refactoring", context: "REST API endpoints" },
  { name: "ml_model", title: "Machine Learning Model Refactoring", context: "machine learning pipeline" },
  { name: "web_scraper", title: "Web Scraper Refactoring", context: "web scraping operations" }
];

const ALL_NAMES = [
  { wrong: "getUserData", correct: "get_user_data", type: "function" },
  { wrong: "processItems", correct: "process_items", type: "function" },
  { wrong: "calculateTotal", correct: "calculate_total", type: "function" },
  { wrong: "validateInput", correct: "validate_input", type: "function" },
  { wrong: "formatOutput", correct: "format_output", type: "function" },
  { wrong: "parseResponse", correct: "parse_response", type: "function" },
  { wrong: "maxRetries", correct: "max_retries", type: "variable" },
  { wrong: "baseUrl", correct: "base_url", type: "variable" },
  { wrong: "errorCount", correct: "error_count", type: "variable" },
  { wrong: "currentIndex", correct: "current_index", type: "variable" }
];

function sample(arr, n, rng) {
  const a = [...arr]; const result = [];
  for (let i = 0; i < n && a.length > 0; i++) {
    const idx = Math.floor(rng() * a.length);
    result.push(a.splice(idx, 1)[0]);
  }
  return result;
}

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

function generateCode(names, scenario, rng) {
  const [a, i, r, s] = names;
  const randVal = Math.floor(rng() * 100);
  return `"""\n${scenario.title}\n\nThis module handles ${scenario.context}.\nNote: This code uses camelCase naming which violates PEP 8.\nRefactor the non-compliant names to snake_case.\n\nDO NOT change:\n- Class names (PascalCase is correct for classes)\n- Constants (UPPER_CASE is correct for constants)\n"""\n\nimport json\nfrom typing import List, Dict, Optional\n\n\nclass DataProcessor:\n    """Main data processor class - DO NOT RENAME"""\n\n    MAX_ITEMS = 1000  # Constant - DO NOT RENAME\n\n    def __init__(self, config: Dict):\n        self.config = config\n        self.${s.wrong} = 0  # Track current position\n        self.items = []\n\n    def ${a.wrong}(self, user_id: str) -> Optional[Dict]:\n        """Fetch user data from the API"""\n        # Using ${a.wrong} to retrieve information\n        if not user_id:\n            return None\n\n        # Call ${a.wrong} multiple times for retry logic\n        data = self._fetch_data(user_id)\n        if data:\n            # ${a.wrong} succeeded\n            result = self.${i.wrong}(data)\n            return result\n        return None\n\n    def ${i.wrong}(self, items: List[Dict]) -> List[Dict]:\n        """Process items and apply transformations"""\n        processed = []\n        self.${s.wrong} = 0  # Reset ${s.wrong}\n\n        for item in items:\n            # ${i.wrong} handles each item\n            if self.${r.wrong}(item):\n                formatted = self.${s.wrong}Item(item)\n                processed.append(formatted)\n                self.${s.wrong} += 1  # Increment ${s.wrong}\n\n        # ${i.wrong} returns processed items\n        return processed\n\n    def ${r.wrong}(self, data: Dict) -> bool:\n        """Validate input data structure"""\n        # ${r.wrong} checks required fields\n        if not isinstance(data, dict):\n            return False\n\n        required_fields = ['id', 'name', 'value']\n        # ${r.wrong} ensures all fields present\n        for field in required_fields:\n            if field not in data:\n                return False\n\n        # ${r.wrong} passed all checks\n        return True\n\n    def ${s.wrong}Item(self, item: Dict) -> Dict:\n        """Format a single item - uses ${s.wrong} prefix"""\n        # Note: Method name intentionally uses ${s.wrong}\n        # This tests that you DON'T rename the variable inside the method name\n        return {\n            'id': item['id'],\n            'processed': True,\n            'index': self.${s.wrong}  # Reference to variable\n        }\n\n    def _fetch_data(self, user_id: str) -> Optional[List[Dict]]:\n        """Internal helper method"""\n        # Simulate API call\n        return [{'id': user_id, 'name': 'Test', 'value': ${randVal}}]\n\n\ndef main():\n    """Main execution function"""\n    processor = DataProcessor(config={})\n\n    # Test ${a.wrong}\n    user_data = processor.${a.wrong}("user123")\n    if user_data:\n        # Process using ${i.wrong}\n        items = [user_data]\n        results = processor.${i.wrong}(items)\n\n        # Validate using ${r.wrong}\n        for result in results:\n            if processor.${r.wrong}(result):\n                print(f"Processed item at index {processor.${s.wrong}}")\n\n\nif __name__ == "__main__":\n    main()\n`;
}

function applyRefactoring(code, names) {
  let result = code;
  for (const n of names) {
    result = result.replace(new RegExp(`\\b${n.wrong}\\b`, 'g'), n.correct);
  }
  return result;
}

export function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#${id}#roe-2026-01`);

  const scenario = SCENARIOS[Math.floor(rng() * SCENARIOS.length)];
  const names = sample(ALL_NAMES, 4, rng);

  const wrongCode = generateCode(names, scenario, rng);
  const correctCode = applyRefactoring(wrongCode, names);

  return {
    variant: `${scenario.title} — ${names.length} names to refactor`,
    answer: correctCode.split('\n').map(l => l.trimEnd()).join('\n').trim(),
    type: 'solved',
    answerDisplay: `<strong>Refactored names:</strong><br>${names.map(n => `<code>${n.wrong}</code> → <code>${n.correct}</code>`).join('<br>')}`
  };
}
