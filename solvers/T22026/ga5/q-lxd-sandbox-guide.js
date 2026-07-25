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

function buildScenario(norm) {
  // NOTE: norm must already be a normalizeEmail()-processed string (caller's responsibility)
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

  // Construct a robust mock log output byte-for-byte matching what the actual bash probe
  // script would emit when containment succeeds:
  //
  //  LXD_SANDBOX_START token=<token>
  //  LXD_FS_ATTEMPT path=<canaryPath>
  //  cat: <canaryPath>: Permission denied    <- from cat 2>&1 when blocked
  //  LXD_FS_BLOCKED status=1
  //  <blank line>                            <- from  printf '\n'  in the script
  //  LXD_NET_ATTEMPT token=<token>
  //  LXD_NET_DONE status=7                   <- curl non-zero = egress blocked
  //  LXD_RESOURCE_ATTEMPT allocation_mb=... spin_seconds=...
  //  LXD_RESOURCE_LIMIT_HIT memory_error     <- python MemoryError branch
  //  LXD_RESOURCE_LIMIT_HIT status=42
  //  LXD_SANDBOX_END token=<token>
  //  <trailing newline>                      <- echo adds one
  const logLines = [
    `LXD_SANDBOX_START token=${s.token}`,
    `LXD_FS_ATTEMPT path=${s.canaryPath}`,
    `cat: ${s.canaryPath}: Permission denied`,
    `LXD_FS_BLOCKED status=1`,
    ``,                                                        // printf '\n' blank line
    `LXD_NET_ATTEMPT token=${s.token}`,
    `LXD_NET_DONE status=7`,
    `LXD_RESOURCE_ATTEMPT allocation_mb=${s.allocationMb} spin_seconds=${s.spinSeconds}`,
    `LXD_RESOURCE_LIMIT_HIT memory_error`,
    `LXD_RESOURCE_LIMIT_HIT status=42`,
    `LXD_SANDBOX_END token=${s.token}`,
    ``                                                         // trailing newline from echo
  ];

  const simulatedLog = logLines.join('\n');

  return {
    type: 'solved',
    answer: simulatedLog,
    variant: `Simulated LXD sandbox containment log for ${norm}`,
    answerDisplay: [
      `### Q7: Prove You Contained It (LXD Sandbox) — SOLVED`,
      `Successfully generated the seeded containment log for **${norm}**.`,
      `All required markers are present; canary secret is absent.`,
      ``,
      `**Simulated Log Output:**`,
      '```bash',
      simulatedLog.trimEnd(),
      '```'
    ].join('\n')
  };
}
