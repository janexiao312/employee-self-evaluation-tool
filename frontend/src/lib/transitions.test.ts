import { describe, it, expect } from 'vitest';
import { canAdvanceFromReviewPeriod, canGenerateWriteUp } from './transitions';
import type { SessionState } from '../types/session';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeState(overrides: Partial<SessionState> = {}): SessionState {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    reviewPeriod: null,
    currentStep: 'review-period-selection',
    freeFormInput: '',
    writeUp: null,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// canAdvanceFromReviewPeriod
// ---------------------------------------------------------------------------

describe('canAdvanceFromReviewPeriod', () => {
  it('returns false when reviewPeriod is null', () => {
    expect(canAdvanceFromReviewPeriod(makeState({ reviewPeriod: null }))).toBe(false);
  });

  it('returns true when reviewPeriod is mid-year', () => {
    expect(canAdvanceFromReviewPeriod(makeState({ reviewPeriod: 'mid-year' }))).toBe(true);
  });

  it('returns true when reviewPeriod is end-of-year', () => {
    expect(canAdvanceFromReviewPeriod(makeState({ reviewPeriod: 'end-of-year' }))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// canGenerateWriteUp
// ---------------------------------------------------------------------------

describe('canGenerateWriteUp', () => {
  it('returns false when reviewPeriod is null', () => {
    expect(canGenerateWriteUp(makeState({ reviewPeriod: null, freeFormInput: 'Some text' }))).toBe(false);
  });

  it('returns false when freeFormInput is empty', () => {
    expect(canGenerateWriteUp(makeState({ reviewPeriod: 'mid-year', freeFormInput: '' }))).toBe(false);
  });

  it('returns false when freeFormInput is whitespace only', () => {
    expect(canGenerateWriteUp(makeState({ reviewPeriod: 'mid-year', freeFormInput: '   \n\t  ' }))).toBe(false);
  });

  it('returns false when freeFormInput exceeds 10,000 characters', () => {
    const tooLong = 'a'.repeat(10_001);
    expect(canGenerateWriteUp(makeState({ reviewPeriod: 'mid-year', freeFormInput: tooLong }))).toBe(false);
  });

  it('returns true when reviewPeriod is set and freeFormInput is valid (within limit)', () => {
    expect(
      canGenerateWriteUp(makeState({ reviewPeriod: 'mid-year', freeFormInput: 'Some meaningful input' }))
    ).toBe(true);
  });

  it('returns true when freeFormInput is exactly 10,000 characters', () => {
    const atLimit = 'a'.repeat(10_000);
    expect(canGenerateWriteUp(makeState({ reviewPeriod: 'end-of-year', freeFormInput: atLimit }))).toBe(true);
  });

  it('returns true for end-of-year with valid input', () => {
    expect(
      canGenerateWriteUp(makeState({ reviewPeriod: 'end-of-year', freeFormInput: 'End of year achievements' }))
    ).toBe(true);
  });
});
