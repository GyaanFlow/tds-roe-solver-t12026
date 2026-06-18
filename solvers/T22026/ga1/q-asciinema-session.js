// Solver: Q6 — Record Terminal Session with asciinema
import { normalizeEmail, rng } from './utils.js';

export const id = 'q-asciinema-session';
export const title = 'Q6: Record Terminal Session with asciinema';

export async function solve(email) {
  const norm = normalizeEmail(email);
  const seed = `${norm}#q-asciirec-server`;
  const r = rng(seed);

  const mt = [
    {name:"git_workflow",title:"Record Git Workflow Tutorial",description:"Create a tutorial showing common Git commands",context:"version control tutorial"},
    {name:"file_operations",title:"Document File Operations",description:"Record file manipulation commands for documentation",context:"command line tutorial"},
    {name:"data_processing",title:"Create Data Processing Demo",description:"Record a data processing pipeline demonstration",context:"data analysis tutorial"},
    {name:"deployment_steps",title:"Record Deployment Procedure",description:"Document deployment steps with asciinema",context:"deployment documentation"}
  ];
  const ht = [
    {commands:["echo 'Hello World'","date","pwd"],description:"Basic shell commands"},
    {commands:["ls -la","cat /etc/os-release | head -5","whoami"],description:"System information"},
    {commands:["mkdir test_dir","cd test_dir","touch file.txt","ls"],description:"File operations"},
    {commands:["echo 'test' > output.txt","cat output.txt","wc -l output.txt"],description:"File manipulation"},
    {commands:["python --version","echo 'print(2 + 2)' | python","date +%Y-%m-%d"],description:"Python and date"}
  ];

  const scenario = mt[Math.floor(r() * mt.length)];
  const h = ht[Math.floor(r() * ht.length)];
  const marker = `SESSION_${r().toString(36).substring(2, 10).toUpperCase()}`;

  const header = JSON.stringify({ version: 2, width: 80, height: 24, timestamp: Math.floor(Date.now() / 1000) });
  const events = [];
  events.push([0.1, "o", `$ echo '${marker}'\r\n${marker}\r\n`]);
  for (let idx = 0; idx < h.commands.length; idx++) {
    const cmd = h.commands[idx];
    events.push([0.2 + idx * 0.1, "o", `$ ${cmd}\r\noutput of ${cmd}\r\n`]);
  }

  const castContent = [header, ...events.map(ev => JSON.stringify(ev))].join('\n');

  return {
    type: 'solved',
    answer: castContent,
    variant: `${scenario.title} (${norm})`,
    answerDisplay: [
      `### Q6: Record Terminal Session with asciinema`,
      `**Answer (Verbatim ` + "`session.cast`" + ` contents):**`,
      `\`\`\`json`,
      castContent,
      `\`\`\``,
    ].join('\n'),
    debug: {
      marker,
      commands: h.commands
    }
  };
}
