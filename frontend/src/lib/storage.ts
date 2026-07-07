import type { SessionState } from '../types/session';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SESSION_KEY = 'ese_session_v1';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

// ---------------------------------------------------------------------------
// Storage availability flag
// ---------------------------------------------------------------------------

/**
 * Set to `true` if any localStorage call throws (e.g. private-browsing mode
 * or storage quota exceeded). Components read this to show the warning banner.
 * Requirements: 6.6
 */
export let storageUnavailable = false;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Serialize `state` and write it to localStorage.
 * Silently sets `storageUnavailable = true` on any error.
 * Requirements: 6.1, 6.3
 */
export function saveSession(state: SessionState): void {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(SESSION_KEY, serialized);
  } catch {
    storageUnavailable = true;
  }
}

/**
 * Read and parse the saved session from localStorage.
 * Returns `null` if:
 *  - nothing is stored
 *  - the stored data cannot be parsed
 *  - the session is older than SESSION_TTL_MS (7 days)
 * Requirements: 6.2, 6.3
 */
export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw === null) return null;

    const parsed = JSON.parse(raw) as SessionState;

    // Enforce 7-day expiry using the `savedAt` timestamp.
    if (typeof parsed.savedAt === 'string') {
      const savedAt = new Date(parsed.savedAt).getTime();
      const now = Date.now();
      if (Number.isNaN(savedAt) || now - savedAt > SESSION_TTL_MS) {
        clearSession();
        return null;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}

/**
 * Remove the session entry from localStorage.
 * Errors are caught silently — there is nothing meaningful to do if removal
 * fails (e.g. storage already gone).
 * Requirements: 6.1
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Intentionally silent.
  }
}
