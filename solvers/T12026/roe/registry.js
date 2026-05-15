// ROE Solver Registry — All 15 questions
import * as shareToken from './q-share-token.js';
import * as koreanAudio from './q-korean-audio.js';
import * as regexGolf from './q-regex-golf.js';
import * as mazeSolver from './q-maze-solver.js';
import * as cipherTrail from './q-cipher-trail.js';
import * as decodeLayered from './q-decode-layered.js';
import * as regionPoint from './q-region-point.js';
import * as renameFiles from './q-rename-files.js';
import * as pythonRefactor from './q-python-refactor.js';
import * as brokenJson from './q-broken-json.js';
import * as crossLingual from './q-cross-lingual.js';
import * as trickQuestion from './q-trick-question.js';
import * as asciirec from './q-asciirec.js';
import * as fastapiSensor from './q-fastapi-sensor.js';
import * as videoAttendee from './q-video-attendee.js';

export const solvers = [
  shareToken,       // Q1:  5 marks  — bypass
  koreanAudio,      // Q2:  5 marks  — bypass
  regexGolf,        // Q3:  2 marks  — AUTO-SOLVED ✅
  mazeSolver,       // Q4:  2 marks  — AUTO-SOLVED ✅
  cipherTrail,      // Q5:  2 marks  — AUTO-SOLVED ✅
  decodeLayered,    // Q6:  2 marks  — bypass
  regionPoint,      // Q7:  1 mark   — guide
  renameFiles,      // Q8:  1 mark   — AUTO-SOLVED ✅
  pythonRefactor,   // Q9:  1 mark   — AUTO-SOLVED ✅
  brokenJson,       // Q10: 1 mark   — guide
  crossLingual,     // Q11: 1 mark   — guide
  trickQuestion,    // Q12: 0.5 mark — bypass
  asciirec,         // Q13: 0.5 mark — guide
  fastapiSensor,    // Q14: 0.5 mark — guide
  videoAttendee,    // Q15: 0.5 mark — guide
];
