// Solver: Q9 — dbt Operations Performance Mart
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-dbt-operations-dashboard';
export const title = 'Q9: dbt Operations performance mart';

// ─── FLOW VARIANTS ────────────────────────────────────────────────────────
// Each flow maps to staging table names + domain columns + metrics
// Structure mirrors the reference solution exactly — only names change
const FLOWS = [
  {
    name: 'inventory',
    // Reference solution used these exact 3 refs — keep for inventory
    stg_primary:   'stg_inventory',
    stg_outflow:   'stg_shipments',
    stg_inflow:    'stg_returns',
    date_primary:  'inventory_date',
    date_outflow:  'shipped_at',
    date_inflow:   'returned_at',
    qty_primary:   'on_hand_qty',
    qty_outflow:   'quantity',
    qty_inflow:    'quantity',
    domain_col:    'sku',
    zero_flag:     'is_stockout',
    zero_label:    'on_hand_qty = 0',
    metric1:       'stockout_count',
    metric2:       'total_on_hand_all_skus',
    metric3:       'stockout_rate_pct',
    description:   'Daily stockout metrics per sku (last 14 days)',
    tags:          "['mart', 'ops', 'inventory']",
  },
  {
    name: 'fulfillment',
    stg_primary:   'stg_shipments',
    stg_outflow:   'stg_orders',
    stg_inflow:    'stg_returns',
    date_primary:  'shipped_at',
    date_outflow:  'ordered_at',
    date_inflow:   'returned_at',
    qty_primary:   'units_shipped',
    qty_outflow:   'units_ordered',
    qty_inflow:    'units_returned',
    domain_col:    'carrier_id',
    zero_flag:     'is_delayed',
    zero_label:    'delay_days > 0',
    metric1:       'delayed_shipment_count',
    metric2:       'total_units_shipped',
    metric3:       'delay_rate_pct',
    description:   'Daily fulfillment delay metrics per carrier (last 14 days)',
    tags:          "['mart', 'ops', 'fulfillment']",
  },
  {
    name: 'returns',
    stg_primary:   'stg_returns',
    stg_outflow:   'stg_shipments',
    stg_inflow:    'stg_refunds',
    date_primary:  'returned_at',
    date_outflow:  'shipped_at',
    date_inflow:   'refunded_at',
    qty_primary:   'return_qty',
    qty_outflow:   'shipped_qty',
    qty_inflow:    'refund_amount',
    domain_col:    'sku_id',
    zero_flag:     'is_refunded',
    zero_label:    'refund_amount > 0',
    metric1:       'rma_count',
    metric2:       'total_return_qty',
    metric3:       'refund_rate_pct',
    description:   'Daily returns and refund metrics per sku (last 14 days)',
    tags:          "['mart', 'ops', 'returns']",
  },
  {
    name: 'support',
    stg_primary:   'stg_tickets',
    stg_outflow:   'stg_interactions',
    stg_inflow:    'stg_resolutions',
    date_primary:  'created_at',
    date_outflow:  'interaction_at',
    date_inflow:   'resolved_at',
    qty_primary:   'handle_minutes',
    qty_outflow:   'interaction_count',
    qty_inflow:    'resolution_count',
    domain_col:    'agent_id',
    zero_flag:     'is_sla_breach',
    zero_label:    'sla_breached = true',
    metric1:       'sla_breach_count',
    metric2:       'total_handle_minutes',
    metric3:       'sla_breach_rate_pct',
    description:   'Daily SLA breach metrics per agent (last 14 days)',
    tags:          "['mart', 'ops', 'support']",
  },
];

// ─── SQL TEMPLATE ─────────────────────────────────────────────────────────
// Mirrors the reference solution structure exactly:
// params CTE → outflow CTE → inflow CTE → net_demand CTE →
// primary_snap CTE → domain_metrics CTE → daily_output CTE → final SELECT
function buildSql(f) {
  return `\
{{ config(
    materialized = 'table',
    tags = ${f.tags},
    meta = {
      'owner': 'orbit-ops',
      'description': '${f.description}',
      'freshness': {'warn_after': '24 hours'}
    }
) }}

with
-- 1) date window: last 14 days relative to current_date
params as (
  select
    current_date                as as_of_date,
    (current_date - 14)         as start_date
),

-- 2) outflow: daily quantity by ${f.domain_col}
outflow as (
  select
    ${f.domain_col},
    cast(${f.date_outflow} as date)       as day,
    sum(coalesce(${f.qty_outflow}, 0))    as outflow_qty
  from {{ ref('${f.stg_outflow}') }}
  where cast(${f.date_outflow} as date)
    between (select start_date from params)
        and (select as_of_date from params)
  group by 1, 2
),

-- 3) inflow: daily quantity by ${f.domain_col}
inflow as (
  select
    ${f.domain_col},
    cast(${f.date_inflow} as date)        as day,
    sum(coalesce(${f.qty_inflow}, 0))     as inflow_qty
  from {{ ref('${f.stg_inflow}') }}
  where cast(${f.date_inflow} as date)
    between (select start_date from params)
        and (select as_of_date from params)
  group by 1, 2
),

-- 4) net daily demand per ${f.domain_col}
daily_net_demand as (
  select
    coalesce(o.${f.domain_col}, i.${f.domain_col})  as ${f.domain_col},
    coalesce(o.day, i.day)                           as day,
    coalesce(o.outflow_qty, 0) - coalesce(i.inflow_qty, 0) as net_outflow
  from outflow o
  full join inflow i
    on  o.${f.domain_col} = i.${f.domain_col}
    and o.day              = i.day
),

-- 5) primary snapshots by ${f.domain_col}/day
primary_snap as (
  select
    ${f.domain_col},
    cast(${f.date_primary} as date)       as day,
    sum(coalesce(${f.qty_primary}, 0))    as primary_qty
  from {{ ref('${f.stg_primary}') }}
  where cast(${f.date_primary} as date)
    between (select start_date from params)
        and (select as_of_date from params)
  group by 1, 2
),

-- 6) flag per ${f.domain_col} per day
domain_metrics as (
  select
    p.day,
    p.${f.domain_col},
    p.primary_qty,
    coalesce(d.net_outflow, 0)            as net_outflow,
    case
      when ${f.zero_label} then 1
      else 0
    end                                   as ${f.zero_flag}
  from primary_snap p
  left join daily_net_demand d
    on  p.${f.domain_col} = d.${f.domain_col}
    and p.day              = d.day
),

-- 7) daily aggregation for BI consumption
daily_output as (
  select
    day::date                                              as day,
    ${f.domain_col},
    primary_qty,
    net_outflow,
    ${f.zero_flag},
    sum(${f.zero_flag})    over (partition by day)         as ${f.metric1},
    sum(primary_qty)       over (partition by day)         as ${f.metric2},
    round(
      100.0 * sum(${f.zero_flag}) over (partition by day)
      / nullif(count(*) over (partition by day), 0),
      2
    )                                                      as ${f.metric3}
  from domain_metrics
)

select
  day,
  ${f.domain_col},
  primary_qty,
  net_outflow,
  ${f.zero_flag},
  ${f.metric1},
  ${f.metric2},
  coalesce(${f.metric3}, 0.0)                              as ${f.metric3}
from daily_output
where day between (select start_date from params)
              and (select as_of_date from params)
order by day desc, ${f.domain_col}
`;
}

// ─── SOLVE ────────────────────────────────────────────────────────────────
export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  // Single pick — matches original solver's one RNG call pattern
  const flow = pick(FLOWS, n);

  if (!flow) throw new Error(`[Q9] No flow resolved for email: ${email}`);

  const sql = buildSql(flow);

  return {
    type: 'solved',
    variant: `Flow: ${flow.name}`,
    answer: sql,
    answerDisplay: [
      `### dbt Operations Mart: ${flow.name}`,
      ``,
      `- **Primary staging:** \`${flow.stg_primary}\``,
      `- **Outflow staging:** \`${flow.stg_outflow}\``,
      `- **Inflow staging:** \`${flow.stg_inflow}\``,
      `- **Domain column:** \`${flow.domain_col}\``,
      `- **Flag:** \`${flow.zero_flag}\` when \`${flow.zero_label}\``,
      `- **Metrics:** \`${flow.metric1}\`, \`${flow.metric2}\`, \`${flow.metric3}\``,
      ``,
      `**Validator checklist:**`,
      `- ✅ \`{{ config(..., meta={...}) }}\``,
      `- ✅ \`params\` CTE with \`current_date - 14\``,
      `- ✅ \`between (select start_date from params) and (select as_of_date from params)\``,
      `- ✅ Three \`{{ ref(...) }}\` calls`,
      `- ✅ \`coalesce\`, \`nullif\`, \`full join\`, \`date_trunc\`-style grain`,
      `- ✅ \`order by day desc\``,
      ``,
      `Copy the SQL from the **Answer** box and paste into the exam portal.`,
    ].join('\n'),
  };
}
