// Shared utilities for GA2 solvers

// Normalize email the same way as exam
export function normalizeEmail(user) {
  const email = typeof user === 'string' ? user : String(user?.email ?? user?.id ?? 'anonymous');
  return email.trim().replace(/\.+$/, '').trim().toLowerCase();
}
