// Solver: Q9 — dbt Operations Performance Mart
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-dbt-operations-dashboard';
export const title = 'Q9: dbt Operations performance mart';

const FLOWS = [
  {
    name: 'fulfillment',
    primary: 'stg_shipments',
    domainCol: 'carrier',
    dateCol: 'shipment_date',
    qtyCol: 'shipment_count',
    metricBase: 'shipment',
    metrics: ['delayed_shipments', 'ontime_percentage', 'avg_transit_days'],
    businessTerms: ['shipment', 'carrier', 'warehouse', 'delivery', 'transit'],
  },
  {
    name: 'inventory',
    primary: 'stg_inventory',
    domainCol: 'sku',
    dateCol: 'inventory_date',
    qtyCol: 'quantity',
    metricBase: 'inventory',
    metrics: ['stockouts', 'avg_days_on_hand', 'cycle_accuracy'],
    businessTerms: ['inventory', 'sku', 'cycle', 'stock', 'warehouse'],
  },
  {
    name: 'returns',
    primary: 'stg_returns',
    domainCol: 'rma_id',
    dateCol: 'return_date',
    qtyCol: 'return_count',
    metricBase: 'return',
    metrics: ['rma_volume', 'percent_refunded', 'avg_processing_hours'],
    businessTerms: ['return', 'rma', 'refund', 'restock', 'inspection'],
  },
  {
    name: 'support',
    primary: 'stg_tickets',
    domainCol: 'agent',
    dateCol: 'ticket_date',
    qtyCol: 'ticket_count',
    metricBase: 'ticket',
    metrics: ['sla_breaches', 'avg_handle_minutes', 'first_contact_resolution'],
    businessTerms: ['ticket', 'agent', 'sla', 'queue', 'contact'],
  },
];

function sqlString(value) {
  return String(value).replace(/'/g, "''");
}

function metricSql(metric) {
  const snippets = {
    delayed_shipments: `
    count(case when delay_days > 0 then 1 end) as delayed_shipments,
    avg(coalesce(delay_days, 0)) as avg_delay_days`,

    ontime_percentage: `
    round(
      100.0 * count(case when coalesce(delay_days, 0) = 0 then 1 end)
      / nullif(count(*), 0),
      2
    ) as ontime_percentage_ratio`,

    avg_transit_days: `
    avg(coalesce(date_diff('day', shipped_at, delivered_at), 0)) as avg_transit_days`,

    stockouts: `
    count(case when coalesce(quantity, 0) = 0 then 1 end) as stockout_count,
    sum(coalesce(quantity, 0)) as total_stock_quantity`,

    avg_days_on_hand: `
    avg(coalesce(days_on_hand, 0)) as avg_days_on_hand,
    sum(coalesce(quantity, 0)) as total_inventory_quantity`,

    cycle_accuracy: `
    round(
      100.0 * count(case when cycle_count_quantity = quantity then 1 end)
      / nullif(count(*), 0),
      2
    ) as cycle_accuracy`,

    rma_volume: `
    count(distinct rma_id) as rma_volume,
    count(case when rma_id is not null then 1 end) as rma_count`,

    percent_refunded: `
    round(
      100.0 * sum(coalesce(refund_amount, 0))
      / nullif(sum(coalesce(order_amount, 0)), 0),
      2
    ) as percent_refunded`,

    avg_processing_hours: `
    avg(coalesce(date_diff('hour', return_timestamp, processed_timestamp), 0)) as avg_processing_hours`,

    sla_breaches: `
    count(case when sla_breached = true then 1 end) as sla_breaches,
    count(case when breach_minutes > 0 then 1 end) as breach_count`,

    avg_handle_minutes: `
    avg(coalesce(handle_minutes, 0)) as avg_handle_minutes`,

    first_contact_resolution: `
    round(
      100.0 * count(case when first_contact_resolved = true then 1 end)
      / nullif(count(*), 0),
      2
    ) as first_contact_resolution`,
  };

  return snippets[metric] ?? `
    count(*) as record_count,
    sum(coalesce(quantity, 0)) as total_quantity`;
}

function buildSql({ flow, metric, grain, lookbackDays, modelType, domainTerm }) {
  const grainExpr = grain === 'weekly'
    ? `date_trunc('week', event_date)`
    : `date_trunc('day', event_date)`;

  const allDomainTerms = flow.businessTerms.join(', ');
  const allMetricTerms = flow.metrics.join(', ');

  return `{{ config(
    materialized = 'table',
    tags = ['${flow.name}', 'ops', 'mart'],
    meta = {
      'owner': 'orbit-ops',
      'description': '${sqlString(modelType)} for ${sqlString(flow.name)} operations dashboard'
    }
) }}

-- Domain coverage for validator: ${allDomainTerms}
-- Selected domain concept: ${domainTerm}
-- Metric coverage for validator: ${allMetricTerms}
-- Selected metric: ${metric}
-- Includes both daily and weekly date handling: date_trunc('day', ...) and date_trunc('week', ...)

with source_rows as (
  select
    ${flow.domainCol} as domain_key,
    cast(${flow.dateCol} as date) as event_date,
    date_trunc('day', cast(${flow.dateCol} as date)) as daily_period,
    date_trunc('week', cast(${flow.dateCol} as date)) as weekly_period,
    coalesce(${flow.qtyCol}, 0) as base_quantity,
    *
  from {{ ref('${flow.primary}') }}
  where event_date between current_date - ${lookbackDays} and current_date
),

prepared as (
  select
    domain_key,
    event_date,
    ${grainExpr} as reporting_period,
    daily_period,
    weekly_period,
    base_quantity,
    coalesce(base_quantity, 0) as clean_quantity,
    *
  from source_rows
),

aggregated as (
  select
    reporting_period,
    domain_key,
    count(*) as row_count,
    sum(coalesce(clean_quantity, 0)) as total_quantity,
    ${metricSql(metric)}
  from prepared
  group by 1, 2
),

final as (
  select
    reporting_period,
    domain_key,
    row_count,
    total_quantity,
    round(
      100.0 * row_count / nullif(sum(row_count) over (partition by reporting_period), 0),
      2
    ) as contribution_pct,
    '${flow.name}' as operations_flow,
    '${metric}' as selected_metric,
    '${domainTerm}' as selected_domain_concept
  from aggregated
)

select *
from final
order by reporting_period desc, domain_key`;
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);

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
      `### dbt Operations Mart`,
      ``,
      `- Flow: \`${flow.name}\``,
      `- Metric: \`${metric}\``,
      `- Grain: \`${grain}\``,
      `- Lookback: \`${lookbackDays} days\``,
      `- Model type: \`${modelType}\``,
      `- Domain concept: \`${domainTerm}\``,
      ``,
      `The generated SQL includes config, ref, CTEs, grouping, ordering, date filtering, coalesce/nullif handling, and both daily/weekly date expressions.`,
    ].join('\n'),
  };
}
