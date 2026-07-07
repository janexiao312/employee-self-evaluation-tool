import { describe, it, expect } from 'vitest';
import {
  getCharCount,
  isEffectivelyEmpty,
  isFreeFormInputValid,
  isRevisionInputValid,
  countWords,
  FREE_FORM_CHAR_LIMIT,
  REVISION_CHAR_LIMIT,
} from './validation';

// ---------------------------------------------------------------------------
// getCharCount
// ---------------------------------------------------------------------------

describe('getCharCount', () => {
  it('returns 0 for an empty string', () => {
    expect(getCharCount('')).toBe(0);
  });

  it('returns correct length for a plain string', () => {
    expect(getCharCount('hello')).toBe(5);
  });

  it('counts whitespace characters', () => {
    expect(getCharCount('  ')).toBe(2);
  });

  it('counts multi-byte Unicode characters by code unit (string.length)', () => {
    // '😀' is a surrogate pair — length 2 in JS strings
    expect(getCharCount('😀')).toBe('😀'.length);
  });

  it('returns the same value as string.length for arbitrary strings', () => {
    const samples = ['', 'a', 'hello world', '  spaces  ', 'línea'];
    for (const s of samples) {
      expect(getCharCount(s)).toBe(s.length);
    }
  });
});

// ---------------------------------------------------------------------------
// isEffectivelyEmpty
// ---------------------------------------------------------------------------

describe('isEffectivelyEmpty', () => {
  it('returns true for empty string', () => {
    expect(isEffectivelyEmpty('')).toBe(true);
  });

  it('returns true for whitespace-only strings', () => {
    expect(isEffectivelyEmpty('   ')).toBe(true);
    expect(isEffectivelyEmpty('\t\n')).toBe(true);
    expect(isEffectivelyEmpty('  \n  \t  ')).toBe(true);
  });

  it('returns false for a string with real content', () => {
    expect(isEffectivelyEmpty('a')).toBe(false);
    expect(isEffectivelyEmpty('  text  ')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isFreeFormInputValid
// ---------------------------------------------------------------------------

describe('isFreeFormInputValid', () => {
  it('returns false for empty string', () => {
    expect(isFreeFormInputValid('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isFreeFormInputValid('   \n\t   ')).toBe(false);
  });

  it('returns true for short valid input', () => {
    expect(isFreeFormInputValid('I contributed to the project.')).toBe(true);
  });

  it('returns true for input exactly at the 10,000-character limit', () => {
    expect(isFreeFormInputValid('a'.repeat(FREE_FORM_CHAR_LIMIT))).toBe(true);
  });

  it('returns false for input exceeding 10,000 characters', () => {
    expect(isFreeFormInputValid('a'.repeat(FREE_FORM_CHAR_LIMIT + 1))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isRevisionInputValid
// ---------------------------------------------------------------------------

describe('isRevisionInputValid', () => {
  it('returns true for empty string (revision field is optional)', () => {
    expect(isRevisionInputValid('')).toBe(true);
  });

  it('returns true for input within the 1,000-character limit', () => {
    expect(isRevisionInputValid('Please make it more concise.')).toBe(true);
  });

  it('returns true for input exactly at 1,000 characters', () => {
    expect(isRevisionInputValid('a'.repeat(REVISION_CHAR_LIMIT))).toBe(true);
  });

  it('returns false for input exceeding 1,000 characters', () => {
    expect(isRevisionInputValid('a'.repeat(REVISION_CHAR_LIMIT + 1))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// countWords
// ---------------------------------------------------------------------------

describe('countWords', () => {
  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for whitespace-only string', () => {
    expect(countWords('   \n\t  ')).toBe(0);
  });

  it('returns 1 for a single word', () => {
    expect(countWords('hello')).toBe(1);
  });

  it('counts words delimited by single spaces', () => {
    expect(countWords('one two three')).toBe(3);
  });

  it('collapses consecutive whitespace between words', () => {
    expect(countWords('one   two\t\tthree')).toBe(3);
  });

  it('ignores leading and trailing whitespace', () => {
    expect(countWords('  hello world  ')).toBe(2);
  });

  it('handles newline-delimited tokens', () => {
    expect(countWords('line one\nline two\nline three')).toBe(6);
  });

  it('handles a typical evaluation-length paragraph', () => {
    const text = 'I led the migration of the legacy payment service to a microservices architecture.';
    // 13 tokens: I led the migration of the legacy payment service to a microservices architecture.
    expect(countWords(text)).toBe(13);
  });
});
