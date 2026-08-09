// Shared, SOFT support/credits line appended to every GA7 guide.
//
// Deliberately understated compared to the ROE promo block -- a single quiet line, not a loud
// gradient card, so it doesn't compete with the solver's own content. Kept in one place so the
// links/wording only ever need editing here.

const REPO_URL = 'https://github.com/GyaanFlow/tds-roe-solver-t12026';
const PROFILE_URL = 'https://github.com/GyaanFlow';
const LINKEDIN_URL = 'https://www.linkedin.com/in/gaurav-tomar-630b2a316';

/**
 * Markdown-safe HTML block (guides are rendered through marked with HTML passthrough).
 * Returned as an array of lines so callers can spread it straight into their guide array.
 */
export const promoLines = [
  ``,
  `---`,
  ``,
  '<div style="font-size:12px;opacity:0.7;padding:6px 0;">',
  '  Built by <a href="' + PROFILE_URL + '" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;">GyaanFlow</a> &mdash; ',
  '  if this saved you time, a quiet <a href="' + REPO_URL + '" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;">⭐ on GitHub</a> or a ',
  '  <a href="' + LINKEDIN_URL + '" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;">connect on LinkedIn</a> is appreciated, never required.',
  '</div>'
];

/** Convenience: the same block as a single joined string. */
export const promoBlock = promoLines.join('\n');
