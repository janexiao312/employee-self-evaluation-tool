# Employee Self-Evaluation Tool Design System Reference

## Purpose
This document defines the V1 design system for the Employee Self-Evaluation Tool. It should guide visual design, UI implementation, and future refinements so the product feels intuitive, modern, and aligned with Slalom's visual language.

## Design Direction
The product should feel like a modern advisory workspace, not a generic HR form.

Key qualities:
- Intuitive: the interface should make the next action obvious at every step.
- Modern: clean structure, strong typography, spacious layout, and restrained motion.
- Human: the experience should feel supportive and editorial rather than mechanical.
- Confident: use Slalom-inspired color with enough contrast and focus to signal expertise.
- Bright: default to a light theme with bold accents rather than a dark-heavy UI.

## Brand Interpretation
The live Slalom site uses a crisp, high-contrast palette built around electric blue, deep navy, and energetic accent colors including lime, cyan, lilac, and coral. Typography relies on Slalom Sans, with Noto Sans and Lora also present in production CSS.

For this product, the visual system should use:
- Blue for primary action and structural emphasis
- Navy for authority, framing, and dense content zones
- Lime for progress, guidance, and positive coverage cues
- Coral for warnings, weak coverage, or destructive actions
- Cyan and lilac as secondary accents only

## Core Design Principles
### 1. Evidence First
The writing surface is the center of the product. Do not bury it inside cards, tabs, or dense chrome.

### 2. Guidance Over Control
Weak areas should be highlighted with helpful prompts, not rigid blocking states.

### 3. Editorial Clarity
The experience should read like a polished writing environment. Use strong hierarchy, readable line lengths, and obvious section transitions.

### 4. Visible Progress
Each AI step should make the user feel more organized and more complete than the previous state.

### 5. Restraint
Avoid over-decorating. One strong palette, one strong type system, and purposeful motion are enough.

## Design Tokens
These tokens are derived from the live Slalom site CSS and normalized for product use.

### Color Tokens
```css
:root {
  --color-brand-blue-500: #0C62FB;
  --color-brand-blue-600: #0A4EC9;
  --color-brand-blue-300: #6DA1FD;
  --color-brand-navy-900: #000A25;
  --color-brand-navy-800: #0F1C41;
  --color-brand-navy-700: #002FAF;
  --color-accent-lime-500: #DEFF4D;
  --color-accent-lime-600: #ABD904;
  --color-accent-cyan-500: #1BE1F2;
  --color-accent-lilac-500: #C7B9FF;
  --color-accent-coral-500: #FF4D5F;
  --color-accent-coral-300: #FF7987;
  --color-text-primary: #292929;
  --color-text-muted: #707070;
  --color-border-subtle: #D6D6D6;
  --color-surface-muted: #F5F5F5;
  --color-surface-base: #FFFFFF;
}
```

### Semantic Color Use
- Primary action: `--color-brand-blue-500`
- Primary action hover: `--color-brand-blue-600`
- App shell / dark panels: `--color-brand-navy-900`
- Secondary structural surfaces: `--color-brand-navy-800`
- Positive guidance / completion / strong evidence: `--color-accent-lime-500`
- Informational highlight / AI analysis accents: `--color-accent-cyan-500`
- Secondary data accents / decorative tags: `--color-accent-lilac-500`
- Warning / weak evidence / delete actions: `--color-accent-coral-500`
- Main body text: `--color-text-primary`
- Subdued labels / metadata: `--color-text-muted`
- Canvas background: `--color-surface-base`
- Secondary background cards: `--color-surface-muted`

### Accessibility Guidance
- Use navy or white behind bright accent colors to preserve contrast.
- Avoid using lime for body text on white.
- Reserve coral for focused moments so alerts remain meaningful.
- Maintain clear non-color cues for strength, weakness, and completion states.

## Typography
### Font Stack
- Primary UI font: Slalom Sans
- Fallback UI font: Noto Sans, system sans-serif
- Optional editorial accent for select pull-quotes or empty-state messages: Lora

### Font Guidance
- Headings should feel assertive and compact.
- Body copy should prioritize readability over brand flourish.
- Avoid oversized marketing-style typography in the main workflow.

### Suggested Scale
```css
:root {
  --font-family-sans: "Slalom Sans", "Noto Sans", sans-serif;
  --font-family-serif: "Lora", serif;

  --font-size-hero: 3rem;
  --font-size-h1: 2.25rem;
  --font-size-h2: 1.75rem;
  --font-size-h3: 1.25rem;
  --font-size-body-lg: 1.125rem;
  --font-size-body: 1rem;
  --font-size-body-sm: 0.875rem;
  --font-size-caption: 0.75rem;

  --line-height-tight: 1.1;
  --line-height-heading: 1.2;
  --line-height-body: 1.6;
}
```

### Weight Guidance
- 700: primary headings and section titles
- 500 to 600: labels, tabs, button text
- 400: body copy, helper copy, editable content

## Spacing and Layout
### Layout System
- Use a spacious desktop layout with a primary writing canvas and a secondary guidance rail.
- Keep the main content width readable, ideally around 720px to 840px for long-form text.
- On large screens, use a split workspace rather than stacking everything into one long page.
- On mobile, collapse the guidance rail into step-based panels or drawers.

### Spacing Tokens
```css
:root {
  --space-2: 0.125rem;
  --space-4: 0.25rem;
  --space-8: 0.5rem;
  --space-12: 0.75rem;
  --space-16: 1rem;
  --space-24: 1.5rem;
  --space-32: 2rem;
  --space-48: 3rem;
  --space-64: 4rem;
}
```

### Radius and Elevation
```css
:root {
  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.25rem;
  --radius-xl: 1.75rem;

  --shadow-sm: 0 2px 8px rgba(0, 10, 37, 0.06);
  --shadow-md: 0 10px 30px rgba(0, 10, 37, 0.10);
  --shadow-lg: 0 20px 60px rgba(0, 10, 37, 0.14);
}
```

Guidance:
- Prefer soft corners and light elevation.
- Avoid heavy neumorphism or dense card stacking.

## Motion
Motion should communicate state change, not decorate everything.

Use motion for:
- Initial reveal of the workspace
- Transition from draft to AI analysis state
- Staggered entrance of follow-up questions
- Save-state confirmation

Motion rules:
- Duration: 160ms to 280ms for most UI transitions
- Easing: standard ease-out for entry, ease-in-out for layout shifts
- Keep motion subtle around writing surfaces to avoid distraction

## Component Guidance
### App Shell
- Use a bright base canvas with a slim dark header or a navy top rail.
- Keep global navigation minimal.
- Show review cycle, save status, and account/settings in predictable positions.

### Buttons
- Primary button: blue fill, white text, medium radius
- Secondary button: white or muted surface with navy text and subtle border
- Tertiary button: text-first with hover underline or tint
- Destructive button: coral-accented treatment, used sparingly

### Text Inputs and Editor
- The main draft editor should feel generous and calm.
- Use a white writing surface with subtle border and strong focus state.
- Placeholder copy should teach the user what kind of evidence to provide.
- Avoid overly decorative input borders.

### Cards and Panels
- Use cards only where separation helps cognition.
- Coverage panels should be concise and highly scannable.
- Follow-up questions should feel like coaching prompts, not error messages.

### Coverage Indicators
- Strong coverage: navy text plus lime accent indicator
- Partial coverage: navy text plus cyan or blue indicator
- Weak coverage: coral indicator with plain-language explanation
- Do not rely on red/green alone

### Tags and Badges
- Use badges for pillars, save state, and AI-generated labels.
- Keep them flat or lightly tinted rather than glossy.

### Empty States
- Empty states should reduce anxiety.
- Use concise prompts, example starters, and one clear primary action.
- A subtle editorial illustration or abstract accent block is acceptable, but do not overpower the writing task.

## Product-Specific UI Pattern
### Recommended Workspace Layout
- Left or center: primary writing / output canvas
- Right rail: pillar coverage, follow-up prompts, AI actions
- Top area: cycle label, save status, progress cue, primary action

This product should feel like a structured writing studio.

### Stage Treatments
#### Draft Stage
- Clean white editor with muted scaffolding copy
- Minimal distractions

#### Analysis Stage
- Introduce more brand color through highlighted pillar mapping and progress cues
- Use cyan and lime to show helpful activity and insight

#### Refinement Stage
- Make comparison and revision feel easy
- Keep user-edited and AI-improved content visually compatible

#### Final Review Stage
- Reduce surrounding chrome
- Make the output feel polished and presentation-ready

## Content Design Guidance
- Use plain, professional language.
- Avoid HR jargon where possible.
- Frame AI prompts as supportive coaching.
- Keep system feedback concise and specific.
- Prefer verbs that imply forward motion: refine, strengthen, clarify, expand, polish.

## Example Tone For UI Copy
- "Start with what you accomplished this quarter. Include outcomes, impact, and moments where you led, learned, or created value."
- "Your draft strongly supports Delivery Exceptionally. Lead and Grow Slalom could use more evidence."
- "Add one example of how you influenced others or helped shape direction."
- "This version is organized by pillar and ready for your final edits."

## Implementation Notes
- Default stack assumption: Next.js, Tailwind, and shadcn/ui or Radix-based primitives.
- Define the palette as CSS variables at the app root.
- Build a light theme first.
- If Slalom Sans cannot be used directly in the app environment, fall back to Noto Sans while preserving the same hierarchy and spacing.
- Keep semantic tokens separate from raw brand tokens so the product can evolve without rewriting component styles.

## Initial Semantic Token Example
```css
:root {
  --background: var(--color-surface-base);
  --foreground: var(--color-text-primary);
  --card: var(--color-surface-base);
  --card-muted: var(--color-surface-muted);
  --border: var(--color-border-subtle);
  --primary: var(--color-brand-blue-500);
  --primary-hover: var(--color-brand-blue-600);
  --primary-foreground: #FFFFFF;
  --accent: var(--color-accent-cyan-500);
  --success: var(--color-accent-lime-500);
  --warning: var(--color-accent-coral-500);
  --shell: var(--color-brand-navy-900);
}
```

## Do Not Do
- Do not make this look like a generic enterprise dashboard.
- Do not default to purple-heavy AI visuals.
- Do not force the user through cramped multi-step forms before they can write.
- Do not overload the interface with status chips, borders, and nested cards.
- Do not let bright accents compete with the writing surface.

## Source Note
Color and typography cues in this document were derived from the live Slalom website and its production CSS at the time of writing, including repeated site colors such as `#0C62FB`, `#DEFF4D`, `#1BE1F2`, `#C7B9FF`, `#FF4D5F`, `#000A25`, and the `Slalom Sans` font family.