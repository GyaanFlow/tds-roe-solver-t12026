// Solver: Q21 — SQL: Average salary by department (Direct Solution)
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-sql-average-salary';
export const title = 'Q21: Average Salary by Department';

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance"];

export async function solve(email) {
  const norm = normalizeEmail(email);
  const n = rng(`${norm}#q-sql-average-salary`);
  
  const employees = Array.from({ length: 500 }, () => {
    n(); // employee_id
    n(); // name
    return {
      department: DEPARTMENTS[Math.floor(n() * DEPARTMENTS.length)],
      salary: Math.floor(n() * 80000) + 40000
    };
  });

  const averages = [...DEPARTMENTS].sort().map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept);
    const sum = deptEmployees.reduce((acc, e) => acc + e.salary, 0);
    const avg = deptEmployees.length > 0 ? Math.round(sum / deptEmployees.length) : 0;
    return { department: dept, avg_salary: avg };
  });

  const sqlQuery = `
SELECT department, ROUND(AVG(salary)) as avg_salary
FROM employees
GROUP BY department
ORDER BY department ASC;
`.trim();

  const resultsTable = averages.map(a => `- **${a.department}**: \`${a.avg_salary}\``).join('\n');

  return {
    type: 'solved',
    variant: 'SQL GROUP BY + AVG',
    answer: sqlQuery,
    answerDisplay: `### Expected Results\n\n${resultsTable}\n\nCopy the SQL query from the **Answer** box and paste it into the exam portal.`,
  };
}
