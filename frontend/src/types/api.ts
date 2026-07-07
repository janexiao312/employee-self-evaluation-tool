/**
 * API request and response types for the Employee Self-Evaluation Tool backend.
 *
 * Endpoints:
 *   POST /api/follow-up-questions   → FollowUpRequest / FollowUpResponse
 *   POST /api/generate-writeup      → GenerateWriteUpRequest / GenerateWriteUpResponse
 *   POST /api/revise-section        → ReviseSectionRequest / ReviseSectionResponse
 *
 * Error responses across all endpoints return:
 *   { error: string; code: string }  with an appropriate HTTP status code.
 */

import type { Dimension, PillarId } from './session';
import type { PillarExpectations } from './expectations';

// ---------------------------------------------------------------------------
// POST /api/follow-up-questions
// ---------------------------------------------------------------------------

/** Request payload for generating 1–3 follow-up questions for a single pillar. */
export interface FollowUpRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  pillarId: PillarId;
  /** Raw pillar input text from the user; max 5,000 chars. */
  inputText: string;
  pillarExpectations: PillarExpectations;
}

/** Successful response containing the generated follow-up questions. */
export interface FollowUpResponse {
  /** Between 1 and 3 questions, each mapped to a specific evaluation dimension. */
  questions: Array<{
    questionText: string;
    targetDimension: Dimension;
  }>;
}

// ---------------------------------------------------------------------------
// POST /api/generate-writeup
// ---------------------------------------------------------------------------

/** Per-pillar context block sent with the write-up generation request. */
interface WriteUpPillarInput {
  pillarId: PillarId;
  /** Raw pillar input text; may be empty string for completed-but-blank pillars. */
  inputText: string;
  followUpAnswers: Array<{
    question: string;
    answer: string;
  }>;
  /** Dimensions left unanswered or skipped; instructs the model to use qualifying language. */
  missingDimensions: Dimension[];
  expectations: PillarExpectations;
}

/** Request payload for generating the full write-up across all non-skipped pillars. */
export interface GenerateWriteUpRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  /** Only non-skipped pillars should be included. */
  pillars: WriteUpPillarInput[];
}

/**
 * Successful response containing generated text for each requested pillar.
 * null entries correspond to skipped pillars (omitted sections in the UI).
 */
export interface GenerateWriteUpResponse {
  sections: Record<PillarId, { text: string; wordCount: number } | null>;
}

// ---------------------------------------------------------------------------
// POST /api/revise-section
// ---------------------------------------------------------------------------

/** Request payload for regenerating a single pillar section with revision feedback. */
export interface ReviseSectionRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  pillarId: PillarId;
  /** The current generated text being revised. */
  currentText: string;
  /** User-provided revision instruction; max 1,000 chars. */
  revisionNote: string;
  /** Original pillar input text for full context. */
  originalInputText: string;
  followUpAnswers: Array<{
    question: string;
    answer: string;
  }>;
  expectations: PillarExpectations;
}

/** Successful response containing the revised section text. */
export interface ReviseSectionResponse {
  text: string;
  wordCount: number;
}
