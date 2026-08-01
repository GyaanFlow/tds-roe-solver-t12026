export const lockConfig = {
  // Locked by default — no past/other user gets access to this exam's answers or guides
  // until their email is explicitly added below.
  locked: true,

  // Whitelist of emails allowed to get programmatic solved answers when locked is true.
  // Intentionally starts with just the owner's own email — add others one at a time as
  // you decide to grant access, rather than inheriting any other exam's whitelist.
  allowedEmails: [
    '23f1000805@ds.study.iitm.ac.in'
  ]
};
