// Solver: Trick Question — FULLY auto-solvable
// Replicates the random selection from the hidden Chinese questions array

export const id = 'q-trick-question-server';
export const title = 'Trick Question (Hidden Chinese)';

const pt = [
  {chinese:"JavaScript中，typeof null返回什么？",english:"In JavaScript, what does typeof null return?",answer:"object"},
  {chinese:"HTTP状态码404代表什么意思？",english:"What does HTTP status code 404 mean?",answer:"not found"},
  {chinese:"在SQL中，哪个关键字用于从表中删除所有行？",english:"In SQL, which keyword is used to delete all rows from a table?",answer:"truncate"},
  {chinese:"什么是REST API中最常用的数据格式？",english:"What is the most commonly used data format in REST APIs?",answer:"json"},
  {chinese:"Git中用于查看提交历史的命令是什么？",english:"What is the Git command to view commit history?",answer:"git log"},
  {chinese:"在Python中，用什么符号表示注释？",english:"What symbol is used for comments in Python?",answer:"#"},
  {chinese:"CSS中用于隐藏元素的display属性值是什么？",english:"What is the CSS display property value to hide an element?",answer:"none"},
  {chinese:"在Unix/Linux中，哪个命令用于查看当前目录路径？",english:"In Unix/Linux, which command shows the current directory path?",answer:"pwd"}
];

export function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#${id}#roe-2026-01`);
  
  // Advance rng past the decoy question which has length 5
  Math.floor(rng() * 5); 
  
  const realQ = pt[Math.floor(rng() * pt.length)];

  return {
    variant: `Hidden question: ${realQ.english}`,
    type: 'solved',
    answer: realQ.answer,
    answerDisplay: `<strong>Hidden Native Text:</strong> ${realQ.chinese}<br><strong>Translation:</strong> ${realQ.english}<br><strong>Answer:</strong> <code>${realQ.answer}</code>`
  };
}
