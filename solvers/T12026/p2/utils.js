// Shared utilities for P2 (Discourse KB) solvers

export function normalizeEmail(user) {
  const email = typeof user === 'string' ? user : String(user?.email ?? user?.id ?? 'anonymous');
  return email.trim().replace(/\.+$/, '').trim().toLowerCase();
}
