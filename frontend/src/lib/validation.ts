/**
 * Validation utilities for free-form input, revision fields, and word counting.
 *
 * Requirements: 3.2, 3.3, 3.4, 3.5, 4.4, 5.3, 7.2, 7.3, 7.4
 */

/** Maximum characters allowed for the free-form input field (Req 3.2, 7.3). */
export const FREE_FORM_CHAR_LIMIT = 10_000;

/** Maximum characters allowed for revision input fields (Req 5.3). */
export const REVISION_CHAR_LIMIT = 1_000;

/**
 * Returns the raw character count of a string.
 * Used to drive live character-count indicators (Req 3.3, 7.2).
 */
export function getCharCount(value: string): number {
  return value.length;
}

/**
 * Returns true when the string is empty or contains only whitespace.
 * Treats whitespace-only input the same as an empty field (Req 3.5, 7.4).
 */
export function isEffectivelyEmpty(value: string): boolean {
  return value.trim() === '';
}

/**
 * Returns true when the free-form input is valid for submission:
 * - Not effectively empty (Req 3.5, 7.4)
 * - Does not exceed the 10,000-character limit (Req 3.2, 7.3)
 */
export function isFreeFormInputValid(value: string): boolean {
  return !isEffectivelyEmpty(value) && getCharCount(value) <= FREE_FORM_CHAR_LIMIT;
}

/**
 * Returns true when the revision input is within the 1,000-character limit.
 * An empty revision input is considered valid (the field is optional for context).
 * (Req 5.3)
 */
export function isRevisionInputValid(value: string): boolean {
  return getCharCount(value) <= REVISION_CHAR_LIMIT;
}

/**
 * Counts the number of whitespace-delimited tokens in a string.
 * Leading/trailing whitespace is ignored; consecutive whitespace is collapsed.
 * Returns 0 for effectively empty input.
 * Used to track per-section word counts in the write-up (Req 4.4).
 */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed === '') return 0;
  return trimmed.split(/\s+/).length;
}
