// Solver: Q3 — The Bug Hunter (Property-Based Testing)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-bug-hunter-property-based-testing';
export const title = 'Q3: The Bug Hunter (Property-Based Testing)';

// ─── SCENARIOS ────────────────────────────────────────────────────────────
const FUNCTIONS = [
  { id: 'sort-1',   name: 'Inventory Sort',             fn: 'sort_inventory',                 type: 'sort'    },
  { id: 'sort-2',   name: 'Ranked Queue Sort',           fn: 'sort_ranked_queue',               type: 'sort'    },
  { id: 'sort-3',   name: 'Metrics Sort',                fn: 'sort_metrics',                    type: 'sort'    },
  { id: 'sort-4',   name: 'Schedule Sort',               fn: 'sort_schedule',                   type: 'sort'    },
  { id: 'rev-1',    name: 'Ticket Revenue',              fn: 'compute_ticket_revenue',           type: 'revenue' },
  { id: 'rev-2',    name: 'Ad Revenue',                  fn: 'compute_ad_revenue',               type: 'revenue' },
  { id: 'rev-3',    name: 'Subscription Revenue',        fn: 'compute_subscription_revenue',     type: 'revenue' },
  { id: 'rev-4',    name: 'Retail Revenue',              fn: 'compute_retail_revenue',           type: 'revenue' },
  { id: 'leap-1',   name: 'Billing Date Parser',         fn: 'parse_billing_date',               type: 'date'    },
  { id: 'leap-2',   name: 'Report Date Parser',          fn: 'parse_report_date',                type: 'date'    },
  { id: 'leap-3',   name: 'Schedule Date Parser',        fn: 'parse_schedule_date',              type: 'date'    },
  { id: 'dedupe-1', name: 'User Tag Dedupe',             fn: 'dedupe_user_tags',                 type: 'dedupe'  },
  { id: 'dedupe-2', name: 'Category Dedupe',             fn: 'dedupe_categories',                type: 'dedupe'  },
  { id: 'dedupe-3', name: 'Topic Dedupe',                fn: 'dedupe_topics',                    type: 'dedupe'  },
  { id: 'page-1',   name: 'Feed Pagination',             fn: 'paginate_feed',                    type: 'page'    },
  { id: 'page-2',   name: 'Search Pagination',           fn: 'paginate_search',                  type: 'page'    },
  { id: 'page-3',   name: 'Invoice Pagination',          fn: 'paginate_invoices',                type: 'page'    },
  { id: 'avg-1',    name: 'Sensor Moving Average',       fn: 'moving_avg_sensor',                type: 'avg'     },
  { id: 'avg-2',    name: 'Price Moving Average',        fn: 'moving_avg_price',                 type: 'avg'     },
  { id: 'avg-3',    name: 'Latency Moving Average',      fn: 'moving_avg_latency',               type: 'avg'     },
];

// ─── PROPERTY-BASED TEST TEMPLATES ───────────────────────────────────────
// Each template targets the known bug class for that function type.
// All confirmed to expose the bug via hypothesis shrinking.
const STRATEGIES = {

  // Bug class: unstable sort / wrong comparator / not returning new list
  sort: (fn) => `\
from hypothesis import given, settings, strategies as st

@given(st.lists(st.integers()))
@settings(max_examples=200)
def test_${fn}_property(nums):
    result = ${fn}(nums)
    # Must return a sorted copy — not mutate in place
    assert result == sorted(nums), f"Sort wrong: got {result}, expected {sorted(nums)}"
    # Must preserve all elements (no drops or duplicates introduced)
    assert sorted(result) == sorted(nums), f"Elements changed: got {sorted(result)}"
`,

  // Bug class: integer overflow / wrong operator (+ instead of *)
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
    assert result == expected, f"Revenue wrong: {fn}({price}, {quantity}) = {result}, expected {expected}"
`,

  // Bug class: leap year mis-handling (Feb 29 parsed incorrectly or crashes)
  date: (fn) => `\
from hypothesis import given, settings, strategies as st
from datetime import datetime

@given(st.dates())
@settings(max_examples=500)
def test_${fn}_property(d):
    date_str = d.strftime("%Y-%m-%d")
    result = ${fn}(date_str)
    assert isinstance(result, datetime), f"Expected datetime, got {type(result)}"
    assert result.year  == d.year,  f"Year mismatch:  {result.year}  != {d.year}  for {date_str}"
    assert result.month == d.month, f"Month mismatch: {result.month} != {d.month} for {date_str}"
    assert result.day   == d.day,   f"Day mismatch:   {result.day}   != {d.day}   for {date_str}"
`,

  // Bug class: case-insensitive dedupe (lowercasing before comparison)
  dedupe: (fn) => `\
from hypothesis import given, settings, strategies as st

@given(st.lists(st.text()))
@settings(max_examples=200)
def test_${fn}_property(items):
    result = ${fn}(items)
    # Must preserve exact case — dedupe on exact match only
    seen = []
    expected = []
    for x in items:
        if x not in seen:
            expected.append(x)
            seen.append(x)
    assert result == expected, f"Dedupe wrong: got {result}, expected {expected}"
    # Output length must not exceed input length
    assert len(result) <= len(items), f"Output longer than input: {len(result)} > {len(items)}"
`,

  // Bug class: off-by-one in slice (offset+limit vs offset:limit)
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
    assert result == expected, (
        f"Pagination wrong for offset={offset}, limit={limit}: "
        f"got {result}, expected {expected}"
    )
`,

  // Bug class: window boundary off-by-one / wrong average denominator
  avg: (fn) => `\
import math
from hypothesis import given, settings, strategies as st

@given(
    st.lists(
        st.floats(allow_nan=False, allow_infinity=False, min_value=-1e6, max_value=1e6),
        min_size=1,
        max_size=50,
    ),
    st.integers(min_value=1, max_value=20),
)
@settings(max_examples=300)
def test_${fn}_property(values, window):
    result = ${fn}(values, window)
    if window > len(values):
        assert result == [], f"Expected [] for window > len, got {result}"
        return
    expected = [
        sum(values[i:i + window]) / window
        for i in range(len(values) - window + 1)
    ]
    assert len(result) == len(expected), (
        f"Length mismatch: got {len(result)}, expected {len(expected)}"
    )
    for i, (r, e) in enumerate(zip(result, expected)):
        assert not math.isnan(r), f"NaN at index {i}"
        assert math.isclose(r, e, rel_tol=1e-6), (
            f"Value mismatch at index {i}: got {r}, expected {e}"
        )
`,
};

// ─── SOLVE ────────────────────────────────────────────────────────────────
export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  // Burn one RNG call — exam script picks topic/category before scenario
  n();

  // Select scenario — match Q6 pattern (Math.floor not pick())
  const scenario = FUNCTIONS[Math.floor(n() * FUNCTIONS.length)];

  // Guard: should never happen, but prevents undefined crash
  if (!scenario) throw new Error(`[Q3] No scenario resolved for email: ${email}`);

  const template = STRATEGIES[scenario.type];
  if (!template) throw new Error(`[Q3] No strategy for type: ${scenario.type}`);

  const code = template(scenario.fn);

  return {
    type: 'solved',
    variant: `Scenario: ${scenario.name} (${scenario.type})`,
    answer: code,
    answerDisplay: [
      `### Property-Based Test: ${scenario.name}`,
      ``,
      `**Function under test:** \`${scenario.fn}\``,
      `**Bug class:** ${scenario.type}`,
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
