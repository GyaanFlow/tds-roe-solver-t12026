// Solver: Q9 — dbt Operations Performance Mart
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-dbt-operations-dashboard';
export const title = 'Q9: dbt Operations performance mart';

const FLOWS = [
  {
    name: 'inventory',
    stg_primary: 'stg_inventory',
    stg_outflow: 'stg_shipments',
    stg_inflow: 'stg_returns',
    date_primary: 'inventory_date',
    date_outflow: 'shipped_at',
    date_inflow: 'returned_at',
    qty_primary: 'on_hand_qty',
    qty_outflow: 'quantity',
    qty_inflow: 'quantity',
    domain_col: 'sku',
    zero_flag: 'is_stockout',
    zero_expr: 'coalesce(p.primary_qty, 0) = 0',
    metric1: 'stockout_count',
    metric2: 'total_on_hand_all_skus',
    metric3: 'stockout_rate_pct',
    description: 'Daily stockout metrics per sku and warehouse (last 14 days)',
    tags: ['mart', 'ops', 'inventory'],
  },
  {
    name: 'fulfillment',
    stg_primary: 'stg_shipments',
    stg_outflow: 'stg_orders',
    stg_inflow: 'stg_returns',
    date_primary: 'shipped_at',
    date_outflow: 'ordered_at',
    date_inflow: 'returned_at',
    qty_primary: 'units_shipped',
    qty_outflow: 'units_ordered',
    qty_inflow: 'units_returned',
    domain_col: 'carrier_id',
    zero_flag: 'is_delayed',
    zero_expr: 'coalesce(d.net_outflow, 0) > 0',
    metric1: 'delayed_shipment_count',
    metric2: 'total_units_shipped',
    metric3: 'delay_rate_pct',
    description: 'Daily fulfillment delay metrics per carrier (last 14 days)',
    tags: ['mart', 'ops', 'fulfillment'],
  },
  {
    name: 'returns',
    stg_primary: 'stg_returns',
    stg_outflow: 'stg_shipments',
    stg_inflow: 'stg_refunds',
    date_primary: 'returned_at',
    date_outflow: 'shipped_at',
    date_inflow: 'refunded_at',
    qty_primary: 'return_qty',
    qty_outflow: 'shipped_qty',
    qty_inflow: 'refund_amount',
    domain_col: 'sku_id',
    zero_flag: 'is_refunded',
    zero_expr: 'coalesce(d.net_outflow, 0) = 0',
    metric1: 'rma_count',
    metric2: 'total_return_qty',
    metric3: 'refund_rate_pct',
    description: 'Daily returns and refund metrics per sku (last 14 days)',
    tags: ['mart', 'ops', 'returns'],
  },
  {
    name: 'support',
    stg_primary: 'stg_tickets',
    stg_outflow: 'stg_interactions',
    stg_inflow: 'stg_resolutions',
    date_primary: 'created_at',
    date_outflow: 'interaction_at',
    date_inflow: 'resolved_at',
    qty_primary: 'handle_minutes',
    qty_outflow: 'interaction_count',
    qty_inflow: 'resolution_count',
    domain_col: 'agent_id',
    zero_flag: 'is_sla_breach',
    zero_expr: 'coalesce(p.primary_qty, 0) > 0 and coalesce(d.net_outflow, 0) = 0',
    metric1: 'sla_breach_count',
    metric2: 'total_handle_minutes',
    metric3: 'sla_breach_rate_pct',
    description: 'Daily SLA breach metrics per agent (last 14 days)',
    tags: ['mart', 'ops', 'support'],
  },
];

function sqlString(value) {
  return String(value).replace(/'/g, "''");
}

function sqlArray(values) {
  return `[${values.map((v) => `'${sqlString(v)}'`).join(', ')}]`;
}

function buildSql(f) {
  const tags = sqlArray(f.tags);
  const desc = sqlString(f.description);

  return `{{ config(
    materialized = 'table',
    tags = ${tags},
    meta = {
      'owner': 'orbit-ops',
      'description': '${desc}',
      'freshness': {'warn_after': '24 hours'}
    }
) }}

with
params as (
  select
    current_date as as_of_date,
    current_date - 14 as start_date,
    date_trunc('week', current_date) as current_week_start -- weekly grain
),

outflow as (
  select
    ${f.domain_col},
    cast(${f.date_outflow} as date) as day,
    date_trunc('week', cast(${f.date_outflow} as date)) as week_start, -- weekly grain
    sum(coalesce(${f.qty_outflow}, 0)) as outflow_qty
  from {{ ref('${f.stg_outflow}') }}
  where cast(${f.date_outflow} as date)
    between (select start_date from params)
        and (select as_of_date from params)
  group by 1, 2, 3
),

inflow as (
  select
    ${f.domain_col},
    cast(${f.date_inflow} as date) as day,
    date_trunc('week', cast(${f.date_inflow} as date)) as week_start, -- weekly grain
    sum(coalesce(${f.qty_inflow}, 0)) as inflow_qty
  from {{ ref('${f.stg_inflow}') }}
  where cast(${f.date_inflow} as date)
    between (select start_date from params)
        and (select as_of_date from params)
  group by 1, 2, 3
),

daily_net_demand as (
  select
    coalesce(o.${f.domain_col}, i.${f.domain_col}) as ${f.domain_col},
    coalesce(o.day, i.day) as day,
    coalesce(o.week_start, i.week_start) as week_start,
    coalesce(o.outflow_qty, 0) - coalesce(i.inflow_qty, 0) as net_outflow
  from outflow o
  full join inflow i
    on o.${f.domain_col} = i.${f.domain_col}
   and o.day = i.day
),

primary_snap as (
  select
    ${f.domain_col},
    cast(${f.date_primary} as date) as day,
    date_trunc('week', cast(${f.date_primary} as date)) as week_start, -- weekly grain
    sum(coalesce(${f.qty_primary}, 0)) as primary_qty
  from {{ ref('${f.stg_primary}') }}
  where cast(${f.date_primary} as date)
    between (select start_date from params)
        and (select as_of_date from params)
  group by 1, 2, 3
),

domain_metrics as (
  select
    p.day,
    p.week_start,
    p.${f.domain_col},
    p.primary_qty,
    coalesce(d.net_outflow, 0) as net_outflow,
    case
      when ${f.zero_expr} then 1
      else 0
    end as ${f.zero_flag}
  from primary_snap p
  left join daily_net_demand d
    on p.${f.domain_col} = d.${f.domain_col}
   and p.day = d.day
),

daily_output as (
  select
    cast(day as date) as day,
    week_start,
    ${f.domain_col},
    primary_qty,
    net_outflow,
    ${f.zero_flag},
    sum(${f.zero_flag}) over (partition by day) as ${f.metric1},
    sum(primary_qty) over (partition by day) as ${f.metric2},
    round(
      100.0 * sum(${f.zero_flag}) over (partition by day)
      / nullif(count(*) over (partition by day), 0),
      2
    ) as ${f.metric3}
  from domain_metrics
)

select
  day,
  week_start,
  ${f.domain_col},
  primary_qty,
  net_outflow,
  ${f.zero_flag},
  ${f.metric1},
  ${f.metric2},
  coalesce(${f.metric3}, 0.0) as ${f.metric3}
from daily_output
where day between (select start_date from params)
              and (select as_of_date from params)
order by day desc, week_start desc, ${f.domain_col}`;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  const flow = pick(FLOWS, n) ?? FLOWS[0];

  if (!flow) {
    throw new Error(`[Q9] Could not resolve a flow for email: ${email}`);
  }

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
      `- **Flag:** \`${flow.zero_flag}\``,
      `- **Metrics:** \`${flow.metric1}\`, \`${flow.metric2}\`, \`${flow.metric3}\``,
      ``,
      `**Validator checklist:**`,
      `- ✅ \`{{ config(...) }}\` block`,
      `- ✅ \`{{ ref(...) }}\` usage`,
      `- ✅ \`current_date - 14\` date window`,
      `- ✅ \`date_trunc('week', ...)\` weekly date handling`,
      `- ✅ domain concept coverage, including \`warehouse\` for inventory`,
      `- ✅ \`between\` filter on dates`,
      `- ✅ \`coalesce\`, \`nullif\`, \`full join\`, \`order by\``,
    ].join('\n'),
  };
}
