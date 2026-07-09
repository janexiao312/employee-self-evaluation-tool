# Employee Self-Evaluation Tool User Flow Reference

## Purpose
This document captures the intended V1 user flow so it can guide product, design, and implementation decisions during the initial build.

## Experience Principle
The experience is evidence-first, not form-first. Users should start by writing their story in free form, then receive AI help to structure, strengthen, and refine that narrative into pillar-aligned self-evaluation copy.

## Primary User
- Individual contributor completing a quarterly self-reflection

## Core User Flow
1. The user starts or resumes a review session for the current cycle.
2. The user enters a free-form narrative describing accomplishments, outcomes, impact, leadership moments, growth, and supporting examples.
3. The system auto-saves progress and also offers a manual save control.
4. The user requests an AI analysis pass.
5. The system maps evidence to the role pillars:
   - Delivery Exceptionally
   - Grow Expertise
   - Grow Slalom
   - Lead
6. The system identifies weak, missing, or low-confidence coverage areas.
7. The system asks short, targeted follow-up questions for those gaps.
8. The user answers those questions inline and/or edits the source narrative directly.
9. The system regenerates a pillar-organized narrative-only self-evaluation draft.
10. The user edits the generated narrative in-app.
11. The user optionally requests another refinement pass.
12. The user copies the final narrative to the clipboard for submission in a separate system.
13. The system retains saved content until the user chooses to delete all data.

## What The User Should Feel
- Low friction at the start
- Clear progress after the first AI pass
- Helpful coaching instead of rigid compliance
- Fast iteration between input, guidance, and improved output
- Confidence that the final result is copy-ready

## Screen Model
### 1. Session Entry
- Start new review or resume saved draft
- Show review cycle context

### 2. Draft Workspace
- Large free-form writing area
- Save status indicator
- Manual save action
- Analyze / generate action

### 3. Coverage Review
- Pillar-level coverage summary
- Strong versus weak support signals
- Optional explanation of what evidence mapped where

### 4. Follow-Up Guidance
- Short targeted questions for thin areas
- Inline response inputs
- Ability to continue editing the original narrative

### 5. Generated Narrative View
- Narrative organized by pillar
- Fully editable text
- Refinement action for another AI pass

### 6. Final Review
- Final polish pass by the user
- Copy-to-clipboard action
- Delete-all-data control available in settings or session controls

## Flow Notes
- The tool should not force the user into a pillar-by-pillar form before they have written their evidence.
- Weak coverage should create soft prompts, not a hard block.
- The product should behave like a writing coach, not a scoring system.
- V1 output is narrative only, with no ratings.
- V1 does not need downstream integrations beyond clipboard copy.

## Design Implications
- Prioritize a strong empty state that helps users begin writing quickly.
- Make the first AI response visibly useful by showing structure and coverage gaps.
- Keep revision loops fast and legible.
- Preserve user control by allowing direct editing at each stage.
- Keep persistence simple and trustworthy.

## Suggested Build Order
1. Draft editor with local persistence
2. Mock pillar-mapping and coverage UI
3. Follow-up question loop
4. Generated narrative editor
5. Copy-to-clipboard and delete-all-data controls
6. Real AI integration and prompt refinement