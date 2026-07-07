import { create, type StoreApi } from 'zustand';
import type {
  SessionState,
  PillarId,
  WorkflowStep,
  WriteUpState,
  WriteUpSection,
} from '../types/session';
import { saveSession } from '../lib/storage';

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

/** Factory for the blank session state used on init and clearSession. */
const createInitialSessionState = (): SessionState => ({
  version: 1,
  savedAt: new Date().toISOString(),
  reviewPeriod: null,
  currentStep: 'review-period-selection',
  freeFormInput: '',
  writeUp: null,
});

// ---------------------------------------------------------------------------
// Action types
// ---------------------------------------------------------------------------

interface SessionActions {
  /**
   * Set the review period.
   * Clears the write-up to avoid stale framing when the period changes.
   * Requirements: 1.2
   */
  setReviewPeriod: (period: 'mid-year' | 'end-of-year') => void;

  /**
   * Advance (or move back) to a different wizard step.
   * Requirements: 6.1
   */
  setCurrentStep: (step: WorkflowStep) => void;

  /**
   * Update the free-form input text.
   * Requirements: 6.1
   */
  setFreeFormInput: (text: string) => void;

  /**
   * Store a freshly generated write-up.
   * Requirements: 6.1
   */
  setWriteUp: (writeUp: WriteUpState) => void;

  /**
   * Update a single write-up section after regeneration.
   * Moves `currentText` → `previousText` before storing the new text and
   * increments `generationVersion`.
   * Requirements: 5.5, 6.4
   */
  updateWriteUpSection: (pillarId: PillarId, newText: string, wordCount: number) => void;

  /**
   * Revert a write-up section to its `previousText`.
   * Sets `previousText` to null after revert (one level of undo only).
   * Requirements: 5.5, 6.4
   */
  revertWriteUpSection: (pillarId: PillarId) => void;

  /**
   * Update which pillar section is currently displayed in the write-up review.
   * Requirements: 6.1
   */
  setActivePillarIndex: (index: number) => void;

  /**
   * Reset the entire session back to the initial state.
   * Requirements: 6.1
   */
  clearSession: () => void;
}

// ---------------------------------------------------------------------------
// Store type
// ---------------------------------------------------------------------------

export type SessionStore = SessionState & SessionActions;

// ---------------------------------------------------------------------------
// Store implementation
// ---------------------------------------------------------------------------

/**
 * The Zustand store instance. Exported alongside the hook so the storage
 * adapter can call `sessionStore.subscribe(...)` outside of React.
 */
export const sessionStore: StoreApi<SessionStore> = create<SessionStore>((set) => ({
  ...createInitialSessionState(),

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  setReviewPeriod: (period) =>
    set((state) => ({
      ...state,
      reviewPeriod: period,
      // Discard any existing write-up — it was generated for a potentially
      // different review period and would have incorrect framing.
      writeUp: null,
      savedAt: new Date().toISOString(),
    })),

  setCurrentStep: (currentStep) =>
    set((state) => ({
      ...state,
      currentStep,
      savedAt: new Date().toISOString(),
    })),

  setFreeFormInput: (freeFormInput) =>
    set((state) => ({
      ...state,
      freeFormInput,
      savedAt: new Date().toISOString(),
    })),

  setWriteUp: (writeUp) =>
    set((state) => ({
      ...state,
      writeUp,
      savedAt: new Date().toISOString(),
    })),

  updateWriteUpSection: (pillarId, newText, wordCount) =>
    set((state) => {
      if (!state.writeUp) return state;

      const existingSection = state.writeUp.sections[pillarId];
      if (!existingSection) return state;

      const updatedSection: WriteUpSection = {
        ...existingSection,
        previousText: existingSection.currentText,
        currentText: newText,
        wordCount,
        generationVersion: existingSection.generationVersion + 1,
      };

      return {
        ...state,
        savedAt: new Date().toISOString(),
        writeUp: {
          ...state.writeUp,
          sections: {
            ...state.writeUp.sections,
            [pillarId]: updatedSection,
          },
        },
      };
    }),

  revertWriteUpSection: (pillarId) =>
    set((state) => {
      if (!state.writeUp) return state;

      const existingSection = state.writeUp.sections[pillarId];
      if (!existingSection || existingSection.previousText === null) return state;

      // Swap currentText back to previousText; clear previousText so the
      // revert button is hidden again (one level of undo only).
      const revertedSection: WriteUpSection = {
        ...existingSection,
        currentText: existingSection.previousText,
        previousText: null,
        wordCount: existingSection.previousText.trim().split(/\s+/).filter(Boolean).length,
      };

      return {
        ...state,
        savedAt: new Date().toISOString(),
        writeUp: {
          ...state.writeUp,
          sections: {
            ...state.writeUp.sections,
            [pillarId]: revertedSection,
          },
        },
      };
    }),

  setActivePillarIndex: (index) =>
    set((state) => {
      if (!state.writeUp) return state;

      return {
        ...state,
        savedAt: new Date().toISOString(),
        writeUp: {
          ...state.writeUp,
          activePillarIndex: index,
        },
      };
    }),

  clearSession: () =>
    set(() => ({
      ...createInitialSessionState(),
    })),
}));

/**
 * React hook to access the session store from within components.
 * Use selectors to avoid unnecessary re-renders, e.g.:
 *   const reviewPeriod = useSessionStore((s) => s.reviewPeriod);
 */
export const useSessionStore = sessionStore;

// ---------------------------------------------------------------------------
// Persistence — wire storage adapter to every state mutation
// ---------------------------------------------------------------------------

/**
 * Persist the entire session state to localStorage on every mutation.
 * Requirements: 6.1
 */
sessionStore.subscribe((state) => {
  saveSession(state);
});
