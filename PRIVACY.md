# Privacy Notice

Last reviewed: 2026-10-24

TDS Portal is a static browser application. It does not provide a project-owned account system or database. This does not mean the site is offline-only: hosting, analytics, browser requests, and question-specific integrations involve third parties.

## Information in your browser

- The portal stores selected term/exam, email entry and recent email history, search and display preferences, and the academic-integrity acknowledgement in browser `localStorage`.
- Some question tools save task-specific practice state locally. For example, the T3 Project 1 prediction-market tool stores its local history in `localStorage`.
- The service worker caches application assets for offline use. These browser stores are on the device/profile you use and are not synced by this project to a project-owned server.
- The session-token field is intentionally not persisted by the main portal. A solver may still send a value to its documented external service when you invoke that feature.

To remove local state, clear this site's browser storage and service-worker data in your browser's site settings. Clearing local data may remove saved drafts or progress.

## Network requests and third parties

- Vercel hosts the deployed site and its static assets. Vercel Analytics and Speed Insights scripts are included; the hosting provider may process request and performance data under its own policies.
- The homepage requests public GitHub profile and repository statistics. GitHub receives those requests and standard network metadata.
- Some question tools make requests to external APIs, data sources, or user-configured services. A request may include task inputs such as an email, prompt, URL, or token when the selected task requires it. Each feature's guide and source identify its endpoint; do not submit information you are not authorized to share.
- External services have their own availability, logging, retention, and privacy practices. This project does not control them.

This is a code-based summary, not a network-traffic guarantee or legal privacy representation. Review a feature's source and inspect browser network activity when you need to know exactly what a particular task sends. Questions about the deployed host's processing should be directed to that provider.
