// Case Study 3B — Is the Irish Preference Claim Supported? (Asterion Ortho)
import { createRng, pick, shuffle, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-customs-preference-server';
export const title = 'Case Study 3B — Is the Irish Preference Claim Supported?';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const decisionVariants = [
    `**Decision**: **The preferential-origin claim is NOT supported by the available evidence.** Packet **IE-2025-000411** claims preferential tariff treatment, but the supplier origin register search in \`supplier_declaration_reference.txt\` confirms: *"Register search result: no current document reference found for SUP-02 / P1006 on 2025-09-18."* As highlighted by Aoife Brennan and Luca Ferri in \`origin-workshop.md\`, ERP/Helios manufacturing country records do not constitute legal proof of preference, and supplier declarations sit in category folders rather than being actively linked in ClearView. The claim must be classified as **unsupported on current records**; the shipment should be cleared under a provisional standard duty deposit while an active 2025 Long-Term Supplier Declaration (LTSD) is obtained.`,
    `**Decision**: **Preferential tariff claim is currently UNSUPPORTED on available evidence.** Audit of packet **IE-2025-000411** confirms that no valid active supplier declaration is linked in ClearView for supplier SUP-02 / product P1006. In the absence of an active 2025 LTSD verifying regional value content, the 0% preferential rate cannot be legally established. Action: Secure provisional clearance under standard duty guarantee and request the 2025 LTSD from Procurement.`,
    `**Decision**: **The preference claim cannot be substantiated on current records.** The supplier declaration on file is absent or unlinked for the 2025 entry date. The claim must be treated as **unsupported** under EU customs rules. Safe action is to post a temporary non-preferential duty deposit and request the 2025 supplier certificate.`
  ];

  const evidenceRowsPool = [
    [
      pick(rng, [
        'supplier_declaration_reference.txt confirms: "no current document reference found for SUP-02 / P1006 on 2025-09-18"',
        'Register query confirms zero active supplier declaration references linked for SUP-02 / P1006 on the declaration date',
        'supplier_declaration_reference.txt establishes that no current document reference is linked in the register'
      ]),
      'supplier_declaration_reference.txt',
      pick(rng, ['High (direct register query result)', 'High (statutory document audit)', 'High'])
    ],
    [
      pick(rng, [
        'Luca Ferri confirms: "Helios carries manufacturing country. It was never designed to prove preference."',
        'Origin workshop minutes record that Helios country of origin is a physical manufacturing tag, not legal proof of preference',
        'origin-workshop.md establishes that ERP manufacturing origin cannot substitute for a formal supplier origin certificate'
      ]),
      'origin-workshop.md:Luca_Ferri',
      pick(rng, ['High (internal trade compliance consensus)', 'High (system architecture limitation)', 'High'])
    ],
    [
      pick(rng, [
        'Aoife Brennan notes: "I need the supplier declaration and the rule used for the claim... The register is not always updated"',
        'Compliance lead Aoife Brennan establishes that preference clearance requires the formal supplier declaration and specific origin rule',
        'origin-workshop.md documents that supplier declarations exist in category folders but are not synced to the register'
      ]),
      'origin-workshop.md:Aoife_Brennan',
      pick(rng, ['High (compliance lead determination)', 'High (procedural requirement)', 'High'])
    ],
    [
      pick(rng, [
        'Commercial invoice and Air Waybill confirm genuine physical shipment of P1006 from Irish manufacturing partner SUP-02',
        'Shipping documentation confirms physical consignment originating from Irish facility matching product master P1006',
        'Physical consignment details and commercial invoices confirm authentic manufacture without evidence of shell routing'
      ]),
      'commercial_invoice.pdf & air_waybill.pdf',
      pick(rng, ['High (physical origin confirmation)', 'High (packet manifest audit)', 'High'])
    ]
  ];

  const selectedEvidence = shuffle(rng, evidenceRowsPool);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedHypothesesPool = [
    pick(rng, [
      '**Hypothesis: The preference claim is fully substantiated because the goods were physically manufactured in Ireland.**\n*Refutation*: Under statutory customs law (EU-UK TCA / EU preferential rules), physical country of manufacture does not automatically confer preferential origin without an active, legally binding Long-Term Supplier Declaration (LTSD) certifying qualifying local value content or specific transformation rules for the applicable tax year.',
      '**Hypothesis: The preference indicator on the invoice is sufficient legal proof of origin.**\n*Refutation*: Falsified because customs authorities require an unexpired, verifiable supplier origin certificate. As Luca Ferri noted, ERP/invoice manufacturing country tags are not designed to prove preference.'
    ]),
    pick(rng, [
      '**Hypothesis: The broker or importer engaged in fraudulent tariff evasion.**\n*Refutation*: Refuted because the Irish manufacturer is a legitimate, long-term supplier, and the Procurement representative in `origin-workshop.md` explained that supplier declarations exist in category folders but suffer from administrative registry upload backlogs.',
      '**Hypothesis: The shipment should be seized and penalized for deliberate misrepresentation.**\n*Refutation*: Rejected because customs compliance guidelines treat unlinked or backlog supplier certificates as administrative documentation deficiencies subject to provisional duty deposit rather than willful fraud.'
    ])
  ];
  const rejectedText = rejectedHypothesesPool.join('\n\n');

  const missingEvidenceVariants = [
    `**Missing Evidence**: A signed, valid **2025 Long-Term Supplier Declaration (LTSD)** covering product **P1006** from supplier **SUP-02** specifying the applicable preferential origin rule (e.g., Regional Value Content or Specific Manufacturing Process). If Procurement retrieves this document from the category folder, the preference claim is fully substantiated retroactively. Conversely, if the supplier issues a Non-Originating declaration, standard duty must be permanently paid.`,
    `**Missing Evidence**: Active 2025 Supplier Origin Certificate with updated Bill of Materials (BOM) origin breakdown for product P1006. Receipt of a valid 2025 LTSD would immediately reverse this determination and substantiate the 0% preferential claim.`,
    `**Missing Evidence**: Formal written origin declaration from SUP-02 for the 2025 production batches. A valid supplier certificate is the sole legal document capable of substantiating the preference claim.`
  ];

  const safeActionVariants = [
    `**Safe Next Action**: **Do not release under preference; do not accuse of fraud.** Place packet **IE-2025-000411** on a **provisional standard duty deposit (or customs bond)** to permit immediate cargo release without production line disruption, and issue an urgent internal request to Procurement to retrieve the **2025 LTSD** for SUP-02 / P1006 from the category folder and upload it into ClearView within 14 days to reclaim the deposit.`,
    `**Safe Next Action**: **Clear under provisional security and request 2025 LTSD.** Post a temporary duty guarantee for the standard tariff differential, release the shipment to prevent manufacturing line stoppage, and task the category procurement manager with uploading the 2025 supplier origin certificate in ClearView within 15 business days.`,
    `**Safe Next Action**: **Post provisional non-preferential duty and expedite supplier documentation.** Release goods under temporary customs deposit and trigger an urgent vendor compliance request for the 2025 Long-Term Supplier Declaration.`
  ];

  const answer = [
    '## Decision',
    pick(rng, decisionVariants),
    '',
    '## Evidence Table',
    evidenceTable,
    '',
    '## Rejected Hypotheses',
    rejectedText,
    '',
    '## Missing Evidence',
    pick(rng, missingEvidenceVariants),
    '',
    '## Safe Next Action',
    pick(rng, safeActionVariants)
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: 'Verified Case 3B Solution citing exact SUP-02 / P1006 query, Aoife Brennan / Luca Ferri quotes, and provisional deposit action.'
  };
}
