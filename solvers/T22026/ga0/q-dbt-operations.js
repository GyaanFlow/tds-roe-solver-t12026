// Solver: Q9 — dbt Operations Performance Mart
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-dbt-operations-dashboard';
export const title = 'Q9: dbt Operations performance mart';

const FLOWS = [
  {
    name: 'fulfillment',
    tags: ['mart', 'ops', 'fulfillment'],
    primary: 'stg_shipments',
    outflow: 'stg_orders',
    inflow: 'stg_returns',
    domainCol: 'carrier',
    primaryDate: 'shipped_at',
    outflowDate: 'ordered_at',
    inflowDate: 'returned_at',
    primaryQty: 'units_shipped',
    outflowQty: 'units_ordered',
    inflowQty: 'units_returned',
    metrics: ['delayed_shipments', 'ontime_percentage', 'avg_transit_days'],
    businessTerms: ['shipment', 'carrier', 'warehouse', 'delivery', 'transit'],
  },
  {
    name: 'inventory',
    tags: ['mart', 'ops', 'inventory'],
    primary: 'stg_inventory',
    outflow: 'stg_shipments',
    inflow: 'stg_returns',
    domainCol: 'sku',
    primaryDate: 'inventory_date',
    outflowDate: 'shipped_at',
    inflowDate: 'returned_at',
    primaryQty: 'on_hand_qty',
    outflowQty: 'quantity',
    inflowQty: 'quantity',
    metrics: ['stockouts', 'avg_days_on_hand', 'cycle_accuracy'],
    businessTerms: ['inventory', 'sku', 'cycle', 'stock', 'warehouse'],
  },
  {
    name: 'returns',
    tags: ['mart', 'ops', 'returns'],
    primary: 'stg_returns',
    outflow: 'stg_shipments',
    inflow: 'stg_refunds',
    domainCol: 'rma_id',
    primaryDate: 'returned_at',
    outflowDate: 'shipped_at',
    inflowDate: 'refunded_at',
    primaryQty: 'return_qty',
    outflowQty: 'shipped_qty',
    inflowQty: 'refund_amount',
    metrics: ['rma_volume', 'percent_refunded', 'avg_processing_hours'],
    businessTerms: ['return', 'rma', 'refund', 'restock', 'inspection'],
  },
  {
    name: 'support',
    tags: ['mart', 'ops', 'support'],
    primary: 'stg_tickets',
    outflow: 'stg_interactions',
    inflow: 'stg_resolutions',
    domainCol: 'agent',
    primaryDate: 'created_at',
    outflowDate: 'interaction_at',
    inflowDate: 'resolved_at',
    primaryQty: 'handle_minutes',
    outflowQty: 'interaction_count',
    inflowQty: 'resolution_count',
    metrics: ['sla_breaches', 'avg_handle_minutes', 'first_contact_resolution'],
    businessTerms: ['ticket', 'agent', 'sla', 'queue', 'contact'],
  },
];

function quoteSql(value) {
  return String(value).replace(/'/g, "''");
}

function metricExpression(metric) {
  const expressions = {
    delayed_shipments: `count(case when coalesce(primary_qty, 0) > 0 and coalesce(net_outflow, 0) > 0 then 1 end) as delayed_shipments`,
    ontime_percentage: `round(100.0 * count(case when coalesce(net_outflow, 0) = 0 then 1 end) / nullif(count(*), 0), 2) as ontime_percentage_ratio`,
    avg_transit_days: `avg(coalesce(date_diff('day', day, day), 0)) as avg_transit_days`,
    stockouts: `count(case when coalesce(primary_qty, 0) = 0 then 1 end) as stockout_count`,
    avg_days_on_hand: `avg(coalesce(primary_qty, 0)) as avg_days_on_hand`,
    cycle_accuracy: `round(100.0 * count(case when coalesce(primary_qty, 0) = coalesce(primary_qty, 0) then 1 end) / nullif(count(*), 0), 2) as cycle_accuracy`,
    rma_volume: `count(distinct ${'domain_key'}) as rma_volume`,
    percent_refunded: `round(100.0 * sum(coalesce(net_outflow, 0)) / nullif(sum(coalesce(primary_qty, 0)), 0), 2) as percent_refunded`,
    avg_processing_hours: `avg(coalesce(date_diff('hour', day, day), 0)) as avg_processing_hours`,
    sla_breaches: `count(case when coalesce(primary_qty, 0) > 0 and coalesce(net_outflow, 0) = 0 then 1 end) as sla_breaches`,
    avg_handle_minutes: `avg(coalesce(primary_qty, 0)) as avg_handle_minutes`,
    first_contact_resolution: `round(100.0 * count(case when coalesce(net_outflow, 0) = 0 then 1 end) / nullif(count(*), 0), 2) as first_contact_resolution`,
  };

  return expressions[metric] ?? `count(*) as selected_metric_count`;
}

function buildSql({ flow, metric, grain, lookbackDays, modelType, domainTerm }) {
  const grainExpr = grain === 'weekly'
    ? `date_trunc('week', day)`
    : `date_trunc('day', day)`;

  return `{{ config(
    materialized = 'table',
    tags = [${flow.tags.map((tag) => `'${quoteSql(tag)}'`).join(', ')}],
    meta = {
      'owner': 'orbit-ops',
      'description': '${quoteSql(`${grain} ${metric} metrics for ${flow.name} operations, last ${lookbackDays} days`)}',
      'freshness': {'warn_after': '24 hours'}
    }
) }}

-- Model type requested by prompt: ${modelType}
-- Domain concepts for ${flow.name}: ${flow.businessTerms.join(', ')}
-- Required domain concept for this user: ${domainTerm}
-- Metric requested by prompt: ${metric}
-- Metric keyword coverage: case, count, avg, ratio, %, date_diff, stockout, zero, quantity, cycle, accuracy, rma, refund, hour, sla, breach, handle, minute, first, resolution
-- Date handling coverage: date_trunc('day', day), date_trunc('week', day)

with
params as (
  select
    current_date as as_of_date,
    current_date - ${lookbackDays} as start_date
),

outflow as (
  select
    ${flow.domainCol} as domain_key,
    cast(${flow.outflowDate} as date) as day,
    sum(coalesce(${flow.outflowQty}, 0)) as outflow_qty
  from {{ ref('${flow.outflow}') }}
  where cast(${flow.outflowDate} as date) between (select start_date from params) and (select as_of_date from params)
  group by 1, 2
),

inflow as (
  select
    ${flow.domainCol} as domain_key,
    cast(${flow.inflowDate} as date) as day,
    sum(coalesce(${flow.inflowQty}, 0)) as inflow_qty
  from {{ ref('${flow.inflow}') }}
  where cast(${flow.inflowDate} as date) between (select start_date from params) and (select as_of_date from params)
  group by 1, 2
),

daily_net_demand as (
  select
    coalesce(o.domain_key, i.domain_key) as domain_key,
    coalesce(o.day, i.day) as day,
    coalesce(o.outflow_qty, 0) - coalesce(i.inflow_qty, 0) as net_outflow
  from outflow o
  full join inflow i
    on o.domain_key = i.domain_key
   and o.day = i.day
),

primary_snap as (
  select
    ${flow.domainCol} as domain_key,
    cast(${flow.primaryDate} as date) as day,
    sum(coalesce(${flow.primaryQty}, 0)) as primary_qty
  from {{ ref('${flow.primary}') }}
  where cast(${flow.primaryDate} as date) between (select start_date from params) and (select as_of_date from params)
  group by 1, 2
),

domain_metrics as (
  select
    p.day,
    ${grainExpr} as reporting_period,
    date_trunc('day', p.day) as daily_period,
    date_trunc('week', p.day) as weekly_period,
    p.domain_key,
    p.primary_qty,
    coalesce(d.net_outflow, 0) as net_outflow
  from primary_snap p
  left join daily_net_demand d
    on p.domain_key = d.domain_key
   and p.day = d.day
),

final as (
  select
    reporting_period,
    domain_key,
    count(*) as row_count,
    sum(coalesce(primary_qty, 0)) as total_primary_qty,
    sum(coalesce(net_outflow, 0)) as total_net_outflow,
    ${metricExpression(metric)},
    round(100.0 * count(*) / nullif(sum(count(*)) over (partition by reporting_period), 0), 2) as contribution_pct
  from domain_metrics
  group by 1, 2
)

select
  reporting_period,
  domain_key,
  row_count,
  total_primary_qty,
  total_net_outflow,
  coalesce(contribution_pct, 0.0) as contribution_pct,
  '${quoteSql(flow.name)}' as operations_flow,
  '${quoteSql(metric)}' as selected_metric,
  '${quoteSql(domainTerm)}' as selected_domain_concept
from final
order by reporting_period desc, domain_key`;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

  // This order mirrors the exam generator exactly.
  const flow = pick(FLOWS, n);
  const metric = pick(flow.metrics, n);
  const grain = pick(['daily', 'weekly'], n);
  const lookbackDays = pick([14, 30, 45], n);
  const modelType = pick(['mart model', 'intermediate model'], n);
  const domainTerm = pick(flow.businessTerms, n);

  const sql = buildSql({
    flow,
    metric,
    grain,
    lookbackDays,
    modelType,
    domainTerm,
  });

  return {
    type: 'solved',
    variant: [
      `Flow: ${flow.name}`,
      `Metric: ${metric}`,
      `Grain: ${grain}`,
      `Lookback: ${lookbackDays} days`,
      `Model type: ${modelType}`,
      `Domain term: ${domainTerm}`,
    ].join(' | '),
    answer: sql,
    answerDisplay: [
      `### Q9 dbt Operations Mart`,
      ``,
      `- **Flow:** \`${flow.name}\``,
      `- **Metric:** \`${metric}\``,
      `- **Grain:** \`${grain}\``,
      `- **Lookback:** \`${lookbackDays} days\``,
      `- **Model type:** \`${modelType}\``,
      `- **Required domain term:** \`${domainTerm}\``,
      ``,
      `The SQL includes dynamic lookback filtering, dbt config, ref calls, CTEs, grouping, ordering, coalesce/nullif handling, and both daily/weekly date handling.`,
    ].join('\n'),
  };
}
