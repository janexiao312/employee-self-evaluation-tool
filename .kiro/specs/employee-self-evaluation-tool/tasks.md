# Implementation Plan: Employee Self-Evaluation Tool

## Overview

Build a web-based employee self-evaluation tool with a React 18 + Vite frontend, Node.js/Express backend (thin AI proxy), Zustand state management, Tailwind CSS + Radix UI components, local-storage session persistence, and LLM integration via an adapter pattern (Amazon Bedrock or Azure OpenAI). The implementation follows a 3-step flow: review period selection → free-form input → write-up review (one pillar at a time).

---

## Tasks

- [x] 1. Project scaffolding and shared types
  - [x] 1.1 Scaffold frontend (Vite + React 18 + TypeScript) and backend (Node.js + Express + TypeScript) with monorepo or side-by-side structure
    - Create `frontend/` and `backend/` directories with `package.json`, `tsconfig.json`, and `vite.config.ts` (frontend)
    - Install core dependencies: React 18, Vite, Zustand, Tailwind CSS, Radix UI, React Hook Form, React Query, Vitest, React Testing Library, fast-check, Playwright (frontend); Express 5, Zod, AWS SDK v3 / openai, Vitest (backend)
    - Configure Tailwind CSS with `tailwind.config.ts` and base `index.css`
    - _Requirements: 8.1, 8.2_

  - [x] 1.2 Define all shared TypeScript types and enums
    - Write `SessionState`, `WriteUpState`, `WriteUpSection`, `PillarId`, `WorkflowStep`, `Dimension` interfaces and types in `frontend/src/types/session.ts`
    - Write `LevelExpectationsFile`, `PillarExpectations`, `ExpectationCriterion` interfaces in `frontend/src/types/expectations.ts`
    - Write API request/response types (`GenerateWriteUpRequest`, `GenerateWriteUpResponse`, `ReviseSectionRequest`, `ReviseSectionResponse`) in `frontend/src/types/api.ts`
    - _Requirements: 1.2, 3.2, 4.1, 5.3_

  - [x] 1.3 Create static level-expectations JSON seed file
    - Write `frontend/src/data/level-expectations.json` with Sr. Principal / Client Delivery data covering all four pillars and all five dimensions with representative criteria entries
    - _Requirements: 2.1, 2.3_

- [x] 2. Session state store and local storage persistence
  - [x] 2.1 Implement Zustand session store with simplified `SessionState` shape
    - Create `frontend/src/store/sessionStore.ts` with Zustand store; implement actions: `setReviewPeriod`, `setCurrentStep`, `setFreeFormInput`, `setWriteUp`, `updateWriteUpSection`, `revertWriteUpSection`, `setActivePillarIndex`, `clearSession`
    - `SessionState` shape: `{ version: 1, savedAt: string, reviewPeriod, currentStep, freeFormInput: string, writeUp: WriteUpState | null }`
    - `WriteUpState` shape: `{ generatedAt: string, activePillarIndex: number, sections: Record<PillarId, WriteUpSection> }`
    - _Requirements: 1.2, 5.5, 6.4, 6.1_

  - [x] 2.2 Implement local storage adapter with session expiry and error handling
    - Create `frontend/src/lib/storage.ts` with `saveSession`, `loadSession`, `clearSession` functions; wrap all calls in try/catch; expose `storageUnavailable` boolean; enforce 7-day expiry on load using `savedAt` timestamp
    - Wire Zustand store to call `saveSession` on every state mutation via `subscribe`
    - _Requirements: 6.1, 6.2, 6.3, 6.6_

  - [ ]* 2.3 Write property test for session serialization round-trip (Property 11)
    - **Property 11: Session Serialization Round-Trip Preserves All State**
    - **Validates: Requirements 6.3, 8.4**
    - Use fast-check arbitrary to generate random `SessionState` objects; assert deep equality after JSON round-trip
    - Tag: `// Feature: employee-self-evaluation-tool, Property 11`

  - [ ]* 2.4 Write property test for session restore offer based on age (Property 12)
    - **Property 12: Session Restore Offered Iff Session Age Is At Most 7 Days**
    - **Validates: Requirements 6.2**
    - Use fast-check to generate `savedAt` timestamps; verify `loadSession` returns the session only when age ≤ 604,800,000 ms and discards otherwise
    - Tag: `// Feature: employee-self-evaluation-tool, Property 12`

  - [ ]* 2.5 Write property test for session state persistence on every mutation (Property 13)
    - **Property 13: Session State Persisted on Every Input Change**
    - **Validates: Requirements 6.1**
    - Use fast-check to generate arbitrary state mutations; after each action verify `localStorage['ese_session_v1']` reflects updated value
    - Tag: `// Feature: employee-self-evaluation-tool, Property 13`

- [x] 3. Input validation pure-logic utilities
  - [x] 3.1 Implement character count and whitespace validation utilities
    - Create `frontend/src/lib/validation.ts` with: `getCharCount(value: string): number` (returns `value.length`); `isEffectivelyEmpty(value: string): boolean` (returns `true` when `value.trim() === ''`); `isFreeFormInputValid(value: string): boolean` (returns `true` when `!isEffectivelyEmpty` and `getCharCount <= 10000`); `isRevisionInputValid(value: string): boolean` (`getCharCount <= 1000`)
    - _Requirements: 3.2, 3.4, 3.5, 7.2, 7.3, 7.4_

  - [x] 3.2 Implement step-transition guard logic
    - Create `frontend/src/lib/transitions.ts` with: `canAdvanceFromReviewPeriod(state: SessionState): boolean`; `canGenerateWriteUp(state: SessionState): boolean` (reviewPeriod set and freeFormInput valid)
    - _Requirements: 1.4, 3.6_

  - [x] 3.3 Implement word count utility
    - Add `countWords(text: string): number` to `validation.ts` — split on whitespace after trimming, return token count
    - _Requirements: 4.4_

  - [ ]* 3.4 Write property test for character count enforcement (Property 3)
    - **Property 3: Input Character Limit Enforcement**
    - **Validates: Requirements 3.2, 3.4, 7.3**
    - Use fast-check string arbitrary; assert `isFreeFormInputValid` returns `true` iff `0 < length <= 10000` and `!isEffectivelyEmpty`
    - Tag: `// Feature: employee-self-evaluation-tool, Property 3`

  - [ ]* 3.5 Write property test for whitespace-only input treated as empty (Property 4)
    - **Property 4: Whitespace-Only Input Is Treated as Empty**
    - **Validates: Requirements 3.5, 7.4**
    - Use fast-check to generate strings composed only of `\s` characters; assert `isEffectivelyEmpty` returns `true`
    - Tag: `// Feature: employee-self-evaluation-tool, Property 4`

  - [ ]* 3.6 Write property test for live character counter accuracy (Property 7)
    - **Property 7: Live Character Counter Matches Actual Input Length**
    - **Validates: Requirements 3.3, 7.2**
    - Use fast-check to generate arbitrary Unicode strings; assert `getCharCount(s) === s.length`
    - Tag: `// Feature: employee-self-evaluation-tool, Property 7`

  - [ ]* 3.7 Write property test for word count calculation accuracy (Property 15)
    - **Property 15: Word Count Calculation Is Accurate**
    - **Validates: Requirements 4.4**
    - Use fast-check to generate multi-word strings; assert `countWords` equals number of whitespace-delimited tokens
    - Tag: `// Feature: employee-self-evaluation-tool, Property 15`

- [x] 4. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Backend foundation — Express server, LLM adapter, and prompt engine
  - [-] 5.1 Bootstrap Express 5 server with middleware and error handling
    - Create `backend/src/server.ts` with Express app, JSON body parsing, CORS, request-size limits, and a global error handler returning `{ error: string, code: string }` with appropriate HTTP status codes
    - Add `backend/src/index.ts` entry point; configure `nodemon`/`ts-node` for local development
    - _Requirements: 4.6, 5.6, 7.1_

  - [-] 5.2 Implement LLM adapter interface and concrete adapters
    - Define `LLMAdapter` interface in `backend/src/adapters/llmAdapter.ts` with `complete(systemPrompt, userMessage, options?): Promise<string>`
    - Implement `BedrockAdapter` in `backend/src/adapters/bedrockAdapter.ts` using AWS SDK v3 Bedrock Converse API
    - Implement `AzureOpenAIAdapter` in `backend/src/adapters/azureOpenAIAdapter.ts` using the `openai` npm package
    - Export `createAdapter(): LLMAdapter` factory in `backend/src/adapters/index.ts` that reads `LLM_PROVIDER` env var and returns the appropriate adapter
    - _Requirements: 4.1_

  - [-] 5.3 Implement prompt engine with template functions
    - Create `backend/src/prompts/writeUpPrompt.ts` exporting `buildWriteUpSystemPrompt(params)` and `buildWriteUpUserMessage(params)` that embed `reviewPeriod`, all four pillars' `criteriaText`, mid-year/end-of-year framing, formal-voice rules, word-count constraint (150–350 per pillar), and pillar-mapping instruction; wrap all user-supplied text in `<employee_input>` delimiters; truncate to defined maxima before embedding
    - Create `backend/src/prompts/revisePrompt.ts` exporting `buildRevisionSystemPrompt(params)` and `buildRevisionUserMessage(params)` with same formal-voice constraints and pillar-specific criteria
    - _Requirements: 1.3, 2.3, 4.2, 4.3, 4.5_

  - [ ]* 5.4 Write property test for review period framing applied to prompts (Property 1)
    - **Property 1: Review Period Framing Applied to Prompts**
    - **Validates: Requirements 1.3**
    - Use fast-check to generate arbitrary valid prompt params with `reviewPeriod` set to `mid-year` or `end-of-year`; assert each built prompt contains the correct framing string and does NOT contain the other period's framing
    - Tag: `// Feature: employee-self-evaluation-tool, Property 1`

  - [ ]* 5.5 Write property test for all pillar expectations embedded in generation prompt (Property 2)
    - **Property 2: All Pillar Expectations Embedded in Generation Prompt**
    - **Validates: Requirements 2.3, 4.1**
    - Use fast-check to generate arbitrary level expectations objects; assert `buildWriteUpSystemPrompt` contains criteria text for all four pillars
    - Tag: `// Feature: employee-self-evaluation-tool, Property 2`

  - [ ]* 5.6 Write property test for write-up generation prompt formal voice (Property 6)
    - **Property 6: Write-up Generation Prompt Contains Formal Voice Instructions**
    - **Validates: Requirements 4.2**
    - Use fast-check to generate arbitrary write-up params; assert system prompt contains first-person, complete-sentences, formal-vocabulary, and no-contractions instructions
    - Tag: `// Feature: employee-self-evaluation-tool, Property 6`

- [ ] 6. Backend API routes and Zod response validation
  - [~] 6.1 Implement `GET /api/level-expectations/:level/:practice` route
    - Create `backend/src/routes/levelExpectations.ts`; read `level-expectations.json` from disk; validate path params; return `LevelExpectationsFile` JSON or `{ error, code }` with 404 on miss
    - _Requirements: 2.1, 2.2_

  - [~] 6.2 Implement `POST /api/generate-writeup` route with Zod validation
    - Create `backend/src/routes/generateWriteup.ts`; define Zod schema for `GenerateWriteUpRequest` (`freeFormInput` max 10,000 chars, `reviewPeriod` enum, `levelExpectations`); call `buildWriteUpSystemPrompt` + `buildWriteUpUserMessage`; call `adapter.complete()`; parse and validate LLM JSON response with Zod enforcing all four pillar sections present and word counts within 150–350; return `GenerateWriteUpResponse`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [~] 6.3 Implement `POST /api/revise-section` route with Zod validation
    - Create `backend/src/routes/reviseSection.ts`; define Zod schema for `ReviseSectionRequest` (`revisionNote` max 1,000 chars); call `buildRevisionSystemPrompt` + `buildRevisionUserMessage`; call `adapter.complete()` with 30-second timeout; parse and validate response; return `ReviseSectionResponse`
    - _Requirements: 5.3, 5.4, 5.6_

  - [ ]* 6.4 Write property test for write-up response contains all four pillar sections (Property 5)
    - **Property 5: Write-up Contains All Four Pillar Sections**
    - **Validates: Requirements 4.1**
    - Use fast-check to generate arbitrary LLM-like response JSON; assert Zod schema rejects responses missing any pillar and accepts responses with all four
    - Tag: `// Feature: employee-self-evaluation-tool, Property 5`

  - [ ]* 6.5 Write property test for section revision does not affect other sections (Property 8)
    - **Property 8: Section Revision Does Not Affect Other Sections**
    - **Validates: Requirements 5.4**
    - Use fast-check to generate arbitrary write-up states and target one pillar for revision; after calling `updateWriteUpSection`, assert all other sections' `currentText` values are unchanged
    - Tag: `// Feature: employee-self-evaluation-tool, Property 8`

  - [ ]* 6.6 Write property test for revert restores previous section text (Property 9)
    - **Property 9: Revert Restores Previous Section Text**
    - **Validates: Requirements 5.5**
    - Use fast-check to generate arbitrary sections with `previousText`; after calling `revertWriteUpSection`, assert `currentText` equals the value that was `currentText` before the last regeneration
    - Tag: `// Feature: employee-self-evaluation-tool, Property 9`

  - [ ]* 6.7 Write property test for revision field 1,000-character limit (Property 10)
    - **Property 10: Revision Field Enforces 1,000-Character Limit**
    - **Validates: Requirements 5.3**
    - Use fast-check to generate arbitrary strings; assert `isRevisionInputValid` returns `true` iff `length <= 1000`
    - Tag: `// Feature: employee-self-evaluation-tool, Property 10`

- [~] 7. Checkpoint — Ensure all backend tests pass
  - Ensure all backend unit and property tests pass, ask the user if questions arise.

- [ ] 8. Frontend app shell, routing, and session gate
  - [~] 8.1 Build `AppShell` layout component
    - Create `frontend/src/components/AppShell.tsx` with persistent header (review-period badge, start-over button), `ProgressBar`, and `<main>` content slot
    - Render `storageUnavailable` warning banner when storage adapter flag is set
    - _Requirements: 1.2, 6.6, 8.3_

  - [~] 8.2 Build `ProgressBar` component
    - Create `frontend/src/components/ProgressBar.tsx`; accept `currentStep: WorkflowStep`; display step names ("Input" / "Write-up") with filled/unfilled segment indicators; update on every step change
    - _Requirements: 8.3_

  - [~] 8.3 Build `SessionGate` with restore/new-session dialog
    - Create `frontend/src/components/SessionGate.tsx`; on mount check for saved session via `loadSession`; if found and ≤ 7 days old, render `RestoreSessionDialog` (Radix UI Dialog); if corrupt, render warning with "Start Fresh" option
    - Wire to Zustand `clearSession` (new session) and full state hydration (restore)
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

  - [~] 8.4 Build `StepRouter` component
    - Create `frontend/src/components/StepRouter.tsx`; read `currentStep` from Zustand store; render the matching step component (`ReviewPeriodStep`, `FreeFormInputStep`, `WriteUpStep`); guard step transitions using utilities from Task 3.2
    - _Requirements: 1.4, 3.6_

  - [ ]* 8.5 Write property test for progress indicator reflects current step (Property 14)
    - **Property 14: Progress Indicator Reflects Current Step**
    - **Validates: Requirements 8.3**
    - Use fast-check to generate all valid `WorkflowStep` values; render `ProgressBar` in RTL; assert displayed label matches expected step
    - Tag: `// Feature: employee-self-evaluation-tool, Property 14`

- [ ] 9. Step 1 — Review Period Selection
  - [~] 9.1 Build `ReviewPeriodStep` component
    - Create `frontend/src/steps/ReviewPeriodStep.tsx`; render two Radix UI `ToggleGroup` items ("Mid-Year" / "End-of-Year"); disable "Continue" button until a selection is made; on confirm call `setReviewPeriod` and `setCurrentStep('free-form-input')`; show inline message if user attempts to advance without a selection
    - _Requirements: 1.1, 1.2, 1.4_

  - [ ]* 9.2 Write unit tests for `ReviewPeriodStep` navigation guard
    - Test that "Continue" is disabled with no selection, enabled after selection, and calls store actions on confirm
    - _Requirements: 1.4_

- [ ] 10. Step 2 — Free-form Input
  - [~] 10.1 Build `FreeFormTextArea` with live character counter and validation
    - Create `frontend/src/components/FreeFormTextArea.tsx` and `CharacterCounter.tsx`; bind to React Hook Form; call `getCharCount` and `isEffectivelyEmpty` from Task 3.1 on every keystroke; counter turns red at ≥ 10,000 chars; dispatch `setFreeFormInput` on change
    - _Requirements: 3.2, 3.3, 3.4, 7.2, 7.3_

  - [~] 10.2 Build `FreeFormInputStep` composing textarea and generate button
    - Create `frontend/src/steps/FreeFormInputStep.tsx`; compose `FreeFormTextArea` and `CharacterCounter`; show helper text explaining the system will map input to evaluation pillars; enable "Generate Write-up" button only when `canGenerateWriteUp` is true; on click call write-up generation API and transition to `write-up` step; show loading spinner during generation; show error with retry on failure
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 4.6_

  - [ ]* 10.3 Write unit tests for `FreeFormInputStep` generate button guard
    - Test that "Generate Write-up" is disabled when input is empty or whitespace-only, enabled with valid input, and shows loading state during generation
    - _Requirements: 3.6_

- [ ] 11. Write-up generation API integration
  - [~] 11.1 Implement React Query hook for write-up generation
    - Create `frontend/src/hooks/useGenerateWriteUp.ts`; call `POST /api/generate-writeup` with `freeFormInput`, `reviewPeriod`, and `levelExpectations`; on success dispatch `setWriteUp`; on error surface descriptive error state; include 3-attempt exponential back-off
    - _Requirements: 4.1, 4.6_

  - [~] 11.2 Implement React Query hook for section revision
    - Create `frontend/src/hooks/useReviseSection.ts`; call `POST /api/revise-section` with 30-second timeout guard; on success dispatch `updateWriteUpSection` (storing `previousText` before updating `currentText`); on error preserve current section and surface error state
    - _Requirements: 5.3, 5.4, 5.6_

- [ ] 12. Step 3 — Write-up Review (one pillar at a time)
  - [~] 12.1 Build `RevisionInput` component with character limit
    - Create `frontend/src/components/RevisionInput.tsx`; textarea bound to React Hook Form; validate `isRevisionInputValid` (max 1,000 chars); display live character counter; disable "Regenerate Section" button when field is empty or over limit; label as "Add more information or request changes"
    - _Requirements: 5.3_

  - [~] 12.2 Build `PillarSectionCard` with inline revision and revert controls
    - Create `frontend/src/components/PillarSectionCard.tsx`; display pillar label and current write-up text; embed `RevisionInput`; show "Regenerate Section" button with inline spinner during regeneration; render "Revert to previous" button only when `previousText !== null`; "Revert" dispatches `revertWriteUpSection`; show inline error alert on regeneration failure with "Retry" option
    - _Requirements: 5.1, 5.3, 5.4, 5.5, 5.6_

  - [~] 12.3 Build `PillarSectionNav` navigation component
    - Create `frontend/src/components/PillarSectionNav.tsx`; display "Pillar X of 4: [Pillar Name]" header; render "← Previous" and "Next: [Pillar Name] →" buttons; dispatch `setActivePillarIndex` on navigation; disable Previous on first pillar, replace Next with finish indicator on last pillar
    - _Requirements: 5.1, 5.2_

  - [~] 12.4 Build `CopyDownloadBar` component
    - Create `frontend/src/components/CopyDownloadBar.tsx`; "Copy to Clipboard" uses `navigator.clipboard.writeText` with all four pillar section texts concatenated as plain text; "Download" creates a `.txt` Blob URL and triggers anchor download
    - _Requirements: 5.7_

  - [~] 12.5 Build `WriteUpStep` composing all write-up sub-components
    - Create `frontend/src/steps/WriteUpStep.tsx`; render full-screen loading state while generation is in progress; render full-screen error with "Retry" on generation failure; once loaded render `CopyDownloadBar` at top, `PillarSectionNav`, and `PillarSectionCard` for the active pillar (read `activePillarIndex` from store)
    - _Requirements: 5.1, 5.2, 5.7, 4.6_

  - [ ]* 12.6 Write property test for section revision does not affect other sections (Property 8)
    - **Property 8: Section Revision Does Not Affect Other Sections**
    - **Validates: Requirements 5.4**
    - Use fast-check to generate arbitrary write-up states and target one pillar for revision; after calling `updateWriteUpSection`, assert all other sections' `currentText` values are unchanged
    - Tag: `// Feature: employee-self-evaluation-tool, Property 8`

  - [ ]* 12.7 Write property test for revert restores previous section text (Property 9)
    - **Property 9: Revert Restores Previous Section Text**
    - **Validates: Requirements 5.5**
    - Use fast-check to generate arbitrary sections with `previousText`; after calling `revertWriteUpSection`, assert `currentText` equals the value that was `currentText` before the last regeneration
    - Tag: `// Feature: employee-self-evaluation-tool, Property 9`

  - [ ]* 12.8 Write property test for revision field 1,000-character limit (Property 10)
    - **Property 10: Revision Field Enforces 1,000-Character Limit**
    - **Validates: Requirements 5.3**
    - Use fast-check to generate arbitrary strings; render `RevisionInput` in RTL; assert "Regenerate Section" is enabled iff `length <= 1000` and field is non-empty
    - Tag: `// Feature: employee-self-evaluation-tool, Property 10`

- [~] 13. Checkpoint — Ensure all tests pass
  - Ensure all frontend and backend tests pass, ask the user if questions arise.

- [ ] 14. Accessibility, error boundaries, and integration wiring
  - [~] 14.1 Add axe-core accessibility tests for all step components
    - Integrate `@axe-core/react` (or `vitest-axe`) into Vitest/RTL test setup; add axe assertion to each step component test; ensure all `aria-live="polite"` regions are present on error states; verify keyboard tab order and focus management in dialogs
    - _Requirements: 8.1_

  - [~] 14.2 Wire LevelExpectations React context and API fallback
    - Create `frontend/src/context/LevelExpectationsContext.tsx`; load from bundled JSON on app init; implement React Query `useQuery` for `GET /api/level-expectations/sr-principal/client-delivery` as a fallback; handle load failure per error table (show retry/proceed-without option)
    - _Requirements: 2.1, 2.2_

  - [~] 14.3 Implement "Start Over" confirmation flow
    - Add `StartOverButton` to `AppShell`; on click show Radix UI `AlertDialog` explaining data will be deleted; if write-up exists show additional warning; on confirm call `clearSession` and `localStorage.removeItem('ese_session_v1')` then reset step to `review-period-selection`
    - _Requirements: 6.4, 6.5_

  - [~] 14.4 Add global React error boundary and network retry configuration
    - Create `frontend/src/components/ErrorBoundary.tsx` wrapping the app; configure React Query `QueryClient` with `retry: 3` and exponential back-off; add `aria-live="assertive"` region for critical errors
    - _Requirements: 7.1, 8.4_

  - [ ]* 14.5 Write integration tests for critical session flows
    - Test: review period selection blocks navigation when unset; session restore reconstructs all state from serialized JSON; start-over clears session and resets to step 1; free-form input gates write-up generation correctly
    - _Requirements: 1.4, 6.2, 6.4_

- [ ] 15. End-to-end Playwright tests for happy-path flows
  - [~] 15.1 Write Playwright happy-path E2E test
    - In `e2e/happyPath.spec.ts`: full session from review period selection → free-form input → generate → navigate all 4 pillar sections → revise one section → copy and download; assert final write-up is present and download link fires
    - _Requirements: 4.1, 5.7_

  - [ ]* 15.2 Write Playwright E2E test for session restore
    - Simulate page refresh mid-session via Playwright `page.reload()`; assert restore dialog appears and all inputs are correctly restored
    - _Requirements: 6.2, 6.3_

  - [ ]* 15.3 Write Playwright E2E test for storage-unavailable scenario
    - Use Playwright storage state manipulation to simulate `localStorage` unavailability; assert persistent warning banner is displayed and app remains functional in-memory
    - _Requirements: 6.6_

- [~] 16. Final checkpoint — Ensure all tests pass and feature is fully wired
  - Ensure all unit, property, integration, and E2E tests pass. Verify the full 3-step flow works end-to-end. Ask the user if questions arise.

---
