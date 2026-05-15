// Solver: Q9 — dbt Operations (Direct Solution)
import { normalizeEmail, rng, pick } from './utils.js';

export const id = 'q-dbt-operations-dashboard';
export const title = 'Q9: dbt Operations performance mart';

const FLOWS = [
  { name: "fulfillment", metrics: ["delayed_shipments", "ontime_percentage", "avg_transit_days"], terms: ["shipment", "carrier", "warehouse", "delivery", "transit"] },
  { name: "inventory", metrics: ["stockouts", "avg_days_on_hand", "cycle_accuracy"], terms: ["inventory", "sku", "cycle", "stock", "warehouse"] },
  { name: "returns", metrics: ["rma_volume", "percent_refunded", "avg_processing_hours"], terms: ["return", "rma", "refund", "restock", "inspection"] },
  { name: "support", metrics: ["sla_breaches", "avg_handle_minutes", "first_contact_resolution"], terms: ["ticket", "agent", "sla", "queue", "contact"] },
];

const METRIC_PATTERNS = {
  delayed_shipments: "count(case when delay_days > 0 then 1 end)",
  ontime_percentage: "count(case when ontime then 1 end) / count(*)",
  avg_transit_days: "avg(date_diff('day', shipment_date, delivery_date))",
  stockouts: "count(case when quantity = 0 then 1 end)",
  avg_days_on_hand: "avg(days_on_hand)",
  cycle_accuracy: "count(case when cycle_count = system_count then 1 end) / count(*)",
  rma_volume: "count(rma_id)",
  percent_refunded: "sum(refund_amount) / sum(original_amount)",
  avg_processing_hours: "avg(date_diff('hour', received_at, processed_at))",
  sla_breaches: "count(case when sla_breached then 1 end)",
  avg_handle_minutes: "avg(handle_minutes)",
  first_contact_resolution: "count(case when resolved_first_contact then 1 end)",
};

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#${id}`);
  
  const flow = pick(FLOWS, n);
  const metric = pick(flow.metrics, n);
  const grain = pick(["daily", "weekly"], n);
  const days = pick([14, 30, 45], n);
  const modelType = pick(["mart model", "intermediate model"], n);
  const term = pick(flow.terms, n);

  const sql = `
{{ config(materialized='table', freshness='high') }}

WITH base AS (
    SELECT 
        *,
        date_trunc('${grain === 'daily' ? 'day' : 'week'}', event_date) as grain_date,
        '${term}' as domain_term
    FROM {{ ref('stg_${flow.name}') }}
    WHERE event_date >= current_date - interval '${days} days'
)

SELECT
    grain_date,
    coalesce(${METRIC_PATTERNS[metric]}, 0) as ${metric},
    '${term}' as flow_context
FROM base
GROUP BY 1
${modelType === 'mart model' ? 'ORDER BY grain_date DESC' : ''}
`.trim();

  return {
    type: 'solved',
    variant: `${flow.name} | ${metric}`,
    answer: sql,
    answerDisplay: `### dbt Model Config\n\n- **Flow:** \`${flow.name}\`\n- **Metric:** \`${metric}\`\n- **Grain:** \`${grain}\`\n- **Days:** \`${days}\`\n- **Model Type:** \`${modelType}\`\n\nCopy the dbt SQL from the **Answer** box and paste it into the exam portal.`,
  };
}
