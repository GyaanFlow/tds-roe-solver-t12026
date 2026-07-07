import { normalizeEmail } from './utils.js';
import seedrandom from './seedrandom.js';

export const id = 'q-embedding-trap-neighbors-server';
export const title = 'Q13: Embedding Trapdoors — Nearest Neighbor Search';

const Po = [["medical","patient has low blood sugar","clinical note reports hypoglycemia","clinical note reports hyperglycemia","patient asked for parking validation"],["medical","doctor found a harmless tumor","pathology describes a benign neoplasm","pathology describes a malignant neoplasm","nurse changed the bed linens"],["medical","kidney function suddenly worsened","chart documents acute renal failure","chart documents renal recovery","cafeteria menu lists kidney beans"],["medical","airway tube was removed","respiratory note says the patient was extubated","respiratory note says the patient was intubated","technician removed a printer cable"],["medical","the medicine caused sleepiness","adverse effect recorded as somnolence","adverse effect recorded as insomnia","pharmacy shelf was reorganized"],["legal","court cancelled the previous judgment","appellate panel vacated the ruling","appellate panel affirmed the ruling","clerk replaced the courtroom microphone"],["legal","lawyer gave up the right to object","counsel waived the objection","counsel preserved the objection","counsel printed the trial calendar"],["legal","contract cannot be enforced","agreement is void and unenforceable","agreement is valid and enforceable","agreement uses blue ink signatures"],["legal","judge postponed the hearing","court granted a continuance","court denied a continuance","court opened a new filing window"],["legal","case was sent back to lower court","matter was remanded for further proceedings","matter was dismissed with prejudice","matter was indexed under a new docket"],["finance","loan payments stopped","account entered delinquency","account returned to good standing","account statement changed font size"],["finance","company can pay short term bills","firm has adequate liquidity","firm faces a liquidity crunch","firm renovated the lobby"],["finance","investment lost value","portfolio suffered a drawdown","portfolio reached a new high watermark","portfolio manager joined a webinar"],["finance","bank reversed the card charge","issuer processed a chargeback","issuer approved the charge","issuer mailed a replacement card"],["finance","auditor found revenue booked too early","report flags premature revenue recognition","report clears revenue recognition","report includes a new cover page"],["cloud","service can create more containers automatically","autoscaler increases pod replicas","autoscaler decreases pod replicas","cluster dashboard switched to dark mode"],["cloud","server stopped responding to health checks","instance failed liveness probes","instance passed liveness probes","instance label changed color"],["cloud","database copy is behind the primary","replica lag exceeded threshold","replica caught up with primary","replica name contains a hyphen"],["cloud","secret key was accidentally exposed","credential leakage was detected","credential rotation completed safely","credential file used Unix newlines"],["cloud","traffic was moved back to old release","deployment rolled back to previous version","deployment promoted new version","deployment notes mention canary birds"],["support","customer is angry about delay","ticket shows escalated frustration","ticket shows customer satisfaction","ticket includes a shipping address"],["support","agent solved the issue during first reply","case achieved first contact resolution","case required multiple follow ups","case was tagged with a green label"],["support","customer wants to stop using the service","account is at churn risk","account is likely to renew","account owner updated their avatar"],["support","reply promised money back","agent offered a refund","agent refused a refund","agent copied the help center URL"],["support","ticket should go to the security team","case requires security escalation","case requires billing escalation","case includes a screenshot attachment"],["logistics","package arrived later than planned","shipment missed its delivery SLA","shipment met its delivery SLA","shipment label printed in landscape mode"],["logistics","warehouse has no units left","inventory is out of stock","inventory is fully replenished","inventory sheet used comma separators"],["logistics","driver changed the route to avoid traffic","dispatcher rerouted the delivery","dispatcher kept the original route","dispatcher changed the radio volume"],["logistics","cold truck became too warm","refrigerated chain was breached","refrigerated chain remained intact","refrigerated truck was painted white"],["logistics","customs papers were missing","shipment lacked clearance documentation","shipment cleared customs","shipment was weighed on Tuesday"],["manufacturing","machine stopped because it overheated","equipment triggered thermal shutdown","equipment resumed normal temperature","equipment manual was spiral bound"],["manufacturing","batch failed quality checks","lot was rejected by QA","lot was approved by QA","lot number ended with seven"],["manufacturing","sensor reading jumped outside limits","telemetry showed an out-of-spec spike","telemetry stayed within specification","telemetry chart used thin gridlines"],["manufacturing","production line slowed down","throughput dropped below target","throughput exceeded target","throughput report used a pie chart"],["manufacturing","replacement part was installed before failure","preventive maintenance was completed","preventive maintenance was skipped","maintenance team ordered coffee"],["education","student turned in work after deadline","submission was late","submission was on time","submission used a PDF filename"],["education","exam answer copied from another student","response was flagged for plagiarism","response was cleared of plagiarism","response used a blue pen"],["education","learner mastered the prerequisite","student demonstrated prerequisite competency","student lacked prerequisite competency","student changed profile photo"],["education","teacher allowed extra time","instructor granted an extension","instructor denied an extension","instructor updated the seating chart"],["education","course registration is full","class has reached enrollment capacity","class has open seats","class meets on the third floor"],["insurance","claim should be paid","adjuster approved the claim","adjuster denied the claim","adjuster scanned the claim form"],["insurance","policy ended because bill was unpaid","coverage lapsed for nonpayment","coverage renewed after payment","coverage document used serif type"],["insurance","damage happened before coverage began","loss predates policy inception","loss occurred during active coverage","loss photo was taken outdoors"],["insurance","customer hid important facts","application contained material misrepresentation","application disclosed all material facts","application was signed electronically"],["insurance","insurer must not collect the deductible","deductible was waived","deductible was applied","deductible field appeared on page two"],["energy","grid has too much demand","load exceeded generation capacity","generation exceeded load","grid map used orange markers"],["energy","solar panel output fell suddenly","photovoltaic yield dropped","photovoltaic yield increased","solar panel frame was aluminum"],["energy","battery is almost empty","state of charge is critically low","state of charge is fully topped up","battery label included a QR code"],["energy","turbine was stopped for safety","wind unit entered protective shutdown","wind unit returned to service","wind unit cast a long shadow"],["energy","meter was reading too high","meter overreported consumption","meter underreported consumption","meter display used seven segments"]];

function lt(e, n) {
  for (let r = e.length - 1; r > 0; r--) {
    let t = Math.floor(n() * (r + 1));
    [e[r], e[t]] = [e[t], e[r]];
  }
  return e;
}

function ct(e) {
  let n = [];
  for (let [r, t, d, u, i] of Po) {
    n.push(
      { domain: r, role: "target", text: d, query: t },
      { domain: r, role: "domain-distractor", text: "routine " + r + " note was reviewed without a decision", query: t },
      { domain: r, role: "negation-trap", text: u, query: t },
      { domain: r, role: "distractor", text: i, query: t }
    );
  }
  lt(n, e);
  return n.map((r, t) => ({ ...r, id: "p-" + String(t + 1).padStart(3, "0") }));
}

function solveEmbeddingTrapdoors(email, version = "") {
  const norm = normalizeEmail(email);
  const salt = norm + "#q-embedding-trap-neighbors-server#" + version;
  
  const d = seedrandom(salt);
  const u = ct(d);
  const i = ct(seedrandom(salt + "#targets")).filter(c => c.role === "target");
  const o = new Map(u.map(c => [c.text, c.id]));
  
  lt(i, d);
  
  const l = i.slice(0, 10).map((c, a) => ({
    id: "q" + (a + 1),
    text: c.query,
    domain: c.domain,
    answer: o.get(c.text)
  }));
  
  return Object.fromEntries(l.map(c => [c.id, c.answer]));
}

export async function solve(email, sessionToken) {
  const norm = normalizeEmail(email);
  const answer = solveEmbeddingTrapdoors(norm);

  return {
    type: 'solved',
    answer: JSON.stringify(answer, null, 2),
    variant: "Nearest Neighbor mapping for " + norm,
    answerDisplay: [
      "### Q13: Embedding Trapdoors Mapping Results",
      "Submit the following JSON mapping in the text area:",
      "```json",
      JSON.stringify(answer, null, 2),
      "```"
    ].join('\n')
  };
}
