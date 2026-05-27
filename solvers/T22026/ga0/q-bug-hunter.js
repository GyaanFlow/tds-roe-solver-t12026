// Solver: Q3 — The Bug Hunter (Property-Based Testing)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-bug-hunter-property-based-testing';
export const title = 'Q3: The Bug Hunter (Property-Based Testing)';

// ─── SCENARIOS ────────────────────────────────────────────────────────────
// Exact list from original — do not reorder, RNG index depends on order
const FUNCTIONS = [
  { id: 'sort-1',   name: 'Inventory Sort',          fn: 'sort_inventory',              type: 'sort'    },
  { id: 'sort-2',   name: 'Ranked Queue Sort',        fn: 'sort_ranked_queue',           type: 'sort'    },
  { id: 'sort-3',   name: 'Metrics Sort',             fn: 'sort_metrics',                type: 'sort'    },
  { id: 'sort-4',   name: 'Schedule Sort',            fn: 'sort_schedule',               type: 'sort'    },
  { id: 'rev-1',    name: 'Ticket Revenue',           fn: 'compute_ticket_revenue',      type: 'revenue' },
  { id: 'rev-2',    name: 'Ad Revenue',               fn: 'compute_ad_revenue',          type: 'revenue' },
  { id: 'rev-3',    name: 'Subscription Revenue',     fn: 'compute_subscription_revenue',type: 'revenue' },
  { id: 'rev-4',    name: 'Retail Revenue',           fn: 'compute_retail_revenue',      type: 'revenue' },
  { id: 'leap-1',   name: 'Billing Date Parser',      fn: 'parse_billing_date',          type: 'date'    },
  { id: 'leap-2',   name: 'Report Date Parser',       fn: 'parse_report_date',           type: 'date'    },
  { id: 'leap-3',   name: 'Schedule Date Parser',     fn: 'parse_schedule_date',         type: 'date'    },
  { id: 'dedupe-1', name: 'User Tag Dedupe',          fn: 'dedupe_user_tags',            type: 'dedupe'  },
  { id: 'dedupe-2', name: 'Category Dedupe',          fn: 'dedupe_categories',           type: 'dedupe'  },
  { id: 'dedupe-3', name: 'Topic Dedupe',             fn: 'dedupe_topics',               type: 'dedupe'  },
  { id: 'page-1',   name: 'Feed Pagination',          fn: 'paginate_feed',               type: 'page'    },
  { id: 'page-2',   name: 'Search Pagination',        fn: 'paginate_search',             type: 'page'    },
  { id: 'page-3',   name: 'Invoice Pagination',       fn: 'paginate_invoices',           type: 'page'    },
  { id: 'avg-1',    name: 'Sensor Moving Average',    fn: 'moving_avg_sensor',           type: 'avg'     },
  { id: 'avg-2',    name: 'Price Moving Average',     fn: 'moving_avg_price',            type: 'avg'     },
  { id: 'avg-3',    name: 'Latency Moving Average',   fn: 'moving_avg_latency',          type: 'avg'     },
];

// ─── TEST TEMPLATES ───────────────────────────────────────────────────────
// Each targets the known bug class for that type.
// Assertion messages show actual vs expected for fast debugging.
const STRATEGIES = {

  // Bug: unstable sort / wrong comparator / mutates input instead of returning
  sort: (fn) => `\
from hypothesis import given, settings, strategies as st

@given(st.lists(st.integers()))
@settings(max_examples=200)
def test_${fn}_property(nums):
    result = ${fn}(nums)
    assert result == sorted(nums), \\
        f"Sort wrong: got {result}, expected {sorted(nums)}"
    assert sorted(result) == sorted(nums), \\
        f"Elements changed: {sorted(result)} != {sorted(nums)}"
`,

  // Bug: integer overflow / uses + instead of * / wrong operator
  revenue: (fn) => `\
from hypothesis import given, settings, strategies as st

@given(
    st.integers(min_value=0, max_value=10_000),
    st.integers(min_value=0, max_value=10_000),
)
@settings(max_examples=200)
def test_${fn}_property(price, quantity):
    result = ${fn}(price, quantity)
    expected = price * quantity
    assert result == expected, \\
        f"{fn}({price}, {quantity}) = {result}, expected {expected}"
`,

  // Bug: leap year mishandled — Feb 29 crashes or parses wrong day/month
  date: (fn) => `\
from hypothesis import given, settings, strategies as st
from datetime import datetime

@given(st.dates())
@settings(max_examples=500)
def test_${fn}_property(d):
    date_str = d.strftime("%Y-%m-%d")
    result = ${fn}(date_str)
    assert isinstance(result, datetime), \\
        f"Expected datetime, got {type(result)} for {date_str}"
    assert result.year  == d.year,  \\
        f"Year mismatch:  {result.year}  != {d.year}  for {date_str}"
    assert result.month == d.month, \\
        f"Month mismatch: {result.month} != {d.month} for {date_str}"
    assert result.day   == d.day,   \\
        f"Day mismatch:   {result.day}   != {d.day}   for {date_str}"
`,

  // Bug: case-insensitive dedupe (lowercases before comparing, loses original case)
  dedupe: (fn) => `\
from hypothesis import given, settings, strategies as st

@given(st.lists(st.text()))
@settings(max_examples=200)
def test_${fn}_property(items):
    result = ${fn}(items)
    seen = []
    expected = []
    for x in items:
        if x not in seen:
            expected.append(x)
            seen.append(x)
    assert result == expected, \\
        f"Dedupe wrong: got {result}, expected {expected}"
    assert len(result) <= len(items), \\
        f"Output longer than input: {len(result)} > {len(items)}"
`,

  // Bug: off-by-one in slice — uses offset+limit as end instead of slicing correctly
  page: (fn) => `\
from hypothesis import given, settings, strategies as st

@given(
    st.lists(st.integers()),
    st.integers(min_value=0, max_value=50),
    st.integers(min_value=0, max_value=50),
)
@settings(max_examples=200)
def test_${fn}_property(items, offset, limit):
    result = ${fn}(items, offset, limit)
    expected = items[offset:offset + limit]
    assert result == expected, \\
        f"offset={offset} limit={limit}: got {result}, expected {expected}"
`,

  // Bug: window boundary off-by-one / wrong denominator in average
  avg: (fn) => `\
import math
from hypothesis import given, settings, strategies as st

@given(
    st.lists(
        st.floats(
            allow_nan=False,
            allow_infinity=False,
            min_value=-1e6,
            max_value=1e6,
        ),
        min_size=1,
        max_size=50,
    ),
    st.integers(min_value=1, max_value=20),
)
@settings(max_examples=300)
def test_${fn}_property(values, window):
    result = ${fn}(values, window)
    if window > len(values):
        assert result == [], \\
            f"Expected [] for window={window} > len={len(values)}, got {result}"
        return
    expected = [
        sum(values[i:i + window]) / window
        for i in range(len(values) - window + 1)
    ]
    assert len(result) == len(expected), \\
        f"Length mismatch: got {len(result)}, expected {len(expected)}"
    for i, (r, e) in enumerate(zip(result, expected)):
        assert not math.isnan(r), f"NaN at index {i}"
        assert math.isclose(r, e, rel_tol=1e-6), \\
            f"Value mismatch at [{i}]: got {r}, expected {e}"
`,
};

// ─── SOLVE ────────────────────────────────────────────────────────────────
export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  // pick() = arr[Math.floor(rng() * arr.length)] — one RNG call, no burn
  // Matches original Q3 solver pattern exactly
  const scenario = pick(FUNCTIONS, n);

  // Guards — should never fire in production but prevents silent undefined crash
  if (!scenario) {
    throw new Error(`[Q3] No scenario resolved for email: ${email}`);
  }
  const template = STRATEGIES[scenario.type];
  if (!template) {
    throw new Error(`[Q3] Unknown type "${scenario.type}" for scenario: ${scenario.id}`);
  }

  const code = template(scenario.fn);

  return {
    type: 'solved',
    variant: `Scenario: ${scenario.name} (${scenario.type})`,
    answer: code,
    answerDisplay: [
      `### Property-Based Test: ${scenario.name}`,
      ``,
      `- **Function under test:** \`${scenario.fn}\``,
      `- **Bug class:** \`${scenario.type}\``,
      `- **Scenario ID:** \`${scenario.id}\``,
      ``,
      `**Steps:**`,
      `1. Copy the code from the **Answer** box`,
      `2. Paste into the exam portal's test area for Q3`,
      `3. Run — hypothesis will automatically find and shrink the failing case`,
      ``,
      `> Install if needed: \`pip install hypothesis\``,
    ].join('\n'),
  };
}
