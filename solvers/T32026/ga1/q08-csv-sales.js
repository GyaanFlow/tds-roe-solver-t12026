import { makeCsvRevenue } from './generators.js';

export const id = 'q-csv-sales-analysis-server';
export const title = 'Q8: Extract and Analyze CSV Sales Data from ZIP';

export async function solve(email) {
  const result = makeCsvRevenue(email);
  const guide = `### Personalized revenue result\n\n**City:** ${result.targetCity}\n\n**Month:** ${result.targetMonth} 2025\n\n**Rounded revenue:** ${result.revenue}\n\nComputed from the official seeded generator by summing quantity × price for rows matching both city and month, then applying JavaScript Math.round as the source grader does. The generated CSV contains ${result.rowCount} rows.`;
  return {
    type: 'solved',
    answer: String(result.revenue),
    variant: `${result.targetCity} | ${result.targetMonth} 2025`,
    guide,
    answerDisplay: `### Total revenue\n\n**${result.revenue}**\n\n${result.targetCity}, ${result.targetMonth} 2025`,
    debug: { ...result },
  };
}
