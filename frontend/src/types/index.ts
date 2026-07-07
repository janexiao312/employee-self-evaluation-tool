// ---------------------------------------------------------------------------
// Core domain types shared across the frontend application.
// ---------------------------------------------------------------------------

export type PillarId =
  | 'client-delivery'
  | 'leadership'
  | 'business-development'
  | 'firm-contribution';

export type WorkflowStep =
  | 'review-period-selection'
  | 'pillar-input'
  | 'follow-up-questions'
  | 'review-confirm'
  | 'write-up';

export type Dimension =
  | 'quantifiable-impact'
  | 'stakeholder-reach'
  | 'leadership-behaviors'
  | 'strategic-alignment'
  | 'business-outcomes';

// ---------------------------------------------------------------------------
// Session state
// ---------------------------------------------------------------------------

export interface SessionState {
  version: 1;
  savedAt: string; // ISO 8601
  reviewPeriod: 'mid-year' | 'end-of-year' | null;
  currentStep: WorkflowStep;
  pillars: Record<PillarId, PillarState>;
  writeUp: WriteUpState | null;
}

export interface PillarState {
  pillarId: PillarId;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  inputText: string; // max 5,000 chars; empty string if skipped
  followUpQuestions: FollowUpQuestion[];
  missingDimensions: Dimension[];
}

export interface FollowUpQuestion {
  id: string; // UUID
  questionText: string;
  targetDimension: Dimension;
  answerText: string; // empty string if skipped
  status: 'unanswered' | 'answered' | 'skipped';
}

// ---------------------------------------------------------------------------
// Write-up state
// ---------------------------------------------------------------------------

export interface WriteUpState {
  generatedAt: string; // ISO 8601
  sections: Record<PillarId, WriteUpSection | null>; // null = pillar omitted
}

export interface WriteUpSection {
  pillarId: PillarId;
  currentText: string;
  previousText: string | null; // populated after first revision
  wordCount: number;
  generationVersion: number; // increments on each regeneration
}

// ---------------------------------------------------------------------------
// Level expectations
// ---------------------------------------------------------------------------

export interface LevelExpectationsFile {
  level: string;
  practice: string;
  version: string;
  pillars: Record<PillarId, PillarExpectations>;
}

export interface PillarExpectations {
  pillarId: PillarId;
  displayName: string;
  description: string;
  criteria: ExpectationCriterion[];
}

export interface ExpectationCriterion {
  id: string;
  dimension: Dimension;
  text: string;
}

// ---------------------------------------------------------------------------
// API request / response shapes
// ---------------------------------------------------------------------------

export interface FollowUpRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  pillarId: PillarId;
  inputText: string;
  pillarExpectations: PillarExpectations;
}

export interface FollowUpResponse {
  questions: Array<{
    questionText: string;
    targetDimension: Dimension;
  }>;
}

export interface GenerateWriteUpRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  pillars: Array<{
    pillarId: PillarId;
    inputText: string;
    followUpAnswers: Array<{ question: string; answer: string }>;
    missingDimensions: Dimension[];
    expectations: PillarExpectations;
  }>;
}

export interface GenerateWriteUpResponse {
  sections: Record<PillarId, { text: string; wordCount: number } | null>;
}

export interface ReviseSectionRequest {
  reviewPeriod: 'mid-year' | 'end-of-year';
  pillarId: PillarId;
  currentText: string;
  revisionNote: string; // max 1,000 chars
  originalInputText: string;
  followUpAnswers: Array<{ question: string; answer: string }>;
  expectations: PillarExpectations;
}

export interface ReviseSectionResponse {
  text: string;
  wordCount: number;
}
