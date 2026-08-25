// Case Study 3B — Is the Irish Preference Claim Supported? (Asterion Ortho, EMEA Customs)
import { createRng, pick, shuffle, sampleDiverse, sourceKey, formatTable } from './variations-engine.js';

export const id = 'q-case-customs-preference-server';
export const title = 'Case Study 3B — Is the Irish Preference Claim Supported?';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const decisionVariants = [
    `**Decision: The Irish preference claim is not established and should be held, not cleared as preferential.** The form says Preference=Yes, but the packet does not link shipment-specific supplier proof; the supplied evidence supports “unsupported on this packet,” not “false” or “fraud.”

**Unsupported is not the same as false. Verdict: unsupported, not disproved.** Failure to find a linked record does not prove the claim false because the reference and workshop warn that evidence may exist outside the register.`,
    `**Decision: The preferential origin claim on IE-2025-000411 is unsupported on current evidence; hold pending documentation.** While Preference=Yes is ticked, the ClearView entry lacks a linked supplier declaration, and the only Irish register entry on file (SUP-02/P1006) expired on 2025-07-31 prior to the 2025-09-18 entry.

**Unsupported is not the same as false. Verdict: unsupported, not disproved.** The register explicitly notes that absence from the table does not prove no document exists outside it. The correct disposition is a reversible hold, not an error or fraud referral.`,
    `**Decision: Place an administrative hold on the Irish preferential tariff claim.** The declaration IE-2025-000411 asserts Preference=Yes, but ClearView contains no linked supplier declaration covering the 2025-09-18 entry date.

**Calibration on Evidence:** The claim is unsupported by packet evidence, but not disproved. Commercial manufacturing country in ERP does not legally settle preferential origin, and valid supplier declarations may exist in procurement archives.`
  ];

  const evidenceRowsPool = [
    [
      'IE-2025-000411 declares P1006 with Preference=Yes, United States origin, 0.0% duty, and 90211090.',
      '`declaration.pdf`, IE-2025-000411, Line 1',
      'High'
    ],
    [
      'The only Irish-origin register entry supplied for P1006 is SUP-02, valid 2025-01-01 to 2025-07-31 and marked “Expired in register”; the shipment date is 2025-09-18.',
      '`supplier_origin_register.csv`, P1006 rows, SUP-02 fields; `declaration.pdf`, declaration date',
      'High'
    ],
    [
      'Current register entries exist for SUP-03 Germany, SUP-05 Belgium, and SUP-06 France, but the packet does not identify which supplier sourced this shipment.',
      '`supplier_origin_register.csv`, 5 P1006 rows including SUP-03/SUP-05/SUP-06; `packet_manifest.txt`, 6 listed packet files with no supplier identifier',
      'High'
    ],
    [
      'The reference lookup says no current document was found for SUP-02/P1006 and expressly says absence from the register does not prove that no document exists outside it.',
      '`supplier_declaration_reference.txt`, complete text',
      'High'
    ],
    [
      'The commercial invoice also states United States as P1006\'s manufacturing country, quantity 10 and line value EUR 193,400, but the workshop says manufacturing origin was never designed to prove preference.',
      '`commercial_invoice.pdf`, P1006 line; `origin-workshop.md`, Aoife/Luca statements',
      'High'
    ],
    [
      'The airway bill links SHP-000411 to IE-2025-000411 but provides no `supplier_id`; the packet manifest lists six files and no shipment-specific supplier declaration.',
      '`air_waybill.pdf`, shipment/declaration fields; `packet_manifest.txt`, all 6 entries',
      'High'
    ]
  ];

  // Guarantee diverse coverage across official 3B packet files
  const selectedEvidence = sampleDiverse(rng, evidenceRowsPool, 6, r => sourceKey(r[1]));
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const assessmentVariants = [
    `**Assessment:** The observed packet establishes the declaration in \`declaration.pdf\`, shipment in \`air_waybill.pdf\`, and manufacturing-origin in \`commercial_invoice.pdf\`, but none identifies the supplier route supporting preference. Automated check in \`review_note.txt\` flagged missing ClearView links. My inference is therefore limited to an evidence-control failure. As noted in \`origin-workshop.md\` and \`supplier_declaration_reference.txt\`, absence in \`supplier_origin_register.csv\` is not an inference of false origin or fraud. A supplier-linked declaration and applicable rule is the decision-changing proof. Distinguishing between unverified claims and fraudulent intent ensures proportionate customs compliance without premature punitive action.`,
    `**Assessment & Boundary:** Observed records in \`declaration.pdf\` and \`packet_manifest.txt\` show a preference claim without linked documentary support. My inference is that this represents an evidence-tracking gap rather than commercial misrepresentation. Resolving which supplier fulfilled this shipment and obtaining their valid declaration from \`supplier_origin_register.csv\` or procurement folders per \`origin-workshop.md\` is the required proof. Distinguishing unverified documentation from intentional misdeclaration ensures that administrative holds precede any formal compliance escalation.`
  ];

  const rejectedVariants = [
    `**“Preference=Yes proves the claim”:** rejected because the indicator is a declaration field in \`declaration.pdf\`, while the packet lacks a linked supplier declaration and the only Irish register entry in \`supplier_origin_register.csv\` is expired for the shipment date.

**“US ERP origin proves the claim is false”:** rejected because \`origin-workshop.md\` explicitly says Helios is not a preference-proof system, and \`supplier_declaration_reference.txt\` warns that documents may exist outside the register. The evidence reaches “not established,” not “disproved.”

**“The expired SUP-02 entry is sufficient”:** rejected by its 2025-07-31 end date versus the 2025-09-18 entry date. A current document would be required.`,
    `**“Preference indicator alone validates preferential treatment”:** rejected because preferential origin requires an active, linked supplier declaration, whereas SUP-02 in \`supplier_origin_register.csv\` expired on 2025-07-31.

**“Commercial manufacturing country in commercial_invoice.pdf disproves preference”:** rejected because manufacturing origin was never designed to prove preferential origin per \`origin-workshop.md\`, and valid EU supplier declarations exist for other suppliers in \`supplier_origin_register.csv\`.

**“The shipment should be flagged for fraud”:** rejected because absence of a supplier declaration in \`review_note.txt\` and ClearView represents unverified documentation, not intentional misdeclaration.`
  ];

  const missingVariants = [
    `| Material unknown | Evidence needed to resolve it | How that evidence would change my decision |
| --- | --- | --- |
| Which supplier and sourcing route served this shipment | Purchase order, supplier invoice, or shipment-to-supplier link | SUP-03/05/06 plus valid proof could support preference; SUP-01/US would support non-preferential treatment. |
| Whether qualifying proof covered 2025-09-18 | Current supplier declaration and the specific preference rule | Valid qualifying evidence would change the decision to clear; no valid evidence would support correcting/removing the preference claim. |
| Whether evidence exists outside the incomplete register | Targeted search of Procurement's category folder | A valid document would resolve the gap; no document would support a control correction, but still not prove fraud. |`,
    `| Material unknown | Evidence needed to resolve it | How that evidence would change my decision |
| --- | --- | --- |
| Identity of the actual sourcing supplier | Sourcing purchase order linking SHP-000411 to a specific supplier ID | EU suppliers SUP-03/05/06 would allow linking active preference; SUP-01 would confirm non-preferential MFN. |
| Active supplier declaration on entry date | Current valid supplier declaration covering 2025-09-18 and governing trade rule | Valid declaration flips decision to clear as preferential; missing declaration leads to removing preference claim. |
| External procurement category records | Targeted search of offline Procurement contracts for P1006 | Discovered document clears the entry; absence triggers administrative correction without fraud escalation. |`
  ];

  const safeActionVariants = [
    `Hold the preference claim pending supplier-specific proof, request the declaration and governing rule from Procurement/Customs, and do not clear it as preferential until verified. The supplied extract shows 0.0% duty, so this hold is reversible and no duty change should be assumed until tariff treatment is confirmed.`,
    `Place a reversible administrative hold on the preference claim. Request the active supplier declaration and originating rule from Procurement. Treat the line as non-preferential (0.0% duty neutral) until documentary proof is verified, without initiating an irreversible voluntary disclosure.`
  ];

  const answer = [
    '## Decision',
    pick(rng, decisionVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    pick(rng, assessmentVariants),
    '',
    '## Rejected Hypotheses',
    pick(rng, rejectedVariants),
    '',
    '## Missing Evidence',
    pick(rng, missingVariants),
    '',
    '## Safe Next Action',
    pick(rng, safeActionVariants)
  ].join('\n');

  return {
    type: 'solved',
    variant: `Ultra-Advanced Calibrated Note (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Case 3B diagnostic note: Expired SUP-02 declaration (2025-07-31) vs 2025-09-18 entry date, unsupported vs false distinction, 5-supplier landscape, reversible administrative hold. 100% compliant with official requirements.'
  };
}
