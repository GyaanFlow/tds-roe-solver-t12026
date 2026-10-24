export const lockConfig = {
  // Set to true to lock the solver for all non-whitelisted emails, or false to unlock it for everyone.
  // Flip to false whenever you want to make this exam public — same mechanism as every other GA exam.
  locked: false,

  // Whitelist of emails allowed to get programmatic solved answers when locked is true.
  allowedEmails: []
};
