// Solver: Q3 — The Bug Hunter (Direct Solution)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-bug-hunter-property-based-testing';
export const title = 'Q3: The Bug Hunter (Property-Based Testing)';

const FUNCTIONS = [
  { id: "sort-1", name: "Inventory Sort", fn: "sort_inventory", type: "sort" },
  { id: "sort-2", name: "Ranked Queue Sort", fn: "sort_ranked_queue", type: "sort" },
  { id: "sort-3", name: "Metrics Sort", fn: "sort_metrics", type: "sort" },
  { id: "sort-4", name: "Schedule Sort", fn: "sort_schedule", type: "sort" },
  { id: "rev-1", name: "Ticket Revenue", fn: "compute_ticket_revenue", type: "revenue" },
  { id: "rev-2", name: "Ad Revenue", fn: "compute_ad_revenue", type: "revenue" },
  { id: "rev-3", name: "Subscription Revenue", fn: "compute_subscription_revenue", type: "revenue" },
  { id: "rev-4", name: "Retail Revenue", fn: "compute_retail_revenue", type: "revenue" },
  { id: "leap-1", name: "Billing Date Parser", fn: "parse_billing_date", type: "date" },
  { id: "leap-2", name: "Report Date Parser", fn: "parse_report_date", type: "date" },
  { id: "leap-3", name: "Schedule Date Parser", fn: "parse_schedule_date", type: "date" },
  { id: "dedupe-1", name: "User Tag Dedupe", fn: "dedupe_user_tags", type: "dedupe" },
  { id: "dedupe-2", name: "Category Dedupe", fn: "dedupe_categories", type: "dedupe" },
  { id: "dedupe-3", name: "Topic Dedupe", fn: "dedupe_topics", type: "dedupe" },
  { id: "page-1", name: "Feed Pagination", fn: "paginate_feed", type: "page" },
  { id: "page-2", name: "Search Pagination", fn: "paginate_search", type: "page" },
  { id: "page-3", name: "Invoice Pagination", fn: "paginate_invoices", type: "page" },
  { id: "avg-1", name: "Sensor Moving Average", fn: "moving_avg_sensor", type: "avg" },
  { id: "avg-2", name: "Price Moving Average", fn: "moving_avg_price", type: "avg" },
  { id: "avg-3", name: "Latency Moving Average", fn: "moving_avg_latency", type: "avg" },
];

const STRATEGIES = {
  sort: (fn) => `from hypothesis import given, strategies as st\n\n@given(st.lists(st.integers()))\ndef test_${fn}_property(nums):\n    result = ${fn}(nums)\n    # Check if result is sorted\n    assert result == sorted(nums)\n    # Check if all elements are preserved\n    assert sorted(result) == sorted(nums)`,
  revenue: (fn) => `from hypothesis import given, strategies as st\n\n@given(st.integers(min_value=0), st.integers(min_value=0))\ndef test_${fn}_property(price, quantity):\n    # The bug is often integer overflow/wraparound in 32-bit ranges\n    result = ${fn}(price, quantity)\n    assert result == price * quantity`,
  date: (fn) => `from hypothesis import given, strategies as st\nfrom datetime import datetime\n\n@given(st.dates())\ndef test_${fn}_property(d):\n    date_str = d.strftime("%Y-%m-%d")\n    result = ${fn}(date_str)\n    assert isinstance(result, datetime)\n    assert result.year == d.year\n    assert result.month == d.month\n    assert result.day == d.day`,
  dedupe: (fn) => `from hypothesis import given, strategies as st\n\n@given(st.lists(st.text()))\ndef test_${fn}_property(items):\n    result = ${fn}(items)\n    # Check for exact duplicates only, preserving case\n    seen = []\n    expected = []\n    for x in items:\n        if x not in seen:\n            expected.append(x)\n            seen.append(x)\n    assert result == expected`,
  page: (fn) => `from hypothesis import given, strategies as st\n\n@given(st.lists(st.integers()), st.integers(min_value=0), st.integers(min_value=0))\ndef test_${fn}_property(items, offset, limit):\n    result = ${fn}(items, offset, limit)\n    assert result == items[offset:offset+limit]`,
  avg: (fn) => `from hypothesis import given, strategies as st\n\n@given(st.lists(st.floats(allow_nan=False, allow_infinity=False), min_size=1), st.integers(min_value=1))\ndef test_${fn}_property(values, window):\n    if window > len(values):\n        assert ${fn}(values, window) == []\n        return\n    result = ${fn}(values, window)\n    expected = []\n    for i in range(len(values) - window + 1):\n        expected.append(sum(values[i:i+window]) / window)\n    assert len(result) == len(expected)\n    for r, e in zip(result, expected):\n        import math\n        assert not math.isnan(r)\n        assert math.isclose(r, e)`,
};

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  const scenario = pick(FUNCTIONS, n);
  const strategy = STRATEGIES[scenario.type](scenario.fn);

  return {
    type: 'solved',
    variant: `Scenario: ${scenario.name}`,
    answer: strategy,
    guide: `### 🚀 Implementation Guide

1. **Analysis**: This question requires finding a bug using **Property-Based Testing** with the \`hypothesis\` library.
2. **Setup**:
   - Copy the Python code from the **Answer** box.
3. **Execution**:
   - In the exam portal, locate the testing/code box for **Q3**.
   - Paste the code there.
   - If running locally, ensure you have hypothesis installed: \`pip install hypothesis\`.
4. **Submit**:
   - Click the **Run Tests** or **Submit** button in the exam portal. The tests will automatically find the edge case (the bug) and report it.`,
    answerDisplay: `### Quick Steps\n\n1. Copy the code from the **Answer** box.\n2. Paste it into the exam portal's test area for Q3.\n3. Run tests to find the bug.`,
  };
}
