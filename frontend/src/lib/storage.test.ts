import { describe, it, expect, beforeEach } from 'vitest';
import type { SessionState } from '../types/session';
import {
  saveSession,
  loadSession,
  clearSession,
  storageUnavailable,
  SESSION_KEY,
  SESSION_TTL_MS,
} from './storage';

// ---------------------------------------------------------------------------
// In-memory localStorage mock
// (The test runner's jsdom localStorage may be unavailable in this environment)
// ---------------------------------------------------------------------------

const store: Record<string, string> = {};

const localStorageMock: Storage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (index: number) => Object.keys(store)[index] ?? null,
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal valid SessionState with an optional savedAt override. */
function makeSession(savedAt: string = new Date().toISOString()): SessionState {
  return {
    version: 1,
    savedAt,
    reviewPeriod: 'mid-year',
    currentStep: 'free-form-input',
    freeFormInput: 'Some achievements',
    writeUp: null,
  };
}

// ---------------------------------------------------------------------------
// Cleanup between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  localStorageMock.clear();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('storageUnavailable', () => {
  it('defaults to false', () => {
    expect(storageUnavailable).toBe(false);
  });
});

describe('saveSession + loadSession round-trip', () => {
  it('round-trips a session correctly', () => {
    const session = makeSession();
    saveSession(session);

    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded).toEqual(session);
  });

  it('persists all fields including writeUp', () => {
    const session: SessionState = {
      version: 1,
      savedAt: new Date().toISOString(),
      reviewPeriod: 'end-of-year',
      currentStep: 'write-up',
      freeFormInput: 'Lots of great work this year.',
      writeUp: {
        generatedAt: new Date().toISOString(),
        activePillarIndex: 2,
        sections: {
          'client-delivery': {
            pillarId: 'client-delivery',
            currentText: 'Delivered X.',
            previousText: null,
            wordCount: 2,
            generationVersion: 1,
          },
          'leadership': {
            pillarId: 'leadership',
            currentText: 'Led Y.',
            previousText: 'Led Z.',
            wordCount: 2,
            generationVersion: 2,
          },
          'business-development': {
            pillarId: 'business-development',
            currentText: 'Grew pipeline.',
            previousText: null,
            wordCount: 2,
            generationVersion: 1,
          },
          'firm-contribution': {
            pillarId: 'firm-contribution',
            currentText: 'Contributed internally.',
            previousText: null,
            wordCount: 2,
            generationVersion: 1,
          },
        },
      },
    };

    saveSession(session);
    const loaded = loadSession();
    expect(loaded).toEqual(session);
  });
});

describe('loadSession — session age', () => {
  it('returns null for a session older than 7 days', () => {
    // savedAt is 7 days + 1 ms in the past — just past the expiry threshold.
    const oldDate = new Date(Date.now() - SESSION_TTL_MS - 1).toISOString();
    saveSession(makeSession(oldDate));

    expect(loadSession()).toBeNull();
  });

  it('returns the session for a savedAt timestamp within 7 days', () => {
    // savedAt is 7 days minus 1 second — still valid.
    const recentDate = new Date(Date.now() - SESSION_TTL_MS + 1000).toISOString();
    const session = makeSession(recentDate);
    saveSession(session);

    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded?.savedAt).toBe(recentDate);
  });

  it('returns the session for a freshly-saved session', () => {
    saveSession(makeSession());
    expect(loadSession()).not.toBeNull();
  });

  it('clears localStorage when an expired session is found', () => {
    const oldDate = new Date(Date.now() - SESSION_TTL_MS - 1000).toISOString();
    saveSession(makeSession(oldDate));
    expect(localStorageMock.getItem(SESSION_KEY)).not.toBeNull();

    loadSession(); // triggers clearSession internally
    expect(localStorageMock.getItem(SESSION_KEY)).toBeNull();
  });
});

describe('loadSession — error handling', () => {
  it('returns null when localStorage is empty', () => {
    expect(loadSession()).toBeNull();
  });

  it('returns null when stored JSON is corrupt', () => {
    localStorageMock.setItem(SESSION_KEY, 'not-valid-json{{{');
    expect(loadSession()).toBeNull();
  });
});

describe('clearSession', () => {
  it('removes the session from localStorage', () => {
    saveSession(makeSession());
    clearSession();
    expect(loadSession()).toBeNull();
  });
});
