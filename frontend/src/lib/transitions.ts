import type { SessionState } from '../types/session';
import { isFreeFormInputValid } from './validation';

/**
 * Guard for the review-period-selection → free-form-input transition.
 *
 * Returns true when the employee has chosen a review period.
 * Satisfies Requirements 1.4.
 */
export function canAdvanceFromReviewPeriod(state: SessionState): boolean {
  return state.reviewPeriod !== null;
}

/**
 * Guard for the free-form-input → write-up transition.
 *
 * Returns true when a review period is set and the free-form input contains
 * valid, non-empty content within the 10,000 character limit.
 * Satisfies Requirements 3.6.
 */
export function canGenerateWriteUp(state: SessionState): boolean {
  return state.reviewPeriod !== null && isFreeFormInputValid(state.freeFormInput);
}
