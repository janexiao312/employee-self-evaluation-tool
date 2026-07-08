# POC Tech Stack Decision

## Context
This project is a solo-built POC for an employee self-evaluation tool. The goal is to move quickly, keep the UI polished, and avoid unnecessary infrastructure while the product shape is still evolving.

## Recommended Stack
- Frontend/app framework: Next.js with TypeScript
- Styling: Tailwind CSS
- UI primitives: shadcn/ui or Radix UI
- Motion: Framer Motion
- Forms and validation: React Hook Form + Zod
- Local state: React state first, Zustand only if state grows
- Persistence for POC: localStorage or IndexedDB
- AI integration: Next.js route handlers or server actions calling OpenAI or Azure OpenAI
- Deployment: Vercel
- Optional later backend storage: Supabase Postgres

## Why This Stack
- Single codebase keeps iteration fast.
- Next.js is strong for a product that mixes UI and AI orchestration.
- Tailwind and shadcn/ui make it easy to produce a polished interface quickly.
- Local-first persistence avoids early auth and database complexity.
- The architecture can grow into a more durable app later without a rewrite.

## POC Guidance
- Start with mocked role framework data.
- Build the core flow before adding auth or a database.
- Add AI calls only after the interaction model feels right.
- Move to Supabase only if you need durable saved sessions or multi-device persistence.

## Current Default
If nothing else changes, assume:
- Next.js app
- Tailwind + shadcn/ui
- Vercel deployment
- Local persistence first
- OpenAI or Azure OpenAI for generation

## Notes
This file is the reference point for stack decisions while building the POC. Update it if privacy, deployment, or persistence requirements change.
