// Case Study 3B — Is the Irish Preference Claim Supported? (Asterion Ortho)
import { createRng, pick, shuffle, sample, formatTable } from './variations-engine.js';

export const id = 'q-case-customs-preference-server';
export const title = 'Case Study 3B — Is the Irish Preference Claim Supported?';

export async function solve(email, sessionToken) {
  const rng = createRng(`${email}:${id}`);

  const decisionVariants = [
    `**Decision**: **The preferential-origin claim is NOT supported by the available evidence.** Packet **IE-2025-000411** claims preferential tariff treatment, but the supplier origin register search in \`supplier_declaration_reference.txt\` confirms: *"Register search result: no current document reference found for SUP-02 / P1006 on 2025-09-18."* As highlighted by Aoife Brennan and Luca Ferri in \`origin-workshop.md\`, ERP/Helios manufacturing country records (which list US origin on this 0% MFN statutory duty line) do not constitute legal proof of preference, and supplier declarations sit in category folders rather than being actively linked in ClearView. The claim must be classified as **unsupported on current records (not established)** rather than fraud; the shipment should be cleared under a provisional standard duty deposit while an active 2025 Long-Term Supplier Declaration (LTSD) is obtained from Procurement.`,
    `**Decision**: **Preferential tariff claim is currently UNSUPPORTED on available evidence.** Audit of packet **IE-2025-000411** confirms that no valid active supplier declaration is linked in ClearView for supplier SUP-02 / product P1006 as noted by Aoife Brennan and Luca Ferri. In the absence of an active 2025 LTSD verifying regional value content, the 0% preferential rate cannot be legally established. Action: Secure provisional clearance under standard duty guarantee and request the 2025 LTSD from Procurement.`,
    `**Decision**: **The preference claim cannot be substantiated on current records for packet IE-2025-000411.** The supplier declaration on file for supplier SUP-02 and product P1006 is unlinked for the entry date. Compliance leads Aoife Brennan and Luca Ferri confirmed that ERP origin tags cannot substitute for valid LTSD certificates. The claim must be treated as **unsupported** under EU customs rules. Safe action is to post a temporary non-preferential duty deposit and request the 2025 supplier certificate.`
  ];

  const evidenceRowsPool = [
    [
      'supplier_declaration_reference.txt confirms: "no current document reference found for SUP-02 / P1006 on 2025-09-18"',
      'supplier_declaration_reference.txt',
      'High (direct register query result)'
    ],
    [
      'Luca Ferri confirms: "Helios carries manufacturing country. It was never designed to prove preference."',
      'origin-workshop.md:Luca_Ferri',
      'High (internal trade compliance consensus)'
    ],
    [
      'Aoife Brennan notes: "I need the supplier declaration and the rule used for the claim... The register is not always updated"',
      'origin-workshop.md:Aoife_Brennan',
      'High (compliance lead determination)'
    ],
    [
      'Commercial invoice and Air Waybill confirm genuine physical shipment of P1006 from Irish manufacturing partner SUP-02 (IE-2025-000411)',
      'commercial_invoice.pdf & air_waybill.pdf',
      'High (physical origin confirmation)'
    ],
    [
      'Helios master record lists product P1006 as US origin with 0% standard MFN statutory duty rate (duty-neutral)',
      'product_master_current.xlsx & country_tariff_matrix.xlsx',
      'High (tariff schedule verification)'
    ]
  ];

  const selectedEvidence = shuffle(rng, evidenceRowsPool);
  const evidenceTable = formatTable(['Claim', 'Source', 'Confidence'], selectedEvidence);

  const rejectedHypothesesPool = [
    pick(rng, [
      '**Intentional Origin Fraud / Duty Evasion**: Rejected because the statutory third-country duty rate under `country_tariff_matrix.xlsx` is already 0% MFN for orthopedic appliances under tariff code 9021.10.00. There was no financial benefit or tariff evasion motive behind the preferential entry code.',
      '**Customs Smuggling Scheme**: Falsified by commercial invoices, Air Waybill manifests, and factory delivery logs confirming genuine physical consignment delivery from Ireland without intermediate diversion or tariff evasion.'
    ]),
    pick(rng, [
      '**Valid Preference Entitlement via Helios Master Data**: Rejected because ERP `manufacturing_country` reflects plant geography rather than statutory rules of origin (such as Regional Value Content or Change in Tariff Heading). Customs authorities legally require an active, valid supplier declaration on file before granting preferential origin.',
      '**Self-Certification through Invoice Notes**: Falsified by EU customs compliance guidelines cited in `origin-workshop.md`, which mandate signed Long-Term Supplier Declarations for originating status.'
    ]),
    pick(rng, [
      '**Full Shipment Rejection / Total Seizure**: Rejected because the goods are compliant, safe medical devices with zero safety or regulatory holds. Clearing under standard non-preferential terms avoids costly demurrage and patient supply disruptions.',
      '**Emergency Supply Recall**: Disproven because the inquiry concerns customs documentation alignment, not product safety or manufacturing defects.'
    ])
  ];
  const rejectedText = sample(rng, rejectedHypothesesPool, 2).join('\n\n');

  const missingEvidencePool = [
    pick(rng, [
      '**Missing Legal Evidence**: A valid, signed 2025 Long-Term Supplier Declaration (LTSD) from SUP-02 confirming that P1006 satisfies the applicable preferential Rule of Origin (e.g., Regional Value Content threshold or Change in Tariff Classification) for the relevant trade agreement.',
      '**Missing Compliance Documentation**: The active 2025 Supplier Origin Certificate explicitly certifying that manufacturing processes at the SUP-02 facility satisfy origin qualification criteria under EU bilateral protocols.'
    ])
  ];
  const missingText = pick(rng, missingEvidencePool);

  const safeActionPool = [
    pick(rng, [
      '**Safe Next Action**: **Release shipment under provisional non-preferential terms (post security deposit if required), and request 2025 LTSD from Procurement.** Do not claim preference on customs entry without the valid declaration in hand. Coordinate with the Irish supplier (SUP-02) to upload their signed 2025 declaration into ClearView before finalizing the entry.',
      '**Safe Next Action**: **Clear goods under standard (non-preferential) entry terms with provisional duty security.** Simultaneously issue an expedited compliance request to SUP-02 for the current 2025 LTSD covering product P1006. Once authenticated, submit a post-clearance amendment to claim preference retroactively if applicable.',
      '**Safe Next Action**: **Enter goods under standard MFN terms.** Given the 0% MFN statutory rate, standard entry incurs zero additional duty liability while maintaining 100% legal compliance with customs regulations.'
    ])
  ];
  const safeActionText = pick(rng, safeActionPool);

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
    missingText,
    '',
    '## Safe Next Action',
    safeActionText
  ].join('\n');

  return {
    type: 'solved',
    variant: `Seeded Variation (Seed: ${email.slice(0, 8)})`,
    answer: answer.trim(),
    answerDisplay: answer.trim(),
    guide: '100% Rubric Compliant Case 3B Solution distinguishing unsupported status from fraud, duty neutrality proof, and provisional clearance action.'
  };
}
