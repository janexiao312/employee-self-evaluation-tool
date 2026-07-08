# Employee Self-Evaluation Tool PRD (V1 Draft)

## Product Overview
The Employee Self-Evaluation Tool helps individual contributors produce high-quality self-reflection narratives aligned to role expectation pillars.

V1 is designed to reduce effort and increase quality by allowing users to draft freely, then using guided AI support to map evidence to pillars, identify coverage gaps, and improve the final narrative.

## Problem Statement
ICs often struggle to convert scattered accomplishments into clear, pillar-aligned self-evaluations. This leads to inconsistent quality, missing evidence, and extra time spent rewriting.

## V1 Objectives
- Enable ICs to write a free-form self-review and receive pillar-organized narrative output.
- Map user evidence to role expectations automatically.
- Prompt for missing or weak evidence with targeted follow-up questions.
- Provide editable, iterative refinement support before final copy.
- Deliver copy-ready output suitable for self-reflection submission workflows.

## Non-Objectives (V1)
- Numeric scoring or ratings.
- Manager or People Ops user workflows.
- HRIS or performance-system integrations.
- File export formats beyond clipboard copy.

## Users and Scope
- Primary user: Individual Contributor (IC)
- In-scope roles for initial framework: Senior Principal in Client Delivery
- User scope: IC-only in V1

## Success Criteria (Initial)
- IC can complete a draft and generate pillar-organized narrative in a single session.
- IC can improve weak sections through targeted follow-up prompts.
- IC can edit and refine output iteratively in-app.
- IC can copy final narrative to clipboard for downstream self-reflection use.

## Core Experience
1. IC enters free-form self-review evidence narrative.
2. System maps content to pillars and capabilities.
3. System detects weak or missing support areas.
4. System asks short targeted follow-up questions.
5. IC answers prompts and/or edits content directly.
6. System regenerates and refines pillar-organized narrative.
7. IC manually or automatically saves progress.
8. IC copies final output to clipboard.

## Functional Requirements
### Input and Drafting
- Support free-form narrative entry (not pillar-by-pillar forms).
- Persist draft state with auto-save.
- Provide manual save action.

### AI Mapping and Analysis
- Map narrative content to relevant pillars/capabilities from the role framework.
- Detect low-confidence or weakly supported pillar coverage.
- Surface soft prompts only (no hard block) when evidence is weak.

### Follow-Up Guidance
- Generate short targeted questions for missing/weak areas.
- Allow user to answer prompts inline and continue refinement.

### Narrative Generation
- Produce narrative-only output (no ratings) organized by pillar.
- Keep generated output editable in-app.
- Support additional agentic refinement passes after user edits.

### Output
- Provide copy-to-clipboard for final narrative.
- No download/export integrations in V1.

### Data Lifecycle and Privacy
- Keep drafts and narratives until user deletes.
- Provide one-click "Delete all my data" control.

## Non-Functional Requirements (V1)
- Reliability: Auto-save should be resilient to accidental navigation or refresh.
- Usability: Prompting and refinement flow should be understandable without training.
- Privacy: User-controlled deletion of all stored content.
- Performance: Mapping, prompting, and generation should feel responsive for typical self-review length.

## Source Role Expectation Framework
Role: Senior Principal in Client Delivery

Pillars:
- Delivery Exceptionally
- Grow Expertise
- Grow Slalom
- Lead

Capability detail and expectation statements are captured in the working source document used during requirements gathering.

## Confirmed Product Decisions
- Quarterly cadence
- Narrative-only assessment mode
- Output is copy-ready self-reflection text
- Output organized by pillar
- Evidence-first workflow
- Free-form evidence input with automatic mapping to pillar/capability
- Targeted follow-up questions for weak evidence areas
- IC-only V1 scope
- Editable narrative plus iterative agentic refinement
- Auto-save plus manual save
- Copy-to-clipboard only
- Soft prompts for weak evidence (user can still finalize)
- Data retained until user deletion
- One-click delete-all-data control

## Open Items for Next Pass
- Privacy/legal/security constraints and guardrails
- Exact prompt strategy for initial free-form input
- Quality rubric for "good narrative" output acceptance
- Submission endpoint expectations outside V1 (where copied output goes)
- Future manager and People Ops workflow design (post-V1)
