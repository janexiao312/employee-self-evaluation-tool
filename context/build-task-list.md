# Employee Self-Evaluation Tool Build Task List

## Purpose
This document is the working implementation checklist for building the V1 application. It translates the PRD, user flow, design system, and mockup into concrete build tasks.

## Current Reference Docs
- PRD: `context/PRD-v1-polished.md`
- Role detail: `context/PRD-raw-source.md`
- User flow: `context/user-flow-reference.md`
- Design system: `context/design-system-reference.md`
- Mockup: `design-mockup.html`
- Tech assumptions: `context/tech-stack-poc.md`

## Recommended Build Sequence
1. Project setup and tooling
2. Core app shell and design tokens
3. Drafting workspace
4. Coverage analysis and follow-up UI with mocked data
5. Narrative output and refinement loop
6. Local persistence and delete-all-data flow
7. Real AI integration
8. Polish, QA, and deployment

## Phase 1: Project Setup
- [x] Initialize the app with Next.js and TypeScript
- [x] Add Tailwind CSS
- [x] Add UI primitives strategy: shadcn/ui or Radix-based components
- [x] Add form and validation support: React Hook Form + Zod
- [x] Add motion library: Framer Motion
- [x] Set up base app structure for `app/`, `components/`, `lib/`, and `styles/`
- [x] Add a clean linting and formatting baseline
- [x] Add a README with local run instructions

## Phase 2: Foundation and Theme
- [x] Implement CSS variables or Tailwind theme tokens from the design system
- [x] Set up typography stack and fallbacks
- [x] Create reusable spacing, radius, shadow, and semantic color tokens
- [x] Build the base app shell
- [x] Build reusable button, badge, panel, and input styles
- [x] Add responsive layout rules for desktop and mobile
- [x] Recreate the look and feel of the mockup inside the app shell

## Phase 3: Core Screens
### Session Entry
- [ ] Build a landing or session entry screen
- [ ] Show review cycle context
- [ ] Add actions for start new draft and resume saved draft

### Draft Workspace
- [x] Build the main free-form writing editor view
- [x] Add contextual helper copy and starter prompts
- [x] Show save state in the workspace header
- [x] Add manual save action
- [x] Add primary action for analyze or generate

### Guidance Rail
- [x] Add pillar coverage summary panel
- [x] Add targeted follow-up question panel
- [x] Add refined narrative preview panel

## Phase 4: Mocked Product Logic
- [x] Create mocked pillar framework data for the Senior Principal in Client Delivery role
- [x] Create mocked draft input data for local development
- [x] Build a temporary coverage analysis function using deterministic mocked rules
- [x] Map draft content into the four main pillars
- [x] Display strong, partial, and weak coverage states
- [x] Generate mocked follow-up questions for weak areas
- [x] Simulate a refined narrative output from the draft plus follow-up responses

## Phase 5: Editing and Refinement Flow
- [ ] Allow the user to answer follow-up prompts inline
- [ ] Allow the user to inject prompt answers back into the source draft
- [ ] Add the ability to switch between draft, analysis, and refined views
- [ ] Keep generated narrative editable in-app
- [ ] Add a refinement action that reruns the mocked transformation
- [ ] Add copy-to-clipboard for the final narrative

## Phase 6: Persistence
- [ ] Implement local persistence with `localStorage` or IndexedDB
- [ ] Auto-save draft content
- [ ] Auto-save follow-up answers
- [ ] Auto-save generated narrative state
- [ ] Restore the most recent session on reload
- [ ] Add manual save feedback state
- [ ] Add one-click delete-all-data control
- [ ] Add confirmation flow for destructive delete action

## Phase 7: AI Integration
- [ ] Define prompt inputs for free-form draft analysis
- [ ] Define output shape for pillar mapping, coverage flags, follow-up questions, and refined narrative
- [ ] Add a server route or server action for AI orchestration
- [ ] Replace mocked analysis with real AI-backed analysis
- [ ] Replace mocked follow-up prompts with model-generated prompts
- [ ] Replace mocked refined narrative with model-generated output
- [ ] Add loading, retry, and graceful failure states
- [ ] Add basic logging or debug visibility for prompt and response issues

## Phase 8: UX Polish
- [ ] Add subtle motion for panel reveals, state transitions, and save confirmations
- [ ] Improve empty states and helper content
- [ ] Improve mobile behavior for the guidance rail
- [ ] Tune writing width, spacing, and readability in long-form editing states
- [ ] Add accessibility checks for color contrast, focus states, and keyboard use
- [ ] Review tone and clarity of all interface copy

## Phase 9: QA and Launch Prep
- [ ] Test the core flow end to end with mocked data
- [ ] Test the core flow end to end with live AI integration
- [ ] Validate local persistence across refreshes
- [ ] Validate delete-all-data behavior
- [ ] Validate copy-to-clipboard behavior
- [ ] Validate responsive layouts
- [ ] Add a lightweight analytics plan if needed
- [ ] Prepare Vercel deployment configuration

## Suggested Initial Milestone
The first meaningful milestone should be:
- A working Next.js app
- The mockup translated into real components
- A draft editor with local persistence
- A right rail with mocked coverage and follow-up prompts
- A mocked refined narrative preview

## Suggested Working Order For Us
1. Scaffold the Next.js app and base folders.
2. Port the design mockup into the real app shell.
3. Build the draft editor and right rail layout.
4. Add mocked pillar coverage and follow-up question logic.
5. Add persistence.
6. Add the refined narrative workflow.
7. Replace mocks with AI.

## Open Decisions To Resolve During Build
- [ ] Whether to use plain local state only or introduce Zustand early
- [ ] Whether persistence should start with `localStorage` or IndexedDB
- [ ] Whether the first app version should support multiple saved review sessions
- [ ] Whether the refined narrative should appear side-by-side with the draft or as a separate view
- [ ] Whether AI calls should use OpenAI directly or Azure OpenAI
- [ ] Whether Slalom Sans can be used directly in the shipped prototype