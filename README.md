# Employee Self-Evaluation Tool

This repository contains the V1 prototype for an employee self-evaluation experience focused on evidence-first drafting, pillar mapping, targeted follow-up prompts, and refined narrative output.

The app is built with Next.js, TypeScript, Tailwind CSS, Radix-compatible UI primitives, and Framer Motion.

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` starts the local development server
- `npm run lint` runs ESLint
- `npm run build` creates a production build
- `npm run start` runs the production server after build

## Project Structure

- `app/` contains the Next.js App Router entry points
- `components/` contains reusable UI and feature components
- `lib/` contains shared utilities
- `styles/` contains shared design tokens
- `context/` contains product, design, and planning reference documents

## Current Build Scope

- Evidence-first draft workspace
- Pillar coverage guidance rail
- Targeted follow-up prompt UI
- Refined narrative preview UI
- Local prototype styling based on the Slalom-aligned design system

## Reference Docs

- `context/PRD-v1-polished.md`
- `context/user-flow-reference.md`
- `context/design-system-reference.md`
- `context/build-task-list.md`

## Notes

The current homepage is the first in-app translation of the approved visual mockup from `design-mockup.html`. It is intentionally focused on the core writing workspace before AI orchestration and persistence are wired up.
