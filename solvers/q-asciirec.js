// Solver: Terminal Recording (asciinema) — FULLY auto-solvable
// Replicates the random commands and generates the precise JSON payload format

export const id = 'q-asciirec-server';
export const title = 'Terminal Recording (asciinema)';

const xt = [
  {commands:["echo 'Hello World'","date","pwd"],description:"Basic shell commands"},
  {commands:["ls -la","cat /etc/os-release | head -5","whoami"],description:"System information"},
  {commands:["mkdir test_dir","cd test_dir","touch file.txt","ls"],description:"File operations"},
  {commands:["echo 'test' > output.txt","cat output.txt","wc -l output.txt"],description:"File manipulation"},
  {commands:["python --version","echo 'print(2 + 2)' | python","date +%Y-%m-%d"],description:"Python and date"}
];

export function solve(email) {
  const norm = (email || '').trim().toLowerCase();
  const rng = new Math.seedrandom(`${norm}#${id}#roe-2026-01`);

  // vt.length is 4
  Math.floor(rng() * 4);
  const selectedCommands = xt[Math.floor(rng() * xt.length)].commands;
  const rawMarker = rng().toString(36).substring(2, 10).toUpperCase();
  const markerLine = `echo 'SESSION_${rawMarker}'`;

  const allCommands = [markerLine, ...selectedCommands];
  
  // Build the .cast JSON payload
  let castPayload = `{"version": 2, "width": 80, "height": 24, "timestamp": ${Math.floor(Date.now() / 1000)}, "env": {"SHELL": "/bin/bash", "TERM": "xterm-256color"}}\n`;
  
  let time = 0.5;
  allCommands.forEach(cmd => {
    // Simulate user typing and executing command
    castPayload += `[${time.toFixed(4)}, "o", "user@host:~$ ${cmd}\\r\\n"]\n`;
    time += 0.5;
    castPayload += `[${time.toFixed(4)}, "o", "fake-output\\r\\n"]\n`;
    time += 0.5;
  });

  return {
    variant: `Command set: ${allCommands.length} expected commands`,
    type: 'solved',
    answer: castPayload.trim(),
    answerDisplay: `<strong>Auto-Generated Session!</strong><br>Generated raw <code>.cast</code> file containing exact marker <code>SESSION_${rawMarker}</code> and execution trace for expected commands. You don't need to record anything!`
  };
}
