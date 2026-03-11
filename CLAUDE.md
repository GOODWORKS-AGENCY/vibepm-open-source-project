# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

VibePM — an AI-powered project scaffolding tool that takes a "brain dump" of project ideas, analyzes them via AI, and generates a complete development framework: tasks, knowledge files (WAT framework: Workflows, Agents, Tools), config files, CLAUDE.md templates, and database migrations. Output is exported as a ZIP. Projects are stored in localStorage with gamification (XP/levels).

## Commands

- `npm run dev` — Start dev server (Vite, port 8080)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm run test` — Run tests once (vitest)
- `npm run test:watch` — Run tests in watch mode
- `npx tsc --noEmit` — Type check (note: strict mode is OFF in tsconfig)

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite (SWC plugin)
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS + Framer Motion
- **Routing**: react-router-dom v6
- **State**: TanStack Query (server state), localStorage via `src/lib/store.ts` (project data)
- **Forms**: react-hook-form + zod
- **Backend**: Supabase (auth + edge functions)
- **AI**: Supabase Edge Function calling any OpenAI-compatible API (configurable via `AI_API_KEY`, `AI_GATEWAY_URL`, `AI_MODEL`)

## Architecture

### Path alias
`@/` maps to `src/` (configured in both vite.config.ts and tsconfig).

### Data flow
Projects are persisted in localStorage under key `vibepm_projects`. The store module (`src/lib/store.ts`) provides CRUD operations. Hooks in `src/hooks/useProjects.ts` wrap the store with React state. There is no server-side database for project storage — Supabase is used only for auth and the AI edge function.

### AI generation pipeline
The 4-step wizard in `src/pages/NewProject.tsx` drives project creation:
1. **Brain Dump** — User enters project name, description, and idea sections (with file upload support)
2. **Analyze** — Calls `generate-project` edge function (step: "analyze") to extract entities, modules, phases
3. **Generate** — Three sequential AI calls: tasks → knowledge files → config files
4. **Review & Save** — Saves to localStorage, navigates to project dashboard

All AI calls go through `src/lib/ai-generate.ts` → Supabase Edge Function at `supabase/functions/generate-project/index.ts`. The edge function uses tool calling (`return_result`) to get structured JSON responses.

### Templates
`src/templates/` contains TypeScript functions that generate output files (CLAUDE.md, pipeline configs, PRD JSON, rules files, etc.) from project data. These are used when exporting projects.

### Routing
- `/` — Landing page (public)
- `/auth` — Auth page (public)
- `/new` — New project wizard (protected)
- `/projects` — Project list (protected)
- `/projects/:id` — Project dashboard with nested routes: `tasks`, `knowledge`, `export` (protected)
- `/project-tracker` — Cross-project task tracker (protected)
- `/framework` — Framework documentation (public)
- `/system` — System overview (public)

Protected routes use `src/components/ProtectedRoute.tsx` with auth from `src/hooks/useAuth.tsx`.

### Auth
Supabase Auth via `src/hooks/useAuth.tsx` providing `AuthProvider` context. The Supabase client is at `src/integrations/supabase/client.ts` and reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from env.

## Testing

- Test runner: Vitest with jsdom environment
- Setup file: `src/test/setup.ts` (mocks `matchMedia`)
- Test files: `src/**/*.{test,spec}.{ts,tsx}`
- Testing libs: `@testing-library/react` + `@testing-library/jest-dom`
- Globals enabled (no need to import `describe`, `it`, `expect`)

## Tailwind

Custom theme tokens: `vibe-glow`, `vibe-cyan`, `vibe-amber`, `vibe-rose` color palette. Custom fonts: Space Grotesk (display), JetBrains Mono (mono). Dark mode via class strategy.

## Supabase Edge Function

Single edge function `generate-project` handles all AI steps via a `step` parameter. Runs on Deno. Uses `AI_API_KEY` env var (with optional `AI_GATEWAY_URL` and `AI_MODEL`). Located at `supabase/functions/generate-project/index.ts`.
