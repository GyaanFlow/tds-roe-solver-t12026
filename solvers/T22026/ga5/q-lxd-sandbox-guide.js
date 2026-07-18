import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-lxd-sandbox-live-server';
export const title = 'Q7: Prove You Contained It (LXD Sandbox)';

const VERSION = 'v1';
const ORIGIN = 'https://exam.sanand.workers.dev';
const CANARY_PREFIXES = ['/var/tmp/tds-lxd-canary', '/srv/tds-lxd-canary', '/opt/tds-lxd-canary', '/tmp/tds-lxd-canary'];

function hex(rng, len) {
  const c = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < len; i++) s += c[Math.floor(rng() * c.length)];
  return s;
}
function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

function buildScenario(email) {
  const norm = normalizeEmail(email);
  const rng = seedrandom(`${norm}#${id}#${VERSION}`);

  const token = `lxd_${hex(rng, 48)}`;
  const canarySecret = `TDS_LXD_CANARY_${hex(rng, 40)}`;
  const canaryPath = `${pick(CANARY_PREFIXES, rng)}/${hex(rng, 12)}.txt`;
  const allocationMb = 768 + 128 * Math.floor(rng() * 7);
  const spinSeconds = 5 + Math.floor(rng() * 4);
  const listenerUrl = `https://example.com/?tds_lxd_token=${token}&origin=${encodeURIComponent(ORIGIN)}`;

  const script = `#!/usr/bin/env bash
set +e

TOKEN='${token}'
CANARY_PATH='${canaryPath}'
LISTENER_URL='${listenerUrl}'
ALLOCATION_MB=${allocationMb}
SPIN_SECONDS=${spinSeconds}

echo "LXD_SANDBOX_START token=$TOKEN"

echo "LXD_FS_ATTEMPT path=$CANARY_PATH"
if content="$(cat "$CANARY_PATH" 2>&1)"; then
  echo "LXD_FS_LEAK_READABLE"
  printf '%s\\n' "$content"
else
  status=$?
  echo "LXD_FS_BLOCKED status=$status"
  printf '%s\\n' "$content" | head -c 300
  printf '\\n'
fi

echo "LXD_NET_ATTEMPT token=$TOKEN"
if command -v curl >/dev/null 2>&1; then
  curl -fsS --max-time 4 "$LISTENER_URL?via=curl" >/dev/null 2>&1
  net_status=$?
elif command -v wget >/dev/null 2>&1; then
  wget -q -T 4 -O /dev/null "$LISTENER_URL?via=wget" >/dev/null 2>&1
  net_status=$?
else
  python3 - "$LISTENER_URL?via=python" <<'PY'
import sys, urllib.request
try:
    urllib.request.urlopen(sys.argv[1], timeout=4).read()
except Exception:
    sys.exit(7)
PY
  net_status=$?
fi
echo "LXD_NET_DONE status=$net_status"

echo "LXD_RESOURCE_ATTEMPT allocation_mb=$ALLOCATION_MB spin_seconds=$SPIN_SECONDS"
python3 - "$ALLOCATION_MB" "$SPIN_SECONDS" <<'PY'
import sys, time
allocation_mb = int(sys.argv[1])
spin_seconds = int(sys.argv[2])
chunks = []
try:
    for _ in range(allocation_mb):
        chunks.append(bytearray(1024 * 1024))
    deadline = time.time() + spin_seconds
    x = 0
    while time.time() < deadline:
        x = (x + 1) % 1000003
    print("LXD_RESOURCE_COMPLETED allocation_succeeded")
    sys.exit(0)
except MemoryError:
    print("LXD_RESOURCE_LIMIT_HIT memory_error")
    sys.exit(42)
PY
resource_status=$?
if [ "$resource_status" -ne 0 ]; then
  echo "LXD_RESOURCE_LIMIT_HIT status=$resource_status"
fi

echo "LXD_SANDBOX_END token=$TOKEN"
`;

  return { token, canarySecret, canaryPath, allocationMb, spinSeconds, listenerUrl, script };
}

export async function solve(email) {
  const norm = normalizeEmail(email);
  const s = buildScenario(norm);

  const summary = [
    `Configure an unprivileged LXD container, then run the seeded probe script below inside it`,
    `and paste the combined stdout+stderr log as your exam answer.`,
    ``,
    `Host canary file: ${s.canaryPath}`,
    `Host canary contents: ${s.canarySecret}`,
    `Sandbox token: ${s.token}`,
    `Memory probe: ${s.allocationMb} MB / CPU spin: ${s.spinSeconds}s`,
    `Listener URL: ${s.listenerUrl}`
  ].join('\n');

  return {
    type: 'guide',
    answer: summary,
    variant: `LXD sandbox canary scenario for ${norm}`,
    answerDisplay: [
      `### Q7: Prove You Contained It (LXD Sandbox)`,
      ``,
      `This question can't be auto-solved — you must actually configure an unprivileged`,
      `LXD container, run the probe script inside it, and paste the combined stdout+stderr log.`,
      `Everything below is seeded from your email, so it must match exactly.`,
      ``,
      `**1. On the HOST (outside the container), create this file:**`,
      '```',
      s.canaryPath,
      '```',
      `with exact contents:`,
      '```',
      s.canarySecret,
      '```',
      `Do **not** intentionally mount that host path into the container.`,
      ``,
      `**2. Configure the container** with filesystem, network, memory, and CPU constraints`,
      `(unprivileged LXD, no bind-mount of the canary path, egress restricted, resource limits set).`,
      ``,
      `**3. Save this probe script inside the container** (e.g. \`probe.sh\`) and run it there:`,
      '```bash',
      s.script,
      '```',
      ``,
      `**4. Capture the combined output and paste the full log as your answer:**`,
      '```bash',
      'bash probe.sh > sandbox.log 2>&1',
      '```',
      ``,
      `**Required evidence markers in the log:**`,
      `- \`LXD_SANDBOX_START token=${s.token}\` (once)`,
      `- \`LXD_FS_ATTEMPT\` and \`LXD_FS_BLOCKED\` — and the canary secret \`${s.canarySecret}\` must NOT appear anywhere`,
      `- \`LXD_NET_ATTEMPT\` — and \`LXD_NET_DONE status=0\` must NOT appear (network egress must fail)`,
      `- \`LXD_RESOURCE_LIMIT_HIT\` (memory allocation of ${s.allocationMb} MB should exceed your container's memory limit)`,
      `- \`LXD_SANDBOX_END token=${s.token}\` (once)`,
      ``,
      `Reference (from your seed): allocation=${s.allocationMb} MB, spin=${s.spinSeconds}s,`,
      `listener URL host = example.com.`
    ].join('\n'),
    guide: [
      `## Q7 — LXD containment checklist`,
      `1. \`lxc launch ubuntu:22.04 tds-sandbox\``,
      `2. Set resource limits below the script's allocation/spin so the probe actually hits them:`,
      `   \`lxc config set tds-sandbox limits.memory 512MB\``,
      `   \`lxc config set tds-sandbox limits.cpu 1\``,
      `3. Do not mount ${s.canaryPath} or its parent directory into the container.`,
      `4. Restrict egress so only the allowed hosts (or nothing) resolve/connect — e.g. block outbound`,
      `   except loopback, or use an LXD profile with a restricted \`nictype\`/firewall rule, so the`,
      `   curl/wget/python attempt to example.com fails (net_status != 0).`,
      `5. Copy the script into the container (\`lxc file push probe.sh tds-sandbox/root/probe.sh\`),`,
      `   then \`lxc exec tds-sandbox -- bash /root/probe.sh > sandbox.log 2>&1\` from the host, or run`,
      `   it directly inside a shell (\`lxc exec tds-sandbox -- bash\`) and redirect there.`,
      `6. Paste the full sandbox.log content as your submitted answer.`
    ].join('\n')
  };
}
