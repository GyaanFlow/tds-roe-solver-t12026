export const lockConfig = {
  // Set to true to lock the solver for all non-whitelisted emails, or false to unlock it for everyone.
  locked: true,

  // Whitelist of emails allowed to get programmatic solved answers when locked is true.
  allowedEmails: [
    '21f1000000@ds.study.iitm.ac.in',
    '22f2001234@ds.study.iitm.ac.in',
    'user.test+ga1@example.com',
    'gauravtomar79172@gmail.com'
  ]
};
