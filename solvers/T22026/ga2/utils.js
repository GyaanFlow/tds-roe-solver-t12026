// Shared utilities for GA2 solvers

// Normalize email the same way as exam
export function normalizeEmail(user) {
  if (typeof user === 'string') return user.trim().toLowerCase();
  return String(user?.email ?? user?.id ?? 'anonymous').trim().toLowerCase();
}
